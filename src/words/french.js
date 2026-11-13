/* Kristan's French bank (KS3). Each entry: [French (with le/la/l'/les for nouns), English, gender m/f/pl or "" , topic, kind n/v/a/p].
   Kinds: n = noun, v = verb (infinitive), a = adjective, p = phrase. */
WB.fr("2026-10-27", [
  ["le père", "father", "m", "Family", "n"], ["la mère", "mother", "f", "Family", "n"], ["le frère", "brother", "m", "Family", "n"],
  ["la sœur", "sister", "f", "Family", "n"], ["le grand-père", "grandfather", "m", "Family", "n"], ["la grand-mère", "grandmother", "f", "Family", "n"],
  ["l'oncle", "uncle", "m", "Family", "n"], ["la tante", "aunt", "f", "Family", "n"], ["le cousin", "cousin (boy)", "m", "Family", "n"],
  ["la cousine", "cousin (girl)", "f", "Family", "n"], ["les parents", "parents", "pl", "Family", "n"], ["le chien", "dog", "m", "Family", "n"],
  ["le chat", "cat", "m", "Family", "n"],

  ["le foot", "football", "m", "Free time", "n"], ["la natation", "swimming", "f", "Free time", "n"], ["le dessin", "drawing", "m", "Free time", "n"],
  ["la musique", "music", "f", "Free time", "n"], ["les jeux vidéo", "video games", "pl", "Free time", "n"], ["le cinéma", "cinema", "m", "Free time", "n"],
  ["la lecture", "reading", "f", "Free time", "n"], ["le vélo", "bike", "m", "Free time", "n"], ["l'équitation", "horse riding", "f", "Free time", "n"],
  ["la danse", "dancing", "f", "Free time", "n"], ["le basket", "basketball", "m", "Free time", "n"], ["les échecs", "chess", "pl", "Free time", "n"],
  ["jouer au foot", "to play football", "", "Free time", "p"], ["faire du vélo", "to go cycling", "", "Free time", "p"], ["faire de la natation", "to go swimming", "", "Free time", "p"],

  ["le pain", "bread", "m", "Food & drink", "n"], ["le fromage", "cheese", "m", "Food & drink", "n"], ["la pomme", "apple", "f", "Food & drink", "n"],
  ["l'eau", "water", "f", "Food & drink", "n"], ["le lait", "milk", "m", "Food & drink", "n"], ["le poulet", "chicken", "m", "Food & drink", "n"],
  ["le poisson", "fish", "m", "Food & drink", "n"], ["les frites", "chips", "pl", "Food & drink", "n"], ["la viande", "meat", "f", "Food & drink", "n"],
  ["les légumes", "vegetables", "pl", "Food & drink", "n"], ["le petit-déjeuner", "breakfast", "m", "Food & drink", "n"], ["le déjeuner", "lunch", "m", "Food & drink", "n"],
  ["le dîner", "dinner", "m", "Food & drink", "n"], ["la confiture", "jam", "f", "Food & drink", "n"], ["le gâteau", "cake", "m", "Food & drink", "n"],
  ["les fraises", "strawberries", "pl", "Food & drink", "n"], ["le jus d'orange", "orange juice", "m", "Food & drink", "n"],

  ["l'école", "school", "f", "School", "n"], ["le collège", "secondary school", "m", "School", "n"], ["la salle de classe", "classroom", "f", "School", "n"],
  ["le professeur", "teacher", "m", "School", "n"], ["la matière", "school subject", "f", "School", "n"], ["les maths", "maths", "pl", "School", "n"],
  ["l'anglais", "English (the subject)", "m", "School", "n"], ["l'histoire", "history", "f", "School", "n"], ["la géographie", "geography", "f", "School", "n"],
  ["les sciences", "science", "pl", "School", "n"], ["les devoirs", "homework", "pl", "School", "n"], ["la cantine", "canteen", "f", "School", "n"],
  ["la récréation", "break time", "f", "School", "n"], ["le cahier", "exercise book", "m", "School", "n"], ["la trousse", "pencil case", "f", "School", "n"],

  ["la ville", "town", "f", "Town", "n"], ["la gare", "train station", "f", "Town", "n"], ["la plage", "beach", "f", "Town", "n"],
  ["le parc", "park", "m", "Town", "n"], ["la piscine", "swimming pool", "f", "Town", "n"], ["le marché", "market", "m", "Town", "n"],
  ["la bibliothèque", "library", "f", "Town", "n"], ["le magasin", "shop", "m", "Town", "n"], ["l'église", "church", "f", "Town", "n"],
  ["le château", "castle", "m", "Town", "n"], ["le musée", "museum", "m", "Town", "n"], ["l'hôpital", "hospital", "m", "Town", "n"],
  ["la boulangerie", "bakery", "f", "Town", "n"], ["le centre commercial", "shopping centre", "m", "Town", "n"], ["le stade", "stadium", "m", "Town", "n"],

  ["la maison", "house", "f", "Home", "n"], ["l'appartement", "flat", "m", "Home", "n"], ["la chambre", "bedroom", "f", "Home", "n"],
  ["la cuisine", "kitchen", "f", "Home", "n"], ["le salon", "living room", "m", "Home", "n"], ["la salle de bains", "bathroom", "f", "Home", "n"],
  ["le jardin", "garden", "m", "Home", "n"], ["le lit", "bed", "m", "Home", "n"], ["la fenêtre", "window", "f", "Home", "n"],
  ["la porte", "door", "f", "Home", "n"], ["le canapé", "sofa", "m", "Home", "n"], ["l'escalier", "stairs", "m", "Home", "n"],

  ["il fait chaud", "it's hot", "", "Weather", "p"], ["il fait froid", "it's cold", "", "Weather", "p"], ["il fait beau", "the weather's nice", "", "Weather", "p"],
  ["il fait mauvais", "the weather's bad", "", "Weather", "p"], ["il pleut", "it's raining", "", "Weather", "p"], ["il neige", "it's snowing", "", "Weather", "p"],
  ["il y a du vent", "it's windy", "", "Weather", "p"], ["il y a du soleil", "it's sunny", "", "Weather", "p"], ["il y a du brouillard", "it's foggy", "", "Weather", "p"],
  ["il y a des nuages", "it's cloudy", "", "Weather", "p"],

  ["le portable", "mobile phone", "m", "Tech & social media", "n"], ["l'ordinateur", "computer", "m", "Tech & social media", "n"], ["la tablette", "tablet", "f", "Tech & social media", "n"],
  ["l'écran", "screen", "m", "Tech & social media", "n"], ["le mot de passe", "password", "m", "Tech & social media", "n"], ["les réseaux sociaux", "social media", "pl", "Tech & social media", "n"],
  ["envoyer", "to send", "", "Tech & social media", "v"], ["télécharger", "to download", "", "Tech & social media", "v"], ["partager", "to share", "", "Tech & social media", "v"],
  ["tchatter", "to chat online", "", "Tech & social media", "v"],

  ["le pantalon", "trousers", "m", "Clothes", "n"], ["la chemise", "shirt", "f", "Clothes", "n"], ["le jean", "jeans", "m", "Clothes", "n"],
  ["la robe", "dress", "f", "Clothes", "n"], ["la jupe", "skirt", "f", "Clothes", "n"], ["les chaussures", "shoes", "pl", "Clothes", "n"],
  ["les baskets", "trainers", "pl", "Clothes", "n"], ["le pull", "jumper", "m", "Clothes", "n"], ["la veste", "jacket", "f", "Clothes", "n"],
  ["le chapeau", "hat", "m", "Clothes", "n"], ["la casquette", "cap", "f", "Clothes", "n"],

  ["les vacances", "holidays", "pl", "Holidays", "n"], ["l'avion", "plane", "m", "Holidays", "n"], ["le train", "train", "m", "Holidays", "n"],
  ["la voiture", "car", "f", "Holidays", "n"], ["la valise", "suitcase", "f", "Holidays", "n"], ["le billet", "ticket", "m", "Holidays", "n"],
  ["la montagne", "mountains", "f", "Holidays", "n"], ["la mer", "sea", "f", "Holidays", "n"], ["le camping", "campsite", "m", "Holidays", "n"],
  ["l'hôtel", "hotel", "m", "Holidays", "n"],

  ["grand", "tall, big", "", "Describing people", "a"], ["petit", "small, short", "", "Describing people", "a"], ["drôle", "funny", "", "Describing people", "a"],
  ["sympa", "nice, friendly", "", "Describing people", "a"], ["timide", "shy", "", "Describing people", "a"], ["bavard", "chatty", "", "Describing people", "a"],
  ["sportif", "sporty", "", "Describing people", "a"], ["paresseux", "lazy", "", "Describing people", "a"], ["intelligent", "clever", "", "Describing people", "a"],
  ["gentil", "kind", "", "Describing people", "a"], ["méchant", "mean, nasty", "", "Describing people", "a"], ["ennuyeux", "boring", "", "Describing people", "a"],
  ["facile", "easy", "", "Describing people", "a"], ["difficile", "difficult", "", "Describing people", "a"], ["intéressant", "interesting", "", "Describing people", "a"],

  ["aimer", "to like, to love", "", "Verbs", "v"], ["détester", "to hate", "", "Verbs", "v"], ["préférer", "to prefer", "", "Verbs", "v"],
  ["habiter", "to live (somewhere)", "", "Verbs", "v"], ["parler", "to speak", "", "Verbs", "v"], ["écouter", "to listen", "", "Verbs", "v"],
  ["acheter", "to buy", "", "Verbs", "v"], ["boire", "to drink", "", "Verbs", "v"], ["dormir", "to sleep", "", "Verbs", "v"],
  ["lire", "to read", "", "Verbs", "v"], ["écrire", "to write", "", "Verbs", "v"], ["voyager", "to travel", "", "Verbs", "v"],

  ["je voudrais", "I would like", "", "Useful phrases", "p"], ["ça me plaît", "I like it", "", "Useful phrases", "p"], ["à mon avis", "in my opinion", "", "Useful phrases", "p"],
  ["je pense que", "I think that", "", "Useful phrases", "p"], ["parce que", "because", "", "Useful phrases", "p"], ["d'habitude", "usually", "", "Useful phrases", "p"],
  ["le week-end", "at the weekend", "", "Useful phrases", "p"], ["tous les jours", "every day", "", "Useful phrases", "p"], ["de temps en temps", "from time to time", "", "Useful phrases", "p"],
  ["ce soir", "this evening", "", "Useful phrases", "p"], ["demain", "tomorrow", "", "Useful phrases", "p"], ["hier", "yesterday", "", "Useful phrases", "p"],
  ["en plus", "what's more", "", "Useful phrases", "p"], ["cependant", "however", "", "Useful phrases", "p"]
]);

