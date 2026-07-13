import type { APIRoute } from 'astro';

const STATIC_PATHS = ['/', '/about', '/contact'];

export const GET: APIRoute = ({ site }) => {
  const origin = site?.toString().replace(/\/$/, '') || 'https://shieldvase.io';
  const now = new Date().toISOString();
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...STATIC_PATHS.map((p) =>
      `  <url><loc>${origin}${p}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq></url>`),
    '</urlset>',
  ].join('\n');
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
