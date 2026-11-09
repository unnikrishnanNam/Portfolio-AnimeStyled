// Site-wide motion: anime speed lines that fade in when you scroll fast.
import { gsap } from 'gsap';
import { reduced, velocity } from './smooth.js';

export function initSpeedLines() {
  if (reduced) return;
  const html = document.documentElement;
  const el = document.createElement('div');
  el.className = 'velo speedlines';
  el.setAttribute('aria-hidden', 'true');
  document.body.appendChild(el);
  let o = 0, spin = 0;
  gsap.ticker.add(() => {
    const quiet = html.classList.contains('is-cold') || html.classList.contains('is-locked');
    const v = quiet ? 0 : Math.abs(velocity());
    const target = Math.min(0.5, Math.max(0, (v - 22) / 110));
    o += (target - o) * (target > o ? 0.25 : 0.08);
    spin = (spin + 0.4 + v * 0.02) % 360;
    if (o < 0.005) { if (el.style.opacity !== '0') el.style.opacity = '0'; return; }
    el.style.opacity = o.toFixed(3);
    el.style.transform = `rotate(${spin}deg) scale(${1 + o * 0.3})`;
  });
}
