<template>
  <div id="myChatContent">
    <div
      v-if="
        Object.keys(myChatRoom).length !== 0 &&
        myChatRoom.nickname == user.nickname
      "
    >
      <div class="msg-box">
        <div @click="ToChatting(myChatRoom)">
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
                <p class="site-name">{{ myChatRoom.chatRoomName }}</p>
                <p class="last-msg">{{ myChatRoom.nickname }}</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <b-icon
            font-scale="1.5"
            icon="trash"
            aria-hidden="true"
            @click="deleteMyChat(myChatRoom.chatRoomId)"
          ></b-icon>
        </div>
      </div>
    </div>
    <div v-else class="centered-container">
      <br />
      <div>
        <h5><p>아직 개설한 채팅방이 없습니다! 새로 만드시겠습니까?</p></h5>
      </div>
      <div>
        <button
          class="w-btn w-btn-indigo"
          type="button"
          style="background-color: whitesmoke"
        >
          <b-icon
            class="icon"
            icon="plus-circle"
            @click="createChat()"
          ></b-icon>
        </button>
      </div>
      <b-input
        size="md"
        type="text"
        v-model="chatRoomName"
        style="margin-top: 3%; width: 60%"
      ></b-input>
    </div>
    <br />
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      chatRoomName: "",
      myChatRoom: {},
      user: {},
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
        if (chats.nickname == this.user.nickname) {
          this.myChatRoom = chats;
          break;
        }
      }
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    async ToChatting(res) {
      try {
        this.$store.commit("setChatRoomName", res.chatRoomName);
        this.$store.commit("setChatOwner", res.userId);
        const roomId = res.chatRoomId;
        location.href = `/chatWindow/${roomId}`;
      } catch (err) {
        console.log(err);
      }
    },
    async createChat() {
      try {
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };
        const data = {
          chatRoomName: this.chatRoomName,
        };
        const res = await axios.post(
          `${process.env.VUE_APP_API_URL}/chat`,
          data,
          option
        );
        this.myChatRoom = res.data;
        this.$router.go(0);
        alert("채팅방이 정상적으로 생성되었습니다!");
      } catch (err) {
        console.log(err);
      }
    },
    async deleteMyChat(roomId) {
      try {
        if (confirm("정말로 삭제하시겠습니까?")) {
          const option = {
            headers: {
              Authorization: "Bearer " + this.$getAccessToken(),
            },
          };
          await axios.delete(
            `${process.env.VUE_APP_API_URL}/chat/${roomId}`,
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

<style scoped>
@import "@/style/chat.css";
.centered-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
h5 {
  font-family: Hanna;
}

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
</style>
