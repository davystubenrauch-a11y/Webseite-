"""
Generates the wrap-around label for the SPIRULI 200 ml slim can (version 2).

Direction: a calm, premium health drink. Soft gradient from cream through
mint to deep algae green, a single-colour script logo, fine-line botanical
illustrations and a quiet editorial serif.

  label.svg   vector artwork, fonts embedded

Units: 1 unit = 0.1 mm. Print area assumed 166.5 mm (circumference of a
53 mm can) × 95 mm. Check against the can maker's dieline before print.

Around the can: back panel on the seam (x = 0 / W), left side at W/4,
front at W/2, right side at 3W/4.
"""
import base64
import math
from pathlib import Path

HERE = Path(__file__).parent
W, H = 1665, 950
FX = W / 2

INK = "#0F4D32"  # deep algae green: logo and text
LEAF = "#2E7D4A"
CREAM = "#FBF8EF"
PLUM = "#4B2A5C"
LEMON = "#F7D86B"
LEAF_FILL = "#A6D07A"
GREEN_ZONE = 690  # below this the gradient is dark enough for cream text


def font_face(family: str, file: str, weight: str, style: str = "normal") -> str:
    data = base64.b64encode((HERE / "fonts" / file).read_bytes()).decode()
    return (
        f"@font-face{{font-family:'{family}';src:url(data:font/woff2;base64,{data}) format('woff2');"
        f"font-weight:{weight};font-style:{style};}}"
    )


def t(x, y, s, size, weight=500, fill=INK, family="Sans", anchor="middle", spacing=0, italic=False, extra=""):
    style = ' font-style="italic"' if italic else ""
    return (
        f'<text x="{x:.1f}" y="{y:.1f}" font-family="{family}" font-size="{size}" font-weight="{weight}"{style} '
        f'fill="{fill}" text-anchor="{anchor}" letter-spacing="{spacing}" {extra}>{s}</text>'
    )


# --- Fine-line botanicals ---------------------------------------------------
def leaf(x, y, length, angle, fill=LEAF_FILL, stroke=INK, sw=2.4):
    w = length * 0.32
    return (
        f'<g transform="translate({x:.1f},{y:.1f}) rotate({angle:.1f})">'
        f'<path d="M0,0 C{length * 0.3:.1f},{-w:.1f} {length * 0.75:.1f},{-w * 0.8:.1f} {length:.1f},0 '
        f'C{length * 0.75:.1f},{w * 0.8:.1f} {length * 0.3:.1f},{w:.1f} 0,0Z" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"/>'
        f'<path d="M{length * 0.08:.1f},0 L{length * 0.9:.1f},0" stroke="{stroke}" stroke-width="{sw * 0.6:.1f}" stroke-linecap="round"/>'
        "</g>"
    )


def elderberry(x, y, s=1.0, stroke=INK, fill=PLUM):
    """A drooping elderberry umbel with two leaves."""
    out = [
        f'<path d="M{x},{y} C{x - 20 * s},{y + 40 * s} {x - 10 * s},{y + 70 * s} {x - 30 * s},{y + 100 * s}" fill="none" stroke="{stroke}" stroke-width="{2.4 * s}" stroke-linecap="round"/>',
        leaf(x, y + 10 * s, 70 * s, -25, stroke=stroke),
        leaf(x - 4 * s, y + 18 * s, 62 * s, 200, stroke=stroke),
    ]
    tips = []
    for k in range(5):
        a = math.radians(200 + k * 35)
        ex, ey = x - 30 * s + math.cos(a) * 46 * s, y + 100 * s - math.sin(a) * 30 * s + 40 * s
        out.append(f'<path d="M{x - 30 * s:.1f},{y + 100 * s:.1f} Q{(x - 30 * s + ex) / 2:.1f},{y + 112 * s:.1f} {ex:.1f},{ey:.1f}" fill="none" stroke="{stroke}" stroke-width="{1.6 * s}"/>')
        tips.append((ex, ey))
    for i, (ex, ey) in enumerate(tips):
        for j, (dx, dy) in enumerate([(0, 0), (-9, 9), (9, 8), (0, 17), (-5, -9)]):
            if (i + j) % 4 == 3:
                continue
            bx, by, r = ex + dx * s, ey + dy * s, (6.5 + (i * 7 + j * 3) % 3) * s
            out.append(f'<circle cx="{bx:.1f}" cy="{by:.1f}" r="{r:.1f}" fill="{fill}" stroke="{stroke}" stroke-width="{1.4 * s:.1f}"/>')
            out.append(f'<circle cx="{bx - r * 0.35:.1f}" cy="{by - r * 0.35:.1f}" r="{r * 0.22:.1f}" fill="#EADCF0"/>')
    return "".join(out)


