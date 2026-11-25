(() => {
  const iframe=document.querySelector('#desktop');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  let settings={style:'reference',palette:'cyan',layout:'split',motion:reduce.matches?'off':'normal',finder:false}, paused=false;
  try{const saved=JSON.parse(localStorage.getItem('cyberdeck-settings'));if(saved?.designRevision===3&&['reference','cyber','clean'].includes(saved.style))settings.style=saved.style;if(saved&&['cyan','coral','quiet'].includes(saved.palette))settings.palette=saved.palette;if(saved&&['split','left'].includes(saved.layout))settings.layout=saved.layout;if(saved&&['normal','gentle','off'].includes(saved.motion))settings.motion=saved.motion;}catch{}
  if(reduce.matches)settings.motion='off';
  const send=(type,extra={})=>iframe.contentWindow.postMessage({channel:'cyberdeck',type,...extra},location.origin==='null'?'*':location.origin);
  function update(replay=false){
    document.body.dataset.layout=settings.layout;
    document.body.dataset.style=settings.style;
    document.querySelector('#palette-primary-name').textContent=settings.style==='reference'?'CLASSIC':'CYAN';
    document.querySelector('#palette-primary-note').textContent=settings.style==='reference'?'赤 × 白':'シアン × 赤';
    document.querySelectorAll("[data-style]").forEach(b=>{if(b.tagName==="BUTTON")b.setAttribute("aria-pressed",String(b.dataset.style===settings.style));});
    document.querySelectorAll('[data-palette]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.palette===settings.palette)));
    document.querySelectorAll('[data-layout]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.layout===settings.layout)));
    document.querySelector('#motion').value=settings.motion;
    document.querySelector('#signal-preview').disabled=paused||settings.motion!=='normal'||reduce.matches;
    send('settings',{settings:{...settings,motion:paused?'paused':settings.motion},replay});
    try{localStorage.setItem('cyberdeck-settings',JSON.stringify({...settings,designRevision:3}));}catch{}
    document.querySelector('#pause').setAttribute('aria-pressed',String(paused));document.querySelector('#pause').textContent=paused?'再開':'一時停止';
    document.querySelector('#effect-status').textContent=paused?'演出と仮データの更新を一時停止中（時計は更新）':settings.motion==='off'?'アニメーションはオフです（時計・数値は更新）':settings.motion==='gentle'?'控えめ：背景の光・見出し点滅は停止（時計・数値は更新）':'背景の窓と光のラインが自動で動きます。一時停止・オフで止められます';
  }
  document.querySelectorAll('button[data-style]').forEach(b=>b.onclick=()=>{settings.style=b.dataset.style;update(true)});
  document.querySelectorAll('[data-palette]').forEach(b=>b.onclick=()=>{settings.palette=b.dataset.palette;update(true)});
  document.querySelectorAll('[data-layout]').forEach(b=>b.onclick=()=>{settings.layout=b.dataset.layout;update()});
  document.querySelector('#motion').onchange=e=>{settings.motion=e.target.value;paused=false;update(true)};
  document.querySelector('#signal-preview').onclick=()=>{if(!paused&&settings.motion==='normal'){iframe.scrollIntoView({behavior:'instant',block:'start'});requestAnimationFrame(()=>send('signal-preview'));}};
  document.querySelector('#replay').onclick=()=>{if(!paused)send('replay')};
  document.querySelector('#pause').onclick=()=>{paused=!paused;update()};
  document.querySelector('#finder').onchange=e=>{settings.finder=e.target.checked;update()};
  document.querySelector('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.querySelector('.screen-wrap').requestFullscreen();}catch{window.open(iframe.src,'_blank','noopener')} };
  document.querySelector('#save').onclick=()=>{const {style,palette,layout,motion}=settings;const data=JSON.stringify({version:1,style,palette,layout,motion},null,2)+'\n';const url=URL.createObjectURL(new Blob([data],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='cyberdeck-preferences.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  window.addEventListener('message',e=>{if(e.source===iframe.contentWindow&&e.data?.channel==='cyberdeck'&&e.data.type==='ready')update(true);});
  reduce.addEventListener('change',e=>{if(e.matches){settings.motion='off';paused=false;update()}});
  iframe.addEventListener('load',()=>update());update();
})();
