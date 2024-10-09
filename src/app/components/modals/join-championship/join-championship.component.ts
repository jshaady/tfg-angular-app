import { Component, OnInit, EventEmitter } from '@angular/core';
import { ChampionshipService } from 'src/app/services/championship.service';
import { IChampionship } from 'src/app/interfaces/ichampionship';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-join-championship',
  templateUrl: './join-championship.component.html',
  styleUrls: ['./join-championship.component.css']
})
export class JoinChampionshipComponent implements OnInit {

  private championship: IChampionship;

  constructor(private championshipService: ChampionshipService,
              private teamsService: TeamService) { }

  ngOnInit() {
    this.championshipService.setErrorsJoinChampionship(null);
    this.championship = this.championshipService.getChampionship();
    this.teamsService.searchMyTeamsCreated();
  }

  getChampionship() {
    if (this.championship) return this.championship;
    else return null;
  }

  getMyTeamsCreated() {
    if (this.teamsService.getMyTeamsCreated()) return this.teamsService.getMyTeamsCreated();
    else return null;
  }

  onAdd = new EventEmitter();

  onSubmit(teamname) {
    let body = {
      idChampionship: this.championship.id,
      teamname: teamname
    }
    this.championshipService.joinChampionship(body, this.onAdd);
  }

  getErrors() {
    console.log(this.championshipService.getErrorsJoinChampionship());
    return this.championshipService.getErrorsJoinChampionship();
  }

  

}
