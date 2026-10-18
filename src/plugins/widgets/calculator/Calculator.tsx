import "./Calculator.sass";

import { type FC, type KeyboardEvent, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { Icon } from "../../../icons";
import { API } from "../../types";
import {
  Action,
  calculate,
  formatNumber,
  initialState,
  Operator,
  operatorSymbols,
} from "./calculator";
import { messages } from "./messages";
import { Data, defaultData } from "./types";

const keyActions: Record<string, Action> = {
  ".": { type: "DECIMAL" },
  ",": { type: "DECIMAL" },
  "+": { type: "OPERATOR", operator: "+" },
  "-": { type: "OPERATOR", operator: "-" },
  "*": { type: "OPERATOR", operator: "*" },
  x: { type: "OPERATOR", operator: "*" },
  "/": { type: "OPERATOR", operator: "/" },
  "=": { type: "EQUALS" },
  Enter: { type: "EQUALS" },
  Backspace: { type: "BACKSPACE" },
  Escape: { type: "CLEAR" },
  Delete: { type: "CLEAR" },
  c: { type: "CLEAR" },
};

const Calculator: FC<API<Data>> = ({ data = defaultData, setData }) => {
  const intl = useIntl();
  const [expanded, setExpanded] = useState(!data.startCollapsed);
  const [state, setState] = useState(initialState);

  const dispatch = (action: Action) => {
    const result = calculate(state, action);
    setState(result.state);
    if (result.entry) {
      setData({
        ...data,
        history: [...data.history, result.entry].slice(-data.historyLength),
      });
    }
  };

  // Keyboard input only applies while the calculator has focus
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    const action = /^\d$/.test(event.key)
      ? ({ type: "DIGIT", digit: event.key } as const)
      : keyActions[event.key];
    if (!action) return;

    // Stop dashboard shortcuts and native button activation on Enter
    event.preventDefault();
    event.stopPropagation();
    dispatch(action);
  };

  const digit = (value: string) => (
    <button
      className="button button--secondary"
      onClick={() => dispatch({ type: "DIGIT", digit: value })}
    >
      {value}
    </button>
  );

  const operator = (value: Operator) => (
    <button
      className={`button button--primary${state.operator === value && state.overwrite ? " active" : ""}`}
      onClick={() => dispatch({ type: "OPERATOR", operator: value })}
    >
      {operatorSymbols[value]}
    </button>
  );

  const history = data.history.slice(-data.historyLength);

  return (
    <div className="Calculator">
      <button
        className="button button--primary toggle"
        onClick={() => setExpanded(!expanded)}
        title={intl.formatMessage(
          expanded ? messages.collapse : messages.expand,
        )}
      >
        <FormattedMessage {...messages.name} />
        <Icon name={expanded ? "feather:chevron-up" : "feather:chevron-down"} />
      </button>

      {expanded && (
        <div className="body" tabIndex={0} onKeyDown={handleKeyDown}>
          {data.showHistory && history.length > 0 && (
            <div className="history">
              <button
                className="clear-history"
                onClick={() => setData({ ...data, history: [] })}
                title={intl.formatMessage(messages.clearHistory)}
              >
                <Icon name="feather:trash-2" />
              </button>
              {history.map((entry, index) => (
                <div key={index} className="entry">
                  {entry}
                </div>
              ))}
            </div>
          )}

          <div className="screen">
            <div className="pending">
              {state.operator && state.operand !== null
                ? `${formatNumber(state.operand)} ${operatorSymbols[state.operator]}`
                : " "}
            </div>
            <div className="display">
              {state.error ? (
                <FormattedMessage {...messages.error} />
              ) : (
                state.display
              )}
            </div>
          </div>

          <div className="keys">
            <button
              className="button button--secondary wide"
              onClick={() => dispatch({ type: "CLEAR" })}
              title={intl.formatMessage(messages.clear)}
            >
              C
            </button>
            <button
              className="button button--secondary"
              onClick={() => dispatch({ type: "BACKSPACE" })}
              title={intl.formatMessage(messages.backspace)}
            >
              <Icon name="feather:delete" />
            </button>
            {operator("/")}

            {digit("7")}
            {digit("8")}
            {digit("9")}
            {operator("*")}

            {digit("4")}
            {digit("5")}
            {digit("6")}
            {operator("-")}

            {digit("1")}
            {digit("2")}
            {digit("3")}
            {operator("+")}

            <button
              className="button button--secondary wide"
              onClick={() => dispatch({ type: "DIGIT", digit: "0" })}
            >
              0
            </button>
            <button
              className="button button--secondary"
              onClick={() => dispatch({ type: "DECIMAL" })}
            >
              .
            </button>
            <button
              className="button button--primary"
              onClick={() => dispatch({ type: "EQUALS" })}
            >
              =
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;
