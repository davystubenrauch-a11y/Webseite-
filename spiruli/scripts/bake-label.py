"""
Extracts the painted green/gold swoosh from the can photo
(public/spiruli-can.jpg) and unwraps it onto the label at 2× resolution:

  public/label/swoosh.webp       colour, alpha = swoosh only
  public/label/swoosh-pbr.webp   (0, roughness, metalness) with the same alpha

Everything else on the front (lacquer, wordmark, copy, band, badges, seal)
is redrawn as crisp vector art in lib/drawLabel.ts, because the photo is far
too low-res for a full can wrap.

Run from spiruli/:  python3 scripts/bake-label.py
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

SRC = Path("public/spiruli-can.jpg")
OUT = Path("public/label")

# Can geometry in the photo (pixels), measured from the lacquered body.
CX, R = 461.0, 197.0
TOP, BOTTOM = 140, 1097

# Label space is 2048 × 1640 (must match lib/drawLabel.ts); baked at 2×.
LABEL_W, LABEL_H = 2048, 1640
SCALE = 2
THETA_MAX = np.radians(80)

# Swoosh lives between these photo rows, outside the wordmark column and seal.
SWOOSH_Y = (262, 905)
WORD_X = (394, 530)
SEAL = (597.5, 305.0, 52.0)

src = np.asarray(Image.open(SRC).convert("RGB")).astype(np.float32) / 255
H_, W_ = src.shape[:2]

# Upscale the photo first (Lanczos), so the unwrap samples a smooth source.
UP = 4
big = Image.fromarray((src * 255).astype(np.uint8)).resize((W_ * UP, H_ * UP), Image.LANCZOS)
big = big.filter(ImageFilter.UnsharpMask(radius=3, percent=60, threshold=2))
big = np.asarray(big).astype(np.float32) / 255

width = int(np.ceil(THETA_MAX / (2 * np.pi) * LABEL_W)) * 2 * SCALE
height = LABEL_H * SCALE
theta = (np.arange(width) + 0.5 - width / 2) / (LABEL_W * SCALE) * 2 * np.pi
px = (CX + R * np.sin(theta)) * UP
py = (TOP + (np.arange(height) + 0.5) / height * (BOTTOM - TOP)) * UP

# Bilinear sampling of the upscaled photo.
x0 = np.clip(np.floor(px).astype(int), 0, W_ * UP - 2)
y0 = np.clip(np.floor(py).astype(int), 0, H_ * UP - 2)
fx = (px - x0)[None, :, None]
fy = (py - y0)[:, None, None]
a = big[y0][:, x0]
b = big[y0][:, x0 + 1]
c = big[y0 + 1][:, x0]
d = big[y0 + 1][:, x0 + 1]
out = (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy

# Photo coordinates of every label pixel, for the masks.
PX = (px / UP)[None, :].repeat(height, 0)
PY = (py / UP)[:, None].repeat(width, 1)

r, g, bch = out[..., 0], out[..., 1], out[..., 2]
# Swoosh = gold (red clearly above blue) or yellow-green brush (green above blue
# and red rising). The teal lacquer has red far below green and blue.
gold = np.clip(((r - bch) - 0.08) / 0.12, 0, 1)
leaf = np.clip(((g - bch) - 0.02) / 0.08, 0, 1) * np.clip(((r / np.maximum(g, 1e-3)) - 0.35) / 0.2, 0, 1)
alpha = np.maximum(gold, leaf)

zone = (PY > SWOOSH_Y[0]) & (PY < SWOOSH_Y[1]) & ~((PX > WORD_X[0]) & (PX < WORD_X[1]))
zone &= (PX - SEAL[0]) ** 2 + (PY - SEAL[1]) ** 2 > SEAL[2] ** 2
zone &= np.abs(theta)[None, :] < THETA_MAX - np.radians(6)
alpha = alpha * zone
alpha = np.asarray(Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))).astype(np.float32) / 255

rgba = np.dstack([out, alpha])
OUT.mkdir(exist_ok=True)
Image.fromarray((np.clip(rgba, 0, 1) * 255).round().astype(np.uint8), "RGBA").save(OUT / "swoosh.webp", quality=92, method=6)

# PBR: gold foil is metallic, the green brushwork a satin ink.
rough = 0.5 + gold * (0.32 - 0.5)
metal = 0.15 + gold * (0.8 - 0.15)
pbr = np.dstack([np.zeros_like(rough), rough, metal, alpha])
Image.fromarray((pbr * 255).round().astype(np.uint8), "RGBA").save(OUT / "swoosh-pbr.webp", quality=90, method=6)

for old in ("front.webp", "front-pbr.webp"):
    (OUT / old).unlink(missing_ok=True)
print("swoosh", width, "x", height)
