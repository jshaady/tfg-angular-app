import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, CanActivate } from "@angular/router";
import { UserService } from "../../services/user.service";
import { SnackBarComponent } from "../../components/snack-bar/snack-bar.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  canActivate(): boolean {
    if (this.userService.loggedIn()) return true;
    else {
      this.router.navigate(["/welcome"]);
      this.snackBar.openFromComponent(SnackBarComponent, {
        data: {
          messageContent: "No tienes permisos de acceso",
          typeInfo: "error",
        },
        panelClass: ["snack-bar"],
        verticalPosition: "top",
      });
      return false;
    }
  }
}
