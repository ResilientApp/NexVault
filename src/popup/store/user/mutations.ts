import { MutationTree } from "vuex";
import { State } from "./state";
import { Namespaced } from "../../types/vuex_types";

export enum MutationTypes {
  SET_PASSWORD = "SET_PASSWORD",
}

export type Mutations<S = State> = {
  [MutationTypes.SET_PASSWORD](state: S, password: string): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_PASSWORD](state, password) {
    state.password = password;
  },
};

export type NamespacedMutations = Namespaced<Mutations, "stats">;
