// Umferðarmerki: flokkar, merki og teikningar (SVG, viewBox 0 0 100 100).
// Flokkar fylgja reglugerð nr. 250/2024 um umferðarmerki og notkun þeirra.

const LITUR = {
  raudur: "#c8102e",
  gulur: "#ffd200",
  blar: "#0055a5",
  svartur: "#111111",
  hvitur: "#ffffff",
  grar: "#8a8a8a",
};

/* ---------- Grunnform ---------- */

// Setur tákn (teiknað í 100×100 reit með miðju 50,50) inn í merkið.
function setja(tákn, cx, cy, kvardi) {
  return `<g transform="translate(${cx} ${cy}) scale(${kvardi}) translate(-50 -50)">${tákn}</g>`;
}

const form = {
  vidvorun: (tákn) =>
    `<polygon points="50,11 93,86 7,86" fill="${LITUR.gulur}" stroke="${LITUR.raudur}" stroke-width="9" stroke-linejoin="round"/>` +
    setja(tákn, 50, 62, 0.42),

  bidskylda: () =>
    `<polygon points="7,14 93,14 50,89" fill="${LITUR.gulur}" stroke="${LITUR.raudur}" stroke-width="9" stroke-linejoin="round"/>`,

  stodvun: () => {
    const p = [];
    for (let i = 0; i < 8; i++) {
      const h = (Math.PI / 4) * i + Math.PI / 8;
      p.push(`${(50 + 46 * Math.cos(h)).toFixed(1)},${(50 + 46 * Math.sin(h)).toFixed(1)}`);
    }
    return `<polygon points="${p.join(" ")}" fill="${LITUR.raudur}" stroke="${LITUR.hvitur}" stroke-width="3"/>` +
      `<text x="50" y="59" text-anchor="middle" font-size="26" font-weight="800" fill="${LITUR.hvitur}" font-family="Arial, Helvetica, sans-serif">STOP</text>`;
  },

  adalbraut: (endar) =>
    `<polygon points="50,4 96,50 50,96 4,50" fill="${LITUR.hvitur}" stroke="#444" stroke-width="1.5"/>` +
    `<polygon points="50,18 82,50 50,82 18,50" fill="${LITUR.gulur}"/>` +
    (endar
      ? `<g stroke="${LITUR.svartur}" stroke-width="4"><line x1="27" y1="85" x2="85" y2="27"/><line x1="21" y1="79" x2="79" y2="21"/><line x1="15" y1="73" x2="73" y2="15"/></g>`
      : ""),

  bann: (tákn = "", grunnur = LITUR.gulur) =>
    `<circle cx="50" cy="50" r="42" fill="${grunnur}" stroke="${LITUR.raudur}" stroke-width="11"/>` +
    setja(tákn, 50, 50, 0.6),

  bod: (tákn) =>
    `<circle cx="50" cy="50" r="46" fill="${LITUR.blar}" stroke="${LITUR.hvitur}" stroke-width="2.5"/>` +
    setja(tákn, 50, 50, 0.66),

  ferningur: (tákn, kvardi = 0.7) =>
    `<rect x="5" y="5" width="90" height="90" rx="8" fill="${LITUR.blar}" stroke="${LITUR.hvitur}" stroke-width="3"/>` +
    setja(tákn, 50, 50, kvardi),

  spjald: (texti, staerd = 17) =>
    `<rect x="3" y="28" width="94" height="44" rx="4" fill="${LITUR.hvitur}" stroke="${LITUR.svartur}" stroke-width="3"/>` +
    `<text x="50" y="${50 + staerd * 0.35}" text-anchor="middle" font-size="${staerd}" font-weight="700" fill="${LITUR.svartur}" font-family="Arial, Helvetica, sans-serif">${texti}</text>`,
};

/* ---------- Tákn (teiknuð í 100×100 reit) ---------- */

const ör = (x1, y1, x2, y2, c, b = 12) => {
  // Bein ör frá (x1,y1) til (x2,y2) með oddi.
  const h = Math.atan2(y2 - y1, x2 - x1);
  const L = b * 1.7;
  const bx = x2 - L * Math.cos(h), by = y2 - L * Math.sin(h);
  const px = -Math.sin(h) * b * 1.4, py = Math.cos(h) * b * 1.4;
  return `<line x1="${x1}" y1="${y1}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}" stroke="${c}" stroke-width="${b}"/>` +
    `<polygon points="${x2},${y2} ${(bx + px).toFixed(1)},${(by + py).toFixed(1)} ${(bx - px).toFixed(1)},${(by - py).toFixed(1)}" fill="${c}"/>`;
};

