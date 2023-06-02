import { isDevMode } from "../../../utils/utils";

export interface State {
  password?: string;
  passHash?: string;
}

const enableDevAutoLogin = true;
export const getInitialState = (): State => {
  if (enableDevAutoLogin && isDevMode()) {
    return {};
  }
  return {};
};

export const state = getInitialState();