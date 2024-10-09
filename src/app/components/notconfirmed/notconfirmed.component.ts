import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notconfirmed',
  templateUrl: './notconfirmed.component.html',
  styleUrls: ['./notconfirmed.component.css']
})
export class NotconfirmedComponent implements OnInit {

  constructor(private userService: UserService,
              private router: Router) { }

  ngOnInit() {
    if (this.getNotConfirmedEmail() === null) {
      this.router.navigate(['']);
    }
    if (this.userService.loggedIn()) {
      this.router.navigate(['news']);
    }
   }

  getNotConfirmedEmail(): string {
    return this.userService.getEmailNotConfirmed();
  }

  resendEmail(): void {
    this.userService.resendEmail();
  }
}
