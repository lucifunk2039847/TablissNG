import { defineMessages } from "react-intl";

export const messages = defineMessages({
  name: {
    id: "plugins.calculator.name",
    defaultMessage: "Calculator",
    description: "Name of the Calculator widget",
  },
  description: {
    id: "plugins.calculator.description",
    defaultMessage: "A simple calculator with a short history.",
    description: "Description of the Calculator widget",
  },
  error: {
    id: "plugins.calculator.error",
    defaultMessage: "Error",
    description:
      "Shown on the calculator display when a calculation is invalid, such as dividing by zero",
  },
  clear: {
    id: "plugins.calculator.clear",
    defaultMessage: "Clear",
    description: "Title of the button that clears the calculator",
  },
  backspace: {
    id: "plugins.calculator.backspace",
    defaultMessage: "Delete last digit",
    description: "Title of the button that deletes the last entered digit",
  },
  clearHistory: {
    id: "plugins.calculator.clearHistory",
    defaultMessage: "Clear history",
    description: "Title of the button that clears the calculation history",
  },
  showHistory: {
    id: "plugins.calculator.showHistory",
    defaultMessage: "Show history",
    description: "Checkbox label for toggling the calculation history",
  },
  historyLength: {
    id: "plugins.calculator.historyLength",
    defaultMessage: "History length",
    description: "Label for the number of past calculations to keep",
  },
  startCollapsed: {
    id: "plugins.calculator.startCollapsed",
    defaultMessage: "Start collapsed",
    description:
      "Checkbox label for showing only the calculator button until it is clicked",
  },
  expand: {
    id: "plugins.calculator.expand",
    defaultMessage: "Expand",
    description: "Title of the button that expands the calculator",
  },
  collapse: {
    id: "plugins.calculator.collapse",
    defaultMessage: "Collapse",
    description: "Title of the button that collapses the calculator",
  },
});
