import { brotSnacks } from './recipes/brot-snacks';
import { fruehstueck } from './recipes/fruehstueck';
import { kartoffeln } from './recipes/kartoffeln';
import { ofen } from './recipes/ofen';
import { pasta } from './recipes/pasta';
import { pfanne } from './recipes/pfanne';
import { reisGetreide } from './recipes/reis-getreide';
import { salate } from './recipes/salate';
import { suppen } from './recipes/suppen';
import type { RecipeDef } from './types';

export { INGREDIENTS } from './ingredients';
export * from './types';

export const RECIPES: RecipeDef[] = [
  ...pasta,
  ...reisGetreide,
  ...suppen,
  ...salate,
  ...ofen,
  ...pfanne,
  ...kartoffeln,
  ...brotSnacks,
  ...fruehstueck,
];
