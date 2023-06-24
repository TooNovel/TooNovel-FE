<template>
  <div>
    <div v-if="followChatList.length > 0">
      <div v-for="(chat, index) in followChatList" :key="index">
        <div class="msg-box">
          <div @click="ToMyFollwingChat(chat)">
            <div class="img-info-box">
              <div class="img-box">
                <div class="im-on" />
                <img
                  src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F2513B53E55DB206927"
                  alt="img"
                />
              </div>
              <div class="row">
                <div class="info-box col">
                  <p class="site-name">{{ chat.chatRoomName }}</p>
                  <p class="last-msg">{{ chat.nickname }}</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <b-icon
              font-scale="1.5"
              icon="trash"
              aria-hidden="true"
              @click="deleteFollowChat(chat.chatRoomId)"
            ></b-icon>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="followList">
        <h6>아직 참여한 채팅방이 없습니다! 얼른 참여해보세요!</h6>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      followChatList: [],
      chatList: [],
    };
  },
  async created() {
    try {
      const option = {
        headers: {
          Authorization: "Bearer " + this.$getAccessToken(),
        },
      };
      const user = await axios.get(
        `${process.env.VUE_APP_API_URL}/user/me`,
        option
      );
      const chat = await axios.get(
        `${process.env.VUE_APP_API_URL}/chat/`,
        option
      );
      this.user = user.data;
      this.chatList = chat.data;
      for (let chats of this.chatList) {
        if (chats.userId != this.user.userId) {
          this.followChatList.push(chats);
        }
      }
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    async ToMyFollwingChat(res) {
      try {
        this.$store.commit("setChatRoomName", res.chatRoomName);
        this.$store.commit("setChatOwner", res.userId);
        const roomId = res.chatRoomId;
        location.href = `/chatWindow/${roomId}`;
      } catch (err) {
        console.log(err);
      }
    },
    async deleteFollowChat(rId) {
      try {
        if (confirm("정말로 탈퇴하시겠습니까?")) {
          const option = {
            headers: {
              Authorization: "Bearer " + this.$getAccessToken(),
            },
          };
          await axios.delete(
            `${process.env.VUE_APP_API_URL}/chat/leave/${rId}`,
            option
          );
          this.$router.go(0);
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/style/chat.css";
img {
  width: 54px;
  height: 54px;
  border-radius: 16px;
}
.close {
  background-color: whitesmoke;
  border-color: whitesmoke;
}
div.info-box.col {
  width: 80%;
}
.followList {
  margin-left: 5%;
  font-family: Hanna;
}
</style>
