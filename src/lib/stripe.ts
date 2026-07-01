import Stripe from "stripe";

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
});

// ── Format price for Stripe (convert EGP to piastres) ────────
export const toStripeAmount = (egpAmount: number): number =>
  Math.round(egpAmount * 100);

// ── Create Payment Intent ─────────────────────────────────────
export async function createPaymentIntent(
  amount: number,
  currency: string = "egp",
  metadata: Record<string, string> = {}
) {
  return stripe.paymentIntents.create({
    amount: toStripeAmount(amount),
    currency,
    metadata,
    automatic_payment_methods: { enabled: true },
  });
}

// ── Retrieve Payment Intent ───────────────────────────────────
export async function getPaymentIntent(paymentIntentId: string) {
  return stripe.paymentIntents.retrieve(paymentIntentId);
}

// ── Construct Webhook Event ───────────────────────────────────
export function constructWebhookEvent(
  body: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(body, signature, secret);
}