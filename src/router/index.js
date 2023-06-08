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
import NovelSearchPage from "@/views/NovelSearchPage";
import WriterPage from "@/views/WriterPage.vue";
import AdminPage from "@/views/AdminPage.vue";
import MyPage from "@/views/MyPage.vue";
import MyReview from "@/views/MyReview.vue";
import MyLikeNovel from "@/views/MyLikeNovel.vue";
import FanclubPage from "@/views/FanclubPage";
import PostDetailPage from "@/views/PostDetailPage";

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
      path: "/novel/:novel_id",
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
    {
      path: "/search",
      name: "search",
      component: NovelSearchPage,
    },
    {
      path: "/writer",
      name: "writer",
      component: WriterPage,
    },
    {
      path: "/admin",
      name: "admin",
      component: AdminPage,
    },
    {
      path: "/mypage",
      name: "MyPage",
      component: MyPage,
    },
    {
      path: "/myReview",
      name: "MyReview",
      component: MyReview,
    },
    {
      path: "/myLikeNovel",
      name: "MyLikeNovel",
      component: MyLikeNovel,
    },
    {
      path: "/fanclub",
      name: "fanclub",
      component: FanclubPage,
    },
    {
      path: "/community/:postId",
      name: "PostDetailPage",
      component: PostDetailPage,
    },
  ],
});
