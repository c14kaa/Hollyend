// Hollyend push notifications.
// Actions (POST JSON):
//   {action:"key"}                     -> {publicKey}  (creates the VAPID keys the first time; the private key never leaves the database)
//   {action:"test"}  + user's JWT      -> sends a test notification to that user's devices
//   {action:"run", kind}  + x-cron-secret -> to the children: "homework" (due by tomorrow or overdue), "daily" (daily tasks + tomorrow's events), "new" (homework added in the last 2 hours);
//                                            to parents: "done" + homework_id (a child finished homework), "parents" (evening round-up)
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

const NAME: Record<string, string> = { millie: "Millie", kristan: "Kristan", both: "Both" };
async function parentSubs() { const { data } = await db.from("push_subs").select("*").is("child", null); return data || []; }

async function homeworkDone(cfg: any, id: string) {
  const { data: h } = await db.from("homework").select("*").eq("id", id).single();
  const { data: d } = await db.from("homework_done").select("*").eq("homework_id", id).single();
  if (!h || !d) return { parents: "nothing to send" };
  const who = NAME[h.child] || h.child;
  const payload = d.status === "verified"
    ? { title: who + " finished homework", body: h.title + ": checked by Hollyend. +" + d.points + " points.", url: "/#family", tag: "done-" + id }
    : { title: who + " ticked off homework", body: h.title + (d.feel ? " (felt " + (d.feel === "ok" ? "OK" : d.feel) + ")" : "") + ". Tap to confirm or send back.", url: "/#family", tag: "done-" + id };
  return { parents: await deliver(cfg, await parentSubs(), payload) };
}

async function parentsRoundup(cfg: any) {
  const today = dubaiDay(0), tomorrow = dubaiDay(1), soon = dubaiDay(2), parts: string[] = [];
  const { data: hw } = await db.from("homework").select("*").eq("active", true);
  const { data: done } = await db.from("homework_done").select("homework_id,status");
  const mark = new Map((done || []).map((d: any) => [d.homework_id, d.status]));
  const waiting = (hw || []).filter((h: any) => mark.get(h.id) === "ticked");
  if (waiting.length) parts.push(waiting.length + " homework to check");
  for (const c of ["millie", "kristan"]) {
    const open = (hw || []).filter((h: any) => h.child === c && h.due && (!mark.has(h.id) || mark.get(h.id) === "rejected"));
    const late = open.filter((h: any) => h.due < today).length, due = open.filter((h: any) => h.due === today || h.due === tomorrow).length;
    if (late || due) parts.push(NAME[c] + ": " + [due ? due + " due by tomorrow" : "", late ? late + " overdue" : ""].filter(Boolean).join(", "));
  }
  const { data: todos } = await db.from("events").select("*").eq("type", "action").eq("done", false).eq("active", true).lte("date", soon);
  if (todos && todos.length) parts.push("To do: " + todos.slice(0, 2).map((e: any) => e.title).join("; ") + (todos.length > 2 ? " +" + (todos.length - 2) + " more" : ""));
  const { data: evs } = await db.from("events").select("*").eq("active", true).neq("type", "news").neq("type", "action").lte("date", tomorrow).or("end_date.gte." + tomorrow + ",date.eq." + tomorrow);
  if (evs && evs.length) parts.push("Tomorrow: " + evs.map((e: any) => (e.child === "both" ? "" : NAME[e.child] + " – ") + e.title + (e.bring ? " (bring " + e.bring + ")" : "")).join("; "));
  if (!parts.length) return { parents: "nothing to send" };
  return { parents: await deliver(cfg, await parentSubs(), { title: "Tonight's round-up", body: parts.join(". ").slice(0, 240) + ".", url: "/#family", tag: "roundup" }) };
}

async function run(cfg: any, kind: string) {
  const out: Record<string, unknown> = {};
  for (const child of ["millie", "kristan"]) {
    let payload: any = null;
    if (kind === "homework") {
      const today = dubaiDay(0), tomorrow = dubaiDay(1);
      const list = (await pendingHomework(child)).filter((h: any) => h.due && h.due <= tomorrow);
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
      const tomorrow = dubaiDay(1);
      const { data: evs } = await db.from("events").select("*").in("child", [child, "both"]).eq("audience", "family").neq("type", "news").eq("active", true).eq("done", false).lte("date", tomorrow).or("end_date.gte." + tomorrow + ",date.eq." + tomorrow);
      const parts: string[] = [];
      if (left.length) parts.push("Don't forget: " + left.map((t: any) => t.title.replace(/:.*/, "")).join(", ") + ".");
      if (evs && evs.length) parts.push("Tomorrow: " + evs.map((e: any) => e.title + (e.time ? " (" + e.time + ")" : "") + (e.bring ? ". Bring: " + e.bring : "")).join("; ") + ".");
      if (parts.length) payload = { title: left.length ? "Before bed" : "Tomorrow", body: parts.join(" ").slice(0, 230), url: evs && evs.length && !left.length ? "/#calendar" : "/#homework", tag: "daily" };
    } else if (kind === "nudge") {
      // 7:30pm every night: a friendly nudge to open Hollyend for homework and a quiz.
      const today = dubaiDay(0);
      const open = await pendingHomework(child);
      const { count: quizzes } = await db.from("attempts").select("id", { count: "exact", head: true }).eq("child", child).eq("play_day", today);
      const hw = open.length ? open.length + " homework to do" : "";
      if (child === "millie") {
        const body = open.length ? "You've got " + hw + ", then a quick quiz to keep your streak going. Uuh Uuh has saved you a banana!"
          : !quizzes ? "Time for today's quiz! One go keeps your streak alive. Ooh Ooh is warming up his brain."
          : "Brilliant work today! Fancy a game in the Space Arcade before bed?";
        payload = { title: "Ooh Ooh and Uuh Uuh are waiting! 🐵", body, url: open.length ? "/#homework" : "/", tag: "nudge" };
      } else {
        const body = [hw, !quizzes ? "today's quiz keeps your streak going" : "quiz done today, nice one"].filter(Boolean).join(" · ");
        payload = { title: "Hollyend check-in", body: body.charAt(0).toUpperCase() + body.slice(1) + ".", url: open.length ? "/#homework" : "/", tag: "nudge" };
      }
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
      const kind = String(body.kind || "homework");
      if (kind === "done") return json(await homeworkDone(cfg, String(body.homework_id || "")));
      if (kind === "parents") return json(await parentsRoundup(cfg));
      return json(await run(cfg, kind));
    }
    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    console.log("error", String(e));
    return json({ error: "Something went wrong" }, 500);
  }
});
