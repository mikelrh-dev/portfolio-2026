#!/usr/bin/env python3
"""Crop the first hero frame into a 9:16 vertical version for mobile."""
from PIL import Image
from pathlib import Path

# Input / output
src = Path("public/firstAnim/ezgif-frame-001.webp")
dst = Path("public/firstAnim/ezgif-frame-001-mobile.webp")

# Open frame
with Image.open(src) as img:
    w, h = img.size
    # Target: 9:16 portrait crop from the center
    target_ratio = 9 / 16  # width / height
    current_ratio = w / h
    if current_ratio > target_ratio:
        # Current image is wider: crop sides
        new_w = int(h * target_ratio)
        new_h = h
        left = (w - new_w) // 2
        top = 0
        right = left + new_w
        bottom = h
    else:
        # Current image is taller (unlikely for 16:9): crop top/bottom
        new_w = w
        new_h = int(w / target_ratio)
        left = 0
        top = (h - new_h) // 2
        right = w
        bottom = top + new_h
    cropped = img.crop((left, top, right, bottom))
    cropped.save(dst, "WEBP")
    print(f"Created {dst} ({cropped.size[0]}x{cropped.size[1]}) from {src} ({w}x{h})")
