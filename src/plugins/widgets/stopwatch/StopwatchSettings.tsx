import type { FC } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { API } from "../../types";
import { messages } from "./messages";
import { Data, defaultData } from "./types";

const StopwatchSettings: FC<API<Data>> = ({ data = defaultData, setData }) => {
  const intl = useIntl();

  return (
    <div className="StopwatchSettings">
      <label>
        <FormattedMessage {...messages.label} />
        <input
          type="text"
          value={data.label}
          onChange={(event) => setData({ ...data, label: event.target.value })}
          placeholder={intl.formatMessage(messages.labelPlaceholder)}
        />
      </label>

      <label>
        <input
          type="checkbox"
          checked={data.alwaysShowHours}
          onChange={(event) =>
            setData({ ...data, alwaysShowHours: event.target.checked })
          }
        />{" "}
        <FormattedMessage {...messages.alwaysShowHours} />
      </label>

      <label>
        <input
          type="checkbox"
          checked={data.showReset}
          onChange={(event) =>
            setData({ ...data, showReset: event.target.checked })
          }
        />{" "}
        <FormattedMessage {...messages.showReset} />
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

export default StopwatchSettings;
