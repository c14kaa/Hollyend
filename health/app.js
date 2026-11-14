/* Hollyend Health
   Static app on the Hollyend Supabase project. All data lives in one table,
   public.health_docs (coll, person, id, data jsonb), protected by row-level
   security. Dad's login sees everything; K's login sees his own food side only.
*/
(function () {
'use strict';

const SUPA_URL = 'https://dikpmyisanokawbqohqa.supabase.co';
const SUPA_KEY = 'sb_publishable_NRVj2LYn2cY-RmOsw6WjZw_JdHb5INR';
const sb = window.supabase.createClient(SUPA_URL, SUPA_KEY);

const SHARED = new Set(['meals', 'pantry', 'shopping']);
const SLOTS = [
  { k: 'breakfast', n: 'Breakfast', t: '07:30', pace: 0.15 },
  { k: 'break', n: 'Morning break', t: '10:30', pace: 0.25 },
  { k: 'lunch', n: 'Lunch', t: '13:00', pace: 0.45 },
  { k: 'after', n: 'After school', t: '16:30', pace: 0.65 },
  { k: 'dinner', n: 'Dinner', t: '19:00', pace: 0.9 },
  { k: 'bed', n: 'Before bed', t: '20:30', pace: 1 }
];
const SLOTNAME = Object.fromEntries(SLOTS.map(s => [s.k, s.n]));
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const CATS = ['Dairy & eggs', 'Meat & fish', 'Fruit & veg', 'Bakery', 'Cupboard', 'Snacks', 'Frozen', 'Drinks', 'Other'];
const STLABEL = { plenty: 'In stock', low: 'Low', out: 'Out', unchecked: 'Not checked' };
const GROUPS = ['Growth & puberty hormones', 'Adrenal', 'Thyroid', 'Coeliac screen', 'Full blood count', 'Iron & vitamins', 'Kidney & salts', 'Liver', 'Bone', 'Inflammation', 'Sugar', 'Lipids', 'Hormones', 'Urine', 'Other'];
const DEFAULT_QUICK = ['peanut-butter-smoothie', 'chocolate-milk-400-ml', 'banana-and-a-cheese-stick', 'pediasure-10-made-with-whole-milk', 'greek-yoghurt-granola-and-honey', 'flapjack'];
const GEN_SLOTS = [['breakfast', 'Breakfast'], ['lunch', 'Lunchbox'], ['after', 'After school'], ['dinner', 'Dinner'], ['snack', 'Snack']];

let ME = { user: null, scope: null };
let P = 'kristan';
let TAB = 'today';
let D = {};
const UI = { day: todayStr(), weekStart: mondayOf(todayStr()), gen: { slot: null, idx: 0 }, mealFilter: 'all', typed: '', typedSlot: null, pasteText: '', busy: false };

/* ---------- helpers ---------- */
const $ = id => document.getElementById(id);
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function pad(n) { return String(n).padStart(2, '0'); }
function dstr(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
function todayStr() { return dstr(new Date()); }
function pd(s) { const [y, m, d] = String(s).split('-').map(Number); return new Date(y, (m || 1) - 1, d || 1); }
function addDays(s, n) { const d = pd(s); d.setDate(d.getDate() + n); return dstr(d); }
function mondayOf(s) { const d = pd(s); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return dstr(d); }
function fmtD(s, o) { return pd(s).toLocaleDateString('en-GB', o || { weekday: 'short', day: 'numeric', month: 'short' }); }
function fmtLong(s) { return pd(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }
function n0(x) { return Math.round(Number(x) || 0).toLocaleString('en-GB'); }
function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'item'; }
function uid() { return Math.random().toString(36).slice(2, 10); }
function tmin(t) { const [h, m] = String(t || '0:0').split(':').map(Number); return h * 60 + (m || 0); }
function nowMin() { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); }
function sum(a, f) { return a.reduce((x, y) => x + (Number(f(y)) || 0), 0); }
function num(v) { const n = parseFloat(String(v).replace(/[<>≤≥\s]/g, '')); return isFinite(n) ? n : null; }
function isKid() { return P === 'kristan'; }
function heWord() { return isKid() ? 'he' : 'I'; }
function toast(t) { const el = document.createElement('div'); el.className = 'toast'; el.textContent = t; document.body.appendChild(el); setTimeout(() => el.remove(), 2600); }

/* ---------- data ---------- */
function personFor(coll, person) { return SHARED.has(coll) ? 'shared' : (person || P); }
function col(coll, person) { const o = (D[coll] || {})[personFor(coll, person)] || {}; return Object.keys(o).map(id => Object.assign({ id }, o[id])); }
function get(coll, id, person) { return ((D[coll] || {})[personFor(coll, person)] || {})[id]; }
async function loadAll() {
  const out = {};
  let from = 0;
  for (;;) {
    const { data, error } = await sb.from('health_docs').select('coll,person,id,data').range(from, from + 999);
    if (error) throw error;
    for (const r of data) { ((out[r.coll] = out[r.coll] || {})[r.person] = out[r.coll][r.person] || {})[r.id] = r.data; }
    if (data.length < 1000) break;
    from += 1000;
  }
  D = out;
}
async function put(coll, id, data, person) {
  const p = personFor(coll, person);
  ((D[coll] = D[coll] || {})[p] = D[coll][p] || {})[id] = data;
  render();
  const { error } = await sb.from('health_docs').upsert({ coll, person: p, id, data });
  if (error) { toast("Couldn't save. " + error.message); await refresh(true); }
}
async function del(coll, id, person) {
  const p = personFor(coll, person);
  if (D[coll] && D[coll][p]) delete D[coll][p][id];
  render();
  const { error } = await sb.from('health_docs').delete().match({ coll, person: p, id });
  if (error) { toast("Couldn't delete. " + error.message); await refresh(true); }
}
/* Cheap change check: row count + newest updated_at (two tiny requests).
   The full reload only happens when something actually changed. */
let SIG = null;
async function signature() {
  const [c, m] = await Promise.all([
    sb.from('health_docs').select('id', { count: 'exact', head: true }),
    sb.from('health_docs').select('updated_at').order('updated_at', { ascending: false }).limit(1)
  ]);
  if (c.error || m.error) return null;
  return c.count + '|' + ((m.data && m.data[0] && m.data[0].updated_at) || '');
}
async function refresh(force) {
  try {
    const s = await signature();
    if (!force && s && s === SIG) return;
    await loadAll(); SIG = s; render();
  } catch (e) { /* keep last view */ }
}

/* ---------- settings & derived ---------- */
function S() {
  const s = get('settings', 'main') || {};
  return Object.assign({ kcalTarget: isKid() ? 2400 : null, proteinTarget: isKid() ? 45 : null, trainingDays: [], lightsOut: '21:15', nutFreeSchool: true, dob: isKid() ? '2014-03-20' : null, quick: DEFAULT_QUICK }, s);
}
function ageAt(s) { const dob = S().dob; return dob ? (pd(s) - pd(dob)) / (365.25 * 864e5) : null; }
function fmtAge(a) { if (a == null) return ''; const y = Math.floor(a), m = Math.floor((a - y) * 12 + 1e-6); return y + 'y ' + m + 'm'; }
function isSport(s) { return (S().trainingDays || []).includes(pd(s).getDay()); }
function dayLog(s) { return get('log', s) || { date: s, items: [] }; }
function totals(s) { const it = (dayLog(s).items || []).filter(i => !i.pending); return { kcal: sum(it, i => i.kcal), protein: sum(it, i => i.protein) }; }
function pendingCount(s) { return (dayLog(s).items || []).filter(i => i.pending).length; }
function planFor(s) { const p = get('plan', s); return (p && p.slots) || {}; }
function meals() { return col('meals'); }
function mealById(id) { const m = get('meals', id); return m ? Object.assign({ id }, m) : null; }
function pantryItem(name) { const k = slug(name); return col('pantry').find(p => p.id === k || slug(p.name) === k); }
function inStock(name) { const p = pantryItem(name); return !!p && p.status !== 'out'; }
function missingFor(m) { return (m.ingredients || []).filter(n => !inStock(n)); }
function canMake(m) { return (m.ingredients || []).length > 0 && missingFor(m).length === 0; }
function weights() { return col('growth').filter(g => Number(g.weight_kg) > 0).sort((a, b) => a.date.localeCompare(b.date)); }
function heights() { return col('growth').filter(g => Number(g.height_cm) > 0).sort((a, b) => a.date.localeCompare(b.date)); }
function bestSlotNow() { const n = nowMin(); let s = SLOTS[0].k; for (const sl of SLOTS) if (n >= tmin(sl.t) - 60) s = sl.k; return s; }
function schoolDay(s) { const w = pd(s).getDay(); return w >= 1 && w <= 5; }
function lunchOK(m) { return !S().nutFreeSchool || m.nutFree !== false; }

/* growth maths: UK90 / UK-WHO boys LMS */
const LMS = window.HH_LMS;
function lmsAt(kind, age) { const t = LMS[kind]; if (!t || age == null || age < t[0][0] || age > t[t.length - 1][0]) return null; let i = 0; while (i < t.length - 2 && t[i + 1][0] < age) i++; const a = t[i], b = t[i + 1], f = (age - a[0]) / (b[0] - a[0]); return [a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f, a[3] + (b[3] - a[3]) * f]; }
function sds(kind, age, x) { const l = lmsAt(kind, age); if (!l || !x) return null; const [L, M, Sg] = l; return Math.abs(L) < 1e-6 ? Math.log(x / M) / Sg : (Math.pow(x / M, L) - 1) / (L * Sg); }
function valAtZ(kind, age, z) { const l = lmsAt(kind, age); if (!l) return null; const [L, M, Sg] = l; return Math.abs(L) < 1e-6 ? M * Math.exp(Sg * z) : M * Math.pow(1 + L * Sg * z, 1 / L); }
function erf(x) { const s = Math.sign(x); x = Math.abs(x); const t = 1 / (1 + 0.3275911 * x); return s * (1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x)); }
function centile(z) { return z == null ? null : 50 * (1 + erf(z / Math.SQRT2)); }
function fmtCent(c) { if (c == null) return '—'; if (c < 0.4) return '<0.4th'; if (c > 99.6) return '>99.6th'; const r = c < 10 ? Math.round(c * 10) / 10 : Math.round(c); if (!Number.isInteger(r)) return r + 'th'; const m = r % 100; if (m >= 11 && m <= 13) return r + 'th'; return r + (['th', 'st', 'nd', 'rd'][r % 10] || 'th'); }

/* ---------- auth ---------- */
async function boot() {
  const { data } = await sb.auth.getSession();
  if (!data.session) return showLogin();
  ME.user = data.session.user;
  const { data: acc, error } = await sb.from('health_access').select('scope,display_name').eq('user_id', ME.user.id).maybeSingle();
  if (error || !acc) return showNoAccess();
  ME.scope = acc.scope;
  P = 'kristan';
  try { const t = localStorage.getItem('hh_tab'); if (t) TAB = t; const p = localStorage.getItem('hh_person'); if (p && ME.scope === 'all') P = p; } catch (e) {}
  if (ME.scope !== 'all' && !['today', 'meals', 'shop', 'progress'].includes(TAB)) TAB = 'today';
  await loadAll();
  SIG = await signature();
  render();
  setInterval(() => { if (document.visibilityState === 'visible' && !document.activeElement.matches('input,textarea,select') && !(window.HT && window.HT.busy())) refresh(); }, 60000);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') refresh(); });
}
function showLogin(msg) {
  $('tabs').hidden = true; $('who').innerHTML = '';
  $('view').innerHTML = '<form class="card login" id="loginForm"><h1 class="h1">Sign in</h1><p class="note">Use your Hollyend login.</p>' +
    '<label>Email<input id="em" type="email" autocomplete="username" required></label>' +
    '<label>Password<input id="pw" type="password" autocomplete="current-password" required></label>' +
    '<button class="btn" type="submit">Sign in</button><div class="err" id="loginErr">' + esc(msg || '') + '</div></form>';
}
function showNoAccess() {
  $('tabs').hidden = true;
  $('who').innerHTML = acctMenu('?', '');
  $('view').innerHTML = '<div class="card login"><h1 class="h1">No access</h1><p>This Hollyend login isn\'t set up for Hollyend Health.</p><a href="/">Back to Hollyend</a></div>';
}

/* ---------- render ---------- */
const ICONS = {
  today: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></svg>',
  progress: '<svg viewBox="0 0 24 24"><path d="M4 19h16M6 16l4-5 3 3 5-7"/></svg>',
  meals: '<svg viewBox="0 0 24 24"><path d="M7 3v8a2 2 0 0 0 4 0V3M9 11v10M16 21V3c2 1 3 3 3 6s-1 4-3 4"/></svg>',
  health: '<svg viewBox="0 0 24 24"><path d="M3 12h4l2-5 4 10 2-5h6"/></svg>',
  shop: '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1.5 11h-11z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  training: '<svg viewBox="0 0 24 24"><path d="M9 4h6M12 4v3"/><circle cx="12" cy="14" r="7"/><path d="M12 14l3-3"/></svg>'
};
function tabsFor() { const t = [['today', 'Today'], ['progress', 'Progress'], ['meals', 'Meals']]; if (ME.scope === 'all') t.push(['health', 'Health']); t.push(['shop', 'Shopping']); if (ME.scope === 'all' && window.HT) t.push(['training', 'Training']); return t; }
function render() {
  if (!ME.user) return;
  const tabs = tabsFor();
  $('tabs').hidden = false;
  $('tabs').style.gridTemplateColumns = 'repeat(' + tabs.length + ',minmax(0,1fr))';
  $('tabs').innerHTML = tabs.map(([k, n]) => '<button role="tab" data-act="tab" data-tab="' + k + '" aria-selected="' + (TAB === k) + '">' + ICONS[k] + '<span>' + n + '</span></button>').join('');
  $('who').innerHTML = barRight();
  const y = window.scrollY;
  const fn = { today: vToday, progress: vProgress, meals: vMeals, health: vHealth, shop: vShop, training: vTraining }[TAB] || vToday;
  $('view').innerHTML = fn();
  window.scrollTo(0, y);
}


/* ---------- Hollyend bar (right side) ---------- */
function acctMenu(letter, cls) {
  const name = ME.scope === 'all' ? 'Dad' : ME.scope === 'kristan' ? 'K' : 'this login';
  return '<div class="hb-menuwrap hb-acctwrap"><button class="hb-acct" data-act="acctmenu" aria-expanded="false" aria-label="Account"><span class="hb-av ' + cls + '">' + esc(letter) + '</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>' +
    '<div class="hb-menu" id="acctMenu" hidden><div class="mi" style="border-top:0;margin-top:0"><span>Signed in as ' + esc(name) + '</span><button data-act="signout">Sign out</button></div></div></div>';
}
function barRight() {
  const t = todayStr();
  const ks = Object.assign({ kcalTarget: 2400, trainingDays: [] }, ((D.settings || {}).kristan || {}).main || {});
  const kl = ((D.log || {}).kristan || {})[t] || { items: [] };
  const kc = sum((kl.items || []).filter(i => !i.pending), i => i.kcal);
  const tgt = Number(ks.kcalTarget) || 0;
  const sport = (ks.trainingDays || []).includes(pd(t).getDay());
  const info = '<div class="hb-info" title="K\'s food today"><span class="hb-long">' + (ME.scope === 'all' ? 'K today' : 'Today') + '</span><b>' + n0(kc) + '</b><span>/ ' + (tgt ? n0(tgt) : '—') + '<span class="hb-long"> kcal</span></span>' + (sport ? '<span class="hb-tag hb-long">Football day</span>' : '') + '</div>';
  const sw = ME.scope === 'all' ? '<div class="switch" role="group" aria-label="Whose record"><button data-act="person" data-p="kristan" aria-pressed="' + (P === 'kristan') + '">K</button><button data-act="person" data-p="harps" aria-pressed="' + (P === 'harps') + '">Me</button></div>' : '';
  return info + sw + acctMenu(ME.scope === 'all' ? 'D' : 'K', ME.scope === 'all' ? '' : 'k');
}
function closeMenus(except) { ['appMenu', 'acctMenu'].forEach(id => { const m = $(id); if (m && id !== except) { m.hidden = true; const b = document.querySelector('[data-act="' + (id === 'appMenu' ? 'appmenu' : 'acctmenu') + '"]'); if (b) b.setAttribute('aria-expanded', 'false'); } }); }
function toggleMenu(id, btn) { const m = $(id); if (!m) return; closeMenus(id); m.hidden = !m.hidden; btn.setAttribute('aria-expanded', String(!m.hidden)); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenus(); });

