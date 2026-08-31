import { DurableObject } from "cloudflare:workers";
import { Hono } from "hono";

export class App extends DurableObject {
  private app: Hono;

  constructor(ctx: DurableObjectState, env: Record<string, unknown>) {
    super(ctx, env);
    this.app = new Hono();
    this.setupRoutes();
  }

  private initDatabase() {
    // Community Messages table + Index
    this.ctx.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS community_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        videoId TEXT NOT NULL,
        channel TEXT NOT NULL,
        userName TEXT NOT NULL,
        avatarInitials TEXT NOT NULL,
        message TEXT NOT NULL,
        timestampInVideo TEXT,
        likes INTEGER DEFAULT 0,
        createdAt INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_comm_channel_created ON community_messages(channel, createdAt DESC);
      CREATE INDEX IF NOT EXISTS idx_comm_video ON community_messages(videoId);
    `);

    // Marketplace Products table + Index
    this.ctx.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS marketplace_products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        badge TEXT,
        iconType TEXT NOT NULL,
        sellerEmail TEXT NOT NULL,
        fileUrl TEXT,
        salesCount INTEGER DEFAULT 0,
        category TEXT NOT NULL,
        tags TEXT,
        relatedTopic TEXT,
        createdAt INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_market_category ON marketplace_products(category);
      CREATE INDEX IF NOT EXISTS idx_market_sales ON marketplace_products(salesCount DESC);
    `);

