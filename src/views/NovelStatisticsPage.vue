<template>
  <div>
    <MyPageNavbar></MyPageNavbar>
    <div class="info">
      <h2>💚{{ novel.author }}💚 작가님</h2>
    </div>
    <div class="info">
      <h2>✨ {{ novel.title }} ✨ 작품 통계</h2>
    </div>
    <div class="statistics-box">
      <div v-if="reviews.length == 0">아직 통계가 없습니다.</div>
      <div v-else>
        <div class="age-box">
          <h1>성별 통계</h1>
          <div class="chart-container">
            <canvas ref="genderChart"></canvas>
          </div>
        </div>
        <div class="gender-box">
          <h1>연령대별 통계</h1>
          <div class="chart-container">
            <canvas ref="ageChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script scoped>
import axios from "axios";
import MyPageNavbar from "@/components/MyPageNavbar.vue";
import {
  Chart,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  BarElement,
  LinearScale,
  BarController,
  PieController,
} from "chart.js";

Chart.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  BarElement,
  LinearScale,
  BarController,
  PieController
);

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
      var config = {
        type: "pie",
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
          responsive: true,
          legend: {
            position: "top",
            fontColor: "black",
            align: "center",
            display: true,
            fullWidth: true,
            labels: {
              fontColor: "rgb(0, 0, 0)",
            },
          },
          plugins: {
            labels: {
              render: "value",
              fontColor: "black",
              fontSize: 15,
              precision: 2,
            },
          },
          title: {
            display: true,
            text: "Chart.js Pie Chart",
          },
        },
      };
      this.ageChart = new Chart(ctx2, config);
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
          `${process.env.VUE_APP_API_URL}/review/` + res.reviewId + "/like",
          null,
          option
        );
        const result = await axios.get(
          `${process.env.VUE_APP_API_URL}/review/` +
            this.novel.novelId +
            "/novel",
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
    MyPageNavbar,
  },
};
</script>
<style scoped>
.info {
  background-color: white;
  text-align: center;
  border-radius: 10px;
  border: 2px solid rgba(94, 92, 154, 0.2);
  margin: 2rem;
  padding: 4px;
}
.statistics-box {
  background-color: white;
  border-radius: 10px;
  margin: 2rem;
  padding: 20px;
  box-shadow: 5px 5px 20px 5px rgba(94, 92, 154, 0.2);
}
.chart-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100rem;
  overflow: hidden;
  margin-bottom: 50px;
}
.age-chart-container {
  display: block;
  float: left;
  width: 50rem; /* 원하는 가로 크기 */
}
.age-box {
  background-color: white;
  border-radius: 10px;
  margin: 2rem;
  padding: 20px;
  text-align: center;
  box-shadow: 5px 5px 20px 5px rgba(94, 92, 154, 0.2);
}
.gender-box {
  background-color: white;
  border-radius: 10px;
  margin: 2rem;
  margin-top: 45px;
  text-align: center;
  padding: 20px;
  box-shadow: 5px 5px 20px 5px rgba(94, 92, 154, 0.2);
}
.chart-container {
  background-color: white;
  border-radius: 20px;
  height: 200px;
  display: flex;
  justify-content: center;
  text-align: center;
}
</style>
