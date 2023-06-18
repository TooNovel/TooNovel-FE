<template>
  <div id="myPage">
    <MyPageNavbar></MyPageNavbar>
    <hr />
    <div>
      <label>이미지</label>
      <div>:<img :src="imageUrl" /></div>
      <input type="file" ref="fileInput" accept="image/*" />
    </div>
    <div>
      <label>닉네임</label>
      <input type="text" v-model="nickname" />
    </div>
    <div>
      <label>생년월일</label>
      <input type="text" v-model="birth" readonly />
    </div>
    <div>
      <label>성별</label>
      <input type="text" v-model="gender" readonly />
    </div>

    <button>회원탈퇴</button>
    <button @click="uploadImage">회원수정</button>
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
      gender: "",
      imageUrl: "",
      birth: "",
    };
  },
  methods: {
    handleImageError(event) {
      event.target.src =
        "https://via.placeholder.com/600x600.png?text=No+Image";
    },
    async uploadImage() {
      try {
        const res = await axios.get("/api/v1/aws/s3");
        const preSignedUrl = res.data.preSignedUrl;
        const encodedFileName = res.data.encodedFileName;
        try {
          const fileInput = this.$refs.fileInput;
          const file = fileInput.files[0];
          await axios.put(preSignedUrl, file);
          const uploadedUrl = `${process.env.VUE_APP_S3_PATH}/${encodedFileName}`;
          this.imageUrl = uploadedUrl;
        } catch (error) {
          console.error(error);
        }
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };
        await axios.patch(
          "/api/v1/user/me",
          {
            nickname: this.nickname,
            imageUrl: this.imageUrl,
          },
          option
        );
      } catch (err) {
        console.error(err);
      }
    },
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
      this.gender = res.data.gender;
      this.imageUrl = res.data.imageUrl;
      this.birth = res.data.birth;
    } catch (err) {
      console.log(err);
    }
  },
  components: { MyPageNavbar },
};
</script>
