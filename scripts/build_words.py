#!/usr/bin/env python3
"""Býr til js/words.js úr MÍNO-tíðnilistanum (data/MINO_frequency_list_1_0.tsv).

Keyrsla:  python3 scripts/build_words.py
"""
import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "data" / "MINO_frequency_list_1_0.tsv"
OUT = ROOT / "js" / "words.js"

# Aðeins íslenskir bókstafir, mögulega með bandstriki inni í orði
# (t.d. „rómversk-kaþólskur“), en ekki „a-liður“, „hæstv.“, „ii.“ o.s.frv.
VALID = re.compile(r"^[a-záéíóúýþæöð]{2,}(-[a-záéíóúýþæöð]{2,})*$")


def main():
    words = []
    skipped = []
    with SRC.open(encoding="utf-8") as f:
        reader = csv.reader(f, delimiter="\t")
        next(reader)  # haus
        for rank, lemma, pos, count in reader:
            if VALID.match(lemma):
                words.append([int(rank), lemma, pos])
            else:
                skipped.append(lemma)

    body = ",\n".join(json.dumps(w, ensure_ascii=False) for w in words)
    OUT.write_text(
        "// Sjálfvirkt búið til með scripts/build_words.py – ekki breyta handvirkt.\n"
        "// Heimild: MÍNO-tíðnilisti 1.0. Snið: [tíðnisæti, lemma, orðflokkur]\n"
        f"const WORDS = [\n{body}\n];\n",
        encoding="utf-8",
    )
    print(f"{len(words)} orð skrifuð í {OUT.relative_to(ROOT)}; {len(skipped)} sleppt: {', '.join(skipped)}")


if __name__ == "__main__":
    main()
