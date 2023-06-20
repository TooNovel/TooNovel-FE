import Vue from "vue";
import App from "./App.vue";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";

// router
import router from "./router";

// store
import store from "./store/store";

// bootstrap
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import { Carousel3d, Slide } from "vue-carousel-3d";
import infiniteScroll from "vue-infinite-scroll";

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(Carousel3d, Slide);
Vue.use(infiniteScroll);
Vue.config.productionTip = false;

Vue.prototype.$getTokenInfo = function (accessToken) {
  if (!(accessToken == null)) {
    const { userId, role } = jwtDecode(accessToken);
    const tokenInfo = {
      userId: userId,
      role: role,
    };
    return tokenInfo;
  }
};

Vue.prototype.$getAccessToken = function () {
  const accessToken = Cookies.get("accessTokenCookie");
  return accessToken;
};

new Vue({
  render: (h) => h(App),
  router,
  store,
}).$mount("#app");