/* ---------- Today ---------- */
function nudges(s) {
  const out = []; const st = S(); const target = Number(st.kcalTarget) || 0; const t = totals(s);
  if (target) {
    const n = nowMin(); let exp = 0; for (const sl of SLOTS) if (n >= tmin(sl.t) + 30) exp = sl.pace;
    const expK = Math.round(target * exp);
    if (exp > 0 && t.kcal < expK - 250) {
      const fix = meals().filter(m => (m.slots || []).some(x => ['break', 'after', 'bed'].includes(x)) && canMake(m)).sort((a, b) => b.kcal - a.kcal)[0];
      out.push({ c: 'amber', b: n0(expK - t.kcal) + ' kcal behind for this time of day', t: fix ? 'Quick fix: ' + fix.name + ' (' + n0(fix.kcal) + ' kcal).' : 'Add a snack or a smoothie.', a: fix ? { act: 'logmeal', id: fix.id, label: 'Log it' } : null });
    }
  }
  const pend = pendingCount(s);
  if (pend) out.push({ c: 'grey', b: pend + ' item' + (pend > 1 ? 's' : '') + ' waiting for calories', t: 'Ask Claude to update Hollyend Health and it will fill these in.' });
  if (isKid() && isSport(s)) out.push({ c: 'green', b: 'Football day', t: 'Snack 1–2 hours before, smoothie or chocolate milk straight after.' });
  if (isKid() && isSport(addDays(s, 1))) { const need = ['whole milk', 'bananas'].filter(x => !inStock(x)); if (need.length) out.push({ c: 'amber', b: 'Football tomorrow', t: 'Buy ' + need.join(' and ') + ' for the recovery drink.' }); }
  const ws = weights(); const last = ws[ws.length - 1];
  if (ME.scope === 'all' && (!last || (pd(s) - pd(last.date)) / 864e5 >= 7)) out.push({ c: 'green', b: 'Weigh-in due', t: last ? 'Last: ' + last.weight_kg + ' kg on ' + fmtD(last.date) + '. Same scales, before breakfast.' : 'No weight logged yet.', a: { act: 'tab', tab: 'progress', label: 'Add' } });
  if (isKid() && ME.scope === 'all' && ws.length >= 2) {
    const ref = ws.slice().reverse().find(w => (pd(last.date) - pd(w.date)) / 864e5 >= 25);
    if (ref) { const dw = last.weight_kg - ref.weight_kg, days = Math.round((pd(last.date) - pd(ref.date)) / 864e5);
      if (dw <= 0.1) out.push({ c: 'amber', b: 'Weight not up in ' + Math.round(days / 7) + ' weeks', t: ref.weight_kg + ' kg → ' + last.weight_kg + ' kg. Worth asking about a dietitian.' });
      else out.push({ c: 'green', b: 'Up ' + dw.toFixed(1) + ' kg in ' + Math.round(days / 7) + ' weeks', t: ref.weight_kg + ' kg → ' + last.weight_kg + ' kg.' }); }
  }
  if (isKid() && st.nutFreeSchool && schoolDay(s)) { const m = mealById(planFor(s).lunch); if (m && m.nutFree === false) out.push({ c: 'red', b: 'Lunchbox contains nuts', t: m.name + ' is planned for school.' }); }
  const miss = new Set(); for (let i = 0; i < 3; i++) { const p = planFor(addDays(s, i)); for (const k in p) { const m = mealById(p[k]); if (m) missingFor(m).forEach(x => miss.add(x)); } }
  if (miss.size) out.push({ c: 'amber', b: 'Missing for the next 3 days', t: [...miss].slice(0, 5).join(', ') + (miss.size > 5 ? ' and ' + (miss.size - 5) + ' more' : ''), a: { act: 'tab', tab: 'shop', label: 'List' } });
  const yt = totals(addDays(s, -1)); if (yt.kcal > 0 && target) out.push({ c: yt.kcal >= target * 0.95 ? 'green' : 'amber', b: 'Yesterday: ' + n0(yt.kcal) + ' of ' + n0(target) + ' kcal', t: n0(yt.protein) + ' g protein.' });
  return out;
}
function vToday() {
  const s = UI.day, isT = s === todayStr(), st = S(), target = Number(st.kcalTarget) || 0, pt = Number(st.proteinTarget) || 0;
  const t = totals(s), lg = dayLog(s), plan = planFor(s);
  let pace = 0; if (isT) { const n = nowMin(); for (const sl of SLOTS) if (n >= tmin(sl.t) + 30) pace = sl.pace; }
  const pct = target ? Math.min(100, t.kcal / target * 100) : 0;
  const expK = Math.round(target * pace);
  const status = !target ? '' : (pace && t.kcal >= expK ? '<span class="chip green">On pace</span>' : pace ? '<span class="chip amber">Behind</span>' : '');
  const meals6 = SLOTS.filter(sl => isKid() || !['break'].includes(sl.k)).map(sl => {
    const items = (lg.items || []).filter(i => i.slot === sl.k);
    const pm = mealById(plan[sl.k]);
    const kc = sum(items.filter(i => !i.pending), i => i.kcal);
    let sub = items.map(i => '<div class="it"><span>' + esc(i.name) + (i.pending ? ' <span class="chip">waiting for calories</span>' : '') + '</span><button class="xbtn" data-act="unlog" data-k="' + esc(i.k) + '" aria-label="Remove ' + esc(i.name) + '">✕</button></div>').join('');
    if (!items.length && pm) sub = '<div class="sub pl">Planned: ' + esc(pm.name) + '</div>';
    if (!items.length && !pm) sub = '<div class="sub pl">Nothing yet</div>';
    const right = items.length ? '<span class="chip green">' + (kc ? n0(kc) + ' ✓' : '✓') + '</span>' : (pm ? '<button class="btn sm ghost" data-act="logplanned" data-slot="' + sl.k + '" data-id="' + esc(pm.id) + '">Eaten</button>' : '');
    return '<div class="m"><span class="time">' + sl.t + '</span><div><div class="nm">' + (sl.k === 'after' && isKid() && isSport(s) ? 'After football' : sl.n) + '</div><div class="sub">' + sub + '</div></div>' + right + '</div>';
  }).join('');
  const quick = quickButtons(s);
  const ns = isT ? nudges(s) : [];
  const week = []; const ws0 = mondayOf(s);
  for (let i = 0; i < 7; i++) { const d = addDays(ws0, i), tt = totals(d).kcal; const cls = d === todayStr() ? 'today' : tt <= 0 ? '' : (target && tt >= target * 0.95 ? 'hit' : 'short'); week.push('<div class="d"><div class="c ' + cls + '" title="' + esc(fmtD(d) + ': ' + n0(tt) + ' kcal') + '"></div>' + DAYS[pd(d).getDay()] + '</div>'); }
  return '<div class="between"><div class="row"><button class="btn sm ghost" data-act="day" data-d="-1" aria-label="Previous day">‹</button><h1 class="h1">' + (isT ? 'Today' : esc(fmtD(s))) + '</h1><button class="btn sm ghost" data-act="day" data-d="1" aria-label="Next day">›</button>' + (isT ? '' : '<button class="linkbtn" data-act="day" data-d="0">Back to today</button>') + '</div>' +
    '<div class="row"><span class="muted small">' + esc(fmtD(s, { weekday: 'long', day: 'numeric', month: 'long' })) + '</span>' + (isKid() && isSport(s) ? '<span class="chip amber">Football day</span>' : '') + (isKid() ? '' : '<span class="chip">Me</span>') + '</div></div>' +
    '<div class="grid3">' +
    '<section class="card" aria-label="Food today"><div class="between"><h2 class="h">' + (isT ? 'Today so far' : 'Eaten') + '</h2><span class="small muted">' + (target ? 'Target ' + n0(target) + ' kcal' : '<button class="linkbtn" data-act="tab" data-tab="health">Set a target</button>') + '</span></div>' +
    '<div class="big"><span class="n">' + n0(t.kcal) + '</span><span class="muted">kcal</span>' + status + '</div>' +
    '<div class="bar"><div class="fill" style="width:' + pct + '%"></div>' + (pace && target ? '<div class="pace" style="left:calc(' + pace * 100 + '% - 1px)" title="Where ' + heWord() + ' should be by now"></div>' : '') + '</div>' +
    '<div class="stats"><div class="stat"><div class="k">To go</div><div class="v">' + (target ? n0(Math.max(0, target - t.kcal)) : '—') + '</div></div><div class="stat"><div class="k">Protein</div><div class="v">' + n0(t.protein) + (pt ? '<small> / ' + pt + ' g</small>' : '<small> g</small>') + '</div></div><div class="stat"><div class="k">Planned</div><div class="v">' + n0(sum(Object.values(plan), id => (mealById(id) || {}).kcal)) + '</div></div></div>' +
    (pace && target ? '<p class="note">Orange mark: where ' + heWord() + ' should be by now (' + n0(expK) + ' kcal).</p>' : '') + '</section>' +
    '<section class="card" aria-label="Log food"><h2 class="h">Log food</h2>' +
    '<form data-act="typed" class="row" style="flex-direction:column;align-items:stretch;gap:8px"><label>What did ' + heWord() + ' eat?<textarea id="typed" data-act="typedtext" rows="2" placeholder="Tap the mic on your keyboard and say it, e.g. chicken wrap, apple and a chocolate milk">' + esc(UI.typed) + '</textarea></label>' +
    '<div class="row"><select id="typedSlot" aria-label="Meal" style="flex:1 1 140px">' + SLOTS.map(sl => '<option value="' + sl.k + '"' + ((UI.typedSlot || bestSlotNow()) === sl.k ? ' selected' : '') + '>' + sl.n + '</option>').join('') + '</select><button class="btn" type="submit" style="flex:1 1 120px">Add</button></div></form>' +
    '<p class="note">Saved straight away. Claude adds the calories and protein next time you ask it to update Hollyend Health.</p>' +
    '<div class="h" style="margin-top:4px">One tap</div><div class="quick">' + quick + '</div></section>' +
    '<section class="card" aria-label="Heads-up" style="gap:8px"><h2 class="h">' + (isT ? 'Heads-up' : 'This week') + '</h2>' + (isT ? (ns.length ? ns.map(n => '<div class="alert ' + n.c + '"><span class="dot"></span><div><b>' + esc(n.b) + '</b><span class="t">' + esc(n.t) + '</span></div>' + (n.a ? '<button class="btn sm ghost act" data-act="' + n.a.act + '" data-id="' + esc(n.a.id || '') + '" data-tab="' + esc(n.a.tab || '') + '">' + esc(n.a.label) + '</button>' : '') + '</div>').join('') : '<div class="empty">Nothing needs attention.</div>') : '') +
    '<div class="week" style="margin-top:6px">' + week.join('') + '</div><p class="note">Green: target hit. Orange: short. Pale: today.</p></section>' +
    '</div>' +
    '<div class="grid2"><section class="card meals" aria-label="Meals"><div class="between"><h2 class="h">' + (isT ? "Today's meals" : 'Meals') + '</h2><button class="linkbtn" data-act="tab" data-tab="meals">Plan and ideas</button></div>' + meals6 + (isKid() && isT ? '<p class="note">Lights out ' + esc(st.lightsOut || '21:15') + '.</p>' : '') + '</section>' +
    genCard(true) + '</div>';
}
function quickButtons(s) {
  const out = []; const slot = bestSlotNow(); const pm = mealById(planFor(s)[slot]);
  if (pm) out.push('<button data-act="logplanned" data-slot="' + slot + '" data-id="' + esc(pm.id) + '">' + esc(SLOTNAME[slot]) + ' as planned<span>' + esc(pm.name) + '</span></button>');
  (S().quick || DEFAULT_QUICK).forEach(id => { const m = mealById(id); if (m && out.length < 6) out.push('<button data-act="logmeal" data-id="' + esc(id) + '">' + esc(m.name.replace(/\s*\(.*\)$/, '')) + '<span>' + n0(m.kcal) + ' kcal</span></button>'); });
  return out.join('');
}

