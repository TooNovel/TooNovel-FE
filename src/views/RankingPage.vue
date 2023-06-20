<template>
  <div class="container">
    <RankingNavbar @setNovels="setNovels"></RankingNavbar>
    <h3 class="title"><b>전체 작품 리스트</b></h3>
    <div id="loading" v-if="isLoading" style="height: 800px">
      <div class="loader">Loading...</div>
    </div>
    <div class="novel-list-box" ref="allProductList">
      <b-row>
        <b-col
          v-for="(novel, index) in novels"
          :key="index"
          class="mb-3"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <b-card @click="detailNovelList(novel.novelId)">
            <b-card-img :src="novel.image" class="card-image"></b-card-img>
            <b-card-title>{{ novel.title }}</b-card-title>
            <b-card-text>{{ novel.author }}</b-card-text>
            <b-card-text>{{ novel.genre }}</b-card-text>
            <b-card-text>좋아요 {{ novel.likeCount }}</b-card-text>
            <b-card-text
              >{{ novel.grade ? novel.grade : 0 }} ({{
                novel.reviewCount
              }})</b-card-text
            >
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import RankingNavbar from "@/components/RankingNavbar.vue";

export default {
  data() {
    return {
      novels: [],
      isLoading: true,
    };
  },
  async created() {
    console.log("page");
    this.isLoading = false;
  },
  methods: {
    setNovels(novels) {
      this.novels = novels;
      console.log("데이터가 잘 전달이 되었습니다.");
    },
    detailNovelList(novelId) {
      location.href = "/novel/" + novelId;
    },
    async sleep(sec) {
      return new Promise((resolve) => setTimeout(resolve, sec));
    },
  },
  components: {
    RankingNavbar,
  },
};
</script>

<style scoped>
#allProductList {
  height: 400px; /* 스크롤이 표시될 최대 높이값 */
}
.title {
  margin: 20px;
}
.novel-list-box {
  margin-top: 2%;
  margin-left: 5%;
  margin-right: 5%;
}
.card-image {
  height: 300px;
}
</style>
