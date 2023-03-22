import { MutationTree } from "vuex";
import { Network, State } from "./state";
import { Namespaced } from "../../types/vuex_types";

export enum MutationTypes {
  ADD_NETWORK = "ADD_NETWORK",
  SET_INITIAL_STATE = "SET_INITIAL_STATE",
  SET_SELECTED_NETWORK = "SET_SELECTED_NETWORK",
  SET_SELECTED_ADDRESS = "SET_SELECTED_ADDRESS",
}

export type Mutations<S = State> = {
  [MutationTypes.ADD_NETWORK](state: S, network: Network): void;
  [MutationTypes.SET_INITIAL_STATE](state: S, newInitialState: S): void;
  [MutationTypes.SET_SELECTED_NETWORK](state: S, networkId: string): void;
  [MutationTypes.SET_SELECTED_ADDRESS](
    state: S,
    payload: { networkId: string; address: string }
  ): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_INITIAL_STATE](state, newInitialState) {
    Object.assign(state, newInitialState);
  },
  [MutationTypes.ADD_NETWORK](state, network) {
    state.networks[network.id] = network;
  },
  [MutationTypes.SET_SELECTED_NETWORK](state, networkId) {
    state.selectedNetwork = networkId;
  },
  [MutationTypes.SET_SELECTED_ADDRESS](state, payload) {
    state.networks[payload.networkId] = {
      ...state.networks[payload.networkId],
      selectedAccount: payload.address,
    };
  },
};

export type NamespacedMutations = Namespaced<Mutations, "network">;
