// backend/src/lib/channel.js — JS mirror of src/lib/channel.ts
export const CHANNEL_ID = "UCGm89Z31SYxEU9PEQ-p3cNA";
export const CHANNEL_HANDLE = "@risewithalphatekx";
export const CHANNEL_NAME = "ALPHATEKX";

export function getMockChannelInfo() {
  return {
    id: CHANNEL_ID,
    snippet: {
      title: CHANNEL_NAME,
      description: "Official ALPHATEKX channel — AI avatars, HeyGen alternatives, Naija tech 🇳🇬 | alphatekx.name.ng | alphatekxcompany@gmail.com",
      customUrl: CHANNEL_HANDLE,
      thumbnails: {
        default: { url: "https://img.youtube.com/vi/jvXEkm27XOE/hqdefault.jpg" },
        medium: { url: "https://img.youtube.com/vi/jvXEkm27XOE/mqdefault.jpg" },
        high: { url: "https://img.youtube.com/vi/jvXEkm27XOE/hqdefault.jpg" },
      },
      publishedAt: "2022-01-01T00:00:00Z",
    },
    statistics: {
      subscriberCount: "3020",
      videoCount: "41",
      viewCount: "150000",
      hiddenSubscriberCount: false,
    },
    contentDetails: { relatedPlaylists: { uploads: "UU" + CHANNEL_ID.slice(2) } },
  };
}

const MOCK_THUMBS = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80",
];

const MOCK_TITLES = [
  "This AI Avatar BEATS HeyGen 10 TIMES! 🤯 #viral #trending",
  "Building Real-Time AI Voice Avatars — Full Build Log",
  "HeyGen vs ALPHATEKX — Side by Side Cost Comparison",
  "How I Automate Video Creation with AI — No Code",
  "Naija AI Avatar Speaks Pidgin, Yoruba, Igbo & Hausa 🇳🇬",
  "100% Free HeyGen Alternative — Full Tutorial",
  "AI Avatar Setup in 5 Minutes — Cloudflare Workers",
  "Viral AI Video Workflow — From Script to Publish",
  "Edge AI: Running Avatars on Cloudflare Workers",
  "Monetize AI Avatars — Make Money with ALPHATEKX",
];

export function getMockChannelVideos(count = 41) {
  const videos = [];
  for (let i = 0; i < count; i++) {
    const idx = i % MOCK_TITLES.length;
    const thumbIdx = i % MOCK_THUMBS.length;
    const isFeatured = i === 0;
    const youtubeId = isFeatured ? "jvXEkm27XOE" : `mock${String(i+1).padStart(2,"0")}_${CHANNEL_ID.slice(-4)}_${Math.floor(Math.random()*9000)}`;
    const title = isFeatured ? MOCK_TITLES[0] : `${MOCK_TITLES[idx]} — Part ${Math.floor(i / MOCK_TITLES.length) + 1} • Ep ${i+1}`;
    const thumb = isFeatured ? `https://img.youtube.com/vi/jvXEkm27XOE/hqdefault.jpg` : MOCK_THUMBS[thumbIdx];
    videos.push({
      source: "youtube",
      platform: "youtube",
      id: youtubeId,
      youtubeId,
      platformId: youtubeId,
      title,
      thumbnail: thumb,
      thumbnailUrl: thumb,
      channel: { name: CHANNEL_NAME, id: CHANNEL_ID },
      channelName: CHANNEL_NAME,
      channelId: CHANNEL_ID,
      handle: CHANNEL_HANDLE,
      views: `${(Math.floor(Math.random()*80)+5)}K views`,
      duration: `${Math.floor(Math.random()*10)+1}:${String(Math.floor(Math.random()*60)).padStart(2,"0")}`,
      category: "Tech",
      publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
    });
  }
  return videos;
}

