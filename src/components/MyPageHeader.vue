<template>
  <div id="myPage">
    <div>
      <ul>
        <li><b-button @click="mypage()">프로필</b-button></li>
        <li><b-button @click="getLikeNovel()">좋아요 누른 작품</b-button></li>
        <li><b-button @click="getMyReview()">내가 쓴 리뷰</b-button></li>
        <!-- 추후 v-if 사용해 작가이면 뜨게 하도록 구현 -->
        <li><b-button @click="getStatistic()">통계(작가만)</b-button></li>
      </ul>
    </div>
    <hr />
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      token: null,
      nickname: "",
      imageUrl: "",
    };
  },
  methods: {
    async getLikeNovel() {
      try {
        const option = {
          headers: {
            Authorization: "Bearer " + this.$store.getters.getAccessToken,
          },
        };

        const res = await axios.get(`/api/v1/user/novel?novelId=${0}`, option);
        console.log(res.data);

        this.$router.push({
          name: "MyLikeNovel",
          params: { data: res.data },
        });
      } catch (err) {
        console.log(err);
      }
    },
    async getStatistic() {
      try {
        const genderRes = await axios.get("/api/v1/statistics/1/1/gender");
        const ageRes = await axios.get("/api/v1/statistics/1/1/age");
        this.$router.push({
          name: "writer",
          params: {
            gender: genderRes.data,
            age: ageRes.data,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    async getMyReview() {
      try {
        const option = {
          headers: {
            Authorization: "Bearer " + this.$store.getters.getAccessToken,
          },
        };
        const res = await axios.get("/api/v1/review/myReview", option);
        this.$router.push({
          name: "MyReview",
          params: {
            data: res.data,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    async mypage() {
      try {
        const option = {
          headers: {
            Authorization: "Bearer " + this.$store.getters.getAccessToken,
          },
        };
        const res = await axios.get("/api/v1/user/me", option);
        this.$router.push({
          name: "MyPage",
          params: { data: res.data },
        });
      } catch (err) {
        if (err.code == "U001") {
          alert(err.message);
        } else if (this.accessToken == null || this.accessToken === "") {
          alert("로그인 후 좋아요 눌러주세요!");
        }
      }
    },
  },
};
</script>
