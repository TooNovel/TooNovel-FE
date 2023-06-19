<template>
  <div class="container">
    <div class="btns">
      <br />
      <div v-if="isLogined">
        <b-card>
          <div class="card-body">
            <div class="col">
              <div v-if="isRecommend">
                <h2>리뷰가 아직 부족합니다!</h2>
                <br />
                남은 리뷰
                <h3>{{ 20 - reviewCount }}</h3>
                <br />
                리뷰를 더 작성 하신 후 추천 서비스를 이용하실 수 있습니다!
                <br />
                <br />
                <div class="d-flex justify-content-between">
                  <b-button class="w-50 me-2" @click="getNovelRank()">
                    인기 웹소설 랭킹
                  </b-button>
                  <b-button class="w-50" @click="getAllNovel()">
                    웹소설 찾기
                  </b-button>
                </div>
              </div>
              <div v-else>
                <h2>추천 서비스를 받아보세요!</h2>
                <!-- 데모 버전인 관계로 버튼으로 작동 -->
                <b-button class="recommend-btn" @click="generateRecommend()"
                  >작품 추천 받기</b-button
                >
                <b-button class="recommend-btn" @click="updateModel()"
                  >작품 추천 업데이트</b-button
                >
              </div>
            </div>
          </div>
        </b-card>
      </div>
      <div v-else>
        <b-card>
          <div class="card-body">
            <div class="col">
              <h2>로그인이 필요합니다!</h2>
              <br />
              리뷰 작성 후 TooNovel의 추천 서비스를 제공 받으실 수 있습니다!
              <br />
              로그인 후 나만의 추천작을 받아보세요!
              <br />
              <br />
              <b-button style="width: 100%" @click="goToLoginPage()">
                로그인
              </b-button>
            </div>
          </div>
        </b-card>
      </div>
    </div>
    <div class="spiner" v-if="isLoading">
      <div class="loader">Loading...</div>
    </div>
    <div class="loading-msg" v-if="isLoading">
      {{ message }}
    </div>
    <div id="allProductList">
      <b-row>
        <b-col
          v-for="novel in novelList"
          :key="novel.novelId"
          class="mb-3"
          cols="12"
          sm="6"
          md="4"
          lg="4"
          @click="detailNovelList(novel.novelId)"
        >
          <b-card>
            <b-card-img
              :src="novel.image"
              :alt="novel.title"
              class="card-image"
            ></b-card-img>
            <b-card-title class="card-title">{{ novel.title }}</b-card-title>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      novelList: [],
      reviewCount: 0,
      isLoading: false,
      userId: 1,
      message: null,
      isLogined: false,
      isRecommend: true,
    };
  },
  async created() {
    try {
      const res = await axios.get(
        `${process.env.VUE_APP_API_URL}/novel?sort=NOVEL_GRADE_DESC`
      );
      this.novelList = res.data;
      const option = {
        headers: {
          Authorization: "Bearer " + this.$getAccessToken(),
        },
      };
      const res2 = await axios.get(
        `${process.env.VUE_APP_API_URL}/review/myReview`,
        option
      );
      this.reviewCount = res2.data.totalElements;
      if (this.reviewCount >= 20) {
        this.isRecommend = false;
      } else {
        this.isRecommend = true;
      }
      this.novelId = this.novels[this.novels.length - 1].novelId;
    } catch (err) {
      console.log(err);
    }
    return;
  },
  methods: {
    async generateRecommend() {
      this.message = "개인 맞춤 추천 작품 리스트를 생성중입니다.";
      this.isLoading = true;
      this.novelList = [];

      try {
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };

        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/recommend`,
          option
        );

        await this.sleep(2500);
        this.novelList = res.data;
        console.log(res.data);
        this.isLoading = false;
      } catch (err) {
        alert("로그인 인증에 실패했습니다");
        console.log(err);
        location.href = "/";
      }
    },
    async updateModel() {
      this.message = "추천 모델을 학습중입니다.";
      this.novelList = [];
      this.isLoading = true;

      try {
        await axios.put(`${process.env.VUE_APP_API_URL}/recommend`);

        this.isLoading = false;
        this.generateRecommend();
      } catch (err) {
        alert(err);
      }
    },
    async sleep(sec) {
      return new Promise((resolve) => setTimeout(resolve, sec));
    },
    async getAllNovel() {
      try {
        this.$router.push({
          name: "novels",
        });
      } catch (err) {
        console.log(err);
      }
    },
    detailNovelList(novelId) {
      location.href = "/novel/" + novelId;
    },
    goToLoginPage() {
      this.$router.push("/login");
    },
  },
  mounted() {
    this.isLogined =
      this.$getAccessToken() != "" && this.$getAccessToken() != null;
  },
};
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  min-height: 1000px;
}
.recommend-btn {
  margin: 2.5vw;
  font-weight: 600;
}
.loader,
.loader:before,
.loader:after {
  background: #9c9c9c;
  -webkit-animation: load1 1s infinite ease-in-out;
  animation: load1 1s infinite ease-in-out;
  width: 1em;
  height: 4em;
}
.loader {
  color: #9c9c9c;
  text-indent: -9999em;
  margin: 88px auto;
  position: relative;
  font-size: 11px;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}
.loader:before,
.loader:after {
  position: absolute;
  top: 0;
  content: "";
}
.loader:before {
  left: -1.5em;
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}
.loader:after {
  left: 1.5em;
}
.spiner {
  height: 200px;
}
.loading-msg {
  font-size: 18px;
  font-weight: 600;
  color: gray;
}
.card-image {
  height: 450px;
}
.card-title {
  margin-top: 10px;
  font-size: 20px;
}
#allProductList {
  margin-top: 2%;
  margin-left: 5%;
  margin-right: 5%;
}
@-webkit-keyframes load1 {
  0%,
  80%,
  100% {
    box-shadow: 0 0;
    height: 4em;
  }
  40% {
    box-shadow: 0 -2em;
    height: 5em;
  }
}
@keyframes load1 {
  0%,
  80%,
  100% {
    box-shadow: 0 0;
    height: 4em;
  }
  40% {
    box-shadow: 0 -2em;
    height: 5em;
  }
}
</style>
