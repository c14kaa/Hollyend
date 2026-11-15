
/* ---------- merge the banks into the quiz lists (existing words keep their place) ---------- */
(function () {
  var OLD_GROUPS = { juxtaposition: "Analysing texts", foreshadowing: "Analysing texts", onomatopoeia: "Analysing texts", personification: "Analysing texts",
    alliteration: "Analysing texts", connotation: "Analysing texts", rhythm: "Analysing texts", melancholy: "Description", ominous: "Description",
    desolate: "Description", atmosphere: "Description", vivid: "Description", consequence: "Argument", emphasise: "Argument" };
  KLISTS.english.words.forEach(function (w) { if (!w.group) w.group = OLD_GROUPS[w.word] || "Analysing texts"; if (!w.added) w.added = "2026-10-26"; });
  ["challenge_millie", "challenge_kristan", "english"].forEach(function (key) {
    var L = KLISTS[key], have = {};
    L.words.forEach(function (w) { have[w.word.toLowerCase()] = 1; if (!w.added) w.added = "2026-10-26"; });
    WB.lists[key].forEach(function (w) { if (!have[w.word.toLowerCase()]) { L.words.push(w); have[w.word.toLowerCase()] = 1; } });
  });
  KLISTS.challenge_millie.label = KLISTS.challenge_kristan.label = "Challenge words";
  KLISTS.english.label = "Words to use in your writing";
})();

/* ---------- history and spaced repetition ---------- */
var WB_HISTORY = [];
function setWordHistory(all) { WB_HISTORY = all || []; }
function wbKey(gen) {
  var g = String(gen || "");
  if (g.indexOf("ch:") === 0) return ["challenge", g.slice(3)];
  if (/^e[num]:/.test(g)) return ["english", g.slice(3)];
  if (g.indexOf("fq:") === 0) { var p = g.split(":"); return ["french", (p[1] === "conj" ? "conj-" : "") + p.slice(2).join(":")]; }
  return null;
}
function wbStats(child, list) {
  var st = {}, quizNo = 0;
  WB_HISTORY.filter(function (a) { return a.child === child; }).sort(function (a, b) { return String(a.at).localeCompare(String(b.at)); }).forEach(function (a) {
    var hit = false;
    (a.results || []).forEach(function (r) {
      var k = wbKey(r.gen); if (!k || k[0] !== list) return; hit = true;
      var s = st[k[1]] || (st[k[1]] = { seen: 0, right: 0, streak: 0, lastOk: null, lastAt: null, lastQuiz: -1 });
      s.seen++; if (r.ok) { s.right++; s.streak++; } else s.streak = 0; s.lastOk = !!r.ok; s.lastAt = a.at; s.lastQuiz = quizNo;
    });
    if (hit) quizNo++;
  });
  return { st: st, quizzes: quizNo };
}
var WB_MASTER = 3;
function wbStatus(s) { return !s ? "new" : !s.lastOk ? "winback" : s.streak >= WB_MASTER ? "mastered" : "learning"; }
/* Mostly new words, up to 3 recent misses, a couple still being learned, and the odd mastered one to check it stuck.
   Words from the last two quizzes of this list are held back unless there's nothing else. */
function wbPick(ids, list, child, count, addedOf) {
  var S = wbStats(child, list), st = S.st, recent = S.quizzes - 2, G = { "new": [], winback: [], learning: [], mastered: [] };
  ids.forEach(function (id) { G[wbStatus(st[id])].push(id); });
  var byOld = function (a, b) { return String(st[a].lastAt).localeCompare(String(st[b].lastAt)); };
  G.winback.sort(byOld); G.learning.sort(byOld); G.mastered.sort(byOld);
  var fresh = function (id) { return !st[id] || st[id].lastQuiz < recent; };
  var newest = shuffle(G["new"]).sort(function (a, b) { return String(addedOf(b)).localeCompare(String(addedOf(a))); });
  var out = [];
  function take(arr, n) { for (var i = 0; i < arr.length && n > 0; i++) if (out.indexOf(arr[i]) < 0) { out.push(arr[i]); n--; } }
  take(G.winback, Math.min(3, Math.ceil(count * 0.3)));
  take(G.learning.filter(fresh), Math.ceil(count * 0.2));
  take(G.mastered.filter(fresh), count >= 8 ? 1 : 0);
  take(newest, count - out.length);
  take(G.learning.filter(fresh), count - out.length);
  take(G.mastered.filter(fresh), count - out.length);
  take(G.winback, count - out.length);
  take(G.learning, count - out.length);
  take(G.mastered, count - out.length);
  return shuffle(out);
}

