import { createHash } from 'node:crypto';

/** Deterministische UUID je Rezept-Slug (Seed kann beliebig oft eingespielt werden). */
export function recipeUuid(slug: string): string {
  const hex = createHash('md5').update(`gabelmatch:recipe:${slug}`).digest('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}
