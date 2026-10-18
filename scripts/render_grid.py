from PIL import Image, ImageDraw, ImageFont
import os

font_d2r = ImageFont.truetype('scripts/d2r_font.ttf', 32)
font_label = ImageFont.load_default()

# Grid: 10 columns, 10 rows per image
def render_batch(start_idx, count, filename):
    cell_w, cell_h = 100, 60
    cols = 10
    rows = (count + cols - 1) // cols
    img = Image.new('RGB', (cols * cell_w, rows * cell_h), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)

    for i in range(count):
        idx = start_idx + i
        if idx >= 472:
            break
        code = 0xf100 + idx
        col = i % cols
        row = i // cols
        x = col * cell_w
        y = row * cell_h

        # draw border
        draw.rectangle([x, y, x + cell_w - 1, y + cell_h - 1], outline=(200, 200, 200))
        # draw label: d2rw{idx} (F1xx)
        draw.text((x + 2, y + 2), f"{idx}: {code:04X}", fill=(100, 100, 100), font=font_label)
        # draw char
        char = chr(code)
        draw.text((x + 15, y + 18), char, fill=(0, 0, 0), font=font_d2r)

    img.save(filename)
    print(f"Saved {filename}")

os.makedirs('scripts/debug_images', exist_ok=True)
render_batch(0, 100, 'scripts/debug_images/grid_0_100.png')
render_batch(100, 100, 'scripts/debug_images/grid_100_200.png')
render_batch(200, 100, 'scripts/debug_images/grid_200_300.png')
render_batch(300, 100, 'scripts/debug_images/grid_300_400.png')
render_batch(400, 72, 'scripts/debug_images/grid_400_472.png')
