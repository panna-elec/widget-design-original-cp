# 検証と制約

## 制作中に確認したこと

| 対象 | 確認内容 |
| --- | --- |
| 充電時のCSS | REFERENCEの全面疑似要素への単色塗りを修正。幅・デザイン・配色・電源状態・動きの432組み合わせでスタイルを検証 |
| 通常クリック | 主画面へ直接描画する修正後、ファイル選択とウィジェット操作の両立について実機利用者から解消の確認あり |
| 鯉 | 大きさ3段階×線幅3段階の9通りをプレビューで確認。保存・再読み込み、実機の115%・130%保存を確認 |
| 動き | 鯉・光の一時停止とオフの非表示を確認。OSの「動きを減らす」自体は今回切り替えていない |
| 状態 | 旧設定の読込、revision競合、破損データ保護、選択肢の検証、タスク等の保持 |

元の実機ログやスクリーンショットは個人環境情報を含み得るため、この保存用コピーには同梱しません。上表は制作時の確認をまとめたもので、すべてのMacで同じ動作を保証するものではありません。

## この保存用コピーでの確認

実行結果は[PREPARATION.md](docs/PREPARATION.md)に記録します。以下は端末の設定を変更せずに実行できるテストです。PythonのOS操作はテスト内でモックに置き換えます。

```sh
python3 -B -m unittest discover -s tests -p 'test_*.py'
node scripts/check-metrics.mjs
node tests/check-desk-model.mjs
node tests/check-desk-resources.mjs
node tests/check-native-pointer.mjs
node tests/check-native-bridge.mjs
```

Swiftの再ビルドは次のコマンドです。生成した実行ファイルはGitの対象外です。

```sh
swiftc -O native/Stats.swift -o cyberdeck.widget/bin/stats
```

## 未確認・制約

- Intel Mac、標準以外のウィジェット配置先、複数ディスプレイ、長時間の電池消費、実スリープ復帰。
- 新規のMacへゼロから導入する手順の実機通し確認。
- FinderのCreateDesktop、Übersichtのネイティブ通知など、OS・アプリのバージョン依存部分の将来互換性。
- 実測値は独自の定義・概算を含み、Activity Monitorと完全一致しない。電源変化は取得間隔の分だけ遅れる。
- 操作パネルを開いた状態や大きい鯉では、パネル周辺のマスクで光の一部が隠れる。


## 公開準備の文書確認（2026-11-27）

> 過去の記録: ライセンス整備時点の検証。後続の`34ab847`でPrivate反映済み。後段の言語・通信機能は別途実機へ反映しており、ここでの「未実施」は当時の範囲を示す。

コード・画像・音源・フォントを変更せず、ライセンス調査・鯉の出所・台帳・READMEを更新。権利文書のローカル参照先、素材台帳45件のSHA、個人情報・秘密情報の代表パターンを確認済み。リンク欠落・ハッシュ不一致・個人情報パターンの検出なし。従来の自動テスト成功を新規導入や未知の環境の実機確認と混同しない。今回、実機インストール、Finder設定変更、実行中ウィジェットへの反映は行っていない。


## ライセンス適用後のローカル検証（2026-11-27）

> 過去の記録: ライセンス整備時点の検証。後続の`34ab847`でPrivate反映済み。後段の言語・通信機能は別途実機へ反映しており、ここでの「未実施」は当時の範囲を示す。

- 独自コード・付随文書・koi.js内SVGにGPL-3.0-or-later、指定された独立画像にCC BY 4.0を適用。GPL原文はGNU提供本文、CC原文はSPDX提供本文とバイト一致。導入フォルダー内のコピーも一致し、取得元・SHAをLICENSES/SOURCES.mdに記録。
- 素材台帳52件のSHA、変更文書のローカル参照先、package.jsonのGPL表記とprivate:trueを確認。
- 画像・壁紙・フォント・第三者ライセンスは作業前と同一。koi.jsの変更はライセンスコメント3行のみで、残りは変更前とバイト一致。実行処理を変更していないため、ウィジェットの実機操作・導入・全テストの再実行は行っていない。
- 今回の変更文書を代表的な個人名・端末パス・秘密鍵・トークンのパターンで確認し、検出なし。過去履歴の再監査は今回の検証には含めない。
- インストールスクリプトがcyberdeck.widget全体をコピーすることを確認。追加LICENSE・NOTICE・CC原文もコピー対象になる。今回は実機のコピー操作を行っていない。コンパイル済みstatsを第三者へ配布する場合の対応ソース提供手順をSETUP.mdへ明記。
- ローカル編集のみ。コミット、GitHub送信、公開設定変更、実行中ウィジェットへの反映は行っていない。


## Display language (2026-11-27)

