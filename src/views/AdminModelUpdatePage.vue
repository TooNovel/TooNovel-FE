<template>
  <div>
    <MyPageNavbar></MyPageNavbar>
    <div>
      <h1>모델 업데이트</h1>
      <button @click="updateModel">모델 업데이트</button>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import MyPageNavbar from "@/components/MyPageNavbar.vue";

export default {
  methods: {
    async updateModel() {
      this.message = "추천 모델을 학습중입니다.";
      try {
        await axios.put(`${process.env.VUE_APP_API_URL}/recommend`);
        this.generateRecommend();
      } catch (err) {
        alert(err);
      }
    },
  },
  components: { MyPageNavbar },
};
</script>
