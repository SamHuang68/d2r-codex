from PIL import Image, ImageDraw, ImageFont
import numpy as np

font_d2r = ImageFont.truetype('scripts/d2r_font.ttf', 32)
font_orig = ImageFont.truetype('scripts/orig_roboto.ttf', 32)

def render_char(font, text, size=(100, 50)):
    img = Image.new('L', size, color=255)
    draw = ImageDraw.Draw(img)
    draw.text((10, 10), text, fill=0, font=font)
    return np.array(img)

# Let's test idx 0: F100, which we saw is "9"
img_d2r_9 = render_char(font_d2r, chr(0xf100))
img_orig_9 = render_char(font_orig, "9")

diff = np.sum(np.abs(img_d2r_9.astype(int) - img_orig_9.astype(int)))
print("Difference between d2r F100 and orig '9':", diff)

# Let's test idx 1: F101, which is "14"
img_d2r_14 = render_char(font_d2r, chr(0xf101))
img_orig_14 = render_char(font_orig, "14")
diff14 = np.sum(np.abs(img_d2r_14.astype(int) - img_orig_14.astype(int)))
print("Difference between d2r F101 and orig '14':", diff14)
