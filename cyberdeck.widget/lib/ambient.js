import {energy} from './desk-model.mjs';
import {createKoi,koiScale} from './koi.js?v=koi-size-1';
(() => {
  'use strict';
  const root = document.querySelector('#ambient-surface, #surface');
  if (!root || root.classList.contains('native')) return; // Native uses its own noninteractive iframe.
  const standalone = root.id === 'ambient-surface';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const ns = 'http://www.w3.org/2000/svg';
  const make = (name, attrs = {}) => {
    const el = document.createElementNS(ns, name);
    Object.entries(attrs).forEach(([k,v]) => el.setAttribute(k, String(v)));
    return el;
  };
  const layer = document.createElement('div');
  layer.className = 'ambient-layer';
  layer.setAttribute('aria-hidden', 'true');
  layer.dataset.ready = standalone ? 'false' : 'true';
  const svg = make('svg', {viewBox:'0 0 2560 1600', preserveAspectRatio:'xMidYMid slice'});
  const defs = make('defs');
  const mask = make('mask', {id:'ambient-clearance', maskUnits:'userSpaceOnUse', x:0, y:0, width:2560, height:1600, 'mask-type':'luminance'});
  mask.append(make('rect', {x:0,y:0,width:2560,height:1600,fill:'white'}));
  const exclusions = make('g', {fill:'black'});
  mask.append(exclusions);defs.append(mask);
  const artwork = make('g', {mask:'url(#ambient-clearance)'});
  let batteryPacket=null;
  svg.append(defs,artwork);layer.append(svg);
  const wallpaper = root.querySelector('.wallpaper');
  if (wallpaper) wallpaper.after(layer); else root.append(layer);
  const cyberWindows = [[169,815,7,12],[191,911,7,12],[213,1007,7,12],[235,1135,7,12],[279,975,7,12],[328,1172,7,12],[372,884,7,12],[394,1108,7,12],[438,884,7,12],[460,948,7,12],[536,1093,7,12],[602,1061,7,12],[680,1037,7,12],[724,1005,7,12],[820,1131,7,12],[999,1181,7,12],[1281,971,7,12],[1325,971,7,12],[1347,1131,7,12],[1519,1083,7,12],[1563,1211,7,12],[1658,1198,7,12],[1813,935,7,12],[1857,935,7,12],[1892,1245,7,12],[2067,1196,7,12],[2111,1036,7,12],[2176,866,7,12],[2198,1026,7,12],[2220,1186,7,12],[2264,866,7,12],[2286,1058,7,12],[2353,1006,7,12],[2375,1230,7,12],[2397,1102,7,12],[2441,782,7,12]];
  // Coordinates follow the existing CLEAN wallpaper's 34 x 44 window pattern.
  const cleanWindows = [[4,17],[5,20],[6,23],[7,18],[8,25],[12,21],[13,24],[14,26],[60,19],[61,22],[62,25],[63,20],[64,27],[67,15],[68,18],[69,21],[70,24],[71,16],[72,20],[68,26],[70,27],[72,25]].map(([x,y]) => [x*34+10,y*44+8,5,14]);
  const traces = {
    cyber:['M0 1430h420l130-85h380','M2560 1430h-420l-130-85h-380','M2560 40h-240l-90 90v430'],
    clean:['M0 1300h340l90 90h350','M2560 1270h-300l-90 90h-380','M2294 630v500'],
    reference:['M36 156V68l32-32h570l28 16h1225','M1919 36h561l44 44v1100','M2524 1220v310l-46 46h-410l-26 12H72l-36-36']
  };
  let style = '', frame = 0, regions = [], settleTimer = 0, koi = null;
  function build(next) {
    style = next; artwork.replaceChildren();
    koi=createKoi(make);artwork.append(koi);
    const windows = next === 'cyber' ? cyberWindows : next === 'clean' ? cleanWindows : [];
    windows.forEach(([x,y,width,height],i) => {
      const el = make('rect',{x,y,width,height,class:'ambient-window ambient-'+(x < 1400 ? 'left':'right')});
      el.style.setProperty('--duration', (9+(i*7)%11)+'s');
      el.style.setProperty('--delay', (-((i*3.7)%19))+'s');
      artwork.append(el);
    });
    // Few transform-only particles, deterministic positions; no per-frame JS loop.
    for(let i=0;i<12;i++) {
      const dot=make('circle',{cx:180+(i*197)%2220,cy:220+(i*113)%1180,r:i%3===0?2:1.2,class:'ambient-particle ambient-'+(i%2?'right':'left')});
      dot.style.setProperty('--particle-duration',(18+i%5*4)+'s');dot.style.setProperty('--particle-delay',(-i*3)+'s');artwork.append(dot);
    }
    traces[next].forEach((d,i) => {
      const el = make('path',{d,pathLength:1000,class:'ambient-trace ambient-'+(i === 0 ? 'left':'right')});
      el.style.setProperty('--duration',(14+i*5)+'s');
      el.style.setProperty('--travel-steps',String((14+i*5)*30));
      el.style.setProperty('--delay',(-i*4)+'s');
      artwork.append(el);
    });
  }
  function maskPanels() {
    frame = 0;
    const bounds = root.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const scale = Math.max(bounds.width/2560,bounds.height/1600);
    const dx = (bounds.width-2560*scale)/2, dy = (bounds.height-1600*scale)/2;
    if(koi)koi.setAttribute('transform',`translate(1280 800) scale(${koiScale(bounds.width,bounds.height,scale,root.dataset.koiSize)}) translate(-627 -627)`);
    const rects = standalone ? regions : [...root.querySelectorAll('.hud,.dock,.desktop-menu,.finder')].filter(el=>el.getClientRects().length && !el.hidden).map(el=>{
      const r=el.getBoundingClientRect();return {x:r.x-bounds.x,y:r.y-bounds.y,width:r.width,height:r.height};
    });
    exclusions.replaceChildren(...rects.map(r=>make('rect',{
      x:(r.x-12-dx)/scale,y:(r.y-12-dy)/scale,width:(r.width+24)/scale,height:(r.height+24)/scale
    })));
  }
  function scheduleMask() {if (!frame) frame=requestAnimationFrame(maskPanels);}
  function sync() {
    const next = ['reference','cyber','clean'].includes(root.dataset.style) ? root.dataset.style : 'reference';
    if (style !== next) {
      build(next);
      clearTimeout(settleTimer);settleTimer=setTimeout(scheduleMask,1800);
    }
    layer.dataset.style=next;layer.dataset.palette=root.dataset.palette||'cyan';
    layer.dataset.energy=root.dataset.energy||'normal';layer.dataset.particles=root.dataset.particles||'true';layer.dataset.koi=root.dataset.koi||'true';layer.dataset.koiPalette=root.dataset.koiPalette||'rose';layer.dataset.koiPower=root.dataset.koiPower||'false';layer.dataset.koiWeight=root.dataset.koiWeight||'100';
    const motion=root.dataset.motion;
    layer.dataset.state=reduced.matches || !['normal','paused'].includes(motion) ? 'off' : document.hidden || motion==='paused' ? 'paused' : 'running';
    scheduleMask();
  }
  new MutationObserver(sync).observe(root,{attributes:true,attributeFilter:['data-style','data-palette','data-motion','data-energy','data-particles','data-koi','data-koi-palette','data-koi-power','data-koi-size','data-koi-weight']});
  const observer=new ResizeObserver(scheduleMask);observer.observe(root);
  if (!standalone) root.querySelectorAll('.hud,.dock,.desktop-menu,.finder').forEach(el=>observer.observe(el));
  root.addEventListener('animationend',scheduleMask);
  window.addEventListener('resize',scheduleMask);
  document.addEventListener('visibilitychange',sync);
  reduced.addEventListener('change',sync);
  window.addEventListener('pagehide',()=>{clearTimeout(settleTimer);cancelAnimationFrame(frame);layer.dataset.state='paused';});
  window.addEventListener('pageshow',sync);
  if (standalone) window.addEventListener('message',event=>{
    if (event.source!==parent || event.origin!==location.origin || event.data?.channel!=='cyberdeck') return;
    const message=event.data;
    if(message.type==='native-power' && message.packet) {
      batteryPacket=message.packet;
      const fresh=Date.now()-Number(batteryPacket.timestamp)<20000;
      root.dataset.energy=energy(fresh?batteryPacket.battery:null,batteryPacket.settings||{});
      root.dataset.particles=String(batteryPacket.settings?.particles!==false);
      root.dataset.koi=String(batteryPacket.settings?.koi!==false);
      root.dataset.koiPalette=batteryPacket.settings?.koiPalette||'rose';root.dataset.koiPower=String(batteryPacket.settings?.koiPower===true);root.dataset.koiSize=String(batteryPacket.settings?.koiSize||100);root.dataset.koiWeight=String(batteryPacket.settings?.koiWeight||100);
    }
    if (message.type==='settings' && message.settings) {
      const s=message.settings;
      if (['reference','cyber','clean'].includes(s.style)) root.dataset.style=s.style;
      if (['cyan','coral','quiet'].includes(s.palette)) root.dataset.palette=s.palette;
      if (['normal','gentle','off','paused'].includes(s.motion)) root.dataset.motion=s.motion;
    }
    if (message.type==='hit-regions' && Array.isArray(message.regions)) {
      regions=message.regions.slice(0,3).filter(r=>r&&[r.x,r.y,r.width,r.height].every(n=>Number.isFinite(n)&&Math.abs(n)<20000)&&r.width>0&&r.height>0);
      layer.dataset.ready='true';scheduleMask();
    }
  });
  if(standalone)setInterval(()=>{if(batteryPacket&&Date.now()-Number(batteryPacket.timestamp)>20000)root.dataset.energy='normal';},10000);
  sync();
})();
