import { Component, OnInit } from "@angular/core";
import { MeetService } from "../../../services/meet.service";
import {
  FormBuilder,
  Validators,
  FormControl,
  FormGroupDirective,
  NgForm,
  FormGroup,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

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
  selector: "app-meet-create",
  templateUrl: "./meet-create.component.html",
  styleUrls: ["./meet-create.component.css"],
})
export class MeetCreateComponent implements OnInit {
  formModel: FormGroup | undefined;
  matcher = new MyErrorStateMatcher();
  getTypesDefault: String[] = [];

  constructor(private meetService: MeetService, private fb: FormBuilder) {}

  ngOnInit() {
    this.meetService.setCreateErrorsEmpty();
    this.formModel = this.fb.group({
      Name: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(60),
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
      Location: [
        null,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(255),
        ],
      ],
      Sport: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(25),
        ],
      ],
      Date: [null, [Validators.required]],
    });
  }

  onSubmit(): void {
    this.meetService.setIsSaving(true);
    const body = {
      name: this.formModel?.value.Name
        ? this.formModel.value.Name.trim()
        : null,
      description: this.formModel?.value.Description
        ? this.formModel.value.Description.trim()
        : null,
      sport: this.formModel?.value.Sport
        ? this.formModel.value.Sport.trim()
        : null,
      location: this.formModel?.value.Location
        ? this.formModel.value.Location.trim()
        : null,
      date: this.formModel?.value.Date,
    };
    this.meetService.createMeet(body, this.formModel);
  }

  isSaving(): Boolean {
    return this.meetService.getIsSaving();
  }

  focusOut(location: string): void {
    this.formModel!.get("Location")!.setValue(location);
  }

  getErrors(): any {
    return this.meetService.getCreateErrors();
  }
}
