import { Component, OnInit } from '@angular/core';
import { ChampionshipService } from 'src/app/services/championship.service';
import { IClasificationTeam } from 'src/app/interfaces/iclasification-team';

@Component({
  selector: 'app-league-clasification',
  templateUrl: './league-clasification.component.html',
  styleUrls: ['./league-clasification.component.css']
})
export class LeagueClasificationComponent implements OnInit {

  constructor(private championshipService: ChampionshipService) { }

  ngOnInit() {
    this.championshipService.setClasificationEmpty();
    if (this.championshipService.getChampionship()) {
      this.championshipService.getLeagueClasification();
    }
  }

  getClasification(): IClasificationTeam[] {
    return this.championshipService.getClasification();
  }

  haveTeams(): Boolean {
    if (this.championshipService.getChampionship().teamsInChampionship) return true;
    else return false;
  }

  getClasificationDisplayedColumns(): string[] {
    return this.championshipService.getClasificationDisplayedColumns();
  }
}
