"""
Crops the rendered turntable frames to their common bounding box and writes
them as WebP for the site (public/can/frame-NNN.webp).

  python3 scripts/pack-frames.py RENDER_DIR [--height 1400]
"""
import argparse
from pathlib import Path

from PIL import Image

p = argparse.ArgumentParser()
p.add_argument("src")
p.add_argument("--height", type=int, default=1400)
p.add_argument("--out", default="public/can")
a = p.parse_args()

frames = sorted(Path(a.src).glob("frame-*.png"))
box = None
for f in frames:
    alpha = Image.open(f).getchannel("A").point(lambda v: 255 if v > 6 else 0)
    b = alpha.getbbox()
    box = b if box is None else (min(box[0], b[0]), min(box[1], b[1]), max(box[2], b[2]), max(box[3], b[3]))

# Keep the can centred horizontally so the stage can position it by its middle.
w = Image.open(frames[0]).width
half = max(w / 2 - box[0], box[2] - w / 2)
box = (int(w / 2 - half), box[1], int(w / 2 + half), box[3])

out = Path(a.out)
out.mkdir(parents=True, exist_ok=True)
for f in frames:
    im = Image.open(f).crop(box)
    if im.height > a.height:
        im = im.resize((round(im.width * a.height / im.height), a.height), Image.LANCZOS)
    im.save(out / f"{f.stem}.webp", quality=86, method=6)
print(len(frames), "frames", box, "->", im.size)
