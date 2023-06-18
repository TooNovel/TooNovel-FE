<template>
  <div>
    <div id="loading" v-if="isLoading" style="height: 600px">
      <div class="loader">Loading...</div>
    </div>
    <main style="margin-top: 3%">
      <article>
        <b-container class="bv-example-row">
          <b-row class="rows">
            <b-col>
              <img id="image" :src="novel.image" />
            </b-col>
            <b-col class="col-9">
              <b>제목</b>
              <p>{{ novel.title }}</p>
              <b>장르</b>
              <p>{{ novel.genre }}</p>
              <b>작가</b>
              <p>{{ novel.author }}</p>
              <novel-like :novel="novel"></novel-like>
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
                <b-textarea rows="10" type="text" v-model="reviewContent">
                </b-textarea>
              </div>
              <div class="col" style="margin-top: 1%">
                <label><b>평점 남기기ㅤ</b></label>
                <b-form-select v-model="reviewGrade">
                  <option value="--">------</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </b-form-select>
                <b-button
                  id="reviewBtn"
                  @click="reviewWrite()"
                  style="margin-left: 1%"
                  >등록</b-button
                >
              </div>
            </b-form>
          </div>
        </b-container>
        <br />
        <b-container>
          <h4><b>🗨️리뷰</b></h4>
          <div v-for="review in reviews" v-bind:key="review.reviewId">
            <div class="reviewBox">
              <div class="row">
                <div class="col">
                  <p><b>작성자ㅤ</b>{{ review.nickname }}</p>
                </div>
                <div class="col">
                  <div class="row">
                    <div class="col">
                      <p><b>작성일자ㅤ</b>{{ review.createdDate }}</p>
                    </div>
                    <div v-if="userId === review.userId" class="col-1">
                      <button
                        @click="deleteReview(review.reviewId)"
                        type="button"
                        aria-label="Close"
                        class="close"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <p>{{ review.reviewContent }}</p>
              </div>
              <div class="row">
                <div class="col">평점 : {{ review.reviewGrade }}</div>
                <div class="col">
                  <div class="right_area">
                    <button
                      @click="reviewLike(review)"
                      :class="{ active: review.isActived }"
                    >
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/803/803087.png"
                        width="24"
                        height="24"
                      />
                    </button>
                    좋아요 : {{ review.reviewLike }}
                  </div>
                </div>
              </div>
            </div>
            <br />
          </div>
        </b-container>
      </article>
      <div class="template-container">
        <div id="suggest">
          <b>찾으시는 웹소설이 없으신가요?</b>
          <p>작품 신청을 통해 빠진 작품을 알려주세요!</p>
          <b-button variant="info" @click="novelRequest()">신청하기</b-button>
        </div>
      </div>
    </main>
  </div>
</template>
<script scoped>
import axios from "axios";
import NovelLike from "@/components/NovelLike.vue";

export default {
  name: "NovelDetailPage",
  data() {
    return {
      novel: {},
      reviews: [],
      reviewContent: "",
      reviewGrade: 0,
      selectedGrade: "--",
      novelLiked: false,
      userId: "",
      isLoading: true,
    };
  },
  async created() {
    await this.sleep(1500);
    try {
      if (this.$getAccessToken() != null) {
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };
        const user = await axios.get("/api/v1/user/me", option);
        this.userId = user.data.userId;
      }
      const id = this.$route.params.novel_id;

      const novelRes = await axios.get("/api/v1/novel/" + id);
      this.novel = novelRes.data;

      const reviewRes = await axios.get("/api/v1/review/" + id + "/novel");
      this.reviews = reviewRes.data.content;

      this.reviews.forEach((review) => {
        review.createdDate = `${review.createdDate[0]} / ${review.createdDate[1]} / ${review.createdDate[2]}`;
      });
      this.isLoading = false;
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    async reviewWrite() {
      try {
        const obj = {
          reviewContent: this.reviewContent,
          reviewGrade: this.reviewGrade,
          writerId: 0,
          novelId: this.novel.novelId,
        };
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };
        const res = await axios.post("/api/v1/review", obj, option);
        const newReview = res.data;
        this.reviews.push(newReview);
        this.$router.go(0);
      } catch (err) {
        if (this.$getAccessToken() == null || this.$getAccessToken() === "") {
          alert("로그인 후 리뷰 작성할 수 있습니다!");
        }
        console.log(err);
      }
    },
    async reviewLike(res) {
      try {
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };
        await axios.post(
          "/api/v1/review/" + res.reviewId + "/like",
          null,
          option
        );
        const result = await axios.get(
          "/api/v1/review/" + this.novel.novelId + "/novel",
          option
        );
        const clickReview = result.data.content.find(
          (review) => review.reviewId === res.reviewId
        );
        res.reviewLike = clickReview.reviewLike;
      } catch (err) {
        const errStatus = err.response.data;
        if (errStatus.code == "R004") {
          alert(errStatus.message);
        } else if (
          this.$getAccessToken() == null ||
          this.$getAccessToken() === ""
        ) {
          alert("로그인 후 좋아요 눌러주세요!");
        }
      }
    },
    async deleteReview(reviewId) {
      try {
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };
        await axios.delete("/api/v1/review/" + reviewId, option);
        this.$router.go(0);
      } catch (err) {
        const errStatus = err.response.data;
        console.log(err);
        if (errStatus.code == "R004") {
          alert(errStatus.message);
        } else if (
          this.$getAccessToken() == null ||
          this.$getAccessToken() === ""
        ) {
          alert("로그인 후 좋아요 눌러주세요!");
        }
      }
    },
    async sleep(sec) {
      return new Promise((resolve) => setTimeout(resolve, sec));
    },
    novelRequest() {
      this.$router.push("/post/request");
    },
  },
  components: {
    "novel-like": NovelLike,
  },
};
</script>
<style scoped>
@import "@/style/novel-detail.css";
@import "@/style/loader.css";
#loading {
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
}
#suggest {
  font-size: 12px;
  position: fixed;
  top: 43%;
  right: 1%;
  transform: translateY(-50%);
  background-color: white;
  border-radius: 10px;
  padding: 1%;
  display: grid;
  place-items: center;
}
</style>
