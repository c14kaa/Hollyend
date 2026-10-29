/* ===== Characters, shop and bank (pure functions, no DOM) ===== */
var BANK = { pointsPerPound: 150, stepPence: 50, weeklyCapPence: 1200 };

var LOOK_SKIN = [["Light", "#f2d3b8"], ["Warm", "#e2ad86"], ["Golden", "#c98d63"], ["Rich", "#9b6644"], ["Deep", "#6a4330"]];
var LOOK_HAIR = [["Dark brown", "#3a2418"], ["Black", "#15100e"], ["Chestnut", "#6b3b1f"], ["Copper", "#a8552a"], ["Blonde", "#d9b25f"]];

function lookItems(prefixName) {
  var out = [];
  LOOK_SKIN.forEach(function (s, i) { out.push({ id: "skin-" + i, cat: "skin", name: s[0] + " skin", cost: 0, v: { c: s[1] } }); });
  LOOK_HAIR.forEach(function (h, i) { out.push({ id: "hair-" + i, cat: "haircol", name: h[0] + " hair", cost: 0, v: { c: h[1] } }); });
  return out;
}

var SHOP = {
  millie: {
    title: "Space Shop",
    cats: [["suit", "Space suits"], ["visor", "Visors"], ["extra", "Gear"], ["buddy", "Space buddies"], ["scene", "Planets"], ["hairstyle", "Hairstyles"], ["haircol", "Hair colour"], ["skin", "Look"]],
    defaults: { suit: "suit-white", visor: "visor-blue", extra: "extra-none", buddy: "buddy-none", scene: "scene-moon", skin: "skin-1", haircol: "hair-0", hairstyle: "mhair-bob" },
    items: [
      { id: "suit-white", cat: "suit", name: "Classic white", cost: 0, v: { a: "#eef1ff", b: "#8b7bff" } },
      { id: "suit-pink", cat: "suit", name: "Bubblegum pink", cost: 150, v: { a: "#ff9cc9", b: "#c23a7a" } },
      { id: "suit-lav", cat: "suit", name: "Lavender dream", cost: 150, v: { a: "#c7b8ff", b: "#6d55d8" } },
      { id: "suit-teal", cat: "suit", name: "Ocean teal", cost: 150, v: { a: "#7fe0d4", b: "#1f8f86" } },
      { id: "suit-sunset", cat: "suit", name: "Sunset orange", cost: 200, v: { a: "#ffb071", b: "#d4572b" } },
      { id: "suit-galaxy", cat: "suit", name: "Galaxy", cost: 600, v: { a: "url(#GAL)", b: "#ff6fb5", galaxy: 1 } },
      { id: "suit-gold", cat: "suit", name: "Gold star", cost: 1000, v: { a: "url(#GOLD)", b: "#b07a00", gold: 1 } },
      { id: "visor-blue", cat: "visor", name: "Sky blue", cost: 0, v: { c: "#7cc4ff" } },
      { id: "visor-pink", cat: "visor", name: "Pink mirror", cost: 100, v: { c: "#ff6fb5" } },
      { id: "visor-green", cat: "visor", name: "Alien green", cost: 100, v: { c: "#5ef0a0" } },
      { id: "visor-rainbow", cat: "visor", name: "Rainbow", cost: 300, v: { c: "url(#RAIN)" } },
      { id: "visor-gold", cat: "visor", name: "Gold", cost: 400, v: { c: "#ffd36b" } },
      { id: "extra-none", cat: "extra", name: "No gear", cost: 0, v: {} },
      { id: "extra-antenna", cat: "extra", name: "Antenna", cost: 80, v: {} },
      { id: "extra-jetpack", cat: "extra", name: "Jetpack", cost: 350, v: {} },
      { id: "extra-cape", cat: "extra", name: "Star cape", cost: 250, v: {} },
      { id: "extra-crown", cat: "extra", name: "Crown of stars", cost: 500, v: {} },
      { id: "buddy-none", cat: "buddy", name: "No buddy", cost: 0, v: {} },
      { id: "buddy-alien", cat: "buddy", name: "Zib the alien", cost: 200, v: {} },
      { id: "buddy-robot", cat: "buddy", name: "Bolt the robot", cost: 250, v: {} },
      { id: "buddy-cat", cat: "buddy", name: "Comet the space cat", cost: 300, v: {} },
      { id: "buddy-rocket", cat: "buddy", name: "Mini rocket", cost: 400, v: {} },
      { id: "buddy-monkey", cat: "buddy", name: "Ooh Ooh the space monkey", cost: 300, v: {} },
      { id: "buddy-monkey2", cat: "buddy", name: "Uuh Uuh the space monkey", cost: 300, v: {} },
      { id: "mhair-bob", cat: "hairstyle", name: "Bob", cost: 0, v: {} },
      { id: "mhair-long", cat: "hairstyle", name: "Long and flowing", cost: 80, v: {} },
      { id: "mhair-ponytail", cat: "hairstyle", name: "Ponytail", cost: 100, v: {} },
      { id: "mhair-pigtails", cat: "hairstyle", name: "Pigtails", cost: 100, v: {} },
      { id: "mhair-plaits", cat: "hairstyle", name: "Plaits", cost: 150, v: {} },
      { id: "mhair-buns", cat: "hairstyle", name: "Space buns", cost: 150, v: {} },
      { id: "mhair-curls", cat: "hairstyle", name: "Big curls", cost: 150, v: {} },
      { id: "mhair-fringe", cat: "hairstyle", name: "Fringe with star clip", cost: 200, v: {} },
      { id: "scene-moon", cat: "scene", name: "Moon base", cost: 0, v: {} },
      { id: "scene-mars", cat: "scene", name: "Mars", cost: 150, v: {} },
      { id: "scene-saturn", cat: "scene", name: "Saturn's rings", cost: 250, v: {} },
      { id: "scene-nebula", cat: "scene", name: "Pink nebula", cost: 350, v: {} }
    ].concat(lookItems())
  },
  kristan: {
    title: "Club Shop",
    cats: [["kit", "Kits"], ["boots", "Boots"], ["hair", "Hairstyles"], ["extra", "Extras"], ["ball", "Balls"], ["pet", "Pets"], ["scene", "Stadiums"], ["skin", "Look"], ["haircol", "Hair colour"]],
    defaults: { kit: "kit-blue", boots: "boots-black", hair: "hair-short", extra: "extra-none", ball: "ball-classic", scene: "scene-training", skin: "skin-1", haircol: "hair-0", pet: "pet-none" },
    items: [
      { id: "kit-blue", cat: "kit", name: "Home blue", cost: 0, v: { n: "#ffffff", a: "#2f6fe0", b: "#ffffff", p: "plain", s: "#ffffff" } },
      { id: "kit-redwhite", cat: "kit", name: "Classic red, white sleeves", cost: 250, v: { n: "#ffffff", a: "#db0007", b: "#ffffff", p: "sleeves", s: "#ffffff", collar: "#ffffff", sock: "#ffffff", sockBand: "#db0007" } },
      { id: "kit-stripes", cat: "kit", name: "Red & white stripes", cost: 150, v: { n: "#111111", a: "#d8282f", b: "#ffffff", p: "stripes", s: "#111111" } },
      { id: "kit-hoops", cat: "kit", name: "Sky blue hoops", cost: 150, v: { n: "#173a6b", a: "#7cc8ff", b: "#ffffff", p: "hoops", s: "#ffffff" } },
      { id: "kit-claret", cat: "kit", name: "Claret & blue", cost: 150, v: { n: "#ffffff", a: "#7a1f3d", b: "#8fd0ff", p: "sleeves", s: "#ffffff" } },
      { id: "kit-halves", cat: "kit", name: "Black & gold halves", cost: 200, v: { n: "#ffffff", a: "#151515", b: "#f5c518", p: "halves", s: "#151515" } },
      { id: "kit-sash", cat: "kit", name: "Green sash", cost: 200, v: { n: "#13a05a", a: "#ffffff", b: "#13a05a", p: "sash", s: "#13a05a" } },
      { id: "kit-neon", cat: "kit", name: "Neon away kit", cost: 300, v: { n: "#1b1b1b", a: "#c6ff3d", b: "#1b1b1b", p: "plain", s: "#1b1b1b" } },
      { id: "kit-galaxy", cat: "kit", name: "Galaxy third kit", cost: 600, v: { n: "#ffffff", a: "url(#GAL)", b: "#ff6fb5", p: "plain", s: "#2a1450", galaxy: 1 } },
      { id: "kit-gold", cat: "kit", name: "Golden kit", cost: 1000, v: { n: "#ffffff", a: "url(#GOLD)", b: "#ffffff", p: "plain", s: "#b07a00", gold: 1 } },
      { id: "boots-black", cat: "boots", name: "Classic black", cost: 0, v: { c: "#1a1a1a" } },
      { id: "boots-white", cat: "boots", name: "White", cost: 100, v: { c: "#f4f4f4" } },
      { id: "boots-neon", cat: "boots", name: "Neon green", cost: 200, v: { c: "#b6ff2e" } },
      { id: "boots-blue", cat: "boots", name: "Electric blue", cost: 200, v: { c: "#2bb5ff" } },
      { id: "boots-pink", cat: "boots", name: "Hot pink", cost: 200, v: { c: "#ff4fa3" } },
      { id: "boots-gold", cat: "boots", name: "Golden boots", cost: 800, v: { c: "url(#GOLD)" } },
      { id: "hair-short", cat: "hair", name: "Short", cost: 0, v: {} },
      { id: "hair-buzz", cat: "hair", name: "Buzz cut", cost: 80, v: {} },
      { id: "hair-curly", cat: "hair", name: "Curly top", cost: 100, v: {} },
      { id: "hair-spiky", cat: "hair", name: "Spiky", cost: 100, v: {} },
      { id: "hair-hightop", cat: "hair", name: "High-top", cost: 150, v: {} },
      { id: "hair-bleach", cat: "hair", name: "Bleached tips", cost: 250, v: {} },
      { id: "extra-none", cat: "extra", name: "No extras", cost: 0, v: {} },
      { id: "extra-headband", cat: "extra", name: "Headband", cost: 80, v: {} },
      { id: "extra-wrist", cat: "extra", name: "Wristbands", cost: 100, v: {} },
      { id: "extra-gloves", cat: "extra", name: "Goalie gloves", cost: 200, v: {} },
      { id: "extra-armband", cat: "extra", name: "Captain's armband", cost: 300, v: {} },
      { id: "extra-medal", cat: "extra", name: "Winner's medal", cost: 500, v: {} },
      { id: "extra-trophy", cat: "extra", name: "Golden cup", cost: 1200, v: {} },
      { id: "pet-none", cat: "pet", name: "No pet", cost: 0, v: {} },
      { id: "pet-cat", cat: "pet", name: "Meow Meow the cat", cost: 300, v: {} },
      { id: "ball-classic", cat: "ball", name: "Classic", cost: 0, v: { c: "#ffffff", d: "#1b1b1b" } },
      { id: "ball-neon", cat: "ball", name: "Neon", cost: 150, v: { c: "#d4ff3a", d: "#1b1b1b" } },
      { id: "ball-retro", cat: "ball", name: "Retro leather", cost: 200, v: { c: "#a0612f", d: "#5a3216", retro: 1 } },
      { id: "ball-galaxy", cat: "ball", name: "Galaxy ball", cost: 400, v: { c: "url(#GAL)", d: "#ff6fb5" } },
      { id: "ball-gold", cat: "ball", name: "Golden ball", cost: 700, v: { c: "url(#GOLD)", d: "#8a5a00" } },
      { id: "scene-training", cat: "scene", name: "Training pitch", cost: 0, v: {} },
      { id: "scene-night", cat: "scene", name: "Floodlit night", cost: 200, v: {} },
      { id: "scene-street", cat: "scene", name: "Street cage", cost: 250, v: {} },
      { id: "scene-final", cat: "scene", name: "Cup final", cost: 500, v: {} }
    ].concat(lookItems())
  }
};

