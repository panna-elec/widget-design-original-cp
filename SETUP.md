# 導入・操作・停止

## 対象環境

実機確認はApple SiliconのMac、Übersicht 1.6.82、HomebrewのPython 3（`/opt/homebrew/bin/python3`）で行いました。任意の上部バーはSketchyBar 2.24.1。SwiftのビルドにはXcode Command Line Toolsが必要です。

現行スクリプトにはApple SiliconのHomebrewパスが含まれます。Intel Macや別のPython配置は未検証です。`/opt/homebrew/bin/python3`、上部バーを使う場合の`/opt/homebrew/bin/sketchybar`を環境に合わせる必要があります。

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
   swiftc -O native/Stats.swift -o cyberdeck.widget/bin/stats
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
