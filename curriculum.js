/* Curriculum map and the question sets that cover it.
   Millie: Year 5 (school curriculum overview + Term 1 guide). Kristan: Year 8 curriculum overview.
   Statuses ("done", "now", "next", "later") are updated by the school run each week. */

/* ===================== Millie · Year 5 ===================== */
function bq(topic, bank, tip) { var s = pick(bank); return q(topic, s[0], s[1], s[2], s[3], "", { notes: s[4] || {}, tip: tip || null, steps: s[5] || null }); }

/* --- Maths: squares and cubes --- */
M.squareCube = function (L) {
  var kind = L === 1 ? "sq" : pick(["sq", "cube", L === 3 ? "spot" : "cube"]);
  if (kind === "sq") {
    var n = L === 1 ? rnd(2, 10) : rnd(6, 12), a = n * n, notes = {};
    notes[n * 2] = "That's " + n + " × 2. Squared means " + n + " × " + n + ".";
    notes[n + n * n - n + 1] = "Nearly. Check " + n + " × " + n + " again.";
    return q("Square & cube numbers", "What is " + n + "²?", a, [n * 2, a + n, a - n, n * 3], n + "² means " + n + " × " + n + " = " + a + ".", "",
      { notes: notes, steps: ["The little 2 means 'squared': multiply the number by itself.", n + " × " + n + " = " + a + "."], tip: "Squared ² = two of the number multiplied. Cubed ³ = three of them." });
  }
  if (kind === "cube") {
    var m = rnd(2, L === 3 ? 6 : 5), c = m * m * m, n2 = {};
    n2[m * 3] = "That's " + m + " × 3. Cubed means " + m + " × " + m + " × " + m + ".";
    n2[m * m] = "That's " + m + " squared. Cubed needs one more × " + m + ".";
    return q("Square & cube numbers", "What is " + m + "³?", c, [m * 3, m * m, c + m, c - m], m + "³ = " + m + " × " + m + " × " + m + " = " + (m * m) + " × " + m + " = " + c + ".", "",
      { notes: n2, steps: [m + " × " + m + " = " + (m * m) + ".", (m * m) + " × " + m + " = " + c + "."], tip: "Cubed ³ = multiply three of the number: 2³ = 2 × 2 × 2 = 8." });
  }
  var sqs = [16, 25, 36, 49, 64, 81, 100, 121, 144], pickSq = pick(sqs), others = shuffle([18, 24, 30, 40, 45, 50, 60, 72, 90, 20, 32]).slice(0, 3);
  return q("Square & cube numbers", "Which of these is a square number?", pickSq, others,
    pickSq + " = " + Math.sqrt(pickSq) + " × " + Math.sqrt(pickSq) + ", so it's a square number.", "",
    { steps: ["A square number is a number times itself.", "Test each: " + pickSq + " = " + Math.sqrt(pickSq) + " × " + Math.sqrt(pickSq) + "."], tip: "Learn the squares to 12 × 12: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144." });
};

/* --- Maths: multiply and divide by 10, 100 and 1000 --- */
M.mulDiv10 = function (L) {
  var p = pick(L === 1 ? [10, 100] : [10, 100, 1000]), div = Math.random() < 0.5;
  var base = L === 1 ? rnd(3, 99) : L === 2 ? pick([rnd(12, 999), rnd(1, 99) / 10]) : pick([rnd(1, 999) / 10, rnd(1, 999) / 100, rnd(1001, 9999)]);
  var ans = div ? base / p : base * p;
  var clean = function (x) { return String(Math.round(x * 100000) / 100000); };
  var wrongs = [div ? base * p : base / p, div ? base / (p * 10) : base * p * 10, div ? base / (p / 10) : base * (p / 10)].map(clean);
  var notes = {}; notes[wrongs[0]] = div ? "You multiplied. Dividing makes the number SMALLER." : "You divided. Multiplying makes the number BIGGER.";
  notes[wrongs[1]] = "That's one place too far. " + p + " has " + (String(p).length - 1) + " zero(s), so the digits move " + (String(p).length - 1) + " place(s).";
  notes[wrongs[2]] = "One place short. The digits move " + (String(p).length - 1) + " places for " + p + ".";
  var z = String(p).length - 1;
  return q("× and ÷ by 10, 100, 1000", nf(base) + (div ? " ÷ " : " × ") + nf(p) + " = ?", clean(ans), wrongs,
    "Each digit moves " + z + " place" + (z > 1 ? "s" : "") + (div ? " to the right (smaller)" : " to the left (bigger)") + ": " + nf(base) + (div ? " ÷ " : " × ") + nf(p) + " = " + clean(ans) + ".", "",
    { notes: notes, steps: [nf(p) + " has " + z + " zero" + (z > 1 ? "s" : "") + ", so the digits move " + z + " place" + (z > 1 ? "s" : "") + ".", (div ? "Dividing: digits move right, the number gets smaller." : "Multiplying: digits move left, the number gets bigger."), "Answer: " + clean(ans) + "."], tip: "The digits move, not the decimal point: × moves them left, ÷ moves them right." });
};

/* --- Maths: formal multiplication --- */
M.multiply = function (L) {
  var a, b;
  if (L === 3) { a = rnd(23, 99); b = rnd(12, 39); } else if (L === 2) { a = rnd(1000, 4999); b = rnd(3, 9); } else { a = rnd(112, 999); b = rnd(2, 6); }
  var ans = a * b, notes = {};
  var noCarry = String(a).split("").map(function (d) { return (+d * b) % 10; }).join("");
  notes[noCarry] = "Looks like the carried digits were missed. Write the carry under the next column and add it on.";
  if (L === 3) { var t = a * (b % 10); notes[t] = "That's only " + a + " × " + (b % 10) + ". Long multiplication also needs " + a + " × " + (b - b % 10) + ", then add the two rows."; }
  return q("Multiplication", a + " × " + b + " = ?", ans, [noCarry, L === 3 ? a * (b % 10) : ans + 10 * b, ans - b, ans + a].filter(function (x) { return String(x) !== String(ans); }),
    a + " × " + b + " = " + nf(ans) + ".", "",
    { notes: notes, steps: L === 3 ? [a + " × " + (b % 10) + " = " + a * (b % 10) + ".", a + " × " + (b - b % 10) + " = " + a * (b - b % 10) + ".", "Add the rows: " + a * (b % 10) + " + " + a * (b - b % 10) + " = " + ans + "."]
      : ["Multiply each digit by " + b + ", starting with the ones.", "Carry any tens into the next column.", "Answer: " + nf(ans) + "."], tip: "Estimate first: round, multiply, and check your answer is close." });
};

/* --- Maths: short division with remainders --- */
M.shortDiv = function (L) {
  var d = rnd(3, 9), qn = L === 1 ? rnd(12, 99) : rnd(120, 999), r = L === 1 ? 0 : rnd(1, d - 1), n = d * qn + r;
  var ans = r ? qn + " r" + r : String(qn), notes = {};
  notes[(qn + 1) + (r ? " r" + r : "")] = "One too many. Check each step of the bus stop.";
  notes[r ? qn + " r" + (r + d > 9 ? r : r + 1) : String(qn - 1)] = "Close. Recheck the last division.";
  notes[r ? String(qn) : qn + " r1"] = r ? "Don't forget the remainder: " + d + " × " + qn + " = " + d * qn + ", and " + n + " − " + d * qn + " = " + r + "." : "It divides exactly: no remainder.";
  return q("Short division", nf(n) + " ÷ " + d + " = ?", ans, Object.keys(notes),
    nf(n) + " ÷ " + d + " = " + ans + (r ? " (because " + d + " × " + qn + " = " + d * qn + ", with " + r + " left over)" : "") + ".", "",
    { notes: notes, steps: ["Set it out as a bus stop: " + d + " outside, " + n + " inside.", "Divide each digit from the left, carrying remainders to the next digit.", "Answer: " + ans + "."], tip: "Check with the inverse: answer × divisor + remainder = the starting number." });
};

/* --- Maths: fractions, decimals and percentages --- */
M.fdp = function (L) {
  var forms = [[1, 2, "0.5", "50%"], [1, 4, "0.25", "25%"], [3, 4, "0.75", "75%"], [1, 10, "0.1", "10%"], [3, 10, "0.3", "30%"], [7, 10, "0.7", "70%"], [1, 5, "0.2", "20%"], [2, 5, "0.4", "40%"], [3, 5, "0.6", "60%"], [9, 10, "0.9", "90%"]];
  if (L >= 2) forms = forms.concat([[23, 100, "0.23", "23%"], [71, 100, "0.71", "71%"], [9, 100, "0.09", "9%"], [45, 100, "0.45", "45%"]]);
  var f = pick(forms), mode = pick(["f2d", "d2p", "p2f", "f2p"]), fs = f[0] + "/" + f[1];
  var pct = f[3], dec = f[2], pnum = parseInt(pct, 10);
  if (mode === "f2d") return q("Fractions, decimals & %", "Write " + fs + " as a decimal.", dec, ["0." + f[0] + f[1], String(f[0] + f[1] / 10), String(pnum), String(round2(+dec / 10))].filter(function (x) { return x !== dec; }),
    fs + " = " + pnum + "/100 = " + dec + ".", "", { steps: ["Make the denominator 100: " + fs + " = " + pnum + "/100.", pnum + " hundredths = " + dec + "."], tip: "Tenths, hundredths, then the decimal: 3/10 = 0.3, 23/100 = 0.23." });
  if (mode === "d2p") return q("Fractions, decimals & %", "Write " + dec + " as a percentage.", pct, [dec + "%", (pnum / 10) + "%", (pnum * 10) + "%"],
    dec + " = " + pnum + " hundredths = " + pct + ".", "", { notes: { [dec + "%"]: "Per cent means 'out of 100', so multiply the decimal by 100." }, steps: ["Multiply the decimal by 100.", dec + " × 100 = " + pnum + ", so " + pct + "."], tip: "Per cent = out of 100. Decimal → % : × 100." });
  if (mode === "f2p") return q("Fractions, decimals & %", "What is " + fs + " as a percentage?", pct, [(f[0] * 10) + "%", f[0] + "%", (100 - pnum) + "%"].filter(function (x) { return x !== pct; }),
    fs + " = " + pnum + "/100 = " + pct + ".", "", { steps: ["Make an equivalent fraction out of 100.", fs + " = " + pnum + "/100.", pnum + "/100 = " + pct + "."], tip: "Percentages are fractions out of 100." });
  var gf = gcd(pnum, 100), simp = (pnum / gf) + "/" + (100 / gf);
  return q("Fractions, decimals & %", "Write " + pct + " as a fraction in its simplest form.", simp, [pnum + "/10", "1/" + pnum, (100 - pnum) + "/100", pnum + "/1000"].filter(function (x) { return x !== simp; }),
    pct + " = " + pnum + "/100" + (gf > 1 ? " = " + simp + " (divide top and bottom by " + gf + ")" : "") + ".", "", { steps: ["Write it out of 100: " + pnum + "/100.", gf > 1 ? "Divide top and bottom by " + gf + ": " + simp + "." : "It can't be simplified: " + simp + "."], tip: "% → fraction: put it over 100, then simplify." });
};

/* --- Maths: converting units of time --- */
M.timeConv = function (L) {
  var opts = [
    function () { var h = rnd(2, L === 1 ? 5 : 9); return ["How many minutes are in " + h + " hours?", h * 60, [h * 100, h * 10, h * 24], "1 hour = 60 minutes, so " + h + " × 60 = " + h * 60 + " minutes.", { [h * 100]: "There are 60 minutes in an hour, not 100." }]; },
    function () { var m = pick([90, 120, 150, 180, 240, 75, 135]); var h = Math.floor(m / 60), r = m % 60; var a = h + " h " + r + " min"; return ["Write " + m + " minutes in hours and minutes.", a, [Math.floor(m / 100) + " h " + (m % 100) + " min", (h + 1) + " h " + r + " min", h + " h " + (r + 10) + " min"], m + " ÷ 60 = " + h + " remainder " + r + ", so " + a + ".", {}]; },
    function () { var d = rnd(2, 6); return ["How many hours are in " + d + " days?", d * 24, [d * 12, d * 60, d * 7], "1 day = 24 hours, so " + d + " × 24 = " + d * 24 + ".", { [d * 12]: "A day is 24 hours, not 12." }]; },
    function () { var w = rnd(2, 8); return ["How many days are in " + w + " weeks?", w * 7, [w * 5, w * 10, w * 30], "1 week = 7 days, so " + w + " × 7 = " + w * 7 + ".", {}]; },
    function () { var s = pick([120, 180, 240, 300, 600]); return ["How many minutes is " + s + " seconds?", s / 60, [s / 100, s / 10, s / 30], "60 seconds = 1 minute, so " + s + " ÷ 60 = " + s / 60 + ".", {}]; },
    function () { var y = rnd(2, 6); return ["How many months are in " + y + " years?", y * 12, [y * 10, y * 52, y * 4], "1 year = 12 months, so " + y + " × 12 = " + y * 12 + ".", {}]; },
    function () { var m = pick([30, 45, 15]); return ["What fraction of an hour is " + m + " minutes?", { 30: "1/2", 45: "3/4", 15: "1/4" }[m], ["1/3", "1/2", "3/4", "1/4", "2/3"], m + " out of 60 minutes = " + { 30: "1/2", 45: "3/4", 15: "1/4" }[m] + " of an hour.", {}]; }
  ];
  var s = pick(opts)();
  return q("Converting time", s[0], s[1], s[2], s[3], "", { notes: s[4], steps: [s[3]], tip: "60 seconds = 1 min · 60 min = 1 hour · 24 hours = 1 day · 7 days = 1 week · 12 months = 1 year." });
};

