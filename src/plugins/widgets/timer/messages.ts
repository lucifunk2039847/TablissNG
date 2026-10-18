import { defineMessages } from "react-intl";

export const messages = defineMessages({
  name: {
    id: "plugins.timer.name",
    defaultMessage: "Timer",
    description: "Name of the Timer widget",
  },
  description: {
    id: "plugins.timer.description",
    defaultMessage: "Count down from a set time, with an optional alarm.",
    description: "Description of the Timer widget",
  },
  defaultMessage: {
    id: "plugins.timer.defaultMessage",
    defaultMessage: "Time's up!",
    description: "Shown when the timer finishes and no custom message is set",
  },
  message: {
    id: "plugins.timer.message",
    defaultMessage: "Finished message",
    description: "Input label for the message shown when the timer finishes",
  },
  hours: {
    id: "plugins.timer.hours",
    defaultMessage: "Hours",
    description: "Label of the timer hours input",
  },
  minutes: {
    id: "plugins.timer.minutes",
    defaultMessage: "Minutes",
    description: "Label of the timer minutes input",
  },
  seconds: {
    id: "plugins.timer.seconds",
    defaultMessage: "Seconds",
    description: "Label of the timer seconds input",
  },
  start: {
    id: "plugins.timer.start",
    defaultMessage: "Start",
    description: "Title of the button that starts or resumes the timer",
  },
  pause: {
    id: "plugins.timer.pause",
    defaultMessage: "Pause",
    description: "Title of the button that pauses the timer",
  },
  reset: {
    id: "plugins.timer.reset",
    defaultMessage: "Reset",
    description: "Title of the button that resets the timer",
  },
  playSound: {
    id: "plugins.timer.playSound",
    defaultMessage: "Beep when finished",
    description:
      "Checkbox label for playing a repeating beep when the timer finishes",
  },
  startCollapsed: {
    id: "plugins.timer.startCollapsed",
    defaultMessage: "Start collapsed",
    description:
      "Checkbox label for showing only the timer button until it is clicked",
  },
  expand: {
    id: "plugins.timer.expand",
    defaultMessage: "Expand",
    description: "Title of the button that expands the timer",
  },
  collapse: {
    id: "plugins.timer.collapse",
    defaultMessage: "Collapse",
    description: "Title of the button that collapses the timer",
  },
});
