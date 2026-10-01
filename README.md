# Orðaleikur

Vafraleikur til að æfa íslenskan orðaforða og stafsetningu, byggður á
MÍNO-tíðnilistanum (`data/MINO_frequency_list_1_0.tsv`).

## Útgáfa 1 – Sjá, fela, skrifa

1. Veldu erfiðleikastig (bil í tíðnilistanum – því hærra sæti, því sjaldgæfara orð),
   orðflokka og fjölda orða.
2. Ýttu á **bilslá** til að birta orðið – klukkan fer af stað.
3. Ýttu á **bilslá** eða **örvatakka** (eða pikkaðu á orðið) til að fela það – klukkan stoppar.
4. Skrifaðu orðið og ýttu á **bilslá** til að svara. Næsta bilslá birtir strax næsta orð.
5. Rétt stafsett orð gefur `max(10, 1000 − ms/4)` stig, þ.e. því styttri tíma sem
   orðið sást, því fleiri stig. Rangt svar gefur 0 stig.

Besta skor fyrir hvert tíðnibil er geymt í `localStorage`.

## Keyrsla

Engin uppsetning – opnaðu `index.html` í vafra (eða keyrðu t.d.
`python3 -m http.server` og farðu á http://localhost:8000).

## Orðalisti

`js/words.js` er búinn til úr TSV-skránni:

```sh
python3 scripts/build_words.py
```

Skriftan sleppir skammstöfunum, rómverskum tölum, stökum bókstöfum og liðum
á borð við „a-liður“.