function shopItem(child, id) { var it = SHOP[child].items; for (var i = 0; i < it.length; i++) if (it[i].id === id) return it[i]; return null; }
function resolveOutfit(child, equipped) {
  var d = SHOP[child].defaults, out = {};
  Object.keys(d).forEach(function (k) { var id = (equipped && equipped[k]) || d[k], it = shopItem(child, id); out[k] = it || shopItem(child, d[k]); });
  return out;
}

/* ---------- SVG drawing ---------- */
var AV_UID = 0;
function defsCommon(u) {
  return '<defs>' +
    '<linearGradient id="GAL' + u + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a1a6e"/><stop offset=".5" stop-color="#6a2fb0"/><stop offset="1" stop-color="#d0408f"/></linearGradient>' +
    '<linearGradient id="GOLD' + u + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff1a8"/><stop offset=".45" stop-color="#f5c518"/><stop offset="1" stop-color="#b9850b"/></linearGradient>' +
    '<linearGradient id="RAIN' + u + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff6f91"/><stop offset=".25" stop-color="#ffd36b"/><stop offset=".5" stop-color="#5ef0a0"/><stop offset=".75" stop-color="#7cc4ff"/><stop offset="1" stop-color="#b48bff"/></linearGradient>' +
    '<clipPath id="CLIP' + u + '"><rect x="0" y="0" width="200" height="240" rx="24"/></clipPath>' +
    '</defs>';
}
function fx(c, u) { return String(c).replace(/url\(#(GAL|GOLD|RAIN)\)/, "url(#$1" + u + ")"); }
function star(cx, cy, r, fill) {
  var p = []; for (var i = 0; i < 10; i++) { var a = Math.PI / 5 * i - Math.PI / 2, rr = i % 2 ? r * 0.45 : r; p.push((cx + rr * Math.cos(a)).toFixed(1) + "," + (cy + rr * Math.sin(a)).toFixed(1)); }
  return '<polygon points="' + p.join(" ") + '" fill="' + fill + '"/>';
}
function dotsField(n, seed, x0, y0, w, h, fill, rmax) {
  var s = seed, out = ""; function r() { s = (s * 9301 + 49297) % 233280; return s / 233280; }
  for (var i = 0; i < n; i++) out += '<circle cx="' + (x0 + r() * w).toFixed(1) + '" cy="' + (y0 + r() * h).toFixed(1) + '" r="' + (0.6 + r() * rmax).toFixed(1) + '" fill="' + fill + '" opacity="' + (0.5 + r() * 0.5).toFixed(2) + '"/>';
  return out;
}

function sceneMillie(id) {
  if (id === "scene-mars") return '<rect width="200" height="240" fill="#2a0f2e"/>' + dotsField(30, 7, 0, 0, 200, 150, "#ffe", 1.1) +
    '<circle cx="40" cy="44" r="12" fill="#c7b8ff" opacity=".7"/><ellipse cx="100" cy="262" rx="170" ry="82" fill="#c1532f"/><ellipse cx="60" cy="214" rx="16" ry="5" fill="#9a3d22"/><ellipse cx="150" cy="226" rx="20" ry="6" fill="#9a3d22"/>';
  if (id === "scene-saturn") return '<rect width="200" height="240" fill="#0d1646"/>' + dotsField(36, 3, 0, 0, 200, 170, "#fff", 1.1) +
    '<g transform="rotate(-18 150 56)"><ellipse cx="150" cy="56" rx="54" ry="12" fill="none" stroke="#ffe2a8" stroke-width="5" opacity=".9"/><circle cx="150" cy="56" r="28" fill="#f0c27a"/><path d="M122 52 h56" stroke="#e0a85a" stroke-width="4"/><path d="M124 62 h52" stroke="#e0a85a" stroke-width="3"/><path d="M96 56 a54 12 0 0 0 108 0" fill="none" stroke="#ffe2a8" stroke-width="5"/></g>' +
    '<ellipse cx="100" cy="266" rx="170" ry="80" fill="#5d6390"/>';
  if (id === "scene-nebula") return '<rect width="200" height="240" fill="#1a0b3a"/><circle cx="40" cy="60" r="70" fill="#ff6fb5" opacity=".28"/><circle cx="170" cy="40" r="60" fill="#8b7bff" opacity=".35"/><circle cx="120" cy="130" r="80" fill="#5ef0d0" opacity=".12"/>' +
    dotsField(40, 11, 0, 0, 200, 190, "#fff", 1.2) + '<ellipse cx="100" cy="268" rx="170" ry="80" fill="#3a2a6b"/>';
  return '<rect width="200" height="240" fill="#10164a"/>' + dotsField(36, 5, 0, 0, 200, 170, "#fff", 1.1) +
    '<circle cx="164" cy="38" r="14" fill="#7cc4ff" opacity=".85"/><circle cx="160" cy="34" r="4" fill="#5ea7e8"/><ellipse cx="100" cy="266" rx="170" ry="80" fill="#9a9ec4"/><ellipse cx="48" cy="216" rx="14" ry="4" fill="#7c80a8"/><ellipse cx="150" cy="224" rx="18" ry="5" fill="#7c80a8"/>';
}

function hairMillie(style, c) {
  var top = '<path d="M70 74 Q68 42 100 42 Q132 42 130 74 Q124 58 108 56 Q100 64 86 60 Q76 62 70 74 Z" fill="' + c + '"/>';
  var sides = '<path d="M71 70 Q66 92 74 102 Q78 92 78 78 Z M129 70 Q134 92 126 102 Q122 92 122 78 Z" fill="' + c + '"/>';
  if (style === "mhair-long") return '<path d="M70 70 Q62 100 66 112 Q74 112 80 106 Q76 92 78 78 Z M130 70 Q138 100 134 112 Q126 112 120 106 Q124 92 122 78 Z" fill="' + c + '"/>' + top;
  if (style === "mhair-ponytail") return '<path d="M126 58 Q146 62 144 86 Q142 104 132 112 Q136 92 128 76 Z" fill="' + c + '"/><circle cx="128" cy="60" r="4" fill="#ff6fb5"/>' + top;
  if (style === "mhair-pigtails") return '<ellipse cx="66" cy="84" rx="9" ry="13" fill="' + c + '"/><ellipse cx="134" cy="84" rx="9" ry="13" fill="' + c + '"/><circle cx="71" cy="72" r="3.4" fill="#ff6fb5"/><circle cx="129" cy="72" r="3.4" fill="#ff6fb5"/>' + top;
  if (style === "mhair-plaits") { var s = ""; [0, 1, 2, 3].forEach(function (i) { s += '<ellipse cx="72" cy="' + (82 + i * 8) + '" rx="5" ry="5" fill="' + c + '"/><ellipse cx="128" cy="' + (82 + i * 8) + '" rx="5" ry="5" fill="' + c + '"/>'; });
    return s + '<circle cx="72" cy="113" r="3" fill="#8b7bff"/><circle cx="128" cy="113" r="3" fill="#8b7bff"/>' + top; }
  if (style === "mhair-buns") return '<circle cx="76" cy="46" r="11" fill="' + c + '"/><circle cx="124" cy="46" r="11" fill="' + c + '"/>' + sides + top;
  if (style === "mhair-curls") { var k = ""; [[72, 62], [74, 50], [82, 42], [92, 37], [104, 36], [116, 40], [125, 48], [128, 60], [70, 76], [130, 76], [72, 90], [128, 90]].forEach(function (p) { k += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="8.5" fill="' + c + '"/>'; }); return k; }
  if (style === "mhair-fringe") return sides + '<path d="M70 72 Q68 42 100 42 Q132 42 130 72 L126 64 L122 66 L118 62 L112 65 L106 61 L100 64 L94 61 L88 65 L82 62 L78 66 L74 64 Z" fill="' + c + '"/>' + star(118, 52, 6, "#ffd36b");
  return sides + top;
}
function avatarMillie(eq, u) {
  var suit = fx(eq.suit.v.a, u), trim = eq.suit.v.b, visor = fx(eq.visor.v.c, u), skin = eq.skin.v.c, hair = eq.haircol.v.c, x = eq.extra.id, b = eq.buddy.id;
  var h = '<g clip-path="url(#CLIP' + u + ')">' + sceneMillie(eq.scene.id);
  if (x === "extra-cape") h += '<path d="M66 116 L44 206 Q100 222 156 206 L134 116 Z" fill="#ff6fb5"/>' + star(70, 180, 6, "#ffe9a8") + star(128, 192, 5, "#ffe9a8") + star(100, 200, 4, "#ffe9a8");
  if (x === "extra-jetpack") h += '<rect x="56" y="108" width="24" height="56" rx="10" fill="#aab2d8"/><rect x="120" y="108" width="24" height="56" rx="10" fill="#aab2d8"/><path d="M60 164 Q68 196 76 164 Z" fill="#ffb347"/><path d="M124 164 Q132 196 140 164 Z" fill="#ffb347"/><path d="M63 164 Q68 184 73 164 Z" fill="#fff07a"/><path d="M127 164 Q132 184 137 164 Z" fill="#fff07a"/>';
  h += '<rect x="76" y="168" width="20" height="40" rx="9" fill="' + suit + '"/><rect x="104" y="168" width="20" height="40" rx="9" fill="' + suit + '"/>' +
    '<rect x="70" y="202" width="30" height="16" rx="8" fill="' + trim + '"/><rect x="100" y="202" width="30" height="16" rx="8" fill="' + trim + '"/>' +
    '<rect x="42" y="116" width="24" height="50" rx="12" fill="' + suit + '"/><rect x="134" y="116" width="24" height="50" rx="12" fill="' + suit + '"/>' +
    '<circle cx="54" cy="168" r="11" fill="' + trim + '"/><circle cx="146" cy="168" r="11" fill="' + trim + '"/>' +
    '<rect x="62" y="108" width="76" height="72" rx="26" fill="' + suit + '"/>';
  if (eq.suit.v.galaxy) h += dotsField(14, 9, 66, 112, 68, 64, "#fff", 1);
  h += '<rect x="64" y="162" width="72" height="8" fill="' + trim + '" opacity=".9"/>' +
    '<rect x="84" y="126" width="32" height="22" rx="6" fill="#262b66"/><circle cx="93" cy="137" r="3.5" fill="#ff6fb5"/><circle cx="100" cy="137" r="3.5" fill="#5ef0a0"/><circle cx="107" cy="137" r="3.5" fill="#ffd36b"/>' +
    '<circle cx="100" cy="70" r="46" fill="#f4f6ff" stroke="#c9cdef" stroke-width="3"/>' +
    '<circle cx="100" cy="74" r="30" fill="' + skin + '"/>' +
    hairMillie(eq.hairstyle ? eq.hairstyle.id : "mhair-bob", hair) +
    '<circle cx="90" cy="78" r="3.6" fill="#1b1530"/><circle cx="110" cy="78" r="3.6" fill="#1b1530"/><circle cx="91" cy="77" r="1.1" fill="#fff"/><circle cx="111" cy="77" r="1.1" fill="#fff"/>' +
    '<circle cx="84" cy="86" r="4" fill="#ff8fb0" opacity=".45"/><circle cx="116" cy="86" r="4" fill="#ff8fb0" opacity=".45"/>' +
    '<path d="M92 88 Q100 96 108 88" stroke="#7a2e3a" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
    '<ellipse cx="100" cy="72" rx="35" ry="33" fill="' + visor + '" opacity=".22"/>' +
    '<path d="M76 54 Q86 40 104 40" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".6"/>';
  if (x === "extra-antenna") h += '<path d="M100 24 L100 8" stroke="#c9cdef" stroke-width="3"/><circle cx="100" cy="7" r="6" fill="#ff6fb5"/>';
  if (x === "extra-crown") h += star(76, 26, 9, "#ffd36b") + star(100, 16, 11, "#ffd36b") + star(124, 26, 9, "#ffd36b");
  if (b === "buddy-alien") h += '<path d="M162 200 L156 180 M178 200 L184 180" stroke="#5bd16c" stroke-width="3"/><circle cx="156" cy="179" r="4" fill="#fff"/><circle cx="184" cy="179" r="4" fill="#fff"/><circle cx="156" cy="179" r="2" fill="#222"/><circle cx="184" cy="179" r="2" fill="#222"/><ellipse cx="170" cy="210" rx="19" ry="17" fill="#7be38a"/><circle cx="170" cy="206" r="5" fill="#fff"/><circle cx="170" cy="206" r="2.4" fill="#222"/><path d="M163 216 Q170 221 177 216" stroke="#2c7a3a" stroke-width="2" fill="none"/>';
  if (b === "buddy-robot") h += '<path d="M170 186 L170 178" stroke="#8a93bd" stroke-width="3"/><circle cx="170" cy="176" r="3.5" fill="#ff6fb5"/><rect x="154" y="186" width="32" height="26" rx="6" fill="#b8c2e8"/><rect x="159" y="193" width="22" height="8" rx="3" fill="#1e2552"/><circle cx="165" cy="197" r="2.4" fill="#5ef0f0"/><circle cx="175" cy="197" r="2.4" fill="#5ef0f0"/><rect x="157" y="212" width="26" height="14" rx="4" fill="#9aa3d0"/>';
  if (b === "buddy-cat") h += '<polygon points="157,192 160,178 168,188" fill="#f4a259"/><polygon points="183,192 180,178 172,188" fill="#f4a259"/><circle cx="170" cy="200" r="15" fill="#f4a259"/><circle cx="164" cy="198" r="2.4" fill="#222"/><circle cx="176" cy="198" r="2.4" fill="#222"/><path d="M167 205 Q170 208 173 205" stroke="#7a3a12" stroke-width="1.6" fill="none"/><circle cx="170" cy="198" r="19" fill="#bfe3ff" opacity=".28" stroke="#fff" stroke-width="1.5"/><ellipse cx="170" cy="222" rx="12" ry="7" fill="#f4a259"/>';
  if (b === "buddy-monkey" || b === "buddy-monkey2") { var mk = b === "buddy-monkey" ? ["#7a4a26", "#8b5a2b", "#e3b98a"] : ["#24130a", "#3a2112", "#9c6a40"]; h += '<path d="M184 216 Q198 206 192 192 Q188 184 182 190" stroke="' + mk[0] + '" stroke-width="4" fill="none" stroke-linecap="round"/>' +
    '<ellipse cx="170" cy="214" rx="14" ry="12" fill="' + mk[1] + '"/><ellipse cx="170" cy="216" rx="8" ry="7" fill="' + mk[2] + '"/>' +
    '<circle cx="155" cy="194" r="7" fill="' + mk[1] + '"/><circle cx="185" cy="194" r="7" fill="' + mk[1] + '"/><circle cx="155" cy="194" r="4" fill="' + mk[2] + '"/><circle cx="185" cy="194" r="4" fill="' + mk[2] + '"/>' +
    '<circle cx="170" cy="194" r="14" fill="' + mk[1] + '"/><path d="M160 196 Q160 186 166 188 Q170 184 174 188 Q180 186 180 196 Q180 206 170 206 Q160 206 160 196 Z" fill="' + mk[2] + '"/>' + (b === "buddy-monkey2" ? '<path d="M163 184 Q166 178 170 184 Q174 178 177 184" stroke="' + mk[0] + '" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M150 214 Q146 200 156 192 Q152 204 160 214 Z" fill="#ffd84a" stroke="#c9a400" stroke-width="1"/><path d="M155 192 l2 -3" stroke="#6b4a10" stroke-width="1.6"/>' : '') +
    '<circle cx="165" cy="193" r="2.2" fill="#1b1530"/><circle cx="175" cy="193" r="2.2" fill="#1b1530"/><circle cx="165.6" cy="192.4" r=".7" fill="#fff"/><circle cx="175.6" cy="192.4" r=".7" fill="#fff"/>' +
    '<ellipse cx="170" cy="199" rx="2.4" ry="1.4" fill="#5a3a1a"/><path d="M165 202 Q170 206 175 202" stroke="#5a3a1a" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
    '<circle cx="170" cy="196" r="21" fill="#bfe3ff" opacity=".22" stroke="#fff" stroke-width="1.5"/>'; }
  if (b === "buddy-rocket") h += '<g transform="rotate(20 172 200)"><path d="M172 172 Q184 188 182 214 L162 214 Q160 188 172 172 Z" fill="#f4f6ff"/><circle cx="172" cy="194" r="5" fill="#7cc4ff" stroke="#8b7bff" stroke-width="2"/><path d="M162 204 L154 218 L163 214 Z M182 204 L190 218 L181 214 Z" fill="#ff6fb5"/><path d="M165 214 Q172 234 179 214 Z" fill="#ffb347"/></g>';
  return h + '</g>';
}

function sceneKristan(id) {
  var pitch = function (y, a, b) { var s = ""; for (var i = 0; i < 6; i++) s += '<rect x="0" y="' + (y + i * 14) + '" width="200" height="14" fill="' + (i % 2 ? a : b) + '"/>'; return s; };
  if (id === "scene-night") return '<rect width="200" height="240" fill="#0b1230"/>' + dotsField(18, 4, 0, 0, 200, 90, "#fff", 0.8) +
    '<rect x="14" y="40" width="4" height="120" fill="#4a5378"/><rect x="182" y="40" width="4" height="120" fill="#4a5378"/><rect x="4" y="30" width="24" height="12" rx="2" fill="#fff8d0"/><rect x="172" y="30" width="24" height="12" rx="2" fill="#fff8d0"/>' +
    '<circle cx="16" cy="36" r="34" fill="#fff8d0" opacity=".14"/><circle cx="184" cy="36" r="34" fill="#fff8d0" opacity=".14"/><rect x="0" y="120" width="200" height="40" fill="#1d2550"/>' + dotsField(60, 8, 0, 122, 200, 34, "#c9cff5", 1) + pitch(158, "#1e6b3c", "#22773f");
  if (id === "scene-street") { var f = ""; for (var i = 0; i <= 200; i += 14) f += '<path d="M' + i + ' 20 L' + i + ' 170" stroke="#8a8f99" stroke-width="1.2" opacity=".55"/>'; for (var j = 20; j <= 170; j += 14) f += '<path d="M0 ' + j + ' L200 ' + j + '" stroke="#8a8f99" stroke-width="1.2" opacity=".35"/>';
    return '<rect width="200" height="240" fill="#2b2f3a"/><rect x="0" y="40" width="200" height="130" fill="#8a3b2c"/><path d="M20 70 q30 -26 60 0 t60 0" stroke="#ffd23f" stroke-width="10" fill="none" stroke-linecap="round" opacity=".85"/><path d="M110 120 q20 -30 50 -6" stroke="#5ec8ff" stroke-width="9" fill="none" stroke-linecap="round" opacity=".8"/>' + f + '<rect x="0" y="168" width="200" height="72" fill="#4b4f5a"/><path d="M0 200 H200" stroke="#f4f4f4" stroke-width="2" stroke-dasharray="10 8" opacity=".6"/>'; }
  if (id === "scene-final") { var c = ""; var cols = ["#ffd23f", "#ff4f6d", "#5ec8ff", "#5ee38f", "#ffffff"]; for (var k = 0; k < 26; k++) c += '<rect x="' + ((k * 37) % 196) + '" y="' + ((k * 23) % 120) + '" width="5" height="9" fill="' + cols[k % 5] + '" transform="rotate(' + (k * 29 % 80 - 40) + ' ' + ((k * 37) % 196) + ' ' + ((k * 23) % 120) + ')"/>';
    return '<rect width="200" height="240" fill="#13203f"/><rect x="0" y="60" width="200" height="100" fill="#22305a"/>' + dotsField(120, 2, 0, 62, 200, 96, "#ff4f6d", 1.3) + dotsField(80, 6, 0, 62, 200, 96, "#ffffff", 1.2) + c + pitch(158, "#1f7a43", "#239048"); }
  return '<rect width="200" height="240" fill="#8fd3ff"/><circle cx="168" cy="34" r="16" fill="#fff3b0"/><ellipse cx="50" cy="40" rx="26" ry="9" fill="#fff" opacity=".85"/><rect x="0" y="118" width="200" height="40" fill="#2f8a4e"/>' + pitch(150, "#2e9a52", "#36a95b") +
    '<polygon points="22,214 30,196 38,214" fill="#ff8a2a"/><polygon points="166,186 172,172 178,186" fill="#ff8a2a"/>';
}

function hairKristan(style, c) {
  if (style === "hair-buzz") return '<path d="M77 54 Q80 36 100 36 Q120 36 123 54 Q100 47 77 54 Z" fill="' + c + '" opacity=".85"/>';
  if (style === "hair-curly") { var s = ""; [[80, 44], [88, 36], [98, 33], [108, 34], [117, 39], [123, 47], [77, 52], [124, 55], [92, 41], [104, 40], [114, 45]].forEach(function (p) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="8" fill="' + c + '"/>'; }); return s; }
  if (style === "hair-spiky") return '<path d="M76 56 L78 40 L84 46 L88 28 L95 42 L100 24 L106 42 L113 28 L117 46 L122 38 L124 56 Q100 44 76 56 Z" fill="' + c + '"/>';
  if (style === "hair-hightop") return '<path d="M78 54 Q78 40 84 38 L84 16 Q100 10 116 16 L116 38 Q122 40 122 54 Q100 46 78 54 Z" fill="' + c + '"/>';
  if (style === "hair-bleach") return '<path d="M76 56 L78 40 L84 46 L88 30 L95 42 L100 26 L106 42 L113 30 L117 46 L122 40 L124 56 Q100 44 76 56 Z" fill="' + c + '"/><path d="M88 30 L91 36 L85 37 Z M100 26 L103 33 L97 33 Z M113 30 L115 37 L109 36 Z M78 40 L81 45 L76 46 Z M122 40 L124 46 L119 45 Z" fill="#f3e3a0"/>';
  return '<path d="M76 56 Q76 34 100 34 Q124 34 124 56 Q116 44 102 45 Q86 43 76 56 Z" fill="' + c + '"/>';
}

function avatarKristan(eq, u) {
  var k = eq.kit.v, a = fx(k.a, u), bcol = k.b, skin = eq.skin.v.c, hair = eq.haircol.v.c, boot = fx(eq.boots.v.c, u), ball = eq.ball.v, x = eq.extra.id, cid = "SH" + u;
  var shirt = "M70 92 Q100 84 130 92 L148 108 L138 124 L128 117 L128 152 L72 152 L72 117 L62 124 L52 108 Z";
  var h = '<g clip-path="url(#CLIP' + u + ')">' + (eq.bare ? '' : sceneKristan(eq.scene.id)) + '<clipPath id="' + cid + '"><path d="' + shirt + '"/></clipPath>';
  h += '<rect x="82" y="170" width="14" height="26" rx="6" fill="' + skin + '"/><rect x="104" y="170" width="14" height="26" rx="6" fill="' + skin + '"/>' +
    '<rect x="81" y="188" width="16" height="26" rx="5" fill="' + (k.sock || (k.gold ? "#ffd23f" : bcol === "#ffffff" ? a : bcol)) + '"/><rect x="103" y="188" width="16" height="26" rx="5" fill="' + (k.sock || (k.gold ? "#ffd23f" : bcol === "#ffffff" ? a : bcol)) + '"/>' +
    (k.sockBand ? '<rect x="81" y="190" width="16" height="4" fill="' + k.sockBand + '"/><rect x="103" y="190" width="16" height="4" fill="' + k.sockBand + '"/>' : '') +
    '<path d="M74 212 h24 q4 0 4 5 v3 h-30 q-2 -8 2 -8 z" fill="' + boot + '"/><path d="M102 212 h22 q8 0 8 6 v2 h-30 z" fill="' + boot + '"/>' +
    '<path d="M74 148 h52 l2 26 h-24 l-4 -8 l-4 8 h-24 z" fill="' + k.s + '"/>' +
    '<rect x="50" y="114" width="13" height="36" rx="6" fill="' + skin + '"/><rect x="137" y="114" width="13" height="36" rx="6" fill="' + skin + '"/>' +
    '<circle cx="56" cy="153" r="7" fill="' + skin + '"/><circle cx="144" cy="153" r="7" fill="' + skin + '"/>' +
    '<path d="' + shirt + '" fill="' + a + '"/><g clip-path="url(#' + cid + ')">';
  if (k.p === "stripes") for (var i = 74; i < 132; i += 14) h += '<rect x="' + i + '" y="80" width="7" height="80" fill="' + bcol + '"/>';
  if (k.p === "hoops") for (var j = 96; j < 156; j += 14) h += '<rect x="40" y="' + j + '" width="120" height="7" fill="' + bcol + '"/>';
  if (k.p === "halves") h += '<rect x="100" y="80" width="60" height="80" fill="' + bcol + '"/>';
  if (k.p === "sash") h += '<polygon points="70,86 86,86 132,152 116,152" fill="' + bcol + '"/>';
  if (k.p === "sleeves") h += '<polygon points="40,96 72,96 72,130 40,130" fill="' + bcol + '"/><polygon points="128,96 160,96 160,130 128,130" fill="' + bcol + '"/>';
  if (k.galaxy) h += dotsField(14, 12, 70, 88, 60, 62, "#fff", 1);
  h += '</g>' + (k.collar ? '<path d="M84 89 Q100 84 116 89 L112 94 Q100 90 88 94 Z" fill="' + k.collar + '"/>' : '') + '<path d="M92 88 L100 100 L108 88" stroke="' + bcol + '" stroke-width="4" fill="none"/>' +
    '<text x="100" y="134" text-anchor="middle" font-family="Teko, Arial Narrow, sans-serif" font-weight="700" font-size="24" fill="' + k.n + '" stroke="rgba(0,0,0,.35)" stroke-width="1" paint-order="stroke">10</text>' +
    '<rect x="94" y="76" width="12" height="12" fill="' + skin + '"/><circle cx="76" cy="62" r="5" fill="' + skin + '"/><circle cx="124" cy="62" r="5" fill="' + skin + '"/>' +
    '<circle cx="100" cy="60" r="24" fill="' + skin + '"/>' + hairKristan(eq.hair.id, hair) +
    '<path d="M86 54 h8 M106 54 h8" stroke="' + hair + '" stroke-width="2.4" stroke-linecap="round"/>' +
    '<circle cx="91" cy="61" r="3" fill="#1b1530"/><circle cx="109" cy="61" r="3" fill="#1b1530"/><circle cx="92" cy="60" r="1" fill="#fff"/><circle cx="110" cy="60" r="1" fill="#fff"/>' +
    '<path d="M91 70 Q100 77 109 70" stroke="#6b2a2a" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
  if (x === "extra-headband") h += '<rect x="76" y="44" width="48" height="6" rx="3" fill="#ffd23f"/>';
  if (x === "extra-wrist") h += '<rect x="49" y="142" width="15" height="6" rx="2" fill="#ffd23f"/><rect x="136" y="142" width="15" height="6" rx="2" fill="#ffd23f"/>';
  if (x === "extra-gloves") h += '<rect x="44" y="144" width="22" height="20" rx="8" fill="#5ee38f" stroke="#1b1b1b" stroke-width="1.5"/><rect x="134" y="144" width="22" height="20" rx="8" fill="#5ee38f" stroke="#1b1b1b" stroke-width="1.5"/>';
  if (x === "extra-armband") h += '<rect x="49" y="120" width="15" height="9" rx="2" fill="#ffd23f"/><text x="56.5" y="128" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="8" fill="#1b1b1b">C</text>';
  if (x === "extra-medal") h += '<path d="M90 88 L100 112 L110 88" stroke="#d8282f" stroke-width="5" fill="none"/><circle cx="100" cy="116" r="8" fill="url(#GOLD' + u + ')" stroke="#a67400" stroke-width="1.5"/>';
  if (x === "extra-trophy") h += '<g transform="translate(130 108)"><path d="M6 8 h24 v8 q0 16 -12 18 q-12 -2 -12 -18 z" fill="url(#GOLD' + u + ')"/><path d="M6 12 q-8 0 -6 8 q2 6 8 6 M30 12 q8 0 6 8 q-2 6 -8 6" stroke="#d9a10a" stroke-width="2.4" fill="none"/><rect x="14" y="34" width="8" height="8" fill="#d9a10a"/><rect x="9" y="42" width="18" height="5" rx="1" fill="#8a5a00"/></g>';
  if (eq.pet && eq.pet.id === "pet-cat") h += '<path d="M28 222 Q12 214 18 196 Q22 188 26 194" stroke="#2b2b33" stroke-width="5" fill="none" stroke-linecap="round"/>' +
    '<ellipse cx="40" cy="214" rx="15" ry="11" fill="#3a3a44"/><ellipse cx="44" cy="218" rx="7" ry="6" fill="#55555f"/>' +
    '<polygon points="31,191 33,177 41,187" fill="#3a3a44"/><polygon points="55,191 53,177 45,187" fill="#3a3a44"/><polygon points="33.5,188 34.5,181 39,186" fill="#e7a3b0"/><polygon points="52.5,188 51.5,181 47,186" fill="#e7a3b0"/>' +
    '<circle cx="43" cy="196" r="12" fill="#3a3a44"/><ellipse cx="38.5" cy="195" rx="2.6" ry="3.2" fill="#b6f25a"/><ellipse cx="47.5" cy="195" rx="2.6" ry="3.2" fill="#b6f25a"/><ellipse cx="38.5" cy="195" rx=".9" ry="2.6" fill="#111"/><ellipse cx="47.5" cy="195" rx=".9" ry="2.6" fill="#111"/>' +
    '<path d="M41.5 200 h3 l-1.5 1.8 z" fill="#e7a3b0"/><path d="M43 201.8 Q41 204 39 202.6 M43 201.8 Q45 204 47 202.6" stroke="#bbb" stroke-width=".9" fill="none"/>' +
    '<path d="M30 199 h7 M30 202 h7 M49 199 h7 M49 202 h7" stroke="#cfcfd6" stroke-width=".7"/><rect x="34" y="207" width="18" height="3" rx="1.5" fill="#d8282f"/><circle cx="43" cy="211" r="1.8" fill="#ffd23f"/>';
  var bc = fx(ball.c, u);
  h += '<circle cx="152" cy="212" r="12" fill="' + bc + '" stroke="' + ball.d + '" stroke-width="1.5"/>';
  h += ball.retro ? '<path d="M146 206 q6 6 12 0 M146 212 h12 M146 218 q6 -6 12 0" stroke="' + ball.d + '" stroke-width="1.6" fill="none"/>'
    : '<polygon points="152,206 157,209.5 155,215 149,215 147,209.5" fill="' + ball.d + '"/><path d="M152 206 V200.5 M157 209.5 L163 207 M155 215 L159 221 M149 215 L145 221 M147 209.5 L141 207" stroke="' + ball.d + '" stroke-width="1.3"/>';
  return h + '</g>';
}

function avatarSVG(child, equipped, cls, opts) {
  var u = "a" + (++AV_UID), eq = resolveOutfit(child, equipped);
  if (opts && opts.bare) eq.bare = true;
  return '<svg class="' + (cls || "av") + '" viewBox="0 0 200 240" role="img" aria-label="' + (child === "millie" ? "Millie's astronaut" : "Kristan's footballer") + '">' + defsCommon(u) +
    (child === "millie" ? avatarMillie(eq, u) : avatarKristan(eq, u)) + '</svg>';
}

/* ---------- wallet and bank ---------- */
function mondayKey(d) { d = new Date(d); var day = (d.getDay() + 6) % 7; d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - day); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
function wallet(child, attempts, purchases, bank, now) {
  var earned = 0, spent = 0, cashed = 0, weekPence = 0, paidPence = 0, wk = mondayKey(now || new Date());
  attempts.forEach(function (a) { if (a.child === child) earned += a.points || 0; });
  if (typeof homeworkPoints === "function") earned += homeworkPoints(child);
  purchases.forEach(function (p) { if (p.child === child) spent += p.cost || 0; });
  bank.forEach(function (b) {
    if (b.child !== child || b.status === "cancelled") return;
    cashed += b.points || 0;
    if (mondayKey(b.at) === wk) weekPence += b.pence || 0;
    if (b.status === "paid") paidPence += b.pence || 0;
  });
  var balance = earned - spent - cashed;
  var capLeft = Math.max(0, BANK.weeklyCapPence - weekPence);
  var affordable = Math.floor(balance / (BANK.pointsPerPound * BANK.stepPence / 100)) * BANK.stepPence;
  return { earned: earned, spent: spent, cashed: cashed, balance: balance, weekPence: weekPence, capLeft: capLeft, paidPence: paidPence,
    maxCashPence: Math.max(0, Math.min(capLeft, affordable)) };
}
function penceToPoints(p) { return Math.round(p * BANK.pointsPerPound / 100); }
function fmtMoney(p) { return "£" + (p / 100).toFixed(2); }
var AED_PER_GBP = 4.90; /* fixed rate for Millie's dirham equivalents */
function fmtAed(p) { return "AED " + (Math.round(p * AED_PER_GBP) / 100).toFixed(2); }
function owned(child, purchases) {
  var o = {}; SHOP[child].items.forEach(function (it) { if (!it.cost) o[it.id] = 1; });
  purchases.forEach(function (p) { if (p.child === child) o[p.item] = 1; });
  return o;
}

if (typeof module !== "undefined" && module.exports) module.exports = { SHOP: SHOP, BANK: BANK, avatarSVG: avatarSVG, resolveOutfit: resolveOutfit, wallet: wallet, owned: owned, penceToPoints: penceToPoints, fmtMoney: fmtMoney, mondayKey: mondayKey, shopItem: shopItem };
