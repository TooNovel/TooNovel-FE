<template>
  <div id="products">
    <div>
      <all-product></all-product>
    </div>
    <div>
      <h3>주간 인기 작품</h3>
      <carousel-3d>
        <slide
          v-for="(product, index) in products"
          :key="index"
          :index="index - 1"
          style="width: 250px; height: 300px"
        >
          <img :src="product.image" width="250px" height="300px" />
        </slide>
      </carousel-3d>
    </div>
    <div id="example">
      <h3>신인 작가</h3>
      <carousel-3d
        :disable3d="true"
        :space="365"
        :clickable="false"
        :controls-visible="true"
      >
        <slide :index="0"> Slide 1 Content </slide>
        <slide :index="1"> Slide 2 Content </slide>
        <slide :index="2"> Slide 3 Content </slide>
        <slide :index="3"> Slide 4 Content </slide>
        <slide :index="4"> Slide 5 Content </slide>
        <slide :index="5"> Slide 1 Content </slide>
        <slide :index="6"> Slide 2 Content </slide>
        <slide :index="7"> Slide 3 Content </slide>
        <slide :index="8"> Slide 4 Content </slide>
        <slide :index="9"> Slide 5 Content </slide>
      </carousel-3d>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Carousel3d, Slide } from "vue-carousel-3d";
import AllProduct from "./AllProductList.vue";

export default {
  name: "MainPage",
  data() {
    return {
      products: [],
    };
  },
  mounted() {
    const URL = "https://aee2de78-332d-40e2-af1e-ee62eb99672d.mock.pstmn.io";

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
  components: {
    Carousel3d,
    Slide,
    "all-product": AllProduct,
  },
};
</script>
<style scoped>
#products {
  margin: 5%;
}
</style>
