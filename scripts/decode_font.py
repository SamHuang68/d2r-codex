from fontTools.ttLib import TTFont
import json

font = TTFont('scripts/d2r_font.ttf')
cmap = font.getBestCmap()

# Check all characters in cmap
print(f"Total cmap entries: {len(cmap)}")

# Look at 0xf100 - 0xf1ff
pua_entries = {k: v for k, v in cmap.items() if 0xf100 <= k <= 0xf1ff}
print(f"PUA entries count: {len(pua_entries)}")

for code, glyph_name in sorted(pua_entries.items()):
    print(f"U+{code:04X} ({code}) -> {glyph_name}")

# Also let's check glyph order or glyph names in font
glyph_set = font.getGlyphSet()
print("Sample glyphs in font:", font.getGlyphOrder()[:30])
