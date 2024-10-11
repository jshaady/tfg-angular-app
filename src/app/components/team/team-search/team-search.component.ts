import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { TeamService } from "../../../services/team.service";
import { UserService } from "../../../services/user.service";
import { ITeam } from "../../../interfaces/iteam";
import { DomSanitizer } from "@angular/platform-browser";
import { IUser } from "../../../interfaces/iuser";

@Component({
  selector: "app-team-search",
  templateUrl: "./team-search.component.html",
  styleUrls: ["./team-search.component.css"],
})
export class TeamSearchComponent implements OnInit {
  formModel: FormGroup | undefined;

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private userService: UserService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.fillForm();
    if (this.userService.getLoggeduser()) {
      this.teamService.search(this.userService.getLoggeduser()!.location, null);
    } else {
      this.teamService.search(null, null);
    }
    this.formModel = this.fb.group({
      Location: [null],
      Teamname: [null],
    });
  }

  fillForm(): void {
    this.formModel?.patchValue({
      Location: this.userService.getLoggeduser()
        ? this.userService.getLoggeduser()?.location
        : null,
    });
  }

  getTeamAvatar(teamAvatar: string, avatarType: string): any {
    if (avatarType != null && teamAvatar != null) {
      if (teamAvatar != undefined) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(
          "data:" + avatarType + ";base64," + teamAvatar
        );
      }
    } else {
      return "../../../../assets/img/team.png";
    }
  }

  search(): void {
    this.teamService.search(
      this.formModel?.get("Location")?.value === ""
        ? null
        : this.formModel?.get("Location")?.value,
      this.formModel?.get("Teamname")?.value === ""
        ? null
        : this.formModel?.get("Teamname")?.value
    );
  }

  getTeamsSearch(): ITeam[] | null {
    return this.teamService.getTeamSearch();
  }

  getUser(): IUser | null {
    return this.userService.getUser();
  }

  focusOut(location: string): void {
    this.formModel?.get("Location")?.setValue(location);
  }
}
