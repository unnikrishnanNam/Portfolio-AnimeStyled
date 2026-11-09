// Scroll choreography for every section.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as fx from './fx.js';
import { reduced, lock, unlock, jump, velocity } from './smooth.js';
import { say, cardIn, primeCard, goTo, isQuiet, quiet } from './nav.js';
import { playCold } from './coldopen.js';
import { play as sfx } from './sfx.js';
import { burstAt } from './burst.js';
import { initDojo } from './dojo.js';
import { initBestiary } from './bestiary.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const BIG = '(min-width: 1000px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)';
const MOTION = '(prefers-reduced-motion: no-preference)';

// ── Section bookkeeping, boundary transitions, title cards, fansubs ──
function initFrame(setEpisode) {
  $$('main section.sc').forEach((sec) => {
    // Sections that pin themselves sit inside a pin-spacer; measure that instead.
    const box = sec.parentElement.classList.contains('pin-spacer') ? sec.parentElement : sec;
    ScrollTrigger.create({ id: 'sec-' + sec.id, trigger: box, start: 'top top' });
    ScrollTrigger.create({
      trigger: box, start: 'top 55%', end: 'bottom 55%',
      onToggle: (s) => { if (s.isActive && sec.dataset.ep) setEpisode(sec.dataset.ep); },
    });
    const card = $('[data-epcard]', sec);
    if (card) ScrollTrigger.create({ trigger: card, start: 'top 82%', onEnter: () => { if (!card.dataset.shown) cardIn(sec); } });

    // Scrolling down into an arc plays its transition, then lands on the title card.
    if (sec.dataset.fx && !reduced) {
      ScrollTrigger.create({
        trigger: box, start: 'top 62%',
        onEnter: (self) => {
          if (isQuiet() || fx.isBusy() || window.__noFx || document.documentElement.classList.contains('is-cold')) return;
          if (self.scroll() > self.start + window.innerHeight * 0.5) return; // jumped well past it
          if (Math.abs(velocity()) > 120) return; // flung past with the scrollbar
          quiet(1500);
          lock();
          fx.run(sec.dataset.fx, {
            ec: sec.dataset.ec,
            onCover: () => { jump(ScrollTrigger.getById('sec-' + sec.id).start); primeCard(sec); },
          }).then(() => { unlock(); cardIn(sec); });
        },
      });
    }
  });

  // Fansub lines outside the horizontal tracks.
  $$('[data-fansub]').forEach((el) => {
    if (el.closest('.battle__track')) return;
    ScrollTrigger.create({ trigger: el, start: 'top 62%', end: 'bottom 30%', onEnter: () => say(el.dataset.fansub), onEnterBack: () => say(el.dataset.fansub) });
  });
}

// ── EP.00 OP: scroll pushes the pointing hand into the camera ──
function initOp(mm) {
  mm.add(MOTION, () => {
    gsap.timeline({ scrollTrigger: { trigger: '#ep00', start: 'top top', end: '+=110%', pin: true, scrub: 0.4 } })
      .to('.op__hero', { scale: 2.5, xPercent: -22, yPercent: 14, ease: 'power2.in' }, 0)
      .to('.op__copy', { yPercent: -40, opacity: 0, ease: 'power1.in' }, 0)
      .to('.op__sky', { yPercent: 7, ease: 'none' }, 0)
      .to('.op__city', { yPercent: 14, ease: 'none' }, 0)
      .to('.op__cue', { opacity: 0, duration: 0.15 }, 0);
  });
}

// ── EP.01 Origin: the manga page inks itself ──
function initOrigin(mm) {
  mm.add(MOTION, () => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: '.manga', start: 'top 80%', end: 'bottom 75%', scrub: 0.5 } });
    $$('.manga__ink path').forEach((p, i) => tl.fromTo(p, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, ease: 'none' }, i * 0.6));
    $$('.manga .panel').forEach((p, i) => tl.fromTo(p, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, i * 0.6 + 0.4));
    gsap.from('.origin__about > *', { y: 30, opacity: 0, stagger: 0.08, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: '.origin__about', start: 'top 78%' } });
    gsap.from('.origin .teaser', { x: -60, opacity: 0, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: '.origin .teaser', start: 'top 85%' } });
  });
}

