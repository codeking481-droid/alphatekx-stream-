import { useState, useEffect } from 'react';
import { getUser } from './lib/auth';
import { SignInButton } from './components/SignInButton';
import { GuestOverlay } from './components/GuestOverlay';
import Home from './pages/Home.jsx';

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
  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-black mb-6">{isGuest ? 'Browse Alphatekx Stream' : 'Your Personalized Feed'}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {feed.length === 0 && isGuest && (
          <div className="md:col-span-3 text-center text-gray-400">Explore videos while browsing as a guest.</div>
        )}
        {feed.map(v => (
          <div key={v.videoId || v.id} className="bg-[#1a0b2e] rounded-2xl overflow-hidden shadow-xl border border-white/5">
            <img src={v.thumbnail} alt="thumb" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{v.title}</h3>
              <p className="text-xs text-gray-400">{v.publishedAt}</p>
              {isGuest ? (
                <GuestOverlay message="Sign in to like & comment">
                  <button className="mt-3 w-full py-2 bg-white/10 rounded-lg text-sm">Like</button>
                </GuestOverlay>
              ) : (
                <button className="mt-3 w-full py-2 bg-[#FFD700] text-black font-bold rounded-lg text-sm hover:scale-[1.02] transition">Like</button>
              )}
            </div>
          </div>
        ))}
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
    getUser().then(setUser).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen bg-[#0B0215] flex items-center justify-center text-white text-xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0B0215] text-white">
      <Header user={user} isGuest={isGuest} />
      <HomeFeed user={user} isGuest={isGuest} />
      <Footer />
    </div>
  );
}