/* Present-tense verbs for "complete the verb" questions: forms for je, tu, il/elle/on, nous, vous, ils/elles, and an ending for the sentence. */
WB.verbs({
  avoir: { en: "to have", forms: ["ai", "as", "a", "avons", "avez", "ont"], end: "un chien", note: "Avoir is irregular: j'ai, tu as, il a, nous avons, vous avez, ils ont." },
  être: { en: "to be", forms: ["suis", "es", "est", "sommes", "êtes", "sont"], end: "à la maison", note: "Être is irregular: je suis, tu es, il est, nous sommes, vous êtes, ils sont." },
  aller: { en: "to go", forms: ["vais", "vas", "va", "allons", "allez", "vont"], end: "au cinéma", note: "Aller is irregular: je vais, tu vas, il va, nous allons, vous allez, ils vont." },
  faire: { en: "to do, to make", forms: ["fais", "fais", "fait", "faisons", "faites", "font"], end: "du sport", note: "Faire is irregular: je fais, tu fais, il fait, nous faisons, vous faites, ils font." },
  jouer: { en: "to play", forms: ["joue", "joues", "joue", "jouons", "jouez", "jouent"], end: "au foot", note: "Regular -er verb: take off -er, then add -e, -es, -e, -ons, -ez, -ent." },
  manger: { en: "to eat", forms: ["mange", "manges", "mange", "mangeons", "mangez", "mangent"], end: "une pizza", note: "Regular -er verb, but nous mangEons keeps an e so the g stays soft." },
  aimer: { en: "to like", forms: ["aime", "aimes", "aime", "aimons", "aimez", "aiment"], end: "le chocolat", note: "Regular -er verb: -e, -es, -e, -ons, -ez, -ent. Je becomes j' before a vowel: j'aime." },
  regarder: { en: "to watch", forms: ["regarde", "regardes", "regarde", "regardons", "regardez", "regardent"], end: "la télé", note: "Regular -er verb: -e, -es, -e, -ons, -ez, -ent." },
  habiter: { en: "to live", forms: ["habite", "habites", "habite", "habitons", "habitez", "habitent"], end: "à Londres", note: "Regular -er verb. The h is silent, so je becomes j': j'habite." },
  prendre: { en: "to take", forms: ["prends", "prends", "prend", "prenons", "prenez", "prennent"], end: "le bus", note: "Prendre is irregular: je prends, tu prends, il prend, nous prenons, vous prenez, ils prennent." },
  vouloir: { en: "to want", forms: ["veux", "veux", "veut", "voulons", "voulez", "veulent"], end: "sortir", note: "Vouloir is irregular: je veux, tu veux, il veut, nous voulons, vous voulez, ils veulent." },
  pouvoir: { en: "to be able to, can", forms: ["peux", "peux", "peut", "pouvons", "pouvez", "peuvent"], end: "venir", note: "Pouvoir is irregular: je peux, tu peux, il peut, nous pouvons, vous pouvez, ils peuvent." },
  finir: { en: "to finish", forms: ["finis", "finis", "finit", "finissons", "finissez", "finissent"], end: "les devoirs", note: "Regular -ir verb: -is, -is, -it, -issons, -issez, -issent." },
  sortir: { en: "to go out", forms: ["sors", "sors", "sort", "sortons", "sortez", "sortent"], end: "le samedi", note: "Sortir: je sors, tu sors, il sort, nous sortons, vous sortez, ils sortent." }
});

