/* Independently implemented desktop accents inspired by the local MyPage ver2.
 * Stable accessible labels and readings; short bursts, one idle timer, no idle RAF. */
(() => {
  'use strict';
  const root = document.getElementById('surface');
  if (!root) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const hover = matchMedia('(hover: hover)');
  const panels = [...root.querySelectorAll('.hud')];
  const visible = new Set();
  const active = new Map();
  const cleanups = new Map();
  let timer = 0, away = false, nextPanel = 0, autoCycles = 0;
  const allowed = () => root.dataset.motion === 'normal' && !reduced.matches && !document.hidden && !away && !root.classList.contains('assembling');
  const usable = panel => visible.has(panel) && !panel.classList.contains('is-collapsed') && getComputedStyle(panel).visibility !== 'hidden';

  function cancel(target) {
    const job = active.get(target);
    if (!job) return;
    cancelAnimationFrame(job.frame);
    active.delete(target);
    cleanups.get(target)?.();
    cleanups.delete(target);
  }
  function burst(target, duration, paint, restore) {
    cancel(target);
    if (!allowed()) return;
    const job = {frame: 0, start: null};
    active.set(target, job); cleanups.set(target, restore);
    const tick = now => {
      if (!allowed()) {cancel(target);return;}
      if (job.start === null) job.start = now;
      const elapsed = now - job.start;
      if (elapsed >= duration) {cancel(target);return;}
      paint(elapsed / duration);
      job.frame = requestAnimationFrame(tick);
    };
    paint(0);
    job.frame = requestAnimationFrame(tick);
  }
  function heading(panel) {
    if (!allowed() || !usable(panel)) return;
    const title = panel.querySelector('.decode');
    if (!title) return;
    const original = title.dataset.title;
    let lastStep = -1;
    burst(title, 440, progress => {
      const step = Math.min(3, Math.floor(progress * 4));
      if (step === lastStep) return;
      lastStep = step;
      const chars = [...original];
      for (let n = 0; n < 2; n++) {
        const index = (step * 2 + n) % chars.length;
        chars[index] = ['_', '/', '0', 'X'][(step + n) % 4];
      }
      title.dataset.signalText = chars.join('');
      title.classList.add('signal-heading-active');
    }, () => {title.classList.remove('signal-heading-active');delete title.dataset.signalText;});
  }
  function buttonSignal(button) {
    burst(button, 360, progress => {
      button.classList.add('signal-button-active');
      button.style.setProperty('--signal-shift', (progress < .3 ? -3 : progress < .6 ? 2 : 0) + 'px');
      button.style.setProperty('--signal-opacity', String(progress < .75 ? .7 : .25));
    }, () => {button.classList.remove('signal-button-active');button.style.removeProperty('--signal-shift');button.style.removeProperty('--signal-opacity');});
  }
  function panelSignal(panel) {
    if (!usable(panel)) return;
    const strip = panel.querySelector('.signal-strip');
    burst(strip, 420, progress => {
      strip.style.opacity = String(Math.sin(progress * Math.PI) * .55);
      strip.style.transform = 'translateX(' + (-100 + progress * 320) + '%)';
    }, () => {strip.style.removeProperty('opacity');strip.style.removeProperty('transform');});
    heading(panel);
  }
  function automaticSignal(panel) {
    panelSignal(panel);
    const lamp = panel.querySelector('.signal-lamp');
    burst(lamp, 800, progress => {
      lamp.style.opacity = String(.12 + .78 * Math.pow(Math.sin(progress * Math.PI * 2), 2));
    }, () => lamp.style.removeProperty('opacity'));
    // DOM diagnostic lets us verify autonomous playback without pointer input.
    root.dataset.signalCycles = String(++autoCycles);
  }
  function stopAll() {
    clearTimeout(timer);timer = 0;
    [...active.keys()].forEach(cancel);
    root.dataset.signal = 'quiet';
  }
  function schedule(delay = autoCycles ? 4000 + Math.random() * 4000 : 2000) {
    if (timer || !allowed() || !panels.some(p=>usable(p)&&p.querySelector('.decode'))) return;
    timer = setTimeout(() => {
      timer = 0;
      const choices = panels.filter(p => usable(p) && p.querySelector('.decode'));
      if (allowed() && choices.length) automaticSignal(choices[nextPanel++ % choices.length]);
      schedule();
    }, delay);
  }
  function sync() {
    if (!allowed()) {stopAll();return;}
    for (const target of [...active.keys()]) {
      const panel = target.closest('.hud');
      if (!panel || !usable(panel)) cancel(target);
    }
    root.dataset.signal = 'ready';
    if (!panels.some(usable)) {clearTimeout(timer);timer = 0;return;}
    schedule();
  }
  for (const panel of panels) {
    const strip = document.createElement('i');
    strip.className = 'signal-strip';strip.setAttribute('aria-hidden','true');panel.append(strip);
    const lamp = document.createElement('i');
    lamp.className = 'signal-lamp';lamp.setAttribute('aria-hidden','true');panel.append(lamp);
    const title = panel.querySelector('.decode');
    title?.addEventListener('pointerenter', event => {if (hover.matches && event.pointerType !== 'touch') heading(panel);});
    for (const button of panel.querySelectorAll('button')) {
      button.classList.add('signal-button');
      button.addEventListener('pointerenter', event => {if (hover.matches && event.pointerType !== 'touch') buttonSignal(button);});
      button.addEventListener('focus', () => {if (button.matches(':focus-visible')) buttonSignal(button);});
      button.addEventListener('pointerleave', () => cancel(button));
      button.addEventListener('blur', () => cancel(button));
      button.addEventListener('click', () => {buttonSignal(button);panelSignal(panel);});
    }
    new MutationObserver(sync).observe(panel, {attributes:true,attributeFilter:['class']});
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target));sync();
  });
  panels.forEach(panel => observer.observe(panel));
  new MutationObserver(sync).observe(root,{attributes:true,attributeFilter:['data-motion','data-boot','data-layout','data-style','class']});
  document.addEventListener('visibilitychange',sync);
  reduced.addEventListener('change',sync);
  window.addEventListener('pagehide',() => {away=true;stopAll();});
  window.addEventListener('pageshow',() => {away=false;sync();});
  // Deliberate preview replay uses the same path as the desktop controls.
  window.CyberdeckSignal = {play: () => {panels.filter(usable).forEach(panelSignal);}, stop:stopAll};
  sync();
})();
