from fontTools.ttLib import TTFont
import numpy as np

font = TTFont('scripts/d2r_font.ttf')
glyf = font['glyf']

# Let's inspect the first 10 glyphs
for i in [1, 9, 17, 19, 26, 27, 28]: # f101, f109, f111, f113, f11a, f11b, f11c
    name = f'd2rw{i}'
    g = glyf[name]
    print(f"\nGlyph {name}: numberOfContours={g.numberOfContours}, xMin={g.xMin}, yMin={g.yMin}, xMax={g.xMax}, yMax={g.yMax}")
    # g.coordinates
    if hasattr(g, 'coordinates'):
        print(f"  Coordinates count: {len(g.coordinates)}")
