# 参考元・素材・ライセンス

この文書は、同梱したものと制作時の参考・実行環境を区別するための記録です。プロジェクト全体にMIT、GPL等の一括ライセンスは付与していません。現在の用途はPrivateリポジトリでの保存準備であり、一般公開・第三者への配布が確認済みであることを意味しません。

## 同梱フォント

| フォント | 著作権者 | 条件・原文 |
| --- | --- | --- |
| Rajdhani Medium / SemiBold | Copyright (c) 2014, Indian Type Foundry | [SIL OFL 1.1原文](cyberdeck.widget/lib/fonts/OFL-Rajdhani.txt) |
| Orbitron Variable | Copyright 2018 The Orbitron Project Authors。Reserved Font Name: Orbitron | [SIL OFL 1.1原文](cyberdeck.widget/lib/fonts/OFL-Orbitron.txt) |

[Google Fonts](https://github.com/google/fonts)から取得したTTFを未改変で保持しています。[SOURCE.txt](cyberdeck.widget/lib/fonts/SOURCE.txt)に取得元と取得日があります。著作権表示・OFL原文を削除しません。日本語のシステムフォント本体は同梱しません。

## デザイン・実装の参照元

| 参照元 | 参考にした内容・扱い | 上流の権利情報 |
| --- | --- | --- |
| [jrcn1991/theme-cyberkde](https://github.com/jrcn1991/theme-cyberkde) | 配色、角のある枠、パネル、短い起動・文字演出。制作記録上、コード・画像・動画はコピーせずMac用に実装 | [CREDITS.md](https://github.com/jrcn1991/theme-cyberkde/blob/main/CREDITS.md)。主なコードGPL-3.0-or-later、指定された壁紙・アイコンCC BY-SA 4.0。素材ごとに条件が異なる |
| [felixhageloh/uebersicht](https://github.com/felixhageloh/uebersicht) | 実行ホストとマウス通知・描画層の仕様調査。アプリ本体・上流コードは非同梱 | [GPL v3原文](https://github.com/felixhageloh/uebersicht/blob/master/LICENSE)。利用時は上流の各ファイルの表記も参照 |
| [FelixKratz/SketchyBar](https://github.com/FelixKratz/SketchyBar) | 任意の上部バーの実行環境と配置仕様調査。設定のみ同梱、アプリ本体は非同梱 | [GPL v3原文](https://github.com/FelixKratz/SketchyBar/blob/master/LICENSE.md) |
| [panna-elec/panna-elec-mypage](https://github.com/panna-elec/panna-elec-mypage) | 手元のver2の文字化け・横帯・選択線を参考に新規実装。画像・音・フォント・vendor CSSは移植していない | 制作時の参照記録は[ASSETS.md](ASSETS.md)。第三者CSSの条件を本リポジトリへ流用していない |
| [Apple Darwin XNU](https://github.com/apple/darwin-xnu/blob/main/bsd/net/rtsock.c) / macOS SDK | ネットワーク統計APIの構造確認。参照先ソースは非同梱 | 上流の対象ファイルに記載された権利表示を参照 |

CyberKDEのコード・素材の区別と上記実行ホストのLICENSEは2026-11-25に公式リポジトリを確認しました。参考元の名前を記載することだけで、素材利用の許可や派生性の判断が完了するとは扱いません。CyberKDEには別扱いの商標ロゴもありますが、本制作物にそのロゴは同梱していません。

参照画面・配色データの個別URL、調べたÜbersichtのネイティブ実装などは[ASSETS.md](ASSETS.md)へ残しています。

## 独自の壁紙・鯉・コード

幾何学的な壁紙のSVGはコードで制作し、PNGは作業用の`@resvg/resvg-js`で変換した記録があります。変換ツール本体は同梱していません。

鯉のSVG輪郭はユーザー提供画像の姿勢を参考にした派生表現です。提供画像や生成ラスタ画像は同梱していません。元画像の名前・SHA-256・制作過程は[ASSETS.md](ASSETS.md)に記録しています。出所の記録と、独占的著作権・第三者権利の非侵害保証は別であり、一般公開・再配布の権利確認は未完了です。

`original cp`はこの制作物の管理用タイトルです。すべての表現が他作品と無関係、または権利処理済みであることを表すものではありません。

## 記録の維持

- 同梱素材と対象コードのハッシュは[asset-inventory.csv](asset-inventory.csv)。出所・確認状況も併記します。
- フォントの原文は要約で置き換えません。
- 別の素材・上流コードを導入する際は、利用条件・改変箇所・表示義務を個別に確認します。
- Publicへの変更や第三者配布の前に、採用素材・参考表現・商標・ライセンス適用範囲を再確認します。
