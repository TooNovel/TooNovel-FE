<template>
  <b-navbar
    class="navbar d-flex justify-content-between align-items-center"
    type="dark"
    variant="dark"
  >
    <b-navbar-nav>
      <b-navbar-brand href="/" tag="h1">ㅤTooNovel</b-navbar-brand>
      <b-nav-item href="/login">Login</b-nav-item>
      <b-nav-item href="/#">랭킹</b-nav-item>
      <b-nav-item href="/#">리뷰</b-nav-item>
      <b-nav-item href="/#">추천</b-nav-item>
      <b-nav-item href="/#">작품찾기</b-nav-item>
      <b-nav-item href="/community">커뮤니티</b-nav-item>
      <b-nav-item href="/#">팬클럽</b-nav-item>
    </b-navbar-nav>

    <!-- Right aligned nav items -->
    <b-navbar-nav class="right">
      <b-nav-form class="mt-1" style="margin-right: 10px" id="searchForm">
        <input
          placeholder="작품을 검색하세요!"
          v-model="search"
          type="text"
          v-on:keydown.enter.prevent=""
          class="searchInput"
        />
        <!-- <b-avatar class="searchIcon" icon="search"></b-avatar> -->
        <b-button size="sm" class="my-2 my-sm-0">Search</b-button>
      </b-nav-form>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {};
</script>

<style>
#searchForm {
  display: flex;
  align-items: center;
}
</style>
