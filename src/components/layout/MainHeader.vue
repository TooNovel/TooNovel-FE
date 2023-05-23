<template>
  <b-navbar
    class="navbar d-flex justify-content-between align-items-center"
    type="dark"
    variant="dark"
    id="header"
  >
    <b-navbar-nav>
      <b-navbar-brand href="/"
        >&nbsp;&nbsp;<img src="/TooNovel-logo.png" width="125" height="50"
      /></b-navbar-brand>
      <b-nav-item style="font-size: 27px">랭킹</b-nav-item>
      <b-nav-item style="font-size: 27px" @click="getAllReview()"
        >리뷰</b-nav-item
      >
      <b-nav-item style="font-size: 27px" to="/recommend">추천</b-nav-item>
      <b-nav-item style="font-size: 27px" @click="getAllNovel()">
        웹소설
      </b-nav-item>
      <b-nav-item style="font-size: 27px" @click="toCommunity()"
        >커뮤니티</b-nav-item
      >
      <b-nav-item style="font-size: 27px">팬클럽</b-nav-item>
    </b-navbar-nav>

    <b-navbar-nav class="right">
      <b-nav-form class="mt-1" style="margin-right: 10px" id="searchForm">
        <input
          placeholder="작품을 검색하세요!"
          type="text"
          v-model="searchKeyword"
        />
        <b-button size="sm" class="my-2 my-sm-0" @click="toSearch()"
          >검색</b-button
        >
      </b-nav-form>
      <div v-if="accessToken">
        <b-nav-form class="mt-1">
          <b-button
            size="sm"
            @click="goToLoginPage()"
            id="loginBtn"
            style="margin-right: 20px"
            variant="primary"
          >
            <!-- 마이페이지 추후 구현 예정 -->
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
            @click="goToLoginPage()"
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
      searchKeyword: "",
    };
  },
  methods: {
    async getAllReview() {
      try {
        const res = await axios.get("/api/v1/review");
        this.$router.push({
          name: "reviews",
          params: { data: res.data },
        });
      } catch (err) {
        console.log(err);
      }
    },
    async getAllNovel() {
      try {
        const res = await axios.get("/api/v1/novel");
        this.$router.push({
          name: "novels",
          params: { data: res.data },
        });
      } catch (err) {
        console.log(err);
      }
    },
    goToLoginPage() {
      this.$router.push("/login");
    },
    // 테스트가 덜 된 코드
    logout() {
      document.cookie = "accessTokenCookie=; path=/;";
      document.cookie = "refreshTokenCookie=; path=/;";
      this.$store.commit("setAccessToken", null);
      this.$store.commit("setRefreshToken", null);
      location.href = "/";
    },
    toCommunity() {
      this.$router.push("/community");
    },
    toSearch() {
      location.href =
        "/search?novelId=null&genre=&author=&title=" + this.searchKeyword;
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
