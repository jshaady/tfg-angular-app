import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";

import { SignInComponent } from "../modals/sign-in/sign-in.component";
import { SignUpComponent } from "../modals/sign-up/sign-up.component";
import { UserService } from "../../services/user.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    public translate: TranslateService
  ) {
    translate.addLangs(["es", "en"]);
    translate.setDefaultLang("es");
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang?.match(/es|en/) ? browserLang : "es");
  }

  ngOnInit() {
    if (this.userService.loggedIn()) {
      this.userService.searchProfile(null);
    }
  }

  openLogin(): void {
    const dialogRef = this.dialog.open(SignInComponent, {
      width: "400px",
      backdropClass: "login-wrapper-backdrop",
      panelClass: ["login-wrapper-panel"],
    });
    dialogRef.componentInstance.onAdd.subscribe(() => {
      this.dialog.closeAll();
    });
    dialogRef.afterClosed().subscribe(() => {
      this.userService.setUserLoginErrorsNull();
    });
  }

  getLoggedUser() {
    return this.userService.getLoggeduser();
  }

  loggedIn() {
    return this.userService.loggedIn();
  }

  logout() {
    this.userService.logout();
  }

  isAdmin() {
    return this.userService.isAdmin();
  }

  closeLogin() {
    this.dialog.closeAll();
  }

  openSignUp(): void {
    const dialogRef = this.dialog.open(SignUpComponent, {
      width: "400px",
      backdropClass: "login-wrapper-backdrop",
      panelClass: ["login-wrapper-panel"],
    });
    dialogRef.componentInstance.onAdd.subscribe(() => {
      this.dialog.closeAll();
    });
    dialogRef.afterClosed().subscribe(() => {
      this.userService.resetErrorSignUp();
    });
  }
}
