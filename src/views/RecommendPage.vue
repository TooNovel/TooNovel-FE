<template>
  <div class="container">
    <div class="btns">
      <br />
      <div v-if="isLogined">
        <b-card>
          <div class="card-body">
            <div class="col">
              <div v-if="isRecommend">
                <h2>나만의 웹소설 추천</h2>
                <br />
                리뷰를 1개만 남겨주시면 취향에 맞게 웹소설을 추천 받을 수
                있습니다.
                <br />
                <br />
                리뷰를 많이 남길수록 나만의 웹소설을 찾을 수 있는 정확도가
                올라갑니다.
                <br />
                <br />
                <div class="d-flex justify-content-between">
                  <b-button class="w-50 me-2" @click="getRanking()">
                    인기 웹소설 랭킹
                  </b-button>
                  <b-button class="w-50" @click="getAllNovel()">
                    웹소설 찾기
                  </b-button>
                </div>
              </div>
              <div v-else>
                <h2>나만의 웹소설 추천</h2>
                <br />
                리뷰를 많이 남길수록 나만의 웹소설을 찾을 수 있는 정확도가
                올라갑니다.
                <br />
                <br />
                작성하신 리뷰 데이터는 매일 오전 4시에 반영됩니다.
                <br />
                <br />
                <!-- 데모 버전인 관계로 버튼으로 작동 -->
                <b-button style="width: 100%" @click="generateRecommend()"
                  >작품 추천 받기</b-button
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
    <div class="loading-box" v-if="isLoading">
      <img class="robot-img" src="/robot.gif" />
      <div class="loading-msg">
        <span v-html="message"></span>
      </div>
    </div>
    <div class="novel-list-box">
      <b-row>
        <b-col
          v-for="(novel, index) in novelList"
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
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                "
              >
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
import axios from "axios";
import StarRating from "vue-star-rating";

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
      if (this.reviewCount >= 1) {
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
      var today = new Date();
      var formattedDate =
        today.getFullYear() +
        "년 " +
        ("0" + (today.getMonth() + 1)).slice(-2) +
        "월 " +
        ("0" + today.getDate()).slice(-2) +
        "일";
      console.log(formattedDate);

      this.message = `TooNovel의 추천 시스템이 개인 맞춤 추천 작품 리스트를 생성중입니다.<br>
        바로 오늘 ${formattedDate} 04:00에도 모델이 자동으로 학습되었습니다!`;
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
        alert("새로 남기신 리뷰는 새벽 4시에 반영됩니다! 조금만 기다려주세요!");
        this.isLoading = false;
        this.getDefaultNovel();
      }
    },
    async getDefaultNovel() {
      const res = await axios.get(
        `${process.env.VUE_APP_API_URL}/novel?sort=NOVEL_GRADE_DESC`
      );
      this.novelList = res.data;
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
    getRanking() {
      try {
        this.$router.push({
          name: "ranking",
        });
      } catch (err) {
        console.log(err);
      }
    },
  },
  components: {
    StarRating,
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
.loading-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.robot-img {
  margin-bottom: 10px;
}
.loading-msg {
  font-size: 30px;
  font-weight: 600;
  color: darkseagreen;
  text-align: center;
}
.card-image {
  height: 450px;
}
.card-title {
  margin-top: 10px;
  font-size: 20px;
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
p {
  margin-top: 5px;
  margin-bottom: 5px;
}
.title {
  margin: 20px;
}
.novel-list-box {
  margin-top: 2%;
  margin-left: 5%;
  margin-right: 5%;
}
.card-body {
  height: 420px;
}
.card-image {
  height: 300px;
}
.iconList {
  color: gray;
  margin-right: 10px;
}
</style>
