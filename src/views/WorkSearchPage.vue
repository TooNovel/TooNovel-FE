<template>
  <div>
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
          <b-form-input type="text" v-model="title" />
        </b-input-group>
        <b-input-group prepend="작가" style="margin-top: 20px">
          <b-form-input type="text" v-model="author" />
          <b-button variant="secondary" @click="search()">검색</b-button>
        </b-input-group>
      </b-form-group>
    </div>
    <b-row id="work" style="margin-top: 20px">
      <b-col
        v-for="(product, index) in products"
        :key="index"
        class="mb-3"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <b-card>
          <b-card-img
            :src="product.image"
            :alt="product.title"
            @error="handleImageError"
          ></b-card-img>
          <b-card-title>{{ product.title }}</b-card-title>
          <b-card-text>{{ product.contents }}</b-card-text>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "WorkSearchPage",
  data() {
    return {
      title: "",
      novel: {},
      novelId: "",
      products: [],
      genre: "",
      author: "",
      selected: "",
      selectedOption: "title",
      searchKeyword: "",
      keyword: "",
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
  async created() {
    this.keyword = this.$route.query.title;
    await axios
      .get(`/api/v1/novel/?novelId=&title=${this.keyword}`)
      .then((response) => {
        this.products = response.data;
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    async search() {
      console.log(this.title);
      console.log(this.author);
      console.log(this.selected);
      await axios
        .get(
          `/api/v1/novel/?novelId=&title=${this.title}&author=${this.author}&genre=${this.selected}`
        )
        .then((response) => {
          this.products = [];
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
<style scoped>
#WorkSearchPage {
  padding-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

#search {
  flex-wrap: wrap;
}

#work {
  margin-top: 2%;
  margin-left: 5%;
  margin-right: 5%;
}
</style>
