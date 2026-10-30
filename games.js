/* Millie's Space Arcade: games with her monkey friends Ooh Ooh and Uuh Uuh.
   Data and pure helpers here; the screens live in src/page.html ("Space Arcade").
   Games never count towards streaks; the server gives a small points bonus (private.guard_game). */

var MONKEYS = {
  /* Both are the same Toys "R" Us chimp plush. Ooh Ooh came first: much loved, washed lots, faded and a bit fluffed-up.
     Uuh Uuh is the newer one: rich dark brown, plump, and always holding a banana. */
  ooh: { id: "ooh", name: "Ooh Ooh", fur: "#6e4a2e", furHi: "#8a6444", face: "#d6ab78", faceLo: "#c4976a", stitch: "#55361f", tag: "the first monkey: wise, cuddly and a bit fluffy from all the washes" },
  uuh: { id: "uuh", name: "Uuh Uuh", fur: "#4a2c16", furHi: "#5e3a1f", face: "#d9a464", faceLo: "#c98f4f", stitch: "#3a1f0c", tag: "the newer monkey: plump, silly and always hungry" }
};

function monkeySVG(id, mood, cls) {
  var m = MONKEYS[id] || MONKEYS.ooh, old = id === "ooh";
  /* stitched mouth, like the plush */
  var mouth = mood === "shock" ? '<ellipse cx="50" cy="69" rx="4.5" ry="5.5" fill="' + m.stitch + '"/>' :
    mood === "sad" ? '<path d="M40 72 Q50 65 60 72" stroke="' + m.stitch + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>' :
    mood === "silly" ? '<path d="M37 64 Q50 78 63 64" stroke="' + m.stitch + '" stroke-width="1.8" fill="#7a3a2a"/><path d="M46 70 Q50 76 55 70 Z" fill="#ff8fa3"/>' :
    '<path d="M35 64 Q50 76 65 64" stroke="' + m.stitch + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>';
  var eyes = mood === "wink" ? '<circle cx="41" cy="45" r="3.4" fill="#120804"/><path d="M55 45 Q59 42 63 45" stroke="#120804" stroke-width="2.4" fill="none" stroke-linecap="round"/>' :
    mood === "silly" ? '<circle cx="41" cy="45" r="3.6" fill="#120804"/><circle cx="59" cy="44" r="3.6" fill="#120804"/><circle cx="42.2" cy="43.6" r="1.1" fill="#fff"/><circle cx="60.2" cy="42.6" r="1.1" fill="#fff"/>' :
    '<circle cx="41" cy="45" r="3.4" fill="#120804"/><circle cx="59" cy="45" r="3.4" fill="#120804"/><circle cx="42.2" cy="43.8" r="1.1" fill="#fff"/><circle cx="60.2" cy="43.8" r="1.1" fill="#fff"/>';
  /* Ooh Ooh: faded, washed-lots fur, shown as soft worn patches and a few loose fluffs on the edge */
  var fluff = old ? '<ellipse cx="62" cy="24" rx="9" ry="5" fill="' + m.furHi + '" opacity=".5"/><ellipse cx="28" cy="58" rx="4" ry="7" fill="' + m.furHi + '" opacity=".45"/>' +
    [[-60], [-25], [15], [50]].map(function (a) { var r = 31, t = (a[0] - 90) * Math.PI / 180, x = 50 + r * Math.cos(t), y = 48 + r * Math.sin(t) * 1.06;
      return '<path d="M' + x.toFixed(1) + ' ' + y.toFixed(1) + ' l' + (Math.cos(t) * 3.5).toFixed(1) + ' ' + (Math.sin(t) * 3.5).toFixed(1) + '" stroke="' + m.fur + '" stroke-width="3" stroke-linecap="round"/>'; }).join("") : "";
  var banana = old ? "" : '<g transform="translate(70 70) rotate(-20)"><path d="M0 18 Q-6 0 6 -14 Q4 0 12 16 Z" fill="#ffd84a" stroke="#c9a400" stroke-width="1.3"/><path d="M5 -14 l1 -4" stroke="#6b4a10" stroke-width="2" stroke-linecap="round"/></g>' +
    '<ellipse cx="74" cy="88" rx="10" ry="7" fill="' + m.face + '" stroke="' + m.faceLo + '" stroke-width="1"/>';
  return '<svg class="' + (cls || "mk") + '" viewBox="0 0 100 100" role="img" aria-label="' + m.name + '">' +
    /* ears */
    '<circle cx="17" cy="44" r="12" fill="' + m.fur + '"/><circle cx="18" cy="45" r="7" fill="' + m.face + '"/>' +
    '<circle cx="83" cy="44" r="12" fill="' + m.fur + '"/><circle cx="82" cy="45" r="7" fill="' + m.face + '"/>' +
    /* head: Uuh Uuh is plumper */
    '<ellipse cx="50" cy="48" rx="' + (old ? 31 : 33) + '" ry="' + (old ? 33 : 34) + '" fill="' + m.fur + '"/>' +
    '<ellipse cx="44" cy="30" rx="14" ry="8" fill="' + m.furHi + '" opacity=".45"/>' +
    /* tan face: eye patch joined to a big muzzle */
    '<path d="M27 46 Q27 31 39 32 Q46 33 50 37 Q54 33 61 32 Q73 31 73 46 Q73 52 67 54 Q76 62 70 74 Q62 86 50 86 Q38 86 30 74 Q24 62 33 54 Q27 52 27 46 Z" fill="' + m.face + '"/>' +
    '<path d="M33 55 Q50 50 67 55" stroke="' + m.faceLo + '" stroke-width="1.4" fill="none" opacity=".8"/>' +
    /* stitched brows and nose */
    '<path d="M34 37 Q40 33 46 37 M54 37 Q60 33 66 37" stroke="' + m.stitch + '" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".7"/>' +
    eyes + '<path d="M47 57 Q50 60 53 57" stroke="' + m.stitch + '" stroke-width="1.6" fill="none" stroke-linecap="round"/>' + mouth +
    (mood !== "sad" && mood !== "shock" ? '<circle cx="33" cy="66" r="3.5" fill="#ff9aa8" opacity=".35"/><circle cx="67" cy="66" r="3.5" fill="#ff9aa8" opacity=".35"/>' : '') +
    fluff + banana + '</svg>';
}

