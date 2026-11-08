import { defineConfig } from 'astro/config';
import { spawn } from 'node:child_process';

// While `astro dev` runs, re-process assets/raw whenever GPT drops in a new file.
const mediaWatch = {
  name: 'media-watch',
  hooks: {
    'astro:server:setup': ({ server }) => {
      const child = spawn(process.execPath, ['scripts/media.mjs', '--watch'], { stdio: 'inherit' });
      const stop = () => { if (!child.killed) child.kill(); };
      server.httpServer?.on('close', stop);
      process.on('exit', stop);
    },
  },
};

// The GitHub Pages workflow passes the real URL: SITE_URL is the origin, BASE_PATH the sub-path
// ("/Portfolio-AnimeStyled" today, empty once a custom domain is set). Locally the site runs at "/".
export default defineConfig({
  site: process.env.SITE_URL || 'https://unnikrishnannam.github.io',
  base: process.env.BASE_PATH || '/',
  build: { inlineStylesheets: 'auto' },
  integrations: [mediaWatch],
  devToolbar: { enabled: false },
  vite: { server: { watch: { ignored: ['**/assets/raw/**'] } } },
});
