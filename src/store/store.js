import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [createPersistedState()],
  // [변수들의 집합]
  state: {
    chatRoomName: null,
    chatOwner: null,
  },
  // [변수들을 조작하는 함수들]
  mutations: {
    setChatRoomName(state, chatRoomName) {
      state.chatRoomName = chatRoomName;
    },
    setChatOwner(state, id) {
      state.chatOwner = id;
    },
  },
  // [state의 변수들을 get 호출]
  getters: {
    getChatRoomName(state) {
      return state.chatRoomName;
    },
    getChatOwner(state) {
      return state.chatOwner;
    },
  },
});

export default store;
