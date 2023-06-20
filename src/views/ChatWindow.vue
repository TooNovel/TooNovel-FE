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
                <div class="col-10">{{ this.nickname }}의 채팅방</div>
              </div>
            </header>
          </div>
        </div>
        <br />
        <div class="button-container">
          <button
            class="w-btn-outline w-btn-indigo-outline"
            type="button"
            @click="loadChat()"
          >
            더보기
          </button>
        </div>
        <div
          id="chatLog"
          v-for="(chatting, index) in chattingList.slice().reverse()"
          :key="index"
          ref="chatLog"
        >
          <div v-if="chatting.replyId == null">
            <div v-if="chatting.senderId == users.userId">
              <div class="myMsg">
                <div class="msg">{{ chatting.message }}</div>
              </div>
            </div>
            <!-- 다른 사용자가 보낸 메세지 -->
            <div v-else>
              <div class="anotherMsg">
                <span class="anotherName">{{ chatting.senderName }}</span>
                <div
                  v-if="!chatting.creator"
                  :class="{ filtered: isFiltered(chatting.filterResult) }"
                >
                  <div class="msg" @click="cancleFilter(chatting.filterResult)">
                    {{ chatting.message }}
                  </div>
                </div>
                <div v-else>
                  <div class="msg">{{ chatting.message }}</div>
                </div>
              </div>
            </div>
            <!-- filtered 클래스에 블러 스타일 적용해주시면 됩니다 -->
          </div>
          <!-- reply는 일단 스타일 적용 안했습니다 -->
          <div class="chat reply" v-if="chatting.replyId != null">
            답장 : {{ chatting.replyMessage }}
          </div>
        </div>
        <div>
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

      // 웹소켓 연결
      this.connect();

      // 오늘 채팅 불러오기
      this.loadChat();

      setTimeout(() => {
        window.scrollTo(0, document.getElementById("contentWrap").scrollHeight);
      }, 100);
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    async cancleFilter(res) {
      if (res == "bad") {
        const ok = "ok";
        this.isFiltered(ok);
      }
    },
    async toChatRoom() {
      location.href = "/chatRoom";
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
            if (chat.senderId == this.users.userId) return chat;
          });

          // reply 요청
          const replyRes = await axios.get(
            `${process.env.VUE_APP_API_URL}/chat/reply/${
              this.roomId
            }?date=${this.date.getFullYear()}-${month}-${day}`,
            option
          );
          console.log(this.date.getDate());
          console.log(replyRes.data);

          // 데이터 세팅
          this.chattingList = this.chattingList.concat(tempChatList);
          this.chattingList = this.chattingList.concat(replyRes.data);
          this.date.setDate(this.date.getDate() - 1);

          this.loadChatLimiter++;

          // 채팅 목록의 길이가 변화하지 않았다면(= 해당 날짜의 채팅이 없다면) while 반복
          if (beforeChatLength == this.chattingList.length) {
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
            console.log("reply tick", tick);
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
      console.log(msg);
      return msg == "bad" ? true : false;
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
