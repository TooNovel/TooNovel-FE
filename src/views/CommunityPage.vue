<template>
  <div id="community">
    <header>
      <div class="row justify-content-end">
        <div class="col">
          <h1>커뮤니티</h1>
        </div>
        <div class="col-auto">
          <b-button size="lg" href="/community/write">글쓰기</b-button>
        </div>
      </div>
    </header>
    <br />
    <section>
      <div>
        <b-nav tabs align="center">
          <b-nav-item>자유</b-nav-item>
          <b-nav-item>장르</b-nav-item>
          <b-nav-item>질문</b-nav-item>
          <b-nav-item>이벤트</b-nav-item>
        </b-nav>
      </div>
      <br />
      <b-table hover :fields="fields"> </b-table>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      posts: [],
      fields: [
        {
          key: "category",
          label: "카테고리",
        },
        {
          key: "title",
          label: "제목",
        },
        {
          key: "author",
          label: "작성자",
        },
        {
          key: "createdDate",
          label: "작성일자",
        },
      ],
    };
  },
  created() {
    this.posts = this.$route.params.data;
  },
};
</script>
<style scoped>
#community {
  margin: 3%;
}
header {
  background-color: white;
  font-family: Hanna;
  padding: 1rem;
}

section {
  background-color: white;
}
</style>
