/* Aide aux Devoirs — mémo de grammaire, d'orthographe et de conjugaison (fiches de référence).
   n : classe à partir de laquelle la fiche est utile (3 CP … 8 6e … 12 2nde). */
(function () {
  "use strict";
  window.GRAMMAIRE = [
    { id: "classes", titre: "Les classes de mots (la nature)", n: 4, theme: "Grammaire", corps: [
      "<b>Le nom</b> désigne une personne, un animal, une chose ou une idée : <i>chat, Paris, liberté</i>. On peut mettre un déterminant devant.",
      "<b>Le déterminant</b> se place devant le nom : articles (<i>le, la, les, un, une, des</i>), possessifs (<i>mon, ton, son…</i>), démonstratifs (<i>ce, cet, cette, ces</i>).",
      "<b>L'adjectif</b> précise le nom et s'accorde avec lui : <i>une grande maison</i>.",
      "<b>Le verbe</b> exprime une action ou un état ; il se conjugue : <i>il court, elle est</i>.",
      "<b>Le pronom</b> remplace un nom : <i>il, elle, nous, le, lui, celui-ci, qui…</i>",
      "<b>L'adverbe</b> est invariable ; il modifie un verbe, un adjectif ou un autre adverbe : <i>vite, très, hier</i>.",
      "<b>La préposition</b> introduit un complément : <i>à, de, dans, par, pour, sur, avec, sans</i>.",
      "<b>La conjonction de coordination</b> relie deux éléments de même fonction : <i>mais, ou, et, donc, or, ni, car</i>.",
      "<b>La conjonction de subordination</b> introduit une proposition subordonnée : <i>que, quand, comme, si, parce que, lorsque</i>."] },
    { id: "fonctions", titre: "Les fonctions dans la phrase", n: 5, theme: "Grammaire", corps: [
      "<b>Le sujet</b> fait l'action ou est ce dont on parle. On le trouve en posant la question <i>Qui est-ce qui… ?</i> : <i><u>Le chien</u> aboie.</i>",
      "<b>Le complément d'objet direct (COD)</b> complète le verbe sans préposition : <i>Je mange <u>une pomme</u>.</i> (je mange quoi ?)",
      "<b>Le complément d'objet indirect (COI)</b> complète le verbe avec une préposition : <i>Je parle <u>à mon ami</u>.</i>",
      "<b>L'attribut du sujet</b> suit un verbe d'état (<i>être, paraître, sembler, devenir, rester, demeurer, avoir l'air</i>) et donne une qualité au sujet : <i>Elle est <u>contente</u>.</i>",
      "<b>Le complément circonstanciel</b> donne une précision de lieu, de temps, de manière, de cause… On peut souvent le déplacer ou le supprimer : <i><u>Ce matin</u>, nous partons <u>en train</u>.</i>",
      "<b>L'épithète</b> est un adjectif placé à côté du nom : <i>un <u>petit</u> chat</i>. <b>Le complément du nom</b> le précise avec une préposition : <i>la robe <u>de Léa</u></i>."] },
    { id: "accords", titre: "Les accords essentiels", n: 4, theme: "Orthographe", corps: [
      "<b>Dans le groupe nominal</b>, le déterminant et l'adjectif s'accordent en genre et en nombre avec le nom : <i>des petites filles</i>.",
      "<b>Le verbe s'accorde avec son sujet</b>, même si le sujet est loin ou placé après : <i>Les enfants de la classe <u>jouent</u>.</i>",
      "<b>Plusieurs sujets</b> = verbe au pluriel : <i>Paul et Léa <u>chantent</u>.</i>",
      "<b>Participe passé avec être</b> : il s'accorde avec le sujet : <i>Elles sont <u>parties</u>.</i>",
      "<b>Participe passé avec avoir</b> : pas d'accord avec le sujet. Il s'accorde avec le COD seulement si celui-ci est placé <u>avant</u> le verbe : <i>Les fleurs que j'ai <u>cueillies</u>.</i>",
      "<b>L'attribut</b> s'accorde avec le sujet : <i>Ces histoires sont <u>drôles</u>.</i>"] },
    { id: "homophones", titre: "Les homophones grammaticaux", n: 4, theme: "Orthographe", corps: [
      "<b>a / à</b> : <i>a</i> = verbe avoir (on peut dire « avait ») ; <i>à</i> = préposition.",
      "<b>et / est</b> : <i>est</i> = verbe être (« était ») ; <i>et</i> = « et puis ».",
      "<b>son / sont</b> : <i>sont</i> = verbe être (« étaient ») ; <i>son</i> = « mon ».",
      "<b>on / ont</b> : <i>ont</i> = verbe avoir (« avaient ») ; <i>on</i> = « il ».",
      "<b>ou / où</b> : <i>ou</i> = « ou bien » ; <i>où</i> = le lieu ou le moment.",
      "<b>ces / ses / c'est / s'est</b> : <i>ces</i> = « ceux-là » ; <i>ses</i> = « les siens » ; <i>c'est</i> = « cela est » ; <i>s'est</i> = devant un participe passé d'un verbe pronominal (<i>il s'est lavé</i>).",
      "<b>ce / se</b> : <i>ce</i> devant un nom (« ce livre ») ou « cela » ; <i>se</i> devant un verbe pronominal (« se laver »).",
      "<b>leur / leurs</b> : devant un verbe, <i>leur</i> est un pronom invariable (<i>je leur parle</i>) ; devant un nom pluriel, <i>leurs</i> prend un s.",
      "<b>la / là / l'a</b> : <i>là</i> = lieu ; <i>l'a</i> = « l'avait » ; <i>la</i> = déterminant ou pronom.",
      "<b>peu / peut / peux</b> : <i>peu</i> = « pas beaucoup » ; <i>peut / peux</i> = verbe pouvoir (« pouvait »).",
      "<b>quel(le) / qu'elle</b> : <i>qu'elle</i> = « qu'il » au féminin ; sinon <i>quel</i> s'accorde avec le nom.",
      "<b>ni / n'y</b> : <i>n'y</i> = « ne… y » (<i>je n'y vais pas</i>) ; <i>ni</i> = « et pas »."] },
    { id: "terminaisons", titre: "-é, -er, -ez, -ait ?", n: 5, theme: "Orthographe", corps: [
      "Remplace le verbe par un verbe du 3e groupe comme <i>prendre</i> ou <i>vendre</i>.",
      "Si on peut dire <b>prendre</b> → infinitif en <b>-er</b> : <i>Il va (manger / prendre).</i>",
      "Si on peut dire <b>pris</b> → participe passé en <b>-é</b> : <i>Il a (mangé / pris).</i>",
      "Avec <b>vous</b> → <b>-ez</b> : <i>vous mangez</i>.",
      "Si on peut dire <b>prenait</b> → imparfait en <b>-ait</b> : <i>Il (mangeait / prenait).</i>"] },
    { id: "pluriel", titre: "Le pluriel des noms et des adjectifs", n: 4, theme: "Orthographe", corps: [
      "En général on ajoute <b>-s</b> : <i>un chat → des chats</i>.",
      "Les mots en <b>-s, -x, -z</b> ne changent pas : <i>une souris → des souris</i>.",
      "<b>-au, -eau, -eu</b> → <b>-x</b> : <i>des bateaux, des jeux</i> (sauf landaus, pneus, bleus).",
      "<b>-al</b> → <b>-aux</b> : <i>des chevaux</i> (sauf bals, carnavals, festivals, récitals, chacals, régals).",
      "<b>-ou</b> → <b>-ous</b>, sauf les 7 en <b>-oux</b> : bijou, caillou, chou, genou, hibou, joujou, pou.",
      "<b>-ail</b> → <b>-ails</b>, sauf bail, corail, émail, soupirail, travail, vantail, vitrail → <b>-aux</b>."] },
    { id: "temps", titre: "Les temps de l'indicatif et leurs valeurs", n: 6, theme: "Conjugaison", corps: [
      "<b>Présent</b> : ce qui se passe maintenant, une vérité générale, une habitude.",
      "<b>Imparfait</b> : une action passée qui dure ou se répète ; le décor d'un récit.",
      "<b>Passé simple</b> : une action passée, brève et achevée, dans un récit (premier plan).",
      "<b>Passé composé</b> : une action passée et terminée, souvent dans un dialogue ou un récit au présent.",
      "<b>Plus-que-parfait</b> : une action antérieure à une autre action passée.",
      "<b>Futur simple</b> : une action à venir. <b>Futur antérieur</b> : une action future terminée avant une autre.",
      "<b>Conditionnel</b> : une action soumise à une condition, une demande polie, le futur dans le passé.",
      "<b>Subjonctif</b> (mode) : le souhait, l'ordre, le doute, après <i>il faut que, bien que, pour que</i>."] },
    { id: "groupes", titre: "Les trois groupes de verbes", n: 4, theme: "Conjugaison", corps: [
      "<b>1er groupe</b> : infinitif en <b>-er</b> (sauf <i>aller</i>) : <i>chanter, jouer</i>.",
      "<b>2e groupe</b> : infinitif en <b>-ir</b> avec <b>-issons</b> au présent : <i>finir → nous finissons</i>.",
      "<b>3e groupe</b> : tous les autres : <i>aller, prendre, venir, voir, faire, partir…</i>",
      "<b>Être</b> et <b>avoir</b> sont des auxiliaires : ils servent à former les temps composés."] },
    { id: "phrase", titre: "La phrase : types, formes, propositions", n: 6, theme: "Grammaire", corps: [
      "<b>Quatre types</b> : déclarative (.), interrogative (?), injonctive ou impérative (! ou .), exclamative (!).",
      "<b>Formes</b> : affirmative ou négative (<i>ne… pas, ne… jamais, ne… plus</i>), active ou passive.",
      "<b>Phrase simple</b> : un seul verbe conjugué. <b>Phrase complexe</b> : plusieurs propositions.",
      "<b>Juxtaposées</b> : reliées par une ponctuation (, ; :). <b>Coordonnées</b> : reliées par <i>mais, ou, et, donc, or, ni, car</i>.",
      "<b>Subordonnée</b> : dépend d'une principale ; relative (<i>qui, que, dont, où</i>), complétive (<i>que</i>), circonstancielle (<i>quand, parce que, si…</i>)."] },
    { id: "ponctuation", titre: "La ponctuation", n: 4, theme: "Grammaire", corps: [
      "<b>Le point</b> termine une phrase. <b>La virgule</b> sépare des éléments d'une énumération ou isole un complément.",
      "<b>Le point-virgule</b> sépare deux propositions liées par le sens. <b>Les deux-points</b> annoncent une explication, une énumération ou une parole.",
      "<b>Les guillemets</b> « » encadrent des paroles rapportées ; <b>le tiret</b> marque le changement d'interlocuteur dans un dialogue.",
      "En français, on met une espace avant <b>; : ! ?</b> et à l'intérieur des guillemets « ainsi »."] },
    { id: "discours", titre: "Discours direct et indirect", n: 8, theme: "Grammaire", corps: [
      "<b>Discours direct</b> : on rapporte les paroles telles quelles, avec guillemets : <i>Il dit : « Je viendrai demain. »</i>",
      "<b>Discours indirect</b> : les paroles sont intégrées dans une subordonnée, sans guillemets ; pronoms, temps et indicateurs changent : <i>Il dit qu'il viendrait le lendemain.</i>",
      "Concordance des temps au passé : présent → imparfait, futur → conditionnel, passé composé → plus-que-parfait."] },
    { id: "figures", titre: "Les figures de style", n: 9, theme: "Littérature", corps: [
      "<b>Comparaison</b> : rapproche deux éléments avec un outil (<i>comme, tel, pareil à</i>) : <i>blanc comme neige</i>.",
      "<b>Métaphore</b> : comparaison sans outil : <i>Cette femme est une rose.</i>",
      "<b>Personnification</b> : donne des traits humains à une chose ou un animal : <i>Le vent hurle.</i>",
      "<b>Hyperbole</b> : exagération : <i>Je meurs de faim.</i> <b>Litote</b> : dire moins pour suggérer plus : <i>Va, je ne te hais point.</i>",
      "<b>Anaphore</b> : répétition d'un mot en début de vers ou de phrase. <b>Antithèse</b> : opposition de deux idées.",
      "<b>Oxymore</b> : deux mots contraires réunis : <i>une obscure clarté</i>. <b>Allitération</b> : répétition d'un son consonne ; <b>assonance</b> : d'un son voyelle."] },
    { id: "versification", titre: "La versification", n: 9, theme: "Littérature", corps: [
      "Un <b>vers</b> se mesure en syllabes : octosyllabe (8), décasyllabe (10), alexandrin (12).",
      "Le <b>e muet</b> se prononce devant une consonne et s'élide devant une voyelle ou en fin de vers.",
      "<b>Rimes</b> plates (AABB), croisées (ABAB), embrassées (ABBA).",
      "Une <b>strophe</b> : quatrain (4 vers), tercet (3), distique (2). Le <b>sonnet</b> : deux quatrains et deux tercets."] },
  ];
})();
