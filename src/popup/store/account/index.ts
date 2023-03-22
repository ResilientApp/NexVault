export * from "./mutations";
export * from "./state";
export * from "./actions";

import { state } from "./state";
import { mutations } from "./mutations";
import { actions } from "./actions";

export const module = {
  namespaced: true,
  state,
  mutations,
  actions,
};
