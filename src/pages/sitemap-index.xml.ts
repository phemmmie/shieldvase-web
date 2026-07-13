import type { APIRoute } from 'astro';
import { listAllProductsForSeo } from '@/lib/queries/products';

const CHUNK = 45000;

export const GET: APIRoute = async ({ site }) => {
  const origin = site?.toString().replace(/\/$/, '') || 'https://shieldvase.io';
  const products = await listAllProductsForSeo();
  const productChunks = Math.max(1, Math.ceil(products.length / CHUNK));
  const now = new Date().toISOString();

  const entries = [
    `${origin}/sitemap-static.xml`,
    `${origin}/sitemap-categories.xml`,
    `${origin}/sitemap-cities.xml`,
    ...Array.from({ length: productChunks }, (_, i) => `${origin}/sitemap-products-${i + 1}.xml`),
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map((loc) => `  <sitemap><loc>${loc}</loc><lastmod>${now}</lastmod></sitemap>`),
    '</sitemapindex>',
  ].join('\n');

  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
