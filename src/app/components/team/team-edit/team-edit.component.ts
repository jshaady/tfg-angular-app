import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TeamService } from "../../../services/team.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { ITeam } from "../../../interfaces/iteam";
import { UserService } from "../../../services/user.service";

@Component({
  selector: "app-team-edit",
  templateUrl: "./team-edit.component.html",
  styleUrls: ["./team-edit.component.css"],
})
export class TeamEditComponent implements OnInit {
  formModel: FormGroup | undefined;
  formModelAvatar: FormGroup | undefined;
  fileName: string = "";

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private userService: UserService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.teamService.getTeam() != null) {
      this.fillForm();
    } else {
      this.route.params.subscribe((params) => {
        this.teamService.searchTeam(params["id"], this.formModel);
      });
    }
    this.formModel = this.fb.group({
      Description: [
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(512),
        ],
      ],
      Location: [
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(255),
        ],
      ],
    });

    this.formModelAvatar = this.fb.group({
      Avatar: [null, Validators.required],
    });
  }

  fillForm(): void {
    this.formModel?.patchValue({
      Description: this.teamService.getTeam()?.description,
      Location: this.teamService.getTeam()?.location,
    });
  }

  onSubmit(): void {
    this.teamService.setIsSaving(true);
    const body = {
      teamname: this.getTeam()?.teamname,
      description: this.formModel?.value.Description,
      location: this.formModel?.value.Location,
    };
    this.teamService.editTeam(body);
  }

  onFileSelected(event: any): void {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      this.fileName = file.name;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.formModelAvatar?.get("Avatar")?.setValue({
          teamname: this.teamService.getTeam()?.teamname,
          filename: file.name,
          filetype: file.type,
          value: reader.result?.toString().split(",")[1],
        });
      };
    }
  }

  uploadFile() {
    if (this.formModelAvatar?.get("Avatar") != null) {
      this.teamService.setIsSaving(true);
      this.teamService.updateTeamAvatar(
        this.formModelAvatar?.get("Avatar")?.value
      );
      this.formModelAvatar?.get("Avatar")?.setValue(null);
      this.fileName = "";
    }
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

  getTeam(): ITeam | undefined {
    return this.teamService.getTeam();
  }

  getTeamCreateDatei18n(): any {
    return { value: this.teamService.getTeam()?.createDate };
  }

  isSaving(): Boolean {
    return this.teamService.getIsSaving();
  }

  getErrors(): any {
    return this.teamService.getCreateErrors();
  }

  focusOut(location: string): void {
    this.formModel?.get("Location")?.setValue(location);
  }

  checkTeamCreator(): Boolean {
    if (
      this.teamService.getTeam()?.userLeader ===
      this.userService.getLoggeduser()?.username
    ) {
      return true;
    } else {
      this.teamService.makeSnackBar(
        "You not the team leader, cant edit the info",
        "error"
      );
      this.router.navigate(["team", this.teamService.getTeam()?.teamname]);
      return false;
    }
  }
}
