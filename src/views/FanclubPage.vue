<template>
  <div id="fanclub">
    <header>
      <div class="row justify-content-end">
        <div class="col">
          <h1>팬클럽</h1>
        </div>
        <div class="col-auto">
          <b-form-input placeholder="작가명" type="text" v-model="author" />
        </div>
        <div class="col-auto">
          <b-button variant="primary" @click="search()">검색</b-button>
        </div>
        <div class="col-auto">
          <b-button variant="warning" @click="chatroom()">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-chat-dots-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
              />
            </svg>
          </b-button>
        </div>
      </div>
    </header>
    <div>
      <carousel-3d
        :disable3d="true"
        :space="365"
        :clickable="false"
        :controls-visible="true"
        class="carousel-container"
      >
        <slide :index="0">
          <img src="/favicon.ico" width="100px" height="200px" />
          <br />
          작가 1
          <br />
          <b-button variant="primary">팔로우</b-button>
        </slide>
        <slide :index="1">
          <img src="/favicon.ico" width="100px" height="200px" />
          <br />
          작가 2
          <br />
          <b-button variant="primary">팔로우</b-button>
        </slide>
        <slide :index="2">
          <img src="/favicon.ico" width="100px" height="200px" />
          <br />
          작가 3
          <br />
          <b-button variant="primary">팔로우</b-button>
        </slide>
        <slide :index="3">
          <img src="/favicon.ico" width="100px" height="200px" />
          <br />
          작가 4
          <br />
          <b-button variant="primary">팔로우</b-button>
        </slide>
        <slide :index="4">
          <img src="/favicon.ico" width="100px" height="200px" />
          <br />
          작가 5
          <br />
          <b-button variant="primary">팔로우</b-button>
        </slide>
      </carousel-3d>
    </div>
    <div class="author-list-box">
      <b-row>
        <b-col class="mb-3" cols="12" sm="6" md="4" lg="3">
          <b-card class="b-card" align="center">
            <b-card-img src="/favicon.ico" class="card-image"></b-card-img>
            <b-card-title class="card-title">작가 1</b-card-title>
            <b-button variant="primary" class="card-btn">팔로우</b-button>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { Carousel3d, Slide } from "vue-carousel-3d";

export default {
  data() {
    return {
      authors: [],
    };
  },
  created() {
    this.authors = this.$route.params.data;
  },
  components: {
    Carousel3d,
    Slide,
  },
};
</script>
<style scoped>
#fanclub {
  margin: 3%;
}

.carousel-container .carousel-3d-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

img {
  margin-top: 20px;
  border-radius: 50%;
  width: 150px;
  height: 150px;
  object-fit: cover;
}

.author-list-box {
  margin-top: 2%;
  margin-left: 5%;
  margin-right: 5%;
}
</style>