const tákn = {
  beygjaH: (c) =>
    `<path d="M38 95 L38 55 Q38 28 64 28" fill="none" stroke="${c}" stroke-width="13"/>` +
    `<polygon points="62,8 90,28 62,48" fill="${c}"/>`,

  beygjur: (c) =>
    `<path d="M32 98 L32 76 Q32 60 50 52 Q68 44 68 28" fill="none" stroke="${c}" stroke-width="12"/>` +
    `<polygon points="52,30 68,6 84,30" fill="${c}"/>`,

  brekka: (c) =>
    `<polygon points="4,42 4,88 96,88" fill="${c}"/>` +
    `<text x="66" y="50" text-anchor="middle" font-size="28" font-weight="800" fill="${c}" font-family="Arial, sans-serif">10%</text>`,

  threnging: (c) =>
    `<g fill="none" stroke="${c}" stroke-width="10" stroke-linejoin="round"><path d="M28 98 L28 2"/><path d="M78 98 L78 66 L58 38 L58 2"/></g>`,

  hradahindrun: (c) =>
    `<path d="M0 80 L26 80 Q50 26 74 80 L100 80" fill="none" stroke="${c}" stroke-width="11"/>`,

  ojafn: (c) =>
    `<path d="M0 76 L8 76 Q24 40 42 76 Q60 40 78 76 L100 76" fill="none" stroke="${c}" stroke-width="10"/>`,

  bill: (c, x = 50, y = 40, s = 1) =>
    `<g transform="translate(${x} ${y}) scale(${s})">` +
    `<path d="M-32 6 L-26 -10 L-14 -22 L16 -22 L26 -10 L32 6 Z" fill="${c}"/>` +
    `<rect x="-36" y="0" width="72" height="16" rx="4" fill="${c}"/>` +
    `<circle cx="-20" cy="18" r="8" fill="${c}"/><circle cx="20" cy="18" r="8" fill="${c}"/></g>`,

  halka: (c) =>
    tákn.bill(c, 50, 30, 0.9) +
    `<g fill="none" stroke="${c}" stroke-width="5"><path d="M30 52 Q20 66 34 76 Q46 86 34 98"/><path d="M70 52 Q60 66 74 76 Q86 86 74 98"/></g>`,

  steinkast: (c) =>
    tákn.bill(c, 42, 56, 0.85) +
    `<g fill="${c}"><circle cx="80" cy="30" r="6"/><circle cx="90" cy="48" r="5"/><circle cx="74" cy="12" r="4"/><circle cx="92" cy="20" r="4"/></g>`,

  madur: (c, x = 50, y = 0, s = 1) =>
    `<g transform="translate(${x} ${y}) scale(${s})" stroke="${c}" stroke-width="9" stroke-linecap="round" fill="none">` +
    `<circle cx="0" cy="12" r="9" fill="${c}" stroke="none"/>` +
    `<path d="M0 28 L-2 60"/><path d="M0 34 L-16 50"/><path d="M0 34 L16 46"/><path d="M-2 60 L-16 92"/><path d="M-2 60 L14 90"/></g>`,

  gangandi: (c) => tákn.madur(c),

  born: (c) => tákn.madur(c, 34, 6, 0.9) + tákn.madur(c, 70, 26, 0.72),

  hjol: (c, x = 50, y = 50, s = 1) =>
    `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">` +
    `<circle cx="-26" cy="18" r="17"/><circle cx="26" cy="18" r="17"/>` +
    `<path d="M-26 18 L-8 -10 L18 -10 L26 18 M-8 -10 L4 18 L18 -10 M-14 -20 L-2 -20 M18 -10 L14 -24 L24 -26"/>` +
    `</g>`,

  hjolreidar: (c) =>
    tákn.hjol(c, 50, 56, 1) +
    `<g stroke="${c}" stroke-width="8" stroke-linecap="round"><path d="M-2 -6 L8 -38" transform="translate(50 56)"/><path d="M8 -38 L22 -14" transform="translate(50 56)"/></g>` +
    `<circle cx="60" cy="8" r="8" fill="${c}"/>`,

  bufe: (c) =>
    `<g fill="${c}"><ellipse cx="46" cy="50" rx="32" ry="20"/><ellipse cx="84" cy="36" rx="12" ry="9"/>` +
    `<rect x="72" y="36" width="10" height="14"/>` +
    `<rect x="20" y="62" width="8" height="28"/><rect x="34" y="62" width="8" height="28"/><rect x="54" y="62" width="8" height="28"/><rect x="66" y="62" width="8" height="28"/>` +
    `<path d="M80 28 L74 18 L84 26 Z"/></g>`,

  vegavinna: (c) =>
    `<g stroke="${c}" stroke-width="8" stroke-linecap="round" fill="none">` +
    `<path d="M36 40 L46 66"/><path d="M38 46 L58 50 L72 64"/><path d="M46 66 L36 92"/><path d="M46 66 L60 90"/><path d="M38 46 L26 64"/></g>` +
    `<circle cx="34" cy="26" r="9" fill="${c}"/>` +
    `<polygon points="66,92 84,64 100,92" fill="${c}"/>`,

  ljos: () =>
    `<rect x="32" y="2" width="36" height="96" rx="8" fill="${LITUR.svartur}"/>` +
    `<circle cx="50" cy="20" r="11" fill="#e3242b"/><circle cx="50" cy="50" r="11" fill="#f5b400"/><circle cx="50" cy="80" r="11" fill="#1aa64a"/>`,

  tvistefna: (c) => ör(34, 96, 34, 6, c, 11) + ör(66, 4, 66, 94, c, 11),

  hlidarvindur: (c) =>
    `<rect x="8" y="10" width="7" height="88" fill="${c}"/>` +
    `<polygon points="15,14 92,26 92,40 15,52" fill="${c}"/>` +
    `<g stroke="${LITUR.gulur}" stroke-width="5"><line x1="40" y1="16" x2="40" y2="50"/><line x1="66" y1="21" x2="66" y2="45"/></g>`,

  grjothrun: (c) =>
    `<polygon points="0,0 34,0 26,100 0,100" fill="${c}"/>` +
    `<g fill="${c}"><circle cx="50" cy="30" r="8"/><circle cx="62" cy="56" r="10"/><circle cx="48" cy="82" r="7"/><circle cx="78" cy="86" r="9"/></g>`,

  vegamot: (c) =>
    `<rect x="42" y="2" width="16" height="96" fill="${c}"/><rect x="2" y="42" width="96" height="16" fill="${c}"/>`,

  hringtorg: (c) => {
    // Þrjár örvar í hring, rangsælis (eins og ekið er í hringtorgi á Íslandi).
    let s = "";
    for (let i = 0; i < 3; i++) {
      s += `<g transform="rotate(${i * 120} 50 50)">` +
        `<path d="M50 14 A36 36 0 0 0 19 32" fill="none" stroke="${c}" stroke-width="11"/>` +
        `<polygon points="8,24 30,24 17,44" fill="${c}"/></g>`;
    }
    return s;
  },

  upphropun: (c) =>
    `<rect x="42" y="4" width="16" height="64" rx="6" fill="${c}"/><circle cx="50" cy="88" r="10" fill="${c}"/>`,

  tala: (t, c, f = 54) =>
    `<text x="50" y="${50 + f * 0.36}" text-anchor="middle" font-size="${f}" font-weight="800" fill="${c}" font-family="Arial, Helvetica, sans-serif">${t}</text>`,

  vorubill: (c) =>
    `<g fill="${c}"><rect x="2" y="20" width="62" height="46"/><path d="M68 34 L86 34 L98 50 L98 66 L68 66 Z"/>` +
    `<circle cx="20" cy="74" r="10"/><circle cx="48" cy="74" r="10"/><circle cx="84" cy="74" r="10"/></g>`,

  bilarHlidVidHlid: () =>
    tákn.bill(LITUR.raudur, 25, 52, 0.68) + tákn.bill(LITUR.svartur, 75, 52, 0.68),

  skastrik: () =>
    `<line x1="20" y1="20" x2="80" y2="80" stroke="${LITUR.raudur}" stroke-width="11"/>`,

  beygjaV_ör: (c) =>
    `<path d="M62 96 L62 50 Q62 32 44 32 L32 32" fill="none" stroke="${c}" stroke-width="13"/>` +
    `<polygon points="34,12 8,32 34,52" fill="${c}"/>`,

  beygjaH_ör: (c) =>
    `<path d="M38 96 L38 50 Q38 32 56 32 L68 32" fill="none" stroke="${c}" stroke-width="13"/>` +
    `<polygon points="66,12 92,32 66,52" fill="${c}"/>`,

  uBeygja: (c) =>
    `<path d="M66 96 L66 42 Q66 16 46 16 Q26 16 26 42 L26 58" fill="none" stroke="${c}" stroke-width="12"/>` +
    `<polygon points="8,56 44,56 26,84" fill="${c}"/>`,

  haed: (c) =>
    `<polygon points="30,2 70,2 50,18" fill="${c}"/><polygon points="30,98 70,98 50,82" fill="${c}"/>` +
    tákn.tala("3,2 m", c, 26),

  bein_ör: (c) => ör(50, 96, 50, 4, c, 16),

  haegra_megin: (c) => ör(22, 22, 80, 80, c, 15),

  gonguHjol: (c) =>
    `<line x1="8" y1="50" x2="92" y2="50" stroke="${c}" stroke-width="4"/>` +
    setja(tákn.madur(c), 50, 24, 0.42) +
    setja(tákn.hjol(c, 50, 46, 1), 50, 76, 0.45),

  gangbraut: () =>
    `<polygon points="50,8 94,90 6,90" fill="${LITUR.hvitur}"/>` +
    `<g fill="${LITUR.svartur}"><rect x="24" y="80" width="10" height="6"/><rect x="40" y="80" width="10" height="6"/><rect x="56" y="80" width="10" height="6"/><rect x="72" y="80" width="6" height="6"/></g>` +
    setja(tákn.madur(LITUR.svartur), 50, 56, 0.4),

  einstefna: (c) => ör(50, 94, 50, 6, c, 18),

  vistgata: (c, kvardi = 1) =>
    `<polygon points="10,48 26,32 42,48 42,74 10,74" fill="${c}"/>` +
    setja(tákn.madur(c), 60, 54, 0.42) +
    `<circle cx="74" cy="70" r="5" fill="${c}"/>` +
    tákn.bill(c, 72, 86, 0.32) +
    `<rect x="2" y="92" width="96" height="4" fill="${c}"/>`,

  gongugata: (c) => tákn.madur(c, 34, 4, 0.92) + tákn.madur(c, 70, 4, 0.92),

  botngata: () =>
    `<rect x="40" y="34" width="20" height="62" fill="${LITUR.hvitur}"/><rect x="14" y="10" width="72" height="22" fill="${LITUR.raudur}"/>`,

  P: (c) => tákn.tala("P", c, 92),

  myndavel: (c) =>
    `<rect x="6" y="30" width="70" height="44" rx="6" fill="${c}"/><polygon points="76,42 96,30 96,74 76,62" fill="${c}"/>` +
    `<circle cx="40" cy="52" r="13" fill="${LITUR.blar}"/><circle cx="40" cy="52" r="7" fill="${c}"/>`,

  vegvisir: () =>
    `<rect x="2" y="20" width="96" height="60" rx="6" fill="${LITUR.blar}" stroke="${LITUR.hvitur}" stroke-width="3"/>` +
    `<text x="9" y="56" font-size="16" font-weight="700" fill="${LITUR.hvitur}" font-family="Arial, sans-serif">Selfoss 12</text>` +
    `<polygon points="80,40 92,50 80,60" fill="${LITUR.hvitur}"/>`,

  thjonusta: (innra) =>
    `<rect x="5" y="5" width="90" height="90" rx="8" fill="${LITUR.blar}"/>` +
    `<rect x="16" y="16" width="68" height="68" rx="3" fill="${LITUR.hvitur}"/>` +
    setja(innra, 50, 50, 0.6),

  bensin: (c) =>
    `<rect x="18" y="10" width="44" height="84" rx="4" fill="${c}"/><rect x="26" y="20" width="28" height="22" fill="${LITUR.hvitur}"/>` +
    `<path d="M62 30 L78 42 L78 82 Q78 92 70 86" fill="none" stroke="${c}" stroke-width="6"/>`,

  tjald: (c) =>
    `<polygon points="50,8 96,92 4,92" fill="${c}"/><polygon points="50,44 66,92 34,92" fill="${LITUR.hvitur}"/>`,

  upplysingar: (c) =>
    `<circle cx="50" cy="16" r="11" fill="${c}"/><rect x="38" y="34" width="24" height="62" rx="4" fill="${c}"/>`,

  sjukrahus: (c) => tákn.tala("H", c, 96),

  ahugavert: (c) =>
    `<text x="50" y="82" text-anchor="middle" font-size="100" fill="${c}" font-family="Arial, 'Segoe UI Symbol', sans-serif">⌘</text>`,
};

