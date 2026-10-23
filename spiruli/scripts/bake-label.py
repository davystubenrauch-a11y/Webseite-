"""
Unwraps the front of the can photo (public/spiruli-can.jpg) into label
textures for the 3D can:

  public/label/front.webp   colour, lighting flattened, alpha-feathered edges
  public/label/front-pbr.webp   (0, roughness, metalness) per pixel

Run from spiruli/:  python3 scripts/bake-label.py
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

SRC = Path("public/spiruli-can.jpg")
OUT = Path("public/label")

# Can geometry in the photo (pixels), measured from the petrol body.
CX, R = 461.0, 197.0
TOP, BOTTOM = 140, 1097

# Label texture: full circumference is 2048 px wide (must match lib/drawLabel.ts).
LABEL_W, LABEL_H = 2048, 1640
THETA_MAX = np.radians(80)  # beyond this the photo is too foreshortened
FEATHER = np.radians(12)

src = np.asarray(Image.open(SRC).convert("RGB")).astype(np.float32) / 255

# Flatten the studio lighting baked into the photo: per-column gain from the
# median brightness of plain petrol pixels.
r, g, b = src[..., 0], src[..., 1], src[..., 2]
lum = src.mean(2)
petrol = (b > r + 0.05) & (g > r + 0.05) & (lum < 0.45) & (np.abs(g - b) < 0.08)
x0, x1 = int(CX - R), int(CX + R) + 1
med = np.full(src.shape[1], np.nan, np.float32)
for x in range(x0, x1):
    col = lum[TOP:BOTTOM, x][petrol[TOP:BOTTOM, x]]
    if col.size > 40:
        med[x] = np.median(col)
valid = ~np.isnan(med)
xs = np.arange(src.shape[1])
med = np.interp(xs, xs[valid], med[valid])
med = np.convolve(med, np.ones(15) / 15, mode="same")
target = np.percentile(med[x0:x1], 50)
gain = np.clip(target / np.maximum(med, 1e-3), 0.6, 1.9)
flat = np.clip(src * gain[None, :, None], 0, 1)

# Inverse cylinder projection: label column -> angle -> photo x.
half = int(np.ceil(THETA_MAX / (2 * np.pi) * LABEL_W))
width = half * 2
theta = (np.arange(width) + 0.5 - half) / LABEL_W * 2 * np.pi
photo_x = CX + R * np.sin(theta)

# Bilinear sample: rows first (upscale), then columns via interpolation.
rows = Image.fromarray((flat[TOP:BOTTOM] * 255).astype(np.uint8)).resize(
    (src.shape[1], LABEL_H), Image.LANCZOS
)
rows = np.asarray(rows).astype(np.float32) / 255
out = np.empty((LABEL_H, width, 3), np.float32)
for c in range(3):
    out[..., c] = np.stack([np.interp(photo_x, xs, rows[y, :, c]) for y in range(LABEL_H)])

alpha = np.clip((THETA_MAX - np.abs(theta)) / FEATHER, 0, 1)
alpha = alpha * alpha * (3 - 2 * alpha)
alpha = np.broadcast_to(alpha[None, :], out.shape[:2])
rgba = np.dstack([out, alpha])
OUT.mkdir(exist_ok=True)
# The photo is low-res for a full wrap; a gentle unsharp mask restores edge crispness.
color_img = Image.fromarray((rgba * 255).round().astype(np.uint8), "RGBA")
color_img = color_img.filter(ImageFilter.UnsharpMask(radius=2.2, percent=70, threshold=2))
color_img.save(OUT / "front.webp", quality=94, method=6)

# PBR: gold ink is metal, green brushwork semi-metallic, white ink matte,
# petrol a satin lacquer.
R_, G_, B_ = out[..., 0], out[..., 1], out[..., 2]
mx, mn = out.max(2), out.min(2)
sat = (mx - mn) / np.maximum(mx, 1e-3)
gold = np.clip(((R_ - B_) - 0.12) / 0.15, 0, 1) * np.clip((R_ - 0.3) / 0.15, 0, 1)
green = np.clip(((G_ - R_) - 0.12) / 0.12, 0, 1) * np.clip(((G_ - B_) - 0.02) / 0.1, 0, 1)
white = np.clip((mn - 0.55) / 0.2, 0, 1) * np.clip((0.25 - sat) / 0.15, 0, 1)
rough = 0.62 + gold * (0.4 - 0.62) + green * (0.5 - 0.62) + white * (0.7 - 0.62)
metal = 0.05 + gold * (0.55 - 0.05) + green * (0.2 - 0.05) + white * (0 - 0.05)
pbr = np.dstack([np.zeros_like(rough), rough, np.clip(metal, 0, 1), alpha])
img = Image.fromarray((pbr * 255).round().astype(np.uint8), "RGBA").filter(ImageFilter.SMOOTH)
img.save(OUT / "front-pbr.webp", quality=90, method=6)

# Vertical colour profile of the plain lacquer (median of the outer columns,
# away from the logo) so the procedural back can continue the gradient.
edge = (np.abs(theta) > np.radians(55)) & (np.abs(theta) < np.radians(72))
prof = np.median(out[:, edge], axis=1)
stops = [(round(i / 10, 2), "#%02x%02x%02x" % tuple((prof[min(LABEL_H - 1, int(i / 10 * LABEL_H))] * 255).astype(int))) for i in range(11)]
print("front", width, "x", LABEL_H)
print("lacquer stops", stops)
