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
                  <p><b>작성일자ㅤ</b>{{ review.createdDate }}</p>
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
      accessToken: this.$store.getters.getAccessToken,
    };
  },
  async created() {
    try {
      // const [novelRes, reviewRes] = await Promise.all([
      //   axios.get("/api/v1/novel/" + id),
      //   axios.get("/api/v1/review/" + id + "/novel"),
      // ]);
      const id = this.$route.params.novel_id;

      const novelRes = await axios.get("/api/v1/novel/" + id);
      this.novel = novelRes.data;

      const reviewRes = await axios.get("/api/v1/review/" + id + "/novel");
      this.reviews = reviewRes.data.content;

      // const [year, month, day] = this.reviews.content[0].createdDate;
      // this.createdDate = `${year}/${month}/${day}`;

      this.reviews.forEach((review) => {
        review.createdDate = `${review.createdDate[0]} / ${review.createdDate[1]} / ${review.createdDate[2]}`;
      });
      console.log(this.reviews);
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
            Authorization: "Bearer " + this.$store.getters.getAccessToken,
          },
        };
        const res = await axios.post("/api/v1/review", obj, option);
        const newReview = res.data;
        this.reviews.push(newReview);
        this.$router.go(0);
      } catch (err) {
        if (this.accessToken == null || this.accessToken === "") {
          alert("로그인 후 리뷰 작성할 수 있습니다!");
        }
        console.log(err);
      }
    },
    async reviewLike(res) {
      try {
        const option = {
          headers: {
            Authorization: "Bearer " + this.$store.getters.getAccessToken,
          },
        };
        await axios.post(
          "/api/v1/review/" + res.reviewId + "/like",
          null,
          option
        );
        res.reviewLike++;
      } catch (err) {
        console.log(err.response.data.code);
        const errStatus = err.response.data;
        if (errStatus.code == "R004") {
          alert(errStatus.message);
        } else if (this.accessToken == null || this.accessToken === "") {
          alert("로그인 후 좋아요 눌러주세요!");
        }
      }
    },
  },
  components: {
    "novel-like": NovelLike,
  },
};
</script>
<style scoped>
#reviewBtn {
  border-radius: 1px;
}
#image {
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
button {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  border-radius: 50%;
  border: solid 2px #eaeaea;
  background-color: white;
}

.active {
  width: calc(100vw * (45 / 1920));
  height: calc(100vw * (45 / 1920));
}
.active img {
  width: 24px;
  height: 24px;
}
.active img {
  animation: animateHeart 0.3s linear forwards;
}
@keyframes animateHeart {
  0% {
    transform: scale(0.2);
  }

  40% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}
</style>
