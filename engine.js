/* ===== Week config: refreshed each week from the latest homework ===== */
var WEEK = {
  label: "Week of 24 Oct 2026",
  start: "2026-10-24", // day 0 of the learning week
  millie: {
    focus: ["Factors & factor pairs", "Multiples & lowest common multiple", "Prime numbers",
            "Homophones", "Roman numerals", "Decimals", "Our Solar System"],
    topics: ["factorOf","countFactors","factorPair","commonFactor","multipleOf","lcm","prime",
             "homophone","roman","decimals","space","tables"]
  },
  kristan: {
    focus: ["Averages (homework)", "Y8 poetry & PEACEAL (assessment)", "Algebra & sequences", "Equations",
            "Ratio", "Rounding & estimation", "Angles", "Probability", "Indices & negatives", "Science"],
    topics: ["meanList","medianList","modeRange","freqMode","freqMean","freqMedian","missingMean","bestAverage",
             "poetry","poetry","poetry","simplify","nthTerm","commutative","solveEq","solveEq",
             "ratioSimplify","ratioShare","round1sf","estimate","angles","probability","indices","negatives",
             "science","science"]
  }
};

/* ===== Helpers ===== */
function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) { var a = arr.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function factors(n) { var f = []; for (var i = 1; i <= n; i++) if (n % i === 0) f.push(i); return f; }
function isPrime(n) { return n > 1 && factors(n).length === 2; }
function gcd(a, b) { return b ? gcd(b, a % b) : a; }
function lcm(a, b) { return a * b / gcd(a, b); }
function round2(x) { return Math.round(x * 100) / 100; }
function fmt(x) { return String(round2(x)); }

/* Build a question with 4 unique options. distract = array of candidate wrong answers. */
function q(topic, prompt, correct, distract, explain, html, extra) {
  var c = String(correct), opts = [c], pool = shuffle(distract.map(String));
  for (var i = 0; i < pool.length && opts.length < 4; i++) if (opts.indexOf(pool[i]) < 0) opts.push(pool[i]);
  var guard = 0;
  while (opts.length < 4 && guard++ < 50 && !isNaN(Number(c))) {
    var cand = String(Number(c) + pick([-3, -2, -1, 1, 2, 3, 4]));
    if (opts.indexOf(cand) < 0 && Number(cand) >= 0) opts.push(cand);
  }
  extra = extra || {};
  var notes = {};
  Object.keys(extra.notes || {}).forEach(function (k) { notes[String(k)] = extra.notes[k]; });
  return { topic: topic, prompt: prompt, html: html || "", answer: c, options: shuffle(opts), explain: explain,
           steps: extra.steps || null, tip: extra.tip || TIPS[topic] || null, notes: notes };
}
/* Why a wrong answer is wrong: specific note if we have one, otherwise a gentle generic line */
function whyWrong(item, chosen) {
  if (item.notes[chosen]) return item.notes[chosen];
  return null;
}
var TIPS = {
  "Factors": "Factors are few, multiples are many. Factors fit INTO a number; they're never bigger than it.",
  "Factor pairs": "Work up from 1 (1, 2, 3…) and stop when the pairs start repeating, so you never miss one.",
  "Common factors": "List the factors of both numbers, then circle the ones in both lists.",
  "Multiples": "Multiples are the answers in a times table. They're never smaller than the number.",
  "Lowest common multiple": "Write out both times tables side by side until the same number shows up in both.",
  "Prime numbers": "A prime has exactly two factors: 1 and itself. 1 is not prime, and 2 is the only even prime.",
  "Homophones": "Use a memory hook: you hEAR with your EAR (heard); FARther is about distance (far).",
  "Roman numerals": "I=1, V=5, X=10, L=50, C=100. Small before big means take away: IV=4, IX=9, XL=40, XC=90.",
  "Decimals": "Ones . tenths hundredths. Compare from the left, one column at a time.",
  "Rounding decimals": "Only look at the tenths digit: 5 or more rounds up, 4 or less stays.",
  "Our Solar System": "My Very Easy Method Just Speeds Up Naming: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.",
  "Times tables": "If you're stuck, use a fact you know: 7 × 8 is 7 × 4 doubled.",
  "Mean": "Mean = total ÷ how many values. Check it sits between the smallest and biggest value.",
  "Median": "ORDER first, then find the middle. Two middles? Halfway between them.",
  "Mode": "Mode = Most common. Look for the value that appears most often.",
  "Range": "Range = biggest − smallest. It measures spread, not an average.",
  "Mode from a table": "The mode is a VALUE from the top row, never a frequency from the bottom row.",
  "Range from a table": "Use the top row (the values), not the frequencies.",
  "Mean from a table": "Value × frequency, add them up, then divide by the TOTAL frequency.",
  "Median from a table": "Find the middle position from the total frequency, then use running totals to find which value it lands on.",
  "Mean: missing value": "Total = mean × how many. Then subtract the numbers you know.",
  "Choosing an average": "Extreme values? Median. Most popular? Mode. No outliers? Mean.",
  "Poetry": "In the exam: point, short quote, zoom in on a word, effect on the reader, compare, link back.",
  "Simplifying": "Numbers multiply together; letters sit side by side; the same letter twice becomes a square.",
  "Sequences": "The jump between terms gives the number in front of n. Then adjust to match the first term.",
  "Commutative law": "+ and × don't care about order. − and ÷ do.",
  "Ratio": "Simplify by dividing both sides by the same number. To share: add the parts, find one part, then multiply.",
  "Solving equations": "Undo the operations in reverse order, doing the same to both sides. Always check by substituting back.",
  "Rounding & estimation": "1 significant figure = keep the first non-zero digit, round it, and fill the rest with zeros.",
  "Angles in parallel lines": "Z (alternate), F (corresponding) and X (vertically opposite) are equal. C (co-interior) adds to 180°.",
  "Probability": "Probability = what you want ÷ total possible. P(not A) = 1 − P(A).",
  "Indices": "Multiplying: add the powers. Dividing: subtract them. The base doesn't change.",
  "Negative numbers": "Same signs multiply or divide to give positive; different signs give negative.",
  "Science": "Read every option before choosing: science questions often have two that sound right."
};

/* ===== Millie (Year 5) ===== */
var M = {};
M.factorOf = function (L) {
  var n = pick(L === 1 ? [12, 16, 18, 20] : L === 2 ? [24, 28, 30, 32, 36] : [36, 40, 42, 45, 48]);
  var fs = factors(n).filter(function (x) { return x > 1 && x < n; });
  var f = pick(fs);
  var non = []; for (var i = 2; i < 12; i++) if (n % i) non.push(i);
  var notes = {}; non.forEach(function (x) { notes[x] = n + " ÷ " + x + " = " + Math.floor(n / x) + " remainder " + (n % x) + ". Because there's something left over, " + x + " doesn't fit exactly, so it isn't a factor."; });
  return q("Factors", "Which of these is a factor of " + n + "?", f, non,
    f + " is a factor because " + n + " ÷ " + f + " = " + (n / f) + " exactly, with nothing left over.", "",
    { notes: notes, steps: ["Try dividing " + n + " by each option.", "A factor divides in exactly, with no remainder.", n + " ÷ " + f + " = " + (n / f) + ", no remainder, so " + f + " is a factor.", "All the factors of " + n + " are " + factors(n).join(", ") + "."] });
};
M.countFactors = function (L) {
  var n = pick(L === 1 ? [6, 10, 12, 15] : L === 2 ? [16, 18, 20, 24] : [24, 30, 36, 48]);
  var fs = factors(n), k = fs.length;
  var pairs = []; for (var i = 0; i < Math.ceil(fs.length / 2); i++) pairs.push(fs[i] + " × " + fs[fs.length - 1 - i]);
  var notes = {}; notes[k - 1] = "Close! You've probably missed one. Check you counted both 1 and " + n + " itself."; notes[k - 2] = "You've missed a couple. It's easy to forget 1 and " + n + ", or a pair in the middle.";
  notes[k / 2] = "That's the number of factor PAIRS. Each pair has two factors, so double it (unless a pair repeats a number, like 6 × 6).";
  return q("Factors", "How many factors does " + n + " have altogether?", k, [k - 1, k - 2, k + 1, k + 2, fs.length / 2],
    "The factors of " + n + " are " + fs.join(", ") + ". That's " + k + ". Don't forget 1 and " + n + " itself!", "",
    { notes: notes, steps: ["Find the factor pairs, starting from 1: " + pairs.join(", ") + ".", "Write out every number in those pairs: " + fs.join(", ") + ".", "Count them: " + k + " factors."] });
};
M.factorPair = function (L) {
  var n = pick(L === 1 ? [12, 18, 20] : L === 2 ? [24, 27, 32, 36] : [42, 45, 48, 56, 60]);
  var fs = factors(n).filter(function (x) { return x > 1 && x < n; }), a = pick(fs), b = n / a;
  var notes = {}; notes[n - a] = "That's " + n + " − " + a + ". We need to multiply, not subtract: what times " + a + " makes " + n + "?";
  notes[b + 1] = a + " × " + (b + 1) + " = " + (a * (b + 1)) + ", which is a bit too big."; notes[b - 1] = a + " × " + (b - 1) + " = " + (a * (b - 1)) + ", which is a bit too small.";
  return q("Factor pairs", n + " = " + a + " × ?", b, [b + 1, b - 1, a, n - a, b + 2],
    a + " × " + b + " = " + n + ", so " + a + " and " + b + " are a factor pair of " + n + ".", "",
    { notes: notes, steps: ["Turn it round: " + n + " ÷ " + a + " = ?", "Count up in " + a + "s until you reach " + n + ".", "It takes " + b + " jumps, so " + a + " × " + b + " = " + n + "."] });
};
M.commonFactor = function (L) {
  var pairs = L === 1 ? [[6, 9], [8, 12], [10, 15]] : L === 2 ? [[12, 18], [16, 24], [15, 25]] : [[18, 24], [24, 36], [30, 45]];
  var p = pick(pairs), a = p[0], b = p[1];
  var common = factors(a).filter(function (x) { return b % x === 0 && x > 1; });
  var c = pick(common);
  var wrong = factors(a).concat(factors(b)).filter(function (x) { return !(a % x === 0 && b % x === 0); });
  var notes = {}; wrong.concat([7, 11]).forEach(function (x) {
    notes[x] = x + " is " + (a % x === 0 ? "a factor of " + a + " but not of " + b : b % x === 0 ? "a factor of " + b + " but not of " + a : "not a factor of either number") + ". A COMMON factor has to go into both.";
  });
  return q("Common factors", "Which number is a common factor of " + a + " and " + b + "?", c, wrong.concat([7, 11]),
    c + " goes into both: " + a + " ÷ " + c + " = " + (a / c) + " and " + b + " ÷ " + c + " = " + (b / c) + ".", "",
    { notes: notes, steps: ["Factors of " + a + ": " + factors(a).join(", ") + ".", "Factors of " + b + ": " + factors(b).join(", ") + ".", "In both lists: " + factors(a).filter(function (x) { return b % x === 0; }).join(", ") + ". Of the choices, that's " + c + "."] });
};
M.multipleOf = function (L) {
  var k = pick(L === 1 ? [2, 5, 10] : L === 2 ? [3, 4, 6] : [7, 8, 9, 12]);
  var m = k * rnd(3, 12);
  var wrong = [m + 1, m - 1, m + 2, k + 1, m + k - 1].filter(function (x) { return x % k !== 0; });
  if (Math.random() < 0.4) {
    var ms = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).slice(0, 3).map(function (n) { return n * k; }), odd = pick(wrong), n2 = {};
    ms.forEach(function (x) { n2[x] = x + " IS a multiple of " + k + ": " + k + " × " + (x / k) + " = " + x + "."; });
    return q("Multiples", "Which of these is NOT a multiple of " + k + "?", odd, ms,
      odd + " isn't in the " + k + " times table: " + odd + " ÷ " + k + " leaves a remainder of " + (odd % k) + ".", "",
      { notes: n2, steps: ["Count up in " + k + "s: " + [1, 2, 3, 4, 5, 6].map(function (i) { return k * i; }).join(", ") + "…", "Check each option against the " + k + " times table.", odd + " doesn't appear, so it isn't a multiple."] });
  }
  var notes = {}; wrong.forEach(function (x) { notes[x] = x + " isn't in the " + k + " times table: " + x + " ÷ " + k + " leaves a remainder of " + (x % k) + "."; });
  return q("Multiples", "Which of these is a multiple of " + k + "?", m, wrong,
    m + " is in the " + k + " times table: " + k + " × " + (m / k) + " = " + m + ".", "",
    { notes: notes, steps: ["Count up in " + k + "s: " + [1, 2, 3, 4, 5, 6].map(function (i) { return k * i; }).join(", ") + "…", "Keep going until you reach or pass the options.", m + " = " + k + " × " + (m / k) + ", so it's a multiple."] });
};
M.lcm = function (L) {
  var pairs = L === 1 ? [[2, 3], [2, 5], [3, 5]] : L === 2 ? [[3, 4], [4, 6], [6, 8]] : [[6, 9], [8, 12], [9, 12], [4, 10]];
  var p = pick(pairs), a = p[0], b = p[1], l = lcm(a, b);
  var listA = [], listB = []; for (var i = 1; i <= 5; i++) { listA.push(a * i); listB.push(b * i); }
  var notes = {}; notes[a + b] = "That's " + a + " + " + b + ". Multiples come from times tables, not from adding the two numbers.";
  notes[a * b] = a + " × " + b + " = " + (a * b) + " IS a common multiple, but not the LOWEST one. A smaller number appears in both lists first.";
  notes[l * 2] = (l * 2) + " is a common multiple, but there's a smaller one.";
  notes[Math.max(a, b)] = Math.max(a, b) + " is in the " + Math.max(a, b) + " times table but not the " + Math.min(a, b) + " times table.";
  return q("Lowest common multiple", "What is the lowest common multiple of " + a + " and " + b + "?", l, [a * b === l ? l * 2 : a * b, a + b, Math.max(a, b), l + a],
    "List them: " + a + " → " + listA.join(", ") + "… and " + b + " → " + listB.join(", ") + "… The first number in both lists is " + l + ".", "",
    { notes: notes, steps: ["Write the " + a + " times table: " + listA.join(", ") + "…", "Write the " + b + " times table: " + listB.join(", ") + "…", "Find the smallest number that's in BOTH lists: " + l + "."] });
};
M.prime = function (L) {
  var primes = L === 1 ? [2, 3, 5, 7] : L === 2 ? [11, 13, 17, 19] : [23, 29, 31, 37, 41];
  var p = pick(primes);
  var non = (L === 1 ? [1, 4, 6, 8, 9] : L === 2 ? [9, 15, 21, 1, 12] : [21, 27, 33, 39, 49, 51]);
  var form = Math.random() < 0.25;
  if (form) return q("Prime numbers", "Is 1 a prime number?", "No", ["Yes", "Only sometimes", "Yes, it's the smallest prime"],
    "No. A prime has exactly two factors: 1 and itself. 1 only has one factor, so it isn't prime.");
  var notes = {}; non.forEach(function (x) {
    var f = factors(x); notes[x] = x === 1 ? "1 isn't prime: it only has one factor (itself)." : x + " has more than two factors (" + f.join(", ") + "), for example " + f[1] + " × " + (x / f[1]) + " = " + x + ". So it isn't prime.";
  });
  if (Math.random() < 0.4) {
    var nonP = pick(non.filter(function (x) { return x > 1; })), ps = shuffle(primes).slice(0, 3), nn = {};
    ps.forEach(function (x) { nn[x] = x + " IS prime: its only factors are 1 and " + x + "."; });
    var nf = factors(nonP);
    return q("Prime numbers", "Which of these is NOT a prime number?", nonP, ps,
      nonP + " isn't prime because it has more than two factors: " + nf.join(", ") + ". For example " + nf[1] + " × " + (nonP / nf[1]) + " = " + nonP + ".", "",
      { notes: nn, steps: ["Check each number: can you make it with a times table other than 1 × itself?", nf[1] + " × " + (nonP / nf[1]) + " = " + nonP + ", so " + nonP + " has extra factors.", "That means " + nonP + " is not prime."] });
  }
  return q("Prime numbers", "Which of these is a prime number?", p, non,
    p + " has exactly two factors, 1 and " + p + ". The others can be split into other factors.", "",
    { notes: notes, steps: ["For each number, ask: can I make it with a times table other than 1 × itself?", "If yes, it isn't prime.", p + " can only be made as 1 × " + p + ", so it's prime."] });
};
var HOMO = [
  ["The ___ of cows walked slowly across the field.", "herd", ["heard"]],
  ["I ___ a loud bang outside.", "heard", ["herd"]],
  ["My ___ drove me to school today.", "father", ["farther"]],
  ["Who can throw the ball ___, you or me?", "farther", ["father"]],
  ["She ___ the right answer straight away.", "guessed", ["guest"]],
  ["We had a special ___ for dinner on Friday.", "guest", ["guessed"]],
  ["The captain ___ the team onto the pitch.", "led", ["lead"]],
  ["Old water pipes were sometimes made of ___, a heavy metal.", "lead", ["led"]],
  ["I eat my breakfast every ___.", "morning", ["mourning"]],
  ["The family were in ___ after their grandad died.", "mourning", ["morning"]]
];
M.homophone = function () {
  var h = pick(HOMO);
  return q("Homophones", "Choose the right word: “" + h[0] + "”", h[1], h[2].concat(["herd", "heard", "guest", "led", "lead", "morning"].filter(function (w) { return w !== h[1]; })),
    "“" + h[1] + "” is correct here. Homophones sound the same but have different spellings and meanings.");
};
function toRoman(n) {
  var map = [[100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]], s = "";
  map.forEach(function (m) { while (n >= m[0]) { s += m[1]; n -= m[0]; } });
  return s;
}
M.roman = function (L) {
  var n = L === 1 ? rnd(4, 20) : L === 2 ? rnd(20, 60) : rnd(40, 100);
  var r = toRoman(n);
  if (Math.random() < 0.5) {
    return q("Roman numerals", "What number is " + r + "?", n, [n + 10, n - 1, n + 1, n - 10, n + 2].filter(function (x) { return x > 0; }),
      "I = 1, V = 5, X = 10, L = 50, C = 100. A smaller numeral before a bigger one is taken away (IV = 4, IX = 9, XL = 40, XC = 90). So " + r + " = " + n + ".", "",
      { steps: romanSteps(n) });
  }
  var wrong = [toRoman(n + 1), toRoman(Math.max(1, n - 1)), toRoman(n + 10), r.replace("IV", "IIII").replace("IX", "VIIII").replace("XL", "XXXX")];
  var rn2 = {}; var bad = r.replace("IV", "IIII").replace("IX", "VIIII").replace("XL", "XXXX");
  if (bad !== r) rn2[bad] = "Romans never write the same numeral four times in a row. Use the take-away trick instead (IV, IX, XL, XC).";
  return q("Roman numerals", "How do you write " + n + " in Roman numerals?", r, wrong.filter(function (w) { return w !== r; }).concat([toRoman(n + 5)]),
    n + " = " + r + ". Build it from the biggest numeral down.", "", { notes: rn2, steps: romanSteps(n) });
};
function romanSteps(n) {
  var tens = Math.floor(n / 10) * 10, ones = n % 10, s = ["Split " + n + " into tens and ones: " + tens + " + " + ones + "."];
  if (tens) s.push(tens + " = " + toRoman(tens) + ".");
  if (ones) s.push(ones + " = " + toRoman(ones) + ".");
  s.push("Put them together: " + toRoman(n) + ".");
  return s;
}
M.decimals = function (L) {
  var t = rnd(1, 3);
  if (t === 1) {
    var whole = rnd(1, 9), d1 = rnd(1, 9), d2 = rnd(1, 9);
    while (d2 === d1) d2 = rnd(1, 9);
    var num = whole + "." + d1 + d2;
    return q("Decimals", "What is the value of the digit " + d2 + " in " + num + "?", d2 + " hundredths", [d2 + " tenths", d2 + " ones", d2 + " thousandths"],
      "In " + num + ": " + whole + " is ones, " + d1 + " is tenths, " + d2 + " is hundredths.");
  }
  if (t === 2) {
    var w = rnd(2, 15), tenth = rnd(1, 9), x = w + "." + tenth + (L > 1 ? rnd(0, 9) : "");
    var ans = tenth >= 5 ? w + 1 : w;
    var rn = {}; rn[tenth >= 5 ? w : w + 1] = tenth >= 5 ? "The tenths digit is " + tenth + ", which is 5 or more, so we round UP to " + (w + 1) + "." : "The tenths digit is " + tenth + ", which is less than 5, so we keep " + w + " (round down).";
    return q("Rounding decimals", "Round " + x + " to the nearest whole number.", ans, [tenth >= 5 ? w : w + 1, w + 2, w - 1],
      "Look at the tenths digit: " + tenth + ". " + (tenth >= 5 ? "5 or more rounds up" : "Less than 5 stays the same") + ", so " + x + " rounds to " + ans + ".", "",
      { notes: rn, steps: [x + " is between " + w + " and " + (w + 1) + ".", "Look only at the first digit after the point (tenths): " + tenth + ".", tenth >= 5 ? "5 or more → round up to " + (w + 1) + "." : "4 or less → stay at " + w + "."] });
  }
  var a = rnd(10, 99) / 100 + rnd(1, 5), b = round2(a + pick([0.01, 0.1, -0.1, 0.09]));
  var big = Math.max(a, b);
  return q("Decimals", "Which is bigger: " + fmt(a) + " or " + fmt(b) + "?", fmt(big), [fmt(Math.min(a, b)), "They are equal", fmt(round2(big + 1))],
    "Compare ones first, then tenths, then hundredths. " + fmt(big) + " is bigger.");
};
var SPACE = [
  ["Which planet is closest to the Sun?", "Mercury", ["Venus", "Earth", "Mars"], "Mercury is the closest planet to the Sun."],
  ["Which is the largest planet in our solar system?", "Jupiter", ["Saturn", "Neptune", "Earth"], "Jupiter is the biggest planet, a giant ball of gas."],
  ["Why does Mars look red?", "Its surface has rusty iron dust", ["It is very hot", "It is covered in lava", "It reflects the Sun's red light only"], "Mars is covered in iron oxide (rust), which makes it look red."],
  ["Which planet is famous for its bright rings?", "Saturn", ["Mars", "Mercury", "Venus"], "Saturn's rings are made of ice and rock."],
  ["What is the Sun?", "A star", ["A planet", "A moon", "A comet"], "The Sun is a star at the centre of our solar system."],
  ["How many planets are in our solar system?", "8", ["9", "7", "10"], "There are 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus and Neptune."],
  ["Which planet is the hottest?", "Venus", ["Mercury", "Mars", "Jupiter"], "Venus is hottest, even though Mercury is closer, because its thick clouds trap heat."],
  ["Which planet is farthest from the Sun?", "Neptune", ["Uranus", "Saturn", "Jupiter"], "Neptune is the eighth and farthest planet."],
  ["Which is Earth's only natural satellite?", "The Moon", ["The Sun", "Mars", "Phobos"], "The Moon orbits Earth. Phobos is one of Mars's two moons."],
  ["Which planet is fourth from the Sun?", "Mars", ["Earth", "Jupiter", "Venus"], "Mercury, Venus, Earth, then Mars."],
  ["What does a planet need for humans to live there?", "Water, air to breathe and the right temperature", ["Lots of rings", "Many moons", "Being very big"], "That's what Solaris Seven is about: liquid water, breathable air and a temperature that isn't too hot or cold."],
  ["What is the order of the inner planets from the Sun?", "Mercury, Venus, Earth, Mars", ["Venus, Mercury, Earth, Mars", "Mercury, Earth, Venus, Mars", "Mars, Earth, Venus, Mercury"], "A trick: My Very Easy Method (Mercury, Venus, Earth, Mars)."]
];
M.space = function () {
  var s = pick(SPACE);
  return q("Our Solar System", s[0], s[1], s[2], s[3]);
};
M.tables = function (L) {
  var a = rnd(L === 1 ? 3 : 6, 12), b = rnd(L === 1 ? 2 : 4, 12), p = a * b;
  if (L === 3 && Math.random() < 0.5) return q("Times tables", p + " ÷ " + a + " = ?", b, [b + 1, b - 1, a, b + 2],
    "Think: " + a + " × what = " + p + "? It's " + b + ".");
  return q("Times tables", a + " × " + b + " = ?", p, [p + a, p - a, p + b, p - b, p + 1],
    a + " × " + b + " = " + p + ".");
};

