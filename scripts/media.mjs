// Media pipeline: assets/raw/** -> public/media/* + src/data/media.json
//
// - Files are matched by asset ID (CH-01, BG-06a, GIF-04, ...). A "9x16" in the
//   name marks the portrait variant, stored as "<ID>@p".
// - Stills become AVIF + WebP at up to three widths. Cut-outs are trimmed.
// - Flat magenta (#FF00FF) backgrounds are keyed out to transparency.
// - GIFs become an animated WebP, a poster frame, and a vertical sprite strip
//   (used by the scroll-scrubbed walk cycle).
// - Unchanged sources are skipped, so re-running is cheap.
//
// Usage: node scripts/media.mjs [--watch]

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW = path.join(ROOT, 'assets/raw');
const OUT = path.join(ROOT, 'public/media');
const MANIFEST = path.join(ROOT, 'src/data/media.json');
const SKIP_DIRS = new Set(['reference']);
const NAME_RE = /^([A-Z]+-\d+[a-z]?)(.*)\.(png|jpe?g|webp|gif|mp4|webm)$/i;
const STILL_WIDTHS = { backgrounds: [960, 1600, 2400], screenshots: [960, 1600, 2400], default: [480, 960, 1440] };

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name)) out.push(...walk(p)); }
    else out.push(p);
  }
  return out;
}

const fresh = (src, outs) => {
  const t = fs.statSync(src).mtimeMs;
  return outs.every((o) => fs.existsSync(o) && fs.statSync(o).mtimeMs >= t);
};
const hex = ({ r, g, b }) => '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
const isMagenta = (r, g, b) => r > 200 && b > 200 && g < 90;

// Key out flat magenta. Soft edge from distance to #FF00FF, plus despill so
// anti-aliased edges do not keep a pink fringe.
function keyMagenta(data, channels) {
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const d = Math.hypot(255 - r, g, 255 - b);
    let a = d < 60 ? 0 : d > 160 ? 255 : Math.round(((d - 60) / 100) * 255);
    if (a < 255) {
      const spill = Math.min(r, b) - g;
      if (spill > 0) { data[i] = Math.max(0, r - spill * 0.6); data[i + 2] = Math.max(0, b - spill * 0.6); }
    }
    data[i + 3] = Math.min(data[i + 3], a);
  }
  return data;
}

async function cornersMagenta(img) {
  const { data, info } = await img.clone().resize(16, 16, { fit: 'fill' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const px = (x, y) => { const i = (y * info.width + x) * 3; return [data[i], data[i + 1], data[i + 2]]; };
  return [px(0, 0), px(15, 0), px(0, 15), px(15, 15)].filter((c) => isMagenta(...c)).length >= 3;
}

async function still(file, key, folder) {
  let img = sharp(file);
  const meta = await img.metadata();
  let keyed = false;
  if (await cornersMagenta(img)) {
    const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    keyMagenta(data, 4);
    img = sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } });
    keyed = true;
  }
  const alpha = keyed || meta.hasAlpha;
  let buf = await img.png().toBuffer();
  if (alpha) {
    try { buf = await sharp(buf).trim({ threshold: 1 }).extend({ top: 8, bottom: 8, left: 8, right: 8, background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer(); }
    catch { /* nothing to trim */ }
  }
  const m = await sharp(buf).metadata();
  // Cap widths at the source width and drop near-duplicates (1600 vs 1664).
  const widths = [...new Set((STILL_WIDTHS[folder] || STILL_WIDTHS.default).map((w) => Math.min(w, m.width)))];
  const top = Math.max(...widths);
  for (let i = widths.length - 1; i >= 0; i--) if (widths[i] !== top && widths[i] > top * 0.85) widths.splice(i, 1);
  const base = key.replace('@p', '-p');
  const outs = widths.flatMap((w) => ['avif', 'webp'].map((f) => path.join(OUT, `${base}-${w}.${f}`)));
  if (!fresh(file, outs)) {
    for (const w of widths) {
      const r = sharp(buf).resize({ width: w });
      await r.clone().avif({ quality: 52, effort: 4 }).toFile(path.join(OUT, `${base}-${w}.avif`));
      await r.clone().webp({ quality: 80, alphaQuality: 90, effort: 4 }).toFile(path.join(OUT, `${base}-${w}.webp`));
    }
    console.log(`  still  ${key}  ${m.width}x${m.height}${keyed ? '  (magenta keyed)' : ''}`);
  }
  const { dominant } = await sharp(buf).stats();
  return { kind: 'still', w: m.width, h: m.height, alpha, color: hex(dominant), widths, base: `/media/${base}` };
}

// Full-colour frames from "<ID>-...frames.zip" beat the 256-colour GIF. Needs `unzip`.
async function framesFromZip(zip) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ddar-frames-'));
  try {
    execFileSync('unzip', ['-o', '-q', '-j', zip, '-d', dir], { stdio: 'ignore' });
    const files = fs.readdirSync(dir).filter((f) => /\.png$/i.test(f) && !f.startsWith('.')).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    if (files.length < 2) return null;
    const first = await sharp(path.join(dir, files[0])).metadata();
    const bufs = [];
    for (const f of files) bufs.push(await sharp(path.join(dir, f)).resize(first.width, first.height, { fit: 'fill' }).ensureAlpha().raw().toBuffer());
    return { data: Buffer.concat(bufs), width: first.width, fh: first.height, frames: files.length };
  } catch { return null; }
  finally { fs.rmSync(dir, { recursive: true, force: true }); }
}

