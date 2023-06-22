<template>
  <div id="contentWrap">
    <div id="contentCover">
      <div id="chatWrap">
        <div id="chatHeader">
          <div class="row">
            <div class="col-2">
              <div @click="toChatRoom()">🔙</div>
            </div>
            <header class="col-10">
              <div class="row">
                <div class="col-10">{{ this.chatRoomName }}</div>
              </div>
            </header>
          </div>
        </div>
        <br />
        <div class="button-container">
          <button
            v-if="loadChatLimiter < 31"
            class="w-btn-outline w-btn-indigo-outline"
            type="button"
            @click="loadChat()"
          >
            더보기
          </button>
          <button
            v-if="loadChatLimiter >= 31"
            class="w-btn-outline w-btn-indigo-outline"
            type="button"
          >
            최근 30일까지의 채팅만 볼 수 있습니다.
          </button>
        </div>
        <div
          id="chatLog"
          v-for="(chatting, index) in chattingList.slice().reverse()"
          :key="index"
          ref="chatLog"
        >
          <!-- 일반 채팅(답장이 아닌 채팅) -->
          <div v-if="chatting.replyId == null">
            <!-- 보낸 사람 = 나 -->
            <div v-if="chatting.senderId == users.userId">
              <div class="myMsg">
                <div class="msg">{{ chatting.message }}</div>
              </div>
            </div>
            <!-- 다른 사용자가 보낸 메세지 -->
            <div
              v-if="
                chatting.senderId != users.userId ||
                (chatting.creator && chatting.senderId != users.userId)
              "
            >
              <div class="anotherMsg">
                <span class="anotherName">{{ chatting.senderName }}</span>
                <div :class="{ filtered: isFiltered(chatting.filterResult) }">
                  <div class="msg" @click="cancleFilter(chatting)">
                    {{ chatting.message }}
                  </div>
                  <!-- 위 div에 마우스 호버되면 아래 span이 보이도록 구상중 -->
                  <!-- @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@작가만 답장 버튼 보이도록 구성해야함 -->
                  <span
                    @click="selectMsg(chatting)"
                    v-if="chatOwnerNickname == users.nickname"
                    >답장</span
                  >
                </div>
              </div>
            </div>
          </div>
          <!-- 답장 -->
          <div class="chat reply" v-if="chatting.replyId != null">
            답장 : {{ chatting.replyMessage }}
          </div>
        </div>
        <div>
          <div v-if="isReply">
            <span>{{ replyChat.message }}</span>
            <span @click="cancleReply()">X</span>
          </div>
          <form id="chatForm">
            <div>
              <b-input
                size="lg"
                type="text"
                id="message"
                placeholder="메시지를 입력하세요"
                v-model="message"
              />
              <b-button class="send" @click="sendMsg()" size="lg">
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
      chattingList: [],
      nickname: null,
      replyState: false,
      date: null,
      loadChatLimiter: 0,
      chatRoomName: null,
      isReply: false,
      replyChat: {},
      chatOwnerNickname: null,
    };
  },
  async created() {
    try {
      // 초기 설정
      this.date = new Date();
      const accessToken = this.$getAccessToken();
      const users = this.$getTokenInfo(accessToken);
      this.users = users;
      const roomId = this.$route.params.roomId;
      this.roomId = roomId;
      const option = {
        headers: {
          Authorization: "Bearer " + this.$getAccessToken(),
        },
      };
      const user = await axios.get(
        `${process.env.VUE_APP_API_URL}/user/me`,
        option
      );
      this.nickname = user.data.nickname;
      this.chatOwnerNickname = this.$store.getters.getChatOwnerNickname;
      this.$store.commit("setChatOwnerNickname", null);

      // 웹소켓 연결
      this.connect();

      // 최근 일주일 채팅 불러오기
      this.loadChatForAWeek();

      setTimeout(() => {
        window.scrollTo(0, document.getElementById("contentWrap").scrollHeight);
      }, 100);

      // 화면 상단 표시용
      this.chatRoomName = this.$store.getters.getChatRoomName;
      this.$store.commit("setChatRoomName", null);
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    async cancleFilter(chat) {
      chat.filterResult = "ok";
    },
    async toChatRoom() {
      location.href = "/chatRoom";
    },
    async loadChatForAWeek() {
      const option = {
        headers: {
          Authorization: "Bearer " + this.$getAccessToken(),
        },
      };

      // chatting 요청
      const chatRes = await axios.get(
        `${process.env.VUE_APP_API_URL}/chat/${this.roomId}`,
        option
      );
      const tempChatList = chatRes.data.filter((chat) => {
        if (
          chat.senderId == this.users.userId || // 내가 보낸 채팅은 보이게
          this.users.role == "AUTHOR" || // 내가 작가면 전부 보이게
          chat.creator // 작가의 채팅도 보이게
        ) {
          return chat;
        }
      });

      // reply 요청
      const replyRes = await axios.get(
        `${process.env.VUE_APP_API_URL}/chat/reply/${this.roomId}`,
        option
      );

      // 데이터 세팅
      this.chattingList = this.chattingList.concat(tempChatList);
      this.chattingList = this.chattingList.concat(replyRes.data);

      // createdDate 배열을 Date 객체로 변환 및 조정
      this.chattingList.forEach((chat) => {
        // month 값을 조정하고 초 이하 단위는 무시
        chat.createdDate = new Date(
          chat.createdDate[0],
          chat.createdDate[1] - 1,
          chat.createdDate[2],
          chat.createdDate[3],
          chat.createdDate[4],
          chat.createdDate[5]
        );
      });

      // 정렬
      this.chattingList.sort((a, b) => {
        return b.createdDate - a.createdDate;
      });

      // 날짜 설정
      this.date.setDate(this.date.getDate() - 8);
      this.loadChatLimiter = this.loadChatLimiter + 7;
    },
    async loadChat() {
      try {
        while (this.loadChatLimiter < 31) {
          // 30일치 다 조회되었을 때 alert창이라던가 버튼 숨기기 같은게 있으면 좋을 듯 합니다
          const beforeChatLength = this.chattingList.length;
          const option = {
            headers: {
              Authorization: "Bearer " + this.$getAccessToken(),
            },
          };

          // chatting 요청
          let month =
            this.date.getMonth() + 1 < 10
              ? "0" + (this.date.getMonth() + 1)
              : this.date.getMonth() + 1;
          let day =
            this.date.getDate() < 10
              ? "0" + this.date.getDate()
              : this.date.getDate();
          const chatRes = await axios.get(
            `${process.env.VUE_APP_API_URL}/chat/${
              this.roomId
            }?date=${this.date.getFullYear()}-${month}-${day}`,
            option
          );
          const tempChatList = chatRes.data.filter((chat) => {
            if (
              chat.senderId == this.users.userId || // 내가 보낸 채팅은 보이게
              this.users.role == "AUTHOR" || // 내가 작가면 전부 보이게
              chat.creator // 작가의 채팅도 보이게
            ) {
              return chat;
            }
          });

          // reply 요청
          const replyRes = await axios.get(
            `${process.env.VUE_APP_API_URL}/chat/reply/${
              this.roomId
            }?date=${this.date.getFullYear()}-${month}-${day}`,
            option
          );

          tempChatList.forEach((chat) => {
            // month 값을 조정하고 초 이하 단위는 무시
            chat.createdDate = new Date(
              chat.createdDate[0],
              chat.createdDate[1] - 1,
              chat.createdDate[2],
              chat.createdDate[3],
              chat.createdDate[4],
              chat.createdDate[5]
            );
          });

          replyRes.data.forEach((chat) => {
            // month 값을 조정하고 초 이하 단위는 무시
            chat.createdDate = new Date(
              chat.createdDate[0],
              chat.createdDate[1] - 1,
              chat.createdDate[2],
              chat.createdDate[3],
              chat.createdDate[4],
              chat.createdDate[5]
            );
          });

          // 데이터 세팅
          this.chattingList = this.chattingList.concat(tempChatList);
          this.chattingList = this.chattingList.concat(replyRes.data);

          // 정렬
          this.chattingList.sort((a, b) => {
            return b.createdDate - a.createdDate;
          });

          // 날짜 설정
          this.date.setDate(this.date.getDate() - 1);
          this.loadChatLimiter++;

          // 채팅 목록의 길이가 변화하지 않았다면(= 해당 날짜의 채팅이 없다면) while 반복
          if (beforeChatLength == this.chattingList.length) {
            await new Promise((resolve) => setTimeout(resolve, 100)); // 0.1초 동안 대기
            continue;
          } else {
            // 해당 날짜의 채팅이 조회되었으면 탈출
            break;
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    connect() {
      const socket = new SockJS(process.env.VUE_APP_SOCKET_URL + "/ws");
      this.stompClient = Stomp.over(socket);

      this.stompClient.connect(
        {
          Authorization: this.$getAccessToken(),
        },
        () => {
          this.connected = true;
          this.stompClient.subscribe(`/chat/${this.roomId}`, (tick) => {
            const chatting = JSON.parse(tick.body);
            // 채팅방에서 수신된 메시지 처리. 정상 작동
            if (
              chatting.senderId == this.users.userId || // 내가 보낸 채팅은 보이게
              this.users.role == "AUTHOR" || // 내가 작가면 전부 보이게
              chatting.creator // 작가의 채팅도 보이게
            )
              this.chattingList.unshift(chatting);
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
            const reply = JSON.parse(tick.body);
            this.chattingList.unshift(reply);
            setTimeout(() => {
              window.scrollTo(
                0,
                document.getElementById("contentWrap").scrollHeight
              );
            }, 100);
          });
        },
        (error) => {
          console.error(error);
          this.connected = false;
        }
      );
    },
    sendMsg() {
      if (!this.isReply) {
        try {
          const obj = {
            senderId: this.users.userId,
            message: this.message,
          };
          if (this.message != null && this.message != "") {
            this.stompClient.send(
              `/app/chat/${this.roomId}`,
              JSON.stringify(obj),
              {}
            );
          }
          this.message = "";
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          const obj = {
            senderId: this.users.userId,
            replyMessage: this.message,
            chatId: this.replyChat.chatId,
            userMessage: this.replyChat.message,
          };
          this.stompClient.send(
            `/app/reply/${this.roomId}`,
            JSON.stringify(obj),
            {}
          );
          this.message = "";
          this.cancleReply();
        } catch (error) {
          console.log(error);
        }
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
    isFiltered(msg) {
      return msg == "bad" ? true : false;
    },
    selectMsg(chatting) {
      this.isReply = true;
      this.replyChat = chatting;
    },
    cancleReply() {
      this.isReply = false;
      this.replyChat = {};
    },
  },
};
</script>

<style scoped>
html {
  height: 100%;
}
body {
  position: relative;
  width: 100%;
  height: 100%;
}
.button-container {
  display: flex;
  justify-content: center;
}
#contentWrap {
  position: absolute;
  left: 50%;
  width: 30%;
  height: 100%;
  transform: translateX(-50%);
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
  background-color: darkseagreen;
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
  background-color: rgb(135, 176, 135);
  color: #fff;
}

.anotherName {
  font-size: 12px;
  display: block;
}

#chatForm {
  position: relative;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  border-top: 2px solid #f0f0f0;
}

#chatForm > div {
  display: flex;
  align-items: center;
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

.filtered {
  filter: blur(3px);
}
.send {
  margin-left: 10%;
  background-color: darkseagreen;
  border: none;
}
.send:hover {
  background-color: rgb(131, 171, 131);
}
</style>