/* ---------- Flokkar ---------- */

const FLOKKAR = [
  {
    nr: 100, heiti: "Viðvörunarmerki", stutt: "Vara við",
    tilgangur: "Vara við hættu eða aðstæðum fram undan sem ökumaður gæti ekki átt von á.",
    utlit: "Jafnhliða þríhyrningur sem stendur á grunnlínu (oddur upp), rauður kantur og gulur grunnur, svart tákn.",
    rad: "Hægðu á, horfðu vel í kringum þig og vertu tilbúin(n) að bregðast við.",
    daemi: () => form.vidvorun(tákn.upphropun(LITUR.svartur)),
  },
  {
    nr: 200, heiti: "Forgangsmerki", stutt: "Forgangur",
    tilgangur: "Segja til um hver á forgang (réttinn) á vegamótum og á þröngum vegarköflum.",
    utlit: "Sérstök lögun svo þau þekkist líka aftan frá eða undir snjó: biðskylda er þríhyrningur á hvolfi, stöðvunarskylda átthyrningur og aðalbraut gulur tígull.",
    rad: "Lögunin ein segir þér oft hvaða merki þetta er.",
    daemi: () => form.bidskylda(),
  },
  {
    nr: 300, heiti: "Bannmerki", stutt: "Banna",
    tilgangur: "Banna tiltekna umferð eða athöfn, t.d. innakstur, beygju, framúrakstur, eða setja hámark á hraða, hæð eða þyngd.",
    utlit: "Kringlótt með rauðum kanti og gulum grunni. Merki sem banna stöðvun eða lagningu eru með bláum grunni.",
    rad: "Rauður hringur = eitthvað er bannað.",
    daemi: () => form.bann(),
  },
  {
    nr: 400, heiti: "Boðmerki", stutt: "Skylda",
    tilgangur: "Segja hvað þú skalt gera – t.d. aka í ákveðna átt, fara hægra megin eða nota tiltekinn stíg.",
    utlit: "Kringlótt, blár grunnur og hvítt tákn.",
    rad: "Blár hringur = þetta áttu að gera.",
    daemi: () => form.bod(tákn.bein_ör(LITUR.hvitur)),
  },
  {
    nr: 500, heiti: "Sérreglumerki", stutt: "Sérreglur",
    tilgangur: "Gefa bindandi fyrirmæli um að sérstakar reglur gildi á staðnum, á svæðinu eða á akreininni, t.d. gangbraut, einstefna, vistgata og göngugata.",
    utlit: "Yfirleitt ferhyrnd með bláum grunni og hvítu tákni.",
    rad: "Þegar þú ferð inn á svæðið gilda sérreglurnar þar til merki sýnir að þær endi.",
    daemi: () => form.ferningur(tákn.gangbraut(), 0.86),
  },
  {
    nr: 600, heiti: "Upplýsingamerki", stutt: "Upplýsingar",
    tilgangur: "Veita upplýsingar sem auðvelda umferðina, t.d. að gata sé botngata eða að þar sé bifreiðastæði.",
    utlit: "Ferhyrnd, oftast með bláum grunni.",
    rad: "Þau banna ekkert og skylda ekkert – þau upplýsa.",
    daemi: () => form.ferningur(tákn.botngata(), 0.86),
  },
  {
    nr: 700, heiti: "Vegvísar og þjónustumerki", stutt: "Vegvísun",
    tilgangur: "Vísa veginn til staða og benda á þjónustu, t.d. bensínstöð, tjaldsvæði eða upplýsingamiðstöð.",
    utlit: "Rétthyrnd. Þjónustumerki eru blá með hvítum reit og svörtu tákni.",
    rad: "Merkið ⌘ vísar á áhugaverðan stað.",
    daemi: () => tákn.thjonusta(tákn.tjald(LITUR.svartur)),
  },
  {
    nr: 800, heiti: "Undirmerki", stutt: "Undirmerki",
    tilgangur: "Spjald undir öðru merki sem skýrir það nánar eða takmarkar það – t.d. fjarlægð, gildistíma eða hvers konar hætta er fram undan.",
    utlit: "Rétthyrnt spjald með texta eða tákni, alltaf sett með öðru merki.",
    rad: "Lestu alltaf undirmerkið með aðalmerkinu.",
    daemi: () => form.spjald("150 m", 26),
  },
  {
    nr: 900, heiti: "Önnur merki", stutt: "Önnur",
    tilgangur: "Ýmis önnur merki og búnaður sem ekki falla í hina flokkana.",
    utlit: "Margvíslegt útlit.",
    rad: "Þessi flokkur er ekki í leikjunum.",
    daemi: null,
  },
];

