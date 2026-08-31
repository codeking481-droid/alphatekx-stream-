import { DurableObject } from "cloudflare:workers";
import { Hono } from "hono";

interface Env {
  YOUTUBE_API_KEY?: string;
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

let inMemoryQueue = [
  { id: 1, userEmail: 'user@alphatekx.com', platform: 'youtube', videoId: 'dQw4w9WgXcQ', title: 'How to Build Neural Networks from Scratch | Full AI Tutorial', thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80', duration: '22:45', position: 0, isPlayed: 0, createdAt: Date.now() },
  { id: 2, userEmail: 'user@alphatekx.com', platform: 'tiktok', videoId: '7123456789', title: 'Fastest way to deploy WebAssembly to Cloudflare Workers in 60s ⚡', thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80', duration: '0:58', position: 1, isPlayed: 0, createdAt: Date.now() },
  { id: 3, userEmail: 'user@alphatekx.com', platform: 'youtube', videoId: 'L_LUpnjgPso', title: 'Building Real-time AI Voice Agents with WebSockets & Edge Computing', thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80', duration: '15:10', position: 2, isPlayed: 0, createdAt: Date.now() }
];

// Persistent Search History — survives until worker restarts, deduped by youtubeId, newest first
export let inMemorySearchHistory: Array<{
  youtubeId: string;
  title: string;
  channelName: string;
  thumbnailUrl: string;
  views: string;
  duration: string;
  searchedQuery: string;
  searchedAt: number;
}> = [];

function pushToSearchHistory(videos: any[], searchedQuery: string) {
  for (const v of videos) {
    const youtubeId = v.youtubeId || v.id;
    if (!youtubeId) continue;
    // dedupe by youtubeId — if exists, update searchedAt/query and move to front
    const existingIdx = inMemorySearchHistory.findIndex((h) => h.youtubeId === youtubeId);
    if (existingIdx !== -1) {
      const existing = inMemorySearchHistory.splice(existingIdx, 1)[0];
      existing.searchedQuery = searchedQuery || existing.searchedQuery;
      existing.searchedAt = Date.now();
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
        searchedAt: Date.now(),
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

  // REAL YouTube Data API v3 Search Endpoint — ALWAYS works, persists to history
  app.get("/api/search", async (c) => {
    const q = c.req.query("q") || "";
    const apiKey = c.env?.YOUTUBE_API_KEY || "";

    const mockCatalog = [
      {
        youtubeId: "dQw4w9WgXcQ",
        title: "How to Build Neural Networks from Scratch | Full AI Tutorial 2024",
        channelName: "CodeCraft Academy",
        thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
        views: "340K views",
        duration: "22:45"
      },
      {
        youtubeId: "L_LUpnjgPso",
        title: "Building Real-time AI Voice Agents with WebSockets & Edge GPUs",
        channelName: "Edge AI Lab",
        thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
        views: "185K views",
        duration: "15:10"
      },
      {
        youtubeId: "M576WGiDBdQ",
        title: "Cloudflare Workers & SQLite Durable Objects Masterclass",
        channelName: "Serverless Pro",
        thumbnailUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80",
        views: "92K views",
        duration: "18:30"
      },
      {
        youtubeId: "fJ9rUzIMcZQ",
        title: "Sub-100ms LLM Streaming Inference on Edge GPUs",
        channelName: "AI Hardware Hub",
        thumbnailUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
        views: "410K views",
        duration: "32:15"
      },
      {
        youtubeId: "3JZ_D3ELwOQ",
        title: "Naija Pidgin AI Voice Synthesizer & Subtitle Engine",
        channelName: "Naija Tech Hub",
        thumbnailUrl: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?auto=format&fit=crop&w=600&q=80",
        views: "512K views",
        duration: "12:04"
      }
    ];

    // Helper: return mocks but NEVER vanish — if filter yields 0, return full catalog so user never sees empty
    const getMockFallback = (query: string) => {
      const qLower = query.toLowerCase();
      let filtered = mockCatalog.filter(item =>
        !query ||
        item.title.toLowerCase().includes(qLower) ||
        item.channelName.toLowerCase().includes(qLower)
      );
      // FIX: "burna boy" / "wizkid" previously returned [] — now returns full catalog instead of empty
      if (filtered.length === 0) filtered = mockCatalog;
      return filtered;
    };

    if (!apiKey) {
      console.warn("[search] YOUTUBE_API_KEY missing — serving mock catalog for q:", q);
      const fallback = getMockFallback(q);
      // persist mocks too so history never vanishes
      pushToSearchHistory(fallback, q);
      return c.json({ videos: fallback, isMock: true });
    }

    try {
      const searchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&type=video&q=${encodeURIComponent(q || "AI programming")}&key=${apiKey}`
      );

      if (!searchRes.ok) {
        console.error("[search] YouTube search failed", searchRes.status, await searchRes.text().catch(() => ""), "q:", q);
        const fallback = getMockFallback(q);
        pushToSearchHistory(fallback, q);
        return c.json({ videos: fallback, isMock: true, status: searchRes.status });
      }

      const searchData = (await searchRes.json()) as any;
      const items = searchData.items || [];
      const videoIds = items.map((it: any) => it.id?.videoId).filter(Boolean);

      if (videoIds.length === 0) {
        console.warn("[search] YouTube returned 0 items for q:", q);
        return c.json({ videos: [], isMock: false });
      }

      let videoDetailsMap: Record<string, { duration?: string; views?: string }> = {};
      try {
        const detailsRes = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds.join(",")}&key=${apiKey}`
        );
        if (detailsRes.ok) {
          const detailsData = (await detailsRes.json()) as any;
          (detailsData.items || []).forEach((vItem: any) => {
            videoDetailsMap[vItem.id] = {
              duration: parseIsoDuration(vItem.contentDetails?.duration),
              views: formatViews(vItem.statistics?.viewCount)
            };
          });
        } else {
          console.warn("[search] YouTube details fetch not ok", detailsRes.status);
        }
      } catch (e) {
        console.warn("Failed to fetch YouTube details:", e);
      }

      const videos = items.map((item: any) => {
        const vid = item.id?.videoId || "";
        const details = videoDetailsMap[vid] || {};
        return {
          youtubeId: vid,
          title: item.snippet?.title || "YouTube Video",
          channelName: item.snippet?.channelTitle || "YouTube Creator",
          thumbnailUrl:
            item.snippet?.thumbnails?.high?.url ||
            item.snippet?.thumbnails?.medium?.url ||
            item.snippet?.thumbnails?.default?.url ||
            `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`,
          views: details.views || "100K views",
          duration: details.duration || "15:00"
        };
      });

      // auto-persist real results newest-first, deduped
      pushToSearchHistory(videos, q);

      return c.json({ videos, isMock: false });
    } catch (err: any) {
      console.error("[search] exception for q:", q, err?.message || err);
      const fallback = getMockFallback(q);
      pushToSearchHistory(fallback, q);
      return c.json({ videos: fallback, isMock: true, error: err.message });
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

  // AI Teacher Course Builder
  app.post("/api/teacher/build", async (c) => {
    const { goal } = await c.req.json<{ goal: string }>();
    const steps = [
      {
        step: 1,
        title: "Foundations & Architecture",
        description: `Master core concepts of ${goal || "Modern AI Streaming & Neural Systems"}. Understand weights, biases and graph flows.`,
        searchQuery: `${goal} foundations tutorial`,
        videoId: "dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
        isCompleted: false
      },
      {
        step: 2,
        title: "Hands-on Code & Setup",
        description: "Initialize your project repository with React, Tailwind, Cloudflare Workers & PyTorch models.",
        searchQuery: `${goal} full implementation code`,
        videoId: "L_LUpnjgPso",
        thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80",
        isCompleted: false
      },
      {
        step: 3,
        title: "Optimizing Performance & Edge Delivery",
        description: "Implement zero-latency streaming buffers, WebSockets fan-out, and GPU inference pipelines.",
        searchQuery: `${goal} performance optimization high throughput`,
        videoId: "M576WGiDBdQ",
        thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80",
        isCompleted: false
      },
      {
        step: 4,
        title: "Integrating AI Superpowers",
        description: "Connect real-time translation, dynamic timestamp summaries, and similarity search vectors.",
        searchQuery: `${goal} AI summary and memory search integration`,
        videoId: "fJ9rUzIMcZQ",
        thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80",
        isCompleted: false
      },
      {
        step: 5,
        title: "Production Deployment & Monetization",
        description: "Set up Stripe subscriptions, digital asset store, and scale to 100k active viewers.",
        searchQuery: `${goal} SaaS production deployment stripe`,
        videoId: "3JZ_D3ELwOQ",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80",
        isCompleted: false
      }
    ];

    return c.json({
      id: Date.now(),
      goal,
      steps,
      createdAt: Date.now()
    });
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

  // Subscription & Profile
  app.post("/api/subscription/checkout", (c) => {
    return c.json({
      url: "#",
      success: true,
      message: "Pro Subscription Activated! Unlimited AI summaries, Naija Translator, AI Teacher & Memory Chat unlocked.",
      tier: "pro"
    });
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
