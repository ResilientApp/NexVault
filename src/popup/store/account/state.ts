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
  address: string;
  privateKey: string;
  activity: Activity[];
  balance?: number;
  mnemonic: string;
}

export interface State {
  accounts: Account[];
  curAccountIdx: number;
}

export const getInitialState = (): State => {
  return {
    accounts: [],
    curAccountIdx: 0
  };
};

export const PERSISTENCE_KEY = "allAccounts";
export const persistState = async (
  state: State,
  password: string
): Promise<void> => {
  // Strip state to remove reactivity.
  let strippedState: State = JSON.parse(JSON.stringify(state));
  // exit if empty
  if (!strippedState.accounts.length) return
  strippedState.accounts = await Promise.all(strippedState.accounts?.map(async ({address, privateKey, activity, balance, mnemonic}) => ({
    address, privateKey: await aesGcmEncrypt(privateKey, password), activity, balance, mnemonic
  })))
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
  // if empty return nothing
  if (!loadedState.accounts.length) return;
  loadedState.accounts = await Promise.all(loadedState.accounts?.map(async ({address, privateKey, activity, balance, mnemonic}) => ({
    address, privateKey: await aesGcmDecrypt(privateKey, password), activity, balance, mnemonic
  })))
  return loadedState;
};
export const state = getInitialState();