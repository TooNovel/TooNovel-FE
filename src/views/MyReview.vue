<template>
  <div id="ReviewTotalPage">
    <MyPageNavbar></MyPageNavbar>
    <br />
    <section>
      <div>
        <h1 class="title">나의 리뷰</h1>
        <hr />
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
      <br />
      <hr />
      <ul id="pagenation">
        <li v-for="n in reviews.totalPages" :key="n">
          <a
            :href="`/reviews?page=${n - 1}`"
            @click.prevent="reviewPaging(n - 1)"
            class="paging-btn"
          >
            {{ n }}
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import MyPageNavbar from "@/components/MyPageNavbar.vue";
import axios from "axios";

export default {
  data() {
    return {
      reviews: {},
      sort: "",
      genre: "",
      limit: "",
      page: "",
    };
  },
  async created() {
    try {
      const option = {
        headers: {
          Authorization: "Bearer " + this.$getAccessToken(),
        },
      };
      const res = await axios.get(
        `${process.env.VUE_APP_API_URL}/review/myReview`,
        option
      );
      this.reviews = res.data;
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    async reviewPaging(n) {
      try {
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/review/myReview?page=${n}&sort=${this.sort}&genre=${this.genre}&limit=${this.limit}`,
          option
        );
        this.reviews = res.data;
      } catch (err) {
        console.log(err);
      }
    },
  },
  components: { MyPageNavbar },
};
</script>
<style scoped>
#community {
  margin: 3%;
}

header {
  background-color: white;
  font-family: Hanna;
  padding: 1rem;
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

#pagenation {
  display: flex;
  margin: auto;
  justify-self: center;
  align-items: center;
  width: 0px;
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
</style>