// ── EP.02 Training: montage, breathing forms, final selection; night turns to dawn ──
function initTraining(mm) {
  const sec = $('#ep02');
  const montage = $('[data-montage]', sec);
  const reps = $$('.rep', montage);
  const nums = reps.map((r) => $('.rep__n', r));
  const oks = reps.map((r) => $('.rep__ok', r));
  const day = $('[data-day]', montage);
  const every = $('.montage__every', montage);
  const pad = (n) => String(Math.round(n)).padStart(3, '0');

  mm.add(MOTION, () => {
    // The sky warms from midnight to sunrise over the whole arc.
    gsap.fromTo(sec, { '--dawn': 0 }, { '--dawn': 1, ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: true } });
    gsap.from('.forms__head > *', { y: 30, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: '.forms', start: 'top 80%' } });
    gsap.from('.seal', { y: 40, opacity: 0, scale: 0.8, stagger: 0.06, duration: 0.5, ease: 'back.out(1.8)', scrollTrigger: { trigger: '.seals', start: 'top 92%' } });
  });

  // Montage: pinned on big screens, the reps count up one after another while the days fly by.
  mm.add(BIG, () => {
    sec.classList.add('is-pinned');
    montage.classList.add('is-armed');
    const counters = reps.map(() => ({ v: 0 }));
    const d = { v: 1 };
    nums.forEach((n) => (n.textContent = '0'));
    day.textContent = pad(1);
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: montage, start: 'top top', end: () => '+=' + window.innerHeight * 2.4, pin: true, scrub: 0.4, invalidateOnRefresh: true },
    });
    tl.to(d, { v: 365, duration: reps.length + 1, onUpdate: () => (day.textContent = pad(d.v)) }, 0);
    reps.forEach((r, i) => {
      const at = i;
      tl.to(r, { opacity: 1, duration: 0.15 }, at)
        .fromTo(r, { x: -30 }, { x: 0, duration: 0.3, ease: 'power3.out' }, at)
        .to(counters[i], { v: +nums[i].dataset.to, duration: 0.7, ease: 'power1.out', onUpdate: () => (nums[i].textContent = String(Math.round(counters[i].v))) }, at)
        .fromTo(oks[i], { opacity: 0, scale: 2.4 }, { opacity: 1, scale: 1, duration: 0.12, ease: 'power4.in' }, at + 0.72);
    });
    tl.fromTo(every, { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: 0.25, ease: 'power4.in' }, reps.length + 0.1)
      .add(() => { fx.jolt(every, 10); }, reps.length + 0.36)
      .to({}, { duration: 0.5 });
    return () => {
      sec.classList.remove('is-pinned');
      montage.classList.remove('is-armed');
      gsap.set([...reps, ...oks, every], { clearProps: 'all' });
      nums.forEach((n) => (n.textContent = n.dataset.to));
      day.textContent = '365';
    };
  });

  // Smaller screens with motion: each rep counts up as it scrolls in.
  mm.add(`not all and ${BIG}`, () => {
    if (reduced) return;
    const cs = reps.map(() => ({ v: 0 }));
    nums.forEach((n) => (n.textContent = '0'));
    reps.forEach((r, i) => {
      const c = cs[i];
      ScrollTrigger.create({
        trigger: r, start: 'top 85%', once: true,
        onEnter: () => {
          gsap.to(c, { v: +nums[i].dataset.to, duration: 0.9, ease: 'power2.out', onUpdate: () => (nums[i].textContent = String(Math.round(c.v))) });
          gsap.fromTo(oks[i], { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: 0.3, delay: 0.8, ease: 'power4.in' });
        },
      });
    });
    return () => {
      gsap.killTweensOf([...cs, ...oks]);
      gsap.set(oks, { clearProps: 'all' });
      nums.forEach((n) => (n.textContent = n.dataset.to));
    };
  });
  mm.add('(prefers-reduced-motion: reduce)', () => { gsap.set(oks, { opacity: 1 }); });

  initDojo();

  // Final selection: a slash splits the scene, the CKA seal slams down, petals, then the licence scroll unrolls.
  const grad = $('[data-grad]', sec);
  mm.add(MOTION, () => {
    const slash = $('.grad__slash path', grad), splat = $('.grad__splat', grad), stamp = $('[data-cka]', grad);
    const scroll = $('.grad__scroll', grad), lics = $$('.lic', grad);
    const sun = $('.grad__sun', grad);
    gsap.set(sun, { opacity: 0, yPercent: 30, scale: 0.6 });
    gsap.set(stamp, { opacity: 0 });
    gsap.set(scroll, { clipPath: 'inset(0 50% 0 50%)' });
    const tl = gsap.timeline({ paused: true });
    tl.to(slash, { strokeDashoffset: 0, duration: 0.28, ease: 'power4.in' })
      .add(() => sfx('slash'), 0)
      .fromTo(stamp, { scale: 3.2, rotation: -40, opacity: 0 }, { scale: 1, rotation: -12, opacity: 1, duration: 0.42, ease: 'power4.in' }, 0.2)
      .add(() => { sfx('stamp'); fx.jolt(grad, 12); burstAt(stamp, { kind: 'petals', count: 46, spread: 1.6 }); say('CKA: passed. Muffins takes full credit.'); }, 0.62)
      .fromTo(splat, { scale: 0, rotation: -30 }, { scale: 1, rotation: 0, duration: 0.35, ease: 'back.out(2)' }, 0.62)
      .to(sun, { opacity: 1, yPercent: 0, scale: 1, duration: 1.4, ease: 'power2.out' }, 0.5)
      .to(slash, { opacity: 0, duration: 0.6 }, 0.9)
      .to(scroll, { clipPath: 'inset(0 0% 0 0%)', duration: 0.7, ease: 'power3.inOut' }, 0.9)
      .from(lics, { y: 20, opacity: 0, stagger: 0.1, duration: 0.4, ease: 'back.out(1.6)' }, 1.3);
    ScrollTrigger.create({ trigger: $('.grad__stage', grad), start: 'top 72%', once: true, onEnter: () => tl.play() });
    return () => { tl.kill(); gsap.set([stamp, scroll, splat, slash, sun, ...lics], { clearProps: 'all' }); };
  });
}

