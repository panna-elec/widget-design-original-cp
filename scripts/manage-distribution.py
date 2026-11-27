#!/usr/bin/env python3
"""Local install/update/disable/restore; never changes other widgets or desk data."""
# Copyright (C) 2026 panna-elec; SPDX-License-Identifier: GPL-3.0-or-later
import argparse
import contextlib
import fcntl
import hashlib
import json
import os
from pathlib import Path
import platform
import plistlib
import re
import shutil
import subprocess
import struct
import sys
import tempfile
import uuid

ROOT = Path(__file__).resolve().parents[1]
WIDGET = 'cyberdeck.widget'
SUPPORT = Path.home() / 'Library/Application Support'

class InstallError(ValueError):
    pass

def no_symlinks(path):
    path = Path(os.path.abspath(path))
    for parent in (path, *path.parents):
        if parent.is_symlink():
            raise InstallError('Symlink locations are not supported.')
    if path.is_dir():
        for child in path.rglob('*'):
            if child.is_symlink() or not (child.is_file() or child.is_dir()):
                raise InstallError('Symlinks and special files are not supported.')
    return path

def widget_ok(path):
    no_symlinks(path)
    for name in ('index.jsx', 'background.jsx', 'lib/preferences.json', 'bin/collect.py', 'bin/desk_store.py', 'bin/stats', 'LICENSE', 'NOTICE.md'):
        if not (path / name).is_file():
            raise InstallError('Not a complete Cyberdeck widget; no files were replaced.')
    try:
        if not isinstance(json.loads((path/'lib/preferences.json').read_text()), dict):
            raise ValueError()
    except (ValueError, OSError) as error:
        raise InstallError('Invalid preferences; no files were replaced.') from error

def verify_package(root):
    manifest = json.loads((root/'MANIFEST.json').read_text())
    if manifest.get('format') != 1 or manifest.get('architecture') != 'arm64':
        raise InstallError('Invalid package manifest.')
    files = manifest.get('files')
    if not isinstance(files, dict) or not files:
        raise InstallError('Empty package manifest.')
    actual = {p.relative_to(root).as_posix() for p in root.rglob('*') if p.is_file() and p.name != '.DS_Store'}
    if actual != set(files) | {'MANIFEST.json'}:
        raise InstallError('Package files changed; extract a fresh ZIP.')
    no_symlinks(root)
    for name, expected in files.items():
        if Path(name).is_absolute() or '..' in Path(name).parts:
            raise InstallError('Unsafe manifest path.')
        if hashlib.sha256((root/name).read_bytes()).hexdigest() != expected:
            raise InstallError('Package checksum mismatch; extract a fresh ZIP.')
    widget_ok(root/WIDGET)
    return manifest

def check_environment(root, app=None):
    manifest = verify_package(root)
    if platform.system() != 'Darwin' or platform.machine() != 'arm64':
        raise InstallError('This package requires native Apple Silicon macOS (not Rosetta).')
    if int(platform.mac_ver()[0].split('.')[0]) < 13:
        raise InstallError('This preview binary targets macOS 13 or later.')
    apps = [app] if app else [Path('/Applications/Übersicht.app'), Path.home()/'Applications/Übersicht.app']
    chosen = None
    for location in apps:
        try:
            info = plistlib.loads((location/'Contents/Info.plist').read_bytes())
            if info.get('CFBundleIdentifier') == 'tracesOf.Uebersicht':
                chosen = info
                break
        except (OSError, ValueError, plistlib.InvalidFileException):
            pass
    if not chosen:
        raise InstallError('Install Übersicht first, or pass --uebersicht-app /path/to/Übersicht.app.')
    header = (root/WIDGET/'bin/stats').read_bytes()[:8]
    if len(header) != 8 or struct.unpack('<II', header) != (0xfeedfacf, 0x0100000c):
        raise InstallError('The collector is not an arm64-only binary.')
    # Does not open Übersicht, execute stats, or access personal state.
    return {'package':manifest['version'], 'python':platform.python_version(), 'architecture':'arm64',
            'uebersicht':chosen.get('CFBundleShortVersionString'), 'build':chosen.get('CFBundleVersion')}

