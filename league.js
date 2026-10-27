/* ===== Kristan's league =====
   A 20-club league with one matchday per Abu Dhabi day. Kristan's club (Hollyend FC) plays its match by
   answering 5 questions; every other fixture is simulated by computer clubs. Everything is worked out from the
   saved results with a seeded random generator, so the table is the same on every device and can't be replayed.
   19 matchdays a season (every club plays every other once); top 3 go up, bottom 3 go down.
   Kristan's match: each question is an attack (right = Hollyend scores) or a defence (wrong = they score).
   Stronger opponents mean more defence questions, so goal difference = answers right minus defence questions. No luck involved. */
var LEAGUE = {
  start: "2026-10-27", length: 19,
  team: { name: "Hollyend FC", code: "HOL" },
  divisions: [
    { id: "d2", name: "Division Two", tier: 3, level: 2, up: 3, down: 0, teams: [
      ["Ashcombe Rovers", "ASH", 71], ["Brackenfield Town", "BRK", 66], ["Carrow Vale", "CAR", 54], ["Dunmere United", "DUN", 69],
      ["Elmsworth Athletic", "ELM", 58], ["Fenwick Albion", "FEN", 62], ["Greyhaven City", "GRY", 74], ["Hartmoor Town", "HRT", 50],
      ["Kingsmere Wanderers", "KGM", 64], ["Lowther Vale", "LOW", 56], ["Marrowby United", "MAR", 67], ["Northgate Athletic", "NTG", 60],
      ["Oakhurst Town", "OAK", 52], ["Penmoor City", "PEN", 72], ["Quarrydale", "QRY", 48], ["Redbourne Rovers", "RED", 61],
      ["Saltmarsh United", "SLT", 57], ["Thornleigh Albion", "THR", 63], ["Wexcombe Town", "WEX", 53]] },
    { id: "d1", name: "Division One", tier: 2, level: 3, up: 3, down: 3, teams: [
      ["Avonmere City", "AVM", 80], ["Bramblecote United", "BRA", 72], ["Castlereach", "CAS", 66], ["Draymoor Athletic", "DRA", 75],
      ["Eastholme Town", "EAS", 63], ["Falconbridge Rovers", "FAL", 78], ["Glenhaven United", "GLN", 70], ["Hollowfield City", "HOW", 82],
      ["Irongate Albion", "IRN", 61], ["Kingsbarrow", "KNB", 68], ["Longmarsh Town", "LNG", 59], ["Moorcastle United", "MOC", 76],
      ["Newbrook Athletic", "NWB", 64], ["Ormsby Vale", "ORM", 58], ["Portwell City", "POR", 73], ["Ravensmoor", "RAV", 69],
      ["Stanmoor Rovers", "STA", 62], ["Tidewater Town", "TID", 67], ["Westermere United", "WST", 71]] },
    { id: "pd", name: "Premier Division", tier: 1, level: 3, up: 0, down: 3, teams: [
      ["Albermarle City", "ALB", 92], ["Blackmoor United", "BLM", 88], ["Crownford City", "CRF", 85], ["Drakesford United", "DRK", 79],
      ["Everwood Athletic", "EVW", 74], ["Foxmoor City", "FOX", 83], ["Harrowmere", "HRM", 71], ["Kingsford United", "KNF", 90],
      ["Lionsgate City", "LIO", 77], ["Marlowe Athletic", "MRL", 73], ["Northmoor United", "NMR", 80], ["Pemberley Rovers", "PEM", 69],
      ["Queensmere", "QNM", 75], ["Redmarsh City", "RDM", 86], ["Sterling Athletic", "STE", 70], ["Thamesmoor United", "THM", 81],
      ["Valemont Albion", "VAL", 72], ["Whitecliffe", "WCL", 76], ["Yorkmere", "YRK", 68]] }
  ]
};

