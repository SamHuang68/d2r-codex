#!/usr/bin/env python3
"""
產生 src/data/magicArtBox.json：暗金／套裝圖（static.d2r.world/img/items/magic/）中「物品實際範圍」。

這些圖是 1:2 畫布（196×392 或 98×196），物品只佔一部分，且底部帶有站名浮水印。
作法：同尺寸畫布的逐像素中位數 = 背景＋浮水印範本（物品會被濾掉）→ 再用「排除物品像素」
重估一次（避免樣本少的畫布被物品污染）→ 原圖與範本相減得到物品遮罩 → 取外框並加 2% 邊距。

用法：
  1. 下載要處理的圖到 IMG_DIR（網址清單可由 src/data/uniqueItems.ts、setItems.ts 的 imageUrl
     與 src/data/catalogImageMap.json 中 magic/ 開頭的項目取得）
  2. python3 scripts/image-assets/gen_magic_art_box.py <IMG_DIR> src/data/magicArtBox.json
需要 numpy 與 Pillow。圖片只在本機分析，不會進入專案。
"""
import json, os, sys
import numpy as np
from PIL import Image

PAD = 0.02          # 邊距（占畫布比例）
THRESH = 14         # 與範本的差（背景雜訊 p99.9 約 5，浮水印約 20）
MIN_PX = 2          # 行／列至少幾個差異像素才算內容（濾雜點）

def main(img_dir: str, out_path: str) -> None:
    files = sorted(f for f in os.listdir(img_dir) if f.lower().endswith('.jpg'))
    by_size: dict[tuple[int, int], list[str]] = {}
    for f in files:
        by_size.setdefault(Image.open(os.path.join(img_dir, f)).size, []).append(f)
    out: dict[str, list[float]] = {}
    for (w, h), fl in by_size.items():
        arr = np.stack([np.asarray(Image.open(os.path.join(img_dir, f)).convert('RGB'), dtype=np.float32) for f in fl])
        tmpl = np.median(arr, axis=0)
        # 第二輪：把明顯是物品的像素（含周圍 3px）設為 NaN 後重估範本
        art = (np.abs(arr - tmpl).max(axis=3) > THRESH)
        for _ in range(3):  # 簡易膨脹
            art = art | np.roll(art, 1, 1) | np.roll(art, -1, 1) | np.roll(art, 1, 2) | np.roll(art, -1, 2)
        masked = np.where(art[..., None], np.nan, arr)
        with np.errstate(all='ignore'):
            tmpl2 = np.nanmedian(masked, axis=0)
        tmpl = np.where(np.isnan(tmpl2), tmpl, tmpl2)
        for f, a in zip(fl, arr):
            mask = np.abs(a - tmpl).max(axis=2) > THRESH
            rows = np.where(mask.sum(axis=1) >= MIN_PX)[0]
            cols = np.where(mask.sum(axis=0) >= MIN_PX)[0]
            if len(rows) == 0 or len(cols) == 0:
                continue
            x0, x1, y0, y1 = cols[0], cols[-1] + 1, rows[0], rows[-1] + 1
            out[f] = [round(max(0, x0 / w - PAD), 3), round(max(0, y0 / h - PAD), 3),
                      round(min(1, x1 / w + PAD), 3), round(min(1, y1 / h + PAD), 3)]
    with open(out_path, 'w') as fh:
        fh.write(json.dumps(dict(sorted(out.items())), separators=(',', ':')))
    print(f'{len(out)} boxes -> {out_path}')

if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
