import Vue from "vue";
import Router from "vue-router";

import MainPage from "@/views/MainPage.vue";
import Login from "@/views/LoginPage.vue";
import Join from "@/views/JoinPage.vue";
import Community from "@/views/CommunityPage.vue";
import PostWritePage from "@/views/PostWritePage.vue";
import NovelDetailPage from "@/views/NovelDetailPage.vue";
import ReviewTotalPage from "@/views/ReviewTotalPage.vue";
import RecommendPage from "@/views/RecommendPage.vue";
import NovelViewPage from "@/views/NovelViewPage.vue";
import UserLikeNovelPage from "@/views/UserLikeNovelPage.vue";

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
      path: "/novel/detailView/:novel_id",
      name: "NovelDetailPage",
      component: NovelDetailPage,
    },
    {
      path: "/reviews",
      component: ReviewTotalPage,
      name: "reviews",
      props: true,
    },
    {
      path: "/recommend",
      name: "RecommendPage",
      component: RecommendPage,
    },
    {
      path: "/novels",
      component: NovelViewPage,
      name: "novels",
    },
    {
      path: "/novelLike",
      component: UserLikeNovelPage,
      name: "novelLike",
    },
  ],
});
