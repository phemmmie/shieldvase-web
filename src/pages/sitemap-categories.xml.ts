import type { APIRoute } from 'astro';
import { listTopCategories } from '@/lib/queries/categories';

export const GET: APIRoute = async ({ site }) => {
  const origin = site?.toString().replace(/\/$/, '') || 'https://shieldvase.io';
  const cats = await listTopCategories();
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...cats.map((c) =>
      `  <url><loc>${origin}/${c.slug}</loc><lastmod>${c.updated_at}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>`),
    '</urlset>',
  ].join('\n');
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
