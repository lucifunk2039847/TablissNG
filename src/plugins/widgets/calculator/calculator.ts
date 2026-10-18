export type Operator = "+" | "-" | "*" | "/";

export type State = {
  /** The number currently being entered or the last result */
  display: string;
  /** The left-hand operand of a pending operation */
  operand: number | null;
  operator: Operator | null;
  /** Whether the next digit should replace the display */
  overwrite: boolean;
  error: boolean;
};

export type Action =
  | { type: "DIGIT"; digit: string }
  | { type: "DECIMAL" }
  | { type: "OPERATOR"; operator: Operator }
  | { type: "EQUALS" }
  | { type: "BACKSPACE" }
  | { type: "CLEAR" };

export type Result = {
  state: State;
  /** A completed calculation to record in the history */
  entry?: string;
};

export const initialState: State = {
  display: "0",
  operand: null,
  operator: null,
  overwrite: true,
  error: false,
};

export const operatorSymbols: Record<Operator, string> = {
  "+": "+",
  "-": "−",
  "*": "×",
  "/": "÷",
};

const MAX_DIGITS = 16;

/** Format a number, trimming floating point noise such as 0.1 + 0.2 */
export const formatNumber = (value: number) =>
  parseFloat(value.toPrecision(12)).toString();

const compute = (a: number, operator: Operator, b: number) => {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return a / b;
  }
};

const errorState: State = { ...initialState, display: "Error", error: true };

export function calculate(state: State, action: Action): Result {
  // Any input after an error starts fresh
  if (state.error && action.type !== "OPERATOR") {
    state = initialState;
  }

  switch (action.type) {
    case "DIGIT": {
      if (state.overwrite) {
        return { state: { ...state, display: action.digit, overwrite: false } };
      }
      if (state.display.replace(/[-.]/g, "").length >= MAX_DIGITS) {
        return { state };
      }
      const display =
        state.display === "0" ? action.digit : state.display + action.digit;
      return { state: { ...state, display } };
    }

    case "DECIMAL": {
      if (state.overwrite) {
        return { state: { ...state, display: "0.", overwrite: false } };
      }
      if (state.display.includes(".")) return { state };
      return { state: { ...state, display: state.display + "." } };
    }

    case "OPERATOR": {
      if (state.error) return { state };
      // Allow changing the operator before entering the next number
      if (state.operator && state.overwrite) {
        return { state: { ...state, operator: action.operator } };
      }
      // Chain operations, e.g. 2 + 3 + => 5 +
      let operand = parseFloat(state.display);
      if (state.operator && state.operand !== null) {
        operand = compute(state.operand, state.operator, operand);
        if (!Number.isFinite(operand)) return { state: errorState };
      }
      return {
        state: {
          display: formatNumber(operand),
          operand,
          operator: action.operator,
          overwrite: true,
          error: false,
        },
      };
    }

    case "EQUALS": {
      if (!state.operator || state.operand === null) return { state };
      const value = parseFloat(state.display);
      const result = compute(state.operand, state.operator, value);
      if (!Number.isFinite(result)) return { state: errorState };
      const display = formatNumber(result);
      return {
        state: { ...initialState, display },
        entry: `${formatNumber(state.operand)} ${operatorSymbols[state.operator]} ${formatNumber(value)} = ${display}`,
      };
    }

    case "BACKSPACE": {
      if (state.overwrite) return { state };
      const display = state.display.slice(0, -1);
      return {
        state: {
          ...state,
          display: display === "" || display === "-" ? "0" : display,
        },
      };
    }

    case "CLEAR":
      return { state: initialState };
  }
}
