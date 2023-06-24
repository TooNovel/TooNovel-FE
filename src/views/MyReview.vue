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
            <div class="pretty-box" @click="detailNovelList(review)">
              <div class="review-item">
                <div class="review-img">
                  <img :src="review.image" />
                </div>
                <div class="novel-info">
                  <p id="nvTitle">{{ review.title }}</p>
                  <p>{{ review.genre }} | {{ review.author }}</p>
                  {{ review.description }} <br />
                </div>
              </div>
              <hr />
              <div class="review-info">
                <div id="profile">
                  <img :src="review.imageUrl" id="rvImg" />
                  <div id="profile_name">
                    {{ review.nickname }}
                  </div>
                </div>
                <br />
                {{ review.reviewContent }} <br /><br />
                <div id="star-ragting">
                  <star-rating
                    :border-width="4"
                    border-color="#d8d8d8"
                    :rounded-corners="true"
                    :star-size="15"
                    v-model="review.reviewGrade"
                    read-only
                    :star-points="[
                      23, 2, 14, 17, 0, 19, 10, 34, 7, 50, 23, 43, 38, 50, 36,
                      34, 46, 19, 31, 17,
                    ]"
                  ></star-rating>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <b-icon
                    icon="hand-thumbs-up"
                    font-scale="1.5"
                    variant="danger"
                  ></b-icon>
                  &nbsp;{{ review.reviewLike }}
                </div>
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
import StarRating from "vue-star-rating";

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
        window.scrollTo({
          top: 0,
          behavior: "instant",
        });
      } catch (err) {
        console.log(err);
      }
    },
    detailNovelList(item) {
      location.href = "/novel/" + item.novelId;
    },
  },
  components: { MyPageNavbar, StarRating },
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

#star-ragting {
  display: flex;
  justify-content: flex-end;
}

#rvImg {
  width: 50px;
  height: 50px;
  object-fit: cover;
}

#profile {
  display: flex;
}

#profile_name {
  margin-left: 20px;
  margin-top: 10px;
}

#nvTitle {
  font-size: calc(1.275rem + 0.3vw);
}
</style>
