(() => {
  'use strict';
  const root = document.getElementById('surface');
  const clock = document.querySelector('.clock-panel');
  const system = document.querySelector('.system-panel');
  const native = root.classList.contains('native');
  if(native) {
    const hover=(inside,e)=>parent.postMessage({channel:'cyberdeck',type:'widget-hover',inside,x:e?.clientX,y:e?.clientY},location.origin);
    // Parent validates these coordinates against visible panel polygons.
    window.addEventListener('mousemove',e=>hover(true,e),{passive:true});
    window.addEventListener('pointerdown',e=>hover(true,e),{passive:true});
    document.documentElement.addEventListener('mouseleave',()=>hover(false));
    window.addEventListener('pagehide',()=>hover(false));
  }
  const key = 'cyberdeck-controls-v1-' + (native ? 'desktop' : 'preview');
  const state = {clockCollapsed:false,systemCollapsed:false,calendarOpen:false,detailsOpen:false};
  try {const saved=JSON.parse(localStorage.getItem(key));for(const k of Object.keys(state))if(typeof saved?.[k]==='boolean')state[k]=saved[k];} catch (_) {}
  const save = () => {try{localStorage.setItem(key,JSON.stringify(state));}catch(_) {}};
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let geometryFrame = 0, lastPath = '', lastSource = '';

  function bottomLimit(panel) {
    // Native Dock size is controlled by macOS; reserve a modest bottom band.
    let limit = native && window.CyberdeckLayout ? window.CyberdeckLayout.bottom() : root.clientHeight - (native ? 72 : 24);
    const dock = root.querySelector('.dock');
    if (!native && dock && getComputedStyle(dock).display !== 'none') {
      const left = panel.offsetLeft, right = left + panel.offsetWidth;
      const dockLeft = dock.offsetLeft - dock.offsetWidth / 2;
      if (left < dockLeft + dock.offsetWidth + 16 && right > dockLeft - 16) limit = Math.min(limit, dock.offsetTop - 20);
    }
    return limit;
  }
  function bodyLimit(body, limit) {
    const value = Math.max(0, Math.floor(limit)) + 'px';
    if (body.style.maxHeight !== value) body.style.maxHeight = value;
  }

  function geometry() {
    geometryFrame = 0;
    const custom=window.CyberdeckLayout?.apply();
    const clockBody=document.getElementById('clock-body'), systemBody=document.getElementById('system-body');
    system.classList.remove('is-compact','is-dense');
    // Padding, header and border heights vary between CYBER, CLEAN and REFERENCE.
    const clockChrome = clock.offsetHeight - clockBody.offsetHeight;
    const systemChrome = system.offsetHeight - systemBody.offsetHeight;
    if(custom){
      bodyLimit(clockBody,Math.max(0,clock.clientHeight-clockBody.offsetTop-parseFloat(getComputedStyle(clock).paddingBottom)));
      bodyLimit(systemBody,Math.max(0,system.clientHeight-systemBody.offsetTop-parseFloat(getComputedStyle(system).paddingBottom)));
    } else if (root.dataset.layout === 'left') {
      const reserve = state.systemCollapsed ? systemChrome : Math.max(systemChrome + 110, Math.min(240, root.clientHeight * .35));
      const clockMax=Math.min(bottomLimit(clock)-clock.offsetTop-clockChrome,
        bottomLimit(system)-clock.offsetTop-clockChrome-20-reserve);
      bodyLimit(clockBody, clockMax);
      const top = clock.offsetTop + clock.offsetHeight + 20;
      if (system.style.top !== top+'px') system.style.top = top+'px';
      bodyLimit(systemBody, bottomLimit(system)-top-systemChrome);
    } else {
      system.style.removeProperty('top');
      bodyLimit(clockBody, bottomLimit(clock)-clock.offsetTop-clockChrome);
      bodyLimit(systemBody, bottomLimit(system)-system.offsetTop-systemChrome);
    }
    // Keep the complete network note visible before optional history content.
    const content=systemBody.querySelector('.body-content');
    const extra=document.getElementById('system-extra');
    const budget=parseFloat(systemBody.style.maxHeight);
    const baseHeight=()=>content.scrollHeight-extra.offsetHeight;
    if (!state.systemCollapsed && baseHeight()>budget) {
      system.classList.add('is-compact');
      if(baseHeight()>budget)system.classList.add('is-dense');
    }
    window.CyberdeckLayout?.sync();
    root.dataset.geometryWidth=String(root.clientWidth);root.dataset.geometryHeight=String(root.clientHeight);root.dataset.geometryStyle=root.dataset.style;
    if (!native) return;
    const regions = [...document.querySelectorAll('.hud')].filter(p=>getComputedStyle(p).display!=='none'&&getComputedStyle(p).visibility!=='hidden').map(p=>{
      const r=p.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};
    });
    const serialized=JSON.stringify(regions);
    if(serialized!==lastPath){lastPath=serialized;parent.postMessage({channel:'cyberdeck',type:'hit-regions',regions},location.origin);}
  }
  const scheduleGeometry = () => {if(!geometryFrame)geometryFrame=requestAnimationFrame(geometry);};

  function render() {
    for(const [panel,field,id] of [[clock,'clockCollapsed','clock-body'],[system,'systemCollapsed','system-body']]) {
      panel.classList.toggle('is-collapsed',state[field]);
      const button=panel.querySelector('.collapse-control');
      button.setAttribute('aria-expanded',String(!state[field]));
      button.textContent=state[field]?'+':'−';
      window.CyberdeckI18n.attr(button,'aria-label',(panel===clock?'時計':'システム')+(state[field]?'を展開':'を折りたたむ'));
      document.getElementById(id).inert=state[field];
    }
    for(const [field,id,buttonId] of [['calendarOpen','clock-extra','calendar-toggle'],['detailsOpen','system-extra','details-toggle']]) {
      const content=document.getElementById(id);
      content.classList.toggle('is-open',state[field]);content.inert=!state[field];
      document.getElementById(buttonId).setAttribute('aria-expanded',String(state[field]));
    }
    scheduleGeometry();
  }
  for(const [id,field] of [['clock-collapse','clockCollapsed'],['system-collapse','systemCollapsed'],['calendar-toggle','calendarOpen'],['details-toggle','detailsOpen']]) {
    document.getElementById(id).addEventListener('click',()=>{window.CyberdeckBoot.finish();state[field]=!state[field];save();render();});
  }
  const resize = new ResizeObserver(scheduleGeometry);
  document.querySelectorAll('.hud').forEach(p=>resize.observe(p));
  window.addEventListener('resize',scheduleGeometry);
  window.addEventListener('cyberdeck-layout',scheduleGeometry);
  new MutationObserver(()=>{scheduleGeometry();}).observe(root,{attributes:true,attributeFilter:['data-layout','data-style','data-motion']});

  function highlight(element) {
    if(root.dataset.motion!=='normal'||reduced.matches||document.hidden||root.classList.contains('assembling'))return;
    element.classList.remove('value-updated');void element.offsetWidth;element.classList.add('value-updated');
  }
  document.addEventListener('animationend',e=>{if(e.animationName==='value-update')e.target.classList.remove('value-updated');if(e.animationName==='status-update')e.target.classList.remove('status-pulse');});
  const source=document.getElementById('source');
  new MutationObserver(()=>{
    const next=source.textContent;
    if(lastSource&&lastSource!==next&&root.dataset.motion==='normal'&&!reduced.matches) {
      const status=document.getElementById('status');status.classList.remove('status-pulse');void status.offsetWidth;status.classList.add('status-pulse');
    }
    lastSource=next;
  }).observe(source,{childList:true});
  window.CyberdeckInteract={highlight};
  render();
})();
