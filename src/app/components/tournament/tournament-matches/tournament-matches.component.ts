import { Component, OnInit } from '@angular/core';
import { ChampionshipService } from 'src/app/services/championship.service';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { SetResultMatchComponent } from '../../modals/set-result-match/set-result-match.component';
import { IMatch } from 'src/app/interfaces/imatch';
import { ITeam } from 'src/app/interfaces/iteam';
import { SetDateMatchComponent } from '../../modals/set-date-match/set-date-match.component';
import { IChampionship } from 'src/app/interfaces/ichampionship';

@Component({
  selector: 'app-tournament-matches',
  templateUrl: './tournament-matches.component.html',
  styleUrls: ['./tournament-matches.component.css']
})
export class TournamentMatchesComponent implements OnInit {
  
  activeLink: string = "MATCHES";

  constructor(private championshipService: ChampionshipService,
              private userService: UserService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.championshipService.setMatchesEmpty();
    if (this.championshipService.getChampionship()) {
      this.championshipService.searchChampionshipMatches();
    }
    this.getMatchPageOptions().pageIndex = 0;
  }

  ngOnDestroy() {
    this.championshipService.setMatchesEmpty();
    this.championshipService.setTeamnameSearched(null);
  }

  setResult(team1: ITeam, team2: ITeam): void{
    const dialogRef = this.dialog.open(SetResultMatchComponent, {
      width: '500px',
      height: '300px',
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

  isTableVisible(): Boolean {
    return this.championshipService.getMatchesTableVisible();
  }

  getMatchesTournamentDisplayedColumns(): string[] {
    return this.championshipService.getMatchesTournamentDisplayedColumns();
  }

  changeTeamname(teamname: string): void {
    this.getMatchPageOptions().pageIndex = 0;
    this.championshipService.setTeamnameSearched(teamname);
    this.championshipService.searchChampionshipMatches();
  }

  getMatchPageOptions(): any {
    return this.championshipService.getMatchesPageOptions();
  }

  changePage(event: any): void {
    this.championshipService.setMatchesPageOptions(event);
    this.championshipService.searchChampionshipMatches();
  }

  getChampionship(): IChampionship {
    return this.championshipService.getChampionship();
  }

  loggedIn(): Boolean {
    return this.userService.loggedIn();
  }

  getMatchesDataSource(): any {
    return this.championshipService.getMatchesDataSource();
  }

  closeLogin(): void {
    this.dialog.closeAll();
  }

}
