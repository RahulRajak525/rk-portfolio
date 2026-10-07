/**
 * Canonical origin of the site. Resolution order:
 * 1. NEXT_PUBLIC_SITE_URL (set this in production)
 * 2. Vercel's production domain
 * 3. Local development
 */
export function getSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return new URL(`https://${vercel}`);

  return new URL(`http://localhost:${process.env.PORT ?? 3000}`);
}
