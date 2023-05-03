import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  //state : 애플리케이션의 전역 상태를 저장하는 객체
  state: {
    accessToken: null,
  },
  //mutations : 상태를 변경하는 함수, 상태를 직접 변경하지 핞고 mutation을 통해 변경
  mutations: {
    setToken(state, accessToken) {
      state.accessToken = accessToken;
    },
  },
  getters: {
    getToken(state) {
      return state.token === null ? 0 : 1;
    },
    getUserInfo(state) {
      return state.userInfo;
    },
    getSub(state) {
      return state.sub;
    },
  },
});

export default store;
