import React, { useState } from "react";

export default function ClipMaker({ isPro, onUpgrade }) {
  const [videoUrl, setVideoUrl] = useState("https://youtu.be/jvXEkm27XOE");
  const [prompt, setPrompt] = useState("find viral moment when loss reaches 0.01");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const generate = async () => {
    if (!isPro) { onUpgrade && onUpgrade(); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/clips/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-pro": isPro ? "true" : "false" },
        body: JSON.stringify({ videoUrl, prompt, pro: isPro })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Clip generation failed");
      setResult(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="glass-card p-5 space-y-4 border border-white/10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#FFD700]/20 text-[#FFD700] flex items-center justify-center">✂️</div>
        <div>
          <h3 className="font-bold text-white">AI Clip Maker</h3>
          <p className="text-xs text-gray-400">Finds viral moments & creates clips</p>
        </div>
        {!isPro && <span className="ml-auto text-[10px] font-bold bg-[#FFD700] text-black px-2 py-1 rounded-full">PRO</span>}
      </div>
      <input value={videoUrl} onChange={e=>setVideoUrl(e.target.value)} placeholder="https://youtu.be/jvXEkm27XOE" className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white" />
      <input value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="find viral moment when..." className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white" />
      <button onClick={generate} disabled={loading} className={`w-full min-h-[44px] font-bold text-sm rounded-xl ${isPro ? "bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black" : "bg-[#272727] text-gray-400 border border-[#FFD700]/20"} `}>
        {loading ? "Generating..." : isPro ? "Generate Viral Clips ✂️" : "Unlock with Pro 🔒"}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {result && (
        <div className="space-y-2">
          {result.clips.map(c => (
            <div key={c.id} className="bg-black/40 border border-white/10 rounded-xl p-3 flex gap-3">
              <img src={c.thumbnail} alt={c.title} className="w-20 h-14 object-cover rounded-lg" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{c.title}</p>
                <p className="text-xs text-gray-400">{c.start} → {c.end} • {c.duration} • Score {c.viralityScore}</p>
                <p className="text-[11px] text-gray-500 line-clamp-1">{c.reason}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
