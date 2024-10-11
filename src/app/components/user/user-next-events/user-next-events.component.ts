import { Component, OnInit, ContentChild } from "@angular/core";
import { UserService } from "../../../services/user.service";
import { ChampionshipService } from "../../../services/championship.service";
import { MatPaginator } from "@angular/material/paginator";

@Component({
  selector: "app-user-next-events",
  templateUrl: "./user-next-events.component.html",
  styleUrls: ["./user-next-events.component.css"],
})
export class UserNextEventsComponent implements OnInit {
  @ContentChild("paginator", { static: false }) paginator:
    | MatPaginator
    | undefined;

  displayedColumnsLeague: string[] = ["date", "team1", "team2", "seeleague"];
  displayedColumnsTournament: string[] = [
    "date",
    "team1",
    "team2",
    "phase",
    "seetournament",
  ];

  private idActiveMeet: string | null = null;
  private idActiveLeague: string | null = null;
  private idActiveTournament: string | null = null;

  countdown: any = null;
  idCountDown: any;

  constructor(
    private userService: UserService,
    private championshipService: ChampionshipService
  ) {}

  ngOnInit() {
    this.userService.setLeagueEventsPage(0);
    this.userService.setTournamentEventsPage(0);
    this.userService.setMeetsEventsPage(0);
    this.userService.getEventsInfo().forEach((event: any) => {
      if (event.open) {
        if (event.label === "leagues") {
          this.userService.events("League");
        } else if (event.label === "tournaments") {
          this.userService.events("Tournament");
        } else if (event.label === "meets") {
          this.userService.events("meets");
        }
      }
    });
  }

  ngOnDestroy() {
    this.userService.getEventsInfo().forEach((event: any) => {
      event.open = false;
    });
    this.userService.setLeagueEvents(null);
    this.userService.setTournamentEvents(null);
    this.userService.setMeetsEvents(null);
  }

  meetCountDown(date: string): void {
    this.clearCountdown();
    this.instantInitCountdown(date);
    this.idCountDown = setInterval(() => {
      let countDownDate = new Date(date).getTime();
      let now = new Date().getTime();
      let distance = countDownDate - now;
      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);
      this.countdown =
        days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
    }, 1000);
  }

  clearCountdown() {
    this.countdown = null;
    if (this.idCountDown) {
      clearInterval(this.idCountDown);
    }
  }

  instantInitCountdown(date: string) {
    let countDownDate = new Date(date).getTime();
    let now = new Date().getTime();
    let distance = countDownDate - now;
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    this.countdown =
      days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
  }

  seeEvents(event: any): void {
    if (!event.open) {
      event.open = !event.open;
      this.userService.events(
        event.label === "leagues"
          ? "League"
          : event.label === "tournaments"
          ? "Tournament"
          : "meets"
      );
    } else {
      event.open = !event.open;
      if (event.label === "leagues") {
        this.userService.setLeagueEvents(null);
        this.userService.setLeagueEventsPage(0);
      } else if (event.label === "tournaments") {
        this.userService.setTournamentEvents(null);
        this.userService.setTournamentEventsPage(0);
      } else if (event.label === "meets") {
        this.userService.setMeetsEvents(null);
        this.userService.setMeetsEventsPage(0);
      }
    }
  }

  show(type: string, event: any): void {
    if (type === "meet") {
      if (event.id === this.idActiveMeet) {
        this.idActiveMeet = null;
      } else {
        this.idActiveMeet = event.id;
        this.meetCountDown(event.date);
      }
    } else if (type === "league") {
      if (event.id === this.idActiveLeague) {
        this.idActiveLeague = null;
      } else {
        this.idActiveLeague = event.id;
        this.championshipService.searchUserNextMatches("League");
      }
    } else if (type === "tournament") {
      if (event.id === this.idActiveTournament) {
        this.idActiveTournament = null;
      } else {
        this.idActiveTournament = event.id;
        this.championshipService.searchUserNextMatches("Tournament");
      }
    }
  }

  active(type: string, id: string): Boolean {
    if (type === "meet") {
      if (id === this.idActiveMeet) {
        return true;
      } else {
        return false;
      }
    } else if (type === "league") {
      if (id === this.idActiveLeague) {
        return true;
      } else {
        return false;
      }
    } else if (type === "tournament") {
      if (id === this.idActiveTournament) {
        return true;
      } else {
        return false;
      }
    } else return false;
  }

  showMore(type: string): void {
    if (type === "leagues") {
      this.userService.setLeagueEventsPage(
        this.userService.getLeagueEventsPage() + 1
      );
      this.userService.events("League");
    } else if (type === "tournaments") {
      this.userService.setTournamentEventsPage(
        this.userService.getTournamentEventsPage() + 1
      );
      this.userService.events("Tournament");
    } else {
      this.userService.setMeetsEventsPage(
        this.userService.getMeetsEventsPage() + 1
      );
      this.userService.events(type);
    }
  }

  getTournamentEvents(): any {
    return this.userService.getTournamentEvents();
  }

  getLeagueEvents(): any {
    return this.userService.getLeagueEvents();
  }

  getMeetEvents(): any {
    return this.userService.getMeetEvents();
  }

  getMoreTournamentEvents(): Boolean {
    return this.userService.getMoreTournamentsEvents();
  }

  getMoreLeagueEvents(): Boolean {
    return this.userService.getMoreLeagueEvents();
  }

  getMoreMeetEvents(): Boolean {
    return this.userService.getMoreMeetEvents();
  }

  getEvents(): any {
    return this.userService.getEventsInfo();
  }

  getLeagueDataSource(): any {
    return this.championshipService.getLeagueEventsDataSource();
  }

  getTournamentDataSource(): any {
    return this.championshipService.getTournamentEventsDataSource();
  }

  getLeagueEventsPageOptions(): any {
    return this.championshipService;
  }

  getTournamentEventsPageOptions(): any {
    return this.championshipService;
  }

  changePage(type: string, event: any): void {
    if (type === "leagues") {
      this.championshipService.setLeagueEventsPageOptions(event);
      this.championshipService.searchUserNextMatches("League");
    } else if (type === "tournaments") {
      this.championshipService.setTournamentEventsPageOptions(event);
      this.championshipService.searchUserNextMatches("Tournament");
    }
  }
}
