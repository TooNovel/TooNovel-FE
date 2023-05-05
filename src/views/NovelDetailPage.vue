<template>
  <div>
    <b-nav tabs style="background-color: white">
      <b-nav-item>전체</b-nav-item>
      <b-nav-item>로맨스</b-nav-item>
      <b-nav-item>무협</b-nav-item>
      <b-nav-item>판타지</b-nav-item>
      <b-nav-item>미스터리</b-nav-item>
      <b-nav-item>대체역사</b-nav-item>
      <b-nav-item>라이트노벨</b-nav-item>
    </b-nav>
    <main style="margin-top: 5%">
      <article>
        <b-container class="bv-example-row">
          <b-row class="rows">
            <b-col>
              <img :src="novel.image" />
            </b-col>
            <b-col class="col-9">
              <b>제목</b>
              <p>{{ novel.title }}</p>
              <b>장르</b>
              <p>{{ novel.genre }}</p>
              <b>작가</b>
              <p>{{ novel.author }}</p>
            </b-col>
          </b-row>
          <br />
          <div class="row">
            <div class="descrption">
              <label><b>간단 소개</b></label>
              <p>{{ novel.description }}</p>
            </div>
          </div>
        </b-container>
        <br />
        <b-container>
          <h6><b>리뷰 작성하기</b></h6>
          <div class="row">
            <b-form>
              <div class="col">
                <b-textarea rows="10" type="text" v-model="reviewcontent">
                </b-textarea>
              </div>
              <div class="col" style="margin-top: 1%">
                <label><b>평점 남기기ㅤ</b></label>
                <b-form-select v-model="selectedGrade">
                  <option value="--">------</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </b-form-select>
                <b-button @click="reviewWrite()" style="margin-left: 1%"
                  >등록</b-button
                >
              </div>
            </b-form>
          </div>
        </b-container>
        <br />
        <b-container>
          <h4><b>🗨️리뷰</b></h4>
          <div v-for="review in reviews.content" v-bind:key="review.id">
            <div class="reviewBox">
              <div class="row">
                <div class="col">
                  <p><b>작성자ㅤ</b>{{ review.nickname }}</p>
                </div>
                <div class="col">
                  <p><b>작성일자ㅤ</b>{{ createdDate }}</p>
                </div>
              </div>
              <div class="row">
                <p>{{ review.reviewContent }}</p>
              </div>
              <div class="row">
                <p class="col">평점 : {{ review.reviewGrade }}</p>
                <p class="col">👍좋아요 : {{ review.reviewLike }}</p>
              </div>
            </div>
            <br />
          </div>
        </b-container>
      </article>
    </main>
  </div>
</template>
<script scoped>
import axios from "axios";
export default {
  name: "WorkDetailPage",
  data() {
    return {
      novel: {},
      reviews: {},
      reviewcontent: "",
      reviewGrade: 0,
      selectedGrade: "--",
      createdDate: {},
    };
  },
  created() {
    const id = this.$route.params.novel_id;
    axios
      .get("/api/v1/novel/" + id)
      .then((response) => {
        this.novel = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get("/api/v1/review/" + id + "/novel")
      .then((response) => {
        this.reviews = response.data;
        const year = this.reviews.content[0].createdDate[0];
        const month = this.reviews.content[0].createdDate[1];
        const day = this.reviews.content[0].createdDate[2];
        this.createdDate = year + "/" + month + "/" + day;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    reviewWrite() {
      const reviewContent = this.reviewcontent;
      const reviewGrade = this.reviewGrade;
      const novelId = this.novel.novelId;
      axios
        .post(
          "/api/v1/review",
          {
            reviewContent: reviewContent,
            reviewGrade: reviewGrade,
            writerId: 0,
            novelId: novelId,
          },
          {
            headers: {
              Authorization: "Bearer " + this.$store.getters.getAccessToken,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          this.reviews = response.data;
          this.$router.go(0);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
<style scoped>
img {
  border-width: 30px;
  border-style: solid;
  border-color: white;
  border-radius: 10px;
}
.col-9 {
  background-color: white;
  border-radius: 10px;
  padding: 2%;
}
.descrption {
  background-color: white;
  border-radius: 10px;
  padding: 2%;
}
.reviewBox {
  background-color: white;
  padding: 1rem;
  border-radius: 10px;
}
</style>
