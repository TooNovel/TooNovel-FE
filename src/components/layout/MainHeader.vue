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
      <b-nav-item style="font-size: 27px" @click="getRanking()"
        >랭킹</b-nav-item
      >
      <b-nav-item style="font-size: 27px" @click="getAllReview()"
        >리뷰</b-nav-item
      >
      <b-nav-item style="font-size: 27px" @click="recommend()">추천</b-nav-item>
      <b-nav-item style="font-size: 27px" @click="getAllNovel()">
        웹소설
      </b-nav-item>
      <b-nav-item style="font-size: 27px" @click="getAllPost()"
        >커뮤니티</b-nav-item
      >
      <b-nav-item style="font-size: 27px" @click="toFanclub()"
        >메신저</b-nav-item
      >
    </b-navbar-nav>

    <b-navbar-nav class="right">
      <b-nav-form
        class="mt-1"
        style="margin-right: 10px"
        id="searchForm"
        @submit.prevent="toSearch"
      >
        <input
          placeholder="작품 제목을 검색하세요!"
          type="text"
          v-model="searchTitle"
        />
        <b-button size="sm" class="my-2 my-sm-0" type="submit">검색</b-button>
      </b-nav-form>
      <div v-if="isLogined">
        <b-nav-form class="mt-1">
          <b-button
            size="sm"
            @click="mypage()"
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
axios.defaults.withCredentials = true;

export default {
  data() {
    return {
      message: "MainHeader",
      isLogined: false,
      searchTitle: "",
    };
  },
  methods: {
    async getAllReview() {
      try {
        this.$router.push({
          name: "reviews",
        });
      } catch (err) {
        console.log(err);
      }
    },
    async getAllNovel() {
      try {
        this.$router.push({
          name: "novels",
        });
      } catch (err) {
        console.log(err);
      }
    },
    async getAllPost() {
      try {
        const res = await axios.get(`${process.env.VUE_APP_API_URL}/post`);
        this.$router.push({
          name: "Community",
          params: { data: res.data },
        });
      } catch (err) {
        console.log(err);
      }
    },
    async mypage() {
      try {
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/user/me`,
          option
        );
        this.$router.push({
          name: "MyPage",
          params: { data: res.data },
        });
      } catch (err) {
        if (err.code == "U001") {
          alert(err.message);
        } else if (
          this.$getAccessToken() == null ||
          this.$getAccessToken() === ""
        ) {
          alert("로그인 후 좋아요 눌러주세요!");
        }
      }
    },
    async recommend() {
      try {
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/user/me`,
          option
        );
        this.$router.push({
          name: "RecommendPage",
          params: { data: res.data },
        });
      } catch (err) {
        this.$router.push({
          name: "RecommendPage",
        });
      }
    },
    goToLoginPage() {
      this.$router.push("/login");
    },
    logout() {
      try {
        axios.delete(`${process.env.VUE_APP_API_URL}/token`);
        document.cookie =
          "accessTokenCookie=; path=/; domain=.toonovel.link; SameSite=None; Secure; Max-Age=0;";
        this.isLogined = false;
        location.href = "/";
      } catch (err) {
        console.log(err);
      }
    },
    toCommunity() {
      this.$router.push("/community");
    },
    toSearch() {
      this.$router.push({
        path: "/search",
        query: {
          novelId: null,
          genre: "",
          author: "",
          title: this.searchTitle,
        },
      });
    },
    toFanclub() {
      this.$router.push("/fanclub");
    },
    getRanking() {
      try {
        this.$router.push({
          name: "ranking",
        });
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {
    this.isLogined =
      this.$getAccessToken() != "" && this.$getAccessToken() != null;
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