def lemon_slice(x, y, r, stroke=INK):
    segs = []
    for k in range(10):
        a = k * math.pi / 5
        segs.append(f'<path d="M{x},{y} L{x + math.cos(a) * r * 0.78:.1f},{y + math.sin(a) * r * 0.78:.1f}" stroke="{stroke}" stroke-width="1.6" stroke-linecap="round"/>')
    return (
        f'<circle cx="{x}" cy="{y}" r="{r}" fill="{LEMON}" stroke="{stroke}" stroke-width="2.4"/>'
        f'<circle cx="{x}" cy="{y}" r="{r * 0.86:.1f}" fill="#FFF1B8" stroke="{stroke}" stroke-width="1.6"/>'
        f'<circle cx="{x}" cy="{y}" r="{r * 0.78:.1f}" fill="#FBE38A"/>' + "".join(segs) + f'<circle cx="{x}" cy="{y}" r="{r * 0.08:.1f}" fill="#FFF1B8" stroke="{stroke}" stroke-width="1.4"/>'
    )


def helix(x, y, length, amp, angle, stroke=INK, sw=2.2, turns=4.5):
    """Spirulina filament as a fine double strand."""
    a, b = [], []
    for i in range(121):
        u = i / 120
        px = (u - 0.5) * length
        a.append(f"{px:.1f},{math.sin(u * math.pi * 2 * turns) * amp:.1f}")
        b.append(f"{px:.1f},{-math.sin(u * math.pi * 2 * turns) * amp:.1f}")
    return (
        f'<g transform="translate({x:.1f},{y:.1f}) rotate({angle:.1f})" fill="none" stroke="{stroke}" stroke-width="{sw}" stroke-linecap="round">'
        f'<polyline points="{" ".join(a)}"/><polyline points="{" ".join(b)}" opacity="0.45"/></g>'
    )


def berry_icon(x, y, r, stroke):
    """Compact elderberry cluster for small icon rows."""
    out = [f'<path d="M{x},{y - r * 1.5} Q{x + r * 0.2},{y - r * 0.9} {x},{y - r * 0.55}" fill="none" stroke="{stroke}" stroke-width="2.2" stroke-linecap="round"/>']
    for dx, dy in [(-0.7, 0), (0, -0.15), (0.7, 0), (-0.35, 0.65), (0.35, 0.65), (0, 1.3)]:
        out.append(f'<circle cx="{x + dx * r:.1f}" cy="{y + dy * r:.1f}" r="{r * 0.42:.1f}" fill="#6B3D7E" stroke="{stroke}" stroke-width="1.8"/>')
    return "".join(out)


def vegan_mark(x, y, s, stroke):
    return (
        f'<path d="M{x - s * 0.45},{y - s * 0.35} L{x - s * 0.05},{y + s * 0.45} L{x + s * 0.18},{y - s * 0.02}" fill="none" stroke="{stroke}" stroke-width="{s * 0.1:.1f}" stroke-linecap="round" stroke-linejoin="round"/>'
        f'<path d="M{x + s * 0.12},{y} C{x + s * 0.12},{y - s * 0.42} {x + s * 0.38},{y - s * 0.52} {x + s * 0.55},{y - s * 0.52} C{x + s * 0.55},{y - s * 0.2} {x + s * 0.38},{y} {x + s * 0.12},{y}Z" fill="none" stroke="{stroke}" stroke-width="{s * 0.07:.1f}" stroke-linejoin="round"/>'
    )


# --- Code 39 PZN barcode --------------------------------------------------------
C39 = {
    "0": "000110100", "1": "100100001", "2": "001100001", "3": "101100000", "4": "000110001",
    "5": "100110000", "6": "001110000", "7": "000100101", "8": "100100100", "9": "001100100",
    "-": "010000101", "*": "010010100",
}


def barcode(cx, top, width, height, data):
    bars, x = [], 0.0
    chars = f"*{data}*"
    for ci, ch in enumerate(chars):
        for i, bit in enumerate(C39[ch]):
            w = 2.6 if bit == "1" else 1
            if i % 2 == 0:
                bars.append((x, w))
            x += w
        if ci < len(chars) - 1:
            x += 1
    m = width / x
    return "".join(f'<rect x="{cx - width / 2 + bx * m:.2f}" y="{top}" width="{bw * m:.2f}" height="{height}" fill="#111"/>' for bx, bw in bars)


