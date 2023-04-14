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
      <b-nav-item style="font-size: 20px">리뷰</b-nav-item>
      <b-nav-item style="font-size: 20px">추천</b-nav-item>
      <b-nav-item style="font-size: 20px">작품찾기</b-nav-item>
      <b-nav-item style="font-size: 20px" @click="getList()"
        >커뮤니티</b-nav-item
      >
      <b-nav-item style="font-size: 20px">팬클럽</b-nav-item>
    </b-navbar-nav>

    <!-- Right aligned nav items -->
    <b-navbar-nav class="right">
      <b-nav-form class="mt-1" style="margin-right: 10px" id="searchForm">
        <input placeholder="작품을 검색하세요!" type="text" />
        <!-- <b-avatar class="searchIcon" icon="search"></b-avatar> -->
        <b-button size="sm" class="my-2 my-sm-0">검색</b-button>
      </b-nav-form>
      <b-nav-form class="mt-1">
        <b-button
          size="sm"
          @click="goToLogin()"
          id="loginBtn"
          style="margin-right: 20px"
          variant="primary"
          >로그인</b-button
        >
      </b-nav-form>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {
  data() {
    return {
      message: "MainHeader",
    };
  },
  methods: {
    goToLogin() {
      this.$router.push("/login");
    },

    getList() {
      this.$router.push("/community");
    },
  },
  created() {
    console.log("컴포넌트 생성!");
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
