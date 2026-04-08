let cached = null;

function pickEnglishVoice() {
  const list = window.speechSynthesis?.getVoices?.() || [];
  return (
    list.find(v => /en-(US|GB|AU|CA|IN)/i.test(v.lang)) ||
    list.find(v => /en/i.test(v.lang)) ||
    null
  );
}

export function speakEN(text) {
  try {
    if (!text) return;
    const u = new SpeechSynthesisUtterance(text);
    if (!cached) {
      cached = pickEnglishVoice();
      if (!cached) {
        window.speechSynthesis.onvoiceschanged = () => {
          cached = pickEnglishVoice();
        };
      }
    }
    if (cached) {
      u.voice = cached;
      u.lang = cached.lang;
    } else {
      u.lang = "en-US";
    }
    u.rate = 1.0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {}
}
