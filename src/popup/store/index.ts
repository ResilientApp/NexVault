import { Store } from "vuex";

// Create a new store instance.
export default new Store({
  state() {
    return {
      count: 1,
    };
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
});
