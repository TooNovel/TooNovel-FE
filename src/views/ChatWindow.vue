<template>
  <div id="contentWrap">
    <div id="contentCover">
      <div id="chatWrap">
        <div id="chatHeader">
          <div class="row">
            <div class="col-2">
              <div @click="ToChatRoom()">🔄️</div>
            </div>
            <div class="col-10">
              <div class="row">
                <div class="col-10">{{ this.nickname }}의 채팅방</div>
                <div class="col-2"></div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!condition">
          <b-button @click="infiniteHandler">더보기</b-button>
        </div>
        <div v-else>
          <div>이전 대화 내용이 없습니다.</div>
        </div>
        <div>
          <div>
            <span class="anotherName">독자</span>
            <div>
              <input type="text" v-model="filterResult" />
            </div>
            <!-- <div v-if="chatting.filterResult == 'bad'"></div> -->
            <div
              v-if="filterResult == 'ok' && users.role == 'AUTHOR'"
              class="msg"
            >
              <span>메세지</span>
            </div>
            <div
              v-else-if="filterResult == 'bad' && users.role == 'AUTHOR'"
              class="msg blurred"
              @click="filterCheck(filterResult)"
            >
              <span>메세지</span>
            </div>
          </div>
        </div>
        <div
          id="chatLog"
          v-for="(chatting, index) in chattingList.slice().reverse()"
          :key="index"
          ref="chatLog"
        >
          <div
            class="anotherMsg"
            @mouseover="doMouseOver(chatting.chatId)"
            @mouseleave="doMouseLeave"
          >
            <div v-if="chatting.senderId != users.userId">
              <span class="anotherName">{{ chatting.senderName }}</span>
              <!-- <span>필터 체크 : {{ chatting.filterResult }}</span> -->
              <div class="msg">
                <span>
                  {{
                    chatting.message ||
                    chatting.userMessage +
                      " 에 대한 답장 : " +
                      chatting.replyMessage ||
                    "이건 뜨면 안되는데"
                  }}
                </span>
              </div>
              <div class="col">
                <div
                  v-if="
                    users.role == 'AUTHOR' &&
                    isButtonVisible &&
                    chatting.chatId == chatIdState
                  "
                >
                  <button @click="ToReply(chatting)">↪️</button>
                </div>
              </div>
            </div>
          </div>
          <div class="myMsg">
            <div class="msg" v-if="chatting.senderId == users.userId">
              <span>
                {{
                  chatting.message ||
                  chatting.userMessage +
                    " 에 대한 답장 : " +
                    chatting.replyMessage ||
                  "이건 뜨면 안되는데"
                }}
              </span>
            </div>
          </div>
        </div>
        <div>
          <form id="chatForm">
            <div v-if="replyState">
              <input
                type="text"
                id="message"
                placeholder="답장 하기"
                v-model="message"
              />
              <b-button type="button" @click="sendReply()">
                <b-icon icon="messenger" aria-hidden="true"></b-icon>
              </b-button>
            </div>
            <div v-else>
              <b-input
                type="text"
                id="message"
                placeholder="메시지를 입력하세요"
                v-model="message"
              />
              <b-button variant="success" @click="sendMsg()">
                <b-icon icon="messenger" aria-hidden="true"></b-icon>
              </b-button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <br />
    <br />
  </div>
</template>