# --- Panels ---------------------------------------------------------------------
def front():
    out = [t(FX, 62, "HEALTH &amp; VITALITY", 17, 700, spacing=8)]
    out.append(f'<line x1="{FX - 26}" y1="82" x2="{FX + 26}" y2="82" stroke="{INK}" stroke-width="1.6"/>')

    # Botanicals around the logo, behind it.
    out.append(elderberry(FX - 168, 150, 0.95))
    out.append(helix(FX - 175, 560, 170, 9, -62, sw=2))
    out.append(leaf(FX + 130, 590, 74, -40))
    out.append(leaf(FX + 120, 600, 60, 20))
    out.append(lemon_slice(FX + 150, 645, 62))

    # Vertical script logo, single colour.
    logo = 'font-family="Script" font-size="236" text-anchor="middle" dominant-baseline="central" textLength="600" lengthAdjust="spacingAndGlyphs"'
    out.append(f'<g transform="translate({FX},410) rotate(-90)"><text {logo} fill="{INK}">Spiruli</text></g>')
    out.append(t(FX - 104, 128, "®", 26, 600))

    out.append(
        f'<g transform="translate({FX + 172},300) rotate(-90)">'
        + t(0, 0, "FERMENTIERT · VEGAN · NATÜRLICH", 15, 700, spacing=6, extra='dominant-baseline="central"')
        + "</g>"
    )

    out.append(t(FX, 782, "Natürliche Energie", 40, 500, fill=CREAM, family="Serif", italic=True))
    out.append(t(FX, 812, "ALGEN · HOLUNDER · ZITRUS", 13, 700, fill="#CFE8B8", spacing=5))
    # Minimal badges.
    for dx, kind in [(-112, "B11"), (0, "V"), (112, "B12")]:
        x = FX + dx
        out.append(f'<circle cx="{x}" cy="877" r="40" fill="none" stroke="{CREAM}" stroke-width="2"/>')
        if kind == "V":
            out.append(vegan_mark(x - 4, 878, 46, CREAM))
        else:
            out.append(t(x, 870, "VITAMIN", 9.5, 700, fill=CREAM, spacing=2))
            out.append(t(x, 895, kind, 24, 800, fill=CREAM))
    return "".join(out)


def left(cx):
    out = [
        t(cx, 140, "DAS MEHRWERTGETRÄNK", 15, 700, fill=LEAF, spacing=5),
        t(cx, 222, "Natürliche", 58, 500, family="Serif"),
        t(cx, 284, "Energie aus", 58, 500, family="Serif"),
        t(cx, 346, "der Alge.", 58, 500, family="Serif", italic=True, fill=LEAF),
        f'<line x1="{cx - 30}" y1="384" x2="{cx + 30}" y2="384" stroke="{INK}" stroke-width="1.6"/>',
    ]
    for i, line in enumerate(["Das vegane &amp; natürliche", "Mehrwertgetränk mit natürlichen", "B-Vitaminen und essentiellen", "Aminosäuren."]):
        out.append(t(cx, 428 + i * 30, line, 21, 500))
    out.append(t(cx, 726, "FERMENTIERT AUS", 13, 700, fill="#CFE8B8", spacing=5))
    icons = [
        (-130, lambda x, y: berry_icon(x, y - 6, 17, CREAM), "Holunder"),
        (0, lambda x, y: lemon_slice(x, y, 30, stroke=INK), "Zitrus"),
        (130, lambda x, y: helix(x, y, 70, 9, 0, stroke=CREAM, sw=2.4, turns=2.5), "Spirulina"),
    ]
    for dx, fn, label in icons:
        x = cx + dx
        out.append(fn(x, 790))
        out.append(t(x, 860, label, 17, 700, fill=CREAM))
    return "".join(out)


def right(cx):
    rows = [
        ("Natürlicher B-Komplex", "B2 · B6 · B12 · Niacin"),
        ("Vitamin C &amp; Folsäure", "aus Zitrus und Alge"),
        ("18+ Aminosäuren", "inkl. BCAA &amp; GABA"),
        ("100 % vegan", "rein pflanzlich, fermentiert"),
    ]
    out = [t(cx, 140, "WAS DRIN IST", 15, 700, fill=LEAF, spacing=5)]
    y = 170
    for head, sub in rows:
        out.append(f'<line x1="{cx - 190}" y1="{y}" x2="{cx + 190}" y2="{y}" stroke="{INK}" stroke-width="1.2" opacity="0.35"/>')
        out.append(t(cx, y + 44, head, 30, 500, family="Serif"))
        out.append(t(cx, y + 72, sub, 16, 600, fill=LEAF))
        y += 96
    out.append(f'<line x1="{cx - 190}" y1="{y}" x2="{cx + 190}" y2="{y}" stroke="{INK}" stroke-width="1.2" opacity="0.35"/>')
    out.append(t(cx, 742, "Qualität analysiert &amp; zertifiziert", 18, 600, fill=CREAM))
    out.append(t(cx, 768, "durch SGS Fresenius", 18, 600, fill=CREAM))
    out.append(f'<line x1="{cx - 26}" y1="792" x2="{cx + 26}" y2="792" stroke="{CREAM}" stroke-width="1.4"/>')
    out.append(t(cx, 836, "PZN 11110571", 30, 500, fill=CREAM, family="Serif"))
    out.append(t(cx, 862, "in Ihrer Apotheke", 15, 600, fill="#CFE8B8", spacing=2))
    return "".join(out)


