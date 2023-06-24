<template>
  <div class="chatBody">
    <div>
      <div id="chatHeader">
        <div class="row">
          <div class="col-2">
            <div @click="ToMessenger()">🔙</div>
          </div>
          <header class="col-10">
            <div class="row">
              <div class="col-10">나의 채팅방</div>
            </div>
          </header>
        </div>
      </div>
      <section>
        <div v-if="role == 'AUTHOR'">
          <my-chatroom></my-chatroom>
          <hr />
        </div>
        <div class="myFollowTitle">
          <h5>
            <b>내가 팔로우한 채팅방</b>
          </h5>
        </div>
        <my-followchat></my-followchat>
      </section>
    </div>
  </div>
</template>

<script>
import MyChatRoom from "./MyChatRoom.vue";
import MyFollowChat from "./MyFollowChat.vue";

export default {
  name: "ChatRoom",
  data() {
    return {
      roomId: "",
      user: {},
      role: null,
    };
  },
  async created() {
    try {
      const accessToken = this.$getAccessToken();
      const role = this.$getTokenInfo(accessToken).role;
      this.role = role;
    } catch (err) {
      console.log(err);
    }
  },
  components: {
    "my-chatroom": MyChatRoom,
    "my-followchat": MyFollowChat,
  },
  methods: {
    ToMessenger() {
      location.href = "/fanclub";
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/style/chat.css";
h3 {
  color: white;
  font-family: Hanna;
}

html {
  height: 100%;
}
body {
  position: relative;
  width: 100%;
  height: 100%;
}
header {
  background-color: darkseagreen;
}
#chatHeader {
  width: 98%;
  height: 60px;
  text-align: center;
  line-height: 60px;
  font-size: 25px;
  font-weight: 900;
  border-bottom: 1px solid #ddd;
  background-color: darkseagreen;
}
.chatBody {
  position: absolute;
  background-color: whitesmoke;
  width: 30%;
  height: 100%;
  left: 50%;
  transform: translateX(-50%);
}
.outHeader {
  justify-content: center;
  display: flex;
}
.innerHeader {
  padding-top: 20px;
}
.myFollowTitle {
  margin-left: 5%;
  margin-top: 5%;
}
</style>
