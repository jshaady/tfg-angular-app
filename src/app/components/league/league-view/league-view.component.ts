import { Component, OnInit } from "@angular/core";
import { ChampionshipService } from "../../../services/championship.service";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "../../../services/user.service";
import { MatDialog } from "@angular/material/dialog";
import { JoinChampionshipComponent } from "../../modals/join-championship/join-championship.component";
import { IChampionship } from "../../../interfaces/ichampionship";

@Component({
  selector: "app-league-view",
  templateUrl: "./league-view.component.html",
  styleUrls: ["./league-view.component.css"],
})
export class LeagueViewComponent implements OnInit {
  constructor(
    private championshipService: ChampionshipService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private userService: UserService
  ) {}

  activeLink: string = "DESCRIPTION";

  ngOnInit() {
    this.getChampionshipReq();
  }

  getChampionshipReq(): void {
    this.route.params.subscribe((params) => {
      this.championshipService.getChampionshipByIdAndType(
        params["id"],
        "League"
      );
      this.router.navigate(["/league", params["id"]]);
    });
  }

  getChampionship(): IChampionship | undefined {
    return this.championshipService.getChampionship();
  }

  canGenerate(): Boolean {
    if (this.isCreator() && this.inInscription()) {
      return true;
    } else {
      return false;
    }
  }

  canJoin(): Boolean {
    if (
      this.userService.loggedIn() &&
      !this.championshipService.isJoined() &&
      this.inInscription() &&
      this.getChampionship()!.numMaxTeams >
        this.getChampionship()!.teamsInChampionship.length
    ) {
      return true;
    } else {
      return false;
    }
  }

  canLeave(): Boolean {
    if (
      this.loggedIn() &&
      this.championshipService.isJoined() &&
      this.inInscription()
    ) {
      return true;
    } else {
      return false;
    }
  }

  inInscription() {
    if (this.championshipService.getChampionship()) {
      if (this.championshipService.getChampionship()?.state == "Inscription") {
        return true;
      } else return false;
    } else return false;
  }

  isCreator() {
    if (
      this.championshipService.getChampionship() &&
      this.userService.getLoggeduser()
    ) {
      if (
        this.championshipService.getChampionship()?.creatorUser ===
        this.userService.getLoggeduser()?.username
      )
        return true;
      else return false;
    } else return false;
  }

  isJoined() {
    return this.championshipService.isJoined();
  }

  isNotTeam() {
    return this.championshipService.isNotTeam();
  }

  loggedIn() {
    return this.userService.loggedIn();
  }

  generateMatches() {
    this.championshipService.generateMatches();
  }

  /* JOIN / LEAVE OPTIONS */
  openJoin() {
    const dialogRef = this.dialog.open(JoinChampionshipComponent, {
      width: "500px",
    });
    dialogRef.componentInstance.onAdd.subscribe(() => {
      this.dialog.closeAll();
    });
  }

  getChampionshipImage(): string {
    return this.championshipService.getChampionshipImage();
  }

  closeLogin() {
    this.dialog.closeAll();
  }

  getNavLinksChampionship() {
    return this.championshipService.getNavLinksChampionship();
  }

  leave() {
    this.championshipService.leftChampionship(
      this.championshipService.getChampionship()!.id.toString()
    );
  }
}
