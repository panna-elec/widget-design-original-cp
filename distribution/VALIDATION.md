# Apple Silicon package validation / 配布候補の検証

Prerelease: `0.1.0-preview.1` · Validation date: 2026-11-27.

This document records the local validation preceding the Apple Silicon prerelease. The release remains ad-hoc signed and not notarized; publishing it does not turn the untested cases below into passed checks. The running widget and personal data were left in place.

## Environment / 環境

- Apple Silicon arm64; macOS 26.6.1.
- Python 3.13.18, Node.js 26.13.1, Apple Swift 6.2.1, macOS SDK 26.1.
- Installed Übersicht: 1.6, build 82. Its presence was detected; the newly packaged widget was not loaded into the active desktop installation.
- Binary target: `arm64-apple-macos13.0`. Targeting macOS 13 does not mean macOS 13 was tested.

## Completed / 実施した確認

| Check | Result / scope |
| --- | --- |
| ZIP integrity | SHA-256, archive CRC, safe paths, executable mode, explicit source allowlist and per-file manifest checked |
| Corresponding source | `native/Stats.swift`, every allowlisted source file, build/install tools, source hashes, compiler and target included; no dependency on a private source URL |
| Licenses and inventory | GPL/CC original copies match; OFL, Devicon MIT, notices and source records retained; asset hashes verified |
| Native helper | arm64-only Mach-O; minimum target 13.0; linked dependencies are Apple system libraries/frameworks; local execution yields expected metrics JSON |
| Collector integration | Real compiled helper + `collect.py` tested with synthetic desk state and mocked Finder status; real personal tasks were not loaded into test output |
| Python | 25 tests passed: previous 15 plus 10 package/runner tests |
| Install lifecycle | Actual filesystem install, update, disable and restore exercised under temporary directories, including paths with spaces. Native binary launches after placement. CLI prerequisite/install/update/restore paths also checked. Disable's Finder-state path uses a fixture, not the user's active viewing-mode record |
| Data retention | Existing initial preferences survive update; selected-backup preferences return on restore; task-state sentinel and unrelated widget remain unchanged |
| Failure protection | Duplicate install, incomplete/invalid existing widget, symlink content, bad backup ID/scope, concurrent lock and manifest tampering are rejected; simulated final-move failure restores the previous installation |
| Quarantine | Installer uses macOS `ditto` to retain quarantine metadata; a synthetic attribute test passes. The tool does not clear quarantine or change Gatekeeper settings |
| JavaScript | 7 metric, 15 network and 9 connection-type checks plus desk-model/resource and native pointer/bridge regressions passed |
| Swift classification | 8 synthetic interface classification checks passed |
| Browser | 27 existing language/control/connection/state tests passed in isolated headless Chrome with real-time waits, with no uncaught exceptions. Native host/state messages are simulated |
| Privacy | Packaged filenames/text/binary scanned for the local identity, home/temp paths and representative credential patterns; no match. ZIP has no personal state, backups, Git history, logs, caches or AppleDouble metadata. Earlier artwork is byte-identical to the previously audited source; newly generated manual illustrations have separate provenance and metadata checks |
| Active installation | File hashes of installed widget and private state match the pre-test snapshot; no active-widget replacement or Finder setting operation was performed |

## Signing and unfinished checks / 署名と未確認事項

- **Ad-hoc signature verification passes. Gatekeeper `spctl --assess --type execute` rejects this binary.** No Developer ID or Apple notarization was applied. This is a distribution-readiness limitation, not a passed download-install test. The synthetic quarantine-retention test does not establish that a real downloaded ZIP will run without approval.
- A real browser download, Archive Utility extraction with inherited quarantine, first-run approval on another Apple Silicon Mac, and a signed/notarized distribution remain untested/unprepared.
- The packaged changes were not installed into the user's active Übersicht desktop. Native WKWebView clicks, real desktop file selection, prolonged runtime, sleep/wake, multiple displays, old macOS and hardware network switching were not newly verified. Earlier live-widget confirmations in the root VALIDATION.md concern the earlier installed code.
- The archive's checksums detect file changes, not publisher identity or absence of third-party rights claims.

**日本語:** 隔離先での導入・更新・停止・復元、実行ファイル、保存保護、自動テストと画面回帰は確認済みです。現在使っているウィジェットと個人状態は変更していません。ただしGatekeeperの評価は拒否で、Developer ID署名・Apple公証は未対応です。別のMacへダウンロードして警告なく導入できる完成版としては扱わず、プレビュー候補として提供します。実機の新規導入とネイティブ画面の直接操作は別途確認が必要です。

## Repeat the local checks / 再確認

From an extracted package, with Python and Node.js available:

```sh
bash Manage.command check
python3 -B -m unittest discover -s tests -p 'test_*.py'
node scripts/check-metrics.mjs
node tests/check-desk-model.mjs
node tests/check-desk-resources.mjs
node tests/check-native-pointer.mjs
node tests/check-native-bridge.mjs
```

Serve only this package on a dedicated loopback port to run `tests/language-browser.html`. It uses synthetic data and restores preview storage on that origin. Do not point installer tests at the active widgets folder. Test `Manager` with an explicit temporary state directory when exercising disable: the real CLI intentionally restores the current user's owned viewing-mode record.

See [English installation](../INSTALL.md), [日本語の導入手順](../INSTALL.ja.md), and [earlier implementation checks](../VALIDATION.md).

## Illustrated offline manual / 図解付きオフラインマニュアル

- Added Japanese/English generated explanatory PNGs, text manuals, equivalent static HTML and START-HERE.html. Generated images were visually checked; recognizable third-party software logos were removed using the image tool. No live desktop screenshot was used.
- Offline file-URL checks in isolated Chrome: landing page and both manuals at 1200px and 390px widths (6 page/width combinations), all images loaded, no horizontal overflow, local file links present, Japanese then English navigation passed, no uncaught exceptions. Japanese desktop and English mobile renderings were visually inspected. Text alternatives and full-size image links are included.
- PNG provenance chunks were inspected and retained; no local identity/path or representative secret pattern was found. Source prompts and license/provenance record are bundled. Reading the manual makes no external request; following official external links is an explicit reader action.
- Reading uses no server or extra runtime. Pandoc is required only for rebuilding HTML from the Markdown sources. No PDF was generated; browser printing is offered but its full pagination was not tested.
- Widget executable/UI/installer code is unchanged from the tested candidate above; the final package is rechecked after the documentation additions.
