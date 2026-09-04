import { DurableObject } from "cloudflare:workers";
import { Hono } from "hono";
import { searchYouTube as libSearchYouTube } from "./lib/youtube.js";
import { searchTikTok as libSearchTikTok } from "./lib/tiktok.js";
import { searchInstagram as libSearchInstagram } from "./lib/instagram.js";
import { searchTwitter as libSearchTwitter } from "./lib/twitter.js";
import { aggregateResults as libAggregate, getMockFacebookCatalog } from "./lib/aggregator.js";
import { createClip as libCreateClip } from "./lib/clipMaker.js";
import { enhanceThumbnail as libEnhanceThumbnail } from "./lib/thumbnailEnhancer.js";
import { translateVoice as libTranslateVoice } from "./lib/voiceTranslator.js";
import { calculateFees as libCalcFees, createProduct as libCreateProduct, getProduct as libGetProduct, purchaseProduct as libPurchaseProduct, getSalesForSeller as libGetSales, getSalesSummary as libSalesSummary } from "./lib/marketplace.js";
import { processPayment as libStripePay, createCheckoutSession as libStripeCheckout } from "./lib/stripe.js";
import { fetchChannelInfo as libFetchChannelInfo, fetchChannelVideos as libFetchChannelVideos, CHANNEL_ID as OFFICIAL_CHANNEL_ID, CHANNEL_NAME as OFFICIAL_CHANNEL_NAME, CHANNEL_HANDLE as OFFICIAL_CHANNEL_HANDLE } from "./lib/channel.js";

interface Env {
  DB?: D1Database;
  KV?: KVNamespace;
  ALPHATEKX_KV?: KVNamespace;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  SESSION_SECRET?: string;
  GOOGLE_REDIRECT_URI?: string;
  YOUTUBE_API_KEY?: string;
  YOUTUBE_WEB_KEY?: string;
  YOUTUBE_DATA_API_KEY?: string;
  TIKHUB_API_KEY?: string;
  TIKTOK_API_KEY?: string;
  INSTAGRAM_ACCESS_TOKEN?: string;
  TWITTER_BEARER_TOKEN?: string;
  FACEBOOK_ACCESS_TOKEN?: string;
  STRIPE_SECRET_KEY?: string;
  PAYSTACK_SECRET_KEY?: string;
  PAYSTACK_PUBLIC_KEY?: string;
  PAYSTACK_CURRENCY?: string;
  PAYSTACK_PLAN_CURRENCY?: string;
  PAYSTACK_MONTHLY_AMOUNT?: string;
  PAYSTACK_LITE_AMOUNT?: string;
  PAYSTACK_YEARLY_AMOUNT?: string;
  PAYSTACK_PLAN_MONTHLY?: string;
  PAYSTACK_PLAN_YEARLY?: string;
  GROQ_API_KEY?: string;
  GROQ_MODEL?: string;
}

function parseIsoDuration(iso?: string): string {
  if (!iso) return "15:00";
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "10:00";
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;
  const secStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
  if (hours > 0) {
    const minStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hours}:${minStr}:${secStr}`;
  }
  return `${minutes}:${secStr}`;
}

function formatViews(viewCount?: string): string {
  if (!viewCount) return "100K views";
  const count = parseInt(viewCount);
  if (isNaN(count)) return "100K views";
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M views`;
  if (count >= 1000) return `${Math.round(count / 1000)}K views`;
  return `${count} views`;
}
function formatCount(value?: string, suffix = ""): string {
  if (!value) return `0 ${suffix}`.trim();
  const count = Number(value);
  if (!Number.isFinite(count)) return `0 ${suffix}`.trim();
  const formatted = count >= 1000000 ? `${(count / 1000000).toFixed(1)}M` : count >= 1000 ? `${Math.round(count / 1000)}K` : String(count);
  return `${formatted} ${suffix}`.trim();
}

function isoDurationSeconds(iso?: string): number {
  const match = String(iso || "").match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return Infinity;
  return Number(match[1] || 0) * 3600 + Number(match[2] || 0) * 60 + Number(match[3] || 0);
}

function extractInnerTubeEngagement(data: any) {
  let likes = "";
  let comments = "";
  let channelAvatar = "";
  const commentItems: any[] = [];
  const visit = (value: any) => {
    if (!value || typeof value !== "object") return;
    const owner = value.videoOwnerRenderer;
    if (owner?.thumbnail?.thumbnails?.length) channelAvatar = owner.thumbnail.thumbnails.at(-1)?.url || channelAvatar;
    const actionText = value.videoActionButtonRenderer?.text?.simpleText
      || value.toggleButtonRenderer?.defaultText?.simpleText
      || value.toggleButtonRenderer?.defaultText?.runs?.map((run: any) => run.text).join("");
    if (actionText && !likes && /\d/.test(actionText)) likes = actionText;
    const commentHeader = value.commentsEntryPointHeaderRenderer?.commentCount;
    if (commentHeader && !comments) comments = commentHeader.simpleText || commentHeader.runs?.map((run: any) => run.text).join("") || "";
    const comment = value.commentRenderer;
    if (comment?.commentId && (comment.contentText?.runs || comment.contentText?.simpleText)) {
      commentItems.push({
        id: comment.commentId,
        author: comment.authorText?.simpleText || comment.authorText?.runs?.map((run: any) => run.text).join("") || "YouTube user",
        authorPhoto: comment.authorThumbnail?.thumbnails?.at(-1)?.url || "",
        text: comment.contentText?.simpleText || comment.contentText?.runs?.map((run: any) => run.text).join("") || "",
        likeCount: Number(comment.voteCount?.simpleText || 0) || 0,
        publishedAt: comment.publishedTimeText?.runs?.map((run: any) => run.text).join("") || "",
      });
    }
    for (const child of Object.values(value)) visit(child);
  };
  visit(data);
  return { likes, comments, channelAvatar, commentItems };
}

function parseInnerTubeChannelVideos(data: any, channelId: string) {
  const videos: any[] = [];
  const continuationTokens: string[] = [];
  const visit = (value: any) => {
    if (!value || typeof value !== "object") return;
    if (value.videoRenderer?.videoId) {
      const item = value.videoRenderer;
      const id = item.videoId;
      videos.push({
        id, youtubeId: id, source: "youtube", platform: "youtube", channelId,
        title: item.title?.runs?.map((run: any) => run.text).join("") || item.title?.simpleText || "",
        channelName: item.ownerText?.runs?.map((run: any) => run.text).join("") || "",
        thumbnailUrl: item.thumbnail?.thumbnails?.at(-1)?.url || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        views: item.viewCountText?.simpleText || item.viewCountText?.runs?.map((run: any) => run.text).join("") || "",
        duration: item.lengthText?.simpleText || "",
        publishedAt: item.publishedTimeText?.simpleText || "",
      });
    }
    if (value.lockupViewModel?.contentId && /^[A-Za-z0-9_-]{11}$/.test(value.lockupViewModel.contentId)) {
      const item = value.lockupViewModel;
      const metadata = item.metadata?.lockupMetadataViewModel || {};
      const title = metadata.title?.content || metadata.title?.runs?.map((run: any) => run.text).join("") || "";
      const thumbnail = item.contentImage?.thumbnailViewModel?.image?.sources?.at(-1)?.url
        || item.contentImage?.thumbnailViewModel?.image?.sources?.at(-1)?.src
        || `https://i.ytimg.com/vi/${item.contentId}/hqdefault.jpg`;
      videos.push({
        id: item.contentId, youtubeId: item.contentId, source: "youtube", platform: "youtube", channelId,
        title, channelName: "", thumbnailUrl: thumbnail, views: "", duration: "", publishedAt: "",
      });
    }

    const continuation = value.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token;
    if (continuation) continuationTokens.push(continuation);
    for (const child of Object.values(value)) visit(child);
  };
  visit(data);
  const unique = Array.from(new Map(videos.map(video => [video.youtubeId, video])).values());
  return {
    videos: unique.slice(0, 30),
    nextToken: continuationTokens[continuationTokens.length - 1] || "",
    continuationTokens,
  };
}

function youtubeBrowseUrl(key: string) {
  return key
    ? `https://www.youtube.com/youtubei/v1/browse?key=${encodeURIComponent(key)}`
    : "https://www.youtube.com/youtubei/v1/browse?prettyPrint=false";
}

async function browseChannelTab(c: any, params: string, kind: string) {
  try {
    const body: any = await c.req.json().catch(() => ({}));
    const channelId = String(body.channelId || "").trim();
    const continuationToken = String(body.continuationToken || "").trim();
    const key = (c.env as Env).YOUTUBE_WEB_KEY || (c.env as Env).YOUTUBE_API_KEY;
    if (!channelId) return c.json({ success: false, error: "CHANNEL_ID_REQUIRED" }, 400);
    const payload = continuationToken
      ? { context: { client: { clientName: "WEB", clientVersion: "2.20240301" } }, continuation: continuationToken }
      : { context: { client: { clientName: "WEB", clientVersion: "2.20240301" } }, browseId: channelId, params: decodeURIComponent(params) };
    let response = await fetch(youtubeBrowseUrl(key), {
      method: "POST", headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" }, body: JSON.stringify(payload),
    });
    if (!response.ok && !continuationToken) {
      response = await fetch(youtubeBrowseUrl(""), {
        method: "POST", headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" }, body: JSON.stringify(payload),
      });
    }
    if (!response.ok) return c.json({ success: false, error: "YOUTUBE_CHANNEL_FAILED" }, 502);
    const parsed = parseInnerTubeChannelVideos(await response.json(), channelId);
    return c.json({ success: true, channelId, kind, videos: parsed.videos, nextToken: parsed.nextToken });
  } catch (error: any) {
    console.error(`[channel/${kind}]`, error);
    return c.json({ success: false, error: "YOUTUBE_CHANNEL_FAILED" }, 502);
  }
}

async function fetchYoutubeRssVideos(channelId: string, limit = 50): Promise<any[]> {
  const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!response.ok) throw new Error(`YouTube RSS ${response.status}`);
  const xml = await response.text();
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((match) => match[1]);
  const read = (entry: string, tag: string) => entry.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`))?.[1]
    ?.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim() || "";
  return entries.slice(0, limit).map((entry) => {
    const id = read(entry, "yt:videoId");
    const title = read(entry, "title");
    const publishedAt = read(entry, "published");
    const description = read(entry, "media:description");
    return {
      id, youtubeId: id, title, channelId, channelName: read(entry, "name") || OFFICIAL_CHANNEL_NAME,
      thumbnailUrl: id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "",
      description, publishedAt, views: "Live YouTube", source: "youtube", platform: "youtube",
      duration: "", isShort: /#shorts?\b|\bshort\b/i.test(`${title} ${description}`),
    };
  }).filter((video) => /^[A-Za-z0-9_-]{11}$/.test(video.youtubeId));
}

async function fetchYoutubeSectionVideos(channelId: string, section: "shorts" | "videos", limit = 50): Promise<any[]> {
  const response = await fetch(`https://www.youtube.com/channel/${encodeURIComponent(channelId)}/${section}`, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!response.ok) throw new Error(`YouTube ${section} page ${response.status}`);
  const html = await response.text();
  const ids = [...html.matchAll(/"videoId":"([A-Za-z0-9_-]{11})"/g)].map((match) => match[1]);
  const uniqueIds = [...new Set(ids)].slice(0, limit);
  const rss = await fetchYoutubeRssVideos(channelId, 50).catch(() => []);
  const byId = new Map(rss.map((video) => [video.youtubeId, video]));
  return uniqueIds.map((id) => ({
    ...(byId.get(id) || {}),
    id, youtubeId: id, channelId, channelName: OFFICIAL_CHANNEL_NAME,
    title: byId.get(id)?.title || (section === "shorts" ? "YouTube Short" : "YouTube video"),
    thumbnailUrl: byId.get(id)?.thumbnailUrl || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    duration: byId.get(id)?.duration || "",
    isShort: section === "shorts",
    source: "youtube", platform: "youtube",
  }));
}

async function searchYouTubeInnerTube(c: any, query: string) {
  const env = c.env as Env;
  const cacheKey = `yt:search:${query.trim().toLowerCase()}`;
  if (env.KV) {
    const cached = await env.KV.get(cacheKey, "json").catch(() => null);
    if (Array.isArray(cached)) return cached;
  }
  const webKey = env.YOUTUBE_WEB_KEY || env.YOUTUBE_API_KEY;
  let results: any[] = [];
  {
    const searchUrl = webKey
      ? `https://www.youtube.com/youtubei/v1/search?key=${encodeURIComponent(webKey)}`
      : "https://www.youtube.com/youtubei/v1/search?prettyPrint=false";
    const response = await fetch(searchUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" },
      body: JSON.stringify({ context: { client: { clientName: "WEB", clientVersion: "2.20240301" } }, query }),
    });
    if (response.ok) {
      const data: any = await response.json().catch(() => ({}));
      const contents = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];
      results = contents.flatMap((section: any) => section.itemSectionRenderer?.contents || []).map((item: any) => {
        const renderer = item.videoRenderer;
        if (!renderer?.videoId) return null;
        return {
          id: renderer.videoId, youtubeId: renderer.videoId, title: renderer.title?.runs?.map((run: any) => run.text).join("") || "",
          channelName: renderer.ownerText?.runs?.[0]?.text || "YouTube Creator",
          thumbnailUrl: renderer.thumbnail?.thumbnails?.at(-1)?.url || `https://i.ytimg.com/vi/${renderer.videoId}/hqdefault.jpg`,
          views: renderer.viewCountText?.simpleText || renderer.viewCountText?.runs?.map((run: any) => run.text).join("") || "",
          duration: renderer.lengthText?.simpleText || "", source: "youtube", platform: "youtube",
        };
      }).filter(Boolean).slice(0, 20);
    }
  }
  const dataApiKey = env.YOUTUBE_DATA_API_KEY || env.YOUTUBE_API_KEY;
  if (!results.length && dataApiKey) {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=20&q=${encodeURIComponent(query)}&key=${encodeURIComponent(dataApiKey)}`);
    if (response.ok) {
      const data: any = await response.json().catch(() => ({}));
      results = (data.items || []).map((item: any) => ({
        id: item.id?.videoId, youtubeId: item.id?.videoId, title: item.snippet?.title || "",
        channelName: item.snippet?.channelTitle || "YouTube Creator", channelId: item.snippet?.channelId || "",
        thumbnailUrl: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || "",
        description: item.snippet?.description || "", source: "youtube", platform: "youtube",
      })).filter((item: any) => item.youtubeId);
    }
  }
  if (env.KV && results.length) await env.KV.put(cacheKey, JSON.stringify(results), { expirationTtl: 7200 }).catch(() => {});
  return results;
}

async function fetchOfficialShorts(apiKey: string | undefined, limit: number, searchPage = 0, context: any = null): Promise<any[]> {
  if (apiKey) {
    const channelVideos = await libFetchChannelVideos(apiKey, 50).catch(() => []);
    const shorts = channelVideos.filter((video: any) => {
      const parts = String(video.duration || "").split(":").map(Number);
      const seconds = parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : parts.length === 2 ? parts[0] * 60 + parts[1] : NaN;
      return Number.isFinite(seconds) && seconds > 0 && seconds <= 180;
    }).map((video: any) => ({ ...video, isShort: true }));
    if (shorts.length) return shorts.slice(0, limit);
  }
  const queries = ["#shorts", "AI shorts", "tech shorts", "funny shorts", "music shorts", "football shorts", "gaming shorts", "science shorts", "food shorts", "travel shorts"];
  const videos: any[] = [];
  const query = queries[searchPage % queries.length];
  for (const result of await searchYouTubeInnerTube(context || { env: {} }, query).catch(() => [])) {
    videos.push({ ...result, isShort: true, category: "Shorts" });
    if (videos.length >= limit) break;
  }
  return videos.slice(0, limit);
}

async function refreshAdStatuses(db: D1Database, now = Date.now()) {
  await db.batch([
    db.prepare("UPDATE ads_queue SET status = 'active', started_at = COALESCE(started_at, ?) WHERE status = 'scheduled' AND scheduled_at <= ? AND (ended_at IS NULL OR ended_at > ?)")
      .bind(now, now, now),
    db.prepare("UPDATE ads_queue SET status = 'completed', ended_at = COALESCE(ended_at, ?) WHERE status IN ('scheduled', 'active') AND ended_at IS NOT NULL AND ended_at <= ?")
      .bind(now, now),
    db.prepare("UPDATE ads_campaigns SET status = 'active', start_at = COALESCE(start_at, ?), updated_at = ? WHERE status = 'scheduled' AND start_at IS NOT NULL AND start_at <= ? AND (end_at IS NULL OR end_at > ?)")
      .bind(now, now, now, now),
    db.prepare("UPDATE ads_campaigns SET status = 'completed', updated_at = ? WHERE status IN ('scheduled', 'active') AND end_at IS NOT NULL AND end_at <= ?")
      .bind(now, now),
  ]);
}

async function clearCurrentAdsCache(env: Env) {
  if (env.KV) await env.KV.delete("ads:current").catch(() => {});
}

async function getCurrentAds(db: D1Database, env: Env, now = Date.now()): Promise<any[]> {
  if (env.KV) {
    const cached = await env.KV.get("ads:current", "json").catch(() => null);
    if (Array.isArray(cached)) return cached;
  }
  const result: any = await db.prepare(
    "SELECT * FROM ads_campaigns WHERE status = 'active' AND start_at <= ? AND end_at > ? ORDER BY start_at ASC, created_at ASC LIMIT 3"
  ).bind(now, now).all();
  const campaigns = result.results || [];
  if (env.KV) await env.KV.put("ads:current", JSON.stringify(campaigns), { expirationTtl: 60 }).catch(() => {});
  return campaigns;
}

async function activateOrQueueAd(db: D1Database, campaign: any, reference: string, userId?: string) {
  const now = Date.now();
  const last: any = await db.prepare(
    "SELECT MAX(end_at) AS last_end_at FROM ads_campaigns WHERE status IN ('active', 'scheduled') AND end_at > ?"
  ).bind(now).first();
  const lastEndAt = Number(last?.last_end_at || 0);
  const startAt = lastEndAt > now ? lastEndAt + 60000 : now;
  const endAt = startAt + Number(campaign.days) * 86400000;
  const status = startAt <= now ? "active" : "scheduled";
  const where = userId ? " WHERE id = ? AND user_id = ?" : " WHERE id = ?";
  const binds = userId ? [status, reference, startAt, endAt, now, campaign.id, userId] : [status, reference, startAt, endAt, now, campaign.id];
  await db.batch([
    db.prepare(`UPDATE ads_campaigns SET status = ?, paystack_reference = ?, start_at = ?, end_at = ?, updated_at = ?${where}`)
      .bind(...binds),
    db.prepare("INSERT OR IGNORE INTO ads_queue (id, campaign_id, scheduled_at, started_at, ended_at, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .bind(crypto.randomUUID(), campaign.id, startAt, status === "active" ? now : null, endAt, status, now),
  ]);
  return { status, startAt, endAt };
}

// In-memory mock storage fallback when Durable Object SQL storage is unavailable
let inMemoryMessages = [
  { id: 1, videoId: 'dQw4w9WgXcQ', channel: 'general', userName: 'dev_nina', avatarInitials: 'N', message: 'This explanation at 8:15 finally made backprop click — thank you! 🔥', timestampInVideo: '8:15', likes: 14, createdAt: Date.now() - 120000 },
  { id: 2, videoId: 'dQw4w9WgXcQ', channel: 'general', userName: 'ml_learner', avatarInitials: 'M', message: 'Would love a follow-up on CNNs & Attention mechanisms next. Super clear!', timestampInVideo: '12:30', likes: 9, createdAt: Date.now() - 60000 },
  { id: 3, videoId: 'dQw4w9WgXcQ', channel: 'builders', userName: 'tech_guru', avatarInitials: 'T', message: 'Are you guys using PyTorch 2.0 compile mode or raw CUDA kernels for this demo?', timestampInVideo: '2:15', likes: 5, createdAt: Date.now() - 30000 },
  { id: 4, videoId: 'dQw4w9WgXcQ', channel: 'marketplace', userName: 'ai_builder', avatarInitials: 'A', message: 'Bought the AI Neural Net Model Pack from the watch card! Worth every cent 🚀', timestampInVideo: '', likes: 8, createdAt: Date.now() - 10000 }
];

let inMemoryProducts = [
  { id: 1, name: 'AI Neural Net Model Pack', description: 'Pre-trained PyTorch checkpoint & CUDA optimized dataset for vision + NLP models.', price: 2500, badge: 'BESTSELLER', iconType: 'cpu', sellerEmail: 'dev@alphatekx.ai', fileUrl: 'https://github.com/alphatekx/model-pack.zip', salesCount: 342, category: 'app', tags: 'python,pytorch,ai', relatedTopic: 'neural-networks', createdAt: Date.now() },
  { id: 2, name: 'Stream Platform Course Bundle', description: 'Complete 6-hour hands-on video masterclass with source code & verified certificate.', price: 8000, badge: 'HOT', iconType: 'video', sellerEmail: 'academy@alphatekx.ai', fileUrl: 'https://alphatekx.ai/course-bundle.zip', salesCount: 189, category: 'course', tags: 'react,streaming,ai', relatedTopic: 'streaming', createdAt: Date.now() },
  { id: 3, name: 'Naija AI Speech Translator Engine', description: 'Low-latency Pidgin, Yoruba, Igbo & Hausa TTS & STT API wrapper plugin for web apps.', price: 5000, badge: 'NEW', iconType: 'sparkles', sellerEmail: 'nigeria-ai@alphatekx.ai', fileUrl: 'https://github.com/alphatekx/naija-tts.zip', salesCount: 95, category: 'plugin', tags: 'pidgin,translation,audio', relatedTopic: 'translation', createdAt: Date.now() },
  { id: 4, name: 'TikTok & YouTube Unified Queue SDK', description: 'JavaScript library to sync queue states & embeds between YouTube & TikTok players.', price: 2500, badge: 'PRO', iconType: 'layers', sellerEmail: 'sdk@alphatekx.ai', fileUrl: 'https://github.com/alphatekx/queue-sdk.zip', salesCount: 521, category: 'plugin', tags: 'queue,tiktok,youtube', relatedTopic: 'queue', createdAt: Date.now() }
];

// PROMPT #6: Marketplace Sales store — tracks purchases with 20% fee
export let inMemorySales: Array<any> = [];
export const inMemoryStudioTemplates = [
  { id: "avatar-generator", name: "Avatar Generator", description: "Build an AI avatar generator interface.", code: "<div class='app'><h1>Avatar Generator</h1><input placeholder='Upload a photo' type='file'><button>Generate Avatar</button></div>" },
  { id: "video-summarizer", name: "Video Summarizer", description: "Summarize a video with a clean reading view.", code: "<div class='app'><h1>Video Summarizer</h1><textarea placeholder='Paste a video URL'></textarea><button>Summarize</button><pre id='summary'>Your summary appears here.</pre></div>" },
  { id: "quiz-builder", name: "Quiz Builder", description: "Create an interactive quiz from learning content.", code: "<div class='app'><h1>Quiz Builder</h1><p>What did you learn?</p><button onclick='this.textContent=\"Correct!\"'>Answer quiz</button></div>" },
  { id: "landing-page", name: "Product Landing Page", description: "Launch a polished product landing page.", code: "<div class='app'><h1>Build something people love</h1><p>A focused landing page for your next idea.</p><button>Get started</button></div>" },
  { id: "chat-assistant", name: "Chat Assistant", description: "Start with a conversational assistant UI.", code: "<div class='app'><h1>Chat Assistant</h1><input placeholder='Ask a question'><button>Send</button></div>" },
  { id: "expense-tracker", name: "Expense Tracker", description: "Track spending in a simple dashboard.", code: "<div class='app'><h1>Expense Tracker</h1><input placeholder='Expense amount' type='number'><button>Add expense</button></div>" },
  { id: "course-dashboard", name: "Course Dashboard", description: "Organize lessons and progress.", code: "<div class='app'><h1>My Course</h1><progress value='35' max='100'></progress><p>35% complete</p></div>" },
  { id: "portfolio", name: "Creator Portfolio", description: "Showcase work and skills.", code: "<div class='app'><h1>Creator Portfolio</h1><p>Selected projects and experiments.</p></div>" },
  { id: "link-in-bio", name: "Link in Bio", description: "Collect important links in one place.", code: "<div class='app'><h1>@creator</h1><a href='#'>My latest project</a><a href='#'>Contact me</a></div>" },
  { id: "data-dashboard", name: "Data Dashboard", description: "Present key metrics clearly.", code: "<div class='app'><h1>Metrics</h1><div><strong>1,248</strong><span> visitors this week</span></div></div>" },
];

let inMemoryQueue = [
  { id: 1, userEmail: 'user@alphatekx.com', platform: 'youtube', videoId: 'dQw4w9WgXcQ', title: 'How to Build Neural Networks from Scratch | Full AI Tutorial', thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80', duration: '22:45', position: 0, isPlayed: 0, createdAt: Date.now() },
  { id: 2, userEmail: 'user@alphatekx.com', platform: 'tiktok', videoId: '7123456789', title: 'Fastest way to deploy WebAssembly to Cloudflare Workers in 60s ⚡', thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80', duration: '0:58', position: 1, isPlayed: 0, createdAt: Date.now() },
  { id: 3, userEmail: 'user@alphatekx.com', platform: 'youtube', videoId: 'L_LUpnjgPso', title: 'Building Real-time AI Voice Agents with WebSockets & Edge Computing', thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80', duration: '15:10', position: 2, isPlayed: 0, createdAt: Date.now() }
];

// === NEW: Channel / Upload / Profile / Categories Stores (preserve existing design) ===
export const inMemoryCategories = [
  "All",
  "Neural Networks",
  "PyTorch",
  "AI Superpowers",
  "Cloudflare Workers",
  "Naija Dialects",
  "Music",
  "Education",
  "Gaming",
  "Comedy",
  "Tech"
];

export let inMemoryProfile = {
  id: "guest_1",
  name: "Guest",
  handle: "@guest",
  email: "guest@alphatekx.stream",
  avatar: "https://ui-avatars.com/api/?name=Guest&background=0B0215&color=FFD700&size=200&bold=true",
  banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
  bio: "Browsing as Guest — sign up coming soon. Your history is saved locally.",
  subscribers: "0",
  subscribersCount: 0,
  verified: false,
  joinedAt: Date.now(),
  isGuest: true,
};

export const inMemoryChannels: Record<string, any> = {
  "codecraft": {
    id: "codecraft",
    name: "CodeCraft Academy",
    handle: "@codecraft",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
    subscribers: "1.2M",
    subscribersCount: 1200000,
    verified: true,
    description: "Master AI, PyTorch & Neural Networks from scratch. Weekly deep dives with code.",
    joinedAt: "Jan 2020"
  },
  "edge-ai-lab": {
    id: "edge-ai-lab",
    name: "Edge AI Lab",
    handle: "@edgeailab",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    banner: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80",
    subscribers: "890K",
    subscribersCount: 890000,
    verified: true,
    description: "Low-latency voice agents & edge GPU streaming. Real-time AI demos.",
    joinedAt: "Mar 2021"
  },
  "serverless-pro": {
    id: "serverless-pro",
    name: "Serverless Pro",
    handle: "@serverlesspro",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    banner: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80",
    subscribers: "640K",
    subscribersCount: 640000,
    verified: false,
    description: "Cloudflare Workers, Durable Objects & edge SQLite mastery.",
    joinedAt: "Jun 2021"
  },
  "ai-hardware-hub": {
    id: "ai-hardware-hub",
    name: "AI Hardware Hub",
    handle: "@aihardware",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80",
    banner: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
    subscribers: "1.5M",
    subscribersCount: 1500000,
    verified: true,
    description: "vLLM, Triton kernels & sub-100ms LLM inference hacks.",
    joinedAt: "Feb 2019"
  },
  "naija-tech-hub": {
    id: "naija-tech-hub",
    name: "Naija Tech Hub",
    handle: "@naijatech",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    banner: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?auto=format&fit=crop&w=1000&q=80",
    subscribers: "420K",
    subscribersCount: 420000,
    verified: true,
    description: "Pidgin, Yoruba, Igbo & Hausa AI. Naija AI for global builders 🇳🇬.",
    joinedAt: "Aug 2022"
  },
  // PROMPT #7: Official ALPHATEKX channel — real YouTube connection
  "UCGm89Z31SYxEU9PEQ-p3cNA": {
    id: "UCGm89Z31SYxEU9PEQ-p3cNA",
    name: "ALPHATEKX",
    handle: "@risewithalphatekx",
    avatar: "https://img.youtube.com/vi/jvXEkm27XOE/hqdefault.jpg",
    banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
    subscribers: "3,020",
    subscribersCount: 3020,
    verified: true,
    description: "Official ALPHATEKX — AI avatars that beat HeyGen 10x, automation, Naija tech 🇳🇬 | Channel ID UCGm89Z31SYxEU9PEQ-p3cNA | 41 videos | alphatekx.name.ng | alphatekxcompany@gmail.com",
    joinedAt: "2022",
    email: "alphatekxcompany@gmail.com",
    website: "https://alphatekx.name.ng",
    url: "https://www.youtube.com/channel/UCGm89Z31SYxEU9PEQ-p3cNA",
    videoCount: 41,
  },
  "alphatekx": {
    id: "UCGm89Z31SYxEU9PEQ-p3cNA",
    name: "ALPHATEKX",
    handle: "@risewithalphatekx",
    avatar: "https://img.youtube.com/vi/jvXEkm27XOE/hqdefault.jpg",
    banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
    subscribers: "3,020",
    subscribersCount: 3020,
    verified: true,
    description: "Official ALPHATEKX — AI avatars that beat HeyGen 10x | 41 videos | @risewithalphatekx",
    joinedAt: "2022",
    email: "alphatekxcompany@gmail.com",
    website: "https://alphatekx.name.ng",
    url: "https://www.youtube.com/channel/UCGm89Z31SYxEU9PEQ-p3cNA",
    videoCount: 41,
  },
  "risewithalphatekx": {
    id: "UCGm89Z31SYxEU9PEQ-p3cNA",
    name: "ALPHATEKX",
    handle: "@risewithalphatekx",
    avatar: "https://img.youtube.com/vi/jvXEkm27XOE/hqdefault.jpg",
    banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
    subscribers: "3,020",
    subscribersCount: 3020,
    verified: true,
    description: "Official ALPHATEKX",
    joinedAt: "2022",
    email: "alphatekxcompany@gmail.com",
    website: "https://alphatekx.name.ng",
    url: "https://www.youtube.com/channel/UCGm89Z31SYxEU9PEQ-p3cNA",
    videoCount: 41,
  }
};

function slugifyChannel(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function resolveChannelById(id: string) {
  const key = id.toLowerCase();
  if (inMemoryChannels[key]) return inMemoryChannels[key];
  // try slugify lookup by name
  for (const ch of Object.values(inMemoryChannels)) {
    if (slugifyChannel(ch.name) === key || ch.handle.replace("@","").toLowerCase() === key) return ch;
  }
  // fallback: generate channel shell from id
  const pretty = id.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  return {
    id: key,
    name: pretty,
    handle: `@${key}`,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(pretty)}&background=00D9FF&color=000&size=200`,
    banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
    subscribers: "12K",
    subscribersCount: 12000,
    verified: false,
    description: `Welcome to ${pretty}'s channel on Alphatekx Stream.`,
    joinedAt: "2024"
  };
}

