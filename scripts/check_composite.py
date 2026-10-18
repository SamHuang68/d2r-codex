from fontTools.ttLib import TTFont

font = TTFont('scripts/d2r_font.ttf')
glyf = font['glyf']

for name in ['d2rw1', 'd2rw9', 'd2rw17', 'd2rw19', 'd2rw26', 'd2rw27', 'd2rw28']:
    g = glyf[name]
    print(f"{name}: isComposite={g.isComposite()}")
    if g.isComposite():
        print(f"  Components: {[c.glyphName for c in g.components]}")
