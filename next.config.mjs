// GITHUB_PAGES=1 → export statique servi sous /maylune-store/ (github.io) ; sans la var, dev local inchangé
const isPages = process.env.GITHUB_PAGES === '1';
const basePath = isPages ? '/maylune-store' : '';

const nextConfig = {
  poweredByHeader: false,
  turbopack: {
    root: new URL('.', import.meta.url).pathname,
  },
  ...(isPages
    ? {
        output: 'export',
        basePath,
        // loader custom (pas unoptimized) : seul moyen de préfixer basePath sur les src next/image en export
        images: { loader: 'custom', loaderFile: './image-loader.js' },
      }
    : {
        images: {
          formats: ['image/avif', 'image/webp'],
        },
      }),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
