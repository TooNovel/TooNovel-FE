<template>
  <div id="myPage">
    <div>
      <ul>
        <li><b-button @click="mypage()">프로필</b-button></li>
        <li><b-button @click="getLikeNovel()">좋아요 누른 작품</b-button></li>
        <li><b-button @click="getMyReview()">내가 쓴 리뷰</b-button></li>
        <div v-if="role == 'USER'">
          <li><b-button @click="enrollAuthor()">작가신청</b-button></li>
        </div>
        <div v-if="role == 'AUTHOR'">
          <li><b-button @click="getNovelByAuthor()">내작품보기</b-button></li>
        </div>
        <div v-if="role == 'ADMIN'">
          <li><b-button @click="adminUser()">회원 관리</b-button></li>
        </div>
        <div v-if="role == 'ADMIN'">
          <li><b-button @click="adminAuthor()">작가 신청 관리</b-button></li>
        </div>
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
