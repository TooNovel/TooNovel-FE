<template>
  <div>
    <MyPageNavbar></MyPageNavbar>
    <div class="info">
      <h2>
        기본 통계데이터는 지난주부터 오늘까지 총 1주일간의 데이터를 제공합니다.
      </h2>
    </div>
    <div class="review-box">
      <div class="date-box">
        <h1>일별 리뷰 데이터</h1>
        <input type="date" class="input-date" v-model="reviewStartDate" /> ~
        <input type="date" class="input-date" v-model="reviewEndDate" />
        <br />
        <button class="date-btn" @click="reviewDate()">날짜 선택</button>
      </div>
      <div class="chart-container">
        <canvas ref="reviewChart"></canvas>
      </div>
    </div>
    <div class="novel-box">
      <div class="date-box">
        <h1>일별 작품 데이터</h1>
        <input type="date" class="input-date" v-model="novelStartDate" /> ~
        <input type="date" class="input-date" v-model="novelEndDate" />
        <br />
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
  text-align: center;
  border-radius: 10px;
  border: 2px solid rgba(94, 92, 154, 0.2);
  margin: 2rem;
  padding: 4px;
}
.review-box {
  background-color: white;
  border-radius: 10px;
  margin: 2rem;
  padding: 20px;
  box-shadow: 5px 5px 20px 5px rgba(94, 92, 154, 0.2);
}
.novel-box {
  background-color: white;
  border-radius: 10px;
  margin: 2rem;
  margin-top: 45px;
  padding: 20px;
  box-shadow: 5px 5px 20px 5px rgba(94, 92, 154, 0.2);
}
.chart-container {
  background-color: white;
  border-radius: 20px;
  height: 500px;
  margin-top: 70px;
}

.date-box {
  float: left;
}
.input-date {
  border: 2px solid #93bb91;
  border-radius: 5px;
}
.date-btn {
  cursor: pointer;
  border: 2px solid #93bb91;
  background-color: white;
  font-family: "Hanna";
  margin-top: 10px;
  border-radius: 5px;
}

.date-btn:hover {
  background-color: #a9eaa6;
}
</style>
