import { useState, useEffect } from 'react';
import { getUser } from './lib/auth';
import { SignInButton } from './components/SignInButton';
import { GuestOverlay } from './components/GuestOverlay';
import Home from './pages/Home.jsx';
import WorkspacePage from './pages/Workspace.jsx';

function Header({ user, isGuest }) {
  return (
    <header className="flex items-center justify-between p-4 border-b border-white/10">
      <div className="text-2xl font-extrabold tracking-tighter text-[#FFD700]">ALPHATEKX</div>
      <div>
        {isGuest ? <SignInButton /> : (
          <div className="flex items-center gap-3">
            <img src={user.channelAvatar} alt="avatar" className="w-10 h-10 rounded-full border-2 border-[#FFD700]" />
            <span className="text-sm font-semibold">{user.channelName}</span>
          </div>
        )}
      </div>
    </header>
  );
}

function HomeFeed({ user, isGuest }) {
  const feed = user ? user.feed || [] : [];
  // Prompt 1: Home feed = clean YouTube-like cards, NO iframe, NO play icon, NO logo on thumbnail
  // thumbnail always from videoId: https://i.ytimg.com/vi/${videoId}/hqdefault.jpg, key={videoId}, click -> /watch?v=
  const handleCardClick = (vid) => {
    window.location.href = `/watch?v=${vid}`;
  };
  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-black mb-6">{isGuest ? 'Browse Alphatekx Stream' : 'Your Personalized Feed'}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {feed.length === 0 && isGuest && (
          <div className="md:col-span-3 text-center text-gray-400">Explore videos while browsing as a guest.</div>
        )}
        {feed.map((v) => {
          const vid = v.videoId || v.youtubeId || v.id || 'jvXEkm27XOE';
          const thumb = v.thumbnail || v.thumbnailUrl || `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`;
          const thumbUrl = thumb.includes('i.ytimg.com/vi/') ? thumb : `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`;
          const duration = v.duration || '';
          return (
            <div
              key={vid}
              onClick={() => handleCardClick(vid)}
              className="cursor-pointer w-full group"
            >
              {/* Thumbnail - clean, no iframe, no play icon, no YouTube logo, no title overlay — only duration */}
              <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
                <img
                  src={thumbUrl}
                  alt={v.title || 'video'}
                  className="w-full h-full object-cover group-hover:opacity-95 transition"
                  loading="lazy"
                  onError={(e)=>{ e.currentTarget.src=`https://i.ytimg.com/vi/${vid}/hqdefault.jpg`; }}
                />
                {duration && (
                  <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[11px] px-1 py-0.5 rounded font-medium">
                    {duration}
                  </span>
                )}
              </div>
              {/* Title + meta BELOW thumbnail */}
              <div className="pt-2 px-1">
                <h3 className="text-white text-[13px] font-medium leading-5 line-clamp-2 group-hover:text-[#FFD700] transition-colors">
                  {v.title}
                </h3>
                <p className="text-zinc-400 text-xs mt-1 truncate">
                  {v.channelName || v.channel || ''}{v.publishedAt ? ` • ${new Date(v.publishedAt).toLocaleDateString()}` : ''}{v.views ? ` • ${v.views}` : ''}
                </p>
                {/* Like button below meta — not on thumbnail. Stop propagation so card click still goes to watch */}
                <div onClick={(e)=>e.stopPropagation()}>
                  {isGuest ? (
                    <GuestOverlay message="Sign in to like & comment">
                      <button className="mt-2 w-full py-2 bg-white/10 rounded-lg text-sm">Like</button>
                    </GuestOverlay>
                  ) : (
                    <button className="mt-2 w-full py-2 bg-[#FFD700] text-black font-bold rounded-lg text-sm hover:scale-[1.02] transition">Like</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

function Footer() {
  return <footer className="p-6 text-center text-xs text-gray-500">© Alphatekx Stream — Gated Experience</footer>;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isGuest = !user;

  useEffect(() => {
    // Prompt 1: clear stale thumbnail caches that cause mix
    try { localStorage.removeItem('thumbnails'); localStorage.removeItem('thumbnail_cache'); sessionStorage.removeItem('thumbnails'); } catch {}
    getUser().then(setUser).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen bg-[#0B0215] flex items-center justify-center text-white text-xl">Loading...</div>;

  const pathname = window.location.pathname;
  const search = window.location.search || "";
  const isWatch = pathname.startsWith('/watch') && new URLSearchParams(search).get('v');
  const isWorkspace = pathname.startsWith('/workspace/');
  if (isWatch || isWorkspace) return <WorkspacePage />;

  return (
    <div className="min-h-screen bg-[#0B0215] text-white">
      <Header user={user} isGuest={isGuest} />
      <HomeFeed user={user} isGuest={isGuest} />
      <Footer />
    </div>
  );
}
