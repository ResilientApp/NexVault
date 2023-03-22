import {
  AugmentedActionContextWithDispatch,
  Namespaced,
} from "../../types/vuex_types";
import { ActionTree } from "vuex";
import { Mutations, MutationTypes } from "./mutations";
import { State } from "./state";
import { RootState } from "../index";
import { get, set } from "../../../utils/storage";
import bgComm from "../../api/BackgroundComm";
import { sha3_512 } from "js-sha3";

export enum ActionTypes {
  SET_VAULT_PASSWORD = "SET_VAULT_PASSWORD",
  INITIALIZE = "INITIALIZE",
  LOGIN = "LOGIN",
}

type ActionContextType = AugmentedActionContextWithDispatch<
  Mutations,
  State,
  Actions
>;
type Actions = {
  [ActionTypes.INITIALIZE](actionContext: ActionContextType): Promise<void>;
  [ActionTypes.SET_VAULT_PASSWORD](
    actionContext: ActionContextType,
    payload: { password: string }
  ): Promise<void>;
  [ActionTypes.LOGIN](
    actionContext: ActionContextType,
    payload: { password: string }
  ): Promise<boolean>;
};

export const actions: ActionTree<State, RootState> & Actions = {
  async [ActionTypes.INITIALIZE]({ commit }) {
    const passHash = (await get("passHash")) as string | undefined;
    await bgComm.waitToConnect();
    const pass = await bgComm.getPassword();
    if (passHash) {
      commit(MutationTypes.SET_PASSWORD_HASH, passHash);
    }
    if (pass) {
      commit(MutationTypes.SET_PASSWORD, pass);
    }
  },
  async [ActionTypes.SET_VAULT_PASSWORD]({ commit }, payload) {
    const passHash = sha3_512(payload.password);
    await set("passHash", passHash);
    commit(MutationTypes.SET_PASSWORD, payload.password);
    commit(MutationTypes.SET_PASSWORD_HASH, passHash);
    await bgComm.storePassword(payload.password);
  },
  async [ActionTypes.LOGIN]({ commit, state }, payload) {
    const passHash = sha3_512(payload.password);
    if (state.passHash != passHash) {
      return false;
    }
    commit(MutationTypes.SET_PASSWORD, payload.password);
    await bgComm.storePassword(payload.password);
    return true;
  },
};

export type NamespacedActions = Namespaced<Actions, "user">;
