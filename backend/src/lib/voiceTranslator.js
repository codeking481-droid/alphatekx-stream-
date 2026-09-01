// backend/src/lib/voiceTranslator.js — AI Voice Over Translator to Pidgin/Yoruba/Igbo/Hausa

const LANGUAGES = ["Pidgin", "Yoruba", "Igbo", "Hausa", "English"];

const mockTranslations = {
  Pidgin: {
    text: "Dis AI avatar dey beat HeyGen well well — e dey talk like real human, e dey move natural, and e dey cost 10 times less! 🇳🇬",
    audioUrl: "https://cdn.alphatekx.ai/voice/pidgin_jvXEkm27XOE.mp3",
  },
  Yoruba: {
    text: "Avatar AI yi ju HeyGen lọ ni igba mẹwa — o nsọ̀rọ̀ bi eniyan gidi, o n gbe ara rẹ̀ bi ẹda, ati owo rẹ̀ kere pupọ!",
    audioUrl: "https://cdn.alphatekx.ai/voice/yoruba_jvXEkm27XOE.mp3",
  },
  Igbo: {
    text: "AI avatar a karịrị HeyGen ugboro iri — ọ na-ekwu okwu dị ka mmadụ, mmegharị ya dị mma, ọnụ ahịa dị ọnụ ala!",
    audioUrl: "https://cdn.alphatekx.ai/voice/igbo_jvXEkm27XOE.mp3",
  },
  Hausa: {
    text: "Wannan avatar na AI ya fi HeyGen sau goma — yana magana kamar mutum na gaske, yana motsi mai kyau, kuma farashinsa yayi rahusa!",
    audioUrl: "https://cdn.alphatekx.ai/voice/hausa_jvXEkm27XOE.mp3",
  },
  English: {
    text: "This AI avatar beats HeyGen 10 times — it talks like a real human, moves naturally, and costs 10 times less!",
    audioUrl: "https://cdn.alphatekx.ai/voice/english_jvXEkm27XOE.mp3",
  }
};

export async function translateVoice({ videoUrl, videoId, targetLang = "Pidgin", sourceLang = "auto", pro = false }) {
  if (!videoUrl && !videoId) throw new Error("videoUrl or videoId required");
  const lang = LANGUAGES.includes(targetLang) ? targetLang : "Pidgin";
  const url = videoUrl || `https://youtu.be/${videoId}`;
  await new Promise(r => setTimeout(r, 300));
  const mock = mockTranslations[lang] || mockTranslations.Pidgin;
  return {
    success: true,
    videoUrl: url,
    videoId: videoId || url.match(/(?:v=|\.be\/)([^&?]+)/)?.[1] || "jvXEkm27XOE",
    sourceLang: sourceLang === "auto" ? "English" : sourceLang,
    targetLang: lang,
    translatedText: mock.text,
    audioUrl: mock.audioUrl,
    // For frontend player: use same youtube embed with lang param
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId || "jvXEkm27XOE"}?lang=${lang.toLowerCase()}`,
    meta: {
      model: "alphatekx-voice-naija-v2",
      pro,
      generatedAt: new Date().toISOString(),
    }
  };
}

export { LANGUAGES };
