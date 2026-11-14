/* Hollyend Health: Training tab (Dad only).
   Interval timer with sounds, a workout log (dictate or tap), charts that line
   the log up with the weekly Whoop uploads, and plain-English coaching.
   Data: health_docs, person 'harps', colls 'workouts' (this file) and 'whoop'
   (weekly rows Claude adds from the Whoop export). Uses window.HHAPI from app.js. */
(function () {
'use strict';
const A = () => window.HHAPI;
const ME = 'harps';

/* ---------- constants ---------- */
const TYPES = [
  ['kettlebell', 'Kettlebell', 'strength'], ['gym', 'Gym', 'strength'], ['run', 'Run', 'cardio'], ['jog', 'Jog', 'cardio'],
  ['rower', 'Rower', 'cardio'], ['bike', 'Bike', 'cardio'], ['padel', 'Padel', 'sport'], ['golf', 'Golf', 'walk'],
  ['walk', 'Walk', 'walk'], ['other', 'Other', 'cardio']
];
const TNAME = Object.fromEntries(TYPES.map(t => [t[0], t[1]]));
const TCAT = Object.fromEntries(TYPES.map(t => [t[0], t[2]]));
const CATS = [['strength', 'Strength', '#178A55'], ['cardio', 'Cardio', '#2F6FB0'], ['sport', 'Sport', '#8E5BB5'], ['walk', 'Walking', '#AEB8B2']];
const CATCOL = Object.fromEntries(CATS.map(c => [c[0], c[2]]));
const DIST_TYPES = ['run', 'jog', 'rower', 'bike', 'walk'];
const BELLS = [8, 12, 16, 20, 24, 28, 32];
/* Exercise library by movement pattern. Swaps offer others from the same
   pattern, so a swap keeps the session's purpose (e.g. a pull stays a pull). */
const EXLIB = {
  hinge: ['Swings', 'KB deadlift', 'Single-leg deadlift', 'Snatch', 'Deadlift'],
  legs: ['Goblet squat', 'Lunges', 'Split squat', 'Step-ups'],
  pull: ['Gorilla row', 'Single-arm row', 'Pull-ups', 'Lat pulldown', 'Renegade row', 'Face pulls'],
  vpush: ['Clean & press', 'Push press', 'Overhead press', 'Pike push-ups'],
  delts: ['Lateral raise', 'Upright row', 'Halo'],
  hpush: ['Push-ups', 'Floor press', 'Incline press'],
  core: ['Turkish get-up', 'Farmer carry', 'Plank', 'Windmill', 'Dead bug'],
  cardio: ['Run', 'Rower', 'Bike', 'Burpees', 'Mountain climbers', 'Skipping']
};
const EXPAT = {}; Object.keys(EXLIB).forEach(p => EXLIB[p].forEach(e => { if (!EXPAT[e]) EXPAT[e] = p; }));
const PATKIND = { hinge: 'hinge', legs: 'legs', pull: 'pull', vpush: 'push', delts: 'push', hpush: 'push', core: 'core', cardio: 'cardio' };
const EXS = Object.keys(EXLIB).filter(p => p !== 'cardio').flatMap(p => EXLIB[p].map(e => [e, PATKIND[p]])).filter((e, i, a) => a.findIndex(x => x[0] === e[0]) === i);
const EXKIND = Object.fromEntries(EXS.map(e => [e[0], e[1]]));
EXKIND.Deadlift = 'hinge';
function altsFor(ex, given) { const out = (given || []).slice(); const p = EXPAT[ex]; if (p) EXLIB[p].forEach(e => { if (e !== ex && !out.includes(e)) out.push(e); }); return out.filter(e => e !== ex).slice(0, 4); }
const WORK_OPTS = [10, 15, 20, 30, 40, 45, 50, 60, 75, 90, 120, 150, 180, 240, 300, 360, 420, 480, 600, 720, 900, 1200, 1500, 1800, 2400, 2700, 3600];
const REST_OPTS = [0, 5, 10, 15, 20, 30, 40, 45, 60, 75, 90, 120, 150, 180, 240, 300];
const PRESETS = [
  { id: 'kb', n: 'Kettlebell 40/20', kind: 'kettlebell', work: 40, rest: 20, rounds: 10 },
  { id: 'emom', n: 'KB EMOM', kind: 'kettlebell', work: 60, rest: 0, rounds: 12 },
  { id: 'tabata', n: 'Tabata', kind: 'kettlebell', work: 20, rest: 10, rounds: 8 },
  { id: 'run', n: 'Run intervals', kind: 'run', work: 180, rest: 90, rounds: 6 },
  { id: 'row', n: 'Rower 30/90', kind: 'rower', work: 30, rest: 90, rounds: 8 },
  { id: 'z2', n: 'Zone 2', kind: 'jog', work: 2400, rest: 0, rounds: 1 }
];

/* ---------- state ---------- */
const TR = {
  cfg: { kind: 'kettlebell', work: 40, rest: 20, rounds: 10, ready: 10, voice: true, circuit: [] },
  run: null, form: blankForm(), say: '', listening: false, planId: null, planAlts: {}, pickEx: false
};
try { const c = JSON.parse(localStorage.getItem('ht_cfg') || 'null'); if (c) Object.assign(TR.cfg, c); } catch (e) {}
function saveCfg() { try { localStorage.setItem('ht_cfg', JSON.stringify(TR.cfg)); } catch (e) {} }
function blankForm() { return { date: null, type: 'kettlebell', duration: '', rounds: '', work_s: null, rest_s: null, km: '', kg: '', ex: [], rpe: null, strain: '', hr: '', notes: '', source: 'manual', plan: null, swaps: [] }; }

/* ---------- small helpers ---------- */
function mmss(s) { s = Math.max(0, Math.round(s)); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(x).padStart(2, '0'); }
function durName(s) { if (s === 0) return 'None'; if (s < 60) return s + ' s'; if (s % 60 === 0) return (s / 60) + ' min'; return mmss(s); }
function totalSecs(c) { return c.ready + c.rounds * c.work + Math.max(0, c.rounds - 1) * c.rest; }
function avg(a) { const v = a.filter(x => x != null && isFinite(x)); return v.length ? v.reduce((x, y) => x + y, 0) / v.length : null; }
function r1(x) { return x == null ? '—' : (Math.round(x * 10) / 10).toString(); }
function workouts() { return A().col('workouts', ME).sort((a, b) => (b.date + (b.at || '')).localeCompare(a.date + (a.at || ''))); }
function whoopRows() { return A().col('whoop', ME).filter(w => w.week_start).sort((a, b) => a.week_start.localeCompare(b.week_start)); }

/* ---------- sound, voice, wake lock ---------- */
let AC = null, WL = null;
function audio() {
  if (!AC) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; AC = new C(); }
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
  if (AC.state === 'suspended') AC.resume();
  return AC;
}
function tone(freq, dur, at, vol, type) {
  const ac = audio(); if (!ac) return;
  const t = ac.currentTime + (at || 0), o = ac.createOscillator(), g = ac.createGain();
  o.type = type || 'square'; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.5, t + 0.01);
  g.gain.setValueAtTime(vol || 0.5, t + dur - 0.04); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(ac.destination); o.start(t); o.stop(t + dur + 0.02);
}
const SND = {
  tick: () => tone(880, 0.12, 0, 0.35),
  go: () => { tone(1320, 0.55, 0, 0.6); },
  rest: () => { tone(520, 0.28, 0, 0.55); tone(520, 0.28, 0.36, 0.55); },
  half: () => tone(990, 0.15, 0, 0.3, 'sine'),
  done: () => { tone(784, 0.2, 0, 0.55); tone(988, 0.2, 0.24, 0.55); tone(1318, 0.6, 0.48, 0.6); }
};
function buzz(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} }
function say(t) {
  if (!TR.cfg.voice || !window.speechSynthesis) return;
  try { const u = new SpeechSynthesisUtterance(t); u.lang = 'en-GB'; u.rate = 1.05; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) {}
}
async function wake(on) {
  try {
    if (on && 'wakeLock' in navigator && (!WL || WL.released)) WL = await navigator.wakeLock.request('screen');
    if (!on && WL) { await WL.release(); WL = null; }
  } catch (e) {}
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && TR.run && !TR.run.paused && !TR.run.done) { wake(true); tick(); } });

