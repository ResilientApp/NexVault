import {
  AugmentedActionContextWithDispatch,
  Namespaced,
} from "../../types/vuex_types";
import { ActionTree } from "vuex";
import { Mutations, MutationTypes } from "./mutations";
import { PERSISTENCE_KEY, persistState, State } from "./state";
import { RootState } from "../index";
import { get } from "../../../utils/storage";
import { v4 as uuidv4 } from "uuid";
import { getNetworkStatus } from "../../api/network";

export enum ActionTypes {
  INITIALIZE = "INITIALIZE",
  ADD_NETWORK = "ADD_NETWORK",
  SET_SELECTED_ADDRESS = "SET_SELECTED_ADDRESS",
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
    payload: { networkId: string; address: string }
  ): Promise<void>;
  [ActionTypes.REFRESH_STATUS](
    actionContext: ActionContextType,
    networkId: string
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
    const newNetwork = { id: uuidv4(), currency, active: true, ...network };
    commit(MutationTypes.ADD_NETWORK, newNetwork);
    if (!state.selectedNetwork) {
      commit(MutationTypes.SET_SELECTED_NETWORK, newNetwork.id);
    }
    await persistState(state);
  },
  async [ActionTypes.SET_SELECTED_ADDRESS]({ commit, state }, payload) {
    commit(MutationTypes.SET_SELECTED_ADDRESS, payload);
    await persistState(state);
  },
  async [ActionTypes.REFRESH_STATUS]({ commit, state }, networkId) {
    const network = state.networks[networkId];
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
    commit(MutationTypes.MODIFY_NETWORK, {
      networkId,
      partialNetwork: { active: networkActive },
    });
  },
};

export type NamespacedActions = Namespaced<Actions, "network">;
