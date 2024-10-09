import { Component, OnInit, ContentChild } from '@angular/core';
import { TeamService } from 'src/app/services/team.service';
import { IMatch } from 'src/app/interfaces/imatch';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { ITeam } from 'src/app/interfaces/iteam';
import { IStats } from 'src/app/interfaces/istats';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-team-stats',
  templateUrl: './team-stats.component.html',
  styleUrls: ['./team-stats.component.css']
})
export class TeamStatsComponent implements OnInit {

  @ContentChild('paginator', {static: false}) paginator: MatPaginator;

  displayedColumns: string[] = ['date', 'team1', 'result', 'team2', 'phase', 'seeleagueortournament'];

  lastFive = null;

  constructor(private teamService: TeamService, 
              private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.teamService.searchStats();
  }

  getStats(): IStats {
    return this.teamService.getStats();
  }

  getTeam(): ITeam {
    return this.teamService.getTeam();
  }

  getDataSource(): any {
    return this.teamService.getDataSource();
  }

  lastFiveM(): any {
    this.lastFive = [];
    for(let i = 0; i < 5; i++) {
      if(this.teamService.getStats() !== null && this.teamService.getStats().matches && this.teamService.getStats().matches.length-1 >= i) {
        let match = this.teamService.getStats().matches[i];
        if ( match.team1 != "" || match.team2 != "" && match.matchResult1 !== null || match.matchResult1 !== null) {
          this.lastFive.push(this.result(match));
        }
        else {
          i--;
        }
      }
    }
    return this.lastFive;
  }

  result(match: IMatch): string {
    let team = this.teamService.getTeam();
    if( match.team1 === team.teamname && match.matchResult1 > match.matchResult2 ) {
      return 'W';
    } else if (match.team1 === team.teamname && match.matchResult1 < match.matchResult2) {
      return 'L';
    } else if (match.team1 === team.teamname && match.matchResult1 == match.matchResult2) {
      return 'D';
    }
    if( match.team2 === team.teamname && match.matchResult1 > match.matchResult2 ) {
      return 'L';
    } else if (match.team2 === team.teamname && match.matchResult1 < match.matchResult2) {
      return 'W'
    } else if (match.team2 === team.teamname && match.matchResult1 == match.matchResult2) {
      return 'D';
    }
  }

  getLastFiveM(): any {
    if (this.lastFive === null ) {
      this.lastFiveM();
    } else {
      return this.lastFive;
    }
  }

  getUserAvatar(teamAvatar: string, avatarT: string): any {
    if (teamAvatar == null || avatarT == null) return '../../../../assets/img/default.png';
    else {
      let imagePath = this.sanitizer.bypassSecurityTrustResourceUrl('data:' + teamAvatar + ';base64,' 
                   + teamAvatar);
      return imagePath;
    }
  }

  getWinRatio(): any {
    if (!this.getStats().matchesPlayed){
      return 0;
    } else {
      return ((this.getStats().matchesWon / this.getStats().matchesPlayed) * 100).toFixed(2);
    }
  }

  getLeaguesPlayed(): number {
    if (!this.getStats().leaguesPlayed) {
      return 0;
    } else {
      return this.getStats().leaguesPlayed;
    }
  }

  getTournamentsPlayed(): number {
    if (!this.getStats().tournamentsPlayed) {
      return 0;
    } else {
      return this.getStats().tournamentsPlayed;
    }
  }

  applyFilter(event: Event) {
    this.teamService.applyTeamStatsFilter(event);
  }
}
