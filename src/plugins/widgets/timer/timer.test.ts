import {
  defaultData,
  formatRemaining,
  getRemaining,
  joinDuration,
  splitDuration,
} from "./types";

describe("timer", () => {
  it("should join and split durations", () => {
    const ms = joinDuration(1, 2, 3);
    expect(ms).toBe(3723000);
    expect(splitDuration(ms)).toEqual({ hours: 1, minutes: 2, seconds: 3 });
  });

  it("should round partial seconds up", () => {
    expect(splitDuration(1)).toEqual({ hours: 0, minutes: 0, seconds: 1 });
    expect(formatRemaining(59001, false)).toBe("01:00");
    expect(formatRemaining(0, false)).toBe("00:00");
  });

  it("should only show hours when needed or asked", () => {
    expect(formatRemaining(90000, false)).toBe("01:30");
    expect(formatRemaining(90000, true)).toBe("00:01:30");
    expect(formatRemaining(joinDuration(2, 0, 5), false)).toBe("02:00:05");
  });

  it("should get the remaining time for each state", () => {
    const data = { ...defaultData, duration: 60000 };
    expect(getRemaining(data, 0)).toBe(60000);
    expect(getRemaining({ ...data, remaining: 15000 }, 0)).toBe(15000);
    expect(getRemaining({ ...data, endsAt: 10000 }, 4000)).toBe(6000);
    expect(getRemaining({ ...data, endsAt: 10000 }, 20000)).toBe(0);
  });
});
