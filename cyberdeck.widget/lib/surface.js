(() => {
  'use strict';
  const root = document.querySelector('#surface');
  const params = new URLSearchParams(location.search);
  const native = params.get('mode') === 'native' || root.dataset.host === 'native';
  if (native) root.classList.add('native');
  const $ = id => document.getElementById(id);
  let settings = {style:native?'clean':'reference',palette:'cyan',layout:'split',motion:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'off':'normal',finder:false};
  let calendarKey = "", nativeConfigured = false;
  const boot = window.CyberdeckBoot;
  let networkHistory = [], history = [], sequence = 0, running = [], demoStep = 0, lastTimestamp = 0;
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const text = (id,value) => {const element=$(id), next=String(value), old=element.textContent;element.textContent=next;if((id==='cpu'||id==='memory')&&old!==next&&old!=='—'&&next!=='—'&&window.CyberdeckInteract)window.CyberdeckInteract.highlight(element);};
  const timeout = (fn, ms) => { const id = setTimeout(fn, ms); running.push(id); };
  function clearEffects() { window.CyberdeckSignal?.stop(); boot.finish(); ++sequence; running.forEach(clearTimeout);running=[];document.querySelectorAll('.decode').forEach(e=>{e.textContent=e.dataset.title;e.classList.remove('glitch')}); }
  function replay() {
    if(settings.motion==='paused')return;
    clearEffects();
    if(settings.style==='reference'){boot.start(settings.motion);return;}
    document.querySelectorAll('.hud, .boot-sweep').forEach(el => {el.style.animation='none';void el.offsetWidth;el.style.animation='';});
    if(settings.motion==='off'||settings.motion==='paused'||reduced())return;
    const token=sequence;
    document.querySelectorAll('.decode').forEach((el,index)=>{
      const title=el.dataset.title;
      if(settings.motion==='gentle') return;
      for(let frame=0;frame<12;frame++)timeout(()=>{
        if(token!==sequence)return;
        const count=Math.floor(frame/11*title.length);
        el.textContent=title.slice(0,count)+Array.from({length:title.length-count},(_,i)=>'01/<>_X'[(frame+i*3)%7]).join('');
        if(frame===11){el.textContent=title;el.classList.add('glitch');timeout(()=>el.classList.remove('glitch'),350);}
      },160+index*130+frame*45);
    });
  }
  function configure(next) {
    const previous = {...settings};
    const palettes=['cyan','coral','quiet'], layouts=['split','left'], motions=['normal','gentle','off','paused'];
    if(['reference','cyber','clean'].includes(next.style))settings.style=next.style;
    root.dataset.style=settings.style;
    if(palettes.includes(next.palette))settings.palette=next.palette;
    if(layouts.includes(next.layout))settings.layout=next.layout;
    if(motions.includes(next.motion))settings.motion=next.motion;
    if(typeof next.finder==='boolean')settings.finder=next.finder;
    root.dataset.palette=settings.palette;root.dataset.layout=settings.layout;root.dataset.motion=settings.motion;
    document.querySelector('.finder').hidden=!settings.finder;
    if(settings.motion==='off'||reduced()||previous.style!==settings.style||previous.layout!==settings.layout)clearEffects();
    else if(settings.motion==='paused'){if(settings.style==='reference')boot.pause();else clearEffects();}
    else if(previous.motion==='paused')boot.resume();
  }
  function clock(){
    const d=new Date();
    const key=d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate();
    if(key!==calendarKey){
      calendarKey=key;
      text('calendar-month',new Intl.DateTimeFormat('en-US',{month:'long',year:'numeric'}).format(d).toUpperCase());
      const first=(new Date(d.getFullYear(),d.getMonth(),1).getDay()+6)%7;
      const count=new Date(d.getFullYear(),d.getMonth()+1,0).getDate();
      const cal=$('calendar');cal.replaceChildren();
      ['M','T','W','T','F','S','S'].forEach(label=>{const e=document.createElement('span');e.className='calendar-week';e.textContent=label;cal.appendChild(e)});
      for(let i=0;i<first+count;i++){const e=document.createElement('span');const n=i-first+1;e.textContent=n>0?n:'';if(n===d.getDate())e.className='today';cal.appendChild(e)}
    }
    text('hours' ,String(d.getHours()).padStart(2,'0'));text('minutes',String(d.getMinutes()).padStart(2,'0'));text('seconds',String(d.getSeconds()).padStart(2,'0'));
    text('date',new Intl.DateTimeFormat('en-CA',{year:'numeric',month:'2-digit',day:'2-digit'}).format(d));text('weekday',new Intl.DateTimeFormat('en-US',{weekday:'short'}).format(d).toUpperCase());
    text('timezone',Intl.DateTimeFormat().resolvedOptions().timeZone);text('menu-time',d.toLocaleTimeString('ja-JP',{hour:'2-digit',minute:'2-digit'}));
  }
  function speed(value) {
    if(value>=2**20)return (value/2**20).toFixed(2)+' MiB/s';
    if(value>=1024)return (value/1024).toFixed(1)+' KiB/s';
    return Math.round(value)+' B/s';
  }
  function network(rate, failure) {
    const valid=!failure && rate && rate.status==='ok' && Number.isFinite(rate.rx) && rate.rx>=0 && Number.isFinite(rate.tx) && rate.tx>=0;
    if(!valid)networkHistory=[];
    else {networkHistory.push([rate.rx,rate.tx]);networkHistory=networkHistory.slice(-36);}
    const peak=Math.max(1024,...networkHistory.flat());
    const scale=2**Math.ceil(Math.log2(peak));
    for(const [field,index] of [['rx',0],['tx',1]]) {
      text('network-'+field,valid?speed(rate[field]):'—');
      $('network-'+field+'-meter').style.width=(valid?100*rate[field]/scale:0)+'%';
      $('network-'+field+'-graph').setAttribute('points',networkHistory.map((v,i)=>(i*240/35).toFixed(1)+','+(52-48*v[index]/scale).toFixed(1)).join(' '));
    }
    const status=failure || (!rate?'waiting':rate.status);
    text('network-state',valid?(native?'実測概算 / Wi-Fi・Ethernet 合計':'DEMO / 仮の通信量'):({error:'取得失敗・次回再試行',stale:'更新停止 / データ待ち',unavailable:'通信量を取得できません','no-interface':'対象の通信インターフェースなし',waiting:'計測中 / 次のサンプル待ち'}[status]||'計測待ち'));
    text('network-scale',valid?'目盛り上限 '+speed(scale)+' / 自動':'目盛りは通信量に合わせて自動調整');
  }
  function metrics(data){
    if(!data||typeof data!=='object')return;
    if(data.error){network(null,'error');text('overview-cpu','—');text('overview-mem','—');text('overview-source','ERROR');text('source','ERROR');text('status','取得失敗・次回再試行');text('cpu','—');text('memory','—');return;}
    network(data.networkRate);
    const validCpu=Number.isFinite(data.cpu)&&data.cpu>=0&&data.cpu<=100;
    const validMem=Number.isFinite(data.memoryBytes)&&data.memoryBytes>=0&&Number.isFinite(data.totalBytes)&&data.totalBytes>0&&data.memoryBytes<=data.totalBytes;
    text('cpu',validCpu?Math.round(data.cpu):'—');$('cpu-meter').style.width=(validCpu?data.cpu:0)+'%';
    const percent=validMem?100*data.memoryBytes/data.totalBytes:null;
    text('overview-cpu',validCpu?Math.round(data.cpu):'—');
    text('overview-mem',validMem?Math.round(percent):'—');
    $('cpu-ring').style.setProperty('--arc-length',String((validCpu?data.cpu:0)*2.3));
    $('mem-ring').style.setProperty('--arc-length',String((percent||0)*2.3));
    text('overview-total',validMem?(data.totalBytes/2**30).toFixed(0)+' GiB':'—');
    text('overview-source',native?'LIVE':'DEMO');
    text('overview-mode',native?'LOCAL DATA':'SAMPLE DATA');
    text('memory',validMem?Math.round(percent):'—');$('memory-meter').style.width=(percent||0)+'%';
    text('memory-detail',validMem?(data.memoryBytes/2**30).toFixed(1)+' / '+(data.totalBytes/2**30).toFixed(1):'測定待ち');
    if(validCpu){history.push(data.cpu);history=history.slice(-36);$('cpu-graph').setAttribute('points',history.map((v,i)=>(i*240/35).toFixed(1)+','+(52-v*.48).toFixed(1)).join(' '));}
    lastTimestamp=Date.now();text('source',native?'LIVE':'DEMO');text('status',data.error?'取得失敗・次回再試行':native?(validCpu?'実測 / 5秒更新':'CPUの初回サンプル待ち'):'仮データ / 配置・演出の確認用');
  }
  function demo(){
    if(native||document.hidden||settings.motion==='paused')return;
    const cpu=Math.round(22+12*Math.sin(demoStep*.6)+5*Math.cos(demoStep*1.3));demoStep++;
    metrics({cpu,memoryBytes:(8.2+.3*Math.sin(demoStep*.15))*2**30,totalBytes:16*2**30,networkRate:{rx:(.4+.35*Math.sin(demoStep*.6))*2**20,tx:(30+25*Math.sin(demoStep*.4))*1024,status:'ok'}});
  }
  window.addEventListener('message',event=>{
    if(event.source!==window.parent)return;
    if(event.origin!==location.origin&&event.origin!=='null')return;
    const d=event.data;if(!d||d.channel!=='cyberdeck')return;
    if(d.type==='settings'){configure(d.settings||{});const firstNative=native&&!nativeConfigured;nativeConfigured=true;if(d.replay||firstNative)replay();}
    if(d.type==='replay')replay();
    if(d.type==='signal-preview'&&!native){boot.finish();window.CyberdeckSignal?.play();}
    if(d.type==='metrics'&&native)metrics(d.data);
  });
  configure(settings);clock();demo();if(!native)replay();
  setInterval(()=>{if(!document.hidden)clock();if(native&&lastTimestamp&&Date.now()-lastTimestamp>20000){network(null,'stale');text('status','更新が止まっています');text('source','STALE');}},1000);
  setInterval(demo,5000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){clock();demo();}});
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{if(e.matches){configure({motion:'off'});}});
  parent.postMessage({channel:'cyberdeck',type:'ready'},location.origin==='null'?'*':location.origin);
})();
