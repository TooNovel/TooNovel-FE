<template>
  <div id="products">
    <div v-if="products.length > 0">
      <h3>주간 인기 작품</h3>
      <carousel-3d
        :pagination="true"
        :controls-visible="true"
        :pagination-custom="paginationCustom"
        ref="carousel"
      >
        <slide
          v-for="(product, index) in products"
          :key="index"
          :index="index"
          style="width: 250px; height: 300px"
        >
          <img
            :src="product.image"
            width="250px"
            height="300px"
            @click="detailNovelList(product)"
          />
          <p>{{ product.title }}</p>
          <p>{{ product.author }}</p>
          <p>{{ product.price }}</p>
        </slide>
      </carousel-3d>
    </div>
    <div v-if="novelList.length > 0">
      <h3>인기 상승 중인 작품</h3>
      <carousel-3d
        :disable3d="true"
        :clickable="false"
        :controls-visible="true"
        :space="320"
      >
        <slide
          v-for="(novel, index) in novelList"
          :key="index"
          :index="index"
          style="width: 250px; height: 300px"
        >
          <img
            :src="novel.image"
            width="250px"
            height="300px"
            @click="detailNovelList(novel)"
          />
        </slide>
      </carousel-3d>
    </div>
    <br />
    <div v-if="authorList.length > 0">
      <h3>최신 작가</h3>
      <carousel-3d
        :disable3d="true"
        :space="365"
        :clickable="false"
        :controls-visible="true"
        class="carousel-container"
      >
        <slide
          v-for="(author, index) in authorList"
          :key="index"
          :index="index"
          style="width: 250px; height: 350px"
        >
          <img :src="author.imageUrl" height="200px" class="userimg" />
          {{ author.nickname }}
          <br />
          <b-button variant="primary" @click="joinRoom(author.userId)">
            채팅방 참여
          </b-button>
        </slide>
      </carousel-3d>
    </div>
    <br />
    <div v-if="reviewList.length > 0">
      <h3>인기 리뷰</h3>
      <carousel-3d
        :disable3d="true"
        :space="365"
        :clickable="false"
        :controls-visible="true"
        class="carousel-container"
      >
        <slide
          v-for="(review, index) in reviewList"
          :key="index"
          :index="index"
          style="width: 250px; height: 300px"
        >
          <img
            :src="review.imageUrl"
            height="200px"
            @click="detailNovelList(review)"
            class="userimg"
          />
          <!-- review를 받아오는 데이터에서 novelId 값이 없어 아직 미 구현 -->
          <span @click="detailNovelList(review)" style="text-align: center">
            {{ review.nickname }}
            <br />
            {{ review.reviewGrade }}
            <br />
            {{
              review.reviewContent.length > 45
                ? review.reviewContent.substring(0, 44) + "..."
                : review.reviewContent
            }}
            <br />
            {{ review.title + ", " + review.author }}
          </span>
        </slide>
      </carousel-3d>
    </div>
    <br />
  </div>
</template>

<script>
import axios from "axios";
import { Carousel3d, Slide } from "vue-carousel-3d";

export default {
  name: "MainPage",
  async created() {
    try {
      const productsRes = await axios.get("/api/v1/novel");
      const temp = productsRes.data;
      this.shuffle(temp);
      this.products = temp;

      const novelsRes = await axios.get("/api/v1/novel?novelId=3994");
      this.novelList = novelsRes.data;

      const authorRes = await axios.get("/api/v1/user/author");
      this.authorList = authorRes.data;

      const reviewRes = await axios.get("/api/v1/review?sort=REVIEW_LIKE_DESC");
      this.reviewList = reviewRes.data.content;
    } catch (err) {
      console.log(err);
    }
  },
  data() {
    return {
      novelList: [],
      products: [],
      authorList: [],
      reviewList: [],
      paginationCustom: {
        style: {
          backgroundColor: "#fff",
          borderRadius: "50%",
          color: "#000",
          fontSize: "16px",
          margin: "0 5px",
          padding: "5px",
          width: "30px",
          height: "30px",
        },
        activeStyle: {
          backgroundColor: "#000",
          color: "#fff",
        },
      },
    };
  },
  components: {
    Carousel3d,
    Slide,
  },
  methods: {
    goToSlide(index) {
      this.$refs.carousel.goToSlide(index);
    },
    detailNovelList(item) {
      location.href = "/novel/" + item.novelId;
    },
    shuffle(arr) {
      arr.sort(() => Math.random() - 0.5);
    },
    async joinRoom(uid) {
      try {
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };
        await axios.post(`/api/v1/chat/${uid}`, {}, option);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
<style scoped>
#products {
  margin: 5%;
}
h3 {
  font-family: "Hanna";
}

.carousel-container .carousel-3d-slide .userimg {
  margin-top: 10px;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.carousel-container .carousel-3d-slide {
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
