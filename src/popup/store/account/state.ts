import { get, set } from "../../../utils/storage";
import { aesGcmDecrypt, aesGcmEncrypt } from "../../../utils/my_crypto";

export interface Activity {
  id: number;
  type: "send" | "receive" | "tx";
  timestamp: number;
  amount: number;
  address: string;
  meta?: string;
}

export interface Account {
  networkId: string;
  address: string;
  privateKey: string;
  activity: Activity[];
  balance?: number;
}

export interface State {
  accounts: { [key: string]: Account };
}

export const getInitialState = (): State => {
  return {
    accounts: {},
  };
};

export const PERSISTENCE_KEY = "alLAccounts";
export const persistState = async (
  state: State,
  password: string
): Promise<void> => {
  // Strip state to remove reactivity.
  const strippedState: State = JSON.parse(JSON.stringify(state));
  const accountIDs = Object.keys(strippedState.accounts);
  for (const accountId of accountIDs) {
    const account = strippedState.accounts[accountId];
    account.privateKey = await aesGcmEncrypt(account.privateKey, password);
  }
  await set(PERSISTENCE_KEY, JSON.stringify(strippedState));
};

export const loadPersistedState = async (
  password: string
): Promise<State | undefined> => {
  const state = (await get(PERSISTENCE_KEY)) as string | undefined;
  if (!state) {
    return;
  }
  const loadedState: State = JSON.parse(state);
  const accountIDs = Object.keys(loadedState.accounts);
  for (const accountId of accountIDs) {
    const account = loadedState.accounts[accountId];
    account.privateKey = await aesGcmDecrypt(account.privateKey, password);
  }
  return loadedState;
};
export const state = getInitialState();
