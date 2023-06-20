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
            <div class="info-box">
              <p class="site-name">{{ myChatRoom.chatRoomName }}</p>

              <p class="last-msg">{{ myChatRoom.nickname }}</p>
            </div>
          </div>
        </div>
        <div>
          <button
            @click="deleteMyChat(myChatRoom.chatRoomId)"
            type="button"
            aria-label="Close"
            class="close"
            style="background-color: whitesmoke; border-color: whitesmoke"
          >
            ×
          </button>
        </div>
      </div>
      <!--end of god-->
    </div>
    <div v-else>
      <p>
        <b>아직 개설한 채팅방이 없습니다!</b><br /><b>새로 만드시겠습니까?</b>
      </p>
      <b-icon
        class="icon"
        icon="plus-circle"
        variant="success"
        @click="createChat()"
      ></b-icon>
      <b-input type="text" v-model="chatRoomName"></b-input>
    </div>
    <br />
    <hr />
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
      const user = await axios.get(`/api/v1/user/me`, option);
      const chat = await axios.get(`/api/v1/chat/`, option);
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
        // const option = {
        //   headers: {
        //     Authorization: "Bearer " + this.$getAccessToken(),
        //   },
        // };
        const roomId = res.chatRoomId;
        // const chat = await axios.get(`/api/v1/chat/${roomId}`, option);
        // conosole.log(chat);
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
        const res = await axios.post("/api/v1/chat", data, option);
        console.log(res.data, " ---> 내가 만든 채팅방");
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
          console.log(roomId);
          console.log("삭제하기~");
          await axios.delete(`/api/v1/chat/${roomId}`, option);
          alert("삭제 되었습니다!");
          this.$router.go(0);
        } else {
          console.log("취소하기~");
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
img {
  width: 54px;
  height: 54px;
  border-radius: 16px;
}
/* html {
  height: 100%;
}
body {
  position: relative;
  width: 100%;
  height: 100%;
}

#myChatContent {
  position: absolute;
  width: 40%;
  left: 40%;
  margin: 0 0 0 -150px;
} */
</style>