/* ---------- timer engine ---------- */
function phasesFor(c) {
  const p = [];
  if (c.ready > 0) p.push({ k: 'ready', d: c.ready, r: 1 });
  for (let r = 1; r <= c.rounds; r++) {
    p.push({ k: 'work', d: c.work, r });
    if (r < c.rounds && c.rest > 0) p.push({ k: 'rest', d: c.rest, r });
  }
  return p;
}
function start() {
  audio(); // unlock audio on the tap
  const c = TR.cfg, ph = phasesFor(c);
  const circ = (c.circuit || []).filter(Boolean);
  const seq = []; for (let r = 0; r < c.rounds; r++) seq.push(circ.length ? circ[r % circ.length] : null);
  TR.run = { cfg: Object.assign({}, c), ph, i: 0, end: Date.now() + ph[0].d * 1000, paused: false, left: null, done: false, beeped: {}, startedAt: new Date().toISOString(), workDone: 0, stopped: false, seq, swaps: [], plan: TR.planId };
  enterPhase(true);
  wake(true);
  loop();
  A().render();
}
let TIMER = null;
function loop() { clearInterval(TIMER); TIMER = setInterval(tick, 100); }
function enterPhase(first) {
  const R = TR.run, p = R.ph[R.i];
  R.beeped = {};
  const exNow = R.seq[p.r - 1], exNext = R.seq[p.r];
  if (p.k === 'ready') { SND.tick(); say('Get ready' + (exNow ? '. First up, ' + exNow : '')); }
  else if (p.k === 'work') { SND.go(); buzz([300]); say((R.cfg.rounds > 1 ? (p.r === R.cfg.rounds ? 'Last round. ' : 'Round ' + p.r + '. ') : '') + (exNow ? exNow + '. ' : '') + 'Go'); }
  else if (p.k === 'rest') { SND.rest(); buzz([150, 100, 150]); say('Rest' + (exNext ? '. Next, ' + exNext : '')); }
  if (!first) paintTimer(true);
}
function tick() {
  const R = TR.run; if (!R || R.paused || R.done) return;
  let now = Date.now();
  while (now >= R.end) {
    const p = R.ph[R.i];
    if (p.k === 'work') R.workDone = p.r;
    if (R.i >= R.ph.length - 1) return finish();
    R.i++; R.end += R.ph[R.i].d * 1000;
    if (now - R.end > 1500) { R.beeped = { 3: 1, 2: 1, 1: 1, h: 1 }; continue; } // caught up after the phone slept
    enterPhase(false);
  }
  const p = R.ph[R.i], left = (R.end - now) / 1000, sec = Math.ceil(left);
  if (sec <= 3 && sec >= 1 && !R.beeped[sec] && p.d >= 8) { R.beeped[sec] = 1; SND.tick(); }
  if (p.k === 'work' && p.d >= 120 && !R.beeped.h && left <= p.d / 2) { R.beeped.h = 1; SND.half(); say('Halfway'); }
  paintTimer(false);
}
function finish(stopped) {
  const R = TR.run; clearInterval(TIMER);
  R.done = true; R.stopped = !!stopped;
  if (!stopped) { R.workDone = R.cfg.rounds; SND.done(); buzz([200, 100, 200, 100, 400]); say('Done. Nice work'); }
  wake(false);
  const secs = Math.round((Date.now() - new Date(R.startedAt).getTime()) / 1000) - (R.cfg.ready || 0);
  if (R.workDone > 0) {
    const f = blankForm();
    Object.assign(f, { date: A().todayStr(), type: R.cfg.kind, rounds: String(R.workDone), work_s: R.cfg.work, rest_s: R.cfg.rest, duration: String(Math.max(1, Math.round(secs / 60))), source: 'timer' });
    const prev = workouts().find(w => w.type === R.cfg.kind); if (prev) { if (prev.kg) f.kg = String(prev.kg); if (prev.ex) f.ex = prev.ex.slice(); }
    const done = [...new Set(R.seq.slice(0, R.workDone).filter(Boolean))];
    if (done.length) f.ex = done;
    const pl = R.plan ? A().get('plans', R.plan, ME) : null;
    if (pl && pl.kg) f.kg = String(pl.kg);
    f.plan = R.plan || null; f.swaps = R.swaps.slice();
    if (R.swaps.length) f.notes = 'Swapped ' + R.swaps.map(x => x.from + ' → ' + x.to).join(', ') + '.';
    TR.form = f;
  }
  A().render();
}
function pause() { const R = TR.run; if (!R || R.done) return; if (!R.paused) { R.paused = true; R.left = R.end - Date.now(); wake(false); } else { R.paused = false; R.end = Date.now() + R.left; R.left = null; audio(); wake(true); } A().render(); }
function skip() { const R = TR.run; if (!R || R.done) return; if (R.paused) { R.paused = false; } R.end = Date.now(); tick(); A().render(); }
function reset() { clearInterval(TIMER); TR.run = null; wake(false); A().render(); }

function timerNumbers() {
  const R = TR.run, c = R ? R.cfg : TR.cfg;
  if (!R) return { k: 'idle', left: c.work, total: totalSecs(c), round: 0, rounds: c.rounds, frac: 0, next: '' };
  const p = R.ph[Math.min(R.i, R.ph.length - 1)];
  const left = R.done ? 0 : (R.paused ? R.left : R.end - Date.now()) / 1000;
  let rem = Math.max(0, left); for (let j = R.i + 1; j < R.ph.length; j++) rem += R.ph[j].d;
  const nx = R.ph[R.i + 1];
  return { k: R.done ? 'done' : p.k, left: Math.max(0, left), total: R.done ? 0 : rem, round: p.k === 'ready' ? 0 : p.r, rounds: c.rounds, frac: R.done ? 1 : 1 - Math.max(0, left) / p.d, next: nx ? (nx.k === 'work' ? 'Next: Round ' + nx.r + ' · ' + durName(nx.d) : 'Next: Rest ' + durName(nx.d)) : (R.done ? '' : 'Last one') };
}
const PHNAME = { idle: 'Ready when you are', ready: 'Get ready', work: 'Work', rest: 'Rest', done: 'Done' };
function paintTimer(full) {
  const el = document.getElementById('tmFace'); if (!el) return;
  if (full) { const card = document.getElementById('timerCard'); if (card) card.outerHTML = timerCard(); return; }
  const n = timerNumbers();
  const s = (id, v) => { const e = document.getElementById(id); if (e && e.textContent !== v) e.textContent = v; };
  s('tmClock', mmss(Math.ceil(n.left - 0.001)));
  s('tmLeft', mmss(n.total) + ' left');
  const b = document.getElementById('tmBar'); if (b) b.style.width = (n.frac * 100).toFixed(1) + '%';
}

/* ---------- views ---------- */
function opt(list, cur, fmt) { return list.map(v => '<option value="' + v + '"' + (Number(cur) === v ? ' selected' : '') + '>' + fmt(v) + '</option>').join(''); }
function timerCard() {
  const c = TR.cfg, R = TR.run, n = timerNumbers(), esc = A().esc;
  const face = '<div class="tm-face ph-' + n.k + (R && R.paused ? ' paused' : '') + '" id="tmFace">' +
    '<div class="tm-top"><span class="tm-ph">' + (R && R.paused ? 'Paused' : PHNAME[n.k]) + '</span><span class="tm-rd">' + (n.k === 'idle' ? c.rounds + ' round' + (c.rounds > 1 ? 's' : '') : n.k === 'done' ? (R.workDone + ' of ' + n.rounds + ' rounds') : n.round ? 'Round ' + n.round + ' / ' + n.rounds : 'Starting') + '</span></div>' +
    exLine(R, n) +
    '<div class="tm-clock num" id="tmClock">' + (n.k === 'done' ? '✓' : mmss(Math.ceil(n.left - 0.001))) + '</div>' +
    '<div class="tm-bar"><div id="tmBar" style="width:' + (n.frac * 100).toFixed(1) + '%"></div></div>' +
    '<div class="tm-top"><span id="tmNext">' + esc(n.k === 'idle' ? TNAME[c.kind] + ' · ' + durName(c.work) + ' on' + (c.rounds > 1 ? ' / ' + durName(c.rest) + ' rest' : '') : n.next) + '</span><span id="tmLeft" class="num">' + mmss(n.total) + (n.k === 'done' ? '' : ' left') + '</span></div></div>';
  let ctrls;
  const sw = swapPanel(R, n);
  if (!R) ctrls = '<button class="btn big" data-act="tm-start">Start</button>';
  else if (R.done) ctrls = '<div class="row tm-ctrls"><button class="btn" data-act="tm-again">Again</button><button class="btn ghost" data-act="tm-reset">New timer</button>' + (R.workDone ? '<a class="btn ghost" href="#trLog" data-act="tm-tolog">Log it ↓</a>' : '') + '</div>';
  else ctrls = '<div class="row tm-ctrls"><button class="btn" data-act="tm-pause">' + (R.paused ? 'Resume' : 'Pause') + '</button><button class="btn ghost" data-act="tm-skip">Skip ›</button><button class="btn danger" data-act="tm-stop">Stop</button></div>';
  const setup = R ? '' :
    '<div class="row" role="group" aria-label="Presets">' + PRESETS.map(p => '<button class="pill sm" data-act="tm-preset" data-id="' + p.id + '" aria-pressed="' + (c.kind === p.kind && c.work === p.work && c.rest === p.rest && c.rounds === p.rounds) + '">' + p.n + '</button>').join('') + '</div>' +
    '<div class="tm-set">' +
    '<label>Activity<select data-act="tm-cfg" data-k="kind">' + TYPES.filter(t => !['padel', 'golf'].includes(t[0])).map(t => '<option value="' + t[0] + '"' + (c.kind === t[0] ? ' selected' : '') + '>' + t[1] + '</option>').join('') + '</select></label>' +
    '<label>Work<select data-act="tm-cfg" data-k="work">' + opt(WORK_OPTS, c.work, durName) + '</select></label>' +
    '<label>Rest<select data-act="tm-cfg" data-k="rest">' + opt(REST_OPTS, c.rest, durName) + '</select></label>' +
    '<div class="tm-rounds"><span>Rounds</span><div class="stepper"><button data-act="tm-rounds" data-d="-1" aria-label="Fewer rounds">−</button><b class="num">' + c.rounds + '</b><button data-act="tm-rounds" data-d="1" aria-label="More rounds">+</button></div></div>' +
    '</div>' +
    circuitSetup() +
    '<div class="row between"><label class="checkrow" style="width:auto"><input type="checkbox" data-act="tm-voice"' + (c.voice ? ' checked' : '') + '>Voice cues</label>' +
    '<label class="row" style="display:flex;gap:6px;align-items:center">Get ready<select data-act="tm-cfg" data-k="ready" style="width:auto;padding:6px 8px">' + opt([0, 5, 10, 15, 20, 30], c.ready, v => v ? v + ' s' : 'Off') + '</select></label>' +
    '<button class="linkbtn" data-act="tm-test">Test sound</button></div>' +
    '<p class="note">Total ' + mmss(totalSecs(c)) + '. A high beep means go, two low beeps mean rest, three beeps count you into each change. The screen stays on while it runs. On iPhone, turn the volume up; it plays even on silent.</p>';
  return '<section class="card tm-card" id="timerCard" aria-label="Workout timer"><div class="between"><h2 class="h">Interval timer</h2>' + (TR.planId && (!R || !R.done) ? '<span class="chip">Today\'s plan</span>' : '') + (R && !R.done ? '<span class="chip green">Running</span>' : '') + '</div>' + face + sw + ctrls + setup + '</section>';
}