// ── EP.03 Battle: horizontal fights with HP that drains as you read ──
function setHP(fight, hp) {
  const bar = $('.hp__bar i', fight), num = $('.hp__num', fight), meter = $('.hp', fight);
  if (!bar) return;
  gsap.set(bar, { scaleX: hp });
  num.textContent = String(Math.round(hp * 100));
  meter.setAttribute('aria-valuenow', num.textContent);
  bar.style.background = hp < 0.25 ? 'linear-gradient(#ff8a7a,#e5322d)' : '';
  setKO(fight, hp <= 0.005);
}
function setKO(fight, on) {
  if (!!fight._ko === on) return;
  fight._ko = on;
  const ko = $('.ko span', fight), vic = $('.victory', fight), boss = $('.fight__boss', fight), vs = $('.fight__vs', fight);
  if (!ko) return;
  gsap.killTweensOf([ko, vic, boss, vs]);
  if (on) {
    sfx('impact');
    if (reduced) { gsap.set(ko, { scale: 0.6, x: '30%', y: '-34%', rotation: -8 }); gsap.set(vic, { autoAlpha: 1, y: 0, scale: 1 }); gsap.set(vs, { autoAlpha: 0 }); }
    else {
      gsap.timeline()
        .to(boss, { filter: 'grayscale(1) brightness(1.6)', x: 30, rotation: 8, opacity: 0.35, duration: 0.3 }, 0)
        .to(vs, { autoAlpha: 0, scale: 0.6, duration: 0.2 }, 0)
        .fromTo(ko, { scale: 3, rotation: -30 }, { scale: 1, rotation: -8, duration: 0.28, ease: 'power4.in' }, 0)
        .add(() => fx.jolt($('.fight__stage', fight), 12))
        .to(ko, { scale: 0.6, x: '30%', y: '-34%', duration: 0.4, ease: 'power3.inOut', delay: 0.35 })
        .to(vic, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.6)' }, '<0.1');
    }
    if (fight.dataset.win) say(fight.dataset.win);
  } else {
    gsap.to(ko, { scale: 0, x: 0, y: 0, duration: 0.2 });
    gsap.to(vic, { autoAlpha: 0, y: 30, scale: 0.9, duration: 0.2 });
    gsap.to(boss, { filter: 'none', x: 0, rotation: 0, opacity: 1, duration: 0.3 });
    gsap.to(vs, { autoAlpha: 1, scale: 1, duration: 0.2 });
  }
}

