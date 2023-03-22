import { ActionContext, DispatchOptions } from "vuex";
import { RootState } from "../store";
import { AllNamespacedActions } from "../store/AllNamespacedX";

export type Namespaced<T, N extends string> = {
  [P in keyof T & string as `${N}/${P}`]: T[P];
};

type objectHavingFunctions = { [key: string]: (...args: any) => unknown };
export type AugmentedActionContextWithDispatch<
  T extends objectHavingFunctions,
  S
> = {
  commit<K extends keyof T>(
    key: K,
    payload: Parameters<T[K]>[1]
  ): ReturnType<T[K]>;
  dispatch<K extends keyof AllNamespacedActions>(
    key: K,
    payload: Parameters<AllNamespacedActions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<AllNamespacedActions[K]>;
} & Omit<ActionContext<S, RootState>, "commit" | "dispatch">;

export type AugmentedActionContext<T extends objectHavingFunctions, S> = {
  commit<K extends keyof T>(
    key: K,
    payload: Parameters<T[K]>[1]
  ): ReturnType<T[K]>;
} & Omit<ActionContext<S, RootState>, "commit" | "dispatch">;
