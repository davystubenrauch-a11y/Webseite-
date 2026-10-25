"""Lay transparent renders (render_scenes.py --bg none) over a flat page colour.

    python scripts/flatten.py ece6da out_dir in1.png in2.png ...
"""
import os
import sys

from PIL import Image

hex_, out = sys.argv[1], sys.argv[2]
bg = tuple(int(hex_[i:i + 2], 16) for i in (0, 2, 4))
os.makedirs(out, exist_ok=True)
for f in sys.argv[3:]:
    im = Image.open(f).convert("RGBA")
    flat = Image.new("RGBA", im.size, (*bg, 255))
    flat.alpha_composite(im)
    flat.convert("RGB").save(os.path.join(out, os.path.basename(f)))
