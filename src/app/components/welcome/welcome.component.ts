import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { SignUpComponent } from '../modals/sign-up/sign-up.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(private dialog: MatDialog,
              private userService: UserService,
              private router: Router) { }

  ngOnInit() { 
    if (this.userService.loggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  closeLogin(): void {
    this.dialog.closeAll();
  }

  loggedIn(): Boolean {
    return this.userService.loggedIn();
  }

  openSignUp(): void {
    console.log('signUp')
    const dialogRef = this.dialog.open(SignUpComponent, {
      width: '400px'
    });
    dialogRef.componentInstance.onAdd.subscribe(() => {
      this.dialog.closeAll();
    });
    dialogRef.afterClosed().subscribe(() => {
      this.userService.resetErrorSignUp();
    });
  }

  
}
