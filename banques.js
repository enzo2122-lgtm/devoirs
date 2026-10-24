/* Aide aux Devoirs — banques de questions hors ligne (matières « à connaissances »)
   Format : B(matiere, id, titre, desc, [niveauMin, niveauMax], [[question, bonne réponse, [mauvaises], explication], …])
   Niveaux : 0 CP, 1 CE1, 2 CE2, 3 CM1, 4 CM2, 5 6e, 6 5e, 7 4e, 8 3e, 9 2nde, 10 1re, 11 Tle */
(function () {
  "use strict";
  const BANQUES = [];
  const B = (matiere, id, titre, desc, niveaux, items) => BANQUES.push({ matiere, id, titre, desc, niveaux, items });

  // =====================================================================
  //  HISTOIRE
  // =====================================================================
  B("histoire", "h_prehistoire", "Préhistoire et Antiquité", "Des premiers hommes à la Gaule romaine", [2, 5], [
    ["Comment appelle-t-on la très longue période avant l'invention de l'écriture ?", "La Préhistoire", ["L'Antiquité", "Le Moyen Âge", "La Renaissance"], "La Préhistoire se termine avec l'invention de l'écriture, vers 3300 avant J.-C."],
    ["Vers quelle date l'écriture a-t-elle été inventée ?", "Vers 3300 av. J.-C.", ["Vers 500 apr. J.-C.", "Vers 1000 apr. J.-C.", "Vers 50 000 av. J.-C."], "L'écriture apparaît en Mésopotamie vers 3300 avant J.-C."],
    ["Les peintures de la grotte de Lascaux ont été faites pendant…", "la Préhistoire", ["l'Antiquité", "le Moyen Âge", "la Révolution"], "Elles ont environ 20 000 ans : ce sont des œuvres de chasseurs-cueilleurs."],
    ["Au Néolithique, les hommes deviennent…", "agriculteurs et éleveurs", ["chevaliers", "commerçants sur Internet", "nomades sans outils"], "Au Néolithique, les hommes cultivent la terre, élèvent des animaux et se sédentarisent dans des villages."],
    ["Qui était Vercingétorix ?", "Un chef gaulois", ["Un empereur romain", "Un roi franc", "Un pharaon"], "Vercingétorix a uni des peuples gaulois contre Jules César, qui l'a vaincu à Alésia en 52 av. J.-C."],
    ["Quel général romain a conquis la Gaule ?", "Jules César", ["Clovis", "Charlemagne", "Napoléon"], "Jules César conquiert la Gaule entre 58 et 51 avant J.-C."],
    ["En quelle année Vercingétorix est-il battu à Alésia ?", "52 av. J.-C.", ["800", "1515", "476"], "La bataille d'Alésia en 52 av. J.-C. marque la fin de la résistance gauloise."],
    ["Le pont du Gard est…", "un aqueduc romain", ["un château fort", "une cathédrale", "un menhir"], "Les Romains construisaient des aqueducs pour amener l'eau jusqu'aux villes, ici jusqu'à Nîmes."],
    ["Dans les villes gallo-romaines, où se déroulaient les combats de gladiateurs ?", "Dans l'amphithéâtre (les arènes)", ["Dans le forum", "Dans les thermes", "Dans le temple"], "Les arènes de Nîmes et d'Arles sont des amphithéâtres romains encore visibles aujourd'hui."],
    ["Les menhirs et les dolmens datent de…", "la Préhistoire (Néolithique)", ["l'époque romaine", "la Renaissance", "la Révolution"], "Ces grandes pierres dressées, comme à Carnac, ont été érigées au Néolithique."],
  ]);
  B("histoire", "h_moyen_age", "Le Moyen Âge", "Rois, seigneurs, chevaliers et cathédrales", [3, 6], [
    ["Le Moyen Âge commence en 476 et se termine en…", "1492", ["1789", "1914", "800"], "On fait souvent finir le Moyen Âge avec l'arrivée de Christophe Colomb en Amérique en 1492."],
    ["Qui était Clovis ?", "Le roi des Francs qui se fait baptiser", ["Un chef gaulois", "Un empereur romain", "Un explorateur"], "Clovis, roi des Francs, se convertit au christianisme vers 500."],
    ["En quelle année Charlemagne est-il couronné empereur ?", "800", ["476", "1492", "1789"], "Charlemagne est couronné empereur à Rome le jour de Noël de l'an 800."],
    ["Qu'est-ce qu'un seigneur au Moyen Âge ?", "Un noble qui possède une seigneurie et protège ses paysans", ["Un moine qui recopie des livres", "Un marchand qui voyage", "Un soldat romain"], "Le seigneur vit dans son château fort et les paysans lui doivent des taxes et des corvées."],
    ["Comment appelle-t-on les travaux gratuits que les paysans doivent au seigneur ?", "Les corvées", ["Les croisades", "Les vacances", "Les tournois"], "Les paysans entretiennent les routes, le château ou les champs du seigneur sans être payés."],
    ["Pendant quelle guerre Jeanne d'Arc a-t-elle combattu ?", "La guerre de Cent Ans", ["La Première Guerre mondiale", "La guerre des Gaules", "Les guerres napoléoniennes"], "Jeanne d'Arc a combattu les Anglais et fait sacrer Charles VII à Reims en 1429."],
    ["Quel roi capétien est monté sur le trône en 987 ?", "Hugues Capet", ["Louis XIV", "Clovis", "Charlemagne"], "Hugues Capet est le premier roi de la dynastie des Capétiens."],
    ["Quel roi est aussi appelé Saint Louis ?", "Louis IX", ["Louis XIV", "Louis XVI", "Hugues Capet"], "Louis IX, roi au XIIIe siècle, est connu pour sa justice et sa foi."],
    ["Qui recopiait les livres à la main dans les monastères ?", "Les moines copistes", ["Les chevaliers", "Les seigneurs", "Les paysans"], "Avant l'imprimerie, les livres étaient copiés à la main par des moines."],
    ["Quelle grande épidémie frappe l'Europe à partir de 1347 ?", "La peste noire", ["La grippe espagnole", "Le choléra", "La varicelle"], "La peste noire tue environ un tiers de la population européenne."],
    ["En 1095, le pape Urbain II lance…", "la première croisade", ["la Réforme", "la Révolution", "la guerre de Cent Ans"], "Les croisades sont des expéditions militaires de chrétiens vers Jérusalem."],
    ["L'Hégire, point de départ du calendrier musulman, a lieu en…", "622", ["476", "800", "1095"], "En 622, Mahomet quitte La Mecque pour Médine : c'est l'Hégire."],
    ["Quelle était la capitale de l'Empire byzantin ?", "Constantinople", ["Rome", "Bagdad", "Paris"], "Constantinople (aujourd'hui Istanbul) est la capitale de l'Empire byzantin jusqu'en 1453."],
    ["Dans la société féodale, un vassal doit…", "fidélité et aide à son seigneur (suzerain)", ["payer des impôts au pape uniquement", "voter les lois", "vivre au monastère"], "En échange d'un fief, le vassal prête hommage et doit aide militaire et conseil à son suzerain."],
  ]);
  B("histoire", "h_temps_modernes", "Les Temps modernes", "Grandes découvertes, Renaissance, rois absolus", [3, 9], [
    ["En quelle année Christophe Colomb arrive-t-il en Amérique ?", "1492", ["1515", "1789", "1000"], "Colomb cherchait la route des Indes par l'ouest et atteint les Antilles en 1492."],
    ["Qui a mis au point l'imprimerie à caractères mobiles vers 1450 ?", "Gutenberg", ["Léonard de Vinci", "Louis XIV", "Napoléon"], "Grâce à l'imprimerie, les livres et les idées circulent beaucoup plus vite."],
    ["Quel roi de France a accueilli Léonard de Vinci ?", "François Ier", ["Louis XIV", "Henri IV", "Clovis"], "François Ier, roi de la Renaissance, invite Léonard de Vinci à Amboise."],
    ["Quel roi est surnommé le « Roi-Soleil » ?", "Louis XIV", ["Louis XVI", "François Ier", "Henri IV"], "Louis XIV règne de 1643 à 1715 et fait construire le château de Versailles."],
    ["Quel texte de 1598 accorde des droits aux protestants ?", "L'édit de Nantes", ["La Déclaration des droits de l'homme", "Le Code civil", "La Constitution de 1958"], "Henri IV signe l'édit de Nantes pour mettre fin aux guerres de Religion."],
    ["Quel moine allemand lance la Réforme protestante en 1517 ?", "Martin Luther", ["Jean Calvin", "Érasme", "Galilée"], "Luther critique la vente des indulgences par l'Église catholique."],
    ["Une monarchie absolue est un régime où…", "le roi concentre tous les pouvoirs", ["le peuple élit ses députés", "le pape gouverne le pays", "il n'y a pas de roi"], "Sous Louis XIV, le roi fait les lois, rend la justice et commande l'armée."],
    ["Quel savant affirme que la Terre tourne autour du Soleil, ce qui lui vaut un procès en 1633 ?", "Galilée", ["Gutenberg", "Colomb", "Voltaire"], "Galilée défend l'héliocentrisme de Copernic et est condamné par l'Église."],
    ["Qui a fait le premier tour du monde (expédition de 1519 à 1522) ?", "L'expédition de Magellan", ["Christophe Colomb", "Marco Polo", "Jacques Cartier"], "Magellan meurt en route, mais son expédition achève le premier tour du monde."],
    ["La Renaissance est d'abord née en…", "Italie", ["Angleterre", "Russie", "Espagne"], "Elle naît en Italie au XVe siècle avant de se diffuser en Europe."],
  ]);
  B("histoire", "h_revolution", "Révolution et XIXe siècle", "1789, Napoléon, la République, l'industrie", [4, 10], [
    ["Quel événement a lieu le 14 juillet 1789 ?", "La prise de la Bastille", ["Le sacre de Napoléon", "La mort de Louis XIV", "L'armistice"], "La prise de la Bastille symbolise le début de la Révolution française."],
    ["Quel texte est adopté en août 1789 ?", "La Déclaration des droits de l'homme et du citoyen", ["Le Code civil", "L'édit de Nantes", "La Constitution de 1958"], "Elle affirme que les hommes naissent et demeurent libres et égaux en droits."],
    ["Dans la nuit du 4 août 1789, les députés…", "abolissent les privilèges", ["proclament l'Empire", "exécutent le roi", "créent l'euro"], "La fin des privilèges met fin à la société d'ordres."],
    ["En quelle année la République est-elle proclamée pour la première fois en France ?", "1792", ["1789", "1804", "1958"], "La Ire République est proclamée en septembre 1792."],
    ["Quel roi est guillotiné en 1793 ?", "Louis XVI", ["Louis XIV", "Louis XVIII", "Charles X"], "Louis XVI est jugé et exécuté le 21 janvier 1793."],
    ["En quelle année Napoléon Bonaparte se fait-il sacrer empereur ?", "1804", ["1789", "1815", "1848"], "Napoléon est sacré empereur à Notre-Dame de Paris en 1804."],
    ["Quel grand texte de lois Napoléon fait-il rédiger en 1804 ?", "Le Code civil", ["La Déclaration des droits de l'homme", "La Constitution de la Ve République", "L'édit de Nantes"], "Le Code civil organise encore aujourd'hui une partie du droit français."],
    ["En quelle année l'esclavage est-il définitivement aboli dans les colonies françaises ?", "1848", ["1789", "1905", "1945"], "Le décret de 1848 est porté par Victor Schœlcher."],
    ["Quelle invention est au cœur de la révolution industrielle ?", "La machine à vapeur", ["L'imprimerie", "Internet", "La boussole"], "La machine à vapeur fait fonctionner usines, locomotives et bateaux au XIXe siècle."],
    ["Quel ministre rend l'école primaire gratuite, laïque et obligatoire (1881-1882) ?", "Jules Ferry", ["Victor Hugo", "Napoléon III", "Jean Jaurès"], "Les lois Ferry rendent l'école obligatoire pour les enfants de 6 à 13 ans."],
    ["En 1848, quel droit est accordé à tous les hommes adultes ?", "Le suffrage universel masculin", ["Le droit de vote des femmes", "Les congés payés", "La retraite"], "Les hommes de plus de 21 ans peuvent désormais voter."],
    ["Quelle loi de 1905 sépare les Églises et l'État ?", "La loi de séparation des Églises et de l'État", ["La loi Ferry", "Le Code civil", "La loi Veil"], "Elle garantit la liberté de conscience et la neutralité de l'État : c'est la laïcité."],
    ["Quel mouvement d'idées du XVIIIe siècle défend la raison et la liberté ?", "Les Lumières", ["La Renaissance", "Le romantisme", "La Réforme"], "Voltaire, Montesquieu, Rousseau, Diderot sont des philosophes des Lumières."],
    ["Quel philosophe propose la séparation des pouvoirs ?", "Montesquieu", ["Voltaire", "Rousseau", "Diderot"], "Dans De l'esprit des lois (1748), il distingue pouvoirs législatif, exécutif et judiciaire."],
    ["Qui dirige l'Encyclopédie ?", "Diderot et d'Alembert", ["Voltaire et Rousseau", "Hugo et Zola", "Colbert et Louis XIV"], "L'Encyclopédie rassemble les savoirs de l'époque dans un esprit critique."],
    ["Le « commerce triangulaire » relie…", "l'Europe, l'Afrique et l'Amérique", ["la France, l'Italie et l'Espagne", "l'Asie, l'Océanie et l'Europe", "Paris, Lyon et Marseille"], "Des millions d'Africains ont été déportés et réduits en esclavage en Amérique par la traite atlantique."],
    ["En quelle année se produit la Commune de Paris ?", "1871", ["1789", "1848", "1914"], "Au printemps 1871, les insurgés de Paris sont écrasés lors de la « Semaine sanglante »."],
  ]);
  B("histoire", "h_xxe", "Le XXe siècle", "Guerres mondiales, guerre froide, Europe", [4, 11], [
    ["Quelles sont les dates de la Première Guerre mondiale ?", "1914-1918", ["1939-1945", "1870-1871", "1954-1962"], "Elle se termine par l'armistice du 11 novembre 1918."],
    ["Que commémore-t-on le 11 novembre ?", "L'armistice de 1918", ["La fin de la Seconde Guerre mondiale", "La prise de la Bastille", "Le débarquement"], "Le 11 novembre 1918, les combats de la Première Guerre mondiale s'arrêtent."],
    ["Quelle bataille de 1916 est devenue le symbole de la Grande Guerre en France ?", "Verdun", ["Alésia", "Waterloo", "Stalingrad"], "Près de 300 000 soldats y sont morts en dix mois."],
    ["Quelles sont les dates de la Seconde Guerre mondiale ?", "1939-1945", ["1914-1918", "1870-1871", "1947-1991"], "Elle se termine en Europe le 8 mai 1945 et en Asie le 2 septembre 1945."],
    ["Qui lance l'appel du 18 juin 1940 depuis Londres ?", "Le général de Gaulle", ["Le maréchal Pétain", "Jean Moulin", "Winston Churchill"], "De Gaulle appelle les Français à continuer le combat contre l'Allemagne nazie."],
    ["Comment appelle-t-on le génocide des Juifs d'Europe par les nazis ?", "La Shoah", ["La Terreur", "La guerre froide", "Le Blitz"], "Près de 6 millions de Juifs ont été assassinés."],
    ["En quelle année les femmes obtiennent-elles le droit de vote en France ?", "1944", ["1848", "1789", "1981"], "Accordé en 1944, il est exercé pour la première fois en 1945."],
    ["Qui unifie la Résistance intérieure au sein du Conseil national de la Résistance ?", "Jean Moulin", ["Philippe Pétain", "Jean Jaurès", "Georges Clemenceau"], "Jean Moulin, arrêté en 1943, meurt après avoir été torturé."],
    ["Quel régime gouverne la France occupée de 1940 à 1944 ?", "Le régime de Vichy, dirigé par Pétain", ["La IVe République", "Le Front populaire", "Le Second Empire"], "Le régime de Vichy collabore avec l'Allemagne nazie."],
    ["Quelle ville est détruite par une bombe atomique le 6 août 1945 ?", "Hiroshima", ["Tokyo", "Berlin", "Pearl Harbor"], "Une seconde bombe frappe Nagasaki le 9 août 1945."],
    ["Comment appelle-t-on l'opposition entre les États-Unis et l'URSS de 1947 à 1991 ?", "La guerre froide", ["La guerre de Cent Ans", "La Grande Guerre", "La guerre d'Algérie"], "Les deux superpuissances s'affrontent sans guerre directe entre elles."],
    ["En quelle année le mur de Berlin tombe-t-il ?", "1989", ["1961", "1945", "1991"], "Construit en 1961, il tombe le 9 novembre 1989."],
    ["En quelle année commence la Ve République ?", "1958", ["1945", "1789", "1968"], "La Constitution de la Ve République est adoptée par référendum en 1958."],
    ["Quel traité de 1957 crée la Communauté économique européenne ?", "Le traité de Rome", ["Le traité de Versailles", "Le traité de Maastricht", "Le traité de Verdun"], "Six pays fondent la CEE, ancêtre de l'Union européenne."],
    ["En quelle année l'Algérie devient-elle indépendante ?", "1962", ["1830", "1945", "1954"], "Les accords d'Évian mettent fin à la guerre d'Algérie (1954-1962)."],
    ["Qui devient chancelier en Allemagne en janvier 1933 ?", "Adolf Hitler", ["Benito Mussolini", "Joseph Staline", "Franklin Roosevelt"], "Hitler installe rapidement une dictature totalitaire."],
    ["Quelle crise économique commence aux États-Unis en 1929 ?", "Le krach de Wall Street", ["Le choc pétrolier", "La crise des subprimes", "La peste noire"], "Elle déclenche une grave crise mondiale dans les années 1930."],
    ["En 1936, le Front populaire obtient…", "les congés payés", ["le droit de vote des femmes", "l'abolition de l'esclavage", "l'euro"], "Les salariés obtiennent deux semaines de congés payés et la semaine de 40 heures."],
    ["Qui dirige la révolution bolchevique en Russie en 1917 ?", "Lénine", ["Staline", "Tsar Nicolas II", "Trotski"], "Lénine prend le pouvoir en octobre 1917."],
    ["Quel traité de 1919 impose de lourdes conditions à l'Allemagne ?", "Le traité de Versailles", ["Le traité de Rome", "Le traité de Maastricht", "Les accords d'Évian"], "L'Allemagne perd des territoires et doit payer des réparations."],
    ["Quelle crise de 1962 fait craindre une guerre nucléaire ?", "La crise des missiles de Cuba", ["Le blocus de Berlin", "La guerre de Corée", "La crise de Suez"], "L'URSS installe des missiles à Cuba ; Kennedy et Khrouchtchev finissent par négocier."],
    ["En quelle année la peine de mort est-elle abolie en France ?", "1981", ["1945", "1905", "1968"], "La loi est portée par Robert Badinter."],
    ["Quel traité de 1992 crée l'Union européenne ?", "Le traité de Maastricht", ["Le traité de Rome", "Le traité de Lisbonne", "Le traité de Versailles"], "Il prévoit aussi la future monnaie unique, l'euro."],
    ["Quel plan américain aide la reconstruction de l'Europe à partir de 1947 ?", "Le plan Marshall", ["Le plan Schuman", "Le New Deal", "Le plan Barbarossa"], "Les États-Unis financent la reconstruction pour éviter l'expansion du communisme."],
    ["Quel génocide a lieu au Rwanda en 1994 ?", "Le génocide des Tutsi", ["Le génocide arménien", "La Shoah", "Le génocide cambodgien"], "Environ 800 000 personnes, majoritairement tutsi, sont massacrées en trois mois."],
    ["En quelle année l'Inde devient-elle indépendante ?", "1947", ["1918", "1962", "1989"], "Gandhi a mené la lutte non violente contre la domination britannique."],
  ]);
  B("histoire", "h_antiquite6e", "Les premiers États et la Méditerranée antique", "Mésopotamie, Égypte, Grèce, Rome, monothéismes", [5, 9], [
    ["Quelle écriture est inventée en Mésopotamie ?", "L'écriture cunéiforme", ["Les hiéroglyphes", "L'alphabet latin", "Les idéogrammes chinois"], "Les scribes gravaient des signes en forme de clous sur des tablettes d'argile."],
    ["Comment s'appelle le souverain de l'Égypte ancienne ?", "Le pharaon", ["L'empereur", "Le consul", "Le calife"], "Le pharaon est considéré comme un dieu vivant."],
    ["Quel fleuve permet le développement de l'Égypte antique ?", "Le Nil", ["Le Tigre", "Le Rhône", "Le Gange"], "Ses crues fertilisent les terres agricoles."],
    ["Dans quelle cité grecque naît la démocratie ?", "Athènes", ["Sparte", "Rome", "Troie"], "Au Ve siècle av. J.-C., les citoyens athéniens votent les lois à l'Ecclésia."],
    ["Qui sont exclus de la citoyenneté à Athènes ?", "Les femmes, les esclaves et les métèques", ["Les paysans", "Les soldats", "Les marchands athéniens"], "Seuls les hommes libres, nés de parents athéniens, sont citoyens."],
    ["Où se déroulent les Jeux olympiques antiques ?", "À Olympie", ["À Athènes", "À Rome", "À Delphes"], "Ils sont organisés en l'honneur de Zeus, tous les quatre ans."],
    ["Quel poète grec est l'auteur présumé de l'Iliade et de l'Odyssée ?", "Homère", ["Platon", "Virgile", "Périclès"], "L'Odyssée raconte le long retour d'Ulysse à Ithaque."],
    ["Selon la légende, qui fonde Rome en 753 av. J.-C. ?", "Romulus", ["Jules César", "Ulysse", "Auguste"], "Romulus et son jumeau Rémus auraient été recueillis par une louve."],
    ["Qui est le premier empereur romain ?", "Auguste", ["Jules César", "Néron", "Constantin"], "Octave devient Auguste en 27 av. J.-C."],
    ["Quelle religion est le premier monothéisme ?", "Le judaïsme", ["Le christianisme", "L'islam", "La religion grecque"], "Les Hébreux croient en un dieu unique ; leurs textes forment la Bible hébraïque."],
    ["Quel empereur romain se convertit au christianisme ?", "Constantin", ["Auguste", "Néron", "Caligula"], "Constantin autorise le christianisme en 313."],
    ["Qu'est-ce qu'un polythéisme ?", "La croyance en plusieurs dieux", ["La croyance en un seul dieu", "L'absence de religion", "Un régime politique"], "Les Grecs et les Romains étaient polythéistes : Zeus/Jupiter, Athéna/Minerve…"],
  ]);

  // =====================================================================
  //  GÉOGRAPHIE
  // =====================================================================
  B("geographie", "g_france", "La France", "Fleuves, montagnes, régions, outre-mer", [1, 8], [
    ["Quelle est la capitale de la France ?", "Paris", ["Lyon", "Marseille", "Bordeaux"], "Paris est la capitale et la plus grande ville de France."],
    ["Quel est le plus long fleuve de France ?", "La Loire", ["La Seine", "Le Rhône", "La Garonne"], "La Loire mesure environ 1 000 km et se jette dans l'océan Atlantique."],
    ["Quel fleuve traverse Paris ?", "La Seine", ["La Loire", "Le Rhin", "La Garonne"], "La Seine traverse Paris puis se jette dans la Manche, au Havre."],
    ["Quel est le plus haut sommet de France ?", "Le mont Blanc", ["Le Vignemale", "Le puy de Dôme", "Le mont Ventoux"], "Il culmine à environ 4 800 m dans les Alpes."],
    ["Quelle chaîne de montagnes sépare la France de l'Espagne ?", "Les Pyrénées", ["Les Alpes", "Les Vosges", "Le Jura"], "Les Pyrénées s'étendent de l'Atlantique à la Méditerranée."],
    ["Quelle mer borde le sud de la France ?", "La mer Méditerranée", ["La Manche", "La mer du Nord", "La mer Baltique"], "Marseille, Nice et Montpellier sont proches de la Méditerranée."],
    ["Combien de régions compte la France métropolitaine ?", "13", ["22", "101", "5"], "Depuis 2016, la métropole compte 13 régions (dont la Corse)."],
    ["Quelle île française se trouve en Méditerranée ?", "La Corse", ["La Réunion", "La Martinique", "Mayotte"], "Ajaccio et Bastia sont les principales villes de Corse."],
    ["Lequel de ces territoires est un département d'outre-mer ?", "La Guadeloupe", ["La Sicile", "Jersey", "Les Baléares"], "Les cinq DROM sont : Guadeloupe, Martinique, Guyane, La Réunion et Mayotte."],
    ["Où se trouve la Guyane française ?", "En Amérique du Sud", ["En Afrique", "En Asie", "En Océanie"], "La Guyane est frontalière du Brésil et du Suriname."],
    ["Quel massif se trouve au centre de la France ?", "Le Massif central", ["Les Alpes", "Les Pyrénées", "Les Vosges"], "On y trouve d'anciens volcans comme le puy de Dôme."],
    ["Quelle mer sépare la France de l'Angleterre ?", "La Manche", ["La Méditerranée", "La mer Noire", "La mer Rouge"], "On peut la traverser en ferry ou par le tunnel sous la Manche."],
    ["Quelle est la deuxième plus grande agglomération française ?", "Lyon", ["Toulouse", "Lille", "Nice"], "Lyon est au confluent du Rhône et de la Saône."],
    ["Grâce à l'outre-mer, la France possède l'un des plus grands espaces maritimes du monde. Comment l'appelle-t-on ?", "Une zone économique exclusive (ZEE)", ["Une zone industrialo-portuaire", "L'espace Schengen", "Un parc naturel"], "La ZEE française couvre environ 10 millions de km², la 2e du monde."],
    ["Comment appelle-t-on l'extension des villes sur les campagnes autour d'elles ?", "La périurbanisation", ["La désertification", "La littoralisation", "La déforestation"], "Beaucoup de familles s'installent en périphérie et font des trajets quotidiens vers la ville."],
  ]);
  B("geographie", "g_monde", "Le monde", "Continents, océans, pays et capitales", [2, 8], [
    ["Quel est le plus grand océan du monde ?", "L'océan Pacifique", ["L'océan Atlantique", "L'océan Indien", "L'océan Arctique"], "Il couvre environ un tiers de la surface de la Terre."],
    ["Sur quel continent se trouve l'Égypte ?", "L'Afrique", ["L'Asie", "L'Europe", "L'Amérique"], "L'Égypte est au nord-est de l'Afrique."],
    ["Quel est le plus haut sommet du monde ?", "L'Everest", ["Le mont Blanc", "Le Kilimandjaro", "L'Aconcagua"], "Il culmine à environ 8 849 m dans l'Himalaya."],
    ["Quel est le plus grand pays du monde par sa superficie ?", "La Russie", ["La Chine", "Les États-Unis", "Le Canada"], "La Russie s'étend de l'Europe à l'océan Pacifique."],
    ["Quel est aujourd'hui le pays le plus peuplé du monde ?", "L'Inde", ["La Chine", "Les États-Unis", "Le Brésil"], "L'Inde a dépassé la Chine en 2023 avec plus de 1,4 milliard d'habitants."],
    ["Quel est le plus grand désert chaud du monde ?", "Le Sahara", ["Le Gobi", "L'Atacama", "Le Kalahari"], "Le Sahara couvre une grande partie du nord de l'Afrique."],
    ["Quelle ligne imaginaire partage la Terre en deux hémisphères, nord et sud ?", "L'équateur", ["Le méridien de Greenwich", "Le tropique du Cancer", "Le cercle polaire"], "Il fait environ 40 000 km de long."],
    ["Quelle est la capitale de l'Espagne ?", "Madrid", ["Barcelone", "Séville", "Lisbonne"], "Madrid est au centre de l'Espagne."],
    ["Quelle est la capitale de l'Allemagne ?", "Berlin", ["Munich", "Francfort", "Vienne"], "Berlin est redevenue capitale après la réunification de 1990."],
    ["Quelle est la capitale du Royaume-Uni ?", "Londres", ["Manchester", "Dublin", "Édimbourg"], "Londres est traversée par la Tamise."],
    ["Quelle est la capitale des États-Unis ?", "Washington", ["New York", "Los Angeles", "Chicago"], "New York est la plus grande ville, mais la capitale est Washington."],
    ["Quelle est la capitale du Canada ?", "Ottawa", ["Toronto", "Montréal", "Vancouver"], "Ottawa est dans la province de l'Ontario."],
    ["Quelle est la capitale du Japon ?", "Tokyo", ["Kyoto", "Osaka", "Pékin"], "L'agglomération de Tokyo est l'une des plus peuplées du monde."],
    ["Quelle est la capitale du Brésil ?", "Brasília", ["Rio de Janeiro", "São Paulo", "Buenos Aires"], "Brasília a été construite dans les années 1950 pour devenir la capitale."],
    ["Quelle est la capitale de l'Australie ?", "Canberra", ["Sydney", "Melbourne", "Wellington"], "Canberra a été choisie comme compromis entre Sydney et Melbourne."],
    ["Quelle est la capitale du Maroc ?", "Rabat", ["Casablanca", "Marrakech", "Alger"], "Casablanca est la plus grande ville, Rabat la capitale."],
    ["Quelle est la capitale du Sénégal ?", "Dakar", ["Bamako", "Abidjan", "Saint-Louis"], "Dakar est le point le plus à l'ouest de l'Afrique continentale."],
    ["Dans quelle chaîne de montagnes se trouve l'Everest ?", "L'Himalaya", ["Les Andes", "Les Alpes", "Les Rocheuses"], "L'Himalaya sépare l'Inde et le Népal de la Chine (Tibet)."],
    ["Quel fleuve traverse la forêt amazonienne ?", "L'Amazone", ["Le Nil", "Le Mississippi", "Le Congo"], "C'est le fleuve qui a le plus gros débit au monde."],
  ]);
  B("geographie", "g_habiter", "Habiter et peupler le monde", "Population, villes, ressources, développement durable", [5, 9], [
    ["Environ combien d'habitants compte la Terre ?", "8 milliards", ["800 millions", "2 milliards", "80 milliards"], "La population mondiale a dépassé 8 milliards en 2022."],
    ["Qu'est-ce que la densité de population ?", "Le nombre d'habitants par km²", ["Le nombre de naissances par an", "Le nombre d'habitants d'un pays", "La taille d'une ville"], "Densité = population ÷ superficie."],
    ["Quel est le plus grand foyer de peuplement du monde ?", "L'Asie de l'Est (Chine, Japon, Corée)", ["Le Sahara", "L'Antarctique", "L'Amazonie"], "Avec l'Asie du Sud et l'Europe, c'est l'un des trois grands foyers de peuplement."],
    ["Quels sont les trois piliers du développement durable ?", "Économique, social et environnemental", ["Politique, militaire et religieux", "Agricole, industriel et commercial", "Local, national et mondial"], "Le développement durable répond aux besoins actuels sans compromettre ceux des générations futures."],
    ["Qu'est-ce qu'une métropole ?", "Une grande ville qui concentre des fonctions de commandement", ["Un petit village", "Une zone agricole", "Une région désertique"], "Les métropoles concentrent sièges d'entreprises, universités, pouvoirs politiques."],
    ["Qu'appelle-t-on la littoralisation ?", "La concentration des hommes et des activités sur les côtes", ["L'érosion des montagnes", "La construction de barrages", "L'exode vers les campagnes"], "Environ la moitié de l'humanité vit à moins de 150 km d'une côte."],
    ["Que mesure l'IDH ?", "Le niveau de développement (santé, éducation, niveau de vie)", ["La température moyenne", "La taille d'un pays", "Le nombre de touristes"], "L'indice de développement humain va de 0 à 1."],
    ["Qu'est-ce qu'un bidonville ?", "Un quartier d'habitat précaire et informel", ["Un quartier d'affaires", "Une ville nouvelle", "Une zone industrielle"], "On en trouve surtout dans les villes des pays en développement."],
    ["Laquelle de ces énergies est renouvelable ?", "L'énergie solaire", ["Le pétrole", "Le charbon", "Le gaz naturel"], "Le soleil, le vent, l'eau sont des sources d'énergie qui ne s'épuisent pas."],
    ["Combien d'États sont membres de l'ONU ?", "193", ["27", "50", "250"], "Le siège de l'ONU est à New York."],
  ]);
  B("geographie", "g_mondialisation", "Mondialisation et Union européenne", "Échanges, ports, UE, espace Schengen", [7, 11], [
    ["Qu'est-ce que la mondialisation ?", "La mise en relation des territoires du monde par les échanges", ["Le réchauffement climatique", "La croissance des villes", "La fin des frontières"], "Marchandises, personnes, capitaux et informations circulent à l'échelle mondiale."],
    ["Quelle boîte standardisée transporte l'essentiel des marchandises par mer ?", "Le conteneur", ["Le wagon", "La palette", "Le cargo"], "Le conteneur a fait baisser fortement le coût du transport maritime."],
    ["Quel est le premier port du monde pour les conteneurs ?", "Shanghai", ["Rotterdam", "Le Havre", "New York"], "Les grands ports mondiaux sont surtout en Asie de l'Est."],
    ["Combien d'États compte l'Union européenne ?", "27", ["12", "15", "50"], "Depuis le départ du Royaume-Uni (Brexit) en 2020."],
    ["Où siège le Parlement européen ?", "À Strasbourg", ["À Paris", "À Berlin", "À Genève"], "Il siège à Strasbourg, et travaille aussi à Bruxelles."],
    ["Que permet l'espace Schengen ?", "La libre circulation des personnes sans contrôle aux frontières intérieures", ["L'utilisation de l'euro", "L'élection du président européen", "Le libre-échange avec la Chine"], "Tous les membres de l'UE ne sont pas dans Schengen, et certains pays hors UE y sont (Suisse, Norvège)."],
    ["Quel canal relie la mer Méditerranée à la mer Rouge ?", "Le canal de Suez", ["Le canal de Panama", "Le canal du Midi", "Le détroit de Gibraltar"], "Il évite aux navires de contourner l'Afrique."],
    ["Qu'est-ce qu'une ZIP ?", "Une zone industrialo-portuaire", ["Une zone interdite de pêche", "Un parc naturel", "Une zone de libre-échange"], "Les industries s'installent au bord des grands ports, comme au Havre ou à Fos-sur-Mer."],
    ["Qu'appelle-t-on « métropolisation » ?", "La concentration des populations et des activités dans les grandes villes", ["L'exode rural", "Le déclin des villes", "La création de villages"], "Les métropoles attirent les fonctions de commandement."],
    ["Quel détroit stratégique voit passer une grande part du pétrole mondial ?", "Le détroit d'Ormuz", ["Le pas de Calais", "Le détroit de Béring", "Le détroit de Magellan"], "Il relie le golfe Persique à l'océan Indien."],
  ]);

  // =====================================================================
  //  SCIENCES & SVT
  // =====================================================================
  B("sciences", "s_monde", "Questionner le monde", "Animaux, plantes, corps, eau, temps", [0, 2], [
    ["Combien y a-t-il de saisons dans une année ?", "4", ["2", "7", "12"], "Le printemps, l'été, l'automne et l'hiver."],
    ["Combien y a-t-il de jours dans une semaine ?", "7", ["5", "10", "12"], "Lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche."],
    ["Combien y a-t-il de mois dans une année ?", "12", ["7", "10", "52"], "De janvier à décembre."],
    ["Quel animal pond des œufs ?", "La poule", ["Le chat", "La vache", "Le chien"], "Les animaux qui pondent des œufs sont des ovipares."],
    ["Quel animal est un mammifère ?", "Le dauphin", ["Le requin", "La sardine", "Le crabe"], "Le dauphin respire de l'air et allaite ses petits : c'est un mammifère."],
    ["Que devient la chenille ?", "Un papillon", ["Une abeille", "Une araignée", "Un escargot"], "La chenille fabrique une chrysalide puis devient papillon : c'est une métamorphose."],
    ["De quoi une plante a-t-elle besoin pour pousser ?", "D'eau et de lumière", ["De sucre et de lait", "De noir et de froid", "De sable seulement"], "Sans lumière ni eau, la plante jaunit et meurt."],
    ["Combien avons-nous de sens ?", "5", ["3", "4", "10"], "La vue, l'ouïe, le toucher, le goût et l'odorat."],
    ["Avec quel organe sent-on les odeurs ?", "Le nez", ["Les oreilles", "Les yeux", "La langue"], "L'odorat est le sens du nez."],
    ["Que devient l'eau quand il fait très froid (en dessous de 0 °C) ?", "De la glace", ["De la vapeur", "Du sable", "Du lait"], "L'eau gèle à 0 °C : elle devient solide."],
    ["Que devient un glaçon au soleil ?", "De l'eau liquide", ["De la glace plus dure", "Du sable", "Du sel"], "La glace fond : elle passe de l'état solide à l'état liquide."],
    ["Que mange un herbivore ?", "Des plantes", ["De la viande", "Des insectes uniquement", "Rien"], "La vache, le lapin et le cheval sont herbivores."],
    ["La Terre tourne autour…", "du Soleil", ["de la Lune", "de Mars", "d'elle-même seulement"], "Elle fait le tour du Soleil en un an."],
    ["Quel est le petit d'une vache ?", "Le veau", ["Le poulain", "L'agneau", "Le chaton"], "Poulain (cheval), agneau (mouton), chaton (chat)."],
  ]);
  B("sciences", "s_cycle3", "Sciences et technologie", "Matière, énergie, vivant, Terre et Univers", [3, 5], [
    ["À quelle température l'eau bout-elle (au niveau de la mer) ?", "100 °C", ["0 °C", "50 °C", "37 °C"], "À 100 °C, l'eau liquide devient de la vapeur."],
    ["Quels sont les trois états de l'eau ?", "Solide, liquide, gazeux", ["Chaud, froid, tiède", "Sucré, salé, amer", "Clair, trouble, sale"], "Glace (solide), eau (liquide), vapeur d'eau (gaz)."],
    ["Dans une chaîne alimentaire, qui est toujours au début ?", "Un végétal", ["Un carnivore", "Un champignon", "Un oiseau"], "Les végétaux produisent leur matière grâce à la lumière : ce sont les producteurs."],
    ["Quel organe pompe le sang dans tout le corps ?", "Le cœur", ["Les poumons", "L'estomac", "Le foie"], "Le cœur est un muscle qui bat environ 70 fois par minute au repos."],
    ["Où passe l'oxygène de l'air dans le sang ?", "Dans les poumons", ["Dans l'estomac", "Dans le cœur", "Dans les reins"], "Les poumons échangent l'oxygène contre le dioxyde de carbone."],
    ["Où les aliments digérés passent-ils dans le sang ?", "Dans l'intestin grêle", ["Dans la bouche", "Dans l'œsophage", "Dans le cœur"], "La paroi de l'intestin grêle laisse passer les nutriments dans le sang."],
    ["En combien de temps la Terre fait-elle un tour sur elle-même ?", "24 heures", ["1 an", "1 mois", "1 semaine"], "Cette rotation crée l'alternance du jour et de la nuit."],
    ["En combien de temps la Terre fait-elle le tour du Soleil ?", "Environ 365 jours", ["24 heures", "28 jours", "100 ans"], "C'est la durée d'une année."],
    ["Combien de planètes compte le système solaire ?", "8", ["9", "7", "12"], "Mercure, Vénus, Terre, Mars, Jupiter, Saturne, Uranus, Neptune."],
    ["Quel matériau conduit l'électricité ?", "Le cuivre (un métal)", ["Le plastique", "Le bois sec", "Le verre"], "Les métaux sont conducteurs ; le plastique est isolant."],
    ["Pour qu'une ampoule s'allume, le circuit doit être…", "fermé", ["ouvert", "coupé", "mouillé"], "Le courant ne circule que dans une boucle fermée."],
    ["Quelle énergie n'est pas renouvelable ?", "Le pétrole", ["Le vent", "Le soleil", "L'eau des rivières"], "Le pétrole s'est formé en des millions d'années : son stock s'épuise."],
    ["Combien de dents de lait a un enfant ?", "20", ["32", "10", "28"], "Un adulte a 32 dents définitives."],
    ["Quel est le satellite naturel de la Terre ?", "La Lune", ["Le Soleil", "Mars", "L'étoile Polaire"], "La Lune fait le tour de la Terre en environ 28 jours."],
    ["Quel gaz les plantes rejettent-elles à la lumière ?", "Le dioxygène", ["Le dioxyde de carbone", "L'azote", "La fumée"], "Grâce à la photosynthèse, les plantes absorbent du CO₂ et rejettent du dioxygène."],
    ["Combien d'os compte environ le squelette d'un adulte ?", "206", ["50", "1 000", "32"], "Le bébé en a davantage : certains os se soudent en grandissant."],
  ]);
  B("sciences", "s_svt_college", "SVT collège", "Cellules, nutrition, Terre, génétique, immunité", [5, 8], [
    ["Quelle est l'unité de base de tous les êtres vivants ?", "La cellule", ["L'atome", "L'organe", "Le tissu"], "Tout être vivant est fait d'une ou de plusieurs cellules."],
    ["De quoi une plante verte a-t-elle besoin pour fabriquer sa matière (photosynthèse) ?", "De lumière, d'eau, de sels minéraux et de CO₂", ["De sucre et d'oxygène", "D'obscurité et de chaleur", "De viande et d'eau"], "La photosynthèse a lieu dans les chloroplastes des feuilles."],
    ["Combien de chromosomes possède une cellule humaine (hors gamètes) ?", "46", ["23", "48", "92"], "Soit 23 paires, dont une paire de chromosomes sexuels."],
    ["Combien de chromosomes contient un gamète humain (ovule ou spermatozoïde) ?", "23", ["46", "12", "92"], "La fécondation réunit deux gamètes : 23 + 23 = 46."],
    ["Où se trouve l'information génétique dans une cellule ?", "Dans le noyau, sur l'ADN", ["Dans la membrane", "Dans le cytoplasme seulement", "Dans le sang"], "Les chromosomes sont faits d'ADN."],
    ["Contre quels microbes les antibiotiques sont-ils efficaces ?", "Les bactéries", ["Les virus", "Tous les microbes", "Les champignons seulement"], "Les antibiotiques n'agissent pas sur les virus comme celui de la grippe."],
    ["Quelles cellules fabriquent les anticorps ?", "Les lymphocytes B", ["Les globules rouges", "Les neurones", "Les plaquettes"], "Les anticorps neutralisent un antigène précis."],
    ["Quel est le principe de la vaccination ?", "Préparer le système immunitaire grâce à une mémoire immunitaire", ["Tuer directement les bactéries", "Remplacer les globules blancs", "Guérir une maladie déjà déclarée"], "Le vaccin contient un agent rendu inoffensif : l'organisme garde la mémoire de sa rencontre."],
    ["Les séismes et les volcans sont surtout situés…", "aux limites des plaques lithosphériques", ["au centre des continents", "au pôle Nord", "au hasard"], "Les plaques bougent de quelques centimètres par an."],
    ["Comment s'appelle la roche en fusion sous un volcan ?", "Le magma", ["Le granite", "Le calcaire", "Le sable"], "Quand il sort, on parle de lave."],
    ["Qui a proposé la théorie de l'évolution par la sélection naturelle ?", "Charles Darwin", ["Louis Pasteur", "Isaac Newton", "Marie Curie"], "Son ouvrage De l'origine des espèces paraît en 1859."],
    ["Quel organe fabrique l'insuline ?", "Le pancréas", ["Le foie", "Le cœur", "L'estomac"], "L'insuline fait baisser le taux de sucre dans le sang."],
    ["Le message nerveux est transmis par…", "les neurones", ["les globules rouges", "les os", "les muscles"], "Le cerveau et la moelle épinière forment le système nerveux central."],
    ["Lors de la respiration, les cellules consomment…", "du dioxygène et des nutriments", ["du dioxyde de carbone uniquement", "de la lumière", "de l'azote"], "Elles produisent de l'énergie et rejettent du CO₂."],
    ["Comment appelle-t-on la diversité des êtres vivants ?", "La biodiversité", ["La biologie", "La photosynthèse", "La génétique"], "Elle comprend la diversité des espèces, des gènes et des milieux."],
  ]);
  B("sciences", "s_svt_lycee", "SVT lycée", "ADN, enzymes, géologie, climat, corps humain", [9, 11], [
    ["Quelle est la structure de la molécule d'ADN ?", "Une double hélice", ["Un simple brin circulaire", "Une sphère", "Une chaîne de glucose"], "Watson et Crick décrivent la double hélice en 1953."],
    ["Quelle base s'associe toujours avec l'adénine (A) dans l'ADN ?", "La thymine (T)", ["La guanine (G)", "La cytosine (C)", "L'uracile (U)"], "Complémentarité : A avec T, C avec G."],
    ["Comment appelle-t-on une modification de la séquence de l'ADN ?", "Une mutation", ["Une mitose", "Une méiose", "Une fécondation"], "Une mutation peut être neutre, favorable ou défavorable."],
    ["Combien de divisions successives comporte la méiose ?", "2", ["1", "3", "4"], "La méiose produit 4 cellules à n chromosomes."],
    ["Dans quel organite a lieu la photosynthèse ?", "Le chloroplaste", ["La mitochondrie", "Le noyau", "Le ribosome"], "La mitochondrie, elle, est le siège de la respiration cellulaire."],
    ["Quel est l'âge de la Terre ?", "Environ 4,6 milliards d'années", ["Environ 6 000 ans", "Environ 65 millions d'années", "Environ 100 milliards d'années"], "Il est déterminé par radiochronologie sur des météorites."],
    ["Quel gaz, émis par les activités humaines, contribue le plus à l'effet de serre additionnel ?", "Le dioxyde de carbone (CO₂)", ["Le dioxygène", "L'azote", "L'hélium"], "Sa concentration atmosphérique a dépassé 420 ppm, contre 280 ppm avant l'ère industrielle."],
    ["Quel est le rôle d'une enzyme ?", "Catalyser (accélérer) une réaction chimique", ["Transporter l'oxygène", "Stocker l'information génétique", "Produire de la lumière"], "Chaque enzyme est spécifique de son substrat."],
    ["Quelle hormone fait augmenter la glycémie ?", "Le glucagon", ["L'insuline", "L'adrénaline seule", "La testostérone"], "Le glucagon (pancréas) s'oppose à l'insuline."],
    ["L'ARN messager est produit lors de…", "la transcription", ["la traduction", "la réplication", "la méiose"], "La traduction lit ensuite l'ARNm pour fabriquer une protéine."],
    ["Comment s'appelle une version d'un gène ?", "Un allèle", ["Un génome", "Un caryotype", "Un codon"], "Un individu possède deux allèles de chaque gène (un de chaque parent)."],
  ]);

  // =====================================================================
  //  PHYSIQUE-CHIMIE
  // =====================================================================
  B("physique", "p_college1", "Matière, électricité, lumière", "Collège : les bases", [6, 8], [
    ["Quelle est la masse d'un litre d'eau ?", "1 kg", ["100 g", "10 kg", "1 g"], "La masse volumique de l'eau est 1 kg/L, soit 1 g/cm³."],
    ["Comment branche-t-on un ampèremètre ?", "En série", ["En dérivation", "Sans fil", "En parallèle de la pile"], "L'ampèremètre mesure l'intensité qui le traverse ; le voltmètre se branche en dérivation."],
    ["Quelle est l'unité de la tension électrique ?", "Le volt (V)", ["L'ampère (A)", "Le watt (W)", "L'ohm (Ω)"], "La tension se mesure avec un voltmètre branché en dérivation."],
    ["Quelle est l'unité de l'intensité du courant ?", "L'ampère (A)", ["Le volt (V)", "Le joule (J)", "Le newton (N)"], "Dans un circuit en série, l'intensité est la même partout."],
    ["Quelle est la formule chimique de l'eau ?", "H₂O", ["CO₂", "O₂", "NaCl"], "Une molécule d'eau : 2 atomes d'hydrogène et 1 atome d'oxygène."],
    ["Quel gaz est nécessaire à une combustion ?", "Le dioxygène", ["Le diazote", "L'hélium", "Le dioxyde de carbone"], "Combustible + comburant (dioxygène) + énergie d'activation : le triangle du feu."],
    ["À quelle vitesse se propage la lumière dans le vide ?", "Environ 300 000 km/s", ["340 m/s", "300 km/h", "1 000 km/s"], "Rien ne va plus vite que la lumière."],
    ["Comment calcule-t-on une vitesse ?", "v = d ÷ t", ["v = d × t", "v = t ÷ d", "v = d + t"], "Distance parcourue divisée par la durée."],
    ["Un atome est constitué…", "d'un noyau et d'électrons", ["uniquement d'électrons", "de molécules", "de cellules"], "Le noyau, chargé positivement, est entouré d'électrons négatifs."],
    ["Quel procédé sépare un solide d'un liquide (par exemple du sable dans l'eau) ?", "La filtration", ["La dissolution", "L'évaporation de la boîte", "La combustion"], "Le filtre retient le solide ; le liquide qui passe s'appelle le filtrat."],
    ["Le son peut-il se propager dans le vide ?", "Non", ["Oui", "Seulement la nuit", "Seulement s'il est aigu"], "Le son a besoin d'un milieu matériel (air, eau, solide)."],
    ["À quelle vitesse environ le son se propage-t-il dans l'air ?", "340 m/s", ["300 000 km/s", "3 m/s", "34 km/s"], "C'est pourquoi on entend le tonnerre après avoir vu l'éclair."],
  ]);
  B("physique", "p_3e", "Énergie, forces et chimie (3e)", "Poids, loi d'Ohm, pH, ions, énergie", [8, 9], [
    ["Quelle relation lie le poids P et la masse m ?", "P = m × g", ["P = m ÷ g", "P = m + g", "P = g ÷ m"], "Sur Terre, g ≈ 9,8 N/kg."],
    ["Quelle est l'intensité de la pesanteur sur Terre ?", "Environ 9,8 N/kg", ["Environ 1,6 N/kg", "Environ 98 N/kg", "Environ 0,98 N/kg"], "Sur la Lune, elle n'est que d'environ 1,6 N/kg."],
    ["Quelle est la loi d'Ohm ?", "U = R × I", ["U = R ÷ I", "P = U × I", "E = P × t"], "La tension aux bornes d'une résistance est proportionnelle à l'intensité."],
    ["Comment calcule-t-on l'énergie cinétique ?", "E = ½ × m × v²", ["E = m × v", "E = m × g × h", "E = ½ × m × v"], "Si la vitesse double, l'énergie cinétique est multipliée par 4."],
    ["Une solution de pH 3 est…", "acide", ["neutre", "basique", "pure"], "pH < 7 : acide ; pH = 7 : neutre ; pH > 7 : basique."],
    ["Un ion positif est un atome qui a…", "perdu un ou plusieurs électrons", ["gagné des électrons", "gagné des protons", "perdu son noyau"], "Exemple : Na⁺ a perdu un électron."],
    ["Lors d'une transformation chimique, la masse totale…", "se conserve", ["augmente", "diminue", "devient nulle"], "« Rien ne se perd, rien ne se crée, tout se transforme » (Lavoisier)."],
    ["Quelle relation donne la puissance électrique ?", "P = U × I", ["P = U ÷ I", "P = R × I", "P = E × t"], "La puissance s'exprime en watts (W)."],
    ["Une année-lumière est…", "une distance", ["une durée", "une vitesse", "une énergie"], "C'est la distance parcourue par la lumière en un an, environ 9 460 milliards de km."],
    ["Quel test met en évidence le dioxyde de carbone ?", "L'eau de chaux qui se trouble", ["Le sulfate de cuivre anhydre qui bleuit", "Une allumette qui se rallume", "Une petite détonation"], "Le sulfate de cuivre anhydre teste l'eau ; la détonation, le dihydrogène."],
  ]);
  B("physique", "p_lycee", "Physique-chimie lycée", "Mole, mouvements, ondes, réactions", [9, 11], [
    ["Quelle est la valeur de la constante d'Avogadro ?", "6,02 × 10²³ mol⁻¹", ["3,00 × 10⁸ mol⁻¹", "9,81 mol⁻¹", "1,6 × 10⁻¹⁹ mol⁻¹"], "Une mole contient 6,02 × 10²³ entités."],
    ["Le numéro atomique Z indique le nombre de…", "protons", ["neutrons", "nucléons", "molécules"], "Des isotopes ont le même Z mais un nombre de neutrons différent."],
    ["Qu'énonce le principe d'inertie ?", "Si les forces se compensent, le mouvement est rectiligne uniforme ou immobile", ["Tout objet finit par s'arrêter", "La force est proportionnelle à la vitesse", "L'énergie se conserve toujours"], "C'est la première loi de Newton."],
    ["Quelle est la deuxième loi de Newton ?", "ΣF = m × a", ["ΣF = m × v", "E = m × c²", "P = m × g × h"], "La somme des forces est égale à la masse fois l'accélération."],
    ["Quelle relation lie la fréquence f et la période T ?", "f = 1 / T", ["f = T", "f = T²", "f = 2T"], "La fréquence s'exprime en hertz (Hz), la période en secondes."],
    ["Quelle est la célérité de la lumière dans le vide ?", "3,00 × 10⁸ m/s", ["340 m/s", "3,00 × 10⁵ m/s", "6,02 × 10²³ m/s"], "Soit environ 300 000 km/s."],
    ["Comment calcule-t-on une concentration en masse ?", "C = m / V", ["C = n / V", "C = V / m", "C = m × V"], "En g/L. La concentration en quantité de matière est c = n / V, en mol/L."],
    ["Un oxydant est une espèce capable de…", "capter des électrons", ["céder des électrons", "céder un proton H⁺", "capter un proton H⁺"], "Un réducteur cède des électrons."],
    ["Selon Brønsted, un acide est une espèce capable de…", "céder un proton H⁺", ["capter un proton H⁺", "capter des électrons", "céder un neutron"], "Une base capte un proton H⁺."],
    ["La demi-vie d'un noyau radioactif est…", "la durée au bout de laquelle la moitié des noyaux s'est désintégrée", ["la moitié de la durée de vie d'un noyau", "la durée d'une désintégration", "toujours égale à un an"], "Elle est caractéristique de chaque isotope."],
    ["Lors de la réfraction, la lumière…", "change de direction en changeant de milieu", ["est absorbée", "rebondit sur un miroir", "change de couleur"], "La loi de Snell-Descartes : n₁ sin i₁ = n₂ sin i₂."],
    ["Quelle est l'unité de l'énergie dans le système international ?", "Le joule (J)", ["Le watt (W)", "Le newton (N)", "Le pascal (Pa)"], "1 kWh = 3,6 × 10⁶ J."],
  ]);

  // =====================================================================
  //  EMC
  // =====================================================================
  B("emc", "emc_republique", "Vivre en République", "Symboles, institutions, droits et devoirs", [1, 9], [
    ["Quelle est la devise de la République française ?", "Liberté, Égalité, Fraternité", ["Travail, Famille, Patrie", "Paix, Amour, Joie", "Un pour tous, tous pour un"], "On la lit sur les mairies et les écoles."],
    ["Quel est l'hymne national français ?", "La Marseillaise", ["Le Chant des partisans", "L'Ode à la joie", "Frère Jacques"], "Écrite par Rouget de Lisle en 1792."],
    ["Quelles sont les couleurs du drapeau français ?", "Bleu, blanc, rouge", ["Bleu, jaune, rouge", "Vert, blanc, rouge", "Noir, rouge, or"], "Le drapeau tricolore date de la Révolution."],
    ["Quel est le jour de la fête nationale française ?", "Le 14 juillet", ["Le 11 novembre", "Le 1er mai", "Le 8 mai"], "Il rappelle la prise de la Bastille (1789) et la fête de la Fédération (1790)."],
    ["Quelle figure féminine symbolise la République ?", "Marianne", ["Jeanne d'Arc", "Athéna", "Cléopâtre"], "Son buste est présent dans toutes les mairies."],
    ["Pour combien d'années le président de la République est-il élu ?", "5 ans", ["7 ans", "4 ans", "10 ans"], "Depuis 2002, c'est le quinquennat."],
    ["À partir de quel âge peut-on voter en France ?", "18 ans", ["16 ans", "21 ans", "15 ans"], "Il faut aussi être de nationalité française et inscrit sur les listes électorales."],
    ["Qui vote les lois en France ?", "Le Parlement (Assemblée nationale et Sénat)", ["Le président seul", "Les juges", "Le maire"], "Le Parlement exerce le pouvoir législatif."],
    ["Qui dirige la commune ?", "Le maire et le conseil municipal", ["Le préfet", "Le président", "Le directeur d'école"], "Ils sont élus pour 6 ans par les habitants de la commune."],
    ["Que garantit la laïcité ?", "La liberté de croire ou de ne pas croire, et la neutralité de l'État", ["L'interdiction des religions", "Une religion officielle", "Le droit de vote à 16 ans"], "La loi de 1905 sépare les Églises et l'État."],
    ["Quel texte international protège les droits de l'enfant ?", "La Convention internationale des droits de l'enfant (1989)", ["Le Code de la route", "Le traité de Rome", "La Constitution de 1958"], "Elle reconnaît notamment le droit à l'éducation, à la santé et à être protégé."],
    ["Quel numéro appeler en cas de harcèlement à l'école ou en ligne ?", "Le 3018", ["Le 15", "Le 112", "Le 36 15"], "Le 3018 est gratuit, anonyme et confidentiel. En cas de danger immédiat, appeler le 17 ou le 112."],
    ["Qui nomme le Premier ministre ?", "Le président de la République", ["L'Assemblée nationale", "Le Sénat", "Les citoyens directement"], "Le gouvernement doit avoir la confiance de l'Assemblée nationale."],
    ["Que signifie « suffrage universel direct » ?", "Tous les citoyens votent eux-mêmes pour élire", ["Seuls les députés votent", "On vote par Internet seulement", "Le vote est obligatoire"], "Le président et les députés sont élus au suffrage universel direct."],
  ]);

  // =====================================================================
  //  ESPAGNOL
  // =====================================================================
  B("espagnol", "es_bases", "Espagnol : les bases", "Saluer, se présenter, compter, couleurs", [6, 9], [
    ["Comment dit-on « merci » en espagnol ?", "Gracias", ["Por favor", "Hola", "Adiós"], "« Por favor » = s'il te plaît."],
    ["Que signifie « ¿Cómo te llamas? » ?", "Comment t'appelles-tu ?", ["Comment vas-tu ?", "Quel âge as-tu ?", "Où habites-tu ?"], "On répond : « Me llamo… »."],
    ["Comment dit-on « J'ai 12 ans » ?", "Tengo doce años", ["Soy doce años", "Estoy doce años", "Hay doce años"], "En espagnol, on « a » son âge avec le verbe tener."],
    ["Comment dit-on « rouge » ?", "Rojo", ["Verde", "Azul", "Amarillo"], "Verde = vert, azul = bleu, amarillo = jaune."],
    ["Comment dit-on « bonjour » le matin ?", "Buenos días", ["Buenas noches", "Buenas tardes", "Hasta luego"], "Buenas tardes = bon après-midi, buenas noches = bonsoir / bonne nuit."],
    ["Que signifie « hermano » ?", "Frère", ["Père", "Cousin", "Oncle"], "Hermana = sœur, padre = père, madre = mère."],
    ["Comment dit-on « lundi » ?", "Lunes", ["Martes", "Domingo", "Sábado"], "Martes = mardi, sábado = samedi, domingo = dimanche."],
    ["Comment dit-on « il y a » ?", "Hay", ["Es", "Está", "Tiene"], "Hay un perro = il y a un chien."],
    ["Que signifie « Me gusta el chocolate » ?", "J'aime le chocolat", ["Je mange du chocolat", "Je veux du chocolat", "Je n'aime pas le chocolat"], "Gustar se construit à l'envers : « le chocolat me plaît »."],
    ["Comment dit-on « quinze » ?", "Quince", ["Cinco", "Cincuenta", "Catorce"], "Cinco = 5, catorce = 14, cincuenta = 50."],
    ["Conjugue « hablar » à la 1re personne du présent : yo…", "hablo", ["hablas", "habla", "hablamos"], "hablo, hablas, habla, hablamos, habláis, hablan."],
    ["Pour dire « Je suis fatigué », on utilise…", "Estoy cansado", ["Soy cansado", "Tengo cansado", "Hay cansado"], "Estar exprime un état passager, ser une caractéristique durable."],
    ["Quelle est la capitale de l'Espagne ?", "Madrid", ["Barcelona", "Sevilla", "Valencia"], "Madrid est au centre de la péninsule ibérique."],
  ]);
  B("espagnol", "es_avance", "Espagnol : grammaire et temps", "Ser/estar, passé, impératif, subjonctif", [7, 11], [
    ["Prétérit (pasado simple) de « hablar », yo…", "hablé", ["hablaba", "hablo", "hablaré"], "Pretérito indefinido : hablé, hablaste, habló, hablamos, hablasteis, hablaron."],
    ["Imparfait de « comer », yo…", "comía", ["comí", "como", "comeré"], "comía, comías, comía, comíamos, comíais, comían."],
    ["Futur de « vivir », nosotros…", "viviremos", ["vivimos", "vivíamos", "vivamos"], "Le futur se forme sur l'infinitif + é, ás, á, emos, éis, án."],
    ["« Madrid ___ en España. »", "está", ["es", "hay", "tiene"], "Estar sert pour la localisation."],
    ["« Mi padre ___ médico. »", "es", ["está", "hay", "tiene"], "Ser sert pour l'identité, la profession, la nationalité."],
    ["Comment traduire « Il faut travailler » ?", "Hay que trabajar", ["Tengo trabajar", "Es trabajar", "Hace trabajar"], "« Hay que » + infinitif exprime une obligation générale."],
    ["Subjonctif présent de « tener », yo…", "tenga", ["tengo", "tuve", "tendré"], "Le subjonctif se forme sur la 1re personne du présent : tengo → tenga."],
    ["« Cuando ___ mayor, seré piloto. »", "sea", ["soy", "seré", "era"], "Après « cuando » à valeur de futur, on emploie le subjonctif."],
    ["Que signifie « todavía » ?", "Encore / toujours", ["Déjà", "Jamais", "Peut-être"], "Ya = déjà, nunca = jamais, quizás = peut-être."],
    ["Impératif affirmatif de « hablar » à tú :", "habla", ["hablas", "hable", "hablad"], "Impératif tú = 3e personne du présent : habla."],
  ]);

  // =====================================================================
  //  ALLEMAND
  // =====================================================================
  B("allemand", "de_bases", "Allemand : les bases", "Saluer, se présenter, compter, articles", [6, 9], [
    ["Comment dit-on « merci » en allemand ?", "Danke", ["Bitte", "Hallo", "Tschüss"], "Bitte = s'il te plaît (et aussi « de rien »)."],
    ["Que signifie « Wie heißt du? » ?", "Comment t'appelles-tu ?", ["Comment vas-tu ?", "Où habites-tu ?", "Quel âge as-tu ?"], "On répond : « Ich heiße… »."],
    ["Comment dit-on « J'ai 12 ans » ?", "Ich bin zwölf Jahre alt", ["Ich habe zwölf Jahre", "Ich heiße zwölf", "Ich mache zwölf Jahre"], "En allemand, on « est » âgé de… avec le verbe sein."],
    ["Quel est l'article de « Hund » (chien) ?", "der", ["die", "das", "den"], "der Hund (masculin), die Katze (féminin), das Haus (neutre)."],
    ["Quel est l'article de « Katze » (chat) ?", "die", ["der", "das", "dem"], "Beaucoup de noms terminés par -e sont féminins."],
    ["Quel est l'article de « Mädchen » (fille) ?", "das", ["die", "der", "den"], "Les noms en -chen sont toujours neutres."],
    ["Comment dit-on « bleu » ?", "blau", ["rot", "grün", "gelb"], "rot = rouge, grün = vert, gelb = jaune."],
    ["Comment dit-on « bonjour » le matin ?", "Guten Morgen", ["Gute Nacht", "Guten Abend", "Auf Wiedersehen"], "Guten Abend = bonsoir, Gute Nacht = bonne nuit."],
    ["Que signifie « Schwester » ?", "Sœur", ["Frère", "Mère", "Grand-mère"], "Bruder = frère, Mutter = mère, Vater = père."],
    ["Comment dit-on « vingt » ?", "zwanzig", ["zwölf", "zwei", "zehn"], "zwei = 2, zehn = 10, zwölf = 12."],
    ["Conjugue « sein » : ich…", "bin", ["bist", "ist", "sind"], "ich bin, du bist, er ist, wir sind, ihr seid, sie sind."],
    ["Conjugue « haben » : du…", "hast", ["habe", "hat", "haben"], "ich habe, du hast, er hat, wir haben, ihr habt, sie haben."],
    ["Quelle est la capitale de l'Allemagne ?", "Berlin", ["München", "Hamburg", "Wien"], "Wien (Vienne) est la capitale de l'Autriche."],
  ]);
  B("allemand", "de_avance", "Allemand : grammaire", "Place du verbe, cas, parfait, modaux", [7, 11], [
    ["Dans une phrase déclarative, le verbe conjugué est en…", "2e position", ["1re position", "dernière position", "n'importe quelle position"], "Heute gehe ich ins Kino : le verbe reste en 2e position."],
    ["Dans une subordonnée (avec weil, dass…), le verbe conjugué est…", "à la fin", ["en 2e position", "en 1re position", "supprimé"], "Ich bleibe zu Hause, weil ich krank bin."],
    ["Parfait de « spielen » : ich habe…", "gespielt", ["gespielen", "spielte", "gespielte"], "Verbe faible : ge- + radical + -t."],
    ["Parfait de « gehen » : ich…", "bin gegangen", ["habe gegangen", "bin gegeht", "habe gegeht"], "Les verbes de déplacement forment leur parfait avec sein."],
    ["Quel cas suit la préposition « mit » ?", "Le datif", ["L'accusatif", "Le nominatif", "Le génitif"], "mit, nach, bei, seit, von, zu, aus + datif."],
    ["Accusatif masculin de « der » :", "den", ["dem", "des", "die"], "Ich sehe den Hund."],
    ["Avec un verbe de modalité, l'infinitif se place…", "à la fin de la phrase", ["juste après le sujet", "en 1re position", "avant le modal"], "Ich kann heute nicht kommen."],
    ["Que signifie « müssen » ?", "Devoir (obligation)", ["Pouvoir", "Vouloir", "Aimer"], "können = pouvoir, wollen = vouloir, mögen = aimer."],
    ["Prétérit de « sein » : ich…", "war", ["bin", "wurde", "gewesen"], "ich war, du warst, er war, wir waren."],
    ["Comment se traduit « parce que » (subordonnant) ?", "weil", ["denn", "aber", "oder"], "« denn » veut aussi dire « car » mais ne rejette pas le verbe à la fin."],
  ]);

  // =====================================================================
  //  SES
  // =====================================================================
  B("ses", "ses_bases", "Sciences économiques et sociales", "Marché, PIB, monnaie, socialisation", [9, 11], [
    ["Que mesure le PIB ?", "La richesse produite dans un pays en un an", ["La richesse totale des habitants", "Le bien-être de la population", "Les exportations"], "Le produit intérieur brut additionne les valeurs ajoutées."],
    ["Qu'est-ce que l'inflation ?", "La hausse générale et durable des prix", ["La baisse des prix", "La hausse du chômage", "La hausse des salaires seulement"], "Elle réduit le pouvoir d'achat de la monnaie."],
    ["Selon le BIT, un chômeur est une personne…", "sans emploi, disponible et qui en recherche activement un", ["qui ne travaille pas", "qui touche des allocations", "à la retraite"], "Les trois critères doivent être réunis."],
    ["Sur un marché concurrentiel, que se passe-t-il si l'offre dépasse la demande ?", "Le prix baisse", ["Le prix monte", "Le prix ne change pas", "Le marché disparaît"], "Le prix tend vers l'équilibre où offre et demande se rencontrent."],
    ["Quelles sont les trois fonctions de la monnaie ?", "Unité de compte, intermédiaire des échanges, réserve de valeur", ["Produire, consommer, épargner", "Prêter, emprunter, rembourser", "Taxer, dépenser, investir"], "Elle permet de mesurer, d'échanger et de conserver la valeur."],
    ["Qui fixe les taux directeurs dans la zone euro ?", "La Banque centrale européenne (BCE)", ["Le gouvernement français", "Le FMI", "La Commission européenne"], "La BCE vise une inflation proche de 2 %."],
    ["Qu'est-ce que la socialisation primaire ?", "L'apprentissage des normes et valeurs pendant l'enfance", ["La recherche d'un emploi", "L'adhésion à un parti", "Les études supérieures"], "Elle passe surtout par la famille et l'école."],
    ["La pollution d'une usine qui gêne ses voisins est…", "une externalité négative", ["un bien public", "une subvention", "un monopole"], "Le coût subi par les tiers n'est pas payé par le pollueur."],
    ["Qu'est-ce que la mobilité sociale ?", "Le changement de position sociale entre générations ou au cours d'une vie", ["Le fait de déménager", "Le télétravail", "La mobilité géographique"], "On la mesure avec des tables de mobilité."],
    ["Quel sociologue a étudié l'intégration et le suicide ?", "Émile Durkheim", ["Max Weber", "Karl Marx", "Adam Smith"], "Le Suicide (1897) montre l'influence des facteurs sociaux."],
    ["La productivité du travail, c'est…", "la production par travailleur ou par heure", ["le nombre de travailleurs", "le salaire moyen", "le temps de travail"], "Ses gains sont une source majeure de croissance."],
  ]);

  // =====================================================================
  //  PHILOSOPHIE
  // =====================================================================
  B("philo", "ph_auteurs", "Auteurs et notions", "Qui a dit quoi ?", [11, 11], [
    ["Quel philosophe a écrit « Je pense, donc je suis » ?", "Descartes", ["Pascal", "Kant", "Sartre"], "Le cogito est la première certitude du Discours de la méthode (1637)."],
    ["L'allégorie de la caverne est de…", "Platon", ["Aristote", "Épicure", "Descartes"], "Dans La République, elle illustre le passage de l'opinion à la connaissance."],
    ["Pour Aristote, l'homme est…", "un animal politique", ["un roseau pensant", "un loup pour l'homme", "condamné à être libre"], "Il ne peut s'accomplir que dans la cité."],
    ["Qui a écrit « L'homme est un roseau, le plus faible de la nature, mais c'est un roseau pensant » ?", "Pascal", ["Montaigne", "Rousseau", "Spinoza"], "Les Pensées : la grandeur de l'homme est dans la pensée."],
    ["« L'existence précède l'essence » est une thèse de…", "Sartre", ["Platon", "Kant", "Hegel"], "L'homme n'est rien d'autre que ce qu'il se fait : il est responsable de ses choix."],
    ["Quel philosophe décrit l'état de nature comme une « guerre de chacun contre chacun » ?", "Hobbes", ["Rousseau", "Locke", "Aristote"], "Dans le Léviathan, l'État naît pour garantir la sécurité."],
    ["Qui a écrit Du contrat social ?", "Rousseau", ["Hobbes", "Montesquieu", "Voltaire"], "La souveraineté appartient au peuple, expression de la volonté générale."],
    ["L'impératif catégorique est une notion de…", "Kant", ["Nietzsche", "Hume", "Épicure"], "« Agis uniquement d'après la maxime qui fait que tu peux vouloir en même temps qu'elle devienne une loi universelle. »"],
    ["Qui a développé la notion d'inconscient psychique ?", "Freud", ["Descartes", "Bergson", "Marx"], "Une partie de notre vie psychique échappe à la conscience."],
    ["Pour Épicure, le bonheur consiste dans…", "l'absence de troubles du corps et de l'âme (ataraxie)", ["la recherche de tous les plaisirs", "la richesse", "la gloire"], "Il faut distinguer désirs naturels et nécessaires des désirs vains."],
    ["Selon Spinoza, « le désir est… »", "l'essence même de l'homme", ["un manque à combler", "une illusion", "une faute morale"], "Éthique, livre III."],
    ["Quel philosophe explique que la causalité vient de l'habitude ?", "Hume", ["Kant", "Descartes", "Platon"], "Nous voyons des successions répétées et en concluons une liaison nécessaire."],
    ["Pour Marx, dans le travail salarié capitaliste, le travailleur est…", "aliéné", ["pleinement libre", "inutile", "propriétaire des moyens de production"], "Il est dépossédé du produit de son travail."],
    ["Quelle est la différence entre « persuader » et « convaincre » ?", "Persuader joue sur les émotions, convaincre sur la raison", ["Ce sont des synonymes", "Convaincre utilise la force", "Persuader est toujours honnête"], "Distinction classique utile en dissertation."],
    ["Ce qui est « contingent » est…", "ce qui aurait pu ne pas être", ["ce qui ne peut pas ne pas être", "ce qui est impossible", "ce qui est universel"], "Le contraire de contingent est nécessaire."],
    ["« En droit » s'oppose à…", "« en fait »", ["« en théorie »", "« en principe »", "« en raison »"], "En droit = ce qui doit être ou est légitime ; en fait = ce qui est."],
    ["Dans une dissertation, la problématique sert à…", "montrer la difficulté du sujet et la question à résoudre", ["résumer le cours", "donner sa réponse sans justifier", "citer le plus d'auteurs possible"], "Elle fait apparaître une tension entre des réponses possibles."],
  ]);

  window.BANQUES = BANQUES;
})();
