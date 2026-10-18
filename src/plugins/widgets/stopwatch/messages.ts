import { defineMessages } from "react-intl";

export const messages = defineMessages({
  name: {
    id: "plugins.stopwatch.name",
    defaultMessage: "Stopwatch",
    description: "Name of the Stopwatch widget",
  },
  description: {
    id: "plugins.stopwatch.description",
    defaultMessage: "A simple stopwatch you can start, stop and reset.",
    description: "Description of the Stopwatch widget",
  },
  label: {
    id: "plugins.stopwatch.label",
    defaultMessage: "Label",
    description: "Input label for giving the stopwatch a name",
  },
  labelPlaceholder: {
    id: "plugins.stopwatch.labelPlaceholder",
    defaultMessage: "What are you timing?",
    description: "Placeholder text inside the stopwatch label input field",
  },
  alwaysShowHours: {
    id: "plugins.stopwatch.alwaysShowHours",
    defaultMessage: "Always show hours",
    description:
      "Checkbox label for always displaying the hours, even when zero",
  },
  showReset: {
    id: "plugins.stopwatch.showReset",
    defaultMessage: "Show reset button",
    description: "Checkbox label for toggling visibility of the reset button",
  },
  start: {
    id: "plugins.stopwatch.start",
    defaultMessage: "Start",
    description: "Title of the button that starts the stopwatch",
  },
  stop: {
    id: "plugins.stopwatch.stop",
    defaultMessage: "Stop",
    description: "Title of the button that stops the stopwatch",
  },
  reset: {
    id: "plugins.stopwatch.reset",
    defaultMessage: "Reset",
    description: "Title of the button that resets the stopwatch",
  },
  startCollapsed: {
    id: "plugins.stopwatch.startCollapsed",
    defaultMessage: "Start collapsed",
    description:
      "Checkbox label for showing only the stopwatch button until it is clicked",
  },
  expand: {
    id: "plugins.stopwatch.expand",
    defaultMessage: "Expand",
    description: "Title of the button that expands the stopwatch",
  },
  collapse: {
    id: "plugins.stopwatch.collapse",
    defaultMessage: "Collapse",
    description: "Title of the button that collapses the stopwatch",
  },
});
