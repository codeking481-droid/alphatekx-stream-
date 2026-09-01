// src/lib/tiktok.ts — TikTok search via TikHub / official API + mock fallback
// Prompt #2: backend/src/lib/tiktok.js equivalent (TS)

function toUnified(v: any) {
  return {
    source: "tiktok",
    platform: "tiktok",
    id: v.platformId || v.youtubeId,
    youtubeId: v.youtubeId || v.platformId,
    platformId: v.platformId || v.youtubeId,
    title: v.title,
    thumbnail: v.thumbnailUrl,
    thumbnailUrl: v.thumbnailUrl,
    channel: { name: v.channelName, id: v.handle || v.channelName },
    channelName: v.channelName,
    channelId: v.handle || v.channelName,
    handle: v.handle,
    views: v.viewsRaw ?? v.views,
    viewsFormatted: v.views,
    duration: v.duration,
    category: v.category || "Tech",
    platformMeta: { label: "TikTok", badge: "TT", color: "#FFFFFF", bg: "rgba(0,0,0,0.9)" },
  };
}

export function getMockTikTokCatalog() {
  return [
    { platform: "tiktok", youtubeId: "tt_001", platformId: "719001001", title: "POV: You shaved 500ms off cold start ⚡ #Cloudflare #Workers", channelName: "@tiktokbuilds", handle: "@tiktokbuilds", thumbnailUrl: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=600&q=80", views: "2.1M views", viewsRaw: 2100000, duration: "0:47", category: "Tech" },
    { platform: "tiktok", youtubeId: "tt_002", platformId: "719001002", title: "Naija street food + AI caption sync 🇳🇬 #fyp", channelName: "@naija_eats", handle: "@naija_eats", thumbnailUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80", views: "890K views", viewsRaw: 890000, duration: "0:31", category: "Comedy" },
    { platform: "tiktok", youtubeId: "tt_003", platformId: "719001003", title: "How I built neural nets in 60s (sped up 20x)", channelName: "@codecraft_clips", handle: "@codecraft_clips", thumbnailUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80", views: "1.4M views", viewsRaw: 1400000, duration: "0:58", category: "Neural Networks" },
    { platform: "tiktok", youtubeId: "tt_004", platformId: "719001004", title: "Afrobeats coding session — building while vibing 🇳🇬🎵", channelName: "@afrocode", handle: "@afrocode", thumbnailUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80", views: "670K views", viewsRaw: 670000, duration: "0:42", category: "Music" },
  ];
}

export async function searchTikTok(query: string, apiKey?: string): Promise<{ videos: any[]; isMock: boolean; error?: string }> {
  const catalog = getMockTikTokCatalog();
  const qLower = (query || "").toLowerCase();
  const filter = (arr: any[]) => arr.filter(v => !query || v.title.toLowerCase().includes(qLower) || v.channelName.toLowerCase().includes(qLower) || v.category.toLowerCase().includes(qLower));

  if (!apiKey) {
    return { videos: filter(catalog).map(toUnified), isMock: true };
  }

  // TikHub RapidAPI example: https://api.tikhub.io/api/v1/tiktok/search/video?keyword=...
  // Fallback gracefully on any error
  try {
    // Try TikHub
    const res = await fetch(`https://api.tikhub.io/api/v1/tiktok/search/video?keyword=${encodeURIComponent(query || "trending")}&count=12`, {
      headers: { Authorization: `Bearer ${apiKey}`, "X-TikHub-Token": apiKey },
    });
    if (!res.ok) throw new Error(`TikHub ${res.status}`);
    const data: any = await res.json();
    // TikHub returns { data: { videos: [...] } } — normalize defensively
    const items = data.data?.videos || data.videos || data.aweme_list || [];
    if (!Array.isArray(items) || items.length === 0) throw new Error("empty tikhub response");
    const videos = items.slice(0, 12).map((it: any, idx: number) => toUnified({
      platformId: it.video_id || it.aweme_id || it.id || `tt_real_${idx}`,
      youtubeId: it.video_id || it.aweme_id || `tt_real_${idx}`,
      title: it.desc || it.title || it.caption || "TikTok Video",
      channelName: it.author?.nickname || it.author?.unique_id ? `@${it.author.unique_id}` : "@tiktok_creator",
      handle: it.author?.unique_id ? `@${it.author.unique_id}` : "@tiktok_creator",
      thumbnailUrl: it.video?.cover || it.cover || it.thumbnail || `https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=600&q=80`,
      views: it.statistics?.play_count ? `${(it.statistics.play_count/1000).toFixed(0)}K views` : "100K views",
      viewsRaw: it.statistics?.play_count || 100000,
      duration: it.video?.duration ? `0:${String(it.video.duration%60).padStart(2,"0")}` : "0:30",
      category: "Tech",
    }));
    if (videos.length === 0) throw new Error("no videos after normalize");
    return { videos, isMock: false };
  } catch (e: any) {
    console.warn("[tiktok] real fetch failed, falling back to mock:", e?.message || e);
    // Return filtered mock but mark isMock false? Keep isMock true to indicate fallback
    return { videos: filter(catalog).map(toUnified), isMock: true, error: e.message };
  }
}
