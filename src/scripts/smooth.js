// Lenis smooth scroll wired into GSAP's ticker and ScrollTrigger.
// With reduced motion we keep native scrolling.
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export let lenis = null;
const html = document.documentElement;

export function initSmooth() {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (reduced) return null;
  lenis = new Lenis({ lerp: 0.12, smoothWheel: true, syncTouch: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function lock() {
  if (lenis) lenis.stop();
  html.classList.add('is-locked');
}
export function unlock() {
  html.classList.remove('is-locked');
  if (lenis) lenis.start();
}
export function jump(y) {
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo(0, y);
  ScrollTrigger.update();
}
export function glide(y) {
  if (lenis) lenis.scrollTo(y, { duration: 1.1, force: true });
  else window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
}
export const scrollY = () => (lenis ? lenis.scroll : window.scrollY);
export const velocity = () => (lenis ? lenis.velocity : 0);
