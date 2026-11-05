"""Build data files for the SUAText and SUAEtym example pages.

Usage: python3 tools/build_demo_data.py CLDF_DIR SITE_ASSETS_DIR
  CLDF_DIR: the cldf/ folder of SUALEX-Data (needs suatext/ and nawalex-lastra/)
"""
import csv, json, os, sys
from collections import defaultdict, OrderedDict

cl, out = sys.argv[1], sys.argv[2]
R = lambda p: list(csv.DictReader(open(p, encoding="utf-8")))
def dump(obj, p):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    json.dump(obj, open(p, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))

# ---- SUAText: texts and lines from cldf/suatext
texts = []
lines = defaultdict(list)
for r in R(f"{cl}/suatext/examples.csv"):
    lines[r["Contribution_ID"]].append([
        int(r["Line_Number"]), r["Section"], r["Primary_Text"],
        r["Analyzed_Word"].split("\t"), r["Gloss"].split("\t"),
        r["Translation_Spanish"], r["Translated_Text"], r["Translation_German"], r["Comment"]])
for c in R(f"{cl}/suatext/contributions.csv"):
    texts.append(dict(id=c["ID"], n=c["Number"], de=c["Title_German"], en=c["Title_English"], es=c["Title_Spanish"],
                      orig=c["Title_Original"], desc=c["Description"], narr=c["Narrator"], nb=c["Notebook"],
                      atu=c["ATU_Draft"], bz=c["Berezkin_Codes"], src=c["Source_Text"], pages=c["Source_Pages"],
                      lines=sorted(lines[c["ID"]])))
abbr = {r["ID"]: r["Description"] for r in R(f"{cl}/suatext/glossabbreviations.csv")}
dump(dict(T=texts, A=abbr), f"{out}/suatext/data.json")

# ---- SUAEtym: cognate sets with reconstructions in the Lastra database
L = {r["ID"]: r for r in R(f"{cl}/nawalex-lastra/languages.csv")}
P = {r["ID"]: r for r in R(f"{cl}/nawalex-lastra/parameters.csv")}
F = {r["ID"]: r for r in R(f"{cl}/nawalex-lastra/forms.csv")}
members = defaultdict(list)
for r in R(f"{cl}/nawalex-lastra/cognates.csv"):
    members[r["Cognateset_ID"]].append(r["Form_ID"])
glosses = defaultdict(set)   # gloss notes written on the proto rows
for f in F.values():
    if L[f["Language_ID"]]["Is_Proto"] == "true" and f["Comment"]:
        for letter in f["Cognacy"].replace("+", " ").split():
            glosses[f["Parameter_ID"] + "-" + letter.rstrip("?")[:1]].add(f["Comment"].split(";")[0].strip())
LEVELS = ["PSUA", "PCN", "PPN", "PN", "PEN", "PWN"]
order = lambda x: LEVELS.index(x[0]) if x[0] in LEVELS else 99
entries = OrderedDict()
for cs in R(f"{cl}/nawalex-lastra/cognatesets.csv"):
    if not cs["Reconstructions"]:
        continue
    rec = []
    for part in cs["Reconstructions"].split(";"):
        lvl, _, form = part.strip().partition(" ")
        if [lvl, form] not in rec:
            rec.append([lvl, form])
    rec.sort(key=order)
    key = " ".join(f for l, f in rec if l == "PN") or " ".join(f for l, f in rec)
    p = P[cs["Parameter_ID"]]
    refl = []
    for fid in members[cs["ID"]]:
        f = F[fid]; l = L[f["Language_ID"]]
        if l["Is_Proto"] == "true":
            continue
        refl.append([l["ID"], l["Name"], (l["Dialect_Region"] or "").split(",")[0].strip(), f["Form"], f["Cognacy"]])
    e = entries.setdefault(key, dict(k=key, rec=[], senses=[]))
    for x in rec:
        if x not in e["rec"]:
            e["rec"].append(x)
    e["senses"].append(dict(c=p["Lastra_Number"], en=p["Name"], es=p["Spanish"], set=cs["ID"],
                            g=sorted(glosses.get(cs["ID"], [])), refl=refl))
for e in entries.values():
    e["rec"].sort(key=order)
dump(dict(E=list(entries.values()), LV={k: L[k]["Name"] for k in LEVELS if k in L}), f"{out}/suaetym/data.json")
print(len(texts), "texts,", sum(len(t["lines"]) for t in texts), "lines;", len(entries), "etyma")
