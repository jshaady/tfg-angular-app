import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/iuser';
import { DomSanitizer } from '@angular/platform-browser';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {

  activeLink: string = "DESCRIPTION";

  constructor(private userService : UserService,
              private route: ActivatedRoute,
              private router: Router,
              private sanitizer: DomSanitizer,
              private chatService: ChatService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userService.searchUser(params['id']);
      this.router.navigate(['/user', params['id']]);
    });
  }

  getProfileAvatar(): any {
    if (this.userService.getLoggeduser()) {
      if (this.userService.getLoggeduser().imageType != null && this.userService.getLoggeduser().imageBase64 != null) {
        let avatarEncode = this.userService.getLoggeduser().imageBase64;
        let avatarType = this.userService.getLoggeduser().imageType;
        if (avatarEncode != undefined) {
          return this.sanitizer.bypassSecurityTrustResourceUrl('data:' + avatarType + ';base64,'
            + avatarEncode);
        }
      }
      else {
        return '../../../../assets/img/default.png';
      }
    }
    else {
      return '../../../../assets/img/default.png';;
    }
  }

  getNavLinksUser(): any {
    return this.userService.getNavLinksUser();
  }

  getUser(): IUser {
    return this.userService.getUser();
  }

  sendMessage(): void {
    if(this.getUser()) {
      this.chatService.searchUsersChat();
      this.chatService.checkUser(this.getUser().username);
      this.router.navigate(['/chat'])
    };
  }

  getNavLinks(): any {
    return this.userService.getNavLinksUser();
  }

  loggedIn(): Boolean {
    return this.userService.loggedIn();
  }

  isSameUser(): Boolean {
    if (this.getUser() && this.userService.getLoggeduser() &&
         this.getUser().username === this.userService.getLoggeduser().username) {
      return true;
    } else {
      return false;
    }
  }

}