function initBattle(mm) {
  const sec = $('#ep03'), pin = $('.battle__pin', sec), track = $('.battle__track', sec);
  const fights = $$('.fight', track);
  let jumpTo = (i) => goTo(fights[i], { type: 'slash' });

  mm.add(BIG, () => {
    sec.classList.add('is-h');
    const hp = fights.map(() => ({ v: 1 }));
    let active = -1;
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: pin, start: 'top top', end: () => '+=' + fights.length * 1.7 * window.innerHeight,
        pin: true, scrub: 0.5, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: () => {
          const i = Math.round(-gsap.getProperty(track, 'x') / window.innerWidth);
          if (i !== active && fights[i]) { active = i; if (fights[i].dataset.fansub && !fights[i]._ko) say(fights[i].dataset.fansub); }
        },
      },
    });
    fights.forEach((f, i) => {
      if (i > 0) tl.to(track, { x: () => -i * window.innerWidth, duration: 1, ease: 'power2.inOut' });
      tl.addLabel('f' + i);
      if ($('.hp__bar .hp__ghost', f)) tl.to(hp[i], { v: 0, duration: 1.1, onUpdate: () => setHP(f, hp[i].v) }).to({}, { duration: 0.45 });
      else tl.to({}, { duration: 0.9 });
    });
    jumpTo = (i) => goTo(sec, { type: 'slash', y: Math.ceil(tl.scrollTrigger.labelToScroll('f' + i)) + 2 });
    return () => { sec.classList.remove('is-h'); gsap.set(track, { clearProps: 'x' }); fights.forEach((f) => { f._ko = false; }); jumpTo = (i) => goTo(fights[i], { type: 'slash' }); };
  });

  mm.add(`not all and ${BIG}`, () => {
    fights.forEach((f) => {
      if (!$('.hp__bar .hp__ghost', f)) return;
      const o = { v: 1 };
      gsap.to(o, { v: 0, ease: 'none', onUpdate: () => setHP(f, o.v), scrollTrigger: { trigger: f, start: 'top 55%', end: 'bottom 75%', scrub: true } });
    });
    $$('.fight[data-fansub]', track).forEach((f) => ScrollTrigger.create({ trigger: f, start: 'top 60%', onEnter: () => say(f.dataset.fansub), onEnterBack: () => say(f.dataset.fansub) }));
  });

  $$('[data-fight-jump]', sec).forEach((a, i) => a.addEventListener('click', (e) => { e.preventDefault(); jumpTo(i); }));

  // Bestiary: four mini-games under the battle track.
  initBestiary();
  if (!reduced) gsap.from('.mon', { y: 60, opacity: 0, rotation: (i) => (i % 2 ? 3 : -3), stagger: 0.1, duration: 0.6, ease: 'back.out(1.5)', scrollTrigger: { trigger: '.mons', start: 'top 85%' } });
}

// ── EP.04 Journey: horizontal walk, the wheel keeps time ──
function initJourney(mm) {
  const sec = $('#ep04'), pin = $('.journey__pin', sec), track = $('.journey__track', sec);
  const flags = JSON.parse(pin.dataset.flags);
  const flagEls = $$('.flag', sec), chapters = $$('.chapter', sec);
  const wheel = $('.wheel__rot', sec), wheelN = $('.wheel__n b', sec);
  const walker = $('.journey__walker', sec), sprite = $('.walker', sec), drone = $('.journey__drone', sec);
  let active = -1;
  const setChapter = (i) => {
    if (i === active) return;
    active = i;
    chapters.forEach((c, k) => c.classList.toggle('is-on', k === i));
    flagEls.forEach((f, k) => f.classList.toggle('is-passed', k <= i));
    wheelN.textContent = String(i + 1);
  };
  setChapter(0);

  mm.add(BIG, () => {
    sec.classList.add('is-h');
    // Remap flags into the tiles' walkable band so the last chapter is reachable.
    const remap = flags.map((f) => { const tile = Math.floor(f * 4); const sub = f * 4 - tile; return (tile + 0.1 + sub * 0.6) / 4; });
    flagEls.forEach((el, i) => el.style.setProperty('--x', remap[i]));
    const frames = sprite ? +sprite.dataset.frames : 0;
    const hudWheel = $('.wheel', sec);
    const state = { p: 0 };
    const update = () => {
      const W = window.innerWidth, trackW = 4 * W;
      const x = -state.p * 3 * W;
      const wl = (0.08 + state.p * 0.4) * W;
      const ww = walker.offsetWidth || W * 0.25;
      gsap.set(track, { x });
      gsap.set(walker, { x: wl - 0.22 * W });
      gsap.set(drone, { x: wl - 0.3 * W + Math.sin(state.p * 18) * 30 });
      const pos = (wl + ww / 2 - x) / trackW;
      let f = 0;
      if (pos >= remap[0]) {
        f = remap.length - 1;
        for (let i = 0; i < remap.length - 1; i++) if (pos < remap[i + 1]) { f = i + (pos - remap[i]) / (remap[i + 1] - remap[i]); break; }
      }
      gsap.set(wheel, { rotation: -45 * f });
      // On the last tile the real stone wheel is in the scene, so the HUD wheel steps aside.
      hudWheel.classList.toggle('is-away', state.p > 0.8);
      setChapter(Math.min(remap.length - 1, Math.floor(f + 0.001)));
      if (sprite && frames > 1) { const fr = Math.floor((pos * trackW) / 38) % frames; sprite.style.backgroundPosition = `0 ${(fr / (frames - 1)) * 100}%`; sprite.style.backgroundSize = `100% ${frames * 100}%`; }
      else gsap.set(walker, { y: Math.abs(Math.sin(pos * 160)) * -10 });
    };
    gsap.to(state, { p: 1, ease: 'none', onUpdate: update, scrollTrigger: { trigger: pin, start: 'top top', end: () => '+=' + 4.2 * window.innerHeight, pin: true, scrub: 0.6, invalidateOnRefresh: true, onRefresh: update } });
    update();
    return () => { sec.classList.remove('is-h'); hudWheel.classList.remove('is-away'); gsap.set([track, walker, drone, wheel], { clearProps: 'transform' }); };
  });

  mm.add(`not all and ${BIG}`, () => {
    chapters.forEach((c, i) => ScrollTrigger.create({
      trigger: c, start: 'top 60%', end: 'bottom 60%',
      onToggle: (s) => { if (s.isActive) { setChapter(i); gsap.to(wheel, { rotation: -45 * i, duration: reduced ? 0 : 0.8, ease: 'power3.out' }); } },
    }));
  });
}

