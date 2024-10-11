import { Component, OnInit, Input } from "@angular/core";
import { TeamService } from "../../../services/team.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-team-description",
  templateUrl: "./team-description.component.html",
  styleUrls: ["./team-description.component.css"],
})
export class TeamDescriptionComponent implements OnInit {
  constructor(
    private teamService: TeamService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {}

  getTeam() {
    if (this.teamService.getTeam()) {
      return this.teamService.getTeam();
    } else return null;
  }

  getUserAvatar(teamAvatar: string, avatarT: string) {
    if (teamAvatar == null || avatarT == null)
      return "../../../../assets/img/default.png";
    else {
      let imagePath = this.sanitizer.bypassSecurityTrustResourceUrl(
        "data:" + teamAvatar + ";base64," + teamAvatar
      );
      return imagePath;
    }
  }

  isLeader(username: string): Boolean {
    if (username === this.getTeam()?.userLeader) {
      return true;
    } else {
      return false;
    }
  }
}
