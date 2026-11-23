/* ===== Progress, awards and comeback questions (pure functions, no DOM) ===== */
var STATIC_GENS = { modalGap: 1, speech: 1, moonPhases: 1, frGrammar: 1, polyProps: 1, poetry: 1, homophone: 1, space: 1, bestAverage: 1, science: 1, states: 1, materials: 1, mixtures: 1, grammar: 1 };
var LEVEL_MULT = { 1: 1, 2: 1.5, 3: 2 };
/* Points per quiz. The server (private.guard_attempt) uses the same numbers; change both together. */
var POINTS = { perRight: 5, comeback: 3, perfect: 10 };

var RANKS = {
  millie: [
    [0, "Space Cadet"], [250, "Rocket Pilot"], [700, "Astronaut"], [2000, "Mission Commander"],
    [4000, "Galaxy Explorer"], [7500, "Solaris Legend"]
  ],
  kristan: [
    [0, "Academy Prospect"], [1000, "Youth Team"], [2500, "Reserve Squad"], [5000, "First-Team Squad"], [8000, "Regular Starter"],
    [12000, "Vice-Captain"], [17000, "Captain"], [23000, "Club Legend"], [30000, "World Class"]
  ]
};

var BADGES = [
  { id: "first", name: "Off the mark", desc: "Finish your first quiz" },
  { id: "hattrick", name: "Hat-trick", desc: "Finish 3 quizzes in one week" },
  { id: "five", name: "Five-a-day", desc: "Finish 5 quizzes altogether" },
  { id: "run5", name: "On a roll", desc: "Get 5 right in a row" },
  { id: "perfect", name: "Perfect 10", desc: "Score 10 out of 10" },
  { id: "comeback", name: "Comeback", desc: "Get a skill right that you missed before" },
  { id: "comeback5", name: "Bounce back", desc: "Win 5 comeback questions" },
  { id: "master", name: "Topic master", desc: "Get the same skill right 3 times running" },
  { id: "core", name: "Levelling up", desc: "Score 7+ on Core" },
  { id: "challenge", name: "Challenge accepted", desc: "Score 7+ on Challenge" },
  { id: "alllevels", name: "Full set", desc: "Finish Warm-up, Core and Challenge in one week" },
  { id: "improver", name: "Most improved", desc: "Beat your first score of the week by 3 or more" },
  { id: "streak3", name: "Three in a row", desc: "Keep a 3-day streak" },
  { id: "streak7", name: "Week-long streak", desc: "Keep a 7-day streak" },
  { id: "streak14", name: "Fortnight streak", desc: "Keep a 14-day streak" },
  { id: "streak30", name: "Unstoppable", desc: "Keep a 30-day streak" },
  { id: "ten", name: "Double figures", desc: "Finish 10 quizzes" },
  { id: "fifty", name: "Half-century", desc: "Finish 50 quizzes" },
  { id: "century", name: "Century", desc: "Get 100 answers right altogether" },
  { id: "thousand", name: "Brainbox", desc: "Get 1,000 answers right altogether" },
  { id: "marathon", name: "Marathon", desc: "Finish 5 quizzes in one day" },
  { id: "perfect3", name: "Triple perfect", desc: "Get full marks in 3 quizzes" },
  { id: "testace", name: "Test ace", desc: "Get full marks in a spelling or vocab test" },
  { id: "revise5", name: "Revision ninja", desc: "Finish 5 revision quizzes" },
  { id: "allround", name: "All-rounder", desc: "Try every kind of quiz" },
  { id: "hw1", name: "Homework hero", desc: "Have a piece of homework checked off" },
  { id: "hw10", name: "Homework legend", desc: "Have 10 pieces of homework checked off" },
  { id: "early3", name: "Ahead of time", desc: "Finish 3 pieces of homework before they're due" },
  { id: "cleansheet", name: "Clean sheet", desc: "Get 5 out of 5 in a league match", only: "kristan" },
  { id: "nightowl", name: "Night owl 🦉", desc: "Finish a quiz after 9pm", silly: 1 },
  { id: "earlybird", name: "Early bird 🐦", desc: "Finish a quiz before 7am", silly: 1 },
  { id: "pietime", name: "Pie time 🥧", desc: "Finish a quiz at exactly 3:14", silly: 1 },
  { id: "weekend", name: "Weekend warrior", desc: "Do a quiz on both Saturday and Sunday of the same weekend", silly: 1 },
  { id: "lucky7", name: "Lucky 7 🍀", desc: "Score exactly 7 in three different quizzes", silly: 1 },
  { id: "copycat", name: "Copycat 🐱", desc: "Get the same score in two quizzes in a row", silly: 1 },
  { id: "palindrome", name: "Palindrome points", desc: "Earn a palindrome of points in one quiz, like 55 or 121", silly: 1 },
  { id: "rollercoaster", name: "Rollercoaster 🎢", desc: "Go from under half marks to full marks in your next quiz", silly: 1 },
  { id: "bravetry", name: "Brave try 💪", desc: "Finish a quiz even when it went badly (under 30%)", silly: 1 },
  { id: "shopaholic", name: "Shopaholic 🛍️", desc: "Buy 5 things in the shop", silly: 1 },
  { id: "petpal", name: "Pet pal 🐾", desc: "Adopt a pet or space buddy from the shop", silly: 1 },
  { id: "piggy", name: "Piggy bank 🐷", desc: "Cash out points at the bank for the first time", silly: 1 }
];
/* Shop purchases and bank rows, set by the page so badges can see them. */
var PURCHASES = [], BANKROWS = [];
function setShopBank(p, b) { PURCHASES = p || []; BANKROWS = b || []; }
function dubaiHM(t) { var d = new Date(Date.parse(t) + 4 * 3600e3); return { h: d.getUTCHours(), m: d.getUTCMinutes(), dow: d.getUTCDay(), day: d.toISOString().slice(0, 10) }; }

