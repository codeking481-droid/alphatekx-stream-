// backend/src/lib/youtube.js — YouTube Data API + Piped + Scrape (oEmbed) + cache
function parseIsoDuration(iso) {
  if (!iso) return "5:00";
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return "10:00";
  const h = m[1] ? parseInt(m[1]) : 0;
  const mins = m[2] ? parseInt(m[2]) : 0;
  const secs = m[3] ? parseInt(m[3]) : 0;
  const s = secs < 10 ? `0${secs}` : `${secs}`;
  if (h > 0) { const mm = mins < 10 ? `0${mins}` : `${mins}`; return `${h}:${mm}:${s}`; }
  return `${mins}:${s}`;
}
function formatViews(count) {
  if (!count) return "100K views";
  const n = parseInt(count); if (isNaN(n)) return "100K views";
  if (n >= 1000000) return `${(n/1000000).toFixed(1)}M views`;
  if (n >= 1000) return `${Math.round(n/1000)}K views`; return `${n} views`;
}
export function getMockYouTubeCatalog() {
  return [
    { youtubeId: "dQw4w9WgXcQ", title: "How to Build Neural Networks from Scratch | Full AI Tutorial 2024", channelName: "CodeCraft Academy", channelId: "UCodeCraft", thumbnailUrl: "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg", views: "340K views", viewsRaw: 340000, duration: "22:45", category: "Neural Networks" },
    { youtubeId: "L_LUpnjgPso", title: "Building Real-time AI Voice Agents with WebSockets & Edge GPUs", channelName: "Edge AI Lab", channelId: "UEdgeAI", thumbnailUrl: "https://i.ytimg.com/vi/L_LUpnjgPso/maxresdefault.jpg", views: "185K views", viewsRaw: 185000, duration: "15:10", category: "Cloudflare Workers" },
    { youtubeId: "M576WGiDBdQ", title: "Cloudflare Workers & SQLite Durable Objects Masterclass", channelName: "Serverless Pro", channelId: "UServerless", thumbnailUrl: "https://i.ytimg.com/vi/M576WGiDBdQ/maxresdefault.jpg", views: "92K views", viewsRaw: 92000, duration: "18:30", category: "Cloudflare Workers" },
    { youtubeId: "fJ9rUzIMcZQ", title: "Sub-100ms LLM Streaming Inference on Edge GPUs", channelName: "AI Hardware Hub", channelId: "UAIHardware", thumbnailUrl: "https://i.ytimg.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg", views: "410K views", viewsRaw: 410000, duration: "32:15", category: "AI Superpowers" },
    { youtubeId: "3JZ_D3ELwOQ", title: "Naija Pidgin AI Voice Synthesizer & Subtitle Engine", channelName: "Naija Tech Hub", channelId: "UNaijaTech", thumbnailUrl: "https://i.ytimg.com/vi/3JZ_D3ELwOQ/maxresdefault.jpg", views: "512K views", viewsRaw: 512000, duration: "12:04", category: "Naija Dialects" },
  ];
}
function toUnified(v) {
  const thumb = v.thumbnailUrl || (v.youtubeId ? `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg` : "");
  return { source: "youtube", platform: "youtube", id: v.youtubeId, videoId: v.youtubeId, youtubeId: v.youtubeId, platformId: v.youtubeId, title: v.title, thumbnail: thumb, thumbnailUrl: thumb, channel: { name: v.channelName, id: v.channelId || v.channelName }, channelName: v.channelName, channelId: v.channelId || v.channelName, views: v.viewsRaw ?? v.views, viewsRaw: v.viewsRaw, viewsFormatted: v.views, duration: v.duration, category: v.category || "Tech", platformMeta: { label: "YouTube", badge: "YT", color: "#FF0000", bg: "rgba(255,0,0,0.9)" } };
}
const searchCache = new Map();
const CACHE_TTL = 5 * 60 * 1000;
async function fetchPipedSearch(query) {
  try {
    const url = `https://pipedapi.kavin.rocks/search?q=${encodeURIComponent(query || "AI")}&filter=videos`;
    const res = await fetch(url, { headers: { "User-Agent": "Alphatekx/1.0" } });
    if (!res.ok) throw new Error(`Piped ${res.status}`);
    const data = await res.json();
    const items = data.items || data.results || [];
    if (!Array.isArray(items) || items.length === 0) throw new Error("Piped empty");
    const videos = items.slice(0, 12).map(it => {
      const url = it.url || it.id || "";
      const vid = url.match(/v=([^&]+)/)?.[1] || it.id || `piped_${Math.random().toString(36).slice(2,8)}`;
      const viewsRaw = typeof it.views === "number" ? it.views : parseInt(String(it.views).replace(/[^0-9]/g, "")) || 100000;
      return toUnified({ youtubeId: vid, title: it.title || it.name || "YouTube Video", channelName: it.uploaderName || it.uploader || "YouTube Creator", channelId: it.uploaderUrl || it.uploaderName || "unknown", thumbnailUrl: it.thumbnail ? (it.thumbnail.startsWith("http") ? it.thumbnail : `https://i.ytimg.com/vi/${vid}/maxresdefault.jpg`) : `https://i.ytimg.com/vi/${vid}/maxresdefault.jpg`, views: formatViews(String(viewsRaw)), viewsRaw, duration: it.duration ? String(it.duration) : "5:00", category: "Tech" });
    });
    if (videos.length === 0) throw new Error("Piped no videos");
    return videos;
  } catch (e) { console.warn("[youtube] Piped fallback failed", e); throw e; }
}
async function fetchScrapeSearch(query) {
  try {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query || "AI")}`;
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", "Accept-Language": "en-US,en;q=0.9" } });
    if (!res.ok) throw new Error(`Scrape ${res.status}`);
    const html = await res.text();
    const ids = [...new Set([...html.matchAll(/watch\?v=([a-zA-Z0-9_-]{11})/g)].map(m=>m[1]))].slice(0, 12);
    if (ids.length === 0) throw new Error("No ids");
    const videos = await Promise.all(ids.map(async id => {
      let title = `YouTube Video ${id}`;
      let channelName = "YouTube Creator";
      try {
        const oRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
        if (oRes.ok) {
          const oData = await oRes.json();
          if (oData.title) title = oData.title.slice(0, 80);
          if (oData.author_name) channelName = oData.author_name;
        }
      } catch {}
      if (title === `YouTube Video ${id}`) {
        const idx = html.indexOf(id);
        const snippet = html.slice(Math.max(0, idx - 5000), idx + 5000);
        const titleMatch = snippet.match(/"title":\{"runs":\[\{"text":"([^"]+)"\}\]\}/);
        if (titleMatch && titleMatch[1]) title = titleMatch[1].replace(/\\u0026/g, "&").slice(0, 80);
        const channelMatch = snippet.match(/"ownerText":\{"runs":\[\{"text":"([^"]+)"\}\]\}/);
        if (channelMatch) channelName = channelMatch[1].replace(/\\u0026/g, "&");
      }
      return toUnified({ youtubeId: id, title: title.slice(0, 80), channelName, channelId: channelName, thumbnailUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`, views: "100K views", duration: "5:00", category: "Tech" });
    }));
    return videos;
  } catch (e) { console.warn("[youtube] Scrape fallback failed", e); throw e; }
}
export async function searchYouTube(query, apiKey) {
  const cacheKey = (query || "").toLowerCase().trim() || "__empty__";
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return { videos: cached.videos, isMock: false };
  const catalog = getMockYouTubeCatalog();
  const qLower = (query || "").toLowerCase();
  const filter = (arr) => { let f = arr.filter(v => !query || v.title.toLowerCase().includes(qLower) || v.channelName.toLowerCase().includes(qLower)); if (f.length === 0) f = arr; return f; };
  if (!apiKey) {
    try { const piped = await fetchPipedSearch(query || "AI"); searchCache.set(cacheKey, { videos: piped, ts: Date.now() }); return { videos: piped, isMock: false }; } catch { try { const scraped = await fetchScrapeSearch(query || "AI"); searchCache.set(cacheKey, { videos: scraped, ts: Date.now() }); return { videos: scraped, isMock: false }; } catch {} return { videos: filter(catalog).map(toUnified), isMock: true }; }
  }
  try {
    const searchRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&type=video&q=${encodeURIComponent(query || "AI programming")}&key=${apiKey}`);
    if (!searchRes.ok) {
      const txt = await searchRes.text().catch(() => "");
      console.warn("[youtube] search failed", searchRes.status, txt);
      if (searchRes.status === 403 || searchRes.status === 429) {
        try { const piped = await fetchPipedSearch(query || "AI"); searchCache.set(cacheKey, { videos: piped, ts: Date.now() }); return { videos: piped, isMock: false, error: `YouTube ${searchRes.status} — Piped real fallback` }; } catch {}
        try { const scraped = await fetchScrapeSearch(query || "AI"); searchCache.set(cacheKey, { videos: scraped, ts: Date.now() }); return { videos: scraped, isMock: false, error: `YouTube ${searchRes.status} — Scrape real fallback` }; } catch {}
      }
      return { videos: filter(catalog).map(toUnified), isMock: true, error: `YouTube ${searchRes.status}` };
    }
    const searchData = await searchRes.json();
    const items = searchData.items || [];
    const videoIds = items.map(it => it.id?.videoId).filter(Boolean);
    if (videoIds.length === 0) return { videos: [], isMock: false };
    let detailsMap = {};
    try {
      const detailsRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds.join(",")}&key=${apiKey}`);
      if (detailsRes.ok) {
        const detailsData = await detailsRes.json();
        (detailsData.items || []).forEach(it => { detailsMap[it.id] = { duration: parseIsoDuration(it.contentDetails?.duration), views: formatViews(it.statistics?.viewCount), viewsRaw: parseInt(it.statistics?.viewCount || "0") }; });
      }
    } catch (e) { console.warn("[youtube] details fetch failed", e); }
    const videos = items.map(item => {
      const vid = item.id?.videoId || "";
      const det = detailsMap[vid] || {};
      return toUnified({ youtubeId: vid, title: item.snippet?.title || "YouTube Video", channelName: item.snippet?.channelTitle || "YouTube Creator", channelId: item.snippet?.channelId || item.snippet?.channelTitle, thumbnailUrl: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || `https://i.ytimg.com/vi/${vid}/maxresdefault.jpg`, views: det.views || "100K views", viewsRaw: det.viewsRaw, duration: det.duration || "5:00", category: "Tech" });
    });
    searchCache.set(cacheKey, { videos, ts: Date.now() });
    return { videos, isMock: false };
  } catch (e) {
    console.error("[youtube] exception", e?.message || e);
    try { const piped = await fetchPipedSearch(query || "AI"); searchCache.set(cacheKey, { videos: piped, ts: Date.now() }); return { videos: piped, isMock: false, error: e.message + " — Piped fallback" }; } catch {}
    try { const scraped = await fetchScrapeSearch(query || "AI"); searchCache.set(cacheKey, { videos: scraped, ts: Date.now() }); return { videos: scraped, isMock: false, error: e.message + " — Scrape fallback" }; } catch {}
    return { videos: filter(catalog).map(toUnified), isMock: true, error: e.message };
  }
}
