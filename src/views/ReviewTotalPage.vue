<template>
  <div id="ReviewTotalPage">
    <b-nav tabs style="background-color: white">
      <b-nav-item id="latestSort" @click="latestSort()">최신순</b-nav-item>
      <b-nav-item id="oldSort" @click="oldSort()">오래된순</b-nav-item>
      <b-nav-item id="likeSort" @click="likeSort()">좋아요순</b-nav-item>
    </b-nav>
    <br />
    <section>
      <div id="loading" v-if="isLoading" style="height: 600px">
        <div class="loader">Loading...</div>
      </div>
      <div>
        <div>
          <div id="reviewBox">
            <div v-for="review in reviews.content" v-bind:key="review.id">
              <div class="pretty-box">
                <div class="review-item">
                  <div class="review-img">
                    <img :src="review.image" />
                  </div>
                  <div class="novel-info">
                    <b>장르 :</b> {{ review.genre }} <br />
                    <b>작가 :</b> {{ review.author }} <br />
                    <b>제목 :</b> {{ review.title }} <br />
                    <b>평점 :</b> {{ review.reviewGrade }} <br />
                    <b>작품 소개 :</b> {{ review.description }} <br />
                  </div>
                </div>
                <hr />
                <div class="review-info">
                  <b>작성자 :</b> {{ review.nickname }} <br />
                  <b>리뷰 평점 :</b> {{ review.reviewGrade }} <br />
                  <b>리뷰 내용 :</b> {{ review.reviewContent }} <br />
                  <b>좋아요 :</b> {{ review.reviewLike }} <br />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <hr />
      <div class="pagination justify-content-center pagination-flat">
        <ul v-for="n in reviews.totalPages" :key="n">
          <li @click.prevent="reviewPaging(n - 1)" class="paging-btn">
            {{ n }}
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      reviews: {},
      sort: "",
      genre: "",
      limit: "",
      page: "",
      isLoading: true,
    };
  },
  async created() {
    await this.sleep(1500);
    try {
      const res = await axios.get(
        `${process.env.VUE_APP_API_URL}/review?page=${this.page}&sort=${this.sort}&genre=${this.genre}&limit=${this.limit}`
      );
      this.reviews = res.data;
      this.isLoading = false;
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    async reviewPaging(n) {
      try {
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/review?page=${n}&sort=${this.sort}&genre=${this.genre}&limit=${this.limit}`
        );
        this.reviews = res.data;
      } catch (err) {
        console.log(err);
      }
    },
    async fetchReviews(sort) {
      try {
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/review?sort=${sort}&genre=${this.genre}&limit=${this.limit}`
        );
        this.reviews = res.data;
        this.sort = sort;
      } catch (err) {
        console.log(err);
      }
    },
    async latestSort() {
      await this.fetchReviews("CREATED_DATE_DESC");
    },
    async oldSort() {
      await this.fetchReviews("CREATED_DATE_ASC");
    },
    async likeSort() {
      await this.fetchReviews("REVIEW_LIKE_DESC");
    },
    async sleep(sec) {
      return new Promise((resolve) => setTimeout(resolve, sec));
    },
  },
};
</script>
<style scoped>
@import "@/style/loader.css";
#loading {
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
}
header {
  font-family: Hanna;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#titleBox {
  background-color: white;
  width: 60%;
  border-radius: 10px;
  padding-top: 1%;
  padding-bottom: 1%;
}

#ReviewTotalPage {
  display: block;
}

#reviewBox {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pretty-box {
  background-color: #f9f9f9;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 20px;
  overflow: hidden;
  width: 800px;
}

.review-item {
  display: flex;
  margin-bottom: 20px;
}

.review-img {
  width: auto;
}
.review-img > img {
  border-radius: 6px;
  height: 300px;
  width: 210px;
}
.novel-info {
  padding: 10px;
  width: 500px;
  margin-left: 20px;
  display: inline-block;
}

.review-info {
  flex-direction: column;
}

li {
  margin: 0;
  padding: 0;
  list-style: none;
}
.title {
  margin-left: 34px;
}
.paging-btn {
  padding: 3px;
  margin: 3px;
  font-size: 20px;
  font-weight: 600;
  text-decoration: none;
  color: dimgray;
}
.nav-tabs {
  justify-content: center;
}
.nav-link {
  color: black;
}
</style>
