// Viðmót: læra flokkana og merkin, og þrír leikir (flokkur, merking, finna merkið).

const $ = (id) => document.getElementById(id);
const FLOKKUR = Object.fromEntries(FLOKKAR.map((f) => [f.nr, f]));
const LEIKJAHEITI = {
  flokkur: "Hvaða flokkur?",
  merking: "Hvað þýðir merkið?",
  finna: "Finndu merkið",
  blandad: "Blandað próf",
};

const geymsla = {
  lesa(lykill, sjalfgefid) {
    try {
      const v = localStorage.getItem("umferdarmerki:" + lykill);
      return v === null ? sjalfgefid : JSON.parse(v);
    } catch { return sjalfgefid; }
  },
  skrifa(lykill, gildi) {
    try { localStorage.setItem("umferdarmerki:" + lykill, JSON.stringify(gildi)); } catch { /* t.d. lokaður gluggi */ }
  },
};

function stokka(fylki) {
  const a = fylki.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const flokksHeiti = (nr) => `${nr} ${FLOKKUR[nr].heiti}`;
const merkiMynd = (m) => teikna(m.svg(), m.heiti);

/* ---------- Flipar ---------- */

function synaSkja(nafn) {
  for (const s of ["laera", "leikir", "leikur", "lok"]) {
    $("screen-" + s).classList.toggle("hidden", s !== nafn);
  }
  const flipi = nafn === "laera" ? "laera" : "leikir";
  for (const b of $("tabs").children) b.classList.toggle("active", b.dataset.tab === flipi);
}

$("tabs").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  if (leikur && !leikur.buinn && b.dataset.tab === "laera") leikur = null;
  if (b.dataset.tab === "leikir") synaLeikjaval();
  else synaSkja("laera");
});

/* ---------- Læra ---------- */

let valinnFlokkur = geymsla.lesa("flokkur", 100);

function teiknaFlokka() {
  $("flokkar").innerHTML = FLOKKAR.map((f) => `
    <button class="flokkur-hnappur${f.nr === valinnFlokkur ? " active" : ""}" data-nr="${f.nr}">
      <span class="tn">${f.daemi ? teikna(f.daemi(), f.heiti) : ""}</span>
      <span><span class="nr">${f.nr}</span><span class="hn">${f.heiti}</span></span>
    </button>`).join("");

  const f = FLOKKUR[valinnFlokkur];
  const merki = MERKI.filter((m) => m.flokkur === f.nr);
  $("flokkur-syn").innerHTML = `
    <div class="flokkur-lysing">
      <h3>${f.nr} ${f.heiti}</h3>
      <p><span class="lbl">Hlutverk:</span> ${f.tilgangur}</p>
      <p><span class="lbl">Útlit:</span> ${f.utlit}</p>
      <p><span class="lbl">Mundu:</span> ${f.rad}</p>
    </div>
    ${merki.length ? `<div class="merkjanet">${merki.map((m) => `
      <button class="merki-spjald" data-id="${m.id}">
        <span class="mynd">${merkiMynd(m)}</span>
        <span>${m.heiti}</span>
        ${m.nr ? `<span class="nr">nr. ${m.nr}</span>` : ""}
      </button>`).join("")}</div>` : ""}`;
}

$("flokkar").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  valinnFlokkur = Number(b.dataset.nr);
  geymsla.skrifa("flokkur", valinnFlokkur);
  teiknaFlokka();
});

$("flokkur-syn").addEventListener("click", (e) => {
  const b = e.target.closest(".merki-spjald");
  if (b) synaNanar(MERKI.find((m) => m.id === b.dataset.id));
});

function synaNanar(m) {
  $("nanar-merki").innerHTML = merkiMynd(m);
  $("nanar-flokkur").textContent = flokksHeiti(m.flokkur) + (m.nr ? ` · merki nr. ${m.nr}` : "");
  $("nanar-heiti").textContent = m.heiti;
  $("nanar-lysing").textContent = m.lysing;
  $("nanar").showModal();
}

/* ---------- Leikjaval ---------- */

const flokkarMedMerki = FLOKKAR.filter((f) => MERKI.some((m) => m.flokkur === f.nr));
let valdirFlokkar = new Set(geymsla.lesa("valdir", flokkarMedMerki.map((f) => f.nr)));

$("val-flokka").innerHTML = flokkarMedMerki.map((f) => `
  <label><input type="checkbox" value="${f.nr}"${valdirFlokkar.has(f.nr) ? " checked" : ""}> ${f.nr} ${f.heiti}</label>`).join("");

