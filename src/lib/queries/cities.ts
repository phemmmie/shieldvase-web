// City list for /[city] and /[city]/[category] SSG.
// Seeded from the Lovable src/data/nigerianCities.ts contract until we have
// a proper cities table in Supabase.

export interface SeoCity {
  slug: string;
  name: string;
  state: string;
}

export const CORE_CITIES: SeoCity[] = [
  { slug: 'lagos', name: 'Lagos', state: 'Lagos' },
  { slug: 'abuja', name: 'Abuja', state: 'FCT' },
  { slug: 'port-harcourt', name: 'Port Harcourt', state: 'Rivers' },
  { slug: 'kano', name: 'Kano', state: 'Kano' },
  { slug: 'ibadan', name: 'Ibadan', state: 'Oyo' },
  { slug: 'benin-city', name: 'Benin City', state: 'Edo' },
  { slug: 'kaduna', name: 'Kaduna', state: 'Kaduna' },
  { slug: 'enugu', name: 'Enugu', state: 'Enugu' },
];

export const listCities = (): SeoCity[] => CORE_CITIES;
export const getCity = (slug: string) => CORE_CITIES.find((c) => c.slug === slug) || null;
