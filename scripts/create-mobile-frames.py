#!/usr/bin/env python3
"""Crop all hero frames into 9:16 portrait for mobile."""
from PIL import Image
from pathlib import Path
import os

SRC_DIR = Path("assets/firstAnimNueva")
DST_DIR = Path("public/firstAnim")
DST_PREFIX = "ezgif-frame-mobile-"
DST_EXT = ".webp"
TARGET_RATIO = 9 / 16  # portrait

os.makedirs(DST_DIR, exist_ok=True)

pngs = sorted([f for f in os.listdir(SRC_DIR) if f.lower().endswith(".png")])
print(f"Found {len(pngs)} PNG frames.")

for fname in pngs:
    src_path = SRC_DIR / fname
    # Extract frame number
    num = fname.replace("ezgif-frame-", "").replace(".png", "")
    dst_name = f"{DST_PREFIX}{num}{DST_EXT}"
    dst_path = DST_DIR / dst_name

    with Image.open(src_path) as img:
        w, h = img.size
        current_ratio = w / h

        if current_ratio > TARGET_RATIO:
            # Frame is wider: crop sides
            new_w = int(h * TARGET_RATIO)
            left = (w - new_w) // 2
            top = 0
            right = left + new_w
            bottom = h
        else:
            # Frame is taller: crop top/bottom (unlikely for 16:9)
            new_h = int(w / TARGET_RATIO)
            left = 0
            top = (h - new_h) // 2
            right = w
            bottom = top + new_h

        cropped = img.crop((left, top, right, bottom))
        # Resize to common mobile size (450x800) for consistency
        cropped = cropped.resize((450, 800), Image.LANCZOS)
        cropped.save(dst_path, "WEBP", quality=85)
        print(f"  {dst_name} ({cropped.size[0]}x{cropped.size[1]})")

print(f"\nDone! {len(pngs)} mobile frames created in {DST_DIR}")