async function anim(file, key, zip) {
  const base = key.replace('@p', '-p');
  const outA = path.join(OUT, `${base}.webp`), outP = path.join(OUT, `${base}-poster.webp`), outS = path.join(OUT, `${base}-strip.webp`);
  const outM = path.join(OUT, `${base}.meta.json`);
  const outs = [outA, outP, outS, outM];
  const urls = { src: `/media/${base}.webp`, poster: `/media/${base}-poster.webp`, strip: `/media/${base}-strip.webp` };
  if ([file, zip].filter(Boolean).every((s) => fresh(s, outs))) return { kind: 'anim', ...JSON.parse(fs.readFileSync(outM, 'utf8')), ...urls };

  const meta = await sharp(file, { animated: true }).metadata();
  const z = zip ? await framesFromZip(zip) : null;
  let data, fw, fh, frames;
  if (z) ({ data, width: fw, fh, frames } = z);
  else {
    data = await sharp(file, { animated: true }).ensureAlpha().raw().toBuffer();
    fw = meta.width; fh = meta.pageHeight || meta.height; frames = meta.pages || 1;
  }
  // Magenta loops: key every frame, judged on the first frame's corners.
  const keyed = await cornersMagenta(sharp(file));
  if (keyed) keyMagenta(data, 4);
  const delay = meta.delay && meta.delay.length === frames ? meta.delay : Array(frames).fill((meta.delay && meta.delay[0]) || 220);
  const raw = { width: fw, height: fh * frames, channels: 4 };
  await sharp(data, { raw: { ...raw, pageHeight: fh } }).webp({ quality: 80, alphaQuality: 90, effort: 4, loop: 0, delay }).toFile(outA);
  await sharp(Buffer.from(data.subarray(0, fw * fh * 4)), { raw: { width: fw, height: fh, channels: 4 } }).webp({ quality: 85, alphaQuality: 90 }).toFile(outP);
  // Sprite strip (frames stacked vertically), capped so WebP size limits hold.
  const scale = Math.min(1, 16000 / (fh * frames));
  await sharp(data, { raw }).resize({ width: Math.round(fw * scale) }).webp({ quality: 82, alphaQuality: 90 }).toFile(outS);
  const info = { w: fw, h: fh, frames, alpha: keyed || !!meta.hasAlpha, delay };
  fs.writeFileSync(outM, JSON.stringify(info));
  console.log(`  anim   ${key}  ${fw}x${fh} x${frames}${z ? '  (from frame zip)' : ''}${keyed ? '  (magenta keyed)' : ''}`);
  return { kind: 'anim', ...info, ...urls };
}

function video(file, key) {
  const ext = path.extname(file).toLowerCase();
  const out = path.join(OUT, `${key.replace('@p', '-p')}${ext}`);
  if (!fresh(file, [out])) { fs.copyFileSync(file, out); console.log(`  video  ${key}  (copied, no transcode)`); }
  return { kind: 'video', src: `/media/${path.basename(out)}` };
}

async function run() {
  const t0 = Date.now();
  const manifest = {};
  const seen = new Map();
  for (const file of walk(RAW).sort()) {
    const name = path.basename(file);
    const m = name.match(NAME_RE);
    if (!m) continue;
    const id = m[1].toUpperCase().replace(/([A-Z]+-\d+)([A-Z])$/, (_, a, b) => a + b.toLowerCase());
    const portrait = /9x16|portrait/i.test(m[2]);
    const key = id + (portrait ? '@p' : '');
    const ext = m[3].toLowerCase();
    // Prefer gif/video over a still with the same key (loops may ship a poster png).
    const rank = ext === 'gif' ? 3 : ext === 'mp4' || ext === 'webm' ? 2 : 1;
    if (seen.has(key) && seen.get(key).rank >= rank) continue;
    seen.set(key, { file, rank, folder: path.basename(path.dirname(file)), ext });
  }
  const zips = walk(RAW).filter((f) => /frames.*\.zip$/i.test(f));
  for (const [key, { file, folder, ext }] of seen) {
    try {
      const zip = zips.find((z) => path.basename(z).toUpperCase().startsWith(key.replace('@p', '') + '-'));
      const entry = ext === 'gif' ? await anim(file, key, zip) : ext === 'mp4' || ext === 'webm' ? video(file, key) : await still(file, key, folder);
      manifest[key] = { ...entry, file: path.relative(ROOT, file) };
    } catch (err) {
      console.warn(`  !! ${key}: ${err.message}`);
    }
  }
  const json = JSON.stringify(manifest, null, 1);
  const prev = fs.existsSync(MANIFEST) ? fs.readFileSync(MANIFEST, 'utf8') : '';
  if (json !== prev) fs.writeFileSync(MANIFEST, json);
  console.log(`media: ${Object.keys(manifest).length} assets ready (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
}

await run();

if (process.argv.includes('--watch')) {
  let timer, running = false, again = false;
  const kick = () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      if (running) { again = true; return; }
      running = true;
      await run().catch((e) => console.error(e));
      running = false;
      if (again) { again = false; kick(); }
    }, 1200);
  };
  fs.watch(RAW, { recursive: true }, (_, f) => { if (f && !path.basename(f).startsWith('.')) kick(); });
  console.log('media: watching assets/raw for new files…');
}
