import { Component, OnInit, ContentChild } from "@angular/core";
import { IUser } from "../../../interfaces/iuser";
import { UserService } from "../../../services/user.service";
import { MatPaginator } from "@angular/material/paginator";

@Component({
  selector: "app-user-stats",
  templateUrl: "./user-stats.component.html",
  styleUrls: ["./user-stats.component.css"],
})
export class UserStatsComponent implements OnInit {
  @ContentChild("paginator", { static: false }) paginator:
    | MatPaginator
    | undefined;

  displayedColumns: string[] = [
    "date",
    "team1",
    "result",
    "team2",
    "phase",
    "seeleagueortournament",
  ];

  sports: any = [
    { label: "football", open: false },
    { label: "basketball", open: false },
    { label: "tennis", open: false },
    { label: "csgo", open: false },
    { label: "lol", open: false },
    { label: "other", open: false },
  ];
  sportOpen: any = null;
  lastFive: any = null;

  constructor(private userService: UserService) {}

  ngOnInit() {}

  getUser(): IUser | null {
    return this.userService.getUser();
  }

  seeStats(sport: any): void {
    if (sport !== this.sportOpen) {
      this.sportOpen !== null
        ? (this.sportOpen.open = !this.sportOpen.open)
        : null;
      sport.open = !sport.open;
      this.sportOpen = sport;
      if (sport.open) {
        this.userService.searchStats(sport.label);
      }
    } else {
      sport.open = !sport.open;
      this.sportOpen = null;
    }
  }

  getStats(): any {
    return this.userService.getStats();
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

  getWinRatio(): any {
    if (!this.getStats().matchesPlayed) {
      return 0;
    } else {
      return (
        (this.getStats().matchesWon / this.getStats().matchesPlayed) *
        100
      ).toFixed(2);
    }
  }

  getDataSource(): any {
    return this.userService.getStatsDataSource();
  }

  getUserStatsPageOptions(): any {
    return this.userService.getUserStatsPageOptions();
  }

  changePage(event: any): void {
    this.userService.setUserStatsPageOptions(event);
    this.userService.searchStats(this.sportOpen.label);
  }

  isOpen(): Boolean {
    return false;
  }
}