/* ---------- English: spell it, use it, know what it means ---------- */
function wbEnglishQ(kind, id, level) {
  var e = klistEntry("english", id); if (!e) return null;
  var pool = KLISTS.english.words.filter(function (w) { return w.word !== e.word; }), item;
  if (kind === "eu") {
    var others = shuffle(pool.filter(function (w) { return w.group !== e.group; })).slice(0, 3), notes = {};
    others.forEach(function (o) { notes[o.word] = "“" + o.word + "” means " + o.meaning + ", which doesn't fit this sentence."; });
    item = q("English vocabulary", "Which word fits best?\n" + pick(e.sentences).replace("___", "_____"), e.word, others.map(function (o) { return o.word; }),
      "“" + e.word + "” means " + e.meaning + ".", "", { notes: notes, tip: "Try using “" + e.word + "” in your next piece of writing.",
        steps: ["Read the whole sentence and work out what the missing word needs to do.", "Try each option in the gap: does the sentence still make sense?", "“" + e.word + "” means " + e.meaning + ", so it fits.", "Memory trick: " + e.hook] });
  } else {
    var o3 = shuffle(pool).slice(0, 3), notes2 = {};
    o3.forEach(function (o) { notes2[o.meaning] = "That's what “" + o.word + "” means."; });
    item = q("English vocabulary", "What does “" + e.word + "” mean?", e.meaning, o3.map(function (o) { return o.meaning; }),
      "“" + e.word + "” means " + e.meaning + ". For example: " + e.sentences[0].replace("___", e.word), "", { notes: notes2, tip: e.hook,
        steps: ["Break the word into parts: " + e.chunks + ".", "Memory trick: " + e.hook, "Example: " + e.sentences[0].replace("___", e.word)] });
  }
  item.gen = kind + ":" + e.word; item.label = "English: " + e.word; item.level = level;
  return item;
}

