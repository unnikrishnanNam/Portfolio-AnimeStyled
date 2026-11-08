// Tiny synthesized sound effects (no audio files). Off by default.
const html = document.documentElement;
let ctx = null;
let on = html.classList.contains('sfx-on');

function ac() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}
function noise(c, dur) {
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const s = c.createBufferSource();
  s.buffer = buf;
  return s;
}
function env(c, t, peak, attack, release) {
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + release);
  return g;
}
function tone(c, out, t, type, f0, f1, dur, peak = 0.6) {
  const o = c.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  const g = env(c, t, peak, 0.005, dur);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + dur + 0.05);
}

export const isOn = () => on;

export function setOn(v, silent = false) {
  on = !!v;
  html.classList.toggle('sfx-on', on);
  try { localStorage.setItem('ddar-sfx', on ? 'on' : 'off'); } catch (e) { /* storage blocked */ }
  document.querySelectorAll('[data-sfx-label]').forEach((el) => (el.textContent = on ? 'on' : 'off'));
  document.querySelectorAll('[data-sfx]').forEach((b) => b.setAttribute('aria-pressed', String(on)));
  if (on && !silent) play('blip');
}

export function play(kind) {
  if (!on) return;
  let c;
  try { c = ac(); } catch (e) { return; }
  const t = c.currentTime;
  const out = c.createGain();
  out.gain.value = 0.32;
  out.connect(c.destination);
  if (kind === 'whoosh') {
    const n = noise(c, 0.6);
    const f = c.createBiquadFilter();
    f.type = 'bandpass'; f.Q.value = 1.4;
    f.frequency.setValueAtTime(300, t);
    f.frequency.exponentialRampToValueAtTime(3600, t + 0.45);
    n.connect(f).connect(env(c, t, 0.9, 0.12, 0.45)).connect(out);
    n.start(t); n.stop(t + 0.6);
  } else if (kind === 'impact') {
    tone(c, out, t, 'sine', 150, 38, 0.45, 1);
    const n = noise(c, 0.25);
    n.connect(env(c, t, 0.7, 0.003, 0.2)).connect(out);
    n.start(t);
  } else if (kind === 'stamp') {
    tone(c, out, t, 'square', 90, 50, 0.18, 0.5);
    const n = noise(c, 0.08);
    n.connect(env(c, t, 0.6, 0.002, 0.06)).connect(out);
    n.start(t);
  } else if (kind === 'power') {
    tone(c, out, t, 'sawtooth', 90, 900, 0.8, 0.35);
    tone(c, out, t + 0.05, 'square', 120, 1200, 0.7, 0.15);
  } else if (kind === 'bark') {
    tone(c, out, t, 'sawtooth', 620, 380, 0.09, 0.5);
    tone(c, out, t + 0.14, 'sawtooth', 680, 400, 0.1, 0.5);
  } else {
    tone(c, out, t, 'square', 880, 1320, 0.06, 0.25);
  }
}