/* --- Maths: 12- and 24-hour times and durations (Week 9: plan a day out) --- */
function hm24(m) { m = ((m % 1440) + 1440) % 1440; var h = Math.floor(m / 60), mi = m % 60; return (h < 10 ? "0" : "") + h + ":" + (mi < 10 ? "0" : "") + mi; }
function hm12(m) { m = ((m % 1440) + 1440) % 1440; var h = Math.floor(m / 60), mi = m % 60, ap = h < 12 ? "am" : "pm", h12 = h % 12 === 0 ? 12 : h % 12; return h12 + ":" + (mi < 10 ? "0" : "") + mi + " " + ap; }
function durTxt(d) { var h = Math.floor(d / 60), m = d % 60; return (h ? h + " h" : "") + (h && m ? " " : "") + (m ? m + " min" : "") || "0 min"; }
M.timeTable = function (L) {
  var places = ["the Grand Mosque", "the Louvre", "Yas Island", "the beach", "the aquarium", "the Corniche", "the souk", "the museum"];
  var kind = pick(L === 1 ? ["to24", "to12", "dur"] : L === 2 ? ["to24", "to12", "dur", "dur", "finish"] : ["dur", "dur", "finish", "total"]);
  if (kind === "to24" || kind === "to12") {
    var t = rnd(13, 22) * 60 + pick([0, 15, 30, 45, 5, 50]), ans = kind === "to24" ? hm24(t) : hm12(t), from = kind === "to24" ? hm12(t) : hm24(t);
    var wr = kind === "to24" ? [hm24(t - 720).replace(/^0/, ""), hm24(t + 120), hm24(t - 60)] : [hm12(t).replace("pm", "am"), hm12(t + 60), hm24(t) + " pm"];
    var nt = {}; nt[wr[0]] = kind === "to24" ? "Afternoon times are 12 more in 24-hour time: add 12 to the hour." : "Any hour after 12 in 24-hour time is in the afternoon or evening, so it is pm, not am.";
    return q("12- and 24-hour time", "Write " + from + " in " + (kind === "to24" ? "24-hour" : "12-hour") + " time.", ans, wr, from + " = " + ans + ". " + (kind === "to24" ? "For pm times, add 12 to the hour." : "For hours after 12, take away 12 and add pm."), "",
      { notes: nt, steps: [kind === "to24" ? "It's pm, so add 12 to the hour." : "The hour is bigger than 12, so take away 12.", "Keep the minutes the same.", "Answer: " + ans + "."], tip: "24-hour time: 1 pm = 13:00, 6 pm = 18:00. Always 4 digits, e.g. 09:05." });
  }
  var a = rnd(8, 15) * 60 + pick([0, 10, 15, 20, 30, 40, 45]), d = pick(L === 1 ? [30, 45, 60, 90] : [35, 50, 75, 85, 95, 110, 125, 140, 155]), b = a + d, pl = pick(places);
  if (kind === "dur") {
    var nt2 = {}; nt2[durTxt(d + 40)] = "Times don't work like normal numbers: there are 60 minutes in an hour, not 100. Count on to the next o'clock first.";
    return q("Durations", "You arrive at " + pl + " at " + hm24(a) + " and leave at " + hm24(b) + ". How long were you there?", durTxt(d), [durTxt(d + 40), durTxt(d + 10), durTxt(Math.max(5, d - 15))].filter(function (x) { return x !== durTxt(d); }),
      "Count on from " + hm24(a) + " to " + hm24(b) + ": that's " + durTxt(d) + ".", "",
      { notes: nt2, steps: (a % 60 && Math.ceil(a / 60) * 60 < b ? ["Count on to the next o'clock: " + hm24(a) + " → " + hm24(Math.ceil(a / 60) * 60) + " is " + (Math.ceil(a / 60) * 60 - a) + " min.", "Then count on to " + hm24(b) + "."] : ["Count on from " + hm24(a) + " to " + hm24(b) + " in hours, then minutes."]).concat(["Add the pieces: " + durTxt(d) + "."]), tip: "Use a number line: jump to the next hour, then the hours, then the minutes." });
  }
  if (kind === "finish") {
    var nt3 = {}; nt3[hm24(a + Math.floor(d / 60) * 100 + d % 60)] = "Don't add minutes like hundreds: 60 minutes makes an hour.";
    return q("Durations", "You leave home at " + hm12(a) + ". The journey to " + pl + " takes " + durTxt(d) + ". What time do you arrive (24-hour)?", hm24(b), [hm24(b + 60), hm24(b - 10), hm24(b + 40)],
      hm12(a) + " is " + hm24(a) + ". Add " + durTxt(d) + ": " + hm24(b) + ".", "", { notes: nt3, steps: ["Change to 24-hour: " + hm24(a) + ".", "Add the hours, then the minutes.", "If the minutes go past 60, carry 1 hour: " + hm24(b) + "."], tip: "60 minutes = 1 hour. 75 minutes = 1 h 15 min." });
  }
  var d2 = pick([40, 55, 70, 90]), d3 = pick([25, 35, 45]), tot = d + d2 + d3;
  return q("Durations", "A day out: " + durTxt(d) + " at the aquarium, " + durTxt(d2) + " at the park and " + durTxt(d3) + " travelling. What is the total time?", durTxt(tot),
    [durTxt(tot + 40), durTxt(tot - 15), durTxt(tot + 20)], d + " + " + d2 + " + " + d3 + " = " + tot + " minutes = " + durTxt(tot) + ".", "",
    { steps: ["Change everything to minutes.", d + " + " + d2 + " + " + d3 + " = " + tot + " minutes.", "Every 60 minutes is an hour: " + durTxt(tot) + "."], tip: "Add in minutes, then change back to hours and minutes." });
};

/* --- Maths: converting metric units --- */
M.unitConv = function (L) {
  var pairs = [["km", "m", 1000], ["m", "cm", 100], ["cm", "mm", 10], ["kg", "g", 1000], ["l", "ml", 1000]];
  var p = pick(pairs), big = Math.random() < 0.5, v;
  if (big) { v = L === 1 ? rnd(2, 9) : pick([rnd(2, 9) + 0.5, rnd(12, 40) / 10, rnd(2, 9)]); }
  else { v = L === 1 ? p[2] * rnd(2, 9) : pick([p[2] * rnd(2, 9) + p[2] / 2, p[2] * rnd(2, 9)]); }
  var ans = big ? v * p[2] : v / p[2], from = big ? p[0] : p[1], to = big ? p[1] : p[0];
  var cl = function (x) { return String(Math.round(x * 1000) / 1000); };
  var w = [big ? v * p[2] / 10 : v / p[2] * 10, big ? v * p[2] * 10 : v / p[2] / 10, big ? v / p[2] : v * p[2]].map(cl);
  var notes = {}; notes[w[2]] = big ? "Going from a big unit (" + from + ") to a small unit (" + to + ") means MORE of them: multiply." : "Going from a small unit to a big unit means FEWER of them: divide.";
  return q("Converting measures", "Convert " + cl(v) + " " + from + " into " + to + ".", cl(ans) + " " + to, w.map(function (x) { return x + " " + to; }),
    "1 " + p[0] + " = " + p[2] + " " + p[1] + ", so " + cl(v) + " " + from + " = " + cl(ans) + " " + to + ".", "",
    { notes: Object.keys(notes).reduce(function (o, k) { o[k + " " + to] = notes[k]; return o; }, {}), steps: ["1 " + p[0] + " = " + p[2] + " " + p[1] + ".", big ? "Big → small unit: × " + p[2] + "." : "Small → big unit: ÷ " + p[2] + ".", cl(v) + (big ? " × " : " ÷ ") + p[2] + " = " + cl(ans) + "."], tip: "km→m ×1000 · m→cm ×100 · cm→mm ×10 · kg→g ×1000 · l→ml ×1000. Going back? Divide." });
};

/* --- Maths: negative numbers in context --- */
M.negatives = function (L) {
  var start = rnd(-8, 6), ch = rnd(3, L === 1 ? 8 : 15), up = Math.random() < 0.5, end = up ? start + ch : start - ch;
  var notes = {}; notes[up ? start - ch : start + ch] = up ? "The temperature ROSE, so count up." : "The temperature FELL, so count down.";
  notes[-end] = "Right size, wrong side of zero. Count on a number line through 0.";
  return q("Negative numbers", "The temperature is " + start + "°C. It " + (up ? "rises" : "falls") + " by " + ch + "°C. What is it now?", end + "°C", [(up ? start - ch : start + ch) + "°C", (-end) + "°C", (end + 1) + "°C"].filter(function (x) { return x !== end + "°C"; }),
    start + (up ? " + " : " − ") + ch + " = " + end + "°C.", "",
    { notes: Object.keys(notes).reduce(function (o, k) { o[k + "°C"] = notes[k]; return o; }, {}), steps: ["Start at " + start + " on a number line.", (up ? "Count up " : "Count down ") + ch + ", passing through 0 if you need to.", "You land on " + end + "."], tip: "Draw a number line. Up = add, down = subtract. Zero is just another step." });
};

/* --- Maths: equivalent fractions, mixed numbers --- */
M.fractions = function (L) {
  if (L === 1 || Math.random() < 0.5) {
    var n = rnd(1, 4), d = rnd(n + 1, 8), k = rnd(2, 5);
    var notes = {}; notes[(n + k) + "/" + (d + k)] = "You added " + k + " to top and bottom. Equivalent fractions MULTIPLY both by the same number.";
    return q("Fractions", n + "/" + d + " = ?/" + (d * k), n * k + "/" + d * k, [(n + k) + "/" + (d * k), n + "/" + (d * k), (n * k + 1) + "/" + (d * k)], "The bottom was multiplied by " + k + ", so multiply the top by " + k + ": " + n * k + "/" + d * k + ".", "",
      { notes: notes, steps: [d + " × " + k + " = " + d * k + ".", "Do the same to the top: " + n + " × " + k + " = " + n * k + "."], tip: "Whatever you do to the bottom, do to the top." });
  }
  var den = rnd(3, 8), whole = rnd(1, 3), num = rnd(1, den - 1), imp = whole * den + num;
  if (Math.random() < 0.5) return q("Fractions", "Write " + imp + "/" + den + " as a mixed number.", whole + " " + num + "/" + den, [(whole + 1) + " " + num + "/" + den, whole + " " + (num + 1) + "/" + den, num + " " + whole + "/" + den], imp + " ÷ " + den + " = " + whole + " remainder " + num + ", so " + whole + " " + num + "/" + den + ".", "",
    { steps: ["How many whole " + den + "s fit into " + imp + "? " + whole + ".", "What's left over? " + imp + " − " + whole * den + " = " + num + ".", "So " + whole + " " + num + "/" + den + "."], tip: "Improper → mixed: divide; the remainder stays over the same denominator." });
  return q("Fractions", "Write " + whole + " " + num + "/" + den + " as an improper fraction.", imp + "/" + den, [(whole + num) + "/" + den, (whole * num + den) + "/" + den, (imp + 1) + "/" + den], whole + " × " + den + " = " + whole * den + ", plus " + num + " = " + imp + ", so " + imp + "/" + den + ".", "",
    { steps: ["Multiply the whole number by the denominator: " + whole + " × " + den + " = " + whole * den + ".", "Add the numerator: " + whole * den + " + " + num + " = " + imp + ".", "Keep the denominator: " + imp + "/" + den + "."], tip: "Mixed → improper: whole × bottom + top, over the same bottom." });
};

