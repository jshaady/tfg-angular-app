import { Component, OnInit } from "@angular/core";
import { TeamService } from "../../../services/team.service";
import { DomSanitizer } from "@angular/platform-browser";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ITeam } from "../../../interfaces/iteam";
import { UserService } from "../../../services/user.service";

@Component({
  selector: "app-teams",
  templateUrl: "./teams.component.html",
  styleUrls: ["./teams.component.css"],
})
export class TeamsComponents implements OnInit {
  formModel: FormGroup | undefined;
  ngbModalOptions: NgbModalOptions = { backdrop: "static", keyboard: false };

  constructor(
    private teamService: TeamService,
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.teamService.searchMyTeams();
    this.formModel = this.fb.group({
      uuid: [null, [Validators.required]],
    });
  }

  getTeams(): ITeam[] | undefined {
    return this.teamService.getTeams();
  }

  getUuidTeamError(): string | null {
    return this.teamService.getUuidTeamError();
  }

  getUuidTeam(): ITeam | null {
    return this.teamService.getUuidTeam();
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

  open(content: any): void {
    this.formModel?.get("uuid")?.setValue("");
    this.teamService.setUuidTeam(null);
    this.teamService.setUuidTeamError(null);
    this.modalService.open(content, this.ngbModalOptions);
  }

  joinTeam(team: ITeam): void {
    this.teamService.joinTeam(team, this.modalService);
  }

  searchTeamByUuid(): void {
    this.teamService.setIsSaving(true);
    this.teamService.searchTeamByUuid(
      this.formModel?.get("uuid")?.value,
      this.modalService
    );
  }

  isSaving(): Boolean {
    return this.teamService.getIsSaving();
  }

  isLeader(userLeader: string): Boolean {
    if (
      this.userService.getLoggeduser() &&
      this.userService.getLoggeduser()?.username === userLeader
    ) {
      return true;
    } else {
      return false;
    }
  }
}
