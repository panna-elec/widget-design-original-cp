# 公開前ライセンス調査（2026-11-27）

対象: `widget-design-original-cp` の `0b612fd`。以下はライセンス選択前の調査記録。後続の2026-11-27の明示承認により案Aを採用し、独自コード・付随文書・組み込みの鯉SVGへGPL-3.0-or-later、独立画像へCC BY 4.0をローカル適用した。[現在の対象表](../LICENSE_SCOPE.md)を参照。公開・アップロードは行っていない。

## 結論

- CyberKDEのアイデア・配色・雰囲気だけを参考にし、保護されるコード・画像・具体的表現を複製／翻案していない場合、同プロジェクトのGPLやCC BY-SAに基づくクレジット義務は生じない。今回の照合ではCyberKDE独自コード・素材の転用を示す一致を検出しなかった。READMEから必須クレジットと誤解されやすい紹介を外し、制作経緯と確認根拠をこの文書・ASSETS.mdに残す。
- ÜbersichtはGPL-3.0-or-later。一般的な実行環境として動かすだけで、すべてのウィジェットが自動的にGPLになるとはいえない。一方、この実装はホスト専用APIを使って同一のJavaScript環境へ接続するため、配布準備ではGPL互換の条件を前提にするのが妥当と判断する。
- 自作コードをMITで許諾する選択肢はある。MITはGPL互換だが、Übersichtを含めた結合物を配布するときの条件までMITへ変更できるという意味ではない。「本体を含めないので一切無関係」「全画像・フォントもGPL」「MITは不可能」のいずれも今回の結論ではない。

## CyberKDEの確認範囲

