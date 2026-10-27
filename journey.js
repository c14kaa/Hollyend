/* ===== Millie's space journey =====
   Every correct answer is one star of fuel. Stars move her rocket from Earth out through the solar system;
   reaching a stop unlocks its postcard of real facts. Order: inner loop to the Sun, then out to the edge of the Sun's bubble. */
var JOURNEY = {
  start: { name: "Earth", color: ["#6fd3ff", "#1f6fd1"], r: 22 },
  stops: [
    { id: "moon", name: "The Moon", need: 20, r: 13, color: ["#f2f2f2", "#8d8d99"],
      facts: ["The Moon is about 384,000 km away. Light from it reaches us in just over a second.",
        "It always shows Earth the same face, so there's a side we never see from home.",
        "Twelve astronauts walked on the Moon between 1969 and 1972. Its gravity is about one-sixth of Earth's."] },
    { id: "venus", name: "Venus", need: 45, r: 19, color: ["#ffe3a3", "#d9902f"],
      facts: ["Venus is the hottest planet, about 465 °C, even though Mercury is closer to the Sun. Its thick clouds trap the heat.",
        "Venus spins backwards compared with most planets, so the Sun rises in the west there.",
        "A day on Venus (243 Earth days) is longer than its year (225 Earth days)."] },
    { id: "mercury", name: "Mercury", need: 75, r: 12, color: ["#d8cfc4", "#7c6f64"],
      facts: ["Mercury is the smallest planet and the closest to the Sun.",
        "A year on Mercury lasts only 88 Earth days.",
        "With almost no air to hold heat, it swings from about 430 °C in the day to about −180 °C at night."] },
    { id: "sun", name: "The Sun", need: 110, r: 30, color: ["#fff6a8", "#ff9a1f"], flyby: true,
      facts: ["The Sun is a star. About 109 Earths would fit across its middle.",
        "Sunlight takes about 8 minutes to reach Earth, so you always see the Sun as it was 8 minutes ago.",
        "NASA's Parker Solar Probe has flown closer to the Sun than anything people have ever built."] },
    { id: "mars", name: "Mars", need: 150, r: 15, color: ["#ffa27a", "#c1440e"],
      facts: ["Mars looks red because its dust is full of iron oxide: rust!",
        "Olympus Mons on Mars is the tallest volcano in the solar system, about two and a half times the height of Everest.",
        "Mars has two small moons, Phobos and Deimos, and robot rovers like Perseverance are exploring it now."] },
    { id: "ceres", name: "Ceres", need: 195, r: 10, color: ["#c9c3bb", "#6b655e"],
      facts: ["Ceres is the biggest object in the asteroid belt between Mars and Jupiter, and it's a dwarf planet.",
        "It's about 940 km across, roughly the width of France.",
        "NASA's Dawn spacecraft found bright spots in one of its craters: they're salty deposits."] },
    { id: "jupiter", name: "Jupiter", need: 250, r: 34, color: ["#f4dcb4", "#b97a45"], bands: true,
      facts: ["Jupiter is the biggest planet: more than 1,300 Earths could fit inside it.",
        "Its Great Red Spot is a storm wider than the whole Earth that has raged for hundreds of years.",
        "Its moon Ganymede is the largest moon in the solar system, even bigger than the planet Mercury."] },
    { id: "saturn", name: "Saturn", need: 310, r: 28, color: ["#fbe9b7", "#caa25a"], rings: true,
      facts: ["Saturn's rings are made of billions of chunks of ice and rock, some as small as grains of sand, some as big as houses.",
        "Saturn is so light for its size that it would float in a bath big enough to hold it.",
        "Saturn has more known moons than any other planet. Titan has lakes of liquid methane."] },
    { id: "uranus", name: "Uranus", need: 375, r: 22, color: ["#d4fbff", "#5ccfd9"], tilt: true,
      facts: ["Uranus spins on its side, so it rolls around the Sun like a ball.",
        "It's an ice giant, and methane gas makes it look blue-green.",
        "It was the first planet found with a telescope, by William Herschel in Bath, England, in 1781."] },
    { id: "neptune", name: "Neptune", need: 445, r: 21, color: ["#8fb6ff", "#2a4fd6"],
      facts: ["Neptune is the farthest planet from the Sun.",
        "It has the fastest winds in the solar system, over 2,000 km an hour.",
        "One year on Neptune lasts about 165 Earth years. It was found in 1846 by using maths to predict where it should be."] },
    { id: "pluto", name: "Pluto", need: 520, r: 10, color: ["#f3dcc8", "#a1806a"],
      facts: ["Pluto is a dwarf planet. It's smaller than our Moon.",
        "It has a huge heart-shaped area of ice on its surface.",
        "NASA's New Horizons spacecraft flew past Pluto in 2015 and sent back the first close-up photos."] },
    { id: "edge", name: "Edge of the Solar System", need: 600, r: 18, color: ["#e9d8ff", "#7b4fd6"], edge: true,
      facts: ["The Sun blows out a 'wind' of particles that makes a huge bubble around the solar system. Its edge is called the heliopause.",
        "Voyager 1, launched in 1977, crossed it in 2012: the first thing made by people to reach interstellar space.",
        "Voyager 1 carries a golden record with sounds and pictures from Earth, in case anyone out there finds it."] }
  ]
};

function journeyStars(all, child) {
  return all.filter(function (a) { return a.child === (child || "millie"); }).reduce(function (s, a) { return s + (a.score || 0); }, 0);
}
function journeyState(all, child) {
  var stars = journeyStars(all, child), S = JOURNEY.stops, reached = -1;
  S.forEach(function (s, i) { if (stars >= s.need) reached = i; });
  var next = S[reached + 1] || null, from = reached < 0 ? 0 : S[reached].need;
  var frac = next ? (stars - from) / (next.need - from) : 1;
  return { stars: stars, reached: reached, next: next, toNext: next ? next.need - stars : 0, frac: Math.max(0, Math.min(1, frac)),
    at: reached < 0 ? JOURNEY.start.name : S[reached].name, done: !next };
}

if (typeof module !== "undefined" && module.exports) module.exports = { JOURNEY: JOURNEY, journeyState: journeyState, journeyStars: journeyStars };
