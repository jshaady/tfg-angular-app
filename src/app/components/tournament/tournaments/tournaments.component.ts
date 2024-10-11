import { Component, OnInit } from "@angular/core";
import { ChampionshipService } from "../../../services/championship.service";
import { UserService } from "../../../services/user.service";
import { IPaginate } from "../../../interfaces/ipaginate";
import { FormBuilder, FormGroup } from "@angular/forms";
import { IChampionship } from "../../../interfaces/ichampionship";

@Component({
  selector: "app-tournaments",
  templateUrl: "./tournaments.component.html",
  styleUrls: ["./tournaments.component.css"],
})
export class TournamentsComponent implements OnInit {
  formModel: FormGroup | undefined;

  constructor(
    private championshipService: ChampionshipService,
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.championshipService.setPage(1);
    this.championshipService.setSearchName(null);
    this.championshipService.setSearchLocation(null);
    this.championshipService.setSearchType("Tournament");
    this.championshipService.searchChampionships();
    this.formModel = this.fb.group({
      name: [null],
      location: [null],
    });
  }

  getChampionships(): IChampionship[] | undefined {
    return this.championshipService.getChampionships();
  }

  getSearchSport() {
    return this.championshipService.getSearchSport();
  }

  getSporti18n() {
    return this.getSearchSport();
  }

  isAll() {
    if (this.getSearchSport() === "all") return true;
    else return false;
  }

  getSportImg(sport: string) {
    switch (sport) {
      case "football":
        return "../../../../assets/icons/football_white.png";
      case "basketball":
        return "../../../../assets/icons/basketball_white.png";
      case "tennis":
        return "../../../../assets/icons/tenis1_white.png";
      case "lol":
        return "../../../../assets/icons/lol_white.png";
      case "csgo":
        return "../../../../assets/icons/csgo_white.png";
      default:
        return null;
    }
  }

  isCsgo(sport: string) {
    if (sport == "csgo") return true;
    else return false;
  }

  isAnotherSport(sport: string): Boolean {
    if (
      sport !== "football" &&
      sport !== "basketball" &&
      sport !== "tennis" &&
      sport !== "tennis" &&
      sport !== "lol" &&
      sport !== "csgo"
    ) {
      return true;
    } else {
      return false;
    }
  }

  loggedIn() {
    return this.userService.loggedIn();
  }

  onSearch() {
    this.championshipService.setSearchName(
      this.formModel?.get("name")?.value !== null &&
        this.formModel?.get("name")?.value.trim().length !== 0
        ? this.formModel?.get("name")?.value.trim()
        : null
    );
    this.championshipService.setSearchLocation(
      this.formModel?.get("location")?.value !== null &&
        this.formModel?.get("location")?.value.trim().length !== 0
        ? this.formModel?.get("location")?.value.trim()
        : null
    );
    this.championshipService.searchChampionships();
  }

  getPaginate(): IPaginate | null {
    return this.championshipService.getPaginate();
  }

  focusOut(location: string): void {
    this.formModel?.get("location")?.setValue(location);
  }

  getCurrentPage(): number {
    return this.championshipService.getPage();
  }

  loadPage(page: number) {
    if (page !== this.getCurrentPage()) {
      this.championshipService.setPage(page);
      this.championshipService.searchChampionships();
    }
  }

  maxSizeController(string: string, maxSize: number): string {
    if (string.length > maxSize) {
      return string.substring(0, maxSize - 3) + "...";
    } else {
      return string;
    }
  }
}
