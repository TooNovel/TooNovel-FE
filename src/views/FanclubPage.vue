<template>
  <div id="fanclub">
    <header>
      <div class="row justify-content-end">
        <div class="col">
          <h1>메신저</h1>
        </div>
        <div style="display: flex; justify-content: flex-end">
          <div class="col-auto">
            <div style="display: flex; align-items: center">
              <b-form-input placeholder="작가명" type="text" v-model="author" />
              <div style="margin-left: 10px">
                <b-button
                  @click="search()"
                  style="background-color: darkseagreen; border: 0"
                >
                  <b-icon
                    icon="search"
                    scale="1"
                    style="margin-top: 3px"
                  ></b-icon>
                </b-button>
              </div>
            </div>
          </div>
          <div class="col-auto" style="margin-left: 10px">
            <b-button variant="warning" @click="ToChatRoom()">
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
      </div>
    </header>
    <br />
    <div v-if="!searchedAuthor">
      <div>
        <div v-if="authorList.length > 0">
          <h2>🧑‍💻 최신 작가</h2>
          <carousel-3d
            :disable3d="true"
            :space="365"
            :clickable="false"
            :controls-visible="true"
            class="carousel-container"
          >
            <slide
              v-for="(author, index) in authorList"
              :key="index"
              :index="index"
              style="
                width: 250px;
                height: 270px;
                border-radius: 12px;
                background-color: whitesmoke;
              "
            >
              <img :src="author.imageUrl" class="myImg" />
              <h5 style="margin-bottom: 10px">{{ author.nickname }}</h5>
              <button
                class="w-btn-outline w-btn-green-outline"
                type="button"
                @click="joinRoom(author.userId)"
                id="joinBtn"
              >
                참여
              </button>
            </slide>
          </carousel-3d>
        </div>
      </div>
      <br />
      <div>
        <div v-if="roomList.length > 0">
          <h2>🗨️ 인기 채팅방</h2>
          <carousel-3d
            :disable3d="true"
            :space="365"
            :clickable="false"
            :controls-visible="true"
            class="carousel-container"
          >
            <slide
              v-for="(room, index) in roomList"
              :key="index"
              :index="index"
              style="
                width: 250px;
                height: 270px;
                border-radius: 12px;
                background-color: whitesmoke;
              "
            >
              <img :src="room.imageUrl" class="myImg" />
              <h5 style="margin-bottom: 10px">{{ room.nickname }}</h5>
              <button
                class="w-btn-outline w-btn-green-outline"
                type="button"
                @click="joinRoom(room.userId)"
                id="joinBtn"
              >
                참여
              </button>
            </slide>
          </carousel-3d>
        </div>
      </div>
    </div>
    <div v-if="searchedAuthor">
      <div class="author-list-box" ref="allAuthorList">
        <b-row>
          <b-col
            v-for="(author, index) in authors"
            :key="index"
            class="mb-3"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <b-card
              @click="detailNovelList(author.userId)"
              style="
                width: 250px;
                height: 300px;
                border-radius: 12px;
                background-color: whitesmoke;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <b-card-img
                :src="author.imageUrl"
                class="card-image"
              ></b-card-img>
              <b-card-title
                ><h5
                  class="text-center"
                  style="margin-bottom: 10px; margin-top: 10px"
                >
                  {{ author.nickname }}
                </h5></b-card-title
              >
              <b-card-text class="text-center">
                <button
                  class="w-btn-outline w-btn-green-outline"
                  type="button"
                  @click="joinRoom(author.rid)"
                >
                  참여
                </button>
              </b-card-text>
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
import { Carousel3d, Slide } from "vue-carousel-3d";
import InfiniteLoading from "vue-infinite-loading";
//import axios from "axios";