export let inMemoryUploads: Array<any> = [
  // seed uploads mapped to channels so channel pages are not empty on first load
  { id: "upload_1", youtubeId: "dQw4w9WgXcQ", title: "How to Build Neural Networks from Scratch | Full AI Tutorial 2024", channelId: "codecraft", channelName: "CodeCraft Academy", thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80", views: "340K views", duration: "22:45", category: "Neural Networks", createdAt: Date.now() - 100000000, description: "Full tutorial on neural nets.", platform: "youtube" },
  { id: "upload_2", youtubeId: "L_LUpnjgPso", title: "Building Real-time AI Voice Agents with WebSockets & Edge GPUs", channelId: "edge-ai-lab", channelName: "Edge AI Lab", thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80", views: "185K views", duration: "15:10", category: "Cloudflare Workers", createdAt: Date.now() - 80000000, description: "Low latency voice agents.", platform: "youtube" },
  { id: "upload_3", youtubeId: "M576WGiDBdQ", title: "Cloudflare Workers & SQLite Durable Objects Masterclass", channelId: "serverless-pro", channelName: "Serverless Pro", thumbnailUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80", views: "92K views", duration: "18:30", category: "Cloudflare Workers", createdAt: Date.now() - 60000000, description: "Masterclass on Workers.", platform: "youtube" },
];

// === UNIFIED AGGREGATOR: YouTube + TikTok + Instagram + Twitter + Facebook ===
// Preserve existing dark neon design: platform badges use distinct colors but stay glassmorphism
export const platformMeta: Record<string, { label: string; badge: string; color: string; bg: string }> = {
  youtube:   { label: "YouTube",   badge: "YT", color: "#FF0000", bg: "rgba(255,0,0,0.9)" },
  tiktok:    { label: "TikTok",    badge: "TT", color: "#FFFFFF", bg: "rgba(0,0,0,0.9)" },
  instagram: { label: "Instagram", badge: "IG", color: "#E1306C", bg: "rgba(225,48,108,0.9)" },
  twitter:   { label: "Twitter",   badge: "X",  color: "#1DA1F2", bg: "rgba(29,161,242,0.9)" },
  facebook:  { label: "Facebook",  badge: "FB", color: "#1877F2", bg: "rgba(24,119,242,0.9)" },
};

export let inMemoryWatchLater: Array<any> = [];

function makePlatformCatalogs() {
  return {
    youtube: [
      { platform: "youtube", youtubeId: "dQw4w9WgXcQ", title: "Featured YouTube video", channelName: "YouTube Creator", thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg", views: "Featured", duration: "3:32", category: "Music" },
      { platform: "youtube", youtubeId: "9bZkp7q19f0", title: "Trending YouTube video", channelName: "YouTube Creator", thumbnailUrl: "https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg", views: "Featured", duration: "4:13", category: "Music" },
      { platform: "youtube", youtubeId: "kJQP7kiw5Fk", title: "Popular YouTube video", channelName: "YouTube Creator", thumbnailUrl: "https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg", views: "Featured", duration: "4:27", category: "Music" },
    ],
    tiktok: [
      { platform: "tiktok", youtubeId: "tt_001", platformId: "719001001", title: "POV: You shaved 500ms off cold start ⚡ #Cloudflare #Workers", channelName: "@tiktokbuilds", handle: "@tiktokbuilds", thumbnailUrl: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=600&q=80", views: "2.1M views", duration: "0:47", category: "Tech" },
      { platform: "tiktok", youtubeId: "tt_002", platformId: "719001002", title: "Naija street food + AI caption sync 🇳🇬 #fyp", channelName: "@naija_eats", handle: "@naija_eats", thumbnailUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80", views: "890K views", duration: "0:31", category: "Comedy" },
      { platform: "tiktok", youtubeId: "tt_003", platformId: "719001003", title: "How I built neural nets in 60s (sped up 20x)", channelName: "@codecraft_clips", handle: "@codecraft_clips", thumbnailUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80", views: "1.4M views", duration: "0:58", category: "Neural Networks" },
    ],
    instagram: [
      { platform: "instagram", youtubeId: "ig_001", platformId: "IG001", title: "Reel: Pyramid of Giza but make it shaders ✨", channelName: "@shaders Daily", handle: "@shaders_daily", thumbnailUrl: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?auto=format&fit=crop&w=600&q=80", views: "420K views", duration: "0:22", category: "Tech" },
      { platform: "instagram", youtubeId: "ig_002", platformId: "IG002", title: "Lagos traffic but AI traffic lights 🚦🇳🇬", channelName: "@lagos.tech", handle: "@lagos_tech", thumbnailUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80", views: "310K views", duration: "0:18", category: "Education" },
      { platform: "instagram", youtubeId: "ig_003", platformId: "IG003", title: "Behind the scenes: Studio setup for AI voices", channelName: "@studio.reels", handle: "@studio_reels", thumbnailUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80", views: "198K views", duration: "0:28", category: "Tech" },
    ],
    twitter: [
      { platform: "twitter", youtubeId: "tw_001", platformId: "TW001", title: "Twitter Video: Workers 2.0 launch thread — 100k rps on one shard", channelName: "@cloudflare", handle: "@cloudflare", thumbnailUrl: "https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&w=600&q=80", views: "150K views", duration: "1:32", category: "Cloudflare Workers" },
      { platform: "twitter", youtubeId: "tw_002", platformId: "TW002", title: "Demo: realtime translation tweet-dubbed to Yoruba", channelName: "@naija_ai", handle: "@naija_ai", thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80", views: "88K views", duration: "0:45", category: "Naija Dialects" },
      { platform: "twitter", youtubeId: "tw_003", platformId: "TW003", title: "Thread: How attention is all you need (video)", channelName: "@ai_papers", handle: "@ai_papers", thumbnailUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80", views: "210K views", duration: "2:10", category: "AI Superpowers" },
    ],
    facebook: [
      { platform: "facebook", youtubeId: "fb_001", platformId: "FB001", title: "Facebook Watch: Village village build log — episode 4", channelName: "Naija Builders FB", handle: "fb.com/naija.builders", thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80", views: "512K views", duration: "8:44", category: "Education" },
      { platform: "facebook", youtubeId: "fb_002", platformId: "FB002", title: "Live: AI marketplace seller Q&A — make ₦ with models", channelName: "Alphatekx FB Live", handle: "fb.com/alphatekx", thumbnailUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=600&q=80", views: "98K views", duration: "12:30", category: "Tech" },
      { platform: "facebook", youtubeId: "fb_003", platformId: "FB003", title: "Watch: Afropop + generative visuals (full set)", channelName: "AfroViz", handle: "fb.com/afroviz", thumbnailUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80", views: "670K views", duration: "4:12", category: "Music" },
    ],
  };
}

function aggregateSearch(query: string, youtubeVideos: any[]) {
  const qLower = query.toLowerCase();
  const catalogs = makePlatformCatalogs();
  const other = Object.values(catalogs).flat();
  const filteredOther = other.filter(v => !query || v.title.toLowerCase().includes(qLower) || v.channelName.toLowerCase().includes(qLower) || v.category.toLowerCase().includes(qLower));
  // youtubeVideos are already filtered/fallback; tag them platform=youtube and add badge meta
  const ytTagged = (youtubeVideos || []).map(v => ({ ...v, platform: "youtube", platformMeta: platformMeta.youtube }));
  const combined = [...ytTagged];
  // interleave other platforms for single-feed experience (preserve premium dark: shuffle but keep youtube first)
  for (let i = 0; i < filteredOther.length; i++) {
    const item = filteredOther[i];
    // inject platformMeta
    (item as any).platformMeta = platformMeta[item.platform];
    // interleave every 2 youtube videos insert one other
    const pos = Math.min(combined.length, 1 + i * 2);
    combined.splice(pos, 0, item);
  }
  // also include uploads as youtube-like but with platform field
  const uploadExtra = inMemoryUploads.filter(u => !query || u.title.toLowerCase().includes(qLower) || u.channelName.toLowerCase().includes(qLower)).map(u => ({ ...u, platform: u.platform || "youtube", platformMeta: platformMeta[u.platform || "youtube"], youtubeId: u.youtubeId || u.id }));
  for (const u of uploadExtra) {
    if (!combined.find(c => c.youtubeId === u.youtubeId)) combined.splice(2, 0, u);
  }
  return combined;
}

// Persistent Search History — survives until worker restarts, deduped by youtubeId, newest first
// Spec: Array<{youtubeId, title, searchedQuery, timestamp}> with pushToSearchHistory() dedupes by youtubeId, newest-first, cap 100
export let inMemorySearchHistory: Array<{
  youtubeId: string;
  title: string;
  channelName: string;
  thumbnailUrl: string;
  views: string;
  duration: string;
  searchedQuery: string;
  searchedAt: number;
  timestamp: number; // alias for spec compatibility
}> = [];

function pushToSearchHistory(videos: any[], searchedQuery: string) {
  for (const v of videos) {
    const youtubeId = v.youtubeId || v.id;
    if (!youtubeId) continue;
    // dedupe by youtubeId — if exists, update searchedAt/query and move to front
    const existingIdx = inMemorySearchHistory.findIndex((h) => h.youtubeId === youtubeId);
    const now = Date.now();
    if (existingIdx !== -1) {
      const existing = inMemorySearchHistory.splice(existingIdx, 1)[0];
      existing.searchedQuery = searchedQuery || existing.searchedQuery;
      existing.searchedAt = now;
      (existing as any).timestamp = now;
      // refresh title/thumbnail in case updated
      existing.title = v.title || existing.title;
      existing.channelName = v.channelName || existing.channelName;
      existing.thumbnailUrl = v.thumbnailUrl || existing.thumbnailUrl;
      existing.views = v.views || existing.views;
      existing.duration = v.duration || existing.duration;
      inMemorySearchHistory.unshift(existing);
    } else {
      inMemorySearchHistory.unshift({
        youtubeId,
        title: v.title || "YouTube Video",
        channelName: v.channelName || "YouTube Creator",
        thumbnailUrl: v.thumbnailUrl || `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
        views: v.views || "100K views",
        duration: v.duration || "15:00",
        searchedQuery: searchedQuery || "",
        searchedAt: now,
        timestamp: now,
      });

    }
  }
  // cap at 100 items to avoid unbounded memory
  if (inMemorySearchHistory.length > 100) inMemorySearchHistory = inMemorySearchHistory.slice(0, 100);
}

function createApiApp() {
  const app = new Hono<{ Bindings: Env }>();

  const downloadKv = (c: any): KVNamespace | undefined => c.env?.ALPHATEKX_KV || c.env?.KV;
  const jsonDownload = (c: any, body: any, status = 200) => c.json(body, status, {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store",
  });
  const numberFromKv = async (kv: KVNamespace | undefined, key: string) => Number(await kv?.get(key) || 0) || 0;
  const displayCount = (value: number) => value > 1000 ? `${(value / 1000).toFixed(1)}K` : String(value);
  const safeDownloadPut = async (kv: KVNamespace | undefined, key: string, value: string, expirationTtl?: number) => {
    if (!kv) return false;
    try {
      await kv.put(key, value, expirationTtl ? { expirationTtl } : undefined);
      return true;
    } catch (error) {
      console.error(`[download] unable to persist ${key}`, error);
      return false;
    }
  };
  const downloadDb = async (c: any) => {
    const db: D1Database | undefined = c.env?.DB;
    if (!db) return null;
    await db.prepare("CREATE TABLE IF NOT EXISTS download_counters (key TEXT PRIMARY KEY, value INTEGER NOT NULL DEFAULT 0)").run();
    return db;
  };
  const downloadDbValue = async (c: any, key: string) => {
    const db = await downloadDb(c);
    if (!db) return 0;
    const row = await db.prepare("SELECT value FROM download_counters WHERE key = ?").bind(key).first<{ value: number }>();
    return Number(row?.value || 0);
  };
  const incrementDownloadDb = async (c: any, key: string) => {
    const db = await downloadDb(c);
    if (!db) return 0;
    await db.prepare("INSERT INTO download_counters (key, value) VALUES (?, 1) ON CONFLICT(key) DO UPDATE SET value = value + 1").bind(key).run();
    return downloadDbValue(c, key);
  };

  app.get("/.well-known/assetlinks.json", (c) => new Response(JSON.stringify([{
    relation: ["delegate_permission/common.handle_all_urls"],
    target: {
      namespace: "android_app",
      package_name: "ng.name.alphatekx.twa",
      sha256_cert_fingerprints: ["00:CB:E8:B4:38:63:C0:A3:39:5F:9E:C5:00:50:04:E9:57:49:2B:50:3B:CA:9A:C0:E9:12:84:FB:8C:3C:68:2F"],
    },
  }]), { headers: { "Content-Type": "application/json", "Cache-Control": "no-store, max-age=0" } }));

  app.get("/api/download/count", async (c) => {
    const kv = downloadKv(c);
    const total = await downloadDbValue(c, "download:counter:total") || await numberFromKv(kv, "download:counter:total");
    const installed = await downloadDbValue(c, "download:counter:pwa_installed") || await numberFromKv(kv, "download:counter:pwa_installed");
    return jsonDownload(c, { total, installed, display: displayCount(total), installedDisplay: displayCount(installed) });
  });
  app.post("/api/download/tab-tapped", async (c) => {
    const kv = downloadKv(c);
    const today = new Date().toISOString().slice(0, 10);
    const ip = c.req.header("cf-connecting-ip") || "unknown";
    const dedupeKey = `download:dedupe:${ip}:${today}`;
    if (kv && await kv.get(dedupeKey)) {
      return jsonDownload(c, { ok: true, total: await downloadDbValue(c, "download:counter:total") || await numberFromKv(kv, "download:counter:total"), deduped: true });
    }
    const total = await incrementDownloadDb(c, "download:counter:total");
    const dailyKey = `download:counter:daily:${today}`;
    const daily = await incrementDownloadDb(c, dailyKey);
    await safeDownloadPut(kv, "download:counter:total", String(total));
    await safeDownloadPut(kv, dailyKey, String(daily), 90 * 86400);
    await safeDownloadPut(kv, dedupeKey, "1", 3600);
    return jsonDownload(c, { ok: true, total, display: displayCount(total) });
  });
  app.post("/api/download/pwa-installed", async (c) => {
    const kv = downloadKv(c);
    const installed = await incrementDownloadDb(c, "download:counter:pwa_installed");
    await safeDownloadPut(kv, "download:counter:pwa_installed", String(installed));
    return jsonDownload(c, { ok: true, installed, installedDisplay: displayCount(installed) });
  });
  app.post("/api/download/app-opened", async (c) => {
    const kv = downloadKv(c);
    const opened = await incrementDownloadDb(c, "download:counter:app_opened");
    await safeDownloadPut(kv, "download:counter:app_opened", String(opened));
    return jsonDownload(c, { ok: true, opened });
  });
  app.get("/api/download/stats", async (c) => {
    const kv = downloadKv(c);
    const total = await downloadDbValue(c, "download:counter:total") || await numberFromKv(kv, "download:counter:total");
    const installed = await downloadDbValue(c, "download:counter:pwa_installed") || await numberFromKv(kv, "download:counter:pwa_installed");
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setUTCDate(date.getUTCDate() - i);
      const key = date.toISOString().slice(0, 10);
      days.push({ date: key, count: await downloadDbValue(c, `download:counter:daily:${key}`) || await numberFromKv(kv, `download:counter:daily:${key}`) });
    }
    return jsonDownload(c, { total, installed, last7Days: days });
  });

  async function ensurePersistence(c: any) {
    const db: D1Database | undefined = c.env?.DB;
    if (!db) return null;
    await db.batch([
      db.prepare("CREATE TABLE IF NOT EXISTS community_messages (id TEXT PRIMARY KEY, video_id TEXT NOT NULL, channel TEXT NOT NULL, user_id TEXT, user_name TEXT NOT NULL, avatar_initials TEXT, message TEXT NOT NULL, timestamp_in_video TEXT, likes INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL)"),
      db.prepare("CREATE TABLE IF NOT EXISTS video_likes (user_id TEXT NOT NULL, video_id TEXT NOT NULL, created_at INTEGER NOT NULL, PRIMARY KEY (user_id, video_id))"),
      db.prepare("CREATE TABLE IF NOT EXISTS channel_subscriptions (user_id TEXT NOT NULL, channel_id TEXT NOT NULL, created_at INTEGER NOT NULL, PRIMARY KEY (user_id, channel_id))"),
      db.prepare("CREATE TABLE IF NOT EXISTS marketplace_products (id TEXT PRIMARY KEY, data TEXT NOT NULL, created_at INTEGER NOT NULL)"),
      db.prepare("CREATE TABLE IF NOT EXISTS marketplace_sales (id TEXT PRIMARY KEY, data TEXT NOT NULL, created_at INTEGER NOT NULL)"),
      db.prepare("CREATE TABLE IF NOT EXISTS ai_usage (user_id TEXT NOT NULL, feature TEXT NOT NULL, count INTEGER NOT NULL DEFAULT 0, last_used INTEGER, window_start INTEGER, used_in_window INTEGER NOT NULL DEFAULT 0, weekly_used INTEGER NOT NULL DEFAULT 0, week_start INTEGER, plan TEXT DEFAULT 'free', PRIMARY KEY (user_id, feature))"),
      db.prepare("CREATE TABLE IF NOT EXISTS market_usage (user_id TEXT PRIMARY KEY, product_count INTEGER NOT NULL DEFAULT 0, updated_at INTEGER)"),
      db.prepare("CREATE TABLE IF NOT EXISTS subscriptions (user_id TEXT PRIMARY KEY, plan TEXT DEFAULT 'free', status TEXT DEFAULT 'active', expires_at INTEGER, current_period_start INTEGER, current_period_end INTEGER, paystack_ref TEXT, created_at INTEGER, updated_at INTEGER)"),
      db.prepare("CREATE TABLE IF NOT EXISTS user_api_keys (user_id TEXT PRIMARY KEY, openai_key TEXT, gemini_key TEXT, updated_at INTEGER)")
      ,db.prepare("CREATE TABLE IF NOT EXISTS video_stats (video_id TEXT PRIMARY KEY, creator_id TEXT, channel_id TEXT, alphatekx_likes INTEGER DEFAULT 0, alphatekx_comments INTEGER DEFAULT 0, alphatekx_views INTEGER DEFAULT 0, total_watch_seconds INTEGER DEFAULT 0, avg_watch_percent INTEGER DEFAULT 0, score REAL DEFAULT 0, is_pro_creator INTEGER DEFAULT 0, created_at INTEGER, updated_at INTEGER)")
      ,db.prepare("CREATE TABLE IF NOT EXISTS video_impressions (id TEXT PRIMARY KEY, user_id TEXT, video_id TEXT, shown_at INTEGER)")
      ,db.prepare("CREATE TABLE IF NOT EXISTS video_views_log (id TEXT PRIMARY KEY, user_id TEXT, video_id TEXT, watch_percent INTEGER, viewed_at INTEGER)")
      ,db.prepare("CREATE TABLE IF NOT EXISTS video_views (id TEXT PRIMARY KEY, user_id TEXT, video_id TEXT, watch_percent INTEGER, viewed_at INTEGER)")
      ,db.prepare("CREATE INDEX IF NOT EXISTS idx_video_stats_score ON video_stats(score DESC)")
      ,db.prepare("CREATE INDEX IF NOT EXISTS idx_video_stats_created ON video_stats(created_at DESC)")
      ,db.prepare("CREATE TABLE IF NOT EXISTS ads_campaigns (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, title TEXT NOT NULL, video_url TEXT NOT NULL, thumbnail_url TEXT, destination_url TEXT NOT NULL, company_name TEXT, duration_seconds INTEGER NOT NULL, days INTEGER NOT NULL, daily_budget_ngn INTEGER NOT NULL DEFAULT 3000, total_amount_kobo INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'pending_payment', paystack_reference TEXT UNIQUE, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, start_at INTEGER, end_at INTEGER)")
      ,db.prepare("CREATE INDEX IF NOT EXISTS idx_ads_campaigns_user_created ON ads_campaigns (user_id, created_at DESC)")
      ,db.prepare("CREATE INDEX IF NOT EXISTS idx_ads_campaigns_status ON ads_campaigns (status, start_at, end_at)")
      ,db.prepare("CREATE TABLE IF NOT EXISTS ads_queue (id TEXT PRIMARY KEY, campaign_id TEXT NOT NULL UNIQUE, scheduled_at INTEGER NOT NULL, started_at INTEGER, ended_at INTEGER, status TEXT NOT NULL DEFAULT 'scheduled', created_at INTEGER NOT NULL, FOREIGN KEY (campaign_id) REFERENCES ads_campaigns(id))")
      ,db.prepare("CREATE INDEX IF NOT EXISTS idx_ads_queue_status_schedule ON ads_queue (status, scheduled_at, ended_at)")
    ]);
    await db.prepare("ALTER TABLE videos ADD COLUMN channel_id TEXT").run().catch(() => {});
    await db.prepare("ALTER TABLE video_stats ADD COLUMN channel_id TEXT").run().catch(() => {});
    await db.prepare("ALTER TABLE video_stats ADD COLUMN total_watch_seconds INTEGER DEFAULT 0").run().catch(() => {});
    await db.prepare("ALTER TABLE ads_campaigns ADD COLUMN company_name TEXT").run().catch(() => {});
    await db.prepare("ALTER TABLE ai_usage ADD COLUMN window_start INTEGER").run().catch(() => {});
    await db.prepare("ALTER TABLE ai_usage ADD COLUMN used_in_window INTEGER NOT NULL DEFAULT 0").run().catch(() => {});
    await db.prepare("ALTER TABLE ai_usage ADD COLUMN weekly_used INTEGER NOT NULL DEFAULT 0").run().catch(() => {});
    await db.prepare("ALTER TABLE ai_usage ADD COLUMN week_start INTEGER").run().catch(() => {});
    await db.prepare("ALTER TABLE ai_usage ADD COLUMN plan TEXT DEFAULT 'free'").run().catch(() => {});
    await db.prepare("ALTER TABLE subscriptions ADD COLUMN status TEXT DEFAULT 'active'").run().catch(() => {});
    await db.prepare("ALTER TABLE subscriptions ADD COLUMN current_period_start INTEGER").run().catch(() => {});
    await db.prepare("ALTER TABLE subscriptions ADD COLUMN current_period_end INTEGER").run().catch(() => {});
    await db.prepare("CREATE INDEX IF NOT EXISTS idx_ai_usage_user_window ON ai_usage (user_id, feature, window_start, week_start)").run().catch(() => {});
    return db;
  }

  function parseAdDurationSeconds(value: unknown): number | null {
    if (typeof value === "number" && Number.isFinite(value)) return Math.round(value);
    const text = String(value || "").trim();
    if (/^\d+$/.test(text)) return Number(text);
    if (/^PT/i.test(text)) {
      const seconds = isoDurationSeconds(text.toUpperCase());
      return Number.isFinite(seconds) ? seconds : null;
    }
    const parts = text.split(":").map(Number);
    if (parts.length === 2 && parts.every(Number.isFinite)) return parts[0] * 60 + parts[1];
    if (parts.length === 3 && parts.every(Number.isFinite)) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return null;
  }

  function youtubeVideoId(value: string): string | null {
    try {
      const url = new URL(value);
      if (url.hostname === "youtu.be") return url.pathname.slice(1).split("/")[0] || null;
      if (url.hostname.endsWith("youtube.com")) return url.searchParams.get("v") || url.pathname.match(/\/(?:shorts|embed|live)\/([^/?]+)/)?.[1] || null;
    } catch {}
    return null;
  }

  async function updateAdStatuses(db: D1Database, now = Date.now()) {
    await refreshAdStatuses(db, now);
  }

  async function expireSubscriptions(db: D1Database, now = Date.now()) {
    await db.prepare("UPDATE subscriptions SET plan = 'free', status = 'expired', updated_at = ? WHERE expires_at IS NOT NULL AND expires_at <= ? AND plan != 'free'").bind(now, now).run();
  }

  async function adDurationForRequest(c: any, videoUrl: string, suppliedDuration: unknown): Promise<{ seconds: number | null; source: string }> {
    const supplied = parseAdDurationSeconds(suppliedDuration);
    const youtubeId = youtubeVideoId(videoUrl);
    const apiKey = (c.env as Env)?.YOUTUBE_API_KEY;
    if (youtubeId && apiKey) {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${encodeURIComponent(youtubeId)}&key=${encodeURIComponent(apiKey)}`);
      if (!response.ok) throw new Error("VIDEO_DURATION_LOOKUP_FAILED");
      const data: any = await response.json();
      const duration = isoDurationSeconds(data.items?.[0]?.contentDetails?.duration);
      if (!Number.isFinite(duration)) throw new Error("VIDEO_DURATION_UNAVAILABLE");
      return { seconds: duration, source: "youtube" };
    }
    return { seconds: supplied, source: supplied !== null ? "request" : "unavailable" };
  }

  async function resolveUser(c: any, body?: any) {
    const cookieUser = await gatedGetUserFromCookie(c);
    if (cookieUser) return cookieUser;
    const id = String(body?.user_id || c.req.query("user_id") || "").trim();
    return id ? { id, email: body?.email || "" } : null;
  }
  async function subscriptionFor(c: any, userId: string) {
    const db = await ensurePersistence(c).catch(() => null);
    let sub: any = db ? await db.prepare("SELECT user_id AS userId, plan, expires_at AS expiresAt, paystack_ref AS paystackRef, created_at AS createdAt, updated_at AS updatedAt FROM subscriptions WHERE user_id = ?").bind(userId).first() : null;
    if (!sub) sub = proSubscriptions.get(userId);
    if (sub?.expiresAt && Number(sub.expiresAt) <= Date.now()) {
      sub = { ...sub, plan: "free", active: false };
      proSubscriptions.set(userId, sub);
      if (db) await db.prepare("UPDATE subscriptions SET plan = 'free', updated_at = ? WHERE user_id = ?").bind(Date.now(), userId).run();
    }
    return sub;
  }
  async function usage(c: any, table: "ai_usage" | "market_usage", userId: string, feature?: string) {
    const db = await ensurePersistence(c).catch(() => null);
    if (db) {
      const row: any = table === "ai_usage"
        ? await db.prepare("SELECT count AS used FROM ai_usage WHERE user_id = ? AND feature = ?").bind(userId, feature).first()
        : await db.prepare("SELECT product_count AS used FROM market_usage WHERE user_id = ?").bind(userId).first();
      return { used: Number(row?.used || 0), db };
    }
    const key = `${userId}:${feature || "publish"}`;
    return { used: Number((globalThis as any).__rateUsage?.get(key) || 0), db: null, key };
  }
  async function incrementUsage(c: any, table: "ai_usage" | "market_usage", userId: string, feature?: string) {
    const current = await usage(c, table, userId, feature);
    const db = current.db;
    if (db) {
      if (table === "ai_usage") await db.prepare("INSERT INTO ai_usage (user_id, feature, count, last_used) VALUES (?, ?, 1, ?) ON CONFLICT(user_id, feature) DO UPDATE SET count = count + 1, last_used = excluded.last_used").bind(userId, feature, Date.now()).run();
      else await db.prepare("INSERT INTO market_usage (user_id, product_count, updated_at) VALUES (?, 1, ?) ON CONFLICT(user_id) DO UPDATE SET product_count = product_count + 1, updated_at = excluded.updated_at").bind(userId, Date.now()).run();
      return current.used + 1;
    }
    const map = (globalThis as any).__rateUsage || ((globalThis as any).__rateUsage = new Map<string, number>());
    map.set(current.key, current.used + 1);
    return current.used + 1;
  }
  async function checkUsage(c: any, table: "ai_usage" | "market_usage", userId: string, limit: number, feature?: string) {
    const current = await usage(c, table, userId, feature);
    const sub = await subscriptionFor(c, userId);
    const isPro = Boolean(sub && (sub.active || sub.plan === "pro") && (!sub.expiresAt || Number(sub.expiresAt) > Date.now()));
    return { ...current, isPro, allowed: isPro || current.used < limit, limit: isPro ? null : limit };
  }

  app.use("*", async (c, next) => {
    c.header("Cache-Control", "public, max-age=5, s-maxage=10");
    await next();
  });

  app.get("/api/health", (c) => c.json({ status: "ok", app: "Alphatekx Stream", scale: "1M+ Ready" }));

  app.post("/api/ads/create", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "SIGNIN_REQUIRED" }, 401);
    const secret = (c.env as Env)?.PAYSTACK_SECRET_KEY;
    if (!secret) return c.json({ success: false, error: "PAYSTACK_NOT_CONFIGURED" }, 503);
    let body: any;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ success: false, error: "INVALID_JSON" }, 400);
    }
    const title = String(body.title || "").trim();
    const videoUrl = String(body.video_url || body.videoUrl || "").trim();
    const thumbnailUrl = String(body.thumbnail_url || body.thumbnailUrl || "").trim();
    const destinationUrl = String(body.destination_url || body.destinationUrl || body.link_url || body.linkUrl || body.landing_url || "").trim();
    const companyName = String(body.company_name || body.companyName || "").trim();
    const email = String(user.email || "").trim();
    const days = Number(body.days ?? body.duration_days);
    if (!title || title.length > 160) return c.json({ success: false, error: "TITLE_REQUIRED" }, 400);
    if (!/^https?:\/\/\S+$/i.test(videoUrl)) return c.json({ success: false, error: "VIDEO_URL_REQUIRED" }, 400);
    if (!/^https?:\/\/\S+$/i.test(destinationUrl)) return c.json({ success: false, error: "DESTINATION_URL_REQUIRED" }, 400);
    if (thumbnailUrl && !/^https?:\/\/\S+$/i.test(thumbnailUrl)) return c.json({ success: false, error: "INVALID_THUMBNAIL_URL" }, 400);
    if (!Number.isSafeInteger(days) || days < 1) return c.json({ success: false, error: "DAYS_MUST_BE_A_POSITIVE_INTEGER" }, 400);
    if (!email || !email.includes("@")) return c.json({ success: false, error: "ACCOUNT_EMAIL_REQUIRED" }, 400);
    const duration = await adDurationForRequest(c, videoUrl, body.duration_seconds ?? body.duration);
    if (duration.seconds === null) {
      return c.json({ success: false, error: "VIDEO_DURATION_REQUIRED", message: "Video duration must be provided and between 60 and 120 seconds." }, 400);
    }
    if (duration.seconds !== null && (duration.seconds < 60 || duration.seconds > 120)) {
      return c.json({ success: false, error: "VIDEO_DURATION_MUST_BE_60_TO_120_SECONDS", duration_seconds: duration.seconds }, 400);
    }
    const db = await ensurePersistence(c);
    if (!db) return c.json({ success: false, error: "PERSISTENCE_NOT_CONFIGURED" }, 503);
    const campaignId = crypto.randomUUID();
    const now = Date.now();
    const totalPriceUsd = days * 2;
    const totalPriceNgn = days * 3000;
    const totalAmountKobo = totalPriceNgn * 100;
    if (!Number.isSafeInteger(totalAmountKobo)) return c.json({ success: false, error: "AD_BUDGET_TOO_LARGE_FOR_PAYMENT_PROCESSOR" }, 400);
    await db.prepare("INSERT INTO ads_campaigns (id, user_id, title, video_url, thumbnail_url, destination_url, company_name, duration_seconds, days, daily_budget_ngn, total_amount_kobo, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 3000, ?, 'pending_payment', ?, ?)")
      .bind(campaignId, user.id, title, videoUrl, thumbnailUrl || null, destinationUrl, companyName || null, duration.seconds || 0, days, totalAmountKobo, now, now).run();
    const origin = new URL(c.req.url).origin;
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        amount: totalAmountKobo,
        currency: "NGN",
        callback_url: `${origin}/ads?paystack=success`,
        metadata: { campaignId, userId: user.id, product: "ads_campaign" },
      }),
    });
    const data: any = await response.json().catch(() => ({}));
    if (!response.ok || !data.status || !data.data?.authorization_url || !data.data?.reference) {
      return c.json({ success: false, error: data.message || "PAYSTACK_INITIALIZATION_FAILED", campaign_id: campaignId }, 502);
    }
    await db.prepare("UPDATE ads_campaigns SET paystack_reference = ?, updated_at = ? WHERE id = ? AND user_id = ?")
      .bind(data.data.reference, Date.now(), campaignId, user.id).run();
    return c.json({
      success: true,
      campaign_id: campaignId,
      reference: data.data.reference,
      paystack_ref: data.data.reference,
      authorization_url: data.data.authorization_url,
      total_price_usd: totalPriceUsd,
      total_price_ngn: totalPriceNgn,
      paystack_amount_kobo: totalAmountKobo,
      amount_kobo: totalAmountKobo,
      daily_budget_ngn: 3000,
      duration_validation: duration.source,
    });
  });

  app.post("/api/ads/initialize", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "SIGNIN_REQUIRED" }, 401);
    const secret = (c.env as Env)?.PAYSTACK_SECRET_KEY;
    if (!secret) return c.json({ success: false, error: "PAYSTACK_NOT_CONFIGURED" }, 503);
    let body: any;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ success: false, error: "INVALID_JSON" }, 400);
    }
    const campaignId = String(body.campaign_id || body.campaignId || "").trim();
    const email = String(user.email || "").trim();
    if (!campaignId) return c.json({ success: false, error: "CAMPAIGN_ID_REQUIRED" }, 400);
    if (!email || !email.includes("@")) return c.json({ success: false, error: "ACCOUNT_EMAIL_REQUIRED" }, 400);
    const db = await ensurePersistence(c);
    if (!db) return c.json({ success: false, error: "PERSISTENCE_NOT_CONFIGURED" }, 503);
    const campaign: any = await db.prepare("SELECT id, user_id, total_amount_kobo, status FROM ads_campaigns WHERE id = ? AND user_id = ?")
      .bind(campaignId, user.id).first();
    if (!campaign) return c.json({ success: false, error: "CAMPAIGN_NOT_FOUND" }, 404);
    const storedTotalPriceNgn = Number(campaign.total_amount_kobo) / 100;
    const requestedTotalPriceNgn = body.total_price_ngn === undefined ? storedTotalPriceNgn : Number(body.total_price_ngn);
    if (!Number.isInteger(requestedTotalPriceNgn) || requestedTotalPriceNgn <= 0 || requestedTotalPriceNgn !== storedTotalPriceNgn) {
      return c.json({ success: false, error: "TOTAL_PRICE_MISMATCH" }, 400);
    }
    const amountKobo = requestedTotalPriceNgn * 100;
    const origin = new URL(c.req.url).origin;
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        amount: amountKobo,
        currency: "NGN",
        callback_url: `${origin}/ads`,
        metadata: { campaignId, userId: user.id, product: "ads_campaign" },
      }),
    });
    const data: any = await response.json().catch(() => ({}));
    if (!response.ok || !data.status || !data.data?.authorization_url || !data.data?.reference) {
      return c.json({ success: false, error: data.message || "PAYSTACK_INITIALIZATION_FAILED" }, 502);
    }
    await db.prepare("UPDATE ads_campaigns SET paystack_reference = ?, updated_at = ? WHERE id = ? AND user_id = ?")
      .bind(data.data.reference, Date.now(), campaignId, user.id).run();
    return c.json({
      success: true,
      campaign_id: campaignId,
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
      amount: amountKobo,
      amount_kobo: amountKobo,
      total_price_ngn: requestedTotalPriceNgn,
      callback_url: `${origin}/ads`,
    });
  });

  app.post("/api/ads/verify-payment", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "SIGNIN_REQUIRED" }, 401);
    const secret = (c.env as Env)?.PAYSTACK_SECRET_KEY;
    if (!secret) return c.json({ success: false, error: "PAYSTACK_NOT_CONFIGURED" }, 503);
    let body: any;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ success: false, error: "INVALID_JSON" }, 400);
    }
    const reference = String(body.reference || body.paystack_ref || body.paystack_reference || "").trim();
    const campaignId = String(body.campaign_id || body.campaignId || "").trim();
    if (!reference || !campaignId) return c.json({ success: false, error: "REFERENCE_AND_CAMPAIGN_REQUIRED" }, 400);
    const db = await ensurePersistence(c);
    if (!db) return c.json({ success: false, error: "PERSISTENCE_NOT_CONFIGURED" }, 503);
    const campaign: any = await db.prepare("SELECT * FROM ads_campaigns WHERE id = ? AND user_id = ?").bind(campaignId, user.id).first();
    if (!campaign) return c.json({ success: false, error: "CAMPAIGN_NOT_FOUND" }, 404);
    if (campaign.paystack_reference && campaign.paystack_reference !== reference) return c.json({ success: false, error: "REFERENCE_MISMATCH" }, 400);
    if (campaign.status !== "pending_payment") return c.json({ success: true, campaign_id: campaignId, status: campaign.status, already_verified: true });
    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    const data: any = await response.json().catch(() => ({}));
    const transaction = data.data;
    const metadataCampaignId = String(transaction?.metadata?.campaignId || "");
    const metadataUserId = String(transaction?.metadata?.userId || "");
    if (!response.ok || !data.status || transaction?.status !== "success") return c.json({ success: false, error: data.message || "PAYSTACK_VERIFICATION_FAILED" }, 502);
    if (metadataCampaignId !== campaignId || (metadataUserId && metadataUserId !== user.id) || Number(transaction.amount) !== Number(campaign.total_amount_kobo) || String(transaction.currency || "").toUpperCase() !== "NGN") {
      return c.json({ success: false, error: "PAYSTACK_PAYMENT_MISMATCH" }, 403);
    }
    const { status, startAt, endAt } = await activateOrQueueAd(db, campaign, reference, user.id);
    await clearCurrentAdsCache(c.env as Env);
    return c.json({
      success: true,
      campaign_id: campaignId,
      status,
      start_at: startAt,
      end_at: endAt,
      start_date: startAt,
      end_date: endAt,
      message: status === "active" ? "Ad live! Auto queued" : "Ad paid and automatically queued",
    });
  });

  app.get("/api/ads/current", async (c) => {
    const db = await ensurePersistence(c);
    if (!db) return c.json({ success: false, error: "PERSISTENCE_NOT_CONFIGURED" }, 503);
    await updateAdStatuses(db);
    const now = Date.now();
    const campaigns = await getCurrentAds(db, c.env as Env, now);
    return c.json({ success: true, campaigns, ads: campaigns });
  });

  app.get("/api/cron/ads-expire", async (c) => {
    const db = await ensurePersistence(c);
    if (!db) return c.json({ success: false, error: "PERSISTENCE_NOT_CONFIGURED" }, 503);
    await updateAdStatuses(db);
    await clearCurrentAdsCache(c.env as Env);
    return c.json({ success: true });
  });

  app.get("/api/cron/sub-expire", async (c) => {
    const db = await ensurePersistence(c);
    if (!db) return c.json({ success: false, error: "PERSISTENCE_NOT_CONFIGURED" }, 503);
    await expireSubscriptions(db);
    return c.json({ success: true });
  });

  app.get("/api/ads/my-ads", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "SIGNIN_REQUIRED" }, 401);
    const requestedUserId = String(c.req.query("user_id") || "").trim();
    if (requestedUserId && requestedUserId !== user.id) return c.json({ success: false, error: "OWNERSHIP_REQUIRED" }, 403);
    const db = await ensurePersistence(c);
    if (!db) return c.json({ success: false, error: "PERSISTENCE_NOT_CONFIGURED" }, 503);
    await updateAdStatuses(db);
    const result: any = await db.prepare("SELECT c.*, q.status AS queue_status, q.scheduled_at, q.started_at, q.ended_at FROM ads_campaigns c LEFT JOIN ads_queue q ON q.campaign_id = c.id WHERE c.user_id = ? ORDER BY c.created_at DESC")
      .bind(user.id).all();
    const ads = result.results || [];
    return c.json({ success: true, ads, campaigns: ads });
  });

  app.get("/api/subscription/status", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ authenticated: false, isPro: false, error: "IDENTITY_REQUIRED" }, 401);
    const sub: any = await subscriptionFor(c, user.id);
    const isPro = Boolean(sub && (sub.active || sub.plan === "pro") && (!sub.expiresAt || Number(sub.expiresAt) > Date.now()));
    const month = new Date().toISOString().slice(0, 7);
    const usageResult: any = {};
    for (const feature of Object.keys(aiLimits)) {
      const row = await usage(c, "ai_usage", user.id, feature);
      usageResult[feature] = { used: row.used, limit: isPro || feature === "workspace" ? null : (sub?.plan && sub.plan !== "free" ? getPlanLimits(String(sub.plan)).window : 2) };
    }
    const market = await usage(c, "market_usage", user.id);
    const rate = await aiRateLimitStatus(c, user.id);
    return c.json({ authenticated: true, user_id: user.id, isPro, plan: sub?.plan || "free", expires_at: sub?.expiresAt || null, days_left: sub?.expiresAt ? Math.max(0, Math.ceil((Number(sub.expiresAt) - Date.now()) / 86400000)) : 0, usage: usageResult, ai_rate_limit: rate, market: { used: market.used, limit: isPro ? null : 5 } });
  });

  app.all("/api/ai/check-limit", async (c) => {
    try {
      const user = await gatedGetUserFromCookie(c);
      if (!user) return c.json({ allowed: false, error: "IDENTITY_REQUIRED" }, 401);
      const rate = await aiRateLimitStatus(c, user.id);
      return c.json({ allowed: rate.remainingWindow > 0 && rate.remainingWeekly > 0, ...rate });
    } catch (error: any) {
      return c.json({ allowed: false, error: error.message || "AI_LIMIT_CHECK_FAILED" }, 503);
    }
  });

  app.post("/api/ai/use", async (c) => {
    try {
      const user = await gatedGetUserFromCookie(c);
      if (!user) return c.json({ success: false, error: "IDENTITY_REQUIRED" }, 401);
      const rate = await consumeAiRateLimit(c, user.id);
      if (!rate.allowed) return c.json({ success: false, error: "AI_RATE_LIMIT_REACHED", message: "Rate limit reached. Try again after the 5-hour window or weekly reset.", retry_after: rate.windowResetIn, ...rate }, 429);
      return c.json({ success: true, ...rate });
    } catch (error: any) {
      return c.json({ success: false, error: error.message || "AI_USAGE_FAILED" }, 503);
    }
  });

  app.post("/api/ai/check-and-use", async (c) => {
    let body: any = {}; try { body = await c.req.json(); } catch {}
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "IDENTITY_REQUIRED" }, 401);
    const feature = String(body.feature || "teacher");
    if (!Object.prototype.hasOwnProperty.call(aiLimits, feature)) return c.json({ success: false, error: "INVALID_FEATURE" }, 400);
    const result = await aiRateLimitStatus(c, user.id);
    const allowed = result.remainingWindow > 0 && result.remainingWeekly > 0;
    if (!allowed) return c.json({ allowed: false, error: "AI_TRIAL_LIMIT_REACHED", message: result.plan === "free" ? "You have used your 2 free AI trials. Upgrade to continue." : "Your subscription AI limit has been reached.", feature, ...result, upgradeUrl: "/pricing" }, 429);
    return c.json({ allowed: true, user_id: user.id, feature, ...result });
  });
  app.post("/api/ai/increment", async (c) => {
    let body: any = {}; try { body = await c.req.json(); } catch {}
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "IDENTITY_REQUIRED" }, 401);
    const feature = String(body.feature || "teacher");
    if (!Object.prototype.hasOwnProperty.call(aiLimits, feature)) return c.json({ success: false, error: "INVALID_FEATURE" }, 400);
    const result = await consumeAiRateLimit(c, user.id);
    if (!result.allowed) return c.json({ success: false, error: "AI_RATE_LIMIT_REACHED", feature, ...result }, 429);
    return c.json({ success: true, user_id: user.id, feature, ...result });
  });
  app.post("/api/market/check-publish", async (c) => {
    let body: any = {}; try { body = await c.req.json(); } catch {}
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "IDENTITY_REQUIRED" }, 401);
    const result = await checkUsage(c, "market_usage", user.id, 5);
    if (!result.allowed) return c.json({ allowed: false, error: "market_limit", limit: 5, used: result.used, isPro: false, proPrice: 19 }, 429);
    return c.json({ allowed: true, user_id: user.id, remaining: result.isPro ? "unlimited" : Math.max(0, 5 - result.used - 1), limit: result.limit, isPro: result.isPro });
  });
  app.post("/api/market/increment", async (c) => {
    let body: any = {}; try { body = await c.req.json(); } catch {}
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "IDENTITY_REQUIRED" }, 401);
    const result = await checkUsage(c, "market_usage", user.id, 5);
    if (!result.allowed) return c.json({ success: false, error: "market_limit", used: result.used, limit: result.limit }, 429);
    const db = await ensurePersistence(c).catch(() => null);
    let used: number;
    if (db && !result.isPro) {
      const update = await db.prepare("UPDATE market_usage SET product_count = product_count + 1, updated_at = ? WHERE user_id = ? AND product_count < 5")
        .bind(Date.now(), user.id).run();
      if (!update.meta?.changes) return c.json({ success: false, error: "market_limit", used: result.used, limit: 5 }, 429);
      used = result.used + 1;
    } else {
      used = await incrementUsage(c, "market_usage", user.id);
    }
    return c.json({ success: true, user_id: user.id, used, limit: result.limit, isPro: result.isPro });
  });
  app.post("/api/subscription/activate", async (c) => {
    return c.json({ success: false, error: "PAYMENT_VERIFICATION_REQUIRED", message: "Verify a successful Paystack transaction before activating Pro." }, 410);
  });
  app.post("/api/user/save-key", async (c) => {
    let body: any = {}; try { body = await c.req.json(); } catch {}
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "IDENTITY_REQUIRED" }, 401);
    const provider = String(body.provider || (body.gemini_key ? "gemini" : "openai")).trim().toLowerCase();
    const apiKey = String(body.api_key || body.apiKey || body.openai_key || body.gemini_key || "").trim();
    if (!apiKey) return c.json({ success: false, error: "API_KEY_REQUIRED" }, 400);
    const db = await ensurePersistence(c).catch(() => null);
    if (!db) return c.json({ success: false, error: "PERSISTENCE_NOT_CONFIGURED" }, 503);
    await db.prepare("INSERT INTO user_api_keys (user_id, openai_key, gemini_key, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET openai_key=COALESCE(excluded.openai_key, openai_key), gemini_key=COALESCE(excluded.gemini_key, gemini_key), updated_at=excluded.updated_at").bind(user.id, provider === "openai" ? apiKey : null, provider === "gemini" ? apiKey : null, Date.now()).run();
    return c.json({ success: true, provider, saved: true });
  });
  app.get("/api/user/get-key", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "IDENTITY_REQUIRED" }, 401);
    const db = await ensurePersistence(c).catch(() => null);
    if (!db) return c.json({ success: false, error: "PERSISTENCE_NOT_CONFIGURED" }, 503);
    const row: any = await db.prepare("SELECT openai_key AS openAiKey, gemini_key AS geminiKey FROM user_api_keys WHERE user_id = ?").bind(user.id).first();
    return c.json({ success: true, hasOpenAI: Boolean(row?.openAiKey), hasGemini: Boolean(row?.geminiKey) });
  });

  // === SIGN-IN WITH GOOGLE (Cloudflare Worker) ===
  // Keep a small warm-cache for local development, but the cookie is self-contained so
  // authentication also works when Cloudflare sends the next request to another isolate.
  const gatedSessions = (globalThis as any).__gatedSessions || ((globalThis as any).__gatedSessions = new Map<string, any>());
  function base64UrlEncode(value: string): string {
    const bytes = new TextEncoder().encode(value);
    let binary = "";
    for (let i = 0; i < bytes.length; i += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    }
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function base64UrlDecode(value: string): string {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }
  async function signSession(payload: string, secret: string): Promise<string> {
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
    return base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
  }
  async function gatedGetUserFromCookie(c: any) {
    const cookie: string = c.req.header("cookie") || "";
    const m = cookie.match(/session=([^;]+)/);
    if (!m) return null;
    let cookieValue = m[1];
    try { cookieValue = decodeURIComponent(cookieValue); } catch {}
    const cached = gatedSessions.get(m[1]) || gatedSessions.get(cookieValue);
    if (cached) return cached;
    const env: any = c.env || {};
    const parts = cookieValue.split(".");
    const sessionSecret = env.SESSION_SECRET || env.GOOGLE_CLIENT_SECRET;
    if (parts.length !== 2 || !sessionSecret) return null;
    try {
      const expected = await signSession(parts[0], sessionSecret);
      if (expected !== parts[1]) return null;
      const user = JSON.parse(base64UrlDecode(parts[0]));
      if (!user.expiresAt || Date.parse(user.expiresAt) <= Date.now()) return null;
      if (env.KV && user.sessionId) {
        try {
          const persisted = await env.KV.get(`session:${user.sessionId}`, "json");
          if (persisted && persisted.expiresAt && Date.parse(persisted.expiresAt) > Date.now()) return { ...persisted, isGuest: false };
        } catch (kvError: any) {
          console.error("[auth] KV session read failed", kvError?.message || kvError);
        }
      }
      return user;
    } catch {
      return null;
    }
  }
  function gatedGetAuthUrl(c: any): string {
    const env: any = c.env || {};
    const clientId = env.GOOGLE_CLIENT_ID || (typeof process !== "undefined" ? (process as any).env?.GOOGLE_CLIENT_ID : "") || "";
    const redirectUri = env.GOOGLE_REDIRECT_URI || `${new URL(c.req.url).origin}/api/auth/callback`;
    const scopes = "openid email profile";
    if (!clientId) throw new Error("GOOGLE_OAUTH_NOT_CONFIGURED");
    const cid = clientId;
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(cid)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes)}&access_type=offline&prompt=consent`;
  }
  app.get("/api/auth/url", (c) => {
    c.header("Cache-Control", "no-store");
    try {
      const url = gatedGetAuthUrl(c);
      return c.json({ url });
    } catch (e: any) {
      return c.json({ error: e.message, url: null }, 500);
    }
  });
  const handleGoogleCallback = async (c: any) => {
    c.header("Cache-Control", "no-store");
    const code = c.req.query("code");
    const env: any = c.env || {};
    const clientId = env.GOOGLE_CLIENT_ID || "";
    const clientSecret = env.GOOGLE_CLIENT_SECRET || "";
    const sessionSecret = env.SESSION_SECRET || clientSecret;
    const redirectUri = env.GOOGLE_REDIRECT_URI || `${new URL(c.req.url).origin}/api/auth/callback`;
    const errorRedirect = (error: string, detail?: string) => {
      const target = new URL("/", c.req.url);
      target.searchParams.set("auth_error", error);
      if (detail) target.searchParams.set("details", detail.slice(0, 240));
      return c.redirect(target.toString(), 302);
    };
    if (!code) return errorRedirect(c.req.query("error") || "missing_code", c.req.query("error_description"));
    if (!clientId || !clientSecret) return errorRedirect("oauth_not_configured");
    try {
      const tokenController = new AbortController();
      const tokenTimeout = setTimeout(() => tokenController.abort(), 10000);
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: "authorization_code" }),
        signal: tokenController.signal,
      });
      clearTimeout(tokenTimeout);
      const tokens: any = await tokenRes.json().catch(() => ({}));
      if (!tokenRes.ok || !tokens.access_token) {
        console.error("[oauth] token exchange failed", tokenRes.status, tokens.error);
        return errorRedirect("token_exchange_failed", tokens.error_description || tokens.error);
      }
      const profileController = new AbortController();
      const profileTimeout = setTimeout(() => profileController.abort(), 10000);
      const userRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
        signal: profileController.signal,
      });
      clearTimeout(profileTimeout);
      const userInfo: any = await userRes.json().catch(() => ({}));
      if (!userRes.ok || !userInfo.sub || !userInfo.email) {
        console.error("[oauth] userinfo failed", userRes.status, userInfo);
        return errorRedirect("profile_failed", userInfo.error_description || userInfo.error);
      }
      const sessionToken = (globalThis as any).crypto?.randomUUID ? (globalThis as any).crypto.randomUUID() : Math.random().toString(36).slice(2);
      const sessionUser = {
        id: userInfo.sub,
        sessionId: sessionToken,
        channelId: "",
        channelName: userInfo.name || "Alphatekx User",
        channelAvatar: userInfo.picture || "https://ui-avatars.com/api/?name=Alphatekx&background=FFD700&color=000&size=200&bold=true",
        email: userInfo.email,
        expiresAt: new Date(Date.now() + 30 * 86400 * 1000).toISOString(),
        isGuest: false,
      };
      const sessionPayload = base64UrlEncode(JSON.stringify(sessionUser));
      const sessionSignature = await signSession(sessionPayload, sessionSecret);
      const sessionCookie = `${sessionPayload}.${sessionSignature}`;
      if (env.DB) {
        // Persistence must not turn a successful Google exchange into a failed signup
        // (for example while D1 is briefly unavailable). Handle both unique keys:
        // email is unique, and users can return with the same Google subject.
        try {
          await env.DB.batch([
            env.DB.prepare(
              "INSERT INTO users (id, email, name, picture) VALUES (?, ?, ?, ?) ON CONFLICT(email) DO UPDATE SET id = excluded.id, name = excluded.name, picture = excluded.picture"
            ).bind(sessionUser.id, sessionUser.email, sessionUser.channelName, sessionUser.channelAvatar),
            env.DB.prepare(
              "INSERT INTO sessions (id, user_id) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET user_id = excluded.user_id"
            ).bind(sessionToken, sessionUser.id),
          ]);
        } catch (dbError: any) {
          console.error("[oauth] D1 persistence failed", dbError?.message || dbError);
        }
      }
      if (env.KV) {
        try {
          await env.KV.put(`session:${sessionToken}`, JSON.stringify(sessionUser), { expirationTtl: 30 * 86400 });
        } catch (kvError: any) {
          console.error("[oauth] KV persistence failed", kvError?.message || kvError);
        }
      }
      gatedSessions.set(sessionCookie, sessionUser);
      c.header("Set-Cookie", `session=${sessionCookie}; HttpOnly; Secure; Path=/; Max-Age=${30 * 86400}; SameSite=Lax`);
      return c.redirect(new URL("/", c.req.url).toString(), 302);
    } catch (error: any) {
      console.error("[oauth] callback failed", error?.message || error);
      return errorRedirect("exchange_failed", error?.message);
    }
  };
  app.get("/api/auth/callback", handleGoogleCallback);
  app.get("/api/auth/callback/google", handleGoogleCallback);
  app.get("/api/auth/user", async (c) => {
    c.header("Cache-Control", "no-store");
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ id: null, channelName: null, channelAvatar: null, isGuest: true });
    return c.json({ ...user, isGuest: false });
  });
  app.get("/api/user/feed", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ feed: [], isGuest: true });
    try {
      const env: any = c.env || {};
      // Feed is sourced from the server-side YouTube API key, never user OAuth.
      const channelVideos = await libFetchChannelVideos(env.YOUTUBE_API_KEY || "", 12).catch(()=>[]);
      const feed = (channelVideos || []).slice(0, 8).map((v: any) => ({ videoId: v.youtubeId || v.id, title: v.title, thumbnail: v.thumbnailUrl || v.thumbnail || `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`, publishedAt: v.publishedAt || new Date().toISOString(), channelName: v.channelName || v.channel || "YouTube Creator", channelId: v.channelId || "" }));
      if (feed.length > 0) return c.json({ feed, isGuest: false, fallback: true });
      return c.json({ feed: [], isGuest: false, fallback: false, error: "REAL_FEED_EMPTY" });
    } catch (e: any) {
      return c.json({ feed: [], error: e.message, isGuest: false });
    }
  });
  app.get("/api/auth/logout", (c) => {
    const cookie: string = c.req.header("cookie") || "";
    const m = cookie.match(/session=([^;]+)/);
    if (m) gatedSessions.delete(m[1]);
    c.header("Set-Cookie", "session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax");
    return c.redirect("/");
  });

  // Watch metadata is intentionally uncached: the requested video identity must remain stable.
  app.post("/api/video/direct", async (c) => {
    try {
      const body: any = await c.req.json();
      const videoId = String(body.videoId || "").match(/^[0-9A-Za-z_-]{11}$/)?.[0];
      if (!videoId) return c.json({ success: false, error: "VIDEO_ID_REQUIRED" }, 400);
      const key = (c.env as Env).YOUTUBE_WEB_KEY || (c.env as Env).YOUTUBE_API_KEY;
      const response = await fetch(`https://www.youtube.com/youtubei/v1/player?key=${encodeURIComponent(key)}`, {
        method: "POST", headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" },
        body: JSON.stringify({ context: { client: { clientName: "WEB", clientVersion: "2.20240301" } }, videoId }),
      });
      if (!response.ok) return c.json({ success: false, error: "YOUTUBE_PLAYER_FAILED" }, 502);
      const data: any = await response.json();
      const format = data.streamingData?.formats?.find((item: any) => item.url && item.mimeType?.startsWith("video/"))
        || data.streamingData?.adaptiveFormats?.find((item: any) => item.url && item.mimeType?.startsWith("video/"));
      return c.json({
        success: true, videoId, streamUrl: format?.url || "",
        meta: { title: data.videoDetails?.title || "", author: data.videoDetails?.author || "", lengthSeconds: data.videoDetails?.lengthSeconds || "" },
      });
    } catch (error: any) {
      console.error("[video/direct]", error);
      return c.json({ success: false, error: "YOUTUBE_PLAYER_FAILED", message: error?.message || "Unable to load video" }, 502);
    }
  });

  // UNIFIED SEARCH — YouTube + TikTok + Instagram + Twitter (+Facebook) — Real APIs with mock fallback
  // Uses lib modules: backend/src/lib/* and src/lib/* (Prompt #2)
  app.get("/api/search", async (c) => {
    const q = c.req.query("q") || "";
    const env = c.env as Env;
    try {
      const [innerTube, tt, ig, tw] = await Promise.all([
        searchYouTubeInnerTube(c, q),
        libSearchTikTok(q, env.TIKHUB_API_KEY || env.TIKTOK_API_KEY),
        libSearchInstagram(q, env.INSTAGRAM_ACCESS_TOKEN),
        libSearchTwitter(q, env.TWITTER_BEARER_TOKEN),
      ]);
      const yt = innerTube.length ? { videos: innerTube, isMock: false } : await libSearchYouTube(q, env.YOUTUBE_API_KEY);
      const fbCatalog = getMockFacebookCatalog();
      const qLower = q.toLowerCase();
      const fbFiltered = fbCatalog.filter((v: any) => !q || v.title.toLowerCase().includes(qLower) || v.channelName.toLowerCase().includes(qLower));

      const sources = {
        youtube: yt.videos,
        tiktok: tt.videos,
        instagram: ig.videos,
        twitter: tw.videos,
        facebook: fbFiltered,
      };

      let combined = libAggregate(q, sources as any);

      // Inject uploads (preserve existing behavior — searchable uploads appear in unified feed)
      const uploadExtra = inMemoryUploads.filter(u => !q || u.title.toLowerCase().includes(qLower) || u.channelName.toLowerCase().includes(qLower)).map(u => ({
        source: u.platform || "youtube",
        platform: u.platform || "youtube",
        id: u.youtubeId || u.id,
        youtubeId: u.youtubeId || u.id,
        platformId: u.youtubeId || u.id,
        title: u.title,
        thumbnail: u.thumbnailUrl,
        thumbnailUrl: u.thumbnailUrl,
        channel: { name: u.channelName, id: u.channelId },
        channelName: u.channelName,
        channelId: u.channelId,
        views: u.views,
        viewsFormatted: u.views,
        duration: u.duration,
        category: u.category,
        platformMeta: platformMeta[u.platform || "youtube"] || platformMeta.youtube,
      }));
      for (const u of uploadExtra) {
        if (!combined.find((c: any) => (c.youtubeId || c.id) === (u.youtubeId || u.id))) combined.splice(2, 0, u as any);
      }

      // Persist to history (newest first, deduped, cap 100)
      if (combined.length > 0) pushToSearchHistory(combined, q);

      const isMock = yt.isMock && tt.isMock && ig.isMock && tw.isMock;
      return c.json({
        videos: combined,
        unified: true,
        isMock,
        meta: {
          youtube: { count: yt.videos.length, isMock: yt.isMock },
          tiktok: { count: tt.videos.length, isMock: tt.isMock },
          instagram: { count: ig.videos.length, isMock: ig.isMock },
          twitter: { count: tw.videos.length, isMock: tw.isMock },
          facebook: { count: fbFiltered.length, isMock: true },
        },
        errors: {
          youtube: (yt as any).error,
          tiktok: (tt as any).error,
          instagram: (ig as any).error,
          twitter: (tw as any).error,
        },
      });
    } catch (err: any) {
      console.error("[unified search] exception q:", q, err?.message || err);
      // fallback to legacy aggregateSearch with mock catalog
      const fallback = (await libSearchYouTube(q, undefined)).videos;
      const unified = aggregateSearch(q, fallback);
      if (unified.length > 0) pushToSearchHistory(unified, q);
      return c.json({ videos: unified, isMock: true, unified: true, error: err.message });
    }
  });

  // Persistent Search History Endpoints
  app.get("/api/search/history", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ history: inMemorySearchHistory, count: inMemorySearchHistory.length });
    const history = await historyForUser(c, user.id, "searched");
    return c.json({ history, count: history.length });
  });

  app.post("/api/search/save", async (c) => {
    try {
      const body = await c.req.json<{
        videos?: any[];
        youtubeId?: string;
        title?: string;
        channelName?: string;
        thumbnailUrl?: string;
        views?: string;
        duration?: string;
        searchedQuery?: string;
      }>();
      // Support both single video object and { videos: [...] } batch
      const user = await gatedGetUserFromCookie(c);
      if (!user) return c.json({ success: false, error: "AUTHENTICATION_REQUIRED" }, 401);
      if (Array.isArray(body.videos) && body.videos.length > 0) {
        const q = (body as any).searchedQuery || body.videos[0]?.searchedQuery || "";
        pushToSearchHistory(body.videos, q);
        await Promise.all(body.videos.map((video: any) => saveHistoryForUser(c, user.id, "searched", { ...video, searchedQuery: q })));
        return c.json({ success: true, history: inMemorySearchHistory, count: inMemorySearchHistory.length });
      }
      // single item legacy
      const single = body.youtubeId ? [body] : [];
      if (single.length > 0) {
        pushToSearchHistory(single, body.searchedQuery || "");
        await saveHistoryForUser(c, user.id, "searched", single[0]);
        return c.json({ success: true, history: inMemorySearchHistory, count: inMemorySearchHistory.length });
      }
      // empty batch
      return c.json({ success: false, error: "No videos provided" }, 400);
    } catch (e: any) {
      return c.json({ success: false, error: e.message }, 400);
    }
  });

  app.delete("/api/search/history", async (c) => {
    inMemorySearchHistory = [];
    const user = await gatedGetUserFromCookie(c);
    if (user) {
      const db = await ensurePersistence(c).catch(() => null);
      if (db) await db.prepare("DELETE FROM user_history WHERE user_id = ? AND kind = 'searched'").bind(user.id).run();
      if ((c.env as any).KV) await (c.env as any).KV.delete(`history:${user.id}:searched`);
    }
    return c.json({ success: true, history: [] });
  });

  // === UNIFIED AGGREGATOR PER-PLATFORM ENDPOINTS — Real APIs via lib modules (Prompt #2)
  // GET /api/search/youtube?q=  ...  /tiktok /instagram /twitter /facebook
  const platformSearch = (platform: string) => async (c: any) => {
    const q = c.req.query("q") || "";
    const qLower = q.toLowerCase();
    const env = c.env as Env;
    if (platform === "youtube") {
      const r = await libSearchYouTube(q, env.YOUTUBE_API_KEY);
      let vids = r.videos;
      // include uploads that are youtube platform (preserve existing searchable uploads)
      const uploads = inMemoryUploads.filter(u => (u.platform||"youtube")==="youtube" && (!q || u.title.toLowerCase().includes(qLower))).map(u=>({
        source: "youtube", platform:"youtube", id: u.youtubeId || u.id, youtubeId: u.youtubeId || u.id, platformId: u.youtubeId || u.id,
        title: u.title, thumbnail: u.thumbnailUrl, thumbnailUrl: u.thumbnailUrl,
        channel: { name: u.channelName, id: u.channelId }, channelName: u.channelName, channelId: u.channelId,
        views: u.views, viewsFormatted: u.views, duration: u.duration, category: u.category, platformMeta: platformMeta.youtube
      }));
      const combined = [...vids, ...uploads];
      return c.json({ videos: combined, platform, count: combined.length, isMock: r.isMock, error: (r as any).error });
    }
    if (platform === "tiktok") {
      const r = await libSearchTikTok(q, env.TIKHUB_API_KEY || env.TIKTOK_API_KEY);
      return c.json({ videos: r.videos, platform, count: r.videos.length, isMock: r.isMock, error: (r as any).error });
    }
    if (platform === "instagram") {
      const r = await libSearchInstagram(q, env.INSTAGRAM_ACCESS_TOKEN);
      return c.json({ videos: r.videos, platform, count: r.videos.length, isMock: r.isMock, error: (r as any).error });
    }
    if (platform === "twitter") {
      const r = await libSearchTwitter(q, env.TWITTER_BEARER_TOKEN);
      return c.json({ videos: r.videos, platform, count: r.videos.length, isMock: r.isMock, error: (r as any).error });
    }
    if (platform === "facebook") {
      const vids = getMockFacebookCatalog().filter((v: any) => !q || v.title.toLowerCase().includes(qLower) || v.channelName.toLowerCase().includes(qLower));
      return c.json({ videos: vids, platform, count: vids.length, isMock: true });
    }
    // fallback: legacy catalog
    const catalogs = makePlatformCatalogs() as any;
    let vids = (catalogs[platform] || []) as any[];
    vids = vids.filter(v => !q || v.title.toLowerCase().includes(qLower) || v.channelName.toLowerCase().includes(qLower) || v.category.toLowerCase().includes(qLower));
    vids = vids.map(v=> ({ ...v, platformMeta: (platformMeta as any)[platform] }));
    return c.json({ videos: vids, platform, count: vids.length, isMock: true });
  };
  app.get("/api/search/youtube", platformSearch("youtube"));
  app.get("/api/search/tiktok", platformSearch("tiktok"));
  app.get("/api/search/instagram", platformSearch("instagram"));
  app.get("/api/search/twitter", platformSearch("twitter"));
  app.get("/api/search/facebook", platformSearch("facebook"));

  // Real YouTube Shorts feed. YouTube has no Shorts-specific API resource, so
  // use trending/search discovery and verify duration from video details.
  app.get("/api/shorts", async (c) => {
    const apiKey = (c.env as Env)?.YOUTUBE_API_KEY || "";
    const pageToken = c.req.query("pageToken") || "";
    const limit = Math.min(Math.max(Number(c.req.query("limit") || "12"), 1), 25);
    const rotatingSearchPage = pageToken.match(/^shorts-search:(\d+)$/);
    if (!apiKey) {
      try {
        const searchPage = rotatingSearchPage ? Number(rotatingSearchPage[1]) : 0;
        const queries = ["#shorts", "AI shorts", "tech shorts", "funny shorts", "music shorts", "football shorts", "gaming shorts", "science shorts", "food shorts", "travel shorts"];
        const discovered = await searchYouTubeInnerTube(c, queries[searchPage % queries.length]);
        const videos = discovered.slice(0, limit).map((video: any) => ({
          ...video,
          isShort: true,
          category: "Shorts",
        }));
        return c.json({
          videos,
          nextPageToken: `shorts-search:${searchPage + 1}`,
          real: true,
          source: "youtube_innertube",
        });
      } catch (error: any) {
        const fallbackVideos = await fetchYoutubeRssVideos(OFFICIAL_CHANNEL_ID, 50).catch(() => []);
        return c.json({
          videos: fallbackVideos.filter((video) => video.isShort).slice(0, limit),
          nextPageToken: `shorts-search:${searchPage + 1}`,
          real: true,
          source: "youtube_rss",
          sourceUnavailable: true,
        });
      }
    }
    try {
      const queries = ["#shorts"];
      const searchResults = await Promise.all(queries.map(async (query) => {
          const searchParams = new URLSearchParams({ part: "snippet", type: "video", videoDuration: "short", order: "date", maxResults: "50", q: query, key: apiKey });
          if (pageToken) searchParams.set("pageToken", pageToken);
          const searchRes = await fetch(`https://www.googleapis.com/youtube/v3/search?${searchParams}`);
          const searchData: any = await searchRes.json().catch(() => ({}));
          return { searchRes, searchData };
      }));
      if (searchResults.some(({ searchRes }) => !searchRes.ok)) {
        throw new Error(`YouTube Shorts search ${searchResults.find(({ searchRes }) => !searchRes.ok)?.searchRes.status || 502}`);
      }
      const searchSignals = new Map<string, boolean>();
      for (let index = 0; index < searchResults.length; index += 1) {
        const { searchData } = searchResults[index];
        for (const item of searchData.items || []) {
          const id = item.id?.videoId;
          if (!id) continue;
          const text = `${item.snippet?.title || ""} ${item.snippet?.description || ""}`.toLowerCase();
          searchSignals.set(id, (searchSignals.get(id) || false) || index === 0 || text.includes("short"));
        }
      }
      const ids = [...searchSignals.keys()];
      let items: any[] = [];
      const nextPageToken = searchResults.find(({ searchData }) => searchData.nextPageToken)?.searchData.nextPageToken || "";
      if (ids.length) {
        const detailRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${ids.join(",")}&key=${encodeURIComponent(apiKey)}`);
        const detailData: any = await detailRes.json().catch(() => ({}));
        items = (detailData.items || []).filter((item: any) => {
          const seconds = isoDurationSeconds(item.contentDetails?.duration);
          const text = `${item.snippet?.title || ""} ${item.snippet?.description || ""} ${(item.snippet?.tags || []).join(" ")}`.toLowerCase();
          return seconds > 0 && seconds <= 180 && (searchSignals.get(item.id) === true || text.includes("short"));
        });
      }
      const seen = new Set<string>();
      const channelIds = [...new Set(items.map((item: any) => item.snippet?.channelId).filter(Boolean))].slice(0, 50);
      const channelAvatars: Record<string, string> = {};
      if (channelIds.length) {
        const channelRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelIds.join(",")}&key=${encodeURIComponent(apiKey)}`);
        if (channelRes.ok) {
          const channelData: any = await channelRes.json().catch(() => ({}));
          for (const channel of channelData.items || []) channelAvatars[channel.id] = channel.snippet?.thumbnails?.default?.url || "";
        }
      }
      const videos = items.filter((item: any) => {
        if (!item.id || seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      }).slice(0, limit).map((item: any) => ({
        source: "youtube", platform: "youtube", id: item.id, youtubeId: item.id,
        title: item.snippet?.title || "YouTube Short",
        channelName: item.snippet?.channelTitle || "YouTube Creator",
        channelId: item.snippet?.channelId || "",
        avatar: channelAvatars[item.snippet?.channelId] || "",
        thumbnailUrl: item.snippet?.thumbnails?.high?.url || `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,
        views: formatViews(item.statistics?.viewCount), viewsRaw: Number(item.statistics?.viewCount || 0),
        likes: formatCount(item.statistics?.likeCount, "likes"), likeCount: Number(item.statistics?.likeCount || 0),
        comments: formatCount(item.statistics?.commentCount, "comments"), commentCount: Number(item.statistics?.commentCount || 0),
        description: item.snippet?.description || "",
        duration: parseIsoDuration(item.contentDetails?.duration), publishedAt: item.snippet?.publishedAt || "",
        category: "Shorts", isShort: true
      }));
      return c.json({ videos, nextPageToken, real: true });
    } catch (error: any) {
      try {
        let videos = (await fetchYoutubeRssVideos(OFFICIAL_CHANNEL_ID, 50)).filter((video) => video.isShort).slice(0, limit);
        if (videos.length < limit) {
          const sectionVideos = await fetchYoutubeSectionVideos(OFFICIAL_CHANNEL_ID, "shorts", limit).catch(() => []);
          if (sectionVideos.length > videos.length) videos = sectionVideos;
        }
        if (!videos.length) videos = (await fetchYoutubeRssVideos(OFFICIAL_CHANNEL_ID, 50)).slice(0, limit).map((video) => ({ ...video, isShort: true }));
        return c.json({ videos, nextPageToken: `shorts-search:${(rotatingSearchPage ? Number(rotatingSearchPage[1]) : 0) + 1}`, real: true, source: "youtube_rss" });
      } catch (fallbackError: any) {
        return c.json({ videos: [], nextPageToken: "", real: false, sourceUnavailable: true, error: error.message || "SHORTS_FETCH_FAILED" });
      }
    }
  });

  // Rotating home recommendations sourced from fresh YouTube uploads. The
  // topic rotates daily and the request offset changes hourly so Home does not
  // remain pinned to one catalog forever.
  app.get("/api/feed", async (c) => {
    const env: any = c.env || {};
    let streamVideos: any[] = inMemoryUploads;
    if (env.DB) {
      try {
        const stored = await env.DB.prepare("SELECT id, video_id AS videoId, title, thumbnail, original_url AS originalUrl, created_at AS createdAt, source FROM videos ORDER BY created_at DESC LIMIT 100").all();
        streamVideos = [...(stored.results || []), ...inMemoryUploads];
      } catch {}
    }
    const stream = streamVideos.map((video: any) => ({
      ...video,
      id: video.youtubeId || video.videoId || video.id,
      youtubeId: video.youtubeId || video.videoId || video.id,
      thumbnailUrl: video.thumbnailUrl || video.thumbnail,
      platform: "youtube",
      source: "youtube_link",
      views: "0 views"
    }));
    const apiKey = (c.env as Env)?.YOUTUBE_API_KEY || "";
    if (!apiKey) return c.json({ videos: stream, real: false, error: "YOUTUBE_API_KEY_NOT_CONFIGURED" });
    const topics = ["technology", "science", "programming", "business", "music", "education", "ai"];
    const day = Math.floor(Date.now() / 86400000);
    const topic = topics[day % topics.length];
    const publishedAfter = new Date(Date.now() - 30 * 86400000).toISOString();
    try {
      const search = new URL("https://www.googleapis.com/youtube/v3/search");
      search.searchParams.set("part", "snippet");
      search.searchParams.set("type", "video");
      search.searchParams.set("order", "date");
      search.searchParams.set("q", topic);
      search.searchParams.set("publishedAfter", publishedAfter);
      search.searchParams.set("maxResults", "50");
      search.searchParams.set("key", apiKey);
      const searchResponse = await fetch(search.toString());
      if (!searchResponse.ok) throw new Error(`YouTube feed search ${searchResponse.status}`);
      const searchData: any = await searchResponse.json();
      const ids = (searchData.items || []).map((item: any) => item.id?.videoId).filter(Boolean);
      if (!ids.length) return c.json({ videos: stream, real: true, topic });
      const details = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${ids.join(",")}&key=${encodeURIComponent(apiKey)}`);
      if (!details.ok) throw new Error(`YouTube feed details ${details.status}`);
      const detailData: any = await details.json();
      const offset = new Date().getUTCHours() % Math.max(1, detailData.items?.length || 1);
      const videos = (detailData.items || []).slice(offset).concat(detailData.items || []).slice(0, 24).map((item: any) => ({
        source: "youtube", platform: "youtube", id: item.id, youtubeId: item.id,
        title: item.snippet?.title || "New video",
        channelName: item.snippet?.channelTitle || "YouTube Creator",
        channelId: item.snippet?.channelId || "",
        thumbnailUrl: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url,
        description: item.snippet?.description || "",
        views: formatViews(item.statistics?.viewCount), viewsRaw: Number(item.statistics?.viewCount || 0),
        likes: formatCount(item.statistics?.likeCount, "likes"), likeCount: Number(item.statistics?.likeCount || 0),
        comments: formatCount(item.statistics?.commentCount, "comments"), commentCount: Number(item.statistics?.commentCount || 0),
        duration: parseIsoDuration(item.contentDetails?.duration), publishedAt: item.snippet?.publishedAt || "",
      }));
      return c.json({ videos: [...stream, ...videos], real: true, topic, refreshedAt: new Date().toISOString() });
    } catch (error: any) {
      try {
        const rssVideos = await fetchYoutubeSectionVideos(OFFICIAL_CHANNEL_ID, "videos", 50).catch(() => fetchYoutubeRssVideos(OFFICIAL_CHANNEL_ID, 50));
        return c.json({ videos: [...stream, ...rssVideos], real: true, source: "youtube_rss", sourceUnavailable: true });
      } catch {
        return c.json({ videos: stream, real: false, sourceUnavailable: true, error: error.message || "FEED_FETCH_FAILED" });
      }
    }
  });

  app.post("/api/home/feed", async (c) => {
    try {
      const env = c.env as Env;
      const body: any = await c.req.json().catch(() => ({}));
      const continuationToken = String(body.continuationToken || c.req.query("continuationToken") || "").trim();
      const cacheKey = `yt:home:feed:v4:${continuationToken || "first"}`;
      if (!continuationToken && env.KV) {
        const cached = await env.KV.get(cacheKey, "json").catch(() => null);
        if (cached) return c.json(cached);
      }
      const key = env.YOUTUBE_WEB_KEY || env.YOUTUBE_API_KEY || "";
      const fallbackSearchToken = continuationToken.startsWith("home-search:")
        ? Number(continuationToken.split(":")[1] || 0) + 1
        : 0;
      if (fallbackSearchToken) {
        const queries = ["technology videos", "science videos", "programming videos", "music videos", "education videos"];
        let videos = await searchYouTubeInnerTube(c, queries[fallbackSearchToken % queries.length]);
        if (!videos.length) {
          videos = await searchYouTubeInnerTube(c, "trending videos");
        }
        if (!videos.length) videos = await fetchYoutubeRssVideos(OFFICIAL_CHANNEL_ID, 15).catch(() => []);
        const mixedVideos = videos.slice(0, 20);
        return c.json({
          success: true,
          items: mixedVideos.map((video) => ({ type: "video_long", data: video })),
          videos: mixedVideos,
          products: inMemoryProducts.slice(0, 3),
          nextToken: `home-search:${fallbackSearchToken + 1}`,
          hasMore: true,
        });
      }
      const payload = continuationToken
        ? { context: { client: { clientName: "WEB", clientVersion: "2.20240301" } }, continuation: continuationToken }
        : { context: { client: { clientName: "WEB", clientVersion: "2.20240301" } }, browseId: "FEwhat_to_watch" };
      const requestBrowse = (browseKey: string) => fetch(youtubeBrowseUrl(browseKey), {
        method: "POST",
        headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" },
        body: JSON.stringify(payload),
      });
      let response = await requestBrowse(key);
      if (!response.ok && !continuationToken) response = await requestBrowse("");
      let videos: any[] = [];
      let nextToken = "";
      if (response.ok) {
        const parsed = parseInnerTubeChannelVideos(await response.json(), "");
        videos = parsed.videos;
        nextToken = parsed.nextToken || "";
      }
      if (!videos.length) {
        videos = await searchYouTubeInnerTube(c, "trending videos");
        if (!videos.length) videos = await fetchYoutubeRssVideos(OFFICIAL_CHANNEL_ID, 15).catch(() => []);
        nextToken = videos.length ? "home-search:1" : "";
      }
      if (!videos.length && env.YOUTUBE_DATA_API_KEY) {
        console.log("FALLBACK_API_USED");
        const search = new URL("https://www.googleapis.com/youtube/v3/search");
        search.searchParams.set("part", "snippet");
        search.searchParams.set("type", "video");
        search.searchParams.set("order", "date");
        search.searchParams.set("maxResults", "50");
        search.searchParams.set("key", env.YOUTUBE_DATA_API_KEY);
        const apiResponse = await fetch(search);
        if (apiResponse.ok) {
          const data: any = await apiResponse.json();
          videos = (data.items || []).map((item: any) => ({
            id: item.id?.videoId, youtubeId: item.id?.videoId, source: "youtube", platform: "youtube",
            title: item.snippet?.title || "YouTube video", channelName: item.snippet?.channelTitle || "YouTube Creator",
            channelId: item.snippet?.channelId || "", thumbnailUrl: item.snippet?.thumbnails?.high?.url || "",
            description: item.snippet?.description || "", publishedAt: item.snippet?.publishedAt || "",
          })).filter((video: any) => video.youtubeId);
        }
      }
      const sponsored = {
        id: "native-tunacredit", youtubeId: "", isSponsored: true, sponsored: true, platform: "sponsored",
        source: "native_ad", title: "Get up to ₦100,000 instantly", channelName: "Sponsored · TunaCredit",
        thumbnailUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
        cta: "Install",
      };
      const products = inMemoryProducts.slice(0, 3);
      const mixedVideos = videos.slice(0, 20).flatMap((video, index) => index === 2 ? [sponsored, video] : [video]);
      const result = {
        success: true, items: mixedVideos.map((video) => ({ type: video.isSponsored ? "sponsored" : "video_long", data: video })),
        videos: mixedVideos, products, nextToken, hasMore: Boolean(nextToken),
      };
      if (!continuationToken && env.KV) await env.KV.put(cacheKey, JSON.stringify(result), { expirationTtl: 3600 }).catch(() => {});
      return c.json(result);
    } catch (error: any) {
      console.error("[home/feed]", error);
      return c.json({ success: false, items: [], videos: [], products: [], nextToken: "", hasMore: false, error: error.message || "HOME_FEED_FAILED" }, 502);
    }
  });

  const calculateBoostScore = (video: any) => {
    const ageHours = Math.max(0, (Date.now() - Number(video.created_at || Date.now())) / 3600000);
    const base = (Number(video.alphatekx_likes || 0) * 3)
      + (Number(video.alphatekx_comments || 0) * 5)
      + (Number(video.avg_watch_percent || 0) * 0.5)
      + (ageHours < 24 ? 50 : ageHours < 72 ? 20 : 0)
      - (ageHours * 1.5);
    return Math.max(Number(video.is_pro_creator) ? base * 1.5 : base, 5);
  };
  let lastBoostRecalculate = 0;
  const recalculateBoostScores = async (c: any, db: any) => {
    if (Date.now() - lastBoostRecalculate < 300000) return 0;
    await ensureVideoStats(c, db);
    const rows: any = await db.prepare("SELECT * FROM video_stats").all();
    let updated = 0;
    for (const video of rows.results || []) {
      const subscription = video.creator_id ? await subscriptionFor(c, video.creator_id) : null;
      const isPro = Boolean(subscription?.active || subscription?.plan === "pro");
      await db.prepare("UPDATE video_stats SET score = ?, is_pro_creator = ?, updated_at = ? WHERE video_id = ?")
        .bind(calculateBoostScore({ ...video, is_pro_creator: isPro ? 1 : 0 }), isPro ? 1 : 0, Date.now(), video.video_id).run();
      updated += 1;
    }
    lastBoostRecalculate = Date.now();
    return updated;
  };
  async function ensureVideoStats(c: any, db: any) {
    await db.prepare("INSERT OR IGNORE INTO video_stats (video_id, creator_id, channel_id, created_at, updated_at) SELECT id, added_by, channel_id, created_at, ? FROM videos").bind(Date.now()).run();
    await db.prepare("UPDATE video_stats SET alphatekx_likes = (SELECT COUNT(*) FROM video_likes WHERE video_likes.video_id = video_stats.video_id), alphatekx_comments = (SELECT COUNT(*) FROM community_messages WHERE community_messages.video_id = video_stats.video_id), updated_at = ?").bind(Date.now()).run();
  }
  app.post("/api/feed/recalculate", async (c) => {
    try {
      const db = await ensurePersistence(c);
      if (!db) return c.json({ updated: 0, error: "PERSISTENCE_NOT_CONFIGURED" }, 503);
      await recalculateBoostScores(c, db);
      const rows: any = await db.prepare("SELECT * FROM video_stats").all();
      return c.json({ updated: rows.results?.length || 0 });
    } catch (error: any) {
      return c.json({ updated: 0, error: error.message || "RECALCULATE_FAILED" }, 500);
    }
  });
  app.post("/api/feed/calculate-score", async (c) => {
    try {
      const db = await ensurePersistence(c);
      if (!db) return c.json({ updated: 0, error: "PERSISTENCE_NOT_CONFIGURED" }, 503);
      const updated = await recalculateBoostScores(c, db);
      return c.json({ updated });
    } catch (error: any) { return c.json({ updated: 0, error: error.message || "CALCULATE_SCORE_FAILED" }, 500); }
  });
  app.get("/api/feed/home", async (c) => {
    const url = new URL(c.req.url);
    url.pathname = "/api/feed/foryou";
    return app.fetch(new Request(url, c.req.raw), c.env);
  });
  app.get("/api/feed/foryou", async (c) => {
    try {
      const db = await ensurePersistence(c);
      if (!db) return c.json({ videos: [], nextCursor: 0, isBoosted: false }, 503);
      await ensureVideoStats(c, db);
      await recalculateBoostScores(c, db);
      await updateAdStatuses(db);
      const user = await gatedGetUserFromCookie(c);
      const userId = user?.id || c.req.query("user_id") || "anonymous";
      const limit = Math.min(Math.max(Number(c.req.query("limit") || 20), 1), 50);
      const cursorKey = `feed_cursor:${userId}`;
      let shown: string[] = [];
      if ((c.env as any).KV) shown = (await (c.env as any).KV.get(cursorKey, "json").catch(() => null)) || [];
      const placeholders = shown.map(() => "?").join(",");
      const where = placeholders ? `WHERE v.id NOT IN (${placeholders})` : "";
      let query = `SELECT v.*, vs.score, vs.alphatekx_likes, vs.alphatekx_comments, vs.alphatekx_views, vs.is_pro_creator FROM videos v JOIN video_stats vs ON v.id = vs.video_id ${where} ${where ? "AND" : "WHERE"} vs.score >= 5 ORDER BY vs.score DESC, v.created_at DESC LIMIT ?`;
      let result: any = await db.prepare(query).bind(...shown, limit).all();
      if ((result.results || []).length < limit && shown.length) {
        shown = [];
        result = await db.prepare("SELECT v.*, vs.score, vs.alphatekx_likes, vs.alphatekx_comments, vs.alphatekx_views, vs.is_pro_creator FROM videos v JOIN video_stats vs ON v.id = vs.video_id WHERE vs.score >= 5 ORDER BY vs.score DESC, v.created_at DESC LIMIT ?").bind(limit).all();
      }
      const videos = result.results || [];
      const activeAds = await getCurrentAds(db, c.env as Env);
      const sponsored: any = activeAds.length ? activeAds[Math.floor(Math.random() * activeAds.length)] : null;
      const sponsoredVideo = sponsored ? [{
        id: `ad_${sponsored.id}`,
        videoId: sponsored.id,
        title: sponsored.title,
        video_url: sponsored.video_url,
        videoUrl: sponsored.video_url,
        thumbnail: sponsored.thumbnail_url,
        thumbnailUrl: sponsored.thumbnail_url,
        destination_url: sponsored.destination_url,
        destinationUrl: sponsored.destination_url,
        duration: `${Math.floor(Number(sponsored.duration_seconds) / 60)}:${String(Number(sponsored.duration_seconds) % 60).padStart(2, "0")}`,
        channelName: sponsored.company_name || "Sponsored",
        platform: "sponsored",
        source: "sponsored_ad",
        isSponsored: true,
        sponsored: true,
      }] : [];
      const ids = videos.map((video: any) => video.id);
      const nextShown = [...ids, ...shown].slice(0, 50);
      if ((c.env as any).KV) await (c.env as any).KV.put(cursorKey, JSON.stringify(nextShown), { expirationTtl: 86400 }).catch(() => {});
      await Promise.all(ids.map((id: string) => db.prepare("INSERT INTO video_impressions (id, user_id, video_id, shown_at) VALUES (?, ?, ?, ?)").bind(`${userId}_${id}_${Date.now()}_${Math.random()}`, userId, id, Date.now()).run()));
      const sponsoredAd = sponsored ? sponsoredVideo[0] : null;
      return c.json({
        sponsored_ad: sponsoredAd,
        marketplace_small: inMemoryProducts.slice(0, 6),
        videos: [...sponsoredVideo, ...videos],
        nextCursor: Number(c.req.query("cursor") || 0) + videos.length,
        type: "foryou",
        isBoosted: true,
      });
    } catch (error: any) {
      return c.json({ videos: [], nextCursor: 0, isBoosted: false, error: error.message || "FEED_FAILED" }, 500);
    }
  });
  app.get("/api/feed/following", async (c) => {
    try {
      const db = await ensurePersistence(c);
      if (!db) return c.json({ videos: [] }, 503);
      const user = await gatedGetUserFromCookie(c);
      if (!user) return c.json({ videos: [], error: "AUTHENTICATION_REQUIRED" }, 401);
      const limit = Math.min(Math.max(Number(c.req.query("limit") || 20), 1), 50);
      const cursor = Math.max(Number(c.req.query("cursor") || 0), 0);
      const rows = await db.prepare("SELECT v.*, vs.score, vs.alphatekx_likes, vs.alphatekx_comments, vs.alphatekx_views, vs.is_pro_creator FROM videos v JOIN video_stats vs ON v.id = vs.video_id WHERE COALESCE(v.channel_id, v.added_by) IN (SELECT channel_id FROM channel_subscriptions WHERE user_id = ?) ORDER BY v.created_at DESC LIMIT ? OFFSET ?").bind(user.id, limit, cursor).all();
      const videos = rows.results || [];
      return c.json({ videos, nextCursor: cursor + videos.length, hasMore: videos.length === limit });
    } catch (error: any) { return c.json({ videos: [], error: error.message || "FOLLOWING_FAILED" }, 500); }
  });
  app.get("/api/feed/trending", async (c) => {
    try {
      const db = await ensurePersistence(c);
      if (!db) return c.json({ videos: [], title: "Trending Last 24h" }, 503);
      await ensureVideoStats(c, db);
      const limit = Math.min(Math.max(Number(c.req.query("limit") || 20), 1), 50);
      const cursor = Math.max(Number(c.req.query("cursor") || 0), 0);
      const rows = await db.prepare("SELECT v.*, vs.score, vs.alphatekx_likes, vs.alphatekx_comments, vs.alphatekx_views, vs.is_pro_creator FROM videos v JOIN video_stats vs ON v.id = vs.video_id WHERE vs.created_at > ? ORDER BY vs.score DESC LIMIT ? OFFSET ?").bind(Date.now() - 86400000, limit, cursor).all();
      const videos = rows.results || [];
      return c.json({ videos, title: "Trending Last 24h", nextCursor: cursor + videos.length, hasMore: videos.length === limit });
    } catch (error: any) { return c.json({ videos: [], title: "Trending Last 24h", error: error.message }, 500); }
  });
  app.get("/api/feed/new", async (c) => {
    try {
      const db = await ensurePersistence(c);
      if (!db) return c.json({ videos: [], title: "Fresh - Last 6h" }, 503);
      const limit = Math.min(Math.max(Number(c.req.query("limit") || 20), 1), 50);
      const cursor = Math.max(Number(c.req.query("cursor") || 0), 0);
      const rows = await db.prepare("SELECT * FROM videos WHERE created_at > ? ORDER BY created_at DESC LIMIT ? OFFSET ?").bind(Date.now() - 21600000, limit, cursor).all();
      const videos = rows.results || [];
      return c.json({ videos, title: "Fresh - Last 6h", nextCursor: cursor + videos.length, hasMore: videos.length === limit });
    } catch (error: any) { return c.json({ videos: [], title: "Fresh - Last 6h", error: error.message }, 500); }
  });
  app.post("/api/video/view", async (c) => {
    try {
      const user = await gatedGetUserFromCookie(c);
      if (!user) return c.json({ counted: false, error: "AUTHENTICATION_REQUIRED" }, 401);
      const body = await c.req.json<any>();
      const videoId = String(body.video_id || body.videoId || "").trim();
      const watchPercent = Math.min(Math.max(Number(body.watch_percent ?? body.watchPercent ?? 0), 0), 100);
      if (!videoId) return c.json({ counted: false, error: "VIDEO_ID_REQUIRED" }, 400);
      const db = await ensurePersistence(c);
      if (!db) return c.json({ counted: false, error: "PERSISTENCE_NOT_CONFIGURED" }, 503);
      const recent = await db.prepare("SELECT 1 FROM video_views_log WHERE user_id = ? AND video_id = ? AND viewed_at > ?").bind(user.id, videoId, Date.now() - 3600000).first();
      if (recent) return c.json({ counted: false });
      const viewId = `${user.id}_${videoId}_${Date.now()}`;
      await db.batch([
        db.prepare("INSERT INTO video_views_log (id, user_id, video_id, watch_percent, viewed_at) VALUES (?, ?, ?, ?, ?)").bind(viewId, user.id, videoId, watchPercent, Date.now()),
        db.prepare("INSERT INTO video_views (id, user_id, video_id, watch_percent, viewed_at) VALUES (?, ?, ?, ?, ?)").bind(viewId, user.id, videoId, watchPercent, Date.now()),
        db.prepare("INSERT OR IGNORE INTO video_stats (video_id, created_at, updated_at) VALUES (?, ?, ?)").bind(videoId, Date.now(), Date.now()),
      ]);
      await db.prepare("UPDATE video_stats SET alphatekx_views = alphatekx_views + 1, total_watch_seconds = total_watch_seconds + 30, avg_watch_percent = CAST(((avg_watch_percent * alphatekx_views) + ?) / (alphatekx_views + 1) AS INTEGER), updated_at = ? WHERE video_id = ?").bind(watchPercent, Date.now(), videoId).run();
      const stats: any = await db.prepare("SELECT alphatekx_views FROM video_stats WHERE video_id = ?").bind(videoId).first();
      return c.json({ counted: true, total_views: Number(stats?.alphatekx_views || 0) });
    } catch (error: any) { return c.json({ counted: false, error: error.message || "VIEW_FAILED" }, 500); }
  });
  app.get("/api/creator/stats", async (c) => {
    try {
      const creatorId = String(c.req.query("creator_id") || "").trim();
      if (!creatorId) return c.json({ videos: [], total_boost_views: 0, error: "CREATOR_ID_REQUIRED" }, 400);
      const db = await ensurePersistence(c);
      const rows: any = await db.prepare("SELECT video_id, alphatekx_views, alphatekx_likes, alphatekx_comments, score FROM video_stats WHERE creator_id = ? ORDER BY score DESC").bind(creatorId).all();
      return c.json({ videos: rows.results || [], total_boost_views: (rows.results || []).reduce((sum: number, row: any) => sum + Number(row.alphatekx_views || 0), 0), message: "These are Alphatekx boost views measured separately from YouTube Analytics." });
    } catch (error: any) { return c.json({ videos: [], total_boost_views: 0, error: error.message }, 500); }
  });
  app.get("/api/creator/dashboard", async (c) => {
    try {
      const creatorId = String(c.req.query("creator_id") || "").trim();
      if (!creatorId) return c.json({ videos: [], total_boost_views: 0, error: "CREATOR_ID_REQUIRED" }, 400);
      const db = await ensurePersistence(c);
      const rows: any = await db.prepare("SELECT v.title, v.video_id, s.alphatekx_views, s.alphatekx_likes, s.alphatekx_comments, s.score FROM videos v JOIN video_stats s ON v.id = s.video_id WHERE s.creator_id = ? ORDER BY s.score DESC").bind(creatorId).all();
      return c.json({ videos: rows.results || [], total_boost_views: (rows.results || []).reduce((sum: number, row: any) => sum + Number(row.alphatekx_views || 0), 0), message: "Alphatekx boost activity is measured separately from YouTube Analytics." });
    } catch (error: any) { return c.json({ videos: [], total_boost_views: 0, error: error.message || "DASHBOARD_FAILED" }, 500); }
  });
  app.get("/api/video/:id/stats", async (c) => {
    try {
      const db = await ensurePersistence(c);
      if (!db) return c.json({ error: "PERSISTENCE_NOT_CONFIGURED" }, 503);
      const id = c.req.param("id");
      const stats: any = await db.prepare("SELECT alphatekx_likes, alphatekx_comments, alphatekx_views, score FROM video_stats WHERE video_id = ?").bind(id).first();
      const likes: any = await db.prepare("SELECT COUNT(*) AS count FROM video_likes WHERE video_id = ?").bind(id).first();
      const comments: any = await db.prepare("SELECT COUNT(*) AS count FROM community_messages WHERE video_id = ?").bind(id).first();
      return c.json({ alphatekx_likes: Number(likes?.count || stats?.alphatekx_likes || 0), alphatekx_comments: Number(comments?.count || stats?.alphatekx_comments || 0), alphatekx_views: Number(stats?.alphatekx_views || 0), score: Number(stats?.score || 0) });
    } catch (error: any) { return c.json({ error: error.message || "STATS_FAILED" }, 500); }
  });
  app.get("/api/youtube/stats", async (c) => {
    const videoId = String(c.req.query("video_id") || "").trim();
    const key = String((c.env as Env)?.YOUTUBE_API_KEY || "");
    if (!videoId || !key) return c.json({ youtube_likeCount: null, youtube_viewCount: null });
    try {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${encodeURIComponent(videoId)}&key=${encodeURIComponent(key)}`);
      if (!response.ok) return c.json({ youtube_likeCount: null, youtube_viewCount: null });
      const data: any = await response.json();
      const stats = data.items?.[0]?.statistics || {};
      return c.json({ youtube_likeCount: Number(stats.likeCount || 0), youtube_viewCount: Number(stats.viewCount || 0) });
    } catch { return c.json({ youtube_likeCount: null, youtube_viewCount: null }); }
  });
  app.get("/api/feed/stats", async (c) => {
    try {
      const db = await ensurePersistence(c);
      if (!db) return c.json({ error: "PERSISTENCE_NOT_CONFIGURED" }, 503);
      const id = String(c.req.query("video_id") || "").trim();
      if (!id) return c.json({ error: "VIDEO_ID_REQUIRED" }, 400);
      const stats = await db.prepare("SELECT * FROM video_stats WHERE video_id = ?").bind(id).first();
      return c.json({ stats: stats || null });
    } catch (error: any) { return c.json({ error: error.message || "STATS_FAILED" }, 500); }
  });

  // === WATCH LATER ===
  app.get("/api/watch-later", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ videos: [], count: 0 });
    const db = await ensurePersistence(c).catch(() => null);
    if (db) {
    const rows = await db.prepare("SELECT data FROM watch_later WHERE user_id = ? ORDER BY created_at DESC LIMIT 200").bind(user.id).all();
    return c.json({ videos: (rows.results || []).map((row: any) => JSON.parse(row.data)), count: rows.results?.length || 0 });
    }
    return c.json({ videos: [], count: 0, error: "PERSISTENCE_NOT_CONFIGURED" }, 503);
  });
  app.post("/api/watch-later", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "AUTHENTICATION_REQUIRED" }, 401);
    try {
      const body = await c.req.json<any>();
      const id = body.youtubeId || body.id || body.platformId;
      if (!id) return c.json({ success: false, error: "Missing id/youtubeId" }, 400);
      const db = await ensurePersistence(c).catch(() => null);
      if (db) {
        const entry = {
          youtubeId: id, platformId: body.platformId || id, platform: body.platform || "youtube",
          platformMeta: body.platformMeta || platformMeta[body.platform || "youtube"] || platformMeta.youtube,
          title: body.title || "Untitled", channelName: body.channelName || body.channel || "Unknown",
          thumbnailUrl: body.thumbnailUrl || body.img || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
          views: body.views || "0 views", duration: body.duration || "0:00", category: body.category || "Tech", savedAt: Date.now()
        };
        await db.prepare("INSERT OR REPLACE INTO watch_later (user_id, video_id, data, created_at) VALUES (?, ?, ?, ?)")
          .bind(user.id, id, JSON.stringify(entry), entry.savedAt).run();
        const rows = await db.prepare("SELECT data FROM watch_later WHERE user_id = ? ORDER BY created_at DESC LIMIT 200").bind(user.id).all();
        return c.json({ success: true, videos: (rows.results || []).map((row: any) => JSON.parse(row.data)), count: rows.results?.length || 0 });
      }
      if (inMemoryWatchLater.find(v => (v.youtubeId||v.id) === id)) {
        return c.json({ success: true, videos: inMemoryWatchLater, count: inMemoryWatchLater.length, message: "Already saved" });
      }
      const entry = {
        youtubeId: id,
        platformId: body.platformId || id,
        platform: body.platform || "youtube",
        platformMeta: body.platformMeta || platformMeta[body.platform || "youtube"] || platformMeta.youtube,
        title: body.title || "Untitled",
        channelName: body.channelName || body.channel || "Unknown",
        thumbnailUrl: body.thumbnailUrl || body.img || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        views: body.views || "0 views",
        duration: body.duration || "0:00",
        category: body.category || "Tech",
        savedAt: Date.now()
      };
      inMemoryWatchLater.unshift(entry);
      if (inMemoryWatchLater.length > 200) inMemoryWatchLater = inMemoryWatchLater.slice(0,200);
      return c.json({ success: true, videos: inMemoryWatchLater, count: inMemoryWatchLater.length });
    } catch(e:any){ return c.json({ success:false, error:e.message },400); }
  });
  app.delete("/api/watch-later/:id", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "AUTHENTICATION_REQUIRED" }, 401);
    const id = c.req.param("id");
    const db = await ensurePersistence(c).catch(() => null);
    if (db) {
      await db.prepare("DELETE FROM watch_later WHERE user_id = ? AND video_id = ?").bind(user.id, id).run();
      const rows = await db.prepare("SELECT data FROM watch_later WHERE user_id = ? ORDER BY created_at DESC LIMIT 200").bind(user.id).all();
      return c.json({ success: true, videos: (rows.results || []).map((row: any) => JSON.parse(row.data)), count: rows.results?.length || 0 });
    }
    const before = inMemoryWatchLater.length;
    inMemoryWatchLater = inMemoryWatchLater.filter(v => (v.youtubeId||v.id) !== id && v.platformId !== id);
    const removed = before !== inMemoryWatchLater.length;
    return c.json({ success: removed, videos: inMemoryWatchLater, count: inMemoryWatchLater.length });
  });

  // Community Chat
  app.get("/api/community/:channel", async (c) => {
    const channel = c.req.param("channel") || "general";
    const db = await ensurePersistence(c).catch(() => null);
    if (db) {
      const result = await db.prepare("SELECT id, video_id AS videoId, channel, user_name AS userName, avatar_initials AS avatarInitials, message, timestamp_in_video AS timestampInVideo, likes, created_at AS createdAt FROM community_messages WHERE channel = ? ORDER BY created_at ASC LIMIT 200").bind(channel).all();
      return c.json({ messages: result.results || [] });
    }
    const filtered = inMemoryMessages.filter(m => m.channel === channel);
    return c.json({ messages: filtered });
  });

  app.post("/api/community/send", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "AUTHENTICATION_REQUIRED", message: "Sign in to comment." }, 401);
    const body = await c.req.json<{
      videoId?: string;
      channel?: string;
      userName?: string;
      avatarInitials?: string;
      message: string;
      timestampInVideo?: string;
    }>();

    const newMsg = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      videoId: body.videoId || "dQw4w9WgXcQ",
      channel: body.channel || "general",
      userName: user.channelName || user.email || body.userName || "Alphatekx User",
      avatarInitials: (user.channelName || user.email || "A").charAt(0).toUpperCase(),
      message: body.message,
      timestampInVideo: body.timestampInVideo || "",
      likes: 0,
      createdAt: Date.now()
    };
    const db = await ensurePersistence(c).catch(() => null);
    if (!db) return c.json({ success: false, error: "PERSISTENCE_NOT_CONFIGURED" }, 503);
    await db.prepare("INSERT INTO community_messages (id, video_id, channel, user_id, user_name, avatar_initials, message, timestamp_in_video, likes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(newMsg.id, newMsg.videoId, newMsg.channel, user.id, newMsg.userName, newMsg.avatarInitials, newMsg.message, newMsg.timestampInVideo, 0, newMsg.createdAt).run();
    await db.prepare("UPDATE video_stats SET alphatekx_comments = alphatekx_comments + 1, updated_at = ? WHERE video_id = ?").bind(Date.now(), newMsg.videoId).run();
    return c.json({ success: true, message: newMsg });
  });

  app.post("/api/video/:id/like", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "AUTHENTICATION_REQUIRED" }, 401);
    const videoId = c.req.param("id");
    const db = await ensurePersistence(c).catch(() => null);
    if (!db) return c.json({ success: false, error: "PERSISTENCE_NOT_CONFIGURED" }, 503);
    const existing = await db.prepare("SELECT 1 FROM video_likes WHERE user_id = ? AND video_id = ?").bind(user.id, videoId).first();
    if (existing) {
      await db.prepare("DELETE FROM video_likes WHERE user_id = ? AND video_id = ?").bind(user.id, videoId).run();
    } else {
      await db.prepare("INSERT INTO video_likes (user_id, video_id, created_at) VALUES (?, ?, ?)").bind(user.id, videoId, Date.now()).run();
    }
    const count = await db.prepare("SELECT COUNT(*) AS count FROM video_likes WHERE video_id = ?").bind(videoId).first();
    await db.prepare("INSERT OR IGNORE INTO video_stats (video_id, created_at, updated_at) VALUES (?, ?, ?)").bind(videoId, Date.now(), Date.now()).run();
    await db.prepare("UPDATE video_stats SET alphatekx_likes = ?, updated_at = ? WHERE video_id = ?").bind(Number((count as any)?.count || 0), Date.now(), videoId).run();
    return c.json({ success: true, liked: !existing, likeCount: Number((count as any)?.count || 0) });
  });
  app.post("/api/video/like", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "AUTHENTICATION_REQUIRED" }, 401);
    const body = await c.req.json<any>().catch(() => ({}));
    const videoId = String(body.video_id || body.videoId || "").trim();
    if (!videoId) return c.json({ success: false, error: "VIDEO_ID_REQUIRED" }, 400);
    const db = await ensurePersistence(c);
    if (!db) return c.json({ success: false, error: "PERSISTENCE_NOT_CONFIGURED" }, 503);
    await db.prepare("INSERT OR IGNORE INTO video_likes (user_id, video_id, created_at) VALUES (?, ?, ?)").bind(user.id, videoId, Date.now()).run();
    const count: any = await db.prepare("SELECT COUNT(*) AS count FROM video_likes WHERE video_id = ?").bind(videoId).first();
    await db.prepare("INSERT OR IGNORE INTO video_stats (video_id, created_at, updated_at) VALUES (?, ?, ?)").bind(videoId, Date.now(), Date.now()).run();
    await db.prepare("UPDATE video_stats SET alphatekx_likes = ?, updated_at = ? WHERE video_id = ?").bind(Number(count?.count || 0), Date.now(), videoId).run();
    return c.json({ success: true, liked: true, likeCount: Number(count?.count || 0) });
  });
  app.delete("/api/video/like", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "AUTHENTICATION_REQUIRED" }, 401);
    const body = await c.req.json<any>().catch(() => ({}));
    const videoId = String(body.video_id || body.videoId || c.req.query("video_id") || "").trim();
    if (!videoId) return c.json({ success: false, error: "VIDEO_ID_REQUIRED" }, 400);
    const db = await ensurePersistence(c);
    if (!db) return c.json({ success: false, error: "PERSISTENCE_NOT_CONFIGURED" }, 503);
    await db.prepare("DELETE FROM video_likes WHERE user_id = ? AND video_id = ?").bind(user.id, videoId).run();
    const count: any = await db.prepare("SELECT COUNT(*) AS count FROM video_likes WHERE video_id = ?").bind(videoId).first();
    await db.prepare("UPDATE video_stats SET alphatekx_likes = ?, updated_at = ? WHERE video_id = ?").bind(Number(count?.count || 0), Date.now(), videoId).run();
    return c.json({ success: true, liked: false, likeCount: Number(count?.count || 0) });
  });

  app.post("/api/channel/:id/subscribe", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "AUTHENTICATION_REQUIRED" }, 401);
    const channelId = c.req.param("id");
    const db = await ensurePersistence(c).catch(() => null);
    if (!db) return c.json({ success: false, error: "PERSISTENCE_NOT_CONFIGURED" }, 503);
    const existing = await db.prepare("SELECT 1 FROM channel_subscriptions WHERE user_id = ? AND channel_id = ?").bind(user.id, channelId).first();
    if (existing) await db.prepare("DELETE FROM channel_subscriptions WHERE user_id = ? AND channel_id = ?").bind(user.id, channelId).run();
    else await db.prepare("INSERT INTO channel_subscriptions (user_id, channel_id, created_at) VALUES (?, ?, ?)").bind(user.id, channelId, Date.now()).run();
    const count = await db.prepare("SELECT COUNT(*) AS count FROM channel_subscriptions WHERE channel_id = ?").bind(channelId).first();
    return c.json({ success: true, subscribed: !existing, subscriberCount: Number((count as any)?.count || 0) });
  });

  app.get("/api/channel/:id/subscription", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ subscribed: false });
    const db = await ensurePersistence(c).catch(() => null);
    if (!db) return c.json({ success: false, error: "PERSISTENCE_NOT_CONFIGURED" }, 503);
    const row = await db.prepare("SELECT 1 FROM channel_subscriptions WHERE user_id = ? AND channel_id = ?").bind(user.id, c.req.param("id")).first();
    return c.json({ subscribed: Boolean(row) });
  });

  // Marketplace
  app.get("/api/marketplace", async (c) => {
    const db = await ensurePersistence(c).catch(() => null);
    if (db) {
      const rows = await db.prepare("SELECT data FROM marketplace_products ORDER BY created_at DESC LIMIT 500").all();
      if ((rows.results || []).length) inMemoryProducts = (rows.results || []).map((r: any) => JSON.parse(r.data));
    }
    const category = c.req.query("category");
    let products = inMemoryProducts;
    if (category && category !== "all") {
      products = products.filter(p => p.category === category);
    }
    return c.json({ products });
  });

  app.post("/api/marketplace/sell", async (c) => {
    const body = await c.req.json<{
      name: string;
      description: string;
      price: number;
      category: string;
      sellerEmail: string;
      fileUrl?: string;
      tags?: string;
    }>();
    const newProduct = {
      id: inMemoryProducts.length + 1,
      name: body.name,
      description: body.description,
      price: body.price,
      badge: "NEW",
      iconType: body.category === "app" ? "cpu" : (body.category === "course" ? "video" : "sparkles"),
      sellerEmail: body.sellerEmail || "creator@alphatekx.ai",
      fileUrl: body.fileUrl || "https://alphatekx.ai/download/pkg.zip",
      salesCount: 0,
      category: body.category,
      tags: body.tags || "",
      relatedTopic: "ai",
      createdAt: Date.now()
    };
    inMemoryProducts.unshift(newProduct);
    const db = await ensurePersistence(c).catch(() => null);
    if (db) await db.prepare("INSERT INTO marketplace_products (id, data, created_at) VALUES (?, ?, ?)").bind(String(newProduct.id), JSON.stringify(newProduct), newProduct.createdAt).run();
    return c.json({ success: true, message: "Product listed successfully!" });
  });

  app.post("/api/marketplace/checkout", async (c) => {
    const { productId } = await c.req.json<{ productId: number }>();
    const prod = libGetProduct(inMemoryProducts, productId);
    if (!prod) return c.json({ success: false, error: "Product not found" }, 404);
    const result = libPurchaseProduct(inMemoryProducts, inMemorySales, productId);
    const db = await ensurePersistence(c).catch(() => null);
    if (db) await db.batch([
      db.prepare("INSERT INTO marketplace_sales (id, data, created_at) VALUES (?, ?, ?)").bind(String(result.sale.id), JSON.stringify(result.sale), result.sale.createdAt),
      db.prepare("INSERT INTO marketplace_products (id, data, created_at) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data").bind(String(result.product.id), JSON.stringify(result.product), result.product.createdAt)
    ]);
    return c.json({
      success: true,
      orderId: result.orderId,
      downloadUrl: result.downloadUrl,
      message: "Payment processed via Stripe Test Mode! Download ready."
    });
  });

  // === PROMPT #6: Marketplace Spec Endpoints (20% fee, Stripe) ===
  app.get("/api/marketplace/products", async (c) => {
    const db = await ensurePersistence(c).catch(() => null);
    if (db) {
      const rows = await db.prepare("SELECT data FROM marketplace_products ORDER BY created_at DESC LIMIT 500").all();
      if ((rows.results || []).length) inMemoryProducts = (rows.results || []).map((r: any) => JSON.parse(r.data));
    }
    const category = c.req.query("category");
    const query = (c.req.query("q") || "").trim().toLowerCase();
    const sort = c.req.query("sort") || "newest";
    let products = inMemoryProducts;
    if (category && category !== "all" && category !== "All") {
      products = products.filter(p => p.category === category);
    }
    if (query) {
      products = products.filter(p => [p.name, p.description, p.sellerEmail, p.tags].some(value => String(value || "").toLowerCase().includes(query)));
    }
    products = [...products].sort((a, b) => sort === "popular"
      ? Number(b.salesCount || 0) - Number(a.salesCount || 0)
      : sort === "price-low"
        ? Number(a.price) - Number(b.price)
        : sort === "price-high"
          ? Number(b.price) - Number(a.price)
          : Number(b.createdAt || 0) - Number(a.createdAt || 0));
    // Include fee breakdown for each product
    const withFees = products.map(p => {
      const fees = libCalcFees(p.price);
      return { ...p, platformFee: p.platformFee ?? fees.platformFee, sellerRevenue: p.sellerRevenue ?? fees.sellerRevenue, feeRate: 0.20 };
    });
    return c.json({ products: withFees, count: withFees.length });
  });

  app.post("/api/marketplace/products", async (c) => {
    try {
      const body = await c.req.json<any>();
      const product = libCreateProduct(inMemoryProducts, body);
      const db = await ensurePersistence(c).catch(() => null);
      if (db) await db.prepare("INSERT INTO marketplace_products (id, data, created_at) VALUES (?, ?, ?)").bind(String(product.id), JSON.stringify(product), product.createdAt).run();
      return c.json({ success: true, product, message: "Product listed successfully!" }, 201);
    } catch (e: any) {
      return c.json({ success: false, error: e.message }, 400);
    }
  });

  app.get("/api/marketplace/products/:id", async (c) => {
    const id = c.req.param("id");
    const db = await ensurePersistence(c).catch(() => null);
    if (db) {
      const row: any = await db.prepare("SELECT data FROM marketplace_products WHERE id = ?").bind(String(id)).first();
      if (row?.data) {
        const persisted = JSON.parse(row.data);
        inMemoryProducts = [persisted, ...inMemoryProducts.filter(p => String(p.id) !== String(id))];
      }
    }
    const product = libGetProduct(inMemoryProducts, id);
    if (!product) return c.json({ success: false, error: "Product not found" }, 404);
    const fees = libCalcFees(product.price);
    return c.json({ product: { ...product, platformFee: product.platformFee ?? fees.platformFee, sellerRevenue: product.sellerRevenue ?? fees.sellerRevenue, feeRate: 0.20 } });
  });

  app.post("/api/marketplace/purchase", async (c) => {
    try {
      const body = await c.req.json<{ productId: number | string; buyerEmail?: string }>();
      const buyerEmail = body.buyerEmail || "buyer@alphatekx.ai";
      // Stripe mock processing
      const product = libGetProduct(inMemoryProducts, body.productId);
      if (!product) return c.json({ success: false, error: "Product not found" }, 404);
      await libStripePay({ product, buyerEmail });
      const result = libPurchaseProduct(inMemoryProducts, inMemorySales, body.productId, buyerEmail);
      const db = await ensurePersistence(c).catch(() => null);
      if (db) {
        await db.batch([
          db.prepare("INSERT INTO marketplace_sales (id, data, created_at) VALUES (?, ?, ?)").bind(String(result.sale.id), JSON.stringify(result.sale), result.sale.createdAt),
          db.prepare("INSERT INTO marketplace_products (id, data, created_at) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data").bind(String(result.product.id), JSON.stringify(result.product), result.product.createdAt)
        ]);
      }
      return c.json({ ...result, stripe: { testMode: true, card: "4242 •••• •••• 4242" } });
    } catch (e: any) {
      return c.json({ success: false, error: e.message }, 400);
    }
  });

  app.get("/api/marketplace/sales", async (c) => {
    const sellerEmail = c.req.query("sellerEmail") || c.req.query("seller") || "";
    const db = await ensurePersistence(c).catch(() => null);
    if (db) {
      const rows = await db.prepare("SELECT data FROM marketplace_sales ORDER BY created_at DESC LIMIT 500").all();
      inMemorySales = (rows.results || []).map((r: any) => JSON.parse(r.data));
    }
    const sales = sellerEmail ? libGetSales(inMemorySales, sellerEmail) : inMemorySales;
    const summary = libSalesSummary(inMemorySales, sellerEmail || undefined);
    return c.json({ sales, summary, count: sales.length });
  });

  // Unified Queue
  app.get("/api/queue", (c) => {
    return c.json({ queue: inMemoryQueue });
  });

  app.post("/api/queue/add", async (c) => {
    const { url } = await c.req.json<{ url: string }>();
    const isTikTok = url.includes("tiktok.com");
    const platform = isTikTok ? "tiktok" : "youtube";
    
    let videoId = "dQw4w9WgXcQ";
    if (!isTikTok) {
      const match = url.match(/(?:v=|\/embed\/|\/watch\?v=|youtu\.be\/)([^#&?]+)/);
      if (match && match[1]) videoId = match[1];
    } else {
      const match = url.match(/video\/(\d+)/);
      if (match && match[1]) videoId = match[1];
    }

    const count = inMemoryQueue.length;
    const newItem = {
      id: count + 1,
      userEmail: "user@alphatekx.com",
      platform,
      videoId,
      title: isTikTok ? `TikTok Viral AI Clip #${count + 1}` : `Imported Stream: ${url.slice(0, 30)}...`,
      thumbnail: isTikTok 
        ? "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?auto=format&fit=crop&w=600&q=80"
        : `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      duration: "04:15",
      position: count,
      isPlayed: 0,
      createdAt: Date.now()
    };
    inMemoryQueue.push(newItem);
    return c.json({ success: true, queue: inMemoryQueue });
  });

  app.delete("/api/queue/:id", (c) => {
    const id = Number(c.req.param("id"));
    inMemoryQueue = inMemoryQueue.filter(q => q.id !== id);
    return c.json({ success: true, queue: inMemoryQueue });
  });

  // AI Summary & Naija Translation API
  app.post("/api/summary", async (c) => {
    const { videoId } = await c.req.json<{ videoId: string }>();
    return c.json({
      videoId,
      bullets: [
        { text: "Summarizes key concepts: neurons, layers, backpropagation & forward pass equations covered clearly.", timestamp: "2:15", seconds: 135 },
        { text: "Key timestamp: Training loop & loss function gradient descent step explained step-by-step.", timestamp: "12:30", seconds: 750 },
        { text: "Links: PyTorch code & Jupyter notebook available in GitHub repository.", timestamp: "18:45", seconds: 1125, link: "https://github.com/codecraft/nn-tutorial" }
      ],
      badge: "Alphatekx AI • Beta"
    });
  });

  app.post("/api/translate", async (c) => {
    const { lang } = await c.req.json<{ videoId: string; lang: string }>();
    const pidginBullets = [
      { text: "Dis video dey explain neurons, layers, and how backprop dey work well well with clear diagrams.", timestamp: "2:15", seconds: 135 },
      { text: "Important side: Training loop and loss function calculation show for 12:30 — watch am well!", timestamp: "12:30", seconds: 750 },
      { text: "Links: Full Python code dey GitHub repo — click download am sharp sharp.", timestamp: "18:45", seconds: 1125, link: "https://github.com/codecraft/nn-tutorial" }
    ];
    const yorubaBullets = [
      { text: "Aworan fidio yi ṣe alaye awọn opo nẹtiwọki neural, awọn iwọn, ati sọfitiwia koodu PyTorch.", timestamp: "2:15", seconds: 135 },
      { text: "Akokọ pataki: Ẹkọ ikẹkọ ati iṣiro aṣiṣe ni a ṣe alaye ni wakati 12:30.", timestamp: "12:30", seconds: 750 },
      { text: "Awọn ajapọ: Koodu kọnputa wa lori iwe GitHub fun igbasilẹ pẹlu tẹ nikan.", timestamp: "18:45", seconds: 1125, link: "https://github.com/codecraft/nn-tutorial" }
    ];

    const bullets = lang === "Pidgin" ? pidginBullets : (lang === "Yoruba" ? yorubaBullets : pidginBullets);
    return c.json({ lang, bullets, badge: `Naija Translator ON - ${lang}` });
  });

  const proSubscriptions = (globalThis as any).__proSubscriptions || ((globalThis as any).__proSubscriptions = new Map<string, any>());

  // AI features use the authenticated session and the real Groq API. Usage is
  // intentionally kept in memory here; replace this map with durable storage
  // when persistent billing storage is available.
  const aiUsage = (globalThis as any).__aiUsage || ((globalThis as any).__aiUsage = new Map<string, number>());
  const aiLimits: Record<string, number> = { jot: 2, teacher: 2, thumbnail: 2, voice: 2, translator: 2, video_gen: 2, vibe_code: 2, capture: 2, memory: 2, workspace: Number.POSITIVE_INFINITY };
  const planLimits = {
    free: { window: 2, weekly: 2, priceUsd: 0, priceNgn: 0 },
    lite: { window: 30, weekly: 150, priceUsd: 5, priceNgn: 5000 },
    pro: { window: 100, weekly: 500, priceUsd: 19, priceNgn: 28500 },
  } as const;
  function getPlanLimits(plan: string) {
    return planLimits[plan as keyof typeof planLimits] || planLimits.free;
  }
  async function aiRateLimitStatus(c: any, userId: string) {
    const db = await ensurePersistence(c);
    if (!db) throw new Error("PERSISTENCE_NOT_CONFIGURED");
    const now = Date.now();
    const fiveHours = 5 * 60 * 60 * 1000;
    const week = 7 * 24 * 60 * 60 * 1000;
    const subscription: any = await subscriptionFor(c, userId);
    const requestedPlan = String(subscription?.plan || "free").toLowerCase();
    const plan = getPlanLimits(requestedPlan) === planLimits.free && requestedPlan !== "free"
      ? "free"
      : ((subscription?.active || requestedPlan !== "free") && (!subscription?.expiresAt || Number(subscription.expiresAt) > now) ? requestedPlan : "free");
    let row: any = await db.prepare("SELECT window_start, used_in_window, weekly_used, week_start FROM ai_usage WHERE user_id = ? AND feature = '__all__'").bind(userId).first();
    const windowStart = row?.window_start && now - Number(row.window_start) <= fiveHours ? Number(row.window_start) : now;
    const weekStart = row?.week_start && now - Number(row.week_start) <= week ? Number(row.week_start) : now;
    const usedInWindow = windowStart === Number(row?.window_start) ? Number(row?.used_in_window || 0) : 0;
    const weeklyUsed = weekStart === Number(row?.week_start) ? Number(row?.weekly_used || 0) : 0;
    await db.prepare("INSERT INTO ai_usage (user_id, feature, window_start, used_in_window, weekly_used, week_start, plan, last_used) VALUES (?, '__all__', ?, ?, ?, ?, ?, ?) ON CONFLICT(user_id, feature) DO UPDATE SET window_start = excluded.window_start, used_in_window = excluded.used_in_window, weekly_used = excluded.weekly_used, week_start = excluded.week_start, plan = excluded.plan")
      .bind(userId, windowStart, usedInWindow, weeklyUsed, weekStart, plan, now).run();
    const limits = getPlanLimits(plan);
    return {
      plan,
      usedInWindow,
      weeklyUsed,
      windowLimit: limits.window,
      weeklyLimit: limits.weekly,
      remainingWindow: Math.max(0, limits.window - usedInWindow),
      remainingWeekly: Math.max(0, limits.weekly - weeklyUsed),
      windowResetIn: Math.max(0, fiveHours - (now - windowStart)),
      weekResetIn: Math.max(0, week - (now - weekStart)),
    };
  }
  async function consumeAiRateLimit(c: any, userId: string) {
    const status = await aiRateLimitStatus(c, userId);
    if (!status.remainingWindow || !status.remainingWeekly) return { ...status, allowed: false };
    const db = await ensurePersistence(c);
    const updated: any = await db.prepare("UPDATE ai_usage SET used_in_window = used_in_window + 1, weekly_used = weekly_used + 1, last_used = ? WHERE user_id = ? AND feature = '__all__' AND used_in_window < ? AND weekly_used < ?")
      .bind(Date.now(), userId, status.windowLimit, status.weeklyLimit).run();
    if (!updated.meta?.changes) return { ...status, allowed: false };
    return { ...status, allowed: true, usedInWindow: status.usedInWindow + 1, weeklyUsed: status.weeklyUsed + 1, remainingWindow: status.remainingWindow - 1, remainingWeekly: status.remainingWeekly - 1 };
  }
  async function historyForUser(c: any, userId: string, kind: "watched" | "searched") {
    const env: any = c.env || {};
    if (env.DB) {
      try {
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS user_history (user_id TEXT NOT NULL, kind TEXT NOT NULL, item_id TEXT NOT NULL, data TEXT NOT NULL, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (user_id, kind, item_id))").run();
        const result = await env.DB.prepare("SELECT data FROM user_history WHERE user_id = ? AND kind = ? ORDER BY updated_at DESC LIMIT 100").bind(userId, kind).all();
        return (result.results || []).map((row: any) => JSON.parse(row.data));
      } catch (error: any) { console.error("[history] D1 read failed", error?.message || error); }
    }
    if (env.KV) {
      try { return (await env.KV.get(`history:${userId}:${kind}`, "json")) || []; } catch (error: any) { console.error("[history] KV read failed", error?.message || error); }
    }
    return [];
  }
  async function saveHistoryForUser(c: any, userId: string, kind: "watched" | "searched", item: any) {
    const env: any = c.env || {};
    const itemId = String(item.videoId || item.youtubeId || item.id || "").trim();
    if (!itemId) return;
    if (env.DB) {
      try {
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS user_history (user_id TEXT NOT NULL, kind TEXT NOT NULL, item_id TEXT NOT NULL, data TEXT NOT NULL, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (user_id, kind, item_id))").run();
        await env.DB.prepare("INSERT INTO user_history (user_id, kind, item_id, data, updated_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP) ON CONFLICT(user_id, kind, item_id) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP").bind(userId, kind, itemId, JSON.stringify({ ...item, videoId: itemId, updatedAt: Date.now() })).run();
        return;
      } catch (error: any) { console.error("[history] D1 write failed", error?.message || error); }
    }
    if (env.KV) {
      try {
        const current: any[] = (await env.KV.get(`history:${userId}:${kind}`, "json")) || [];
        const next = [{ ...item, videoId: itemId, updatedAt: Date.now() }, ...current.filter(row => String(row.videoId || row.youtubeId || row.id) !== itemId)].slice(0, 100);
        await env.KV.put(`history:${userId}:${kind}`, JSON.stringify(next));
      } catch (error: any) { console.error("[history] KV write failed", error?.message || error); }
    }
  }
  async function getVideoContext(c: any, body: any) {
    const videoId = String(body.videoId || "").trim();
    let title = String(body.title || "this video").trim();
    let description = String(body.description || body.transcript || "").trim();
    if (videoId && (c.env as Env)?.YOUTUBE_API_KEY) {
      try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${encodeURIComponent(videoId)}&key=${encodeURIComponent((c.env as Env).YOUTUBE_API_KEY as string)}`);
        const data: any = await response.json();
        const snippet = data.items?.[0]?.snippet;
        if (snippet) {
          title = snippet.title || title;
          description = [snippet.description, description].filter(Boolean).join("\n").slice(0, 12000);
        }
      } catch {}
    }
    if (videoId) {
      try {
        const captions = await fetch(`https://video.google.com/timedtext?lang=en&v=${encodeURIComponent(videoId)}`);
        if (captions.ok) {
          const xml = await captions.text();
          const transcript = [...xml.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/g)]
            .map(match => match[1].replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/<[^>]+>/g, " ").trim())
            .filter(Boolean).join(" ");
          if (transcript) description = transcript.slice(0, 30000);
        }
      } catch {}
    }
    return { videoId, title, transcript: description || "No public transcript was provided. Be transparent about uncertainty and use the available title/context." };
  }
  function decodeTranscriptText(value: string) {
    return value.replace(/&#39;|&#x27;/gi, "'").replace(/&quot;|&#x22;/gi, '"').replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }
  async function getYouTubeCaptionSegments(videoId: string) {
    const page = await fetch(`https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!page.ok) return [];
    const html = await page.text();
    const match = html.match(/"captionTracks":\s*(\[[\s\S]*?\])/) || html.match(/\\"captionTracks\\":\s*(\[[\s\S]*?\])/);
    let tracks: any[] = [];
    if (match) {
      try { tracks = JSON.parse(match[1].replace(/\\"/g, '"').replace(/\\u0026/g, "&")); } catch {}
    }
    const urls = tracks.sort((a: any, b: any) => Number(b.languageCode === "en") - Number(a.languageCode === "en")).map((item: any) => item.baseUrl).filter(Boolean);
    urls.push(`https://www.youtube.com/api/timedtext?v=${encodeURIComponent(videoId)}&lang=en&fmt=json3`);
    urls.push(`https://video.google.com/timedtext?lang=en&v=${encodeURIComponent(videoId)}`);
    for (const url of urls) {
      const response = await fetch(url);
      if (!response.ok) continue;
      const text = await response.text();
      try {
        const json = JSON.parse(text);
        if (Array.isArray(json.events)) {
          const segments = json.events.filter((event: any) => event.segs).map((event: any) => ({
            text: decodeTranscriptText(event.segs.map((segment: any) => segment.utf8 || "").join("")),
            start: Number(event.tStartMs || 0) / 1000,
            duration: Number(event.dDurationMs || 0) / 1000,
          })).filter((item: any) => item.text);
          if (segments.length) return segments;
        }
      } catch {}
      const segments = [...text.matchAll(/<text[^>]*start="([\d.]+)"[^>]*dur="([\d.]+)"[^>]*>([\s\S]*?)<\/text>/g)]
        .map(match => ({ text: decodeTranscriptText(match[3]), start: Number(match[1]), duration: Number(match[2]) })).filter(item => item.text);
      if (segments.length) return segments;
    }
    return [];
  }
  async function getYouTubeTranscript(videoId: string) {
    try {
      return (await getYouTubeCaptionSegments(videoId)).map(segment => segment.text).join(" ").trim();
    } catch (error) {
      console.error("[ai-jot] YouTube transcript failed", error);
      return "";
    }
  }
  async function groqWhisperTranscribe(c: any, fileUrl: string) {
    const apiKey = (c.env as Env)?.GROQ_API_KEY;
    if (!apiKey || !fileUrl) return "";
    try {
      const source = await fetch(fileUrl);
      if (!source.ok) return "";
      const bytes = await source.arrayBuffer();
      if (!bytes.byteLength || bytes.byteLength > 25 * 1024 * 1024) return "";
      const form = new FormData();
      form.append("file", new Blob([bytes], { type: source.headers.get("content-type") || "audio/mp4" }), "video-audio");
      form.append("model", "whisper-large-v3");
      form.append("response_format", "json");
      const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
        body: form,
      });
      const data: any = await response.json().catch(() => ({}));
      return response.ok && typeof data.text === "string" ? data.text.trim() : "";
    } catch (error) {
      console.error("[ai-jot] Groq transcription failed", error);
      return "";
    }
  }
  async function runAiJot(c: any, body: any) {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "AUTHENTICATION_REQUIRED", message: "Sign in to use AI Jot." }, 401);
    const rate = await aiRateLimitStatus(c, user.id);
    if (rate.remainingWindow <= 0 || rate.remainingWeekly <= 0) {
      return c.json({ success: false, error: "AI_RATE_LIMIT_REACHED", message: "Rate limit reached. Try again after the reset window.", retry_after: rate.windowResetIn, ...rate }, 429);
    }
    let videoId = String(body.youtube_id || body.videoId || "").trim();
    if (!videoId && body.video_url) videoId = String(body.video_url).match(/(?:v=|youtu\.be\/|shorts\/)([A-Za-z0-9_-]{11})/)?.[1] || "";
    let transcript = videoId ? await getYouTubeTranscript(videoId) : "";
    let source = transcript ? "youtube_transcript" : "";
    const suppliedVideoUrl = String(body.video_url || "");
    const isYouTubeUrl = /(?:youtube\.com|youtu\.be)\//i.test(suppliedVideoUrl);
    if (!transcript && (body.file_url || body.video_url) && !isYouTubeUrl) {
      transcript = await groqWhisperTranscribe(c, String(body.file_url || body.video_url));
      if (transcript) source = "groq_whisperflow";
    }
    if (transcript.length < 10) return c.json({ success: false, error: "TRANSCRIPT_UNAVAILABLE", message: "Could not capture transcript. No captions were found and Groq Whisperflow could not transcribe the audio." }, 400);
    const prompt = `Create faithful AI Jot notes from this complete transcript. Preserve every spoken idea in order; clean filler and repetition without omitting meaning. Return JSON with summary (string), key_points (array), cleaned_transcript (string), action_items (array), and jots (array of {time, seconds, text, summary}). Do not invent timestamps; use 0:00 when unavailable.\n\nCOMPLETE TRANSCRIPT:\n${transcript.slice(0, 30000)}`;
    const apiKey = (c.env as Env)?.GROQ_API_KEY;
    if (!apiKey) return c.json({ success: false, error: "GROQ_NOT_CONFIGURED" }, 503);
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: (c.env as Env)?.GROQ_MODEL || "llama-3.1-8b-instant", temperature: 0.2, response_format: { type: "json_object" }, messages: [{ role: "system", content: "You are AI Jot. Never add facts that are not in the transcript." }, { role: "user", content: prompt }] }),
    });
    const data: any = await response.json().catch(() => ({}));
    if (!response.ok) return c.json({ success: false, error: "GROQ_REQUEST_FAILED", detail: String(data.error?.message || "").slice(0, 500) }, 502);
    const content = data.choices?.[0]?.message?.content;
    if (!content) return c.json({ success: false, error: "GROQ_EMPTY_RESPONSE" }, 502);
    let result: any;
    try { result = JSON.parse(content); } catch { result = { summary: content, cleaned_transcript: transcript, jots: [{ time: "0:00", seconds: 0, text: content, summary: "AI Jot" }] }; }
    if (!Array.isArray(result.jots) || result.jots.length === 0) {
      const points = Array.isArray(result.key_points) ? result.key_points : [];
      result.jots = points.length
        ? points.map((point: any) => ({ time: "0:00", seconds: 0, text: String(point), summary: "Key point" }))
        : [{ time: "0:00", seconds: 0, text: String(result.cleaned_transcript || result.summary || transcript).slice(0, 1000), summary: "Captured transcript" }];
    }
    const consumed = await consumeAiRateLimit(c, user.id);
    if (!consumed.allowed) return c.json({ success: false, error: "AI_RATE_LIMIT_REACHED", ...consumed }, 429);
    await incrementUsage(c, "ai_usage", user.id, "jot");
    return c.json({ success: true, source, transcript, transcript_length: transcript.length, result, usage: consumed });
  }
  async function runGroq(c: any, feature: "teacher" | "jot" | "capture" | "workspace" | "memory", body: any) {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "AUTHENTICATION_REQUIRED", message: "Sign in to use AI features." }, 401);

    const subscription = await subscriptionFor(c, user.id);
    const isPro = Boolean(subscription && (subscription.active || subscription.plan === "pro") && (!subscription.expiresAt || Number(subscription.expiresAt) > Date.now()));
    const keys: any = feature === "workspace"
      ? await c.env?.DB?.prepare("SELECT openai_key, gemini_key FROM user_api_keys WHERE user_id = ?").bind(user.id).first().catch(() => null)
      : null;
    if (feature === "workspace" && !isPro && !keys?.openai_key) {
      return c.json({ success: false, error: "BYOK_OR_PRO_REQUIRED", message: "Bring your own key or upgrade to Pro to use Workspace AI.", upgradeUrl: "/pricing" }, 403);
    }
    const rate = await aiRateLimitStatus(c, user.id);
    if (rate.remainingWindow <= 0 || rate.remainingWeekly <= 0) {
      return c.json({ success: false, error: "AI_RATE_LIMIT_REACHED", message: "Rate limit reached. Try again after the 5-hour window or weekly reset.", feature, retry_after: rate.windowResetIn, ...rate, upgradeUrl: "/pricing" }, 429);
    }

    const messageInput = Array.isArray(body.messages)
      ? body.messages.filter((m: any) => m?.role === "user").map((m: any) => m.content).join("\n")
      : "";
    const input = String(body.question || body.prompt || body.message || body.goal || body.text || body.content || messageInput || "").trim();
    if (!input) return c.json({ success: false, error: "PROMPT_REQUIRED" }, 400);
    const apiKey = feature === "workspace" && !isPro ? String(keys?.openai_key || "") : (c.env as Env)?.GROQ_API_KEY;
    if (!apiKey) return c.json({ success: false, error: "GROQ_NOT_CONFIGURED" }, 503);

    const context = await getVideoContext(c, body);
    const question = String(body.question || "").trim();
    const instructions = feature === "teacher"
      ? question
        ? "You are Alphatekx AI Teacher, a patient expert tutor for any subject. Teach the concept clearly, adapt to the learner's level, explain reasoning step by step, use a short example when useful, and finish with one brief check-for-understanding question. If optional video context is supplied, use it as supporting context; otherwise answer from your broad knowledge. Never invent citations or timestamps. Return JSON with an answer string and optional keyPoints array."
        : "You are Alphatekx AI Teacher. Build a practical, progressive learning path for any subject. Return JSON with goal and steps. Each step must have title, description, and searchQuery. Make the plan specific, beginner-friendly, and actionable."
      : feature === "capture"
        ? "You are Alphatekx AI Capture. Clean a raw real-time transcript into accurate, well-organized study notes. Preserve every important idea, definition, example, decision, and action item. Remove filler and repetition, but never invent content. Return JSON with title, summary, sections (each with heading and bullets), keyTerms, and actionItems."
      : feature === "jot"
        ? "You are AI Jot, a faithful capture tool, not a teacher or summarizer. Reproduce everything present in the supplied transcript in order, preserving wording and all meaningful spoken points. Do not condense, explain, or omit content. Split the complete capture into sequential jots with time, seconds, text, and summary fields; summary must be a short label only. Never invent timestamps or content."
        : feature === "memory"
          ? "You are an AI memory assistant. Answer the user's question using only the supplied watch and search history. Be clear when the history does not contain enough evidence. Return JSON with answer and sources (each source has title, videoId, and timestamp). Never invent videos, timestamps, or facts."
          : "You are the Alphatekx AI Workspace agent. Build or explain what the user requests. For code, always return one or more complete files using <create_file path=\"index.html\">...</create_file> tags (also use style.css and script.js when useful). Never omit the file tags. Return concise plain text outside the tags only when explanation is needed.";
    const enrichedInput = [
      input,
      context.videoId ? `Video ID: ${context.videoId}` : "",
      body.videoId || body.title || body.description || body.transcript ? `Optional video context - title: ${context.title}\n${context.transcript.slice(0, 12000)}` : "",
      feature === "memory" ? `Persisted watch/search history: ${JSON.stringify(body.history || []).slice(0, 20000)}` : "",
      feature === "workspace" && body.workspaceCode ? `Current workspace code:\n${String(body.workspaceCode).slice(0, 30000)}` : "",
      feature === "workspace" && body.workspaceFiles ? `Current workspace files:\n${JSON.stringify(body.workspaceFiles).slice(0, 30000)}` : "",
    ].filter(Boolean).join("\n\n");
    const providerUrl = feature === "workspace" && !isPro ? "https://api.openai.com/v1/chat/completions" : "https://api.groq.com/openai/v1/chat/completions";
    const groqHeaders = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };
    const providerRequest = (jsonMode: boolean) => ({
      model: feature === "workspace" && !isPro ? "gpt-4o-mini" : ((c.env as Env)?.GROQ_MODEL || "llama-3.1-8b-instant"),
      temperature: 0.2,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
      messages: [{ role: "system", content: instructions }, { role: "user", content: enrichedInput }],
    });
    const useJsonMode = feature !== "workspace";
    let response = await fetch(providerUrl, {
      method: "POST",
      headers: groqHeaders,
      body: JSON.stringify(providerRequest(useJsonMode)),
    });
    // Some configured Groq models reject JSON mode even though chat works.
    // Retry once without that optional constraint before reporting a failure.
    if (!response.ok && response.status === 400) {
      response = await fetch(providerUrl, {
        method: "POST",
        headers: groqHeaders,
        body: JSON.stringify(providerRequest(false)),
      });
    }
    if (!response.ok) {
      const detail = await response.text();
      return c.json({ success: false, error: "GROQ_REQUEST_FAILED", detail: detail.slice(0, 500) }, 502);
    }
    const data: any = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return c.json({ success: false, error: "GROQ_EMPTY_RESPONSE" }, 502);
    let result: any;
    try { result = JSON.parse(content); } catch { result = { answer: content, text: content }; }
    if (feature === "teacher" && question && !result.answer) result.answer = result.text || content;
    const consumed = await consumeAiRateLimit(c, user.id);
    if (!consumed.allowed) return c.json({ success: false, error: "AI_RATE_LIMIT_REACHED", message: "Rate limit reached while completing the request. Try again after the reset window.", feature, retry_after: consumed.windowResetIn, ...consumed }, 429);
    await incrementUsage(c, "ai_usage", user.id, feature);
    return c.json({ success: true, feature, result, message: content, usage: consumed });
  }

  // AI Teacher Course Builder
  app.post("/api/teacher/build", async (c) => {
    let body: any = {};
    try { body = await c.req.json(); } catch { return c.json({ success: false, error: "INVALID_JSON" }, 400); }
    return runGroq(c, "teacher", body);
  });
  app.post("/api/teacher", async (c) => {
    let body: any = {};
    try { body = await c.req.json(); } catch { return c.json({ success: false, error: "INVALID_JSON" }, 400); }
    return runGroq(c, "teacher", body);
  });

  app.post("/api/jot", async (c) => {
    let body: any = {};
    try { body = await c.req.json(); } catch { return c.json({ success: false, error: "INVALID_JSON" }, 400); }
    return runAiJot(c, body);
  });
  app.post("/api/ai/jot", async (c) => {
    let body: any = {};
    try { body = await c.req.json(); } catch { return c.json({ success: false, error: "INVALID_JSON" }, 400); }
    return runAiJot(c, body);
  });
  app.post("/api/ai/jot/captions", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "AUTHENTICATION_REQUIRED", message: "Sign in to use AI Jot." }, 401);
    const body: any = await c.req.json().catch(() => ({}));
    const videoId = String(body.youtube_id || body.videoId || "").trim();
    if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) return c.json({ success: false, error: "VIDEO_ID_REQUIRED" }, 400);
    const segments = await getYouTubeCaptionSegments(videoId);
    const transcript = segments.map(segment => segment.text).join(" ").trim();
    if (!transcript) return c.json({ success: false, error: "CAPTIONS_UNAVAILABLE", message: "This video has no readable captions." }, 404);
    const rate = await consumeAiRateLimit(c, user.id);
    if (!rate.allowed) return c.json({ success: false, error: "AI_TRIAL_LIMIT_REACHED", message: rate.plan === "free" ? "You have used your 2 free AI trials. Upgrade to continue." : "Your subscription AI limit has been reached.", ...rate, upgradeUrl: "/pricing" }, 429);
    await incrementUsage(c, "ai_usage", user.id, "jot");
    return c.json({ success: true, source: "youtube-captions", transcript: segments, fullText: transcript, transcript_length: transcript.length, usage: rate });
  });
  app.post("/api/ai-jot-cleanup", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "AUTHENTICATION_REQUIRED" }, 401);
    const body: any = await c.req.json().catch(() => ({}));
    const fullTranscript = String(body.fullTranscript || "").trim();
    if (!fullTranscript) return c.json({ success: false, error: "TRANSCRIPT_REQUIRED" }, 400);
    let usageResult: any = null;
    if (body.chargeUsage === true) {
      usageResult = await aiRateLimitStatus(c, user.id);
      if (!usageResult.remainingWindow || !usageResult.remainingWeekly) return c.json({ success: false, error: "AI_TRIAL_LIMIT_REACHED", message: usageResult.plan === "free" ? "You have used your 2 free AI trials. Upgrade to continue." : "Your subscription AI limit has been reached.", ...usageResult, upgradeUrl: "/pricing" }, 429);
    }
    const key = (c.env as Env).GROQ_API_KEY;
    if (!key) return c.json({ success: false, error: "GROQ_NOT_CONFIGURED" }, 503);
    const prompt = `Clean this transcript from "${String(body.videoTitle || "video")}". Remove filler, stutters, repeated words and stage directions while preserving every meaningful idea. Return JSON with cleanedTranscript, summary, keyPoints, quotes, actionItems, and neatNotesMarkdown. Do not invent facts.\n\n${fullTranscript.slice(0, 30000)}`;
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: (c.env as Env).GROQ_MODEL || "openai/gpt-oss-120b", temperature: 0.2, response_format: { type: "json_object" }, messages: [{ role: "system", content: "You are Alphatekx Smart Cleanup AI. Preserve meaning exactly." }, { role: "user", content: prompt }] }),
    });
    const data: any = await response.json().catch(() => ({}));
    if (!response.ok) return c.json({ success: false, error: "GROQ_REQUEST_FAILED", detail: data.error?.message || "" }, 502);
    const content = data.choices?.[0]?.message?.content || "";
    let result: any;
    try { result = JSON.parse(content); } catch { result = { cleanedTranscript: fullTranscript, summary: content, keyPoints: [], quotes: [], actionItems: [], neatNotesMarkdown: content }; }
    if (body.chargeUsage === true) {
      usageResult = await consumeAiRateLimit(c, user.id);
      if (!usageResult.allowed) return c.json({ success: false, error: "AI_TRIAL_LIMIT_REACHED", ...usageResult }, 429);
      await incrementUsage(c, "ai_usage", user.id, "jot");
    }
    return c.json({ success: true, ...result, modelUsed: (c.env as Env).GROQ_MODEL || "openai/gpt-oss-120b", ...(usageResult ? { usage: usageResult } : {}) });
  });
  app.post("/api/ai/jot/groq", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "AUTHENTICATION_REQUIRED" }, 401);
    const rate = await aiRateLimitStatus(c, user.id);
    if (rate.remainingWindow <= 0 || rate.remainingWeekly <= 0) return c.json({ success: false, error: "AI_RATE_LIMIT_REACHED", ...rate }, 429);
    const form = await c.req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return c.json({ success: false, error: "AUDIO_FILE_REQUIRED" }, 400);
    const request = new FormData();
    request.append("file", file, file.name || "capture.webm");
    request.append("model", "whisper-large-v3");
    request.append("response_format", "json");
    const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST", headers: { Authorization: `Bearer ${(c.env as Env).GROQ_API_KEY || ""}` }, body: request,
    });
    const data: any = await response.json().catch(() => ({}));
    if (!response.ok || !data.text) return c.json({ success: false, error: "GROQ_REQUEST_FAILED", detail: String(data.error?.message || "").slice(0, 500) }, 502);
    const consumed = await consumeAiRateLimit(c, user.id);
    if (!consumed.allowed) return c.json({ success: false, error: "AI_RATE_LIMIT_REACHED", ...consumed }, 429);
    await incrementUsage(c, "ai_usage", user.id, "jot");
    return c.json({ success: true, transcript: String(data.text).trim(), source: "groq_whisperflow", usage: consumed });
  });
  app.post("/api/ai/jot/summary", async (c) => {
    let body: any = {};
    try { body = await c.req.json(); } catch { return c.json({ success: false, error: "INVALID_JSON" }, 400); }
    const transcript = String(body.transcript || "").trim();
    if (!transcript) return c.json({ success: false, error: "TRANSCRIPT_REQUIRED" }, 400);
    return runGroq(c, "jot", { ...body, prompt: `Create faithful notes from this transcript without omitting meaning:\n\n${transcript.slice(0, 30000)}`, transcript });
  });
  app.post("/api/jot/create", async (c) => {
    let body: any = {};
    try { body = await c.req.json(); } catch { return c.json({ success: false, error: "INVALID_JSON" }, 400); }
    return runAiJot(c, body);
  });
  app.get("/api/ai-jot", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "AUTHENTICATION_REQUIRED", message: "Sign in to use AI Jot." }, 401);
    const videoId = c.req.query("videoId") || "";
    if (!videoId) return c.json({ success: false, error: "VIDEO_ID_REQUIRED" }, 400);
    return runAiJot(c, { videoId });
  });
  app.post("/api/capture/clean", async (c) => {
    let body: any = {};
    try { body = await c.req.json(); } catch { return c.json({ success: false, error: "INVALID_JSON" }, 400); }
    const transcript = String(body.transcript || "").trim();
    if (!transcript) return c.json({ success: false, error: "TRANSCRIPT_REQUIRED" }, 400);
    return runGroq(c, "capture", {
      ...body,
      prompt: `Clean this live transcript into polished notes:\n\n${transcript.slice(0, 30000)}`,
      transcript,
    });
  });
  app.post("/api/workspace", async (c) => {
    let body: any = {};
    try { body = await c.req.json(); } catch { return c.json({ success: false, error: "INVALID_JSON" }, 400); }
    return runGroq(c, "workspace", body);
  });
  app.post("/api/workspace/generate", async (c) => {
    let body: any = {};
    try { body = await c.req.json(); } catch { return c.json({ success: false, error: "INVALID_JSON" }, 400); }
    return runGroq(c, "workspace", body);
  });
  const workspaceStore = (globalThis as any).__workspaceStore || ((globalThis as any).__workspaceStore = new Map<string, any>());
  app.get("/api/workspace/saved", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "AUTHENTICATION_REQUIRED" }, 401);
    const videoId = c.req.query("videoId") || "default";
    return c.json({ success: true, workspace: workspaceStore.get(`${user.id}:${videoId}`) || null });
  });
  app.post("/api/workspace/save", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "AUTHENTICATION_REQUIRED" }, 401);
    let body: any = {};
    try { body = await c.req.json(); } catch { return c.json({ success: false, error: "INVALID_JSON" }, 400); }
    const videoId = String(body.videoId || "default");
    const code = String(body.code || "");
    if (!code.trim()) return c.json({ success: false, error: "CODE_REQUIRED" }, 400);
    const workspace = { id: `${user.id}:${videoId}`, userId: user.id, videoId, code, updatedAt: new Date().toISOString() };
    workspaceStore.set(workspace.id, workspace);
    return c.json({ success: true, workspace });
  });
  app.post("/api/ai", async (c) => {
    let body: any = {};
    try { body = await c.req.json(); } catch { return c.json({ success: false, error: "INVALID_JSON" }, 400); }
    const feature = body.workspaceType === "workspace" ? "workspace" : (body.feature === "jot" ? "jot" : "teacher");
    return runGroq(c, feature, body);
  });
  app.post("/api/ai/teacher", async (c) => {
    let body: any = {};
    try { body = await c.req.json(); } catch { return c.json({ success: false, error: "INVALID_JSON" }, 400); }
    return runGroq(c, "teacher", body);
  });
  app.post("/api/ai/jot", async (c) => {
    let body: any = {};
    try { body = await c.req.json(); } catch { return c.json({ success: false, error: "INVALID_JSON" }, 400); }
    return runAiJot(c, body);
  });
  app.post("/api/ai/workspace", async (c) => {
    let body: any = {};
    try { body = await c.req.json(); } catch { return c.json({ success: false, error: "INVALID_JSON" }, 400); }
    return runGroq(c, "workspace", body);
  });
  app.get("/api/marketplace/apps", (c) => c.json({ apps: (globalThis as any).__marketplaceApps || [] }));
  app.post("/api/marketplace-publish", async (c) => {
    let body: any;
    try { body = await c.req.json(); } catch { return c.json({ success: false, error: "INVALID_JSON" }, 400); }
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "IDENTITY_REQUIRED" }, 401);
    const allowance = await checkUsage(c, "market_usage", user.id, 5);
    if (!allowance.allowed) return c.json({ success: false, error: "MARKETPLACE_LIMIT_EXCEEDED", message: "You can publish up to 5 marketplace apps per month.", used: allowance.used, limit: allowance.limit, upgradeUrl: "/pricing" }, 403);
    const title = String(body.title || "").trim();
    const code = String(body.appCode || body.code || "").trim();
    const price = Number(body.price);
    if (!title || !code || !Number.isFinite(price) || price < 5 || price > 50) return c.json({ success: false, error: "TITLE_CODE_AND_PRICE_REQUIRED" }, 400);
    const apps = (globalThis as any).__marketplaceApps || ((globalThis as any).__marketplaceApps = []);
    const app = { id: `ai_app_${Date.now()}`, title, code, price, creatorId: user.id, creatorName: user.channelName || user.email || "Creator", createdAt: Date.now() };
    apps.unshift(app);
    await incrementUsage(c, "market_usage", user.id);
    return c.json({ success: true, app });
  });

  // Watch History & Vector Search Memory
  app.post("/api/history/save", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "AUTHENTICATION_REQUIRED" }, 401);
    let body: any;
    try { body = await c.req.json(); } catch { return c.json({ success: false, error: "INVALID_JSON" }, 400); }
    await saveHistoryForUser(c, user.id, "watched", body);
    return c.json({ success: true });
  });

  app.get("/api/history", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "AUTHENTICATION_REQUIRED" }, 401);
    const kind = c.req.query("kind") === "searched" ? "searched" : "watched";
    const history = await historyForUser(c, user.id, kind);
    return c.json({ success: true, kind, history, count: history.length });
  });

  app.get("/api/memory/search", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "AUTHENTICATION_REQUIRED" }, 401);
    const q = (c.req.query("q") || "").trim().toLowerCase();
    const rows = [...await historyForUser(c, user.id, "watched"), ...await historyForUser(c, user.id, "searched")];
    const seen = new Set<string>();
    const results = rows.filter((item: any) => {
      const id = String(item.videoId || item.youtubeId || item.id || "");
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return !q || JSON.stringify(item).toLowerCase().includes(q);
    }).slice(0, 50).map((item: any) => ({
      videoId: item.videoId || item.youtubeId || item.id,
      title: item.title || "Untitled video",
      timestamp: item.timestamp || item.currentTime || "00:00",
      snippet: item.description || item.snippet || `Watched ${item.watchedAtStr || "recently"}`,
      matchScore: "history"
    }));
    return c.json({ success: true, results });
  });

  app.post("/api/memory/chat", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "AUTHENTICATION_REQUIRED" }, 401);
    let body: any;
    try { body = await c.req.json(); } catch { return c.json({ success: false, error: "INVALID_JSON" }, 400); }
    const records = [...await historyForUser(c, user.id, "watched"), ...await historyForUser(c, user.id, "searched")].slice(0, 100);
    if (!records.length) return c.json({ success: false, error: "NO_HISTORY", message: "Watch or search for videos before asking Memory." }, 404);
    const response = await runGroq(c, "memory", { ...body, prompt: body.message || body.question, history: records });
    return response;
  });

  // Paystack subscriptions
  async function verifySubscriptionPayment(c: any, user: any, reference: string, requestedPlan?: string) {
    const secret = (c.env as Env)?.PAYSTACK_SECRET_KEY;
    if (!secret) return c.json({ success: false, error: "PAYSTACK_NOT_CONFIGURED" }, 503);
    if (!reference) return c.json({ success: false, error: "REFERENCE_REQUIRED" }, 400);
    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    const data: any = await response.json().catch(() => ({}));
    const transaction = data.data;
    if (!response.ok || !data.status || transaction?.status !== "success") {
      return c.json({ success: false, error: data.message || "PAYSTACK_VERIFICATION_FAILED" }, 502);
    }
    const transactionUserId = String(transaction?.metadata?.userId || "");
    const transactionEmail = String(transaction?.customer?.email || "").toLowerCase();
    const metadataPlan = String(transaction?.metadata?.plan || "").toLowerCase();
    const paidPlan = metadataPlan === "lite" || requestedPlan === "lite" ? "lite" : metadataPlan === "yearly" ? "yearly" : "monthly";
    const expectedAmount = paidPlan === "lite"
      ? Number((c.env as Env)?.PAYSTACK_LITE_AMOUNT || "500000")
      : paidPlan === "yearly"
        ? Number((c.env as Env)?.PAYSTACK_YEARLY_AMOUNT || "15000000")
        : Number((c.env as Env)?.PAYSTACK_MONTHLY_AMOUNT || "2850000");
    if (
      (transactionUserId && transactionUserId !== user.id) ||
      (!transactionUserId && transactionEmail !== String(user.email || "").toLowerCase()) ||
      Number(transaction.amount) !== expectedAmount ||
      String(transaction.currency || "").toUpperCase() !== String((c.env as Env)?.PAYSTACK_CURRENCY || "NGN").toUpperCase()
    ) return c.json({ success: false, error: "PAYSTACK_PAYMENT_MISMATCH" }, 403);

    const plan = paidPlan === "lite" ? "lite" : "pro";
    const now = Date.now();
    const expiresAt = now + (paidPlan === "yearly" ? 365 : 30) * 86400000;
    const db = await ensurePersistence(c).catch(() => null);
    const existing: any = db ? await db.prepare("SELECT plan, expires_at, paystack_ref FROM subscriptions WHERE user_id = ?").bind(user.id).first() : null;
    if (existing?.paystack_ref === reference) {
      return c.json({ success: true, isPro: existing.plan === "pro", plan: existing.plan || plan, expires_at: Number(existing.expires_at || expiresAt), already_verified: true });
    }
    const subscription = { active: true, plan, paystackRef: reference, expiresAt, updatedAt: now };
    proSubscriptions.set(user.id, subscription);
    if (db) {
      await db.prepare("INSERT INTO subscriptions (user_id, plan, status, expires_at, current_period_start, current_period_end, paystack_ref, created_at, updated_at) VALUES (?, ?, 'active', ?, ?, ?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET plan=excluded.plan, status='active', expires_at=excluded.expires_at, current_period_start=excluded.current_period_start, current_period_end=excluded.current_period_end, paystack_ref=excluded.paystack_ref, updated_at=excluded.updated_at")
        .bind(user.id, plan, expiresAt, now, expiresAt, reference, now, now).run();
    }
    if ((c.env as Env)?.KV) await (c.env as Env).KV!.put(`subscription:${user.id}`, JSON.stringify(subscription));
    return c.json({ success: true, isPro: plan === "pro", plan, expires_at: expiresAt, message: `Upgraded to ${plan} instantly` });
  }

  app.post("/api/subscription/create-intent", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "SIGNIN_REQUIRED" }, 401);
    let body: any = {};
    try { body = await c.req.json(); } catch { return c.json({ success: false, error: "INVALID_JSON" }, 400); }
    const plan = body.plan === "lite" ? "lite" : body.plan === "pro" ? "monthly" : null;
    if (!plan) return c.json({ success: false, error: "INVALID_PLAN" }, 400);
    const limits = getPlanLimits(plan === "lite" ? "lite" : "pro");
    return c.json({
      success: true,
      campaign_id: crypto.randomUUID(),
      plan: plan === "monthly" ? "pro" : plan,
      price_usd: limits.priceUsd,
      price_ngn: limits.priceNgn,
      amount_kobo: limits.priceNgn * 100,
      paystack_public_key: (c.env as Env)?.PAYSTACK_PUBLIC_KEY || null,
      email: user.email || "",
    });
  });

  app.post("/api/subscription/verify", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "SIGNIN_REQUIRED" }, 401);
    let body: any = {};
    try { body = await c.req.json(); } catch { return c.json({ success: false, error: "INVALID_JSON" }, 400); }
    const reference = String(body.paystack_ref || body.reference || "").trim();
    const requestedPlan = body.plan === "lite" ? "lite" : "pro";
    return verifySubscriptionPayment(c, user, reference, requestedPlan);
  });

  app.post("/api/paystack/initialize", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ error: "SIGNIN_REQUIRED" }, 401);
    const secret = (c.env as Env)?.PAYSTACK_SECRET_KEY;
    if (!secret) return c.json({ error: "PAYSTACK_NOT_CONFIGURED" }, 503);
    const body = await c.req.json<{ plan?: "lite" | "monthly" | "yearly"; email?: string }>();
    const plan = body.plan === "lite" ? "lite" : body.plan === "yearly" ? "yearly" : "monthly";
    const email = String(body.email || user.email || "").trim();
    if (!email || !email.includes("@")) return c.json({ error: "ACCOUNT_EMAIL_REQUIRED" }, 400);
    const planCode = plan === "yearly"
      ? (c.env as Env)?.PAYSTACK_PLAN_YEARLY
      : plan === "monthly"
        ? (c.env as Env)?.PAYSTACK_PLAN_MONTHLY
        : undefined;
    const currency = String((c.env as Env)?.PAYSTACK_CURRENCY || "NGN").toUpperCase();
    const configuredAmount = plan === "lite"
      ? Number((c.env as Env)?.PAYSTACK_LITE_AMOUNT || "500000")
      : plan === "yearly"
      ? Number((c.env as Env)?.PAYSTACK_YEARLY_AMOUNT || "990000")
      : Number((c.env as Env)?.PAYSTACK_MONTHLY_AMOUNT || "2850000");
    if (!Number.isInteger(configuredAmount) || configuredAmount <= 0) {
      return c.json({ error: "PAYSTACK_AMOUNT_NOT_CONFIGURED" }, 503);
    }
    const origin = new URL(c.req.url).origin;
    const payload: Record<string, unknown> = {
      email,
      amount: configuredAmount,
      currency,
      callback_url: `${origin}/pricing?paystack=success`,
      metadata: { userId: user.id, plan },
    };
    // A Paystack plan can carry its own currency. Only use it when it matches
    // the configured merchant currency; otherwise the one-time charge remains
    // in the supported currency selected above.
    if (planCode && String((c.env as Env)?.PAYSTACK_PLAN_CURRENCY || "").toUpperCase() === currency) payload.plan = planCode;
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data: any = await response.json();
    if (!response.ok || !data.status || !data.data?.authorization_url) {
      return c.json({ error: data.message || "PAYSTACK_INITIALIZATION_FAILED" }, 502);
    }
    return c.json({ authorization_url: data.data.authorization_url, reference: data.data.reference, plan });
  });
  app.get("/api/paystack/verify", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ error: "SIGNIN_REQUIRED" }, 401);
    const reference = String(c.req.query("reference") || "").trim();
    return verifySubscriptionPayment(c, user, reference);
  });
  app.post("/api/paystack/webhook", async (c) => {
    const secret = (c.env as Env)?.PAYSTACK_SECRET_KEY;
    const signature = c.req.header("x-paystack-signature") || "";
    const rawBody = await c.req.text();
    if (!secret || !signature) return c.json({ error: "INVALID_WEBHOOK" }, 401);
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-512" }, false, ["sign"]);
    const digest = Array.from(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody)))).map(b => b.toString(16).padStart(2, "0")).join("");
    if (digest !== signature) return c.json({ error: "INVALID_SIGNATURE" }, 401);
    let event: any;
    try {
      event = JSON.parse(rawBody);
    } catch {
      return c.json({ error: "INVALID_WEBHOOK_JSON" }, 400);
    }
    if (event.event === "charge.success") {
      const campaignId = String(event.data?.metadata?.campaignId || "");
      if (campaignId && event.data?.metadata?.product === "ads_campaign") {
        const db = await ensurePersistence(c);
        const campaign: any = db ? await db.prepare("SELECT * FROM ads_campaigns WHERE id = ?").bind(campaignId).first() : null;
        if (
          campaign &&
          campaign.status === "pending_payment" &&
          Number(event.data?.amount) === Number(campaign.total_amount_kobo) &&
          String(event.data?.currency || "").toUpperCase() === "NGN"
        ) {
          await activateOrQueueAd(db, campaign, String(event.data.reference || ""));
          await clearCurrentAdsCache(c.env as Env);
        }
        return c.json({ received: true });
      }
      const userId = event.data?.metadata?.userId;
      if (userId) {
        const webhookPlan = event.data?.metadata?.plan === "lite" ? "lite" : event.data?.metadata?.plan === "yearly" ? "yearly" : "monthly";
        const expectedAmount = webhookPlan === "lite"
          ? Number((c.env as Env)?.PAYSTACK_LITE_AMOUNT || "500000")
          : webhookPlan === "yearly"
          ? Number((c.env as Env)?.PAYSTACK_YEARLY_AMOUNT || "15000000")
          : Number((c.env as Env)?.PAYSTACK_MONTHLY_AMOUNT || "2850000");
        if (
          Number(event.data?.amount) !== expectedAmount ||
          String(event.data?.currency || "").toUpperCase() !== String((c.env as Env)?.PAYSTACK_CURRENCY || "NGN").toUpperCase()
        ) return c.json({ error: "PAYMENT_MISMATCH" }, 400);
        const db = await ensurePersistence(c).catch(() => null);
        const existing: any = db
          ? await db.prepare("SELECT paystack_ref FROM subscriptions WHERE user_id = ?").bind(userId).first()
          : null;
        if (existing?.paystack_ref === String(event.data?.reference || "")) return c.json({ received: true, already_processed: true });
        const subscription = { active: true, plan: webhookPlan === "lite" ? "lite" : "pro", paystackRef: event.data?.reference, expiresAt: Date.now() + (webhookPlan === "yearly" ? 365 : 30) * 86400000, updatedAt: Date.now() };
        proSubscriptions.set(userId, subscription);
        if (db) await db.prepare("INSERT INTO subscriptions (user_id, plan, status, expires_at, current_period_start, current_period_end, paystack_ref, created_at, updated_at) VALUES (?, ?, 'active', ?, ?, ?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET plan=excluded.plan, status='active', expires_at=excluded.expires_at, current_period_start=excluded.current_period_start, current_period_end=excluded.current_period_end, paystack_ref=excluded.paystack_ref, updated_at=excluded.updated_at").bind(userId, subscription.plan, subscription.expiresAt, subscription.updatedAt, subscription.expiresAt, subscription.paystackRef, subscription.updatedAt, subscription.updatedAt).run();
        if ((c.env as Env)?.KV) await (c.env as Env).KV!.put(`subscription:${userId}`, JSON.stringify(subscription));
      }
    }
    return c.json({ received: true });
  });
  app.post("/api/subscription/checkout", (c) => c.json({ error: "Use /api/paystack/initialize" }, 410));

  // === NEW: Categories ===
  app.get("/api/categories", (c) => {
    return c.json({ categories: inMemoryCategories });
  });

  // === NEW: Profile ===
  app.get("/api/profile", (c) => {
    return c.json({ profile: inMemoryProfile });
  });

  app.put("/api/profile", async (c) => {
    try {
      const body = await c.req.json<Partial<typeof inMemoryProfile>>();
      const allowed = ["name", "handle", "bio", "avatar", "banner", "email"] as const;
      for (const key of allowed) {
        if (body[key] !== undefined && typeof body[key] === "string" && (body[key] as string).trim() !== "") {
          (inMemoryProfile as any)[key] = (body[key] as string).trim();
        }
      }
      return c.json({ success: true, profile: inMemoryProfile });
    } catch (e: any) {
      return c.json({ success: false, error: e.message || "Invalid JSON" }, 400);
    }
  });

  // === PROMPT #7: Real YouTube Channel — ALPHATEKX @risewithalphatekx (UCGm89Z31SYxEU9PEQ-p3cNA) ===
  // Primary endpoints per spec: GET /api/channel and /api/channel/videos (official channel, real-time via YouTube API)
  app.get("/api/channel", async (c) => {
    const apiKey = (c.env as Env)?.YOUTUBE_API_KEY || "";
    const info = await libFetchChannelInfo(apiKey);
    // Also sync to inMemoryChannels for consistency
    const channelId = (info as any).id || OFFICIAL_CHANNEL_ID;
    // Build channel shell compatible with frontend Channel component
    const channel = {
      id: channelId,
      name: (info as any).snippet?.title || OFFICIAL_CHANNEL_NAME,
      handle: (info as any).snippet?.customUrl || OFFICIAL_CHANNEL_HANDLE,
      avatar: (info as any).snippet?.thumbnails?.high?.url || (info as any).snippet?.thumbnails?.default?.url || `https://img.youtube.com/vi/jvXEkm27XOE/hqdefault.jpg`,
      banner: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80`,
      subscribers: (info as any).statistics?.subscriberCount ? `${Number((info as any).statistics.subscriberCount).toLocaleString()}` : "3,020",
      subscribersCount: Number((info as any).statistics?.subscriberCount || 3020),
      verified: true,
      description: (info as any).snippet?.description || `Official ${OFFICIAL_CHANNEL_NAME} channel — AI avatars, automation, Naija tech 🇳🇬 | ${OFFICIAL_CHANNEL_HANDLE} | alphatekx.name.ng`,
      joinedAt: (info as any).snippet?.publishedAt ? new Date((info as any).snippet.publishedAt).getFullYear().toString() : "2022",
      email: "alphatekxcompany@gmail.com",
      website: "https://alphatekx.name.ng",
      url: `https://www.youtube.com/channel/${OFFICIAL_CHANNEL_ID}`,
      raw: info,
    };
    return c.json({ channel, info, statistics: (info as any).statistics, snippet: (info as any).snippet });
  });

  app.get("/api/channel/videos", async (c) => {
    const apiKey = (c.env as Env)?.YOUTUBE_API_KEY || "";
    const max = Number(c.req.query("max") || "50");
    const videos = await libFetchChannelVideos(apiKey, Math.min(max, 50));
    return c.json({ videos, count: videos.length, channelId: OFFICIAL_CHANNEL_ID, channelHandle: OFFICIAL_CHANNEL_HANDLE });
  });

  // Real video stats — no mock, real views/likes
  app.get("/api/video/:id", async (c) => {
    const id = c.req.param("id");
    if (!id || id.startsWith("mock")) return c.json({ error: "Mock ID, no real stats" }, 400);
    const apiKey = (c.env as Env)?.YOUTUBE_API_KEY || "";
    try {
      let v: any = null;
      if (apiKey) {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${encodeURIComponent(id)}&key=${apiKey}`);
        if (res.ok) {
          const data: any = await res.json();
          v = data.items?.[0] || null;
        }
      }
      if (!v) {
        const player = await fetch("https://www.youtube.com/youtubei/v1/player?prettyPrint=false", {
          method: "POST",
          headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" },
          body: JSON.stringify({ context: { client: { clientName: "WEB", clientVersion: "2.20240301" } }, videoId: id }),
        });
        const playerData: any = await player.json().catch(() => ({}));
        const details = playerData.videoDetails;
        if (!player.ok || !details) {
          return c.json({
            video: {
              id, title: "", channel: "", channelId: "",
              thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
              views: "0", viewsFormatted: "0 views", likes: "0", likeCount: 0,
              comments: "0", description: "", duration: "", publishedAt: "",
              statistics: {}, snippet: {}, contentDetails: {},
            },
            real: false,
            source: "youtube_embed",
          });
        }
        v = {
          id,
          snippet: { title: details.title || "", channelTitle: details.author || "", channelId: details.channelId || "", thumbnails: { high: { url: `https://i.ytimg.com/vi/${id}/hqdefault.jpg` } }, description: details.shortDescription || "", publishedAt: "" },
          statistics: { viewCount: details.viewCount || "0", likeCount: "0", commentCount: "0" },
          contentDetails: { duration: "" },
        };
        try {
          const nextResponse = await fetch("https://www.youtube.com/youtubei/v1/next?prettyPrint=false", {
            method: "POST",
            headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" },
            body: JSON.stringify({ context: { client: { clientName: "WEB", clientVersion: "2.20240301" } }, videoId: id }),
          });
          if (nextResponse.ok) {
            const engagement = extractInnerTubeEngagement(await nextResponse.json());
            if (engagement.likes) v.statistics.likeCount = engagement.likes.replace(/[^\d]/g, "");
            if (engagement.comments) v.statistics.commentCount = engagement.comments.replace(/[^\d]/g, "");
            if (engagement.channelAvatar) v.channelAvatar = engagement.channelAvatar;
          }
        } catch {}
      }
      return c.json({
        video: {
          id: v.id,
          title: v.snippet.title,
          channel: v.snippet.channelTitle,
          channelId: v.snippet.channelId,
          channelAvatar: v.channelAvatar || "",
          thumbnail: v.snippet.thumbnails?.high?.url || v.snippet.thumbnails?.medium?.url,
          views: v.statistics.viewCount,
          viewsFormatted: Number(v.statistics.viewCount).toLocaleString() + " views",
          likes: v.statistics.likeCount,
          likeCount: Number(v.statistics.likeCount || 0),
          comments: v.statistics.commentCount,
          description: v.snippet.description || "",
          duration: v.contentDetails.duration,
          publishedAt: v.snippet.publishedAt,
          statistics: v.statistics,
          snippet: v.snippet,
          contentDetails: v.contentDetails,
        }
      });

    } catch (e: any) {
      return c.json({ error: e.message }, 500);
    }
  });

  app.get("/api/video/:id/comments", async (c) => {
        const id = c.req.param("id");
        const apiKey = (c.env as Env)?.YOUTUBE_API_KEY || "";
        const maxResults = Math.min(Math.max(Number(c.req.query("max") || "20"), 1), 100);
        if (!id || id.startsWith("mock")) return c.json({ comments: [], real: false, error: "Mock ID, no real comments" }, 400);
        const db = await ensurePersistence(c).catch(() => null);
        const loadPlatformComments = async () => {
          if (!db) return [];
          const result = await db.prepare("SELECT id, video_id AS videoId, user_name AS author, avatar_initials AS authorInitials, message AS text, likes AS likeCount, created_at AS publishedAt FROM community_messages WHERE video_id = ? ORDER BY created_at DESC LIMIT ?").bind(id, maxResults).all();
          return result.results || [];
        };
        if (!apiKey) {
          try {
            const nextResponse = await fetch("https://www.youtube.com/youtubei/v1/next?prettyPrint=false", {
              method: "POST",
              headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" },
              body: JSON.stringify({ context: { client: { clientName: "WEB", clientVersion: "2.20240301" } }, videoId: id }),
            });
            if (nextResponse.ok) {
              const extracted = extractInnerTubeEngagement(await nextResponse.json());
              if (extracted.commentItems.length) return c.json({ comments: extracted.commentItems.slice(0, maxResults), real: true, source: "youtube" });
            }
          } catch {}
          return c.json({ comments: await loadPlatformComments(), real: false, source: "platform", error: "YouTube comments unavailable without an API key" });
        }
        try {
          const url = new URL("https://www.googleapis.com/youtube/v3/commentThreads");
          url.searchParams.set("part", "snippet");
          url.searchParams.set("videoId", id);
          url.searchParams.set("maxResults", String(maxResults));
          url.searchParams.set("order", "relevance");
          url.searchParams.set("textFormat", "plainText");
          url.searchParams.set("key", apiKey);
          const res = await fetch(url.toString());
          if (!res.ok) throw new Error(`YouTube comments ${res.status}`);
          const data: any = await res.json();
          const comments = (data.items || []).map((item: any) => {
            const top = item.snippet?.topLevelComment?.snippet || {};
            return {
              id: item.id,
              author: top.authorDisplayName || "YouTube user",
              authorPhoto: top.authorProfileImageUrl || "",
              text: top.textDisplay || "",
              likeCount: Number(top.likeCount || 0),
              publishedAt: top.publishedAt || "",
              updatedAt: top.updatedAt || "",
            };
          });

          const platformComments = await loadPlatformComments();
          return c.json({ comments: [...platformComments, ...comments].slice(0, maxResults), real: true, nextPageToken: data.nextPageToken || "" });
        } catch (e: any) {
          return c.json({ comments: await loadPlatformComments(), real: false, source: "platform", error: e.message || "Unable to load comments" });
        }
  });

  app.get("/api/video/:id/interaction", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ liked: false, subscribed: false, likeCount: 0 });
    const videoId = c.req.param("id");
    const db = await ensurePersistence(c).catch(() => null);
    if (!db) return c.json({ success: false, error: "PERSISTENCE_NOT_CONFIGURED" }, 503);
    const liked = Boolean(await db.prepare("SELECT 1 FROM video_likes WHERE user_id = ? AND video_id = ?").bind(user.id, videoId).first());
    const count = await db.prepare("SELECT COUNT(*) AS count FROM video_likes WHERE video_id = ?").bind(videoId).first();
    return c.json({ liked, likeCount: Number((count as any)?.count || 0) });
  });

  // === NEW: Channel — real YouTube for any UC id (no mock), falls back to inMemory
  app.post("/api/channel/videos", async (c) => {
    try {
      const body: any = await c.req.json().catch(() => ({}));
      const channelId = String(body.channelId || "").trim();
      const continuationToken = String(body.continuationToken || "").trim();
      if (!channelId) return c.json({ success: false, error: "CHANNEL_ID_REQUIRED" }, 400);
      const env = c.env as Env;
      const key = env.YOUTUBE_WEB_KEY || env.YOUTUBE_API_KEY;
      if (!key) return c.json({ success: false, error: "YOUTUBE_WEB_KEY_NOT_CONFIGURED" }, 503);
      const cacheKey = `yt:channel:v7:${channelId}`;
      if (!continuationToken && env.KV) {
        const cached: any = await env.KV.get(cacheKey, "json").catch(() => null);
        if (Array.isArray(cached?.videos) && cached.videos.length) return c.json(cached);
      }
      const payload = continuationToken
        ? { context: { client: { clientName: "WEB", clientVersion: "2.20240301" } }, continuation: continuationToken }
        : { context: { client: { clientName: "WEB", clientVersion: "2.20240301" } }, browseId: channelId, params: "EgZ2aWRlb3M=" };
      let response = await fetch(youtubeBrowseUrl(key), {
        method: "POST", headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" }, body: JSON.stringify(payload),
      });
      if (!response.ok && !continuationToken) {
        response = await fetch(youtubeBrowseUrl(""), {
          method: "POST", headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" }, body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const fallbackVideos = await fetchYoutubeRssVideos(channelId, 30).catch(() => []);
          return c.json({ success: true, channelId, videos: fallbackVideos, nextToken: "", cached: false, fallback: "rss" });
        }
      }
      if (!response.ok) return c.json({ success: false, error: "YOUTUBE_CHANNEL_FAILED" }, 502);
      const parsed = parseInnerTubeChannelVideos(await response.json(), channelId);
      if (!continuationToken && parsed.videos.length && parsed.continuationTokens.length > 1) {
        for (const candidate of [...parsed.continuationTokens].reverse()) {
          const probe = await fetch(youtubeBrowseUrl(""), {
            method: "POST",
            headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" },
            body: JSON.stringify({ context: { client: { clientName: "WEB", clientVersion: "2.20240301" } }, continuation: candidate }),
          });
          if (!probe.ok) continue;
          const probeParsed = parseInnerTubeChannelVideos(await probe.json(), channelId);
          if (probeParsed.videos.length) {
            parsed.nextToken = candidate;
            break;
          }
        }
      }
      const fallbackVideos = !continuationToken && !parsed.videos.length ? await fetchYoutubeRssVideos(channelId, 30).catch(() => []) : [];
      const result = { success: true, channelId, videos: parsed.videos.length ? parsed.videos : fallbackVideos, nextToken: parsed.videos.length ? parsed.nextToken : "", cached: !continuationToken && Boolean(env.KV) };
      if (!continuationToken && env.KV && parsed.videos.length) await env.KV.put(cacheKey, JSON.stringify(result), { expirationTtl: 3600 }).catch(() => {});
      return c.json(result);
    } catch (error: any) {
      console.error("[channel/videos]", error);
      return c.json({ success: false, error: "YOUTUBE_CHANNEL_FAILED", message: error?.message || "Unable to load channel videos" }, 502);
    }
  });
  app.post("/api/channel/shorts", (c) => browseChannelTab(c, "EgZzaG9ydHM=", "shorts"));
  app.post("/api/channel/live", (c) => browseChannelTab(c, "EgZzdHJlYW1z", "live"));
  app.post("/api/channel/playlists", (c) => browseChannelTab(c, "EglwbGF5bGlzdHM=", "playlists"));
  app.post("/api/channel/community", (c) => browseChannelTab(c, "Eghjb21tdW5pdHk%3D", "community"));
  app.get("/api/channel/:id", async (c) => {
    const id = c.req.param("id");
    const apiKey = (c.env as Env)?.YOUTUBE_API_KEY || "";
    // If id looks like real YouTube channel ID (UC... 24 chars), try real YouTube API first
    if (apiKey && /^UC[a-zA-Z0-9_-]{22}$/.test(id)) {
      try {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails,brandingSettings&id=${encodeURIComponent(id)}&key=${apiKey}`);
        if (res.ok) {
          const data: any = await res.json();
          if (data.items && data.items[0]) {
            const info = data.items[0];
            const channel = {
              id: info.id,
              name: info.snippet.title,
              handle: info.snippet.customUrl || `@${info.snippet.title.toLowerCase().replace(/\s+/g, "")}`,
              avatar: info.snippet.thumbnails?.high?.url || info.snippet.thumbnails?.default?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(info.snippet.title)}&background=0B0215&color=FFD700`,
              banner: info.brandingSettings?.image?.bannerExternalUrl || "",
              subscribers: Number(info.statistics.subscriberCount).toLocaleString(),
              subscribersCount: Number(info.statistics.subscriberCount),
              verified: true,
              description: info.snippet.description?.slice(0, 200) || `Channel ${info.snippet.title}`,
              joinedAt: new Date(info.snippet.publishedAt).getFullYear().toString(),
              videoCount: Number(info.statistics.videoCount),
              viewCount: info.statistics.viewCount,
              email: "",
              website: "",
              url: `https://www.youtube.com/channel/${info.id}`,
              raw: info,
            };
            // Fetch uploads playlist for real videos
            const uploadsPlaylistId = "UU" + info.id.slice(2);
            let uploads: any[] = [];
            try {
              const plRes = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=50&key=${apiKey}`);
              if (plRes.ok) {
                const plData: any = await plRes.json();
                uploads = (plData.items || []).map((it: any) => ({
                  id: it.contentDetails.videoId,
                  youtubeId: it.contentDetails.videoId,
                  title: it.snippet.title,
                  thumbnailUrl: it.snippet.thumbnails?.high?.url || `https://i.ytimg.com/vi/${it.contentDetails.videoId}/hqdefault.jpg`,
                  channelId: info.id,
                  channelName: info.snippet.title,
                  views: "0 views",
                  duration: "5:00",
                  category: "Tech",
                  publishedAt: it.snippet.publishedAt,
                }));
                // Enrich with real views/durations
                const vIds = uploads.map((u: any) => u.youtubeId).join(",");
                if (vIds) {
                  try {
                    const detRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${vIds}&key=${apiKey}`);
                    if (detRes.ok) {
                      const detData: any = await detRes.json();
                      const map: Record<string, any> = {};
                      for (const v of detData.items || []) map[v.id] = v;
                      uploads = uploads.map((u: any) => {
                        const det = map[u.youtubeId];
                        if (det) {
                          return { ...u, views: det.statistics?.viewCount ? `${(Number(det.statistics.viewCount)/1000).toFixed(0)}K views` : u.views, duration: det.contentDetails?.duration ? det.contentDetails.duration.replace("PT","").toLowerCase() : u.duration };
                        }
                        return u;
                      });
                    }
                  } catch {}
                }
              }
            } catch {}
            return c.json({ channel, uploads, uploadsCount: uploads.length, subscriberCount: channel.subscribers, subscriberCountRaw: channel.subscribersCount, real: true });
          }
        }
      } catch {}
    }
    // Include persisted Alphatekx uploads for custom channels when YouTube is unavailable.
    const channel = resolveChannelById(id);
    let uploads: any[] = [];
    const db = await ensurePersistence(c).catch(() => null);
    if (db) {
      const rows = await db.prepare(
        "SELECT id, video_id AS videoId, title, thumbnail, original_url AS originalUrl, channel_id AS channelId, created_at AS createdAt, source FROM videos WHERE channel_id = ? OR added_by = ? ORDER BY created_at DESC LIMIT 500"
      ).bind(id, id).all();
      uploads = (rows.results || []).map((video: any) => ({
        ...video,
        id: video.videoId || video.id,
        youtubeId: video.videoId || video.id,
        thumbnailUrl: video.thumbnail,
        channelName: channel.name,
        platform: "youtube",
      }));
    }
    uploads = [...uploads, ...inMemoryUploads.filter(u =>
      u.channelId === channel.id || 
      slugifyChannel(u.channelName) === channel.id ||
      u.channelName.toLowerCase() === channel.name.toLowerCase()
    )];
    if (!uploads.length && channel.id === OFFICIAL_CHANNEL_ID) {
      try { uploads = await fetchYoutubeSectionVideos(OFFICIAL_CHANNEL_ID, "videos", 50).catch(() => fetchYoutubeRssVideos(OFFICIAL_CHANNEL_ID, 50)); } catch {}
    }
    return c.json({ 
      channel,
      uploads,
      uploadsCount: uploads.length,
      subscriberCount: channel.subscribers,
      subscriberCountRaw: channel.subscribersCount,
      real: false
    });
  });

  // === NEW: Video Upload ===
  app.post("/api/upload", async (c) => {
    try {
      const body = await c.req.json<{
        videoId?: string;
        title?: string;
        thumbnail?: string;
        originalUrl?: string;
      }>();
      const match = String(body.originalUrl || "").match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&#/]|$)/);
      const videoId = body.videoId || match?.[1];
      if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId) || match?.[1] && match[1] !== videoId) {
        return c.json({ success: false, error: "A valid YouTube link is required" }, 400);
      }
      const user = await gatedGetUserFromCookie(c);
      const now = Date.now();
      const video = {
        id: videoId,
        youtubeId: videoId,
        videoId,
        title: String(body.title || `YouTube Video - ${videoId}`).trim(),
        thumbnail: body.thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        thumbnailUrl: body.thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        originalUrl: body.originalUrl || `https://www.youtube.com/watch?v=${videoId}`,
        createdAt: now,
        source: "youtube_link",
        channelName: "YouTube Creator",
        views: "0 views"
      };
      const env: any = c.env || {};
      if (env.DB) {
        await env.DB.prepare("INSERT INTO videos (id, video_id, title, thumbnail, original_url, added_by, channel_id, created_at, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(video_id) DO UPDATE SET title=excluded.title, thumbnail=excluded.thumbnail, original_url=excluded.original_url, channel_id=excluded.channel_id")
          .bind(videoId, videoId, video.title, video.thumbnail, video.originalUrl, user?.id || user?.email || null, user?.channelId || null, now, "youtube_link").run();
        await env.DB.prepare("INSERT OR IGNORE INTO video_stats (video_id, creator_id, channel_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)")
          .bind(videoId, user?.id || user?.email || null, user?.channelId || null, now, now).run();
      }
      inMemoryUploads.unshift(video);
      return c.json({ success: true, video });
    } catch (e: any) {
      return c.json({ success: false, error: e.message || "Unable to publish YouTube link" }, 400);
    }
  });

  // Optional: list all uploads
  app.get("/api/uploads", async (c) => {
    const category = c.req.query("category");
    let uploads = inMemoryUploads;
    const db = await ensurePersistence(c).catch(() => null);
    if (db) {
      const result = await db.prepare("SELECT id, video_id AS videoId, title, thumbnail, original_url AS originalUrl, added_by AS addedBy, created_at AS createdAt, source FROM videos ORDER BY created_at DESC LIMIT 500").all();
      if ((result.results || []).length) {
        uploads = (result.results || []).map((v: any) => ({ ...v, youtubeId: v.videoId, thumbnailUrl: v.thumbnail, platform: "youtube", category: v.category || "Tech", channelName: "YouTube Creator", views: "0 views" }));
        inMemoryUploads = uploads;
      }
    }
    if (category && category !== "All" && category !== "all") {
      uploads = uploads.filter(u => u.category === category);
    }
    return c.json({ uploads, count: uploads.length });
  });

  app.get("/api/stream/videos", async (c) => {
    const env: any = c.env || {};
    if (!env.DB) return c.json({ videos: inMemoryUploads });
    const result = await env.DB.prepare("SELECT id, video_id AS videoId, title, thumbnail, original_url AS originalUrl, added_by AS addedBy, created_at AS createdAt, source FROM videos ORDER BY created_at DESC LIMIT 100").all();
    return c.json({ videos: result.results || [] });
  });

  // Enhance /api/search to also include uploads matching query
  // (mounted as middleware wrap? Instead augment existing /api/search behavior
  // by adding upload matches to its fallback—handled inside its handler remain,
  // but we add a dedicated searchable uploads probe endpoint)
  app.get("/api/search/uploads", async (c) => {
    const q = (c.req.query("q") || "").toLowerCase();
    let source = inMemoryUploads;
    const db = await ensurePersistence(c).catch(() => null);
    if (db) {
      const result = await db.prepare("SELECT id, video_id AS videoId, title, thumbnail, original_url AS originalUrl, created_at AS createdAt FROM videos ORDER BY created_at DESC LIMIT 500").all();
      if ((result.results || []).length) source = (result.results || []).map((v: any) => ({ ...v, youtubeId: v.videoId, thumbnailUrl: v.thumbnail, channelName: "YouTube Creator", category: "Tech", views: "0 views" }));
    }
    const filtered = source.filter(u => !q || String(u.title || "").toLowerCase().includes(q) || String(u.channelName || "").toLowerCase().includes(q) || String(u.category || "").toLowerCase().includes(q));
    return c.json({ videos: filtered.map(u => ({
      youtubeId: u.youtubeId,
      title: u.title,
      channelName: u.channelName,
      thumbnailUrl: u.thumbnailUrl,
      views: u.views,
      duration: u.duration,
      category: u.category,
      channelId: u.channelId
    })) });
  });

  // === PROMPT #5: AI FEATURES — Clip Maker, Thumbnail Enhancer, Voice Translator (Pro paywall) ===
  function isProRequest(c: any, body?: any) {
    const h = (c.req.header("x-pro") || c.req.header("X-Pro") || c.req.query("pro") || "") as string;
    if (h === "true" || h === "1" || h === "pro") return true;
    if (body && (body.pro === true || body.tier === "pro" || body.isPro === true)) return true;
    // also allow if isProUser simulated via env var BYPASS (for tests)
    return false;
  }
  async function checkExternalAi(c: any, body: any, feature: string): Promise<any> {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return { response: c.json({ success: false, error: "IDENTITY_REQUIRED" }, 401) };
    const result = await aiRateLimitStatus(c, user.id);
    if (!result.remainingWindow || !result.remainingWeekly) return { response: c.json({ allowed: false, error: "AI_RATE_LIMIT_REACHED", feature, ...result }, 429) };
    return { user, result };
  }

  app.post("/api/clips/create", async (c) => {
    let body: any = {};
    try { body = await c.req.json(); } catch {}
    const allowance = await checkExternalAi(c, body, "video_gen");
    if (allowance.response) return allowance.response;
    const { videoUrl, videoId, prompt } = body;
    if (!videoUrl && !videoId) return c.json({ success: false, error: "videoUrl or videoId required" }, 400);
    try {
      const result = await libCreateClip({ videoUrl, videoId, prompt, pro: true });
      await consumeAiRateLimit(c, allowance.user.id);
      return c.json(result);
    } catch (e: any) {
      return c.json({ success: false, error: e.message }, 400);
    }
  });

  app.post("/api/thumbnail/enhance", async (c) => {
    let body: any = {};
    try { body = await c.req.json(); } catch {}
    const allowance = await checkExternalAi(c, body, "thumbnail");
    if (allowance.response) return allowance.response;
    const { thumbnailUrl, imageBase64, style } = body;
    if (!thumbnailUrl && !imageBase64) return c.json({ success: false, error: "thumbnailUrl or imageBase64 required" }, 400);
    try {
      const result = await libEnhanceThumbnail({ thumbnailUrl, imageBase64, style, pro: true });
      await consumeAiRateLimit(c, allowance.user.id);
      return c.json(result);
    } catch (e: any) {
      return c.json({ success: false, error: e.message }, 400);
    }
  });

  app.post("/api/voice/translate", async (c) => {
    let body: any = {};
    try { body = await c.req.json(); } catch {}
    const allowance = await checkExternalAi(c, body, "translator");
    if (allowance.response) return allowance.response;
    const { videoUrl, videoId, targetLang, sourceLang } = body;
    if (!videoUrl && !videoId) return c.json({ success: false, error: "videoUrl or videoId required" }, 400);
    try {
      const result = await libTranslateVoice({ videoUrl, videoId, targetLang, sourceLang, pro: true });
      await consumeAiRateLimit(c, allowance.user.id);
      return c.json(result);
    } catch (e: any) {
      return c.json({ success: false, error: e.message }, 400);
    }
  });

  return app;
}

const apiApp = createApiApp();

export class App extends DurableObject {
  private app: Hono;

  constructor(ctx: DurableObjectState, env: Record<string, unknown>) {
    super(ctx, env);
    this.app = createApiApp();
  }

  async fetch(request: Request): Promise<Response> {
    return this.app.fetch(request);
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return apiApp.fetch(request, env, ctx);
  },
  async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext): Promise<void> {
    if (env.DB) {
      await refreshAdStatuses(env.DB);
      await expireSubscriptions(env.DB);
      await clearCurrentAdsCache(env);
    }
  }
};
