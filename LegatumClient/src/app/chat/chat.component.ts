import { Component, OnInit } from '@angular/core';
import { SocketIoModule, SocketIoConfig, Socket } from 'ng-socket-io';

declare var $: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  userWantsToChat: boolean;
  chatInitiated: boolean;
  roomAvailable: boolean;
  haveAdminName: boolean;
  haveUsername: boolean;
  userWaiting: boolean;
  chatEnded: boolean;
  socket = io();
  userQueue: Array<any>;
  adminName: string;
  username: string;
  userID: string;

  constructor() {
    this.userWantsToChat = false;
    this.chatInitiated = false;
    this.roomAvailable = false;
    this.haveAdminName = false;
    this.haveUsername = false;
    this.userWaiting = false;
    this.chatEnded = false;
    this.adminName = '';
    this.username = '';
    this.userID = '';
  }

  // initiate chat

  handleChat(): void {
    if (!this.socket.connected) {
      this.socket.connect();
    }
    console.log('#1 Home Comp: User has clicked the chat button');
    this.chatInitiated = true;
    this.haveUsername = false;
    if (this.userWantsToChat) {
      this.userWantsToChat = false;
    } else {
      this.userWantsToChat = true;
    }
  }

  handleChatRequest(): void {
    this.chatEnded = false;
    console.log('#2 - CHAT CLIENT: user has initiated chat');
    console.log('#2.1.1 - CHAT CLIENT: this.socket.id = ', this.socket.id);
    console.log('#2.1.2 - CHAT CLIENT: this.userID and this.username = ', this.userID, this.username);
    this.userID = this.socket.id;
    this.username = $('#chat-username').val() || 'user';
    this.haveUsername = true;
    console.log('#2.1.3 - CHAT CLIENT: firing off message to server userInitiatedChat. username =  ', this.username);
    this.socket.emit('userInitiateChat', this.username);
  }

  // handle message

  handleSendMessage(): void {
    const message = $('#chat-input').val();
    this.socket.emit('chatMessage', message);
    $('#chat-input').val('');
  }

  // handle end chat

  handleEndChat(): void {
    this.chatInitiated = false;
    console.log('##CHAT CLIENT: request to end chat button was clicked.');
    this.roomAvailable = false;
    console.log('##CHAT CLIENT: sending disconnect event to server');
    this.username = '';
    this.userID = '';
    this.chatEnded = true;
    this.socket.emit('ended');
    this.socket.disconnect();
  }

  ngOnInit() {
    // Event listeners

    // initiate chat

    this.socket.on('waitingForAdmin', (username) => {
      console.log('#4.0 - CHAT CLIENT: this inside ngOnInit listeners = ', this);
      console.log('#4.1 - CHAT CLIENT: heard waitingForAdmin from server and username = ', username);
      console.log('#4.2 - CHAT CLIENT: this.userWaiting = ', this.userWaiting);
      this.userWaiting = true;
    });
    
    this.socket.on('startChatWithUserAndAdmin', (username, userID, adminUsername) => {
      console.log('#6 - CHAT CLIENT: heard startChatWithUserAndAdmin from server');
      console.log('#6.1 - CHAT CLIENT: usernamed recvd = ', username);
      console.log('#6.2 - CHAT CLIENT: adminUsername recvd = ', adminUsername);
      this.adminName = adminUsername;
      this.haveAdminName = true;
      
      if (username === this.username && userID === this.userID) {
        console.log('#6.2 - CHAT CLIENT: SUCCESS username matches this.username');
        console.log('#6.2.1 - CHAT CLIENT: this.roomAvailable = ', this.roomAvailable);
        console.log('#6.2.2 - CHAT CLIENT: this = ', this);
        this.roomAvailable = true;
      } else {
        console.log('#6.3 - CHAT CLIENT: ERROR username does not match this.username');
        console.log('#6.4 - CHAT CLIENT: username & this.username = ', username, this.username);
        console.log('#6.5 - CHAT CLIENT: userID & this.userID = ', userID, this.userID);
      }
    });

    // handle chat

    this.socket.on('chatMessages', (msg) => {
      $('#chat-messages').append($('<li>').text(msg));
    });

    // end chat

    this.socket.on('ended', () => {
      this.username = '';
      this.userID = '';
      this.chatEnded = true;
      console.log('##CHAT CLIENT: disconnected heard from server');
      console.log('*********************** username and socketid to be disconnected are ', this.username, this.userID);
      this.socket.disconnect();
      this.handleEndChat();
    });
  }
}

