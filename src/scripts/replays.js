// Small playable battle replays drawn in code: Interceptor, VM Provisioning,
// QueueCTL, and Opscope's never-ending hydra.
import { gsap } from 'gsap';
import { reduced } from './smooth.js';
import { say } from './nav.js';
import { play as sfx } from './sfx.js';

const $ = (s, r) => r.querySelector(s);
const $$ = (s, r) => [...r.querySelectorAll(s)];
const D = (s) => (reduced ? 0 : s);

function interceptor(root) {
  const form = $('form', root), input = $('input', root), lane = $('.rp__lane', root);
  const pkt = $('.rp__pkt', root), [w1, w2] = $$('.rp__wire', root), proxy = $('.rp__proxy', root), db = $('.rp__db', root);
  const hold = $('.rp__hold', root), log = $('.rp__log', root);
  lane.appendChild(pkt);
  let audit = 1041, tl;
  const xAt = (el, end) => { const a = lane.getBoundingClientRect(), b = el.getBoundingClientRect(); return (end ? b.right : b.left) - a.left; };
  const reset = () => { if (tl) tl.kill(); hold.hidden = true; gsap.set(pkt, { opacity: 0, x: 0, scale: 1 }); };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    reset();
    const danger = /^\s*(drop|alter|truncate)\b/i.test(q);
    const isSelect = /^\s*select\b/i.test(q);
    pkt.textContent = q.length > 18 ? q.slice(0, 17) + '…' : q;
    pkt.classList.toggle('is-safe', !danger);
    db.classList.remove('is-dropped');
    db.textContent = '▦ users';
    tl = gsap.timeline();
    tl.set(pkt, { opacity: 1, x: xAt(w1, false) - 10, xPercent: -50, yPercent: -50 })
      .to(pkt, { x: xAt(w1, true), duration: D(0.6), ease: 'power1.in' });
    if (danger) {
      tl.add(() => {
        sfx('stamp');
        gsap.fromTo(proxy, { scale: 1.2 }, { scale: 1, duration: 0.3 });
        hold.hidden = false;
        log.textContent = `HOLD  ${q}  · user=dev · ip=10.0.4.7 · waiting for approval`;
        say('Interceptor catches the ink before it dries.');
      }).to(pkt, { x: '+=3', duration: 0.05, repeat: 9, yoyo: true });
    } else {
      tl.to(pkt, { x: xAt(w2, true), duration: D(0.5), ease: 'none' })
        .add(() => { log.textContent = isSelect ? `${q} · passed straight through · 3 rows` : `${q} · passed through · OK`; })
        .to(pkt, { opacity: 0, duration: 0.2 });
    }
  });
  $('[data-approve]', root).addEventListener('click', () => {
    hold.hidden = true;
    audit++;
    gsap.timeline().to(pkt, { x: xAt(w2, true), duration: D(0.45), ease: 'power1.in' })
      .add(() => { db.classList.add('is-dropped'); db.textContent = '✖ users'; sfx('impact'); log.textContent = `APPROVED by peer · audit #${audit} · table users dropped`; say('…you approved that? The audit log will remember.'); })
      .to(pkt, { opacity: 0, duration: 0.2 });
  });
  $('[data-deny]', root).addEventListener('click', () => {
    hold.hidden = true;
    audit++;
    gsap.to(pkt, { scale: 1.8, opacity: 0, duration: D(0.3), ease: 'power2.out' });
    log.textContent = `DENIED · audit #${audit} · users is safe`;
    say('Just as planned.');
  });
}

function vm(root) {
  const btn = $('[data-summon]', root), t = $('.rp__timer b', root), steps = $$('.rp__steps li', root);
  const durs = [0.35, 0.25, 0.8, 0.6, 0.9, 0.2];
  let tl;
  btn.addEventListener('click', () => {
    if (tl) tl.kill();
    steps.forEach((s) => s.classList.remove('is-on', 'is-done'));
    const clock = { s: 0 };
    tl = gsap.timeline({ onComplete: () => { btn.textContent = 'Summon another'; say('The Sloth is defeated. Your VM is ready.'); } });
    btn.textContent = 'Summoning…';
    let at = 0;
    steps.forEach((s, i) => {
      tl.add(() => { if (steps[i - 1]) steps[i - 1].classList.replace('is-on', 'is-done'); s.classList.add('is-on'); sfx('blip'); }, at);
      at += reduced ? 0.05 : durs[i];
    });
    tl.add(() => steps[steps.length - 1].classList.replace('is-on', 'is-done'), at);
    tl.to(clock, { s: 12.4, duration: reduced ? 0.3 : at, ease: 'none', onUpdate: () => (t.textContent = clock.s.toFixed(1)) }, 0);
  });
}

