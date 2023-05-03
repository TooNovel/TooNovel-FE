<template>
  <div id="products">
    <div>
      <all-product></all-product>
    </div>
    <br />
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
          <img :src="product.image" width="250px" height="300px" />
        </slide>
      </carousel-3d>
    </div>
    <div>
      <h3>인기 상승 중인 작품</h3>
      <carousel-3d
        :disable3d="true"
        :space="365"
        :clickable="false"
        :controls-visible="true"
      >
        <slide :index="0"> Slide 1 Content </slide>
        <slide :index="1"> Slide 1 Content </slide>
        <slide :index="2"> Slide 1 Content </slide>
        <slide :index="3"> Slide 1 Content </slide>
        <slide :index="4"> Slide 1 Content </slide>
      </carousel-3d>
    </div>
    <br />
    <div>
      <h3>신인 작가</h3>
      <carousel-3d
        :disable3d="true"
        :space="365"
        :clickable="false"
        :controls-visible="true"
      >
        <slide :index="0"> Slide 1 Content </slide>
        <slide :index="1"> Slide 1 Content </slide>
        <slide :index="2"> Slide 1 Content </slide>
        <slide :index="3"> Slide 1 Content </slide>
        <slide :index="4"> Slide 1 Content </slide>
      </carousel-3d>
    </div>
    <br />
    <div>
      <h3>주간 인기 리뷰</h3>
      <carousel-3d
        :disable3d="true"
        :space="365"
        :clickable="false"
        :controls-visible="true"
      >
        <slide :index="0"> Slide 1 Content </slide>
        <slide :index="1"> Slide 1 Content </slide>
        <slide :index="2"> Slide 1 Content </slide>
        <slide :index="3"> Slide 1 Content </slide>
        <slide :index="4"> Slide 1 Content </slide>
      </carousel-3d>
    </div>
    <br />
  </div>
</template>

<script>
import axios from "axios";
import { Carousel3d, Slide } from "vue-carousel-3d";
import AllProduct from "./AllProductList.vue";

export default {
  name: "MainPage",
  created() {
    const URL = process.env.VUE_APP_TEST_URL;

    axios
      .get(URL + "/work/readall")
      .then((response) => {
        this.products = response.data.products;
        console.log(response.data.products);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  data() {
    return {
      products: [],
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
    "all-product": AllProduct,
  },
  methods: {
    goToSlide(index) {
      this.$refs.carousel.goToSlide(index);
    },
  },
};
</script>
<style scoped>
#products {
  margin: 5%;
}
</style>
