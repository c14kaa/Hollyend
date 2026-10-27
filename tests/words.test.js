/* Run: node tests/words.test.js  (after python3 src/build.py). Fails on duplicates, broken entries or bad quizzes. */
const fs = require('fs'), vm = require('vm'), path = require('path');
const R = p => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
const ctx = { console, Math, Date, JSON, String, Number, Object, Array, isNaN, window: {} };
vm.createContext(ctx);
['engine.js', 'words.js', 'progress.js'].forEach(f => vm.runInContext(R(f), ctx, { filename: f }));
const fail = []; const bad = m => fail.push(m);
const { KLISTS, WB } = ctx;
// 1. banks: no duplicates, all fields, sentences valid
['challenge_millie', 'challenge_kristan', 'english'].forEach(k => {
  const seen = {};
  KLISTS[k].words.forEach(w => {
    const key = w.word.toLowerCase(); if (seen[key]) bad(k + ': duplicate ' + w.word); seen[key] = 1;
    ['word', 'meaning', 'chunks', 'tricky', 'hook'].forEach(f => { if (!w[f]) bad(k + ': ' + w.word + ' missing ' + f); });
    if (k === 'english' && !w.group) bad('english: ' + w.word + ' missing group');
    (w.sentences || []).forEach(s => {
      if ((s.match(/___/g) || []).length !== 1) bad(k + ': ' + w.word + ' sentence needs exactly one ___: ' + s);
      if (s.toLowerCase().includes(w.word.toLowerCase())) bad(k + ': ' + w.word + ' sentence contains the word: ' + s);
    });
    if ((w.sentences || []).length < 2) bad(k + ': ' + w.word + ' needs 2 sentences');
  });
  console.log(k, KLISTS[k].words.length, 'words');
});
const fseen = {}; WB.french.forEach(x => { if (fseen[x.id]) bad('french duplicate ' + x.fr); fseen[x.id] = 1; if (x.kind === 'n' && !/^(m|f|pl)$/.test(x.g)) bad('french noun without gender ' + x.fr); });
console.log('french', WB.french.length, 'items,', Object.keys(WB.verbList).length, 'verbs');
// 2. quizzes
function checkQuiz(qs, label, n) {
  if (qs.length !== n) bad(label + ': ' + qs.length + ' questions, expected ' + n);
  const keys = {};
  qs.forEach(q => {
    if (!q) return bad(label + ': null question');
    const key = q.type === 'type' ? q.sentence : q.prompt + '|' + q.answer; if (keys[key]) bad(label + ': duplicate ' + key); keys[key] = 1;
    if (!q.gen || !q.explain) bad(label + ': missing gen/explain ' + JSON.stringify(q).slice(0, 120));
    if (JSON.stringify(q).match(/undefined|NaN/)) bad(label + ': undefined/NaN in ' + (q.prompt || q.sentence));
    if (q.type !== 'type') { if (q.options.indexOf(q.answer) < 0) bad(label + ': answer missing from options ' + q.prompt); if (new Set(q.options).size !== q.options.length) bad(label + ': duplicate options ' + q.prompt); if (q.options.length < 2) bad(label + ': too few options'); }
    else if (q.sentence.indexOf('_____') < 0) bad(label + ': typed without gap ' + q.sentence);
  });
}
for (let i = 0; i < 300; i++) for (const lv of [1, 2, 3]) {
  checkQuiz(ctx.buildQuiz('millie', lv, 10, [], 'challenge'), 'millie challenge', 10);
  checkQuiz(ctx.buildQuiz('kristan', lv, 10, [], 'challenge'), 'kristan challenge', 10);
  checkQuiz(ctx.buildQuiz('kristan', lv, 10, [], 'english'), 'english', 10);
  checkQuiz(ctx.buildQuiz('kristan', lv, 10, [], 'french'), 'french', 10);
}
// 3. every revision gen resolves
['millie', 'kristan'].forEach(c => ctx.REVISION[c].forEach(t => t.gens.forEach(g => { for (const lv of [1, 3]) { const q = ctx.genOne(c, g, lv); if (!q) bad('revision gen does not resolve: ' + c + ' ' + g); } })));
['millie', 'kristan'].forEach(c => ctx.REVISION[c].forEach(t => { const qs = ctx.buildRevision(c, t.id, 2, 10, []); if (qs.length < Math.min(10, t.gens.length)) bad('revision ' + t.id + ' only ' + qs.length); }));
// 4. spaced repetition: after a quiz, those words are held back; misses come back
const att = []; let t0 = Date.parse('2026-10-20T10:00:00Z');
function play(mode, child, okFn) {
  ctx.setWordHistory(att); const qs = ctx.buildQuiz(child, 2, 10, [], mode);
  att.push({ child, at: new Date(t0 += 3600e3).toISOString(), results: qs.map(q => ({ gen: q.gen, ok: okFn(q) })), score: 0, total: 10 }); return qs;
}
const q1 = play('challenge', 'kristan', q => false), q2 = play('challenge', 'kristan', () => true);
const w1 = q1.map(q => q.gen), w2 = q2.map(q => q.gen);
const overlap = w2.filter(g => w1.includes(g)).length; if (overlap > 3) bad('spaced repetition: ' + overlap + ' repeats straight after a quiz');
if (overlap < 1) bad('spaced repetition: missed words should come back');
ctx.setWordHistory(att);
const prog = ctx.wbProgress('kristan')[0]; console.log('kristan challenge progress', JSON.stringify({ m: prog.mastered, l: prog.learning, w: prog.winback, u: prog.unseen }));
console.log(fail.length ? 'FAIL\n' + [...new Set(fail)].slice(0, 40).join('\n') : 'ALL WORD TESTS PASSED');
process.exit(fail.length ? 1 : 0);
