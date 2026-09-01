// backend/src/lib/clipMaker.js — AI Clip Maker logic
// Finds viral moments in videos and creates clips

export function getMockClips(videoUrl, prompt = "") {
  const idBase = (videoUrl || "jvXEkm27XOE").replace(/[^a-zA-Z0-9]/g,"").slice(-6) || "jvXEkm";
  return [
    {
      id: `clip_${idBase}_1`,
      title: "Viral Hook — First 3s punch",
      start: "00:03",
      end: "00:18",
      startSec: 3,
      endSec: 18,
      duration: "0:15",
      viralityScore: 96,
      reason: prompt || "High energy intro + direct question — retains 92% viewers",
      thumbnail: `https://img.youtube.com/vi/${idBase || "jvXEkm27XOE"}/hqdefault.jpg`,
      suggestedCaption: "This AI Avatar BEATS HeyGen 🤯 #viral #aivideo",
    },
    {
      id: `clip_${idBase}_2`,
      title: "Peak Insight Moment",
      start: "01:12",
      end: "01:42",
      startSec: 72,
      endSec: 102,
      duration: "0:30",
      viralityScore: 89,
      reason: "Core value prop explained clearly — ideal for TikTok/Reels",
      thumbnail: `https://img.youtube.com/vi/${idBase || "jvXEkm27XOE"}/mqdefault.jpg`,
      suggestedCaption: "You need this AI tool 🔥 #alphatekx #trending",
    },
    {
      id: `clip_${idBase}_3`,
      title: "CTA + Outro Loop",
      start: "02:05",
      end: "02:20",
      startSec: 125,
      endSec: 140,
      duration: "0:15",
      viralityScore: 84,
      reason: "Strong CTA + loopable ending — drives shares",
      thumbnail: `https://img.youtube.com/vi/${idBase || "jvXEkm27XOE"}/hqdefault.jpg`,
      suggestedCaption: "Link in bio 👇 #viralvideo #aiavatar",
    },
  ];
}

export async function createClip({ videoUrl, videoId, prompt, pro = false }) {
  if (!videoUrl && !videoId) throw new Error("videoUrl or videoId required");
  const url = videoUrl || `https://youtu.be/${videoId}`;
  // Simulate AI analysis delay
  await new Promise(r => setTimeout(r, 200));
  const clips = getMockClips(url, prompt);
  return {
    success: true,
    videoUrl: url,
    videoId: videoId || url.match(/(?:v=|\.be\/)([^&?]+)/)?.[1] || "jvXEkm27XOE",
    clips,
    meta: {
      model: "alphatekx-clip-v1",
      pro,
      generatedAt: new Date().toISOString(),
    }
  };
}
