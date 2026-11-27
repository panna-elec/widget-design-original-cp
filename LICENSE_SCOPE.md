# ライセンスの適用範囲

適用日: 2026-11-27。ユーザーの明示承認により適用。ユーザーの追加の明示依頼により、GitHubでソースコードをPublic公開する方針です。実機更新の記録はVALIDATION.mdを参照してください。

## 独自コードと組み込みSVG: GPL-3.0-or-later

Copyright (C) 2026 panna-elec

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the [GNU General Public License](LICENSE) for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.

SPDX-License-Identifier: GPL-3.0-or-later

対象は、このリポジトリの独自コード・設定・テスト・付随する独自文書です。具体的には`cyberdeck.widget/`のJSX/JS/MJS/CSS/HTML/Python/JSON、`native/`、`scripts/`、`sketchybar/`、`tests/`、ルートのプレビューHTML/CSS/JS・起動コマンドを含みます。下記CC BY素材と第三者素材は除外します。

**`cyberdeck.widget/lib/koi.js`は組み込みSVGの鯉図案を含めてGPL-3.0-or-laterです。** 独立画像だけに適用するCC BY条件で、このファイルの利用を追加制限しません。元AI画像の出所はASSETS.mdを参照。権利を保有／許諾できる範囲で提供し、AI生成部分に必ず独占的著作権が成立するという保証ではありません。

## 独立した壁紙・説明画像: CC BY 4.0

下記の素材のpanna-elecが許諾できる部分を[CC BY 4.0](LICENSES/CC-BY-4.0.txt)で許諾します。同じ図案のSVG原本とPNG出力は同じ条件です。

| 素材 | 対象ファイル |
| --- | --- |
| CLEAN壁紙 | `cyberdeck.widget/lib/wallpaper.svg`、`wallpaper.png` |
| CYBER壁紙 | `cyberdeck.widget/lib/wallpaper-cyber.svg`、`wallpaper-cyber.png` |
| REFERENCE壁紙 | `cyberdeck.widget/lib/wallpaper-reference.svg`、`wallpaper-reference.png` |
| READMEの静止画 | `docs/media/overview.jpg`、`docs/media/koi-settings.jpg` |
| READMEのアニメーション画像 | `docs/media/koi-animation.gif`、`docs/media/panel-controls.gif` |

このリポジトリにはBGMを同梱していません。mypageの音源の条件はmypage側の対象表を参照します。

CC BY 4.0は、適切なクレジット、ライセンスへのリンク、変更した場合の表示などを条件に、商用を含む共有・改変を認めます。原文の条件が優先します。条件を守る受領者への許諾を後から撤回するものではありません。

許諾者・制作名義はpanna-elec。AI生成部分は、panna-elecが許諾する権限を持つ著作権その他の権利の範囲に限って許諾します。著作権の成立・独占性・第三者権利の非侵害を保証せず、権利が存在しない部分に新たな権利を作りません。第三者のフォント、ロゴ、引用、商標等の権利をこの許諾へ含めません。制作方法と出所記録を保持しています。

README画像のCC BY許諾には、panna-elecが権利を持つ画面表現・鯉図案をその画像として複製・改変する許諾を含みます。画面のコードそのものをCC BYに変更するものではありません。画像に写る第三者フォント等の権利は元の条件を維持します。

クレジット例:

> 「REFERENCE壁紙」— panna-elec / Widget Design、CC BY 4.0。変更: サイズ変更。

出典: https://github.com/panna-elec/widget-design-original-cp
ライセンス: https://creativecommons.org/licenses/by/4.0/

素材名・名義・出典・ライセンス・変更の有無・無保証の表示を合理的な方法で保持してください。追加の利用許可申請、非商用限定など原文にない制限は設けません。

## 第三者素材と実行環境

| 対象 | 条件 |
| --- | --- |
| `cyberdeck.widget/lib/fonts/`のRajdhani・Orbitron | 同梱のOFL 1.1原文・著作権表示・SOURCE.txtを維持 |
| `docs/technical/stack-icons/` | DeviconのMIT・Copyright (c) 2015 konpaと各商標条件を維持 |
| Übersicht・SketchyBar | 別途導入。アプリ本体・上流コードはこのリポジトリに非同梱。各上流ライセンスは変更しない |
| 引用・第三者の原文 | 各権利者の表示と元の条件を維持 |

CyberKDEは任意の制作参照記録であり、必須クレジットとして扱わない。[調査根拠](docs/LICENSE_REVIEW.md)を保持する。第三者の画像・ロゴを、このCC BY許諾に含めているとは表示しない。

## ソースと配布

ソース配布ではこのリポジトリのコード・原文・対象表・出所記録を一緒に保持します。コンパイル済み`stats`は現在Git管理外です。バイナリやÜbersichtを含む結合物を将来配布する場合は、配布物に対応する完全なソース・ビルド手順・ライセンス表示を確認してください。

このフォルダーを自分のMacへインストールすることと、バイナリを他人へ配布することは別です。`cyberdeck.widget/`単独にはSwift原本が含まれないため、`stats`入りの導入済みフォルダーだけをそのまま公開用ZIPにしないでください。配布する際は`native/Stats.swift`と必要なビルド／導入スクリプトを含む対応ソースを同時に提供する必要があります。詳しくは[SETUP.md](SETUP.md)。

リポジトリの更新・公開操作に関する作業ルールは、このライセンスで受領した人の権利を追加制限するものではありません。
