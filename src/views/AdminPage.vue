<template>
  <div>
    <canvas ref="myChart" width="400" height="400"></canvas>
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

Chart.register(LineController, LineElement, PointElement, Tooltip);

export default {
  data() {
    return {
      myChart: null,
      statistics: [],
      idxValue: [],
      idxCount: [],
    };
  },
  async mounted() {
    try {
      const res = await axios.get("/api/v1/admin/review");
      this.statistics = res.data;
      this.idxValue = this.statistics.map((i) => i.createdDate);
      this.idxCount = this.statistics.map((i) => i.count);
      const ctx = this.$refs.myChart.getContext("2d");
      this.myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: this.idxValue,
          datasets: [
            {
              label: "Dataset",
              data: this.idxCount,
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
              text: (ctx) =>
                "Point Style: " + ctx.chart.data.datasets[0].pointStyle,
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
  },
};
</script>
<style scoped>
/* 필요한 스타일을 추가할 수 있습니다. */
</style>
