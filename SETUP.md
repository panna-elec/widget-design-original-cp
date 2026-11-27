# 導入・操作・停止

Apple Silicon配布ZIPを受け取った場合は、[INSTALL.ja.md](INSTALL.ja.md) / [INSTALL.md](INSTALL.md)と`Manage.command`を使用します。本書はソースからの導入と任意のSketchyBar構成を含みます。実行ファイル入りのApple Silicon版ZIPとチェックサムは、[v0.1.0-preview.1プレリリース](https://github.com/panna-elec/widget-design-original-cp/releases/tag/v0.1.0-preview.1)から取得できます。

## 対象環境

実機確認はApple SiliconのMac、Übersicht 1.6.82、HomebrewのPython 3（`/opt/homebrew/bin/python3`）で行いました。任意の上部バーはSketchyBar 2.24.1。SwiftのビルドにはXcode Command Line Toolsが必要です。

ウィジェット本体のPythonは`bin/python3.sh`で3.10以上を自動検出します（Homebrew、python.org標準配置、PATHの順）。ZIP版のビルド対象はApple Silicon・macOS 13以上です。任意の上部バーには引き続きHomebrew固定パスが含まれます。Intelや旧OS・特殊な配置は実機未検証です。

## プレビュー

リポジトリのルートで実行します。

```sh
python3 -m http.server 8767 --bind 127.0.0.1
```

`http://127.0.0.1:8767/` を開きます。HTTPサーバーはローカル限定です。終了はControl+C。デザイン・配色・配置・動きを比較できます。「この設定を保存」は設定JSONをダウンロードする操作です。実機の値は取得せず、アプリやフォルダーも開きません。

## 実機へ初めて導入する

1. [Übersichtの公式サイト](https://tracesof.net/uebersicht/)からアプリを別途導入します。アプリは本リポジトリに同梱しません。
2. 次のコマンドで実行ファイルを作ります。コンパイル済みの`stats`はGitへ含めません。

   ```sh
   swiftc -O -target arm64-apple-macos13.0 native/Stats.swift -o cyberdeck.widget/bin/stats
   ```

3. ウィジェットを配置します。

   ```sh
   bash scripts/install-widget.sh
   ```

   配置先は `~/Library/Application Support/Übersicht/widgets/cyberdeck.widget`。同名のフォルダがある場合は上書きせず終了します。Übersicht側で別のウィジェットフォルダを選んでいる場合は「Open Widgets Folder」で確認し、そこへ配置してください。設定反映・停止スクリプトも標準の配置先を前提とします。
4. Übersichtを起動し、必要なら「Refresh all Widgets」を実行します。CPU・通信は2回目のサンプルから表示します。
5. 静止壁紙はシステム設定で選びます。REFERENCEは`wallpaper-reference.png`、CYBERは`wallpaper-cyber.png`、CLEANは`wallpaper.png`です。背景の光を位置合わせするため、対応する壁紙を中央基準で画面いっぱいに配置します。

壁紙・外観は手動変更です。復元する場合に備えて変更前の状態を控えてください。常設のログイン自動起動は追加しません。

## 任意の上部バー

[SketchyBar](https://github.com/FelixKratz/SketchyBar)を別途導入した場合は、次で専用バーを起動できます。

```sh
bash scripts/session-bar.sh start
```

停止は `bash scripts/session-bar.sh stop`。専用のlaunchdジョブをログインセッション内に作ります。標準のSketchyBar設定を上書きしません。他のSketchyBarが動いている場合は開始を中止します。

`サイバー表示を開始.command` はウィジェットとバーの両方を開始するショートカットです。Übersichtが `~/Applications/Übersicht.app` にある構成を前提とし、SketchyBarも必要です。バーを使わない場合は前節のウィジェット単独導入を使ってください。

## デザインと演出設定

プレビューからダウンロードした設定を実機へ適用できます。

```sh
python3 scripts/apply-preferences.py /path/to/cyberdeck-preferences.json
```

元の設定を`backups/`へ保管し、保存用フォルダと導入済みウィジェットの設定を更新します。通常／控えめ／オフだけの変更は`演出設定.command`でも選べます。表示中に反映されない場合は「Refresh all Widgets」を実行します。

鯉の配色・大きさ・線幅、残量のしきい値は「デスク」→「演出連動」→「設定を保存」。鯉を以前の見た目に戻す場合は大きさ・線幅を両方100%にします。

## 表示言語

時計の「デスク / Desk」→「表示言語 / Language」で日本語・Englishを選びます。保存が成功すると切り替わり、次回起動も保持します。タスク本文・登録リンク名は翻訳しません。プレビューは実機とは別にブラウザーへ保存します。

## 通信速度と接続方式

NETWORK / I/Oの「接続」でWi-Fi・有線LAN・USB接続などを確認できます。複数接続は合計し、「詳細 / 履歴」に方式ごとの送受信量を表示します。Wi-FiテザリングはWi-Fi、USBテザリングとUSB有線LANアダプターはUSB接続として扱います。回線名・スマートフォン名は取得・表示しません。判別に失敗した接続は「判別不可」です。

対象は従来同様にen系のインターフェースです。macOSが切断中と報告する接続は除きます。VPNトンネル・ループバック・bridge自体は合算しません。Bluetooth・携帯回線もOSが対応するen系の接続として公開した場合のみ対象で、すべてのテザリング方式への対応を保証するものではありません。実測で確認したのはWi-Fiです。

## 保存される場所

| 場所 | 内容 |
| --- | --- |
| `cyberdeck.widget/lib/preferences.json` | デザイン・配置方向・動きの初期設定 |
| `~/Library/Application Support/Cyberdeck/state.json` | タスク、登録リンク、配置、鯉・電源演出の設定 |
| 同フォルダの`state.previous.json` | 直前の保存状態 |
| 同フォルダの`desktop-mode.json` | 鑑賞モードの復元に必要な記録 |
| `runtime/` | バーのログ・PID・launchd設定など |

ユーザーデータと実行記録はアップロード対象外です。複数の画面から同時に保存した場合はrevisionによる競合検知で上書きを止めます。アプリを停止するだけではタスクや設定を消しません。

## 鑑賞モードと停止

「アイコンを隠す」はFinderの表示設定を変更してFinderを再読み込みします。ファイルの移動・削除は行いません。「元の表示へ戻す」は開始前の状態を復元します。Finderでファイルをコピー中は切り替えを避けてください。

```sh
bash scripts/disable-widget.sh
```

この操作は鑑賞モードの復元後、配置済みのCyberdeckをこのフォルダの`backups/`へ退避します。ほかのウィジェットは対象外です。バーも止めるには`サイバー表示を停止.command`を使います。壁紙・外観は手動で戻してください。

## 更新する場合

現在動いているウィジェットと保存用リポジトリは別フォルダです。GitHubからソースを取得しただけでは実機は更新されません。ビルド後、導入済みのCyberdeckを退避してから新しいフォルダを配置してください。個人の`state.json`をリポジトリへコピーする必要はありません。


## ライセンスと再配布

独自コード・組み込みの鯉SVGはGPL-3.0-or-later、独立した壁紙・README画像はCC BY 4.0です。[対象表](LICENSE_SCOPE.md)を参照してください。`cyberdeck.widget/`内のLICENSE・NOTICE.md・CC BY原文と、既存のフォントOFLはインストール時に一緒にコピーされます。

自分用のローカルビルドと、コンパイル済み`stats`の第三者配布を区別してください。バイナリを配布する際は、同じ版の`native/Stats.swift`と必要なビルド・導入スクリプトを含む完全な対応ソースを提供し、GPLの原文・著作権表示・変更表示等を保持します。PrivateリポジトリのURLを示すだけで、受領者がソースを取得できない状態にはしません。Apple Silicon向けプレリリースのZIPには完全な対応ソースを同梱します。公開するZIPと対応するソースの一致はBUILD-INFO.jsonとMANIFEST.jsonで確認できます。Release公開による稼働中ウィジェットの自動更新は行いません。
