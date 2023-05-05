<template>
  <div>
    <h3><b>전체 작품 리스트</b></h3>
    <!-- 내가 좋아요 한 작품 좋아요 기능 완료되면 구현 예정 -->
    <button @click="novelLikeList()">내가 좋아요 한 작품</button>
    <div ref="allProductList" @scroll="handleNotificationListScroll()">
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
          <b-card>
            <b-card-img :src="novel.image" @error="handleImageError">
            </b-card-img>
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
      await axios
        .get(`/api/v1/novel?novelId=${this.novelId}`)
        .then((res) => {
          if (res.data.length) {
            this.novels = this.novels.concat(res.data);
            $state.loaded(); //데이터 로딩
            this.novelId = Number(Object.keys(this.novels).length) - 1;
            if (Number(Object.keys(this.novels).length) / 30 == 0) {
              $state.complete(); //데이터가 없으면 로딩 끝
            }
          } else {
            $state.complete();
          }
        })
        .catch((err) => {
          console.log(err);
          alert("에러");
          this.$router.push("/");
        });
    },
    handleImageError(event) {
      event.target.src =
        "https://via.placeholder.com/600x600.png?text=No+Image";
    },
    novelLikeList() {
      alert("내가 좋아요 한 작품");
    },
  },
  mounted() {
    const novelList = this.$route.params.data;
    this.novels = novelList;
    this.novelId = Number(Object.keys(this.novels).length) - 1;
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
</style>
