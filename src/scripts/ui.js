// Notch nav, ⌘K palette, paw cursor, Muffins cameos, Konami code, copy email.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as fx from './fx.js';
import { reduced } from './smooth.js';
import { goTo, say } from './nav.js';
import { play as sfx, setOn as setSfx, isOn as sfxOn } from './sfx.js';
import { kubectl, episodes, person } from '../data/content.js';

const html = document.documentElement;
const order = episodes.map((e) => e.id);

// ── Shared actions ────────────────────────────────────────
export async function copyEmail() {
  try { await navigator.clipboard.writeText(person.email); say('Email copied. Muffins approves.'); }
  catch (e) { say(person.email, { hold: 9000 }); }
  sfx('blip');
}
export function toggleSuper() {
  const on = !html.classList.contains('super');
  if (on) fx.run('powerup', { onCover: () => html.classList.add('super') }).then(() => say('SUPER MODE. Glasses: glowing. Bugs: terrified.'));
  else { html.classList.remove('super'); say('Super mode off. Back to normal debugging.'); }
}
export function pet() {
  const btn = document.querySelector('[data-pet]');
  if (btn) { goTo('reactions', { type: 'screentone' }); setTimeout(() => btn.click(), 1200); }
}

// ── Notch ─────────────────────────────────────────────────
let current = 'ep00';
function initNotch() {
  const notch = document.getElementById('notch');
  const pill = notch.querySelector('.notch__pill');
  const prog = notch.querySelector('.notch__prog');
  const no = notch.querySelector('[data-notch-no]'), name = notch.querySelector('[data-notch-name]');
  let closeT;
  const open = (v) => { notch.classList.toggle('is-open', v); pill.setAttribute('aria-expanded', String(v)); };
  notch.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { clearTimeout(closeT); open(true); } });
  notch.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') closeT = setTimeout(() => open(false), 260); });
  pill.addEventListener('click', () => open(!notch.classList.contains('is-open')));
  notch.addEventListener('focusout', (e) => { if (!notch.contains(e.relatedTarget)) open(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') open(false); });

  notch.querySelectorAll('[data-goto]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); open(false); goTo(a.dataset.goto); }));
  const step = (d) => { const i = order.indexOf(current); const j = Math.max(0, Math.min(order.length - 1, i + d)); if (j !== i) goTo(order[j]); };
  notch.querySelector('[data-notch-prev]').addEventListener('click', () => step(-1));
  notch.querySelector('[data-notch-next]').addEventListener('click', () => step(1));

  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => { prog.style.strokeDashoffset = String(100 - s.progress * 100); } });

  return (ep) => {
    if (ep === current) return;
    current = ep;
    const e = episodes.find((x) => x.id === ep);
    if (!e) return;
    no.textContent = `EP.${e.n}`;
    name.textContent = e.short;
    notch.querySelectorAll('[data-goto]').forEach((a) => a.classList.toggle('is-current', a.dataset.goto === ep));
    if (!reduced) gsap.fromTo(pill.querySelector('.notch__ep'), { y: -8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' });
  };
}

// ── Palette ───────────────────────────────────────────────
function initPalette() {
  const dlg = document.getElementById('palette');
  const input = document.getElementById('palette-in');
  const list = document.getElementById('palette-list');
  const out = document.getElementById('palette-out');
  const items = [...list.children];
  let sel = 0;
  const visible = () => items.filter((li) => !li.hidden);
  const mark = () => { const v = visible(); sel = Math.max(0, Math.min(sel, v.length - 1)); items.forEach((li) => li.setAttribute('aria-selected', 'false')); if (v[sel]) { v[sel].setAttribute('aria-selected', 'true'); v[sel].scrollIntoView({ block: 'nearest' }); } };
  const openP = () => { if (dlg.open) return; input.value = ''; filter(); dlg.showModal(); input.focus(); sfx('blip'); };
  const close = () => dlg.open && dlg.close();

  function filter() {
    const q = input.value.trim().toLowerCase().replace(/\s+/g, ' ');
    if (kubectl[q]) { out.textContent = kubectl[q]; out.hidden = false; list.hidden = true; return; }
    if (q.startsWith('kubectl') || q.startsWith('k ')) {
      out.hidden = false; list.hidden = true;
      out.textContent = q.length > 8 ? `error: unknown command "${q.split(' ').slice(1).join(' ')}"\nTry: kubectl get episodes · kubectl describe pod unnikrishnan · kubectl logs muffins` : 'kubectl …';
      return;
    }
    out.hidden = true; list.hidden = false;
    items.forEach((li) => { li.hidden = !!q && !(li.textContent + ' ' + li.dataset.keys).toLowerCase().includes(q); });
    sel = 0; mark();
  }
  function act(li) {
    if (!li) return;
    const a = li.dataset.act;
    close();
    if (a.startsWith('goto:')) goTo(a.slice(5));
    else if (a.startsWith('open:')) window.open(a.slice(5), '_blank', 'noopener');
    else if (a === 'copy-email') copyEmail();
    else if (a === 'pet') pet();
    else if (a === 'super') toggleSuper();
    else if (a === 'sfx') setSfx(!sfxOn());
  }
  input.addEventListener('input', filter);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); sel++; mark(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel--; mark(); }
    else if (e.key === 'Enter') { e.preventDefault(); if (!list.hidden) act(visible()[sel]); }
  });
  list.addEventListener('click', (e) => act(e.target.closest('li')));
  list.addEventListener('pointermove', (e) => { const li = e.target.closest('li'); if (li) { sel = visible().indexOf(li); mark(); } });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); dlg.open ? close() : openP(); }
  });
  document.querySelectorAll('[data-palette-open]').forEach((b) => b.addEventListener('click', openP));
}

