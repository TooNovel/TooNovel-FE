<template>
  <div>
    <MyPageNavbar></MyPageNavbar>
    <div class="chart-container">
      <h1>일별 리뷰 데이터</h1>
      <canvas class="review-chart" ref="reviewChart"></canvas>
    </div>
    <div class="chart-container">
      <h1>일별 작품 데이터</h1>
      <canvas class="novel-chart" ref="novelChart"></canvas>
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
    };
  },
  async mounted() {
    try {
      const reviewRes = await axios.get(
        `${process.env.VUE_APP_API_URL}/admin/review`
      );
      const novelRes = await axios.get(
        `${process.env.VUE_APP_API_URL}/admin/novel`
      );
      console.log(reviewRes.data);
      console.log(novelRes.data);
      //리뷰데이터 + 리뷰차트
      this.reviewstatistics = reviewRes.data;
      this.reviewIdxValue = this.reviewstatistics.map((i) => i.createdDate);
      this.reviewIdxCount = this.reviewstatistics.map((i) => i.count);
      const ctx = this.$refs.reviewChart.getContext("2d");

      //노벨데이터 + 노벨차트
      this.novelstatistics = novelRes.data;
      this.novelIdxValue = this.novelstatistics.map((i) => i.createdDate);
      this.novelIdxCount = this.novelstatistics.map((i) => i.count);
      this.novelIdxCount[0] = 0;
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
              pointRadius: 10,
              pointHoverRadius: 15,
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
                  return `데이터 개수 : ${data}`;
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
              pointRadius: 10,
              pointHoverRadius: 15,
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
                  return `데이터 개수 : ${data}`;
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
    this.reviewChart.update();
  },
  components: { MyPageNavbar },
};
</script>
<style scope>
.chart-container {
  width: 70rem; /* 원하는 가로 크기 */
  height: 30rem; /* 원하는 세로 크기 */
  margin-top: 70px;
}
</style>
