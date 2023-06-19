<template>
  <div id="rankingBar">
    <div>
      <h3>TooNovel Top 30</h3>
      <p>TooNovel 에서 가장 인기 있는 작품 30개를 장르에 맞게 골라보세요</p>
    </div>
    <div>
      <ul id="list-box">
        <h3>장르</h3>
        <li><b-button @click="getRanking()">top30</b-button></li>
        <li>
          <b-button @click="getGenreRanking('FANTASY')">판타지</b-button>
        </li>
        <li>
          <b-button @click="getGenreRanking('ROMANCE_FANTASY')">
            로맨스판타지
          </b-button>
        </li>
        <li>
          <b-button @click="getGenreRanking('ROMANCE')">로맨스</b-button>
        </li>
        <li>
          <b-button @click="getGenreRanking('MODERN_FANTASY')">
            현대판타지
          </b-button>
        </li>
        <li>
          <b-button @click="getGenreRanking('WUXIA')">무협</b-button>
        </li>
        <li>
          <b-button @click="getGenreRanking('MYSTERY')">미스터리</b-button>
        </li>
        <li>
          <b-button @click="getGenreRanking('LIGHT_NOVEL')">
            라이트노벨
          </b-button>
        </li>
        <li>
          <b-button @click="getGenreRanking('BL')">BL</b-button>
        </li>
      </ul>
    </div>
    <div>
      <h3>정렬 기준</h3>
      <ul id="list-box">
        <li>
          <b-button @click="getSortRanking('NOVEL_LIKE_DESC')">
            좋아요 순
          </b-button>
        </li>
        <li>
          <b-button @click="getSortRanking('NOVEL_GRADE_DESC')">
            평점 순
          </b-button>
        </li>
        <li>
          <b-button @click="getSortRanking('NOVEL_REVIEW_DESC')">
            리뷰개수 순
          </b-button>
        </li>
      </ul>
    </div>
    <hr />
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
    };
  },
  async created() {
    console.log(this.novels.length);
    if (this.novels.length === 0) {
      try {
        const res = await axios.get(`${process.env.VUE_APP_API_URL}/novel`);
        this.novels = this.$emit("setNovels", res.data);
      } catch (err) {
        console.log(err);
      }
    }
  },
  methods: {
    async getRanking() {
      try {
        const res = await axios.get(`${process.env.VUE_APP_API_URL}/novel`);
        this.novels = this.$emit("setNovels", res.data);
        console.log(this.novels);
      } catch (err) {
        console.log(err);
      }
    },
    async getGenreRanking(genre) {
      console.log(genre);
      this.genre = genre;
      try {
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/novel?genre=${this.genre}&sort=${this.sort}`
        );
        this.novels = this.$emit("setNovels", res.data);
        console.log(this.novels);
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
<style scoped>
#list-box {
  display: flex;
  justify-content: center;
  margin: 50px;
  padding: 50px;
}
#list-box > li {
  margin: 20px;
}
</style>