/* ---------- meal generator ---------- */
function genCandidates(slot) {
  const s = todayStr();
  let list = meals().filter(m => !(m.tags || []).includes('takeaway') && (m.ingredients || []).length);
  if (slot === 'snack') list = list.filter(m => (m.slots || []).some(x => ['break', 'bed'].includes(x)));
  else list = list.filter(m => (m.slots || []).includes(slot));
  if (slot === 'lunch' && isKid() && schoolDay(s)) list = list.filter(lunchOK);
  if (slot === 'after' && isKid() && isSport(s)) list.sort((a, b) => ((b.tags || []).includes('recovery') - (a.tags || []).includes('recovery')));
  list.sort((a, b) => (canMake(b) - canMake(a)) || (b.kcal - a.kcal));
  return list;
}
function genCard(compact) {
  if (!UI.gen.slot) { const n = bestSlotNow(); UI.gen.slot = n === 'break' || n === 'bed' ? 'snack' : n; }
  const list = genCandidates(UI.gen.slot);
  const m = list.length ? list[UI.gen.idx % list.length] : null;
  const miss = m ? missingFor(m) : [];
  const unchecked = col('pantry').filter(p => p.status === 'unchecked').length;
  return '<section class="card" aria-label="Quick meal"><div class="between"><h2 class="h">Quick meal from what\'s in</h2>' + (m ? '<span class="small muted">Idea ' + ((UI.gen.idx % list.length) + 1) + ' of ' + list.length + '</span>' : '') + '</div>' +
    '<div class="row" role="group" aria-label="Meal">' + GEN_SLOTS.map(([k, n]) => '<button class="pill" data-act="genslot" data-slot="' + k + '" aria-pressed="' + (UI.gen.slot === k) + '">' + n + '</button>').join('') + '</div>' +
    (m ? '<div class="idea"><div class="between"><div class="nm">' + esc(m.name) + '</div><b class="num">' + n0(m.kcal) + ' kcal</b></div>' + (m.method ? '<div class="small" style="color:var(--ink2)">' + esc(m.method) + '</div>' : '') +
      '<div class="uses">' + (m.ingredients || []).map(x => '<span' + (miss.includes(x) ? ' class="no"' : '') + '>' + esc(x) + '</span>').join('') + '</div><div class="tiny muted">' + n0(m.protein) + ' g protein' + (miss.length ? ' · needs ' + esc(miss.join(', ')) : '') + '</div></div>' +
      '<div class="row"><button class="btn" data-act="gennext">Another idea</button><button class="btn ghost" data-act="genhave" data-id="' + esc(m.id) + '">' + (isKid() ? "He's having this" : "I'm having this") + '</button></div>' : '<div class="empty">No meals for this yet.</div>') +
    (unchecked > 20 ? '<p class="note">Most of the pantry isn\'t checked yet, so ideas assume you have everything. Send a receipt to Claude to fix that.</p>' : '') + '</section>';
}

