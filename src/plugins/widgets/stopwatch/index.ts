import { Config } from "../../types";
import { messages } from "./messages";
import Stopwatch from "./Stopwatch";
import StopwatchSettings from "./StopwatchSettings";
import { defaultData } from "./types";

const config: Config = {
  key: "widget/stopwatch",
  name: messages.name,
  description: messages.description,
  dashboardComponent: Stopwatch,
  settingsComponent: StopwatchSettings,
  defaultData,
};

export default config;
