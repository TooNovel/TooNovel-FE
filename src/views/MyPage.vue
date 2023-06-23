<template>
  <div>
    <MyPageNavbar></MyPageNavbar>
    <div class="mypage">
      <h4>프로필 수정</h4>
      <div>
        <label for="file">
          <div class="btn-upload"><img :src="imageUrl" id="img-box" /></div>
          <label>⬆️클릭해서 이미지를 넣어주세요!</label>
        </label>
        <input
          id="file"
          type="file"
          ref="fileInput"
          accept="image/*"
          @change="getFileName($event.target.files)"
        />
      </div>
      <div class="nick-box">
        <label>닉네임</label>
        <input type="text" v-model="nickname" />
      </div>
      <div class="birth-box">
        <label>생년월일</label>
        <input type="text" v-model="birth" readonly disabled />
      </div>
      <div class="gender-box">
        <label>성별</label>
        <input type="text" v-model="gender" readonly disabled />
      </div>
      <button>회원탈퇴</button>
      <button @click="uploadImage">회원수정</button>
    </div>
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
      fileName: "",
    };
  },
  methods: {
    handleImageError(event) {
      event.target.src =
        "https://via.placeholder.com/600x600.png?text=No+Image";
    },
    async getFileName(files) {
      this.fileName = files[0];
      await this.base64(this.fileName);
    },
    base64(file) {
      return new Promise((resolve) => {
        let success = new FileReader();
        success.onload = (e) => {
          resolve(e.target.result);
          const previewImage = document.getElementById("img-box");
          previewImage.src = e.target.result;
        };
        success.readAsDataURL(file);
      });
    },
    async uploadImage() {
      const imageUrl = document.getElementById("img-box");
      if (imageUrl.src === this.imageUrl) {
        try {
          const option = {
            headers: {
              Authorization: "Bearer " + this.$getAccessToken(),
            },
          };
          await axios.patch(
            `${process.env.VUE_APP_API_URL}/user/me`,
            {
              nickname: this.nickname,
              imageUrl: this.imageUrl,
            },
            option
          );
          alert("회원 수정이 완료되었습니다.");
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          const res = await axios.get(`${process.env.VUE_APP_API_URL}/aws/s3`);
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
            `${process.env.VUE_APP_API_URL}/user/me`,
            {
              nickname: this.nickname,
              imageUrl: this.imageUrl,
            },
            option
          );
          alert("회원 수정이 완료되었습니다.");
        } catch (err) {
          console.error(err);
        }
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
      const res = await axios.get(
        `${process.env.VUE_APP_API_URL}/user/me`,
        option
      );
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

<style scoped>
* {
  font-family: "Hanna";
}
.mypage {
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 40px;
}
#img-box {
  border-radius: 100px;
  border-radius: 10px solid black;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  box-shadow: 2px 2px 2px 2px #a9eaa6;
}
.gender-box {
  margin: 10px;
}
.birth-box {
  margin: 10px;
}
.nick-box {
  margin: 10px;
}
input {
  margin-left: 5px;
  border: 0px;
  border-bottom: 2px solid #a9eaa6;
  border-radius: 30px;
  padding-left: 10px;
}

button {
  cursor: pointer;
  border-radius: 10px;
  border: 2px solid #93bb91;
  background-color: white;
  box-shadow: 1px 1px 1px 1px #a9eaa6;
  font-family: "Hanna";
  margin-left: 20px;
}

button:hover {
  background-color: #a9eaa6;
}

.btn-upload {
  width: 200px;
  height: 200px;
  background: #fff;
  border: 1px solid #a9eaa6;
  border-radius: 100px;
  box-shadow: 1px 1px 1px 1px #a9eaa6;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

#file {
  display: none;
}
</style>
