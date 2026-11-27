# Illustration prompts

Created with the built-in OpenAI image generation tool on 2026-11-27. These are explanatory illustrations, not screenshots. No API key or CLI fallback was used. Final PNGs use the existing project policy for independent artwork (CC BY 4.0, only rights the licensor can grant); third-party trademarks are excluded. Prompts below are provenance, not executable instructions.

## Japanese generation

```text
Use case: infographic-diagram. Asset type: Japanese quick-start illustration included in an offline installation manual for Widget Design, an Apple Silicon macOS desktop widget. Create a polished, very legible landscape infographic, approximately 1536x1024, with 6 numbered cards in a 3-column by 2-row grid. White / very light gray reading surface, dark navy text, thin angular crimson frames and small cyan accents, restrained cyberpunk dashboard aesthetic. Generous margins. Original simple illustrations: unbranded desktop monitor showing clock and system-meter panels, software boxes, ZIP folder plus checksum, terminal menu, a caution shield with a forked path to a generic settings gear or a stop symbol, refresh arrow, backup folder. Illustrate a process; do not reproduce a real macOS dialog or an actual screenshot. No Apple logo, no third-party logos, no people, no personal filenames or paths. No tiny text. Use the exact Japanese text below without adding technical claims or extra steps.
Title: "Widget Design 導入ガイド"
Subtitle: "Apple Silicon · プレビュー版"
Card 1 heading: "1  準備"
Card 1 text: "Übersicht + Python 3"
Card 2 heading: "2  ZIPを確認・展開"
Card 2 text: "チェックサムを照合"
Card 3 heading: "3  確認 → 導入"
Card 3 text: "Manage.command"
Card 4 heading: "4  警告が出たら"
Card 4 text: "入手元を確認 → システム設定"
Card 4 secondary text: "許可できない場合は停止"
Card 5 heading: "5  表示を確認"
Card 5 text: "Refresh all Widgets"
Card 5 secondary text: "約10秒待つ"
Card 6 heading: "6  困ったら"
Card 6 text: "マニュアルで確認"
Card 6 secondary text: "停止・復元"
Large amber footer notice: "未公証版です。「OK」だけで動くとは限りません。"
Small but readable footer: "説明用の図です。実際の画面・操作はmacOSにより異なります。"
Composition: title at top, step numbers clearly separated from artwork, clear row-major order 1 2 3 then 4 5 6 with subtle connecting arrows, textual footer at bottom. The warning card must show a conditional branch and a stop option, never imply automatic universal approval. Professional Japanese typesetting, crisp readable characters.
```

## English generation

```text
Use case: infographic-diagram. Asset type: English quick-start illustration included in an offline installation manual for Widget Design, an Apple Silicon macOS desktop widget. Create a polished, very legible landscape infographic, approximately 1536x1024, with 6 numbered cards in a 3-column by 2-row grid. White / very light gray reading surface, dark navy text, thin angular crimson frames and small cyan accents, restrained cyberpunk dashboard aesthetic. Generous margins. Original simple illustrations: unbranded desktop monitor showing clock and system-meter panels, software boxes, ZIP folder plus checksum, terminal menu, a caution shield with a forked path to a generic settings gear or a stop symbol, refresh arrow, backup folder. Illustrate a process; do not reproduce a real macOS dialog or an actual screenshot. No Apple logo, no third-party logos, no people, no personal filenames or paths. No tiny text. Use the exact English text below without adding technical claims or extra steps.
Title: "Widget Design Setup Guide"
Subtitle: "Apple Silicon · Preview"
Card 1 heading: "1  Prepare"
Card 1 text: "Übersicht + Python 3"
Card 2 heading: "2  Verify & unzip"
Card 2 text: "Compare the checksum"
Card 3 heading: "3  Check → Install"
Card 3 text: "Manage.command"
Card 4 heading: "4  If macOS blocks it"
Card 4 text: "Verify the source → Settings"
Card 4 secondary text: "No approval available? Stop."
Card 5 heading: "5  Check the display"
Card 5 text: "Refresh all Widgets"
Card 5 secondary text: "Wait about 10 seconds"
Card 6 heading: "6  Need help?"
Card 6 text: "Read the manual"
Card 6 secondary text: "Disable or restore"
Large amber footer notice: "Not notarized. Clicking OK alone may not be enough."
Small but readable footer: "Illustration only. Actual screens and steps vary by macOS version."
Composition: title at top, step numbers clearly separated from artwork, clear row-major order 1 2 3 then 4 5 6 with subtle connecting arrows, textual footer at bottom. The warning card must show a conditional branch and a stop option, never imply automatic universal approval. Professional typesetting, crisp readable characters.
```

## Final revision applied to both images

```text
Use case: precise-object-edit. Change only the artwork on the two software boxes in card 1: REMOVE the blue/yellow Python snake logo and any branded app icon on the Übersicht box. Replace these symbols with original generic small line-art glyphs: a simple terminal prompt >_ and two plain rectangles. Keep the written names Übersicht and Python 3. Do not use any trademark logo, including the Python snake logo. Preserve every existing word, all card titles, all Japanese or English letters, typography, layout, colors, step numbering, warnings and all other illustrations unchanged. The text is already correct and must not be rewritten. Keep the entire canvas with identical framing.
```
