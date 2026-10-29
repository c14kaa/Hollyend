// Hollyend push notifications.
// Actions (POST JSON):
//   {action:"key"}                     -> {publicKey}  (creates the VAPID keys the first time; the private key never leaves the database)
//   {action:"test"}  + user's JWT      -> sends a test notification to that user's devices
//   {action:"run", kind}  + x-cron-secret -> kind "homework" (due today/tomorrow), "daily" (Millie's daily tasks), "new" (homework added in the last 2 hours)
import { createClient } from "jsr:@supabase/supabase-js@2";
import { generateVapidKeys, sendPush } from "./webpush.js";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const json = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status, headers: { ...CORS, "Content-Type": "application/json" } });
const SITE = "https://hollyend.vercel.app";

async function config() {
  const { data, error } = await db.from("push_config").select("*").eq("id", 1).single();
  if (error) throw error;
  if (!data.public_key) {
    const k = await generateVapidKeys();
    const up = await db.from("push_config").update({ public_key: k.publicKey, private_jwk: k.privateJwk }).eq("id", 1).is("public_key", null).select("*").single();
    if (up.data) return up.data;
    return (await db.from("push_config").select("*").eq("id", 1).single()).data;
  }
  return data;
}
function dubaiDay(offsetDays = 0) { return new Date(Date.now() + 4 * 3600e3 + offsetDays * 864e5).toISOString().slice(0, 10); }
function niceDay(d: string) { return new Date(d + "T12:00:00Z").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }); }

async function deliver(cfg: any, subs: any[], payload: unknown) {
  const vapid = { publicKey: cfg.public_key, privateJwk: cfg.private_jwk, subject: SITE };
  let sent = 0, removed = 0;
  for (const s of subs) {
    try {
      const r = await sendPush(s, payload, vapid);
      if (r.status === 404 || r.status === 410) { await db.from("push_subs").delete().eq("id", s.id); removed++; }
      else if (r.status < 300) sent++;
      else console.log("push failed", r.status, r.text.slice(0, 200));
    } catch (e) { console.log("push error", String(e)); }
  }
  return { sent, removed };
}

async function pendingHomework(child: string) {
  const { data: hw } = await db.from("homework").select("*").eq("child", child).eq("active", true);
  const { data: done } = await db.from("homework_done").select("homework_id,status").eq("child", child);
  const doneIds = new Set((done || []).filter((d: any) => d.status !== "rejected").map((d: any) => d.homework_id));
  return (hw || []).filter((h: any) => !doneIds.has(h.id));
}

async function run(cfg: any, kind: string) {
  const out: Record<string, unknown> = {};
  for (const child of ["millie", "kristan"]) {
    let payload: any = null;
    if (kind === "homework") {
      const today = dubaiDay(0), tomorrow = dubaiDay(1), weekAgo = dubaiDay(-7);
      const list = (await pendingHomework(child)).filter((h: any) => h.due && h.due >= weekAgo && h.due <= tomorrow);
      if (list.length) {
        const late = list.filter((h: any) => h.due < today), now = list.filter((h: any) => h.due === today), next = list.filter((h: any) => h.due === tomorrow);
        const parts = [];
        if (late.length) parts.push("Overdue: " + late.map((h: any) => h.title).join(", "));
        if (now.length) parts.push("Due today: " + now.map((h: any) => h.title).join(", "));
        if (next.length) parts.push("Due tomorrow: " + next.map((h: any) => h.title).join(", "));
        payload = { title: "Homework reminder", body: parts.join(". ").slice(0, 220), url: "/#homework", tag: "homework" };
      }
    } else if (kind === "daily") {
      const { data: tasks } = await db.from("daily_tasks").select("*").eq("child", child).eq("active", true).order("sort");
      const { data: ticks } = await db.from("daily_ticks").select("task").eq("child", child).eq("day", dubaiDay(0));
      const ticked = new Set((ticks || []).map((t: any) => t.task));
      const left = (tasks || []).filter((t: any) => !ticked.has(t.id));
      if (left.length) payload = { title: "Before bed", body: "Don't forget: " + left.map((t: any) => t.title.replace(/:.*/, "")).join(", ") + ".", url: "/#homework", tag: "daily" };
    } else if (kind === "new") {
      const since = new Date(Date.now() - 2 * 3600e3).toISOString();
      const { data: fresh } = await db.from("homework").select("*").eq("child", child).eq("active", true).gte("created_at", since);
      if (fresh && fresh.length) payload = { title: fresh.length === 1 ? "New homework" : fresh.length + " new homework tasks",
        body: fresh.map((h: any) => h.title + (h.due ? " (due " + niceDay(h.due) + ")" : "")).join(", ").slice(0, 220), url: "/#homework", tag: "new-homework" };
    }
    if (!payload) { out[child] = "nothing to send"; continue; }
    const { data: subs } = await db.from("push_subs").select("*").eq("child", child);
    out[child] = await deliver(cfg, subs || [], payload);
  }
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    const body = await req.json().catch(() => ({}));
    const cfg = await config();
    if (body.action === "key") return json({ publicKey: cfg.public_key });
    if (body.action === "test") {
      const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
      const { data: u } = await db.auth.getUser(token);
      if (!u?.user) return json({ error: "Please sign in again." }, 401);
      const { data: subs } = await db.from("push_subs").select("*").eq("user_id", u.user.id);
      if (!subs?.length) return json({ error: "Reminders aren't switched on for this login yet." }, 400);
      return json(await deliver(cfg, subs, { title: "Hollyend reminders are on", body: "You'll get a nudge when homework is due. Good luck!", url: "/#homework", tag: "test" }));
    }
    if (body.action === "run") {
      if (req.headers.get("x-cron-secret") !== cfg.cron_secret) return json({ error: "Not allowed" }, 403);
      return json(await run(cfg, String(body.kind || "homework")));
    }
    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    console.log("error", String(e));
    return json({ error: "Something went wrong" }, 500);
  }
});
