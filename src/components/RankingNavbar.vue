<template>
  <div id="rankingBar">
    <div class="info-box">
      <h2>👑TooNovel Top 30</h2>
      <h3>원하는 기준에 맞춰 검색해 보세요😊</h3>
      <p>TooNovel 에서 가장 인기 있는 작품 30개를 장르에 맞게 골라보세요!</p>
    </div>
    <div>
      <b-row class="menu-bar-parent">
        <ul class="menu-bar">
          <div v-for="genre in genres" :key="genre.key">
            <div @click="getGenreRanking(genre.key)">
              <li>{{ genre.value }}</li>
            </div>
          </div>
        </ul>
      </b-row>
      <div class="sort-row">
        <div v-for="sort in sorts" :key="sort.key" class="sort-box">
          <div class="iconList" @click="getSortRanking(sort.key)">
            <div v-if="sort.key == 'NOVEL_LIKE_DESC'">
              <h5>
                <b-icon icon="hand-thumbs-up"></b-icon>&nbsp;{{ sort.value }}
              </h5>
            </div>
            <div v-else-if="sort.key == 'NOVEL_GRADE_DESC'">
              <h5><b-icon icon="star"></b-icon>&nbsp;{{ sort.value }}</h5>
            </div>
            <div v-else-if="sort.key == 'NOVEL_REVIEW_DESC'">
              <h5><b-icon icon="chat-text"></b-icon>&nbsp;{{ sort.value }}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      genre: "",
      sort: "",
      novels: [],
      genres: [
        { key: "top30", value: "top30" },
        { key: "FANTASY", value: "판타지" },
        { key: "ROMANCE", value: "로맨스" },
        { key: "ROMANCE_FANTASY", value: "로맨스판타지" },
        { key: "MODERN_FANTASY", value: "현대판타지" },
        { key: "WUXIA", value: "무협" },
        { key: "MYSTERY", value: "미스테리" },
        { key: "LIGHT_NOVEL", value: "라이트노벨" },
        { key: "BL", value: "BL" },
      ],
      sorts: [
        { key: "NOVEL_LIKE_DESC", value: "좋아요 순" },
        { key: "NOVEL_GRADE_DESC", value: "평점 순" },
        { key: "NOVEL_REVIEW_DESC", value: "리뷰개수 순" },
      ],
    };
  },
  async created() {
    if (this.novels.length === 0) {
      try {
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/novel?sort=NOVEL_GRADE_DESC`
        );
        this.novels = this.$emit("setNovels", res.data);
      } catch (err) {
        console.log(err);
      }
    }
  },
  methods: {
    async getGenreRanking(genre) {
      if (genre === "top30") {
        genre = "";
      }
      this.genre = genre;
      try {
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/novel?genre=${this.genre}&sort=${this.sort}`
        );
        this.novels = this.$emit("setNovels", res.data);
      } catch (err) {
        console.log(err);
      }
    },
    async getSortRanking(sort) {
      this.sort = sort;
      try {
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/novel?genre=${this.genre}&sort=${this.sort}`
        );
        this.novels = this.$emit("setNovels", res.data);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.info-box {
  padding: 2%;
  width: 80rem;
  background-color: white;
  border-radius: 20px;
  margin-top: 3%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 5px 5px 20px 5px rgba(94, 92, 154, 0.2);
}
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
  width: 66%;
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
.iconList {
  margin-right: 10px;
}
</style>
