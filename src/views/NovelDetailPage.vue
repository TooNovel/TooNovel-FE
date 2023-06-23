<template>
  <div id="reviewContent">
    <div id="reviewWrap">
      <div id="loading" v-if="isLoading" style="height: 600px">
        <div class="loader">Loading...</div>
      </div>
      <main v-else style="margin-top: 3%">
        <article>
          <b-container class="bv-example-row">
            <div class="row">
              <div id="imageDiv" class="col-1">
                <img id="image" :src="novel.image" />
              </div>
              <div id="novelContent" class="col">
                <div id="novelWrap">
                  <h2>
                    <b>{{ novel.title }}</b>
                  </h2>
                  <hr />
                  <h5>{{ novel.genre }} | {{ novel.author }}</h5>
                  <novel-like :novel="novel"></novel-like>
                  <div class="platform-buttons">
                    <a
                      v-for="platform in novel.platforms"
                      :key="platform.platformId"
                      :href="platform.url"
                    >
                      <button class="platform-button">
                        <img
                          v-if="platform.platformId === 1"
                          src="/series.png"
                          alt="네이버 시리즈"
                          class="platform-image"
                        />
                        <img
                          v-if="platform.platformId === 2"
                          src="/kakaopage.png"
                          alt="카카오페이지"
                          class="platform-image"
                        />
                        <img
                          v-if="platform.platformId === 3"
                          src="/munpia.png"
                          alt="문피아"
                          class="platform-image"
                        />
                        <span class="platform-name">{{
                          platform.platformName
                        }}</span>
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <br />
          </b-container>
          <b-container>
            <div class="descrption">
              <label><b>간단 소개</b></label>
              <p>{{ novel.description }}</p>
            </div>
          </b-container>
          <br />
          <br />
          <b-container>
            <div>
              <div class="row">
                <div class="col">
                  <h4>리뷰 작성하기</h4>
                </div>
                <div class="col">
                  <div style="display: flex; justify-content: flex-end">
                    <div>
                      <star-rating
                        :border-width="4"
                        border-color="#d8d8d8"
                        :rounded-corners="true"
                        :star-size="30"
                        v-model="reviewGrade"
                        :star-points="[
                          23, 2, 14, 17, 0, 19, 10, 34, 7, 50, 23, 43, 38, 50,
                          36, 34, 46, 19, 31, 17,
                        ]"
                      ></star-rating>
                    </div>
                    <div style="margin-left: 5%">
                      <button
                        class="w-btn-outline w-btn-green-outline"
                        type="button"
                        @click="reviewWrite()"
                        id="reviewBtn"
                      >
                        등록
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div class="row">
              <b-form>
                <div class="col">
                  <b-textarea rows="10" type="text" v-model="reviewContent">
                  </b-textarea>
                </div>
              </b-form>
            </div>
          </b-container>
          <br />
          <b-container>
            <h4>🗨️리뷰</h4>
            <div v-for="review in reviews" v-bind:key="review.reviewId">
              <div class="reviewBox">
                <div class="row">
                  <div class="col">
                    <div id="profile">
                      <div>
                        <div>
                          <img :src="review.imageUrl" width="50px" />
                        </div>
                      </div>
                      <div id="profile_name">
                        <b>{{ review.nickname }}</b>
                      </div>
                    </div>
                  </div>
                  <div class="col">
                    <div class="row">
                      <div class="review-block">
                        <div class="col">
                          <div class="row">
                            <div class="col-11" id="createDate">
                              {{ review.createdDate }}
                            </div>
                            <div
                              v-if="userId === review.userId"
                              class="col-1"
                              id="deleteBtn"
                            >
                              <div style="font-size: 1rem; margin-right: 5px">
                                <b-icon
                                  icon="x-circle"
                                  @click="deleteReview(review.reviewId)"
                                ></b-icon>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="reviewContent">
                  {{ review.reviewContent }}
                </div>
                <div class="row">
                  <div class="col"></div>
                  <div class="col">
                    <div class="row">
                      <div class="review-block">
                        <div class="col">
                          <div class="row">
                            <div class="col-10" id="createDate">
                              <star-rating
                                :border-width="4"
                                border-color="#d8d8d8"
                                :rounded-corners="true"
                                :star-size="20"
                                v-model="review.reviewGrade"
                                read-only
                                :star-points="[
                                  23, 2, 14, 17, 0, 19, 10, 34, 7, 50, 23, 43,
                                  38, 50, 36, 34, 46, 19, 31, 17,
                                ]"
                              ></star-rating>
                            </div>
                            <div class="col">
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
                              {{ review.reviewLike }}
                            </div>
                          </div>
                        </div>
                      </div>
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
            <b id="memo">웹소설 신청💡</b>
            <p>찾으시는 웹소설이 없으신가요?</p>
            <p>작품 신청을 통해 빠진 작품을 알려주세요!</p>
            <button
              class="w-btn-outline w-btn-green-outline"
              type="button"
              @click="novelRequest()"
              id="reviewBtn"
            >
              신청하기
            </button>
            <!-- <b-button @click="novelRequest()">신청하기</b-button> -->
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
<script scoped>
import axios from "axios";
import NovelLike from "@/components/NovelLike.vue";
import StarRating from "vue-star-rating";

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
      isLoading: false,
    };
  },
  async created() {
    this.isLoading = true;
    await this.sleep(1500);
    try {
      if (this.$getAccessToken() != null) {
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };
        const user = await axios.get(
          `${process.env.VUE_APP_API_URL}/user/me`,
          option
        );
        this.userId = user.data.userId;
      }
      const id = this.$route.params.novel_id;

      const novelRes = await axios.get(
        `${process.env.VUE_APP_API_URL}/novel/` + id
      );
      this.novel = novelRes.data;

      const reviewRes = await axios.get(
        `${process.env.VUE_APP_API_URL}/review/` + id + "/novel"
      );
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
        const res = await axios.post(
          `${process.env.VUE_APP_API_URL}/review`,
          obj,
          option
        );
        const newReview = res.data;
        this.reviews.push(newReview);
        this.reviewContent = "";
        this.reviewGrade = 0;
        const id = this.$route.params.novel_id;
        const reviewRes = await axios.get(
          `${process.env.VUE_APP_API_URL}/review/` + id + "/novel"
        );
        this.reviews = reviewRes.data.content;
        this.reviews.forEach((review) => {
          review.createdDate = `${review.createdDate[0]} / ${review.createdDate[1]} / ${review.createdDate[2]}`;
        });
      } catch (err) {
        if (this.$getAccessToken() == null || this.$getAccessToken() === "") {
          alert("로그인 후 리뷰 작성할 수 있습니다!");
        }
        if (err.response.data.code == "R002") {
          alert(err.response.data.message);
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
          `${process.env.VUE_APP_API_URL}/review/` + res.reviewId + "/like",
          null,
          option
        );
        const result = await axios.get(
          `${process.env.VUE_APP_API_URL}/review/` +
            this.novel.novelId +
            "/novel",
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
      alert("삭제하시겠습니까?");
      try {
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };
        await axios.delete(
          `${process.env.VUE_APP_API_URL}/review/` + reviewId,
          option
        );
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
    StarRating,
  },
};
</script>
<style lang="scss" scoped>
@import "@/style/novel-detail.css";
@import "@/style/loader.css";
button {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  border-radius: 50%;
  border: solid 2px white;
  background-color: white;
}
html {
  height: 100%;
}
body {
  position: relative;
  width: 100%;
  height: 100%;
}
#createDate,
#deleteBtn {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
#profile_name {
  margin-left: 10px;
}
#image {
  box-shadow: 1px 1px 10px 0px rgba(94, 92, 154, 0.2);
}
.reviewBox {
  margin-top: 10px;
  box-shadow: 1px 1px 10px 0px rgba(94, 92, 154, 0.2);
  padding: 3%;
}
.review-block {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 10%;
}
#review-block-bottom {
  display: flex;
  justify-content: flex-end;
}
#reviewContent {
  margin: 2%;
}
#imageDiv {
  width: 300px;
}
#novelContent {
  background-color: white;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  width: 900px;
  box-shadow: 1px 1px 10px 0px rgba(94, 92, 154, 0.2);
}
#novelWrap {
  padding: 5%;
}
#reviewWrap {
  display: flex;
  justify-content: center;
  align-items: center;
}
#reviewBtn {
  border-radius: 10px;
}
#profile {
  display: flex;
}
.descrption {
  background-color: white;
  border-radius: 10px;
  padding: 2%;
  box-shadow: 1px 1px 10px 0px rgba(94, 92, 154, 0.2);
}

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
  right: -17em;
  transform: translateY(-50%);
  background-color: white;
  border-radius: 10px;
  padding: 1%;
  display: grid;
  place-items: center;
}

#suggest #memo {
  writing-mode: vertical-lr;
  width: 9rem;
  height: 6rem;
  position: fixed;
  right: 8em;
  display: grid;
}
.template-container:hover #suggest {
  right: 0;
}

.template-container #suggest p {
  color: white;
}

.template-container:hover #suggest p {
  color: black;
}

.template-container:hover #suggest b {
  visibility: hidden;
}
button {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  border-radius: 50%;
  border: solid 2px white;
  background-color: white;
}
</style>
