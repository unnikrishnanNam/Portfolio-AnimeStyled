// Cold open (preloader) and the OP title drop.
import { gsap } from 'gsap';
import * as fx from './fx.js';
import { reduced, lock, unlock, jump } from './smooth.js';
import { say } from './nav.js';
import { play as sfx } from './sfx.js';

const html = document.documentElement;
const cold = document.getElementById('cold');
const pctEl = document.getElementById('cold-pct');

function waitForAssets(timeout = 6000) {
  const imgs = [...document.querySelectorAll('#cold img, #ep00 img')];
  const loads = imgs.map((img) => (img.complete ? Promise.resolve() : new Promise((r) => { img.addEventListener('load', r, { once: true }); img.addEventListener('error', r, { once: true }); })));
  const total = loads.length + 1;
  let done = 0;
  const bump = () => { done++; };
  loads.forEach((p) => p.then(bump));
  const fonts = (document.fonts ? document.fonts.ready : Promise.resolve()).then(bump);
  const all = Promise.all([...loads, fonts]);
  return { ratio: () => done / total, ready: Promise.race([all, new Promise((r) => setTimeout(r, timeout))]) };
}

export function opIntro() {
  html.classList.add('notch-ready');
  say('Debug. Deploy. Adventure. Repeat.');
  if (reduced) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.op__hero .art', { xPercent: 18, scale: 0.92, opacity: 0, duration: 0.7 })
    .from('.op__lines', { opacity: 0, duration: 0.6 }, 0)
    .from('.op__tag', { y: -20, opacity: 0, duration: 0.4 }, 0.1);
  document.querySelectorAll('.op__syl').forEach((s, i) => {
    tl.from(s, { yPercent: -80, scale: 1.8, opacity: 0, duration: 0.26, ease: 'power4.in' }, 0.25 + i * 0.16)
      .add(() => { fx.jolt(s, 6); sfx('stamp'); }, '>');
  });
  tl.from('.op__last', { xPercent: 12, opacity: 0, duration: 0.5 }, '>-0.05')
    .from('.op__role > *', { y: 24, opacity: 0, stagger: 0.08, duration: 0.45 }, '-=0.2')
    .from('.op__series span', { y: 16, opacity: 0, stagger: 0.07, duration: 0.35 }, '-=0.25')
    .from('.op__cue', { opacity: 0, duration: 0.4 }, '-=0.1');
}

function finish(onRevealed) {
  try { localStorage.setItem('ddar-seen', '1'); } catch (e) { /* ignore */ }
  return fx.run('impact', {
    onCover: () => { html.classList.remove('is-cold'); jump(0); },
  }).then(() => { unlock(); onRevealed && onRevealed(); });
}

export function playCold({ rerun = false } = {}) {
  html.classList.add('is-cold');
  html.classList.remove('notch-ready');
  lock();
  jump(0);
  const who = cold.querySelector('[data-cold-who]');
  const dog = cold.querySelector('.cold__dog');
  const sleep = cold.querySelector('.cold__sleep');
  const wake = cold.querySelector('.cold__wake');
  const skip = document.getElementById('cold-skip');
  who.textContent = rerun ? 'EP.00 · RERUN' : 'EP.00 · COLD OPEN';
  sleep.hidden = false; wake.hidden = true;
  gsap.set(dog, { clearProps: 'all' });
  say(rerun ? 'Episode 0, again. This time Muffins has the standup at 9 a.m.' : 'Episode 0. Our hero has a standup at 9 a.m.', { hold: 8000, force: true });

  const progress = rerun ? { ratio: () => 1, ready: Promise.resolve() } : waitForAssets();
  const minTime = rerun ? 1.4 : reduced ? 0.6 : 2.6;
  const counter = { v: 0 };
  let ended = false;

  return new Promise((resolve) => {
    const end = (skipped) => {
      if (ended) return;
      ended = true;
      ticker.kill();
      skip.removeEventListener('click', onSkip);
      const go = () => finish(() => { opIntro(); resolve(); });
      if (skipped || reduced) { go(); return; }
      // Muffins leaps up and licks our hero awake.
      const hasWake = wake.querySelector('img');
      const tl = gsap.timeline({ onComplete: go });
      tl.to(dog, { y: '-46vh', x: '-20vw', rotation: -18, scale: 1.25, duration: 0.5, ease: 'power2.out' })
        .add(() => sfx('bark'))
        .add(() => { if (hasWake) { sleep.hidden = true; wake.hidden = false; } })
        .to(dog, { rotation: 8, duration: 0.12, yoyo: true, repeat: 3, ease: 'sine.inOut' })
        .to({}, { duration: hasWake ? 1.3 : 0.25 });
    };
    const onSkip = () => end(true);
    skip.addEventListener('click', onSkip);
    const t0 = performance.now();
    const tick = () => {
      const elapsed = (performance.now() - t0) / 1000;
      const target = Math.min(100, progress.ratio() * 100, (elapsed / minTime) * 100);
      counter.v += (target - counter.v) * 0.15;
      if (target >= 100 && counter.v > 99.4) counter.v = 100;
      pctEl.textContent = Math.round(counter.v) + '%';
      if (counter.v >= 100) end(false);
    };
    const ticker = { kill: () => gsap.ticker.remove(tick) };
    gsap.ticker.add(tick);
    progress.ready.then(() => { progress.ratio = () => 1; });
  });
}

export function initColdOpen() {
  if (!html.classList.contains('is-cold')) { opIntro(); return; }
  playCold();
}
