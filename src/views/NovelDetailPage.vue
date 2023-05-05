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
        <b-container class="bv-example-row">
          <b-row class="rows">
            <b-col>
              <img :src="novel.image" />
            </b-col>
            <b-col class="col-9">
              <b>제목</b>
              <p>{{ novel.title }}</p>
              <b>장르</b>
              <p>{{ novel.genre }}</p>
              <b>작가</b>
              <p>{{ novel.author }}</p>
            </b-col>
          </b-row>
          <br />
          <div class="row">
            <div class="descrption">
              <label><b>간단 소개</b></label>
              <p>{{ novel.description }}</p>
            </div>
          </div>
        </b-container>
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
    const id = this.$route.params.novel_id;
    await axios
      .get("/api/v1/novel/" + id)
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
img {
  border-width: 30px;
  border-style: solid;
  border-color: white;
  border-radius: 10px;
}
.col-9 {
  background-color: white;
  border-radius: 10px;
  padding: 2%;
}
.descrption {
  background-color: white;
  border-radius: 10px;
  padding: 2%;
}
</style>
