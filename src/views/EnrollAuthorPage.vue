<template>
  <div id="enrollAuthorPage">
    <MyPageHeader></MyPageHeader>
    <hr />
    <div>
      <label>닉네임</label>
      <input type="text" v-model="nickname" />
    </div>
    <button @click="enrollAuthor()">작가신청</button>
  </div>
</template>

<script>
import MyPageHeader from "@/components/MyPageHeader.vue";
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
    async enrollAuthor() {
      if (
        confirm(
          "닉네임이 올바르지 않거나 잘못 입력하면 작가 신청이 올바르게 되지 않습니다.제대로 닉네임을 입력하셨다면 확인을 눌러주세요"
        )
      ) {
        try {
          const nickname = this.nickname;
          alert(nickname);
          const option = {
            headers: {
              Authorization: "Bearer " + this.$getAccessToken(),
            },
          };
          const res = await axios.post(
            "/api/v1/user/author",
            {
              nickname: nickname,
            },
            option
          );
          if (res.data) {
            alert("작가 신청이 완료되었습니다.");
            this.$router.push("/");
          }
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
      }
    },
  },
  components: { MyPageHeader },
};
</script>
