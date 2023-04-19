<template>
  <div id="PostWritePage">
    <label>게시판</label>
    <select id="category">
      <option>00게시판</option>
      <option>11게시판</option>
      <option>22게시판</option>
    </select>
    <div>
      <label>제목</label>
      <input type="text" id="title" readonly />
    </div>
    <div>
      <label>내용</label>
      <textarea id="content"></textarea>
    </div>
    <button @click="updatePost">수정</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PostUpdatePage",
  data() {
    return {
      post: [],
    };
  },
  methods: {
    writePost() {
      const category = document.getElementById("category").value;
      // const title = document.getElementById('title').value
      const content = document.getElementById("content").value;
      const post = {
        category: category,
        // title : title,
        content: content,
      };

      axios.post("/post/update", post).then((res) => {
        alert(res.data);
        router.push({ path: "/" });
      });
    },
  },
  mounted: function () {
    axios.get(`/post/read/${pid}`).then((response) => {
      this.post = response.data.post;
    });
  },
};
</script>
<style scoped></style>
