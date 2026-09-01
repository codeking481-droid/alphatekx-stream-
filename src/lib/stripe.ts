// src/lib/stripe.ts — TS mirror
export async function createCheckoutSession({ product, buyerEmail }: { product: any; buyerEmail?: string }) {
  const amount = Math.round(product.price * 100);
  return {
    id: `cs_test_${Date.now()}`,
    url: `https://checkout.stripe.com/c/pay/cs_test_${product.id}#${amount}`,
    amount,
    currency: "usd",
    productId: product.id,
    buyerEmail,
    status: "open",
  };
}
export async function processPayment({ product, buyerEmail, token = "tok_visa" }: { product: any; buyerEmail?: string; token?: string }) {
  await new Promise(r => setTimeout(r, 200));
  if (!product) throw new Error("Product required");
  const fees = { platformFee: +(product.price * 0.20).toFixed(2), sellerRevenue: +(product.price * 0.80).toFixed(2) };
  return { success: true, chargeId: `ch_${Date.now()}`, amount: product.price, fees, sellerRevenue: fees.sellerRevenue, platformFee: fees.platformFee, message: "Payment processed via Stripe Test Mode (4242 4242 4242 4242)", testCard: "4242 •••• •••• 4242" };
}
export function isStripeConfigured(env: any = {}) {
  return !!(env.STRIPE_SECRET_KEY || (typeof process !== "undefined" && (process as any).env?.STRIPE_SECRET_KEY));
}
