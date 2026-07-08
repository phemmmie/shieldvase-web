import { supabase } from '../supabase';

export interface SeoCategory {
  slug: string;
  name: string;
  description: string | null;
  updated_at: string;
  product_count?: number;
}

export async function listTopCategories(): Promise<SeoCategory[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('slug, name, description, updated_at')
    .is('parent_id', null)
    .eq('is_active', true);
  if (error) { console.error('[seo/categories]', error); return []; }
  return data as SeoCategory[];
}

export async function getCategory(slug: string): Promise<SeoCategory | null> {
  const { data } = await supabase
    .from('categories')
    .select('slug, name, description, updated_at')
    .eq('slug', slug)
    .maybeSingle();
  return (data as SeoCategory) || null;
}
