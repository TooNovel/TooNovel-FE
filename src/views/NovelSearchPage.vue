<template>
  <div class="container">
    <h3 class="title"><b>작품 검색</b></h3>
    <div id="WorkSearchPage">
      <b-form-group id="search" label="작품 찾기" v-slot="{ ariaDescribedby }">
        <b-form-radio-group
          id="btn-radios-1"
          v-model="selected"
          :options="options"
          :aria-describedby="ariaDescribedby"
          name="radios-btn-default"
          buttons
        ></b-form-radio-group>
        <b-input-group prepend="제목" style="margin-top: 20px">
          <b-form-input type="text" v-model="searchTitle" />
        </b-input-group>
        <b-input-group prepend="작가" style="margin-top: 20px">
          <b-form-input type="text" v-model="author" />
          <b-button variant="secondary" @click="search()">검색</b-button>
        </b-input-group>
      </b-form-group>
    </div>
    <br />
    <b-col md="6" offset-md="3">
      <div class="descrption">
        <b>찾으시는 웹소설이 없으신가요?</b>
        <p>작품 신청을 통해 빠진 작품을 알려주세요!</p>
        <b-button variant="info" @click="novelRequest()">신청하기</b-button>
      </div>
    </b-col>
    <div v-if="isEmpty">
      <h1>검색된 결과가 없습니다.</h1>
    </div>
    <div v-else>
      <div class="novel-list-box">
        <b-row id="work" style="margin-top: 20px">
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
              <b-card-title>{{ novel.title }}</b-card-title>
              <b-card-text>{{ novel.author }}</b-card-text>
              <b-card-text>{{ novel.genre }}</b-card-text>
              <b-card-text>좋아요 {{ novel.likeCount }}</b-card-text>
              <b-card-text
                >{{ novel.grade ? novel.grade : 0 }} ({{
                  novel.reviewCount
                }})</b-card-text
              >
            </b-card>
          </b-col>
        </b-row>
      </div>
      <infinite-loading
        @infinite="infiniteHandler"
        spinner="waveDots"
      ></infinite-loading>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import InfiniteLoading from "vue-infinite-loading";

export default {
  name: "WorkSearchPage",
  data() {
    return {
      isEmpty: false,
      title: "",
      novels: [],
      novelId: 0,
      genre: "",
      author: "",
      selected: "",
      selectedOption: "title",
      searchTitle: "",
      text: "",
      options: [
        { text: "전체", value: "" },
        { text: "로맨스", value: "ROMANCE" },
        { text: "판타지", value: "FANTASY" },
        { text: "로맨스판타지", value: "ROMANCE_FANTASY" },
        { text: "현대판타지", value: "MODERN_FANTASY" },
        { text: "미스터리", value: "MYSTERY" },
        { text: "무협", value: "WUXIA" },
        { text: "라이트노벨", value: "LIGHT_NOVEL" },
        { text: "BL", value: "BL" },
      ],
    };
  },
  async mounted() {
    try {
      this.searchTitle = this.$route.query.title || "";
      const res = await axios.get(
        `${process.env.VUE_APP_API_URL}/novel?title=${this.searchTitle}`
      );
      this.novels = res.data;
      if (!this.novels.length) {
        this.isEmpty = true;
      } else {
        this.novelId = this.novels[this.novels.length - 1].novelId;
      }
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    async infiniteHandler($state) {
      if (!this.novels.length) {
        // 데이터가 없는 경우 초기 데이터를 가져옵니다.
        try {
          const res = await axios.get(
            `${process.env.VUE_APP_API_URL}/novel?title=${this.searchTitle}`
          );
          this.novels = res.data;
          this.novelId = this.novels[this.novels.length - 1].novelId;
          $state.loaded();
        } catch (err) {
          console.log(err);
        }
        return;
      }
      try {
        console.log(this.novelId);
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/novel?novelId=${this.novelId}&title=${this.searchTitle}&author=${this.author}&genre=${this.selected}`
        );
        if (res.data.length) {
          this.novels = this.novels.concat(res.data);
          this.novelId = this.novels[this.novels.length - 1].novelId;
          $state.loaded(); //데이터 로딩
          if (this.novelId / res.data.length == 0) {
            $state.complete(); //데이터가 없으면 로딩 끝
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
    async search() {
      try {
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/novel/?novelId=&title=${this.searchTitle}&author=${this.author}&genre=${this.selected}`
        );
        this.novels = [];
        this.novels = res.data;
      } catch (err) {
        console.log(err);
      }
    },
    detailNovelList(novelId) {
      location.href = "/novel/" + novelId;
    },
    novelRequest() {
      this.$router.push("/post/request");
    },
  },
  components: {
    InfiniteLoading,
  },
};
</script>
<style scoped>
#WorkSearchPage {
  padding-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: row;
}
.title {
  margin: 20px;
}
.novel-list-box {
  margin-top: 2%;
  margin-left: 5%;
  margin-right: 5%;
}
.card-image {
  height: 350px;
}

#search {
  flex-wrap: wrap;
}

#work {
  margin-top: 2%;
  margin-left: 5%;
  margin-right: 5%;
}

.descrption {
  display: grid;
  place-items: center;
}
</style>
