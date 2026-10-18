import { Config } from "../../types";
import { messages } from "./messages";
import Timer from "./Timer";
import TimerSettings from "./TimerSettings";
import { defaultData } from "./types";

const config: Config = {
  key: "widget/timer",
  name: messages.name,
  description: messages.description,
  dashboardComponent: Timer,
  settingsComponent: TimerSettings,
  defaultData,
};

export default config;
