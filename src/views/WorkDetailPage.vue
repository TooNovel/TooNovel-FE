<template>
  <div>
    <b-nav tabs style="background-color: white">
      <b-nav-item>전체</b-nav-item>
      <b-nav-item>로맨스</b-nav-item>
      <b-nav-item>무협</b-nav-item>
      <b-nav-item>판타지</b-nav-item>
      <b-nav-item>미스터리</b-nav-item>
      <b-nav-item>대체역사</b-nav-item>
      <b-nav-item>라이트노벨</b-nav-item>
    </b-nav>
    <main>
      <article>
        <div class="container">
          <div class="works">
            <div class="row m-b-40">
              <div
                class="col-lg-2 mb-3"
                style="background-color: white; margin-right: 10px"
              >
                <img :src="novel.image" />
              </div>
              <div class="col-lg-8" style="background-color: white">
                <b>제목</b>
                <p>{{ novel.title }}</p>
                <b>장르</b>
                <p>{{ novel.genre }}</p>
                <b>작가</b>
                <p>{{ novel.author }}</p>
                <label><b>간단 소개</b></label>
                <p>{{ novel.description }}</p>
              </div>
            </div>
          </div>
        </div>
        <h1>리뷰 부분</h1>
      </article>
    </main>
  </div>
</template>
<script scoped>
import axios from "axios";
export default {
  name: "WorkDetailPage",
  data() {
    return {
      novel: {},
    };
  },
  async created() {
    console.log(this.$route.params.novel_id);
    await axios
      .get("/api/v1/novel/" + this.$route.params.novel_id)
      .then((response) => {
        this.novel = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>
<style scoped>
main {
  margin: 5%;
}
</style>
