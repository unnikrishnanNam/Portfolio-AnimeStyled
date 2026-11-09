// EP.02 Breathing Forms: hold a seal to breathe in, let go in the gold band to strike.
// A strike draws the element's brush stroke, brushes in the numbered form, stamps the rank,
// and unrolls the training scroll for that skill. Swift (mist) fizzles on purpose.
import { gsap } from 'gsap';
import * as fx from './fx.js';
import { reduced } from './smooth.js';
import { say } from './nav.js';
import { play as sfx } from './sfx.js';
import { burstAt } from './burst.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// Brush strokes per element, in a 1000 × 600 box.
const PATHS = {
  water: 'M40 470 C 230 250, 420 590, 620 330 S 880 110, 980 210',
  stone: 'M110 570 L 900 50',
  flame: 'M60 540 C 260 470, 330 170, 520 280 S 800 470, 960 70',
  wind: 'M40 210 Q 500 110 980 250 M60 330 Q 520 230 990 370 M40 450 Q 480 350 960 490',
  thunder: 'M70 90 L 390 250 L 300 320 L 650 440 L 560 500 L 960 580',
  mist: 'M420 330 q 18 -24 36 0 t 36 0 t 36 0 t 36 0',
};
const GOLD = [0.75, 0.92];
const CHARGE_S = 1.5;
const GRADES = { perfect: 'PERFECT FORM', good: 'CLEAN FORM', shallow: 'SHALLOW BREATH · HOLD LONGER', over: 'HELD TOO LONG' };

