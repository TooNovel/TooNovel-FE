<template>
  <div class="chatBody">
    <div>
      <header class="chatHeader">
        <b-navbar>
          <b-container fluid>
            <b-row>
              <b-col cols="auto" style="height: 80px">
                <h4>
                  <b>나의 채팅방</b>
                </h4>
              </b-col>
            </b-row>
          </b-container>
        </b-navbar>
      </header>
      <br />
      <section>
        <div>
          <div v-if="role == 'AUTHOR'">
            <div>
              <my-chatroom></my-chatroom>
            </div>
          </div>
          <h5>
            <b>내가 팔로우한 채팅방</b>
          </h5>
          <div>
            <my-followchat></my-followchat>
          </div>
          <!-- end of for -->
        </div>
        <br />
        <hr />
      </section>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import MyChatRoom from "./MyChatRoom.vue";
import MyFollowChat from "./MyFollowChat.vue";

export default {
  name: "ChatRoom",
  data() {
    return {
      roomId: "", // 추후에 api 통신으로 받아올것
      user: {}, // userId, nickname...
      chatRoomName: "",
      //isCreator: true, // true 이면 작가, false면 독자
      chatList: [],
      role: null,
    };
  },
  async created() {
    const option = {
      headers: {
        Authorization: "Bearer " + this.$getAccessToken(),
      },
    };
    try {
      const chat = await axios.get(
        `${process.env.VUE_APP_API_URL}/chat`,
        option
      );
      const accessToken = this.$getAccessToken();
      const role = this.$getTokenInfo(accessToken).role;
      this.role = role;
      this.chatList = chat.data;
    } catch (err) {
      console.log(err);
    }
  },
  components: {
    "my-chatroom": MyChatRoom,
    "my-followchat": MyFollowChat,
  },
  methods: {
    async ToReply() {
      const options = "width=500,height=600";
      this.roomId = 1;
      const url = "/chatReply";
      window.open(url, "_blank", options);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/style/chat.css";
html {
  height: 100%;
}
body {
  position: relative;
  width: 100%;
  height: 100%;
}
.chatBody {
  position: absolute;
  width: 40%;
  left: 40%;
  margin: 0 0 0 -150px;
}
</style>
