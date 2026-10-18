import { Action, calculate, initialState, State } from "./calculator";

/** Run a sequence of key presses, collecting history entries */
const run = (keys: string) => {
  let state: State = initialState;
  const entries: string[] = [];

  for (const key of keys.split(" ")) {
    let action: Action;
    if (/^\d$/.test(key)) action = { type: "DIGIT", digit: key };
    else if (key === ".") action = { type: "DECIMAL" };
    else if (key === "=") action = { type: "EQUALS" };
    else if (key === "<") action = { type: "BACKSPACE" };
    else if (key === "C") action = { type: "CLEAR" };
    else action = { type: "OPERATOR", operator: key as "+" | "-" | "*" | "/" };

    const result = calculate(state, action);
    state = result.state;
    if (result.entry) entries.push(result.entry);
  }

  return { state, entries };
};

describe("calculator", () => {
  it("should enter digits", () => {
    expect(run("1 2 3").state.display).toBe("123");
    expect(run("0 0 5").state.display).toBe("5");
  });

  it("should enter decimals once", () => {
    expect(run(". 5").state.display).toBe("0.5");
    expect(run("1 . 2 . 3").state.display).toBe("1.23");
  });

  it("should add, subtract, multiply and divide", () => {
    expect(run("2 + 3 =").state.display).toBe("5");
    expect(run("2 - 3 =").state.display).toBe("-1");
    expect(run("4 * 2 . 5 =").state.display).toBe("10");
    expect(run("9 / 4 =").state.display).toBe("2.25");
  });

  it("should trim floating point noise", () => {
    expect(run(". 1 + . 2 =").state.display).toBe("0.3");
  });

  it("should chain operations", () => {
    expect(run("2 + 3 * 4 =").state.display).toBe("20");
  });

  it("should replace operator when pressed twice", () => {
    expect(run("6 + * 2 =").state.display).toBe("12");
  });

  it("should record history entries on equals", () => {
    expect(run("2 + 3 = 4 * 5 =").entries).toEqual(["2 + 3 = 5", "4 × 5 = 20"]);
  });

  it("should continue from a result", () => {
    const { state, entries } = run("2 + 3 = + 1 =");
    expect(state.display).toBe("6");
    expect(entries[1]).toBe("5 + 1 = 6");
  });

  it("should error on division by zero and recover", () => {
    const { state, entries } = run("1 / 0 =");
    expect(state.error).toBe(true);
    expect(state.display).toBe("Error");
    expect(entries).toEqual([]);
    expect(run("1 / 0 = 7").state.display).toBe("7");
  });

  it("should backspace and clear", () => {
    expect(run("1 2 3 <").state.display).toBe("12");
    expect(run("5 < <").state.display).toBe("0");
    expect(run("1 + 2 C").state).toEqual(initialState);
  });

  it("should ignore equals without an operation", () => {
    expect(run("4 =").state.display).toBe("4");
  });
});
