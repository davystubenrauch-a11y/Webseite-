"""
Generates the wrap-around label artwork for the SPIRULI 200 ml slim can.

  label.svg   vector artwork, fonts embedded
  (render to PNG with render.mjs)

Units: 1 unit = 0.1 mm. The print area is assumed to be 166.5 mm wide (the
circumference of a 53 mm can) by 95 mm high. Check against the can maker's
dieline before going to print.

Layout around the can (x positions):
  0 / W   back panel (legal info, barcode) on the seam
  W/4     left side: product description
  W/2     front: vertical script logo and badges
  3W/4    right side: vegan stamp, quality, amino acids
"""
import base64
import math
import random
from pathlib import Path

HERE = Path(__file__).parent
W, H = 1665, 950
FX = W / 2  # front centre

LIME_TOP = "#DDF27A"
LIME_BOTTOM = "#A9D443"
DEEP = "#0B4A31"
GREEN = "#157146"
MID = "#2F8A4E"
PETROL = "#12465A"
CREAM = "#FFF8E7"
CITRUS = "#F6C33A"
BERRY = "#5B2E6E"

random.seed(7)


def font_face(family: str, file: str, weight: str) -> str:
    data = base64.b64encode((HERE / "fonts" / file).read_bytes()).decode()
    return f"@font-face{{font-family:'{family}';src:url(data:font/woff2;base64,{data}) format('woff2');font-weight:{weight};}}"


def wave(y0: float, amp: float, period: float, phase: float) -> str:
    """Seamless wavy top edge across the full circumference, filled to the bottom."""
    pts = []
    for i in range(0, W + 1, 5):
        y = y0 + amp * math.sin(2 * math.pi * i / period + phase) + amp * 0.35 * math.sin(2 * math.pi * i / (period / 2) + phase * 1.7)
        pts.append(f"{i},{y:.1f}")
    return f"M0,{H} L" + " L".join(pts) + f" L{W},{H} Z"


def helix(cx: float, cy: float, length: float, amp: float, angle: float, color: str, width: float, opacity: float) -> str:
    """A spirulina filament: a short sine strand."""
    pts = []
    n = 40
    for i in range(n + 1):
        t = i / n
        x = (t - 0.5) * length
        y = math.sin(t * math.pi * 5) * amp
        pts.append(f"{x:.1f},{y:.1f}")
    return (
        f'<g transform="translate({cx:.1f},{cy:.1f}) rotate({angle:.1f})" opacity="{opacity}">'
        f'<polyline points="{" ".join(pts)}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/></g>'
    )


def text(x, y, s, size, weight=700, fill=DEEP, anchor="middle", family="Brico", spacing=0, extra=""):
    return (
        f'<text x="{x:.1f}" y="{y:.1f}" font-family="{family}" font-size="{size}" font-weight="{weight}" '
        f'fill="{fill}" text-anchor="{anchor}" letter-spacing="{spacing}" {extra}>{s}</text>'
    )


# --- Code 39 for the PZN barcode -------------------------------------------
C39 = {
    "0": "000110100", "1": "100100001", "2": "001100001", "3": "101100000", "4": "000110001",
    "5": "100110000", "6": "001110000", "7": "000100101", "8": "100100100", "9": "001100100",
    "-": "010000101", "*": "010010100",
}


def barcode(cx: float, top: float, width: float, height: float, data: str) -> str:
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
    x0 = cx - width / 2
    return "".join(f'<rect x="{x0 + bx * m:.2f}" y="{top}" width="{bw * m:.2f}" height="{height}" fill="#111"/>' for bx, bw in bars)


# --- Illustrations ----------------------------------------------------------
def lemon(cx, cy, r):
    segs = []
    for k in range(8):
        a0 = k * math.pi / 4 - 0.33
        a1 = k * math.pi / 4 + 0.33
        rr = r * 0.68
        segs.append(
            f'<path d="M{cx},{cy} L{cx + math.cos(a0) * rr:.1f},{cy + math.sin(a0) * rr:.1f} '
            f'A{rr:.1f},{rr:.1f} 0 0 1 {cx + math.cos(a1) * rr:.1f},{cy + math.sin(a1) * rr:.1f} Z" fill="#FFD95A" stroke="{DEEP}" stroke-width="2.5" stroke-linejoin="round"/>'
        )
    return (
        f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{CITRUS}" stroke="{DEEP}" stroke-width="4"/>'
        f'<circle cx="{cx}" cy="{cy}" r="{r * 0.8:.1f}" fill="#FFF3C4" stroke="{DEEP}" stroke-width="2.5"/>' + "".join(segs)
    )


