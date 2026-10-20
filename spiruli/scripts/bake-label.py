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
CX, R = 464.5, 193.5
TOP, BOTTOM = 130, 1105

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
target = np.median(med[int(CX - R * 0.3) : int(CX + R * 0.3)])
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
Image.fromarray((rgba * 255).round().astype(np.uint8), "RGBA").save(OUT / "front.webp", quality=92, method=6)

# PBR: gold ink is metal, green brushwork semi-metallic, white ink matte,
# petrol a satin lacquer.
R_, G_, B_ = out[..., 0], out[..., 1], out[..., 2]
mx, mn = out.max(2), out.min(2)
sat = (mx - mn) / np.maximum(mx, 1e-3)
gold = np.clip(((R_ - B_) - 0.12) / 0.15, 0, 1) * np.clip((R_ - 0.3) / 0.15, 0, 1)
green = np.clip(((G_ - R_) - 0.12) / 0.12, 0, 1) * np.clip(((G_ - B_) - 0.02) / 0.1, 0, 1)
white = np.clip((mn - 0.55) / 0.2, 0, 1) * np.clip((0.25 - sat) / 0.15, 0, 1)
rough = 0.45 + gold * (0.22 - 0.45) + green * (0.35 - 0.45) + white * (0.55 - 0.45)
metal = 0.2 + gold * (1 - 0.2) + green * (0.5 - 0.2) + white * (0 - 0.2)
pbr = np.dstack([np.zeros_like(rough), rough, np.clip(metal, 0, 1), alpha])
img = Image.fromarray((pbr * 255).round().astype(np.uint8), "RGBA").filter(ImageFilter.SMOOTH)
img.save(OUT / "front-pbr.webp", quality=90, method=6)

# Sample of the flattened petrol for the procedural back of the label.
pet = out[(np.abs(theta) < 0.4)[None, :].repeat(LABEL_H, 0) & (out.max(2) < 0.35) & (out[..., 2] > out[..., 0])]
print("front", width, "x", LABEL_H, "petrol #%02x%02x%02x" % tuple((np.median(pet, 0) * 255).astype(int)))
