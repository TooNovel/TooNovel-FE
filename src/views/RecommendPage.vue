<template>
  <div class="container">
    <div class="btns">
      <!-- 데모 버전인 관계로 버튼으로 작동 -->
      <b-button class="recommend-btn" @click="generateRecommend()"
        >작품 추천 받기</b-button
      >
      <b-button class="recommend-btn" @click="updateModel()"
        >작품 추천 업데이트</b-button
      >
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
          lg="3"
          @click="detailWorkList(novel.novelId)"
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
      isLoading: false,
      userId: 1,
      message: null,
    };
  },
  methods: {
    async generateRecommend() {
      this.message = "개인 맞춤 추천 작품 리스트를 생성중입니다.";
      this.isLoading = true;
      this.novelList = [];
      await axios
        .get("/api/v1/recommend", {
          headers: {
            Authorization: "Bearer " + this.$store.getters.getAccessToken,
          },
        })
        .then(async (res) => {
          await this.sleep(2500);
          this.novelList = res.data;
          console.log(res.data);
          this.isLoading = false;
        })
        .catch((err) => {
          console.log(err);
          alert("로그인 인증에 실패했습니다");
          location.href = "/";
        });
    },
    async updateModel() {
      this.message = "추천 모델을 학습중입니다.";
      this.novelList = [];
      this.isLoading = true;
      await axios
        .put("/api/v1/recommend")
        .then(() => {
          this.isLoading = false;
          this.generateRecommend();
        })
        .catch((err) => {
          alert(err);
        });
    },
    async sleep(sec) {
      return new Promise((resolve) => setTimeout(resolve, sec));
    },
    detailWorkList(novelId) {
      location.href = "/work/detailView/" + novelId;
    },
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
  height: 350px;
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
