#!/usr/bin/env python3
"""Build an allowlisted arm64 ZIP from local source. Never uploads or installs."""
# Copyright (C) 2026 panna-elec; SPDX-License-Identifier: GPL-3.0-or-later
import argparse
import hashlib
import json
import os
from pathlib import Path
import platform
import re
import shutil
import subprocess
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]
TARGET = 'arm64-apple-macos13.0'

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def build(version, source_base, output):
    if not re.fullmatch(r'\d+\.\d+\.\d+(?:-[A-Za-z0-9.-]+)?', version):
        raise ValueError('Use a version such as 0.1.0-preview.1')
    if not re.fullmatch(r'[0-9a-f]{40}', source_base):
        raise ValueError('Provide the 40-character source base commit; local changes are separately hashed.')
    if platform.system() != 'Darwin':
        raise ValueError('Build on macOS with Xcode Command Line Tools.')
    names = json.loads((ROOT/'distribution/files.json').read_text())
    if len(names) != len(set(names)):
        raise ValueError('Duplicate allowlist entries')
    output.mkdir(parents=True, exist_ok=True)
    stem = f'widget-design-{version}-macos-arm64'
    archive = output/(stem+'.zip')
    checksum = output/(stem+'.zip.sha256')
    if archive.exists() or checksum.exists():
        raise ValueError('Output already exists; use a new output directory or version.')
    with tempfile.TemporaryDirectory(prefix='widget-package-') as temp:
        staging = Path(temp)/stem
        staging.mkdir()
        hashes = {}
        for name in sorted(names):
            relative = Path(name)
            if relative.is_absolute() or '..' in relative.parts:
                raise ValueError('Unsafe allowlist path')
            original = ROOT/relative
            if not original.is_file() or any(p.is_symlink() for p in (original, *original.parents)):
                raise ValueError('Missing file or symlink: '+name)
            content = original.read_bytes()
            # Prevent common local paths/credential material entering this package.
            for pattern in (rb'/Users/[A-Za-z0-9_.-]+', rb'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----', rb'gh[pousr]_[A-Za-z0-9]{25,}', rb'github_pat_[A-Za-z0-9_]{30,}'):
                if re.search(pattern, content):
                    raise ValueError('Private-data pattern in allowlisted file: '+name)
            target = staging/relative
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(original, target)
            target.chmod(0o755 if name.endswith(('.sh','.command')) else 0o644)
            hashes[name] = sha(target)
        binary = staging/'cyberdeck.widget/bin/stats'
        env = os.environ.copy()
        env['CLANG_MODULE_CACHE_PATH'] = str(Path(temp)/'module-cache')
        # Use a relative input path; no debug info or local absolute source path.
        subprocess.run(['swiftc','-O','-target',TARGET,'native/Stats.swift','-o',str(binary)], cwd=staging, env=env, check=True)
        subprocess.run(['/usr/bin/codesign','--force','--sign','-','--timestamp=none',str(binary)], check=True)
        subprocess.run(['/usr/bin/codesign','--verify','--strict',str(binary)], check=True)
        if re.search(rb'/Users/[A-Za-z0-9_.-]+', binary.read_bytes()):
            raise ValueError('Local home path in executable')
        binary.chmod(0o755)
        metadata = {'format':1, 'version':version, 'architecture':'arm64', 'deploymentTarget':'macOS 13.0',
                    'sourceBaseCommit':source_base, 'sourceState':'local changes included; see sourceFilesSHA256',
                    'sourceFilesSHA256':hashes, 'swift':subprocess.check_output(['swiftc','--version'],text=True).strip(),
                    'signing':'ad-hoc; no Developer ID; not notarized', 'statsSHA256':sha(binary)}
        (staging/'BUILD-INFO.json').write_text(json.dumps(metadata,indent=2)+'\n')
        files = {p.relative_to(staging).as_posix():sha(p) for p in sorted(staging.rglob('*')) if p.is_file()}
        manifest = {'format':1,'version':version,'architecture':'arm64','files':files}
        (staging/'MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n')
        # No extended attributes, AppleDouble sidecars, user names, or timestamps.
        with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as zipped:
            for path in sorted(staging.rglob('*')):
                if not path.is_file():
                    continue
                info = zipfile.ZipInfo(stem+'/'+path.relative_to(staging).as_posix(), date_time=(2026,11,27,0,0,0))
                info.create_system = 3
                info.external_attr = ((0o100755 if os.access(path,os.X_OK) else 0o100644)<<16)
                info.compress_type = zipfile.ZIP_DEFLATED
                zipped.writestr(info,path.read_bytes())
        checksum.write_text(sha(archive)+'  '+archive.name+'\n')
    print(archive)
    print(checksum)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--version',default='0.1.0-preview.1')
    parser.add_argument('--source-base',required=True)
    parser.add_argument('--output',type=Path,default=ROOT/'exports')
    args = parser.parse_args()
    build(args.version,args.source_base,args.output.resolve())
