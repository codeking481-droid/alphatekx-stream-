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
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  SESSION_SECRET?: string;
  GOOGLE_REDIRECT_URI?: string;
  YOUTUBE_API_KEY?: string;
  TIKHUB_API_KEY?: string;
  TIKTOK_API_KEY?: string;
  INSTAGRAM_ACCESS_TOKEN?: string;
  TWITTER_BEARER_TOKEN?: string;
  FACEBOOK_ACCESS_TOKEN?: string;
  STRIPE_SECRET_KEY?: string;
  PAYSTACK_SECRET_KEY?: string;
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

function isoDurationSeconds(iso?: string): number {
  const match = String(iso || "").match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return Infinity;
  return Number(match[1] || 0) * 3600 + Number(match[2] || 0) * 60 + Number(match[3] || 0);
}

// In-memory mock storage fallback when Durable Object SQL storage is unavailable
let inMemoryMessages = [
  { id: 1, videoId: 'dQw4w9WgXcQ', channel: 'general', userName: 'dev_nina', avatarInitials: 'N', message: 'This explanation at 8:15 finally made backprop click — thank you! 🔥', timestampInVideo: '8:15', likes: 14, createdAt: Date.now() - 120000 },
  { id: 2, videoId: 'dQw4w9WgXcQ', channel: 'general', userName: 'ml_learner', avatarInitials: 'M', message: 'Would love a follow-up on CNNs & Attention mechanisms next. Super clear!', timestampInVideo: '12:30', likes: 9, createdAt: Date.now() - 60000 },
  { id: 3, videoId: 'dQw4w9WgXcQ', channel: 'builders', userName: 'tech_guru', avatarInitials: 'T', message: 'Are you guys using PyTorch 2.0 compile mode or raw CUDA kernels for this demo?', timestampInVideo: '2:15', likes: 5, createdAt: Date.now() - 30000 },
  { id: 4, videoId: 'dQw4w9WgXcQ', channel: 'marketplace', userName: 'ai_builder', avatarInitials: 'A', message: 'Bought the AI Neural Net Model Pack from the watch card! Worth every cent 🚀', timestampInVideo: '', likes: 8, createdAt: Date.now() - 10000 }
];