/* --- Maths: angles --- */
M.angles = function (L) {
  if (L === 1 || Math.random() < 0.4) {
    var a = pick([rnd(10, 85), 90, rnd(95, 175), rnd(185, 350)]), t = a < 90 ? "acute" : a === 90 ? "right angle" : a < 180 ? "obtuse" : "reflex";
    return q("Angles", "What type of angle is " + a + "°?", t, ["acute", "obtuse", "reflex", "right angle"].filter(function (x) { return x !== t; }),
      a + "° is " + t + ": acute < 90°, right = 90°, obtuse 90°–180°, reflex > 180°.", "", { steps: ["Compare with 90° and 180°.", a + "° → " + t + "."], tip: "Acute is a-CUTE little angle (< 90°). Obtuse is wide (90°–180°). Reflex is over 180°." });
  }
  var line = L === 2 || Math.random() < 0.5, tot = line ? 180 : 360, k = rnd(30, line ? 150 : 300), ans = tot - k;
  var notes = {}; notes[(line ? 360 : 180) - k] = line ? "Angles on a straight line make 180°, not 360°." : "Angles around a point make 360°, not 180°.";
  return q("Angles", "Two angles " + (line ? "sit on a straight line" : "go all the way round a point") + ". One is " + k + "°. What is the other?", ans + "°", [((line ? 360 : 180) - k) + "°", (ans + 10) + "°", (90 - (k % 90 || 1)) + "°"].filter(function (x) { return x !== ans + "°"; }),
    "Angles " + (line ? "on a straight line" : "around a point") + " add up to " + tot + "°: " + tot + " − " + k + " = " + ans + "°.", "",
    { notes: Object.keys(notes).reduce(function (o, kk) { o[kk + "°"] = notes[kk]; return o; }, {}), steps: [(line ? "Straight line = 180°." : "Full turn = 360°."), tot + " − " + k + " = " + ans + "°."], tip: "Straight line 180°, full turn 360°, right angle 90°." });
};

/* --- Maths: perimeter and area --- */
M.perimArea = function (L) {
  var w = rnd(3, L === 1 ? 9 : 15), h = rnd(2, L === 1 ? 8 : 12), area = Math.random() < 0.5, unit = pick(["cm", "m"]);
  if (L === 3 && Math.random() < 0.5) {
    var P = 2 * (w + h);
    return q("Perimeter & area", "A rectangle has a perimeter of " + P + " " + unit + ". One side is " + w + " " + unit + ". How long is the other side?", h + " " + unit, [(P - w) + " " + unit, (P / 2) + " " + unit, (P - 2 * w) + " " + unit],
      "Two sides of " + w + " use up " + 2 * w + ". That leaves " + (P - 2 * w) + " for the other two sides, so each is " + h + " " + unit + ".", "", { steps: [w + " + " + w + " = " + 2 * w + ".", P + " − " + 2 * w + " = " + (P - 2 * w) + ".", (P - 2 * w) + " ÷ 2 = " + h + "."], tip: "Perimeter of a rectangle = 2 × (length + width)." });
  }
  var ans = area ? w * h : 2 * (w + h), u = area ? unit + "²" : unit, notes = {};
  notes[(area ? 2 * (w + h) : w * h) + " " + (area ? unit : unit + "²")] = area ? "That's the perimeter (distance round). Area is length × width." : "That's the area. Perimeter is the distance all the way round.";
  return q("Perimeter & area", "A rectangle is " + w + " " + unit + " by " + h + " " + unit + ". What is its " + (area ? "area" : "perimeter") + "?", ans + " " + u,
    [(area ? 2 * (w + h) + " " + unit : w * h + " " + unit + "²"), (w + h) + " " + u, (ans + 2) + " " + u],
    area ? w + " × " + h + " = " + ans + " " + unit + "²." : w + " + " + h + " + " + w + " + " + h + " = " + ans + " " + unit + ".", "",
    { notes: notes, steps: [area ? "Area = length × width." : "Perimeter = add all four sides.", area ? w + " × " + h + " = " + ans + "." : "2 × (" + w + " + " + h + ") = " + ans + "."], tip: "Perimeter: walk round the edge (add). Area: cover the inside (multiply), in square units." });
};

/* --- English: figurative language --- */
var FIGURATIVE = [
  ["“The waves were as tall as houses.” This is a…", "simile", ["metaphor", "personification", "alliteration"], "It compares two things using 'as', so it's a simile.", { metaphor: "A metaphor says something IS something else, without 'like' or 'as'." }],
  ["“The storm was a roaring lion.” This is a…", "metaphor", ["simile", "onomatopoeia", "alliteration"], "It says the storm IS a lion (no 'like' or 'as'), so it's a metaphor.", { simile: "A simile uses 'like' or 'as'. This one doesn't." }],
  ["“The wind howled angrily at the boat.” This is…", "personification", ["simile", "metaphor", "onomatopoeia"], "The wind is given a human feeling (anger), so it's personification.", {}],
  ["“Crash! Bang! The thunder boomed.” Crash and bang are examples of…", "onomatopoeia", ["alliteration", "simile", "personification"], "They sound like the noises they describe: onomatopoeia.", {}],
  ["“Slippery, slimy sea snakes slid silently.” This uses…", "alliteration", ["onomatopoeia", "a metaphor", "a simile"], "Lots of words start with the same sound (s): alliteration.", {}],
  ["Which sentence is a simile?", "The sea sparkled like diamonds.", ["The sea was a sheet of glass.", "The sea whispered secrets.", "The silver sea shimmered."], "It uses 'like' to compare the sea to diamonds.", {}],
  ["Which sentence uses personification?", "The old ship groaned in pain.", ["The ship was as old as time.", "The ship was a wooden giant.", "Splash! The ship hit the water."], "A ship can't feel pain: it's been given a human quality.", {}],
  ["Which sentence is a metaphor?", "The island was a green jewel in the ocean.", ["The island looked like a jewel.", "The island smiled at the sailors.", "Big, bright, beautiful island."], "It says the island IS a jewel, without 'like' or 'as'.", {}],
  ["Why might a writer use a simile in a storm story?", "to help the reader picture the storm", ["to make the story shorter", "to tell the reader the time", "to list the characters"], "Comparisons help readers imagine how big, loud or scary something is.", {}],
  ["“The lightning danced across the sky.” Which word shows personification?", "danced", ["lightning", "across", "sky"], "Dancing is something people do. Giving it to lightning is personification.", {}],
  ["“Her voice was music to his ears.” This is a…", "metaphor", ["simile", "onomatopoeia", "personification"], "It says her voice IS music, with no 'like' or 'as'.", {}],
  ["Which word is onomatopoeia?", "sizzle", ["sea", "storm", "slowly"], "‘Sizzle’ sounds like the noise it describes.", {}]
];
M.figurative = function () { return bq("Figurative language", FIGURATIVE, "Simile: like/as. Metaphor: IS something else. Personification: human actions or feelings for a thing."); };

/* --- English: Year 5 grammar and punctuation --- */
var GRAMMAR5 = [
  ["Which noun is formed from the verb 'decide'?", "decision", ["decided", "decisive", "deciding"], "A noun names a thing: 'decide' (verb) → 'decision' (noun). The suffix -sion turns it into a noun.", {"decisive": "That's an adjective (describes a noun)."}],
  ["Which prefix can go in front of 'build', 'write' and 'play'?", "re", ["un", "dis", "mis"], "Re- means 'again': rebuild, rewrite, replay.", {"un": "Unbuild and unwrite aren't words."}],
  ["Which word is the adverb? 'Tom quietly closed the door.'", "quietly", ["Tom", "closed", "door"], "An adverb tells you HOW, WHEN or WHERE something happens. 'Quietly' tells you how Tom closed it.", {"closed": "That's the verb. The adverb describes the verb."}],
  ["Which part is the subordinate clause? 'Because it was raining, we stayed inside.'", "Because it was raining", ["we stayed inside", "it was", "stayed inside"], "A subordinate clause doesn't make sense on its own. It often starts with because, when, if or although.", {"we stayed inside": "That's the main clause: it makes sense on its own."}],
  ["Which sentence uses commas in a list correctly?", "I packed a towel, sun cream and a hat.", ["I packed a towel sun cream, and a hat.", "I packed, a towel sun cream and a hat.", "I packed a towel, sun cream, and, a hat."], "Put a comma between list items, but usually not before the final 'and'.", {}],
  ["Which word is a relative pronoun?", "whose", ["they", "because", "then"], "Relative pronouns start relative clauses: who, which, that, whose, where, when.", {"they": "That's a personal pronoun."}],
  ["Which word is a pronoun? 'Sara lost her bag, so she looked everywhere.'", "she", ["lost", "bag", "everywhere"], "A pronoun replaces a noun: 'she' stands for Sara.", {}],
  ["Which sentence has a modal verb?", "We should leave early tomorrow.", ["We left early yesterday.", "We are leaving early.", "We leave early on Mondays."], "Modal verbs (should, could, might, will, must, shall) show how likely or necessary something is.", {}],
  ["Which sentence uses brackets for parenthesis correctly?", "Kensuke (who lived alone) watched the boy.", ["Kensuke (who lived alone watched the boy).", "(Kensuke) who lived alone watched the boy.", "Kensuke who (lived alone) watched the boy."], "Parenthesis adds extra information. If you take the brackets out, the sentence still makes sense.", {}],
  ["In “Michael, who was tired, fell asleep”, the part between the commas is a…", "relative clause", ["fronted adverbial", "main clause", "conjunction"], "It begins with 'who' and adds information about Michael: a relative clause.", {}],
  ["Which word starts a relative clause?", "which", ["because", "and", "but"], "Relative clauses start with who, which, where, when, whose or that.", {}],
  ["Which word is a modal verb?", "might", ["running", "quickly", "beautiful"], "Modal verbs show how likely something is: might, could, should, will, must.", {}],
  ["Which modal verb shows something is most certain?", "will", ["might", "could", "may"], "'Will' is definite. 'Might', 'could' and 'may' are only possible.", {}],
  ["“After the storm, the boat drifted.” What is “After the storm,”?", "a fronted adverbial", ["a relative clause", "a noun phrase", "a modal verb"], "It's an adverbial (when) moved to the front, followed by a comma.", {}],
  ["Which is an expanded noun phrase?", "the tiny, frightened puppy with muddy paws", ["the puppy ran", "quickly and quietly", "because it rained"], "It's a noun (puppy) with extra detail before and after it.", {}],
  ["Which sentence uses dashes for parenthesis?", "The island – hot and quiet – was perfect.", ["The island – was hot and quiet.", "The – island was hot and quiet.", "The island was hot – and – quiet."], "A pair of dashes goes around the extra information.", {}],
  ["Which sentence is in the passive voice?", "The window was broken by the ball.", ["The ball broke the window.", "Sam kicked the ball.", "The ball is round."], "In the passive, the thing that had the action done to it comes first.", {}],
  ["Which sentence uses the present perfect form?", "She has finished her homework.", ["She finishes her homework.", "She finished her homework.", "She will finish her homework."], "Present perfect = has/have + past participle (has finished).", {}],
  ["Which sentence uses a colon correctly?", "Pack three things: water, a hat and a map.", ["Pack: three things water, a hat and a map.", "Pack three: things water, a hat and a map.", "Pack three things water: a hat and a map."], "A colon can introduce a list after a complete sentence.", {}],
  ["Which is a fronted adverbial of time?", "Early the next morning,", ["Kensuke's old cave", "because he was lost", "the shining sea"], "It tells you WHEN and comes at the front of the sentence.", {}]
];
M.grammar5 = function () { return bq("Grammar", GRAMMAR5, "Parenthesis = extra information in brackets, dashes or commas. Take it out and the sentence still works."); };

