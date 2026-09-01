// backend/src/lib/stripe.js — Stripe payment integration (mock test mode)
// In production, uses Stripe secret key: process.env.STRIPE_SECRET_KEY

export async function createCheckoutSession({ product, buyerEmail }) {
  // Mock Stripe checkout — returns fake session
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

export async function processPayment({ product, buyerEmail, token = "tok_visa" }) {
  // Simulate Stripe charge — always succeeds in test mode
  // Real impl: await stripe.paymentIntents.create({ amount, currency, payment_method: token, confirm:true })
  await new Promise(r => setTimeout(r, 200));
  if (!product) throw new Error("Product required");
  const fees = { platformFee: +(product.price * 0.20).toFixed(2), sellerRevenue: +(product.price * 0.80).toFixed(2) };
  return {
    success: true,
    chargeId: `ch_${Date.now()}`,
    amount: product.price,
    fees,
    sellerRevenue: fees.sellerRevenue,
    platformFee: fees.platformFee,
    message: "Payment processed via Stripe Test Mode (4242 4242 4242 4242)",
    testCard: "4242 •••• •••• 4242",
  };
}

export function isStripeConfigured(env = {}) {
  return !!(env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY);
}
