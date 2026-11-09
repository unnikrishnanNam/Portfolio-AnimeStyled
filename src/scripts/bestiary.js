// Bestiary mini-games. "Fight" flips a card; each game is themed on the project:
// failover (take the primary down), cache (request twice), sql (try something reckless),
// palette (find muffins.png). Winning captures the monster.
import { gsap } from 'gsap';
import * as fx from './fx.js';
import { reduced } from './smooth.js';
import { say } from './nav.js';
import { play as sfx } from './sfx.js';
import { burstAt } from './burst.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const wait = (ms) => new Promise((r) => setTimeout(r, reduced ? Math.min(ms, 150) : ms));

export function initBestiary() {
  const root = $('#bestiary');
  if (!root) return;
  const cards = $$('.mon', root);
  const slots = $$('.dex__slots li', root);
  const dexN = $('[data-dex]', root);
  const done = $('.dex__done', root);
  const caught = new Set();

  const setFlipped = (card, on) => {
    card.classList.toggle('is-flipped', on);
    $('.mon__front', card).inert = on;
    $('.mon__back', card).inert = !on;
    if (on) setTimeout(() => ($('.mon__back button, .mon__back input', card) || $('.mon__back', card)).focus({ preventScroll: true }), reduced ? 0 : 350);
    else $('[data-fight]', card).focus({ preventScroll: true });
  };

  function capture(card) {
    const i = +card.dataset.mon;
    const first = !caught.has(i);
    caught.add(i);
    say(card.dataset.win, { hold: 5000 });
    setTimeout(() => {
      setFlipped(card, false);
      card.classList.add('is-caught');
      $('[data-fight]', card).textContent = 'Rematch ⚔';
      slots[i].classList.add('is-on');
      dexN.textContent = `${caught.size} / ${cards.length}`;
      sfx('stamp');
      if (!reduced) {
        gsap.fromTo($('.mon__stamp', card), { scale: 3 }, { scale: 1, duration: 0.3, ease: 'power4.in', clearProps: 'transform' });
        setTimeout(() => { fx.jolt(card, 8); sfx('chime'); burstAt($('.mon__art', card), { kind: 'sparks', count: 26 }); }, 300);
      }
      if (first && caught.size === cards.length) {
        setTimeout(() => {
          done.classList.add('is-on');
          burstAt(done, { kind: 'petals', count: 40, spread: 1.4 });
          say('Bestiary complete. OK.', { hold: 5000 });
        }, 900);
      }
    }, reduced ? 200 : 1100);
  }

  cards.forEach((card) => {
    $('[data-fight]', card).addEventListener('click', () => { sfx('whoosh'); reset(card); setFlipped(card, true); });
    $('[data-flee]', card).addEventListener('click', () => setFlipped(card, false));
    card.addEventListener('keydown', (e) => { if (e.key === 'Escape' && card.classList.contains('is-flipped')) setFlipped(card, false); });
    const game = card.dataset.game;
    if (game === 'failover') failover(card, capture);
    if (game === 'cache') cache(card, capture);
    if (game === 'sql') sql(card, capture);
    if (game === 'palette') palette(card, capture);
  });

  function reset(card) { card.dispatchEvent(new CustomEvent('mon:reset')); }
}

// ── Failover: take a node down. A replica just rebuilds; the primary fails over. ──
function failover(card, capture) {
  const nodes = $$('.pg__node', card), log = $('[data-log]', card);
  let busy = false;
  const role = (n, r) => { $('[data-role]', n).textContent = r; n.classList.toggle('is-primary', r === 'primary'); };
  card.addEventListener('mon:reset', () => {
    busy = false;
    nodes.forEach((n, i) => { n.classList.remove('is-down'); role(n, i === 0 ? 'primary' : 'replica'); n.disabled = false; });
    log.classList.remove('is-bad');
    log.textContent = 'writes: OK · click a node to take it down';
  });
  nodes.forEach((n) => n.addEventListener('click', async () => {
    if (busy || n.classList.contains('is-down')) return;
    busy = true;
    const wasPrimary = n.classList.contains('is-primary');
    n.classList.add('is-down');
    sfx('impact');
    if (!reduced) fx.jolt(n, 6);
    if (!wasPrimary) {
      log.textContent = `${$('b', n).textContent} down · primary unaffected · rebuilding replica…`;
      await wait(1400);
      n.classList.remove('is-down');
      log.textContent = 'replica rejoined from WAL · try the primary';
      busy = false;
      return;
    }
    log.classList.add('is-bad');
    log.textContent = `${$('b', n).textContent} (primary) lost · electing a new primary…`;
    role(n, 'down');
    await wait(1300);
    const next = nodes.find((x) => !x.classList.contains('is-down'));
    role(next, 'primary');
    log.classList.remove('is-bad');
    log.textContent = `failover complete · ${$('b', next).textContent} promoted · writes resumed`;
    sfx('power');
    nodes.forEach((x) => (x.disabled = true));
    capture(card);
  }));
}

