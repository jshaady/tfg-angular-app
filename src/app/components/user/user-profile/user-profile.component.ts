import { Component, OnInit } from "@angular/core";
import { UserService } from "../../../services/user.service";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { IUser } from "../../../interfaces/iuser";
import { format } from "util";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  image: any = null;
  fileName: string = "";

  formModel: FormGroup | undefined;

  formModelAvatar: FormGroup | undefined;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.userService.setUserUpdateEmpty();
    if (this.userService.getLoggeduser() == null) {
      this.userService.searchProfile(this.formModel);
      this.getProfileAvatar();
    } else {
      this.fillForm();
    }
    this.formModel = this.fb.group({
      Name: [null, [Validators.minLength(1), Validators.maxLength(20)]],
      Surname: [null, [Validators.minLength(1), Validators.maxLength(20)]],
      Email: [null],
      Birthdate: [null],
      Country: [null, [Validators.minLength(1), Validators.maxLength(20)]],
      Location: [null, [Validators.minLength(1), Validators.maxLength(255)]],
    });
    this.formModelAvatar = this.fb.group({
      Avatar: [null, Validators.required],
    });
  }

  getUser(): IUser | null {
    return this.userService.getLoggeduser();
  }

  focusOut(location: string): void {
    this.formModel?.get("Location")?.setValue(location);
  }

  onFileSelected(event: any): void {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      this.fileName = file.name;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.formModelAvatar?.get("Avatar")?.setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result?.toString().split(",")[1],
        });
      };
    }
  }

  fillForm(): void {
    if (this.formModel !== null && this.formModel !== undefined) {
      this.formModel.patchValue({
        Name: this.userService.getLoggeduser()?.name,
        Surname: this.userService.getLoggeduser()?.surname,
        Email: this.userService.getLoggeduser()?.email,
        Birthdate: this.userService.getLoggeduser()?.birthdate,
        Country: this.userService.getLoggeduser()?.country,
        Location: this.userService.getLoggeduser()?.location,
      });
    }
  }

  uploadFile(): void {
    this.userService.setIsSaving(true);
    if (this.formModelAvatar?.get("Avatar") != null) {
      this.userService.updateProfileImage(
        this.formModelAvatar?.get("Avatar")?.value
      );
      this.formModelAvatar.get("Avatar")?.setValue(null);
      this.fileName = "";
    }
  }

  onSubmit(): void {
    this.userService.setIsSaving(true);
    if (this.formModel !== undefined) {
      let body = {
        name: this.formModel.value.Name
          ? this.formModel.value.Name.trim()
          : null,
        surname: this.formModel.value.Surname
          ? this.formModel.value.Surname.trim()
          : null,
        birthdate: this.formModel.value.Birthdate,
        country: this.formModel.value.Country
          ? this.formModel.value.Country.trim()
          : null,
        location: this.formModel.value.Location
          ? this.formModel.value.Location.trim()
          : null,
      };
      this.userService.updateProfile(body);
    }
  }

  getProfileAvatar(): any {
    if (this.userService.getLoggeduser()) {
      if (
        this.userService.getLoggeduser()?.imageType != null &&
        this.userService.getLoggeduser()?.imageBase64 != null
      ) {
        let avatarEncode = this.userService.getLoggeduser()?.imageBase64;
        let avatarType = this.userService.getLoggeduser()?.imageType;
        if (avatarEncode != undefined) {
          return this.sanitizer.bypassSecurityTrustResourceUrl(
            "data:" + avatarType + ";base64," + avatarEncode
          );
        }
      } else {
        return "../../../../assets/img/default.png";
      }
    } else {
      return "../../../../assets/img/default.png";
    }
  }

  getBirthdate(): string {
    let time = new Date(this.userService.getLoggeduser()!.birthdate);
    let month = format(time.getMonth() + 1);
    if (time.getMonth() + 1 < 10) {
      month = "0" + (time.getMonth() + 1);
    }
    let day = format(time.getDate());
    if (time.getDate() < 10) {
      day = "0" + time.getDate();
    }
    let year = format(time.getFullYear());
    let b = year + "-" + month + "-" + day;
    return b;
  }

  isSaving(): Boolean {
    return this.userService.getIsSaving();
  }

  getErrors(): any {
    return this.userService.getUserUpdateErrors();
  }
}
