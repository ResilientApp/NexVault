import {
  AugmentedActionContextWithDispatch,
  Namespaced,
} from "../../types/vuex_types";
import { Action, ActionTree } from "vuex";
import { Mutations, MutationTypes } from "./mutations";
import { PERSISTENCE_KEY, persistState, State } from "./state";
import { RootState } from "../index";
import { get } from "../../../utils/storage";
import { getNetworkStatus } from "../../api/network";
import { ChainType } from "./helper/supported_chains";
import { TokenWallet } from "../../../classes/TokenWallet";

export enum ActionTypes {
  INITIALIZE = "INITIALIZE",
  ADD_NETWORK = "ADD_NETWORK",
  ADD_ACCOUNT = "ADD_ACCOUNT",
  SET_SELECTED_ADDRESS = "SET_SELECTED_ADDRESS",
  SET_SELECTED_NETWORK = "SET_SELECTED_NETWORK",
  REFRESH_STATUS = "REFRESH_STATUS",
}

type ActionContextType = AugmentedActionContextWithDispatch<Mutations, State>;
type Actions = {
  [ActionTypes.INITIALIZE](actionContext: ActionContextType): Promise<void>;
  [ActionTypes.ADD_NETWORK](
    actionContext: ActionContextType,
    network: { name: string; endpoint: string }
  ): Promise<string | undefined>;
  [ActionTypes.SET_SELECTED_ADDRESS](
    actionContext: ActionContextType,
    payload: { networkId: number; address: string }
  ): Promise<void>;
  [ActionTypes.SET_SELECTED_NETWORK](
    actionContext: ActionContextType,
    payload: { networkId: number}
  ): Promise<void>;
  [ActionTypes.REFRESH_STATUS](
    actionContext: ActionContextType,
    networkId: number
  ): Promise<void>;
  [ActionTypes.ADD_ACCOUNT](
    actionContext: ActionContextType,
    payload: { wallet: TokenWallet }
  ): Promise<void>;
};

export const actions: ActionTree<State, RootState> & Actions = {
  async [ActionTypes.INITIALIZE]({ commit }) {
    try {
      const networkJsonStr = (await get(PERSISTENCE_KEY)) as string | undefined;
      if (!networkJsonStr) {
        return;
      }
      const networks = JSON.parse(networkJsonStr);
      commit(MutationTypes.SET_INITIAL_STATE, networks);
    } catch (e) {
      console.log(e);
    }
  },
  async [ActionTypes.ADD_NETWORK]({ commit, state }, network) {
    if (!network.name || !network.endpoint) {
      return "Invalid payload";
    }
    if (
      !network.endpoint.startsWith("http://") &&
      !network.endpoint.startsWith("https://")
    ) {
      return "Invalid Endpoint";
    }
    let currency = "UTXO";
    try {
      const networkStatus = await getNetworkStatus(network.endpoint);
      if (networkStatus.error) {
        return networkStatus.message;
      }
      currency = networkStatus?.network?.currency || currency;
    } catch (e) {
      return "Error fetching network status";
    }

    // allow user to create new networks?
    const newNetwork = {
      chainId: "NEW_ID",
      currency,
      active: true,
      ...network,
      accounts: {},
      chaintype: ChainType.RESILIENT,
    };

    commit(MutationTypes.ADD_NETWORK, newNetwork);
    if (!state.selectedNetworkIdx) {
      commit(MutationTypes.SET_SELECTED_NETWORK, state.networks.length - 1);
    }
    await persistState(state);
  },
  async [ActionTypes.ADD_ACCOUNT]({ commit, state }, payload) {
    if (state.networks[state.selectedNetworkIdx].accounts[payload.wallet.getAddress()])
      throw new Error("Account Already Exists Within Network")
    commit(MutationTypes.ADD_ACCOUNT, payload.wallet);
    commit(MutationTypes.SET_SELECTED_ADDRESS, {
      networkId: state.selectedNetworkIdx,
      address: payload.wallet.getAddress(),
    });
    await persistState(state);
  },
  async [ActionTypes.SET_SELECTED_ADDRESS]({ commit, state }, payload) {
    commit(MutationTypes.SET_SELECTED_ADDRESS, payload);
    await persistState(state);
  },
  async [ActionTypes.SET_SELECTED_NETWORK]({ commit, state }, payload) {
    commit(MutationTypes.SET_SELECTED_NETWORK, payload.networkId);
    await persistState(state);
  },
  async [ActionTypes.REFRESH_STATUS]({ commit, state }, selectedNetworkIdx) {
    const network = state.networks[selectedNetworkIdx];
    if (!network) {
      return;
    }
    let networkActive = true;
    try {
      const networkStatus = await getNetworkStatus(network.endpoint);
      if (networkStatus.error) {
        networkActive = false;
      }
    } catch (e) {
      networkActive = false;
    }
    // commit(MutationTypes.MODIFY_NETWORK, {
    //   networkId,
    //   partialNetwork: { active: networkActive },
    // });
  },
};

export type NamespacedActions = Namespaced<Actions, "network">;