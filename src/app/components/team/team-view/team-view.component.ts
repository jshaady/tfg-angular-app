import { Component, OnInit } from "@angular/core";
import { TeamService } from "../../../services/team.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { ITeam } from "../../../interfaces/iteam";
import { UserService } from "../../../services/user.service";
import { ClipboardService } from "ngx-clipboard";
import { IUser } from "../../../interfaces/iuser";

@Component({
  selector: "app-team-view",
  templateUrl: "./team-view.component.html",
  styleUrls: ["./team-view.component.css"],
})
export class TeamViewComponent implements OnInit {
  activeLink: string = "DESCRIPTION";

  constructor(
    private teamService: TeamService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private userService: UserService,
    private clipboardService: ClipboardService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.teamService.searchTeam(params["id"], null);
      this.router.navigate(["/team", params["id"]]);
    });
  }

  getTeam(): ITeam | undefined {
    return this.teamService.getTeam();
  }

  getTeamDatai18n() {
    return { value: this.teamService.getTeam()?.createDate };
  }

  getNavLinks() {
    return this.teamService.getTeamNavLinks();
  }

  editTeam() {
    this.router.navigate(["/team", this.getTeam()?.teamname, "edit"]);
  }

  getTeamAvatar() {
    if (
      this.teamService.getTeam() &&
      this.teamService.getTeam()?.imageType !== null &&
      this.teamService.getTeam()?.imageBase64 !== null
    ) {
      const avatarEncode = this.teamService.getTeam()?.imageBase64;
      const avatarType = this.teamService.getTeam()?.imageType;
      if (avatarEncode != undefined) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(
          "data:" + avatarType + ";base64," + avatarEncode
        );
      } else return "../../../../assets/img/team.png";
    } else return "../../../../assets/img/team.png";
  }

  joinTeam(): void {
    this.teamService.joinTeam(this.getTeam(), null);
  }

  leftTeam(): void {
    this.teamService.leftTeam();
  }

  isPrivate(): Boolean {
    if (this.teamService.getTeam()?.isPrivate === 1) {
      return true;
    } else {
      return false;
    }
  }

  searchCode(): void {
    this.teamService.searchCode();
    setTimeout(() => {
      if (this.teamService.getUuid() != null) {
        this.clipboardService.copyFromContent(this.teamService.getUuid());
        this.teamService.makeSnackBar(
          "Team code copied to clipboard",
          "success"
        );
      }
    }, 300);
  }

  canJoin(): Boolean {
    if (this.getTeam()?.isPrivate === 0 && this.userService.loggedIn()) {
      let isInTeam = true;
      this.getTeam()?.usersInTeam.forEach((user: IUser) => {
        if (user.username === this.userService.getLoggeduser()?.username) {
          isInTeam = false;
        }
      });
      return isInTeam;
    } else {
      return false;
    }
  }

  alreadyJoined(): Boolean {
    if (
      this.userService.getLoggeduser() &&
      !this.isLeader() &&
      this.getTeam()?.usersInTeam.find(
        (element: any) =>
          element.username === this.userService.getLoggeduser()?.username
      )
    ) {
      return true;
    } else {
      return false;
    }
  }

  notFull(): Boolean {
    if (this.getTeam()!.maxNumberPlayers > this.getTeam()!.usersInTeam.length) {
      return true;
    } else return false;
  }

  isLeader(): Boolean {
    if (
      this.userService.getLoggeduser() &&
      this.userService.getLoggeduser()!.username === this.getTeam()!.userLeader
    ) {
      return true;
    } else {
      return false;
    }
  }
}