function lgHash(str) { var h = 1779033703 ^ str.length; for (var i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; } return function () { h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return (h ^= h >>> 16) >>> 0; }; }
function lgRng(seed) { var a = lgHash(String(seed))(); return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function lgPoisson(lambda, rnd) { var L = Math.exp(-lambda), k = 0, p = 1; do { k++; p *= rnd(); } while (p > L && k < 12); return k - 1; }
function lgDay(day, n) { var d = new Date(day + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
function lgDiff(a, b) { return Math.round((Date.parse(a + "T00:00:00Z") - Date.parse(b + "T00:00:00Z")) / 864e5); }
function lgToday(now) { var ms = now == null ? Date.now() : typeof now === "number" ? now : Date.parse(now); return new Date(ms + 4 * 3600e3).toISOString().slice(0, 10); }

/* Clubs for a season: index 0 is always Hollyend FC; ratings wobble a little each season. */
function lgClubs(season, div) {
  var D = LEAGUE.divisions[div], rnd = lgRng("clubs|" + season + "|" + D.id);
  var mid = D.teams.reduce(function (s, t) { return s + t[2]; }, 0) / D.teams.length;
  var clubs = [{ name: LEAGUE.team.name, code: LEAGUE.team.code, rating: mid, me: true }];
  D.teams.forEach(function (t) { clubs.push({ name: t[0], code: t[1], rating: t[2] + Math.round((rnd() - 0.5) * 8) }); });
  return { clubs: clubs, mid: mid };
}
/* Double round robin (circle method), shuffled per season. rounds[r] = [[home, away], ...] */
function lgSchedule(season, div) {
  var rnd = lgRng("sched|" + season + "|" + div), arr = [0];
  var rest = []; for (var i = 1; i < 20; i++) rest.push(i);
  for (var j = rest.length - 1; j > 0; j--) { var k = Math.floor(rnd() * (j + 1)), t = rest[j]; rest[j] = rest[k]; rest[k] = t; }
  arr = arr.concat(rest);
  var first = [];
  for (var r = 0; r < 19; r++) {
    var pairs = [];
    for (var p = 0; p < 10; p++) {
      var a = arr[p], b = arr[19 - p];
      pairs.push(p === 0 ? (r % 2 === 0 ? [a, b] : [b, a]) : ((r + p) % 2 === 0 ? [a, b] : [b, a]));
    }
    first.push(pairs);
    arr = [arr[0], arr[19]].concat(arr.slice(1, 19));
  }
  return first;
}
function clampL(x) { return Math.max(0.15, Math.min(3.6, x)); }
function lgSimOther(h, a, C, seed) {
  var rnd = lgRng(seed), rh = C.clubs[h].rating, ra = C.clubs[a].rating;
  return [lgPoisson(clampL(1.4 * Math.exp((rh - ra) / 24)), rnd), lgPoisson(clampL(1.1 * Math.exp((ra - rh) / 24)), rnd)];
}
/* Kristan's match: how many defence questions (1-3) depends on how strong the opponent is this season. */
var LG_DEFS = { d2: [3, 2, 1], d1: [3, 3, 2], pd: [4, 3, 2] }; /* top six, middle seven, bottom six */
function lgDefs(C, opp, div) {
  var D = LG_DEFS[LEAGUE.divisions[div || 0].id];
  var others = C.clubs.slice(1).map(function (c) { return c.rating; }).sort(function (a, b) { return b - a; });
  var rank = others.indexOf(C.clubs[opp].rating);
  return rank < 6 ? D[0] : rank < 13 ? D[1] : D[2];
}
var LG_TEMPLATES = { 1: ["AADAA", "ADAAA", "AAADA"], 2: ["ADADA", "ADAAD", "DAADA"], 3: ["DADAD", "ADDAD", "DAADD"], 4: ["DDADD", "DADDD", "DDDAD"] };
function lgPattern(season, div, r, defs) {
  var rnd = lgRng("pat|" + season + "|" + div + "|" + r), t = LG_TEMPLATES[defs][Math.floor(rnd() * 3)], base = [5, 23, 41, 61, 79];
  return t.split("").map(function (c, i) { return { type: c, min: base[i] + Math.floor(rnd() * 14) }; });
}
function lgMinute(m) { return m > 90 ? "90+" + (m - 90) + "\u2032" : m + "\u2032"; }
function lgMyResult(oks, pattern) {
  var gf = 0, ga = 0;
  pattern.forEach(function (q, i) { var ok = !!oks[i]; if (q.type === "A" && ok) gf++; if (q.type === "D" && !ok) ga++; });
  return [gf, ga];
}

/* How Kristan's match on a given day went: played (attempt or 5 server-marked answers), unfinished, or missed (0-3 forfeit). */
function lgMyScore(day, today, attempts, matches) {
  var at = attempts.filter(function (a) { return a.child === "kristan" && a.mode === "match" && (a.playDay || lgToday(a.at)) === day; })[0];
  if (at) return { status: "played", oks: (at.results || []).map(function (r) { return !!r.ok; }) };
  var m = matches.filter(function (x) { return x.child === "kristan" && x.playDay === day; })[0];
  var ans = m && m.answers || [], oks = ans.map(function (x) { return !!x.ok; });
  if (m && ans.length >= 5) return { status: "played", oks: oks };
  if (day < today) return m ? { status: "played", oks: oks, unfinished: true } : { status: "missed", forfeit: true };
  if (m) return { status: "live", answered: ans.length, oks: oks };
  return { status: "todo" };
}

function lgSeason(season, div, today, attempts, matches) {
  var C = lgClubs(season, div), R = lgSchedule(season, div), startDay = lgDay(LEAGUE.start, season * LEAGUE.length);
  var rows = C.clubs.map(function (c, i) { return { i: i, name: c.name, code: c.code, me: !!c.me, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0, form: [] }; });
  var rounds = [], snapshots = [];
  for (var r = 0; r < LEAGUE.length; r++) {
    var day = lgDay(startDay, r), mine = lgMyScore(day, today, attempts, matches);
    var open = day < today || (day === today && mine.status === "played");
    var fx = R[r].map(function (pr, k) {
      var f = { home: pr[0], away: pr[1], mine: pr[0] === 0 || pr[1] === 0 };
      if (f.mine) { f.defs = lgDefs(C, pr[0] === 0 ? pr[1] : pr[0], div); f.pattern = lgPattern(season, div, r, f.defs); }
      if (!open) return f;
      if (f.mine) {
        var home = pr[0] === 0, g = mine.forfeit ? [0, 3] : lgMyResult(mine.oks, f.pattern);
        f.hg = home ? g[0] : g[1]; f.ag = home ? g[1] : g[0]; f.oks = mine.oks || []; f.s = f.oks.filter(Boolean).length; f.missed = !!mine.forfeit; f.unfinished = !!mine.unfinished;
      } else { var g2 = lgSimOther(pr[0], pr[1], C, "o|" + season + "|" + div + "|" + r + "|" + k); f.hg = g2[0]; f.ag = g2[1]; }
      return f;
    });
    if (open) {
      fx.forEach(function (f) {
        var H = rows[f.home], A = rows[f.away]; H.p++; A.p++; H.gf += f.hg; H.ga += f.ag; A.gf += f.ag; A.ga += f.hg;
        if (f.hg > f.ag) { H.w++; A.l++; H.pts += 3; H.form.push("W"); A.form.push("L"); }
        else if (f.hg < f.ag) { A.w++; H.l++; A.pts += 3; A.form.push("W"); H.form.push("L"); }
        else { H.d++; A.d++; H.pts++; A.pts++; H.form.push("D"); A.form.push("D"); }
      });
      snapshots.push(lgOrder(rows).map(function (x) { return x.i; }));
    }
    rounds.push({ r: r, day: day, open: open, fixtures: fx, mine: mine });
  }
  var table = lgOrder(rows).map(function (x, pos) {
    var prev = snapshots.length > 1 ? snapshots[snapshots.length - 2].indexOf(x.i) : pos;
    return Object.assign({}, x, { pos: pos + 1, move: prev - pos, gd: x.gf - x.ga, form: x.form.slice(-5) });
  });
  return { season: season, div: div, division: LEAGUE.divisions[div], clubs: C.clubs, startDay: startDay, endDay: lgDay(startDay, LEAGUE.length - 1), rounds: rounds, table: table, played: snapshots.length };
}
function lgOrder(rows) { return rows.slice().sort(function (a, b) { return b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf || a.name.localeCompare(b.name); }); }

/* The whole career up to today: which division each season, honours, and this season in detail. */
function leagueState(attempts, matches, now) {
  var today = lgToday(now), since = lgDiff(today, LEAGUE.start);
  if (since < 0) since = 0;
  var cur = Math.floor(since / LEAGUE.length), div = 0, honours = [];
  for (var s = 0; s < cur; s++) {
    var done = lgSeason(s, div, today, attempts, matches), me = done.table.filter(function (x) { return x.me; })[0], D = LEAGUE.divisions[div];
    var h = { season: s + 1, division: D.name, pos: me.pos, pts: me.pts, outcome: "" };
    if (me.pos === 1) h.outcome = D.up ? "Champions · promoted" : "Champions";
    if (D.up && me.pos <= D.up) { if (!h.outcome) h.outcome = "Promoted"; div++; }
    else if (D.down && me.pos > 20 - D.down) { h.outcome = "Relegated"; div--; }
    honours.push(h);
  }
  var S = lgSeason(cur, div, today, attempts, matches), r = Math.min(LEAGUE.length - 1, since - cur * LEAGUE.length), round = S.rounds[r];
  var myFx = round.fixtures.filter(function (f) { return f.mine; })[0], home = myFx.home === 0;
  var mine = S.rounds.map(function (rd) { var f = rd.fixtures.filter(function (x) { return x.mine; })[0], h = f.home === 0;
    return { matchday: rd.r + 1, day: rd.day, home: h, opp: S.clubs[h ? f.away : f.home], open: rd.open, gf: rd.open ? (h ? f.hg : f.ag) : null, ga: rd.open ? (h ? f.ag : f.hg) : null, s: f.s, missed: f.missed, unfinished: f.unfinished, status: rd.mine.status, defs: f.defs }; });
  return { today: today, seasonNo: cur + 1, season: S, division: S.division, matchday: r + 1, round: round, home: home, opponent: S.clubs[home ? myFx.away : myFx.home],
    status: round.mine.status, answered: round.mine.answered || 0, pattern: myFx.pattern, defs: myFx.defs, liveOks: round.mine.oks || [], myRow: S.table.filter(function (x) { return x.me; })[0], mine: mine, honours: honours, level: S.division.level };
}
function lgResultLetter(gf, ga) { return gf > ga ? "W" : gf < ga ? "L" : "D"; }

if (typeof module !== "undefined" && module.exports) module.exports = { LEAGUE: LEAGUE, leagueState: leagueState, lgSeason: lgSeason, lgSchedule: lgSchedule, lgPattern: lgPattern, lgMyResult: lgMyResult, lgMinute: lgMinute, lgDefs: lgDefs, lgClubs: lgClubs, lgToday: lgToday, lgDay: lgDay, lgResultLetter: lgResultLetter };
