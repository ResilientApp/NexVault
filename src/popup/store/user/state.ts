export interface State {
  password?: string;
  passHash?: string;
}

export const getInitialState = (): State => {
  return {};
};

export const state = getInitialState();
