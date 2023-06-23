<template>
  <div id="products">
    <div v-if="products.length > 0">
      <h3>최신 작품</h3>
      <carousel-3d
        :pagination="true"
        :controls-visible="true"
        :pagination-custom="paginationCustom"
        :height="300"
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
        :height="300"
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
          style="
            width: 250px;
            height: 270px;
            border-radius: 12px;
            background-color: whitesmoke;
          "
        >
          <img :src="author.imageUrl" class="myImg" />
          <h5 style="margin-bottom: 10px">{{ author.nickname }}</h5>
          <button
            class="w-btn-outline w-btn-green-outline"
            type="button"
            @click="joinRoom(author.userId)"
            id="joinBtn"
          >
            참여
          </button>
        </slide>
      </carousel-3d>
    </div>
    <br />
    <div v-if="reviewList.length > 0">
      <h3>인기 리뷰</h3>
      <carousel-3d
        :disable3d="true"
        :space="300"
        :clickable="false"
        :controls-visible="true"
        class="carousel-container"
      >
        <slide
          v-for="(review, index) in reviewList"
          :key="index"
          :index="index"
          style="width: 250px"
        >
          <img
            :src="review.imageUrl"
            height="200px"
            @click="detailNovelList(review)"
            class="userimg"
          />
          <div @click="detailNovelList(review)" class="review-form">
            <p>{{ review.nickname }}</p>
            <div class="review-grade">
              <span style="font-size: 20px; letter-spacing: -0.2em">
                {{ "★".repeat(review.reviewGrade) }}
                {{ "☆".repeat(5 - review.reviewGrade) }}
              </span>
            </div>
            <p class="review-content">
              {{
                review.reviewContent.length > 20
                  ? review.reviewContent.substring(0, 20) + "..."
                  : review.reviewContent
              }}
            </p>
            <div class="title-author">
              <p>{{ review.title }}<br />{{ review.author }}</p>
            </div>
          </div>
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
      const productsRes = await axios.get(
        `${process.env.VUE_APP_API_URL}/novel?sort=CREATED_DATE_DESC`
      );
      const temp = productsRes.data;
      this.shuffle(temp);
      this.products = temp;

      const novelsRes = await axios.get(
        `${process.env.VUE_APP_API_URL}/novel?sort=NOVEL_LIKE_DESC`
      );
      this.novelList = novelsRes.data;

      const authorRes = await axios.get(
        `${process.env.VUE_APP_API_URL}/user/author`
      );
      this.authorList = authorRes.data;

      const reviewRes = await axios.get(
        `${process.env.VUE_APP_API_URL}/review?sort=REVIEW_LIKE_DESC`
      );
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
        await axios.post(
          `${process.env.VUE_APP_API_URL}/chat/${uid}`,
          {},
          option
        );
        alert("가입이 완료됐습니다!");
        this.ToChatRoom();
      } catch (err) {
        if (err.response.data.code == "H004") {
          alert(err.response.data.message);
          this.ToChatRoom();
        } else if (err.response.data.code == "A002") {
          alert("로그인이 필요합니다.");
          this.$router.push("/login");
        } else if (err.response.data.code == "H002") {
          alert(err.response.data.message);
        }
      }
    },
    async ToChatRoom() {
      this.$router.push({ name: "ChatRoom" });
    },
  },
};
</script>
<style scoped>
#products {
  margin: 5%;
}
h3,
h5 {
  font-family: "Hanna";
}

.carousel-3d-container {
  overflow: revert !important;
}

.carousel-container .carousel-3d-slide .userimg {
  margin-top: 15px;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  object-fit: cover;
  padding-top: 5px;
}

.myImg {
  margin-top: 15px;
  border-radius: 50%;
  width: 150px;
  height: 150px;
  object-fit: cover;
  margin-bottom: 15px;
}

.carousel-container .carousel-3d-slide {
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

.carousel-3d-slide {
  box-shadow: 5px 5px 20px 5px rgba(94, 92, 154, 0.2);
}

.review-form {
  text-align: center;
  padding: 5px 10px;
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.review-form > p {
  margin: 2px 0;
}

.carousel-3d-slider > div {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 10px;
  font-size: 14px;
}
.carousel-3d-controls {
  width: 1000px;
  height: 1000px;
}
.title-author {
  display: flex;
  flex-direction: column;
}
.review-content {
  margin-top: 10px !important;
  margin-bottom: 10px !important;
}

#joinBtn {
  margin-bottom: 10px;
}
</style>
