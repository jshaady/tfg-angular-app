import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
  FormGroupDirective,
  NgForm,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { TeamService } from "../../../services/team.service";

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: "app-team-create",
  templateUrl: "./team-create.component.html",
  styleUrls: ["./team-create.component.css"],
})
export class TeamCreateComponent implements OnInit {
  formModel: FormGroup | undefined;
  maxNumberPlayersMaxSize: number = 0;
  matcher = new MyErrorStateMatcher();

  isPrivate: any = [
    { id: 0, label: "public" },
    { id: 1, label: "private" },
  ];

  constructor(private fb: FormBuilder, private teamService: TeamService) {}

  ngOnInit() {
    this.teamService.setCreateErrorsEmpty();
    this.formModel = this.fb.group({
      TeamName: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(20),
        ],
      ],
      Location: [
        null,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(255),
        ],
      ],
      Description: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(512),
        ],
      ],
      MaxNumberOfPlayers: [
        null,
        [Validators.required, Validators.min(1), Validators.max(25)],
      ],
      isPrivate: [null, [Validators.required]],
    });
  }

  onSubmit() {
    this.teamService.setIsSaving(true);
    var body = {
      teamname: this.formModel?.value.TeamName
        ? this.formModel.value.TeamName.trim()
        : null,
      description: this.formModel?.value.Description,
      location: this.formModel?.value.Location,
      maxNumberPlayers: this.formModel?.value.MaxNumberOfPlayers,
      isPrivate: this.formModel?.value.isPrivate,
      date: new Date(),
    };
    this.teamService.createTeam(body);
  }

  focusOut(location: string): void {
    this.formModel?.get("Location")?.setValue(location);
  }

  isSaving(): Boolean {
    return this.teamService.getIsSaving();
  }

  getErrors() {
    return this.teamService.getCreateErrors();
  }
}