上流固定コミット: [`5b1e174e13c03b6053a8fba0df6adba815858583`](https://github.com/jrcn1991/theme-cyberkde/tree/5b1e174e13c03b6053a8fba0df6adba815858583)。ライセンス区分は同コミットの[CREDITS.md](https://github.com/jrcn1991/theme-cyberkde/blob/5b1e174e13c03b6053a8fba0df6adba815858583/CREDITS.md)を確認。

1. 上流ツリー全体のblob IDと、こちらの3コミットから到達できるオブジェクトを比較。一致はRajdhani Medium/SemiBold、OrbitronとOFL原文2件のみ。これらはGoogle Fontsから取得した第三者フォントであり、同じ上流フォントの使用はCyberKDE独自素材の転載を示さない。Google Fontsの出典とOFLは保持する。
2. 上流のQML・JS・Python・CSS・shell・HTML・JSON・fragment shader計1,031ファイル（`themes/icons/`以下を除外）を固定コミットから取得し、Git blobハッシュを照合。こちらの現行コード・設定・テスト50ファイルと、空白を無視した連続40字句トークンの一致を比較し、該当なし。識別子・文字列は保持して比較した。
3. 制作記録上は配色・角の切り欠き・パネル・起動や文字演出を参考にMac用に実装。上流の壁紙・動画・スクリーンショット・ゲームの企業ロゴは同梱していない。

ハッシュ比較は改変画像を検出せず、トークン比較は短い断片・識別子を変えたコード・別言語への移植を完全には検出しない。上流の過去全履歴、外部リンク先素材、画面の具体的表現の法的な翻案性まで証明したものではない。「コードを直接コピーしていない」だけで、画像の描き直し等が必ず自由になるわけでもない。

[文化庁の説明](https://www.bunka.go.jp/seisaku/chosakuken/seidokaisetsu/chosakukensha_fumei/)では、アイデアやありふれた表現等と著作物の利用を区別している。[CC BY-SA 4.0本文](https://creativecommons.org/licenses/by-sa/4.0/legalcode.en)の表示・継承条件は対象素材や翻案物を利用する場合の条件であり、刺激を受けたすべての新作に及ぶものではない。この前提で、CyberKDEのREADMEでの紹介は必須表示として扱わない。任意の制作経緯の保存と、ライセンス上の表示義務を区別する。

## Übersichtの確認資料

固定コミット: [`859a7d70525949b8bdeec19d69a4766678ca3527`](https://github.com/felixhageloh/uebersicht/tree/859a7d70525949b8bdeec19d69a4766678ca3527)。以下はこのコミットの確認結果。

| 一次資料 | 確認した事実 |
| --- | --- |
| [READMEのLegal](https://github.com/felixhageloh/uebersicht/blob/859a7d70525949b8bdeec19d69a4766678ca3527/README.md#legal)・[LICENSE](https://github.com/felixhageloh/uebersicht/blob/859a7d70525949b8bdeec19d69a4766678ca3527/LICENSE) | READMEはGPL version 3またはそれ以降と明記。LICENSEはGPLv3原文 |
| [server/package.json](https://github.com/felixhageloh/uebersicht/blob/859a7d70525949b8bdeec19d69a4766678ca3527/server/package.json) | サーバーのライセンス表記はGPL v3 |
| [uebersicht.js](https://github.com/felixhageloh/uebersicht/blob/859a7d70525949b8bdeec19d69a4766678ca3527/server/src/uebersicht.js)・[runShellCommand.js](https://github.com/felixhageloh/uebersicht/blob/859a7d70525949b8bdeec19d69a4766678ca3527/server/src/runShellCommand.js) | `run`はホストのシェル実行APIへ接続する実装。単なる型宣言ではない |
| [bundleWidget.js](https://github.com/felixhageloh/uebersicht/blob/859a7d70525949b8bdeec19d69a4766678ca3527/server/src/bundleWidget.js) | JSXを変換し、`uebersicht`をexternalとして実行時に解決 |
| [UBWebViewController.m](https://github.com/felixhageloh/uebersicht/blob/859a7d70525949b8bdeec19d69a4766678ca3527/Uebersicht/UBWebViewController.m) | WebKitメッセージで`widgetEnter` / `widgetLeave`を処理 |

確認したREADME・LICENSE・API周辺ソース、公式ウィジェット投稿説明には、このウィジェットへ適用できる明示的なリンク例外／特別許諾を見つけなかった。公開Issueのlicense/GPL検索でも直接の見解は得られなかった。この結果は、全権利者からの回答や、例外が一切存在しない証明ではない。実機確認版1.6.82と上記ソースコミットの一対一の対応は未確定。

## 今回の実装がホストと接続する場所

| ローカルのコード | 接続方法 | 判断上の意味 |
| --- | --- | --- |
| `cyberdeck.widget/index.jsx` | `import { run } from 'uebersicht'`、JSX render/state API | ホストのAPI関数を直接利用する |
| `cyberdeck.widget/lib/native-surface.js` | ホストと同じDOMへパネル・スクリプトを配置 | 通常の別サイトの表示だけではない |
| `cyberdeck.widget/lib/native-pointer.js` | WebKitの`uebersicht`ハンドラーへネイティブ通知 | ホストのクリック処理に依存 |
| `cyberdeck.widget/background.jsx` | `/state/`、WebSocketの背景設定メッセージ | ホスト固有の状態とプロトコルを利用 |
| Swift/Python・SketchyBar設定 | 別プロセスの起動・JSON・コマンド引数 | 境界を個別に評価する。別プロセスというだけで全体の結論を出さない |

[GNU FAQ: interpreter](https://www.gnu.org/licenses/gpl-faq.html#IfInterpreterIsGPL)は単なる言語実行とGPL機能へのbindingを区別し、[plugins](https://www.gnu.org/licenses/gpl-faq.html#GPLAndPlugins)は結合方法によって条件が変わると説明する。[modules](https://www.gnu.org/licenses/gpl-faq.html#GPLModuleLicense)では、自作部分にGPL互換の緩いライセンスを用いる選択肢を説明している。これはFSFの解釈であり、この実装についての裁判所やÜbersicht作者の個別判断ではない。

上記事実から、現在のままライセンス未設定・再利用不許可で一般配布してよいとは確認できない。APIの一行だけを別の呼び出しへ置き換えても、他の結合が残るため解決済みにはしない。

## 選択前に比較した案（案Aを採用済み）

| 案 | 自作コードの扱い | 追加で必要なこと |
| --- | --- | --- |
| A: GPL-3.0-or-later | ウィジェットの独自コードをGPLで許諾 | 対象ファイル・著作権名義・原文・ソース提供手順を明確化。配布する結合物があれば対応ソースと表示を確認 |
| B: MIT | 自作部分をMITで再利用可能にする | MITが[GPL互換](https://www.gnu.org/licenses/license-list.html#Expat)であることと、結合物はGPL条件に従うことを文書化。ホストのライセンスをMITに変更しない |
| C: ライセンスなし／再利用を制限 | この構成での一般配布を承認済みとは扱わない | 適用可能な例外・権利者の明示回答を得るか、別実装への分離と再評価が必要 |

保守しやすい案はA。自作コードを他の用途にも使いやすくしたい場合はBも候補。その後ユーザーが案Aを選択し、LICENSE原文と対象表を追加した。案B・Cは比較記録であり、現在の許諾条件ではない。MIT/GPLは取得審査を受ける資格ではなく、権利を持つ範囲に適用する許諾条件。

フォントはOFL、DeviconはMIT、商標は各権利者の条件を維持する。独立した壁紙・鯉図案・README画像にコードのライセンスを自動適用しない。特に`koi.js`はSVG図案と実装が同じファイルにあるため、コードと図案の扱いを明確にし、配布する組合せの条件と矛盾する追加制限を設けない。対象表ではkoi.js全体をGPL、独立したSVG壁紙・PNG・JPEG・GIFをCC BY 4.0とした。

## 残っている実作業

- ライセンスの選択・原文・名義・対象表・配布説明はローカル整備済み。新規の配布物を作るときは対応ソースと表示を再確認する。
- 作品としてのクレジットはREADMEと権利文書に記載済み。Übersicht本体や上流コードの再配布を始める場合は、その配布物を改めて確認する。
- 新規Macへの導入通し試験、Intel・複数画面・スリープ復帰は未実施。現状は確認済みのApple Silicon構成を案内し、未検証条件を明示する。
- 最終差分と個人情報を再点検し、明示依頼後にGitHubへ送信／Public化する。現在はPrivateのまま。