/* ---------- French: varied questions from the bank ---------- */
function wbFr(id) { for (var i = 0; i < WB.french.length; i++) if (WB.french[i].id === id) return WB.french[i]; return null; }
var FR_SUBJ = [["je", "J'"], ["tu", "Tu"], ["il", "Il"], ["nous", "Nous"], ["vous", "Vous"], ["ils", "Ils"]];
var FR_SUBJ_ALT = { 2: ["Il", "Elle", "On"], 5: ["Ils", "Elles"] };
function frTypesFor(e) { return e.kind === "n" ? ["fr2en", "en2fr", "article", "listen", "odd"] : ["fr2en", "en2fr", "listen"]; }
function frArticleWord(g) { return g === "m" ? "un" : g === "f" ? "une" : "des"; }
function wbFrenchQ(type, id, level) {
  if (type === "conj") return wbConjQ(id, level);
  var e = wbFr(id); if (!e) return null;
  var types = frTypesFor(e);
  if (type === "mix" || types.indexOf(type) < 0) type = pick(types);
  var same = WB.french.filter(function (x) { return x.id !== e.id && x.kind === e.kind; }), item, notes = {};
  if (type === "fr2en" || type === "listen") {
    var near = shuffle(same.filter(function (x) { return x.topic === e.topic; })).concat(shuffle(same)), opts = [];
    near.forEach(function (x) { if (opts.length < 3 && x.en !== e.en && opts.indexOf(x.en) < 0) { opts.push(x.en); notes[x.en] = "That's « " + x.fr + " »."; } });
    item = q("French vocab", type === "listen" ? "Tap “Hear it”, then choose what it means." : "What does « " + e.fr + " » mean?", e.en, opts,
      "« " + e.fr + " » means " + e.en + ".", "", { notes: notes, tip: "Say it out loud: « " + e.fr + " ».",
        steps: ["Topic: " + e.topic + ".", "« " + e.fr + " » = " + e.en + ".", "Learn it with look, say, cover, write, check."] });
    if (type === "listen") { item.listen = true; item.speak = e.fr; item.lang = "fr-FR"; item.fallback = "« " + e.fr + " »"; }
    item.pairs = [[e.fr, e.en]].concat(opts.map(function (en) { var x = same.filter(function (y) { return y.en === en; })[0]; return [x.fr, en]; }));
  } else if (type === "en2fr") {
    var clue = e.kind === "n" ? "Include le, la, l' or les." : e.kind === "a" ? "Write the masculine form." : "Accents count.";
    item = { type: "type", lang: "fr-FR", topic: "French vocab", prompt: "Write it in French.", sentence: "In French: " + e.en + " = _____", clue: clue, speak: e.fr,
      answer: e.fr, options: [], notes: {}, explain: "« " + e.fr + " » means " + e.en + ".", html: "",
      steps: ["Say the English: " + e.en + ".", e.kind === "n" ? "Remember the gender: " + (e.g === "pl" ? "plural, so les" : e.g === "m" ? "masculine, so le (or l' before a vowel)" : "feminine, so la (or l' before a vowel)") + "." : "Think of the topic: " + e.topic + ".",
        "Write « " + e.fr + " », with any accents.", "Look, say, cover, write, check."], tip: "Accents are part of the spelling in French." };
  } else if (type === "article") {
    var ans = frArticleWord(e.g), gname = e.g === "m" ? "masculine" : e.g === "f" ? "feminine" : "plural";
    item = q("French grammar", "Which word goes in front of « " + e.bare + " » (" + e.en + ")?\n_____ " + e.bare, ans, ["un", "une", "des"].filter(function (x) { return x !== ans; }),
      "« " + e.bare + " » is " + gname + ", so it's « " + ans + " " + e.bare + " » (a/some) and « " + e.fr + " » (the).", "",
      { notes: { un: "Un is for masculine nouns.", une: "Une is for feminine nouns.", des: "Des is for plural nouns (some)." }, tip: "Always learn a noun with its le or la.",
        steps: ["Ask: is « " + e.bare + " » masculine, feminine or plural?", "It's " + gname + ": « " + e.fr + " ».", "Masculine → un, feminine → une, plural → des."] });
  } else {
    var other = shuffle(WB.french.filter(function (x) { return x.kind === "n" && x.topic !== e.topic; }));
    var topicB = other[0].topic, three = shuffle(WB.french.filter(function (x) { return x.kind === "n" && x.topic === topicB; })).slice(0, 3);
    var note = {}; three.forEach(function (x) { note[x.fr] = "« " + x.fr + " » means " + x.en + ": it's a " + topicB.toLowerCase() + " word, like the others."; });
    item = q("French vocab", "Which is the odd one out?", e.fr, three.map(function (x) { return x.fr; }),
      three.map(function (x) { return "« " + x.fr + " » (" + x.en + ")"; }).join(", ") + " are all " + topicB.toLowerCase() + " words. « " + e.fr + " » means " + e.en + ".", "",
      { notes: note, pairs: [[e.fr, e.en]].concat(three.map(function (x) { return [x.fr, x.en]; })), tip: "Group new words by topic to learn them faster.", steps: ["Translate each option into English.", "Find the topic three of them share: " + topicB + ".", "The one that doesn't fit is « " + e.fr + " » (" + e.en + ")."] });
  }
  item.gen = "fq:" + type + ":" + e.id; item.label = "French: " + e.fr; item.level = level;
  item.fr = e.fr; item.en = e.en; item.sounds = e.sounds; item.lang = "fr-FR"; if (!item.speak) item.speak = e.fr;
  return item;
}
function wbConjQ(verb, level) {
  var V = WB.verbList[verb]; if (!V) return null;
  var p = Math.floor(Math.random() * 6), form = V.forms[p], subj = FR_SUBJ[p][1];
  if (FR_SUBJ_ALT[p]) subj = pick(FR_SUBJ_ALT[p]);
  if (p === 0 && !/^[aeiouéèêh]/i.test(form)) subj = "Je";
  var gapS = (p === 0 && subj === "J'" ? "J'_____ " : subj + " _____ ") + V.end + ".";
  var full = (p === 0 && subj === "J'" ? "J'" + form : subj + " " + form) + " " + V.end + ".";
  var base = { topic: "French verbs", label: "French: " + verb };
  var enSubj = { "J'": "I", Je: "I", Tu: "you", Il: "he", Elle: "she", On: "we", Nous: "we", Vous: "you", Ils: "they", Elles: "they" }[subj];
  var enVerb = p === 0 && V.enI ? V.enI : p === 2 && subj !== "On" ? V.en3 : V.enB;
  var english = V.enB ? enSubj.charAt(0).toUpperCase() + enSubj.slice(1) + " " + enVerb + " " + V.endEn + "." : "";
  if (english && subj === "Tu") english += " (one person you know well)"; else if (english && subj === "Vous") english += " (more than one person, or polite)";
  var sounds = "";
  if (V.sounds) {
    sounds = V.sounds[p];
    if (subj === "Elle" || subj === "Elles") sounds = sounds.replace(/^eel/, "el");
    else if (subj === "On") sounds = /^[aeiouéèêh]/i.test(form) ? sounds.replace(/^eel /, "o(n)-n ") : sounds.replace(/^eel/, "o(n)");
    sounds += " " + V.endSounds;
  }
  var item;
  if (level >= 3) {
    item = { type: "type", lang: "fr-FR", topic: "French verbs", prompt: "Complete the verb.", sentence: gapS, clue: (english ? "In English: " + english + " · " : "") + verb + " = " + V.en, speak: full, answer: form, options: [], notes: {},
      explain: full + " " + V.note, html: "", steps: ["Find the subject: " + subj + ".", "Remember the pattern for " + verb + ": " + V.forms.join(", ") + ".", "So: " + full], tip: V.note };
  } else {
    var opts = V.forms.filter(function (f, i) { return f !== form; }).filter(function (f, i, a) { return a.indexOf(f) === i; }), n = {};
    V.forms.forEach(function (f, i) { if (f !== form && !n[f]) n[f] = "« " + f + " » goes with " + FR_SUBJ[i][0] + (i === 2 ? "/elle/on" : i === 5 ? "/elles" : "") + "."; });
    item = q("French verbs", "Complete the verb (" + verb + " = " + V.en + "):\n" + gapS + (english ? "\nIn English: " + english : ""), form, opts, full + " " + V.note, "",
      { notes: n, tip: V.note, steps: ["Find the subject: " + subj + ".", "Pattern: " + V.forms.join(", ") + ".", "So: " + full] });
  }
  item.gen = "fq:conj:" + verb; item.label = base.label; item.level = level;
  item.fr = full; item.en = english; item.sounds = sounds; item.lang = "fr-FR"; item.speak = full;
  return item;
}
function wbBuildFrench(level, count, seenPrompts) {
  var seen = {}; (seenPrompts || []).forEach(function (p) { seen[p] = 1; });
  var out = [];
  function push(it) { if (!it) return; var key = it.type === "type" ? it.sentence : it.prompt + "|" + it.answer; if (seen[key]) return; seen[key] = 1; out.push(it); }
  shuffle(KLISTS.french.words).slice(0, 3).forEach(function (w) { push(klistQ("french", w.id || w.word, level)); });
  wbPick(Object.keys(WB.verbList).map(function (v) { return "conj-" + v; }), "french", "kristan", 2, function () { return ""; })
    .forEach(function (id) { push(wbConjQ(id.slice(5), level)); });
  var ids = wbPick(WB.french.map(function (x) { return x.id; }), "french", "kristan", Math.max(0, count - out.length), function (id) { return wbFr(id).added; });
  var rota = shuffle(["fr2en", "en2fr", "article", "listen", "odd", "fr2en", "listen"]);
  if (level === 1) rota = rota.filter(function (t) { return t !== "en2fr"; }).concat(["en2fr"]);
  ids.forEach(function (id, i) { var e = wbFr(id), t = rota[i % rota.length]; if (frTypesFor(e).indexOf(t) < 0) t = pick(frTypesFor(e)); push(wbFrenchQ(t, id, level)); });
  return shuffle(out).slice(0, count);
}

