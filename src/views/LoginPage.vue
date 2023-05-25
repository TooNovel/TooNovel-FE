<template>
  <div>
    <div class="form">
      <div class="login">
        <img src="/TooNovel_logo_light.png" width="200" height="200" />
        <h2>로그인</h2>
        <br />
        <div>
          <h5>
            <p>지금 웹소설 리뷰 쓰고, 내 취향에 맞는</p>
          </h5>
          <h5>
            <span>웹소설을 추천 받아보세요!</span>
          </h5>
        </div>
        <hr />
        <br />
        <img
          @click="ToGoogleLogin()"
          src="/google_login.png"
          width="295"
          height="60"
        />
        <br />
        <br />
        <img
          src="/kakao_login_large_wide.png"
          @click="ToKakaoLogin()"
          width="290"
        />
        <p></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "loginPage",
  data() {
    return {
      GoogleLogin: process.env.VUE_APP_API_URL + `/oauth2/authorize/google`,
      KaKaoLogin: process.env.VUE_APP_API_URL + `/oauth2/authorize/kakao`,
    };
  },
  methods: {
    ToKakaoLogin() {
      location.href = this.KaKaoLogin;
    },
    ToGoogleLogin() {
      location.href = this.GoogleLogin;
    },
  },
};
</script>
<style scoped>
.form {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5%;
  background-color: white;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 12px;
  padding-bottom: 20px;
}

.login {
  text-align: center;
}

button {
  width: 100%;
  margin-top: 10px;
}
h5,
h2 {
  font-family: "Hanna";
}
</style>
