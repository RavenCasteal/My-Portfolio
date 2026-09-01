"""Generates the abstract project preview artwork used across the portfolio.

Everything is emitted as flat SVG: crisp at any size, tiny in bytes, no stock
imagery. Re-run this file to regenerate assets after changing a palette.
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "work")
ABOUT = os.path.join(ROOT, "assets", "about")
os.makedirs(OUT, exist_ok=True)
os.makedirs(ABOUT, exist_ok=True)

FONT = "Space Grotesk, Helvetica Neue, Arial, sans-serif"
MONO = "JetBrains Mono, ui-monospace, Menlo, monospace"


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def head(w, h, extra=""):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
        f'width="{w}" height="{h}" role="img" {extra}>'
    )


def grid(x, y, w, h, step, color, opacity=0.05):
    parts = [f'<g stroke="{color}" stroke-width="1" opacity="{opacity}">']
    i = step
    while i < w:
        parts.append(f'<line x1="{x + i:.0f}" y1="{y}" x2="{x + i:.0f}" y2="{y + h}"/>')
        i += step
    i = step
    while i < h:
        parts.append(f'<line x1="{x}" y1="{y + i:.0f}" x2="{x + w}" y2="{y + i:.0f}"/>')
        i += step
    parts.append("</g>")
    return "".join(parts)


def chrome(w, bg, fg):
    return f"""
