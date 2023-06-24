<template>
  <div class="container">
    <div id="loading" v-if="isLoading">
      <div class="loader">Loading...</div>
    </div>
    <div v-else class="novel-list-box" ref="allProductList">
      <b-row class="menu-bar-parent">
        <ul class="menu-bar">
          <div v-for="genre in genres" :key="genre.key">
            <div @click="getGenreRanking(genre.key)">
              <li>{{ genre.value }}</li>
            </div>
          </div>
        </ul>
      </b-row>
      <br />
      <b-row>
        <b-col
          v-for="(novel, index) in novels"
          :key="index"
          class="mb-3"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <b-card @click="detailNovelList(novel.novelId)">
            <b-card-img :src="novel.image" class="card-image"></b-card-img>
            <b-card-text id="novel-text"
              >{{ novel.genre }} | {{ novel.author }}</b-card-text
            >
            <b-card-title>{{ novel.title }}</b-card-title>
            <template #footer>
              <div class="response-footer">
                <star-rating
                  :border-width="4"
                  border-color="#d8d8d8"
                  :rounded-corners="true"
                  :star-size="20"
                  v-model="novel.grade"
                  read-only
                  :star-points="[
                    23, 2, 14, 17, 0, 19, 10, 34, 7, 50, 23, 43, 38, 50, 36, 34,
                    46, 19, 31, 17,
                  ]"
                ></star-rating
                >&nbsp;({{ novel.reviewCount }})&nbsp;&nbsp;
                <b-icon
                  icon="hand-thumbs-up"
                  font-scale="1.5"
                  variant="danger"
                ></b-icon>
                {{ novel.likeCount }}
              </div>
            </template>
          </b-card>
        </b-col>
      </b-row>
    </div>
    <infinite-loading
      v-if="!isLoading"
      @infinite="infiniteHandler"
      spinner="waveDots"
    ></infinite-loading>
  </div>
</template>

<script>
import axios from "axios";
import InfiniteLoading from "vue-infinite-loading";
import StarRating from "vue-star-rating";

export default {
  data() {
    return {
      novels: [],
      novelId: null,
      isLoading: true,
      novelGrade: 0,
      genre: "",
      genres: [
        { key: "all", value: "전체" },
        { key: "FANTASY", value: "판타지" },
        { key: "ROMANCE", value: "로맨스" },
        { key: "ROMANCE_FANTASY", value: "로맨스판타지" },
        { key: "MODERN_FANTASY", value: "현대판타지" },
        { key: "WUXIA", value: "무협" },
        { key: "MYSTERY", value: "미스테리" },
        { key: "LIGHT_NOVEL", value: "라이트노벨" },
        { key: "BL", value: "BL" },
      ],
    };
  },
  async created() {
    await this.sleep(1500);
    this.isLoading = false;
  },
  methods: {
    async getGenreRanking(genre) {
      if (genre === "all") {
        genre = "";
      }
      this.genre = genre;
      try {
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/novel?genre=${this.genre}`
        );
        this.novels = [];
        this.novels = res.data;
      } catch (err) {
        console.log(err);
      }
    },
    async infiniteHandler($state) {
      if (!this.novels.length) {
        try {
          const res = await axios.get(`${process.env.VUE_APP_API_URL}/novel`);
          this.novels = res.data;
          this.novelId = this.novels[this.novels.length - 1].novelId;
          $state.loaded();
        } catch (err) {
          console.log(err);
        }
        return;
      }
      try {
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/novel?novelId=${this.novelId}&genre=${this.genre}`
        );
        if (res.data.length) {
          this.novels = this.novels.concat(res.data);
          this.novelId = this.novels[this.novels.length - 1].novelId;
          $state.loaded();
          if (this.novelId / res.data.length == 0) {
            $state.complete();
          }
        } else {
          $state.complete();
        }
      } catch (err) {
        console.log(err);
        alert("에러");
        location.href = "/";
      }
    },
    detailNovelList(novelId) {
      location.href = "/novel/" + novelId;
    },
    handleImageError(event) {
      event.target.src =
        "https://via.placeholder.com/600x600.png?text=No+Image";
    },
    async sleep(sec) {
      return new Promise((resolve) => setTimeout(resolve, sec));
    },
  },
  async mounted() {
    const novelList = await axios.get(`${process.env.VUE_APP_API_URL}/novel`);
    this.novels = novelList.data;
    this.novelId = this.novels[this.novels.length - 1].novelId;
  },
  components: {
    InfiniteLoading,
    StarRating,
  },
};
</script>

<style lang="scss" scoped>
.menu-bar-parent {
  margin-top: 50px;
  margin-bottom: 25px;
  display: flex;
  justify-content: center;
}
.menu-bar {
  border-radius: 25px;
  height: fit-content;
  display: inline-flex;
  background-color: rgb(130, 176, 130);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  align-items: center;
  padding: 0 10px;
  width: 73%;
  li {
    list-style: none;
    color: white;
    padding: 12px 16px;
    margin: 0 8px;
    position: relative;
    cursor: pointer;
    white-space: nowrap;
    &::before {
      content: " ";
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      z-index: -1;
      transition: 0.2s;
      border-radius: 25px;
    }
    &:hover {
      &::before {
        background: linear-gradient(to bottom, #e8edec, #d2d1d3);
        box-shadow: 0px 3px 20px 0px black;
        transform: scale(1.2);
      }
      color: black;
    }
  }
}
.sort-row {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-end;
}
#allProductList {
  height: 400px; /* 스크롤이 표시될 최대 높이값 */
}
p {
  margin-top: 5px;
  margin-bottom: 5px;
}
.title {
  margin: 20px;
}
.response-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
@media (max-width: 600px) {
  .response-footer {
    flex-wrap: wrap;
  }
}
@media (min-width: 170px) {
  .response-footer {
    flex-wrap: wrap;
  }
}
.novel-list-box {
  margin-top: 2%;
  margin-left: 5%;
  margin-right: 5%;
}
.card-body {
  height: 420px;
}
.card-image {
  height: 300px;
}
.iconList {
  color: gray;
  margin-right: 10px;
}
</style>
