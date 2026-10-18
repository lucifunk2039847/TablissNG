import type { FC } from "react";
import { FormattedMessage } from "react-intl";

import { API } from "../../types";
import { messages } from "./messages";
import { Data, defaultData, MAX_HISTORY_LENGTH } from "./types";

const CalculatorSettings: FC<API<Data>> = ({ data = defaultData, setData }) => {
  const setHistoryLength = (value: number) => {
    const historyLength = Math.min(
      MAX_HISTORY_LENGTH,
      Math.max(1, Math.round(value) || 1),
    );
    setData({
      ...data,
      historyLength,
      history: data.history.slice(-historyLength),
    });
  };

  return (
    <div className="CalculatorSettings">
      <label>
        <input
          type="checkbox"
          checked={data.showHistory}
          onChange={(event) =>
            setData({ ...data, showHistory: event.target.checked })
          }
        />{" "}
        <FormattedMessage {...messages.showHistory} />
      </label>

      {data.showHistory && (
        <label>
          <FormattedMessage {...messages.historyLength} />
          <input
            type="number"
            min={1}
            max={MAX_HISTORY_LENGTH}
            value={data.historyLength}
            onChange={(event) =>
              setHistoryLength(parseFloat(event.target.value))
            }
          />
        </label>
      )}
    </div>
  );
};

export default CalculatorSettings;
