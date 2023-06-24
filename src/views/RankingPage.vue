<template>
  <div class="container">
    <RankingNavbar @setNovels="setNovels"></RankingNavbar>
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
            <b-card-text id="novel-text"
              >{{ novel.genre }} | {{ novel.author }}</b-card-text
            >
            <b-card-title>
              {{
                novel.title.length < 25
                  ? novel.title
                  : novel.title.slice(0, 20) + "..."
              }}
            </b-card-title>
            <template #footer>
              <div class="response-footer">
                <star-rating
                  :border-width="4"
                  border-color="#d8d8d8"
                  :rounded-corners="true"
                  :star-size="20"
                  v-model="novel.grade"
                  read-only
                  :star-points="[
                    23, 2, 14, 17, 0, 19, 10, 34, 7, 50, 23, 43, 38, 50, 36, 34,
                    46, 19, 31, 17,
                  ]"
                ></star-rating
                >&nbsp;({{ novel.reviewCount }})&nbsp;&nbsp;
                <b-icon
                  icon="hand-thumbs-up"
                  font-scale="1.5"
                  variant="danger"
                ></b-icon>
                {{ novel.likeCount }}
              </div>
            </template>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import RankingNavbar from "@/components/RankingNavbar.vue";
import StarRating from "vue-star-rating";

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
    StarRating,
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
.response-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
@media (max-width: 600px) {
  .response-footer {
    flex-wrap: wrap;
  }
}
@media (min-width: 170px) {
  .response-footer {
    flex-wrap: wrap;
  }
}
.card-body {
  height: 420px;
}
</style>