/* ---------- jokes and chatter (always kind, always silly) ---------- */
var MONKEY_JOKES = [
  "How do you throw a party in space? You planet!",
  "Why did the Sun go to school? To get brighter!",
  "What's an astronaut's favourite key on the keyboard? The space bar!",
  "Why don't monkeys play cards in the jungle? Too many cheetahs!",
  "What did Saturn say to Jupiter? Give me a ring sometime!",
  "Why did the banana go to the doctor? It wasn't peeling well!",
  "How does the Moon cut its hair? Eclipse it!",
  "What do you call a monkey who wins every game? A chimp-ion!",
  "Why did the cow go to space? To see the moooon!",
  "What's a monkey's favourite biscuit? Chocolate chimp!",
  "Why is the Moon never hungry? Because it's always full… sometimes!",
  "What kind of key opens a banana? A mon-key!"
];
var CHAT = {
  uuh: {
    hello: ["Uuh uuh! Hi Millie! I brought snacks. I ate the snacks.", "Is it game time? I've been practising. Mostly practising eating bananas.", "Millie! I learned a new fact today. I forgot it. But it was a GOOD one.", "I'm extra squishy today. Probably all the bananas.", "Ooh Ooh says I'm 'plump'. I say I'm 'full of fluff and fun'."],
    win: ["Uuh uuh! I won?! I don't know how either!", "Yay! I'm doing my happy wobble. Wobble wobble.", "I won that one! Want half my banana to cheer up?"],
    lose: ["Nooo! Oh well. You're too clever, Millie!", "Uuh uuh… *falls off chair* …I'm OK!", "You beat me! I'm going to tell everyone how good you are."],
    draw: ["A draw! We're both winners! Can we both have a banana?", "Same same! Like twins! Banana twins!"],
    pick: ["I'll pick… *closes eyes and points* …that one!", "Gravity! Because it sounds like gravy.", "This one! It's the shiniest number."],
    right: ["Woah! Millie's brain is HUGE. Like Jupiter!", "Correct! I'm clapping with my feet!", "You got it! Banana high five!"],
    wrong: ["Uh oh! Even I get that one wrong. Lots.", "Never mind! Wrong answers help our brains grow. Like bananas!", "Oopsie! Let's look at the answer together."]
  },
  ooh: {
    hello: ["Ooh ooh! Welcome back, Space Cadet Millie!", "Greetings, Earthling! I mean… Millie! Ready to play?", "I've been through the washing machine so many times, I'm the cleanest monkey in space. And the wisest.", "I was Millie's very first monkey, you know. That makes me Chief Monkey. Uuh Uuh is Deputy Chief of Bananas."],
    win: ["Ooh ooh! Victory dance! *does the robot badly*", "I won! But you played brilliantly. Rematch?", "Hooray! I'm going to put that on my fridge!"],
    lose: ["Nooo! My lovely planets! You're a superstar, Millie!", "Ooh! Beaten fair and square! *bows dramatically*", "You win! I'll write a song about it. It goes 'ooh ooh ooh'."],
    draw: ["A draw! Great minds think alike!", "Exactly the same! Spooky!"],
    pick: ["Hmm, let me think with my big monkey brain…", "I choose… THIS one! *dramatic music*", "I've done the maths. Well, some of it."],
    right: ["Ooh ooh! Correct-a-mundo!", "Brilliant! Gold star! Well, a gold banana.", "Spot on! You're on fire! Not literally, that would be bad in a spaceship."],
    wrong: ["Close! Let's see why together.", "Not quite! Even astronauts practise a LOT.", "Oops! That's OK, mistakes are how we learn."]
  }
};
function chat(id, kind) { var c = CHAT[id] || CHAT.ooh; return pick(c[kind] || c.hello); }

