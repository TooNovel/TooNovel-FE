<template>
  <div id="rankingBar">
    <div>
      <h3>TooNovel Top 30</h3>
      <p>TooNovel 에서 가장 인기 있는 작품 30개를 장르에 맞게 골라보세요</p>
    </div>
    <div>
      <ul id="list-box">
        <!-- 추후 밑의 모든 메서드가 다 변경될 예정 아직 일부 구현 -->
        <li><b-button @click="mypage()">top30</b-button></li>
        <li><b-button @click="getLikeNovel()">판타지</b-button></li>
        <li><b-button @click="getMyReview()">로맨스판타지</b-button></li>
        <li><b-button @click="getMyReview()">로맨스</b-button></li>
        <li><b-button @click="getMyReview()">현대판타지</b-button></li>
        <li><b-button @click="getMyReview()">무협</b-button></li>
        <li><b-button @click="getMyReview()">미스터리</b-button></li>
        <li><b-button @click="getMyReview()">라이트노벨</b-button></li>
        <li><b-button @click="getMyReview()">BL</b-button></li>
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
      novelId: "",
      role: null,
    };
  },
  methods: {
    async getLikeNovel() {
      try {
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };

        const res = await axios.get(`/api/v1/user/novel?novelId=${0}`, option);
        localStorage.setItem("MyLikeNovel", JSON.stringify(res.data));
        this.$router.push({
          name: "MyLikeNovel",
          params: { data: res.data },
        });
      } catch (err) {
        console.log(err);
      }
    },
    async getMyReview() {
      try {
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
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
            Authorization: "Bearer " + this.$getAccessToken(),
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
        } else if (
          this.$getAccessToken() == null ||
          this.$getAccessToken() === ""
        ) {
          alert("로그인 후 좋아요 눌러주세요!");
        }
      }
    },
    async getNovelByAuthor() {
      try {
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };
        const res = await axios.get("/api/v1/novel/author", option);
        this.$router.push({
          name: "AuthorNovelPage",
          params: { data: res.data },
        });
      } catch (err) {
        if (err.code == "U001") {
          alert(err.message);
        } else if (
          this.$getAccessToken() == null ||
          this.$getAccessToken() === ""
        ) {
          alert("로그인 후 좋아요 눌러주세요!");
        }
      }
    },
    async adminUser() {
      // 회원 관리 페이지 이동 및 데이터 전달 추가 예정
      try {
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };
        const res = await axios.get(`/api/v1/user?page=${0}`, option);
        this.$router.push({
          name: "AdminUserPage",
          params: { data: res.data },
        });
      } catch (err) {
        console.log(err);
      }
    },
    async adminAuthor() {
      try {
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };
        const res = await axios.get(`/api/v1/admin?page=${0}`, option);
        this.$router.push({
          name: "AdminAuthorPage",
          params: { data: res.data },
        });
      } catch (err) {
        console.log(err);
      }
    },
    enrollAuthor() {
      this.$router.push("Enroll");
    },
  },
  mounted() {
    const accessToken = this.$getAccessToken();
    this.role = this.$getTokenInfo(accessToken).role;
  },
};
</script>
<style scoped>
#list-box {
  display: flex;
  justify-content: center;
  margin: 50px;
  padding: 50px;
}
#list-box > li {
  margin: 20px;
}
</style>
