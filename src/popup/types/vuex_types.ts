import { ActionContext, DispatchOptions } from "vuex";
import { RootState } from "../store";
import { AllNamespacedActions } from "../store/AllNamespacedX";

export type Namespaced<T, N extends string> = {
  [P in keyof T & string as `${N}/${P}`]: T[P];
};

type objectHavingFunctions = { [key: string]: (...args: any) => unknown };
export type AugmentedActionContextWithDispatch<
  T extends objectHavingFunctions,
  S,
  V extends objectHavingFunctions
> = {
  commit<K extends keyof T>(
    key: K,
    payload: Parameters<T[K]>[1]
  ): ReturnType<T[K]>;
  dispatch<K extends keyof AllNamespacedActions | keyof V>(
    action: K,
    payload: Parameters<V[K]>[1] | undefined,
    options?: DispatchOptions
  ): ReturnType<V[K]>;
} & Omit<ActionContext<S, RootState>, "commit" | "dispatch">;

export type AugmentedActionContext<T extends objectHavingFunctions, S> = {
  commit<K extends keyof T>(
    key: K,
    payload: Parameters<T[K]>[1]
  ): ReturnType<T[K]>;
} & Omit<ActionContext<S, RootState>, "commit" | "dispatch">;