/* ===== Kristan (Year 8) ===== */
var K = {};
function listWithMean(n, mean, spread) {
  var arr = [], s = 0;
  for (var i = 0; i < n - 1; i++) { var v = mean + rnd(-spread, spread); if (v < 0) v = mean; arr.push(v); s += v; }
  var last = mean * n - s;
  if (last < 0 || last > mean + spread * 3) return listWithMean(n, mean, spread);
  arr.push(last);
  return shuffle(arr);
}
K.meanList = function (L) {
  var n = L === 1 ? 4 : L === 2 ? 5 : 6, mean = rnd(4, 15), arr = listWithMean(n, mean, L === 1 ? 3 : 6);
  var sum = arr.reduce(function (a, b) { return a + b; }, 0);
  var sorted = arr.slice().sort(function (a, b) { return a - b; });
  var notes = {}; notes[round2(sum / (n - 1))] = "You divided by " + (n - 1) + ". There are " + n + " numbers, so divide by " + n + ".";
  notes[sorted[Math.floor(n / 2)]] = "That looks like the middle value, which is the median, not the mean.";
  notes[sum] = "That's the total. You need one more step: divide by how many numbers there are (" + n + ").";
  notes[mean + 1] = "Very close. Re-check your adding: the total should be " + sum + ".";
  return q("Mean", "Find the mean of: " + arr.join(", "), mean, [round2(sum / (n - 1)), sorted[Math.floor(n / 2)], sum, mean + 1],
    "Add them up: " + sum + ". Divide by how many there are (" + n + "): " + sum + " ÷ " + n + " = " + mean + ".", "",
    { notes: notes, steps: ["Add all the numbers: " + arr.join(" + ") + " = " + sum + ".", "Count them: " + n + " numbers.", "Divide: " + sum + " ÷ " + n + " = " + mean + ".", "Sense check: " + mean + " is between " + sorted[0] + " and " + sorted[n - 1] + ". ✓"] });
};
K.medianList = function (L) {
  var even = L > 1 && Math.random() < 0.6, n = even ? 6 : pick([5, 7]);
  var arr = []; for (var i = 0; i < n; i++) arr.push(rnd(1, 30));
  var s = arr.slice().sort(function (a, b) { return a - b; });
  var med = even ? (s[n / 2 - 1] + s[n / 2]) / 2 : s[(n - 1) / 2];
  var notes = {}; notes[String(arr[Math.floor(n / 2)])] = "That's the middle of the list as it was written. The numbers must be put in ORDER first.";
  notes[String(s[s.length - 1] - s[0])] = "That's biggest − smallest, which is the range, not the median.";
  if (even) notes[String(s[n / 2 - 1])] = "That's one of the two middle values. With an even count, go halfway between both.";
  return q("Median", "Find the median of: " + arr.join(", "), fmt(med), [arr[Math.floor(n / 2)], s[n / 2 - (even ? 1 : 0.5) | 0] + 1, s[s.length - 1] - s[0], fmt(med + 1), even ? s[n / 2 - 1] : s[0]].map(String),
    "Put them in order first: " + s.join(", ") + ". " + (even ? "With " + n + " values, the median is halfway between the two middle ones: (" + s[n / 2 - 1] + " + " + s[n / 2] + ") ÷ 2 = " + fmt(med) : "The middle value is " + med) + ".", "",
    { notes: notes, steps: ["Put them in order: " + s.join(", ") + ".", even ? "There are " + n + " values, so there are two middle ones: " + s[n / 2 - 1] + " and " + s[n / 2] + "." : "There are " + n + " values, so the middle one is number " + ((n + 1) / 2) + ".",
      even ? "Halfway between: (" + s[n / 2 - 1] + " + " + s[n / 2] + ") ÷ 2 = " + fmt(med) + "." : "That's " + med + "."] });
};
K.modeRange = function (L) {
  var base = []; for (var i = 0; i < 5; i++) base.push(rnd(2, 20));
  var m = base[0]; base.push(m); if (L > 1) base.push(m);
  var arr = shuffle(base), s = arr.slice().sort(function (a, b) { return a - b; });
  var counts = {}; arr.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
  var max = 0, mode = null, tie = false;
  Object.keys(counts).forEach(function (k) { if (counts[k] > max) { max = counts[k]; mode = +k; tie = false; } else if (counts[k] === max) tie = true; });
  if (tie) return K.modeRange(L);
  var range = s[s.length - 1] - s[0];
  var notes = {};
  if (Math.random() < 0.5) {
    notes[s[s.length - 1]] = "That's the biggest number. The mode is the MOST COMMON number, not the largest.";
    notes[max] = "That's how many times the mode appears (its frequency). The mode is the number itself.";
    notes[range] = "That's the range (biggest − smallest).";
    notes[s[Math.floor(s.length / 2)]] = "That's the middle value (median).";
    return q("Mode", "What is the mode of: " + arr.join(", ") + "?", mode, [s[s.length - 1], max, range, s[Math.floor(s.length / 2)]],
      "The mode is the most common value. " + mode + " appears " + max + " times.", "",
      { notes: notes, steps: ["Put them in order so repeats sit together: " + s.join(", ") + ".", "Count each value. " + mode + " appears " + max + " times; nothing else appears as often.", "So the mode is " + mode + "."] });
  }
  notes[s[s.length - 1]] = "That's just the biggest value. Range = biggest − smallest.";
  notes[s[0] + s[s.length - 1]] = "You added the biggest and smallest. Range is the DIFFERENCE, so subtract.";
  notes[mode] = "That's the mode (most common). Range measures spread.";
  return q("Range", "What is the range of: " + arr.join(", ") + "?", range, [s[s.length - 1], s[0] + s[s.length - 1], range + 1, mode],
    "Range = biggest − smallest = " + s[s.length - 1] + " − " + s[0] + " = " + range + ".", "",
    { notes: notes, steps: ["Find the biggest value: " + s[s.length - 1] + ".", "Find the smallest value: " + s[0] + ".", "Subtract: " + s[s.length - 1] + " − " + s[0] + " = " + range + "."] });
};
function freqTable(L) {
  var ctx = pick([["Goals scored", "Matches"], ["Number of pets", "Pupils"], ["Siblings", "Pupils"], ["Tries scored", "Games"]]);
  var vals = [0, 1, 2, 3].concat(L === 3 ? [4] : []);
  var fr = vals.map(function () { return rnd(1, 9); });
  var max = Math.max.apply(null, fr);
  if (fr.filter(function (f) { return f === max; }).length > 1) return freqTable(L);
  var html = '<table class="ft"><tr><th>' + ctx[0] + "</th>" + vals.map(function (v) { return "<td>" + v + "</td>"; }).join("") +
    "</tr><tr><th>" + ctx[1] + "</th>" + fr.map(function (f) { return "<td>" + f + "</td>"; }).join("") + "</tr></table>";
  return { ctx: ctx, vals: vals, fr: fr, html: html, total: fr.reduce(function (a, b) { return a + b; }, 0) };
}
K.freqMode = function (L) {
  var t = freqTable(L), max = Math.max.apply(null, t.fr), mode = t.vals[t.fr.indexOf(max)];
  var notes = {};
  if (Math.random() < 0.5) {
    notes[max] = "This is the most common mistake! " + max + " is the highest FREQUENCY (bottom row). The mode is the VALUE above it (top row): " + mode + ".";
    notes[t.total] = "That's the total frequency (everything added up). The mode is the value that occurs most often.";
    t.vals.forEach(function (v, i) { if (v !== mode && notes[v] === undefined) notes[v] = v + " only has a frequency of " + t.fr[i] + ". The mode has the highest frequency, " + max + "."; });
    return q("Mode from a table", "What is the mode of the " + t.ctx[0].toLowerCase() + "?", mode, [max, t.total, t.vals[t.vals.length - 1]].concat(t.vals),
      "The mode is the value with the highest frequency. The biggest frequency is " + max + ", for " + mode + ". (" + max + " is the frequency, not the mode.)", t.html,
      { notes: notes, steps: ["Look along the bottom row (" + t.ctx[1].toLowerCase() + ") for the biggest number: " + max + ".", "Look straight UP to the top row: " + mode + ".", "So the mode is " + mode + "."] });
  }
  var range = t.vals[t.vals.length - 1] - t.vals[0], frRange = Math.max.apply(null, t.fr) - Math.min.apply(null, t.fr);
  notes[frRange] = "You used the frequencies (bottom row). Range uses the VALUES in the top row.";
  notes[t.total] = "That's the total frequency. Range = biggest value − smallest value.";
  return q("Range from a table", "What is the range of the " + t.ctx[0].toLowerCase() + "?", range, [frRange, t.total, range + 1],
    "Use the values, not the frequencies: biggest − smallest = " + t.vals[t.vals.length - 1] + " − " + t.vals[0] + " = " + range + ".", t.html,
    { notes: notes, steps: ["Use the top row (the values): " + t.vals.join(", ") + ".", "Biggest value " + t.vals[t.vals.length - 1] + ", smallest " + t.vals[0] + ".", "Range = " + t.vals[t.vals.length - 1] + " − " + t.vals[0] + " = " + range + "."] });
};
K.freqMean = function (L) {
  var t = freqTable(L), fx = 0; t.vals.forEach(function (v, i) { fx += v * t.fr[i]; });
  var mean = round2(fx / t.total);
  var notes = {};
  notes[fmt(fx / t.vals.length)] = "You divided by " + t.vals.length + " (the number of columns). Divide by the TOTAL frequency instead: " + t.total + ".";
  notes[fmt(t.total / t.vals.length)] = "That's the frequencies averaged over the columns. You need value × frequency first, then ÷ total frequency.";
  notes[String(fx)] = "That's the total of value × frequency, which is the right first step! Now divide it by the total frequency, " + t.total + ".";
  return q("Mean from a table", "Find the mean " + t.ctx[0].toLowerCase() + " per " + t.ctx[1].toLowerCase().replace(/s$/, "") + ". Give it to 2 decimal places if needed.",
    fmt(mean), [fmt(fx / t.vals.length), fmt(t.total / t.vals.length), fmt(mean + 0.5), String(fx)],
    "Multiply each value by its frequency and add: " + t.vals.map(function (v, i) { return v + "×" + t.fr[i]; }).join(" + ") + " = " + fx +
    ". Divide by the total frequency, " + t.total + " (not by " + t.vals.length + " columns): " + fx + " ÷ " + t.total + " = " + fmt(mean) + ".", t.html,
    { notes: notes, steps: ["Multiply each value by its frequency: " + t.vals.map(function (v, i) { return v + " × " + t.fr[i] + " = " + v * t.fr[i]; }).join(", ") + ".",
      "Add those up: " + fx + ". (That's the total " + t.ctx[0].toLowerCase() + ".)", "Add the frequencies: " + t.fr.join(" + ") + " = " + t.total + ".", "Divide: " + fx + " ÷ " + t.total + " = " + fmt(mean) + "."] });
};
K.freqMedian = function (L) {
  var t = freqTable(L), n = t.total, cum = 0, pos = n % 2 ? (n + 1) / 2 : n / 2, pos2 = n % 2 ? pos : pos + 1, m1 = null, m2 = null, runs = [];
  t.vals.forEach(function (v, i) { cum += t.fr[i]; runs.push(cum); if (m1 === null && cum >= pos) m1 = v; if (m2 === null && cum >= pos2) m2 = v; });
  var med = (m1 + m2) / 2;
  var colMid = t.vals[Math.floor(t.vals.length / 2)];
  var notes = {};
  if (colMid !== med) notes[String(colMid)] = colMid + " is just the middle column of the table. The median depends on the frequencies too: find the middle PERSON using running totals.";
  notes[String(t.fr[Math.floor(t.fr.length / 2)])] = "That's a frequency from the bottom row. The median must be one of the values in the top row (or halfway between two).";
  return q("Median from a table", "Find the median " + t.ctx[0].toLowerCase() + ".", fmt(med), [colMid === med ? med + 1 : colMid, t.fr[Math.floor(t.fr.length / 2)], fmt(med + 0.5), med - 1 >= 0 ? med - 1 : med + 2].map(String),
    "Total frequency = " + n + ", so the median is the " + (n % 2 ? pos + "th value" : pos + "th and " + pos2 + "th values") + ". Running totals: " + runs.join(", ") + ". " +
    (m1 === m2 ? "That lands in the " + m1 + " column, so the median is " + m1 + "." : "They are " + m1 + " and " + m2 + ", so the median is " + fmt(med) + "."), t.html,
    { notes: notes, steps: ["Total frequency: " + t.fr.join(" + ") + " = " + n + ".", n % 2 ? "Odd total, so the middle position is (" + n + " + 1) ÷ 2 = " + pos + "." : "Even total, so the middle is between positions " + pos + " and " + pos2 + ".",
      "Running totals along the columns: " + t.vals.map(function (v, i) { return v + " → " + runs[i]; }).join(", ") + ".", m1 === m2 ? "Position " + pos + (pos2 !== pos ? " and " + pos2 : "") + " both fall in the " + m1 + " column. Median = " + m1 + "." : "Position " + pos + " is " + m1 + " and position " + pos2 + " is " + m2 + ". Median = " + fmt(med) + "."] });
};
K.missingMean = function (L) {
  var n = L === 1 ? 4 : 5, mean = rnd(5, 12), arr = listWithMean(n, mean, 4), miss = arr.pop(), sum = arr.reduce(function (a, b) { return a + b; }, 0);
  var notes = {}; if (miss !== mean) notes[mean] = "The missing number isn't necessarily the mean itself. Work out the total the numbers must add up to.";
  if (sum - mean >= 0) notes[sum - mean] = "You subtracted the mean from the total of the known numbers. Instead, find the total needed (" + n + " × " + mean + " = " + (n * mean) + ") and subtract what you have.";
  return q("Mean: missing value", "The mean of " + n + " numbers is " + mean + ". " + (n - 1 === 4 ? "Four" : n - 1 === 3 ? "Three" : (n - 1)) + " of them are " + arr.join(", ") + ". What is the missing number?", miss, [mean, mean * n - sum + 1, sum - mean, mean * (n - 1) - sum + mean].filter(function (x) { return x >= 0; }),
    "Total must be " + n + " × " + mean + " = " + (n * mean) + ". The known numbers add to " + sum + ", so the missing one is " + (n * mean) + " − " + sum + " = " + miss + ".", "",
    { notes: notes, steps: ["Mean = total ÷ count, so total = mean × count = " + mean + " × " + n + " = " + (n * mean) + ".", "Add the numbers you know: " + arr.join(" + ") + " = " + sum + ".", "Missing number = " + (n * mean) + " − " + sum + " = " + miss + ".", "Check: " + arr.concat([miss]).join(" + ") + " = " + (n * mean) + ", and " + (n * mean) + " ÷ " + n + " = " + mean + ". ✓"] });
};
var BEST = [
  ["House prices on a street, where one mansion costs far more than the rest. Which average is most sensible?", "Median", ["Mean", "Range", "Mode"], "The median isn't dragged up by one extreme value, but the mean is."],
  ["A shoe shop wants to know which shoe size to stock most of. Which average?", "Mode", ["Mean", "Median", "Range"], "The mode tells you the most common size, and you can't sell a size 6.4 shoe!"],
  ["Which of these measures how spread out the data is, rather than an average?", "Range", ["Mean", "Median", "Mode"], "Range = biggest − smallest. It measures spread."],
  ["Test scores with no extreme values: which average uses every score?", "Mean", ["Mode", "Median", "Range"], "The mean uses every value, so it's best when there are no outliers."],
  ["Favourite colours of a class. Which average can you use?", "Mode", ["Mean", "Median", "Range"], "Colours aren't numbers, so only the mode works."]
];
K.bestAverage = function () { var b = pick(BEST); return q("Choosing an average", b[0], b[1], b[2], b[3]); };
var POEMS = [
  ["Who wrote ‘The Lady of Shalott’?", "Alfred Lord Tennyson", ["John Keats", "Alfred Noyes", "Julia Donaldson"], "Tennyson wrote The Lady of Shalott."],
  ["Who wrote ‘La Belle Dame sans Merci’?", "John Keats", ["Alfred Lord Tennyson", "Alfred Noyes", "Richard Alan Crust"], "Keats wrote La Belle Dame sans Merci."],
  ["Which poem is a comic parody of ‘The Highwayman’?", "The Highway Rat", ["Lefty & Ned", "The Lady of Shalott", "La Belle Dame sans Merci"], "Julia Donaldson's Highway Rat copies the Highwayman's style for comic effect."],
  ["In ‘The Lady of Shalott’, how does the Lady see the outside world?", "Through a mirror", ["Through a window", "In her dreams", "From a boat"], "She is cursed and may only look at the world reflected in her mirror."],
  ["What happens to the knight in ‘La Belle Dame sans Merci’?", "He is enchanted and left alone and pale", ["He wins a battle", "He marries the lady", "He robs a coach"], "He's bewitched by the mysterious lady and left wandering by the lake."],
  ["What is the moral at the end of ‘Lefty & Ned’?", "Crime never pays", ["Love conquers all", "Always be kind", "Nature is powerful"], "The two crooks' plan goes wrong, and the poem spells out the moral."],
  ["All five anthology poems tell a story. What is that kind of poem called?", "A narrative poem (ballad)", ["A sonnet", "A haiku", "A limerick"], "Narrative poems and ballads tell a story, often with regular rhyme and rhythm."],
  ["A line or verse repeated throughout a poem is called a…", "Refrain", ["Simile", "Stanza break", "Caesura"], "Lefty & Ned repeats its refrain at the end of every verse."],
  ["“The road was a ribbon of moonlight” (The Highwayman) uses which technique?", "Metaphor", ["Simile", "Onomatopoeia", "Alliteration only"], "It says the road *was* a ribbon, not *like* one, so it's a metaphor."],
  ["“The wind was a torrent of darkness” (The Highwayman) is an example of…", "Metaphor", ["Simile", "Rhetorical question", "Personification only"], "The wind is described as if it really were a torrent of darkness."],
  ["“And no birds sing” (La Belle Dame) helps create a mood that is…", "Bleak and lifeless", ["Joyful and lively", "Funny", "Peaceful and hopeful"], "The silent, empty landscape mirrors the knight's misery (pathetic fallacy)."],
  ["“Riding—riding—riding” in The Highwayman uses repetition to suggest…", "The rhythm of a galloping horse", ["The rider is lost", "A quiet night", "A sad ending"], "The repeated word mimics hoofbeats and builds pace."],
  ["Which pair would suit a question on ‘women and isolation’?", "The Lady of Shalott and La Belle Dame sans Merci", ["The Highway Rat and Lefty & Ned", "Lefty & Ned and The Highwayman", "The Highway Rat and The Highwayman"], "Both feature mysterious women, enchantment or curses, and tragic endings."],
  ["Which pair would suit a question on ‘villains and crime’?", "The Highwayman and The Highway Rat", ["The Lady of Shalott and La Belle Dame sans Merci", "La Belle Dame and Lefty & Ned", "The Lady of Shalott and The Highway Rat"], "A romantic outlaw versus a comic, greedy villain."],
  ["In a PEACEAL paragraph, what does the ‘E’ straight after ‘P’ stand for?", "Evidence", ["Explain", "Example", "Ending"], "Point, then Evidence: a short quote from the poem."],
  ["In PEACEAL, what should the final ‘L’ do?", "Link back to the question", ["List more quotes", "Look at the next poem", "Leave a cliffhanger"], "Finish by linking your point back to the exam question."],
  ["Which is the best way to use a quotation?", "Embed a few key words in your sentence", ["Copy out the whole verse", "Never use quotes", "Put the quote at the end with no comment"], "Short, embedded quotes let you zoom in on a word and analyse it."],
  ["Which word best introduces a DIFFERENCE between two poems?", "Whereas", ["Similarly", "Likewise", "Also"], "Whereas / in contrast show difference; similarly / likewise show similarity."],
  ["Which word best introduces a SIMILARITY between two poems?", "Similarly", ["However", "Whereas", "In contrast"], "Similarly and likewise show that both poems do the same thing."],
  ["What's the biggest mistake to avoid in a poetry comparison?", "Retelling the story instead of analysing", ["Using short quotes", "Naming techniques", "Comparing both poems"], "Analyse why the poet made choices and their effect. Don't just retell what happens."],
  ["“The Highway Rat” and “Lefty & Ned” are mainly different from “The Highwayman” in…", "Tone: they are comic, it is romantic and tragic", ["They have no rhyme", "They aren't stories", "They are sonnets"], "Tone is a strong point of comparison across the anthology."]
];
K.poetry = function () { var p = pick(POEMS); return q("Poetry", p[0], p[1], p[2], p[3]); };
K.simplify = function (L) {
  var a = rnd(2, 7), b = rnd(2, 6); while (b === a) b = rnd(2, 6);
  var x = pick(["a", "m", "x", "y"]), y = pick(["b", "n", "p"]);
  if (L > 1 && Math.random() < 0.5) {
    var n1 = {}; n1[(a * b) + x] = "The numbers are right, but " + x + " × " + x + " is " + x + "², not just " + x + ".";
    n1[(a + b) + x + "²"] = "You ADDED " + a + " and " + b + ". It's a multiplication, so multiply them: " + (a * b) + ".";
    n1[(a + b) + x] = "Two slips: the numbers should be multiplied (" + (a * b) + "), and " + x + " × " + x + " = " + x + "².";
    return q("Simplifying", "Simplify " + a + x + " × " + b + x, (a * b) + x + "²", [(a * b) + x, (a + b) + x + "²", (a * b) + x + x + "²", (a + b) + x],
      "Multiply the numbers (" + a + " × " + b + " = " + (a * b) + "), and " + x + " × " + x + " = " + x + "². Answer: " + (a * b) + x + "².", "",
      { notes: n1, steps: [a + x + " × " + b + x + " means " + a + " × " + x + " × " + b + " × " + x + ".", "Multiply the numbers: " + a + " × " + b + " = " + (a * b) + ".", "Multiply the letters: " + x + " × " + x + " = " + x + "².", "Put together: " + (a * b) + x + "²."] });
  }
  var n2 = {}; n2[(a + b) + x + y] = "You added " + a + " and " + b + ". In a multiplication, the numbers multiply: " + a + " × " + b + " = " + (a * b) + ".";
  n2[a + "" + b + x + y] = "The numbers have been written side by side. They need multiplying: " + (a * b) + ".";
  n2[(a * b) + x + "+" + y] = "The letters are multiplied too, so they sit together with no + sign: " + x + y + ".";
  return q("Simplifying", "Simplify " + a + x + " × " + b + y, (a * b) + x + y, [(a + b) + x + y, a + b + x + y, (a * b) + x + "+" + y, a + "" + b + x + y, (a * b + a) + x + y],
    "Multiply the numbers: " + a + " × " + b + " = " + (a * b) + ". Then write the letters together: " + (a * b) + x + y + ".", "",
    { notes: n2, steps: [a + x + " × " + b + y + " means " + a + " × " + x + " × " + b + " × " + y + ".", "Order doesn't matter in multiplication, so group the numbers: " + a + " × " + b + " = " + (a * b) + ".", "Letters multiplied are written side by side: " + x + y + ".", "Answer: " + (a * b) + x + y + "."] });
};
K.nthTerm = function (L) {
  var d = rnd(2, 7), c = rnd(-4, 6), seq = [1, 2, 3, 4].map(function (n) { return d * n + c; });
  var rule = d + "n" + (c === 0 ? "" : c > 0 ? " + " + c : " − " + (-c));
  if (L === 3 && Math.random() < 0.5) {
    var k = rnd(10, 30), t = d * k + c;
    return q("Sequences", "A sequence has nth term " + rule + ". What is term number " + k + "?", t, [d * k, t + d, d + k + c, t - c * 2],
      "Substitute n = " + k + ": " + d + " × " + k + (c ? (c > 0 ? " + " + c : " − " + (-c)) : "") + " = " + t + ".");
  }
  var wrongs = [(c + d) + "n" + (d > 0 ? " − " + d : ""), d + "n", "n + " + d, (d + 1) + "n" + (c - 1 === 0 ? "" : c - 1 > 0 ? " + " + (c - 1) : " − " + (1 - c))];
  var nn = {}; nn["n + " + d] = "n + " + d + " would give " + (1 + d) + ", " + (2 + d) + ", " + (3 + d) + "…, going up by 1 each time. The jump of " + d + " goes in FRONT of n: " + d + "n.";
  if (c !== 0) nn[d + "n"] = d + "n gives " + [1, 2, 3].map(function (n) { return d * n; }).join(", ") + "… Right jump, but each term in the sequence is " + (c > 0 ? c + " more" : (-c) + " less") + ", so adjust: " + rule + ".";
  nn[wrongs[0]] = "Test it with n = 1: it doesn't give " + seq[0] + ". Always check your rule against the first term.";
  nn[wrongs[3]] = "The number in front of n should be the jump between terms, which is " + d + ", not " + (d + 1) + ".";
  return q("Sequences", "Find the nth term of: " + seq.join(", ") + ", …", rule, wrongs,
    "It goes up by " + d + " each time, so start with " + d + "n (" + [1, 2, 3, 4].map(function (n) { return d * n; }).join(", ") + "). Each term is " + (c >= 0 ? c + " more" : (-c) + " less") + ", so the rule is " + rule + ".", "",
    { notes: nn, steps: ["Find the jump between terms: " + seq[1] + " − " + seq[0] + " = " + d + ". So the rule starts " + d + "n.", "Write out " + d + "n: " + [1, 2, 3, 4].map(function (n) { return d * n; }).join(", ") + ".", "Compare with the sequence " + seq.join(", ") + ": each term is " + (c >= 0 ? c + " more" : (-c) + " less") + ".", "So the nth term is " + rule + ". Check n = 1: " + d + " × 1" + (c ? (c > 0 ? " + " + c : " − " + (-c)) : "") + " = " + seq[0] + ". ✓"] });
};
K.commutative = function () {
  var a = rnd(3, 12), b = rnd(3, 12); while (b === a) b = rnd(3, 12);
  var ops = [["+", true], ["×", true], ["−", false], ["÷", false]], o = pick(ops);
  return q("Commutative law", "Is " + a + " " + o[0] + " " + b + " always equal to " + b + " " + o[0] + " " + a + "?", o[1] ? "Yes" : "No", o[1] ? ["No"] : ["Yes"],
    o[1] ? "Addition and multiplication are commutative: order doesn't matter." : "Subtraction and division are NOT commutative: swapping the order changes the answer.");
};