<rect x="0" y="0" width="{w}" height="52" fill="{bg}"/>
<line x1="0" y1="52" x2="{w}" y2="52" stroke="{fg}" stroke-opacity=".10"/>
<circle cx="30" cy="26" r="5" fill="{fg}" fill-opacity=".18"/>
<circle cx="50" cy="26" r="5" fill="{fg}" fill-opacity=".12"/>
<circle cx="70" cy="26" r="5" fill="{fg}" fill-opacity=".08"/>
<rect x="104" y="15" width="300" height="22" rx="11" fill="{fg}" fill-opacity=".07"/>
<text x="120" y="31" font-family="{MONO}" font-size="11" fill="{fg}" fill-opacity=".38" letter-spacing="1">localhost:3000</text>
"""


def desktop(p):
    """1200x900 abstract site mock."""
    w, h = 1200, 900
    page, ink, accent = p["page"], p["ink"], p["accent"]
    s = [head(w, h, f'aria-label="{esc(p["title"])} website preview"')]
    s.append(f'<rect width="{w}" height="{h}" fill="{page}"/>')
    s.append(grid(0, 52, w, h - 52, 50, ink, 0.04))
    s.append(chrome(w, p["chrome"], ink))

    # site nav
    s.append(f'<text x="64" y="126" font-family="{FONT}" font-size="22" font-weight="700" fill="{ink}" letter-spacing="-.5">{esc(p["brand"])}</text>')
    for i, label in enumerate(["HOME", "MENU", "STORY", "VISIT"]):
        s.append(f'<text x="{700 + i * 110}" y="126" font-family="{MONO}" font-size="11" fill="{ink}" fill-opacity=".55" letter-spacing="1.5">{label}</text>')
    s.append(f'<line x1="64" y1="152" x2="{w - 64}" y2="152" stroke="{ink}" stroke-opacity=".10"/>')

    # hero headline
    base = 300
    for i, line in enumerate(p["headline"]):
        s.append(
            f'<text x="64" y="{base + i * 92}" font-family="{FONT}" font-size="86" '
            f'font-weight="700" fill="{ink}" letter-spacing="-3">{esc(line)}</text>'
        )
    top = base + len(p["headline"]) * 92

    # body copy lines
    for i in range(3):
        wdt = [520, 470, 300][i]
        s.append(f'<rect x="64" y="{top - 26 + i * 22}" width="{wdt}" height="9" rx="4.5" fill="{ink}" fill-opacity=".20"/>')
    s.append(f'<rect x="64" y="{top + 60}" width="182" height="50" rx="25" fill="{accent}"/>')
    s.append(f'<text x="98" y="{top + 91}" font-family="{MONO}" font-size="12" fill="{p["btnInk"]}" letter-spacing="2">{esc(p["cta"])}</text>')

    # key visual block
    kx, ky, kw, kh = 660, 200, 476, 400
    s.append(f'<rect x="{kx}" y="{ky}" width="{kw}" height="{kh}" rx="6" fill="{p["block"]}"/>')
    s.append(grid(kx, ky, kw, kh, 40, ink, 0.07))
    s.append(f'<circle cx="{kx + kw - 96}" cy="{ky + 96}" r="118" fill="{accent}" fill-opacity="{p["accentSoft"]}"/>')
    s.append(f'<circle cx="{kx + kw - 96}" cy="{ky + 96}" r="118" fill="none" stroke="{accent}" stroke-opacity=".5"/>')
    s.append(f'<rect x="{kx + 40}" y="{ky + kh - 128}" width="180" height="10" rx="5" fill="{ink}" fill-opacity=".55"/>')
    s.append(f'<rect x="{kx + 40}" y="{ky + kh - 104}" width="120" height="10" rx="5" fill="{ink}" fill-opacity=".28"/>')

    # floating ui chip
    s.append(f'<rect x="{kx - 46}" y="{ky + 250}" width="188" height="74" rx="8" fill="{page}" stroke="{ink}" stroke-opacity=".14"/>')
    s.append(f'<circle cx="{kx - 46 + 30}" cy="{ky + 250 + 37}" r="13" fill="{accent}"/>')
    s.append(f'<rect x="{kx - 46 + 56}" y="{ky + 250 + 28}" width="100" height="8" rx="4" fill="{ink}" fill-opacity=".45"/>')
    s.append(f'<rect x="{kx - 46 + 56}" y="{ky + 250 + 44}" width="66" height="8" rx="4" fill="{ink}" fill-opacity=".22"/>')

    # three cards
    cy = h - 232
    cw = (w - 128 - 2 * 28) / 3
    for i in range(3):
        x = 64 + i * (cw + 28)
        s.append(f'<rect x="{x:.0f}" y="{cy}" width="{cw:.0f}" height="176" rx="6" fill="{ink}" fill-opacity=".05" stroke="{ink}" stroke-opacity=".10"/>')
        s.append(f'<rect x="{x + 24:.0f}" y="{cy + 24}" width="{cw - 48:.0f}" height="76" rx="4" fill="{p["cardFill"]}"/>')
        s.append(f'<rect x="{x + 24:.0f}" y="{cy + 120}" width="{(cw - 48) * .6:.0f}" height="10" rx="5" fill="{ink}" fill-opacity=".42"/>')
        s.append(f'<rect x="{x + 24:.0f}" y="{cy + 142}" width="{(cw - 48) * .38:.0f}" height="8" rx="4" fill="{ink}" fill-opacity=".20"/>')
        if i == 1:
            s.append(f'<rect x="{x + 24:.0f}" y="{cy + 24}" width="{cw - 48:.0f}" height="76" rx="4" fill="none" stroke="{accent}" stroke-width="2"/>')

    s.append(f'<text x="{w - 64}" y="{h - 26}" text-anchor="end" font-family="{MONO}" font-size="10" fill="{ink}" fill-opacity=".30" letter-spacing="2">{esc(p["tag"])}</text>')
    s.append("</svg>")
    return "".join(s)


def mobile(p):
    """520x900 phone mock showing the same project on a small screen."""
    w, h = 520, 900
    page, ink, accent = p["page"], p["ink"], p["accent"]
    s = [head(w, h, f'aria-label="{esc(p["title"])} mobile preview"')]
    s.append(f'<rect width="{w}" height="{h}" fill="{p["mobileBg"]}"/>')
    s.append(grid(0, 0, w, h, 52, ink, 0.05))

    px, py, pw, ph = 110, 60, 300, 780
    s.append(f'<rect x="{px}" y="{py}" width="{pw}" height="{ph}" rx="34" fill="{page}" stroke="{ink}" stroke-opacity=".18" stroke-width="2"/>')
    s.append(f'<rect x="{px + pw / 2 - 40}" y="{py + 20}" width="80" height="10" rx="5" fill="{ink}" fill-opacity=".18"/>')

    s.append(f'<text x="{px + 28}" y="{py + 96}" font-family="{FONT}" font-size="19" font-weight="700" fill="{ink}">{esc(p["brand"])}</text>')
    s.append(f'<rect x="{px + pw - 74}" y="{py + 80}" width="46" height="18" rx="9" fill="{accent}"/>')

    ty = py + 190
    for i, line in enumerate(p["headline"]):
        s.append(f'<text x="{px + 28}" y="{ty + i * 40}" font-family="{FONT}" font-size="34" font-weight="700" fill="{ink}" letter-spacing="-1.2">{esc(line)}</text>')
    ty += len(p["headline"]) * 40 + 18
    for i, wdt in enumerate([200, 176, 130]):
        s.append(f'<rect x="{px + 28}" y="{ty + i * 18}" width="{wdt}" height="8" rx="4" fill="{ink}" fill-opacity=".20"/>')
    s.append(f'<rect x="{px + 28}" y="{ty + 84}" width="140" height="42" rx="21" fill="{accent}"/>')

    s.append(f'<rect x="{px + 28}" y="{py + 430}" width="{pw - 56}" height="150" rx="8" fill="{p["block"]}"/>')
    s.append(f'<circle cx="{px + pw - 70}" cy="{py + 470}" r="52" fill="{accent}" fill-opacity="{p["accentSoft"]}"/>')
    s.append(f'<circle cx="{px + pw - 70}" cy="{py + 470}" r="52" fill="none" stroke="{accent}" stroke-opacity=".55"/>')

    for i in range(2):
        y = py + 610 + i * 74
        s.append(f'<rect x="{px + 28}" y="{y}" width="{pw - 56}" height="60" rx="8" fill="{ink}" fill-opacity=".05" stroke="{ink}" stroke-opacity=".10"/>')
        s.append(f'<rect x="{px + 44}" y="{y + 16}" width="36" height="28" rx="4" fill="{p["cardFill"]}"/>')
        s.append(f'<rect x="{px + 94}" y="{y + 22}" width="120" height="8" rx="4" fill="{ink}" fill-opacity=".40"/>')
        s.append(f'<rect x="{px + 94}" y="{y + 38}" width="76" height="6" rx="3" fill="{ink}" fill-opacity=".18"/>')
    s.append("</svg>")
    return "".join(s)


PROJECTS = [
    dict(
        slug="miks-coffee", title="Mik's Coffee Shop", brand="MIK'S", tag="MIK'S COFFEE / 2026",
        page="#14100D", chrome="#1C1611", ink="#F6EEDF", accent="#E09A4E", btnInk="#14100D",
        block="#241B14", cardFill="#2E2218", accentSoft=".30", mobileBg="#0B0908",
        headline=["BREWED", "SLOW."], cta="VIEW MENU",
    ),
    dict(
        slug="duo-brew", title="Duo Brew", brand="DUO BREW", tag="DUO BREW / 2026",
        page="#0F1512", chrome="#131B17", ink="#EAF2EC", accent="#5FB49A", btnInk="#0F1512",
        block="#16211C", cardFill="#1E2C25", accentSoft=".26", mobileBg="#090D0B",
        headline=["TWO", "BEANS,", "ONE CUP."], cta="FIND US",
    ),
    dict(
        slug="milk-tea", title="Russ Tea", brand="RUSS TEA", tag="RUSS TEA / 2026",
        page="#171016", chrome="#1E1520", ink="#F8EFF2", accent="#E4799C", btnInk="#171016",
        block="#241A23", cardFill="#2E2029", accentSoft=".30", mobileBg="#0C080B",
        headline=["SHAKEN", "NOT", "STIRRED."], cta="ORDER NOW",
    ),
    dict(
        slug="portfolio-project", title="Portfolio Project", brand="P / STUDIO", tag="PORTFOLIO / 2026",
        page="#0B0C0D", chrome="#101113", ink="#EDEBE6", accent="#C9F24E", btnInk="#0B0C0D",
        block="#141518", cardFill="#1A1C1F", accentSoft=".22", mobileBg="#08090A",
        headline=["BUILDING", "DIGITAL", "EXPERIENCES."], cta="VIEW WORK",
    ),
]

for p in PROJECTS:
    with open(os.path.join(OUT, f"{p['slug']}.svg"), "w", encoding="utf-8") as f:
        f.write(desktop(p))
    with open(os.path.join(OUT, f"{p['slug']}-mobile.svg"), "w", encoding="utf-8") as f:
        f.write(mobile(p))


# ---- About visual: abstract scanline portrait inside a technical frame ----
def portrait():
    w, h = 900, 1100
    ink, accent = "#EDEBE6", "#C9F24E"
    s = [head(w, h, 'aria-label="Abstract scanline portrait of the developer"')]
    s.append(f'<rect width="{w}" height="{h}" fill="#0E1012"/>')
    s.append(grid(0, 0, w, h, 45, ink, 0.05))

    # soft field behind the figure
    s.append('<defs>')
    s.append('<radialGradient id="glow" cx="50%" cy="42%" r="52%">')
    s.append(f'<stop offset="0%" stop-color="{accent}" stop-opacity=".16"/>')
    s.append(f'<stop offset="100%" stop-color="{accent}" stop-opacity="0"/>')
    s.append('</radialGradient>')
    s.append('<linearGradient id="scan" x1="0" y1="0" x2="0" y2="1">')
    s.append(f'<stop offset="0%" stop-color="{ink}" stop-opacity=".55"/>')
    s.append(f'<stop offset="70%" stop-color="{ink}" stop-opacity=".16"/>')
    s.append(f'<stop offset="100%" stop-color="{ink}" stop-opacity=".04"/>')
    s.append('</linearGradient>')
    s.append(f'<clipPath id="figure"><path d="M450 250c-92 0-150 62-150 150 0 60 22 96 48 120 40 36 62 74 68 132 4 40 6 84 6 128h256c0-44 2-88 6-128 6-58 28-96 68-132 26-24 48-60 48-120 0-88-58-150-150-150z"/></clipPath>')
    s.append('</defs>')
    s.append(f'<rect width="{w}" height="{h}" fill="url(#glow)"/>')

    # scanline figure
    s.append('<g clip-path="url(#figure)">')
    s.append(f'<rect x="240" y="220" width="420" height="580" fill="url(#scan)" opacity=".18"/>')
    y = 240
    row = 0
    while y < 800:
        gap = 6 + (row % 5)
        s.append(f'<rect x="240" y="{y}" width="420" height="3" fill="{ink}" fill-opacity=".55"/>')
        y += gap
        row += 1
    s.append('</g>')

    # technical frame + annotations
    s.append(f'<rect x="120" y="140" width="660" height="820" fill="none" stroke="{ink}" stroke-opacity=".14"/>')
    for cx, cy in [(120, 140), (780, 140), (120, 960), (780, 960)]:
        s.append(f'<rect x="{cx - 9}" y="{cy - 9}" width="18" height="18" fill="none" stroke="{accent}" stroke-opacity=".8"/>')
    s.append(f'<line x1="120" y1="500" x2="240" y2="500" stroke="{ink}" stroke-opacity=".14"/>')
    s.append(f'<line x1="660" y1="500" x2="780" y2="500" stroke="{ink}" stroke-opacity=".14"/>')
    s.append(f'<text x="120" y="120" font-family="{MONO}" font-size="12" fill="{ink}" fill-opacity=".45" letter-spacing="2.5">ID.001 — DEVELOPER</text>')
    s.append(f'<text x="780" y="120" text-anchor="end" font-family="{MONO}" font-size="12" fill="{accent}" letter-spacing="2.5">STATUS: BUILDING</text>')
    s.append(f'<text x="120" y="1000" font-family="{MONO}" font-size="12" fill="{ink}" fill-opacity=".35" letter-spacing="2.5">CREATIVE FRONTEND / INTERACTION DESIGN</text>')
    s.append(f'<circle cx="450" cy="1010" r="5" fill="{accent}"/>')
    s.append("</svg>")
    return "".join(s)


with open(os.path.join(ABOUT, "portrait.svg"), "w", encoding="utf-8") as f:
    f.write(portrait())


# ---- favicon ----
favicon = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<rect width="64" height="64" rx="14" fill="#0B0C0D"/>
<path d="M20 46V18h14a10 10 0 0 1 0 20H26" fill="none" stroke="#C9F24E" stroke-width="6" stroke-linecap="square"/>
<circle cx="45" cy="45" r="4" fill="#EDEBE6"/>
</svg>"""
with open(os.path.join(ROOT, "assets", "favicon.svg"), "w", encoding="utf-8") as f:
    f.write(favicon)

print("generated:", sorted(os.listdir(OUT)), sorted(os.listdir(ABOUT)))