$("val-flokka").addEventListener("change", () => {
  valdirFlokkar = new Set([...$("val-flokka").querySelectorAll("input:checked")].map((i) => Number(i.value)));
  geymsla.skrifa("valdir", [...valdirFlokkar]);
  uppfaeraValInfo();
});

$("fjoldi").value = String(geymsla.lesa("fjoldi", 20));
$("fjoldi").addEventListener("change", () => geymsla.skrifa("fjoldi", Number($("fjoldi").value)));

function merkiIVali() {
  return MERKI.filter((m) => valdirFlokkar.has(m.flokkur));
}

function uppfaeraValInfo() {
  const n = merkiIVali().length;
  const tomt = n === 0;
  $("val-info").textContent = tomt
    ? "Veldu að minnsta kosti einn flokk."
    : `${n} merki í ${valdirFlokkar.size} flokk${valdirFlokkar.size === 1 ? "i" : "um"}.`;
  for (const b of $("leikjaval").children) b.disabled = tomt;
}

function synaLeikjaval() {
  for (const teg of Object.keys(LEIKJAHEITI)) {
    const best = geymsla.lesa("best:" + teg, null);
    $("best-" + teg).textContent = best === null ? "" : `Besti árangur: ${best}%`;
  }
  uppfaeraValInfo();
  synaSkja("leikir");
}

$("leikjaval").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  const pottur = merkiIVali();
  if (!pottur.length) return;
  const fjoldi = Number($("fjoldi").value);
  hefjaLeik(b.dataset.leikur, stokka(pottur).slice(0, fjoldi || pottur.length));
});

/* ---------- Leikur ---------- */

let leikur = null;

function hefjaLeik(tegund, merki, aefing = false) {
  leikur = {
    tegund,
    aefing,
    spurningar: merki.map((m) => ({
      merki: m,
      gerd: tegund === "blandad" ? stokka(["flokkur", "merking", "finna"])[0] : tegund,
    })),
    nr: 0,
    stig: 0,
    villur: [],
    svarad: false,
    buinn: false,
  };
  synaSkja("leikur");
  synaSpurningu();
}

// Velur þrjá ranga kosti, helst úr sama flokki svo spurningin sé ekki of auðveld.
function rangirKostir(m) {
  const sami = stokka(MERKI.filter((x) => x.flokkur === m.flokkur && x.id !== m.id));
  const adrir = stokka(MERKI.filter((x) => x.flokkur !== m.flokkur));
  return [...sami.slice(0, 2), ...adrir].slice(0, 3);
}

function synaSpurningu() {
  const { spurningar, nr } = leikur;
  const sp = spurningar[nr];
  const m = sp.merki;
  leikur.svarad = false;

  $("framvinda").textContent = `Spurning ${nr + 1} af ${spurningar.length}`;
  $("stig").textContent = `${leikur.stig} rétt`;
  $("progress-bar").style.width = `${(nr / spurningar.length) * 100}%`;
  $("endurgjof").classList.add("hidden");

  const stort = $("merki-stort");
  const svor = $("svor");
  svor.className = "svor";

  if (sp.gerd === "flokkur") {
    $("spurning").textContent = "Í hvaða flokki er þetta merki?";
    stort.className = "merki-stort";
    stort.innerHTML = merkiMynd(m);
    const kostir = flokkarMedMerki.filter((f) => valdirFlokkar.has(f.nr) || f.nr === m.flokkur);
    sp.kostir = kostir.map((f) => ({ gildi: f.nr, html: `${f.nr} ${f.heiti}` }));
    sp.rett = m.flokkur;
  } else if (sp.gerd === "merking") {
    $("spurning").textContent = "Hvað þýðir þetta merki?";
    stort.className = "merki-stort";
    stort.innerHTML = merkiMynd(m);
    sp.kostir = stokka([m, ...rangirKostir(m)]).map((x) => ({ gildi: x.id, html: x.heiti }));
    sp.rett = m.id;
  } else {
    $("spurning").textContent = "Hvert þessara merkja er:";
    stort.className = "merki-stort texti";
    stort.textContent = m.heiti;
    svor.classList.add("myndir");
    sp.kostir = stokka([m, ...rangirKostir(m)]).map((x) => ({
      gildi: x.id,
      html: `<span class="mynd">${merkiMynd(x)}</span>`,
    }));
    sp.rett = m.id;
  }

  svor.innerHTML = sp.kostir.map((k, i) =>
    `<button data-gildi="${k.gildi}"><span class="k">${i + 1}</span>${k.html}</button>`).join("");
}

