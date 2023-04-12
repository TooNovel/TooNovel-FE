import Vue from "vue";
import Router from "vue-router";

import MainPage from "@/components/MainPage.vue";
import Login from "@/views/LoginPage.vue";
import Join from "@/views/JoinPage.vue";
import Community from "@/components/CommunityPage.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Main",
      component: MainPage,
    },
    {
      path: "/login",
      name: "LoginPage",
      component: Login,
    },
    {
      path: "/join",
      name: "JoinPage",
      component: Join,
    },
    {
      path: "/community",
      name: "Community",
      component: Community,
    },
  ],
});