/* ---------- Merki ---------- */
// nr er aðeins skráð þar sem númerið hefur verið staðfest.

const S = LITUR.svartur, H = LITUR.hvitur;

const MERKI = [
  // 100 Viðvörunarmerki
  { id: "beygja", flokkur: 100, nr: "100", heiti: "Hættuleg beygja",
    lysing: "Fram undan er hættuleg beygja. Örin sýnir í hvaða átt vegurinn beygir.",
    svg: () => form.vidvorun(tákn.beygjaH(S)) },
  { id: "beygjur", flokkur: 100, nr: "102", heiti: "Hættulegar beygjur",
    lysing: "Fram undan eru tvær eða fleiri hættulegar beygjur. Fyrsta beygjan er í þá átt sem örin byrjar.",
    svg: () => form.vidvorun(tákn.beygjur(S)) },
  { id: "brekka", flokkur: 100, nr: "104", heiti: "Brött brekka",
    lysing: "Fram undan er brött brekka. Talan sýnir hallann í prósentum.",
    svg: () => form.vidvorun(tákn.brekka(S)) },
  { id: "threnging", flokkur: 100, heiti: "Vegur þrengist",
    lysing: "Vegurinn mjókkar fram undan, hér frá hægri.",
    svg: () => form.vidvorun(tákn.threnging(S)) },
  { id: "hradahindrun", flokkur: 100, heiti: "Hraðahindrun",
    lysing: "Fram undan er hraðahindrun (hryggur) á veginum. Hægðu á.",
    svg: () => form.vidvorun(tákn.hradahindrun(S)) },
  { id: "ojafn", flokkur: 100, heiti: "Ójafn vegur",
    lysing: "Fram undan er ójafn vegur, t.d. holur eða hæðir.",
    svg: () => form.vidvorun(tákn.ojafn(S)) },
  { id: "halka", flokkur: 100, heiti: "Hálka",
    lysing: "Hætta á að vegurinn sé háll, t.d. vegna ísingar eða bleytu.",
    svg: () => form.vidvorun(tákn.halka(S)) },
  { id: "steinkast", flokkur: 100, heiti: "Steinkast",
    lysing: "Hætta á að steinar eða möl kastist upp undan bílum. Hægðu á og haltu fjarlægð.",
    svg: () => form.vidvorun(tákn.steinkast(S)) },
  { id: "gangbraut-fram", flokkur: 100, nr: "140", heiti: "Gangbraut fram undan",
    lysing: "Varar við að gangbraut sé fram undan.",
    svg: () => form.vidvorun(tákn.gangandi(S)) },
  { id: "born", flokkur: 100, heiti: "Börn",
    lysing: "Varar við að börn séu oft á eða við veginn, t.d. nálægt skóla eða leiksvæði.",
    svg: () => form.vidvorun(tákn.born(S)) },
  { id: "hjolreidar-vid", flokkur: 100, heiti: "Hjólreiðafólk",
    lysing: "Varar við að hjólreiðafólk fari oft yfir eða inn á veginn.",
    svg: () => form.vidvorun(tákn.hjolreidar(S)) },
  { id: "bufe", flokkur: 100, heiti: "Búfé",
    lysing: "Hætta á að búfé, t.d. kindur, hross eða kýr, sé á veginum.",
    svg: () => form.vidvorun(tákn.bufe(S)) },
  { id: "vegavinna", flokkur: 100, heiti: "Vegavinna",
    lysing: "Fram undan er unnið við veginn. Hægðu á og fylgdu merkingum.",
    svg: () => form.vidvorun(tákn.vegavinna(S)) },
  { id: "ljos", flokkur: 100, heiti: "Umferðarljós",
    lysing: "Fram undan eru umferðarljós sem ökumaður gæti ekki átt von á.",
    svg: () => form.vidvorun(tákn.ljos()) },
  { id: "tvistefna", flokkur: 100, heiti: "Umferð úr báðum áttum",
    lysing: "Fram undan er umferð í báðar áttir, t.d. þegar einstefnu lýkur.",
    svg: () => form.vidvorun(tákn.tvistefna(S)) },
  { id: "vindur", flokkur: 100, heiti: "Hliðarvindur",
    lysing: "Hætta á sterkum hliðarvindi, t.d. á brúm eða undir fjöllum.",
    svg: () => form.vidvorun(tákn.hlidarvindur(S)) },
  { id: "grjothrun", flokkur: 100, heiti: "Grjóthrun",
    lysing: "Hætta á að grjót falli úr hlíðinni ofan á veginn eða liggi á honum.",
    svg: () => form.vidvorun(tákn.grjothrun(S)) },
  { id: "vegamot", flokkur: 100, heiti: "Vegamót",
    lysing: "Fram undan eru vegamót þar sem almenna reglan gildir: umferð frá hægri á forgang.",
    svg: () => form.vidvorun(tákn.vegamot(S)) },
  { id: "hringtorg-fram", flokkur: 100, heiti: "Hringtorg fram undan",
    lysing: "Varar við að hringtorg sé fram undan.",
    svg: () => form.vidvorun(tákn.hringtorg(S)) },
  { id: "onnur-haetta", flokkur: 100, nr: "156", heiti: "Önnur hætta",
    lysing: "Varar við hættu sem ekkert annað viðvörunarmerki á við. Oft er undirmerki sem segir hver hættan er.",
    svg: () => form.vidvorun(tákn.upphropun(S)) },

  // 200 Forgangsmerki
  { id: "bidskylda", flokkur: 200, nr: "202", heiti: "Biðskylda",
    lysing: "Þú skalt veita umferð á veginum sem þú ekur inn á eða yfir forgang. Stöðvaðu ef þarf.",
    svg: () => form.bidskylda() },
  { id: "stodvunarskylda", flokkur: 200, heiti: "Stöðvunarskylda",
    lysing: "Þú skalt nema alveg staðar við stöðvunarlínu og veita umferð á veginum forgang áður en ekið er af stað.",
    svg: () => form.stodvun() },
  { id: "adalbraut", flokkur: 200, nr: "206", heiti: "Aðalbraut",
    lysing: "Þú ekur á aðalbraut. Umferð frá hliðarvegum skal veita þér forgang.",
    svg: () => form.adalbraut(false) },
  { id: "adalbraut-endar", flokkur: 200, nr: "208", heiti: "Aðalbraut endar",
    lysing: "Aðalbrautin endar. Þú átt ekki lengur forgang umfram umferð frá hliðarvegum.",
    svg: () => form.adalbraut(true) },
  { id: "vikja-moti", flokkur: 200, heiti: "Skylt að víkja fyrir umferð á móti",
    lysing: "Á þröngum vegarkafla skalt þú veita umferð sem kemur á móti forgang (rauða örin er þín átt).",
    svg: () => form.bann(ör(70, 96, 70, 6, LITUR.raudur, 12) + ör(30, 4, 30, 94, S, 12)) },
  { id: "forgangur-moti", flokkur: 200, heiti: "Forgangur gagnvart umferð á móti",
    lysing: "Á þröngum vegarkafla átt þú forgang; umferð sem kemur á móti skal víkja (rauða örin).",
    svg: () => form.ferningur(ör(68, 96, 68, 6, H, 12) + ör(32, 4, 32, 94, LITUR.raudur, 12), 0.68) },

  // 300 Bannmerki
  { id: "innakstur-bannadur", flokkur: 300, nr: "302", heiti: "Innakstur bannaður",
    lysing: "Bannað er að aka inn á veginn eða götuna, á við öll ökutæki, líka reiðhjól.",
    svg: () => `<circle cx="50" cy="50" r="46" fill="${LITUR.raudur}"/><rect x="16" y="41" width="68" height="18" fill="${H}"/>` },
  { id: "allur-akstur", flokkur: 300, nr: "306", heiti: "Allur akstur bannaður",
    lysing: "Öll umferð ökutækja er bönnuð í báðar áttir.",
    svg: () => form.bann() },
  { id: "vinstri-beygja", flokkur: 300, heiti: "Vinstri beygja bönnuð",
    lysing: "Bannað er að beygja til vinstri á næstu vegamótum.",
    svg: () => form.bann(tákn.beygjaV_ör(S) + tákn.skastrik()) },
  { id: "haegri-beygja", flokkur: 300, heiti: "Hægri beygja bönnuð",
    lysing: "Bannað er að beygja til hægri á næstu vegamótum.",
    svg: () => form.bann(tákn.beygjaH_ör(S) + tákn.skastrik()) },
  { id: "u-beygja", flokkur: 300, heiti: "Bannað að snúa við",
    lysing: "Bannað er að taka U-beygju (snúa við).",
    svg: () => form.bann(tákn.uBeygja(S) + tákn.skastrik()) },
  { id: "framurakstur", flokkur: 300, heiti: "Framúrakstur bannaður",
    lysing: "Bannað er að aka fram úr öðrum vélknúnum ökutækjum en bifhjólum á tveimur hjólum.",
    svg: () => form.bann(tákn.bilarHlidVidHlid()) },
  { id: "hamarkshradi", flokkur: 300, nr: "362", heiti: "Sérstök takmörkun hámarkshraða",
    lysing: "Hámarkshraði er sá sem talan sýnir í km á klst., hér 50 km/klst.",
    svg: () => form.bann(tákn.tala("50", S, 58)) },
  { id: "stodvun-bonnud", flokkur: 300, heiti: "Bannað að stöðva",
    lysing: "Bannað er að stöðva ökutæki, nema til að hleypa farþegum inn eða út í skamma stund.",
    svg: () => `<circle cx="50" cy="50" r="42" fill="${LITUR.blar}" stroke="${LITUR.raudur}" stroke-width="11"/>` +
      `<g stroke="${LITUR.raudur}" stroke-width="11"><line x1="22" y1="22" x2="78" y2="78"/><line x1="78" y1="22" x2="22" y2="78"/></g>` },
  { id: "lagning-bonnud", flokkur: 300, heiti: "Bannað að leggja",
    lysing: "Bannað er að leggja ökutæki, en stöðva má í stutta stund til að hleypa fólki inn eða út eða ferma og afferma.",
    svg: () => `<circle cx="50" cy="50" r="42" fill="${LITUR.blar}" stroke="${LITUR.raudur}" stroke-width="11"/>` +
      `<line x1="22" y1="22" x2="78" y2="78" stroke="${LITUR.raudur}" stroke-width="11"/>` },
  { id: "hjol-bonnud", flokkur: 300, heiti: "Hjólreiðar bannaðar",
    lysing: "Bannað er að hjóla hér.",
    svg: () => form.bann(tákn.hjol(S, 50, 44, 1)) },
  { id: "gangandi-bannad", flokkur: 300, heiti: "Umferð gangandi bönnuð",
    lysing: "Gangandi vegfarendur mega ekki fara hér um.",
    svg: () => form.bann(tákn.gangandi(S)) },
  { id: "vorubilar-bannadir", flokkur: 300, heiti: "Umferð vörubifreiða bönnuð",
    lysing: "Vörubifreiðum er bannað að aka hér.",
    svg: () => form.bann(tákn.vorubill(S)) },
  { id: "haed", flokkur: 300, heiti: "Takmörkuð hæð",
    lysing: "Bannað er að aka ökutæki sem er hærra en talan sýnir (með farmi), t.d. undir brú eða í göng.",
    svg: () => form.bann(tákn.haed(S)) },
  { id: "thyngd", flokkur: 300, heiti: "Takmörkuð heildarþyngd",
    lysing: "Bannað er að aka ökutæki sem er þyngra en talan sýnir, t.d. yfir veikburða brú.",
    svg: () => form.bann(tákn.tala("10t", S, 46)) },

  // 400 Boðmerki
  { id: "akstursstefna", flokkur: 400, nr: "402", heiti: "Akstursstefna",
    lysing: "Skylt er að aka í þá átt sem örin sýnir, hér beint áfram.",
    svg: () => form.bod(tákn.bein_ör(H)) },
  { id: "beygja-haegri-skylt", flokkur: 400, heiti: "Skylt að beygja til hægri",
    lysing: "Skylt er að beygja til hægri.",
    svg: () => form.bod(tákn.beygjaH_ör(H)) },
  { id: "haegra-megin", flokkur: 400, heiti: "Skylt að aka hægra megin við merkið",
    lysing: "Aka skal þeim megin við merkið (t.d. umferðareyju) sem örin vísar á.",
    svg: () => form.bod(tákn.haegra_megin(H)) },
  { id: "hringtorg", flokkur: 400, heiti: "Hringtorg",
    lysing: "Þú ekur inn í hringtorg. Aka skal í þá átt sem örvarnar sýna.",
    svg: () => form.bod(tákn.hringtorg(H)) },
  { id: "gongustigur", flokkur: 400, heiti: "Göngustígur",
    lysing: "Stígur ætlaður gangandi vegfarendum.",
    svg: () => form.bod(tákn.gangandi(H)) },
  { id: "hjolastigur", flokkur: 400, heiti: "Hjólastígur",
    lysing: "Stígur ætlaður hjólreiðum.",
    svg: () => form.bod(tákn.hjol(H, 50, 44, 1)) },
  { id: "gongu-hjolastigur", flokkur: 400, heiti: "Göngu- og hjólastígur",
    lysing: "Stígur sem gangandi og hjólandi deila – hér skipt þannig að gangandi eru öðrum megin og hjólandi hinum megin.",
    svg: () => form.bod(tákn.gonguHjol(H)) },

  // 500 Sérreglumerki
  { id: "gangbraut", flokkur: 500, nr: "516", heiti: "Gangbraut",
    lysing: "Hér er gangbraut þar sem gangandi fara yfir akbrautina. Ökumaður skal veita gangandi á gangbrautinni forgang.",
    svg: () => form.ferningur(tákn.gangbraut(), 0.86) },
  { id: "einstefna", flokkur: 500, nr: "526", heiti: "Einstefna",
    lysing: "Aðeins má aka í þá átt sem örin sýnir.",
    svg: () => form.ferningur(tákn.einstefna(H), 0.72) },
  { id: "vistgata", flokkur: 500, nr: "540", heiti: "Vistgata",
    lysing: "Þú ekur inn á vistgötu: gangandi eiga forgang, leikir eru leyfðir og ekki má aka hraðar en 15 km/klst.",
    svg: () => form.ferningur(tákn.vistgata(H), 0.8) },
  { id: "vistgata-endar", flokkur: 500, nr: "542", heiti: "Vistgata endar",
    lysing: "Þú ekur út af svæði þar sem reglur um vistgötu gilda.",
    svg: () => form.ferningur(tákn.vistgata(H), 0.8) +
      `<line x1="12" y1="88" x2="88" y2="12" stroke="${LITUR.raudur}" stroke-width="7"/>` },
  { id: "gongugata", flokkur: 500, nr: "548", heiti: "Göngugata",
    lysing: "Gata ætluð gangandi. Akstur er aðeins leyfður samkvæmt sérstökum reglum og aldrei hraðar en 10 km/klst.",
    svg: () => form.ferningur(tákn.gongugata(H), 0.78) },

  // 600 Upplýsingamerki
  { id: "botngata", flokkur: 600, heiti: "Botngata",
    lysing: "Gatan er lokuð í annan endann – það er ekki hægt að aka í gegn.",
    svg: () => form.ferningur(tákn.botngata(), 0.86) },
  { id: "bifreidastaedi", flokkur: 600, heiti: "Bifreiðastæði",
    lysing: "Hér er bifreiðastæði. Undirmerki geta sagt til um tímatakmörk eða hverjir megi leggja.",
    svg: () => form.ferningur(tákn.P(H), 0.8) },
  { id: "hradamyndavel", flokkur: 600, heiti: "Sjálfvirkt hraðaeftirlit",
    lysing: "Hraði er mældur með myndavél á þessum vegarkafla.",
    svg: () => form.ferningur(tákn.myndavel(H), 0.72) },

  // 700 Vegvísar og þjónustumerki
  { id: "vegvisir", flokkur: 700, heiti: "Vegvísir",
    lysing: "Vísar á stað og segir hve marga kílómetra er þangað.",
    svg: () => tákn.vegvisir() },
  { id: "bensinstod", flokkur: 700, heiti: "Bensínstöð",
    lysing: "Þjónustumerki: eldsneytisstöð er fram undan eða við veginn.",
    svg: () => tákn.thjonusta(tákn.bensin(S)) },
  { id: "tjaldsvaedi", flokkur: 700, heiti: "Tjaldsvæði",
    lysing: "Þjónustumerki: tjaldsvæði.",
    svg: () => tákn.thjonusta(tákn.tjald(S)) },
  { id: "upplysingar", flokkur: 700, heiti: "Upplýsingar",
    lysing: "Þjónustumerki: upplýsingar fyrir ferðafólk.",
    svg: () => tákn.thjonusta(tákn.upplysingar(S)) },
  { id: "sjukrahus", flokkur: 700, heiti: "Sjúkrahús",
    lysing: "Þjónustumerki: sjúkrahús.",
    svg: () => tákn.thjonusta(tákn.sjukrahus(S)) },
  { id: "ahugaverdur-stadur", flokkur: 700, heiti: "Áhugaverður staður",
    lysing: "Vísar á áhugaverðan stað, t.d. náttúruperlu eða sögustað.",
    svg: () => form.ferningur(tákn.ahugavert(H), 0.8) },

  // 800 Undirmerki
  { id: "blindhaed", flokkur: 800, nr: "850", heiti: "Blindhæð",
    lysing: "Notað með viðvörunarmerki þar sem hæð takmarkar útsýni yfir veginn. Haltu þig vel hægra megin.",
    svg: () => form.spjald("Blindhæð", 19) },
  { id: "einbreid-bru", flokkur: 800, nr: "854.2", heiti: "Einbreið brú",
    lysing: "Fram undan er einbreið brú – aðeins eitt ökutæki kemst yfir í einu.",
    svg: () => form.spjald("Einbreið brú", 15) },
  { id: "fjarlaegd", flokkur: 800, heiti: "Fjarlægð",
    lysing: "Segir hve langt er að því sem aðalmerkið á við.",
    svg: () => form.spjald("150 m", 26) },
  { id: "lengd", flokkur: 800, heiti: "Lengd vegarkafla",
    lysing: "Segir á hve löngum vegarkafla aðalmerkið gildir.",
    svg: () => form.spjald("↕ 2 km", 24) },
  { id: "timi", flokkur: 800, heiti: "Gildistími",
    lysing: "Aðalmerkið gildir aðeins á þeim tíma sem sýndur er, hér kl. 8–18.",
    svg: () => form.spjald("8–18", 26) },
];

function teikna(svgInnihald, titill = "") {
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${titill}">${svgInnihald}</svg>`;
}