/* ----- Kristan: wider Year 8 school learning (from CENTURY completed work) ----- */
function frac(n, d) { var g = gcd(n, d); return (n / g) + "/" + (d / g); }
K.ratioSimplify = function (L) {
  var a = rnd(1, 5), b = rnd(1, 7); while (gcd(a, b) !== 1 || a === b) { a = rnd(1, 5); b = rnd(1, 7); }
  var k = pick(L === 1 ? [2, 3, 5] : [4, 6, 8, 12]), A = a * k, B = b * k;
  var half = (k % 2 === 0 && k > 2) ? (A / 2) + ":" + (B / 2) : (A * 2) + ":" + (B * 2);
  var notes = {}; notes[b + ":" + a] = "The numbers are right but the wrong way round. The ratio must stay in the same order: " + A + " first, then " + B + ".";
  notes[half] = k % 2 === 0 && k > 2 ? "That's simpler, but not the SIMPLEST form. Both numbers can still be divided by " + (k / 2) + "." : "That makes the numbers bigger. Simplify by DIVIDING both sides by the same number.";
  notes[(a + 1) + ":" + b] = "Check your division: " + A + " ÷ " + k + " = " + a + ", not " + (a + 1) + ".";
  notes[a + ":" + (b + 1)] = "Check your division: " + B + " ÷ " + k + " = " + b + ", not " + (b + 1) + ".";
  return q("Ratio", "Write " + A + ":" + B + " in its simplest form.", a + ":" + b, [b + ":" + a, half, (a + 1) + ":" + b, a + ":" + (b + 1)],
    "The highest common factor of " + A + " and " + B + " is " + k + ". " + A + " ÷ " + k + " = " + a + " and " + B + " ÷ " + k + " = " + b + ", so it's " + a + ":" + b + ".", "",
    { notes: notes, steps: ["Find the highest number that divides into both " + A + " and " + B + ": it's " + k + ".", "Divide both sides by " + k + ": " + A + " ÷ " + k + " = " + a + ", " + B + " ÷ " + k + " = " + b + ".", "Check: " + a + " and " + b + " have no common factor except 1, so " + a + ":" + b + " is simplest."] });
};
K.ratioShare = function (L) {
  var a = rnd(1, 4), b = rnd(2, 6); while (a === b || gcd(a, b) !== 1) { a = rnd(1, 4); b = rnd(2, 6); }
  var parts = a + b, unit = pick(L === 1 ? [5, 10, 4] : L === 2 ? [6, 12, 15, 8] : [7, 9, 14, 25]), total = parts * unit;
  var who = pick([["Kristan", "Millie"], ["Sam", "Ali"], ["Team A", "Team B"]]), askFirst = Math.random() < 0.5;
  var ans = (askFirst ? a : b) * unit, other = (askFirst ? b : a) * unit;
  var notes = {}; notes[other] = "That's the other person's share. Check which side of the ratio belongs to " + (askFirst ? who[0] : who[1]) + ".";
  notes[Math.round(total / 2)] = "That splits it equally. A ratio of " + a + ":" + b + " isn't equal, so divide into " + parts + " parts first.";
  notes[ans + unit] = "That's one part too many. One part is " + unit + ", and " + (askFirst ? who[0] : who[1]) + " has " + (askFirst ? a : b) + " parts.";
  notes[Math.round(total / (askFirst ? a : b))] = "You divided by one side of the ratio. Divide the total by the TOTAL number of parts (" + a + " + " + b + " = " + parts + ").";
  return q("Ratio", "Share " + total + " in the ratio " + a + ":" + b + " between " + who[0] + " and " + who[1] + ". How much does " + (askFirst ? who[0] : who[1]) + " get?", ans,
    [other, Math.round(total / 2), Math.round(total / (askFirst ? a : b)), ans + unit],
    "There are " + parts + " parts, so one part is " + total + " ÷ " + parts + " = " + unit + ". " + (askFirst ? who[0] : who[1]) + " gets " + (askFirst ? a : b) + " parts: " + (askFirst ? a : b) + " × " + unit + " = " + ans + ".", "",
    { notes: notes, steps: ["Add the parts: " + a + " + " + b + " = " + parts + ".", "Value of one part: " + total + " ÷ " + parts + " = " + unit + ".", (askFirst ? who[0] : who[1]) + " has " + (askFirst ? a : b) + " parts: " + (askFirst ? a : b) + " × " + unit + " = " + ans + ".", "Check: " + (a * unit) + " + " + (b * unit) + " = " + total + ". ✓"] });
};
K.solveEq = function (L) {
  var x = rnd(2, 12), a, b, c, eq, steps, wrong, notes = {};
  if (L === 1) {
    b = rnd(3, 20); c = x + b; eq = "x + " + b + " = " + c;
    steps = ["Undo + " + b + " by subtracting " + b + " from both sides.", "x = " + c + " − " + b + " = " + x + ".", "Check: " + x + " + " + b + " = " + c + ". ✓"];
    wrong = [c + b, b, c]; notes[c + b] = "You added " + b + ". To undo + " + b + ", SUBTRACT it."; notes[c] = "That's the right-hand side. x is what you add " + b + " to, to GET " + c + "."; notes[b] = b + " is the number being added. We want x on its own.";
  } else if (L === 2 || Math.random() < 0.5) {
    a = rnd(2, 9); b = rnd(1, 15); c = a * x + b; eq = a + "x + " + b + " = " + c;
    steps = ["Undo + " + b + " first: " + c + " − " + b + " = " + (c - b) + ", so " + a + "x = " + (c - b) + ".", "Undo × " + a + ": " + (c - b) + " ÷ " + a + " = " + x + ".", "Check: " + a + " × " + x + " + " + b + " = " + c + ". ✓"];
    wrong = [c - b, (c + b) / a, round2(c / a - b)]; notes[c - b] = "You found " + a + "x = " + (c - b) + " (good!) but stopped. Divide by " + a + " to find x.";
    notes[(c + b) / a] = "You added " + b + " instead of subtracting it. To undo + " + b + ", take it away.";
    notes[round2(c / a - b)] = "You divided first. Undo the + " + b + " BEFORE dividing (work backwards through the operations).";
  } else {
    a = rnd(2, 6); b = rnd(1, 10); c = a * x - b; eq = a + "x − " + b + " = " + c;
    steps = ["Undo − " + b + " by adding " + b + ": " + c + " + " + b + " = " + (c + b) + ", so " + a + "x = " + (c + b) + ".", "Divide by " + a + ": " + (c + b) + " ÷ " + a + " = " + x + ".", "Check: " + a + " × " + x + " − " + b + " = " + c + ". ✓"];
    wrong = [round2((c - b) / a), c + b, x + 1]; notes[round2((c - b) / a)] = "You subtracted " + b + ". To undo − " + b + ", ADD it.";
    notes[c + b] = "That's " + a + "x. One more step: divide by " + a + ".";
  }
  return q("Solving equations", "Solve: " + eq, x, wrong.map(function (w) { return round2(w); }), "x = " + x + ". Do the inverse operations in reverse order, then check by substituting back.", "", { notes: notes, steps: steps });
};
function sig1(n) { var p = Math.pow(10, Math.floor(Math.log10(n))); return Math.round(n / p) * p; }
K.round1sf = function (L) {
  var n;
  do { n = L === 1 ? rnd(12, 98) : L === 2 ? rnd(120, 9800) : pick([rnd(1200, 98000), rnd(11, 99) / 1000]); } while (n >= 1 && sig1(n) === n);
  if (n < 1) n = +n.toFixed(3);
  var r = sig1(n), str = String(n), rs = String(+r.toPrecision(1));
  var p = n >= 1 ? Math.pow(10, Math.floor(Math.log10(n))) : Math.pow(10, Math.floor(Math.log10(n)));
  var notes = {}, truncated = Math.floor(n / p) * p, t = String(+truncated.toPrecision(1));
  if (t !== rs) notes[t] = "You chopped off the digits instead of rounding. Look at the second digit: it's 5 or more, so round UP.";
  var two = String(+(+n).toPrecision(2)); if (two !== rs) notes[two] = "That's 2 significant figures. 1 s.f. keeps only the first non-zero digit.";
  var first = String(str.replace(/[0.]/g, "")[0]); if (first !== rs) notes[first] = "Keep the place value! The answer must be about the same size as " + str + ", so fill with zeros.";
  notes[String(+(r * 10).toPrecision(1))] = "That's ten times too big. The rounded number must stay about the same size as " + str + ".";
  return q("Rounding & estimation", "Round " + str + " to 1 significant figure.", rs, [t, two, first, String(+(r * 10).toPrecision(1))],
    "The first significant figure is the first non-zero digit. Look at the next digit to decide whether to round up, then keep the number the same size: " + str + " → " + rs + ".", "",
    { notes: notes, steps: ["Find the first non-zero digit of " + str + ".", "Look at the digit after it: 5 or more rounds up, 4 or less stays.", "Replace the rest with zeros (keeping the place value): " + rs + "."] });
};
K.estimate = function (L) {
  var a = rnd(11, 89) + (L > 1 ? rnd(1, 9) / 10 : 0), b = rnd(3, 9) + (L > 1 ? rnd(1, 9) / 10 : 0), c = pick([2, 4, 5]) + (L === 3 ? rnd(1, 4) / 10 : 0);
  var ra = sig1(a), rb = sig1(b), rc = sig1(c), est = round2(ra * rb / rc), exact = round2(a * b / c);
  var notes = {}; notes[String(exact)] = "That's the exact answer from a calculator. An ESTIMATE rounds each number to 1 s.f. first.";
  notes[String(round2(ra * rb))] = "You forgot to divide by " + rc + ".";
  notes[String(round2(est * 2))] = "That's double the estimate. Check the division: " + (ra * rb) + " ÷ " + rc + " = " + est + ".";
  notes[String(round2(ra * rb / (rc + 1)))] = c + " rounds to " + rc + " (1 significant figure), not " + (rc + 1) + ".";
  return q("Rounding & estimation", "Estimate (" + a + " × " + b + ") ÷ " + c + " by rounding each number to 1 significant figure.", String(est),
    [String(exact), String(round2(ra * rb)), String(round2(est * 2)), String(round2(ra * rb / (rc + 1)))],
    a + " ≈ " + ra + ", " + b + " ≈ " + rb + ", " + c + " ≈ " + rc + ". So (" + ra + " × " + rb + ") ÷ " + rc + " = " + est + ".", "",
    { notes: notes, steps: ["Round each number to 1 s.f.: " + a + " → " + ra + ", " + b + " → " + rb + ", " + c + " → " + rc + ".", "Multiply: " + ra + " × " + rb + " = " + (ra * rb) + ".", "Divide: " + (ra * rb) + " ÷ " + rc + " = " + est + "."] });
};
K.angles = function (L) {
  var x = rnd(35, 145); while (x === 90) x = rnd(35, 145);
  var kinds = [["alternate", x, "Alternate angles (the Z shape) are equal."], ["corresponding", x, "Corresponding angles (the F shape) are equal."], ["co-interior", 180 - x, "Co-interior angles (the C or U shape) add up to 180°."]];
  if (L > 1) kinds.push(["vertically opposite", x, "Vertically opposite angles (an X shape) are equal."]);
  var k = pick(kinds), ans = k[1], otherAns = ans === x ? 180 - x : x;
  var notes = {}; notes[otherAns] = k[0] === "co-interior" ? "That would be true for alternate or corresponding angles. Co-interior angles ADD UP to 180°, so subtract from 180." : k[0] + " angles are EQUAL, not adding to 180°. You only subtract from 180° for co-interior angles or angles on a straight line.";
  notes[90 + (x % 45)] = "That angle doesn't come from any of the rules. " + k[2];
  notes[Math.abs(90 - x)] = "Angles here don't involve 90°. " + k[2];
  notes[x + 10] = "Close, but these rules give exact matches. " + k[2];
  notes[360 - x] = "Angles round a point make 360°, but that's not the rule here. " + k[2];
  return q("Angles in parallel lines", "Two parallel lines are crossed by a transversal. One angle is " + x + "°. What is the " + k[0] + " angle to it?", ans + "°",
    [otherAns + "°", (360 - x) + "°", (90 + (x % 45)) + "°", Math.abs(90 - x) + "°", (x + 10) + "°"],
    k[2] + " So the answer is " + ans + "°.", "",
    { notes: (function () { var n = {}; Object.keys(notes).forEach(function (kk) { n[kk + "°"] = notes[kk]; }); return n; })(),
      steps: ["Picture the shape: alternate = Z, corresponding = F, co-interior = C, vertically opposite = X.", k[2], "So the " + k[0] + " angle = " + (ans === x ? x + "°" : "180° − " + x + "° = " + ans + "°") + "."] });
};
K.probability = function (L) {
  var r = rnd(1, 6), b = rnd(1, 6), g = L > 1 ? rnd(1, 5) : 0, n = r + b + g;
  var cols = [["red", r], ["blue", b]].concat(g ? [["green", g]] : []), c = pick(cols), not = L === 3 && Math.random() < 0.5;
  var num = not ? n - c[1] : c[1], ans = frac(num, n);
  var notes = {}; notes[c[1] + "/" + (n - c[1])] = "You compared " + c[0] + " with the others. Probability is out of ALL the counters: " + n + ".";
  if (not) notes[frac(c[1], n)] = "That's the probability it IS " + c[0] + ". You need NOT " + c[0] + ": 1 − that.";
  notes[frac(n - c[1], n)] = not ? notes[frac(n - c[1], n)] : "That's the probability of NOT getting " + c[0] + ". Count only the " + c[0] + " counters on top.";
  notes[num + "/" + (n + 1)] = "The bottom number is the total number of counters: " + n + ".";
  notes[frac(Math.max(1, num - 1), n)] = "Recount the " + (not ? "counters that aren't " + c[0] : c[0] + " counters") + ": there are " + num + ".";
  return q("Probability", "A bag has " + cols.map(function (x) { return x[1] + " " + x[0]; }).join(", ") + " counters. One is picked at random. What is the probability it is " + (not ? "NOT " : "") + c[0] + "? (simplest form)", ans,
    [c[1] + "/" + (n - c[1]), not ? frac(c[1], n) : frac(n - c[1], n), frac(Math.max(1, num - 1), n), num + "/" + (n + 1), frac(num, n + 2)].filter(function (o) { return o !== ans; }),
    "P = favourable outcomes ÷ total outcomes = " + num + "/" + n + (frac(num, n) !== num + "/" + n ? " = " + ans + " in simplest form" : "") + ".", "",
    { notes: notes, steps: ["Total counters: " + cols.map(function (x) { return x[1]; }).join(" + ") + " = " + n + ".", (not ? "Counters that are NOT " + c[0] + ": " + n + " − " + c[1] + " = " + num : c[0] + " counters: " + num) + ".", "Probability = " + num + "/" + n + (frac(num, n) !== num + "/" + n ? ", which simplifies to " + ans : "") + "."] });
};
K.indices = function (L) {
  var base = pick(["x", "a", "y", "2", "5"]), m = rnd(2, 8), n = rnd(2, 6);
  while (m * n === m + n || m === n) { m = rnd(2, 8); n = rnd(2, 6); }
  var div = L > 1 && Math.random() < 0.5;
  if (div && n >= m) { var t = m; m = n + 2; n = t; }
  var ans = base + "^" + (div ? m - n : m + n);
  var notes = {}; notes[base + "^" + (m * n)] = div ? "You multiplied the powers. When DIVIDING, subtract them." : "You multiplied the powers. When multiplying, ADD the powers (multiply them only for a power of a power).";
  if (div) notes[base + "^" + (m + n)] = "You added the powers. When dividing, SUBTRACT them.";
  else notes[base + "^" + Math.abs(m - n)] = "You subtracted the powers. When multiplying, ADD them.";
  notes[base + "^" + ((div ? m - n : m + n) + 1)] = "Nearly! Recheck: " + m + (div ? " − " : " + ") + n + " = " + (div ? m - n : m + n) + ".";
  if (!isNaN(+base)) notes[(+base * +base) + "^" + (div ? m - n : m + n)] = "The base stays the same (" + base + "). Only the powers change.";
  return q("Indices", "Simplify " + base + "^" + m + (div ? " ÷ " : " × ") + base + "^" + n, ans,
    [base + "^" + (m * n), base + "^" + (div ? m + n : Math.abs(m - n) || m + n + 1), (isNaN(+base) ? base + base : +base * +base) + "^" + (div ? m - n : m + n), base + "^" + ((div ? m - n : m + n) + 1)],
    (div ? "Dividing: subtract the powers. " + m + " − " + n + " = " + (m - n) : "Multiplying: add the powers. " + m + " + " + n + " = " + (m + n)) + ". The base stays as " + base + ".", "",
    { notes: notes, steps: [base + "^" + m + " means " + m + " lots of " + base + " multiplied together; " + base + "^" + n + " means " + n + " lots.", div ? "Dividing cancels " + n + " of them: " + m + " − " + n + " = " + (m - n) + " left." : "Multiplying puts them together: " + m + " + " + n + " = " + (m + n) + ".", "Answer: " + ans + "."] });
};
K.negatives = function (L) {
  var a = rnd(3, 12), b = rnd(2, 12); while (b === a || b === a - 1) b = rnd(2, 12);
  var t = rnd(1, L === 1 ? 2 : 4), prompt, ans, wrong, notes = {}, steps;
  if (t === 1) { prompt = "−" + a + " + " + b; ans = b - a; wrong = [-(a + b), a + b, a - b]; steps = ["Start at −" + a + " on a number line.", "Move " + b + " to the right (adding).", "You land on " + ans + "."]; notes[-(a + b)] = "Adding a positive moves you RIGHT (up) the number line, towards zero."; notes[a + b] = "The " + a + " is negative, so you're starting below zero, not adding two positives."; notes[a - b] = "Right size, wrong sign: start at −" + a + " and move " + b + " right."; }
  else if (t === 2) { prompt = a + " − " + (a + b); ans = -b; wrong = [b, a + b, -(2 * a + b)]; steps = ["Start at " + a + ".", "Take away " + (a + b) + ": you go past zero.", a + " − " + (a + b) + " = −" + b + "."]; notes[b] = "Right size, wrong sign: taking away more than you have goes below zero."; notes[a + b] = "That's the number being taken away. Start at " + a + " and count back " + (a + b) + "."; notes[-(2 * a + b)] = "You went too far. " + a + " − " + (a + b) + " only goes " + b + " below zero."; }
  else if (t === 3) { prompt = "−" + a + " × −" + b; ans = a * b; wrong = [-(a * b), -(a + b), a + b]; steps = ["Multiply the numbers: " + a + " × " + b + " = " + (a * b) + ".", "Negative × negative = positive.", "So the answer is " + ans + "."]; notes[-(a * b)] = "A negative times a negative is POSITIVE."; notes[-(a + b)] = "This is a multiplication, not an addition."; notes[a + b] = "This is a multiplication: " + a + " × " + b + ", not " + a + " + " + b + "."; }
  else { prompt = "−" + (a * b) + " ÷ " + b; ans = -a; wrong = [a, -(a * b - b), b]; steps = ["Divide the numbers: " + (a * b) + " ÷ " + b + " = " + a + ".", "Negative ÷ positive = negative.", "So the answer is " + ans + "."]; notes[a] = "Negative ÷ positive gives a NEGATIVE answer."; notes[-(a * b - b)] = "This is a division: " + (a * b) + " ÷ " + b + ", not a subtraction."; notes[b] = "Check the division: " + (a * b) + " ÷ " + b + " = " + a + ", and the answer is negative."; }
  var fixed = {}; Object.keys(notes).forEach(function (k) { fixed[String(k).replace("-", "−")] = notes[k]; });
  var fmtN = function (v) { return String(v).replace("-", "−"); };
  return q("Negative numbers", "Work out " + prompt, fmtN(ans), wrong.filter(function (w) { return w !== ans; }).map(fmtN), "The answer is " + fmtN(ans) + ".", "", { notes: fixed, steps: steps });
};
var SCIENCE = [
  ["Which of these is a renewable energy resource?", "Wind", ["Coal", "Natural gas", "Oil"], "Wind won't run out. Coal, oil and natural gas are fossil fuels, which take millions of years to form.", "Renewable means it is replaced naturally and won't run out."],
  ["Fossil fuels formed from…", "The remains of plants and animals from millions of years ago", ["Volcanic rock", "Sea water", "Sand and clay"], "Dead plants and sea creatures were buried and squashed under heat and pressure for millions of years.", "Fossil = remains of living things."],
  ["Burning fossil fuels releases which greenhouse gas?", "Carbon dioxide", ["Oxygen", "Nitrogen", "Hydrogen"], "Fossil fuels contain carbon; burning them makes carbon dioxide, which traps heat in the atmosphere.", "Carbon in the fuel → carbon dioxide out."],
  ["Why are fossil fuels described as non-renewable?", "They take millions of years to form, so they will run out", ["They are too expensive", "They are dangerous", "They only work in winter"], "We use them far faster than they can form.", "Non-renewable = will run out."],
  ["Which is a disadvantage of solar power?", "It doesn't produce electricity at night", ["It releases carbon dioxide", "It will run out", "It causes acid rain"], "Solar panels need sunlight, so output drops at night and on cloudy days.", "Renewables are cleaner but often less reliable."],
  ["What does the nucleus of a cell do?", "Controls the cell and contains genetic material (DNA)", ["Makes energy by respiration", "Makes food by photosynthesis", "Lets substances in and out"], "The nucleus holds DNA and controls the cell's activities.", "Nucleus = control centre."],
  ["Where does aerobic respiration happen in a cell?", "Mitochondria", ["Nucleus", "Cell wall", "Vacuole"], "Mitochondria release energy from glucose using oxygen.", "Mitochondria = powerhouse."],
  ["Which word equation shows aerobic respiration?", "glucose + oxygen → carbon dioxide + water", ["carbon dioxide + water → glucose + oxygen", "glucose → lactic acid", "oxygen + water → glucose"], "Respiration uses glucose and oxygen and releases energy, carbon dioxide and water. The reverse is photosynthesis.", "Respiration is the reverse of photosynthesis."],
  ["Which part is found in plant cells but NOT animal cells?", "Cell wall", ["Nucleus", "Cell membrane", "Mitochondria"], "Plant cells have a cell wall, chloroplasts and a permanent vacuole; animal cells don't.", "Plant extras: wall, chloroplasts, vacuole."],
  ["In which state are particles closest together and only vibrate?", "Solid", ["Liquid", "Gas", "Plasma"], "Solid particles are packed in a regular pattern and vibrate in place.", "Solid: fixed. Liquid: slide past. Gas: far apart, fast."],
  ["What is an element?", "A substance made of only one type of atom", ["Two atoms bonded together", "A mixture of substances", "Any liquid"], "Elements are listed on the periodic table; each contains only one type of atom.", "Element = one type of atom; compound = different atoms bonded."],
  ["A solution with pH 2 is…", "Strongly acidic", ["Neutral", "Weakly alkaline", "Strongly alkaline"], "pH below 7 is acidic, and the lower the number, the stronger the acid. pH 7 is neutral.", "Low pH = acid, 7 = neutral, high = alkali."],
  ["What is the unit of force?", "Newton (N)", ["Joule (J)", "Watt (W)", "Kilogram (kg)"], "Force is measured in newtons. Joules measure energy, watts measure power.", "Force = newtons, energy = joules."],
  ["Which energy store does a stretched spring have?", "Elastic potential", ["Kinetic", "Chemical", "Thermal"], "Stretching or squashing something stores elastic potential energy.", "Stretch or squash = elastic."],
  ["Energy can't be created or destroyed. It can only be…", "Transferred or stored in different ways", ["Used up completely", "Turned into mass", "Lost forever"], "This is the law of conservation of energy. 'Wasted' energy is usually transferred as heat.", "Total energy stays the same."]
];
K.science = function () {
  var s = pick(SCIENCE), notes = {};
  s[2].forEach(function (w) { notes[w] = "“" + w + "” isn't right here. " + s[3]; });
  return q("Science", s[0], s[1], s[2], s[3], "", { notes: notes, tip: s[4], steps: null });
};

