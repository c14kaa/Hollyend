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
})();
if (typeof module !== "undefined") module.exports = { THEMES: THEMES, MILLIE_LOOK: MILLIE_LOOK, themeCSS: themeCSS, millieTheme: millieTheme, millieZone: millieZone };
