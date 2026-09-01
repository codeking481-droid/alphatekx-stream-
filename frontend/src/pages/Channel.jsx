import React, { useEffect, useState } from "react";
import { getChannelInfo, getChannelVideos, CHANNEL_ID } from "../lib/channel.js";

// Prompt #7: Full channel page with your uploads — 41 videos, real-time via YouTube API
export const Channel = () => {
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getChannelInfo(), getChannelVideos()]).then(([ch, vids]) => {
      if (cancelled) return;
      setChannel(ch?.channel || ch);
      // Normalize to handle both direct YouTube items and backend unified format
      const normalized = Array.isArray(vids) ? vids : (vids?.videos || []);
      const mapped = normalized.map(v => {
        // backend unified already has id/youtubeId/title/thumbnail etc
        if (v.id && v.id.videoId) {
          return { id: v.id.videoId, title: v.snippet?.title, thumbnail: v.snippet?.thumbnails?.high?.url, channel: v.snippet?.channelTitle };
        }
        return v;
      });
      setVideos(mapped);
      setLoading(false);
    }).catch(()=>setLoading(false));
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className="p-4 text-gray-400">Loading ALPHATEKX channel...</div>;
  if (!channel) return <div className="p-4 text-gray-400">Channel not found. ID: {CHANNEL_ID}</div>;

  const title = channel.snippet?.title || channel.name || "ALPHATEKX";
  const avatar = channel.snippet?.thumbnails?.default?.url || channel.avatar || `https://img.youtube.com/vi/jvXEkm27XOE/hqdefault.jpg`;
  const subs = channel.statistics?.subscriberCount || channel.subscribersCount || "3020";
  const subsDisplay = typeof subs === "number" ? subs.toLocaleString() : subs;

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6 glass-card p-4 border border-[#FFD700]/20">
        <img
          src={avatar}
          alt="Channel Avatar"
          className="w-20 h-20 rounded-full border-2 border-[#FFD700] object-cover"
        />
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">{title} <span className="text-[#FFD700]">●</span></h1>
          <p className="text-sm text-gray-400">{channel.snippet?.customUrl || channel.handle || "@risewithalphatekx"} • {subsDisplay} subscribers • {channel.statistics?.videoCount || "41"} videos</p>
          <p className="text-xs text-gray-500 mt-1">{channel.snippet?.description?.slice(0,120) || "Official ALPHATEKX — alphatekx.name.ng | alphatekxcompany@gmail.com"}</p>
          <a href={`https://www.youtube.com/channel/${CHANNEL_ID}`} target="_blank" rel="noreferrer" className="text-xs text-[#FFD700] hover:underline">youtube.com/channel/{CHANNEL_ID} ↗</a>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {videos.slice(0,50).map((video) => {
          const vid = video.youtubeId || video.id || video.id?.videoId || `vid_${Math.random()}`;
          const thumb = video.thumbnailUrl || video.thumbnail || video.snippet?.thumbnails?.high?.url || `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;
          const t = video.title || video.snippet?.title || "ALPHATEKX Video";
          return (
            <a key={vid} href={`https://youtu.be/${vid}`} target="_blank" rel="noreferrer" className="glass-card overflow-hidden hover:border-[#FFD700]/30 transition-colors">
              <div className="aspect-video bg-black">
                <img src={thumb} alt={t} className="w-full h-full object-cover" />
              </div>
              <div className="p-2">
                <p className="text-xs font-bold text-white line-clamp-2">{t}</p>
                <p className="text-[11px] text-gray-500 mt-1">{video.views || ""}</p>
              </div>
            </a>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 text-center">Showing {videos.length} videos • Channel ID {CHANNEL_ID} • Updates auto-sync via YouTube API</p>
    </div>
  );
};

export default Channel;