<script>
import Stomp from "webstomp-client";
import SockJS from "sockjs-client";
import axios from "axios";
export default {
  data() {
    return {
      roomId: null,
      users: {},
      message: null,
      stompClient: null,
      connected: false,
      chatRoomList: [],
      chattingList: [],
      replyChatList: [],
      senderName: null,
      nickname: null,
      chatId: null,
      userMessage: null,
      isButtonVisible: false,
      chatIdState: null,
      replyState: false,
      condition: false,
      filterResult: "bad",
    };
  },
  async created() {
    try {
      const accessToken = this.$getAccessToken();
      const users = this.$getTokenInfo(accessToken);
      this.users = users;
      const roomId = this.$route.params.roomId;
      this.roomId = roomId;
      this.connect();
      const option = {
        headers: {
          Authorization: "Bearer " + this.$getAccessToken(),
        },
      };
      const chatList = await axios.get(`/api/v1/chat/${this.roomId}`, option);
      const user = await axios.get(`/api/v1/user/me`, option);
      this.nickname = user.data.nickname;
      this.chattingList = chatList.data;
      setTimeout(() => {
        window.scrollTo(0, document.getElementById("contentWrap").scrollHeight);
      }, 500);
    } catch (err) {
      console.log(err);
    }
  },
  async mounted() {
    // console.log("---mounted---");
    // const contentWrap = document.getElementById("contentWrap");
    // contentWrap.scrollTop = contentWrap.scrollHeight;
  },
  methods: {
    async ToChatRoom() {
      location.href = "/chatRoom";
    },
    async filterCheck(res) {
      console.log(res);
      this.filterResult = "ok";
    },
    async ToReply(res) {
      this.replyState = true;
      this.userMessage = res.message;
    },
    async doMouseOver(res) {
      this.isButtonVisible = true;
      this.chatIdState = res;
    },
    async doMouseLeave() {
      this.isButtonVisible = false;
    },
    async infiniteHandler($state) {
      if (!this.chattingList.length) {
        try {
          const option = {
            headers: {
              Authorization: "Bearer " + this.$getAccessToken(),
            },
          };
          const res = await axios.get(`/api/v1/chat/${this.roomId}`, option);
          this.chattingList = res.data;
          this.chatId = this.chattingList[this.chattingList.length - 1].chatId;
          $state.loaded();
        } catch (err) {
          console.log(err);
        }
        return;
      }
      const chatId = this.chattingList[this.chattingList.length - 1].chatId;
      try {
        const option = {
          headers: {
            Authorization: "Bearer " + this.$getAccessToken(),
          },
        };
        const chatList = await axios.get(
          `/api/v1/chat/${this.roomId}?chatId=${chatId}`,
          option
        );
        console.log("length : " + chatList.data.length);
        if (chatList.data.length) {
          this.chattingList = this.chattingList.concat(chatList.data);
          this.chatId = this.chattingList[this.chattingList.length - 1].chatId;
          $state.loaded;
          const chatId = chatList.data[chatList.data.length - 1].chatId;
          if (this.chatId == chatId) {
            $state.complete;
          }
        } else {
          this.condition = true;
          $state.complete;
        }
      } catch (err) {
        console.log(err);
      }
    },
    connect() {
      const socket = new SockJS("http://localhost:8080/ws");
      this.stompClient = Stomp.over(socket);
      console.log("connect 완료");

      this.stompClient.connect(
        {
          Authorization: this.$getAccessToken(),
        },
        (frame) => {
          this.connected = true;
          console.log("frame", frame);
          this.stompClient.subscribe(`/chat/${this.roomId}`, (tick) => {
            console.log("room's tick", tick);
            const chatting = JSON.parse(tick.body);
            // 채팅방에서 수신된 메시지 처리. 정상 작동
            //if (chatting.senderId === this.userId) {
            this.chattingList.unshift(chatting);
            //}
            setTimeout(() => {
              window.scrollTo(
                0,
                document.getElementById("contentWrap").scrollHeight
              );
            }, 100);
          });

          this.stompClient.subscribe(`/error/${this.roomId}`, (error) => {
            console.log("error", error);
            alert(JSON.parse(error.body).message);
          });

          this.stompClient.subscribe(`/reply/${this.roomId}`, (tick) => {
            console.log("reply tick", tick);
            // this.replyChatList.unshift(JSON.parse(tick.body));
          });
        },
        (error) => {
          console.error(error);
          this.connected = false;
        }
      );
    },
    sendMsg() {
      const obj = {
        senderId: this.users.userId,
        message: this.message,
      };
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
    sendReply() {
      const obj = {
        senderId: this.users.userId,
        replyMessage: this.message,
        chatId: this.chatIdState,
        userMessage: this.userMessage,
      };

      try {
        this.stompClient.send(
          `/app/reply/${this.roomId}`,
          JSON.stringify(obj),
          {}
        );
      } catch (error) {
        console.log(error);
      }
    },
    disconnect() {
      this.chattingList.forEach((chatRoom) => {
        this.stompClient.unsubscribe(chatRoom);
      });
      this.stompClient.disconnect(() => {
        this.connected = false;
      });
    },
  },
  destroyed() {
    // console.log("DESTROY=================================");
    // this.disconnect();
  },
  // components: {
  //   InfiniteLoading,
  // },
};
</script>

<style scoped>
.blurred {
  filter: blur(3px);
}
html {
  height: 100%;
}
body {
  position: relative;
  width: 100%;
  height: 100%;
}

#contentWrap {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  /* width: 40%;
  margin: 0 0 0 -150px; */
  width: 50%;
  height: 100%;
}

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
  background-color: #086851;
}

#chatLog {
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

.msg {
  background-color: wheat;
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
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  border-top: 2px solid #f0f0f0;
}

/* #chatForm {
  position: fixed;
  bottom: 0;
  border-top: 2px solid #f0f0f0;
  background-color: whitesmoke;
  width: 40%;
  display: flex;
  align-items: center;
} */

#chatForm > div {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

#chatForm > input[type="text"] #chatForm > b-input[type="text"] {
  outline: none;
  background: none;
  border: none;
  color: #0084ff;
  font-size: 17px;
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
</style>