export default {
  data() {
    return {
      author: "",
      authorList: [],
      roomList: [],
      authors: [],
      userId: 0,
      enrollId: 0,
      searchedAuthor: false,
    };
  },
  async created() {
    try {
      const authorRes = await axios.get(
        `${process.env.VUE_APP_API_URL}/user/author`
      );
      this.authorList = authorRes.data;
      const roomRes = await axios.get(
        `${process.env.VUE_APP_API_URL}/user/chatroom`
      );
      this.roomList = roomRes.data;
    } catch (err) {
      console.log(err);
    }
  },
  components: {
    Carousel3d,
    Slide,
    InfiniteLoading,
  },
  async mounted() {
    try {
      const res = await axios.get(
        `${process.env.VUE_APP_API_URL}/user/author?nickname=${this.author}`
      );
      console.log(res);
      this.authors = res.data;
      this.userId = this.authors[this.authors.length - 1].userId;
      this.enrollIdId = this.authors[this.authors.length - 1].enrollId;
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    async ToChatRoom() {
      this.$router.push({ name: "ChatRoom" });
    },
    async joinRoom(uid) {
      try {
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };
        await axios.post(
          `${process.env.VUE_APP_API_URL}/chat/${uid}`,
          {},
          option
        );
        alert("가입이 완료됐습니다!");
        this.ToChatRoom();
      } catch (err) {
        if (err.response.data.code == "H004") {
          alert(err.response.data.message);
          this.ToChatRoom();
        } else if (err.response.data.code == "A002") {
          alert("로그인이 필요합니다.");
          this.$router.push("/login");
        } else if (err.response.data.code == "H002") {
          alert(err.response.data.message);
        }
      }
    },
    async infiniteHandler($state) {
      if (!this.authors.length) {
        // 데이터가 없는 경우 초기 데이터를 가져옵니다.
        try {
          const res = await axios.get(
            `${process.env.VUE_APP_API_URL}/user/author?nickname=${this.author}`
          );
          this.authors = res.data;
          this.userId = this.authors[this.authors.length - 1].userId;
          this.enrollId = this.authors[this.authors.length - 1].enrollId;
          $state.loaded();
        } catch (err) {
          console.log(err);
          $state.complete();
        }
        return;
      }
      try {
        console.log(this.enrollId);
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/user/author?enrollId=` +
            this.enrollId +
            `&nickname=` +
            this.author
        );
        console.log("length :" + res.data.length);
        if (res.data.length) {
          if (this.enrollId / res.data.length == 0) {
            $state.complete(); //데이터가 없으면 로딩 끝
          } else {
            this.authors = this.authors.concat(res.data);
            this.enrollId = res.data[res.data.length - 1].enrollId;
            $state.loaded(); //데이터 로딩
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
        this.searchedAuthor = false;
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/user/author?nickname=${this.author}`
        );
        this.authors = [];
        this.authors = res.data;
        this.enrollId = res.data[res.data.length - 1].enrollId;
        this.searchedAuthor = true;
      } catch (err) {
        console.log(err);
        this.searchedAuthor = true;
      }
    },
  },
};
</script>
<style scoped>
@import "@/style/button.css";

.card {
  width: 100%;
  height: 100%;
  border: none;
  box-shadow: 0 0 20px 0 rgba(94, 92, 154, 0.2);
  border-radius: 10px;
  font-size: 14px;
}
.card-image {
  border-radius: 50%;
  width: 150px;
  height: 150px;
  object-fit: cover;
  margin-bottom: 10px;
  margin-top: 5px;
}
.carousel-container .carousel-3d-slide .myImg {
  margin-top: 15px;
  border-radius: 50%;
  width: 150px;
  height: 150px;
  object-fit: cover;
  margin-bottom: 15px;
}

h1,
h2,
h3,
h5,
h6,
b,
button {
  font-family: "Hanna";
}

#fanclub {
  margin: 3%;
}

.carousel-container .carousel-3d-slide {
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

.author-list-box {
  margin-top: 2%;
  margin-left: 5%;
  margin-right: 5%;
}

#allProductList {
  height: 400px; /* 스크롤이 표시될 최대 높이값 */
}

.carousel-3d-slider > div {
  width: 100%;
  height: 100%;
  border: none;
  box-shadow: 0 0 20px 0 rgba(94, 92, 154, 0.2);
  border-radius: 10px;
  font-size: 14px;
}

.carousel-3d-controls {
  width: 1000px;
  height: 1000px;
}

.carousel-container {
  height: 300px;
  overflow: revert;
}

#joinBtn {
  margin-bottom: 10px;
}
</style>