/* which round the swap buttons change: the next work round */
function swapIdx(R) { if (!R || R.done) return -1; const p = R.ph[R.i]; if (p.k === 'ready') return 0; if (p.k === 'rest') return p.r; if (p.k === 'work' && R.paused) return p.r - 1; return -1; }
function exLine(R, n) {
  const esc = A().esc;
  if (!R) { const c = TR.cfg.circuit || []; return c.length ? '<div class="tm-ex">' + esc(c[0]) + (c.length > 1 ? '<span> then ' + esc(c.slice(1, 3).join(', ')) + (c.length > 3 ? '…' : '') + '</span>' : '') + '</div>' : ''; }
  if (R.done || !R.seq.some(Boolean)) return '';
  const p = R.ph[R.i];
  if (p.k === 'work') return '<div class="tm-ex">' + esc(R.seq[p.r - 1] || '') + '</div>';
  const nx = R.seq[swapIdx(R)];
  return nx ? '<div class="tm-ex"><span>Next</span> ' + esc(nx) + '</div>' : '';
}
function swapPanel(R) {
  const i = swapIdx(R); if (i < 0 || !R.seq[i]) return '';
  const cur = R.seq[i], alts = altsFor(cur, TR.planAlts[cur] || (R.swaps.find(x => x.to === cur) ? TR.planAlts[R.swaps.find(x => x.to === cur).from] : null));
  if (!alts.length) return '';
  return '<div class="swap"><div class="tiny muted">Don\'t fancy ' + A().esc(cur) + '? Swap it for the rest of the session:</div><div class="row">' + alts.map(a => '<button class="pill sm" data-act="tm-swap" data-v="' + A().esc(a) + '">' + A().esc(a) + '</button>').join('') + '</div></div>';
}
function doSwap(to) {
  const R = TR.run, i = swapIdx(R); if (i < 0) return; const from = R.seq[i]; if (!from || from === to) return;
  for (let j = i; j < R.seq.length; j++) if (R.seq[j] === from) R.seq[j] = to;
  if (!TR.planAlts[to]) TR.planAlts[to] = altsFor(from, TR.planAlts[from]).filter(x => x !== to).concat([from]);
  R.swaps.push({ round: i + 1, from, to });
  say('Next, ' + to); paintTimer(true);
}
function circuitSetup() {
  const c = TR.cfg.circuit || [], esc = A().esc;
  const list = c.length ? '<div class="circ">' + c.map((e, i) => '<span>' + (i + 1) + '. ' + esc(e) + '</span>').join('') + '</div>' : '<span class="tiny muted">None: just work and rest.</span>';
  return '<div class="circwrap"><div class="between"><span class="small" style="font-weight:600">Exercises, in order</span><span class="row">' + (c.length ? '<button class="linkbtn" data-act="tm-circclear">Clear</button>' : '') + '<button class="linkbtn" data-act="tm-pick">' + (TR.pickEx ? 'Done' : c.length ? 'Change' : 'Choose') + '</button></span></div>' + list +
    (TR.pickEx ? '<div class="row exs" style="margin-top:6px">' + Object.keys(EXLIB).flatMap(p => EXLIB[p]).filter((e, i, a) => a.indexOf(e) === i).map(e => '<button class="pill xs" data-act="tm-circ" data-v="' + esc(e) + '" aria-pressed="' + c.includes(e) + '">' + esc(e) + '</button>').join('') + '</div><p class="note">Tap in the order you want them. They repeat round after round.</p>' : '') + '</div>';
}

/* ---------- Claude's plan for today ---------- */
function plans() { return A().col('plans', ME).filter(p => p.date).sort((a, b) => a.date.localeCompare(b.date)); }
function todaysPlan() { const t = A().todayStr(); return plans().find(p => p.date === t) || null; }
function loadPlan(p, opt) {
  const src = opt != null && p.options && p.options[opt] ? p.options[opt] : p;
  const c = src.cfg || {};
  Object.assign(TR.cfg, { kind: src.kind || p.kind || 'kettlebell', work: Number(c.work) || 40, rest: c.rest != null ? Number(c.rest) : 20, rounds: Math.min(15, Math.max(1, Number(c.rounds) || 1)), circuit: (src.circuit || []).map(x => x.ex) });
  TR.planAlts = {}; (src.circuit || []).forEach(x => { TR.planAlts[x.ex] = x.alts || []; });
  TR.planId = p.date; TR.pickEx = false; saveCfg();
  if (TR.run && TR.run.done) TR.run = null;
  A().render();
  const el = document.getElementById('timerCard'); if (el) el.scrollIntoView({ behavior: 'smooth' });
  A().toast('Loaded: ' + (src.title || p.title));
}
function planCardToday() {
  const A_ = A(), esc = A_.esc, p = todaysPlan(), t = A_.todayStr();
  const next = plans().find(x => x.date > t);
  if (!p) return '<section class="card plan-today"><div class="between"><h2 class="h">Today\'s session</h2><span class="chip">From Claude</span></div><div class="empty">No session planned for today.' + (next ? ' Next: <b>' + esc(next.title) + '</b> on ' + esc(A_.fmtD(next.date)) + '.' : '') + ' Claude reviews your training each evening and sets the next one.</div></section>';
  const done = workouts().some(w => w.plan === p.date);
  const c = p.cfg || {};
  const circ = (p.circuit || []).map((x, i) => '<li><b>' + esc(x.ex) + '</b>' + (x.kg ? ' <span class="chip">' + esc(x.kg) + ' kg</span>' : '') + (x.note ? '<span class="sub">' + esc(x.note) + '</span>' : '') + ((x.alts || []).length ? '<span class="sub">or ' + esc(x.alts.join(', ')) + '</span>' : '') + '</li>').join('');
  return '<section class="card plan-today"><div class="between"><h2 class="h">Today\'s session</h2>' + (done ? '<span class="chip green">Done ✓</span>' : '<span class="chip">From Claude</span>') + '</div>' +
    '<div><div class="pt-title">' + esc(p.title) + '</div><div class="small muted">' + esc(TNAME[p.kind] || '') + (c.work ? ' · ' + durName(Number(c.work)) + ' on' + (Number(c.rest) ? ' / ' + durName(Number(c.rest)) + ' rest' : '') + ' × ' + c.rounds : '') + (p.target_rpe ? ' · aim for effort ' + esc(p.target_rpe) : '') + '</div></div>' +
    (p.why ? '<p class="why">' + esc(p.why) + '</p>' : '') +
    (p.warmup ? '<div class="small"><b>Warm-up:</b> ' + esc(p.warmup) + '</div>' : '') +
    (circ ? '<ol class="circ-list">' + circ + '</ol>' : '') +
    (p.notes ? '<p class="note">' + esc(p.notes) + '</p>' : '') +
    '<button class="btn big" data-act="tp-load">' + (done ? 'Do it again' : 'Load into timer') + '</button>' +
    ((p.options || []).length ? '<div><div class="tiny muted" style="margin-bottom:6px">Not feeling it? Do this instead:</div><div class="row">' + p.options.map((o, i) => '<button class="pill sm" data-act="tp-opt" data-i="' + i + '" title="' + esc(o.why || '') + '">' + esc(o.title) + '</button>').join('') + '</div></div>' : '') +
    '</section>';
}
function reviewHtml() {
  const A_ = A(), esc = A_.esc;
  const r = A_.col('coach', ME).filter(x => x.date).sort((a, b) => b.date.localeCompare(a.date))[0];
  if (!r) return '';
  return '<div class="review"><div class="between"><b>Claude\'s review</b><span class="tiny muted">' + esc(A_.fmtD(r.date)) + '</span></div>' + (r.headline ? '<div class="rv-h">' + esc(r.headline) + '</div>' : '') + (r.text ? '<p>' + esc(r.text) + '</p>' : '') + ((r.points || []).length ? '<ul>' + r.points.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '') + (r.next ? '<div class="small"><b>Next:</b> ' + esc(r.next) + '</div>' : '') + '</div>';
}

