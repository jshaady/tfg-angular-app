import { Component, OnInit } from "@angular/core";
import { UserService } from "../../../services/user.service";
import { IUser } from "../../../interfaces/iuser";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-user-description",
  templateUrl: "./user-description.component.html",
  styleUrls: ["./user-description.component.css"],
})
export class UserDescriptionComponent implements OnInit {
  constructor(
    private userService: UserService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {}

  getUser(): IUser | null {
    return this.userService.getUser();
  }

  getTeamAvatar(teamAvatar: string, avatarT: string): any {
    if (teamAvatar == null || avatarT == null)
      return "../../../../assets/img/default.png";
    else {
      let imagePath = this.sanitizer.bypassSecurityTrustResourceUrl(
        "data:" + teamAvatar + ";base64," + teamAvatar
      );
      return imagePath;
    }
  }

  isLeader(teamLeader: string): Boolean {
    if (this.userService.getLoggeduser()?.username === teamLeader) {
      return true;
    } else {
      return false;
    }
  }
}