/* ===== Daily streak =====
   A day counts only when a quiz of at least 5 questions is finished with 70% or more (7/10, 4/5).
   Days are Abu Dhabi days, and the server stamps every result with its own time, so they can't be backdated. */
var STREAK_RULE = { minQuestions: 5, minPct: 70 };
function dubaiDay(t) { var ms = typeof t === "number" ? t : Date.parse(t); return new Date(ms + 4 * 3600e3).toISOString().slice(0, 10); }
function addDays(day, n) { var d = new Date(day + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
function qualifies(a) { return a && a.total >= STREAK_RULE.minQuestions && a.score * 100 >= a.total * STREAK_RULE.minPct; }
/* Saving a streak:
   - Catch-up repair: miss a day, then finish 2 qualifying quizzes the next day and the missed day counts.
   - Freezes: earn one for every 7 days in a row (hold up to 2). If a missed day isn't repaired, a freeze covers it automatically.
   - Rest days: set by Mum or Dad (holidays, illness, travel). They neither count nor break the streak.
   Everything is worked out from saved results and rest days, so it can't be edited by hand. */
var REST_DAYS = [], STREAK_FREEZE_EVERY = 7, STREAK_FREEZE_MAX = 2;
/* Homework marks (homework_done rows): their points count towards totals, and verified or confirmed homework counts as a streak day. */
var HW_DONE = [];
function setHomeworkDone(rows) { HW_DONE = rows || []; }
/* Daily task ticks (TT Rockstars, reading, Reading Record): small points, never a streak day. */
var DAILY_TICKS = [];
function setDailyTicks(rows) { DAILY_TICKS = rows || []; }
function dailyPoints(child) { return DAILY_TICKS.reduce(function (s, r) { return s + (r.child === child ? (r.points || 0) : 0); }, 0); }
function homeworkPoints(child) { return HW_DONE.reduce(function (s, r) { return s + (r.child === child ? (r.points || 0) : 0); }, 0); }
function setRestDays(rows) { REST_DAYS = rows || []; }
function streakInfo(all, child, now) {
  var cnt = {}, rest = {}, status = {};
  all.forEach(function (a) { if (a.child === child && qualifies(a)) { var d = a.playDay || dubaiDay(a.at); cnt[d] = (cnt[d] || 0) + 1; } });
  HW_DONE.forEach(function (r) { if (r.child === child && (r.status === "verified" || r.status === "confirmed") && r.doneAt) { var d = dubaiDay(r.doneAt); cnt[d] = (cnt[d] || 0) + 1; } });
  REST_DAYS.forEach(function (r) { if (r.child === child && r.day) rest[String(r.day).slice(0, 10)] = 1; });
  var today = dubaiDay(now == null ? Date.now() : now), days = Object.keys(cnt).sort();
  var streak = 0, best = 0, freezes = 0, pending = null, earnedToday = false;
  function inc(isToday) { streak++; if (streak > best) best = streak; if (streak % STREAK_FREEZE_EVERY === 0 && freezes < STREAK_FREEZE_MAX) { freezes++; if (isToday) earnedToday = true; } }
  function fail() { if (freezes > 0) { freezes--; status[pending] = "frozen"; } else { status[pending] = "missed"; streak = 0; } pending = null; }
  if (days.length) for (var d = days[0]; d < today; d = addDays(d, 1)) {
    var c = cnt[d] || 0;
    if (rest[d]) { status[d] = "rest"; continue; }
    if (c === 0) { if (pending) fail(); if (streak > 0) { pending = d; status[d] = "pending"; } else status[d] = "missed"; continue; }
    if (pending) { if (c >= 2) { status[pending] = "repaired"; pending = null; inc(); } else fail(); }
    status[d] = "ok"; inc();
  }
  var c0 = cnt[today] || 0, restToday = !!rest[today], before = streak, needToday, atRisk = false, repairedToday = false;
  if (restToday) { status[today] = "rest"; needToday = 0; }
  else if (pending) {
    needToday = Math.max(0, 2 - c0);
    if (c0 >= 2) { status[pending] = "repaired"; pending = null; inc(true); inc(true); status[today] = "ok"; repairedToday = true; }
    else { atRisk = true; if (c0 === 1) status[today] = "ok"; }
  } else {
    needToday = c0 >= 1 ? 0 : 1;
    if (c0 >= 1) { inc(true); status[today] = "ok"; }
    else atRisk = streak > 0;
  }
  var current = atRisk ? before : streak;
  if (current > best) best = current;
  var week = []; for (var i = 6; i >= 0; i--) { var x = addDays(today, -i); week.push({ day: x, status: status[x] || (i === 0 ? "todo" : "none"), ok: status[x] === "ok" || status[x] === "repaired", today: i === 0 }); }
  return { current: current, best: best, freezes: freezes, freezeMax: STREAK_FREEZE_MAX, doneToday: !atRisk && (c0 >= 1 || restToday), atRisk: atRisk,
    needsRepair: !!pending, needToday: needToday, quizzesToday: c0, repairedToday: repairedToday, earnedFreezeToday: earnedToday, restToday: restToday,
    freezeWillCover: !!pending && freezes > 0, today: today, week: week };
}

function byTime(a, b) { return String(a.at).localeCompare(String(b.at)); }
function childAttempts(all, child) { return all.filter(function (a) { return a.child === child; }).sort(byTime); }
function weekAttempts(all, child, weekStart) { return childAttempts(all, child).filter(function (a) { return a.week === weekStart; }); }

/* Per-skill state for this week: how often right/wrong, current run of rights, and static questions still to win back. */
function skillState(all, child, weekStart) {
  var st = {};
  weekAttempts(all, child, weekStart).forEach(function (a) {
    (a.results || []).forEach(function (r) {
      var s = st[r.gen] || (st[r.gen] = { gen: r.gen, topic: r.label || r.topic, right: 0, wrong: 0, streak: 0, lastWrongAt: null, pending: {} });
      if (r.ok) {
        s.right++; s.streak++;
        delete s.pending[r.prompt];
      } else {
        s.wrong++; s.streak = 0; s.lastWrongAt = a.at;
      }
    });
    (a.missed || []).forEach(function (q) {
      if (STATIC_GENS[q.gen] && st[q.gen]) {
        var r = (a.results || []).filter(function (x) { return x.prompt === q.prompt; })[0];
        if (r && !r.ok) st[q.gen].pending[q.prompt] = q;
      }
    });
  });
  return st;
}

/* A skill needs reinforcing if it has been missed this week and hasn't since been got right twice running. */
function weakSkills(state) {
  return Object.keys(state).map(function (k) { return state[k]; })
    .filter(function (s) { return s.wrong > 0 && s.streak < 2; })
    .sort(function (a, b) { return (b.wrong - b.right) - (a.wrong - a.right) || String(b.lastWrongAt).localeCompare(String(a.lastWrongAt)); });
}

/* Build a quiz: up to 3 comeback questions (4 on Challenge) on missed skills, the rest fresh. */
function buildAdaptiveQuiz(child, level, count, all, weekStart, gen, build, shuffleFn, mode) {
  var state = skillState(all, child, weekStart), weak = weakSkills(state);
  var PREFIX = { spelling: /^spell:/, english: /^e[num]:/, french: /^f[rq]:/, challenge: /^ch:/, vocab: /^fr:/ };
  var wordOf = function (g) { var k = typeof wbKey === "function" && wbKey(g); return k ? k.join("|") : String(g); };
  if (PREFIX[mode]) weak = weak.filter(function (s) { return PREFIX[mode].test(String(s.gen)); });
  if (mode && mode.indexOf("revise:") === 0 && typeof revTopic === "function") {
    var rt = revTopic(child, mode.slice(7)); weak = rt ? weak.filter(function (s) { return rt.gens.indexOf(s.gen) >= 0; }) : [];
  }
  var max = Math.min(weak.length, level === 3 ? 4 : 3), comebacks = [], seen = [];
  for (var i = 0; i < weak.length && comebacks.length < max; i++) {
    var s = weak[i], q = null, pend = Object.keys(s.pending);
    if (pend.length) {
      var src = s.pending[pend[0]];
      q = JSON.parse(JSON.stringify(src));
      q.options = shuffleFn(q.options);
    } else if (!STATIC_GENS[s.gen]) {
      q = gen(child, s.gen, level);
    } else {
      q = gen(child, s.gen, level);
    }
    var key = q && (q.type === "type" ? q.sentence : q.prompt);
    if (q && seen.indexOf(key) < 0) {
      q.comeback = true; q.level = level;
      comebacks.push(q); seen.push(key);
    }
  }
  if (PREFIX[mode]) {
    var usedWords = comebacks.map(function (c) { return wordOf(c.gen); });
    var fresh = build(child, level, count, seen, mode).filter(function (f) { return usedWords.indexOf(wordOf(f.gen)) < 0; }).slice(0, count - comebacks.length);
    return shuffleFn(fresh.concat(comebacks));
  }
  var fresh = build(child, level, count - comebacks.length, seen, mode);
  return shuffleFn(fresh.concat(comebacks));
}

/* Score one finished quiz. */
function scoreAttempt(qs, answers, level) {
  var score = 0, run = 0, bestRun = 0, comebackRight = 0, comebackTotal = 0, points = 0;
  qs.forEach(function (q, i) {
    var ok = answers[i] && answers[i].ok;
    if (q.comeback) comebackTotal++;
    if (ok) {
      score++; run++; bestRun = Math.max(bestRun, run);
      points += POINTS.perRight * (LEVEL_MULT[level] || 1);
      if (q.comeback) { comebackRight++; points += POINTS.comeback; }
    } else run = 0;
  });
  if (score === qs.length && qs.length) points += POINTS.perfect;
  return { score: score, total: qs.length, bestRun: bestRun, comebackRight: comebackRight, comebackTotal: comebackTotal, points: Math.round(points) };
}

function rankFor(child, points) {
  var r = RANKS[child], cur = r[0], next = null;
  for (var i = 0; i < r.length; i++) { if (points >= r[i][0]) { cur = r[i]; next = r[i + 1] || null; } }
  return { name: cur[1], floor: cur[0], next: next ? { name: next[1], at: next[0] } : null };
}

function awards(all, child, weekStart) {
  var mine = childAttempts(all, child), week = mine.filter(function (a) { return a.week === weekStart; });
  var points = mine.reduce(function (s, a) { return s + (a.points || 0); }, 0) + homeworkPoints(child);
  var cbAll = mine.reduce(function (s, a) { return s + (a.comebackRight || 0); }, 0);
  var levelsDone = {}; week.forEach(function (a) { levelsDone[a.level] = 1; });
  var state = skillState(all, child, weekStart);
  var mastered = Object.keys(state).filter(function (k) { return state[k].streak >= 3; });
  var sk = streakInfo(all, child);
  var earned = {
    first: mine.length >= 1,
    hattrick: week.length >= 3,
    five: mine.length >= 5,
    run5: mine.some(function (a) { return (a.bestRun || 0) >= 5; }),
    perfect: mine.some(function (a) { return a.total && a.score === a.total; }),
    comeback: cbAll >= 1,
    comeback5: cbAll >= 5,
    master: mastered.length > 0 || mine.some(function (a) { return a.masteredAny; }),
    core: mine.some(function (a) { return a.level >= 2 && a.score >= 7; }),
    challenge: mine.some(function (a) { return a.level === 3 && a.score >= 7; }),
    alllevels: !!(levelsDone[1] && levelsDone[2] && levelsDone[3]),
    improver: week.length >= 2 && week.slice(1).some(function (a) { return a.score - week[0].score >= 3; }),
    streak3: sk.best >= 3, streak7: sk.best >= 7, streak14: sk.best >= 14, streak30: sk.best >= 30
  };
  var byTimeMine = mine.slice().sort(byTime), rightAll = mine.reduce(function (s, a) { return s + (a.score || 0); }, 0), perDay = {}, modes = {};
  var hw = HW_DONE.filter(function (r) { return r.child === child && (r.status === "verified" || r.status === "confirmed"); });
  byTimeMine.forEach(function (a) { var t = dubaiHM(a.at); perDay[t.day] = (perDay[t.day] || 0) + 1; modes[a.mode || "mix"] = 1; });
  var full = function (a) { return a.total >= 5 && a.score === a.total; }, pct = function (a) { return a.total ? a.score / a.total : 0; };
  var sat = {}, weekendBoth = false;
  byTimeMine.forEach(function (a) { var t = dubaiHM(a.at); if (t.dow === 6) sat[t.day] = 1; if (t.dow === 0 && sat[addDays(t.day, -1)]) weekendBoth = true; });
  var pal = function (n) { var s = String(n); return n >= 11 && s === s.split("").reverse().join(""); };
  var allModes = child === "millie" ? ["mix", "spelling", "challenge", "revise"] : ["mix", "english", "french", "vocab", "challenge", "revise", "match"];
  var myBuys = PURCHASES.filter(function (x) { return x.child === child; });
  Object.assign(earned, {
    ten: mine.length >= 10, fifty: mine.length >= 50, century: rightAll >= 100, thousand: rightAll >= 1000,
    marathon: Object.keys(perDay).some(function (d) { return perDay[d] >= 5; }),
    perfect3: mine.filter(full).length >= 3,
    testace: mine.some(function (a) { return (a.mode === "spelling" || a.mode === "vocab") && full(a); }),
    revise5: mine.filter(function (a) { return a.mode === "revise"; }).length >= 5,
    allround: allModes.every(function (m) { return modes[m]; }),
    hw1: hw.length >= 1, hw10: hw.length >= 10, early3: hw.filter(function (r) { return (r.points || 0) >= 30; }).length >= 3,
    cleansheet: mine.some(function (a) { return a.mode === "match" && a.total === 5 && a.score === 5; }),
    nightowl: mine.some(function (a) { return dubaiHM(a.at).h >= 21; }),
    earlybird: mine.some(function (a) { return dubaiHM(a.at).h < 7; }),
    pietime: mine.some(function (a) { var t = dubaiHM(a.at); return (t.h === 3 || t.h === 15) && t.m === 14; }),
    weekend: weekendBoth,
    lucky7: mine.filter(function (a) { return a.score === 7; }).length >= 3,
    copycat: byTimeMine.some(function (a, i) { var b = byTimeMine[i - 1]; return b && a.score === b.score && a.total === b.total; }),
    palindrome: mine.some(function (a) { return pal(a.points || 0); }),
    rollercoaster: byTimeMine.some(function (a, i) { var b = byTimeMine[i - 1]; return b && pct(b) < 0.5 && full(a); }),
    bravetry: mine.some(function (a) { return a.total >= 5 && pct(a) < 0.3; }),
    shopaholic: myBuys.length >= 5,
    petpal: myBuys.some(function (x) { return /^(buddy|pet)-/.test(x.item) && !/-none$/.test(x.item); }),
    piggy: BANKROWS.some(function (b) { return b.child === child && b.status !== "cancelled"; })
  });
  return {
    streak: sk, points: points, rank: rankFor(child, points), weekCount: week.length, mastered: mastered,
    badges: BADGES.filter(function (b) { return !b.only || b.only === child; }).map(function (b) { return { id: b.id, name: b.name, desc: b.desc, silly: !!b.silly, earned: !!earned[b.id] }; })
  };
}

/* All-time results for a revision topic (any quiz type), newest attempts first. */
function revisionStats(all, child, topic) {
  var right = 0, total = 0, last = null, lastScore = null;
  all.filter(function (a) { return a.child === child; }).sort(byTime).forEach(function (a) {
    var hit = 0, ok = 0;
    (a.results || []).forEach(function (r) { if (topic.gens.indexOf(r.gen) >= 0) { total++; hit++; if (r.ok) { right++; ok++; } } });
    if (hit) { last = a.at; lastScore = ok + "/" + hit; }
  });
  return { right: right, total: total, pct: total ? Math.round(right / total * 100) : null, last: last, lastScore: lastScore };
}

/* Per-topic results this week, for the progress view and for Mum and Dad. */
function topicSummary(all, child, weekStart) {
  var t = {};
  weekAttempts(all, child, weekStart).forEach(function (a) {
    (a.results || []).forEach(function (r) {
      if (/^(spell|fr):/.test(r.gen || "")) return; // spelling and the school French list have their own sections
      var x = t[r.topic] || (t[r.topic] = { topic: r.topic, right: 0, total: 0 });
      x.total++; if (r.ok) x.right++;
    });
  });
  return Object.keys(t).map(function (k) { return t[k]; }).sort(function (a, b) { return (a.right / a.total) - (b.right / b.total); });
}

/* ===== Kristan's player card: subject ratings from every answer he has given ===== */
var CARD_TIERS = { silver: 65, gold: 82, elite: 89 };
var CARD_STATS = [["MAT", "Maths"], ["ENG", "English"], ["SCI", "Science"], ["FRA", "French"], ["VOC", "Vocab"], ["FRM", "Form"]];
function cardKey(gen, map) {
  var g = String(gen || "");
  if (/^(e[num]|ch|spell):/.test(g)) return "VOC";
  if (/^f[rq]:/.test(g)) return "FRA";
  return { Maths: "MAT", English: "ENG", Science: "SCI", French: "FRA" }[map[g]] || null;
}
/* Tough on purpose: accuracy is pulled towards 40% until there are lots of answers, and up to 9 bonus points come only with volume (400 answers in a subject). */
function cardRating(right, total, noVolume) {
  var s = (right + 0.4 * 25) / (total + 25), bonus = noVolume ? 0 : 9 * Math.min(1, total / 400);
  return Math.max(40, Math.min(99, Math.round(35 + 55 * s + bonus)));
}
function playerCard(all, child) {
  var map = {};
  if (typeof REVISION !== "undefined" && REVISION[child]) REVISION[child].forEach(function (t) { t.gens.forEach(function (g) { map[g] = t.subject; }); });
  var acc = {}; CARD_STATS.forEach(function (s) { acc[s[0]] = [0, 0]; });
  var mine = childAttempts(all, child);
  mine.forEach(function (a) { (a.results || []).forEach(function (r) { var k = cardKey(r.gen, map); if (k) { acc[k][1]++; if (r.ok) acc[k][0]++; } }); });
  mine.slice(-10).forEach(function (a) { acc.FRM[0] += a.score || 0; acc.FRM[1] += a.total || 0; });
  var stats = CARD_STATS.map(function (s) { return { key: s[0], name: s[1], value: cardRating(acc[s[0]][0], acc[s[0]][1], s[0] === "FRM"), answers: acc[s[0]][1] }; });
  var ovr = Math.round(stats.reduce(function (t, s) { return t + s.value; }, 0) / stats.length);
  return { ovr: ovr, stats: stats, tier: ovr >= CARD_TIERS.elite ? "elite" : ovr >= CARD_TIERS.gold ? "gold" : ovr >= CARD_TIERS.silver ? "silver" : "bronze",
    tierName: ovr >= CARD_TIERS.elite ? "Elite" : ovr >= CARD_TIERS.gold ? "Gold" : ovr >= CARD_TIERS.silver ? "Silver" : "Bronze",
    next: ovr >= CARD_TIERS.elite ? null : ovr >= CARD_TIERS.gold ? CARD_TIERS.elite : ovr >= CARD_TIERS.silver ? CARD_TIERS.gold : CARD_TIERS.silver,
    nextName: ovr >= CARD_TIERS.elite ? null : ovr >= CARD_TIERS.gold ? "Elite" : ovr >= CARD_TIERS.silver ? "Gold" : "Silver" };
}

if (typeof module !== "undefined" && module.exports) module.exports = {
  skillState: skillState, weakSkills: weakSkills, buildAdaptiveQuiz: buildAdaptiveQuiz, scoreAttempt: scoreAttempt,
  awards: awards, revisionStats: revisionStats, rankFor: rankFor, topicSummary: topicSummary, weekAttempts: weekAttempts, BADGES: BADGES, streakInfo: streakInfo, dubaiDay: dubaiDay, addDays: addDays, qualifies: qualifies, STREAK_RULE: STREAK_RULE, playerCard: playerCard, setRestDays: setRestDays, setHomeworkDone: setHomeworkDone, setDailyTicks: setDailyTicks, dailyPoints: dailyPoints, setShopBank: setShopBank, homeworkPoints: homeworkPoints
};
