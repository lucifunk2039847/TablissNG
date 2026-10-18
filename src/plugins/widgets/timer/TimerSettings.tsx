import type { FC } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { API } from "../../types";
import { messages } from "./messages";
import { Data, defaultData } from "./types";

const TimerSettings: FC<API<Data>> = ({ data = defaultData, setData }) => {
  const intl = useIntl();

  return (
    <div className="TimerSettings">
      <label>
        <FormattedMessage {...messages.message} />
        <input
          type="text"
          value={data.message}
          onChange={(event) =>
            setData({ ...data, message: event.target.value })
          }
          placeholder={intl.formatMessage(messages.defaultMessage)}
        />
      </label>

      <label>
        <input
          type="checkbox"
          checked={data.playSound}
          onChange={(event) =>
            setData({ ...data, playSound: event.target.checked })
          }
        />{" "}
        <FormattedMessage {...messages.playSound} />
      </label>

      <label>
        <input
          type="checkbox"
          checked={data.startCollapsed}
          onChange={(event) =>
            setData({ ...data, startCollapsed: event.target.checked })
          }
        />{" "}
        <FormattedMessage {...messages.startCollapsed} />
      </label>
    </div>
  );
};

export default TimerSettings;
