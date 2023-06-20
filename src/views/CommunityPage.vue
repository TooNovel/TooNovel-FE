<template>
  <div id="community">
    <header>
      <div class="row justify-content-end">
        <div class="col">
          <h1>커뮤니티</h1>
        </div>
        <div class="col-auto">
          <b-button size="lg" @click="postWrite()">글쓰기</b-button>
        </div>
      </div>
    </header>
    <br />
    <section>
      <div>
        <b-nav tabs align="center">
          <b-nav-item @click="fetchPosts('FREE')">자유</b-nav-item>
          <b-nav-item @click="fetchPosts('NOVEL')">소설</b-nav-item>
          <b-nav-item @click="fetchPosts('ASK')">질문</b-nav-item>
          <b-nav-item @click="fetchPosts('PROMOTE')">홍보</b-nav-item>
        </b-nav>
      </div>
      <br />
      <b-table
        @row-clicked="goDetail"
        striped
        hover
        :items="posts"
        :fields="fields"
      >
      </b-table>
      <br />
      <hr />
      <ul id="pagenation">
        <li v-for="n in pages.totalPages" :key="n">
          <a
            :href="`/community?page=${n - 1}`"
            @click.prevent="postPaging(n - 1)"
            class="paging-btn"
          >
            {{ n }}
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      posts: {},
      fields: [
        {
          key: "category",
          label: "카테고리",
        },
        {
          key: "title",
          label: "제목",
        },
        {
          key: "nickname",
          label: "작성자",
        },
        {
          key: "createdDate",
          label: "작성일자",
        },
      ],
      pages: {},
    };
  },
  created() {
    this.pages = this.$route.params.data;
    const content = this.$route.params.data.content;
    this.posts = content
      .map((item) => {
        if (item.category === "SUGGEST") {
          return null;
        }
        const title = item.title + `  (${item.commentCount})`;
        const createdDate = item.createdDate;
        const year = createdDate[0];
        const month = createdDate[1];
        const day = createdDate[2];
        const hour = createdDate[3];
        const minute = createdDate[4];
        const formattedDate = `${year}-${month}-${day} ${hour}:${minute}`;

        let categoryText;
        switch (item.category) {
          case "FREE":
            categoryText = "자유";
            break;
          case "NOVEL":
            categoryText = "소설";
            break;
          case "ASK":
            categoryText = "질문";
            break;
          case "PROMOTE":
            categoryText = "홍보";
            break;
          default:
            categoryText = item.category;
        }

        return {
          id: item.postId,
          category: categoryText,
          title: title,
          nickname: item.nickname,
          createdDate: formattedDate,
        };
      })
      .filter(Boolean);
    console.log(this.posts);
  },
  methods: {
    async postPaging(n) {
      try {
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/post?page=${n}`
        );
        this.pages = res.data;
        const content = res.data.content;
        this.posts = content
          .map((item) => {
            if (item.category === "SUGGEST") {
              return null;
            }
            const title = item.title + `  (${item.commentCount})`;
            const createdDate = item.createdDate;
            const year = createdDate[0];
            const month = createdDate[1];
            const day = createdDate[2];
            const hour = createdDate[3];
            const minute = createdDate[4];
            const formattedDate = `${year}-${month}-${day} ${hour}:${minute}`;

            let categoryText;
            switch (item.category) {
              case "FREE":
                categoryText = "자유";
                break;
              case "NOVEL":
                categoryText = "소설";
                break;
              case "ASK":
                categoryText = "질문";
                break;
              case "PROMOTE":
                categoryText = "홍보";
                break;
              default:
                categoryText = item.category;
            }

            return {
              id: item.postId,
              category: categoryText,
              title: title,
              nickname: item.nickname,
              createdDate: formattedDate,
            };
          })
          .filter(Boolean);
      } catch (err) {
        console.log(err);
      }
    },
    async fetchPosts(category) {
      try {
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/post?category=${category}`
        );
        this.pages = res.data;
        const content = res.data.content;
        this.posts = content.map((item) => {
          const title = item.title + item.commentCount;
          const createdDate = item.createdDate;
          const year = createdDate[0];
          const month = createdDate[1];
          const day = createdDate[2];
          const hour = createdDate[3];
          const minute = createdDate[4];
          const formattedDate = `${year}-${month}-${day} ${hour}:${minute}`;

          let categoryText;
          switch (item.category) {
            case "FREE":
              categoryText = "자유";
              break;
            case "NOVEL":
              categoryText = "소설";
              break;
            case "ASK":
              categoryText = "질문";
              break;
            case "PROMOTE":
              categoryText = "홍보";
              break;
            default:
              categoryText = item.category;
          }

          return {
            id: item.postId,
            category: categoryText,
            title: title,
            nickname: item.nickname,
            createdDate: formattedDate,
          };
        });
      } catch (err) {
        console.log(err);
      }
    },
    async postWrite() {
      try {
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };
        await axios.get(`${process.env.VUE_APP_API_URL}/user/me`, option);
        this.$router.push({ path: "/community/write" });
      } catch (err) {
        if (this.$getAccessToken() == null || this.$getAccessToken() === "") {
          alert("로그인 후 게시글 작성할 수 있습니다!");
        }
        console.log(err);
      }
    },
    goDetail(item) {
      console.log(item.id);
      this.$router.push({
        name: "PostDetailPage",
        params: {
          postId: item.id,
        },
      });
    },
  },
};
</script>
<style scoped>
#community {
  margin: 3%;
}
header {
  background-color: white;
  font-family: Hanna;
  padding: 1rem;
}

section {
  background-color: white;
}

li {
  margin: 0;
  padding: 0;
  list-style: none;
}
#pagenation {
  display: flex;
  margin: auto;
  justify-self: center;
  align-items: center;
  width: 0px;
}

.paging-btn {
  padding: 3px;
  margin: 3px;
  font-size: 20px;
  font-weight: 600;
  text-decoration: none;
  color: dimgray;
}
</style>
