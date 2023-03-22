import { MutationTree } from "vuex";
import { Account, State } from "./state";
import { Namespaced } from "../../types/vuex_types";

export enum MutationTypes {
  ADD_ACCOUNT = "ADD_ACCOUNT",
  SET_INITIAL_STATE = "SET_INITIAL_STATE",
}

export type Mutations<S = State> = {
  [MutationTypes.ADD_ACCOUNT](
    state: S,
    payload: { networkId: string; account: Account }
  ): void;
  [MutationTypes.SET_INITIAL_STATE](state: S, newInitialState: S): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_INITIAL_STATE](state, newInitialState) {
    Object.assign(state, newInitialState);
  },
  [MutationTypes.ADD_ACCOUNT](state, payload) {
    state.accounts[payload.networkId + payload.account.address] =
      payload.account;
  },
};

export type NamespacedMutations = Namespaced<Mutations, "account">;
