/* Millie's look and feel, kept in one place so a new theme is one new entry here.
   A theme only changes how her side LOOKS (colours, background, decorations, the title and a few of the
   monkeys' words). Games, quizzes, the journey and the shop keep their own content.

   To change Millie's theme: set MILLIE_LOOK.theme to another key in THEMES (or add a new one below,
   copying the jungle entry). MILLIE_LOOK.keepSpaceOn lists the pages that stay in the space look
   (the journey and Space Arcade live on "world"; the shop and avatar on "shop"). */

var MILLIE_LOOK = { theme: "jungle", keepSpaceOn: ["world", "shop"] };

/* Small helper: an inline SVG as a CSS url(). */
function svgUrl(svg) { return 'url("data:image/svg+xml,' + encodeURIComponent(svg.replace(/\s+/g, " ").trim()) + '")'; }

var THEMES = {
  space: {
    name: "Space",
    title: "&amp; her Space Monkeys",
    meta: "#080b2b",
    vars: {
      "--bg": "#080b2b", "--card": "#141a4d", "--card2": "#1c2363", "--ink": "#f3f1ff", "--muted": "#b3b7e3", "--line": "#2f3786",
      "--accent": "#ff6fb5", "--accent2": "#9b8cff", "--on-accent": "#2a0716", "--accent-soft": "#3a1f5c",
      "--good": "#4fe0a0", "--good-soft": "#123a33", "--bad": "#ff7a6b", "--bad-soft": "#47192f", "--tip": "#ffd36b", "--tip-soft": "#372f1c",
      "--gold": "#ffd36b", "--gold-soft": "#3a3018"
    },
    background: [
      "radial-gradient(1.4px 1.4px at 22px 34px, #fff 50%, transparent 52%) 0 0 / 280px 260px",
      "radial-gradient(1px 1px at 140px 90px, #dfe4ff 50%, transparent 52%) 0 0 / 280px 260px",
      "radial-gradient(1.8px 1.8px at 210px 160px, #ffe7f3 50%, transparent 52%) 0 0 / 280px 260px",
      "radial-gradient(1px 1px at 70px 210px, #fff 50%, transparent 52%) 0 0 / 280px 260px",
      "radial-gradient(1.2px 1.2px at 250px 40px, #cfe9ff 50%, transparent 52%) 0 0 / 280px 260px",
      "radial-gradient(700px 460px at 92% -6%, rgba(155,140,255,.30), transparent 70%)",
      "radial-gradient(560px 420px at -12% 34%, rgba(255,111,181,.18), transparent 70%)"
    ],
    dot: "polygon(50% 0, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
    glow: "rgba(255,111,181,.6)",
    top: null, corners: null,
    words: { hero: "the cleverest astronaut in the whole galaxy", go: "Rocket fuel loading… 3… 2… 1… QUIZ!", ready: "Ready for today's mission? I'll hold the bananas, you do the brain bit." }
  },

  jungle: {
    name: "Jungle",
    title: "&amp; her Jungle Monkeys",
    meta: "#0b2016",
    vars: {
      "--bg": "#0b2016", "--card": "#143323", "--card2": "#1b412d", "--ink": "#f4f8ec", "--muted": "#b4c8a6", "--line": "#2c573d",
      "--accent": "#ffc93c", "--accent2": "#ff8a3d", "--on-accent": "#2b1d00", "--accent-soft": "#3a3416",
      "--good": "#72e39d", "--good-soft": "#123b26", "--bad": "#ff8a73", "--bad-soft": "#47201b", "--tip": "#ffe08a", "--tip-soft": "#38331a",
      "--gold": "#ffd36b", "--gold-soft": "#3a3018"
    },
    background: [
      /* dappled sunlight through the canopy */
      "radial-gradient(640px 420px at 88% -8%, rgba(255,214,102,.20), transparent 70%)",
      "radial-gradient(520px 420px at -10% 40%, rgba(120,200,110,.16), transparent 70%)",
      "radial-gradient(420px 360px at 60% 105%, rgba(255,138,61,.10), transparent 70%)",
      /* scattered leaves */
      svgUrl('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><g fill="#9fd88b" fill-opacity=".07">' +
        '<path d="M30 60c18-22 52-24 70-2-20 20-52 22-70 2z" transform="rotate(-24 65 60)"/>' +
        '<path d="M190 40c14-18 42-19 56-2-16 16-42 18-56 2z" transform="rotate(30 218 40)"/>' +
        '<path d="M120 170c20-24 58-26 78-2-22 22-58 24-78 2z" transform="rotate(-48 160 170)"/>' +
        '<path d="M240 230c14-18 42-19 56-2-16 16-42 18-56 2z" transform="rotate(12 268 230)"/>' +
        '<path d="M20 250c12-15 35-16 47-2-14 14-35 15-47 2z" transform="rotate(60 44 250)"/></g></svg>') + " 0 0 / 300px 300px"
    ],
    dot: "ellipse(50% 32% at 50% 50%)",
    glow: "rgba(255,201,60,.55)",
    /* a vine with leaves along the top of the page */
    top: svgUrl('<svg xmlns="http://www.w3.org/2000/svg" width="220" height="52" viewBox="0 0 220 52">' +
      '<path d="M0 16C40 30 70 4 110 16S180 30 220 16" fill="none" stroke="#5b8a3c" stroke-width="4" stroke-linecap="round"/>' +
      '<g fill="#3f8f4a"><path d="M36 22c-6 8-4 18 4 22 6-8 4-18-4-22z"/><path d="M92 12c-9 3-14 12-11 20 9-3 14-12 11-20z"/>' +
      '<path d="M150 22c-4 9 0 18 8 20 4-9 0-18-8-20z"/><path d="M196 18c-9 2-14 10-12 19 9-2 14-10 12-19z"/></g>' +
      '<g fill="#6fbf5a"><path d="M64 10c-8-2-15 3-17 10 8 2 15-3 17-10z"/><path d="M128 18c8-3 16 1 18 8-8 3-16-1-18-8z"/></g></svg>'),
    /* big leaves in the corners */
    corners: [
      svgUrl('<svg xmlns="http://www.w3.org/2000/svg" width="260" height="260" viewBox="0 0 260 260"><g fill="#0f3d24">' +
        '<path d="M0 260C10 170 70 120 160 130 120 190 70 240 0 260z"/><path d="M0 200C-4 130 30 70 100 50 100 120 60 170 0 200z"/></g>' +
        '<g fill="none" stroke="#1d5a35" stroke-width="3"><path d="M0 260C50 210 100 170 160 130"/><path d="M0 200C30 150 60 100 100 50"/></g></svg>') + " left bottom / 260px 260px no-repeat",
      svgUrl('<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><g fill="#0f3d24">' +
        '<path d="M240 0C230 90 170 130 90 120 130 60 180 14 240 0z"/><path d="M240 70C246 130 210 180 150 196 150 136 190 96 240 70z"/></g>' +
        '<g fill="none" stroke="#1d5a35" stroke-width="3"><path d="M240 0C190 50 140 90 90 120"/><path d="M240 70C210 110 180 150 150 196"/></g></svg>') + " right top / 240px 240px no-repeat"
    ],
    words: { hero: "the cleverest explorer in the whole jungle", go: "Swinging into the quiz… 3… 2… 1… GO!", ready: "Ready for today's jungle adventure? I'll hold the bananas, you do the brain bit." }
  }
};