/* ===== Quiz builder ===== */
function dayLevel(today) {
  var start = new Date(WEEK.start + "T00:00:00");
  var d = Math.floor((today - start) / 86400000);
  return d <= 1 ? 1 : d <= 3 ? 2 : 3;
}
function genOne(child, gen, level) {
  if (String(gen).indexOf("ch:") === 0) return klistQ("challenge_" + child, gen.slice(3), level);
  if (String(gen).indexOf("en:") === 0) return klistQ("english", gen.slice(3), level);
  if (String(gen).indexOf("fr:") === 0) return klistQ("french", gen.slice(3), level);
  if (String(gen).indexOf("spell:") === 0) { var sp = M.spellWord(gen.slice(6), level); if (sp) sp.level = level; return sp; }
  var gens = child === "millie" ? M : K;
  for (var t = 0; t < 20; t++) {
    var item = gens[gen](level);
    if (item.options.length >= 2 && item.options.indexOf(item.answer) >= 0) { item.gen = gen; item.level = level; return item; }
  }
  return null;
}
function buildQuiz(child, level, count, seenPrompts, mode) {
  if (mode && mode.indexOf("revise:") === 0) return buildRevision(child, mode.slice(7), level, count, seenPrompts);
  if (mode === "spelling") return buildSpelling(level, count, seenPrompts);
  if (mode === "english" || mode === "french") return buildKList(mode, level, count, seenPrompts);
  if (mode === "challenge") return buildKList("challenge_" + child, level, count, seenPrompts);
  var topics = WEEK[child].topics, out = [], seen = {};
  (seenPrompts || []).forEach(function (p) { seen[p] = 1; });
  var order = shuffle(topics);
  var i = 0, guard = 0;
  while (out.length < count && guard++ < 300) {
    var t = order[i % order.length]; i++;
    if (i % order.length === 0) order = shuffle(topics);
    var item = genOne(child, t, level);
    if (!item || seen[item.prompt]) continue;
    seen[item.prompt] = 1;
    out.push(item);
  }
  return out;
}

