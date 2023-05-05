import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [createPersistedState()],
  // [변수들의 집합]
  state: {
    accessToken: null,
    refreshToken: null,
  },
  // [변수들을 조작하는 함수들]
  mutations: {
    setAccessToken(state, accessToken) {
      state.accessToken = accessToken;
    },
    setRefreshToken(state, refreshToken) {
      state.refreshToken = refreshToken;
    },
  },
  // [state의 변수들을 get 호출]
  getters: {
    getAccessToken(state) {
      return state.accessToken;
    },
    getRefreshToken(state) {
      return state.refreshToken;
    },
  },
});

export default store;