/* --- Science: Earth, Sun and Moon --- */
var EARTHMOON = [
  ["Why do we have day and night?", "The Earth spins on its axis.", ["The Sun moves around the Earth.", "The Moon blocks the Sun.", "The Earth moves closer to the Sun."], "The Earth rotates once every 24 hours. The side facing the Sun has day.", { "The Sun moves around the Earth.": "It looks like the Sun moves, but it's the Earth that spins." }],
  ["How long does the Earth take to spin round once?", "about 24 hours", ["about 365 days", "about 28 days", "about 12 hours"], "One full spin (rotation) takes about 24 hours: one day.", {}],
  ["How long does the Earth take to orbit the Sun?", "about 365 days", ["about 24 hours", "about 28 days", "about 30 days"], "One orbit of the Sun takes about 365¼ days: one year.", {}],
  ["How long does the Moon take to orbit the Earth?", "about 27 days", ["about 365 days", "about 24 hours", "about 7 days"], "The Moon orbits the Earth about every 27 days (and goes through its phases about every 29½ days).", {}],
  ["What shape are the Sun, Earth and Moon?", "roughly spheres", ["flat discs", "cubes", "flat circles"], "They are all approximately spherical, like balls.", {}],
  ["The Sun seems to rise in the…", "east", ["west", "north", "south"], "As the Earth spins, the Sun appears to rise in the east and set in the west.", {}],
  ["The Sun seems to set in the…", "west", ["east", "north", "south"], "The Sun rises in the east and sets in the west.", {}],
  ["Why does the Sun seem to move across the sky?", "because the Earth is rotating", ["because the Sun orbits the Earth", "because clouds push it", "because the Moon pulls it"], "We're spinning with the Earth, so the Sun appears to travel across the sky.", {}],
  ["What does the Moon orbit?", "the Earth", ["the Sun only", "Mars", "nothing"], "The Moon is the Earth's natural satellite: it orbits the Earth.", {}],
  ["Which of these is a star?", "the Sun", ["the Moon", "the Earth", "Jupiter"], "The Sun is a star. Planets and moons don't make their own light.", {}],
  ["Why can we see the Moon at night?", "it reflects light from the Sun", ["it makes its own light", "it is on fire", "it reflects light from Earth's cities"], "The Moon doesn't make light: it reflects the Sun's light.", {}],
  ["Which planet is closest to the Sun?", "Mercury", ["Venus", "Earth", "Mars"], "Order from the Sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.", {}]
];
M.earthMoon = function () { return bq("Earth, Sun & Moon", EARTHMOON, "Earth spins (24 hours = a day) and orbits the Sun (365 days = a year). The Moon orbits Earth (about 27 days)."); };

/* --- Science: reversible and irreversible changes --- */
var CHANGES = [
  ["Is melting chocolate reversible or irreversible?", "reversible", ["irreversible"], "Melted chocolate can set again when it cools.", {}],
  ["Is burning wood reversible or irreversible?", "irreversible", ["reversible"], "Burning makes new materials (ash, smoke, gases). You can't get the wood back.", {}],
  ["Is dissolving salt in water reversible or irreversible?", "reversible", ["irreversible"], "Evaporate the water and the salt is left behind.", {}],
  ["Is baking a cake reversible or irreversible?", "irreversible", ["reversible"], "Baking makes a new material. You can't un-bake a cake.", {}],
  ["Is freezing water reversible or irreversible?", "reversible", ["irreversible"], "Ice melts back into water.", {}],
  ["Is a nail rusting reversible or irreversible?", "irreversible", ["reversible"], "Rust is a new material made from iron, water and oxygen.", {}],
  ["Mixing vinegar and bicarbonate of soda makes bubbles of…", "carbon dioxide", ["oxygen", "water vapour", "hydrogen"], "The acid (vinegar) reacts with bicarbonate of soda to make carbon dioxide gas: a new material.", {}],
  ["Why is mixing vinegar and bicarbonate of soda irreversible?", "a new material (a gas) is made", ["it gets warm", "it changes colour", "it is a liquid"], "Making a new material is the sign of an irreversible change.", {}],
  ["Which is a sign that an irreversible change has happened?", "a new material has formed", ["the shape has changed", "it has melted", "it has been cut"], "Changes of shape or state can usually be reversed. New materials can't.", {}],
  ["Which of these changes is reversible?", "water evaporating", ["toast burning", "an egg frying", "paper burning"], "Water vapour can condense back into water.", {}],
  ["Which of these changes is irreversible?", "an egg cooking", ["ice melting", "sugar dissolving", "water freezing"], "Cooking changes the egg into a new material.", {}],
  ["Mixing sand and gravel is a…", "reversible change", ["irreversible change", "chemical reaction", "burning change"], "You can sieve them apart again.", {}]
];
M.changes = function () { return bq("Reversible & irreversible changes", CHANGES, "Can you get the original back? Reversible. Has a new material been made? Irreversible."); };

/* --- Science: forces (later this year) --- */
var FORCES5 = [
  ["Why does an apple fall to the ground?", "gravity pulls it towards the Earth", ["air pushes it down", "friction pulls it", "magnets in the soil"], "Gravity pulls unsupported objects towards the Earth.", {}],
  ["Which force slows down a parachute?", "air resistance", ["gravity", "magnetism", "upthrust from the ground"], "The large parachute pushes against lots of air, creating air resistance.", {}],
  ["Which force slows a boat moving through water?", "water resistance", ["air resistance", "gravity", "magnetism"], "Water pushes against things moving through it.", {}],
  ["Which force makes it hard to slide a box across carpet?", "friction", ["gravity", "air resistance", "upthrust"], "Friction acts between two surfaces moving against each other.", {}],
  ["Why do fish and boats have streamlined shapes?", "to reduce water resistance", ["to increase friction", "to sink faster", "to increase gravity"], "A smooth, pointed shape lets water flow past more easily.", {}],
  ["Which surface gives the most friction?", "a rubber mat", ["ice", "a polished floor", "glass"], "Rough, grippy surfaces create more friction.", {}],
  ["What does a lever help you do?", "lift a heavy load with a smaller force", ["make a load heavier", "remove gravity", "create electricity"], "A lever turns around a pivot, so a small push can move a big load.", {}],
  ["What is the point a lever turns around called?", "the pivot (fulcrum)", ["the load", "the effort", "the gear"], "The pivot or fulcrum is the turning point.", {}],
  ["A pulley helps you lift something by…", "changing the direction of the pull", ["making it lighter", "removing friction", "using magnets"], "With a pulley you can pull down to lift something up; more wheels mean less force is needed.", {}],
  ["Gears are used to…", "change the speed or force of turning", ["make things float", "stop gravity", "make light"], "Linked gears can make turning faster, slower or stronger.", {}],
  ["What is the unit of force?", "newton (N)", ["kilogram (kg)", "metre (m)", "litre (l)"], "Forces are measured in newtons, named after Isaac Newton.", {}]
];
M.forces = function () { return bq("Forces", FORCES5, "Gravity pulls down; air resistance, water resistance and friction slow things down."); };

/* --- Science: life cycles and growing up (later this year) --- */
var LIFE5 = [
  ["What is the correct order for a frog's life cycle?", "egg → tadpole → froglet → frog", ["tadpole → egg → frog → froglet", "egg → froglet → tadpole → frog", "frog → tadpole → egg → froglet"], "Frogs are amphibians: frogspawn hatches into tadpoles, which grow legs (froglets) and become frogs.", {}],
  ["What is the correct order for a butterfly's life cycle?", "egg → caterpillar → chrysalis → butterfly", ["egg → chrysalis → caterpillar → butterfly", "caterpillar → egg → butterfly → chrysalis", "egg → butterfly → caterpillar → chrysalis"], "Insects like butterflies go through complete metamorphosis.", {}],
  ["What is metamorphosis?", "a big change in body shape as an animal grows", ["laying eggs", "breathing underwater", "moving to a new home"], "Caterpillar to butterfly and tadpole to frog are metamorphosis.", {}],
  ["How do most mammals start life?", "born live and fed on milk", ["hatched from eggs in water", "as larvae", "as seeds"], "Most mammals give birth to live young and feed them milk.", {}],
  ["Which animal's life cycle includes a pupa?", "a butterfly", ["a dog", "a robin", "a human"], "The pupa (chrysalis) stage is part of an insect's complete metamorphosis.", {}],
  ["Birds begin life as…", "eggs with hard shells", ["tadpoles", "live babies fed on milk", "seeds"], "Birds lay hard-shelled eggs, usually in a nest.", {}],
  ["In plants, what does pollination do?", "moves pollen to the female part of a flower", ["makes the roots grow", "turns leaves green", "makes the plant taller"], "Pollen moves from the stamen to the stigma, often carried by insects or wind.", {}],
  ["Which part of a plant can grow into a new plant?", "a seed", ["a petal", "a thorn", "a leaf vein"], "After fertilisation, seeds form; each can grow into a new plant.", {}],
  ["What is the stage when a child's body changes into an adult's?", "puberty", ["infancy", "old age", "metamorphosis"], "Puberty is usually between about 9 and 16 years old.", {}],
  ["Put the human life stages in order.", "baby → child → adolescent → adult", ["child → baby → adult → adolescent", "baby → adolescent → child → adult", "adult → child → baby → adolescent"], "Humans grow from babies to children, adolescents (teenagers) and adults.", {}],
  ["Strawberry plants send out runners that grow new plants. This is…", "asexual reproduction", ["pollination", "metamorphosis", "germination"], "Only one parent plant is needed: asexual reproduction.", {}]
];
M.lifeCycles = function () { return bq("Life cycles", LIFE5, "Mammal: born live. Bird: hard-shelled egg. Amphibian: egg → tadpole → adult. Insect: egg → larva → pupa → adult."); };

/* ===================== Kristan · Year 8 ===================== */
function sgn(n) { return n < 0 ? "− " + (-n) : "+ " + n; }
function neg(v) { return String(v).replace(/^-/, "−"); }
function kb(topic, bank, tip) {
  var s = pick(bank), notes = Object.assign({}, s[4] || {});
  return q(topic, s[0], s[1], s[2], s[3], "", { notes: notes, tip: tip || null });
}

/* --- Maths: equations with unknowns on both sides, brackets and fractions --- */
K.eqBoth = function (L) {
  var x = rnd(-4, 9) || 2, t = L === 1 ? 1 : pick(L === 2 ? [1, 2] : [1, 2, 3]), prompt, steps, notes = {}, wrong;
  if (t === 1) {
    var a = rnd(3, 9), c = rnd(1, a - 1), b = rnd(-10, 12) || 4, d = (a - c) * x + b;
    if (d === 0) { b += 1; d += 1; }
    prompt = a + "x " + sgn(b) + " = " + c + "x " + sgn(d);
    steps = ["Take " + c + "x from both sides: " + (a - c) + "x " + sgn(b) + " = " + neg(d) + ".", (b >= 0 ? "Subtract " + b : "Add " + (-b)) + " on both sides: " + (a - c) + "x = " + neg(d - b) + ".", "Divide by " + (a - c) + ": x = " + neg(x) + "."];
    wrong = [round2((d - b) / (a + c)), round2((d + b) / (a - c)), -x, x + 1];
    notes[neg(round2((d - b) / (a + c)))] = "You ADDED the x terms. Take the smaller x term away from both sides: " + a + "x − " + c + "x = " + (a - c) + "x.";
    notes[neg(round2((d + b) / (a - c)))] = "Check the sign when you move " + neg(b) + " across: do the opposite operation to both sides.";
  } else if (t === 2) {
    var k = rnd(2, 5), p = rnd(-5, 6) || 1, r = k * (x + p);
    prompt = k + "(x " + sgn(p) + ") = " + neg(r);
    steps = ["Expand: " + k + "x " + sgn(k * p) + " = " + neg(r) + " (or divide both sides by " + k + " first).", "x " + sgn(p) + " = " + neg(r / k) + ".", "x = " + neg(x) + "."];
    wrong = [r - p, round2((r - p) / k), -x, x + 2];
    notes[neg(round2((r - p) / k))] = "Expand the bracket fully: " + k + " × " + neg(p) + " = " + neg(k * p) + ", not " + neg(p) + ".";
  } else {
    var dd = rnd(2, 5), m = rnd(1, 4), n = rnd(-6, 8), xx = dd * rnd(-2, 5), rhs = m * xx / dd + n;
    x = xx;
    prompt = (m === 1 ? "" : m) + "x/" + dd + " " + sgn(n) + " = " + neg(rhs);
    steps = [(n >= 0 ? "Subtract " + n : "Add " + (-n)) + ": " + (m === 1 ? "" : m) + "x/" + dd + " = " + neg(rhs - n) + ".", "Multiply both sides by " + dd + ": " + (m === 1 ? "" : m) + "x = " + neg((rhs - n) * dd) + ".", m === 1 ? "x = " + neg(x) + "." : "Divide by " + m + ": x = " + neg(x) + "."];
    wrong = [round2((rhs - n) / dd / m), round2((rhs + n) * dd / m), -x, x + dd];
    notes[neg(round2((rhs - n) / dd / m))] = "You divided by " + dd + ". The x is already divided by " + dd + ", so MULTIPLY both sides by " + dd + " to undo it.";
  }
  return q("Solving equations", "Solve " + prompt, neg(x), wrong.filter(function (w) { return w !== x; }).map(neg),
    "x = " + neg(x) + ". Check: substitute it back into both sides.", "", { notes: notes, steps: steps, tip: "Do the same to both sides. Get the x terms on one side first (take away the smaller one)." });
};

