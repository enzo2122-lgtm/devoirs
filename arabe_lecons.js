/* Leçons d'arabe — vérifiées le 8 octobre 2026 sur Wiktionary (conjugaison de كَتَبَ, pluriels, vocabulaire),
   Wikipédia EN (Sun and moon letters, Arabic grammar : pronoms, suffixes possessifs, démonstratifs),
   Madinah Arabic (méthode de Médine, leçons 1 à 3) et Almaany.
   Conventions : â î û = voyelles longues ; ' = hamza ou ʿayn ; sh = ch ; kh = r raclé ; dh = th anglais de « this » ;
   th = th anglais de « think » ; gh = r grasseyé ; u = « ou ».
   Les démonstratifs هَذَا / هَذِهِ / ذَلِكَ s'écrivent ici sans alif suscrit (ـٰ), comme dans les manuels scolaires. */
(function () {
  "use strict";
  window.ARABE_LECONS = [
    { id: "harakat", titre: "Les petites voyelles", emoji: "◌َ", g: 0,
      intro: [
        "En arabe, les voyelles courtes s'écrivent avec de petits signes au-dessus ou au-dessous des lettres.",
        "Ces petits signes s'appellent les harakât.",
        "Le petit trait au-dessus fait « a », le petit trait au-dessous fait « i », la petite boucle au-dessus fait « ou ».",
        "On lit l'arabe de droite à gauche."
      ],
      regles: [
        { signe: "َ", nom: "fatha", son: "a", explication: "un petit trait penché au-dessus de la lettre" },
        { signe: "ِ", nom: "kasra", son: "i", explication: "un petit trait penché au-dessous de la lettre" },
        { signe: "ُ", nom: "damma", son: "ou", explication: "une petite boucle (comme un petit و) au-dessus de la lettre" }
      ],
      exemples: [
        ["سَ", "sa", "syllabe sa", ""],
        ["سِ", "si", "syllabe si", ""],
        ["سُ", "su", "syllabe sou", ""],
        ["مَ مِ مُ", "ma mi mu", "syllabes ma, mi, mou", ""],
        ["كَتَبَ", "kataba", "il a écrit", "✍️"],
        ["ذَهَبَ", "dhahaba", "il est parti", "🚶"],
        ["جَلَسَ", "jalasa", "il s'est assis", "🪑"],
        ["فَتَحَ", "fataha", "il a ouvert", "🚪"],
        ["أَسَدٌ", "'asadun", "un lion", "🦁"],
        ["جَمَلٌ", "jamalun", "un chameau", "🐫"],
        ["رَجُلٌ", "rajulun", "un homme", "👨"],
        ["عِنَبٌ", "'inabun", "du raisin", "🍇"]
      ],
      quiz: [
        { q: "Quel son fait la fatha ( ـَ ) ?", bonne: "a", faux: ["i", "ou"] },
        { q: "Quel son fait la kasra ( ـِ ) ?", bonne: "i", faux: ["a", "ou"] },
        { q: "Quel son fait la damma ( ـُ ) ?", bonne: "ou", faux: ["a", "i"] },
        { q: "Où se place la kasra ?", bonne: "au-dessous de la lettre", faux: ["au-dessus de la lettre", "à côté de la lettre"] },
        { q: "Comment se lit سِ ?", bonne: "si", faux: ["sa", "sou"] },
        { q: "Comment se lit مُ ?", bonne: "mou", faux: ["ma", "mi"] },
        { q: "Comment se lit كَتَبَ ?", bonne: "kataba", faux: ["kitibi", "kutubu"] },
        { q: "Dans quel sens lit-on l'arabe ?", bonne: "de droite à gauche", faux: ["de gauche à droite", "de haut en bas"] }
      ] },

    { id: "soukoun", titre: "Le soukoun", emoji: "◌ْ", g: 0,
      intro: [
        "Parfois, une lettre n'a pas de voyelle : on la dit toute seule, sans « a », sans « i », sans « ou ».",
        "On met alors un petit rond au-dessus : c'est le soukoun.",
        "Dans كَلْبٌ, le ل porte un soukoun : on dit « kal », pas « kala »."
      ],
      regles: [
        { signe: "ْ", nom: "soukoun", son: "pas de voyelle", explication: "un petit rond au-dessus de la lettre : la lettre se prononce seule" }
      ],
      exemples: [
        ["بَبْ", "bab", "syllabe bab", ""],
        ["مِنْ", "min", "de (venant de)", ""],
        ["كَلْبٌ", "kalbun", "un chien", "🐕"],
        ["شَمْسٌ", "shamsun", "un soleil", "☀️"],
        ["بَحْرٌ", "bahrun", "une mer", "🌊"],
        ["بِنْتٌ", "bintun", "une fille", "👧"],
        ["نَجْمٌ", "najmun", "une étoile", "⭐"],
        ["قَلْبٌ", "qalbun", "un cœur", "❤️"]
      ],
      quiz: [
        { q: "À quoi ressemble le soukoun ?", bonne: "un petit rond au-dessus", faux: ["un petit trait au-dessous", "deux petits traits"] },
        { q: "Que veut dire le soukoun ?", bonne: "la lettre n'a pas de voyelle", faux: ["la lettre est doublée", "on dit « a » long"] },
        { q: "Comment se lit مِنْ ?", bonne: "min", faux: ["mini", "mana"] },
        { q: "Quelle lettre porte le soukoun dans شَمْسٌ ?", bonne: "م", faux: ["ش", "س"] },
        { q: "Comment se lit كَلْبٌ ?", bonne: "kalbun", faux: ["kalabun", "kilbun"] },
        { q: "Que veut dire بِنْتٌ ?", bonne: "une fille", faux: ["une mer", "une étoile"] }
      ] },

    { id: "longues", titre: "Les voyelles longues", emoji: "📏", g: 0,
      intro: [
        "Pour faire durer une voyelle, on ajoute une lettre après elle.",
        "Fatha + ا fait « â » long, kasra + ي fait « î » long, damma + و fait « oû » long.",
        "On chante un peu plus longtemps : « bâââb »."
      ],
      regles: [
        { signe: "ـَا", nom: "fatha + alif", son: "â", explication: "un « a » qui dure longtemps" },
        { signe: "ـِي", nom: "kasra + yâ'", son: "î", explication: "un « i » qui dure longtemps" },
        { signe: "ـُو", nom: "damma + wâw", son: "oû", explication: "un « ou » qui dure longtemps" }
      ],
      exemples: [
        ["بَا بِي بُو", "bâ bî bû", "syllabes longues bâ, bî, boû", ""],
        ["بَابٌ", "bâbun", "une porte", "🚪"],
        ["نَارٌ", "nârun", "un feu", "🔥"],
        ["كِتَابٌ", "kitâbun", "un livre", "📕"],
        ["فِيلٌ", "fîlun", "un éléphant", "🐘"],
        ["تِينٌ", "tînun", "des figues", ""],
        ["دِيكٌ", "dîkun", "un coq", "🐓"],
        ["نُورٌ", "nûrun", "une lumière", "💡"],
        ["سُوقٌ", "sûqun", "un marché", "🛒"]
      ],
      quiz: [
        { q: "Quelle lettre allonge la fatha ?", bonne: "ا", faux: ["و", "ي"] },
        { q: "Quelle lettre allonge la kasra ?", bonne: "ي", faux: ["ا", "و"] },
        { q: "Quelle lettre allonge la damma ?", bonne: "و", faux: ["ا", "ي"] },
        { q: "Comment se lit بُو ?", bonne: "boû (long)", faux: ["ba", "bî"] },
        { q: "Comment se lit فِيلٌ ?", bonne: "fîlun", faux: ["filun", "fâlun"] },
        { q: "Que veut dire بَابٌ ?", bonne: "une porte", faux: ["un livre", "un feu"] },
        { q: "Dans نُورٌ, quel son est long ?", bonne: "oû", faux: ["â", "î"] }
      ] },

    { id: "chadda", titre: "La chadda", emoji: "◌ّ", g: 1,
      intro: [
        "La chadda est un petit signe en forme de « w » posé au-dessus d'une lettre.",
        "Elle veut dire que la lettre est doublée : on la prononce deux fois, en appuyant.",
        "La petite voyelle se met avec la chadda : la fatha et la damma au-dessus, la kasra juste sous la chadda (ou sous la lettre).",
        "Exemple : سُكَّرٌ se lit « soukkar », avec deux k."
      ],
      regles: [
        { signe: "ّ", nom: "chadda", son: "lettre doublée", explication: "un petit « w » au-dessus : la lettre compte deux fois (la 1re sans voyelle, la 2e avec la voyelle)" }
      ],
      exemples: [
        ["بَّ", "bba", "b doublé + a", ""],
        ["أُمٌّ", "'ummun", "une mère", "👩"],
        ["دُبٌّ", "dubbun", "un ours", "🐻"],
        ["قِطَّةٌ", "qittatun", "une chatte", "🐈"],
        ["سُكَّرٌ", "sukkarun", "du sucre", "🍬"],
        ["جَدَّةٌ", "jaddatun", "une grand-mère", "👵"],
        ["تُفَّاحٌ", "tuffâhun", "des pommes", "🍎"],
        ["مُعَلِّمٌ", "mu'allimun", "un maître, un enseignant", "👨‍🏫"],
        ["حَمَّامٌ", "hammâmun", "une salle de bains", "🛁"]
      ],
      quiz: [
        { q: "Que veut dire la chadda ?", bonne: "la lettre est doublée", faux: ["la lettre n'a pas de voyelle", "la voyelle est longue"] },
        { q: "À quoi ressemble la chadda ?", bonne: "un petit « w » au-dessus", faux: ["un petit rond", "deux traits au-dessous"] },
        { q: "Comment se lit دُبٌّ ?", bonne: "dubbun", faux: ["dubun", "dâbun"] },
        { q: "Quelle lettre est doublée dans سُكَّرٌ ?", bonne: "ك", faux: ["س", "ر"] },
        { q: "Que veut dire أُمٌّ ?", bonne: "une mère", faux: ["un ours", "du sucre"] },
        { q: "Comment se lit مُعَلِّمٌ ?", bonne: "mu'allimun", faux: ["mu'alimun", "ma'lamun"] }
      ] },

    { id: "tanwin", titre: "Le tanwîn", emoji: "◌ٌ", g: 1,
      intro: [
        "Le tanwîn, c'est une petite voyelle écrite deux fois à la fin d'un mot : on ajoute alors un son « n ».",
        "Deux damma font « -un », deux kasra font « -in », deux fatha font « -an ».",
        "Le tanwîn montre qu'un nom est indéfini : كِتَابٌ veut dire « un livre ».",
        "Avec « -an », on ajoute souvent un alif à la fin (كِتَابًا), sauf après ة (مَدْرَسَةً).",
        "À la fin d'une phrase, on ne prononce souvent pas le tanwîn."
      ],
      regles: [
        { signe: "ٌ", nom: "dammatân", son: "-un", explication: "deux damma : nominatif (le sujet)" },
        { signe: "ٍ", nom: "kasratân", son: "-in", explication: "deux kasra au-dessous : après une préposition, par exemple" },
        { signe: "ً", nom: "fathatân", son: "-an", explication: "deux fatha : complément d'objet ; on ajoute ا, sauf après ة, ـَاء ou ى" }
      ],
      exemples: [
        ["كِتَابٌ", "kitâbun", "un livre (sujet)", "📕"],
        ["كِتَابًا", "kitâban", "un livre (complément)", "📕"],
        ["كِتَابٍ", "kitâbin", "un livre (après une préposition)", "📕"],
        ["بَيْتٌ", "baytun", "une maison", "🏠"],
        ["مَدْرَسَةً", "madrasatan", "une école (complément)", "🏫"],
        ["شُكْرًا", "shukran", "merci", "🙏"],
        ["أَهْلًا", "'ahlan", "bienvenue, salut", "👋"],
        ["فِي بَيْتٍ", "fî baytin", "dans une maison", "🏠"]
      ],
      quiz: [
        { q: "Quel son fait ـٌ (deux damma) ?", bonne: "-un", faux: ["-an", "-in"] },
        { q: "Quel son fait ـٍ (deux kasra) ?", bonne: "-in", faux: ["-un", "-an"] },
        { q: "Quel son fait ـً (deux fatha) ?", bonne: "-an", faux: ["-un", "-in"] },
        { q: "Comment se lit شُكْرًا ?", bonne: "shukran", faux: ["shukrun", "shukrin"] },
        { q: "Que montre le tanwîn sur un nom ?", bonne: "le nom est indéfini (un, une)", faux: ["le nom est au pluriel", "le nom est féminin"] },
        { q: "Quelle lettre ajoute-t-on souvent après le tanwîn « -an » ?", bonne: "ا", faux: ["و", "ي"] },
        { q: "Comment se lit فِي بَيْتٍ ?", bonne: "fî baytin", faux: ["fî baytun", "fî baytan"] }
      ] },

    { id: "tamarbouta", titre: "La tâ' marbûta et le féminin", emoji: "🎀", g: 1,
      intro: [
        "La lettre ة s'appelle tâ' marbûta (« t attaché ») : elle ressemble à un ه avec deux points.",
        "On la trouve à la fin des mots, et elle marque très souvent le féminin.",
        "Pour mettre un mot au féminin, on ajoute souvent ـَة : طَالِبٌ → طَالِبَةٌ.",
        "Quand on s'arrête à la fin d'une phrase, ة se prononce comme un « a » ; sinon, elle se dit « t »."
      ],
      regles: [
        { signe: "ة / ـة", nom: "tâ' marbûta", son: "-a (en pause) / -t", explication: "toujours en fin de mot, presque toujours précédée d'une fatha" }
      ],
      exemples: [
        ["طَالِبٌ / طَالِبَةٌ", "tâlibun / tâlibatun", "un élève / une élève", "🎒"],
        ["مُعَلِّمٌ / مُعَلِّمَةٌ", "mu'allimun / mu'allimatun", "un enseignant / une enseignante", "👩‍🏫"],
        ["كَبِيرٌ / كَبِيرَةٌ", "kabîrun / kabîratun", "grand / grande", ""],
        ["صَغِيرٌ / صَغِيرَةٌ", "saghîrun / saghîratun", "petit / petite", ""],
        ["مَدْرَسَةٌ", "madrasatun", "une école", "🏫"],
        ["شَجَرَةٌ", "shajaratun", "un arbre", "🌳"],
        ["سَيَّارَةٌ", "sayyâratun", "une voiture", "🚗"],
        ["تُفَّاحَةٌ", "tuffâhatun", "une pomme", "🍎"]
      ],
      quiz: [
        { q: "Comment s'appelle la lettre ة ?", bonne: "tâ' marbûta", faux: ["hâ'", "tâ'"] },
        { q: "Où se trouve toujours ة ?", bonne: "à la fin du mot", faux: ["au début du mot", "au milieu du mot"] },
        { q: "Que marque souvent ة ?", bonne: "le féminin", faux: ["le pluriel", "le passé"] },
        { q: "Quel est le féminin de طَالِبٌ ?", bonne: "طَالِبَةٌ", faux: ["طُلَّابٌ", "طَالِبُونَ"] },
        { q: "Que veut dire كَبِيرَةٌ ?", bonne: "grande", faux: ["petite", "belle"] },
        { q: "Comment dit-on شَجَرَة quand on s'arrête dessus ?", bonne: "shajara", faux: ["shajarun", "shajarî"] }
      ] },

    { id: "article", titre: "L'article ال : lettres solaires et lunaires", emoji: "☀️", g: 1,
      intro: [
        "« Le » ou « la » se dit ال (al) en arabe, et il se colle au début du mot : بَيْتٌ (une maison) → الْبَيْتُ (la maison).",
        "Avec l'article, le mot perd son tanwîn.",
        "Devant les 14 lettres lunaires, on entend bien le ل : الْقَمَرُ (al-qamaru, la lune). Le ل porte un soukoun.",
        "Devant les 14 lettres solaires, le ل ne se prononce pas : la lettre suivante est doublée et porte une chadda : الشَّمْسُ (ash-shamsu, le soleil).",
        "Lettres solaires : ت ث د ذ ر ز س ش ص ض ط ظ ل ن. Lettres lunaires : ا(ء) ب ج ح خ ع غ ف ق ك م ه و ي."
      ],
      regles: [
        { signe: "الْـ", nom: "lettres lunaires (قَمَرِيَّة)", son: "al-", explication: "ا(ء) ب ج ح خ ع غ ف ق ك م ه و ي : on prononce le ل" },
        { signe: "الشَّـ", nom: "lettres solaires (شَمْسِيَّة)", son: "a + lettre doublée", explication: "ت ث د ذ ر ز س ش ص ض ط ظ ل ن : le ل est muet, chadda sur la lettre suivante" }
      ],
      exemples: [
        ["الشَّمْسُ", "ash-shamsu", "le soleil (solaire : ش)", "☀️"],
        ["التِّينُ", "at-tînu", "les figues (solaire : ت)", ""],
        ["الدُّبُّ", "ad-dubbu", "l'ours (solaire : د)", "🐻"],
        ["الرَّجُلُ", "ar-rajulu", "l'homme (solaire : ر)", "👨"],
        ["السُّوقُ", "as-sûqu", "le marché (solaire : س)", "🛒"],
        ["النُّورُ", "an-nûru", "la lumière (solaire : ن)", "💡"],
        ["اللَّوْنُ", "al-lawnu", "la couleur (solaire : ل)", "🎨"],
        ["الْقَمَرُ", "al-qamaru", "la lune (lunaire : ق)", "🌙"],
        ["الْبَيْتُ", "al-baytu", "la maison (lunaire : ب)", "🏠"],
        ["الْكِتَابُ", "al-kitâbu", "le livre (lunaire : ك)", "📕"],
        ["الْفِيلُ", "al-fîlu", "l'éléphant (lunaire : ف)", "🐘"],
        ["الْوَلَدُ", "al-waladu", "le garçon (lunaire : و)", "👦"],
        ["الْمَدْرَسَةُ", "al-madrasatu", "l'école (lunaire : م)", "🏫"]
      ],
      quiz: [
        { q: "Combien y a-t-il de lettres solaires ?", bonne: "14", faux: ["7", "28"] },
        { q: "Comment se lit الشَّمْسُ ?", bonne: "ash-shamsu", faux: ["al-shamsu", "a-samsu"] },
        { q: "Comment se lit الْقَمَرُ ?", bonne: "al-qamaru", faux: ["aq-qamaru", "a-qamaru"] },
        { q: "La lettre ب est-elle solaire ou lunaire ?", bonne: "lunaire", faux: ["solaire", "ni l'une ni l'autre"] },
        { q: "La lettre ر est-elle solaire ou lunaire ?", bonne: "solaire", faux: ["lunaire", "ni l'une ni l'autre"] },
        { q: "Laquelle de ces lettres est solaire ?", bonne: "ن", faux: ["م", "ك"] },
        { q: "Laquelle de ces lettres est lunaire ?", bonne: "ج", faux: ["د", "س"] },
        { q: "Devant une lettre solaire, que devient le ل de ال ?", bonne: "il est muet et la lettre suivante est doublée", faux: ["il se prononce fort", "il devient un n"] },
        { q: "Comment dit-on « le livre » ?", bonne: "الْكِتَابُ", faux: ["كِتَابٌ", "كُتُبٌ"] }
      ] },

    { id: "nonliees", titre: "Les lettres qui ne s'attachent pas", emoji: "🔗", g: 1,
      intro: [
        "En arabe, les lettres d'un mot s'attachent les unes aux autres.",
        "Mais six lettres ne s'attachent jamais à la lettre qui vient après elles : ا د ذ ر ز و.",
        "Elles s'attachent à la lettre d'avant, puis on laisse un petit espace.",
        "C'est pour cela qu'un seul mot peut sembler coupé en morceaux, comme دَارٌ ou وَرْدَةٌ."
      ],
      regles: [
        { signe: "ا", nom: "alif", son: "a / â", explication: "ne s'attache pas à la lettre suivante" },
        { signe: "د", nom: "dâl", son: "d", explication: "ne s'attache pas à la lettre suivante" },
        { signe: "ذ", nom: "dhâl", son: "dh (th anglais de « this »)", explication: "ne s'attache pas à la lettre suivante" },
        { signe: "ر", nom: "râ'", son: "r roulé", explication: "ne s'attache pas à la lettre suivante" },
        { signe: "ز", nom: "zây", son: "z", explication: "ne s'attache pas à la lettre suivante" },
        { signe: "و", nom: "wâw", son: "w / oû", explication: "ne s'attache pas à la lettre suivante" }
      ],
      exemples: [
        ["دَارٌ", "dârun", "une maison, une demeure", "🏡"],
        ["وَرْدَةٌ", "wardatun", "une rose", "🌹"],
        ["زَرَافَةٌ", "zarâfatun", "une girafe", "🦒"],
        ["ذُرَةٌ", "dhuratun", "du maïs", "🌽"],
        ["أَرْنَبٌ", "'arnabun", "un lapin", "🐇"],
        ["وَلَدٌ", "waladun", "un garçon", "👦"],
        ["دُودٌ", "dûdun", "des vers", "🪱"],
        ["رَأْسٌ", "ra'sun", "une tête", "🙂"],
        ["زَيْتٌ", "zaytun", "de l'huile", "🫒"]
      ],
      quiz: [
        { q: "Combien de lettres ne s'attachent pas à la suivante ?", bonne: "6", faux: ["4", "14"] },
        { q: "Laquelle de ces lettres ne s'attache pas à la suivante ?", bonne: "ر", faux: ["ب", "م"] },
        { q: "Laquelle de ces lettres ne s'attache pas à la suivante ?", bonne: "و", faux: ["ي", "ن"] },
        { q: "Laquelle de ces lettres s'attache à la suivante ?", bonne: "ل", faux: ["د", "ز"] },
        { q: "Que veut dire وَرْدَةٌ ?", bonne: "une rose", faux: ["un garçon", "une girafe"] },
        { q: "Comment se lit أَرْنَبٌ ?", bonne: "'arnabun", faux: ["'aranabun", "'irnibun"] },
        { q: "Pourquoi دَارٌ semble-t-il coupé ?", bonne: "ا et د ne s'attachent pas à la lettre suivante", faux: ["ce sont deux mots", "il manque une lettre"] }
      ] },

    { id: "chiffres", titre: "Les chiffres et les nombres", emoji: "🔢", g: 0,
      intro: [
        "Nos chiffres 0 1 2 3… s'appellent les « chiffres arabes » : nés en Inde, ils sont arrivés en Europe par l'Afrique du Nord et l'Espagne musulmane.",
        "Au Moyen-Orient, on écrit souvent d'autres chiffres, les chiffres « arabes orientaux » : ٠ ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩.",
        "Attention : le point ٠ veut dire 0 et le ٥ (qui ressemble à un 0) veut dire 5 !",
        "Les nombres s'écrivent de gauche à droite, comme en français : ١٢ = 12."
      ],
      regles: [
        { signe: "٠ ١ ٢ ٣ ٤", nom: "zéro à quatre", son: "sifr, wâhid, ithnân, thalâtha, 'arba'a", explication: "0 1 2 3 4" },
        { signe: "٥ ٦ ٧ ٨ ٩", nom: "cinq à neuf", son: "khamsa, sitta, sab'a, thamâniya, tis'a", explication: "5 6 7 8 9" }
      ],
      exemples: [
        ["٠ صِفْرٌ", "sifrun", "0, zéro", "0️⃣"],
        ["١ وَاحِدٌ", "wâhidun", "1, un", "1️⃣"],
        ["٢ اِثْنَانِ", "ithnâni", "2, deux", "2️⃣"],
        ["٣ ثَلَاثَةٌ", "thalâthatun", "3, trois", "3️⃣"],
        ["٤ أَرْبَعَةٌ", "'arba'atun", "4, quatre", "4️⃣"],
        ["٥ خَمْسَةٌ", "khamsatun", "5, cinq", "5️⃣"],
        ["٦ سِتَّةٌ", "sittatun", "6, six", "6️⃣"],
        ["٧ سَبْعَةٌ", "sab'atun", "7, sept", "7️⃣"],
        ["٨ ثَمَانِيَةٌ", "thamâniyatun", "8, huit", "8️⃣"],
        ["٩ تِسْعَةٌ", "tis'atun", "9, neuf", "9️⃣"],
        ["١٠ عَشَرَةٌ", "'asharatun", "10, dix", "🔟"]
      ],
      quiz: [
        { q: "Quel chiffre est ٣ ?", bonne: "3", faux: ["2", "7"] },
        { q: "Quel chiffre est ٥ ?", bonne: "5", faux: ["0", "8"] },
        { q: "Quel chiffre est ٠ ?", bonne: "0", faux: ["5", "1"] },
        { q: "Quel chiffre est ٧ ?", bonne: "7", faux: ["8", "6"] },
        { q: "Quel nombre est ١٢ ?", bonne: "12", faux: ["21", "3"] },
        { q: "Comment écrit-on 4 en chiffres arabes orientaux ?", bonne: "٤", faux: ["٦", "٢"] },
        { q: "Que veut dire خَمْسَةٌ ?", bonne: "cinq", faux: ["six", "trois"] },
        { q: "Comment dit-on « dix » ?", bonne: "عَشَرَةٌ", faux: ["تِسْعَةٌ", "وَاحِدٌ"] }
      ] },

    { id: "pronoms", titre: "Les pronoms personnels", emoji: "🧑‍🤝‍🧑", g: 1,
      intro: [
        "Les pronoms remplacent un nom : je, tu, il, elle…",
        "En arabe, « tu » change selon qu'on parle à un garçon (أَنْتَ) ou à une fille (أَنْتِ).",
        "La seule différence s'écrit avec la petite voyelle sur le ت : fatha pour un garçon, kasra pour une fille.",
        "Il existe aussi des formes pour deux personnes (le duel) : أَنْتُمَا, هُمَا."
      ],
      exemples: [
        ["أَنَا", "'anâ", "je, moi", "🙋"],
        ["أَنْتَ", "'anta", "tu, toi (à un garçon)", "👦"],
        ["أَنْتِ", "'anti", "tu, toi (à une fille)", "👧"],
        ["هُوَ", "huwa", "il, lui", "👨"],
        ["هِيَ", "hiya", "elle", "👩"],
        ["نَحْنُ", "nahnu", "nous", "👨‍👩‍👧"],
        ["أَنْتُمْ", "'antum", "vous (plusieurs)", "👥"],
        ["هُمْ", "hum", "ils, eux", "👥"],
        ["هُنَّ", "hunna", "elles", "👭"],
        ["أَنَا وَلَدٌ.", "'anâ waladun.", "Je suis un garçon.", "👦"],
        ["هِيَ بِنْتٌ.", "hiya bintun.", "C'est une fille. (Elle est une fille.)", "👧"]
      ],
      quiz: [
        { q: "Que veut dire أَنَا ?", bonne: "je, moi", faux: ["tu", "nous"] },
        { q: "Comment dit-on « tu » à une fille ?", bonne: "أَنْتِ", faux: ["أَنْتَ", "أَنْتُمْ"] },
        { q: "Comment dit-on « tu » à un garçon ?", bonne: "أَنْتَ", faux: ["أَنْتِ", "أَنَا"] },
        { q: "Que veut dire هِيَ ?", bonne: "elle", faux: ["il", "ils"] },
        { q: "Que veut dire نَحْنُ ?", bonne: "nous", faux: ["vous", "ils"] },
        { q: "Comment dit-on « il » ?", bonne: "هُوَ", faux: ["هِيَ", "هُمْ"] },
        { q: "Que veut dire أَنْتُمْ ?", bonne: "vous (plusieurs)", faux: ["nous", "tu"] },
        { q: "Comment se lit هُمْ ?", bonne: "hum", faux: ["huma", "hiya"] }
      ] },

    { id: "demonstratifs", titre: "Ceci, cela", emoji: "👉", g: 1,
      intro: [
        "Pour montrer quelque chose de proche, on dit هَذَا (masculin) ou هَذِهِ (féminin) : « ceci, celui-ci, celle-ci ».",
        "Pour quelque chose de loin, on dit ذَلِكَ (masculin) ou تِلْكَ (féminin) : « cela, celui-là, celle-là ».",
        "Le premier « a » de هَذَا, هَذِهِ et ذَلِكَ se prononce long (hâdhâ, hâdhihi, dhâlika), même si on n'écrit pas d'alif.",
        "هَذَا كِتَابٌ veut dire « ceci est un livre » : en arabe, on n'a pas besoin du verbe « être »."
      ],
      regles: [
        { signe: "هَذَا", nom: "proche, masculin", son: "hâdhâ", explication: "ceci, celui-ci" },
        { signe: "هَذِهِ", nom: "proche, féminin", son: "hâdhihi", explication: "ceci, celle-ci" },
        { signe: "ذَلِكَ", nom: "loin, masculin", son: "dhâlika", explication: "cela, celui-là" },
        { signe: "تِلْكَ", nom: "loin, féminin", son: "tilka", explication: "cela, celle-là" }
      ],
      exemples: [
        ["هَذَا كِتَابٌ.", "hâdhâ kitâbun.", "Ceci est un livre.", "📕"],
        ["هَذِهِ سَيَّارَةٌ.", "hâdhihi sayyâratun.", "Ceci est une voiture.", "🚗"],
        ["ذَلِكَ بَيْتٌ.", "dhâlika baytun.", "Cela (là-bas) est une maison.", "🏠"],
        ["تِلْكَ شَجَرَةٌ.", "tilka shajaratun.", "Cela (là-bas) est un arbre.", "🌳"],
        ["هَذَا وَلَدٌ.", "hâdhâ waladun.", "C'est un garçon.", "👦"],
        ["هَذِهِ بِنْتٌ.", "hâdhihi bintun.", "C'est une fille.", "👧"],
        ["مَا هَذَا؟", "mâ hâdhâ?", "Qu'est-ce que c'est ?", "❓"]
      ],
      quiz: [
        { q: "Que dit-on pour un objet masculin proche ?", bonne: "هَذَا", faux: ["هَذِهِ", "تِلْكَ"] },
        { q: "Que dit-on pour un objet féminin proche ?", bonne: "هَذِهِ", faux: ["هَذَا", "ذَلِكَ"] },
        { q: "Que dit-on pour un objet masculin lointain ?", bonne: "ذَلِكَ", faux: ["تِلْكَ", "هَذَا"] },
        { q: "Que dit-on pour un objet féminin lointain ?", bonne: "تِلْكَ", faux: ["ذَلِكَ", "هَذِهِ"] },
        { q: "Complète : … سَيَّارَةٌ (une voiture, proche)", bonne: "هَذِهِ", faux: ["هَذَا", "ذَلِكَ"] },
        { q: "Que veut dire هَذَا كِتَابٌ ?", bonne: "Ceci est un livre.", faux: ["Ce livre est grand.", "Où est le livre ?"] },
        { q: "Comment se prononce هَذَا ?", bonne: "hâdhâ", faux: ["hadha", "hidhu"] }
      ] },

    { id: "possessifs", titre: "Les possessifs attachés", emoji: "🎒", g: 1,
      intro: [
        "En arabe, « mon, ton, son… » est une petite terminaison collée à la fin du nom.",
        "كِتَابٌ (un livre) → كِتَابِي (mon livre), كِتَابُكَ (ton livre, à un garçon), كِتَابُكِ (ton livre, à une fille).",
        "Avec un possessif, le nom perd son tanwîn et n'a pas d'article.",
        "Si le mot finit par ة, elle redevient un ت : مَدْرَسَةٌ → مَدْرَسَتِي (mon école)."
      ],
      regles: [
        { signe: "ـِي", nom: "mon, ma", son: "-î", explication: "1re personne (je)" },
        { signe: "ـكَ", nom: "ton, ta (garçon)", son: "-ka", explication: "2e personne masculin" },
        { signe: "ـكِ", nom: "ton, ta (fille)", son: "-ki", explication: "2e personne féminin" },
        { signe: "ـهُ", nom: "son, sa (à lui)", son: "-hu", explication: "3e personne masculin (-hi après i, î ou ay)" },
        { signe: "ـهَا", nom: "son, sa (à elle)", son: "-hâ", explication: "3e personne féminin" },
        { signe: "ـنَا", nom: "notre", son: "-nâ", explication: "1re personne pluriel" },
        { signe: "ـكُمْ", nom: "votre", son: "-kum", explication: "2e personne pluriel" },
        { signe: "ـهُمْ", nom: "leur", son: "-hum", explication: "3e personne pluriel (-him après i, î ou ay)" }
      ],
      exemples: [
        ["كِتَابِي", "kitâbî", "mon livre", "📕"],
        ["كِتَابُكَ", "kitâbuka", "ton livre (à un garçon)", "📕"],
        ["كِتَابُكِ", "kitâbuki", "ton livre (à une fille)", "📕"],
        ["كِتَابُهُ", "kitâbuhu", "son livre (à lui)", "📕"],
        ["كِتَابُهَا", "kitâbuhâ", "son livre (à elle)", "📕"],
        ["كِتَابُنَا", "kitâbunâ", "notre livre", "📕"],
        ["كِتَابُكُمْ", "kitâbukum", "votre livre", "📕"],
        ["كِتَابُهُمْ", "kitâbuhum", "leur livre", "📕"],
        ["مَدْرَسَتِي", "madrasatî", "mon école", "🏫"],
        ["بَيْتُنَا كَبِيرٌ.", "baytunâ kabîrun.", "Notre maison est grande.", "🏠"]
      ],
      quiz: [
        { q: "Que veut dire كِتَابِي ?", bonne: "mon livre", faux: ["ton livre", "son livre"] },
        { q: "Comment dit-on « ton livre » à une fille ?", bonne: "كِتَابُكِ", faux: ["كِتَابُكَ", "كِتَابُهَا"] },
        { q: "Que veut dire كِتَابُهَا ?", bonne: "son livre (à elle)", faux: ["son livre (à lui)", "leur livre"] },
        { q: "Que veut dire كِتَابُنَا ?", bonne: "notre livre", faux: ["votre livre", "mon livre"] },
        { q: "Quelle terminaison veut dire « leur » ?", bonne: "ـهُمْ", faux: ["ـكُمْ", "ـنَا"] },
        { q: "Comment dit-on « mon école » ?", bonne: "مَدْرَسَتِي", faux: ["مَدْرَسَةِي", "الْمَدْرَسَةُ"] },
        { q: "Comment se lit كِتَابُهُ ?", bonne: "kitâbuhu", faux: ["kitâbuhâ", "kitâbî"] }
      ] },

    { id: "nominale", titre: "La phrase nominale", emoji: "🏠", g: 1,
      intro: [
        "En arabe, une phrase peut commencer par un nom : c'est la phrase nominale.",
        "Au présent, on ne dit pas le verbe « être » : الْبَيْتُ كَبِيرٌ veut dire « la maison est grande ».",
        "Le sujet a souvent l'article (الْبَيْتُ) et ce qu'on dit de lui n'en a pas (كَبِيرٌ).",
        "Attention : الْبَيْتُ الْكَبِيرُ (avec deux articles) veut dire « la grande maison », ce n'est pas une phrase complète.",
        "L'adjectif se place après le nom et s'accorde avec lui (masculin/féminin)."
      ],
      exemples: [
        ["هَذَا بَيْتٌ كَبِيرٌ.", "hâdhâ baytun kabîrun.", "C'est une grande maison.", "🏠"],
        ["الْبَيْتُ كَبِيرٌ.", "al-baytu kabîrun.", "La maison est grande.", "🏠"],
        ["الْبَيْتُ الْكَبِيرُ", "al-baytu l-kabîru", "la grande maison", "🏠"],
        ["الْبِنْتُ فِي الْمَدْرَسَةِ.", "al-bintu fî l-madrasati.", "La fille est à l'école.", "🏫"],
        ["الْوَلَدُ طَوِيلٌ.", "al-waladu tawîlun.", "Le garçon est grand (de taille).", "👦"],
        ["الْكِتَابُ عَلَى الطَّاوِلَةِ.", "al-kitâbu 'alâ t-tâwilati.", "Le livre est sur la table.", "📕"],
        ["السَّيَّارَةُ جَدِيدَةٌ.", "as-sayyâratu jadîdatun.", "La voiture est neuve.", "🚗"],
        ["أَنَا طَالِبٌ.", "'anâ tâlibun.", "Je suis élève.", "🎒"],
        ["هِيَ مُعَلِّمَةٌ.", "hiya mu'allimatun.", "Elle est enseignante.", "👩‍🏫"]
      ],
      quiz: [
        { q: "Que veut dire الْبَيْتُ كَبِيرٌ ?", bonne: "La maison est grande.", faux: ["la grande maison", "une petite maison"] },
        { q: "Que veut dire الْبَيْتُ الْكَبِيرُ ?", bonne: "la grande maison", faux: ["La maison est grande.", "C'est une maison."] },
        { q: "Dans une phrase nominale au présent, que ne dit-on pas ?", bonne: "le verbe « être »", faux: ["le nom", "l'article"] },
        { q: "Où se place l'adjectif ?", bonne: "après le nom", faux: ["avant le nom", "à la fin de la page"] },
        { q: "Complète : السَّيَّارَةُ … (neuve)", bonne: "جَدِيدَةٌ", faux: ["جَدِيدٌ", "الْجَدِيدُ"] },
        { q: "Que veut dire الْبِنْتُ فِي الْمَدْرَسَةِ ?", bonne: "La fille est à l'école.", faux: ["L'école de la fille", "La fille va au marché."] },
        { q: "Que veut dire عَلَى ?", bonne: "sur", faux: ["dans", "sous"] }
      ] },

    { id: "questions", titre: "Les mots de question", emoji: "❓", g: 1,
      intro: [
        "Pour poser une question, on met le mot de question au début de la phrase.",
        "Le point d'interrogation arabe est retourné : ؟",
        "هَلْ sert à poser une question dont la réponse est « oui » (نَعَمْ) ou « non » (لَا).",
        "مَا demande une chose, مَنْ demande une personne."
      ],
      regles: [
        { signe: "مَا", nom: "quoi ? qu'est-ce que ?", son: "mâ", explication: "pour une chose (devant un nom)" },
        { signe: "مَنْ", nom: "qui ?", son: "man", explication: "pour une personne" },
        { signe: "أَيْنَ", nom: "où ?", son: "'ayna", explication: "pour un lieu" },
        { signe: "مَتَى", nom: "quand ?", son: "matâ", explication: "pour un moment" },
        { signe: "كَيْفَ", nom: "comment ?", son: "kayfa", explication: "pour la manière" },
        { signe: "لِمَاذَا", nom: "pourquoi ?", son: "limâdhâ", explication: "pour la raison" },
        { signe: "كَمْ", nom: "combien ?", son: "kam", explication: "pour une quantité" },
        { signe: "هَلْ", nom: "est-ce que ?", son: "hal", explication: "réponse oui ou non" }
      ],
      exemples: [
        ["مَا اسْمُكَ؟", "mâ smuka?", "Comment t'appelles-tu ? (à un garçon)", "📛"],
        ["مَنْ هَذَا؟", "man hâdhâ?", "Qui est-ce ?", "🧑"],
        ["أَيْنَ الْكِتَابُ؟", "'ayna l-kitâbu?", "Où est le livre ?", "📕"],
        ["مَتَى تَذْهَبُ إِلَى الْمَدْرَسَةِ؟", "matâ tadhhabu 'ilâ l-madrasati?", "Quand vas-tu à l'école ?", "🏫"],
        ["كَيْفَ حَالُكَ؟", "kayfa hâluka?", "Comment vas-tu ? (à un garçon)", "🙂"],
        ["لِمَاذَا تَبْكِي؟", "limâdhâ tabkî?", "Pourquoi pleures-tu ? (à un garçon)", "😢"],
        ["كَمْ عُمْرُكَ؟", "kam 'umruka?", "Quel âge as-tu ? (à un garçon)", "🎂"],
        ["هَلْ أَنْتَ طَالِبٌ؟", "hal 'anta tâlibun?", "Es-tu élève ?", "🎒"],
        ["نَعَمْ / لَا", "na'am / lâ", "oui / non", "👍"]
      ],
      quiz: [
        { q: "Que veut dire أَيْنَ ?", bonne: "où ?", faux: ["quand ?", "qui ?"] },
        { q: "Que veut dire مَنْ ?", bonne: "qui ?", faux: ["quoi ?", "combien ?"] },
        { q: "Que veut dire مَتَى ?", bonne: "quand ?", faux: ["comment ?", "où ?"] },
        { q: "Que veut dire كَيْفَ ?", bonne: "comment ?", faux: ["pourquoi ?", "quand ?"] },
        { q: "Que veut dire لِمَاذَا ?", bonne: "pourquoi ?", faux: ["combien ?", "qui ?"] },
        { q: "Que veut dire كَمْ ?", bonne: "combien ?", faux: ["comment ?", "où ?"] },
        { q: "Quel mot pose une question à laquelle on répond « oui » ou « non » ?", bonne: "هَلْ", faux: ["مَا", "أَيْنَ"] },
        { q: "Comment demande-t-on « Où est le livre ? »", bonne: "أَيْنَ الْكِتَابُ؟", faux: ["مَنْ هَذَا؟", "كَيْفَ حَالُكَ؟"] },
        { q: "À quoi ressemble le point d'interrogation arabe ?", bonne: "؟", faux: ["?", "¿"] }
      ] },

    { id: "present", titre: "Le verbe au présent", emoji: "✏️", g: 2,
      intro: [
        "Au présent (l'inaccompli), on ajoute des lettres AVANT le verbe pour dire qui fait l'action.",
        "Avec كَتَبَ (écrire) : أَـ pour « je », تَـ pour « tu » ou « elle », يَـ pour « il », نَـ pour « nous ».",
        "Pour « tu » au féminin, on ajoute aussi ـِينَ à la fin, et pour « vous » et « ils », ـُونَ.",
        "La racine ك ت ب (écrire) se retrouve dans كِتَابٌ (livre) et مَكْتَبٌ (bureau)."
      ],
      regles: [
        { signe: "أَـ", nom: "je", son: "'a-", explication: "أَكْتُبُ" },
        { signe: "تَـ", nom: "tu (garçon), elle", son: "ta-", explication: "تَكْتُبُ" },
        { signe: "تَـ…ـِينَ", nom: "tu (fille)", son: "ta- … -îna", explication: "تَكْتُبِينَ" },
        { signe: "يَـ", nom: "il", son: "ya-", explication: "يَكْتُبُ" },
        { signe: "نَـ", nom: "nous", son: "na-", explication: "نَكْتُبُ" },
        { signe: "تَـ…ـُونَ / يَـ…ـُونَ", nom: "vous / ils", son: "ta- … -ûna / ya- … -ûna", explication: "تَكْتُبُونَ / يَكْتُبُونَ" }
      ],
      exemples: [
        ["أَنَا أَكْتُبُ", "'anâ 'aktubu", "j'écris", "✍️"],
        ["أَنْتَ تَكْتُبُ", "'anta taktubu", "tu écris (garçon)", "✍️"],
        ["أَنْتِ تَكْتُبِينَ", "'anti taktubîna", "tu écris (fille)", "✍️"],
        ["هُوَ يَكْتُبُ", "huwa yaktubu", "il écrit", "✍️"],
        ["هِيَ تَكْتُبُ", "hiya taktubu", "elle écrit", "✍️"],
        ["نَحْنُ نَكْتُبُ", "nahnu naktubu", "nous écrivons", "✍️"],
        ["أَنْتُمْ تَكْتُبُونَ", "'antum taktubûna", "vous écrivez", "✍️"],
        ["هُمْ يَكْتُبُونَ", "hum yaktubûna", "ils écrivent", "✍️"],
        ["الْوَلَدُ يَكْتُبُ الدَّرْسَ.", "al-waladu yaktubu d-darsa.", "Le garçon écrit la leçon.", "📝"]
      ],
      quiz: [
        { q: "Comment dit-on « j'écris » ?", bonne: "أَكْتُبُ", faux: ["يَكْتُبُ", "نَكْتُبُ"] },
        { q: "Comment dit-on « il écrit » ?", bonne: "يَكْتُبُ", faux: ["تَكْتُبُ", "أَكْتُبُ"] },
        { q: "Comment dit-on « nous écrivons » ?", bonne: "نَكْتُبُ", faux: ["تَكْتُبُونَ", "يَكْتُبُونَ"] },
        { q: "Comment dit-on « tu écris » à une fille ?", bonne: "تَكْتُبِينَ", faux: ["تَكْتُبُ", "تَكْتُبُونَ"] },
        { q: "Que veut dire هُمْ يَكْتُبُونَ ?", bonne: "ils écrivent", faux: ["vous écrivez", "il écrit"] },
        { q: "Quelle forme sert à la fois pour « tu (garçon) » et « elle » ?", bonne: "تَكْتُبُ", faux: ["يَكْتُبُ", "أَكْتُبُ"] },
        { q: "Quelle lettre ajoute-t-on au début pour « nous » ?", bonne: "ن", faux: ["ي", "أ"] },
        { q: "Quelle est la racine du verbe « écrire » ?", bonne: "ك ت ب", faux: ["ق ر أ", "د ر س"] }
      ] },

    { id: "passe", titre: "Le verbe au passé", emoji: "⏪", g: 2,
      intro: [
        "Au passé (l'accompli), on ajoute des terminaisons APRÈS le verbe.",
        "La forme de base est « il » : كَتَبَ (kataba, il a écrit).",
        "Pour « je », « tu (garçon) » et « tu (fille) », la terminaison ـْتُ / ـْتَ / ـْتِ ne change que par sa petite voyelle !",
        "Pour « elle », on ajoute ـَتْ : كَتَبَتْ. Pour « nous », ـْنَا. Pour « ils », ـُوا (le ا final ne se prononce pas)."
      ],
      regles: [
        { signe: "ـْتُ", nom: "je", son: "-tu", explication: "كَتَبْتُ" },
        { signe: "ـْتَ", nom: "tu (garçon)", son: "-ta", explication: "كَتَبْتَ" },
        { signe: "ـْتِ", nom: "tu (fille)", son: "-ti", explication: "كَتَبْتِ" },
        { signe: "ـَ", nom: "il", son: "-a", explication: "كَتَبَ" },
        { signe: "ـَتْ", nom: "elle", son: "-at", explication: "كَتَبَتْ" },
        { signe: "ـْنَا", nom: "nous", son: "-nâ", explication: "كَتَبْنَا" },
        { signe: "ـْتُمْ", nom: "vous", son: "-tum", explication: "كَتَبْتُمْ" },
        { signe: "ـُوا", nom: "ils", son: "-û", explication: "كَتَبُوا" }
      ],
      exemples: [
        ["أَنَا كَتَبْتُ", "'anâ katabtu", "j'ai écrit", "✍️"],
        ["أَنْتَ كَتَبْتَ", "'anta katabta", "tu as écrit (garçon)", "✍️"],
        ["أَنْتِ كَتَبْتِ", "'anti katabti", "tu as écrit (fille)", "✍️"],
        ["هُوَ كَتَبَ", "huwa kataba", "il a écrit", "✍️"],
        ["هِيَ كَتَبَتْ", "hiya katabat", "elle a écrit", "✍️"],
        ["نَحْنُ كَتَبْنَا", "nahnu katabnâ", "nous avons écrit", "✍️"],
        ["أَنْتُمْ كَتَبْتُمْ", "'antum katabtum", "vous avez écrit", "✍️"],
        ["هُمْ كَتَبُوا", "hum katabû", "ils ont écrit", "✍️"],
        ["ذَهَبَ الْوَلَدُ إِلَى الْمَدْرَسَةِ.", "dhahaba l-waladu 'ilâ l-madrasati.", "Le garçon est allé à l'école.", "🏫"]
      ],
      quiz: [
        { q: "Comment dit-on « il a écrit » ?", bonne: "كَتَبَ", faux: ["كَتَبْتُ", "كَتَبَتْ"] },
        { q: "Comment dit-on « elle a écrit » ?", bonne: "كَتَبَتْ", faux: ["كَتَبْتِ", "كَتَبَ"] },
        { q: "Comment dit-on « j'ai écrit » ?", bonne: "كَتَبْتُ", faux: ["كَتَبْتَ", "كَتَبْنَا"] },
        { q: "Que veut dire كَتَبْتِ ?", bonne: "tu as écrit (fille)", faux: ["tu as écrit (garçon)", "elle a écrit"] },
        { q: "Que veut dire كَتَبْنَا ?", bonne: "nous avons écrit", faux: ["ils ont écrit", "vous avez écrit"] },
        { q: "Comment dit-on « ils ont écrit » ?", bonne: "كَتَبُوا", faux: ["كَتَبْتُمْ", "كَتَبَتْ"] },
        { q: "Au passé, où se mettent les marques de la personne ?", bonne: "à la fin du verbe", faux: ["au début du verbe", "on n'en met pas"] },
        { q: "Dans كَتَبُوا, le ا final se prononce-t-il ?", bonne: "non", faux: ["oui, « â »", "oui, « a »"] }
      ] },

    { id: "pluriel", titre: "Le pluriel", emoji: "👨‍👩‍👧‍👦", g: 2,
      intro: [
        "Pour des personnes au masculin, on ajoute souvent ـُونَ : مُعَلِّمٌ → مُعَلِّمُونَ.",
        "Pour les mots féminins en ة, on remplace ة par ـَاتٌ : مُعَلِّمَةٌ → مُعَلِّمَاتٌ.",
        "Beaucoup de mots ont un « pluriel brisé » : on change les voyelles à l'intérieur du mot (كِتَابٌ → كُتُبٌ). Il faut les apprendre par cœur.",
        "L'arabe a aussi un duel pour deux choses : كِتَابَانِ (deux livres)."
      ],
      regles: [
        { signe: "ـُونَ", nom: "pluriel masculin régulier", son: "-ûna", explication: "pour des hommes ou garçons (ـِينَ en complément ou après une préposition)" },
        { signe: "ـَاتٌ", nom: "pluriel féminin régulier", son: "-âtun", explication: "remplace ة" },
        { signe: "كُتُبٌ", nom: "pluriel brisé", son: "kutubun", explication: "le mot change à l'intérieur" }
      ],
      exemples: [
        ["مُعَلِّمٌ → مُعَلِّمُونَ", "mu'allimun → mu'allimûna", "un enseignant → des enseignants", "👨‍🏫"],
        ["مُهَنْدِسٌ → مُهَنْدِسُونَ", "muhandisun → muhandisûna", "un ingénieur → des ingénieurs", "👷"],
        ["مُعَلِّمَةٌ → مُعَلِّمَاتٌ", "mu'allimatun → mu'allimâtun", "une enseignante → des enseignantes", "👩‍🏫"],
        ["سَيَّارَةٌ → سَيَّارَاتٌ", "sayyâratun → sayyârâtun", "une voiture → des voitures", "🚗"],
        ["كِتَابٌ → كُتُبٌ", "kitâbun → kutubun", "un livre → des livres", "📚"],
        ["وَلَدٌ → أَوْلَادٌ", "waladun → 'awlâdun", "un garçon → des garçons, des enfants", "👦"],
        ["بَيْتٌ → بُيُوتٌ", "baytun → buyûtun", "une maison → des maisons", "🏘️"],
        ["قَلَمٌ → أَقْلَامٌ", "qalamun → 'aqlâmun", "un stylo → des stylos", "🖊️"],
        ["رَجُلٌ → رِجَالٌ", "rajulun → rijâlun", "un homme → des hommes", "👨"],
        ["بِنْتٌ → بَنَاتٌ", "bintun → banâtun", "une fille → des filles", "👧"],
        ["دَرْسٌ → دُرُوسٌ", "darsun → durûsun", "une leçon → des leçons", "📝"],
        ["كِتَابَانِ", "kitâbâni", "deux livres", "📕"]
      ],
      quiz: [
        { q: "Quel est le pluriel de مُعَلِّمٌ ?", bonne: "مُعَلِّمُونَ", faux: ["مُعَلِّمَاتٌ", "مُعَلِّمَةٌ"] },
        { q: "Quel est le pluriel de مُعَلِّمَةٌ ?", bonne: "مُعَلِّمَاتٌ", faux: ["مُعَلِّمُونَ", "مَعَالِمُ"] },
        { q: "Quel est le pluriel de كِتَابٌ ?", bonne: "كُتُبٌ", faux: ["كِتَابَاتٌ", "كِتَابُونَ"] },
        { q: "Quel est le pluriel de وَلَدٌ ?", bonne: "أَوْلَادٌ", faux: ["وَلَدُونَ", "وَلَدَاتٌ"] },
        { q: "Que veut dire بُيُوتٌ ?", bonne: "des maisons", faux: ["des livres", "des filles"] },
        { q: "Quel est le pluriel de قَلَمٌ ?", bonne: "أَقْلَامٌ", faux: ["قُلُومٌ", "قَلَمَاتٌ"] },
        { q: "Comment s'appelle un pluriel qui change l'intérieur du mot ?", bonne: "un pluriel brisé", faux: ["un pluriel régulier", "un duel"] },
        { q: "Que veut dire كِتَابَانِ ?", bonne: "deux livres", faux: ["des livres", "mon livre"] }
      ] },

    { id: "salutations", titre: "Saluer et se présenter", emoji: "👋", g: 1,
      intro: [
        "Voici un petit dialogue entre deux enfants, Sâmî et Maryam.",
        "La salutation la plus connue est اَلسَّلَامُ عَلَيْكُمْ (que la paix soit sur vous) ; on répond وَعَلَيْكُمُ السَّلَامُ.",
        "Quand on parle à une fille, on change la fin : حَالُكِ, اسْمُكِ (avec kasra).",
        "Lis chaque réplique à voix haute, de droite à gauche."
      ],
      exemples: [
        ["سَامِي : اَلسَّلَامُ عَلَيْكُمْ.", "Sâmî : as-salâmu 'alaykum.", "Sâmî : Bonjour (que la paix soit sur vous).", "👋"],
        ["مَرْيَمُ : وَعَلَيْكُمُ السَّلَامُ.", "Maryamu : wa 'alaykumu s-salâm.", "Maryam : Et sur vous la paix.", "🙂"],
        ["سَامِي : صَبَاحُ الْخَيْرِ!", "Sâmî : sabâhu l-khayr !", "Sâmî : Bonjour ! (le matin)", "🌅"],
        ["مَرْيَمُ : صَبَاحُ النُّورِ!", "Maryamu : sabâhu n-nûr !", "Maryam : Bonjour ! (réponse)", "☀️"],
        ["سَامِي : كَيْفَ حَالُكِ؟", "Sâmî : kayfa hâluki ?", "Sâmî : Comment vas-tu ? (à une fille)", "🙂"],
        ["مَرْيَمُ : بِخَيْرٍ، وَالْحَمْدُ لِلَّهِ. وَأَنْتَ؟", "Maryamu : bikhayrin, wal-hamdu lillâh. wa 'anta ?", "Maryam : Bien, Dieu merci. Et toi ?", "😊"],
        ["سَامِي : أَنَا بِخَيْرٍ، شُكْرًا. مَا اسْمُكِ؟", "Sâmî : 'anâ bikhayrin, shukran. mâ smuki ?", "Sâmî : Je vais bien, merci. Comment t'appelles-tu ?", "📛"],
        ["مَرْيَمُ : اِسْمِي مَرْيَمُ. وَمَا اسْمُكَ؟", "Maryamu : ismî Maryamu. wa mâ smuka ?", "Maryam : Je m'appelle Maryam. Et toi, comment t'appelles-tu ?", "👧"],
        ["سَامِي : اِسْمِي سَامِي. أَنَا مِنْ فَرَنْسَا.", "Sâmî : ismî Sâmî. 'anâ min Faransâ.", "Sâmî : Je m'appelle Sâmî. Je viens de France.", "🇫🇷"],
        ["مَرْيَمُ : تَشَرَّفْنَا!", "Maryamu : tasharrafnâ !", "Maryam : Enchantée !", "🤝"],
        ["سَامِي : مَعَ السَّلَامَةِ!", "Sâmî : ma'a s-salâma !", "Sâmî : Au revoir !", "🖐️"]
      ],
      quiz: [
        { q: "Que répond-on à اَلسَّلَامُ عَلَيْكُمْ ?", bonne: "وَعَلَيْكُمُ السَّلَامُ", faux: ["صَبَاحُ الْخَيْرِ", "مَعَ السَّلَامَةِ"] },
        { q: "Que répond-on à صَبَاحُ الْخَيْرِ ?", bonne: "صَبَاحُ النُّورِ", faux: ["شُكْرًا", "تَشَرَّفْنَا"] },
        { q: "Comment demande-t-on « Comment vas-tu ? » à une fille ?", bonne: "كَيْفَ حَالُكِ؟", faux: ["كَيْفَ حَالُكَ؟", "مَا اسْمُكِ؟"] },
        { q: "Que veut dire اِسْمِي سَامِي ?", bonne: "Je m'appelle Sâmî.", faux: ["Voici Sâmî.", "Où est Sâmî ?"] },
        { q: "Que veut dire مَعَ السَّلَامَةِ ?", bonne: "Au revoir", faux: ["Bonjour", "Merci"] },
        { q: "Que veut dire شُكْرًا ?", bonne: "Merci", faux: ["Pardon", "Enchanté"] },
        { q: "Comment dit-on « Je viens de France » ?", bonne: "أَنَا مِنْ فَرَنْسَا.", faux: ["أَنَا فِي الْمَدْرَسَةِ.", "اِسْمِي فَرَنْسَا."] },
        { q: "Que veut dire بِخَيْرٍ ?", bonne: "bien, en forme", faux: ["fatigué", "content de te voir"] }
      ] },

    { id: "famille", titre: "La famille", emoji: "👪", g: 0,
      intro: [
        "Voici les mots pour parler de sa famille.",
        "Pour dire « mon papa », on ajoute ـِي : أَبِي, أُمِّي, أَخِي.",
        "Attention : en arabe, il y a deux mots pour « oncle » : l'oncle du côté du papa (عَمٌّ) et l'oncle du côté de la maman (خَالٌ)."
      ],
      exemples: [
        ["أَبٌ", "'abun", "un père", "👨"],
        ["أُمٌّ", "'ummun", "une mère", "👩"],
        ["أَخٌ", "'akhun", "un frère", "👦"],
        ["أُخْتٌ", "'ukhtun", "une sœur", "👧"],
        ["جَدٌّ", "jaddun", "un grand-père", "👴"],
        ["جَدَّةٌ", "jaddatun", "une grand-mère", "👵"],
        ["عَمٌّ", "'ammun", "un oncle (frère du père)", "🧔"],
        ["خَالٌ", "khâlun", "un oncle (frère de la mère)", "🧔"],
        ["أُمِّي", "'ummî", "ma maman", "👩"],
        ["هَذَا أَخِي.", "hâdhâ 'akhî.", "C'est mon frère.", "👦"]
      ],
      quiz: [
        { q: "Que veut dire أُمٌّ ?", bonne: "une mère", faux: ["un père", "une sœur"] },
        { q: "Que veut dire أَخٌ ?", bonne: "un frère", faux: ["une sœur", "un oncle"] },
        { q: "Comment dit-on « une sœur » ?", bonne: "أُخْتٌ", faux: ["أَخٌ", "جَدَّةٌ"] },
        { q: "Comment dit-on « mon père » ?", bonne: "أَبِي", faux: ["أَبٌ", "أُمِّي"] },
        { q: "Que veut dire خَالٌ ?", bonne: "un oncle (frère de la mère)", faux: ["un oncle (frère du père)", "un grand-père"] },
        { q: "Que veut dire جَدَّةٌ ?", bonne: "une grand-mère", faux: ["une mère", "une tante"] }
      ] },

    { id: "prepositions", titre: "Où est-il ? Les prépositions", emoji: "📦", g: 1,
      intro: [
        "Les prépositions disent où se trouve quelque chose : dans, sur, sous…",
        "Après une préposition, le nom prend une kasra à la fin : فِي الْبَيْتِ (dans la maison).",
        "C'est ce qu'on appelle le cas indirect, ou génitif (al-jarr)."
      ],
      regles: [
        { signe: "فِي", nom: "dans", son: "fî", explication: "à l'intérieur" },
        { signe: "عَلَى", nom: "sur", son: "'alâ", explication: "au-dessus, en contact" },
        { signe: "تَحْتَ", nom: "sous", son: "tahta", explication: "en dessous" },
        { signe: "مِنْ", nom: "de", son: "min", explication: "point de départ, origine" },
        { signe: "إِلَى", nom: "vers, à", son: "'ilâ", explication: "destination" },
        { signe: "مَعَ", nom: "avec", son: "ma'a", explication: "accompagnement" }
      ],
      exemples: [
        ["الْقِطَّةُ فِي الْبَيْتِ.", "al-qittatu fî l-bayti.", "La chatte est dans la maison.", "🐈"],
        ["الْكِتَابُ عَلَى الطَّاوِلَةِ.", "al-kitâbu 'alâ t-tâwilati.", "Le livre est sur la table.", "📕"],
        ["الْكَلْبُ تَحْتَ الشَّجَرَةِ.", "al-kalbu tahta sh-shajarati.", "Le chien est sous l'arbre.", "🐕"],
        ["أَنَا مِنْ فَرَنْسَا.", "'anâ min Faransâ.", "Je viens de France.", "🇫🇷"],
        ["أَذْهَبُ إِلَى الْمَدْرَسَةِ.", "'adhhabu 'ilâ l-madrasati.", "Je vais à l'école.", "🏫"],
        ["أَنَا مَعَ أُمِّي.", "'anâ ma'a 'ummî.", "Je suis avec ma maman.", "👩"]
      ],
      quiz: [
        { q: "Que veut dire فِي ?", bonne: "dans", faux: ["sur", "avec"] },
        { q: "Que veut dire تَحْتَ ?", bonne: "sous", faux: ["sur", "vers"] },
        { q: "Que veut dire مَعَ ?", bonne: "avec", faux: ["de", "dans"] },
        { q: "Comment dit-on « sur » ?", bonne: "عَلَى", faux: ["إِلَى", "مِنْ"] },
        { q: "Complète : الْقِطَّةُ فِي …", bonne: "الْبَيْتِ", faux: ["الْبَيْتُ", "الْبَيْتَ"] },
        { q: "Que veut dire أَذْهَبُ إِلَى الْمَدْرَسَةِ ?", bonne: "Je vais à l'école.", faux: ["Je suis à l'école.", "Je viens de l'école."] }
      ] }
  ];
})();
