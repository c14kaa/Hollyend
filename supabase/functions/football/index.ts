// Hollyend football feed for Kristan: Premier League table, Arsenal's recent and upcoming matches, FPL deadlines
// and his own Sunday league (U13 Division 2).
// Called by pg_cron twice a day (header x-cron-secret). Uses football-data.org's free tier with the
// FOOTBALL_DATA_KEY secret (added by Harps in Supabase > Edge Functions > Secrets). Results are cached in
// public.football_cache so the site never calls the API itself.
import { createClient } from "jsr:@supabase/supabase-js@2";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const json = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status, headers: { "Content-Type": "application/json" } });
const API = "https://api.football-data.org/v4";
const ARSENAL = 57;

async function get(path: string, key: string) {
  const r = await fetch(API + path, { headers: { "X-Auth-Token": key } });
  if (!r.ok) throw new Error(path + " -> " + r.status + " " + (await r.text()).slice(0, 200));
  return r.json();
}

// Kristan's own Sunday league: Manchester City Abu Dhabi League, U13 Division 2 (SportStack public API, no key).
// His team is La Liga Academy Abu Dhabi White. Optional: a failure here never stops the Premier League part.
const SS = "https://api.sportstack.ai/api/v1/public/";
const SS_COMP = "manchester-city-abu-dhabi-league-202627", SS_LEAGUE = 416;
async function ssGet(path: string) {
  const r = await fetch(SS + path, { headers: { "Accept": "application/json", "User-Agent": "Mozilla/5.0 Hollyend" } });
  if (!r.ok) throw new Error("sportstack " + path + " -> " + r.status);
  return (await r.json()).data;
}
async function kidsLeague() {
  const view = await ssGet(`leagues/view/${SS_LEAGUE}`);
  const g = (view.groups || [])[0] || {};
  const table = (g.table || []).map((r: any, i: number) => {
    const s = r.stats || {};
    return { pos: i + 1, id: r.team?.id, team: r.team?.name, p: s.total_matches ?? 0, w: s.total_wins ?? 0, d: s.total_draws ?? 0, l: s.total_losses ?? 0,
      gf: s.total_goals ?? 0, ga: s.total_conceded ?? 0, gd: (s.total_goals ?? 0) - (s.total_conceded ?? 0), pts: s.total_points ?? 0, form: s.form || [] };
  });
  const sched = await ssGet(`competitions/${SS_COMP}/schedule`);
  const weeks = (sched || []).filter((w: any) => (w.fixtures || []).some((f: any) => f.league_id === SS_LEAGUE)).map((w: any) => w.id);
  const matches: any[] = [];
  for (const w of weeks) {
    for (const x of (await ssGet(`fixtures?league_id=${SS_LEAGUE}&week_id=${w}`)) || []) {
      matches.push({ date: x.date, time: x.start_at, home: x.home_team_name, away: x.away_team_name, homeId: x.home_team_id, awayId: x.away_team_id,
        hs: x.has_finished ? x.home_team_score : null, as: x.has_finished ? x.away_team_score : null, pitch: x.pitch_name, venue: x.location_name,
        finished: !!x.has_finished, canceled: !!x.is_canceled, postponed: !!x.is_postponed, week: x.week_name,
        video: x.smartrunners_status === "isRecorded" });
    }
  }
  matches.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  return { league: "U13 Division 2", competition: "Man City Abu Dhabi League", team: "La Liga Academy Abu Dhabi White", table, matches };
}
const day = (offset: number) => new Date(Date.now() + offset * 864e5).toISOString().slice(0, 10);

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  const { data: cfg } = await db.from("push_config").select("cron_secret").eq("id", 1).single();
  if (!cfg || req.headers.get("x-cron-secret") !== cfg.cron_secret) return json({ error: "forbidden" }, 403);
  const key = Deno.env.get("FOOTBALL_DATA_KEY");
  if (!key) return json({ ok: false, reason: "FOOTBALL_DATA_KEY secret not set yet" });
  try {
    const st = await get("/competitions/PL/standings", key);
    const total = (st.standings || []).find((s: any) => s.type === "TOTAL") || (st.standings || [])[0];
    const table = (total?.table || []).map((r: any) => ({
      pos: r.position, team: r.team?.shortName || r.team?.name, tla: r.team?.tla, id: r.team?.id,
      p: r.playedGames, w: r.won, d: r.draw, l: r.lost, gf: r.goalsFor, ga: r.goalsAgainst, gd: r.goalDifference, pts: r.points, form: r.form || null,
    }));
    const m = await get(`/teams/${ARSENAL}/matches?dateFrom=${day(-40)}&dateTo=${day(40)}`, key);
    const matches = (m.matches || []).map((x: any) => ({
      at: x.utcDate, status: x.status, comp: x.competition?.name, home: x.homeTeam?.shortName || x.homeTeam?.name, away: x.awayTeam?.shortName || x.awayTeam?.name,
      homeId: x.homeTeam?.id, awayId: x.awayTeam?.id, hs: x.score?.fullTime?.home ?? null, as: x.score?.fullTime?.away ?? null, matchday: x.matchday ?? null,
    }));
    const now = new Date().toISOString();
    // Fantasy Premier League gameweek deadlines (public feed, no key). Optional: never stops the rest.
    let fpl: any = null;
    try {
      const r = await fetch("https://fantasy.premierleague.com/api/bootstrap-static/", { headers: { "User-Agent": "Mozilla/5.0 Hollyend" } });
      if (r.ok) { const b = await r.json(); fpl = (b.events || []).map((e: any) => ({ gw: e.id, name: e.name, deadline: e.deadline_time, current: e.is_current, next: e.is_next, finished: e.finished })); }
      else console.log("fpl status", r.status);
    } catch (e) { console.log("fpl error", String(e)); }
    let kids: any = null;
    try { kids = await kidsLeague(); await db.from("football_cache").upsert([{ key: "kids_league", data: kids, updated_at: now }]); }
    catch (e) { console.log("kids league error", String(e)); }
    if (fpl) await db.from("football_cache").upsert([{ key: "fpl_events", data: { events: fpl }, updated_at: now }]);
    const up = await db.from("football_cache").upsert([
      { key: "pl_table", data: { season: st.season?.startDate?.slice(0, 4) || null, matchday: st.season?.currentMatchday || null, table }, updated_at: now },
      { key: "arsenal_matches", data: { matches }, updated_at: now },
    ]);
    if (up.error) throw up.error;
    return json({ ok: true, teams: table.length, matches: matches.length, fpl: fpl ? fpl.length : 0, kidsLeague: kids ? { teams: kids.table.length, matches: kids.matches.length } : null });
  } catch (e) {
    console.log("football error", String(e));
    return json({ ok: false, error: String(e) }, 500);
  }
});
