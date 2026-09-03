import React from "react";

// CLEAN LIKE YOUTUBE HOME — Prompt 1
// No iframe, no play icon, no YouTube logo, no title on thumbnail
// Thumbnail always from videoId: https://i.ytimg.com/vi/${videoId}/hqdefault.jpg
// key must be videoId, never index. Click navigates to /watch?v=videoId

export default function VideoCard({ video }) {
  const videoId = video?.videoId || video?.youtubeId || video?.id || "";
  const thumb = video?.thumbnail || video?.thumbnailUrl || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  // enforce videoId-based thumb — never from separate array
  const thumbUrl = thumb && thumb.includes("i.ytimg.com/vi/") ? thumb : `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const title = video?.title || "Untitled";
  const channel = video?.channelName || video?.channel?.name || video?.channel || "";
  const views = video?.viewsFormatted || video?.views || "";
  const duration = video?.duration || "";

  const handleClick = () => {
    window.location.href = `/watch?v=${videoId}`;
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer w-full group"
    >
      {/* Thumbnail - clean, no icons, no player, no title on it */}
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
        <img
          src={thumbUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:opacity-95 transition"
          loading="lazy"
          onError={(e)=>{ e.currentTarget.src=`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`; }}
        />
        {/* Only duration bottom right, like YouTube */}
        {duration && (
          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[11px] px-1 py-0.5 rounded font-medium">
            {duration}
          </span>
        )}
      </div>
      {/* Title + channel BELOW thumbnail, not on thumbnail */}
      <div className="pt-2 px-1">
        <h3 className="text-white text-[13px] font-medium leading-5 line-clamp-2 group-hover:text-[#FFD700] transition-colors">
          {title}
        </h3>
        <p className="text-zinc-400 text-xs mt-1 truncate">
          {channel}{views ? ` • ${views}` : ""}
        </p>
      </div>
    </div>
  );
}
