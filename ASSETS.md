# 素材と実行環境の出所

現在の条件: 独自コードと組み込みの鯉SVGはGPL-3.0-or-later、独立画像はCC BY 4.0。[対象表](LICENSE_SCOPE.md)を参照してください。以下の制作経緯にある「未設定」は当時の記録です。素材台帳は言語切替モジュールを含め計53件です。

- wallpaper.svg / wallpaper.png：今回コードで新規制作した幾何学的な街並み。SVG原本を@resvg/resvg-jsで2560×1600 PNGへ変換。画像生成モデルの出力ではありません。
- preview / widget / Stats.swift / scripts：今回の独自実装。参考リポジトリからの素材・コードのコピーなし。SVGとPNGは同一素材IDで管理。
- フォント：日本語はシステムフォント。REFERENCE向けにRajdhani Medium/SemiBoldとOrbitron variableをGoogle Fontsから取得し、OFL原文・著作権表示・SOURCE.txtとともに同梱。TTFは未改変。
- 参考：CyberKDE https://github.com/jrcn1991/theme-cyberkde （意匠・演出の参考。配布物の転用なし）。
- 実行ホスト：Übersicht 1.6.82 / https://tracesof.net/uebersicht/ 。GPL-3.0-or-later。公式アプリを別途導入し、アプリに含まれる原文・著作権表示は変更せず保持。独自制作物へ自動的にライセンスを適用しない。
- 公式配布ZIP：https://tracesof.net/uebersicht/releases/Uebersicht-1.6.82.app.zip
- 公式ZIP SHA-256：39db5e0abf03f6390992511c946c19b97a89f84ebe2ac87219ebf921fffb972b
- 照合：https://formulae.brew.sh/api/cask/ubersicht.json
- SVG変換依存：@resvg/resvg-js（npmレジストリから作業用一時フォルダに導入、プロジェクトや配布物には同梱しない）。

ローカル用の試作。一般公開・配布はしていません。参考作品との類似性や第三者権利の非侵害を保証するものではありません。公開する際は採用素材と表示義務を改めて確認してください。

- wallpaper-cyber.svg / wallpaper-cyber.png：今回の調整でコードから新規制作したネオン街の図。固定シードの幾何図形・静的発光表現を使用。独自素材であり、CyberKDEやゲームの画像は転用していません。PNGは@resvg/resvg-jsで2560×1600に変換。


## REFERENCEで参照した画面
- https://github.com/jrcn1991/theme-cyberkde/blob/main/assets/readme/painel-status-en.jpg
- https://github.com/jrcn1991/theme-cyberkde/blob/main/assets/readme/widgets.jpg
- https://github.com/jrcn1991/theme-cyberkde/blob/main/assets/readme/painel-fui.jpg
- https://github.com/jrcn1991/theme-cyberkde/blob/main/assets/readme/papeis.png
- 配色の根拠：https://github.com/jrcn1991/theme-cyberkde/blob/main/tokens/corporacoes.json
- 字体の根拠：https://github.com/jrcn1991/theme-cyberkde/blob/main/CREDITS.md

これらのスクリーンショット・画像・ソースコードは制作物には同梱していません。新しい壁紙（wallpaper-reference.svg / .png）、枠・計器・レイアウトは独自実装です。配布元のGPL/CC BY-SAを独自実装全体へ自動適用していません。参照元に似せたローカル試作であり、一般公開・第三者権利の確認済みを意味しません。

RajdhaniはIndian Type Foundry、OrbitronはThe Orbitron Project Authorsの書体。SIL OFL 1.1。OFLはそのままlib/fonts/に保持。システム全体へフォントをインストールせず、この試作のローカルWebフォントとして参照します。

## 上部バー
SketchyBar 2.24.1を公式FelixKratz/formulaeのHomebrew tapから導入。https://github.com/FelixKratz/SketchyBar 。GPL-3.0。原文はHomebrewのSketchyBarインストール先LICENSE.mdに保持。アプリ本体はこのプロジェクトへ同梱していません。sketchybar/とscriptsの設定は独自実装。Rajdhaniは既存のOFL付きフォントをバー内へ読み込み、システム全体へのフォントインストールは行いません。

起動演出更新: boot-sequence.js / assembly.cssは独自実装。CyberKDEの枠描画・文字デコード・順次表示の説明を参考に、既存のMac用パネルへ実装。参照元のコード・アニメーション素材の複製はしていません。

