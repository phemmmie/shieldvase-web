import type { APIRoute, GetStaticPaths } from 'astro';
import { listAllProductsForSeo } from '@/lib/queries/products';
import { buildProductPath } from '@/lib/urls';

const CHUNK = 45000;

// Prerendered dynamic route: emit one sitemap file per chunk. The chunk count
// must match the entries listed in sitemap-index.xml.ts.
export const getStaticPaths: GetStaticPaths = async () => {
  const products = await listAllProductsForSeo();
  const productChunks = Math.max(1, Math.ceil(products.length / CHUNK));
  return Array.from({ length: productChunks }, (_, i) => ({
    params: { chunk: String(i + 1) },
  }));
};

export const GET: APIRoute = async ({ params, site }) => {
  const origin = site?.toString().replace(/\/$/, '') || 'https://shieldvase.io';
  const chunk = Math.max(1, parseInt(params.chunk || '1', 10));
  const all = await listAllProductsForSeo();
  const slice = all.slice((chunk - 1) * CHUNK, chunk * CHUNK);
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...slice.map((p) => {
      const path = buildProductPath({ id: p.id, slug: p.slug, name: p.name, categorySlug: p.category_slug });
      return `  <url><loc>${origin}${path}</loc><lastmod>${p.updated_at}</lastmod><changefreq>weekly</changefreq></url>`;
    }),
    '</urlset>',
  ].join('\n');
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
