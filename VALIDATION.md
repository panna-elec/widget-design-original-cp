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
