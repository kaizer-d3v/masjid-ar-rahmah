/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  // Server-rendered on Vercel (needed for /admin). GitHub Pages workflow sets OUTPUT=export.
  ...(process.env.OUTPUT === 'export' ? { output: 'export' } : {}),
  // Vercel serves at the domain root; the /masjid-ar-rahmah subpath is only for GitHub Pages
  basePath: process.env.VERCEL ? '' : (isProd ? '/masjid-ar-rahmah' : ''),
  images: {
    unoptimized: true,
  },
  // ESLint 10 is incompatible with next lint's options — type checking still runs
  eslint: { ignoreDuringBuilds: true },
};

module.exports = nextConfig;
