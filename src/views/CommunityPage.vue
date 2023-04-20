<template>
  <div id="community">
    <h1>커뮤니티</h1>
    <br />
    <div>
      <b-button pill>전체</b-button>
      <b-button pill>자유</b-button>
      <b-button pill>장르</b-button>
      <b-button pill>질문</b-button>
      <b-button pill>이벤트</b-button>
    </div>
    <br />
    <!-- <tr v-for="post in posts" :key="{ post }">
            <td>{{ post.postId }}</td>
            <td>{{ post.title }}</td>
            <td>{{ post.authorName }}</td>
            <td>{{ post.viewCount }}</td>
            <td>{{ post.createDate }}</td>
        </tr> -->
    <b-button variant="outline-primary">
      <a href="/community/write">글쓰기</a>
    </b-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      posts: [],
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
</style>
