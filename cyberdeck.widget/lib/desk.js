import {energy,safeArea,constrain,normalize,expand,overlaps,initialDesk} from './desk-model.mjs';
const root=document.getElementById('surface'), native=root.classList.contains('native'), $=id=>document.getElementById(id);
const panel=document.querySelector('.desk-panel'), system=document.querySelector('.system-panel'), clock=document.querySelector('.clock-panel');
const i18n=window.CyberdeckI18n;
const clone=o=>JSON.parse(JSON.stringify(o)), previewKey='cyberdeck-desk-preview-v1';
let state=initialDesk(), ready=!native, busy=false, open=false, folded=false, activeTab='resources', taskEdit=null, linkEdit=null, undo=null;
let latest=null,lastData=0,lastBattery='',lastDisk='',pulseTimer=0,editing=false,draft=null,layoutFallback=false,screenKey='',automaticDock={edge:'bottom',reserve:72};
const pending=new Map(), selectedPanels={clock,system,desk:panel};
try{if(!native){const saved=JSON.parse(localStorage.getItem(previewKey));if(saved?.version===1&&saved.settings&&Array.isArray(saved.tasks))state=saved;}}catch(_){}
let statusSource='';
function status(message){statusSource=message;i18n.text($('desk-status'),message);}
function post(type,extra={}){parent.postMessage({channel:'cyberdeck',type,...extra},location.origin);}
function request(request){
 if(!native){
  if(request.action==='desktop-mode')return Promise.resolve({ok:false,error:'実機のデスクから切り替えてください'});
  if(request.action==='launch')return Promise.resolve({ok:false,error:'プレビューでは起動しません。実機のデスクから開いてください。'});
  try{const next=clone(request.state);next.revision=state.revision+1;localStorage.setItem(previewKey,JSON.stringify(next));return Promise.resolve({ok:true,state:next});}catch(_){return Promise.resolve({ok:false,error:'ブラウザーへ保存できませんでした'});}
 }
 return new Promise(resolve=>{const id=crypto.randomUUID();const timeout=setTimeout(()=>{pending.delete(id);resolve({ok:false,error:'応答待ちです。保存状態を確認して再操作してください。'});},15000);pending.set(id,{resolve,timeout});post('desk-action',{requestId:id,request});});
}
async function save(next,message='保存しました'){
 if(!ready||busy){status(ready?'処理中です':'実機データの取得待ちです');return false;}
 busy=true;status('保存中…');
 const result=await request({action:'save',expected:state.revision,state:next});busy=false;
 if(result.ok){state=result.state;applySettings();renderLists();status(message);return true;}
 status(result.error||'保存できませんでした');return false;
}
function element(tag,text,cls){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;}
function button(text,fn){const b=element('button');i18n.text(b,text);b.type='button';b.onclick=fn;return b;}
function translatedElement(tag,text){const node=element(tag);i18n.text(node,text);return node;}
function renderLists(){
 $('task-count').textContent=state.tasks.filter(t=>t.done).length+'/'+state.tasks.length;
 const tasks=$('task-list');tasks.replaceChildren();
 if(!state.tasks.length)tasks.append(translatedElement('li','タスクはありません'));
 state.tasks.forEach(task=>{
  const li=element('li'),label=element('label'),check=element('input');check.type='checkbox';check.checked=task.done;i18n.attr(check,'aria-label','{task}を完了',{task:task.text});
  const title=element('span',task.text,task.done?'done-text':'');label.append(check,title);li.append(label);
  check.onchange=async()=>{const next=clone(state),done=check.checked;next.tasks.find(t=>t.id===task.id).done=done;const ok=await save(next,done?'MISSION COMPLETE':'未完了へ戻しました');if(ok&&done&&root.dataset.motion==='normal'&&!matchMedia('(prefers-reduced-motion:reduce)').matches){const node=$('task-list').children[state.tasks.findIndex(t=>t.id===task.id)];node?.classList.add('task-finished');}if(!ok)check.checked=task.done;};
  const actions=element('div',undefined,'row-actions');actions.append(button('編集',()=>{taskEdit=task.id;$('task-text').value=task.text;i18n.text($('task-submit'),'更新');$('task-text').focus();}),button('削除',async()=>{const next=clone(state);next.tasks=next.tasks.filter(t=>t.id!==task.id);if(await save(next,'削除しました。元に戻せます')){undo=task;$('task-undo').hidden=false;}}));li.append(actions);tasks.append(li);
 });
 const list=$('shortcut-list');list.replaceChildren();
 if(!state.shortcuts.length)list.append(translatedElement('li','ショートカットはありません'));
 state.shortcuts.forEach(link=>{const li=element('li');li.append(element('span',link.label,'list-title'));const actions=element('div',undefined,'row-actions');actions.append(button('開く',async()=>{if(busy)return;busy=true;const result=await request({action:'launch',id:link.id});busy=false;status(result.ok?'開きました':result.error);}),button('編集',()=>{linkEdit=link.id;$('shortcut-label').value=link.label;$('shortcut-path').value=link.path;$('shortcut-kind').value=link.kind;i18n.text($('shortcut-submit'),'更新');}),button('削除',async()=>{const next=clone(state);next.shortcuts=next.shortcuts.filter(i=>i.id!==link.id);await save(next);}));li.append(actions);list.append(li);});
 i18n.prune();
}
function clearTask(){taskEdit=null;$('task-form').reset();i18n.text($('task-submit'),'追加');}
function clearLink(){linkEdit=null;$('shortcut-form').reset();i18n.text($('shortcut-submit'),'登録');}
$('task-form').onsubmit=async e=>{e.preventDefault();const text=$('task-text').value.trim();if(!text)return;if(!taskEdit&&state.tasks.length>=100){status('タスクは100件までです');return;}const next=clone(state);if(taskEdit){const task=next.tasks.find(t=>t.id===taskEdit);if(!task){clearTask();return;}task.text=text;}else next.tasks.push({id:crypto.randomUUID(),text,done:false});if(await save(next))clearTask();};
$('task-cancel').onclick=clearTask;
$('task-undo').onclick=async()=>{if(!undo)return;const next=clone(state);if(next.tasks.length>=100){status('上限100件のため復元できません');return;}next.tasks.push(undo);if(await save(next,'復元しました')){undo=null;$('task-undo').hidden=true;}};
$('shortcut-form').onsubmit=async e=>{e.preventDefault();const label=$('shortcut-label').value.trim(),path=$('shortcut-path').value.trim(),kind=$('shortcut-kind').value;if(!label||!path)return;if(!path.startsWith('/')&&!path.startsWith('~/')){status('絶対パスまたは ~/ から入力してください');return;}if(!linkEdit&&state.shortcuts.length>=24){status('ショートカットは24件までです');return;}const next=clone(state),item={id:linkEdit||crypto.randomUUID(),label,path,kind};if(linkEdit){const index=next.shortcuts.findIndex(t=>t.id===linkEdit);if(index<0){clearLink();return;}next.shortcuts[index]=item;}else next.shortcuts.push(item);if(await save(next))clearLink();};
$('shortcut-cancel').onclick=clearLink;
function effectForm(){const s=state.settings;$('battery-effects').checked=s.batteryEffects;$('particles-enabled').checked=s.particles;$('koi-enabled').checked=s.koi!==false;$('koi-palette').value=s.koiPalette||'rose';$('koi-power').checked=s.koiPower===true;$('koi-size').value=s.koiSize||100;$('koi-weight').value=s.koiWeight||100;$('energy-low').value=s.low;$('energy-mid').value=s.mid;$('desk-dock').value=s.dock;$('dock-reserve').value=s.reserve;}
$('display-language').onchange=async e=>{const next=clone(state);next.settings.language=e.target.value;$('display-language').disabled=true;try{await save(next);}finally{$('display-language').value=i18n.language;$('display-language').disabled=!ready||busy;}};
$('effects-form').onsubmit=async e=>{e.preventDefault();const low=Number($('energy-low').value),mid=Number($('energy-mid').value);if(!Number.isInteger(low)||!Number.isInteger(mid)||low<5||low>40||mid<low+5||mid>90){status('少ない残量は5〜40%、中程度はそれより5%以上高く90%以下にしてください');return;}const next=clone(state);next.settings={...state.settings,batteryEffects:$('battery-effects').checked,particles:$('particles-enabled').checked,koi:$('koi-enabled').checked,koiPalette:$('koi-palette').value,koiPower:$('koi-power').checked,koiSize:Number($('koi-size').value),koiWeight:Number($('koi-weight').value),low,mid,dock:$('desk-dock').value,reserve:Number($('dock-reserve').value)};await save(next);};
function motionOK(){return root.dataset.motion==='normal'&&!matchMedia('(prefers-reduced-motion:reduce)').matches&&!document.hidden;}
function resources(data){
 latest=data;lastData=Date.now();const d=data?.disk,b=data?.battery;
 if(data && statusSource==='実測値の更新が止まっています')status('');
 const disk=d&&Number.isFinite(d.free)&&Number.isFinite(d.total)&&d.total>0&&d.free>=0&&d.free<=d.total?d:null;
 const battery=b&&Number.isFinite(b.percent)&&b.percent>=0&&b.percent<=100?b:null;
 for(const [name,value] of [['disk',disk?100*disk.free/disk.total:null],['battery',battery?.percent??null]]){
  $(name+'-percent').textContent=value===null?'—':Math.round(value)+'%';$(name+'-arc').style.strokeDasharray=(value??0)+' 100';$(name+'-bar').style.width=(value??0)+'%';
 }
 i18n.text($('disk-detail'),disk?(disk.free/2**30).toFixed(1)+' / '+(disk.total/2**30).toFixed(1)+' GiB':'取得待ち');
 const label=battery?(battery.charging?'充電中':battery.external?'電源接続':'バッテリー使用中'):'取得待ち';i18n.text($('battery-detail'),label);
 i18n.text($('resource-source'),native?(data?'LIVE / SSD・電源は5秒更新':'STALE / データ待ち'):'DEMO / SSD・電源は仮データ');
 if((lastBattery&&lastBattery!==label)||(lastDisk&&lastDisk!==(disk?'ok':'error'))){if(motionOK()){$('battery-card').classList.remove('changed');void $('battery-card').offsetWidth;$('battery-card').classList.add('changed');clearTimeout(pulseTimer);pulseTimer=setTimeout(()=>$('battery-card').classList.remove('changed'),750);}}
 lastBattery=label;lastDisk=disk?'ok':'error';
 if(data?.dock&&['bottom','left','right'].includes(data.dock.edge))automaticDock=data.dock;
 applySettings();
}
function applySettings(){
 i18n.setLanguage(state.settings.language||'ja');$('display-language').value=i18n.language;$('display-language').disabled=!ready||busy;
 root.dataset.energy=energy(latest?.battery,state.settings);root.dataset.particles=String(state.settings.particles);root.dataset.koi=String(state.settings.koi!==false);root.dataset.koiPalette=state.settings.koiPalette||'rose';root.dataset.koiPower=String(state.settings.koiPower===true);root.dataset.koiSize=String(state.settings.koiSize||100);root.dataset.koiWeight=String(state.settings.koiWeight||100);
 if(native)post('desk-appearance',{settings:state.settings});
 updateBounds();window.dispatchEvent(new Event('cyberdeck-layout'));
}
function showDesk(value){open=value;root.classList.toggle('desk-open',value);panel.hidden=!value;$('desk-open').setAttribute('aria-expanded',String(value));if(!value){root.classList.remove('desk-focus');endEditing(false);}window.dispatchEvent(new Event('cyberdeck-layout'));}
$('desk-open').onclick=()=>showDesk(!open);$('desk-close').onclick=()=>showDesk(false);
$('desk-fold').onclick=()=>{folded=!folded;$('desk-fold').textContent=folded?'+':'−';$('desk-fold').setAttribute('aria-expanded',String(!folded));panel.querySelector('.desk-tabs').hidden=folded;panel.querySelector('.desk-scroll').hidden=folded;$('desk-status').hidden=folded;window.dispatchEvent(new Event('cyberdeck-layout'));};
function selectTab(name){if(activeTab==='layout'&&editing&&name!=='layout')endEditing(false);activeTab=name;panel.querySelectorAll('[data-desk-tab]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.deskTab===name)));panel.querySelectorAll('[data-desk-page]').forEach(p=>p.hidden=p.dataset.deskPage!==name);if(name==='effects')effectForm();window.dispatchEvent(new Event('cyberdeck-layout'));}
panel.querySelectorAll('[data-desk-tab]').forEach(b=>b.onclick=()=>selectTab(b.dataset.deskTab));

// Layout editor uses normalized rectangles so resize/screen changes remain bounded.
let bounds=safeArea(innerWidth,innerHeight),profile=null,customApplied=false;
const guide=element('div',undefined,'layout-guide');guide.setAttribute('aria-hidden','true');root.append(guide);
function keyFor(){return root.dataset.style+'_'+innerWidth+'x'+innerHeight+'_'+(state.settings.dock==='auto'?automaticDock.edge:state.settings.dock);}
function updateBounds(){
 const dock=state.settings.dock==='auto'?automaticDock:{edge:state.settings.dock,reserve:state.settings.reserve};bounds=safeArea(innerWidth,innerHeight,dock);
 const key=keyFor();if(key!==screenKey){if(editing)endEditing(false);screenKey=key;layoutFallback=false;}
 profile=state.layout[screenKey]||null;
 Object.assign(guide.style,{left:bounds.x+'px',top:bounds.y+'px',width:bounds.w+'px',height:bounds.h+'px'});
}
const rect=e=>({x:e.offsetLeft,y:e.offsetTop,w:e.offsetWidth,h:e.offsetHeight});
function applyRect(e,r){for(const [k,v] of Object.entries({left:r.x,top:r.y,width:r.w,height:r.h,right:'auto'})){const value=typeof v==='number'?Math.round(v)+'px':v;if(e.style[k]!==value)e.style[k]=value;}}
function resetInline(){Object.values(selectedPanels).forEach(e=>['left','top','width','height','right'].forEach(k=>e.style.removeProperty(k)));customApplied=false;}
function layoutRects(){return draft||(profile&&!layoutFallback?Object.fromEntries(Object.entries(profile).map(([k,r])=>[k,expand(r,bounds)])):null);}
function validPair(rectangles){const a=rectangles.clock;return !a||['system',...(bounds.h<620?[]:['desk'])].every(k=>!rectangles[k]||!overlaps(a,rectangles[k]));}
function autoInset(){
 const left=Math.max(root.dataset.style==='reference'?26:32,bounds.x),width=Math.min(root.dataset.style==='reference'?224:258,bounds.w);
 if(bounds.x>32||innerWidth<300){clock.style.left=left+'px';system.style.left=left+'px';clock.style.width=width+'px';system.style.width=width+'px';}
 else if(!customApplied){clock.style.removeProperty('left');clock.style.removeProperty('width');system.style.removeProperty('left');system.style.removeProperty('width');}
}
function applyLayout(){
 updateBounds();const boxes=layoutRects();
 if(boxes&&!validPair(boxes)){layoutFallback=true;draft=null;resetInline();status('この画面では保存配置が重なるため初期配置を使用します');}
 const current=layoutRects();
 if(current){for(const [id,r] of Object.entries(current))applyRect(selectedPanels[id],constrain(r,bounds));customApplied=true;return true;}
 if(customApplied)resetInline();autoInset();return false;
}
function syncPanel(){
 const boxes=layoutRects(),compact=bounds.h<620;root.classList.toggle('desk-focus',open&&compact);if(!boxes?.desk){const r=rect(compact?clock:system);applyRect(panel,{...r,x:Math.max(bounds.x,r.x),w:Math.min(r.w,bounds.w),h:Math.max(120,Math.min(compact?600:(r.h||420),bounds.y+bounds.h-r.y))});}
 if(folded)panel.style.height='54px';
 const scroll=panel.querySelector('.desk-scroll');
 const available=Math.max(20,panel.clientHeight-scroll.offsetTop-$('desk-status').offsetHeight-30);scroll.style.maxHeight=available+'px';
 if(editing)populateFields(false);
}
function populateFields(force=true){const target=$('layout-target').value,e=selectedPanels[target],r=(draft||{})[target]||rect(e);for(const k of ['x','y','w','h'])if(force||document.activeElement!==$('layout-'+k))$('layout-'+k).value=Math.round(r[k]);Object.entries(selectedPanels).forEach(([id,node])=>node.classList.toggle('is-selected',editing&&id===target));}
function startEditing(){if(!ready){status('データ取得待ちです');return;}if(editing)return;draft=Object.fromEntries(Object.entries(selectedPanels).map(([id,e])=>[id,constrain(rect(e),bounds)]));editing=true;root.classList.add('layout-editing');post('layout-editing',{active:true});populateFields();status('配置編集中。保存または取消で終了します');}
function endEditing(saved){editing=false;draft=null;root.classList.remove('layout-editing');Object.values(selectedPanels).forEach(e=>e.classList.remove('is-selected'));post('layout-editing',{active:false});if(!saved)resetInline();window.dispatchEvent(new Event('cyberdeck-layout'));}
$('layout-start').onclick=startEditing;$('layout-cancel').onclick=()=>{endEditing(false);status('配置変更を取り消しました');};$('layout-target').onchange=()=>populateFields();
function tryRect(id,r){const candidate={...draft,[id]:constrain(r,bounds)};if(!validPair(candidate)){status('パネル同士が重なります。位置かサイズを調整してください');return false;}draft=candidate;window.dispatchEvent(new Event('cyberdeck-layout'));populateFields();return true;}
$('layout-apply').onclick=()=>{startEditing();if(!editing)return;const r=Object.fromEntries(['x','y','w','h'].map(k=>[k,Number($('layout-'+k).value)]));if(Object.values(r).some(n=>!Number.isFinite(n))){status('数値を入力してください');return;}tryRect($('layout-target').value,r);};
$('layout-save').onclick=async()=>{if(!editing){status('先に編集を開始してください');return;}if(!validPair(draft)){status('重なりを解消してください');return;}const next=clone(state);next.layout[screenKey]=Object.fromEntries(Object.entries(draft).map(([k,r])=>[k,normalize(constrain(r,bounds),bounds)]));while(Object.keys(next.layout).length>20)delete next.layout[Object.keys(next.layout)[0]];if(await save(next,'配置を保存しました'))endEditing(true);};
$('layout-reset').onclick=async()=>{const next=clone(state);delete next.layout[screenKey];if(await save(next,'この画面の初期配置へ戻しました')){layoutFallback=false;endEditing(false);}};
for(const [id,node] of Object.entries(selectedPanels)){
 const grip=element('span',undefined,'layout-grip');grip.setAttribute('aria-hidden','true');node.append(grip);
 for(const [handle,resize] of [[node.querySelector('.panel-top'),false],[grip,true]]){
  let drag=null;
  handle.addEventListener('pointerdown',e=>{if(!editing||e.button!==0||e.target.closest('button'))return;e.preventDefault();$('layout-target').value=id;drag={x:e.clientX,y:e.clientY,rect:{...draft[id]}};handle.setPointerCapture(e.pointerId);post('layout-drag',{active:true,x:e.clientX,y:e.clientY});});
  handle.addEventListener('pointermove',e=>{if(!drag)return;const dx=Math.round((e.clientX-drag.x)/10)*10,dy=Math.round((e.clientY-drag.y)/10)*10;const r=resize?{...drag.rect,w:drag.rect.w+dx,h:drag.rect.h+dy}:{...drag.rect,x:drag.rect.x+dx,y:drag.rect.y+dy};tryRect(id,r);});
  const stopDrag=()=>{if(!drag)return;drag=null;post('layout-drag',{active:false});};
  handle.addEventListener('pointerup',stopDrag);handle.addEventListener('pointercancel',stopDrag);handle.addEventListener('lostpointercapture',stopDrag);
 }
}
window.CyberdeckLayout={apply:applyLayout,sync:syncPanel,bottom:()=>bounds.y+bounds.h};
window.addEventListener('resize',()=>{updateBounds();window.dispatchEvent(new Event('cyberdeck-layout'));});
new MutationObserver(()=>{updateBounds();window.dispatchEvent(new Event('cyberdeck-layout'));}).observe(root,{attributes:true,attributeFilter:['data-style']});
window.addEventListener('message',event=>{
 if(event.source!==parent||event.origin!==location.origin||event.data?.channel!=='cyberdeck')return;
 const message=event.data;
 if(message.type==='desk-result'){const p=pending.get(message.requestId);if(p){clearTimeout(p.timeout);pending.delete(message.requestId);p.resolve(message.result);}return;}
 if(message.type==='metrics'&&native){
  if(message.data?.desktop)renderDesktop(message.data.desktop);
  if(message.data?.deskError){ready=false;status(message.data.deskError);}
  else if(message.data?.desk&&!busy&&(!ready||message.data.desk.revision>state.revision)){state=message.data.desk;ready=true;renderLists();if(document.activeElement?.closest('#effects-form')===null)effectForm();}
  resources(message.data?.error?null:message.data);
 }
});
function demo(){if(native)return;resources({disk:{total:512*2**30,free:180*2**30},battery:{percent:Number($('demo-battery').value),charging:$('demo-charging').checked,external:$('demo-charging').checked},dock:{edge:'bottom',reserve:72}});}
$('demo-power-note').hidden=native;$('demo-battery').oninput=demo;$('demo-charging').onchange=demo;
setInterval(()=>{if(native&&lastData&&Date.now()-lastData>20000){resources(null);lastData=0;status('実測値の更新が止まっています');}},5000);
window.addEventListener('pagehide',()=>{clearTimeout(pulseTimer);pending.forEach(p=>clearTimeout(p.timeout));post('layout-editing',{active:false});});
renderLists();effectForm();applySettings();demo();$('desk-open').disabled=false;

// Module initialization can finish after the surface/onLoad handshake.


let desktopState=null;
function renderDesktop(data){desktopState=data;const valid=data?.available===true;i18n.text($('desktop-visibility'),!native?'実機でのみ切り替えできます':!valid?'アイコン表示を確認できません':data.hidden?(data.owned?'鑑賞モード：アイコン非表示':'元の設定でアイコン非表示'):'通常表示：アイコン表示');$('view-hide').disabled=!native||!valid||busy||data.hidden;$('view-restore').disabled=!native||!valid||busy||!data.owned;}
async function changeDesktop(operation){if(busy)return;busy=true;renderDesktop(desktopState);status('アイコン表示を切り替えています…');const result=await request({action:'desktop-mode',operation});busy=false;if(result.ok){renderDesktop(result.desktop);status(operation==='hide'?'鑑賞モードにしました':'元のアイコン表示へ戻しました');}else{renderDesktop(desktopState);status(result.error||'切り替えできませんでした');}}
$('view-hide').onclick=()=>changeDesktop('hide');$('view-restore').onclick=()=>changeDesktop('restore');renderDesktop(null);

if(native)post('desk-ready',{});
