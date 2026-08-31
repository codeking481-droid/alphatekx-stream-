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

// --- Helper to normalize video objects from API or mock ---
function normalizeVideo(v) {
  return {
    id: v.youtubeId || v.id || "dQw4w9WgXcQ",
    youtubeId: v.youtubeId || v.id || "dQw4w9WgXcQ",
    title: v.title || "Untitled Video",
    channel: v.channelName || v.channel || "YouTube Creator",
    channelName: v.channelName || v.channel || "YouTube Creator",
    subscribers: v.subscribers || "1.2M",
    views: v.views || "100K views",
    timeAgo: v.timeAgo || "Recently uploaded",
    duration: v.duration || "15:00",
    tag: v.tag || "YouTube Search",
    avatar: v.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    img: v.thumbnailUrl || v.img || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    thumbnailUrl: v.thumbnailUrl || v.img || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    description: v.description || `Watch ${v.title} on Alphatekx Stream.`
  };
}

// --- Main App Component ---
function App() {
  // Navigation & Drawer State
  const [activeTab, setActiveTab] = useState("watch"); // watch, home, shorts, teacher, memory, chat, community, marketplace, sell, studio, pricing, profile
  const [sidebarOpen, setSidebarOpen] = useState(true); // Desktop sidebar toggle
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false); // Mobile drawer slide-over toggle
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

  // === NEW: Channel / Upload / Profile / Categories (preserve design) ===
  const [activeChannelId, setActiveChannelId] = useState("codecraft");
  const [channelData, setChannelData] = useState(null);
  const [channelUploads, setChannelUploads] = useState([]);
  const [isChannelLoading, setIsChannelLoading] = useState(false);
  const [channelSubscribed, setChannelSubscribed] = useState(false);
  const [categories, setCategories] = useState(["All","Neural Networks","PyTorch","AI Superpowers","Cloudflare Workers","Naija Dialects"]);
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
  }, []);
  // Fetch channel when activeChannelId changes or when entering channel tab
  useEffect(() => {
    if (activeTab !== "channel") return;
    setIsChannelLoading(true);
    fetch(`/api/channel/${encodeURIComponent(activeChannelId)}`).then(r=>r.ok?r.json():null).then(d=>{
      if(d && d.channel){ setChannelData(d.channel); setChannelUploads(Array.isArray(d.uploads)?d.uploads:[]); }
      setIsChannelLoading(false);
    }).catch(()=> setIsChannelLoading(false));
  }, [activeTab, activeChannelId]);
  const navigateToChannel = (channelId) => {
    const cid = slugify(channelId) || "codecraft";
    setActiveChannelId(cid);
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

  // YouTube UX Features (Theater mode, Mini-player, Voice modal, Share modal)
  const [theaterMode, setTheaterMode] = useState(false);
  const [miniPlayerActive, setMiniPlayerActive] = useState(false);
  const [isMiniPlaying, setIsMiniPlaying] = useState(true);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [voiceListening, setVoiceListening] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [superChatModalOpen, setSuperChatModalOpen] = useState(false);
  const [superChatAmount, setSuperChatAmount] = useState(5);
  const [superChatMessage, setSuperChatMessage] = useState("");
  const [autoplayNext, setAutoplayNext] = useState(true);

  // Master Video Catalog
  const [videoCatalog] = useState([
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
      img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80", 
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
      img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80", 
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
      img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80", 
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
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80", 
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
      img: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?auto=format&fit=crop&w=600&q=80", 
      description: "Demonstrating Pidgin, Yoruba, Igbo and Hausa translation models for video subtitle localization." 
    }
  ]);

  // Active Video State
  const [activeVideo, setActiveVideo] = useState(videoCatalog[0]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [likeCount, setLikeCount] = useState(24500);
  const [userLiked, setUserLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showDescriptionMore, setShowDescriptionMore] = useState(false);

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

  // Video Chapters Interactive Timeline
  const videoChapters = [
    { title: "Intro & Math Primitives", timestamp: "0:00", seconds: 0 },
    { title: "Neurons & Activation", timestamp: "2:15", seconds: 135 },
    { title: "Backpropagation Calculus", timestamp: "8:15", seconds: 495 },
    { title: "Loss Function & Loop", timestamp: "12:30", seconds: 750 },
    { title: "PyTorch GPU Acceleration", timestamp: "18:45", seconds: 1125 }
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

  // Superpower 4: Live Community Chat & Super Chats
  const [activeChannel, setActiveChannel] = useState("general");
  const [communityMessages, setCommunityMessages] = useState([
    { id: 1, userName: "dev_nina", avatarInitials: "N", avatarColor: "bg-orange-500", timeAgo: "2m ago", message: "This explanation at 8:15 finally made backprop click — thank you! 🔥", timestampInVideo: "8:15", likes: 14 },
    { id: 2, userName: "ml_learner", avatarInitials: "M", avatarColor: "bg-teal-500", timeAgo: "1m ago", message: "Would love a follow-up on CNNs next. Super clear presentation!", timestampInVideo: "12:30", likes: 9 },
    { id: 3, userName: "tech_guru", avatarInitials: "T", avatarColor: "bg-purple-500", timeAgo: "Just now", message: "Are you guys running PyTorch 2.0 compile mode or raw CUDA kernels here?", timestampInVideo: "2:15", likes: 5, isSuperChat: true, superAmount: "$10" }
  ]);
  const [chatMessageInput, setChatMessageInput] = useState("");
  const [liveViewerCount, setLiveViewerCount] = useState(1248);

  // Superpower 5: Marketplace Cards Inside Watch Page
  const [marketplaceProducts] = useState([
    { id: 1, name: "AI Neural Net Model Pack", description: "Pre-trained PyTorch weights & vision dataset with puzzle CUDA acceleration.", price: 9.99, badge: "BESTSELLER", iconType: "cpu", category: "app", salesCount: 342 },
    { id: 2, name: "Stream Course Masterclass Bundle", description: "Complete 6-hr video course with certificate & full source code repo.", price: 24.99, badge: "HOT", iconType: "video", category: "course", salesCount: 189 },
    { id: 3, name: "Naija Speech Translation Engine", description: "Pidgin, Yoruba & Igbo TTS audio translation API plugin.", price: 14.99, badge: "NEW", iconType: "sparkles", category: "plugin", salesCount: 95 }
  ]);

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

  // Superpower 9: AI Studio
  const [studioTool, setStudioTool] = useState("clip");
  const [clipPrompt, setClipPrompt] = useState("find viral moment when loss reaches 0.01");
  const [generatedClip, setGeneratedClip] = useState(null);
  const [thumbnailUrl] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80");
  const [isEnhancingThumbnail, setIsEnhancingThumbnail] = useState(false);

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

  // Monitor Scrolling to Auto-Dock Mini Player
  useEffect(() => {
    const scrollContainer = mainScrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
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

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [activeTab]);

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

  // Handle Language Translation Switch (Naija Translator)
  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setAiLanguage(lang);
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
    }
  };

  // Handle Live Community Message Post
  const handleSendCommunityMessage = (msgText, timestamp = "") => {
    if (!msgText.trim()) return;
    const newMsg = {
      id: Date.now(),
      userName: "You (Pro Member)",
      avatarInitials: "Y",
      avatarColor: "bg-[#00D9FF]",
      timeAgo: "Just now",
      message: msgText,
      timestampInVideo: timestamp || "Current",
      likes: 1
    };
    setCommunityMessages(prev => [...prev, newMsg]);
    setChatMessageInput("");
    setSummaryInputChat("");
    showToast("Message posted to Live Community Chat!");
  };

  // Handle Send Super Chat
  const handleSendSuperChat = () => {
    if (!superChatMessage.trim()) return;
    const newMsg = {
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
    setCommunityMessages(prev => [...prev, newMsg]);
    setSuperChatModalOpen(false);
    setSuperChatMessage("");
    showToast(`Super Chat of $${superChatAmount} sent! Thank you for supporting! 💛`);
  };

  // Add Item to Unified Queue
  const handleAddQueueItem = () => {
    if (!newQueueUrl.trim()) return;
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
    showToast("Added item to Unified Queue!");
  };

  // Build AI Teacher Course
  const handleBuildCourse = () => {
    setIsBuildingCourse(true);
    setTimeout(() => {
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
      setIsBuildingCourse(false);
      showToast("5-Step AI Learning Path Generated!");
    }, 1000);
  };

  // Memory Search
  const handleMemorySearch = (e) => {
    e.preventDefault();
    if (!memoryQuery.trim()) return;
    setMemoryResults([
      { title: "How to Build Neural Networks from Scratch", watchedAgo: "Watched 3 weeks ago", snippet: "Training loop loss calculation at 12:30", videoId: "dQw4w9WgXcQ", timestamp: "12:30" },
      { title: "Building Real-time AI Voice Agents", watchedAgo: "Watched 12 days ago", snippet: "Low-latency WebSocket buffer setup at 04:12", videoId: "L_LUpnjgPso", timestamp: "04:12" }
    ]);
  };

  // Filtered Video Catalog
  const filteredVideos = videoCatalog.filter(video => {
    const matchesSearch = !searchQuery || video.title.toLowerCase().includes(searchQuery.toLowerCase()) || video.channel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChip = activeChip === "All" || video.tag === activeChip || (activeChip === "PyTorch" && video.title.includes("Neural")) || (activeChip === "Live Chat" && video.tag === "Cloudflare Workers");
    return matchesSearch && matchesChip;
  });

  return (
    <div className="h-screen w-full max-w-[100vw] overflow-hidden flex flex-col bg-[#000000] text-white font-sans selection:bg-[#00D9FF] selection:text-black">
      
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
                { id: "shorts", label: "Shorts", icon: "shorts" },
                { id: "channel", label: "Channel", icon: "user" },
                { id: "upload", label: "Upload", icon: "plus" },
                { id: "community", label: "Subscriptions", icon: "subscriptions" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { if(item.id==="channel") navigateToChannel(activeChannelId); else setActiveTab(item.id); setMobileDrawerOpen(false); }}
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
                  onClick={() => { if(item.id==="channel") navigateToChannel(activeChannelId); else setActiveTab(item.id); setMobileDrawerOpen(false); }}
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

      {/* ------------------- FIXED YOUTUBE HEADER — Mobile Optimized ------------------- */}
      <header className="h-14 flex-shrink-0 bg-[#0f0f0f] border-b border-[#272727] px-2 sm:px-4 flex items-center justify-between gap-2 sm:gap-4 z-40 relative">
        
        {/* Left Logo & Hamburger */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <button 
            onClick={handleHamburgerClick}
            className="p-2 rounded-full hover:bg-[#272727] text-gray-200 transition-transform active:scale-90"
            title="Toggle Menu"
          >
            <Icon name="menu" className="w-6 h-6" />
          </button>

          <div 
            onClick={() => setActiveTab("watch")} 
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group min-w-0"
          >
            <Icon name="logo" className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:scale-105 flex-shrink-0" />
            <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
              <span className="font-extrabold text-[15px] sm:text-lg tracking-tighter text-white whitespace-nowrap">Alphatekx</span>
              <span className="hidden sm:inline font-light text-lg tracking-tighter text-gray-400">Stream</span>
              <span className="hidden sm:inline-flex text-[9px] font-bold font-mono bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/40 px-1.5 py-0.2 rounded ml-1">
                AI NG
              </span>
            </div>
          </div>
        </div>

        {/* Center Search Bar & Voice Search — min-w-0 prevents overflow on mobile */}
        <div className="flex-1 min-w-0 max-w-2xl mx-1 sm:mx-auto flex items-center gap-1.5 sm:gap-3 relative">
          <form 
            onSubmit={(e) => { e.preventDefault(); setActiveTab("home"); setSearchSuggestionsOpen(false); }}
            className="flex-1 min-w-0 flex items-center bg-[#121212] border border-[#303030] rounded-full focus-within:border-[#00D9FF] focus-within:ring-1 focus-within:ring-[#00D9FF] overflow-hidden"
          >
            <input
              id="youtube-search-input"
              type="text"
              value={searchQuery}
              onFocus={() => setSearchSuggestionsOpen(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              title="Search in Alphatekx Stream (Press '/' to focus)"
              className="w-full min-w-0 bg-transparent px-3 sm:px-4 py-1.5 sm:py-2 text-sm text-white placeholder-gray-500 focus:outline-none"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery("")} 
                className="text-gray-400 hover:text-white px-1.5 sm:px-2 text-xs flex-shrink-0"
              >
                ✕
              </button>
            )}
            <button 
              type="submit" 
              className="px-3 sm:px-6 py-1.5 sm:py-2.5 bg-[#222222] hover:bg-[#303030] border-l border-[#303030] text-gray-300 flex-shrink-0"
              title="Search"
            >
              <Icon name="search" className="w-4 h-4" />
            </button>
          </form>

          {/* Voice Mic Button — hidden on mobile to save space, visible sm+ */}
          <button 
            onClick={() => { setVoiceModalOpen(true); setVoiceListening(true); }}
            className="hidden sm:flex p-2 sm:p-2.5 rounded-full bg-[#222222] hover:bg-[#303030] text-gray-200 hover:text-[#00D9FF] transition-colors flex-shrink-0"
            title="Search with voice"
          >
            <Icon name="mic" className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Search Suggestions Dropdown — full width on mobile */}
          {searchSuggestionsOpen && (
            <div className="absolute top-12 left-0 right-0 sm:right-12 bg-[#121212] border border-[#303030] rounded-2xl shadow-2xl overflow-hidden z-50 text-xs">
              <div className="p-2 text-[10px] font-mono font-bold text-gray-500 uppercase px-3">Trending Searches</div>
              {[
                "Neural Networks PyTorch scratch tutorial",
                "Cloudflare Workers SQLite Durable Objects",
                "Naija Pidgin AI Voice Translation",
                "TikTok Stream Unified Queue"
              ].map((sug, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    setSearchQuery(sug);
                    setSearchSuggestionsOpen(false);
                    setActiveTab("home");
                  }}
                  className="px-4 py-2.5 hover:bg-[#272727] text-gray-200 cursor-pointer flex items-center gap-3"
                >
                  <Icon name="search" className="w-3.5 h-3.5 text-gray-400" />
                  <span>{sug}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Actions — compact on mobile */}
        <div className="flex items-center gap-0.5 sm:gap-2 flex-shrink-0">
          <button 
            onClick={() => setActiveTab("upload")} 
            className="p-2 rounded-full hover:bg-[#272727] text-gray-200 hidden sm:flex items-center gap-1 text-xs font-semibold px-3"
            title="Upload video"
          >
            <Icon name="plus" className="w-5 h-5 text-[#00D9FF]" />
            <span className="hidden lg:inline">Create</span>
          </button>

          <button 
            onClick={() => showToast("Searching for Cast devices on local Wi-Fi...")} 
            className="p-2 rounded-full hover:bg-[#272727] text-gray-200 hidden sm:block"
            title="Cast to Device"
          >
            <Icon name="cast" className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setActiveTab("community")} 
            className="p-1.5 sm:p-2 rounded-full hover:bg-[#272727] text-gray-200 relative"
            title="Live Community Chat"
          >
            <Icon name="bell" className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00FF88] rounded-full animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00FF88] rounded-full" />
          </button>

          <button 
            onClick={() => setActiveTab("marketplace")} 
            className="p-1.5 sm:p-2 rounded-full hover:bg-[#272727] text-gray-200 relative"
            title="Cart"
          >
            <Icon name="shopping-bag" className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#00D9FF] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("pricing")}
            className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#00D9FF]/20 to-[#00FF88]/20 border border-[#00D9FF]/50 text-xs font-semibold text-[#00D9FF] hover:border-[#00FF88]"
          >
            <Icon name="crown" className="w-3.5 h-3.5 text-[#00FF88]" />
            <span>{isProUser ? "PRO ACTIVE" : "UPGRADE PRO"}</span>
          </button>

          <button 
            onClick={() => setActiveTab("profile")}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#00D9FF] to-[#00FF88] p-0.5 ml-0.5 sm:ml-1 flex-shrink-0"
          >
            <img 
              src={profileData?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"} 
              alt="Profile Avatar" 
              className="w-full h-full rounded-full object-cover" 
            />
          </button>
        </div>
      </header>

      {/* ------------------- APP BODY (FIXED SIDEBAR + INDEPENDENT MAIN SCROLL) ------------------- */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* ------------------- FIXED YOUTUBE SIDEBAR ------------------- */}
        <aside 
          className={`bg-[#0f0f0f] border-r border-[#272727] transition-all duration-300 flex-col justify-between hidden md:flex flex-shrink-0 z-30 ${
            sidebarOpen ? "w-64" : "w-18 items-center"
          }`}
        >
          <div className="py-2 overflow-y-auto space-y-4 w-full h-full">
            
            {/* Primary Section */}
            <div className="px-2 space-y-1">
              {[
                { id: "home", label: "Home", icon: "home" },
                { id: "watch", label: "Now Playing", icon: "youtube" },
                { id: "shorts", label: "Shorts", icon: "shorts" },
                { id: "channel", label: "Channel", icon: "user" },
                { id: "upload", label: "Upload", icon: "plus" },
                { id: "community", label: "Subscriptions", icon: "subscriptions" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if(item.id==="channel") navigateToChannel(activeChannelId);
                    else setActiveTab(item.id);
                  }}
                  title={!sidebarOpen ? item.label : undefined}
                  className={`w-full flex items-center ${sidebarOpen ? "gap-5 px-3" : "justify-center px-2"} py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === item.id 
                      ? "bg-[#272727] text-[#00D9FF] font-bold" 
                      : "text-gray-300 hover:bg-[#272727] hover:text-white"
                  }`}
                >
                  <Icon name={item.icon} className={`w-5 h-5 ${activeTab === item.id ? "text-[#00D9FF]" : "text-gray-400"}`} />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              ))}
            </div>

            <div className="border-t border-[#272727] my-2" />

            {/* AI Superpowers Section */}
            <div className="px-2 space-y-1">
              {sidebarOpen && (
                <div className="px-3 py-1 text-xs font-mono font-bold text-[#00FF88] uppercase tracking-wider flex items-center gap-1">
                  <Icon name="sparkles" className="w-3.5 h-3.5" />
                  <span>AI Superpowers</span>
                </div>
              )}
              {[
                { id: "teacher", label: "AI Teacher", icon: "teacher", color: "text-[#00FF88]" },
                { id: "memory", label: "AI Memory", icon: "brain", color: "text-[#00D9FF]" },
                { id: "marketplace", label: "Marketplace", icon: "shopping-bag", color: "text-[#00FF88]" },
                { id: "studio", label: "AI Studio", icon: "studio", color: "text-purple-400" },
                { id: "profile", label: "Profile", icon: "user", color: "text-[#00D9FF]" },
                { id: "pricing", label: "Pro Subscription", icon: "crown", color: "text-yellow-400" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { if(item.id==="channel") navigateToChannel(activeChannelId); else setActiveTab(item.id); }}
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

            {/* Subscribed Channels */}
            {sidebarOpen && (
              <div className="px-4 py-2 space-y-3">
                <span className="text-xs font-bold text-gray-400 uppercase">Subscribed Channels</span>
                <div className="space-y-2">
                  {[
                    { name: "CodeCraft Academy", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" },
                    { name: "Edge AI Lab", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" },
                    { name: "Serverless Pro", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" }
                  ].map((ch, idx) => (
                    <button key={idx} onClick={()=>navigateToChannel(ch.name)} className="w-full flex items-center gap-3 text-xs text-gray-300 hover:text-white cursor-pointer py-1 text-left">
                      <img src={ch.avatar} alt={ch.name} className="w-6 h-6 rounded-full object-cover" />
                      <span className="truncate">{ch.name}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] ml-auto" />
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </aside>

        {/* ------------------- INDEPENDENT MAIN SCROLL CONTENT AREA ------------------- */}
        <main ref={mainScrollRef} className="flex-1 overflow-y-auto scroll-smooth pb-24 md:pb-12 h-full">

          {/* TOP TOPIC CHIPS BAR (Sticky Filter Bar inside Main Scroll) — scrolls cleanly on mobile — categories from /api/categories */}
          <div className="bg-[#0f0f0f]/95 backdrop-blur-md border-b border-[#272727] px-2 sm:px-4 py-2 sm:py-2.5 flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide sticky top-0 z-30 overscroll-x-contain">
            {categories.map((chip) => (
              <button
                key={chip}
                onClick={() => setActiveChip(chip)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeChip === chip 
                    ? "bg-[#00D9FF] text-black font-bold shadow-[0_0_12px_rgba(0,217,255,0.4)]" 
                    : "bg-[#272727] hover:bg-[#383838] text-gray-200"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* ------------------- 1. WATCH PAGE — mobile p-3 prevents horizontal overflow ------------------- */}
          {activeTab === "watch" && (
            <div className="max-w-[1700px] mx-auto p-3 sm:p-4 md:p-6 lg:p-8 space-y-6 sm:space-y-8 overflow-x-hidden">
              
              {/* Desktop Grid Layout (70% Left Video + Takeaways + Chat, 30% Right Queue + Up Next) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                
                {/* LEFT COLUMN (Player + Actions + AI Summary + Chat + Marketplace) */}
                <div className={theaterMode ? "lg:col-span-12 space-y-6" : "lg:col-span-8 space-y-6"}>
                  
                  {/* YOUTUBE PLAYER CONTAINER */}
                  <div ref={mainPlayerRef} className="relative group rounded-2xl overflow-hidden bg-black border border-[#272727] shadow-2xl">
                    
                    {/* Ambient Glow */}
                    {cinemaMode && (
                      <div 
                        className="absolute -inset-4 bg-cover bg-center blur-[50px] opacity-40 scale-125 transition-all duration-700 pointer-events-none"
                        style={{ backgroundImage: `url(${activeVideo.img})` }}
                      />
                    )}

                    {/* Top Overlay Controls — wraps cleanly on mobile, hides long text on xs */}
                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 z-20 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono pointer-events-none">
                      <div className="bg-black/80 backdrop-blur-md px-2 sm:px-3 py-1 rounded-full border border-white/10 text-gray-300 flex items-center gap-1.5 sm:gap-2 max-w-[60%] sm:max-w-none truncate">
                        <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#00FF88] animate-pulse flex-shrink-0" />
                        <span className="hidden sm:inline">Enhanced Cinema Mode ON • 1080p60 • AI View ON</span>
                        <span className="sm:hidden">Cinema ON</span>
                      </div>

                      <div className="flex items-center gap-1 sm:gap-2 pointer-events-auto">
                        <button
                          onClick={() => setTheaterMode(!theaterMode)}
                          className="bg-black/90 hover:bg-black backdrop-blur-md px-2 sm:px-3 py-1 rounded-full border border-white/20 text-gray-200 hover:text-white transition-colors flex items-center gap-1 text-[10px] sm:text-xs"
                        >
                          <Icon name="theater" className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00D9FF]" />
                          <span className="hidden sm:inline">{theaterMode ? "Normal View" : "Theater View"}</span>
                          <span className="sm:hidden">{theaterMode ? "Normal" : "Theater"}</span>
                        </button>

                        <button
                          onClick={() => {
                            setCinemaMode(!cinemaMode);
                            showToast(cinemaMode ? "Ambient Cinema Glow OFF" : "Ambient Cinema Glow ON");
                          }}
                          className="bg-black/90 hover:bg-black backdrop-blur-md px-2 sm:px-3 py-1 rounded-full border border-[#00D9FF]/50 text-[#00D9FF] hover:border-[#00FF88] transition-colors text-[10px] sm:text-xs"
                        >
                          Glow: {cinemaMode ? "ON ✨" : "OFF"}
                        </button>
                      </div>
                    </div>

                    {/* 16:9 Official YouTube Iframe Embed */}
                    <div className="relative aspect-video w-full bg-black z-10">
                      <iframe
                        ref={iframeRef}
                        src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?enablejsapi=1&modestbranding=1&rel=0`}
                        title={activeVideo.title}
                        className="w-full h-full border-0 rounded-2xl"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>

                    {/* Interactive YouTube Video Chapters Bar */}
                    <div className="bg-black/90 border-t border-white/10 p-2 z-20 relative flex items-center gap-2 overflow-x-auto text-[11px] font-mono">
                      <span className="text-[#00FF88] font-bold px-2">Chapters:</span>
                      {videoChapters.map((chap, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSeek(chap.seconds, chap.timestamp)}
                          className={`px-2.5 py-1 rounded-md border transition-colors whitespace-nowrap ${
                            activeTimestamp === chap.timestamp 
                              ? "bg-[#00D9FF] text-black font-bold border-[#00D9FF]" 
                              : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/15"
                          }`}
                        >
                          {chap.timestamp} {chap.title}
                        </button>
                      ))}
                    </div>

                  </div>

                  {/* VIDEO TITLE + CHANNEL ROW + ACTION PILLS */}
                  <div className="space-y-4">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white leading-snug break-words">
                      {activeVideo.title}
                    </h1>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-[#272727] pb-4">
                      
                      {/* Channel Row — wraps on mobile — uses ChannelAvatar / ChannelName / SubscriberCount */}
                      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-wrap">
                        <button onClick={()=>navigateToChannel(activeVideo.channel)} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                          <ChannelAvatar src={activeVideo.avatar} alt={activeVideo.channel} size={40} verified={true} />
                          <div className="text-left">
                            <ChannelName name={activeVideo.channel} verified={true} className="text-base" />
                            <SubscriberCount count={activeVideo.subscribers} />
                          </div>
                        </button>

                        {/* Subscribe Button */}
                        <button
                          onClick={() => {
                            setIsSubscribed(!isSubscribed);
                            showToast(isSubscribed ? "Unsubscribed from channel" : `Subscribed to ${activeVideo.channel}! 🎉`);
                          }}
                          className={`ml-2 px-5 py-2 rounded-full font-bold text-xs transition-all active:scale-95 ${
                            isSubscribed 
                              ? "bg-[#272727] text-gray-300 hover:bg-[#383838]" 
                              : "bg-[#00D9FF] hover:bg-[#00c4e6] text-black font-extrabold shadow-[0_0_15px_rgba(0,217,255,0.4)]"
                          }`}
                        >
                          {isSubscribed ? "Subscribed ✓" : "Subscribe"}
                        </button>
                      </div>

                      {/* Action Row Horizontal Pills — scrolls on mobile without breaking layout */}
                      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1 flex-nowrap overscroll-x-contain">
                        
                        {/* Joined Like & Dislike Pill */}
                        <div className="flex items-center bg-[#272727] rounded-full border border-white/5">
                          <button 
                            onClick={() => {
                              if (!userLiked) {
                                setLikeCount(prev => prev + 1);
                                setUserLiked(true);
                                showToast("Added to Liked Videos!");
                              } else {
                                setLikeCount(prev => prev - 1);
                                setUserLiked(false);
                              }
                            }}
                            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-l-full border-r border-white/10 hover:bg-[#383838] ${userLiked ? "text-[#00D9FF]" : "text-gray-200"}`}
                          >
                            <Icon name="like" className="w-4 h-4" />
                            <span>{(likeCount / 1000).toFixed(1)}K</span>
                          </button>
                          <button 
                            onClick={() => showToast("Feedback recorded")} 
                            className="px-3 py-2 text-xs font-semibold rounded-r-full hover:bg-[#383838] text-gray-400 hover:text-white"
                          >
                            <Icon name="dislike" className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Share Button */}
                        <button 
                          onClick={() => setShareModalOpen(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#272727] hover:bg-[#383838] text-xs font-semibold text-gray-200 rounded-full border border-white/5"
                        >
                          <Icon name="share" className="w-4 h-4" />
                          <span>Share</span>
                        </button>

                        {/* Download Button */}
                        <button 
                          onClick={() => showToast("Downloading transcript & video package...")} 
                          className="flex items-center gap-2 px-4 py-2 bg-[#272727] hover:bg-[#383838] text-xs font-semibold text-gray-200 rounded-full border border-white/5"
                        >
                          <Icon name="download" className="w-4 h-4" />
                          <span>Download</span>
                        </button>

                        {/* Save Button */}
                        <button 
                          onClick={() => {
                            setIsSaved(!isSaved);
                            showToast(isSaved ? "Removed from Library" : "Saved to AI Library!");
                          }} 
                          className={`flex items-center gap-2 px-4 py-2 bg-[#272727] hover:bg-[#383838] text-xs font-semibold rounded-full border border-white/5 ${isSaved ? "text-[#00FF88]" : "text-gray-200"}`}
                        >
                          <Icon name="bookmark" className="w-4 h-4" />
                          <span>{isSaved ? "Saved" : "Save"}</span>
                        </button>

                      </div>

                    </div>
                  </div>

                  {/* YOUTUBE EXPANDABLE DESCRIPTION BOX */}
                  <div className="bg-[#272727]/50 rounded-2xl p-4 text-xs space-y-2 hover:bg-[#272727]/70 transition-colors">
                    <div className="flex items-center gap-2 font-bold text-white">
                      <span>{activeVideo.views}</span>
                      <span>•</span>
                      <span>{activeVideo.timeAgo}</span>
                      <span>•</span>
                      <span className="text-[#00D9FF]">#{activeVideo.tag.replace(/\s+/g, '')} #AI</span>
                    </div>
                    <p className={`text-gray-300 leading-relaxed ${!showDescriptionMore ? "line-clamp-2" : ""}`}>
                      {activeVideo.description}
                    </p>
                    <button 
                      onClick={() => setShowDescriptionMore(!showDescriptionMore)}
                      className="font-bold text-gray-400 hover:text-white pt-1"
                    >
                      {showDescriptionMore ? "Show less" : "...more"}
                    </button>
                  </div>

                  {/* SUPERPOWER #2 & #3: AI SUMMARY CARD & NAIJA TRANSLATOR */}
                  <div className="glass-card neon-border-blue p-6 space-y-5 relative overflow-hidden animate-glow-pulse">
                    
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00D9FF] via-[#00FF88] to-[#00D9FF]" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Icon name="sparkles" className="w-5 h-5 text-[#00FF88]" />
                        <h2 className="text-lg font-bold text-white tracking-wide">AI Key Takeaways & Summary</h2>
                        <span className="text-[10px] font-mono bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/40 px-2.5 py-0.5 rounded-full font-semibold">
                          Alphatekx AI • Beta
                        </span>
                      </div>

                      {/* Naija Translator Dropdown */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-mono">Naija Translator:</span>
                        <select 
                          value={aiLanguage}
                          onChange={handleLanguageChange}
                          className="bg-black/80 border border-[#00D9FF]/50 text-xs text-[#00D9FF] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#00FF88] font-mono font-semibold cursor-pointer"
                        >
                          <option value="English">English</option>
                          <option value="Pidgin">Pidgin (Naija) 🇳🇬</option>
                          <option value="Yoruba">Yoruba 🇳🇬</option>
                          <option value="Igbo">Igbo 🇳🇬</option>
                          <option value="Hausa">Hausa 🇳🇬</option>
                        </select>
                      </div>
                    </div>

                    {/* 3 Clickable Bullets with Timestamps */}
                    <div className="space-y-3 font-sans">
                      {aiBullets.map((bullet, idx) => (
                        <div 
                          key={idx} 
                          className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                            activeTimestamp === bullet.timestamp 
                              ? "bg-[#00D9FF]/15 border-[#00D9FF] text-white" 
                              : "bg-black/40 border-white/5 hover:border-white/20 text-gray-200"
                          }`}
                          onClick={() => handleSeek(bullet.seconds, bullet.timestamp)}
                        >
                          <span className="mt-0.5 w-2 h-2 rounded-full bg-[#00FF88] flex-shrink-0" />
                          <div className="flex-1 text-sm leading-relaxed">
                            <span>{bullet.text} </span>
                            <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[#00D9FF] bg-[#00D9FF]/10 px-2 py-0.5 rounded-md hover:underline ml-1">
                              @ {bullet.timestamp}
                            </span>
                            {bullet.link && (
                              <a 
                                href={bullet.link} 
                                target="_blank" 
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()} 
                                className="ml-2 inline-flex items-center gap-1 text-xs font-mono text-[#00FF88] bg-[#00FF88]/10 px-2.5 py-0.5 rounded-full hover:bg-[#00FF88]/20 border border-[#00FF88]/30"
                              >
                                <span>GitHub Code</span>
                                <Icon name="external" className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick Post to Community Chat */}
                    <form 
                      onSubmit={(e) => { e.preventDefault(); handleSendCommunityMessage(summaryInputChat, "AI Summary Note"); }}
                      className="flex items-center gap-2 pt-2 border-t border-white/10"
                    >
                      <input
                        type="text"
                        value={summaryInputChat}
                        onChange={(e) => setSummaryInputChat(e.target.value)}
                        placeholder="Ask AI or join the live community chat..."
                        className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00D9FF]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#00D9FF] text-black text-xs font-bold rounded-xl hover:bg-[#00FF88] transition-colors"
                      >
                        Post Chat
                      </button>
                    </form>
                  </div>

                  {/* SUPERPOWER #4: COMMUNITY LIVE CHAT & SUPER CHATS */}
                  <div className="glass-card p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 text-purple-400 rounded-xl">
                          <Icon name="chat" className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-white">Community Chat</h2>
                            <span className="text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                              • {liveViewerCount} live
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">Live discussion tied to timestamped video moments</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSuperChatModalOpen(true)}
                          className="px-3 py-1.5 bg-yellow-400 text-black font-extrabold text-xs rounded-xl hover:bg-yellow-300 flex items-center gap-1 shadow-lg"
                        >
                          <Icon name="crown" className="w-3.5 h-3.5" />
                          <span>Super Chat</span>
                        </button>

                        {/* Room Selector Pills */}
                        <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10 text-xs hidden sm:flex">
                          {["general", "builders", "marketplace", "help"].map((ch) => (
                            <button
                              key={ch}
                              onClick={() => setActiveChannel(ch)}
                              className={`px-3 py-1 rounded-lg font-mono transition-colors ${activeChannel === ch ? "bg-[#00D9FF] text-black font-bold" : "text-gray-400 hover:text-white"}`}
                            >
                              #{ch}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                      {communityMessages.map((msg) => (
                        <div 
                          key={msg.id} 
                          className={`flex items-start gap-3 p-3 rounded-xl border ${
                            msg.isSuperChat 
                              ? "bg-gradient-to-r from-yellow-950/40 to-yellow-900/20 border-yellow-400/60 shadow-[0_0_15px_rgba(250,204,21,0.2)]" 
                              : "bg-black/30 border-white/5"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full ${msg.avatarColor} text-black font-bold flex items-center justify-center text-xs flex-shrink-0`}>
                            {msg.avatarInitials}
                          </div>
                          <div className="flex-1 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white">{msg.userName}</span>
                                {msg.isSuperChat && (
                                  <span className="bg-yellow-400 text-black font-extrabold px-2 py-0.5 rounded text-[10px] font-mono">
                                    {msg.superAmount} SUPER CHAT
                                  </span>
                                )}
                                <span className="text-[10px] text-gray-500">{msg.timeAgo}</span>
                              </div>
                              {msg.timestampInVideo && (
                                <button 
                                  onClick={() => handleSeek(135, msg.timestampInVideo)}
                                  className="text-[10px] font-mono text-[#00D9FF] bg-[#00D9FF]/10 px-2 py-0.5 rounded border border-[#00D9FF]/30 hover:bg-[#00D9FF]/20"
                                >
                                  at {msg.timestampInVideo}
                                </button>
                              )}
                            </div>
                            <p className="text-gray-300 leading-normal">{msg.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Chat Input */}
                    <form 
                      onSubmit={(e) => { e.preventDefault(); handleSendCommunityMessage(chatMessageInput); }}
                      className="flex items-center gap-2 pt-2"
                    >
                      <input
                        type="text"
                        value={chatMessageInput}
                        onChange={(e) => setChatMessageInput(e.target.value)}
                        placeholder="Type a message into #community live chat..."
                        className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF88]"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-gradient-to-r from-[#00D9FF] to-[#00FF88] text-black text-xs font-extrabold rounded-xl hover:opacity-90 transition-transform active:scale-95"
                      >
                        Send
                      </button>
                    </form>
                  </div>

                  {/* SUPERPOWER #5: MARKETPLACE CARDS */}
                  <div className="glass-card p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-[#00FF88]/20 text-[#00FF88] rounded-xl">
                          <Icon name="shopping-bag" className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-white">Marketplace Tools & Assets</h2>
                          <p className="text-xs text-gray-400">Related developer tools for this video topic</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setActiveTab("marketplace")} 
                        className="text-xs font-bold text-[#00D9FF] hover:underline flex items-center gap-1"
                      >
                        <span>Recommended for you →</span>
                      </button>
                    </div>

                    {/* Product Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {marketplaceProducts.map((product) => (
                        <div 
                          key={product.id} 
                          className="bg-black/50 border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:border-[#00D9FF] transition-all group"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold bg-[#00D9FF]/20 text-[#00D9FF] px-2 py-0.5 rounded">
                                {product.badge}
                              </span>
                              <span className="text-xs font-bold text-[#00FF88]">${product.price}</span>
                            </div>
                            <h3 className="font-bold text-sm text-white group-hover:text-[#00D9FF] transition-colors">{product.name}</h3>
                            <p className="text-xs text-gray-400 line-clamp-2">{product.description}</p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                            <span className="text-[10px] text-gray-500 font-mono">{product.salesCount} sales</span>
                            <button
                              onClick={() => setCheckoutProduct(product)}
                              className="px-4 py-1.5 bg-[#00FF88] hover:bg-[#00c468] text-black font-extrabold text-xs rounded-lg transition-transform active:scale-95"
                            >
                              Buy ${product.price}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* RIGHT COLUMN (Queue + Up Next Recommended) */}
                <div className={theaterMode ? "lg:col-span-12 space-y-8" : "lg:col-span-4 space-y-8"}>
                  
                  {/* SUPERPOWER #6: UNIFIED QUEUE (YouTube + TikTok) */}
                  <div className="glass-card p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon name="queue" className="w-5 h-5 text-[#00D9FF]" />
                        <h2 className="font-bold text-base text-white">Unified Queue</h2>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-[10px] text-gray-400 font-mono flex items-center gap-1 cursor-pointer">
                          <span>Autoplay</span>
                          <input 
                            type="checkbox" 
                            checked={autoplayNext} 
                            onChange={(e) => setAutoplayNext(e.target.checked)} 
                            className="accent-[#00D9FF] rounded"
                          />
                        </label>
                        <span className="text-xs text-gray-400 font-mono">{queueItems.length} items</span>
                      </div>
                    </div>

                    {/* Queue Items */}
                    <div className="space-y-3">
                      {queueItems.map((item, index) => (
                        <div 
                          key={item.id} 
                          className="flex items-center gap-3 p-2 rounded-xl bg-black/40 border border-white/5 hover:border-white/20 transition-all group"
                        >
                          <span className="text-xs font-mono text-gray-500">{index + 1}</span>
                          
                          <div className="relative w-20 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-900">
                            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                            <span className="absolute bottom-1 right-1 bg-black/80 text-[9px] font-mono px-1 rounded text-white">
                              {item.duration}
                            </span>
                            <div className="absolute top-1 left-1 bg-black/80 rounded p-0.5">
                              {item.platform === "tiktok" ? (
                                <Icon name="tiktok" className="w-3 h-3 text-pink-500" />
                              ) : (
                                <Icon name="youtube" className="w-3 h-3 text-red-500" />
                              )}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-white truncate group-hover:text-[#00D9FF]">
                              {item.title}
                            </h4>
                            <span className="text-[10px] text-gray-400 uppercase font-mono">{item.platform}</span>
                          </div>

                          <button 
                            onClick={() => setQueueItems(prev => prev.filter(q => q.id !== item.id))}
                            className="text-gray-500 hover:text-red-400 p-1"
                          >
                            <Icon name="trash" className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add URL to Queue */}
                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <input
                        type="text"
                        value={newQueueUrl}
                        onChange={(e) => setNewQueueUrl(e.target.value)}
                        placeholder="Paste YouTube or TikTok link..."
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00D9FF]"
                      />
                      <button
                        onClick={handleAddQueueItem}
                        className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/10 transition-colors flex items-center justify-center gap-2"
                      >
                        <Icon name="plus" className="w-4 h-4 text-[#00FF88]" />
                        <span>Add to Unified Queue</span>
                      </button>
                    </div>
                  </div>

                  {/* YOUTUBE UP NEXT RECOMMENDED videos */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-base text-white flex items-center gap-2">
                      <span>Up Next</span>
                      <span className="text-xs font-normal text-gray-400">• Recommended</span>
                    </h3>

                    <div className="space-y-4">
                      {videoCatalog.filter(v => v.id !== activeVideo.id).map((vid) => (
                        <div 
                          key={vid.id}
                          onClick={() => {
                            setActiveVideo(vid);
                            if (mainScrollRef.current) mainScrollRef.current.scrollTop = 0;
                            showToast(`Loaded: ${vid.title}`);
                          }}
                          className="flex gap-3 cursor-pointer group"
                        >
                          <div className="relative w-36 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-900 border border-white/5 group-hover:border-[#00D9FF] transition-all">
                            <img src={vid.img} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] font-mono px-1.5 py-0.5 rounded text-white">
                              {vid.duration}
                            </span>
                          </div>

                          <div className="flex-1 space-y-1">
                            <h4 className="text-xs font-bold text-white leading-snug group-hover:text-[#00D9FF] line-clamp-2">
                              {vid.title}
                            </h4>
                            <p className="text-[11px] text-gray-400">{vid.channel}</p>
                            <p className="text-[10px] text-gray-500">{vid.views} • {vid.timeAgo}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* ------------------- 2. HOME / DISCOVER FEED — mobile p-3 prevents overflow ------------------- */}
          {activeTab === "home" && (
            <div className="max-w-[1600px] mx-auto p-3 sm:p-4 md:p-6 space-y-6 overflow-x-hidden">
              {isSearching ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${searchTab==="results" ? "bg-[#00D9FF] text-black" : "bg-[#272727] text-gray-300 hover:bg-[#383838]"}`}
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
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 ${searchTab==="history" ? "bg-[#00FF88] text-black" : "bg-[#272727] text-gray-300 hover:bg-[#383838]"}`}
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                    searchResults.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {searchResults.map((vid) => (
                          <div 
                            key={vid.id || vid.youtubeId}
                            onClick={() => {
                              const norm = normalizeVideo(vid);
                              setActiveVideo(norm);
                              setActiveTab("watch");
                              if (mainScrollRef.current) mainScrollRef.current.scrollTop = 0;
                              showToast(`Playing video: ${norm.title}`);
                            }}
                            className="glass-card overflow-hidden hover:border-[#00D9FF] transition-all cursor-pointer group flex flex-col justify-between"
                          >
                            <div className="relative aspect-video w-full bg-gray-900 overflow-hidden">
                              <img src={vid.img || vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                              <span className="absolute bottom-2 right-2 bg-black/80 text-xs font-mono px-2 py-0.5 rounded text-white">
                                {vid.duration}
                              </span>
                            </div>
                            <div className="p-4 space-y-2">
                              <h3 className="font-bold text-sm text-white group-hover:text-[#00D9FF] line-clamp-2">{vid.title}</h3>
                              <p className="text-xs text-gray-400">{vid.channel || vid.channelName}</p>
                              <p className="text-[11px] text-gray-500">{vid.views} • {vid.timeAgo}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="glass-card p-8 text-center space-y-3">
                        <p className="text-sm text-gray-300">No YouTube videos found matching "{searchQuery}".</p>
                        <button
                          onClick={() => setSearchQuery("")}
                          className="px-4 py-2 bg-[#00D9FF] text-black font-bold text-xs rounded-xl"
                        >
                          Clear Search & Return to Feed
                        </button>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredVideos.map((vid) => (
                    <div 
                      key={vid.id}
                      onClick={() => {
                        setActiveVideo(normalizeVideo(vid));
                        setActiveTab("watch");
                        if (mainScrollRef.current) mainScrollRef.current.scrollTop = 0;
                      }}
                      className="glass-card overflow-hidden hover:border-[#00D9FF] transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="relative aspect-video w-full bg-gray-900 overflow-hidden">
                        <img src={vid.img} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <span className="absolute bottom-2 right-2 bg-black/80 text-xs font-mono px-2 py-0.5 rounded text-white">
                          {vid.duration}
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="font-bold text-sm text-white group-hover:text-[#00D9FF] line-clamp-2">{vid.title}</h3>
                        <p className="text-xs text-gray-400">{vid.channel}</p>
                        <p className="text-[11px] text-gray-500">{vid.views} • {vid.timeAgo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ------------------- 3. YOUTUBE SHORTS ------------------- */}
          {activeTab === "shorts" && (
            <div className="max-w-md mx-auto p-4 flex flex-col items-center justify-center min-h-[80vh]">
              <div className="relative w-full aspect-[9/16] rounded-3xl overflow-hidden bg-black border border-white/20 shadow-2xl flex flex-col justify-between p-6">
                
                <img 
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80" 
                  alt="Short background" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
                />

                <div className="relative z-10 flex items-center justify-between text-xs font-bold">
                  <span className="bg-[#00D9FF] text-black px-3 py-1 rounded-full font-mono">YouTube Shorts</span>
                  <button onClick={() => showToast("Switched to next YouTube Short!")} className="bg-black/80 text-white px-3 py-1 rounded-full border border-white/20">
                    Next Short ⬇
                  </button>
                </div>

                <div className="relative z-10 space-y-3 pr-12">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">@CodeCraft</span>
                    <button className="bg-[#00D9FF] text-black text-[10px] font-extrabold px-3 py-1 rounded-full">
                      Subscribe
                    </button>
                  </div>
                  <p className="text-xs text-gray-200 leading-snug">How Attention Mechanisms Work in 30 Seconds! 🧠 #AI #Shorts</p>
                  <p className="text-[10px] text-gray-400 font-mono">🎵 Original Sound - CodeCraft Academy</p>
                </div>

                <div className="absolute right-4 bottom-12 z-10 flex flex-col items-center gap-5 text-xs text-white">
                  <button className="flex flex-col items-center gap-1">
                    <div className="p-3 bg-black/60 hover:bg-black/90 rounded-full border border-white/10">
                      <Icon name="like" className="w-5 h-5 text-[#00D9FF]" />
                    </div>
                    <span>45.2K</span>
                  </button>

                  <button className="flex flex-col items-center gap-1">
                    <div className="p-3 bg-black/60 hover:bg-black/90 rounded-full border border-white/10">
                      <Icon name="chat" className="w-5 h-5 text-white" />
                    </div>
                    <span>892</span>
                  </button>

                  <button className="flex flex-col items-center gap-1">
                    <div className="p-3 bg-black/60 hover:bg-black/90 rounded-full border border-white/10">
                      <Icon name="share" className="w-5 h-5 text-white" />
                    </div>
                    <span>Share</span>
                  </button>
                </div>

              </div>
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
                    <p className="text-xs text-gray-300">AI automatically detects the most viral 30-60 second moment from transcript and generates a YouTube Short clip.</p>
                    <input
                      type="text"
                      value={clipPrompt}
                      onChange={(e) => setClipPrompt(e.target.value)}
                      placeholder="Describe viral moment prompt..."
                      className="w-full bg-black/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white"
                    />
                    <button
                      onClick={() => {
                        setGeneratedClip({ title: "Viral Neural Net Loss Curve Moment", start: "12:15", end: "12:55" });
                        showToast("Short Clip Generated! Ready for YouTube Shorts.");
                      }}
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg"
                    >
                      Create Short Clip
                    </button>

                    {generatedClip && (
                      <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40 text-xs space-y-2">
                        <span className="font-bold text-purple-300">Clip Ready: {generatedClip.title}</span>
                        <p className="text-gray-400">Timeline: {generatedClip.start} - {generatedClip.end}</p>
                        <button onClick={() => showToast("Exporting Short MP4...")} className="px-4 py-2 bg-purple-500 text-black font-bold rounded-lg">
                          Export Video Short ⚡
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {studioTool === "thumbnail" && (
                  <div className="space-y-4">
                    <p className="text-xs text-gray-300">Enhance low-res YouTube thumbnails into crisp 4K visual assets with neon glow borders.</p>
                    <div className="relative aspect-video max-w-md rounded-xl overflow-hidden border border-white/20">
                      <img src={thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                      {isEnhancingThumbnail && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-xs text-[#00FF88] font-mono">
                          Enhancing to 4K crisp neon...
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setIsEnhancingThumbnail(true);
                        setTimeout(() => {
                          setIsEnhancingThumbnail(false);
                          showToast("Thumbnail Upgraded to 4K Crisp Neon!");
                        }, 1200);
                      }}
                      className="px-6 py-3 bg-[#00D9FF] text-black font-bold text-xs rounded-xl"
                    >
                      Enhance Thumbnail to 4K
                    </button>
                  </div>
                )}

                {studioTool === "voice" && (
                  <div className="space-y-4">
                    <p className="text-xs text-gray-300">Translate video audio into Pidgin, Yoruba, Igbo & Hausa synthetic TTS voices.</p>
                    <div className="flex gap-2">
                      {["Pidgin Audio", "Yoruba Audio", "Igbo Audio", "Hausa Audio"].map((v) => (
                        <button key={v} onClick={() => showToast(`Playing synthesized ${v}...`)} className="px-4 py-2 bg-white/10 hover:bg-[#00FF88] hover:text-black text-xs font-bold rounded-xl border border-white/10">
                          {v} 🔊
                        </button>
                      ))}
                    </div>
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

          {/* ------------------- MARKETPLACE CATALOG ------------------- */}
          {activeTab === "marketplace" && (
            <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">Developer & AI Marketplace</h1>
                  <p className="text-xs text-gray-400">Buy and sell pre-trained models, code packages, and course bundles.</p>
                </div>
                <button 
                  onClick={() => setActiveTab("sell")} 
                  className="px-5 py-2.5 bg-[#00FF88] text-black font-extrabold text-xs rounded-xl hover:bg-[#00c468]"
                >
                  + List Product for Sale (80% Royalty)
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {marketplaceProducts.map((product) => (
                  <div key={product.id} className="glass-card p-6 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <span className="text-xs font-mono font-bold text-[#00D9FF] bg-[#00D9FF]/10 px-2.5 py-1 rounded">
                        {product.badge}
                      </span>
                      <h3 className="font-bold text-base text-white">{product.name}</h3>
                      <p className="text-xs text-gray-400">{product.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <span className="text-lg font-bold text-[#00FF88]">${product.price}</span>
                      <button
                        onClick={() => setCheckoutProduct(product)}
                        className="px-5 py-2 bg-[#00D9FF] text-black font-bold text-xs rounded-xl"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------- SELL PRODUCT FORM ------------------- */}
          {activeTab === "sell" && (
            <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-6">
              <div className="glass-card p-8 space-y-6">
                <h1 className="text-xl font-bold text-white">List Your Developer Asset / Course</h1>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    showToast("Product listed! You earn 80% on every sale.");
                    setActiveTab("marketplace");
                  }}
                  className="space-y-4 text-xs"
                >
                  <div>
                    <label className="text-gray-400 block mb-1">Product Name</label>
                    <input required placeholder="e.g. PyTorch CUDA Model Checkpoints" className="w-full bg-black/80 border border-white/10 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Price (USD)</label>
                    <input required type="number" step="0.01" placeholder="19.99" className="w-full bg-black/80 border border-white/10 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Description</label>
                    <textarea required rows={3} placeholder="Describe the tool or course..." className="w-full bg-black/80 border border-white/10 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <button type="submit" className="w-full py-3 bg-[#00FF88] text-black font-extrabold rounded-xl">
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
                      <button onClick={()=>{ setChannelSubscribed(!channelSubscribed); showToast(channelSubscribed ? `Unsubscribed from ${channelData.name}` : `Subscribed to ${channelData.name}! 🎉`); }} className={`px-6 py-2.5 rounded-full font-bold text-xs transition-all active:scale-95 ${channelSubscribed ? "bg-[#272727] text-gray-300" : "bg-[#00D9FF] text-black shadow-[0_0_15px_rgba(0,217,255,0.4)]"}`}>{channelSubscribed ? "Subscribed ✓" : "Subscribe"}</button>
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
                <ChannelAvatar src={profileData?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"} alt={profileData?.name || "Alphatekx Dev"} size={96} verified={profileData?.verified} className="border-4 border-black shadow-xl w-24 h-24 flex-shrink-0" />
                <div className="text-center sm:text-left flex-1 min-w-0">
                  <ChannelName name={profileData?.name || "Alphatekx Dev"} verified={profileData?.verified} handle={profileData?.handle || "@alphatekx_dev"} className="text-xl sm:text-2xl justify-center sm:justify-start" />
                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start mt-1">
                    <SubscriberCount count={profileData?.subscribers || "1.2M"} />
                    <span className="text-gray-500 text-xs">•</span>
                    <span className="text-xs text-gray-400">{profileData?.email || "user@alphatekx.com"}</span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1 max-w-xl">{profileData?.bio || "Building high-performance AI video infrastructure with Cloudflare Workers."}</p>
                </div>
                <button onClick={()=>setIsEditingProfile(!isEditingProfile)} className="px-5 py-2 rounded-full bg-[#272727] hover:bg-[#383838] text-xs font-bold text-white border border-white/10 flex-shrink-0">
                  {isEditingProfile ? "Cancel" : "Edit Profile"}
                </button>
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

          {/* FOOTER - YouTube TOS Requirement */}
          <footer className="bg-[#0f0f0f] border-t border-[#272727] py-6 px-4 text-center text-xs text-gray-500 space-y-2 mt-8">
            <p>Alphatekx Stream uses YouTube API Services. YouTube is a trademark of Google LLC.</p>
            <p className="font-mono text-[10px] text-gray-600">Built with React, Tailwind CSS, Cloudflare Workers & Durable Objects SQLite.</p>
          </footer>

        </main>
      </div>

      {/* ------------------- SIGNATURE YOUTUBE FLOATING MINI-PLAYER ------------------- */}
      {miniPlayerActive && activeTab === "watch" && (
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
  );
}

// Render Root
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
