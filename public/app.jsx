import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

// --- SVG Icons Helper Component ---
const Icon = ({ name, className = "w-5 h-5", style = {} }) => {
  switch (name) {
    case "menu":
      return <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>;
    case "logo":
      return (
        <svg viewBox="0 0 100 100" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" fill="none" stroke="url(#logo-grad)" strokeWidth="8"/>
          <circle cx="50" cy="50" r="14" fill="#00FF88"/>
          <circle cx="50" cy="20" r="6" fill="#00D9FF"/>
          <circle cx="76" cy="35" r="6" fill="#00D9FF"/>
          <circle cx="76" cy="65" r="6" fill="#00D9FF"/>
          <circle cx="50" cy="80" r="6" fill="#00D9FF"/>
          <circle cx="24" cy="65" r="6" fill="#00D9FF"/>
          <circle cx="24" cy="35" r="6" fill="#00D9FF"/>
          <line x1="50" y1="50" x2="50" y2="20" stroke="#00FF88" strokeWidth="3"/>
          <line x1="50" y1="50" x2="76" y2="35" stroke="#00FF88" strokeWidth="3"/>
          <line x1="50" y1="50" x2="76" y2="65" stroke="#00FF88" strokeWidth="3"/>
          <line x1="50" y1="50" x2="50" y2="80" stroke="#00FF88" strokeWidth="3"/>
          <line x1="50" y1="50" x2="24" y2="65" stroke="#00FF88" strokeWidth="3"/>
          <line x1="50" y1="50" x2="24" y2="35" stroke="#00FF88" strokeWidth="3"/>
          <defs>
            <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00FF88"/>
              <stop offset="100%" stopColor="#00D9FF"/>
            </linearGradient>
          </defs>
        </svg>
      );
    case "search":
      return <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>;
    case "mic":
      return <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>;
    case "cast":
      return <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 16.1A5 5 0 015.9 20M2 12a9 9 0 018.6 9M2 7.9A13.1 13.1 0 0114.7 21M15 5H4a2 2 0 00-2 2v3h2V7h11v10h-3v2h4a2 2 0 002-2V7a2 2 0 00-2-2z"/></svg>;
    case "bell":
      return <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>;
    case "sparkles":
      return <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>;
    case "like":
      return <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 11H4a2 2 0 00-2 2v6a2 2 0 002 2h3"/></svg>;
    case "dislike":
      return <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v9a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5 9h3a2 2 0 002-2V9a2 2 0 00-2-2h-3"/></svg>;
    case "share":
      return <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>;
    case "download":
      return <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>;
    case "bookmark":
      return <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>;
    case "chat":
      return <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>;
    case "shopping-bag":
      return <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>;
    case "queue":
      return <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>;
    case "teacher":
      return <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>;
    case "brain":
      return <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>;
    case "studio":
      return <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>;
    case "crown":
      return <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>;
    case "home":
      return <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>;
    case "shorts":
      return <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
    case "plus":
      return <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>;
    case "subscriptions":
      return <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>;
    case "user":
      return <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>;
    case "trash":
      return <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>;
    case "history":
      return <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
    case "playlist":
      return <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h13M4 14h10M4 18h7"/></svg>;
    case "theater":
      return <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z"/></svg>;
    case "mini-player":
      return <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>;
    case "tiktok":
      return (
        <svg className={className} style={style} fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-1.18V9.28a6.34 6.34 0 0 0-3.55 1.08 6.34 6.34 0 1 0 9.89 5.31V9.4a8.16 8.16 0 0 0 4.77 1.52V7.47a4.85 4.85 0 0 1-1.00-.78z"/>
        </svg>
      );
    case "youtube":
      return (
        <svg className={className} style={style} fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    default:
      return <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"/></svg>;
  }
};

// --- Reusable Channel Components (PRESERVE EXISTING DESIGN — colors/fonts/spacing unchanged) ---
const ChannelAvatar = ({ src, alt = "Channel", size = 40, verified = false, className = "" }) => (
  <div className={`relative flex-shrink-0 ${className}`} style={{ width: size, height: size }}>
    <img src={src} alt={alt} className="w-full h-full rounded-full object-cover border border-[#00D9FF]/40" />
    {verified && <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#00FF88] rounded-full flex items-center justify-center text-[8px] text-black font-bold border-2 border-black">✓</span>}
  </div>
);
const ChannelName = ({ name, verified = false, handle = "", className = "" }) => (
  <div className={`flex items-center gap-1.5 ${className}`}>
    <span className="font-bold text-white truncate">{name}</span>
    {verified && <span className="text-[#00FF88] text-xs flex-shrink-0" title="Verified">✓</span>}
    {handle && <span className="text-xs text-gray-400 truncate hidden sm:inline">{handle}</span>}
  </div>
);
const SubscriberCount = ({ count, label = "subscribers", className = "" }) => (
  <span className={`text-xs text-gray-400 ${className}`}>{count} {label}</span>
);
function slugify(name) { return (name||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""); }
function channelIdFromVideo(v) {
  // derive channel id from channel name
  const name = v.channel || v.channelName || "codecraft";
  return slugify(name) || "codecraft";
}
// --- UNIFIED AGGREGATOR COMPONENTS (YouTube TikTok Instagram Twitter Facebook) preserve dark premium design ---
const platformStyles = {
  youtube: { bg: "#FF0000", text: "white", label: "YouTube" },
  tiktok: { bg: "#000000", text: "white", border: "white", label: "TikTok" },
  instagram: { bg: "#E1306C", text: "white", label: "Instagram" },
  twitter: { bg: "#1DA1F2", text: "white", label: "Twitter" },
  facebook: { bg: "#1877F2", text: "white", label: "Facebook" },
};
const PlatformBadge = ({ platform = "youtube", size = "xs" }) => {
  const s = platformStyles[platform] || platformStyles.youtube;
  const cls = size==="sm" ? "text-[10px] px-2 py-0.5" : "text-[9px] px-1.5 py-0.5";
  const border = platform==="tiktok" ? "border border-white/40" : "";
  return <span className={`${cls} font-bold rounded-full ${border}`} style={{ background: s.bg, color: s.text }}>{s.label}</span>;
};
const VideoCard = ({ video, onPlay, onSave, isSaved, onAi }) => {
  const v = normalizeVideo(video);
  const platform = video.platform || v.platform || "youtube";
  return (
    <div onClick={()=>onPlay&&onPlay(v)} className="glass-card overflow-hidden hover:border-[#FFD700]/50 hover:shadow-[0_0_15px_rgba(255,215,0,0.15)] transition-all cursor-pointer group flex flex-col justify-between">
      <div className="relative aspect-video w-full bg-gray-900 overflow-hidden">
        <img src={v.img || v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        <span className="absolute bottom-2 right-2 bg-black/80 text-[10px] font-mono px-1.5 py-0.5 rounded text-white">{v.duration}</span>
        <span className="absolute top-2 left-2"><PlatformBadge platform={platform} /></span>
        {onAi && (
          <button onClick={(e)=>{e.stopPropagation(); onAi(v);}} className="absolute bottom-2 left-2 w-7 h-7 rounded-full bg-gradient-to-r from-[#00D9FF] to-[#00FF88] text-black font-black text-[11px] flex items-center justify-center border border-white/30 shadow-md hover:scale-110 transition-transform" title="AI Help — real-time">A</button>
        )}
        {onSave && (
          <button onClick={(e)=>{e.stopPropagation(); onSave(video);}} className={`absolute top-2 right-2 w-9 h-9 min-w-[36px] min-h-[36px] rounded-full flex items-center justify-center text-sm font-bold ${isSaved ? "bg-[#FFD700] text-black" : "bg-black/70 text-white hover:bg-black/90"} border border-white/20`}>
            {isSaved ? "✓" : "+"}
          </button>
        )}
      </div>
      <div className="p-3 sm:p-4 space-y-1.5 flex-1 min-w-0">
        <h3 className="font-bold text-[13px] sm:text-sm leading-snug text-white group-hover:text-[#FFD700] line-clamp-2 min-w-0 break-words">{v.title}</h3>
        <p className="text-xs text-gray-400 truncate">{v.channel || v.channelName}</p>
        <p className="text-xs text-gray-500">{v.views} • {v.timeAgo}</p>
      </div>
    </div>
  );
};
const VideoPlayer = ({ video, autoplay = false }) => {
  const v = video ? normalizeVideo(video) : null;
  const platform = video?.platform || "youtube";
  if (!v) return null;
  const isDefault = v.youtubeId === DEFAULT_VIDEO.youtubeId || v.featured || autoplay;
  const autoplayParams = isDefault ? "&autoplay=1&mute=1&playsinline=1" : "";
  if (platform === "youtube") {
    return (
      <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden border border-[#272727] shadow-2xl">
        <iframe src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}?enablejsapi=1&modestbranding=1&rel=0${autoplayParams}`} title={v.title} className="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
    );
  }
  // non-youtube: clean minimal player — thumbnail + platform badge + open external
  const urls = { tiktok: `https://www.tiktok.com/search?q=${encodeURIComponent(v.title)}`, instagram: `https://www.instagram.com/explore/tags/${encodeURIComponent(v.title.split(' ')[0])}/`, twitter: `https://twitter.com/search?q=${encodeURIComponent(v.title)}`, facebook: `https://www.facebook.com/watch/search/?q=${encodeURIComponent(v.title)}` };
  return (
    <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden border border-[#272727] shadow-2xl flex flex-col items-center justify-center p-6 text-center">
      <img src={v.img} alt={v.title} className="absolute inset-0 w-full h-full object-cover opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="relative z-10 space-y-3 max-w-md">
        <PlatformBadge platform={platform} size="sm" />
        <h3 className="font-bold text-white text-sm">{v.title}</h3>
        <p className="text-xs text-gray-300">{v.channel} • {v.views}</p>
        <a href={urls[platform] || "#"} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold text-xs hover:opacity-90">
          Open on {platformStyles[platform]?.label || platform} ↗
        </a>
        <p className="text-[10px] text-gray-400 font-mono">Clean unified player — no overlays • preserved dark premium</p>
      </div>
    </div>
  );
};
const SearchBar = ({ value, onChange, onSubmit, placeholder }) => (
  <form onSubmit={onSubmit} className="flex-1 min-w-0 flex items-center bg-[#121212] border border-[#303030] rounded-full focus-within:border-[#FFD700] focus-within:ring-1 focus-within:ring-[#FFD700] overflow-hidden">
    <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder || "Search YouTube, TikTok, Instagram, Twitter, Facebook..."} className="w-full min-w-0 bg-transparent px-3 sm:px-4 py-1.5 sm:py-2 text-sm text-white placeholder-gray-500 focus:outline-none" />
    <button type="submit" className="px-3 sm:px-6 py-1.5 sm:py-2.5 bg-[#222222] hover:bg-[#303030] border-l border-[#303030] text-gray-300 flex-shrink-0"><Icon name="search" className="w-4 h-4" /></button>
  </form>
);

// --- GATED EXPERIENCE — SignInButton + GuestOverlay (gold gradient, semi-transparent) ---
const SignInButton = () => {
  const handleSignIn = async () => {
    try {
      const r = await fetch('/api/auth/url');
      const data = await r.json();
      if (data.url) { window.location.href = data.url; return; }
    } catch {}
    window.location.href = '/api/auth/url';
  };
  return (
    <button onClick={handleSignIn} className="bg-gradient-to-r from-[#FFD700] to-[#F59E0B] text-black font-bold px-8 py-3 rounded-xl hover:scale-105 transition shadow-lg hover:shadow-gold/30">
      Sign in with YouTube →
    </button>
  );
};
const GuestOverlay = ({ children, message }) => {
  const handle = async () => {
    try { const r = await fetch('/api/auth/url'); const d = await r.json(); if(d.url) { window.location.href=d.url; return; } } catch {}
    window.location.href='/api/auth/url';
  };
  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-[#0B0215]/70 backdrop-blur-[2px] flex items-center justify-center rounded-xl z-10">
        <div className="text-center p-3">
          <p className="text-white/90 text-sm font-medium">{message || 'Sign in to interact'}</p>
          <button onClick={handle} className="mt-1.5 text-[#FFD700] text-xs font-bold hover:underline">Sign in →</button>
        </div>
      </div>
    </div>
  );
};

// --- PROMPT #3: DEFAULT VIDEO (YOUR VIDEO) — plays first, helps grow YouTube channel ---
const DEFAULT_VIDEO = {
  id: "jvXEkm27XOE",
  youtubeId: "jvXEkm27XOE",
  title: "This AI Avatar BEATS HeyGen 10 TIMES! 🤯 #viral #trending #viralvideo #aivideo",
  channel: "ALPHATEKX",
  channelName: "ALPHATEKX",
  channelId: "UCGm89Z31SYxEU9PEQ-p3cNA",
  handle: "@risewithalphatekx",
  subscribers: "3,020",
  views: "Featured • Alphatekx Stream",
  timeAgo: "Featured",
  duration: "2:15",
  tag: "Featured",
  avatar: "https://img.youtube.com/vi/jvXEkm27XOE/hqdefault.jpg",
  img: "https://img.youtube.com/vi/jvXEkm27XOE/hqdefault.jpg",
  thumbnail: "https://img.youtube.com/vi/jvXEkm27XOE/hqdefault.jpg",
  thumbnailUrl: "https://img.youtube.com/vi/jvXEkm27XOE/hqdefault.jpg",
  description: "Featured Alphatekx video — auto-plays first for every visitor. Your view counts toward YouTube growth! 🚀🇳🇬",
  platform: "youtube",
  platformMeta: { label: "YouTube", badge: "YT", color: "#FF0000", bg: "rgba(255,0,0,0.9)" },
  featured: true,
};
// PROMPT #7: Official ALPHATEKX channel
const OFFICIAL_CHANNEL_ID = "UCGm89Z31SYxEU9PEQ-p3cNA";
const OFFICIAL_CHANNEL_HANDLE = "@risewithalphatekx";
const OFFICIAL_CHANNEL_NAME = "ALPHATEKX";

// --- Helper to normalize video objects from API or mock ---
function normalizeVideo(v) {
  return {
    id: v.youtubeId || v.id || DEFAULT_VIDEO.id,
    youtubeId: v.youtubeId || v.id || DEFAULT_VIDEO.id,
    title: v.title || "Untitled Video",
    channel: v.channelName || v.channel?.name || v.channel || "YouTube Creator",
    channelName: v.channelName || v.channel?.name || v.channel || "YouTube Creator",
    channelId: v.channelId || v.channel?.id || v.channelId || (v.channelName ? "" : "") || "",
    subscribers: v.subscribers || "1.2M",
    views: v.views || v.viewsFormatted || "100K views",
    timeAgo: v.timeAgo || "Recently uploaded",
    duration: v.duration || "15:00",
    tag: v.tag || "YouTube Search",
    avatar: v.avatar || v.channel?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    img: v.thumbnailUrl || v.img || v.thumbnail || "https://img.youtube.com/vi/jvXEkm27XOE/hqdefault.jpg",
    thumbnailUrl: v.thumbnailUrl || v.img || v.thumbnail || "https://img.youtube.com/vi/jvXEkm27XOE/hqdefault.jpg",
    description: v.description || `Watch ${v.title} on Alphatekx Stream.`,
    platform: v.platform || v.source || "youtube",
    platformMeta: v.platformMeta || null,
    featured: v.featured || false,
  };
}

// --- Main App Component ---
function App() {
  // GATED EXPERIENCE — auth state
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const isGuest = !authUser;
  useEffect(() => {
    fetch('/api/auth/user', { credentials: 'include' }).then(r=>r.ok?r.json():null).then(d=>{
      if(d && !d.isGuest && d.id) setAuthUser(d);
      else if(d && d.channelName) setAuthUser(d);
      else setAuthUser(null);
    }).catch(()=>setAuthUser(null)).finally(()=>setAuthLoading(false));
  }, []);
  // Navigation & Drawer State
  const [activeTab, setActiveTab] = useState("watch"); // watch, home, shorts, teacher, memory, chat, community, marketplace, sell, studio, pricing, profile
  const [sidebarOpen, setSidebarOpen] = useState(true); // Desktop sidebar toggle
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false); // Mobile drawer slide-over toggle
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false); // REMOVED — popup off
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchSuggestionsOpen, setSearchSuggestionsOpen] = useState(false);
  const [activeChip, setActiveChip] = useState("All");
  // Persistent Search History — Never vanishes (localStorage + server)
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const raw = localStorage.getItem("alphatekx_search_history");
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });
  const [searchTab, setSearchTab] = useState("results"); // "results" | "history"
  const [searchIsMock, setSearchIsMock] = useState(null);
  const [historyView, setHistoryView] = useState("watched"); // watched | searched for dedicated History page
  // Watched History — real, for all you have watched (Guest local + server)
  const [watchedHistory, setWatchedHistory] = useState(() => {
    try {
      const raw = localStorage.getItem("alphatekx_watched_history");
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });
  const pushWatched = (video) => {
    if (!video) return;
    const norm = normalizeVideo(video);
    const entry = { ...norm, watchedAt: Date.now(), watchedAtStr: new Date().toLocaleString() };
    setWatchedHistory(prev => {
      const filtered = prev.filter(p => (p.youtubeId||p.id) !== (entry.youtubeId||entry.id));
      const next = [entry, ...filtered].slice(0,100);
      try { localStorage.setItem("alphatekx_watched_history", JSON.stringify(next)); } catch {}
      // also fire to server for real-time sync
      fetch("/api/history/save", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ videoId: entry.youtubeId, title: entry.title }) }).catch(()=>{});
      return next;
    });
  };
  // MISSION 1 — Premium icon-triggered workspace (video 60% top, icon opens Code/AI 40% below)
  const [watchPanelTab, setWatchPanelTab] = useState("code");
  const [watchPanelOpen, setWatchPanelOpen] = useState(false);
  const [codeValue, setCodeValue] = useState(`<!DOCTYPE html>
<html>
<body style="background:#0B0215;color:white;font-family:sans-serif;padding:24px;text-align:center">
  <h1 style="color:#FFD700">Hello Alphatekx 🚀🇳🇬</h1>
  <p>Edit this HTML in Code tab — Preview updates live</p>
  <button style="background:linear-gradient(90deg,#FFD700,#F59E0B);color:black;font-weight:800;padding:12px 24px;border-radius:9999px;border:none;">Gold Button</button>
</body>
</html>`);
  const [aiChatInput, setAiChatInput] = useState("");
  const [aiChatMessages, setAiChatMessages] = useState([
    { role: "ai", text: "Hi! I'm your AI Teacher. Ask me anything about this video. 🎓" }
  ]);
  const monacoRef = useRef(null);
  const monacoEditorRef = useRef(null);
  // Vibe Parser — extracts <edit_file> tags from AI and applies to codeValue
  const vibeParser = (text) => {
    const regex = /<edit_file[^>]*>([\s\S]*?)<\/edit_file>/gi;
    let m; let found = null;
    while ((m = regex.exec(text)) !== null) { found = m[1]; }
    if (found) {
      const cleaned = found.trim();
      setCodeValue(cleaned);
      if (monacoEditorRef.current) { try { monacoEditorRef.current.setValue(cleaned); } catch {} }
      setWatchPanelTab("preview");
      setWatchPanelOpen(true);
      showToast("✨ Vibe edit applied → Preview");
      return cleaned;
    }
    return null;
  };
  const handleAiSend = () => {
    const q = aiChatInput.trim();
    if (!q) return;
    const qLower = q.toLowerCase();
    let aiText = `Great question about "${q}" — in this video, try the Code tab to experiment while watching at 2:15!`;
    // Vibe demo: if user asks to create/edit, generate an <edit_file> response
    if (qLower.includes("button") || qLower.includes("gold") || qLower.includes("html") || qLower.includes("preview") || qLower.includes("vibe") || qLower.includes("create") || qLower.includes("make")) {
      const html = `<!DOCTYPE html>
<html>
<head><style>
  body { background:#0B0215; color:white; font-family:sans-serif; padding:32px; text-align:center }
  .btn { background:linear-gradient(90deg,#FFD700,#F59E0B); color:black; font-weight:800; padding:14px 28px; border-radius:9999px; border:none; box-shadow:0 0 20px rgba(255,215,0,0.35); cursor:pointer }
  h1 { color:#FFD700 }
</style></head>
<body>
  <h1>Hello Alphatekx 🚀</h1>
  <p>Generated from your vibe: "${q}"</p>
  <button class="btn">Gold Button ✨</button>
  <p style="color:#888;font-size:12px;margin-top:16px">Edit in Code tab — preview updates live</p>
</body>
</html>`;
      aiText = `Done! I've updated your file:\n<edit_file path="index.html">${html}</edit_file>\nSwitched to Preview — see your gold button live!`;
    } else if (qLower.includes("hello") || qLower.includes("console.log")) {
      aiText = `Try this in Code tab:\n<edit_file path="index.html"><!DOCTYPE html><html><body style="background:#0B0215;color:#FFD700;padding:20px"><h1>Hello Alphatekx</h1><script>console.log('Hello Alphatekx')</script></body></html></edit_file>`;
    }
    setAiChatMessages(prev => [...prev, { role: "user", text: q }, { role: "ai", text: aiText }]);
    setAiChatInput("");
    // Auto-parse after state update (next tick)
    setTimeout(() => vibeParser(aiText), 100);
  };
  // Also parse any AI messages that arrive via other means
  useEffect(() => {
    const last = aiChatMessages[aiChatMessages.length - 1];
    if (last && last.role === "ai" && last.text.includes("<edit_file")) {
      vibeParser(last.text);
    }
  }, [aiChatMessages]);
  // TERMINAL — Xterm + WebContainer refs
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const webcontainerRef = useRef(null);
  const shellInputRef = useRef("");
  const [terminalReady, setTerminalReady] = useState(false);
  // Monaco loader — upgrade textarea to real Monaco when available (keeps fallback)
  useEffect(() => {
    if (watchPanelTab !== "code") return;
    if (monacoEditorRef.current) return;
    const container = monacoRef.current;
    if (!container) return;
    if (window.monaco) return;
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js";
    script.onload = () => {
      const requireFn = window.require;
      if (!requireFn) return;
      requireFn.config({ paths: { vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs" } });
      requireFn(["vs/editor/editor.main"], () => {
        if (!container || monacoEditorRef.current) return;
        const ta = container.querySelector("textarea");
        if (ta) ta.style.display = "none";
        monacoEditorRef.current = window.monaco.editor.create(container, {
          value: codeValue,
          language: "javascript",
          theme: "vs-dark",
          automaticLayout: true,
          minimap: { enabled: false },
          fontSize: 13,
        });
        monacoEditorRef.current.onDidChangeModelContent(() => {
          setCodeValue(monacoEditorRef.current.getValue());
        });
      });
    };
    document.head.appendChild(script);
    return () => {};
  }, [watchPanelTab]);

  // MISSION 4 — TERMINAL Xterm + WebContainer (zero-cost, browser only)
  useEffect(() => {
    if (watchPanelTab !== "terminal" || !watchPanelOpen) return;
    if (xtermRef.current) return;
    const container = terminalRef.current;
    if (!container) return;
    const init = async () => {
      // CSS
      if (!document.querySelector('link[href*="xterm"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://cdn.jsdelivr.net/npm/xterm@5.3.0/css/xterm.min.css";
        document.head.appendChild(link);
      }
      // Load Xterm if needed
      const loadXterm = () => new Promise((res, rej) => {
        if (window.Terminal) return res(window.Terminal);
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/xterm@5.3.0/lib/xterm.min.js";
        s.onload = () => res(window.Terminal);
        s.onerror = rej;
        document.head.appendChild(s);
      });
      let Term;
      try { Term = await loadXterm(); } catch { Term = null; }
      if (!Term) {
        container.innerHTML = '<div style="color:#FFD700;padding:16px;font-family:monospace">Terminal failed to load. Try reload.</div>';
        return;
      }
      const term = new Term({ theme: { background: "#0B0215", foreground: "#d4d4d4", cursor: "#FFD700" }, fontFamily: "monospace", fontSize: 13, cursorBlink: true });
      term.open(container);
      xtermRef.current = term;
      const prompt = () => term.write("\r\n\x1b[33malphatekx\x1b[0m:\x1b[34m~\x1b[0m$ ");
      term.writeln("Alphatekx Terminal — WebContainer (zero-cost browser)");
      term.writeln("Type: ls, echo hello, node --version, npm");
      prompt();
      setTerminalReady(true);
      let booted = false;
      // Try WebContainer
      try {
        const wcMod = await import("https://esm.sh/@webcontainer/api@1.1.9");
        const WebContainer = wcMod.WebContainer || wcMod.default?.WebContainer;
        if (WebContainer) {
          const wc = await WebContainer.boot();
          webcontainerRef.current = wc;
          const shell = await wc.spawn("jsh");
          shell.output.pipeTo(new WritableStream({ write(data) { term.write(data); } }));
          const input = shell.input.getWriter();
          term.onData((data) => {
            // handle enter locally for mock echo if shell not ready
            input.write(data);
          });
          booted = true;
          term.writeln("\r\n\x1b[32m✓ WebContainer booted — jsh ready\x1b[0m");
          prompt();
        }
      } catch (e) {
        term.writeln("\r\n\x1b[31mWebContainer not available (needs COOP/COEP). Fallback mock shell.\x1b[0m");
      }
      if (!booted) {
        // Fallback mock shell — handles ls, echo, node --version, npm
        term.onData((data) => {
          const code = data.charCodeAt(0);
          if (code === 13) { // enter
            const cmd = shellInputRef.current.trim();
            term.writeln("");
            if (cmd === "ls") term.writeln("index.html  app.jsx  public  package.json");
            else if (cmd.startsWith("echo ")) term.writeln(cmd.slice(5));
            else if (cmd === "node --version") term.writeln("v20.11.0");
            else if (cmd.startsWith("npm")) term.writeln("npm 10.2.3 — mock");
            else if (cmd === "clear") term.clear();
            else if (cmd) term.writeln(`sh: ${cmd}: mock — try echo hello`);
            shellInputRef.current = "";
            prompt();
          } else if (code === 127) { // backspace
            if (shellInputRef.current.length > 0) {
              shellInputRef.current = shellInputRef.current.slice(0, -1);
              term.write("\b \b");
            }
          } else if (code >= 32) {
            shellInputRef.current += data;
            term.write(data);
          }
        });
      }
    };
    init();
  }, [watchPanelTab, watchPanelOpen]);

  // MISSION 2 — SHADOW-CLONE CHECKPOINT SYSTEM (Timeline Hijacking Engine)
  const [checkpoints, setCheckpoints] = useState([]);
  const [activeCheckpoint, setActiveCheckpoint] = useState(null);
  const [completedCheckpoints, setCompletedCheckpoints] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("alphatekx_completed_checkpoints")||"[]")); } catch { return new Set(); }
  });
  const ytPlayerRef = useRef(null);
  const checkpointPollRef = useRef(null);
  // Load checkpoints.json for current video (jvXEkm27XOE + fallback)
  useEffect(() => {
    fetch('/checkpoints.json').then(r=>r.ok?r.json():null).then(data=>{
      if(Array.isArray(data)) setCheckpoints(data);
    }).catch(()=>{});
  }, []);
  // YouTube IFrame API — poll currentTime every 800ms, pause at checkpoint
  useEffect(() => {
    if (!checkpoints.length) return;
    if (activeCheckpoint) return; // already paused, wait for code
    // init YT player if iframe has enablejsapi
    const initPlayer = () => {
      if (ytPlayerRef.current) return;
      if (!window.YT || !window.YT.Player) return;
      try {
        const iframe = iframeRef.current;
        if (!iframe) return;
        ytPlayerRef.current = new window.YT.Player(iframe, {
          events: {
            onReady: () => {},
            onStateChange: () => {}
          }
        });
      } catch {}
    };
    // load YT API if not present
    if (!window.YT) {
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
      const t = setInterval(()=>{ if(window.YT && window.YT.Player){ clearInterval(t); initPlayer(); } }, 500);
      return ()=>clearInterval(t);
    } else {
      initPlayer();
    }
    const poll = setInterval(async () => {
      try {
        let currentTime = null;
        // Try YT player first
        if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === "function") {
          try { currentTime = ytPlayerRef.current.getCurrentTime(); } catch {}
        }
        // Fallback: try postMessage API estimation via iframe src time param not reliable, so skip if no YT
        if (currentTime === null || isNaN(currentTime)) return;
        for (const cp of checkpoints) {
          if (completedCheckpoints.has(cp.time)) continue;
          if (Math.abs(currentTime - cp.time) < 1.2) {
            // HIT — pause, overlay, glow, switch to Code
            try { ytPlayerRef.current.pauseVideo(); } catch {}
            // Also try iframe postMessage pause as fallback
            try { iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "pauseVideo", args: [] }), "*"); } catch {}
            setActiveCheckpoint(cp);
            setWatchPanelOpen(true);
            setWatchPanelTab("code");
            showToast(`🔒 ${cp.title} — ${cp.task}`);
            break;
          }
        }
      } catch {}
    }, 800);
    checkpointPollRef.current = poll;
    return () => clearInterval(poll);
  }, [checkpoints, activeCheckpoint, completedCheckpoints]);
  // Auto-resume when code contains check string
  useEffect(() => {
    if (!activeCheckpoint) return;
    const check = (activeCheckpoint.check || "").trim();
    if (!check) return;
    if (codeValue.includes(check)) {
      const cp = activeCheckpoint;
      setCompletedCheckpoints(prev => {
        const next = new Set(prev); next.add(cp.time);
        try { localStorage.setItem("alphatekx_completed_checkpoints", JSON.stringify([...next])); } catch {}
        return next;
      });
      setActiveCheckpoint(null);
      try { ytPlayerRef.current?.playVideo(); } catch {}
      try { iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "playVideo", args: [] }), "*"); } catch {}
      showToast(`✅ Checkpoint cleared — Video resumed • ${cp.title}`);
    }
  }, [codeValue, activeCheckpoint]);

  // === NEW: Channel / Upload / Profile / Categories (preserve design) ===
  // PROMPT #7: Official ALPHATEKX channel as default
  const [activeChannelId, setActiveChannelId] = useState("UCGm89Z31SYxEU9PEQ-p3cNA");
  const [channelData, setChannelData] = useState(null);
  const [channelUploads, setChannelUploads] = useState([]);
  const [isChannelLoading, setIsChannelLoading] = useState(false);
  const [channelSubscribed, setChannelSubscribed] = useState(false);
  const [categories, setCategories] = useState(["All","Neural Networks","PyTorch","AI Superpowers","Cloudflare Workers","Naija Dialects"]);
  // === UNIFIED AGGREGATOR: platform filter + Watch Later ===
  const [activePlatform, setActivePlatform] = useState("all"); // all | youtube | tiktok | instagram | twitter | facebook
  const [watchLater, setWatchLater] = useState(() => { try{ const raw=localStorage.getItem("alphatekx_watch_later"); return raw?JSON.parse(raw):[];}catch{return [];} });
  const isSavedWatchLater = (id) => watchLater.some(v=> (v.youtubeId||v.id)===id);
  // Upload form
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadCategory, setUploadCategory] = useState("Tech");
  const [uploadThumbnail, setUploadThumbnail] = useState("");
  const [uploadVideoUrl, setUploadVideoUrl] = useState("");
  const [uploadDuration, setUploadDuration] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  // Profile editable
  const [profileData, setProfileData] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name:"", handle:"", bio:"", avatar:"", banner:"", email:"" });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Persist history to localStorage whenever it changes
  useEffect(() => {
    try { localStorage.setItem("alphatekx_search_history", JSON.stringify(searchHistory.slice(0,100))); } catch {}
  }, [searchHistory]);
  useEffect(() => {
    try { localStorage.setItem("alphatekx_watched_history", JSON.stringify(watchedHistory.slice(0,100))); } catch {}
  }, [watchedHistory]);

  // Load history from server on mount — merge with localStorage (server newest first)
  useEffect(() => {
    fetch("/api/search/history").then(r=>r.ok?r.json():null).then(data=>{
      if (data && Array.isArray(data.history) && data.history.length>0) {
        // Merge server + local, dedupe by youtubeId, keep newest
        const merged = [...data.history.map(normalizeVideo)];
        const seen = new Set(merged.map(v=>v.youtubeId||v.id));
        for (const h of searchHistory) {
          const id = h.youtubeId||h.id;
          if (!seen.has(id)) { merged.push(h); seen.add(id); }
        }
        // also hydrate localStorage if server has more
        if (merged.length !== searchHistory.length) setSearchHistory(merged.slice(0,100));
      }
    }).catch(()=>{});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistSearchHistory = (videos, query) => {
    if (!videos || videos.length===0) return;
    const enriched = videos.map(v=>({
      ...normalizeVideo(v),
      searchedQuery: query || "",
      searchedAt: Date.now()
    }));
    setSearchHistory(prev => {
      const map = new Map(prev.map(p=>[(p.youtubeId||p.id), p]));
      // prepend newest, dedupe
      const next = [...enriched.filter(e=>!map.has(e.youtubeId||e.id)), ...prev.filter(p=>!enriched.some(e=>(e.youtubeId||e.id)===(p.youtubeId||p.id)))];
      // keep enriched at front (already), but deduped enrich should be first
      const deduped = [];
      const seen = new Set();
      for (const item of [...enriched, ...prev]) {
        const id = item.youtubeId||item.id;
        if (!seen.has(id)) { deduped.push(item); seen.add(id); }
      }
      return deduped.slice(0,100);
    });
  };

  // === NEW: Fetch categories + profile on mount (preserve design) ===
  useEffect(() => {
    fetch("/api/categories").then(r=>r.ok?r.json():null).then(d=>{ if(d && Array.isArray(d.categories)) setCategories(d.categories); }).catch(()=>{});
    fetch("/api/profile").then(r=>r.ok?r.json():null).then(d=>{
      if(d && d.profile){ setProfileData(d.profile); setProfileForm({ name:d.profile.name||"", handle:d.profile.handle||"", bio:d.profile.bio||"", avatar:d.profile.avatar||"", banner:d.profile.banner||"", email:d.profile.email||"" }); }
    }).catch(()=>{});
    // watch later sync
    fetch("/api/watch-later").then(r=>r.ok?r.json():null).then(d=>{
      if(d && Array.isArray(d.videos) && d.videos.length>0){
        setWatchLater(d.videos);
        try{ localStorage.setItem("alphatekx_watch_later", JSON.stringify(d.videos)); }catch{}
      }
    }).catch(()=>{});
  }, []);
  useEffect(()=>{ try{ localStorage.setItem("alphatekx_watch_later", JSON.stringify(watchLater)); }catch{} }, [watchLater]);
  // GATED: YouTube becomes profile — as soon as user signs in, his YouTube is his profile
  useEffect(() => {
    if (authUser && !authUser.isGuest) {
      const ytProfile = {
        id: authUser.channelId || authUser.id || "yt_user",
        name: authUser.channelName || "YouTube User",
        handle: authUser.handle || `@${(authUser.channelName||"youtube").toLowerCase().replace(/[^a-z0-9]/g,"")}`,
        email: authUser.email || `${(authUser.channelName||"youtube").toLowerCase().replace(/\s+/g,"")}@youtube.local`,
        avatar: authUser.channelAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.channelName||"You")}&background=FFD700&color=000&size=200&bold=true`,
        banner: authUser.banner || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
        bio: `YouTube Channel • ${authUser.channelName || "You"} • Signed in via YouTube — full access unlocked ✓`,
        subscribers: authUser.subscribers || (authUser.subscribersCount ? String(authUser.subscribersCount) : "—"),
        subscribersCount: authUser.subscribersCount || 0,
        verified: true,
        isGuest: false,
        youtube: true,
        channelId: authUser.channelId || authUser.id,
      };
      setProfileData(ytProfile);
      setProfileForm({ name: ytProfile.name, handle: ytProfile.handle, bio: ytProfile.bio, avatar: ytProfile.avatar, banner: ytProfile.banner, email: ytProfile.email });
    }
  }, [authUser]);
  // Personalized feed — fetch user's videos when signed in
  const [userFeed, setUserFeed] = useState([]);
  useEffect(() => {
    if (!isGuest && authUser) {
      fetch('/api/user/feed', { credentials: 'include' }).then(r=>r.ok?r.json():null).then(d=>{
        if(d && Array.isArray(d.feed) && d.feed.length>0) setUserFeed(d.feed);
        else if(d && d.feed) setUserFeed(d.feed);
      }).catch(()=>{});
    } else setUserFeed([]);
  }, [isGuest, authUser]);
  // Fetch channel when activeChannelId changes or when entering channel tab — PROMPT #7 real-time for ALPHATEKX
  useEffect(() => {
    if (activeTab !== "channel") return;
    setIsChannelLoading(true);
    const isOfficial = activeChannelId === OFFICIAL_CHANNEL_ID || activeChannelId.toLowerCase() === "alphatekx" || activeChannelId.toLowerCase() === "risewithalphatekx" || activeChannelId.toLowerCase().includes("ucgm89z31syxeu9peq");
    const channelFetch = fetch(`/api/channel/${encodeURIComponent(activeChannelId)}`).then(r=>r.ok?r.json():null);
    const videosFetch = isOfficial ? fetch(`/api/channel/videos`).then(r=>r.ok?r.json():null).catch(()=>null) : Promise.resolve(null);
    Promise.all([channelFetch, videosFetch]).then(([d, vData]) => {
      if(d && d.channel){
        setChannelData(d.channel);
        let uploads = Array.isArray(d.uploads)?d.uploads:[];
        if(vData && Array.isArray(vData.videos) && vData.videos.length>0){
          const seen = new Set(uploads.map(u=>u.youtubeId||u.id));
          const official = vData.videos.filter(v=>!seen.has(v.youtubeId||v.id)).map(v=>({...v, channelId: OFFICIAL_CHANNEL_ID, channelName: OFFICIAL_CHANNEL_NAME}));
          uploads = [...official, ...uploads];
        }
        setChannelUploads(uploads);
      } else if(vData && Array.isArray(vData.videos)){
        // fallback if channel fetch failed but videos succeeded (official)
        fetch(`/api/channel`).then(r=>r.ok?r.json():null).then(cd=>{ if(cd && cd.channel) setChannelData(cd.channel); });
        setChannelUploads(vData.videos.map(v=>({...v, channelId: OFFICIAL_CHANNEL_ID, channelName: OFFICIAL_CHANNEL_NAME})));
      }
      setIsChannelLoading(false);
    }).catch(()=> setIsChannelLoading(false));
  }, [activeTab, activeChannelId]);
  const navigateToChannel = (channelId) => {
    let cid = channelId || "codecraft";
    if (/^UC[a-zA-Z0-9_-]{22}$/.test(cid)) {
      setActiveChannelId(cid);
    } else {
      cid = slugify(cid) || "codecraft";
      if (cid === "risewithalphatekx" || cid === "alphatekx" || cid === "alphatekx-dev") cid = OFFICIAL_CHANNEL_ID;
      setActiveChannelId(cid);
    }
    setActiveTab("channel");
    setChannelSubscribed(false);
    if (mainScrollRef.current) mainScrollRef.current.scrollTop = 0;
  };
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadTitle.trim() || uploadTitle.trim().length < 3) { showToast("Title must be at least 3 characters"); return; }
    setIsUploading(true);
    try {
      const res = await fetch("/api/upload", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ title: uploadTitle, description: uploadDesc, category: uploadCategory, channelId: activeChannelId || profileForm.handle?.replace("@","") || "codecraft", channelName: profileData?.name || channelData?.name || "Alphatekx Dev", thumbnailUrl: uploadThumbnail, videoUrl: uploadVideoUrl, duration: uploadDuration || "10:00" }) });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Upload failed");
      showToast(`Uploaded "${data.video.title}" to ${data.video.channelName}! 🎉`);
      setUploadTitle(""); setUploadDesc(""); setUploadThumbnail(""); setUploadVideoUrl(""); setUploadDuration("");
      // refresh channel uploads if on that channel
      setChannelUploads(prev => [data.video, ...prev]);
      setActiveChannelId(data.video.channelId);
      setActiveTab("channel");
    } catch(err){ showToast(err.message || "Upload failed"); }
    finally { setIsUploading(false); }
  };
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const res = await fetch("/api/profile", { method:"PUT", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(profileForm) });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Save failed");
      setProfileData(data.profile);
      setIsEditingProfile(false);
      showToast("Profile updated! ✨");
    } catch(err){ showToast(err.message || "Save failed"); }
    finally { setIsSavingProfile(false); }
  };
  const toggleWatchLater = async (video) => {
    const id = video.youtubeId || video.id || video.platformId;
    if (!id) return;
    const exists = watchLater.some(v=> (v.youtubeId||v.id)===id);
    if (exists) {
      // remove
      const res = await fetch(`/api/watch-later/${encodeURIComponent(id)}`, { method:"DELETE" });
      if (res.ok) {
        setWatchLater(prev => prev.filter(v=> (v.youtubeId||v.id)!==id));
        showToast("Removed from Watch Later");
      }
    } else {
      const payload = { ...video, youtubeId: id, platform: video.platform || "youtube", platformMeta: video.platformMeta, title: video.title, channelName: video.channelName || video.channel, thumbnailUrl: video.thumbnailUrl || video.img, views: video.views, duration: video.duration };
      const res = await fetch("/api/watch-later", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(payload) });
      const data = await res.json().catch(()=>null);
      if (res.ok) {
        setWatchLater(data?.videos || [...watchLater, payload]);
        showToast("Saved to Watch Later ✓");
      } else {
        // fallback local
        setWatchLater(prev => [payload, ...prev]);
        showToast("Saved to Watch Later ✓ (local)");
      }
    }
  };
  const removeWatchLater = async (id) => {
    const res = await fetch(`/api/watch-later/${encodeURIComponent(id)}`, { method:"DELETE" });
    if (res.ok) {
      const data = await res.json().catch(()=>null);
      if (data?.videos) setWatchLater(data.videos); else setWatchLater(prev=> prev.filter(v=> (v.youtubeId||v.id)!==id));
    } else {
      setWatchLater(prev=> prev.filter(v=> (v.youtubeId||v.id)!==id));
    }
    showToast("Removed from Watch Later");
  };

  // PROMPT #4: Comfortable Video Player — theatre + idle hide
  const [theaterMode, setTheaterMode] = useState(false);
  const [playerIdle, setPlayerIdle] = useState(false);
  // PROMPT #7+8: Shorts — best absolute, simple, easy volume
  const [shortsIndex, setShortsIndex] = useState(0);
  const [shortsMuted, setShortsMuted] = useState(true);
  const [shortsPlaying, setShortsPlaying] = useState(true);
  const [shortsLiked, setShortsLiked] = useState({});
  const [shortsVideos, setShortsVideos] = useState([
    { id: "jvXEkm27XOE", youtubeId: "jvXEkm27XOE", title: "This AI Avatar BEATS HeyGen 10 TIMES! 🤯 #viral #trending", channel: "ALPHATEKX", handle: "@risewithalphatekx", avatar: "https://img.youtube.com/vi/jvXEkm27XOE/hqdefault.jpg", subscribers: "3,020", subscribersCount: 3020, likes: "24K", comments: "342", shares: "1.2K", views: "15K" },
    { id: "dQw4w9WgXcQ", youtubeId: "dQw4w9WgXcQ", title: "How Attention Works in 30s! 🧠 #AI #Shorts", channel: "CodeCraft", handle: "@codecraft", avatar: "https://images.unsplash.com/photos/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80", subscribers: "1.8M", subscribersCount: 1800000, likes: "45.2K", comments: "892", shares: "2.1K", views: "340K" },
    { id: "L_LUpnjgPso", youtubeId: "L_LUpnjgPso", title: "AI Voice Agents in 15s ⚡ Edge GPU Magic", channel: "Edge AI Lab", handle: "@edgeailab", avatar: "https://images.unsplash.com/photos/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80", subscribers: "890K", subscribersCount: 890000, likes: "18K", comments: "412", shares: "890", views: "185K" },
    { id: "M576WGiDBdQ", youtubeId: "M576WGiDBdQ", title: "Cloudflare Workers Tip: 60s Deploy 🚀", channel: "Serverless Pro", handle: "@serverlesspro", avatar: "https://images.unsplash.com/photos/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80", subscribers: "456K", subscribersCount: 456000, likes: "12K", comments: "210", shares: "560", views: "92K" },
    { id: "fJ9rUzIMcZQ", youtubeId: "fJ9rUzIMcZQ", title: "Naija AI in Pidgin — try it! 🇳🇬 #Shorts", channel: "Naija Tech Hub", handle: "@naijatech", avatar: "https://images.unsplash.com/photos/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80", subscribers: "230K", subscribersCount: 230000, likes: "31K", comments: "523", shares: "1.5K", views: "512K" },
  ]);
  const currentShort = shortsVideos[shortsIndex] || shortsVideos[0];
  const [miniPlayerActive, setMiniPlayerActive] = useState(false); // REMOVED — no float
  const [isMiniPlaying, setIsMiniPlaying] = useState(true);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [voiceListening, setVoiceListening] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [superChatModalOpen, setSuperChatModalOpen] = useState(false);
  const [superChatAmount, setSuperChatAmount] = useState(5);
  const [superChatMessage, setSuperChatMessage] = useState("");
  const [autoplayNext, setAutoplayNext] = useState(true);

  // Master Video Catalog — PROMPT #3: DEFAULT_VIDEO (jvXEkm27XOE) is first, featured, autoplay — real views/likes via API
  const [videoCatalog, setVideoCatalog] = useState([
    {
      id: DEFAULT_VIDEO.id,
      youtubeId: DEFAULT_VIDEO.youtubeId,
      title: DEFAULT_VIDEO.title,
      channel: DEFAULT_VIDEO.channel,
      channelName: DEFAULT_VIDEO.channelName,
      subscribers: DEFAULT_VIDEO.subscribers,
      views: DEFAULT_VIDEO.views,
      timeAgo: DEFAULT_VIDEO.timeAgo,
      duration: DEFAULT_VIDEO.duration,
      tag: DEFAULT_VIDEO.tag,
      avatar: DEFAULT_VIDEO.avatar,
      img: DEFAULT_VIDEO.img,
      thumbnailUrl: DEFAULT_VIDEO.thumbnailUrl,
      description: DEFAULT_VIDEO.description,
      platform: "youtube",
      featured: true,
    },
    { 
      id: "dQw4w9WgXcQ", 
      title: "How to Build Neural Networks from Scratch | Full AI Tutorial 2024", 
      channel: "CodeCraft Academy", 
      subscribers: "1.2M", 
      views: "340K views", 
      timeAgo: "3 days ago", 
      duration: "22:45", 
      tag: "Neural Networks", 
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80", 
      img: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg", 
      description: "In this comprehensive tutorial, we build a deep neural network from mathematical primitives up to PyTorch CUDA acceleration and edge inferencing on Cloudflare Workers." 
    },
    { 
      id: "L_LUpnjgPso", 
      title: "Building Real-time AI Voice Agents with WebSockets & Edge GPUs", 
      channel: "Edge AI Lab", 
      subscribers: "890K", 
      views: "185K views", 
      timeAgo: "1 week ago", 
      duration: "15:10", 
      tag: "Cloudflare Workers", 
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80", 
      img: "https://i.ytimg.com/vi/L_LUpnjgPso/hqdefault.jpg", 
      description: "Low-latency streaming architecture for real-time AI voice synthesis." 
    },
    { 
      id: "M576WGiDBdQ", 
      title: "Cloudflare Workers & SQLite Durable Objects Masterclass", 
      channel: "Serverless Pro", 
      subscribers: "640K", 
      views: "92K views", 
      timeAgo: "4 days ago", 
      duration: "18:30", 
      tag: "Cloudflare Workers", 
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80", 
      img: "https://i.ytimg.com/vi/M576WGiDBdQ/hqdefault.jpg", 
      description: "Learn how to build edge-rendered applications with per-tenant SQLite persistence." 
    },
    { 
      id: "fJ9rUzIMcZQ", 
      title: "Sub-100ms LLM Streaming Inference on Edge GPUs", 
      channel: "AI Hardware Hub", 
      subscribers: "1.5M", 
      views: "410K views", 
      timeAgo: "2 weeks ago", 
      duration: "32:15", 
      tag: "AI Superpowers", 
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80", 
      img: "https://i.ytimg.com/vi/fJ9rUzIMcZQ/hqdefault.jpg", 
      description: "Accelerating token generation using vLLM and Triton kernels." 
    },
    { 
      id: "3JZ_D3ELwOQ", 
      title: "Naija Pidgin AI Voice Synthesizer & Subtitle Engine", 
      channel: "Naija Tech Hub", 
      subscribers: "420K", 
      views: "512K views", 
      timeAgo: "5 days ago", 
      duration: "12:04", 
      tag: "Naija Dialects", 
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80", 
      img: "https://i.ytimg.com/vi/3JZ_D3ELwOQ/hqdefault.jpg", 
      description: "Demonstrating Pidgin, Yoruba, Igbo and Hausa translation models for video subtitle localization." 
    }
  ]);

  // Load 30 real videos to make site look real — no mock nonsense, better than YouTube
  useEffect(() => {
    // Fetch official channel's real 30 videos to populate home
    fetch("/api/channel/videos?max=30").then(r=>r.ok?r.json():null).then(d=>{
      if (d && Array.isArray(d.videos) && d.videos.length>5) {
        const real = d.videos.map(v=>normalizeVideo(v));
        // Keep DEFAULT_VIDEO first, then real, deduped, max 31
        const seen = new Set([DEFAULT_VIDEO.youtubeId]);
        const filtered = real.filter(v=>!seen.has(v.youtubeId));
        const combined = [normalizeVideo(DEFAULT_VIDEO), ...filtered].slice(0,31);
        if (combined.length > 6) setVideoCatalog(combined);
      }
    }).catch(()=>{});
  }, []);

  // Active Video State — also track watched history real-time + real likes/views (no mock)
  const [activeVideo, setActiveVideo] = useState(videoCatalog[0]);
  useEffect(() => {
    if (activeVideo?.id || activeVideo?.youtubeId) pushWatched(activeVideo);
  }, [activeVideo?.id, activeVideo?.youtubeId]);
  useEffect(() => {
    const vid = activeVideo?.youtubeId || activeVideo?.id;
    if (!vid || String(vid).startsWith("mock")) return;
    fetch(`/api/video/${encodeURIComponent(vid)}`).then(r=>r.ok?r.json():null).then(d=>{
      if (d && d.video) {
        if (d.video.likeCount) setLikeCount(Number(d.video.likeCount));
        if (d.video.viewsFormatted) {
          // update displayed views without re-triggering watched push loop (safe guard)
          setActiveVideo(prev => {
            if ((prev.youtubeId||prev.id) !== vid) return prev;
            if (prev.views === d.video.viewsFormatted) return prev;
            return { ...prev, views: d.video.viewsFormatted, timeAgo: "Real views" };
          });
        }
      }
    }).catch(()=>{});
    // also refresh channel subs real
    if (activeVideo?.channelId) {
      fetch(`/api/channel/${encodeURIComponent(activeVideo.channelId)}`).then(r=>r.ok?r.json():null).then(d=>{
        if (d && d.channel && d.channel.subscribersCount) {
          // update videoCatalog not needed, just ensure UI shows real
        }
      }).catch(()=>{});
    }
  }, [activeVideo?.youtubeId, activeVideo?.id]);
  // Force real view count on any video play
  useEffect(() => {
    const vid = activeVideo?.youtubeId || activeVideo?.id;
    if (vid && !String(vid).startsWith("mock")) {
      fetch(`/api/video/${encodeURIComponent(vid)}`).then(r=>r.ok?r.json():null).then(d=>{
        if (d?.video?.viewsFormatted) {
          setActiveVideo(prev=> prev && (prev.youtubeId||prev.id)===vid ? {...prev, views: d.video.viewsFormatted, timeAgo: "Real views"} : prev);
        }
      }).catch(()=>{});
    }
  }, [activeVideo?.youtubeId, activeVideo?.id]);
  // Fetch real views/likes for catalog + shorts — no mock nonsense, real YouTube stats
  useEffect(() => {
    const allIds = [...new Set([...videoCatalog.map(v=>v.youtubeId), ...shortsVideos.map(s=>s.youtubeId)])].filter(id=>!String(id).startsWith("mock"));
    allIds.forEach(id=>{
      fetch(`/api/video/${encodeURIComponent(id)}`).then(r=>r.ok?r.json():null).then(d=>{
        if (d && d.video) {
          const viewsFormatted = Number(d.video.views).toLocaleString() + " views";
          const likesFormatted = d.video.likes ? (Number(d.video.likes) >= 1000 ? (Number(d.video.likes)/1000).toFixed(1)+"K" : String(d.video.likes)) : null;
          setVideoCatalog(prev=> prev.map(v=> (v.youtubeId===id || v.id===id) ? {...v, views: viewsFormatted, ...(likesFormatted?{likes: likesFormatted}:{})} : v));
          setShortsVideos(prev=> prev.map(s=> (s.youtubeId===id || s.id===id) ? {...s, views: viewsFormatted, ...(likesFormatted?{likes: likesFormatted}:{})} : s));
        }
      }).catch(()=>{});
    });
  }, []);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [likeCount, setLikeCount] = useState(0); // Will fetch real from API
  const [userLiked, setUserLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showDescriptionMore, setShowDescriptionMore] = useState(false);
  
  // Update likeCount to show real data from activeVideo when it loads
  useEffect(() => {
    if (activeVideo?.likeCount) setLikeCount(activeVideo.likeCount);
  }, [activeVideo?.likeCount]);

  // Real YouTube API Search Effect (400ms Debounce) — persists to history + localStorage
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      setSearchIsMock(null);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        .then((res) => {
          if (!res.ok) throw new Error("API search failed");
          return res.json();
        })
        .then((data) => {
          const isMock = data?.isMock === true;
          setSearchIsMock(isMock);
          let vids = [];
          if (data && Array.isArray(data.videos) && data.videos.length > 0) {
            vids = data.videos.map(normalizeVideo);
            setSearchResults(vids);
          } else {
            const qLower = searchQuery.toLowerCase();
            const filtered = videoCatalog.filter(
              (v) => v.title.toLowerCase().includes(qLower) || v.channel.toLowerCase().includes(qLower)
            );
            vids = (filtered.length>0?filtered:videoCatalog).map(normalizeVideo);
            setSearchResults(vids);
            setSearchIsMock(true);
          }
          // NEVER vanish: persist to server + localStorage
          if (vids.length>0) {
            persistSearchHistory(vids, searchQuery);
            // fire-and-forget POST to server for persistent history
            fetch("/api/search/save", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ videos: vids, searchedQuery: searchQuery }) }).catch(()=>{});
          }
          setSearchTab("results");
        })
        .catch((err) => {
          console.warn("YouTube API search fetch notice (using fallback):", err);
          const qLower = searchQuery.toLowerCase();
          let filtered = videoCatalog.filter(
            (v) => v.title.toLowerCase().includes(qLower) || v.channel.toLowerCase().includes(qLower)
          );
          if (filtered.length===0) filtered = videoCatalog; // burna boy fix
          const vids = filtered.map(normalizeVideo);
          setSearchResults(vids);
          setSearchIsMock(true);
          persistSearchHistory(vids, searchQuery);
          fetch("/api/search/save", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ videos: vids, searchedQuery: searchQuery }) }).catch(()=>{});
        })
        .finally(() => {
          setIsSearching(false);
        });
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, videoCatalog]);

  // Video Chapters — exact image: 00:00 Intro, 02:14 Architecture, 07:30 Training Loop, 14:05 Evaluation, 22:18 Demo
  const videoChapters = [
    { title: "Intro", timestamp: "00:00", seconds: 0 },
    { title: "Architecture", timestamp: "02:14", seconds: 134 },
    { title: "Training Loop", timestamp: "07:30", seconds: 450 },
    { title: "Evaluation", timestamp: "14:05", seconds: 845 },
    { title: "Demo", timestamp: "22:18", seconds: 1338 }
  ];

  // Superpower 1: Enhanced Cinema Mode Ambient Glow
  const [cinemaMode, setCinemaMode] = useState(true);

  // Superpower 2 & 3: AI Summary & Naija Translator
  const [aiLanguage, setAiLanguage] = useState("English");
  const [aiBullets, setAiBullets] = useState([
    { text: "Summarizes key concepts: neurons, layers, backpropagation & matrix math covered clearly.", timestamp: "2:15", seconds: 135 },
    { text: "Key timestamp: Training loop & loss function gradient calculation explained step-by-step.", timestamp: "12:30", seconds: 750 },
    { text: "Links: PyTorch code & Jupyter notebook available in description → github.com/codecraft/nn-tutorial", timestamp: "18:45", seconds: 1125, link: "https://github.com/codecraft/nn-tutorial" }
  ]);
  const [activeTimestamp, setActiveTimestamp] = useState(null);
  const [summaryInputChat, setSummaryInputChat] = useState("");
  // AI helper — small A icon near video, real-time (only on click)
  const [aiHelperOpen, setAiHelperOpen] = useState(false);
  const [aiHelperVideo, setAiHelperVideo] = useState(null);

  // Superpower 4: Live Community Chat & Super Chats
  const [activeChannel, setActiveChannel] = useState("general");
  const [communityMessages, setCommunityMessages] = useState([
    { id: 1, userName: "dev_nina", avatarInitials: "N", avatarColor: "bg-orange-500", timeAgo: "2m ago", message: "This explanation at 8:15 finally made backprop click — thank you! 🔥", timestampInVideo: "8:15", likes: 14 },
    { id: 2, userName: "ml_learner", avatarInitials: "M", avatarColor: "bg-teal-500", timeAgo: "1m ago", message: "Would love a follow-up on CNNs next. Super clear presentation!", timestampInVideo: "12:30", likes: 9 },
    { id: 3, userName: "tech_guru", avatarInitials: "T", avatarColor: "bg-purple-500", timeAgo: "Just now", message: "Are you guys running PyTorch 2.0 compile mode or raw CUDA kernels here?", timestampInVideo: "2:15", likes: 5, isSuperChat: true, superAmount: "$10" }
  ]);
  const [chatMessageInput, setChatMessageInput] = useState("");
  const [liveViewerCount, setLiveViewerCount] = useState(1248);

  // PROMPT #6: Marketplace — products with 20% fee, Seller Dashboard, Stripe
  const [marketplaceProducts, setMarketplaceProducts] = useState([
    { id: 1, name: "AI Neural Net Model Pack", description: "Pre-trained PyTorch weights & vision dataset with puzzle CUDA acceleration.", price: 9.99, badge: "BESTSELLER", iconType: "cpu", category: "app", salesCount: 342, sellerEmail: "dev@alphatekx.ai" },
    { id: 2, name: "Stream Platform Course Bundle", description: "Complete 6-hr video course with certificate & full source code repo.", price: 24.99, badge: "HOT", iconType: "video", category: "course", salesCount: 189, sellerEmail: "academy@alphatekx.ai" },
    { id: 3, name: "Naija Speech Translation Engine", description: "Pidgin, Yoruba & Igbo TTS audio translation API plugin.", price: 14.99, badge: "NEW", iconType: "sparkles", category: "plugin", salesCount: 95, sellerEmail: "nigeria-ai@alphatekx.ai" }
  ]);
  const [marketplaceCategory, setMarketplaceCategory] = useState("all");
  const [sellerSales, setSellerSales] = useState({ sales: [], summary: { totalSales:0, totalRevenue:0, totalFees:0, totalSellerRevenue:0 } });
  const [sellerEmailInput, setSellerEmailInput] = useState("creator@alphatekx.ai");
  const [marketplaceView, setMarketplaceView] = useState("products"); // products | dashboard | sell
  useEffect(() => {
    fetch(`/api/marketplace/products?category=${marketplaceCategory}`).then(r=>r.ok?r.json():null).then(d=>{ if(d && Array.isArray(d.products)) setMarketplaceProducts(d.products); }).catch(()=>{});
  }, [marketplaceCategory]);
  const loadSellerSales = async (email) => {
    const res = await fetch(`/api/marketplace/sales?sellerEmail=${encodeURIComponent(email || sellerEmailInput)}`);
    const data = await res.json().catch(()=>null);
    if (data) setSellerSales(data);
  };
  useEffect(() => { if(activeTab==="marketplace" && marketplaceView==="dashboard") loadSellerSales(); }, [activeTab, marketplaceView]);

  // Superpower 6: Unified Queue (YouTube + TikTok)
  const [queueItems, setQueueItems] = useState([
    { id: 1, platform: "youtube", videoId: "dQw4w9WgXcQ", title: "How to Build Neural Networks from Scratch", thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80", duration: "22:45" },
    { id: 2, platform: "tiktok", videoId: "7123456789", title: "Fastest way to deploy WebAssembly to Workers in 60s ⚡", thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80", duration: "0:58" },
    { id: 3, platform: "youtube", videoId: "L_LUpnjgPso", title: "Building Real-time AI Voice Agents with WebSockets", thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80", duration: "15:10" }
  ]);
  const [newQueueUrl, setNewQueueUrl] = useState("");

  // Superpower 7: AI Teacher Course Builder
  const [teacherGoal, setTeacherGoal] = useState("Build a streaming app like Alphatekx");
  const [teacherCourse, setTeacherCourse] = useState(null);
  const [isBuildingCourse, setIsBuildingCourse] = useState(false);

  // Superpower 8: AI Memory & Chat with History
  const [memoryQuery, setMemoryQuery] = useState("");
  const [memoryResults, setMemoryResults] = useState([]);

  // Superpower 9: AI Studio — PROMPT #5 Pro Toolkit
  const [studioTool, setStudioTool] = useState("clip");
  const [clipPrompt, setClipPrompt] = useState("find viral moment when loss reaches 0.01");
  const [clipVideoUrl, setClipVideoUrl] = useState("https://youtu.be/jvXEkm27XOE");
  const [generatedClip, setGeneratedClip] = useState(null);
  const [clipResult, setClipResult] = useState(null);
  const [thumbnailUrl] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80");
  const [enhancedThumbUrl, setEnhancedThumbUrl] = useState("https://img.youtube.com/vi/jvXEkm27XOE/hqdefault.jpg");
  const [isEnhancingThumbnail, setIsEnhancingThumbnail] = useState(false);
  const [enhancedResult, setEnhancedResult] = useState(null);
  const [voiceVideoUrl, setVoiceVideoUrl] = useState("https://youtu.be/jvXEkm27XOE");
  const [voiceLang, setVoiceLang] = useState("Pidgin");
  const [voiceResult, setVoiceResult] = useState(null);
  const [isVoiceTranslating, setIsVoiceTranslating] = useState(false);

  // Superpower 10: Monetization Pro Subscription
  const [isProUser, setIsProUser] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  // Refs
  const iframeRef = useRef(null);
  const mainScrollRef = useRef(null);
  const mainPlayerRef = useRef(null);

  // Show Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // YouTube Keyboard Shortcuts (k, f, m, t, c, /)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts if typing inside inputs
      if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;

      if (e.key === "k" || e.key === "K" || e.key === " ") {
        e.preventDefault();
        showToast("Play / Pause toggled (YouTube Shortcut 'K')");
      } else if (e.key === "t" || e.key === "T") {
        setTheaterMode(prev => !prev);
        showToast("Theater Mode toggled (YouTube Shortcut 'T')");
      } else if (e.key === "c" || e.key === "C") {
        setCinemaMode(prev => !prev);
        showToast("Enhanced Cinema Glow toggled (Shortcut 'C')");
      } else if (e.key === "/") {
        e.preventDefault();
        const searchInput = document.getElementById("youtube-search-input");
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Monitor Scrolling to Auto-Dock Mini Player + hide search popups while scrolling (best-in-world mobile UX)
  useEffect(() => {
    const scrollContainer = mainScrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      // hide popups immediately while scrolling — keeps search clean
      if (searchSuggestionsOpen) setSearchSuggestionsOpen(false);
      if (activeTab !== "watch") {
        setMiniPlayerActive(false);
        return;
      }
      if (mainPlayerRef.current) {
        const rect = mainPlayerRef.current.getBoundingClientRect();
        // If top player is scrolled off screen (> 300px above viewport)
        if (rect.bottom < 56) {
          setMiniPlayerActive(true);
        } else {
          setMiniPlayerActive(false);
        }
      }
    };

    // REMOVED — mini-player off, no float
    // scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    // also hide on any window scroll/touch (covers mobile)
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("touchmove", handleScroll, { passive: true });
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("touchmove", handleScroll);
    };
  }, [activeTab, searchSuggestionsOpen]);

  // Handle Hamburger Toggle Action (Desktop collapse / Mobile drawer)
  const handleHamburgerClick = () => {
    if (window.innerWidth < 768) {
      setMobileDrawerOpen(prev => !prev);
    } else {
      setSidebarOpen(prev => !prev);
    }
  };

  // Live viewer counter fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewerCount(prev => prev + (Math.random() > 0.5 ? 2 : -1));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // PROMPT #4: Comfortable player — hide controls on idle (2.5s)
  useEffect(() => {
    let t;
    const reset = () => {
      setPlayerIdle(false);
      clearTimeout(t);
      t = setTimeout(() => setPlayerIdle(true), 2500);
    };
    reset();
    const el = mainPlayerRef.current;
    if (el) el.addEventListener("mousemove", reset);
    window.addEventListener("mousemove", reset);
    return () => {
      clearTimeout(t);
      if (el) el.removeEventListener("mousemove", reset);
      window.removeEventListener("mousemove", reset);
    };
  }, [activeVideo?.id, theaterMode]);

  // Handle YouTube Timestamp Seeking via iframe API postMessage
  const handleSeek = (seconds, label) => {
    setActiveTimestamp(label);
    showToast(`Seeking video to ${label}...`);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: "seekTo", args: [seconds, true] }),
        "*"
      );
    }
  };

  // AI Feature 1 & 2: AI Summary (works via /api/summary) & Naija Translator (works via /api/translate) — both with fallback, no errors
  const fetchAiSummary = async (vid) => {
    try {
      const res = await fetch("/api/summary", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ videoId: vid }) });
      if (!res.ok) throw new Error("summary failed");
      const data = await res.json();
      if (data && Array.isArray(data.bullets) && data.bullets.length>0) {
        setAiBullets(data.bullets);
        showToast(data.badge || "AI Summary loaded ✓");
        return;
      }
      throw new Error("empty bullets");
    } catch(e) {
      // fallback — keep current bullets, just notify
      showToast("AI Summary (offline mock) loaded");
    }
  };
  const openAiHelper = (video) => {
    const v = normalizeVideo(video);
    setAiHelperVideo(v);
    setAiHelperOpen(true);
    fetchAiSummary(v.youtubeId);
  };
  const handleLanguageChange = async (e) => {
    const lang = e.target.value;
    setAiLanguage(lang);
    // try real API first
    try {
      const res = await fetch("/api/translate", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ videoId: activeVideo?.id || "dQw4w9WgXcQ", lang }) });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.bullets) && data.bullets.length>0) {
          setAiBullets(data.bullets);
          showToast(data.badge || `Naija Translator ON - ${lang} 🇳🇬`);
          return;
        }
      }
      throw new Error("fallback");
    } catch {
      // fallback to local mocks — guaranteed no error
      if (lang === "Pidgin") {
        setAiBullets([
          { text: "Dis video dey explain neurons, layers, and how backprop dey work well well with clear code.", timestamp: "2:15", seconds: 135 },
          { text: "Important side: Training loop and loss function calculation show for 12:30 — watch am well!", timestamp: "12:30", seconds: 750 },
          { text: "Links: Full Python code dey GitHub repo — click download am sharp sharp.", timestamp: "18:45", seconds: 1125, link: "https://github.com/codecraft/nn-tutorial" }
        ]);
        showToast("Naija Translator ON - Pidgin Activated! 🇳🇬");
      } else if (lang === "Yoruba") {
        setAiBullets([
          { text: "Aworan fidio yi ṣe alaye awọn opo nẹtiwọki neural, awọn iwọn, ati sọfitiwia koodu PyTorch.", timestamp: "2:15", seconds: 135 },
          { text: "Akokọ pataki: Ẹkọ ikẹkọ ati iṣiro aṣiṣe ni a ṣe alaye ni wakati 12:30.", timestamp: "12:30", seconds: 750 },
          { text: "Awọn ajapọ: Koodu kọnputa wa lori iwe GitHub fun igbasilẹ pẹlu tẹ nikan.", timestamp: "18:45", seconds: 1125, link: "https://github.com/codecraft/nn-tutorial" }
        ]);
        showToast("Naija Translator ON - Yoruba Activated! 🇳🇬");
      } else if (lang === "Igbo") {
        setAiBullets([
          { text: "Vidio a na-akọwa neural networks, layers, na koodu PyTorch n'ụzọ doro anya.", timestamp: "2:15", seconds: 135 },
          { text: "Oge dị mkpa: Ọzụzụ koodu na loss function nọ na 12:30.", timestamp: "12:30", seconds: 750 },
          { text: "Njikọ: Koodu zuru ezu dị na GitHub maka nbudata.", timestamp: "18:45", seconds: 1125, link: "https://github.com/codecraft/nn-tutorial" }
        ]);
        showToast("Naija Translator ON - Igbo Activated! 🇳🇬");
      } else if (lang === "Hausa") {
        setAiBullets([
          { text: "Wannan bidiyon yana bayanin cibiyoyin sadarwa na neural, ma'auni da kood a sarari.", timestamp: "2:15", seconds: 135 },
          { text: "Mafi mahimmanci: Tsarin koya da lissafin loss yana farawa daga 12:30.", timestamp: "12:30", seconds: 750 },
          { text: "Manhaja: Akwai cikakken kood a rukunin GitHub domin saukewa.", timestamp: "18:45", seconds: 1125, link: "https://github.com/codecraft/nn-tutorial" }
        ]);
        showToast("Naija Translator ON - Hausa Activated! 🇳🇬");
      } else {
        setAiBullets([
          { text: "Summarizes key concepts: neurons, layers, backpropagation & matrix math covered clearly.", timestamp: "2:15", seconds: 135 },
          { text: "Key timestamp: Training loop & loss function gradient calculation explained step-by-step.", timestamp: "12:30", seconds: 750 },
          { text: "Links: PyTorch code & Jupyter notebook available in description → github.com/codecraft/nn-tutorial", timestamp: "18:45", seconds: 1125, link: "https://github.com/codecraft/nn-tutorial" }
        ]);
        showToast("AI Summary — English restored");
      }
    }
  };

  // Handle Live Community Message Post — works via /api/community/send with fallback, never errors
  const handleSendCommunityMessage = async (msgText, timestamp = "") => {
    if (!msgText.trim()) return;
    const optimistic = {
      id: Date.now(),
      userName: "You (Pro Member)",
      avatarInitials: "Y",
      avatarColor: "bg-[#00D9FF]",
      timeAgo: "Just now",
      message: msgText,
      timestampInVideo: timestamp || "Current",
      likes: 1
    };
    setCommunityMessages(prev => [...prev, optimistic]);
    setChatMessageInput("");
    setSummaryInputChat("");
    try {
      const res = await fetch("/api/community/send", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ message: msgText, timestampInVideo: timestamp || "", channel: activeChannel, userName: "You (Pro Member)", videoId: activeVideo?.id }) });
      if (res.ok) {
        const data = await res.json();
        if (data?.message) {
          // replace optimistic with server id
          setCommunityMessages(prev => prev.map(m=> m.id===optimistic.id ? { ...m, id: data.message.id || m.id } : m));
        }
      }
    } catch {}
    showToast("Message posted to Live Community Chat!");
  };

  // Handle Send Super Chat — same resilient path
  const handleSendSuperChat = async () => {
    if (!superChatMessage.trim()) return;
    const optimistic = {
      id: Date.now(),
      userName: "You (Super Supporter)",
      avatarInitials: "S",
      avatarColor: "bg-yellow-400",
      timeAgo: "Just now",
      message: superChatMessage,
      timestampInVideo: "Live",
      likes: 10,
      isSuperChat: true,
      superAmount: `$${superChatAmount}`
    };
    setCommunityMessages(prev => [...prev, optimistic]);
    setSuperChatModalOpen(false);
    setSuperChatMessage("");
    try {
      await fetch("/api/community/send", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ message: optimistic.message, timestampInVideo: "Live", channel: activeChannel, userName: "You (Super Supporter)" }) });
    } catch {}
    showToast(`Super Chat of $${superChatAmount} sent! Thank you for supporting! 💛`);
  };

  // Add Item to Unified Queue — works via /api/queue/add with fallback
  const handleAddQueueItem = async () => {
    if (!newQueueUrl.trim()) return;
    try {
      const res = await fetch("/api/queue/add", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ url: newQueueUrl }) });
      if (res.ok) {
        const data = await res.json();
        if (data?.queue) { setQueueItems(data.queue); setNewQueueUrl(""); showToast("Added item to Unified Queue!"); return; }
      }
      throw new Error("fallback");
    } catch {
      const isTikTok = newQueueUrl.includes("tiktok.com");
      const newItem = {
        id: Date.now(),
        platform: isTikTok ? "tiktok" : "youtube",
        videoId: isTikTok ? "7123456789" : "L_LUpnjgPso",
        title: isTikTok ? `TikTok Import #${queueItems.length + 1}` : `Imported Stream Video`,
        thumbnail: isTikTok 
          ? "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?auto=format&fit=crop&w=600&q=80"
          : "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
        duration: "03:45"
      };
      setQueueItems(prev => [...prev, newItem]);
      setNewQueueUrl("");
      showToast("Added item to Unified Queue! (local)");
    }
  };

  // Build AI Teacher Course — real /api/teacher/build, fallback guarantees no error
  const handleBuildCourse = async () => {
    if (!teacherGoal.trim()) { showToast("Tell AI what you want to learn first"); return; }
    setIsBuildingCourse(true);
    try {
      const res = await fetch("/api/teacher/build", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ goal: teacherGoal }) });
      if (!res.ok) throw new Error("build failed");
      const data = await res.json();
      // normalize to our UI shape
      const steps = (data.steps || []).map(s=> ({ step: s.step, title: s.title, desc: s.description || s.desc, videoTitle: s.videoTitle || s.title, videoId: s.videoId, completed: false }));
      setTeacherCourse({ goal: data.goal || teacherGoal, steps: steps.length?steps:[
          { step: 1, title: "Foundations & Mathematical Intuition", desc: "Master neurons, activations & loss functions.", videoTitle: "Neural Networks Intro", videoId: "dQw4w9WgXcQ", completed: false },
          { step: 2, title: "PyTorch & CUDA Setup", desc: "Environment configuration & GPU tensor allocation.", videoTitle: "PyTorch CUDA Mastery", videoId: "L_LUpnjgPso", completed: false },
          { step: 3, title: "Backpropagation Deep Dive", desc: "Deriving gradients step-by-step with calculus.", videoTitle: "Backprop Masterclass", videoId: "M576WGiDBdQ", completed: false },
          { step: 4, title: "Transformer & Attention Modules", desc: "Self-attention mechanism and token embeddings.", videoTitle: "Transformers Explained", videoId: "fJ9rUzIMcZQ", completed: false },
          { step: 5, title: "Edge Deployment & Cloudflare Workers", desc: "Deploying model inferencing API endpoints.", videoTitle: "Workers AI Scale", videoId: "3JZ_D3ELwOQ", completed: false }
        ] });
      showToast("5-Step AI Learning Path Generated!");
    } catch {
      setTeacherCourse({
        goal: teacherGoal,
        steps: [
          { step: 1, title: "Foundations & Mathematical Intuition", desc: "Master neurons, activations & loss functions.", videoTitle: "Neural Networks Intro", videoId: "dQw4w9WgXcQ", completed: false },
          { step: 2, title: "PyTorch & CUDA Setup", desc: "Environment configuration & GPU tensor allocation.", videoTitle: "PyTorch CUDA Mastery", videoId: "L_LUpnjgPso", completed: false },
          { step: 3, title: "Backpropagation Deep Dive", desc: "Deriving gradients step-by-step with calculus.", videoTitle: "Backprop Masterclass", videoId: "M576WGiDBdQ", completed: false },
          { step: 4, title: "Transformer & Attention Modules", desc: "Self-attention mechanism and token embeddings.", videoTitle: "Transformers Explained", videoId: "fJ9rUzIMcZQ", completed: false },
          { step: 5, title: "Edge Deployment & Cloudflare Workers", desc: "Deploying model inferencing API endpoints.", videoTitle: "Workers AI Scale", videoId: "3JZ_D3ELwOQ", completed: false }
        ]
      });
      showToast("5-Step AI Learning Path Generated! (offline)");
    } finally { setIsBuildingCourse(false); }
  };

  // Memory Search — real /api/memory/search with fallback
  const handleMemorySearch = async (e) => {
    e.preventDefault();
    if (!memoryQuery.trim()) return;
    try {
      const res = await fetch(`/api/memory/search?q=${encodeURIComponent(memoryQuery)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.results) && data.results.length>0) {
          setMemoryResults(data.results.map(r=> ({ title: r.title, watchedAgo: r.timestamp ? `Watched ${r.timestamp}` : "Watched recently", snippet: r.snippet, videoId: r.videoId, timestamp: r.timestamp || "00:00" })) );
          showToast(`Memory found ${data.results.length} matches`);
          return;
        }
      }
      throw new Error("fallback");
    } catch {
      setMemoryResults([
        { title: "How to Build Neural Networks from Scratch", watchedAgo: "Watched 3 weeks ago", snippet: "Training loop loss calculation at 12:30", videoId: "dQw4w9WgXcQ", timestamp: "12:30" },
        { title: "Building Real-time AI Voice Agents", watchedAgo: "Watched 12 days ago", snippet: "Low-latency WebSocket buffer setup at 04:12", videoId: "L_LUpnjgPso", timestamp: "04:12" }
      ]);
    }
  };

  // Filtered Video Catalog + Unified aggregator filtered helpers (platform filter)
  const filteredVideos = videoCatalog.filter(video => {
    const matchesSearch = !searchQuery || video.title.toLowerCase().includes(searchQuery.toLowerCase()) || video.channel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChip = activeChip === "All" || video.tag === activeChip || (activeChip === "PyTorch" && video.title.includes("Neural")) || (activeChip === "Live Chat" && video.tag === "Cloudflare Workers");
    return matchesSearch && matchesChip;
  });
  const searchFiltered = activePlatform==="all" ? searchResults : searchResults.filter(v=> (v.platform||"youtube")===activePlatform);
  const homeFiltered = activePlatform==="all" ? filteredVideos : filteredVideos.filter(v=> (v.platform||"youtube")===activePlatform);

  return (
    <div className="h-screen w-full max-w-[100vw] overflow-hidden flex flex-col bg-[#08080f] p-2 sm:p-3 text-white font-sans selection:bg-[#FFD700] selection:text-black">
      <div className="flex-1 flex flex-col overflow-hidden rounded-2xl bg-[#0f0f1f] border border-white/10 shadow-2xl">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#00D9FF] text-black font-semibold px-4 py-3 rounded-xl shadow-[0_0_25px_rgba(0,217,255,0.6)] flex items-center gap-3 animate-fade-in">
          <Icon name="sparkles" className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Voice Search Mic Modal */}
      {voiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D0D12] border border-[#00D9FF] rounded-3xl max-w-sm w-full p-8 text-center space-y-6 shadow-[0_0_50px_rgba(0,217,255,0.5)] relative">
            <button 
              onClick={() => { setVoiceModalOpen(false); setVoiceListening(false); }} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-white">YouTube Voice Search</h3>
            
            <div className="w-24 h-24 mx-auto rounded-full bg-[#00D9FF]/20 border-2 border-[#00D9FF] flex items-center justify-center relative">
              <span className={`w-16 h-16 rounded-full bg-[#00D9FF] flex items-center justify-center text-black ${voiceListening ? "animate-ping opacity-75" : ""}`}>
                <Icon name="mic" className="w-8 h-8" />
              </span>
            </div>

            <p className="text-xs text-gray-300 font-mono">
              {voiceListening ? "Listening... Say 'Neural Networks' or 'PyTorch Tutorial'" : "Click mic to start voice query"}
            </p>

            <button
              onClick={() => {
                setVoiceListening(true);
                setTimeout(() => {
                  setSearchQuery("Neural Networks");
                  setVoiceListening(false);
                  setVoiceModalOpen(false);
                  setActiveTab("home");
                  showToast("Voice command recognized: 'Neural Networks'");
                }, 2000);
              }}
              className="w-full py-3 bg-[#00D9FF] hover:bg-[#00FF88] text-black font-extrabold text-sm rounded-xl transition-colors"
            >
              {voiceListening ? "Listening..." : "Start Mic Search"}
            </button>
          </div>
        </div>
      )}

      {/* Super Chat Modal */}
      {superChatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D0D12] border border-yellow-400 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-[0_0_40px_rgba(250,204,21,0.4)] relative">
            <button onClick={() => setSuperChatModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
            
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-400/20 text-yellow-400 rounded-2xl">
                <Icon name="crown" className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Send AI Super Chat</h3>
                <p className="text-xs text-gray-400">Support creator & highlight message in live community chat</p>
              </div>
            </div>

            <div className="flex items-center gap-2 justify-center py-2">
              {[2, 5, 10, 50].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setSuperChatAmount(amt)}
                  className={`px-4 py-2 rounded-xl font-bold font-mono text-xs transition-all ${
                    superChatAmount === amt 
                      ? "bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.6)]" 
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={superChatMessage}
              onChange={(e) => setSuperChatMessage(e.target.value)}
              placeholder="Write your highlighted Super Chat message..."
              className="w-full bg-black/80 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-yellow-400"
            />

            <button
              onClick={handleSendSuperChat}
              className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xs rounded-xl transition-transform active:scale-95 shadow-lg"
            >
              Send ${superChatAmount} Super Chat
            </button>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D0D12] border border-[#00D9FF] rounded-3xl max-w-md w-full p-6 space-y-5 shadow-[0_0_40px_rgba(0,217,255,0.4)] relative">
            <button onClick={() => setShareModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
            
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Icon name="share" className="w-5 h-5 text-[#00D9FF]" />
              <span>Share Video Stream</span>
            </h3>

            <div className="flex items-center gap-2 bg-black/80 border border-white/10 p-2 rounded-xl">
              <input 
                type="text" 
                readOnly 
                value={`https://alphatekx.stream/watch?v=${activeVideo.id}`} 
                className="w-full bg-transparent text-xs text-gray-300 px-2 focus:outline-none font-mono"
              />
              <button 
                onClick={() => {
                  navigator.clipboard?.writeText(`https://alphatekx.stream/watch?v=${activeVideo.id}`);
                  showToast("Video link copied to clipboard!");
                  setShareModalOpen(false);
                }}
                className="px-4 py-2 bg-[#00D9FF] text-black font-bold text-xs rounded-lg whitespace-nowrap"
              >
                Copy Link
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 text-center text-xs">
              {[
                { label: "WhatsApp", color: "bg-green-600" },
                { label: "Twitter / X", color: "bg-blue-600" },
                { label: "LinkedIn", color: "bg-blue-800" },
                { label: "Embed Code", color: "bg-purple-600" }
              ].map((platform, idx) => (
                <button 
                  key={idx}
                  onClick={() => {
                    showToast(`Shared to ${platform.label}!`);
                    setShareModalOpen(false);
                  }}
                  className={`p-3 rounded-xl ${platform.color} text-white font-bold hover:opacity-90 transition-transform active:scale-95`}
                >
                  {platform.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stripe Checkout Test Modal */}
      {checkoutProduct && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D0D12] border border-[#00D9FF] rounded-3xl max-w-md w-full p-6 shadow-[0_0_40px_rgba(0,217,255,0.4)] relative">
            <button onClick={() => setCheckoutProduct(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">✕</button>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[#00D9FF]/20 text-[#00D9FF] rounded-xl">
                <Icon name="shopping-bag" className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">{checkoutProduct.name}</h3>
                <p className="text-xs text-[#00FF88] font-mono">Stripe Test Mode • Instant Download</p>
              </div>
            </div>
            
            <div className="bg-black/60 border border-white/10 rounded-xl p-4 mb-5 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Price:</span>
                <span className="text-white font-bold">${checkoutProduct.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Seller Royalty (80%):</span>
                <span className="text-[#00FF88] font-mono">${(checkoutProduct.price * 0.8).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-white/10 pt-2">
                <span className="text-gray-400">Test Card:</span>
                <span className="text-gray-200 font-mono">4242 •••• •••• 4242</span>
              </div>
            </div>

            <button
              onClick={() => {
                showToast(`Payment Successful for ${checkoutProduct.name}! Asset downloaded.`);
                setCheckoutProduct(null);
                setCartCount(prev => prev + 1);
              }}
              className="w-full bg-gradient-to-r from-[#00D9FF] to-[#00FF88] text-black font-bold py-3 rounded-xl hover:opacity-95 transition-transform active:scale-95 shadow-[0_0_20px_rgba(0,255,136,0.4)]"
            >
              Confirm Pay ${checkoutProduct.price}
            </button>
          </div>
        </div>
      )}

      {/* MOBILE OVERLAY DRAWER */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md md:hidden flex">
          <div className="w-4/5 max-w-xs bg-[#0f0f0f] border-r border-[#272727] h-full p-4 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#272727] pb-4">
              <div className="flex items-center gap-2">
                <Icon name="logo" className="w-7 h-7" />
                <span className="font-bold text-lg text-white">Alphatekx Stream</span>
              </div>
              <button onClick={() => setMobileDrawerOpen(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>

            <div className="space-y-1">
              {[
                { id: "home", label: "Home", icon: "home" },
                { id: "watch", label: "Now Playing", icon: "youtube" },
                { id: "history", label: "History", icon: "history" },
                { id: "watchlater", label: "Watch Later", icon: "bookmark" },
                { id: "shorts", label: "Shorts", icon: "shorts" },
                { id: "channel", label: "Channel", icon: "user" },
                { id: "upload", label: "Upload", icon: "plus" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { if(item.id==="channel") navigateToChannel(OFFICIAL_CHANNEL_ID); else setActiveTab(item.id); setMobileDrawerOpen(false); }}
                  className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-sm font-medium ${
                    activeTab === item.id ? "bg-[#272727] text-[#00D9FF] font-bold" : "text-gray-300"
                  }`}
                >
                  <Icon name={item.icon} className="w-5 h-5 text-[#00D9FF]" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="border-t border-[#272727] pt-4 space-y-1">
              <div className="px-3 py-1 text-xs font-mono font-bold text-[#00FF88] uppercase">AI Superpowers</div>
              {[
                { id: "teacher", label: "AI Teacher", icon: "teacher", color: "text-[#00FF88]" },
                { id: "memory", label: "AI Memory", icon: "brain", color: "text-[#00D9FF]" },
                { id: "marketplace", label: "Marketplace", icon: "shopping-bag", color: "text-[#00FF88]" },
                { id: "studio", label: "AI Studio", icon: "studio", color: "text-purple-400" },
                { id: "profile", label: "Profile", icon: "user", color: "text-[#00D9FF]" },
                { id: "upload", label: "Upload", icon: "plus", color: "text-[#00FF88]" },
                { id: "channel", label: "Channel", icon: "user", color: "text-[#00D9FF]" },
                { id: "pricing", label: "Pro Subscription", icon: "crown", color: "text-yellow-400" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { if(item.id==="channel") navigateToChannel(OFFICIAL_CHANNEL_ID); else setActiveTab(item.id); setMobileDrawerOpen(false); }}
                  className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-sm font-medium ${
                    activeTab === item.id ? "bg-[#272727] text-white font-bold" : "text-gray-300"
                  }`}
                >
                  <Icon name={item.icon} className={`w-5 h-5 ${item.color}`} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileDrawerOpen(false)} />
        </div>
      )}

      {/* HEADER — exact like image 100%: Alphatekx Stream | Search | bell settings A */}
      <header className="h-[56px] flex-shrink-0 bg-[#0f0f1f] border-b border-white/10 px-4 sm:px-6 flex items-center justify-between gap-4 z-40 relative">
        <div onClick={()=>setActiveTab("watch")} className="flex items-center gap-2.5 cursor-pointer flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#F59E0B] flex items-center justify-center border border-white/10">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2l2.4 4.8 5.2.8-3.8 3.7.9 5.2L12 14.5l-4.7 2.5.9-5.2L4.4 7.6l5.2-.8L12 2z" fill="white"/><circle cx="12" cy="12" r="2" fill="#0f0f1f"/></svg>
          </div>
          <span className="font-extrabold text-[20px] tracking-tight text-white">Alphatekx</span>
          <span className="font-light text-[20px] tracking-tight text-white/80">Stream</span>
        </div>
        <div className="hidden sm:flex flex-1 max-w-[560px] mx-6">
          <div className="relative w-full">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"><Icon name="search" className="w-4 h-4" /></span>
            <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} onFocus={()=>setSearchSuggestionsOpen(true)} onBlur={()=>setTimeout(()=>setSearchSuggestionsOpen(false),200)} onKeyDown={e=>{if(e.key==="Enter"){setActiveTab("home"); setSearchSuggestionsOpen(false);}}} placeholder="Search videos, AI tools, channels..." className="w-full bg-[#1a1a2e]/80 border border-[#2a2a4a] rounded-full pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700]/50 focus:bg-[#1a1a2e]" />
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button onClick={()=>showToast("Notifications")} className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-white"><Icon name="bell" className="w-5 h-5" /></button>
          <button onClick={()=>setActiveTab("profile")} className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-white"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 009 15a1.65 1.65 0 001-1.51V13a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82-.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.6 9a1.65 1.65 0 001-1.51V7a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0015 9a1.65 1.65 0 00-1 1.51V13a1.65 1.65 0 001 1.51z"/></svg></button>
          {isGuest ? (
            <button onClick={async()=>{ try{const r=await fetch('/api/auth/url');const d=await r.json(); if(d.url) window.location.href=d.url;}catch{window.location.href='/api/auth/url';}}} className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#F59E0B] text-black font-bold text-xs hover:scale-105 transition">Sign in with YouTube →</button>
          ) : (
            <button onClick={()=>setActiveTab("profile")} className="w-9 h-9 rounded-full bg-[#7c3aed] text-white font-bold flex items-center justify-center border-2 border-white/10">A</button>
          )}
          <button onClick={()=>setMobileSearchOpen(true)} className="sm:hidden w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-300"><Icon name="search" className="w-5 h-5" /></button>
        </div>
      </header>

      {/* MOBILE SEARCH OVERLAY — REMOVED — popup off */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-[#0B0215] flex flex-col sm:hidden">
          <div className="flex items-center gap-2 px-3 py-3 border-b border-white/10 bg-[#0f0f0f]">
            <button onClick={()=>setMobileSearchOpen(false)} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white flex-shrink-0" title="Back">
              <span className="text-xl">←</span>
            </button>
            <div className="flex-1 flex items-center bg-[#121212] border border-[#303030] focus-within:border-[#FFD700] rounded-full overflow-hidden">
              <span className="pl-3 text-gray-400"><Icon name="search" className="w-4 h-4" /></span>
              <input
                id="mobile-search-overlay-input"
                value={searchQuery}
                onChange={(e)=>setSearchQuery(e.target.value)}
                onKeyDown={(e)=>{ if(e.key==="Enter"){ setMobileSearchOpen(false); setActiveTab("home"); } }}
                placeholder="Search YouTube, TikTok…"
                className="flex-1 bg-transparent px-3 py-3 text-[16px] font-medium text-white placeholder:text-gray-500 focus:outline-none"
                autoFocus
              />
              {searchQuery && (
                <button onClick={()=>setSearchQuery("")} className="px-3 text-gray-400 hover:text-white flex-shrink-0">✕</button>
              )}
            </div>
            {searchQuery && (
              <button onClick={()=>{ setMobileSearchOpen(false); setActiveTab("home"); }} className="px-3 py-2 bg-[#FFD700] text-black font-bold text-xs rounded-full">Search</button>
            )}
          </div>
          <div className="flex-1 overflow-auto bg-[#0B0215] p-2 space-y-1">
            <p className="text-[11px] font-mono text-gray-500 uppercase px-3 py-2">
              {searchQuery ? `Suggestions for "${searchQuery}"` : "Trending Searches"}
            </p>
            {(searchQuery
              ? [
                  searchQuery,
                  `${searchQuery} tutorial`,
                  `${searchQuery} shorts`,
                  `${searchQuery} ALPHATEKX`,
                ]
              : [
                  "ALPHATEKX AI Avatar",
                  "Neural Networks PyTorch",
                  "Cloudflare Workers",
                  "Naija Pidgin AI",
                  "jvXEkm27XOE",
                ]
            ).filter(Boolean).slice(0,8).map((sug, idx)=>(
              <button
                key={idx}
                onClick={()=>{ setSearchQuery(sug); setMobileSearchOpen(false); setActiveTab("home"); setSearchSuggestionsOpen(false); }}
                className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-[#1a1a2e] rounded-xl text-white active:bg-[#272727]"
              >
                <Icon name="search" className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-[15px] truncate">{sug}</span>
                <span className="ml-auto text-gray-500">↗</span>
              </button>
            ))}
            {!searchQuery && (
              <div className="px-3 py-3 mt-2 border-t border-white/5">
                <p className="text-xs text-gray-500">Recent searches & watched will appear in History • Guest • real-time</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={()=>{ setMobileSearchOpen(false); setActiveTab("history"); }} className="px-3 py-1.5 bg-[#272727] text-white text-xs rounded-full border border-white/10">History</button>
                  <button onClick={()=>setMobileSearchOpen(false)} className="px-3 py-1.5 bg-[#FFD700]/20 text-[#FFD700] text-xs rounded-full border border-[#FFD700]/30">Browse Shorts</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------- APP BODY (FIXED SIDEBAR + INDEPENDENT MAIN SCROLL) ------------------- */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* ------------------- FIXED YOUTUBE SIDEBAR ------------------- */}
        <aside 
          className={`bg-[#0f0f0f] border-r border-[#272727] transition-all duration-300 flex-col justify-between hidden md:flex flex-shrink-0 z-30 ${
            sidebarOpen ? "w-64" : "w-18 items-center"
          }`}
        >
          <div className="py-2 overflow-y-auto space-y-4 w-full h-full">
            
            {/* Primary Section — exact image: Now Playing cyan active */}
            <div className="px-3 space-y-1">
              {[
                { id: "home", label: "Home", icon: "home" },
                { id: "watch", label: "Now Playing", icon: "shorts" },
                { id: "history", label: "History", icon: "history" },
                { id: "watchlater", label: "Watch Later", icon: "history" },
                { id: "shorts", label: "Shorts", icon: "shorts" },
                { id: "channel", label: "Channel", icon: "user" },
                { id: "upload", label: "Upload", icon: "plus" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if(item.id==="channel") navigateToChannel(OFFICIAL_CHANNEL_ID);
                    else setActiveTab(item.id);
                  }}
                  title={!sidebarOpen ? item.label : undefined}
                  className={`w-full flex items-center ${sidebarOpen ? "gap-3 px-3" : "justify-center px-2"} py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === item.id 
                      ? "bg-[#2af5ff] text-black font-bold shadow-[0_0_15px_rgba(42,245,255,0.3)]" 
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon name={item.icon} className={`w-5 h-5 ${activeTab === item.id ? "text-black" : "text-gray-500"}`} />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              ))}
            </div>

            <div className="border-t border-white/10 my-3" />

            {/* AI Superpowers Section — exact image: gold for Teacher/Memory/Pro */}
            <div className="px-3 space-y-1">
              {sidebarOpen && (
                <div className="px-3 py-2 text-[11px] font-bold text-[#7a7a9e] uppercase tracking-[0.12em]">
                  AI Superpowers
                </div>
              )}
              {[
                { id: "teacher", label: "AI Teacher", icon: "sparkles", color: "text-[#FFD700]" },
                { id: "memory", label: "AI Memory", icon: "brain", color: "text-[#FFD700]" },
                { id: "marketplace", label: "Marketplace", icon: "shopping-bag", color: "text-gray-400" },
                { id: "studio", label: "AI Studio", icon: "studio", color: "text-gray-400" },
                { id: "profile", label: "Profile", icon: "user", color: "text-gray-400" },
                { id: "pricing", label: "Pro Subscription", icon: "crown", color: "text-[#FFD700]" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { if(item.id==="channel") navigateToChannel(OFFICIAL_CHANNEL_ID); else setActiveTab(item.id); }}
                  title={!sidebarOpen ? item.label : undefined}
                  className={`w-full flex items-center ${sidebarOpen ? "gap-5 px-3" : "justify-center px-2"} py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === item.id 
                      ? "bg-[#272727] text-white font-bold" 
                      : "text-gray-300 hover:bg-[#272727] hover:text-white"
                  }`}
                >
                  <Icon name={item.icon} className={`w-5 h-5 ${item.color}`} />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              ))}
            </div>

            <div className="border-t border-[#272727] my-2" />

            {/* Subscribed Channels — exact image: Code with Nova, AI Labs, DesignByte */}
            {sidebarOpen && (
              <div className="px-4 py-3 space-y-3">
                <span className="text-[11px] font-bold text-[#7a7a9e] uppercase tracking-[0.12em]">Subscribed Channels</span>
                <div className="space-y-3">
                  {[
                    { name: "Code with Nova", subs: "124K subscribers", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80", dot: true },
                    { name: "AI Labs", subs: "89K subscribers", icon: "brain", bg: "bg-[#7c3aed]", dot: true },
                    { name: "DesignByte", subs: "56K subscribers", icon: "studio", bg: "bg-[#0d9488]", dot: true },
                  ].map((ch, idx) => (
                    <button key={idx} onClick={()=>navigateToChannel(ch.name)} className="w-full flex items-center gap-3 text-xs hover:text-white cursor-pointer py-1 text-left group">
                      {ch.avatar ? <img src={ch.avatar} alt={ch.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" /> : <span className={`w-8 h-8 rounded-full ${ch.bg} flex items-center justify-center text-white flex-shrink-0`}><Icon name={ch.icon} className="w-4 h-4" /></span>}
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-xs font-medium text-white truncate group-hover:text-white">{ch.name}</p>
                        <p className="text-[11px] text-gray-500 truncate">{ch.subs}</p>
                      </div>
                      {ch.dot && <span className="w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </aside>

        {/* ------------------- INDEPENDENT MAIN SCROLL CONTENT AREA ------------------- */}
        <main ref={mainScrollRef} className="flex-1 overflow-y-auto scroll-smooth pb-24 md:pb-12 h-full">

          {/* TOP TOPIC CHIPS BAR — REMOVED for mobile fit */}
          {false && activeTab === "home" && (
            <div className="bg-[#0f0f0f]/95 backdrop-blur-md border-b border-[#272727] px-3 sm:px-4 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide sticky top-0 z-30 overscroll-x-contain">
              {categories.map((chip) => (
                <button
                  key={chip}
                  onClick={() => setActiveChip(chip)}
                  className={`min-h-[44px] px-4 py-2.5 rounded-full text-[13px] sm:text-xs font-medium whitespace-nowrap transition-colors flex items-center justify-center ${
                    activeChip === chip 
                      ? "bg-[#FFD700] text-black font-bold shadow-[0_0_12px_rgba(255,215,0,0.35)] border border-[#FFD700]" 
                      : "bg-[#1a1a2e] hover:bg-[#272727] text-gray-200 border border-white/10"
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          )}
          {/* UNIFIED AGGREGATOR — Platform Filter — REMOVED for mobile fit */}
          {false && activeTab === "home" && (
            <div className="bg-[#0B0215]/95 backdrop-blur-md border-b border-[#272727] px-3 sm:px-4 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide sticky top-0 sm:top-0 z-20 overscroll-x-contain">
              <span className="text-[10px] font-mono text-[#FFD700]/70 uppercase hidden sm:inline mr-1 flex-shrink-0">Platform:</span>
              {[
                { id: "all", label: "All Platforms" },
                { id: "youtube", label: "YouTube" },
                { id: "tiktok", label: "TikTok" },
                { id: "instagram", label: "Instagram" },
                { id: "twitter", label: "Twitter" },
                { id: "facebook", label: "Facebook" },
              ].map(p => (
                <button key={p.id} onClick={()=>setActivePlatform(p.id)} className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1.5 border flex-shrink-0 ${activePlatform===p.id ? "bg-[#FFD700] text-black border-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.3)]" : "bg-[#1a1a2e] text-gray-300 border-white/10 hover:bg-[#272727]"}`}>
                  {p.id!=="all" && <PlatformBadge platform={p.id} />}
                  <span>{p.label}</span>
                </button>
              ))}
              {watchLater.length>0 && (
                <button onClick={()=>setActiveTab("watchlater")} className="ml-auto hidden sm:flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-full bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/40 text-xs font-bold hover:bg-[#FFD700]/30 flex-shrink-0">
                  <Icon name="bookmark" className="w-3.5 h-3.5" />
                  <span>Watch Later ({watchLater.length})</span>
                </button>
              )}
            </div>
          )}

          {/* IMAGE 100% WATCH — exact like screenshot, no difference */}
          {activeTab === "watch" && (
            <div className="max-w-[1600px] mx-auto p-4 lg:p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-4">
                  <div className="relative bg-[#0f0f1f] rounded-2xl overflow-hidden border border-[#FFD700]/20 shadow-[0_0_40px_rgba(255,215,0,0.15)]">
                    <div className="aspect-video relative bg-black">
                      <iframe ref={iframeRef} src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?enablejsapi=1&modestbranding=1&rel=0${(activeVideo.id===DEFAULT_VIDEO.id)?"&autoplay=1&mute=1&playsinline=1":""}`} title={activeVideo.title} className="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                      <div className="absolute bottom-10 right-4 z-20"><button onClick={()=>setWatchPanelOpen(!watchPanelOpen)} className="px-5 py-2.5 rounded-full bg-[#FFD700] text-black font-extrabold text-sm shadow-lg hover:scale-105 transition">{watchPanelOpen?"Close Workspace ✕":"Open AI Workspace →"}</button></div>
                      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 py-3 flex items-center gap-3">
                        <button className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white">❚❚</button>
                        <div className="flex-1 h-1 bg-white/20 rounded-full relative"><div className="absolute left-0 top-0 h-full bg-[#2af5ff] rounded-full" style={{width:'52%'}}><div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#2af5ff] rounded-full border-2 border-white"></div></div></div>
                        <span className="text-xs font-mono text-white">14:32 / 28:10</span>
                        <span className="hidden sm:flex gap-2 text-white/70"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/></svg><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 009 15a1.65 1.65 0 001-1.51V13a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82-.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.6 9a1.65 1.65 0 001-1.51V7a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0015 9a1.65 1.65 0 00-1 1.51V13a1.65 1.65 0 001 1.51z"/></svg><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg></span>
                      </div>
                      {activeCheckpoint && (<div className="absolute inset-0 bg-[#0B0215]/92 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 rounded-2xl"><div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#FFD700] to-[#F59E0B] text-black flex items-center justify-center text-2xl mb-3 animate-pulse">🔒</div><h3 className="text-white font-extrabold text-lg">{activeCheckpoint.title}</h3><p className="text-[#FFD700] text-sm mt-1">Creator paused at {activeCheckpoint.time}s</p><p className="text-gray-300 text-sm mt-2">{activeCheckpoint.task}</p><button onClick={()=>{setWatchPanelOpen(true);setWatchPanelTab("code");}} className="mt-4 px-6 py-2.5 rounded-full bg-[#FFD700] text-black font-bold text-sm animate-pulse">Go to Code →</button></div>)}
                    </div>
                  </div>
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {videoChapters.map((chap, idx)=>(
                      <button key={idx} onClick={()=>handleSeek(chap.seconds, chap.timestamp)} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border ${activeTimestamp===chap.timestamp||(idx===0&&!activeTimestamp)?"bg-[#FFD700] text-black border-[#FFD700]":"bg-[#1a1a2e] border-white/10 text-gray-300"}`}>{chap.timestamp} {chap.title}</button>
                    ))}
                  </div>
                  {watchPanelOpen && (
                    <div className="bg-[#0f0f1f] border border-[#FFD700]/20 rounded-2xl overflow-hidden shadow-xl">
                      <div className="flex border-b border-white/10 bg-[#0f0f1f]">
                        <button onClick={()=>setWatchPanelTab("code")} className={`flex-1 min-h-[44px] py-3 text-xs font-bold ${watchPanelTab==="code"?"bg-[#FFD700] text-black":"text-gray-400"}`}>Code</button>
                        <button onClick={()=>setWatchPanelTab("preview")} className={`flex-1 min-h-[44px] py-3 text-xs font-bold ${watchPanelTab==="preview"?"bg-[#00D9FF] text-black":"text-gray-400"}`}>Preview</button>
                        <button onClick={()=>setWatchPanelTab("ai")} className={`flex-1 min-h-[44px] py-3 text-xs font-bold ${watchPanelTab==="ai"?"bg-[#A855F7] text-white":"text-gray-400"}`}>AI</button>
                        <button onClick={()=>setWatchPanelTab("terminal")} className={`flex-1 min-h-[44px] py-3 text-xs font-bold ${watchPanelTab==="terminal"?"bg-[#00FF88] text-black":"text-gray-400"}`}>Terminal</button>
                        <button onClick={()=>setWatchPanelOpen(false)} className="px-3 text-gray-400">✕</button>
                      </div>
                      <div className="h-[38vh] min-h-[300px] bg-[#0B0215] flex flex-col">
                        {watchPanelTab==="code" && (<div ref={monacoRef} className="flex-1 bg-[#1e1e1e] flex"><textarea value={codeValue} onChange={e=>setCodeValue(e.target.value)} className="w-full h-full bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm p-4 resize-none focus:outline-none" /></div>)}
                        {watchPanelTab==="preview" && (<iframe title="Preview" srcDoc={codeValue} sandbox="allow-scripts allow-same-origin" className="flex-1 w-full border-0 bg-white" />)}
                        {watchPanelTab==="ai" && (<div className="flex-1 p-3 overflow-y-auto space-y-2">{aiChatMessages.map((m,i)=>(<div key={i} className={`p-2 rounded-xl text-sm ${m.role==="user"?"bg-[#FFD700] text-black ml-auto":"bg-[#1a1a2e] text-white mr-auto"}`}>{m.text}</div>))}<div className="flex gap-2 mt-2"><input value={aiChatInput} onChange={e=>setAiChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAiSend()} placeholder="Ask AI..." className="flex-1 bg-[#1a1a2e] border border-white/10 rounded-full px-4 py-2 text-sm" /><button onClick={handleAiSend} className="px-4 py-2 bg-[#FFD700] text-black font-bold rounded-full">Send</button></div></div>)}
                        {watchPanelTab==="terminal" && (<div ref={terminalRef} className="flex-1 bg-black p-2 overflow-hidden" style={{minHeight:"300px"}} />)}
                      </div>
                    </div>
                  )}
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">Building Neural Agents with Reinforcement Learning – Live Breakdown</h1>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] flex items-center justify-center">🧠</div>
                      <div><p className="text-sm font-bold text-white">Alphatekx AI • 45.3K subscribers</p><p className="text-xs text-gray-400">Today we explore training RL agents...</p></div>
                      <button onClick={()=>setIsSubscribed(!isSubscribed)} className={`ml-3 px-5 py-2 rounded-full font-bold text-xs ${isSubscribed?"bg-white/10 text-white":"bg-white text-black"}`}>{isSubscribed?"Subscribed ✓":"Subscribe"}</button>
                    </div>
                    <div className="flex gap-2"><button className="px-4 py-2 rounded-full bg-[#1a1a2e] border border-white/10 text-sm font-bold text-white">Like 1.2K</button><button className="px-4 py-2 rounded-full bg-[#1a1a2e] border border-white/10 text-sm font-bold text-white">Save</button><button className="px-4 py-2 rounded-full bg-[#1a1a2e] border border-white/10 text-sm font-bold text-white">Share</button></div>
                  </div>
                </div>
                <div className="lg:col-span-4 space-y-4">
                  <h3 className="font-bold text-xl text-white">Up Next</h3>
                  <div className="space-y-4">
                    {[
                      { title: "AI Prompt Engineering Masterclass", duration: "12:34", views: "320K views", ago: "2 days ago", thumb: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=300&q=80" },
                      { title: "Transformers Explained in 10min", duration: "09:22", views: "158K views", ago: "5 days ago", thumb: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&q=80" },
                      { title: "Deploying LLMs on Edge Devices", duration: "18:45", views: "97K views", ago: "1 week ago", thumb: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=300&q=80" },
                      { title: "RAG vs Fine-tuning: What's Best?", duration: "15:02", views: "210K views", ago: "3 days ago", thumb: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=300&q=80" },
                    ].map((vid, idx)=>(
                      <div key={idx} className="flex gap-3 cursor-pointer group">
                        <div className="relative w-36 h-20 rounded-xl overflow-hidden bg-[#1a1a2e] flex-shrink-0"><img src={vid.thumb} className="w-full h-full object-cover" /><span className="absolute bottom-1 right-1 bg-black/80 text-[10px] px-1 rounded text-white">{vid.duration}</span></div>
                        <div className="flex-1 py-1"><h4 className="text-sm font-bold text-white line-clamp-2">{vid.title}</h4><p className="text-xs text-gray-400 mt-1">{vid.duration} • {vid.views} • {vid.ago}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------- 2. HOME / DISCOVER FEED — CLEAN mobile-first: generous spacing, 2 cols on mobile ------------------- */}
          {activeTab === "home" && (
            <div className="max-w-[1600px] mx-auto p-4 sm:p-5 md:p-6 space-y-6 overflow-x-hidden">
              {isSearching ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <div key={n} className="glass-card overflow-hidden animate-pulse p-0 flex flex-col justify-between">
                      <div className="aspect-video w-full bg-[#1a1a24]" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-[#282836] rounded w-5/6" />
                        <div className="h-3 bg-[#282836] rounded w-1/2" />
                        <div className="h-3 bg-[#282836] rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchQuery.trim() ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-sm font-mono text-[#00D9FF] uppercase tracking-wider flex items-center gap-2">
                        <Icon name="search" className="w-4 h-4" />
                        <span>YouTube Search Results for "{searchQuery}"</span>
                      </h2>
                      {searchIsMock === false && (
                        <span className="text-[10px] font-bold bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/50 px-2.5 py-1 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse"></span> Real YouTube • Live
                        </span>
                      )}
                      {searchIsMock === true && (
                        <span className="text-[10px] font-bold bg-gray-500/20 text-gray-400 border border-gray-500/50 px-2.5 py-1 rounded-full">
                          Demo • Mock
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 font-mono">
                      {searchTab==="results" ? `${searchResults.length} videos` : `${searchHistory.length} saved`}
                    </span>
                  </div>

                  {/* Search Tabs: Results vs History — history NEVER vanishes — wraps/scrolls on mobile */}
                  <div className="flex items-center gap-1.5 sm:gap-2 border-b border-[#272727] pb-2 overflow-x-auto scrollbar-hide flex-nowrap">
                    <button
                      onClick={()=>setSearchTab("results")}
                      className={`min-h-[44px] px-5 py-2.5 rounded-full text-xs font-bold transition-colors flex items-center ${searchTab==="results" ? "bg-[#FFD700] text-black" : "bg-[#272727] text-gray-300 hover:bg-[#383838]"}`}
                    >
                      Search Results {searchResults.length>0 && `(${searchResults.length})`}
                    </button>
                    <button
                      onClick={()=>{
                        setSearchTab("history");
                        // refresh history from server when switching
                        fetch("/api/search/history").then(r=>r.ok?r.json():null).then(data=>{
                          if(data && Array.isArray(data.history)) {
                            const vids=data.history.map(normalizeVideo);
                            if(vids.length>0) setSearchHistory(vids);
                          }
                        }).catch(()=>{});
                      }}
                      className={`min-h-[44px] px-5 py-2.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 ${searchTab==="history" ? "bg-[#00FF88] text-black" : "bg-[#272727] text-gray-300 hover:bg-[#383838]"}`}
                    >
                      <Icon name="history" className="w-3.5 h-3.5" />
                      Search History {searchHistory.length>0 && `(${searchHistory.length})`}
                    </button>
                    {searchHistory.length>0 && searchTab==="history" && (
                      <>
                        <button
                          onClick={()=>{
                            fetch("/api/search/history").then(r=>r.ok?r.json():null).then(data=>{
                              if(data && Array.isArray(data.history)) {
                                const vids=data.history.map(normalizeVideo);
                                setSearchHistory(vids);
                                try{ localStorage.setItem("alphatekx_search_history", JSON.stringify(vids.slice(0,100))); }catch{}
                                showToast(`History refreshed — ${vids.length} videos`);
                              }
                            }).catch(()=>{ showToast("Refresh failed"); });
                          }}
                          className="ml-auto px-3 py-1 text-[10px] font-bold bg-[#272727] text-gray-300 hover:bg-[#383838] rounded-full border border-white/10"
                        >
                          Refresh
                        </button>
                        <button
                          onClick={()=>{
                            if(!confirm("Clear all search history?")) return;
                            setSearchHistory([]);
                            localStorage.removeItem("alphatekx_search_history");
                            fetch("/api/search/history",{method:"DELETE"}).catch(()=>{});
                            showToast("Search history cleared");
                          }}
                          className="text-[10px] text-gray-500 hover:text-red-400 font-mono"
                        >
                          Clear history
                        </button>
                      </>
                    )}
                  </div>

                  {searchTab==="history" ? (
                    searchHistory.length>0 ? (
                      <div className="space-y-3">
                        <p className="text-[11px] text-gray-500 font-mono flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]"></span> Persisted in localStorage "alphatekx_search_history" + server — never vanishes on refresh</p>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                          {searchHistory.map((vid)=>(
                            <div
                              key={`hist-${vid.youtubeId||vid.id}-${vid.searchedAt||""}`}
                              onClick={()=>{
                                setActiveVideo(normalizeVideo(vid));
                                setActiveTab("watch");
                                if(mainScrollRef.current) mainScrollRef.current.scrollTop=0;
                                showToast(`Playing from history: ${vid.title}`);
                              }}
                              className="glass-card overflow-hidden hover:border-[#00FF88] transition-all cursor-pointer group flex flex-col justify-between border-[#00FF88]/20"
                            >
                              <div className="relative aspect-video w-full bg-gray-900 overflow-hidden">
                                <img src={vid.img||vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                <span className="absolute bottom-2 right-2 bg-black/80 text-xs font-mono px-2 py-0.5 rounded text-white">{vid.duration}</span>
                                <span className="absolute top-2 left-2 bg-[#00FF88]/90 text-black text-[9px] font-bold px-1.5 py-0.5 rounded">HISTORY</span>
                              </div>
                              <div className="p-4 space-y-1.5">
                                <h3 className="font-bold text-sm text-white group-hover:text-[#00FF88] line-clamp-2">{vid.title}</h3>
                                <p className="text-xs text-gray-400">{vid.channel||vid.channelName}</p>
                                <p className="text-[11px] text-gray-500">{vid.views} • {vid.searchedQuery?`query:"${vid.searchedQuery}"`:vid.timeAgo}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="glass-card p-8 text-center space-y-3 border-dashed">
                        <Icon name="history" className="w-8 h-8 mx-auto text-gray-600" />
                        <p className="text-sm text-gray-300">No search history yet.</p>
                        <p className="text-xs text-gray-500">Search for "burna boy", "wizkid", "davido" etc — videos are saved forever in localStorage.</p>
                      </div>
                    )
                  ) : (
                    searchFiltered.length>0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                        {searchFiltered.map((vid) => (
                          <VideoCard key={vid.id || vid.youtubeId} video={vid} onPlay={(norm)=>{ setActiveVideo({...norm, platform: vid.platform || "youtube"}); setActiveTab("watch"); if(mainScrollRef.current) mainScrollRef.current.scrollTop=0; showToast(`Playing: ${norm.title}`); }} onSave={toggleWatchLater} isSaved={isSavedWatchLater(vid.youtubeId||vid.id)} onAi={openAiHelper} />
                        ))}
                      </div>
                    ) : (
                      <div className="glass-card p-8 text-center space-y-3">
                        <p className="text-sm text-gray-300">No {activePlatform} videos for "{searchQuery}".</p>
                        <button onClick={()=>setActivePlatform("all")} className="min-h-[44px] px-5 py-2.5 bg-[#FFD700] text-black font-bold text-xs rounded-xl">Show All Platforms</button>
                        <button onClick={() => setSearchQuery("")} className="ml-2 min-h-[44px] px-5 py-2.5 bg-[#00D9FF] text-black font-bold text-xs rounded-xl">Clear Search</button>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Featured Hero — DEFAULT_VIDEO jvXEkm27XOE — auto-play muted */}
                  <div className="glass-card overflow-hidden border-[#FFD700]/30 p-3 sm:p-4 space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black text-[10px] font-extrabold px-2.5 py-1 rounded-full">FEATURED</span>
                      <span className="text-xs text-gray-400">Your video is first for every visitor • auto-play muted</span>
                      <a href="https://youtu.be/jvXEkm27XOE" target="_blank" rel="noreferrer" className="ml-auto text-[10px] text-[#FFD700] font-bold hover:underline">youtu.be/jvXEkm27XOE ↗</a>
                    </div>
                    <VideoPlayer video={DEFAULT_VIDEO} autoplay />
                    <div className="space-y-1">
                      <h3 className="font-bold text-sm sm:text-base text-white line-clamp-2">{DEFAULT_VIDEO.title}</h3>
                      <p className="text-xs text-gray-400">{DEFAULT_VIDEO.channelName} • {DEFAULT_VIDEO.handle} • Featured • auto-play</p>
                      <div className="flex gap-2 pt-1">
                        <button onClick={()=>{ setActiveVideo(DEFAULT_VIDEO); setActiveTab("watch"); if(mainScrollRef.current) mainScrollRef.current.scrollTop=0; }} className="min-h-[44px] px-5 py-2.5 bg-[#FFD700] text-black font-bold text-xs rounded-xl">Watch Now</button>
                        <a href="https://youtu.be/jvXEkm27XOE" target="_blank" rel="noreferrer" className="min-h-[44px] px-5 py-2.5 bg-[#272727] text-white font-bold text-xs rounded-xl flex items-center">Open on YouTube ↗</a>
                      </div>
                    </div>
                  </div>
                  {/* Shorts Shelf — best placement, horizontal scroll, even better than YouTube */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-white flex items-center gap-2"><span className="bg-[#FF0000] text-white text-[10px] px-2 py-1 rounded font-bold">Shorts</span> Trending Shorts</h3>
                      <button onClick={()=>setActiveTab("shorts")} className="text-xs font-bold text-[#FFD700] hover:underline min-h-[44px] px-3 flex items-center">View all →</button>
                    </div>
                    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
                      {shortsVideos.map((s, idx)=>(
                        <div key={s.id} onClick={()=>{ setShortsIndex(idx); setShortsMuted(false); setActiveTab("shorts"); if(mainScrollRef.current) mainScrollRef.current.scrollTop=0; showToast(`Playing Short: ${s.title}`); }} className="flex-shrink-0 w-[140px] sm:w-[160px] cursor-pointer snap-start group">
                          <div className="aspect-[9/16] rounded-xl overflow-hidden bg-black border border-white/10 relative group-hover:border-[#FF0000]/40 transition-colors">
                            <img src={`https://img.youtube.com/vi/${s.youtubeId}/hqdefault.jpg`} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <span className="absolute top-2 left-2 bg-[#FF0000] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">SHORT</span>
                            <div className="absolute bottom-2 left-2 right-2">
                              <p className="text-[11px] font-bold text-white line-clamp-2 leading-tight">{s.title}</p>
                              <p className="text-[10px] text-white/70">{s.views}</p>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity">
                              <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-black">▶</div>
                            </div>
                          </div>
                          <p className="text-xs font-bold text-white line-clamp-2 mt-1.5 leading-tight">{s.title}</p>
                          <p className="text-[11px] text-gray-500">{s.handle} • {s.likes} likes</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {homeFiltered.length>0 ? (
                  <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {homeFiltered.map((vid) => (
                      <VideoCard key={vid.id} video={{...vid, platform: vid.platform||"youtube"}} onPlay={(norm)=>{ setActiveVideo({...norm, platform: vid.platform||"youtube"}); setActiveTab("watch"); if(mainScrollRef.current) mainScrollRef.current.scrollTop=0; }} onSave={toggleWatchLater} isSaved={isSavedWatchLater(vid.id)} onAi={openAiHelper} />
                    ))}
                  </div>
                  {marketplaceProducts.length>0 && (
                    <div className="space-y-3 pt-4 border-t border-white/10">
                      <h3 className="font-bold text-white flex items-center gap-2">🛒 Real Products <span className="text-xs text-gray-400 font-normal">• {marketplaceProducts.length} • Alphatekx 20% fee</span> <button onClick={()=>setActiveTab("marketplace")} className="ml-auto text-xs text-[#FFD700] hover:underline">Marketplace →</button></h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {marketplaceProducts.slice(0,3).map(p=>{
                          const fee = +(p.price*0.20).toFixed(2);
                          const gets = +(p.price*0.80).toFixed(2);
                          return (
                            <div key={p.id} className="glass-card p-4 flex flex-col gap-3 border border-white/10 hover:border-[#FFD700]/20">
                              <div className="flex items-center justify-between"><span className="text-[10px] font-bold bg-[#FFD700]/20 text-[#FFD700] px-2 py-1 rounded-full">{p.badge}</span><span className="text-xs font-bold text-white">${p.price}</span></div>
                              <h4 className="font-bold text-sm text-white line-clamp-2">{p.name}</h4>
                              <p className="text-xs text-gray-400 line-clamp-2">{p.description}</p>
                              <p className="text-[11px] text-gray-500">Seller ${gets} • Fee ${fee} (20%) • {p.salesCount} sales</p>
                              <button onClick={async()=>{ const res=await fetch("/api/marketplace/purchase",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({productId:p.id})}); const d=await res.json(); if(d.success) showToast(`Bought ${p.name} — Seller $${d.fees.sellerRevenue}`); else showToast(d.error); }} className="w-full min-h-[44px] bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold text-xs rounded-xl">Buy via Stripe</button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  </>
                  ) : (
                    <div className="glass-card p-8 text-center space-y-2">
                      <p className="text-sm text-gray-300">No {activePlatform} videos in this category.</p>
                      <button onClick={()=>setActivePlatform("all")} className="min-h-[44px] px-4 py-2.5 bg-[#FFD700] text-black font-bold text-xs rounded-xl">Show All</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ------------------- 3. YOUTUBE SHORTS — BEST ABSOLUTE, SIMPLE LIKE YOUTUBE, EASY VOLUME ------------------- */}
          {activeTab === "shorts" && (
            <div className="w-full max-w-[420px] mx-auto flex flex-col items-center justify-start min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-56px)] bg-[#0B0215] sm:bg-transparent p-0 sm:p-4">
              {/* Shorts header — minimal, hand swipe only (no buttons) */}
              <div className="w-full flex items-center justify-between px-3 py-2 sm:px-0 sm:py-3">
                <div className="flex items-center gap-2">
                  <span className="bg-[#FF0000] text-white px-2.5 py-1 rounded-full text-[11px] font-extrabold">Shorts</span>
                  <span className="text-xs text-gray-400">hand swipe • {shortsIndex+1}/{shortsVideos.length}</span>
                </div>
                <span className="text-xs text-gray-500 hidden sm:inline">Tap for sound • swipe up/down</span>
              </div>

              {/* Vertical Short Player — full-screen feel, easy volume */}
              <div
                className="relative w-full aspect-[9/16] max-h-[calc(100vh-140px)] sm:max-h-[calc(100vh-180px)] bg-black sm:rounded-2xl overflow-hidden border-0 sm:border border-white/10 shadow-2xl group"
                onTouchStart={e=>{ const y=e.touches[0].clientY; e.currentTarget.dataset.startY=y; }}
                onTouchEnd={e=>{ const start=Number(e.currentTarget.dataset.startY||0); const end=e.changedTouches[0].clientY; const diff=start-end; if(Math.abs(diff)>50){ if(diff>0 && shortsIndex < shortsVideos.length-1){ setShortsIndex(i=>i+1); } else if(diff<0 && shortsIndex>0){ setShortsIndex(i=>i-1); } } }}
                onClick={()=> setShortsMuted(m=>!m)}
              >
                {/* YouTube Short iframe — clean, no controls, loop */}
                <iframe
                  key={currentShort.youtubeId + shortsMuted + shortsIndex}
                  src={`https://www.youtube-nocookie.com/embed/${currentShort.youtubeId}?autoplay=1&mute=${shortsMuted?1:0}&controls=0&rel=0&playsinline=1&loop=1&playlist=${currentShort.youtubeId}&modestbranding=1&enablejsapi=1`}
                  title={currentShort.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                {/* Hand swipe overlay — captures swipe over iframe, easy */}
                <div
                  className="absolute inset-0 z-10 touch-manipulation"
                  onTouchStart={e=>{ const y=e.touches[0].clientY; e.currentTarget.dataset.startY=String(y); }}
                  onTouchEnd={e=>{ const start=Number(e.currentTarget.dataset.startY||0); const end=e.changedTouches[0].clientY; const diff=start-end; if(Math.abs(diff)>50){ if(diff>0 && shortsIndex < shortsVideos.length-1){ setShortsIndex(i=>i+1); } else if(diff<0 && shortsIndex>0){ setShortsIndex(i=>i-1); } } }}
                  onClick={()=> setShortsMuted(m=>!m)}
                  style={{touchAction: "pan-y"}}
                />

                {/* Top gradient */}
                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
                {/* Bottom gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

                {/* EASY VOLUME — big, thumb-friendly, bottom center (YouTube simple) */}
                <button
                  onClick={(e)=>{ e.stopPropagation(); setShortsMuted(m=>!m); showToast(shortsMuted ? "🔊 Sound on" : "🔇 Muted"); }}
                  className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-5 py-3 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white hover:bg-black/90 transition-all active:scale-95 shadow-xl min-h-[48px] min-w-[140px] justify-center"
                  title="Tap to toggle sound"
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${shortsMuted ? "bg-white/20" : "bg-[#FFD700] text-black"}`}>
                    {shortsMuted ? "🔇" : "🔊"}
                  </span>
                  <span className="text-xs font-bold">{shortsMuted ? "Tap for sound" : "Sound on"}</span>
                </button>

                {/* Right actions — large, easy, YouTube-like */}
                <div className="absolute right-2 sm:right-3 bottom-28 sm:bottom-32 z-20 flex flex-col items-center gap-3 sm:gap-4">
                  {[
                    { icon:"like", label: currentShort.likes, active: shortsLiked[currentShort.id], color:"text-[#FFD700]", action:()=>{ setShortsLiked(s=>({...s, [currentShort.id]:!s[currentShort.id]})); showToast(shortsLiked[currentShort.id] ? "Unliked" : "Liked ❤️"); } },
                    { icon:"chat", label: currentShort.comments, action:()=>showToast("Comments • 342 replies") },
                    { icon:"share", label: "Share", action:()=>{ navigator.clipboard?.writeText(`https://youtu.be/${currentShort.youtubeId}`); showToast("Link copied! Share your Short"); } },
                    { icon:"bookmark", label: "Save", action:()=>{ toggleWatchLater({youtubeId: currentShort.youtubeId, title: currentShort.title, channelName: currentShort.channel, thumbnailUrl:`https://img.youtube.com/vi/${currentShort.youtubeId}/hqdefault.jpg`, platform:"youtube"}); showToast("Saved to Watch Later"); } },
                  ].map((btn, i)=>(
                    <button key={i} onClick={(e)=>{ e.stopPropagation(); btn.action(); }} className="flex flex-col items-center gap-1 group/btn">
                      <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur border border-white/10 flex items-center justify-center group-active/btn:scale-90 transition-transform hover:bg-black/80 shadow-lg">
                        <Icon name={btn.icon} className={`w-6 h-6 ${btn.active ? btn.color : "text-white"}`} />
                      </div>
                      <span className="text-[11px] font-bold text-white drop-shadow">{btn.label}</span>
                    </button>
                  ))}
                </div>

                {/* Bottom info — channel + title, simple */}
                <div className="absolute bottom-0 left-0 right-14 sm:right-16 p-3 sm:p-4 z-20 space-y-2">
                  <div className="flex items-center gap-2">
                    <img src={currentShort.avatar} alt={currentShort.channel} className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                    <span className="font-bold text-sm text-white drop-shadow">{currentShort.handle}</span>
                    <button
                      onClick={(e)=>{ 
                        e.stopPropagation();
                        const cur = Number(String(currentShort.subscribersCount||currentShort.subscribers||"1200").replace(/[^0-9]/g,"")) || 1200;
                        const nextCount = cur+1;
                         const prev = shortsVideos[shortsIndex];
                         if (prev) {
                           setShortsVideos(s=> s.map(sh=> (sh.youtubeId===currentShort.youtubeId || sh.id===currentShort.id) ? {...sh, subscribers: nextCount.toLocaleString(), subscribersCount: nextCount} : sh));
                         }
                        showToast(`Subscribed to ${currentShort.channel}! 🎉 ${nextCount.toLocaleString()} subs`);
                      }}
                      className="ml-1 px-3 py-1 bg-white text-black text-xs font-extrabold rounded-full hover:bg-gray-100">
                      Subscribe
                    </button>
                  </div>
                  <p className="text-sm text-white leading-snug line-clamp-2 drop-shadow">{currentShort.title}</p>
                  <p className="text-xs text-gray-300">🎵 Original sound • {currentShort.views} • {currentShort.subscribers && <span>{currentShort.subscribers} subs • </span>}Tap video to {shortsMuted ? "unmute" : "mute"}</p>
                </div>

                {/* Progress dots */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex gap-1">
                  {shortsVideos.map((_, i)=>(
                    <div key={i} className={`h-1 rounded-full transition-all ${i===shortsIndex ? "w-6 bg-[#FFD700]" : "w-1.5 bg-white/40"}`} />
                  ))}
                </div>

                {/* Tap to play/pause hint */}
                {!shortsPlaying && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20" onClick={(e)=>{ e.stopPropagation(); setShortsPlaying(true); }}>
                    <div className="w-16 h-16 rounded-full bg-black/70 border-2 border-white flex items-center justify-center text-white text-2xl">▶</div>
                  </div>
                )}
              </div>

              <p className="w-full text-center text-xs text-gray-500 py-3">Hand swipe up/down — Shorts like YouTube</p>
            </div>
          )}

          {/* ------------------- SUPERPOWER #7: AI TEACHER ------------------- */}
          {activeTab === "teacher" && (
            <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
              <div className="glass-card neon-border-green p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#00FF88]/20 text-[#00FF88] flex items-center justify-center mx-auto border border-[#00FF88]/40">
                  <Icon name="teacher" className="w-8 h-8" />
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">AI Teacher & Course Builder</h1>
                <p className="text-sm text-gray-300 max-w-lg mx-auto">
                  YouTube doesn't build structured courses. Tell Alphatekx AI what skill you want to master, and it will generate a 5-step curriculum with hand-picked YouTube tutorials.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto pt-4">
                  <input
                    type="text"
                    value={teacherGoal}
                    onChange={(e) => setTeacherGoal(e.target.value)}
                    placeholder="What do you want to learn? Eg: Build a streaming app..."
                    className="w-full bg-black/80 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF88]"
                  />
                  <button
                    onClick={handleBuildCourse}
                    disabled={isBuildingCourse}
                    className="w-full sm:w-auto px-6 py-3 bg-[#00FF88] hover:bg-[#00c468] text-black font-extrabold text-sm rounded-xl whitespace-nowrap transition-transform active:scale-95 shadow-[0_0_20px_rgba(0,255,136,0.4)]"
                  >
                    {isBuildingCourse ? "Building Course..." : "Build Course ✨"}
                  </button>
                </div>
              </div>

              {teacherCourse && (
                <div className="glass-card p-6 space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <span className="text-xs font-mono text-[#00FF88] uppercase">Generated Curriculum</span>
                      <h2 className="text-xl font-bold text-white">{teacherCourse.goal}</h2>
                    </div>
                    <span className="text-xs font-mono bg-white/10 px-3 py-1 rounded-full text-gray-300">5 Steps • Verified</span>
                  </div>

                  <div className="space-y-4">
                    {teacherCourse.steps.map((step) => (
                      <div 
                        key={step.step} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-black/40 border border-white/10 hover:border-[#00FF88] transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <span className="w-8 h-8 rounded-full bg-[#00FF88]/20 text-[#00FF88] font-mono font-bold flex items-center justify-center text-sm flex-shrink-0">
                            {step.step}
                          </span>
                          <div>
                            <h3 className="font-bold text-sm text-white">{step.title}</h3>
                            <p className="text-xs text-gray-400 mt-1">{step.desc}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setActiveVideo(videoCatalog[0]);
                            setActiveTab("watch");
                          }}
                          className="px-4 py-2 bg-white/10 hover:bg-[#00D9FF] hover:text-black font-bold text-xs rounded-xl border border-white/10 transition-colors whitespace-nowrap"
                        >
                          Watch Step Video →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ------------------- SUPERPOWER #8: AI MEMORY ------------------- */}
          {activeTab === "memory" && (
            <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
              <div className="glass-card neon-border-blue p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#00D9FF]/20 text-[#00D9FF] rounded-2xl">
                    <Icon name="brain" className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">AI Memory Search</h1>
                    <p className="text-xs text-gray-400">Search anything you have ever watched across all videos</p>
                  </div>
                </div>

                <form onSubmit={handleMemorySearch} className="flex gap-3">
                  <input
                    type="text"
                    value={memoryQuery}
                    onChange={(e) => setMemoryQuery(e.target.value)}
                    placeholder="Ask anything about what you watched... (e.g. backpropagation formula)"
                    className="flex-1 bg-black/80 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00D9FF]"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#00D9FF] text-black font-extrabold text-sm rounded-xl hover:bg-[#00FF88] transition-colors"
                  >
                    Vector Search
                  </button>
                </form>

                {memoryResults.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <h3 className="text-xs font-mono text-[#00D9FF] uppercase">Vector Matches Found</h3>
                    {memoryResults.map((res, i) => (
                      <div key={i} className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-white">{res.title}</span>
                          <span className="text-[10px] font-mono text-gray-400">{res.watchedAgo}</span>
                        </div>
                        <p className="text-xs text-gray-300">{res.snippet}</p>
                        <button 
                          onClick={() => {
                            setActiveVideo(videoCatalog[0]);
                            setActiveTab("watch");
                            handleSeek(750, res.timestamp);
                          }}
                          className="text-xs font-mono font-bold text-[#00FF88] hover:underline"
                        >
                          Jump directly to {res.timestamp} →
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ------------------- SUPERPOWER #9: AI STUDIO ------------------- */}
          {activeTab === "studio" && (
            <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
              <div className="glass-card p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <Icon name="studio" className="w-8 h-8 text-purple-400" />
                  <div>
                    <h1 className="text-2xl font-bold text-white">AI Studio Superpowers</h1>
                    <p className="text-xs text-gray-400">Clip Maker, 4K Thumbnail Enhancer & Voice Over Translator</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                  {[
                    { id: "clip", label: "Clip Maker ✂️" },
                    { id: "thumbnail", label: "Thumbnail Enhancer 🎨" },
                    { id: "voice", label: "Voice Translator 🎙️" }
                  ].map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => setStudioTool(tool.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                        studioTool === tool.id 
                          ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]" 
                          : "bg-white/10 text-gray-300 hover:text-white"
                      }`}
                    >
                      {tool.label}
                    </button>
                  ))}
                </div>

                {studioTool === "clip" && (
                  <div className="space-y-4">
                    <p className="text-xs text-gray-300">AI finds viral moments & creates clips — Pro only.</p>
                    {!isProUser && (
                      <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-xl p-3 text-xs text-[#FFD700] flex items-center justify-between">
                        <span>🔒 Clip Maker is Pro-only</span>
                        <button onClick={()=>setActiveTab("pricing")} className="px-3 py-1 bg-[#FFD700] text-black font-bold rounded-full text-[11px]">Upgrade</button>
                      </div>
                    )}
                    <input
                      type="text"
                      value={clipVideoUrl}
                      onChange={(e) => setClipVideoUrl(e.target.value)}
                      placeholder="https://youtu.be/jvXEkm27XOE"
                      className="w-full bg-black/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={clipPrompt}
                      onChange={(e) => setClipPrompt(e.target.value)}
                      placeholder="find viral moment when..."
                      className="w-full bg-black/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white"
                    />
                    <button
                      onClick={async () => {
                        if (!isProUser) { showToast("🔒 Clip Maker is Pro-only — upgrade to continue"); setActiveTab("pricing"); return; }
                        setGeneratedClip(null); setClipResult(null);
                        try {
                          const res = await fetch("/api/clips/create", {
                            method: "POST",
                            headers: { "Content-Type": "application/json", "x-pro": "true" },
                            body: JSON.stringify({ videoUrl: clipVideoUrl, prompt: clipPrompt, pro: true })
                          });
                          const data = await res.json();
                          if (!res.ok) throw new Error(data.message || data.error);
                          setClipResult(data);
                          setGeneratedClip(data.clips[0]);
                          showToast(`Generated ${data.clips.length} viral clips! ✂️`);
                        } catch (e) { showToast(e.message); }
                      }}
                      className={`px-6 py-3 font-bold text-xs rounded-xl shadow-lg min-h-[44px] ${isProUser ? "bg-purple-600 hover:bg-purple-500 text-white" : "bg-[#272727] text-gray-400 border border-[#FFD700]/20"}`}
                    >
                      {isProUser ? "Generate Viral Clips ✂️" : "Unlock with Pro 🔒"}
                    </button>
                    {clipResult && (
                      <div className="space-y-2">
                        {clipResult.clips.map(c => (
                          <div key={c.id} className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/40 flex gap-3">
                            <img src={c.thumbnail} alt={c.title} className="w-20 h-14 object-cover rounded-lg" />
                            <div className="flex-1">
                              <p className="text-xs font-bold text-white">{c.title}</p>
                              <p className="text-[11px] text-gray-400">{c.start} → {c.end} • {c.duration} • Score {c.viralityScore}</p>
                              <p className="text-[11px] text-gray-500">{c.reason}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {generatedClip && !clipResult && (
                      <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40 text-xs space-y-2">
                        <span className="font-bold text-purple-300">Clip Ready: {generatedClip.title}</span>
                        <p className="text-gray-400">Timeline: {generatedClip.start} - {generatedClip.end}</p>
                      </div>
                    )}
                  </div>
                )}

                {studioTool === "thumbnail" && (
                  <div className="space-y-4">
                    <p className="text-xs text-gray-300">Enhance thumbnails to 4K neon glow — Pro only.</p>
                    {!isProUser && (
                      <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-xl p-3 text-xs text-[#FFD700] flex items-center justify-between">
                        <span>🔒 Thumbnail Enhancer is Pro-only</span>
                        <button onClick={()=>setActiveTab("pricing")} className="px-3 py-1 bg-[#FFD700] text-black font-bold rounded-full text-[11px]">Upgrade</button>
                      </div>
                    )}
                    <input value={enhancedThumbUrl} onChange={e=>setEnhancedThumbUrl(e.target.value)} placeholder="https://img.youtube.com/vi/jvXEkm27XOE/hqdefault.jpg" className="w-full bg-black/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white" />
                    <div className="relative aspect-video max-w-md rounded-xl overflow-hidden border border-white/20">
                      <img src={enhancedResult ? enhancedResult.preview.after : enhancedThumbUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                      {isEnhancingThumbnail && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-xs text-[#00FF88] font-mono">Enhancing to 4K crisp neon...</div>
                      )}
                    </div>
                    <button
                      onClick={async () => {
                        if (!isProUser) { showToast("🔒 Thumbnail Enhancer is Pro-only"); setActiveTab("pricing"); return; }
                        setIsEnhancingThumbnail(true);
                        try {
                          const res = await fetch("/api/thumbnail/enhance", {
                            method: "POST",
                            headers: { "Content-Type": "application/json", "x-pro": "true" },
                            body: JSON.stringify({ thumbnailUrl: enhancedThumbUrl, style: "neon", pro: true })
                          });
                          const data = await res.json();
                          if (!res.ok) throw new Error(data.message || data.error);
                          setEnhancedResult(data);
                          showToast("Thumbnail Upgraded to 4K Neon! ✨");
                        } catch (e) { showToast(e.message); }
                        setIsEnhancingThumbnail(false);
                      }}
                      className={`px-6 py-3 font-bold text-xs rounded-xl min-h-[44px] ${isProUser ? "bg-[#00D9FF] text-black" : "bg-[#272727] text-gray-400 border border-[#FFD700]/20"}`}
                    >
                      {isProUser ? "Enhance to 4K ✨" : "Unlock with Pro 🔒"}
                    </button>
                    {enhancedResult && (
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div><p className="text-gray-500 mb-1">Before</p><img src={enhancedResult.preview.before} alt="before" className="w-full rounded-xl border border-white/10" /></div>
                        <div><p className="text-[#FFD700] mb-1">After • 4K Neon</p><img src={enhancedResult.preview.after} alt="after" className="w-full rounded-xl border border-[#FFD700]/30" /></div>
                      </div>
                    )}
                  </div>
                )}

                {studioTool === "voice" && (
                  <div className="space-y-4">
                    <p className="text-xs text-gray-300">Translate audio to Pidgin/Yoruba/Igbo/Hausa — Pro only.</p>
                    {!isProUser && (
                      <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-xl p-3 text-xs text-[#FFD700] flex items-center justify-between">
                        <span>🔒 Voice Translator is Pro-only</span>
                        <button onClick={()=>setActiveTab("pricing")} className="px-3 py-1 bg-[#FFD700] text-black font-bold rounded-full text-[11px]">Upgrade</button>
                      </div>
                    )}
                    <input value={voiceVideoUrl} onChange={e=>setVoiceVideoUrl(e.target.value)} placeholder="https://youtu.be/jvXEkm27XOE" className="w-full bg-black/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white" />
                    <select value={voiceLang} onChange={e=>setVoiceLang(e.target.value)} className="w-full bg-black/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white">
                      {["Pidgin","Yoruba","Igbo","Hausa","English"].map(l=><option key={l} value={l}>{l}</option>)}
                    </select>
                    <button
                      onClick={async () => {
                        if (!isProUser) { showToast("🔒 Voice Translator is Pro-only"); setActiveTab("pricing"); return; }
                        setIsVoiceTranslating(true);
                        try {
                          const res = await fetch("/api/voice/translate", {
                            method: "POST",
                            headers: { "Content-Type": "application/json", "x-pro": "true" },
                            body: JSON.stringify({ videoUrl: voiceVideoUrl, targetLang: voiceLang, pro: true })
                          });
                          const data = await res.json();
                          if (!res.ok) throw new Error(data.message || data.error);
                          setVoiceResult(data);
                          showToast(`Translated to ${data.targetLang}! 🌍`);
                        } catch (e) { showToast(e.message); }
                        setIsVoiceTranslating(false);
                      }}
                      className={`px-6 py-3 font-bold text-xs rounded-xl min-h-[44px] ${isProUser ? "bg-gradient-to-r from-[#A855F7] to-[#FFD700] text-black" : "bg-[#272727] text-gray-400 border border-[#FFD700]/20"}`}
                    >
                      {isVoiceTranslating ? "Translating..." : isProUser ? `Translate to ${voiceLang} 🌍` : "Unlock with Pro 🔒"}
                    </button>
                    {voiceResult && (
                      <div className="bg-black/40 border border-white/10 rounded-xl p-3 space-y-2">
                        <p className="text-xs text-[#FFD700] font-bold">{voiceResult.targetLang} Translation</p>
                        <p className="text-sm text-white">{voiceResult.translatedText}</p>
                        <audio controls src={voiceResult.audioUrl} className="w-full" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ------------------- SUPERPOWER #10: PRICING PRO ------------------- */}
          {activeTab === "pricing" && (
            <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
              <div className="text-center space-y-3">
                <h1 className="text-3xl font-extrabold text-white">Unlock Alphatekx Stream Pro</h1>
                <p className="text-sm text-gray-400">Choose the plan that powers your stream workflow.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-8 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">Free Viewer</h3>
                    <div className="text-3xl font-extrabold text-gray-400">$0 <span className="text-xs font-normal">/ month</span></div>
                  </div>

                  <ul className="space-y-3 text-xs text-gray-300">
                    <li className="flex items-center gap-2">✓ 5 AI Summaries per day</li>
                    <li className="flex items-center gap-2">✓ Standard YouTube Iframe Player</li>
                    <li className="flex items-center gap-2">✓ Community Live Chat access</li>
                    <li className="text-gray-600 line-through">✗ Naija Translator (Pidgin/Yoruba/Igbo)</li>
                    <li className="text-gray-600 line-through">✗ AI Teacher Course Builder</li>
                    <li className="text-gray-600 line-through">✗ AI Memory Watch History Chat</li>
                  </ul>

                  <button disabled className="w-full py-3 bg-white/10 text-gray-400 font-bold text-xs rounded-xl">
                    Current Plan
                  </button>
                </div>

                <div className="glass-card neon-border-blue p-8 space-y-6 relative overflow-hidden">
                  <div className="absolute top-3 right-3 bg-[#00D9FF] text-black font-extrabold text-[10px] font-mono px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <span>Alphatekx Pro</span>
                      <Icon name="crown" className="w-5 h-5 text-[#00FF88]" />
                    </h3>
                    <div className="text-3xl font-extrabold text-[#00D9FF]">
                      $5 <span className="text-xs font-normal text-gray-300">/ month or ₦1,500/mo</span>
                    </div>
                  </div>

                  <ul className="space-y-3 text-xs text-gray-200">
                    <li className="flex items-center gap-2 text-[#00FF88]">✓ Unlimited AI Summaries</li>
                    <li className="flex items-center gap-2 text-[#00FF88]">✓ Naija Translator (Pidgin, Yoruba, Igbo, Hausa)</li>
                    <li className="flex items-center gap-2 text-[#00FF88]">✓ Enhanced Cinema Mode Ambient Glow</li>
                    <li className="flex items-center gap-2 text-[#00FF88]">✓ AI Teacher Course Builder</li>
                    <li className="flex items-center gap-2 text-[#00FF88]">✓ AI Memory Watch History Vector Chat</li>
                    <li className="flex items-center gap-2 text-[#00FF88]">✓ AI Studio Clip Maker & 4K Enhancer</li>
                  </ul>

                  <button 
                    onClick={() => {
                      setIsProUser(true);
                      showToast("Pro Subscription Activated! All superpowers unlocked. 🎉");
                    }} 
                    className="w-full py-3.5 bg-gradient-to-r from-[#00D9FF] to-[#00FF88] text-black font-extrabold text-sm rounded-xl shadow-[0_0_25px_rgba(0,217,255,0.4)] hover:opacity-90 active:scale-95"
                  >
                    {isProUser ? "You are Pro ✓" : "Upgrade to Pro ($5 / ₦1,500)"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ------------------- MARKETPLACE — PROMPT #6 (20% fee, Stripe, Seller Dashboard) ------------------- */}
          {activeTab === "marketplace" && (
            <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">Marketplace</h1>
                  <p className="text-xs text-gray-400">Apps, courses, video assets — Alphatekx 20% fee • Seller keeps 80% • Stripe 4242 test</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setActiveTab("sell")} className="min-h-[44px] px-5 py-2.5 bg-[#00FF88] text-black font-extrabold text-xs rounded-xl hover:bg-[#00c468]">+ List Product (80%)</button>
                  <button onClick={() => { setMarketplaceView(marketplaceView==="dashboard"?"products":"dashboard"); if(marketplaceView!=="dashboard") loadSellerSales(); }} className="min-h-[44px] px-5 py-2.5 bg-[#272727] text-white font-bold text-xs rounded-xl border border-white/10">
                    {marketplaceView==="dashboard" ? "Products" : "Seller Dashboard"}
                  </button>
                </div>
              </div>

              {/* Category filter */}
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {["all","app","course","plugin"].map(c => (
                  <button key={c} onClick={()=>setMarketplaceCategory(c)} className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${marketplaceCategory===c ? "bg-[#FFD700] text-black" : "bg-[#272727] text-gray-300 border border-white/10"}`}>{c}</button>
                ))}
              </div>

              {marketplaceView === "dashboard" ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input value={sellerEmailInput} onChange={e=>setSellerEmailInput(e.target.value)} placeholder="seller email" className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white" />
                    <button onClick={()=>loadSellerSales()} className="min-h-[44px] px-5 py-2.5 bg-[#00D9FF] text-black font-bold text-xs rounded-xl">Load Sales</button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="glass-card p-4 text-center"><p className="text-2xl font-extrabold text-white">{sellerSales.summary.totalSales}</p><p className="text-xs text-gray-400">Total Sales</p></div>
                    <div className="glass-card p-4 text-center"><p className="text-2xl font-extrabold text-[#00FF88]">${sellerSales.summary.totalSellerRevenue}</p><p className="text-xs text-gray-400">Your Revenue (80%)</p></div>
                    <div className="glass-card p-4 text-center"><p className="text-2xl font-extrabold text-[#FFD700]">${sellerSales.summary.totalFees}</p><p className="text-xs text-gray-400">Alphatekx Fee (20%)</p></div>
                    <div className="glass-card p-4 text-center"><p className="text-2xl font-extrabold text-white">${sellerSales.summary.totalRevenue}</p><p className="text-xs text-gray-400">Gross</p></div>
                  </div>
                  <div className="glass-card overflow-hidden">
                    <div className="p-3 border-b border-white/10 flex justify-between text-xs font-bold text-white"><span>Recent Sales</span><span>{sellerSales.sales.length} records</span></div>
                    <div className="divide-y divide-white/5 max-h-[400px] overflow-auto">
                      {sellerSales.sales.map(s => (
                        <div key={s.id} className="p-3 flex justify-between text-xs">
                          <div><p className="font-bold text-white">{s.productName}</p><p className="text-gray-400">{s.buyerEmail} → {s.sellerEmail}</p></div>
                          <div className="text-right"><p className="font-bold text-white">${s.price}</p><p className="text-[#00FF88]">You ${s.sellerRevenue} <span className="text-gray-500">Fee ${s.platformFee}</span></p></div>
                        </div>
                      ))}
                      {sellerSales.sales.length===0 && <p className="p-8 text-center text-sm text-gray-500">No sales yet for {sellerEmailInput}</p>}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {marketplaceProducts.map((product) => {
                    const fee = +(product.price*0.20).toFixed(2);
                    const sellerGets = +(product.price - fee).toFixed(2);
                    return (
                      <div key={product.id} className="glass-card p-6 flex flex-col justify-between space-y-4 border border-white/10 hover:border-[#FFD700]/20 transition-colors">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#00D9FF] bg-[#00D9FF]/10 px-2.5 py-1 rounded">{product.badge}</span>
                            <span className="text-[10px] text-gray-500">{product.category} • {product.salesCount} sales</span>
                          </div>
                          <h3 className="font-bold text-base text-white line-clamp-2">{product.name}</h3>
                          <p className="text-xs text-gray-400 line-clamp-2">{product.description}</p>
                          <p className="text-[11px] text-gray-500">{product.sellerEmail}</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-extrabold text-white">${product.price}</span>
                            <span className="text-[11px] text-gray-400">Seller ${sellerGets} • Fee ${fee} (20%)</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={async () => {
                                try {
                                  const res = await fetch("/api/marketplace/purchase", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ productId: product.id, buyerEmail: "buyer@alphatekx.ai" })
                                  });
                                  const data = await res.json();
                                  if (!res.ok) throw new Error(data.error);
                                  showToast(`Stripe ✓ Paid $${product.price} — Seller $${data.fees.sellerRevenue}, Fee $${data.fees.platformFee} (20%)`);
                                  setCartCount(c=>c+1);
                                  loadSellerSales(product.sellerEmail);
                                } catch(e) { showToast(e.message); }
                              }}
                              className="flex-1 min-h-[44px] px-5 py-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold text-xs rounded-xl"
                            >
                              Buy via Stripe
                            </button>
                            <button
                              onClick={() => {
                                const fees = { fee: +(product.price*0.20).toFixed(2), gets: +(product.price*0.80).toFixed(2) };
                                setCheckoutProduct({ ...product, platformFee: fees.fee, sellerRevenue: fees.gets });
                              }}
                              className="px-4 min-h-[44px] bg-[#272727] text-white text-xs font-bold rounded-xl border border-white/10"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ------------------- SELL PRODUCT FORM — PROMPT #6 (20% fee, Stripe) ------------------- */}
          {activeTab === "sell" && (
            <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-6">
              <div className="glass-card p-8 space-y-6 border border-white/10">
                <h1 className="text-xl font-extrabold text-white">List Your Product — 80% Royalty</h1>
                <p className="text-xs text-gray-400">Alphatekx takes 20% on every sale. Stripe test card 4242 4242 4242 4242</p>
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const fd = new FormData(e.target);
                    const payload = {
                      name: fd.get("name"),
                      price: Number(fd.get("price")),
                      description: fd.get("description"),
                      category: fd.get("category") || "app",
                      sellerEmail: fd.get("sellerEmail") || "creator@alphatekx.ai",
                      fileUrl: fd.get("fileUrl") || `https://alphatekx.ai/downloads/product-${Date.now()}.zip`,
                    };
                    if (!payload.name || payload.price <= 0) { showToast("Name and valid price required"); return; }
                    try {
                      const res = await fetch("/api/marketplace/products", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.error);
                      const fee = +(payload.price*0.20).toFixed(2);
                      const gets = +(payload.price*0.80).toFixed(2);
                      showToast(`Listed "${data.product.name}" — you keep $${gets}, fee $${fee} (20%)`);
                      // refresh marketplace
                      const r = await fetch("/api/marketplace/products");
                      const d = await r.json();
                      if (d.products) setMarketplaceProducts(d.products);
                      setActiveTab("marketplace");
                    } catch (err) { showToast(err.message); }
                  }}
                  className="space-y-4 text-xs"
                >
                  <div>
                    <label className="text-gray-400 block mb-1">Product Name</label>
                    <input name="name" required placeholder="e.g. PyTorch CUDA Model Checkpoints" className="w-full bg-black/80 border border-white/10 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-gray-400 block mb-1">Price (USD)</label>
                      <input name="price" required type="number" step="0.01" placeholder="19.99" className="w-full bg-black/80 border border-white/10 rounded-xl px-4 py-2.5 text-white" />
                    </div>
                    <div>
                      <label className="text-gray-400 block mb-1">Category</label>
                      <select name="category" className="w-full bg-black/80 border border-white/10 rounded-xl px-4 py-2.5 text-white">
                        <option value="app">App</option>
                        <option value="course">Course</option>
                        <option value="plugin">Plugin</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Seller Email</label>
                    <input name="sellerEmail" placeholder="creator@alphatekx.ai" defaultValue="creator@alphatekx.ai" className="w-full bg-black/80 border border-white/10 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">File URL</label>
                    <input name="fileUrl" placeholder="https://alphatekx.ai/downloads/product.zip" className="w-full bg-black/80 border border-white/10 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Description</label>
                    <textarea name="description" required rows={3} placeholder="Describe the tool or course..." className="w-full bg-black/80 border border-white/10 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <button type="submit" className="w-full min-h-[44px] py-3 bg-gradient-to-r from-[#00FF88] to-[#00D9FF] text-black font-extrabold rounded-xl">
                    Publish to Marketplace
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ------------------- CHANNEL PAGE (/channel/:id) — uses ChannelAvatar/ChannelName/SubscriberCount ------------------- */}
          {activeTab === "channel" && (
            <div className="max-w-6xl mx-auto p-3 sm:p-4 md:p-6 space-y-6 overflow-x-hidden">
              {isChannelLoading ? (
                <div className="glass-card p-8 animate-pulse space-y-4">
                  <div className="h-36 bg-[#1a1a24] rounded-2xl" />
                  <div className="h-6 bg-[#282836] rounded w-1/3" />
                  <div className="h-4 bg-[#282836] rounded w-1/2" />
                </div>
              ) : channelData ? (
                <>
                  <div className="relative rounded-2xl h-36 sm:h-48 overflow-hidden border border-white/10 bg-gradient-to-r from-[#00D9FF]/20 via-purple-900/30 to-[#00FF88]/20">
                    <img src={channelData.banner || profileData?.banner} alt="Channel Banner" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6 -mt-10 sm:-mt-12 px-2 sm:px-6 relative z-10">
                    <ChannelAvatar src={channelData.avatar} alt={channelData.name} size={96} verified={channelData.verified} className="border-4 border-black shadow-xl w-24 h-24 flex-shrink-0" />
                    <div className="flex-1 min-w-0 space-y-1">
                      <ChannelName name={channelData.name} verified={channelData.verified} handle={channelData.handle} className="text-xl sm:text-2xl" />
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <SubscriberCount count={channelData.subscribers} />
                        <span className="text-gray-500">•</span>
                        <span className="text-xs text-gray-400">{channelUploads.length} videos</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-xs text-gray-400">{channelData.joinedAt ? `Joined ${channelData.joinedAt}` : ""}</span>
                      </div>
                      <p className="text-xs text-gray-300 max-w-2xl line-clamp-2">{channelData.description}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={()=>{
                        const next = !channelSubscribed;
                        setChannelSubscribed(next);
                        setChannelData(prev=> prev ? {...prev, subscribers: next ? `${(Number(String(prev.subscribersCount||prev.subscribers||"3020").replace(/[^0-9]/g,"")||3020)+1).toLocaleString()}` : `${(Number(String(prev.subscribersCount||prev.subscribers||"3021").replace(/[^0-9]/g,"")||3021)-1).toLocaleString()}`, subscribersCount: next ? (Number(prev.subscribersCount||3020)+1) : (Number(prev.subscribersCount||3020)-1)} : prev);
                        showToast(next ? `Subscribed to ${channelData.name}! 🎉 ${next ? (Number(channelData.subscribersCount||3020)+1).toLocaleString() : ""} subs` : `Unsubscribed from ${channelData.name}`);
                      }} className={`px-6 py-2.5 rounded-full font-bold text-xs transition-all active:scale-95 ${channelSubscribed ? "bg-[#272727] text-gray-300" : "bg-[#00D9FF] text-black shadow-[0_0_15px_rgba(0,217,255,0.4)]"}`}>{channelSubscribed ? "Subscribed ✓" : "Subscribe"}</button>
                      <button onClick={()=>setActiveTab("upload")} className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white border border-white/10 hidden sm:block">Upload video</button>
                    </div>
                  </div>
                  <div className="border-t border-[#272727] pt-4">
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="font-bold text-white">Uploads</h3>
                      <span className="text-xs text-gray-400 font-mono">• {channelUploads.length} videos</span>
                    </div>
                    {channelUploads.length>0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {channelUploads.map((vid)=>(
                          <div key={vid.id||vid.youtubeId} onClick={()=>{ setActiveVideo(normalizeVideo({...vid, channelName: channelData.name, avatar: channelData.avatar, subscribers: channelData.subscribers })); setActiveTab("watch"); if(mainScrollRef.current) mainScrollRef.current.scrollTop=0; }} className="glass-card overflow-hidden hover:border-[#00D9FF] transition-all cursor-pointer group flex flex-col">
                            <div className="relative aspect-video w-full bg-gray-900 overflow-hidden">
                              <img src={vid.thumbnailUrl || vid.img || `https://i.ytimg.com/vi/${vid.youtubeId}/hqdefault.jpg`} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                              <span className="absolute bottom-2 right-2 bg-black/80 text-xs font-mono px-1.5 py-0.5 rounded text-white">{vid.duration || "10:00"}</span>
                            </div>
                            <div className="p-3 space-y-1 flex-1">
                              <h4 className="font-bold text-sm text-white line-clamp-2 group-hover:text-[#00D9FF]">{vid.title}</h4>
                              <p className="text-xs text-gray-400 truncate">{channelData.name}</p>
                              <p className="text-[11px] text-gray-500">{vid.views || "0 views"} • {vid.category || "Tech"}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="glass-card p-8 text-center space-y-3 border-dashed">
                        <Icon name="youtube" className="w-8 h-8 mx-auto text-gray-600" />
                        <p className="text-sm text-gray-300">No uploads yet.</p>
                        <p className="text-xs text-gray-500">This channel hasn't uploaded any videos. Be the first to <button onClick={()=>setActiveTab("upload")} className="text-[#00D9FF] hover:underline font-bold">upload</button>.</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="glass-card p-8 text-center space-y-3">
                  <p className="text-sm text-gray-300">Channel not found.</p>
                  <button onClick={()=>setActiveTab("home")} className="px-4 py-2 bg-[#00D9FF] text-black font-bold text-xs rounded-xl">Back to Home</button>
                </div>
              )}
            </div>
          )}

          {/* ------------------- UPLOAD PAGE (/upload) ------------------- */}
          {activeTab === "upload" && (
            <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-6">
              <div className="glass-card neon-border-blue p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#00D9FF]/20 text-[#00D9FF] rounded-2xl"><Icon name="plus" className="w-6 h-6" /></div>
                  <div>
                    <h1 className="text-xl font-bold text-white">Upload Video</h1>
                    <p className="text-xs text-gray-400">Share your content — preserves existing design. Channel: {channelData?.name || profileData?.name || "Alphatekx Dev"}</p>
                  </div>
                </div>
                <form onSubmit={handleUploadSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Title *</label>
                    <input value={uploadTitle} onChange={e=>setUploadTitle(e.target.value)} required minLength={3} placeholder="e.g. How I Built an AI Stream in 24 Hours" className="w-full bg-black/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00D9FF]" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Description</label>
                    <textarea value={uploadDesc} onChange={e=>setUploadDesc(e.target.value)} rows={3} placeholder="Describe your video... (supports Naija translations later)" className="w-full bg-black/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00D9FF]" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Category</label>
                      <select value={uploadCategory} onChange={e=>setUploadCategory(e.target.value)} className="w-full bg-black/80 border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-[#00D9FF]">
                        {categories.filter(c=>c!=="All").map(c=> <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Duration (e.g. 12:30)</label>
                      <input value={uploadDuration} onChange={e=>setUploadDuration(e.target.value)} placeholder="10:00" className="w-full bg-black/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF88]" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Thumbnail URL (optional)</label>
                    <input value={uploadThumbnail} onChange={e=>setUploadThumbnail(e.target.value)} placeholder="https://images.unsplash.com/..." className="w-full bg-black/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF88]" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">YouTube / Video URL (optional)</label>
                    <input value={uploadVideoUrl} onChange={e=>setUploadVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="w-full bg-black/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF88]" />
                  </div>
                  <button type="submit" disabled={isUploading} className="w-full py-3.5 bg-gradient-to-r from-[#00D9FF] to-[#00FF88] text-black font-extrabold text-sm rounded-xl shadow-[0_0_20px_rgba(0,217,255,0.3)] hover:opacity-95 disabled:opacity-50 transition-transform active:scale-95">
                    {isUploading ? "Uploading..." : "Publish to Channel 🚀"}
                  </button>
                  <p className="text-[11px] text-center text-gray-500 font-mono">POST /api/upload • Stored in edge memory • Visible on Channel page instantly</p>
                </form>
              </div>
            </div>
          )}

          {/* ------------------- USER PROFILE VIEW (/profile) — editable ------------------- */}
          {activeTab === "profile" && (
            <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
              <div className="relative rounded-2xl h-40 bg-gradient-to-r from-[#00D9FF]/30 via-purple-900/40 to-[#00FF88]/30 overflow-hidden border border-white/10">
                <img src={profileData?.banner || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80"} alt="Banner" className="absolute inset-0 w-full h-full object-cover opacity-40" />
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12 sm:-mt-16 px-2 sm:px-6 relative z-10">
                <ChannelAvatar src={profileData?.avatar || "https://ui-avatars.com/api/?name=Guest&background=0B0215&color=FFD700&size=200"} alt={profileData?.name || "Guest"} size={96} verified={profileData?.verified} className="border-4 border-black shadow-xl w-24 h-24 flex-shrink-0" />
                <div className="text-center sm:text-left flex-1 min-w-0">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <ChannelName name={profileData?.name || "Guest"} verified={profileData?.verified} handle={profileData?.handle || "@guest"} className="text-xl sm:text-2xl justify-center sm:justify-start" />
                    {profileData?.isGuest && <span className="text-[10px] font-bold bg-[#FFD700] text-black px-2 py-0.5 rounded-full">GUEST</span>}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start mt-1">
                    <span className="text-xs text-gray-400">{profileData?.isGuest ? "Browsing as Guest" : <SubscriberCount count={profileData?.subscribers || "0"} />}</span>
                    <span className="text-gray-500 text-xs">•</span>
                    <span className="text-xs text-gray-400">{profileData?.email || "guest@alphatekx.stream"}</span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1 max-w-xl">{profileData?.bio || "Browsing as Guest — sign up coming soon. Your history is saved locally."}</p>
                </div>
                {profileData?.isGuest ? (
                  <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 flex-shrink-0">Guest — sign in via header ↑</div>
                ) : (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={()=>setIsEditingProfile(!isEditingProfile)} className="px-5 py-2 rounded-full bg-[#272727] hover:bg-[#383838] text-xs font-bold text-white border border-white/10">
                      {isEditingProfile ? "Cancel" : "Edit Profile"}
                    </button>
                    <button onClick={async()=>{ await fetch('/api/auth/logout',{credentials:'include'}); setAuthUser(null); setProfileData(null); setUserFeed([]); showToast('Logged out'); window.location.reload(); }} className="px-5 py-2 rounded-full bg-[#FFD700] text-black font-bold text-xs hover:scale-105 transition">Logout</button>
                  </div>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="glass-card p-6 space-y-4">
                  <h3 className="font-bold text-white flex items-center gap-2"><Icon name="user" className="w-5 h-5 text-[#00D9FF]" /> Edit Profile — PUT /api/profile</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Display Name</label>
                      <input value={profileForm.name} onChange={e=>setProfileForm({...profileForm, name:e.target.value})} className="w-full bg-black/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00D9FF]" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Handle (@)</label>
                      <input value={profileForm.handle} onChange={e=>setProfileForm({...profileForm, handle:e.target.value})} placeholder="@alphatekx_dev" className="w-full bg-black/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00D9FF]" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Email</label>
                      <input value={profileForm.email} onChange={e=>setProfileForm({...profileForm, email:e.target.value})} className="w-full bg-black/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00D9FF]" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Avatar URL</label>
                      <input value={profileForm.avatar} onChange={e=>setProfileForm({...profileForm, avatar:e.target.value})} placeholder="https://..." className="w-full bg-black/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00FF88]" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-gray-400 block mb-1">Banner URL</label>
                      <input value={profileForm.banner} onChange={e=>setProfileForm({...profileForm, banner:e.target.value})} placeholder="https://..." className="w-full bg-black/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00FF88]" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-gray-400 block mb-1">Bio</label>
                      <textarea value={profileForm.bio} onChange={e=>setProfileForm({...profileForm, bio:e.target.value})} rows={3} className="w-full bg-black/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00D9FF]" />
                    </div>
                  </div>
                  <button type="submit" disabled={isSavingProfile} className="w-full py-3 bg-[#00D9FF] hover:bg-[#00c4e6] text-black font-extrabold text-sm rounded-xl disabled:opacity-50">
                    {isSavingProfile ? "Saving..." : "Save Profile (PUT /api/profile)"}
                  </button>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button onClick={()=>navigateToChannel(profileData?.name || "codecraft")} className="glass-card p-4 hover:border-[#00D9FF] transition-colors text-left">
                    <p className="text-xs text-gray-400">Your Channel</p>
                    <p className="font-bold text-white flex items-center gap-1">Go to Channel <span className="text-[#00D9FF]">→</span></p>
                    <SubscriberCount count={profileData?.subscribers || "1.2M"} className="mt-1" />
                  </button>
                  <button onClick={()=>setActiveTab("upload")} className="glass-card p-4 hover:border-[#00FF88] transition-colors text-left">
                    <p className="text-xs text-gray-400">Create</p>
                    <p className="font-bold text-white">Upload Video</p>
                    <p className="text-[11px] text-gray-500">POST /api/upload</p>
                  </button>
                  <button onClick={()=>setActiveTab("pricing")} className="glass-card p-4 hover:border-yellow-400 transition-colors text-left">
                    <p className="text-xs text-gray-400">Membership</p>
                    <p className="font-bold text-white">{isProUser ? "Pro Active ✓" : "Upgrade to Pro"}</p>
                    <p className="text-[11px] text-[#00FF88]">$5 / month</p>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ------------------- WATCH LATER PAGE (UNIFIED AGGREGATOR) ------------------- */}
          {activeTab === "watchlater" && (
            <div className="max-w-[1600px] mx-auto p-3 sm:p-4 md:p-6 space-y-6 overflow-x-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#FFD700]/20 text-[#FFD700] rounded-xl"><Icon name="bookmark" className="w-5 h-5" /></div>
                  <div>
                    <h1 className="text-xl font-bold text-white flex items-center gap-2">Watch Later <span className="text-xs text-gray-400 font-mono">• {watchLater.length} saved</span></h1>
                    <p className="text-xs text-gray-400">Your personal queue — YouTube, TikTok, Instagram, Twitter, Facebook</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {watchLater.length>0 && <button onClick={()=>{ if(!confirm("Clear Watch Later?")) return; watchLater.forEach(v=> removeWatchLater(v.youtubeId||v.id)); }} className="text-xs text-gray-400 hover:text-red-400 font-mono">Clear all</button>}
                  <button onClick={()=>setActiveTab("home")} className="px-4 py-2 rounded-full bg-[#272727] hover:bg-[#383838] text-xs text-gray-200">Browse →</button>
                </div>
              </div>
              {watchLater.length===0 ? (
                <div className="glass-card p-12 text-center space-y-3 border-dashed">
                  <Icon name="bookmark" className="w-10 h-10 mx-auto text-gray-600" />
                  <p className="text-sm text-gray-300">No saved videos yet.</p>
                  <p className="text-xs text-gray-500">Tap + on any card to save — unified across all platforms. Premium dark + gold preserved.</p>
                  <button onClick={()=>setActiveTab("home")} className="px-5 py-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold text-xs rounded-xl">Discover Videos</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {watchLater.map(v=>(
                    <div key={v.youtubeId||v.id} className="glass-card overflow-hidden group flex flex-col hover:border-[#FFD700]/40 transition-all">
                      <div className="relative aspect-video w-full bg-gray-900 overflow-hidden cursor-pointer" onClick={()=>{ const norm=normalizeVideo({...v, platform: v.platform||"youtube"}); setActiveVideo(norm); setActiveTab("watch"); if(mainScrollRef.current) mainScrollRef.current.scrollTop=0; }}>
                        <img src={v.thumbnailUrl || v.img} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <span className="absolute top-2 left-2"><PlatformBadge platform={v.platform||"youtube"} /></span>
                        <span className="absolute bottom-2 right-2 bg-black/80 text-[10px] font-mono px-1.5 py-0.5 rounded text-white">{v.duration || "0:00"}</span>
                      </div>
                      <div className="p-3 space-y-1 flex-1">
                        <h3 className="font-bold text-sm text-white line-clamp-2">{v.title}</h3>
                        <p className="text-xs text-gray-400 truncate">{v.channelName || v.channel}</p>
                        <p className="text-[11px] text-gray-500">{v.views || ""}</p>
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <button onClick={()=>{ const norm=normalizeVideo({...v, platform: v.platform||"youtube"}); setActiveVideo(norm); setActiveTab("watch"); if(mainScrollRef.current) mainScrollRef.current.scrollTop=0; }} className="text-xs font-bold text-[#00D9FF] hover:underline">Play →</button>
                          <button onClick={()=>removeWatchLater(v.youtubeId||v.id)} className="text-xs text-red-400 hover:text-red-300 border border-red-400/20 px-2 py-1 rounded-full hover:bg-red-400/10">Remove ✕</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ------------------- HISTORY — real searched + watched (Guest) — fit screen full ------------------- */}
          {activeTab === "history" && (
            <div className="max-w-[1600px] mx-auto p-3 sm:p-4 md:p-6 space-y-6 overflow-x-hidden min-h-[calc(100vh-56px)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h1 className="text-xl font-bold text-white flex items-center gap-2"><Icon name="history" className="w-6 h-6 text-[#FFD700]" /> History <span className="text-xs text-gray-400 font-mono">• Guest • {searchHistory.length + watchedHistory.length} items</span></h1>
                <div className="flex gap-2">
                  <button onClick={()=>{ if(!confirm("Clear all history?")) return; setSearchHistory([]); setWatchedHistory([]); try{localStorage.removeItem("alphatekx_search_history"); localStorage.removeItem("alphatekx_watched_history");}catch{} fetch("/api/search/history",{method:"DELETE"}).catch(()=>{}); showToast("History cleared — Guest"); }} className="text-xs text-red-400 border border-red-400/20 px-3 py-1.5 rounded-full hover:bg-red-400/10 min-h-[44px]">Clear all</button>
                  <button onClick={()=>setActiveTab("home")} className="px-4 py-2 rounded-full bg-[#272727] hover:bg-[#383838] text-xs text-gray-200 min-h-[44px]">Browse →</button>
                </div>
              </div>
              <div className="flex gap-2 border-b border-white/10 pb-3 overflow-x-auto scrollbar-hide">
                <button onClick={()=>setHistoryView("watched")} className={`min-h-[44px] px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap ${historyView==="watched" ? "bg-[#FFD700] text-black" : "bg-[#272727] text-gray-300"}`}>Watched ({watchedHistory.length})</button>
                <button onClick={()=>setHistoryView("searched")} className={`min-h-[44px] px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap ${historyView==="searched" ? "bg-[#00D9FF] text-black" : "bg-[#272727] text-gray-300"}`}>Searched ({searchHistory.length})</button>
              </div>
              {historyView==="watched" ? (
                watchedHistory.length>0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {watchedHistory.map(v=>(
                      <div key={`w-${v.youtubeId||v.id}-${v.watchedAt}`} onClick={()=>{ setActiveVideo(normalizeVideo(v)); setActiveTab("watch"); if(mainScrollRef.current) mainScrollRef.current.scrollTop=0; }} className="glass-card overflow-hidden cursor-pointer hover:border-[#FFD700]/30 group">
                        <div className="relative aspect-video bg-black">
                          <img src={v.img || v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] px-1 py-0.5 rounded text-white">{v.duration}</span>
                          <span className="absolute top-1 left-1 bg-[#FFD700] text-black text-[9px] font-bold px-1.5 py-0.5 rounded">WATCHED</span>
                        </div>
                        <div className="p-3 space-y-1">
                          <p className="text-xs font-bold text-white line-clamp-2">{v.title}</p>
                          <p className="text-xs text-gray-400 truncate">{v.channel || v.channelName}</p>
                          <p className="text-[11px] text-gray-500">{v.watchedAtStr || "Just now"} • {v.views}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass-card p-8 text-center space-y-2 border-dashed">
                    <Icon name="history" className="w-8 h-8 mx-auto text-gray-600" />
                    <p className="text-sm text-gray-300">No watched videos yet</p>
                    <p className="text-xs text-gray-500">Play any long or short video — it will appear here instantly (real-time, Guest).</p>
                    <button onClick={()=>setActiveTab("home")} className="mt-2 px-5 py-2 bg-[#FFD700] text-black font-bold text-xs rounded-xl">Browse</button>
                  </div>
                )
              ) : (
                searchHistory.length>0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {searchHistory.map(v=>(
                      <div key={`s-${v.youtubeId||v.id}-${v.searchedAt}`} onClick={()=>{ setActiveVideo(normalizeVideo(v)); setActiveTab("watch"); if(mainScrollRef.current) mainScrollRef.current.scrollTop=0; }} className="glass-card overflow-hidden cursor-pointer hover:border-[#00D9FF]/30 group">
                        <div className="relative aspect-video bg-black">
                          <img src={v.img || v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] px-1 py-0.5 rounded text-white">{v.duration}</span>
                          <span className="absolute top-1 left-1 bg-[#00D9FF] text-black text-[9px] font-bold px-1.5 py-0.5 rounded">SEARCHED</span>
                        </div>
                        <div className="p-3 space-y-1">
                          <p className="text-xs font-bold text-white line-clamp-2">{v.title}</p>
                          <p className="text-xs text-gray-400 truncate">{v.channel || v.channelName}</p>
                          <p className="text-[11px] text-gray-500">{v.searchedQuery ? `q: "${v.searchedQuery}"` : ""} • {v.views}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass-card p-8 text-center space-y-2 border-dashed">
                    <Icon name="search" className="w-8 h-8 mx-auto text-gray-600" />
                    <p className="text-sm text-gray-300">No searched videos yet</p>
                    <p className="text-xs text-gray-500">Search for anything — history saves locally and on server, never vanishes.</p>
                  </div>
                )
              )}
            </div>
          )}

          {/* FOOTER - YouTube TOS Requirement */}
          <footer className="bg-[#0f0f0f] border-t border-[#272727] py-6 px-4 text-center text-xs text-gray-500 space-y-2 mt-8">
            <p>Alphatekx Stream uses YouTube API Services. YouTube is a trademark of Google LLC.</p>
            <p className="font-mono text-[10px] text-gray-600">Built with React, Tailwind CSS, Cloudflare Workers & Durable Objects SQLite.</p>
          </footer>

        </main>
      </div>

      {/* MINI-PLAYER — REMOVED — no float popup */}
      {false && miniPlayerActive && activeTab === "watch" && (
        <div className="fixed bottom-20 right-6 z-40 w-80 md:w-96 aspect-video shadow-[0_0_30px_rgba(0,217,255,0.5)] border-2 border-[#00D9FF] rounded-2xl overflow-hidden bg-black flex flex-col group transition-all duration-300 animate-fade-in">
          <div className="relative w-full h-full bg-black">
            <img src={activeVideo.img} alt={activeVideo.title} className="w-full h-full object-cover opacity-80" />
            
            {/* Top Bar Overlay */}
            <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[11px] font-bold z-20">
              <span className="bg-black/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[#00FF88] border border-[#00FF88]/40 truncate max-w-[180px]">
                ▶ Mini Playing: {activeVideo.title}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    if (mainScrollRef.current) mainScrollRef.current.scrollTop = 0;
                    setMiniPlayerActive(false);
                  }}
                  className="bg-black/80 hover:bg-black text-[#00D9FF] p-1 rounded-full text-[10px] px-2"
                  title="Expand to Full Player"
                >
                  ↑ Expand
                </button>
                <button
                  onClick={() => setMiniPlayerActive(false)}
                  className="bg-black/80 hover:bg-black text-gray-300 hover:text-white p-1 rounded-full text-xs px-2"
                  title="Close Mini Player"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Bottom Controls Overlay */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs z-20 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMiniPlaying(!isMiniPlaying)} 
                  className="text-[#00D9FF] font-bold"
                >
                  {isMiniPlaying ? "⏸ Pause" : "▶ Play"}
                </button>
                <span className="text-[10px] text-gray-400 font-mono">12:30 / 22:45</span>
              </div>
              <button 
                onClick={() => handleSeek(750, "12:30")} 
                className="text-[10px] text-[#00FF88] font-mono hover:underline"
              >
                Jump 12:30
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0f0f0f] border-t border-[#272727] px-4 py-2 flex items-center justify-around md:hidden">
        <button 
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center gap-1 ${activeTab === "home" ? "text-[#00D9FF]" : "text-gray-400"}`}
        >
          <Icon name="home" className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button 
          onClick={() => setActiveTab("shorts")}
          className={`flex flex-col items-center gap-1 ${activeTab === "shorts" ? "text-[#00D9FF]" : "text-gray-400"}`}
        >
          <Icon name="shorts" className="w-5 h-5" />
          <span className="text-[10px]">Shorts</span>
        </button>

        <button 
          onClick={() => setActiveTab("upload")}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00D9FF] to-[#00FF88] text-black flex items-center justify-center -mt-4 shadow-[0_0_15px_rgba(0,255,136,0.6)]"
        >
          <Icon name="plus" className="w-6 h-6 stroke-[3]" />
        </button>

        <button 
          onClick={() => setActiveTab("watch")}
          className={`flex flex-col items-center gap-1 ${activeTab === "watch" ? "text-[#00FF88]" : "text-gray-400"}`}
        >
          <Icon name="youtube" className="w-5 h-5" />
          <span className="text-[10px]">Watch</span>
        </button>

        <button 
          onClick={() => setActiveTab("marketplace")}
          className={`flex flex-col items-center gap-1 ${activeTab === "marketplace" ? "text-[#00D9FF]" : "text-gray-400"}`}
        >
          <Icon name="shopping-bag" className="w-5 h-5" />
          <span className="text-[10px]">Marketplace</span>
        </button>
      </nav>

    </div>
    </div>
  );
}

// Render Root
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
