import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { TeamService } from 'src/app/services/team.service';

// export class customValidationService {
//   static checkMaxNumberLength(): ValidatorFn {
//     return (c: AbstractControl): { [key: string]: boolean } | null => {
//       if (c.value && (isNaN(c.value) || c.value > 25)) {
//         return { 'maxNumberSize': true };
//       }
//       return null;
//     };
//   }
//   static checkMinNumberLength(): ValidatorFn {
//     return (c: AbstractControl): { [key: string]: boolean } | null => {
//       if (isNaN(c.value) || c.value < 1) {
//         return { 'minNumberSize': true };
//       }
//       return null;
//     };
//   }
// }

@Component({
  selector: 'app-team-create',
  templateUrl: './team-create.component.html',
  styleUrls: ['./team-create.component.css']
})
export class TeamCreateComponent implements OnInit {

  maxNumberPlayersMaxSize: number = 0;

  isPrivate: any = [
    { id: 0, label: 'public' },
    { id: 1, label: 'private' }
  ];

  formModel = this.fb.group({
    TeamName: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
    Location: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
    Description: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(512)]],
    MaxNumberOfPlayers: [null, [Validators.required, Validators.min(1), Validators.max(25)]],
    isPrivate: [null, [Validators.required]]
  });

  constructor(private fb: FormBuilder,
              private teamService: TeamService) { }

  ngOnInit() {
    this.teamService.setCreateErrorsEmpty();
   }

  onSubmit() {
    this.teamService.setIsSaving(true);
    var body = {
      teamname: this.formModel.value.TeamName ? this.formModel.value.TeamName.trim() : null,
      description: this.formModel.value.Description,
      location: this.formModel.value.Location,
      maxNumberPlayers: this.formModel.value.MaxNumberOfPlayers,
      isPrivate: this.formModel.value.isPrivate,
      date: new Date()
    }
    this.teamService.createTeam(body);
  }

  focusOut(location: string): void {
    this.formModel.get('Location').setValue(location);
  }

  isSaving(): Boolean {
    return this.teamService.getIsSaving();
  }

  getErrors() {
    return this.teamService.getCreateErrors()
  }

}
