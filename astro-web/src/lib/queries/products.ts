import { supabase } from '../supabase';

export interface SeoProduct {
  id: string;
  slug: string | null;
  name: string;
  description: string | null;
  updated_at: string;
  category_slug: string;
  image_url: string | null;
  min_price: number | null;
  currency: string;
}

// One row per active unified product. Backed by public.v_seo_products view.
// Fallback query is used until the view is created.
export async function listAllProductsForSeo(): Promise<SeoProduct[]> {
  const { data, error } = await supabase
    .from('unified_products')
    .select('id, slug, name, description, updated_at, categories:category_id(slug)')
    .eq('status', 'active')
    .limit(50000);
  if (error) { console.error('[seo/products]', error); return []; }
  return (data || []).map((p: any) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    updated_at: p.updated_at,
    category_slug: p.categories?.slug || '',
    image_url: null,
    min_price: null,
    currency: 'NGN',
  })).filter((p) => p.category_slug);
}

export async function getProductByShortId(shortId: string): Promise<SeoProduct | null> {
  // shortId = first 6 chars of uuid (dashes stripped). Match by prefix on id::text.
  const { data, error } = await supabase
    .rpc('get_product_by_short_id', { short_id: shortId });
  if (error || !data || !data.length) {
    // Fallback: scan (only viable at small catalog sizes — replace with the RPC in prod)
    const all = await listAllProductsForSeo();
    return all.find((p) => p.id.replace(/-/g, '').slice(0, 6) === shortId) || null;
  }
  const p = data[0];
  return {
    id: p.id, slug: p.slug, name: p.name, description: p.description,
    updated_at: p.updated_at, category_slug: p.category_slug,
    image_url: p.image_url, min_price: p.min_price, currency: p.currency || 'NGN',
  };
}