/* --- Maths: percentages with multipliers, reverse %, compound interest --- */
K.pctMult = function (L) {
  var t = L === 1 ? pick(["mult", "change"]) : L === 2 ? pick(["mult", "change", "reverse"]) : pick(["reverse", "compound", "depr"]);
  if (t === "mult") {
    var p = pick([5, 12, 15, 20, 25, 30, 35, 40, 3, 8]), up = Math.random() < 0.5, m = round2(up ? 1 + p / 100 : 1 - p / 100);
    var notes = {}; notes[String(round2(p / 100))] = "That multiplier finds " + p + "% OF the amount, not the amount after the change.";
    notes[String(round2(up ? 1 - p / 100 : 1 + p / 100))] = up ? "That's a decrease. An increase means 100% + " + p + "%." : "That's an increase. A decrease means 100% − " + p + "%.";
    return q("Percentages", "What single multiplier " + (up ? "increases" : "decreases") + " an amount by " + p + "%?", String(m), [String(round2(p / 100)), String(round2(up ? 1 - p / 100 : 1 + p / 100)), String(up ? 1 + p / 10 : round2(1 - p / 1000)), String(p)],
      (up ? "100% + " : "100% − ") + p + "% = " + Math.round(m * 100) + "% = " + m + ".", "", { notes: notes, steps: ["Start from 100%.", (up ? "Add " : "Subtract ") + p + "%: " + Math.round(m * 100) + "%.", "Divide by 100: " + m + "."], tip: "Increase by r% → × (1 + r/100). Decrease by r% → × (1 − r/100)." });
  }
  if (t === "change") {
    var amt = pick([40, 60, 80, 120, 150, 200, 250, 360, 480]), pc = pick([10, 15, 20, 25, 30, 35]), inc = Math.random() < 0.5, mm = inc ? 1 + pc / 100 : 1 - pc / 100, ans = round2(amt * mm);
    var notes2 = {}; notes2["£" + fmt(amt * pc / 100)] = "That's the " + (inc ? "increase" : "decrease") + " itself. Now " + (inc ? "add it to" : "take it from") + " the original.";
    notes2["£" + fmt(inc ? amt * (1 - pc / 100) : amt * (1 + pc / 100))] = inc ? "That's a decrease. The price went UP." : "That's an increase. The price went DOWN.";
    return q("Percentages", "A pair of boots costs £" + amt + ". The price " + (inc ? "rises" : "falls") + " by " + pc + "%. What is the new price?", "£" + fmt(ans), ["£" + fmt(amt * pc / 100), "£" + fmt(inc ? amt * (1 - pc / 100) : amt * (1 + pc / 100)), "£" + fmt(amt + (inc ? pc : -pc))],
      "£" + amt + " × " + round2(mm) + " = £" + fmt(ans) + ".", "", { notes: notes2, steps: ["Multiplier: " + (inc ? "1 + " : "1 − ") + pc / 100 + " = " + round2(mm) + ".", amt + " × " + round2(mm) + " = " + fmt(ans) + "."], tip: "One step: original × multiplier." });
  }
  if (t === "reverse") {
    var orig = pick([40, 50, 60, 80, 120, 160, 200, 240]), rp = pick([10, 20, 25, 40, 50]), up2 = Math.random() < 0.5, mul = up2 ? 1 + rp / 100 : 1 - rp / 100, now = round2(orig * mul);
    var wrongR = round2(up2 ? now * (1 - rp / 100) : now * (1 + rp / 100)), n3 = {}; n3["£" + fmt(wrongR)] = "Classic trap: the " + rp + "% was of the ORIGINAL price, not the new one. Divide by the multiplier instead.";
    return q("Reverse percentages", "After a " + rp + "% " + (up2 ? "increase" : "discount") + ", a FIFA game costs £" + fmt(now) + ". What was the original price?", "£" + fmt(orig), ["£" + fmt(wrongR), "£" + fmt(now * rp / 100), "£" + fmt(up2 ? now - rp : now + rp)],
      "£" + fmt(now) + " = " + Math.round(mul * 100) + "% of the original, so original = " + fmt(now) + " ÷ " + round2(mul) + " = £" + fmt(orig) + ".", "", { notes: n3, steps: ["The new price is " + Math.round(mul * 100) + "% of the original.", "Multiplier: " + round2(mul) + ".", "Original = " + fmt(now) + " ÷ " + round2(mul) + " = " + fmt(orig) + "."], tip: "Reverse %: divide by the multiplier. Never take the % off the new amount." });
  }
  var P = pick([200, 500, 1000, 1500, 2000]), r = pick([2, 3, 4, 5, 10]), n = rnd(2, 3), dep = t === "depr", f = dep ? 1 - r / 100 : 1 + r / 100, A = round2(P * Math.pow(f, n)), simple = round2(dep ? P - P * r / 100 * n : P + P * r / 100 * n);
  var n4 = {}; n4["£" + fmt(simple)] = "That's simple interest (the same amount each year). Compound means the % is worked out on the NEW amount each year: × " + round2(f) + " each year.";
  return q(dep ? "Depreciation" : "Compound interest", dep ? "A car worth £" + P + " loses " + r + "% of its value each year. What is it worth after " + n + " years?" : "£" + P + " is invested at " + r + "% compound interest per year. How much is there after " + n + " years?", "£" + fmt(A), ["£" + fmt(simple), "£" + fmt(P * f), "£" + fmt(P * Math.pow(f, n + 1))],
    fmt(P) + " × " + round2(f) + "^" + n + " = £" + fmt(A) + ".", "", { notes: n4, steps: ["Multiplier for one year: " + round2(f) + ".", "For " + n + " years: × " + round2(f) + "^" + n + ".", P + " × " + round2(f) + "^" + n + " = " + fmt(A) + "."], tip: "Compound: amount × multiplier^years." });
};

/* --- Maths: grouped frequency (estimate of mean, modal class) --- */
K.grouped = function (L) {
  var w = pick([5, 10]), start = pick([0, 10, 20]), rows = [], tot = 0, fx = 0;
  for (var i = 0; i < 4; i++) { var f = rnd(1, 9), lo = start + i * w, hi = lo + w, mid = (lo + hi) / 2; rows.push([lo, hi, f, mid]); tot += f; fx += f * mid; }
  var maxF = Math.max.apply(null, rows.map(function (r) { return r[2]; })), modal = rows.filter(function (r) { return r[2] === maxF; });
  if (modal.length > 1) { modal[modal.length - 1][2] = maxF + 1; modal = [modal[modal.length - 1]]; }
  var table = rows.map(function (r) { return r[0] + " < x ≤ " + r[1] + ": " + r[2]; }).join(" · ");
  if (L === 1 || Math.random() < 0.35) {
    var lbl = function (r) { return r[0] + " < x ≤ " + r[1]; };
    return q("Grouped data", "Minutes of FIFA played per day — " + table + ". What is the modal class?", lbl(modal[0]), rows.filter(function (r) { return r !== modal[0]; }).map(lbl).concat([String(modal[0][2])]),
      "The modal class is the group with the highest frequency: " + lbl(modal[0]) + ".", "", { notes: { [String(modal[0][2])]: "That's the frequency. The modal class is the GROUP it belongs to." }, steps: ["Look down the frequency column.", "The biggest is " + modal[0][2] + ", in " + lbl(modal[0]) + "."], tip: "Modal class = the group with the biggest frequency." });
  }
  tot = 0; fx = 0; rows.forEach(function (r) { tot += r[2]; fx += r[2] * r[3]; });
  var est = round2(fx / tot), loSum = 0; rows.forEach(function (r) { loSum += r[2] * r[0]; });
  var n5 = {}; n5[fmt(round2(fx / 4))] = "You divided by the number of groups (4). Divide by the total frequency: " + tot + ".";
  n5[fmt(round2(loSum / tot))] = "You used the lower ends of the groups. Use the MIDPOINTS.";
  return q("Grouped data", "Minutes of FIFA played per day — " + table + ". Estimate the mean (to 2 d.p.).", fmt(est), [fmt(round2(fx / 4)), fmt(round2(loSum / tot)), fmt(round2(rows.reduce(function (s, r) { return s + r[3]; }, 0) / 4))],
    "Σ(f × midpoint) = " + fx + ", total frequency = " + tot + ", so mean ≈ " + fx + " ÷ " + tot + " = " + fmt(est) + ".", "", { notes: n5, steps: ["Midpoints: " + rows.map(function (r) { return r[3]; }).join(", ") + ".", "f × midpoint: " + rows.map(function (r) { return r[2] * r[3]; }).join(" + ") + " = " + fx + ".", "Total frequency: " + tot + ".", fx + " ÷ " + tot + " = " + fmt(est) + "."], tip: "Estimated mean = Σ(f × midpoint) ÷ Σf. It's an estimate because we don't know the exact values." });
};

/* --- Maths: sample spaces for two events --- */
K.sampleSpace = function (L) {
  var t = pick(L === 1 ? ["coinDie", "twoDiceTotal"] : ["twoDiceTotal", "twoDiceDouble", "coinDie", "spinners"]);
  if (t === "coinDie") {
    var face = rnd(1, 6);
    return q("Probability: two events", "A coin is flipped and a dice is rolled. What is the probability of heads and a " + face + "?", "1/12", ["1/6", "1/2", "2/12", "1/8"],
      "There are 2 × 6 = 12 equally likely outcomes; only (H, " + face + ") works: 1/12.", "", { notes: { "1/6": "That's just the dice. You also need heads: 12 outcomes in total.", "1/8": "Coin: 2 outcomes, dice: 6. 2 × 6 = 12, not 8." }, steps: ["Sample space: 2 × 6 = 12 outcomes.", "Only one is H and " + face + ".", "P = 1/12."], tip: "Number of outcomes for two events = outcomes of the first × outcomes of the second." });
  }
  if (t === "twoDiceTotal") {
    var tot = rnd(3, 11), ways = 6 - Math.abs(7 - tot), ans = frac(ways, 36);
    var nt = {}; nt[frac(1, 11)] = "Totals 2–12 are NOT equally likely: 7 can be made 6 ways, 2 only one way."; nt[frac(ways, 12)] = "Two dice give 6 × 6 = 36 outcomes, not 12.";
    return q("Probability: two events", "Two dice are rolled and the scores added. What is P(total = " + tot + ")?", ans, [frac(1, 11), frac(ways, 12), frac(ways + 1, 36), frac(1, 6)],
      "In the 6 × 6 sample space, " + ways + " outcomes make " + tot + ": P = " + ways + "/36" + (ans !== ways + "/36" ? " = " + ans : "") + ".", "", { notes: nt, steps: ["Draw the 6 × 6 grid of totals: 36 outcomes.", "Count the cells showing " + tot + ": " + ways + ".", "P = " + ways + "/36" + (ans !== ways + "/36" ? " = " + ans : "") + "."], tip: "Two dice → 36 outcomes. 7 is the most likely total." });
  }
  if (t === "twoDiceDouble") return q("Probability: two events", "Two dice are rolled. What is the probability of a double?", "1/6", ["1/36", "1/12", "1/2", "2/6"],
    "Doubles: (1,1) … (6,6) = 6 outcomes out of 36 = 1/6.", "", { notes: { "1/36": "That's one particular double, like (6,6). There are 6 doubles." } , steps: ["36 outcomes.", "6 of them are doubles.", "6/36 = 1/6."], tip: "List or grid the outcomes, then count." });
  var a = rnd(3, 5), b = rnd(2, 4), ta = rnd(2, a + b);
  var count = 0; for (var i = 1; i <= a; i++) for (var j = 1; j <= b; j++) if (i + j === ta) count++;
  if (!count) { ta = 1 + b; count = 0; for (i = 1; i <= a; i++) for (j = 1; j <= b; j++) if (i + j === ta) count++; }
  var an = frac(count, a * b);
  return q("Probability: two events", "Spinner A is numbered 1–" + a + ", spinner B 1–" + b + ". Both are spun and the numbers added. P(total = " + ta + ")?", an, [frac(count, a + b), frac(1, a * b), frac(count + 1, a * b), frac(count, a * b + 1)].filter(function (x) { return x !== an; }),
    a + " × " + b + " = " + a * b + " outcomes; " + count + " give " + ta + ", so P = " + an + ".", "", { notes: { [frac(count, a + b)]: "Multiply the outcomes (" + a + " × " + b + " = " + a * b + "), don't add them." }, steps: ["Total outcomes: " + a + " × " + b + " = " + a * b + ".", "Pairs that make " + ta + ": " + count + ".", "P = " + count + "/" + a * b + (an !== count + "/" + a * b ? " = " + an : "") + "."], tip: "Sample space grid: rows for one event, columns for the other." });
};

