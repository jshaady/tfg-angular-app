import { Component, OnInit } from '@angular/core';
import { TeamService } from 'src/app/services/team.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { ITeam } from 'src/app/interfaces/iteam';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponents implements OnInit {

  ngbModalOptions: NgbModalOptions = { backdrop : 'static', keyboard : false };
  
  formModel = this.fb.group({
    uuid: [null, [Validators.required]]
  });

  constructor(private teamService: TeamService,
              private userService: UserService,
              private sanitizer: DomSanitizer,
              private modalService: NgbModal,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.teamService.searchMyTeams();
  }

  getTeams(): ITeam[] {
    return this.teamService.getTeams();
  }

  getUuidTeamError(): string {
    return this.teamService.getUuidTeamError();
  }

  getUuidTeam(): ITeam {
    return this.teamService.getUuidTeam();
  }

  getTeamAvatar(teamAvatar, avatarType): any {
    if (avatarType != null && teamAvatar != null){
      if (teamAvatar != undefined){
        return this.sanitizer.bypassSecurityTrustResourceUrl('data:' + avatarType + ';base64,' 
                + teamAvatar);
      }
    }
    else{
      return '../../../../assets/img/team.png';
    }
  }

  open(content: any): void {
    this.formModel.get('uuid').setValue('');
    this.teamService.setUuidTeam(null);
    this.teamService.setUuidTeamError(null);
    this.modalService.open(content, this.ngbModalOptions);
  }

  joinTeam(team: ITeam): void {
    this.teamService.joinTeam(team, this.modalService);
  }

  searchTeamByUuid(): void {
    this.teamService.setIsSaving(true);
    this.teamService.searchTeamByUuid(this.formModel.get('uuid').value, this.modalService);
  }

  isSaving(): Boolean {
    return this.teamService.getIsSaving();
  }

  isLeader(userLeader: string): Boolean {
    if (this.userService.getLoggeduser() && 
        this.userService.getLoggeduser().username === userLeader){
          return true;
    }
    else {
      return false;
    }
  }

}