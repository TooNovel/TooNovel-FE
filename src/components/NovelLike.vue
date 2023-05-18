<template>
  <div class="row">
    <div>
      <button @click="novelLikeBtn()" :class="{ active: novelLiked }">
        <img
          :src="
            novelLiked
              ? 'https://cdn-icons-png.flaticon.com/512/803/803087.png'
              : 'https://cdn-icons-png.flaticon.com/512/812/812327.png'
          "
          :alt="novelLiked ? '좋아요 완료' : '좋아요 하기'"
          width="24"
          height="24"
        />
      </button>
      {{ novel.likeCount }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      novels: {},
      novelLiked: false,
    };
  },
  props: ["novel"],
  methods: {
    novelLikeBtn() {
      this.novelLiked = !this.novelLiked;
    },
  },
};
</script>

<style></style>
