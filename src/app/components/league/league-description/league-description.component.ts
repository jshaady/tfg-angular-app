import { Component, OnInit } from '@angular/core';
import { ChampionshipService } from 'src/app/services/championship.service';

@Component({
  selector: 'app-league-description',
  templateUrl: './league-description.component.html',
  styleUrls: ['./league-description.component.css']
})
export class LeagueDescriptionComponent implements OnInit {

  constructor(private championshipService: ChampionshipService) { }

  ngOnInit() {
  }

  getChampionship() {
    return this.championshipService.getChampionship();
  }
}
