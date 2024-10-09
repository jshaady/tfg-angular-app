import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TeamService } from 'src/app/services/team.service';
import { UserService } from 'src/app/services/user.service';
import { ITeam } from 'src/app/interfaces/iteam';
import { DomSanitizer } from '@angular/platform-browser';
import { IUser } from 'src/app/interfaces/iuser';

@Component({
  selector: 'app-team-search',
  templateUrl: './team-search.component.html',
  styleUrls: ['./team-search.component.css']
})
export class TeamSearchComponent implements OnInit {

  constructor(private fb: FormBuilder,
              private teamService: TeamService,
              private userService: UserService,
              private sanitizer: DomSanitizer) { }

  formModel = this.fb.group({
    Location: [null],
    Teamname: [null]
  });
  
  ngOnInit() {
    this.fillForm();
    if (this.userService.getLoggeduser()) {
      this.teamService.search(this.userService.getLoggeduser().location, null);
    } else {
      this.teamService.search(null, null);
    }
  }

  fillForm(): void {
    this.formModel.patchValue({
      Location: this.userService.getLoggeduser() ? this.userService.getLoggeduser().location : null
    });
  }
  
  getTeamAvatar(teamAvatar, avatarType): any {
    if (avatarType != null && teamAvatar != null) { 
      if (teamAvatar != undefined) {
        return this.sanitizer.bypassSecurityTrustResourceUrl('data:' + avatarType + ';base64,' 
                + teamAvatar);
      }
    }
    else {
      return '../../../../assets/img/team.png';
    }
  }

  search(): void {
    this.teamService.search(this.formModel.get('Location').value === '' ? null : this.formModel.get('Location').value,
                            this.formModel.get('Teamname').value === '' ? null : this.formModel.get('Teamname').value);
  }

  getTeamsSearch(): ITeam[] {
    return this.teamService.getTeamSearch();
  }

  getUser(): IUser {
    return this.userService.getUser();
  }

  focusOut(location: string): void {
    this.formModel.get('Location').setValue(location);
   }
}
