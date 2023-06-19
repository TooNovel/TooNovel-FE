<template>
  <div id="rankingBar">
    <div class="info-box">
      <h3>TooNovel Top 30</h3>
      <p>TooNovel 에서 가장 인기 있는 작품 30개를 장르에 맞게 골라보세요</p>
    </div>
    <h3>원하는 기준에 맞춰 검색해 보세요</h3>
    <div class="genre-box">
      <br />
      <ul id="list-box">
        <div class="button">
          <li>
            <P class="btnText">top30</P>
            <div class="btnTwo">
              <b-button @click="getRanking()" class="btnText2">go!</b-button>
            </div>
          </li>
        </div>
        <div class="button">
          <li>
            <P class="btnText">판타지</P>
            <div class="btnTwo">
              <b-button @click="getGenreRanking('FANTASY')" class="btnText2">
                go!
              </b-button>
            </div>
          </li>
        </div>
        <div class="button">
          <li>
            <P class="btnText">로맨스판타지</P>
            <div class="btnTwo">
              <b-button
                @click="getGenreRanking('ROMANCE_FANTASY')"
                class="btnText2"
              >
                go!
              </b-button>
            </div>
          </li>
        </div>
        <div class="button">
          <li>
            <P class="btnText">로맨스</P>
            <div class="btnTwo">
              <b-button @click="getGenreRanking('ROMANCE')" class="btnText2">
                go!
              </b-button>
            </div>
          </li>
        </div>
        <div class="button">
          <li>
            <P class="btnText">현대판타지</P>
            <div class="btnTwo">
              <b-button
                @click="getGenreRanking('MODERN_FANTASY')"
                class="btnText2"
              >
                go!
              </b-button>
            </div>
          </li>
        </div>
        <div class="button">
          <li>
            <P class="btnText">무협</P>
            <div class="btnTwo">
              <b-button @click="getGenreRanking('WUXIA')" class="btnText2">
                go!
              </b-button>
            </div>
          </li>
        </div>
        <div class="button">
          <li>
            <P class="btnText">미스터리</P>
            <div class="btnTwo">
              <b-button @click="getGenreRanking('MYSTERY')" class="btnText2">
                go!
              </b-button>
            </div>
          </li>
        </div>
        <div class="button">
          <li>
            <P class="btnText">라이트노벨</P>
            <div class="btnTwo">
              <b-button
                @click="getGenreRanking('LIGHT_NOVEL')"
                class="btnText2"
              >
                go!
              </b-button>
            </div>
          </li>
        </div>
        <div class="button">
          <li>
            <P class="btnText">BL</P>
            <div class="btnTwo">
              <b-button @click="getGenreRanking('BL')" class="btnText2">
                go!
              </b-button>
            </div>
          </li>
        </div>
      </ul>
    </div>
    <div class="sort-box">
      <ul id="list-box">
        <div class="sort-button">
          <li>
            <P class="btnText">좋아요 순</P>
            <div class="btnTwo">
              <b-button
                @click="getSortRanking('NOVEL_LIKE_DESC')"
                class="btnText2"
              >
                go!
              </b-button>
            </div>
          </li>
        </div>
        <div class="sort-button">
          <li>
            <P class="btnText">평점 순</P>
            <div class="btnTwo">
              <b-button
                @click="getSortRanking('NOVEL_GRADE_DESC')"
                class="btnText2"
              >
                go!
              </b-button>
            </div>
          </li>
        </div>
        <div class="sort-button">
          <li>
            <P class="btnText">리뷰개수 순</P>
            <div class="btnTwo">
              <b-button
                @click="getSortRanking('NOVEL_REVIEW_DESC')"
                class="btnText2"
              >
                go!
              </b-button>
            </div>
          </li>
        </div>
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
.info-box {
  width: 80rem;
  border: 1px solid black;
  border-radius: 10px;
  margin: 10px auto;
}
.genre-box {
  display: flex;
  flex-wrap: wrap;
}
#list-box {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
ul {
  list-style-type: none;
}
#holder {
  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  background: white;
  padding: 10px;
  width: 250px;
  margin: 0 auto;
  position: relative;
  top: 50%;
  transform: translateY(-65%);
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.25);
  border-radius: 2px;
}
.button {
  background: #3d4c53;
  margin: 10px auto;
  width: 200px;
  height: 50px;
  overflow: hidden;
  text-align: center;
  transition: 0.2s;
  cursor: pointer;
  border-radius: 3px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
}
.sort-button {
  background: #8dbcd2;
  margin: 10px auto;
  width: 200px;
  height: 50px;
  overflow: hidden;
  text-align: center;
  transition: 0.2s;
  cursor: pointer;
  border-radius: 3px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
}
.btnTwo {
  position: relative;
  width: 200px;
  height: 100px;
  margin-top: -100px;
  padding-top: 2px;
  left: -250px;
  transition: 0.3s;
}
.btnText {
  color: white;
  transition: 0.3s;
}
.btnText2 {
  margin-top: 63px;
  margin-right: -130px;
  color: #fff;
}
.button:hover .btnTwo {
  /*When hovering over .button change .btnTwo*/
  left: -130px;
}
.button:hover .btnText {
  /*When hovering over .button change .btnText*/
  margin-left: 65px;
}
.button:active {
  /*Clicked and held*/
  box-shadow: 0px 5px 6px rgba(0, 0, 0, 0.3);
}

.sort-button:hover .btnTwo {
  /*When hovering over .button change .btnTwo*/
  left: -130px;
}
.sort-button:hover .btnText {
  /*When hovering over .button change .btnText*/
  margin-left: 65px;
}
.sort-button:active {
  /*Clicked and held*/
  box-shadow: 0px 5px 6px rgba(0, 0, 0, 0.3);
}
</style>