def back(cx, tag):
    """Legal panel on the seam. Bracketed text is placeholder copy."""
    x0, w = cx - 230, 460
    out = [f'<rect x="{x0}" y="110" width="{w}" height="470" rx="18" fill="#FFFFFF" fill-opacity="0.72" stroke="{INK}" stroke-width="1.5"/>']
    out.append(t(cx, 160, "Spiruli", 46, 400, family="Script"))
    out.append(t(cx, 190, "FERMENTIERTES ALGEN-GETRÄNK", 13, 700, fill=LEAF, spacing=4))
    y = 236
    for s, wt in [
        ("Zutaten:", 700), ("[Zutatenliste laut Rezeptur]", 500), ("", 0),
        ("Nährwerte je 100 ml:", 700), ("[Nährwerttabelle laut Analyse]", 500), ("", 0),
        ("Füllmenge: [___ ml]", 700), ("Mindestens haltbar bis: siehe Dosenboden", 500), ("", 0),
        ("Hersteller: [Name, Anschrift]", 500), ("Gut gekühlt genießen.", 500),
    ]:
        if s:
            out.append(t(x0 + 28, y, s, 18, wt, anchor="start"))
        y += 27 if s else 12
    out.append(f'<rect x="{cx + 140}" y="490" width="62" height="62" rx="10" fill="none" stroke="{INK}" stroke-width="1.5" stroke-dasharray="5 4"/>')
    out.append(t(cx + 171, 526, "Pfand", 13, 700))
    out.append(f'<rect x="{cx - 150}" y="650" width="300" height="160" rx="14" fill="#FFFFFF"/>')
    out.append(barcode(cx, 672, 250, 90, "-11110571"))
    out.append(t(cx, 792, "PZN - 11110571", 18, 700, fill="#111", spacing=4))
    return f'<g id="back-{tag}">' + "".join(out) + "</g>"


def build():
    fonts = (
        font_face("Script", "Yellowtail-400.woff2", "400")
        + font_face("Serif", "Fraunces-normal.woff2", "300 700")
        + font_face("Serif", "Fraunces-italic.woff2", "300 700", "italic")
        + font_face("Sans", "Manrope-normal.woff2", "400 800")
    )
    return "\n".join(
        [
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W / 10}mm" height="{H / 10}mm">',
            f"<style>{fonts}</style>",
            "<defs>",
            '<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">'
            '<stop offset="0" stop-color="#F8F5EC"/><stop offset="0.5" stop-color="#EAF4D6"/>'
            '<stop offset="0.66" stop-color="#B7DC80"/><stop offset="0.76" stop-color="#4E9D55"/>'
            '<stop offset="0.9" stop-color="#1E6A43"/><stop offset="1" stop-color="#15523A"/></linearGradient>',
            # Soft light behind the logo.
            '<radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.85"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>',
            # Fine print grain for a matte, premium finish.
            '<filter id="grain" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>'
            '<feColorMatrix values="0 0 0 0 0.1 0 0 0 0 0.2 0 0 0 0 0.12 0 0 0 0.09 0"/></filter>',
            "</defs>",
            f'<rect width="{W}" height="{H}" fill="url(#bg)"/>',
            f'<ellipse cx="{FX}" cy="400" rx="300" ry="380" fill="url(#glow)"/>',
            # A gentle curve where the light meets the green.
            f'<path d="M0,{GREEN_ZONE + 40} C{W * 0.2},{GREEN_ZONE - 10} {W * 0.35},{GREEN_ZONE + 70} {W * 0.5},{GREEN_ZONE + 30} '
            f'C{W * 0.65},{GREEN_ZONE - 10} {W * 0.8},{GREEN_ZONE + 60} {W},{GREEN_ZONE + 40} L{W},{H} L0,{H}Z" fill="#1E6A43" opacity="0.35"/>',
            left(W / 4),
            right(3 * W / 4),
            back(0, "a"),
            back(W, "b"),
            front(),
            f'<rect width="{W}" height="{H}" filter="url(#grain)"/>',
            "</svg>",
        ]
    )


if __name__ == "__main__":
    (HERE / "label.svg").write_text(build(), encoding="utf-8")
    print("wrote", HERE / "label.svg")