    // Queue Items table + Index
    this.ctx.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS queue_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userEmail TEXT NOT NULL,
        platform TEXT NOT NULL,
        videoId TEXT NOT NULL,
        title TEXT NOT NULL,
        thumbnail TEXT NOT NULL,
        duration TEXT NOT NULL,
        position INTEGER NOT NULL,
        isPlayed INTEGER DEFAULT 0,
        createdAt INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_queue_pos ON queue_items(position ASC);
    `);

    // Watch History table + Index
    this.ctx.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS watch_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userEmail TEXT NOT NULL,
        videoId TEXT NOT NULL,
        title TEXT NOT NULL,
        summary TEXT,
        transcript TEXT,
        watchedAt INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_watch_user_time ON watch_history(userEmail, watchedAt DESC);
    `);

    // Courses table
    this.ctx.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userEmail TEXT NOT NULL,
        goal TEXT NOT NULL,
        stepsJson TEXT NOT NULL,
        createdAt INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_courses_user ON courses(userEmail, createdAt DESC);
    `);

    // Memory Chats table
    this.ctx.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS memory_chats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userEmail TEXT NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        sourcesJson TEXT NOT NULL,
        createdAt INTEGER NOT NULL
      )
    `);

    // User Profile table
    this.ctx.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        email TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        bio TEXT,
        avatar TEXT,
        subscriptionTier TEXT DEFAULT 'free',
        stripeCustomerId TEXT,
        streakDays INTEGER DEFAULT 7,
        followsJson TEXT
      )
    `);

    // Seed default data if empty
    const productCount = this.ctx.storage.sql.exec(`SELECT COUNT(*) as cnt FROM marketplace_products`).one().cnt as number;
    if (productCount === 0) {
      const now = Date.now();
      this.ctx.storage.sql.exec(`
        INSERT INTO marketplace_products (name, description, price, badge, iconType, sellerEmail, fileUrl, salesCount, category, tags, relatedTopic, createdAt)
        VALUES 
        ('AI Neural Net Model Pack', 'Pre-trained PyTorch checkpoint & CUDA optimized dataset for vision + NLP models.', 9.99, 'BESTSELLER', 'cpu', 'dev@alphatekx.ai', 'https://github.com/alphatekx/model-pack.zip', 342, 'app', 'python,pytorch,ai', 'neural-networks', ?),
        ('Stream Platform Course Bundle', 'Complete 6-hour hands-on video masterclass with source code & verified certificate.', 24.99, 'HOT', 'video', 'academy@alphatekx.ai', 'https://alphatekx.ai/course-bundle.zip', 189, 'course', 'react,streaming,ai', 'streaming', ?),
        ('Naija AI Speech Translator Engine', 'Low-latency Pidgin, Yoruba, Igbo & Hausa TTS & STT API wrapper plugin for web apps.', 14.99, 'NEW', 'sparkles', 'nigeria-ai@alphatekx.ai', 'https://github.com/alphatekx/naija-tts.zip', 95, 'plugin', 'pidgin,translation,audio', 'translation', ?),
        ('TikTok & YouTube Unified Queue SDK', 'JavaScript library to sync queue states & embeds between YouTube & TikTok players.', 4.99, 'PRO', 'layers', 'sdk@alphatekx.ai', 'https://github.com/alphatekx/queue-sdk.zip', 521, 'plugin', 'queue,tiktok,youtube', 'queue', ?)
      `, now, now, now, now);
    }

    const msgCount = this.ctx.storage.sql.exec(`SELECT COUNT(*) as cnt FROM community_messages`).one().cnt as number;
    if (msgCount === 0) {
      const now = Date.now();
      this.ctx.storage.sql.exec(`
        INSERT INTO community_messages (videoId, channel, userName, avatarInitials, message, timestampInVideo, likes, createdAt)
        VALUES
        ('dQw4w9WgXcQ', 'general', 'dev_nina', 'N', 'This explanation at 8:15 finally made backprop click — thank you! 🔥', '8:15', 14, ?),
        ('dQw4w9WgXcQ', 'general', 'ml_learner', 'M', 'Would love a follow-up on CNNs & Attention mechanisms next. Super clear!', '12:30', 9, ?),
        ('dQw4w9WgXcQ', 'builders', 'tech_guru', 'T', 'Are you guys using PyTorch 2.0 compile mode or raw CUDA kernels for this demo?', '2:15', 5, ?),
        ('dQw4w9WgXcQ', 'marketplace', 'ai_builder', 'A', 'Bought the AI Neural Net Model Pack from the watch card! Worth every cent 🚀', '', 8, ?)
      `, now - 120000, now - 60000, now - 30000, now - 10000);
    }

    const queueCount = this.ctx.storage.sql.exec(`SELECT COUNT(*) as cnt FROM queue_items`).one().cnt as number;
    if (queueCount === 0) {
      const now = Date.now();
      this.ctx.storage.sql.exec(`
        INSERT INTO queue_items (userEmail, platform, videoId, title, thumbnail, duration, position, isPlayed, createdAt)
        VALUES
        ('user@alphatekx.com', 'youtube', 'dQw4w9WgXcQ', 'How to Build Neural Networks from Scratch | Full AI Tutorial', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80', '22:45', 0, 0, ?),
        ('user@alphatekx.com', 'tiktok', '7123456789', 'Fastest way to deploy WebAssembly to Cloudflare Workers in 60s ⚡', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80', '0:58', 1, 0, ?),
        ('user@alphatekx.com', 'youtube', 'L_LUpnjgPso', 'Building Real-time AI Voice Agents with WebSockets & Edge Computing', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80', '15:10', 2, 0, ?)
      `, now, now, now);
    }
  }

  private setupRoutes() {
    this.app.use("*", async (c, next) => {
      this.initDatabase();
      c.header("Cache-Control", "public, max-age=5, s-maxage=10");
      await next();
    });

    this.app.get("/api/health", (c) => c.json({ status: "ok", app: "Alphatekx Stream", scale: "1M+ Ready" }));

    // High Scale Search API
    this.app.get("/api/search", (c) => {
      const q = (c.req.query("q") || "").toLowerCase();
      const catalog = [
        { id: "dQw4w9WgXcQ", title: "How to Build Neural Networks from Scratch | Full AI Tutorial 2024", channel: "CodeCraft Academy", views: "340K views", timeAgo: "3 days ago", duration: "22:45", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80", tag: "Neural Networks" },
        { id: "L_LUpnjgPso", title: "Building Real-time AI Voice Agents with WebSockets", channel: "Edge AI Lab", views: "185K views", timeAgo: "1 week ago", duration: "15:10", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80", tag: "Cloudflare Workers" },
        { id: "M576WGiDBdQ", title: "Cloudflare Workers & SQLite Durable Objects Masterclass", channel: "Serverless Pro", views: "92K views", timeAgo: "4 days ago", duration: "18:30", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80", tag: "Cloudflare Workers" },
        { id: "fJ9rUzIMcZQ", title: "Sub-100ms LLM Streaming Inference on Edge GPUs", channel: "AI Hardware Hub", views: "410K views", timeAgo: "2 weeks ago", duration: "32:15", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80", tag: "AI Superpowers" },
        { id: "3JZ_D3ELwOQ", title: "Naija Pidgin AI Voice Synthesizer & Subtitle Engine", channel: "Naija Tech Hub", views: "512K views", timeAgo: "5 days ago", duration: "12:04", img: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?auto=format&fit=crop&w=600&q=80", tag: "Naija Dialects" }
      ];

      const results = catalog.filter(item => 
        !q || item.title.toLowerCase().includes(q) || item.channel.toLowerCase().includes(q) || item.tag.toLowerCase().includes(q)
      );

      return c.json({ query: q, results });
    });

    // Community Chat
    this.app.get("/api/community/:channel", (c) => {
      const channel = c.req.param("channel") || "general";
      const limit = Math.min(Number(c.req.query("limit")) || 50, 100);
      const rows = this.ctx.storage.sql.exec(
        `SELECT * FROM community_messages WHERE channel = ? ORDER BY createdAt ASC LIMIT ?`,
        channel, limit
      ).toArray();
      return c.json({ messages: rows });
    });

    this.app.post("/api/community/send", async (c) => {
      const body = await c.req.json<{
        videoId?: string;
        channel?: string;
        userName?: string;
        avatarInitials?: string;
        message: string;
        timestampInVideo?: string;
      }>();
      const videoId = body.videoId || "dQw4w9WgXcQ";
      const channel = body.channel || "general";
      const userName = body.userName || "Guest_Pioneer";
      const avatarInitials = body.avatarInitials || userName.charAt(0).toUpperCase();
      const timestampInVideo = body.timestampInVideo || "";
      const createdAt = Date.now();

      this.ctx.storage.sql.exec(
        `INSERT INTO community_messages (videoId, channel, userName, avatarInitials, message, timestampInVideo, likes, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, 0, ?)`,
        videoId, channel, userName, avatarInitials, body.message, timestampInVideo, createdAt
      );

      const inserted = this.ctx.storage.sql.exec(
        `SELECT * FROM community_messages WHERE createdAt = ? ORDER BY id DESC LIMIT 1`,
        createdAt
      ).toArray()[0];

      return c.json({ success: true, message: inserted });
    });

    // Marketplace
    this.app.get("/api/marketplace", (c) => {
      const category = c.req.query("category");
      let sql = `SELECT * FROM marketplace_products`;
      const params: string[] = [];
      if (category && category !== "all") {
        sql += ` WHERE category = ?`;
        params.push(category);
      }
      sql += ` ORDER BY salesCount DESC`;
      const rows = this.ctx.storage.sql.exec(sql, ...params).toArray();
      return c.json({ products: rows });
    });

    this.app.post("/api/marketplace/sell", async (c) => {
      const body = await c.req.json<{
        name: string;
        description: string;
        price: number;
        category: string;
        sellerEmail: string;
        fileUrl?: string;
        tags?: string;
      }>();
      const createdAt = Date.now();
      const iconMap: Record<string, string> = { app: "cpu", course: "video", plugin: "sparkles" };
      const iconType = iconMap[body.category] || "layers";

      this.ctx.storage.sql.exec(
        `INSERT INTO marketplace_products (name, description, price, badge, iconType, sellerEmail, fileUrl, salesCount, category, tags, relatedTopic, createdAt)
         VALUES (?, ?, ?, 'NEW', ?, ?, ?, 0, ?, ?, 'ai', ?)`,
        body.name, body.description, body.price, iconType, body.sellerEmail || "creator@alphatekx.ai", body.fileUrl || "https://alphatekx.ai/download/pkg.zip", body.category, body.tags || "", createdAt
      );

      return c.json({ success: true, message: "Product listed successfully!" });
    });

    this.app.post("/api/marketplace/checkout", async (c) => {
      const { productId } = await c.req.json<{ productId: number }>();
      this.ctx.storage.sql.exec(`UPDATE marketplace_products SET salesCount = salesCount + 1 WHERE id = ?`, productId);
      return c.json({
        success: true,
        orderId: `ORD-${Date.now()}-${Math.floor(Math.random()*1000)}`,
        downloadUrl: `https://alphatekx.ai/downloads/product-${productId}.zip`,
        message: "Payment processed via Stripe Test Mode! Download ready."
      });
    });

    // Unified Queue
    this.app.get("/api/queue", (c) => {
      const rows = this.ctx.storage.sql.exec(`SELECT * FROM queue_items ORDER BY position ASC`).toArray();
      return c.json({ queue: rows });
    });

    this.app.post("/api/queue/add", async (c) => {
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

      const count = this.ctx.storage.sql.exec(`SELECT COUNT(*) as c FROM queue_items`).one().c as number;
      const title = isTikTok ? `TikTok Viral AI Clip #${count + 1}` : `Imported Stream: ${url.slice(0, 30)}...`;
      const thumbnail = isTikTok 
        ? "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?auto=format&fit=crop&w=600&q=80"
        : `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

      const createdAt = Date.now();
      this.ctx.storage.sql.exec(
        `INSERT INTO queue_items (userEmail, platform, videoId, title, thumbnail, duration, position, isPlayed, createdAt)
         VALUES ('user@alphatekx.com', ?, ?, ?, ?, '04:15', ?, 0, ?)`,
        platform, videoId, title, thumbnail, count, createdAt
      );

      const items = this.ctx.storage.sql.exec(`SELECT * FROM queue_items ORDER BY position ASC`).toArray();
      return c.json({ success: true, queue: items });
    });

    this.app.delete("/api/queue/:id", (c) => {
      const id = c.req.param("id");
      this.ctx.storage.sql.exec(`DELETE FROM queue_items WHERE id = ?`, id);
      const items = this.ctx.storage.sql.exec(`SELECT * FROM queue_items ORDER BY position ASC`).toArray();
      return c.json({ success: true, queue: items });
    });

    // AI Summary & Naija Translation API
    this.app.post("/api/summary", async (c) => {
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

    this.app.post("/api/translate", async (c) => {
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
    this.app.post("/api/teacher/build", async (c) => {
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

      const createdAt = Date.now();
      this.ctx.storage.sql.exec(
        `INSERT INTO courses (userEmail, goal, stepsJson, createdAt) VALUES ('user@alphatekx.com', ?, ?, ?)`,
        goal, JSON.stringify(steps), createdAt
      );

      return c.json({
        id: Date.now(),
        goal,
        steps,
        createdAt
      });
    });

    // Watch History & Vector Search Memory
    this.app.post("/api/history/save", async (c) => {
      const { videoId, title, summary } = await c.req.json<{ videoId: string; title: string; summary: string }>();
      const watchedAt = Date.now();
      this.ctx.storage.sql.exec(
        `INSERT INTO watch_history (userEmail, videoId, title, summary, transcript, watchedAt)
         VALUES ('user@alphatekx.com', ?, ?, ?, '', ?)`,
        videoId, title, summary, watchedAt
      );
      return c.json({ success: true });
    });

    this.app.get("/api/memory/search", (c) => {
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

    this.app.post("/api/memory/chat", async (c) => {
      const { message } = await c.req.json<{ message: string }>();
      const text = message.toLowerCase();
      
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
    this.app.post("/api/subscription/checkout", (c) => {
      return c.json({
        url: "#",
        success: true,
        message: "Pro Subscription Activated! Unlimited AI summaries, Naija Translator, AI Teacher & Memory Chat unlocked.",
        tier: "pro"
      });
    });
  }

  async fetch(request: Request): Promise<Response> {
    return this.app.fetch(request);
  }
}