function millieTheme(zone) { return THEMES[zone === "space" ? "space" : MILLIE_LOOK.theme] || THEMES.space; }
function millieZone(view) { return MILLIE_LOOK.keepSpaceOn.indexOf(view) >= 0 ? "space" : "main"; }

/* ---------- Jungle animals for Millie's jungle look ----------
   CRITTERS sit around the edges of the page (behind the cards). PEEK puts one animal on the top edge of the
   first card on some pages. The two monkeys (title and helper) stay as they are. */
var CRITTER_SVG = {
  toucan: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M8 92h84" stroke="#6b4a2b" stroke-width="6" stroke-linecap="round"/><path d="M42 84l-3 9M54 84l3 9" stroke="#f0a030" stroke-width="3.5" stroke-linecap="round"/><path d="M40 82 30 99 50 90z" fill="#1c1c22"/><ellipse cx="47" cy="62" rx="20" ry="26" fill="#1c1c22"/><ellipse cx="51" cy="58" rx="11" ry="16" fill="#fff4cf"/><ellipse cx="51" cy="72" rx="8" ry="5" fill="#e2392b" opacity=".85"/><circle cx="49" cy="38" r="15" fill="#1c1c22"/><path d="M57 29c18-5 35-1 39 10-9 4-27 7-39 6z" fill="#ffb02e"/><path d="M57 39c14 2 29 2 39 0-6 6-25 8-39 6z" fill="#ff7a1a"/><path d="M91 35c3 1 5 3 5 4l-5 1z" fill="#e2392b"/><ellipse cx="52" cy="34" rx="6" ry="5" fill="#7fd3ff"/><circle cx="53" cy="34" r="2.6" fill="#111"/><circle cx="54" cy="33" r=".9" fill="#fff"/></svg>',
  sloth: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 124"><path d="M0 10C30 18 70 2 100 10" stroke="#5b8a3c" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M34 12C31 30 33 44 40 56M66 9C69 28 67 44 60 56" stroke="#8a6a4a" stroke-width="9" stroke-linecap="round" fill="none"/><path d="M30 8l2 6M35 8l1 6M64 6l-1 6M69 6l-2 6" stroke="#3b2a1c" stroke-width="2" stroke-linecap="round"/><path d="M40 92c-3 10-1 18 3 24M60 92c3 10 1 18-3 24" stroke="#8a6a4a" stroke-width="8" stroke-linecap="round" fill="none"/><ellipse cx="50" cy="76" rx="22" ry="25" fill="#9b7a58"/><path d="M38 70c4 6 4 14 0 20M62 70c-4 6-4 14 0 20" stroke="#866648" stroke-width="2" fill="none"/><circle cx="50" cy="56" r="17" fill="#a8865f"/><ellipse cx="50" cy="58" rx="13" ry="10" fill="#f1dcb8"/><ellipse cx="44" cy="56" rx="5.2" ry="3.4" fill="#5a3f28" transform="rotate(-15 44 56)"/><ellipse cx="56" cy="56" rx="5.2" ry="3.4" fill="#5a3f28" transform="rotate(15 56 56)"/><circle cx="44.5" cy="56" r="1.8" fill="#111"/><circle cx="55.5" cy="56" r="1.8" fill="#111"/><ellipse cx="50" cy="61" rx="2.6" ry="1.8" fill="#3b2a1c"/><path d="M46 64q4 3 8 0" stroke="#3b2a1c" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>',
  parrot: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 112"><path d="M0 80h74" stroke="#6b4a2b" stroke-width="6" stroke-linecap="round"/><path d="M40 76 29 110 42 105 48 78z" fill="#2f6fd6"/><path d="M45 76 41 112 51 105 51 78z" fill="#e23b2e"/><ellipse cx="46" cy="55" rx="15" ry="24" fill="#e23b2e"/><path d="M35 46c-7 13-5 26 6 33 5-11 3-23-6-33z" fill="#ffc93c"/><path d="M37 60c-3 8-1 15 5 19 2-7 1-13-5-19z" fill="#2f6fd6"/><path d="M44 79v5M50 79v5" stroke="#555" stroke-width="3" stroke-linecap="round"/><circle cx="52" cy="33" r="13" fill="#e23b2e"/><ellipse cx="56" cy="33" rx="6.5" ry="5.5" fill="#fff"/><circle cx="56.5" cy="32.5" r="2.3" fill="#111"/><path d="M62 28c9 0 11 9 6 13-2-4-4-6-8-6z" fill="#f4ead8"/><path d="M62 37c3 0 5 2 5 4-3 0-5-1-6-3z" fill="#2b2b2b"/></svg>',
  frog: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 82"><path d="M16 70c-7 2-11 6-9 9h16zM84 70c7 2 11 6 9 9H77z" fill="#ff8a3d"/><ellipse cx="50" cy="56" rx="34" ry="20" fill="#3cbf4a"/><ellipse cx="50" cy="61" rx="20" ry="12" fill="#c8f08a"/><circle cx="32" cy="32" r="12" fill="#3cbf4a"/><circle cx="68" cy="32" r="12" fill="#3cbf4a"/><circle cx="32" cy="31" r="7.5" fill="#fff"/><circle cx="68" cy="31" r="7.5" fill="#fff"/><circle cx="32" cy="31" r="5" fill="#e8322a"/><circle cx="68" cy="31" r="5" fill="#e8322a"/><ellipse cx="32" cy="31" rx="1.5" ry="4" fill="#111"/><ellipse cx="68" cy="31" rx="1.5" ry="4" fill="#111"/><path d="M36 47q14 8 28 0" stroke="#1f6e2a" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="29" cy="49" r="3" fill="#ff9aa2" opacity=".6"/><circle cx="71" cy="49" r="3" fill="#ff9aa2" opacity=".6"/><circle cx="38" cy="75" r="4.5" fill="#ff8a3d"/><circle cx="62" cy="75" r="4.5" fill="#ff8a3d"/></svg>',
  tiger: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 96"><circle cx="28" cy="22" r="12" fill="#f28c28"/><circle cx="92" cy="22" r="12" fill="#f28c28"/><circle cx="28" cy="23" r="6" fill="#ffd8b0"/><circle cx="92" cy="23" r="6" fill="#ffd8b0"/><ellipse cx="60" cy="50" rx="40" ry="34" fill="#f59a32"/><ellipse cx="60" cy="63" rx="18" ry="13" fill="#fff6e8"/><ellipse cx="38" cy="58" rx="9" ry="7" fill="#fff6e8"/><ellipse cx="82" cy="58" rx="9" ry="7" fill="#fff6e8"/><path d="M60 17v12M49 19l3 10M71 19l-3 10M21 42h10M20 52h9M99 42H89M100 52h-9" stroke="#2b1a10" stroke-width="3.5" stroke-linecap="round"/><circle cx="45" cy="46" r="5" fill="#2b1a10"/><circle cx="75" cy="46" r="5" fill="#2b1a10"/><circle cx="46.5" cy="44.5" r="1.6" fill="#fff"/><circle cx="76.5" cy="44.5" r="1.6" fill="#fff"/><path d="M54 57h12l-6 6z" fill="#e0607a"/><path d="M60 63v4M53 68q7 5 14 0" stroke="#2b1a10" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="32" cy="88" rx="15" ry="9" fill="#f59a32"/><ellipse cx="88" cy="88" rx="15" ry="9" fill="#f59a32"/><path d="M27 84v7M33 84v7M83 84v7M89 84v7" stroke="#2b1a10" stroke-width="1.8" stroke-linecap="round"/></svg>',
  chameleon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 80"><path d="M0 68h110" stroke="#6b4a2b" stroke-width="5" stroke-linecap="round"/><path d="M36 58l-4 9M56 58l4 9M72 56l2 11" stroke="#2e9a80" stroke-width="5" stroke-linecap="round"/><path d="M24 52c-11 2-17 11-13 19 4 6 13 4 13-2 0-5-4-6-7-3" stroke="#3fbfa0" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M20 50c4-18 30-24 50-16 10 4 16 12 18 20-16 6-46 8-68-4z" fill="#3fbfa0"/><path d="M68 34c10-5 23 1 27 14l-10 7c-4-2-11-4-17-4z" fill="#3fbfa0"/><path d="M40 40l4 14M52 37l2 16M63 38v14" stroke="#ffce5c" stroke-width="3" opacity=".75" stroke-linecap="round"/><circle cx="84" cy="44" r="6.5" fill="#ffd34d"/><circle cx="85.5" cy="44" r="2.5" fill="#111"/><path d="M93 53q-5 3-9 2" stroke="#1d6b58" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>',
  butterfly: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 50"><path d="M30 24C20 4 2 4 4 18c2 10 14 12 26 6zM30 24C40 4 58 4 56 18c-2 10-14 12-26 6z" fill="#2fa8ff"/><path d="M30 26C20 32 8 44 16 46c8 1 12-10 14-20zM30 26c10 6 22 18 14 20-8 1-12-10-14-20z" fill="#1673d6"/><path d="M10 14c3-3 8-3 10 0M50 14c-3-3-8-3-10 0" stroke="#bfe6ff" stroke-width="1.5" fill="none" opacity=".7"/><ellipse cx="30" cy="27" rx="2.2" ry="11" fill="#1d1d2b"/><path d="M29 17c-2-6-5-9-8-10M31 17c2-6 5-9 8-10" stroke="#1d1d2b" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>'
};
/* where each one sits: [animal, css] */
var CRITTERS = [
  ["toucan", "left: 0; top: 68vh; width: 74px; height: 74px;"],
  ["sloth", "right: 2px; top: calc(env(safe-area-inset-top, 0px) + 46px); width: 66px; height: 82px;", "sway"],
  ["parrot", "left: 0; top: 34vh; width: 78px; height: 87px;", "wide"],
  ["chameleon", "right: 0; top: 62vh; width: 92px; height: 67px;", "wide"],
  ["frog", "left: max(6px, 2vw); bottom: 6px; width: 70px; height: 57px;"],
  ["tiger", "right: max(8px, 3vw); bottom: 0; width: 110px; height: 88px;", "wide"],
  ["butterfly", "left: 18vw; top: 28vh; width: 34px; height: 28px;", "flit wide"],
  ["butterfly", "right: 20vw; top: 82vh; width: 28px; height: 23px;", "flit b"]
];
/* page -> animal perched on the first card */
var PEEK = { homework: "frog", quiz: "toucan", calendar: "parrot", progress: "tiger", reports: "tiger", bank: "chameleon" };
function critterCSS() {
  var u = function (k) { return 'url("data:image/svg+xml,' + encodeURIComponent(CRITTER_SVG[k]) + '")'; };
  var css = '#critters { display: none; position: fixed; inset: 0; z-index: 1; pointer-events: none; }\n' +
    'body.m[data-zone="main"] #critters { display: block; }\n' +
    '#critters i { position: absolute; background: 0 0 / contain no-repeat; filter: drop-shadow(0 4px 6px rgba(0,0,0,.35)); }\n' +
    '#critters i.sway { transform-origin: 50% 0; animation: crSway 6s ease-in-out infinite; }\n' +
    '#critters i.flit { animation: crFlit 9s ease-in-out infinite; } #critters i.flit.b { animation-duration: 12s; animation-delay: -4s; }\n' +
    '@keyframes crSway { 0%, 100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }\n' +
    '@keyframes crFlit { 0%, 100% { transform: translate(0, 0) scaleX(1); } 25% { transform: translate(18px, -14px) scaleX(.55); } 50% { transform: translate(36px, 4px) scaleX(1); } 75% { transform: translate(14px, 12px) scaleX(.6); } }\n' +
    '@media (max-width: 760px) { #critters i.wide { display: none; } #critters i { transform: scale(.75); transform-origin: left top; } #critters i.sway { transform-origin: 50% 0; } }\n' +
    '@media (prefers-reduced-motion: reduce) { #critters i { animation: none !important; } }\n' +
    'body.m[data-zone="main"] #app > section.card:first-of-type { position: relative; }\n' +
    'body.m[data-zone="main"] #app > section.card:first-of-type::after { content: none; position: absolute; top: -50px; right: 26px; width: 64px; height: 54px; background: 0 100% / contain no-repeat; pointer-events: none; filter: drop-shadow(0 3px 4px rgba(0,0,0,.3)); }\n';
  Object.keys(PEEK).forEach(function (v) { css += 'body.m[data-zone="main"] #app[data-view="' + v + '"] > section.card:first-of-type::after { content: ""; background-image: ' + u(PEEK[v]) + '; }\n'; });
  return css + CRITTERS.map(function (c, n) { return '#critters .c' + n + ' { ' + c[1] + ' background-image: ' + u(c[0]) + '; }'; }).join("\n") + "\n";
}

