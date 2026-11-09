// Transition engine: screentone, impact, slash, eyecatch, powerup, ink, fade.
// run(type, { onCover }) plays the cover half, calls onCover while the screen
// is hidden (that is where callers jump the scroll), then plays the reveal.
import { gsap } from 'gsap';
import { reduced } from './smooth.js';
import { play as sfx } from './sfx.js';

const root = document.getElementById('fx');
const $ = (s) => root.querySelector(s);
let busy = false;
export const isBusy = () => busy;

export function run(type, { onCover, ec } = {}) {
  if (busy) { if (onCover) onCover(); return Promise.resolve(); }
  busy = true;
  root.classList.add('is-active');
  const cover = () => { try { if (onCover) onCover(); } catch (e) { console.error(e); } };
  const tl = gsap.timeline({
    onComplete: () => { busy = false; root.classList.remove('is-active'); },
  });
  const kind = reduced ? 'fade' : type;

  if (kind === 'screentone') {
    const el = $('.fx__tone');
    sfx('whoosh');
    tl.set(el, { visibility: 'visible', '--r': '0px' })
      .to(el, { '--r': '21px', duration: 0.42, ease: 'power2.in' })
      .add(cover)
      .to(el, { '--r': '0px', duration: 0.5, ease: 'power2.out', delay: 0.06 })
      .set(el, { visibility: 'hidden' });
  } else if (kind === 'ink') {
    const el = $('.fx__ink'), splat = $('.fx__ink svg');
    const drops = root.querySelectorAll('.ink__drops circle');
    sfx('whoosh');
    tl.set(el, { visibility: 'visible', '--hole': '0px' })
      .fromTo(splat, { scale: 0, rotation: -50 }, { scale: 6, rotation: 0, duration: 0.5, ease: 'power3.in' })
      .fromTo(drops, { scale: 0 }, { scale: 1, duration: 0.25, stagger: 0.03, ease: 'back.out(3)' }, 0.04)
      .add(cover)
      .to(el, { '--hole': '120vmax', duration: 0.65, ease: 'power3.in', delay: 0.1 })
      .set(el, { visibility: 'hidden' })
      .set(splat, { scale: 0 });
  } else if (kind === 'impact') {
    const lines = $('.fx__lines'), flash = $('.fx__flash');
    sfx('impact');
    tl.set(lines, { visibility: 'visible', opacity: 0, scale: 1.8 })
      .to(lines, { opacity: 1, scale: 1, duration: 0.18, ease: 'power3.in' })
      .set(flash, { visibility: 'visible' })
      .add(cover)
      .to(lines, { x: () => gsap.utils.random(-14, 14), y: () => gsap.utils.random(-10, 10), duration: 0.035, repeat: 5, yoyo: true, ease: 'none' })
      .set(flash, { visibility: 'hidden' }, '<0.07')
      .to(lines, { opacity: 0, scale: 1.25, duration: 0.4, ease: 'power2.out' })
      .set(lines, { visibility: 'hidden', x: 0, y: 0 });
  } else if (kind === 'slash') {
    const bars = root.querySelectorAll('.fx__slash i');
    sfx('whoosh');
    tl.set($('.fx__slash'), { visibility: 'visible' })
      .fromTo(bars, { xPercent: (i) => (i % 2 ? 110 : -110) }, { xPercent: 0, duration: 0.34, ease: 'power3.in', stagger: 0.07 })
      .add(cover)
      .to(bars, { xPercent: (i) => (i % 2 ? -110 : 110), duration: 0.42, ease: 'power3.out', stagger: 0.06, delay: 0.08 })
      .set($('.fx__slash'), { visibility: 'hidden' });
  } else if (kind === 'eyecatch') {
    const eye = $('.fx__eye'), card = $('.fx__eyecard');
    const n = String(ec || 1);
    root.querySelectorAll('[data-ec]').forEach((el) => (el.hidden = el.dataset.ec !== n));
    // Finished EC art is a full card with its own flat colour and a blank area for the logo.
    eye.dataset.on = root.querySelector(`[data-ec="${n}"] [data-art^="EC-"]`) ? n : '';
    sfx('whoosh');
    tl.set(eye, { visibility: 'visible', clipPath: 'circle(0% at 50% 50%)' })
      .set(card, { rotationY: -100, rotationZ: -8, scale: 0.6, opacity: 0 })
      .to(eye, { clipPath: 'circle(75% at 50% 50%)', duration: 0.38, ease: 'power3.in' })
      .add(cover)
      .to(card, { rotationY: 0, rotationZ: -2, scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.6)' })
      .add(() => sfx('blip'))
      .to(card, { rotationZ: 1, duration: 0.85, ease: 'sine.inOut' })
      .to(card, { rotationY: 100, scale: 0.6, opacity: 0, duration: 0.36, ease: 'power3.in' })
      .to(eye, { clipPath: 'circle(0% at 50% 50%)', duration: 0.36, ease: 'power3.inOut' }, '-=0.12')
      .set(eye, { visibility: 'hidden' });
  } else if (kind === 'powerup') {
    const p = $('.fx__power'), aura = $('.fx__aura'), rage = $('.fx__rage'), flash = $('.fx__fade');
    sfx('power');
    tl.set(p, { visibility: 'visible', opacity: 1 })
      .set(aura, { clipPath: 'circle(0% at 50% 50%)' })
      .fromTo(rage, { scale: 0.15, rotation: -6, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.45, ease: 'power2.out' })
      .to(rage, { scale: 1.08, duration: 0.5, ease: 'sine.inOut' })
      .to(aura, { clipPath: 'circle(80% at 50% 50%)', duration: 0.5, ease: 'power2.in' }, '-=0.35')
      .to(rage, { scale: 3.2, opacity: 0, duration: 0.35, ease: 'power3.in' }, '-=0.15')
      .set(flash, { visibility: 'visible', background: '#fff', opacity: 1 })
      .add(cover)
      .set(p, { visibility: 'hidden' })
      .to(flash, { opacity: 0, duration: 0.45, ease: 'power2.out' })
      .set(flash, { visibility: 'hidden', background: '' });
  } else {
    const el = $('.fx__fade');
    tl.set(el, { visibility: 'visible', opacity: 0 })
      .to(el, { opacity: 1, duration: 0.22, ease: 'none' })
      .add(cover)
      .to(el, { opacity: 0, duration: 0.3, ease: 'none' })
      .set(el, { visibility: 'hidden' });
  }
  return tl.then();
}

// Small local impact (used by K.O. and stamps). No flash, just a jolt.
export function jolt(el, strength = 10) {
  if (reduced || !el) return;
  gsap.fromTo(el, { x: 0, y: 0 }, {
    x: () => gsap.utils.random(-strength, strength), y: () => gsap.utils.random(-strength, strength),
    duration: 0.04, repeat: 5, yoyo: true, ease: 'none', onComplete: () => gsap.set(el, { x: 0, y: 0 }),
  });
}
