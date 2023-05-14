<template>
  <div class="container">
    <h3 class="title"><b>전체 작품 리스트</b></h3>
    <!-- 내가 좋아요 한 작품 좋아요 기능 완료되면 구현 예정 -->
    <button @click="novelLikeList()">내가 좋아요 한 작품</button>
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
      try {
        const res = await axios.get(`/api/v1/novel?novelId=${this.novelId}`);
        console.log("length :" + res.data.length);

        if (res.data.length) {
          this.novels = this.novels.concat(res.data);
          this.novelId = this.novels[this.novels.length - 1].novelId;
          $state.loaded(); //데이터 로딩
          if (this.novelId / res.data.length == 0) {
            $state.complete(); //데이터가 없으면 로딩 끝
          }
        } else {
          $state.complete();
        }
      } catch (err) {
        console.log(err);
        alert("에러");
        location.href = "/";
      }
    },
    detailNovelList(novelId) {
      location.href = "/novel/detailView/" + novelId;
    },
    handleImageError(event) {
      event.target.src =
        "https://via.placeholder.com/600x600.png?text=No+Image";
    },
    async novelLikeList() {
      const option = {
        headers: {
          Authorization: "Bearer " + this.$store.getters.getAccessToken,
        },
      };
      await axios
        .get(`/api/v1/user/novel?novelId=${0}`, option)
        .then((data) => {
          this.$router.push({
            name: "novelLike",
            params: data,
          });
        })
        .catch((err) => {
          alert(err);
        });
    },
    detailNovel(item) {
      location.href = "/novel/detailView/" + item.novelId;
    },
  },
  mounted() {
    const novelList = this.$route.params.data;
    this.novels = novelList;
    this.novelId = this.novels[this.novels.length - 1].novelId;
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