/* ---------- plug into the engine ---------- */
var _wbBaseBuildKList = buildKList;
buildKList = function (mode, level, count, seenPrompts) {
  if (mode === "french") return wbBuildFrench(level, count, seenPrompts);
  if (mode.indexOf("challenge_") === 0) {
    var child = mode.slice(10), L = KLISTS[mode];
    return wbPick(L.words.map(function (w) { return w.word; }), "challenge", child, count, function (id) { var e = klistEntry(mode, id); return e && e.added; })
      .map(function (id) { return klistQ(mode, id, level); }).filter(Boolean);
  }
  if (mode === "english") {
    var ids = wbPick(KLISTS.english.words.map(function (w) { return w.word; }), "english", "kristan", count, function (id) { var e = klistEntry("english", id); return e && e.added; });
    var kinds = shuffle(["en", "en", "en", "en", "en", "eu", "eu", "eu", "em", "em"]);
    return ids.map(function (id, i) { var k = kinds[i % kinds.length]; return k === "en" ? klistQ("english", id, level) : wbEnglishQ(k, id, level); }).filter(Boolean);
  }
  return _wbBaseBuildKList(mode, level, count, seenPrompts);
};
function wbGen(child, gen, level) {
  var g = String(gen || "");
  if (g.indexOf("eu:") === 0 || g.indexOf("em:") === 0) return wbEnglishQ(g.slice(0, 2), g.slice(3), level);
  if (g.indexOf("fq:") === 0) { var p = g.split(":"); return wbFrenchQ(p[1], p.slice(2).join(":"), level); }
  return null;
}

