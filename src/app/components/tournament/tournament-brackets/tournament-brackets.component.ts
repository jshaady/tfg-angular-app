import { Component, OnInit } from "@angular/core";
import { ChampionshipService } from "../../../services/championship.service";
import { UserService } from "../../../services/user.service";
import { IMatch } from "../../../interfaces/imatch";
import { ITeam } from "../../../interfaces/iteam";

@Component({
  selector: "app-tournament-brackets",
  templateUrl: "./tournament-brackets.component.html",
  styleUrls: ["./tournament-brackets.component.css"],
})
export class TournamentBracketsComponent implements OnInit {
  activeLink: string = "BRACKETS";

  constructor(
    private championshipService: ChampionshipService,
    private userService: UserService
  ) {}

  ngOnInit() {
    if (this.championshipService.getChampionship()) {
      this.championshipService.searchChampionshipBracketsMatches();
    }
  }

  getMatches(): IMatch[] | undefined {
    return this.championshipService.getBracketsMatches();
  }

  isFinal(): Boolean {
    return this.championshipService.isFinal();
  }

  isSemifinal(): Boolean {
    return this.championshipService.isSemifinal();
  }

  isQuarterfinal(): Boolean {
    return this.championshipService.isQuarterfinal();
  }

  isRoundOf16(): Boolean {
    return this.championshipService.isRoundOf16();
  }

  isRoundOf32(): Boolean {
    return this.championshipService.isRoundOf32();
  }

  getFinalArray(): any {
    return this.championshipService.getFinalArray();
  }

  getSemifinalArray(): any {
    return this.championshipService.getSemifinalArray();
  }

  getQuarterfinal(): any {
    return this.championshipService.getQuarterfinal();
  }

  getRoundOf16(): any {
    return this.championshipService.getRoundOf16();
  }

  getRoundOf32(): any {
    return this.championshipService.getRoundOf32();
  }

  nextPhase(): Boolean {
    return this.championshipService.nextPhase();
  }

  inProgress(): Boolean {
    if (this.championshipService.getChampionship()) {
      if (this.championshipService.getChampionship()?.state == "In progress") {
        return true;
      } else return false;
    } else return false;
  }

  isCreator(): Boolean {
    if (
      this.championshipService.getChampionship() &&
      this.userService.getLoggeduser()
    ) {
      if (
        this.championshipService.getChampionship()?.creatorUser ===
        this.userService.getLoggeduser()?.username
      ) {
        return true;
      } else return false;
    } else return false;
  }

  isWinner(result1: number, result2: number): Boolean {
    if (result1 > result2) {
      return true;
    } else {
      return false;
    }
  }

  noMatch(team2: ITeam): Boolean {
    if (team2.teamname.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  matchPlayed(matchResult1: string): Boolean {
    if (matchResult1 !== null) {
      return true;
    } else {
      return false;
    }
  }

  generateNextPhase(): void {
    this.championshipService.generateNextPhase();
  }
}
