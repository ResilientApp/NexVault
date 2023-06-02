import { RootState } from "../index";
import { GetterTree } from "vuex";
import store from "../index";

export const stateGetters: GetterTree<RootState, RootState> | undefined = {
  getUserPassword(state): string {
    if (!state.user.password) throw new Error("Assertion user password exists failed");
    return state.user.password;
  },
  getUserPassHash(state): string | undefined {
    return state.user.passHash;
  },
  getSelectedAccountAddress(): any {
    return store.getters.getCurrentNetwork.selectedAccount
  },
  getNetworks(state) : any {
    return state.network.networks
  },
  getCurrentNetworkIdx(state) : any {
    return state.network.selectedNetworkIdx
  },
  getCurrentNetwork() : any {
    return store.getters.getNetworks[store.getters.getCurrentNetworkIdx]
  },
  getAllAccountsOnNetwork() : any {
    return store.getters.getCurrentNetwork.accounts
  },
  getCurrentAccountOnNetwork(): any {
    return store.getters.getAllAccountsOnNetwork[store.getters.getSelectedAccountAddress]
  }
};