<template>
  <div id="PostWritePage">
    <b-card>
      <div class="card-header">
        <h3><b>글 작성하기</b></h3>
      </div>
      <div class="card-body">
        <div>
          <label>종류를 선택해주세요</label>
          <p>
            <b-form-select>
              <option value="--">-------</option>
              <option value="자유">자유</option>
              <option value="장르">장르</option>
              <option value="질문">질문</option>
              <option value="이벤트">이벤트</option>
            </b-form-select>
          </p>
        </div>
        <div id="textForm">
          <b-input type="text" placeholder="제목을 입력해주세요"></b-input>
          <br />
          <b-textarea rows="20" placeholder="내용을 입력해주세요"></b-textarea>
        </div>
      </div>
      <div class="card-footer">
        <div class="row justify-content-end">
          <div class="col">
            <b-button @click="toCommunity()">뒤로가기</b-button>
          </div>
          <div class="col-auto">
            <b-button @click="writePost()">작성하기</b-button>
          </div>
        </div>
      </div>
    </b-card>
  </div>
</template>
<script>
import axios from "axios";
import router from "@/router";

export default {
  name: "PostWritePage",
  data() {
    return {};
  },
  methods: {
    writePost() {
      const title = document.getElementById("title").value;
      const content = document.getElementById("content").value;
      const post = {
        userId: 1,
        category: "FANTASY",
        title: title,
        content: content,
      };
      axios.post("/post/write", post).then((res) => {
        alert(res.data);
        router.push({ path: "/" });
      });
    },
    toCommunity() {
      // axios.get("/post/readall").then((data) => {
      //   this.$router.push({
      //     name: "Community",
      //     params: data,
      //   });
      // });
      this.$router.push("/community");
    },
  },
};
</script>

<style scoped>
#PostWritePage {
  margin: 5%;
}
</style>
