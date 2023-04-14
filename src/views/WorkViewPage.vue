<template>
    <div id="community">
      <h1>작품</h1>
      <br />
      <br />
      <table>
        <colgroup>
          <col width="33%" />
          <col width="33%" />
          <col width="33%" />
        </colgroup>
        <thead>
          <tr>
            <th>index</th>
            <th>제목</th>
            <th>이미지</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="work in works" :key="{ work }">
            <td>{{ work.work_id }}</td>
            <td>{{ work.title }}</td>
            <td><img :src="work.image" /></td>
          </tr>
        </tbody>
      </table>
      <b-button variant="outline-primary">
        <a href="/community/write">글쓰기</a>
      </b-button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        works: [],
      };
    },
    created() {
      this.posts = this.$route.params.data;
    },
  };
  </script>
  <style>
  #community {
    margin: 3%;
  }
  table {
    width: 100%;
  }
  </style>
  