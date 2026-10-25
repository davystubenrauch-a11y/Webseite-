"""Crop the transparent spin renders to the can, scale and save them as WebP
for components/can/FloatingCan.tsx; prints the --can-aspect for globals.css.

    python scripts/pack-spin.py <render dir> public/can [height]
"""
import glob
import os
import sys

from PIL import Image

src, out = sys.argv[1], sys.argv[2]
height = int(sys.argv[3]) if len(sys.argv) > 3 else 880
files = sorted(glob.glob(os.path.join(src, "spin-*.png")))
frames = [Image.open(f).convert("RGBA") for f in files]

# One crop box for all frames, so the can doesn't shift between them.
boxes = [f.split()[3].getbbox() for f in frames]
l, t = min(b[0] for b in boxes), min(b[1] for b in boxes)
r, b = max(b[2] for b in boxes), max(b[3] for b in boxes)
pad = 6
box = (max(l - pad, 0), max(t - pad, 0), r + pad, b + pad)
w = round((box[2] - box[0]) * height / (box[3] - box[1]))

os.makedirs(out, exist_ok=True)
for i, f in enumerate(frames):
    f.crop(box).resize((w, height), Image.LANCZOS).save(os.path.join(out, f"spin-{i:02d}.webp"), quality=84, method=6)
print(f"{len(frames)} frames, {w}x{height}, --can-aspect: {w}/{height}")