/* ===== Millie's weekly spelling test ===== */
var SPELLING = {
  label: "Week 7 spellings: trickier homophones",
  words: [
    { word: "father", partner: "farther", meaning: "your dad", chunks: "fa · ther", tricky: "no 'r' after the 'a'",
      hook: "Father is your dad. Farther is the one with FAR in it, so father has no 'r' after the 'a'.",
      sentences: ["My ___ drove me to school today.", "Her ___ is teaching her to swim.", "Grandpa is my mum's ___."], wrongs: ["fathur", "fahter", "fathar"] },
    { word: "farther", partner: "father", meaning: "a greater distance away", chunks: "far · ther", tricky: "it starts with FAR",
      hook: "Farther is about distance, so it has FAR in it: far + ther.",
      sentences: ["Who can throw the ball ___, you or me?", "The beach is ___ away than the park.", "We walked ___ than we planned and got tired."], wrongs: ["farthur", "fartther", "farhter"] },
    { word: "guessed", partner: "guest", meaning: "made a guess (the past tense of guess)", chunks: "guess · ed", tricky: "keep the double 's', then add -ed",
      hook: "It's just GUESS with -ed on the end, so it keeps both s's: guess + ed.",
      sentences: ["She ___ the answer straight away.", "I ___ there were 50 sweets in the jar.", "Nobody ___ who was hiding behind the mask."], wrongs: ["guesed", "gessed", "guesst"] },
    { word: "guest", partner: "guessed", meaning: "a visitor invited to your home or an event", chunks: "gu · est", tricky: "the silent 'u' after the 'g'",
      hook: "Guest starts with G-U like guess, then just -est. A guest is a visitor.",
      sentences: ["We had a special ___ for dinner on Friday.", "The hotel ___ asked for extra towels.", "Each ___ at the party got a slice of cake."], wrongs: ["gest", "guesst", "gueste"] },
    { word: "heard", partner: "herd", meaning: "listened to (the past tense of hear)", chunks: "h · ear · d", tricky: "it has 'ear' in the middle",
      hook: "You HEAR with your EAR, so heard has 'ear' inside it: h-ear-d.",
      sentences: ["I ___ a loud bang outside.", "Have you ___ the new song?", "We ___ the birds singing early."], wrongs: ["hurd", "heared", "haerd"] },
    { word: "herd", partner: "heard", meaning: "a large group of animals, like cows or elephants", chunks: "h · er · d", tricky: "just four letters: h-e-r-d",
      hook: "A herd of animals is short and simple: 'her' + 'd'. No ear needed!",
      sentences: ["The ___ of cows walked slowly across the field.", "A ___ of elephants gathered at the waterhole.", "The farmer moved his ___ of goats up the hill."], wrongs: ["hurd", "herde", "hird"] },
    { word: "led", partner: "lead", meaning: "guided or went first (the past tense of lead)", chunks: "l · e · d", tricky: "only three letters",
      hook: "Yesterday I LED the way: the past tense is just three letters, l-e-d.",
      sentences: ["Yesterday, the captain ___ the team onto the pitch.", "Last week our teacher ___ us to the school hall.", "The guide ___ us through the jungle on our trip."], wrongs: ["ledd", "leed", "lede"] },
    { word: "lead", partner: "led", meaning: "a heavy grey metal (said like 'led')", chunks: "l · ea · d", tricky: "the 'ea' makes a short 'e' sound",
      hook: "The metal lead has 'ea' like the word 'heavy', and lead IS heavy!",
      sentences: ["Old water pipes were sometimes made of ___, a heavy metal.", "The fishing weight was made of ___.", "___ is a soft, heavy grey metal."], wrongs: ["ledd", "leade", "leed"] },
    { word: "mourning", partner: "morning", meaning: "feeling very sad after someone has died", chunks: "mourn · ing", tricky: "the 'u' after 'mo'",
      hook: "To MOURN is to be sad when someone dies; add -ing. The 'u' is for 'unhappy'.",
      sentences: ["The family were in ___ after their grandad died.", "She wore black because she was in ___.", "The village was in ___ after the old king died."], wrongs: ["mourneing", "mournning", "mournin"] },
    { word: "morning", partner: "mourning", meaning: "the early part of the day, before midday", chunks: "morn · ing", tricky: "no 'u' in it",
      hook: "Morning is the start of the day: m-o-r-n-i-n-g, no 'u' needed.",
      sentences: ["I eat my breakfast every ___.", "We have maths first thing in the ___.", "The ___ sun shone through my window."], wrongs: ["mornig", "morening", "mornin"] }
  ]
};
function spellEntry(w) {
  for (var i = 0; i < SPELLING.words.length; i++) if (SPELLING.words[i].word === w) return SPELLING.words[i];
  if (typeof SPELL_ARCHIVE !== "undefined") for (var j = 0; j < SPELL_ARCHIVE.length; j++) if (SPELL_ARCHIVE[j].word === w) return SPELL_ARCHIVE[j];
  return null;
}
function spellSteps(e) {
  return ["Say it slowly in chunks: " + e.chunks + ".", "Spot the tricky bit: " + e.tricky + ".", "Memory trick: " + e.hook,
    "Look, say, cover, write, check: write “" + e.word + "” three times without looking."];
}
function partnerNote(e) {
  var p = spellEntry(e.partner);
  return "“" + e.partner + "” sounds the same but means " + (p ? p.meaning : "something different") + ". This sentence needs “" + e.word + "”, which means " + e.meaning + ".";
}
/* Explain the difference between a typed attempt and the right spelling, letter by letter. */
function spellDiff(attempt, word) {
  var a = String(attempt || "").trim().toLowerCase(), b = word.toLowerCase();
  if (!a) return "You didn't type anything. Have a go next time, even if you're not sure!";
  var n = a.length, m = b.length, d = [], i, j;
  for (i = 0; i <= n; i++) { d.push([]); for (j = 0; j <= m; j++) d[i][j] = i === 0 ? j : j === 0 ? i : 0; }
  for (i = 1; i <= n; i++) for (j = 1; j <= m; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  var ops = []; i = n; j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1] && d[i][j] === d[i - 1][j - 1]) { i--; j--; continue; }
    if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + 1) { ops.unshift("You wrote '" + a[i - 1] + "' where it should be '" + b[j - 1] + "' (letter " + j + ")."); i--; j--; continue; }
    if (j > 0 && d[i][j] === d[i][j - 1] + 1) { ops.unshift("You missed out the '" + b[j - 1] + "'" + (j > 1 ? " after '" + b.slice(0, j - 1) + "'" : " at the start") + "."); j--; continue; }
    ops.unshift("There's an extra '" + a[i - 1] + "'" + (i > 1 ? " after '" + a.slice(0, i - 1) + "'" : " at the start") + " that doesn't belong."); i--;
  }
  if (ops.length > 3) return "That's quite different from “" + word + "”. Break it into chunks and build it up a bit at a time.";
  return "Nearly! " + ops.join(" ");
}
M.spellWord = function (w, level, kind) {
  var e = spellEntry(w); if (!e) return null;
  var p = spellEntry(e.partner), s = pick(e.sentences), gap = s.replace("___", "_____");
  var full = s.replace("___", e.word).replace(/^./, function (c) { return c.toUpperCase(); });
  var typeP = level === 1 ? 0.4 : level === 2 ? 0.6 : 0.75;
  kind = kind || "type"; /* spelling test: always type the word */
  var base = { topic: "Spelling", label: "Spelling: " + e.word, gen: "spell:" + e.word, steps: spellSteps(e), tip: e.hook, html: "", notes: {} };
  function done(o) { for (var k in base) if (o[k] === undefined) o[k] = base[k]; return o; }
  if (kind === "type") {
    var notes = {}; notes[e.partner] = partnerNote(e);
    return done({ type: "type", prompt: "Type the missing word.", sentence: gap, clue: "It means: " + e.meaning, speak: full,
      answer: e.word, options: [], notes: notes, explain: "The word is “" + e.word + "”: " + full });
  }
  if (kind === "choose") {
    var n1 = {}; n1[e.partner] = partnerNote(e); e.wrongs.forEach(function (x) { n1[x] = "“" + x + "” isn't a real spelling. " + e.hook; });
    return done(q("Spelling", "Choose the right word: “" + gap + "”", e.word, [e.partner].concat(e.wrongs.slice(0, 2)),
      "“" + e.word + "” means " + e.meaning + ", which fits this sentence.", "", { notes: n1, steps: spellSteps(e), tip: e.hook }));
  }
  if (kind === "meaning") {
    var others = shuffle(SPELLING.words.filter(function (x) { return x.word !== e.word && x.word !== e.partner; })).slice(0, 2);
    var n2 = {}; n2[e.partner] = "“" + e.partner + "” means " + (p ? p.meaning : "something else") + ". It sounds the same as “" + e.word + "”, which is the one meaning " + e.meaning + ".";
    others.forEach(function (o) { n2[o.word] = "“" + o.word + "” means " + o.meaning + "."; });
    return done(q("Spelling", "Which word means “" + e.meaning + "”?", e.word, [e.partner].concat(others.map(function (o) { return o.word; })),
      "“" + e.word + "” means " + e.meaning + ". Its sound-alike, “" + e.partner + "”, means " + (p ? p.meaning : "something else") + ".", "", { notes: n2, steps: spellSteps(e), tip: e.hook }));
  }
  if (kind === "spot") {
    var n3 = {}; e.wrongs.forEach(function (x) { n3[x] = spellDiff(x, e.word).replace(/^Nearly! /, "Not quite: ").replace(/You wrote/g, "It has").replace(/You missed out/g, "It's missing"); });
    return done(q("Spelling", "Which of these is spelled correctly? (It means " + e.meaning + ".)", e.word, e.wrongs,
      "“" + e.word + "” is the correct spelling. " + e.hook, "", { notes: n3, steps: spellSteps(e), tip: e.hook }));
  }
  /* fix: proofreading. Show the sentence with either the right word or its sound-alike. */
  var wrongShown = Math.random() < 0.6, shown = s.replace("___", wrongShown ? e.partner : e.word).replace(/^./, function (c) { return c.toUpperCase(); });
  var yes = "Yes, it's spelled right", no = "No, it should be “" + e.word + "”";
  var corr = wrongShown ? no : yes, n4 = {};
  n4[wrongShown ? yes : no] = wrongShown ? "Look again: “" + e.partner + "” means " + (p ? p.meaning : "something else") + ", but the sentence needs " + e.meaning + ", so it should be “" + e.word + "”." : "It was already right! “" + e.word + "” means " + e.meaning + ", which is what the sentence needs.";
  var swap = "No, it should be “" + e.partner + "”";
  n4[swap] = "“" + e.partner + "” means " + (p ? p.meaning : "something else") + ", which doesn't fit this sentence.";
  return done(q("Spelling", "Proofread it: is the homophone in this sentence spelled right?\n“" + shown + "”", corr, [wrongShown ? yes : no, swap, "Yes, and so is “" + e.wrongs[0] + "”"].filter(function (x) { return x !== corr; }),
    wrongShown ? "The sentence needs “" + e.word + "” (" + e.meaning + "), not “" + e.partner + "”." : "“" + e.word + "” is right: it means " + e.meaning + ".", "", { notes: n4, steps: spellSteps(e), tip: e.hook }));
};
function buildSpelling(level, count, seenPrompts) {
  var seen = {}; (seenPrompts || []).forEach(function (p) { seen[p] = 1; });
  var words = shuffle(SPELLING.words.map(function (x) { return x.word; })), out = [], guard = 0;
  while (out.length < count && guard++ < 100) {
    var w = words[out.length % words.length], item = M.spellWord(w, level);
    var key = item.type === "type" ? item.sentence : item.prompt;
    if (seen[key] && guard < 60) continue;
    seen[key] = 1; item.level = level; out.push(item);
  }
  return out;
}