export async function fetchChannelInfo(apiKey) {
  if (!apiKey) return getMockChannelInfo();
  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&id=${CHANNEL_ID}&key=${apiKey}`);
    if (!res.ok) throw new Error(`YouTube channels ${res.status}`);
    const data = await res.json();
    if (data.items && data.items[0]) return data.items[0];
    throw new Error("No channel item");
  } catch (e) { console.warn("[channel] fetchChannelInfo fallback to mock", e); return getMockChannelInfo(); }
}

export async function fetchChannelVideos(apiKey, maxResults = 50) {
  if (!apiKey) return getMockChannelVideos().slice(0, maxResults);
  try {
    const uploadsPlaylistId = "UU" + CHANNEL_ID.slice(2);
    const plRes = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=${Math.min(maxResults, 50)}&key=${apiKey}`);
    if (plRes.ok) {
      const plData = await plRes.json();
      const items = plData.items || [];
      if (items.length > 0) {
        const videoIds = items.map(it => it.contentDetails?.videoId || it.snippet?.resourceId?.videoId).filter(Boolean).join(",");
        let detailsMap = {};
        try {
          const detRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${apiKey}`);
          if (detRes.ok) {
            const detData = await detRes.json();
            for (const v of detData.items || []) detailsMap[v.id] = v;
          }
        } catch {}
        return items.map(it => {
          const vid = it.contentDetails?.videoId || it.snippet?.resourceId?.videoId;
          const det = detailsMap[vid];
          const snippet = det?.snippet || it.snippet;
          return {
            source: "youtube",
            platform: "youtube",
            id: vid,
            youtubeId: vid,
            platformId: vid,
            title: snippet?.title || it.snippet?.title || "ALPHATEKX Video",
            thumbnail: snippet?.thumbnails?.high?.url || snippet?.thumbnails?.medium?.url || `https://img.youtube.com/vi/${vid}/hqdefault.jpg`,
            thumbnailUrl: snippet?.thumbnails?.high?.url || snippet?.thumbnails?.medium?.url || `https://img.youtube.com/vi/${vid}/hqdefault.jpg`,
            channel: { name: CHANNEL_NAME, id: CHANNEL_ID },
            channelName: CHANNEL_NAME,
            channelId: CHANNEL_ID,
            handle: CHANNEL_HANDLE,
            views: det?.statistics?.viewCount ? `${(Number(det.statistics.viewCount)/1000).toFixed(0)}K views` : "10K views",
            duration: det?.contentDetails?.duration ? det.contentDetails.duration.replace("PT","").toLowerCase() : "5:00",
            category: "Tech",
            publishedAt: snippet?.publishedAt,
          };
        });
      }
    }
    throw new Error("playlistItems empty");
  } catch (e) { console.warn("[channel] playlistItems failed, trying search", e); }
  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=${Math.min(maxResults, 50)}&type=video&order=date&key=${apiKey}`);
    if (!res.ok) throw new Error(`YouTube search ${res.status}`);
    const data = await res.json();
    const items = data.items || [];
    if (items.length === 0) throw new Error("No items");
    const ids = items.map(it => it.id.videoId).join(",");
    let detailsMap = {};
    try {
      const detRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics,snippet&id=${ids}&key=${apiKey}`);
      if (detRes.ok) {
        const detData = await detRes.json();
        for (const v of detData.items || []) detailsMap[v.id] = v;
      }
    } catch {}
    return items.map(it => {
      const vid = it.id.videoId;
      const det = detailsMap[vid];
      return {
        source: "youtube",
        platform: "youtube",
        id: vid,
        youtubeId: vid,
        platformId: vid,
        title: it.snippet?.title || det?.snippet?.title || "ALPHATEKX Video",
        thumbnail: it.snippet?.thumbnails?.high?.url || `https://img.youtube.com/vi/${vid}/hqdefault.jpg`,
        thumbnailUrl: it.snippet?.thumbnails?.high?.url || `https://img.youtube.com/vi/${vid}/hqdefault.jpg`,
        channel: { name: CHANNEL_NAME, id: CHANNEL_ID },
        channelName: CHANNEL_NAME,
        channelId: CHANNEL_ID,
        handle: CHANNEL_HANDLE,
        views: det?.statistics?.viewCount ? `${(Number(det.statistics.viewCount)/1000).toFixed(0)}K views` : "10K views",
        duration: det?.contentDetails?.duration ? det.contentDetails.duration.replace("PT","").toLowerCase() : "5:00",
        category: "Tech",
        publishedAt: it.snippet?.publishedAt,
      };
    });
  } catch (e) { console.warn("[channel] fetchChannelVideos fallback to varied mock", e); return getMockChannelVideos().slice(0, maxResults); }
}
