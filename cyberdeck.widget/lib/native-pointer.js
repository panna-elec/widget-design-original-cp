// Native window click-through must follow the clipped panels, not the full iframe.
export function inPanel(point, r) {
  const x=point.x-r.x,y=point.y-r.y,c=Math.min(12,r.width/2,r.height/2);
  return x>=0&&y>=0&&x<=r.width&&y<=r.height&&x+y>=c&&
    (r.width-x)+(r.height-y)>=c;
}
export function createPointerRouter(frame, host=window) {
  let regions=[],point=null,editing=false,dragging=false,queued=false,disposed=false,timer=null;
  const send=inside=>host.webkit?.messageHandlers?.uebersicht?.postMessage(inside?'widgetEnter':'widgetLeave');
  function sync() {
    // A task runs after ALL DOM listeners. Microtasks can run between listeners
    // and let Übersicht's later listener undo click-through restoration.
    if(queued||disposed)return;
    queued=true;
    timer=host.setTimeout(()=>{
      queued=false;timer=null;
      if(!frame.isConnected){dispose();return;}
      send(dragging||!!(point&&regions.some(r=>inPanel(point,r))));
    },0);
  }
  function clip(){frame.style.clipPath=dragging?'none':(frame.cyberdeckClip||'inset(0 100% 100% 0)');}
  function move(e){
    if(!frame.isConnected){dispose();return;}
    const r=frame.getBoundingClientRect();
    point={x:e.clientX-r.left,y:e.clientY-r.top};sync();
  }
  function leave(){point=null;if(!dragging)sync();}
  function release(){dragging=false;point=null;clip();sync();}
  function dispose(){
    disposed=true;
    if(timer!==null)host.clearTimeout(timer);
    host.removeEventListener('mousemove',move,true);
    host.removeEventListener('blur',release);
    host.removeEventListener('pagehide',release);
    host.document.documentElement.removeEventListener('mouseleave',leave);
  }
  host.addEventListener('mousemove',move,true);
  host.addEventListener('blur',release);
  host.addEventListener('pagehide',release);
  host.document.documentElement.addEventListener('mouseleave',leave);
  sync();
  return {
    hover(message){
      // Coordinates, rather than a child-supplied boolean, decide native capture.
      point=message.inside&&Number.isFinite(message.x)&&Number.isFinite(message.y)?{x:message.x,y:message.y}:null;
      sync();
    },
    regions(next){regions=next;clip();sync();},
    editing(active){editing=active;if(!active)dragging=false;clip();sync();},
    drag(active){
      if(active){if(!editing||!point||!regions.some(r=>inPanel(point,r)))return;dragging=true;}
      else dragging=false;
      clip();sync();
    },
    dispose
  };
}
