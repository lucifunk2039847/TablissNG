import { Config } from "../../types";
import Calculator from "./Calculator";
import CalculatorSettings from "./CalculatorSettings";
import { messages } from "./messages";
import { defaultData } from "./types";

const config: Config = {
  key: "widget/calculator",
  name: messages.name,
  description: messages.description,
  dashboardComponent: Calculator,
  settingsComponent: CalculatorSettings,
  defaultData,
};

export default config;
