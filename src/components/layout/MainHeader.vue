<template>
  <b-navbar
    class="navbar d-flex justify-content-between align-items-center"
    type="dark"
    variant="dark"
    id="header"
  >
    <b-navbar-nav>
      <b-navbar-brand style="font-size: 25px" href="/" tag="h1"
        >ㅤTooNovel</b-navbar-brand
      >
      <b-nav-item style="font-size: 20px">랭킹</b-nav-item>
      <b-nav-item style="font-size: 20px">
        <button @click="getAllReview()">리뷰</button>
      </b-nav-item>
      <b-nav-item style="font-size: 20px">추천</b-nav-item>
      <b-nav-item style="font-size: 20px">작품찾기</b-nav-item>
      <b-nav-item style="font-size: 20px" @click="toCommunity()"
        >커뮤니티</b-nav-item
      >
      <b-nav-item style="font-size: 20px">팬클럽</b-nav-item>
    </b-navbar-nav>

    <b-navbar-nav class="right">
      <b-nav-form class="mt-1" style="margin-right: 10px" id="searchForm">
        <input placeholder="작품을 검색하세요!" type="text" />
        <b-button size="sm" class="my-2 my-sm-0">검색</b-button>
      </b-nav-form>
      <div v-if="accessToken">
        <b-nav-form class="mt-1">
          <b-button
            size="sm"
            @click="goToLogin()"
            id="loginBtn"
            style="margin-right: 20px"
            variant="primary"
          >
            마이페이지
          </b-button>
          <b-button
            size="sm"
            @click="logout()"
            id="loginBtn"
            style="margin-right: 20px"
            variant="primary"
          >
            로그아웃
          </b-button>
        </b-nav-form>
      </div>
      <div v-else>
        <b-nav-form class="mt-1">
          <b-button
            size="sm"
            @click="goToLogin()"
            id="loginBtn"
            style="margin-right: 20px"
            variant="primary"
          >
            로그인
          </b-button>
        </b-nav-form>
      </div>
    </b-navbar-nav>
  </b-navbar>
</template>
<script>
import axios from "axios";
import Cookies from "js-cookie";

export default {
  data() {
    return {
      message: "MainHeader",
      accessToken: this.$store.getters.getAccessToken,
    };
  },
  methods: {
    getAllReview() {
      axios.get("/api/v1/review/0").then((data) => {
        this.$router.push({
          name: "reviews",
          params: data,
        });
      });
    },
    goToLogin() {
      this.$router.push("/login");
    },
    // 추후 구현 예정
    logout() {
      document.cookie = "accessTokenCookie=; path=/;";
      document.cookie = "refreshTokenCookie=; path=/;";
      this.$store.commit("setAccessToken", null);
      this.$store.commit("setRefreshToken", null);
      window.location.href = "/";
    },
    toCommunity() {
      this.$router.push("/community");
    },
  },
  mounted() {
    const token = Cookies.get("accessTokenCookie");
    this.$store.commit("setAccessToken", token);
    this.accessToken = this.$store.getters.getAccessToken;
    console.log("header - accesstoken : " + this.$store.getters.getAccessToken);
  },
};
</script>

<style scoped>
#header {
  font-family: "Hanna";
}

#searchForm {
  display: flex;
  align-items: center;
}
</style>
