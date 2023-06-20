<template>
  <div>
    {{ this.$getAccessToken() }}
    <br />
    role(수신 때 등급 확인용. 쿠키에서 가져올 데이터) :
    <input type="text" v-model="role" />
    <br />
    <br />
    userId(전송용. 쿠키에서 가져올 데이터) :
    <input type="text" v-model="userId" />
    <br />
    <br />
    roomId(연결용. 채팅방 선택 시 결정) :
    <input type="text" v-model="roomId" />
    <button @click="connect()">연결</button>
    <button @click="disconnect()">연결해제</button>
    <br />
    <br />
    message(전송용. 유저에게 입력 받을 데이터) :
    <input type="text" v-model="message" />
    <button @click="sendToChatRoom()">sendToChatRoom</button>
    <button @click="sendReply()">리플 보내기</button>
    <br />
    <br />
    <ul>
      <li v-for="(chatting, index) in chattingList" :key="index">
        {{ chatting.senderName }}
        :
        {{
          chatting.message ||
          chatting.userMessage + " 에 대한 답장 : " + chatting.replyMessage ||
          "이건 뜨면 안되는데"
        }}
      </li>
    </ul>
  </div>
</template>
<script>
import Stomp from "webstomp-client";
import SockJS from "sockjs-client";

export default {
  name: "StompTest",
  data() {
    return {
      message: null,
      stompClient: null,
      connected: false,
      roomId: null,
      chattingList: [],
      chatRoomList: [],
      userId: null,
      role: null,
    };
  },
  methods: {
    connect() {
      const socket = new SockJS("http://localhost:8080/ws");
      this.stompClient = Stomp.over(socket);
      console.log("connect 완료");

      this.stompClient.connect(
        {},
        (frame) => {
          this.connected = true;
          console.log("frame", frame);
          this.chatRoomList.push(this.roomId);
          this.stompClient.subscribe(`/chat/${this.roomId}`, (tick) => {
            console.log("room's tick", tick);
            const chatting = JSON.parse(tick.body);
            if (
              chatting.senderId == this.userId ||
              chatting.creator ||
              this.role === "AUTHOR"
            ) {
              this.chattingList.push(chatting);
            }
          });

          this.stompClient.subscribe(`/error/${this.roomId}`, (error) => {
            console.log("error", error);
          });

          this.stompClient.subscribe(`/reply/${this.roomId}`, (tick) => {
            console.log("reply tick", tick);
            this.chattingList.push(JSON.parse(tick.body));
          });
        },
        (error) => {
          console.error(error);
          this.connected = false;
        }
      );
    },
    sendToChatRoom() {
      const obj = {
        senderId: this.userId,
        message: this.message,
      };

      try {
        this.stompClient.send(
          `/app/chat/${this.roomId}`,
          JSON.stringify(obj),
          {}
        );
      } catch (error) {
        console.log(error);
      }
    },
    sendReply() {
      const obj = {
        senderId: this.userId,
        replyMessage: this.message,
        chatId: 12,
        userMessage: "유저메세지",
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
      this.chatRoomList.forEach((chatRoom) => {
        this.stompClient.unsubscribe(chatRoom);
      });
      this.stompClient.disconnect(() => {
        this.connected = false;
      });
    },
  },
};
</script>
