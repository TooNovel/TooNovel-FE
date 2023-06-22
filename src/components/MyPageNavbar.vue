<template>
  <div class="mypage-nav">
    <div class="ul-nav">
      <ul>
        <div v-if="role == 'USER'">
          <li><button @click="mypage()">프로필</button></li>
          <li>
            <button @click="getLikeNovel()">좋아요 한 작품</button>
          </li>
          <li>
            <button @click="getMyReview()">작성한 리뷰</button>
          </li>
          <li>
            <button @click="enrollAuthor()">작가 신청</button>
          </li>
        </div>
        <div v-if="role == 'AUTHOR'">
          <li><button @click="mypage()">프로필</button></li>
          <li>
            <button @click="getLikeNovel()">좋아요 한 작품</button>
          </li>
          <li>
            <button @click="getMyReview()">작성한 리뷰</button>
          </li>
          <li>
            <button @click="getNovelByAuthor()">내 작품</button>
          </li>
        </div>
        <div v-if="role == 'ADMIN'">
          <li><button @click="mypage()">프로필</button></li>
          <li>
            <button @click="adminAuthor()">작가 신청 관리</button>
          </li>
          <li>
            <button @click="adminStastistic()">통계 조회</button>
          </li>
          <li>
            <button @click="adminModelUpdate()">모델 업데이트</button>
          </li>
        </div>
      </ul>
      <hr />
    </div>
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

        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/user/novel?novelId=${0}`,
          option
        );
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
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/review/myReview`,
          option
        );
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
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/user/me`,
          option
        );
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
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/novel/author`,
          option
        );
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
    // 현재 회원관리 페이지 api가 없는 관계로 추후 추가되면 사용 예정
    // async adminUser() {
    //   // 회원 관리 페이지 이동 및 데이터 전달 추가 예정
    //   try {
    //     const option = {
    //       headers: {
    //         Authorization: "Bearer " + this.$getAccessToken(),
    //       },
    //     };
    //     const res = await axios.get(
    //       `${process.env.VUE_APP_API_URL}/user?page=${0}`,
    //       option
    //     );
    //     this.$router.push({
    //       name: "AdminUserPage",
    //       params: { data: res.data },
    //     });
    //   } catch (err) {
    //     console.log(err);
    //   }
    // },
    async adminAuthor() {
      try {
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/admin?page=${0}`,
          option
        );
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
    adminStastistic() {
      this.$router.push("/admin");
    },
    adminModelUpdate() {
      this.$router.push("/model");
    },
  },
  mounted() {
    const accessToken = this.$getAccessToken();
    this.role = this.$getTokenInfo(accessToken).role;
    console.log(this.role);
  },
};
</script>
<style scoped>
.ul-nav > ul > div {
  display: flex;
  justify-content: center;
  text-align: center;
}
li {
  margin: 10px;
}

ul {
  list-style-type: none;
}
button {
  cursor: pointer;
  border-radius: 10px;
  border: 2px solid #93bb91;
  background-color: white;
  box-shadow: 1px 1px 1px 1px #a9eaa6;
  font-family: "Hanna";
}
button:hover {
  background-color: #a9eaa6;
}
</style>
