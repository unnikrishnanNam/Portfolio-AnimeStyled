// Episode navigation, title-card entrances, and the subtitle (fansub) bar.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as fx from './fx.js';
import { reduced, jump, lock, unlock, scrollY } from './smooth.js';

let quietUntil = 0;
export const quiet = (ms) => { quietUntil = performance.now() + ms; };
export const isQuiet = () => performance.now() < quietUntil;

// Absolute scroll position of a section (works for pinned sections too).
export function topOf(el) {
  const st = ScrollTrigger.getById('sec-' + el.id);
  if (st) return st.start;
  return el.getBoundingClientRect().top + scrollY();
}

// ── Title cards ───────────────────────────────────────────
export function primeCard(sec) {
  const card = sec && sec.querySelector('[data-epcard]');
  if (!card || reduced) return;
  card.dataset.shown = '1';
  gsap.set(card.querySelectorAll('.epcard__no, .epcard__name, .epcard__ml'), { opacity: 0 });
}
export function cardIn(sec) {
  const card = sec && sec.querySelector('[data-epcard]');
  if (!card) return;
  card.dataset.shown = '1';
  const no = card.querySelector('.epcard__no'), name = card.querySelector('.epcard__name'), ml = card.querySelector('.epcard__ml');
  if (reduced) { gsap.fromTo([no, name, ml].filter(Boolean), { opacity: 0 }, { opacity: 1, duration: 0.3 }); return; }
  const tl = gsap.timeline();
  tl.fromTo(no, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.3, ease: 'power3.out' })
    .fromTo(name, { opacity: 0, scale: 1.6, skewX: -14, transformOrigin: '0% 60%' }, { opacity: 1, scale: 1, skewX: 0, duration: 0.32, ease: 'power4.in' }, '-=0.1')
    .add(() => fx.jolt(card, 9))
    .fromTo(ml, { opacity: 0, y: 14 }, { opacity: 0.85, y: 0, duration: 0.4, ease: 'power2.out' }, '+=0.05');
}

// ── Jumping between episodes ──────────────────────────────
export function goTo(target, { type, y } = {}) {
  const el = typeof target === 'string' ? document.getElementById(target.replace('#', '')) : target;
  if (!el || fx.isBusy()) return;
  const dest = typeof y === 'number' ? y : topOf(el);
  quiet(2600);
  lock();
  fx.run(type || el.dataset.fx || 'slash', {
    ec: el.dataset.ec,
    onCover: () => { jump(dest); primeCard(el); },
  }).then(() => { unlock(); cardIn(el); });
}

// ── Fansub bar ────────────────────────────────────────────
const line = document.getElementById('fansub');
let typing = null, clearTimer = null, last = '';
export function say(text, { hold = 5200, force = false } = {}) {
  if (!line || !text) return;
  if (!force && document.documentElement.classList.contains('is-cold')) return;
  if (text === last && line.textContent) return;
  last = text;
  if (typing) typing.kill();
  clearTimeout(clearTimer);
  line.innerHTML = '';
  line.setAttribute('aria-label', text);
  const frag = document.createDocumentFragment();
  const chars = [...text].map((ch) => { const s = document.createElement('span'); s.className = 'c'; s.textContent = ch; frag.appendChild(s); return s; });
  line.appendChild(frag);
  gsap.set(line, { opacity: 1 });
  if (reduced) chars.forEach((c) => c.classList.add('on'));
  else {
    const o = { i: 0 };
    typing = gsap.to(o, { i: chars.length, duration: Math.min(2.2, chars.length * 0.026), ease: 'none', onUpdate: () => { for (let k = 0; k < Math.floor(o.i); k++) chars[k].classList.add('on'); }, onComplete: () => chars.forEach((c) => c.classList.add('on')) });
  }
  clearTimer = setTimeout(() => { gsap.to(line, { opacity: 0, duration: 0.4, onComplete: () => { line.innerHTML = ''; last = ''; } }); }, hold + chars.length * 26);
}
