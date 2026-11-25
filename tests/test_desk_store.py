import sys,tempfile,pathlib,unittest,copy,json
from unittest.mock import patch
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parents[1]/'cyberdeck.widget/bin'))
import desk_store as store
class DeskStore(unittest.TestCase):
 def test_persistence_and_conflict(self):
  with tempfile.TemporaryDirectory() as t:
   d=pathlib.Path(t);s=store.initial();s['tasks']=[dict(id='t1',text='local <task>',done=False)]
   saved=store.save_state(s,0,d);self.assertEqual(saved['revision'],1);self.assertEqual(store.read_state(d)['tasks'],s['tasks'])
   with self.assertRaises(store.StateError):store.save_state(s,0,d)
   self.assertEqual(store.read_state(d),saved)
   (d/'state.json').write_text('{broken')
   with self.assertRaises(store.StateError):store.save_state(saved,1,d)
   self.assertEqual((d/'state.json').read_text(),'{broken')
 def test_old_settings_and_koi_choice(self):
  s=store.initial();s['tasks']=[dict(id='preserved',text='keep',done=False)];s['settings'].pop('koi');s['settings'].pop('koiPalette');s['settings'].pop('koiPower')
  migrated=store.validate(s);self.assertTrue(migrated['settings']['koi']);self.assertEqual(migrated['tasks'],s['tasks'])
  self.assertEqual(migrated['settings']['koiPalette'],'rose');self.assertFalse(migrated['settings']['koiPower'])
  migrated['settings']['koi']=False;self.assertFalse(store.validate(migrated)['settings']['koi'])
  migrated['settings']['koi']='yes'
  with self.assertRaises(store.StateError):store.validate(migrated)
 def test_koi_size_weight_roundtrip_and_legacy(self):
  old=store.initial();old['settings'].pop('koiSize');old['settings'].pop('koiWeight')
  old['tasks']=[dict(id='keep',text='preserved',done=False)]
  migrated=store.validate(old)
  self.assertEqual(migrated['settings']['koiSize'],100);self.assertEqual(migrated['settings']['koiWeight'],100)
  with tempfile.TemporaryDirectory() as t:
   d=pathlib.Path(t);s=migrated
   for size in [100,115,130]:
    for weight in [100,130,160]:
     s['settings'].update(koiSize=size,koiWeight=weight)
     s=store.save_state(s,s['revision'],d);read=store.read_state(d)
     self.assertEqual(read,s);self.assertEqual(read['tasks'],old['tasks'])
   for key in ['koiSize','koiWeight']:
    for invalid in [True,'100',101,None,{},float('nan')]:
     bad=copy.deepcopy(s);bad['settings'][key]=invalid
     with self.assertRaises(store.StateError):store.validate(bad)
 def test_invalid_limits(self):
  for mutate in [lambda s:s['settings'].update(low=30,mid=20),lambda s:s.update(tasks=[dict(id='a',text='x',done=False)]*2),lambda s:s.update(layout={'bad':{'clock':dict(x=float('nan'),y=0,w=.5,h=.5)}}),lambda s:s['shortcuts'].append(dict(id='x',label='x',kind='folder',path='relative/path'))]:
   s=store.initial();mutate(s)
   with self.assertRaises(store.StateError):store.validate(s)
 def test_launch_is_literal_directory(self):
  with tempfile.TemporaryDirectory() as t:
   folder=pathlib.Path(t)/'literal; folder';folder.mkdir()
   with patch.object(store.subprocess,'run') as run:
    store.launch(dict(path=str(folder),kind='folder'));self.assertEqual(run.call_args.args[0],['/usr/bin/open','--',str(folder.resolve())])
   file=pathlib.Path(t)/'script.command';file.write_text('no execution')
   with self.assertRaises(store.StateError):store.launch(dict(path=str(file),kind='folder'))
if __name__=='__main__':unittest.main()
