<template>
  <div>
    <main style="margin-top: 3%">
      <MyPageHeader></MyPageHeader>
      <div id="writerStatistics">
        <div v-if="reviews.length == 0">아직 통계가 없습니다.</div>
        <div v-else>
          <div id="statistics1">
            연령대별 통계
            <canvas ref="genderChart" width="400" height="400"></canvas>
          </div>
          <div id="statistics1">
            성별 통계
            <canvas ref="ageChart" width="400" height="400"></canvas>
          </div>
        </div>
      </div>
      <article>
        <b-container class="bv-example-row">
          <b-row class="rows">
            <b-col>
              <img id="image" :src="novel.image" />
            </b-col>
            <b-col class="col-9">
              <b>제목</b>
              <p>{{ novel.title }}</p>
              <b>장르</b>
              <p>{{ novel.genre }}</p>
              <b>작가</b>
              <p>{{ novel.author }}</p>
              <novel-like :novel="novel"></novel-like>
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
        <br />
        <b-container>
          <h4><b>🗨️리뷰</b></h4>
          <div v-if="reviews.length == 0">아직 리뷰가 없습니다.</div>
          <div v-else>
            <div v-for="review in reviews" v-bind:key="review.reviewId">
              <div class="reviewBox">
                <div class="row">
                  <div class="col">
                    <p><b>작성자ㅤ</b>{{ review.nickname }}</p>
                  </div>
                  <div class="col">
                    <p><b>작성일자ㅤ</b>{{ review.createdDate }}</p>
                  </div>
                </div>
                <div class="row">
                  <p>{{ review.reviewContent }}</p>
                </div>
                <div class="row">
                  <div class="col">평점 : {{ review.reviewGrade }}</div>
                  <div class="col">
                    <div class="right_area">
                      <button
                        @click="reviewLike(review)"
                        :class="{ active: review.isActived }"
                      >
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/803/803087.png"
                          width="24"
                          height="24"
                        />
                      </button>
                      좋아요 : {{ review.reviewLike }}
                    </div>
                  </div>
                </div>
              </div>
              <br />
            </div>
          </div>
        </b-container>
      </article>
    </main>
  </div>
</template>
<script scoped>
import axios from "axios";
import NovelLike from "@/components/NovelLike.vue";
import MyPageHeader from "@/components/MyPageHeader.vue";
import {
  Chart,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

Chart.register(BarController, CategoryScale, LinearScale, BarElement);

export default {
  name: "NovelDetailPage",
  data() {
    return {
      novel: {},
      reviews: [],
      reviewContent: "",
      reviewGrade: 0,
      selectedGrade: "--",
      novelLiked: false,
      genderChart: null,
      ageChart: null,
      genderStatistics: [],
      ageStatistics: [],
      idxValue: ["0~10", "10~20", "20~30", "30~40", "40~50", "50~"],
      ageCount: [0, 0, 0, 0, 0, 0],
      genderCount: [0, 0],
    };
  },
  async mounted() {
    //통계
    try {
      this.genderStatistics = this.$route.params.gender;
      this.ageStatistics = this.$route.params.age;

      this.ageStatistics.forEach((i) => {
        switch (i.age) {
          case "0~10":
            this.ageCount[0] = i.count;
            break;
          case "10~20":
            this.ageCount[1] = i.count;
            break;
          case "20~30":
            this.ageCount[2] = i.count;
            break;
          case "30~40":
            this.ageCount[3] = i.count;
            break;
          case "50~":
            this.ageCount[4] = i.count;
            break;
        }
      });
      this.genderStatistics.forEach((i) => {
        switch (i.gender) {
          case "man":
            this.genderCount[0] = i.count;
            break;
          case "woman":
            this.genderCount[1] = i.count;
            break;
        }
      });
      const ctx = this.$refs.genderChart.getContext("2d");
      const ctx2 = this.$refs.ageChart.getContext("2d");
      this.genderChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.idxValue,
          datasets: [
            {
              label: "데이터 개수",
              data: this.ageCount,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: false,
          scales: {
            y: {
              type: "linear",
              ticks: {
                beginAtZero: true,
                maxTicksLimit: 5,
                callback: function (value) {
                  return Math.floor(value);
                },
              },
            },
          },
        },
      });
      this.ageChart = new Chart(ctx2, {
        type: "bar",
        data: {
          labels: ["남성", "여성"],
          datasets: [
            {
              label: "데이터 개수",
              data: this.genderCount,
              backgroundColor: [
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 99, 132, 0.2)",
              ],
              borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: false,
          scales: {
            y: {
              type: "linear",
              ticks: {
                beginAtZero: true,
                maxTicksLimit: 3,
                callback: function (value) {
                  return Math.floor(value);
                },
              },
            },
          },
        },
      });
    } catch (err) {
      console.log(err);
    }
  },
  async created() {
    try {
      this.novel = this.$route.params.novel;
      this.reviews = this.$route.params.review.content;

      this.reviews.forEach((review) => {
        review.createdDate = `${review.createdDate[0]} / ${review.createdDate[1]} / ${review.createdDate[2]}`;
      });
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    async reviewLike(res) {
      try {
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };
        await axios.post(
          "/api/v1/review/" + res.reviewId + "/like",
          null,
          option
        );
        const result = await axios.get(
          "/api/v1/review/" + this.novel.novelId + "/novel",
          option
        );
        const clickReview = result.data.content.find(
          (review) => review.reviewId === res.reviewId
        );
        res.reviewLike = clickReview.reviewLike;
      } catch (err) {
        const errStatus = err.response.data;
        if (errStatus.code == "R004") {
          alert(errStatus.message);
        } else if (
          this.$getAccessToken() == null ||
          this.$getAccessToken() === ""
        ) {
          alert("로그인 후 좋아요 눌러주세요!");
        }
      }
    },
  },
  components: {
    "novel-like": NovelLike,
    MyPageHeader,
  },
};
</script>
<style scoped>
@import "@/style/novel-detail.css";

#writerStatistics {
  width: 800px;
  display: inline;
}
#statistics1 {
  width: 400px;
}
#statistics2 {
  width: 400px;
}
</style>