function logCard() {
  const f = TR.form, esc = A().esc, t = A().todayStr();
  const showDist = DIST_TYPES.includes(f.type), showKg = ['kettlebell', 'gym'].includes(f.type), showEx = showKg;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  return '<section class="card" id="trLog" aria-label="Log a workout"><div class="between"><h2 class="h">Log a workout</h2>' + (f.source === 'timer' ? '<span class="chip green">Filled from the timer</span>' : '') + '</div>' +
    '<div class="say"><label>Say what you did<textarea data-act="tr-say" rows="2" placeholder="e.g. 10 rounds kettlebell, 20 kg swings and gorilla rows, felt like a 7. Or: 5 km run in 28 minutes">' + esc(TR.say) + '</textarea></label>' +
    '<div class="row">' + (SR ? '<button class="btn sm ghost" data-act="tr-mic">' + (TR.listening ? '■ Stop listening' : '🎙 Dictate') + '</button>' : '<span class="tiny muted">Tip: tap the mic on your keyboard to dictate.</span>') + '<button class="btn sm" data-act="tr-parse">Fill in from this</button></div></div>' +
    '<div class="row" role="group" aria-label="Type">' + TYPES.map(x => '<button class="pill sm" data-act="tr-type" data-v="' + x[0] + '" aria-pressed="' + (f.type === x[0]) + '">' + x[1] + '</button>').join('') + '</div>' +
    '<div class="fields">' +
    '<label>Date<input type="date" data-tf="date" value="' + esc(f.date || t) + '" max="' + t + '"></label>' +
    '<label>Minutes<input type="number" inputmode="numeric" data-tf="duration" value="' + esc(f.duration) + '"></label>' +
    '<label>Rounds<input type="number" inputmode="numeric" data-tf="rounds" value="' + esc(f.rounds) + '"></label>' +
    (showDist ? '<label>Distance (km)<input type="number" step="0.01" inputmode="decimal" data-tf="km" value="' + esc(f.km) + '"></label>' : '') +
    (showKg ? '<label>Bell / weight (kg)<select data-tf="kg"><option value="">—</option>' + BELLS.map(b => '<option' + (String(f.kg) === String(b) ? ' selected' : '') + '>' + b + '</option>').join('') + (f.kg && !BELLS.includes(Number(f.kg)) ? '<option selected>' + esc(f.kg) + '</option>' : '') + '</select></label>' : '') +
    '<label>Whoop strain<input type="number" step="0.1" inputmode="decimal" data-tf="strain" value="' + esc(f.strain) + '" placeholder="optional"></label>' +
    '<label>Avg HR<input type="number" inputmode="numeric" data-tf="hr" value="' + esc(f.hr) + '" placeholder="optional"></label>' +
    '</div>' +
    (f.work_s ? '<div class="tiny muted">Intervals: ' + durName(f.work_s) + ' on' + (f.rest_s ? ' / ' + durName(f.rest_s) + ' rest' : '') + '</div>' : '') +
    (showEx ? '<div><div class="small" style="font-weight:600;margin-bottom:6px">Exercises</div><div class="row exs">' + EXS.map(e => '<button class="pill xs ' + e[1] + '" data-act="tr-ex" data-v="' + esc(e[0]) + '" aria-pressed="' + f.ex.includes(e[0]) + '">' + esc(e[0]) + '</button>').join('') + '</div></div>' : '') +
    '<div><div class="small" style="font-weight:600;margin-bottom:6px">How hard? <span class="muted" style="font-weight:400">1 easy · 7 hard but could do 3 more · 10 nothing left</span></div><div class="rpe">' + [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => '<button data-act="tr-rpe" data-v="' + v + '" aria-pressed="' + (f.rpe === v) + '">' + v + '</button>').join('') + '</div></div>' +
    '<label>Notes<textarea data-tf="notes" rows="2" placeholder="Anything worth remembering">' + esc(f.notes) + '</textarea></label>' +
    '<div class="row"><button class="btn" data-act="tr-save">Save workout</button>' + (f.source === 'timer' || f.notes || f.duration ? '<button class="btn ghost" data-act="tr-clear">Clear</button>' : '') + '</div></section>';
}

function recentCard() {
  const ws = workouts().slice(0, 12), A_ = A();
  return '<section class="card list" aria-label="Recent workouts"><div class="between"><h2 class="h">Recent workouts</h2><span class="small muted">' + workouts().length + ' logged</span></div>' +
    (ws.map(w => '<div class="li"><div><div class="nm">' + A_.esc(TNAME[w.type] || w.type) + (w.rounds ? ' · ' + w.rounds + ' rounds' : '') + (w.km ? ' · ' + w.km + ' km' : '') + (w.kg ? ' · ' + w.kg + ' kg' : '') + '</div><div class="sub">' + A_.esc(A_.fmtD(w.date)) + (w.duration ? ' · ' + w.duration + ' min' : '') + (w.km && w.duration && ['run', 'jog', 'walk'].includes(w.type) ? ' · ' + mmss(w.duration * 60 / w.km) + '/km' : '') + (w.rpe ? ' · effort ' + w.rpe : '') + (w.ex && w.ex.length ? ' · ' + A_.esc(w.ex.join(', ')) : '') + (w.notes ? '<br>' + A_.esc(w.notes) : '') + '</div></div><button class="xbtn" data-act="tr-del" data-id="' + A_.esc(w.id) + '" aria-label="Remove">✕</button></div>').join('') || '<div class="empty">Nothing logged yet. Finish a timer or tell it what you did.</div>') + '</section>';
}

/* ---------- weekly model: log + Whoop ---------- */
function weekModel(nWeeks) {
  const A_ = A(), thisMon = A_.mondayOf(A_.todayStr());
  const wo = workouts(), wh = whoopRows();
  const out = [];
  for (let i = nWeeks - 1; i >= 0; i--) {
    const ws = A_.addDays(thisMon, -7 * i), we = A_.addDays(ws, 6);
    const logs = wo.filter(w => w.date >= ws && w.date <= we);
    const lm = { strength: 0, cardio: 0, sport: 0, walk: 0 }, ls = { strength: 0, cardio: 0, sport: 0, walk: 0 };
    logs.forEach(w => { const c = TCAT[w.type] || 'cardio'; lm[c] += Number(w.duration) || 0; ls[c]++; });
    const whp = wh.find(x => x.week_start === ws) || null;
    const m = {}, s = {};
    CATS.forEach(([c]) => { m[c] = Math.max(lm[c], whp && whp.minutes ? Number(whp.minutes[c]) || 0 : 0); s[c] = Math.max(ls[c], whp && whp.sessions ? Number(whp.sessions[c]) || 0 : 0); });
    const hiitLog = logs.filter(w => w.work_s && w.work_s <= 60 && w.rounds >= 6 && (w.rpe || 8) >= 7).length;
    out.push({ ws, we, current: i === 0, logs, whoop: whp, min: m, ses: s, hiit: Math.max(hiitLog, whp ? Number(whp.hiit_sessions) || 0 : 0), rpe: avg(logs.map(w => w.rpe)), partial: i === 0 || (whp && whp.days && whp.days < 5) });
  }
  return out;
}