/* ---------- revision library: the whole banks stay revisable ---------- */
(function () {
  var cov = "Word bank · from 27 Oct";
  REVISION.millie.push({ id: "ch-bank-millie", title: "Challenge words: the whole bank", subject: "Spelling", covered: cov, gens: KLISTS.challenge_millie.words.map(function (w) { return "ch:" + w.word; }) });
  REVISION.kristan.push({ id: "ch-bank-kristan", title: "Challenge words: the whole bank", subject: "Spelling", covered: cov, gens: KLISTS.challenge_kristan.words.map(function (w) { return "ch:" + w.word; }) });
  ["Analysing texts", "Description", "Character", "Argument"].forEach(function (grp) {
    var ws = KLISTS.english.words.filter(function (w) { return w.group === grp; });
    REVISION.kristan.push({ id: "en-" + wbSlug(grp), title: "Words for writing: " + grp.toLowerCase(), subject: "English", covered: cov,
      gens: ws.map(function (w) { return "en:" + w.word; }).concat(ws.map(function (w) { return "eu:" + w.word; }), ws.map(function (w) { return "em:" + w.word; })) });
  });
  var topics = []; WB.french.forEach(function (x) { if (topics.indexOf(x.topic) < 0) topics.push(x.topic); });
  topics.forEach(function (t) {
    REVISION.kristan.push({ id: "fr-" + wbSlug(t), title: "French: " + t.toLowerCase(), subject: "French", covered: cov,
      gens: WB.french.filter(function (x) { return x.topic === t; }).map(function (x) { return "fq:mix:" + x.id; }) });
  });
  REVISION.kristan.push({ id: "fr-verbs-present", title: "French: present-tense verbs", subject: "French", covered: cov, gens: Object.keys(WB.verbList).map(function (v) { return "fq:conj:" + v; }) });
})();

/* ---------- "My words": progress through each bank ---------- */
function wbProgress(child) {
  function sum(title, list, ids, show) {
    var st = wbStats(child, list).st, c = { "new": 0, winback: 0, learning: 0, mastered: 0 }, wb = [];
    ids.forEach(function (id) { var s = wbStatus(st[id]); c[s]++; if (s === "winback") wb.push(show(id)); });
    return { title: title, total: ids.length, mastered: c.mastered, learning: c.learning, winback: c.winback, unseen: c["new"], winbackWords: wb };
  }
  var out = [sum("Challenge words", "challenge", KLISTS["challenge_" + child].words.map(function (w) { return w.word; }), function (id) { return id; })];
  if (child === "kristan") {
    out.push(sum("English words", "english", KLISTS.english.words.map(function (w) { return w.word; }), function (id) { return id; }));
    out.push(sum("French", "french", WB.french.map(function (x) { return x.id; }).concat(Object.keys(WB.verbList).map(function (v) { return "conj-" + v; })),
      function (id) { return id.indexOf("conj-") === 0 ? id.slice(5) + " (verb)" : (wbFr(id) || {}).fr || id; }));
  }
  return out;
}

if (typeof module !== "undefined" && module.exports) module.exports = { WB: WB, wbPick: wbPick, wbStats: wbStats, wbProgress: wbProgress, setWordHistory: setWordHistory, wbGen: wbGen, wbBuildFrench: wbBuildFrench, wbKey: wbKey };
