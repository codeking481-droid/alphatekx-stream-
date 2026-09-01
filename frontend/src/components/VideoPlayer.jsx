import React, { useState, useEffect, useRef } from "react";
import "../styles/index.css";

export default function VideoPlayer({ video, autoplay = false, theatreMode = false }) {
  const DEFAULT_ID = 'jvXEkm27XOE';
  const id = video?.youtubeId || video?.id || DEFAULT_ID;
  const isDefault = id === DEFAULT_ID || video?.featured || autoplay;
  const autoplayParams = isDefault ? "&autoplay=1&mute=1&playsinline=1" : "";
  const title = video?.title || "This AI Avatar BEATS HeyGen 10 TIMES!";
  const [idle, setIdle] = useState(false);
  const idleRef = useRef(null);

  useEffect(() => {
    let t;
    const reset = () => {
      setIdle(false);
      clearTimeout(t);
      t = setTimeout(() => setIdle(true), 2500);
    };
    reset();
    window.addEventListener("mousemove", reset);
    return () => {
      clearTimeout(t);
      window.removeEventListener("mousemove", reset);
    };
  }, []);

  const Wrapper = ({ children }) => theatreMode ? (
    <div className="player-theatre">{children}</div>
  ) : <>{children}</>;

  // PROMPT #4: Clean player UI — dark #0B0215, minimal, mobile full-width, watermark, hide on idle
  return (
    <Wrapper>
      <div className={`player-container relative aspect-video w-full max-w-[100vw] overflow-hidden bg-[#0B0215] border border-[#272727] ${theatreMode ? "" : "rounded-2xl sm:rounded-2xl rounded-none"} shadow-2xl group ${idle ? "player-idle" : ""}`}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?enablejsapi=1&modestbranding=1&rel=0${autoplayParams}`}
          title={title}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        {/* Subtle AlphaTekx watermark — optional branding */}
        <div className="player-watermark">● AlphaTekx</div>
        {/* Minimal overlay — theatre toggle hint, hides on idle */}
        <div className="player-overlay absolute top-3 left-3 right-3 flex justify-between pointer-events-none">
          <span className="bg-[#0B0215]/70 backdrop-blur text-[#FFD700] text-[10px] font-bold px-2 py-1 rounded-full border border-[#FFD700]/20">AlphaTekx • Premium</span>
        </div>
      </div>
    </Wrapper>
  );
}
