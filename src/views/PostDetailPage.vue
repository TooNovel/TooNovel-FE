<template>
  <div>
    <main style="margin-top: 3%">
      <article>
        <b-container class="bv-example-row">
          <b-row class="rows">
            <b-col>
              <b>제목</b>
              <p>{{ post.title }}</p>
            </b-col>
            <b-col>
              <img src="/favicon.ico" id="profile" />
              <b>작성자</b> {{ post.nickname }}
              <p></p>
            </b-col>
            <b-col>
              <b>조회수</b>
              <p>{{ post.viewCount }}</p>
            </b-col>
          </b-row>
          <b-row class="rows">
            <b-col>
              <post-like :post="post"></post-like>
            </b-col>
          </b-row>
          <br />
          <b-row class="rows">
            <b-col class="descrption">
              <label><b>내용</b></label>
              <p>{{ post.content }}</p>
            </b-col>
          </b-row>
        </b-container>
        <br />
        <b-container>
          <h6><b>댓글 작성하기</b></h6>
          <div class="row">
            <b-form>
              <div class="col">
                <b-textarea rows="10" type="text" v-model="commentContent">
                </b-textarea>
              </div>
              <div class="col" style="margin-top: 1%">
                <b-button
                  id="commentBtn"
                  @click="commentWrite()"
                  style="margin-left: 1%"
                  >등록</b-button
                >
              </div>
            </b-form>
          </div>
        </b-container>
        <br />
        <b-container>
          <h4><b>🗨️댓글</b></h4>
          <div v-for="comment in comments" v-bind:key="comment.commentId">
            <div class="commentBox">
              <div class="row">
                <div class="col">
                  <p><b>작성자ㅤ</b>{{ comment.nickname }}</p>
                </div>
                <div class="col">
                  <p><b>작성일자ㅤ</b>{{ comment.createdDate }}</p>
                </div>
              </div>
              <div class="row">
                <p>{{ comment.commentContent }}</p>
              </div>
              <div class="row">
                <div class="col">
                  <div class="right_area">
                    <button
                      @click="commentLike(comment)"
                      :class="{ active: comment.isActived }"
                    >
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/803/803087.png"
                        width="24"
                        height="24"
                      />
                    </button>
                    좋아요 : {{ comment.commentLike }}
                  </div>
                </div>
              </div>
            </div>
            <br />
          </div>
        </b-container>
      </article>
    </main>
  </div>
</template>
<script scoped>
import axios from "axios";
import PostLike from "@/components/PostLike.vue";

export default {
  name: "PostDetailPage",
  data() {
    return {
      post: {},
      comments: [],
      commentContent: "",
      postLiked: false,
      postId: 0,
    };
  },
  async created() {
    try {
      const id = this.$route.params.postId;
      console.log(id);

      const postRes = await axios.get(
        `${process.env.VUE_APP_API_URL}/post/` + id
      );
      this.post = postRes.data;

      const commentRes = await axios.get(
        `${process.env.VUE_APP_API_URL}/comment/` + id
      );
      this.comments = commentRes.data.content;

      // const [year, month, day] = this.reviews.content[0].createdDate;
      // this.createdDate = `${year}/${month}/${day}`;

      this.comments.forEach((comment) => {
        comment.createdDate = `${comment.createdDate[0]} / ${comment.createdDate[1]} / ${comment.createdDate[2]}`;
      });
      console.log(this.comments);
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    async commentWrite() {
      try {
        const obj = {
          commentContent: this.commentContent,
          writerId: 0,
          postId: this.post.postId,
        };
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };
        const res = await axios.post(
          `${process.env.VUE_APP_API_URL}/comment`,
          obj,
          option
        );
        const newComment = res.data;
        this.comments.push(newComment);
        this.$router.go(0);
      } catch (err) {
        if (this.$getAccessToken() == null || this.$getAccessToken() === "") {
          alert("로그인 후 댓글 작성할 수 있습니다!");
        }
        console.log(err);
      }
    },
    async commentLike(res) {
      try {
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };
        await axios.post(
          `${process.env.VUE_APP_API_URL}/comment/` + res.commentId + "/like",
          null,
          option
        );
        const result = await axios.get(
          `${process.env.VUE_APP_API_URL}/comment/` + this.post.postId,
          option
        );
        const clickComment = result.data.content.find(
          (comment) => comment.nickname === res.nickname
        );
        res.commentLike = clickComment.commentLike;
      } catch (err) {
        const errStatus = err.response.data;
        if (errStatus.code == "M003") {
          alert(errStatus.message);
        } else if (
          this.$getAccessToken() == null ||
          this.$getAccessToken() === ""
        ) {
          alert("로그인 후 좋아요 눌러주세요!");
        }
      }
    },
  },
  components: {
    "post-like": PostLike,
  },
};
</script>
<style scoped>
#commentBtn {
  border-radius: 1px;
}
.rows {
  background-color: white;
  padding: 2%;
}
.descrption {
  background-color: white;
  border-radius: 10px;
  padding: 2%;
}
.commentBox {
  background-color: white;
  padding: 1rem;
  border-radius: 10px;
}
button {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  border-radius: 50%;
  border: solid 2px white;
  background-color: white;
}
.active img {
  width: 24px;
  height: 24px;
}
.active img {
  animation: animateHeart 0.3s linear forwards;
}

#profile {
  border-radius: 50%;
  width: 40px;
  height: 40px;
}
@keyframes animateHeart {
  0% {
    transform: scale(0.2);
  }

  40% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}
</style>