/* ---------- charts (SVG, same look as the rest of Health) ---------- */
function wkLabel(ws) { return A().pd(ws).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); }
function legend(items) { return '<div class="legend">' + items.map(([n, c, dash]) => '<span><i style="background:' + (dash ? 'none;border-top:2px dashed ' + c + ';height:0' : c) + '"></i>' + n + '</span>').join('') + '</div>'; }
function barChart(o) {
  // o: {labels, stacks:[{name,color,values}], target, targetLabel, max, unit, fade:[bool], H, fmt}
  const W = 360, H = o.H || 170, L = 32, R = 8, T = 12, B = 24, n = o.labels.length, bw = (W - L - R) / n;
  const tot = o.labels.map((_, i) => o.stacks.reduce((s, st) => s + (Number(st.values[i]) || 0), 0));
  const vmax = o.max || Math.max(o.target ? o.target * 1.2 : 0, ...tot, 1);
  const y = v => T + (1 - v / vmax) * (H - T - B);
  const step = niceStep(vmax);
  let g = '';
  for (let v = 0; v <= vmax + 1e-9; v += step) g += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(v).toFixed(1) + '" y2="' + y(v).toFixed(1) + '" stroke="#EEF2EF"/><text x="' + (L - 5) + '" y="' + (y(v) + 3).toFixed(1) + '" text-anchor="end">' + (o.fmt ? o.fmt(v) : Math.round(v)) + '</text>';
  o.labels.forEach((lab, i) => {
    let base = 0; const x = L + i * bw + 3, w = Math.max(2, bw - 6);
    o.stacks.forEach(st => { const v = Number(st.values[i]) || 0; if (v <= 0) return; const col = typeof st.color === 'function' ? st.color(v, i) : st.color;
      g += '<rect x="' + x.toFixed(1) + '" y="' + y(base + v).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + (y(base) - y(base + v)).toFixed(1) + '" fill="' + col + '"' + (o.fade && o.fade[i] ? ' opacity=".45"' : '') + ' rx="2"><title>' + A().esc(lab + ' · ' + st.name + ': ' + (o.tip ? o.tip(v) : Math.round(v * 10) / 10 + (o.unit || ''))) + '</title></rect>'; base += v; });
    if (i % Math.ceil(n / 6) === (n - 1) % Math.ceil(n / 6)) g += '<text x="' + (x + w / 2).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle">' + A().esc(lab) + '</text>';
  });
  if (o.target) g += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(o.target).toFixed(1) + '" y2="' + y(o.target).toFixed(1) + '" stroke="#15201B" stroke-width="1.2" stroke-dasharray="5 4"/><text x="' + (W - R) + '" y="' + (y(o.target) - 4).toFixed(1) + '" text-anchor="end" style="fill:#15201B">' + A().esc(o.targetLabel || 'target') + '</text>';
  return '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + A().esc(o.aria || 'Bar chart') + '">' + g + '</svg>';
}
function niceStep(vmax) { const raw = vmax / 4, p = Math.pow(10, Math.floor(Math.log10(raw || 1))), m = raw / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p; }
function lineChart(o) {
  // o: {labels, series:[{name,color,values}], unit, lo, hi, ref, refLabel, H}
  const W = 360, H = o.H || 150, L = 32, R = 10, T = 12, B = 24, n = o.labels.length;
  const all = o.series.flatMap(s => s.values).filter(v => v != null);
  if (!all.length) return '<div class="empty">' + (o.empty || 'No data yet.') + '</div>';
  let lo = o.lo != null ? o.lo : Math.floor(Math.min(...all, o.ref != null ? o.ref : Infinity) - 1), hi = o.hi != null ? o.hi : Math.ceil(Math.max(...all, o.ref != null ? o.ref : -Infinity) + 1);
  if (hi - lo < 2) { lo -= 1; hi += 1; }
  const x = i => L + (n === 1 ? (W - L - R) / 2 : i / (n - 1) * (W - L - R)), y = v => T + (1 - (v - lo) / (hi - lo)) * (H - T - B);
  const step = niceStep(hi - lo);
  let g = '';
  for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) g += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(v).toFixed(1) + '" y2="' + y(v).toFixed(1) + '" stroke="#EEF2EF"/><text x="' + (L - 5) + '" y="' + (y(v) + 3).toFixed(1) + '" text-anchor="end">' + (Math.round(v * 10) / 10) + '</text>';
  if (o.ref != null) g += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(o.ref).toFixed(1) + '" y2="' + y(o.ref).toFixed(1) + '" stroke="#15201B" stroke-width="1.2" stroke-dasharray="5 4"/><text x="' + (W - R) + '" y="' + (y(o.ref) - 4).toFixed(1) + '" text-anchor="end" style="fill:#15201B">' + A().esc(o.refLabel || '') + '</text>';
  o.labels.forEach((lab, i) => { if (i % Math.ceil(n / 6) === (n - 1) % Math.ceil(n / 6)) g += '<text x="' + x(i).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle">' + A().esc(lab) + '</text>'; });
  o.series.forEach(s => {
    let d = '', pen = false;
    s.values.forEach((v, i) => { if (v == null) { pen = false; return; } d += (pen ? 'L' : 'M') + x(i).toFixed(1) + ',' + y(v).toFixed(1); pen = true; });
    g += '<path d="' + d + '" fill="none" stroke="' + s.color + '" stroke-width="2.2" stroke-linejoin="round"/>';
    s.values.forEach((v, i) => { if (v != null) g += '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(v).toFixed(1) + '" r="3.2" fill="' + s.color + '"' + (s.fade && s.fade[i] ? ' opacity=".45"' : '') + '><title>' + A().esc(o.labels[i] + ' · ' + s.name + ': ' + (Math.round(v * 10) / 10) + (o.unit || '')) + '</title></circle>'; });
    const li = s.values.map((v, i) => v == null ? -1 : i).filter(i => i >= 0).pop();
    if (li != null && li >= 0 && o.endLabel !== false) g += '<text x="' + Math.min(W - R, x(li) + 4).toFixed(1) + '" y="' + (y(s.values[li]) - 7).toFixed(1) + '" text-anchor="end" style="fill:' + s.color + ';font-weight:600">' + (Math.round(s.values[li] * 10) / 10) + '</text>';
  });
  return '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + A().esc(o.aria || 'Line chart') + '">' + g + '</svg>';
}
function heatmap(nWeeks) {
  const A_ = A(), thisMon = A_.mondayOf(A_.todayStr()), t = A_.todayStr(), wo = workouts();
  const W = 360, cs = 18, gap = 4, L = 30, T = 4;
  let g = '';
  ['M', 'T', 'W', 'T', 'F', 'S', 'S'].forEach((d, i) => { g += '<text x="' + (L - 8) + '" y="' + (T + i * (cs + gap) + 13) + '" text-anchor="end">' + d + '</text>'; });
  const colW = Math.min(cs + gap, (W - L) / nWeeks);
  for (let w = 0; w < nWeeks; w++) {
    const ws = A_.addDays(thisMon, -7 * (nWeeks - 1 - w));
    for (let d = 0; d < 7; d++) {
      const day = A_.addDays(ws, d), logs = wo.filter(x => x.date === day);
      const cat = logs.length ? (logs.some(x => TCAT[x.type] === 'strength') ? 'strength' : TCAT[logs[0].type]) : null;
      const fill = day > t ? '#fff' : cat ? CATCOL[cat] : '#EDF1EE';
      g += '<rect x="' + (L + w * colW).toFixed(1) + '" y="' + (T + d * (cs + gap)) + '" width="' + (colW - gap).toFixed(1) + '" height="' + cs + '" rx="4" fill="' + fill + '"' + (day === t ? ' stroke="#15201B" stroke-width="1.5"' : '') + '><title>' + A_.esc(A_.fmtD(day) + (logs.length ? ': ' + logs.map(x => TNAME[x.type] + (x.duration ? ' ' + x.duration + ' min' : '')).join(', ') : '')) + '</title></rect>';
    }
    if (w % 3 === (nWeeks - 1) % 3) g += '<text x="' + (L + w * colW + (colW - gap) / 2).toFixed(1) + '" y="' + (T + 7 * (cs + gap) + 10) + '" text-anchor="middle">' + A_.esc(wkLabel(ws)) + '</text>';
  }
  return '<svg class="chart" viewBox="0 0 ' + W + ' ' + (T + 7 * (cs + gap) + 16) + '" role="img" aria-label="Days trained">' + g + '</svg>';
}
function donut(parts) {
  const tot = parts.reduce((s, p) => s + p.v, 0); if (!tot) return '<div class="empty">No minutes yet.</div>';
  const R = 52, r = 32, cx = 64, cy = 64; let a0 = -Math.PI / 2, g = '';
  parts.filter(p => p.v > 0).forEach(p => {
    const a1 = a0 + p.v / tot * Math.PI * 2 - 1e-4, big = a1 - a0 > Math.PI ? 1 : 0;
    const P = (rad, a) => (cx + rad * Math.cos(a)).toFixed(2) + ',' + (cy + rad * Math.sin(a)).toFixed(2);
    g += '<path d="M' + P(R, a0) + ' A' + R + ',' + R + ' 0 ' + big + ' 1 ' + P(R, a1) + ' L' + P(r, a1) + ' A' + r + ',' + r + ' 0 ' + big + ' 0 ' + P(r, a0) + 'Z" fill="' + p.c + '" stroke="#fff" stroke-width="2"><title>' + A().esc(p.n + ': ' + Math.round(p.v) + ' min') + '</title></path>';
    a0 = a1 + 1e-4;
  });
  g += '<text x="' + cx + '" y="' + (cy - 2) + '" text-anchor="middle" style="font-size:17px;font-weight:700;fill:#15201B">' + Math.round(tot) + '</text><text x="' + cx + '" y="' + (cy + 13) + '" text-anchor="middle">min</text>';
  return '<div class="donut"><svg viewBox="0 0 128 128" width="128" height="128" role="img" aria-label="Training mix">' + g + '</svg><div>' + parts.map(p => '<div class="dl"><i style="background:' + p.c + '"></i>' + A().esc(p.n) + '<b class="num">' + Math.round(p.v / tot * 100) + '%</b></div>').join('') + '</div></div>';
}

/* ---------- coaching ---------- */
function coaching(wm) {
  const A_ = A(), full = wm.filter(w => !w.current), last4 = full.slice(-4), prev4 = full.slice(-8, -4);
  const out = [];
  const str4 = avg(last4.map(w => w.ses.strength)), strPrev = avg(prev4.map(w => w.ses.strength));
  const car4 = avg(last4.map(w => w.min.cardio + w.min.sport)), hiit4 = last4.reduce((s, w) => s + w.hiit, 0);
  const wh = whoopRows(), wh4 = wh.slice(-4).filter(w => (w.days || 7) >= 3);
  const sleep4 = avg(wh4.map(w => w.sleep_h)), rec4 = avg(wh4.map(w => w.recovery)), lastW = wh[wh.length - 1];
  const hrv4 = avg(wh4.map(w => w.hrv)), hrvOld = avg(wh.slice(0, 4).map(w => w.hrv));
  const rhr4 = avg(wh4.map(w => w.rhr)), rhrOld = avg(wh.slice(0, 4).map(w => w.rhr));
  const goods = [];

  // 1. sleep first
  if (sleep4 != null) {
    const under = wh4.reduce((s, w) => s + (Number(w.nights_under_7h) || 0), 0), nights = wh4.reduce((s, w) => s + (Number(w.days) || 7), 0);
    if (sleep4 < 6.5) out.push({ c: 'red', b: 'Sleep is the biggest thing holding you back', t: 'Averaging ' + r1(sleep4) + ' h a night over the last 4 weeks, with ' + under + ' of ' + nights + ' nights under 7 h. Short sleep blunts fat loss and muscle repair more than any missed session. Protect 7+ hours before adding training.' });
    else if (sleep4 < 7) out.push({ c: 'amber', b: 'Sleep is close, not there', t: r1(sleep4) + ' h average. Another 30 minutes a night would do more for recovery than an extra workout.' });
    else goods.push('sleep is averaging ' + r1(sleep4) + ' h');
  }
  // 2. strength frequency (V-shape driver)
  if (str4 != null) {
    if (str4 < 2) out.push({ c: 'red', b: 'Strength has slipped to ' + r1(str4) + ' sessions a week', t: (strPrev != null && strPrev > str4 + 0.5 ? 'It was ' + r1(strPrev) + ' a week the month before. ' : '') + 'The V-shape comes from back and shoulder work done often. Get back to 3 short sessions a week (30–40 min is plenty) before making any session longer.', a: { act: 'tm-preset', id: 'kb', label: 'Start a 40/20' } });
    else if (str4 < 3) out.push({ c: 'amber', b: r1(str4) + ' strength sessions a week', t: 'One more a week gets you to the 3 that builds shoulders and lats steadily.' });
    else goods.push(r1(str4) + ' strength sessions a week');
  }
  // 3. cardio
  if (car4 != null) {
    if (car4 < 90) out.push({ c: 'red', b: 'Cardio is low: ' + Math.round(car4) + ' min a week', t: 'Aim for 150 min of easy Zone 2 (you can talk in full sentences) across 3 sessions. Jogging, rower or padel all count. It\'s the best thing you can do for heart health and it burns fat without eating into recovery.', a: { act: 'tm-preset', id: 'z2', label: 'Zone 2 timer' } });
    else if (car4 < 150) out.push({ c: 'amber', b: Math.round(car4) + ' min of cardio a week', t: 'Up to 150 by adding ' + Math.round(150 - car4) + ' min of easy jogging or rowing.' });
    else goods.push(Math.round(car4) + ' min of cardio a week');
  }
  if (hiit4 === 0) out.push({ c: 'amber', b: 'No hard intervals in the last 4 weeks', t: 'One short session a week (rower 30 s hard / 90 s easy × 8, or KB swings 20/10) lifts fitness fast and only takes 20 minutes.', a: { act: 'tm-preset', id: 'row', label: 'Rower 30/90' } });
  else if (hiit4 > 8) out.push({ c: 'amber', b: hiit4 + ' hard interval sessions in 4 weeks', t: 'That\'s a lot at this stage. Keep it to 1–2 a week and make the rest easy.' });

  // 4. trends
  if (hrv4 != null && hrvOld != null && wh.length >= 8) {
    if (hrv4 < hrvOld - 3) out.push({ c: 'amber', b: 'HRV is drifting down', t: r1(hrvOld) + ' ms in early weeks, ' + r1(hrv4) + ' ms lately. Usually sleep, stress or alcohol, not too little training.' });
    else if (hrv4 > hrvOld + 2) goods.push('HRV up from ' + r1(hrvOld) + ' to ' + r1(hrv4) + ' ms');
  }
  if (rhr4 != null && rhrOld != null && wh.length >= 8 && rhr4 < rhrOld - 1) goods.push('resting HR down to ' + r1(rhr4));

  // 5. body
  const gw = A_.col('growth', ME).filter(g => g.weight_kg).sort((a, b) => a.date.localeCompare(b.date));
  if (gw.length >= 2) {
    const f = gw[0], l = gw[gw.length - 1], wks = (A_.pd(l.date) - A_.pd(f.date)) / 6048e5;
    const rate = wks > 0 ? (l.weight_kg - f.weight_kg) / wks : 0;
    const waist = A_.col('growth', ME).filter(g => g.waist_cm).sort((a, b) => a.date.localeCompare(b.date)).pop();
    const waistAge = waist ? (A_.pd(A_.todayStr()) - A_.pd(waist.date)) / 864e5 : 999;
    out.push({ c: rate < -0.6 ? 'amber' : 'green', b: (rate <= 0 ? 'Down ' : 'Up ') + Math.abs(l.weight_kg - f.weight_kg).toFixed(1) + ' kg since ' + A_.fmtD(f.date, { month: 'short', year: 'numeric' }), t: f.weight_kg + ' → ' + l.weight_kg + ' kg, about ' + Math.abs(rate).toFixed(2) + ' kg a week. ' + (rate < -0.6 ? 'That\'s faster than ideal; 0.25–0.5 kg a week keeps the muscle on.' : rate < -0.15 ? 'A good, muscle-sparing pace.' : 'Slow. A modest deficit (your 2,250 kcal target) plus 3 strength days moves this.') + (waistAge > 28 ? ' Waist was last measured ' + (waist ? A_.fmtD(waist.date, { month: 'short', year: 'numeric' }) + ' (' + waist.waist_cm + ' cm)' : 'never') + '. Measure it monthly at the navel: shoulders up, waist down is the V.' : '') });
  }

  // 6. progression from the log
  const kb = workouts().filter(w => ['kettlebell', 'gym'].includes(w.type) && w.rpe).slice(0, 3);
  if (kb.length >= 2) {
    const r = avg(kb.map(w => w.rpe));
    if (r <= 6) out.push({ c: 'green', b: 'Ready to push: last ' + kb.length + ' strength sessions averaged effort ' + r1(r), t: 'Add one round next time, or 5 s more work per round. When 10 rounds feels like a 6, move up a bell (16 → 20 → 24 kg). Have a 12 kg and 16 kg for pressing and raises; the jump from 8 to 20 is too big for shoulders.' });
    else if (r >= 8.5) out.push({ c: 'amber', b: 'Effort is very high (' + r1(r) + ')', t: 'Hold the same session until it drops to about 7 before adding more. Growth comes from steady sessions, not grinding.' });
    else goods.push('strength effort is in the sweet spot (' + r1(r) + ')');
  }
  const ex28 = workouts().filter(w => w.date >= A_.addDays(A_.todayStr(), -28)).flatMap(w => w.ex || []);
  const pulls = ex28.filter(e => EXKIND[e] === 'pull').length, pushes = ex28.filter(e => EXKIND[e] === 'push').length;
  if (pulls + pushes >= 4) {
    if (pulls < pushes * 1.5) out.push({ c: 'amber', b: 'More pulling for the V', t: 'Last 4 weeks: ' + pulls + ' pulling vs ' + pushes + ' pressing exercises. Wide lats make the V; aim for about 2 pulls for every press (rows, pull-ups, pulldowns, face pulls).' });
    else goods.push('pull-to-press balance is good (' + pulls + ':' + pushes + ')');
  }
  if (!workouts().length) out.push({ c: 'grey', b: 'Log a few sessions with an effort score', t: 'Then this will tell you when to add rounds or go up a bell.' });

  // verdict
  let verdict;
  const sleepBad = sleep4 != null && sleep4 < 6.5, strLow = str4 != null && str4 < 2.5;
  if (sleepBad && strLow) verdict = 'Push more often, not harder or longer. Three short strength sessions and two easy runs a week, with sleep as the priority, will move you further than longer sessions.';
  else if (sleepBad) verdict = 'Hold the training load and fix sleep first; then add intensity.';
  else if (strLow) verdict = 'Push more often: the gap is frequency, not effort.';
  else verdict = 'You\'re consistent. Now push harder: add a round, a little more work time, or a heavier bell when effort drops to 6.';
  const rz = lastW ? lastW.recovery : null;
  const today = rz == null ? '' : rz >= 67 ? 'Latest Whoop week averaged ' + Math.round(rz) + '% recovery: green. Good week to go hard.' : rz >= 34 ? 'Latest Whoop week averaged ' + Math.round(rz) + '% recovery: yellow. Train, but keep intervals moderate.' : 'Latest Whoop week averaged ' + Math.round(rz) + '% recovery: red. Easy sessions and an early night.';
  return { out, goods, verdict, today };
}

function planCard() {
  const days = [
    ['Mon', 'KB upper · pull', 'Gorilla rows, single-arm rows, clean & press, halos. 40/20 × 10.'],
    ['Tue', 'Zone 2', '40 min easy jog or row. Conversational pace.'],
    ['Wed', 'Gym · lats & shoulders', 'Pull-ups or pulldown, seated row, overhead press, lateral raises, face pulls. 3–4 sets of 8–15.'],
    ['Thu', 'Zone 2 or padel', '40–60 min, easy.'],
    ['Fri', 'KB full body', 'Swings, goblet squats, push press, get-ups, farmer carries. 40/20 × 10–12.'],
    ['Sat', 'Intervals', 'Rower 30/90 × 8, or run 3 min / 90 s × 6. Golf counts as extra walking.'],
    ['Sun', 'Rest', 'Walk, stretch, early night.']
  ];
  return '<section class="card"><h2 class="h">The week for a V-shape</h2>' +
    '<div class="plan">' + days.map(d => '<div><b>' + d[0] + '</b><span class="nm">' + d[1] + '</span><span class="sub">' + d[2] + '</span></div>').join('') + '</div>' +
    '<ul class="tips">' +
    '<li><b>Build the top, shrink the middle.</b> Lats and side delts make the V; aim for 10–20 hard sets a week for back, and 8–12 for side delts.</li>' +
    '<li><b>No bulking needed.</b> Moderate weights for 8–15 reps, stopping 1–3 reps short of failure, build muscle in a deficit and are kind to joints.</li>' +
    '<li><b>Progress slowly.</b> Add a rep or a round before adding weight. Every 5th or 6th week, go lighter.</li>' +
    '<li><b>Warm up 5 minutes</b> (halos, light swings, band pull-aparts). No max lifts; tendons and joints recover slower than muscle as you get older.</li>' +
    '<li><b>Eat for it.</b> Your 170 g protein and 2,250 kcal targets fit: about 0.5 kg a week off while keeping muscle.</li>' +
    '</ul></section>';
}

/* ---------- main view ---------- */
function view() {
  const A_ = A(), wm = weekModel(12), labels = wm.map(w => wkLabel(w.ws)), fade = wm.map(w => !!w.partial);
  const cur = wm[wm.length - 1], co = coaching(wm), wh = whoopRows(), whW = wm.map(w => w.whoop);
  const thisWk = cur.logs.length;
  const totalMin = w => CATS.reduce((s, [c]) => s + (c === 'walk' ? 0 : w.min[c]), 0);
  const lastWh = wh[wh.length - 1];
  const tiles = '<div class="tiles">' +
    A_.tile('This week', thisWk + '<small> logged</small>', Math.round(totalMin(cur)) + ' training min so far', '') +
    A_.tile('Strength', cur.ses.strength + '<small> / 3</small>', 'sessions this week', cur.ses.strength >= 3 ? 'green' : '') +
    A_.tile('Cardio', Math.round(cur.min.cardio + cur.min.sport) + '<small> / 150</small>', 'minutes this week', '') +
    A_.tile('Recovery', lastWh ? Math.round(lastWh.recovery) + '<small>%</small>' : '—', lastWh ? 'Whoop, week of ' + A_.esc(wkLabel(lastWh.week_start)) : 'No Whoop data yet', lastWh && lastWh.recovery < 34 ? 'amber' : '') +
    A_.tile('Sleep', lastWh ? r1(lastWh.sleep_h) + '<small> h</small>' : '—', lastWh ? lastWh.nights_under_7h + ' nights under 7 h' : '', lastWh && lastWh.sleep_h < 7 ? 'amber' : '') + '</div>';

  const stackMin = barChart({ labels, aria: 'Training minutes per week', stacks: CATS.filter(c => c[0] !== 'walk').map(([c, n, col]) => ({ name: n, color: col, values: wm.map(w => w.min[c]) })), target: 150, targetLabel: '150 min', fade, unit: ' min' });
  const strBars = barChart({ labels, aria: 'Strength sessions per week', stacks: [{ name: 'Strength sessions', color: (v) => v >= 3 ? '#178A55' : v >= 2 ? '#E9A65C' : '#C8504B', values: wm.map(w => w.ses.strength) }], target: 3, targetLabel: '3 a week', max: 5, fade, H: 140, fmt: v => v });
  const recBars = barChart({ labels, aria: 'Whoop recovery per week', stacks: [{ name: 'Recovery', color: v => v >= 67 ? '#178A55' : v >= 34 ? '#E9A65C' : '#C8504B', values: whW.map(w => w ? w.recovery : 0) }], max: 100, fade, H: 140, unit: '%', fmt: v => v + '%' });
  const sleepBars = barChart({ labels, aria: 'Average sleep per week', stacks: [{ name: 'Sleep', color: v => v >= 7 ? '#2F6FB0' : '#9DB8D6', values: whW.map(w => w ? w.sleep_h : 0) }], target: 7, targetLabel: '7 h', max: 9, fade, H: 140, tip: v => r1(v) + ' h', fmt: v => v + 'h' });
  const hrv = lineChart({ labels, aria: 'HRV per week', series: [{ name: 'HRV', color: '#178A55', values: whW.map(w => w ? w.hrv : null), fade }], unit: ' ms', empty: 'Whoop uploads fill this in.' });
  const rhr = lineChart({ labels, aria: 'Resting heart rate per week', series: [{ name: 'Resting HR', color: '#C8504B', values: whW.map(w => w ? w.rhr : null), fade }], unit: ' bpm', empty: 'Whoop uploads fill this in.' });
  const strain = lineChart({ labels, aria: 'Whoop strain per week', series: [{ name: 'Strain', color: '#8E5BB5', values: whW.map(w => w ? w.strain : null), fade }], lo: 0, hi: 21, ref: 10, refLabel: 'moderate 10', empty: 'Whoop uploads fill this in.' });

  // body
  const gr = A_.col('growth', ME).sort((a, b) => a.date.localeCompare(b.date));
  const gW = gr.filter(g => g.weight_kg), gWa = gr.filter(g => g.waist_cm);
  const body = gW.length ? lineChart({ labels: gW.map(g => A_.fmtD(g.date, { day: 'numeric', month: 'short' })), aria: 'Weight', series: [{ name: 'Weight', color: '#15201B', values: gW.map(g => Number(g.weight_kg)) }], unit: ' kg' }) : '<div class="empty">Add weigh-ins on the Progress tab (switch to Me).</div>';

  // effort per strength/cardio session
  const recent = workouts().slice(0, 16).reverse();
  const effort = recent.length ? barChart({ labels: recent.map(w => A_.fmtD(w.date, { day: 'numeric', month: 'short' })), aria: 'Minutes and effort per session', stacks: [{ name: 'Minutes', color: (v, i) => CATCOL[TCAT[recent[i].type]] || '#2F6FB0', values: recent.map(w => Number(w.duration) || 0) }], H: 150, unit: ' min' }) +
    '<div class="effort">' + recent.map(w => '<span title="' + A_.esc(TNAME[w.type]) + '" class="' + (w.rpe >= 8 ? 'hi' : w.rpe >= 6 ? 'md' : w.rpe ? 'lo' : '') + '">' + (w.rpe || '·') + '</span>').join('') + '</div><p class="note">Bars: minutes, coloured by type. Numbers underneath: how hard it felt.</p>' : '<div class="empty">Each logged session appears here with its effort score.</div>';

  // mix last 4 weeks
  const l4 = wm.slice(-4), mix = CATS.map(([c, n, col]) => ({ n, c: col, v: l4.reduce((s, w) => s + w.min[c], 0) }));

  // weekly table
  const rows = wm.slice().reverse().map(w => '<tr' + (w.current ? ' class="cur"' : '') + '><td>' + A_.esc(wkLabel(w.ws)) + (w.current ? ' <span class="chip">now</span>' : '') + '</td><td class="n">' + w.logs.length + '</td><td class="n">' + w.ses.strength + '</td><td class="n">' + Math.round(w.min.cardio + w.min.sport) + '</td><td class="n">' + (w.rpe ? r1(w.rpe) : '—') + '</td><td class="n">' + (w.whoop ? r1(w.whoop.strain) : '—') + '</td><td class="n">' + (w.whoop ? Math.round(w.whoop.recovery) + '%' : '—') + '</td><td class="n">' + (w.whoop ? r1(w.whoop.sleep_h) : '—') + '</td><td class="n">' + (w.whoop ? r1(w.whoop.hrv) : '—') + '</td></tr>').join('');

  const coachHtml = '<section class="card coach" aria-label="How you\'re doing"><div class="between"><h2 class="h">How you\'re doing</h2><span class="tiny muted">Last 4 full weeks, log + Whoop</span></div>' +
    reviewHtml() + '<div class="verdict"><b>Should you push harder?</b><span>' + A_.esc(co.verdict) + '</span>' + (co.today ? '<span class="tiny muted">' + A_.esc(co.today) + '</span>' : '') + '</div>' +
    co.out.map(n => '<div class="alert ' + n.c + '"><span class="dot"></span><div><b>' + A_.esc(n.b) + '</b><span class="t">' + A_.esc(n.t) + '</span></div>' + (n.a ? '<button class="btn sm ghost act" data-act="' + n.a.act + '" data-id="' + A_.esc(n.a.id) + '">' + A_.esc(n.a.label) + '</button>' : '') + '</div>').join('') +
    (co.goods.length ? '<div class="alert green"><span class="dot"></span><div><b>Going well</b><span class="t">' + A_.esc(co.goods.join('; ')) + '.</span></div></div>' : '') + '</section>';

  return '<div class="between"><h1 class="h1">Training</h1><span class="small muted">Send your weekly Whoop export to Claude and it lines up here.</span></div>' +
    '<div class="grid3 trtop">' + planCardToday() + timerCard() + logCard() + '</div>' +
    tiles +
    '<div class="grid2">' + coachHtml + planCard() + '</div>' +
    '<div class="grid3">' +
    card('Training minutes per week', 'log or Whoop, whichever is higher; walking not counted', stackMin + legend(CATS.filter(c => c[0] !== 'walk').map(c => [c[1], c[2]]).concat([['150 min target', '#15201B', 1]]))) +
    card('Strength sessions', 'target 3 a week', strBars) +
    card('Mix, last 4 weeks', 'minutes by type', donut(mix)) +
    card('Days trained', 'from your log, last 12 weeks', heatmap(12) + legend(CATS.map(c => [c[1], c[2]]))) +
    card('Recovery', 'Whoop weekly average', recBars + legend([['Green 67%+', '#178A55'], ['Yellow', '#E9A65C'], ['Red under 34%', '#C8504B']])) +
    card('Sleep', 'hours a night, weekly average', sleepBars) +
    card('HRV', 'higher is better', hrv) +
    card('Resting heart rate', 'lower is fitter', rhr) +
    card('Strain', 'Whoop, weekly average day', strain) +
    card('Weight', gWa.length ? 'waist last ' + gWa[gWa.length - 1].waist_cm + ' cm on ' + A_.fmtD(gWa[gWa.length - 1].date, { day: 'numeric', month: 'short' }) : 'kg', body) +
    card('Sessions and effort', 'last 16 logged', effort) +
    '</div>' +
    '<div class="grid2">' + recentCard() +
    '<section class="card"><h2 class="h">Week by week</h2><div class="scroll"><table class="t"><thead><tr><th>Week</th><th class="n">Logged</th><th class="n">Strength</th><th class="n">Cardio min</th><th class="n">Effort</th><th class="n">Strain</th><th class="n">Recovery</th><th class="n">Sleep</th><th class="n">HRV</th></tr></thead><tbody>' + rows + '</tbody></table></div><p class="note">Pale bars in the charts are part weeks (this week, or a Whoop week with fewer than 5 days).</p></section></div>';
}
function card(title, sub, body) { return '<section class="card"><div class="between"><h2 class="h">' + title + '</h2><span class="tiny muted">' + A().esc(sub) + '</span></div>' + body + '</section>'; }

/* ---------- dictation parser ---------- */
const NUMW = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, twenty: 20, thirty: 30, forty: 40, 'forty-five': 45, fifty: 50, sixty: 60 };
function parseSay(raw) {
  let s = ' ' + String(raw || '').toLowerCase().replace(/[–—]/g, '-') + ' ';
  s = s.replace(/\b(forty-five|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|twenty|thirty|forty|fifty|sixty)\b/g, m => NUMW[m]);
  s = s.replace(/half an hour/g, '30 minutes').replace(/an hour and a half/g, '90 minutes').replace(/\ban hour\b/g, '60 minutes');
  const f = {};
  const has = re => re.test(s);
  if (has(/kettle ?bell|\bkb\b|swing|goblet|get-?up|clean and press|snatch/)) f.type = 'kettlebell';
  else if (has(/rower|rowing|\brow(ed)?\b(?! of)/) && !has(/gorilla|single.arm|seated/)) f.type = 'rower';
  else if (has(/\bjog/)) f.type = 'jog';
  else if (has(/\bran\b|\brun\b|running/)) f.type = 'run';
  else if (has(/padel/)) f.type = 'padel';
  else if (has(/golf/)) f.type = 'golf';
  else if (has(/bike|cycl|spin/)) f.type = 'bike';
  else if (has(/\bwalk/)) f.type = 'walk';
  else if (has(/gym|weights|pull-?ups?|lat pulldown|press/)) f.type = 'gym';
  let m;
  if ((m = s.match(/(\d+(?:\.\d+)?)\s*(?:k\b|km|kilomet)/))) f.km = m[1];
  else if ((m = s.match(/(\d{3,5})\s*(?:m\b|metres|meters)/))) f.km = String(Number(m[1]) / 1000);
  if ((m = s.match(/(\d+(?:\.\d+)?)\s*(?:min|mins|minutes)\b/))) f.duration = String(Math.round(Number(m[1])));
  else if ((m = s.match(/(\d+)\s*(?:hours?|hrs?)\b/))) f.duration = String(Number(m[1]) * 60);
  if ((m = s.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilo|kilos|kilogram)/))) f.kg = m[1];
  if ((m = s.match(/(\d+)\s*(?:rounds?|sets?|intervals?|reps of)/))) f.rounds = m[1];
  if ((m = s.match(/(?:rpe|effort|felt like a|felt like|was a|about a|hard(?:ness)?)\s*(?:of\s*)?(\d{1,2})\b/)) || (m = s.match(/(\d{1,2})\s*(?:out of|\/)\s*10/))) { const v = Number(m[1]); if (v >= 1 && v <= 10) f.rpe = v; }
  if (f.rpe == null) { if (has(/brutal|destroyed|killer|nothing left/)) f.rpe = 9; else if (has(/really hard|very hard|tough/)) f.rpe = 8; else if (has(/\bhard\b/)) f.rpe = 7; else if (has(/\beasy\b|light|gentle/)) f.rpe = 4; else if (has(/moderate|ok\b|okay|fine/)) f.rpe = 6; }
  if ((m = s.match(/strain\s*(?:of\s*)?(\d+(?:\.\d+)?)/))) f.strain = m[1];
  if ((m = s.match(/(?:heart rate|hr)\s*(?:of\s*)?(\d{2,3})/))) f.hr = m[1];
  const syn = { 'Swings': /swing/, 'Goblet squat': /goblet|squat/, 'Clean & press': /clean (?:and|&) press|clean & press|cleans?\b/, 'Push press': /push press/, 'Snatch': /snatch/, 'Gorilla row': /gorilla/, 'Single-arm row': /single.arm row|one.arm row|kb rows?|kettlebell rows?|(?<!gorilla )\brows\b/, 'Pull-ups': /pull.?ups?|chin.?ups?/, 'Lat pulldown': /pulldown|pull.down/, 'Face pulls': /face pull/, 'Lateral raise': /lateral|side raise/, 'Overhead press': /overhead press|shoulder press|military/, 'Incline press': /incline/, 'Push-ups': /push.?ups?|press.?ups?/, 'Halo': /halo/, 'Turkish get-up': /get.?ups?|turkish/, 'Farmer carry': /farmer|carr(y|ies)/, 'Lunges': /lunge/, 'Deadlift': /deadlift/, 'Windmill': /windmill/ };
  f.ex = Object.keys(syn).filter(k => syn[k].test(s));
  return f;
}

