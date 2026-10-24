/* Aide aux Devoirs — banque d'exercices hors ligne (CP → Terminale)
   Chaque exercice : { id, matiere, titre, desc, niveaux:[min,max], gen(niveau) → question }
   Une question : { q, kind:'num'|'text'|'qcm', options?, answer, check(rep) → bool, expl } */
(function () {
  "use strict";

  const NIVEAUX = ["PS", "MS", "GS", "CP", "CE1", "CE2", "CM1", "CM2", "6e", "5e", "4e", "3e", "2nde", "1re", "Tle"];
  const CYCLES = n => n <= 2 ? "Maternelle" : n <= 5 ? "Cycle 2" : n <= 8 ? "Cycle 3" : n <= 11 ? "Cycle 4" : "Lycée";

  // ---------- outils ----------
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const nz = (a, b) => { let x; do { x = rnd(a, b); } while (x === 0); return x; };
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const round = (x, d = 10) => Math.round(x * 10 ** d) / 10 ** d;
  const fmt = x => String(round(x, 8)).replace(".", ",").replace("-", "−");
  const frac = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); n /= g; d /= g; return d === 1 ? String(n).replace("-", "−") : (n < 0 ? "−" : "") + Math.abs(n) + "/" + d; };
  const texFrac = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); n /= g; d /= g; return d === 1 ? String(n) : (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
  const sgn = x => x < 0 ? "(" + fmt(x) + ")" : fmt(x);

  function parseNum(s) {
    if (s == null) return NaN;
    s = String(s).trim().replace(/[−–]/g, "-").replace(/\s+/g, "").replace(/,/g, ".");
    if (!s) return NaN;
    const m = s.match(/^(-?\d*\.?\d+)\/(-?\d*\.?\d+)$/);
    if (m) return parseFloat(m[1]) / parseFloat(m[2]);
    if (!/^-?\d*\.?\d+$/.test(s)) return NaN;
    return parseFloat(s);
  }
  const norm = s => String(s || "").toLowerCase().replace(/[’`´]/g, "'").replace(/\s+/g, " ").replace(/\s*'\s*/g, "'").trim();

  function numQ(q, value, expl, tol, shown) {
    return {
      q, kind: "num", answer: shown || fmt(value), expl,
      check: r => { const x = parseNum(r); if (isNaN(x)) return false; const t = tol != null ? tol : 1e-6 * Math.max(1, Math.abs(value)); return Math.abs(x - value) <= t; }
    };
  }
  function qcm(q, options, answer, expl) {
    return { q, kind: "qcm", options: shuffle(options), answer, expl, check: r => r === answer };
  }
  function textQ(q, answers, expl, shown) {
    const acc = (Array.isArray(answers) ? answers : [answers]).map(norm);
    return { q, kind: "text", answer: shown || (Array.isArray(answers) ? answers[0] : answers), expl, check: r => acc.includes(norm(r)) };
  }

  // =====================================================================
  //  MATHÉMATIQUES
  // =====================================================================
  const EX = [];
  const add = e => EX.push(e);

  add({ id: "addition", matiere: "maths", titre: "Additions", desc: "Calcul mental puis nombres plus grands", niveaux: [0, 3],
    gen(n) {
      const max = [10, 100, 1000, 10000][n];
      let a, b;
      if (n === 0) { a = rnd(1, 10); b = rnd(0, 10); }
      else { a = rnd(Math.floor(max / 10), max - 1); b = rnd(1, max - a); }
      const expl = n === 0 ? `Tu peux partir de ${Math.max(a, b)} et avancer de ${Math.min(a, b)} sur tes doigts.`
        : `Additionne d'abord les unités, puis les dizaines${n >= 2 ? ", puis les centaines" : ""}, sans oublier les retenues.`;
      return numQ(`$${a} + ${b} = \\;?$`, a + b, expl);
    } });

  add({ id: "soustraction", matiere: "maths", titre: "Soustractions", desc: "Enlever, chercher l'écart", niveaux: [0, 3],
    gen(n) {
      const max = [10, 100, 1000, 10000][n];
      const a = rnd(n === 0 ? 3 : max / 10, max), b = rnd(1, a);
      return numQ(`$${a} - ${b} = \\;?$`, a - b, `Vérifie avec une addition : $${a - b} + ${b} = ${a}$.`);
    } });

  add({ id: "complements", matiere: "maths", titre: "Compléments", desc: "Combien pour aller à 10, 100…", niveaux: [0, 2],
    gen(n) {
      const cible = [10, 100, 1000][n];
      const a = n === 0 ? rnd(1, 9) : n === 1 ? rnd(1, 19) * 5 : rnd(1, 19) * 50;
      return numQ(`Combien faut-il ajouter à <b>${a}</b> pour faire <b>${cible}</b> ?`, cible - a, `$${a} + ${cible - a} = ${cible}$.`);
    } });

  add({ id: "comparer", matiere: "maths", titre: "Comparer des nombres", desc: "Plus grand, plus petit ou égal", niveaux: [0, 5],
    gen(n) {
      let a, b, A, B;
      if (n <= 3) { const max = [100, 1000, 10000, 1000000][n]; a = rnd(0, max); b = Math.random() < .15 ? a : rnd(Math.max(0, a - max / 10), Math.min(max, a + max / 10)); A = a.toLocaleString("fr-FR"); B = b.toLocaleString("fr-FR"); }
      else { a = round(rnd(1, 999) / pick([10, 100]), 2); b = Math.random() < .1 ? a : round(a + pick([-1, 1]) * rnd(1, 90) / pick([100, 10]), 2); if (b < 0) b = -b; A = fmt(a); B = fmt(b); }
      const ans = a < b ? "<" : a > b ? ">" : "=";
      return qcm(`Complète : <span class="big">${A} &nbsp;?&nbsp; ${B}</span>`, ["<", ">", "="], ans,
        n >= 4 ? "Compare d'abord les parties entières, puis les dixièmes, puis les centièmes." : "Compare d'abord le nombre de chiffres, puis les chiffres un par un en partant de la gauche.");
    } });

  add({ id: "doubles", matiere: "maths", titre: "Doubles et moitiés", desc: "Calcul mental", niveaux: [1, 3],
    gen(n) {
      const max = [0, 50, 100, 500][n];
      if (Math.random() < .5) { const a = rnd(2, max); return numQ(`Quel est le double de <b>${a}</b> ?`, 2 * a, `Le double, c'est $${a} + ${a}$.`); }
      const a = rnd(1, max) * 2; return numQ(`Quelle est la moitié de <b>${a}</b> ?`, a / 2, `La moitié de ${a}, c'est le nombre qui, ajouté à lui-même, donne ${a}.`);
    } });

  add({ id: "tables", matiere: "maths", titre: "Tables de multiplication", desc: "Les connaître par cœur", niveaux: [1, 6],
    gen(n) {
      const t = n === 1 ? rnd(2, 5) : rnd(2, 10), k = rnd(1, 10);
      if (n >= 3 && Math.random() < .3) return numQ(`$${t} \\times \\;?\\; = ${t * k}$`, k, `Dans la table de ${t} : $${t} \\times ${k} = ${t * k}$.`);
      const [a, b] = Math.random() < .5 ? [t, k] : [k, t];
      return numQ(`$${a} \\times ${b} = \\;?$`, a * b, `$${a} \\times ${b}$, c'est ${a} fois ${b} : ${Array(Math.min(a, 10)).fill(b).join(" + ")} = ${a * b}.`);
    } });

  add({ id: "multiplication", matiere: "maths", titre: "Multiplications", desc: "Posées ou en ligne", niveaux: [2, 5],
    gen(n) {
      const a = n === 2 ? rnd(12, 99) : rnd(23, 999), b = n === 2 ? rnd(2, 9) : rnd(11, 99);
      return numQ(`$${a} \\times ${b} = \\;?$`, a * b, `Décompose : $${a} \\times ${b} = ${a} \\times ${Math.floor(b / 10) * 10 || b}${b >= 10 && b % 10 ? ` + ${a} \\times ${b % 10}` : ""}$.`);
    } });

  add({ id: "division", matiere: "maths", titre: "Divisions", desc: "Quotient et reste", niveaux: [3, 5],
    gen(n) {
      const d = n === 3 ? rnd(2, 9) : rnd(3, 25), qu = rnd(5, n === 3 ? 30 : 99), r = rnd(0, d - 1), a = d * qu + r;
      if (Math.random() < .55) return numQ(`Dans la division de <b>${a}</b> par <b>${d}</b>, quel est le <b>quotient</b> ?`, qu, `$${a} = ${d} \\times ${qu} + ${r}$, avec ${r} plus petit que ${d}.`);
      return numQ(`Dans la division de <b>${a}</b> par <b>${d}</b>, quel est le <b>reste</b> ?`, r, `$${a} = ${d} \\times ${qu} + ${r}$ : le reste est ${r}.`);
    } });

  add({ id: "decimaux", matiere: "maths", titre: "Nombres décimaux", desc: "Additionner, multiplier, ×10 ×100", niveaux: [3, 6],
    gen(n) {
      const t = n === 3 ? rnd(0, 1) : rnd(0, 2);
      if (t === 0) { const p = pick([10, 100, 1000]), a = round(rnd(1, 9999) / pick([10, 100]), 2), div = Math.random() < .4;
        return numQ(`$${fmt(a).replace(",", "{,}")} ${div ? "\\div" : "\\times"} ${p} = \\;?$`, div ? a / p : a * p, `${div ? "Diviser" : "Multiplier"} par ${p} : chaque chiffre se décale de ${String(p).length - 1} rang${p > 10 ? "s" : ""} vers la ${div ? "droite" : "gauche"}.`); }
      if (t === 1) { const a = round(rnd(10, 9999) / 100, 2), b = round(rnd(10, 999) / 10, 1), s = Math.random() < .5 && a > b;
        return numQ(`$${fmt(a).replace(",", "{,}")} ${s ? "-" : "+"} ${fmt(b).replace(",", "{,}")} = \\;?$`, s ? a - b : a + b, "Aligne bien les virgules, et complète avec des zéros si besoin.", 1e-6); }
      const a = round(rnd(11, 99) / 10, 1), b = rnd(2, 15);
      return numQ(`$${fmt(a).replace(",", "{,}")} \\times ${b} = \\;?$`, a * b, `Calcule $${a * 10} \\times ${b} = ${a * 10 * b}$, puis place la virgule : un chiffre après la virgule.`, 1e-6);
    } });

  add({ id: "fractions", matiere: "maths", titre: "Fractions", desc: "Partager, comparer, calculer", niveaux: [3, 9],
    gen(n) {
      if (n <= 4) { const d = pick([2, 3, 4, 5, 10]), k = rnd(1, d - 1), m = d * rnd(2, 12);
        return numQ(`Combien font $${texFrac(k, d).replace(/\\frac\{(\d+)\}\{(\d+)\}/, "\\frac{$1}{$2}")}$ de <b>${m}</b> ?`, m / d * k, `On partage ${m} en ${d} parts égales (${m / d} chacune) et on en prend ${k} : $${m / d} \\times ${k} = ${m / d * k}$.`); }
      if (n === 5) { const d = rnd(3, 12), a = rnd(1, d), b = rnd(1, d);
        return numQ(`$\\frac{${a}}{${d}} + \\frac{${b}}{${d}} = \\;?$ <small>(réponds sous la forme a/b)</small>`, (a + b) / d, `Même dénominateur : on additionne les numérateurs. $\\frac{${a}+${b}}{${d}} = \\frac{${a + b}}{${d}}$.`, 1e-6, frac(a + b, d)); }
      const d1 = rnd(2, 9), d2 = rnd(2, 9), a = nz(-9, 9), b = nz(-9, 9);
      if (n === 6 || Math.random() < .5) { const plus = Math.random() < .5, s = plus ? 1 : -1, bb = Math.abs(b), den = d1 * d2;
        return numQ(`$${texFrac(a, d1)} ${plus ? "+" : "-"} ${texFrac(bb, d2)} = \\;?$ <small>(forme a/b)</small>`, a / d1 + s * bb / d2,
          `Mets au même dénominateur (${den}), puis ${plus ? "additionne" : "soustrais"} les numérateurs et simplifie.`, 1e-6, frac(a * d2 + s * bb * d1, den)); }
      const mult = Math.random() < .5;
      const v = mult ? (a / d1) * (b / d2) : (a / d1) / (b / d2);
      return numQ(`$${texFrac(a, d1)} ${mult ? "\\times" : "\\div"} ${b < 0 ? "\\left(" + texFrac(b, d2) + "\\right)" : texFrac(b, d2)} = \\;?$ <small>(forme a/b)</small>`, v,
        mult ? "On multiplie les numérateurs entre eux et les dénominateurs entre eux, puis on simplifie." : "Diviser par une fraction, c'est multiplier par son inverse.", 1e-6,
        mult ? frac(a * b, d1 * d2) : frac(a * d2, d1 * b));
    } });

  const UNITES = [
    ["m", "cm", 100], ["km", "m", 1000], ["m", "mm", 1000], ["cm", "mm", 10], ["kg", "g", 1000], ["L", "cL", 100], ["L", "mL", 1000], ["h", "min", 60], ["min", "s", 60], ["t", "kg", 1000]
  ];
  add({ id: "conversions", matiere: "maths", titre: "Conversions", desc: "Longueurs, masses, contenances, durées", niveaux: [1, 6],
    gen(n) {
      const [u1, u2, f] = pick(n <= 2 ? UNITES.slice(0, 5).concat([UNITES[7]]) : UNITES);
      if (Math.random() < .5 || n <= 2) { const v = n <= 3 ? rnd(1, 20) : round(rnd(5, 250) / 10, 1);
        return numQ(`$${fmt(v).replace(",", "{,}")}\\text{ ${u1}} = \\;?\\text{ ${u2}}$`, v * f, `1 ${u1} = ${f} ${u2}, donc on multiplie par ${f}.`); }
      const v = rnd(1, 50) * f / pick([1, 2, 4, 10].filter(k => f % k === 0));
      return numQ(`$${fmt(v).replace(",", "{,}")}\\text{ ${u2}} = \\;?\\text{ ${u1}}$`, v / f, `1 ${u1} = ${f} ${u2}, donc on divise par ${f}.`);
    } });

  add({ id: "proportionnalite", matiere: "maths", titre: "Proportionnalité", desc: "Recettes, prix, échelles", niveaux: [3, 7],
    gen(n) {
      const ctx = pick([
        ["paquets de gâteaux", "€", 1.5], ["kg de pommes", "€", 2.4], ["litres d'essence", "€", 1.8], ["cahiers", "€", 2.5], ["tickets de bus", "€", 1.9]
      ]);
      const p = ctx[2] * (n >= 6 ? rnd(1, 3) : 1), a = rnd(2, 6), b = rnd(7, 15);
      return numQ(`${a} ${ctx[0]} coûtent <b>${fmt(round(a * p, 2))} ${ctx[1]}</b>. Combien coûtent <b>${b}</b> ${ctx[0]} ?`, round(b * p, 2),
        `Prix pour 1 : $${fmt(round(a * p, 2)).replace(",", "{,}")} \\div ${a} = ${fmt(p).replace(",", "{,}")}$. Puis $${fmt(p).replace(",", "{,}")} \\times ${b}$.`, 0.006);
    } });

  add({ id: "pourcentages", matiere: "maths", titre: "Pourcentages", desc: "Calculer un pourcentage, une évolution", niveaux: [4, 9],
    gen(n) {
      if (n <= 6 || Math.random() < .4) { const p = n <= 5 ? pick([10, 25, 50, 75]) : pick([5, 10, 15, 20, 30, 40, 60]), v = rnd(2, 40) * 20;
        return numQ(`Combien font <b>${p} %</b> de <b>${v}</b> ?`, v * p / 100, `${p} % de ${v}, c'est $${v} \\times \\frac{${p}}{100} = ${fmt(v * p / 100)}$.`); }
      const t = pick([5, 10, 12, 15, 20, 25, 30, 40]), hausse = Math.random() < .5, v = rnd(4, 60) * 10;
      if (n >= 9 && Math.random() < .5) return numQ(`Quel est le <b>coefficient multiplicateur</b> associé à une ${hausse ? "hausse" : "baisse"} de ${t} % ?`, 1 + (hausse ? 1 : -1) * t / 100,
        `Une ${hausse ? "hausse" : "baisse"} de ${t} % revient à multiplier par $1 ${hausse ? "+" : "-"} \\frac{${t}}{100}$.`);
      return numQ(`Un prix de <b>${v} €</b> ${hausse ? "augmente" : "baisse"} de <b>${t} %</b>. Quel est le nouveau prix (en €) ?`, v * (1 + (hausse ? 1 : -1) * t / 100),
        `On multiplie par $${fmt(1 + (hausse ? 1 : -1) * t / 100).replace(",", "{,}")}$.`, 0.006);
    } });

  add({ id: "priorites", matiere: "maths", titre: "Priorités opératoires", desc: "Multiplications avant additions", niveaux: [5, 7],
    gen() {
      const a = rnd(2, 12), b = rnd(2, 9), c = rnd(2, 9), d = rnd(1, 20);
      const forms = [
        [`${a} + ${b} \\times ${c}`, a + b * c, `D'abord $${b} \\times ${c} = ${b * c}$, puis $${a} + ${b * c}$.`],
        [`(${a} + ${b}) \\times ${c}`, (a + b) * c, `Les parenthèses d'abord : $${a} + ${b} = ${a + b}$.`],
        [`${a * c} \\div ${c} + ${b} \\times ${d}`, a + b * d, "Divisions et multiplications d'abord, additions ensuite."],
        [`${d + b * c} - ${b} \\times ${c}`, d, `D'abord $${b} \\times ${c} = ${b * c}$.`],
      ];
      const [e, v, x] = pick(forms);
      return numQ(`$${e} = \\;?$`, v, x);
    } });

  add({ id: "relatifs", matiere: "maths", titre: "Nombres relatifs", desc: "Additionner, soustraire, multiplier", niveaux: [6, 8],
    gen(n) {
      const a = nz(-20, 20), b = nz(-20, 20), op = n === 6 ? pick(["+", "-"]) : pick(["+", "-", "\\times"]);
      const v = op === "+" ? a + b : op === "-" ? a - b : a * b;
      const ex = op === "\\times" ? "Règle des signes : deux signes identiques donnent +, deux signes différents donnent −."
        : op === "-" ? `Soustraire un nombre, c'est ajouter son opposé : $${a} - ${b < 0 ? "(" + b + ")" : b} = ${a} + ${b < 0 ? -b : "(" + -b + ")"}$.`
          : "Signes différents : on soustrait les distances à zéro et on garde le signe du plus éloigné de zéro.";
      return numQ(`$${a} ${op} ${b < 0 ? "(" + b + ")" : b} = \\;?$`, v, ex);
    } });

  add({ id: "puissances", matiere: "maths", titre: "Puissances", desc: "Carrés, cubes, puissances de 10", niveaux: [6, 9],
    gen(n) {
      if (n === 6) { const t = rnd(0, 2);
        if (t === 0) { const a = rnd(0, 12); return numQ(`$${a}^2 = \\;?$`, a * a, `$${a}^2 = ${a} \\times ${a} = ${a * a}$ : c'est « ${a} au carré ».`); }
        if (t === 1) { const a = rnd(1, 5); return numQ(`$${a}^3 = \\;?$`, a ** 3, `$${a}^3 = ${a} \\times ${a} \\times ${a} = ${a ** 3}$ : c'est « ${a} au cube ».`); }
        const e = rnd(2, 6); return numQ(`Écris $2^{${e}}$ sous forme d'un nombre.`, 2 ** e, `$2^{${e}}$, c'est 2 multiplié ${e} fois par lui-même.`); }
      const t = rnd(0, 2);
      if (t === 0) { const a = pick([2, 3, 5, -2, -3]), e = rnd(0, a === 2 ? 8 : 4);
        return numQ(`$${a < 0 ? "(" + a + ")" : a}^{${e}} = \\;?$`, a ** e, e === 0 ? "Tout nombre non nul à la puissance 0 vaut 1." : `$${a}^{${e}}$ = ${a} multiplié ${e} fois par lui-même.`); }
      if (t === 1) { const e = rnd(-4, 6);
        return numQ(`Écris $10^{${e}}$ en nombre décimal.`, 10 ** e, e < 0 ? `$10^{${e}} = \\frac{1}{10^{${-e}}}$ : ${-e} chiffre${-e > 1 ? "s" : ""} après la virgule.` : `Un 1 suivi de ${e} zéro${e > 1 ? "s" : ""}.`); }
      const a = rnd(2, 6), m = rnd(2, 6), p = rnd(2, 5);
      return numQ(`Simplifie : $${a}^{${m}} \\times ${a}^{${p}} = ${a}^{\\,?}$`, m + p, `$a^m \\times a^p = a^{m+p}$, donc l'exposant est $${m} + ${p}$.`);
    } });

  add({ id: "equations", matiere: "maths", titre: "Équations", desc: "Trouver x", niveaux: [6, 9],
    gen(n) {
      if (n === 6) { const x = rnd(1, 15);
        if (Math.random() < .5) { const b = rnd(2, 30); return numQ(`Résous : $x + ${b} = ${x + b}$. Que vaut $x$ ?`, x, `On enlève ${b} des deux côtés : $x = ${x + b} - ${b} = ${x}$.`); }
        const a = rnd(2, 9); return numQ(`Résous : $${a}x = ${a * x}$. Que vaut $x$ ?`, x, `On divise les deux côtés par ${a} : $x = ${a * x} \\div ${a} = ${x}$.`); }
      const x = n === 7 ? nz(-10, 10) : nz(-12, 12), a = nz(-9, 9), b = rnd(-20, 20);
      if (n >= 8 && Math.random() < .5) { const c = nz(-9, 9); if (c === a) return this.gen(n); const d = a * x + b - c * x;
        return numQ(`Résous : $${a}x ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${c}x ${d < 0 ? "-" : "+"} ${Math.abs(d)}$. Que vaut $x$ ?`, x,
          `Regroupe les $x$ d'un côté : $${a - c}x = ${d - b}$, donc $x = ${d - b} \\div ${a - c}$.`); }
      const c = a * x + b;
      return numQ(`Résous : $${a === 1 ? "" : a === -1 ? "-" : a}x ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${c}$. Que vaut $x$ ?`, x,
        `On enlève ${b} des deux côtés : $${a}x = ${c - b}$, puis on divise par ${a}.`);
    } });

  const TRIPLETS = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25], [12, 16, 20], [20, 21, 29]];
  add({ id: "pythagore", matiere: "maths", titre: "Théorème de Pythagore", desc: "Calculer une longueur", niveaux: [7, 8],
    gen() {
      const [a, b, c] = pick(TRIPLETS), k = pick([1, 1, 2]);
      if (Math.random() < .5) return numQ(`Le triangle ABC est rectangle en A, avec AB = ${a * k} cm et AC = ${b * k} cm. Combien mesure BC (en cm) ?`, c * k,
        `$BC^2 = AB^2 + AC^2 = ${(a * k) ** 2} + ${(b * k) ** 2} = ${(c * k) ** 2}$, donc $BC = \\sqrt{${(c * k) ** 2}} = ${c * k}$.`);
      return numQ(`Le triangle ABC est rectangle en A, avec BC = ${c * k} cm et AB = ${a * k} cm. Combien mesure AC (en cm) ?`, b * k,
        `$AC^2 = BC^2 - AB^2 = ${(c * k) ** 2} - ${(a * k) ** 2} = ${(b * k) ** 2}$, donc $AC = ${b * k}$.`);
    } });

  add({ id: "fonctions", matiere: "maths", titre: "Fonctions affines", desc: "Image, antécédent", niveaux: [8, 9],
    gen() {
      const a = nz(-6, 6), b = rnd(-10, 10), x = rnd(-6, 6), f = `f(x) = ${a === 1 ? "" : a === -1 ? "-" : a}x ${b < 0 ? "-" : "+"} ${Math.abs(b)}`;
      if (Math.random() < .5) return numQ(`Soit $${f}$. Calcule $f(${x})$.`, a * x + b, `$f(${x}) = ${a} \\times ${sgn(x)} + ${sgn(b)} = ${a * x + b}$.`);
      return numQ(`Soit $${f}$. Quel est l'antécédent de $${a * x + b}$ ?`, x, `On résout $${a}x + ${sgn(b)} = ${a * x + b}$, donc $x = ${x}$.`);
    } });

  add({ id: "racines", matiere: "maths", titre: "Racines carrées", desc: "Carrés parfaits et calculs", niveaux: [7, 9],
    gen() {
      const a = rnd(1, 20);
      if (Math.random() < .6) return numQ(`$\\sqrt{${a * a}} = \\;?$`, a, `$${a}^2 = ${a * a}$, donc $\\sqrt{${a * a}} = ${a}$.`);
      const b = rnd(2, 9); return numQ(`$\\sqrt{${a * a}} \\times \\sqrt{${b * b}} = \\;?$`, a * b, `$${a} \\times ${b} = ${a * b}$.`);
    } });

  add({ id: "probabilites", matiere: "maths", titre: "Probabilités", desc: "Urnes, dés, cartes", niveaux: [5, 11],
    gen(n) {
      if (n <= 9 || Math.random() < .5) { const r = rnd(1, 8), v = rnd(1, 8), j = rnd(0, 6), tot = r + v + j;
        const c = pick([["rouge", r], ["verte", v]]);
        return numQ(`Une urne contient ${r} boules rouges, ${v} boules vertes${j ? ` et ${j} boules jaunes` : ""}. On tire une boule au hasard. Quelle est la probabilité qu'elle soit <b>${c[0]}</b> ? <small>(forme a/b)</small>`,
          c[1] / tot, `Cas favorables ÷ cas possibles : $\\frac{${c[1]}}{${tot}}$.`, 1e-6, frac(c[1], tot)); }
      const N = rnd(3, 6), k = rnd(0, N), p = pick([0.2, 0.3, 0.4, 0.5, 0.6]);
      const C = (a, b) => { let r = 1; for (let i = 1; i <= b; i++) r = r * (a - b + i) / i; return r; };
      const v = C(N, k) * p ** k * (1 - p) ** (N - k);
      return numQ(`$X$ suit la loi binomiale $\\mathcal{B}(${N}\\,;\\,${fmt(p).replace(",", "{,}")})$. Calcule $P(X = ${k})$, arrondi au millième.`, v,
        `$P(X=${k}) = \\binom{${N}}{${k}} \\times ${fmt(p).replace(",", "{,}")}^{${k}} \\times ${fmt(1 - p).replace(",", "{,}")}^{${N - k}}$.`, 0.0011, fmt(round(v, 3)));
    } });

  add({ id: "droites", matiere: "maths", titre: "Droites et repères", desc: "Coefficient directeur, milieu", niveaux: [9, 10],
    gen() {
      const xa = rnd(-6, 6), ya = rnd(-6, 6); let xb; do { xb = rnd(-6, 6); } while (xb === xa); const yb = rnd(-6, 6);
      if (Math.random() < .6) return numQ(`Quel est le coefficient directeur de la droite $(AB)$ avec $A(${xa}\\,;\\,${ya})$ et $B(${xb}\\,;\\,${yb})$ ? <small>(forme a/b si besoin)</small>`,
        (yb - ya) / (xb - xa), `$m = \\frac{y_B - y_A}{x_B - x_A} = \\frac{${yb} - ${sgn(ya)}}{${xb} - ${sgn(xa)}} = ${texFrac(yb - ya, xb - xa)}$.`, 1e-6, frac(yb - ya, xb - xa));
      return numQ(`Avec $A(${xa}\\,;\\,${ya})$ et $B(${xb}\\,;\\,${yb})$, quelle est l'abscisse du milieu de $[AB]$ ?`, (xa + xb) / 2, `$x_I = \\frac{x_A + x_B}{2} = \\frac{${xa} + ${sgn(xb)}}{2}$.`);
    } });

  add({ id: "second_degre", matiere: "maths", titre: "Second degré", desc: "Discriminant et racines", niveaux: [10, 11],
    gen() {
      const r1 = rnd(-6, 6), r2 = rnd(-6, 6), a = pick([1, 1, 2, -1]);
      const b = -a * (r1 + r2), c = a * r1 * r2, D = b * b - 4 * a * c;
      const P = `${a === 1 ? "" : a === -1 ? "-" : a}x^2 ${b < 0 ? "-" : "+"} ${Math.abs(b)}x ${c < 0 ? "-" : "+"} ${Math.abs(c)}`;
      const t = rnd(0, 2);
      if (t === 0) return numQ(`Calcule le discriminant $\\Delta$ de $${P}$.`, D, `$\\Delta = b^2 - 4ac = ${sgn(b)}^2 - 4 \\times ${sgn(a)} \\times ${sgn(c)} = ${D}$.`);
      if (t === 1) return qcm(`Combien de solutions réelles a l'équation $${P} = 0$ ?`, ["0", "1", "2"], D > 0 ? "2" : D === 0 ? "1" : "0", `$\\Delta = ${D}$ : ${D > 0 ? "positif, deux solutions" : D === 0 ? "nul, une solution double" : "négatif, aucune solution"}.`);
      return numQ(`Donne la <b>plus grande</b> solution de $${P} = 0$.`, Math.max(r1, r2), `$\\Delta = ${D}$, $x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}$ donne ${r1} et ${r2}.`);
    } });

  add({ id: "derivees", matiere: "maths", titre: "Dérivées", desc: "Nombre dérivé en un point", niveaux: [10, 11],
    gen(n) {
      const a = rnd(-3, 3), b = rnd(-5, 5), c = rnd(-8, 8), k = rnd(-3, 3);
      if (n === 11 && Math.random() < .35) { const m = nz(-4, 4), p = rnd(-5, 5);
        return numQ(`Soit $f(x) = ${m}e^{x} ${p < 0 ? "-" : "+"} ${Math.abs(p)}x$. Calcule $f'(0)$.`, m + p, `$(e^x)' = e^x$, donc $f'(x) = ${m}e^x + ${sgn(p)}$ et $f'(0) = ${m} + ${sgn(p)}$.`); }
      const f = `${a}x^3 ${b < 0 ? "-" : "+"} ${Math.abs(b)}x^2 ${c < 0 ? "-" : "+"} ${Math.abs(c)}x + 7`;
      const v = 3 * a * k * k + 2 * b * k + c;
      return numQ(`Soit $f(x) = ${f}$. Calcule $f'(${k})$.`, v, `$f'(x) = ${3 * a}x^2 ${2 * b < 0 ? "-" : "+"} ${Math.abs(2 * b)}x ${c < 0 ? "-" : "+"} ${Math.abs(c)}$, puis on remplace $x$ par ${k}.`);
    } });

  add({ id: "suites", matiere: "maths", titre: "Suites", desc: "Arithmétiques et géométriques", niveaux: [10, 11],
    gen() {
      const u0 = rnd(-5, 10), n = rnd(3, 12);
      if (Math.random() < .5) { const r = nz(-5, 7);
        return numQ(`$(u_n)$ est arithmétique de premier terme $u_0 = ${u0}$ et de raison $r = ${r}$. Calcule $u_{${n}}$.`, u0 + n * r, `$u_n = u_0 + n \\times r = ${u0} + ${n} \\times ${sgn(r)}$.`); }
      const q = pick([2, 3, -2]), m = rnd(2, 6), v0 = nz(1, 5);
      return numQ(`$(v_n)$ est géométrique avec $v_0 = ${v0}$ et $q = ${q}$. Calcule $v_{${m}}$.`, v0 * q ** m, `$v_n = v_0 \\times q^n = ${v0} \\times ${sgn(q)}^{${m}}$.`);
    } });

  add({ id: "integrales", matiere: "maths", titre: "Intégrales", desc: "Primitives de polynômes", niveaux: [11, 11],
    gen() {
      const a = rnd(0, 3), b = rnd(-4, 4), c = rnd(-5, 5), lo = rnd(-2, 1), hi = lo + rnd(1, 3);
      // f(x) = a x² + b x + c
      const f = `${a ? (a === 1 ? "" : a) + "x^2" : ""} ${b ? (b < 0 ? "- " : a ? "+ " : "") + Math.abs(b) + "x" : ""} ${c < 0 ? "-" : (a || b) ? "+" : ""} ${Math.abs(c)}`.trim();
      const Fx = x => a * x ** 3 / 3 + b * x * x / 2 + c * x;
      const v = Fx(hi) - Fx(lo);
      return numQ(`Calcule $\\displaystyle\\int_{${lo}}^{${hi}} (${f})\\,dx$ <small>(valeur exacte ou arrondie au centième)</small>`, v,
        `Une primitive est $F(x) = ${a ? texFrac(a, 3) + "x^3" : ""}${b ? (b < 0 ? " - " : " + ") + texFrac(Math.abs(b), 2) + "x^2" : ""} ${c < 0 ? "-" : "+"} ${Math.abs(c)}x$, puis $F(${hi}) - F(${lo})$.`, 0.006, fmt(round(v, 2)));
    } });

  add({ id: "fractions_debut", matiere: "maths", titre: "Premières fractions", desc: "Demi, tiers, quart…", niveaux: [1, 2],
    gen(n) {
      const NOMS = { 2: "demi", 3: "tiers", 4: "quart", 5: "cinquième", 6: "sixième", 8: "huitième", 10: "dixième" };
      const ds = [2, 3, 4, 5, 6, 8, 10], t = rnd(0, n === 1 ? 1 : 2);
      if (t === 0) { const d = pick(ds); return numQ(`Combien de <b>${NOMS[d]}s</b> faut-il pour faire une unité entière ?`, d, `Une unité partagée en ${d} parts égales : il faut ${d} ${NOMS[d]}s. $\\frac{${d}}{${d}} = 1$.`); }
      if (t === 1) { let a, b; do { a = pick(ds); b = pick(ds); } while (a === b);
        return qcm(`Quelle fraction est la plus grande ?`, [`1/${a}`, `1/${b}`], `1/${Math.min(a, b)}`, `Plus on partage en beaucoup de parts, plus chaque part est petite : un ${NOMS[Math.min(a, b)]} est plus grand qu'un ${NOMS[Math.max(a, b)]}.`); }
      const d = pick([3, 4, 5, 6, 8, 10]), a = rnd(1, d - 2), b = rnd(1, d - a);
      return numQ(`$\\frac{${a}}{${d}} + \\frac{${b}}{${d}} = \\;?$ <small>(réponds sous la forme a/b)</small>`, (a + b) / d, `Les parts ont la même taille : on ajoute ${a} et ${b} ${NOMS[d]}s, cela fait ${a + b} ${NOMS[d]}s.`, 1e-6, frac(a + b, d));
    } });

  add({ id: "valeur_absolue", matiere: "maths", titre: "Valeur absolue", desc: "Nouveau programme de seconde", niveaux: [9, 9],
    gen() {
      const t = rnd(0, 2);
      if (t === 0) { const a = nz(-20, 20); return numQ(`$|${a}| = \\;?$`, Math.abs(a), `La valeur absolue est la distance à zéro : elle est toujours positive.`); }
      if (t === 1) { const a = rnd(-9, 9), b = rnd(-9, 9); return numQ(`Calcule $|${a} - ${b < 0 ? "(" + b + ")" : b}|$, la distance entre ${a} et ${b}.`, Math.abs(a - b), `$|a - b|$ est la distance entre $a$ et $b$ sur la droite graduée.`); }
      const a = rnd(-6, 6), r = rnd(1, 8);
      return numQ(`L'équation $|x - ${a < 0 ? "(" + a + ")" : a}| = ${r}$ a deux solutions. Donne la <b>plus grande</b>.`, a + r, `Les nombres à distance ${r} de ${a} sont ${a - r} et ${a + r}.`);
    } });

  add({ id: "automatismes", matiere: "maths", titre: "Automatismes (épreuve anticipée)", desc: "Calcul sans calculatrice, type épreuve de 1re", niveaux: [10, 10],
    gen() {
      const src = pick([["fractions", 8], ["puissances", 8], ["pourcentages", 9], ["equations", 9], ["proportionnalite", 7], ["probabilites", 9], ["fonctions", 9], ["priorites", 7], ["valeur_absolue", 9], ["relatifs", 8]]);
      const ex = EX.find(e => e.id === src[0]);
      return ex.gen.call({ gen: ex.gen }, src[1]);
    } });

  // =====================================================================
  //  FRANÇAIS
  // =====================================================================
  const SYLLABES = [["chat"], ["lit"], ["la", "pin"], ["vé", "lo"], ["mo", "to"], ["ma", "man"], ["ro", "bot"], ["gâ", "teau"], ["ca", "deau"], ["mou", "ton"], ["pou", "let"], ["ca", "fé"], ["ta", "pis"], ["ki", "wi"], ["ju", "do"], ["so", "leil"], ["ba", "teau"], ["do", "mi", "no"], ["cho", "co", "lat"], ["ca", "na", "pé"], ["ca", "ra", "mel"], ["sa", "la", "mi"], ["pi", "ja", "ma"], ["ci", "né", "ma"], ["kan", "gou", "rou"], ["é", "lé", "phant"], ["a", "na", "nas"], ["or", "di", "na", "teur"], ["té", "lé", "vi", "sion"], ["hé", "li", "co"]];
  add({ id: "syllabes", matiere: "francais", titre: "Les syllabes", desc: "Entendre et compter les syllabes", niveaux: [0, 1], audio: true,
    gen() {
      const w = pick(SYLLABES), mot = w.join("");
      if (Math.random() < .5 || w.length === 1) return numQ(`Combien de syllabes entends-tu dans <span class="big" data-say="${mot}">${mot}</span> ?`, w.length,
        `On tape dans les mains : ${w.join(" – ")}. ${w.length} syllabe${w.length > 1 ? "s" : ""}.`);
      const autres = shuffle([...new Set(SYLLABES.flat())].filter(s => s !== w[0])).slice(0, 2);
      return qcm(`Par quelle syllabe commence <span class="big" data-say="${mot}">${mot}</span> ?`, [w[0], ...autres], w[0], `${w.join(" – ")} : ça commence par « ${w[0]} ».`);
    } });

  // Homophones grammaticaux : [phrase, options, bonne, astuce, niveau min]
  const HOMO = [
    ["Mon frère ___ un vélo rouge.", ["a", "à"], "a", "On peut dire « avait » : c'est le verbe avoir, sans accent.", 1],
    ["Je vais ___ la piscine.", ["a", "à"], "à", "On ne peut pas dire « avait » : c'est la préposition « à ».", 1],
    ["Elle ___ mangé une pomme.", ["a", "à"], "a", "« Elle avait mangé » : verbe avoir.", 1],
    ["Il habite ___ Paris.", ["a", "à"], "à", "On ne peut pas dire « avait » : préposition.", 1],
    ["Le chat ___ le chien jouent.", ["et", "est"], "et", "On peut dire « et puis » : c'est la conjonction.", 1],
    ["Le ciel ___ bleu.", ["et", "est"], "est", "On peut dire « était » : verbe être.", 1],
    ["Ma sœur ___ très gentille.", ["et", "est"], "est", "« Ma sœur était gentille » : verbe être.", 1],
    ["J'aime les fraises ___ les cerises.", ["et", "est"], "et", "« et puis les cerises » : conjonction.", 1],
    ["Les enfants ___ dans la cour.", ["son", "sont"], "sont", "On peut dire « étaient » : verbe être.", 2],
    ["Paul range ___ cartable.", ["son", "sont"], "son", "On peut dire « mon cartable » : déterminant.", 2],
    ["___ va au parc ce soir.", ["On", "Ont"], "On", "On peut dire « il va » : pronom.", 2],
    ["Mes parents ___ acheté une voiture.", ["on", "ont"], "ont", "On peut dire « avaient » : verbe avoir.", 2],
    ["Veux-tu du jus ___ du lait ?", ["ou", "où"], "ou", "On peut dire « ou bien » : sans accent.", 2],
    ["___ as-tu mis tes clés ?", ["Ou", "Où"], "Où", "Il s'agit d'un lieu : « où », avec accent.", 2],
    ["Regarde ___ beaux nuages !", ["ces", "ses", "c'est"], "ces", "On montre les nuages : « ces » (on peut dire « ce nuage-là »).", 3],
    ["Léa range ___ jouets.", ["ces", "ses", "c'est"], "ses", "Les jouets sont à elle : « les siens » → ses.", 3],
    ["___ mon meilleur ami.", ["Ces", "Ses", "C'est"], "C'est", "On peut dire « cela est » : c'est.", 3],
    ["Il ___ lave les mains.", ["ce", "se"], "se", "Devant un verbe pronominal (se laver) : se.", 3],
    ["___ livre est passionnant.", ["Ce", "Se"], "Ce", "Devant un nom, on peut dire « ce livre-là » : déterminant.", 3],
    ["Je ___ ai donné un bonbon.", ["leur", "leurs"], "leur", "Devant un verbe, « leur » est un pronom : il ne prend jamais de s.", 4],
    ["Les élèves ouvrent ___ cahiers.", ["leur", "leurs"], "leurs", "Devant un nom pluriel, le déterminant prend un s.", 4],
    ["Je sais ___ elle viendra.", ["quel", "qu'elle"], "qu'elle", "On peut dire « qu'il » : qu'elle.", 5],
    ["___ belle journée !", ["Quel", "Quelle", "Qu'elle"], "Quelle", "Devant « journée » (féminin singulier) : quelle.", 5],
    ["Il a ___ ses devoirs.", ["fini", "finit", "finis"], "fini", "Après « avoir », on met le participe passé : on peut dire « il a pris ».", 4],
    ["Demain, il ___ son livre.", ["fini", "finit", "finira"], "finira", "« Demain » : futur.", 4],
    ["Je dois ___ la table.", ["ranger", "rangé", "rangez"], "ranger", "Après « dois », on met l'infinitif : on peut dire « je dois prendre ».", 3],
    ["Nous avons ___ la table.", ["ranger", "rangé", "rangez"], "rangé", "Après « avons », participe passé : on peut dire « nous avons pris ».", 3],
    ["___ la nuit tombait, nous rentrions.", ["Quand", "Quant", "Qu'en"], "Quand", "Indique le moment (« lorsque ») : quand.", 6],
    ["___ à moi, je reste ici.", ["Quand", "Quant", "Qu'en"], "Quant", "« Quant à » signifie « en ce qui concerne ».", 6],
    ["Je ne sais pas ___ faire.", ["quoi", "quoique"], "quoi", "Pronom interrogatif : quoi.", 6],
    ["Elle s'est ___ les mains.", ["lavé", "lavée", "lavés"], "lavé", "Le COD (les mains) est après le verbe : pas d'accord.", 8],
    ["Les lettres qu'il a ___ sont arrivées.", ["écrit", "écrites", "écrits"], "écrites", "Le COD « qu' » (les lettres) est placé avant : on accorde.", 8],
    ["Bien ___ fatigué, il a terminé la course.", ["que", "qu'il"], "que", "« Bien que » + adjectif : la proposition est elliptique.", 9],
    ["Il faut ___ tu viennes.", ["que", "qu'"], "que", "Devant une consonne : que.", 3],
  ];
  add({ id: "homophones", matiere: "francais", titre: "Homophones", desc: "a/à, et/est, son/sont, ces/ses…", niveaux: [1, 9],
    gen(n) {
      const pool = HOMO.filter(h => h[4] <= n && h[4] >= Math.max(1, n - 4));
      const [s, opts, ok, why] = pick(pool.length ? pool : HOMO);
      return qcm(`Complète : <span class="phrase">${s.replace("___", '<span class="trou">…</span>')}</span>`, opts, ok, why);
    } });

  const PLURIELS = [
    ["chat", "chats", 1], ["fleur", "fleurs", 1], ["ami", "amis", 1], ["bateau", "bateaux", 2], ["gâteau", "gâteaux", 2], ["jeu", "jeux", 2], ["cheveu", "cheveux", 2],
    ["cheval", "chevaux", 2], ["journal", "journaux", 2], ["animal", "animaux", 2], ["festival", "festivals", 3], ["bal", "bals", 3], ["carnaval", "carnavals", 3],
    ["chou", "choux", 3], ["bijou", "bijoux", 3], ["genou", "genoux", 3], ["caillou", "cailloux", 3], ["hibou", "hiboux", 3], ["jouet", "jouets", 1], ["clou", "clous", 3],
    ["travail", "travaux", 3], ["vitrail", "vitraux", 4], ["détail", "détails", 4], ["nez", "nez", 2], ["souris", "souris", 2], ["prix", "prix", 3], ["pneu", "pneus", 3],
    ["bleu", "bleus", 4], ["œil", "yeux", 3], ["ciel", "cieux", 5], ["landau", "landaus", 5], ["noyau", "noyaux", 3], ["tuyau", "tuyaux", 3], ["vœu", "vœux", 4]
  ];
  add({ id: "pluriel", matiere: "francais", titre: "Le pluriel des noms", desc: "s, x, -aux et les exceptions", niveaux: [1, 5],
    gen(n) {
      const pool = PLURIELS.filter(p => p[2] <= n + 1);
      const [s, p] = pick(pool);
      const det = /^[aeiouyéèœh]/i.test(s) ? "l'" : "le ";
      let why = "On ajoute généralement un s au pluriel.";
      if (s === p) why = `Les noms terminés par -s, -x ou -z ne changent pas : ${p}.`;
      else if (/eau$|au$|eu$/.test(s)) why = p.endsWith("x") ? "Les noms en -au, -eau, -eu prennent un x (sauf landau, bleu, pneu)." : "Exception : landaus, bleus, pneus prennent un s.";
      else if (/al$/.test(s)) why = p.endsWith("aux") ? "Les noms en -al font leur pluriel en -aux." : "Exception : bals, carnavals, festivals, chacals, récitals, régals.";
      else if (/ou$/.test(s)) why = p.endsWith("x") ? "Sept noms en -ou prennent un x : bijou, caillou, chou, genou, hibou, joujou, pou." : "Les noms en -ou prennent un s, sauf les sept exceptions (bijou, caillou, chou…).";
      else if (/ail$/.test(s)) why = p.endsWith("aux") ? "Quelques noms en -ail font -aux : travail, vitrail, corail, émail…" : "La plupart des noms en -ail prennent un s.";
      else if (s === "œil" || s === "ciel") why = "Pluriel irrégulier à apprendre par cœur.";
      return textQ(`Écris au pluriel : <b>${det}${s}</b> → les …`, [p, "les " + p], why, p);
    } });

  // Nature des mots : [phrase avec *mot*, nature, niveau]
  const NATURES = [
    ["Le *chien* aboie.", "nom", 2], ["Le chien *aboie*.", "verbe", 2], ["Une *grande* maison.", "adjectif", 2], ["*Le* chat dort.", "déterminant", 2],
    ["*Elle* chante bien.", "pronom", 3], ["Elle chante *bien*.", "adverbe", 4], ["Il marche *sur* le trottoir.", "préposition", 4], ["Paul *et* Léa jouent.", "conjonction", 5],
    ["Nous *partons* demain.", "verbe", 2], ["Un *joli* bouquet.", "adjectif", 2], ["*Mes* amis arrivent.", "déterminant", 3], ["Ils parlent *doucement*.", "adverbe", 4],
    ["Le livre est *dans* le sac.", "préposition", 4], ["Il pleut *mais* il fait chaud.", "conjonction", 5], ["La *liberté* est précieuse.", "nom", 3], ["*Nous* irons au marché.", "pronom", 3],
    ["Je *le* vois.", "pronom", 5], ["Il fait *très* froid.", "adverbe", 5], ["Le ballon *rouge* roule.", "adjectif", 2], ["*Cette* idée est bonne.", "déterminant", 3],
    ["Il est venu *avec* sa sœur.", "préposition", 4], ["*Hier*, il a neigé.", "adverbe", 5], ["*Courir* est bon pour la santé.", "verbe", 5], ["Je pense *donc* je suis.", "conjonction", 6],
  ];
  const NATS = ["nom", "verbe", "adjectif", "déterminant", "pronom", "adverbe", "préposition", "conjonction"];
  add({ id: "nature", matiere: "francais", titre: "Nature des mots", desc: "Nom, verbe, adjectif, déterminant…", niveaux: [2, 8],
    gen(n) {
      const pool = NATURES.filter(x => x[2] <= n);
      const [s, nat] = pick(pool);
      const accessible = NATS.filter(x => NATURES.some(y => y[1] === x && y[2] <= n));
      const opts = shuffle([nat, ...shuffle(accessible.filter(x => x !== nat)).slice(0, 3)]);
      const astuces = { nom: "Un nom peut être précédé d'un déterminant (le, un, la…).", verbe: "Le verbe change avec le temps : on peut dire « hier, … » ou « demain, … ».",
        adjectif: "L'adjectif précise le nom, il s'accorde avec lui.", "déterminant": "Le déterminant se place devant le nom.", pronom: "Le pronom remplace un nom.",
        adverbe: "L'adverbe est invariable et précise un verbe, un adjectif ou une phrase.", "préposition": "La préposition (à, dans, par, pour, sur, avec…) introduit un complément.",
        conjonction: "Mais, ou, et, donc, or, ni, car : les conjonctions de coordination relient deux éléments." };
      return qcm(`Quelle est la nature du mot en gras ?<br><span class="phrase">${s.replace(/\*(.+?)\*/, "<b>$1</b>")}</span>`, opts, nat, astuces[nat]);
    } });

  // ---------- conjugaison ----------
  const PRON = ["je", "tu", "il", "elle", "nous", "vous", "ils", "elles"];
  const PIDX = { je: 0, tu: 1, il: 2, elle: 2, nous: 3, vous: 4, ils: 5, elles: 5 };
  const IRR = {
    "être": { pr: "suis es est sommes êtes sont", im: "ét", fu: "ser", pp: "été", aux: "avoir", ps: "fus fus fut fûmes fûtes furent", su: "sois sois soit soyons soyez soient" },
    "avoir": { pr: "ai as a avons avez ont", im: "av", fu: "aur", pp: "eu", aux: "avoir", ps: "eus eus eut eûmes eûtes eurent", su: "aie aies ait ayons ayez aient" },
    "aller": { pr: "vais vas va allons allez vont", im: "all", fu: "ir", pp: "allé", aux: "être", ps: "allai allas alla allâmes allâtes allèrent", su: "aille ailles aille allions alliez aillent" },
    "faire": { pr: "fais fais fait faisons faites font", im: "fais", fu: "fer", pp: "fait", aux: "avoir", ps: "fis fis fit fîmes fîtes firent", su: "fasse fasses fasse fassions fassiez fassent" },
    "prendre": { pr: "prends prends prend prenons prenez prennent", im: "pren", fu: "prendr", pp: "pris", aux: "avoir", ps: "pris pris prit prîmes prîtes prirent", su: "prenne prennes prenne prenions preniez prennent" },
    "venir": { pr: "viens viens vient venons venez viennent", im: "ven", fu: "viendr", pp: "venu", aux: "être", ps: "vins vins vint vînmes vîntes vinrent", su: "vienne viennes vienne venions veniez viennent" },
    "pouvoir": { pr: "peux peux peut pouvons pouvez peuvent", im: "pouv", fu: "pourr", pp: "pu", aux: "avoir", ps: "pus pus put pûmes pûtes purent", su: "puisse puisses puisse puissions puissiez puissent" },
    "vouloir": { pr: "veux veux veut voulons voulez veulent", im: "voul", fu: "voudr", pp: "voulu", aux: "avoir", ps: "voulus voulus voulut voulûmes voulûtes voulurent", su: "veuille veuilles veuille voulions vouliez veuillent" },
    "dire": { pr: "dis dis dit disons dites disent", im: "dis", fu: "dir", pp: "dit", aux: "avoir", ps: "dis dis dit dîmes dîtes dirent", su: "dise dises dise disions disiez disent" },
    "voir": { pr: "vois vois voit voyons voyez voient", im: "voy", fu: "verr", pp: "vu", aux: "avoir", ps: "vis vis vit vîmes vîtes virent", su: "voie voies voie voyions voyiez voient" },
    "partir": { pr: "pars pars part partons partez partent", im: "part", fu: "partir", pp: "parti", aux: "être", ps: "partis partis partit partîmes partîtes partirent", su: "parte partes parte partions partiez partent" },
  };
  const VER1 = ["chanter", "jouer", "parler", "marcher", "danser", "regarder", "aimer", "écouter", "travailler", "manger", "nager", "commencer", "lancer", "dessiner", "arriver", "tomber", "rester", "entrer"];
  const VER2 = ["finir", "choisir", "grandir", "réussir", "remplir", "obéir", "rougir", "bâtir"];
  const AUX_ETRE_1 = ["arriver", "tomber", "rester", "entrer"];
  const END = { pr: ["e", "es", "e", "ons", "ez", "ent"], im: ["ais", "ais", "ait", "ions", "iez", "aient"], fu: ["ai", "as", "a", "ons", "ez", "ont"], co: ["ais", "ais", "ait", "ions", "iez", "aient"],
    ps1: ["ai", "as", "a", "âmes", "âtes", "èrent"], su: ["e", "es", "e", "ions", "iez", "ent"] };
  const fix1 = (stem, end) => { // manger → mangeons, commencer → commençons
    if (/g$/.test(stem) && /^[aoâ]/.test(end)) return stem + "e" + end;
    if (/c$/.test(stem) && /^[aoâ]/.test(end)) return stem.slice(0, -1) + "ç" + end;
    return stem + end;
  };
  function conj(v, temps, i) {
    const irr = IRR[v];
    const g2 = VER2.includes(v);
    const st = v.slice(0, -2);
    switch (temps) {
      case "présent": return irr ? irr.pr.split(" ")[i] : g2 ? st + ["is", "is", "it", "issons", "issez", "issent"][i] : fix1(st, END.pr[i]);
      case "imparfait": return irr ? irr.im + END.im[i] : g2 ? st + "iss" + END.im[i] : fix1(st, END.im[i]);
      case "futur": return irr ? irr.fu + END.fu[i] : v + END.fu[i];
      case "conditionnel": return irr ? irr.fu + END.co[i] : v + END.co[i];
      case "passé simple": return irr ? irr.ps.split(" ")[i] : g2 ? st + ["is", "is", "it", "îmes", "îtes", "irent"][i] : fix1(st, END.ps1[i]);
      case "subjonctif": return irr ? irr.su.split(" ")[i] : g2 ? st + "iss" + END.su[i] : st + END.su[i];
      case "passé composé": {
        const aux = irr ? irr.aux : AUX_ETRE_1.includes(v) ? "être" : "avoir";
        const pp = irr ? irr.pp : g2 ? st + "i" : st + "é";
        return { aux, pp, txt: conj(aux, "présent", i) + " " + pp };
      }
    }
  }
  const TEMPS_NIV = [["présent", 1], ["futur", 2], ["imparfait", 2], ["passé composé", 3], ["passé simple", 4], ["conditionnel", 4], ["subjonctif", 7]];
  const VERBES_NIV = n => {
    let l = VER1.slice(0, n <= 1 ? 8 : 18).concat(["être", "avoir", "aller", "faire"]);
    if (n >= 2) l = l.concat(["dire", "venir", "pouvoir", "vouloir", "prendre", "voir"]);
    if (n >= 3) l = l.concat(VER2, ["partir"]);
    return l;
  };
  const elide = (p, f) => p === "je" && /^[aeiouyéèêh]/i.test(f) ? "j'" : p + " ";
  add({ id: "conjugaison", matiere: "francais", titre: "Conjugaison", desc: "Présent, futur, imparfait, passé composé…", niveaux: [1, 11],
    gen(n) {
      const temps = pick(TEMPS_NIV.filter(t => t[1] <= n).map(t => t[0]));
      const v = pick(VERBES_NIV(n));
      let p = pick(PRON);
      if (temps === "passé simple" && n <= 5) p = pick(["il", "elle", "ils", "elles"]);
      const i = PIDX[p];
      let rep = conj(v, temps, i), accepte, shown;
      if (temps === "passé composé") {
        const { aux, pp, txt } = rep;
        if (aux === "être") {
          const fem = p === "elle" || p === "elles", plur = i >= 3;
          const forme = pp + (fem ? "e" : "") + (plur ? "s" : "");
          const base = conj("être", "présent", i);
          // je, tu, nous, vous : accord selon qui parle — on accepte les deux genres
          accepte = (["je", "tu", "nous", "vous"].includes(p) ? [pp + (plur ? "s" : ""), pp + "e" + (plur ? "s" : "")] : [forme]).map(f => base + " " + f);
          if (p === "vous") accepte.push(base + " " + pp, base + " " + pp + "e");
          shown = base + " " + forme;
        } else { accepte = [txt]; shown = txt; }
      } else { accepte = [rep]; shown = rep; }
      const sub = temps === "subjonctif" ? (p.startsWith("i") || p.startsWith("e") ? "qu'" : "que ") : "";
      const all = [];
      accepte.forEach(a => { all.push(a, elide(p, a) + a, sub + elide(p, a) + a); });
      const grp = IRR[v] ? "verbe irrégulier, à apprendre par cœur" : VER2.includes(v) ? "2e groupe (comme finir)" : "1er groupe (comme chanter)";
      let expl = `« ${v} » : ${grp}. ${sub}${elide(p, shown)}${shown}.`;
      if (/^(manger|nager)$/.test(v) && /[ao]/.test((typeof rep === "string" ? rep : "")[v.length - 2] || "")) expl += " On garde le e après le g pour garder le son [j].";
      return { q: `Conjugue <b>${v}</b> ${/^[aeiou]/.test(temps) ? "à l'" : "au "}<b>${temps}</b> :<br><span class="phrase">${sub}${p} <span class="trou">…</span></span>`, kind: "text", answer: shown, expl, check: r => all.map(norm).includes(norm(r)) };
    } });

  // =====================================================================
  //  ANGLAIS
  // =====================================================================
  const VOCAB = [
    ["un chat", "a cat", 3], ["un chien", "a dog", 3], ["la maison", "the house", 3], ["l'école", "the school", 3], ["rouge", "red", 3], ["bleu", "blue", 3], ["vert", "green", 3], ["jaune", "yellow", 3],
    ["le livre", "the book", 3], ["la pomme", "the apple", 3], ["le frère", "the brother", 3], ["la sœur", "the sister", 3], ["lundi", "Monday", 3], ["mercredi", "Wednesday", 4], ["jeudi", "Thursday", 4],
    ["le petit-déjeuner", "breakfast", 4], ["le déjeuner", "lunch", 4], ["le dîner", "dinner", 4], ["la cuisine", "the kitchen", 4], ["la chambre", "the bedroom", 4], ["le genou", "the knee", 5],
    ["l'épaule", "the shoulder", 5], ["la gare", "the station", 5], ["la bibliothèque", "the library", 5], ["une librairie", "a bookshop", 6], ["le temps (météo)", "the weather", 5],
    ["heureux", "happy", 4], ["fatigué", "tired", 5], ["effrayé", "scared", 6], ["fier", "proud", 6], ["le voyage", "the journey", 7], ["un ingénieur", "an engineer", 7],
    ["le chômage", "unemployment", 9], ["l'environnement", "the environment", 8], ["le réchauffement climatique", "global warming", 8], ["un témoin", "a witness", 9], ["un débat", "a debate", 9],
    ["le gouvernement", "the government", 9], ["une compétence", "a skill", 9], ["s'entraîner", "to train", 6], ["emprunter", "to borrow", 7], ["prêter", "to lend", 7], ["se souvenir", "to remember", 6],
  ];
  add({ id: "vocabulaire_en", matiere: "anglais", titre: "Vocabulaire", desc: "Traduire du français vers l'anglais", niveaux: [3, 11],
    gen(n) {
      const pool = VOCAB.filter(v => v[2] <= n && v[2] >= n - 5);
      const [fr, en] = pick(pool);
      const opts = shuffle([en, ...shuffle(pool.filter(v => v[1] !== en)).slice(0, 3).map(v => v[1])]);
      return qcm(`Comment dit-on <b>${fr}</b> en anglais ?`, opts, en, `${fr} → ${en}.`);
    } });

  const IRREG = [
    ["be", "was/were", "been", "être"], ["have", "had", "had", "avoir"], ["go", "went", "gone", "aller"], ["do", "did", "done", "faire"], ["see", "saw", "seen", "voir"],
    ["eat", "ate", "eaten", "manger"], ["drink", "drank", "drunk", "boire"], ["take", "took", "taken", "prendre"], ["give", "gave", "given", "donner"], ["come", "came", "come", "venir"],
    ["write", "wrote", "written", "écrire"], ["read", "read", "read", "lire"], ["speak", "spoke", "spoken", "parler"], ["buy", "bought", "bought", "acheter"], ["bring", "brought", "brought", "apporter"],
    ["think", "thought", "thought", "penser"], ["teach", "taught", "taught", "enseigner"], ["catch", "caught", "caught", "attraper"], ["make", "made", "made", "fabriquer"], ["know", "knew", "known", "savoir"],
    ["find", "found", "found", "trouver"], ["begin", "began", "begun", "commencer"], ["swim", "swam", "swum", "nager"], ["sing", "sang", "sung", "chanter"], ["run", "ran", "run", "courir"],
    ["sleep", "slept", "slept", "dormir"], ["leave", "left", "left", "partir"], ["feel", "felt", "felt", "ressentir"], ["choose", "chose", "chosen", "choisir"], ["forget", "forgot", "forgotten", "oublier"],
    ["get", "got", "got", "obtenir"], ["break", "broke", "broken", "casser"], ["fly", "flew", "flown", "voler"], ["grow", "grew", "grown", "grandir"], ["throw", "threw", "thrown", "lancer"],
  ];
  add({ id: "verbes_irreguliers", matiere: "anglais", titre: "Verbes irréguliers", desc: "Prétérit et participe passé", niveaux: [5, 11],
    gen(n) {
      const pool = IRREG.slice(0, Math.min(IRREG.length, 10 + (n - 5) * 5));
      const [b, pret, pp, fr] = pick(pool);
      const t = Math.random() < .5 ? "prétérit" : "participe passé";
      const ans = t === "prétérit" ? pret : pp;
      return textQ(`<b>${b}</b> <small>(${fr})</small> — donne le <b>${t}</b>.`, ans.split("/").concat([ans]), `${b} – ${pret} – ${pp} : ${fr}.`, ans);
    } });

  // ---------- banques de questions (banques.js) ----------
  (window.BANQUES || []).forEach(b => add({
    id: b.id, matiere: b.matiere, titre: b.titre, desc: b.desc, niveaux: b.niveaux, banque: true,
    paquet() { return shuffle(b.items).slice(0, 10).map(([q, bonne, faux, expl]) => qcm(q, [bonne, ...faux], bonne, expl)); },
    gen() { const [q, bonne, faux, expl] = pick(b.items); return qcm(q, [bonne, ...faux], bonne, expl); }
  }));

  // ---------- passage à la numérotation PS → Terminale ----------
  // Tous les exercices ci-dessus ont été écrits avec 0 = CP : on les décale de 3 rangs.
  EX.forEach(e => {
    e.niveaux = e.niveaux.map(x => x + 3);
    const g = e.gen, p = e.paquet, self = { gen: g };
    e.gen = n => g.call(self, n - 3);
    if (p) e.paquet = n => p(n - 3);
  });

  // =====================================================================
  //  MATERNELLE (0 = PS, 1 = MS, 2 = GS) — consignes lues, réponses en images
  // =====================================================================
  const NB_MAT = n => n <= 1 ? 5 : 8;
  function imgQ(consigne, dessin, options, answer, rendu, dire, classe) {
    return {
      q: `<p class="consigne">${consigne}</p>${dessin ? `<div class="dessin ${classe || ""}" aria-hidden="true">${dessin}</div>` : ""}`,
      kind: "qcm", options: shuffle(options), answer, rendu, expl: dire, dire, images: true, check: r => r === answer
    };
  }
  const autres = (bonne, pool, k) => shuffle(pool.filter(x => x !== bonne)).slice(0, k);
  const emo = (e, px) => `<span class="emo"${px ? ` style="font-size:${px}px"` : ""}>${e}</span>`;

  const COUL = { rouge: ["#e03131", "une fraise"], bleu: ["#1c64d9", "le ciel"], jaune: ["#f5c518", "le soleil"], vert: ["#2f9e44", "l'herbe"], orange: ["#f08c00", "une orange"],
    violet: ["#8e44ad", "une aubergine"], rose: ["#f06595", "un flamant rose"], marron: ["#8b5a2b", "le chocolat"], noir: ["#222222", "la nuit"], blanc: ["#ffffff", "la neige"] };
  function svgForme(forme, c, t) {
    t = t || 84;
    const s = `fill="${c}" stroke="rgba(0,0,0,.35)" stroke-width="2.5" stroke-linejoin="round"`;
    const d = {
      rond: `<circle cx="50" cy="50" r="40" ${s}/>`, "carré": `<rect x="13" y="13" width="74" height="74" ${s}/>`,
      triangle: `<polygon points="50,9 92,87 8,87" ${s}/>`, rectangle: `<rect x="4" y="27" width="92" height="46" ${s}/>`,
      losange: `<polygon points="50,4 90,50 50,96 10,50" ${s}/>`, "étoile": `<polygon points="50,5 61,37 95,37 68,57 78,91 50,71 22,91 32,57 5,37 39,37" ${s}/>`
    }[forme];
    return `<svg viewBox="0 0 100 100" width="${t}" height="${t}" aria-hidden="true">${d}</svg>`;
  }

  add({ id: "m_compter", matiere: "maths", titre: "Compter", desc: "Combien y en a-t-il ?", niveaux: [0, 2], nb: NB_MAT,
    gen(n) {
      const [e, nom] = pick([["🍎", "pommes"], ["🐟", "poissons"], ["⭐", "étoiles"], ["🚗", "voitures"], ["🎈", "ballons"], ["🐞", "coccinelles"], ["🍓", "fraises"], ["🦆", "canards"], ["🌸", "fleurs"], ["🐥", "poussins"]]);
      const max = [3, 5, 10][n], k = rnd(1, max);
      const opts = [k, ...autres(k, Array.from({ length: max }, (_, i) => i + 1), n === 0 ? 2 : n === 1 ? 2 : 3)].map(String);
      const rendu = o => `<span class="chiffre">${o}</span>${n <= 1 ? `<span class="points">${"●".repeat(+o)}</span>` : ""}`;
      return imgQ(`Combien y a-t-il ${/^[aeiouéè]/.test(nom) ? "d'" : "de "}<b>${nom}</b> ?`, Array(k).fill(emo(e)).join(""), opts, String(k), rendu,
        `On compte : ${Array.from({ length: k }, (_, i) => i + 1).join(", ")}. Il y en a ${k} !`, "compte");
    } });

  add({ id: "m_chiffres", matiere: "maths", titre: "Les chiffres", desc: "Reconnaître les chiffres", niveaux: [1, 2], nb: NB_MAT,
    gen(n) {
      const pool = n === 1 ? [1, 2, 3, 4, 5] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const k = pick(pool), opts = [k, ...autres(k, pool, n === 1 ? 2 : 3)].map(String);
      return imgQ(`Touche le ${k === 10 ? "nombre" : "chiffre"} <b>${k}</b>.`, "", opts, String(k), o => `<span class="chiffre">${o}</span>`,
        `Le ${k} s'écrit comme ça : ${k}.`);
    } });

  add({ id: "m_formes", matiere: "maths", titre: "Les formes", desc: "Rond, carré, triangle…", niveaux: [0, 2], nb: NB_MAT,
    gen(n) {
      const pool = ["rond", "carré", "triangle", "rectangle", "losange", "étoile"].slice(0, [3, 4, 6][n]);
      const f = pick(pool), opts = [f, ...autres(f, pool, n === 0 ? 2 : 3)];
      const c = pick(["#1c64d9", "#e03131", "#2f9e44", "#f08c00", "#8e44ad"]);
      const aide = { rond: "Le rond n'a pas de coin, il roule.", "carré": "Le carré a 4 côtés tous pareils.", triangle: "Le triangle a 3 côtés et 3 pointes.",
        rectangle: "Le rectangle a 4 côtés : 2 longs et 2 courts.", losange: "Le losange, c'est comme un carré posé sur sa pointe.", "étoile": "L'étoile a 5 branches." };
      return imgQ(`Touche ${f === "étoile" ? "l'" : "le "}<b>${f}</b>.`, "", opts, f, o => svgForme(o, c), aide[f]);
    } });

  add({ id: "m_couleurs", matiere: "sciences", titre: "Les couleurs", desc: "Rouge, bleu, jaune, vert…", niveaux: [0, 1], nb: NB_MAT,
    gen(n) {
      const pool = Object.keys(COUL).slice(0, n === 0 ? 4 : 10);
      const c = pick(pool), opts = [c, ...autres(c, pool, n === 0 ? 2 : 3)];
      return imgQ(`Touche le rond <b>${c}</b>.`, "", opts, c, o => svgForme("rond", COUL[o][0]), `C'est le ${c}, comme ${COUL[c][1]}.`);
    } });

  add({ id: "m_grand_petit", matiere: "maths", titre: "Grand ou petit ?", desc: "Le plus grand, le plus petit", niveaux: [0, 1], nb: NB_MAT,
    gen() {
      const [e, nom, g] = pick([["🎈", "ballon", "m"], ["🍎", "pomme", "f"], ["🐟", "poisson", "m"], ["⭐", "étoile", "f"], ["🚗", "voiture", "f"], ["🐻", "ours", "m"], ["🌳", "arbre", "m"], ["🐘", "éléphant", "m"]]);
      const grand = Math.random() < .5;
      const det = g === "f" ? "la plus" : "le plus", adj = grand ? (g === "f" ? "grande" : "grand") : (g === "f" ? "petite" : "petit");
      const taille = { grand: 88, moyen: 54, petit: 28 };
      return imgQ(`Touche ${det} <b>${adj}</b> ${nom}.`, "", ["grand", "moyen", "petit"], grand ? "grand" : "petit", o => emo(e, taille[o]),
        grand ? `Le plus grand prend le plus de place.` : `Le plus petit prend le moins de place.`);
    } });

  add({ id: "m_plus_moins", matiere: "maths", titre: "Plus ou moins ?", desc: "Où y en a-t-il le plus ?", niveaux: [1, 2], nb: NB_MAT,
    gen(n) {
      const [e, nom] = pick([["🍓", "fraises"], ["⭐", "étoiles"], ["🐟", "poissons"], ["🍪", "gâteaux"], ["🐞", "coccinelles"], ["🎈", "ballons"]]);
      const nbG = n === 1 ? 2 : 3, max = n === 1 ? 5 : 8;
      let cs; do { cs = shuffle(Array.from({ length: max }, (_, i) => i + 1)).slice(0, nbG); } while (n === 1 && Math.abs(cs[0] - cs[1]) < 2);
      const plus = n === 1 || Math.random() < .6;
      const k = plus ? Math.max(...cs) : Math.min(...cs);
      const opts = cs.map(c => `${c} ${nom}`);
      return imgQ(`Où y a-t-il le <b>${plus ? "plus" : "moins"}</b> de ${nom} ?`, "", opts, `${k} ${nom}`,
        o => `<span class="groupe">${Array(parseInt(o)).fill(e).join("")}</span>`, `Ici, il y en a ${k} : c'est ${plus ? "le plus" : "le moins"}.`);
    } });

  add({ id: "m_suites", matiere: "maths", titre: "Les suites", desc: "Qu'est-ce qui vient après ?", niveaux: [1, 2], nb: NB_MAT,
    gen(n) {
      const formes = ["rond", "carré", "triangle", "étoile"], couls = ["rouge", "bleu", "jaune", "vert"];
      const cs = shuffle(couls), elts = shuffle(formes).map((f, i) => `${f} ${cs[i]}`);
      const motifs = n === 1 ? ["AB"] : ["AB", "ABB", "AAB", "ABC"];
      const m = pick(motifs), lettres = { A: elts[0], B: elts[1], C: elts[2] };
      const longueur = m.length === 2 ? 5 : m.length * 2;
      const suite = Array.from({ length: longueur + 1 }, (_, i) => lettres[m[i % m.length]]);
      const bonne = suite[longueur];
      const opts = [...new Set([...Object.values(lettres).slice(0, new Set(m).size), elts[3]])];
      const r = o => { const [f, c] = [o.slice(0, o.indexOf(" ")), o.slice(o.indexOf(" ") + 1)]; return svgForme(f, COUL[c][0], 72); };
      const rs = o => { const [f, c] = [o.slice(0, o.indexOf(" ")), o.slice(o.indexOf(" ") + 1)]; return svgForme(f, COUL[c][0], 46); };
      return imgQ("Qu'est-ce qui vient après ?", suite.slice(0, longueur).map(rs).join("") + `<span class="case-vide">?</span>`, opts, bonne, r,
        `On répète : ${suite.slice(0, m.length).join(", ")}… Après, c'est le ${bonne}.`, "suite");
    } });

  const MOTS_LETTRES = { A: "avion", B: "ballon", C: "cadeau", D: "domino", E: "école", F: "fraise", G: "gâteau", H: "hibou", I: "île", J: "jus", K: "kiwi", L: "lapin", M: "maman",
    N: "nuage", O: "orange", P: "papa", Q: "quatre", R: "robot", S: "soleil", T: "tomate", U: "usine", V: "vélo", W: "wagon", X: "xylophone", Y: "yaourt", Z: "zèbre" };
  add({ id: "m_lettres", matiere: "francais", titre: "Les lettres", desc: "Reconnaître les lettres capitales", niveaux: [1, 2], nb: NB_MAT,
    gen(n) {
      const pool = n === 1 ? "AEIOUMLPRST".split("") : Object.keys(MOTS_LETTRES);
      const l = pick(pool), opts = [l, ...autres(l, pool, n === 1 ? 2 : 3)];
      return imgQ(`Touche la lettre <b>${l}</b>.`, "", opts, l, o => `<span class="lettre">${o}</span>`, `C'est le ${l}, comme dans « ${MOTS_LETTRES[l]} ».`);
    } });

  const PREMIER_SON = [["🐰", "lapin", "L"], ["🦁", "lion", "L"], ["🌙", "lune", "L"], ["🐭", "souris", "S"], ["☀️", "soleil", "S"], ["🐍", "serpent", "S"], ["🐄", "vache", "V"], ["🚲", "vélo", "V"],
    ["🐑", "mouton", "M"], ["🏠", "maison", "M"], ["🐟", "poisson", "P"], ["🍐", "poire", "P"], ["🍓", "fraise", "F"], ["🔥", "feu", "F"], ["🐢", "tortue", "T"], ["🍅", "tomate", "T"],
    ["🚂", "train", "T"], ["🦊", "renard", "R"], ["🤖", "robot", "R"], ["🌹", "rose", "R"], ["🍌", "banane", "B"], ["🎈", "ballon", "B"], ["🍊", "orange", "O"], ["✈️", "avion", "A"],
    ["🐝", "abeille", "A"], ["🎁", "cadeau", "C"], ["🐸", "grenouille", "G"], ["🎂", "gâteau", "G"], ["🥝", "kiwi", "K"], ["🍉", "pastèque", "P"]];
  add({ id: "m_premier_son", matiere: "francais", titre: "Le premier son", desc: "Par quel son commence le mot ?", niveaux: [2, 3], nb: NB_MAT,
    gen(n) {
      const [e, mot, l] = pick(PREMIER_SON);
      const pool = [...new Set(PREMIER_SON.map(x => x[2]))];
      const opts = [l, ...autres(l, pool, n === 2 ? 2 : 3)];
      return imgQ(`Par quel son commence le mot <b data-say="${mot}">${mot}</b> ?`, emo(e), opts, l, o => `<span class="lettre">${o}</span>`,
        `${mot.charAt(0).toUpperCase() + mot.slice(1)} commence par la lettre ${l}.`);
    } });

  const CRIS = [["vache", "🐄", "meuh"], ["chat", "🐱", "miaou"], ["chien", "🐶", "ouaf ouaf"], ["mouton", "🐑", "bêê"], ["canard", "🦆", "coin-coin"], ["coq", "🐓", "cocorico"],
    ["cochon", "🐷", "groin-groin"], ["grenouille", "🐸", "croâ"], ["lion", "🦁", "grrr"], ["abeille", "🐝", "bzzz"], ["hibou", "🦉", "hou hou"], ["serpent", "🐍", "sss"]];
  const BEBES = [["poussin", "poule", "🐔"], ["veau", "vache", "🐄"], ["agneau", "brebis", "🐑"], ["chaton", "chatte", "🐱"], ["chiot", "chienne", "🐶"], ["porcelet", "truie", "🐷"],
    ["caneton", "cane", "🦆"], ["poulain", "jument", "🐴"]];
  add({ id: "m_animaux", matiere: "sciences", titre: "Les animaux", desc: "Leurs cris et leurs bébés", niveaux: [0, 2], nb: NB_MAT,
    gen(n) {
      const nbAutres = n === 0 ? 2 : 3;
      if (n === 2 && Math.random() < .5) {
        const [bebe, maman] = pick(BEBES), img = Object.fromEntries(BEBES.map(b => [b[1], b[2]]));
        const opts = [maman, ...autres(maman, BEBES.map(b => b[1]), nbAutres)];
        return imgQ(`Qui est la maman du <b>${bebe}</b> ?`, "", opts, maman, o => emo(img[o]), `Le ${bebe} est le bébé de la ${maman}.`);
      }
      const [nom, e, cri] = pick(CRIS), img = Object.fromEntries(CRIS.map(c => [c[0], c[1]]));
      const opts = [nom, ...autres(nom, CRIS.map(c => c[0]), nbAutres)];
      return imgQ(`Quel animal fait <b>« ${cri} »</b> ?`, "", opts, nom, o => emo(img[o]), `C'est ${nom === "abeille" ? "l'" : nom === "vache" || nom === "grenouille" ? "la " : "le "}${nom} qui fait « ${cri} ».`);
    } });

  const SENS = [["Avec quoi sens-tu le parfum des fleurs ?", "nez", "👃"], ["Avec quoi entends-tu la musique ?", "oreille", "👂"], ["Avec quoi regardes-tu les images ?", "yeux", "👀"],
    ["Avec quoi goûtes-tu ta soupe ?", "langue", "👅"], ["Avec quoi caresses-tu ton doudou ?", "main", "✋"]];
  add({ id: "m_corps", matiere: "sciences", titre: "Mon corps", desc: "Les cinq sens", niveaux: [1, 2], nb: NB_MAT,
    gen(n) {
      const [q, bonne] = pick(SENS), img = Object.fromEntries(SENS.map(s => [s[1], s[2]]));
      const opts = [bonne, ...autres(bonne, SENS.map(s => s[1]), n === 1 ? 2 : 3)];
      const art = { nez: "le nez", oreille: "les oreilles", yeux: "les yeux", langue: "la langue", main: "les mains" };
      return imgQ(q, "", opts, bonne, o => emo(img[o]), `On utilise ${art[bonne]}.`);
    } });

  const METEO = [["Il neige ! Que mets-tu autour du cou ?", "❄️", "écharpe", "🧣"], ["Il pleut. Que prends-tu pour rester au sec ?", "🌧️", "parapluie", "☂️"],
    ["Le soleil brille très fort. Que mets-tu sur tes yeux ?", "☀️", "lunettes de soleil", "🕶️"], ["Il y a des flaques d'eau. Que mets-tu à tes pieds ?", "💧", "bottes", "👢"],
    ["Il fait très chaud. Que mets-tu sur ta tête ?", "☀️", "chapeau", "👒"], ["Il fait froid. Que mets-tu sur tes mains ?", "❄️", "gants", "🧤"]];
  add({ id: "m_meteo", matiere: "sciences", titre: "Le temps qu'il fait", desc: "S'habiller selon la météo", niveaux: [1, 2], nb: NB_MAT,
    gen() {
      const [q, m, bonne] = pick(METEO), img = Object.fromEntries(METEO.map(x => [x[2], x[3]]));
      const opts = [bonne, ...autres(bonne, [...new Set(METEO.map(x => x[2]))], 2)];
      return imgQ(q, emo(m), opts, bonne, o => emo(img[o]), `Il faut mettre ${bonne === "lunettes de soleil" || bonne === "bottes" || bonne === "gants" ? "des " : bonne === "écharpe" ? "une " : "un "}${bonne}.`);
    } });

  const MOMENTS = [["Quand dort-on dans son lit ?", "la nuit", "🌙"], ["Quand le soleil se lève-t-il ?", "le matin", "🌅"], ["Quand mange-t-on le goûter ?", "l'après-midi", "🍪"],
    ["Quand tombe la neige ?", "l'hiver", "⛄"], ["Quand les fleurs poussent-elles ?", "le printemps", "🌷"], ["Quand va-t-on à la plage ?", "l'été", "🏖️"], ["Quand les feuilles tombent-elles des arbres ?", "l'automne", "🍂"]];
  add({ id: "m_temps", matiere: "sciences", titre: "Le temps qui passe", desc: "Jour, nuit, saisons", niveaux: [0, 2], nb: NB_MAT,
    gen(n) {
      const pool = n === 0 ? MOMENTS.slice(0, 3) : MOMENTS;
      const [q, bonne] = pick(pool), img = Object.fromEntries(MOMENTS.map(m => [m[1], m[2]]));
      const memeGroupe = MOMENTS.indexOf(MOMENTS.find(m => m[1] === bonne)) < 3 ? MOMENTS.slice(0, 3) : MOMENTS.slice(3);
      const opts = [bonne, ...autres(bonne, memeGroupe.map(m => m[1]), n === 0 ? 2 : Math.min(3, memeGroupe.length - 1))];
      return imgQ(q, "", opts, bonne, o => emo(img[o]), `C'est ${bonne}.`);
    } });

  // ---------- export ----------
  window.EXOS = { NIVEAUX, CYCLES, EX, parseNum, norm, fmt,
    pourNiveau: n => EX.filter(e => n >= e.niveaux[0] && n <= e.niveaux[1]),
    get: id => EX.find(e => e.id === id),
    _conj: conj };
})();
