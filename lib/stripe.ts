import Stripe from "stripe";

// One Stripe client for the server. The key comes only from the environment (Vercel: sensitive
// variable). A restricted key (rk_…) with Checkout Sessions write + Invoices read is enough.
let client: Stripe | null = null;

export function stripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  client ??= new Stripe(key);
  return client;
}
