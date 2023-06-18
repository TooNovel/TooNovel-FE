<template>
  <div>
    <div class="join">
      <b style="font-size: 20px">닉네임</b>
      <b-input-group>
        <b-input
          type="text"
          id="nick_id"
          placeholder="닉네임을 입력해주세요."
          v-model="nickname"
        />
      </b-input-group>
      <br />
      <b style="font-size: 20px">생년월일</b>
      <b-form-datepicker id="birth_id" v-model="birth"></b-form-datepicker>
      <br />
      <b style="font-size: 20px">성별</b>
      <br />
      <div class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="radio"
          name="gender"
          id="man"
          value="man"
          v-model="gender"
        />
        <label class="form-check-label" for="man">남자</label>
      </div>
      <div class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="radio"
          name="gender"
          id="woman"
          value="woman"
          v-model="gender"
        />
        <label class="form-check-label" for="woman">여자</label>
      </div>
      <p></p>
      <b-button variant="primary" @click="signup()">Sign up</b-button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import router from "@/router/index";

export default {
  name: "SignupView",
  data() {
    return {
      birth: null,
      gender: null,
      nickname: null,
    };
  },
  methods: {
    async signup() {
      if (
        this.gender == null ||
        this.gender == "" ||
        this.birth == null ||
        this.birth == "" ||
        this.nickname == null ||
        this.nickname == ""
      ) {
        alert("빈 칸이 있습니다. 모두 작성해주세요.");
      } else {
        try {
          const obj = {
            gender: this.gender,
            birth: this.birth,
            nickname: this.nickname,
          };
          const option = {
            headers: {
              Authorization: "Bearer " + this.$getAccessToken(),
            },
          };

          const res = await axios.patch("/api/v1/user/join", obj, option);
          console.log(res.data);
          router.push({ path: "/" });
        } catch (err) {
          console.log(err);
        }
      }
    },
  },
};
</script>

<style scoped>
.join {
  width: 20%;
  margin-top: 5%;
  margin-left: auto;
  margin-right: auto;
  background-color: white;
  padding: 2rem;
  border-radius: 1rem;
}

button {
  width: 100%;
}
</style>