/* ---------- Planet Trumps ---------- */
/* Approximate values (NASA fact sheets): diameter km, average surface temperature °C, average distance from the Sun (million km),
   length of a day (hours), surface gravity (Earth = 1). Moons share their planet's distance from the Sun. */
var TRUMP_STATS = [
  { id: "size", name: "Size", unit: "km across", fmt: function (v) { return nf(v) + " km"; } },
  { id: "temp", name: "Hottest", unit: "°C", fmt: function (v) { return (v < 0 ? "−" + nf(-v) : nf(v)) + " °C"; } },
  { id: "dist", name: "Distance from Sun", unit: "million km", fmt: function (v) { return nf(v) + " million km"; } },
  { id: "day", name: "Longest day", unit: "hours", fmt: function (v) { return nf(v) + " hours"; } },
  { id: "grav", name: "Gravity", unit: "× Earth", fmt: function (v) { return v + " × Earth"; } }
];
var PLANET_CARDS = [
  { id: "sun", name: "The Sun", kind: "Star", col: "#ffcf3a", size: 1392700, temp: 5500, dist: 0, day: 609.1, grav: 28, fact: "The Sun is so big that about 1.3 million Earths could fit inside it." },
  { id: "mercury", name: "Mercury", kind: "Planet", col: "#a9a3a0", size: 4879, temp: 167, dist: 58, day: 4222.6, grav: 0.38, fact: "One day on Mercury lasts longer than its whole year!" },
  { id: "venus", name: "Venus", kind: "Planet", col: "#e8c27a", size: 12104, temp: 464, dist: 108, day: 2802, grav: 0.9, fact: "Venus is the hottest planet, even hotter than Mercury, because its thick clouds trap heat." },
  { id: "earth", name: "Earth", kind: "Planet", col: "#3d8bfd", size: 12756, temp: 15, dist: 150, day: 24, grav: 1, fact: "Earth is the only planet we know of with life. Hello, monkeys!" },
  { id: "moon", name: "The Moon", kind: "Moon of Earth", col: "#cfcfd6", size: 3475, temp: -20, dist: 150, day: 708.7, grav: 0.17, fact: "On the Moon you could jump about six times higher than on Earth." },
  { id: "mars", name: "Mars", kind: "Planet", col: "#d8603a", size: 6792, temp: -65, dist: 228, day: 24.7, grav: 0.38, fact: "Mars has the tallest volcano in the Solar System: Olympus Mons." },
  { id: "ceres", name: "Ceres", kind: "Dwarf planet", col: "#8d8a86", size: 940, temp: -105, dist: 414, day: 9.1, grav: 0.03, fact: "Ceres is the biggest object in the asteroid belt." },
  { id: "jupiter", name: "Jupiter", kind: "Planet", col: "#d9a66b", size: 142984, temp: -110, dist: 778, day: 9.9, grav: 2.5, fact: "Jupiter's Great Red Spot is a storm bigger than Earth." },
  { id: "io", name: "Io", kind: "Moon of Jupiter", col: "#e6d35a", size: 3643, temp: -143, dist: 778, day: 42.5, grav: 0.18, fact: "Io has hundreds of active volcanoes." },
  { id: "europa", name: "Europa", kind: "Moon of Jupiter", col: "#d8cbb0", size: 3122, temp: -160, dist: 778, day: 85.2, grav: 0.13, fact: "Europa has a huge ocean hidden under its icy crust." },
  { id: "ganymede", name: "Ganymede", kind: "Moon of Jupiter", col: "#a99c8a", size: 5268, temp: -163, dist: 778, day: 171.7, grav: 0.15, fact: "Ganymede is the biggest moon in the Solar System, bigger than Mercury!" },
  { id: "saturn", name: "Saturn", kind: "Planet", col: "#e9cf8f", size: 120536, temp: -140, dist: 1427, day: 10.7, grav: 1.1, fact: "Saturn is so light for its size that it would float in a giant bath." },
  { id: "titan", name: "Titan", kind: "Moon of Saturn", col: "#d79b45", size: 5150, temp: -179, dist: 1427, day: 382.7, grav: 0.14, fact: "Titan has lakes, but they're full of liquid methane, not water." },
  { id: "uranus", name: "Uranus", kind: "Planet", col: "#8fe0e8", size: 51118, temp: -195, dist: 2871, day: 17.2, grav: 0.9, fact: "Uranus spins on its side, like a rolling ball." },
  { id: "neptune", name: "Neptune", kind: "Planet", col: "#3f6fe0", size: 49528, temp: -200, dist: 4495, day: 16.1, grav: 1.1, fact: "Neptune has the fastest winds in the Solar System." },
  { id: "pluto", name: "Pluto", kind: "Dwarf planet", col: "#c9b49a", size: 2376, temp: -225, dist: 5906, day: 153.3, grav: 0.06, fact: "Pluto has a giant heart-shaped glacier." }
];
function trumpCard(id) { for (var i = 0; i < PLANET_CARDS.length; i++) if (PLANET_CARDS[i].id === id) return PLANET_CARDS[i]; return null; }
function trumpStat(id) { for (var i = 0; i < TRUMP_STATS.length; i++) if (TRUMP_STATS[i].id === id) return TRUMP_STATS[i]; return null; }
/* How good a card is at a stat: its rank among all cards, 0 (worst) to 1 (best). */
function trumpStrength(card, stat) { var v = card[stat], below = 0; PLANET_CARDS.forEach(function (c) { if (c[stat] < v) below++; }); return below / (PLANET_CARDS.length - 1); }
/* The monkey picks a stat: Ooh Ooh usually picks his best one; Uuh Uuh is silly half the time. */
function monkeyChoose(card, who) {
  var silly = who === "uuh" ? 0.5 : 0.2;
  if (Math.random() < silly) return pick(TRUMP_STATS).id;
  var best = TRUMP_STATS[0].id, bs = -1;
  TRUMP_STATS.forEach(function (s) { var v = trumpStrength(card, s.id); if (v > bs) { bs = v; best = s.id; } });
  return best;
}
function trumpCompareText(a, b, stat) {
  var s = trumpStat(stat), va = a[stat], vb = b[stat];
  if (va === vb) return a.name + " and " + b.name + " are the same: " + s.fmt(va) + ".";
  var hi = va > vb ? a : b, lo = va > vb ? b : a;
  var why = stat === "temp" && hi[stat] < 0 ? " (" + s.fmt(hi[stat]) + " is warmer than " + s.fmt(lo[stat]) + ": it's closer to zero)" : "";
  return hi.name + " wins: " + s.fmt(hi[stat]) + " beats " + s.fmt(lo[stat]) + why + ".";
}
function newTrumps(who) {
  var d = shuffle(PLANET_CARDS.map(function (c) { return c.id; }));
  return { id: "trumps", who: who, me: d.slice(0, 8), them: d.slice(8, 16), pot: [], round: 1, maxRounds: 10, phase: "ask", q: null, chosen: null, stat: null, result: null, line: chat(who, "hello"), wins: 0 };
}

