<template>
  <div id="myPage">
    <MyPageHeader></MyPageHeader>
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
import MyPageHeader from "@/components/MyPageHeader.vue";

export default {
  data() {
    return {
      token: null,
      nickname: "",
      imageUrl: "",
    };
  },
  mounted() {
    this.nickname = this.$route.params.data.nickname;
    this.imageUrl = this.$route.params.data.imageUrl;
  },
  components: { MyPageHeader },
};
</script>
