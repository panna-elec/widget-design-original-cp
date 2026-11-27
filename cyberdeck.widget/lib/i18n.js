/* Local widget UI translations. User-entered tasks, labels and paths are never scanned. */
(() => {
  'use strict';
  const messages = {
    "時計": {"ja": "時計", "en": "Clock"},
    "システム": {"ja": "システム", "en": "System"},
    "カレンダー": {"ja": "カレンダー", "en": "Calendar"},
    "デスク": {"ja": "デスク", "en": "Desk"},
    "システム情報": {"ja": "システム情報", "en": "System information"},
    "システム概要": {"ja": "システム概要", "en": "System overview"},
    "全コアの平均": {"ja": "全コアの平均", "en": "Average across all cores"},
    "測定待ち": {"ja": "測定待ち", "en": "Waiting for a sample"},
    "サンプル表示": {"ja": "サンプル表示", "en": "Sample display"},
    "詳細 / 履歴": {"ja": "詳細 / 履歴", "en": "Details / History"},
    "通信速度計": {"ja": "通信速度計", "en": "Network throughput"},
    "5秒平均": {"ja": "5秒平均", "en": "5 s average"},
    "↓ RX / 受信": {"ja": "↓ RX / 受信", "en": "↓ RX / Receive"},
    "↑ TX / 送信": {"ja": "↑ TX / 送信", "en": "↑ TX / Send"},
    "計測待ち": {"ja": "計測待ち", "en": "Waiting for measurement"},
    "目盛りは通信量に合わせて自動調整": {"ja": "目盛りは通信量に合わせて自動調整", "en": "Scale adjusts to recent traffic"},
    "CPU HISTORY / 約3分": {"ja": "CPU HISTORY / 約3分", "en": "CPU HISTORY / ~3 min"},
    "NETWORK HISTORY / 約3分": {"ja": "NETWORK HISTORY / 約3分", "en": "NETWORK HISTORY / ~3 min"},
    "CPU使用率の推移": {"ja": "CPU使用率の推移", "en": "CPU usage history"},
    "受信は赤、送信は白の通信速度履歴": {"ja": "受信は赤、送信は白の通信速度履歴", "en": "Network history: receive in red, send in white"},
    "CPUは全コアの平均。メモリはActive＋Wired＋Compressedの概算です。5秒ごとに更新します。": {"ja": "CPUは全コアの平均。メモリはActive＋Wired＋Compressedの概算です。5秒ごとに更新します。", "en": "CPU is the average across all cores. Memory estimates Active + Wired + Compressed usage. Updates every 5 seconds."},
    "デスクツール": {"ja": "デスクツール", "en": "Desk tools"},
    "収納パネルを折りたたむ": {"ja": "収納パネルを折りたたむ", "en": "Fold desk panel"},
    "収納してシステム表示へ戻る": {"ja": "収納してシステム表示へ戻る", "en": "Close desk and return to system"},
    "デスクツールの項目": {"ja": "デスクツールの項目", "en": "Desk tool tabs"},
    "SSD・電源": {"ja": "SSD・電源", "en": "SSD / Power"},
    "リンク": {"ja": "リンク", "en": "Links"},
    "タスク": {"ja": "タスク", "en": "Tasks"},
    "配置": {"ja": "配置", "en": "Layout"},
    "演出連動": {"ja": "演出連動", "en": "Effects"},
    "SSD / 空き": {"ja": "SSD / 空き", "en": "SSD / Free"},
    "POWER / 残量": {"ja": "POWER / 残量", "en": "POWER / Charge"},
    "取得待ち": {"ja": "取得待ち", "en": "Waiting for data"},
    "SSDはホームがあるAPFS領域の空き。共有領域を含み、解放可能容量は含みません。": {"ja": "SSDはホームがあるAPFS領域の空き。共有領域を含み、解放可能容量は含みません。", "en": "Free space in the APFS volume containing your home folder. Includes shared space; excludes purgeable space."},
    "残量が減っても通常演出を自動で弱めません。色と光の変化は「演出連動」で調整できます。": {"ja": "残量が減っても通常演出を自動で弱めません。色と光の変化は「演出連動」で調整できます。", "en": "Low battery does not automatically reduce motion. Adjust color and light responses in Effects."},
    "表示名": {"ja": "表示名", "en": "Name"},
    "種類": {"ja": "種類", "en": "Type"},
    "アプリ": {"ja": "アプリ", "en": "App"},
    "フォルダー": {"ja": "フォルダー", "en": "Folder"},
    "パス": {"ja": "パス", "en": "Path"},
    "/Applications/アプリ名.app または ~/Documents": {"ja": "/Applications/アプリ名.app または ~/Documents", "en": "/Applications/App.app or ~/Documents"},
    "登録": {"ja": "登録", "en": "Add link"},
    "取消": {"ja": "取消", "en": "Cancel"},
    "アプリまたはフォルダーのパスを入力。最大24件。ファイルやコマンドは実行しません。": {"ja": "アプリまたはフォルダーのパスを入力。最大24件。ファイルやコマンドは実行しません。", "en": "Enter an app or folder path (up to 24 links). Files and commands are not executed."},
    "次にやること": {"ja": "次にやること", "en": "What to do next"},
    "追加": {"ja": "追加", "en": "Add"},
    "削除を元に戻す": {"ja": "削除を元に戻す", "en": "Undo deletion"},
    "このMacに保存します。最大100件。OFFにしても消えません。": {"ja": "このMacに保存します。最大100件。OFFにしても消えません。", "en": "Saved on this Mac (up to 100 tasks). Turning the widget off keeps your tasks."},
    "「編集開始」後、見出しをドラッグして移動。右下の角でサイズ変更。数値でも調整できます。": {"ja": "「編集開始」後、見出しをドラッグして移動。右下の角でサイズ変更。数値でも調整できます。", "en": "Choose Start editing, then drag a heading to move a panel or its lower-right corner to resize it. You can also enter coordinates."},
    "編集開始": {"ja": "編集開始", "en": "Start editing"},
    "対象": {"ja": "対象", "en": "Panel"},
    "収納パネル": {"ja": "収納パネル", "en": "Desk panel"},
    "幅": {"ja": "幅", "en": "Width"},
    "高さ": {"ja": "高さ", "en": "Height"},
    "位置を試す": {"ja": "位置を試す", "en": "Try position"},
    "配置保存・終了": {"ja": "配置保存・終了", "en": "Save layout & finish"},
    "この画面の初期配置へ戻す": {"ja": "この画面の初期配置へ戻す", "en": "Reset layout for this screen"},
    "画面寸法・デザイン別に保存。10px単位の位置合わせとパネル同士の重なり確認。アイコンの位置は目視で避けてください。上部バナーは固定です。": {"ja": "画面寸法・デザイン別に保存。10px単位の位置合わせとパネル同士の重なり確認。アイコンの位置は目視で避けてください。上部バナーは固定です。", "en": "Saved per screen size and design. Positions snap to 10 px; panel overlaps are checked. Avoid desktop icons manually. The top banner stays fixed."},
    "壁紙の鑑賞モード": {"ja": "壁紙の鑑賞モード", "en": "Wallpaper viewing mode"},
    "アイコン表示を確認中": {"ja": "アイコン表示を確認中", "en": "Checking desktop icons"},
    "アイコンを隠す": {"ja": "アイコンを隠す", "en": "Hide icons"},
    "元の表示へ戻す": {"ja": "元の表示へ戻す", "en": "Restore icons"},
    "Finderを再読み込みします。ファイルはそのまま残り、Finderのデスクトップフォルダーから開けます。表示OFF時にも元へ戻します。": {"ja": "Finderを再読み込みします。ファイルはそのまま残り、Finderのデスクトップフォルダーから開けます。表示OFF時にも元へ戻します。", "en": "Reloads Finder. Files stay in place and remain accessible in the Desktop folder. Turning the widget off also restores the icons."},
    "残量・充電に演出を連動": {"ja": "残量・充電に演出を連動", "en": "Match effects to battery and charging"},
    "中央の鯉の光を表示": {"ja": "中央の鯉の光を表示", "en": "Show the koi light in the center"},
    "鯉の色": {"ja": "鯉の色", "en": "Koi color"},
    "ダークローズ（標準）": {"ja": "ダークローズ（標準）", "en": "Dark rose (default)"},
    "ワインレッド": {"ja": "ワインレッド", "en": "Wine red"},
    "クリムゾン": {"ja": "クリムゾン", "en": "Crimson"},
    "くすみモーヴ": {"ja": "くすみモーヴ", "en": "Muted mauve"},
    "ダスティコーラル": {"ja": "ダスティコーラル", "en": "Dusty coral"},
    "シアン × ピンク": {"ja": "シアン × ピンク", "en": "Cyan × pink"},
    "鯉の大きさ": {"ja": "鯉の大きさ", "en": "Koi size"},
    "従来（100%）": {"ja": "従来（100%）", "en": "Original (100%)"},
    "少し大きい（115%）": {"ja": "少し大きい（115%）", "en": "Larger (115%)"},
    "大きい（130%）": {"ja": "大きい（130%）", "en": "Large (130%)"},
    "光の線の太さ": {"ja": "光の線の太さ", "en": "Light stroke width"},
    "少し太い（130%）": {"ja": "少し太い（130%）", "en": "Thicker (130%)"},
    "太い（160%）": {"ja": "太い（160%）", "en": "Thick (160%)"},
    "輪郭・光・残光をまとめて調整。両方「従来」で以前の見た目に戻せます。": {"ja": "輪郭・光・残光をまとめて調整。両方「従来」で以前の見た目に戻せます。", "en": "Adjusts the outline, light and trail together. Set both to Original to restore the previous appearance."},
    "鯉も残量に合わせて色を変える": {"ja": "鯉も残量に合わせて色を変える", "en": "Match koi color to battery level"},
    "オフなら選んだ色を保ちます。変更後は「設定を保存」。": {"ja": "オフなら選んだ色を保ちます。変更後は「設定を保存」。", "en": "When off, the selected color stays unchanged. Choose Save settings to apply changes."},
    "少量の粒子を表示": {"ja": "少量の粒子を表示", "en": "Show subtle particles"},
    "少ない残量（%）": {"ja": "少ない残量（%）", "en": "Low battery (%)"},
    "中程度（%）": {"ja": "中程度（%）", "en": "Medium battery (%)"},
    "Dockを避ける位置": {"ja": "Dockを避ける位置", "en": "Dock position"},
    "自動（推定）": {"ja": "自動（推定）", "en": "Auto (estimated)"},
    "下": {"ja": "下", "en": "Bottom"},
    "左": {"ja": "左", "en": "Left"},
    "右": {"ja": "右", "en": "Right"},
    "手動時の余白（px）": {"ja": "手動時の余白（px）", "en": "Manual clearance (px)"},
    "設定を保存": {"ja": "設定を保存", "en": "Save settings"},
    "通常は本来の配色、中程度は琥珀色、少ない残量は赤系、充電中は青緑の流れ。鯉は輪郭に沿う光で描きます。控えめ・オフ・動きを減らす設定では背景の光と鯉を非表示にします。": {"ja": "通常は本来の配色、中程度は琥珀色、少ない残量は赤系、充電中は青緑の流れ。鯉は輪郭に沿う光で描きます。控えめ・オフ・動きを減らす設定では背景の光と鯉を非表示にします。", "en": "Normal uses the selected colors; medium battery uses amber, low battery uses red, and charging uses teal. Light follows the koi outline. Gentle, Off and Reduce Motion hide background lights and koi."},
    "仮の電池残量": {"ja": "仮の電池残量", "en": "Demo battery level"},
    "仮の充電状態": {"ja": "仮の充電状態", "en": "Demo charging"},
    "プレビューは仮データです。": {"ja": "プレビューは仮データです。", "en": "Preview uses simulated data."},
    "ファイル　編集　表示　移動": {"ja": "ファイル　編集　表示　移動", "en": "File  Edit  View  Go"},
    "中央は、いつもの作業のために。": {"ja": "中央は、いつもの作業のために。", "en": "Keep the center clear for your work."},
    "Finder — 配置確認用": {"ja": "Finder — 配置確認用", "en": "Finder — layout preview"},
    "よく使う項目": {"ja": "よく使う項目", "en": "Favorites"},
    "最近の項目": {"ja": "最近の項目", "en": "Recents"},
    "アプリケーション": {"ja": "アプリケーション", "en": "Applications"},
    "デスクトップ": {"ja": "デスクトップ", "en": "Desktop"},
    "通常のアプリの見た目はそのまま": {"ja": "通常のアプリの見た目はそのまま", "en": "Your apps keep their usual appearance"},
    "DEMO / 仮の通信量": {"ja": "DEMO / 仮の通信量", "en": "DEMO / Simulated traffic"},
    "取得失敗・次回再試行": {"ja": "取得失敗・次回再試行", "en": "Read failed; retrying next update"},
    "更新停止 / データ待ち": {"ja": "更新停止 / データ待ち", "en": "Stale / Waiting for data"},
    "通信量を取得できません": {"ja": "通信量を取得できません", "en": "Traffic data unavailable"},
    "対象の通信インターフェースなし": {"ja": "対象の通信インターフェースなし", "en": "No supported network interface"},
    "計測中 / 次のサンプル待ち": {"ja": "計測中 / 次のサンプル待ち", "en": "Measuring / Waiting for next sample"},
    "目盛り上限 {value} / 自動": {"ja": "目盛り上限 {value} / 自動", "en": "Scale maximum {value} / Auto"},
    "実測 / 5秒更新": {"ja": "実測 / 5秒更新", "en": "Live / Updated every 5 s"},
    "CPUの初回サンプル待ち": {"ja": "CPUの初回サンプル待ち", "en": "Waiting for initial CPU sample"},
    "仮データ / 配置・演出の確認用": {"ja": "仮データ / 配置・演出の確認用", "en": "Demo data / Layout and effects preview"},
    "更新が止まっています": {"ja": "更新が止まっています", "en": "Updates have stopped"},
    "実機のデスクから切り替えてください": {"ja": "実機のデスクから切り替えてください", "en": "Switch from Desk on the desktop widget"},
    "プレビューでは起動しません。実機のデスクから開いてください。": {"ja": "プレビューでは起動しません。実機のデスクから開いてください。", "en": "Launching is disabled in preview. Open this from Desk on the desktop widget."},
    "ブラウザーへ保存できませんでした": {"ja": "ブラウザーへ保存できませんでした", "en": "Could not save in this browser"},
    "応答待ちです。保存状態を確認して再操作してください。": {"ja": "応答待ちです。保存状態を確認して再操作してください。", "en": "No response yet. Check whether your changes were saved before trying again."},
    "保存しました": {"ja": "保存しました", "en": "Saved"},
    "処理中です": {"ja": "処理中です", "en": "Working…"},
    "実機データの取得待ちです": {"ja": "実機データの取得待ちです", "en": "Waiting for desktop data"},
    "保存中…": {"ja": "保存中…", "en": "Saving…"},
    "保存できませんでした": {"ja": "保存できませんでした", "en": "Could not save"},
    "タスクはありません": {"ja": "タスクはありません", "en": "No tasks yet"},
    "未完了へ戻しました": {"ja": "未完了へ戻しました", "en": "Marked as incomplete"},
    "編集": {"ja": "編集", "en": "Edit"},
    "更新": {"ja": "更新", "en": "Update"},
    "削除": {"ja": "削除", "en": "Delete"},
    "削除しました。元に戻せます": {"ja": "削除しました。元に戻せます", "en": "Deleted. You can undo this."},
    "ショートカットはありません": {"ja": "ショートカットはありません", "en": "No links yet"},
    "開く": {"ja": "開く", "en": "Open"},
    "開きました": {"ja": "開きました", "en": "Opened"},
    "タスクは100件までです": {"ja": "タスクは100件までです", "en": "You can save up to 100 tasks"},
    "上限100件のため復元できません": {"ja": "上限100件のため復元できません", "en": "Cannot restore: the 100-task limit has been reached"},
    "復元しました": {"ja": "復元しました", "en": "Restored"},
    "絶対パスまたは ~/ から入力してください": {"ja": "絶対パスまたは ~/ から入力してください", "en": "Enter an absolute path or one starting with ~/"},
    "ショートカットは24件までです": {"ja": "ショートカットは24件までです", "en": "You can save up to 24 links"},
    "少ない残量は5〜40%、中程度はそれより5%以上高く90%以下にしてください": {"ja": "少ない残量は5〜40%、中程度はそれより5%以上高く90%以下にしてください", "en": "Set Low to 5–40% and Medium at least 5 points higher, up to 90%."},
    "実測値の更新が止まっています": {"ja": "実測値の更新が止まっています", "en": "Live updates have stopped"},
    "充電中": {"ja": "充電中", "en": "Charging"},
    "電源接続": {"ja": "電源接続", "en": "External power"},
    "バッテリー使用中": {"ja": "バッテリー使用中", "en": "On battery"},
    "LIVE / SSD・電源は5秒更新": {"ja": "LIVE / SSD・電源は5秒更新", "en": "LIVE / SSD and power update every 5 s"},
    "STALE / データ待ち": {"ja": "STALE / データ待ち", "en": "STALE / Waiting for data"},
    "DEMO / SSD・電源は仮データ": {"ja": "DEMO / SSD・電源は仮データ", "en": "DEMO / Simulated SSD and power"},
    "この画面では保存配置が重なるため初期配置を使用します": {"ja": "この画面では保存配置が重なるため初期配置を使用します", "en": "Saved panels overlap on this screen. Using the default layout."},
    "データ取得待ちです": {"ja": "データ取得待ちです", "en": "Waiting for data"},
    "配置編集中。保存または取消で終了します": {"ja": "配置編集中。保存または取消で終了します", "en": "Editing layout. Save or cancel to finish."},
    "配置変更を取り消しました": {"ja": "配置変更を取り消しました", "en": "Layout changes canceled"},
    "パネル同士が重なります。位置かサイズを調整してください": {"ja": "パネル同士が重なります。位置かサイズを調整してください", "en": "Panels overlap. Adjust their position or size."},
    "数値を入力してください": {"ja": "数値を入力してください", "en": "Enter a valid number"},
    "先に編集を開始してください": {"ja": "先に編集を開始してください", "en": "Choose Start editing first"},
    "重なりを解消してください": {"ja": "重なりを解消してください", "en": "Resolve panel overlaps first"},
    "配置を保存しました": {"ja": "配置を保存しました", "en": "Layout saved"},
    "この画面の初期配置へ戻しました": {"ja": "この画面の初期配置へ戻しました", "en": "Default layout restored for this screen"},
    "実機でのみ切り替えできます": {"ja": "実機でのみ切り替えできます", "en": "Available only on the desktop widget"},
    "アイコン表示を確認できません": {"ja": "アイコン表示を確認できません", "en": "Could not check icon visibility"},
    "鑑賞モード：アイコン非表示": {"ja": "鑑賞モード：アイコン非表示", "en": "Viewing mode: icons hidden"},
    "元の設定でアイコン非表示": {"ja": "元の設定でアイコン非表示", "en": "Icons hidden by your original settings"},
    "通常表示：アイコン表示": {"ja": "通常表示：アイコン表示", "en": "Normal mode: icons visible"},
    "アイコン表示を切り替えています…": {"ja": "アイコン表示を切り替えています…", "en": "Changing icon visibility…"},
    "鑑賞モードにしました": {"ja": "鑑賞モードにしました", "en": "Viewing mode enabled"},
    "元のアイコン表示へ戻しました": {"ja": "元のアイコン表示へ戻しました", "en": "Original icon visibility restored"},
    "切り替えできませんでした": {"ja": "切り替えできませんでした", "en": "Could not switch modes"},
    "保存データの形式が不正です": {"ja": "保存データの形式が不正です", "en": "Invalid saved data format"},
    "登録件数が上限を超えています": {"ja": "登録件数が上限を超えています", "en": "Too many saved items"},
    "IDが不正です": {"ja": "IDが不正です", "en": "Invalid item ID"},
    "タスクが不正です": {"ja": "タスクが不正です", "en": "Invalid task"},
    "ショートカットが不正です": {"ja": "ショートカットが不正です", "en": "Invalid link"},
    "絶対パスまたは ~/ から始まるパスを入力してください": {"ja": "絶対パスまたは ~/ から始まるパスを入力してください", "en": "Enter an absolute path or one starting with ~/"},
    "演出設定が不正です": {"ja": "演出設定が不正です", "en": "Invalid effects settings"},
    "残量の境界値が不正です": {"ja": "残量の境界値が不正です", "en": "Invalid battery thresholds"},
    "Dock余白が不正です": {"ja": "Dock余白が不正です", "en": "Invalid Dock clearance"},
    "鯉の配色設定が不正です": {"ja": "鯉の配色設定が不正です", "en": "Invalid koi color settings"},
    "鯉の表示設定が不正です": {"ja": "鯉の表示設定が不正です", "en": "Invalid koi visibility setting"},
    "鯉の大きさ・線の太さが不正です": {"ja": "鯉の大きさ・線の太さが不正です", "en": "Invalid koi size or stroke width"},
    "配置保存数が上限です": {"ja": "配置保存数が上限です", "en": "Too many saved layouts"},
    "配置が不正です": {"ja": "配置が不正です", "en": "Invalid layout"},
    "配置対象が不正です": {"ja": "配置対象が不正です", "en": "Invalid layout target"},
    "配置寸法が不正です": {"ja": "配置寸法が不正です", "en": "Invalid layout dimensions"},
    "保存データが大きすぎます": {"ja": "保存データが大きすぎます", "en": "Saved data is too large"},
    "保存データを読めません。上書きせず停止しました。": {"ja": "保存データを読めません。上書きせず停止しました。", "en": "Could not read saved data. Stopped without overwriting it."},
    "別の画面で更新されました。最新データを確認して再操作してください。": {"ja": "別の画面で更新されました。最新データを確認して再操作してください。", "en": "Another window updated the data. Review the latest version and try again."},
    "アプリまたはフォルダーが見つかりません": {"ja": "アプリまたはフォルダーが見つかりません", "en": "App or folder not found"},
    ".appのパスを指定してください": {"ja": ".appのパスを指定してください", "en": "Specify a path to an .app bundle"},
    "アプリは種類を「アプリ」にしてください": {"ja": "アプリは種類を「アプリ」にしてください", "en": "Select App as the type for an application"},
    "要求が不正です": {"ja": "要求が不正です", "en": "Invalid request"},
    "登録されていないショートカットです": {"ja": "登録されていないショートカットです", "en": "This link is not registered"},
    "未対応の操作です": {"ja": "未対応の操作です", "en": "Unsupported operation"},
    "操作できませんでした。入力や保存先を確認してください。": {"ja": "操作できませんでした。入力や保存先を確認してください。", "en": "Operation failed. Check your input and save location."},
    "処理結果を読めませんでした": {"ja": "処理結果を読めませんでした", "en": "Could not read the operation result"},
    "操作できませんでした": {"ja": "操作できませんでした", "en": "Operation failed"},
    "Finderを再読み込みできませんでした": {"ja": "Finderを再読み込みできませんでした", "en": "Could not reload Finder"},
    "デスクトップの表示設定を読めませんでした": {"ja": "デスクトップの表示設定を読めませんでした", "en": "Could not read desktop display settings"},
    "復元記録を読めません。上書きせず停止しました": {"ja": "復元記録を読めません。上書きせず停止しました", "en": "Could not read the restoration record. Stopped without overwriting it."},
    "切り替えできませんでした。「元の表示へ戻す」を試してください": {"ja": "切り替えできませんでした。「元の表示へ戻す」を試してください", "en": "Could not switch modes. Try Restore icons."},
    "表示の復元に失敗しました。鑑賞モードから元へ戻してください。": {"ja": "表示の復元に失敗しました。鑑賞モードから元へ戻してください。", "en": "Could not restore the display. Try restoring it from viewing mode."},
    "表示設定の形式が不明なため変更しません": {"ja": "表示設定の形式が不明なため変更しません", "en": "Unknown display settings format. No changes were made."},
    "表示言語が不正です": {"ja": "表示言語が不正です", "en": "Invalid display language"},
    "時計を折りたたむ": {"ja": "時計を折りたたむ", "en": "Collapse clock"},
    "時計を展開": {"ja": "時計を展開", "en": "Expand clock"},
    "システムを折りたたむ": {"ja": "システムを折りたたむ", "en": "Collapse system"},
    "システムを展開": {"ja": "システムを展開", "en": "Expand system"},
    "{task}を完了": {"ja": "{task}を完了", "en": "Complete: {task}"},
    "現在の通信速度 / 対象接続の合計": {"ja": "現在の通信速度 / 対象接続の合計", "en": "Current traffic / Combined connections"},
    "計測対象の接続方式を表示します。複数接続時は通信量を合計し、内訳を詳細に表示します。Wi-FiテザリングもWi-Fi、USBテザリングやUSB有線LANはUSB接続です。判別できない接続は判別不可と表示します。LAN内通信も含み、回線の最高速度ではありません。赤は受信、白は送信。KiB/sは1024バイト/秒です。": {"ja": "計測対象の接続方式を表示します。複数接続時は通信量を合計し、内訳を詳細に表示します。Wi-FiテザリングもWi-Fi、USBテザリングやUSB有線LANはUSB接続です。判別できない接続は判別不可と表示します。LAN内通信も含み、回線の最高速度ではありません。赤は受信、白は送信。KiB/sは1024バイト/秒です。", "en": "Shows the connection types being measured. Multiple connections are combined, with a breakdown in Details. Wi-Fi tethering is shown as Wi-Fi; USB tethering and USB LAN adapters as USB. Unrecognized types are shown as Unknown. Includes local network traffic, not maximum connection speed. Red: receive; white: send. KiB/s means 1024 bytes per second."},
    "接続：データ待ち": {"ja": "接続：データ待ち", "en": "Connection: Waiting for data"},
    "接続：なし": {"ja": "接続：なし", "en": "Connection: None"},
    "接続：{types}": {"ja": "接続：{types}", "en": "Connection: {types}"},
    "有線LAN": {"ja": "有線LAN", "en": "Wired LAN"},
    "USB接続": {"ja": "USB接続", "en": "USB"},
    "携帯回線": {"ja": "携帯回線", "en": "Cellular"},
    "判別不可": {"ja": "判別不可", "en": "Unknown"},
    "接続方式別の通信量": {"ja": "接続方式別の通信量", "en": "Traffic by connection type"}
  };
  let language = 'ja';
  const texts = new Map(), attributes = new Map();
  const format = (source, values = {}) => (messages[source]?.[language] ?? String(source ?? '')).replace(/\{(\w+)\}/g, (match, key) => Object.hasOwn(values, key) ? String(values[key]) : match);
  function paintText(node, record) {
    const value = record.prefix + format(record.source, record.values) + record.suffix;
    if (node.nodeType === 3) { if (node.nodeValue !== value) node.nodeValue = value; }
    else if (node.textContent !== value) node.textContent = value;
  }
  function text(node, source, values = {}) {
    const record = {source, values, prefix: '', suffix: ''};
    texts.set(node, record);paintText(node, record);
  }
  function attr(node, name, source, values = {}) {
    if (!attributes.has(node)) attributes.set(node, new Map());
    attributes.get(node).set(name, {source, values});
    node.setAttribute(name, format(source, values));
  }
  function prune() {
    for (const node of texts.keys()) if (!node.isConnected) texts.delete(node);
    for (const node of attributes.keys()) if (!node.isConnected) attributes.delete(node);
  }
  function bind(root) {
    // Bind only the original template once, before any user data is rendered.
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode, source = node.nodeValue.trim();
      if (!Object.hasOwn(messages, source) || node.parentElement?.closest('.decode')) continue;
      const value = node.nodeValue;
      texts.set(node, {source, values: {}, prefix: value.slice(0, value.indexOf(source)), suffix: value.slice(value.indexOf(source) + source.length)});
    }
    root.querySelectorAll('.decode').forEach(node => text(node, node.dataset.title));
    root.querySelectorAll('*').forEach(node => {
      for (const name of ['aria-label', 'placeholder', 'title', 'data-title']) {
        const source = node.getAttribute(name);
        if (Object.hasOwn(messages, source)) attr(node, name, source);
      }
    });
    paint(root);
  }
  function paint(root) {
    prune();
    for (const [node, record] of texts) paintText(node, record);
    for (const [node, records] of attributes) for (const [name, record] of records) node.setAttribute(name, format(record.source, record.values));
    root.lang = language;
    if (root.dataset.host !== 'native') document.documentElement.lang = language;
  }
  function setLanguage(next) {
    if (!['ja', 'en'].includes(next) || next === language) return;
    window.dispatchEvent(new Event('cyberdeck-language-changing'));
    language = next;paint(document.getElementById('surface'));
    window.dispatchEvent(new Event('cyberdeck-language'));
    window.dispatchEvent(new Event('cyberdeck-layout'));
  }
  window.CyberdeckI18n = {text, attr, prune, t: format, setLanguage, get language() {return language;}, get locale() {return language === 'en' ? 'en-US' : 'ja-JP';}};
  bind(document.getElementById('surface'));
})();
