<template>
  <div class="row">
    <div>
      <button @click="novelLike(novel)" :class="{ active: novelLiked }">
        <img
          :src="
            novelLiked
              ? 'https://cdn-icons-png.flaticon.com/512/803/803087.png'
              : 'https://cdn-icons-png.flaticon.com/512/812/812327.png'
          "
          width="24"
          height="24"
        />
      </button>
      {{ novel.likeCount }}
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      novelLiked: false,
      accessToken: this.$store.getters.getAccessToken,
    };
  },
  props: ["novel"],
  async created() {
    try {
      const novelId = this.$route.params.novel_id;
      const option = {
        headers: {
          Authorization: "Bearer " + this.accessToken,
        },
      };
      const result = await axios.get(
        "/api/v1/novel/" + novelId + "/like",
        option
      );
      console.log(result);
      this.novelLiked = result.data.like;
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    async novelLike(res) {
      if (this.accessToken == null || this.accessToken == "") {
        alert("로그인 후 이용 가능 합니다!");
        return;
      }
      try {
        const novelId = res.novelId;
        const option = {
          headers: {
            Authorization: "Bearer " + this.accessToken,
          },
        };
        await axios.put("/api/v1/novel/" + novelId + "/like", null, option);
        const result = await axios.get("/api/v1/novel/" + novelId, option);
        this.novelLiked = !this.novelLiked;
        res.likeCount = result.data.likeCount;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style scoped></style>