/* Builds the CSS for Millie's main look and for the pages that keep the space look. */
function themeCSS() {
  function block(sel, T) {
    var v = Object.keys(T.vars).map(function (k) { return k + ": " + T.vars[k] + ";"; }).join(" ");
    var bg = T.background.join(", ");
    var css = sel + " { " + v + " background: " + bg + ", var(--bg); background-attachment: fixed; }\n" +
      sel + " .dot { clip-path: " + T.dot + "; width: 15px; height: 15px; border-radius: 0; }\n" +
      sel + " .score { text-shadow: 0 0 18px " + T.glow + "; }\n";
    css += sel + "::before { content: " + (T.top ? '""' : "none") + "; position: fixed; inset: 0 0 auto 0; height: 52px; background: " + (T.top || "none") + " 0 0 / 220px 52px repeat-x; pointer-events: none; z-index: 0; opacity: .9; }\n";
    css += sel + "::after { content: " + (T.corners ? '""' : "none") + "; position: fixed; inset: 0; background: " + (T.corners ? T.corners.join(", ") : "none") + "; pointer-events: none; z-index: 0; opacity: .85; }\n";
    return css;
  }
  return block('body.m[data-zone="main"]', millieTheme("main")) + block('body.m[data-zone="space"]', millieTheme("space")) +
    "body.m .wrap { position: relative; z-index: 1; }\n";
}
(function () {
  if (typeof document === "undefined") return;
  if (document.body && !document.body.hasAttribute("data-zone")) document.body.setAttribute("data-zone", "main");
  var st = document.createElement("style"); st.id = "theme-css"; st.textContent = themeCSS(); document.head.appendChild(st);
  var cs = document.createElement("style"); cs.id = "critter-css"; cs.textContent = MILLIE_LOOK.theme === "jungle" ? critterCSS() : ""; document.head.appendChild(cs);
  if (MILLIE_LOOK.theme === "jungle" && document.body && !document.getElementById("critters")) {
    var cr = document.createElement("div"); cr.id = "critters"; cr.setAttribute("aria-hidden", "true");
    cr.innerHTML = CRITTERS.map(function (c, n) { return '<i class="c' + n + (c[2] ? ' ' + c[2] : '') + '"></i>'; }).join("");
    document.body.insertBefore(cr, document.body.firstChild);
  }
})();
if (typeof module !== "undefined") module.exports = { CRITTERS: CRITTERS, critterCSS: critterCSS, THEMES: THEMES, MILLIE_LOOK: MILLIE_LOOK, themeCSS: themeCSS, millieTheme: millieTheme, millieZone: millieZone };