function quad(b, c) { var bx = b === 0 ? "" : " " + (b < 0 ? "− " : "+ ") + (Math.abs(b) === 1 ? "" : Math.abs(b)) + "x"; return "x²" + bx + (c === 0 ? "" : " " + sgn(c)); }
/* --- Maths: expand, factorise, solve simple quadratics --- */
K.expandFactor = function (L) {
  var t = L === 1 ? pick(["expand1", "factor1"]) : L === 2 ? pick(["expand1", "factor1", "expand2"]) : pick(["expand2", "factorQ", "solveQ"]);
  if (t === "expand1") {
    var k = rnd(2, 7), a = rnd(1, 4), b = rnd(-9, 9) || 3, A = (a === 1 ? "" : a) + "x";
    var ans = (k * a) + "x " + sgn(k * b), notes = {}; notes[(k * a) + "x " + sgn(b)] = "Multiply BOTH terms in the bracket by " + k + ".";
    return q("Expanding & factorising", "Expand " + k + "(" + A + " " + sgn(b) + ")", ans, [(k * a) + "x " + sgn(b), (k + a) + "x " + sgn(k + b), (k * a) + "x " + sgn(-k * b)],
      k + " × " + A + " = " + (k * a) + "x and " + k + " × " + neg(b) + " = " + neg(k * b) + ".", "", { notes: notes, steps: ["Multiply " + k + " by " + A + ": " + (k * a) + "x.", "Multiply " + k + " by " + neg(b) + ": " + neg(k * b) + ".", ans + "."], tip: "The number outside multiplies EVERYTHING inside." });
  }
  if (t === "factor1") {
    var h = rnd(2, 6), p = rnd(1, 5), r = rnd(1, 9); while (gcd(p, r) !== 1) r = rnd(1, 9);
    var e = (h * p) + "x + " + (h * r), ansF = h + "(" + (p === 1 ? "" : p) + "x + " + r + ")";
    return q("Expanding & factorising", "Factorise fully: " + e, ansF, [(h * p) + "(x + " + r + ")", "x(" + (h * p) + " + " + (h * r) + ")", (h > 2 && h % 2 === 0 ? "2(" + (h * p / 2) + "x + " + (h * r / 2) + ")" : (h + 1) + "(" + p + "x + " + r + ")")],
      "The highest common factor of " + (h * p) + " and " + (h * r) + " is " + h + ": " + ansF + ".", "", { steps: ["Find the HCF of the numbers: " + h + ".", "Divide each term by " + h + ".", ansF + ". Check by expanding."], tip: "'Fully' means take out the HIGHEST common factor." });
  }
  if (t === "expand2") {
    var m = rnd(-7, 8) || 2, n = rnd(-7, 8) || -3, s = m + n, pr = m * n;
    var ans2 = quad(s, pr);
    var w1 = "x² " + sgn(pr), w2 = quad(s, m + n === 0 ? pr + 1 : s), w3 = "2x " + sgn(s);
    return q("Expanding & factorising", "Expand and simplify (x " + sgn(m) + ")(x " + sgn(n) + ")", ans2, [w1, w2, w3, quad(pr, s), quad(-s, pr)],
      "x × x = x², the middle terms give " + neg(s) + "x, and " + neg(m) + " × " + neg(n) + " = " + neg(pr) + ".", "", { notes: { [w1]: "You missed the middle terms. Every term in the first bracket multiplies every term in the second (FOIL or a grid)." }, steps: ["x × x = x².", "x × " + neg(n) + " + " + neg(m) + " × x = " + neg(s) + "x.", neg(m) + " × " + neg(n) + " = " + neg(pr) + ".", ans2 + "."], tip: "Grid or FOIL: First, Outer, Inner, Last." });
  }
  var r1 = rnd(-6, 6) || 1, r2 = rnd(-6, 6) || -2; while (r2 === r1) r2 = rnd(-6, 6) || 3;
  var B = -(r1 + r2), C = r1 * r2, expr = quad(B, C);
  if (t === "factorQ") {
    var fa = "(x " + sgn(-r1) + ")(x " + sgn(-r2) + ")";
    return q("Expanding & factorising", "Factorise " + expr, fa, ["(x " + sgn(r1) + ")(x " + sgn(r2) + ")", "(x " + sgn(-r1) + ")(x " + sgn(r2) + ")", "x(x " + sgn(B) + ") " + sgn(C)],
      "Find two numbers that multiply to " + neg(C) + " and add to " + neg(B) + ": " + neg(-r1) + " and " + neg(-r2) + ".", "", { notes: { ["(x " + sgn(r1) + ")(x " + sgn(r2) + ")"]: "Signs flipped. Expand your answer to check it gives " + expr + "." }, steps: ["Product = " + neg(C) + ", sum = " + neg(B) + ".", "Numbers: " + neg(-r1) + " and " + neg(-r2) + ".", fa + "."], tip: "x² + bx + c: find two numbers that MULTIPLY to c and ADD to b." });
  }
  var sol = "x = " + neg(Math.min(r1, r2)) + " or x = " + neg(Math.max(r1, r2));
  return q("Solving quadratics", "Solve " + expr + " = 0", sol, ["x = " + neg(-Math.max(r1, r2)) + " or x = " + neg(-Math.min(r1, r2)), "x = " + neg(Math.min(r1, r2)) + " only", "x = " + neg(C) + " or x = " + neg(B)],
    "It factorises to (x " + sgn(-r1) + ")(x " + sgn(-r2) + ") = 0, so one bracket must be 0: " + sol + ".", "", { notes: { ["x = " + neg(-Math.max(r1, r2)) + " or x = " + neg(-Math.min(r1, r2))]: "Signs flipped: if (x " + sgn(-r1) + ") = 0 then x = " + neg(r1) + "." }, steps: ["Factorise: (x " + sgn(-r1) + ")(x " + sgn(-r2) + ") = 0.", "Set each bracket to 0.", sol + "."], tip: "Factorise, then each bracket = 0. Flip the sign from the bracket." });
};

/* --- Maths: order of operations and calculator skills --- */
K.calcOrder = function (L) {
  var a = rnd(2, 9), b = rnd(2, 9), c = rnd(2, 9), d = rnd(1, 5), t = pick(L === 1 ? ["bidmas"] : ["bidmas", "frac", "power"]);
  if (t === "bidmas") {
    var ans = a + b * c, left = (a + b) * c;
    return q("Calculator & BIDMAS", "Work out " + a + " + " + b + " × " + c, ans, [left, a * b + c, ans + 1], "Multiply first: " + b + " × " + c + " = " + b * c + ", then + " + a + " = " + ans + ".", "",
      { notes: { [left]: "You added first. BIDMAS: multiplication before addition." }, steps: ["BIDMAS: × before +.", b + " × " + c + " = " + b * c + ".", a + " + " + b * c + " = " + ans + "."], tip: "Brackets, Indices, Division/Multiplication, Addition/Subtraction." });
  }
  if (t === "power") {
    var a2 = rnd(2, 5), ans2 = d + a2 * a2 * b;
    return q("Calculator & BIDMAS", "Work out " + d + " + " + b + " × " + a2 + "²", ans2, [Math.pow(d + b * a2, 2), (d + b) * a2 * a2, d + Math.pow(b * a2, 2)], "Indices first: " + a2 + "² = " + a2 * a2 + ". Then × " + b + " = " + a2 * a2 * b + ", then + " + d + " = " + ans2 + ".", "",
      { notes: { [d + Math.pow(b * a2, 2)]: "Only " + a2 + " is squared, not " + b + " × " + a2 + "." }, steps: [a2 + "² = " + a2 * a2 + ".", "× " + b + " = " + a2 * a2 * b + ".", "+ " + d + " = " + ans2 + "."], tip: "Powers before × and ÷." });
  }
  var top = a * c + b * c, ans3 = round2(top / c), wrongC = round2(a * c + b * c / c);
  return q("Calculator & BIDMAS", "Work out (" + a * c + " + " + b * c + ") ÷ " + c + ". On a calculator, what must you remember?", ans3 + " — use brackets round the top", [wrongC + " — type it straight in", round2(top * c) + " — use brackets", ans3 + 1 + " — use brackets round the top"],
    "The whole top is divided by " + c + ": (" + top + ") ÷ " + c + " = " + ans3 + ". Without brackets the calculator only divides " + b * c + ".", "",
    { notes: { [wrongC + " — type it straight in"]: "Without brackets, the calculator only divides the second number by " + c + "." }, steps: ["Add the top first: " + top + ".", top + " ÷ " + c + " = " + ans3 + "."], tip: "A fraction bar acts like brackets: put the top and bottom in brackets on a calculator." });
};

/* --- Science: 7F Acids and alkalis --- */
var ACIDS = [
  ["What colour does universal indicator turn in a strong acid?", "red", ["purple", "green", "blue"], "Strong acids (pH 0–2) turn universal indicator red.", {}],
  ["What pH is a neutral solution?", "7", ["0", "14", "1"], "Pure water is neutral: pH 7.", {}],
  ["Which pH is a strong alkali?", "13", ["7", "1", "5"], "pH 8–14 is alkaline; the higher, the stronger. pH 13 is strongly alkaline.", {}],
  ["What colour does universal indicator turn in a strong alkali?", "purple", ["red", "orange", "green"], "Strong alkalis turn universal indicator dark blue or purple.", {}],
  ["Acid + alkali → ?", "salt + water", ["salt + hydrogen", "carbon dioxide + water", "oxygen + water"], "This is neutralisation: an acid and an alkali make a salt and water.", {}],
  ["What is the reaction between an acid and an alkali called?", "neutralisation", ["combustion", "corrosion", "oxidation"], "The pH moves towards 7: neutralisation.", {}],
  ["Which hazard symbol would be on concentrated sulfuric acid?", "corrosive", ["flammable", "explosive", "toxic gas"], "Strong acids destroy skin and materials: corrosive.", {}],
  ["Which is an alkali?", "sodium hydroxide", ["hydrochloric acid", "vinegar", "lemon juice"], "Hydroxides of metals like sodium are alkalis.", {}],
  ["Why do people take antacid tablets for indigestion?", "to neutralise excess stomach acid", ["to make more acid", "to kill bacteria", "to add vitamins"], "Antacids are bases that neutralise hydrochloric acid in the stomach.", {}],
  ["What's the difference between concentrated and dilute acid?", "dilute has more water per amount of acid", ["dilute acid is stronger", "concentrated has more water", "they have the same pH"], "Diluting adds water, so there are fewer acid particles in the same volume.", {}],
  ["Red cabbage juice can be used as…", "an indicator", ["a neutral salt", "an alkali", "a catalyst"], "It changes colour depending on pH, so it's an indicator.", {}],
  ["A farmer adds lime (an alkali) to soil because the soil is…", "too acidic", ["too alkaline", "too dry", "too sandy"], "Lime neutralises acidic soil so crops grow better.", {}],
  ["Which word equation is right for hydrochloric acid + sodium hydroxide?", "sodium chloride + water", ["sodium + chlorine + water", "hydrogen + sodium chloride", "sodium hydroxide + water"], "Acid + alkali → salt + water. Hydrochloric acid makes chloride salts.", {}]
];
K.acids = function () { return kb("Acids & alkalis", ACIDS, "pH 0–6 acid · 7 neutral · 8–14 alkali. Acid + alkali → salt + water."); };

