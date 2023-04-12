<template>
  <div>
    <div class="join">
      <h3>Sign up</h3>
      <label for="gender" style="font-size: 20px">닉네임</label>
      <b-input-group>
        <b-input type="text" placeholder="닉네임을 입력해주세요." />
      </b-input-group>
      <br />
      <label for="date" style="font-size: 20px">생년월일</label>
      <b-form-datepicker v-model="date"></b-form-datepicker>
      <br />
      <label for="gender" style="font-size: 20px">성별</label>
      <p></p>
      <div class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="radio"
          name="inlineRadioOptions"
          id="inlineRadio1"
          value="option1"
        />
        <label class="form-check-label" for="inlineRadio1">남자</label>
      </div>
      <div class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="radio"
          name="inlineRadioOptions"
          id="inlineRadio1"
          value="option1"
        />
        <label class="form-check-label" for="inlineRadio1">여자</label>
      </div>
      <p></p>
      <b-button variant="primary">Sign up</b-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selected: null,
      options: [
        { text: "남자", value: "option1" },
        { text: "여자", value: "option2" },
      ],
    };
  },
};
</script>

<style scoped>
.join {
  width: 20%;
  margin-top: 5%;
  margin-left: auto;
  margin-right: auto;
}

button {
  width: 100%;
}
</style>
