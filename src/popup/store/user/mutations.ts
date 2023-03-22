import { MutationTree } from "vuex";
import { State } from "./state";
import { Namespaced } from "../../types/vuex_types";

export enum MutationTypes {
  SET_PASSWORD = "SET_PASSWORD",
  SET_PASSWORD_HASH = "SET_PASSWORD_HASH",
}

export type Mutations<S = State> = {
  [MutationTypes.SET_PASSWORD](state: S, password: string): void;
  [MutationTypes.SET_PASSWORD_HASH](state: S, passHash: string): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_PASSWORD](state, password) {
    state.password = password;
  },
  [MutationTypes.SET_PASSWORD_HASH](state, passHash) {
    state.passHash = passHash;
  },
};

export type NamespacedMutations = Namespaced<Mutations, "user">;
