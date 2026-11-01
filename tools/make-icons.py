"""Generates the placeholder app icons (PNG) with no dependencies. Run: python tools/make-icons.py"""
import math
import struct
import zlib
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "icons"


def png(path, size, maskable):
    bg1, bg2 = (108, 76, 241), (255, 95, 162)  # purple -> pink
    yellow, white = (255, 210, 63), (255, 255, 255)
    cx = cy = size / 2
    radius_corner = 0 if maskable else size * 0.22
    rows = []
    for y in range(size):
        row = bytearray([0])
        for x in range(size):
            t = (x + y) / (2 * size)
            r, g, b = (int(bg1[i] + (bg2[i] - bg1[i]) * t) for i in range(3))
            a = 255
            # rounded corners for the non-maskable icon
            if radius_corner:
                dx = max(radius_corner - x, 0, x - (size - 1 - radius_corner))
                dy = max(radius_corner - y, 0, y - (size - 1 - radius_corner))
                if dx * dx + dy * dy > radius_corner ** 2:
                    a = 0
            # five-point star in the middle (kept inside the maskable safe zone)
            ang = math.atan2(y - cy, x - cx) + math.pi / 2
            dist = math.hypot(x - cx, y - cy)
            if dist < size * 0.30 * (0.55 + 0.45 * abs(math.cos(2.5 * ang))):
                r, g, b = yellow
            if dist < size * 0.10:
                r, g, b = white
            row += bytes((r, g, b, a))
        rows.append(bytes(row))
    raw = b"".join(rows)

    def chunk(tag, data):
        c = struct.pack(">I", len(data)) + tag + data
        return c + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

    ihdr = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)
    path.write_bytes(b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b""))
    print("wrote", path.name)


OUT.mkdir(exist_ok=True)
png(OUT / "icon-192.png", 192, False)
png(OUT / "icon-512.png", 512, False)
png(OUT / "icon-maskable-512.png", 512, True)
