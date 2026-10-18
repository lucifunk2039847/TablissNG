export interface Data {
  /** Duration entered by the user, in milliseconds */
  duration: number;
  /** Milliseconds left while paused, or null when not started */
  remaining: number | null;
  /** Timestamp the current run finishes at, or null when not running */
  endsAt: number | null;
  message: string;
  playSound: boolean;
  startCollapsed: boolean;
}

export const MAX_HOURS = 99;

export const defaultData: Data = {
  duration: 5 * 60 * 1000,
  remaining: null,
  endsAt: null,
  message: "",
  playSound: true,
  startCollapsed: true,
};

/** Milliseconds left at the given time */
export const getRemaining = (data: Data, now: number) =>
  data.endsAt !== null
    ? Math.max(0, data.endsAt - now)
    : (data.remaining ?? data.duration);

/** Split milliseconds into whole hours, minutes and seconds, rounding up */
export const splitDuration = (ms: number) => {
  const totalSeconds = Math.ceil(Math.max(0, ms) / 1000);
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
};

/** Combine hours, minutes and seconds into milliseconds */
export const joinDuration = (hours: number, minutes: number, seconds: number) =>
  ((hours * 60 + minutes) * 60 + seconds) * 1000;

/** Format milliseconds as [H:]MM:SS, rounding up so 00:00 only shows when done */
export const formatRemaining = (ms: number, showHours: boolean) => {
  const { hours, minutes, seconds } = splitDuration(ms);
  const pad = (value: number) => value.toString().padStart(2, "0");
  const mmss = `${pad(minutes)}:${pad(seconds)}`;

  return hours > 0 || showHours ? `${pad(hours)}:${mmss}` : mmss;
};