// ── EP.05 Slice of life: a night-time manga page and a sleepy Shih Tzu ──
function initSlice(mm) {
  const sec = $('#ep05');
  mm.add(MOTION, () => {
    // Panels ink in top to bottom, then their sound effects pop.
    $$('.scene', sec).forEach((s, i) => {
      const delay = (i % 3) * 0.12;
      const st = { trigger: s, start: 'top 88%', once: true };
      gsap.fromTo(s, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.9, delay, ease: 'power3.inOut', scrollTrigger: st, clearProps: 'clipPath' });
      const pop = $('.sfx', s);
      if (pop) gsap.from(pop, { scale: 0, rotation: '-=40', duration: 0.5, delay: delay + 0.6, ease: 'back.out(2.2)', scrollTrigger: { ...st }, clearProps: 'transform' });
      const art = $('.scene__art', s);
      if (art) gsap.fromTo(art, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: s, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    gsap.from('.page__drone', { x: '-40vw', y: 80, rotation: -20, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.page', start: 'top 80%', once: true } });
    gsap.fromTo('.slice__marquee span', { xPercent: 0 }, { xPercent: -25, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.quests li, .quests__book', { y: 18, opacity: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out', scrollTrigger: { trigger: '.quests', start: 'top 85%', once: true } });
  });

  const bed = $('.nap', sec), count = $('.nap__count', sec);
  let n = 0, t;
  bed.addEventListener('click', () => {
    if (bed.classList.contains('is-awake')) return;
    n++;
    clearTimeout(t);
    if (n < 5) {
      count.textContent = `zzz… (${n}/5)`;
      if (!reduced) gsap.fromTo($('.nap__dog--sleep img', bed), { rotation: -3 }, { rotation: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' });
      t = setTimeout(() => { n = 0; count.textContent = ''; }, 2500);
      return;
    }
    n = 0;
    count.textContent = '!!';
    bed.classList.add('is-awake');
    sfx('bark');
    say('Muffins is awake. Nobody is safe.');
    t = setTimeout(() => { bed.classList.remove('is-awake'); count.textContent = ''; }, 6000);
  });
}

// ── Reaction corner ──
function initReactions() {
  const btns = $$('[data-react]'), chans = $$('.tv__ch'), label = $('[data-tv-label]');
  const count = $('.react__count'), hearts = $('.tv__hearts');
  const tune = (id) => {
    chans.forEach((c) => c.classList.toggle('is-on', c.dataset.ch === id));
    btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.react === id)));
    label.textContent = id === 'pet' ? 'MUFFINS' : id;
  };
  btns.forEach((b) => b.addEventListener('click', () => { tune(b.dataset.react); if (b.dataset.has === '0') say('That reaction is still being animated. Check back next episode.'); }));
  let pets = 0;
  try { pets = +(localStorage.getItem('ddar-pets') || 0); } catch (e) { /* ignore */ }
  const showPets = () => { count.textContent = pets ? `Muffins has been petted ${pets} time${pets === 1 ? '' : 's'} on this device.` : ''; };
  showPets();
  $('[data-pet]').addEventListener('click', () => {
    tune('pet');
    pets++;
    try { localStorage.setItem('ddar-pets', String(pets)); } catch (e) { /* ignore */ }
    showPets();
    sfx('bark');
    if (reduced) return;
    for (let i = 0; i < 6; i++) {
      const h = document.createElement('span');
      h.className = 'tv__heart'; h.textContent = i % 2 ? '💛' : '🐾';
      h.style.left = 20 + Math.random() * 60 + '%'; h.style.top = '70%';
      hearts.appendChild(h);
      gsap.to(h, { y: -160 - Math.random() * 120, x: gsap.utils.random(-40, 40), rotation: gsap.utils.random(-30, 30), opacity: 0, duration: 1.4, delay: i * 0.08, ease: 'power1.out', onComplete: () => h.remove() });
    }
  });
}

// ── EP.06 Finale: sepia freeze, തുടരും…, colour floods back ──
function initFinale(mm) {
  const sec = $('#ep06');
  mm.add('(min-width: 801px) and (prefers-reduced-motion: no-preference)', () => {
    sec.classList.add('is-anim');
    const layers = $$('.finale__bg', sec);
    const f = { s: 1 };
    const paint = () => layers.forEach((l) => { l.style.filter = `sepia(${f.s}) contrast(${1 + f.s * 0.15}) brightness(${1 - f.s * 0.08})`; });
    const tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top top', end: '+=170%', pin: true, scrub: 0.5, onEnter: () => say('തുടരും… To be continued.') } });
    tl.set('.finale__grain', { opacity: 0.55 }, 0)
      .fromTo('.endcard', { opacity: 0, scale: 1.25 }, { opacity: 1, scale: 1, duration: 0.25 }, 0)
      .to({}, { duration: 0.2 })
      .to(f, { s: 0, duration: 0.3, onUpdate: paint })
      .to('.finale__grain', { opacity: 0, duration: 0.2 }, '<')
      .to('.endcard', { opacity: 0, y: '-22vh', scale: 0.7, duration: 0.2 }, '<0.12')
      .fromTo('.contact', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' }, '>')
      .to({}, { duration: 0.35 });
    paint();
    return () => { sec.classList.remove('is-anim'); layers.forEach((l) => (l.style.filter = '')); };
  });
}

// ── Credits roll + post-credits scene ──
function initCredits(mm) {
  const sec = $('#credits'), roll = $('.credits__roll', sec);
  mm.add(MOTION, () => {
    gsap.to(roll, { y: () => -(roll.offsetHeight - window.innerHeight * 0.55), ease: 'none', scrollTrigger: { trigger: '.credits__pin', start: 'top top', end: () => '+=' + roll.offsetHeight * 0.9, pin: true, scrub: true, invalidateOnRefresh: true } });
    const dog = $('.post__dog');
    gsap.fromTo(dog, { x: '-60vw' }, {
      x: 0, duration: 1.4, ease: 'power2.out',
      scrollTrigger: { trigger: '.post', start: 'top 75%', toggleActions: 'play none none reverse', onLeaveBack: () => dog.classList.remove('is-sat') },
      onStart: () => dog.classList.remove('is-sat'),
      onComplete: () => { dog.classList.add('is-sat'); gsap.fromTo(dog, { y: 0 }, { y: 14, duration: 0.18, yoyo: true, repeat: 1 }); },
    });
  });
  mm.add('(prefers-reduced-motion: reduce)', () => { sec.classList.add('is-static'); $('.post__dog').classList.add('is-sat'); });
  $('[data-rewind]').addEventListener('click', () => {
    quiet(5000);
    fx.run('fade', { onCover: () => jump(0) }).then(() => playCold({ rerun: true }));
  });
}

export function initSections({ setEpisode }) {
  const mm = gsap.matchMedia();
  initOp(mm);
  initOrigin(mm);
  initTraining(mm);
  initBattle(mm);
  initJourney(mm);
  initSlice(mm);
  initReactions();
  initFinale(mm);
  initCredits(mm);
  initFrame(setEpisode);
}
