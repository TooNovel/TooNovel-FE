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
import AdminPage from "@/views/AdminPage.vue";
import MyPage from "@/views/MyPage.vue";
import MyReview from "@/views/MyReview.vue";
import MyLikeNovel from "@/views/MyLikeNovel.vue";
import FanclubPage from "@/views/FanclubPage";
import PostDetailPage from "@/views/PostDetailPage";
import AuthorNovelPage from "@/views/AuthorNovelPage.vue";
import EnrollAuthorPage from "@/views/EnrollAuthorPage.vue";
import NovelStatisticsPage from "@/views/NovelStatisticsPage.vue";
import AdminUserPage from "@/views/AdminUserPage";
import AdminAuthorPage from "@/views/AdminAuthorPage";
import NovelRequestPage from "@/views/NovelRequestPage";
import RankingPage from "@/views/RankingPage.vue";
import AdminModelUpdatePage from "@/views/AdminModelUpdatePage.vue";
import ChatRoom from "@/views/ChatRoom";
import ChatWindow from "@/views/ChatWindow";

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
    {
      path: "/author",
      name: "AuthorNovelPage",
      component: AuthorNovelPage,
    },
    {
      path: "/enroll",
      name: "EnrollAuthorPage",
      component: EnrollAuthorPage,
    },
    {
      path: "/statistics",
      name: "NovelStatisticsPage",
      component: NovelStatisticsPage,
    },
    {
      path: "/admin/user",
      name: "AdminUserPage",
      component: AdminUserPage,
    },
    {
      path: "/admin/author",
      name: "AdminAuthorPage",
      component: AdminAuthorPage,
    },
    {
      path: "/post/request",
      name: "NovelRequestPage",
      component: NovelRequestPage,
    },
    {
      path: "/ranking",
      name: "ranking",
      component: RankingPage,
    },
    {
      path: "/model",
      name: "model",
      component: AdminModelUpdatePage,
    },
    {
      path: "/chatRoom",
      component: ChatRoom,
      name: "ChatRoom",
      meta: { hideHeaderFooter: true },
    },
    {
      path: "/chatWindow/:roomId",
      component: ChatWindow,
      name: "ChatWindow",
      meta: { hideHeaderFooter: true },
    },
  ],
});
