<template>
  <div>
    <h1>주간 인기 작품</h1>
    <carousel-3d>
      <slide :index="0"> Slide 1 Content </slide>
      <slide :index="1"> Slide 2 Content </slide>
      <slide :index="2"> Slide 3 Content </slide>
      <slide :index="3"> Slide 4 Content </slide>
      <slide :index="4"> Slide 5 Content </slide>
    </carousel-3d>
  </div>
</template>

<script>
import { Carousel3d, Slide } from "vue-carousel-3d";

export default {
  name: "MainPage",
  data() {
    return {};
  },
  components: {
    Carousel3d,
    Slide,
  },
  methods: {},
};
</script>
