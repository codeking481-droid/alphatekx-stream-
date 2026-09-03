import React from "react";
import "../styles/index.css";

export default function VideoPlayer({ video, autoplay = false, theatreMode = false }) {
  const DEFAULT_ID = 'jvXEkm27XOE';
  const id = video?.youtubeId || video?.id || DEFAULT_ID;
  const isDefault = id === DEFAULT_ID || video?.featured || autoplay;
  const autoplayParams = isDefault ? "&autoplay=1&mute=1&playsinline=1" : "";
  const title = video?.title || "This AI Avatar BEATS HeyGen 10 TIMES!";

  const Wrapper = ({ children }) => theatreMode ? (
    <div className="player-theatre">{children}</div>
  ) : <>{children}</>;

  // PROMPT 2: Watch page video clean like YouTube + expand + remove clutter — ONLY iframe, no overlay inside player, edge-to-edge on phone, breathing space below handled by parent
  return (
    <Wrapper>
      <div className={`watch-video-player player-container relative aspect-video w-full max-w-[100vw] overflow-hidden bg-black ${theatreMode ? "" : "md:rounded-2xl md:border md:border-white/10 rounded-none border-0"} shadow-2xl`}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?enablejsapi=1&modestbranding=1&rel=0&controls=1&fs=1&iv_load_policy=3&cc_load_policy=0&playsinline=1${autoplayParams}`}
          title={title}
          className="w-full h-full absolute inset-0 border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </Wrapper>
  );
}