- Added a Japanese/English selector under Desk. Saves through the existing revision-checked desk state; old states default to Japanese. Preview storage is separate from native state.
- Python desk-store tests: 6 passed, including language migration, repeated save/read, invalid choices rejected without overwriting data, and task/link/layout preservation.
- Existing desk-model, desk-resource, native bridge/pointer, and metrics checks passed. The resource check now tracks the source status message independently of its translated text.
- Browser regression: 19 checks passed in `tests/language-browser.html`. Covers instant language/calendar changes, unchanged telemetry histories, literal user content, unsaved form preservation, effects saves, reload, accessible collapse labels, simulated native state/save/conflict/newer revision/reload.
- Visual preview: Japanese and English at the default desktop viewport (829 × 805) and 390 × 844. Desk controls fit and long settings content scrolls. No browser console errors were observed.
- Run browser checks by serving the repository on a dedicated loopback origin and opening `/tests/language-browser.html`. It temporarily seeds preview state on that origin and restores the prior desk data afterward. Native communication is simulated; no OS command is executed.
- Initially verified in isolation; the authorized installation follow-up is recorded below. Optional SketchyBar and shell localization remain outside the language feature.

### Authorized local installation follow-up

- Updated both the existing ON-shortcut source and the installed widget. Backed up the earlier widget and private desk state outside this repository. Preserved the existing measurement binary, preferences, startup scripts and font licenses; included the current required license notices.
- Started with the existing ON command at the user's request. The command completed successfully and the installed widget matches its startup source.
- Connected a browser to the running Übersicht engine (not a demo or mock). Verified live SSD/power readings, Japanese → English save, English persistence after reload, and English → Japanese save. The widget remains ON. Subsequent language selections were observed and left untouched.
- Compared private state against the backup: tasks, links, layout and all previous settings were unchanged. Only the language field and revision differed. Additional language selections were observed after the test and left untouched. No personal state or desktop screenshots were added to this repository.
- The external browser reported Übersicht host-only `webkit.messageHandlers` errors; the tested language-save path succeeded. Direct desktop WKWebView clicking/visual verification remains unverified.
- No Git commit or upload was performed at this installation-check stage. The feature was subsequently uploaded privately in `c75de52`; no public publication has been performed.


### Language scope correction

- Kept all originally English labels (including CHRONO, SYSTEM, MEMORY and their original heading font) unchanged in both languages. Japanese controls, sublabels and help remain selectable in Japanese/English.
- Reworded the network summary as current aggregate traffic. Connection classification was then implemented as requested below.
- Network counters contain interface identifiers and byte totals, not SSIDs, IP addresses or traffic contents. Ethernet in the former label was a generic connection technology, not personal information.


### Connection classification

- Added SystemConfiguration interface types and IOKit USB ancestry to the native collector. Output adds only a generic `kind`; no interface service labels, USB properties, device names, SSIDs or addresses are read for classification or emitted. Link state is checked locally to omit connections the OS reports as inactive.
- Wi-Fi and Wi-Fi tethering both show Wi-Fi. USB network adapters and USB tethering share USB; no phone/router inference. Unsupported types show Unknown. The existing en-interface scope and VPN/bridge exclusions remain.
- The reducer groups byte deltas by kind. The main rates remain a total; Details shows each kind. First samples, missing data, resets, sleep gaps and changed types remain unavailable instead of false zeroes or spikes.
- Validation: Swift build and 8 classifier checks; 7 metric, 15 network and 9 connection-type checks; browser regression 27 checks including language, original headings, combined types and translated breakdown labels. A non-sandboxed native sample identified the current connection as Wi-Fi.
- USB, wired, Bluetooth and cellular hardware transitions remain unverified; their classification branches were tested with synthetic inputs. Wi-Fi hotspot versus router discrimination is intentionally not implemented.

- Installation follow-up: backed up and updated the repository, ON-shortcut source and installed widget; rebuilt the matching native collector. The real Übersicht engine showed `接続：Wi-Fi`, live receive/send values and a matching Wi-Fi breakdown. Original CHRONO/SYSTEM/MEMORY labels were present in Japanese mode. Runtime source/binary hashes match and user state was unchanged. ON is retained; direct desktop WKWebView interaction remains unverified.
- API references: [Apple network interface types](https://developer.apple.com/documentation/systemconfiguration/network-interface-types), [SCNetworkInterfaceCopyAll](https://developer.apple.com/documentation/SystemConfiguration/SCNetworkInterfaceCopyAll%28%29). No upload at this check stage; the feature was subsequently uploaded privately in `c75de52`. No public publication.


## Language, connection types and English media refresh (2026-11-27)

最新版の英語プレビューを1440×1080で収録。Calendar、English選択状態、Effectsの保存、Wi-Fiと方式別通信量の表示を確認。最終GIFは1080×810、45フレーム9.08秒と83フレーム17.40秒。数値・接続方式は仮データであり、実機のハードウェア切替確認とは区別する。Python 15テスト、JavaScriptの計測・通信・分類・モデル・リソース・ネイティブ接続チェックが再実行で成功。以前の「GitHub送信なし」は各検証時点の記録。機能変更と更新媒体は、ユーザーの明示依頼により`c75de52`でPrivate反映済み。