/* ===== Kristan's spelling tests: English vocabulary and French vocab ===== */
var KLISTS = {
  english: {
    prefix: "en:", label: "Words to use in English writing", lang: "en-GB",
    words: [
      { word: "juxtaposition", meaning: "placing two very different things side by side to show the contrast", chunks: "jux · ta · po · si · tion", tricky: "starts 'jux' with an x; ends '-sition'",
        hook: "It's about the POSITION of two things: jux + ta + position.",
        sentences: ["The poet places light and dark side by side; this ___ makes the ending more shocking.", "The ___ of the cheerful wedding and the sad funeral shocked the audience."] },
      { word: "melancholy", meaning: "a deep, long-lasting sadness", chunks: "mel · an · chol · y", tricky: "'ch' sounds like k; it ends '-choly', not '-colly'",
        hook: "Melan + choly: the 'ch' is said like a k, as in 'choir'.",
        sentences: ["The knight's ___ mood is clear as he wanders ‘alone and palely loitering’.", "Rainy Sundays always make my grandad feel ___."] },
      { word: "foreshadowing", meaning: "hints early in a text about what will happen later", chunks: "fore · shad · ow · ing", tricky: "'fore' (meaning before) has an e",
        hook: "FORE means before: a SHADOW of what's coming, before it happens.",
        sentences: ["The dark clouds at the start are ___ of the tragedy to come.", "Good writers use ___ to drop hints about the ending."] },
      { word: "onomatopoeia", meaning: "a word that sounds like the noise it describes, like 'bang' or 'sizzle'", chunks: "on · o · mat · o · poe · ia", tricky: "'poe' in the middle, then '-ia'",
        hook: "On-o-mat-o-POE-ia: there's 'poe' in the middle, like in POEtry.",
        sentences: ["Words like ‘bang’, ‘crash’ and ‘sizzle’ are examples of ___.", "The ‘tlot-tlot’ of the horse's hooves in The Highwayman is ___."] },
      { word: "personification", meaning: "giving human feelings or actions to something that isn't human", chunks: "per · son · i · fi · ca · tion", tricky: "PERSON stays whole, then '-ification'",
        hook: "You turn a thing into a PERSON: person + ification.",
        sentences: ["Saying ‘the wind howled angrily’ is an example of ___.", "The poet uses ___ when the moon seems to be watching the inn."] },
      { word: "alliteration", meaning: "repeating the same first sound in words close together", chunks: "al · lit · er · a · tion", tricky: "double 'l' at the start, single 't'",
        hook: "ALL the words start the same: a-LL-iteration.",
        sentences: ["‘Big bad bear’ uses ___ because each word starts with ‘b’.", "‘Silent silver sea’ is an example of ___."] },
      { word: "ominous", meaning: "giving the feeling that something bad is going to happen", chunks: "om · in · ous", tricky: "'omin' (one m), then '-ous'",
        hook: "Think of an OMEN (a sign of bad luck): omin + ous.",
        sentences: ["The ___ silence before the storm made everyone nervous.", "The bare trees and silent lake create an ___ feeling in La Belle Dame sans Merci."] },
      { word: "desolate", meaning: "empty, bleak and lonely", chunks: "des · o · late", tricky: "one 's', and 'late' at the end",
        hook: "De-so-LATE: it's so late that everyone has gone home and it's empty.",
        sentences: ["The lake where ‘no birds sing’ is a cold and ___ place.", "After the floods, the village was empty and ___."] },
      { word: "consequence", meaning: "the result of an action, often a bad one", chunks: "con · se · quence", tricky: "'se' in the middle, ends '-quence'",
        hook: "Con-SE-quence: what you SEE happen after you act.",
        sentences: ["Lefty and Ned's crime has a terrible ___: they never escape the tunnel.", "Every choice you make has a ___."] },
      { word: "atmosphere", meaning: "the mood or feeling of a place or a piece of writing", chunks: "at · mo · sphere", tricky: "'ph' makes the f sound; ends 'sphere'",
        hook: "Atmo + SPHERE: like the sphere of air around a planet, it surrounds you.",
        sentences: ["The misty, moonlit road gives the poem a mysterious ___.", "The music and lights created an exciting ___ at the match."] },
      { word: "vivid", meaning: "very bright and clear, so you can easily picture it", chunks: "viv · id", tricky: "v-i-v-i-d: two v's and two i's",
        hook: "Two v's, two i's, one d: VIVID is a palindrome without the last v!",
        sentences: ["The poet uses ___ imagery so we can picture the scene clearly.", "I had such a ___ dream that it felt real."] },
      { word: "emphasise", meaning: "to give extra importance to something", chunks: "em · pha · sise", tricky: "'ph' for the f sound; British spelling ends '-ise'",
        hook: "Em-PH-a-SISE: 'ph' like in phone, and British English ends with -ise.",
        sentences: ["The poet repeats the word ‘riding’ to ___ the speed of the horse.", "Use a short sentence to ___ an important point."] },
      { word: "connotation", meaning: "an extra idea or feeling a word suggests, beyond its basic meaning", chunks: "con · no · ta · tion", tricky: "double 'n' in the middle",
        hook: "CON + NOTATION: an extra note a word carries, with double n.",
        sentences: ["The colour ‘blood-red’ has a ___ of danger and violence.", "The word ‘home’ has a warm ___ of safety and family."] },
      { word: "rhythm", meaning: "a regular, repeated pattern of beats or sounds", chunks: "rh · y · thm", tricky: "no vowels except y: r-h-y-t-h-m",
        hook: "Rhythm Helps Your Two Hips Move: R-H-Y-T-H-M.",
        sentences: ["The galloping ___ of The Highwayman sounds like a horse running.", "Clap along to the ___ of the song."] }
    ]
  },
  french: {
    prefix: "fr:", label: "French vocab quiz, Monday 2 Nov", lang: "fr-FR",
    words: [
      { id: "manger", word: "manger", group: "Verbs", say: "manger", gap: "To eat = _____", meaning: "to eat", hook: "Animals eat from a manger: man-ger." },
      { id: "faire", word: "faire", group: "Verbs", say: "faire", gap: "To do / to make = _____", meaning: "to do, to make", hook: "Fai-re: 'ai' then an 'e' on the end." },
      { id: "danser", word: "danser", group: "Verbs", say: "danser", gap: "To dance = _____", meaning: "to dance", hook: "French uses an S: dan-S-er, not 'dancer' (that's a person who dances)." },
      { id: "regarder", word: "regarder", group: "Verbs", say: "regarder", gap: "To watch = _____", meaning: "to watch", hook: "Like the English word 'regard' (to look at) + er." },
      { id: "sortir", word: "sortir", group: "Verbs", say: "sortir", gap: "To go out = _____", meaning: "to go out", hook: "Sort + ir: an -ir verb, not -er." },
      { id: "jouer", word: "jouer", group: "Verbs", say: "jouer", gap: "To play = _____", meaning: "to play", hook: "J-OU-er: 'ou' makes the 'oo' sound in French." },
      { id: "rester", word: "rester", group: "Verbs", say: "rester", gap: "To stay = _____", meaning: "to stay", hook: "When you stay, you REST: rest + er." },
      { id: "avoir", word: "avoir", group: "Verbs", say: "avoir", gap: "To have = _____", meaning: "to have", hook: "A + voir (voir means to see): a-voir." },
      { id: "aller", word: "aller", group: "Verbs", say: "aller", gap: "To go = _____", meaning: "to go", hook: "Double l: a-LL-er." },
      { id: "vais", word: "vais", group: "aller", say: "je vais", gap: "je _____", meaning: "I go / I am going", hook: "Je vais ends in -ais, with a silent s." },
      { id: "vas", word: "vas", group: "aller", say: "tu vas", gap: "tu _____", meaning: "you go / you are going (one person)", hook: "Tu forms nearly always end in -s: tu vas." },
      { id: "va", word: "va", group: "aller", say: "il va", gap: "il / elle / on _____", meaning: "he / she / one goes", hook: "Il va: just two letters, v-a." },
      { id: "allons", word: "allons", group: "aller", say: "nous allons", gap: "nous _____", meaning: "we go / we are going", hook: "Nous forms end in -ons: all-ons." },
      { id: "allez", word: "allez", group: "aller", say: "vous allez", gap: "vous _____", meaning: "you go (plural or polite)", hook: "Vous forms end in -ez: all-ez." },
      { id: "vont", word: "vont", group: "aller", say: "ils vont", gap: "ils / elles _____", meaning: "they go / they are going", hook: "Ils vont is irregular: it ends -ont, like ils sont and ils font." },
      { id: "poste", word: "poste", group: "Instagram", say: "Je poste des messages à mes copains.", gap: "Je _____ des messages à mes copains.", meaning: "I post messages to my friends", hook: "Poster → je poste: with je, -er verbs end in -e." },
      { id: "modifie", word: "modifie", group: "Instagram", say: "Je modifie mes préférences.", gap: "Je _____ mes préférences.", meaning: "I update my likes", hook: "Modifier → je modifie: it ends -ie." },
      { id: "regarde", word: "regarde", group: "Instagram", say: "Je regarde les photos de mes copains.", gap: "Je _____ les photos de mes copains.", meaning: "I look at my friends' photos", hook: "Regarder → je regarde: drop the -r." },
      { id: "commente", word: "commente", group: "Instagram", say: "Je commente des photos.", gap: "Je _____ des photos.", meaning: "I comment on photos", hook: "Double m, like English 'comment': co-MM-ente." },
      { id: "invite", word: "invite", group: "Instagram", say: "J'invite mes copains à sortir.", gap: "J’_____ mes copains à sortir.", meaning: "I invite my friends out", hook: "Inviter → j'invite: the same as the English word." },
      { id: "fais", word: "fais", group: "Instagram", say: "Je fais des quiz.", gap: "Je _____ des quiz.", meaning: "I do quizzes", hook: "Faire is irregular: je fais ends -ais, like je vais." },
      { id: "copains", word: "copains", group: "Instagram", say: "Je poste des messages à mes copains.", gap: "Je poste des messages à mes _____.", meaning: "my friends", hook: "Copain = friend (a boy or a mixed group); add a silent -s for more than one." },
      { id: "preferences", word: "préférences", group: "Instagram", say: "Je modifie mes préférences.", gap: "Je modifie mes _____.", meaning: "my likes / my preferences", hook: "Two acute accents: pr-É-f-É-rences." }
    ]
  }
};