class Manager:
    def __init__(self, root, widgets, backups, state=SUPPORT/'Cyberdeck'):
        self.root = no_symlinks(root)
        self.widgets = no_symlinks(widgets)
        self.backups = no_symlinks(backups)
        self.state = Path(state)
        self.dest = self.widgets/WIDGET
        if (self.backups == self.widgets or self.widgets in self.backups.parents or
                self.backups in self.widgets.parents or self.backups == self.root or
                self.root in self.backups.parents or self.backups in self.root.parents):
            raise InstallError('Use a separate backup folder outside the package and widgets folder.')

    @contextlib.contextmanager
    def locked(self):
        self.widgets.mkdir(parents=True, exist_ok=True)
        self.backups.mkdir(parents=True, exist_ok=True, mode=0o700)
        no_symlinks(self.backups)
        if self.widgets.stat().st_dev != self.backups.stat().st_dev:
            raise InstallError('Backups must be on the same filesystem as widgets for atomic moves.')
        lock_path = self.backups/'.install.lock'
        if lock_path.is_symlink():
            raise InstallError('Invalid lock file.')
        with lock_path.open('a') as lock:
            try:
                fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
            except BlockingIOError as error:
                raise InstallError('Another installation operation is running.') from error
            yield

    def saved(self, ident):
        if not re.fullmatch(r'[0-9a-f]{32}', ident or ''):
            raise InstallError('Use a backup ID printed by this tool.')
        folder = self.backups/ident
        no_symlinks(folder)
        metadata = json.loads((folder/'receipt.json').read_text())
        if metadata != {'format':1, 'widgets':str(self.widgets)}:
            raise InstallError('Backup belongs to a different widgets folder.')
        widget_ok(folder/WIDGET)
        return folder/WIDGET

    def backup(self):
        widget_ok(self.dest)
        ident = uuid.uuid4().hex
        folder = self.backups/ident
        folder.mkdir(mode=0o700)
        (folder/'receipt.json').write_text(json.dumps({'format':1, 'widgets':str(self.widgets)}))
        try:
            os.rename(self.dest, folder/WIDGET)
        except BaseException:
            shutil.rmtree(folder)
            raise
        return ident

    def put(self, source, preserve_preferences=False):
        widget_ok(source)
        if self.dest.exists():
            widget_ok(self.dest)
        # Outside Übersicht's watched tree; on the same filesystem.
        with tempfile.TemporaryDirectory(prefix='.stage-', dir=self.backups) as temp:
            stage = Path(temp)/WIDGET
            # ditto retains macOS quarantine; Python copy2 does not copy xattrs on macOS.
            subprocess.run(['/usr/bin/ditto', '--rsrc', '--extattr', str(source), str(stage)], check=True)
            (stage/'bin/stats').chmod(0o755)
            if preserve_preferences:
                shutil.copy2(self.dest/'lib/preferences.json', stage/'lib/preferences.json')
            old = self.backup() if self.dest.exists() else None
            try:
                os.rename(stage, self.dest)
            except BaseException:
                if old:
                    os.rename(self.backups/old/WIDGET, self.dest)
                    shutil.rmtree(self.backups/old)
                raise
        return old

    def restore_desktop(self):
        # Only a restoration record created by this widget authorizes an OS change.
        if not (self.state/'desktop-mode.json').exists():
            return
        sys.path.insert(0, str(self.root/WIDGET/'bin'))
        import desktop_mode
        desktop_mode.change('restore', self.state)

    def operate(self, action, backup_id=None):
        with self.locked():
            if action == 'install':
                if self.dest.exists():
                    raise InstallError('Already installed. Use update to retain a backup.')
                return self.put(self.root/WIDGET)
            if action == 'update':
                if not self.dest.exists():
                    raise InstallError('Not installed. Use install first.')
                return self.put(self.root/WIDGET, preserve_preferences=True)
            if action == 'restore':
                return self.put(self.saved(backup_id))
            if action == 'disable':
                if not self.dest.exists():
                    raise InstallError('Not installed; nothing to disable.')
                widget_ok(self.dest)
                self.restore_desktop()
                return self.backup()
            raise InstallError('Unsupported operation.')

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=['check', 'install', 'update', 'disable', 'restore'])
    parser.add_argument('--widgets-dir', type=Path, default=SUPPORT/'Übersicht/widgets')
    parser.add_argument('--backup-dir', type=Path, default=SUPPORT/'Cyberdeck-install-backups')
    parser.add_argument('--uebersicht-app', type=Path)
    parser.add_argument('--backup-id')
    args = parser.parse_args()
    try:
        environment = check_environment(ROOT, args.uebersicht_app)
        print('Checks passed:', json.dumps(environment))
        if args.action == 'check':
            return
        manager = Manager(ROOT, args.widgets_dir, args.backup_dir)
        ident = manager.operate(args.action, args.backup_id)
        print('Completed:', args.action)
        if ident:
            print('Retained backup ID:', ident)
        print('Refresh all Widgets in Übersicht. Personal desk data was not removed.')
    except (InstallError, OSError, ValueError, subprocess.SubprocessError) as error:
        print('Stopped:', error, file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