/* TV and films (Year 8 French, coming next). */
WB.fr("2026-11-04", [
  ["le film", "film", "m", "TV and films", "n"], ["la série", "series", "f", "TV and films", "n"], ["le dessin animé", "cartoon", "m", "TV and films", "n"],
  ["l'émission", "programme (on TV)", "f", "TV and films", "n"], ["les informations", "the news", "pl", "TV and films", "n"], ["la comédie", "comedy", "f", "TV and films", "n"],
  ["le film d'horreur", "horror film", "m", "TV and films", "n"], ["le film d'action", "action film", "m", "TV and films", "n"], ["le documentaire", "documentary", "m", "TV and films", "n"],
  ["la télé-réalité", "reality TV", "f", "TV and films", "n"], ["émouvant", "moving (emotional)", "", "TV and films", "a"], ["nul", "rubbish", "", "TV and films", "a"],
  ["effrayant", "scary", "", "TV and films", "a"], ["passionnant", "exciting", "", "TV and films", "a"], ["je préfère", "I prefer", "", "TV and films", "p"]
]);

/* Week of 13 Nov: what I did at the weekend (perfect tense), opinions and time phrases (vocab quiz Mon 16 Nov). */
WB.fr("2026-11-13", [
  ["génial", "great", "", "Last weekend", "a"], ["le désastre", "disaster", "m", "Last weekend", "n"], ["la fête", "party", "f", "Last weekend", "n"],
  ["le bowling", "bowling", "m", "Last weekend", "n"], ["le hamburger", "hamburger", "m", "Last weekend", "n"], ["hier soir", "last night", "", "Last weekend", "p"],
  ["le week-end dernier", "last weekend", "", "Last weekend", "p"], ["samedi dernier", "last Saturday", "", "Last weekend", "p"], ["la semaine dernière", "last week", "", "Last weekend", "p"],
  ["normalement", "normally", "", "Last weekend", "p"], ["tous les soirs", "every evening", "", "Last weekend", "p"], ["le week-end prochain", "next weekend", "", "Last weekend", "p"],
  ["samedi prochain", "next Saturday", "", "Last weekend", "p"], ["la semaine prochaine", "next week", "", "Last weekend", "p"], ["j'ai dansé", "I danced", "", "Last weekend", "p"],
  ["j'ai regardé", "I watched", "", "Last weekend", "p"], ["j'ai mangé", "I ate", "", "Last weekend", "p"], ["c'était", "it was", "", "Last weekend", "p"]
]);
