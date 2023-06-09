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
            <b-form-select v-model="category">
              <option value="--">-------</option>
              <option value="FREE">자유</option>
              <option value="NOVEL">소설</option>
              <option value="ASK">질문</option>
              <option value="SUGGEST">건의</option>
              <option value="PROMOTE">홍보</option>
            </b-form-select>
          </p>
        </div>
        <div id="textForm">
          <b-input
            type="text"
            placeholder="제목을 입력해주세요"
            v-model="title"
          ></b-input>
          <br />
          <b-textarea
            rows="20"
            placeholder="내용을 입력해주세요"
            v-model="content"
          ></b-textarea>
        </div>
      </div>
      <div class="card-footer">
        <div class="row justify-content-end">
          <div class="col">
            <b-button @click="toCommunity()">뒤로가기</b-button>
          </div>
          <div class="col-auto">
            <b-button @click="postWrite()">작성하기</b-button>
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
    return {
      title: "",
      content: "",
    };
  },
  methods: {
    async postWrite() {
      try {
        const post = {
          title: this.title,
          content: this.content,
          category: this.category,
        };
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };
        if (!post.title || !post.content || !post.category) {
          alert("제목, 내용, 카테고리를 모두 입력해주세요.");
        } else {
          axios.post("/api/v1/post", post, option).then(() => {
            router.push({ path: "/" });
          });
        }
      } catch (err) {
        console.log(err);
      }
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
