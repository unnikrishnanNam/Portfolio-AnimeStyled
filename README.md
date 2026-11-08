# Debug, Deploy, Adventure, Repeat

Unnikrishnan Namboothiri's portfolio, told as a 90s anime series. Astro + GSAP + Lenis.

## Run it

```bash
npm install
npm run dev        # http://localhost:4321, also watches assets/raw for new art
npm run build      # static site in dist/
```

## Adding art

Drop files into `assets/raw/<folder>/` named by asset ID (`CH-02-arms-crossed.png`, `GIF-02-wake-up.gif`, …). The pipeline in `scripts/media.mjs` turns them into AVIF/WebP in `public/media/` and lists them in `src/data/media.json`.

- `9x16` in a name marks the portrait version of a background.
- Flat magenta (#FF00FF) backgrounds are keyed out automatically.
- A `<ID>-…frames.zip` next to a GIF is used instead of the GIF (full colour, no dithering).
- Loops repeat forever. A one-shot (plays once, holds the last frame) has `-once` in its name or is listed in `ONCE` in `scripts/media.mjs` (GIF-02 is).
- Missing art shows as a labelled placeholder in dev and is left out of production builds.

Your Opscope screenshot goes in `assets/raw/screenshots/SCR-01-opscope.png`. A `public/resume.pdf` switches on the résumé buttons.

## Where things live

- Story text, skills, bosses, chapters: `src/data/content.js`
- Sections: `src/components/sections/`
- Notch, ⌘K palette, transitions, cursor: `src/components/ui/`
- Motion: `src/scripts/` (`sections.js` for scroll choreography, `fx.js` for transitions, `replays.js` for the battle replays)

Reduced motion turns every transition into a short fade, unpins the Battle and Journey arcs, and freezes loops on their first frame.

## Deploy

Every push to `main` builds and publishes the site to GitHub Pages (`.github/workflows/deploy.yml`):
https://unnikrishnannam.github.io/Portfolio-AnimeStyled/

The workflow passes the Pages URL in as `SITE_URL` and `BASE_PATH`, so a custom domain later needs no code change: set it under Settings → Pages. To check a production build under the Pages sub-path locally, run the `pages-preview` launch config (or `BASE_PATH=/Portfolio-AnimeStyled npm run build && BASE_PATH=/Portfolio-AnimeStyled npx astro preview`) and open http://localhost:4321/Portfolio-AnimeStyled/.