操作演出更新: interactive.css / interactions.js とレーダーのCSS図形は独自実装。画像や外部素材の追加はありません。レーダーは装飾であり、探査や計測を行いません。

通信速度計更新: 独自のSwift統計取得、差分計算、HTML/CSSメーターとSVG履歴を追加。画像・書体・第三者コードの追加はありません。旧レーダーはバックアップだけに保持。APIの構造はApple SDKのnet/if.hおよびAppleの公開XNUソース（https://github.com/apple/darwin-xnu/blob/main/bsd/net/rtsock.c）を参照しました。

## マイページの演出を参考にした更新

参照: https://github.com/panna-elec/panna-elec-mypage の手元の現行ver2。EFFECTS.md、banner-signal.js、interaction-effects.js / .css、terminal-effects.js / .css、alddesign-integration.jsと権利記録を確認。文字化け、横帯、選択線という表現をMac用に新規実装しました。signal-effects.js / .cssが今回の追加ファイルです。

マイページの画像・音源・フォント・vendor CSSはコピーしていません。第三者のCSSコードの移植や新規ライブラリ追加もありません。追加ファイルはasset-inventory.csvにSHA-256付きで記録。ローカル試作であり配布ライセンスは未設定。GitHubの内容取得は失敗したためリモート版との一致は未確認です。

自動点滅調整: 既存signal-effects.js / .cssの周期と独自CSS装飾ラインを更新。追加素材なし。台帳のSHA-256を更新し、変更前はbackups/へ保存。

CYBER / CLEAN対応: 既存signal-effects.cssへ各デザイン用の発光位置・配色・文字位置を追加。surface.jsでデザイン切替時の信号演出取消を追加。外部素材・コード追加なし。台帳のCSSハッシュを更新。

## 背景の窓明かり・流れる光

ambient.html / ambient.js / ambient.cssは独自実装。既存の独自SVG壁紙の窓・ライン座標に沿った透過SVGをCSSでアニメーションします。CyberKDEの動く壁紙を表現の参考にしましたが、参照元の画像・動画・コード・音源はコピーしていません。追加の外部ライブラリはありません。3ファイルをasset-inventory.csvにSHA-256付きで登録。元のSVG／PNGは変更していません。

## 仕上げ調整のコード

background.jsxとlib/region-key.jsは独自実装で、同梱した第三者画像はありません。Übersichtの既存背景配置APIを利用しています。SketchyBarの左上バナーは同梱フォントと独自設定によるものです。調査に利用した公式実装: https://raw.githubusercontent.com/felixhageloh/uebersicht/master/Uebersicht/UBWindow.m 、https://raw.githubusercontent.com/FelixKratz/SketchyBar/master/src/bar.c 。第三者のソースコードは転記・同梱していません。

## 電源表示・手動設定

power-status.py、設定コマンド、保存処理は独自実装。新たな画像・フォントの配布物は追加していません。電源欄の日本語表示はmacOS既存システムフォントを利用し、フォントファイルをコピーしていません。電源状態の定義を参照: https://developer.apple.com/documentation/iokit/kiopsischargingkey 。


## デスクツール・残量連動

SSD／電源取得、収納・タスク・配置・保存、粒子、残量配色は独自実装。新しい外部画像・音・書体・ライブラリは同梱していない。SwiftはmacOS IOKitとFoundation、保存はPython標準ライブラリを利用。クリック通知の接続方法はÜbersicht公式のUBWebViewController.mおよび既存クライアントのwidgetEnter/widgetLeave方式を調査し、独自に接続した。第三者ソースの転記・同梱なし。既存のOFL原文は保持。ローカル試作であり公開の権利確認済みとは扱わない。


## 鯉の輪郭・配色候補・鑑賞モード（2026-11-25）

lib/koi.jsはユーザー提供の鯉画像の姿勢を参考に手作業で作成したSVG輪郭。ユーザーが承認した暗い光の画像案を参考に、短い光と残光をCSSで動かします。提供画像・生成ラスタ画像は実行用ウィジェットへ同梱していません。元画像の形を参照した派生表現であり、第三者権利の非侵害や独占的著作権を保証せず、2026-11-27に下記元画像のAI生成記録を照合し出所を確認済み。第三者向けの再利用許諾は未設定。プロジェクト全体に新たなライセンスを付与していません。