def berries(cx, cy, r):
    dots = [(-0.45, 0.1), (0.05, -0.05), (0.5, 0.15), (-0.2, 0.5), (0.3, 0.55), (0.05, 0.9)]
    out = [f'<path d="M{cx},{cy - r * 1.1} C{cx},{cy - r * 0.6} {cx - r * 0.3},{cy - r * 0.3} {cx - r * 0.45},{cy} M{cx},{cy - r * 0.7} C{cx + r * 0.3},{cy - r * 0.4} {cx + r * 0.45},{cy - r * 0.2} {cx + r * 0.5},{cy}" fill="none" stroke="{DEEP}" stroke-width="4" stroke-linecap="round"/>']
    for dx, dy in dots:
        x, y = cx + dx * r, cy + dy * r * 0.8
        out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r * 0.27:.1f}" fill="{BERRY}" stroke="{DEEP}" stroke-width="3.5"/>')
        out.append(f'<circle cx="{x - r * 0.09:.1f}" cy="{y - r * 0.09:.1f}" r="{r * 0.06:.1f}" fill="#ECDFF3"/>')
    return "".join(out)


def spiral_icon(cx, cy, r):
    pts = " ".join(f"{cx + (t / 40 - 0.5) * r * 2:.1f},{cy + math.sin(t / 40 * math.pi * 4) * r * 0.45:.1f}" for t in range(41))
    return (
        f'<polyline points="{pts}" fill="none" stroke="{DEEP}" stroke-width="{r * 0.34:.1f}" stroke-linecap="round" stroke-linejoin="round"/>'
        f'<polyline points="{pts}" fill="none" stroke="#7BC043" stroke-width="{r * 0.18:.1f}" stroke-linecap="round" stroke-linejoin="round"/>'
    )


def leaf_v(cx, cy, s):
    """Vegan mark: a V with a leaf."""
    return (
        f'<path d="M{cx - s * 0.5},{cy - s * 0.45} L{cx - s * 0.05},{cy + s * 0.5} L{cx + s * 0.2},{cy - s * 0.05}" fill="none" stroke="{DEEP}" stroke-width="{s * 0.13:.1f}" stroke-linecap="round" stroke-linejoin="round"/>'
        f'<path d="M{cx + s * 0.1},{cy - s * 0.05} C{cx + s * 0.1},{cy - s * 0.5} {cx + s * 0.4},{cy - s * 0.6} {cx + s * 0.6},{cy - s * 0.6} C{cx + s * 0.6},{cy - s * 0.25} {cx + s * 0.4},{cy - s * 0.05} {cx + s * 0.1},{cy - s * 0.05}Z" fill="#7BC043" stroke="{DEEP}" stroke-width="{s * 0.06:.1f}" stroke-linejoin="round"/>'
    )


def badge(cx, cy, r, top, big):
    body = f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{CITRUS}" stroke="{DEEP}" stroke-width="5"/>'
    body += f'<circle cx="{cx}" cy="{cy}" r="{r - 9}" fill="none" stroke="{DEEP}" stroke-width="1.5" stroke-dasharray="3 5"/>'
    if big is None:
        return body + leaf_v(cx - 4, cy + 4, r * 0.95)
    return body + text(cx, cy - r * 0.22, top, r * 0.27, 700, spacing=1) + text(cx, cy + r * 0.42, big, r * 0.62, 800)


def ring_text(cx, cy, r, s, size, fill, pid):
    return (
        f'<path id="{pid}" d="M{cx},{cy} m-{r},0 a{r},{r} 0 1,1 {2 * r},0 a{r},{r} 0 1,1 -{2 * r},0" fill="none"/>'
        f'<text font-family="Brico" font-size="{size}" font-weight="700" fill="{fill}" letter-spacing="3"><textPath href="#{pid}">{s}</textPath></text>'
    )


