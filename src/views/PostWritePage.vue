<template>
  <div id="PostWritePage">
    <label>게시판</label>
    <div>
      <label>제목</label>
      <input type="text" id="title" />
    </div>
    <div>
      <label>내용</label>
      <textarea id="content"></textarea>
    </div>
    <button @click="writePost()">작성</button>
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
  },
};
</script>

<style scoped></style>
