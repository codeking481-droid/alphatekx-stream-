import React, { useState } from "react";

const LANGS = ["Pidgin", "Yoruba", "Igbo", "Hausa", "English"];

export default function VoiceTranslator({ isPro, onUpgrade }) {
  const [videoUrl, setVideoUrl] = useState("https://youtu.be/jvXEkm27XOE");
  const [lang, setLang] = useState("Pidgin");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const translate = async () => {
    if (!isPro) { onUpgrade && onUpgrade(); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/voice/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-pro": isPro ? "true" : "false" },
        body: JSON.stringify({ videoUrl, targetLang: lang, pro: isPro })
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
        <div className="w-10 h-10 rounded-xl bg-[#A855F7]/20 text-[#A855F7] flex items-center justify-center">🎙️</div>
        <div>
          <h3 className="font-bold text-white">Voice Over Translator</h3>
          <p className="text-xs text-gray-400">Translates audio to Pidgin/Yoruba/Igbo/Hausa</p>
        </div>
        {!isPro && <span className="ml-auto text-[10px] font-bold bg-[#FFD700] text-black px-2 py-1 rounded-full">PRO</span>}
      </div>
      <input value={videoUrl} onChange={e=>setVideoUrl(e.target.value)} placeholder="https://youtu.be/jvXEkm27XOE" className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white" />
      <select value={lang} onChange={e=>setLang(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white">
        {LANGS.map(l => <option key={l} value={l}>{l}</option>)}
      </select>
      <button onClick={translate} disabled={loading} className={`w-full min-h-[44px] font-bold text-sm rounded-xl ${isPro ? "bg-gradient-to-r from-[#A855F7] to-[#FFD700] text-black" : "bg-[#272727] text-gray-400 border border-[#FFD700]/20"}`}>
        {loading ? "Translating..." : isPro ? `Translate to ${lang} 🌍` : "Unlock with Pro 🔒"}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {result && (
        <div className="bg-black/40 border border-white/10 rounded-xl p-3 space-y-2">
          <p className="text-xs text-[#FFD700] font-bold">{result.targetLang} Translation</p>
          <p className="text-sm text-white">{result.translatedText}</p>
          <audio controls src={result.audioUrl} className="w-full mt-2" />
          <a href={result.audioUrl} target="_blank" rel="noreferrer" className="text-[11px] text-[#00D9FF] underline">Download audio • {result.audioUrl.slice(-12)}</a>
        </div>
      )}
    </div>
  );
}
