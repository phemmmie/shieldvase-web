// Mirror of src/utils/productUrl.ts in the Lovable repo.
// Keep in sync — canonical URLs must match on both hosts.

export const slugify = (input: string): string =>
  (input || '')
    .toString()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '')
    .slice(0, 80);

export const shortIdFromUuid = (id?: string | null): string =>
  (id || '').replace(/-/g, '').slice(0, 6);

const MAIN_CATEGORY_TO_SLUG: Record<string, string> = {
  construction: 'construction',
  polymers: 'polymers-and-packaging',
  chemicals: 'chemicals',
  energy: 'energy-and-petroleum',
  agriculture: 'agriculture-and-animal-feed',
};

export const resolveCategorySlug = (raw?: string | null): string => {
  if (!raw) return 'marketplace';
  const lc = raw.toLowerCase();
  return MAIN_CATEGORY_TO_SLUG[lc] || lc;
};

export interface ProductUrlInput {
  id?: string | null;
  slug?: string | null;
  name?: string | null;
  categorySlug?: string | null;
}

export const buildProductPath = (p: ProductUrlInput): string => {
  const categorySlug = resolveCategorySlug(p.categorySlug);
  const productSlug = p.slug || slugify(p.name || 'product');
  const short = shortIdFromUuid(p.id);
  return `/${categorySlug}/${productSlug}-p-${short}`;
};

export const parseProductSlug = (combined: string) => {
  const m = /^(.+)-p-([a-f0-9]{4,12})$/i.exec(combined);
  return m ? { slug: m[1], shortId: m[2].toLowerCase() } : null;
};

// Deep link into the Lovable app (auth / cart / checkout)
export const appUrl = (path: string) =>
  `${import.meta.env.PUBLIC_APP_URL}${path.startsWith('/') ? path : `/${path}`}`;
