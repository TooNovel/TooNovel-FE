<template>
  <div>
    <MyPageNavbar></MyPageNavbar>
    <div class="info">
      <h2>
        기본 통계데이터는 저번주부터 오늘까지 총 1주일간의데이터를 제공합니다.
      </h2>
    </div>
    <div class="review-box">
      <div class="date-box">
        <h1>일별 리뷰 데이터</h1>
        <input type="date" id="start-date" v-model="reviewStartDate" /> ~
        <input type="date" id="end-date" v-model="reviewEndDate" />
        <button class="date-btn" @click="reviewDate()">날짜 선택</button>
      </div>
      <div class="chart-container">
        <canvas ref="reviewChart"></canvas>
      </div>
    </div>
    <div class="novel-box">
      <div class="date-box">
        <h1>일별 작품 데이터</h1>
        <input type="date" id="start-date" v-model="novelStartDate" /> ~
        <input type="date" id="end-date" v-model="novelEndDate" />
        <button class="date-btn" @click="novelDate()">날짜 선택</button>
      </div>
      <div class="chart-container">
        <canvas ref="novelChart"></canvas>
      </div>
    </div>
  </div>
</template>
<script>
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import axios from "axios";
import MyPageNavbar from "@/components/MyPageNavbar.vue";

Chart.register(LineController, LineElement, PointElement, Tooltip);

export default {
  data() {
    return {
      reviewChart: null,
      novelChart: null,
      reviewstatistics: [],
      novelstatistics: [],
      reviewIdxValue: [],
      reviewIdxCount: [],
      novelIdxValue: [],
      novelIdxCount: [],
      reviewStartDate: "",
      reviewEndDate: "",
      novelStartDate: "",
      novelEndDate: "",
    };
  },
  methods: {
    async reviewDate() {
      const startDate = this.reviewStartDate;
      const endDate = this.reviewEndDate;
      if (startDate > endDate) {
        alert("시작날짜가 더 클수 없습니다");
        return;
      } else if (startDate == "" || endDate == "") {
        alert("날짜를 선택해주세요");
        return;
      }
      try {
        const reviewRes = await axios.get(
          `${process.env.VUE_APP_API_URL}/admin/review?startDate=${startDate}&endDate=${endDate}`
        );
        this.reviewstatistics = reviewRes.data;
        this.reviewIdxValue = this.reviewstatistics.map((i) => i.createdDate);
        this.reviewIdxCount = this.reviewstatistics.map((i) => i.count);
        this.reviewChart.data.labels = this.reviewIdxValue;
        this.reviewChart.data.datasets[0].data = this.reviewIdxCount;
        this.reviewChart.update();
      } catch (err) {
        console.log(err);
      }
    },
    async novelDate() {
      const startDate = this.novelStartDate;
      const endDate = this.novelEndDate;
      if (startDate > endDate) {
        alert("시작날짜가 더 클수 없습니다");
        return;
      } else if (startDate == "" || endDate == "") {
        alert("날짜를 선택해주세요");
        return;
      }
      try {
        const novelRes = await axios.get(
          `${process.env.VUE_APP_API_URL}/admin/novel?startDate=${startDate}&endDate=${endDate}`
        );
        this.novelstatistics = novelRes.data;
        this.novelIdxValue = this.novelstatistics.map((i) => i.createdDate);
        this.novelIdxCount = this.novelstatistics.map((i) => i.count);
        this.novelChart.data.labels = this.novelIdxValue;
        this.novelChart.data.datasets[0].data = this.novelIdxCount;
        this.novelChart.update();
      } catch (err) {
        console.log(err);
      }
    },
  },
  async mounted() {
    try {
      const reviewRes = await axios.get(
        `${process.env.VUE_APP_API_URL}/admin/review`
      );
      const novelRes = await axios.get(
        `${process.env.VUE_APP_API_URL}/admin/novel`
      );
      //리뷰데이터 + 리뷰차트
      this.reviewstatistics = reviewRes.data;
      this.reviewIdxValue = this.reviewstatistics.map((i) => i.createdDate);
      this.reviewIdxCount = this.reviewstatistics.map((i) => i.count);
      const ctx = this.$refs.reviewChart.getContext("2d");

      //노벨데이터 + 노벨차트
      this.novelstatistics = novelRes.data;
      this.novelIdxValue = this.novelstatistics.map((i) => i.createdDate);
      this.novelIdxCount = this.novelstatistics.map((i) => i.count);
      const ctx2 = this.$refs.novelChart.getContext("2d");

      this.reviewChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: this.reviewIdxValue,
          datasets: [
            {
              label: "Dataset",
              data: this.reviewIdxCount,
              borderColor: "red",
              backgroundColor: "rgba(255, 0, 0, 0.5)",
              pointStyle: "circle",
              pointRadius: 5,
              pointHoverRadius: 10,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "dssssssss",
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const data = context.parsed.y;
                  return `추가된 리뷰 개수 : ${data}`;
                },
              },
            },
          },
          scales: {
            y: {
              type: "linear",
              ticks: {
                beginAtZero: true,
                maxTicksLimit: 3,
                callback: (value) => {
                  return Math.floor(value); // 소수점 둘째 자리까지 표시
                },
              },
            },
          },
        },
      });
      this.novelChart = new Chart(ctx2, {
        type: "line",
        data: {
          labels: this.novelIdxValue,
          datasets: [
            {
              label: "Dataset",
              data: this.novelIdxCount,
              borderColor: "red",
              backgroundColor: "rgba(255, 0, 0, 0.5)",
              pointStyle: "circle",
              pointRadius: 5,
              pointHoverRadius: 10,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: (ctx2) =>
                "Point Style: " + ctx2.chart.data.datasets[0].pointStyle,
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const data = context.parsed.y;
                  return `추가된 웹소설 개수 : ${data}`;
                },
              },
            },
          },
        },
      });
    } catch (err) {
      console.log(err);
    }
    this.reviewChart.options.scales.y.beginAtZero = true;
    this.novelChart.options.scales.y.beginAtZero = true;
  },
  components: { MyPageNavbar },
};
</script>
<style scope>
* {
  font-family: "Hanna";
}
.info {
  background-color: white;
  border-radius: 30px;
  margin: 10px;
}
.review-box {
  background-color: white;
  border-radius: 30px;
  margin: 10px;
}
.novel-box {
  background-color: white;
  border-radius: 30px;
  margin-top: 100px;
}
.chart-container {
  background-color: rgb(182, 224, 186);
  border-radius: 20px;
  height: 500px;
  margin-top: 70px;
}

.date-box {
  float: left;
}

.date-btn {
  cursor: pointer;
  border: 2px solid #93bb91;
  background-color: white;
  box-shadow: 1px 1px 1px 1px #a9eaa6;
  font-family: "Hanna";
  margin-left: 20px;
}

.date-btn:hover {
  background-color: #a9eaa6;
}
</style>
