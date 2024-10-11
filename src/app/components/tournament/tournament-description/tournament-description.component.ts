import { Component, OnInit } from "@angular/core";
import { ChampionshipService } from "../../../services/championship.service";

@Component({
  selector: "app-tournament-description",
  templateUrl: "./tournament-description.component.html",
  styleUrls: ["./tournament-description.component.css"],
})
export class TournamentDescriptionComponent implements OnInit {
  constructor(private championshipService: ChampionshipService) {}

  ngOnInit() {}

  getChampionship() {
    return this.championshipService.getChampionship();
  }
}
