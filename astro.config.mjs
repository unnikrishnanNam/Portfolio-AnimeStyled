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

export default defineConfig({
  site: 'https://unnikrishnanek.com',
  build: { inlineStylesheets: 'auto' },
  integrations: [mediaWatch],
  devToolbar: { enabled: false },
  vite: { server: { watch: { ignored: ['**/assets/raw/**'] } } },
});
