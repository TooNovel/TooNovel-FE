<template>
  <div id="NovelRequestPage">
    <b-card>
      <div class="card-header">
        <div class="col">
          <h3><b>웹소설 신청하기</b></h3>
        </div>
        <div class="col-auto" style="text-align: right">
          찾으시는 웹소설이 없으신가요?
          <br />
          소설 신청을 통해 없는 웹소설을 알려주세요!
        </div>
      </div>
      <div class="card-body">
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
          <div class="col"></div>
          <div class="col-auto">
            <b-button @click="novelRequest()">작성하기</b-button>
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
  name: "NovelRequestPage",
  data() {
    return {
      title: "",
      content: "",
    };
  },
  methods: {
    async novelRequest() {
      try {
        const novel = {
          title: this.title,
          content: this.content,
          category: "SUGGEST",
        };
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };
        if (!novel.title || !novel.content) {
          alert("제목, 내용을 모두 입력해주세요.");
        } else {
          axios.post("/api/v1/post", novel, option).then(() => {
            router.push({ path: "/" });
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style scoped>
#NovelRequestPage {
  margin: 5%;
}
.card-header {
  display: flex;
  align-items: center;
}
.col {
  flex-grow: 1;
}
</style>
