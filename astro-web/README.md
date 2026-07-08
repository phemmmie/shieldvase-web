# shieldvase-web (Astro SEO layer)

Public/SEO surface for **shieldvase.io**. The authenticated marketplace stays on
Lovable at **app.shieldvase.io**. Both apps read the same Supabase project.

> This directory is scaffolded inside the Lovable repo for convenience. Copy it
> into a **new GitHub repo** (`shieldvase-web`) before deploying. Lovable does
> not run it.

## Stack

- Astro 4 (hybrid: SSG + on-demand SSR)
- `@astrojs/node` **standalone** adapter — runs as a plain Node process behind NGINX
- `@astrojs/react` for the few interactive islands (search, filters)
- `@astrojs/sitemap` + custom chunked sitemap routes
- Tailwind
- `@supabase/supabase-js` (anon key only, read-only)

## Local dev

```bash
cp .env.example .env   # fill PUBLIC_SUPABASE_URL + PUBLIC_SUPABASE_ANON_KEY
bun install            # or pnpm/npm
bun run dev            # http://localhost:4321
```

## Build

```bash
bun run build          # -> dist/server/entry.mjs + dist/client/*
```

## VPS deployment (NGINX in front, Node process behind)

1. Clone the repo to `/var/www/shieldvase-web`, `bun install --production=false`, `bun run build`.
2. Run the server as a systemd unit — see `deploy/shieldvase-web.service`.
3. Point NGINX at `127.0.0.1:4321` and serve `dist/client/` as static — see
   `deploy/nginx.conf`.
4. Add a cron (or Supabase webhook -> POST /internal/rebuild) that runs
   `bun run build && systemctl reload shieldvase-web` to refresh SSG pages.

## Routing contract (must match Lovable)

Category slug map (mirrors `src/utils/productUrl.ts` in Lovable):

| shorthand | canonical slug |
|---|---|
| construction | construction |
| polymers | polymers-and-packaging |
| chemicals | chemicals |
| energy | energy-and-petroleum |
| agriculture | agriculture-and-animal-feed |

Product URL: `/{categorySlug}/{productSlug}-p-{shortId}` where `shortId` is the
first 6 chars of the unified_products uuid, hyphens stripped.

## Cutover checklist (Phase 8)

- [ ] DNS: `shieldvase.io` -> VPS, `app.shieldvase.io` -> Lovable published URL
- [ ] Lovable `public/robots.txt` -> `Disallow: /`
- [ ] Lovable `public/sitemap.xml` -> stub pointing at `https://shieldvase.io/sitemap-index.xml`
- [ ] Google Search Console: submit `https://shieldvase.io/sitemap-index.xml`
- [ ] Verify canonical parity on 20 product URLs across both hosts