// ── Cache: first request misses and goes to the origin, the second one is served at the edge. ──
function cache(card, capture) {
  const g = $('.g--cache', card), btn = $('[data-req]', card), log = $('[data-log]', card), pkt = $('.map__pkt', card);
  const P = { you: [40, 118], edge: [96, 92], origin: [262, 34] };
  let n = 0, busy = false;
  card.addEventListener('mon:reset', () => { n = 0; busy = false; g.classList.remove('is-warm'); btn.disabled = false; log.textContent = 'edge cache: empty'; gsap.set(pkt, { opacity: 0 }); });
  const hop = (tl, a, b, d) => tl.fromTo(pkt, { attr: { cx: a[0], cy: a[1] } }, { attr: { cx: b[0], cy: b[1] }, duration: reduced ? 0.01 : d, ease: 'power1.inOut' });
  btn.addEventListener('click', async () => {
    if (busy) return;
    busy = true;
    n++;
    sfx('blip');
    const tl = gsap.timeline();
    tl.set(pkt, { opacity: 1 });
    if (n === 1) {
      log.textContent = 'GET /muffins.mp4 → edge: MISS → origin…';
      hop(tl, P.you, P.edge, 0.3); hop(tl, P.edge, P.origin, 0.9); hop(tl, P.origin, P.edge, 0.9); hop(tl, P.edge, P.you, 0.3);
      tl.set(pkt, { opacity: 0 });
      await tl.then();
      g.classList.add('is-warm');
      log.textContent = 'served from origin · now cached at the edge · request it again';
      btn.textContent = 'Request it again';
      busy = false;
    } else {
      log.textContent = 'GET /muffins.mp4 → edge: HIT';
      hop(tl, P.you, P.edge, 0.25); hop(tl, P.edge, P.you, 0.25);
      tl.set(pkt, { opacity: 0 });
      await tl.then();
      log.textContent = 'HIT · served from the nearest edge, the origin never noticed';
      btn.disabled = true;
      btn.textContent = 'Request /muffins.mp4';
      capture(card);
    }
  });
}

// ── SQL: questions come back as read-only SQL. "Delete all users" is refused, which wins. ──
function sql(card, capture) {
  const chat = $('[data-chat]', card), chips = $$('.chip-q', card);
  let busy = false;
  const bubble = (cls, text) => { const p = document.createElement('p'); p.className = cls; p.textContent = text; chat.appendChild(p); chat.scrollTop = chat.scrollHeight; return p; };
  card.addEventListener('mon:reset', () => { busy = false; chat.innerHTML = ''; chips.forEach((c) => { c.disabled = false; c.classList.remove('is-hint'); }); });
  chips.forEach((c) => c.addEventListener('click', async () => {
    if (busy) return;
    busy = true;
    bubble('q', c.textContent);
    sfx('blip');
    await wait(450);
    if (c.dataset.reckless) {
      bubble('no', 'Refused. This connection is read-only: DELETE is not allowed.');
      sfx('impact');
      if (!reduced) fx.jolt(chat, 6);
      chips.forEach((x) => (x.disabled = true));
      capture(card);
      return;
    }
    const a = bubble('a', '');
    const text = c.dataset.a;
    if (reduced) a.textContent = text;
    else for (let k = 0; k <= text.length; k += 3) { a.textContent = text.slice(0, k); chat.scrollTop = chat.scrollHeight; await wait(16); }
    a.textContent = text;
    c.disabled = true;
    chips.find((x) => x.dataset.reckless).classList.add('is-hint');
    busy = false;
  }));
}

// ── Palette: fuzzy-find muffins.png. ──
function palette(card, capture) {
  const input = $('.pal__in', card), list = $('.pal__list', card), log = $('[data-log]', card);
  const files = JSON.parse(input.dataset.files);
  const target = '~/photos/2026/muffins.png';
  let sel = 0, matches = [];
  const fuzzy = (q, s) => {
    let i = 0;
    const out = [];
    for (const ch of s) { if (i < q.length && ch.toLowerCase() === q[i].toLowerCase()) { out.push(`<mark>${ch}</mark>`); i++; } else out.push(ch); }
    return i === q.length ? out.join('') : null;
  };
  const render = () => {
    const q = input.value.trim();
    matches = q ? files.map((f) => ({ f, h: fuzzy(q, f) })).filter((m) => m.h).sort((a, b) => a.f.length - b.f.length).slice(0, 5) : [];
    sel = Math.min(sel, Math.max(0, matches.length - 1));
    list.innerHTML = matches.map((m, i) => `<li role="option" data-f="${m.f}" aria-selected="${i === sel}">${m.h}</li>`).join('');
    if (q && !matches.length) log.textContent = 'no match · the maze grows a little';
  };
  const pick = (f) => {
    if (!f) return;
    if (f === target) {
      log.textContent = `opened ${f} · one jump, zero folders clicked`;
      input.disabled = true;
      sfx('power');
      capture(card);
    } else {
      log.textContent = `${f.split('/').pop()} is not muffins.png`;
      sfx('blip');
    }
  };
  card.addEventListener('mon:reset', () => { input.disabled = false; input.value = ''; list.innerHTML = ''; log.textContent = 'try typing: muf'; sel = 0; });
  input.addEventListener('input', () => { sel = 0; render(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, matches.length - 1); render(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); render(); }
    else if (e.key === 'Enter') { e.preventDefault(); pick(matches[sel] && matches[sel].f); }
  });
  list.addEventListener('click', (e) => { const li = e.target.closest('li'); if (li) pick(li.dataset.f); });
}
