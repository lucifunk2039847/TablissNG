import "./Timer.sass";

import { type FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { Icon } from "../../../icons";
import { API } from "../../types";
import { messages } from "./messages";
import { getAudioContext, startAlarm } from "./sound";
import {
  Data,
  defaultData,
  formatRemaining,
  getRemaining,
  joinDuration,
  MAX_HOURS,
  splitDuration,
} from "./types";

const Timer: FC<API<Data>> = ({ data = defaultData, setData }) => {
  const intl = useIntl();
  const [expanded, setExpanded] = useState(!data.startCollapsed);
  const [now, setNow] = useState(() => Date.now());

  const running = data.endsAt !== null;
  const started = running || data.remaining !== null;
  const remaining = getRemaining(data, now);
  const done = running && remaining === 0;
  const showHours = data.duration >= 3600 * 1000;
  const message = data.message || intl.formatMessage(messages.defaultMessage);

  // Only tick while counting down; remaining time is derived from the stored end time
  useEffect(() => {
    if (!running || done) return;
    const timer = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(timer);
  }, [running, done]);

  // Keep beeping until the timer is reset
  useEffect(() => {
    if (!done || !data.playSound) return;
    return startAlarm();
  }, [done, data.playSound]);

  const start = () => {
    // Unlock audio while we have a user click, so the alarm can play later
    if (data.playSound) getAudioContext();
    const time = Date.now();
    setNow(time);
    setData({
      ...data,
      endsAt: time + getRemaining(data, time),
      remaining: null,
    });
  };

  const pause = () => {
    const time = Date.now();
    setNow(time);
    setData({ ...data, remaining: getRemaining(data, time), endsAt: null });
  };

  const reset = () => setData({ ...data, remaining: null, endsAt: null });

  const { hours, minutes, seconds } = splitDuration(data.duration);
  const setDuration = (h: number, m: number, s: number) =>
    setData({ ...data, duration: joinDuration(h, m, s) });

  const durationInput = (
    value: number,
    max: number,
    label: string,
    onChange: (value: number) => void,
  ) => (
    <input
      type="number"
      min={0}
      max={max}
      value={value}
      aria-label={label}
      title={label}
      onChange={(event) =>
        onChange(
          Math.min(
            max,
            Math.max(0, Math.floor(Number(event.target.value)) || 0),
          ),
        )
      }
    />
  );

  const controlButton = (
    title: string,
    icon: string,
    onClick: () => void,
    disabled = false,
  ) => (
    <button
      className="button button--primary control-btn"
      onClick={onClick}
      title={title}
      disabled={disabled}
    >
      <Icon name={icon} />
    </button>
  );

  return (
    <div className={`Timer${done ? " done" : ""}`}>
      <button
        className="button button--primary toggle"
        onClick={() => setExpanded(!expanded)}
        title={intl.formatMessage(
          expanded ? messages.collapse : messages.expand,
        )}
      >
        <span className="label">{intl.formatMessage(messages.name)}</span>
        {/* Keep a started timer visible while collapsed */}
        {!expanded && started && (
          <span className="time">
            {done ? message : formatRemaining(remaining, showHours)}
          </span>
        )}
        <Icon name={expanded ? "feather:chevron-up" : "feather:chevron-down"} />
      </button>

      {expanded && (
        <>
          {done ? (
            <div className="message">{message}</div>
          ) : started ? (
            <div className="remaining">
              {formatRemaining(remaining, showHours)}
            </div>
          ) : (
            <div className="duration">
              {durationInput(
                hours,
                MAX_HOURS,
                intl.formatMessage(messages.hours),
                (h) => setDuration(h, minutes, seconds),
              )}
              <span>:</span>
              {durationInput(
                minutes,
                59,
                intl.formatMessage(messages.minutes),
                (m) => setDuration(hours, m, seconds),
              )}
              <span>:</span>
              {durationInput(
                seconds,
                59,
                intl.formatMessage(messages.seconds),
                (s) => setDuration(hours, minutes, s),
              )}
            </div>
          )}

          <div className="controls">
            {!done &&
              (running
                ? controlButton(
                    intl.formatMessage(messages.pause),
                    "feather:pause",
                    pause,
                  )
                : controlButton(
                    intl.formatMessage(messages.start),
                    "feather:play",
                    start,
                    data.duration === 0,
                  ))}
            {started &&
              controlButton(
                intl.formatMessage(messages.reset),
                "feather:rotate-ccw",
                reset,
              )}
          </div>
        </>
      )}
    </div>
  );
};

export default Timer;
