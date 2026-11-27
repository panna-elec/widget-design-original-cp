# 参考元・素材・ライセンス

2026-11-27のユーザー承認により、独自コード・付随文書・組み込みの鯉SVGは[GPL-3.0-or-later](LICENSE)、独立した壁紙・README画像は[CC BY 4.0](LICENSES/CC-BY-4.0.txt)として適用し、Privateリポジトリへ反映しました。名義はpanna-elec、[LICENSE_SCOPE.md](LICENSE_SCOPE.md)に対象と例外を明記しています。第三者の条件を変更せず、後続の明示依頼によりwidgetのソースコードをGitHubでPublic公開する方針です。mypageはPrivateを維持します。下記のPrivate保存・公開前点検は各作業時点の履歴です。実機への言語・通信機能の反映は別途の依頼で実施した記録があり、VALIDATION.mdに確認範囲を記載しています。

## 同梱フォント

| フォント | 著作権者 | 条件・原文 |
| --- | --- | --- |
| Rajdhani Medium / SemiBold | Copyright (c) 2014, Indian Type Foundry | [SIL OFL 1.1原文](cyberdeck.widget/lib/fonts/OFL-Rajdhani.txt) |
| Orbitron Variable | Copyright 2018 The Orbitron Project Authors。Reserved Font Name: Orbitron | [SIL OFL 1.1原文](cyberdeck.widget/lib/fonts/OFL-Orbitron.txt) |

