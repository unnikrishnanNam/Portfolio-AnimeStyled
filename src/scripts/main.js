import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initSmooth, lenis } from './smooth.js';
import { initUI } from './ui.js';
import { initSections } from './sections.js';
import { initReplays } from './replays.js';
import { initColdOpen } from './coldopen.js';
import { goTo } from './nav.js';

gsap.registerPlugin(ScrollTrigger);

initSmooth();
// The story always starts at the top (pinned sections misbehave when restored mid-way).
if (!location.hash) window.scrollTo(0, 0);
const ui = initUI();
initReplays();
initSections(ui);
initColdOpen();

// Layout settles once fonts and lazy images arrive.
const refresh = () => ScrollTrigger.refresh();
if (document.fonts) document.fonts.ready.then(refresh);
window.addEventListener('load', refresh);
let refreshT;
document.querySelectorAll('main img[loading="lazy"]').forEach((img) => {
  if (!img.complete) img.addEventListener('load', () => { clearTimeout(refreshT); refreshT = setTimeout(() => ScrollTrigger.refresh(true), 400); }, { once: true });
});

// Deep links (#ep03) skip straight to an episode.
if (location.hash && document.getElementById(location.hash.slice(1)) && !document.documentElement.classList.contains('is-cold')) {
  window.addEventListener('load', () => goTo(location.hash.slice(1), { type: 'fade' }), { once: true });
}

// The skip link should also work with smooth scroll.
document.querySelector('.skip')?.addEventListener('click', (e) => { e.preventDefault(); goTo('ep01', { type: 'fade' }); });

if (import.meta.env.DEV) Object.assign(window, { gsap, ScrollTrigger, lenis });
if (import.meta.env.DEV) {
  window.go = (y) => { if (lenis) lenis.scrollTo(y, { immediate: true, force: true }); else window.scrollTo(0, y); ScrollTrigger.update(); };
  window.secY = (id) => ScrollTrigger.getById('sec-' + id).start;
  window.pinOf = (sel) => ScrollTrigger.getAll().find((s) => s.pin && s.trigger && s.trigger.matches(sel));
  window.at = (sel, p) => { const s = window.pinOf(sel); window.go(s.start + (s.end - s.start) * p); };
}
