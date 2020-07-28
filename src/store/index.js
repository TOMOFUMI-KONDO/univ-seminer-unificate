import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    status: "",
    loading: false,
  },
  mutations: {
    onUserStatusChanged(state, status) {
      state.status = status;
    },
    onLoadingStateChanged(state, loadingState) {
      state.loading = loadingState;
    },
  },
  getters: {
    userStatus(state) {
      return state.status;
    },
    isLoading(state) {
      return state.loading;
    },
  },
});

export default store;
