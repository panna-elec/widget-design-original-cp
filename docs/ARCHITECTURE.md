# 構造とデータの流れ

## 前景と背景

`index.jsx`は5秒ごとに`collect.py`を実行します。Swift製`stats`の実測値、Pythonの保存状態、デスクトップ表示状態をまとめ、`metrics.js`がCPUと通信の差分を計算します。

`native-surface.js`は`surface.html`をÜbersichtの主画面へ配置します。操作パネルを内側iframeへ閉じ込めず、ホスト画面でマウスイベントを扱います。`native-pointer.js`は表示中のパネル領域を検証し、Übersichtの`widgetEnter/widgetLeave`通知を送ります。角の切り欠き、外側への移動、ドラッグ終了、フォーカス喪失も扱います。

`background.jsx`は背景用の非操作iframeを持ちます。画面ごとのキーで保存した領域・電源・演出設定を`localStorage`とメッセージで受け取り、`ambient.js`がSVGの光を描画します。パネル周辺にはマスクを置きます。背景はクリックを受け取りません。

```text
stats (Swift) ── collect.py ── index.jsx ── 主画面のパネル
                     │                          │
                 desk_store.py ← 保存要求 ───────┘
                                                │
                        領域・演出設定 ─ localStorage
                                                │
                                   background.jsx
                                                │
                                 ambient.js + koi.js
```

## 状態と描画

- `desk-model.mjs`: 初期状態、残量段階、配置の計算。
- `desk.js`: デスクのタブ・フォーム・保存要求・配置編集。
- `desk_store.py`: 入力検証、排他ロック、revisionの競合検知、原子的な状態ファイル更新。
- `surface.js`: 時計・計測値・デザインの更新。
- `koi.js`: SVG輪郭と表示倍率。100/115/130%から選択。
- `ambient.css`: 輪郭・光・残光の線幅。100/130/160%から選択。

鯉の色、大きさ、線幅は別々の設定です。色が固定の場合は充電状態で鯉の色を変えません。サイズ・線幅の未設定値は100%として既存状態を読み込みます。

## 計測の意味

CPUは全コアのuser/system/nice累積値の差分を全差分で割った値です。初回や長い取得間隔では数値を出しません。メモリはActive + Wired + Compressedの物理ページ量の概算で、Activity Monitorと同一の定義ではありません。

通信は稼働中のenNインターフェースの累積バイト差分で、パケット取得や通信内容の収集はしません。VPN・ブリッジなどは二重計上を避けるため対象外です。SSD空きはホームを置くファイルシステムの値です。

## 実行環境への依存

Übersicht内の描画とマウス通知、macOSのFinder設定、Homebrewの配置パスに依存します。標準以外のウィジェット保存先・複数画面・将来のmacOSへの互換性は未確認です。検証済み範囲は[VALIDATION.md](../VALIDATION.md)を参照してください。
