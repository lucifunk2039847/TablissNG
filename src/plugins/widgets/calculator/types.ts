export interface Data {
  history: string[];
  historyLength: number;
  showHistory: boolean;
}

export const MAX_HISTORY_LENGTH = 20;

export const defaultData: Data = {
  history: [],
  historyLength: 5,
  showHistory: true,
};
