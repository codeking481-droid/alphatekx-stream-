// backend/src/lib/marketplace.js — Marketplace logic with 20% platform fee
export const PLATFORM_FEE_RATE = 0.20;

export function calculateFees(price) {
  const p = Number(price) || 0;
  const platformFee = +(p * PLATFORM_FEE_RATE).toFixed(2);
  const sellerRevenue = +(p - platformFee).toFixed(2);
  return { platformFee, sellerRevenue, total: p, feeRate: PLATFORM_FEE_RATE };
}

// In-memory stores shared with main app (imported via closure or passed in)
// For standalone lib, we operate on passed arrays; for backend, we use module globals if injected
export function createProduct(products, data) {
  if (!data.name || data.name.trim().length < 2) throw new Error("Name must be at least 2 characters");
  if (!Number.isFinite(Number(data.price)) || Number(data.price) <= 0) throw new Error("Price must be > 0");
  if (!data.fileUrl || !/^https:\/\/\S+$/i.test(String(data.fileUrl).trim())) throw new Error("A hosted HTTPS download URL is required");
  const category = ["app", "course", "plugin"].includes(data.category) ? data.category : "app";
  const id = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  const product = {
    id,
    name: data.name.trim(),
    description: data.description?.trim() || "",
    price: Number(data.price),
    badge: data.badge || "NEW",
    iconType: category === "app" ? "cpu" : (category === "course" ? "video" : "sparkles"),
    sellerEmail: data.sellerEmail || "creator@alphatekx.ai",
    sellerId: data.sellerId || data.sellerEmail || "creator@alphatekx.ai",
    fileUrl: String(data.fileUrl).trim(),
    fileName: data.fileName || "",
    thumbnailUrl: data.thumbnailUrl || "",
    salesCount: 0,
    totalRevenue: 0,
    totalFees: 0,
    category,
    tags: String(data.tags || "").slice(0, 300),
    relatedTopic: data.relatedTopic || "ai",
    createdAt: Date.now(),
  };
  const fees = calculateFees(product.price);
  product.platformFee = fees.platformFee;
  product.sellerRevenue = fees.sellerRevenue;
  products.unshift(product);
  return product;
}

export function getProduct(products, id) {
  const pid = Number(id);
  return products.find(p => p.id === pid || String(p.id) === String(id)) || null;
}

export function purchaseProduct(products, sales, productId, buyerEmail = "buyer@alphatekx.ai") {
  const product = getProduct(products, productId);
  if (!product) throw new Error("Product not found");
  const fees = calculateFees(product.price);
  product.salesCount += 1;
  product.totalRevenue = (product.totalRevenue || 0) + product.price;
  product.totalFees = (product.totalFees || 0) + fees.platformFee;

  const sale = {
    id: `sale_${Date.now()}_${Math.floor(Math.random()*1000)}`,
    productId: product.id,
    productName: product.name,
    buyerEmail,
    sellerEmail: product.sellerEmail,
    price: product.price,
    platformFee: fees.platformFee,
    sellerRevenue: fees.sellerRevenue,
    createdAt: Date.now(),
  };
  sales.unshift(sale);
  if (sales.length > 500) sales.splice(500);
  return {
    success: true,
    orderId: `ORD-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    downloadUrl: product.fileUrl,
    fees,
    sale,
    product,
    message: `Payment processed via Stripe Test Mode! Seller receives $${fees.sellerRevenue}, Alphatekx keeps $${fees.platformFee} (20%).`,
  };
}

export function getSalesForSeller(sales, sellerEmail) {
  if (!sellerEmail) return sales;
  return sales.filter(s => s.sellerEmail === sellerEmail);
}

export function getSalesSummary(sales, sellerEmail) {
  const filtered = getSalesForSeller(sales, sellerEmail);
  const totalSales = filtered.length;
  const totalRevenue = filtered.reduce((sum, s) => sum + s.price, 0);
  const totalFees = filtered.reduce((sum, s) => sum + s.platformFee, 0);
  const totalSellerRevenue = filtered.reduce((sum, s) => sum + s.sellerRevenue, 0);
  return { totalSales, totalRevenue: +totalRevenue.toFixed(2), totalFees: +totalFees.toFixed(2), totalSellerRevenue: +totalSellerRevenue.toFixed(2), feeRate: PLATFORM_FEE_RATE };
}
