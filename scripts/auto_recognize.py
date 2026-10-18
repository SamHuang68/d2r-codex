from PIL import Image, ImageDraw, ImageFont, ImageOps
import numpy as np
import json

font_d2r = ImageFont.truetype('scripts/d2r_font.ttf', 40)
font_orig = ImageFont.truetype('scripts/orig_roboto.ttf', 40)

# Build standard digit templates
digit_templates = {}
for ch in "0123456789":
    img = Image.new('L', (80, 80), color=0)
    draw = ImageDraw.Draw(img)
    draw.text((20, 20), ch, fill=255, font=font_orig)
    bbox = img.getbbox()
    cropped = img.crop(bbox)
    digit_templates[ch] = np.array(cropped)
    print(f"Digit {ch} template shape: {digit_templates[ch].shape}")

def match_digit(patch):
    # Resize patch and template to standard 30x40 and compute normalized cross correlation
    p_img = Image.fromarray(patch).resize((20, 30))
    p_arr = np.array(p_img).astype(float)
    p_arr = (p_arr - p_arr.mean()) / (p_arr.std() + 1e-5)

    best_ch = None
    best_score = -1.0
    for ch, t in digit_templates.items():
        t_img = Image.fromarray(t).resize((20, 30))
        t_arr = np.array(t_img).astype(float)
        t_arr = (t_arr - t_arr.mean()) / (t_arr.std() + 1e-5)
        score = np.mean(p_arr * t_arr)
        if score > best_score:
            best_score = score
            best_ch = ch
    return best_ch, best_score

# Let's test on F100 (9) and F101 (14)
def recognize_glyph(code):
    img = Image.new('L', (200, 80), color=0)
    draw = ImageDraw.Draw(img)
    draw.text((20, 20), chr(code), fill=255, font=font_d2r)
    bbox = img.getbbox()
    if not bbox:
        return ""
    cropped = img.crop(bbox)
    arr = np.array(cropped)

    # Vertical projection to split digits
    col_sums = np.sum(arr, axis=0)
    in_digit = False
    start_col = 0
    digits = []

    for col in range(len(col_sums)):
        if col_sums[col] > 0 and not in_digit:
            in_digit = True
            start_col = col
        elif col_sums[col] == 0 and in_digit:
            in_digit = False
            patch = arr[:, start_col:col]
            # crop vertically
            patch_bbox = Image.fromarray(patch).getbbox()
            if patch_bbox:
                patch = patch[patch_bbox[1]:patch_bbox[3], :]
            ch, score = match_digit(patch)
            digits.append(ch)

    if in_digit:
        patch = arr[:, start_col:]
        patch_bbox = Image.fromarray(patch).getbbox()
        if patch_bbox:
            patch = patch[patch_bbox[1]:patch_bbox[3], :]
        ch, score = match_digit(patch)
        digits.append(ch)

    return "".join(digits)

print("Recognizing F100:", recognize_glyph(0xf100))
print("Recognizing F101:", recognize_glyph(0xf101))
print("Recognizing F105 (100):", recognize_glyph(0xf105))
print("Recognizing F142 (300):", recognize_glyph(0xf142))
print("Recognizing F2D7 (1633):", recognize_glyph(0xf100 + 471))
