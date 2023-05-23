<template>
  <div>
    <canvas ref="myChart" width="400" height="400"></canvas>
    <canvas ref="myChart2" width="400" height="400"></canvas>
  </div>
</template>
<script>
import {
  Chart,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import axios from "axios";

Chart.register(BarController, CategoryScale, LinearScale, BarElement);

export default {
  data() {
    return {
      myChart: null,
      myChart2: null,
      statistics: [],
      statistics2: [],
      idxValue: ["0~10", "10~20", "20~30", "30~40", "40~50", "50~"],
      idxCount: [0, 0, 0, 0, 0, 0],
    };
  },
  async mounted() {
    try {
      const res = await axios.get("/api/v1/statistics/1/1/gender");
      const res2 = await axios.get("/api/v1/statistics/1/1/age");
      this.statistics = res.data;
      this.statistics2 = res2.data;
      res2.data.forEach((i) => {
        switch (i.age) {
          case "0~10":
            this.idxCount[0] = i.count;
            break;
          case "10~20":
            this.idxCount[1] = i.count;
            break;
          case "20~30":
            this.idxCount[2] = i.count;
            break;
          case "30~40":
            this.idxCount[3] = i.count;
            break;
          case "50~":
            this.idxCount[4] = i.count;
            break;
        }
      });
    } catch (err) {
      console.log(err);
    }
    const ctx = this.$refs.myChart.getContext("2d");
    const ctx2 = this.$refs.myChart2.getContext("2d");
    this.myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: this.idxValue,
        datasets: [
          {
            label: "데이터 개수",
            data: this.idxCount,
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
    this.myChart2 = new Chart(ctx2, {
      type: "bar",
      data: {
        labels: ["남성", "여성"],
        datasets: [
          {
            label: "데이터 개수",
            data: [this.statistics[0].count, this.statistics[1].count],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
            ],
            borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
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
  },
};
</script>

<style scoped>
/* 필요한 스타일을 추가할 수 있습니다. */
</style>
