// Celebration bursts: petals or sparks thrown from a point, then drifting down.
// Used for perfect forms, the CKA stamp, captures and other small wins. No-op under reduced motion.
import { gsap } from 'gsap';
import { reduced } from './smooth.js';

const PALETTES = {
  petals: ['#ffb7c9', '#ff8fb1', '#ffd6e0', '#fff0f4'],
  sparks: ['#ffd23f', '#fff3b0', '#ff9f43', '#ffffff'],
};
let layer;

export function burst(x, y, { kind = 'petals', count = 26, spread = 1, colors } = {}) {
  if (reduced) return;
  if (!layer) {
    layer = document.createElement('div');
    layer.className = 'burst';
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);
  }
  const pal = colors || PALETTES[kind] || PALETTES.petals;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('i');
    el.className = 'burst__' + kind;
    el.style.background = pal[i % pal.length];
    layer.appendChild(el);
    const a = Math.random() * Math.PI * 2;
    const d = (70 + Math.random() * 230) * spread;
    gsap.set(el, { x, y, rotation: Math.random() * 360, scale: 0.6 + Math.random() * 0.9 });
    gsap.to(el, { x: x + Math.cos(a) * d, y: y + Math.sin(a) * d * 0.75 - 50, rotation: `+=${Math.random() * 360 - 180}`, duration: 0.6 + Math.random() * 0.4, ease: 'power3.out' });
    gsap.to(el, { y: `+=${120 + Math.random() * 180}`, x: `+=${Math.random() * 60 - 30}`, opacity: 0, duration: 1.1 + Math.random() * 0.7, delay: 0.5, ease: 'power1.in', onComplete: () => el.remove() });
  }
}

export function burstAt(el, opts) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, opts);
}
