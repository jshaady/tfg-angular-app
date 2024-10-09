import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SnackBarComponent } from '../../components/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthAdminGuard implements CanActivate {

  constructor(private userService: UserService,
              private router: Router,
              private snackBar: MatSnackBar) { }

   canActivate(): boolean {
    if(localStorage.getItem('token') != null) {
      if (this.userService.getLoggeduser().rol === 1) {
        return true;
      } else {
        this.router.navigate(['/welcome']);
        this.snackBar.openFromComponent(SnackBarComponent, {
          data: { messageContent: 'No tienes permisos de acceso', typeInfo: 'error' },
          panelClass: ['snack-bar'],
          verticalPosition: 'top'
        });
        return false;
      }
    }
  }
}
