# 画像プロンプト一覧 v2 — 潮風ロジスティクス株式会社（redesign/v2）

生成ツール: `node C:/Users/unear/openai-image-generator/generate-image.js "PROMPT" out.png --project=shiokaze --purpose=<slug> --size=1536x1024 --quality=medium`
生成元 PNG は `images/_source/<slug>.png`、配信用は `images/<slug>.webp`（長辺1536px・WebP q82、すべて 300KB 以下）。
既存の `images/hero.jpg` / `images/about.jpg` は削除せず、`about.jpg` は会社案内のコラージュで引き続き使用。

## Style Anchor（全プロンプトに前置）

```
Photorealistic editorial photograph, shot on a full-frame camera with a 35mm lens, soft early-morning coastal light with a cool blue sky and warm low sun, natural colors, clean modern Japanese logistics company aesthetic, deep navy and white with subtle orange accents, no text, no logos, no watermarks.
```

## 画像一覧（12枚・すべて生成済み）

| # | slug | 用途 / 配置場所 | サイズ | 生成済み |
|---|------|----------------|--------|---------|
| 1 | hero-highway | ヒーロー背景（Ken Burns、`fetchpriority=high`） | 1536x1024 | ✅ |
| 2 | warehouse-interior | 会社案内コラージュ A／事業内容「倉庫保管・3PL」カード | 1536x1024 | ✅ |
| 3 | driver-portrait | 会社案内コラージュ B／選ばれる理由 01 | 1536x1024 | ✅ |
| 4 | dispatcher | 選ばれる理由 04（デジタル配送追跡） | 1536x1024 | ✅ |
| 5 | port-sunset | 事業内容「幹線輸送」カード／マーキー／お問い合わせ背景 | 1536x1024 | ✅ |
| 6 | delivery-handoff | 事業内容「地域配送」カード | 1536x1024 | ✅ |
| 7 | company-exterior | 拠点・アクセス写真／マーキー | 1536x1024 | ✅ |
| 8 | aerial-dc | 選ばれる理由 02／マーキー | 1536x1024 | ✅ |
| 9 | barcode-scan | マーキー | 1536x1024 | ✅ |
| 10 | sea-sparkle | 選ばれる理由セクション背景（パララックス） | 1536x1024 | ✅ |
| 11 | truck-dock | マーキー | 1536x1024 | ✅ |
| 12 | reefer-truck | 選ばれる理由 03（温度帯管理輸送）／マーキー | 1536x1024 | ✅ |

## プロンプト全文（Style Anchor の後ろに続ける）

### 1. hero-highway
Wide cinematic view of two modern white box trucks with a thin orange stripe driving along a coastal expressway at dawn, calm sea and distant port cranes on the left, guardrail, long road leading into the distance, slight haze, lots of negative space in the sky for a headline.

### 2. warehouse-interior
Interior of a large, bright, clean modern logistics warehouse with tall steel racks of shrink-wrapped pallets, polished concrete floor, a white forklift in the middle distance, a Japanese worker in a navy uniform and helmet walking, daylight from high windows.

### 3. driver-portrait
Portrait of a Japanese male truck driver in his 30s in a crisp navy uniform and cap, smiling confidently, standing beside the cab of a white truck, orange safety vest folded over his arm, shallow depth of field, port terminal softly blurred in the background.

### 4. dispatcher
A Japanese dispatcher in her 30s wearing a headset at a logistics control desk with three monitors showing route maps and schedules, calm focused expression, modern office with navy accents, soft window light, screens show only abstract map lines and bars with no readable text.

### 5. port-sunset
Container port at sunset, stacks of shipping containers in navy, white and orange, gantry cranes silhouetted against a warm orange and deep blue sky, calm sea reflecting the light, a single white truck on the quay road.

### 6. delivery-handoff
A Japanese delivery staff member in a navy uniform handing a cardboard parcel to a smiling Japanese shop owner in an apron at the entrance of a small neighborhood store, white delivery van parked behind, morning light, friendly and trustworthy mood.

### 7. company-exterior
Exterior of a modern logistics company headquarters with a white and navy facade, a fleet of six white box trucks with a thin orange stripe lined up neatly in the yard, clear morning sky, sea visible on the horizon behind the building.

### 8. aerial-dc
High-angle drone photograph of a large distribution center near the coast, long white warehouse roof, rows of white trucks docked at loading bays, access road curving toward a highway, sea and breakwater at the top of the frame, morning light with long soft shadows.

### 9. barcode-scan
Close-up of a Japanese warehouse worker's hands in work gloves scanning a barcode label on a cardboard box with a handheld scanner, red scan line glowing, shelves of boxes blurred in the background, shallow depth of field.

### 10. sea-sparkle
Abstract minimal photograph of a calm sea surface seen from above, gentle ripples with soft sunlight sparkle, pale teal and deep navy tones, very soft and clean, suitable as a quiet website background texture.

### 11. truck-dock
A white box truck reversed into the loading dock of a clean modern warehouse, roller door open, pallets being loaded by a worker with a hand pallet jack, orange dock bumpers, bright daylight, slightly low camera angle.

### 12. reefer-truck
A white refrigerated truck with a thin orange stripe parked at a cold-storage facility, a Japanese worker in a navy uniform checking a temperature display on the side of the refrigeration unit, cool clean light, faint cold mist from the open rear door.

## 再生成メモ
- 人物は日本人・写真調で統一。画像内に文字・ロゴを入れない（dispatcher のモニターも抽象図のみ）。
- 高品質ツールで再生成する場合も Style Anchor を前置し、同じ slug で `images/_source/` に上書き → WebP 変換（Pillow: `Image.open(p).convert('RGB').save(q,'WEBP',quality=82)`、長辺1600px以下）。
- サイト上の写真はすべて「AIによるコンセプトイメージ」注記付きで掲載している。
