from fontTools.ttLib import TTFont

orig = TTFont('scripts/orig_roboto.ttf')
d2r = TTFont('scripts/d2r_font.ttf')

orig_cmap = orig.getBestCmap()
d2r_cmap = d2r.getBestCmap()

orig_glyf = orig['glyf']
d2r_glyf = d2r['glyf']

print("Orig font glyph count:", len(orig.getGlyphOrder()))
print("D2R font glyph count:", len(d2r.getGlyphOrder()))

# Check standard characters in orig font
digits = {str(i): orig_cmap.get(ord(str(i))) for i in range(10)}
print("Orig digits glyph names:", digits)

# Let's inspect coordinates of orig '3' vs d2r 'd2rw9'
glyph_3 = orig_glyf[digits['3']]
d2rw9 = d2r_glyf['d2rw9']

print(f"Orig '3': contours={glyph_3.numberOfContours}, coords={len(glyph_3.coordinates) if hasattr(glyph_3, 'coordinates') else 0}")
print(f"D2R 'd2rw9': contours={d2rw9.numberOfContours}, coords={len(d2rw9.coordinates) if hasattr(d2rw9, 'coordinates') else 0}")
if hasattr(glyph_3, 'coordinates') and hasattr(d2rw9, 'coordinates'):
    diff = sum(abs(p1[0]-p2[0]) + abs(p1[1]-p2[1]) for p1, p2 in zip(glyph_3.coordinates, d2rw9.coordinates))
    print(f"Difference between Orig '3' and D2R 'd2rw9': {diff}")
