import { Component, OnInit, EventEmitter } from "@angular/core";
import { UserService } from "../../../services/user.service";

import {
  Validators,
  FormBuilder,
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
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.css"],
})
export class SignUpComponent implements OnInit {
  formModel: FormGroup | undefined;
  matcher = new MyErrorStateMatcher();
  errorMessage: string | undefined;
  startDate: Date | undefined;
  minPasswordLength: any = { value: 5 };
  onAdd = new EventEmitter();

  constructor(private userService: UserService, private fb: FormBuilder) {}

  ngOnInit() {
    this.formModel = this.fb.group({
      UserName: [
        null,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ],
      ],
      Password: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(25),
        ],
      ],
      Email: [null, [Validators.required, Validators.email]],
      Birthdate: [null, [Validators.required]],
    });
  }

  onSubmit() {
    this.userService.setIsSaving(true);
    var body = {
      username: this.formModel?.value.UserName
        ? this.formModel.value.UserName.trim()
        : null,
      email: this.formModel?.value.Email
        ? this.formModel.value.Email.trim()
        : null,
      password: this.formModel?.value.Password
        ? this.formModel.value.Password.trim()
        : null,
      birthdate: this.formModel?.value.Birthdate,
      joinDate: new Date(),
    };
    this.userService.signUp(body, this.onAdd, this.formModel);
  }

  getErrors(): any {
    return this.userService.getUserSignUpError();
  }

  isSaving(): Boolean {
    return this.userService.getIsSaving();
  }
}
