import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ChatService } from 'src/app/services/chat.service';
import { DomSanitizer } from '@angular/platform-browser';
import { IUser } from 'src/app/interfaces/iuser';

@Component({
  selector: 'app-chat-users',
  templateUrl: './chat-users.component.html',
  styleUrls: ['./chat-users.component.css']
})
export class ChatUsersComponent implements OnInit {

  constructor(private userService: UserService,
              private chatService: ChatService,
              private fb:FormBuilder,
              private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.chatService.reset();
    this.chatService.searchUsersChat();
    this.chatService.setErrorMessage(null);
    this.chatService.connect();
  }

  ngOnDestroy() {
    this.chatService.disconnect();
  }
  
  formCheckUserModel = this.fb.group({
    Username: ['', Validators.required]
  })

  getUsers(): IUser[] {
    return this.chatService.getUsersChat();
  }

  checkUser(): void {
    this.chatService.checkUser(this.formCheckUserModel.value.Username);
  }

  checkMessage(user: IUser): void {
    this.chatService.getChatMessages(user);
  }

  isSelected(user: IUser): Boolean {
    if (this.chatService.getUserTarget()) {
      if (user.username === this.chatService.getUserTarget().username){
        return true;
      }
      else return false;
    }
  }

  getUserAvatar(avatarEncode, avatarType): any {
    if (avatarEncode != null && avatarType != null && avatarEncode != undefined && avatarType != undefined){
        return this.sanitizer.bypassSecurityTrustResourceUrl('data:' + avatarType + ';base64,' 
        + avatarEncode);
    }
    else{
      return '../../../../assets/img/default.png';
    }
  }

  getErrorMessage(): string {
    return this.chatService.getErrorMessage();
  }
}
