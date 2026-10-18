import "./Stopwatch.sass";

import { type FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { Icon } from "../../../icons";
import { API } from "../../types";
import { messages } from "./messages";
import { Data, defaultData, formatElapsed, getElapsed } from "./types";

const Stopwatch: FC<API<Data>> = ({ data = defaultData, setData }) => {
  const intl = useIntl();
  const [now, setNow] = useState(() => Date.now());
  const running = data.startedAt !== null;

  // Only tick while running; elapsed time is derived from the stored timestamps
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(timer);
  }, [running]);

  const start = () => {
    const time = Date.now();
    setNow(time);
    setData({ ...data, startedAt: time });
  };

  const stop = () => {
    const time = Date.now();
    setNow(time);
    setData({ ...data, elapsed: getElapsed(data, time), startedAt: null });
  };

  const reset = () => {
    setData({
      ...data,
      elapsed: 0,
      startedAt: running ? Date.now() : null,
    });
  };

  return (
    <div className="Stopwatch">
      {data.label && <div className="label">{data.label}</div>}
      <div className="elapsed">
        {formatElapsed(getElapsed(data, now), data.alwaysShowHours)}
      </div>
      <div className="controls">
        <button
          className="button button--primary control-btn"
          onClick={running ? stop : start}
          title={intl.formatMessage(running ? messages.stop : messages.start)}
        >
          <Icon name={running ? "feather:pause" : "feather:play"} />
        </button>
        {data.showReset && (
          <button
            className="button button--primary control-btn"
            onClick={reset}
            title={intl.formatMessage(messages.reset)}
          >
            <Icon name="feather:rotate-ccw" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Stopwatch;