元画像名: ChatGPT 画像 2026年11月16日 05_51_29.png
元画像SHA-256: 57a1a2d62acd18ab677cd631e2e1f2779242b9232e6061fce407e2476b47b305

6配色の比較HTMLは同じSVGとCSSを内包したローカル確認用資料です。鑑賞モードはPython標準ライブラリとmacOSのdefaults/Finderを使用した独自実装で、新しい外部コード・画像・フォントは追加していません。CreateDesktop設定は現在の実機で往復動作を確認した実装で、将来のmacOSでの互換性を保証しません。既存OFL・権利記録は保持。


鯉のサイズ・線幅設定：既存SVGの表示倍率とCSSの線幅を変更する独自コードを追加。画像・フォント・第三者コードの追加はありません。鯉の参照元と権利確認状況は上記の記録を引き継ぎます。


## READMEの技術アイコン（2026-11-26）

HTML/CSS/JavaScript/Swift/Python/Node.jsの6アイコンをDevicon固定コミット`32fe1d3b3f36ad11f90ab94f7db59738139c2bf6`から採用。形状・色は無改変、ファイル名のみ短縮。README用であり実行用ウィジェットには含めない。MIT原文・著作権・上流パス・ハッシュは[出典](docs/technical/stack-icons/README.md)に保存。各ロゴの商標権は各権利者に帰属。


## README用の画面・動作（2026-11-26）

プレビューを実際に動かして撮影したJPEG2枚とGIF2本をdocs/media/へ追加。画像生成物ではない。個人のファイル・タスク・リンクを読み込まず、計測値は仮データ。GIFは連続スクリーンショットを縮小・符号化し操作待ちを短縮。既存の鯉・壁紙・フォントの権利確認状況を引き継ぐ。[撮影条件](docs/media/README.md)と素材台帳に記録。


## 鯉の出所と参照元の再確認（2026-11-27）

元画像SHA-256 `57a1a2d62acd18ab677cd631e2e1f2779242b9232e6061fce407e2476b47b305` は、mypageの旧制作画像 `04-electric-koi.png` と一致。mypageの `docs/provenance/avatar/generation-prompts.json` の `04-electric-koi`、C2PAのAI生成来歴と照合済み。制作主体はpanna-elec、生成機能はOpenAI。確認した来歴を記載し、旧画像本体や旧Git履歴はこのリポジトリへ持ち込まない。SVG・アニメーションは既存実装のままで、図案の再利用条件や独占性を新たに保証していない。

CyberKDEは任意の制作参照記録として保持する。2026-11-27の固定コミット照合では独自コード・画像の転用を示す一致を検出せず、共通のGoogle FontsとOFLのみ一致した。READMEから必須クレジットに見える紹介を外した。詳しい比較範囲・限界・Übersichtとのライセンス関係は[調査文書](docs/LICENSE_REVIEW.md)参照。過去の「ローカルのみ」「配布未確認」はその時点の経緯であり、現在はPrivate保存済み。後段の明示承認によりGPL-3.0-or-later／CC BY 4.0をローカル適用した。


## ユーザー承認によるライセンス適用（2026-11-27）

独自コード・付随する独自文書・koi.js内の鯉SVGをGPL-3.0-or-laterで許諾。独立した壁紙3種（SVGとPNG）とREADMEのJPEG2枚・GIF2本はCC BY 4.0。名義はpanna-elec、許諾できる権利の範囲で適用。フォントOFL・Devicon MIT・商標条件は保持。ここより前の「未設定」「未付与」は選択前の履歴であり、現在は[LICENSE_SCOPE.md](LICENSE_SCOPE.md)を優先する。画像・フォント・壁紙本体は変更していない。GitHub送信・公開・実機更新なし。


## Language, connection types and English media refresh (2026-11-27)

英語・日本語切替モジュールi18n.jsは独自コードとしてGPL-3.0-or-laterの対象。新しい外部素材は追加していない。接続分類はmacOS SystemConfigurationとIOKitを使用。README媒体4点を最新の英語プレビューで撮り直し、従来と同じCC BY 4.0対象パスを差し替えた。計53件の素材台帳ハッシュを更新。撮影・符号化条件はdocs/media/README.mdを参照。
