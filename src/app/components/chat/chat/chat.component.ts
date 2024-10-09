import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ChatService } from 'src/app/services/chat.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from 'src/app/services/user.service';
import { IMessage } from 'src/app/interfaces/imessage';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  formMessageModel = this.fb.group({
    Message: [null, Validators.required]
  });

  constructor(private chatService: ChatService,
              private userService: UserService,
              private fb: FormBuilder,
              private sanitizer: DomSanitizer) { }

  ngOnInit() { }

  sendMessage() {
    const data = {
      message: this.formMessageModel.value.Message ? this.formMessageModel.value.Message.trim() : null,
      usernameTarget: this.chatService.getUserTarget().username ? this.chatService.getUserTarget().username.trim() : null,
      date: new Date()
    }
    this.chatService.emit('sendMessage', data);
    this.formMessageModel.reset();
  }

  getUserTarget() {
    return this.chatService.getUserTarget();
  }

  getMessages(): IMessage[] {
    return this.chatService.getMessages();
  }

  haveMessage() {
    return this.chatService.haveMessage();
  }

  inChat() {
    return this.chatService.inChat();
  }

  userLogged(message: IMessage): Boolean {
    if (this.userService.getLoggeduser() && this.userService.getLoggeduser().username === message.sendUser) {
      return true;
    }
    else { return false; }
  }

  getUserAvatar() {
    let avatarEncode = this.chatService.getUserTarget().imageBase64;
    let avatarType = this.chatService.getUserTarget().imageType;
    if (avatarEncode != null && avatarType != null
      && avatarEncode != undefined && avatarType != undefined) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:' + avatarType + ';base64,'
        + avatarEncode);
    }
    else {
      return '../../../../assets/img/default.png';
    }
  }
}
