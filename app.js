/* Aide aux Devoirs — interface */
(function () {
  "use strict";
  const { NIVEAUX, CYCLES } = window.EXOS;
  const $ = (s, el = document) => el.querySelector(s);
  const app = $("#app");
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const uid = () => Math.random().toString(36).slice(2, 10);
  const COULEURS = ["#2b56cf", "#cf3c35", "#178f62", "#7a48c9", "#d9822b", "#c2387a", "#1f8a9a", "#5d6a1f"];
  const MATIERES = { langues: ["Langues du monde", "var(--langues)"], maths: ["Mathématiques", "var(--maths)"], francais: ["Français", "var(--francais)"], anglais: ["Anglais", "var(--anglais)"],
    espagnol: ["Espagnol", "var(--espagnol)"], allemand: ["Allemand", "var(--allemand)"], histoire: ["Histoire", "var(--histoire)"], geographie: ["Géographie", "var(--geographie)"],
    sciences: ["Sciences & SVT", "var(--sciences)"], physique: ["Physique-chimie", "var(--physique)"], emc: ["EMC", "var(--emc)"], ses: ["SES", "var(--ses)"], philo: ["Philosophie", "var(--philo)"], arts: ["Arts et musique", "var(--arts)"] };
  const MODELES = [["claude-sonnet-5-5", "Claude Sonnet 5.5 — recommandé"], ["claude-haiku-5-5", "Claude Haiku 5.5 — plus rapide, moins cher"], ["claude-opus-5-5", "Claude Opus 5.5 — le plus fort, plus cher"]];

  const ICO = {
    etoile: '<svg viewBox="0 0 24 24" class="icone" aria-hidden="true"><path fill="currentColor" d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z"/></svg>',
    son: '<svg viewBox="0 0 24 24" class="icone" aria-hidden="true"><path fill="currentColor" d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
    photo: '<svg viewBox="0 0 24 24" class="icone" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M4 7h3l2-3h6l2 3h3v12H4z"/><circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    envoyer: '<svg viewBox="0 0 24 24" class="icone" aria-hidden="true"><path fill="currentColor" d="M3 20l18-8L3 4v6l12 2-12 2z"/></svg>',
    retour: '<svg viewBox="0 0 24 24" class="icone" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M15 5l-7 7 7 7"/></svg>',
    plume: '<svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true"><path d="M38 6C22 8 13 19 11 36l4 1c1-5 3-9 6-12 0 0 7-1 11-6-3 0-6 0-8-1 5 0 10-2 13-7-2 0-4 0-6-1 4-1 6-3 7-4z" fill="var(--ia)"/><path d="M8 42l7-7" stroke="var(--ia)" stroke-width="3" stroke-linecap="round"/></svg>',
  };
  const etoiles = n => `<span class="etoiles" aria-label="${n} étoile${n > 1 ? "s" : ""} sur 3">${[0, 1, 2].map(i => `<span class="${i < n ? "" : "vide"}">${ICO.etoile}</span>`).join("")}</span>`;
  const nbEtoiles = (c, t) => { const r = c / t; return r >= .9 ? 3 : r >= .7 ? 2 : r >= .5 ? 1 : 0; };

  // ===================== données =====================
  const EN_LIGNE = !!window.AIDE_EN_LIGNE;   // version publiée sur GitHub Pages (sans le PC)
  let D = { version: 3, reglages: { cle: "", modele: MODELES[0][0], strict: true, pin: "", lectureAuto: true }, enfants: [], stats: {}, historique: {}, cartable: {}, journal: {}, defis: {}, badges: {}, langues: {}, lectures: {} };
  let enfant = null;       // enfant en cours
  let deverrouille = false;
  // Compte personnel : l'icône d'un enfant ouvre l'application avec ?enfant=<id>, directement dans son compte.
  const COMPTE = new URLSearchParams(location.search).get("enfant");
  const enfantDuCompte = () => COMPTE ? D.enfants.find(e => e.id === COMPTE) : null;
  let saveTimer;
  async function charger() {
    if (!EN_LIGNE) {
      try {
        const r = await fetch("api/data"); if (!r.ok) throw 0; pcJoignable = true;
        const t = await r.text(), j = JSON.parse(t);
        if (j && j.version) { D = Object.assign(D, j); if (!nuage) base = unites(JSON.parse(t)); }
      }
      catch { try { const j = JSON.parse(localStorage.getItem("aide-devoirs") || "null"); if (j) D = Object.assign(D, j); } catch { } }
    }
    if (nuage || EN_LIGNE) {
      const m = await memoireLire();   // copie gardée sur cet appareil (cahiers + état de la synchronisation)
      if (m && EN_LIGNE) D = Object.assign(D, JSON.parse(m.d));
      if (m && nuage && m.depot === depotNuage()) base = new Map(m.base || []);
      else if (EN_LIGNE && nuage && !(m && m.depot)) { try { await premiereVenue(); } catch { premiereRatee = true; } }
    }
    D.reglages = Object.assign({ cle: "", modele: MODELES[0][0], strict: true, pin: "", lectureAuto: true }, D.reglages);
    if (migrer(D)) sauver();
  }
  // Version 1 : les classes allaient du CP (0) à la Terminale (11). Version 2 : de la PS (0) à la Terminale (14).
  // Version 3 : cartable, journal d'activité, défis et badges.
  function migrer(d) {
    let change = false;
    if (!(d.version >= 2)) { (d.enfants || []).forEach(e => e.niveau = Math.min(NIVEAUX.length - 1, (+e.niveau || 0) + 3)); d.version = 2; change = true; }
    for (const k of ["stats", "historique", "cartable", "journal", "defis", "badges", "langues", "lectures"]) if (!d[k]) { d[k] = {}; change = true; }
    (d.enfants || []).forEach((e, i) => { if (!e.avatar) { e.avatar = AVATARS[i % AVATARS.length]; change = true; } if (e.xp == null) { e.xp = 0; change = true; } });
    if (d.version < 3) { d.version = 3; change = true; }
    return change;
  }
  const maternelle = () => !!enfant && enfant.niveau <= 2;
  const LAB_MAT = { maths: "Nombres et formes", francais: "Lettres et sons", sciences: "Explorer le monde" };
  const lab = m => maternelle() && LAB_MAT[m] ? LAB_MAT[m] : MATIERES[m] ? MATIERES[m][0] : "Révision avec Plume";
  // Synchronisation entre le PC et les tablettes (même Wi-Fi) : les données sont découpées en « unités »
  // (réglages, chaque enfant, la partie de chaque enfant dans stats, historique…). Chaque appareil n'envoie
  // que les unités qu'il a changées et reprend celles changées ailleurs : deux enfants sur deux appareils
  // ne s'effacent pas leurs progrès.
  const SECTIONS = ["stats", "historique", "cartable", "journal", "defis", "badges", "langues", "lectures"];
  // base : « signature » de chaque unité lors de la dernière synchronisation
  // (le texte JSON avec le PC, l'empreinte Git avec GitHub).
  let base = new Map(), pcJoignable = false, synchro = null, syncTimer, premiereRatee = false;
  function unites(d) {
    const u = new Map(), mettre = (c, v) => { const j = JSON.stringify(v); if (j !== undefined) u.set(c, j); };
    for (const k of Object.keys(d)) {
      if (k === "enfants") { mettre("ordre", (d.enfants || []).map(e => e.id)); (d.enfants || []).forEach(e => mettre("enfant\u0001" + e.id, e)); }
      else if (SECTIONS.includes(k) && d[k] && typeof d[k] === "object") for (const id of Object.keys(d[k])) mettre(k + "\u0001" + id, d[k][id]);
      else mettre(k, d[k]);
    }
    return u;
  }
  function poser(cle, json) {   // applique dans D une unité venue d'un autre appareil (json absent = supprimée)
    const [k, id] = cle.split("\u0001"), v = json === undefined ? undefined : JSON.parse(json);
    if (k === "ordre") { if (v) { const rang = new Map(v.map((x, i) => [x, i])); D.enfants.sort((a, b) => (rang.get(a.id) ?? 1e9) - (rang.get(b.id) ?? 1e9)); } return; }
    if (k === "enfant") {
      const i = D.enfants.findIndex(e => e.id === id);
      if (v === undefined) { if (i >= 0) D.enfants.splice(i, 1); }
      else if (i >= 0) { const e = D.enfants[i]; for (const c of Object.keys(e)) if (!(c in v)) delete e[c]; Object.assign(e, v); }   // même objet : l'enfant en cours reste à jour
      else D.enfants.push(v);
      return;
    }
    if (id !== undefined) { if (v === undefined) { if (D[k]) delete D[k][id]; } else (D[k] = D[k] || {})[id] = v; return; }
    if (v === undefined) delete D[k]; else D[k] = v;
  }
  const pause = ms => new Promise(ok => setTimeout(ok, ms));
  const ordreFin = (a, b) => (a === "ordre") - (b === "ordre");   // l'ordre des enfants en dernier

  // --- le PC (serveur de l'exe) ---
  async function pcLire() {
    const r = await fetch("api/data"); if (!r.ok) throw new Error("lecture");
    const sigs = unites(await r.json());
    return { sigs, rev: r.headers.get("X-Rev") || "", valeur: async c => sigs.get(c) };
  }
  async function pcEcrire(dist) {
    const p = await fetch("api/data", { method: "POST", headers: { "Content-Type": "application/json", "X-Rev": dist.rev }, body: JSON.stringify(D) });
    if (p.status === 409) return "conflit";   // un autre appareil vient d'enregistrer
    if (!p.ok) throw new Error("écriture");
    return "ok";
  }

  // Renvoie true si des changements venus d'un autre appareil ont été appliqués.
  function synchroniser() {
    const mode = nuage ? "nuage" : pcJoignable ? "pc" : null;
    if (!mode) return Promise.resolve(false);
    if (synchro) return synchro.then(() => synchroniser(), () => synchroniser());
    synchro = (async () => {
      let recu = false;
      for (let essai = 0; essai < 6; essai++) {
        const dist = mode === "nuage" ? await nuageLire() : await pcLire();
        const locJ = unites(D), loc = new Map();
        for (const [c, j] of locJ) loc.set(c, await signer(j));
        // Premier passage avec GitHub : ce qui existe des deux côtés est repris de GitHub, le reste est envoyé.
        if (mode === "nuage" && !base.size) for (const c of loc.keys()) if (dist.sigs.has(c)) base.set(c, loc.get(c));
        // Garde-fou : on n'efface jamais d'un coup tous les enfants (appareil mal chargé).
        const enfantsIci = [...loc.keys()].some(c => c.startsWith("enfant")), enfantsAvant = [...base.keys()].some(c => c.startsWith("enfant"));
        if (!enfantsIci && enfantsAvant) throw new Error("synchronisation suspendue : aucun enfant ici");
        const cles = [...new Set([...loc.keys(), ...base.keys(), ...dist.sigs.keys()])].sort(ordreFin);
        const changes = [], aPrendre = [];
        for (const c of cles) {
          if (loc.get(c) !== base.get(c)) { if (loc.get(c) !== dist.sigs.get(c)) changes.push(c); }   // changé ici : on garde
          else if (dist.sigs.get(c) !== loc.get(c)) aPrendre.push(c);                                  // changé ailleurs : on reprend
        }
        const vals = await Promise.all(aPrendre.map(c => dist.sigs.has(c) ? dist.valeur(c) : undefined));
        aPrendre.forEach((c, i) => poser(c, vals[i])); if (aPrendre.length) recu = true;
        if (changes.length) {
          const r = mode === "nuage" ? await nuageEcrire(dist, changes.map(c => [c, locJ.get(c)])) : await pcEcrire(dist);
          if (r === "conflit") { await pause(300 + Math.random() * 900); continue; }
        }
        base = new Map(dist.sigs);
        for (const c of changes) { if (loc.has(c)) base.set(c, loc.get(c)); else base.delete(c); }
        memoriser();
        if (mode === "nuage" && aPrendre.length && pcJoignable) copiePC();
        return recu;
      }
      throw new Error("conflits");
    })().finally(() => { synchro = null; });
    return synchro;
  }
  // Avec GitHub, le PC garde quand même une copie de secours à jour dans donnees.json.
  const copiePC = () => fetch("api/data", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(D) }).catch(() => { });
  function sauver() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      memoriser();
      if (!EN_LIGNE && !pcJoignable) { try { localStorage.setItem("aide-devoirs", JSON.stringify(D)); } catch { } }
      if (nuage && pcJoignable) copiePC();
      clearTimeout(syncTimer);
      syncTimer = setTimeout(() => synchroniser().catch(() => { }), nuage ? 3000 : 0);   // GitHub : on regroupe les changements
    }, 250);
  }
  // Toutes les 30 s (et quand on revient sur l'appli), on reprend ce qui a été fait sur les autres appareils.
  // Si l'écran des cahiers est affiché, on le redessine (nouvel enfant, étoiles…).
  function rafraichir() { synchroniser().then(r => { if (r && !enfant && $("#app .couvertures")) ecranEnfants(); }).catch(() => { }); }
  const ping = () => { if (!EN_LIGNE) fetch("api/ping").catch(() => { }); };
  setInterval(() => { ping(); rafraichir(); }, 30000); ping();
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") { ping(); rafraichir(); }
    else if (nuage) { clearTimeout(syncTimer); synchroniser().catch(() => { }); }   // l'appli passe en arrière-plan : on envoie tout de suite
  });
  const surLePC = !EN_LIGNE && ["127.0.0.1", "localhost", "[::1]"].includes(location.hostname);

  // --- copie des cahiers sur l'appareil (version en ligne et synchronisation GitHub) ---
  function memoireBase() {
    return new Promise((ok, ko) => { try { const r = indexedDB.open("aide-devoirs-memoire", 1); r.onupgradeneeded = () => r.result.createObjectStore("kv"); r.onsuccess = () => ok(r.result); r.onerror = () => ko(r.error); } catch (e) { ko(e); } });
  }
  async function memoireLire() {
    try { const db = await memoireBase(); return await new Promise(ok => { const q = db.transaction("kv").objectStore("kv").get("cahiers"); q.onsuccess = () => ok(q.result || null); q.onerror = () => ok(null); }); } catch { return null; }
  }
  async function memoriser() {
    if (!nuage && !EN_LIGNE) return;
    try { const db = await memoireBase(), v = { d: JSON.stringify(D), base: nuage ? [...base] : null, depot: depotNuage() }; db.transaction("kv", "readwrite").objectStore("kv").put(v, "cahiers"); } catch { }
  }

  // ===================== Synchronisation par GitHub (dépôt privé) =====================
  // Chaque unité est un petit fichier d/<clé en hexadécimal>.json dans la branche « donnees » du dépôt privé ;
  // chaque son ajouté par un parent : s/<clé>.son (+ s/<clé>.json pour ses informations).
  // Un enregistrement = un commit ; si un autre appareil a écrit entre-temps, GitHub refuse et on recommence.
  const DEPOT = { o: "enzo2122-lgtm", r: "aide-aux-devoirs", b: "donnees" };
  const URL_EN_LIGNE = "https://enzo2122-lgtm.github.io/devoirs/";
  const PAQUET_AR = "paquet:dico-ar";   // gros paquet de sons arabes : intégré à la version en ligne, jamais envoyé sur GitHub
  let nuage = null;
  try { nuage = JSON.parse(localStorage.getItem("aide-nuage") || "null"); } catch { }
  {   // lien d'installation (QR code) : …#nuage={o,r,b,t}
    const m = /[#&]nuage=([^&]+)/.exec(location.hash);
    if (m) {
      try { const c = JSON.parse(decodeURIComponent(m[1])); if (c.o && c.r && c.t) activerNuage(c); } catch { }
      history.replaceState(null, "", location.pathname + location.search);
    }
  }
  function activerNuage(c) {
    nuage = { o: c.o, r: c.r, b: c.b || "donnees", t: c.t };
    try { localStorage.setItem("aide-nuage", JSON.stringify(nuage)); } catch { }
  }
  const depotNuage = () => nuage ? `${nuage.o}/${nuage.r}#${nuage.b}` : "";
  async function gh(chemin, o = {}, cfg = nuage) {
    let r;
    try {
      r = await fetch(`https://api.github.com/repos/${cfg.o}/${cfg.r}${chemin ? "/" + chemin : ""}`, { method: o.method || "GET", cache: "no-store",
        headers: Object.assign({ Authorization: "Bearer " + cfg.t, Accept: "application/vnd.github+json" }, o.body ? { "Content-Type": "application/json" } : {}), body: o.body ? JSON.stringify(o.body) : undefined });
    } catch { throw new Error("Pas de connexion Internet."); }
    if (o.absent && (r.status === 404 || r.status === 409)) return null;
    if (o.conflit && (r.status === 409 || r.status === 422)) return "conflit";
    if (!r.ok) {
      const e = new Error(r.status === 401 ? "Cette clé GitHub n'est pas (ou plus) valable." : r.status === 403 ? "La clé GitHub n'a pas le droit d'écrire : il faut « Contents : Read and write »." : r.status === 404 ? `Cette clé ne donne pas accès au dépôt ${cfg.r}.` : "GitHub ne répond pas (" + r.status + ").");
      e.status = r.status; throw e;
    }
    return r.status === 204 ? null : r.json();
  }
  const hexa = s => [...new TextEncoder().encode(s)].map(b => b.toString(16).padStart(2, "0")).join("");
  const dehexa = h => new TextDecoder().decode(new Uint8Array(h.match(/../g).map(x => parseInt(x, 16))));
  const b64VersOctets = s => { const t = atob(s.replace(/\s/g, "")), o = new Uint8Array(t.length); for (let i = 0; i < t.length; i++) o[i] = t.charCodeAt(i); return o; };
  const octetsVersB64 = o => { let t = ""; for (let i = 0; i < o.length; i += 0x8000) t += String.fromCharCode.apply(null, o.subarray(i, i + 0x8000)); return btoa(t); };
  async function shaGit(octets) {
    const t = new TextEncoder().encode(`blob ${octets.length}\0`), b = new Uint8Array(t.length + octets.length); b.set(t); b.set(octets, t.length);
    return [...new Uint8Array(await crypto.subtle.digest("SHA-1", b))].map(x => x.toString(16).padStart(2, "0")).join("");
  }
  const sigCache = new Map();
  async function signer(json) {
    if (!nuage) return json;
    let s = sigCache.get(json);
    if (!s) { s = await shaGit(new TextEncoder().encode(json)); if (sigCache.size > 3000) sigCache.clear(); sigCache.set(json, s); }
    return s;
  }
  let arbre = null;   // { commit, tree, entrees: Map chemin → sha, le }
  async function nuageArbre(frais) {
    if (!frais && arbre && Date.now() - arbre.le < 15000) return arbre;
    const ref = await gh(`git/ref/heads/${nuage.b}`, { absent: true }), commit = ref && ref.object.sha;
    if (!commit) return arbre = { commit: null, tree: null, entrees: new Map(), le: Date.now() };
    if (arbre && arbre.commit === commit) { arbre.le = Date.now(); return arbre; }
    const c = await gh(`git/commits/${commit}`), t = await gh(`git/trees/${c.tree.sha}?recursive=1`);
    return arbre = { commit, tree: c.tree.sha, entrees: new Map(t.tree.filter(e => e.type === "blob").map(e => [e.path, e.sha])), le: Date.now() };
  }
  const blobsLus = new Map();
  function lireBlobTexte(sha) {
    if (!blobsLus.has(sha)) { const p = gh(`git/blobs/${sha}`).then(b => new TextDecoder().decode(b64VersOctets(b.content))); blobsLus.set(sha, p); p.catch(() => blobsLus.delete(sha)); }
    return blobsLus.get(sha);
  }
  async function nuageCommit(a, entrees, message) {   // "conflit" si un autre appareil a écrit depuis la lecture de a
    if (!a.tree) entrees = entrees.filter(e => e.sha !== null);
    if (!entrees.length) return "ok";
    const t = await gh("git/trees", { method: "POST", body: a.tree ? { base_tree: a.tree, tree: entrees } : { tree: entrees } });
    const c = await gh("git/commits", { method: "POST", body: { message, tree: t.sha, parents: a.commit ? [a.commit] : [] } });
    const r = a.commit ? await gh(`git/refs/heads/${nuage.b}`, { method: "PATCH", body: { sha: c.sha, force: false }, conflit: true })
      : await gh("git/refs", { method: "POST", body: { ref: `refs/heads/${nuage.b}`, sha: c.sha }, conflit: true });
    arbre = null;
    return r === "conflit" ? "conflit" : "ok";
  }
  async function nuageLire() {
    const a = await nuageArbre(true), sigs = new Map();
    for (const [p, sha] of a.entrees) { const m = /^d\/([0-9a-f]+)\.json$/.exec(p); if (m) sigs.set(dehexa(m[1]), sha); }
    return { sigs, arbre: a, valeur: c => lireBlobTexte(sigs.get(c)) };
  }
  function nuageEcrire(dist, liste) {
    const entrees = [];
    for (const [c, json] of liste) {
      const p = `d/${hexa(c)}.json`;
      if (json !== undefined) entrees.push({ path: p, mode: "100644", type: "blob", content: json });
      else if (dist.arbre.entrees.has(p)) entrees.push({ path: p, mode: "100644", type: "blob", sha: null });
    }
    return nuageCommit(dist.arbre, entrees, "Progrès des enfants");
  }
  // Nouvel appareil : on part entièrement des cahiers gardés sur GitHub.
  async function premiereVenue() {
    const dist = await nuageLire(), cles = [...dist.sigs.keys()].sort(ordreFin), vals = await Promise.all(cles.map(c => dist.valeur(c)));
    cles.forEach((c, i) => poser(c, vals[i]));
    base = new Map(dist.sigs); await memoriser();
  }
  // Vérifie une clé avant de l'enregistrer.
  async function verifierNuage(c) {
    if (!/^(github_pat_|ghp_)/.test(c.t)) throw new Error("Ce n'est pas une clé GitHub : elle commence par github_pat_.");
    await gh("", {}, c);
  }
  // Sons des parents sur GitHub (gardés aussi sur l'appareil, rangés par empreinte).
  const cheminSon = (cle, ext) => `s/${hexa(cle)}.${ext}`;
  async function nuageInfosSons() {
    const a = await nuageArbre(), res = {};
    await Promise.all([...a.entrees].filter(([p]) => /^s\/[0-9a-f]+\.json$/.test(p)).map(async ([p, sha]) => { try { res[dehexa(p.slice(2, -5))] = JSON.parse(await lireBlobTexte(sha)); } catch { } }));
    return res;
  }
  async function nuageLireSon(cle) {
    const a = await nuageArbre(), sha = a.entrees.get(cheminSon(cle, "son")), shaM = a.entrees.get(cheminSon(cle, "json"));
    if (!sha || !shaM) return null;
    const m = JSON.parse(await lireBlobTexte(shaM));
    let oct = (await chantLocal("sha:" + sha))?.oct;
    if (!oct) { oct = b64VersOctets((await gh(`git/blobs/${sha}`)).content); chantOp("readwrite", s => s.put({ oct }, "sha:" + sha)).catch(() => { }); }
    const v = Object.assign({}, m); delete v._type; delete v._bin;
    if (m._bin === "buf") v.buf = oct.slice().buffer; else v.blob = new Blob([oct], { type: m._type || "" });
    return v;
  }
  async function nuageEcrireSon(cle, meta, donnee) {   // donnee : Blob ou ArrayBuffer ; null = supprimer
    let shaSon = null;
    if (donnee) {
      const oct = new Uint8Array(donnee instanceof Blob ? await donnee.arrayBuffer() : donnee);
      shaSon = (await gh("git/blobs", { method: "POST", body: { content: octetsVersB64(oct), encoding: "base64" } })).sha;
      chantOp("readwrite", s => s.put({ oct }, "sha:" + shaSon)).catch(() => { });
    }
    for (let essai = 0; essai < 6; essai++) {
      const a = await nuageArbre(true), e = [];
      if (donnee) e.push({ path: cheminSon(cle, "son"), mode: "100644", type: "blob", sha: shaSon }, { path: cheminSon(cle, "json"), mode: "100644", type: "blob", content: JSON.stringify(meta) });
      else for (const x of ["son", "json"]) if (a.entrees.has(cheminSon(cle, x))) e.push({ path: cheminSon(cle, x), mode: "100644", type: "blob", sha: null });
      if (await nuageCommit(a, e, donnee ? "Son ajouté" : "Son supprimé") === "ok") return;
      await pause(300 + Math.random() * 900);
    }
    throw new Error("GitHub est occupé, réessayez dans un instant.");
  }
  // Une fois, sur le PC : envoie sur GitHub les sons déjà enregistrés sur le PC.
  async function migrerSonsNuage() {
    if (!nuage || EN_LIGNE) return;
    const drapeau = "sons-nuage:" + depotNuage();
    try { if (localStorage.getItem(drapeau) === "1") return; } catch { }
    const deja = await nuageInfosSons(), cles = [...await clesChantsPC()].filter(c => c !== PAQUET_AR && !deja[c]);
    for (const c of cles) { const v = await chantLirePC(c); if (v && (v.blob || v.buf)) await chantEcrire(c, v); }
    try { localStorage.setItem(drapeau, "1"); } catch { }
  }

  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(t._t); t._t = setTimeout(() => t.hidden = true, 2600); }
  function maths(el) {
    if (window.renderMathInElement) renderMathInElement(el, { delimiters: [{ left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false }, { left: "\\(", right: "\\)", display: false }, { left: "\\[", right: "\\]", display: true }], throwOnError: false });
  }
  function rendre(html) { try { arreterChant(true); } catch { } app.onkeydown = null; app.innerHTML = html; maths(app); app.focus({ preventScroll: true }); window.scrollTo(0, 0); }
  const iaDispo = () => !!D.reglages.cle;
  const age = n => 3 + n;

  function majBarre() {
    $("#enfant-actif").innerHTML = enfant ? `<button class="puce-enfant" id="vers-accueil" type="button" aria-label="Mon accueil"><span class="avatar-mini">${avatar(enfant)}</span><span class="pe-nom">${esc(enfant.prenom)} · ${NIVEAUX[enfant.niveau]}</span><span class="pe-serie" title="Jours de suite"><span class="emo">🔥</span>${serie()}</span><span class="pe-niv">Niv. ${niveauXP(enfant.xp || 0).l}</span></button>` : "";
    if (enfant) $("#vers-accueil").onclick = () => { P?.ctl?.abort(); speechSynthesis?.cancel?.(); ecranAccueil(); };
    document.body.classList.toggle("petits", !!enfant && enfant.niveau <= 4);
    document.body.classList.toggle("maternelle", maternelle());
  }

  // ===================== lecture à voix haute =====================
  function texteParle(html) {
    const d = document.createElement("div"); d.innerHTML = html;
    d.querySelectorAll("[aria-hidden]").forEach(e => e.remove());
    d.querySelectorAll("[data-say]").forEach(e => e.textContent = e.dataset.say);
    let t = d.textContent || "";
    return t.replace(/\\times/g, " fois ").replace(/\\div/g, " divisé par ").replace(/\\;\?\\;|\\;\?/g, " combien ").replace(/\?\\;/g, "combien")
      .replace(/\$/g, "").replace(/\\[a-z]+/g, " ").replace(/[{}]/g, "").replace(/…/g, " ... ").replace(/ - /g, " moins ").replace(/=/g, " égale ").replace(/\s+/g, " ");
  }
  function parler(html) {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texteParle(html)); u.lang = "fr-FR"; u.rate = .92;
    const v = speechSynthesis.getVoices().find(v => v.lang && v.lang.startsWith("fr")); if (v) u.voice = v;
    speechSynthesis.speak(u);
  }

  // ===================== écran : qui travaille ? =====================
  function totalEtoiles(id) { return Object.values(D.stats[id] || {}).reduce((s, x) => s + (x.meilleur || 0), 0); }
  function ecranEnfants() {
    const ec = enfantDuCompte();
    if (ec) { enfant = ec; return ecranAccueil(); }
    enfant = null; majBarre(); document.title = "Aide aux devoirs";
    if (!D.enfants.length) return ecranAjoutEnfant(true);
    if (D.reglages.choixProtege && D.reglages.pin && !deverrouille) {
      rendre(`<section class="page etroite"><div class="feuille sections" style="text-align:center">
        <div class="rangee centre">${enfantsTries().map(e => `<span class="pastille grande" style="--c:${e.couleur}">${avatar(e)}</span>`).join("")}</div>
        <h1>Chacun son compte !</h1>
        <p style="margin:0">Pour faire tes devoirs, ouvre l'application avec <b>l'icône à ton prénom</b> ${surLePC ? "sur le bureau de l'ordinateur" : "sur l'écran de la tablette"}.</p>
        <div class="rangee centre"><button class="btn second" id="parent" type="button">Je suis un parent</button></div></div></section>`);
      $("#parent").onclick = () => avecPin(ecranEnfants);
      return;
    }
    rendre(`<section class="page">
      <div class="entete"><div><h1>Qui fait ses devoirs ?</h1><p class="doux">Choisis ton cahier.</p></div>
        ${D.enfants.length > 1 ? `<div class="rangee"><label class="doux" for="tri">Ranger les cahiers</label><select class="sel" id="tri">${TRIS.map(([k, t]) => `<option value="${k}" ${k === (D.reglages.tri || "perso") ? "selected" : ""}>${t}</option>`).join("")}</select></div>` : ""}</div>
      ${(D.reglages.tri || "perso") === "perso" && D.enfants.length > 1 ? `<p class="doux" style="margin:0">Astuce : fais glisser un cahier pour changer sa place.</p>` : ""}
      <div class="couvertures">
        ${enfantsTries().map(e => `<button class="couverture" style="--c:${e.couleur}" data-id="${e.id}" type="button"${(D.reglages.tri || "perso") === "perso" ? ' draggable="true"' : ""}>
          <span class="couv-haut"><span class="couv-avatar">${avatar(e)}</span><span class="etoiles-total">${ICO.etoile} ${totalEtoiles(e.id)}</span></span>
          <span class="etiquette"><span class="nom">${esc(e.prenom)}</span><span class="classe">Classe de ${NIVEAUX[e.niveau]} · ${CYCLES(e.niveau)}</span></span>
        </button>`).join("")}
        <button class="couverture ajout" id="ajout" type="button"><span style="font-size:2rem">+</span>Ajouter un enfant</button>
      </div></section>`);
    app.querySelectorAll(".couverture[data-id]").forEach(b => {
      b.onclick = () => { enfant = D.enfants.find(e => e.id === b.dataset.id); ecranAccueil(); };
      b.ondragstart = ev => { ev.dataTransfer.setData("text/plain", b.dataset.id); b.classList.add("glisse"); };
      b.ondragend = () => b.classList.remove("glisse");
      b.ondragover = ev => { ev.preventDefault(); b.classList.add("cible"); };
      b.ondragleave = () => b.classList.remove("cible");
      b.ondrop = ev => { ev.preventDefault(); const id = ev.dataTransfer.getData("text/plain"); if (!id || id === b.dataset.id) return;
        const a = D.enfants.findIndex(e => e.id === id), [x] = D.enfants.splice(a, 1), c = D.enfants.findIndex(e => e.id === b.dataset.id);
        D.enfants.splice(c + (a <= c ? 1 : 0), 0, x); sauver(); ecranEnfants(); };
    });
    if ($("#tri")) $("#tri").onchange = e => { D.reglages.tri = e.target.value; sauver(); ecranEnfants(); };
    $("#ajout").onclick = () => avecPin(() => ecranAjoutEnfant(false));
  }

  function formEnfant(e) {
    e = e || { prenom: "", niveau: 6, couleur: COULEURS[D.enfants.length % COULEURS.length] };
    return `<div class="champ"><label for="f-prenom">Prénom</label><input id="f-prenom" maxlength="24" value="${esc(e.prenom)}" autocomplete="off"></div>
      <div class="champ"><label for="f-naiss">Année de naissance <small class="doux">(facultatif, pour ranger par âge)</small></label><input id="f-naiss" type="number" inputmode="numeric" min="2000" max="${new Date().getFullYear()}" value="${e.naissance || ""}" placeholder="Ex. : 2016" style="max-width:180px"></div>
      <div class="champ"><label for="f-niveau">Classe</label><select id="f-niveau">${NIVEAUX.map((n, i) => `<option value="${i}" ${i === e.niveau ? "selected" : ""}>${n} — ${CYCLES(i)}</option>`).join("")}</select></div>
      <div class="champ"><span class="label">Mon personnage</span><div class="avatars">${AVATARS.map((a, i) => `<input type="radio" name="f-av" id="f-a${i}" value="${a}" ${a === (e.avatar || AVATARS[D.enfants.length % AVATARS.length]) ? "checked" : ""}><label for="f-a${i}"><span class="emo">${a}</span></label>`).join("")}</div></div>
      <div class="champ"><span class="label">Couleur du cahier</span><div class="couleurs">${COULEURS.map((c, i) => `<input type="radio" name="f-coul" id="f-c${i}" value="${c}" ${c === e.couleur ? "checked" : ""}><label for="f-c${i}" style="--c:${c}" title="Couleur ${i + 1}"></label>`).join("")}</div></div>`;
  }
  function lireFormEnfant() {
    return { prenom: $("#f-prenom").value.trim(), niveau: +$("#f-niveau").value, couleur: (document.querySelector('input[name="f-coul"]:checked') || {}).value || COULEURS[0], avatar: (document.querySelector('input[name="f-av"]:checked') || {}).value || AVATARS[0], naissance: (+$("#f-naiss").value >= 2000 && +$("#f-naiss").value <= new Date().getFullYear()) ? +$("#f-naiss").value : null };
  }
  function ecranAjoutEnfant(premier) {
    rendre(`<section class="page etroite">
      <div class="entete"><div><h1>${premier ? "Bienvenue !" : "Nouveau cahier"}</h1>
      <p class="doux">${premier ? "Commençons par créer le cahier de votre premier enfant. Vous pourrez en ajouter d'autres ensuite." : "Ajoutez un enfant."}</p></div></div>
      <form class="feuille sections" id="form">${formEnfant()}
        <div class="rangee"><button class="btn" type="submit">Créer le cahier</button>${premier ? "" : '<button class="btn second" type="button" id="annuler">Annuler</button>'}</div>
      </form></section>`);
    $("#f-prenom").focus();
    $("#form").onsubmit = ev => { ev.preventDefault(); const e = lireFormEnfant(); if (!e.prenom) { toast("Indiquez un prénom."); return; }
      e.id = uid(); e.cree = Date.now(); e.xp = 0; D.enfants.push(e); sauver(); ecranEnfants(); };
    if (!premier) $("#annuler").onclick = ecranEnfants;
  }

  // ===================== écran : accueil de l'enfant =====================
  let matiereCourante = "maths";
  let themeFiltre = null;
  function ecranEntrainement() {
    majBarre();
    const n = enfant.niveau, exos = EXOS.pourNiveau(n), prog = (PROGRAMME.P[n] || {}).matieres || {};
    const mats = [...new Set([...Object.keys(prog), ...exos.map(e => e.matiere)])].filter(m => MATIERES[m] && exos.some(e => e.matiere === m));
    if (!mats.includes(matiereCourante)) { matiereCourante = mats[0]; themeFiltre = null; }
    const themes = prog[matiereCourante] || [], auProg = new Set(themes.flatMap(t => t[1])), st = D.stats[enfant.id] || {};
    let liste = exos.filter(e => e.matiere === matiereCourante);
    if (themeFiltre != null && themes[themeFiltre] && themes[themeFiltre][1].length) liste = liste.filter(e => themes[themeFiltre][1].includes(e.id));
    liste.sort((a, b) => auProg.has(b.id) - auProg.has(a.id));
    const tuiles = liste.map(e => { const s = st[e.id];
      return `<button class="tuile" style="--m:${MATIERES[e.matiere][1]}" data-ex="${e.id}" type="button">
        <h3>${esc(e.titre)}</h3><span class="desc">${esc(e.desc)}</span>
        <span class="bas">${etoiles(s ? s.meilleur : 0)}<span>${s ? `${s.seances} séance${s.seances > 1 ? "s" : ""}` : auProg.has(e.id) && !maternelle() ? '<span class="tag-prog">Au programme</span>' : "Nouveau"}</span></span></button>`; }).join("");
    rendre(`<section class="page">
      ${entete(maternelle() ? "Je joue et j'apprends" : "Je m'entraîne", maternelle() ? "Écoute la consigne et touche la bonne image. Un adulte peut t'accompagner les premières fois." : `Les exercices du programme de ${NIVEAUX[n]}, année ${PROGRAMME.ANNEE}.`)}
      <div class="onglets" role="group" aria-label="Matière">${mats.map(m => `<button class="onglet" style="--m:${MATIERES[m][1]}" data-m="${m}" aria-pressed="${m === matiereCourante}" type="button">${lab(m)}</button>`).join("")}</div>
      ${themes.length && !maternelle() ? `<div class="programme-bloc"><span class="label">Au programme de ${NIVEAUX[n]} en ${lab(matiereCourante).toLowerCase()}</span>
        <div class="puces">${themes.map(([t, ids], i) => `<button type="button" class="puce ${ids.length ? "" : "sans"}" data-th="${i}" aria-pressed="${themeFiltre === i}" style="--m:${MATIERES[matiereCourante][1]}">${esc(t)}</button>`).join("")}</div></div>` : ""}
      <div id="theme-info"></div>
      <div class="tuiles">${tuiles}</div>
      ${!maternelle() && iaDispo() ? `<div class="rangee"><button class="btn second" id="go-quiz" type="button">Réviser un autre chapitre avec Plume</button></div>` : ""}
    </section>`);
    $("#retour").onclick = ecranAccueil;
    app.querySelectorAll(".onglet").forEach(b => b.onclick = () => { matiereCourante = b.dataset.m; themeFiltre = null; ecranEntrainement(); });
    app.querySelectorAll(".puce[data-th]").forEach(b => b.onclick = () => {
      const i = +b.dataset.th, [t, ids] = themes[i];
      if (ids.length) { themeFiltre = themeFiltre === i ? null : i; ecranEntrainement(); return; }
      $("#theme-info").innerHTML = `<div class="note-info sections"><span><b>${esc(t)}</b> : pas encore d'exercice tout prêt sur ce chapitre. Ajoute ta leçon dans ton cartable : je t'aide à l'apprendre avec des cartes mémo${iaDispo() ? ", ou demande un quiz à Plume" : ""}.</span>
        <div class="rangee"><button class="btn petit" id="ti-lecon" type="button">Ajouter ma leçon</button>${iaDispo() ? `<button class="btn second petit" id="ti-quiz" type="button">Quiz avec Plume</button>` : ""}</div></div>`;
      $("#ti-lecon").onclick = () => ecranAjout("lecon", null, { matiere: matiereCourante, theme: t });
      if ($("#ti-quiz")) $("#ti-quiz").onclick = () => ecranQuizIA(t, matiereCourante);
    });
    app.querySelectorAll(".tuile").forEach(b => b.onclick = () => lancerSeance(EXOS.get(b.dataset.ex), null, null, null, { retour: ecranEntrainement }));
    if ($("#go-quiz")) $("#go-quiz").onclick = () => ecranQuizIA("", matiereCourante);
  }


  // ===================== séance d'exercices =====================
  let S = null;
  function lancerSeance(exo, questionsFournies, titre, nivForce, opts) {
    opts = opts || {};
    const niv = exo ? (nivForce != null ? nivForce : Math.min(Math.max(enfant.niveau, exo.niveaux[0]), exo.niveaux[1])) : enfant.niveau;
    if (exo && exo.paquet && !questionsFournies) questionsFournies = exo.paquet(niv);
    S = { exo, niv, titre: titre || exo.titre, matiere: exo ? exo.matiere : "ia", total: questionsFournies ? questionsFournies.length : exo && exo.nb ? exo.nb(niv) : 10, i: 0, ok: 0, res: [], q: null, fournies: questionsFournies, erreurs: [], vus: new Set(), item: opts.item || null, retour: opts.retour || null, lg: opts.lg || null, leconAr: opts.leconAr || null };
    if (opts.matiere) S.matiere = opts.matiere;
    questionSuivante();
  }
  function genererQuestion() {
    if (S.fournies) return S.fournies[S.i];
    let q, k = 0;
    do { q = S.exo.gen(S.niv); k++; } while (S.vus.has(q.q) && k < 20);
    S.vus.add(q.q); return q;
  }
  function questionSuivante() {
    if (S.i >= S.total) return bilan();
    S.q = genererQuestion();
    const q = S.q, ex = S.exo;
    const niveaux = ex && !ex.banque ? NIVEAUX.slice(ex.niveaux[0], ex.niveaux[1] + 1).map((n, k) => [k + ex.niveaux[0], n]) : [];
    rendre(`<section class="page etroite seance">
      <div class="entete">
        <div><span class="label" style="color:${MATIERES[S.matiere] ? MATIERES[S.matiere][1] : "var(--ia)"}">${lab(S.matiere)}</span><h1>${esc(S.titre)}</h1></div>
        <div class="rangee">${ex && niveaux.length > 1 ? `<label class="doux" for="niv">Niveau</label><select class="sel" id="niv">${niveaux.map(([k, n]) => `<option value="${k}" ${k === S.niv ? "selected" : ""}>${n}</option>`).join("")}</select>` : ""}
          <button class="btn-discret" id="quitter" type="button">Arrêter</button></div>
      </div>
      <div class="progression" aria-label="Question ${S.i + 1} sur ${S.total}">${Array.from({ length: S.total }, (_, k) => `<span class="${k < S.i ? (S.res[k] ? "ok" : "ko") : k === S.i ? "cour" : ""}"></span>`).join("")}</div>
      <div class="feuille" style="display:grid;gap:18px">
        <div class="rangee" style="justify-content:space-between"><span class="label">Question ${S.i + 1} / ${S.total}</span>
          ${"speechSynthesis" in window ? `<button class="btn-discret" id="ecouter" type="button">${q.voix ? drapeauLangue(q.voix.l, 18) + " " : ""}${ICO.son} Écouter</button>` : ""}</div>
        <div class="question" id="enonce">${q.q}</div>
        ${q.kind === "qcm"
          ? `<div class="choix${q.rendu && q.images !== false && q.optClass !== "mots" ? " images" : ""}${q.optClass ? " " + q.optClass : ""}" id="choix">${q.options.map((o, k) => `<button type="button" data-k="${k}"${q.rendu ? ` aria-label="${esc(o)}"` : ""}>${q.rendu ? q.rendu(o) : esc(o)}</button>`).join("")}</div>`
          : `<form class="reponse" id="frep" autocomplete="off"><input id="rep" ${q.kind === "num" ? 'inputmode="decimal"' : 'autocapitalize="off" spellcheck="false"'} placeholder="Ta réponse" aria-label="Ta réponse"><button class="btn" type="submit">Valider</button></form>`}
        <div id="retour" aria-live="polite"></div>
      </div></section>`);
    $("#quitter").onclick = () => { speechSynthesis?.cancel?.(); (S.retour || ecranEntrainement)(); };
    if ($("#niv")) $("#niv").onchange = e => { S.niv = +e.target.value; S.vus.clear(); questionSuivante(); };
    if ($("#ecouter")) $("#ecouter").onclick = () => q.voix ? parlerLangue(q.voix.t, q.voix.l) : parler(q.q);
    if (q.voix) setTimeout(() => parlerLangue(q.voix.t, q.voix.l), 300);
    else if (D.reglages.lectureAuto && enfant.niveau <= 4 && "speechSynthesis" in window) setTimeout(() => parler(q.q), 250);
    if (q.kind === "qcm") app.querySelectorAll("#choix button").forEach(b => b.onclick = () => corriger(q.options[+b.dataset.k], b));
    else { $("#rep").focus(); $("#frep").onsubmit = e => { e.preventDefault(); const v = $("#rep").value; if (!v.trim()) return; corriger(v); }; }
  }
  const BRAVO = ["Bravo !", "Super !", "Parfait !", "Très bien !", "Excellent !"];
  function corriger(rep, bouton) {
    const q = S.q, juste = q.check(rep);
    if (q.apres) q.apres(juste);
    S.res[S.i] = juste; if (juste) S.ok++; else S.erreurs.push({ q: q.q, rep, bonne: q.answer });
    if (q.kind === "qcm") app.querySelectorAll("#choix button").forEach(b => { b.disabled = true; const o = q.options[+b.dataset.k]; if (o === q.answer) b.classList.add("bon"); else if (b === bouton) b.classList.add("mauvais"); });
    else { $("#rep").readOnly = true; $("#frep button").disabled = true; }
    const r = $("#retour");
    r.innerHTML = `<div class="retour ${juste ? "juste" : "faux"}"><span class="tampon">${juste ? BRAVO[Math.floor(Math.random() * BRAVO.length)] : "Presque…"}</span>
      ${juste ? "" : `<span class="correction">La bonne réponse : ${esc(q.answer)}</span>`}
      <span>${q.expl}</span></div>
      <div class="rangee" style="margin-top:14px"><button class="btn" id="suivant" type="button">${S.i + 1 >= S.total ? "Voir mon résultat" : "Question suivante"}</button></div>`;
    maths(r);
    $("#suivant").focus();
    let passe = false; const btnSuiv = $("#suivant"); const avancer = () => { if (passe || !btnSuiv.isConnected) return; passe = true; S.i++; questionSuivante(); };
    $("#suivant").onclick = avancer;
    if (juste) { const b = $("#suivant"); b.classList.add("auto"); b.textContent += " ▸"; setTimeout(avancer, q.voixApres ? 2000 : 1500); }
    if (q.voixApres) setTimeout(() => parlerLangue(q.voixApres.t, q.voixApres.l), 150);
    else if (D.reglages.lectureAuto && maternelle()) parler((juste ? "Bravo ! " : "Ce n'est pas ça. ") + (q.dire || ""));
    else if (juste && enfant.niveau <= 4 && D.reglages.lectureAuto) parler("Bravo !");
  }
  function bilan() {
    const n = nbEtoiles(S.ok, S.total), id = S.exo ? S.exo.id : "ia:" + S.titre;
    const st = (D.stats[enfant.id] = D.stats[enfant.id] || {});
    const s = (st[id] = st[id] || { titre: S.titre, matiere: S.matiere, seances: 0, questions: 0, justes: 0, meilleur: 0 });
    s.seances++; s.questions += S.total; s.justes += S.ok; s.meilleur = Math.max(s.meilleur, n); s.dernier = Date.now(); s.titre = S.titre;
    const h = (D.historique[enfant.id] = D.historique[enfant.id] || []);
    h.unshift({ date: Date.now(), id, titre: S.titre, matiere: S.matiere, niveau: NIVEAUX[S.niv], score: S.ok, total: S.total });
    if (h.length > 300) h.length = 300;
    sauver();
    const msg = n === 3 ? "Magnifique travail !" : n === 2 ? "Très bien, continue comme ça !" : n === 1 ? "C'est un bon début. On recommence ?" : "Courage ! Chaque erreur t'apprend quelque chose.";
    rendre(`<section class="page etroite"><div class="feuille bilan">
      <span class="label">${esc(S.titre)}</span>
      <div class="note">${S.ok} / ${S.total}</div>
      ${etoiles(n)}
      <p style="font-size:1.2rem;margin:0">${msg}</p>
      <div class="rangee" style="justify-content:center">
        ${S.exo ? '<button class="btn" id="encore" type="button">Recommencer</button>' : ""}
        ${S.erreurs.length && iaDispo() && !maternelle() ? '<button class="btn second" id="expliquer" type="button">Plume, explique-moi mes erreurs</button>' : ""}
        <button class="btn second" id="fin" type="button">Retour à mon cahier</button>
      </div></div></section>`);
    if (enfant.niveau <= 4 && D.reglages.lectureAuto) parler(`${S.ok} sur ${S.total}. ${msg}`);
    if ($("#encore")) $("#encore").onclick = () => lancerSeance(S.exo, null, null, S.niv, { retour: S.retour });
    $("#fin").onclick = () => (S.retour || ecranEntrainement)();
    if (S.item) revisionFaite(S.item, "quiz", { score: S.ok, tot: S.total });
    else { if (S.leconAr) noter("lecon-ar", { id: S.leconAr, et: n }); noter("seance", { ex: S.exo ? S.exo.id : S.lg ? "langue-" + S.lg : "ia", m: S.matiere, et: n, ok: S.ok, tot: S.total, lg: S.lg || undefined }); sauver(); gagner(10 + 5 * n, `${n} étoile${n > 1 ? "s" : ""}`); }
    if ($("#expliquer")) $("#expliquer").onclick = () => {
      const tx = S.erreurs.map(e => `- Question : ${texteBrut(e.q)}\n  Ma réponse : ${e.rep}\n  Bonne réponse : ${e.bonne}`).join("\n");
      ecranPlume(`Je viens de faire l'exercice « ${S.titre} » et je me suis trompé sur ces questions. Peux-tu m'aider à comprendre mes erreurs ?\n${tx}`, S.matiere);
    };
  }
  function texteBrut(html) { const d = document.createElement("div"); d.innerHTML = html; return d.textContent.replace(/\s+/g, " ").trim(); }

  // ===================== API Claude =====================
  async function appelClaude(body, onText, signal) {
    let r;
    if (EN_LIGNE) {
      try { r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "x-api-key": D.reglages.cle, "anthropic-version": "2023-06-01", "content-type": "application/json", "anthropic-dangerous-direct-browser-access": "true" }, body: JSON.stringify(body), signal }); }
      catch (e) { if (e.name === "AbortError") throw e; throw new Error("Pas de connexion Internet."); }
    }
    else r = await fetch("api/tutor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: D.reglages.cle, body }), signal });
    if (!r.ok) {
      let m = "";
      try { const t = await r.text(); try { const j = JSON.parse(t); m = j.error?.message || ""; } catch { m = t; } } catch { }
      if (r.status === 401) throw new Error("La clé API n'est pas valide. Demande à un parent de la vérifier dans l'Espace parents.");
      if (r.status === 429) throw new Error("Plume a reçu trop de demandes. Attends une minute et réessaie.");
      if (r.status === 400 && /credit|balance/i.test(m)) throw new Error("Le crédit du compte Claude est épuisé. Un parent doit le recharger sur console.anthropic.com.");
      if (r.status === 404 && /model/i.test(m)) throw new Error("Le modèle choisi n'est pas disponible. Changez-le dans l'Espace parents.");
      if (r.status === 502) throw new Error(m.trim() || "Pas de connexion Internet.");
      throw new Error("Plume n'a pas pu répondre (" + r.status + "). " + m.slice(0, 160));
    }
    if (!body.stream) { const j = await r.json(); return (j.content || []).filter(c => c.type === "text").map(c => c.text).join(""); }
    const rd = r.body.getReader(), dec = new TextDecoder(); let buf = "", txt = "";
    for (; ;) {
      const { value, done } = await rd.read(); if (done) break;
      buf += dec.decode(value, { stream: true });
      let k; while ((k = buf.indexOf("\n\n")) >= 0) {
        const ev = buf.slice(0, k); buf = buf.slice(k + 2);
        const data = ev.split("\n").filter(l => l.startsWith("data:")).map(l => l.slice(5).trim()).join("");
        if (!data) continue;
        try { const j = JSON.parse(data);
          if (j.type === "content_block_delta" && j.delta?.type === "text_delta") { txt += j.delta.text; onText && onText(txt); }
          if (j.type === "error") throw new Error(j.error?.message || "Erreur du service");
        } catch (e) { if (e instanceof SyntaxError) continue; throw e; }
      }
    }
    return txt;
  }
  function consignes(matiere) {
    const n = enfant.niveau, a = age(n);
    return `Tu es « Plume », un tuteur bienveillant et patient qui aide ${enfant.prenom}, élève de ${NIVEAUX[n]} (${CYCLES(n)}, environ ${a} ans) dans le système scolaire français, à faire ses devoirs.${matiere ? ` Matière choisie : ${matiere}.` : ""}
Tu suis les programmes de l'Éducation nationale en vigueur en ${PROGRAMME.ANNEE} et le vocabulaire utilisé en classe de ${NIVEAUX[n]}. Textes officiels de référence : ${(PROGRAMME.P[n] || {}).ref || ""}

Ta méthode :
- ${D.reglages.strict ? "Tu ne donnes JAMAIS directement la réponse finale d'un exercice de devoirs, ni une rédaction ou un exercice entièrement résolu. Tu guides : une question ou un indice à la fois, du plus léger au plus précis. Si l'élève bloque vraiment après plusieurs indices, montre un exemple SEMBLABLE résolu (avec d'autres nombres ou d'autres mots), puis laisse-le refaire le sien." : "Tu expliques d'abord la méthode et tu poses des questions pour faire réfléchir. Tu peux donner la réponse si l'élève a essayé, en expliquant chaque étape."}
- Quand l'élève propose une réponse, dis clairement si elle est juste. Si elle est fausse, aide-le à trouver lui-même où est l'erreur.
- Encourage les efforts, jamais de moquerie. Félicite précisément ce qui est réussi.
- Adapte ta langue à un enfant de ${a} ans : ${n <= 5 ? "phrases très courtes, mots simples, 3 à 5 phrases maximum par réponse" : n <= 8 ? "phrases simples, réponses courtes (moins de 120 mots)" : n <= 11 ? "réponses claires et structurées, moins de 180 mots" : "registre lycée, rigoureux, réponses concises et structurées"}.
- En mathématiques et en sciences, écris les formules en LaTeX entre $...$ (par exemple $\\frac{3}{4}$, $x^2$). Utilise la virgule décimale française.
- Si l'élève envoie une photo, commence par dire brièvement ce que tu vois (quel exercice), puis aide-le sur la première question.
- Réponds en français, sauf pour les exercices de langues vivantes où tu peux utiliser la langue étudiée.
- Si la demande n'a rien à voir avec l'école ou si l'élève semble triste, inquiet ou en danger, réponds avec douceur et invite-le à en parler à un adulte de confiance (parent, enseignant).`;
  }

  // ===================== écran : Plume =====================
  const MAT_IA = n => n <= 7 ? ["Toutes matières", "Mathématiques", "Français", "Questionner le monde / Sciences", "Histoire", "Géographie", "Anglais", "EMC"]
    : n <= 11 ? ["Toutes matières", "Mathématiques", "Français", "Histoire-Géographie", "SVT", "Physique-Chimie", "Technologie", "Anglais", "Espagnol", "Allemand", "EMC"]
      : ["Toutes matières", "Mathématiques", "Français", "Philosophie", "Histoire-Géographie", "SES", "SVT", "Physique-Chimie", "NSI", "Anglais", "Espagnol", "Allemand", "HGGSP", "HLP", "Enseignement scientifique", "EMC"];
  let P = null; // conversation en cours
  function ecranPlume(premierMessage, matiere, photo) {
    if (!iaDispo()) return ecranAccueil();
    const mats = MAT_IA(enfant.niveau);
    const matInit = matiere && MATIERES[matiere] ? MATIERES[matiere][0] : mats[0];
    P = { tours: [], matiere: mats.includes(matInit) ? matInit : mats[0], photo: null, ctl: null };
    rendre(`<section class="page etroite tuteur">
      <div class="entete"><div><span class="label" style="color:var(--ia)">Mon tuteur</span><h1>Plume</h1></div>
        <div class="rangee"><select class="sel" id="mat" aria-label="Matière">${mats.map(m => `<option ${m === P.matiere ? "selected" : ""}>${m}</option>`).join("")}</select>
        <button class="btn-discret" id="nouveau" type="button">Nouvel exercice</button><button class="btn-discret" id="fermer" type="button">Fermer</button></div></div>
      <div class="fil" id="fil">
        <div class="bulle plume"><p>Bonjour ${esc(enfant.prenom)} ! Je suis Plume. Montre-moi ton exercice : écris-le, ou prends-le en photo avec le bouton appareil photo. Je vais t'aider à trouver la réponse par toi-même.</p></div>
        <div class="raccourcis" id="raccourcis">
          <button type="button" data-t="Je ne comprends pas la consigne de mon exercice. ">Je ne comprends pas la consigne</button>
          <button type="button" data-t="Peux-tu vérifier ma réponse ? Voici l'exercice et ce que j'ai trouvé : ">Vérifie ma réponse</button>
          <button type="button" data-t="Peux-tu m'expliquer la leçon sur ">Explique-moi une leçon</button>
          <button type="button" data-t="J'ai une rédaction ou un texte à écrire, aide-moi à faire un plan sans l'écrire à ma place. Le sujet : ">Aide pour une rédaction</button>
        </div>
      </div>
      <form class="compo" id="compo">
        <div class="apercu-photo" id="apercu" hidden></div>
        <textarea id="msg" rows="2" placeholder="Écris ton exercice ou ta question…" aria-label="Message pour Plume"></textarea>
        <div class="ligne">
          <div class="rangee"><input type="file" id="fphoto" accept="image/*" capture="environment" hidden>
            <button class="btn second petit" type="button" id="bphoto">${ICO.photo} Photo de l'exercice</button></div>
          <div class="rangee"><button class="btn second petit" type="button" id="stop" hidden>Arrêter</button><button class="btn petit" type="submit" id="envoi">${ICO.envoyer} Envoyer</button></div>
        </div>
      </form></section>`);
    $("#fermer").onclick = () => { P.ctl?.abort(); ecranAccueil(); };
    $("#nouveau").onclick = () => { P.ctl?.abort(); ecranPlume(); };
    $("#mat").onchange = e => P.matiere = e.target.value;
    app.querySelectorAll("#raccourcis button").forEach(b => b.onclick = () => { const m = $("#msg"); m.value = b.dataset.t; m.focus(); m.setSelectionRange(m.value.length, m.value.length); });
    $("#bphoto").onclick = () => $("#fphoto").click();
    $("#fphoto").onchange = async e => { const f = e.target.files[0]; if (!f) return; try { P.photo = await reduireImage(f); majApercu(); } catch { toast("Cette image n'a pas pu être lue."); } e.target.value = ""; };
    const msg = $("#msg");
    msg.oninput = () => { msg.style.height = "auto"; msg.style.height = Math.min(200, msg.scrollHeight) + "px"; };
    msg.onkeydown = e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); $("#compo").requestSubmit(); } };
    $("#compo").onsubmit = e => { e.preventDefault(); envoyer(); };
    $("#stop").onclick = () => P.ctl?.abort();
    if (photo) { P.photo = photo; majApercu(); }
    if (premierMessage) { msg.value = premierMessage; envoyer(); } else msg.focus();
  }
  function majApercu() {
    const a = $("#apercu");
    if (!P.photo) { a.hidden = true; a.innerHTML = ""; return; }
    a.hidden = false; a.innerHTML = `<img src="data:${P.photo.type};base64,${P.photo.data}" alt="Photo jointe"> Photo jointe <button class="btn-discret" type="button" id="retirer">Retirer</button>`;
    $("#retirer").onclick = () => { P.photo = null; majApercu(); };
  }
  function reduireImage(file, maxPx) {
    return new Promise((ok, ko) => {
      const img = new Image(), url = URL.createObjectURL(file);
      img.onload = () => {
        const max = maxPx || 1600, k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas"); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
        ok({ type: "image/jpeg", data: c.toDataURL("image/jpeg", .85).split(",")[1] });
      };
      img.onerror = ko; img.src = url;
    });
  }
  function rendreMarkdown(md) {
    const blocs = [];
    md = md.replace(/\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\$([^\$\n]+?)\$|\\\(([\s\S]+?)\\\)/g, (m, a, b, c, d) => {
      const tex = a ?? b ?? c ?? d, disp = a != null || b != null;
      let h; try { h = katex.renderToString(tex, { displayMode: disp, throwOnError: false }); } catch { h = esc(m); }
      blocs.push(h); return `@@M${blocs.length - 1}@@`;
    });
    let html = marked.parse(md, { breaks: true });
    return html.replace(/@@M(\d+)@@/g, (_, i) => blocs[+i]);
  }
  if (window.marked) marked.use({ renderer: { html(t) { return esc(typeof t === "string" ? t : t.text); } } });

  async function envoyer() {
    const msg = $("#msg"), texte = msg.value.trim();
    if (!texte && !P.photo) return;
    $("#raccourcis")?.remove();
    const fil = $("#fil");
    const photo = P.photo;
    const contenu = [];
    if (photo) contenu.push({ type: "image", source: { type: "base64", media_type: photo.type, data: photo.data } });
    contenu.push({ type: "text", text: texte || "Voici mon exercice en photo. Aide-moi." });
    P.tours.push({ role: "user", content: contenu });
    fil.insertAdjacentHTML("beforeend", `<div class="bulle eleve">${photo ? `<img src="data:${photo.type};base64,${photo.data}" alt="Photo de l'exercice">` : ""}${esc(texte).replace(/\n/g, "<br>")}</div>`);
    msg.value = ""; msg.style.height = ""; P.photo = null; majApercu();
    const b = document.createElement("div"); b.className = "bulle plume attente"; b.textContent = "Plume réfléchit…"; fil.appendChild(b);
    b.scrollIntoView({ behavior: "smooth", block: "end" });
    $("#envoi").disabled = true; $("#stop").hidden = false;
    P.ctl = new AbortController();
    // On ne renvoie que la dernière photo (les anciennes sont remplacées par une mention) pour limiter le coût.
    const derniereImg = P.tours.map((t, i) => t.content.some?.(c => c.type === "image") ? i : -1).filter(i => i >= 0).pop();
    const messages = P.tours.slice(-20).map((t, i, arr) => {
      const idx = P.tours.length - arr.length + i;
      if (Array.isArray(t.content) && idx !== derniereImg) return { role: t.role, content: t.content.map(c => c.type === "image" ? { type: "text", text: "[photo de l'exercice envoyée plus tôt]" } : c) };
      return t;
    });
    if (messages[0].role !== "user") messages.shift();
    let fin = "";
    try {
      fin = await appelClaude({ model: D.reglages.modele, max_tokens: 1500, stream: true, system: consignes(P.matiere === "Toutes matières" ? "" : P.matiere), messages },
        t => { b.classList.remove("attente"); b.innerHTML = rendreMarkdown(t); }, P.ctl.signal);
      if (!fin) throw new Error("Plume n'a rien répondu. Reformule ta question.");
      b.classList.remove("attente"); b.innerHTML = rendreMarkdown(fin);
      P.tours.push({ role: "assistant", content: [{ type: "text", text: fin }] });
      if ("speechSynthesis" in window) {
        const o = document.createElement("div"); o.className = "outils-bulle";
        o.innerHTML = `<button class="btn-discret" type="button">${ICO.son} Écouter</button>`; o.firstChild.onclick = () => parler(b.innerHTML.replace(/<span class="katex-mathml">[\s\S]*?<\/span>/g, ""));
        b.appendChild(o);
      }
    } catch (e) {
      if (e.name === "AbortError") { b.classList.remove("attente"); if (!b.textContent || b.textContent === "Plume réfléchit…") b.textContent = "(Arrêté)"; }
      else { b.classList.add("attente"); b.textContent = e.message || "Plume n'a pas pu répondre."; }
      P.tours.pop(); // le message pourra être renvoyé
      if (!fin) msg.value = texte;
    } finally {
      $("#envoi").disabled = false; $("#stop").hidden = true; msg.focus();
    }
  }

  // ===================== Révision d'une leçon (quiz généré par Plume) =====================
  function ecranQuizIA(themeInit, matiereInit) {
    const mats = MAT_IA(enfant.niveau).slice(1);
    let photo = null;
    rendre(`<section class="page etroite"><div class="entete"><div><span class="label" style="color:var(--ia)">Avec Plume</span><h1>Réviser une leçon</h1>
      <p class="doux">Plume prépare un petit quiz sur ta leçon. Tu peux aussi prendre ta leçon en photo.</p></div></div>
      <form class="feuille sections" id="fq">
        <div class="grille2"><div class="champ"><label for="q-mat">Matière</label><select id="q-mat">${mats.map(m => `<option>${m}</option>`).join("")}</select></div>
          <div class="champ"><label for="q-nb">Nombre de questions</label><select id="q-nb"><option>5</option><option selected>8</option><option>10</option></select></div></div>
        <div class="champ"><label for="q-theme">Le thème de la leçon</label><input id="q-theme" placeholder="${enfant.niveau <= 7 ? "Ex. : les volcans, les fractions, le Moyen Âge" : enfant.niveau <= 11 ? "Ex. : la Révolution française, la photosynthèse, le théorème de Thalès" : "Ex. : la Guerre froide, les fonctions exponentielles, la conscience"}"></div>
        <div class="rangee"><input type="file" id="q-fphoto" accept="image/*" hidden><button class="btn second petit" type="button" id="q-bphoto">${ICO.photo} Photo de la leçon</button><span class="apercu-photo" id="q-apercu"></span></div>
        <div class="rangee"><button class="btn" type="submit" id="q-go">Préparer mon quiz</button><button class="btn second" type="button" id="q-ann">Annuler</button></div>
        <div id="q-etat" class="doux" aria-live="polite"></div>
      </form></section>`);
    $("#q-ann").onclick = ecranEntrainement;
    if (themeInit) $("#q-theme").value = themeInit;
    if (matiereInit && MATIERES[matiereInit]) { const opt = [...$("#q-mat").options].find(o => o.value.toLowerCase().startsWith(MATIERES[matiereInit][0].toLowerCase().slice(0, 5))); if (opt) $("#q-mat").value = opt.value; }
    $("#q-bphoto").onclick = () => $("#q-fphoto").click();
    $("#q-fphoto").onchange = async e => { const f = e.target.files[0]; if (!f) return; photo = await reduireImage(f).catch(() => null); $("#q-apercu").innerHTML = photo ? `<img src="data:image/jpeg;base64,${photo.data}" alt="Leçon"> Photo jointe` : ""; };
    $("#fq").onsubmit = async e => {
      e.preventDefault();
      const mat = $("#q-mat").value, theme = $("#q-theme").value.trim(), nb = +$("#q-nb").value;
      if (!theme && !photo) { $("#q-etat").textContent = "Indique le thème ou ajoute une photo de ta leçon."; return; }
      $("#q-go").disabled = true; $("#q-etat").textContent = "Plume prépare tes questions… (environ 20 secondes)";
      const consigne = `Crée un quiz de ${nb} questions à choix multiple pour réviser une leçon de ${mat}, niveau ${NIVEAUX[enfant.niveau]} (programme français, élève d'environ ${age(enfant.niveau)} ans).
${theme ? "Thème : " + theme + "." : ""}${photo ? " La leçon est sur la photo jointe : base les questions UNIQUEMENT sur son contenu." : ""}
Chaque question a 4 propositions, une seule juste, des distracteurs plausibles. L'explication (1 à 2 phrases) rappelle la notion de la leçon. Formules éventuelles en LaTeX entre $...$.
Réponds UNIQUEMENT avec ce JSON, sans texte autour :
{"titre":"titre court du quiz","questions":[{"question":"…","options":["…","…","…","…"],"bonne":0,"explication":"…"}]}`;
      const contenu = []; if (photo) contenu.push({ type: "image", source: { type: "base64", media_type: photo.type, data: photo.data } }); contenu.push({ type: "text", text: consigne });
      try {
        const t = await appelClaude({ model: D.reglages.modele, max_tokens: 4000, messages: [{ role: "user", content: contenu }] });
        const j = JSON.parse((t.match(/\{[\s\S]*\}/) || [""])[0]);
        const qs = (j.questions || []).filter(q => Array.isArray(q.options) && q.options.length >= 2 && q.options[q.bonne] != null).map(q => ({
          q: esc(q.question).replace(/\\\$/g, "$"), kind: "qcm", options: q.options.map(String), answer: String(q.options[q.bonne]), expl: esc(q.explication || ""), check: r => r === String(q.options[q.bonne])
        }));
        if (!qs.length) throw new Error("Le quiz reçu est vide. Réessaie avec un thème plus précis.");
        lancerSeance(null, qs, (j.titre || theme || mat).slice(0, 70), null, { matiere: matiereInit && MATIERES[matiereInit] ? matiereInit : "ia", retour: ecranEntrainement });
      } catch (err) {
        $("#q-go").disabled = false;
        $("#q-etat").textContent = err instanceof SyntaxError ? "Plume s'est un peu emmêlé les crayons. Clique encore sur « Préparer mon quiz »." : err.message;
      }
    };
  }

  // Dessine l'icône de l'enfant (son personnage sur sa couleur) et demande au programme de créer le raccourci.
  async function creerIcone(e) {
    const c = document.createElement("canvas"); c.width = c.height = 256; const g = c.getContext("2d");
    g.fillStyle = e.couleur || "#2b56cf"; g.beginPath(); g.roundRect ? g.roundRect(8, 8, 240, 240, 56) : g.rect(8, 8, 240, 240); g.fill();
    g.fillStyle = "rgba(255,255,255,.22)"; g.beginPath(); g.arc(128, 120, 92, 0, 7); g.fill();
    g.font = '150px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#000"; g.fillText(e.avatar || "🦊", 128, 132);
    const r = await fetch("api/raccourci", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: e.id, nom: e.prenom, png: c.toDataURL("image/png") }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.erreur || "L'icône n'a pas pu être créée.");
    return j;
  }

  // Tablettes et téléphones : synchronisation par GitHub (marche PC éteint) ou, à défaut, par le Wi-Fi du PC.
  const qrSvg = lien => { try { const q = qrcode(0, "L"); q.addData(lien); q.make(); return q.createSvgTag({ cellSize: 4, margin: 2, scalable: true }); } catch { return ""; } };
  const cartesQr = lien => `<div class="qr-grille">${D.enfants.map(e => `<figure class="qr-carte" style="--c:${e.couleur}">${qrSvg(lien(e))}<figcaption><span class="avatar-mini">${avatar(e)}</span> ${esc(e.prenom)}</figcaption></figure>`).join("")}</div>`;
  const ETAPE_ICONE = `Pour garder l'icône : sur iPad/iPhone, bouton <b>Partager</b> → « Sur l'écran d'accueil » ; sur Android, menu <b>⋮</b> → « Ajouter à l'écran d'accueil ».`;
  async function blocTablette(z) {
    const titre = `<h2>Sur une tablette ou un téléphone</h2>`;
    if (nuage) {
      const cfg = encodeURIComponent(JSON.stringify({ o: nuage.o, r: nuage.r, b: nuage.b, t: nuage.t }));
      z.innerHTML = titre + `<p class="note-info" style="margin:0">✅ <b>Synchronisation active.</b> Les progrès et les sons sont gardés dans votre GitHub privé et suivent chaque enfant sur tous ses appareils, <b>même PC éteint</b>.</p>
        <ol class="points etapes-tablette">
          <li>Avec l'<b>appareil photo</b> de la tablette ou du téléphone, visez le QR code de l'enfant, puis touchez le lien qui apparaît.</li>
          <li>${ETAPE_ICONE}</li>
          <li>La première fois, il faut Internet. Ensuite, l'appli marche même sans Internet : les progrès partent dès que la connexion revient.</li></ol>
        ${cartesQr(e => URL_EN_LIGNE + "?enfant=" + encodeURIComponent(e.id) + "#nuage=" + cfg)}
        <p class="doux" style="margin:0">🔒 Ces QR codes contiennent la clé d'accès aux cahiers : ne les montrez qu'à la famille.</p>
        <details><summary class="doux">Arrêter la synchronisation sur cet appareil</summary>
          <p class="doux">Les cahiers restent sur GitHub et sur les autres appareils.</p><button class="btn-discret" id="n-stop" type="button">Arrêter sur cet appareil</button></details>`;
      $("#n-stop").onclick = () => { try { localStorage.removeItem("aide-nuage"); } catch { } location.reload(); };
      return;
    }
    z.innerHTML = titre + `<p style="margin:0">Pour que les enfants utilisent l'appli sur tablette ou téléphone <b>même quand le PC est éteint</b>, leurs progrès et vos sons sont gardés dans votre compte GitHub, dans le dépôt privé <b>${DEPOT.r}</b>. À faire une seule fois :</p>
      <ol class="points etapes-tablette">
        <li>Ouvrez <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">github.com/settings/personal-access-tokens/new</a> (connectez-vous si besoin).</li>
        <li><b>Token name</b> : Aide aux devoirs. <b>Expiration</b> : la plus longue possible.</li>
        <li><b>Repository access</b> : « Only select repositories » → <b>${DEPOT.r}</b>.</li>
        <li><b>Permissions</b> → <b>Contents</b> : « Read and write ».</li>
        <li>Cliquez sur <b>Generate token</b>, copiez la clé (elle commence par <code>github_pat_</code>) et collez-la ici :</li></ol>
      <div class="champ"><label for="n-cle">Clé GitHub</label><input id="n-cle" type="password" autocomplete="off" spellcheck="false" placeholder="github_pat_…"></div>
      <div class="rangee"><button class="btn" id="n-ok" type="button">Activer la synchronisation</button><span id="n-etat" class="doux" aria-live="polite"></span></div>
      ${surLePC ? `<div id="p-wifi"></div>` : ""}`;
    $("#n-ok").onclick = async () => {
      const etat = m => { if ($("#n-etat")) $("#n-etat").textContent = m; }, c = Object.assign({}, DEPOT, { t: $("#n-cle").value.trim() });
      if (!c.t) return etat("Collez d'abord la clé.");
      $("#n-ok").disabled = true; etat("Vérification de la clé…");
      try {
        await verifierNuage(c);
        activerNuage(c); base = new Map();
        etat("Envoi des cahiers sur GitHub…");
        D.reglages.nuage = true;
        await synchroniser();
        if (pcJoignable) copiePC();
        etat("Envoi des sons…");
        await migrerSonsNuage();
        toast("La synchronisation est active !");
        ecranParents("enfants");
      } catch (e) {
        if (nuage && !base.size) { nuage = null; try { localStorage.removeItem("aide-nuage"); } catch { } delete D.reglages.nuage; }
        etat(e.message || "Ça n'a pas marché."); if ($("#n-ok")) $("#n-ok").disabled = false;
      }
    };
    if (!surLePC) return;
    // En attendant : la tablette peut ouvrir l'appli par le Wi-Fi de la maison (PC allumé).
    let adresses = [];
    try { adresses = (await (await fetch("api/adresse")).json()).adresses || []; } catch { }
    const w = $("#p-wifi"); if (!w) return;
    if (!adresses.length) return;
    const url = adresses[0];
    w.innerHTML = `<details><summary><b>Ou bien, sans GitHub : par le Wi-Fi de la maison</b> (le PC doit rester allumé)</summary>
      <ol class="points etapes-tablette">
        <li>La tablette doit être sur <b>le même Wi-Fi</b> que ce PC.</li>
        <li>Avec l'<b>appareil photo</b> de la tablette, visez le QR code de l'enfant, puis touchez le lien qui apparaît.</li>
        <li>${ETAPE_ICONE}</li>
        <li>Ce PC doit rester <b>allumé</b>, avec Aide aux devoirs ouvert (la fenêtre peut être réduite).</li></ol>
      ${cartesQr(e => url + "?enfant=" + encodeURIComponent(e.id))}
      <p class="doux" style="margin:0">Sans QR code, tapez cette adresse dans le navigateur de la tablette : <b>${esc(url)}</b>${adresses.length > 1 ? ` (ou ${adresses.slice(1).map(esc).join(", ")})` : ""}. Si la page ne s'ouvre pas : au premier lancement, Windows a peut-être demandé d'« Autoriser l'accès » à Aide aux devoirs ; il faut avoir accepté pour les <b>réseaux privés</b>.</p></details>`;
  }

  // ===================== Espace parents =====================
  function avecPin(suite) {
    if (!D.reglages.pin || deverrouille) return suite();
    rendre(`<section class="page etroite"><form class="feuille sections" id="fpin" style="text-align:center">
      <h1>Espace parents</h1><p class="doux" style="margin:0">Saisissez votre code à 4 chiffres.</p>
      <div class="pin">${[0, 1, 2, 3].map(i => `<input id="p${i}" inputmode="numeric" maxlength="1" aria-label="Chiffre ${i + 1}">`).join("")}</div>
      <p id="pin-err" class="doux" aria-live="polite" style="margin:0"></p>
      <div class="rangee" style="justify-content:center"><button class="btn second" type="button" id="pin-ann">Retour</button></div></form></section>`);
    const ins = [0, 1, 2, 3].map(i => $("#p" + i)); ins[0].focus();
    ins.forEach((inp, i) => {
      inp.oninput = () => { inp.value = inp.value.replace(/\D/g, ""); if (inp.value && i < 3) ins[i + 1].focus(); if (ins.every(x => x.value)) verif(); };
      inp.onkeydown = e => { if (e.key === "Backspace" && !inp.value && i) ins[i - 1].focus(); };
    });
    function verif() { if (ins.map(x => x.value).join("") === D.reglages.pin) { deverrouille = true; suite(); } else { $("#pin-err").textContent = "Code incorrect."; ins.forEach(x => x.value = ""); ins[0].focus(); } }
    $("#pin-ann").onclick = () => enfant ? ecranAccueil() : ecranEnfants();
  }

  function ecranParents(onglet = "suivi") {
    enfant = null; majBarre();
    const R = D.reglages;
    const tabs = [["suivi", "Suivi des enfants"], ["programme", "Programme de l'année"], ["enfants", "Enfants"], ["tuteur", "Tuteur Plume"], ["reglages", "Réglages & sauvegarde"], ["aide", "Mode d'emploi"]];
    let corps = "";
    if (onglet === "suivi") corps = D.enfants.length ? D.enfants.map(blocSuivi).join("") : `<div class="feuille vide-etat">Aucun enfant pour l'instant.</div>`;
    if (onglet === "aide") { ecranAide(() => ecranParents("suivi")); return; }
    if (onglet === "programme") corps = (D.enfants.length ? D.enfants.map(blocProgramme).join("") : `<div class="feuille vide-etat">Aucun enfant pour l'instant.</div>`)
      + `<div class="feuille sections"><h2>Sources officielles</h2><p class="doux" style="margin:0">L'application suit les programmes en vigueur pour l'année ${PROGRAMME.ANNEE}. Textes de référence :</p><ul class="points">${PROGRAMME.SOURCES.map(([t, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${esc(t)}</a></li>`).join("")}</ul></div>`;
    if (onglet === "enfants") corps = `<div class="feuille">${D.enfants.map(e => `<div class="ligne-enfant" data-id="${e.id}">
        <span class="pastille" style="--c:${e.couleur}">${avatar(e)}</span>
        <div><b>${esc(e.prenom)}</b><br><span class="doux">${NIVEAUX[e.niveau]} · ${CYCLES(e.niveau)}</span></div>
        <div class="rangee"><button class="btn-discret" data-act="haut" type="button" aria-label="Monter ${esc(e.prenom)}">▲</button><button class="btn-discret" data-act="bas" type="button" aria-label="Descendre ${esc(e.prenom)}">▼</button>${e.niveau < NIVEAUX.length - 1 ? `<button class="btn-discret" data-act="monter" type="button">Passer en ${NIVEAUX[e.niveau + 1]}</button>` : ""}${surLePC ? `<button class="btn-discret" data-act="icone" type="button">Icône sur le bureau</button>` : ""}<button class="btn-discret" data-act="modif" type="button">Modifier</button><button class="btn-discret" data-act="suppr" type="button">Supprimer</button></div>
      </div>`).join("") || '<p class="doux">Aucun enfant.</p>'}
      <div class="rangee" style="margin-top:16px"><button class="btn" id="p-ajout" type="button">Ajouter un enfant</button></div></div>
      ${D.enfants.length && surLePC ? `<div class="feuille sections"><h2>Un compte pour chaque enfant</h2>
        <p style="margin:0">Créez sur le bureau une icône au prénom de chaque enfant. En cliquant sur la sienne, l'enfant arrive directement dans son compte : pas de mot de passe, et il ne voit pas les cahiers de ses frères et sœurs.</p>
        <p class="doux" style="margin:0">Avant de créer les icônes, rangez AideAuxDevoirs.exe à sa place définitive (par exemple dans Documents) : si vous le déplacez ensuite, recréez les icônes.</p>
        <div class="rangee"><button class="btn" id="p-icones" type="button">Créer les icônes de tous les enfants</button><span id="p-ic-etat" class="doux" aria-live="polite"></span></div></div>` : ""}
      ${D.enfants.length && (surLePC || EN_LIGNE) ? `<div class="feuille sections" id="p-tablette"><h2>Sur une tablette ou un téléphone</h2></div>` : ""}
      <div id="p-edit"></div>`;
    if (onglet === "tuteur") corps = `<form class="feuille sections" id="f-tut">
        <div><h2>Plume, le tuteur intelligent</h2><p class="doux" style="margin:6px 0 0">Plume utilise Claude, l'IA d'Anthropic. Il aide à comprendre les exercices (même en photo) et prépare des quiz de révision dans toutes les matières. Il faut une connexion Internet et une clé API personnelle.</p></div>
        <div class="note-info"><b>Obtenir une clé :</b> créez un compte sur <b>console.anthropic.com</b>, ajoutez un petit crédit (quelques euros suffisent pour de nombreuses séances), puis « API Keys » → « Create Key ». Collez la clé ci-dessous. Elle reste chez vous : sur vos appareils${nuage ? " et dans votre GitHub privé" : ""}.</div>
        <div class="champ"><label for="t-cle">Clé API</label><input id="t-cle" type="password" value="${esc(R.cle)}" placeholder="sk-ant-…" autocomplete="off" spellcheck="false"><span class="aide">Laissez vide pour désactiver Plume. Les exercices restent disponibles hors ligne.</span></div>
        <div class="champ"><label for="t-mod">Modèle</label><select id="t-mod">${MODELES.map(([v, l]) => `<option value="${v}" ${v === R.modele ? "selected" : ""}>${l}</option>`).join("")}${MODELES.some(m => m[0] === R.modele) ? "" : `<option value="${esc(R.modele)}" selected>${esc(R.modele)}</option>`}</select></div>
        <label class="interrupteur"><input type="checkbox" id="t-strict" ${R.strict ? "checked" : ""}><span><b>Plume ne donne jamais directement la réponse</b><br><span class="doux">Recommandé : il guide par questions et indices, pour que l'enfant apprenne vraiment. Décochez pour autoriser la correction complète après un essai.</span></span></label>
        <div class="rangee"><button class="btn" type="submit">Enregistrer</button><button class="btn second" type="button" id="t-test">Tester la connexion</button><span id="t-etat" class="doux" aria-live="polite"></span></div>
      </form>`;
    if (onglet === "reglages") corps = `<form class="feuille sections" id="f-reg">
        <h2>Réglages</h2>
        <div class="champ"><label for="r-pin">Code parent (4 chiffres)</label><input id="r-pin" inputmode="numeric" maxlength="4" value="${esc(R.pin)}" placeholder="Aucun code"><span class="aide">Protège l'Espace parents (clé API, suppression d'un enfant…). Laissez vide pour ne pas en mettre.</span></div>
        <label class="interrupteur"><input type="checkbox" id="r-choix" ${R.choixProtege ? "checked" : ""}><span><b>Chaque enfant passe par son icône</b><br><span class="doux">Si l'application est ouverte sans icône d'enfant, l'écran des cahiers demande le code parent. Ainsi, chacun reste dans son compte. Nécessite un code parent.</span></span></label>
        <div class="champ"><label for="r-rev">Révisions proposées chaque jour dans le planning</label><select id="r-rev" style="max-width:340px"><option value="0">Automatique (2 en maternelle, 3 en primaire, 4 au collège et au lycée)</option>${[1, 2, 3, 4, 5, 6].map(k => `<option value="${k}" ${+R.revisionsJour === k ? "selected" : ""}>${k} par jour</option>`).join("")}</select><span class="aide">Chaque révision est un petit exercice d'une matière différente, choisi dans le programme de la classe, en priorité là où l'enfant a besoin de s'entraîner. Les leçons du cartable et les mots de langues s'ajoutent en plus.</span></div>
        <label class="interrupteur"><input type="checkbox" id="r-lect" ${R.lectureAuto ? "checked" : ""}><span><b>Lire les questions à voix haute en CP et CE1</b><br><span class="doux">Utilise la voix française de Windows. Pratique pour les enfants qui apprennent à lire.</span></span></label>
        <div class="rangee"><button class="btn" type="submit">Enregistrer</button></div>
      </form>
      <div class="feuille sections"><h2>Sauvegarde</h2>
        <p class="doux" style="margin:0">Les cahiers sont enregistrés automatiquement${nuage ? " (et synchronisés avec votre GitHub privé)" : surLePC ? " sur cet ordinateur" : ""}. Exportez-les pour les garder en sécurité ou les copier sur un autre PC.</p>
        <div class="rangee"><button class="btn second" id="r-exp" type="button">Exporter les cahiers</button>
          <input type="file" id="r-fimp" accept=".json,application/json" hidden><button class="btn second" id="r-imp" type="button">Importer une sauvegarde</button></div>
        <div id="r-conf"></div>
      </div>
      ${surLePC ? "" : `<div class="feuille sections"><h2>Sur cet appareil</h2><p style="margin:0">${nuage ? "Les cahiers sont synchronisés avec votre GitHub privé : ils suivent les enfants sur tous leurs appareils, même PC éteint." : EN_LIGNE ? "Les cahiers sont gardés seulement sur cet appareil. Pour les retrouver partout, activez la synchronisation (Espace parents → Enfants)." : "Les cahiers sont enregistrés sur le PC de la maison. Pour que l'application marche ici, le PC doit être allumé, avec Aide aux devoirs ouvert, et cet appareil sur le même Wi-Fi."}</p></div>`}
      ${surLePC ? `<div class="feuille sections"><h2>Fermer l'application</h2><p class="doux" style="margin:0">L'application se ferme aussi toute seule dès que vous fermez sa fenêtre.</p>
        <div class="rangee"><button class="btn danger" id="r-quit" type="button">Quitter Aide aux devoirs</button></div></div>` : ""}`;
    rendre(`<section class="page"><div class="entete"><div><h1>Espace parents</h1><p class="doux">Suivez les progrès et réglez l'application.</p></div>
      <button class="btn second" id="p-retour" type="button">${ICO.retour} ${enfantDuCompte() ? "Retour à mon compte" : "Retour aux cahiers"}</button></div>
      <div class="onglets" role="group" aria-label="Rubriques">${tabs.map(([k, l]) => `<button class="onglet" data-o="${k}" aria-pressed="${k === onglet}" type="button">${l}</button>`).join("")}</div>
      <div class="sections">${corps}</div></section>`);
    $("#p-retour").onclick = ecranEnfants;
    app.querySelectorAll("[data-o]").forEach(b => b.onclick = () => ecranParents(b.dataset.o));

    if (onglet === "enfants") {
      $("#p-ajout").onclick = () => ecranAjoutEnfant(false);
      if ($("#p-tablette")) blocTablette($("#p-tablette"));
      if ($("#p-icones")) $("#p-icones").onclick = async () => {
        $("#p-ic-etat").textContent = "Création en cours…"; let ok = 0, err = "";
        for (const e of D.enfants) { try { await creerIcone(e); ok++; } catch (x) { err = x.message; } }
        $("#p-ic-etat").textContent = ok === D.enfants.length ? `C'est fait : ${ok} icône${ok > 1 ? "s" : ""} sur le bureau.` : err;
      };
      app.querySelectorAll(".ligne-enfant").forEach(l => l.querySelectorAll("[data-act]").forEach(b => b.onclick = () => {
        const e = D.enfants.find(x => x.id === l.dataset.id), act = b.dataset.act;
        if (act === "icone") { creerIcone(e).then(() => toast(`L'icône de ${e.prenom} est sur le bureau.`), x => toast(x.message)); return; }
        if (act === "haut" || act === "bas") { const i = D.enfants.indexOf(e), j = i + (act === "haut" ? -1 : 1);
          if (j >= 0 && j < D.enfants.length) { [D.enfants[i], D.enfants[j]] = [D.enfants[j], D.enfants[i]]; D.reglages.tri = "perso"; sauver(); } ecranParents("enfants"); return; }
        if (act === "monter") { e.niveau++; sauver(); toast(`${e.prenom} passe en ${NIVEAUX[e.niveau]} !`); ecranParents("enfants"); }
        if (act === "modif") {
          $("#p-edit").innerHTML = `<form class="feuille sections" id="fe"><h2>Modifier ${esc(e.prenom)}</h2>${formEnfant(e)}<div class="rangee"><button class="btn" type="submit">Enregistrer</button><button class="btn second" type="button" id="fe-a">Annuler</button></div></form>`;
          $("#fe").scrollIntoView({ behavior: "smooth" });
          $("#fe-a").onclick = () => $("#p-edit").innerHTML = "";
          $("#fe").onsubmit = ev => { ev.preventDefault(); const v = lireFormEnfant(); if (!v.prenom) return toast("Indiquez un prénom."); Object.assign(e, v); sauver(); ecranParents("enfants"); };
        }
        if (act === "suppr") {
          if (l.nextElementSibling?.classList?.contains("confirmer")) return;
          l.insertAdjacentHTML("afterend", `<div class="confirmer"><span>Supprimer le cahier de <b>${esc(e.prenom)}</b> et tous ses résultats ?</span><button class="btn danger petit" type="button" id="c-oui">Supprimer</button><button class="btn second petit" type="button" id="c-non">Annuler</button></div>`);
          $("#c-non").onclick = () => ecranParents("enfants");
          $("#c-oui").onclick = () => { D.enfants = D.enfants.filter(x => x.id !== e.id); for (const k of ["stats", "historique", "cartable", "journal", "defis", "badges", "langues", "lectures"]) delete D[k][e.id]; sauver(); ecranParents("enfants"); };
        }
      }));
    }
    if (onglet === "tuteur") {
      const lire = () => { R.cle = $("#t-cle").value.trim(); R.modele = $("#t-mod").value; R.strict = $("#t-strict").checked; };
      $("#f-tut").onsubmit = e => { e.preventDefault(); lire(); sauver(); toast(R.cle ? "Plume est activé." : "Plume est désactivé."); };
      $("#t-test").onclick = async () => {
        lire(); const et = $("#t-etat");
        if (!R.cle) { et.textContent = "Saisissez d'abord une clé."; return; }
        et.textContent = "Test en cours…";
        try { const t = await appelClaude({ model: R.modele, max_tokens: 30, messages: [{ role: "user", content: "Réponds seulement : Bonjour !" }] }); et.textContent = "Connexion réussie : « " + t.trim().slice(0, 40) + " »"; sauver(); }
        catch (e) { et.textContent = e.message; }
      };
    }
    if (onglet === "reglages") {
      $("#f-reg").onsubmit = e => { e.preventDefault(); const p = $("#r-pin").value.trim();
        if (p && !/^\d{4}$/.test(p)) return toast("Le code doit contenir 4 chiffres.");
        R.pin = p; R.lectureAuto = $("#r-lect").checked; R.choixProtege = $("#r-choix").checked; R.revisionsJour = +$("#r-rev").value; sauver(); toast("Réglages enregistrés."); };
      $("#r-exp").onclick = () => {
        const copie = JSON.parse(JSON.stringify(D)); copie.reglages.cle = "";
        const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(copie, null, 1)], { type: "application/json" }));
        a.download = `aide-devoirs-${new Date().toISOString().slice(0, 10)}.json`; document.body.appendChild(a); a.click(); a.remove();
        toast("Sauvegarde exportée (sans la clé API).");
      };
      $("#r-imp").onclick = () => $("#r-fimp").click();
      $("#r-fimp").onchange = async ev => {
        const f = ev.target.files[0]; if (!f) return;
        try { const j = JSON.parse(await f.text()); if (!j.enfants) throw 0; migrer(j);
          $("#r-conf").innerHTML = `<div class="confirmer"><span>Remplacer les cahiers actuels par ceux de la sauvegarde (${j.enfants.length} enfant${j.enfants.length > 1 ? "s" : ""}) ?</span><button class="btn danger petit" id="i-oui" type="button">Remplacer</button><button class="btn second petit" id="i-non" type="button">Annuler</button></div>`;
          $("#i-non").onclick = () => $("#r-conf").innerHTML = "";
          $("#i-oui").onclick = () => { const cle = D.reglages.cle; D = Object.assign({ stats: {}, historique: {}, cartable: {}, journal: {}, defis: {}, badges: {}, langues: {}, lectures: {} }, j); D.reglages = Object.assign({}, j.reglages || {}, { cle: (j.reglages && j.reglages.cle) || cle }); sauver(); toast("Sauvegarde importée."); ecranParents("suivi"); };
        } catch { toast("Ce fichier n'est pas une sauvegarde d'Aide aux devoirs."); }
        ev.target.value = "";
      };
      if ($("#r-quit")) $("#r-quit").onclick = async () => { clearTimeout(saveTimer); await synchroniser().catch(() => { }); await fetch("api/quit").catch(() => { });
        rendre(`<section class="page etroite"><div class="feuille vide-etat"><h1>À bientôt !</h1><p>L'application est fermée. Vous pouvez fermer cette fenêtre.</p></div></section>`); setTimeout(() => window.close(), 600); };
    }
  }

  function blocSuivi(e) {
    const st = D.stats[e.id] || {}, h = D.historique[e.id] || [];
    const lignes = Object.entries(st).sort((a, b) => (b[1].dernier || 0) - (a[1].dernier || 0));
    const sem = h.filter(x => x.date > Date.now() - 7 * 864e5);
    const tq = sem.reduce((s, x) => s + x.total, 0), tj = sem.reduce((s, x) => s + x.score, 0);
    const date = t => new Date(t).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
    const nomMat = m => MATIERES[m] ? MATIERES[m][0] : "Plume";
    return `<div class="feuille sections">
      <div class="entete"><div class="rangee"><span class="pastille" style="--c:${e.couleur}">${avatar(e)}</span><div><h2>${esc(e.prenom)}</h2><span class="doux">${NIVEAUX[e.niveau]} · ${totalEtoiles(e.id)} étoiles</span></div></div>
        <span class="pill">${sem.length ? `Cette semaine : ${sem.length} séance${sem.length > 1 ? "s" : ""} · ${Math.round(100 * tj / tq)} % de réussite` : "Aucune séance cette semaine"}</span></div>
      ${lignes.length ? `<div class="table-wrap"><table><thead><tr><th>Exercice</th><th>Matière</th><th class="num">Séances</th><th>Réussite</th><th>Meilleur</th><th>Dernière fois</th></tr></thead><tbody>
        ${lignes.map(([, s]) => { const p = s.questions ? Math.round(100 * s.justes / s.questions) : 0;
          return `<tr><td>${esc(s.titre)}</td><td>${nomMat(s.matiere)}</td><td class="num">${s.seances}</td><td><span class="jauge ${p < 50 ? "bas" : p < 75 ? "moyen" : ""}"><i style="width:${p}%"></i></span>${p} %</td><td>${etoiles(s.meilleur)}</td><td>${s.dernier ? date(s.dernier) : ""}</td></tr>`; }).join("")}
      </tbody></table></div>` : `<p class="doux" style="margin:0">Pas encore de séance.</p>`}
      ${(() => { const c = cartable(e), afaire = c.filter(i => i.type === "devoir" && !i.fait), retard = afaire.filter(i => i.date && i.date < jour()),
          ctrl = c.filter(i => i.type === "controle" && i.date >= jour()).sort(parDate), cm = compteurs(e, ajoute(jour(), -6), jour());
        return `<div class="resume-parent"><span><b>${afaire.length}</b> devoir${afaire.length > 1 ? "s" : ""} à faire${retard.length ? ` dont <b class="txt-retard">${retard.length} en retard</b>` : ""}</span>
          <span>${ctrl.length ? `Prochain contrôle : <b>${esc(ctrl[0].titre)}</b> (${dateLisible(ctrl[0].date)})` : "Aucun contrôle prévu"}</span>
          <span><b>${cm.revisions}</b> révision${cm.revisions > 1 ? "s" : ""} et <b>${cm.cartes}</b> cartes cette semaine</span>
          <span>Série : <b>${serie(e)}</b> jour${serie(e) > 1 ? "s" : ""} · Niveau <b>${niveauXP(e.xp || 0).l}</b> · <b>${(D.badges[e.id] || []).length}</b> badges</span></div>`; })()}
      ${(() => { const faibles = lignes.filter(([, s]) => s.questions >= 10 && s.justes / s.questions < .6).map(([, s]) => s.titre);
        return faibles.length ? `<div class="note-info">À retravailler : <b>${faibles.map(esc).join(", ")}</b>.</div>` : ""; })()}
    </div>`;
  }

  // =====================================================================
  //  DATES
  // =====================================================================
  const pad = n => String(n).padStart(2, "0");
  const jour = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const versDate = s => { const [y, m, j] = String(s).split("-").map(Number); return new Date(y, m - 1, j); };
  const ajoute = (s, n) => { const d = versDate(s); d.setDate(d.getDate() + n); return jour(d); };
  const ecart = (a, b) => Math.round((versDate(b) - versDate(a)) / 864e5);
  const JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  function dateLisible(s) {
    if (!s) return "";
    const n = ecart(jour(), s), d = versDate(s);
    if (n === 0) return "aujourd'hui"; if (n === 1) return "demain"; if (n === -1) return "hier";
    if (n > 1 && n < 7) return JOURS[d.getDay()];
    return `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}`;
  }
  const lundiDe = s => ajoute(s, -((versDate(s).getDay() + 6) % 7));
  function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function melangeGraine(arr, graine) { let s = hash(graine) || 1; const r = () => (s = Math.imul(s ^ (s >>> 15), 2246822507) ^ Math.imul(s ^ (s >>> 13), 3266489909), ((s ^= s >>> 16) >>> 0) / 4294967296);
    const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  // =====================================================================
  //  DONNÉES PAR ENFANT : cartable, journal, défis, badges
  // =====================================================================
  const cartable = (e = enfant) => (D.cartable[e.id] = D.cartable[e.id] || []);
  const journal = (e = enfant) => (D.journal[e.id] = D.journal[e.id] || []);
  function noter(t, data) { const j = journal(); j.unshift(Object.assign({ d: jour(), t }, data || {})); if (j.length > 4000) j.length = 4000; }
  const AVATARS = ["🦊", "🐼", "🐯", "🦁", "🐸", "🐵", "🐨", "🐰", "🦄", "🐙", "🐲", "🦉", "🐶", "🐱", "🐧", "🐢"];
  const avatar = e => `<span class="emo">${e.avatar || "🦊"}</span>`;

  // ---------- niveaux d'expérience ----------
  const TITRES = ["Petit crayon", "Apprenti", "Curieux", "Explorateur", "Aventurier", "Savant en herbe", "As du cartable", "Champion", "Expert", "Maître des savoirs", "Légende"];
  function niveauXP(xp) { let l = 1, seuil = 0, pas = 120; while (xp >= seuil + pas) { seuil += pas; l++; pas += 40; } return { l, dans: xp - seuil, pas, titre: TITRES[Math.min(l - 1, TITRES.length - 1)] }; }
  function serie(e = enfant, maxi) {
    const jours = new Set(journal(e).map(x => x.d));
    if (maxi) { let best = 0; for (const d of jours) { if (jours.has(ajoute(d, -1))) continue; let k = 0, x = d; while (jours.has(x)) { k++; x = ajoute(x, 1); } best = Math.max(best, k); } return best; }
    let s = 0, d = jour(); if (!jours.has(d)) d = ajoute(d, -1);
    while (jours.has(d)) { s++; d = ajoute(d, -1); }
    return s;
  }
  function gagner(xp, quoi) {
    const avant = niveauXP(enfant.xp || 0).l;
    enfant.xp = (enfant.xp || 0) + xp;
    const nv = niveauXP(enfant.xp);
    sauver(); majBarre();
    toast(`+${xp} XP${quoi ? " · " + quoi : ""}`);
    if (nv.l > avant) feter("🚀", `Niveau ${nv.l} !`, `Tu deviens « ${nv.titre} ». Continue comme ça !`);
    verifierBadges();
    recompenserDefis();
  }
  function recompenserDefis() {
    for (const d of listeDefis()) if (d.fini && !d.recupere) {
      D.defis[enfant.id][d.id] = true; noter("defi", { k: d.id });
      const avant = niveauXP(enfant.xp || 0).l; enfant.xp = (enfant.xp || 0) + d.xp; const nv = niveauXP(enfant.xp);
      feter(d.periode === "semaine" ? "⚡" : "🏔️", "Défi réussi !", `${d.titre}. +${d.xp} XP`);
      if (nv.l > avant) feter("🚀", `Niveau ${nv.l} !`, `Tu deviens « ${nv.titre} ». Continue comme ça !`);
    }
    sauver(); majBarre(); verifierBadges();
  }

  // ---------- badges ----------
  const BADGES = [
    ["premier", "🌱", "Premier pas", "Termine ta première séance", c => c.seances >= 1],
    ["serie3", "🔥", "Trois jours de suite", "Travaille 3 jours d'affilée", c => c.serieMax >= 3],
    ["serie7", "🌟", "Une semaine entière", "Travaille 7 jours d'affilée", c => c.serieMax >= 7],
    ["parfait", "💯", "Sans faute", "Réussis une séance sans erreur", c => c.parfaits >= 1],
    ["dix", "🎯", "Dix séances", "Termine 10 séances d'entraînement", c => c.seances >= 10],
    ["cinquante", "🏅", "Cinquante séances", "Termine 50 séances d'entraînement", c => c.seances >= 50],
    ["cartable", "🎒", "Cartable bien rempli", "Ajoute 5 devoirs ou leçons", c => c.ajouts >= 5],
    ["memoire", "🐘", "Mémoire d'éléphant", "Révise 100 cartes mémo", c => c.cartes >= 100],
    ["parcoeur", "🎤", "Par cœur", "Apprends une leçon par cœur", c => c.parcoeur >= 1],
    ["defi", "🏆", "Défi relevé", "Réussis ton premier défi", c => c.defis >= 1],
    ["defis5", "👑", "Roi des défis", "Réussis 5 défis", c => c.defis >= 5],
    ["curieux", "🧭", "Touche-à-tout", "Entraîne-toi dans 4 matières", c => c.matieres >= 4],
    ["niveau5", "🚀", "Niveau 5", "Atteins le niveau 5", c => c.niveau >= 5],
    ["polyglotte", "🌍", "Polyglotte", "Entraîne-toi dans 2 langues étrangères", c => c.langues >= 2],
  ];
  function compteurs(e = enfant, debut, fin) {
    const j = journal(e).filter(x => (!debut || x.d >= debut) && (!fin || x.d <= fin));
    const s = j.filter(x => x.t === "seance");
    return {
      seances: s.length, etoiles: s.reduce((a, x) => a + (x.et || 0), 0), parfaits: s.filter(x => x.tot && x.ok === x.tot).length,
      matieres: new Set(s.map(x => x.m)).size, langues: new Set(s.filter(x => x.lg).map(x => x.lg)).size, jours: new Set(j.map(x => x.d)).size,
      troisEtoiles: new Set(s.filter(x => x.et === 3).map(x => x.ex)).size,
      cartes: j.filter(x => x.t === "revision").reduce((a, x) => a + (x.cartes || 0), 0),
      revisions: new Set(j.filter(x => x.t === "revision").map(x => x.id + x.d)).size,
      parcoeur: j.filter(x => x.t === "revision" && x.mode === "parcoeur" && x.complet).length,
      devoirs: j.filter(x => x.t === "devoir" && x.aTemps).length, ajouts: j.filter(x => x.t === "ajout").length,
      defis: j.filter(x => x.t === "defi").length, serieMax: serie(e, true), niveau: niveauXP(e.xp || 0).l
    };
  }
  function verifierBadges() {
    const c = compteurs(), mes = (D.badges[enfant.id] = D.badges[enfant.id] || []);
    for (const [id, ico, nom, desc, test] of BADGES) if (!mes.includes(id) && test(c)) { mes.push(id); sauver(); feter(ico, "Nouveau badge !", `${nom} : ${desc.charAt(0).toLowerCase() + desc.slice(1)}.`); }
  }

  // ---------- fête : badge, niveau, défi ----------
  // Toutes les récompenses d'un même moment s'affichent ensemble, dans une seule carte qui se ferme toute seule.
  let fetes = [], feteOuverte = null, feteMinuteur = null;
  function feter(ico, titre, texte) { fetes.push([ico, titre, texte]); clearTimeout(feteMinuteur); feteMinuteur = setTimeout(afficherFete, 60); }
  function afficherFete() {
    if (!fetes.length) return;
    const lot = fetes.splice(0);
    if (feteOuverte) feteOuverte.remove();
    const f = document.createElement("div"); f.className = "fete"; f.setAttribute("role", "dialog"); f.setAttribute("aria-modal", "true"); feteOuverte = f;
    f.innerHTML = `<canvas class="confettis" aria-hidden="true"></canvas><div class="fete-carte">${lot.map(([ico, titre, texte]) => `<div class="fete-ligne"><div class="fete-icone"><span class="emo">${ico}</span></div><div><h2 class="cursive">${esc(titre)}</h2><p>${esc(texte)}</p></div></div>`).join("")}<button class="btn" type="button">Super !</button></div>`;
    document.body.appendChild(f); confettis(f.querySelector("canvas"));
    if (D.reglages.lectureAuto && enfant && enfant.niveau <= 4) parler(lot.map(x => `${x[1]} ${x[2]}`).join(". "));
    let fermee = false; const fermer = () => { if (fermee) return; fermee = true; f.remove(); if (feteOuverte === f) feteOuverte = null; };
    f.querySelector("button").onclick = fermer; f.onclick = fermer; setTimeout(fermer, 2600 + 900 * lot.length);
  }
  function confettis(cv) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = cv.getContext("2d"), W = cv.width = innerWidth, H = cv.height = innerHeight;
    const cols = ["#e03131", "#f5c518", "#2f9e44", "#1c64d9", "#c2387a", "#f08c00"];
    const ps = Array.from({ length: 140 }, () => ({ x: W / 2 + (Math.random() - .5) * 200, y: H * .35, vx: (Math.random() - .5) * 14, vy: -Math.random() * 14 - 4, r: Math.random() * 6 + 4, c: cols[Math.floor(Math.random() * cols.length)], a: Math.random() * 6 }));
    let t = 0;
    (function boucle() {
      ctx.clearRect(0, 0, W, H);
      for (const p of ps) { p.vy += .35; p.x += p.vx; p.y += p.vy; p.vx *= .99; p.a += .2; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore(); }
      if (++t < 150 && cv.isConnected) requestAnimationFrame(boucle); else ctx.clearRect(0, 0, W, H);
    })();
  }

  // =====================================================================
  //  ACCUEIL DE L'ENFANT
  // =====================================================================
  const TUILE_ICO = {
    jour: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="10" width="36" height="32" rx="6" fill="#fff" opacity=".95"/><rect x="6" y="10" width="36" height="10" rx="5" fill="currentColor" opacity=".35"/><path d="M15 6v8M33 6v8" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M15 30l6 6 12-12" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    cartable: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M17 12v-3a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3" fill="none" stroke="#fff" stroke-width="3.5"/><rect x="6" y="12" width="36" height="30" rx="7" fill="#fff" opacity=".95"/><path d="M6 24h36" stroke="currentColor" stroke-width="3" opacity=".45"/><rect x="20" y="21" width="8" height="7" rx="2" fill="currentColor"/></svg>',
    entrainement: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="18" fill="#fff" opacity=".95"/><circle cx="24" cy="24" r="11" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="24" cy="24" r="4" fill="currentColor"/><path d="M24 24l14-14M33 8l5 2 2 5" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round"/></svg>',
    defis: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 8h20v10a10 10 0 0 1-20 0z" fill="#fff" opacity=".95"/><path d="M14 11H7a7 7 0 0 0 7 9M34 11h7a7 7 0 0 1-7 9" fill="none" stroke="#fff" stroke-width="3"/><path d="M24 28v7M16 40h16" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M24 11l2 4 4 .5-3 3 .8 4-3.8-2-3.8 2 .8-4-3-3 4-.5z" fill="currentColor"/></svg>',
    langues: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="18" fill="#fff" opacity=".95"/><path d="M6 24h36M24 6c-6 6-6 30 0 36M24 6c6 6 6 30 0 36M9 15h30M9 33h30" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
    bibliotheque: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="7" y="8" width="8" height="32" rx="2" fill="#fff" opacity=".95"/><rect x="17" y="12" width="8" height="28" rx="2" fill="#fff" opacity=".8"/><path d="M28 13l7-2 7 27-7 2z" fill="#fff" opacity=".95"/><path d="M9 14h4M19 18h4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M5 42h38" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>',
    comptines: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M20 8v24" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M20 8l16-4v22" fill="none" stroke="#fff" stroke-width="4" stroke-linejoin="round"/><ellipse cx="14" cy="33" rx="7" ry="6" fill="#fff"/><ellipse cx="30" cy="27" rx="7" ry="6" fill="#fff" opacity=".9"/><circle cx="38" cy="40" r="3" fill="currentColor"/></svg>',
    jeux: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="18" fill="#fff" opacity=".95"/><path d="M15 14c4 1 6 4 5 7s-5 3-5 7 4 5 3 8M30 10c-2 4 1 6 4 7s3 5 1 8-6 2-6 6 2 5 4 6" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M34 32l3 7 2-3 3 1z" fill="currentColor"/></svg>',
    plume: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M38 6C22 8 13 19 11 36l4 1c1-5 3-9 6-12 0 0 7-1 11-6-3 0-6 0-8-1 5 0 10-2 13-7-2 0-4 0-6-1 4-1 6-3 7-4z" fill="#fff"/><path d="M8 42l7-7" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>',
  };
  function ecranAccueil() {
    if (!enfant) return ecranEnfants();
    majBarre(); document.title = `${enfant.prenom} · Aide aux devoirs`;
    const nv = niveauXP(enfant.xp || 0), sr = serie(), tj = taches(jour()), restantes = tj.filter(t => !t.fait);
    const aFaire = cartable().filter(i => i.type === "devoir" && !i.fait).length;
    const defisPrets = listeDefis().filter(d => d.fini && !d.recupere).length;
    const prochain = cartable().filter(i => i.type === "controle" && i.date && ecart(jour(), i.date) >= 0 && ecart(jour(), i.date) <= 3).sort((a, b) => a.date < b.date ? -1 : 1)[0];
    const heure = new Date().getHours();
    let msg;
    if (maternelle()) msg = `Coucou ${esc(enfant.prenom)} ! On joue ensemble ? Choisis un jeu.`;
    else if (prochain) msg = `Ton contrôle « ${esc(prochain.titre)} » est ${dateLisible(prochain.date)}. On révise un peu ?`;
    else if (restantes.length) msg = `Tu as ${restantes.length} chose${restantes.length > 1 ? "s" : ""} à faire aujourd'hui. On commence ?`;
    else msg = `Tout est fait pour aujourd'hui, bravo ! Tu peux relever un défi ou t'entraîner.`;
    const tuiles = maternelle()
      ? [["entrainement", "Je joue", "Compter, les lettres, les couleurs…", ""], ["langues", "Les langues", "Anglais, espagnol, italien, arabe", ""], ["comptines", "Mes comptines", "Écouter, chanter, apprendre par cœur", ""], ["bibliotheque", "Mes histoires", "Contes et fables à écouter", ""], ["jeux", "Jeux et monde", "Drapeaux, mémo, lettres", ""], ["defis", "Mes défis", "Gagne des badges", defisPrets]]
      : [["jour", "Aujourd'hui", "Mon planning de révisions", restantes.length], ["cartable", "Mon cartable", "Mes devoirs et mes leçons", aFaire],
        ["entrainement", "Je m'entraîne", `Le programme de ${NIVEAUX[enfant.niveau]}`, ""], ["langues", "Langues du monde", "Anglais, espagnol, italien, arabe", Object.keys(LG.LANGUES).reduce((s, l) => s + motsDus(l).length, 0) || ""], ["bibliotheque", "Bibliothèque", "Livres, dictionnaires, conjugaison", ""], ["jeux", "Jeux et atlas", "Carte du monde, capitales, jeux de lettres", ""], ["defis", "Mes défis", "Défis de la semaine et du mois", defisPrets]]
        .concat(iaDispo() ? [["plume", "Demander à Plume", "Mon tuteur pour les devoirs", ""]] : []);
    rendre(`<section class="page">
      <div class="heros">
        <div class="avatar-grand">${avatar(enfant)}</div>
        <div class="heros-texte">
          <h1>${heure >= 18 ? "Bonsoir" : "Bonjour"} ${esc(enfant.prenom)} !</h1>
          <div class="niveau-ligne"><span class="pill">Niveau ${nv.l} · ${nv.titre}</span>
            <span class="xpbar" role="progressbar" aria-label="Expérience" aria-valuenow="${nv.dans}" aria-valuemax="${nv.pas}"><i style="width:${Math.round(100 * nv.dans / nv.pas)}%"></i></span>
            <small class="doux">${nv.dans} / ${nv.pas} XP</small></div>
          <div class="compteurs"><span title="Jours de suite"><span class="emo">🔥</span> ${sr} jour${sr > 1 ? "s" : ""}</span><span><span class="emo">⭐</span> ${totalEtoiles(enfant.id)}</span><span><span class="emo">🏅</span> ${(D.badges[enfant.id] || []).length} badge${(D.badges[enfant.id] || []).length > 1 ? "s" : ""}</span></div>
        </div>
        ${enfantDuCompte() ? "" : `<button class="btn-discret" id="changer" type="button">Changer</button>`}
      </div>
      <div class="plume-dit"><span class="plume-mini">${ICO.plume}</span><p>${msg}</p><span class="rangee">${"speechSynthesis" in window ? `<button class="btn-discret" id="dire" type="button" aria-label="Écouter">${ICO.son}</button>` : ""}<button class="btn gros vert" id="go" type="button">C'est parti !</button></span></div>
      <div class="grandes-tuiles" data-n="${tuiles.length}">${tuiles.map(([k, t, s, n]) => `<button class="tuile-grande t-${k}" data-t="${k}" type="button">
        <span class="tg-ico">${TUILE_ICO[k]}</span><span class="tg-txt"><b>${t}</b><small>${s}</small></span>${n ? `<span class="tg-badge">${n}</span>` : ""}</button>`).join("")}</div>
    </section>`);
    if ($("#changer")) $("#changer").onclick = ecranEnfants;
    if ($("#dire")) $("#dire").onclick = () => parler(msg);
    $("#go").onclick = () => {
      const x = maternelle() ? null : restantes[0];
      if (!x) { const ex = exerciceDuJour(jour()); return ex ? lancerSeance(ex, null, null, null, { retour: ecranAccueil }) : ecranEntrainement(); }
      if (x.type === "devoir" || x.type === "revision") ecranItem(x.it);
      else if (x.type === "cartes") ecranCartes(actifs().filter(i => i.type !== "devoir"));
      else if (x.type === "langue") lancerLangue(x.l, null, "revision");
      else lancerSeance(x.ex, null, null, null, { retour: ecranAccueil });
    };
    if (maternelle() && D.reglages.lectureAuto) setTimeout(() => parler(msg), 300);
    app.querySelectorAll(".tuile-grande").forEach(b => b.onclick = () => ({ jour: ecranPlanning, cartable: ecranCartable, entrainement: ecranEntrainement, langues: () => { const d = enfant.derniereLangue; d && LG.LANGUES[d] ? ecranLangue(d) : ecranLangues(); }, defis: ecranDefis, bibliotheque: ecranBibliotheque, jeux: ecranJeux, comptines: ecranComptines, plume: () => ecranPlume() })[b.dataset.t]());
  }
  const entete = (titre, sous, couleur) => `<div class="entete"><div><button class="retour-lien" id="retour" type="button">${ICO.retour} Accueil</button>
    <h1${couleur ? ` style="color:${couleur}"` : ""}>${titre}</h1>${sous ? `<p class="doux">${sous}</p>` : ""}</div></div>`;

  // =====================================================================
  //  CARTABLE : devoirs, leçons, contrôles
  // =====================================================================
  const TYPES = { devoir: ["Un devoir à faire", "Exercices, rédaction, recherche…", "📝"], lecon: ["Une leçon à apprendre", "Leçon, poésie, vocabulaire, dates…", "📖"], controle: ["Un contrôle à préparer", "Évaluation, interrogation, dictée…", "🎯"] };
  const matieresNiveau = () => { const n = enfant.niveau, p = Object.keys((PROGRAMME.P[n] || {}).matieres || {}); const ex = [...new Set(EXOS.pourNiveau(n).map(e => e.matiere))];
    return [...new Set([...p, ...ex])].filter(m => MATIERES[m]); };
  function actifs() { return cartable().filter(i => !(i.date && ecart(i.date, jour()) > 2 && (i.type !== "devoir" || i.fait)) && !(i.type === "devoir" && i.fait && ecart(i.faitLe || jour(), jour()) > 1)); }

  function ecranCartable() {
    const tous = cartable(), act = actifs();
    const groupes = maternelle()
      ? [["Mes comptines et poésies", act]]
      : [["À faire", act.filter(i => i.type === "devoir").sort(parDate)], ["Contrôles à préparer", act.filter(i => i.type === "controle").sort(parDate)],
        ["Leçons à apprendre", act.filter(i => i.type === "lecon").sort(parDate)]];
    const anciens = tous.filter(i => !act.includes(i));
    rendre(`<section class="page etroite">
      ${entete(maternelle() ? "Mes comptines" : "Mon cartable", maternelle() ? "Un adulte ajoute la comptine, tu l'écoutes et tu l'apprends." : "Ajoute tes devoirs et tes leçons : je t'aide à les apprendre et je prépare ton planning.")}
      <div class="rangee"><button class="btn gros" id="ajouter" type="button"><span class="emo">➕</span> ${maternelle() ? "Ajouter une comptine" : "Ajouter un devoir ou une leçon"}</button><button class="btn second" id="choisir-poesie" type="button"><span class="emo">📜</span> ${maternelle() ? "Choisir une comptine" : "Choisir une poésie à apprendre"}</button></div>
      ${tous.length ? groupes.map(([t, l]) => `<div class="sections"><h2 class="cursive titre-groupe">${t}</h2>${l.length ? `<div class="liste-items">${l.map(carteItem).join("")}</div>` : `<p class="doux" style="margin:0">Rien pour l'instant.</p>`}</div>`).join("")
        : `<div class="feuille vide-etat"><div class="grosse-emo"><span class="emo">🎒</span></div><p>Ton cartable est vide.<br>Ajoute ${maternelle() ? "une comptine" : "ta prochaine leçon ou ton prochain devoir"} pour commencer !</p></div>`}
      ${anciens.length ? `<details class="anciens"><summary>Terminés (${anciens.length})</summary><div class="liste-items">${anciens.map(carteItem).join("")}</div></details>` : ""}
    </section>`);
    $("#retour").onclick = ecranAccueil;
    $("#ajouter").onclick = () => maternelle() ? ecranAjout("lecon") : ecranAjout();
    $("#choisir-poesie").onclick = ecranComptines;
    app.querySelectorAll(".item[data-id]").forEach(b => b.onclick = () => ecranItem(cartable().find(i => i.id === b.dataset.id)));
  }
  const parDate = (a, b) => (a.date || "9999") < (b.date || "9999") ? -1 : 1;
  function maitrise(it) {
    if (it.type === "devoir") return it.fait ? 100 : 0;
    if (it.cartes && it.cartes.length) return Math.round(100 * it.cartes.reduce((s, c) => s + (Math.min(c.b, 5) - 1) / 4, 0) / it.cartes.length);
    const n = new Set(journal().filter(x => x.t === "revision" && x.id === it.id).map(x => x.d)).size;
    return Math.min(100, n * 25);
  }
  function carteItem(it) {
    const m = maitrise(it), retard = it.type === "devoir" && !it.fait && it.date && ecart(jour(), it.date) < 0;
    return `<button class="item" data-id="${it.id}" type="button" style="--m:${(MATIERES[it.matiere] || ["", "var(--encre)"])[1]}">
      <span class="item-ico"><span class="emo">${TYPES[it.type][2]}</span></span>
      <span class="item-txt"><b>${esc(it.titre)}</b><small>${lab(it.matiere)}${it.date ? ` · ${it.type === "devoir" ? "pour" : it.type === "controle" ? "contrôle" : "à savoir pour"} ${dateLisible(it.date)}` : ""}</small></span>
      ${it.type === "devoir" ? `<span class="etat ${it.fait ? "ok" : retard ? "retard" : ""}">${it.fait ? "Fait ✓" : retard ? "En retard" : "À faire"}</span>` : `<span class="mini-maitrise" title="Je connais à ${m} %"><i style="width:${m}%"></i></span>`}
    </button>`;
  }

  // ---------- ajout / modification ----------
  function ecranAjout(type, it, pre) {
    if (!type && !it) {
      rendre(`<section class="page etroite">${entete("Qu'est-ce que tu ajoutes ?")}
        <div class="choix-type">${Object.entries(TYPES).map(([k, [t, s, e]]) => `<button class="type-btn" data-k="${k}" type="button"><span class="emo">${e}</span><b>${t}</b><small>${s}</small></button>`).join("")}</div></section>`);
      $("#retour").onclick = ecranCartable;
      app.querySelectorAll(".type-btn").forEach(b => b.onclick = () => ecranAjout(b.dataset.k, null, pre));
      return;
    }
    type = it ? it.type : type;
    const mats = matieresNiveau();
    const v = it || Object.assign({ matiere: mats[0], theme: "", titre: "", date: type === "lecon" ? "" : ajoute(jour(), 1), texte: "", photos: [] }, pre || {});
    let photos = (v.photos || []).slice();
    const ph = { devoir: "Recopie la consigne. Ex. : « Exercices 3 et 4 page 42 »", lecon: maternelle() ? "Écris la comptine, une ligne par vers." : "Recopie ta leçon, ou prends-la en photo.", controle: "Sur quoi porte le contrôle ? Recopie les points à savoir." }[type];
    rendre(`<section class="page etroite">${entete(it ? "Modifier" : TYPES[type][0])}
      <form class="feuille sections" id="fa">
        ${maternelle() ? "" : `<div class="champ"><span class="label">Matière</span><div class="puces" id="a-mats">${mats.map(m => `<button type="button" class="puce" data-m="${m}" aria-pressed="${m === v.matiere}" style="--m:${MATIERES[m][1]}">${lab(m)}</button>`).join("")}</div></div>
        <div class="champ"><label for="a-theme">Chapitre du programme <small class="doux">(facultatif)</small></label><select id="a-theme"></select></div>`}
        <div class="champ"><label for="a-titre">Titre</label><input id="a-titre" maxlength="80" value="${esc(v.titre)}" placeholder="${type === "devoir" ? "Ex. : Exercices de fractions" : maternelle() ? "Ex. : Une souris verte" : "Ex. : Les volcans"}"></div>
        ${maternelle() ? "" : `<div class="champ"><label for="a-date">${type === "devoir" ? "Pour quand ?" : type === "controle" ? "Date du contrôle" : "À savoir pour quand ? (facultatif)"}</label>
          <div class="rangee"><input id="a-date" type="date" value="${v.date || ""}" style="max-width:220px">
          ${[["Demain", 1], ["Après-demain", 2], ["Dans une semaine", 7]].map(([l, n]) => `<button type="button" class="puce" data-j="${n}">${l}</button>`).join("")}</div></div>`}
        <div class="champ"><label for="a-texte">${type === "devoir" ? "La consigne" : maternelle() ? "Le texte de la comptine" : "Le contenu"}</label><textarea id="a-texte" rows="7" placeholder="${ph}">${esc(v.texte)}</textarea></div>
        ${maternelle() ? "" : `<div class="champ"><span class="label">Photos <small class="doux">(jusqu'à 4)</small></span><div class="vignettes" id="a-vign"></div>
          <input type="file" id="a-file" accept="image/*" capture="environment" multiple hidden><div class="rangee"><button class="btn second petit" type="button" id="a-photo">${ICO.photo} Prendre ou ajouter une photo</button></div></div>`}
        <p id="a-err" class="doux" aria-live="polite" style="margin:0"></p>
        <div class="rangee"><button class="btn gros" type="submit">${it ? "Enregistrer" : "Ajouter à mon cartable"}</button><button class="btn second" type="button" id="a-ann">Annuler</button></div>
      </form></section>`);
    let matiere = v.matiere;
    const majThemes = () => { if (!$("#a-theme")) return; const th = PROGRAMME.themes(enfant.niveau, matiere);
      $("#a-theme").innerHTML = `<option value="">— Choisir un chapitre —</option>` + th.map(([t]) => `<option ${t === v.theme ? "selected" : ""}>${esc(t)}</option>`).join("") + `<option value="">Autre chapitre</option>`; };
    majThemes();
    app.querySelectorAll("#a-mats .puce").forEach(b => b.onclick = () => { matiere = b.dataset.m; app.querySelectorAll("#a-mats .puce").forEach(x => x.setAttribute("aria-pressed", x === b)); majThemes(); });
    app.querySelectorAll("[data-j]").forEach(b => b.onclick = () => $("#a-date").value = ajoute(jour(), +b.dataset.j));
    const majVign = () => { if (!$("#a-vign")) return; $("#a-vign").innerHTML = photos.map((p, i) => `<span class="vign"><img src="data:${p.type};base64,${p.data}" alt="Photo ${i + 1}"><button type="button" data-i="${i}" aria-label="Retirer la photo ${i + 1}">×</button></span>`).join("");
      $("#a-vign").querySelectorAll("button").forEach(b => b.onclick = () => { photos.splice(+b.dataset.i, 1); majVign(); }); };
    majVign();
    if ($("#a-photo")) { $("#a-photo").onclick = () => $("#a-file").click();
      $("#a-file").onchange = async e => { for (const f of [...e.target.files].slice(0, 4 - photos.length)) { try { photos.push(await reduireImage(f, 1400)); } catch { toast("Une image n'a pas pu être lue."); } } majVign(); e.target.value = ""; }; }
    $("#a-ann").onclick = () => it ? ecranItem(it) : ecranCartable();
    $("#fa").onsubmit = e => {
      e.preventDefault();
      const theme = $("#a-theme") ? $("#a-theme").value : "", texte = $("#a-texte").value.trim();
      const titre = $("#a-titre").value.trim() || theme || (type === "devoir" ? "Devoir de " : "Leçon de ") + lab(matiere).toLowerCase();
      const date = $("#a-date") ? $("#a-date").value : "";
      if (!texte && !photos.length && type !== "devoir") { $("#a-err").textContent = "Écris le contenu ou ajoute une photo, pour que je puisse t'aider à l'apprendre."; return; }
      if (type === "controle" && !date) { $("#a-err").textContent = "Indique la date du contrôle pour que je prépare ton planning."; return; }
      const nouveau = !it;
      it = it || { id: uid(), type, cree: jour(), fait: false, cartes: [], fiche: null };
      const texteChange = it.texte !== texte;
      Object.assign(it, { matiere: maternelle() ? "francais" : matiere, theme, titre, date, texte, photos });
      if (texteChange && texte) genererAuto(it);
      if (nouveau) { cartable().unshift(it); noter("ajout", { id: it.id }); }
      sauver();
      if (nouveau) gagner(5, "ajouté au cartable");
      ecranItem(it);
    };
  }

  // ---------- fiche automatique (hors ligne) ----------
  function phrasesDe(texte) {
    return texte.replace(/\r/g, "").split(/\n+/).flatMap(l => l.split(/(?<=[.!?;])\s+(?=[A-ZÀ-ÖØ-Þ0-9«"])/)).map(s => s.trim()).filter(s => s.length > 2);
  }
  function genererAuto(it) {
    const ph = phrasesDe(it.texte);
    const score = s => (/\b(1[0-9]{3}|20[0-9]{2})\b/.test(s) ? 3 : 0) + (/\b(est|sont|signifie|désigne|s'appelle|appelle|définit)\b/i.test(s) ? 2 : 0) + (/:/.test(s) ? 1 : 0)
      + (/\d/.test(s) ? 1 : 0) + (/\s[A-ZÀ-Ö][a-zà-ÿ]{2,}/.test(s) ? 1 : 0) + (s.length > 30 && s.length < 180 ? 1 : 0);
    const notes = ph.map((s, i) => [s, score(s), i]).filter(x => x[1] >= 2).sort((a, b) => b[1] - a[1]).slice(0, 7).sort((a, b) => a[2] - b[2]).map(x => x[0]);
    it.auto = { points: notes.length ? notes : ph.slice(0, 5) };
    const cartes = [];
    for (const s of ph) {
      if (cartes.length >= 15) break;
      let m;
      if ((m = s.match(/^([^:=]{1,50}?)\s*[:=]\s*(.{1,120})$/)) && !/^(ex|exemple|attention|remarque)/i.test(m[1])) cartes.push({ q: m[1].trim(), r: m[2].trim() });
      else if ((m = s.match(/\b(1[0-9]{3}|20[0-9]{2})\b/))) cartes.push({ q: s.replace(m[1], "____"), r: m[1], trou: true });
      else if ((m = s.match(/^(.{3,60}?)\s+(est|sont|signifie|désigne)\s+(.{6,})$/i))) cartes.push({ q: `${m[1].replace(/[.,;]$/, "")} ${m[2]}…`, r: s });
      else if (s.split(" ").length >= 6) {
        const mots = s.split(/\s+/), cand = mots.map((w, i) => [w.replace(/[^\p{L}\p{N}'-]/gu, ""), i]).filter(([w, i]) => w.length >= 7 || (i > 0 && /^[A-ZÀ-Ö]/.test(w) && w.length > 2));
        if (cand.length) { const [w] = cand.sort((a, b) => b[0].length - a[0].length)[0]; cartes.push({ q: s.replace(w, "____"), r: w, trou: true }); }
      }
    }
    const garder = (it.cartes || []).filter(c => c.m || c.ia);
    it.cartes = garder.concat(cartes.map(c => Object.assign(c, { b: 1, p: jour(), a: true })));
  }

  // ---------- fiche avec Plume ----------
  async function creerFicheIA(it) {
    const n = enfant.niveau, contenu = [];
    (it.photos || []).slice(0, 4).forEach(p => contenu.push({ type: "image", source: { type: "base64", media_type: p.type, data: p.data } }));
    contenu.push({ type: "text", text: `Tu aides ${enfant.prenom}, élève de ${NIVEAUX[n]} (programme officiel de l'Éducation nationale ${PROGRAMME.ANNEE}), à ${it.type === "controle" ? "préparer un contrôle" : "apprendre une leçon"} de ${lab(it.matiere)}${it.theme ? ` (chapitre du programme : ${it.theme})` : ""} : « ${it.titre} ».
${it.texte ? "Contenu écrit par l'élève :\n" + it.texte.slice(0, 12000) + "\n" : ""}${it.photos && it.photos.length ? "La leçon est aussi sur les photos jointes : base-toi d'abord sur leur contenu.\n" : ""}
Prépare une fiche de révision pour un enfant d'environ ${age(n)} ans, fidèle au contenu (n'invente pas de notions absentes ; si le contenu est très court, complète seulement avec l'essentiel du programme de ${NIVEAUX[n]} sur ce chapitre).
Réponds UNIQUEMENT avec ce JSON :
{"resume":["5 à 8 points importants, en phrases courtes"],"cartes":[{"q":"question courte","r":"réponse courte"}],"quiz":[{"question":"…","options":["…","…","…","…"],"bonne":0,"explication":"…"}],"conseil":"une astuce concrète pour retenir cette leçon"}
Mets 6 à 12 cartes et 6 à 8 questions de quiz. Formules éventuelles en LaTeX entre $...$.` });
    const t = await appelClaude({ model: D.reglages.modele, max_tokens: 6000, messages: [{ role: "user", content: contenu }] });
    const j = JSON.parse((t.match(/\{[\s\S]*\}/) || [""])[0]);
    const quiz = (j.quiz || []).filter(q => Array.isArray(q.options) && q.options.length >= 2 && q.options[q.bonne] != null);
    it.fiche = { resume: (j.resume || []).map(String).slice(0, 10), quiz, conseil: String(j.conseil || ""), le: jour() };
    const cartesIA = (j.cartes || []).filter(c => c && c.q && c.r).slice(0, 15).map(c => ({ q: String(c.q), r: String(c.r), b: 1, p: jour(), ia: true }));
    it.cartes = (it.cartes || []).filter(c => c.m).concat(cartesIA.length ? cartesIA : (it.cartes || []).filter(c => c.a));
    sauver();
  }

  // ---------- détail d'un élément ----------
  function ecranItem(it) {
    if (!it) return ecranCartable();
    const mat = MATIERES[it.matiere] || ["", "var(--encre)"], m = maitrise(it);
    const points = it.fiche ? it.fiche.resume : it.auto ? it.auto.points : [];
    const dues = (it.cartes || []).filter(c => c.p <= jour()).length;
    const peutQuiz = (it.fiche && it.fiche.quiz.length) || (it.cartes || []).length >= 4;
    const modes = it.type === "devoir" ? [] : [
      ["lire", "📖", "Lire et écouter", "Revoir la leçon"],
      ...(maternelle() ? [] : [["cartes", "🃏", "Cartes mémo", it.cartes.length ? `${it.cartes.length} carte${it.cartes.length > 1 ? "s" : ""}${dues ? ` · ${dues} à revoir` : ""}` : "Ajoute tes cartes"]]),
      ...(it.texte ? [["parcoeur", "🎤", "Apprendre par cœur", "Cacher les mots petit à petit"]] : []),
      ...(it.texte && (comptineDe(it) || (maternelle() && it.type === "lecon")) ? [["chanter", "🎵", "Chanter", "Écouter la chanson"]] : []),
      ...(!maternelle() && peutQuiz ? [["quiz", "❓", "Quiz", it.fiche && it.fiche.quiz.length ? `${it.fiche.quiz.length} questions` : "Avec mes cartes"]] : []),
    ];
    rendre(`<section class="page etroite">
      <div class="entete"><div><button class="retour-lien" id="retour" type="button">${ICO.retour} Mon cartable</button>
        <span class="label" style="color:${mat[1]}">${lab(it.matiere)}${it.theme ? " · " + esc(it.theme) : ""}</span><h1>${esc(it.titre)}</h1>
        <p class="doux">${TYPES[it.type][0].replace(/^Une? /, "").replace(/^./, c => c.toUpperCase())}${it.date ? ` · ${it.type === "devoir" ? "pour" : it.type === "controle" ? "le" : "à savoir pour"} ${dateLisible(it.date)}` : ""}</p></div>
        <div class="rangee"><button class="btn-discret" id="modif" type="button">Modifier</button><button class="btn-discret" id="suppr" type="button">Supprimer</button></div></div>
      <div id="conf"></div>
      ${it.type === "devoir" ? `<div class="feuille sections">
          ${it.texte ? `<div class="texte-lecon">${esc(it.texte).replace(/\n/g, "<br>")}</div>` : ""}${photosHtml(it)}
          <div class="rangee">${it.fait ? `<span class="etat ok gros">Fait ✓</span><button class="btn second" id="defaire" type="button">Pas encore fini</button>` : `<button class="btn gros vert" id="fini" type="button">J'ai fini ce devoir ✓</button>`}
          ${iaDispo() ? `<button class="btn second" id="aide" type="button">${ICO.plume.replace('width="40" height="40"', 'width="22" height="22"')} Aide-moi avec Plume</button>` : ""}</div></div>`
        : `<div class="feuille maitrise-carte"><div><b>Je la connais à ${m} %</b><span class="barre-maitrise"><i style="width:${m}%"></i></span></div>
            ${!maternelle() && iaDispo() && (it.texte || (it.photos || []).length) ? `<button class="btn ${it.fiche ? "second" : ""}" id="fiche" type="button">${it.fiche ? "Refaire ma fiche avec Plume" : "Créer ma fiche avec Plume ✨"}</button>` : ""}</div>
          <p id="fiche-etat" class="doux" aria-live="polite" style="margin:0"></p>
          <div class="modes">${modes.map(([k, e, t, s]) => `<button class="mode" data-k="${k}" type="button"><span class="emo">${e}</span><b>${t}</b><small>${s}</small></button>`).join("")}</div>
          ${points.length ? `<div class="feuille sections"><h2>${it.fiche ? "Ma fiche : les points importants" : "Les points importants"}</h2><ul class="points">${points.map(p => `<li>${esc(p)}</li>`).join("")}</ul>
            ${it.fiche && it.fiche.conseil ? `<div class="note-info"><b>Astuce de Plume :</b> ${esc(it.fiche.conseil)}</div>` : ""}
            ${!it.fiche ? `<p class="doux" style="margin:0">Repérés automatiquement dans ton texte.${iaDispo() ? " Pour une vraie fiche, demande à Plume." : ""}</p>` : ""}</div>` : ""}`}
    </section>`);
    $("#retour").onclick = ecranCartable;
    $("#modif").onclick = () => ecranAjout(null, it);
    $("#suppr").onclick = () => { $("#conf").innerHTML = `<div class="confirmer"><span>Supprimer « ${esc(it.titre)} » de ton cartable ?</span><button class="btn danger petit" id="c-oui" type="button">Supprimer</button><button class="btn second petit" id="c-non" type="button">Annuler</button></div>`;
      $("#c-non").onclick = () => $("#conf").innerHTML = ""; $("#c-oui").onclick = () => { D.cartable[enfant.id] = cartable().filter(x => x !== it); sauver(); ecranCartable(); }; };
    if ($("#fini")) $("#fini").onclick = () => { it.fait = true; it.faitLe = jour(); noter("devoir", { id: it.id, aTemps: !it.date || jour() <= it.date }); sauver(); gagner(10, "devoir terminé"); ecranItem(it); };
    if ($("#defaire")) $("#defaire").onclick = () => { it.fait = false; sauver(); ecranItem(it); };
    if ($("#aide")) $("#aide").onclick = () => ecranPlume(`Voici mon devoir de ${lab(it.matiere).toLowerCase()}${it.date ? " pour " + dateLisible(it.date) : ""} : « ${it.titre} ».${it.texte ? "\n" + it.texte : ""}\nPeux-tu m'aider à le faire, sans me donner les réponses ?`, it.matiere, (it.photos || [])[0]);
    if ($("#fiche")) $("#fiche").onclick = async () => {
      const b = $("#fiche"); b.disabled = true; $("#fiche-etat").textContent = "Plume lit ta leçon et prépare ta fiche… (20 à 40 secondes)";
      try { await creerFicheIA(it); ecranItem(it); toast("Ta fiche est prête !"); }
      catch (e) { b.disabled = false; $("#fiche-etat").textContent = e instanceof SyntaxError ? "Plume s'est emmêlé les crayons. Réessaie." : e.message; }
    };
    app.querySelectorAll(".mode").forEach(b => b.onclick = () => ({ lire: ecranLire, cartes: () => ecranCartes([it]), parcoeur: ecranParCoeur, quiz: quizItem, chanter: chanterItem })[b.dataset.k](it));
    app.querySelectorAll(".photos img").forEach(img => img.onclick = () => zoom(img.src));
  }
  const comptineDe = it => it.comptine ? (window.COMPTINES || []).find(c => c.id === it.comptine) : null;
  function chanterItem(it) {
    const c = comptineDe(it);
    if (c) return ecranTexte(c);
    ecranTexte({ id: "i-" + it.id, item: it, titre: it.titre, auteur: "Ma comptine", lg: "fr", type: "comptine", emoji: "🎵", texte: it.texte });
  }
  const photosHtml = it => (it.photos || []).length ? `<div class="photos">${it.photos.map((p, i) => `<img src="data:${p.type};base64,${p.data}" alt="Photo ${i + 1}" tabindex="0">`).join("")}</div>` : "";
  function zoom(src) { const z = document.createElement("div"); z.className = "zoom"; z.innerHTML = `<img src="${src}" alt="Photo agrandie"><button class="btn" type="button">Fermer</button>`; document.body.appendChild(z); z.onclick = () => z.remove(); }
  function revisionFaite(it, mode, extra) {
    const deja = journal().some(x => x.t === "revision" && x.id === it.id && x.d === jour());
    noter("revision", Object.assign({ id: it.id, mode }, extra || {}));
    sauver();
    if (!deja) gagner(15, "révision"); else verifierBadges();
  }

  // ---------- lire et écouter ----------
  function ecranLire(it) {
    const points = it.fiche ? it.fiche.resume : it.auto ? it.auto.points : [];
    rendre(`<section class="page etroite">
      <div class="entete"><div><button class="retour-lien" id="retour" type="button">${ICO.retour} ${esc(it.titre)}</button><h1>Je relis ma leçon</h1></div></div>
      <div class="feuille sections">
        <div class="rangee">${"speechSynthesis" in window ? `<button class="btn second" id="ecouter" type="button">${ICO.son} Écouter</button>${points.length && it.texte ? `<button class="btn second" id="ecouter-pts" type="button">${ICO.son} L'essentiel</button>` : ""}<button class="btn-discret" id="stop" type="button">Stop</button>` : ""}</div>
        ${it.texte ? `<div class="texte-lecon grand">${esc(it.texte).replace(/\n/g, "<br>")}</div>` : ""}${photosHtml(it)}
        ${points.length && !maternelle() ? `<h2>L'essentiel</h2><ul class="points">${points.map(p => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
        <div class="rangee"><button class="btn gros vert" id="lu" type="button">J'ai bien relu ✓</button></div>
      </div></section>`);
    maths(app);
    $("#retour").onclick = () => { speechSynthesis?.cancel?.(); ecranItem(it); };
    if ($("#ecouter")) $("#ecouter").onclick = () => parler(esc(it.texte || points.join(". ")));
    if ($("#ecouter-pts")) $("#ecouter-pts").onclick = () => parler(esc(points.join(". ")));
    if ($("#stop")) $("#stop").onclick = () => speechSynthesis.cancel();
    if (maternelle() && D.reglages.lectureAuto && it.texte) setTimeout(() => parler(esc(it.texte)), 300);
    app.querySelectorAll(".photos img").forEach(img => img.onclick = () => zoom(img.src));
    $("#lu").onclick = () => { speechSynthesis?.cancel?.(); revisionFaite(it, "lire"); ecranItem(it); };
  }

  // ---------- par cœur ----------
  function ecranParCoeur(it, niveau = 0) {
    const lignes = it.texte.split(/\n/);
    let idx = 0;
    const html = lignes.map(l => l.split(/(\s+)/).map(tok => {
      if (!tok.trim()) return tok;
      const i = idx++, cache = niveau >= 4 || (niveau > 0 && hash(it.id + i) % 4 < niveau);
      const mot = esc(tok);
      if (!cache) return `<span class="mot">${mot}</span>`;
      const lettre = niveau < 4 ? esc(tok.replace(/^[«"'(]+/, "").charAt(0)) : "";
      return `<button type="button" class="mot cache" data-mot="${mot}">${lettre}<span class="tirets">${"_".repeat(Math.max(2, Math.min(8, tok.length - 1)))}</span></button>`;
    }).join("")).join("<br>");
    const noms = ["Je lis tout", "Un mot sur quatre caché", "Un mot sur deux caché", "Presque tout caché", "Tout est caché"];
    rendre(`<section class="page etroite">
      <div class="entete"><div><button class="retour-lien" id="retour" type="button">${ICO.retour} ${esc(it.titre)}</button><h1>J'apprends par cœur</h1>
        <p class="doux">Lis, puis cache de plus en plus de mots. Touche un mot caché pour le voir.</p></div></div>
      <div class="feuille sections">
        <div class="paliers">${noms.map((n, k) => `<span class="palier ${k <= niveau ? "on" : ""}" title="${n}"></span>`).join("")}<b>${noms[niveau]}</b></div>
        <div class="texte-lecon grand parcoeur">${html}</div>
        <div class="rangee">
          ${niveau > 0 ? `<button class="btn second" id="moins" type="button">Moins caché</button>` : ""}
          ${niveau < 4 ? `<button class="btn" id="plus" type="button">Cacher plus de mots</button>` : `<button class="btn gros vert" id="connu" type="button">Je la connais par cœur !</button>`}
          ${"speechSynthesis" in window ? `<button class="btn-discret" id="ecouter" type="button">${ICO.son} Écouter</button>` : ""}
        </div></div></section>`);
    $("#retour").onclick = () => { speechSynthesis?.cancel?.(); ecranItem(it); };
    app.querySelectorAll(".mot.cache").forEach(b => b.onclick = () => { b.classList.add("vu"); b.textContent = b.dataset.mot.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'"); });
    if ($("#plus")) $("#plus").onclick = () => ecranParCoeur(it, niveau + 1);
    if ($("#moins")) $("#moins").onclick = () => ecranParCoeur(it, niveau - 1);
    if ($("#ecouter")) $("#ecouter").onclick = () => parler(esc(it.texte));
    if ($("#connu")) $("#connu").onclick = () => { revisionFaite(it, "parcoeur", { complet: true }); feter("🎤", "Bravo !", `Tu connais « ${it.titre} » par cœur.`); ecranItem(it); };
  }

  // ---------- cartes mémo (répétition espacée) ----------
  const INTERVALLES = [0, 1, 2, 4, 8, 16];
  function cartesDues() { return actifs().filter(i => i.type !== "devoir").flatMap(i => (i.cartes || []).filter(c => c.p <= jour()).map(c => [i, c])); }
  function ecranCartes(items) {
    let file = items.flatMap(i => (i.cartes || []).filter(c => c.p <= jour()).map(c => [i, c]));
    const libre = !file.length;
    if (libre) file = items.flatMap(i => (i.cartes || []).map(c => [i, c]));
    file = file.sort(() => Math.random() - .5).slice(0, 25);
    const seul = items.length === 1 ? items[0] : null;
    const retour = () => seul ? ecranItem(seul) : ecranPlanning();
    if (!file.length) {
      rendre(`<section class="page etroite">${entete("Cartes mémo")}<div class="feuille sections" id="ajout-carte"></div></section>`);
      $("#retour").onclick = retour; formCarte(seul, () => ecranCartes(items)); return;
    }
    let k = 0, sues = 0, revues = 0; const touches = new Set(), aRevoir = [];
    function montrer() {
      if (k >= file.length && aRevoir.length) { file = file.concat(aRevoir.splice(0)); }
      if (k >= file.length) return fin();
      const [it, c] = file[k];
      rendre(`<section class="page etroite">
        <div class="entete"><div><button class="retour-lien" id="retour" type="button">${ICO.retour} ${seul ? esc(seul.titre) : "Planning"}</button><h1>Cartes mémo</h1>
          <p class="doux">${libre ? "Révision libre" : "Les cartes à revoir aujourd'hui"} · ${k + 1} / ${file.length}</p></div></div>
        <div class="flip" id="flip" tabindex="0" role="button" aria-label="Retourner la carte">
          <div class="face recto"><span class="label">${esc(it.titre)}</span><div class="carte-texte">${esc(c.q)}</div><small class="doux">Réfléchis, puis touche la carte pour voir la réponse</small></div>
          <div class="face verso"><span class="label">Réponse</span><div class="carte-texte">${esc(c.r)}</div></div>
        </div>
        <div class="rangee centre" id="boutons" hidden>
          <button class="btn gros rouge" id="non" type="button">Je ne savais pas</button><button class="btn gros vert" id="oui" type="button">Je savais ✓</button></div>
        <div class="rangee centre"><button class="btn-discret" id="ajouter" type="button">+ Ajouter une carte</button></div>
      </section>`);
      maths(app);
      $("#retour").onclick = () => { if (revues) enregistrer(); retour(); };
      const flip = $("#flip"); const tourner = () => { flip.classList.add("tourne"); $("#boutons").hidden = false; $("#oui").focus(); };
      flip.onclick = tourner; flip.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tourner(); } };
      app.onkeydown = e => { if (!$("#boutons") || $("#boutons").hidden) { if (e.key === " " || e.key === "Enter") { e.preventDefault(); tourner(); } return; }
        if (e.key === "ArrowRight") $("#oui").click(); if (e.key === "ArrowLeft") $("#non").click(); };
      $("#oui").onclick = () => { c.b = Math.min(5, (c.b || 1) + 1); c.p = ajoute(jour(), INTERVALLES[c.b]); sues++; suite(it); };
      $("#non").onclick = () => { c.b = 1; c.p = ajoute(jour(), 1); if (!aRevoir.includes(file[k])) aRevoir.push(file[k]); suite(it); };
      $("#ajouter").onclick = () => { rendre(`<section class="page etroite">${entete("Nouvelle carte")}<div class="feuille sections" id="ajout-carte"></div></section>`); $("#retour").onclick = montrer; formCarte(it, montrer); };
      if (D.reglages.lectureAuto && enfant.niveau <= 4) parler(esc(c.q));
    }
    function suite(it) { revues++; touches.add(it); k++; sauver(); montrer(); }
    function enregistrer() { touches.forEach(it => { const n = file.filter(f => f[0] === it).length; revisionFaite(it, "cartes", { cartes: n }); }); touches.clear(); }
    function fin() {
      enregistrer();
      rendre(`<section class="page etroite"><div class="feuille bilan"><div class="grosse-emo"><span class="emo">🃏</span></div><div class="note">${sues} / ${revues}</div>
        <p style="font-size:1.2rem;margin:0">${sues === revues ? "Tu savais tout, bravo !" : "Les cartes ratées reviendront demain. C'est comme ça qu'on retient !"}</p>
        <div class="rangee centre"><button class="btn" id="fin" type="button">Terminer</button></div></div></section>`);
      $("#fin").onclick = retour;
    }
    montrer();
  }
  function formCarte(it, apres) {
    const zone = $("#ajout-carte");
    if (!it) { zone.innerHTML = `<p>Aucune carte à revoir pour l'instant. Ajoute des leçons dans ton cartable !</p>`; return; }
    zone.innerHTML = `<h2>Ajouter une carte à « ${esc(it.titre)} »</h2>
      <div class="champ"><label for="c-q">Question (recto)</label><input id="c-q" maxlength="200" placeholder="Ex. : Capitale de l'Italie ? / to borrow"></div>
      <div class="champ"><label for="c-r">Réponse (verso)</label><input id="c-r" maxlength="300" placeholder="Ex. : Rome / emprunter"></div>
      <div class="rangee"><button class="btn" id="c-ok" type="button">Ajouter la carte</button><button class="btn second" id="c-fin" type="button">Terminé</button></div><p id="c-msg" class="doux" aria-live="polite"></p>`;
    $("#c-q").focus();
    $("#c-ok").onclick = () => { const q = $("#c-q").value.trim(), r = $("#c-r").value.trim(); if (!q || !r) { $("#c-msg").textContent = "Remplis la question et la réponse."; return; }
      it.cartes = it.cartes || []; it.cartes.push({ q, r, b: 1, p: jour(), m: true }); sauver(); $("#c-q").value = ""; $("#c-r").value = ""; $("#c-q").focus(); $("#c-msg").textContent = `Carte ajoutée (${it.cartes.length} au total).`; };
    $("#c-fin").onclick = apres;
  }

  // ---------- quiz d'une leçon ----------
  function quizItem(it) {
    let qs;
    if (it.fiche && it.fiche.quiz.length) qs = it.fiche.quiz.map(q => ({ q: esc(q.question), kind: "qcm", options: shuffle(q.options.map(String)), answer: String(q.options[q.bonne]), expl: esc(q.explication || ""), check: r => r === String(q.options[q.bonne]) }));
    else { const cs = it.cartes.filter(c => !c.trou || it.cartes.filter(x => x.trou).length >= 4);
      qs = shuffle(cs).slice(0, 10).map(c => { const autres = shuffle([...new Set(cs.filter(x => x.r !== c.r).map(x => x.r))]).slice(0, 3);
        return { q: esc(c.q), kind: "qcm", options: shuffle([c.r, ...autres]), answer: c.r, expl: "", check: r => r === c.r }; }); }
    lancerSeance(null, qs, "Quiz : " + it.titre, null, { item: it, matiere: it.matiere, retour: () => ecranItem(it) });
  }
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // =====================================================================
  //  PLANNING
  // =====================================================================
  function sessions(it) {
    const auj = jour();
    if (it.type === "devoir") return [];
    if (it.date) {
      const offs = it.type === "controle" ? [7, 4, 2, 1] : [3, 1];
      let s = offs.map(o => ajoute(it.date, -o)).filter(x => x >= auj && x >= it.cree);
      if (!s.length && it.date >= auj && it.date > it.cree) s = [auj];
      if (!s.length && it.date === auj) s = [auj];
      return [...new Set(s)];
    }
    return [1, 3, 7, 14].map(o => ajoute(it.cree, o));
  }
  function exerciceDuJour(date) {
    const n = enfant.niveau, st = D.stats[enfant.id] || {};
    const ids = [...new Set(Object.values((PROGRAMME.P[n] || {}).matieres || {}).flat().flatMap(t => t[1]))].map(id => EXOS.get(id)).filter(e => e && n >= e.niveaux[0] && n <= e.niveaux[1]);
    const pool = ids.length ? ids : EXOS.pourNiveau(n);
    const faibles = pool.filter(e => st[e.id] && st[e.id].questions >= 5 && st[e.id].justes / st[e.id].questions < .6);
    const jamais = pool.filter(e => !st[e.id]);
    const cand = faibles.length ? faibles : jamais.length ? jamais : pool;
    return melangeGraine(cand, enfant.id + date)[0];
  }
  function taches(date) {
    const t = [], auj = jour();
    for (const it of cartable()) {
      if (it.type === "devoir") {
        if (it.fait) { if (it.faitLe === date) t.push({ type: "devoir", it, titre: it.titre, sous: "Devoir terminé", fait: true }); continue; }
        if (!it.date) { if (date === auj) t.push({ type: "devoir", it, titre: it.titre, sous: "Devoir à faire", fait: false }); continue; }
        const veille = ajoute(it.date, -1), quand = veille < auj ? auj : veille;
        if (quand === date) t.push({ type: "devoir", it, titre: it.titre, sous: it.date < auj ? `En retard (c'était pour ${dateLisible(it.date)})` : `Pour ${dateLisible(it.date)}`, retard: it.date < auj, fait: false });
      } else if (sessions(it).includes(date)) {
        const fait = journal().some(x => x.t === "revision" && x.id === it.id && x.d === date);
        const rang = it.date && it.type === "controle" ? ` · contrôle ${dateLisible(it.date)}` : "";
        t.push({ type: "revision", it, titre: it.titre, sous: (it.type === "controle" ? "Préparer le contrôle" : "Apprendre la leçon") + rang, fait });
      }
    }
    if (date === auj) {
      const dues = cartesDues().length, revuesAuj = journal().filter(x => x.t === "revision" && x.mode === "cartes" && x.d === auj).length;
      if (dues) t.push({ type: "cartes", titre: `Revoir ${dues} carte${dues > 1 ? "s" : ""} mémo`, sous: "Pour ne rien oublier", fait: false });
      else if (revuesAuj) t.push({ type: "cartes", titre: "Cartes mémo du jour", sous: "Toutes revues", fait: true });
    }
    if (date === auj) for (const l of Object.keys(D.langues[enfant.id] || {}).filter(k => LG.LANGUES[k])) {
      const n = motsDus(l).length, fait = journal().some(x => x.t === "seance" && x.lg === l && x.d === auj);
      if (n || fait) t.push({ type: "langue", l, titre: n ? `Revoir ${n} mot${n > 1 ? "s" : ""} en ${LG.LANGUES[l].nom.toLowerCase()}` : `Mots en ${LG.LANGUES[l].nom.toLowerCase()}`, sous: n ? "Révision du jour" : "Révisés aujourd'hui", fait: !n });
    }
    if (date >= auj) for (const ex of exercicesDuJour(date)) t.push({ type: "entrainement", ex, titre: ex.titre, sous: "Révision du jour · " + lab(ex.matiere), fait: journal().some(x => x.t === "seance" && x.d === date && x.ex === ex.id) });
    return t;
  }
  let jourChoisi = null;
  function ecranPlanning() {
    const auj = jour(); jourChoisi = jourChoisi && jourChoisi >= auj ? jourChoisi : auj;
    const semaine = Array.from({ length: 7 }, (_, i) => ajoute(auj, i));
    const liste = taches(jourChoisi);
    const ICO_T = { devoir: "📝", revision: "📖", cartes: "🃏", entrainement: "🎯", langue: "🌍" };
    const bientot = cartable().filter(i => i.date && i.date > ajoute(auj, 6) && i.date <= ajoute(auj, 21) && !(i.type === "devoir" && i.fait)).sort(parDate);
    rendre(`<section class="page etroite">
      ${entete("Mon planning", "Chaque jour, quelques petites choses à faire. C'est le secret pour bien apprendre !")}
      <div class="semaine" role="tablist">${semaine.map(d => { const ts = taches(d), r = ts.filter(x => !x.fait).length, dt = versDate(d);
        return `<button class="jour-btn ${d === jourChoisi ? "choisi" : ""}" data-d="${d}" role="tab" aria-selected="${d === jourChoisi}" type="button"><small>${d === auj ? "Auj." : JOURS[dt.getDay()].slice(0, 3)}</small><b>${dt.getDate()}</b><span class="points-jour">${ts.map(x => `<i class="${x.fait ? "ok" : ""}"></i>`).join("")}</span>${r === 0 && ts.length ? '<span class="tout-ok">✓</span>' : ""}</button>`; }).join("")}</div>
      <div class="feuille sections">
        <h2>${jourChoisi === auj ? "Aujourd'hui" : dateLisible(jourChoisi).replace(/^./, c => c.toUpperCase())}</h2>
        ${liste.length ? `<div class="taches">${liste.map((x, i) => `<div class="tache ${x.fait ? "faite" : ""} ${x.retard ? "retard" : ""}" style="--m:${x.it ? (MATIERES[x.it.matiere] || ["", "var(--encre)"])[1] : x.ex ? MATIERES[x.ex.matiere][1] : x.l ? LG.LANGUES[x.l].couleur : "var(--ia)"}">
            <span class="coche" aria-hidden="true">${x.fait ? "✓" : ""}</span><span class="emo t-ico">${ICO_T[x.type]}</span>
            <span class="tache-txt"><b>${esc(x.titre)}</b><small>${esc(x.sous)}</small></span>
            ${jourChoisi === auj && !x.fait ? `<button class="btn petit" data-i="${i}" type="button">C'est parti</button>` : x.fait ? `<span class="etat ok">Fait</span>` : ""}</div>`).join("")}</div>`
          : `<p class="doux" style="margin:0">Rien de prévu ce jour-là. Ajoute tes devoirs et tes leçons dans ton cartable, je m'occupe du planning !</p>`}
      </div>
      ${bientot.length ? `<div class="feuille sections"><h2>Plus tard</h2><div class="liste-items">${bientot.map(carteItem).join("")}</div></div>` : ""}
      <div class="rangee"><button class="btn second" id="vers-cartable" type="button">Ouvrir mon cartable</button></div>
    </section>`);
    $("#retour").onclick = ecranAccueil;
    $("#vers-cartable").onclick = ecranCartable;
    app.querySelectorAll(".jour-btn").forEach(b => b.onclick = () => { jourChoisi = b.dataset.d; ecranPlanning(); });
    app.querySelectorAll(".tache .btn").forEach(b => b.onclick = () => { const x = liste[+b.dataset.i];
      if (x.type === "devoir" || x.type === "revision") ecranItem(x.it);
      else if (x.type === "cartes") ecranCartes(actifs().filter(i => i.type !== "devoir"));
      else if (x.type === "langue") lancerLangue(x.l, null, "revision");
      else lancerSeance(x.ex, null, null, null, { retour: ecranPlanning }); });
    app.querySelectorAll(".item[data-id]").forEach(b => b.onclick = () => ecranItem(cartable().find(i => i.id === b.dataset.id)));
  }

  // =====================================================================
  //  DÉFIS
  // =====================================================================
  // n : [maternelle, primaire, collège-lycée] ; 0 = défi non proposé
  const DEFIS_H = [
    ["seances", "Fais {n} séances d'entraînement", [2, 4, 5]], ["etoiles", "Gagne {n} étoiles", [4, 8, 10]], ["jours", "Travaille {n} jours différents", [2, 3, 4]],
    ["parfaits", "Réussis {n} séance sans faute", [1, 1, 1]], ["matieres", "Entraîne-toi dans {n} matières", [2, 2, 3]], ["cartes", "Révise {n} cartes mémo", [0, 15, 30]],
    ["revisions", "Révise {n} leçons de ton cartable", [0, 2, 3]], ["devoirs", "Termine {n} devoirs à temps", [0, 2, 3]]];
  const DEFIS_M = [
    ["seances", "Fais {n} séances d'entraînement", [8, 15, 20]], ["etoiles", "Gagne {n} étoiles", [20, 40, 50]], ["jours", "Travaille {n} jours dans le mois", [6, 10, 14]],
    ["troisEtoiles", "Obtiens 3 étoiles dans {n} exercices différents", [2, 4, 6]], ["parfaits", "Réussis {n} séances sans faute", [2, 4, 5]], ["cartes", "Révise {n} cartes mémo", [0, 60, 120]],
    ["revisions", "Révise {n} leçons de ton cartable", [0, 6, 10]], ["devoirs", "Termine {n} devoirs à temps", [0, 6, 10]]];
  function listeDefis(e = enfant) {
    const auj = jour(), g = e.niveau <= 2 ? 0 : e.niveau <= 7 ? 1 : 2, faits = (D.defis[e.id] = D.defis[e.id] || {});
    const lun = lundiDe(auj), dim = ajoute(lun, 6), m1 = auj.slice(0, 8) + "01", mFin = jour(new Date(versDate(m1).getFullYear(), versDate(m1).getMonth() + 1, 0));
    const res = [];
    for (const [periode, liste, debut, fin, xp] of [["semaine", DEFIS_H, lun, dim, 50], ["mois", DEFIS_M, m1, mFin, 150]]) {
      const cle = (periode === "semaine" ? "S" : "M") + debut, c = compteurs(e, debut, fin);
      const elig = liste.filter(d => d[2][g] > 0);
      for (const [k, t, ns] of melangeGraine(elig, e.id + cle).slice(0, 3)) {
        const n = ns[g], v = Math.min(n, c[k] || 0), id = cle + "|" + k;
        res.push({ id, periode, titre: t.replace("{n}", n), n, v, fini: v >= n, recupere: !!faits[id], xp, fin });
      }
    }
    return res;
  }
  function ecranDefis() {
    recompenserDefis();
    const ds = listeDefis(), mes = D.badges[enfant.id] || [], nv = niveauXP(enfant.xp || 0);
    const restant = f => { const n = ecart(jour(), f); return n === 0 ? "dernier jour !" : `encore ${n + 1} jour${n ? "s" : ""}`; };
    const bloc = (p, t) => { const l = ds.filter(d => d.periode === p); return `<div class="sections"><div class="entete"><h2 class="cursive titre-groupe">${t}</h2><span class="pill">${restant(l[0].fin)}</span></div>
      <div class="defis">${l.map(d => `<div class="defi ${d.recupere ? "recupere" : d.fini ? "fini" : ""}"><div class="defi-haut"><span class="emo defi-ico">${d.recupere ? "✅" : d.fini ? "🎁" : p === "semaine" ? "⚡" : "🏔️"}</span><b>${esc(d.titre)}</b></div>
        <div class="defi-bas"><span class="barre-maitrise"><i style="width:${Math.round(100 * d.v / d.n)}%"></i></span><small>${d.v} / ${d.n}</small></div>
        ${d.recupere ? `<small class="doux">Récompense récupérée</small>` : d.fini ? `<button class="btn petit vert" data-id="${d.id}" type="button">Récupérer ${d.xp} XP</button>` : `<small class="doux">Récompense : ${d.xp} XP</small>`}</div>`).join("")}</div></div>`; };
    rendre(`<section class="page">
      ${entete("Mes défis", "Relève les défis pour gagner de l'expérience et des badges.")}
      ${bloc("semaine", "Défis de la semaine")}
      ${bloc("mois", `Défis de ${MOIS[new Date().getMonth()]}`)}
      <div class="sections"><div class="entete"><h2 class="cursive titre-groupe">Mes badges</h2><span class="pill">${mes.length} / ${BADGES.length}</span></div>
        <div class="badges">${BADGES.map(([id, ico, nom, desc]) => `<div class="badge ${mes.includes(id) ? "gagne" : ""}" title="${esc(desc)}"><span class="emo">${mes.includes(id) ? ico : "🔒"}</span><b>${nom}</b><small>${desc}</small></div>`).join("")}</div></div>
      <div class="feuille niveau-carte"><b>Niveau ${nv.l} · ${nv.titre}</b><span class="xpbar"><i style="width:${Math.round(100 * nv.dans / nv.pas)}%"></i></span><small class="doux">Encore ${nv.pas - nv.dans} XP pour devenir « ${TITRES[Math.min(nv.l, TITRES.length - 1)]} ».</small></div>
    </section>`);
    $("#retour").onclick = ecranAccueil;
    app.querySelectorAll(".defi .btn").forEach(b => b.onclick = () => { const d = ds.find(x => x.id === b.dataset.id); D.defis[enfant.id][d.id] = true; noter("defi", { k: d.id }); sauver();
      feter(d.periode === "semaine" ? "⚡" : "🏔️", "Défi réussi !", d.titre + "."); gagner(d.xp, "défi réussi"); ecranDefis(); });
    if (maternelle() && D.reglages.lectureAuto) setTimeout(() => parler(ds.filter(d => d.periode === "semaine").map(d => d.titre).join(". ")), 300);
  }

  // =====================================================================
  //  PROGRAMME (Espace parents)
  // =====================================================================
  function blocProgramme(e) {
    const p = PROGRAMME.P[e.niveau]; if (!p) return "";
    return `<div class="feuille sections"><div class="entete"><div class="rangee"><span class="pastille" style="--c:${e.couleur}">${avatar(e)}</span><div><h2>${esc(e.prenom)} — ${NIVEAUX[e.niveau]}</h2><span class="doux">${CYCLES(e.niveau)} · année ${PROGRAMME.ANNEE}</span></div></div>
      <span class="pill">${esc(p.nouveau)}</span></div>
      <p class="doux" style="margin:0">${esc(p.ref)}</p>
      <div class="prog-grille">${Object.entries(p.matieres).map(([m, th]) => `<div class="prog-mat" style="--m:${(MATIERES[m] || ["", "var(--encre)"])[1]}"><b>${MATIERES[m] ? MATIERES[m][0] : m}</b><ul>${th.map(([t, ids]) => `<li>${esc(t)}${ids.length ? ` <span class="doux">· ${ids.length} exercice${ids.length > 1 ? "s" : ""}</span>` : ` <span class="doux">· via le cartable${iaDispo() ? " et Plume" : ""}</span>`}</li>`).join("")}</ul></div>`).join("")}</div></div>`;
  }

  // =====================================================================
  //  LANGUES DU MONDE
  // =====================================================================
  const LG = window.LANGUES;
  const groupe = (e = enfant) => e.niveau <= 2 ? 0 : e.niveau <= 7 ? 1 : 2;
  function etatLangue(l, e = enfant) { const a = (D.langues[e.id] = D.langues[e.id] || {}); return (a[l] = a[l] || { mots: {} }); }
  const cleMot = (th, m) => th.id + "|" + m[0];
  const CHIFFRES_AR = "٠١٢٣٤٥٦٧٨٩";
  function themesLangue(l) {
    const t = LG.themesPour(l, groupe());
    if (l === "ar") t.unshift({ id: "alphabet", titre: "L'alphabet arabe", emoji: "ar:أ ب ت", g: 0, alpha: true,
      mots: LG.ALPHABET_AR.map(([lettre, nom, son]) => [nom, "ar:" + lettre, null, null, null, lettre, son]) });
    return t;
  }
  // ---------- images des mots ----------
  // Emoji → dessin Twemoji (web/images/mots, liste dans images_mots.js) : le même dessin, net, sur tous les appareils.
  const codeEmoji = e => [...e].map(c => c.codePointAt(0).toString(16)).filter(h => h !== "fe0f").join("-");
  const emojiImg = (e, px) => {
    const c = codeEmoji(e), st = px ? ` style="font-size:${px}px"` : "";
    return window.IMAGES_MOTS && window.IMAGES_MOTS.has(c) ? `<span class="emo"${st}><img class="emo-img" src="images/mots/${c}.svg" alt="" draggable="false"></span>` : `<span class="emo"${st}>${e}</span>`;
  };
  // Dessins faits pour l'appli (« f:… » dans langues.js) quand aucun emoji ne montre bien le mot.
  const svgD = (corps, px) => { const t = Math.round((px || 84) * 1.2); return `<svg class="dessin-mot" viewBox="0 0 100 100" width="${t}" height="${t}" aria-hidden="true">${corps}</svg>`; };
  const CAISSE = `<rect x="34" y="40" width="34" height="34" rx="3" fill="#c98b4a" stroke="#7a4f22" stroke-width="3"/><path d="M34 51h34M34 63h34" stroke="#7a4f22" stroke-width="2"/>`;
  const BALLE = (x, y, r = 10) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#e03131" stroke="#8a1414" stroke-width="2.5"/><path d="M${x - r * .5} ${y - r * .45}a${r * .6} ${r * .6} 0 0 1 ${r * .5}-${r * .25}" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  const TABLE = `<rect x="18" y="44" width="64" height="7" rx="2" fill="#a0612b"/><path d="M24 51v32M76 51v32" stroke="#a0612b" stroke-width="6" stroke-linecap="round"/>`;
  const SOL = `<path d="M6 86h88" stroke="#9aa5b1" stroke-width="3" stroke-linecap="round"/>`;
  const SAISON = m => m === 12 || m <= 2 ? "#4dabf7" : m <= 5 ? "#f06595" : m <= 8 ? "#fab005" : "#e8590c";
  // Petit calendrier : n cases (jours, mois), celles de « actives » en couleur.
  const casesCal = (n, actives, couleur, colonnes, x0 = 8, larg = 84) => {
    const col = colonnes || n, lignes = Math.ceil(n / col), w = (larg - 8) / col, h = 48 / lignes;
    let s = `<rect x="${x0}" y="16" width="${larg}" height="72" rx="7" fill="#fff" stroke="#495057" stroke-width="2.5"/><path d="M${x0} 23a7 7 0 0 1 7-7h${larg - 14}a7 7 0 0 1 7 7v9H${x0}z" fill="#e03131"/>`
      + `<path d="M${x0 + larg * .28} 10v12M${x0 + larg * .72} 10v12" stroke="#495057" stroke-width="4" stroke-linecap="round"/>`;
    for (let i = 0; i < n; i++) { const x = x0 + 4 + (i % col) * w, y = 36 + Math.floor(i / col) * h, a = actives.includes(i);
      s += `<rect x="${x + 1}" y="${y + 1}" width="${w - 2}" height="${h - 2}" rx="2" fill="${a ? couleur : "#e9ecef"}" stroke="${a ? "#1d3596" : "none"}" stroke-width="2"/>`; }
    return s;
  };
  const ETOILE = (x, y) => `<path d="M${x} ${y - 7}l2.1 4.6 5 .5-3.8 3.4 1.1 4.9-4.4-2.6-4.4 2.6 1.1-4.9-3.8-3.4 5-.5z" fill="#fab005" stroke="#e67700" stroke-width="1"/>`;
  const troisJours = n => [0, 1, 2].map(k => casesCal(1, n === k ? [0] : [], "#4dabf7", 1, 2 + k * 33, 30)).join("") + ETOILE(50, 62);
  function dessinMot(nom, px) {
    const [k, v] = nom.split(":");
    if (k === "drapeau") return v === "eng" ? svgD(`<rect x="8" y="22" width="84" height="56" fill="#fff" stroke="#ccc"/><path d="M50 22v56M8 50h84" stroke="#ce1124" stroke-width="12"/>`, px)
      : `<img class="drapeau-mot" src="atlas/drapeaux/${v}.svg" alt="" style="width:${px || 84}px">`;
    if (k === "jour") { const n = +v - 1; return svgD(casesCal(7, [n], n >= 5 ? "#69db7c" : "#4dabf7"), px); }
    if (k === "mois") { const n = +v - 1; return svgD(casesCal(12, [n], SAISON(+v), 4), px); }
    if (k === "temps") return svgD({ hier: troisJours(0), auj: troisJours(1), demain: troisJours(2),   // l'étoile marque aujourd'hui
      semaine: casesCal(7, [0, 1, 2, 3, 4, 5, 6], "#4dabf7"), annee: casesCal(12, [...Array(12).keys()], "#69db7c", 4) }[v], px);
    const D = {
      rectangle: `<rect x="14" y="30" width="72" height="40" rx="2" fill="#4dabf7" stroke="#1864ab" stroke-width="4"/>`,
      ligne: `<path d="M12 50h76" stroke="#1d3596" stroke-width="8" stroke-linecap="round"/>`,
      point: `<circle cx="50" cy="50" r="12" fill="#1d3596"/>`,
      balancoire: `<path d="M18 88 34 14M50 88 34 14M82 88 66 14M50 88 66 14" stroke="#e8590c" stroke-width="5" stroke-linecap="round"/><path d="M30 14h40" stroke="#c2410c" stroke-width="6" stroke-linecap="round"/><path d="M42 16v46M58 16v46" stroke="#555" stroke-width="2.5"/><rect x="37" y="60" width="26" height="6" rx="2" fill="#1971c2"/>`,
      sur: TABLE + BALLE(50, 33) + SOL, sous: TABLE + BALLE(50, 74) + SOL,
      devant: CAISSE + BALLE(52, 70, 13) + SOL, derriere: BALLE(60, 34, 12) + CAISSE + SOL,
      cote: CAISSE.replace(/x="34"/, 'x="22"').replace(/M34 51h34M34 63h34/, "M22 51h34M22 63h34") + BALLE(70, 64, 10) + SOL,
      pres: `<rect x="10" y="48" width="26" height="26" rx="3" fill="#c98b4a" stroke="#7a4f22" stroke-width="3"/>` + BALLE(46, 66, 8) + SOL,
      loin: `<rect x="10" y="48" width="26" height="26" rx="3" fill="#c98b4a" stroke="#7a4f22" stroke-width="3"/>` + BALLE(86, 68, 6) + `<path d="M42 58h34" stroke="#868e96" stroke-width="2.5" stroke-dasharray="4 4"/><path d="M72 53l6 5-6 5" fill="none" stroke="#868e96" stroke-width="2.5"/>` + SOL,
      gomme: `<g transform="rotate(-20 50 50)"><rect x="18" y="36" width="64" height="28" rx="5" fill="#f783ac" stroke="#a61e4d" stroke-width="3"/><rect x="18" y="36" width="26" height="28" rx="5" fill="#4dabf7" stroke="#1864ab" stroke-width="3"/></g>`,
      taille: `<rect x="40" y="34" width="44" height="34" rx="5" fill="#adb5bd" stroke="#495057" stroke-width="3"/><path d="M40 44 52 51 40 58" fill="#495057"/><path d="M8 51h20l12-6v12l-12-6" fill="#fab005" stroke="#a0612b" stroke-width="2"/><rect x="8" y="45" width="20" height="12" fill="#fab005" stroke="#a0612b" stroke-width="2"/>`,
      colle: `<rect x="36" y="34" width="28" height="52" rx="4" fill="#fff" stroke="#495057" stroke-width="3"/><rect x="36" y="14" width="28" height="22" rx="4" fill="#7950f2" stroke="#495057" stroke-width="3"/><rect x="40" y="52" width="20" height="16" rx="2" fill="#e5dbff"/>`,
      calc: `<rect x="24" y="10" width="52" height="80" rx="6" fill="#495057"/><rect x="31" y="17" width="38" height="16" rx="2" fill="#d3f9d8"/>` + [0, 1, 2].map(c => [0, 1, 2, 3].map(r => `<rect x="${31 + c * 13}" y="${40 + r * 12}" width="10" height="9" rx="2" fill="${c === 2 && r === 3 ? "#fd7e14" : "#dee2e6"}"/>`).join("")).join(""),
      dentifrice: `<path d="M14 40h50l14 6v8l-14 6H14z" fill="#fff" stroke="#1971c2" stroke-width="3"/><path d="M14 40v20" stroke="#1971c2" stroke-width="6"/><rect x="78" y="44" width="10" height="12" rx="2" fill="#1971c2"/><path d="M30 46h24M30 54h24" stroke="#e03131" stroke-width="3"/>`,
      serviette: `<rect x="20" y="22" width="60" height="58" rx="4" fill="#63e6be" stroke="#0ca678" stroke-width="3"/><path d="M20 66h60M20 72h60" stroke="#fff" stroke-width="3"/><path d="M28 22v-6h44v6" fill="none" stroke="#495057" stroke-width="3"/>`,
      peigne: `<rect x="12" y="34" width="76" height="12" rx="4" fill="#e8590c"/>` + [...Array(13).keys()].map(i => `<rect x="${15 + i * 5.6}" y="45" width="3" height="${i % 2 ? 20 : 24}" rx="1.2" fill="#e8590c"/>`).join(""),
    };
    return D[k] ? svgD(D[k], px) : "";
  }
  // Nombres de 1 à 10 : le chiffre et autant de points, pour compter même sans connaître les chiffres.
  const pointsCompte = n => `<span class="compte" aria-hidden="true">${"<i></i>".repeat(n)}</span>`;
  function imgMot(m, l, px) {
    const p = m[1];
    if (p.startsWith("#")) return `<svg viewBox="0 0 100 100" width="${px || 84}" height="${px || 84}" aria-hidden="true"><circle cx="50" cy="50" r="42" fill="${p}" stroke="rgba(0,0,0,.35)" stroke-width="3"/></svg>`;
    if (p.startsWith("f:")) return dessinMot(p.slice(2), px);
    if (p.startsWith("t:")) { const t = p.slice(2), n = /^\d+$/.test(t) ? +t : 0; return `<span class="lg-chiffre">${esc(t)}${l === "ar" && n ? `<small lang="ar">${t.replace(/\d/g, d => CHIFFRES_AR[d])}</small>` : ""}${n >= 1 && n <= 10 ? pointsCompte(n) : ""}</span>`; }
    if (p.startsWith("ar:")) return `<span class="ar lg-lettre" lang="ar" dir="rtl">${p.slice(3)}</span>`;
    return emojiImg(p, px);
  }
  const motCible = (m, l, translit) => `<span class="lg-mot${l === "ar" ? " ar" : ""}" lang="${l}"${l === "ar" ? ' dir="rtl"' : ""}>${esc(LG.mot(m, l))}</span>${translit !== false && l === "ar" && m[6] ? `<span class="lg-translit">${esc(m[6])}</span>` : ""}`;

  // ---------- voix ----------
  function voixPour(code) {
    if (!("speechSynthesis" in window)) return null;
    const vs = speechSynthesis.getVoices(), p = code.slice(0, 2).toLowerCase(), norm = v => (v.lang || "").replace("_", "-").toLowerCase();
    const c = vs.filter(v => norm(v).startsWith(p)); if (!c.length) return null;
    return c.find(v => /natural|online/i.test(v.name) && norm(v) === code.toLowerCase()) || c.find(v => /natural|online/i.test(v.name)) || c.find(v => norm(v) === code.toLowerCase()) || c[0];
  }
  // Nom arabe de chaque lettre : une lettre seule est souvent muette avec les voix de Windows, son nom est toujours prononcé.
  const NOMS_LETTRES_AR = { "ا": "ألف", "أ": "ألف", "إ": "ألف", "آ": "ألف", "ب": "باء", "ت": "تاء", "ث": "ثاء", "ج": "جيم", "ح": "حاء", "خ": "خاء", "د": "دال", "ذ": "ذال", "ر": "راء", "ز": "زاي",
    "س": "سين", "ش": "شين", "ص": "صاد", "ض": "ضاد", "ط": "طاء", "ظ": "ظاء", "ع": "عين", "غ": "غين", "ف": "فاء", "ق": "قاف", "ك": "كاف", "ل": "لام", "م": "ميم", "ن": "نون",
    "ه": "هاء", "و": "واو", "ي": "ياء", "ء": "همزة", "ة": "تاء مربوطة", "ى": "ألف مقصورة" };
  function texteAPrononcer(texte, l) {
    let t = String(texte).replace(/…/g, "").replace(/^ar:/, "");
    if (l === "ar") { const seul = t.replace(/[\u200d\u200c\s]/g, ""); if (NOMS_LETTRES_AR[seul]) t = NOMS_LETTRES_AR[seul]; }
    return t;
  }
  // ---------- arabe : sons enregistrés dans l'application (ne dépend pas des voix installées sur l'ordinateur) ----------
  let sonsArabe = null, sonAr = null;
  const chargerSonsArabe = () => sonsArabe || (sonsArabe = chargeScript("audio_ar.js").then(() => window.AUDIO_AR || {}).catch(() => ({})));
  function cleSonArabe(texte) {
    const t = String(texte).replace(/^ar:/, "").trim(), A = window.AUDIO_AR || {};
    const seul = t.replace(/[\u200d\u200c\s]/g, "");
    if (/^[\u0621-\u064a]$/.test(seul) && A["lettre:" + (seul === "ء" ? "ا" : seul)]) return "lettre:" + (seul === "ء" ? "ا" : seul);
    if (A[t]) return t;
    const sans = t.replace(/…/g, "").trim(); if (A[sans]) return sans;
    return null;
  }
  // Sons des mots du dictionnaire français-arabe : le paquet complet (« Sons-dictionnaire-arabe.pack »).
  // La version en ligne l'emporte ; l'exe (pour rester léger) le télécharge une fois depuis la version en ligne
  // et le garde dans le dossier « sons » du PC. Un adulte peut aussi le charger à la main depuis le fichier.
  let sonsDico = null;
  function lirePaquet(buf) {
    const v = new DataView(buf), sig = new TextDecoder().decode(new Uint8Array(buf, 0, 4));
    if (sig !== "ADSA") throw new Error("Ce fichier n'est pas un paquet de sons de l'application.");
    const n = v.getUint32(4, true), meta = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 8, n)));
    return { index: meta.index, bin: buf.slice(8 + n) };
  }
  const chargerSonsDico = () => sonsDico || (sonsDico = (async () => {
    try { const p = await chantLire(PAQUET_AR); if (p && p.buf) return lirePaquet(p.buf); } catch { }
    if (EN_LIGNE) try { const r = await fetch("dicos/sons-ar-complet.pack"); if (r.ok) return lirePaquet(await r.arrayBuffer()); } catch { }   // paquet complet de la version en ligne
    if (!EN_LIGNE) {
      const r = await fetch(URL_EN_LIGNE + "dicos/sons-ar-complet.pack"); if (!r.ok) throw 0;
      const buf = await r.arrayBuffer(), p = lirePaquet(buf);
      chantEcrire(PAQUET_AR, { buf, le: jour(), nb: Object.keys(p.index).length }).catch(() => { });
      return p;
    }
    throw 0;
  })().catch(() => { sonsDico = null; return null; }));
  async function importerPaquetSons(fichier) {
    const buf = await fichier.arrayBuffer(), p = lirePaquet(buf);
    await chantEcrire(PAQUET_AR, { buf, le: jour(), nb: Object.keys(p.index).length });
    sonsDico = null; return Object.keys(p.index).length;
  }
  async function sourceSonArabe(texte) {
    await chargerSonsArabe();
    const cle = cleSonArabe(texte);
    if (cle) return "data:audio/ogg;base64," + window.AUDIO_AR[cle];
    const t = String(texte).replace(/^ar:/, "").replace(/…/g, "").trim();
    const p = await chargerSonsDico(); if (!p) return null;
    const e = p.index[t] || p.index[t.split(" / ")[0]];
    return e ? URL.createObjectURL(new Blob([p.bin.slice(e[0], e[0] + e[1])], { type: "audio/ogg" })) : null;
  }
  async function parlerArabe(texte, surFin) {
    const src = await sourceSonArabe(texte);
    if (!src) return false;
    try { speechSynthesis?.cancel?.(); } catch { }
    if (sonAr) { try { sonAr.pause(); } catch { } }
    sonAr = new Audio(src);
    sonAr.playbackRate = groupe() === 0 ? .92 : 1;
    if (surFin) sonAr.onended = surFin;
    sonAr.play().catch(() => { });
    return true;
  }
  // Drapeau de chaque langue (images de l'atlas : les drapeaux en emoji ne s'affichent pas sous Windows).
  const DRAPEAUX = { fr: "fr", en: "gb", es: "es", it: "it", ar: "sa" };
  const drapeauLangue = (l, px = 28) => `<img class="drapeau-son" src="atlas/drapeaux/${DRAPEAUX[l]}.svg" alt="" style="height:${px}px">`;
  // Maternelle et CP : l'enfant ne lit pas encore les mots, il les entend en français et dans la langue apprise.
  const nonLecteur = () => !!enfant && enfant.niveau <= 3;
  function parlerFrancais(texte, suite) {
    if (!("speechSynthesis" in window) || !texte) { suite && suite(); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texte); u.lang = "fr-FR"; u.rate = .85;
    const v = voixPour("fr-FR"); if (v) u.voice = v;
    let fait = false; const fin = () => { if (!fait) { fait = true; suite && suite(); } };
    u.onend = fin; u.onerror = fin;
    setTimeout(() => speechSynthesis.speak(u), 30);
  }
  function direFrPuisLangue(m, l) {
    const page = app.firstElementChild;
    parlerFrancais(m[0], () => setTimeout(() => { if (app.firstElementChild === page) parlerLangue(LG.mot(m, l), l); }, 400));
  }
  function parlerLangue(texte, l, essai = 0) {
    if (!texte) return;
    if (l === "ar") { parlerArabe(texte).then(ok => { if (!ok) parlerVoix(texte, l, essai); }); return; }
    parlerVoix(texte, l, essai);
  }
  function parlerVoix(texte, l, essai = 0) {
    if (!("speechSynthesis" in window) || !texte) return;
    const info = LG.LANGUES[l];
    // au démarrage, Windows charge ses voix un peu après l'application : on attend au lieu de parler avec la mauvaise voix
    if (!speechSynthesis.getVoices().length && essai < 8) { setTimeout(() => parlerVoix(texte, l, essai + 1), 250); return; }
    const v = voixPour(info.voix);
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texteAPrononcer(texte, l)); u.lang = v ? v.lang : info.voix; if (v) u.voice = v;
    u.rate = groupe() === 0 ? .78 : .88;
    setTimeout(() => speechSynthesis.speak(u), 30);   // petit délai : certains navigateurs ignorent une phrase lancée juste après « cancel »
  }
  if ("speechSynthesis" in window) speechSynthesis.addEventListener?.("voiceschanged", () => { const z = $("#voix-info"); if (z) z.innerHTML = infoVoix(z.dataset.l); });
  function infoVoix(l) {
    if (l === "ar") { chargerSonsArabe(); return ""; }   // les sons arabes sont intégrés à l'application
    if (!("speechSynthesis" in window)) return "";
    const v = voixPour(LG.LANGUES[l].voix), nom = LG.LANGUES[l].nom.toLowerCase();
    if (v) return "";
    return `<div class="note-info voix-manquante"><b>Cet ordinateur n'a pas encore de voix en ${nom} :</b> les mots s'affichent mais ne sont pas prononcés.
      Un adulte peut l'ajouter une fois pour toutes (gratuit, 2 minutes, il faut Internet) :
      <ol><li>Cliquez sur « Ouvrir les réglages de voix » ci-dessous (Windows demande la permission : acceptez).</li>
      <li>Cliquez sur <b>Ajouter des voix</b>, cherchez <b>${LG.LANGUES[l].nom}</b>, cochez-la puis cliquez sur <b>Ajouter</b>.</li>
      <li>Une fois l'installation finie, fermez l'application et rouvrez-la.</li></ol>
      <div class="rangee"><a class="btn second petit" href="ms-settings:speech">Ouvrir les réglages de voix</a><button class="btn-discret" type="button" onclick="location.reload()">J'ai installé la voix : vérifier</button></div></div>`;
  }


  // ---------- écran : choix de la langue ----------
  function ecranLangues() {
    const cartes = Object.entries(LG.LANGUES).map(([l, info]) => {
      const ths = themesLangue(l), total = ths.reduce((s, t) => s + t.mots.length, 0), st = etatLangue(l).mots;
      const appris = Object.values(st).filter(x => x.b >= 3).length;
      return `<button class="lang-carte" data-l="${l}" type="button" style="--lc:${info.couleur}">
        <span class="lang-natif${info.rtl ? " ar" : ""}"${info.rtl ? ' lang="ar" dir="rtl"' : ` lang="${l}"`}>${info.natif}</span>
        <b>${info.nom}</b><span class="lang-bonjour"${info.rtl ? ' lang="ar" dir="rtl"' : ""}>${info.bonjour}</span>
        <span class="barre-maitrise"><i style="width:${Math.round(100 * appris / Math.max(1, total))}%"></i></span><small>${appris} / ${total} mots appris</small></button>`;
    }).join("");
    rendre(`<section class="page">${entete("Langues du monde", maternelle() ? "Écoute les mots et touche la bonne image !" : "Choisis une langue. Les thèmes sont adaptés à ton âge.")}
      <div class="langues-grille">${cartes}</div></section>`);
    $("#retour").onclick = ecranAccueil;
    app.querySelectorAll(".lang-carte").forEach(b => b.onclick = () => ecranLangue(b.dataset.l));
    if (maternelle() && D.reglages.lectureAuto) setTimeout(() => parler("Choisis une langue : anglais, espagnol, italien ou arabe."), 300);
  }
  function motsDus(l) {
    const st = etatLangue(l).mots, auj = jour(), res = [];
    for (const th of themesLangue(l)) for (const m of th.mots) { const e = st[cleMot(th, m)]; if (e && e.p <= auj) res.push([th, m]); }
    return res;
  }
  // Un thème « de phrases » : la plupart de ses entrées sont des phrases (ponctuation finale ou plusieurs mots avec un verbe).
  let filtreThemes = "tous";
  const estPhrases = t => !t.alpha && t.mots.filter(m => /[.?!…]\s*$/.test(m[0])).length >= t.mots.length * .6;
  function ecranLangue(l) {
    const info = LG.LANGUES[l], st = etatLangue(l).mots, dus = motsDus(l);
    const ths = themesLangue(l);
    if (enfant.derniereLangue !== l) { enfant.derniereLangue = l; sauver(); }
    rendre(`<section class="page">
      <div class="entete"><div><button class="retour-lien" id="retour" type="button">${ICO.retour} Langues</button>
        <h1 style="color:${info.couleur}">${info.nom} <span class="lang-natif-titre${info.rtl ? " ar" : ""}"${info.rtl ? ' lang="ar" dir="rtl"' : ""}>${info.natif}</span></h1></div>
        ${dus.length ? `<button class="btn gros" id="revision" type="button" style="background:${info.couleur};border-color:${info.couleur}">Révision du jour · ${dus.length} mot${dus.length > 1 ? "s" : ""}</button>` : ""}</div>
      <div id="voix-info" data-l="${l}">${infoVoix(l)}</div>
      ${ths.some(estPhrases) && ths.some(t => !estPhrases(t)) ? `<div class="onglets" role="group" aria-label="Type de thèmes">${[["tous", "Tout"], ["mots", "Des mots"], ["phrases", "Des phrases"]].map(([k, t]) => `<button class="onglet" data-filtre="${k}" aria-pressed="${k === filtreThemes}" type="button">${t}</button>`).join("")}</div>` : ""}
      <div class="tuiles">${ths.filter(t => filtreThemes === "tous" || (filtreThemes === "phrases") === estPhrases(t)).map(t => { const n = t.mots.filter(m => (st[cleMot(t, m)] || {}).b >= 3).length, vus = t.mots.filter(m => st[cleMot(t, m)]).length;
        return `<div class="theme-case"><button class="tuile theme-lg" data-t="${t.id}" type="button" style="--m:${info.couleur}"><span class="theme-emo">${t.emoji.startsWith("ar:") ? `<span class="ar" lang="ar">${t.emoji.slice(3)}</span>` : emojiImg(t.emoji)}</span>
          <h3>${esc(t.titre)}</h3><span class="desc">${t.mots.length} ${t.alpha ? "lettres" : estPhrases(t) ? "phrases" : "mots"}</span>
          <span class="bas"><span class="barre-maitrise" style="flex:1;margin:0"><i style="width:${Math.round(100 * n / t.mots.length)}%"></i></span><span>${vus ? `${n}/${t.mots.length}` : "Nouveau"}</span></span></button><button class="lien-modes" data-t="${t.id}" type="button">${vus ? "Activités" : "Activités"}</button></div>`; }).join("")}</div>
      <p class="doux" style="margin:0">Touche un thème : la première fois tu découvres les mots, ensuite tu joues directement.</p>
      ${l === "ar" ? blocLeconsArabe() : ""}
    </section>`);
    $("#retour").onclick = ecranLangues;
    if (l === "ar") brancherLeconsArabe();
    if ($("#revision")) $("#revision").onclick = () => lancerLangue(l, null, "revision");
    app.querySelectorAll(".theme-lg").forEach(b => b.onclick = () => { const t = ths.find(x => x.id === b.dataset.t);
      if (!t.mots.some(m => st[cleMot(t, m)])) ecranDecouvrir(l, t); else lancerLangue(l, t, groupe() === 0 ? "ecoute" : "quiz"); });
    app.querySelectorAll(".lien-modes").forEach(b => b.onclick = () => ecranThemeLangue(l, ths.find(t => t.id === b.dataset.t)));
    app.querySelectorAll("[data-filtre]").forEach(b => b.onclick = () => { filtreThemes = b.dataset.filtre; ecranLangue(l); });
  }
  function ecranThemeLangue(l, th) {
    const info = LG.LANGUES[l], g = groupe(), st = etatLangue(l).mots;
    const modes = [["decouvrir", "👀", "Découvrir", th.alpha ? "Chaque lettre et son son" : "Les mots avec leur image et leur son"], ["ecoute", "👂", "Écoute et touche", "Trouve la bonne image"]]
      .concat(g >= 1 ? [["quiz", "🧩", "Quiz", "Dans les deux sens"]] : [])
      .concat(g >= 2 && l !== "ar" && !th.alpha ? [["ecrire", "✍️", "J'écris", "Écris le mot sans faute"]] : []);
    rendre(`<section class="page etroite">
      <div class="entete"><div><button class="retour-lien" id="retour" type="button">${ICO.retour} ${info.nom}</button><h1>${esc(th.titre)}</h1></div></div>
      <div id="voix-info" data-l="${l}">${infoVoix(l)}</div>
      <div class="modes">${modes.map(([k, e, t, s]) => `<button class="mode" data-k="${k}" type="button"><span class="emo">${e}</span><b>${t}</b><small>${s}</small></button>`).join("")}</div>
      ${g >= 1 ? `<div class="feuille sections"><h2>${th.alpha ? "Les lettres" : "Les mots"}</h2><div class="table-wrap"><table class="lexique"><tbody>${th.mots.map((m, i) => { const e = st[cleMot(th, m)];
        return `<tr><td class="lx-img">${imgMot(m, l, 34)}</td><td>${th.alpha ? `<b>${esc(m[0])}</b><br><small class="doux">${esc(m[6])}</small>` : esc(m[0])}</td><td>${th.alpha ? "" : motCible(m, l)}</td>
          <td><button class="btn-discret" data-dire="${i}" type="button" aria-label="Écouter">${ICO.son}</button></td><td>${e && e.b >= 3 ? '<span class="etat ok">Appris</span>' : e ? '<span class="etat">Vu</span>' : ""}</td></tr>`; }).join("")}</tbody></table></div></div>` : ""}
    </section>`);
    $("#retour").onclick = () => ecranLangue(l);
    app.querySelectorAll(".mode").forEach(b => b.onclick = () => b.dataset.k === "decouvrir" ? ecranDecouvrir(l, th) : lancerLangue(l, th, b.dataset.k));
    app.querySelectorAll("[data-dire]").forEach(b => b.onclick = () => parlerLangue(LG.mot(th.mots[+b.dataset.dire], l), l));
  }
  function ecranDecouvrir(l, th, i = 0) {
    const m = th.mots[i], info = LG.LANGUES[l], st = etatLangue(l).mots, deuxVoix = nonLecteur() && !th.alpha;
    if (!st[cleMot(th, m)]) { st[cleMot(th, m)] = { b: 1, p: ajoute(jour(), 1) }; sauver(); }
    rendre(`<section class="page etroite">
      <div class="entete"><div><button class="retour-lien" id="retour" type="button">${ICO.retour} ${esc(th.titre)}</button><h1>Découvrir</h1><p class="doux">${i + 1} / ${th.mots.length}</p></div></div>
      <div class="decouverte" style="--lc:${info.couleur}">
        <div class="dec-img">${imgMot(m, l, 120)}</div>
        ${th.alpha ? `<div class="dec-mot"><b>${esc(m[0])}</b></div><div class="dec-fr">Se prononce : ${esc(m[6])}</div>`
          : deuxVoix ? `<div class="dec-mot">${drapeauLangue(l, 30)} ${motCible(m, l)}</div><div class="dec-fr">${drapeauLangue("fr", 20)} ${esc(m[0])}</div>`
          : `<div class="dec-mot">${motCible(m, l)}</div><div class="dec-fr">${esc(m[0])}</div>`}
        ${deuxVoix ? `<div class="deux-voix">
            <button class="btn-voix" id="dire-fr" type="button" style="--lc:var(--encre)" aria-label="Écouter en français">${drapeauLangue("fr", 44)}<span>${ICO.son}</span><small>Français</small></button>
            <button class="btn-voix" id="dire" type="button" style="--lc:${info.couleur}" aria-label="Écouter en ${NOM_LANGUE[l]}">${drapeauLangue(l, 44)}<span>${ICO.son}</span><small>${info.nom}</small></button></div>`
          : `<button class="btn gros" id="dire" type="button" style="background:${info.couleur};border-color:${info.couleur}">${drapeauLangue(l, 22)} ${ICO.son} Écouter</button>`}
      </div>
      <div class="rangee centre">${i > 0 ? `<button class="btn second" id="prec" type="button">◀ Précédent</button>` : ""}
        ${i < th.mots.length - 1 ? `<button class="btn gros" id="suiv" type="button">Suivant ▶</button>` : `<button class="btn gros vert" id="fini" type="button">J'ai tout découvert !</button>`}</div>
    </section>`);
    const dire = () => parlerLangue(LG.mot(m, l), l);
    setTimeout(() => deuxVoix ? direFrPuisLangue(m, l) : dire(), 250);
    $("#dire").onclick = dire;
    if ($("#dire-fr")) $("#dire-fr").onclick = () => parlerFrancais(m[0]);
    $("#retour").onclick = () => { speechSynthesis?.cancel?.(); ecranThemeLangue(l, th); };
    if ($("#prec")) $("#prec").onclick = () => ecranDecouvrir(l, th, i - 1);
    app.onkeydown = e => { if (e.key === "ArrowRight") ($("#suiv") || $("#fini"))?.click(); if (e.key === "ArrowLeft") $("#prec")?.click(); };
    if ($("#suiv")) $("#suiv").onclick = () => ecranDecouvrir(l, th, i + 1);
    if ($("#fini")) $("#fini").onclick = () => {
      const deja = journal().some(x => x.t === "langue" && x.lg === l && x.th === th.id && x.d === jour());
      noter("langue", { lg: l, th: th.id, mode: "decouvrir" }); sauver();
      if (!deja) gagner(5, "nouveaux mots"); else verifierBadges();
      lancerLangue(l, th, groupe() === 0 ? "ecoute" : "quiz");
    };
  }

  // ---------- séances de langue (moteur de questions commun) ----------
  const sansAccents = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "");
  const normLg = s => sansAccents(s).toLowerCase().replace(/[¡¿?!.,;:…"«»]/g, " ").replace(/^\s*(el|la|los|las|un|una|il|lo|l'|i|gli|le|the|a|an|to)\s+/, "").replace(/^l'/, "").replace(/\s+/g, " ").trim();
  function majMot(l, th, m, juste) {
    const st = etatLangue(l).mots, k = cleMot(th, m), e = st[k] || { b: 0 };
    if (juste) { e.b = Math.min(5, (e.b || 0) + 1); e.p = ajoute(jour(), INTERVALLES[e.b]); } else { e.b = 1; e.p = ajoute(jour(), 1); }
    st[k] = e;
  }
  function questionLangue(l, th, m, type, pool) {
    const info = LG.LANGUES[l], g = groupe(), nbOpt = g === 0 ? 3 : 4;
    const autres = shuffle(pool.filter(x => x[0] !== m[0] && LG.mot(x, l) !== LG.mot(m, l))).slice(0, nbOpt - 1);
    const map = Object.fromEntries(pool.map(x => [x[0], x]));
    const base = { kind: "qcm", apres: j => majMot(l, th, m, j), voixApres: { t: LG.mot(m, l), l },
      expl: th.alpha ? `<span class="ar lg-mot" lang="ar">${m[5]}</span> s'appelle <b>${esc(m[0])}</b> et se prononce ${esc(m[6])}.` : `${motCible(m, l)} veut dire « ${esc(m[0])} ».` };
    if (type === "ecoute") return Object.assign(base, {
      q: `<p class="consigne">${th.alpha ? "Écoute et touche la bonne lettre." : "Écoute et touche la bonne image."}</p><p class="doux" style="margin:0;font-size:1rem">Touche « Écouter » pour réentendre.</p>`,
      options: shuffle([m[0], ...autres.map(x => x[0])]), answer: m[0], rendu: o => imgMot(map[o], l), images: true, voix: { t: LG.mot(m, l), l }, check: r => r === m[0] });
    if (type === "versCible") { const opts = shuffle([LG.mot(m, l), ...autres.map(x => LG.mot(x, l))]); const parMot = Object.fromEntries(pool.map(x => [LG.mot(x, l), x]));
      return Object.assign(base, { q: th.alpha ? `<p class="consigne">Quelle est la lettre <b>« ${esc(m[0])} »</b> ?</p>` : `<p class="consigne">Comment dit-on <b>« ${esc(m[0])} »</b> en ${info.nom.toLowerCase()} ?</p><div class="dessin" aria-hidden="true">${imgMot(m, l, 64)}</div>`,
        options: opts, answer: LG.mot(m, l), rendu: o => th.alpha ? imgMot(parMot[o], l) : motCible(parMot[o], l), images: !!th.alpha, optClass: th.alpha ? "" : "mots", check: r => r === LG.mot(m, l) }); }
    if (type === "versFr") return Object.assign(base, {
      q: `<p class="consigne">${th.alpha ? "Comment s'appelle cette lettre ?" : "Que veut dire ce mot ?"}</p><div class="lg-question">${th.alpha ? `<span class="ar lg-lettre" lang="ar">${m[5]}</span>` : motCible(m, l)}</div>`,
      options: shuffle([m[0], ...autres.map(x => x[0])]), answer: m[0], voix: { t: LG.mot(m, l), l }, check: r => r === m[0] });
    return Object.assign(base, { kind: "text", q: `<p class="consigne">Écris en ${info.nom.toLowerCase()} : <b>« ${esc(m[0])} »</b></p><div class="dessin" aria-hidden="true">${imgMot(m, l, 56)}</div>`,
      answer: LG.mot(m, l), check: r => normLg(r) === normLg(LG.mot(m, l)) });
  }
  function lancerLangue(l, th, mode) {
    const g = groupe(), nb = [5, 8, 10][g], info = LG.LANGUES[l];
    let paires;
    if (mode === "revision") { paires = shuffle(motsDus(l)).slice(0, nb); if (!paires.length) return ecranLangue(l); }
    else paires = shuffle(th.mots.map(m => [th, m])).slice(0, Math.min(nb, th.mots.length));
    while (paires.length < nb && mode !== "revision" && th.mots.length >= 3) paires.push([th, th.mots[Math.floor(Math.random() * th.mots.length)]]);
    const types = { ecoute: ["ecoute"], quiz: ["versCible", "versFr"], ecrire: ["ecrire"], revision: g === 0 ? ["ecoute"] : g === 1 ? ["ecoute", "versCible", "versFr"] : ["ecoute", "versCible", "versFr", ...(l !== "ar" ? ["ecrire"] : [])] }[mode];
    const qs = paires.map(([t, m], i) => { let ty = types[i % types.length]; if (t.alpha && ty === "ecrire") ty = "versCible"; return questionLangue(l, t, m, ty, t.mots); });
    const titre = `${info.nom} · ${mode === "revision" ? "Révision du jour" : th.titre}`;
    lancerSeance(null, qs, titre, null, { matiere: "langues", lg: l, retour: () => th ? ecranThemeLangue(l, th) : ecranLangue(l) });
  }

  // =====================================================================
  //  TRI DES CAHIERS
  // =====================================================================
  const TRIS = [["perso", "Mon ordre"], ["jeune", "Du plus jeune au plus grand"], ["age", "Du plus grand au plus jeune"], ["avance", "Le plus avancé d'abord"], ["nom", "Par prénom"]];
  const ageApprox = e => e.naissance ? new Date().getFullYear() - e.naissance + (e.niveau / 100) : 3 + e.niveau;
  function enfantsTries() {
    const t = D.reglages.tri || "perso", l = D.enfants.slice();
    if (t === "jeune") l.sort((a, b) => ageApprox(a) - ageApprox(b));
    if (t === "age") l.sort((a, b) => ageApprox(b) - ageApprox(a));
    if (t === "avance") l.sort((a, b) => (b.xp || 0) - (a.xp || 0) || b.niveau - a.niveau);
    if (t === "nom") l.sort((a, b) => a.prenom.localeCompare(b.prenom, "fr"));
    return l;
  }

  // =====================================================================
  //  MODE D'EMPLOI
  // =====================================================================
  const AIDE = [
    ["🏁", "Pour commencer", [
      "Double-cliquez sur <b>AideAuxDevoirs.exe</b> : l'application s'ouvre dans sa propre fenêtre. Rien à installer, tout reste sur cet ordinateur.",
      "Créez un cahier par enfant : prénom, classe, année de naissance (facultative, pour ranger les cahiers par âge), personnage et couleur.",
      "<b>Un compte par enfant, sans mot de passe</b> : dans l'Espace parents → Enfants, touchez « Créer les icônes de tous les enfants ». Chaque enfant a alors sur le bureau une icône à son prénom, avec son personnage, qui ouvre directement son compte. Il n'y voit ni le bouton « Changer » ni les cahiers des autres.",
      "Pour que personne n'ouvre le compte d'un autre, mettez un code parent et cochez « Chaque enfant passe par son icône » dans les Réglages : l'application ouverte sans icône d'enfant demandera alors le code.",
      "Sur l'écran des cahiers, choisissez comment les ranger : votre ordre, par âge, par progression ou par prénom. En mode « Mon ordre », faites glisser un cahier pour le déplacer.",
      "Dans l'<b>Espace parents → Réglages</b>, mettez un code à 4 chiffres pour que les enfants ne changent pas les réglages."]],
    ["🏠", "L'accueil de l'enfant", [
      "En haut : le <b>niveau</b> et la barre d'expérience (XP), la <b>série</b> 🔥 (jours de travail d'affilée), les étoiles et les badges.",
      "Plume, la mascotte, dit ce qu'il y a à faire aujourd'hui. Le bouton haut-parleur lit le message.",
      "Les grandes tuiles mènent à tout : Aujourd'hui, Mon cartable, Je m'entraîne, Langues du monde, Bibliothèque, Jeux et atlas, Mes défis (et Plume si vous l'avez activé)."]],
    ["🎵", "Comptines et poésies", [
      "Plus de 100 textes du domaine public : comptines traditionnelles, fables de La Fontaine, poèmes de Hugo, Verlaine, Rimbaud, Baudelaire, Apollinaire… et des comptines en anglais, en espagnol et en italien, avec leur traduction.",
      "En maternelle, la tuile « Mes comptines » les ouvre directement. Plus tard : Bibliothèque → Poésies et comptines, ou Mon cartable → Choisir une poésie à apprendre.",
      "Chanter : sur chaque comptine, un seul gros bouton « Écouter ». Si un adulte a enregistré la chanson ou ajouté un MP3, c'est cet enregistrement qu'on entend. Pour ajouter plusieurs MP3 d'un coup : Mes comptines → « Pour les adultes : ajouter des chansons en MP3 » (chaque fichier est reconnu d'après son nom). Sinon, pour une trentaine de comptines, l'application joue l'air en boîte à musique et les vers s'allument pour chanter avec ; pour une vingtaine d'autres, elle joue l'accompagnement au piano de Widor ou de Pierné (partitions de 1883 du domaine public). Sinon, le texte est lu. Pour enregistrer : bouton « Pour les adultes » en bas de la comptine (protégé par le code parent). L'enregistrement reste sur cet ordinateur.",
      "« Écouter » lit le texte à voix haute. « Je l'apprends par cœur » le range dans le cartable : il entre dans le planning de révisions, avec le jeu des mots cachés pour le mémoriser."]],
    ["📆", "Les révisions du jour", [
      "Chaque jour, le planning propose plusieurs petites révisions dans des matières différentes, en priorité celles où l'enfant se trompe le plus : 2 en maternelle, 3 en primaire, 4 au collège et au lycée.",
      "Vous pouvez changer ce nombre (de 1 à 6) dans l'Espace parents → Réglages. Les leçons du cartable, les cartes mémo et les mots de langues s'ajoutent en plus."]],
    ["📚", "La bibliothèque", [
      "Tout se lit à voix haute : dans un livre, « Écouter le livre » lit page après page en surlignant le passage lu (cliquer sur un paragraphe reprend la lecture à cet endroit). Dans les dictionnaires, chaque résultat a son bouton 🔊 : conjugaisons, synonymes, fiches de grammaire, texte à corriger, explications de Plume.",
      "56 grands classiques gratuits du domaine public (Fables de La Fontaine, contes d'Andersen, Jules Verne, Hugo, Molière, Alice, Pinocchio, Don Quichotte…), en français, anglais, espagnol et italien. Ils se lisent sans Internet.",
      "Par défaut, seuls les livres adaptés à la classe de l'enfant s'affichent. Cochez « Montrer aussi les livres des autres âges » pour tout voir.",
      "Dans la liseuse : flèches ou glissement du doigt pour tourner les pages, A− / A+ pour la taille du texte, « Lire la page » pour l'écouter, « Sommaire » pour sauter à un chapitre. La page est retenue.",
      "<b>Double-cliquez sur un mot</b> pour voir sa traduction (livres étrangers) ou ses synonymes et sa définition (livres français).",
      "Lire rapporte des XP ; finir un livre est fêté. Pour l'arabe, des bibliothèques en ligne gratuites sont proposées (Hindawi, Wikisource)."]],
    ["📖", "Les dictionnaires", [
      "Bibliothèque → <b>Dictionnaires</b>. Traduire : anglais, espagnol, italien et arabe, dans les deux sens, avec la prononciation. Le dictionnaire arabe contient les mots vérifiés du module Langues ; pour les autres, des liens vers Reverso et Almaany.",
      "Orthographe : collez un texte, les mots inconnus sont surlignés avec des suggestions (les accords ne sont pas vérifiés).",
      "Conjugaison : plus de 7 000 verbes, avec les temps de la classe de l'enfant (ou tous). Synonymes : 36 000 mots. Grammaire : des fiches mémo adaptées à la classe.",
      "Définitions : ouvertes sur le Wiktionnaire, Larousse, le CNRTL ou Le Robert (Internet nécessaire), ou expliquées par Plume."]],
    ["🗺️", "Jeux et atlas", [
      "<b>Atlas du monde</b> : touchez un pays pour voir son drapeau, sa capitale, ses langues, sa monnaie, sa superficie comparée à la France et ses voisins. Zoom par continent et recherche par nom.",
      "Jeux de géographie : les capitales, les drapeaux, « Où est ce pays ? » et « Trouve sur la carte ». Choisissez un continent pour cibler les révisions.",
      "Jeux de lettres en français, anglais, espagnol, italien et arabe : le mémo des mots, le mot caché (avec des ballons, sans pendu), les mots mélangés et les mots mêlés (dès le CP).",
      "La difficulté s'adapte à l'âge : moins de pays, de cartes et de lettres pour les petits."]],
    ["🎒", "Mon cartable : devoirs, leçons, contrôles", [
      "Touchez <b>Ajouter</b>, choisissez : un devoir à faire, une leçon à apprendre ou un contrôle à préparer.",
      "Indiquez la matière, le chapitre du programme, la date, puis tapez le contenu ou prenez jusqu'à 4 photos.",
      "Pour une leçon, quatre façons d'apprendre : <b>Lire et écouter</b>, <b>Cartes mémo</b> (les cartes ratées reviennent le lendemain, les cartes sues de plus en plus tard), <b>Par cœur</b> (les mots se cachent petit à petit) et <b>Quiz</b>.",
      "Sans Plume, l'application repère seule les points importants et crée des cartes à partir du texte tapé. L'enfant peut aussi ajouter ses propres cartes.",
      "Un devoir terminé ? Bouton <b>J'ai fini ce devoir</b>."]],
    ["📅", "Aujourd'hui : le planning", [
      "Le planning se remplit tout seul : révisions d'un contrôle 7, 4, 2 et 1 jours avant, devoir la veille, leçons revues à intervalles réguliers, cartes et mots de langue à revoir, et un entraînement du jour.",
      "Chaque tâche se coche d'elle-même quand elle est faite. Touchez un jour de la semaine pour voir ce qui est prévu."]],
    ["🎯", "Je m'entraîne", [
      "Des exercices en illimité, corrigés et expliqués, dans les matières de la classe.",
      "En haut, les chapitres du programme officiel de l'année : touchez-en un pour filtrer les exercices.",
      "Chaque séance compte 10 questions (5 à 8 en maternelle) et rapporte jusqu'à 3 étoiles. Le menu « Niveau » permet de réviser une classe plus facile ou d'aller plus loin."]],
    ["🌍", "Langues du monde", [
      "Anglais, espagnol, italien et arabe, pour tous les âges. Les thèmes s'adaptent : la maternelle écoute et touche des images, l'école primaire ajoute le quiz, le collège et le lycée écrivent les mots et apprennent verbes et phrases utiles.",
      "En arabe, un thème spécial fait découvrir les 28 lettres de l'alphabet. Les mots arabes sont accompagnés de leur prononciation en lettres latines.",
      "En arabe, la partie « Apprendre à lire et à parler » ajoute les formes des lettres (début, milieu, fin de mot), la lecture des syllabes, et une vingtaine de leçons avec quiz : petites voyelles, soukoun, chadda, tanwîn, article et lettres solaires, chiffres, pronoms, possessifs, phrase simple, questions, verbe au présent et au passé, pluriel, se présenter…",
      "<b>Découvrir</b> présente chaque mot avec son image et sa voix. Les mots déjà vus reviennent dans la <b>Révision du jour</b>, au bon moment pour ne pas les oublier.",
      "Les mots sont prononcés par les voix d'Edge (avec Internet) ou de Windows. Sans voix pour une langue, un message explique comment en ajouter une."]],
    ["🏆", "Défis et badges", [
      "Chaque semaine et chaque mois, trois défis adaptés à l'âge. Quand un défi est réussi, touchez <b>Récupérer</b> pour gagner l'XP.",
      "13 badges à collectionner : premier pas, séries de jours, sans faute, cartes mémo, polyglotte…"]],
    ["🪶", "Plume, le tuteur (facultatif)", [
      "Plume utilise Claude, l'IA d'Anthropic. Il faut Internet et une clé API à coller dans <b>Espace parents → Tuteur Plume</b>.",
      "Il aide sur un exercice (même en photo) en guidant par indices, sans donner la réponse si vous laissez cette option cochée. Il prépare des fiches de révision et des quiz sur n'importe quel chapitre."]],
    ["🧸", "En maternelle", [
      "Les consignes sont lues à voix haute et l'enfant répond en touchant de grandes images.",
      "Le cartable devient « Mes comptines » : un adulte tape la comptine, l'enfant l'écoute et l'apprend par cœur."]],
    ["👪", "L'espace parents", [
      "<b>Suivi</b> : réussite par exercice, devoirs en retard, prochain contrôle, révisions de la semaine.",
      "<b>Programme de l'année</b> : les chapitres officiels de chaque classe et les textes de référence.",
      "<b>Enfants</b> : modifier, changer de classe à la rentrée, ranger avec les flèches.",
      "<b>Réglages et sauvegarde</b> : code parent, lecture à voix haute, export et import des cahiers pour changer d'ordinateur."]],
    ["🔊", "Les voix et les sons", [
      "L'arabe est prononcé avec des sons intégrés à l'application : plus de 1 200 mots, phrases, lettres et syllabes, vocalisés (avec les harakat) puis enregistrés avec une voix de synthèse arabe. Aucune installation n'est nécessaire. Voix « dii » (projet OpenVoiceOS, données TigreGotico), licence Creative Commons BY-NC-SA 4.0 : usage gratuit non commercial.",
      "Dictionnaire arabe : les mots les plus courants sont prononcés d'origine. Pour que les 6 776 mots le soient tous, chargez une fois le fichier « Sons-dictionnaire-arabe.pack » fourni avec l'application : Dictionnaires → العربية → Traduire → « Pour les adultes : ajouter tous les sons ». Il reste ensuite sur l'ordinateur.",
      "Les autres langues (français, anglais, espagnol, italien) utilisent les voix de Windows. S'il en manque une, la page de la langue l'indique et explique comment l'ajouter en 2 minutes (Paramètres de Windows → Heure et langue → Voix).",
      "Les comptines : votre voix ou vos MP3 si vous en avez ajouté, sinon l'air en boîte à musique ou au piano (partitions anciennes du domaine public), sinon le texte lu."]],
    ["❓", "Questions fréquentes", [
      "<b>Windows affiche « Windows a protégé votre ordinateur »</b> : cliquez sur « Informations complémentaires » puis « Exécuter quand même ». L'application n'est pas signée numériquement.",
      "<b>Pas de son</b> : vérifiez le volume, puis ajoutez une voix dans les Paramètres de Windows → Heure et langue → Voix.",
      "<b>Où sont les données ?</b> Dans le dossier %APPDATA%\\AideDevoirs de votre session Windows. Une copie de secours est faite à chaque enregistrement.",
      "<b>Mettre à jour</b> : remplacez simplement l'ancien fichier .exe par le nouveau. Les cahiers sont conservés."]],
  ];
  function ecranAide(retour) {
    rendre(`<section class="page etroite">
      <div class="entete"><div><button class="retour-lien" id="retour" type="button">${ICO.retour} Retour</button><h1>Mode d'emploi</h1>
        <p class="doux">Tout ce qu'il faut savoir pour bien utiliser Aide aux devoirs, pour les parents et pour les enfants.</p></div></div>
      <nav class="aide-sommaire">${AIDE.map(([e, t], i) => `<a href="#aide-${i}"><span class="emo">${e}</span> ${t}</a>`).join("")}</nav>
      ${AIDE.map(([e, t, ps], i) => `<div class="feuille sections aide-bloc" id="aide-${i}"><h2><span class="emo">${e}</span> ${t}</h2><ul class="points">${ps.map(p => `<li>${p}</li>`).join("")}</ul></div>`).join("")}
    </section>`);
    $("#retour").onclick = retour || (() => enfant ? ecranAccueil() : ecranEnfants());
    app.querySelectorAll(".aide-sommaire a").forEach(a => a.onclick = ev => { ev.preventDefault(); document.querySelector(a.getAttribute("href")).scrollIntoView({ behavior: "smooth" }); });
  }

  // =====================================================================
  //  OUTILS COMMUNS : chargement des données, recherche sans accents
  // =====================================================================
  const CACHE = {};
  async function charge(url, type) {
    if (CACHE[url]) return CACHE[url];
    const p = fetch(url).then(r => { if (!r.ok) throw new Error("Fichier introuvable : " + url); return type === "json" ? r.json() : r.text(); });
    CACHE[url] = p; p.catch(() => delete CACHE[url]); return p;
  }
  function chargeScript(url) {
    if (CACHE[url]) return CACHE[url];
    return (CACHE[url] = new Promise((ok, ko) => { const s = document.createElement("script"); s.src = url; s.onload = ok; s.onerror = () => { delete CACHE[url]; ko(new Error("Script introuvable")); }; document.head.appendChild(s); }));
  }
  const plat = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[’']/g, "'").trim();
  const LANG_NOMS = { fr: "Français", en: "English", es: "Español", it: "Italiano", ar: "العربية" };
  const LANG_VOIX = { fr: "fr-FR", en: "en-GB", es: "es-ES", it: "it-IT", ar: "ar-SA" };
  function parlerTexte(texte, lg) { if (lg === "fr") return parler(esc(texte)); if (LG.LANGUES[lg]) return parlerLangue(texte, lg); }
  const LIENS_EN_LIGNE = [
    ["Wikisource", "Des milliers de textes libres en français", "https://fr.wikisource.org"],
    ["Gallica (BnF)", "La bibliothèque numérique de la Bibliothèque nationale de France", "https://gallica.bnf.fr"],
    ["Projet Gutenberg", "Livres du domaine public dans toutes les langues", "https://www.gutenberg.org"],
    ["Bibliothèque numérique romande", "Classiques français gratuits, bien mis en page", "https://ebooks-bnr.com"],
    ["Littérature audio", "Livres audio gratuits lus par des bénévoles", "https://www.litteratureaudio.com"],
    ["Hindawi (عربي)", "Bibliothèque gratuite de livres en arabe", "https://www.hindawi.org/books/"],
  ];

  // =====================================================================
  //  BIBLIOTHÈQUE
  // =====================================================================
  const lectures = () => (D.lectures[enfant.id] = D.lectures[enfant.id] || {});
  let biblioLangue = "fr", biblioTous = false;
  function couverture(l) {
    const h = hash(l.id), teintes = [[214, 48], [8, 55], [150, 40], [268, 38], [30, 60], [190, 45], [340, 45], [95, 35]][h % 8];
    return `<span class="livre-couv" style="--h:${teintes[0]};--s:${teintes[1]}%"><span class="lc-titre">${esc(l.titre)}</span><span class="lc-auteur">${esc(l.auteur)}</span></span>`;
  }
  function ecranBibliotheque() {
    const n = enfant.niveau, mes = lectures();
    const enCours = LIVRES.filter(l => mes[l.id] && !mes[l.id].fini).sort((a, b) => (mes[b.id].maj || 0) - (mes[a.id].maj || 0));
    const liste = LIVRES.filter(l => l.lg === biblioLangue && (biblioTous || (n >= l.min && n <= l.max)));
    const genres = [...new Set(liste.map(l => l.genre))];
    const duree = l => { const m = Math.round(l.mots / (n <= 7 ? 120 : 200)); return m < 60 ? `${m} min` : `${Math.round(m / 60)} h`; };
    rendre(`<section class="page">
      ${entete("Ma bibliothèque", maternelle() ? "Des contes et des fables à écouter avec un adulte." : `${LIVRES.length} livres gratuits du domaine public, les grands classiques, choisis pour ton âge. Tout se lit sans Internet.`)}
      <div class="onglets" role="group" aria-label="Langue">${["fr", "en", "es", "it", "ar"].map(l => `<button class="onglet" data-lg="${l}" aria-pressed="${l === biblioLangue}" type="button"${l === "ar" ? ' lang="ar"' : ""}>${LANG_NOMS[l]}</button>`).join("")}
        <button class="onglet" data-outil="poesies" type="button">Poésies et comptines</button><button class="onglet" data-outil="dicos" type="button">Dictionnaires</button></div>
      ${enCours.length ? `<div class="sections"><h2 class="cursive titre-groupe">Je continue ma lecture</h2><div class="etagere">${enCours.slice(0, 6).map(l => `<button class="livre" data-id="${l.id}" type="button">${couverture(l)}<span class="livre-prog"><i style="width:${Math.round(100 * (mes[l.id].page + 1) / Math.max(1, mes[l.id].total))}%"></i></span><small>Page ${mes[l.id].page + 1} / ${mes[l.id].total}</small></button>`).join("")}</div></div>` : ""}
      ${biblioLangue === "ar" ? `<div class="feuille sections"><h2>Lire en arabe</h2><p>Je n'ai pas trouvé de livres en arabe du domaine public assez fiables pour les mettre hors ligne. Voici des bibliothèques gratuites en ligne :</p>
          <ul class="points"><li><a href="https://www.hindawi.org/books/" target="_blank" rel="noopener">Hindawi</a> : des milliers de livres arabes gratuits et légaux, dont des livres pour enfants.</li><li><a href="https://ar.wikisource.org" target="_blank" rel="noopener">Wikisource en arabe</a></li></ul>
          <p class="doux" style="margin:0">En attendant, « Les Mille et Une Nuits », contes venus du monde arabe, sont dans la bibliothèque en français.</p></div>`
        : liste.length ? genres.map(g => `<div class="sections"><h2 class="cursive titre-groupe">${esc(g)}</h2><div class="etagere">${liste.filter(l => l.genre === g).map(l => `<button class="livre" data-id="${l.id}" type="button">${couverture(l)}<b>${esc(l.titre)}</b><small>${esc(l.auteur)} · ${duree(l)}${n < 3 || (n <= 4 && l.min <= 4) ? " · avec un adulte" : ""}</small></button>`).join("")}</div></div>`).join("")
        : `<div class="feuille vide-etat">Pas encore de livre dans cette langue pour ta classe. <button class="btn second petit" id="voir-tous" type="button">Voir tous les livres</button></div>`}
      <div class="rangee"><label class="interrupteur" style="align-items:center"><input type="checkbox" id="tous" ${biblioTous ? "checked" : ""}><span>Montrer aussi les livres des autres âges</span></label></div>
      <details class="feuille"><summary><b>D'autres bibliothèques gratuites en ligne</b></summary><ul class="points">${LIENS_EN_LIGNE.map(([t, d, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${t}</a> — ${d}</li>`).join("")}</ul></details>
    </section>`);
    $("#retour").onclick = ecranAccueil;
    app.querySelectorAll("[data-lg]").forEach(b => b.onclick = () => { biblioLangue = b.dataset.lg; ecranBibliotheque(); });
    app.querySelector("[data-outil=dicos]").onclick = () => ecranDicos();
    app.querySelector("[data-outil=poesies]").onclick = () => ecranComptines();
    $("#tous").onchange = e => { biblioTous = e.target.checked; ecranBibliotheque(); };
    if ($("#voir-tous")) $("#voir-tous").onclick = () => { biblioTous = true; ecranBibliotheque(); };
    app.querySelectorAll(".livre").forEach(b => b.onclick = () => ouvrirLivre(LIVRES.find(l => l.id === b.dataset.id)));
  }

  // ---------- liseuse ----------
  const TITRE_RE = /^(chapitre|chapter|cap[ií]tulo|capitolo|livre|partie|acte|sc[eè]ne|canto|lettre|premi[eè]re partie|deuxi[eè]me partie)\b|^[IVXLC]+\.?(\s|$)|^[0-9]{1,3}\.?$/i;
  async function ouvrirLivre(l) {
    rendre(`<section class="page etroite"><div class="feuille vide-etat"><div class="grosse-emo"><span class="emo">📖</span></div><p>J'ouvre « ${esc(l.titre)} »…</p></div></section>`);
    let texte;
    try { texte = await charge("livres/" + l.id + ".txt"); } catch (e) { toast("Ce livre n'a pas pu être ouvert."); return ecranBibliotheque(); }
    const paras = texte.split(/\n\n+/);
    const taille = enfant.niveau <= 4 ? 1100 : enfant.niveau <= 7 ? 1800 : 2600;
    const pages = [], sommaire = []; let cur = [], n = 0;
    paras.forEach(p => {
      const titre = p.length < 70 && (TITRE_RE.test(p.trim()) || (p === p.toUpperCase() && /[A-ZÀ-Ý]{3}/.test(p) && p.length > 3));
      if (titre && cur.length && n > taille * .35) { pages.push(cur); cur = []; n = 0; }
      if (titre && sommaire.length < 400) sommaire.push([p.replace(/\s+/g, " ").trim(), pages.length]);
      cur.push(p); n += p.length;
      if (n >= taille) { pages.push(cur); cur = []; n = 0; }
    });
    if (cur.length) pages.push(cur);
    const etat = lectures()[l.id] || { page: 0 };
    etat.total = pages.length; lectures()[l.id] = etat;
    const debutSession = etat.page;
    let taillePolice = +(localStorage.getItem?.("taille-lecture") || 0) || (enfant.niveau <= 4 ? 1.35 : 1.15);
    let enLecture = false;   // lecture à voix haute en cours : elle continue toute seule à la page suivante
    function afficher(i) {
      const continuer = enLecture;
      i = Math.max(0, Math.min(pages.length - 1, i)); etat.page = i; etat.maj = Date.now(); if (i === pages.length - 1) etat.fini = true; sauver();
      rendre(`<section class="page etroite liseuse">
        <div class="entete"><div><button class="retour-lien" id="retour" type="button">${ICO.retour} Bibliothèque</button><h1 class="liv-titre">${esc(l.titre)}</h1><p class="doux">${esc(l.auteur)}</p></div>
          <div class="rangee"><button class="btn-discret" id="som" type="button">Sommaire</button><button class="btn-discret" id="moinsA" type="button" aria-label="Texte plus petit">A−</button><button class="btn-discret" id="plusA" type="button" aria-label="Texte plus grand">A+</button>
          ${"speechSynthesis" in window ? `<button class="btn second" id="lire" type="button">${ICO.son} Écouter le livre</button>` : ""}</div></div>
        <div id="sommaire" hidden class="feuille sommaire">${sommaire.length ? sommaire.map(([t, p]) => `<button type="button" data-p="${p}">${esc(t)} <small class="doux">p. ${p + 1}</small></button>`).join("") : '<p class="doux">Pas de chapitres repérés dans ce livre.</p>'}</div>
        <article class="page-livre${l.vers ? " vers" : ""}" lang="${l.lg}" style="font-size:${taillePolice}rem" id="pagelivre">${pages[i].map(p => TITRE_RE.test(p.trim()) && p.length < 70 ? `<h2>${esc(p)}</h2>` : `<p>${esc(p).replace(/\n/g, "<br>")}</p>`).join("")}</article>
        <p class="doux astuce-mot">Astuce : double-clique sur un mot pour le chercher dans le dictionnaire.${"speechSynthesis" in window ? " Pendant l'écoute, clique sur un paragraphe pour reprendre la lecture à cet endroit." : ""}</p>
        <div class="liv-nav"><button class="btn second" id="prec" type="button" ${i === 0 ? "disabled" : ""}>◀ Page précédente</button>
          <span class="liv-pos"><span class="livre-prog"><i style="width:${Math.round(100 * (i + 1) / pages.length)}%"></i></span>${i + 1} / ${pages.length}</span>
          <button class="btn" id="suiv" type="button" ${i === pages.length - 1 ? "disabled" : ""}>Page suivante ▶</button></div>
        <div id="popmot"></div>
        <p class="doux" style="font-size:.85rem">Texte du domaine public · source : <a href="${l.ref}" target="_blank" rel="noopener">${esc(l.source)}</a>.</p>
      </section>`);
      window.scrollTo(0, 0);
      const fermer = () => { enLecture = false; arreterChant(); recompenserLecture(); ecranBibliotheque(); };
      $("#retour").onclick = fermer;
      $("#prec").onclick = () => afficher(i - 1); $("#suiv").onclick = () => afficher(i + 1);
      app.onkeydown = e => { if (e.target.tagName === "INPUT") return; if (e.key === "ArrowRight") afficher(i + 1); if (e.key === "ArrowLeft") afficher(i - 1); };
      $("#som").onclick = () => { $("#sommaire").hidden = !$("#sommaire").hidden; };
      app.querySelectorAll("#sommaire [data-p]").forEach(b => b.onclick = () => afficher(+b.dataset.p));
      const police = d => { taillePolice = Math.max(.9, Math.min(2.2, taillePolice + d)); try { localStorage.setItem("taille-lecture", taillePolice); } catch { } $("#pagelivre").style.fontSize = taillePolice + "rem"; };
      $("#moinsA").onclick = () => police(-.1); $("#plusA").onclick = () => police(.1);
      const blocs = [...$("#pagelivre").children];
      const libelle = () => { const b = $("#lire"); if (b) { b.innerHTML = enLecture ? "⏹ Arrêter la lecture" : `${ICO.son} Écouter le livre`; b.classList.toggle("en-cours", enLecture); } };
      const demarrer = depuis => {
        const ctl = lireAVoixHaute(blocs.slice(depuis).map(el => ({ texte: el.innerText, lg: l.lg, el })), { surFin: fini => {
          if (fini && enLecture && i < pages.length - 1) return afficher(i + 1);
          if (fini && i === pages.length - 1) toast("Fin du livre. Bravo !");
          enLecture = false; libelle();
        } });
        enLecture = !!ctl; libelle();
      };
      if ($("#lire")) $("#lire").onclick = () => { if (enLecture) { enLecture = false; arreterChant(); libelle(); } else demarrer(0); };
      blocs.forEach((el, k) => el.onclick = () => { if (enLecture) demarrer(k); });
      if (continuer) demarrer(0);
      $("#pagelivre").ondblclick = () => { const s = (window.getSelection?.() + "").trim().replace(/^[^\p{L}]+|[^\p{L}]+$/gu, ""); if (s) rechercheRapide(s, l.lg); };
      let debutTouche; $("#pagelivre").ontouchstart = e => debutTouche = e.touches[0].clientX;
      $("#pagelivre").ontouchend = e => { const dx = e.changedTouches[0].clientX - debutTouche; if (Math.abs(dx) > 70) afficher(i + (dx < 0 ? 1 : -1)); };
    }
    function recompenserLecture() {
      const lues = etat.page - debutSession;
      if (lues >= 2) { noter("lecture", { id: l.id, pages: lues }); sauver(); gagner(Math.min(40, lues * 3), "lecture"); }
      if (etat.fini && !etat.recompense) { etat.recompense = true; sauver(); feter("📚", "Livre terminé !", `Tu as fini « ${l.titre} ». Bravo !`); gagner(50, "livre terminé"); }
    }
    afficher(etat.page || 0);
  }
  async function rechercheRapide(mot, lg) {
    const z = $("#popmot"); if (!z) return;
    z.innerHTML = `<div class="popmot"><b>${esc(mot)}</b><span class="doux">Je cherche…</span></div>`;
    let html = "";
    try {
      if (lg === "fr") {
        const syn = await charge("dicos/synonymes.json", "json"), cle = Object.keys(syn).find(k => k === mot.toLowerCase()) || mot.toLowerCase();
        const s = syn[cle];
        html = s ? `<div><span class="label">Synonymes</span> ${s.map(x => esc(x.slice(1, 7).join(", "))).join(" · ")}</div>` : "";
        html += `<div class="rangee"><a href="https://fr.wiktionary.org/wiki/${encodeURIComponent(mot.toLowerCase())}" target="_blank" rel="noopener">Définition (Wiktionnaire)</a><a href="https://www.cnrtl.fr/definition/${encodeURIComponent(mot.toLowerCase())}" target="_blank" rel="noopener">CNRTL</a></div>`;
      } else {
        const r = await chercherDico(lg, "versFr", mot);
        html = r.length ? r.slice(0, 3).map(([m, cat, tr]) => `<div><b>${esc(m)}</b> <small class="doux">${esc(cat)}</small> → ${esc(tr.join(", "))}</div>`).join("") : `<div class="doux">Pas trouvé dans le dictionnaire. Essaie la forme de base (infinitif, singulier).</div>`;
      }
    } catch { html = '<div class="doux">Dictionnaire indisponible.</div>'; }
    z.innerHTML = `<div class="popmot"><div class="rangee" style="justify-content:space-between"><span class="rangee" style="align-items:center"><b>${esc(mot)}</b>${btnEcoute("Écouter")}</span><button class="btn-discret" type="button" id="pm-x" aria-label="Fermer">×</button></div>${html}</div>`;
    $("#pm-x").onclick = () => z.innerHTML = "";
    brancherEcoute(z.querySelector(".btn-ecoute"), [{ texte: mot, lg }]);
  }

  // =====================================================================
  //  DICTIONNAIRES
  // =====================================================================
  const DICOS = { en: ["fr-en", "en-fr"], es: ["fr-es", "es-fr"], it: ["fr-it", "it-fr"] };
  const INDEX = {};
  async function indexDico(nom) {
    if (INDEX[nom]) return INDEX[nom];
    const d = await charge("dicos/" + nom + ".json", "json");
    const cles = Object.keys(d).map(k => [plat(k), k]).sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
    return (INDEX[nom] = { d, cles });
  }
  // ---------- outils communs à toutes les langues ----------
  const DICO_LANGUES = ["fr", "en", "es", "it", "ar"];
  const NOM_LANGUE = { fr: "français", en: "anglais", es: "espagnol", it: "italien", ar: "arabe" };
  const platAr = s => String(s || "").replace(/[ً-ْٰـ]/g, "").replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").trim();
  const estArabe = s => /[؀-ۿ]/.test(s);
  const attrLg = lg => lg === "ar" ? ' lang="ar" dir="rtl" class="ar"' : ` lang="${lg}"`;
  let dicoLangue = "fr";
  // Clavier arabe à l'écran (beaucoup d'ordinateurs n'ont pas de clavier arabe installé)
  const CLAVIER_AR = "ض ص ث ق ف غ ع ه خ ح ج د ش س ي ب ل ا ت ن م ك ط ئ ء ؤ ر ى ة و ز ظ ذ أ إ آ".split(" ");
  const HARAKAT = [["َ", "fatha"], ["ِ", "kasra"], ["ُ", "damma"], ["ْ", "soukoun"], ["ّ", "shadda"]];
  function clavierArabe(input) {
    const id = "clav-" + input.id;
    input.insertAdjacentHTML("afterend", `<div class="rangee"><button class="btn-discret" type="button" id="${id}-b">⌨️ Clavier arabe</button></div><div class="clavier ar" id="${id}" hidden dir="rtl">${CLAVIER_AR.map(c => `<button class="touche" type="button" data-c="${c}">${c}</button>`).join("")}${HARAKAT.map(([c, n]) => `<button class="touche harak" type="button" data-c="${c}" title="${n}">ـ${c}</button>`).join("")}<button class="touche" type="button" data-c=" ">espace</button><button class="touche" type="button" data-c="⌫">⌫</button></div>`);
    const k = document.getElementById(id);
    document.getElementById(id + "-b").onclick = () => { k.hidden = !k.hidden; input.focus(); };
    k.querySelectorAll("[data-c]").forEach(b => b.onclick = () => { const c = b.dataset.c; input.value = c === "⌫" ? input.value.slice(0, -1) : input.value + c; input.dispatchEvent(new Event("input")); input.focus(); });
  }

  // ---------- traduction ----------
  function dicoArabe() {
    const res = [];
    for (const th of LG.THEMES) for (const m of th.mots) res.push([m[0].replace(/^(le |la |les |l')/i, ""), m[5], m[6], m[0]]);
    return res;
  }
  let INDEX_AR = null;
  async function indexArabe() {
    if (INDEX_AR) return INDEX_AR;
    const d = await charge("dicos/ar-fr.json", "json");
    const cles = Object.keys(d).map(k => [platAr(k), k]).sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
    return (INDEX_AR = { d, cles });
  }
  async function chercherDico(lg, sens, q) {
    const p = plat(q); if (!p) return [];
    if (lg === "ar") {
      const module = dicoArabe();
      if (sens === "depuisFr") {
        const ix = await indexDico("fr-ar").catch(() => null), res = [];
        if (ix) { let lo = 0, hi = ix.cles.length; while (lo < hi) { const mid = (lo + hi) >> 1; if (ix.cles[mid][0] < p) lo = mid + 1; else hi = mid; }
          for (let i = lo; i < ix.cles.length && res.length < 40 && ix.cles[i][0].startsWith(p); i++) { const k = ix.cles[i][1]; res.push([k, ix.d[k][0], ix.d[k][1]]); } }
        for (const [fr, ar, tr, frc] of module) if (plat(fr).startsWith(p) && !res.some(r => plat(r[0]) === plat(fr))) res.push([frc, "", [ar + " (" + tr + ")"]]);
        return res.slice(0, 40);
      }
      const ix = await indexArabe().catch(() => null), res = [];
      if (estArabe(q) && ix) {
        const pa = platAr(q); let lo = 0, hi = ix.cles.length; while (lo < hi) { const mid = (lo + hi) >> 1; if (ix.cles[mid][0] < pa) lo = mid + 1; else hi = mid; }
        for (let i = lo; i < ix.cles.length && res.length < 40 && ix.cles[i][0].startsWith(pa); i++) { const k = ix.cles[i][1], [voc, tr, fr] = ix.d[k]; res.push([voc, tr, fr]); }
      } else if (ix) {   // recherche par la prononciation : « kitab »
        for (const k in ix.d) { const [voc, tr, fr] = ix.d[k]; if (plat(tr).replace(/[ʿʾ']/g, "").startsWith(p.replace(/'/g, ""))) res.push([voc, tr, fr]); if (res.length >= 40) break; }
      }
      for (const [fr, ar, tr, frc] of module) if ((estArabe(q) ? platAr(ar).startsWith(platAr(q)) : plat(tr).startsWith(p)) && !res.some(r => platAr(r[0]) === platAr(ar))) res.push([ar, tr, [frc]]);
      return res.slice(0, 40);
    }
    const nom = DICOS[lg][sens === "depuisFr" ? 0 : 1], ix = await indexDico(nom);
    let lo = 0, hi = ix.cles.length; while (lo < hi) { const mid = (lo + hi) >> 1; if (ix.cles[mid][0] < p) lo = mid + 1; else hi = mid; }
    const res = [];
    for (let i = lo; i < ix.cles.length && res.length < 40 && ix.cles[i][0].startsWith(p); i++) { const k = ix.cles[i][1]; res.push([k, ix.d[k][0], ix.d[k][1]]); }
    if (!res.length && sens === "versFr" && lg === "en" && !p.startsWith("to ")) return chercherDico(lg, sens, "to " + q);
    return res.filter(([k, , tr]) => !GROS_MOTS.test(plat(k + " " + tr.join(" "))));
  }
  // Les dictionnaires libres contiennent quelques mots d'adultes : on les masque pour les enfants.
  const GROS_MOTS = /\b(brothel|whore|prostitut\w*|pute|putain|bordel|maison close|salope|salaud|conn?ard\w*|connasse|enculer?\w*|foutre|merde|bite|couilles?|nichons?|fuck\w*|shit|bitch|cock|dick|pussy|cunt|porn\w*|sexe?|sexual\w*|sexuel\w*|puta\w*|mierda|cojones?|polla|coño|joder|cazzo|stronz\w*|vaffanculo|troia|figa|scopare|mignott\w*)\b/;
  let dicoOnglet = "traduire", dicoLg = "en", dicoSens = "depuisFr";
  function ecranDicos(onglet) {
    if (onglet) dicoOnglet = onglet;
    const onglets = [["traduire", "Traduire"], ["orthographe", "Orthographe"], ["conjugaison", "Conjugaison"], ["synonymes", "Synonymes"], ["grammaire", "Grammaire"], ["definitions", "Définitions"]];
    rendre(`<section class="page etroite">
      <div class="entete"><div><button class="retour-lien" id="retour" type="button">${ICO.retour} Bibliothèque</button><h1>Dictionnaires</h1>
        <p class="doux">Cinq langues, six outils. Tout fonctionne sans Internet, sauf les définitions.</p></div></div>
      <div class="dico-langues" role="group" aria-label="Langue">${DICO_LANGUES.map(l => `<button class="dico-lg${l === dicoLangue ? " actif" : ""}" data-dl="${l}" type="button"${l === "ar" ? ' lang="ar"' : ""}>${{ fr: "🇫🇷 Français", en: "🇬🇧 English", es: "🇪🇸 Español", it: "🇮🇹 Italiano", ar: "العربية" }[l]}</button>`).join("")}</div>
      <div class="onglets" role="group" aria-label="Outil">${onglets.map(([k, t]) => `<button class="onglet" data-o="${k}" aria-pressed="${k === dicoOnglet}" type="button">${t}</button>`).join("")}</div>
      <div id="dico-corps" class="sections"></div></section>`);
    $("#retour").onclick = ecranBibliotheque;
    app.querySelectorAll("[data-o]").forEach(b => b.onclick = () => ecranDicos(b.dataset.o));
    app.querySelectorAll("[data-dl]").forEach(b => b.onclick = () => { dicoLangue = b.dataset.dl; if (dicoLangue !== "fr") dicoLg = dicoLangue; ecranDicos(); });
    ({ traduire: dicoTraduire, orthographe: dicoOrthographe, conjugaison: dicoConjugaison, synonymes: dicoSynonymes, grammaire: dicoGrammaire, definitions: dicoDefinitions })[dicoOnglet]($("#dico-corps"));
  }
  function dicoTraduire(z) {
    const nomLg = { en: "anglais", es: "espagnol", it: "italien", ar: "arabe" };
    const versFr = dicoSens !== "depuisFr";
    z.innerHTML = `<div class="feuille sections">
      <div class="puces">${Object.keys(nomLg).map(l => `<button type="button" class="puce" data-l="${l}" aria-pressed="${l === dicoLg}">${LANG_NOMS[l]}</button>`).join("")}</div>
      <div class="rangee"><button class="btn second petit" id="sens" type="button">${!versFr ? `Français → ${nomLg[dicoLg]}` : `${nomLg[dicoLg][0].toUpperCase() + nomLg[dicoLg].slice(1)} → français`} ⇄</button></div>
      <div class="champ"><label for="dq">Tape un mot</label><input id="dq" autocomplete="off" spellcheck="false" placeholder="${!versFr ? "Ex. : maison" : { en: "Ex. : house", es: "Ex. : casa", it: "Ex. : casa", ar: "Ex. : بيت ou bayt" }[dicoLg]}"${dicoLg === "ar" && versFr ? ' dir="auto"' : ""}></div>
      <div id="dres" class="dres"></div>
      <p class="doux" style="margin:0;font-size:.85rem">${dicoLg === "ar" ? "Dictionnaire français-arabe de plus de 5 600 mots courants, vocalisés (avec les harakat) et avec leur prononciation, plus les mots du module Langues. Pour aller plus loin : " + `<a href="https://www.almaany.com/fr/dict/ar-fr/" target="_blank" rel="noopener">Almaany</a>.` : dicoLg === "en" ? "Sources : FreeDict (anglais), dictionnaires libres." : "Source : dictionnaires bilingues libres Apertium."}</p></div>`;
    if (dicoLg === "ar" && versFr) clavierArabe($("#dq"));
    if (dicoLg === "ar") {
      z.insertAdjacentHTML("beforeend", `<div class="feuille sons-paquet" id="sons-paquet"><span class="doux">Sons des mots arabes…</span></div>`);
      chargerSonsDico().then(p => {
        const zz = $("#sons-paquet"); if (!zz) return;
        const n = p ? Object.keys(p.index).length : 0, complet = n >= 6000;
        zz.innerHTML = complet ? `<span class="doux">🔊 ${n.toLocaleString("fr-FR")} mots arabes prononcés (paquet complet installé).</span>`
          : `<span class="doux">🔊 ${n ? `${n.toLocaleString("fr-FR")} mots arabes prononcés.` : "Les sons des mots arabes se téléchargent tout seuls la première fois que l'appareil est connecté à Internet."}</span>
             <label class="btn-discret" for="paquet-f">Pour les adultes : ajouter tous les sons (fichier Sons-dictionnaire-arabe.pack)</label><input type="file" id="paquet-f" accept=".pack" hidden>`;
        if ($("#paquet-f")) $("#paquet-f").onchange = e => { const f = e.target.files[0]; e.target.value = ""; if (!f) return;
          avecPin(async () => { try { const n2 = await importerPaquetSons(f); toast(`C'est installé : ${n2.toLocaleString("fr-FR")} mots arabes prononcés.`); } catch (er) { toast(er.message || "Ce fichier n'a pas pu être lu."); } ecranDicos("traduire"); }); };
      });
    }
    z.querySelectorAll(".puce[data-l]").forEach(b => b.onclick = () => { dicoLg = b.dataset.l; dicoTraduire(z); });
    $("#sens").onclick = () => { dicoSens = dicoSens === "depuisFr" ? "versFr" : "depuisFr"; dicoTraduire(z); };
    let minuteur;
    const go = async () => {
      const q = $("#dq").value, r = await chercherDico(dicoLg, dicoSens, q).catch(() => null);
      const res = $("#dres"); if (!res) return;
      if (r === null) { res.innerHTML = '<p class="doux">Dictionnaire indisponible.</p>'; return; }
      const cibleLg = versFr ? "fr" : dicoLg;
      res.innerHTML = !q.trim() ? "" : r.length ? r.map(([m, cat, tr]) => `<div class="dligne"><div><b${versFr && dicoLg === "ar" ? ' class="ar" lang="ar"' : ""}>${esc(m)}</b> <small class="doux">${esc(cat)}</small></div>
          <div class="dtrad">${tr.map(t => `<span${cibleLg === "ar" ? ' class="ar" lang="ar"' : ""}>${esc(t)}</span>`).join(" · ")} ${cibleLg !== "fr" ? `<button class="btn-discret" type="button" data-dire="${esc(tr[0].replace(/\s*\[.*?\]/, "").replace(/\s*\(.*\)$/, ""))}" aria-label="Écouter">${ICO.son}</button>` : `<button class="btn-discret" type="button" data-dire="${esc(m.split(" / ")[0])}" data-lgd="${dicoLg}" aria-label="Écouter">${ICO.son}</button>`}</div></div>`).join("")
        : `<p class="doux">Aucun mot trouvé. Essaie la forme de base : l'infinitif pour un verbe, le singulier pour un nom.</p>`;
      res.querySelectorAll("[data-dire]").forEach(b => b.onclick = () => parlerTexte(b.dataset.dire, b.dataset.lgd || cibleLg));
    };
    $("#dq").oninput = () => { clearTimeout(minuteur); minuteur = setTimeout(go, 180); };
    $("#dq").focus();
  }

  // ---------- orthographe ----------
  // fr, en, es : dictionnaires Hunspell (LibreOffice) ; it, ar : liste de formes vérifiées par Hunspell, avec suggestions par proximité.
  const CORR = {};
  async function correcteurLg(lg) {
    if (CORR[lg]) return CORR[lg];
    if (["fr", "en", "es"].includes(lg)) {
      await chargeScript("vendor/outils/orthographe.js");
      const [aff, dic] = await Promise.all([charge(`dicos/${lg}.aff`), charge(`dicos/${lg}.dic`)]);
      await new Promise(r => setTimeout(r, 30));
      const ns = window.NSpell(aff.replace(/^﻿/, ""), dic.replace(/^﻿/, ""));
      return (CORR[lg] = { correct: w => ns.correct(w) || ns.correct(w.toLowerCase()), suggest: w => ns.suggest(w).slice(0, 4) });
    }
    const sansHarakat = s => String(s || "").replace(/[\u064B-\u0652\u0670\u0640]/g, "");
    const txt = await charge(`dicos/mots-${lg}.txt`), liste = txt.split("\n"), rang = new Map(); liste.forEach((w, i) => { const k = lg === "ar" ? sansHarakat(w).replace(/ـ/g, "") : w.toLowerCase(); if (!rang.has(k)) rang.set(k, i); });
    const alpha = lg === "ar" ? [..."ابتثجحخدذرزسشصضطظعغفقكلمنهويةأإآؤئءى"] : [..."abcdefghijklmnopqrstuvwxyzàèéìíòóùú'"];
    const norm = w => lg === "ar" ? sansHarakat(w) : w.toLowerCase();
    // en arabe, on accepte aussi les mots avec préfixes et suffixes courants (و، ف، ب، ل، ال… / ـه، ـها، ـهم…)
    const variantes = w => { if (lg !== "ar") return [w]; const v = [w]; for (const p of ["وال", "فال", "بال", "كال", "لل", "ال", "و", "ف", "ب", "ل", "ك", "س"]) if (w.startsWith(p) && w.length - p.length > 1) v.push(w.slice(p.length)); return v; };
    const connu = w => variantes(norm(w)).some(x => rang.has(x));
    const suggest = w => {
      const n = norm(w), c = new Map();
      const ajoute = x => { if (rang.has(x) && x !== n) c.set(x, rang.get(x)); };
      for (let i = 0; i <= n.length; i++) {
        if (i < n.length) ajoute(n.slice(0, i) + n.slice(i + 1));
        if (i < n.length - 1) ajoute(n.slice(0, i) + n[i + 1] + n[i] + n.slice(i + 2));
        for (const a of alpha) { if (i < n.length) ajoute(n.slice(0, i) + a + n.slice(i + 1)); ajoute(n.slice(0, i) + a + n.slice(i)); }
      }
      // arabe : d'abord les erreurs les plus fréquentes (hamza, ة / ه, ى / ي)
      const prioritaires = lg !== "ar" ? [] : [n.replace(/^ا/, "أ"), n.replace(/^ا/, "إ"), n.replace(/^ال(ا)/, "الأ"), n.replace(/^ال(ا)/, "الإ"), n.replace(/ه$/, "ة"), n.replace(/ي$/, "ى"), n.replace(/ى$/, "ي"), n.replace(/ا$/, "ى")].filter(x => x !== n && rang.has(x)).sort((x, y) => rang.get(x) - rang.get(y));
      const tri = [...c].sort((a, b) => a[1] - b[1]).map(([x]) => x).filter(x => !prioritaires.includes(x));
      return [...new Set([...prioritaires, ...tri])].slice(0, 4).map(x => lg === "ar" ? (liste[rang.get(x)] || x).replace(/ـ/g, "") : x);
    };
    return (CORR[lg] = { correct: connu, suggest });
  }
  function dicoOrthographe(z) {
    const lg = dicoLangue, ex = { fr: "Les éléfants marche dans la savanne.", en: "I recieve a letter evry day.", es: "Mañana bamos a la playa.", it: "Domani andiamo al mare con i miei amicci.", ar: "ذهبت الى المدرسه" }[lg];
    z.innerHTML = `<div class="feuille sections"><div class="champ"><label for="ot">Écris ou colle ton texte en ${NOM_LANGUE[lg]}, je repère les mots mal orthographiés</label>
      <textarea id="ot" rows="6" placeholder="Ex. : ${esc(ex)}"${lg === "ar" ? ' dir="rtl" lang="ar"' : ` lang="${lg}"`}></textarea></div>
      <div class="rangee"><button class="btn" id="ov" type="button">Vérifier l'orthographe</button>${btnEcoute("Écouter mon texte")}<span id="oe" class="doux" aria-live="polite"></span></div>
      <div id="or" class="texte-lecon"${lg === "ar" ? ' dir="rtl" lang="ar"' : ""}></div>
      <p class="doux" style="margin:0;font-size:.85rem">${lg === "fr" ? "Je vérifie que chaque mot existe (dictionnaire Grammalecte / LibreOffice). Les accords (« les éléphants marche ») ne sont pas vérifiés : relis-toi avec le mémo de grammaire" + (iaDispo() ? " ou demande à Plume" : "") + "." : `Je vérifie que chaque mot existe en ${NOM_LANGUE[lg]} (dictionnaires libres de LibreOffice${lg === "ar" ? " : Ayaspell" : ""}). La grammaire n'est pas vérifiée.${lg === "ar" ? " Écris sans les harakat : je ne vérifie que les lettres." : ""}`}</p></div>`;
    if (lg === "ar") clavierArabe($("#ot"));
    brancherEcoute(z.querySelector(".btn-ecoute"), () => [{ texte: $("#ot").value, lg }]);
    $("#ov").onclick = async () => {
      const t = $("#ot").value; if (!t.trim()) return;
      $("#oe").textContent = "Je prépare le dictionnaire… (quelques secondes la première fois)";
      try {
        const ns = await correcteurLg(lg); let fautes = 0;
        const html = esc(t).replace(/[\p{L}ً-ْ][\p{L}ً-ْ'’-]*/gu, w => { const m = w.replace(/’/g, "'"); if (ns.correct(m) || /^[A-ZÀ-Ý]/.test(m) && m.length < 2 || (lg !== "ar" && /^[A-ZÀ-Ý]/.test(m) && ns.correct(m.toLowerCase()))) return w; fautes++; const sug = ns.suggest(m); return `<mark class="faute" title="${esc(sug.join(", ") || "pas de suggestion")}">${w}</mark>${sug.length ? `<small class="sug"> (${esc(sug.join("، ".length && lg === "ar" ? "، " : ", "))})</small>` : ""}`; });
        $("#or").innerHTML = html.replace(/\n/g, "<br>");
        $("#oe").textContent = fautes ? `${fautes} mot${fautes > 1 ? "s" : ""} à vérifier.` : "Aucune faute d'orthographe trouvée.";
      } catch (e) { $("#oe").textContent = "Le correcteur n'a pas pu démarrer."; }
    };
  }

  // ---------- conjugaison ----------
  const TEMPS_CONJ = [["PRESENT", "Présent", 3], ["IMPARFAIT", "Imparfait", 4], ["FUTUR", "Futur simple", 4], ["PASSE_COMPOSE", "Passé composé", 5], ["PASSE_SIMPLE", "Passé simple", 6], ["PLUS_QUE_PARFAIT", "Plus-que-parfait", 7],
    ["CONDITIONNEL_PRESENT", "Conditionnel présent", 7], ["FUTUR_ANTERIEUR", "Futur antérieur", 8], ["SUBJONCTIF_PRESENT", "Subjonctif présent", 8], ["IMPERATIF_PRESENT", "Impératif présent", 6], ["PASSE_ANTERIEUR", "Passé antérieur", 9], ["SUBJONCTIF_IMPARFAIT", "Subjonctif imparfait", 12]];
  // Anglais, espagnol, italien : tables des modèles Verbiste (via mlconjug3) ; temps composés construits avec leur auxiliaire.
  const PRON = { en: ["I", "you", "he / she / it", "we", "you", "they"], es: ["yo", "tú", "él / ella", "nosotros", "vosotros", "ellos / ellas"], it: ["io", "tu", "lui / lei", "noi", "voi", "loro"] };
  const AUX = {
    es: { he: ["he", "has", "ha", "hemos", "habéis", "han"], habia: ["había", "habías", "había", "habíamos", "habíais", "habían"], estar: ["estoy", "estás", "está", "estamos", "estáis", "están"] },
    it: { avere: ["ho", "hai", "ha", "abbiamo", "avete", "hanno"], essere: ["sono", "sei", "è", "siamo", "siete", "sono"], avevo: ["avevo", "avevi", "aveva", "avevamo", "avevate", "avevano"], ero: ["ero", "eri", "era", "eravamo", "eravate", "erano"] },
  };
  const TEMPS_LG = {
    en: [["Present simple (présent)", v => v.f("present")], ["Present continuous (en train de)", v => ["am", "are", "is", "are", "are", "are"].map(a => a + " " + v.f("ing")[0])], ["Past simple (prétérit)", v => v.f("past")],
      ["Past continuous", v => ["was", "were", "was", "were", "were", "were"].map(a => a + " " + v.f("ing")[0])], ["Present perfect", v => ["have", "have", "has", "have", "have", "have"].map(a => a + " " + v.f("pp")[0])],
      ["Past perfect (plus-que-parfait)", v => Array(6).fill("had " + v.f("pp")[0])], ["Future (futur)", v => Array(6).fill("will " + v.inf)], ["Conditional (conditionnel)", v => Array(6).fill("would " + v.inf)], ["Imperative (impératif)", v => ["", v.inf, "", "let's " + v.inf, v.inf, ""]]],
    es: [["Presente", v => v.f("pres")], ["Pretérito imperfecto (imparfait)", v => v.f("imparf")], ["Pretérito indefinido (passé simple)", v => v.f("ps")], ["Pretérito perfecto (passé composé)", v => AUX.es.he.map(a => a + " " + v.f("part")[0])],
      ["Estar + gerundio (en train de)", v => AUX.es.estar.map(a => a + " " + v.f("ger")[0])], ["Futuro", v => v.f("fut")], ["Condicional", v => v.f("cond")], ["Pluscuamperfecto", v => AUX.es.habia.map(a => a + " " + v.f("part")[0])],
      ["Subjuntivo presente", v => v.f("subj")], ["Subjuntivo imperfecto", v => v.f("subjimp")], ["Imperativo (impératif)", v => { const f = v.f("imp"); return ["", f[0], f[1], f[2], f[3], f[4]]; }]],
    it: [["Presente", v => v.f("pres")], ["Imperfetto (imparfait)", v => v.f("imparf")], ["Passato prossimo (passé composé)", v => v.pp(AUX.it.avere, AUX.it.essere)], ["Futuro semplice", v => v.f("fut")],
      ["Condizionale presente", v => v.f("cond")], ["Trapassato prossimo (plus-que-parfait)", v => v.pp(AUX.it.avevo, AUX.it.ero)], ["Passato remoto (passé simple)", v => v.f("pr")], ["Congiuntivo presente", v => v.f("subj")],
      ["Congiuntivo imperfetto", v => v.f("subjimp")], ["Imperativo (impératif)", v => v.f("imp")]],
  };
  async function verbeLg(lg, inf) {
    const d = await charge(`dicos/conj-${lg}.json`, "json"), e = d.v[inf]; if (!e) return null;
    const [racine, im] = e, m = d.m[im] || {};
    const f = k => (m[k] || []).map(x => x == null ? "" : x.split("/").map(y => racine + y).join(" / "));
    const v = { inf, f };
    if (lg === "it") { const pp = f("pp"), essere = pp.length > 3 && pp[3] !== pp[0];
      v.essere = essere; v.pp = (av, es) => (essere ? es : av).map((a, i) => a + " " + (pp[i] || pp[0])); }
    return v;
  }
  async function verbesProches(lg, q) {
    const d = await charge(`dicos/conj-${lg}.json`, "json"), p = plat(q);
    return Object.keys(d.v).filter(x => plat(x).startsWith(p)).sort((a, b) => a.length - b.length).slice(0, 12);
  }
  // Arabe : tables générées par Qutrub (conjugueur libre de Taha Zerrouki) pour plus de 1 200 verbes courants.
  const PRON_AR = [["أَنَا", "je"], ["أَنْتَ", "tu (garçon)"], ["أَنْتِ", "tu (fille)"], ["هُوَ", "il"], ["هِيَ", "elle"], ["أَنْتُمَا", "vous deux"], ["هُمَا", "eux deux"], ["هُمَا", "elles deux"], ["نَحْنُ", "nous"], ["أَنْتُمْ", "vous (garçons)"], ["أَنْتُنَّ", "vous (filles)"], ["هُمْ", "ils"], ["هُنَّ", "elles"]];
  const TEMPS_AR = [["passe", "Le passé — الْمَاضِي"], ["present", "Le présent — الْمُضَارِع"], ["futur", "Le futur — الْمُسْتَقْبَل (سَـ + présent)"], ["jussif", "Le passé nié — لَمْ + الْمَجْزُوم"], ["subj", "Le futur nié — لَنْ + الْمَنْصُوب"], ["imperatif", "L'impératif — الْأَمْر"]];
  function dicoConjugaison(z) {
    const lg = dicoLangue;
    const ph = { fr: "Ex. : aller, finir, prendre", en: "Ex. : go, play, be — ou un verbe français", es: "Ex. : hablar, tener, ir — ou un verbe français", it: "Ex. : parlare, essere, andare — ou un verbe français", ar: "Ex. : كتب ou écrire" }[lg];
    z.innerHTML = `<div class="feuille sections"><div class="champ"><label for="cv">${lg === "fr" ? "Un verbe à l'infinitif" : lg === "ar" ? "Un verbe arabe (au passé : كَتَبَ) ou un verbe français" : `Un verbe en ${NOM_LANGUE[lg]} à l'infinitif, ou un verbe français`}</label><input id="cv" autocomplete="off" spellcheck="false" placeholder="${ph}"${lg === "ar" ? ' dir="auto"' : ""}></div>
      ${lg === "fr" ? `<label class="interrupteur"><input type="checkbox" id="ctous"><span>Montrer tous les temps (sinon, ceux de ta classe)</span></label>` : ""}
      <div id="cres"></div></div>`;
    if (lg === "ar") clavierArabe($("#cv"));
    let minuteur;
    const proposer = (res, titre, liste) => { res.innerHTML = liste.length ? `<p>${titre} ${liste.map(x => `<button class="puce" type="button" data-v="${esc(x[0])}"${x[2] ? ' lang="ar"' : ""}>${esc(x[1])}</button>`).join(" ")}</p>` : `<p class="doux">Je ne connais pas ce verbe. Vérifie l'orthographe.</p>`;
      res.querySelectorAll("[data-v]").forEach(b => b.onclick = () => { $("#cv").value = b.dataset.v; go(); }); };
    const ecouteTemps = (res, lgv) => res.querySelectorAll(".conj-temps").forEach(bloc => brancherEcoute(bloc.querySelector(".btn-ecoute"), () => [...bloc.querySelectorAll("li")].map(li => ({ texte: (li.querySelector("b") || li).textContent, lg: lgv, el: li }))));
    const go = async () => {
      const v = $("#cv").value.trim(), res = $("#cres"); if (!v) { res.innerHTML = ""; return; }
      res.innerHTML = '<p class="doux">Je cherche…</p>';
      if (lg === "fr") return conjFr(v.toLowerCase(), res);
      if (lg === "ar") {
        const d = await charge("dicos/conj-ar.json", "json").catch(() => null); if (!d) { res.innerHTML = '<p class="doux">Le conjugueur n\'a pas pu démarrer.</p>'; return; }
        let cle = Object.keys(d).find(k => k === v) || Object.keys(d).find(k => platAr(k) === platAr(v));
        if (!cle) { const p = plat(v), l = estArabe(v) ? Object.keys(d).filter(k => platAr(k).startsWith(platAr(v))) : Object.keys(d).filter(k => d[k].fr.some(f => plat(f) === p || plat(f).startsWith(p + " ")));
          return proposer(res, estArabe(v) ? "Tu voulais dire :" : `En arabe, « ${esc(v)} » se dit :`, l.slice(0, 12).map(k => [k, k + (estArabe(v) ? "" : "") , 1])); }
        const e = d[cle], t = { ...e.t, futur: (e.t.present || []).map(x => x ? "سَ" + x : "") };
        res.innerHTML = `<p><b class="ar" lang="ar">${esc(cle)}</b> : ${esc(e.fr.join(", "))}</p><div class="conj-grille ar-conj">${TEMPS_AR.filter(([k]) => t[k]).map(([k, nom]) => `<div class="conj-temps"><h3>${nom} ${btnEcoute("Écouter")}</h3><ul>${t[k].map((f, i) => f ? `<li><span class="doux">${PRON_AR[i][1]}</span> <span class="ar" lang="ar" dir="rtl">${PRON_AR[i][0]} <b>${k === "jussif" ? "لَمْ " : k === "subj" ? "لَنْ " : ""}${esc(f)}</b></span></li>` : "").join("")}</ul></div>`).join("")}</div>
          <p class="doux" style="margin:0;font-size:.85rem">Tables calculées par Qutrub, conjugueur arabe libre. « لَمْ » + forme apocopée = passé négatif ; « لَنْ » + subjonctif = futur négatif.</p>`;
        return ecouteTemps(res, "ar");
      }
      let inf = v.toLowerCase().replace(/^to /, ""), verbe = await verbeLg(lg, inf).catch(() => null);
      if (!verbe) {
        // pas trouvé : c'est peut-être un verbe français -> on propose sa traduction
        const tr = await chercherDico(lg, "depuisFr", v).catch(() => []), d = await charge(`dicos/conj-${lg}.json`, "json");
        const trad = [...new Set(tr.flatMap(([, , t]) => t).map(x => x.replace(/^to /, "").replace(/\s*\(.*\)$/, "").trim()).filter(x => d.v[x]))].slice(0, 8);
        if (trad.length) return proposer(res, `« ${esc(v)} » en ${NOM_LANGUE[lg]} :`, trad.map(x => [x, x]));
        return proposer(res, "Tu voulais dire :", (await verbesProches(lg, inf)).map(x => [x, x]));
      }
      res.innerHTML = `${lg === "it" ? `<p>Auxiliaire aux temps composés : <b>${verbe.essere ? "essere" : "avere"}</b>.</p>` : ""}<div class="conj-grille">${TEMPS_LG[lg].map(([nom, fn]) => {
        let formes; try { formes = fn(verbe); } catch { return ""; } if (!formes || !formes.some(Boolean)) return "";
        const lignes = formes.map((f, p) => f && !/^\s|undefined/.test(f) ? `<li>${nom.startsWith("Imperati") || nom.startsWith("Imperative") ? "" : PRON[lg][p] + " "}<b>${esc(f)}</b></li>` : "").join("");
        return lignes ? `<div class="conj-temps"><h3>${nom} ${btnEcoute("Écouter")}</h3><ul>${lignes}</ul></div>` : ""; }).join("")}</div>
        <p class="doux" style="margin:0;font-size:.85rem">Tables issues des modèles libres Verbiste / mlconjug3.</p>`;
      res.querySelectorAll(".conj-temps").forEach(bloc => brancherEcoute(bloc.querySelector(".btn-ecoute"), () => [...bloc.querySelectorAll("li")].map(li => ({ texte: li.textContent.replace(" / ", ", "), lg, el: li }))));
    };
    async function conjFr(v, res) {
      try { await chargeScript("vendor/outils/conjugaison.js"); } catch { res.innerHTML = '<p class="doux">Le conjugueur n\'a pas pu démarrer.</p>'; return; }
      const C = window.CONJ;
      if (!C.existe(v)) { const proches = C.verbes().filter(x => plat(x).startsWith(plat(v))).slice(0, 12); return proposer(res, `Je ne connais pas « ${esc(v)} ». Tu voulais dire :`, proches.map(x => [x, x])); }
      const PR = ["je", "tu", "il / elle", "nous", "vous", "ils / elles"], tous = $("#ctous").checked;
      const temps = TEMPS_CONJ.filter(t => tous || t[2] <= Math.max(enfant.niveau, 4));
      const pron = (p, f, t) => t === "IMPERATIF_PRESENT" ? "" : (p === 0 && /^[aeéèêiîoôuûhy]/i.test(f) ? "j'" : PR[p] + " ") + "";
      res.innerHTML = `<p>Auxiliaire aux temps composés : <b>${C.aux(v) === "ETRE" ? "être" : "avoir"}</b>.</p><div class="conj-grille">${temps.map(([t, nom]) => {
        const lignes = [0, 1, 2, 3, 4, 5].map(p => { try { const f = C.conjuguer(v, t, p); if (!f || f === "NA") return ""; const sub = t.startsWith("SUBJONCTIF") ? (p === 2 || p === 5 ? "qu'" : "que ") : ""; return `<li>${sub}${pron(p, f, t)}<b>${esc(f)}</b></li>`; } catch { return ""; } }).join("");
        return lignes ? `<div class="conj-temps"><h3>${nom} ${btnEcoute("Écouter")}</h3><ul>${lignes}</ul></div>` : ""; }).join("")}</div>`;
      res.querySelectorAll(".conj-temps").forEach(bloc => brancherEcoute(bloc.querySelector(".btn-ecoute"), () => [{ texte: bloc.querySelector("h3").firstChild.textContent.trim() + ".", lg: "fr" },
        ...[...bloc.querySelectorAll("li")].map(li => ({ texte: li.textContent.replace(" / ", " ou ") + ".", lg: "fr", el: li }))]));
    }
    $("#cv").oninput = () => { clearTimeout(minuteur); minuteur = setTimeout(go, 300); };
    if ($("#ctous")) $("#ctous").onchange = go;
    $("#cv").focus();
  }

  // ---------- synonymes ----------
  function dicoSynonymes(z) {
    const lg = dicoLangue, fichier = lg === "fr" ? "dicos/synonymes.json" : `dicos/syn-${lg}.json`;
    const ph = { fr: "Ex. : beau, content, dire", en: "Ex. : happy, big, say", es: "Ex. : feliz, grande, decir", it: "Ex. : felice, grande, dire", ar: "Ex. : جميل" }[lg];
    z.innerHTML = `<div class="feuille sections"><div class="champ"><label for="sq">Un mot en ${NOM_LANGUE[lg]}</label><input id="sq" autocomplete="off" placeholder="${ph}"${lg === "ar" ? ' dir="auto"' : ""}></div><div id="sres"></div>
      <p class="doux" style="margin:0;font-size:.85rem">Source : thésaurus libres de LibreOffice${lg === "en" ? " (WordNet)" : lg === "fr" ? " (Dicollecte)" : ""}. Choisis le synonyme qui convient au sens de ta phrase.</p></div>`;
    if (lg === "ar") clavierArabe($("#sq"));
    const N = { nom: "nom", verbe: "verbe", adjectif: "adjectif", adverbe: "adverbe", "": "sens" };
    let minuteur;
    const go = async () => {
      const q = $("#sq").value.trim().toLowerCase(), res = $("#sres"); if (!q) { res.innerHTML = ""; return; }
      res.innerHTML = '<p class="doux">Je cherche…</p>';
      const syn = await charge(fichier, "json").catch(() => null); if (!syn) { res.innerHTML = '<p class="doux">Indisponible.</p>'; return; }
      const n = lg === "ar" ? platAr : plat;
      let s = syn[q], cle = q;
      if (!s) { cle = Object.keys(syn).find(k => n(k) === n(q)); s = cle && syn[cle]; }
      if (!s) { const proches = Object.keys(syn).filter(k => n(k).startsWith(n(q))).sort((a, b) => a.length - b.length).slice(0, 15); res.innerHTML = proches.length ? `<p>Essaie : ${proches.map(x => `<button class="puce" type="button" data-s="${esc(x)}"${attrLg(lg)}>${esc(x)}</button>`).join(" ")}</p>` : '<p class="doux">Pas de synonyme trouvé.</p>';
        res.querySelectorAll("[data-s]").forEach(b => b.onclick = () => { $("#sq").value = b.dataset.s; go(); }); return; }
      res.innerHTML = s.map(([cat, ...m]) => `<div class="dligne"><div class="rangee" style="align-items:center"><small class="label">${esc(N[cat] ?? cat)}</small>${btnEcoute("Écouter")}</div><div class="puces">${m.map(x => `<button class="puce" type="button" data-s="${esc(x)}"${attrLg(lg)}>${esc(x)}</button>`).join("")}</div></div>`).join("");
      res.querySelectorAll(".dligne").forEach(d => brancherEcoute(d.querySelector(".btn-ecoute"), () => [{ texte: `${cle}, ` + [...d.querySelectorAll(".puce")].map(p => p.textContent).join(", ") + ".", lg, el: d }]));
      res.querySelectorAll("[data-s]").forEach(b => b.onclick = () => { $("#sq").value = b.dataset.s; go(); });
    };
    $("#sq").oninput = () => { clearTimeout(minuteur); minuteur = setTimeout(go, 250); }; $("#sq").focus();
  }

  // ---------- grammaire ----------
  async function dicoGrammaire(z, voirTout) {
    const lg = dicoLangue;
    if (lg !== "fr") { z.innerHTML = '<p class="doux">J\'ouvre les fiches…</p>'; try { await chargeScript("grammaire_lg.js"); } catch { z.innerHTML = '<p class="doux">Fiches indisponibles.</p>'; return; } }
    const toutes = lg === "fr" ? GRAMMAIRE : (window.GRAMMAIRE_LG || {})[lg] || [];
    const tout = voirTout || enfant.niveau >= 12;
    const fiches = toutes.filter(f => tout || f.n <= Math.max(enfant.niveau, 4) + 1);
    const themes = [...new Set(fiches.map(f => f.theme))];
    const lgEx = lg;   // les exemples sont dans la langue, le texte en français : lecture en français, exemples dans leur langue
    z.innerHTML = (fiches.length ? themes.map(t => `<div class="sections"><h2 class="cursive titre-groupe">${t}</h2>${fiches.filter(f => f.theme === t).map(f => `<details class="feuille fiche-gram"><summary><b>${f.titre}</b></summary><div class="rangee">${btnEcoute("Écouter la fiche")}</div><ul class="points">${f.corps.map(c => `<li>${c}</li>`).join("")}</ul></details>`).join("")}</div>`).join("")
      : `<div class="feuille vide-etat">Les fiches de ${NOM_LANGUE[lg]} commencent un peu plus tard dans la scolarité.</div>`)
      + (toutes.length > fiches.length ? `<div class="rangee"><button class="btn second petit" id="gtout" type="button">Voir toutes les fiches (${toutes.length})</button></div>` : "")
      + `<p class="doux" style="margin:0">Les fiches s'adaptent à ta classe.${lg !== "fr" ? ` Explications en français, exemples en ${NOM_LANGUE[lg]}.` : ""}</p>`;
    if ($("#gtout")) $("#gtout").onclick = () => dicoGrammaire(z, true);
    z.querySelectorAll(".fiche-gram").forEach(f => brancherEcoute(f.querySelector(".btn-ecoute"), () => [{ texte: f.querySelector("summary").textContent + ".", lg: "fr" }, ...[...f.querySelectorAll("li")].flatMap(li => {
      // on lit le texte en français, et les exemples (en italique ou en arabe) avec la voix de leur langue
      const parts = []; li.childNodes.forEach(n => { const ex = n.nodeType === 1 && (n.matches("i") || n.lang === "ar"); const t = n.textContent; if (t.trim()) parts.push({ texte: t, lg: ex ? (n.lang === "ar" || estArabe(t) ? "ar" : lgEx) : "fr", el: li }); });
      return parts; })]));
  }

  // ---------- définitions ----------
  function dicoDefinitions(z) {
    const lg = dicoLangue;
    const liens = {
      fr: [["Wiktionnaire", m => `https://fr.wiktionary.org/wiki/${m}`], ["Larousse", m => `https://www.larousse.fr/dictionnaires/francais/${m}`], ["CNRTL", m => `https://www.cnrtl.fr/definition/${m}`], ["Le Robert (dico en ligne)", m => `https://dictionnaire.lerobert.com/definition/${m}`]],
      en: [["Cambridge (pour apprenants)", m => `https://dictionary.cambridge.org/dictionary/english/${m}`], ["Oxford Learner's", m => `https://www.oxfordlearnersdictionaries.com/definition/english/${m}`], ["Wiktionary", m => `https://en.wiktionary.org/wiki/${m}`], ["WordReference (anglais-français)", m => `https://www.wordreference.com/enfr/${m}`]],
      es: [["Diccionario de la RAE", m => `https://dle.rae.es/${m}`], ["Wikcionario", m => `https://es.wiktionary.org/wiki/${m}`], ["WordReference (espagnol-français)", m => `https://www.wordreference.com/esfr/${m}`]],
      it: [["Treccani", m => `https://www.treccani.it/vocabolario/${m}/`], ["Wikizionario", m => `https://it.wiktionary.org/wiki/${m}`], ["WordReference (italien-français)", m => `https://www.wordreference.com/itfr/${m}`]],
      ar: [["Almaany (arabe-arabe)", m => `https://www.almaany.com/ar/dict/ar-ar/${m}/`], ["Almaany (arabe-français)", m => `https://www.almaany.com/fr/dict/ar-fr/${m}/`], ["Reverso", m => `https://context.reverso.net/traduction/arabe-francais/${m}`]],
    }[lg];
    z.innerHTML = `<div class="feuille sections"><div class="champ"><label for="defq">Un mot en ${NOM_LANGUE[lg]} dont tu cherches le sens</label><input id="defq" autocomplete="off" placeholder="${{ fr: "Ex. : courageux", en: "Ex. : brave", es: "Ex. : valiente", it: "Ex. : coraggioso", ar: "Ex. : شجاع" }[lg]}"${lg === "ar" ? ' dir="auto"' : ""}></div>
      <div class="rangee"><span id="defmot">${btnEcoute("Écouter le mot")}</span><span class="rangee" id="deflinks"></span></div>
      ${iaDispo() ? `<div class="rangee"><button class="btn" id="defia" type="button">Demander à Plume une explication pour mon âge</button></div><div id="defrep" class="bulle plume" hidden></div>` : ""}
      <p class="doux" style="margin:0;font-size:.85rem">Les définitions complètes demandent Internet : elles s'ouvrent sur des dictionnaires gratuits et reconnus.${lg !== "fr" ? " Sans Internet, l'onglet « Traduire » donne déjà le sens en français." : ""}</p></div>`;
    if (lg === "ar") clavierArabe($("#defq"));
    const maj = () => { const m = encodeURIComponent($("#defq").value.trim().toLowerCase()); $("#deflinks").innerHTML = m ? liens.map(([t, u]) => `<a class="btn second petit" href="${u(m)}" target="_blank" rel="noopener">${t}</a>`).join("") : ""; };
    $("#defq").oninput = maj; $("#defq").focus();
    brancherEcoute($("#defmot .btn-ecoute"), () => [{ texte: $("#defq").value, lg }]);
    if ($("#defia")) $("#defia").onclick = async () => { const m = $("#defq").value.trim(); if (!m) return; const r = $("#defrep"); r.hidden = false; r.textContent = "Plume réfléchit…";
      const consigne = lg === "fr" ? `Explique le sens du mot français « ${m} » à un enfant de ${age(enfant.niveau)} ans (classe de ${NIVEAUX[enfant.niveau]}) : une définition simple, un exemple de phrase, et un ou deux synonymes. 80 mots maximum.`
        : `Explique en français, à un enfant de ${age(enfant.niveau)} ans (classe de ${NIVEAUX[enfant.niveau]}), le sens du mot ${NOM_LANGUE[lg]} « ${m} » : sa traduction, une définition simple, un exemple de phrase en ${NOM_LANGUE[lg]} avec sa traduction${lg === "ar" ? " (arabe avec harakat et translittération)" : ""}. 90 mots maximum.`;
      try { const t = await appelClaude({ model: D.reglages.modele, max_tokens: 500, messages: [{ role: "user", content: consigne }] }); r.innerHTML = rendreMarkdown(t) + `<div class="rangee">${btnEcoute("Écouter l'explication")}</div>`; brancherEcoute(r.querySelector(".btn-ecoute"), () => [{ texte: r.textContent.replace("Écouter l'explication", ""), lg: "fr" }]); }
      catch (e) { r.textContent = e.message; } };
  }

  // =====================================================================
  //  ATLAS
  // =====================================================================
  let CARTE = null;
  async function preparerCarte() {
    if (CARTE) return CARTE;
    await chargeScript("vendor/outils/geo.js");
    const topo = await charge("atlas/monde.json", "json");
    const G = window.GEO, fc = G.feature(topo, topo.objects.countries);
    const parN3 = Object.fromEntries(PAYS.filter(p => p.n3).map(p => [String(+p.n3), p]));
    const proj = G.geoNaturalEarth1().fitExtent([[6, 6], [994, 514]], { type: "Sphere" }), chemin = G.geoPath(proj);
    const formes = fc.features.map(f => { const p = parN3[String(+f.id)]; return { p, d: chemin(f), c: chemin.centroid(f), b: chemin.bounds(f) }; }).filter(x => x.d);
    // Les très petits pays (Monaco, Vatican, Malte…) ne font qu'un pixel : on leur ajoute un point cliquable.
    // Les pays absents du fond de carte sont placés grâce à leurs coordonnées.
    for (const f of formes) { const [[x0, y0], [x1, y1]] = f.b; if (f.p && (x1 - x0) * (y1 - y0) < 6) f.point = proj([f.p.lng, f.p.lat]) || f.c; }
    for (const p of PAYS) if (p.lat != null && p.lng != null && !formes.some(f => f.p === p)) { const q = proj([p.lng, p.lat]); if (q) formes.push({ p, d: "", c: q, b: [[q[0] - .5, q[1] - .5], [q[0] + .5, q[1] + .5]], point: q }); }
    return (CARTE = { formes, sphere: chemin({ type: "Sphere" }), grille: chemin(G.geoGraticule10()), proj });
  }
  const COUL_CONT = { "Europe": "#6c8ef5", "Afrique": "#e8a13a", "Asie": "#e0665c", "Amérique du Nord": "#4fb37a", "Amérique du Sud": "#9fcf4f", "Océanie": "#b07ad9", "Antarctique": "#c8d4e0" };
  function svgCarte(c, opts) {
    opts = opts || {};
    return `<svg class="carte-monde" viewBox="${opts.vb || "0 0 1000 520"}" role="img" aria-label="Carte du monde">
      <path class="mer" d="${c.sphere}"/><path class="grille" d="${c.grille}"/>
      ${c.formes.map((f, i) => f.point ? "" : `<path class="pays${opts.classe ? " " + opts.classe(f) : ""}" data-i="${i}" d="${f.d}" style="fill:${opts.couleur ? opts.couleur(f) : f.p ? COUL_CONT[f.p.cont] || "#ccc" : "#ccc"}"><title>${f.p ? esc(f.p.nom) : ""}</title></path>`).join("")}
      ${c.formes.map((f, i) => f.point ? `<circle class="pays point${opts.classe ? " " + opts.classe(f) : ""}" data-i="${i}" cx="${f.point[0]}" cy="${f.point[1]}" r="${R_POINT * (+(opts.vb || "0 0 1000").split(" ")[2] || 1000) / 800}" style="fill:${opts.couleur ? opts.couleur(f) : COUL_CONT[f.p.cont] || "#ccc"}"><title>${esc(f.p.nom)}</title></circle>` : "").join("")}
      ${opts.extra || ""}</svg>`;
  }
  // ---------- zoom sur toutes les cartes : molette, glisser, pincer, boutons ----------
  const R_POINT = 5;   // rayon des points des petits pays, en pixels à l'écran
  function lireVB(svg) { return svg.getAttribute("viewBox").split(/[ ,]+/).map(Number); }
  function ecrireVB(svg, vb) {
    svg.setAttribute("viewBox", vb.map(v => Math.round(v * 100) / 100).join(" "));
    const larg = svg.getBoundingClientRect().width || 800, r = R_POINT * vb[2] / larg;   // les points gardent la même taille à l'écran
    svg.querySelectorAll("circle.point").forEach(c => c.setAttribute("r", Math.max(.12, r)));
  }
  function activerZoom(svg) {
    if (svg.dataset.zoom) return; svg.dataset.zoom = "1";
    const cadre = svg.parentElement; cadre.classList.add("zoomable");
    const depart = lireVB(svg), MIN_L = 12, MAX_L = 1000;
    ecrireVB(svg, depart);
    cadre.insertAdjacentHTML("beforeend", `<div class="zoom-btns" role="group" aria-label="Zoom de la carte">
      <button type="button" data-z="in" aria-label="Zoomer" title="Zoomer">+</button><button type="button" data-z="out" aria-label="Dézoomer" title="Dézoomer">−</button>
      <button type="button" data-z="0" aria-label="Revenir à la carte entière" title="Revenir au départ">⟲</button></div>
      <p class="zoom-aide">Molette ou boutons + / − pour zoomer, glisse pour te déplacer</p>`);
    const pt = (x, y) => { const r = svg.getBoundingClientRect(), [vx, vy, vw, vh] = lireVB(svg); return [vx + (x - r.left) / r.width * vw, vy + (y - r.top) / r.height * vh]; };
    const zoomer = (f, cx, cy) => {
      let [vx, vy, vw, vh] = lireVB(svg); const nw = Math.min(MAX_L, Math.max(MIN_L, vw * f)), k = nw / vw;
      if (cx == null) { cx = vx + vw / 2; cy = vy + vh / 2; }
      vx = cx - (cx - vx) * k; vy = cy - (cy - vy) * k; vw = nw; vh *= k;
      ecrireVB(svg, borner([vx, vy, vw, vh]));
    };
    const borner = ([vx, vy, vw, vh]) => [Math.min(1000 - vw * .3, Math.max(-vw * .7, vx)), Math.min(520 - vh * .3, Math.max(-vh * .7, vy)), vw, vh];
    cadre.querySelectorAll("[data-z]").forEach(b => b.onclick = e => { e.stopPropagation(); const z = b.dataset.z; if (z === "0") ecrireVB(svg, depart); else zoomer(z === "in" ? .6 : 1 / .6); });
    svg.addEventListener("wheel", e => { e.preventDefault(); const [x, y] = pt(e.clientX, e.clientY); zoomer(e.deltaY < 0 ? .8 : 1.25, x, y); }, { passive: false });
    // glisser (souris ou doigt) et pincer (deux doigts) ; un vrai glissement n'est pas un clic sur un pays
    const doigts = new Map(); let glisse = false, debut = null, pinch = null;
    svg.addEventListener("pointerdown", e => { doigts.set(e.pointerId, [e.clientX, e.clientY]); glisse = false; debut = { x: e.clientX, y: e.clientY, vb: lireVB(svg) };
      if (doigts.size === 2) { const [a, b] = [...doigts.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), vb: lireVB(svg), c: pt((a[0] + b[0]) / 2, (a[1] + b[1]) / 2) }; } });
    svg.addEventListener("pointermove", e => {
      if (!doigts.has(e.pointerId)) return; doigts.set(e.pointerId, [e.clientX, e.clientY]);
      if (doigts.size === 2 && pinch) { const [a, b] = [...doigts.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]); glisse = true;
        const [vx, vy, vw, vh] = pinch.vb, nw = Math.min(MAX_L, Math.max(MIN_L, vw * pinch.d / Math.max(10, d))), k = nw / vw, [cx, cy] = pinch.c;
        ecrireVB(svg, borner([cx - (cx - vx) * k, cy - (cy - vy) * k, nw, vh * k])); return; }
      if (!debut) return; const dx = e.clientX - debut.x, dy = e.clientY - debut.y;
      if (!glisse && Math.hypot(dx, dy) < 6) return;
      if (!glisse) { glisse = true; try { svg.setPointerCapture(e.pointerId); } catch { } svg.classList.add("glisse"); }
      const r = svg.getBoundingClientRect(), [vx, vy, vw, vh] = debut.vb;
      ecrireVB(svg, borner([vx - dx / r.width * vw, vy - dy / r.height * vh, vw, vh]));
    });
    const fin = e => { doigts.delete(e.pointerId); if (doigts.size < 2) pinch = null; if (!doigts.size) { debut = null; svg.classList.remove("glisse"); } };
    svg.addEventListener("pointerup", fin); svg.addEventListener("pointercancel", fin);
    svg.addEventListener("click", e => { if (glisse) { e.stopPropagation(); e.preventDefault(); glisse = false; } }, true);
  }
  new MutationObserver(() => app.querySelectorAll("svg.carte-monde:not([data-zoom])").forEach(activerZoom)).observe(app, { childList: true, subtree: true });
  const VUES = { "Monde": "0 0 1000 520", "Europe": "430 60 170 140", "Afrique": "420 170 230 250", "Asie": "560 40 400 300", "Amérique du Nord": "60 40 340 250", "Amérique du Sud": "220 250 200 230", "Océanie": "770 240 230 190" };
  let atlasVue = "Monde";
  async function ecranAtlas(c3) {
    rendre(`<section class="page">${entete("Atlas du monde", "Touche un pays pour découvrir sa capitale, sa langue, sa monnaie et son drapeau.")}<div class="feuille vide-etat">Je déplie la carte…</div></section>`);
    $("#retour").onclick = ecranJeux;
    let c; try { c = await preparerCarte(); } catch { toast("La carte n'a pas pu être chargée."); return ecranJeux(); }
    rendre(`<section class="page">
      <div class="entete"><div><button class="retour-lien" id="retour" type="button">${ICO.retour} Jeux et atlas</button><h1>Atlas du monde</h1><p class="doux">Touche un pays pour découvrir sa fiche.</p></div>
        <div class="champ" style="min-width:220px"><label for="aq" class="label">Chercher un pays</label><input id="aq" list="liste-pays" autocomplete="off" placeholder="Ex. : Japon"><datalist id="liste-pays">${PAYS.map(p => `<option value="${esc(p.nom)}">`).join("")}</datalist></div></div>
      <div class="onglets">${Object.keys(VUES).map(v => `<button class="onglet" data-v="${v}" aria-pressed="${v === atlasVue}" type="button">${v}</button>`).join("")}</div>
      <div class="atlas"><div class="carte-cadre">${svgCarte(c, { vb: VUES[atlasVue] })}</div><aside id="fiche" class="feuille fiche-pays"><p class="doux">Choisis un pays sur la carte.</p>
        <div class="legende">${Object.entries(COUL_CONT).filter(([k]) => k !== "Antarctique").map(([k, v]) => `<span><i style="background:${v}"></i>${k}</span>`).join("")}</div></aside></div>
    </section>`);
    $("#retour").onclick = ecranJeux;
    app.querySelectorAll("[data-v]").forEach(b => b.onclick = () => { atlasVue = b.dataset.v; ecranAtlas(); });
    const montrer = p => {
      app.querySelectorAll(".pays.choisi").forEach(x => x.classList.remove("choisi"));
      const i = c.formes.findIndex(f => f.p === p); if (i >= 0) app.querySelector(`.pays[data-i="${i}"]`)?.classList.add("choisi");
      $("#fiche").innerHTML = `<img class="drapeau" src="atlas/drapeaux/${p.c2}.svg" alt="Drapeau : ${esc(p.nom)}"><h2>${esc(p.nom)}</h2>${p.off && p.off !== p.nom ? `<p class="doux" style="margin:0">${esc(p.off)}</p>` : ""}
        <dl class="fiche-dl"><dt>Capitale</dt><dd><b>${esc(p.cap || "—")}</b></dd><dt>Continent</dt><dd>${esc(p.cont)}${p.sous ? " · " + esc(p.sous) : ""}</dd>
        <dt>Superficie</dt><dd>${p.sup ? Math.round(p.sup).toLocaleString("fr-FR") + " km²" : "—"}${p.sup ? ` <small class="doux">(${p.sup > 551695 ? "≈ " + (p.sup / 551695).toLocaleString("fr-FR", { maximumFractionDigits: 1 }) + " fois la France" : Math.round(100 * p.sup / 551695) + " % de la France"})</small>` : ""}</dd>
        <dt>Langue${p.langues.length > 1 ? "s" : ""}</dt><dd>${esc(p.langues.join(", ") || "—")}</dd><dt>Monnaie</dt><dd>${esc(p.monnaies.join(", ") || "—")}</dd>
        <dt>Pays voisins</dt><dd>${p.voisins.length ? esc(p.voisins.join(", ")) : "aucun (pays entouré par la mer)"}</dd></dl>${p.note ? `<p class="note-info">${esc(p.note)}</p>` : ""}`;
      if (D.reglages.lectureAuto && enfant.niveau <= 4) parler(`${p.nom}. Sa capitale est ${p.cap}.`);
    };
    app.querySelectorAll(".pays").forEach(el => el.onclick = () => { const f = c.formes[+el.dataset.i]; if (f.p) montrer(f.p); });
    $("#aq").onchange = () => { const p = PAYS.find(x => plat(x.nom) === plat($("#aq").value)); if (p) { const f = c.formes.find(f => f.p === p); if (f) { const [[x0, y0], [x1, y1]] = f.b, w = Math.max(60, (x1 - x0) * 2.2), h = Math.max(40, (y1 - y0) * 2.2); ecrireVB(app.querySelector(".carte-monde"), `${(x0 + x1) / 2 - w / 2} ${(y0 + y1) / 2 - h / 2} ${w} ${h}`.split(" ").map(Number)); } montrer(p); } };
    if (c3) { const p = PAYS.find(x => x.c3 === c3); if (p) montrer(p); }
  }

  // =====================================================================
  //  JEUX : géographie et jeux de lettres
  // =====================================================================
  function ecranJeux() {
    const g = groupe();
    const geo = [["atlas", "🗺️", "Atlas du monde", "La carte et les fiches de 250 pays"], ["capitales", "🏛️", "Les capitales", "Retrouve la capitale de chaque pays"], ["drapeaux", "🚩", "Les drapeaux", "À quel pays est ce drapeau ?"],
      ["ouest", "📍", "Où est ce pays ?", "Le pays est en couleur sur la carte"], ["trouve", "🎯", "Trouve sur la carte", "Clique sur le bon pays"]];
    const lettres = [["memo", "🃏", "Mémo des mots", "Retrouve les paires image et mot"], ["pendu", "🎈", "Le mot caché", "Devine le mot lettre par lettre"], ["melanges", "🔤", "Mots mélangés", "Remets les lettres dans l'ordre"]]
      .concat(g >= 1 ? [["meles", "🔎", "Mots mêlés", "Trouve les mots cachés dans la grille"]] : []);
    rendre(`<section class="page">${entete("Jeux et atlas", "Des jeux pour apprendre la géographie et les mots, en plusieurs langues.")}
      <div class="sections"><h2 class="cursive titre-groupe">Le monde</h2><div class="modes">${(g === 0 ? geo.filter(x => ["atlas", "drapeaux"].includes(x[0])) : geo).map(([k, e, t, s]) => `<button class="mode" data-j="${k}" type="button"><span class="emo">${e}</span><b>${t}</b><small>${s}</small></button>`).join("")}</div>
        ${g >= 1 ? `<div class="rangee"><span class="doux">Continent :</span><select class="sel" id="jcont">${["Tous", ...Object.keys(COUL_CONT).filter(k => k !== "Antarctique")].map(c => `<option ${c === jeuCont ? "selected" : ""}>${c}</option>`).join("")}</select></div>` : ""}</div>
      <div class="sections"><h2 class="cursive titre-groupe">Jeux de lettres</h2>
        <div class="puces" role="group" aria-label="Langue des jeux">${["fr", "en", "es", "it", "ar"].map(l => `<button type="button" class="puce" data-lgj="${l}" aria-pressed="${l === jeuLg}"${l === "ar" ? ' lang="ar"' : ""}>${LANG_NOMS[l]}</button>`).join("")}</div>
        <div class="modes">${lettres.filter(x => !(jeuLg === "ar" && x[0] === "meles")).map(([k, e, t, s]) => `<button class="mode" data-j="${k}" type="button"><span class="emo">${e}</span><b>${t}</b><small>${s}</small></button>`).join("")}</div></div>
    </section>`);
    $("#retour").onclick = ecranAccueil;
    if ($("#jcont")) $("#jcont").onchange = e => jeuCont = e.target.value;
    app.querySelectorAll("[data-lgj]").forEach(b => b.onclick = () => { jeuLg = b.dataset.lgj; ecranJeux(); });
    app.querySelectorAll("[data-j]").forEach(b => b.onclick = () => ({ atlas: () => ecranAtlas(), capitales: () => jeuGeo("capitales"), drapeaux: () => jeuGeo("drapeaux"), ouest: () => jeuGeo("ouest"), trouve: jeuTrouve, memo: jeuMemo, pendu: jeuPendu, melanges: jeuMelanges, meles: jeuMeles })[b.dataset.j]());
  }
  let jeuCont = "Tous", jeuLg = "fr";
  function paysJeu() {
    const g = groupe();
    let l = PAYS.filter(p => p.onu && p.cap && !["ISR", "PSE"].includes(p.c3) && (jeuCont === "Tous" || p.cont === jeuCont));
    if (g === 0) l = l.filter(p => p.sup > 300000 || ["FRA", "ESP", "ITA", "GBR", "DEU", "MAR", "DZA", "TUN", "PRT", "BEL", "CHE", "JPN", "CHN", "USA", "BRA", "SEN"].includes(p.c3));
    else if (g === 1 && jeuCont === "Tous") l = l.filter(p => p.sup > 100000 || ["FRA", "ESP", "ITA", "GBR", "DEU", "BEL", "CHE", "PRT", "NLD", "GRC", "IRL", "AUT", "DNK", "TUN", "SEN", "CIV", "LBN", "ISL", "JAM", "CUB", "KOR"].includes(p.c3));
    return l;
  }
  const drapeauImg = (p, px) => `<img class="drapeau-q" src="atlas/drapeaux/${p.c2}.svg" alt="" style="width:${px || 120}px">`;
  async function jeuGeo(type) {
    const g = groupe(), nb = [5, 8, 10][g], nbOpt = g === 0 ? 3 : 4, l = paysJeu();
    if (l.length < 4) { toast("Pas assez de pays pour ce continent."); return; }
    let c = null; if (type === "ouest") { try { c = await preparerCarte(); } catch { return toast("La carte n'a pas pu être chargée."); } }
    const choisis = shuffle(l).slice(0, nb);
    const qs = choisis.map(p => {
      const autres = shuffle(l.filter(x => x !== p && x.cont === p.cont)).concat(shuffle(l.filter(x => x.cont !== p.cont))).slice(0, nbOpt - 1);
      if (type === "capitales") { const inv = g >= 1 && Math.random() < .3;
        if (inv) return { q: `<p class="consigne">De quel pays <b>${esc(p.cap)}</b> est-elle la capitale ?</p>`, kind: "qcm", options: shuffle([p.nom, ...autres.map(x => x.nom)]), answer: p.nom, expl: `${esc(p.cap)} est la capitale de ${esc(p.nom)} (${esc(p.cont)}).${p.note ? " " + esc(p.note) : ""}`, check: r => r === p.nom };
        return { q: `<p class="consigne">Quelle est la capitale de ce pays : <b>${esc(p.nom)}</b> ?</p><div class="dessin" aria-hidden="true">${drapeauImg(p, 70)}</div>`, kind: "qcm", options: shuffle([p.cap, ...autres.map(x => x.cap)]), answer: p.cap, expl: `${esc(p.nom)} : la capitale est ${esc(p.cap)}.${p.note ? " " + esc(p.note) : ""}`, check: r => r === p.cap }; }
      if (type === "drapeaux") { const inv = g >= 1 && Math.random() < .35, par = Object.fromEntries([p, ...autres].map(x => [x.nom, x]));
        if (inv) return { q: `<p class="consigne">Quel est le drapeau de ce pays : <b>${esc(p.nom)}</b> ?</p>`, kind: "qcm", options: shuffle([p.nom, ...autres.map(x => x.nom)]), answer: p.nom, rendu: o => drapeauImg(par[o], 110), images: true, expl: `Voici le drapeau : ${esc(p.nom)}.`, check: r => r === p.nom };
        return { q: `<p class="consigne">À quel pays est ce drapeau ?</p><div class="dessin">${drapeauImg(p, 160)}</div>`, kind: "qcm", options: shuffle([p.nom, ...autres.map(x => x.nom)]), answer: p.nom, expl: `C'est le drapeau du pays : ${esc(p.nom)} (capitale : ${esc(p.cap)}).`, check: r => r === p.nom }; }
      const f = c.formes.find(x => x.p === p), [[x0, y0], [x1, y1]] = f ? f.b : [[0, 0], [1000, 520]];
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, w = Math.max(220, (x1 - x0) * 4), h = w * .55;
      return { q: `<p class="consigne">Quel est ce pays, en rouge sur la carte ?</p><div class="carte-q">${svgCarte(c, { vb: `${cx - w / 2} ${cy - h / 2} ${w} ${h}`, couleur: x => x.p === p ? "#e03131" : "var(--carte-terre)", extra: `<circle cx="${cx}" cy="${cy}" r="${Math.max(6, w / 40)}" fill="none" stroke="#e03131" stroke-width="${w / 300}"/>` })}</div>`,
        kind: "qcm", options: shuffle([p.nom, ...autres.map(x => x.nom)]), answer: p.nom, expl: `C'est ${esc(p.nom)}, en ${esc(p.cont)}. Capitale : ${esc(p.cap)}.`, check: r => r === p.nom };
    });
    lancerSeance(null, qs, { capitales: "Les capitales", drapeaux: "Les drapeaux", ouest: "Où est ce pays ?" }[type], null, { matiere: "geographie", retour: ecranJeux });
  }
  async function jeuTrouve() {
    let c; try { c = await preparerCarte(); } catch { return toast("La carte n'a pas pu être chargée."); }
    const l = paysJeu().filter(p => p.sup > (groupe() === 2 ? 20000 : 150000) && c.formes.some(f => f.p === p)), tours = shuffle(l).slice(0, 10);
    let k = 0, ok = 0, essais = 0;
    const vb = jeuCont === "Tous" ? VUES.Monde : VUES[jeuCont];
    const tour = () => {
      if (k >= tours.length) { noter("jeu", { k: "trouve", ok }); sauver(); gagner(10 + ok * 2, "jeu de la carte"); rendre(`<section class="page etroite"><div class="feuille bilan"><div class="note">${ok} / ${tours.length}</div><p style="font-size:1.2rem;margin:0">${ok >= 8 ? "Tu es un vrai géographe !" : "Bien joué ! Rejoue pour progresser."}</p><div class="rangee centre"><button class="btn" id="re" type="button">Rejouer</button><button class="btn second" id="fin" type="button">Retour</button></div></div></section>`); $("#re").onclick = jeuTrouve; $("#fin").onclick = ecranJeux; return; }
      const p = tours[k]; essais = 0;
      rendre(`<section class="page"><div class="entete"><div><button class="retour-lien" id="retour" type="button">${ICO.retour} Jeux et atlas</button><h1>Trouve sur la carte</h1></div><span class="pill">${k + 1} / ${tours.length} · ${ok} trouvé${ok > 1 ? "s" : ""}</span></div>
        <div class="feuille trouve-consigne"><span>Clique sur : </span><b>${esc(p.nom)}</b> ${drapeauImg(p, 46)}</div>
        <div class="carte-cadre">${svgCarte(c, { vb })}</div><p id="trouve-msg" class="doux" aria-live="polite"></p></section>`);
      $("#retour").onclick = ecranJeux;
      if (D.reglages.lectureAuto && enfant.niveau <= 4) parler(`Trouve : ${p.nom}`);
      app.querySelectorAll(".pays").forEach(el => el.onclick = () => {
        const f = c.formes[+el.dataset.i]; if (!f.p) return;
        if (f.p === p) { el.classList.add("bon"); if (essais === 0) ok++; $("#trouve-msg").textContent = `Bravo, c'est bien ${p.nom} !`; setTimeout(() => { k++; tour(); }, 1000); }
        else { essais++; el.classList.add("rate"); $("#trouve-msg").textContent = `Non, ça c'est ${f.p.nom}.${essais >= 2 ? " Regarde : le pays clignote !" : ""}`; if (essais >= 2) app.querySelector(`.pays[data-i="${c.formes.findIndex(x => x.p === p)}"]`)?.classList.add("indice"); }
      });
    };
    tour();
  }

  // ---------- mots pour les jeux de lettres ----------
  function motsJeu(lg, opts) {
    opts = opts || {};
    const g = groupe(), res = [];
    for (const th of LG.themesPour(lg === "fr" ? "en" : lg, g)) for (const m of th.mots) {
      let w = lg === "fr" ? m[0] : LG.mot(m, lg); if (!w) continue;
      w = w.replace(/^(le |la |les |l'|el |los |las |il |lo |gli |i |the |a |an |to )/i, "").trim();
      if (/[\s…?!.,]/.test(w) || /^t:|^#/.test(m[1])) continue;
      const lettres = [...w];
      if (lettres.length < (opts.min || 3) || lettres.length > (opts.max || (g === 0 ? 5 : g === 1 ? 8 : 11))) continue;
      res.push({ mot: w, img: m[1], fr: m[0], tr: lg === "ar" ? m[6] : "" });
    }
    return res;
  }
  const normLettre = (c, lg) => lg === "ar" ? c.replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي") : sansAccents(c).toLowerCase();
  const CLAVIER = { fr: "abcdefghijklmnopqrstuvwxyz", en: "abcdefghijklmnopqrstuvwxyz", it: "abcdefghijklmnopqrstuvwxyz", es: "abcdefghijklmnñopqrstuvwxyz", ar: "ابتثجحخدذرزسشصضطظعغفقكلمنهويةء" };
  const imgJeu = (m, px) => m.img.startsWith("#") ? `<svg viewBox="0 0 100 100" width="${px}" height="${px}" aria-hidden="true"><circle cx="50" cy="50" r="42" fill="${m.img}" stroke="rgba(0,0,0,.3)" stroke-width="3"/></svg>` : `<span class="emo" style="font-size:${px}px">${m.img}</span>`;
  function finJeu(nom, gagne, refaire) {
    noter("jeu", { k: nom, ok: gagne ? 1 : 0 }); sauver(); if (gagne) gagner(10, "jeu réussi");
    const b = $("#jeu-fin"); if (!b) return;
    b.innerHTML = `<div class="retour ${gagne ? "juste" : "faux"}"><span class="tampon">${gagne ? "Bravo !" : "Presque…"}</span><span class="correction">${gagne ? "Tu as trouvé !" : "Ce sera pour la prochaine fois."}</span></div>
      <div class="rangee" style="margin-top:12px"><button class="btn" id="rejouer" type="button">Encore un mot</button><button class="btn second" id="quitterj" type="button">Retour aux jeux</button></div>`;
    $("#rejouer").onclick = refaire; $("#quitterj").onclick = ecranJeux; $("#rejouer").focus();
  }
  function enteteJeu(titre) { return `<div class="entete"><div><button class="retour-lien" id="retour" type="button">${ICO.retour} Jeux</button><h1>${titre}</h1></div><span class="pill"${jeuLg === "ar" ? ' lang="ar"' : ""}>${LANG_NOMS[jeuLg]}</span></div>`; }

  function jeuPendu() {
    const mots = motsJeu(jeuLg, { min: 3 }); if (!mots.length) return toast("Pas de mots pour ce jeu.");
    const m = mots[Math.floor(Math.random() * mots.length)], lettres = [...m.mot], vies = groupe() === 0 ? 9 : 7;
    const trouvees = new Set(), ratees = new Set(), rtl = jeuLg === "ar";
    const fini = () => lettres.every(c => !/[\p{L}]/u.test(c) || trouvees.has(normLettre(c, jeuLg)));
    function dessiner() {
      const perdu = ratees.size >= vies, gagne = fini();
      rendre(`<section class="page etroite">${enteteJeu("Le mot caché")}
        <div class="feuille sections jeu">
          <div class="pendu-haut"><div class="pendu-img">${imgJeu(m, 72)}</div><div class="ballons" aria-label="${vies - ratees.size} essais restants">${Array.from({ length: vies }, (_, i) => `<span class="ballon ${i < ratees.size ? "eclate" : ""}">${i < ratees.size ? "💥" : "🎈"}</span>`).join("")}</div></div>
          ${jeuLg !== "fr" ? `<p class="doux" style="margin:0">Indice : en français, « ${esc(m.fr)} »${m.tr ? ` · se prononce ${esc(m.tr)}` : ""}</p>` : ""}
          <div class="pendu-mot${rtl ? " ar" : ""}"${rtl ? ' dir="rtl" lang="ar"' : ""}>${lettres.map(c => /[\p{L}]/u.test(c) ? `<span class="case-l">${trouvees.has(normLettre(c, jeuLg)) || perdu ? c : ""}</span>` : `<span class="case-l sep">${c}</span>`).join("")}</div>
          <div class="clavier${rtl ? " ar" : ""}"${rtl ? ' dir="rtl" lang="ar"' : ""}>${[...CLAVIER[jeuLg]].map(c => `<button type="button" class="touche ${trouvees.has(c) ? "bonne" : ratees.has(c) ? "mauvaise" : ""}" data-c="${c}" ${trouvees.has(c) || ratees.has(c) || perdu || gagne ? "disabled" : ""}>${c.toUpperCase()}</button>`).join("")}</div>
          <div id="jeu-fin"></div></div></section>`);
      $("#retour").onclick = ecranJeux;
      app.querySelectorAll(".touche").forEach(b => b.onclick = () => jouer(b.dataset.c));
      app.onkeydown = e => { const c = normLettre(e.key || "", jeuLg); if (c.length === 1 && CLAVIER[jeuLg].includes(c)) jouer(c); };
      if (perdu || gagne) { parlerTexte(m.mot, jeuLg); finJeu("pendu", gagne, jeuPendu); }
    }
    function jouer(c) { if (trouvees.has(c) || ratees.has(c) || ratees.size >= vies || fini()) return; (lettres.some(x => normLettre(x, jeuLg) === c) ? trouvees : ratees).add(c); dessiner(); }
    dessiner();
  }
  function jeuMelanges() {
    const mots = motsJeu(jeuLg, { min: 3 }); if (!mots.length) return toast("Pas de mots pour ce jeu.");
    const m = mots[Math.floor(Math.random() * mots.length)], lettres = [...m.mot];
    let ordre; do { ordre = shuffle(lettres.map((c, i) => i)); } while (lettres.length > 1 && ordre.every((x, i) => lettres[x] === lettres[i]));
    const choisies = [], rtl = jeuLg === "ar";
    function dessiner() {
      const rep = choisies.map(i => lettres[i]).join(""), complet = choisies.length === lettres.length, juste = complet && normLettre(rep, jeuLg) === normLettre(m.mot, jeuLg);
      rendre(`<section class="page etroite">${enteteJeu("Mots mélangés")}
        <div class="feuille sections jeu"><div class="pendu-img centre">${imgJeu(m, 80)}</div>
          ${jeuLg !== "fr" ? `<p class="doux" style="margin:0;text-align:center">En français : « ${esc(m.fr)} »${m.tr ? ` · ${esc(m.tr)}` : ""}</p>` : ""}
          <div class="pendu-mot${rtl ? " ar" : ""}"${rtl ? ' dir="rtl" lang="ar"' : ""}>${lettres.map((_, i) => `<span class="case-l ${complet ? (juste ? "ok" : "ko") : ""}">${choisies[i] != null ? lettres[choisies[i]] : ""}</span>`).join("")}</div>
          <div class="tuiles-lettres${rtl ? " ar" : ""}"${rtl ? ' dir="rtl" lang="ar"' : ""}>${ordre.map(i => `<button type="button" class="tuile-l" data-i="${i}" ${choisies.includes(i) || juste ? "disabled" : ""}>${lettres[i].toUpperCase()}</button>`).join("")}</div>
          <div class="rangee centre"><button class="btn-discret" id="effacer" type="button" ${!choisies.length || juste ? "disabled" : ""}>Effacer</button><button class="btn-discret" id="indice" type="button" ${juste ? "disabled" : ""}>Un indice</button><button class="btn-discret" id="ecoute" type="button">${ICO.son} Écouter</button></div>
          <div id="jeu-fin"></div></div></section>`);
      $("#retour").onclick = ecranJeux;
      app.querySelectorAll(".tuile-l").forEach(b => b.onclick = () => { choisies.push(+b.dataset.i); dessiner(); });
      $("#effacer").onclick = () => { choisies.length = 0; dessiner(); };
      $("#indice").onclick = () => { const pos = choisies.findIndex((x, k) => normLettre(lettres[x], jeuLg) !== normLettre(lettres[k], jeuLg)); const k = pos === -1 ? choisies.length : pos; choisies.length = k; const i = ordre.find(j => !choisies.includes(j) && normLettre(lettres[j], jeuLg) === normLettre(lettres[k], jeuLg)); if (i != null) choisies.push(i); dessiner(); };
      $("#ecoute").onclick = () => parlerTexte(m.mot, jeuLg);
      if (complet && !juste) setTimeout(() => { if ($("#jeu-fin") && !$("#jeu-fin").innerHTML) { choisies.length = 0; dessiner(); toast("Pas tout à fait ! Réessaie."); } }, 900);
      if (juste) { parlerTexte(m.mot, jeuLg); finJeu("melanges", true, jeuMelanges); }
    }
    dessiner();
  }
  function jeuMeles() {
    const g = groupe(), taille = g === 1 ? 8 : 10, nbMots = g === 1 ? 5 : 7, diag = g >= 2;
    const cands = shuffle(motsJeu(jeuLg, { min: 3, max: taille }).filter(m => /^[\p{L}]+$/u.test(m.mot)));
    const grille = Array.from({ length: taille }, () => Array(taille).fill("")), places = [];
    const dirs = [[0, 1], [1, 0]].concat(diag ? [[1, 1], [-1, 1]] : []);
    for (const m of cands) {
      if (places.length >= nbMots) break;
      const w = [...sansAccents(m.mot).toUpperCase()]; let ok = false;
      for (let essai = 0; essai < 80 && !ok; essai++) {
        const [dy, dx] = dirs[Math.floor(Math.random() * dirs.length)], y0 = Math.floor(Math.random() * taille), x0 = Math.floor(Math.random() * taille);
        const cases = w.map((c, k) => [y0 + dy * k, x0 + dx * k]);
        if (cases.every(([y, x], k) => y >= 0 && y < taille && x >= 0 && x < taille && (!grille[y][x] || grille[y][x] === w[k]))) {
          cases.forEach(([y, x], k) => grille[y][x] = w[k]); places.push({ m, cases, trouve: false }); ok = true; }
      }
    }
    const alpha = jeuLg === "es" ? "ABCDEFGHIJLMNÑOPRSTUV" : "ABCDEFGHIJLMNOPRSTUVE";
    for (const l of grille) for (let x = 0; x < taille; x++) if (!l[x]) l[x] = alpha[Math.floor(Math.random() * alpha.length)];
    let debut = null;
    function dessiner() {
      const marque = new Set(places.filter(p => p.trouve).flatMap(p => p.cases.map(c => c.join(","))));
      rendre(`<section class="page etroite">${enteteJeu("Mots mêlés")}
        <div class="feuille sections jeu"><p class="doux" style="margin:0">Touche la première lettre d'un mot, puis la dernière.</p>
          <div class="meles" style="--n:${taille}">${grille.map((l, y) => l.map((c, x) => `<button type="button" class="case-m ${marque.has(y + "," + x) ? "trouvee" : ""} ${debut && debut[0] === y && debut[1] === x ? "debut" : ""}" data-y="${y}" data-x="${x}">${c}</button>`).join("")).join("")}</div>
          <div class="liste-meles">${places.map(p => `<span class="${p.trouve ? "barre" : ""}">${imgJeu(p.m, 26)} ${esc(p.m.mot)}${jeuLg !== "fr" ? ` <small class="doux">(${esc(p.m.fr)})</small>` : ""}</span>`).join("")}</div>
          <div id="jeu-fin"></div></div></section>`);
      $("#retour").onclick = ecranJeux;
      app.querySelectorAll(".case-m").forEach(b => b.onclick = () => {
        const y = +b.dataset.y, x = +b.dataset.x;
        if (!debut) { debut = [y, x]; return dessiner(); }
        const p = places.find(p => !p.trouve && ((p.cases[0].join() === debut.join() && p.cases.at(-1).join() === [y, x].join()) || (p.cases.at(-1).join() === debut.join() && p.cases[0].join() === [y, x].join())));
        debut = null; if (p) { p.trouve = true; parlerTexte(p.m.mot, jeuLg); } dessiner();
        if (places.every(p => p.trouve)) finJeu("meles", true, jeuMeles);
      });
    }
    dessiner();
  }
  function jeuMemo() {
    const g = groupe(), nbPaires = [4, 6, 8][g];
    const mots = shuffle(motsJeu(jeuLg, { min: 1, max: 20 }).filter(m => !m.img.startsWith("#"))).slice(0, nbPaires);
    if (mots.length < 3) return toast("Pas assez de mots pour ce jeu.");
    const cartes = shuffle(mots.flatMap((m, i) => [{ i, face: imgJeu(m, 46) }, { i, face: g === 0 ? imgJeu(m, 46) : `<span class="memo-mot${jeuLg === "ar" ? " ar" : ""}"${jeuLg === "ar" ? ' lang="ar"' : ""}>${esc(m.mot)}</span>` }]));
    const vues = new Set(); let ouvertes = [], coups = 0, bloque = false;
    function dessiner() {
      rendre(`<section class="page etroite">${enteteJeu("Mémo des mots")}
        <div class="feuille sections jeu"><p class="doux" style="margin:0">${g === 0 ? "Retrouve les images pareilles." : "Associe chaque image à son mot."} Coups : ${coups}</p>
          <div class="memo" style="--c:${cartes.length > 12 ? 5 : 4}">${cartes.map((c, k) => `<button type="button" class="carte-memo ${vues.has(k) || ouvertes.includes(k) ? "ouverte" : ""} ${vues.has(k) ? "paire" : ""}" data-k="${k}" ${vues.has(k) ? "disabled" : ""}>${vues.has(k) || ouvertes.includes(k) ? c.face : "?"}</button>`).join("")}</div>
          <div id="jeu-fin"></div></div></section>`);
      $("#retour").onclick = ecranJeux;
      app.querySelectorAll(".carte-memo").forEach(b => b.onclick = () => {
        const k = +b.dataset.k; if (bloque || ouvertes.includes(k) || vues.has(k)) return;
        ouvertes.push(k); parlerTexte(mots[cartes[k].i].mot, jeuLg);
        if (ouvertes.length === 2) { coups++; const [a, b2] = ouvertes;
          if (cartes[a].i === cartes[b2].i) { vues.add(a); vues.add(b2); ouvertes = []; dessiner(); if (vues.size === cartes.length) finJeu("memo", true, jeuMemo); return; }
          bloque = true; dessiner(); setTimeout(() => { ouvertes = []; bloque = false; dessiner(); }, 1100); return; }
        dessiner();
      });
    }
    dessiner();
  }


  // =====================================================================
  //  COMPTINES, FABLES ET POÉSIES (comptines.js)
  // =====================================================================
  const TYPES_TEXTE = { comptine: "Comptines et chansons", fable: "Fables", poesie: "Poésies" };
  let comptLg = "fr", comptTous = false;
  const matiereTexte = lg => ({ fr: "francais", en: "anglais", es: "espagnol" })[lg] || "langues";
  function ecranComptines() {
    const n = enfant.niveau, C = window.COMPTINES || [];
    const miens = cartable().filter(i => i.comptine || (maternelle() && i.type === "lecon"));
    const liste = C.filter(c => c.lg === comptLg && (comptTous || (n >= c.min && n <= c.max)));
    const types = Object.keys(TYPES_TEXTE).filter(t => liste.some(c => c.type === t));
    const appris = id => cartable().find(i => i.comptine === id);
    rendre(`<section class="page">
      ${entete(maternelle() ? "Mes comptines" : "Poésies et comptines", maternelle() ? "Écoute, chante et apprends par cœur." : "Choisis un texte : je te le lis, puis je t'aide à l'apprendre par cœur.")}
      <div class="onglets" role="group" aria-label="Langue">${["fr", "en", "es", "it"].filter(l => C.some(c => c.lg === l)).map(l => `<button class="onglet" data-lg="${l}" aria-pressed="${l === comptLg}" type="button">${LANG_NOMS[l]}</button>`).join("")}</div>
      ${miens.length ? `<div class="sections"><h2 class="cursive titre-groupe">Ce que j'apprends</h2><div class="liste-items">${miens.map(carteItem).join("")}</div></div>` : ""}
      ${types.length ? types.map(t => `<div class="sections"><h2 class="cursive titre-groupe">${TYPES_TEXTE[t]}</h2><div class="textes-grille">${liste.filter(c => c.type === t).map(c => `<button class="texte-carte" data-c="${c.id}" type="button"><span class="emo">${c.emoji || "📜"}</span><span><b>${esc(c.titre)}</b><small>${esc(c.auteur)}</small></span>${appris(c.id) ? '<span class="etat ok">Dans mon cartable</span>' : ""}</button>`).join("")}</div></div>`).join("")
        : `<div class="feuille vide-etat">Pas encore de texte pour ta classe dans cette langue. <button class="btn second petit" id="voir-tous" type="button">Voir tous les textes</button></div>`}
      <div class="rangee"><label class="interrupteur" style="align-items:center"><input type="checkbox" id="tous" ${comptTous ? "checked" : ""}><span>Montrer aussi les textes des autres âges</span></label>
        ${maternelle() ? `<button class="btn second" id="ajouter" type="button">➕ Un adulte ajoute une autre comptine</button>` : ""}
        <button class="btn-discret" id="import-mp3" type="button">🎵 Pour les adultes : ajouter des chansons en MP3</button></div>
      <p class="doux" style="margin:0;font-size:.85rem">Comptines traditionnelles et poèmes du domaine public. Textes anciens relevés dans des recueils numérisés (Projet Gutenberg) : quelques mots peuvent différer de la version que l'on chante aujourd'hui.</p>
    </section>`);
    $("#retour").onclick = ecranAccueil;
    app.querySelectorAll("[data-lg]").forEach(b => b.onclick = () => { comptLg = b.dataset.lg; ecranComptines(); });
    $("#tous").onchange = e => { comptTous = e.target.checked; ecranComptines(); };
    if ($("#voir-tous")) $("#voir-tous").onclick = () => { comptTous = true; ecranComptines(); };
    if ($("#ajouter")) $("#ajouter").onclick = () => ecranAjout("lecon");
    $("#import-mp3").onclick = () => avecPin(ecranImportMp3);
    const page = app.firstElementChild;
    clesChants().then(cles => { if (app.firstElementChild !== page) return; app.querySelectorAll("[data-c]").forEach(b => { if (cles.has("c:" + b.dataset.c) || (window.MELODIES || {})[b.dataset.c] || (window.PIANO || {})[b.dataset.c]) b.querySelector("b")?.insertAdjacentHTML("beforeend", cles.has("c:" + b.dataset.c) ? ' <span class="pastille-chant" title="Chanson enregistrée">🎤</span>' : ' <span class="pastille-chant" title="Avec la musique">🎵</span>'); }); });
    app.querySelectorAll(".item[data-id]").forEach(b => b.onclick = () => ecranItem(cartable().find(i => i.id === b.dataset.id)));
    app.querySelectorAll("[data-c]").forEach(b => b.onclick = () => ecranTexte(C.find(c => c.id === b.dataset.c)));
  }
  function lireTexte(c) {
    if (!("speechSynthesis" in window)) return;
    if (c.lg === "fr") { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(c.texte.replace(/\n+/g, " \n")); u.lang = "fr-FR"; const v = speechSynthesis.getVoices().find(v => v.lang && v.lang.startsWith("fr") && /natural|neural/i.test(v.name)) || speechSynthesis.getVoices().find(v => v.lang && v.lang.startsWith("fr")); if (v) u.voice = v; u.rate = .9; speechSynthesis.speak(u); }
    else parlerLangue(c.texte, c.lg);
  }
  // ---------- chanter : mélodie en boîte à musique + voix enregistrée par un adulte ----------
  // Les enregistrements sont gardés à part (dossier « sons » du PC), pas dans donnees.json,
  // pour que la sauvegarde habituelle reste légère.
  const cleChant = c => c.item ? "i:" + c.item.id : "c:" + c.id;
  let chantDB = null;
  function baseChants() {
    if (chantDB) return chantDB;
    chantDB = new Promise((ok, ko) => {
      try {
        const r = indexedDB.open("aide-devoirs-chants", 1);
        r.onupgradeneeded = () => r.result.createObjectStore("voix");
        r.onsuccess = () => ok(r.result); r.onerror = () => ko(r.error);
      } catch (e) { ko(e); }
    });
    chantDB.catch(() => chantDB = null);
    try { navigator.storage?.persist?.(); } catch { }
    return chantDB;
  }
  async function chantOp(mode, f) {
    const db = await baseChants();
    return new Promise((ok, ko) => { const t = db.transaction("voix", mode), r = f(t.objectStore("voix")); t.oncomplete = () => ok(r && r.result); t.onerror = () => ko(t.error); t.onabort = () => ko(t.error); });
  }
  // Les sons sont gardés sur le PC (dossier « sons », API /api/sons) pour être entendus aussi sur les tablettes.
  // L'IndexedDB ne sert plus que de secours : anciennes copies du PC, recopiées une fois vers le dossier.
  const chantLocal = cle => chantOp("readonly", s => s.get(cle)).catch(() => null);
  const urlSon = cle => "api/sons/" + encodeURIComponent(cle);
  const sonsMigres = () => { try { return localStorage.getItem("sons-sur-pc") === "1"; } catch { return false; } };
  let listeSons = null;   // promesse { clé: informations }
  const infosSons = (frais) => (!frais && listeSons) || (listeSons = fetch("api/sons").then(r => { if (!r.ok) throw 0; return r.json(); }).catch(e => { listeSons = null; throw e; }));
  async function chantLirePC(cle) {
    if (EN_LIGNE) return chantLocal(cle);
    try {
      const m = (await infosSons())[cle];
      if (m) {
        const r = await fetch(urlSon(cle)); if (!r.ok) throw 0;
        const v = Object.assign({}, m); delete v._type; delete v._bin;
        if (m._bin === "buf") v.buf = await r.arrayBuffer(); else v.blob = await r.blob();
        return v;
      }
      if (sonsMigres() || !surLePC) return null;
    } catch { }
    return chantLocal(cle);
  }
  const metaSon = v => { const m = Object.assign({}, v); delete m.buf; delete m.blob; m._bin = v.buf ? "buf" : "blob"; m._type = (v.blob && v.blob.type) || "application/octet-stream"; return m; };
  async function chantEcrirePC(cle, v) {
    if (EN_LIGNE) return chantOp("readwrite", s => s.put(v, cle));
    const meta = metaSon(v), donnee = v.buf || v.blob;
    const r = await fetch(urlSon(cle), { method: "PUT", headers: { "X-Meta": encodeURIComponent(JSON.stringify(meta)), "Content-Type": "application/octet-stream" }, body: donnee }).catch(() => null);
    listeSons = null;
    if (!r || !r.ok) {   // PC injoignable : on garde au moins le son sur cet appareil
      if (r && r.status === 413) throw new Error("Ce fichier est trop gros.");
      return chantOp("readwrite", s => s.put(v, cle));
    }
  }
  async function chantEffacerPC(cle) {
    if (!EN_LIGNE) await fetch(urlSon(cle), { method: "DELETE" }).catch(() => { });
    listeSons = null;
    await chantOp("readwrite", s => s.delete(cle)).catch(() => { });
  }
  // Avec la synchronisation GitHub, les sons des parents vont sur GitHub (sauf le gros paquet arabe).
  const parNuage = cle => !!nuage && cle !== PAQUET_AR;
  const chantLire = cle => parNuage(cle) ? nuageLireSon(cle).catch(() => null) : chantLirePC(cle);
  const chantEcrire = (cle, v) => parNuage(cle) ? nuageEcrireSon(cle, metaSon(v), v.buf || v.blob) : chantEcrirePC(cle, v);
  const chantEffacer = cle => parNuage(cle) ? nuageEcrireSon(cle, null, null) : chantEffacerPC(cle);
  // Une seule fois sur le PC : recopie dans le dossier « sons » ce qui n'était que dans la fenêtre.
  async function migrerSons() {
    if (!surLePC || sonsMigres()) return;
    try {
      const serveur = await infosSons(true), cles = await chantOp("readonly", s => s.getAllKeys());
      for (const c of cles) if (!serveur[c] && !String(c).startsWith("sha:")) { const v = await chantLocal(c); if (v && (v.blob || v.buf)) await chantEcrire(c, v); }
      await infosSons(true);
      try { localStorage.setItem("sons-sur-pc", "1"); } catch { }
    } catch { }
  }

  let chantEnCours = null;   // { stop() }
  // changementEcran : on arrête la musique et les lectures longues, mais pas un mot court qui vient d'être prononcé
  // (ex. la lettre arabe dite juste avant de passer à la question suivante).
  function arreterChant(changementEcran) {
    const c = chantEnCours; chantEnCours = null;
    if (c) { try { c.stop(); } catch { } }
    if (!changementEcran) { try { speechSynthesis?.cancel?.(); } catch { } }
  }
  // ---------- lecture à voix haute : phrase par phrase, avec le passage lu surligné ----------
  function voixLangue(lg) { return voixPour(LANG_VOIX[lg] || "fr-FR"); }
  function decouperPhrases(t) {
    const morceaux = String(t || "").replace(/\s+/g, " ").trim().split(/(?<=[.!?…;:»])\s+(?=[«"“A-ZÀ-ÝÉ0-9—–-])/u);
    const out = [];
    for (const m of morceaux) {   // les phrases très longues sont coupées aux virgules pour éviter que la voix ne s'arrête
      if (m.length <= 240) { if (m.trim()) out.push(m); continue; }
      let cur = ""; for (const b of m.split(/(?<=,)\s+/)) { if ((cur + " " + b).length > 240 && cur) { out.push(cur); cur = b; } else cur = cur ? cur + " " + b : b; } if (cur) out.push(cur);
    }
    return out;
  }
  // segs : [{ texte, lg, el }] — el (facultatif) est surligné pendant sa lecture.
  function lireAVoixHaute(segs, { surFin = () => { }, vitesse } = {}) {
    if (!("speechSynthesis" in window)) { toast("La lecture à voix haute n'est pas disponible sur cet ordinateur."); return null; }
    arreterChant();
    const file = [];
    segs.forEach(s => decouperPhrases(s.texte).forEach(p => file.push({ p, lg: s.lg || "fr", el: s.el })));
    if (!file.length) return null;
    const sansVoix = [...new Set(file.map(x => x.lg))].filter(l => !voixLangue(l) && l !== "fr" && l !== "ar");
    if (sansVoix.length) toast(`Pas de voix ${sansVoix.map(l => ({ en: "anglaise", es: "espagnole", it: "italienne", ar: "arabe" })[l] || l).join(", ")} sur cet ordinateur : voir Langues pour l'installer.`);
    let actif = true, i = 0, allume = null;
    const eteindre = () => { if (allume) allume.classList.remove("en-lecture"); allume = null; };
    const suivant = () => {
      if (!actif) return;
      if (i >= file.length) { actif = false; eteindre(); if (chantEnCours === ctl) chantEnCours = null; surFin(true); return; }
      const { p, lg, el } = file[i++];
      if (el !== allume) { eteindre(); if (el) { el.classList.add("en-lecture"); el.scrollIntoView({ block: "nearest", behavior: "smooth" }); allume = el; } }
      // arabe : sons intégrés à l'application, mot par mot si la phrase entière n'a pas de son ; voix de Windows en dernier recours
      if (lg === "ar") {
        const jouer = async morceaux => {
          for (const m of morceaux) {
            if (!actif) return;
            const src = await sourceSonArabe(m);
            if (src) await new Promise(ok => { const a = new Audio(src); sonAr = a; a.onended = a.onerror = () => setTimeout(ok, 120); a.play().catch(ok); });
            else if (voixLangue("ar")) await new Promise(ok => { const u = new SpeechSynthesisUtterance(m); u.lang = "ar-SA"; u.voice = voixLangue("ar"); u.onend = u.onerror = ok; speechSynthesis.speak(u); });
          }
        };
        (async () => { const entier = await sourceSonArabe(p.replace(/[.،,؛:!؟?]+$/, "")); await jouer(entier ? [p.replace(/[.،,؛:!؟?]+$/, "")] : p.split(/[\s،,؛]+/).filter(Boolean)); if (actif) setTimeout(suivant, 60); })();
        return;
      }
      const u = new SpeechSynthesisUtterance(p), v = voixLangue(lg);
      u.lang = LANG_VOIX[lg] || "fr-FR"; if (v) u.voice = v;
      u.rate = vitesse || (enfant && enfant.niveau <= 4 ? .88 : .97);
      u.onend = () => setTimeout(suivant, 60); u.onerror = e => { if (actif && e.error !== "interrupted" && e.error !== "canceled") setTimeout(suivant, 60); };
      speechSynthesis.speak(u);
    };
    const ctl = { stop() { actif = false; try { speechSynthesis.cancel(); } catch { } try { sonAr?.pause(); } catch { } eteindre(); surFin(false); } };
    speechSynthesis.cancel(); chantEnCours = ctl; setTimeout(suivant, 80);
    return ctl;
  }
  // Petit bouton 🔊 qui lit un texte (ou l'arrête s'il est en train de lire).
  const btnEcoute = (libelle = "Écouter") => `<button class="btn-discret btn-ecoute" type="button" aria-label="${esc(libelle)}" title="${esc(libelle)}">${ICO.son}<span>${esc(libelle)}</span></button>`;
  function brancherEcoute(bouton, segments) {
    if (!bouton) return;
    bouton.onclick = e => {
      e.preventDefault(); e.stopPropagation();
      if (bouton.classList.contains("en-cours")) { arreterChant(); return; }
      const segs = typeof segments === "function" ? segments() : segments;
      const lab = bouton.querySelector("span"), avant = lab ? lab.textContent : "";
      const ctl = lireAVoixHaute(segs, { surFin: () => { bouton.classList.remove("en-cours"); if (lab) lab.textContent = avant; } });
      if (ctl) { bouton.classList.add("en-cours"); if (lab) lab.textContent = "Arrêter"; }
    };
  }
  let audioCtx = null;
  const ctxAudio = () => { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === "suspended") audioCtx.resume(); return audioCtx; };
  const NOTES = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function lireNotes(phrase, transpo = 12) {
    return phrase.trim().split(/\s+/).map(t => {
      const [n, d] = t.split(":"), duree = d ? +d : 1;
      if (n === "R") return { f: 0, duree };
      const m = /^([A-G])(#|b)?(\d)$/.exec(n); if (!m) throw new Error("note " + t);
      const midi = 12 * (+m[3] + 1) + NOTES[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0) + transpo;
      return { f: 440 * Math.pow(2, (midi - 69) / 12), duree, midi };
    });
  }
  function noteBoite(ctx, sortie, f, t, duree) {
    const g = ctx.createGain(), fin = t + Math.min(2.2, Math.max(.6, duree * 1.6));
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.32, t + .006); g.gain.exponentialRampToValueAtTime(.001, fin);
    g.connect(sortie);
    [[1, 1, "sine"], [2, .28, "sine"], [3.01, .06, "triangle"]].forEach(([h, a, type]) => {
      const o = ctx.createOscillator(), og = ctx.createGain(); o.type = type; o.frequency.value = f * h; og.gain.value = a;
      o.connect(og); og.connect(g); o.start(t); o.stop(fin + .05);
    });
  }
  // Joue la mélodie strophe après strophe et appelle surLigne(strophe, [vers…]) au début de chaque phrase.
  function jouerMelodie(mel, strophes, lent, surLigne, surFin) {
    const ctx = ctxAudio(), sortie = ctx.createGain(); sortie.gain.value = .9; sortie.connect(ctx.destination);
    const temps = 60 / (mel.bpm * (lent ? .8 : 1));
    // une octave plus haut (son de boîte à musique) sauf si l'air est déjà aigu
    const haut = Math.max(...Object.values(mel.parts || { A: mel.phrases }).flat().flatMap(p => lireNotes(p, 0)).map(n => n.midi || 0));
    const transpo = haut <= 76 ? 12 : 0;
    const partie = s => mel.parts ? (mel.parts[(mel.ordre || ["A"])[s] || (mel.ordre || ["A"]).slice(-1)[0]] || mel.parts.A) : mel.phrases;
    let t = ctx.currentTime + .15; const minuteurs = [], debut = t;
    strophes.forEach((vers, s) => {
      const L = vers.length, phrases = partie(s).map(p => lireNotes(p, transpo)), P = phrases.length;
      phrases.forEach((notes, j) => {
        const a = Math.floor(j * L / P), b = Math.max(a + 1, Math.floor((j + 1) * L / P)), lignes = [];
        for (let k = a; k < Math.min(b, L); k++) lignes.push(k);
        minuteurs.push(setTimeout(() => surLigne(s, lignes), (t - ctx.currentTime) * 1000));
        for (const n of notes) { if (n.f) noteBoite(ctx, sortie, n.f, t, n.duree * temps); t += n.duree * temps; }
      });
      t += temps; // petite respiration entre deux couplets
    });
    minuteurs.push(setTimeout(() => { chantEnCours = null; surFin(); }, (t - ctx.currentTime) * 1000 + 300));
    return { stop() { minuteurs.forEach(clearTimeout); try { sortie.gain.cancelScheduledValues(ctx.currentTime); sortie.gain.setValueAtTime(sortie.gain.value, ctx.currentTime); sortie.gain.linearRampToValueAtTime(0, ctx.currentTime + .08); setTimeout(() => sortie.disconnect(), 200); } catch { } surFin(); }, duree: t - debut };
  }
  // ---------- piano : lecture des accompagnements MIDI (Widor, Pierné) ----------
  function lireMidi(b64) {
    const bin = atob(b64), d = new Uint8Array(bin.length); for (let k = 0; k < bin.length; k++) d[k] = bin.charCodeAt(k);
    let p = 0; const u32 = () => (d[p++] << 24 | d[p++] << 16 | d[p++] << 8 | d[p++]) >>> 0, u16 = () => d[p++] << 8 | d[p++];
    const vlq = () => { let v = 0, b; do { b = d[p++]; v = (v << 7) | (b & 127); } while (b & 128); return v; };
    if (u32() !== 0x4d546864) throw new Error("MIDI invalide");
    const lh = u32(), fin0 = p + lh; u16(); const nb = u16(), div = u16(); p = fin0;
    const evts = [];   // [tick, type, a, b] type : 0 tempo, 1 note on, 2 note off
    for (let t = 0; t < nb && p < d.length; t++) {
      if (u32() !== 0x4d54726b) break;
      const len = u32(), fin = p + len; let tick = 0, statut = 0;
      while (p < fin) {
        tick += vlq(); let s = d[p];
        if (s & 128) { p++; statut = s; } else s = statut;
        const typ = s & 0xf0;
        if (s === 0xff) { const m = d[p++], l = vlq(); if (m === 0x51) evts.push([tick, 0, d[p] << 16 | d[p + 1] << 8 | d[p + 2]]); p += l; }
        else if (s === 0xf0 || s === 0xf7) { p += vlq(); }
        else if (typ === 0x90 || typ === 0x80) { const n = d[p++], v = d[p++]; evts.push([tick, typ === 0x90 && v > 0 ? 1 : 2, n + 128 * (s & 15), v]); }
        else if (typ === 0xc0 || typ === 0xd0) p += 1; else p += 2;
      }
      p = fin;
    }
    evts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    let tempo = 500000, dernierTick = 0, sec = 0; const ouvertes = {}, notes = [];
    for (const [tick, type, a, b] of evts) {
      sec += (tick - dernierTick) * tempo / div / 1e6; dernierTick = tick;
      if (type === 0) tempo = a;
      else if (type === 1) (ouvertes[a] = ouvertes[a] || []).push([sec, b]);
      else if (ouvertes[a] && ouvertes[a].length) { const [debut, v] = ouvertes[a].shift(); notes.push({ t: debut, d: Math.max(.05, sec - debut), n: a % 128, v }); }
    }
    return { notes, duree: notes.reduce((m, x) => Math.max(m, x.t + x.d), 0) };
  }
  function notePiano(ctx, sortie, n, t, d, v) {
    const f = 440 * Math.pow(2, (n - 69) / 12), amp = (.05 + .17 * v / 127) * (n < 48 ? .8 : 1), fin = t + Math.min(d + .35, 3.2);
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(amp, t + .008);
    g.gain.exponentialRampToValueAtTime(amp * .35, t + .25); g.gain.setTargetAtTime(amp * .12, t + .25, Math.max(.3, d));
    g.gain.setValueAtTime(amp * .12, Math.max(t + .26, t + d)); g.gain.exponentialRampToValueAtTime(.0005, fin);
    const filtre = ctx.createBiquadFilter(); filtre.type = "lowpass"; filtre.frequency.value = Math.min(9000, f * 6); filtre.connect(g); g.connect(sortie);
    [[1, 1, "triangle"], [2, .35, "sine"], [3, .12, "sine"], [4.02, .05, "sine"]].forEach(([h, a, type]) => {
      if (f * h > 12000) return;
      const o = ctx.createOscillator(), og = ctx.createGain(); o.type = type; o.frequency.value = f * h; og.gain.value = a;
      o.connect(og); og.connect(filtre); o.start(t); o.stop(fin + .05);
    });
  }
  function jouerPiano(piano, surFin) {
    const ctx = ctxAudio(), comp = ctx.createDynamicsCompressor(), sortie = ctx.createGain();
    sortie.gain.value = .9; sortie.connect(comp); comp.connect(ctx.destination);
    const { notes, duree } = piano._lu || (piano._lu = lireMidi(piano.midi));
    const depart = ctx.currentTime + .15, fois = piano.fois || 1, pause = .8;
    // les notes sont programmées par petits paquets pour ne pas surcharger l'ordinateur
    const toutes = []; for (let r = 0; r < fois; r++) for (const x of notes) toutes.push([depart + r * (duree + pause) + x.t, x]);
    let k = 0, fini = false;
    const pompe = setInterval(() => { const limite = ctx.currentTime + 2; while (k < toutes.length && toutes[k][0] < limite) { const [t, x] = toutes[k++]; notePiano(ctx, sortie, x.n, t, x.d, x.v); } }, 250);
    const total = fois * (duree + pause);
    const fin = setTimeout(() => { fini = true; clearInterval(pompe); if (chantEnCours === ctl) chantEnCours = null; surFin(); }, total * 1000 + 600);
    const ctl = { stop() { if (fini) return; fini = true; clearInterval(pompe); clearTimeout(fin); try { sortie.gain.setTargetAtTime(0, ctx.currentTime, .05); setTimeout(() => { sortie.disconnect(); comp.disconnect(); }, 400); } catch { } surFin(); } };
    toutes.sort((a, b) => a[0] - b[0]);
    return ctl;
  }
  const strophesDe = texte => texte.split(/\n\s*\n/).map(s => s.split("\n"));
  const poemeHtml = (texte, karaoke) => strophesDe(esc(texte)).map((vers, s) => `<p>${vers.map((v, l) => karaoke ? `<span class="ligne-chant" data-s="${s}" data-l="${l}">${v}</span>` : v).join("<br>")}</p>`).join("");
  const dureeLisible = s => { s = Math.round(s); return s < 60 ? `${s} s` : `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, "0")}`; };

  // ---------- écran d'enregistrement (adulte) ----------
  function ecranEnregistrer(c, retour) {
    arreterChant();
    const cle = cleChant(c);
    let flux = null, rec = null, morceaux = [], blob = null, debut = 0, minuteur = null, anim = null, url = null;
    const nettoyer = () => { clearInterval(minuteur); cancelAnimationFrame(anim); if (flux) flux.getTracks().forEach(t => t.stop()); flux = null; };
    rendre(`<section class="page etroite">
      <div class="entete"><div><button class="retour-lien" id="retour" type="button">${ICO.retour} ${esc(c.titre)}</button>
        <h1>La chanson de cette comptine</h1><p class="doux">Chantez-la une fois, ou choisissez un fichier MP3 : l'enfant l'écoutera avec le bouton « Écouter ».</p></div><span class="grosse-emo"><span class="emo">🎙️</span></span></div>
      <div class="feuille sections enregistreur">
        <div id="enr-existant"></div>
        <div class="rangee" style="align-items:center"><button class="btn gros rouge" id="enr" type="button">● Commencer l'enregistrement</button>
          <span class="enr-temps" id="enr-temps" aria-live="off"></span></div>
        <div class="vu-metre" aria-hidden="true"><i id="vu"></i></div>
        <p id="enr-etat" class="doux" aria-live="polite" style="margin:0">Placez-vous près de l'ordinateur, dans une pièce calme. La première fois, l'ordinateur demande l'autorisation d'utiliser le micro : répondez « Autoriser ».</p>
        <div id="enr-resultat"></div>
        <div class="rangee" style="align-items:center"><span class="doux">ou</span><label class="btn second" for="enr-fichier">🎵 Choisir un fichier MP3 pour cette comptine</label><input type="file" id="enr-fichier" accept="audio/*,.mp3,.m4a,.ogg,.wav" hidden></div>
      </div>
      <article class="feuille texte-poeme" lang="${c.lg}">${poemeHtml(c.texte, false)}</article>
    </section>`);
    const etat = m => $("#enr-etat").textContent = m;
    $("#retour").onclick = () => { if (rec && rec.state === "recording") rec.stop(); nettoyer(); retour(); };
    chantLire(cle).then(v => {
      if (!v || !$("#enr-existant")) return;
      url = URL.createObjectURL(v.blob);
      $("#enr-existant").innerHTML = `<div class="note-info"><b>Déjà enregistrée</b> (${dureeLisible(v.duree || 0)}, le ${dateLisible(v.le)}). Un nouvel enregistrement remplacera celui-ci.
        <audio controls src="${url}" style="display:block;width:100%;margin-top:8px"></audio>
        <button class="btn-discret" id="enr-suppr" type="button">Supprimer cet enregistrement</button></div>`;
      $("#enr-suppr").onclick = async () => { await chantEffacer(cle).catch(() => { }); toast("Enregistrement supprimé."); $("#enr-existant").innerHTML = ""; };
    });
    $("#enr-fichier").onchange = async e => {
      const f = e.target.files[0]; e.target.value = ""; if (!f) return;
      if (rec && rec.state === "recording") rec.stop();
      const u = URL.createObjectURL(f);
      etat(`Fichier choisi : « ${f.name} ». Écoutez-le, puis gardez-le.`);
      $("#enr-resultat").innerHTML = `<audio controls src="${u}" style="width:100%"></audio>
        <div class="rangee"><button class="btn gros vert" id="enr-garder" type="button">✓ Garder ce fichier</button></div>`;
      $("#enr-garder").onclick = async () => {
        try { await chantEcrire(cle, { blob: f, duree: await dureeAudio(f), le: jour(), titre: c.titre, fichier: f.name }); toast("C'est enregistré ! L'enfant peut maintenant l'écouter."); retour(); }
        catch { etat("Je n'ai pas pu garder ce fichier sur cet ordinateur. Réessayez."); }
      };
    };
    $("#enr").onclick = async () => {
      if (rec && rec.state === "recording") { rec.stop(); return; }
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { etat(surLePC ? "Cet ordinateur ne permet pas d'enregistrer le son." : "Sur la tablette, l'enregistrement ne marche pas : enregistrez-vous sur le PC."); return; }
      try { flux = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: true } }); }
      catch (e) { etat(e && e.name === "NotFoundError" ? "Aucun micro n'a été trouvé. Branchez un micro ou un casque avec micro, puis réessayez." : "Le micro n'est pas autorisé. Cliquez sur le petit cadenas en haut de la fenêtre, autorisez le micro, puis réessayez."); return; }
      const type = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus"].find(t => MediaRecorder.isTypeSupported?.(t)) || "";
      rec = new MediaRecorder(flux, Object.assign({ audioBitsPerSecond: 64000 }, type ? { mimeType: type } : {}));
      morceaux = []; blob = null; $("#enr-resultat").innerHTML = "";
      rec.ondataavailable = e => e.data.size && morceaux.push(e.data);
      rec.onstop = () => {
        const duree = (Date.now() - debut) / 1000; nettoyer();
        $("#enr").textContent = "● Recommencer l'enregistrement"; $("#enr").classList.remove("en-cours"); $("#vu").style.width = "0";
        blob = new Blob(morceaux, { type: rec.mimeType || "audio/webm" });
        if (duree < 2 || !blob.size) { etat("L'enregistrement est trop court. Réessayez."); return; }
        const u = URL.createObjectURL(blob);
        etat("Écoutez le résultat. S'il vous plaît, gardez-le.");
        $("#enr-resultat").innerHTML = `<audio controls src="${u}" style="width:100%"></audio>
          <div class="rangee"><button class="btn gros vert" id="enr-garder" type="button">✓ Garder cet enregistrement</button></div>`;
        $("#enr-garder").onclick = async () => {
          try { await chantEcrire(cle, { blob, duree, le: jour(), titre: c.titre }); toast("C'est enregistré ! L'enfant peut maintenant l'écouter."); retour(); }
          catch { etat("Je n'ai pas pu garder l'enregistrement sur cet ordinateur. Réessayez."); }
        };
      };
      rec.start(1000); debut = Date.now();
      $("#enr").textContent = "■ Arrêter l'enregistrement"; $("#enr").classList.add("en-cours");
      etat("J'enregistre… Chantez maintenant, puis cliquez sur « Arrêter ».");
      minuteur = setInterval(() => { const s = (Date.now() - debut) / 1000; $("#enr-temps").textContent = dureeLisible(s); if (s > 600 && rec.state === "recording") rec.stop(); }, 250);
      try {
        const ctx = ctxAudio(), src = ctx.createMediaStreamSource(flux), an = ctx.createAnalyser(); an.fftSize = 512; src.connect(an);
        const buf = new Uint8Array(an.fftSize);
        const tour = () => { an.getByteTimeDomainData(buf); let m = 0; for (const x of buf) m = Math.max(m, Math.abs(x - 128)); const vu = $("#vu"); if (vu) vu.style.width = Math.min(100, m / 128 * 160) + "%"; anim = requestAnimationFrame(tour); };
        tour();
      } catch { }
    };
  }
  // ---------- import de fichiers MP3 (adulte) : chaque fichier est rattaché à sa comptine ----------
  const MOTS_VIDES = new Set("le la les l un une des de du d et a au aux en dans sur pour par mon ma mes ton ta tes son sa ses il elle on y ne pas qui que qu est c s n j m t the of and to my in on comptine comptines chanson chansons enfant enfants enfantine version instrumental karaoke paroles lyrics mp3 track piste officiel officielle clip audio hd remix bis".split(" "));
  const motsDe = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/['’`]/g, " ").replace(/[^a-z0-9]+/g, " ").trim().split(" ").filter(w => w && !MOTS_VIDES.has(w) && !/^\d+$/.test(w));
  // noms sous lesquels on trouve souvent ces comptines
  const AUTRES_NOMS = { furet: ["il court le furet"], "pont-avignon": ["pont avignon"], "ah-vous-dirai-je": ["vous dirai je maman"], "frere-jacques": ["frere jacques dormez vous"],
    "clair-de-lune": ["clair de lune pierrot"], "promenons-nous": ["loup y es tu"], "roi-dagobert": ["roi dagobert"], "il-etait-une-bergere": ["petit patapon"], "ainsi-font": ["petites marionnettes"],
    "pomme-reinette": ["pomme d api"], "meunier-tu-dors": ["moulin va trop vite"], "petits-bateaux": ["petits bateaux"], "twinkle": ["little star"], "baa-baa": ["black sheep"] };
  function scoreTitre(fichier, c) {
    const f = new Set(motsDe(fichier.replace(/\.[a-z0-9]{2,4}$/i, "")));
    if (!f.size) return 0;
    // le titre et sa variante entre parenthèses, plus l'identifiant interne
    const variantes = [c.titre, ...(AUTRES_NOMS[c.id] || []), ...(c.titre.match(/\(([^)]+)\)/) || []).slice(1), c.titre.replace(/\(.*\)/, ""), c.id.replace(/-/g, " ")];
    let best = 0;
    for (const v of variantes) {
      const t = motsDe(v); if (!t.length) continue;
      const proche = (x, w) => x === w || (Math.min(x.length, w.length) > 3 && Math.min(x.length, w.length) / Math.max(x.length, w.length) >= .75 && (x.startsWith(w) || w.startsWith(x)));
      const vus = t.filter(w => [...f].some(x => proche(x, w))).length, utiles = [...f].filter(x => t.some(w => proche(x, w))).length;
      // un titre d'un seul mot (« Coucou ») ne compte que si le nom du fichier ne contient rien d'autre
      if (t.length === 1 && utiles < f.size) continue;
      best = Math.max(best, vus / t.length);
    }
    return best;
  }
  function deviner(nom, C) {
    const sc = C.map(c => [c, scoreTitre(nom, c)]).sort((a, b) => b[1] - a[1]);
    return sc[0] && sc[0][1] >= .6 && (!sc[1] || sc[0][1] > sc[1][1] || sc[0][1] === 1) ? sc[0][0] : null;
  }
  const dureeAudio = blob => new Promise(ok => { const a = new Audio(), u = URL.createObjectURL(blob); a.preload = "metadata"; a.onloadedmetadata = () => { ok(isFinite(a.duration) ? a.duration : 0); URL.revokeObjectURL(u); }; a.onerror = () => { ok(0); URL.revokeObjectURL(u); }; a.src = u; });
  async function clesChants() {
    if (nuage) { try { return new Set(Object.keys(await nuageInfosSons())); } catch { return new Set(); } }
    return clesChantsPC();
  }
  async function clesChantsPC() {
    const locales = async () => (await chantOp("readonly", s => s.getAllKeys())).filter(k => !String(k).startsWith("sha:"));
    if (EN_LIGNE) { try { return new Set(await locales()); } catch { return new Set(); } }
    let cles = [];
    try { cles = Object.keys(await infosSons()); if (sonsMigres() || !surLePC) return new Set(cles); } catch { }
    try { return new Set([...cles, ...await locales()]); } catch { return new Set(cles); }
  }

  function ecranImportMp3() {
    arreterChant();
    const C = (window.COMPTINES || []).filter(c => c.type === "comptine").sort((a, b) => a.titre.localeCompare(b.titre, "fr"));
    let lignes = [];   // { fichier, comptine }
    rendre(`<section class="page etroite">
      <div class="entete"><div><button class="retour-lien" id="retour" type="button">${ICO.retour} Mes comptines</button>
        <h1>Ajouter des chansons en MP3</h1><p class="doux">Choisissez vos fichiers : je reconnais chaque comptine d'après le nom du fichier. Vérifiez, corrigez si besoin, puis enregistrez.</p></div><span class="grosse-emo"><span class="emo">🎵</span></span></div>
      <div class="feuille sections">
        <div class="rangee">
          <label class="btn gros" for="mp3-fichiers">📄 Choisir des fichiers</label><input type="file" id="mp3-fichiers" accept="audio/*,.mp3,.m4a,.ogg,.wav" multiple hidden>
          <label class="btn second" for="mp3-dossier">📁 Choisir un dossier entier</label><input type="file" id="mp3-dossier" webkitdirectory multiple hidden>
        </div>
        <p class="doux" style="margin:0;font-size:.9rem">Les fichiers restent sur cet ordinateur. Utilisez des enregistrements que vous avez le droit d'utiliser (vos CD, vos achats, ou des enregistrements sous licence libre) : la chanson est libre, mais l'enregistrement d'un interprète est souvent protégé.</p>
        <div id="mp3-liste"></div>
      </div>
    </section>`);
    $("#retour").onclick = ecranComptines;
    const options = sel => `<option value="">— Ne pas utiliser —</option>${C.map(c => `<option value="${c.id}" ${sel === c.id ? "selected" : ""}>${esc(c.titre)}${c.lg !== "fr" ? ` (${LANG_NOMS[c.lg] || c.lg})` : ""}</option>`).join("")}`;
    async function afficher() {
      const deja = await clesChants(), z = $("#mp3-liste"); if (!z) return;
      if (!lignes.length) { z.innerHTML = ""; return; }
      const ok = lignes.filter(l => l.comptine).length;
      z.innerHTML = `<p style="margin:6px 0"><b>${lignes.length} fichier${lignes.length > 1 ? "s" : ""}</b> · ${ok} reconnu${ok > 1 ? "s" : ""}${lignes.length - ok ? ` · <span class="doux">${lignes.length - ok} à choisir à la main</span>` : ""}</p>
        <div class="mp3-table">${lignes.map((l, i) => `<div class="mp3-ligne${l.comptine ? "" : " a-choisir"}">
          <button class="btn-discret mp3-ecoute" data-i="${i}" type="button" aria-label="Écouter ${esc(l.fichier.name)}">▶️</button>
          <span class="mp3-nom" title="${esc(l.fichier.name)}">${esc(l.fichier.name)}</span>
          <select data-i="${i}" aria-label="Comptine pour ${esc(l.fichier.name)}">${options(l.comptine)}</select>
          ${l.comptine && deja.has("c:" + l.comptine) ? '<small class="doux">remplacera l\'enregistrement actuel</small>' : ""}</div>`).join("")}</div>
        <div class="rangee"><button class="btn gros vert" id="mp3-ok" type="button" ${ok ? "" : "disabled"}>✓ Enregistrer ${ok} chanson${ok > 1 ? "s" : ""}</button></div>
        <p id="mp3-etat" class="doux" aria-live="polite" style="margin:0"></p>`;
      z.querySelectorAll("select").forEach(s => s.onchange = () => { lignes[+s.dataset.i].comptine = s.value || null; afficher(); });
      let lecteur = null;
      z.querySelectorAll(".mp3-ecoute").forEach(b => b.onclick = () => { if (lecteur) { lecteur.pause(); lecteur = null; return; } lecteur = new Audio(URL.createObjectURL(lignes[+b.dataset.i].fichier)); lecteur.play().catch(() => { }); });
      $("#mp3-ok").onclick = async () => {
        const choisis = lignes.filter(l => l.comptine), vus = new Set(), etat = $("#mp3-etat");
        const doublon = choisis.find(l => vus.has(l.comptine) || !vus.add(l.comptine));
        if (doublon) { etat.textContent = `Deux fichiers sont rattachés à « ${C.find(c => c.id === doublon.comptine).titre} » : gardez-en un seul.`; return; }
        $("#mp3-ok").disabled = true; let n = 0;
        for (const l of choisis) {
          etat.textContent = `Enregistrement ${++n} / ${choisis.length}…`;
          try { await chantEcrire("c:" + l.comptine, { blob: l.fichier, duree: await dureeAudio(l.fichier), le: jour(), titre: C.find(c => c.id === l.comptine).titre, fichier: l.fichier.name }); }
          catch { etat.textContent = `Je n'ai pas pu enregistrer « ${l.fichier.name} ». Réessayez.`; $("#mp3-ok").disabled = false; return; }
        }
        toast(`${choisis.length} chanson${choisis.length > 1 ? "s ajoutées" : " ajoutée"} : le bouton « Écouter » joue maintenant ces enregistrements.`);
        ecranComptines();
      };
    }
    const prendre = input => {
      const fs = [...input.files].filter(f => /^audio\//.test(f.type) || /\.(mp3|m4a|ogg|oga|wav|aac|flac|opus)$/i.test(f.name));
      for (const f of fs) if (!lignes.some(l => l.fichier.name === f.name && l.fichier.size === f.size)) { const c = deviner(f.name, C); lignes.push({ fichier: f, comptine: c ? c.id : null }); }
      input.value = ""; afficher();
    };
    $("#mp3-fichiers").onchange = e => prendre(e.target);
    $("#mp3-dossier").onchange = e => prendre(e.target);
  }
  function ecranTexte(c) {
    arreterChant();
    const item = c.item, deja = item || cartable().find(i => i.comptine === c.id);
    const chanson = c.type === "comptine", mel = chanson && (window.MELODIES || {})[c.id], piano = chanson && !mel && (window.PIANO || {})[c.id], cle = cleChant(c);
    const retourTexte = () => item ? ecranItem(item) : ecranComptines();
    const peutLire = "speechSynthesis" in window;
    rendre(`<section class="page etroite">
      <div class="entete"><div><button class="retour-lien" id="retour" type="button">${ICO.retour} ${item ? "Mon cartable" : maternelle() ? "Mes comptines" : "Poésies et comptines"}</button>
        <h1>${esc(c.titre)}</h1><p class="doux">${esc(c.auteur)}</p></div><span class="grosse-emo"><span class="emo">${c.emoji || "📜"}</span></span></div>
      <div class="rangee">${chanson || peutLire ? `<button class="btn gros btn-ecouter" id="ecouter" type="button">▶️ Écouter</button>` : ""}
        <button class="btn gros vert" id="apprendre" type="button">${deja ? "Continuer à l'apprendre" : "Je l'apprends par cœur"}</button></div>
      <div class="texte-poeme-cadre${c.traduction ? " deux" : ""}">
        <article class="feuille texte-poeme" lang="${c.lg}" id="poeme">${poemeHtml(c.texte, !!mel)}</article>
        ${c.traduction ? `<article class="feuille texte-poeme traduction"><span class="label">En français</span>${esc(c.traduction).split(/\n\n/).map(s => `<p>${s.replace(/\n/g, "<br>")}</p>`).join("")}</article>` : ""}
      </div>
      ${c.note ? `<p class="doux" style="font-size:.85rem;margin:0">${esc(c.note)}</p>` : ""}
      ${c.source ? `<p class="doux" style="font-size:.85rem;margin:0">Source : <a href="${esc(c.source)}" target="_blank" rel="noopener">${esc(c.source.replace(/^https?:\/\//, "").split("/")[0])}</a></p>` : ""}
      ${chanson ? `<div class="rangee coin-adulte"><button class="btn-discret" id="enregistrer" type="button">🎙️ Pour les adultes : enregistrer la chanson ou ajouter un MP3</button></div>` : ""}
    </section>`);
    $("#retour").onclick = () => { arreterChant(); retourTexte(); };
    let enregistrement = null;
    const bouton = $("#ecouter");
    const remettre = () => { if (bouton) { bouton.textContent = "▶️ Écouter"; bouton.classList.remove("en-cours"); } app.querySelectorAll(".ligne-chant.allumee").forEach(x => x.classList.remove("allumee")); };
    const jouerVoix = () => {
      const a = new Audio(URL.createObjectURL(enregistrement.blob));
      const fin = () => { if (chantEnCours && chantEnCours.a === a) chantEnCours = null; remettre(); };
      a.onended = fin; a.play().catch(fin);
      return { a, stop() { a.pause(); remettre(); } };
    };
    const jouerMusique = () => jouerMelodie(mel, strophesDe(c.texte), maternelle(), (s, lignes) => {
      app.querySelectorAll(".ligne-chant.allumee").forEach(x => x.classList.remove("allumee"));
      lignes.forEach(l => { const el = app.querySelector(`.ligne-chant[data-s="${s}"][data-l="${l}"]`); if (el) { el.classList.add("allumee"); if (l === lignes[0]) el.scrollIntoView({ block: "nearest", behavior: "smooth" }); } });
    }, remettre);
    const jouerLecture = () => {
      const ctl = lireAVoixHaute([...app.querySelectorAll("#poeme p")].map(el => ({ texte: el.innerText, lg: c.lg, el })), { surFin: remettre });
      if (bouton && ctl) { bouton.textContent = "⏹ Arrêter"; bouton.classList.add("en-cours"); }
      return ctl;
    };
    // Un seul bouton : la voix enregistrée s'il y en a une, sinon la musique, sinon la lecture.
    const ecouter = () => {
      if (bouton && bouton.classList.contains("en-cours")) { arreterChant(); remettre(); return; }
      arreterChant(); remettre();
      const lancer = enregistrement ? jouerVoix : mel ? jouerMusique : piano ? () => jouerPiano(piano, remettre) : peutLire ? jouerLecture : null;
      if (!lancer) return;
      if (lancer === jouerLecture) { lancer(); return; }   // la lecture gère elle-même le bouton
      if (bouton) { bouton.textContent = "⏹ Arrêter"; bouton.classList.add("en-cours"); }
      chantEnCours = lancer();
    };
    if (bouton) bouton.onclick = ecouter;
    if ($("#enregistrer")) $("#enregistrer").onclick = () => { arreterChant(); avecPin(() => ecranEnregistrer(c, () => ecranTexte(c))); };
    $("#apprendre").onclick = () => {
      arreterChant();
      if (item) return ecranParCoeur(item);
      let it = cartable().find(i => i.comptine === c.id);
      if (!it) {
        it = { id: uid(), type: "lecon", cree: jour(), fait: false, cartes: [], fiche: null, comptine: c.id, matiere: matiereTexte(c.lg), theme: TYPES_TEXTE[c.type], titre: c.titre, date: "", texte: c.texte, photos: [] };
        genererAuto(it); cartable().unshift(it); noter("ajout", { id: it.id }); sauver(); gagner(5, "texte ajouté au cartable");
        toast("Ajouté à ton cartable : je le mets dans ton planning de révisions.");
      }
      ecranParCoeur(it);
    };
    const auto = maternelle() && D.reglages.lectureAuto, page = app.firstElementChild;
    if (!chanson) { if (auto) setTimeout(() => app.firstElementChild === page && ecouter(), 400); return; }
    chantLire(cle).then(v => {
      if (app.firstElementChild !== page) return;   // l'enfant a déjà changé d'écran
      if (v && v.blob) { enregistrement = v; $("#enregistrer").textContent = "🎙️ Pour les adultes : changer la chanson"; }
      if (auto) setTimeout(() => { if (app.firstElementChild === page && !chantEnCours) ecouter(); }, 400);
    });
  }

  // =====================================================================
  //  LEÇONS D'ARABE (arabe_lecons.js) + formes des lettres + syllabes
  // =====================================================================
  const ZWJ = "‍";
  const NON_LIEES = "اأإآدذرزو";
  const formesLettre = l => NON_LIEES.includes(l) ? [l, l, ZWJ + l, ZWJ + l] : [l, l + ZWJ, ZWJ + l + ZWJ, ZWJ + l];
  const arHtml = (s, cls) => `<span class="ar${cls ? " " + cls : ""}" lang="ar" dir="rtl">${esc(s)}</span>`;
  const leconsAr = () => (window.ARABE_LECONS || []).filter(l => l.g <= groupe());
  const leconFaite = id => journal().filter(x => x.t === "lecon-ar" && x.id === id).reduce((m, x) => Math.max(m, x.et || 0), -1);
  function blocLeconsArabe() {
    const L = leconsAr();
    return `<div class="sections"><h2 class="cursive titre-groupe">Apprendre à lire et à parler</h2>
      <div class="modes">
        <button class="mode" data-ar="formes" type="button"><span class="ar emo-ar" lang="ar">ب بـ ـبـ ـب</span><b>Les formes des lettres</b><small>Chaque lettre change de forme selon sa place</small></button>
        <button class="mode" data-ar="syllabes" type="button"><span class="ar emo-ar" lang="ar">بَ بِ بُ</span><b>Lire des syllabes</b><small>Les lettres avec les petites voyelles</small></button>
        ${L.map(l => { const f = leconFaite(l.id); return `<button class="mode" data-lecon="${l.id}" type="button"><span class="${/[؀-ۿ]/.test(l.emoji) ? "ar emo-ar" : "emo"}"${/[؀-ۿ]/.test(l.emoji) ? ' lang="ar"' : ""}>${esc(l.emoji)}</span><b>${esc(l.titre)}</b><small>${f >= 0 ? "⭐".repeat(f) + (f < 3 ? "☆".repeat(3 - f) : "") : `${l.exemples.length} exemples · quiz`}</small></button>`; }).join("")}
      </div></div>`;
  }
  function brancherLeconsArabe() {
    app.querySelectorAll("[data-ar]").forEach(b => b.onclick = () => b.dataset.ar === "formes" ? ecranFormesLettres() : ecranSyllabes());
    app.querySelectorAll("[data-lecon]").forEach(b => b.onclick = () => ecranLeconAr(leconsAr().find(l => l.id === b.dataset.lecon)));
  }
  function enteteAr(titre) { return `<div class="entete"><div><button class="retour-lien" id="retour" type="button">${ICO.retour} Arabe</button><h1>${titre}</h1></div></div><div id="voix-info" data-l="ar">${infoVoix("ar")}</div>`; }
  function ecranFormesLettres() {
    rendre(`<section class="page">${enteteAr("Les formes des lettres")}
      <div class="feuille sections"><p style="margin:0">En arabe, les lettres d'un mot s'attachent entre elles. Une lettre change donc un peu de forme selon sa place : <b>seule</b>, au <b>début</b>, au <b>milieu</b> ou à la <b>fin</b> du mot. On lit de droite à gauche.</p>
        <p class="doux" style="margin:0">Les lettres marquées ✋ ne s'attachent jamais à la lettre qui les suit : elles n'ont que deux formes.</p></div>
      <div class="table-wrap feuille"><table class="formes-ar"><thead><tr><th>Lettre</th><th>Seule</th><th>Début</th><th>Milieu</th><th>Fin</th><th></th></tr></thead><tbody>
        ${LG.ALPHABET_AR.map(([l, nom, son], i) => { const [s, d, m, f] = formesLettre(l); return `<tr><td><b>${esc(nom)}</b>${NON_LIEES.includes(l) ? " ✋" : ""}<br><small class="doux">${esc(son)}</small></td><td>${arHtml(s, "fl")}</td><td>${arHtml(d, "fl")}</td><td>${arHtml(m, "fl")}</td><td>${arHtml(f, "fl")}</td><td><button class="btn-discret" data-i="${i}" type="button" aria-label="Écouter ${esc(nom)}">${ICO.son}</button></td></tr>`; }).join("")}
      </tbody></table></div>
      <div class="rangee"><button class="btn gros" id="quiz-formes" type="button">Quiz : reconnaître les lettres</button></div></section>`);
    $("#retour").onclick = () => ecranLangue("ar");
    app.querySelectorAll("[data-i]").forEach(b => b.onclick = () => parlerLangue(LG.ALPHABET_AR[+b.dataset.i][0], "ar"));
    $("#quiz-formes").onclick = () => {
      const A = LG.ALPHABET_AR, places = ["au début du mot", "au milieu du mot", "à la fin du mot"];
      const qs = shuffle(A).slice(0, 10).map(([l, nom]) => {
        const k = 1 + Math.floor(Math.random() * 3), forme = formesLettre(l)[k];
        const autres = shuffle(A.filter(x => x[0] !== l)).slice(0, 3).map(x => x[1]);
        return { q: `<p class="consigne">Quelle lettre est écrite ici, ${places[k - 1]} ?</p><div class="dessin">${arHtml(forme, "fl geant")}</div>`, kind: "qcm", options: shuffle([nom, ...autres]), answer: nom, check: r => r === nom, expl: `C'est la lettre ${esc(nom)} (${esc(l)}).`, voixApres: { t: l, l: "ar" } };
      });
      lancerSeance(null, qs, "Les formes des lettres", null, { lg: "ar", matiere: "langues", retour: ecranFormesLettres });
    };
  }
  const VOY = [["َ", "a"], ["ِ", "i"], ["ُ", "ou"]], LONG = [["َا", "â"], ["ِي", "î"], ["ُو", "oû"]];
  function syllabesDe([l, nom, son]) {
    const c = l === "ا" ? "ء" : l, base = l === "ا" ? "'" : ({ "ع": "ʿ", "ح": "ḥ", "ص": "ṣ", "ض": "ḍ", "ط": "ṭ", "ظ": "ẓ", "ث": "th", "ذ": "dh", "خ": "kh", "ش": "ch", "غ": "gh", "ج": "dj", "ق": "q", "ه": "h", "و": "w", "ي": "y" })[l] || nom[0];
    return VOY.map(([v, s]) => [c + v, base + s]).concat(LONG.map(([v, s]) => [c + v, base + s]));
  }
  function ecranSyllabes(i = 1) {
    const A = LG.ALPHABET_AR, L = A[i], syl = syllabesDe(L);
    rendre(`<section class="page etroite">${enteteAr("Lire des syllabes")}
      <div class="feuille sections"><p style="margin:0">Une lettre + une petite voyelle = une syllabe. Le trait au-dessus fait « a », le trait au-dessous fait « i », la petite boucle fait « ou ». Avec ا ي و après, le son devient long.</p></div>
      <div class="puces lettres-ar" role="group" aria-label="Choisir une lettre">${A.map(([l], k) => `<button class="puce ar" lang="ar" type="button" data-k="${k}" aria-pressed="${k === i}">${l}</button>`).join("")}</div>
      <div class="syllabes">${syl.map(([a, t], k) => `<button class="syllabe" type="button" data-s="${k}">${arHtml(a, "geant")}<small>${esc(t)}</small></button>`).join("")}</div>
      <p class="doux" style="margin:0">Touche une syllabe pour l'entendre. Les voix de Windows lisent mieux des mots entiers que des syllabes seules : écoute bien et répète.</p>
      <div class="rangee"><button class="btn gros" id="quiz-syl" type="button">Quiz : je lis les syllabes</button></div></section>`);
    $("#retour").onclick = () => ecranLangue("ar");
    app.querySelectorAll("[data-k]").forEach(b => b.onclick = () => ecranSyllabes(+b.dataset.k));
    app.querySelectorAll("[data-s]").forEach(b => b.onclick = () => parlerLangue(syl[+b.dataset.s][0], "ar"));
    $("#quiz-syl").onclick = () => {
      const pool = A.slice(1).flatMap(x => syllabesDe(x).slice(0, 3).map(s => [...s, x]));
      const qs = shuffle(pool.filter(p => p[2] === L)).concat(shuffle(pool)).slice(0, 10).map(([a, t, x]) => {
        const voisins = syllabesDe(x).filter(s => s[1] !== t).map(s => s[1]), autres = shuffle(pool.filter(p => p[1] !== t && !voisins.includes(p[1]))).slice(0, 1).map(p => p[1]);
        const opts = [...new Set([t, ...shuffle(voisins).slice(0, 2), ...autres])];
        return { q: `<p class="consigne">Comment se lit cette syllabe ?</p><div class="dessin">${arHtml(a, "geant")}</div>`, kind: "qcm", options: shuffle(opts), answer: t, check: r => r === t, expl: `${esc(a)} se lit « ${esc(t)} ».`, voixApres: { t: a, l: "ar" } };
      });
      lancerSeance(null, qs, "Je lis les syllabes", null, { lg: "ar", matiere: "langues", retour: () => ecranSyllabes(i) });
    };
  }
  const avecAr = s => esc(s).replace(/[؀-ۿً-ْـ]+(?:[\s،؟]+[؀-ۿً-ْـ]+)*/g, m => `<span class="ar" lang="ar" dir="rtl">${m}</span>`);
  function ecranLeconAr(L) {
    rendre(`<section class="page etroite">${enteteAr(esc(L.titre))}
      <div class="feuille sections lecon-ar">${(L.intro || []).map(p => `<p style="margin:0">${avecAr(p)}</p>`).join("")}</div>
      ${L.regles && L.regles.length ? `<div class="feuille"><div class="table-wrap"><table class="lexique"><tbody>${L.regles.map(r => `<tr>${Object.entries(r).map(([k, v]) => `<td>${k === "signe" ? arHtml(/^[ً-ْٰ]$/.test(v) ? "ـ" + v : v, "fl") : avecAr(String(v))}</td>`).join("")}</tr>`).join("")}</tbody></table></div></div>` : ""}
      <div class="feuille sections"><h2>Exemples</h2><div class="exemples-ar">${L.exemples.map(([a, t, f, e], k) => `<button class="ex-ar" type="button" data-e="${k}">${e ? `<span class="emo">${e}</span>` : ""}<span class="ar-groupe">${a.split(/\s+\/\s+/).map(x => arHtml(x, "moyen")).join("")}</span><span><b>${esc(t)}</b><small>${esc(f)}</small></span>${ICO.son}</button>`).join("")}</div></div>
      ${L.quiz && L.quiz.length ? `<div class="rangee"><button class="btn gros" id="quiz-lecon" type="button">Faire le quiz (${L.quiz.length} questions)</button></div>` : ""}
    </section>`);
    $("#retour").onclick = () => ecranLangue("ar");
    app.querySelectorAll("[data-e]").forEach(b => b.onclick = () => parlerLangue(L.exemples[+b.dataset.e][0], "ar"));
    if ($("#quiz-lecon")) $("#quiz-lecon").onclick = () => {
      const qs = shuffle(L.quiz).map(x => ({ q: `<p class="consigne">${avecAr(x.q)}</p>`, kind: "qcm", options: shuffle([x.bonne, ...x.faux]), answer: x.bonne, check: r => r === x.bonne, rendu: o => avecAr(o), images: false, optClass: "mots", expl: x.expl ? avecAr(x.expl) : `La bonne réponse est : ${avecAr(x.bonne)}.` }));
      lancerSeance(null, qs, L.titre, null, { lg: "ar", matiere: "langues", retour: () => ecranLangue("ar"), leconAr: L.id });
    };
  }

  // =====================================================================
  //  PLANNING : plusieurs révisions par jour, dans des matières différentes
  // =====================================================================
  const NB_REVISIONS_AUTO = [2, 3, 4];
  const nbRevisions = () => +D.reglages.revisionsJour || NB_REVISIONS_AUTO[groupe()];
  function exercicesDuJour(date) {
    const n = enfant.niveau, st = D.stats[enfant.id] || {}, k = nbRevisions();
    const ids = [...new Set(Object.values((PROGRAMME.P[n] || {}).matieres || {}).flat().flatMap(t => t[1]))].map(id => EXOS.get(id)).filter(e => e && n >= e.niveaux[0] && n <= e.niveaux[1]);
    const pool = [...new Set(ids.concat(EXOS.pourNiveau(n)))];
    const note = e => { const s = st[e.id]; if (!s) return 1; if (s.questions >= 5 && s.justes / s.questions < .6) return 0; return 2; };
    const ordre = melangeGraine(pool, enfant.id + date).sort((a, b) => note(a) - note(b) + (ids.includes(a) ? 0 : .5) - (ids.includes(b) ? 0 : .5));
    const res = [], mats = new Set();
    for (const e of ordre) { if (res.length >= k) break; if (!mats.has(e.matiere)) { res.push(e); mats.add(e.matiere); } }
    for (const e of ordre) { if (res.length >= k) break; if (!res.includes(e)) res.push(e); }
    return res;
  }

  // ===================== démarrage =====================
  $("#btn-aide").onclick = () => { P?.ctl?.abort(); speechSynthesis?.cancel?.(); ecranAide(); };
  $("#btn-accueil").onclick = () => { P?.ctl?.abort(); speechSynthesis?.cancel?.(); enfant ? ecranAccueil() : ecranEnfants(); };
  $("#btn-parents").onclick = () => { P?.ctl?.abort(); avecPin(() => ecranParents()); };
  if ("speechSynthesis" in window) speechSynthesis.getVoices();
  charger().then(() => {
    if (premiereRatee) return ecranPremiereVenue();
    if (!EN_LIGNE && !surLePC && D.reglages.nuage) return ecranDemenage();
    ecranEnfants(); migrerSons(); migrerSonsNuage().catch(() => { });
    if (nuage) rafraichir();
  });
  if (EN_LIGNE && "serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => { });
  if (EN_LIGNE) try { navigator.storage?.persist?.(); } catch { }
  function ecranPremiereVenue() {
    rendre(`<section class="page etroite"><div class="feuille sections" style="text-align:center"><h1>Presque prêt !</h1>
      <p style="margin:0">La première fois, la tablette a besoin d'<b>Internet</b> pour récupérer les cahiers. Connectez-la au Wi-Fi, puis touchez « Réessayer ».</p>
      <div class="rangee centre"><button class="btn gros" id="re" type="button">Réessayer</button></div></div></section>`);
    $("#re").onclick = () => location.reload();
  }
  function ecranDemenage() {
    rendre(`<section class="page etroite"><div class="feuille sections" style="text-align:center"><h1>L'appli a déménagé 🚚</h1>
      <p style="margin:0">Elle marche maintenant même quand le PC est éteint. Demande à un parent de scanner ton nouveau QR code (Espace parents → Enfants, sur le PC).</p></div></section>`);
  }
})();
