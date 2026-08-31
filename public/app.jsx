import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

// --- SVG Icons Helper Component ---
const Icon = ({ name, className = "w-5 h-5", style = {} }) => {
  switch (name) {
    case "menu":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>;
    case "logo":
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
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
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>;
    case "mic":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>;
    case "cast":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 16.1A5 5 0 015.9 20M2 12a9 9 0 018.6 9M2 7.9A13.1 13.1 0 0114.7 21M15 5H4a2 2 0 00-2 2v3h2V7h11v10h-3v2h4a2 2 0 002-2V7a2 2 0 00-2-2z"/></svg>;
    case "bell":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>;
    case "sparkles":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>;
    case "like":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 11H4a2 2 0 00-2 2v6a2 2 0 002 2h3"/></svg>;
    case "dislike":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v9a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5 9h3a2 2 0 002-2V9a2 2 0 00-2-2h-3"/></svg>;
    case "share":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>;
    case "download":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>;
    case "bookmark":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>;
    case "chat":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>;
    case "shopping-bag":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>;
    case "queue":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>;
    case "teacher":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>;
    case "brain":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>;
    case "studio":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>;
    case "crown":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>;
    case "home":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>;
    case "shorts":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
    case "plus":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>;
    case "subscriptions":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>;
    case "user":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>;
    case "trash":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>;
    case "check":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>;
    case "external":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>;
    case "history":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
    case "playlist":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h13M4 14h10M4 18h7"/></svg>;
    case "clock":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
    case "trending":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>;
    case "scissors":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 0A3 3 0 104.879 4.879a3 3 0 004.242 4.242zm0 5.758a3 3 0 10-4.242 4.242 3 3 0 004.242-4.242z"/></svg>;
    case "tiktok":
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-1.18V9.28a6.34 6.34 0 0 0-3.55 1.08 6.34 6.34 0 1 0 9.89 5.31V9.4a8.16 8.16 0 0 0 4.77 1.52V7.47a4.85 4.85 0 0 1-1.00-.78z"/>
        </svg>
      );
    case "youtube":
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    default:
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"/></svg>;
  }
};

