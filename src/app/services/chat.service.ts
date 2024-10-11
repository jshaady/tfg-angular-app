import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
} from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { IMessage } from "../interfaces/imessage";
import { UserService } from "./user.service";
import { IUser } from "../interfaces/iuser";
import { io } from "socket.io-client";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private readonly BaseURL = "http://localhost:3000/chat";
  private socket: any;

  private messages: IMessage[] | undefined;
  private userTarget: IUser | null = null;

  private usersChat: any = [];
  private chatErrorMessage: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  connect(): void {
    this.socket = io("ws://localhost:3000", {
      path: "/chat",
      query: { auth_token: this.userService.getToken() },
    });
    this.socket.on("error", () => {
      this.userService.makeSnackBar("Chat connection error", "error");
      this.router.navigate(["/home"]);
    });
    this.socket.on("connect", () => {
      this.listenChatMessage();
    });
    this.socket.on("disconnect", () => {});
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  private listenChatMessage(): void {
    new Observable((subscriber) => {
      this.socket.on("updateMessages", (data: any) => {
        subscriber.next(data);
      });
    }).subscribe((data: any) => {
      if (data.userSend === this.userService.getLoggeduser()!.username) {
        this.getChatMessages(this.userTarget!);
        this.searchUsersChat();
      } else if (
        data.userTarget === this.userService.getLoggeduser()!.username
      ) {
        if (
          this.userTarget !== null &&
          data.userSend === this.userTarget.username
        ) {
          this.getChatMessages(this.userTarget);
          this.searchUsersChat();
        } else {
          this.searchUsersChat();
        }
      }
    });
  }

  emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }

  getChatMessages(userSelected: IUser): void {
    const params = new HttpParams().set("userTarget", userSelected.username);
    this.userTarget = userSelected;
    this.http.get<IMessage[]>(this.BaseURL, { params }).subscribe(
      (data: IMessage[]) => {
        this.messages = data;
      },
      (error: any) => {
        this.checkHttpErrors(error);
      }
    );
  }

  checkUser(username: string): void {
    let params = new HttpParams().set("username", username);
    this.http.get("http://localhost:3000/user/checkuser", { params }).subscribe(
      (data: any) => {
        this.chatErrorMessage = null;
        let userInJSON: boolean = false;
        if (this.getUsersChat().length) {
          this.usersChat.forEach((user: IUser) => {
            if (user.username === data.username) {
              userInJSON = true;
            }
          });
          if (!userInJSON) {
            this.setUserChat(data);
          }
          this.getChatMessages(data);
        } else {
          this.setUserChat(data);
        }
      },
      (error: any) => {
        this.chatErrorMessage = error.error.error;
      }
    );
  }

  searchUsersChat(): void {
    this.http.get<IUser[]>("http://localhost:3000/user/userchats").subscribe(
      (data: IUser[]) => {
        this.usersChat = data;
      },
      (error: any) => {
        if (error instanceof HttpErrorResponse) {
          this.checkHttpErrors(error);
        }
      }
    );
  }

  getMessages(): IMessage[] | undefined {
    return this.messages;
  }

  getUserTarget(): IUser {
    return this.userTarget!;
  }

  setUserTarget(userTarget: IUser): void {
    this.userTarget = userTarget;
  }

  inChat(): Boolean {
    if (this.userTarget != null) {
      return true;
    } else {
      return false;
    }
  }

  haveMessage(): Boolean {
    if (this.messages?.length) {
      return true;
    } else {
      return false;
    }
  }

  getUsersChat(): any {
    return this.usersChat;
  }

  setUserChat(user: IUser): void {
    this.usersChat.push(user);
  }

  getErrorMessage(): string | null {
    return this.chatErrorMessage;
  }

  setErrorMessage(error: string | null) {
    this.chatErrorMessage = error;
  }

  reset(): void {
    this.userTarget = null;
    this.messages = [];
  }

  private checkHttpErrors(error: HttpErrorResponse): void {
    switch (error.status) {
      case 401:
        this.userService.logout();
        this.userService.makeSnackBar(error.error.error, "error");
        this.router.navigate([""]);
        break;
      case 409:
        this.userService.makeSnackBar(error.error.error, "error");
        break;
      case 500:
        this.userService.makeSnackBar(error.error.error, "error");
        this.userService.logout();
        this.router.navigate([""]);
        break;
      default:
        this.userService.makeSnackBar(error.error.error, "error");
        this.router.navigate([""]);
    }
  }
}
