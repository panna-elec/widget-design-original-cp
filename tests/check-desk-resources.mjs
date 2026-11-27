import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../cyberdeck.widget/lib/desk.js',import.meta.url),'utf8');
const functionSource=source.slice(source.indexOf('function resources(data){'),source.indexOf('\nfunction applySettings(){'));
const nodes=new Map();function node(id){if(!nodes.has(id))nodes.set(id,{textContent:'',style:{},classList:{add(){},remove(){}}});return nodes.get(id);}
const ctx={i18n:{text:(node,text)=>node.textContent=text},statusSource:'',latest:null,lastData:0,lastBattery:'',lastDisk:'',pulseTimer:0,native:true,automaticDock:{},$:node,status:text=>{ctx.statusSource=text;node('desk-status').textContent=text;},applySettings(){},motionOK:()=>false,clearTimeout,setTimeout,Date};vm.createContext(ctx);vm.runInContext(functionSource,ctx);
vm.runInContext('resources(null)',ctx);assert.equal(node('battery-percent').textContent,'—');assert.equal(node('resource-source').textContent,'STALE / データ待ち');
ctx.status('実測値の更新が止まっています');ctx.data={battery:{percent:37,charging:false,external:false},disk:{free:25,total:100}};vm.runInContext('resources(data)',ctx);assert.equal(node('desk-status').textContent,'');assert.equal(node('resource-source').textContent,'LIVE / SSD・電源は5秒更新');assert.equal(node('battery-percent').textContent,'37%');
ctx.status('保存できませんでした');vm.runInContext('resources(data)',ctx);assert.equal(node('desk-status').textContent,'保存できませんでした');
console.log('Stale -> live recovery, missing readings and unrelated errors retained: PASS');
