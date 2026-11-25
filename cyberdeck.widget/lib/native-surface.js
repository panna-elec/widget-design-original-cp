// Render interactive panels in Übersicht's main document so native hover and
// first-mouse delivery do not have to cross a WKWebView iframe boundary.
export function mountNativeSurface(host) {
  if(host.cyberdeckMount)return host.cyberdeckMount;
  // Hot replacement needs a fresh document: module scripts and timers otherwise
  // retain the old panel nodes. Normal metric renders reuse the same host.
  if(window.cyberdeckNativeOwner&&window.cyberdeckNativeOwner!==host){
    location.reload();return new Promise(()=>{});
  }
  window.cyberdeckNativeOwner=host;
  host.cyberdeckMount=(async()=>{
    const base=new URL('/cyberdeck.widget/lib/',location.origin);
    const response=await fetch(new URL('surface.html?v=koi-size-1',base));
    if(!response.ok)throw new Error('Surface HTTP '+response.status);
    const doc=new DOMParser().parseFromString(await response.text(),'text/html');
    const main=doc.querySelector('#surface');
    if(!main)throw new Error('Missing surface');
    if(!host.isConnected)return;
    const styles=[...doc.querySelectorAll('link[rel=stylesheet]')].map(link=>{
      const el=document.createElement('link');el.rel='stylesheet';el.href=new URL(link.getAttribute('href'),base).href;
      const loaded=new Promise((resolve,reject)=>{el.onload=resolve;el.onerror=()=>reject(new Error('Stylesheet failed: '+el.href));});
      host.append(el);return loaded;
    });
    const hitStyle=document.createElement('style');
    hitStyle.textContent='.cyberdeck-inline #surface{pointer-events:none}.cyberdeck-inline #surface .hud{pointer-events:auto}';
    host.append(hitStyle);
    main.classList.add('native');main.dataset.host='native';
    host.append(document.importNode(main,true));
    await Promise.all(styles);
    for(const original of doc.querySelectorAll('script[src]')){
      if(!host.isConnected)return;
      const src=new URL(original.getAttribute('src'),base);src.searchParams.set('nativeHost','koi-size-1');
      const script=document.createElement('script');script.src=src.href;
      if(original.type)script.type=original.type;
      script.async=false;
      await new Promise((resolve,reject)=>{script.onload=resolve;script.onerror=()=>reject(new Error('Script failed: '+src.pathname));host.append(script);});
    }
  })();
  return host.cyberdeckMount;
}
