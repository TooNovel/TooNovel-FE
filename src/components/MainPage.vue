<template>
  <div id="products">
    <div>
      <all-product></all-product>
    </div>
    <div>
      <h3>주간 인기 작품</h3>
      <carousel-3d>
        <slide :index="0"> Slide 1 Content </slide>
        <slide :index="1"> Slide 2 Content </slide>
        <slide :index="2"> Slide 3 Content </slide>
        <slide :index="3"> Slide 4 Content </slide>
        <slide :index="4"> Slide 5 Content </slide>
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
      </carousel-3d>
    </div>
  </div>
</template>

<script>
import { Carousel3d, Slide } from "vue-carousel-3d";
import AllProduct from "./AllProductList.vue";

export default {
  name: "MainPage",
  data() {
    return {
      slides: 5,
    };
  },
  components: {
    Carousel3d,
    Slide,
    "all-product": AllProduct,
  },
  methods: {},
};
</script>
<style>
#products {
  margin: 5%;
}
</style>
