// backend/src/index.js — Unified Search API (Prompt #2)
// Mirrors Cloudflare Worker logic for standalone Node / Express-style usage
// Endpoints: GET /api/search?q=, /api/search/youtube, /tiktok, /instagram, /twitter

import { Hono } from "hono";
import { searchYouTube } from "./lib/youtube.js";
import { searchTikTok } from "./lib/tiktok.js";
import { searchInstagram } from "./lib/instagram.js";
import { searchTwitter } from "./lib/twitter.js";
import { searchAllPlatforms, aggregateResults, getMockFacebookCatalog } from "./lib/aggregator.js";
import { createClip } from "./lib/clipMaker.js";
import { enhanceThumbnail } from "./lib/thumbnailEnhancer.js";
import { translateVoice } from "./lib/voiceTranslator.js";
import { calculateFees, createProduct, getProduct, purchaseProduct, getSalesForSeller, getSalesSummary } from "./lib/marketplace.js";
import { processPayment, createCheckoutSession } from "./lib/stripe.js";
import { fetchChannelInfo, fetchChannelVideos, CHANNEL_ID as OFFICIAL_CHANNEL_ID, CHANNEL_NAME as OFFICIAL_CHANNEL_NAME, CHANNEL_HANDLE as OFFICIAL_CHANNEL_HANDLE } from "./lib/channel.js";

let backendProducts = [
  { id: 1, name: 'AI Neural Net Model Pack', description: 'Pre-trained PyTorch checkpoint & CUDA optimized dataset', price: 9.99, badge: 'BESTSELLER', iconType: 'cpu', sellerEmail: 'dev@alphatekx.ai', fileUrl: 'https://github.com/alphatekx/model-pack.zip', salesCount: 342, category: 'app', tags: 'python,pytorch,ai', createdAt: Date.now() },
  { id: 2, name: 'Stream Platform Course Bundle', description: 'Complete 6-hour video masterclass', price: 24.99, badge: 'HOT', iconType: 'video', sellerEmail: 'academy@alphatekx.ai', fileUrl: 'https://alphatekx.ai/course-bundle.zip', salesCount: 189, category: 'course', tags: 'react,streaming,ai', createdAt: Date.now() },
  { id: 3, name: 'Naija AI Speech Translator Engine', description: 'Pidgin, Yoruba, Igbo & Hausa TTS & STT API wrapper', price: 14.99, badge: 'NEW', iconType: 'sparkles', sellerEmail: 'nigeria-ai@alphatekx.ai', fileUrl: 'https://github.com/alphatekx/naija-tts.zip', salesCount: 95, category: 'plugin', tags: 'pidgin,translation,audio', createdAt: Date.now() },
  { id: 4, name: 'TikTok & YouTube Unified Queue SDK', description: 'JS library to sync queue states & embeds', price: 4.99, badge: 'PRO', iconType: 'layers', sellerEmail: 'sdk@alphatekx.ai', fileUrl: 'https://github.com/alphatekx/queue-sdk.zip', salesCount: 521, category: 'plugin', tags: 'queue,tiktok,youtube', createdAt: Date.now() }
];
let backendSales = [];

