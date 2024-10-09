import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChampionshipService } from 'src/app/services/championship.service';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-set-date-match',
  templateUrl: './set-date-match.component.html',
  styleUrls: ['./set-date-match.component.css']
})
export class SetDateMatchComponent implements OnInit {

  data: any;
  onAdd = new EventEmitter();

  constructor(private fb: FormBuilder,
    private championshipService: ChampionshipService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) data,
    public datepipe: DatePipe) {
      this.data = data;
  }

  ngOnInit() {
    this.championshipService.getMatchDatesReq(this.data.idChampionship, this.data.team1.teamname, this.data.team2.teamname, this.onAdd);
  }

  formModel = this.fb.group({
    MatchDate: [null]
  });

  addDate(): void {
    if (this.formModel.get('MatchDate').value !== null) {
      const body = {
        idChampionship: this.data.idChampionship,
        team1: this.data.team1.teamname,
        team2: this.data.team2.teamname,
        date: this.formModel.get('MatchDate').value
      }
      this.formModel.get('MatchDate').setValue(null);
      this.championshipService.addDate(body, this.onAdd);
    }
  }

  deleteDate(date: string): void {
    const query = {
      idChampionship: this.data.idChampionship,
      team1: this.data.team1.teamname,
      team2: this.data.team2.teamname,
      date: date
    }
    this.championshipService.deleteDate(query, this.onAdd);
  }

  noDate(): Boolean {
    if (this.formModel.get('MatchDate').value === null) {
      return true;
    } else {
      return false;
    }
  }

  getMatchDates(): string[] {
    return this.championshipService.getMatchDates();
  }

  noDates(): Boolean {
    if(this.noDate() && this.getMatchDates().length === 0) {
      return true;
    } else {
      return false;
    }
  }

  dateFormat(date: Date): string {
    return this.datepipe.transform(date, 'dd-MM-yyyy HH:mm');
  }

  acceptDate(date: string) {
    const body = {
      idChampionship: this.data.idChampionship,
      team1: this.data.team1.teamname,
      team2: this.data.team2.teamname,
      date: date
    }
    this.championshipService.acceptDate(body, this.onAdd);
  }

  canDeleteDate(): Boolean {
    if(this.data.team1.userLeader === this.userService.getLoggeduser().username ) {
      return true;
    } else {
      return false;
    }
  }

  canAcceptDate(): Boolean {
    if(this.data.team2.userLeader === this.userService.getLoggeduser().username ) {
      return true;
    } else {
      return false;
    }
  }

  maxDates(): Boolean {
    if(this.getMatchDates().length === 5) {
      return true;
    } else {
      return false;
    }
  }

  getError(): string {
    return this.championshipService.getErrorSetResult();
  }

}
