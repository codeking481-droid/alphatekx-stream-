import React, { useState } from "react";

export default function ThumbnailEnhancer({ isPro, onUpgrade }) {
  const [url, setUrl] = useState("https://img.youtube.com/vi/jvXEkm27XOE/hqdefault.jpg");
  const [style, setStyle] = useState("neon");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const enhance = async () => {
    if (!isPro) { onUpgrade && onUpgrade(); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/thumbnail/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-pro": isPro ? "true" : "false" },
        body: JSON.stringify({ thumbnailUrl: url, style, pro: isPro })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error);
      setResult(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="glass-card p-5 space-y-4 border border-white/10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#00FF88]/20 text-[#00FF88] flex items-center justify-center">🖼️</div>
        <div>
          <h3 className="font-bold text-white">Thumbnail Enhancer</h3>
          <p className="text-xs text-gray-400">Enhances thumbnails to 4K with neon glow</p>
        </div>
        {!isPro && <span className="ml-auto text-[10px] font-bold bg-[#FFD700] text-black px-2 py-1 rounded-full">PRO</span>}
      </div>
      <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://img.youtube.com/vi/..." className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white" />
      <select value={style} onChange={e=>setStyle(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white">
        <option value="neon">Neon Glow</option>
        <option value="4k">4K Upscale</option>
        <option value="cinematic">Cinematic</option>
      </select>
      <button onClick={enhance} disabled={loading} className={`w-full min-h-[44px] font-bold text-sm rounded-xl ${isPro ? "bg-gradient-to-r from-[#00FF88] to-[#00D9FF] text-black" : "bg-[#272727] text-gray-400 border border-[#FFD700]/20"}`}>
        {loading ? "Enhancing..." : isPro ? "Enhance to 4K ✨" : "Unlock with Pro 🔒"}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {result && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] text-gray-500 mb-1">Before</p>
            <img src={result.preview.before} alt="before" className="w-full aspect-video object-cover rounded-xl border border-white/10" />
          </div>
          <div>
            <p className="text-[10px] text-[#FFD700] mb-1">After • 4K Neon</p>
            <img src={result.preview.after} alt="after" className="w-full aspect-video object-cover rounded-xl border border-[#FFD700]/30 shadow-[0_0_20px_rgba(255,215,0,0.3)]" />
          </div>
        </div>
      )}
    </div>
  );
}