// ── Paw cursor ────────────────────────────────────────────
function initPaw() {
  if (reduced || !window.matchMedia('(pointer: fine)').matches) return;
  const paw = document.getElementById('paw');
  html.classList.add('has-paw');
  const xTo = gsap.quickTo(paw, 'x', { duration: 0.18, ease: 'power3' });
  const yTo = gsap.quickTo(paw, 'y', { duration: 0.18, ease: 'power3' });
  window.addEventListener('pointermove', (e) => {
    xTo(e.clientX); yTo(e.clientY);
    const t = e.target instanceof Element ? e.target : null;
    paw.classList.toggle('is-hot', !!(t && t.closest('a, button, [role="option"], label, input')));
    paw.classList.toggle('is-dark', !!(t && t.closest('.on-dark, .battle, .credits, .slice, .cold, .palette, .notch')));
  }, { passive: true });
  document.addEventListener('pointerleave', () => html.classList.remove('has-paw'));
  document.addEventListener('pointerenter', () => html.classList.add('has-paw'));
}

// ── Muffins cameos ────────────────────────────────────────
const cameoLines = {
  ep01: 'That’s me in panel four. I’m the main character.',
  ep02: 'I sat on the keyboard during the CKA. We still passed.',
  ep03: 'Bark at the Phantom. Trust me.',
  ep04: 'Are we there yet?',
  ep05: 'Shh. Pretend I’m asleep.',
  reactions: 'The pet button is right there. Just saying.',
};
function initCameos() {
  const cameo = document.getElementById('cameo');
  const bubble = cameo.querySelector('.cameo__bubble');
  const seen = new Set();
  let busy = false;
  const peek = (id) => {
    if (busy || seen.has(id) || fx.isBusy() || html.classList.contains('is-cold')) return;
    seen.add(id); busy = true;
    bubble.textContent = cameoLines[id];
    const tl = gsap.timeline({ onComplete: () => { busy = false; } });
    if (reduced) tl.set(cameo, { x: 0 }).to({}, { duration: 3.2 }).set(cameo, { xPercent: 110, x: 0 });
    else tl.fromTo(cameo, { xPercent: 110 }, { xPercent: 0, duration: 0.6, ease: 'back.out(1.8)' }).add(() => sfx('bark'))
      .fromTo(bubble, { scale: 0, transformOrigin: '100% 100%' }, { scale: 1, duration: 0.3, ease: 'back.out(2.4)' }, '-=0.2')
      .to(cameo, { xPercent: 110, duration: 0.5, ease: 'power3.in', delay: 3.4 });
  };
  Object.keys(cameoLines).forEach((id) => {
    const sec = document.getElementById(id);
    if (sec) ScrollTrigger.create({ trigger: sec, start: 'top 20%', onEnter: () => setTimeout(() => peek(id), 900) });
  });
}

// ── Konami code ───────────────────────────────────────────
function initKonami() {
  const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let i = 0;
  document.addEventListener('keydown', (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    i = k === seq[i] ? i + 1 : k === seq[0] ? 1 : 0;
    if (i === seq.length) { i = 0; toggleSuper(); }
  });
}

export function initUI() {
  const setEpisode = initNotch();
  initPalette();
  initPaw();
  initCameos();
  initKonami();
  document.querySelectorAll('[data-sfx]').forEach((b) => b.addEventListener('click', () => setSfx(!sfxOn())));
  setSfx(sfxOn(), true);
  document.querySelectorAll('[data-copy-email]').forEach((b) => b.addEventListener('click', copyEmail));
  document.addEventListener('click', (e) => { if (e.target instanceof Element && e.target.closest('button, a')) sfx('blip'); });
  return { setEpisode };
}
