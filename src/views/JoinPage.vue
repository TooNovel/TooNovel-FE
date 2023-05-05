<template>
  <div>
    <div class="join">
      <label for="gender" style="font-size: 20px"><b>닉네임</b></label>
      <b-input-group>
        <b-input
          type="text"
          id="nick_id"
          placeholder="닉네임을 입력해주세요."
        />
      </b-input-group>
      <br />
      <label for="date" style="font-size: 20px"><b>생년월일</b></label>
      <b-form-datepicker id="birth_id" v-model="date"></b-form-datepicker>
      <br />
      <label for="gender" style="font-size: 20px"><b>성별</b></label>
      <p></p>
      <div class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="radio"
          name="gender"
          id="man"
          value="man"
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
      date: null,
    };
  },
  methods: {
    signup() {
      const gender = document.querySelector(
        'input[name="gender"]:checked'
      ).value;
      const birth = this.date;
      const nickname = document.getElementById("nick_id").value;

      const obj = {
        gender: gender,
        birth: birth,
        nickname: nickname,
      };
      axios
        .patch("/api/v1/user/register", obj, {
          headers: {
            Authorization: "Bearer " + this.$store.getters.getAccessToken,
          },
        })
        .then((res) => {
          console.log(res.data);
          router.push({ path: "/" });
        })
        .catch((error) => {
          console.log(error);
        });
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
