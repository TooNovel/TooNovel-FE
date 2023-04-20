<template>
  <div>
    <h3><b>전체 작품 리스트</b></h3>
    <div id="allProductList">
      <b-row>
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
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      products: [],
    };
  },
  mounted() {
    const URL = "https://aee2de78-332d-40e2-af1e-ee62eb99672d.mock.pstmn.io";

    axios
      .get(URL + "/work/readall")
      .then((response) => {
        this.products = response.data.products;
        console.log(response.data.products);
        console.log("왜 안돼!");
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    handleNotificationListScroll(e) {
      const { scrollHeight, scrollTop, clientHeight } = e.target;
      const isAtTheBottom = scrollHeight === scrollTop + clientHeight;
      // 일정 이상 밑으로 내려오면 함수 실행 / 반복된 호출을 막기위해 1초마다 스크롤 감지 후 실행
      if (isAtTheBottom) {
        setTimeout(() => this.handleLoadMore(), 1000);
      }
    },

    // 내려오면 api를 호출하여 아래에 더 추가,
    handleLoadMore() {
      console.log("리스트 추가");
      // api를 호출하여 리스트 추가하면 됨, 현재는 pushList에 1개의 index 추가
      this.pushList.push(2);
    },

    handleImageError(event) {
      event.target.src =
        "https://via.placeholder.com/600x600.png?text=No+Image";
    },
  },
};
</script>

<style scoped>
#allProductList {
  margin-top: 2%;
  margin-left: 5%;
  margin-right: 5%;
}
</style>
