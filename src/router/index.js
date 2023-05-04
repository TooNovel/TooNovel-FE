import Vue from "vue";
import Router from "vue-router";

import MainPage from "@/views/MainPage.vue";
import Login from "@/views/LoginPage.vue";
import Join from "@/views/JoinPage.vue";
import Community from "@/views/CommunityPage.vue";
import PostWritePage from "@/views/PostWritePage.vue";
import WorkDetailPage from "@/views/WorkDetailPage.vue";

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
    {
      path: "/community/write",
      name: "PostWritePage",
      component: PostWritePage,
    },
    {
      path: "/work/detailView/:novel_id",
      name: "WorkDetailPage",
      component: WorkDetailPage,
    },
  ],
});