/* ---------- events ---------- */
function click(a, b) {
  const c = TR.cfg;
  if (a === 'tm-start') start();
  else if (a === 'tm-pause') pause();
  else if (a === 'tm-skip') skip();
  else if (a === 'tm-stop') { if (b.dataset.armed !== '1') { b.dataset.armed = '1'; b.textContent = 'Stop?'; setTimeout(() => { if (b.isConnected) { b.dataset.armed = ''; b.textContent = 'Stop'; } }, 3000); return true; } finish(true); }
  else if (a === 'tm-again') { TR.run = null; start(); }
  else if (a === 'tm-reset') reset();
  else if (a === 'tm-tolog') { const el = document.getElementById('trLog'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }
  else if (a === 'tm-test') { audio(); SND.go(); setTimeout(SND.rest, 800); setTimeout(() => say('Round 1. Go'), 1600); }
  else if (a === 'tm-preset') { const p = PRESETS.find(x => x.id === b.dataset.id); if (p) { Object.assign(c, { kind: p.kind, work: p.work, rest: p.rest, rounds: p.rounds }); TR.planId = null; saveCfg(); if (TR.run && TR.run.done) TR.run = null; A().render(); const el = document.getElementById('timerCard'); if (el && b.closest('.coach')) el.scrollIntoView({ behavior: 'smooth' }); } }
  else if (a === 'tm-swap') doSwap(b.dataset.v);
  else if (a === 'tm-pick') { TR.pickEx = !TR.pickEx; A().render(); }
  else if (a === 'tm-circ') { const v = b.dataset.v, cc = TR.cfg.circuit = TR.cfg.circuit || []; const i = cc.indexOf(v); if (i >= 0) cc.splice(i, 1); else cc.push(v); TR.planId = null; saveCfg(); A().render(); }
  else if (a === 'tm-circclear') { TR.cfg.circuit = []; TR.planId = null; saveCfg(); A().render(); }
  else if (a === 'tp-load') { const p = todaysPlan(); if (p) loadPlan(p); }
  else if (a === 'tp-opt') { const p = todaysPlan(); if (p) loadPlan(p, Number(b.dataset.i)); }
  else if (a === 'tm-rounds') { c.rounds = Math.min(15, Math.max(1, c.rounds + Number(b.dataset.d))); saveCfg(); A().render(); }
  else if (a === 'tr-type') { TR.form.type = b.dataset.v; A().render(); }
  else if (a === 'tr-ex') { const v = b.dataset.v, ex = TR.form.ex; const i = ex.indexOf(v); if (i >= 0) ex.splice(i, 1); else ex.push(v); A().render(); }
  else if (a === 'tr-rpe') { const v = Number(b.dataset.v); TR.form.rpe = TR.form.rpe === v ? null : v; A().render(); }
  else if (a === 'tr-parse') { const p = parseSay(TR.say); if (!TR.say.trim()) { A().toast('Say or type what you did first'); return true; }
    const f = TR.form; ['type', 'km', 'duration', 'kg', 'rounds', 'rpe', 'strain', 'hr'].forEach(k => { if (p[k] != null && p[k] !== '') f[k] = p[k]; });
    if (p.ex.length) f.ex = [...new Set(f.ex.concat(p.ex))];
    if (!f.notes) f.notes = TR.say.trim();
    A().render(); A().toast('Filled in. Check and save.'); }
  else if (a === 'tr-mic') mic();
  else if (a === 'tr-clear') { TR.form = blankForm(); TR.say = ''; A().render(); }
  else if (a === 'tr-save') save();
  else if (a === 'tr-del') { if (b.dataset.armed !== '1') { b.dataset.armed = '1'; b.textContent = 'Remove?'; setTimeout(() => { if (b.isConnected) { b.dataset.armed = ''; b.textContent = '✕'; } }, 3500); return true; } A().del('workouts', b.dataset.id, ME); }
  else return false;
  return true;
}
let REC = null;
function mic() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition; if (!SR) return;
  if (TR.listening && REC) { REC.stop(); return; }
  REC = new SR(); REC.lang = 'en-GB'; REC.interimResults = true; REC.continuous = false;
  const base = TR.say ? TR.say.trim() + ' ' : '';
  REC.onresult = e => { let t = ''; for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript; TR.say = base + t; const ta = document.querySelector('[data-act="tr-say"]'); if (ta) ta.value = TR.say; };
  REC.onend = () => { TR.listening = false; A().render(); };
  REC.onerror = () => { TR.listening = false; A().toast('Couldn\'t hear that. Try the keyboard mic.'); A().render(); };
  TR.listening = true; REC.start(); A().render();
}
function save() {
  const f = TR.form, A_ = A(), date = f.date || A_.todayStr();
  if (!f.duration && !f.rounds && !f.km) { A_.toast('Add minutes, rounds or distance'); return; }
  const d = { date, type: f.type, at: new Date().toISOString(), source: f.source };
  const nums = { duration: f.duration, rounds: f.rounds, km: f.km, kg: f.kg, strain: f.strain, hr: f.hr };
  for (const k in nums) { const v = parseFloat(nums[k]); if (isFinite(v) && v > 0) d[k] = v; }
  if (f.work_s) d.work_s = f.work_s; if (f.rest_s != null && f.work_s) d.rest_s = f.rest_s;
  if (f.rpe) d.rpe = f.rpe; if (f.ex.length) d.ex = f.ex.slice(); if (f.notes.trim()) d.notes = f.notes.trim();
  if (f.plan) d.plan = f.plan; if (f.swaps && f.swaps.length) d.swaps = f.swaps.slice();
  A_.put('workouts', 'wo-' + date + '-' + A_.uid().slice(0, 5), d, ME);
  TR.form = blankForm(); TR.say = '';
  if (TR.run && TR.run.done) TR.run = null;
  TR.planId = null;
  A_.toast('Workout saved. Claude reviews it tonight.');
}
function change(t) {
  if (t.dataset.act === 'tm-cfg') { const k = t.dataset.k; TR.cfg[k] = k === 'kind' ? t.value : Number(t.value); saveCfg(); A().render(); return true; }
  if (t.dataset.act === 'tm-voice') { TR.cfg.voice = t.checked; saveCfg(); return true; }
  if (t.dataset.tf) { TR.form[t.dataset.tf] = t.value; return true; }
  return false;
}
function input(t) {
  if (t.dataset.act === 'tr-say') { TR.say = t.value; return true; }
  if (t.dataset.tf) { TR.form[t.dataset.tf] = t.value; return true; }
  return false;
}
function busy() { return !!(TR.run && !TR.run.done) || TR.listening; }

window.HT = { view, click, change, input, busy, parseSay, _TR: TR, _weekModel: weekModel, _coaching: coaching };
})();
