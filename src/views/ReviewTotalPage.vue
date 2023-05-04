<template>
  <div id="ReviewTotalPage">
    <br />
    <section>
      <div>
        <h1>최신리뷰</h1>
        <hr />
        <div id="reviewBox">
          <div v-for="review in reviews.content" v-bind:key="review.id">
            <div>
              <div>
                <img :src="review.image" />
              </div>
              <div>
                장르 : {{ review.genre }} <br />
                작가 : {{ review.author }} <br />
                제목 : {{ review.title }} <br />
                평점 : 필요 <br />
                작품 소개 : {{ review.description }} <br />
              </div>
            </div>
            <div>
              작성자 : {{ review.nickname }} <br />
              리뷰 평점 : {{ review.reviewGrade }} <br />
              리뷰 내용 : {{ review.reviewContent }} <br />
              좋아요 : {{ review.reviewLike }} <br />
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
          >
            [{{ n }}]
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      reviews: {},
    };
  },
  created() {
    this.reviews = this.$route.params.data;
  },
  methods: {
    reviewPaging(n) {
      axios.get(`/api/v1/review/${n}`).then((data) => {
        this.reviews = data.data;
      });
    },
  },
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

section {
  background-color: white;
}

#reviewBox {
  border: 1px solid black;
  display: flex;
  float: left;
}
li {
  margin: 0;
  padding: 0;
  list-style: none;
}
#pagenation {
  text-align: center;
  display: flex;
  margin: 0 auto;
}
</style>
