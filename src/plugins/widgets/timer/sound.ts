let context: AudioContext | undefined;

/**
 * Shared audio context. Create it from a click handler where possible, as
 * browsers keep contexts created without user interaction suspended.
 */
export const getAudioContext = () => {
  if (!context) context = new AudioContext();
  if (context.state === "suspended") void context.resume();
  return context;
};

/** Play two short, soft beeps */
const beep = (ctx: AudioContext) => {
  for (const offset of [0, 0.25]) {
    const start = ctx.currentTime + offset;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    // Fade in and out to avoid clicks
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.08, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);

    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.2);
  }
};

/** Whether the context is (or shortly becomes) allowed to play */
const whenRunning = (ctx: AudioContext) =>
  ctx.state === "running"
    ? Promise.resolve(true)
    : Promise.race([
        ctx.resume().then(() => ctx.state === "running"),
        new Promise<boolean>((resolve) => setTimeout(resolve, 1000, false)),
      ]);

const LOCK_NAME = "tablissng-timer-alarm";

/**
 * Beep every 1.5 seconds until the returned function is called. When several
 * tabs are open, a lock makes sure only one of them beeps at a time.
 */
export const startAlarm = () => {
  const ctx = getAudioContext();
  const controller = new AbortController();

  const play = () =>
    new Promise<void>((resolve) => {
      if (controller.signal.aborted) return resolve();
      beep(ctx);
      const timer = setInterval(() => beep(ctx), 1500);
      controller.signal.addEventListener("abort", () => {
        clearInterval(timer);
        resolve();
      });
    });

  // Tabs whose audio is blocked stay out of the lock so a tab that can play wins
  void whenRunning(ctx).then((canPlay) => {
    if (!canPlay || controller.signal.aborted) return;
    if (navigator.locks) {
      navigator.locks
        .request(LOCK_NAME, { signal: controller.signal }, play)
        .catch(() => undefined);
    } else {
      void play();
    }
  });

  return () => controller.abort();
};
