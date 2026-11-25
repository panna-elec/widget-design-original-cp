import importlib.util, pathlib, tempfile, unittest, json
from unittest.mock import patch
import subprocess
ROOT=pathlib.Path(__file__).resolve().parents[1]
def module(name,path):
 s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
power=module('power',ROOT/'sketchybar/power-status.py')
prefs=module('prefs',ROOT/'scripts/apply-preferences.py')
def sample(source,state,percent=83):return f"Now drawing from '{source}'\n -InternalBattery-0 (id=1)\t{percent}%; {state}; present: true"
class Power(unittest.TestCase):
 def test_states(self):
  for source,state,expected in [('Battery Power','discharging','battery'),('AC Power','charging','charging'),('AC Power','charged','charged'),('AC Power','not charging','external'),('AC Power','finishing charge','external'),('AC Power','discharging','external-discharging')]:
   with self.subTest(state=state):self.assertEqual(power.parse_power(sample(source,state))['state'],expected)
 def test_invalid_is_not_old_percent(self):
  for text in ['',sample('AC Power','charging',101),sample('Battery Power','unknown'),sample('AC Power','charging',-1),'Now drawing from \'AC Power\'']:
   self.assertEqual(power.parse_power(text),{'state':'unknown','percent':None,'label':'取得待ち'})
 def test_timeout_and_command_failure(self):
  for error in [subprocess.TimeoutExpired("pmset",4),subprocess.CalledProcessError(1,"pmset"),OSError("missing")]:
   with patch.object(power.subprocess,"run",side_effect=error):
    self.assertEqual(power.read_power()["label"],"取得待ち")
 def test_unplug_replug(self):
  self.assertEqual([power.parse_power(sample(s,t))['state'] for s,t in [('AC Power','charging'),('Battery Power','discharging'),('AC Power','not charging')]],['charging','battery','external'])
class Preferences(unittest.TestCase):
 def test_persistence_stopped_running_and_invalid(self):
  with tempfile.TemporaryDirectory() as tmp:
   root=pathlib.Path(tmp);source=root/'cyberdeck.widget/lib/preferences.json';source.parent.mkdir(parents=True)
   data=dict(version=1,style='reference',palette='cyan',layout='left',motion='normal');source.write_text(json.dumps(data));installed=root/'installed/preferences.json'
   prefs.save(dict(data,motion='gentle'),root,installed)
   self.assertEqual(json.loads(source.read_text())['motion'],'gentle');self.assertFalse(installed.exists())
   installed.parent.mkdir();installed.write_text(source.read_text())
   prefs.save(data,root,installed)
   self.assertEqual(json.loads(source.read_text()),json.loads(installed.read_text()));self.assertEqual(json.loads(source.read_text())['motion'],'normal')
   before=source.read_bytes()
   with self.assertRaises(ValueError):prefs.save(dict(data,motion='auto'),root,installed)
   self.assertEqual(source.read_bytes(),before)
if __name__=='__main__':unittest.main()
