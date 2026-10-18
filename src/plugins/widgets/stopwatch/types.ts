export interface Data {
  label: string;
  /** Milliseconds accumulated before the current run */
  elapsed: number;
  /** Timestamp the current run started at, or null when stopped */
  startedAt: number | null;
  alwaysShowHours: boolean;
  showReset: boolean;
}

export const defaultData: Data = {
  label: "",
  elapsed: 0,
  startedAt: null,
  alwaysShowHours: true,
  showReset: true,
};

/** Total elapsed milliseconds at the given time */
export const getElapsed = (data: Data, now: number) =>
  data.elapsed + (data.startedAt === null ? 0 : now - data.startedAt);

/** Format milliseconds as [H:]MM:SS */
export const formatElapsed = (ms: number, alwaysShowHours: boolean) => {
  const totalSeconds = Math.floor(Math.max(0, ms) / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const mmss = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return hours > 0 || alwaysShowHours
    ? `${hours.toString().padStart(2, "0")}:${mmss}`
    : mmss;
};
