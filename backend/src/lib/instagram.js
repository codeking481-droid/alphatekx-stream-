// backend/src/lib/instagram.js — Instagram Graph API + mock fallback
function toUnified(v){ return { source:"instagram", platform:"instagram", id:v.platformId||v.youtubeId, youtubeId:v.youtubeId||v.platformId, platformId:v.platformId||v.youtubeId, title:v.title, thumbnail:v.thumbnailUrl, thumbnailUrl:v.thumbnailUrl, channel:{ name:v.channelName, id:v.handle||v.channelName }, channelName:v.channelName, channelId:v.handle||v.channelName, handle:v.handle, views:v.viewsRaw??v.views, viewsFormatted:v.views, duration:v.duration, category:v.category||"Tech", platformMeta:{ label:"Instagram", badge:"IG", color:"#E1306C", bg:"rgba(225,48,108,0.9)" } }; }
export function getMockInstagramCatalog(){ return [
  { platform:"instagram", youtubeId:"ig_001", platformId:"IG001", title:"Reel: Pyramid of Giza but make it shaders ✨", channelName:"@shaders Daily", handle:"@shaders_daily", thumbnailUrl:"https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?auto=format&fit=crop&w=600&q=80", views:"420K views", viewsRaw:420000, duration:"0:22", category:"Tech" },
  { platform:"instagram", youtubeId:"ig_002", platformId:"IG002", title:"Lagos traffic but AI traffic lights 🚦🇳🇬", channelName:"@lagos.tech", handle:"@lagos_tech", thumbnailUrl:"https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80", views:"310K views", viewsRaw:310000, duration:"0:18", category:"Education" },
  { platform:"instagram", youtubeId:"ig_003", platformId:"IG003", title:"Behind the scenes: Studio setup for AI voices", channelName:"@studio.reels", handle:"@studio_reels", thumbnailUrl:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80", views:"198K views", viewsRaw:198000, duration:"0:28", category:"Tech" },
  { platform:"instagram", youtubeId:"ig_004", platformId:"IG004", title:"Naija fashion Reel — Ankara → AI generated patterns", channelName:"@naija_style", handle:"@naija_style", thumbnailUrl:"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80", views:"275K views", viewsRaw:275000, duration:"0:24", category:"Music" },
];}
export async function searchInstagram(query, accessToken){
  const catalog=getMockInstagramCatalog(); const qLower=(query||"").toLowerCase(); const filter=(arr)=>arr.filter(v=>!query||v.title.toLowerCase().includes(qLower)||v.channelName.toLowerCase().includes(qLower)||v.category.toLowerCase().includes(qLower));
  if(!accessToken) return { videos: filter(catalog).map(toUnified), isMock:true };
  try{
    const res=await fetch(`https://graph.facebook.com/v18.0/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=12&access_token=${accessToken}`);
    if(!res.ok) throw new Error(`Instagram Graph ${res.status}`); const data=await res.json(); const items=data.data||[]; if(!Array.isArray(items)||items.length===0) throw new Error("empty instagram media");
    let filtered=items; if(query) filtered=items.filter(it=>(it.caption||"").toLowerCase().includes(qLower)); if(filtered.length===0) filtered=items;
    const videos=filtered.slice(0,12).map(it=>toUnified({ platformId:it.id, youtubeId:it.id, title:it.caption?it.caption.slice(0,80):"Instagram Reel", channelName:"@instagram_creator", handle:"@instagram_creator", thumbnailUrl:it.thumbnail_url||it.media_url||`https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?auto=format&fit=crop&w=600&q=80`, views:"100K views", viewsRaw:100000, duration:"0:22", category:"Tech"}));
    return { videos, isMock:false };
  }catch(e){ console.warn("[instagram] real fetch failed, falling back to mock:", e?.message||e); return { videos: filter(catalog).map(toUnified), isMock:true, error:e.message }; }
}
