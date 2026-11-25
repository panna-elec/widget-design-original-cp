import preferences from './lib/preferences.json';
import { regionKey, energyKey } from './lib/region-key.js';

// Übersicht stores layer placement per widget. Only this light widget is moved.
const widgetId = 'cyberdeck-widget-background-jsx';
export const refreshFrequency = false;
export const className = 'top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none;';
export const init = () => {
  fetch('/state/').then(response => response.json()).then(state => {
    if (state.settings && state.settings[widgetId] && state.settings[widgetId].inBackground) return;
    const socket = new WebSocket('ws://' + window.location.host);
    const timeout = setTimeout(() => socket.close(), 3000);
    socket.onopen = () => socket.send(JSON.stringify({type:'WIDGET_SET_TO_BACKGROUND',payload:widgetId}));
    socket.onmessage = event => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'WIDGET_SET_TO_BACKGROUND' && message.payload === widgetId) socket.close();
      } catch (_) {}
    };
    socket.onclose = () => clearTimeout(timeout);
    socket.onerror = () => {clearTimeout(timeout);socket.close();};
  }).catch(() => {});
};
function send(frame) {
  if (!frame || !frame.contentWindow) return;
  function regions() {
    try {
      const packet=JSON.parse(localStorage.getItem(energyKey()));
      if(packet)frame.contentWindow.postMessage({channel:'cyberdeck',type:'native-power',packet},window.location.origin);
      const saved = JSON.parse(localStorage.getItem(regionKey()));
      if (Array.isArray(saved)) frame.contentWindow.postMessage({channel:'cyberdeck',type:'hit-regions',regions:saved},window.location.origin);
    } catch (_) {}
  }
  if (!frame.cyberdeckRegionListener) {
    const listener = event => {
      if (!frame.isConnected) {window.removeEventListener('storage',listener);return;}
      if (event.key === regionKey() || event.key === energyKey()) regions();
    };
    frame.cyberdeckRegionListener = listener;
    window.addEventListener('storage',listener);
  }
  frame.contentWindow.postMessage({channel:'cyberdeck',type:'settings',settings:preferences},window.location.origin);
  regions();
}
// No flash over file names while the engine moves this widget to its background.
export const render = () => /\/foreground\/?$/.test(window.location.pathname) ? null :
  <iframe title="Cyberdeck background lights" aria-hidden="true" tabIndex={-1}
    ref={frame => send(frame)} onLoad={event => send(event.target)}
    src="/cyberdeck.widget/lib/ambient.html?v=koi-size-1"
    style={{width:'100%',height:'100%',border:0,background:'transparent',pointerEvents:'none'}} />;