/* --- Science: 8I Fluids (density, pressure, floating, drag) --- */
var FLUIDS = [
  ["In which state are particles far apart and moving fast in all directions?", "gas", ["solid", "liquid", "all of them"], "Gas particles are spread out and move randomly at high speed.", {}],
  ["Why can a gas be squashed (compressed) but a liquid can't easily?", "gas particles have big spaces between them", ["gas particles are smaller", "liquid particles don't move", "gases have no mass"], "There's room to push gas particles closer together.", {}],
  ["What causes gas pressure in a balloon?", "particles hitting the walls", ["particles getting bigger", "the balloon pulling inwards", "gravity on the particles"], "Every collision with the wall is a tiny push; billions of them make pressure.", {}],
  ["What happens to gas pressure if you heat a sealed container?", "it increases", ["it decreases", "it stays the same", "it becomes zero"], "Particles move faster and hit the walls harder and more often.", {}],
  ["Why do your ears pop when diving deep in a pool?", "water pressure increases with depth", ["water pressure decreases with depth", "the water gets colder", "air pressure increases"], "More water above you = more weight pushing = more pressure.", {}],
  ["An object floats when…", "upthrust equals its weight", ["upthrust is zero", "its weight is bigger than upthrust", "it is made of metal"], "Balanced forces: upthrust from the water balances the weight.", {}],
  ["Ice floats on water because ice is…", "less dense than water", ["more dense than water", "lighter than air", "colder"], "Anything less dense than water floats.", {}],
  ["Which unit is used for density?", "g/cm³", ["N", "kg", "m/s"], "Density = mass ÷ volume, so g/cm³ or kg/m³.", {}],
  ["What is drag?", "a force that resists motion through a fluid", ["a force that pulls things down", "a turning force", "a magnetic force"], "Air resistance and water resistance are both drag.", {}],
  ["How does a cyclist reduce drag?", "crouching into a streamlined shape", ["sitting upright", "wearing loose clothes", "pedalling slower"], "A smaller front area pushes against less air.", {}],
  ["Why do hydraulic brakes use a liquid?", "liquids can't be compressed, so pressure is passed on", ["liquids are lighter", "liquids are cheaper", "liquids are hot"], "Pressing the pedal pushes the liquid, which pushes the brakes.", {}],
  ["Atmospheric pressure is lower at the top of a mountain because…", "there's less air above pushing down", ["it's colder", "it's windier", "there's more air above"], "Less air above you means less weight of air.", {}]
];
K.fluids = function (L) {
  if (L > 1 && Math.random() < 0.45) {
    var v = pick([2, 4, 5, 8, 10, 20, 25]), d = pick([0.5, 0.8, 1, 2.5, 7.9, 11.3, 19.3]), m = round2(v * d), find = pick(["d", "m"]);
    if (find === "d") return q("Density", "A block has a mass of " + fmt(m) + " g and a volume of " + v + " cm³. What is its density? Will it float in water (1 g/cm³)?", fmt(d) + " g/cm³ — " + (d < 1 ? "floats" : "sinks"), [fmt(round2(m * v)) + " g/cm³ — sinks", fmt(round2(v / m)) + " g/cm³ — " + (v / m < 1 ? "floats" : "sinks"), fmt(d) + " g/cm³ — " + (d < 1 ? "sinks" : "floats")],
      "Density = mass ÷ volume = " + fmt(m) + " ÷ " + v + " = " + fmt(d) + " g/cm³. " + (d < 1 ? "Less" : "Not less") + " than 1, so it " + (d < 1 ? "floats" : "sinks") + ".", "",
      { notes: { [fmt(round2(v / m)) + " g/cm³ — " + (v / m < 1 ? "floats" : "sinks")]: "Upside down: density = MASS ÷ volume." }, steps: ["Density = mass ÷ volume.", fmt(m) + " ÷ " + v + " = " + fmt(d) + ".", "Compare with water (1 g/cm³)."], tip: "ρ = m ÷ V. Less dense than water → floats." });
    return q("Density", "A metal has density " + fmt(d) + " g/cm³. What is the mass of " + v + " cm³ of it?", fmt(m) + " g", [fmt(round2(d / v)) + " g", fmt(round2(v / d)) + " g", fmt(d + v) + " g"],
      "Mass = density × volume = " + fmt(d) + " × " + v + " = " + fmt(m) + " g.", "", { steps: ["Rearrange: mass = density × volume.", fmt(d) + " × " + v + " = " + fmt(m) + "."], tip: "Formula triangle: m on top, ρ and V underneath." });
  }
  return kb("Fluids", FLUIDS, "Pressure in fluids comes from particles colliding. Deeper = more pressure. Less dense than water = floats.");
};

/* --- Science: 8G Metals and their uses --- */
var METALS = [
  ["Metal + acid → ?", "salt + hydrogen", ["salt + water", "metal oxide + water", "salt + oxygen"], "Reactive metals fizz in acid, giving off hydrogen gas.", { "salt + water": "That's acid + ALKALI (neutralisation)." }],
  ["What is the test for hydrogen gas?", "a lit splint gives a squeaky pop", ["it relights a glowing splint", "it turns limewater milky", "it bleaches damp litmus"], "Hydrogen burns with a squeaky pop.", { "it relights a glowing splint": "That's the test for oxygen." }],
  ["Iron rusts when it reacts with…", "oxygen and water", ["only oxygen", "only water", "nitrogen"], "Rusting needs both oxygen and water.", {}],
  ["Which is a way to stop iron rusting?", "painting it", ["putting it in salt water", "heating it", "making it wet"], "Paint keeps out air and water.", {}],
  ["What is an alloy?", "a mixture of a metal with other elements", ["a pure metal", "a type of acid", "a compound of two non-metals"], "Steel (iron + carbon) and brass (copper + zinc) are alloys.", {}],
  ["Why are alloys usually harder than pure metals?", "different-sized atoms stop the layers sliding", ["they contain more atoms", "they are colder", "they have no electrons"], "Different-sized atoms disrupt the neat layers, so they can't slide easily.", {}],
  ["Which metal reacts most vigorously with water?", "potassium", ["copper", "iron", "gold"], "Group 1 metals like potassium react violently with water.", {}],
  ["Metal + water → ?", "metal hydroxide + hydrogen", ["metal oxide + oxygen", "salt + water", "metal + steam"], "Reactive metals like sodium make a hydroxide (an alkali) and hydrogen.", {}],
  ["Which metal is so unreactive it's found pure in the ground?", "gold", ["sodium", "magnesium", "calcium"], "Unreactive metals like gold don't combine with other elements easily.", {}],
  ["Copper is used for electrical wires because it…", "conducts electricity well and is ductile", ["is magnetic", "is very reactive", "is cheap and brittle"], "Ductile means it can be drawn into wires.", {}],
  ["Metal + oxygen → ?", "metal oxide", ["metal hydroxide", "salt + water", "hydrogen"], "Burning or corroding metals in air forms oxides.", {}],
  ["Which property is typical of metals?", "good conductors of heat", ["brittle", "dull", "low melting point"], "Metals are shiny, conduct heat and electricity, and are malleable.", {}],
  ["Magnesium + hydrochloric acid → ?", "magnesium chloride + hydrogen", ["magnesium oxide + water", "magnesium hydroxide + chlorine", "magnesium chloride + water"], "Metal + acid → salt + hydrogen. Hydrochloric acid gives chlorides.", {}]
];
K.metals = function () { return kb("Metals", METALS, "Metal + acid → salt + hydrogen. Metal + oxygen → metal oxide. Rust needs oxygen AND water."); };

/* --- English: Gothic fiction --- */
var GOTHIC = [
  ["Which setting is most typical of Gothic fiction?", "a crumbling castle at midnight", ["a sunny beach", "a busy supermarket", "a modern classroom"], "Gothic settings are isolated, old, dark and decaying.", {}],
  ["What is pathetic fallacy?", "weather that reflects a mood", ["a sad character", "a mistake in a story", "a list of adjectives"], "e.g. a storm raging as a character becomes furious.", {}],
  ["Which word best describes the atmosphere in Gothic writing?", "foreboding", ["cheerful", "relaxed", "comic"], "Foreboding = a sense that something bad is coming.", {}],
  ["Who wrote ‘Frankenstein’?", "Mary Shelley", ["Bram Stoker", "Charles Dickens", "Edgar Allan Poe"], "Mary Shelley published Frankenstein in 1818.", {}],
  ["Who wrote ‘Dracula’?", "Bram Stoker", ["Mary Shelley", "Robert Louis Stevenson", "Emily Brontë"], "Bram Stoker, 1897.", {}],
  ["‘The Strange Case of Dr Jekyll and Mr Hyde’ explores…", "the duality of good and evil in one person", ["life at sea", "a school friendship", "a royal wedding"], "Stevenson shows a respectable man with a hidden, violent side.", {}],
  ["What is a ‘damsel in distress’?", "a vulnerable woman in danger, a common Gothic character", ["a villain's assistant", "a ghost", "a narrator"], "A stock Gothic character, often trapped or pursued.", {}],
  ["Why do Gothic writers use first-person narrators?", "to make fear feel personal and the narrator possibly unreliable", ["to make the story shorter", "to avoid describing settings", "to make it funny"], "We only see what the narrator sees, which builds tension.", {}],
  ["What is the effect of short sentences at a tense moment?", "they build tension and pace", ["they slow the story down", "they make it calm", "they add humour"], "Short sentences feel like quick breaths or heartbeats.", {}],
  ["Which is an example of the ‘supernatural’?", "a ghost walking through a wall", ["a train arriving late", "a thunderstorm", "a locked door"], "Supernatural = beyond the laws of nature.", {}],
  ["‘The candle flickered and died.’ This creates…", "suspense", ["humour", "romance", "relief"], "Losing the light leaves the character vulnerable in the dark.", {}],
  ["Gothic fiction became popular in which period?", "the late 18th and 19th centuries", ["the 1990s", "Roman times", "the 2010s"], "Walpole's ‘The Castle of Otranto’ (1764) started the genre.", {}]
];
K.gothic = function () { return kb("Gothic fiction", GOTHIC, "Gothic: isolated setting, darkness, the supernatural, pathetic fallacy, suspense, a sense of foreboding."); };

/* --- English: The Tempest --- */
var TEMPEST = [
  ["Who wrote ‘The Tempest’?", "William Shakespeare", ["Christopher Marlowe", "Charles Dickens", "Ben Jonson"], "Shakespeare, around 1610–11: one of his last plays.", {}],
  ["Who is Prospero?", "the rightful Duke of Milan, now a magician on the island", ["the King of Naples", "a sailor", "Caliban's father"], "His brother Antonio stole his dukedom and set him adrift with Miranda.", {}],
  ["Who is Prospero's daughter?", "Miranda", ["Ariel", "Juliet", "Sycorax"], "Miranda grew up on the island and has seen almost no other people.", {}],
  ["Who is Ariel?", "a spirit who serves Prospero", ["the King's son", "a monster", "Prospero's brother"], "Prospero freed Ariel from a tree; Ariel serves him to win freedom.", {}],
  ["Caliban says ‘This island's mine, by Sycorax my mother.’ What is he arguing?", "the island belonged to him before Prospero arrived", ["he wants to leave", "he loves Miranda", "he obeys Prospero"], "Caliban sees Prospero as a coloniser who took his land.", {}],
  ["What is the tempest at the start of the play?", "a storm raised by Prospero's magic", ["a battle", "a wedding", "a shipwreck caused by pirates"], "Ariel creates it on Prospero's orders to bring his enemies to the island.", {}],
  ["Who stole Prospero's dukedom?", "his brother Antonio", ["Caliban", "Ferdinand", "Gonzalo"], "Antonio, helped by Alonso, King of Naples.", {}],
  ["Which context is often linked to the play?", "European colonisation of new lands", ["the First World War", "the Industrial Revolution", "the Roman Empire"], "Written as Europeans explored and colonised the Americas.", {}],
  ["Who falls in love with Miranda?", "Ferdinand", ["Caliban", "Antonio", "Trinculo"], "Ferdinand, son of Alonso, King of Naples.", {}],
  ["How does Prospero treat Caliban?", "as a slave, controlling him with punishments", ["as a son", "as an equal", "as a king"], "He calls him ‘slave’ and torments him with cramps and pinches.", {}],
  ["What does Prospero do at the end of the play?", "gives up his magic and forgives his enemies", ["kills Antonio", "stays on the island forever", "becomes King of Naples"], "He breaks his staff and drowns his book, choosing forgiveness.", {}],
  ["In PEA(RL), what does the E stand for?", "evidence", ["ending", "effect", "example sentence"], "Point, Evidence, Analysis (Reader, Link).", {}]
];
K.tempest = function () { return kb("The Tempest", TEMPEST, "PEA(RL): Point, Evidence (a short quotation), Analysis of the words, effect on the Reader, Link to context."); };

