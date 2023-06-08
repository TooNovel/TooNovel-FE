<template>
  <div id="community">
    <header>
      <div class="row justify-content-end">
        <div class="col">
          <h1>작가 신청 관리</h1>
        </div>
      </div>
    </header>
    <br />
    <section>
      <br />
      <b-table striped hover :items="authors" :fields="fields">
        <template #cell(approval)="row">
          <button
            class="btn btn-success"
            @click="
              approveAuthor(
                row.item.userId,
                row.item.nickname,
                row.item.enrollId
              )
            "
          >
            승인
          </button>
        </template>
      </b-table>
      <br />
      <hr />
      <ul id="pagenation">
        <li v-for="n in pages.totalPages" :key="n">
          <a
            :href="`/admin/author?page=${n - 1}`"
            @click.prevent="authorPaging(n - 1)"
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
      authors: {},
      fields: [
        {
          key: "enrollId",
          label: "신청 번호",
        },
        {
          key: "userId",
          label: "유저ID",
        },
        {
          key: "nickname",
          label: "닉네임",
        },
        {
          key: "isApproval",
          label: "승인 여부",
        },
        {
          key: "createdDate",
          label: "작가 신청 날짜",
        },
        {
          key: "approval",
          label: "승인",
        },
      ],
      pages: {},
    };
  },
  async created() {
    this.pages = this.$route.params.data;
    const content = this.$route.params.data.content;
    this.authors = content.map((item) => {
      const createdDate = item.createdDate;
      const year = createdDate[0];
      const month = createdDate[1];
      const day = createdDate[2];
      const hour = createdDate[3];
      const minute = createdDate[4];
      const formattedDate = `${year}-${month}-${day} ${hour}:${minute}`;
      let isApproval;
      if (item.isApproval == false) {
        isApproval = "대기중";
      } else {
        isApproval = "완료";
      }

      return {
        userId: item.userId,
        enrollId: item.enrollId,
        nickname: item.nickname,
        isApproval: isApproval,
        createdDate: formattedDate,
      };
    });
  },
  methods: {
    async authorPaging(n) {
      try {
        const res = await axios.get(`/api/v1/admin?page=${n}`);
        this.pages = res.data;
        const content = res.data.content;
        this.authors = content.map((item) => {
          const createdDate = item.createdDate;
          const year = createdDate[0];
          const month = createdDate[1];
          const day = createdDate[2];
          const hour = createdDate[3];
          const minute = createdDate[4];
          const formattedDate = `${year}-${month}-${day} ${hour}:${minute}`;
          let isApproval;
          if (item.isApproval == false) {
            isApproval = "승인 대기";
          } else {
            isApproval = "승인 완료";
          }

          return {
            userId: item.userId,
            enrollId: item.enrollId,
            nickname: item.nickname,
            isApproval: isApproval,
            createdDate: formattedDate,
          };
        });
      } catch (err) {
        console.log(err);
      }
    },
    async approveAuthor(userId, nickname, enrollId) {
      try {
        const author = {
          userId: userId,
          nickname: nickname,
          enrollId: enrollId,
        };
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };
        await axios.patch("/api/v1/admin", author, option);
        alert("승인 완료!");
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
