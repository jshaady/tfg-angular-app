import { Component, OnInit, ContentChild } from '@angular/core';
import { ChampionshipService } from 'src/app/services/championship.service';
import { MatDialog } from '@angular/material/dialog';
import { SetResultMatchComponent } from '../../modals/set-result-match/set-result-match.component';
import { UserService } from 'src/app/services/user.service';
import { IMatch } from 'src/app/interfaces/imatch';
import { SetDateMatchComponent } from '../../modals/set-date-match/set-date-match.component';
import { ITeam } from 'src/app/interfaces/iteam';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-matcheleague-s',
  templateUrl: './league-matches.component.html',
  styleUrls: ['./league-matches.component.css']
})
export class LeagueMatchesComponent implements OnInit {

  @ContentChild('paginator', {static: false}) paginator: MatPaginator;

  constructor(private championshipService: ChampionshipService,
    private dialog: MatDialog,
    private userService: UserService) { }

  ngOnInit() {
    this.championshipService.setMatchesEmpty();
    this.getMatchPageOptions().pageIndex = 0;
    if (this.championshipService.getChampionship()) {
      this.championshipService.searchChampionshipMatches();
    }
  }
  
  ngOnDestroy() {
    this.championshipService.setMatchesEmpty();
    this.championshipService.setTeamnameSearched(null);
  }

  setResult(team1: ITeam, team2: ITeam): void {
    const dialogRef = this.dialog.open(SetResultMatchComponent, {
      width: '500px',
      height: '400px',
      data: {
        'idChampionship': this.championshipService.getChampionship().id,
        'team1': team1.teamname,
        'team2': team2.teamname
      }
    });
    dialogRef.componentInstance.onAdd.subscribe(() => {
      this.dialog.closeAll();
    });
  }

  setDate(team1: ITeam, team2: ITeam): void {
    const dialogRefDate = this.dialog.open(SetDateMatchComponent, {
      width: '500px',
      height: '500px',
      data: {
        'idChampionship': this.championshipService.getChampionship().id,
        'team1': team1,
        'team2': team2
      }
    });
    dialogRefDate.componentInstance.onAdd.subscribe(() => {
      this.dialog.closeAll();
    });
  }

  canSetResult(match: IMatch): Boolean {
    if (match.matchDate !== null && match.matchResult1 === null && match.matchResult2 === null &&
      (match.team1.userLeader === this.userService.getLoggeduser().username ||
        match.team2.userLeader === this.userService.getLoggeduser().username)) {
      return true;
    } else {
      return false;
    }
  }

  canViewDates(match: IMatch): Boolean {
    if (match.matchDate === null && match.matchResult1 === null && match.matchResult2 === null && (match.team1.userLeader === this.userService.getLoggeduser().username ||
      match.team2.userLeader === this.userService.getLoggeduser().username)) {
      return true;
    } else {
      return false;
    }
  }

  getChampionship(): any {
    return this.championshipService.getChampionship();
  }

  getMatchesDataSource(): any {
    return this.championshipService.getMatchesDataSource();
  }

  getMatchPageOptions(): any {
    return this.championshipService.getMatchesPageOptions();
  }

  isTableVisible(): Boolean {
    return this.championshipService.getMatchesTableVisible();
  }

  changePage(event: any): void {
    this.championshipService.setMatchesPageOptions(event);
    this.championshipService.searchChampionshipMatches();
  }

  getMatchesDisplayedColumns() {
    return this.championshipService.getMatchesDisplayedColumns();
  }

  loggedIn(): Boolean {
    return this.userService.loggedIn();
  }

  changeTeamname(teamname: string): void {
    this.getMatchPageOptions().pageIndex = 0;
    this.championshipService.setTeamnameSearched(teamname);
    this.championshipService.searchChampionshipMatches();
  }

  closeLogin(): void {
    this.dialog.closeAll();
  }
}
