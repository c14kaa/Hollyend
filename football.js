/* Kristan's football corner: Premier League table and Arsenal matches, cached server-side by the
   `football` edge function (football-data.org) in public.football_cache. Nothing here calls the API.
   Kept deliberately light: a ticker on two pages and the odd real-numbers maths question. */

var FOOTY = { table: [], matches: [], updated: null };
var ARSENAL_ID = 57;
function setFootball(rows) {
  (rows || []).forEach(function (r) {
    if (r.key === "pl_table") { FOOTY.table = (r.data && r.data.table) || []; FOOTY.matchday = r.data && r.data.matchday; FOOTY.updated = r.updatedAt || FOOTY.updated; }
    if (r.key === "arsenal_matches") FOOTY.matches = ((r.data && r.data.matches) || []).slice().sort(function (a, b) { return String(a.at).localeCompare(String(b.at)); });
  });
}
function footyReady() { return FOOTY.table.length >= 10; }
function arsenalRow() { for (var i = 0; i < FOOTY.table.length; i++) if (FOOTY.table[i].id === ARSENAL_ID) return FOOTY.table[i]; return null; }
function ordinal(n) { var s = ["th", "st", "nd", "rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }
function arsenalLast() { var f = FOOTY.matches.filter(function (m) { return m.status === "FINISHED" && m.hs != null; }); return f[f.length - 1] || null; }
function arsenalNext() { var now = new Date().toISOString(); return FOOTY.matches.filter(function (m) { return m.status !== "FINISHED" && m.status !== "POSTPONED" && m.status !== "CANCELLED" && String(m.at) >= now; })[0] || null; }
function arsenalHome(m) { return m.homeId === ARSENAL_ID; }
function arsenalResult(m) {
  var home = arsenalHome(m), us = home ? m.hs : m.as, them = home ? m.as : m.hs, opp = home ? m.away : m.home;
  return { res: us > them ? "W" : us < them ? "L" : "D", score: us + "–" + them, opp: opp, ha: home ? "H" : "A" };
}
function uaeKick(iso) {
  var d = new Date(new Date(iso).getTime() + 4 * 3600e3);
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }) + ", " + d.toISOString().slice(11, 16) + " UAE";
}
function footyTicker() {
  if (!footyReady()) return "";
  var a = arsenalRow(), last = arsenalLast(), next = arsenalNext(), parts = [];
  if (a) parts.push("<b>Arsenal " + ordinal(a.pos) + "</b> · " + a.pts + " pts from " + a.p);
  if (last) { var r = arsenalResult(last); parts.push("Last: <b class=\"fr " + r.res + "\">" + r.res + " " + r.score + "</b> v " + r.opp + " (" + r.ha + ")"); }
  if (next) parts.push("Next: " + (arsenalHome(next) ? next.away + " (H)" : next.home + " (A)") + ", " + uaeKick(next.at) + (next.comp && next.comp !== "Premier League" ? " · " + next.comp : ""));
  return parts.length ? '<div class="ftick"><span class="ft-i" aria-hidden="true">⚽</span><span>' + parts.join(' <span class="ft-sep">|</span> ') + '</span></div>' : "";
}
function footyTableCard() {
  if (!footyReady()) return "";
  var a = arsenalRow(), rows = FOOTY.table.slice(0, 6);
  if (a && a.pos > 6) rows = rows.concat([a]);
  var tr = function (r) { return '<tr class="' + (r.id === ARSENAL_ID ? "afc" : "") + '"><td>' + r.pos + '</td><td>' + r.team + '</td><td>' + r.p + '</td><td>' + sgd(r.gd) + '</td><td><b>' + r.pts + '</b></td></tr>'; };
  var recent = FOOTY.matches.filter(function (m) { return m.status === "FINISHED" && m.hs != null; }).slice(-3).reverse().map(function (m) { var r = arsenalResult(m); return '<span class="chip fr ' + r.res + '">' + r.res + ' ' + r.score + ' v ' + r.opp + '</span>'; }).join("");
  return '<section class="card sect ftable"><h2>Premier League</h2>' + footyTicker() + '<table><thead><tr><th>#</th><th>Team</th><th>P</th><th>GD</th><th>Pts</th></tr></thead><tbody>' + rows.map(tr).join("") + '</tbody></table>' +
    (recent ? '<div class="ft-recent"><span class="small">Arsenal’s last three:</span> ' + recent + '</div>' : '') +
    '<span class="small">Updated twice a day' + (FOOTY.updated ? ' · last ' + new Date(FOOTY.updated).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : '') + '. Data: football-data.org</span></section>';
}

