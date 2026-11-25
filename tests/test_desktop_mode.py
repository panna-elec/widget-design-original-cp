import sys,pathlib,tempfile,unittest,json
from unittest.mock import patch
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parents[1]/'cyberdeck.widget/bin'))
import desktop_mode as mode
class DesktopModeTests(unittest.TestCase):
 def test_hide_restore_preserves_original(self):
  for original in [None,True,False]:
   with self.subTest(original=original),tempfile.TemporaryDirectory() as t:
    directory=pathlib.Path(t);pref=[original]
    def set_value(value):pref[0]=value
    with patch.object(mode,'read_preference',lambda:pref[0]),patch.object(mode,'set_preference',set_value),patch.object(mode,'refresh_finder') as refresh:
     a=mode.change('hide',directory);self.assertTrue(a['hidden']);mode.change('hide',directory)
     if original is False:self.assertFalse(a['owned']);refresh.assert_not_called()
     else:self.assertEqual(mode.snapshot(directory)['original'],original)
     result=mode.change('restore',directory);self.assertEqual(pref[0],original);self.assertFalse(result['owned'])
 def test_external_change_is_preserved(self):
  with tempfile.TemporaryDirectory() as t:
   d=pathlib.Path(t);pref=[None]
   with patch.object(mode,'read_preference',lambda:pref[0]),patch.object(mode,'set_preference',lambda v:pref.__setitem__(0,v)),patch.object(mode,'refresh_finder'):
    mode.change('hide',d);pref[0]=True;mode.change('restore',d);self.assertIs(pref[0],True)
 def test_failed_refresh_rolls_back(self):
  with tempfile.TemporaryDirectory() as t:
   d=pathlib.Path(t);pref=[None]
   with patch.object(mode,'read_preference',lambda:pref[0]),patch.object(mode,'set_preference',lambda v:pref.__setitem__(0,v)),patch.object(mode,'refresh_finder',side_effect=[mode.ModeError('test'),None]):
    with self.assertRaises(mode.ModeError):mode.change('hide',d)
    self.assertIsNone(pref[0]);self.assertIsNone(mode.snapshot(d))
 def test_bad_snapshot_is_not_overwritten(self):
  with tempfile.TemporaryDirectory() as t:
   d=pathlib.Path(t);p=d/'desktop-mode.json';p.write_text('{broken')
   with patch.object(mode,'set_preference') as write:
    with self.assertRaises(mode.ModeError):mode.change('hide',d)
    write.assert_not_called();self.assertEqual(p.read_text(),'{broken')
if __name__=='__main__':unittest.main()
