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
          <b-form-input
            type="text"
            v-model="searchTitle"
            @keyup.enter="search()"
          />
        </b-input-group>
        <b-input-group prepend="작가" style="margin-top: 20px">
          <b-form-input type="text" v-model="author" @keyup.enter="search()" />
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
    <div>
      <div class="novel-list-box">
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
              <b-card-title>
                {{
                  novel.title.length < 25
                    ? novel.title
                    : novel.title.slice(0, 20) + "..."
                }}
              </b-card-title>
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
                      23, 2, 14, 17, 0, 19, 10, 34, 7, 50, 23, 43, 38, 50, 36,
                      34, 46, 19, 31, 17,
                    ]"
                  ></star-rating
                  >({{ novel.reviewCount }})&nbsp;&nbsp;
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
        v-if="this.novelId != 0"
        @infinite="infiniteHandler"
        spinner="waveDots"
      ></infinite-loading>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import InfiniteLoading from "vue-infinite-loading";
import StarRating from "vue-star-rating";

export default {
  name: "WorkSearchPage",
  data() {
    return {
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
      this.novelId = this.novels[this.novels.length - 1].novelId || 0;
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    async infiniteHandler($state) {
      try {
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
        this.novelId = this.novels[this.novels.length - 1].novelId;
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
    StarRating,
  },
};
</script>
<style scoped>
#WorkSearchPage {
  padding-top: 20px;
  display: flex;
  justify-content: center;
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
  height: 300px;
}

#search {
  flex-wrap: wrap;
}

.descrption {
  display: grid;
  place-items: center;
}
.none-result {
  text-align: center;
  margin: 2%;
}

.card-body {
  height: 420px;
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

.title {
  margin: 20px;
}

p {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