// Ink droplets that spiral into the hero while charging, then spray out on the strike.
function inkField(canvas) {
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, cx = 0, cy = 0, raf = 0, charging = false, color = '#46b3ff';
  const parts = [];
  const size = () => {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  new ResizeObserver(size).observe(canvas);
  size();
  const center = () => {
    const hero = canvas.parentElement.querySelector('.dojo__hero');
    const a = canvas.getBoundingClientRect(), b = hero.getBoundingClientRect();
    cx = b.left - a.left + b.width / 2; cy = b.top - a.top + b.height * 0.42;
  };
  const spawnIn = (n) => {
    for (let i = 0; i < n && parts.length < 220; i++) {
      const a = Math.random() * Math.PI * 2, r = Math.max(w, h) * (0.45 + Math.random() * 0.3);
      parts.push({ out: false, a, r, s: 1.5 + Math.random() * 4.5, spin: (Math.random() < 0.5 ? -1 : 1) * (0.012 + Math.random() * 0.025), life: 1 });
    }
  };
  const loop = () => {
    ctx.clearRect(0, 0, w, h);
    if (charging) spawnIn(4);
    ctx.fillStyle = color;
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      if (!p.out) {
        p.r *= 0.955; p.a += p.spin;
        p.x = cx + Math.cos(p.a) * p.r; p.y = cy + Math.sin(p.a) * p.r * 0.8;
        if (p.r < 14) { parts.splice(i, 1); continue; }
        ctx.globalAlpha = Math.min(1, p.r / 120);
      } else {
        p.x += p.vx; p.y += p.vy; p.vx *= 0.94; p.vy = p.vy * 0.94 + 0.12; p.life -= 0.022;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        ctx.globalAlpha = p.life;
      }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    raf = parts.length || charging ? requestAnimationFrame(loop) : 0;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
  return {
    charge(c) { color = c; center(); charging = true; kick(); },
    stop() { charging = false; },
    burst(c, n) {
      color = c; center();
      for (let i = 0; i < n; i++) {
        const a = -0.5 + (Math.random() - 0.5) * 2.2, v = 6 + Math.random() * 16;
        parts.push({ out: true, x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 3, s: 1.5 + Math.random() * 5, life: 1 });
      }
      kick();
    },
  };
}

export function initDojo() {
  const root = $('.dojo');
  if (!root) return;
  const stage = $('.dojo__stage', root);
  const seals = $$('.seal', root);
  const scrolls = $$('[data-scroll]', root);
  const fill = $('.ring__fill', root), hint = $('.dojo__hint', root);
  const main = $('.slash__main', root), core = $('.slash__core', root);
  const title = $('.dojo__title', root), num = $('.dojo__num', root), styleEl = $('.dojo__style', root), moveEl = $('.dojo__move', root);
  const grade = $('.dojo__grade', root), stamp = $('.dojo__stamp', root), stampTxt = $('.dojo__stamp span', root);
  const stance = $('.pose--stance', root), strikePose = $('.pose--strike', root), inset = $('.dojo__inset', root);
  const countEl = $('[data-forms-count]', root), live = $('[data-forms-live]', root);
  const ink = reduced ? null : inkField($('.dojo__ink', root));
  const done = new Set();
  const state = { c: 0 };
  let cur = -1, tween = null, stopBreath = () => {}, strikeTl = null;

  const setRing = () => { fill.style.strokeDashoffset = String(100 - state.c * 100); };
  const setHint = (t) => { hint.textContent = t; };

  function showScroll(i) {
    scrolls.forEach((s) => s.classList.toggle('is-on', s.dataset.scroll === String(i)));
    const el = scrolls.find((s) => s.dataset.scroll === String(i));
    if (el && !reduced) gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.55, ease: 'power3.inOut', clearProps: 'clipPath' });
  }

  function markDone(i) {
    seals[i].classList.add('is-done');
    if (done.has(i)) return;
    done.add(i);
    countEl.textContent = String(done.size);
    if (done.size === seals.length) {
      say('All six forms performed. One of them was mostly confusion.', { hold: 6000 });
      burstAt(stage, { kind: 'sparks', count: 40, spread: 1.4 });
    }
  }

  function start(i) {
    if (cur !== -1) return;
    cur = i;
    const d = seals[i].dataset;
    stage.style.setProperty('--el', d.color);
    if (strikeTl) strikeTl.progress(1);
    seals[i].classList.add('is-holding');
    stage.classList.add('is-charging');
    setHint('BREATHE IN…');
    if (reduced) return;
    state.c = 0; setRing();
    stopBreath = sfx('inhale');
    ink.charge(d.color);
    tween = gsap.to(state, {
      c: 1, duration: CHARGE_S, ease: 'none',
      onUpdate: () => {
        setRing();
        const gold = state.c >= GOLD[0] && state.c <= GOLD[1];
        stage.classList.toggle('is-gold', gold);
        setHint(gold ? 'RELEASE!' : state.c > GOLD[1] ? 'TOO LONG…' : 'BREATHE IN…');
      },
      onComplete: () => release(true),
    });
  }

  function release(over = false) {
    if (cur === -1) return;
    const i = cur;
    cur = -1;
    if (tween) tween.kill();
    stopBreath(); stopBreath = () => {};
    if (ink) ink.stop();
    seals[i].classList.remove('is-holding');
    stage.classList.remove('is-charging', 'is-gold');
    setHint('HOLD A SEAL');
    const c = state.c;
    const q = reduced ? 'good' : over ? 'over' : c >= GOLD[0] && c <= GOLD[1] ? 'perfect' : c < 0.3 ? 'shallow' : 'good';
    strike(i, q);
  }

  function strike(i, q) {
    const d = seals[i].dataset;
    const mist = d.el === 'mist';
    num.textContent = d.num;
    styleEl.textContent = d.style;
    moveEl.textContent = d.move.replace(/^[^:]*:\s*/, '');
    grade.textContent = mist ? 'FORM INCOMPLETE · STILL LEARNING' : GRADES[q];
    grade.dataset.q = mist ? 'fizzle' : q;
    stampTxt.textContent = d.rank;
    showScroll(i);
    markDone(i);
    live.textContent = `${d.style}. ${d.move}. Rank ${d.rank}.`;

    if (reduced) { gsap.set([title, grade, stamp], { autoAlpha: 1, clearProps: 'x,y,scale' }); return; }

    main.setAttribute('d', PATHS[d.el]);
    core.setAttribute('d', PATHS[d.el]);
    const w = mist ? 0.35 : q === 'shallow' ? 0.5 : q === 'perfect' ? 1.3 : 1;
    gsap.set(main, { strokeWidth: 40 * w, stroke: mist ? '#9c94b8' : d.color, opacity: 1 });
    gsap.set(core, { strokeWidth: 9 * w, opacity: mist ? 0 : 0.95 });
    sfx(mist ? 'blip' : 'slash');

    const tl = gsap.timeline();
    strikeTl = tl;
    tl.to(fill, { strokeDashoffset: 100, duration: 0.25 }, 0)
      .fromTo([main, core], { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: mist ? 0.7 : 0.22, ease: mist ? 'sine.inOut' : 'power4.in', stagger: 0.04 }, 0.04);
    if (!mist) {
      if (strikePose) {
        const img = strikePose.querySelector('img');
        if (img) img.src = img.src.split('#')[0] + '#' + Date.now();
        tl.add(() => { stance.classList.remove('is-on'); strikePose.classList.add('is-on'); }, 0)
          .add(() => { strikePose.classList.remove('is-on'); stance.classList.add('is-on'); }, 1.2);
      } else {
        tl.fromTo(stance, { x: 0, skewX: 0 }, { x: '16%', skewX: -7, duration: 0.12, ease: 'power3.out' }, 0.05)
          .to(stance, { x: 0, skewX: 0, duration: 0.5, ease: 'power2.out' }, 0.4);
      }
      tl.add(() => {
        stage.classList.add('is-flash');
        setTimeout(() => stage.classList.remove('is-flash'), 110);
        fx.jolt(stage, q === 'perfect' ? 14 : 8);
        ink.burst(d.color, q === 'perfect' ? 130 : q === 'shallow' ? 30 : 70);
      }, 0.27);
    } else {
      tl.fromTo(inset, { autoAlpha: 0, scale: 0.4, rotation: -14 }, { autoAlpha: 1, scale: 1, rotation: -6, duration: 0.4, ease: 'back.out(2)' }, 0.5)
        .to(inset, { autoAlpha: 0, scale: 0.6, duration: 0.3 }, 2.6);
    }
    tl.fromTo(title, { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.35, ease: 'power3.out' }, 0.3)
      .fromTo(num, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.5, ease: 'power2.inOut' }, 0.3)
      .fromTo(stamp, { autoAlpha: 0, scale: 2.6, rotation: -32 }, { autoAlpha: 1, scale: 1, rotation: -10, duration: 0.28, ease: 'power4.in' }, 0.55)
      .add(() => sfx('stamp'), 0.83)
      .fromTo(grade, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.7)
      .to([main, core], { opacity: 0, duration: 0.8, ease: 'power2.in' }, 1.1);
    if (q === 'perfect' && !mist) tl.add(() => { sfx('chime'); burstAt(stamp, { kind: 'petals', count: 30 }); }, 0.9);
  }

  seals.forEach((btn, i) => {
    btn.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      btn.focus({ preventScroll: true });
      try { btn.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      start(i);
    });
    const up = () => { if (cur === i) release(); };
    btn.addEventListener('pointerup', up);
    btn.addEventListener('pointercancel', up);
    btn.addEventListener('lostpointercapture', up);
    btn.addEventListener('contextmenu', (e) => e.preventDefault());
    btn.addEventListener('keydown', (e) => {
      if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); start(i); }
    });
    btn.addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); up(); } });
    btn.addEventListener('blur', up);
  });
}