# --- Panels -------------------------------------------------------------------
def back_panel(cx: float, tag: str) -> str:
    """Legal panel on the seam. Bracketed text is placeholder copy."""
    x0, w = cx - 235, 470
    lines = [
        ("Zutaten:", 700), ("[Zutatenliste laut Rezeptur]", 500), ("", 0),
        ("Nährwerte je 100 ml:", 700), ("[Nährwerttabelle laut Analyse]", 500), ("", 0),
        ("Füllmenge: [___ ml]", 700), ("Mindestens haltbar bis: siehe Dosenboden", 500), ("", 0),
        ("Hersteller: [Name, Anschrift]", 500), ("Gut gekühlt genießen.", 500),
    ]
    out = [f'<rect x="{x0}" y="95" width="{w}" height="455" rx="22" fill="{CREAM}" stroke="{DEEP}" stroke-width="4"/>']
    out.append(text(cx, 140, "SPIRULI®", 30, 800, spacing=6))
    out.append(text(cx, 168, "Algen-Fitness-Getränk · fermentiert", 17, 500, fill=GREEN))
    out.append(f'<line x1="{x0 + 30}" y1="186" x2="{x0 + w - 30}" y2="186" stroke="{DEEP}" stroke-width="1.5" stroke-dasharray="4 5"/>')
    y = 222
    for s, wt in lines:
        if s:
            out.append(text(x0 + 30, y, s, 19, wt, anchor="start"))
        y += 27 if s else 12
    # Barcode card + deposit placeholder
    out.append(f'<rect x="{cx - 160}" y="600" width="320" height="170" rx="16" fill="#FFFFFF" stroke="{DEEP}" stroke-width="3"/>')
    out.append(barcode(cx, 625, 270, 95, "-11110571"))
    out.append(text(cx, 750, "PZN - 11110571", 20, 700, fill="#111", spacing=4))
    out.append(f'<rect x="{cx + 140}" y="470" width="66" height="62" rx="10" fill="none" stroke="{DEEP}" stroke-width="2" stroke-dasharray="6 5"/>')
    out.append(text(cx + 173, 506, "Pfand", 14, 700))
    return f'<g id="back-{tag}">' + "".join(out) + "</g>"


def left_panel(cx: float) -> str:
    out = [
        f'<rect x="{cx - 62}" y="118" width="124" height="38" rx="19" fill="{DEEP}"/>',
        text(cx, 145, "NEU", 22, 800, fill=LIME_TOP, spacing=6),
        text(cx, 236, "ALGEN-", 70, 800, spacing=-1),
        text(cx, 306, "FITNESS-", 70, 800, spacing=-1),
        text(cx, 376, "GETRÄNK", 70, 800, spacing=-1),
        f'<path d="M{cx - 120},404 q30,-14 60,0 t60,0 t60,0 t60,0" fill="none" stroke="{DEEP}" stroke-width="4" stroke-linecap="round"/>',
        text(cx, 452, "Natürliche Energie", 33, 700, fill=GREEN),
        text(cx, 492, "mit natürlichen B-Vitaminen", 23, 500),
        text(cx, 520, "&amp; essentiellen Aminosäuren", 23, 500),
    ]
    # Flavour row in the liquid
    items = [(-140, berries, "Holunder"), (0, lemon, "Zitrus"), (140, spiral_icon, "Algen")]
    for dx, fn, label in items:
        x = cx + dx
        out.append(f'<circle cx="{x}" cy="700" r="56" fill="{CREAM}" stroke="{DEEP}" stroke-width="4"/>')
        out.append(fn(x, 700 if fn is not berries else 708, 36 if fn is not spiral_icon else 34))
        out.append(text(x, 792, label, 24, 700, fill=CREAM))
    out.append(text(cx, 640, "FERMENTIERTE BASIS", 18, 700, fill=LIME_TOP, spacing=4))
    return "".join(out)


def right_panel(cx: float) -> str:
    out = [
        f'<circle cx="{cx}" cy="250" r="120" fill="{CREAM}" stroke="{DEEP}" stroke-width="5"/>',
        f'<circle cx="{cx}" cy="250" r="78" fill="none" stroke="{DEEP}" stroke-width="2"/>',
        ring_text(cx, 250, 97, "VEGAN · FERMENTIERT · NATÜRLICH · ", 19, DEEP, "ring-r"),
        text(cx, 245, "100 %", 40, 800),
        text(cx, 276, "pflanzlich", 22, 700, fill=GREEN),
        f'<rect x="{cx - 150}" y="408" width="300" height="104" rx="18" fill="none" stroke="{DEEP}" stroke-width="3.5"/>',
        text(cx, 446, "Qualität analysiert &amp;", 21, 700),
        text(cx, 474, "zertifiziert durch", 21, 700),
        text(cx, 500, "SGS Fresenius", 21, 800, fill=GREEN),
        # In the liquid
        text(cx, 715, "18+", 96, 800, fill=CREAM),
        text(cx, 755, "AMINOSÄUREN", 24, 700, fill=LIME_TOP, spacing=4),
        text(cx, 790, "inkl. BCAA &amp; GABA", 20, 500, fill=CREAM),
    ]
    return "".join(out)


