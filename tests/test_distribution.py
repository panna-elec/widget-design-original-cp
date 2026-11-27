import importlib.util
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('distribution',ROOT/'scripts/manage-distribution.py')
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)

class Installation(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory(prefix='widget test ')
        self.addCleanup(self.temp.cleanup)
        self.base=Path(self.temp.name).resolve()
        self.source=self.base/'package'
        self.widget=self.source/m.WIDGET
        for name in ('index.jsx','background.jsx','lib/preferences.json','bin/collect.py','bin/desk_store.py','bin/stats','LICENSE','NOTICE.md'):
            path=self.widget/name;path.parent.mkdir(parents=True,exist_ok=True);path.write_text('{}' if name.endswith('.json') else 'original')
        self.widgets=self.base/'widgets with spaces'
        self.backups=self.base/'backups'
        self.state=self.base/'state';self.state.mkdir();(self.state/'state.json').write_text('PRIVATE-SENTINEL')
        self.manager=m.Manager(self.source,self.widgets,self.backups,self.state)

    def test_install_update_disable_restore_and_state(self):
        manager=self.manager
        self.widgets.mkdir();(self.widgets/'other.jsx').write_text('do not touch')
        self.assertIsNone(manager.operate('install'))
        self.assertTrue(os.access(manager.dest/'bin/stats',os.X_OK))
        with self.assertRaises(m.InstallError):manager.operate('install')
        (manager.dest/'lib/preferences.json').write_text('{"motion":"gentle"}')
        (self.widget/'index.jsx').write_text('new')
        previous=manager.operate('update')
        self.assertEqual((manager.dest/'index.jsx').read_text(),'new')
        self.assertEqual(json.loads((manager.dest/'lib/preferences.json').read_text()),{'motion':'gentle'})
        self.assertEqual((manager.saved(previous)/'index.jsx').read_text(),'original')
        replaced=manager.operate('restore',previous)
        self.assertEqual((manager.dest/'index.jsx').read_text(),'original')
        self.assertEqual((manager.saved(replaced)/'index.jsx').read_text(),'new')
        disabled=manager.operate('disable')
        self.assertFalse(manager.dest.exists())
        manager.operate('restore',disabled)
        self.assertEqual((self.state/'state.json').read_text(),'PRIVATE-SENTINEL')
        self.assertEqual((self.widgets/'other.jsx').read_text(),'do not touch')

    @unittest.skipUnless(sys.platform == 'darwin', 'macOS quarantine metadata')
    def test_install_preserves_quarantine_metadata(self):
        quarantine='0081;00000000;CyberdeckTest;00000000-0000-0000-0000-000000000000'
        subprocess.run(['/usr/bin/xattr','-w','com.apple.quarantine',quarantine,str(self.widget/'bin/stats')],check=True)
        self.manager.operate('install')
        saved=subprocess.check_output(['/usr/bin/xattr','-p','com.apple.quarantine',str(self.manager.dest/'bin/stats')],text=True).strip()
        self.assertTrue(int(saved.split(';')[0],16) & 1)
        self.assertEqual(saved.split(';')[-1],quarantine.split(';')[-1])

    def test_atomic_rollback_on_failed_update(self):
        manager=self.manager;manager.operate('install')
        original=os.rename
        def fail_stage(source,destination):
            if '.stage-' in str(source):raise OSError('simulated disk failure')
            return original(source,destination)
        with patch.object(m.os,'rename',side_effect=fail_stage):
            with self.assertRaises(OSError):manager.operate('update')
        self.assertEqual((manager.dest/'index.jsx').read_text(),'original')
        self.assertFalse(any(p.name.startswith('.stage-') for p in self.backups.iterdir()))

    def test_refuse_missing_partial_invalid_and_symlinks(self):
        manager=self.manager
        with self.assertRaises(m.InstallError):manager.operate('update')
        manager.dest.mkdir();(manager.dest/'index.jsx').write_text('foreign')
        with self.assertRaises(m.InstallError):manager.operate('update')
        shutil.rmtree(manager.dest);manager.operate('install')
        (manager.dest/'lib/preferences.json').write_text('{broken')
        with self.assertRaises(m.InstallError):manager.operate('update')
        self.assertEqual((manager.dest/'lib/preferences.json').read_text(),'{broken')
        (manager.dest/'link').symlink_to(self.state)
        with self.assertRaises(m.InstallError):manager.operate('disable')

    def test_lock_and_backup_scope(self):
        manager=self.manager;manager.operate('install')
        with manager.locked():
            with self.assertRaises(m.InstallError):manager.operate('update')
        backup=manager.operate('disable')
        with self.assertRaises(m.InstallError):manager.saved('../escape')
        metadata=self.backups/backup/'receipt.json';metadata.write_text('{"format":1,"widgets":"other"}')
        with self.assertRaises(m.InstallError):manager.saved(backup)
        with self.assertRaises(m.InstallError):m.Manager(self.source,self.widgets,self.widgets/'backups',self.state)

    def test_disable_keeps_widget_if_desktop_restore_fails(self):
        manager=self.manager;manager.operate('install')
        with patch.object(manager,'restore_desktop',side_effect=ValueError('restore failed')):
            with self.assertRaises(ValueError):manager.operate('disable')
        self.assertTrue(manager.dest.is_dir())

    def test_no_desktop_commands_without_owned_record(self):
        self.manager.operate('install')
        with patch.object(m.subprocess,'run',side_effect=AssertionError('unexpected command')):
            self.manager.operate('disable')

    def test_manifest_tampering_and_extra_file(self):
        files={p.relative_to(self.source).as_posix():m.hashlib.sha256(p.read_bytes()).hexdigest() for p in self.source.rglob('*') if p.is_file()}
        (self.source/'MANIFEST.json').write_text(json.dumps({'format':1,'architecture':'arm64','files':files}))
        m.verify_package(self.source)
        (self.source/'.DS_Store').write_bytes(b'finder')
        m.verify_package(self.source)
        (self.widget/'index.jsx').write_text('tampered')
        with self.assertRaises(m.InstallError):m.verify_package(self.source)
        (self.widget/'index.jsx').write_text('original')
        (self.source/'extra.txt').write_text('extra')
        with self.assertRaises(m.InstallError):m.verify_package(self.source)

class PythonRunner(unittest.TestCase):
    def test_python_in_path_with_spaces_and_argument_quoting(self):
        with tempfile.TemporaryDirectory(prefix='python runner ') as directory:
            binary=Path(directory)/'python3';binary.symlink_to(sys.executable)
            env=dict(os.environ,CYBERDECK_PYTHON=str(binary))
            value='spaces " ; $(echo do-not-execute)'
            result=subprocess.run(['/bin/bash',str(ROOT/'cyberdeck.widget/bin/python3.sh'),'-c','import sys; print(sys.argv[1])',value],env=env,text=True,capture_output=True)
            self.assertEqual(result.returncode,0,result.stderr);self.assertEqual(result.stdout.strip(),value)
    def test_missing_or_old_python_fails_with_guidance(self):
        with tempfile.TemporaryDirectory() as directory:
            old=Path(directory)/'python3';old.write_text('#!/bin/sh\nexit 1\n');old.chmod(0o755)
            for path in (str(old),str(Path(directory)/'missing')):
                result=subprocess.run(['/bin/bash',str(ROOT/'cyberdeck.widget/bin/python3.sh'),'-V'],env=dict(os.environ,CYBERDECK_PYTHON=path),text=True,capture_output=True)
                self.assertEqual(result.returncode,1);self.assertIn('Python 3.10+',result.stderr)

if __name__=='__main__':unittest.main()
