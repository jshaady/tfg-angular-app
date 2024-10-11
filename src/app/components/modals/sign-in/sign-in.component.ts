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
import { Router } from "@angular/router";
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
  selector: "app-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.css"],
})
export class SignInComponent implements OnInit {
  formModel: FormGroup | undefined;
  matcher = new MyErrorStateMatcher();
  onAdd = new EventEmitter();
  mincharacters: any = { value: 5 };

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.userService.loggedIn()) {
      this.router.navigate([""]);
    }
    this.formModel = this.fb.group({
      UserName: [null, Validators.required],
      Password: [null, [Validators.required, Validators.minLength(5)]],
    });
  }

  onSubmit() {
    this.userService.setIsSaving(true);
    var body = {
      username: this.formModel?.value.UserName
        ? this.formModel.value.UserName.trim()
        : null,
      password: this.formModel?.value.Password
        ? this.formModel.value.Password.trim()
        : null,
    };
    this.userService.signIn(body, this.onAdd);
  }

  getErrors() {
    return this.userService.getUserLoginErrors();
  }

  isSaving(): Boolean {
    return this.userService.getIsSaving();
  }
}