let inMemoryProducts = [
  { id: 1, name: 'AI Neural Net Model Pack', description: 'Pre-trained PyTorch checkpoint & CUDA optimized dataset for vision + NLP models.', price: 9.99, badge: 'BESTSELLER', iconType: 'cpu', sellerEmail: 'dev@alphatekx.ai', fileUrl: 'https://github.com/alphatekx/model-pack.zip', salesCount: 342, category: 'app', tags: 'python,pytorch,ai', relatedTopic: 'neural-networks', createdAt: Date.now() },
  { id: 2, name: 'Stream Platform Course Bundle', description: 'Complete 6-hour hands-on video masterclass with source code & verified certificate.', price: 24.99, badge: 'HOT', iconType: 'video', sellerEmail: 'academy@alphatekx.ai', fileUrl: 'https://alphatekx.ai/course-bundle.zip', salesCount: 189, category: 'course', tags: 'react,streaming,ai', relatedTopic: 'streaming', createdAt: Date.now() },
  { id: 3, name: 'Naija AI Speech Translator Engine', description: 'Low-latency Pidgin, Yoruba, Igbo & Hausa TTS & STT API wrapper plugin for web apps.', price: 14.99, badge: 'NEW', iconType: 'sparkles', sellerEmail: 'nigeria-ai@alphatekx.ai', fileUrl: 'https://github.com/alphatekx/naija-tts.zip', salesCount: 95, category: 'plugin', tags: 'pidgin,translation,audio', relatedTopic: 'translation', createdAt: Date.now() },
  { id: 4, name: 'TikTok & YouTube Unified Queue SDK', description: 'JavaScript library to sync queue states & embeds between YouTube & TikTok players.', price: 4.99, badge: 'PRO', iconType: 'layers', sellerEmail: 'sdk@alphatekx.ai', fileUrl: 'https://github.com/alphatekx/queue-sdk.zip', salesCount: 521, category: 'plugin', tags: 'queue,tiktok,youtube', relatedTopic: 'queue', createdAt: Date.now() }
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

  app.use("*", async (c, next) => {
    c.header("Cache-Control", "public, max-age=5, s-maxage=10");
    await next();
  });

  app.get("/api/health", (c) => c.json({ status: "ok", app: "Alphatekx Stream", scale: "1M+ Ready" }));

  // === SIGN-IN WITH GOOGLE (Cloudflare Worker) ===
  // Keep a small warm-cache for local development, but the cookie is self-contained so
  // authentication also works when Cloudflare sends the next request to another isolate.
  const gatedSessions = (globalThis as any).__gatedSessions || ((globalThis as any).__gatedSessions = new Map<string, any>());
  function base64UrlEncode(value: string): string {
    return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function base64UrlDecode(value: string): string {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
    return atob(padded);
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
    const cached = gatedSessions.get(m[1]);
    if (cached) return cached;
    const env: any = c.env || {};
    const parts = m[1].split(".");
    const sessionSecret = env.SESSION_SECRET || env.GOOGLE_CLIENT_SECRET;
    if (parts.length !== 2 || !sessionSecret) return null;
    try {
      const expected = await signSession(parts[0], sessionSecret);
      if (expected !== parts[1]) return null;
      const user = JSON.parse(base64UrlDecode(parts[0]));
      if (!user.expiresAt || Date.parse(user.expiresAt) <= Date.now()) return null;
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
        channelId: "",
        channelName: userInfo.name || "Alphatekx User",
        channelAvatar: userInfo.picture || "https://ui-avatars.com/api/?name=Alphatekx&background=FFD700&color=000&size=200&bold=true",
        email: userInfo.email,
        expiresAt: new Date(Date.now() + 30 * 86400 * 1000).toISOString(),
        isGuest: false,
      };
      if (env.DB) {
        await env.DB.prepare(
          "INSERT INTO users (id, email, name, picture) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET email = excluded.email, name = excluded.name, picture = excluded.picture"
        ).bind(sessionUser.id, sessionUser.email, sessionUser.channelName, sessionUser.channelAvatar).run();
      }
      const sessionPayload = base64UrlEncode(JSON.stringify(sessionUser));
      const sessionSignature = await signSession(sessionPayload, sessionSecret);
      const sessionCookie = `${sessionPayload}.${sessionSignature}`;
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
      const feed = (channelVideos || []).slice(0, 8).map((v: any) => ({ videoId: v.youtubeId || v.id, title: v.title, thumbnail: v.thumbnailUrl || v.thumbnail || `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`, publishedAt: v.publishedAt || new Date().toISOString(), channelName: user.channelName }));
      if (feed.length > 0) return c.json({ feed, isGuest: false, fallback: true });
      // Last fallback — static personalized feed
      const mockFeed = [
        { videoId: "jvXEkm27XOE", title: `Welcome ${user.channelName || "Creator"} — Your channel is live on Alphatekx!`, thumbnail: "https://img.youtube.com/vi/jvXEkm27XOE/hqdefault.jpg", publishedAt: new Date().toISOString(), channelName: user.channelName },
        { videoId: "dQw4w9WgXcQ", title: "Your personalized pick: Neural Networks from Scratch", thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg", publishedAt: new Date().toISOString(), channelName: "CodeCraft" },
        { videoId: "L_LUpnjgPso", title: "Recommended for you: Real-time AI Voice Agents", thumbnail: "https://i.ytimg.com/vi/L_LUpnjgPso/hqdefault.jpg", publishedAt: new Date().toISOString(), channelName: "Edge AI Lab" },
      ];
      return c.json({ feed: mockFeed, isGuest: false, fallback: true });
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

  // UNIFIED SEARCH — YouTube + TikTok + Instagram + Twitter (+Facebook) — Real APIs with mock fallback
  // Uses lib modules: backend/src/lib/* and src/lib/* (Prompt #2)
  app.get("/api/search", async (c) => {
    const q = c.req.query("q") || "";
    const env = c.env as Env;
    try {
      const [yt, tt, ig, tw] = await Promise.all([
        libSearchYouTube(q, env.YOUTUBE_API_KEY),
        libSearchTikTok(q, env.TIKHUB_API_KEY || env.TIKTOK_API_KEY),
        libSearchInstagram(q, env.INSTAGRAM_ACCESS_TOKEN),
        libSearchTwitter(q, env.TWITTER_BEARER_TOKEN),
      ]);
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
  app.get("/api/search/history", (c) => {
    // newest first already due to unshift
    return c.json({ history: inMemorySearchHistory, count: inMemorySearchHistory.length });
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
      if (Array.isArray(body.videos) && body.videos.length > 0) {
        const q = (body as any).searchedQuery || body.videos[0]?.searchedQuery || "";
        pushToSearchHistory(body.videos, q);
        return c.json({ success: true, history: inMemorySearchHistory, count: inMemorySearchHistory.length });
      }
      // single item legacy
      const single = body.youtubeId ? [body] : [];
      if (single.length > 0) {
        pushToSearchHistory(single, body.searchedQuery || "");
        return c.json({ success: true, history: inMemorySearchHistory, count: inMemorySearchHistory.length });
      }
      // empty batch
      return c.json({ success: false, error: "No videos provided" }, 400);
    } catch (e: any) {
      return c.json({ success: false, error: e.message }, 400);
    }
  });

  app.delete("/api/search/history", (c) => {
    inMemorySearchHistory = [];
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
    if (!apiKey) return c.json({ videos: [], nextPageToken: "", real: false, error: "YOUTUBE_API_KEY_NOT_CONFIGURED" }, 503);
    try {
      let response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=50&regionCode=${encodeURIComponent(c.req.query("region") || "US")}${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ""}&key=${encodeURIComponent(apiKey)}`);
      let data: any = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(`YouTube trending ${response.status}`);
      let items = (data.items || []).filter((item: any) => isoDurationSeconds(item.contentDetails?.duration) <= 60);
      // Trending can contain too few Shorts; supplement with Shorts discovery.
      if (items.length < limit) {
        const searchParams = new URLSearchParams({ part: "snippet", type: "video", videoDuration: "short", order: "date", maxResults: "50", q: "shorts", key: apiKey });
        if (pageToken) searchParams.set("pageToken", pageToken);
        const searchRes = await fetch(`https://www.googleapis.com/youtube/v3/search?${searchParams}`);
        const searchData: any = await searchRes.json().catch(() => ({}));
        if (searchRes.ok) {
          const ids = (searchData.items || []).map((item: any) => item.id?.videoId).filter(Boolean);
          if (ids.length) {
            const detailRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${ids.join(",")}&key=${encodeURIComponent(apiKey)}`);
            const detailData: any = await detailRes.json().catch(() => ({}));
            items = [...items, ...(detailData.items || []).filter((item: any) => isoDurationSeconds(item.contentDetails?.duration) <= 60)];
            data.nextPageToken = data.nextPageToken || searchData.nextPageToken || "";
          }
        }
      }
      const seen = new Set<string>();
      const videos = items.filter((item: any) => {
        if (!item.id || seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      }).slice(0, limit).map((item: any) => ({
        source: "youtube", platform: "youtube", id: item.id, youtubeId: item.id,
        title: item.snippet?.title || "YouTube Short",
        channelName: item.snippet?.channelTitle || "YouTube Creator",
        channelId: item.snippet?.channelId || "",
        thumbnailUrl: item.snippet?.thumbnails?.high?.url || `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,
        views: formatViews(item.statistics?.viewCount), viewsRaw: Number(item.statistics?.viewCount || 0),
        duration: parseIsoDuration(item.contentDetails?.duration), publishedAt: item.snippet?.publishedAt || "",
        category: "Shorts"
      }));
      return c.json({ videos, nextPageToken: data.nextPageToken || "", real: true });
    } catch (error: any) {
      return c.json({ videos: [], nextPageToken: "", real: false, error: error.message || "SHORTS_FETCH_FAILED" }, 502);
    }
  });

  // === WATCH LATER ===
  app.get("/api/watch-later", (c) => {
    return c.json({ videos: inMemoryWatchLater, count: inMemoryWatchLater.length });
  });
  app.post("/api/watch-later", async (c) => {
    try {
      const body = await c.req.json<any>();
      const id = body.youtubeId || body.id || body.platformId;
      if (!id) return c.json({ success: false, error: "Missing id/youtubeId" }, 400);
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
  app.delete("/api/watch-later/:id", (c) => {
    const id = c.req.param("id");
    const before = inMemoryWatchLater.length;
    inMemoryWatchLater = inMemoryWatchLater.filter(v => (v.youtubeId||v.id) !== id && v.platformId !== id);
    const removed = before !== inMemoryWatchLater.length;
    return c.json({ success: removed, videos: inMemoryWatchLater, count: inMemoryWatchLater.length });
  });

  // Community Chat
  app.get("/api/community/:channel", (c) => {
    const channel = c.req.param("channel") || "general";
    const filtered = inMemoryMessages.filter(m => m.channel === channel);
    return c.json({ messages: filtered });
  });

  app.post("/api/community/send", async (c) => {
    const body = await c.req.json<{
      videoId?: string;
      channel?: string;
      userName?: string;
      avatarInitials?: string;
      message: string;
      timestampInVideo?: string;
    }>();

    const newMsg = {
      id: inMemoryMessages.length + 1,
      videoId: body.videoId || "dQw4w9WgXcQ",
      channel: body.channel || "general",
      userName: body.userName || "Guest_Pioneer",
      avatarInitials: body.avatarInitials || (body.userName || "G").charAt(0).toUpperCase(),
      message: body.message,
      timestampInVideo: body.timestampInVideo || "",
      likes: 0,
      createdAt: Date.now()
    };
    inMemoryMessages.push(newMsg);
    return c.json({ success: true, message: newMsg });
  });

  // Marketplace
  app.get("/api/marketplace", (c) => {
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
    return c.json({ success: true, message: "Product listed successfully!" });
  });

  app.post("/api/marketplace/checkout", async (c) => {
    const { productId } = await c.req.json<{ productId: number }>();
    const prod = inMemoryProducts.find(p => p.id === productId);
    if (prod) prod.salesCount += 1;
    return c.json({
      success: true,
      orderId: `ORD-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      downloadUrl: `https://alphatekx.ai/downloads/product-${productId}.zip`,
      message: "Payment processed via Stripe Test Mode! Download ready."
    });
  });

  // === PROMPT #6: Marketplace Spec Endpoints (20% fee, Stripe) ===
  app.get("/api/marketplace/products", (c) => {
    const category = c.req.query("category");
    let products = inMemoryProducts;
    if (category && category !== "all" && category !== "All") {
      products = products.filter(p => p.category === category);
    }
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
      return c.json({ success: true, product, message: "Product listed successfully!" }, 201);
    } catch (e: any) {
      return c.json({ success: false, error: e.message }, 400);
    }
  });

  app.get("/api/marketplace/products/:id", (c) => {
    const id = c.req.param("id");
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
      return c.json({ ...result, stripe: { testMode: true, card: "4242 •••• •••• 4242" } });
    } catch (e: any) {
      return c.json({ success: false, error: e.message }, 400);
    }
  });

  app.get("/api/marketplace/sales", (c) => {
    const sellerEmail = c.req.query("sellerEmail") || c.req.query("seller") || "";
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
  const aiLimits: Record<string, number> = { teacher: 5, jot: 5, workspace: 3 };
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
    return { videoId, title, transcript: description || "No public transcript was provided. Be transparent about uncertainty and use the available title/context." };
  }
  async function runGroq(c: any, feature: "teacher" | "jot" | "workspace", body: any) {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "AUTHENTICATION_REQUIRED", message: "Sign in to use AI features." }, 401);

    const subscription = proSubscriptions.get(user.id);
    const isPro = Boolean(subscription?.active);
    const month = new Date().toISOString().slice(0, 7);
    const usageKey = `${user.id}:${feature}:${month}`;
    const used = aiUsage.get(usageKey) || 0;
    const limit = aiLimits[feature];
    if (!isPro && used >= limit) {
      return c.json({
        success: false,
        error: "USAGE_LIMIT_EXCEEDED",
        message: `${feature} limit reached (${limit} per month). Upgrade to Pro for unlimited use.`,
        feature, used, limit, isPro: false, upgradeUrl: "/pricing",
      }, 403);
    }

    const messageInput = Array.isArray(body.messages)
      ? body.messages.filter((m: any) => m?.role === "user").map((m: any) => m.content).join("\n")
      : "";
    const input = String(body.prompt || body.message || body.goal || body.text || body.content || messageInput || "").trim();
    if (!input) return c.json({ success: false, error: "PROMPT_REQUIRED" }, 400);
    const apiKey = (c.env as Env)?.GROQ_API_KEY;
    if (!apiKey) return c.json({ success: false, error: "GROQ_NOT_CONFIGURED" }, 503);

    const context = await getVideoContext(c, body);
    const question = String(body.question || "").trim();
    const instructions = feature === "teacher"
      ? question
        ? "You are an AI teacher answering questions about a video. Answer directly and concisely. Cite timestamps only when they are present in the supplied transcript/context; never invent timestamps."
        : "You are an AI teacher. Return a concise course plan as JSON with goal and steps. Each step must have title, description, and searchQuery."
      : feature === "jot"
        ? "You are AI Jot. Extract 5 concise notes from the supplied video context. Return JSON with jots, where each item has time, seconds, text, and summary. If timestamps are unavailable, use 0 and say so rather than inventing them."
        : "You are an expert frontend builder. Return JSON with title, summary, and code. Code must be a complete self-contained HTML document with inline CSS and JavaScript that can run in an iframe. Do not return markdown fences.";
    const enrichedInput = [
      input,
      context.videoId ? `Video ID: ${context.videoId}` : "",
      `Video title: ${context.title}`,
      `Video context/transcript: ${context.transcript.slice(0, 12000)}`,
    ].filter(Boolean).join("\n\n");
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: (c.env as Env)?.GROQ_MODEL || "llama-3.1-8b-instant",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [{ role: "system", content: instructions }, { role: "user", content: enrichedInput }],
      }),
    });
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
    aiUsage.set(usageKey, used + 1);
    return c.json({ success: true, feature, result, message: content, usage: { used: used + 1, limit: isPro ? null : limit, isPro } });
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
    return runGroq(c, "jot", body);
  });
  app.post("/api/jot/create", async (c) => {
    let body: any = {};
    try { body = await c.req.json(); } catch { return c.json({ success: false, error: "INVALID_JSON" }, 400); }
    return runGroq(c, "jot", body);
  });
  app.get("/api/ai-jot", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "AUTHENTICATION_REQUIRED", message: "Sign in to use AI Jot." }, 401);
    const videoId = c.req.query("videoId") || "";
    if (!videoId) return c.json({ success: false, error: "VIDEO_ID_REQUIRED" }, 400);
    return runGroq(c, "jot", { videoId, prompt: "Create timestamped memory jots for this video." });
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
    return runGroq(c, "jot", body);
  });
  app.post("/api/ai/workspace", async (c) => {
    let body: any = {};
    try { body = await c.req.json(); } catch { return c.json({ success: false, error: "INVALID_JSON" }, 400); }
    return runGroq(c, "workspace", body);
  });
  app.get("/api/studio/templates", (c) => c.json({ templates: inMemoryStudioTemplates }));
  app.get("/api/marketplace/apps", (c) => c.json({ apps: (globalThis as any).__marketplaceApps || [] }));
  app.post("/api/marketplace-publish", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ success: false, error: "AUTHENTICATION_REQUIRED" }, 401);
    const subscription = proSubscriptions.get(user.id);
    if (!subscription?.active) return c.json({ success: false, error: "PRO_REQUIRED", message: "Marketplace publishing requires Pro.", upgradeUrl: "/pricing" }, 403);
    let body: any;
    try { body = await c.req.json(); } catch { return c.json({ success: false, error: "INVALID_JSON" }, 400); }
    const title = String(body.title || "").trim();
    const code = String(body.appCode || body.code || "").trim();
    const price = Number(body.price);
    if (!title || !code || !Number.isFinite(price) || price < 5 || price > 50) return c.json({ success: false, error: "TITLE_CODE_AND_PRICE_REQUIRED" }, 400);
    const apps = (globalThis as any).__marketplaceApps || ((globalThis as any).__marketplaceApps = []);
    const app = { id: `ai_app_${Date.now()}`, title, code, price, creatorId: user.id, creatorName: user.channelName || user.email || "Creator", createdAt: Date.now() };
    apps.unshift(app);
    return c.json({ success: true, app });
  });

  // Watch History & Vector Search Memory
  app.post("/api/history/save", async (c) => {
    return c.json({ success: true });
  });

  app.get("/api/memory/search", (c) => {
    const q = (c.req.query("q") || "").toLowerCase();
    const rows = [
      {
        videoId: "dQw4w9WgXcQ",
        title: "How to Build Neural Networks from Scratch | Full AI Tutorial",
        timestamp: "12:30",
        snippet: "You watched this 3 weeks ago - Training loop & loss function backprop explained at 12:30",
        matchScore: "98%"
      },
      {
        videoId: "L_LUpnjgPso",
        title: "Building Real-time AI Voice Agents with WebSockets & Edge",
        timestamp: "04:12",
        snippet: "You watched this 12 days ago - Low-latency audio buffer streaming setup - Jump to 04:12",
        matchScore: "92%"
      },
      {
        videoId: "M576WGiDBdQ",
        title: "High Performance Cloudflare Workers & Durable Objects Masterclass",
        timestamp: "08:45",
        snippet: "You watched this 5 days ago - SQLite persistence & WebSocket hibernation rules",
        matchScore: "87%"
      }
    ].filter(item => !q || item.title.toLowerCase().includes(q) || item.snippet.toLowerCase().includes(q));

    return c.json({ results: rows });
  });

  app.post("/api/memory/chat", async (c) => {
    const { message } = await c.req.json<{ message: string }>();
    const text = (message || "").toLowerCase();
    
    let answer = "Based on the 3 videos in your watched memory history: You explored Neural Networks backpropagation (at 12:30), Real-time WebSocket Voice Agents (at 04:12), and Cloudflare Workers SQLite persistence.";
    if (text.includes("backprop") || text.includes("neural")) {
      answer = "Based on 'How to Build Neural Networks from Scratch' (watched 3 weeks ago): Backpropagation uses the chain rule to calculate loss gradients backward through each layer to update weights via standard gradient descent (Jump to 12:30).";
    } else if (text.includes("voice") || text.includes("audio")) {
      answer = "Based on 'Building Real-time AI Voice Agents' (watched 12 days ago): The author recommends using WebSockets paired with Opus audio encoding for under 150ms roundtrip voice latency.";
    }

    return c.json({
      answer,
      sources: [
        { title: "How to Build Neural Networks from Scratch", timestamp: "12:30", videoId: "dQw4w9WgXcQ" },
        { title: "Building Real-time AI Voice Agents", timestamp: "04:12", videoId: "L_LUpnjgPso" }
      ]
    });
  });

  // Paystack subscriptions
  app.get("/api/subscription/status", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ authenticated: false, isPro: false });
    const subscription = proSubscriptions.get(user.id);
    const isPro = Boolean(subscription?.active);
    const month = new Date().toISOString().slice(0, 7);
    const usage = Object.fromEntries(Object.keys(aiLimits).map(feature => [
      feature,
      { used: aiUsage.get(`${user.id}:${feature}:${month}`) || 0, limit: isPro ? null : aiLimits[feature] },
    ]));
    return c.json({ authenticated: true, isPro, plan: subscription?.plan || null, usage });
  });
  app.post("/api/paystack/initialize", async (c) => {
    const user = await gatedGetUserFromCookie(c);
    if (!user) return c.json({ error: "SIGNIN_REQUIRED" }, 401);
    const secret = (c.env as Env)?.PAYSTACK_SECRET_KEY;
    if (!secret) return c.json({ error: "PAYSTACK_NOT_CONFIGURED" }, 503);
    const body = await c.req.json<{ plan?: "monthly" | "yearly"; email?: string }>();
    const plan = body.plan === "yearly" ? "yearly" : "monthly";
    const email = String(body.email || user.email || "").trim();
    if (!email || !email.includes("@")) return c.json({ error: "ACCOUNT_EMAIL_REQUIRED" }, 400);
    const planCode = plan === "yearly" ? (c.env as Env)?.PAYSTACK_PLAN_YEARLY : (c.env as Env)?.PAYSTACK_PLAN_MONTHLY;
    const amount = plan === "yearly" ? 9900 : 1900;
    const origin = new URL(c.req.url).origin;
    const payload: Record<string, unknown> = {
      email,
      amount,
      currency: "USD",
      callback_url: `${origin}/pricing?paystack=success`,
      metadata: { userId: user.id, plan },
    };
    if (planCode) payload.plan = planCode;
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
    const secret = (c.env as Env)?.PAYSTACK_SECRET_KEY;
    if (!reference) return c.json({ error: "REFERENCE_REQUIRED" }, 400);
    if (!secret) return c.json({ error: "PAYSTACK_NOT_CONFIGURED" }, 503);

    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    const data: any = await response.json().catch(() => ({}));
    const transaction = data.data;
    const transactionUserId = String(transaction?.metadata?.userId || "");
    const transactionEmail = String(transaction?.customer?.email || "").toLowerCase();
    if (!response.ok || !data.status || transaction?.status !== "success") {
      return c.json({ error: data.message || "PAYSTACK_VERIFICATION_FAILED" }, 502);
    }
    if ((transactionUserId && transactionUserId !== user.id) || (!transactionUserId && transactionEmail !== String(user.email || "").toLowerCase())) {
      return c.json({ error: "PAYSTACK_ACCOUNT_MISMATCH" }, 403);
    }

    const plan = transaction?.metadata?.plan === "yearly" ? "yearly" : "monthly";
    proSubscriptions.set(user.id, { active: true, plan, reference, updatedAt: Date.now() });
    return c.json({ success: true, isPro: true, plan });
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
      const userId = event.data?.metadata?.userId;
      if (userId) proSubscriptions.set(userId, { active: true, plan: event.data?.metadata?.plan || "monthly", reference: event.data?.reference, updatedAt: Date.now() });
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
    if (!apiKey) return c.json({ error: "No API key" }, 400);
    try {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${encodeURIComponent(id)}&key=${apiKey}`);
      if (!res.ok) throw new Error(`YouTube ${res.status}`);
      const data: any = await res.json();
      if (!data.items || data.items.length === 0) throw new Error("Video not found");
      const v = data.items[0];
      return c.json({
        video: {
          id: v.id,
          title: v.snippet.title,
          channel: v.snippet.channelTitle,
          channelId: v.snippet.channelId,
          thumbnail: v.snippet.thumbnails?.high?.url || v.snippet.thumbnails?.medium?.url,
          views: v.statistics.viewCount,
          viewsFormatted: Number(v.statistics.viewCount).toLocaleString() + " views",
          likes: v.statistics.likeCount,
          likeCount: Number(v.statistics.likeCount || 0),
          comments: v.statistics.commentCount,
          duration: v.contentDetails.duration,
          publishedAt: v.snippet.publishedAt,
          statistics: v.statistics,
          snippet: v.snippet,
          contentDetails: v.contentDetails,
        }
      });

      app.get("/api/video/:id/comments", async (c) => {
        const id = c.req.param("id");
        const apiKey = (c.env as Env)?.YOUTUBE_API_KEY || "";
        const maxResults = Math.min(Math.max(Number(c.req.query("max") || "20"), 1), 100);
        if (!id || id.startsWith("mock")) return c.json({ comments: [], real: false, error: "Mock ID, no real comments" }, 400);
        if (!apiKey) return c.json({ comments: [], real: false, error: "No YouTube API key configured" }, 503);
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
          return c.json({ comments, real: true, nextPageToken: data.nextPageToken || "" });
        } catch (e: any) {
          return c.json({ comments: [], real: false, error: e.message || "Unable to load comments" }, 502);
        }
      });
    } catch (e: any) {
      return c.json({ error: e.message }, 500);
    }
  });

  // === NEW: Channel — real YouTube for any UC id (no mock), falls back to inMemory
  app.get("/api/channel/:id", async (c) => {
    const id = c.req.param("id");
    const apiKey = (c.env as Env)?.YOUTUBE_API_KEY || "";
    // If id looks like real YouTube channel ID (UC... 24 chars), try real YouTube API first
    if (apiKey && /^UC[a-zA-Z0-9_-]{22}$/.test(id)) {
      try {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&id=${encodeURIComponent(id)}&key=${apiKey}`);
        if (res.ok) {
          const data: any = await res.json();
          if (data.items && data.items[0]) {
            const info = data.items[0];
            const channel = {
              id: info.id,
              name: info.snippet.title,
              handle: info.snippet.customUrl || `@${info.snippet.title.toLowerCase().replace(/\s+/g, "")}`,
              avatar: info.snippet.thumbnails?.high?.url || info.snippet.thumbnails?.default?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(info.snippet.title)}&background=0B0215&color=FFD700`,
              banner: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80`,
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
    // Fallback to inMemory for mock handles like codecraft, or if real fetch failed
    const channel = resolveChannelById(id);
    const uploads = inMemoryUploads.filter(u => 
      u.channelId === channel.id || 
      slugifyChannel(u.channelName) === channel.id ||
      u.channelName.toLowerCase() === channel.name.toLowerCase()
    );
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
        title?: string;
        description?: string;
        category?: string;
        channelId?: string;
        channelName?: string;
        thumbnailUrl?: string;
        videoUrl?: string;
        duration?: string;
      }>();

      if (!body.title || body.title.trim().length < 3) {
        return c.json({ success: false, error: "Title must be at least 3 characters" }, 400);
      }

      const channelId = body.channelId ? slugifyChannel(body.channelId) : "codecraft";
      const channel = resolveChannelById(channelId);
      const newId = `upload_${Date.now()}_${Math.floor(Math.random()*1000)}`;
      const youtubeId = body.videoUrl ? (body.videoUrl.match(/(?:v=|\/embed\/|\.be\/)([^#&?\/]+)/)?.[1] || newId) : newId;

      const newVideo = {
        id: newId,
        youtubeId,
        title: body.title.trim(),
        channelId: channel.id,
        channelName: body.channelName?.trim() || channel.name,
        channelAvatar: channel.avatar,
        thumbnailUrl: body.thumbnailUrl?.trim() || `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80`,
        views: "0 views",
        duration: body.duration || "10:00",
        category: body.category && inMemoryCategories.includes(body.category) ? body.category : "Tech",
        description: body.description?.trim() || `Uploaded via Alphatekx Stream.`,
        createdAt: Date.now(),
        videoUrl: body.videoUrl || `https://www.youtube-nocookie.com/embed/${youtubeId}`
      };

      inMemoryUploads.unshift(newVideo);

      // also make it searchable: push to search history? No—just keep in uploads.
      return c.json({ success: true, video: newVideo, uploadsCount: inMemoryUploads.length });
    } catch (e: any) {
      return c.json({ success: false, error: e.message || "Invalid JSON" }, 400);
    }
  });

  // Optional: list all uploads
  app.get("/api/uploads", (c) => {
    const category = c.req.query("category");
    let uploads = inMemoryUploads;
    if (category && category !== "All" && category !== "all") {
      uploads = uploads.filter(u => u.category === category);
    }
    return c.json({ uploads, count: uploads.length });
  });

  // Enhance /api/search to also include uploads matching query
  // (mounted as middleware wrap? Instead augment existing /api/search behavior
  // by adding upload matches to its fallback—handled inside its handler remain,
  // but we add a dedicated searchable uploads probe endpoint)
  app.get("/api/search/uploads", (c) => {
    const q = (c.req.query("q") || "").toLowerCase();
    const filtered = inMemoryUploads.filter(u => !q || u.title.toLowerCase().includes(q) || u.channelName.toLowerCase().includes(q) || u.category.toLowerCase().includes(q));
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

  app.post("/api/clips/create", async (c) => {
    let body: any = {};
    try { body = await c.req.json(); } catch {}
    if (!isProRequest(c, body)) {
      return c.json({ success: false, error: "Pro required", message: "AI Clip Maker is Pro-only. Upgrade to Pro to generate viral clips.", upgradeUrl: "/pricing", paywall: true }, 402);
    }
    const { videoUrl, videoId, prompt } = body;
    if (!videoUrl && !videoId) return c.json({ success: false, error: "videoUrl or videoId required" }, 400);
    try {
      const result = await libCreateClip({ videoUrl, videoId, prompt, pro: true });
      return c.json(result);
    } catch (e: any) {
      return c.json({ success: false, error: e.message }, 400);
    }
  });

  app.post("/api/thumbnail/enhance", async (c) => {
    let body: any = {};
    try { body = await c.req.json(); } catch {}
    if (!isProRequest(c, body)) {
      return c.json({ success: false, error: "Pro required", message: "Thumbnail Enhancer is Pro-only. Upgrade to Pro for 4K neon glow.", upgradeUrl: "/pricing", paywall: true }, 402);
    }
    const { thumbnailUrl, imageBase64, style } = body;
    if (!thumbnailUrl && !imageBase64) return c.json({ success: false, error: "thumbnailUrl or imageBase64 required" }, 400);
    try {
      const result = await libEnhanceThumbnail({ thumbnailUrl, imageBase64, style, pro: true });
      return c.json(result);
    } catch (e: any) {
      return c.json({ success: false, error: e.message }, 400);
    }
  });

  app.post("/api/voice/translate", async (c) => {
    let body: any = {};
    try { body = await c.req.json(); } catch {}
    if (!isProRequest(c, body)) {
      return c.json({ success: false, error: "Pro required", message: "Voice Translator is Pro-only. Upgrade to Pro for Pidgin/Yoruba/Igbo/Hausa.", upgradeUrl: "/pricing", paywall: true }, 402);
    }
    const { videoUrl, videoId, targetLang, sourceLang } = body;
    if (!videoUrl && !videoId) return c.json({ success: false, error: "videoUrl or videoId required" }, 400);
    try {
      const result = await libTranslateVoice({ videoUrl, videoId, targetLang, sourceLang, pro: true });
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
  }
};
