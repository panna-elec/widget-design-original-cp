import { run } from 'uebersicht';
import { reduceSample } from './lib/metrics.js';
import preferences from './lib/preferences.json';
import { regionKey, energyKey } from './lib/region-key.js';
import { createPointerRouter } from './lib/native-pointer.js';
import { mountNativeSurface } from './lib/native-surface.js';

// Commands run from Übersicht's configured widgets directory.
export const command = '/opt/homebrew/bin/python3 "./cyberdeck.widget/bin/collect.py"';
export const refreshFrequency = 5000;
export const className = 'top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none;';
export const initialState = { sample: null, data: null, error: false };
export const updateState = (event, previous) => {
  if (event.error) return { ...previous, error: true };
  try {
    const sample = JSON.parse(event.output);
    const data = sample.metricsError ? {...sample,error:true} : reduceSample(previous.sample, sample);
    return { sample, data, error: false };
  } catch (_) { return { ...previous, error: true }; }
};
function send(frame, state) {
  if (!frame || !frame.contentWindow) return;
  const target = frame.contentWindow;
  frame.cyberdeckState = state;
  const packet = {battery:state.data?.battery||null,dock:state.data?.dock||null,settings:state.data?.desk?.settings||{},timestamp:Date.now()};
  frame.cyberdeckPacket=packet;
  if(state.data)try{localStorage.setItem(energyKey(),JSON.stringify(packet));}catch(_){}

  if (!frame.cyberdeckHitListener) {
    frame.cyberdeckPointer=createPointerRouter(frame);
    const listener = event => {
      if (!frame.isConnected) {window.removeEventListener('message',listener);return;}
      if (event.source !== frame.contentWindow || event.origin !== window.location.origin) return;
      const message = event.data;
      if (!message || message.channel !== 'cyberdeck') return;
      // Mouse events inside an iframe do not bubble to Übersicht's hover listener.
      if(message.type==='widget-hover' && typeof message.inside==='boolean') {
        frame.cyberdeckPointer.hover(message);
        return;
      }
      if(message.type==='ready' || message.type==='desk-ready') {
        send(frame,frame.cyberdeckState || state);return;
      }
      if(message.type==='desk-action') {
        const request=message.request;
        if(!request || !['save','launch','desktop-mode'].includes(request.action) || typeof message.requestId!=='string')return;
        const json=JSON.stringify(request);if(json.length>500000)return;
        const encoded=btoa(unescape(encodeURIComponent(json)));
        run('/opt/homebrew/bin/python3 "./cyberdeck.widget/bin/desk_store.py" "'+encoded+'"').then(output=>{
          let result;try{result=JSON.parse(output);}catch(_){result={ok:false,error:'処理結果を読めませんでした'};}
          if(frame.isConnected)frame.contentWindow.postMessage({channel:'cyberdeck',type:'desk-result',requestId:message.requestId,result},window.location.origin);
        }).catch(()=>{if(frame.isConnected)frame.contentWindow.postMessage({channel:'cyberdeck',type:'desk-result',requestId:message.requestId,result:{ok:false,error:'操作できませんでした'}},window.location.origin);});
        return;
      }
      if(message.type==='layout-editing') {
        frame.cyberdeckPointer.editing(message.active===true);return;
      }
      if(message.type==='layout-drag') {
        if(message.active===true)frame.cyberdeckPointer.hover({inside:true,x:message.x,y:message.y});
        frame.cyberdeckPointer.drag(message.active===true);return;
      }
      if(message.type==='desk-appearance'&&message.settings&&frame.cyberdeckPacket) {
        const packet={...frame.cyberdeckPacket,settings:message.settings};
        try{localStorage.setItem(energyKey(),JSON.stringify(packet));}catch(_){};return;
      }
      if(message.type !== 'hit-regions' || !Array.isArray(message.regions)) return;
      const regions = message.regions.slice(0,3).filter(r => r && [r.x,r.y,r.width,r.height].every(n => typeof n === 'number' && isFinite(n) && Math.abs(n) < 20000) && r.width > 0 && r.height > 0);
      try {localStorage.setItem(regionKey(),JSON.stringify(regions));} catch (_) {}
      const path = regions.map(r => {
        const x=r.x,y=r.y,w=r.width,h=r.height,c=Math.min(12,w/2,h/2);
        return 'M '+x+' '+(y+c)+' L '+(x+c)+' '+y+' H '+(x+w)+' V '+(y+h-c)+' L '+(x+w-c)+' '+(y+h)+' H '+x+' Z';
      }).join(' ');
      frame.cyberdeckClip = path ? 'path("'+path+'")' : 'inset(0 100% 100% 0)';
      frame.cyberdeckPointer.regions(regions);
    };
    frame.cyberdeckHitListener=listener;
    window.addEventListener('message',listener);
  }
  target.postMessage({channel:'cyberdeck',type:'settings',settings:preferences},window.location.origin);
  if (state.data || state.error) target.postMessage({channel:'cyberdeck',type:'metrics',data:{...state.data,error:state.error || state.data?.error === true}},window.location.origin);
}
function connectSurface(host,state) {
  if(!host)return;
  host.contentWindow=window;
  host.cyberdeckState=state;
  send(host,state);
  mountNativeSurface(host).then(()=>send(host,host.cyberdeckState)).catch(error=>{
    console.error('Cyberdeck surface could not load',error);
    host.cyberdeckPointer?.dispose();
    window.webkit?.messageHandlers?.uebersicht?.postMessage('widgetLeave');
  });
}
export const render = state => <div key="native-direct-koi-size-v1" className="cyberdeck-inline"
  ref={host=>connectSurface(host,state)}
  style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',clipPath:'inset(0 100% 100% 0)'}} />;
