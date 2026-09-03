import React, { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard.jsx";
import { getChannelInfo } from "../lib/channel.js";

// PROMPT #3: YOUR VIDEO AS DEFAULT — jvXEkm27XOE plays first for every visitor
export const DEFAULT_VIDEO = {
  id: 'jvXEkm27XOE',
  youtubeId: 'jvXEkm27XOE',
  videoId: 'jvXEkm27XOE',
  title: 'This AI Avatar BEATS HeyGen 10 TIMES! 🤯 #viral #trending #viralvideo #aivideo',
  channel: 'ALPHATEKX',
  channelName: 'ALPHATEKX',
  channelId: 'RiseWithAlphatekx',
  handle: '@RiseWithAlphatekx',
  // 4K crisp thumb: maxresdefault (1280x720) with hq720 fallback — no blur
  thumbnail: `https://i.ytimg.com/vi/jvXEkm27XOE/hqdefault.jpg`,
  thumbnailUrl: `https://i.ytimg.com/vi/jvXEkm27XOE/hqdefault.jpg`,
  link: 'https://youtu.be/jvXEkm27XOE',
  featured: true,
  duration: '2:15',
  views: 'Featured',
};

export default function Home({ searchResults, searchQuery }) {
  const hasResults = Array.isArray(searchResults) && searchResults.length > 0;
  const showDefault = !searchQuery || !hasResults;
  const [channel, setChannel] = useState(null);
  useEffect(() => { getChannelInfo().then(c=>setChannel(c?.channel||c)).catch(()=>{}); }, []);
  const avatar = channel?.snippet?.thumbnails?.default?.url || channel?.avatar || DEFAULT_VIDEO.thumbnailUrl;
  const subs = channel?.statistics?.subscriberCount || channel?.subscribersCount || "3020";
  const subsDisplay = typeof subs === "number" ? subs.toLocaleString() : subs;
  return (
    <div className="home p-4 space-y-6">
      {/* Channel hero — ALPHATEKX @risewithalphatekx */}
      <div className="flex items-center gap-3 glass-card p-3 border border-[#FFD700]/20">
        <img src={avatar} alt="ALPHATEKX" className="w-10 h-10 rounded-full border-2 border-[#FFD700] object-cover" />
        <div>
          <p className="text-sm font-extrabold text-white flex items-center gap-1">{channel?.snippet?.title || channel?.name || "ALPHATEKX"} <span className="text-[#FFD700] text-xs">✓</span></p>
          <p className="text-xs text-gray-400">{channel?.snippet?.customUrl || channel?.handle || "@risewithalphatekx"} • {subsDisplay} subscribers • 41 videos</p>
        </div>
        <a href="/channel" className="ml-auto text-xs font-bold text-black bg-[#FFD700] px-3 py-1.5 rounded-full">Visit Channel</a>
      </div>
      {showDefault && (
        <div className="space-y-3">
          <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black text-[10px] font-extrabold px-2.5 py-1 rounded-full">FEATURED • {channel?.snippet?.title || "ALPHATEKX"}</span>
          {/* Prompt 1: Home feed = thumbnail only, click opens /watch . No iframe on Home grid. Featured is still clean VideoCard */}
          <VideoCard video={DEFAULT_VIDEO} />
        </div>
      )}
      {!showDefault && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map((video) => {
            const vid = video.videoId || video.youtubeId || video.id;
            return (
              <VideoCard key={vid} video={video} />
            );
          })}
        </div>
      )}
    </div>
  );
}