[Google Fonts](https://github.com/google/fonts)から取得したTTFを未改変で保持しています。[SOURCE.txt](cyberdeck.widget/lib/fonts/SOURCE.txt)に取得元と取得日があります。著作権表示・OFL原文を削除しません。日本語のシステムフォント本体は同梱しません。

## READMEの技術アイコン

[Devicon](https://github.com/devicons/devicon)のHTML/CSS/JavaScript/Swift/Python/Node.jsのSVGを、形状・色を変えず同梱しています。配布条件はMIT、Copyright (c) 2015 konpa。[ライセンス原文](docs/technical/stack-icons/LICENSE)と[固定コミット・個別出典](docs/technical/stack-icons/README.md)を保持します。使用技術の識別のみが目的です。

DeviconのMITは各ブランドの商標権を付与するものではありません。Swift and the Swift logo are trademarks of Apple Inc. プロジェクト全体への一括ライセンス付与は行いません。

## 実行環境と任意の制作参照記録

| 参照元 | 参考にした内容・扱い | 上流の権利情報 |
| --- | --- | --- |
| [jrcn1991/theme-cyberkde](https://github.com/jrcn1991/theme-cyberkde) | 配色、角のある枠、パネル、短い起動・文字演出。制作上の任意の参照記録。コード・素材の転用を示す一致は今回の照合で未検出。必須クレジットとして扱わない | [CREDITS.md](https://github.com/jrcn1991/theme-cyberkde/blob/main/CREDITS.md)。主なコードGPL-3.0-or-later、指定された壁紙・アイコンCC BY-SA 4.0。素材ごとに条件が異なる |
| [felixhageloh/uebersicht](https://github.com/felixhageloh/uebersicht) | 実行ホストとマウス通知・描画層の仕様調査。アプリ本体・上流コードは非同梱。ただし専用APIを直接利用するため独自コードにGPL-3.0-or-laterを採用 | [GPL v3原文](https://github.com/felixhageloh/uebersicht/blob/master/LICENSE)。利用時は上流の各ファイルの表記も参照 |
| [FelixKratz/SketchyBar](https://github.com/FelixKratz/SketchyBar) | 任意の上部バーの実行環境と配置仕様調査。設定のみ同梱、アプリ本体は非同梱 | [GPL v3原文](https://github.com/FelixKratz/SketchyBar/blob/master/LICENSE.md) |
| [panna-elec/panna-elec-mypage](https://github.com/panna-elec/panna-elec-mypage) | 手元のver2の文字化け・横帯・選択線を参考に新規実装。画像・音・フォント・vendor CSSは移植していない | 制作時の参照記録は[ASSETS.md](ASSETS.md)。第三者CSSの条件を本リポジトリへ流用していない |
| [Apple Darwin XNU](https://github.com/apple/darwin-xnu/blob/main/bsd/net/rtsock.c) / macOS SDK | ネットワーク統計APIの構造確認。参照先ソースは非同梱 | 上流の対象ファイルに記載された権利表示を参照 |

CyberKDEのコード・素材の区別と上記実行ホストのLICENSEは2026-11-25に公式リポジトリを確認しました。参考元の名前を記載することだけで、素材利用の許可や派生性の判断が完了するとは扱いません。CyberKDEには別扱いの商標ロゴもありますが、本制作物にそのロゴは同梱していません。

参照画面・配色データの個別URL、調べたÜbersichtのネイティブ実装などは[ASSETS.md](ASSETS.md)へ残しています。

## 独自の壁紙・鯉・コード

幾何学的な壁紙のSVGはコードで制作し、PNGは作業用の`@resvg/resvg-js`で変換した記録があります。変換ツール本体は同梱していません。

鯉のSVG輪郭はpanna-elecがOpenAIの画像生成機能で制作した鯉の姿勢を参考にした表現です。元画像のSHA-256はmypageの制作時画像と一致し、生成記録 `04-electric-koi` とAI生成来歴を2026-11-27に照合しました。元ラスタ画像は同梱していません。出所確認は完了しましたが、独占的著作権・第三者権利の非侵害保証とは別です。組み込みSVGはGPL対象、READMEの独立画像はCC BY対象として明示しました。詳細は[ASSETS.md](ASSETS.md)。

`original cp`はこの制作物の管理用タイトルです。すべての表現が他作品と無関係、または権利処理済みであることを表すものではありません。

## 記録の維持

- 同梱素材と対象コードのハッシュは[asset-inventory.csv](asset-inventory.csv)。出所・確認状況も併記します。
- フォントの原文は要約で置き換えません。
- 別の素材・上流コードを導入する際は、利用条件・改変箇所・表示義務を個別に確認します。
- Publicへの変更や第三者配布の前に、採用素材・参考表現・商標・ライセンス適用範囲を再確認します。


## READMEの画面キャプチャ

[docs/media](docs/media/README.md)のJPEG・GIFは、この実装のプレビューを撮影した説明用媒体。既存の壁紙・鯉の参考表現・同梱フォントを含み、これらの権利条件・未確認事項を引き継ぐ。画像生成で作ったUIやユーザーの実デスクトップ画面は含めていない。


## CyberKDEとÜbersichtの扱い（2026-11-27）

CyberKDEは制作上の刺激となった参考作品であり、今回の比較で独自コード・画像の転載を示す一致は検出していない。アイデアだけを参考にした独立実装という前提なら、GPL/CC BY-SAによる必須の出典表示とは扱わない。制作経緯を隠したり、同梱しているOFL等の第三者表示を削除したりするものではない。

Übersichtは公式READMEでGPL-3.0-or-later。現在のウィジェットは`run`、同一DOMへの描画、ネイティブ通知等を使うため、単なる別プロセス利用とは区別する。自作コードへのMITはGPL互換の選択肢だが、ホストや結合物をMITへ置き換えることにはならない。GPL-3.0-or-laterを採用し、原文・名義・適用範囲・対応ソースの説明を整備しました。採用までの比較を[LICENSE_REVIEW.md](docs/LICENSE_REVIEW.md)へ記録した。例外許諾や権利者の個別回答を得たとは報告しない。


## 英語・日本語READMEとPrivate更新（2026-11-27）

反映結果: ライセンスと英日READMEは`34ab847`、任意の参考作品紹介をREADMEから外す修正は`ca22f05`でPrivate反映済み。

README.mdを英語標準版、README.ja.mdを日本語版に整理。概要・画像、機能、技術スタック、起動・操作、構成、確認済み環境と検証範囲、対象別ライセンス、関連文書を案内する。素材本体は変更せず、既存の画像・技術アイコンとその出典を再利用する。

ユーザーから、このライセンス・関連文書・READMEの更新を個人情報確認後に既存のPrivateリポジトリへ反映する指示を受けた。以前の「送信なし」「ローカルのみ」は各作業時点の履歴であり、今回の送信許可と区別する。Public化・Pages・Release・外部ホスティング・実機更新は対象外。


## Language, connection types and English media refresh (2026-11-27)

言語切替・通信方式表示の変更と、英語で再収録したREADME媒体を、ユーザーの明示依頼により`c75de52`で既存Privateリポジトリへ送信済み。独自i18n.jsは既存GPL-3.0-or-later範囲。差し替えたJPEG/GIF4点は既存CC BY 4.0範囲と第三者の帰属・例外を保持。新しい第三者素材は追加していない。今回の機能は別途依頼により実機へ反映済み。Public化・Pages・外部ホスティングは行わない。


## 最終文書整理と再確認（2026-11-27）

確認基点はPrivateの`c75de52`。ライセンス、英日README、参考作品紹介の削除、言語切替・通信方式・英語デモの更新はGitHub反映済み。この点検はローカルで実施。その後の明示依頼により、本整理を既存Privateリポジトリへの反映対象とした。Public化・実機更新は行っていない。

- Git管理99ファイルと到達可能な6コミットのファイル名・テキスト・コミット名義を点検。対象の個人名・端末パス・代表的な秘密情報は検出なし。フォント原文の公開連絡先は必要な著作権表示として保持。
- 素材台帳53件のSHA、文書参照先、GPLとCC原文コピーの一致を再確認。英日READMEにCyberKDEの記載はなく、調査根拠は権利文書に保持。
- 画像・フォント・実行コード・第三者ライセンス原文は変更していない。英語デモ130画像の既存OCR記録はdocs/PRIVACY_CHECK.mdを参照。今回OCR・実機操作・全テストを再実行したとは扱わない。
- GitHubのPrivate・Pages無効を確認。ブランチはmainのみで、タグ・Release・Issue/PR・Actions実行履歴・成果物はいずれもなし。実機の個人設定・ログ・バックアップ・コンパイル済みstatsはGit管理外。

確認範囲でソース公開を止める具体的な権利・個人情報の不備は検出していない。公開操作は別途の明示依頼が必要。新規Mac・Intel・複数画面・実スリープ復帰等は未検証として維持する。実行ファイル入りの配布物を作る際は、対応ソース・ビルド手順・表示を改めて照合する。実機更新の検証記録と、デスクトップWKWebViewでの直接操作が未確認であることを区別する。


## ソースコードのPublic公開（2026-11-27）

ユーザーの明示依頼により、公開対象を`panna-elec/widget-design-original-cp`の既存ソースリポジトリに限定する。mypageはPrivateを維持し、旧保管リポジトリ・ローカルバックアップは対象外。GitHub Pages、外部ホスティング、実行ファイル入りRelease、実機の再インストールは今回の対象外。

公開前点検の基点は`423f1b6`。現状説明を英日README・権利文書・作業ルールへ反映する。画像・フォント・実行処理・ライセンス原文は変更しない。`package.json`の`private: true`は意図しないnpm配布を防ぐ設定として保持し、GitHubのPublic/Privateとは別に扱う。

以前の「Public化は対象外」「公開未実施」は、その節の作業時点を示す。今回の明示依頼がwidgetのソース公開を承認する。今後の更新・別の公開先・配布形態への継続許可とは扱わない。
