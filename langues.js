/* Arabe vérifié le 8 octobre 2026 sur Reverso Context, Living Arabic, Wiktionary, Madinah Arabic et Wikipédia (alphabet arabe).
   Aide aux Devoirs — module « Langues du monde » : anglais, espagnol, italien, arabe
   Chaque thème : g = groupe d'âge minimum (0 maternelle, 1 primaire, 2 collège-lycée)
   Chaque mot : [français, image, espagnol, italien, anglais, arabe, translittération de l'arabe]
   image : un emoji (dessin Twemoji dans web/images/mots), une couleur "#rrggbb", un court texte "t:…"
   ou un dessin de l'appli "f:…" (dessinMot() dans app.js) */
(function () {
  "use strict";
  const LANGUES = {
    en: { nom: "Anglais", natif: "English", voix: "en-GB", couleur: "#2b56cf", bonjour: "Hello!" },
    es: { nom: "Espagnol", natif: "Español", voix: "es-ES", couleur: "#c7681a", bonjour: "¡Hola!" },
    it: { nom: "Italien", natif: "Italiano", voix: "it-IT", couleur: "#1d8448", bonjour: "Ciao!" },
    ar: { nom: "Arabe", natif: "العربية", voix: "ar-SA", couleur: "#8a5526", bonjour: "مرحبا", rtl: true },
  };
  const COL = { es: 2, it: 3, en: 4, ar: 5 };

  const THEMES = [
    { id: "salut", titre: "Se saluer", emoji: "👋", g: 0, mots: [
      ["salut", "👋", "hola", "ciao", "hi", "مرحبا", "marhaban"],
      ["bonjour", "🌅", "buenos días", "buongiorno", "good morning", "صباح الخير", "sabah al-khayr"],
      ["bonsoir", "🌙", "buenas noches", "buonasera", "good evening", "مساء الخير", "masa' al-khayr"],
      ["au revoir", "🖐️", "adiós", "arrivederci", "goodbye", "مع السلامة", "ma'a as-salama"],
      ["merci", "🙏", "gracias", "grazie", "thank you", "شكرا", "shukran"],
      ["s'il te plaît", "🤲", "por favor", "per favore", "please", "من فضلك", "min fadlak (à un garçon) · min fadliki (à une fille)"],
      ["oui", "👍", "sí", "sì", "yes", "نعم", "na'am"],
      ["non", "👎", "no", "no", "no", "لا", "la"],
    ] },
    { id: "presenter", titre: "Me présenter", emoji: "🙋", g: 1, mots: [
      ["Comment ça va ?", "🙂", "¿Qué tal?", "Come stai?", "How are you?", "كيف حالك؟", "kayfa haluka? (garçon) · kayfa haluki? (fille)"],
      ["Ça va bien, merci.", "😀", "Muy bien, gracias.", "Sto bene, grazie.", "I'm fine, thank you.", "بخير، شكرا", "bikhayr, shukran"],
      ["Je m'appelle…", "📛", "Me llamo…", "Mi chiamo…", "My name is…", "اسمي…", "ismi…"],
      ["Comment tu t'appelles ?", "❓", "¿Cómo te llamas?", "Come ti chiami?", "What's your name?", "ما اسمك؟", "ma ismuka? (garçon) · ma ismuki? (fille)"],
      ["J'ai dix ans.", "🎂", "Tengo diez años.", "Ho dieci anni.", "I'm ten years old.", "عمري عشر سنوات", "'umri 'ashr sanawat"],
      ["J'habite en France.", "🏠", "Vivo en Francia.", "Abito in Francia.", "I live in France.", "أسكن في فرنسا", "askun fi faransa"],
      ["pardon", "🙇", "perdón", "scusa", "sorry", "آسف / آسفة", "asif (garçon) · asifa (fille)"],
    ] },
    { id: "couleurs", titre: "Les couleurs", emoji: "🎨", g: 0, mots: [
      ["rouge", "#e03131", "rojo", "rosso", "red", "أحمر", "ahmar"],
      ["bleu", "#1c64d9", "azul", "blu", "blue", "أزرق", "azraq"],
      ["jaune", "#f5c518", "amarillo", "giallo", "yellow", "أصفر", "asfar"],
      ["vert", "#2f9e44", "verde", "verde", "green", "أخضر", "akhdar"],
      ["orange", "#f08c00", "naranja", "arancione", "orange", "برتقالي", "burtuqali"],
      ["violet", "#8e44ad", "morado", "viola", "purple", "بنفسجي", "banafsaji"],
      ["rose", "#f06595", "rosa", "rosa", "pink", "وردي", "wardi"],
      ["noir", "#222222", "negro", "nero", "black", "أسود", "aswad"],
      ["blanc", "#ffffff", "blanco", "bianco", "white", "أبيض", "abyad"],
      ["marron", "#8b5a2b", "marrón", "marrone", "brown", "بني", "bunni"],
    ] },
    { id: "nombres", titre: "Compter de 1 à 10", emoji: "🔢", g: 0, mots: [
      ["un", "t:1", "uno", "uno", "one", "واحد", "wahid"], ["deux", "t:2", "dos", "due", "two", "اثنان", "ithnan"],
      ["trois", "t:3", "tres", "tre", "three", "ثلاثة", "thalatha"], ["quatre", "t:4", "cuatro", "quattro", "four", "أربعة", "arba'a"],
      ["cinq", "t:5", "cinco", "cinque", "five", "خمسة", "khamsa"], ["six", "t:6", "seis", "sei", "six", "ستة", "sitta"],
      ["sept", "t:7", "siete", "sette", "seven", "سبعة", "sab'a"], ["huit", "t:8", "ocho", "otto", "eight", "ثمانية", "thamaniya"],
      ["neuf", "t:9", "nueve", "nove", "nine", "تسعة", "tis'a"], ["dix", "t:10", "diez", "dieci", "ten", "عشرة", "'ashara"],
    ] },
    { id: "nombres2", titre: "Compter de 11 à 20", emoji: "🔟", g: 1, mots: [
      ["onze", "t:11", "once", "undici", "eleven", "أحد عشر", "ahada 'ashar"], ["douze", "t:12", "doce", "dodici", "twelve", "اثنا عشر", "ithna 'ashar"],
      ["treize", "t:13", "trece", "tredici", "thirteen", "ثلاثة عشر", "thalathata 'ashar"], ["quatorze", "t:14", "catorce", "quattordici", "fourteen", "أربعة عشر", "arba'ata 'ashar"],
      ["quinze", "t:15", "quince", "quindici", "fifteen", "خمسة عشر", "khamsata 'ashar"], ["seize", "t:16", "dieciséis", "sedici", "sixteen", "ستة عشر", "sittata 'ashar"],
      ["dix-sept", "t:17", "diecisiete", "diciassette", "seventeen", "سبعة عشر", "sab'ata 'ashar"], ["dix-huit", "t:18", "dieciocho", "diciotto", "eighteen", "ثمانية عشر", "thamaniyata 'ashar"],
      ["dix-neuf", "t:19", "diecinueve", "diciannove", "nineteen", "تسعة عشر", "tis'ata 'ashar"], ["vingt", "t:20", "veinte", "venti", "twenty", "عشرون", "'ishrun"],
    ] },
    { id: "animaux", titre: "Les animaux", emoji: "🐾", g: 0, mots: [
      ["le chat", "🐱", "el gato", "il gatto", "the cat", "قطة", "qitta"], ["le chien", "🐶", "el perro", "il cane", "the dog", "كلب", "kalb"],
      ["l'oiseau", "🐦", "el pájaro", "l'uccello", "the bird", "طائر", "ta'ir"], ["le poisson", "🐟", "el pez", "il pesce", "the fish", "سمكة", "samaka"],
      ["le cheval", "🐴", "el caballo", "il cavallo", "the horse", "حصان", "hisan"], ["la vache", "🐄", "la vaca", "la mucca", "the cow", "بقرة", "baqara"],
      ["le lion", "🦁", "el león", "il leone", "the lion", "أسد", "asad"], ["l'éléphant", "🐘", "el elefante", "l'elefante", "the elephant", "فيل", "fil"],
      ["le lapin", "🐰", "el conejo", "il coniglio", "the rabbit", "أرنب", "arnab"], ["la souris", "🐭", "el ratón", "il topo", "the mouse", "فأر", "fa'r"],
      ["le singe", "🐵", "el mono", "la scimmia", "the monkey", "قرد", "qird"], ["le canard", "🦆", "el pato", "l'anatra", "the duck", "بطة", "batta"],
      ["le mouton", "🐑", "la oveja", "la pecora", "the sheep", "خروف", "kharuf"], ["la grenouille", "🐸", "la rana", "la rana", "the frog", "ضفدع", "difda'"],
      ["le papillon", "🦋", "la mariposa", "la farfalla", "the butterfly", "فراشة", "farasha"], ["la poule", "🐔", "la gallina", "la gallina", "the hen", "دجاجة", "dajaja"],
    ] },
    { id: "famille", titre: "La famille", emoji: "👪", g: 0, mots: [
      ["maman", "👩", "mamá", "mamma", "mum", "ماما", "mama"], ["papa", "👨", "papá", "papà", "dad", "بابا", "baba"],
      ["le frère", "👦", "el hermano", "il fratello", "the brother", "أخ", "akh"], ["la sœur", "👧", "la hermana", "la sorella", "the sister", "أخت", "ukht"],
      ["la grand-mère", "👵", "la abuela", "la nonna", "the grandmother", "جدة", "jadda"], ["le grand-père", "👴", "el abuelo", "il nonno", "the grandfather", "جد", "jadd"],
      ["le bébé", "👶", "el bebé", "il bebè", "the baby", "رضيع", "radi'"], ["la famille", "👨‍👩‍👧", "la familia", "la famiglia", "the family", "عائلة", "'a'ila"],
    ] },
    { id: "corps", titre: "Le corps", emoji: "🧍", g: 1, mots: [
      ["l'œil", "👁️", "el ojo", "l'occhio", "the eye", "عين", "'ayn"], ["le nez", "👃", "la nariz", "il naso", "the nose", "أنف", "anf"],
      ["la bouche", "👄", "la boca", "la bocca", "the mouth", "فم", "fam"], ["l'oreille", "👂", "la oreja", "l'orecchio", "the ear", "أذن", "udhun"],
      ["la main", "✋", "la mano", "la mano", "the hand", "يد", "yad"], ["le pied", "🦶", "el pie", "il piede", "the foot", "قدم", "qadam"],
      ["la dent", "🦷", "el diente", "il dente", "the tooth", "سن", "sinn"], ["la jambe", "🦵", "la pierna", "la gamba", "the leg", "رجل", "rijl"],
    ] },
    { id: "nourriture", titre: "À table !", emoji: "🍽️", g: 0, mots: [
      ["la pomme", "🍎", "la manzana", "la mela", "the apple", "تفاحة", "tuffaha"], ["la banane", "🍌", "el plátano", "la banana", "the banana", "موزة", "mawza"],
      ["le pain", "🍞", "el pan", "il pane", "the bread", "خبز", "khubz"], ["l'eau", "💧", "el agua", "l'acqua", "the water", "ماء", "ma'"],
      ["le lait", "🥛", "la leche", "il latte", "the milk", "حليب", "halib"], ["le fromage", "🧀", "el queso", "il formaggio", "the cheese", "جبن", "jubn"],
      ["l'œuf", "🥚", "el huevo", "l'uovo", "the egg", "بيضة", "bayda"], ["la fraise", "🍓", "la fresa", "la fragola", "the strawberry", "فراولة", "farawla"],
      ["le gâteau", "🎂", "el pastel", "la torta", "the cake", "كعكة", "ka'ka"], ["le riz", "🍚", "el arroz", "il riso", "the rice", "أرز", "aruzz"],
      ["la carotte", "🥕", "la zanahoria", "la carota", "the carrot", "جزر", "jazar"], ["l'orange", "🍊", "la naranja", "l'arancia", "the orange", "برتقالة", "burtuqala"],
    ] },
    { id: "ecole", titre: "À l'école", emoji: "🏫", g: 1, mots: [
      ["le livre", "📕", "el libro", "il libro", "the book", "كتاب", "kitab"], ["le crayon", "✏️", "el lápiz", "la matita", "the pencil", "قلم رصاص", "qalam rasas"],
      ["le stylo", "🖊️", "el bolígrafo", "la penna", "the pen", "قلم", "qalam"], ["le cahier", "📓", "el cuaderno", "il quaderno", "the exercise book", "دفتر", "daftar"],
      ["l'école", "🏫", "la escuela", "la scuola", "the school", "مدرسة", "madrasa"], ["le cartable", "🎒", "la mochila", "lo zaino", "the schoolbag", "حقيبة مدرسية", "haqiba madrasiyya"],
      ["le professeur", "🧑‍🏫", "el profesor", "l'insegnante", "the teacher", "معلم", "mu'allim"], ["les ciseaux", "✂️", "las tijeras", "le forbici", "the scissors", "مقص", "miqass"],
      ["la règle", "📏", "la regla", "il righello", "the ruler", "مسطرة", "mistara"], ["l'ordinateur", "💻", "el ordenador", "il computer", "the computer", "حاسوب", "hasub"],
    ] },
    { id: "maison", titre: "La maison", emoji: "🏠", g: 1, mots: [
      ["la maison", "🏠", "la casa", "la casa", "the house", "بيت", "bayt"], ["la porte", "🚪", "la puerta", "la porta", "the door", "باب", "bab"],
      ["le lit", "🛏️", "la cama", "il letto", "the bed", "سرير", "sarir"], ["la chaise", "🪑", "la silla", "la sedia", "the chair", "كرسي", "kursi"],
      ["la cuisine", "🍳", "la cocina", "la cucina", "the kitchen", "مطبخ", "matbakh"], ["la voiture", "🚗", "el coche", "la macchina", "the car", "سيارة", "sayyara"],
      ["le vélo", "🚲", "la bicicleta", "la bicicletta", "the bike", "دراجة", "darraja"], ["le jardin", "🌳", "el jardín", "il giardino", "the garden", "حديقة", "hadiqa"],
      ["la clé", "🔑", "la llave", "la chiave", "the key", "مفتاح", "miftah"],
    ] },
    { id: "vetements", titre: "Les vêtements", emoji: "👕", g: 1, mots: [
      ["le tee-shirt", "👕", "la camiseta", "la maglietta", "the T-shirt", "تي شيرت", "ti shirt"], ["le pantalon", "👖", "el pantalón", "i pantaloni", "the trousers", "بنطال", "bantal"],
      ["la chaussure", "👟", "el zapato", "la scarpa", "the shoe", "حذاء", "hidha'"], ["le chapeau", "🎩", "el sombrero", "il cappello", "the hat", "قبعة", "qubba'a"],
      ["la robe", "👗", "el vestido", "il vestito", "the dress", "فستان", "fustan"], ["la chaussette", "🧦", "el calcetín", "il calzino", "the sock", "جورب", "jawrab"],
      ["le manteau", "🧥", "el abrigo", "il cappotto", "the coat", "معطف", "mi'taf"], ["l'écharpe", "🧣", "la bufanda", "la sciarpa", "the scarf", "وشاح", "wishah"],
    ] },
    { id: "meteo", titre: "Le temps qu'il fait", emoji: "⛅", g: 1, mots: [
      ["le soleil", "☀️", "el sol", "il sole", "the sun", "شمس", "shams"], ["la pluie", "🌧️", "la lluvia", "la pioggia", "the rain", "مطر", "matar"],
      ["la neige", "❄️", "la nieve", "la neve", "the snow", "ثلج", "thalj"], ["le nuage", "☁️", "la nube", "la nuvola", "the cloud", "سحابة", "sahaba"],
      ["le vent", "💨", "el viento", "il vento", "the wind", "ريح", "rih"], ["la lune", "🌙", "la luna", "la luna", "the moon", "قمر", "qamar"],
      ["l'étoile", "⭐", "la estrella", "la stella", "the star", "نجم", "najm"],
    ] },
    { id: "jours", titre: "Les jours de la semaine", emoji: "📅", g: 1, mots: [
      ["lundi", "f:jour:1", "lunes", "lunedì", "Monday", "الاثنين", "al-ithnayn"], ["mardi", "f:jour:2", "martes", "martedì", "Tuesday", "الثلاثاء", "ath-thulatha'"],
      ["mercredi", "f:jour:3", "miércoles", "mercoledì", "Wednesday", "الأربعاء", "al-arbi'a'"], ["jeudi", "f:jour:4", "jueves", "giovedì", "Thursday", "الخميس", "al-khamis"],
      ["vendredi", "f:jour:5", "viernes", "venerdì", "Friday", "الجمعة", "al-jum'a"], ["samedi", "f:jour:6", "sábado", "sabato", "Saturday", "السبت", "as-sabt"],
      ["dimanche", "f:jour:7", "domingo", "domenica", "Sunday", "الأحد", "al-ahad"],
    ] },
    { id: "verbes", titre: "Les verbes du quotidien", emoji: "🏃", g: 2, mots: [
      ["manger", "🍽️", "comer", "mangiare", "to eat", "أكل", "akala"], ["boire", "🥤", "beber", "bere", "to drink", "شرب", "shariba"],
      ["jouer", "⚽", "jugar", "giocare", "to play", "لعب", "la'iba"], ["parler", "🗣️", "hablar", "parlare", "to speak", "تكلم", "takallama"],
      ["aimer", "❤️", "amar", "amare", "to love", "أحب", "ahabba"], ["dormir", "😴", "dormir", "dormire", "to sleep", "نام", "nama"],
      ["aller", "🚶", "ir", "andare", "to go", "ذهب", "dhahaba"], ["lire", "📖", "leer", "leggere", "to read", "قرأ", "qara'a"],
      ["écrire", "✍️", "escribir", "scrivere", "to write", "كتب", "kataba"], ["courir", "🏃", "correr", "correre", "to run", "ركض", "rakada"],
    ] },
    { id: "phrases", titre: "Phrases utiles", emoji: "💬", g: 2, mots: [
      ["Je ne comprends pas.", "🤔", "No entiendo.", "Non capisco.", "I don't understand.", "لا أفهم", "la afham"],
      ["Peux-tu répéter ?", "🔁", "¿Puedes repetir?", "Puoi ripetere?", "Can you repeat?", "هل يمكنك أن تكرر؟", "hal yumkinuka an tukarrira?"],
      ["Où sont les toilettes ?", "🚻", "¿Dónde está el baño?", "Dov'è il bagno?", "Where is the toilet?", "أين الحمام؟", "ayna al-hammam?"],
      ["Combien ça coûte ?", "💶", "¿Cuánto cuesta?", "Quanto costa?", "How much is it?", "كم السعر؟", "kam as-si'r?"],
      ["J'ai faim.", "🍕", "Tengo hambre.", "Ho fame.", "I'm hungry.", "أنا جائع / جائعة", "ana ja'i' (garçon) · ana ja'i'a (fille)"],
      ["J'ai soif.", "🥤", "Tengo sed.", "Ho sete.", "I'm thirsty.", "أنا عطشان / عطشانة", "ana 'atshan (garçon) · ana 'atshana (fille)"],
      ["Quel âge as-tu ?", "🎂", "¿Cuántos años tienes?", "Quanti anni hai?", "How old are you?", "كم عمرك؟", "kam 'umruka? (garçon) · kam 'umruki? (fille)"],
      ["J'aime le football.", "⚽", "Me gusta el fútbol.", "Mi piace il calcio.", "I like football.", "أحب كرة القدم", "uhibbu kurat al-qadam"],
      ["Bonne nuit !", "🌙", "¡Buenas noches!", "Buonanotte!", "Good night!", "ليلة سعيدة", "layla sa'ida"],
      ["Bon appétit !", "🍲", "¡Buen provecho!", "Buon appetito!", "Enjoy your meal!", "بالهناء والشفاء", "bil-hana' wash-shifa'"],
    ] },
  ];

  // Alphabet arabe : [lettre, nom, son en français]
  const ALPHABET_AR = [
    ["ا", "alif", "a long (aa) ; sert aussi de support à la hamza"], ["ب", "ba", "b"], ["ت", "ta", "t"], ["ث", "tha", "th (comme « think » en anglais)"], ["ج", "jim", "dj"], ["ح", "ḥa", "h soufflé du fond de la gorge"],
    ["خ", "kha", "kh (comme la jota espagnole)"], ["د", "dal", "d"], ["ذ", "dhal", "dh (comme « the » en anglais)"], ["ر", "ra", "r roulé"], ["ز", "zay", "z"], ["س", "sin", "s"],
    ["ش", "shin", "ch"], ["ص", "ṣad", "s appuyé"], ["ض", "ḍad", "d appuyé"], ["ط", "ṭa", "t appuyé"], ["ظ", "ẓa", "dh appuyé (comme ذ, en plus lourd)"], ["ع", "'ayn", "son de gorge propre à l'arabe"],
    ["غ", "ghayn", "r grasseyé, comme le r parisien"], ["ف", "fa", "f"], ["ق", "qaf", "k du fond de la gorge"], ["ك", "kaf", "k"], ["ل", "lam", "l"], ["م", "mim", "m"],
    ["ن", "nun", "n"], ["ه", "ha", "h léger"], ["و", "waw", "w ou « ou »"], ["ي", "ya", "y ou « i »"],
  ];

  window.LANGUES = { LANGUES, THEMES, ALPHABET_AR,
    mot: (m, l) => m[COL[l]], translit: m => m[6],
    themesPour: (l, g) => THEMES.filter(t => t.g <= g) };
})();