/* ---------- Progress ---------- */
function centileChart(kind, pts, unit) {
  if (!pts.length) return '<div class="empty">No entries yet.</div>';
  const ages = pts.map(p => ageAt(p.date));
  const a0 = Math.max(8, Math.floor(Math.min(...ages)) - 1), a1 = Math.min(18, Math.ceil(Math.max(...ages)) + 2);
  const zs = [-2.054, -1.341, -0.674, 0, 0.674, 1.341, 2.054], lab = ['2nd', '9th', '25th', '50th', '75th', '91st', '98th'];
  let lo = Infinity, hi = -Infinity;
  for (let a = a0; a <= a1; a += 0.25) { const v1 = valAtZ(kind, a, zs[0]), v2 = valAtZ(kind, a, zs[4]); if (v1) lo = Math.min(lo, v1); if (v2) hi = Math.max(hi, v2); }
  pts.forEach(p => { lo = Math.min(lo, p.v); hi = Math.max(hi, p.v); });
  const step = kind === 'height' ? 10 : 5; lo = Math.floor(lo / step) * step; hi = Math.ceil(hi / step) * step;
  const W = 350, H = 210, L = 30, R = 36, T = 8, B = 24;
  const x = a => L + (a - a0) / (a1 - a0) * (W - L - R), y = v => T + (1 - (v - lo) / (hi - lo)) * (H - T - B);
  let g = '';
  for (let v = lo; v <= hi; v += step) g += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(v).toFixed(1) + '" y2="' + y(v).toFixed(1) + '" stroke="#EEF2EF"/><text x="' + (L - 5) + '" y="' + (y(v) + 3).toFixed(1) + '" text-anchor="end">' + v + '</text>';
  for (let a = a0; a <= a1; a++) g += '<text x="' + x(a).toFixed(1) + '" y="' + (H - 7) + '" text-anchor="middle">' + a + '</text>';
  zs.slice(0, 5).forEach((z, i) => { let d = ''; for (let a = a0; a <= a1 + 1e-9; a += 0.25) { const v = valAtZ(kind, a, z); if (v == null || v > hi + 2) continue; d += (d ? 'L' : 'M') + x(a).toFixed(1) + ',' + y(v).toFixed(1); }
    g += '<path d="' + d + '" fill="none" stroke="' + (z === 0 ? '#9AA59F' : '#D3DBD6') + '"' + (z === 0 ? ' stroke-dasharray="4 3"' : '') + '/>'; const ve = valAtZ(kind, a1, z); if (ve != null && ve <= hi) g += '<text x="' + (W - R + 3) + '" y="' + (y(ve) + 3).toFixed(1) + '" style="font-size:8px">' + lab[i] + '</text>'; });
  g += '<path d="' + pts.map((p, i) => (i ? 'L' : 'M') + x(ages[i]).toFixed(1) + ',' + y(p.v).toFixed(1)).join('') + '" fill="none" stroke="#178A55" stroke-width="2.4"/>';
  pts.forEach((p, i) => { g += '<circle cx="' + x(ages[i]).toFixed(1) + '" cy="' + y(p.v).toFixed(1) + '" r="4" fill="#178A55" stroke="#fff" stroke-width="2"><title>' + esc(fmtLong(p.date) + ': ' + p.v + ' ' + unit + ' (' + fmtCent(centile(sds(kind, ages[i], p.v))) + ' centile)') + '</title></circle>'; });
  return '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + kind + ' on UK boys centile lines">' + g + '</svg>';
}
function lineChart(pts, unit) {
  if (pts.length < 1) return '<div class="empty">Weigh-ins fill this in.</div>';
  const W = 350, H = 150, L = 30, R = 12, T = 10, B = 24;
  const vs = pts.map(p => p.v); let lo = Math.floor(Math.min(...vs) - 1), hi = Math.ceil(Math.max(...vs) + 1);
  const t0 = pd(pts[0].date).getTime(), t1 = Math.max(pd(pts[pts.length - 1].date).getTime(), t0 + 7 * 864e5);
  const x = d => L + (pd(d).getTime() - t0) / (t1 - t0) * (W - L - R), y = v => T + (1 - (v - lo) / (hi - lo)) * (H - T - B);
  let g = ''; for (let v = lo; v <= hi; v += Math.max(1, Math.round((hi - lo) / 4))) g += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(v).toFixed(1) + '" y2="' + y(v).toFixed(1) + '" stroke="#EEF2EF"/><text x="' + (L - 5) + '" y="' + (y(v) + 3).toFixed(1) + '" text-anchor="end">' + v + '</text>';
  g += '<path d="' + pts.map((p, i) => (i ? 'L' : 'M') + x(p.date).toFixed(1) + ',' + y(p.v).toFixed(1)).join('') + '" fill="none" stroke="#178A55" stroke-width="2.2"/>';
  pts.forEach((p, i) => { g += '<circle cx="' + x(p.date).toFixed(1) + '" cy="' + y(p.v).toFixed(1) + '" r="4" fill="#178A55"><title>' + esc(fmtLong(p.date) + ': ' + p.v + ' ' + unit) + '</title></circle>'; if (i === 0 || i === pts.length - 1) g += '<text x="' + x(p.date).toFixed(1) + '" y="' + (H - 7) + '" text-anchor="middle">' + esc(fmtD(p.date, { day: 'numeric', month: 'short' })) + '</text>'; });
  return '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Weight over time">' + g + '</svg>';
}
function intakeChart() {
  const t = todayStr(), target = Number(S().kcalTarget) || 0; const days = []; for (let i = 13; i >= 0; i--) days.push(addDays(t, -i));
  const vals = days.map(d => totals(d).kcal); const logged = vals.filter(v => v > 0);
  if (!logged.length) return '<div class="empty">Logged food shows here.</div>';
  const W = 350, H = 170, L = 30, R = 6, T = 10, B = 24; const vmax = Math.max(target * 1.15 || 0, ...vals, 1000); const bw = (W - L - R) / 14;
  const y = v => T + (1 - v / vmax) * (H - T - B);
  let g = ''; [0, 1000, 2000, 3000].filter(v => v <= vmax).forEach(v => { g += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(v).toFixed(1) + '" y2="' + y(v).toFixed(1) + '" stroke="#EEF2EF"/><text x="' + (L - 5) + '" y="' + (y(v) + 3).toFixed(1) + '" text-anchor="end">' + (v / 1000) + 'k</text>'; });
  vals.forEach((v, i) => { const xx = L + i * bw + 2; const fill = days[i] === t ? '#A9D8BE' : (target && v >= target * 0.95 ? '#178A55' : '#E9A65C'); if (v > 0) g += '<rect x="' + xx.toFixed(1) + '" y="' + y(v).toFixed(1) + '" width="' + (bw - 4).toFixed(1) + '" height="' + (y(0) - y(v)).toFixed(1) + '" rx="3" fill="' + fill + '"><title>' + esc(fmtD(days[i]) + ': ' + n0(v) + ' kcal') + '</title></rect>'; if (i % 2 === 1) g += '<text x="' + (xx + (bw - 4) / 2).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle">' + pd(days[i]).getDate() + '</text>'; });
  if (target) g += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(target).toFixed(1) + '" y2="' + y(target).toFixed(1) + '" stroke="#15201B" stroke-width="1.2" stroke-dasharray="5 4"/><text x="' + (W - R) + '" y="' + (y(target) - 4).toFixed(1) + '" text-anchor="end" style="fill:#15201B">target ' + n0(target) + '</text>';
  const avg = Math.round(sum(logged, v => v) / logged.length), hit = logged.filter(v => target && v >= target * 0.95).length;
  return '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Calories per day, last 14 days">' + g + '</svg><div class="stats"><div class="stat"><div class="k">Average</div><div class="v">' + n0(avg) + '</div></div><div class="stat"><div class="k">On target</div><div class="v">' + hit + '<small> of ' + logged.length + '</small></div></div><div class="stat"><div class="k">Protein avg</div><div class="v">' + n0(sum(days.filter(d => totals(d).kcal > 0), d => totals(d).protein) / logged.length) + '<small> g</small></div></div></div>';
}
function vProgress() {
  const canGrowth = ME.scope === 'all';
  const ws = weights(), hs = heights(), lw = ws[ws.length - 1], lh = hs[hs.length - 1], pw = ws.length > 1 ? ws[ws.length - 2] : null;
  let tiles = '';
  if (canGrowth) {
    if (isKid()) {
      const wc = lw ? centile(sds('weight', ageAt(lw.date), lw.weight_kg)) : null, hc = lh ? centile(sds('height', ageAt(lh.date), lh.height_cm)) : null;
      let hv = null; if (hs.length > 1) { const a = hs[hs.length - 2], yrs = ageAt(lh.date) - ageAt(a.date); if (yrs > 0.25) hv = (lh.height_cm - a.height_cm) / yrs; }
      const bmi = lw && lh ? lw.weight_kg / Math.pow(lh.height_cm / 100, 2) : null, bc = bmi ? centile(sds('bmi', ageAt(lw.date), bmi)) : null;
      tiles = '<div class="tiles">' +
        tile('Weight', lw ? lw.weight_kg + '<small> kg</small>' : '—', lw ? fmtCent(wc) + ' centile · ' + fmtD(lw.date, { day: 'numeric', month: 'short' }) : 'No weights yet', wc != null && wc < 9 ? 'amber' : '') +
        tile('Since last', pw ? (lw.weight_kg - pw.weight_kg >= 0 ? '+' : '') + (lw.weight_kg - pw.weight_kg).toFixed(1) + '<small> kg</small>' : '—', pw ? 'from ' + pw.weight_kg + ' kg on ' + fmtD(pw.date, { day: 'numeric', month: 'short' }) : 'Needs two weights', pw && lw.weight_kg < pw.weight_kg ? 'amber' : '') +
        tile('Height', lh ? lh.height_cm + '<small> cm</small>' : '—', lh ? fmtCent(hc) + ' centile · ' + fmtD(lh.date, { day: 'numeric', month: 'short' }) : 'No heights yet', '') +
        tile('Height growth', hv != null ? hv.toFixed(1) + '<small> cm/yr</small>' : '—', hv != null ? 'between the last two heights' : 'Needs two heights', '') +
        tile('BMI', bmi ? bmi.toFixed(1) : '—', bmi ? fmtCent(bc) + ' centile' : 'Needs weight and height', bc != null && bc < 9 ? 'amber' : '') + '</div>';
    } else {
      tiles = '<div class="tiles">' + tile('Weight', lw ? lw.weight_kg + '<small> kg</small>' : '—', lw ? fmtD(lw.date, { day: 'numeric', month: 'short' }) : 'No weights yet', '') + tile('Change', pw ? (lw.weight_kg - pw.weight_kg >= 0 ? '+' : '') + (lw.weight_kg - pw.weight_kg).toFixed(1) + '<small> kg</small>' : '—', pw ? 'since ' + fmtD(pw.date, { day: 'numeric', month: 'short' }) : 'Needs two weights', '') + '</div>';
    }
  }
  const recent = ws.filter(w => (pd(todayStr()) - pd(w.date)) / 864e5 <= 120).map(w => ({ date: w.date, v: Number(w.weight_kg) }));
  const rows = col('growth').sort((a, b) => b.date.localeCompare(a.date)).map(g => { const a = ageAt(g.date);
    return '<tr><td style="white-space:nowrap">' + esc(pd(g.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })) + '</td><td class="n">' + (g.weight_kg || '<span class="dash">—</span>') + '</td>' + (isKid() ? '<td class="n">' + (g.weight_kg ? fmtCent(centile(sds('weight', a, g.weight_kg))) : '') + '</td>' : '') + '<td class="n">' + (g.height_cm || '<span class="dash">—</span>') + '</td>' + (isKid() ? '<td class="n">' + (g.height_cm ? fmtCent(centile(sds('height', a, g.height_cm))) : '') + '</td>' : '') + '<td class="u">' + esc(g.source || '') + '</td><td><button class="xbtn" data-act="delgrowth" data-id="' + esc(g.id) + '" aria-label="Remove">✕</button></td></tr>'; }).join('');
  return '<div class="between"><h1 class="h1">Progress</h1>' + (isKid() ? '' : '<span class="chip">Me</span>') + '</div>' + tiles +
    (canGrowth ? '<div class="grid3">' +
      (isKid() ? '<section class="card"><div class="between"><h2 class="h">Weight</h2><span class="tiny muted">UK boys\' centiles</span></div>' + centileChart('weight', ws.map(w => ({ date: w.date, v: Number(w.weight_kg) })), 'kg') + '</section>' +
        '<section class="card"><div class="between"><h2 class="h">Height</h2><span class="tiny muted">UK boys\' centiles</span></div>' + centileChart('height', hs.map(w => ({ date: w.date, v: Number(w.height_cm) })), 'cm') + '</section>' : '') +
      '<section class="card"><div class="between"><h2 class="h">Weigh-ins, last 4 months</h2><span class="tiny muted">kg</span></div>' + lineChart(recent, 'kg') + '</section>' +
      '</div>' : '') +
    '<div class="grid2"><section class="card"><div class="between"><h2 class="h">Calories, last 14 days</h2><span class="tiny muted">kcal per day</span></div>' + intakeChart() + '</section>' +
    (canGrowth ? '<form class="card" data-act="addgrowth"><h2 class="h">Add a measurement</h2><div class="fields"><label>Date<input id="g_date" type="date" value="' + todayStr() + '" required></label><label>Weight (kg)<input id="g_w" type="number" step="0.1" inputmode="decimal"></label><label>Height (cm)<input id="g_h" type="number" step="0.1" inputmode="decimal"></label><label>Where<input id="g_src" placeholder="Home, clinic…"></label></div><button class="btn" type="submit">Save</button><p class="note">Weekly: same scales, before breakfast, light clothes.</p></form>' : '') + '</div>' +
    (canGrowth && rows ? '<section class="card"><h2 class="h">All measurements</h2><div class="scroll"><table class="t"><thead><tr><th>Date</th><th class="n">kg</th>' + (isKid() ? '<th class="n">Centile</th>' : '') + '<th class="n">cm</th>' + (isKid() ? '<th class="n">Centile</th>' : '') + '<th>Source</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>' + (isKid() ? '<p class="note">Centiles use the UK-WHO boys\' reference that GOSH uses. His doctors\' charts are the record.</p>' : '') + '</section>' : '');
}
function vTraining() { return ME.scope === 'all' && window.HT ? window.HT.view() : '<div class="empty">Not available.</div>'; }
function tile(k, v, d, cls) { return '<div class="tile"><div class="k">' + k + '</div><div class="v">' + v + '</div><div class="d ' + (cls || '') + '">' + d + '</div></div>'; }

/* ---------- Meals ---------- */
function vMeals() {
  const f = UI.mealFilter;
  const inF = m => f === 'all' || (f === 'snack' ? (m.slots || []).some(x => ['break', 'bed', 'after'].includes(x)) : (m.slots || []).includes(f));
  const can = meals().filter(m => canMake(m) && inF(m)).sort((a, b) => b.kcal - a.kcal);
  const short = meals().filter(m => (m.ingredients || []).length && missingFor(m).length === 1 && inF(m)).sort((a, b) => b.kcal - a.kcal);
  const filt = '<div class="row">' + [['all', 'All'], ['breakfast', 'Breakfast'], ['lunch', 'Lunch'], ['snack', 'Snacks'], ['dinner', 'Dinner']].map(([k, n]) => '<button class="pill" data-act="mealfilter" data-f="' + k + '" aria-pressed="' + (f === k) + '">' + n + '</button>').join('') + '</div>';
  return '<div class="between"><h1 class="h1">Meals</h1><span class="small muted">From what\'s in the cupboard</span></div>' +
    '<div class="grid2">' + genCard(false) +
    '<section class="card list"><div class="between"><h2 class="h">You can make now</h2><span class="small muted">' + can.length + '</span></div>' + filt +
    (can.map(m => '<div class="li"><div><div class="nm">' + esc(m.name) + '</div><div class="sub">' + esc((m.slots || []).map(s => SLOTNAME[s]).join(', ')) + ' · ' + n0(m.protein) + ' g protein' + (m.nutFree === false ? ' · contains nuts' : '') + '</div></div><div class="row"><b class="num">' + n0(m.kcal) + '</b><button class="btn sm ghost" data-act="logmeal" data-id="' + esc(m.id) + '">Log</button></div></div>').join('') || '<div class="empty">Nothing matches.</div>') +
    '<p class="note">Sorted by calories, highest first.</p></section></div>' +
    (short.length ? '<section class="card list"><h2 class="h">One item short</h2>' + short.slice(0, 8).map(m => { const x = missingFor(m)[0]; return '<div class="li"><div><div class="nm">' + esc(m.name) + '</div><div class="sub" style="color:var(--amber-text)">Needs ' + esc(x) + '</div></div><button class="btn sm ghost" data-act="tolist" data-name="' + esc(x) + '">Add to list</button></div>'; }).join('') + '</section>' : '') +
    planWeek();
}
function planWeek() {
  const ws = UI.weekStart, target = Number(S().kcalTarget) || 0, t = todayStr();
  let cols = '';
  for (let i = 0; i < 7; i++) {
    const d = addDays(ws, i), p = planFor(d), tot = sum(Object.values(p), id => (mealById(id) || {}).kcal);
    cols += '<div class="day' + (d === t ? ' today' : '') + '"><div class="between"><b>' + DAYS[pd(d).getDay()] + ' ' + pd(d).getDate() + '</b>' + (isKid() && isSport(d) ? '<span class="chip amber">Football</span>' : '') + '</div><span class="chip ' + (target && tot >= target * 0.95 ? 'green' : tot ? 'amber' : '') + '">' + n0(tot) + (target ? ' / ' + n0(target) : '') + '</span>' +
      SLOTS.map(s => { let opts = meals().filter(m => (m.slots || []).includes(s.k)); if (s.k === 'lunch' && isKid() && schoolDay(d)) opts = opts.filter(lunchOK); opts.sort((a, b) => a.name.localeCompare(b.name)); const cur = p[s.k];
        return '<div><div class="sl">' + s.n + '</div><select data-act="plansel" data-d="' + d + '" data-slot="' + s.k + '" aria-label="' + s.n + ' ' + esc(fmtD(d)) + '"><option value="">—</option>' + opts.map(o => '<option value="' + esc(o.id) + '"' + (o.id === cur ? ' selected' : '') + '>' + esc(o.name) + ' (' + n0(o.kcal) + ')</option>').join('') + '</select></div>'; }).join('') + '</div>';
  }
  return '<section class="card"><div class="between"><div class="row"><button class="btn sm ghost" data-act="week" data-d="-7" aria-label="Previous week">‹</button><h2 class="h">Week of ' + esc(fmtD(ws, { day: 'numeric', month: 'short' })) + '</h2><button class="btn sm ghost" data-act="week" data-d="7" aria-label="Next week">›</button></div><button class="btn sm" data-act="autofill">Fill empty slots</button></div><div class="planweek">' + cols + '</div><p class="note">Fill uses what\'s in stock, puts recovery drinks after football and keeps school lunches nut-free.</p></section>';
}
function autofill() {
  const used = {}; let n = 0;
  for (let i = 0; i < 7; i++) {
    const d = addDays(UI.weekStart, i), cur = Object.assign({}, planFor(d));
    for (const s of SLOTS) { if (cur[s.k]) continue;
      let opts = meals().filter(m => (m.slots || []).includes(s.k) && !(m.tags || []).includes('takeaway') && (m.ingredients || []).length);
      if (s.k === 'lunch' && isKid() && schoolDay(d)) opts = opts.filter(lunchOK);
      if (s.k === 'after' && isKid() && isSport(d)) { const r = opts.filter(m => (m.tags || []).includes('recovery')); if (r.length) opts = r; }
      if (!opts.length) continue;
      opts.sort((a, b) => (canMake(b) - canMake(a)) || ((used[a.id] || 0) - (used[b.id] || 0)) || b.kcal - a.kcal);
      cur[s.k] = opts[0].id; used[opts[0].id] = (used[opts[0].id] || 0) + 1; n++; }
    put('plan', d, { date: d, slots: cur });
  }
  toast(n ? 'Filled ' + n + ' slots' : 'Nothing to fill');
}

/* ---------- Health ---------- */
function vHealth() {
  if (ME.scope !== 'all') return '<div class="empty">Not available.</div>';
  const st = S();
  const ev = col('events').sort((a, b) => b.date.localeCompare(a.date));
  const bone = ev.filter(e => e.kind === 'bone-age');
  const eyes = ev.filter(e => e.kind === 'eyesight');
  const feed = ev.filter(e => e.kind !== 'eyesight');
  const qs = col('questions').sort((a, b) => ((a.answered ? 1 : 0) - (b.answered ? 1 : 0)) || String(a.created || '').localeCompare(String(b.created || '')));
  const ws = weights(), hs = heights(), lw = ws[ws.length - 1], lh = hs[hs.length - 1];
  let top = '';
  if (isKid()) {
    top = '<div class="tiles">' +
      tile('Height', lh ? lh.height_cm + '<small> cm</small>' : '—', lh ? fmtCent(centile(sds('height', ageAt(lh.date), lh.height_cm))) + ' centile · ' + fmtD(lh.date, { month: 'short', year: 'numeric' }) : '', '') +
      tile('Weight', lw ? lw.weight_kg + '<small> kg</small>' : '—', lw ? fmtCent(centile(sds('weight', ageAt(lw.date), lw.weight_kg))) + ' centile · ' + fmtD(lw.date, { month: 'short', year: 'numeric' }) : '', 'amber') +
      tile('Bone age', bone[0] ? esc(bone[0].value) : '—', bone[0] ? 'At ' + fmtAge(ageAt(bone[0].date)) + ' · ' + fmtD(bone[0].date, { month: 'short', year: 'numeric' }) : '', '') +
      tile('Eyesight', eyes[0] ? esc(String(eyes[0].value).split(' ')[0]) : '—', eyes[0] ? (eyes[1] ? 'was ' + esc(String(eyes[1].value).split(' ')[0]) + ' in ' + fmtD(eyes[1].date, { month: 'short', year: 'numeric' }) : '') : '', '') + '</div>';
  } else {
    top = '<div class="grid2"><section class="card"><h2 class="h">Daily supplements</h2><div class="uses">' + (st.supplements || []).map(x => '<span style="background:var(--sunk);color:var(--ink)">' + esc(x) + '</span>').join('') + '</div>' + (st.supplementNote ? '<p class="note">' + esc(st.supplementNote) + '</p>' : '') + '</section>' +
      '<section class="card"><h2 class="h">Training</h2><div class="uses">' + (st.training || []).map(x => '<span style="background:var(--sunk);color:var(--ink)">' + esc(x) + '</span>').join('') + '</div><p class="note">' + esc(st.wearable ? st.wearable + ' recovery and sleep can be added when you share them.' : '') + '</p></section></div>';
  }
  return '<div class="between"><h1 class="h1">' + (isKid() ? 'Health record' : 'My health') + '</h1><span class="small muted">Send PDFs or photos of results and letters to Claude to add them here.</span></div>' + top +
    '<div class="grid2">' +
    '<section class="card feed"><h2 class="h">' + (isKid() ? "Doctors' feedback, newest first" : 'Appointments and notes') + '</h2>' + (feed.map(e => '<div class="fi"><div class="dt">' + esc(fmtLong(e.date)) + '</div><div><div class="ti">' + esc(e.title) + (e.value ? ' · ' + esc(e.value) : '') + '</div>' + (e.clinician ? '<div class="tiny muted">' + esc(e.clinician) + '</div>' : '') + (e.detail ? '<div class="tx">' + esc(e.detail) + '</div>' : '') + '</div></div>').join('') || '<div class="empty">Nothing yet.</div>') + '</section>' +
    '<div style="display:flex;flex-direction:column;gap:16px">' +
    '<section class="card"><h2 class="h">Questions for the next appointment</h2>' + (qs.map(q => '<label class="checkrow' + (q.answered ? ' done' : '') + '"><input type="checkbox" data-act="qtoggle" data-id="' + esc(q.id) + '"' + (q.answered ? ' checked' : '') + '><span>' + esc(q.text) + (q.answer ? '<br><span class="tiny muted">' + esc(q.answer) + '</span>' : '') + '</span></label>').join('') || '<div class="empty">None yet.</div>') +
    '<form data-act="addq" class="row"><input id="newq" placeholder="Add a question" aria-label="New question" style="flex:1 1 200px"><button class="btn sm" type="submit">Add</button></form></section>' +
    (bone.length ? '<section class="card"><h2 class="h">Bone age</h2><table class="t"><thead><tr><th>X-ray</th><th class="n">Actual age</th><th class="n">Bone age</th></tr></thead><tbody>' + bone.map(b => '<tr><td>' + esc(fmtD(b.date, { month: 'short', year: 'numeric' })) + '</td><td class="n">' + (ageAt(b.date) || 0).toFixed(1) + '</td><td class="n">' + esc(b.value) + '</td></tr>').join('') + '</tbody></table></section>' : '') +
    '</div></div>' + labsTable() + settingsCard();
}
function labsTable() {
  const labs = col('labs');
  const dates = [...new Set(labs.map(l => l.date))].sort();
  if (!labs.length) return '<section class="card"><h2 class="h">Blood results</h2><div class="empty">No results yet. Send them to Claude and they\'ll appear here as a table with each test over time.</div></section>';
  const byKey = new Map();
  labs.forEach(l => { const k = l.key || slug(l.name); if (!byKey.has(k)) byKey.set(k, { name: l.name, group: l.group || 'Other', order: l.order == null ? 99 : l.order, items: {} }); const r = byKey.get(k); r.items[l.date] = l; });
  const rows = [...byKey.values()].sort((a, b) => ((GROUPS.indexOf(a.group) + 1 || 99) - (GROUPS.indexOf(b.group) + 1 || 99)) || a.order - b.order);
  let body = '', grp = null;
  rows.forEach(r => {
    if (r.group !== grp) { grp = r.group; body += '<tr class="g"><td colspan="' + (dates.length + 3) + '">' + esc(grp) + '</td></tr>'; }
    const latest = r.items[Object.keys(r.items).sort().pop()];
    const rng = latest.range || (latest.low != null && latest.high != null ? latest.low + '–' + latest.high : latest.high != null ? '≤' + latest.high : '');
    body += '<tr><td>' + esc(r.name) + '</td>' + dates.map(d => { const l = r.items[d]; if (!l) return '<td class="n dash">—</td>'; return '<td class="n" title="' + esc((l.lab || '') + (l.note ? ' · ' + l.note : '')) + '">' + esc(l.value) + (l.flag ? '<span class="f">' + esc(l.flag) + '</span>' : '') + '</td>'; }).join('') + '<td class="u">' + esc(latest.unit || '') + '</td><td class="u">' + esc(rng) + '</td></tr>';
  });
  return '<section class="card"><div class="between"><h2 class="h">All blood results</h2><span class="tiny muted">H / L = outside that lab\'s range. Tap a value for the lab and notes.</span></div><div class="scroll"><table class="t"><thead><tr><th>Test</th>' + dates.map(d => '<th class="n">' + esc(fmtD(d, { month: 'short', year: 'numeric' })) + '</th>').join('') + '<th>Unit</th><th>Latest range</th></tr></thead><tbody>' + body + '</tbody></table></div></section>';
}
function settingsCard() {
  const st = S();
  return '<details class="card"><summary class="h" style="cursor:pointer">Targets and routine</summary><form data-act="savesettings" style="display:flex;flex-direction:column;gap:12px;margin-top:12px">' +
    '<div class="fields"><label>Daily kcal target<input id="s_k" type="number" value="' + esc(st.kcalTarget == null ? '' : st.kcalTarget) + '"></label><label>Protein target (g)<input id="s_p" type="number" value="' + esc(st.proteinTarget == null ? '' : st.proteinTarget) + '"></label>' + (isKid() ? '<label>Lights out<input id="s_l" type="time" value="' + esc(st.lightsOut || '') + '"></label>' : '') + '</div>' +
    (isKid() ? '<div><div class="small" style="font-weight:600;margin-bottom:6px">Football and sport days</div><div class="row">' + [1, 2, 3, 4, 5, 6, 0].map(d => '<label class="checkrow" style="width:auto;background:var(--sunk);padding:6px 10px;border-radius:8px"><input type="checkbox" name="s_td" value="' + d + '"' + ((st.trainingDays || []).includes(d) ? ' checked' : '') + '>' + DAYS[d] + '</label>').join('') + '</div></div><label class="checkrow"><input type="checkbox" id="s_nf"' + (st.nutFreeSchool ? ' checked' : '') + '>School is nut-free</label>' : '') +
    '<button class="btn" type="submit">Save</button></form></details>';
}

/* ---------- Shopping ---------- */
function shopItems() {
  const items = new Map();
  col('pantry').filter(p => p.status === 'out' || p.status === 'low').forEach(p => items.set(slug(p.name), { name: p.name, why: p.status === 'out' ? 'Out' : 'Running low', store: p.store || '', pid: p.id }));
  const t = todayStr();
  for (const per of ['kristan', 'harps']) { if (per === 'harps' && ME.scope !== 'all') continue;
    for (let i = 0; i < 7; i++) { const pl = (get('plan', addDays(t, i), per) || {}).slots || {}; for (const k in pl) { const m = mealById(pl[k]); if (!m) continue; missingFor(m).forEach(n => { const key = slug(n); if (!items.has(key)) { const pp = pantryItem(n); items.set(key, { name: n, why: 'For ' + m.name, store: (pp && pp.store) || '', pid: pp && pp.id }); } }); } } }
  col('shopping').filter(x => !x.done).forEach(x => { const key = slug(x.name); if (!items.has(key)) items.set(key, { name: x.name, why: 'Added', store: x.store || '', mid: x.id }); else items.get(key).mid = x.id; });
  return [...items.values()];
}
function vShop() {
  const shop = shopItems(); const by = {}; shop.forEach(i => (by[i.store || 'Any shop'] = by[i.store || 'Any shop'] || []).push(i));
  const pan = col('pantry'); const cnt = s => pan.filter(p => p.status === s).length;
  const groups = {}; pan.forEach(p => (groups[p.category || 'Other'] = groups[p.category || 'Other'] || []).push(p));
  return '<div class="between"><h1 class="h1">Shopping</h1><span class="small muted">Send receipts to Claude to update the pantry</span></div>' +
    '<div class="tiles">' + tile('In stock', cnt('plenty'), '', 'green') + tile('Low', cnt('low'), '', 'amber') + tile('Out', cnt('out'), '', '') + tile('Not checked', cnt('unchecked'), '', '') + '</div>' +
    '<div class="grid2"><section class="card"><div class="between"><h2 class="h">To buy</h2><span class="chip green">' + shop.length + '</span></div>' +
    (shop.length ? Object.keys(by).sort().map(st => '<div><div class="h" style="margin:8px 0 2px">' + esc(st) + '</div>' + by[st].sort((a, b) => a.name.localeCompare(b.name)).map(i => '<label class="checkrow" style="padding:9px 0;border-top:1px solid var(--line2)"><input type="checkbox" data-act="bought" data-name="' + esc(i.name) + '" data-pid="' + esc(i.pid || '') + '" data-mid="' + esc(i.mid || '') + '"><span>' + esc(i.name) + '<br><span class="tiny muted">' + esc(i.why) + '</span></span></label>').join('') + '</div>').join('') : '<div class="empty">Nothing to buy.</div>') +
    '<form data-act="addshop" class="row"><input id="shopname" placeholder="Add an item" aria-label="Add an item" style="flex:1 1 160px"><input id="shopstore" placeholder="Shop" aria-label="Shop" style="flex:0 1 120px"><button class="btn sm" type="submit">Add</button></form><p class="note">Tick an item when bought and it goes back in stock.</p></section>' +
    '<section class="card"><h2 class="h">Pantry</h2><p class="note">Tap a status: In stock → Low → Out.</p>' + CATS.filter(c => groups[c]).map(c => '<div><div class="h" style="margin:8px 0 2px">' + esc(c) + '</div><div class="list">' + groups[c].sort((a, b) => a.name.localeCompare(b.name)).map(p => '<div class="li"><span>' + esc(p.name) + (p.store ? ' <span class="tiny muted">· ' + esc(p.store) + '</span>' : '') + '</span><button class="st ' + esc(p.status || 'unchecked') + '" data-act="cycle" data-id="' + esc(p.id) + '">' + STLABEL[p.status || 'unchecked'] + '</button></div>').join('') + '</div></div>').join('') +
    '<details><summary class="small" style="cursor:pointer;font-weight:600">Add items</summary><form data-act="addpantry" class="fields" style="margin-top:8px"><label>Item<input id="pn" required></label><label>Section<select id="pc">' + CATS.map(c => '<option>' + esc(c) + '</option>').join('') + '</select></label><label>Shop<input id="ps"></label><button class="btn sm" type="submit" style="align-self:end">Add</button></form></details></section></div>';
}

/* ---------- actions ---------- */
function logMeal(slot, m, s) {
  s = s || todayStr();
  const cur = JSON.parse(JSON.stringify(dayLog(s))); cur.date = s; cur.items = cur.items || [];
  cur.items.push({ k: uid(), slot, mealId: m.id || null, name: m.name, kcal: Math.round(Number(m.kcal) || 0), protein: Math.round(Number(m.protein) || 0), portion: 1, at: new Date().toISOString() });
  put('log', s, cur); toast('Logged ' + m.name);
}
document.addEventListener('click', async e => {
  const b = e.target.closest('[data-act]');
  if (!e.target.closest('.hb-menuwrap')) closeMenus();
  if (!b || ['INPUT', 'SELECT', 'TEXTAREA', 'FORM', 'LABEL'].includes(b.tagName)) return;
  const a = b.dataset.act;
  if (a.startsWith('tm-') || a.startsWith('tr-')) { if (window.HT) window.HT.click(a, b); return; }
  if (a === 'appmenu') return toggleMenu('appMenu', b);
  if (a === 'acctmenu') return toggleMenu('acctMenu', b);
  if (a === 'tab') { TAB = b.dataset.tab; try { localStorage.setItem('hh_tab', TAB); } catch (_) {} window.scrollTo(0, 0); render(); }
  else if (a === 'person') { P = b.dataset.p; UI.gen.idx = 0; try { localStorage.setItem('hh_person', P); } catch (_) {} render(); }
  else if (a === 'signout') { await sb.auth.signOut(); location.reload(); }
  else if (a === 'day') { const d = Number(b.dataset.d); UI.day = d === 0 ? todayStr() : addDays(UI.day, d); render(); }
  else if (a === 'week') { UI.weekStart = addDays(UI.weekStart, Number(b.dataset.d)); render(); }
  else if (a === 'logmeal') { const m = mealById(b.dataset.id); if (m) logMeal(bestSlotNow(), m, UI.day); }
  else if (a === 'logplanned') { const m = mealById(b.dataset.id); if (m) logMeal(b.dataset.slot, m, UI.day); }
  else if (a === 'unlog') { const cur = JSON.parse(JSON.stringify(dayLog(UI.day))); cur.items = (cur.items || []).filter(i => i.k !== b.dataset.k); put('log', UI.day, cur); }
  else if (a === 'genslot') { UI.gen.slot = b.dataset.slot; UI.gen.idx = 0; render(); }
  else if (a === 'gennext') { UI.gen.idx++; render(); }
  else if (a === 'genhave') { const m = mealById(b.dataset.id); const sl = UI.gen.slot === 'snack' ? (bestSlotNow() === 'bed' ? 'bed' : 'break') : UI.gen.slot; if (m) logMeal(sl, m); }
  else if (a === 'mealfilter') { UI.mealFilter = b.dataset.f; render(); }
  else if (a === 'tolist') { const n = b.dataset.name; const pp = pantryItem(n); if (pp) put('pantry', pp.id, Object.assign({}, get('pantry', pp.id), { status: 'out' })); else put('shopping', slug(n), { name: n, done: false, store: '', added: todayStr() }); toast(n + ' added to the list'); }
  else if (a === 'autofill') autofill();
  else if (a === 'cycle') { const p = get('pantry', b.dataset.id); if (p) { const o = ['plenty', 'low', 'out']; put('pantry', b.dataset.id, Object.assign({}, p, { status: o[(o.indexOf(p.status) + 1) % 3] || 'plenty', updated: todayStr() })); } }
  else if (a === 'delgrowth') { if (b.dataset.armed !== '1') { b.dataset.armed = '1'; b.textContent = 'Remove?'; setTimeout(() => { if (b.isConnected) { b.dataset.armed = ''; b.textContent = '✕'; } }, 3500); return; } del('growth', b.dataset.id); }
});
document.addEventListener('change', e => {
  if (window.HT && e.target.dataset && window.HT.change(e.target)) return;
  const t = e.target, a = t.dataset && t.dataset.act; if (!a) return;
  if (a === 'plansel') { const d = t.dataset.d, cur = JSON.parse(JSON.stringify(get('plan', d) || { date: d, slots: {} })); cur.date = d; cur.slots = cur.slots || {}; if (t.value) cur.slots[t.dataset.slot] = t.value; else delete cur.slots[t.dataset.slot]; put('plan', d, cur); }
  else if (a === 'qtoggle') { const q = get('questions', t.dataset.id); if (q) put('questions', t.dataset.id, Object.assign({}, q, { answered: t.checked, answered_on: todayStr() })); }
  else if (a === 'bought') { const pid = t.dataset.pid, mid = t.dataset.mid, n = t.dataset.name;
    if (pid) put('pantry', pid, Object.assign({}, get('pantry', pid), { status: 'plenty', updated: todayStr() }));
    else put('pantry', slug(n), { name: n.toLowerCase(), category: 'Other', status: 'plenty', updated: todayStr() });
    if (mid) put('shopping', mid, Object.assign({}, get('shopping', mid), { done: true })); }
});
document.addEventListener('input', e => { const t = e.target; if (window.HT && t.dataset && window.HT.input(t)) return; if (t.dataset && t.dataset.act === 'typedtext') UI.typed = t.value; if (t.id === 'typedSlot') UI.typedSlot = t.value; });
document.addEventListener('submit', async e => {
  const f = e.target, a = f.dataset.act; if (f.id === 'loginForm') { e.preventDefault(); const em = $('em').value.trim(), pw = $('pw').value; const { error } = await sb.auth.signInWithPassword({ email: em, password: pw }); if (error) { $('loginErr').textContent = 'That email and password didn\'t work.'; return; } return boot(); }
  if (!a) return; e.preventDefault();
  if (a === 'typed') { const txt = ($('typed').value || '').trim(); if (!txt) return; const slot = $('typedSlot').value; const s = UI.day; const cur = JSON.parse(JSON.stringify(dayLog(s))); cur.date = s; cur.items = cur.items || []; cur.items.push({ k: uid(), slot, name: txt, pending: true, kcal: null, protein: null, at: new Date().toISOString() }); UI.typed = ''; UI.typedSlot = null; put('log', s, cur); toast('Saved. Claude will add the calories.'); }
  else if (a === 'addgrowth') { const date = $('g_date').value, w = parseFloat($('g_w').value), h = parseFloat($('g_h').value); if (!(w > 0) && !(h > 0)) { toast('Enter a weight or a height'); return; } const d = { date, source: $('g_src').value.trim() }; if (w > 0) d.weight_kg = w; if (h > 0) d.height_cm = h; put('growth', 'g-' + date + '-' + uid().slice(0, 4), d); toast('Saved'); }
  else if (a === 'addq') { const t = $('newq').value.trim(); if (!t) return; put('questions', 'q-' + uid(), { text: t, answered: false, created: new Date().toISOString() }); }
  else if (a === 'addshop') { const n = $('shopname').value.trim(); if (!n) return; put('shopping', slug(n), { name: n, store: $('shopstore').value.trim(), done: false, added: todayStr() }); }
  else if (a === 'addpantry') { const n = $('pn').value.trim(); if (!n) return; put('pantry', slug(n), { name: n.toLowerCase(), category: $('pc').value, store: $('ps').value.trim(), status: 'plenty', updated: todayStr() }); }
  else if (a === 'savesettings') { const cur = Object.assign({}, get('settings', 'main') || {}); const k = $('s_k').value, p = $('s_p').value; cur.kcalTarget = k ? Number(k) : null; cur.proteinTarget = p ? Number(p) : null; if (isKid()) { cur.lightsOut = $('s_l').value; cur.trainingDays = [...f.querySelectorAll('input[name="s_td"]:checked')].map(x => Number(x.value)); cur.nutFreeSchool = $('s_nf').checked; } put('settings', 'main', cur); toast('Saved'); }
});

window.HHAPI = { col, get, put, del, esc, todayStr, addDays, mondayOf, pd, fmtD, fmtLong, n0, uid, toast, render, tile };
boot().catch(err => { $('view').innerHTML = '<div class="card login"><h1 class="h1">Something went wrong</h1><p class="note">' + esc(err && err.message || err) + '</p></div>'; });
})();
