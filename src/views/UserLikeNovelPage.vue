<template>
  <div class="container">
    <h3 class="title"><b>좋아요 한 작품 리스트</b></h3>
    <!-- 내가 좋아요 한 작품 좋아요 기능 완료되면 구현 예정 -->
    <button @click="getAllNovel()">전체 작품</button>
    <div v-if="novels.length == 0">
      <h1>좋아요를 누른 작품이 없습니다.</h1>
    </div>
    <div v-else>
      <div class="novel-list-box">
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
            </b-card>
          </b-col>
        </b-row>
      </div>
      <infinite-loading
        @infinite="infiniteHandler"
        spinner="waveDots"
      ></infinite-loading>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import InfiniteLoading from "vue-infinite-loading";

export default {
  data() {
    return {
      novels: [],
      novelId: 0,
    };
  },
  methods: {
    async infiniteHandler($state) {
      try {
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/user/novel?novelId=${this.novelId}`,
          option
        );

        if (res.data.length) {
          this.novels = this.novels.concat(res.data);
          this.novelId = this.novels[this.novels.length - 1].likeNovelId;
          $state.loaded(); //데이터 로딩
          if (Number(Object.keys(this.novels).length) / 10 == 0) {
            $state.complete(); //데이터가 없으면 로딩 끝
          }
        } else {
          $state.complete();
        }
      } catch (err) {
        console.log(err);
        alert(err);
      }
    },

    handleImageError(event) {
      event.target.src =
        "https://via.placeholder.com/600x600.png?text=No+Image";
    },
    async getAllNovel() {
      try {
        const res = await axios.get(`${process.env.VUE_APP_API_URL}/novel`);
        this.$router.push({
          name: "novels",
          params: { data: res.data },
        });
      } catch (err) {
        console.log(err);
      }
    },
    detailNovelList(novelId) {
      location.href = "/novel/detailView/" + novelId;
    },
  },
  mounted() {
    const novelList = this.$route.params.data;
    this.novels = novelList;
    this.novelId = this.novels[this.novels.length - 1].likeNovelId;
  },
  components: {
    InfiniteLoading,
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
  height: 350px;
}
</style>
