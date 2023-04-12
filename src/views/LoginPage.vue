<template>
  <div>
    <div class="login">
      <h3>Login</h3>
      <b-button variant="warning">카카오 로그인</b-button><br />
      <b-button variant="danger">구글 로그인</b-button>
      <p></p>
      <div>회원이 아니신가요? <a href="/join">회원가입</a> 하러가기</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "loginPage",
  data() {
    return {};
  },
  methods: {},
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