/* ===== Challenge words: extremely hard spellings, one list per child ===== */
KLISTS.challenge_millie = {
  prefix: "ch:", label: "Challenge words: extremely hard spellings", lang: "en-GB",
  words: [
    { word: "accommodate", meaning: "to have enough room for someone, or to help them", chunks: "ac · com · mo · date", tricky: "double c AND double m",
      hook: "It's big enough to fit two c's and two m's: a-CC-o-MM-odate.", sentences: ["The hotel can ___ up to 200 guests.", "Our car is big enough to ___ the whole family."] },
    { word: "embarrass", meaning: "to make someone feel awkward or ashamed", chunks: "em · bar · rass", tricky: "double r AND double s",
      hook: "Really Red, So Shy: double r, double s.", sentences: ["Please don't ___ me in front of my friends!", "Tripping over on stage would really ___ me."] },
    { word: "necessary", meaning: "needed; something you must have or do", chunks: "ne · ces · sa · ry", tricky: "one c, two s's",
      hook: "A shirt has one Collar and two Sleeves: one c, two s's.", sentences: ["Is it ___ to bring a coat today?", "Water is ___ for all living things."] },
    { word: "mischievous", meaning: "naughty in a playful way", chunks: "mis · chie · vous", tricky: "it ends -vous, NOT -vious, and 'ie' in the middle",
      hook: "There's a CHIEf in the middle: mis-CHIE-vous, with no extra i at the end.", sentences: ["The ___ kitten knocked the cup off the table.", "My little cousin gave a ___ grin before hiding my shoes."] },
    { word: "conscience", meaning: "the voice inside you that tells you right from wrong", chunks: "con · science", tricky: "the word SCIENCE is hiding inside",
      hook: "Con + SCIENCE: your brain's science of right and wrong.", sentences: ["My ___ told me to own up about the broken vase.", "He had a guilty ___ after eating the last biscuit."] },
    { word: "rhythm", meaning: "a regular pattern of beats or sounds", chunks: "rh · y · thm", tricky: "no a, e, i, o or u: r-h-y-t-h-m",
      hook: "Rhythm Helps Your Two Hips Move: R-H-Y-T-H-M.", sentences: ["We clapped to the ___ of the drum.", "The poem has a bouncy ___ like a galloping horse."] },
    { word: "definitely", meaning: "certainly; for sure", chunks: "de · fi · nite · ly", tricky: "it's 'finite' in the middle, never 'finate'",
      hook: "There's FINITE inside: de-FINITE-ly.", sentences: ["I will ___ come to your party.", "That was ___ the best film I've ever seen."] },
    { word: "separate", meaning: "to split apart, or not joined together", chunks: "sep · a · rate", tricky: "'par' in the middle, not 'per'",
      hook: "There's A RAT in sep-A-RAT-e.", sentences: ["Please keep the paints ___ from the brushes.", "The teacher had to ___ the two chatty friends."] },
    { word: "queue", meaning: "a line of people waiting their turn", chunks: "q · ue · ue", tricky: "q, then 'ue' twice",
      hook: "Q, then U-E, then U-E again: the letters wait in a queue too!", sentences: ["We waited in a long ___ for the roller coaster.", "Please join the back of the ___ for lunch."] },
    { word: "privilege", meaning: "a special right or advantage", chunks: "priv · i · lege", tricky: "no d (not 'ledge'), and two i's",
      hook: "Privi-LEGE: it's no LEDGE, so there's no d.", sentences: ["It was a ___ to meet the astronaut.", "Being team captain is a real ___."] },
    { word: "sincerely", meaning: "truly and honestly", chunks: "sin · cere · ly", tricky: "keep the e of 'sincere' before -ly",
      hook: "Sincere + ly: never drop the e.", sentences: ["I am ___ sorry for being late.", "She ___ thanked everyone who helped."] },
    { word: "vehicle", meaning: "something used to carry people or things, like a car or bus", chunks: "ve · hi · cle", tricky: "the silent h",
      hook: "There's a silent H hiding in a ve-H-icle.", sentences: ["A rocket is a ___ that travels into space.", "The fire engine is a very large ___."] },
    { word: "guarantee", meaning: "a promise that something will definitely happen", chunks: "guar · an · tee", tricky: "'gua' at the start and double e at the end",
      hook: "A GUARd promises: guar + an + tee.", sentences: ["I can't ___ it won't rain tomorrow.", "The new toy comes with a one-year ___."] },
    { word: "occasionally", meaning: "sometimes, but not often", chunks: "oc · ca · sion · al · ly", tricky: "double c, single s, double l",
      hook: "Occasion + ally: two c's, one s, two l's.", sentences: ["We ___ have pancakes for breakfast.", "It ___ snows in the mountains here."] },
    { word: "February", meaning: "the second month of the year", chunks: "Feb · ru · ar · y", tricky: "the 'r' after 'Feb' that people forget to say",
      hook: "Say it the funny way: Feb-RU-ary. It starts with a capital F.", sentences: ["My birthday is in ___, the shortest month.", "Valentine's Day is in ___."] },
    { word: "Wednesday", meaning: "the day after Tuesday", chunks: "Wed · nes · day", tricky: "the silent d in 'Wed'",
      hook: "Say it in your head as Wed-NES-day. It starts with a capital W.", sentences: ["We have swimming every ___.", "The middle of the school week is ___."] }
  ]
};
KLISTS.challenge_kristan = {
  prefix: "ch:", label: "Challenge words: extremely hard spellings", lang: "en-GB",
  words: [
    { word: "conscientious", meaning: "careful, hard-working and wanting to do things properly", chunks: "con · sci · en · tious", tricky: "SCIENCE is inside, then -tious",
      hook: "Con + SCIEN(ce) + tious: a conscientious scientist checks everything.", sentences: ["A ___ student always checks their work twice.", "She was so ___ that she finished her project early."] },
    { word: "entrepreneur", meaning: "someone who starts and runs their own business", chunks: "en · tre · pre · neur", tricky: "the French ending -neur",
      hook: "Entre + pre + neur: three chunks, and each of the first two ends in 're'.", sentences: ["The young ___ sold her app for millions.", "As an ___, he took a big risk opening his café."] },
    { word: "bureaucracy", meaning: "a system of complicated rules and paperwork run by officials", chunks: "bu · reau · cra · cy", tricky: "'reau' from French, and it ends -cracy",
      hook: "BUREAU (French for office) + CRACY (rule, like democracy).", sentences: ["Getting a passport involved a lot of ___.", "The new club was slowed down by layers of ___."] },
    { word: "idiosyncrasy", meaning: "an unusual habit or way of behaving that belongs to one person", chunks: "id · i · o · syn · cra · sy", tricky: "it ends -crasy (with an s), unlike democracy",
      hook: "Idio + SYN + craSy: the odd one out ends in -sy.", sentences: ["Wearing odd socks every day is his favourite ___.", "Every famous artist seems to have at least one ___."] },
    { word: "liaison", meaning: "communication and cooperation between groups, or the person who links them", chunks: "li · ai · son", tricky: "two i's either side of the a",
      hook: "L-I-A-I-SON: the a is guarded by an i on each side.", sentences: ["The teacher acts as a ___ between parents and the head.", "Good ___ between the two teams helped them win."] },
    { word: "millennium", meaning: "a period of one thousand years", chunks: "mil · len · ni · um", tricky: "double l AND double n",
      hook: "A thousand years is so long it needs two l's and two n's: mi-LL-e-NN-ium.", sentences: ["The year 2000 marked the start of a new ___.", "The castle has stood for almost a ___."] },
    { word: "questionnaire", meaning: "a set of written questions used to collect information", chunks: "ques · tion · naire", tricky: "double n, then -aire",
      hook: "Question + NAIRE: keep the n of question and add another.", sentences: ["Please fill in the ___ about school lunches.", "The survey team handed out a ___ to every family."] },
    { word: "surveillance", meaning: "close watching of a person or place, often using cameras", chunks: "sur · veil · lance", tricky: "'veil' in the middle, then -lance",
      hook: "Sur + VEIL + LANCE: watching from behind a veil.", sentences: ["The shop uses CCTV ___ to stop thieves.", "The spy was under ___ for weeks."] },
    { word: "supersede", meaning: "to take the place of something older", chunks: "su · per · sede", tricky: "ends -sede: the only English word that does",
      hook: "SUPER + SEDE: the only word ending -sede (not -cede).", sentences: ["New phones quickly ___ last year's models.", "Electric cars may one day ___ petrol cars."] },
    { word: "silhouette", meaning: "a dark outline of something against a light background", chunks: "sil · hou · ette", tricky: "the silent h and the French ending -ette",
      hook: "Sil + HOU + ette: a silent h hides in the shadow.", sentences: ["We could see the ___ of a tree against the sunset.", "The ___ of the castle stood out against the sky."] },
    { word: "manoeuvre", meaning: "a skilful or careful movement", chunks: "man · oeu · vre", tricky: "British spelling: 'oeu' in the middle and -vre at the end",
      hook: "Man + OEU + vre: three vowels together, o-e-u.", sentences: ["The pilot made a tricky ___ to avoid the storm.", "Parallel parking is a hard ___ for new drivers."] },
    { word: "connoisseur", meaning: "an expert who can judge the quality of something, like food or art", chunks: "con · nois · seur", tricky: "double n, double s, and -eur",
      hook: "CONN + OISS + EUR: doubles twice, then a French ending.", sentences: ["A ___ of cheese can taste the difference straight away.", "He's a real ___ of classic football boots."] },
    { word: "hierarchy", meaning: "a system where people or things are ranked one above another", chunks: "hi · er · ar · chy", tricky: "'ie' at the start, then -archy",
      hook: "HIER + ARCHY (archy means rule, like monarchy).", sentences: ["In a football club's ___, the manager is above the coaches.", "Lions sit at the top of the food ___."] },
    { word: "mnemonic", meaning: "a trick to help you remember something", chunks: "m · ne · mon · ic", tricky: "the silent m at the start",
      hook: "A mnemonic starts with a silent M to help you reMember.", sentences: ["‘Rhythm Helps Your Two Hips Move’ is a ___.", "I used a ___ to learn the order of the planets."] },
    { word: "pharaoh", meaning: "a ruler of ancient Egypt", chunks: "pha · ra · oh", tricky: "it ends -aoh: 'a' then 'oh'",
      hook: "Ph + ara + OH: you'd say 'oh!' if you met one.", sentences: ["Tutankhamun was a young ___ of Egypt.", "The ___ was buried with gold and treasure."] },
    { word: "miscellaneous", meaning: "of many different kinds; mixed together", chunks: "mis · cel · la · ne · ous", tricky: "'sc' together, double l, and -aneous",
      hook: "MISC (short for it!) + ELL + ANEOUS.", sentences: ["The drawer was full of ___ cables and chargers.", "The last box was labelled ‘___ odds and ends’."] }
  ]
};