function queuectl(root) {
  const pend = $('[data-q="pending"]', root), dlq = $('[data-q="dlq"]', root), done = $('[data-q="done"]', root);
  const workers = $$('[data-q="workers"] li', root), log = $('.rp__log', root), btn = $('[data-enqueue]', root);
  let id = 17, finished = 0;
  const queue = [];
  const render = () => {
    pend.innerHTML = queue.map((j) => `<li>job-${j.id}${j.tries ? ` ↻${j.tries}` : ''}</li>`).join('');
    done.textContent = String(finished);
  };
  const idle = new Set(workers);
  function pump() {
    for (const w of [...idle]) {
      const job = queue.shift(); // atomic claim: one job, one worker
      if (!job) break;
      idle.delete(w);
      w.classList.add('is-busy');
      $('span', w).textContent = `job-${job.id}`;
      log.textContent = `${$('b', w).textContent}: UPDATE jobs SET state='running' WHERE id=${job.id} AND state='pending' → 1 row`;
      render();
      setTimeout(() => {
        w.classList.remove('is-busy');
        const fails = job.flaky === 'always' || (job.flaky === 'once' && job.tries === 0);
        if (fails) {
          job.tries++;
          w.classList.add('is-fail');
          setTimeout(() => w.classList.remove('is-fail'), 300);
          if (job.tries >= 3) { dlq.insertAdjacentHTML('beforeend', `<li>job-${job.id}</li>`); log.textContent = `job-${job.id} failed 3 times → dead-letter queue`; }
          else { const back = 250 * 2 ** job.tries; log.textContent = `job-${job.id} failed · retry in ${back * 4} ms (exponential backoff)`; setTimeout(() => { queue.push(job); render(); pump(); }, back); }
        } else finished++;
        $('span', w).textContent = '';
        idle.add(w);
        render();
        pump();
      }, reduced ? 120 : 500 + Math.random() * 700);
    }
  }
  btn.addEventListener('click', () => {
    for (let k = 0; k < 8; k++) queue.push({ id: id++, tries: 0, flaky: k === 3 ? 'always' : k === 6 ? 'once' : '' });
    render();
    pump();
  });
}

function opscope(root) {
  const pods = $$('.pod', root), btn = $('[data-fix]', root), ok = $('.rp__ok', root), log = $('.rp__log', root);
  const rounds = [
    { bad: [1], fix: 'p2: created secret db-creds · rolled deployment', next: [0, 2], why: 'p1, p3: CrashLoopBackOff · why: OOMKilled (limit 128Mi)' },
    { bad: [0, 2], fix: 'p1, p3: raised memory limit to 256Mi · Running', next: [1], why: 'p2: CrashLoopBackOff · why: readiness probe hits /healthz before migrations finish' },
    { bad: [1], fix: 'p2: added startup probe · Running', next: [], why: 'All pods Running. A new head is growing somewhere else. Battle in progress.' },
  ];
  const first = log.textContent;
  let r = 0;
  const paint = (bad) => pods.forEach((p, i) => { p.classList.toggle('is-bad', bad.includes(i)); p.classList.toggle('is-good', !bad.includes(i)); });
  paint(rounds[0].bad);
  btn.addEventListener('click', () => {
    if (r === rounds.length) { r = 0; paint(rounds[0].bad); log.textContent = first; btn.textContent = 'One-click fix'; return; }
    const round = rounds[r];
    paint([]);
    log.textContent = 'fixed · ' + round.fix;
    ok.classList.add('is-on');
    sfx('stamp');
    btn.disabled = true;
    setTimeout(() => {
      ok.classList.remove('is-on');
      paint(round.next);
      log.textContent = round.why;
      if (round.next.length) sfx('impact');
      r++;
      btn.disabled = false;
      if (r === rounds.length) { btn.textContent = 'Start over'; say('This battle is still being fought. One commit at a time.'); }
    }, reduced ? 200 : 1300);
  });
}

export function initReplays() {
  const map = { interceptor, vm, queuectl, opscope };
  document.querySelectorAll('[data-replay]').forEach((el) => { const fn = map[el.dataset.replay]; if (fn) fn(el); });
}
