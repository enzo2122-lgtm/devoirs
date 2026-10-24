/* Aide aux Devoirs — programmes officiels en vigueur pour l'année 2026-2027
   Chaque classe : ref (textes officiels), nouveau (ce qui change cette année), et par matière une liste
   de thèmes [intitulé, [identifiants d'exercices de l'application]].
   Classes : 0 PS, 1 MS, 2 GS, 3 CP, 4 CE1, 5 CE2, 6 CM1, 7 CM2, 8 6e, 9 5e, 10 4e, 11 3e, 12 2nde, 13 1re, 14 Tle */
(function () {
  "use strict";
  const ANNEE = "2026-2027";
  const SOURCES = [
    ["Programme de l'école maternelle — BO n° 19 du 7 mai 2026", "https://www.education.gouv.fr/bo/2026/Hebdo19/MENE2608627A"],
    ["Français et mathématiques, cycles 1 et 2 — BO n° 41 du 31 octobre 2024", "https://www.education.gouv.fr/bo/2024/Hebdo41/MENE2415135A"],
    ["Français et mathématiques, cycle 3 — BO n° 16 du 17 avril 2025", "https://www.education.gouv.fr/bo/2025/Hebdo16/MENE2504620A"],
    ["Français et mathématiques, cycle 4 — BO n° 10 du 5 mars 2026", "https://www.education.gouv.fr/bo/2026/Hebdo10/MENE2602912A"],
    ["Mathématiques au lycée — BO n° 14 du 2 avril 2026", "https://www.education.gouv.fr/bo/2026/Hebdo14/MENE2602916A"],
    ["Épreuve anticipée de mathématiques en 1re", "https://www.education.gouv.fr/reussir-au-lycee/epreuve-anticipee-de-mathematiques-en-classe-de-premiere-450607"],
  ];

  const P = {};
  // ---------------- Maternelle ----------------
  const REF_MAT = "Programme de l'école maternelle, arrêté du 16 avril 2026 (BO n° 19 du 7 mai 2026), et programmes de langage et de premiers outils mathématiques (BO n° 41 du 31 octobre 2024).";
  P[0] = { ref: REF_MAT, nouveau: "Nouveau programme de l'école maternelle à la rentrée 2026.", matieres: {
    maths: [["Comparer les quantités, compter jusqu'à 3", ["m_compter"]], ["Grand, petit", ["m_grand_petit"]], ["Reconnaître des formes : rond, carré, triangle", ["m_formes"]]],
    francais: [["Dire des comptines (au moins 5)", []], ["Écouter des histoires et en parler", []]],
    sciences: [["Les couleurs", ["m_couleurs"]], ["Les animaux", ["m_animaux"]], ["Les moments de la journée, jour et nuit", ["m_temps"]]] } };
  P[1] = { ref: REF_MAT, nouveau: "Nouveau programme de l'école maternelle à la rentrée 2026.", matieres: {
    maths: [["Compter jusqu'à 5 et reconnaître les chiffres", ["m_compter", "m_chiffres"]], ["Comparer : plus, moins, autant", ["m_plus_moins", "m_grand_petit"]],
      ["Formes et motifs, rythmes simples", ["m_formes", "m_suites"]]],
    francais: [["Reconnaître des lettres capitales", ["m_lettres"]], ["Dire des comptines (au moins 8)", []]],
    sciences: [["Les couleurs et leurs nuances", ["m_couleurs"]], ["Le corps et les cinq sens", ["m_corps"]], ["Les animaux", ["m_animaux"]],
      ["La semaine, hier, aujourd'hui, demain ; hiver et été", ["m_temps", "m_meteo"]]] } };
  P[2] = { ref: REF_MAT, nouveau: "Nouveau programme de l'école maternelle à la rentrée 2026.", matieres: {
    maths: [["Compter jusqu'à 10, écrire les chiffres", ["m_compter", "m_chiffres"]], ["Comparer des collections", ["m_plus_moins"]],
      ["Formes, assemblages, algorithmes", ["m_formes", "m_suites"]]],
    francais: [["Toutes les lettres capitales", ["m_lettres"]], ["Entendre les sons des mots", ["m_premier_son"]], ["Dire des comptines (au moins 10)", []]],
    sciences: [["Les animaux et leurs petits", ["m_animaux"]], ["Le corps et les sens", ["m_corps"]], ["Les mois et les saisons", ["m_temps", "m_meteo"]]] } };

  // ---------------- Cycle 2 ----------------
  P[3] = { ref: "Français et mathématiques : programmes du cycle 2 (BO n° 41 du 31 octobre 2024). Histoire-géographie (BO n° 22 du 28 mai 2026), sciences et technologie (BO n° 24 du 11 juin 2026) et langues vivantes (BO n° 12 du 19 mars 2026) : nouveaux programmes.",
    nouveau: "Nouveaux programmes d'histoire-géographie, de sciences et technologie et d'anglais au CP.", matieres: {
    maths: [["Les nombres jusqu'à 100", ["comparer"]], ["Additions et soustractions", ["addition", "soustraction"]], ["Compléments à 10, doubles", ["complements"]],
      ["Mesurer en cm et en m, la monnaie, l'heure", []], ["Formes : carré, rectangle, triangle, disque", []]],
    francais: [["Lire : les syllabes et les sons", ["syllabes"]], ["Écrire des mots et des phrases", []], ["Comprendre une histoire lue", []]],
    histoire: [["Se repérer dans le temps : jour, semaine, mois, saisons", []]], geographie: [["Se repérer dans l'espace : l'école, le quartier", []]],
    sciences: [["Le vivant : animaux et plantes", ["s_monde"]], ["La matière : l'eau, solide et liquide", ["s_monde"]], ["Le corps humain et les cinq sens", ["s_monde"]]],
    anglais: [["Se saluer, se présenter, les couleurs, les nombres", []]] } };
  P[4] = { ref: "Français et mathématiques : programmes du cycle 2 (BO n° 41 du 31 octobre 2024). Autres matières : programmes de 2020, renouvelés à la rentrée 2027.",
    nouveau: "Pas de nouveau programme cette année au CE1.", matieres: {
    maths: [["Les nombres jusqu'à 1 000", ["comparer"]], ["Additions et soustractions posées", ["addition", "soustraction"]], ["Tables d'addition et de multiplication", ["tables", "doubles"]],
      ["Premières fractions : demi, tiers, quart", ["fractions_debut"]], ["Mesures : m, cm, km, g, kg ; l'heure", ["conversions"]]],
    francais: [["Les homophones a/à, et/est", ["homophones"]], ["Le pluriel des noms", ["pluriel"]], ["Conjuguer au présent, futur, imparfait", ["conjugaison"]], ["Lire et comprendre", []]],
    histoire: [["Se repérer dans le temps : générations, frise", []]], geographie: [["Se repérer dans l'espace : ma commune, la France, le monde", ["g_france"]]],
    sciences: [["Le vivant, la matière, les objets", ["s_monde"]]], emc: [["Les règles de la classe, les symboles de la République", ["emc_republique"]]] } };
  P[5] = { ref: "Français et mathématiques : programmes du cycle 2 (BO n° 41 du 31 octobre 2024). Autres matières : programmes de 2020, renouvelés à la rentrée 2027.",
    nouveau: "Pas de nouveau programme cette année au CE2.", matieres: {
    maths: [["Les nombres jusqu'à 10 000", ["comparer"]], ["Multiplication posée", ["multiplication", "tables"]], ["Sens de la division", []],
      ["Fractions égales, additionner des fractions", ["fractions_debut"]], ["Mesures : longueurs, masses, contenances ; durées", ["conversions"]]],
    francais: [["Homophones grammaticaux", ["homophones"]], ["Nature des mots", ["nature"]], ["Conjugaison : présent, futur, imparfait, passé composé", ["conjugaison"]], ["Pluriels", ["pluriel"]]],
    histoire: [["Les grandes périodes de l'histoire", ["h_prehistoire"]]], geographie: [["La France et le monde", ["g_france", "g_monde"]]],
    sciences: [["Le vivant, la matière, les objets", ["s_monde"]]], emc: [["Droits, devoirs et symboles de la République", ["emc_republique"]]] } };

  // ---------------- Cycle 3 ----------------
  P[6] = { ref: "Français et mathématiques : programmes du cycle 3 (BO n° 16 du 17 avril 2025). Histoire-géographie, sciences et technologie, anglais : nouveaux programmes à la rentrée 2026 (BO n° 22 du 28 mai 2026, BO n° 24 du 11 juin 2026, BO n° 12 du 19 mars 2026).",
    nouveau: "Nouveaux programmes d'histoire-géographie, de sciences et technologie et d'anglais en CM1.", matieres: {
    maths: [["Grands nombres", ["comparer", "addition", "soustraction"]], ["Fractions", ["fractions"]], ["Nombres décimaux", ["decimaux", "comparer"]],
      ["Multiplication et division", ["multiplication", "division", "tables"]], ["Grandeurs et mesures", ["conversions"]], ["Proportionnalité", ["proportionnalite"]]],
    francais: [["Conjugaison", ["conjugaison"]], ["Grammaire : nature et fonction des mots", ["nature"]], ["Orthographe : homophones et accords", ["homophones", "pluriel"]]],
    histoire: [["Repères historiques : Préhistoire, Antiquité, Moyen Âge", ["h_prehistoire", "h_moyen_age"]]], geographie: [["Habiter la France", ["g_france"]]],
    sciences: [["Matière, mouvement, énergie ; le vivant ; la Terre", ["s_cycle3"]]], anglais: [["Vocabulaire du quotidien", ["vocabulaire_en"]]],
    emc: [["Vivre ensemble en République", ["emc_republique"]]] } };
  P[7] = { ref: "Français et mathématiques : programmes du cycle 3 (BO n° 16 du 17 avril 2025), appliqués en CM2 à partir de la rentrée 2026. Autres matières : programmes de 2020, renouvelés en 2027.",
    nouveau: "Nouveaux programmes de français et de mathématiques en CM2.", matieres: {
    maths: [["Nombres entiers et décimaux", ["decimaux", "comparer"]], ["Fractions", ["fractions"]], ["Opérations et calcul mental", ["multiplication", "division"]],
      ["Proportionnalité et pourcentages", ["proportionnalite", "pourcentages"]], ["Grandeurs et mesures", ["conversions"]]],
    francais: [["Conjugaison : passé simple, conditionnel", ["conjugaison"]], ["Grammaire", ["nature"]], ["Orthographe", ["homophones", "pluriel"]]],
    histoire: [["Les Temps modernes, la Révolution, le XIXe siècle", ["h_temps_modernes", "h_revolution"]], ["Le XXe siècle et les guerres mondiales", ["h_xxe"]]],
    geographie: [["Se déplacer, communiquer, mieux habiter", ["g_france", "g_monde"]]], sciences: [["Sciences et technologie", ["s_cycle3"]]],
    anglais: [["Vocabulaire et expression", ["vocabulaire_en"]]], emc: [["La République et la citoyenneté", ["emc_republique"]]] } };
  P[8] = { ref: "Français et mathématiques : programmes du cycle 3 (BO n° 16 du 17 avril 2025). EMC : nouveau programme à la rentrée 2026. Autres matières : programmes de 2020.",
    nouveau: "Nouveau programme d'EMC en 6e.", matieres: {
    maths: [["Nombres décimaux et fractions", ["decimaux", "fractions"]], ["Calcul : priorités et calcul mental", ["priorites", "division"]], ["Proportionnalité et pourcentages", ["proportionnalite", "pourcentages"]],
      ["Probabilités", ["probabilites"]], ["Grandeurs et mesures", ["conversions"]]],
    francais: [["Conjugaison", ["conjugaison"]], ["Grammaire", ["nature"]], ["Orthographe", ["homophones", "pluriel"]], ["Récits de création, contes, poésie", []]],
    histoire: [["La longue histoire de l'humanité", ["h_prehistoire"]], ["Récits fondateurs, Grèce, Rome, monothéismes", ["h_antiquite6e"]]],
    geographie: [["Habiter une métropole, les littoraux, le monde", ["g_habiter", "g_monde"]]], sciences: [["SVT et technologie", ["s_cycle3", "s_svt_college"]]],
    anglais: [["Vocabulaire et grammaire", ["vocabulaire_en"]]], emc: [["Être citoyen", ["emc_republique"]]] } };

  // ---------------- Cycle 4 ----------------
  P[9] = { ref: "Français et mathématiques : nouveau programme du cycle 4, arrêté du 18 février 2026 (BO n° 10 du 5 mars 2026), en 5e dès la rentrée 2026. Langues vivantes : nouveau programme (BO n° 22 du 29 mai 2025).",
    nouveau: "Nouveaux programmes de français, de mathématiques et de langues vivantes en 5e.", matieres: {
    maths: [["Priorités opératoires et distributivité", ["priorites"]], ["Nombres relatifs : additionner, soustraire", ["relatifs"]], ["Fractions : comparer, additionner, soustraire", ["fractions"]],
      ["Carrés et cubes", ["puissances"]], ["Calcul littéral, équations ax = c et x + b = c", ["equations"]], ["Proportionnalité et pourcentages", ["proportionnalite", "pourcentages"]],
      ["Statistiques et probabilités", ["probabilites"]], ["Triangles, angles, parallélogrammes, volumes", ["conversions"]]],
    francais: [["Conjugaison : temps de l'indicatif et impératif", ["conjugaison"]], ["Accords, participe passé avec être et avoir", ["homophones"]], ["Classes et fonctions des mots", ["nature"]],
      ["Héros, poésie du voyage, théâtre, contes et fables", []]],
    histoire: [["Chrétientés et islam (VIe-XIIIe siècles)", ["h_moyen_age"]], ["Société, Église et pouvoir dans l'Occident féodal", ["h_moyen_age"]], ["Transformations de l'Europe et ouverture sur le monde", ["h_temps_modernes"]]],
    geographie: [["Croissance démographique et développement", ["g_habiter"]], ["Richesses, ressources et risques", ["g_habiter"]]],
    sciences: [["SVT : la Terre, le vivant, le corps humain", ["s_svt_college"]]], physique: [["Matière, électricité, lumière, son", ["p_college1"]]],
    anglais: [["Vocabulaire, verbes irréguliers", ["vocabulaire_en", "verbes_irreguliers"]]], espagnol: [["Les bases", ["es_bases"]]], allemand: [["Les bases", ["de_bases"]]],
    emc: [["Liberté, égalité, fraternité, laïcité", ["emc_republique"]]] } };
  P[10] = { ref: "Français et mathématiques : programmes du cycle 4 de 2015-2020 (nouveau programme en 4e à la rentrée 2027). EMC : programme de 2024.",
    nouveau: "Pas de nouveau programme cette année en 4e.", matieres: {
    maths: [["Nombres relatifs : multiplier, diviser", ["relatifs"]], ["Fractions : les quatre opérations", ["fractions"]], ["Puissances", ["puissances"]],
      ["Calcul littéral et équations", ["equations"]], ["Théorème de Pythagore", ["pythagore", "racines"]], ["Proportionnalité, pourcentages, probabilités", ["pourcentages", "probabilites"]]],
    francais: [["Conjugaison : subjonctif, conditionnel", ["conjugaison"]], ["Homophones et accords", ["homophones"]], ["Grammaire de la phrase", ["nature"]]],
    histoire: [["Le XVIIIe siècle : Lumières et révolutions", ["h_revolution"]], ["Le XIXe siècle : industrialisation, colonisation, République", ["h_revolution"]]],
    geographie: [["Urbanisation, mobilités, mondialisation", ["g_mondialisation"]]], sciences: [["SVT", ["s_svt_college"]]], physique: [["Physique-chimie", ["p_college1"]]],
    anglais: [["Vocabulaire, verbes irréguliers", ["vocabulaire_en", "verbes_irreguliers"]]], espagnol: [["Grammaire et temps", ["es_avance", "es_bases"]]], allemand: [["Grammaire", ["de_avance", "de_bases"]]],
    emc: [["Droits et libertés", ["emc_republique"]]] } };
  P[11] = { ref: "Français et mathématiques : programmes du cycle 4 de 2015-2020 (nouveau programme en 3e à la rentrée 2028). EMC : nouveau programme à la rentrée 2026. Diplôme national du brevet en fin d'année.",
    nouveau: "Nouveau programme d'EMC en 3e. Année du brevet.", matieres: {
    maths: [["Calcul littéral, équations, identités", ["equations"]], ["Fonctions linéaires et affines", ["fonctions"]], ["Puissances et racines carrées", ["puissances", "racines"]],
      ["Pythagore, Thalès, trigonométrie", ["pythagore"]], ["Statistiques et probabilités", ["probabilites"]], ["Pourcentages", ["pourcentages"]]],
    francais: [["Conjugaison et accords du participe passé", ["conjugaison", "homophones"]], ["Grammaire", ["nature"]], ["Préparer le brevet", []]],
    histoire: [["Les guerres mondiales et les régimes totalitaires", ["h_xxe"]], ["Le monde depuis 1945", ["h_xxe"]], ["La France de 1944 à nos jours", ["h_xxe"]]],
    geographie: [["Dynamiques territoriales de la France", ["g_france"]], ["La France et l'Union européenne", ["g_mondialisation"]]],
    sciences: [["SVT : génétique, immunité, évolution", ["s_svt_college"]]], physique: [["Énergie, forces, chimie", ["p_3e", "p_college1"]]],
    anglais: [["Vocabulaire, verbes irréguliers", ["vocabulaire_en", "verbes_irreguliers"]]], espagnol: [["Grammaire et temps", ["es_avance"]]], allemand: [["Grammaire", ["de_avance"]]],
    emc: [["La République, la démocratie, la défense", ["emc_republique"]]] } };

  // ---------------- Lycée ----------------
  P[12] = { ref: "Mathématiques : nouveau programme de seconde (BO n° 14 du 2 avril 2026), à la rentrée 2026. Autres enseignements : programmes de 2019.",
    nouveau: "Nouveau programme de mathématiques en seconde : valeur absolue, probabilités conditionnelles, automatismes.", matieres: {
    maths: [["Automatismes de calcul", ["fractions", "puissances", "pourcentages"]], ["Équations et inéquations", ["equations"]], ["Fonctions, valeur absolue", ["fonctions", "valeur_absolue"]],
      ["Vecteurs, droites, repérage", ["droites"]], ["Statistiques et probabilités", ["probabilites"]]],
    francais: [["Conjugaison et langue", ["conjugaison"]], ["Poésie, roman, théâtre, littérature d'idées", []]],
    histoire: [["Le monde méditerranéen, XVe-XVIe siècles", ["h_temps_modernes"]], ["L'État moderne, les Lumières, la Révolution", ["h_revolution"]]],
    geographie: [["Sociétés et environnements, territoires, mobilités", ["g_mondialisation", "g_habiter"]]],
    sciences: [["SVT : la Terre, le vivant, le corps humain", ["s_svt_lycee"]]], physique: [["Constitution de la matière, mouvements, ondes", ["p_lycee"]]],
    ses: [["Marchés, production, socialisation", ["ses_bases"]]], anglais: [["Verbes irréguliers et vocabulaire", ["verbes_irreguliers", "vocabulaire_en"]]],
    espagnol: [["Grammaire", ["es_avance"]]], allemand: [["Grammaire", ["de_avance"]]], emc: [["La liberté", ["emc_republique"]]] } };
  P[13] = { ref: "Mathématiques : nouveaux programmes de première (BO n° 14 du 2 avril 2026), à la rentrée 2026. Épreuve anticipée de mathématiques en juin : 2 h, sans calculatrice, automatismes sur 6 points et exercices sur 14 points. Épreuves anticipées de français.",
    nouveau: "Nouveaux programmes de mathématiques en 1re et épreuve anticipée de mathématiques en juin.", matieres: {
    maths: [["Automatismes de l'épreuve anticipée", ["automatismes"]], ["Second degré", ["second_degre"]], ["Dérivation", ["derivees"]], ["Suites", ["suites"]],
      ["Probabilités conditionnelles", ["probabilites"]]],
    francais: [["Préparer les épreuves anticipées : œuvres au programme, commentaire, dissertation", []]],
    histoire: [["L'Europe face aux révolutions, la France 1848-1914", ["h_revolution"]], ["La Première Guerre mondiale", ["h_xxe"]]],
    geographie: [["Métropolisation, espaces productifs, espaces ruraux", ["g_mondialisation"]]],
    sciences: [["SVT / enseignement scientifique", ["s_svt_lycee"]]], physique: [["Physique-chimie", ["p_lycee"]]], ses: [["SES", ["ses_bases"]]],
    anglais: [["Langue et vocabulaire", ["verbes_irreguliers", "vocabulaire_en"]]], espagnol: [["Grammaire", ["es_avance"]]], allemand: [["Grammaire", ["de_avance"]]] } };
  P[14] = { ref: "Programmes de terminale de 2019 (nouveau programme de mathématiques prévu à la rentrée 2027). Épreuves de spécialité, philosophie et grand oral.",
    nouveau: "Pas de nouveau programme cette année en terminale.", matieres: {
    maths: [["Suites et limites", ["suites"]], ["Dérivation, convexité, exponentielle", ["derivees"]], ["Intégration", ["integrales"]], ["Probabilités, loi binomiale", ["probabilites"]], ["Second degré (rappels)", ["second_degre"]]],
    philo: [["Auteurs, notions et méthode de la dissertation", ["ph_auteurs"]]],
    histoire: [["Les années 1930, la Seconde Guerre mondiale", ["h_xxe"]], ["Guerre froide et monde depuis 1990", ["h_xxe"]]],
    geographie: [["Mers et océans, dynamiques territoriales, UE, France", ["g_mondialisation"]]],
    sciences: [["SVT : génétique, évolution, climat", ["s_svt_lycee"]]], physique: [["Physique-chimie", ["p_lycee"]]], ses: [["SES", ["ses_bases"]]],
    anglais: [["Langue et vocabulaire", ["verbes_irreguliers", "vocabulaire_en"]]], espagnol: [["Grammaire", ["es_avance"]]], allemand: [["Grammaire", ["de_avance"]]] } };

  window.PROGRAMME = { ANNEE, SOURCES, P, themes: (n, m) => ((P[n] || {}).matieres || {})[m] || [] };
})();
