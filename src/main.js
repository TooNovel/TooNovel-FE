import Vue from "vue";
import App from "./App.vue";

// router
import router from "./router";

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

new Vue({
  render: (h) => h(App),
  router,
}).$mount("#app");