function svara(gildi) {
  if (!leikur || leikur.svarad) return;
  leikur.svarad = true;
  const sp = leikur.spurningar[leikur.nr];
  const m = sp.merki;
  const rett = String(gildi) === String(sp.rett);

  for (const b of $("svor").children) {
    b.disabled = true;
    if (b.dataset.gildi === String(sp.rett)) b.classList.add("rett");
    else if (b.dataset.gildi === String(gildi)) b.classList.add("rangt");
  }

  if (rett) leikur.stig++;
  else leikur.villur.push({ merki: m, gerd: sp.gerd, svar: gildi });

  const domur = $("dómur");
  domur.textContent = rett ? "Rétt!" : "Ekki rétt";
  domur.className = "verdict " + (rett ? "ok" : "bad");

  const f = FLOKKUR[m.flokkur];
  let skyring = `${m.heiti} – ${flokksHeiti(m.flokkur)}. ${m.lysing}`;
  if (sp.gerd === "flokkur") skyring += ` (${f.heiti}: ${f.utlit})`;
  $("skyring").textContent = skyring;

  $("stig").textContent = `${leikur.stig} rétt`;
  $("endurgjof").classList.remove("hidden");
  $("btn-naesta").focus();
}

$("svor").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (b) svara(b.dataset.gildi);
});

function naesta() {
  if (!leikur || !leikur.svarad) return;
  leikur.nr++;
  if (leikur.nr >= leikur.spurningar.length) ljuka();
  else synaSpurningu();
}

$("btn-naesta").addEventListener("click", naesta);
$("btn-haetta").addEventListener("click", () => { leikur = null; synaLeikjaval(); });

function ljuka() {
  leikur.buinn = true;
  const { stig, spurningar, villur, tegund } = leikur;
  const hlutfall = Math.round((stig / spurningar.length) * 100);
  $("progress-bar").style.width = "100%";
  $("lokastig").textContent = `${stig} af ${spurningar.length} rétt (${hlutfall}%)`;

  const lykill = "best:" + tegund;
  const fyrra = geymsla.lesa(lykill, null);
  if (leikur.aefing) {
    $("lokabest").textContent = "Æfingaumferð á villum – árangur er ekki skráður.";
  } else if (spurningar.length >= 10 && (fyrra === null || hlutfall > fyrra)) {
    geymsla.skrifa(lykill, hlutfall);
    $("lokabest").textContent = fyrra === null ? "Fyrsti skráði árangur í þessum leik." : `Nýtt met! Fyrra besta var ${fyrra}%.`;
  } else {
    $("lokabest").textContent = fyrra === null ? "Árangur er skráður þegar spurningarnar eru 10 eða fleiri." : `Besti árangur: ${fyrra}%.`;
  }

  $("villur").innerHTML = villur.length
    ? `<h3>Þetta þarftu að skoða betur</h3>` + villur.map((v) => {
        const m = v.merki;
        let ath = "";
        if (v.gerd === "flokkur") ath = `Þú valdir ${flokksHeiti(Number(v.svar))}.`;
        else {
          const valid = MERKI.find((x) => x.id === v.svar);
          ath = `Þú valdir „${valid ? valid.heiti : v.svar}“.`;
        }
        return `<div class="villa"><span class="mynd">${merkiMynd(m)}</span>
          <div><p><strong>${m.heiti}</strong> · ${flokksHeiti(m.flokkur)}</p>
          <p>${m.lysing}</p><p class="ath">${ath}</p></div></div>`;
      }).join("")
    : `<p class="hint" style="text-align:center">Engin villa – vel gert!</p>`;

  $("btn-aefa-villur").classList.toggle("hidden", villur.length === 0);
  synaSkja("lok");
}

$("btn-aefa-villur").addEventListener("click", () => {
  const merki = [...new Map(leikur.villur.map((v) => [v.merki.id, v.merki])).values()];
  hefjaLeik(leikur.tegund, stokka(merki), true);
});
$("btn-aftur").addEventListener("click", () => $("leikjaval").querySelector(`[data-leikur="${leikur.tegund}"]`).click());
$("btn-val").addEventListener("click", synaLeikjaval);

/* ---------- Lyklaborð ---------- */

document.addEventListener("keydown", (e) => {
  if ($("screen-leikur").classList.contains("hidden") || !leikur) return;
  if (e.key === "Enter" && leikur.svarad) {
    e.preventDefault();
    naesta();
    return;
  }
  const n = Number(e.key);
  if (n >= 1 && !leikur.svarad) {
    const b = $("svor").children[n - 1];
    if (b) svara(b.dataset.gildi);
  }
});

/* ---------- Ræsing ---------- */

teiknaFlokka();
synaSkja("laera");
