<template>
  <div>
    <div class="login">
      <h3>Login</h3>
      <a :href="GoogleLogin">구글 로그인</a>
      <br />
      <a :href="KaKaoLogin">카카오 로그인</a>
      <p></p>
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
};
</script>
<style scoped>
.login {
  width: 20%;
  margin-top: 5%;
  margin-left: auto;
  margin-right: auto;
}

button {
  width: 100%;
  margin-top: 10px;
}
</style>