/* --- French: le futur proche (aller + infinitive) --- */
var ALLER = { je: "vais", tu: "vas", "il/elle": "va", nous: "allons", vous: "allez", "ils/elles": "vont" };
var FP_VERBS = [["jouer au foot", "play football"], ["regarder un film", "watch a film"], ["manger une pizza", "eat a pizza"], ["faire mes devoirs", "do my homework"], ["sortir avec mes copains", "go out with my friends"], ["poster une photo", "post a photo"], ["acheter un maillot", "buy a shirt"], ["aller au cinéma", "go to the cinema"]];
var FP_EN = { je: "I am", tu: "You are", "il/elle": "He is", nous: "We are", vous: "You (all) are", "ils/elles": "They are" };
K.futurProche = function (L) {
  var p = pick(Object.keys(ALLER)), v = pick(FP_VERBS), act = p === "je" ? v[0] : v[0].replace("mes ", p === "nous" ? "nos " : p === "vous" ? "vos " : p === "tu" ? "tes " : "ses ");
  if (L === 1) return q("French: futur proche", "Choose the right part of aller: " + p + " ___ " + act + ".", ALLER[p], Object.keys(ALLER).filter(function (k) { return k !== p; }).map(function (k) { return ALLER[k]; }),
    p + " " + ALLER[p] + " + infinitive = going to " + v[1] + ".", "", { tip: "je vais, tu vas, il/elle va, nous allons, vous allez, ils/elles vont." });
  var subj = p === "je" ? "Je" : p === "il/elle" ? "Il" : p === "ils/elles" ? "Ils" : p.charAt(0).toUpperCase() + p.slice(1);
  var right = subj + " " + ALLER[p] + " " + act + ".";
  var conj = act.split(" ")[0].replace(/er$/, "e");
  return q("French: futur proche", "Translate: " + FP_EN[p] + " going to " + v[1] + ".", right, [subj + " " + conj + " " + act.split(" ").slice(1).join(" ") + ".", subj + " " + (ALLER[p] === "vais" ? "va" : "vais") + " " + act + ".", subj + " " + ALLER[p] + " " + conj + " " + act.split(" ").slice(1).join(" ") + "."],
    "Futur proche = present tense of aller + infinitive: " + right, "", { notes: { [subj + " " + ALLER[p] + " " + conj + " " + act.split(" ").slice(1).join(" ") + "."]: "Keep the second verb in the infinitive (" + act.split(" ")[0] + ")." }, tip: "aller (conjugated) + infinitive. Je vais jouer = I'm going to play." });
};

/* ===================== Revision topics for the new question sets ===================== */
REVISION.millie = REVISION.millie.concat([
  { id: "sq-cube", title: "Square & cube numbers", subject: "Maths", covered: "Multiplication & division", gens: ["squareCube"] },
  { id: "x10", title: "× and ÷ by 10, 100 and 1000", subject: "Maths", covered: "Multiplication & division", gens: ["mulDiv10", "powersTen"] },
  { id: "written-mult", title: "Written multiplication", subject: "Maths", covered: "Multiplication & division", gens: ["multiply"] },
  { id: "short-div", title: "Short division & remainders", subject: "Maths", covered: "Multiplication & division", gens: ["shortDiv"] },
  { id: "fdp", title: "Fractions, decimals & percentages", subject: "Maths", covered: "Decimals & percentages", gens: ["fdp", "decimals"] },
  { id: "fractions", title: "Equivalent fractions & mixed numbers", subject: "Maths", covered: "Fractions", gens: ["fractions"] },
  { id: "time", title: "Converting units of time", subject: "Maths", covered: "Measurement · Week 9 homework", gens: ["timeConv", "timeTable"] },
  { id: "time-24h", title: "12- and 24-hour times & durations", subject: "Maths", covered: "Week 9 homework · 9 Nov (day-out timetable)", gens: ["timeTable"] },
  { id: "measures", title: "Converting length, mass & capacity", subject: "Maths", covered: "Measurement", gens: ["unitConv"] },
  { id: "perim-area", title: "Perimeter & area", subject: "Maths", covered: "Measurement", gens: ["perimArea"] },
  { id: "angles", title: "Angles", subject: "Maths", covered: "Shape", gens: ["angles"] },
  { id: "negatives", title: "Negative numbers", subject: "Maths", covered: "Number & place value", gens: ["negatives"] },
  { id: "figurative", title: "Similes, metaphors & personification", subject: "English", covered: "Kensuke's Kingdom", gens: ["figurative"] },
  { id: "grammar5", title: "Grammar: clauses, pronouns, prefixes & modal verbs", subject: "English", covered: "Year 5 grammar · Week 9 homework", gens: ["grammar5", "grammar"] },
  { id: "earth-moon", title: "Earth, Sun & Moon", subject: "Science", covered: "Earth & Space", gens: ["earthMoon", "space"] },
  { id: "changes", title: "Reversible & irreversible changes", subject: "Science", covered: "Properties & changes of materials", gens: ["changes", "mixtures"] },
  { id: "forces", title: "Forces", subject: "Science", covered: "Forces", gens: ["forces"] },
  { id: "life-cycles", title: "Life cycles & growing up", subject: "Science", covered: "Living things", gens: ["lifeCycles"] }
]);
REVISION.kristan = REVISION.kristan.concat([
  { id: "eq-both", title: "Equations: brackets, fractions & x on both sides", subject: "Maths", covered: "Topic 1 · Linear equations", gens: ["eqBoth", "solveEq"] },
  { id: "calc", title: "Calculator skills & BIDMAS", subject: "Maths", covered: "Topic 2 · Calculators", gens: ["calcOrder"] },
  { id: "percent", title: "Multipliers, reverse % & compound interest", subject: "Maths", covered: "Topic 3 · Percentages", gens: ["pctMult"] },
  { id: "grouped", title: "Grouped data: estimated mean & modal class", subject: "Maths", covered: "Topic 4 · Statistics", gens: ["grouped", "freqMean"] },
  { id: "sample-space", title: "Sample spaces & two events", subject: "Maths", covered: "Topic 5 · Probability", gens: ["sampleSpace", "probability"] },
  { id: "expand-factor", title: "Expanding, factorising & quadratics", subject: "Maths", covered: "Topic 6 · Algebraic manipulation", gens: ["expandFactor", "simplify"] },
  { id: "acids", title: "7F Acids & alkalis", subject: "Science", covered: "7F Acids and alkalis", gens: ["acids"] },
  { id: "fluids", title: "8I Fluids: density, pressure & floating", subject: "Science", covered: "8I Fluids", gens: ["fluids"] },
  { id: "metals", title: "8G Metals & their uses", subject: "Science", covered: "8G Metals", gens: ["metals"] },
  { id: "gothic", title: "Gothic fiction", subject: "English", covered: "Gothic fiction unit", gens: ["gothic", "en:foreshadowing", "en:ominous", "en:desolate", "en:atmosphere", "en:melancholy"] },
  { id: "tempest", title: "The Tempest", subject: "English", covered: "Shakespeare: The Tempest", gens: ["tempest"] },
  { id: "fr-futur", title: "French: futur proche (aller + infinitive)", subject: "French", covered: "Free time & plans", gens: ["futurProche", "fr:vais", "fr:vas", "fr:va", "fr:allons", "fr:allez", "fr:vont"] }
]);

/* ===================== The curriculum map =====================
   status: "done" (taught already), "now" (in class this week), "next" (coming up soon), "later" (later this year).
   The school run updates `week`, `focus` and each unit's status from Toddle class posts and homework. */
var CURRICULUM = {
  millie: {
    year: "Year 5", updated: "2026-11-07", week: "Term 1 · Week 10 (from 9 Nov)",
    focus: "Converting units and reading timetables in maths, planets and orbits in science, and the Mars rover book Curiosity in English.",
    units: [
      { subject: "Maths", title: "Place value to 1,000,000", term: 1, status: "done", topics: ["place-value", "rounding", "negatives", "roman"] },
      { subject: "Maths", title: "Addition & subtraction", term: 1, status: "done", topics: ["mental-add", "column"] },
      { subject: "Maths", title: "Multiples, factors & primes", term: 1, status: "done", topics: ["factors", "multiples", "primes"] },
      { subject: "Maths", title: "Multiplication & division", term: 1, status: "now", why: "Week 8 homework: square and cube numbers, and × and ÷ by 10, 100 and 1,000.", topics: ["sq-cube", "x10", "written-mult", "short-div", "tables"] },
      { subject: "Maths", title: "Decimals & percentages", term: 1, status: "next", topics: ["fdp", "decimals"] },
      { subject: "Maths", title: "Measurement: time & length", term: 1, status: "now", why: "Week 9 homework: converting length, mass and time, with a 12/24-hour day-out timetable.", topics: ["time-24h", "time", "measures"] },
      { subject: "Maths", title: "Fractions", term: 2, status: "later", topics: ["fractions"] },
      { subject: "Maths", title: "Shape: angles & polygons", term: 2, status: "later", topics: ["angles"] },
      { subject: "Maths", title: "Perimeter, area & volume", term: 3, status: "later", topics: ["perim-area"] },
      { subject: "English", title: "Curiosity: The Story of a Mars Rover (new class book) & grammar", term: 1, status: "now", why: "New class text this week (inference, prediction, questions); Week 9 homework is a grammar sheet.", topics: ["grammar5", "figurative"] },
      { subject: "English", title: "Sentences: fronted adverbials, clauses & phrases", term: 1, status: "done", topics: ["grammar"] },
      { subject: "Science", title: "Properties & changes of materials", term: 1, status: "done", topics: ["materials", "states", "mixtures", "changes"] },
      { subject: "Science", title: "Earth & Space", term: 1, status: "now", why: "Week 9 homework: design a habitat for astronauts on Mars.", topics: ["earth-moon", "space"] },
      { subject: "Science", title: "Forces", term: 2, status: "later", topics: ["forces"] },
      { subject: "Science", title: "Living things & life cycles", term: 3, status: "later", topics: ["life-cycles"] }
    ]
  },
  kristan: {
    year: "Year 8", updated: "2026-11-04", week: "Term 1 · from 4 Nov",
    focus: "Probability in maths, Metals and their uses in science, and Ballads and Nabati poetry in English (group presentation on 9 Nov).",
    units: [
      { subject: "Maths", title: "Topic 1 · Linear equations", term: 1, status: "done", topics: ["eq-both", "equations", "algebra"] },
      { subject: "Maths", title: "Topic 2 · Calculators", term: 1, status: "done", topics: ["calc"] },
      { subject: "Maths", title: "Topic 3 · Percentages", term: 1, status: "done", topics: ["percent"] },
      { subject: "Maths", title: "Topic 4 · Statistics & averages", term: 1, status: "done", topics: ["averages", "freq", "grouped"] },
      { subject: "Maths", title: "Topic 5 · Probability", term: 1, status: "now", why: "Maths class flow: sample spaces, two-way tables and experimental probability.", topics: ["sample-space", "probability"] },
      { subject: "Maths", title: "Topic 6 · Algebraic manipulation", term: 1, status: "next", topics: ["expand-factor", "algebra"] },
      { subject: "Maths", title: "Earlier work: ratio, sequences, indices, angles", term: 0, status: "done", topics: ["ratio", "sequences", "indices", "angles", "rounding"] },
      { subject: "English", title: "Ballads and Nabati poetry (PEAL responses)", term: 1, status: "now", why: "Group project: present a Nabati poem on Mon 9 Nov, comparing it with the ballads.", topics: ["poetry", "eng-words"] },
      { subject: "English", title: "Gothic fiction", term: 1, status: "next", why: "The first unit in the Year 8 English overview, after the poetry assessment.", topics: ["gothic", "en-description"] },
      { subject: "English", title: "Shakespeare: The Tempest", term: 2, status: "later", topics: ["tempest", "en-analysing-texts", "en-character"] },
      { subject: "Science", title: "Animal reproduction (cells, organs, fertilisation, pregnancy)", term: 1, status: "done", topics: ["science"] },
      { subject: "Science", title: "8G Metals & their uses", term: 1, status: "now", why: "Science class flow: Topic 2, Metals and their uses.", topics: ["metals"] },
      { subject: "Science", title: "8I Fluids", term: 1, status: "later", topics: ["fluids"] },
      { subject: "Science", title: "7F Acids & alkalis", term: 2, status: "later", topics: ["acids"] },
      { subject: "Science", title: "KS3 basics: energy, cells & particles", term: 0, status: "done", topics: ["science"] },
      { subject: "French", title: "More about me", term: 1, status: "done", topics: ["fr-describing-people", "fr-family"] },
      { subject: "French", title: "Where I live", term: 1, status: "done", topics: ["fr-home", "fr-town"] },
      { subject: "French", title: "Free time, social media & aller + infinitive", term: 1, status: "now", why: "Vocab quiz on 2 Nov: Instagram, aller and activity verbs.", topics: ["fr-insta", "fr-futur", "fr-tech-social-media", "fr-free-time"] },
      { subject: "French", title: "TV and films", term: 2, status: "next", topics: ["fr-verbs-present"] },
      { subject: "French", title: "Clothes", term: 2, status: "later", topics: ["fr-clothes"] }
    ]
  }
};
/* Each revision topic's place in the plan: the status of the first unit that lists it ("now" wins over everything). */
function topicStatus(child, id) {
  var c = CURRICULUM[child]; if (!c) return null;
  var rank = { now: 0, next: 1, done: 2, later: 3 }, best = null, unit = null;
  c.units.forEach(function (u) { if (u.topics.indexOf(id) >= 0 && (best === null || rank[u.status] < rank[best])) { best = u.status; unit = u; } });
  return best ? { status: best, unit: unit } : null;
}
if (typeof module !== "undefined") Object.assign(module.exports, { CURRICULUM: CURRICULUM, topicStatus: topicStatus });
