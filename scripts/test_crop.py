from PIL import Image, ImageDraw, ImageFont
import numpy as np

font_d2r = ImageFont.truetype('scripts/d2r_font.ttf', 40)
font_orig = ImageFont.truetype('scripts/orig_roboto.ttf', 40)

def get_cropped(font, text):
    img = Image.new('L', (200, 100), color=255)
    draw = ImageDraw.Draw(img)
    draw.text((20, 20), text, fill=0, font=font)
    bbox = img.getbbox()
    if not bbox:
        return None
    return img.crop(bbox)

c1 = get_cropped(font_d2r, chr(0xf100))
c2 = get_cropped(font_orig, "9")
print(f"c1 size: {c1.size}, c2 size: {c2.size}")

# Test c1 against 0..9
for d in "0123456789":
    cd = get_cropped(font_orig, d)
    print(f"Digit {d}: size={cd.size}")
