import { TokenWallet } from "../../../classes/TokenWallet";
import { set, get } from "../../../utils/storage";
import { eth_mainnet, goerli_testnet, sepolia_testnet, ChainType } from "./helper/supported_chains";

export interface Network {
  name: string;
  endpoint: string;
  chainId: string;
  selectedAccount?: string;
  currency: string;
  active?: boolean;
  chaintype: ChainType,
  accounts: { [key: string]: TokenWallet }
}

export interface State {
  networks: Network[];
  selectedNetworkIdx: number;
}

export const getInitialState = (): State => {
  return {
    networks: [eth_mainnet, sepolia_testnet, goerli_testnet],
    selectedNetworkIdx: 0,
  };
};

export const PERSISTENCE_KEY = "allNetworks";
export const persistState = async (state: State): Promise<void> => {
  const stateStr = JSON.stringify(state);
  await set(PERSISTENCE_KEY, stateStr);
};
export const state = getInitialState();