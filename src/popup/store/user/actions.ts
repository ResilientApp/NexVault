import {
  AugmentedActionContextWithDispatch,
  Namespaced,
} from "../../types/vuex_types";
import { ActionTree } from "vuex";
import { Mutations, MutationTypes } from "./mutations";
import { State } from "./state";
import { RootState } from "../index";

export enum ActionTypes {
  SET_VAULT_PASSWORD = "SET_VAULT_PASSWORD",
}

type ActionContextType = AugmentedActionContextWithDispatch<
  Mutations,
  State,
  Actions
>;
type Actions = {
  [ActionTypes.SET_VAULT_PASSWORD](
    actionContext: ActionContextType,
    payload: { password: string }
  ): Promise<void>;
};

export const actions: ActionTree<State, RootState> & Actions = {
  async [ActionTypes.SET_VAULT_PASSWORD]({ commit }, payload) {},
};

export type NamespacedActions = Namespaced<Actions, "user">;
