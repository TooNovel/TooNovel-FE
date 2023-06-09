<template>
  <div class="row">
    <div>
      <button @click="postLike(post)" :class="{ active: postLiked }">
        <img
          :src="
            postLiked
              ? 'https://cdn-icons-png.flaticon.com/512/803/803087.png'
              : 'https://cdn-icons-png.flaticon.com/512/812/812327.png'
          "
          width="24"
          height="24"
        />
      </button>
      좋아요 {{ post.like }}
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      postLiked: false,
    };
  },
  props: ["post"],
  async created() {
    try {
      const postId = this.$route.params.postId;
      const option = {
        headers: {
          Authorization: "Bearer " + this.$getAccessToken(),
        },
      };
      const result = await axios.get(
        "/api/v1/post/" + postId + "/like",
        option
      );
      console.log(result);
      this.postLiked = result.data.like;
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    async postLike(res) {
      if (this.$getAccessToken() == null || this.$getAccessToken() == "") {
        alert("로그인 후 이용 가능 합니다!");
        return;
      }
      try {
        const postId = res.postId;
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };
        await axios.put("/api/v1/post/" + postId + "/like", null, option);
        const result = await axios.get("/api/v1/post/" + postId, option);
        this.postLiked = !this.postLiked;
        res.like = result.data.like;
      } catch (err) {
        const errStatus = err.response.data;
        if (errStatus.code == "P003") {
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
};
</script>

<style scoped></style>
