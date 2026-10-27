/* Hollyend: Supabase storage behind the same small interface the quiz page already uses
   (collection().orderBy().limit().onSnapshot(), add(), doc(id).set()/update()). */
(function () {
  var URL = "https://dikpmyisanokawbqohqa.supabase.co";
  var KEY = "sb_publishable_NRVj2LYn2cY-RmOsw6WjZw_JdHb5INR";
  var LOGINS = {
    millie: { email: "millie@hollyend.com", label: "Millie" },
    kristan: { email: "kristan@hollyend.com", label: "Kristan" },
    parent: { email: "dad@hollyend.com", label: "Dad" }
  };
  var sb = window.supabase.createClient(URL, KEY, { auth: { persistSession: true, autoRefreshToken: true } });
  var COLS = {
    attempts: { child: 1, mode: 1, topic: 1, week: 1, level: 1, at: 1, score: 1, total: 1, points: 1, bestRun: "best_run", comebackRight: "comeback_right", comebackTotal: "comeback_total", masteredAny: "mastered_any", results: 1, missed: 1 },
    purchases: { child: 1, item: 1, cost: 1, at: 1 },
    profiles: { child: 1, equipped: 1, updatedAt: "updated_at" },
    bank: { child: 1, pence: 1, points: 1, at: 1, week: 1, status: 1, paidAt: "paid_at", cancelledAt: "cancelled_at" }
  };
  function toRow(t, d) { var m = COLS[t], r = {}; Object.keys(d || {}).forEach(function (k) { if (m[k]) r[m[k] === 1 ? k : m[k]] = d[k]; }); return r; }
  function fromRow(t, r) { var m = COLS[t], back = {}, o = {}; Object.keys(m).forEach(function (k) { back[m[k] === 1 ? k : m[k]] = k; }); Object.keys(r).forEach(function (k) { if (back[k]) o[back[k]] = r[k]; }); return o; }
  function err(e) { var m = (e && e.message) || ""; return { code: /row-level security|permission|violates/i.test(m) ? "invalid_argument" : /Not enough points|Weekly limit/i.test(m) ? "invalid_argument" : "unavailable", message: m }; }

  var subs = {}, timers = {};
  function fetchTable(t) {
    var q = sb.from(t).select("*");
    if (t === "attempts") q = q.order("at", { ascending: false }).limit(1000);
    return q.then(function (res) {
      if (res.error) throw res.error;
      var docs = res.data.map(function (r) { var d = fromRow(t, r); return { id: t === "profiles" ? r.child : r.id, data: function () { return d; } }; });
      (subs[t] || []).forEach(function (s) { s.cb({ docs: docs }); });
    }).catch(function (e) { (subs[t] || []).forEach(function (s) { if (s.err) s.err(err(e)); }); });
  }
  function refetch(t) { clearTimeout(timers[t]); timers[t] = setTimeout(function () { fetchTable(t); }, 150); }
  var channel = null;
  function listen() {
    if (channel) return;
    channel = sb.channel("hollyend");
    Object.keys(COLS).forEach(function (t) { channel.on("postgres_changes", { event: "*", schema: "public", table: t }, function () { refetch(t); }); });
    channel.subscribe();
    document.addEventListener("visibilitychange", function () { if (!document.hidden) Object.keys(subs).forEach(refetch); });
  }
  function collection(t) {
    var api = {
      orderBy: function () { return api; }, limit: function () { return api; },
      onSnapshot: function (cb, e) { (subs[t] = subs[t] || []).push({ cb: cb, err: e }); listen(); fetchTable(t); return function () {}; },
      add: function (d) { return sb.from(t).insert(toRow(t, d)).select("id").single().then(function (res) { if (res.error) throw err(res.error); refetch(t); return { id: res.data.id }; }); },
      doc: function (id) {
        return {
          set: function (d) { return sb.from(t).upsert(toRow(t, Object.assign({}, d, t === "profiles" ? { child: id } : {}))).then(function (res) { if (res.error) throw err(res.error); refetch(t); }); },
          update: function (d) { return sb.from(t).update(toRow(t, d)).eq(t === "profiles" ? "child" : "id", id).then(function (res) { if (res.error) throw err(res.error); refetch(t); }); }
        };
      }
    };
    return api;
  }
  var dbApi = { collection: collection };

  /* ---------- sign in ---------- */
  var ready, member = null;
  var gate = new Promise(function (res) { ready = res; });
  window.HOLLYEND = { member: function () { return member; }, signOut: function () { sb.auth.signOut().then(function () { location.reload(); }); }, logins: LOGINS };
  window.claude = { use: function (name) { return name === "db" ? gate : Promise.resolve(null); } };

  function loadMember() {
    return sb.from("members").select("role, child, display_name").eq("user_id", (window.__uid || "")).maybeSingle().then(function (r) { return r.data; });
  }
  function start(session) {
    window.__uid = session.user.id;
    loadMember().then(function (m) {
      if (!m) { showLogin("This login isn’t set up for Hollyend yet. Ask Dad to check it."); sb.auth.signOut(); return; }
      member = m; hideLogin(); document.dispatchEvent(new CustomEvent("hollyend:member", { detail: m })); ready(dbApi);
    });
  }
  function showLogin(msg) {
    var el = document.getElementById("login"); el.hidden = false;
    document.getElementById("loginMsg").textContent = msg || "";
  }
  function hideLogin() { document.getElementById("login").hidden = true; }
  document.addEventListener("DOMContentLoaded", function () {
    var who = null;
    [].forEach.call(document.querySelectorAll("[data-who]"), function (b) {
      b.addEventListener("click", function () {
        who = b.dataset.who;
        [].forEach.call(document.querySelectorAll("[data-who]"), function (x) { x.setAttribute("aria-pressed", x === b); });
        document.getElementById("pwWrap").hidden = false;
        document.getElementById("pwLabel").textContent = LOGINS[who].label + "’s password";
        document.getElementById("pw").focus();
      });
    });
    document.getElementById("loginForm").addEventListener("submit", function (e) {
      e.preventDefault(); if (!who) return;
      var btn = document.getElementById("loginBtn"); btn.disabled = true; document.getElementById("loginMsg").textContent = "Signing in…";
      sb.auth.signInWithPassword({ email: LOGINS[who].email, password: document.getElementById("pw").value }).then(function (r) {
        btn.disabled = false;
        if (r.error) { document.getElementById("loginMsg").textContent = "That password didn’t work. Try again, or ask Mum or Dad."; return; }
        document.getElementById("pw").value = ""; start(r.data.session);
      });
    });
    sb.auth.getSession().then(function (r) { if (r.data.session) start(r.data.session); else showLogin(""); });
  });
})();
