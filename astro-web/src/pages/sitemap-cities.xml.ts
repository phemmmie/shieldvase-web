import type { APIRoute } from 'astro';
import { listCities } from '@/lib/queries/cities';
import { listTopCategories } from '@/lib/queries/categories';

export const GET: APIRoute = async ({ site }) => {
  const origin = site?.toString().replace(/\/$/, '') || 'https://shieldvase.io';
  const cities = listCities();
  const cats = await listTopCategories();
  const urls: string[] = [];
  for (const c of cities) {
    urls.push(`  <url><loc>${origin}/${c.slug}</loc><changefreq>weekly</changefreq></url>`);
    for (const cat of cats) urls.push(`  <url><loc>${origin}/${c.slug}/${cat.slug}</loc><changefreq>weekly</changefreq></url>`);
  }
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
  ].join('\n');
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
