/* ===== Progress, awards and comeback questions (pure functions, no DOM) ===== */
var STATIC_GENS = { poetry: 1, homophone: 1, space: 1, bestAverage: 1, science: 1 };
var LEVEL_MULT = { 1: 1, 2: 1.5, 3: 2 };

var RANKS = {
  millie: [
    [0, "Space Cadet"], [100, "Rocket Pilot"], [300, "Astronaut"], [600, "Mission Commander"],
    [1000, "Galaxy Explorer"], [1600, "Solaris Legend"]
  ],
  kristan: [
    [0, "Academy Prospect"], [100, "Squad Player"], [300, "First Team"], [600, "Vice-Captain"],
    [1000, "Captain"], [1600, "Club Legend"]
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
  { id: "improver", name: "Most improved", desc: "Beat your first score of the week by 3 or more" }
];

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
  var PREFIX = { spelling: "spell:", english: "en:", french: "fr:", challenge: "ch:" };
  if (PREFIX[mode]) weak = weak.filter(function (s) { return String(s.gen).indexOf(PREFIX[mode]) === 0; });
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
    var usedWords = comebacks.map(function (c) { return c.gen; });
    var fresh = build(child, level, count, seen, mode).filter(function (f) { return usedWords.indexOf(f.gen) < 0; }).slice(0, count - comebacks.length);
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
      points += 10 * (LEVEL_MULT[level] || 1);
      if (q.comeback) { comebackRight++; points += 5; }
    } else run = 0;
  });
  if (score === qs.length && qs.length) points += 20;
  return { score: score, total: qs.length, bestRun: bestRun, comebackRight: comebackRight, comebackTotal: comebackTotal, points: Math.round(points) };
}

function rankFor(child, points) {
  var r = RANKS[child], cur = r[0], next = null;
  for (var i = 0; i < r.length; i++) { if (points >= r[i][0]) { cur = r[i]; next = r[i + 1] || null; } }
  return { name: cur[1], floor: cur[0], next: next ? { name: next[1], at: next[0] } : null };
}

function awards(all, child, weekStart) {
  var mine = childAttempts(all, child), week = mine.filter(function (a) { return a.week === weekStart; });
  var points = mine.reduce(function (s, a) { return s + (a.points || 0); }, 0);
  var cbAll = mine.reduce(function (s, a) { return s + (a.comebackRight || 0); }, 0);
  var levelsDone = {}; week.forEach(function (a) { levelsDone[a.level] = 1; });
  var state = skillState(all, child, weekStart);
  var mastered = Object.keys(state).filter(function (k) { return state[k].streak >= 3; });
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
    improver: week.length >= 2 && week.slice(1).some(function (a) { return a.score - week[0].score >= 3; })
  };
  return {
    points: points, rank: rankFor(child, points), weekCount: week.length, mastered: mastered,
    badges: BADGES.map(function (b) { return { id: b.id, name: b.name, desc: b.desc, earned: !!earned[b.id] }; })
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
      var x = t[r.topic] || (t[r.topic] = { topic: r.topic, right: 0, total: 0 });
      x.total++; if (r.ok) x.right++;
    });
  });
  return Object.keys(t).map(function (k) { return t[k]; }).sort(function (a, b) { return (a.right / a.total) - (b.right / b.total); });
}

if (typeof module !== "undefined" && module.exports) module.exports = {
  skillState: skillState, weakSkills: weakSkills, buildAdaptiveQuiz: buildAdaptiveQuiz, scoreAttempt: scoreAttempt,
  awards: awards, revisionStats: revisionStats, rankFor: rankFor, topicSummary: topicSummary, weekAttempts: weekAttempts, BADGES: BADGES
};
