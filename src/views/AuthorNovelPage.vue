<template>
  <div class="container">
    <MyPageNavbar></MyPageNavbar>
    <div id="loading" v-if="isLoading" style="height: 800px">
      <div class="loader">Loading...</div>
    </div>
    <div v-else class="novel-list-box" ref="allProductList">
      <h3 class="title"><b>내가 연재한 작품</b></h3>
      <h4 class="title">이미지에 마우스를 두면 통계를 볼 수 있습니다.</h4>
      <div v-if="novels.length == 0">
        <h1>아직 연재중인 작품이 없습니다.</h1>
      </div>
      <div v-else>
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
              @mouseleave="toolTipOff()"
            >
              <b-card>
                <b-card-img
                  :src="novel.image"
                  class="card-image"
                  @mouseover="toolTipOn(index)"
                >
                </b-card-img>
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
                  <div
                    style="
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                    "
                  >
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
                    >&nbsp;({{ novel.reviewCount }})&nbsp;&nbsp;
                    <b-icon
                      icon="hand-thumbs-up"
                      font-scale="1.5"
                      variant="danger"
                    ></b-icon>
                    {{ novel.likeCount }}
                  </div>
                </template>
                <div v-if="toolTip === index">
                  <button @click="detailNovelList(novel.novelId)">
                    상세보기
                  </button>
                  <button @click="getStatistic(novel.novelId)">통계보기</button>
                </div>
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
    </div>
  </div>
</template>

<script>
import MyPageNavbar from "@/components/MyPageNavbar.vue";
import axios from "axios";
import InfiniteLoading from "vue-infinite-loading";
import StarRating from "vue-star-rating";

export default {
  data() {
    return {
      novels: [],
      novelId: 0,
      toolTip: -1,
      isLoading: true,
    };
  },
  methods: {
    toolTipOn(index) {
      this.toolTip = index;
    },
    toolTipOff() {
      this.toolTip = -1;
    },
    detailNovelList(novelId) {
      location.href = "/novel/" + novelId;
    },
    async infiniteHandler($state) {
      const option = {
        headers: {
          Authorization: "Bearer " + this.$getAccessToken(),
        },
      };
      if (!this.novels.length) {
        // 데이터가 없는 경우 초기 데이터를 가져옵니다.
        try {
          const res = await axios.get(
            `${process.env.VUE_APP_API_URL}/novel/author?novelId=${this.novelId}`,
            option
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
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/novel/author?novelId=${this.novelId}`,
          option
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
    handleImageError(event) {
      event.target.src =
        "https://via.placeholder.com/600x600.png?text=No+Image";
    },
    async getStatistic(novelId) {
      try {
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };
        const genderRes = await axios.get(
          `${process.env.VUE_APP_API_URL}/statistics/${novelId}/gender`,
          option
        );
        const ageRes = await axios.get(
          `${process.env.VUE_APP_API_URL}/statistics/${novelId}/age`,
          option
        );
        const novelRes = await axios.get(
          `${process.env.VUE_APP_API_URL}/novel/` + novelId
        );

        const reviewRes = await axios.get(
          `${process.env.VUE_APP_API_URL}/review/` + novelId + "/novel"
        );
        this.$router.push({
          name: "NovelStatisticsPage",
          params: {
            gender: genderRes.data,
            age: ageRes.data,
            novel: novelRes.data,
            review: reviewRes.data,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    async sleep(sec) {
      return new Promise((resolve) => setTimeout(resolve, sec));
    },
  },
  async mounted() {
    try {
      const option = {
        headers: {
          Authorization: "Bearer " + this.$getAccessToken(),
        },
      };
      const res = await axios.get(
        `${process.env.VUE_APP_API_URL}/novel/author`,
        option
      );
      this.novels = res.data;
      this.novelId = this.novels[this.novels.length - 1].novelId;
      await this.sleep(1500);
      if (!(this.novels.length === 0)) {
        this.isLoading = false;
      }
    } catch (err) {
      if (err.code == "U001") {
        alert(err.message);
      } else if (
        this.$getAccessToken() == null ||
        this.$getAccessToken() === ""
      ) {
        alert("로그인 후 좋아요 눌러주세요!");
      }
    }
  },
  components: {
    InfiniteLoading,
    MyPageNavbar,
    StarRating,
  },
};
</script>

<style lang="scss" scoped>
.title {
  margin: 20px;
}
button {
  cursor: pointer;
  border-radius: 10px;
  border: 2px solid #93bb91;
  background-color: white;
  box-shadow: 1px 1px 1px 1px #a9eaa6;
  font-family: "Hanna";
}
button:hover {
  background-color: #a9eaa6;
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