def front_panel() -> str:
    out = []
    # Small top line
    out.append(text(FX, 66, "HEALTH &amp; VITALITY", 22, 700, spacing=7))
    # Vertical script logo, reading bottom to top like the original can.
    logo_attrs = 'font-family="Script" font-size="250" text-anchor="middle" dominant-baseline="central" textLength="650" lengthAdjust="spacingAndGlyphs"'
    cy = 470
    out.append(f'<g transform="translate({FX + 14},{cy + 10}) rotate(-90)"><text {logo_attrs} fill="{DEEP}">Spiruli</text></g>')
    out.append(
        f'<g transform="translate({FX},{cy}) rotate(-90)"><text {logo_attrs} fill="{CREAM}" stroke="{DEEP}" stroke-width="7" paint-order="stroke" stroke-linejoin="round">Spiruli</text></g>'
    )
    out.append(text(FX - 112, 128, "®", 32, 700))
    # Side line parallel to the logo, as on the original can.
    out.append(
        f'<g transform="translate({FX + 190},330) rotate(-90)">'
        + text(0, 0, "NATÜRLICHE ENERGIE", 22, 700, spacing=6, extra='dominant-baseline="central"')
        + "</g>"
    )
    # Badges sit on the band.
    for dx, top, big in [(-138, "VITAMIN", "B11"), (0, "", None), (138, "VITAMIN", "B12")]:
        out.append(badge(FX + dx, 875, 60, top, big))
    return "".join(out)


def build() -> str:
    fonts = font_face("Script", "Yellowtail-400.woff2", "400") + font_face("Brico", "BricolageGrotesque-500.woff2", "200 800")
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W / 10}mm" height="{H / 10}mm">',
        f"<style>{fonts}</style>",
        "<defs>",
        f'<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{LIME_TOP}"/><stop offset="0.65" stop-color="{LIME_BOTTOM}"/></linearGradient>',
        f'<linearGradient id="liquid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{GREEN}"/><stop offset="1" stop-color="{DEEP}"/></linearGradient>',
        "</defs>",
        f'<rect width="{W}" height="{H}" fill="url(#sky)"/>',
    ]

    # Floating filaments and bubbles in the lime area, kept clear of the copy.
    for _ in range(26):
        x, y = random.uniform(0, W), random.uniform(40, 560)
        near_copy = min(abs(x - FX), abs(x - W / 4), abs(x - 3 * W / 4), abs(x), abs(x - W)) < 260
        if near_copy:
            continue
        parts.append(helix(x, y, random.uniform(40, 80), random.uniform(5, 9), random.uniform(-60, 60), MID, 5, 0.45))

    # Liquid: two seamless waves, lighter one behind.
    parts.append(f'<path d="{wave(572, 16, W / 3, 1.2)}" fill="{MID}"/>')
    parts.append(f'<path d="{wave(590, 20, W / 3, 0)}" fill="url(#liquid)"/>')
    for _ in range(70):
        x, y, r = random.uniform(0, W), random.uniform(620, 830), random.uniform(3, 11)
        parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.1f}" fill="none" stroke="{LIME_TOP}" stroke-width="2" opacity="{random.uniform(0.25, 0.6):.2f}"/>')
    for _ in range(18):
        x, y = random.uniform(0, W), random.uniform(640, 820)
        parts.append(helix(x, y, random.uniform(30, 55), random.uniform(4, 6), random.uniform(-40, 40), LIME_BOTTOM, 4, 0.35))

    # Band, a nod to the original's blue stripe.
    parts.append(f'<rect x="0" y="838" width="{W}" height="76" fill="{PETROL}"/>')
    parts.append(f'<rect x="0" y="830" width="{W}" height="5" fill="{LIME_TOP}"/>')
    parts.append(f'<rect x="0" y="917" width="{W}" height="5" fill="{LIME_TOP}"/>')
    parts.append(f'<rect x="0" y="922" width="{W}" height="{H - 922}" fill="{DEEP}"/>')

    parts.append(left_panel(W / 4))
    parts.append(right_panel(3 * W / 4))
    parts.append(back_panel(0, "a"))
    parts.append(back_panel(W, "b"))
    parts.append(front_panel())
    parts.append("</svg>")
    return "\n".join(parts)


if __name__ == "__main__":
    (HERE / "label.svg").write_text(build(), encoding="utf-8")
    print("wrote", HERE / "label.svg")
