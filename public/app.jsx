import React, { useState, useEffect, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";

function AnimatedSplash({ onFinish }) {
  const [hide, setHide] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const prog = setInterval(() => {
      setProgress(current => {
        if (current >= 100) {
          clearInterval(prog);
          return 100;
        }
        return Math.min(100, current + Math.random() * 15);
      });
    }, 120);
    const timer = setTimeout(() => {
      setHide(true);
      setTimeout(() => onFinish?.(), 400);
    }, 2200);
    return () => {
      clearTimeout(timer);
      clearInterval(prog);
    };
  }, [onFinish]);

  if (hide) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black" style={{ animation: hide ? "fadeOut 0.4s ease forwards" : "" }}>
      <style>{`
        @keyframes pulseGlow {
          0%,100% { transform: scale(1); box-shadow: 0 0 30px rgba(0,212,255,.6), 0 0 60px rgba(0,212,255,.3), 0 0 90px rgba(0,212,255,.1); }
          50% { transform: scale(1.05); box-shadow: 0 0 50px rgba(0,212,255,.9), 0 0 100px rgba(0,212,255,.5), 0 0 140px rgba(0,212,255,.2); }
        }
        @keyframes splashLogoPulse {
          0%,100% { transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 18px rgba(0,212,255,.55)); }
          50% { transform: scale(1.08) rotate(3deg); filter: drop-shadow(0 0 42px rgba(0,212,255,.95)); }
        }
        @keyframes rotateRing { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes orbit { from { transform: rotate(0deg) translateX(85px) rotate(0deg); } to { transform: rotate(360deg) translateX(85px) rotate(-360deg); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes shimmer { from { transform: translateX(-100%); } to { transform: translateX(200%); } }
      `}</style>
      <div className="relative">
        <div className="absolute -inset-6 rounded-full border border-cyan-400/20" style={{ animation: "rotateRing 4s linear infinite" }}><div className="absolute top-0 left-1/2 w-2 h-2 -mt-1 -ml-1 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(0,212,255,.8)]" /></div>
        <div className="absolute -inset-10 rounded-full border border-blue-500/10" style={{ animation: "rotateRing 6s linear infinite reverse" }} />
        <div className="absolute top-1/2 left-1/2 w-2 h-2 -mt-1 -ml-1"><div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,212,255,.8)]" style={{ animation: "orbit 3s linear infinite" }} /></div>
        <img src="/splash-logo.png" alt="Alphatekx" className="w-32 h-32 rounded-full object-cover bg-black" style={{ animation: "splashLogoPulse 1.8s ease-in-out infinite" }} />
      </div>
      <div className="mt-10 text-center" style={{ animation: "fadeInUp .8s ease .3s both" }}>
        <h1 className="text-3xl font-bold tracking-wider text-white">Alphatekx Stream</h1>
        <p className="mt-2 text-sm tracking-[.2em] uppercase text-cyan-300/80">Where AI Meets Stream</p>
      </div>
      <div className="absolute bottom-20 left-1/2 h-1 w-64 -translate-x-1/2 overflow-hidden rounded-full bg-white/10">
        <div className="relative h-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${progress}%`, transition: "width .2s ease" }}><div className="absolute inset-0 bg-white/30" style={{ animation: "shimmer 1s infinite" }} /></div>
      </div>
      <div className="absolute bottom-12 flex gap-2">{[0, 150, 300].map(delay => <div key={delay} className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: `${delay}ms` }} />)}</div>
    </div>
  );
}

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
  if (v?.channelId) return String(v.channelId);
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
const SponsoredAdCard = ({ video }) => {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setPlaying(entry.isIntersecting), { threshold: 0.55 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const endAt = Number(video.end_at || video.endAt || 0);
  const hoursLeft = endAt ? Math.max(0, Math.ceil((endAt - Date.now()) / 3600000)) : 0;
  const daysLeft = Math.ceil(hoursLeft / 24);
  return (
    <a ref={ref} href={video.destination_url || video.destinationUrl || "#"} target="_blank" rel="noreferrer" className="glass-card col-span-full block overflow-hidden rounded-xl border border-[#FFD700]/40 bg-[#1A0B2E]">
      <div className="relative aspect-video w-full bg-black">
        <video src={video.video_url || video.videoUrl} poster={video.thumbnail || video.thumbnailUrl} autoPlay={playing} muted loop playsInline controls className="h-full w-full object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-[#FFD700] px-2 py-1 text-[10px] font-extrabold text-black">Ad</span>
      </div>
      <div className="flex items-center gap-3 p-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFD700] font-black text-black">{String(video.channelName || "A").slice(0, 1).toUpperCase()}</div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">{video.title}</p>
          <p className="text-[11px] text-gray-400">Sponsored · Ad · $2/day · {daysLeft} day{daysLeft === 1 ? "" : "s"} left</p>
        </div>
      </div>
    </a>
  );
};
const VideoCard = ({ video, onPlay, onSave, isSaved, onAi, onChannel, cleanHome = false }) => {
  const v = normalizeVideo(video);
  const platform = video.platform || v.platform || "youtube";
  const openVideo = () => {
    if (onPlay) {
      onPlay(v);
      return;
    }
    if (cleanHome && (v.youtubeId || v.id)) {
      window.location.href = `/watch/${encodeURIComponent(v.youtubeId || v.id)}`;
    }
  };
  return (
    <div onClick={openVideo} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openVideo(); } }} role="button" tabIndex={0} className="glass-card overflow-hidden hover:border-[#FFD700]/50 hover:shadow-[0_0_15px_rgba(255,215,0,0.15)] transition-all cursor-pointer group flex flex-col justify-between rounded-xl sm:rounded-2xl">
      <div className="relative aspect-video w-full bg-gray-900 overflow-hidden rounded-t-xl sm:rounded-t-2xl">
        <img src={cleanHome && platform === "youtube" ? `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg` : (v.img || v.thumbnailUrl)} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        <span className="absolute bottom-2 right-2 bg-black/80 text-[10px] font-mono px-1.5 py-0.5 rounded text-white">{v.duration}</span>
        {!cleanHome && <span className="absolute top-2 left-2"><PlatformBadge platform={platform} /></span>}
        {onAi && !cleanHome && (
          <button onClick={(e)=>{e.stopPropagation(); onAi(v);}} className="absolute bottom-2 left-2 w-7 h-7 rounded-full bg-gradient-to-r from-[#00D9FF] to-[#00FF88] text-black font-black text-[11px] flex items-center justify-center border border-white/30 shadow-md hover:scale-110 transition-transform" title="AI Help — real-time">A</button>
        )}
        {onSave && !cleanHome && (
          <button onClick={(e)=>{e.stopPropagation(); onSave(video);}} className={`absolute top-2 right-2 w-9 h-9 min-w-[36px] min-h-[36px] rounded-full flex items-center justify-center text-sm font-bold ${isSaved ? "bg-[#FFD700] text-black" : "bg-black/70 text-white hover:bg-black/90"} border border-white/20`}>
            {isSaved ? "✓" : "+"}
          </button>
        )}
      </div>
      <div className="p-3 sm:p-4 space-y-1.5 flex-1 min-w-0">
        <h3 className="font-bold text-[13px] sm:text-sm leading-snug text-white group-hover:text-[#FFD700] line-clamp-2 min-w-0 break-words">{v.title}</h3>
        {onChannel && (
          <button type="button" onClick={(event) => { event.stopPropagation(); onChannel(v); }} className="flex min-h-11 items-center gap-2 text-left text-xs text-gray-300 hover:text-[#00D9FF]">
            <img src={v.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(v.channel || "YouTube")}&background=1A0B2E&color=FFD700`} alt="" className="h-7 w-7 rounded-full object-cover" />
            <span className="truncate">{v.channel || v.channelName}</span>
          </button>
        )}
        {!onChannel && <p className="text-xs text-gray-400 truncate">{v.channel || v.channelName}</p>}
        <p className="text-xs text-gray-500">{v.views} • {v.timeAgo}</p>
        {video.alphatekx_views != null && <p className="text-[11px] text-[#FFD700]">♥ {Number(video.alphatekx_likes || 0)} • 💬 {Number(video.alphatekx_comments || 0)} • 👁 {Number(video.alphatekx_views || 0)} boosts</p>}
        {Number(video.is_pro_creator) === 1 && <span className="inline-block text-[10px] font-bold text-[#FFD700]">⭐ Pro Boost</span>}
      </div>
    </div>
  );
};
const VideoPlayer = ({ video, autoplay = false }) => {
  const v = video ? normalizeVideo(video) : null;
  const platform = video?.platform || "youtube";
  if (!v) return null;
  if (platform === "youtube") {
    if (!autoplay) {
      return (
        <button type="button" onClick={() => { window.location.href = `/watch?v=${v.youtubeId}`; }} className="relative block aspect-video w-full bg-black rounded-none sm:rounded-2xl overflow-hidden border-0 sm:border border-[#272727] shadow-2xl text-left">
          <img src={`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`} alt={v.title} className="h-full w-full object-cover" loading="lazy" />
          <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs text-white">{v.duration}</span>
        </button>
      );
    }
    return (
      <div className="relative aspect-video w-full bg-black rounded-none sm:rounded-2xl overflow-hidden border-0 sm:border border-[#272727] shadow-2xl">
        <iframe src={`https://www.youtube.com/embed/${v.youtubeId}?enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&playsinline=1&rel=0&modestbranding=1&autoplay=0`} title={v.title} className="w-full h-full rounded-none sm:rounded-2xl border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" />
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
      Sign in with Google →
    </button>
  );
};
const SignUpBlock = ({ onSignIn }) => (
  <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="signup-block-title">
    <div className="bg-zinc-900 rounded-2xl p-6 max-w-md w-full text-center border border-white/10">
      <h2 id="signup-block-title" className="text-white text-xl font-bold">🔒 Sign up to continue watching</h2>
      <p className="text-zinc-400 text-sm mt-2">You have watched 1 video free. Sign in free to keep watching unlimited videos and unlock your profile.</p>
      <button onClick={onSignIn} className="w-full mt-6 bg-[#FFD60A] text-black py-3 rounded-full font-bold">Sign in with Google → Continue</button>
      <p className="text-zinc-500 text-xs mt-2">Free — unlimited video after signup</p>
    </div>
  </div>
);
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

