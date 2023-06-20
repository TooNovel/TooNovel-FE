<template>
  <div id="contentWrap">
    <div id="contentCover">
      <div id="chatWrap">
        <div id="chatHeader">답장 보기</div>
        <div id="chatLog">
          <div
            class="anotherMsg"
            v-for="(chat, index) in chatList"
            :key="index"
          >
            <div class="msg" v-if="chat.creator == false">
              <span>{{ chat.message }}</span>
            </div>
          </div>
        </div>
      </div>
      <form id="chatForm">
        <input
          type="text"
          size="30"
          id="message"
          placeholder="메시지를 입력하세요"
          v-model="message"
        />
        <b-button @click="sendMsg()">send</b-button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      chatList: [],
    };
  },
  async created() {
    const option = {
      headers: {
        Authorization: "Bearer " + this.$getAccessToken(),
      },
    };
    try {
      const rId = 1;
      const res = await axios.get(
        `${process.env.VUE_APP_API_URL}/chat/` + rId,
        option
      );
      console.log(res);
      this.chatList = res.data;
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    sendMsg() {
      const obj = {
        senderId: this.userId,
        message: this.message,
      };
      console.log(obj);
      try {
        this.stompClient.send(
          `/app/chat/${this.roomId}`,
          JSON.stringify(obj),
          {}
        );
        this.message = "";
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
#chatWrap {
  border: 1px solid #ddd;
}

#chatHeader {
  height: 60px;
  text-align: center;
  line-height: 60px;
  font-size: 25px;
  font-weight: 900;
  border-bottom: 1px solid #ddd;
}

#chatLog {
  height: 450px;
  overflow-y: auto;
  padding: 10px;
}

.myMsg {
  text-align: right;
}

.anotherMsg {
  text-align: left;
  margin-bottom: 5px;
}

.msg {
  display: inline-block;
  border-radius: 15px;
  padding: 7px 15px;
  margin-bottom: 10px;
  margin-top: 5px;
}

.anotherMsg > .msg {
  background-color: #f1f0f0;
}

.myMsg > .msg {
  background-color: #086851;
  color: #fff;
}

.anotherName {
  font-size: 12px;
  display: block;
}

#chatForm {
  display: block;
  width: 100%;
  height: 50px;
  border-top: 2px solid #f0f0f0;
}

#message {
  width: 85%;
  height: calc(100% - 1px);
  border: none;
  padding-bottom: 0;
}

#message:focus {
  outline: none;
}

#chatForm > input[type="submit"] {
  outline: none;
  border: none;
  background: none;
  color: #0084ff;
  font-size: 17px;
}
</style>
