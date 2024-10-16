import { Component, OnInit } from "@angular/core";
import { ChampionshipService } from "../../services/championship.service";

@Component({
  selector: "app-sport-bar",
  templateUrl: "./sport-bar.component.html",
  styleUrls: ["./sport-bar.component.css"],
})
export class SportBarComponent implements OnInit {
  constructor(private championshipService: ChampionshipService) {}

  ngOnInit() {}

  changeSport(sport: string): void {
    this.championshipService.setSearchSport(sport);
    this.championshipService.searchChampionships();
  }
}