/* ---------- Monkey Memory (pairs) ---------- */
var MEMORY_SETS = [
  { id: "squares", title: "Square numbers", make: function () { return shuffle([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).slice(0, 6).map(function (n) { return [n + "²", String(n * n)]; }); } },
  { id: "fdp", title: "Fractions, decimals & %", make: function () { return shuffle([["1/2", "0.5"], ["1/4", "25%"], ["3/4", "0.75"], ["1/10", "10%"], ["2/5", "0.4"], ["7/10", "70%"], ["1/5", "0.2"], ["3/10", "30%"], ["9/10", "0.9"], ["3/5", "60%"]]).slice(0, 6); } },
  { id: "x10", title: "× and ÷ by 10, 100, 1000", make: function () {
    var out = [], seen = {};
    while (out.length < 6) { var p = pick([10, 100, 1000]), a = pick([rnd(2, 99) / 10, rnd(11, 99), rnd(2, 9) / 10]), div = Math.random() < 0.4;
      var r = Math.round((div ? a / p : a * p) * 10000) / 10000, k = String(r); if (seen[k]) continue; seen[k] = 1; out.push([a + (div ? " ÷ " : " × ") + nf(p), nf(r)]); }
    return out; } },
  { id: "space", title: "Space facts", make: function () { return shuffle([["Biggest planet", "Jupiter"], ["Hottest planet", "Venus"], ["The red planet", "Mars"], ["Biggest rings", "Saturn"], ["Our star", "The Sun"], ["Closest to the Sun", "Mercury"], ["Furthest planet", "Neptune"], ["Earth spins once in", "24 hours"], ["Earth orbits the Sun in", "365 days"], ["Spins on its side", "Uranus"]]).slice(0, 6); } },
  { id: "time", title: "Converting time", make: function () { return shuffle([["2 hours", "120 min"], ["3 days", "72 hours"], ["¼ hour", "15 min"], ["180 seconds", "3 min"], ["2 years", "24 months"], ["3 weeks", "21 days"], ["1½ hours", "90 min"], ["½ a day", "12 hours"]]).slice(0, 6); } },
  { id: "tables", title: "Times tables", make: function () { var out = [], seen = {}; while (out.length < 6) { var a = rnd(3, 12), b = rnd(3, 12); if (seen[a * b]) continue; seen[a * b] = 1; out.push([a + " × " + b, String(a * b)]); } return out; } }
];
function newMemory(who, setId) {
  var set = MEMORY_SETS.filter(function (s) { return s.id === setId; })[0] || pick(MEMORY_SETS), pairs = set.make(), cards = [];
  pairs.forEach(function (p, i) { cards.push({ k: i, t: p[0], side: 0 }); cards.push({ k: i, t: p[1], side: 1 }); });
  return { id: "memory", who: who, set: set.id, title: set.title, cards: shuffle(cards).map(function (c, i) { return Object.assign(c, { i: i, up: false, owner: null }); }), turn: "me", open: [], mine: 0, theirs: 0, seen: {}, line: chat(who, "hello"), done: false };
}
/* The monkey's turn: remembers some cards it has seen (Ooh Ooh better than Uuh Uuh). Returns [i, j]. */
function monkeyMemoryMove(g) {
  var recall = g.who === "ooh" ? 0.65 : 0.35, left = g.cards.filter(function (c) { return c.owner == null; });
  var known = left.filter(function (c) { return g.seen[c.i] && Math.random() < recall; });
  for (var a = 0; a < known.length; a++) for (var b = a + 1; b < known.length; b++) if (known[a].k === known[b].k) return [known[a].i, known[b].i];
  var unseen = left.filter(function (c) { return !g.seen[c.i]; }), first = pick(unseen.length ? unseen : left);
  var match = known.filter(function (c) { return c.k === first.k && c.i !== first.i; })[0];
  var rest = left.filter(function (c) { return c.i !== first.i; });
  return [first.i, (match || pick(rest)).i];
}

/* ---------- Moon Base ---------- */
var MOONBASE = [
  { id: "flag", name: "Millie's flag", cost: 2, line: "Uuh Uuh salutes the flag. Then salutes a rock. Just in case." },
  { id: "pad", name: "Landing pad", cost: 3, line: "Ooh Ooh lands the rocket… on the third try." },
  { id: "dome", name: "Home dome", cost: 5, line: "A home with air inside! The monkeys move in with 47 bananas." },
  { id: "solar", name: "Solar panels", cost: 5, line: "Free power from the Sun! Uuh Uuh tries to charge a banana." },
  { id: "greenhouse", name: "Greenhouse", cost: 6, line: "Plants make oxygen for breathing. Ooh Ooh names every leaf." },
  { id: "drill", name: "Ice drill", cost: 7, line: "There's frozen water at the Moon's poles. Slushies for everyone!" },
  { id: "slide", name: "Moon slide", cost: 8, line: "In low gravity, the slide is VERY slow. Wheeeeeeeeeeee…" },
  { id: "telescope", name: "Telescope tower", cost: 8, line: "Ooh Ooh spots Earth. 'Hi Mum!' he waves." },
  { id: "rover", name: "Moon buggy", cost: 9, line: "Beep beep! Uuh Uuh is driving. Everybody hold on." },
  { id: "bananas", name: "Banana farm", cost: 10, line: "The first Moon bananas! Uuh Uuh has eaten three. They weren't ripe." },
  { id: "bouncy", name: "Bouncy castle", cost: 10, line: "With Moon gravity the monkeys bounce SO high. 'See you tomorrow!'" },
  { id: "rocket", name: "Rocket tower", cost: 12, line: "Ready for launch! Next stop… wherever Millie says!" }
];
function moonItem(id) { for (var i = 0; i < MOONBASE.length; i++) if (MOONBASE[i].id === id) return MOONBASE[i]; return null; }
function moonState(plays, child) {
  var rocks = 0, built = {};
  plays.forEach(function (p) { if (p.child !== child || p.game !== "moonbase") return; if (p.kind === "build") built[p.item] = true; else rocks += (p.score || 0) + ((p.total && p.score === p.total) ? 2 : 0); });
  var spent = 0; Object.keys(built).forEach(function (k) { var it = moonItem(k); if (it) spent += it.cost; });
  return { rocks: rocks - spent, built: built, count: Object.keys(built).length };
}
function moonSVG(built, mood) {
  var b = function (k) { return !!built[k]; };
  var h = '<svg class="moonbase" viewBox="0 0 360 220" role="img" aria-label="Millie\'s moon base">' +
    '<defs><radialGradient id="mbSky" cx="50%" cy="0%" r="100%"><stop offset="0" stop-color="#1d2470"/><stop offset="1" stop-color="#070a2a"/></radialGradient></defs>' +
    '<rect width="360" height="220" fill="url(#mbSky)"/>';
  for (var s = 0; s < 40; s++) h += '<circle cx="' + ((s * 97) % 360) + '" cy="' + ((s * 53) % 120) + '" r="' + (s % 5 ? 0.8 : 1.4) + '" fill="#fff" opacity=".7"/>';
  h += '<circle cx="300" cy="38" r="20" fill="#3d8bfd"/><path d="M288 30 q8 -6 14 2 q6 8 -4 12 q-8 2 -10 -6z M304 44 q6 -2 8 4 q-4 4 -8 0z" fill="#3fbf6a"/>' +
    '<path d="M0 150 Q60 132 120 146 T240 142 T360 150 V220 H0 Z" fill="#b9bcc8"/><ellipse cx="70" cy="190" rx="22" ry="5" fill="#9a9dab"/><ellipse cx="250" cy="200" rx="30" ry="6" fill="#9a9dab"/><ellipse cx="180" cy="172" rx="12" ry="3" fill="#9a9dab"/>';
  if (b("pad")) h += '<ellipse cx="300" cy="182" rx="40" ry="9" fill="#5b5f72"/><text x="300" y="186" text-anchor="middle" font-size="10" font-weight="800" fill="#ffd36b">H</text>';
  if (b("rocket")) h += '<rect x="292" y="108" width="4" height="70" fill="#8a8fa8"/><path d="M308 112 C318 124 318 150 316 172 H300 C298 150 298 124 308 112 Z" fill="#f3f1ff" stroke="#ff6fb5" stroke-width="2"/><circle cx="308" cy="138" r="4" fill="#6fd3ff"/><path d="M300 160 l-8 14 h8 z M316 160 l8 14 h-8 z" fill="#ff6fb5"/>';
  if (b("dome")) h += '<path d="M120 160 A40 36 0 0 1 200 160 Z" fill="#9fd8ff" opacity=".55" stroke="#e8f6ff" stroke-width="2"/><rect x="152" y="146" width="16" height="14" rx="3" fill="#ffd36b"/>';
  if (b("greenhouse")) h += '<rect x="208" y="140" width="34" height="22" rx="3" fill="#7fe0a0" opacity=".6" stroke="#e8fff0" stroke-width="1.5"/><path d="M214 160 v-8 m6 8 v-12 m6 12 v-7 m6 7 v-10" stroke="#2f9a55" stroke-width="2.5" stroke-linecap="round"/>';
  if (b("solar")) h += '<g><rect x="20" y="128" width="30" height="14" fill="#2a4fb5" stroke="#9fb6ff" stroke-width="1" transform="skewX(-15)"/><rect x="34" y="142" width="2" height="16" fill="#8a8fa8"/></g>';
  if (b("flag")) h += '<rect x="96" y="112" width="2" height="38" fill="#ddd"/><path d="M98 112 h22 l-5 7 l5 7 h-22 z" fill="#ff6fb5"/><text x="107" y="122" font-size="7" fill="#fff" font-weight="800">M</text>';
  if (b("drill")) h += '<path d="M60 160 l10 -34 l10 34 z" fill="#c0c4d4" stroke="#7a7f95" stroke-width="1.5"/><rect x="66" y="150" width="8" height="10" fill="#6fd3ff"/>';
  if (b("slide")) h += '<path d="M232 110 Q236 140 268 158" stroke="#ff9f43" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="226" y="106" width="3" height="54" fill="#8a8fa8"/><rect x="236" y="106" width="3" height="40" fill="#8a8fa8"/>';
  if (b("telescope")) h += '<rect x="20" y="166" width="16" height="22" fill="#8a8fa8"/><rect x="14" y="154" width="30" height="8" rx="3" fill="#dfe2ee" transform="rotate(-25 29 158)"/>';
  if (b("rover")) h += '<rect x="130" y="186" width="34" height="10" rx="3" fill="#ffd36b"/><circle cx="136" cy="198" r="5" fill="#333"/><circle cx="158" cy="198" r="5" fill="#333"/><rect x="146" y="178" width="2" height="8" fill="#888"/><circle cx="147" cy="177" r="3" fill="#ff6fb5"/>';
  if (b("bananas")) h += '<g>' + [0, 1, 2].map(function (i) { return '<rect x="' + (184 + i * 14) + '" y="182" width="2" height="14" fill="#5a8a3a"/><path d="M' + (180 + i * 14) + ' 184 q6 -10 12 0" fill="#3fbf6a"/><path d="M' + (182 + i * 14) + ' 188 q4 6 8 0" stroke="#ffd84a" stroke-width="3" fill="none" stroke-linecap="round"/>'; }).join("") + '</g>';
  if (b("bouncy")) h += '<path d="M76 200 v-22 l8 -6 l8 6 l8 -6 l8 6 l8 -6 l8 6 v22 z" fill="#ff7ac0" stroke="#fff" stroke-width="1.5"/><rect x="88" y="186" width="24" height="14" rx="6" fill="#ffd36b"/>';
  var hop = mood === "party" ? -18 : 0;
  if (b("dome")) h += '<g transform="translate(132 ' + (124 + hop) + ') scale(.42)">' + monkeySVG("ooh", mood === "party" ? "silly" : "happy").replace(/<svg[^>]*>|<\/svg>/g, "") + '</g>' +
    '<g transform="translate(166 ' + (128 + (mood === "party" ? -10 : 0)) + ') scale(.4)">' + monkeySVG("uuh", "silly").replace(/<svg[^>]*>|<\/svg>/g, "") + '</g>';
  return h + '</svg>';
}

/* ---------- Banana Quiz Show ---------- */
var QS_LADDER = [1, 2, 5, 10, 20, 50, 100, 250, 500, 1000];
var QS_SAFE = 4; /* reaching question 5 keeps 20 bananas */

/* ---------- Points the server gives for games (mirrors private.guard_game, for showing an estimate) ---------- */
var GAME_ROWS = [];
function setGames(rows) { GAME_ROWS = rows || []; }
function gamePointsFor(child) { return GAME_ROWS.reduce(function (s, r) { return s + (r.child === child ? (r.points || 0) : 0); }, 0); }
function gamePointsEstimate(game, score, total, won, child, today) {
  var p = game === "trumps" ? (won ? 6 : 2) : game === "moonbase" ? Math.min(score, 6) : game === "bananas" ? Math.floor(Math.min(score, 12) / 2) : game === "memory" ? (won ? 5 : 2) : Math.floor(Math.min(score, 10) / 2) + (won ? 2 : 0);
  var mine = GAME_ROWS.filter(function (r) { return r.child === child && String(r.playDay || "").slice(0, 10) === today; });
  if (mine.filter(function (r) { return r.game === game && r.kind !== "build"; }).length >= 2) p = 0;
  var got = mine.reduce(function (s, r) { return s + (r.points || 0); }, 0);
  return Math.max(0, Math.min(p, 20 - got));
}
function gamePointsToday(child, today) { return GAME_ROWS.filter(function (r) { return r.child === child && String(r.playDay || "").slice(0, 10) === today; }).reduce(function (s, r) { return s + (r.points || 0); }, 0); }

if (typeof module !== "undefined") module.exports = { MONKEYS: MONKEYS, PLANET_CARDS: PLANET_CARDS, TRUMP_STATS: TRUMP_STATS, newTrumps: newTrumps, monkeyChoose: monkeyChoose, trumpCompareText: trumpCompareText, newMemory: newMemory, monkeyMemoryMove: monkeyMemoryMove, MEMORY_SETS: MEMORY_SETS, MOONBASE: MOONBASE, moonState: moonState, moonSVG: moonSVG, monkeySVG: monkeySVG, gamePointsEstimate: gamePointsEstimate };