export function createApiApp(env = {}) {
  const app = new Hono();

  app.get("/api/health", (c) => c.json({ status: "ok", app: "Alphatekx Stream", unified: true }));

  // Auth endpoints — Gated experience
  import { getAuthUrl, handleCallback } from './lib/auth.js';
  import { fetchUserVideos } from './lib/userVideos.js';

  app.get("/api/auth/url", (c) => c.json({ url: getAuthUrl() }));
  app.get("/api/auth/callback", async (c) => {
    const code = c.req.query("code");
    const sessionToken = await handleCallback(code);
    c.header("Set-Cookie", `session=${sessionToken}; HttpOnly; Path=/; Max-Age=86400`);
    return c.redirect("/");
  });
  app.get("/api/auth/user", (c) => {
    const cookie = c.req.header("cookie") || "";
    const match = cookie.match(/session=([^;]+)/);
    // Placeholder session lookup; return user if found
    return c.json({ id: match ? match[1] : null, channelName: "Alphatekx User", isGuest: !match });
  });
  app.get("/api/user/feed", async (c) => {
    // Placeholder personalized feed using user videos
    return c.json({ feed: [] });
  });
  app.get("/api/auth/logout", (c) => {
    c.header("Set-Cookie", "session=; HttpOnly; Path=/; Max-Age=0");
    return c.redirect("/");
  });

  // Unified — searches ALL platforms at once
  app.get("/api/search", async (c) => {
    const q = c.req.query("q") || "";
    const result = await searchAllPlatforms(q, env, {
      youtube: searchYouTube,
      tiktok: searchTikTok,
      instagram: searchInstagram,
      twitter: searchTwitter,
    });
    // alias for legacy frontend: youtubeId, thumbnailUrl etc already in toUnified
    return c.json(result);
  });

  // Per-platform endpoints
  app.get("/api/search/youtube", async (c) => {
    const q = c.req.query("q") || "";
    const r = await searchYouTube(q, env.YOUTUBE_API_KEY);
    return c.json({ videos: r.videos, platform: "youtube", count: r.videos.length, isMock: r.isMock });
  });
  app.get("/api/search/tiktok", async (c) => {
    const q = c.req.query("q") || "";
    const r = await searchTikTok(q, env.TIKHUB_API_KEY || env.TIKTOK_API_KEY);
    return c.json({ videos: r.videos, platform: "tiktok", count: r.videos.length, isMock: r.isMock });
  });
  app.get("/api/search/instagram", async (c) => {
    const q = c.req.query("q") || "";
    const r = await searchInstagram(q, env.INSTAGRAM_ACCESS_TOKEN);
    return c.json({ videos: r.videos, platform: "instagram", count: r.videos.length, isMock: r.isMock });
  });
  app.get("/api/search/twitter", async (c) => {
    const q = c.req.query("q") || "";
    const r = await searchTwitter(q, env.TWITTER_BEARER_TOKEN);
    return c.json({ videos: r.videos, platform: "twitter", count: r.videos.length, isMock: r.isMock });
  });
  // Bonus: facebook
  app.get("/api/search/facebook", async (c) => {
    const q = (c.req.query("q") || "").toLowerCase();
    const vids = getMockFacebookCatalog().filter(v => !q || v.title.toLowerCase().includes(q) || v.channelName.toLowerCase().includes(q));
    return c.json({ videos: vids, platform: "facebook", count: vids.length, isMock: true });
  });

  // === PROMPT #5: AI FEATURES — Pro paywall ===
  function isPro(c, body) {
    const h = c.req.header("x-pro") || c.req.header("X-Pro") || c.req.query("pro") || "";
    if (h === "true" || h === "1" || h === "pro") return true;
    if (body && (body.pro === true || body.tier === "pro" || body.isPro === true)) return true;
    return false;
  }

  app.post("/api/clips/create", async (c) => {
    let body = {};
    try { body = await c.req.json(); } catch {}
    if (!isPro(c, body)) return c.json({ success: false, error: "Pro required", message: "AI Clip Maker is Pro-only. Upgrade to Pro.", upgradeUrl: "/pricing", paywall: true }, 402);
    const { videoUrl, videoId, prompt } = body;
    if (!videoUrl && !videoId) return c.json({ success: false, error: "videoUrl or videoId required" }, 400);
    try { const r = await createClip({ videoUrl, videoId, prompt, pro: true }); return c.json(r); } catch (e) { return c.json({ success: false, error: e.message }, 400); }
  });
  app.post("/api/thumbnail/enhance", async (c) => {
    let body = {};
    try { body = await c.req.json(); } catch {}
    if (!isPro(c, body)) return c.json({ success: false, error: "Pro required", message: "Thumbnail Enhancer is Pro-only. Upgrade to Pro.", upgradeUrl: "/pricing", paywall: true }, 402);
    const { thumbnailUrl, imageBase64, style } = body;
    if (!thumbnailUrl && !imageBase64) return c.json({ success: false, error: "thumbnailUrl or imageBase64 required" }, 400);
    try { const r = await enhanceThumbnail({ thumbnailUrl, imageBase64, style, pro: true }); return c.json(r); } catch (e) { return c.json({ success: false, error: e.message }, 400); }
  });
  app.post("/api/voice/translate", async (c) => {
    let body = {};
    try { body = await c.req.json(); } catch {}
    if (!isPro(c, body)) return c.json({ success: false, error: "Pro required", message: "Voice Translator is Pro-only. Upgrade to Pro.", upgradeUrl: "/pricing", paywall: true }, 402);
    const { videoUrl, videoId, targetLang, sourceLang } = body;
    if (!videoUrl && !videoId) return c.json({ success: false, error: "videoUrl or videoId required" }, 400);
    try { const r = await translateVoice({ videoUrl, videoId, targetLang, sourceLang, pro: true }); return c.json(r); } catch (e) { return c.json({ success: false, error: e.message }, 400); }
  });

  // === PROMPT #6: Marketplace (20% fee, Stripe) ===
  app.get("/api/marketplace/products", (c) => {
    const category = c.req.query("category");
    let products = backendProducts;
    if (category && category !== "all" && category !== "All") products = products.filter(p => p.category === category);
    const withFees = products.map(p => { const f = calculateFees(p.price); return { ...p, platformFee: f.platformFee, sellerRevenue: f.sellerRevenue, feeRate: 0.20 }; });
    return c.json({ products: withFees, count: withFees.length });
  });
  app.post("/api/marketplace/products", async (c) => {
    try {
      const body = await c.req.json();
      const product = createProduct(backendProducts, body);
      return c.json({ success: true, product, message: "Product listed successfully!" }, 201);
    } catch (e) { return c.json({ success: false, error: e.message }, 400); }
  });
  app.get("/api/marketplace/products/:id", (c) => {
    const id = c.req.param("id");
    const product = getProduct(backendProducts, id);
    if (!product) return c.json({ success: false, error: "Product not found" }, 404);
    const f = calculateFees(product.price);
    return c.json({ product: { ...product, platformFee: f.platformFee, sellerRevenue: f.sellerRevenue, feeRate: 0.20 } });
  });
  app.post("/api/marketplace/purchase", async (c) => {
    try {
      const body = await c.req.json();
      const product = getProduct(backendProducts, body.productId);
      if (!product) return c.json({ success: false, error: "Product not found" }, 404);
      await processPayment({ product, buyerEmail: body.buyerEmail });
      const result = purchaseProduct(backendProducts, backendSales, body.productId, body.buyerEmail || "buyer@alphatekx.ai");
      return c.json({ ...result, stripe: { testMode: true, card: "4242 •••• •••• 4242" } });
    } catch (e) { return c.json({ success: false, error: e.message }, 400); }
  });
  app.get("/api/marketplace/sales", (c) => {
    const sellerEmail = c.req.query("sellerEmail") || c.req.query("seller") || "";
    const sales = sellerEmail ? getSalesForSeller(backendSales, sellerEmail) : backendSales;
    const summary = getSalesSummary(backendSales, sellerEmail || undefined);
    return c.json({ sales, summary, count: sales.length });
  });
  // Legacy compat
  app.get("/api/marketplace", (c) => {
    const category = c.req.query("category");
    let products = backendProducts;
    if (category && category !== "all" && category !== "All") products = products.filter(p => p.category === category);
    return c.json({ products });
  });
  app.post("/api/marketplace/sell", async (c) => {
    try {
      const body = await c.req.json();
      const product = createProduct(backendProducts, body);
      return c.json({ success: true, product, message: "Product listed successfully!" });
    } catch (e) { return c.json({ success: false, error: e.message }, 400); }
  });
  app.post("/api/marketplace/checkout", async (c) => {
    const { productId, buyerEmail } = await c.req.json();
    const product = getProduct(backendProducts, productId);
    if (!product) return c.json({ success: false, error: "Product not found" }, 404);
    await processPayment({ product, buyerEmail });
    const result = purchaseProduct(backendProducts, backendSales, productId, buyerEmail || "buyer@alphatekx.ai");
    return c.json(result);
  });

  // === PROMPT #7: Real YouTube Channel — ALPHATEKX ===
  app.get("/api/channel", async (c) => {
    const info = await fetchChannelInfo(env.YOUTUBE_API_KEY || env.YOUTUBE_API_KEY);
    const channel = {
      id: info.id || OFFICIAL_CHANNEL_ID,
      name: info.snippet?.title || OFFICIAL_CHANNEL_NAME,
      handle: info.snippet?.customUrl || OFFICIAL_CHANNEL_HANDLE,
      avatar: info.snippet?.thumbnails?.high?.url || info.snippet?.thumbnails?.default?.url || `https://img.youtube.com/vi/jvXEkm27XOE/hqdefault.jpg`,
      banner: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80`,
      subscribers: info.statistics?.subscriberCount ? `${Number(info.statistics.subscriberCount).toLocaleString()}` : "3,020",
      subscribersCount: Number(info.statistics?.subscriberCount || 3020),
      verified: true,
      description: info.snippet?.description || `Official ${OFFICIAL_CHANNEL_NAME} — AI avatars 🇳🇬 | ${OFFICIAL_CHANNEL_HANDLE}`,
      joinedAt: info.snippet?.publishedAt ? new Date(info.snippet.publishedAt).getFullYear().toString() : "2022",
      email: "alphatekxcompany@gmail.com",
      website: "https://alphatekx.name.ng",
      url: `https://www.youtube.com/channel/${OFFICIAL_CHANNEL_ID}`,
      raw: info,
    };
    return c.json({ channel, info, statistics: info.statistics, snippet: info.snippet });
  });
  app.get("/api/channel/videos", async (c) => {
    const max = Number(c.req.query("max") || "50");
    const videos = await fetchChannelVideos(env.YOUTUBE_API_KEY || env.YOUTUBE_API_KEY, Math.min(max, 50));
    return c.json({ videos, count: videos.length, channelId: OFFICIAL_CHANNEL_ID, channelHandle: OFFICIAL_CHANNEL_HANDLE });
  });
  app.get("/api/video/:id", async (c) => {
    const id = c.req.param("id");
    if (!id || id.startsWith("mock")) return c.json({ error: "Mock ID" }, 400);
    const apiKey = env.YOUTUBE_API_KEY;
    if (!apiKey) return c.json({ error: "No API key" }, 400);
    try {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${encodeURIComponent(id)}&key=${apiKey}`);
      if (!res.ok) throw new Error(`YouTube ${res.status}`);
      const data = await res.json();
      if (!data.items || data.items.length === 0) throw new Error("Not found");
      const v = data.items[0];
      return c.json({ video: { id: v.id, title: v.snippet.title, channel: v.snippet.channelTitle, channelId: v.snippet.channelId, thumbnail: v.snippet.thumbnails?.high?.url, views: v.statistics.viewCount, likes: v.statistics.likeCount, likeCount: Number(v.statistics.likeCount||0), comments: v.statistics.commentCount, duration: v.contentDetails.duration, statistics: v.statistics, snippet: v.snippet } });
    } catch (e) { return c.json({ error: e.message }, 500); }
  });

  return app;
}

// For direct node usage (Cloudflare Worker will import src/index.ts instead)
const app = createApiApp(process.env);
export default app;