/* Maths with real Premier League numbers (Year 8: averages, percentages, ratio). Used sparingly. */
function d2(x) { return (Math.round(x * 100) / 100).toFixed(2); }
function sgd(n) { return n > 0 ? "+" + n : n < 0 ? "−" + (-n) : "0"; }
K.leagueMaths = function (L) {
  if (!footyReady()) return K.meanList(L);
  var a = arsenalRow(), t = Math.random() < 0.5 && a && a.p ? a : pick(FOOTY.table.filter(function (r) { return r.p > 0; }));
  var kind = pick(L === 1 ? ["gd", "ppg", "gap"] : L === 2 ? ["ppg", "winpct", "gpg", "gap"] : ["winpct", "gpg", "needed", "ppg"]);
  var name = t.team, src = " (real figures from this season's Premier League table)";
  if (kind === "gd") return q("Maths with football", name + " have scored " + t.gf + " and conceded " + t.ga + ". What is their goal difference?" + src, sgd(t.gd),
    [String(t.gf + t.ga), sgd(t.ga - t.gf), sgd(t.gd + 1)], "Goal difference = scored − conceded = " + t.gf + " − " + t.ga + " = " + sgd(t.gd) + ".", "",
    { notes: { [String(t.gf + t.ga)]: "You added them. Goal difference is scored MINUS conceded." }, steps: ["Goals for − goals against.", t.gf + " − " + t.ga + " = " + sgd(t.gd) + "."], tip: "Goal difference = GF − GA. It can be negative." });
  if (kind === "ppg") { var ppg = round2(t.pts / t.p);
    return q("Maths with football", name + " have " + t.pts + " points from " + t.p + " games. What is their mean number of points per game, to 2 d.p.?" + src, d2(ppg),
      [d2(t.p / Math.max(1, t.pts)), d2(t.pts / (t.p + 1)), d2(ppg + 0.1), String(t.pts * t.p)], "Mean = total ÷ number of games = " + t.pts + " ÷ " + t.p + " = " + d2(ppg) + ".", "",
      { notes: { [d2(t.p / Math.max(1, t.pts))]: "Upside down: divide the points by the games." }, steps: ["Mean = total ÷ how many.", t.pts + " ÷ " + t.p + " = " + d2(ppg) + "."], tip: "Points per game is a mean: total points ÷ games played." }); }
  if (kind === "winpct") { var pct = Math.round(t.w / t.p * 100);
    return q("Maths with football", name + " have won " + t.w + " of their " + t.p + " league games. What percentage is that, to the nearest whole number?" + src, pct + "%",
      [Math.round(t.p / Math.max(1, t.w)) + "%", Math.round((t.w + t.d) / t.p * 100) + "%", (pct + 5) + "%", t.w + "%"], t.w + " ÷ " + t.p + " × 100 = " + pct + "%.", "",
      { notes: { [t.w + "%"]: "That's the number of wins, not the percentage. Divide by games played, then × 100." }, steps: ["Fraction won: " + t.w + "/" + t.p + ".", "× 100 to make a percentage.", "Round: " + pct + "%."], tip: "Percentage = part ÷ whole × 100." }); }
  if (kind === "gpg") { var g = round2(t.gf / t.p);
    return q("Maths with football", name + " have scored " + t.gf + " goals in " + t.p + " games. What's the mean goals per game, to 2 d.p.?" + src, d2(g),
      [d2(t.p / Math.max(1, t.gf)), d2(t.ga / t.p), d2(g + 0.25)], t.gf + " ÷ " + t.p + " = " + d2(g) + ".", "", { steps: ["Mean = total ÷ how many.", t.gf + " ÷ " + t.p + " = " + d2(g) + "."], tip: "Mean = total ÷ number of values." }); }
  var top = FOOTY.table[0], me = a || t; if (me === top) me = FOOTY.table[1];
  if (kind === "needed" && top.pts < me.pts) kind = "gap";
  if (kind === "needed") {
    var gap = top.pts - me.pts, wins = Math.ceil((gap + 1) / 3);
    return q("Maths with football", me.team + " are on " + me.pts + " points; " + top.team + " lead with " + top.pts + ". If " + top.team + " lose every game, what's the fewest wins " + me.team + " need to go above them?" + src, String(wins),
      [String(Math.floor(gap / 3)), String(gap), String(wins + 1)].filter(function (x) { return x !== String(wins); }), "A win is worth 3 points. They need more than " + gap + " points: " + wins + " wins = " + wins * 3 + " points.", "",
      { steps: ["Gap: " + top.pts + " − " + me.pts + " = " + gap + ".", "Need MORE than " + gap + ", so at least " + (gap + 1) + " points.", "3 points per win: " + (gap + 1) + " ÷ 3, rounded up = " + wins + "."], tip: "'Go above' means beat the total, not equal it." }); }
  var other = pick(FOOTY.table.filter(function (r) { return r.id !== t.id; })), d = Math.abs(t.pts - other.pts);
  return q("Maths with football", name + " have " + t.pts + " points and " + other.team + " have " + other.pts + ". What is the difference?" + src, String(d),
    [String(t.pts + other.pts), String(d + 3), String(Math.max(0, d - 1))].filter(function (x) { return x !== String(d); }), "Difference = bigger − smaller = " + Math.max(t.pts, other.pts) + " − " + Math.min(t.pts, other.pts) + " = " + d + ".", "",
    { steps: ["Take the smaller from the bigger.", Math.max(t.pts, other.pts) + " − " + Math.min(t.pts, other.pts) + " = " + d + "."] });
};
/* One slot in Kristan's 20–28 slot weekly mix, so roughly one question in every one or two quizzes. */
if (typeof WEEK !== "undefined" && WEEK.kristan && WEEK.kristan.topics.indexOf("leagueMaths") < 0) WEEK.kristan.topics.push("leagueMaths");
if (typeof REVISION !== "undefined") REVISION.kristan.push({ id: "league-maths", title: "Maths with real Premier League numbers", subject: "Maths", covered: "Averages & percentages, using this season's table", gens: ["leagueMaths", "meanList", "freqMean"] });
if (typeof module !== "undefined") Object.assign(module.exports, { FOOTY: FOOTY, setFootball: setFootball, footyTicker: footyTicker });
