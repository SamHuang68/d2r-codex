from PIL import Image, ImageDraw, ImageFont
import numpy as np
import json

font_d2r = ImageFont.truetype('scripts/d2r_font.ttf', 40)
font_orig = ImageFont.truetype('scripts/orig_roboto.ttf', 40)

# Build standard templates
symbols = "0123456789+-%./()"
templates = {}
for ch in symbols:
    img = Image.new('L', (80, 80), color=0)
    draw = ImageDraw.Draw(img)
    draw.text((20, 20), ch, fill=255, font=font_orig)
    bbox = img.getbbox()
    if bbox:
        cropped = img.crop(bbox)
        templates[ch] = np.array(cropped)

def match_char(patch):
    p_img = Image.fromarray(patch).resize((20, 30))
    p_arr = np.array(p_img).astype(float)
    p_arr = (p_arr - p_arr.mean()) / (p_arr.std() + 1e-5)

    best_ch = None
    best_score = -1.0
    for ch, t in templates.items():
        t_img = Image.fromarray(t).resize((20, 30))
        t_arr = np.array(t_img).astype(float)
        t_arr = (t_arr - t_arr.mean()) / (t_arr.std() + 1e-5)
        score = np.mean(p_arr * t_arr)
        if score > best_score:
            best_score = score
            best_ch = ch
    return best_ch, best_score

def recognize_glyph(code):
    img = Image.new('L', (300, 80), color=0)
    draw = ImageDraw.Draw(img)
    draw.text((20, 20), chr(code), fill=255, font=font_d2r)
    bbox = img.getbbox()
    if not bbox:
        return "", 1.0
    cropped = img.crop(bbox)
    arr = np.array(cropped)

    col_sums = np.sum(arr, axis=0)
    in_digit = False
    start_col = 0
    chars = []
    min_score = 1.0

    for col in range(len(col_sums)):
        if col_sums[col] > 0 and not in_digit:
            in_digit = True
            start_col = col
        elif col_sums[col] == 0 and in_digit:
            in_digit = False
            patch = arr[:, start_col:col]
            patch_bbox = Image.fromarray(patch).getbbox()
            if patch_bbox:
                patch = patch[patch_bbox[1]:patch_bbox[3], :]
            ch, score = match_char(patch)
            chars.append(ch)
            if score < min_score:
                min_score = score

    if in_digit:
        patch = arr[:, start_col:]
        patch_bbox = Image.fromarray(patch).getbbox()
        if patch_bbox:
            patch = patch[patch_bbox[1]:patch_bbox[3], :]
        ch, score = match_char(patch)
        chars.append(ch)
        if score < min_score:
            min_score = score

    return "".join(chars), min_score

mapping = {}
low_confidence = []

for idx in range(472):
    code = 0xf100 + idx
    text, score = recognize_glyph(code)
    mapping[chr(code)] = text
    if score < 0.85:
        low_confidence.append((idx, f"0x{code:04X}", text, score))

print(f"Total recognized: {len(mapping)}")
print(f"Low confidence count: {len(low_confidence)}")
for item in low_confidence:
    print("Low conf:", item)

with open('scripts/d2rw_map.json', 'w', encoding='utf-8') as f:
    json.dump(mapping, f, ensure_ascii=False, indent=2)

print("Saved scripts/d2rw_map.json successfully!")