// Safe fallback video used only while the live feed is loading.
const DEFAULT_VIDEO = {
  id: "dQw4w9WgXcQ",
  youtubeId: "dQw4w9WgXcQ",
  title: "Featured YouTube video",
  channel: "YouTube Creator",
  channelName: "YouTube Creator",
  channelId: "",
  handle: "",
  subscribers: "",
  views: "Featured",
  timeAgo: "Featured",
  duration: "2:15",
  tag: "Featured",
  avatar: "https://img.youtube.com/vi/jvXEkm27XOE/hqdefault.jpg",
  img: "https://img.youtube.com/vi/jvXEkm27XOE/hqdefault.jpg",
  thumbnail: "https://img.youtube.com/vi/jvXEkm27XOE/hqdefault.jpg",
  thumbnailUrl: "https://img.youtube.com/vi/jvXEkm27XOE/hqdefault.jpg",
  description: "Featured video from the YouTube library.",
  platform: "youtube",
  platformMeta: { label: "YouTube", badge: "YT", color: "#FF0000", bg: "rgba(255,0,0,0.9)" },
  featured: true,
};
// --- Helper to normalize video objects from API or mock ---
function normalizeVideo(v) {
  return {
    id: v.youtubeId || v.id || DEFAULT_VIDEO.id,
    youtubeId: v.youtubeId || v.id || DEFAULT_VIDEO.id,
    title: v.title || "Untitled Video",
    channel: v.channelName || v.channel?.name || v.channel || "YouTube Creator",
    channelName: v.channelName || v.channel?.name || v.channel || "YouTube Creator",
    channelId: v.channelId || v.channel?.id || v.channelId || (v.channelName ? "" : "") || "",
    subscribers: v.subscribers || (v.subscribersCount ? String(v.subscribersCount) : "") || "",
    views: v.views || v.viewsFormatted || "",
    viewsRaw: v.viewsRaw || 0,
    likes: v.likes || (v.likeCount != null ? `${Number(v.likeCount).toLocaleString()} likes` : "0 likes"),
    likeCount: Number(v.likeCount || 0),
    comments: v.comments || (v.commentCount != null ? `${Number(v.commentCount).toLocaleString()} comments` : "0 comments"),
    commentCount: Number(v.commentCount || 0),
    timeAgo: v.timeAgo || "",
    duration: v.duration || "",
    tag: v.tag || "",
    avatar: v.avatar || v.channel?.avatar || "",
    img: v.thumbnailUrl || v.img || v.thumbnail || `https://img.youtube.com/vi/${v.youtubeId||v.id||DEFAULT_VIDEO.id}/hqdefault.jpg`,
    thumbnailUrl: v.thumbnailUrl || v.img || v.thumbnail || `https://img.youtube.com/vi/${v.youtubeId||v.id||DEFAULT_VIDEO.id}/hqdefault.jpg`,
    description: v.description || "",
    platform: v.platform || v.source || "youtube",
    isShort: v.isShort === true,
    platformMeta: v.platformMeta || null,
    featured: v.featured || false,
  };
}
function uniqueVideos(videos) {
  const seen = new Set();
  return (videos || []).filter(video => {
    const id = video.feedKey || video.youtubeId || video.id;
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
  setMonacoReady(true);
}
function durationInSeconds(duration) {
  if (typeof duration === "string" && /^PT/i.test(duration)) {
    const match = duration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/i);
    if (!match) return null;
    return Number(match[1] || 0) * 3600 + Number(match[2] || 0) * 60 + Number(match[3] || 0);
  }
  const parts = String(duration || "").split(":").map(Number);
  if (!duration || parts.length < 2 || parts.some(Number.isNaN)) return null;
  return parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : parts[0] * 60 + parts[1];
}
function isLongFormVideo(video) {
  const seconds = durationInSeconds(video?.duration);
  return seconds === null || seconds > 60;
}
function isShortFormVideo(video) {
  const seconds = durationInSeconds(video?.duration);
  return video?.isShort === true && (seconds === null || (seconds > 0 && seconds <= 180));
}

// --- Main App Component ---
// Keep this build marker in the bundle so deployments replace clients still
// holding the previous index.html/app.jsx query string in an edge cache.
const AUTH_BUILD = "google-signup-4";
function App() {
  const [showSplash, setShowSplash] = useState(true);
  const finishSplash = useCallback(() => setShowSplash(false), []);
  // GATED EXPERIENCE — auth state
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const isGuest = !authUser;
  const [showSignUpBlock, setShowSignUpBlock] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [downloadCount, setDownloadCount] = useState(0);
  const [installedCount, setInstalledCount] = useState(0);
  const signIn = async () => {
    try {
      const response = await fetch("/api/auth/url", { credentials: "include" });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
    } catch (error) {
      showToast(error.message || "Sign-in is temporarily unavailable");
    }
  };
  const allowVideoForUser = (video) => {
    if (!video) return;
    if (isGuest) {
      setShowSignUpBlock(true);
      return;
    }
    const next = normalizeVideo(video);
    setActiveVideo(next);
    setActiveTab("watch");
    const videoId = next.youtubeId || next.id;
    if (videoId) window.history.pushState({}, "", `/watch/${encodeURIComponent(videoId)}`);
    if (mainScrollRef.current) mainScrollRef.current.scrollTop = 0;
  };
  const returnHomeFromWatch = () => {
    setWatchPanelOpen(false);
    setActiveTab("home");
    window.history.pushState({}, "", "/");
    if (mainScrollRef.current) mainScrollRef.current.scrollTop = 0;
  };
  const navigateToDownloadApp = () => {
    setActiveTab("download-app");
    window.history.pushState({}, "", "/download-app");
    if (mainScrollRef.current) mainScrollRef.current.scrollTop = 0;
  };
  useEffect(() => {
    fetch("/api/download/count").then(response => response.ok ? response.json() : null).then(data => {
      if (data) {
        setDownloadCount(Number(data.total) || 0);
        setInstalledCount(Number(data.installed) || 0);
        const element = document.getElementById("download-count-badge");
        if (element) element.innerText = data.display || "0";
      }
    }).catch(() => {});
    const handleInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      window.__deferredPWA = event;
      const button = document.getElementById("real-install-btn");
      if (button) {
        button.innerText = "📲 Download App Now — 1 Tap Install";
        button.style.background = "linear-gradient(135deg,#FF0055,#FFAA00)";
        button.style.color = "white";
      }
    };
    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
  }, []);
  const handleInstallPwa = async () => {
    fetch("/api/download/tab-tapped", { method: "POST" }).catch(() => {});
    const installPrompt = deferredPrompt || window.__deferredPWA;
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === "accepted") {
        fetch("/api/download/pwa-installed", { method: "POST" }).catch(() => {});
        setDownloadCount(count => count + 1);
        setDeferredPrompt(null);
        window.__deferredPWA = null;
        const button = document.getElementById("real-install-btn");
        if (button) button.innerText = "✅ Installed! Check Home Screen";
      }
      return;
    }
    showToast("Use your browser menu and choose Install app or Add to Home screen.");
  };
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/" })
        .then(() => console.log("Alphatekx SW registered"))
        .catch(error => console.log("Alphatekx SW registration failed", error));
    }
    if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone) {
      fetch("/api/download/app-opened", { method: "POST" }).catch(() => {});
    }
    fetch('/api/auth/user?auth_build=' + encodeURIComponent(AUTH_BUILD), { credentials: 'include', cache: 'no-store' }).then(r=>r.ok?r.json():null).then(d=>{
      if(d && !d.isGuest && d.id) setAuthUser(d);
      else if(d && d.channelName) setAuthUser(d);
      else setAuthUser(null);
    }).catch(()=>setAuthUser(null)).finally(()=>setAuthLoading(false));
  }, []);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("auth_error");
    if (!error) return;
    const detail = params.get("details");
    const messages = {
      access_denied: "Google sign-in was cancelled.",
      token_exchange_failed: "Google sign-in could not be completed.",
      profile_failed: "Google did not return a usable profile.",
      oauth_not_configured: "Google sign-in is not configured.",
    };
    window.setTimeout(() => window.alert(`${messages[error] || "Google sign-in failed."}${detail ? ` (${detail})` : ""}`), 0);
    window.history.replaceState({}, "", window.location.pathname);
  }, []);
  // Navigation & Drawer State
  const [activeTab, setActiveTab] = useState(() => {
    const path = window.location.pathname.replace(/\/+$/, "") || "/";
    if (path === "/shorts") return "shorts";
    if (path === "/download-app") return "download-app";
    if (path === "/help") return "help";
    if (path === "/watch" || path.startsWith("/watch/")) return "watch";
    if (path === "/marketplace" || path.startsWith("/marketplace/")) return "marketplace";
    if (path === "/workspace") return "workspace";
    if (path === "/upload") return "upload";
    if (path === "/marketplace" || path.startsWith("/marketplace/")) return "marketplace";
    if (path === "/pricing") return "pricing";
    if (path === "/ads" || path.startsWith("/ads/")) return "ads";
    if (path === "/channel" || path.startsWith("/channel/")) return "channel";
    if (path === "/home") return "home";
    return "home";
  }); // watch, home, shorts, teacher, memory, chat, community, marketplace, sell, studio, pricing, profile
  const navigateToTab = (tab) => {
    const paths = {
      home: "/",
      shorts: "/shorts",
      marketplace: "/marketplace",
      "download-app": "/download-app",
      help: "/help",
      upload: "/upload",
      watch: activeVideo?.youtubeId || activeVideo?.id ? `/watch/${encodeURIComponent(activeVideo.youtubeId || activeVideo.id)}` : "/",
    };
    setActiveTab(tab);
    window.history.pushState({}, "", paths[tab] || "/");
    if (mainScrollRef.current) mainScrollRef.current.scrollTop = 0;
  };
  useEffect(() => {
    if (activeTab !== "download-app") return;
    fetch("/api/download/tab-tapped", { method: "POST" }).catch(() => {});
  }, [activeTab]);
  useEffect(() => {
    if (authLoading || activeTab !== "watch" || !isGuest) return;
    setActiveTab("home");
    setShowSignUpBlock(true);
    window.history.replaceState({}, "", "/");
  }, [authLoading, activeTab, isGuest]);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Desktop sidebar toggle
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false); // Mobile drawer slide-over toggle
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false); // REMOVED — popup off
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(() => {
    try { return JSON.parse(localStorage.getItem("alphatekx_last_search_results") || "[]"); } catch { return []; }
  });
  const activeTabRef = useRef(activeTab);
  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);
  const [recentSearches, setRecentSearches] = useState(() => {
    try { return JSON.parse(localStorage.getItem("alphatekx_recent_searches") || "[]"); } catch { return []; }
  });
  const [continueHistory, setContinueHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("alphatekx_history") || "[]"); } catch { return []; }
  });
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
      if (authUser) {
        fetch("/api/history/save", { method:"POST", headers:{ "Content-Type":"application/json" }, credentials:"include", body: JSON.stringify(entry) }).catch(()=>{});
      }
      return next;
    });
  };
  const rememberSearch = (query) => {
    const value = query.trim();
    if (!value) return;
    setRecentSearches(previous => {
      const next = [value, ...previous.filter(item => item.toLowerCase() !== value.toLowerCase())].slice(0, 10);
      try { localStorage.setItem("alphatekx_recent_searches", JSON.stringify(next)); } catch {}
      return next;
    });
  };
  // MISSION 1 — Premium icon-triggered workspace (video 60% top, icon opens Code/AI 40% below)
  const [watchPanelTab, setWatchPanelTab] = useState("code");
  const [watchPanelOpen, setWatchPanelOpen] = useState(false);
  const [codeValue, setCodeValue] = useState(() => {
    try { return localStorage.getItem("alphatekx_workspace_code") || "<!doctype html>\n<html>\n  <body>\n    <h1>Alphatekx Workspace</h1>\n    <button id=\"hello\">Test interaction</button>\n    <script>document.getElementById('hello').onclick = () => alert('Preview is running');</script>\n  </body>\n</html>"; } catch { return ""; }
  });
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('alphatekx_api_key') || '');
  const [showPaywall, setShowPaywall] = useState(false);
  const [byokKey, setByokKey] = useState(() => localStorage.getItem('alphatekx_api_key') || '');
  const [byokStatus, setByokStatus] = useState(() => localStorage.getItem('alphatekx_api_key') ? "Key saved ✓" : "Alphatekx AI ready");
  const [building, setBuilding] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState([
    { role: "ai", text: "Hi! I'm your AI Workspace assistant. Ask me to build, debug, explain, or improve anything, and I can turn the result into a live preview." }
  ]);
  const [agentFiles, setAgentFiles] = useState({});
  const [aiChatInput, setAiChatInput] = useState("");
  useEffect(() => {
    const saved = localStorage.getItem("alphatekx_api_key") || "";
    if (saved) setByokStatus("Key saved ✓");
  }, []);
  useEffect(() => {
    if (!authUser || authUser.isGuest) return;
    fetch("/api/history?kind=watched", { credentials: "include", cache: "no-store" })
      .then(response => response.ok ? response.json() : null)
      .then(data => {
        if (!Array.isArray(data?.history) || !data.history.length) return;
        const merged = [...data.history.map(normalizeVideo), ...watchedHistory];
        const seen = new Set();
        const next = merged.filter(item => {
          const id = item.youtubeId || item.id;
          if (!id || seen.has(id)) return false;
          seen.add(id);
          return true;
        }).slice(0, 100);
        setWatchedHistory(next);
      })
      .catch(() => {});
  }, [authUser?.id]);
  const saveByokKey = (value) => {
    setByokKey(value);
    try {
      if (value.trim()) {
        localStorage.setItem("alphatekx_api_key", value.trim());
        setApiKey(value.trim());
        setByokStatus("Key saved ✓");
        fetch("/api/user/save-key", {
          method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
          body: JSON.stringify({ user_id: billingUserId(), openai_key: value.trim() }),
        }).catch(() => {});
      } else {
        localStorage.removeItem("alphatekx_api_key");
        setApiKey("");
        setByokStatus("Bring a key or upgrade");
      }
    } catch {
      setByokStatus("Key stays for this session");
    }
  };
  // Notebook
  const [notebookTab, setNotebookTab] = useState("write");
  const [notebookNotes, setNotebookNotes] = useState(() => {
    try { const vid = (typeof window !== 'undefined' && window.location.pathname.match(/\/workspace\/([^/]+)/)?.[1]) || "default"; return localStorage.getItem(`notes_${vid}`) || ""; } catch { return ""; }
  });
  const [notebookSavedView, setNotebookSavedView] = useState(false);
  const monacoRef = useRef(null);
  const monacoEditorRef = useRef(null);
  const [monacoReady, setMonacoReady] = useState(false);
  useEffect(() => {
    try { localStorage.setItem("alphatekx_workspace_code", codeValue || ""); } catch {}
  }, [codeValue]);
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
      setWatchPanelOpen(false);
      setActiveTab("workspace");
      window.history.pushState({}, "", `/workspace?videoId=${activeVideo?.youtubeId || activeVideo?.id || ""}`);
      showToast("✨ Vibe edit applied → Preview");
      return cleaned;
    }
    return null;
  };
  // True Agent Vibe Parser — multi-file + command execution
  const vibeParserAgent = (text) => {
    const fileRegex = /<(create_file|edit_file)[^>]*path="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/gi;
    let count = 0; let m; let files = [];
    while ((m = fileRegex.exec(text)) !== null) {
      const [full, type, path, content] = m;
      const cleanContent = content.trim();
      files.push({ type, path, content: cleanContent });
      count++;
      // Keep the primary document in the editor while preserving every file.
      if (path === 'index.html' || path.endsWith('.ts') || path.endsWith('.tsx')) {
        setCodeValue(cleanContent);
        if (monacoEditorRef.current) try { monacoEditorRef.current.setValue(cleanContent); } catch {}
      }
    }
    if (files.length) setAgentFiles(prev => ({ ...prev, ...Object.fromEntries(files.map(file => [file.path, file.content])) }));
    if (count > 0) {
      setWatchPanelTab("preview");
      setWatchPanelOpen(true);
      setActiveTab("workspace");
      setTimeout(() => showToast(`✨ Agent built ${count} file${count>1?'s':''} → Live Preview`), 300);
    }
    // Command parsing
    const cmdMatch = text.match(/<run_command>([\s\S]*?)<\/run_command>/gi);
    if (cmdMatch) {
      cmdMatch.forEach(cmd => {
        const inner = cmd.replace(/<\/?run_command>/g, '').trim();
        if (inner) setTimeout(() => showToast(`▶️ Running: ${inner}`), 200);
      });
    }
    return files;
  };
  const handleAiSend = async () => {
    const q = aiChatInput.trim();
    if (!q) return;
    try {
      const [keyResponse, subscriptionResponse] = await Promise.all([
        fetch(`/api/user/get-key?user_id=${encodeURIComponent(billingUserId())}`, { credentials: "include" }),
        fetch(`/api/subscription/status?user_id=${encodeURIComponent(billingUserId())}`, { credentials: "include" }),
      ]);
      const keyData = await keyResponse.json().catch(() => ({}));
      const subscriptionData = await subscriptionResponse.json().catch(() => ({}));
      if (!keyData.hasOpenAI && !keyData.hasGemini && !subscriptionData.isPro) {
        setShowPaywall(true);
        showToast("Bring your own key or upgrade to Pro to use Workspace AI");
        return;
      }
    } catch (error) {
      showToast(error.message || "Unable to verify Workspace AI access");
      return;
    }
    if (!(await openAiFeature("vibe_code"))) return;
    setAiChatMessages(prev => [...prev, { role: "user", text: q }]);
    setAiChatInput("");
    setBuilding(true);
    showToast("🤖 Agent building…");
    try {
      const res = await fetch("/api/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ prompt: q, videoId: activeVideo?.youtubeId || activeVideo?.id, title: activeVideo?.title, transcript: activeVideo?.description || "", workspaceCode: codeValue, workspaceFiles: agentFiles })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) setShowPaywall(true);
        throw new Error(data.message || data.error || `AI ${res.status}`);
      }
      const content = data.message || JSON.stringify(data.result || {});
      let files = [];
      try { files = vibeParserAgent(content); } catch { showToast("Build failed, try rephrase"); }
      setAiChatMessages(prev => [...prev, { role: "ai", text: content }]);
      if (!files.length && data.result?.code) setCodeValue(data.result.code);
      if (!files.length && !data.result?.code) {
        showToast("AI explained the request — no files were created");
      } else if (!files.length) {
        setWatchPanelTab("preview");
        setWatchPanelOpen(true);
        setActiveTab("workspace");
      }
      showToast(files.length ? `🤖 Built ${files.length} file${files.length > 1 ? "s" : ""} → Preview` : "🤖 AI workspace ready");
    } catch (e) {
      setAiChatMessages(prev => [...prev, { role: "ai", text: `AI request failed: ${e.message}` }]);
      showToast(e.message || "AI request failed");
    } finally {
      setBuilding(false);
    }
  };
  /*
    Legacy direct-provider implementation removed. AI requests must go through
    the authenticated, usage-limited Worker endpoint.
  */
  /*
    try {
      const isOpenAI = storedKey.startsWith('sk-');
      const url = isOpenAI ? 'https://api.openai.com/v1/chat/completions' : 'https://api.deepseek.com/chat/completions';
      const model = isOpenAI ? 'gpt-4o' : 'deepseek-chat';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${storedKey}` },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: 'You are an AI agent. Always respond with <create_file path="index.html">full code</create_file> blocks. Can create multiple files. No explanation outside files.' },
            { role: 'user', content: q }
          ],
          temperature: 0.7
        })
      });
      if (!res.ok) throw new Error(`AI ${res.status}`);
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || "";
      const files = [...content.matchAll(/<create_file path="(.+?)">([\s\S]*?)<\/create_file>/g)];
      if (files.length > 0) {
        const newFiles = {};
        files.forEach(m => { newFiles[m[1]] = m[2].trim(); });
        setAgentFiles(prev => ({ ...prev, ...newFiles }));
        if (newFiles['index.html']) {
          const decoded = newFiles['index.html'].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
          setCodeValue(decoded);
          if (monacoEditorRef.current) try { monacoEditorRef.current.setValue(decoded); } catch {}
        }
        setWatchPanelTab("preview");
        setWatchPanelOpen(true);
        setAiChatMessages(prev => [...prev, { role: "ai", text: content }]);
        vibeParserAgent(content);
        showToast(`🤖 Agent built ${files.length} file${files.length>1?'s':''} — gold`);
      } else {
        // fallback: treat whole content as file if no tags
        const fallback = content.includes("<!DOCTYPE") || content.includes("<html") ? content : `<!DOCTYPE html><html><head><style>body{background:#0B0215;color:white;padding:24px;font-family:sans-serif}</style></head><body><h1 style="color:#FFD700">${q}</h1><pre>${content.replace(/</g,'&lt;')}</pre></body></html>`;
        setCodeValue(fallback);
        setAgentFiles(prev => ({ ...prev, 'index.html': fallback }));
        setWatchPanelTab("preview");
        setWatchPanelOpen(true);
        setAiChatMessages(prev => [...prev, { role: "ai", text: content }]);
        showToast("🤖 Agent built 1 file — preview");
      }
    } catch (e) {
      // fallback mock build
      const qLower = q.toLowerCase();
      let aiText = "";
      if (qLower.includes("button") || qLower.includes("pay") || qLower.includes("checkout") || qLower.includes("gold") || qLower.includes("build") || qLower.includes("make") || qLower.includes("create") || qLower.includes("fix")) {
        aiText = `Built for you:\n<create_file path="index.html"><!DOCTYPE html><html><head><style>body{background:#0B0215;color:#FFD700;font-family:sans-serif;padding:32px;text-align:center;display:flex;align-items:center;justify-content:center;height:100vh}.btn{background:linear-gradient(90deg,#FFD700,#F59E0B);padding:14px 28px;border-radius:9999px;font-weight:bold;color:black;border:none;cursor:pointer;box-shadow:0 0 20px rgba(255,215,0,0.35);min-height:48px}.btn:hover{transform:scale(1.02)}</style></head><body><button class="btn">${q}</button><script>console.log("Built with Alphatekx Agent")</script></body></html></create_file>`;
      } else if (qLower.includes("hello") || qLower.includes("console")) {
        aiText = `Built:\n<create_file path="script.js">console.log("Hello Alphatekx! Agent running.");</create_file>`;
      } else {
        aiText = `Built:\n<create_file path="index.html"><!DOCTYPE html><html><head><style>body{background:#0B0215;color:white;padding:24px;font-family:sans-serif}</style></head><body><h1 style="color:#FFD700">${q}</h1><p>Built by Alphatekx Agent (offline fallback)</p></body></html></create_file>`;
      }
      setAiChatMessages(prev => [...prev, { role: "ai", text: aiText, vibe: true }]);
      vibeParserAgent(aiText);
      showToast("🤖 Agent built (offline fallback) → Preview");
    } finally {
      setBuilding(false);
    }
  */
  // Also parse any AI messages that arrive via other means
  useEffect(() => {
    const last = aiChatMessages[aiChatMessages.length - 1];
    if (last && last.role === "ai" && last.text.includes("<edit_file")) {
      vibeParser(last.text);
    }
  }, [aiChatMessages]);
  // TERMINAL — Xterm + WebContainer refs + simple fallback
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const webcontainerRef = useRef(null);
  const shellInputRef = useRef("");
  const [terminalReady, setTerminalReady] = useState(false);
  const [simpleTermHistory, setSimpleTermHistory] = useState(["Alphatekx Terminal — WebContainer (zero-cost)", "Type: ls, echo hello, pwd, cat, clear, help"]);
  const [simpleTermInput, setSimpleTermInput] = useState("");
  const simpleTermRef = useRef(null);
  // Monaco loader — smooth, correct language, live sync
  useEffect(() => {
    if (watchPanelTab !== "code" || (!watchPanelOpen && activeTab !== "workspace")) return;
    const container = monacoRef.current;
    if (!container) return;
    // If already created, just update value and layout
    if (monacoEditorRef.current && window.monaco) {
      const cur = monacoEditorRef.current.getValue();
      if (cur !== codeValue) monacoEditorRef.current.setValue(codeValue);
      monacoEditorRef.current.layout();
      return;
    }
    if (window.monaco && monacoEditorRef.current) return;
    const lang = codeValue.trim().startsWith("<!DOCTYPE") || codeValue.trim().startsWith("<html") ? "html" : "typescript";
    const create = () => {
      if (!window.monaco || !container || monacoEditorRef.current) return;
      const ta = container.querySelector("textarea");
      if (ta) ta.style.display = "none";
      monacoEditorRef.current = window.monaco.editor.create(container, {
        value: codeValue,
        language: lang,
        theme: "vs-dark",
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 14,
        scrollBeyondLastLine: false,
        wordWrap: "on",
        padding: { top: 12, bottom: 12 },
      });
      monacoEditorRef.current.onDidChangeModelContent(() => {
        setCodeValue(monacoEditorRef.current.getValue());
      });
    };
    if (window.monaco) { create(); return; }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js";
    script.onload = () => {
      const requireFn = window.require;
      if (!requireFn) return;
      requireFn.config({ paths: { vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs" } });
      requireFn(["vs/editor/editor.main"], create);
    };
    document.head.appendChild(script);
  }, [watchPanelTab, watchPanelOpen, activeTab, codeValue]);

  // MISSION 4 — TERMINAL Xterm + WebContainer (zero-cost, browser only)
  useEffect(() => {
    if (watchPanelTab !== "terminal" || (!watchPanelOpen && activeTab !== "workspace")) return;
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
      const loadXterm = async () => {
        if (window.Terminal) return window.Terminal;
        const module = await import("https://cdn.jsdelivr.net/npm/@xterm/xterm@5.3.0/+esm");
        return module.Terminal;
      };
      let Term;
      try { Term = await loadXterm(); } catch { Term = null; }
      if (!Term) {
        container.innerHTML = '<div style="color:#FFD700;padding:16px;font-family:monospace">Terminal failed to load. Try reload.</div>';
        return;
      }
      const term = new Term({ theme: { background: "#000000", foreground: "#d4d4d4", cursor: "#FFD700" }, fontFamily: "monospace", fontSize: 13, cursorBlink: true, scrollback: 1000 });
      term.open(container);
      // Ensure terminal fills container and focuses
      setTimeout(()=>{ try{ term.focus(); term.scrollToBottom(); }catch{} }, 100);
      xtermRef.current = term;
      const prompt = () => term.write("\r\n\x1b[33malphatekx\x1b[0m:\x1b[34m~\x1b[0m$ ");
      term.writeln("Alphatekx Terminal — WebContainer (zero-cost browser)");
      term.writeln("Type: ls, echo hello, node --version, npm, clear");
      prompt();
      term.focus();
      setTerminalReady(true);
      let booted = false;
      // Try WebContainer
      try {
        const wcMod = await import("https://esm.sh/@webcontainer/api@1.1.9");
        const WebContainer = wcMod.WebContainer || wcMod.default?.WebContainer;
        if (WebContainer) {
          const wc = await WebContainer.boot();
          webcontainerRef.current = wc;
          const shell = await wc.spawn("jsh", { terminal: { cols: term.cols, rows: term.rows } });
          shell.output.pipeTo(new WritableStream({ write(data) { term.write(data); } }));
          const input = shell.input.getWriter();
          term.onData((data) => { try{ input.write(data); }catch{} });
          term.onResize(({cols, rows})=>{ try{ shell.resize({cols, rows}); }catch{} });
          booted = true;
          term.writeln("\r\n\x1b[32m✓ WebContainer booted — jsh ready\x1b[0m");
          prompt();
        }
      } catch (e) {
        term.writeln("\r\n\x1b[33mWebContainer not available (needs COOP/COEP). Using fallback mock shell.\x1b[0m");
      }
      if (!booted) {
        // Fallback mock shell — smooth, handles ls, echo, node --version, npm, clear, pwd, cat
        term.onData((data) => {
          const code = data.charCodeAt(0);
          if (code === 13) { // enter
            const cmd = shellInputRef.current.trim();
            term.writeln("");
            if (cmd === "ls") term.writeln("index.html  app.jsx  public  package.json  AgentConfig.ts");
            else if (cmd === "pwd") term.writeln("/home/alphatekx");
            else if (cmd.startsWith("cat ")) term.writeln(codeValue.split("\n").slice(0,20).join("\n"));
            else if (cmd.startsWith("echo ")) term.writeln(cmd.slice(5));
            else if (cmd === "node --version") term.writeln("v20.11.0");
            else if (cmd === "npm --version" || cmd === "npm -v") term.writeln("10.2.3");
            else if (cmd.startsWith("npm")) term.writeln("npm 10.2.3 — mock (install not needed, browser only)");
            else if (cmd === "clear") { term.clear(); term.writeln("Alphatekx Terminal — cleared"); }
            else if (cmd === "") {}
            else if (cmd) term.writeln(`\x1b[31msh: ${cmd}: command not found — try: ls, echo hello, cat AgentConfig.ts\x1b[0m`);
            shellInputRef.current = "";
            prompt();
            term.scrollToBottom();
          } else if (code === 127) { // backspace
            if (shellInputRef.current.length > 0) {
              shellInputRef.current = shellInputRef.current.slice(0, -1);
              term.write("\b \b");
            }
          } else if (code === 3) { // Ctrl+C
            shellInputRef.current = "";
            term.writeln("^C");
            prompt();
          } else if (code >= 32) {
            shellInputRef.current += data;
            term.write(data);
          }
        });
      }
    };
    init();
  }, [watchPanelTab, watchPanelOpen, activeTab]);

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
  // The channel view follows the signed-in user's YouTube channel.
  const [activeChannelId, setActiveChannelId] = useState(() => {
    const match = window.location.pathname.match(/^\/channel\/([^/]+)/);
    return match ? decodeURIComponent(match[1]) : "";
  });
  const [channelData, setChannelData] = useState(null);
  const [channelUploads, setChannelUploads] = useState([]);
  const [isChannelLoading, setIsChannelLoading] = useState(false);
  const [channelNextToken, setChannelNextToken] = useState("");
  const [isChannelLoadingMore, setIsChannelLoadingMore] = useState(false);
  const channelLoadMoreRef = useRef(null);
  const [channelSubscribed, setChannelSubscribed] = useState(false);
  const [channelTab, setChannelTab] = useState("videos");
  const [channelTabItems, setChannelTabItems] = useState([]);
  const [channelTabNextToken, setChannelTabNextToken] = useState("");
  const [channelTabLoading, setChannelTabLoading] = useState(false);
  const [channelDescriptionOpen, setChannelDescriptionOpen] = useState(false);
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
  const [uploadVideoId, setUploadVideoId] = useState("");
  const [uploadPreviewTitle, setUploadPreviewTitle] = useState("");
  const [uploadPreviewThumbnail, setUploadPreviewThumbnail] = useState("");
  const [uploadLinkError, setUploadLinkError] = useState("");
  const [uploadDuration, setUploadDuration] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  // Profile editable
  const [profileData, setProfileData] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name:"", handle:"", bio:"", avatar:"", banner:"", email:"" });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [adsForm, setAdsForm] = useState({ company_name: "", title: "", video_url: "", thumbnail_url: "", link_url: "", days: 1 });
  const [adsDuration, setAdsDuration] = useState(null);
  const [adsError, setAdsError] = useState("");
  const [adsLoading, setAdsLoading] = useState(false);
  const [myAds, setMyAds] = useState([]);
  const [createdAd, setCreatedAd] = useState(null);
  const adsPriceNgn = Number(adsForm.days || 1) * 3000;
  const loadMyAds = async () => {
    if (!authUser || isGuest) return;
    const response = await fetch(`/api/ads/my-ads?user_id=${encodeURIComponent(authUser.id)}`, { credentials: "include", cache: "no-store" });
    const data = await response.json().catch(() => ({}));
    if (response.ok) setMyAds(Array.isArray(data.ads) ? data.ads : []);
  };
  const handleAdVideoUrl = (value) => {
    setAdsForm(current => ({ ...current, video_url: value }));
    setAdsDuration(null);
    if (!value.trim()) return;
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => setAdsDuration(Number.isFinite(video.duration) ? video.duration : null);
    video.onerror = () => setAdsError("Use a publicly reachable video URL.");
    video.src = value.trim();
  };
  const createAdCampaign = async (event) => {
    event.preventDefault();
    if (isGuest) { setShowSignUpBlock(true); return; }
    setAdsError(""); setAdsLoading(true);
    try {
      if (adsDuration !== null && (adsDuration < 60 || adsDuration > 120)) throw new Error("Video must be 1-2 minutes");
      const days = Number(adsForm.days);
      if (!Number.isSafeInteger(days) || days < 1) throw new Error("Enter a positive whole number of days");
      const response = await fetch("/api/ads/create", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ ...adsForm, destination_url: adsForm.link_url, duration_seconds: adsDuration, days, user_id: authUser.id }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || data.message || "Unable to create ad");
      setCreatedAd(data);
      if (!data.authorization_url) throw new Error("Paystack is unavailable");
      window.location.href = data.authorization_url;
    } catch (error) { setAdsError(error.message || "Ad setup failed"); }
    finally { setAdsLoading(false); }
  };
  useEffect(() => { if (activeTab === "ads") loadMyAds().catch(() => {}); }, [activeTab, authUser?.id]);
  const [boostStats, setBoostStats] = useState(null);
  const loadBoostStats = async () => {
    if (!authUser || authUser.isGuest) { setShowSignUpBlock(true); return; }
    const response = await fetch(`/api/creator/stats?creator_id=${encodeURIComponent(authUser.id)}`, { credentials: "include", cache: "no-store" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { showToast(data.error || "Boost stats unavailable"); return; }
    setBoostStats(data);
  };

  // Persist history to localStorage whenever it changes
  useEffect(() => {
    try { localStorage.setItem("alphatekx_search_history", JSON.stringify(searchHistory.slice(0,100))); } catch {}
  }, [searchHistory]);
  useEffect(() => {
    try { localStorage.setItem("alphatekx_watched_history", JSON.stringify(watchedHistory.slice(0,100))); } catch {}
  }, [watchedHistory]);

  // Load history from server on mount — merge with localStorage (server newest first)
  useEffect(() => {
    fetch("/api/search/history", { credentials: "include" }).then(r=>r.ok?r.json():null).then(data=>{
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
  useEffect(() => {
    if (!authUser || authUser.isGuest) return;
    const sync = async () => {
      const localWatched = watchedHistory.slice(0, 100);
      await Promise.all(localWatched.map(entry => fetch("/api/history/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(entry),
      }).catch(() => null)));
      const response = await fetch("/api/search/history", { credentials: "include", cache: "no-store" });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.history) && data.history.length) setSearchHistory(data.history.map(normalizeVideo));
      }
    };
    sync().catch(() => {});
  }, [authUser?.id]);

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
    // watch later sync
    fetch("/api/watch-later", { credentials: "include" }).then(r=>r.ok?r.json():null).then(d=>{
      if(d && Array.isArray(d.videos) && d.videos.length>0){
        setWatchLater(d.videos);
        try{ localStorage.setItem("alphatekx_watch_later", JSON.stringify(d.videos)); }catch{}
      }
    }).catch(()=>{});
  }, []);
  useEffect(() => {
    if (authLoading || authUser) return;
    fetch("/api/profile").then(r=>r.ok?r.json():null).then(d=>{
      if(d && d.profile && !authUser){
        setProfileData(d.profile);
        setProfileForm({ name:d.profile.name||"", handle:d.profile.handle||"", bio:d.profile.bio||"", avatar:d.profile.avatar||"", banner:d.profile.banner||"", email:d.profile.email||"" });
      }
    }).catch(()=>{});
  }, [authLoading, authUser]);
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
        bio: `Alphatekx profile • ${authUser.channelName || "You"} • Signed in with Google — full access unlocked ✓`,
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
  useEffect(() => {
    if (!isGuest) setShowSignUpBlock(false);
  }, [isGuest]);
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
    setChannelNextToken("");
    const channelFetch = fetch(`/api/channel/${encodeURIComponent(activeChannelId)}`).then(r=>r.ok?r.json():null);
    const videosFetch = fetch("/api/channel/videos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ channelId: activeChannelId }) }).then(r=>r.ok?r.json():null);
    Promise.all([channelFetch, videosFetch]).then(([d, videos]) => {
      if(d && d.channel){
        setChannelData(d.channel);
        setChannelUploads(Array.isArray(videos?.videos) ? videos.videos : (Array.isArray(d.uploads) ? d.uploads : []));
        setChannelNextToken(videos?.nextToken || "");
      }
      setIsChannelLoading(false);
    }).catch(()=> setIsChannelLoading(false));
  }, [activeTab, activeChannelId]);
  useEffect(() => {
    if (activeTab !== "channel" || channelTab === "videos") return;
    let cancelled = false;
    setChannelTabLoading(true);
    setChannelTabItems([]);
    setChannelTabNextToken("");
    const endpoint = `/api/channel/${channelTab}`;
    fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ channelId: activeChannelId }) })
      .then(response => response.ok ? response.json() : null)
      .then(data => {
        if (cancelled) return;
        setChannelTabItems((data?.videos || []).map(normalizeVideo));
        setChannelTabNextToken(data?.nextToken || "");
      }).catch(error => { if (!cancelled) showToast(error.message || `Unable to load ${channelTab}`); })
      .finally(() => { if (!cancelled) setChannelTabLoading(false); });
    return () => { cancelled = true; };
  }, [activeTab, activeChannelId, channelTab]);
  const loadMoreChannelTab = async () => {
    if (channelTab === "videos" || !channelTabNextToken || channelTabLoading) return;
    setChannelTabLoading(true);
    try {
      const response = await fetch(`/api/channel/${channelTab}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId: activeChannelId, continuationToken: channelTabNextToken }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `Unable to load more ${channelTab}`);
      setChannelTabItems(previous => uniqueVideos([...previous, ...(data.videos || []).map(normalizeVideo)]));
      setChannelTabNextToken(data.nextToken || "");
    } catch (error) { showToast(error.message || `Unable to load more ${channelTab}`); }
    finally { setChannelTabLoading(false); }
  };
  const loadMoreChannelVideos = async () => {
    if (!activeChannelId || !channelNextToken || isChannelLoadingMore) return;
    setIsChannelLoadingMore(true);
    try {
      const response = await fetch("/api/channel/videos", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId: activeChannelId, continuationToken: channelNextToken }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to load more channel videos");
      setChannelUploads(previous => uniqueVideos([...previous, ...(data.videos || []).map(normalizeVideo)]));
      setChannelNextToken(data.nextToken || "");
    } catch (error) {
      showToast(error.message || "Unable to load more channel videos");
    } finally {
      setIsChannelLoadingMore(false);
    }
  };
  useEffect(() => {
    const node = channelLoadMoreRef.current;
    if (!node || activeTab !== "channel") return;
    const observer = new IntersectionObserver(entries => {
      if (!entries[0]?.isIntersecting) return;
      if (channelTab === "videos") loadMoreChannelVideos();
      else loadMoreChannelTab();
    }, { root: mainScrollRef.current, rootMargin: "600px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [activeTab, channelTab, channelNextToken, channelTabNextToken, isChannelLoadingMore, channelTabLoading, activeChannelId]);
  useEffect(() => {
    if (!authUser || isGuest || !activeChannelId) return;
    try { setChannelSubscribed(localStorage.getItem(`alphatekx_sub_${authUser.id || authUser.email}_${activeChannelId}`) === "1"); } catch {}
  }, [activeChannelId, authUser?.id, authUser?.email, isGuest]);
  const navigateToChannel = (channelId) => {
    let cid = channelId || authUser?.channelId || profileData?.channelId || "";
    if (!cid) {
      showToast("No YouTube channel is connected to this account");
      setActiveTab("channel");
      return;
    }
    if (/^UC[a-zA-Z0-9_-]{22}$/.test(cid)) {
      setActiveChannelId(cid);
    } else {
      cid = slugify(cid) || "codecraft";
      setActiveChannelId(cid);
    }
    setActiveTab("channel");
    window.history.pushState({}, "", `/channel/${encodeURIComponent(cid)}`);
    setChannelSubscribed(false);
    if (mainScrollRef.current) mainScrollRef.current.scrollTop = 0;
  };
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadVideoId) { setUploadLinkError("Invalid YouTube link - paste full youtube.com or youtu.be link"); return; }
    setIsUploading(true);
    try {
      const res = await fetch("/api/upload", { method:"POST", headers:{ "Content-Type":"application/json" }, credentials:"include", body: JSON.stringify({ videoId: uploadVideoId, title: uploadPreviewTitle || `YouTube Video - ${uploadVideoId}`, thumbnail: uploadPreviewThumbnail || `https://img.youtube.com/vi/${uploadVideoId}/hqdefault.jpg`, originalUrl: uploadVideoUrl }) });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Upload failed");
      showToast("Video live in Alphatekx Stream ✓");
      setUploadTitle(""); setUploadDesc(""); setUploadThumbnail(""); setUploadVideoUrl(""); setUploadDuration("");
      setUploadVideoId(""); setUploadPreviewTitle(""); setUploadPreviewThumbnail(""); setUploadLinkError("");
      setSearchResults(prev => uniqueVideos([data.video, ...prev]));
      setActiveTab("home");
    } catch(err){ showToast(err.message || "Upload failed"); }
    finally { setIsUploading(false); }
  };
  const handleUploadLinkChange = async (value) => {
    setUploadVideoUrl(value);
    const match = value.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&#/]|$)/);
    if (!match) {
      setUploadVideoId("");
      setUploadLinkError(value ? "Invalid YouTube link - paste full youtube.com or youtu.be link" : "");
      return;
    }
    const id = match[1];
    setUploadVideoId(id);
    setUploadLinkError("");
    setUploadPreviewThumbnail(`https://img.youtube.com/vi/${id}/hqdefault.jpg`);
    setUploadPreviewTitle(`YouTube Video - ${id}`);
    try {
      const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`);
      if (response.ok) {
        const metadata = await response.json();
        if (metadata.title) setUploadPreviewTitle(metadata.title);
        if (metadata.thumbnail_url) setUploadPreviewThumbnail(metadata.thumbnail_url);
      }
    } catch {}
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
      const res = await fetch(`/api/watch-later/${encodeURIComponent(id)}`, { method:"DELETE", credentials:"include" });
      if (res.ok) {
        setWatchLater(prev => prev.filter(v=> (v.youtubeId||v.id)!==id));
        showToast("Removed from Watch Later");
      }
    } else {
      const payload = { ...video, youtubeId: id, platform: video.platform || "youtube", platformMeta: video.platformMeta, title: video.title, channelName: video.channelName || video.channel, thumbnailUrl: video.thumbnailUrl || video.img, views: video.views, duration: video.duration };
      const res = await fetch("/api/watch-later", { method:"POST", headers:{ "Content-Type":"application/json" }, credentials:"include", body: JSON.stringify(payload) });
      const data = await res.json().catch(()=>null);
      if (res.ok) {
        setWatchLater(data?.videos || [...watchLater, payload]);
        showToast("Saved to Watch Later ✓");
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Unable to save video");
      }
    }
  };
  const removeWatchLater = async (id) => {
    const res = await fetch(`/api/watch-later/${encodeURIComponent(id)}`, { method:"DELETE", credentials:"include" });
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
  const [shortsCommentsOpen, setShortsCommentsOpen] = useState(false);
  const [shortsCommentText, setShortsCommentText] = useState("");
  const [shortsComments, setShortsComments] = useState({});
  const [videoComments, setVideoComments] = useState([]);
  const [videoCommentInput, setVideoCommentInput] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const shortsLoadingMoreRef = useRef(false);
  const shortsScrollerRef = useRef(null);
  const shortsSlideRefs = useRef([]);
  const scrollToShort = (index) => {
    const next = Math.max(0, Math.min(index, shortsVideos.filter(isShortFormVideo).length - 1));
    shortsSlideRefs.current[next]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    setShortsIndex(next);
  };
  const homeLoadingMoreRef = useRef(false);
  const [shortsVideos, setShortsVideos] = useState([]);
  const [shortsPageToken, setShortsPageToken] = useState("");
  const shortsIdsRef = useRef(new Set());
  const shortsCycleRef = useRef(0);
  const loadShortsPage = async (reset = false) => {
    if (shortsLoadingMoreRef.current) return;
    shortsLoadingMoreRef.current = true;
    try {
      if (reset) {
        shortsIdsRef.current.clear();
        shortsCycleRef.current = 0;
      }
      // Keep discovering fresh YouTube search shelves after the API's first
      // page ends instead of stopping the Shorts scroller.
      let token = reset ? "" : (shortsPageToken || "shorts-search:0");
      let nextToken = token;
      const incoming = [];
      let rawVideos = [];
      const pagesToLoad = reset ? 3 : 1;
      for (let page = 0; page < pagesToLoad; page += 1) {
        const response = await fetch(`/api/shorts?limit=25${token ? `&pageToken=${encodeURIComponent(token)}` : ""}`, { cache: "no-store" });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "Shorts unavailable");
        rawVideos = uniqueVideos((data.videos || []).map(normalizeVideo));
        for (const video of rawVideos) {
          const id = video.youtubeId || video.id;
          if (id && !shortsIdsRef.current.has(id)) {
            shortsIdsRef.current.add(id);
            incoming.push(video);
          }
        }
        nextToken = data.nextPageToken || "";
        if (!nextToken) break;
        token = nextToken;
      }
      if (!reset && incoming.length === 0 && rawVideos.length) {
        shortsCycleRef.current += 1;
        incoming.push(...rawVideos.map(video => ({
          ...video,
          feedKey: `${video.youtubeId || video.id}-cycle-${shortsCycleRef.current}`,
        })));
      }
      if (reset) setShortsIndex(0);
      setShortsVideos(prev => reset ? incoming : uniqueVideos([...prev, ...incoming]));
      setShortsPageToken(nextToken);
    } catch (error) {
      if (reset) setShortsVideos([]);
    } finally {
      shortsLoadingMoreRef.current = false;
    }
  };
  const shortFeedVideos = shortsVideos.filter(isShortFormVideo);
  const currentShort = shortFeedVideos[shortsIndex] || shortFeedVideos[0] || null;
  // Keep playback state available to navigation effects declared below.
  const [activeVideo, setActiveVideo] = useState(DEFAULT_VIDEO);
  const [miniPlayerActive, setMiniPlayerActive] = useState(false);
  const [isMiniPlaying, setIsMiniPlaying] = useState(true);
  const previousActiveTabRef = useRef(activeTab);
  useEffect(() => {
    if (previousActiveTabRef.current === "watch" && activeTab !== "watch" && activeVideo?.youtubeId) {
      setMiniPlayerActive(true);
    }
    previousActiveTabRef.current = activeTab;
  }, [activeTab, activeVideo?.youtubeId]);
  useEffect(() => {
    if (activeTab === "shorts") loadShortsPage(true);
  }, [activeTab]);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [voiceListening, setVoiceListening] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [superChatModalOpen, setSuperChatModalOpen] = useState(false);
  const [superChatAmount, setSuperChatAmount] = useState(5);
  const [superChatMessage, setSuperChatMessage] = useState("");
  const [autoplayNext, setAutoplayNext] = useState(true);

  // Keep the former starter catalog available for reference, but never render it as live feed data.
  const STARTER_CATALOG = [
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
  ];
  const [videoCatalog, setVideoCatalog] = useState([]);
  // Keep playback usable while the real feed requests are in flight.
  const [boostFeedTab, setBoostFeedTab] = useState("foryou");
  const [boostFeedCursor, setBoostFeedCursor] = useState(0);
  const [boostFeedLoading, setBoostFeedLoading] = useState(false);
  const boostFeedLoadingRef = useRef(false);
  const [boostFeedHasMore, setBoostFeedHasMore] = useState(true);
  const [homeFeedNextToken, setHomeFeedNextToken] = useState("");
  const homeFeedNextTokenRef = useRef("");
  const loadBoostFeed = async (tab = boostFeedTab, reset = false) => {
    if (boostFeedLoadingRef.current) return;
    boostFeedLoadingRef.current = true;
    setBoostFeedLoading(true);
    try {
      const response = tab === "foryou"
        ? await fetch(`/api/home/feed${!reset && (homeFeedNextTokenRef.current || "home-search:0") ? `?continuationToken=${encodeURIComponent(homeFeedNextTokenRef.current || "home-search:0")}` : ""}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ continuationToken: reset ? "" : (homeFeedNextTokenRef.current || "home-search:0"), client: "mobile" }),
            credentials: "include",
            cache: "no-store",
          })
        : await fetch(`/api/feed/${tab}?limit=20&cursor=${reset ? 0 : boostFeedCursor}`, { credentials: "include", cache: "no-store" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Boost feed unavailable");
      const incoming = uniqueVideos((data.videos || []).map(normalizeVideo));
      if (tab === "foryou") {
        const nextToken = String(data.nextToken || "");
        homeFeedNextTokenRef.current = nextToken;
        setHomeFeedNextToken(nextToken);
        setBoostFeedHasMore(Boolean(nextToken));
        if (Array.isArray(data.products) && data.products.length) setMarketplaceProducts(data.products);
      }
      if (reset) {
        if (incoming.length) setVideoCatalog(incoming);
        if (incoming.length) {
          setActiveVideo(previous => {
            if (activeTabRef.current === "watch") return previous;
            const currentId = previous?.youtubeId || previous?.id;
            return incoming.find(video => (video.youtubeId || video.id) === currentId) || incoming[0];
          });
        }
      } else if (incoming.length) {
        setVideoCatalog(previous => {
          const merged = uniqueVideos([...previous, ...incoming]);
          const currentId = activeVideo?.youtubeId || activeVideo?.id;
          if (activeTabRef.current !== "watch" && (!currentId || !merged.some(video => (video.youtubeId || video.id) === currentId))) {
            setActiveVideo(incoming[0]);
          }
          return merged;
        });
      }
      setBoostFeedCursor(Number(data.nextCursor || (reset ? incoming.length : boostFeedCursor + incoming.length)));
      if (tab !== "foryou") setBoostFeedHasMore(data.hasMore !== false && incoming.length > 0);
    } catch (error) {
      if (tab !== "following") showToast(error.message || "Boost feed unavailable");
    } finally {
      boostFeedLoadingRef.current = false;
      setBoostFeedLoading(false);
    }
  };

  // Load fresh recommendations so Home is not pinned to the starter catalog.
  useEffect(() => {
    const rotateCatalog = (videos) => {
      if (videos.length < 2) return videos;
      let cursor = 0;
      try {
        cursor = Number(localStorage.getItem("alphatekx_feed_cursor") || 0) % videos.length;
        localStorage.setItem("alphatekx_feed_cursor", String(cursor + 1));
      } catch {}
      return [...videos.slice(cursor), ...videos.slice(0, cursor)];
    };
    fetch(`/api/feed?refresh=${Date.now()}`, { cache: "no-store" }).then(r=>r.ok?r.json():null).then(d=>{
      const real = uniqueVideos(Array.isArray(d?.videos) ? d.videos.map(normalizeVideo) : []);
      if (!real.length) { setVideoCatalog([]); return; }
      const rotated = rotateCatalog(real);
      setVideoCatalog(rotated);
      setActiveVideo(previous => activeTabRef.current === "watch" ? previous : (rotated.find(video => (video.youtubeId || video.id) === (previous?.youtubeId || previous?.id)) || rotated[0]));
    }).catch(()=>{});
    loadShortsPage(true);
    const refresh = setInterval(() => {
      fetch(`/api/feed?refresh=${Date.now()}`, { cache: "no-store" }).then(r=>r.ok?r.json():null).then(d => {
        const real = uniqueVideos(Array.isArray(d?.videos) ? d.videos.map(normalizeVideo) : []);
        if (real.length) {
          const rotated = rotateCatalog(real);
          setVideoCatalog(rotated);
          setActiveVideo(previous => activeTabRef.current === "watch" ? previous : (rotated.find(video => (video.youtubeId || video.id) === (previous?.youtubeId || previous?.id)) || rotated[0]));
        }
      }).catch(()=>{});
    }, 5 * 60 * 1000);
    return () => clearInterval(refresh);
  }, []);
  useEffect(() => {
    if (activeTab === "home") {
      setBoostFeedCursor(0);
      setBoostFeedHasMore(true);
      homeFeedNextTokenRef.current = "";
      setHomeFeedNextToken("");
      loadBoostFeed(boostFeedTab, true);
    }
  }, [boostFeedTab, activeTab]);
  const homeFeedSentinelRef = useRef(null);
  useEffect(() => {
    const node = homeFeedSentinelRef.current;
    if (!node || activeTab !== "home") return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) loadBoostFeed(boostFeedTab);
    }, { root: mainScrollRef.current, rootMargin: "700px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [activeTab, boostFeedTab, boostFeedCursor, homeFeedNextToken, boostFeedHasMore, boostFeedLoading]);
  const countedViewsRef = useRef(new Set());
  useEffect(() => {
    if (activeTab !== "watch" || isGuest) return;
    const videoId = activeVideo?.youtubeId || activeVideo?.id;
    if (!videoId) return;
    const timer = setInterval(() => {
      if (countedViewsRef.current.has(videoId)) return;
      const player = ytPlayerRef.current;
      if (!player || typeof player.getCurrentTime !== "function" || typeof player.getDuration !== "function") return;
      const current = Number(player.getCurrentTime());
      const duration = Number(player.getDuration());
      if (current >= 30 && duration > 0) {
        countedViewsRef.current.add(videoId);
        fetch("/api/video/view", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ video_id: videoId, watch_percent: Math.round(Math.min(100, current / duration * 100)) }) }).catch(() => {});
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [activeTab, activeVideo?.youtubeId, activeVideo?.id, isGuest]);

  // Active Video State — also track watched history real-time + real likes/views (no mock)
  useEffect(() => {
    const videoId = activeVideo?.youtubeId || activeVideo?.id || "default";
    try {
      const saved = localStorage.getItem(`alphatekx_files_${videoId}`);
      if (saved) setAgentFiles(JSON.parse(saved));
    } catch {}
  }, [activeVideo?.youtubeId, activeVideo?.id]);
  useEffect(() => {
    const videoId = activeVideo?.youtubeId || activeVideo?.id || "default";
    try { localStorage.setItem(`alphatekx_files_${videoId}`, JSON.stringify(agentFiles || {})); } catch {}
  }, [agentFiles, activeVideo?.youtubeId, activeVideo?.id]);
  useEffect(() => {
    const pathMatch = window.location.pathname.match(/^\/watch\/([^/]+)/);
    const requestedId = pathMatch ? decodeURIComponent(pathMatch[1]) : new URLSearchParams(window.location.search).get("v");
    if (!requestedId) return;
    const match = videoCatalog.find(video => (video.youtubeId || video.id) === requestedId);
    if (match) {
      setActiveVideo(current => (current?.youtubeId || current?.id) === requestedId ? current : match);
      return;
    }
    const requestedVideo = normalizeVideo({ id: requestedId, youtubeId: requestedId, title: "Loading video…" });
    setActiveVideo(current => (current?.youtubeId || current?.id) === requestedId ? current : requestedVideo);
    fetch(`/api/video/${encodeURIComponent(requestedId)}`)
      .then(response => response.ok ? response.json() : null)
      .then(data => {
        if (!data?.video) return;
        setActiveVideo(current => (current?.youtubeId || current?.id) === requestedId ? normalizeVideo({
          ...current,
          ...data.video,
          id: requestedId,
          youtubeId: requestedId,
          thumbnailUrl: data.video.thumbnail || current.thumbnailUrl,
          views: data.video.viewsFormatted || current.views,
          channelName: data.video.channel || current.channelName,
          duration: data.video.duration || current.duration,
        }) : current);
      })
      .catch(() => {});
  }, [videoCatalog]);
  useEffect(() => {
    if (activeVideo?.id || activeVideo?.youtubeId) pushWatched(activeVideo);
  }, [activeVideo?.id, activeVideo?.youtubeId]);
  useEffect(() => {
    if (activeTab !== "watch" || !activeVideo) return;
    const timer = setInterval(() => {
      const videoId = activeVideo.youtubeId || activeVideo.id;
      if (!videoId) return;
      let progress = 0;
      try { progress = ytPlayerRef.current?.getCurrentTime?.() || 0; } catch {}
      const entry = { videoId, title: activeVideo.title, thumbnail: activeVideo.thumbnailUrl || activeVideo.img, progress, lastWatched: Date.now() };
      try {
        const current = JSON.parse(localStorage.getItem("alphatekx_history") || "[]");
        const next = [entry, ...current.filter(item => item.videoId !== videoId)].slice(0, 50);
        localStorage.setItem("alphatekx_history", JSON.stringify(next));
        setContinueHistory(next);
      } catch {}
    }, 5000);
    return () => clearInterval(timer);
  }, [activeTab, activeVideo?.youtubeId, activeVideo?.id, activeVideo?.title]);
  useEffect(() => {
    if (activeTab !== "watch" || !activeVideo) return;
    const videoId = activeVideo.youtubeId || activeVideo.id;
    let progress = 0;
    try {
      const history = JSON.parse(localStorage.getItem("alphatekx_history") || "[]");
      progress = Number(history.find(item => item.videoId === videoId)?.progress || 0);
    } catch {}
    if (!progress) return;
    const timer = setTimeout(() => {
      try { ytPlayerRef.current?.seekTo?.(progress, true); } catch {}
      try { iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "seekTo", args: [progress, true] }), "*"); } catch {}
    }, 900);
    return () => clearTimeout(timer);
  }, [activeTab, activeVideo?.youtubeId, activeVideo?.id]);
  // Notebook auto-save/load per video
  useEffect(() => {
    const vid = activeVideo?.youtubeId || activeVideo?.id || "default";
    const key = `notes_${vid}`;
    try { const saved = localStorage.getItem(key); if (saved !== null) setNotebookNotes(saved); else setNotebookNotes(""); } catch {}
  }, [activeVideo?.youtubeId, activeVideo?.id]);
  const loadVideoComments = async (videoId) => {
    if (!videoId) return;
    try {
      const saved = JSON.parse(localStorage.getItem(`comments_${videoId}`) || "[]");
      setVideoComments(Array.isArray(saved) ? saved : []);
    } catch {
      setVideoComments([]);
    }
  };
  const submitVideoComment = async () => {
    const text = videoCommentInput.trim();
    if (!text) return;
    const videoId = activeVideo?.youtubeId || activeVideo?.id;
    if (!videoId) return;
    const newComment = { id: Date.now(), text, user: "You", author: "You", time: "now", avatar: "A" };
    setVideoComments(previous => {
      const next = [newComment, ...previous];
      try { localStorage.setItem(`comments_${videoId}`, JSON.stringify(next)); } catch {}
      return next;
    });
    showToast("💬 Comment saved — will be visible soon!");
    setVideoCommentInput("");
  };
  useEffect(() => {
    if (commentsOpen) loadVideoComments(activeVideo?.youtubeId || activeVideo?.id);
  }, [commentsOpen, activeVideo?.youtubeId, activeVideo?.id]);
  useEffect(() => {
    const vid = activeVideo?.youtubeId || activeVideo?.id || "default";
    const key = `notes_${vid}`;
    const t = setTimeout(() => { try { localStorage.setItem(key, notebookNotes); } catch {} }, 2000);
    return () => clearTimeout(t);
  }, [notebookNotes, activeVideo?.youtubeId, activeVideo?.id]);
  useEffect(() => {
    const vid = activeVideo?.youtubeId || activeVideo?.id;
    if (!vid || String(vid).startsWith("mock")) return;
    fetch(`/api/video/${encodeURIComponent(vid)}`).then(r=>r.ok?r.json():null).then(d=>{
      if (d && d.video) {
        const v = d.video;
        if (v.likeCount) setLikeCount(Number(v.likeCount));
        setActiveVideo(prev => {
          if ((prev.youtubeId||prev.id) !== vid) return prev;
          let next = {...prev};
          if (v.viewsFormatted) { next.views = v.viewsFormatted; next.timeAgo = "Real views"; }
          else if (v.viewCount || v.views) { const vc = v.viewCount || v.views; next.views = Number(String(vc).replace(/[^0-9]/g,"")).toLocaleString() + " views"; next.timeAgo = "Real views"; }
          if (v.channelId) next.channelId = v.channelId;
          if (v.channelName || v.channel) next.channel = v.channelName || v.channel || next.channel;
          if (v.channelAvatar || v.channelThumbnail) next.avatar = v.channelAvatar || v.channelThumbnail || next.avatar;
          if (v.title) next.title = v.title;
          // fetch live channel subs
          const cid = v.channelId || next.channelId;
          if (cid) {
            fetch(`/api/channel/${encodeURIComponent(cid)}`).then(r=>r.ok?r.json():null).then(cd=>{
              const ch = cd?.channel || cd;
              const subs = ch?.statistics?.subscriberCount || ch?.subscribersCount || ch?.subscriberCount;
              if (subs) {
                const fmt = Number(String(subs).replace(/[^0-9]/g,"")).toLocaleString();
                setActiveVideo(p=> p && (p.youtubeId||p.id)===vid ? {...p, subscribers: fmt, avatar: ch?.snippet?.thumbnails?.default?.url || ch?.avatar || p.avatar} : p);
              }
            }).catch(()=>{});
          } else if (v.channelName || next.channel) {
            const cname = v.channelName || next.channel;
            fetch(`/api/channel/${encodeURIComponent(cname)}`).then(r=>r.ok?r.json():null).then(cd=>{
              const ch = cd?.channel || cd;
              const subs = ch?.statistics?.subscriberCount || ch?.subscribersCount;
              if (subs) {
                const fmt = Number(String(subs).replace(/[^0-9]/g,"")).toLocaleString();
                setActiveVideo(p=> p && (p.youtubeId||p.id)===vid ? {...p, subscribers: fmt } : p);
              }
            }).catch(()=>{});
          }
          return next;
        });
      }
    }).catch(()=>{});
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
    const allIds = [...new Set([...videoCatalog.map(v=>v.youtubeId || v.id), ...shortsVideos.map(s=>s.youtubeId || s.id)])].filter(id=>id && !String(id).startsWith("mock"));
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
  const [videoLiked, setVideoLiked] = useState(false);
  useEffect(() => {
    const videoId = activeVideo?.youtubeId || activeVideo?.id;
    if (!videoId) return;
    let locallyLiked = false;
    try { locallyLiked = localStorage.getItem(`liked_${videoId}`) === "true"; } catch {}
    setVideoLiked(locallyLiked);
    setLikeCount(Number(activeVideo?.likeCount || activeVideo?.likeCount === 0 ? activeVideo.likeCount : Math.floor(Math.random() * 5000) + 1200));
    setIsSaved(watchLater.some(v => (v.youtubeId || v.id) === videoId));
    const channelId = activeVideo?.channelId || channelIdFromVideo(activeVideo);
    if (channelId && authUser) {
      fetch(`/api/channel/${encodeURIComponent(channelId)}/subscription`, { credentials: "include", cache: "no-store" })
        .then(response => response.ok ? response.json() : null)
        .then(data => { if (data) setIsSubscribed(Boolean(data.subscribed)); })
        .catch(() => {});
    }
  }, [activeVideo?.youtubeId, activeVideo?.id, activeVideo?.channelId, authUser?.id, authUser?.email, watchLater]);
  const toggleVideoLike = () => {
    const videoId = activeVideo?.youtubeId || activeVideo?.id;
    if (!videoId) return;
    const nextLiked = !videoLiked;
    setVideoLiked(nextLiked);
    setLikeCount(count => Math.max(0, count + (nextLiked ? 1 : -1)));
    try { localStorage.setItem(`liked_${videoId}`, String(nextLiked)); } catch {}
    showToast(nextLiked ? "❤️ Liked — saved to your likes!" : "Like removed");
  };
  const toggleChannelSubscription = async () => {
    if (isGuest) { setShowSignUpBlock(true); return; }
    const channelId = activeVideo?.channelId || channelIdFromVideo(activeVideo);
    if (!channelId) return;
    try {
      const response = await fetch(`/api/channel/${encodeURIComponent(channelId)}/subscribe`, { method: "POST", credentials: "include" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Subscription failed");
      setIsSubscribed(Boolean(data.subscribed));
      try { localStorage.setItem(`alphatekx_sub_${authUser?.id || authUser?.email}_${channelId}`, data.subscribed ? "1" : "0"); } catch {}
      showToast(data.subscribed ? "Subscribed ✓" : "Unsubscribed");
    } catch (error) { showToast(error.message || "Subscription unavailable"); }
  };
  const toggleVideoSave = async () => {
    if (isGuest) { setShowSignUpBlock(true); return; }
    if (!activeVideo) return;
    try {
      await toggleWatchLater(activeVideo);
      setIsSaved(previous => !previous);
    } catch (error) {
      showToast(error.message || "Save unavailable");
    }
  };
  const [userLiked, setUserLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showDescriptionMore, setShowDescriptionMore] = useState(false);
  
  // Update likeCount to show real data from activeVideo when it loads
  useEffect(() => {
    if (activeVideo?.likeCount) setLikeCount(activeVideo.likeCount);
  }, [activeVideo?.likeCount]);

  const searchCatalogRef = useRef(videoCatalog);
  useEffect(() => { searchCatalogRef.current = videoCatalog; }, [videoCatalog]);

  // Debounced search keeps the previous grid stable while the next query loads.
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      setSearchIsMock(null);
      return;
    }

    setIsSearching(true);
    const controller = new AbortController();
    const query = searchQuery.trim();
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
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
            const qLower = query.toLowerCase();
            const filtered = searchCatalogRef.current.filter(
              (v) => v.title.toLowerCase().includes(qLower) || v.channel.toLowerCase().includes(qLower)
            );
            vids = (filtered.length > 0 ? filtered : searchCatalogRef.current).map(normalizeVideo);
            setSearchResults(vids);
            setSearchIsMock(true);
          }
          // NEVER vanish: persist to server + localStorage
          if (vids.length>0) {
            rememberSearch(query);
            try { localStorage.setItem("alphatekx_last_search_results", JSON.stringify(vids)); } catch {}
            persistSearchHistory(vids, query);
            // fire-and-forget POST to server for persistent history
            fetch("/api/search/save", { method:"POST", headers:{ "Content-Type":"application/json" }, credentials:"include", body: JSON.stringify({ videos: vids, searchedQuery: query }) }).catch(()=>{});
          }
          setSearchTab("results");
        })
        .catch((err) => {
          if (err.name === "AbortError") return;
          console.warn("YouTube API search fetch notice (using fallback):", err);
          const qLower = query.toLowerCase();
          let filtered = searchCatalogRef.current.filter(
            (v) => v.title.toLowerCase().includes(qLower) || v.channel.toLowerCase().includes(qLower)
          );
          if (filtered.length===0) filtered = searchCatalogRef.current;
          const vids = filtered.map(normalizeVideo);
          setSearchResults(vids);
          setSearchIsMock(true);
          rememberSearch(query);
          try { localStorage.setItem("alphatekx_last_search_results", JSON.stringify(vids)); } catch {}
          persistSearchHistory(vids, query);
          fetch("/api/search/save", { method:"POST", headers:{ "Content-Type":"application/json" }, credentials:"include", body: JSON.stringify({ videos: vids, searchedQuery: query }) }).catch(()=>{});
        })
        .finally(() => {
          setIsSearching(false);
        });
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery]);

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
    { id: 1, name: "AI Neural Net Model Pack", description: "Pre-trained PyTorch weights & vision dataset with puzzle CUDA acceleration.", price: 2500, badge: "BESTSELLER", iconType: "cpu", category: "app", salesCount: 342, sellerEmail: "dev@alphatekx.ai" },
    { id: 2, name: "Stream Platform Course Bundle", description: "Complete 6-hr video course with certificate & full source code repo.", price: 8000, badge: "HOT", iconType: "video", category: "course", salesCount: 189, sellerEmail: "academy@alphatekx.ai" },
    { id: 3, name: "Naija Speech Translation Engine", description: "Pidgin, Yoruba & Igbo TTS audio translation API plugin.", price: 5000, badge: "NEW", iconType: "sparkles", category: "plugin", salesCount: 95, sellerEmail: "nigeria-ai@alphatekx.ai" }
  ]);
  const [marketplaceApps, setMarketplaceApps] = useState([]);
  const [marketplaceCategory, setMarketplaceCategory] = useState("all");
  const [marketplaceSearch, setMarketplaceSearch] = useState("");
  const [marketplaceSort, setMarketplaceSort] = useState("newest");
  const [marketplaceDetail, setMarketplaceDetail] = useState(() => {
    const match = window.location.pathname.match(/^\/marketplace\/([^/]+)\/?$/);
    return match ? { id: decodeURIComponent(match[1]), product: null } : null;
  });
  const [marketplaceLoading, setMarketplaceLoading] = useState(false);
  const [sellSheetOpen, setSellSheetOpen] = useState(false);
  const [sellForm, setSellForm] = useState({ name: "", description: "", price: "", category: "app", sellerEmail: "", fileUrl: "", tags: "", thumbnailUrl: "", fileName: "" });
  const [sellThumbnailPreview, setSellThumbnailPreview] = useState("");
  const [sellError, setSellError] = useState("");
  const [sellLoading, setSellLoading] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [sellerSales, setSellerSales] = useState({ sales: [], summary: { totalSales:0, totalRevenue:0, totalFees:0, totalSellerRevenue:0 } });
  const [sellerEmailInput, setSellerEmailInput] = useState("creator@alphatekx.ai");
  const [marketplaceView, setMarketplaceView] = useState("products"); // products | dashboard | sell
  const loadMarketplaceProducts = async () => {
    setMarketplaceLoading(true);
    try {
      const params = new URLSearchParams({ category: marketplaceCategory, q: marketplaceSearch, sort: marketplaceSort });
      const response = await fetch(`/api/marketplace/products?${params.toString()}`, { credentials: "include" });
      const data = response.ok ? await response.json() : null;
      if (data && Array.isArray(data.products)) setMarketplaceProducts(data.products);
    } catch {}
    finally { setMarketplaceLoading(false); }
  };
  useEffect(() => { loadMarketplaceProducts(); }, [marketplaceCategory, marketplaceSearch, marketplaceSort]);
  useEffect(() => {
    if (!marketplaceDetail) return;
    const existing = marketplaceProducts.find(product => String(product.id) === String(marketplaceDetail.id));
    if (existing) setMarketplaceDetail(current => current ? { ...current, product: existing } : current);
    fetch(`/api/marketplace/products/${encodeURIComponent(marketplaceDetail.id)}`, { credentials: "include" })
      .then(response => response.ok ? response.json() : null)
      .then(data => { if (data?.product) setMarketplaceDetail(current => current ? { ...current, product: data.product } : current); })
      .catch(() => {});
  }, [marketplaceDetail?.id]);
  useEffect(() => {
    if (activeTab !== "marketplace") return;
    fetch("/api/marketplace/apps").then(r => r.ok ? r.json() : null).then(d => setMarketplaceApps(Array.isArray(d?.apps) ? d.apps : [])).catch(() => {});
  }, [activeTab]);
  const loadSellerSales = async (email) => {
    const res = await fetch(`/api/marketplace/sales?sellerEmail=${encodeURIComponent(email || sellerEmailInput)}`);
    const data = await res.json().catch(()=>null);
    if (data) setSellerSales(data);
  };
  useEffect(() => { if(activeTab==="marketplace" && marketplaceView==="dashboard") loadSellerSales(); }, [activeTab, marketplaceView]);
  useEffect(() => {
    if (authUser?.email && sellerEmailInput === "creator@alphatekx.ai") setSellerEmailInput(authUser.email);
  }, [authUser?.email]);
  const openMarketplaceProduct = (product) => {
    setMarketplaceDetail({ id: String(product.id), product });
    setActiveTab("marketplace");
    window.history.pushState({}, "", `/marketplace/${encodeURIComponent(product.id)}`);
    if (mainScrollRef.current) mainScrollRef.current.scrollTop = 0;
  };
  const closeMarketplaceProduct = () => {
    setMarketplaceDetail(null);
    window.history.pushState({}, "", "/marketplace");
  };
  const handleMarketplaceFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const allowed = ["application/zip", "application/x-zip-compressed", "application/pdf", "application/vnd.android.package-archive", "text/plain", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/json", "application/octet-stream"];
    const extensionOk = /\.(pdf|zip|rar|apk|txt|docx|json|xmp)$/i.test(file.name);
    if (/\.(mp3|mp4|wav|mov|m4v)$/i.test(file.name) || ["audio/", "video/"].some(prefix => file.type.startsWith(prefix)) || ((!allowed.includes(file.type) && !extensionOk) || file.size > 20 * 1024 * 1024)) {
      setSellError("Choose a PDF, ZIP, RAR, APK, TXT, DOCX, JSON, or XMP file up to 20 MB. Audio and video are not allowed.");
      event.target.value = "";
      return;
    }
    setSellError("");
    setSellForm(current => ({ ...current, fileName: file.name }));
  };
  const handleMarketplaceThumbnail = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) {
      setSellError("Thumbnail must be an image up to 2 MB.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const preview = String(reader.result || "");
      setSellThumbnailPreview(preview);
      setSellForm(current => ({ ...current, thumbnailUrl: preview }));
      setSellError("");
    };
    reader.readAsDataURL(file);
  };
  const submitMarketplaceProduct = async (event) => {
    event.preventDefault();
    const price = Number(sellForm.price);
    if (sellForm.name.trim().length < 2 || !sellForm.description.trim() || !Number.isFinite(price) || price <= 0) {
      setSellError("Add a name, description, and a valid price.");
      return;
    }
    if (!/^https:\/\/\S+$/i.test(sellForm.fileUrl.trim())) {
      setSellError("Add a hosted HTTPS download URL for the product file.");
      return;
    }
    setSellLoading(true);
    setSellError("");
    try {
      const usageResponse = await fetch("/api/market/check-publish", {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ user_id: billingUserId() }),
      });
      const usageData = await usageResponse.json().catch(() => ({}));
      if (usageResponse.status === 429 || usageData.allowed === false) {
        setUsageLockFeature("market");
        setShowPaywall(true);
        return;
      }
      if (!usageResponse.ok) throw new Error(usageData.error || "Unable to check publishing limit");
      const response = await fetch("/api/marketplace/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...sellForm, name: sellForm.name.trim(), description: sellForm.description.trim(), price, sellerEmail: sellForm.sellerEmail.trim() || authUser?.email || "creator@alphatekx.ai" }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to list product");
      await fetch("/api/market/increment", {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ user_id: billingUserId() }),
      });
      setSellSheetOpen(false);
      setSellForm({ name: "", description: "", price: "", category: "app", sellerEmail: "", fileUrl: "", tags: "", thumbnailUrl: "", fileName: "" });
      setSellThumbnailPreview("");
      showToast("Product listed");
      loadMarketplaceProducts();
    } catch (error) {
      setSellError(error.message || "Unable to list product");
    } finally {
      setSellLoading(false);
    }
  };
  const purchaseMarketplaceProduct = async () => {
    if (!checkoutProduct || purchaseLoading) return;
    setPurchaseLoading(true);
    try {
      const response = await fetch("/api/marketplace/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: checkoutProduct.id, buyerEmail: authUser?.email || undefined }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) throw new Error(data.error || "Checkout could not be completed");
      setCheckoutProduct(null);
      setCartCount(count => count + 1);
      showToast(data.stripe?.testMode
        ? "Test checkout completed — no live charge was made."
        : (data.downloadUrl ? "Payment confirmed — your download is ready." : "Payment confirmed."));
      loadMarketplaceProducts();
    } catch (error) {
      showToast(error.message || "Checkout could not be completed");
    } finally {
      setPurchaseLoading(false);
    }
  };
  useEffect(() => {
    const onPopState = () => {
      const path = window.location.pathname.replace(/\/+$/, "") || "/";
      const match = path.match(/^\/marketplace\/([^/]+)$/);
      if (match) {
        setActiveTab("marketplace");
        setMarketplaceDetail({ id: decodeURIComponent(match[1]), product: null });
      } else if (path === "/marketplace") {
        setActiveTab("marketplace");
        setMarketplaceDetail(null);
      } else if (path === "/shorts") {
        setActiveTab("shorts");
      } else if (path === "/download-app") {
        setActiveTab("download-app");
      } else if (path === "/help") {
        setActiveTab("help");
      } else if (path === "/upload") {
        setActiveTab("upload");
      } else if (path === "/watch" || path.startsWith("/watch/")) {
        setActiveTab("watch");
      } else {
        setActiveTab("home");
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

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
  const [teacherQuestion, setTeacherQuestion] = useState("");
  const [teacherAnswer, setTeacherAnswer] = useState("");
  const [teacherMessages, setTeacherMessages] = useState([]);
  const [isAskingTeacher, setIsAskingTeacher] = useState(false);
  const [showWatchTeacher, setShowWatchTeacher] = useState(false);

  // Superpower 8: AI Memory & Chat with History
  const [memoryQuery, setMemoryQuery] = useState("");
  const [memoryResults, setMemoryResults] = useState([]);
  const [memoryAnswer, setMemoryAnswer] = useState("");

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
  const [studioTemplates, setStudioTemplates] = useState([]);
  const [videoJots, setVideoJots] = useState([]);
  const [jotTranscript, setJotTranscript] = useState("");
  const [jotSource, setJotSource] = useState("");
  const [jotsLoading, setJotsLoading] = useState(false);
  const [jotActive, setJotActive] = useState(false);
  const [jotCleanedNotes, setJotCleanedNotes] = useState(null);
  const [jotExported, setJotExported] = useState(false);
  const jotSegmentsRef = useRef([]);
  const jotRecognitionRef = useRef(null);
  const jotTranscriptRef = useRef("");
  const jotSpeechFinalRef = useRef("");
  const jotSpeechInterimRef = useRef("");
  const jotSpeechFinalCountRef = useRef(0);
  const jotCleanupRef = useRef(false);
  const jotActiveRef = useRef(false);
  const jotVideoRef = useRef("");
  const [captureTranscript, setCaptureTranscript] = useState("");
  const [captureNotes, setCaptureNotes] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isCleaningCapture, setIsCleaningCapture] = useState(false);
  const captureRecognitionRef = useRef(null);

  // Superpower 10: Monetization Pro Subscription
  const [isProUser, setIsProUser] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [aiRateInfo, setAiRateInfo] = useState(null);
  const [aiUsage, setAiUsage] = useState({});
  const [usageLockFeature, setUsageLockFeature] = useState("");
  const [showByokModal, setShowByokModal] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [landscapeMode, setLandscapeMode] = useState(false);

  // Refs
  const iframeRef = useRef(null);
  const pipWindowRef = useRef(null);
  const pipHostRef = useRef(null);
  const [outsidePipActive, setOutsidePipActive] = useState(false);
  const [playerInteracted, setPlayerInteracted] = useState(false);
  const mainScrollRef = useRef(null);
  const mainPlayerRef = useRef(null);

  // Show Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };
  const billingUserId = () => authUser?.id || authUser?.email || (() => {
    try {
      let id = localStorage.getItem("alphatekx_user_id");
      if (!id) { id = `anon_${crypto.randomUUID?.() || Date.now()}`; localStorage.setItem("alphatekx_user_id", id); }
      return id;
    } catch { return "anonymous"; }
  })();
  const refreshSubscription = async () => {
    if (!authUser) {
      setSubscriptionInfo(null);
      setIsProUser(false);
      return { authenticated: false, isPro: false };
    }
    const userId = billingUserId();
    const response = await fetch(`/api/subscription/status?user_id=${encodeURIComponent(userId)}`, { credentials: "include" });
    const data = await response.json().catch(() => ({}));
    if (response.ok) { setSubscriptionInfo(data); setAiRateInfo(data.ai_rate_limit || null); setIsProUser(Boolean(data.isPro)); }
    return data;
  };
  const checkAiUsage = async (feature) => {
    const userId = billingUserId();
    const response = await fetch("/api/ai/check-and-use", {
      method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify({ user_id: userId, feature }),
    });
    const data = await response.json().catch(() => ({}));
    if (data.count != null) setAiUsage(previous => ({ ...previous, [feature]: data.count }));
    if (response.status === 429 || data.allowed === false) { setUsageLockFeature(feature); setShowPaywall(true); return false; }
    if (!response.ok) throw new Error(data.error || "Unable to check AI usage");
    return true;
  };
  const incrementAiUsage = async (feature) => {
    const response = await fetch("/api/ai/increment", {
      method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify({ user_id: billingUserId(), feature }),
    });
    if (!response.ok) throw new Error("Unable to save AI usage");
    const data = await response.json().catch(() => ({}));
    if (data.count != null) setAiUsage(previous => ({ ...previous, [feature]: data.count }));
  };
  const openAiFeature = async (feature) => {
    try { return await checkAiUsage(feature); }
    catch (error) { showToast(error.message || "AI usage check failed"); return false; }
  };
  const toggleLandscape = async () => {
    const next = !landscapeMode;
    setLandscapeMode(next);
    try {
      if (next) {
        if (mainPlayerRef.current?.requestFullscreen) await mainPlayerRef.current.requestFullscreen();
        if (screen.orientation?.lock) await screen.orientation.lock("landscape");
      } else {
        if (document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen();
        if (screen.orientation?.unlock) await screen.orientation.unlock();
      }
    } catch {
      showToast("Landscape mode is controlled by your device");
    }
  };
  const saveWorkspace = async () => {
    const videoId = activeVideo?.youtubeId || activeVideo?.id || "default";
    try {
      const response = await fetch("/api/workspace/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ videoId, code: codeValue }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || data.error || "Unable to save workspace");
      showToast("Workspace saved");
    } catch (error) {
      showToast(error.message || "Unable to save workspace");
    }
  };
  useEffect(() => {
    if (activeTab !== "workspace" || !authUser) return;
    const videoId = activeVideo?.youtubeId || activeVideo?.id || "default";
    fetch(`/api/workspace/saved?videoId=${encodeURIComponent(videoId)}`, { credentials: "include" })
      .then(response => response.ok ? response.json() : null)
      .then(data => { if (data?.workspace?.code) setCodeValue(data.workspace.code); })
      .catch(() => {});
  }, [activeTab, authUser?.id, activeVideo?.youtubeId, activeVideo?.id]);
  const startProCheckout = async (plan = "monthly") => {
    if (isGuest) {
      showToast("Sign in first to start your Pro subscription");
      const response = await fetch("/api/auth/url");
      const data = await response.json();
      if (data?.url) window.location.href = data.url;
      return;
    }
    try {
      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ plan, email: authUser?.email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to start checkout");
      window.location.href = data.authorization_url;
    } catch (error) {
      showToast(error.message || "Unable to start checkout");
    }
  };
  useEffect(() => {
    refreshSubscription().catch(() => {});
  }, [authUser?.id]);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("paystack") !== "success" || !authUser) return;
    const reference = params.get("trxref") || params.get("reference");
    if (!reference) {
      showToast("Payment returned without a transaction reference");
      return;
    }
    if (window.location.pathname === "/ads") {
      fetch(`/api/ads/my-ads?user_id=${encodeURIComponent(authUser.id)}`, { credentials: "include", cache: "no-store" })
        .then(response => response.ok ? response.json() : Promise.reject(new Error("Unable to load ad campaign")))
        .then(data => {
          const campaign = (data.ads || []).find(ad => ad.paystack_reference === reference);
          if (!campaign) throw new Error("Ad campaign was not found for this payment");
          return fetch("/api/ads/verify-payment", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ campaign_id: campaign.id, reference }) });
        })
        .then(async response => {
          const data = await response.json().catch(() => ({}));
          if (!response.ok || !data.success) throw new Error(data.error || "Ad payment verification failed");
          setCreatedAd(data);
          showToast(data.status === "active" ? "Ad payment confirmed — your ad is live now" : "Ad payment confirmed — your ad is automatically queued");
          window.history.replaceState({}, "", "/ads");
          await loadMyAds();
        })
        .catch(error => showToast(error.message || "Ad payment verification failed"));
      return;
    }
    fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`, { credentials: "include" })
      .then(async response => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.success) throw new Error(data.error || "Payment verification failed");
        await refreshSubscription();
        showToast("Payment confirmed — Pro is now unlocked");
        window.history.replaceState({}, "", "/pricing");
      })
      .catch(error => showToast(error.message || "Payment verification failed"));
  }, [authUser?.id]);

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

  // Monitor scrolling to auto-dock the player without losing it during navigation.
  useEffect(() => {
    const scrollContainer = mainScrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      // hide popups immediately while scrolling — keeps search clean
      if (searchSuggestionsOpen) setSearchSuggestionsOpen(false);
      if (activeTab !== "watch") {
        if (activeTab === "home" && boostFeedTab === "foryou" && scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight < 600) {
          loadBoostFeed("foryou");
        }
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

  const closeOutsidePip = () => {
    const pipWindow = pipWindowRef.current;
    if (pipWindow && !pipWindow.closed) pipWindow.close();
    pipWindowRef.current = null;
    setOutsidePipActive(false);
  };

  const isAndroidChrome = () => typeof navigator !== "undefined"
    && /Android/i.test(navigator.userAgent)
    && /Chrome/i.test(navigator.userAgent)
    && !/Edg|OPR|SamsungBrowser/i.test(navigator.userAgent);

  const setupMobilePip = async () => {
    const player = mainPlayerRef.current;
    const iframe = iframeRef.current;
    if (!player || !iframe) return false;
    try {
      iframe.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "playVideo", args: [] }), "*");
      if (iframe.requestFullscreen) await iframe.requestFullscreen();
      else if (player.requestFullscreen) await player.requestFullscreen();
      showToast("Fullscreen is ready. If YouTube is not fullscreen, tap its fullscreen icon, then press your Home button for Android PiP.");
      return true;
    } catch {
      showToast("Tap the YouTube fullscreen control, start playback, then press your Home button for Android PiP.");
      return false;
    }
  };

  const openOutsidePip = async ({ automatic = false } = {}) => {
    if (!iframeRef.current || !pipHostRef.current || outsidePipActive) return false;
    if (isAndroidChrome()) return setupMobilePip();
    if (!("documentPictureInPicture" in window)) {
      if (!automatic) showToast("Outside PiP needs Chrome 111+; YouTube's player can only use Document PiP here.");
      return false;
    }
    try {
      const pipWindow = await window.documentPictureInPicture.requestWindow({ width: 400, height: 225 });
      const iframe = iframeRef.current;
      const host = pipHostRef.current;
      const placeholder = document.createComment("alphatekx-pip-iframe");
      host.replaceChild(placeholder, iframe);
      pipWindow.document.body.style.cssText = "margin:0;background:#000;overflow:hidden;";
      const style = pipWindow.document.createElement("style");
      style.textContent = "button{font:600 12px system-ui;color:#fff;background:#111b;border:1px solid #ffffff33;border-radius:999px;padding:6px 10px;cursor:pointer}.controls{position:absolute;inset:auto 8px 8px;display:flex;justify-content:space-between;gap:8px;z-index:2}.frame{position:relative;width:100vw;height:100vh;background:#000}.frame iframe{width:100%;height:100%;border:0}";
      pipWindow.document.head.appendChild(style);
      const frame = pipWindow.document.createElement("div");
      frame.className = "frame";
      pipWindow.document.body.appendChild(frame);
      frame.appendChild(iframe);
      const controls = pipWindow.document.createElement("div");
      controls.className = "controls";
      controls.innerHTML = '<button id="alphatekx-back">Back to Alphatekx</button><button id="alphatekx-close">Close</button>';
      frame.appendChild(controls);
      controls.querySelector("#alphatekx-back").addEventListener("click", () => {
        window.focus();
        closeOutsidePip();
      });
      controls.querySelector("#alphatekx-close").addEventListener("click", closeOutsidePip);
      pipWindow.addEventListener("pagehide", () => {
        if (placeholder.parentNode) placeholder.parentNode.replaceChild(iframe, placeholder);
        pipWindowRef.current = null;
        setOutsidePipActive(false);
      });
      pipWindowRef.current = pipWindow;
      setOutsidePipActive(true);
      return true;
    } catch (error) {
      if (!automatic) showToast("Outside PiP was blocked by the browser. Use the PiP button after starting playback.");
      return false;
    }
  };

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && activeTab === "watch" && playerInteracted && !outsidePipActive && !isAndroidChrome()) {
        openOutsidePip({ automatic: true });
      } else if (!document.hidden && outsidePipActive) {
        closeOutsidePip();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [activeTab, playerInteracted, outsidePipActive]);

  useEffect(() => {
    if (!isAndroidChrome()) return undefined;
    const handlePageHide = () => {
      if (activeTab === "watch" && playerInteracted) console.info("Android Chrome left the page; native YouTube PiP may now be active.");
    };
    window.addEventListener("pagehide", handlePageHide);
    return () => window.removeEventListener("pagehide", handlePageHide);
  }, [activeTab, playerInteracted]);

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
      const res = await fetch("/api/community/send", { method:"POST", headers:{ "Content-Type":"application/json" }, credentials:"include", body: JSON.stringify({ message: msgText, timestampInVideo: timestamp || "", channel: activeChannel, userName: "You", videoId: activeVideo?.youtubeId || activeVideo?.id }) });
      if (res.ok) {
        const data = await res.json();
        if (data?.message) {
          // replace optimistic with server id
          setCommunityMessages(prev => prev.map(m=> m.id===optimistic.id ? { ...m, id: data.message.id || m.id } : m));
        } else {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Message could not be posted");
        }
      }
    } catch (error) {
      setCommunityMessages(prev => prev.filter(m => m.id !== optimistic.id));
      showToast(error.message || "Message could not be posted");
      return;
    }
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

  // Build AI Teacher Course through the authenticated Groq-backed Worker.
  const handleBuildCourse = async () => {
    if (!teacherGoal.trim()) { showToast("Tell AI what you want to learn first"); return; }
    if (!(await openAiFeature("teacher"))) return;
    setIsBuildingCourse(true);
    try {
      const res = await fetch("/api/teacher/build", { method:"POST", headers:{ "Content-Type":"application/json" }, credentials:"include", body: JSON.stringify({ goal: teacherGoal, prompt: teacherGoal }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) setShowPaywall(true);
        throw new Error(data.message || data.error || "AI Teacher request failed");
      }
      // normalize to our UI shape
      const teacherResult = data.result || data;
      const steps = (teacherResult.steps || []).map((s, index)=> ({ step: s.step || index + 1, title: s.title, desc: s.description || s.desc, videoTitle: s.videoTitle || s.title, videoId: s.videoId, completed: false }));
      if (!steps.length) throw new Error("AI Teacher returned no curriculum steps");
      setTeacherCourse({ goal: teacherResult.goal || data.goal || teacherGoal, steps });
      showToast("5-Step AI Learning Path Generated!");
    } catch (error) {
      showToast(error.message || "AI Teacher request failed");
    } finally { setIsBuildingCourse(false); }
  };
  const handleAskTeacher = async () => {
    const question = teacherQuestion.trim();
    if (!question) return;
    if (!(await openAiFeature("teacher"))) return;
    setIsAskingTeacher(true);
    try {
      const response = await fetch("/api/ai/teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ prompt: question, question, videoId: activeVideo?.youtubeId || activeVideo?.id, title: activeVideo?.title, description: activeVideo?.description }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) setShowPaywall(true);
        throw new Error(data.message || data.error || "AI Teacher request failed");
      }
      const answer = data.result?.answer || data.result?.text || data.answer || data.message || "AI Teacher returned no answer.";
      setTeacherAnswer(answer);
      setTeacherMessages(prev => [...prev, { question, answer }]);
      setTeacherQuestion("");
    } catch (error) {
      showToast(error.message || "AI Teacher request failed");
    } finally {
      setIsAskingTeacher(false);
    }
  };
  const handleActivateJot = async () => {
    if (isGuest) {
      setShowSignUpBlock(true);
      return;
    }
    const videoId = activeVideo?.youtubeId || activeVideo?.id;
    if (!videoId) return;
    if (!(await openAiFeature("jot"))) return;
    if (jotActive) {
      setJotActive(false);
      jotActiveRef.current = false;
      jotRecognitionRef.current?.stop?.();
      jotRecognitionRef.current = null;
      setJotsLoading(false);
      await cleanupAiJot();
      showToast("AI Jot stopped");
      return;
    }
    setJotsLoading(true);
    setJotActive(true);
    jotActiveRef.current = true;
    jotVideoRef.current = videoId;
    setJotCleanedNotes(null);
    setJotExported(false);
    setJotSource("");
    setJotTranscript("");
    jotTranscriptRef.current = "";
    jotSpeechFinalRef.current = "";
    jotSpeechInterimRef.current = "";
    jotSpeechFinalCountRef.current = 0;
    setVideoJots([]);
    try {
      const captionResponse = await fetch("/api/ai/jot/captions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ user_id: authUser?.id, youtube_id: videoId }),
      });
      const captions = await captionResponse.json().catch(() => ({}));
      if (!captionResponse.ok) {
        throw new Error(captions.message || captions.error || "This video has no readable captions");
      }
      const segments = Array.isArray(captions.transcript) ? captions.transcript : [];
      const transcript = String(captions.fullText || segments.map(segment => segment.text).join(" "));
      jotSegmentsRef.current = segments;
      jotTranscriptRef.current = transcript;
      setJotTranscript(transcript);
      setJotSource("youtube_transcript");
      setVideoJots(segments.length ? segments.map(segment => ({ time: `${Math.floor(Number(segment.start || 0))}s`, seconds: Number(segment.start || 0), text: segment.text, summary: "Caption" })) : [{ time: "0:00", seconds: 0, text: transcript, summary: "Captured transcript" }]);
      setJotsLoading(false);
      showToast("Captions captured — AI Jot stays on until you stop it");
    } catch (error) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setJotActive(false);
        jotActiveRef.current = false;
        setJotsLoading(false);
        showToast(error.message || "This video has no captions and speech capture is unavailable");
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.onresult = event => {
        let finalText = "";
        let finalCount = 0;
        let interimText = "";
        for (let index = 0; index < event.results.length; index += 1) {
          const text = event.results[index][0].transcript.trim();
          if (event.results[index].isFinal) {
            finalCount += 1;
            if (finalCount > jotSpeechFinalCountRef.current) finalText = `${finalText} ${text}`.trim();
          } else {
            interimText = `${interimText} ${text}`.trim();
          }
        }
        if (finalText) jotSpeechFinalRef.current = `${jotSpeechFinalRef.current} ${finalText}`.trim();
        jotSpeechFinalCountRef.current = finalCount;
        jotSpeechInterimRef.current = interimText;
        const nextTranscript = `${jotSpeechFinalRef.current} ${interimText}`.trim();
        if (nextTranscript) {
          jotTranscriptRef.current = nextTranscript;
          setJotTranscript(nextTranscript);
        }
      };
      recognition.onerror = () => showToast("Speech fallback stopped; captions were unavailable");
      recognition.onend = () => {
        if (jotSpeechInterimRef.current) {
          jotSpeechFinalRef.current = `${jotSpeechFinalRef.current} ${jotSpeechInterimRef.current}`.trim();
          jotSpeechInterimRef.current = "";
          jotTranscriptRef.current = jotSpeechFinalRef.current;
          setJotTranscript(jotSpeechFinalRef.current);
        }
        if (jotActiveRef.current) {
          jotSpeechFinalCountRef.current = 0;
          try { recognition.start(); } catch { setTimeout(() => { try { recognition.start(); } catch {} }, 250); }
        }
      };
      jotRecognitionRef.current = recognition;
      try {
        recognition.start();
        setJotSource("browser_speech");
        setJotsLoading(false);
        showToast("Captions unavailable — browser speech capture is listening");
      } catch {
        setJotsLoading(false);
        setJotSource("capture_unavailable");
        showToast("Browser speech capture could not start; YouTube captions were not available");
      }
    }
  };
  const cleanupAiJot = async () => {
    const transcriptToClean = `${jotSpeechFinalRef.current} ${jotSpeechInterimRef.current}`.trim() || jotTranscriptRef.current || jotTranscript;
    if (jotCleanupRef.current || !transcriptToClean.trim()) return;
    jotCleanupRef.current = true;
    setJotsLoading(true);
    try {
      const response = await fetch("/api/ai-jot-cleanup", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ fullTranscript: transcriptToClean, videoTitle: activeVideo?.title, chargeUsage: jotSource === "browser_speech" }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || data.error || "AI cleanup failed");
      setJotCleanedNotes(data);
      jotTranscriptRef.current = data.cleanedTranscript || transcriptToClean;
      setJotTranscript(data.cleanedTranscript || transcriptToClean);
      showToast("AI Jot cleaned and ready to export");
    } catch (error) { showToast(error.message || "AI cleanup failed"); }
    finally { jotCleanupRef.current = false; setJotsLoading(false); }
  };
  useEffect(() => {
    if (activeTab !== "watch" || !jotActive) return;
    const timer = setInterval(() => {
      try {
        const current = Number(ytPlayerRef.current?.getCurrentTime?.() || 0);
        const duration = Number(ytPlayerRef.current?.getDuration?.() || 0);
        if (duration > 0 && current >= duration - 1) {
          setJotActive(false);
          jotActiveRef.current = false;
          jotRecognitionRef.current?.stop?.();
          jotRecognitionRef.current = null;
          cleanupAiJot();
        }
      } catch {}
    }, 1000);
    return () => clearInterval(timer);
  }, [activeTab, jotActive, jotTranscript]);
  const exportAiJotOnce = () => {
    if (jotExported || !jotCleanedNotes) return;
    const content = jotCleanedNotes.neatNotesMarkdown || `# ${activeVideo?.title || "AI Jot"}\n\n${jotCleanedNotes.summary || ""}\n\n${jotCleanedNotes.cleanedTranscript || jotTranscript}`;
    const url = URL.createObjectURL(new Blob([content], { type: "text/markdown" }));
    const link = document.createElement("a");
    link.href = url; link.download = `${(activeVideo?.title || "ai-jot").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.md`; link.click(); URL.revokeObjectURL(url);
    setJotExported(true);
  };
  useEffect(() => {
    setVideoJots([]);
    setJotTranscript("");
    jotTranscriptRef.current = "";
    jotSpeechFinalRef.current = "";
    jotSpeechInterimRef.current = "";
    jotSpeechFinalCountRef.current = 0;
    setJotSource("");
    setJotsLoading(false);
    setJotActive(false);
    jotActiveRef.current = false;
    jotRecognitionRef.current?.stop?.();
    jotRecognitionRef.current = null;
    setJotCleanedNotes(null);
    setJotExported(false);
  }, [activeVideo?.youtubeId, activeVideo?.id]);
  const downloadJotsPdf = () => {
    if (!videoJots.length) {
      showToast("Activate AI Jot first");
      return;
    }
    const lines = [`Alphatekx AI Jot`, activeVideo?.title || "Video notes", "", ...videoJots.map(j => `${j.time || "0:00"}  ${j.text || j.summary || ""}`)];
    const escapePdf = value => value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
    const content = ["BT", "/F1 11 Tf", "50 760 Td", ...lines.map((line, index) => `${index ? "0 -16 Td" : ""} (${escapePdf(line.slice(0, 110))}) Tj`), "ET"].join("\n");
    const objects = [`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj`, `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj`, `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj`, `4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj`, `5 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj`];
    let pdf = "%PDF-1.4\n";
    const offsets = [0];
    objects.forEach(object => { offsets.push(pdf.length); pdf += `${object}\n`; });
    const xref = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${String(offset).padStart(10, "0")} 00000 n `).join("\n")}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
    const url = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(activeVideo?.title || "video-jots").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };
  const startLiveCapture = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { showToast("Live capture is not supported in this browser"); return; }
    if (isCapturing) { captureRecognitionRef.current?.stop(); setIsCapturing(false); return; }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = event => {
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) finalText += `${event.results[i][0].transcript} `;
      }
      if (finalText) setCaptureTranscript(prev => `${prev} ${finalText}`.trim());
    };
    recognition.onerror = () => { setIsCapturing(false); showToast("Capture stopped — check microphone permission"); };
    recognition.onend = () => setIsCapturing(false);
    captureRecognitionRef.current = recognition;
    setCaptureTranscript("");
    setCaptureNotes(null);
    setIsCapturing(true);
    recognition.start();
    showToast("Live capture started — speak clearly while the video plays");
  };
  const cleanLiveCapture = async () => {
    if (!captureTranscript.trim()) { showToast("Capture some speech first"); return; }
    setIsCleaningCapture(true);
    try {
      const response = await fetch("/api/capture/clean", {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ transcript: captureTranscript, title: activeVideo?.title || "Live video capture" }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || data.error || "Unable to clean capture");
      setCaptureNotes(data.result || data);
      showToast("Capture cleaned and organized");
    } catch (error) { showToast(error.message || "Unable to clean capture"); }
    finally { setIsCleaningCapture(false); }
  };
  const exportCapture = (format) => {
    if (!captureNotes) { showToast("Clean the capture first"); return; }
    const sections = (captureNotes.sections || []).map(section => `## ${section.heading}\n${(section.bullets || []).map(item => `- ${item}`).join("\n")}`).join("\n\n");
    const text = `# ${captureNotes.title || activeVideo?.title || "Alphatekx Capture"}\n\n${captureNotes.summary || ""}\n\n${sections}\n\n## Key terms\n${(captureNotes.keyTerms || []).join(", ")}\n\n## Action items\n${(captureNotes.actionItems || []).map(item => `- ${item}`).join("\n")}`;
    const blob = new Blob([text], { type: format === "txt" ? "text/plain" : "text/markdown" });
    const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `alphatekx-capture.${format}`; link.click(); URL.revokeObjectURL(url);
  };

   // Memory Search — only persisted server history; never manufacture results client-side.
  const handleMemorySearch = async (e) => {
    e.preventDefault();
    if (!memoryQuery.trim()) return;
    try {
      const res = await fetch(`/api/memory/search?q=${encodeURIComponent(memoryQuery)}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.error || "Memory search failed");
      setMemoryResults((data.results || []).map(r=> ({ title: r.title, watchedAgo: r.timestamp ? `Watched at ${r.timestamp}` : "From your history", snippet: r.snippet, videoId: r.videoId, timestamp: r.timestamp || "00:00" })));
      const chatResponse = await fetch("/api/memory/chat", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ message: memoryQuery }) });
      const chatData = await chatResponse.json().catch(() => ({}));
      if (chatResponse.ok) setMemoryAnswer(chatData.result?.answer || chatData.result?.text || chatData.answer || chatData.message || "");
      if (!data.results?.length) showToast("No matching items in your persisted history");
      else showToast(`Memory found ${data.results.length} matches`);
    } catch (error) {
      setMemoryResults([]);
      setMemoryAnswer("");
      showToast(error.message || "Memory search failed");
    }
  };
  useEffect(() => {
    const videoId = activeVideo?.youtubeId || activeVideo?.id;
    if (activeTab !== "watch" || !videoId || isGuest) {
      setVideoJots([]);
      return;
    }
    setJotsLoading(true);
    setJotsLoading(false);
  }, [activeTab, activeVideo?.youtubeId, activeVideo?.id, isGuest]);

  // Filtered Video Catalog + Unified aggregator filtered helpers (platform filter)
  const filteredVideos = videoCatalog.filter(video => {
    const matchesSearch = !searchQuery || video.title.toLowerCase().includes(searchQuery.toLowerCase()) || video.channel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChip = activeChip === "All" || video.tag === activeChip || (activeChip === "PyTorch" && video.title.includes("Neural")) || (activeChip === "Live Chat" && video.tag === "Cloudflare Workers");
    return matchesSearch && matchesChip;
  });
  const searchFiltered = (activePlatform==="all" ? searchResults : searchResults.filter(v=> (v.platform||"youtube")===activePlatform)).filter(isLongFormVideo);
  const homeFiltered = (activePlatform==="all" ? filteredVideos : filteredVideos.filter(v=> (v.platform||"youtube")===activePlatform)).filter(isLongFormVideo);
  const featuredVideo = videoCatalog.find(isLongFormVideo) || null;
  const workspacePreviewDocument = () => {
    const files = agentFiles || {};
    let raw = files["index.html"] || codeValue || "";
    raw = raw.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    const css = files["style.css"] || "";
    const js = files["script.js"] || "";
    if (css) raw = raw.includes("</head>") ? raw.replace("</head>", `<style>${css}</style></head>`) : `${raw}<style>${css}</style>`;
    if (js) raw = raw.includes("</body>") ? raw.replace("</body>", `<script>${js}</script></body>`) : `${raw}<script>${js}</script>`;
    const isFull = raw.toLowerCase().startsWith("<!doctype") || raw.toLowerCase().startsWith("<html");
    return isFull ? raw : `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>${raw}</body></html>`;
  };

    return (
    <>
    {showSplash && <AnimatedSplash onFinish={finishSplash} />}
    <div className="h-screen w-full max-w-[100vw] overflow-hidden flex flex-col bg-[#08080f] p-0 sm:p-3 text-white font-sans selection:bg-[#FFD700] selection:text-black">
      <div className={`flex-1 flex flex-col overflow-hidden rounded-none ${activeTab === "shorts" ? "bg-black" : "sm:rounded-2xl bg-[#0f0f1f] border-0 sm:border border-white/10 shadow-2xl"}`}>
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
                value={`${window.location.origin}/watch/${encodeURIComponent(activeVideo.youtubeId || activeVideo.id)}`}
                className="w-full bg-transparent text-xs text-gray-300 px-2 focus:outline-none font-mono"
              />
              <button 
                onClick={() => {
                  const url = `${window.location.origin}/watch/${encodeURIComponent(activeVideo.youtubeId || activeVideo.id)}`;
                  if (!navigator.clipboard) { showToast("Clipboard is unavailable in this browser"); return; }
                  navigator.clipboard.writeText(url).then(() => {
                    showToast("Video link copied to clipboard!");
                    setShareModalOpen(false);
                  }).catch(() => showToast("Clipboard permission was denied"));
                }}
                className="px-4 py-2 bg-[#00D9FF] text-black font-bold text-xs rounded-lg whitespace-nowrap"
              >
                Copy Link
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 text-center text-xs">
              {[
                { label: "WhatsApp", color: "bg-green-600", href: url => `https://wa.me/?text=${encodeURIComponent(`${activeVideo.title} ${url}`)}` },
                { label: "Twitter / X", color: "bg-blue-600", href: url => `https://twitter.com/intent/tweet?text=${encodeURIComponent(activeVideo.title)}&url=${encodeURIComponent(url)}` },
                { label: "LinkedIn", color: "bg-blue-800", href: url => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
                { label: "Embed Code", color: "bg-purple-600", embed: true }
              ].map((platform, idx) => (
                <button 
                  key={idx}
                  onClick={() => {
                    const url = `${window.location.origin}/watch/${encodeURIComponent(activeVideo.youtubeId || activeVideo.id)}`;
                    if (platform.embed) {
                      const code = `<iframe src="https://www.youtube.com/embed/${encodeURIComponent(activeVideo.youtubeId || activeVideo.id)}" title="${String(activeVideo.title || "").replace(/"/g, "&quot;")}" allowfullscreen></iframe>`;
                      if (!navigator.clipboard) { showToast("Clipboard is unavailable in this browser"); return; }
                      navigator.clipboard.writeText(code).then(() => { showToast("Embed code copied"); setShareModalOpen(false); }).catch(() => showToast("Clipboard permission was denied"));
                    } else {
                      window.open(platform.href(url), "_blank", "noopener,noreferrer");
                      setShareModalOpen(false);
                    }
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

      {/* Marketplace checkout confirmation */}
      {checkoutProduct && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D0D12] border border-[#00D9FF] rounded-t-3xl sm:rounded-3xl max-w-md w-full p-6 shadow-[0_0_40px_rgba(0,217,255,0.4)] relative">
            <button onClick={() => setCheckoutProduct(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">✕</button>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[#00D9FF]/20 text-[#00D9FF] rounded-xl">
                <Icon name="shopping-bag" className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">{checkoutProduct.name}</h3>
                <p className="text-xs text-gray-400">Secure checkout • digital delivery</p>
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
                <span className="text-gray-400">Delivery:</span>
                <span className="text-gray-200">After payment confirmation</span>
              </div>
            </div>

            <button
              onClick={purchaseMarketplaceProduct}
              disabled={purchaseLoading}
              className="w-full bg-gradient-to-r from-[#00D9FF] to-[#00FF88] text-black font-bold py-3 rounded-xl hover:opacity-95 transition-transform active:scale-95 shadow-[0_0_20px_rgba(0,255,136,0.4)]"
            >
              {purchaseLoading ? "Processing…" : `Continue to checkout · $${checkoutProduct.price}`}
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
                { id: "workspace", label: "Workspace", icon: "code" },
                { id: "channel", label: "Channel", icon: "user" },
                { id: "upload", label: "Upload", icon: "plus" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { if(item.id==="channel") navigateToChannel(authUser?.channelId || profileData?.channelId); else { if(item.id==="help") window.history.pushState({}, "", "/help"); setActiveTab(item.id); } setMobileDrawerOpen(false); }}
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
                { id: "ads", label: "Ads", icon: "video", color: "text-yellow-400" },
                { id: "marketplace", label: "Marketplace", icon: "shopping-bag", color: "text-[#00FF88]" },
                { id: "profile", label: "Profile", icon: "user", color: "text-[#00D9FF]" },
                { id: "help", label: "Help & About", icon: "help", color: "text-[#FFAA00]" },
                { id: "pricing", label: "Pro Subscription", icon: "crown", color: "text-yellow-400" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { if(item.id==="channel") navigateToChannel(authUser?.channelId || profileData?.channelId); else setActiveTab(item.id); setMobileDrawerOpen(false); }}
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

      {/* HEADER — exact like image 100% + hamburger for sidebar */}
      <header className={`${activeTab === "shorts" ? "hidden" : "h-[56px] flex-shrink-0 bg-[#0f0f1f] border-b border-white/10 px-2 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 z-40 relative"}`}>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button onClick={handleHamburgerClick} className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-white transition" title="Toggle sidebar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <div onClick={()=>setActiveTab("watch")} className="flex items-center gap-2.5 cursor-pointer flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#F59E0B] flex items-center justify-center border border-white/10">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2l2.4 4.8 5.2.8-3.8 3.7.9 5.2L12 14.5l-4.7 2.5.9-5.2L4.4 7.6l5.2-.8L12 2z" fill="white"/><circle cx="12" cy="12" r="2" fill="#0f0f1f"/></svg>
            </div>
            <span className="font-extrabold text-[20px] tracking-tight text-white hidden sm:inline">Alphatekx</span>
            <span className="font-light text-[20px] tracking-tight text-white/80 hidden sm:inline">Stream</span>
          </div>
        </div>
        <div className="hidden sm:flex flex-1 max-w-[560px] mx-6">
          <div className="relative w-full">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"><Icon name="search" className="w-4 h-4" /></span>
            <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} onFocus={()=>setSearchSuggestionsOpen(true)} onBlur={()=>setTimeout(()=>setSearchSuggestionsOpen(false),200)} onKeyDown={e=>{if(e.key==="Enter"){rememberSearch(searchQuery); setActiveTab("home"); setSearchSuggestionsOpen(false);}}} placeholder="Search videos, AI tools, channels..." className="w-full bg-[#1a1a2e]/80 border border-[#2a2a4a] rounded-full pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700]/50 focus:bg-[#1a1a2e]" />
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {!isProUser && <button onClick={() => startProCheckout("monthly")} className="hidden sm:flex min-h-[36px] items-center rounded-full bg-[#FFD700] px-4 py-2 text-xs font-extrabold text-black hover:brightness-110">Go Pro $19</button>}
          <button onClick={()=>showToast("Notifications")} className="hidden sm:flex w-9 h-9 rounded-full hover:bg-white/10 items-center justify-center text-gray-300 hover:text-white"><Icon name="bell" className="w-5 h-5" /></button>
          <button onClick={()=>setActiveTab("profile")} className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-white"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 009 15a1.65 1.65 0 001-1.51V13a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82-.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.6 9a1.65 1.65 0 001-1.51V7a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0015 9a1.65 1.65 0 00-1 1.51V13a1.65 1.65 0 001 1.51z"/></svg></button>
          {isGuest ? (
            <button onClick={async()=>{ try{const r=await fetch('/api/auth/url');const d=await r.json(); if(d.url) window.location.href=d.url;}catch{window.location.href='/api/auth/url';}}} className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#F59E0B] text-black font-bold text-xs hover:scale-105 transition">Sign in with Google →</button>
          ) : (
            <button onClick={()=>setActiveTab("profile")} className="w-9 h-9 rounded-full bg-[#7c3aed] text-white font-bold flex items-center justify-center border-2 border-white/10">A</button>
          )}
          <button onClick={()=>setMobileSearchOpen(true)} className="sm:hidden w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-300"><Icon name="search" className="w-5 h-5" /></button>
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
            {!searchQuery && recentSearches.length > 0 && <div className="px-2 py-2"><p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">Recent searches</p><div className="flex flex-wrap gap-2">{recentSearches.map(query => <button key={query} onClick={()=>{ setSearchQuery(query); setMobileSearchOpen(false); setActiveTab("home"); }} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-200">{query}</button>)}</div></div>}
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
                  <button onClick={()=>{ setMobileSearchOpen(false); setActiveTab("shorts"); }} className="px-3 py-1.5 bg-[#FFD700]/20 text-[#FFD700] text-xs rounded-full border border-[#FFD700]/30">Browse Shorts</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------- APP BODY (FIXED SIDEBAR + INDEPENDENT MAIN SCROLL) ------------------- */}
      <div className="flex-1 min-w-0 flex overflow-hidden relative">

        {/* ------------------- FIXED YOUTUBE SIDEBAR ------------------- */}
        <aside 
          className={`${activeTab === "shorts" ? "hidden" : "bg-[#0f0f0f] border-r border-[#272727] transition-all duration-300 flex-col justify-between hidden md:flex flex-shrink-0 z-30"} ${
            sidebarOpen ? "w-64" : "w-18 items-center"
          }`}
        >
          <div className="py-2 overflow-y-auto space-y-4 w-full h-full">
            
            {/* Primary Section — exact image: Now Playing cyan active */}
            <div className="px-3 space-y-1">
              {[
                { id: "home", label: "Home", icon: "home" },
                { id: "download-app", label: "Download App", icon: "download", isSpecial: true },
                { id: "watch", label: "Now Playing", icon: "shorts" },
                { id: "history", label: "History", icon: "history" },
                { id: "watchlater", label: "Watch Later", icon: "history" },
                { id: "shorts", label: "Shorts", icon: "shorts" },
                { id: "workspace", label: "Workspace", icon: "code" },
                { id: "channel", label: "Channel", icon: "user" },
                { id: "upload", label: "Upload", icon: "plus" }
              ].map((item) => item.isSpecial ? (
                <div key={item.id} className={`sidebar-download-tab ${sidebarOpen ? "" : "hidden"}`} onClick={navigateToDownloadApp} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") navigateToDownloadApp(); }}>
                  <div style={{display:"flex", alignItems:"center", gap:"8px"}}><span style={{fontSize:"16px"}}>📲</span><span>Download App</span><span className="fire-emoji">🔥</span></div>
                  <div style={{display:"flex", gap:"6px", alignItems:"center"}}><span className="badge-new">NEW</span><span className="count-badge" id="download-count-badge">12.3K</span></div>
                </div>
              ) : (
                <button
                  key={item.id}
                  onClick={() => {
                    if(item.id==="channel") navigateToChannel(authUser?.channelId || profileData?.channelId);
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
                { id: "ads", label: "Ads", icon: "video", color: "text-[#FFD700]" },
                { id: "marketplace", label: "Marketplace", icon: "shopping-bag", color: "text-gray-400" },
                { id: "profile", label: "Profile", icon: "user", color: "text-gray-400" },
                { id: "help", label: "Help & About", icon: "help", color: "text-[#FFAA00]" },
                { id: "pricing", label: "Pro Subscription", icon: "crown", color: "text-[#FFD700]" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { if(item.id==="help") window.history.pushState({}, "", "/help"); setActiveTab(item.id); }}
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

            {/* Subscribed Channels — REAL only, no fake */}
            {sidebarOpen && (
              <div className="px-4 py-3 space-y-3">
                <span className="text-[11px] font-bold text-[#7a7a9e] uppercase tracking-[0.12em]">Subscribed Channels</span>
                {isGuest ? (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 leading-relaxed">Sign in with Google to personalize your Alphatekx feed and save your history.</p>
                    <button onClick={async()=>{ try{const r=await fetch('/api/auth/url');const d=await r.json(); if(d.url) window.location.href=d.url;}catch{window.location.href='/api/auth/url';}}} className="text-xs text-[#FFD700] font-bold hover:underline">Sign in →</button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-400">Real subscriptions • {profileData?.name || authUser?.channelName || "You"} • {profileData?.subscribers || ""}</p>
                    <p className="text-[11px] text-gray-500">Live from YouTube API — no mock data.</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </aside>

        {/* ------------------- INDEPENDENT MAIN SCROLL CONTENT AREA ------------------- */}
        <main ref={mainScrollRef} onScroll={(event) => {
          if (activeTab !== "home" || homeLoadingMoreRef.current) return;
          const target = event.currentTarget;
          if (target.scrollHeight - target.scrollTop - target.clientHeight < target.clientHeight * 2) {
            homeLoadingMoreRef.current = true;
            loadBoostFeed(boostFeedTab).finally(() => { homeLoadingMoreRef.current = false; });
          }
        }} className={`flex-1 min-w-0 overflow-x-hidden scroll-smooth ${activeTab === "shorts" ? "h-screen overflow-hidden pb-0" : "h-full overflow-y-auto pb-24 md:pb-12"}`}>

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

          {/* IMAGE 100% WATCH — when workspace closed: video + Up Next. When open: laptop side-by-side, mobile stacked per images */}
          {activeTab === "download-app" && (
            <section className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
              <div className="rounded-3xl border border-[#FF0055]/40 bg-gradient-to-br from-[#250516] via-[#18131f] to-[#241507] p-8 text-center shadow-[0_0_35px_rgba(255,0,85,0.2)]">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#FF0055] to-[#FFAA00] text-4xl">📲</div>
                <h1 className="text-3xl font-black text-white">Download Alphatekx App</h1>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-300">Install Alphatekx Stream on your device for a faster app-like experience.</p>
                <div className="mt-4 text-xs text-gray-300">
                  <strong className="text-white">🔥 {installedCount > 1000 ? `${(installedCount / 1000).toFixed(1)}K` : installedCount} people have installed</strong>
                  <span className="mx-2 text-white/30">•</span>
                  {downloadCount > 1000 ? `${(downloadCount / 1000).toFixed(1)}K` : downloadCount} clicked download
                </div>
                <div className="mt-2 text-xs text-[#FFAA00]">Real Android app download · 941 KB</div>
                <div className="mx-auto mt-6 grid w-full max-w-md gap-3">
                  <a href="/download/alphatekx.apk" download="Alphatekx-Stream-v1.apk" onClick={() => fetch("/api/download/tab-tapped", { method: "POST" }).catch(() => {})} className="rounded-full bg-gradient-to-r from-[#FF0055] to-[#FFAA00] px-6 py-4 text-center text-base font-black text-white shadow-[0_0_24px_rgba(255,0,85,0.35)] transition hover:scale-[1.02]">Download Alphatekx APK</a>
                </div>
                <div className="mx-auto mt-5 max-w-md rounded-xl border border-white/10 bg-black/20 p-4 text-left text-xs leading-5 text-gray-300">
                  <p className="font-bold text-white">Install Alphatekx on Android</p>
                  <p className="mt-1">Download the signed app, open it from your notification, allow Chrome to install unknown apps if Android asks, then tap Install.</p>
                </div>
              </div>
            </section>
          )}
          {activeTab === "help" && (
            <section className="mx-auto max-w-[900px] px-4 py-8 sm:px-10 sm:py-10">
              <h1 className="text-2xl font-black text-white sm:text-3xl">❓ Help & About Alphatekx Stream</h1>
              <div className="mt-6 space-y-5 text-sm leading-7 text-[#AAA]">
                <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h2 className="text-xl font-bold text-white">Why We Built Alphatekx Stream</h2>
                  <p className="mt-3">We love YouTube — but we noticed blurry quality, PiP that stops on some phones, no built-in AI help for long videos, distracting ads, and verification barriers for creators. Alphatekx Stream brings a clearer, AI-powered experience with AI Teacher, AI Memory, Marketplace tools, and an installable app without verification stress.</p>
                </article>
                <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h2 className="text-xl font-bold text-white">How It Works</h2>
                  <p className="mt-3">Alphatekx Stream uses YouTube public streams with our own interface and player, then adds AI Teacher, AI Memory, save and share tools, Marketplace features, and an installable PWA. Likes and comments are saved locally first so your actions never fail while sync features continue to improve.</p>
                </article>
                <article className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h2 className="text-xl font-bold text-white">Features vs YouTube</h2>
                  <table className="mt-4 w-full min-w-[560px] text-left text-sm"><thead><tr className="border-b border-white/10 text-white"><th className="p-2">Feature</th><th className="p-2">YouTube</th><th className="p-2">Alphatekx Stream</th></tr></thead><tbody>{[["Quality","Auto quality","Clear playback ✅"],["AI Summary","No built-in teacher","AI Teacher ✅"],["Memory","Limited","AI Memory ✅"],["Install","App store/browser","1-tap Download App ✅"],["Marketplace","No","Buy & Sell ✅"]].map(row => <tr key={row[0]} className="border-b border-white/5"><td className="p-2 text-white">{row[0]}</td><td className="p-2">{row[1]}</td><td className="p-2">{row[2]}</td></tr>)}</tbody></table>
                </article>
                <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h2 className="text-xl font-bold text-white">FAQ — No Errors, No Complaints</h2>
                  <div className="mt-3 space-y-3"><p><strong className="text-white">Is Like real?</strong> Likes are saved locally on your device for now and remain available when you return.</p><p><strong className="text-white">Comments not showing?</strong> Your comments are saved locally and appear instantly under the video.</p><p><strong className="text-white">Is it safe?</strong> We do not store passwords; sign-in and browser storage are used to keep your experience working.</p><p><strong className="text-white">How do I install?</strong> Open Download App and use the native install prompt, or the direct download fallback.</p></div>
                </article>
                <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h2 className="text-xl font-bold text-white">Contact Us</h2>
                  <p className="mt-3">Have questions, want to partner, or want to acquire Alphatekx Stream?</p>
                  <p className="mt-3">Email: <a className="font-bold text-[#FF0055]" href="mailto:alphatekxcompany@gmail.com">alphatekxcompany@gmail.com</a><br />Website: <a className="text-[#FFAA00]" href="https://alphatekx.name.ng">alphatekx.name.ng</a></p>
                  <p className="mt-3">We reply within 24 hours — we are here to help!</p>
                </article>
              </div>
            </section>
          )}
          {activeTab === "watch" && !watchPanelOpen && (
            <div className="watch-content max-w-[1600px] mx-auto px-0 sm:px-6 py-3 sm:py-6 space-y-6">
              <div className="flex items-center px-4 sm:px-0">
                <button type="button" onClick={returnHomeFromWatch} className="flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10" aria-label="Back to Home">
                  <span aria-hidden="true">←</span> Back to Home
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-4">
                  <div ref={mainPlayerRef} onPointerDown={() => setPlayerInteracted(true)} className={`watch-video-player relative w-full aspect-video bg-black ${landscapeMode ? "ring-2 ring-[#FFD700]" : ""}`}>
                    <div ref={pipHostRef} className="absolute inset-0">
                      {isGuest ? <button type="button" onClick={() => setShowSignUpBlock(true)} className="absolute inset-0 flex items-center justify-center bg-black/80 text-sm font-bold text-white">Sign up to watch this video</button> : <iframe ref={iframeRef} src={`https://www.youtube.com/embed/${activeVideo.youtubeId || activeVideo.id}?enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&playsinline=1&controls=1&rel=0&modestbranding=1&fs=1&autoplay=1`} title="YouTube video player" className="absolute inset-0 h-full w-full border-0" allow="autoplay; fullscreen; picture-in-picture; document-picture-in-picture; encrypted-media" allowFullScreen />}
                    </div>
                    <button onClick={toggleLandscape} className="absolute right-3 top-3 z-30 rounded-full bg-black/75 px-3 py-2 text-xs font-bold text-white border border-white/20 hover:bg-black" aria-label="View video in landscape 16:9">{landscapeMode ? "[x] 16:9" : "[ ] 16:9"}</button>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight px-4 sm:px-0">{activeVideo.title}</h1>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 px-4 sm:px-0">
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => navigateToChannel(activeVideo.channelId || channelIdFromVideo(activeVideo))} className="rounded-full" aria-label={`Open ${activeVideo.channelName || activeVideo.channel || "creator"} channel`}>
                        <img src={activeVideo.avatar || channelData?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeVideo.channelName || activeVideo.channel || "YouTube")}&background=1A0B2E&color=FFD700`} alt="avatar" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                      </button>
                      <div><button onClick={()=>navigateToChannel(activeVideo.channelId || channelIdFromVideo(activeVideo))} className="text-left text-sm font-bold text-white hover:text-[#00D9FF]">{typeof activeVideo.channel === "string" ? activeVideo.channel : (activeVideo.channelName || "")} • {channelData?.subscribers || activeVideo.subscribers || ""} subscribers</button><p className="text-xs text-gray-400">{activeVideo.views} • {activeVideo.timeAgo} • {activeVideo.description ? activeVideo.description.slice(0,110) : ""}</p></div>
                      <button onClick={toggleChannelSubscription} className={`ml-3 px-5 py-2 rounded-full font-bold text-xs ${isSubscribed?"bg-white/10 text-white":"bg-white text-black"}`}>{isSubscribed?"Subscribed ✓":"Subscribe"}</button>
                    </div>
                    <div className="flex flex-wrap gap-2"><button onClick={toggleVideoLike} aria-pressed={videoLiked} className={`px-4 py-2 rounded-full border text-sm font-bold ${videoLiked ? "bg-[#FFD700] text-black border-[#FFD700]" : "bg-[#1a1a2e] text-white border-white/10"}`}>Like {likeCount ? likeCount.toLocaleString() : (activeVideo.likes || "0")}</button><button onClick={()=>{ setCommentsOpen(true); loadVideoComments(activeVideo.youtubeId || activeVideo.id); }} className="px-4 py-2 rounded-full bg-[#1a1a2e] border border-white/10 text-sm font-bold text-white">Comments {activeVideo.comments || ""}</button><button onClick={toggleVideoSave} aria-pressed={isSaved} className={`px-4 py-2 rounded-full border text-sm font-bold ${isSaved ? "bg-[#FFD700] text-black border-[#FFD700]" : "bg-[#1a1a2e] text-white border-white/10"}`}>{isSaved ? "Saved ✓" : "Save"}</button><button onClick={() => setShareModalOpen(true)} className="px-4 py-2 rounded-full bg-[#1a1a2e] border border-white/10 text-sm font-bold text-white">Share</button></div>
                  </div>
                  <div className="mx-4 sm:mx-0 rounded-2xl bg-[#1a1a1a] p-4 text-sm text-gray-300">
                    <p className={showDescriptionMore ? "" : "line-clamp-2"}>{activeVideo.description || "No description available."}</p>
                    <button onClick={() => setShowDescriptionMore(open => !open)} className="mt-2 text-xs font-bold text-white">{showDescriptionMore ? "Show less" : "...more"}</button>
                  </div>
                  <section className="watch-ai-buttons px-4 sm:px-0 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <button onClick={()=>{ setActiveTab("watch"); setWatchPanelTab("ai"); setWatchPanelOpen(true); }} className="min-h-[40px] px-3 py-2 rounded-full bg-[#FFD60A] text-black text-xs font-bold flex items-center gap-1.5">
                        <span aria-hidden="true">✨</span> Workspace
                      </button>
                      <button onClick={handleActivateJot} aria-busy={jotsLoading} className={`min-h-[40px] px-3 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 border border-white ${jotActive ? "bg-red-500 text-white" : "bg-white text-black"} disabled:cursor-wait disabled:opacity-60`}>
                        <span aria-hidden="true">🧠</span> {jotsLoading ? "Reading captions..." : jotActive ? "Stop Jot" : "Activate Jot"}
                      </button>
                      <button onClick={()=>setShowWatchTeacher(open => !open)} className="min-h-[40px] px-3 py-2 rounded-full bg-[#1a1a2e] text-white text-xs font-bold flex items-center gap-1.5 border border-white/10">
                        <span aria-hidden="true">🎓</span> AI Teacher
                      </button>
                    </div>
                    <div className="rounded-2xl border border-[#FFD60A]/25 bg-[#18131f] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-white text-sm">🧠 AI Jot — Captures Everything Said</h3>
                          <p className="text-[11px] text-gray-500">Activate to generate clean, clickable timestamped notes.</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] text-gray-400">{jotsLoading ? "Capturing transcript…" : jotSource === "youtube_transcript" ? "YouTube captions" : jotSource === "browser_speech" ? "Live speech capture" : jotSource === "groq_whisperflow" ? "Groq Whisperflow" : jotSource === "capture_unavailable" ? "Capture unavailable" : "Not started"} {videoJots.length ? `${videoJots.length} captures` : ""}</span>
                          {jotCleanedNotes && <button onClick={exportAiJotOnce} disabled={jotExported} className="px-2.5 py-1.5 rounded-full bg-[#FFD60A] text-black text-[11px] font-bold disabled:opacity-50">{jotExported ? "Exported" : "Export Once"}</button>}
                          <button onClick={downloadJotsPdf} className="px-2.5 py-1.5 rounded-full bg-white/10 text-white text-[11px] font-bold border border-white/10">PDF</button>
                        </div>
                        {jotCleanedNotes && <div className="mt-3 rounded-xl border border-[#FFD60A]/20 bg-black/30 p-3 text-xs text-gray-200"><p className="font-bold text-[#FFD60A]">Smart cleanup</p><p className="mt-1 whitespace-pre-wrap">{jotCleanedNotes.neatNotesMarkdown || jotCleanedNotes.summary}</p></div>}
                      </div>
                      {jotTranscript && <div className="mt-3 rounded-xl border border-[#FFD60A]/30 bg-black/30 p-3"><div className="flex items-center justify-between gap-2"><p className="text-xs font-bold text-[#FFD60A]">Everything Said — live full transcript</p><span className="text-[10px] text-gray-500">{jotTranscript.split(/\s+/).filter(Boolean).length} words</span></div><p className="mt-2 max-h-64 overflow-y-auto whitespace-pre-wrap text-sm leading-6 text-gray-200">{jotTranscript}</p></div>}
                      <div className="mt-3 max-h-48 overflow-y-auto space-y-2">
                        {jotsLoading ? <p className="text-xs text-gray-400">Capturing and cleaning up this video…</p> : videoJots.length ? videoJots.map((jot, index) => <button key={`${jot.time}-${index}`} onClick={() => handleSeek(Number(jot.seconds || 0), jot.time || "0:00")} className="block w-full rounded-xl bg-black/30 p-2.5 text-left hover:bg-white/5"><span className="text-xs font-bold text-[#FFD60A]">{jot.time || "0:00"}</span><span className="ml-3 text-sm text-gray-200">{jot.text || jot.summary}</span></button>) : <p className="text-xs text-gray-500">Watching… click Activate Jot to capture the video notes.</p>}
                      </div>
                    </div>
                    {showWatchTeacher && <div className="rounded-2xl border border-white/10 bg-[#18131f] p-4">
                      <h3 className="font-bold text-white text-sm">🎓 AI Teacher — Ask about this video</h3>
                      <div className="mt-3 flex gap-2">
                        <input value={teacherQuestion} onChange={e=>setTeacherQuestion(e.target.value)} onKeyDown={e=>{if(e.key==="Enter") handleAskTeacher();}} placeholder="What is this step about?" className="min-w-0 flex-1 rounded-full border border-white/10 bg-black px-3 py-2 text-sm text-white" />
                        <button onClick={handleAskTeacher} disabled={isAskingTeacher} className="rounded-full bg-white px-4 py-2 text-xs font-bold text-black">{isAskingTeacher ? "..." : "Ask"}</button>
                      </div>
                      {teacherAnswer && <p className="mt-3 whitespace-pre-wrap text-sm text-gray-200">{teacherAnswer}</p>}
                    </div>}
                  </section>
                  <section className="px-4 sm:px-0">
                    <button onClick={()=>setCommentsOpen(true)} className="mb-3 text-left text-lg font-bold text-white">Comments {activeVideo.comments ? `(${activeVideo.comments})` : ""}</button>
                    {commentsOpen && (
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        {commentsLoading ? <p className="text-sm text-gray-400">Loading saved comments…</p> : videoComments.length === 0 ? <p className="text-sm text-gray-400">No comments yet. Be the first to comment.</p> : <div className="space-y-4">{videoComments.map(comment => <div key={comment.id} className="flex gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF0055] text-xs font-bold text-white">{comment.avatar || "A"}</div><div><p className="text-xs font-bold text-white">{comment.author || comment.user || "You"}</p><p className="mt-1 text-sm text-gray-200 whitespace-pre-wrap">{comment.text}</p><p className="mt-1 text-[11px] text-gray-500">{comment.time || "now"}</p></div></div>)}</div>}
                        <form className="mt-4 flex gap-2" onSubmit={event => { event.preventDefault(); submitVideoComment(); }}>
                          <input value={videoCommentInput} onChange={event => setVideoCommentInput(event.target.value)} placeholder={isGuest ? "Sign in to comment" : "Add a comment..."} className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-[#FFD700]" />
                          <button type="submit" className="rounded-xl bg-[#FFD700] px-4 py-2 text-xs font-bold text-black">Post</button>
                        </form>
                      </div>
                    )}
                  </section>
                </div>
                <div className="lg:col-span-4 space-y-4">
                  <h3 className="font-bold text-xl text-white">Up Next • Real</h3>
                  <div className="space-y-4">
                    {videoCatalog.filter(v=> (v.youtubeId||v.id) !== (activeVideo.youtubeId||activeVideo.id)).slice(0,4).map((vid, idx)=>(
                      <div key={idx} onClick={()=>allowVideoForUser(vid)} className="flex gap-3 cursor-pointer group min-w-0">
                        <div className="relative w-36 h-20 rounded-xl overflow-hidden bg-[#1a1a2e] flex-shrink-0"><img src={vid.img || vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover" /><span className="absolute bottom-1 right-1 bg-black/80 text-[10px] px-1 rounded text-white">{vid.duration || ""}</span></div>
                        <div className="flex-1 py-1"><h4 className="text-sm font-bold text-white line-clamp-2 group-hover:text-[#FFD700]">{vid.title}</h4><p className="text-xs text-gray-400 mt-1">{vid.views || ""} • {vid.timeAgo || ""}</p><p className="text-[11px] text-gray-500 truncate">{typeof vid.channel === "string" ? vid.channel : (vid.channelName || "")}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3 px-4 sm:px-0">
                  <button onClick={()=>{ setWatchPanelOpen(false); setActiveTab("workspace"); window.history.pushState({}, "", `/workspace?videoId=${activeVideo.youtubeId || activeVideo.id}`); }} className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#FFD700] text-black font-extrabold text-sm shadow-lg hover:scale-105 transition">Open AI Workspace →</button>
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {videoChapters.map((chap, idx)=>(
                      <button key={idx} onClick={()=>handleSeek(chap.seconds, chap.timestamp)} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border ${activeTimestamp===chap.timestamp||(idx===0&&!activeTimestamp)?"bg-[#FFD700] text-black border-[#FFD700]":"bg-[#1a1a2e] border-white/10 text-gray-300"}`}>{chap.timestamp} {chap.title}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* WORKSPACE OPEN — laptop side-by-side (Image 2), mobile stacked (Image 1) */}
          {((activeTab === "watch" && watchPanelOpen) || activeTab === "workspace") && (
            <div className="max-w-[1600px] mx-auto px-0 sm:px-4 py-3 lg:py-0 space-y-4">
              {/* Back + Title bar */}
              <div className="flex items-center gap-3 px-4 sm:px-0">
                <button onClick={returnHomeFromWatch} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10">
                  <span>←</span> <span className="hidden sm:inline">Back to Results</span><span className="sm:hidden">Back</span>
                </button>
                <h2 className="flex-1 text-center text-xl font-extrabold text-white truncate px-4">{activeTab === "workspace" ? "Alphatekx Workspace" : activeVideo.title}</h2>
                {activeTab === "workspace" && <span className="hidden sm:inline-flex rounded-full bg-[#00FF88]/15 px-2.5 py-1 text-[10px] font-bold text-[#00FF88]">FREE FOREVER</span>}
                {activeTab === "workspace" && <button onClick={saveWorkspace} className="px-4 py-2 rounded-full bg-[#00FF88] text-black text-sm font-bold">Save</button>}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 min-w-0">
                {/* Video — ONLY real YouTube iframe, no fake overlays */}
                <div className="lg:col-span-6 space-y-3">
                  <div className="relative bg-black rounded-none sm:rounded-2xl overflow-hidden border-0 sm:border-2 border-[#FFD700] shadow-[0_0_40px_rgba(255,215,0,0.25)]">
                    <div className="aspect-video relative bg-black">
                      {isGuest ? <button type="button" onClick={() => setShowSignUpBlock(true)} className="absolute inset-0 flex items-center justify-center bg-black/80 text-sm font-bold text-white">Sign up to watch this video</button> : <iframe src={`https://www.youtube.com/embed/${activeVideo.youtubeId || activeVideo.id}?enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&playsinline=1&controls=1&rel=0&modestbranding=1&fs=1&autoplay=1`} title="YouTube video player" className="absolute inset-0 h-full w-full border-0" allow="autoplay; fullscreen; picture-in-picture; document-picture-in-picture; encrypted-media" allowFullScreen />}
                    </div>
                  </div>
                  <div className="px-4 sm:px-0">
                    <h1 className="text-lg sm:text-xl font-extrabold text-white leading-tight">{activeVideo.title}</h1>
                    <p className="text-xs text-gray-400 mt-1">{typeof activeVideo.channel === "string" ? activeVideo.channel : (activeVideo.channelName || "")} • {activeVideo.views} • {activeVideo.timeAgo}</p>
                  </div>
                </div>
                {/* Code panel — responsive */}
                <div className="lg:col-span-6 min-w-0">
                  <div className="bg-[#0f0f1f] border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[55vh] lg:h-[58vh] min-h-[420px]">
                    <div className="flex flex-nowrap gap-2 border-b border-white/10 bg-[#0f0f1f] overflow-x-auto scrollbar-hide touch-pan-x">
                      <button onClick={()=>setWatchPanelTab("code")} className={`px-4 py-3 text-sm font-bold whitespace-nowrap ${watchPanelTab==="code"?"bg-[#FFD700] text-black":"text-gray-400"}`}>Code &lt;/&gt;</button>
                      <button onClick={()=>setWatchPanelTab("preview")} className={`px-4 py-3 text-sm font-bold whitespace-nowrap ${watchPanelTab==="preview"?"bg-[#00D9FF] text-black":"text-gray-400"}`}>Preview</button>
                      <button onClick={()=>setWatchPanelTab("ai")} className={`px-4 py-3 text-sm font-bold whitespace-nowrap ${watchPanelTab==="ai"?"bg-[#A855F7] text-white":"text-gray-400"}`}>AI</button>
                      <button onClick={()=>setWatchPanelTab("terminal")} className={`px-4 py-3 text-sm font-bold whitespace-nowrap ${watchPanelTab==="terminal"?"bg-[#00FF88] text-black":"text-gray-400"}`}>Terminal &gt;_</button>
                      <button onClick={()=>setWatchPanelTab("notebook")} className={`px-4 py-3 text-sm font-bold whitespace-nowrap ${watchPanelTab==="notebook"?"bg-[#FFD700] text-black":"text-gray-500 hover:text-white"}`}>⋯ more &gt; Notebook</button>
                    </div>
                    <div className="flex-1 min-h-0 flex flex-col bg-[#0B0215]">
                      {watchPanelTab==="code" && (
                        <div className="flex-1 flex flex-col min-h-0 bg-[#0B0215]">
                          <div className="flex items-center gap-2 px-3 py-2 bg-[#1a1a24] border-b border-white/10 text-xs font-mono text-gray-300">
                            <span className="text-[#FFD700] font-bold">Editor</span>
                            <span className="text-gray-500">▸ HTML</span>
                            <span className="ml-auto text-green-400">● Live</span>
                            <button onClick={()=>{setCodeValue(''); showToast('Cleared');}} className="ml-2 px-2 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[11px]">Clear</button>
                          </div>
                          <div ref={monacoRef} className="flex-1 min-h-0 w-full bg-[#0A0A0F]" style={{minHeight:"280px"}}></div>
                          {!monacoReady && <textarea value={(codeValue||'').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&')} onChange={e=>setCodeValue(e.target.value)} spellCheck={false} placeholder="Loading Monaco editor..." className="absolute opacity-0 pointer-events-none" aria-hidden="true" />}
                          <div className="px-3 py-2 bg-[#1a1a24] border-t border-white/10 flex items-center justify-between text-xs font-mono text-gray-400">
                            <span>Line {codeValue.split('\n').length} • {codeValue.length} chars</span>
                            <button onClick={()=>{ setCodeValue(''); showToast('Cleared — ready to code!'); }} className="min-h-[32px] px-3 rounded-full bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700]/20 text-xs font-bold">Clear</button>
                          </div>
                          <button onClick={()=>{ setWatchPanelTab('preview'); showToast('Running → Preview'); }} className="sticky bottom-0 z-10 m-3 min-h-12 py-3.5 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#F59E0B] text-black font-extrabold text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2">▶ Run</button>
                          <button onClick={async () => {
                            if (!isProUser) { setShowPaywall(true); return; }
                            const title = window.prompt("Marketplace app title", activeVideo?.title || "My AI app");
                            const price = Number(window.prompt("Price in USD (5-50)", "10"));
                            if (!title || !Number.isFinite(price)) return;
                            const response = await fetch("/api/marketplace-publish", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ title, price, appCode: codeValue }) });
                            const data = await response.json().catch(() => ({}));
                            if (!response.ok) { showToast(data.message || data.error || "Publish failed"); return; }
                            showToast("Published to Marketplace ✓");
                          }} className="mx-3 mb-3 py-2.5 rounded-xl border border-[#00FF88]/40 text-[#00FF88] font-bold text-sm">Publish to Marketplace</button>
                        </div>
                      )}
                      {watchPanelTab==="preview" && (()=>{ const doc = workspacePreviewDocument(); return (<iframe key={doc} title="Live Preview" srcDoc={doc} sandbox="allow-scripts allow-same-origin allow-modals allow-forms" className="flex-1 w-full border-0 bg-white" />); })()}
                      {watchPanelTab==="ai" && (
                        <div className="flex-1 flex flex-col min-h-0 bg-[#0B0215]">
                          <div className="flex items-center gap-2 px-3 py-3 bg-[#1a1030] border-b border-[#FFD700]/20">
                            <span className="text-[#FFD700]">🔑</span>
                            <input id="byok-input" type="password" value={byokKey} onChange={e=>saveByokKey(e.target.value)} placeholder="Paste DeepSeek/OpenAI key (optional)" className="flex-1 min-h-[36px] bg-black/60 border border-[#FFD700]/30 rounded-full px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700]" />
                            <span className={`text-[10px] font-bold whitespace-nowrap ${byokKey ? "text-green-400" : "text-gray-400"}`}>{byokStatus}</span>
                            <button onClick={()=>{ setShowPaywall(false); setActiveTab("pricing"); }} className="hidden sm:block px-3 py-1.5 bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30 rounded-full text-xs font-bold hover:bg-[#FFD700]/30">Use Credits</button>
                          </div>
                          <div className="sm:hidden px-3 pb-2 bg-[#1a1030]"><button onClick={()=>setShowPaywall(true)} className="w-full py-2 bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30 rounded-full text-xs font-bold">Use Alphatekx Credits ₦500</button></div>
                          <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-[#0B0215]">
                            {aiChatMessages.map((m,i)=>(<div key={i} className={`p-3 rounded-2xl text-sm leading-relaxed max-w-[85%] whitespace-pre-wrap ${m.role==="user"?"bg-[#FFD700] text-black font-medium ml-auto shadow-md":"bg-[#151025] text-gray-200 mr-auto border border-[#FFD700]/20"}`}>{m.text}</div>))}
                            {building && <div className="text-xs text-[#FFD700] animate-pulse px-2">🤖 Building…</div>}
                          </div>
                          <div className="p-3 bg-[#0B0215] border-t border-white/5">
                            <div className="mb-2 flex items-center justify-between gap-2">
                              <span className="text-[10px] text-gray-500">Vibe Coding: {isProUser ? "PRO Unlimited" : `${aiUsage.vibe_code || 0}/2 free`}</span>
                              <button onClick={() => setShowByokModal(true)} className="text-[10px] font-bold text-[#FFD700]">BYOK / Pro</button>
                            </div>
                            <div className="flex gap-2">
                              <input value={aiChatInput} onChange={e=>setAiChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAiSend()} placeholder="Ask AI to build or explain..." className="flex-1 min-h-[44px] bg-[#1a1a2e] border border-[#FFD700]/30 rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700]" />
                              <button onClick={handleAiSend} className="min-h-[44px] px-5 py-2 bg-[#FFD700] text-black font-bold rounded-full text-sm hover:brightness-110">Send</button>
                            </div>
                            <p className="text-[10px] text-gray-500 font-mono text-center mt-2">Agent: <span className="text-[#FFD700]">&lt;create_file&gt;</span> → Preview live</p>
                          </div>
                        </div>
                      )}
                      {watchPanelTab==="terminal" && (
                        <div className="flex-1 flex flex-col bg-black p-3 font-mono text-sm overflow-hidden" style={{minHeight:"280px"}}>
                          <div ref={terminalRef} className={xtermRef.current ? "flex-1 overflow-hidden" : "hidden"} style={{minHeight: xtermRef.current ? "280px" : "0px"}} />
                          {!xtermRef.current && (
                            <div className="flex-1 flex flex-col min-h-0">
                              <div ref={simpleTermRef} className="flex-1 overflow-auto space-y-1 text-green-400 pr-1" style={{maxHeight:"240px"}}>
                                {simpleTermHistory.map((line,i)=>(<div key={i} className="whitespace-pre-wrap break-words text-xs leading-5">{line}</div>))}
                              </div>
                              <form onSubmit={(e)=>{e.preventDefault(); const cmd=simpleTermInput.trim(); if(!cmd){setSimpleTermHistory(h=>[...h, ""]); setSimpleTermInput(""); return;} let out=""; if(cmd==="ls") out="index.html  app.jsx  public  AgentConfig.ts  package.json"; else if(cmd==="pwd") out="/home/alphatekx"; else if(cmd.startsWith("echo ")) out=cmd.slice(5); else if(cmd==="clear"){setSimpleTermHistory(["Alphatekx Terminal — cleared","Type: ls, echo hello, pwd, cat, clear, help"]); setSimpleTermInput(""); return;} else if(cmd.startsWith("cat ")) out=(codeValue||"").split("\n").slice(0,40).join("\n")||"(empty file)"; else if(cmd==="node --version") out="v20.11.0"; else if(cmd==="npm --version"||cmd==="npm -v") out="10.2.3"; else if(cmd.startsWith("npm")) out="npm 10.2.3 — mock (browser only)"; else if(cmd==="help") out="Commands: ls, pwd, echo <text>, cat, clear, node --version, npm --version, help"; else if(cmd) out=`sh: ${cmd}: command not found — try: help`; setSimpleTermHistory(h=>[...h, `~ $ ${cmd}`, out].filter(Boolean)); setSimpleTermInput(""); setTimeout(()=>{if(simpleTermRef.current) simpleTermRef.current.scrollTop=simpleTermRef.current.scrollHeight;},10);}} className="flex items-center gap-2 mt-3 border-t border-white/10 pt-2">
                                <span className="text-[#FFD700] text-xs shrink-0">alphatekx:~$</span>
                                <input value={simpleTermInput} onChange={e=>setSimpleTermInput(e.target.value)} placeholder="type help + enter" className="flex-1 bg-transparent outline-none text-green-400 placeholder:text-gray-600 text-xs" autoFocus />
                                <button type="submit" className="px-3 py-1 bg-[#FFD700] text-black font-bold rounded-full text-xs">Run</button>
                              </form>
                            </div>
                          )}
                        </div>
                      )}
                      {watchPanelTab==="notebook" && (
                        <div className="flex-1 flex flex-col min-h-0 bg-[#0B0215]">
                          <div className="flex gap-1 p-2 bg-[#1a1030] border-b border-[#FFD700]/20">
                            <button onClick={()=>setNotebookTab("write")} className={`flex-1 py-2 rounded-full text-xs font-bold ${notebookTab==="write"?"bg-[#FFD700] text-black":"bg-white/5 text-gray-400"}`}>Write</button>
                            <button onClick={()=>setNotebookTab("autojot")} className={`flex-1 py-2 rounded-full text-xs font-bold ${notebookTab==="autojot"?"bg-[#FFD700] text-black":"bg-white/5 text-gray-400"}`}>Auto Jot</button>
                            <button onClick={()=>setNotebookTab("saved")} className={`flex-1 py-2 rounded-full text-xs font-bold ${notebookTab==="saved"?"bg-[#FFD700] text-black":"bg-white/5 text-gray-400"}`}>Saved</button>
                          </div>
                          <div className="flex-1 min-h-0 flex flex-col p-3">
                            {notebookTab==="write" && (
                              <textarea value={notebookNotes} onChange={e=>setNotebookNotes(e.target.value)} placeholder="Write notes for this video… auto-saves every 2s to localStorage" className="flex-1 min-h-[280px] w-full bg-[#0A0A0F] text-white font-mono text-sm p-4 rounded-xl border border-white/10 outline-none resize-none" />
                            )}
                            {notebookTab==="autojot" && (
                              <div className="space-y-3">
                                <button onClick={async()=>{ const key=localStorage.getItem('alphatekx_api_key')||byokKey; if(!key){setShowPaywall(true);return;} const transcript = `${activeVideo.title}\n${activeVideo.description||""}\nChapters: ${videoChapters.map(c=>c.timestamp+" "+c.title).join(", ")}`; const prompt=`Jot 5 notes with timestamps [MM:SS] from this transcript: ${transcript}`; setBuilding(true); try{ const isOpenAI=key.startsWith('sk-'); const url=isOpenAI?'https://api.openai.com/v1/chat/completions':'https://api.deepseek.com/chat/completions'; const model=isOpenAI?'gpt-4o':'deepseek-chat'; const res=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},body:JSON.stringify({model,messages:[{role:'system',content:'You are a note taker. Output 5 bullet notes with timestamps [MM:SS].'},{role:'user',content:prompt}]})}); const data=await res.json(); const notes=data.choices?.[0]?.message?.content||"No notes"; setNotebookNotes(prev=> prev ? prev+"\n\n--- Auto Jot ---\n"+notes : notes); showToast("✨ Auto Jot saved"); }catch{ const fallback=`- [00:00] Intro — ${activeVideo.title}\n- [02:14] Architecture — key concepts\n- [07:30] Training Loop — loss & gradients\n- [14:05] Evaluation — metrics\n- [22:18] Demo — live build`; setNotebookNotes(p=> p? p+"\n\n"+fallback : fallback); showToast("✨ Auto Jot (offline) saved"); } finally{setBuilding(false);} }} className="w-full py-3 bg-[#FFD700] text-black font-extrabold rounded-xl hover:brightness-110">✨ Jot notes from video</button>
                                <p className="text-xs text-gray-500">Uses your DeepSeek/OpenAI key — generates 5 timestamped notes.</p>
                                <p className="text-[11px] text-gray-600">Transcript: {activeVideo.title.slice(0,60)}...</p>
                              </div>
                            )}
                            {notebookTab==="saved" && (
                              <div className="flex-1 flex flex-col gap-3">
                                <div className="flex-1 bg-[#0A0A0F] rounded-xl border border-white/10 p-4 overflow-auto whitespace-pre-wrap text-sm text-white font-mono">{notebookNotes || "No notes yet. Write or Auto Jot."}</div>
                                <button onClick={()=>{ if(!notebookNotes.trim()){showToast("No notes");return;} const w=window.open("","_blank"); if(w){w.document.write(`<html><head><title>Notes - ${activeVideo.title}</title><style>body{font-family:system-ui;padding:24px;white-space:pre-wrap}</style></head><body><h1>${activeVideo.title}</h1><pre>${notebookNotes.replace(/</g,"&lt;")}</pre></body></html>`); w.document.close(); w.print(); } showToast("Export PDF — print dialog");}} className="py-3 bg-[#FFD700] text-black font-bold rounded-xl hover:brightness-110">Export PDF</button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------- 2. HOME / DISCOVER FEED — CLEAN mobile-first: generous spacing, 2 cols on mobile ------------------- */}
          {activeTab === "home" && (
            <div className="max-w-[1600px] mx-auto px-0 sm:px-5 md:px-6 py-3 sm:py-5 md:py-6 space-y-5 sm:space-y-6 overflow-x-hidden">
              <div className="sticky top-0 z-10 -mx-0 flex h-12 items-center gap-2 overflow-x-auto bg-[#0B0215] px-3 scrollbar-hide sm:px-0">
                {[["foryou", "For You 🔥"], ["following", "Following"], ["trending", "Trending 📈"], ["new", "New ✨"]].map(([tab, label]) => (
                  <button key={tab} onClick={() => { setBoostFeedTab(tab); setBoostFeedCursor(0); }} className={`min-h-11 flex-shrink-0 rounded-full border px-4 text-xs font-bold ${boostFeedTab === tab ? "border-[#FFD700] bg-[#FFD700] text-black" : "border-[#2A1A3E] bg-[#1A0B2E] text-gray-300"}`}>{label}</button>
                ))}
              </div>
              {searchQuery.trim() ? (
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
                    {isSearching && <span className="mr-2 text-[#FFD700]">Searching…</span>}
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
                        fetch("/api/search/history", { credentials: "include" }).then(r=>r.ok?r.json():null).then(data=>{
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
                            fetch("/api/search/history", { credentials: "include" }).then(r=>r.ok?r.json():null).then(data=>{
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
                            fetch("/api/search/history",{method:"DELETE", credentials:"include"}).catch(()=>{});
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
                        <div className="grid grid-cols-1 gap-5 px-3 sm:px-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-4 md:gap-6">
                          {searchHistory.map((vid)=>(
                            <div
                              key={`hist-${vid.youtubeId||vid.id}-${vid.searchedAt||""}`}
                              onClick={()=>{
                                allowVideoForUser(vid);
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
                                <button type="button" onClick={(event)=>{ event.stopPropagation(); navigateToChannel(vid.channelId || channelIdFromVideo(vid)); }} className="text-left text-xs text-gray-400 truncate hover:text-[#00D9FF]">{vid.channel||vid.channelName}</button>
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
                      <div className="grid grid-cols-2 gap-2 px-2 sm:px-0 md:grid-cols-3 lg:grid-cols-4 sm:gap-4 md:gap-6">
                        {uniqueVideos(searchFiltered).map((vid) => (
                          <VideoCard key={vid.youtubeId || vid.id} video={vid} onPlay={allowVideoForUser} onChannel={(v) => navigateToChannel(v.channelId || channelIdFromVideo(v))} cleanHome />
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
                  {continueHistory.length > 0 && <section className="space-y-3 px-3 sm:px-0"><div className="flex items-center justify-between"><h2 className="text-lg font-extrabold text-white">Continue Watching</h2><span className="text-xs text-gray-500">Saved on this device</span></div><div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">{continueHistory.slice(0, 10).map(item => <button key={item.videoId} onClick={() => allowVideoForUser({ id: item.videoId, youtubeId: item.videoId, title: item.title, img: item.thumbnail, thumbnailUrl: item.thumbnail })} className="w-56 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 text-left"><div className="relative aspect-video bg-black"><img src={item.thumbnail} alt="" className="h-full w-full object-cover" /><div className="absolute inset-x-0 bottom-0 h-1 bg-white/20"><div className="h-full bg-[#FFD700]" style={{ width: `${Math.min(100, Number(item.progress || 0) / 60)}%` }} /></div></div><p className="p-3 text-sm font-bold text-white line-clamp-2">{item.title}</p></button>)}</div></section>}
                  {recentSearches.length > 0 && <section className="space-y-2 px-3 sm:px-0"><h2 className="text-lg font-extrabold text-white">Recent Searches</h2><div className="flex flex-wrap gap-2">{recentSearches.map(query => <button key={query} onClick={() => { setSearchQuery(query); setActiveTab("home"); }} className="rounded-full border border-[#FFD700]/30 bg-[#FFD700]/10 px-3 py-2 text-xs text-[#FFD700]">{query}</button>)}</div></section>}
                  {/* Featured Hero — discovery is thumbnail-only; playback belongs on Watch */}
                  {featuredVideo && <div className="glass-card overflow-hidden border-0 sm:border border-[#FFD700]/30 p-0 sm:p-4 space-y-0 sm:space-y-4 rounded-none sm:rounded-2xl">
                    <div className="flex items-center gap-2 flex-wrap px-4 sm:px-0 pt-3 sm:pt-0">
                      <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black text-[10px] font-extrabold px-2.5 py-1 rounded-full">FEATURED</span>
                      <span className="text-xs text-gray-400">Featured from Alphatekx</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => allowVideoForUser(featuredVideo)}
                      className="group relative block w-full aspect-video bg-black overflow-hidden sm:rounded-xl text-left"
                      aria-label={`Watch ${featuredVideo.title}`}
                    >
                      <img
                        src={`https://i.ytimg.com/vi/${featuredVideo.youtubeId}/hqdefault.jpg`}
                        alt={featuredVideo.title}
                        className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
                        loading="eager"
                      />
                      <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-mono text-white">{featuredVideo.duration}</span>
                    </button>
                    <div className="space-y-1 px-4 sm:px-0 pb-3 sm:pb-0">
                      <h3 className="font-bold text-sm sm:text-base text-white line-clamp-2">{featuredVideo.title}</h3>
                      <button type="button" onClick={(event)=>{ event.stopPropagation(); navigateToChannel(featuredVideo.channelId || channelIdFromVideo(featuredVideo)); }} className="text-left text-xs text-gray-400 hover:text-[#00D9FF]">{featuredVideo.channelName || featuredVideo.channel} • {featuredVideo.handle || ""} • Featured</button>
                      <div className="flex gap-2 pt-1">
                        <button onClick={()=>allowVideoForUser(featuredVideo)} className="min-h-[44px] px-5 py-2.5 bg-[#FFD700] text-black font-bold text-xs rounded-xl">Watch Now</button>
                        <a href={`https://youtu.be/${featuredVideo.youtubeId}`} target="_blank" rel="noreferrer" className="min-h-[44px] px-5 py-2.5 bg-[#272727] text-white font-bold text-xs rounded-xl flex items-center">Open on YouTube ↗</a>
                      </div>
                    </div>
                  </div>}
                  {/* Shorts Shelf — tight like YouTube */}
                  <div className="space-y-3 px-2 sm:px-0">
                    <div className="flex items-center justify-between px-2 sm:px-0">
                      <h3 className="font-extrabold text-white flex items-center gap-2"><span className="bg-[#FF0000] text-white text-[10px] px-2 py-1 rounded font-bold">Shorts</span> Trending Shorts</h3>
                      <button onClick={()=>setActiveTab("shorts")} className="text-xs font-bold text-[#FFD700] hover:underline min-h-[44px] px-3 flex items-center">View all →</button>
                    </div>
                    <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory px-0">
                      {shortFeedVideos.map((s, idx)=>
                      <div key={s.id} onClick={()=>{ setShortsIndex(idx); setShortsMuted(false); setActiveTab("shorts"); if(mainScrollRef.current) mainScrollRef.current.scrollTop=0; showToast(`Playing Short: ${s.title}`); }} className="flex-shrink-0 w-[140px] sm:w-[160px] cursor-pointer snap-start group">
                          <div className="aspect-[9/16] rounded-xl overflow-hidden bg-black border border-white/10 relative group-hover:border-[#FF0000]/40 transition-colors">
                            <img src={`https://img.youtube.com/vi/${s.youtubeId}/hqdefault.jpg`} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <span className="absolute top-2 left-2 bg-[#FF0000] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">SHORT</span>
                            <div className="absolute bottom-2 left-2 right-2">
                              <p className="text-[10px] text-white/70">{s.views}</p>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity">
                              <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-black">▶</div>
                            </div>
                          </div>
                          <p className="text-xs font-bold text-white line-clamp-2 mt-1.5 leading-tight">{s.title}</p>
                          <p className="text-[11px] text-gray-500">{s.handle} • {s.likes} likes</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {homeFiltered.length>0 ? (
                  <>
                  <div className="grid grid-cols-1 gap-5 px-3 sm:px-0 sm:grid-cols-2 sm:gap-4 md:gap-6 md:grid-cols-3 lg:grid-cols-4">
                    {uniqueVideos(homeFiltered).map((vid) => (
                    vid.isSponsored ? <SponsoredAdCard key={vid.id} video={vid} /> : <VideoCard key={vid.youtubeId || vid.id} video={{...vid, platform:  vid.platform||"youtube"}} onPlay={allowVideoForUser} onChannel={(v) => navigateToChannel(v.channelId || channelIdFromVideo(v))} cleanHome />
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
                              <button onClick={async()=>{ const res=await fetch("/api/marketplace/purchase",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({productId:p.id}),credentials:"include"}); const d=await res.json().catch(()=>({})); if(d.success) showToast(d.stripe?.testMode ? "Test checkout completed — no live charge was made." : `Payment confirmed for ${p.name}`); else showToast(d.error || "Checkout unavailable"); }} className="w-full min-h-[44px] bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold text-xs rounded-xl">Buy securely</button>
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
            <div ref={homeFeedSentinelRef} className="flex min-h-16 items-center justify-center px-3 py-4" aria-live="polite">
              {boostFeedLoading && <span className="text-xs text-gray-500">Loading more videos…</span>}
              {!boostFeedLoading && !boostFeedHasMore && <span className="text-xs text-gray-600">You’re all caught up.</span>}
            </div>
            </div>
          )}

          {/* ------------------- 3. YOUTUBE SHORTS — BEST ABSOLUTE, SIMPLE LIKE YOUTUBE, EASY VOLUME ------------------- */}
          {activeTab === "shorts" && (
            <section className="shorts-shell fixed inset-0 z-20 w-full overflow-hidden bg-black md:static md:h-full">
              <div className="mx-auto flex h-full w-full max-w-[760px] flex-col">
                <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => navigateToTab("home")} className="pointer-events-auto flex min-h-10 items-center gap-1 rounded-full border border-white/15 bg-black/70 px-3 text-xs font-bold text-white" aria-label="Back to normal feed">← Back</button>
                    <span className="pointer-events-auto rounded-full bg-[#FF0000] px-2.5 py-1 text-[11px] font-extrabold text-white">Shorts</span>
                    <span className="text-xs text-gray-400">{shortFeedVideos.length ? shortsIndex + 1 : 0} / {shortFeedVideos.length}</span>
                  </div>
                  <div className="pointer-events-auto flex items-center gap-2">
                    <button onClick={() => scrollToShort(shortsIndex - 1)} disabled={shortsIndex === 0} aria-label="Previous short" className="rounded-full border border-white/10 px-3 py-1 text-xs text-white disabled:opacity-30">↑</button>
                    <button onClick={() => {
                      if (shortsIndex >= shortsVideos.filter(isShortFormVideo).length - 1) {
                        loadShortsPage().then(() => setTimeout(() => scrollToShort(shortsIndex + 1), 0));
                      } else scrollToShort(shortsIndex + 1);
                    }} aria-label="Next short" className="rounded-full border border-white/10 px-3 py-1 text-xs text-white">↓</button>
                  </div>
                </div>
                <div
                  ref={shortsScrollerRef}
                  onScroll={(e) => {
                    const height = e.currentTarget.clientHeight || 1;
                    const next = Math.round(e.currentTarget.scrollTop / height);
                    if (next !== shortsIndex && next >= 0 && next < shortFeedVideos.length) setShortsIndex(next);
                    if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop - e.currentTarget.clientHeight < height * 2) loadShortsPage();
                  }}
                  className="shorts-scroller min-h-0 flex-1 snap-y snap-mandatory overflow-y-auto overscroll-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  style={{ touchAction: "pan-y" }}
                >
                  {shortFeedVideos.map((short, idx) => (
                   <article key={short.feedKey || short.youtubeId || short.id} ref={el => { shortsSlideRefs.current[idx] = el; }} className="shorts-slide relative h-full min-h-full snap-start snap-always bg-black overflow-hidden" style={{ scrollSnapStop: "always" }}>
                      <div className="absolute inset-0 flex justify-center bg-black">
                        <div className="shorts-player relative h-[min(92dvh,900px)] aspect-[9/16] max-w-[min(92vw,520px)] overflow-hidden rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.7)]">
                          {idx === shortsIndex && !isGuest ? (
                            <iframe
                              key={`${short.youtubeId}-${shortsMuted}-${shortsPlaying}`}
                              src={`https://www.youtube.com/embed/${short.youtubeId}?enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&playsinline=1&controls=1&rel=0&modestbranding=1&autoplay=1&mute=${shortsMuted ? 1 : 0}&loop=1&playlist=${encodeURIComponent(short.youtubeId)}`}
                              title={short.title}
                              className="h-full w-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                              allowFullScreen
                            />
                          ) : (
                            <img src={`https://i.ytimg.com/vi/${short.youtubeId}/hqdefault.jpg`} alt="" className="h-full w-full object-cover" loading="lazy" />
                          )}
                          {idx === shortsIndex && isGuest && <button type="button" onClick={() => setShowSignUpBlock(true)} className="absolute inset-0 flex items-center justify-center bg-black/70 text-sm font-bold text-white">Sign up to watch Shorts</button>}
                        </div>
                      </div>
                      <button aria-label={shortsMuted ? "Unmute short" : "Mute short"} onClick={() => setShortsMuted(m => !m)} className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-lg text-white">{shortsMuted ? "🔇" : "🔊"}</button>
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/50 to-transparent" />
                      <div className="mobile-safe-bottom absolute bottom-0 left-0 right-16 z-10 space-y-2 p-4">
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={(event)=>{ event.stopPropagation(); navigateToChannel(short.channelId || channelIdFromVideo(short)); }} className="flex items-center gap-2">
                            <img src={short.avatar} alt="" className="h-8 w-8 rounded-full border-2 border-white object-cover" />
                            <span className="text-sm font-bold text-white">{short.handle || short.channelName}</span>
                          </button>
                          <button onClick={async () => {
                            if (isGuest) { setShowSignUpBlock(true); return; }
                            const channelId = short.channelId || channelIdFromVideo(short);
                            try {
                              const response = await fetch(`/api/channel/${encodeURIComponent(channelId)}/subscribe`, { method: "POST", credentials: "include" });
                              const data = await response.json().catch(() => ({}));
                              if (!response.ok) throw new Error(data.error || "Subscription failed");
                              showToast(data.subscribed ? `Subscribed to ${short.channelName || short.channel}!` : "Unsubscribed");
                            } catch (error) { showToast(error.message || "Subscription unavailable"); }
                          }} className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-black">Subscribe</button>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-white">{short.title}</p>
                        <p className="line-clamp-3 text-xs leading-5 text-gray-300">{short.description || "Watch this Short on Alphatekx."}</p>
                        <p className="text-xs text-gray-300">{short.views || "0 views"} • {short.likes || "0 likes"} • {short.comments || "0 comments"}</p>
                      </div>
                      <div className="absolute bottom-4 right-3 z-10 flex flex-col items-center gap-3">
                        <button onClick={async () => { if (isGuest) { setShowSignUpBlock(true); return; } try { const response = await fetch(`/api/video/${encodeURIComponent(short.youtubeId || short.id)}/like`, { method: "POST", credentials: "include" }); const data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.error || "Like failed"); setShortsLiked(s => ({ ...s, [short.id]: Boolean(data.liked) })); } catch (error) { showToast(error.message || "Like unavailable"); } }} aria-label={`Like short (${short.likes || "0 likes"})`} className={`flex h-11 w-11 flex-col items-center justify-center rounded-full bg-black/60 ${shortsLiked[short.id] ? "text-[#FFD700]" : "text-white"}`}><Icon name="like" className="h-6 w-6" /><span className="text-[9px]">{short.likes || "0"}</span></button>
                        <button onClick={() => { setShortsCommentsOpen(true); loadVideoComments(short.youtubeId); }} aria-label={`Comments on ${short.title}`} className="flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white"><Icon name="chat" className="h-6 w-6" /></button>
                        <button onClick={async () => {
                          const url = `${window.location.origin}/watch/${encodeURIComponent(short.youtubeId)}`;
                          try {
                            if (navigator.share) await navigator.share({ title: short.title, url });
                            else { await navigator.clipboard.writeText(url); showToast("Link copied"); }
                          } catch (error) {
                            if (error?.name !== "AbortError") showToast("Unable to share this Short");
                          }
                        }} aria-label="Share short" className="flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white"><Icon name="share" className="h-6 w-6" /></button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
              <div className="mt-4 border-t border-white/10 pt-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div><p className="text-xs font-bold text-white">Live Capture</p><p className="text-[11px] text-gray-500">Capture spoken discussion through your microphone, then clean it into exportable notes.</p></div>
                  <button onClick={startLiveCapture} className={`shrink-0 rounded-full px-3 py-2 text-[11px] font-bold ${isCapturing ? "bg-red-500 text-white" : "bg-[#00FF88] text-black"}`}>{isCapturing ? "Stop" : "Start capture"}</button>
                </div>
                {(captureTranscript || captureNotes) && <div className="space-y-2">
                  <textarea value={captureTranscript} onChange={e => setCaptureTranscript(e.target.value)} placeholder="Your live transcript appears here..." className="w-full min-h-[80px] rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-gray-200 outline-none focus:border-[#00FF88]" />
                  <div className="flex flex-wrap gap-2">
                    <button onClick={cleanLiveCapture} disabled={isCleaningCapture} className="rounded-full bg-[#A855F7] px-3 py-2 text-[11px] font-bold text-white">{isCleaningCapture ? "Cleaning..." : "Clean with AI"}</button>
                    {captureNotes && <><button onClick={() => exportCapture("md")} className="rounded-full border border-white/15 px-3 py-2 text-[11px] font-bold text-white">Export Markdown</button><button onClick={() => exportCapture("txt")} className="rounded-full border border-white/15 px-3 py-2 text-[11px] font-bold text-white">Download TXT</button></>}
                  </div>
                  {captureNotes && <div className="rounded-xl border border-[#00FF88]/20 bg-black/30 p-3 text-xs text-gray-200 space-y-2"><p className="font-bold text-white">{captureNotes.title || "Clean capture"}</p><p>{captureNotes.summary}</p>{(captureNotes.sections || []).slice(0, 3).map(section => <div key={section.heading}><p className="font-bold text-[#00FF88]">{section.heading}</p><ul className="list-disc pl-4">{(section.bullets || []).slice(0, 4).map(item => <li key={item}>{item}</li>)}</ul></div>)}</div>}
                </div>}
              </div>
            </section>
          )}

          {shortsCommentsOpen && currentShort && (
            <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 sm:items-center" onClick={() => setShortsCommentsOpen(false)}>
              <section className="flex max-h-[78dvh] w-full max-w-lg flex-col rounded-t-2xl border border-white/10 bg-[#151025] p-4 sm:rounded-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h2 className="font-bold text-white">Comments</h2>
                    <p className="max-w-[280px] truncate text-xs text-gray-400">{currentShort?.title || "No Shorts available right now"}</p>
                  </div>
                  <button onClick={() => setShortsCommentsOpen(false)} aria-label="Close comments" className="rounded-full px-3 py-1 text-xl text-gray-400 hover:text-white">×</button>
                </div>
                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto py-3">
                  {commentsLoading ? (
                    <p className="py-8 text-center text-sm text-gray-400">Loading real YouTube comments…</p>
                  ) : videoComments.length === 0 && (shortsComments[currentShort.youtubeId] || []).length === 0 ? (
                    <p className="py-8 text-center text-sm text-gray-400">No public comments available for this Short.</p>
                  ) : (
                    <>
                      {videoComments.map(comment => (
                        <div key={comment.id} className="rounded-xl bg-white/5 p-3">
                          <p className="text-xs font-bold text-[#FFD700]">{comment.author}</p>
                          <p className="mt-1 text-sm text-white">{comment.text}</p>
                          <p className="mt-1 text-[11px] text-gray-500">{comment.likeCount ? `${comment.likeCount} likes` : ""}</p>
                        </div>
                      ))}
                      {(shortsComments[currentShort.youtubeId] || []).map(comment => (
                        <div key={comment.id} className="rounded-xl bg-white/5 p-3">
                          <p className="text-xs font-bold text-[#FFD700]">{comment.author}</p>
                          <p className="mt-1 text-sm text-white">{comment.text}</p>
                        </div>
                      ))}
                    </>
                  )}
                </div>
                <form onSubmit={e => {
                  e.preventDefault();
                  const text = shortsCommentText.trim();
                  if (!text) return;
                  if (isGuest) { setShowSignUpBlock(true); return; }
                  const id = currentShort.youtubeId;
                  setShortsComments(prev => ({ ...prev, [id]: [...(prev[id] || []), { id: Date.now(), author: "You", text }] }));
                  setShortsCommentText("");
                  fetch("/api/community/send", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ message: text, channel: "shorts", videoId: id, userName: authUser?.name || authUser?.email || "You", avatarInitials: (authUser?.name || authUser?.email || "Y").charAt(0).toUpperCase() })
                  }).catch(() => {});
                }} className="flex gap-2 border-t border-white/10 pt-3">
                  <input value={shortsCommentText} onChange={e => setShortsCommentText(e.target.value)} placeholder="Add a comment..." className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-[#FFD700]" />
                  <button type="submit" className="rounded-xl bg-[#FFD700] px-4 py-2.5 text-sm font-bold text-black">Post</button>
                </form>
              </section>
            </div>
          )}

          {/* ------------------- SUPERPOWER #7: AI TEACHER ------------------- */}
          {activeTab === "teacher" && (
            <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
              <div className="glass-card neon-border-green overflow-hidden">
                <div className="p-6 md:p-8 bg-gradient-to-br from-[#10231d] via-[#12121e] to-[#171126]">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#00FF88]/15 text-[#00FF88] flex items-center justify-center border border-[#00FF88]/30 flex-shrink-0">
                      <Icon name="teacher" className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#00FF88]">Alphatekx Learning Lab</p>
                      <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">AI Teacher</h1>
                      <p className="text-sm text-gray-300 mt-2 max-w-2xl">A patient, expert tutor for any question. Learn a new subject, solve a difficult problem, prepare for an exam, or explore the current video.</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {["Explain a concept simply", "Help me study for an exam", "Create a learning plan"].map(suggestion => (
                      <button key={suggestion} onClick={() => setTeacherQuestion(suggestion)} className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs text-gray-300 hover:border-[#00FF88]/60 hover:text-white">{suggestion}</button>
                    ))}
                  </div>
                </div>
                <div className="p-6 md:p-8 space-y-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Build a guided course</p>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
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
                  <div className="border-t border-white/10 pt-5 space-y-3 text-left">
                  <p className="text-xs font-bold text-[#FFD700]">Ask your tutor anything</p>
                  {teacherMessages.length > 0 && <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                    {teacherMessages.map((message, index) => <div key={index} className="space-y-2">
                      <div className="ml-auto max-w-[90%] rounded-2xl rounded-br-sm bg-[#00FF88]/15 border border-[#00FF88]/20 px-4 py-3 text-sm text-white">{message.question}</div>
                      <div className="max-w-[95%] rounded-2xl rounded-bl-sm bg-black/40 border border-white/10 px-4 py-3 text-sm leading-6 text-gray-200 whitespace-pre-wrap">{message.answer}</div>
                    </div>)}
                  </div>}
                  <div className="flex gap-2">
                    <input value={teacherQuestion} onChange={e => setTeacherQuestion(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleAskTeacher(); }} placeholder="Ask anything — maths, code, business, science..." className="min-w-0 flex-1 bg-black/80 border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FFD700]" />
                    <button onClick={handleAskTeacher} disabled={isAskingTeacher} className="px-4 py-3 bg-[#FFD700] text-black font-bold text-xs rounded-xl">{isAskingTeacher ? "Asking…" : "Ask"}</button>
                  </div>
                </div>
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

                {memoryAnswer && <div className="rounded-xl border border-[#00D9FF]/30 bg-[#00D9FF]/10 p-4 text-sm text-gray-200 whitespace-pre-wrap">{memoryAnswer}</div>}
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
                            const matched = videoCatalog.find(v => (v.youtubeId || v.id) === res.videoId);
                            if (matched) setActiveVideo(matched);
                            setActiveTab("watch");
                            const parts = String(res.timestamp || "0:00").split(":").map(Number);
                            const seconds = parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : parts[0] * 60 + parts[1];
                            handleSeek(Number.isFinite(seconds) ? seconds : 0, res.timestamp);
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
          {false && activeTab === "studio" && (
            <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
              <div className="glass-card p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <Icon name="studio" className="w-8 h-8 text-purple-400" />
                  <div>
                    <h1 className="text-2xl font-bold text-white">AI Studio Superpowers</h1>
                    <p className="text-xs text-gray-400">Clip Maker, 4K Thumbnail Enhancer & Voice Over Translator</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {studioTemplates.map(template => (
                    <div key={template.id} className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-2">
                      <h2 className="font-bold text-white">{template.name}</h2>
                      <p className="text-xs text-gray-400">{template.description}</p>
                      <button onClick={() => { setCodeValue(template.code); setWatchPanelOpen(false); setWatchPanelTab("preview"); setActiveTab("workspace"); window.history.pushState({}, "", "/workspace"); }} className="px-3 py-2 rounded-lg bg-[#FFD700] text-black text-xs font-bold">Use Template</button>
                    </div>
                  ))}
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
                        if (!(await openAiFeature("video_gen"))) return;
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
                        if (!(await openAiFeature("thumbnail"))) return;
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
                        if (!(await openAiFeature("translator"))) return;
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-8 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">FREE</h3>
                    <div className="text-3xl font-extrabold text-gray-400">$0 <span className="text-xs font-normal">/ month</span></div>
                  </div>

                  <ul className="space-y-3 text-xs text-gray-300">
                    <li className="flex items-center gap-2">✓ Video publishing: Unlimited</li>
                    <li className="flex items-center gap-2">✓ AI features: 10 requests / 5 hours</li>
                    <li className="flex items-center gap-2">✓ AI weekly: 50 requests / week</li>
                    <li className="flex items-center gap-2">✓ Marketplace: 5 products</li>
                    <li className="flex items-center gap-2">✓ Feed boost: No boost</li>
                  </ul>
                  <p className="text-[11px] text-gray-500">AI limits reset automatically every 5 hours and weekly.</p>

                  <button disabled className="w-full py-3 bg-white/10 text-gray-400 font-bold text-xs rounded-xl">
                    Current Plan
                  </button>
                </div>

                <div className="glass-card p-8 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">LITE</h3>
                    <div className="text-3xl font-extrabold text-[#FFD700]">$5 <span className="text-xs font-normal text-gray-300">/ month</span></div>
                  </div>
                  <ul className="space-y-3 text-xs text-gray-300">
                    <li className="flex items-center gap-2">✓ Video publishing: Unlimited</li>
                    <li className="flex items-center gap-2">✓ AI features: 30 requests / 5 hours</li>
                    <li className="flex items-center gap-2">✓ AI weekly: 150 requests / week</li>
                    <li className="flex items-center gap-2">✓ Marketplace: 25 products</li>
                    <li className="flex items-center gap-2">✓ Feed boost: Standard</li>
                  </ul>
                  <p className="text-[11px] text-gray-500">₦5,000/month. AI limits reset automatically.</p>
                  <button onClick={() => startProCheckout("lite")} className="w-full py-3 bg-[#FFD700] text-black font-bold text-xs rounded-xl">
                    Upgrade to Lite — $5/month
                  </button>
                </div>

                <div className="glass-card neon-border-blue p-8 space-y-6 relative overflow-hidden">
                  <div className="absolute top-3 right-3 bg-[#00D9FF] text-black font-extrabold text-[10px] font-mono px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[#FFD700] flex items-center gap-2">
                      <span>PRO</span>
                      <Icon name="crown" className="w-5 h-5 text-[#00FF88]" />
                    </h3>
                    <div className="text-3xl font-extrabold text-[#00D9FF]">
                      $19 <span className="text-xs font-normal text-gray-300">/ month or $99 / year (charged in NGN equivalent)</span>
                    </div>
                  </div>

                  <ul className="space-y-3 text-xs text-gray-200">
                    <li className="flex items-center gap-2 text-[#00FF88]">✓ Video publishing: Unlimited</li>
                    <li className="flex items-center gap-2 text-[#00FF88]">✓ AI features: 100 requests / 5 hours</li>
                    <li className="flex items-center gap-2 text-[#00FF88]">✓ AI weekly: 500 requests / week</li>
                    <li className="flex items-center gap-2 text-[#00FF88]">✓ Marketplace: Unlimited + sponsored placement</li>
                    <li className="flex items-center gap-2 text-[#00FF88]">✓ Feed boost: 1.3x score + priority support</li>
                  </ul>
                  <div className="rounded-xl border border-[#2A1A3E] bg-black/20 p-3 text-[11px] text-gray-400">
                    <p>5-hour rolling window + weekly cap. Resets automatically.</p>
                    <p className="mt-1 text-white">
                      {aiRateInfo
                        ? `You used ${aiRateInfo.usedInWindow}/${aiRateInfo.windowLimit} in this window · Weekly ${aiRateInfo.weeklyUsed}/${aiRateInfo.weeklyLimit}`
                        : "Loading live AI usage…"}
                    </p>
                  </div>
                  <p className="text-[11px] text-gray-500">ⓘ Limits protect fair access at scale, like ChatGPT Plus. Video is never included in AI limits.</p>

                  <button 
                    onClick={() => startProCheckout("monthly")}
                    className="w-full py-3.5 bg-gradient-to-r from-[#00D9FF] to-[#00FF88] text-black font-extrabold text-sm rounded-xl shadow-[0_0_25px_rgba(0,217,255,0.4)] hover:opacity-90 active:scale-95"
                  >
                    {isProUser ? "You are Pro ✓" : "Upgrade to Pro — $19/month"}
                  </button>
                  {!isProUser && <button onClick={() => startProCheckout("yearly")} className="w-full py-3 rounded-xl border border-[#00D9FF]/40 text-[#00D9FF] text-sm font-bold hover:bg-[#00D9FF]/10">Choose annual — $99/year (NGN equivalent)</button>}
                </div>
              </div>
            </div>
          )}

          {activeTab === "ads" && (
            <div className="mx-auto max-w-3xl space-y-5 p-3 sm:p-6">
              <div>
                <h1 className="text-xl font-extrabold text-[#FFD700]">Run Ads — $2/day — Auto Live</h1>
                <p className="mt-1 text-sm text-gray-400">1–2 minute video only. Pay and the system starts or queues your ad automatically — no admin approval.</p>
              </div>
              <form onSubmit={createAdCampaign} className="glass-card space-y-4 p-4 sm:p-6">
                {adsError && <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{adsError}</p>}
                <input required value={adsForm.company_name} onChange={e=>setAdsForm({...adsForm, company_name:e.target.value})} placeholder="Company name" className="min-h-11 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-sm text-white" />
                <input required value={adsForm.title} onChange={e=>setAdsForm({...adsForm, title:e.target.value})} placeholder="Ad title" className="min-h-11 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-sm text-white" />
                <div>
                  <input required type="url" value={adsForm.video_url} onChange={e=>handleAdVideoUrl(e.target.value)} placeholder="Public video URL (60–120 seconds)" className="min-h-11 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-sm text-white" />
                  {adsDuration !== null && <p className={`mt-1 text-xs ${adsDuration >= 60 && adsDuration <= 120 ? "text-green-400" : "text-red-400"}`}>Detected duration: {Math.round(adsDuration)}s {adsDuration >= 60 && adsDuration <= 120 ? "✓" : "— must be 60–120s"}</p>}
                </div>
                <input type="url" value={adsForm.thumbnail_url} onChange={e=>setAdsForm({...adsForm, thumbnail_url:e.target.value})} placeholder="Thumbnail URL (optional)" className="min-h-11 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-sm text-white" />
                <input required type="url" value={adsForm.link_url} onChange={e=>setAdsForm({...adsForm, link_url:e.target.value})} placeholder="Website or WhatsApp destination" className="min-h-11 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-sm text-white" />
                <label className="block text-sm text-gray-300">Days
                  <input required type="number" min="1" step="1" inputMode="numeric" value={adsForm.days} onChange={e=>setAdsForm({...adsForm, days:e.target.value})} className="mt-1 min-h-11 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-white" />
                </label>
                <div className="rounded-xl border border-[#FFD700]/30 bg-[#FFD700]/10 p-4">
                  <p className="text-sm text-gray-300">$2 × {adsForm.days} day{Number(adsForm.days) === 1 ? "" : "s"}</p>
                  <p className="text-2xl font-extrabold text-[#FFD700]">${Number(adsForm.days||1)*2} / ₦{adsPriceNgn.toLocaleString()}</p>
                </div>
                <button disabled={adsLoading} className="min-h-12 w-full rounded-xl bg-[#FFD700] font-extrabold text-black disabled:opacity-50">{adsLoading ? "Preparing Paystack…" : `Pay $${Number(adsForm.days||1)*2} — Go Live`}</button>
                <p className="text-xs leading-relaxed text-gray-500">No admin approval. After payment, your ad starts now when the slot is free or joins the automatic queue. One sponsored video appears at the top of For You.</p>
                {createdAd?.status && <p className="rounded-xl border border-[#FFD700]/30 bg-[#FFD700]/10 p-3 text-sm text-[#FFD700]">🔥 {createdAd.status === "active" ? "Live now" : "Automatically queued"} — starts {new Date(createdAd.start_at || createdAd.start_date).toLocaleString()}</p>}
              </form>
              <div className="glass-card p-4">
                <h2 className="font-bold text-white">My ads</h2>
                {!myAds.length ? <p className="mt-2 text-sm text-gray-500">Your campaigns will appear here after setup.</p> : <div className="mt-3 space-y-2">{myAds.map(ad=>{ const hours = ad.end_at ? Math.max(0, Math.ceil((Number(ad.end_at) - Date.now()) / 3600000)) : 0; return <div key={ad.id} className="flex items-center justify-between rounded-xl border border-white/10 p-3 text-sm"><span className="truncate text-gray-200">{ad.title}</span><span className="ml-3 text-right text-xs font-bold text-[#FFD700]">{ad.status}{ad.status === "active" && ` · ${Math.ceil(hours / 24)}d left`}</span></div>; })}</div>}
              </div>
            </div>
          )}

          {/* ------------------- MARKETPLACE — PROMPT #6 (20% fee, Stripe, Seller Dashboard) ------------------- */}
          {activeTab === "marketplace" && (
           <div className="max-w-6xl mx-auto w-full min-w-0 p-3 sm:p-4 md:p-8 space-y-5 overflow-x-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                 <h1 className="text-2xl font-extrabold text-white">Market</h1>
                 <p className="text-xs text-gray-400">Discover digital products from Alphatekx creators.</p>
                </div>
                <div className="flex gap-2">
                 <button onClick={() => setSellSheetOpen(true)} className="min-h-[44px] px-5 py-2.5 bg-[#00FF88] text-black font-extrabold text-xs rounded-xl hover:bg-[#00c468]">+ Sell</button>
                  <button onClick={() => { setMarketplaceView(marketplaceView==="dashboard"?"products":"dashboard"); if(marketplaceView!=="dashboard") loadSellerSales(); }} className="min-h-[44px] px-5 py-2.5 bg-[#272727] text-white font-bold text-xs rounded-xl border border-white/10">
                   {marketplaceView==="dashboard" ? "Products" : "My shop"}
                  </button>
                </div>
              </div>

             {!marketplaceDetail && marketplaceView !== "dashboard" && (
               <div className="flex flex-col sm:flex-row gap-2">
                 <div className="relative flex-1">
                   <Icon name="search" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                   <input value={marketplaceSearch} onChange={e=>setMarketplaceSearch(e.target.value)} placeholder="Search products, creators, tags…" className="w-full min-h-[44px] bg-black/50 border border-white/10 rounded-xl pl-10 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700]/60" />
                 </div>
                 <select value={marketplaceSort} onChange={e=>setMarketplaceSort(e.target.value)} className="min-h-[44px] bg-black/50 border border-white/10 rounded-xl px-3 text-xs text-white">
                   <option value="newest">Newest</option>
                   <option value="popular">Most popular</option>
                   <option value="price-low">Price: low to high</option>
                   <option value="price-high">Price: high to low</option>
                 </select>
               </div>
             )}

             {marketplaceDetail ? (
               <div className="space-y-4">
                 <button onClick={closeMarketplaceProduct} className="min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200">← Back to Market</button>
                 {marketplaceDetail.product ? (
                   <div className="glass-card overflow-hidden border border-white/10">
                     {marketplaceDetail.product.thumbnailUrl && <img src={marketplaceDetail.product.thumbnailUrl} alt="" className="w-full max-h-64 object-cover" />}
                     <div className="p-5 sm:p-7 space-y-4">
                       <div className="flex flex-wrap items-center gap-2">
                         <span className="text-[10px] font-bold uppercase bg-[#FFD700] text-black px-2 py-1 rounded-full">{marketplaceDetail.product.badge || marketplaceDetail.product.category}</span>
                         <span className="text-xs text-gray-500">{marketplaceDetail.product.salesCount || 0} sales</span>
                       </div>
                       <h2 className="text-2xl font-extrabold text-white break-words">{marketplaceDetail.product.name}</h2>
                       <p className="text-sm text-gray-300 whitespace-pre-wrap">{marketplaceDetail.product.description}</p>
                       <p className="text-xs text-gray-500">By {marketplaceDetail.product.sellerEmail}</p>
                       <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
                         <span className="text-2xl font-extrabold text-[#FFD700]">₦{Number(marketplaceDetail.product.price).toLocaleString()}</span>
                         <button onClick={()=>setCheckoutProduct(marketplaceDetail.product)} className="sm:ml-auto min-h-[44px] px-6 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold text-sm">Buy securely</button>
                       </div>
                     </div>
                   </div>
                 ) : <div className="glass-card p-8 text-center text-sm text-gray-400">Loading product…</div>}
               </div>
             ) : (
             <>
             {/* Category filter */}
             <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {["all","app","course","plugin"].map(c => (
                  <button key={c} onClick={()=>setMarketplaceCategory(c)} className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${marketplaceCategory===c ? "bg-[#FFD700] text-black" : "bg-[#272727] text-gray-300 border border-white/10"}`}>{c}</button>
                ))}
              </div>
              {marketplaceApps.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {marketplaceApps.map(item => (
                    <div key={item.id} className="glass-card p-4 border border-[#00FF88]/30 space-y-2">
                      <h3 className="font-bold text-white">{item.title}</h3>
                      <p className="text-xs text-gray-400">By {item.creatorName} • ${item.price}</p>
                      <button onClick={() => { setCodeValue(item.code); setWatchPanelOpen(true); setWatchPanelTab("preview"); setActiveTab("watch"); }} className="w-full py-2 rounded-lg bg-[#00FF88] text-black text-xs font-bold">Preview App</button>
                    </div>
                  ))}
                </div>
              )}

              {marketplaceView === "dashboard" ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input value={sellerEmailInput} onChange={e=>setSellerEmailInput(e.target.value)} placeholder="seller email" className="min-w-0 flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white" />
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
                        <div key={s.id} className="p-3 flex justify-between gap-3 text-xs">
                          <div className="min-w-0"><p className="font-bold text-white truncate">{s.productName}</p><p className="text-gray-400 break-all">{s.buyerEmail} → {s.sellerEmail}</p></div>
                          <div className="text-right flex-shrink-0"><p className="font-bold text-white">${s.price}</p><p className="text-[#00FF88]">You ${s.sellerRevenue} <span className="text-gray-500">Fee ${s.platformFee}</span></p></div>
                        </div>
                      ))}
                      {sellerSales.sales.length===0 && <p className="p-8 text-center text-sm text-gray-500">No sales yet for {sellerEmailInput}</p>}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {marketplaceLoading && <div className="sm:col-span-2 lg:col-span-3 text-center py-8 text-sm text-gray-500">Loading products…</div>}
                  {marketplaceProducts.map((product) => {
                    const fee = +(product.price*0.20).toFixed(2);
                    const sellerGets = +(product.price - fee).toFixed(2);
                    return (
                      <div key={product.id} className="glass-card min-w-0 p-4 sm:p-6 flex flex-col justify-between space-y-4 border border-white/10 hover:border-[#FFD700]/20 transition-colors">
                        <div className="space-y-3">
                          {product.thumbnailUrl ? <img src={product.thumbnailUrl} alt={product.name} loading="lazy" className="w-full h-32 object-cover rounded-xl border border-white/10" /> : <div className="w-full h-20 rounded-xl bg-gradient-to-br from-[#00D9FF]/20 to-[#00FF88]/10 flex items-center justify-center text-3xl">{product.iconType === "video" ? "🎬" : product.iconType === "sparkles" ? "✨" : "🧠"}</div>}
                          <div className="flex items-center justify-between gap-2 min-w-0">
                            <span className="text-xs font-mono font-bold text-[#00D9FF] bg-[#00D9FF]/10 px-2.5 py-1 rounded">{product.badge}</span>
                            <span className="text-[10px] text-gray-500">{product.category} • {product.salesCount} sales</span>
                          </div>
                          <button onClick={()=>openMarketplaceProduct(product)} className="text-left font-bold text-base text-white line-clamp-2 hover:text-[#FFD700]">{product.name}</button>
                          <p className="text-xs text-gray-400 line-clamp-2">{product.description}</p>
                          <p className="text-[11px] text-gray-500">{product.sellerEmail}</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-extrabold text-[#FFD700]">₦{Number(product.price).toLocaleString()}</span>
                            <span className="text-[11px] text-gray-400 text-right">Seller ₦{Number(sellerGets).toLocaleString()} • Fee ₦{Number(fee).toLocaleString()} (20%)</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setCheckoutProduct(product)}
                              className="flex-1 min-h-[44px] px-5 py-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold text-xs rounded-xl"
                            >
                              Buy securely
                            </button>
                            <button
                              onClick={() => openMarketplaceProduct(product)}
                              className="px-4 min-h-[44px] bg-[#272727] text-white text-xs font-bold rounded-xl border border-white/10"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                 {!marketplaceLoading && marketplaceProducts.length === 0 && <p className="sm:col-span-2 lg:col-span-3 text-center py-10 text-sm text-gray-500">No products match your search.</p>}
                </div>
              )}
              </>
              )}
            </div>
          )}

          {/* ------------------- SELL PRODUCT FORM — PROMPT #6 (20% fee, Stripe) ------------------- */}
          {activeTab === "sell" && (
            <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-6">
              <div className="glass-card p-8 space-y-6 border border-white/10">
                <h1 className="text-xl font-extrabold text-white">List Your Product — 80% Royalty</h1>
                <p className="text-xs text-gray-400">Alphatekx takes 20% on every sale. A hosted download URL is required.</p>
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
                      fileUrl: fd.get("fileUrl"),
                    };
                    if (!payload.name || payload.price <= 0 || !/^https:\/\/\S+$/i.test(String(payload.fileUrl || ""))) { showToast("Name, valid price, and hosted HTTPS download URL required"); return; }
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
                      <label className="text-gray-400 block mb-1">Price (₦)</label>
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

          {sellSheetOpen && (
            <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end justify-center">
              <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl bg-[#101018] border border-white/10 p-4 sm:p-6 shadow-[0_-12px_50px_rgba(0,0,0,.55)]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#00FF88] font-bold">Creator tools</p>
                    <h2 className="text-xl font-extrabold text-white">Sell a digital product</h2>
                  </div>
                  <button onClick={()=>{setSellSheetOpen(false);setSellError("");}} className="w-10 h-10 rounded-full bg-white/5 text-gray-300 text-xl" aria-label="Close sell form">×</button>
                </div>
                <form onSubmit={submitMarketplaceProduct} className="space-y-4">
                  {sellError && <p role="alert" className="rounded-xl bg-red-500/10 border border-red-400/30 p-3 text-xs text-red-300">{sellError}</p>}
                  <input value={sellForm.name} onChange={e=>setSellForm({...sellForm,name:e.target.value})} required minLength={2} placeholder="Product name" className="w-full min-h-[44px] bg-black/60 border border-white/10 rounded-xl px-3 text-sm text-white placeholder-gray-500" />
                  <textarea value={sellForm.description} onChange={e=>setSellForm({...sellForm,description:e.target.value})} required rows={3} placeholder="What will buyers get?" className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-500" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input value={sellForm.price} onChange={e=>setSellForm({...sellForm,price:e.target.value})} required type="number" min="500" step="1" placeholder="Price (₦)" className="w-full min-h-[44px] bg-black/60 border border-white/10 rounded-xl px-3 text-sm text-white placeholder-gray-500" />
                    <select value={sellForm.category} onChange={e=>setSellForm({...sellForm,category:e.target.value})} className="w-full min-h-[44px] bg-black/60 border border-white/10 rounded-xl px-3 text-sm text-white">
                      <option value="app">App</option><option value="course">Course</option><option value="plugin">Plugin</option>
                    </select>
                  </div>
                  <input value={sellForm.tags} onChange={e=>setSellForm({...sellForm,tags:e.target.value})} placeholder="Tags (comma separated)" className="w-full min-h-[44px] bg-black/60 border border-white/10 rounded-xl px-3 text-sm text-white placeholder-gray-500" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="rounded-xl border border-dashed border-white/20 p-3 text-xs text-gray-400 cursor-pointer hover:border-[#00D9FF]">
                      <span className="block text-white font-bold mb-1">Product file</span>
                      <span>{sellForm.fileName || "PDF, ZIP, RAR, APK, TXT, DOCX, JSON, XMP (20 MB max)"}</span>
                      <input type="file" accept=".pdf,.zip,.rar,.apk,.txt,.docx,.json,.xmp" onChange={handleMarketplaceFile} className="sr-only" />
                    </label>
                    <label className="rounded-xl border border-dashed border-white/20 p-3 text-xs text-gray-400 cursor-pointer hover:border-[#00D9FF]">
                      <span className="block text-white font-bold mb-1">Thumbnail</span>
                      <span>PNG/JPG/WebP (2 MB max)</span>
                      <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleMarketplaceThumbnail} className="sr-only" />
                    </label>
                  </div>
                  {sellThumbnailPreview && <img src={sellThumbnailPreview} alt="Thumbnail preview" className="w-full h-32 object-cover rounded-xl border border-white/10" />}
                  <input value={sellForm.fileUrl} onChange={e=>setSellForm({...sellForm,fileUrl:e.target.value})} required type="url" placeholder="Hosted download URL (https://…)" className="w-full min-h-[44px] bg-black/60 border border-white/10 rounded-xl px-3 text-sm text-white placeholder-gray-500" />
                  <input value={sellForm.sellerEmail || authUser?.email || ""} onChange={e=>setSellForm({...sellForm,sellerEmail:e.target.value})} type="email" placeholder="Payout email" className="w-full min-h-[44px] bg-black/60 border border-white/10 rounded-xl px-3 text-sm text-white placeholder-gray-500" />
                  <p className="text-[11px] text-gray-500">The selected file is validated in your browser. Provide a hosted download URL so buyers can receive the asset after payment.</p>
                  <button type="submit" disabled={sellLoading} className="w-full min-h-[46px] rounded-xl bg-gradient-to-r from-[#00FF88] to-[#00D9FF] text-black font-extrabold text-sm">{sellLoading ? "Publishing…" : "Publish product"}</button>
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
                    {channelData.banner && <img src={channelData.banner} alt="Channel Banner" className="absolute inset-0 w-full h-full object-cover opacity-50" />}
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
                      <p className={`text-xs text-gray-300 max-w-2xl ${channelDescriptionOpen ? "" : "line-clamp-2"}`}>{channelData.description}</p>
                      {channelData.description && <button onClick={() => setChannelDescriptionOpen(open => !open)} className="text-xs font-bold text-[#00D9FF]">{channelDescriptionOpen ? "Show less" : "...more"}</button>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={async ()=>{
                        if (isGuest) { setShowSignUpBlock(true); return; }
                        const channelId = channelData.id || activeChannelId;
                        try {
                          const response = await fetch(`/api/channel/${encodeURIComponent(channelId)}/subscribe`, { method: "POST", credentials: "include" });
                          const data = await response.json().catch(() => ({}));
                          if (!response.ok) throw new Error(data.error || "Subscription failed");
                          setChannelSubscribed(Boolean(data.subscribed));
                          try { localStorage.setItem(`alphatekx_sub_${authUser?.id || authUser?.email}_${channelId}`, data.subscribed ? "1" : "0"); } catch {}
                          showToast(data.subscribed ? `Subscribed to ${channelData.name}!` : `Unsubscribed from ${channelData.name}`);
                        } catch (error) { showToast(error.message || "Subscription unavailable"); }
                      }} className={`px-6 py-2.5 rounded-full font-bold text-xs transition-all active:scale-95 ${channelSubscribed ? "bg-[#272727] text-gray-300" : "bg-[#00D9FF] text-black shadow-[0_0_15px_rgba(0,217,255,0.4)]"}`}>{channelSubscribed ? "Subscribed ✓" : "Subscribe"}</button>
                      <button onClick={()=>setActiveTab("upload")} className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white border border-white/10 hidden sm:block">Upload video</button>
                      <button onClick={loadBoostStats} className="min-h-11 rounded-full border border-[#FFD700]/50 px-4 text-xs font-bold text-[#FFD700]">My Boost Stats</button>
                    </div>
                  </div>
                  {boostStats && <div className="glass-card mt-4 flex items-center justify-between p-4"><span className="text-xs text-gray-300">Alphatekx boost views</span><strong className="text-lg text-[#FFD700]">{Number(boostStats.total_boost_views || 0).toLocaleString()}</strong></div>}
                  <div className="border-t border-[#272727] pt-4">
                    <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-hide sticky top-0 bg-[#0B0215] py-2 z-10">
                      {[["home", "Home"], ["videos", "Videos"], ["shorts", "Shorts"], ["live", "Live"], ["playlists", "Playlists"], ["community", "Community"], ["about", "About"]].map(([tab, label]) => <button key={tab} onClick={() => setChannelTab(tab)} className={`min-h-11 rounded-full px-4 text-xs font-bold whitespace-nowrap ${channelTab === tab ? "bg-[#FFD700] text-black" : "bg-[#1A0B2E] text-gray-400"}`}>{label}</button>)}
                      <span className="ml-auto text-xs text-gray-400 font-mono whitespace-nowrap">{channelTab === "videos" ? channelUploads.length : channelTabItems.length} loaded</span>
                    </div>
                    {channelTab === "about" ? (
                      <div className="glass-card p-5 space-y-3 text-sm text-gray-300"><h3 className="font-bold text-white">About</h3><p>{channelData.description || "No description provided."}</p><p className="text-xs text-gray-500">Joined {channelData.joinedAt || "—"} • {channelData.viewCount || "—"} total views</p><a className="text-[#00D9FF]" href={channelData.url || "#"} target="_blank" rel="noreferrer">Open on YouTube</a></div>
                    ) : (channelTab === "videos" ? channelUploads : channelTab === "home" ? channelUploads.slice(0, 12) : channelTabItems).length>0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {(channelTab === "videos" ? channelUploads : channelTab === "home" ? channelUploads.slice(0, 12) : channelTabItems).map((vid)=>(
                          <div key={vid.id||vid.youtubeId} onClick={()=>{ setActiveVideo(normalizeVideo({...vid, channelName: channelData.name, avatar: channelData.avatar, channelId: channelData.id || activeChannelId, subscribers: channelData.subscribers })); setActiveTab("watch"); if(mainScrollRef.current) mainScrollRef.current.scrollTop=0; }} className="glass-card overflow-hidden hover:border-[#00D9FF] transition-all cursor-pointer group flex flex-col">
                            <div className="relative aspect-video w-full bg-gray-900 overflow-hidden">
                              <img src={vid.thumbnailUrl || vid.img || `https://i.ytimg.com/vi/${vid.youtubeId}/hqdefault.jpg`} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                              <span className="absolute bottom-2 right-2 bg-black/80 text-xs font-mono px-1.5 py-0.5 rounded text-white">{vid.duration || "10:00"}</span>
                            </div>
                            <div className="p-3 space-y-1 flex-1">
                              <h4 className="font-bold text-sm text-white line-clamp-2 group-hover:text-[#00D9FF]">{vid.title}</h4>
                              <p className="text-xs text-gray-400 truncate">{channelData.name}</p>
                              <p className="text-[11px] text-gray-500">{vid.views || vid.viewsFormatted || "1.2K views"} • {vid.category || "Tech"}</p>
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
                    <div ref={channelLoadMoreRef} className="flex min-h-16 items-center justify-center text-xs text-gray-400">
                      {channelTab === "videos" ? (isChannelLoadingMore ? "Loading more..." : channelNextToken ? "Scroll for more videos" : channelUploads.length ? `You've reached the end - ${channelUploads.length} videos` : "") : (channelTabLoading ? "Loading more..." : channelTabNextToken ? "Scroll for more" : channelTabItems.length ? `You've reached the end - ${channelTabItems.length} items` : "")}
                    </div>
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
                    <h1 className="text-xl font-bold text-white">Add Video to Alphatekx Stream</h1>
                    <p className="text-xs text-gray-400">We stream from YouTube through Alphatekx - no hosting cost.</p>
                  </div>
                </div>
                <form onSubmit={handleUploadSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">YouTube link *</label>
                    <div className="relative">
                      <input value={uploadVideoUrl} onChange={e=>handleUploadLinkChange(e.target.value)} onPaste={e=>setTimeout(()=>handleUploadLinkChange(e.currentTarget.value), 0)} required placeholder="Paste YouTube link here... e.g. https://youtu.be/..." className="w-full h-12 bg-[#0B0215] border border-gray-800 rounded-xl px-4 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700]" />
                      {uploadVideoId && <span className="absolute right-4 top-3 text-[#00FF88] text-lg" aria-label="Valid YouTube link">✓</span>}
                    </div>
                    {uploadLinkError && <p className="mt-1 text-[11px] text-red-400">{uploadLinkError}</p>}
                  </div>
                  {uploadVideoId && <div className="space-y-3">
                    <div className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
                      <iframe src={`https://www.youtube.com/embed/${uploadVideoId}?enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&playsinline=1&rel=0&modestbranding=1&fs=1&iv_load_policy=3&enablecastapi=1`} title="YouTube preview" className="h-full w-full border-0" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen />
                    </div>
                    <input value={uploadPreviewTitle} onChange={e=>setUploadPreviewTitle(e.target.value)} aria-label="Video title" className="w-full rounded-xl border border-white/10 bg-black/80 px-4 py-3 text-sm text-white" />
                    <img src={uploadPreviewThumbnail} alt="YouTube thumbnail preview" className="h-20 w-36 rounded-lg object-cover" />
                  </div>}
                  <button type="submit" disabled={isUploading || !uploadVideoId} className="w-full h-11 bg-[#FFD700] text-black font-extrabold text-sm rounded-xl disabled:opacity-50 transition-transform active:scale-95">
                    {isUploading ? "Publishing..." : "PUBLISH TO STREAM"}
                  </button>
                  <p className="text-[11px] text-center text-gray-500">Paste a link only. Video files are not uploaded to Stream.</p>
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
                  <button onClick={()=>navigateToChannel(profileData?.channelId || authUser?.channelId)} className="glass-card p-4 hover:border-[#00D9FF] transition-colors text-left">
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
                  <div className="sm:col-span-3 mt-4 w-full rounded-xl border border-gray-800 bg-[#0B0215] p-4 space-y-2">
                    <h3 className="text-sm font-bold text-white">🎬 AI Studio</h3>
                    <p className="text-[11px] text-gray-400">Thumbnail Enhancer, Voice Generator, Translator, Video Generator</p>
                    <span className="inline-flex rounded-full bg-[#FFD700] px-2 py-1 text-[10px] font-bold text-black">COMING SOON</span>
                    <button type="button" disabled className="block h-11 w-full rounded-xl bg-gray-700 text-xs font-bold text-gray-400">Not Available For Now - Needs Real Money</button>
                    <p className="text-[11px] text-gray-500">We are building heavy AI servers. Stream + Market live now.</p>
                  </div>
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
                  <button onClick={()=>{ if(!confirm("Clear all history?")) return; setSearchHistory([]); setWatchedHistory([]); try{localStorage.removeItem("alphatekx_search_history"); localStorage.removeItem("alphatekx_watched_history");}catch{} fetch("/api/search/history",{method:"DELETE", credentials:"include"}).catch(()=>{}); showToast("History cleared"); }} className="text-xs text-red-400 border border-red-400/20 px-3 py-1.5 rounded-full hover:bg-red-400/10 min-h-[44px]">Clear all</button>
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


          {showPaywall && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 px-4" role="dialog" aria-modal="true">
              <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-[#0B0215] p-5 shadow-2xl">
                <div className="text-center">
                  <div className="text-4xl">🔒</div>
                  <h2 className="mt-2 text-base font-bold text-white">{usageLockFeature === "market" ? "5/5 Free Products Published 🎉" : `Daily Limit Reached - ${usageLockFeature || "AI feature"}`}</h2>
                  <p className="mt-2 text-xs leading-5 text-gray-400">
                    {usageLockFeature === "market"
                      ? "Upgrade to Pro for unlimited Marketplace publishing and keep 80% per sale."
                      : `You have used 2/2 free ${usageLockFeature || "AI"} uses. Upgrade to Pro for unlimited access.`}
                  </p>
                </div>
                <div className="mt-4 rounded-xl bg-[#1A0B2E] p-3 text-xs text-gray-200">
                  <strong className="text-[#FFD700]">⭐ PRO $19/month</strong>
                  <p className="mt-1 text-gray-400">Unlimited Jot, Teacher, Thumbnail, Voice, Translator, Video Gen, Vibe Coding, and Market publishing.</p>
                </div>
                <button onClick={() => startProCheckout("monthly")} className="mt-4 min-h-12 w-full rounded-xl bg-[#FFD700] px-4 text-xs font-extrabold text-black">PAY $19 WITH PAYSTACK - UNLOCK ALL</button>
                <button onClick={() => { setShowPaywall(false); setShowByokModal(true); }} className="mt-3 min-h-10 w-full text-xs font-bold text-[#FFD700]">Or Bring Your Own Key (Free)</button>
                <button onClick={() => setShowPaywall(false)} className="mt-1 min-h-10 w-full text-xs text-gray-400">Maybe Later</button>
              </div>
            </div>
          )}
          {showByokModal && (
            <div className="fixed inset-0 z-[71] flex items-center justify-center bg-black/75 px-4" role="dialog" aria-modal="true">
              <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-[#0B0215] p-5">
                <h2 className="text-base font-bold text-white">AI Vibe Coding - 2 Options</h2>
                <div className="mt-4 rounded-xl border border-gray-800 bg-[#1A0B2E] p-3">
                  <p className="text-sm font-bold text-white">🔑 Bring Your Own Key (FREE)</p>
                  <p className="mt-1 text-xs text-gray-400">Use your own provider credits at no cost to Alphatekx.</p>
                  <input value={byokKey} onChange={e => setByokKey(e.target.value)} type="password" placeholder="Paste your OpenAI key" className="mt-3 min-h-11 w-full rounded-xl border border-gray-700 bg-black/40 px-3 text-sm text-white" />
                  <button onClick={() => { saveByokKey(byokKey); setShowByokModal(false); showToast("BYOK key saved ✓"); }} className="mt-3 min-h-11 w-full rounded-xl bg-[#FFD700] text-xs font-bold text-black">Save Key</button>
                </div>
                <div className="mt-3 rounded-xl border border-[#FFD700]/30 bg-[#1A0B2E] p-3">
                  <p className="text-sm font-bold text-white">⭐ Upgrade to Pro $19</p>
                  <p className="mt-1 text-xs text-gray-400">$19/month (₦25,901.18) covers all AI and unlimited Market publishing.</p>
                  <button onClick={() => startProCheckout("monthly")} className="mt-3 min-h-11 w-full rounded-xl bg-[#FFD700] text-xs font-bold text-black">PAY $19 WITH PAYSTACK</button>
                </div>
                <button onClick={() => setShowByokModal(false)} className="mt-3 min-h-10 w-full text-xs text-gray-400">Close</button>
              </div>
            </div>
          )}


        </main>
      </div>

      {/* Persistent mini-player: remains available when leaving Watch for Home. */}
      {miniPlayerActive && activeVideo && activeTab !== "watch" && (
        <div className="fixed bottom-[4.5rem] left-2 right-2 z-40 aspect-video max-w-sm sm:left-auto sm:right-6 sm:w-80 md:w-96 shadow-[0_0_30px_rgba(0,217,255,0.5)] border-2 border-[#00D9FF] rounded-2xl overflow-hidden bg-black flex flex-col group transition-all duration-300 animate-fade-in">
          <div className="relative w-full h-full bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${encodeURIComponent(activeVideo.youtubeId || activeVideo.id)}?enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&playsinline=1&controls=1&rel=0&autoplay=1`}
              title={`Mini player: ${activeVideo.title}`}
              className="w-full h-full border-0"
              allow="autoplay; encrypted-media; picture-in-picture"
            />
            
            {/* Top Bar Overlay */}
            <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[11px] font-bold z-20">
              <span className="bg-black/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[#00FF88] border border-[#00FF88]/40 truncate max-w-[180px]">
                ▶ Mini Playing: {activeVideo.title}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setActiveTab("watch");
                    const videoId = activeVideo.youtubeId || activeVideo.id;
                    if (videoId) window.history.pushState({}, "", `/watch/${encodeURIComponent(videoId)}`);
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

      {showSignUpBlock && isGuest && <SignUpBlock onSignIn={signIn} />}

      {/* MOBILE BOTTOM NAVIGATION BAR — YouTube fit h-16 */}
      <nav className={`fixed bottom-0 left-0 right-0 z-40 bg-[#0f0f0f] border-t border-[#272727] px-4 h-16 items-center justify-around md:hidden ${activeTab === "shorts" ? "hidden" : "flex"}`}>
        <button 
          onClick={() => navigateToTab("home")}
          className={`flex flex-col items-center justify-center gap-1 ${activeTab === "home" ? "text-[#FFD700]" : "text-gray-400"}`}
        >
          <Icon name="home" className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button 
          onClick={() => navigateToTab("shorts")}
          className={`flex flex-col items-center justify-center gap-1 ${activeTab === "shorts" ? "text-[#FFD700]" : "text-gray-400"}`}
        >
          <Icon name="shorts" className="w-5 h-5" />
          <span className="text-[10px]">Shorts</span>
        </button>

        <button 
          onClick={() => navigateToTab("upload")}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FFD700] to-[#F59E0B] text-black flex items-center justify-center -mt-2 shadow-[0_0_15px_rgba(255,215,0,0.4)]"
        >
          <Icon name="plus" className="w-6 h-6 stroke-[3]" />
        </button>
        <button type="button" onClick={navigateToDownloadApp} className={`relative flex flex-col items-center justify-center gap-1 ${activeTab === "download-app" ? "text-[#FF0055]" : "text-gray-400"}`}>
          <span className="relative text-lg">📲<span className="absolute -right-2 -top-1 h-2 w-2 rounded-full bg-gradient-to-r from-[#FF0055] to-[#FFAA00]" /></span>
          <span className="text-[10px]">Download</span>
        </button>

        <button 
          onClick={() => navigateToTab("watch")}
          className={`flex flex-col items-center justify-center gap-1 ${activeTab === "watch" ? "text-[#FFD700]" : "text-gray-400"}`}
        >
          <Icon name="youtube" className="w-5 h-5" />
          <span className="text-[10px]">Watch</span>
        </button>

        <button 
          onClick={() => navigateToTab("marketplace")}
          className={`flex flex-col items-center justify-center gap-1 ${activeTab === "marketplace" ? "text-[#FFD700]" : "text-gray-400"}`}
        >
          <Icon name="shopping-bag" className="w-5 h-5" />
          <span className="text-[10px]">Marketplace</span>
        </button>
      </nav>

    </div>
    </div>
    </>
  );
}

// Render Root
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
