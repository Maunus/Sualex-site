"""Build assets/nawalex/data.json for the NawaLex dialect map from the Lastra CLDF.

Usage: python3 build_data.py CLDF_DIR OUT_JSON CONCEPTS
CONCEPTS: comma-separated Lastra numbers and ranges, e.g. "1-33,35,192,193".
"""
import csv, json, sys

W0, E0, S0, N0, W, H = -106.2, -88.8, 12.8, 23.6, 1600, 1045
k = W / (E0 - W0); ky = H / (N0 - S0)
px = lambda lon, lat: [round((lon - W0) * k, 1), round((N0 - lat) * ky, 1)]

def parse(spec):
    out = []
    for part in spec.split(','):
        if '-' in part:
            a, b = part.split('-'); out += [str(i) for i in range(int(a), int(b) + 1)]
        elif part:
            out.append(part)
    return out

cl, out, spec = sys.argv[1], sys.argv[2], sys.argv[3]
keep = parse(spec)
R = lambda f: list(csv.DictReader(open(f"{cl}/{f}.csv", encoding="utf-8")))

langs = R("languages")
idx = {r["ID"]: i for i, r in enumerate(langs)}
L = [[r["ID"], r["Name"], r["Dialect_Region"], r["State"], 1 if r["Is_Proto"] == "true" else 0,
      px(float(r["Longitude"]), float(r["Latitude"])) if r["Longitude"] else None] for r in langs]

params = {r["Lastra_Number"]: r for r in R("parameters")}
C = []; cmap = {}
for n in keep:
    p = params.get(n)
    if not p:
        print("missing concept", n, file=sys.stderr); continue
    c = dict(id=n, pid=p["ID"], en=p["Name"], es=p["Spanish"], f=[]); C.append(c); cmap[p["ID"]] = c
for r in R("forms"):
    c = cmap.get(r["Parameter_ID"])
    if c is None: continue
    cog = " ".join(r["Cognacy"].split()).replace(" + ", "+")
    c["f"].append([idx[r["Language_ID"]], r["Form"], r["Value"] if r["Value"] != r["Form"] else "", r["Segments"], cog, r["Comment"]])
roots = {}
for r in R("cognatesets"):
    if r["Parameter_ID"] in cmap and r["Root_Forms"]:
        roots[cmap[r["Parameter_ID"]]["id"] + "-" + r["Letter"]] = r["Root_Forms"]
for c in C: del c["pid"]

json.dump(dict(L=L, C=C, R=roots, W=W, H=H), open(out, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
print(len(C), "concepts,", sum(len(c["f"]) for c in C), "forms")
