# sualex.org

Static website for SUALEX, the language resources of the ERC project SUAHIST (grant 101116662). Served by GitHub Pages at https://sualex.org.

- Spanish pages: `index.html`, `proyecto/`, `financiamiento/`
- English pages: `en/`, `en/project/`, `en/funding/`
- Styles, fonts and images: `assets/`
- Pre-launch: pages carry a noindex tag and robots.txt blocks crawlers. At launch: remove both, and add a `CNAME` file containing `sualex.org`.

Every page exists in both languages. When you change text on one page, change its counterpart too.
Sub-sites (WixaLex, NayaLex, NawaLex, SUAEtym, SUAText) will be added later.

Fonts: Andada Pro and Barlow Semi Condensed, SIL Open Font License (see `assets/fonts`).
Map relief: Mapzen / AWS Terrain Tiles; boundaries: Natural Earth.

## NawaLex dialect map

Pages: `nawalex/mapa/` (ES) and `en/nawalex/map/` (EN). Code and data: `assets/nawalex/`.
The data file `assets/nawalex/data.json` is built from the Lastra CLDF in the SUALEX-Data repository:

    python3 tools/build_nawalex_data.py PATH/TO/cldf/nawalex-lastra assets/nawalex/data.json "1-9,11-33,35,192,193"

The last argument lists the Lastra concept numbers to show. Currently: the concepts with cognate coding by the project.
