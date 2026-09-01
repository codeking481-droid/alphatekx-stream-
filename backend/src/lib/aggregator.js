// backend/src/lib/aggregator.js — Unified aggregator
export const platformMeta = {
  youtube: { label: "YouTube", badge: "YT", color: "#FF0000", bg: "rgba(255,0,0,0.9)" },
  tiktok: { label: "TikTok", badge: "TT", color: "#FFFFFF", bg: "rgba(0,0,0,0.9)" },
  instagram: { label: "Instagram", badge: "IG", color: "#E1306C", bg: "rgba(225,48,108,0.9)" },
  twitter: { label: "Twitter", badge: "X", color: "#1DA1F2", bg: "rgba(29,161,242,0.9)" },
  facebook: { label: "Facebook", badge: "FB", color: "#1877F2", bg: "rgba(24,119,242,0.9)" },
};
export function getMockFacebookCatalog(){
  return [
    { platform:"facebook", youtubeId:"fb_001", platformId:"FB001", title:"Facebook Watch: Village village build log — episode 4", channelName:"Naija Builders FB", handle:"fb.com/naija.builders", thumbnailUrl:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80", views:"512K views", viewsRaw:512000, duration:"8:44", category:"Education" },
    { platform:"facebook", youtubeId:"fb_002", platformId:"FB002", title:"Live: AI marketplace seller Q&A — make ₦ with models", channelName:"Alphatekx FB Live", handle:"fb.com/alphatekx", thumbnailUrl:"https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=600&q=80", views:"98K views", viewsRaw:98000, duration:"12:30", category:"Tech" },
    { platform:"facebook", youtubeId:"fb_003", platformId:"FB003", title:"Watch: Afropop + generative visuals (full set)", channelName:"AfroViz", handle:"fb.com/afroviz", thumbnailUrl:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80", views:"670K views", viewsRaw:670000, duration:"4:12", category:"Music" },
  ].map(v=>({ source:"facebook", platform:"facebook", id:v.platformId, youtubeId:v.youtubeId, platformId:v.platformId, title:v.title, thumbnail:v.thumbnailUrl, thumbnailUrl:v.thumbnailUrl, channel:{ name:v.channelName, id:v.handle }, channelName:v.channelName, channelId:v.handle, handle:v.handle, views:v.viewsRaw??v.views, viewsFormatted:v.views, duration:v.duration, category:v.category, platformMeta: platformMeta.facebook }));
}
export function aggregateResults(query, sources){
  const qLower=(query||"").toLowerCase();
  const youtube=sources.youtube||[];
  const othersFlat=[...(sources.tiktok||[]), ...(sources.instagram||[]), ...(sources.twitter||[]), ...(sources.facebook||[])];
  const filteredOthers=othersFlat.filter(v=>!query||(v.title||"").toLowerCase().includes(qLower)||(v.channelName||"").toLowerCase().includes(qLower)||(v.category||"").toLowerCase().includes(qLower));
  youtube.forEach(v=>{ v.platformMeta=v.platformMeta||platformMeta.youtube; v.source=v.source||"youtube"; });
  filteredOthers.forEach(v=>{ v.platformMeta=v.platformMeta||platformMeta[v.platform]||platformMeta.youtube; });
  const combined=[...youtube]; for(let i=0;i<filteredOthers.length;i++){ const pos=Math.min(combined.length,1+i*2); combined.splice(pos,0,filteredOthers[i]); } return combined;
}
export async function searchAllPlatforms(query, env, deps){
  const [yt, tt, ig, tw] = await Promise.all([
    deps.youtube(query, env.YOUTUBE_API_KEY),
    deps.tiktok(query, env.TIKHUB_API_KEY || env.TIKTOK_API_KEY),
    deps.instagram(query, env.INSTAGRAM_ACCESS_TOKEN),
    deps.twitter(query, env.TWITTER_BEARER_TOKEN),
  ]);
  const fb={ videos:getMockFacebookCatalog().filter(v=>!query||v.title.toLowerCase().includes(query.toLowerCase())||v.channelName.toLowerCase().includes(query.toLowerCase())), isMock:true };
  const sources={ youtube:yt.videos, tiktok:tt.videos, instagram:ig.videos, twitter:tw.videos, facebook:fb.videos };
  const combined=aggregateResults(query, sources);
  return { videos:combined, unified:true, isMock: yt.isMock && tt.isMock && ig.isMock && tw.isMock, meta:{ youtube:{ count:yt.videos.length, isMock:yt.isMock }, tiktok:{ count:tt.videos.length, isMock:tt.isMock }, instagram:{ count:ig.videos.length, isMock:ig.isMock }, twitter:{ count:tw.videos.length, isMock:tw.isMock }, facebook:{ count:fb.videos.length, isMock:true } }, errors:{ youtube:yt.error, tiktok:tt.error, instagram:ig.error, twitter:tw.error } };
}
