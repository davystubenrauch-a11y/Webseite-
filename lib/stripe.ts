import Stripe from "stripe";

// One Stripe client for the server. The key comes only from the environment (Cloudflare: secret
// STRIPE_SECRET_KEY). A restricted key (rk_…) with Checkout Sessions write + Invoices read is enough.
// fetch + Web Crypto, so it runs on Cloudflare Workers as well as on Node.
let client: Stripe | null = null;

export function stripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  client ??= new Stripe(key, { httpClient: Stripe.createFetchHttpClient() });
  return client;
}

export const cryptoProvider = Stripe.createSubtleCryptoProvider();
