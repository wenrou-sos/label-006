export const playDingSound = () => {
  try {
    const AudioContext =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const audioCtx = new AudioContext();

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
    oscillator.frequency.setValueAtTime(660, audioCtx.currentTime + 0.15);
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioCtx.currentTime + 0.6
    );

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.6);
  } catch (e) {
    console.warn("Audio not supported");
  }
};

export const speakCall = (ticketNumber: string, windowName: string) => {
  if (!("speechSynthesis" in window)) return;

  const chars = ticketNumber.split("").join(" ");
  const text = `请 ${chars} 号 ， 到 ${windowName} 办理业务`;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};

export const playCallNotification = (
  ticketNumber: string,
  windowName: string
) => {
  playDingSound();
  setTimeout(() => {
    speakCall(ticketNumber, windowName);
  }, 700);
};
