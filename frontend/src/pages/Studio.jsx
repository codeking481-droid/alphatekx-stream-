import React, { useState } from "react";
import ClipMaker from "../components/ClipMaker.jsx";
import ThumbnailEnhancer from "../components/ThumbnailEnhancer.jsx";
import VoiceTranslator from "../components/VoiceTranslator.jsx";

export default function Studio({ isPro, onUpgrade }) {
  const [active, setActive] = useState("clip");

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="glass-card p-6 text-center space-y-2 border border-[#FFD700]/20">
        <h1 className="text-2xl font-extrabold text-white">AI Studio — Creator Toolkit</h1>
        <p className="text-sm text-gray-400">Premium AI features — Pro users only. Clip Maker • Thumbnail 4K • Voice Over Naija</p>
        {!isPro && (
          <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-xl p-3 text-xs text-[#FFD700]">
            🔒 AI features are Pro-only. <button onClick={onUpgrade} className="underline font-bold">Upgrade to Pro</button> to unlock all tools.
          </div>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {[
          { id: "clip", label: "✂️ Clip Maker" },
          { id: "thumb", label: "🖼️ Thumbnail 4K" },
          { id: "voice", label: "🎙️ Voice Translator" },
        ].map(t => (
          <button key={t.id} onClick={()=>setActive(t.id)} className={`min-h-[44px] px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap ${active===t.id ? "bg-[#FFD700] text-black" : "bg-[#272727] text-gray-300"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {active === "clip" && <ClipMaker isPro={isPro} onUpgrade={onUpgrade} />}
      {active === "thumb" && <ThumbnailEnhancer isPro={isPro} onUpgrade={onUpgrade} />}
      {active === "voice" && <VoiceTranslator isPro={isPro} onUpgrade={onUpgrade} />}

      {!isPro && (
        <div className="glass-card p-4 border border-[#FFD700]/20 text-center space-y-2">
          <p className="text-sm text-white font-bold">Unlock AI Studio</p>
          <p className="text-xs text-gray-400">Get unlimited clips, 4K thumbnails, and Naija voice overs</p>
          <button onClick={onUpgrade} className="min-h-[44px] px-6 py-2.5 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold text-sm rounded-xl">Upgrade to Pro — ₦5,000/mo</button>
        </div>
      )}
    </div>
  );
}
