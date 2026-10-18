from fontTools.ttLib import TTFont

font = TTFont('scripts/d2r_font.ttf')
cmap = font.getBestCmap()

# Non-PUA entries in cmap
non_pua = {k: v for k, v in cmap.items() if not (0xf100 <= k <= 0xf1ff)}
print(f"Non-PUA entries count: {len(non_pua)}")
for code, glyph_name in sorted(non_pua.items())[:30]:
    try:
        ch = chr(code)
    except:
        ch = '?'
    print(f"U+{code:04X} '{ch}' -> {glyph_name}")

# Now let's inspect glyf table
glyf = font['glyf']
print("\nChecking glyph outlines:")
# Let's compare coordinates of d2rw0..d2rw255 with standard characters like 'zero', 'one', etc.
standard_chars = {}
for code, name in non_pua.items():
    if name in glyf:
        standard_chars[name] = glyf[name]

print(f"Standard glyphs available: {list(standard_chars.keys())[:20]}")