function stripAccents(s) { return String(s).normalize("NFD").replace(/[̀-ͯ]/g, ""); }
function klistEntry(mode, id) {
  var L = KLISTS[mode], pool = L.words.concat(L.archive || []);
  for (var i = 0; i < pool.length; i++) if ((pool[i].id || pool[i].word) === id) return pool[i];
  return null;
}
function klistQ(mode, id, level) {
  var L = KLISTS[mode], e = klistEntry(mode, id); if (!e) return null;
  var steps, sentence, clue, speak, explain, tip = e.hook;
  if (L.lang !== "fr-FR") {
    var s = pick(e.sentences);
    sentence = s.replace("___", "_____"); clue = "It means: " + e.meaning;
    speak = s.replace("___", e.word);
    explain = "“" + e.word + "” means " + e.meaning + ".";
    steps = ["Say it slowly in chunks: " + e.chunks + ".", "Spot the tricky bit: " + e.tricky + ".", "Memory trick: " + e.hook,
      "Use it: write your own sentence about one of the anthology poems using “" + e.word + "”."];
  } else {
    sentence = e.gap; clue = e.group === "Verbs" ? "Write the infinitive (the \u2018to\u2026\u2019 form) in French." : "In English: " + e.meaning; speak = e.say;
    explain = "“" + e.word + "”: " + e.gap.replace("_____", e.word) + " (" + e.meaning + ").";
    steps = ["Say it out loud in French (tap Hear it).", "Memory trick: " + e.hook,
      e.group === "aller" ? "Learn aller as a chant: je vais, tu vas, il va, nous allons, vous allez, ils vont." : e.group === "Verbs" ? "Cover the French side of the list, say the English, and write the French from memory." : "Cover the French, read the English sentence, and write the whole French sentence from memory.",
      "Look, say, cover, write, check: write “" + e.word + "” three times without looking."];
  }
  var ch = mode.indexOf("challenge") === 0;
  return { type: "type", lang: L.lang, topic: ch ? "Challenge spelling" : mode === "english" ? "English vocabulary" : "French vocab", label: (ch ? "Challenge: " : mode === "english" ? "English: " : "French: ") + e.word,
    gen: L.prefix + (e.id || e.word), prompt: L.lang !== "fr-FR" ? "Type the missing word." : "Write it in French.", sentence: sentence, clue: clue, speak: speak,
    answer: e.word, options: [], notes: {}, explain: explain, steps: steps, tip: tip, html: "", level: level };
}
function buildKList(mode, level, count, seenPrompts) {
  var L = KLISTS[mode], ids = L.words.map(function (w) { return w.id || w.word; }), out;
  if (mode === "french") {
    /* a balanced mix: verbs, aller, and the Instagram phrases */
    var by = {}; L.words.forEach(function (w) { (by[w.group] = by[w.group] || []).push(w.id); });
    var want = { "Verbs": 4, "aller": 3, "Instagram": 3 };
    out = []; Object.keys(want).forEach(function (g) { shuffle(by[g]).slice(0, want[g]).forEach(function (id) { out.push(id); }); });
    ids = shuffle(out);
  } else ids = shuffle(ids);
  return ids.slice(0, count).map(function (id) { return klistQ(mode, id, level); });
}
/* Explain a wrong typed answer: accents first, then letter by letter. */
function typedNote(attempt, word) {
  var a = String(attempt || "").trim().toLowerCase().replace(/’/g, "'"), w = word.toLowerCase();
  if (a && a !== w && stripAccents(a) === stripAccents(w)) {
    var miss = []; for (var i = 0; i < w.length; i++) if (a[i] !== w[i]) miss.push(w[i]);
    return "So close! The letters are right, but check the accents: you need “" + miss.join("” and “") + "”. In French, accents are part of the spelling.";
  }
  return spellDiff(attempt, word);
}


/* ===== Revision library: every topic covered so far. Topics are only ever ADDED, never removed. ===== */
var SPELL_ARCHIVE = []; /* past weeks' spelling entries, so old spell:<word> questions keep working */
var REVISION = {
  millie: [
    { id: "factors", title: "Factors & factor pairs", subject: "Maths", covered: "Week 7 homework · 26 Oct", gens: ["factorOf", "countFactors", "factorPair", "commonFactor"] },
    { id: "multiples", title: "Multiples & lowest common multiple", subject: "Maths", covered: "Week 7 homework · 26 Oct", gens: ["multipleOf", "lcm"] },
    { id: "primes", title: "Prime numbers", subject: "Maths", covered: "Week 7 homework · 26 Oct", gens: ["prime"] },
    { id: "tables", title: "Times tables", subject: "Maths", covered: "Every week (TT Rockstars)", gens: ["tables"] },
    { id: "roman", title: "Roman numerals", subject: "Maths", covered: "CENTURY · Year 5", gens: ["roman"] },
    { id: "decimals", title: "Decimals & rounding", subject: "Maths", covered: "CENTURY · Year 5", gens: ["decimals"] },
    { id: "space", title: "Our Solar System", subject: "Science & theme", covered: "Week 7 homework · 26 Oct", gens: ["space"] },
    { id: "spell-w7", title: "Week 7 spellings: trickier homophones", subject: "Spelling", covered: "Week 7 homework · 26 Oct",
      gens: ["spell:father", "spell:farther", "spell:guessed", "spell:guest", "spell:heard", "spell:herd", "spell:led", "spell:lead", "spell:mourning", "spell:morning"] },
    { id: "homophone-mix", title: "Homophones in sentences", subject: "Spelling", covered: "Week 7 homework · 26 Oct", gens: ["homophone"] }
  ],
  kristan: [
    { id: "averages", title: "Mean, median, mode & range", subject: "Maths", covered: "Dr Frost homework · due 28 Oct", gens: ["meanList", "medianList", "modeRange", "missingMean", "bestAverage"] },
    { id: "freq", title: "Averages from frequency tables", subject: "Maths", covered: "Dr Frost homework · due 28 Oct", gens: ["freqMode", "freqMean", "freqMedian"] },
    { id: "equations", title: "Solving equations", subject: "Maths", covered: "CENTURY · school learning", gens: ["solveEq"] },
    { id: "algebra", title: "Simplifying expressions", subject: "Maths", covered: "CENTURY · school learning", gens: ["simplify", "commutative"] },
    { id: "sequences", title: "Sequences & the nth term", subject: "Maths", covered: "CENTURY · school learning", gens: ["nthTerm"] },
    { id: "ratio", title: "Ratio", subject: "Maths", covered: "CENTURY · school learning", gens: ["ratioSimplify", "ratioShare"] },
    { id: "rounding", title: "Rounding & estimation", subject: "Maths", covered: "CENTURY · school learning", gens: ["round1sf", "estimate"] },
    { id: "angles", title: "Angles in parallel lines", subject: "Maths", covered: "CENTURY · school learning", gens: ["angles"] },
    { id: "probability", title: "Probability", subject: "Maths", covered: "CENTURY · school learning", gens: ["probability"] },
    { id: "indices", title: "Indices & negative numbers", subject: "Maths", covered: "CENTURY · school learning", gens: ["indices", "negatives"] },
    { id: "poetry", title: "Y8 poetry anthology & PEACEAL", subject: "English", covered: "Assessment prep · 28 Oct", gens: ["poetry"] },
    { id: "eng-words", title: "Words for your writing", subject: "English", covered: "Spelling list · 26 Oct",
      gens: ["en:juxtaposition", "en:melancholy", "en:foreshadowing", "en:onomatopoeia", "en:personification", "en:alliteration", "en:ominous", "en:desolate", "en:consequence", "en:atmosphere", "en:vivid", "en:emphasise", "en:connotation", "en:rhythm"] },
    { id: "fr-insta", title: "French: Instagram, aller & activity verbs", subject: "French", covered: "Vocab quiz · 2 Nov",
      gens: ["fr:manger", "fr:faire", "fr:danser", "fr:regarder", "fr:sortir", "fr:jouer", "fr:rester", "fr:avoir", "fr:aller", "fr:vais", "fr:vas", "fr:va", "fr:allons", "fr:allez", "fr:vont", "fr:poste", "fr:modifie", "fr:regarde", "fr:commente", "fr:invite", "fr:fais", "fr:copains", "fr:preferences"] },
    { id: "science", title: "KS3 science: energy, cells & materials", subject: "Science", covered: "CENTURY · school learning", gens: ["science"] }
  ]
};
function revTopic(child, id) { var L = REVISION[child]; for (var i = 0; i < L.length; i++) if (L[i].id === id) return L[i]; return null; }
function buildRevision(child, topicId, level, count, seenPrompts) {
  var t = revTopic(child, topicId); if (!t) return [];
  var seen = {}; (seenPrompts || []).forEach(function (p) { seen[p] = 1; });
  var out = [], levels = [level].concat([1, 2, 3].filter(function (l) { return l !== level; }));
  levels.forEach(function (lv, li) {
    var guard = 0, order = shuffle(t.gens), i = 0;
    while (out.length < count && guard++ < (li ? 150 : 300)) {
      var g = order[i % order.length]; i++;
      if (i % order.length === 0) order = shuffle(t.gens);
      var item = genOne(child, g, lv);
      if (!item) continue;
      var key = item.type === "type" ? item.sentence : item.prompt + "|" + item.answer;
      if (seen[key] || seen[item.prompt + "|" + item.answer] || (item.type === "type" && out.some(function (o) { return o.gen === item.gen; }))) continue;
      seen[key] = 1; item.level = level; out.push(item);
    }
  });
  return shuffle(out);
}

if (typeof module !== "undefined") module.exports = { buildQuiz: buildQuiz, genOne: genOne, REVISION: REVISION, buildRevision: buildRevision, KLISTS: KLISTS, typedNote: typedNote, buildSpelling: buildSpelling, spellDiff: spellDiff, SPELLING: SPELLING, M: M, K: K, WEEK: WEEK, dayLevel: dayLevel };
