<template>
  <div id="community">
    <h1>커뮤니티</h1>
    <br />
    <div>
      <b-button pill>전체</b-button>
      <b-button pill>자유</b-button>
      <b-button pill>장르</b-button>
      <b-button pill>질문</b-button>
      <b-button pill>이벤트</b-button>
    </div>
    <br />
    <b-table striped hover :items="items" :fields="fields"></b-table>
    <b-button variant="outline-primary">글쓰기</b-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Note `isActive` is left out and will not appear in the rendered table
      fields: ["카테고리", "제목", "작성자", "날짜", "조회수"],
      items: [
        {
          isActive: true,
          작성자: 40,
          카테고리: "Dickerson",
          제목: "Macdonald",
        },
        { isActive: false, 작성자: 21, 카테고리: "Larsen", 제목: "Shaw" },
        { isActive: false, 작성자: 89, 카테고리: "Geneva", 제목: "Wilson" },
        { isActive: true, 작성자: 38, 카테고리: "Jami", 제목: "Carney" },
      ],
    };
  },
};
</script>
<style>
#community {
  margin: 3%;
}
</style>