// --- Main App Component ---
function App() {
  // Navigation & YouTube Sidebar State
  const [activeTab, setActiveTab] = useState("watch"); // watch, home, shorts, teacher, memory, chat, community, marketplace, sell, studio, pricing, profile
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChip, setActiveChip] = useState("All");

  // Video State
  const [activeVideo, setActiveVideo] = useState({
    videoId: "dQw4w9WgXcQ",
    title: "How to Build Neural Networks from Scratch | Full AI Tutorial 2024",
    channel: "CodeCraft Academy",
    subscribers: "1.2M",
    views: "340,291",
    timeAgo: "3 days ago",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    description: "In this comprehensive tutorial, we build a deep neural network from mathematical primitives up to PyTorch CUDA acceleration and edge inferencing. We cover forward propagation, loss calculations, backpropagation via chain rule, attention modules, and deployment to Cloudflare Workers AI."
  });

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [likeCount, setLikeCount] = useState(24500);
  const [userLiked, setUserLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showDescriptionMore, setShowDescriptionMore] = useState(false);

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

  // Superpower 4: Live Community Chat & Comments
  const [activeCommentTab, setActiveCommentTab] = useState("live"); // live or comments
  const [activeChannel, setActiveChannel] = useState("general");
  const [communityMessages, setCommunityMessages] = useState([
    { id: 1, userName: "dev_nina", avatarInitials: "N", avatarColor: "bg-orange-500", timeAgo: "2m ago", message: "This explanation at 8:15 finally made backprop click — thank you! 🔥", timestampInVideo: "8:15", likes: 14 },
    { id: 2, userName: "ml_learner", avatarInitials: "M", avatarColor: "bg-teal-500", timeAgo: "1m ago", message: "Would love a follow-up on CNNs next. Super clear presentation!", timestampInVideo: "12:30", likes: 9 },
    { id: 3, userName: "tech_guru", avatarInitials: "T", avatarColor: "bg-purple-500", timeAgo: "Just now", message: "Are you guys running PyTorch 2.0 compile mode or raw CUDA kernels here?", timestampInVideo: "2:15", likes: 5 }
  ]);
  const [chatMessageInput, setChatMessageInput] = useState("");
  const [liveViewerCount, setLiveViewerCount] = useState(1248);

  // Superpower 5: Marketplace Cards Inside Watch Page
  const [marketplaceProducts, setMarketplaceProducts] = useState([
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
  const [chatMessages, setChatMessages] = useState([
    { sender: "ai", text: "Hello! I am your Alphatekx AI Memory Assistant. I remember every video you've watched. Ask me anything about your watch history!" }
  ]);
  const [chatInput, setChatInput] = useState("");

  // Superpower 9: AI Studio
  const [studioTool, setStudioTool] = useState("clip");
  const [clipPrompt, setClipPrompt] = useState("find viral moment when loss reaches 0.01");
  const [generatedClip, setGeneratedClip] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80");
  const [isEnhancingThumbnail, setIsEnhancingThumbnail] = useState(false);

  // Superpower 10: Monetization Pro Subscription
  const [isProUser, setIsProUser] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  // YouTube Shorts Feed State
  const [shortIndex, setShortIndex] = useState(0);
  const shortsList = [
    {
      id: "short_1",
      title: "How Attention Mechanisms Work in 30 Seconds! 🧠 #AI #Shorts",
      channel: "@CodeCraft",
      likes: "45.2K",
      comments: "892",
      sound: "Original Sound - CodeCraft Academy",
      videoBg: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "short_2",
      title: "Deploying PyTorch to Cloudflare Workers at 100 FPS ⚡",
      channel: "@ServerlessPro",
      likes: "18.9K",
      comments: "412",
      sound: "Future Synthwave - Alphatekx Beats",
      videoBg: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80"
    }
  ];

  // Youtube Player Ref
  const iframeRef = useRef(null);

  // Show Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Simulate viewer count fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewerCount(prev => prev + (Math.random() > 0.5 ? 2 : -1));
    }, 4000);
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

  // Add Item to Unified Queue
  const handleAddQueueItem = () => {
    if (!newQueueUrl.trim()) return;
    const isTikTok = newQueueUrl.includes("tiktok.com");
    const newItem = {
      id: Date.now(),
      platform: isTikTok ? "tiktok" : "youtube",
      videoId: isTikTok ? "7123456789" : "L_LUpnjgPso",
      title: isTikTok ? `TikTok Import #${queueItems.length + 1}` : `Imported YouTube Video`,
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
    }, 1200);
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

  // AI Memory Chat
  const handleSendMemoryChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");
    setTimeout(() => {
      let botReply = "Based on your watch history (3 videos watched in the past month): Neural networks use matrix multiplications for forward pass, and backprop updates weights via gradient descent (Jump to 12:30).";
      if (userMsg.toLowerCase().includes("voice") || userMsg.toLowerCase().includes("audio")) {
        botReply = "Based on 'Building Real-time AI Voice Agents' (watched 12 days ago): The video recommends using WebSockets paired with Cloudflare Workers for sub-100ms voice roundtrip (Jump to 04:12).";
      }
      setChatMessages(prev => [...prev, {
        sender: "ai",
        text: botReply,
        sources: [
          { title: "How to Build Neural Networks", timestamp: "12:30" },
          { title: "Building Real-time AI Voice Agents", timestamp: "04:12" }
        ]
      }]);
    }, 800);
  };

  // Recommended Videos List
  const recommendedVideos = [
    { videoId: "L_LUpnjgPso", title: "Building Real-time AI Voice Agents with WebSockets", channel: "Edge AI Lab", views: "185K views", timeAgo: "1 week ago", duration: "15:10", thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80" },
    { videoId: "M576WGiDBdQ", title: "Cloudflare Workers & SQLite Durable Objects Masterclass", channel: "Serverless Pro", views: "92K views", timeAgo: "4 days ago", duration: "18:30", thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80" },
    { videoId: "fJ9rUzIMcZQ", title: "Sub-100ms LLM Streaming Inference on Edge GPUs", channel: "AI Hardware Hub", views: "410K views", timeAgo: "2 weeks ago", duration: "32:15", thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80" }
  ];

  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen flex flex-col font-sans selection:bg-[#00D9FF] selection:text-black">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#00D9FF] text-black font-semibold px-4 py-3 rounded-xl shadow-[0_0_25px_rgba(0,217,255,0.6)] flex items-center gap-3 animate-fade-in">
          <Icon name="sparkles" className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Stripe Checkout Test Modal */}
      {checkoutProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D0D12] border border-[#00D9FF] rounded-2xl max-w-md w-full p-6 shadow-[0_0_40px_rgba(0,217,255,0.4)] relative">
            <button 
              onClick={() => setCheckoutProduct(null)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
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

      {/* ------------------- YOUTUBE HEADER NAVBAR ------------------- */}
      <header className="sticky top-0 z-40 bg-[#0f0f0f] border-b border-[#272727] px-4 py-2 flex items-center justify-between gap-4">
        
        {/* Left: Hamburger menu button + Logo */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-full hover:bg-[#272727] text-gray-200"
            title="Toggle YouTube Menu"
          >
            <Icon name="menu" className="w-6 h-6" />
          </button>

          <div 
            onClick={() => setActiveTab("watch")} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            <Icon name="logo" className="w-7 h-7 transition-transform group-hover:scale-105" />
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tighter text-white">Alphatekx</span>
              <span className="font-light text-lg tracking-tighter text-gray-400">Stream</span>
              <span className="text-[9px] font-bold font-mono bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/40 px-1.5 py-0.2 rounded ml-1">
                AI NG
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search Bar (Exact YouTube Style with Pill borders, attached search button & Mic) */}
        <div className="flex-1 max-w-2xl mx-auto flex items-center gap-3">
          <form 
            onSubmit={(e) => { e.preventDefault(); setActiveTab("home"); }}
            className="flex-1 flex items-center bg-[#121212] border border-[#303030] rounded-full focus-within:border-[#00D9FF] focus-within:ring-1 focus-within:ring-[#00D9FF] overflow-hidden"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in Alphatekx Stream..."
              className="w-full bg-transparent px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none"
            />
            <button 
              type="submit" 
              className="px-6 py-2.5 bg-[#222222] hover:bg-[#303030] border-l border-[#303030] text-gray-300"
              title="Search"
            >
              <Icon name="search" className="w-4 h-4" />
            </button>
          </form>

          {/* YouTube Voice Mic Button */}
          <button 
            onClick={() => showToast("Voice search listening... Speak now!")} 
            className="p-2.5 rounded-full bg-[#222222] hover:bg-[#303030] text-gray-200 hover:text-[#00D9FF] transition-colors flex-shrink-0"
            title="Search with voice"
          >
            <Icon name="mic" className="w-5 h-5" />
          </button>
        </div>

        {/* Right Action Icons: Create, Cast, Notifications, Cart, Profile */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveTab("studio")} 
            className="p-2 rounded-full hover:bg-[#272727] text-gray-200 hidden sm:flex items-center gap-1 text-xs font-semibold px-3"
            title="Create with AI Studio"
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
            className="p-2 rounded-full hover:bg-[#272727] text-gray-200 relative"
            title="Live Community Chat"
          >
            <Icon name="bell" className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00FF88] rounded-full animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00FF88] rounded-full" />
          </button>

          <button 
            onClick={() => setActiveTab("marketplace")} 
            className="p-2 rounded-full hover:bg-[#272727] text-gray-200 relative"
            title="Marketplace Cart"
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
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00D9FF] to-[#00FF88] p-0.5 ml-1"
          >
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
              alt="Profile Avatar" 
              className="w-full h-full rounded-full object-cover" 
            />
          </button>
        </div>
      </header>

      {/* APP BODY: YOUTUBE SIDEBAR + MAIN CONTENT CONTAINER */}
      <div className="flex-1 flex overflow-hidden">

        {/* ------------------- YOUTUBE SIDEBAR ------------------- */}
        <aside 
          className={`bg-[#0f0f0f] border-r border-[#272727] transition-all duration-300 flex flex-col justify-between hidden md:flex ${
            sidebarOpen ? "w-64" : "w-18"
          }`}
        >
          <div className="py-2 overflow-y-auto space-y-4">
            
            {/* Primary Navigation Section */}
            <div className="px-2 space-y-1">
              {[
                { id: "home", label: "Home", icon: "home" },
                { id: "watch", label: "Now Playing", icon: "youtube" },
                { id: "shorts", label: "Shorts", icon: "shorts" },
                { id: "community", label: "Subscriptions", icon: "subscriptions" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
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

            {/* AI Superpowers Navigation Section */}
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
                { id: "pricing", label: "Pro Subscription", icon: "crown", color: "text-yellow-400" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
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

            {/* You / Library Section */}
            <div className="px-2 space-y-1">
              {sidebarOpen && <div className="px-3 py-1 text-xs font-bold text-gray-400 uppercase">You</div>}
              {[
                { id: "profile", label: "Your Channel", icon: "user" },
                { id: "memory", label: "Watch History", icon: "history" },
                { id: "marketplace", label: "Purchases", icon: "playlist" }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(item.id)}
                  className="w-full flex items-center gap-5 px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:bg-[#272727] hover:text-white"
                >
                  <Icon name={item.icon} className="w-5 h-5 text-gray-400" />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              ))}
            </div>

            {sidebarOpen && (
              <>
                <div className="border-t border-[#272727] my-2" />
                <div className="px-4 py-2 space-y-3">
                  <span className="text-xs font-bold text-gray-400 uppercase">Subscribed Channels</span>
                  <div className="space-y-2">
                    {[
                      { name: "CodeCraft Academy", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" },
                      { name: "Edge AI Lab", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" },
                      { name: "Serverless Pro", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" }
                    ].map((ch, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs text-gray-300 hover:text-white cursor-pointer py-1">
                        <img src={ch.avatar} alt={ch.name} className="w-6 h-6 rounded-full object-cover" />
                        <span className="truncate">{ch.name}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] ml-auto" />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

          </div>

          {sidebarOpen && (
            <div className="p-4 border-t border-[#272727] text-[10px] text-gray-500 space-y-1">
              <p>Alphatekx Stream v2.4 AI</p>
              <p>YouTube API Services Partner</p>
            </div>
          )}
        </aside>

        {/* ------------------- MAIN CONTENT AREA ------------------- */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-8">

          {/* TOP TOPIC CHIPS BAR (YouTube Signature Horizontal Filter Bar) */}
          <div className="bg-[#0f0f0f] border-b border-[#272727] px-4 py-2.5 flex items-center gap-2 overflow-x-auto sticky top-0 z-30">
            {["All", "Neural Networks", "PyTorch", "AI Superpowers", "Cloudflare Workers", "Naija Dialects", "TikTok Sync", "Live Chat", "Recently Uploaded"].map((chip) => (
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

          {/* ------------------- 1. WATCH PAGE (Main Request Focus) ------------------- */}
          {activeTab === "watch" && (
            <div className="max-w-[1700px] mx-auto p-4 md:p-6 lg:p-8 space-y-8">
              
              {/* Desktop 2 Columns (Left 70% YouTube Player + AI Summary + Chat, Right 30% Queue + Up Next) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT COLUMN (70% on Desktop) */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* YOUTUBE PLAYER CONTAINER with ENHANCED CINEMA MODE GLOW (Superpower #1) */}
                  <div className="relative group rounded-2xl overflow-hidden bg-black border border-[#272727] shadow-2xl">
                    
                    {/* Ambient Blurred Glow Effect */}
                    {cinemaMode && (
                      <div 
                        className="absolute -inset-4 bg-cover bg-center blur-[50px] opacity-40 scale-125 transition-all duration-700 pointer-events-none"
                        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80)` }}
                      />
                    )}

                    {/* Top Status & Glow Toggle Overlay */}
                    <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between text-xs font-mono pointer-events-none">
                      <div className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-gray-300 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
                        <span>Enhanced Cinema Mode ON • 1080p60 • AI View ON</span>
                      </div>

                      <button
                        onClick={() => {
                          setCinemaMode(!cinemaMode);
                          showToast(cinemaMode ? "Ambient Cinema Glow OFF" : "Ambient Cinema Glow ON");
                        }}
                        className="pointer-events-auto bg-black/90 hover:bg-black backdrop-blur-md px-3 py-1 rounded-full border border-[#00D9FF]/50 text-[#00D9FF] hover:border-[#00FF88] transition-colors"
                      >
                        Ambient Glow: {cinemaMode ? "ON ✨" : "OFF"}
                      </button>
                    </div>

                    {/* 16:9 Aspect Ratio Official YouTube Iframe Embed */}
                    <div className="relative aspect-video w-full bg-black z-10">
                      <iframe
                        ref={iframeRef}
                        src={`https://www.youtube-nocookie.com/embed/${activeVideo.videoId}?enablejsapi=1&modestbranding=1&rel=0`}
                        title={activeVideo.title}
                        className="w-full h-full border-0 rounded-2xl"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>

                  {/* YOUTUBE VIDEO TITLE + CHANNEL ROW + SUBSCRIBE + ACTION PILLS */}
                  <div className="space-y-4">
                    <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-snug">
                      {activeVideo.title}
                    </h1>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#272727] pb-4">
                      
                      {/* Channel Row: Avatar + Name + Subscribers + Subscribe Button */}
                      <div className="flex items-center gap-4">
                        <img 
                          src={activeVideo.avatar} 
                          alt={activeVideo.channel} 
                          className="w-10 h-10 rounded-full object-cover border border-[#00D9FF]/40" 
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-base text-white">{activeVideo.channel}</span>
                            <span className="text-[#00FF88] text-xs">✓</span>
                          </div>
                          <p className="text-xs text-gray-400">{activeVideo.subscribers} subscribers</p>
                        </div>

                        {/* YouTube Subscribe Button (Electric Blue #00D9FF) */}
                        <button
                          onClick={() => {
                            setIsSubscribed(!isSubscribed);
                            showToast(isSubscribed ? "Unsubscribed from channel" : "Subscribed to CodeCraft Academy! 🎉");
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

                      {/* Action Row Horizontal Pills (Joined Like/Dislike, Share, Download, Save, AI Summary) */}
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        
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
                          onClick={() => {
                            navigator.clipboard?.writeText(window.location.href);
                            showToast("Watch link copied to clipboard!");
                          }} 
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
                      <span>{activeVideo.views} views</span>
                      <span>•</span>
                      <span>{activeVideo.timeAgo}</span>
                      <span className="text-[#00D9FF]">#NeuralNetworks #AI #PyTorch</span>
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

                  {/* 2. SUPERPOWER #2 & #3: AI SUMMARY CARD with CLICKABLE TIMESTAMPS & NAIJA TRANSLATOR */}
                  <div className="glass-card neon-border-blue p-6 space-y-5 relative overflow-hidden animate-glow-pulse">
                    
                    {/* Glowing Top Strip */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00D9FF] via-[#00FF88] to-[#00D9FF]" />

                    {/* Card Title & Naija Translator Dropdown */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Icon name="sparkles" className="w-5 h-5 text-[#00FF88]" />
                        <h2 className="text-lg font-bold text-white tracking-wide">AI Key Takeaways & Summary</h2>
                        <span className="text-[10px] font-mono bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/40 px-2.5 py-0.5 rounded-full font-semibold">
                          Alphatekx AI • Beta
                        </span>
                      </div>

                      {/* Naija Translator Dropdown (Superpower #3) */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-mono">Naija Translator:</span>
                        <select 
                          value={aiLanguage}
                          onChange={handleLanguageChange}
                          className="bg-black/80 border border-[#00D9FF]/50 text-xs text-[#00D9FF] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#00FF88] font-mono font-semibold"
                        >
                          <option value="English">English</option>
                          <option value="Pidgin">Pidgin (Naija) 🇳🇬</option>
                          <option value="Yoruba">Yoruba 🇳🇬</option>
                          <option value="Igbo">Igbo 🇳🇬</option>
                          <option value="Hausa">Hausa 🇳🇬</option>
                        </select>
                      </div>
                    </div>

                    {/* 3 Clickable Bullets with Timestamp Links (Seeks YouTube Player) */}
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

                    {/* Send Note straight into Community Chat */}
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

                  {/* 3. SUPERPOWER #4: COMMUNITY LIVE CHAT & COMMENTS */}
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

                      {/* Room Selector Pills (#general, #builders, #marketplace, #help) */}
                      <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10 text-xs">
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

                    {/* Chat Messages */}
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                      {communityMessages.map((msg) => (
                        <div key={msg.id} className="flex items-start gap-3 bg-black/30 p-3 rounded-xl border border-white/5">
                          <div className={`w-8 h-8 rounded-full ${msg.avatarColor} text-black font-bold flex items-center justify-center text-xs flex-shrink-0`}>
                            {msg.avatarInitials}
                          </div>
                          <div className="flex-1 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white">{msg.userName}</span>
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

                  {/* 4. SUPERPOWER #5: MARKETPLACE CARDS INSIDE WATCH PAGE */}
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

                {/* RIGHT COLUMN (30% Desktop / Mobile Stack) */}
                <div className="lg:col-span-4 space-y-8">
                  
                  {/* 5. SUPERPOWER #6: UNIFIED QUEUE (YouTube + TikTok) */}
                  <div className="glass-card p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon name="queue" className="w-5 h-5 text-[#00D9FF]" />
                        <h2 className="font-bold text-base text-white">Unified Queue</h2>
                      </div>
                      <span className="text-xs text-gray-400 font-mono">{queueItems.length} items</span>
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

                  {/* YOUTUBE UP NEXT / RECOMMENDED VIDEOS SIDE FEED */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-base text-white flex items-center gap-2">
                      <span>Up Next</span>
                      <span className="text-xs font-normal text-gray-400">• Recommended</span>
                    </h3>

                    <div className="space-y-4">
                      {recommendedVideos.map((vid) => (
                        <div 
                          key={vid.videoId}
                          onClick={() => {
                            setActiveVideo({
                              videoId: vid.videoId,
                              title: vid.title,
                              channel: vid.channel,
                              subscribers: "890K",
                              views: vid.views,
                              timeAgo: vid.timeAgo,
                              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
                              description: "Official video tutorial covering low-latency real-time streaming architectures."
                            });
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            showToast(`Loaded: ${vid.title}`);
                          }}
                          className="flex gap-3 cursor-pointer group"
                        >
                          <div className="relative w-36 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-900 border border-white/5 group-hover:border-[#00D9FF] transition-all">
                            <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
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

          {/* ------------------- 2. HOME / DISCOVER FEED ------------------- */}
          {activeTab === "home" && (
            <div className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[
                  { id: "dQw4w9WgXcQ", title: "How to Build Neural Networks from Scratch | Full AI Tutorial 2024", channel: "CodeCraft Academy", views: "340K views", timeAgo: "3 days ago", duration: "22:45", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80" },
                  { id: "L_LUpnjgPso", title: "Building Real-time AI Voice Agents with WebSockets", channel: "Edge AI Lab", views: "185K views", timeAgo: "1 week ago", duration: "15:10", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80" },
                  { id: "M576WGiDBdQ", title: "Cloudflare Workers & SQLite Durable Objects Masterclass", channel: "Serverless Pro", views: "92K views", timeAgo: "4 days ago", duration: "18:30", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80" },
                  { id: "fJ9rUzIMcZQ", title: "Sub-100ms LLM Streaming Inference on Edge GPUs", channel: "AI Hardware Hub", views: "410K views", timeAgo: "2 weeks ago", duration: "32:15", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80" }
                ].map((vid) => (
                  <div 
                    key={vid.id}
                    onClick={() => {
                      setActiveVideo({
                        videoId: vid.id,
                        title: vid.title,
                        channel: vid.channel,
                        subscribers: "1.2M",
                        views: vid.views,
                        timeAgo: vid.timeAgo,
                        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
                        description: "Featured video tutorial."
                      });
                      setActiveTab("watch");
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

            </div>
          )}

          {/* ------------------- 3. YOUTUBE SHORTS FEED ------------------- */}
          {activeTab === "shorts" && (
            <div className="max-w-md mx-auto p-4 flex flex-col items-center justify-center min-h-[80vh]">
              <div className="relative w-full aspect-[9/16] rounded-3xl overflow-hidden bg-black border border-white/20 shadow-2xl flex flex-col justify-between p-6">
                
                <img 
                  src={shortsList[shortIndex].videoBg} 
                  alt="Short video background" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
                />

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between text-xs font-bold">
                  <span className="bg-[#00D9FF] text-black px-3 py-1 rounded-full font-mono">YouTube Shorts</span>
                  <button onClick={() => setShortIndex((shortIndex + 1) % shortsList.length)} className="bg-black/80 text-white px-3 py-1 rounded-full border border-white/20">
                    Next Short ⬇
                  </button>
                </div>

                {/* Bottom Overlay Channel & Title */}
                <div className="relative z-10 space-y-3 pr-12">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{shortsList[shortIndex].channel}</span>
                    <button className="bg-[#00D9FF] text-black text-[10px] font-extrabold px-3 py-1 rounded-full">
                      Subscribe
                    </button>
                  </div>
                  <p className="text-xs text-gray-200 leading-snug">{shortsList[shortIndex].title}</p>
                  <p className="text-[10px] text-gray-400 font-mono">🎵 {shortsList[shortIndex].sound}</p>
                </div>

                {/* Right Action Stack */}
                <div className="absolute right-4 bottom-12 z-10 flex flex-col items-center gap-5 text-xs text-white">
                  <button className="flex flex-col items-center gap-1">
                    <div className="p-3 bg-black/60 hover:bg-black/90 rounded-full border border-white/10">
                      <Icon name="like" className="w-5 h-5 text-[#00D9FF]" />
                    </div>
                    <span>{shortsList[shortIndex].likes}</span>
                  </button>

                  <button className="flex flex-col items-center gap-1">
                    <div className="p-3 bg-black/60 hover:bg-black/90 rounded-full border border-white/10">
                      <Icon name="chat" className="w-5 h-5 text-white" />
                    </div>
                    <span>{shortsList[shortIndex].comments}</span>
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

              {/* Generated Course Output */}
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
                            setActiveVideo({
                              videoId: step.videoId,
                              title: step.title,
                              channel: "CodeCraft Academy",
                              subscribers: "1.2M",
                              views: "100K",
                              timeAgo: "1 day ago",
                              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
                              description: step.desc
                            });
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
                          onClick={() => handleSeek(750, res.timestamp)}
                          className="text-xs font-mono font-bold text-[#00FF88] hover:underline"
                        >
                          Jump directly to {res.timestamp} →
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* RAG Watch History Chat */}
              <div className="glass-card p-6 space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Chat with your Watch History</span>
                  <span className="text-xs font-mono text-[#00FF88] bg-[#00FF88]/20 px-2 py-0.5 rounded">RAG AI</span>
                </h2>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-lg p-4 rounded-2xl text-xs space-y-2 ${
                        msg.sender === "user" 
                          ? "bg-[#00D9FF] text-black font-medium" 
                          : "bg-black/60 border border-white/10 text-gray-200"
                      }`}>
                        <p>{msg.text}</p>
                        {msg.sources && (
                          <div className="pt-2 border-t border-white/10 text-[10px] font-mono space-y-1">
                            <span className="text-gray-400">Citations:</span>
                            {msg.sources.map((s, idx) => (
                              <div key={idx} className="text-[#00FF88]">
                                • {s.title} (@ {s.timestamp})
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMemoryChat} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask a question about your saved watch history..."
                    className="flex-1 bg-black/80 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00D9FF]"
                  />
                  <button type="submit" className="px-5 py-2.5 bg-white/10 hover:bg-[#00D9FF] hover:text-black font-bold text-xs rounded-xl transition-colors">
                    Ask AI
                  </button>
                </form>
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

          {/* ------------------- USER PROFILE / CHANNEL VIEW ------------------- */}
          {activeTab === "profile" && (
            <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
              <div className="relative rounded-2xl h-40 bg-gradient-to-r from-[#00D9FF]/30 via-purple-900/40 to-[#00FF88]/30 overflow-hidden border border-white/10">
                <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80)` }} />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 -mt-16 px-6 relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80" 
                  alt="Channel Avatar" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-black shadow-xl"
                />
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
                    <span>Alphatekx Dev</span>
                    <span className="text-[#00FF88] text-sm">✓</span>
                  </h1>
                  <p className="text-xs text-gray-400">@alphatekx_dev • 1.2M subscribers • 142 videos</p>
                  <p className="text-xs text-gray-300 mt-1">Building high-performance AI video infrastructure with Cloudflare Workers.</p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR (YouTube Mobile Muscle Memory) */}
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
          onClick={() => setActiveTab("studio")}
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

      {/* FOOTER - YouTube TOS & API Service Requirement */}
      <footer className="bg-[#0f0f0f] border-t border-[#272727] py-6 px-4 text-center text-xs text-gray-500 space-y-2">
        <p>Alphatekx Stream uses YouTube API Services. YouTube is a trademark of Google LLC.</p>
        <p className="font-mono text-[10px] text-gray-600">Built with React, Tailwind CSS, Cloudflare Workers & Durable Objects SQLite.</p>
      </footer>

    </div>
  );
}

// Render App into DOM
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
