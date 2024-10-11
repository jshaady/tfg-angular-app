import { Component, OnInit } from "@angular/core";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { UserService } from "../../../services/user.service";
import { ChatService } from "../../../services/chat.service";
import { DomSanitizer } from "@angular/platform-browser";
import { IUser } from "../../../interfaces/iuser";

@Component({
  selector: "app-chat-users",
  templateUrl: "./chat-users.component.html",
  styleUrls: ["./chat-users.component.css"],
})
export class ChatUsersComponent implements OnInit {
  formCheckUserModel: FormGroup | undefined;

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.chatService.reset();
    this.chatService.searchUsersChat();
    this.chatService.setErrorMessage(null);
    this.chatService.connect();
    this.formCheckUserModel = this.fb.group({
      Username: ["", Validators.required],
    });
  }

  ngOnDestroy() {
    this.chatService.disconnect();
  }

  getUsers(): IUser[] {
    return this.chatService.getUsersChat();
  }

  checkUser(): void {
    this.chatService.checkUser(this.formCheckUserModel?.value.Username);
  }

  checkMessage(user: IUser): void {
    this.chatService.getChatMessages(user);
  }

  isSelected(user: IUser): Boolean {
    if (this.chatService.getUserTarget()) {
      if (user.username === this.chatService.getUserTarget()?.username) {
        return true;
      } else return false;
    } else return false;
  }

  getUserAvatar(avatarEncode: string, avatarType: string): any {
    if (
      avatarEncode != null &&
      avatarType != null &&
      avatarEncode != undefined &&
      avatarType != undefined
    ) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        "data:" + avatarType + ";base64," + avatarEncode
      );
    } else {
      return "../../../../assets/img/default.png";
    }
  }

  getErrorMessage(): string | null {
    return this.chatService.getErrorMessage();
  }
}
