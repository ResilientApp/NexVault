import { set } from "../../../utils/storage";

export interface Network {
  name: string;
  endpoint: string;
  id: string;
  selectedAccount?: string;
  currency: string;
}

export interface State {
  networks: { [key: string]: Network };
  selectedNetwork?: string;
}

export const getInitialState = (): State => {
  return {
    networks: {},
  };
};

export const PERSISTENCE_KEY = "allNetworks";
export const persistState = async (state: State): Promise<void> => {
  const stateStr = JSON.stringify(state);
  await set(PERSISTENCE_KEY, stateStr);
};
export const state = getInitialState();
