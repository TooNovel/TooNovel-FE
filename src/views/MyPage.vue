<template>
  <div id="myPage">
    <MyPageNavbar></MyPageNavbar>
    <hr />
    <div>
      <label>이미지</label>
      <div>:<img :src="imageUrl" /></div>
    </div>
    <div>
      <label>닉네임</label>
      <input type="text" v-model="nickname" />
      <button>중복확인</button>
    </div>
    <button>회원탈퇴</button>
    <button>회원수정</button>
  </div>
</template>

<script>
import MyPageNavbar from "@/components/MyPageNavbar.vue";
import axios from "axios";

export default {
  data() {
    return {
      token: null,
      nickname: "",
      imageUrl: "",
    };
  },
  async created() {
    try {
      const option = {
        headers: {
          Authorization: "Bearer " + this.$getAccessToken(),
        },
      };
      const res = await axios.get(`/api/v1/user/me`, option);
      console.log(res);
      this.nickname = res.data.nickname;
    } catch (err) {
      console.log(err);
    }
  },
  components: { MyPageNavbar },
};
</script>
