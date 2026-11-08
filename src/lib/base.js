// The site can live at a sub-path (GitHub Pages: /Portfolio-AnimeStyled/) or at a domain root.
// Prefix root-relative URLs like "/media/x.webp" with the configured base.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export const withBase = (p) => (typeof p === 'string' && p.startsWith('/') && !p.startsWith('//') ? BASE + p : p);
