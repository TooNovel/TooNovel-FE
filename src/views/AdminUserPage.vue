<template>
  <div id="community">
    <header>
      <div class="row justify-content-end">
        <div class="col">
          <h1>회원 관리</h1>
        </div>
      </div>
    </header>
    <br />
    <section>
      <br />
      <b-table striped hover :items="users" :fields="fields">
        <template #cell(delete)="row">
          <button class="btn btn-danger" @click="deleteUser(row.item.userId)">
            탈퇴
          </button>
        </template>
      </b-table>
      <br />
      <hr />
      <ul id="pagenation">
        <li v-for="n in pages.totalPages" :key="n">
          <a
            :href="`/admin/user?page=${n - 1}`"
            @click.prevent="userPaging(n - 1)"
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
      users: {},
      fields: [
        {
          key: "userId",
          label: "유저ID",
        },
        {
          key: "createdDate",
          label: "생성일자",
        },
        {
          key: "birth",
          label: "생일",
        },
        {
          key: "deleted",
          label: "탈퇴여부",
        },
        {
          key: "nickname",
          label: "닉네임",
        },
        {
          key: "provider",
          label: "플랫폼",
        },
        {
          key: "role",
          label: "역할",
        },
        {
          key: "delete",
          label: "탈퇴",
        },
      ],
      pages: {},
    };
  },
  created() {
    // 전체 회원 데이터 생성 추가 예정
    this.pages = this.$route.params.data;
    const content = this.$route.params.data.content;
    this.users = content.map((item) => {
      const createdDate = item.createdDate;
      const year = createdDate[0];
      const month = createdDate[1];
      const day = createdDate[2];
      const formattedDate = `${year}/${month}/${day}`;

      return {
        userId: item.userId,
        createdDate: formattedDate,
        birth: item.birth,
        deleted: item.deleted,
        nickname: item.nickname,
        provider: item.provider,
        role: item.role,
      };
    });
  },
  methods: {
    async userPaging(n) {
      try {
        // 전체 회원 조회 페이징 메소드 추가 예정
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/user?page=${n}`
        );
        this.pages = res.data;
        const content = res.data.content;
        this.users = content.map((item) => {
          const createdDate = item.createdDate;
          const year = createdDate[0];
          const month = createdDate[1];
          const day = createdDate[2];
          const hour = createdDate[3];
          const minute = createdDate[4];
          const formattedDate = `${year}-${month}-${day} ${hour}:${minute}`;

          return {
            userId: item.userId,
            createdDate: formattedDate,
            birth: item.birth,
            deleted: item.deleted,
            nickname: item.nickname,
            provider: item.provider,
            role: item.role,
          };
        });
      } catch (err) {
        console.log(err);
      }
    },
    async deleteUser(userId) {
      // 특정 회원 삭제 메소드 구현 예정
      try {
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };
        await axios.delete(
          `${process.env.VUE_APP_API_URL}/user` + userId,
          option
        );
        alert("탈퇴");
      } catch (err) {
        console.log(err);
      }
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
