<template>
  <div class="container">
    <MyPageNavbar></MyPageNavbar>
    <h3 class="title"><b>내가 연재한 작품</b></h3>
    <h4 class="title">이미지에 마우스를 두면 통계를 볼 수 있습니다.</h4>
    <div v-if="novels.length == 0">
      <h1>아직 연재중인 작품이 없습니다.</h1>
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
            @mouseleave="toolTipOff()"
          >
            <b-card>
              <b-card-img
                :src="novel.image"
                class="card-image"
                @mouseover="toolTipOn(index)"
              >
              </b-card-img>
              <div v-if="toolTip === index">
                <button @click="detailNovelList(novel.novelId)">
                  상세보기
                </button>
                <button @click="getStatistic(novel.novelId)">통계보기</button>
              </div>
              <b-card-title>{{ novel.title }}</b-card-title>
              <b-card-text>{{ novel.author }}</b-card-text>
              <b-card-text>{{ novel.genre }}</b-card-text>
            </b-card>
          </b-col>
        </b-row>
      </div>
      <infinite-loading @infinite="infiniteHandler" spinner="waveDots">
      </infinite-loading>
    </div>
  </div>
</template>

<script>
import MyPageNavbar from "@/components/MyPageNavbar.vue";
import axios from "axios";
import InfiniteLoading from "vue-infinite-loading";

export default {
  data() {
    return {
      novels: [],
      novelId: 0,
      toolTip: -1,
    };
  },
  methods: {
    toolTipOn(index) {
      this.toolTip = index;
    },
    toolTipOff() {
      this.toolTip = -1;
    },
    detailNovelList(novelId) {
      location.href = "/novel/" + novelId;
    },
    async infiniteHandler($state) {
      try {
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/novel/author?novelId=${this.novelId}`,
          option
        );

        if (res.data.length) {
          this.novels = this.novels.concat(res.data);
          this.novelId = this.novels[this.novels.length - 1].novelId;
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
    async getStatistic(novelId) {
      try {
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };
        const genderRes = await axios.get(
          `${process.env.VUE_APP_API_URL}/statistics/${novelId}/gender`,
          option
        );
        const ageRes = await axios.get(
          `${process.env.VUE_APP_API_URL}/statistics/${novelId}/age`,
          option
        );
        const novelRes = await axios.get(
          `${process.env.VUE_APP_API_URL}/novel/` + novelId
        );

        const reviewRes = await axios.get(
          `${process.env.VUE_APP_API_URL}/review/` + novelId + "/novel"
        );
        this.$router.push({
          name: "NovelStatisticsPage",
          params: {
            gender: genderRes.data,
            age: ageRes.data,
            novel: novelRes.data,
            review: reviewRes.data,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {
    const novelList = this.$route.params.data;
    this.novels = novelList;
    this.novelId = this.novels[this.novels.length - 1].novelId;
  },
  components: {
    InfiniteLoading,
    MyPageNavbar,
  },
};
</script>

<style scoped>
#allProductList {
  height: 400px;
  /* 스크롤이 표시될 최대 높이값 */
}
.title {
  margin: 20px;
}
.novel-list-box {
  margin-top: 2%;
  margin-left: 5%;
  margin-right: 5%;
}
button {
  cursor: pointer;
  border-radius: 10px;
  border: 2px solid #93bb91;
  background-color: white;
  box-shadow: 1px 1px 1px 1px #a9eaa6;
  font-family: "Hanna";
}
button:hover {
  background-color: #a9eaa6;
}
</style>
