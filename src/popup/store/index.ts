import {
  createStore,
  Store as VuexStore,
  DispatchOptions,
  useStore,
} from "vuex";
import { module as user, State as UserState } from "./user";

import { AllNamespacedActions, AllNamespacedMutations } from "./AllNamespacedX";

export interface RootState {
  user: UserState;
}

export default createStore<RootState>({
  modules: {
    user,
  },
});

export type RootStoreType = Omit<
  VuexStore<RootState>,
  "dispatch" | "commit"
> & {
  dispatch<K extends keyof AllNamespacedActions>(
    key: K,
    payload: Parameters<AllNamespacedActions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<AllNamespacedActions[K]>;

  commit<K extends keyof AllNamespacedMutations>(
    key: K,
    payload: Parameters<AllNamespacedMutations[K]>[1]
  ): ReturnType<AllNamespacedMutations[K]>;
};

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: RootStoreType;
  }
}

export function useRootStore(): RootStoreType {
  return useStore<RootState>();
}
