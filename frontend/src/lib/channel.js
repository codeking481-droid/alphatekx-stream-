// frontend/src/lib/channel.js — Real YouTube Channel Connection for ALPHATEKX
// Spec: Fetch your channel data from the YouTube API
const CHANNEL_ID = 'UCGm89Z31SYxEU9PEQ-p3cNA';
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || import.meta?.env?.VITE_YOUTUBE_API_KEY || "";

export async function getChannelInfo() {
  // Try backend proxy first (avoids exposing key), fallback to direct YouTube API
  try {
    const r = await fetch(`/api/channel`);
    if (r.ok) {
      const j = await r.json();
      if (j.channel) return j.channel;
      if (j.items) return j.items[0];
      return j;
    }
  } catch {}
  if (!YOUTUBE_API_KEY) {
    // mock fallback — matches backend mock
    return {
      id: CHANNEL_ID,
      snippet: {
        title: "ALPHATEKX",
        description: "Official ALPHATEKX channel — AI avatars, HeyGen alternatives, Naija tech 🇳🇬 | alphatekx.name.ng | alphatekxcompany@gmail.com",
        thumbnails: { default: { url: "https://img.youtube.com/vi/jvXEkm27XOE/hqdefault.jpg" }, high: { url: "https://img.youtube.com/vi/jvXEkm27XOE/hqdefault.jpg" } },
        customUrl: "@risewithalphatekx",
      },
      statistics: { subscriberCount: "3020", videoCount: "41", viewCount: "150000" },
    };
  }
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
  );
  const data = await response.json();
  return data.items[0];
}

export async function getChannelVideos() {
  // Try backend
  try {
    const r = await fetch(`/api/channel/videos`);
    if (r.ok) {
      const j = await r.json();
      if (j.videos) return j.videos;
      if (j.items) return j.items;
      return j;
    }
  } catch {}
  if (!YOUTUBE_API_KEY) {
    // mock 41 videos fallback will be handled by backend; return empty here to trigger backend mock
    return [];
  }
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=50&type=video&key=${YOUTUBE_API_KEY}`
  );
  const data = await response.json();
  return data.items;
}

export { CHANNEL_ID };
