import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [createPersistedState()],
  // [변수들의 집합]
  state: {
    chatRoomName: null,
  },
  // [변수들을 조작하는 함수들]
  mutations: {
    setChatRoomName(state, chatRoomName) {
      state.chatRoomName = chatRoomName;
    },
  },
  // [state의 변수들을 get 호출]
  getters: {
    getChatRoomName(state) {
      return state.chatRoomName;
    },
  },
});

export default store;
