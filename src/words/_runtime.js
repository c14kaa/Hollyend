/* ===== Hollyend word banks =====
   Built from src/words/*.js by src/build.py. Loaded after engine.js.
   - Challenge words (Millie, Kristan) and Kristan's English words are big banks; each quiz picks from them using
     spaced repetition (mostly new words, recent misses, the odd mastered word), so repeats stay low.
   - Kristan's French bank feeds varied questions: translate both ways, le/la/les, verb forms, listening, odd one out.
   Words are only ever ADDED. A word already in a bank must never be added again (the build test checks). */
var WB = {
  lists: { challenge_millie: [], challenge_kristan: [], english: [] }, french: [], verbList: {},
  add: function (list, added, rows) {
    rows.forEach(function (r) {
      var e = list === "english"
        ? { word: r[0], group: r[1], meaning: r[2], chunks: r[3], tricky: r[4], hook: r[5], sentences: [r[6], r[7]], added: added }
        : { word: r[0], meaning: r[1], chunks: r[2], tricky: r[3], hook: r[4], sentences: [r[5], r[6]], added: added };
      WB.lists[list].push(e);
    });
  },
  fr: function (added, rows) {
    rows.forEach(function (r) {
      var fr = r[0], bare = fr.replace(/^(le |la |les |l')/, "");
      WB.french.push({ id: wbSlug(fr), fr: fr, bare: bare, en: r[1], g: r[2], topic: r[3], kind: r[4], added: added });
    });
  },
  verbs: function (v) { Object.keys(v).forEach(function (k) { WB.verbList[k] = v[k]; }); }
};
function wbSlug(s) { return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/œ/g, "oe").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
