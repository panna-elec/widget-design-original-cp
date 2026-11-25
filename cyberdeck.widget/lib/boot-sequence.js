/* Original Cyberdeck animation. One finite timeline; no background animation loop. */
(() => {
  'use strict';
  const root = document.getElementById('surface');
  let panels = [], frame = 0, elapsed = 0, last = null, active = false, paused = false, gentle = false;
  const clamp = n => Math.max(0, Math.min(1, n));
  const ease = n => 1 - Math.pow(1 - clamp(n), 3);
  const properties = ['--boot-frame','--boot-face','--boot-title','--boot-content','--boot-meter','--boot-scan-y','--boot-scan-opacity','--boot-jitter'];

  function finish() {
    cancelAnimationFrame(frame);
    frame = 0; last = null; active = false; paused = false;
    root.classList.remove('assembling');
    root.dataset.boot = 'settled';
    panels.forEach(panel => {
      properties.forEach(p => panel.style.removeProperty(p));
      const title = panel.querySelector('.decode');
      if (title) title.textContent = title.dataset.title;
    });
  }

  function paint() {
    panels.forEach((panel, index) => {
      const t = elapsed - index * (gentle ? 35 : 90);
      const style = panel.style;
      const reveal = clamp(t / 330);
      // Top edge first, then the right/bottom edges of the chamfered frame.
      style.setProperty('--boot-frame', gentle ? 'inset(0)' :
        `inset(0 ${100 * (1 - clamp(reveal * 2))}% ${100 * (1 - clamp(reveal * 2 - 1))}% 0)`);
      style.setProperty('--boot-face', String(gentle ? ease(t / 260) : .12 + .88 * ease((t - 90) / 260)));
      style.setProperty('--boot-title', String(ease((t - (gentle ? 0 : 240)) / 120)));
      style.setProperty('--boot-content', String(ease((t - (gentle ? 40 : 560)) / 150)));
      style.setProperty('--boot-meter', String(ease((t - (gentle ? 60 : 610)) / (gentle ? 220 : 400))));
      const sweep = clamp((t - 380) / 430);
      style.setProperty('--boot-scan-y', `${-30 + sweep * (panel.clientHeight + 30)}px`);
      style.setProperty('--boot-scan-opacity', gentle || sweep === 0 || sweep === 1 ? '0' : String(.65 * Math.sin(sweep * Math.PI)));
      const title = panel.querySelector('.decode');
      if (title) {
        const target = title.dataset.title;
        const progress = gentle ? 1 : clamp((t - 250) / 300);
        const count = Math.floor(progress * target.length);
        const tick = Math.floor(Math.max(0, t) / 42);
        title.textContent = target.slice(0, count) + Array.from({length:target.length-count}, (_, i) => '01/<>_X'[(tick+i*3)%7]).join('');
      }
      const jitter = !gentle && t >= 550 && t < 640 ? (Math.floor(t / 30) % 2 ? 1 : -1) : 0;
      style.setProperty('--boot-jitter', `${jitter}px`);
    });
  }

  function tick(now) {
    frame = 0;
    if (!active || paused || document.hidden) { last = null; return; }
    if (last !== null) elapsed += Math.max(0, now - last);
    last = now;
    if (elapsed >= (gentle ? 320 : 1060) + Math.max(0, panels.length-1) * (gentle ? 35 : 90)) {
      finish(); return;
    }
    paint();
    frame = requestAnimationFrame(tick);
  }

  function resume() {
    paused = false; last = null;
    if (active && !document.hidden && !frame) {
      root.dataset.boot = 'running';
      frame = requestAnimationFrame(tick);
    }
  }
  function pause() {
    paused = true; last = null; cancelAnimationFrame(frame); frame = 0;
    if (active) root.dataset.boot = 'paused';
  }
  function start(mode) {
    finish();
    if (mode === 'off' || mode === 'paused' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    panels = [...root.querySelectorAll('.hud')].filter(p => getComputedStyle(p).display !== 'none');
    gentle = mode === 'gentle'; elapsed = 0; active = true;
    root.dataset.bootKind = gentle ? 'gentle' : 'normal';
    root.classList.add('assembling');
    paint(); resume();
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; last = null; }
    else if (!paused) resume();
  });
  window.CyberdeckBoot = {start, pause, resume, finish};
})();
