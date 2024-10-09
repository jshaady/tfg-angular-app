import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { IChampionship } from '../interfaces/ichampionship';
import { ISnackBar } from '../interfaces/isnack-bar';
import { SnackBarComponent } from '../components/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { IMatch } from '../interfaces/imatch';
import { IClasificationTeam } from '../interfaces/iclasification-team';
import { TranslateService } from '@ngx-translate/core';
import { IPaginate } from '../interfaces/ipaginate';
import { MatTableDataSource } from '@angular/material/table';

@Injectable({
  providedIn: 'root'
})
export class ChampionshipService {

  private readonly BaseURL = 'http://localhost:3000/championship';
  private championship: IChampionship;
  private championships: IChampionship[];
  private clasification: IClasificationTeam[];

  private joined: boolean = false;
  private notTeam: boolean = false;
  private joinResponse: any;
  private matches: IMatch[];
  private bracketsMatches: IMatch[];
  private matchDates: string[] = [];

  private page: number = 1;
  private paginate: IPaginate = null;
  private searchChampionshipType: string;
  private searchChampionshipName: string = null;
  private searchChampionshipLocation: string = null;
  private searchChampionshipSport: string = 'all';

  private errorsJoinChampionship: string = null;
  private errorSetResult: string = null;
  private createErrors: any = [];

  private navLinksChampionship: any = [];

  private matchesDisplayedColumns: string[] = ['date', 'team1', 'result', 'team2', 'options'];
  private matchesTournamentDisplayedColumns: string[] = ['date', 'team1', 'result', 'team2', 'phase', 'options'];
  private clasificationDisplayedColumns: string[] = ['team', 'points', 'won', 'drawn', 'lost'];

  private leagueEventsDataSource: MatTableDataSource<IMatch>;
  private leagueEventsPageOptions: any = { previousPageIndex: 0, pageIndex: 0, pageSize: 25, length: 0 };

  private tournamentEventsDataSource: MatTableDataSource<IMatch>;
  private tournamentEventsPageOptions: any = { previousPageIndex: 0, pageIndex: 0, pageSize: 25, length: 0 };

  private matchesDataSource: MatTableDataSource<IMatch>;
  private matchesPageOptions: any = { previousPageIndex: 0, pageIndex: 0, pageSize: 25, length: 0 };
  private matchesTableVisible: any = false;
  private teamnameSearched: string = null;

  private isSaving: Boolean = false;

  private final: boolean = false;
  private semifinal: boolean = false;
  private quarterfinal: boolean = false;
  private roundOf16: boolean = false;
  private roundOf32: boolean = false;

  private finalArray = [];
  private semifinalArray = [];
  private quarterfinalArray = [];
  private roundOf16Array = [];
  private roundOf32Array = [];

  constructor(private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    private userService: UserService,
    private translateService: TranslateService) { }

  createChampionship(body: any, formModel: any): void {
    this.createErrors = [];
    this.http.post<ISnackBar>(this.BaseURL + '/', body).subscribe(
      (data: ISnackBar) => {
        this.isSaving = false;
        this.makeSnackBar(data.success, 'success');
        formModel.reset();
        this.router.navigate([body.type.toLowerCase(), data.id])
      },
      (error: any) => {
        this.isSaving = false;
        if (error instanceof HttpErrorResponse) {
          if (error.status === 409) {
            this.checkCreateFormErrors(error.error.errors);
          }
          else this.checkHttpErrors(error);
        }
      }
    );
  }

  searchChampionships(): void {
    this.championships = [];
    const params = new HttpParams().set('type', this.searchChampionshipType)
      .append('sport', this.getSearchSport())
      .append('name', this.getSearchName())
      .append('location', this.getSearchLocation())
      .append('page', this.getPage() ? this.getPage().toString() : '1')
      .append('date', new Date().toString());
    this.http.get<IChampionship[]>(this.BaseURL + '/all', { params }).subscribe(
      (data: any) => {
        if (data.length === 0) {
          this.championships = [];
        } else {
          this.championships = data.championships;
          this.paginate = data.pager;
        }
      },
      (error: any) => {
        if (error instanceof HttpErrorResponse) {
          this.checkHttpErrors(error);
        }
      });
  }

  joinChampionship(body: any, onAdd: any): void {
    this.errorsJoinChampionship = null;
    this.http.post<ISnackBar>(this.BaseURL + '/join', body).subscribe(
      (data: ISnackBar) => {
        this.isSaving = false;
        this.makeSnackBar(data.success, 'success');
        this.getChampionshipByIdAndType(this.championship.id.toString(), this.getChampionship().type);
        onAdd.emit();
      },
      (error: any) => {
        this.isSaving = false;
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            this.makeSnackBar(error.error.error, 'error');
            this.setJoined(true);
            this.router.navigate(['']);
            this.userService.logout();
          }
          else if (error.status === 409) {
            this.errorsJoinChampionship = error.error.error;
            this.makeSnackBar(error.error.error, 'error');
            this.router.navigate(['/' + this.getChampionship().type.toLowerCase(), this.getChampionship().id]);
          }
          else {
            onAdd.emit();
            this.checkHttpErrors(error);
          }
        }
      }
    );
  }

  leftChampionship(idChampionship: string): void {
    const params = new HttpParams().set('idChampionship', idChampionship);
    this.http.delete<ISnackBar>(this.BaseURL + '/left', { params }).subscribe(
      (data: ISnackBar) => {
        this.makeSnackBar(data.success, 'success');
        this.getChampionshipByIdAndType(this.getChampionship().id.toString(), this.getChampionship().type);
        this.router.navigate(['/' + this.getChampionship().type.toLowerCase(), this.getChampionship().id]);
      },
      (error: any) => {
        if (error instanceof HttpErrorResponse) {
          this.checkHttpErrors(error);
        }
      }
    );
  }

  participate(): any {
    const params = new HttpParams().set('idChampionship', this.getChampionship().id.toString());
    return this.http.get(this.BaseURL + '/participate', { params });
  }

  searchChampionshipMatches(): void {
    const params = new HttpParams().set('idChampionship', this.getChampionship().id.toString())
      .append('pageSize', this.getMatchesPageOptions().pageSize)
      .append('pageIndex', this.getMatchesPageOptions().pageIndex)
      .append('teamname', this.teamnameSearched);
    this.http.get<IMatch[]>(this.BaseURL + '/matches', { params }).subscribe(
      (data: any) => {
        this.matchesDataSource = new MatTableDataSource<IMatch>(data.matches);
        if (data.pager && data.pager.totalItems > 0) {
          this.matchesPageOptions.length = data.pager.totalItems;
          this.matchesTableVisible = true;
        } else {
          this.matchesTableVisible = false;
        }
      },
      (error: any) => {
        this.matchesTableVisible = false;
        if (error instanceof HttpErrorResponse) {
          this.checkHttpErrors(error);
        }
      }
    );
  }

  searchChampionshipBracketsMatches(): void {
    const params = new HttpParams().set('idChampionship', this.getChampionship().id.toString());
    this.http.get<IMatch[]>(this.BaseURL + '/brackets/matches', { params }).subscribe(
      (data: IMatch[]) => {
        this.bracketsMatches = data;
        this.rounds()
      },
      (error: any) => {
        if (error instanceof HttpErrorResponse) {
          this.checkHttpErrors(error);
        }
      }
    );
  }

  getMatchDatesReq(id: number, team1: string, team2: string, onAdd: any): void {
    const params = new HttpParams().set('idChampionship', this.getChampionship().id.toString())
      .append('team1', team1)
      .append('team2', team2);
    this.http.get<any>(this.BaseURL + '/match/dates', { params }).subscribe(
      (data: any) => {
        this.matchDates = data;
      },
      (error: any) => {
        if (error instanceof HttpErrorResponse) {
          onAdd.emit();
          this.checkHttpErrors(error);
        }
      }
    );
  }

  setResult(body: any, add: any): void {
    this.http.put<ISnackBar>(this.BaseURL + '/set/result', body).subscribe(
      (data: ISnackBar) => {
        this.isSaving = false;
        this.makeSnackBar(data.success, 'success');
        this.searchChampionshipMatches();
        add.emit();
      },
      (error: any) => {
        this.isSaving = false;
        if (error instanceof HttpErrorResponse) {
          if (error.status !== 409) { add.emit(); }
          this.checkHttpErrors(error);
        }
      }
    );
  }

  addDate(body: any, add: any): void {
    this.http.post<ISnackBar>(this.BaseURL + '/add/date', body).subscribe(
      (data: ISnackBar) => {
        this.isSaving = false;
        this.makeSnackBar(data.success, 'success');
        this.getMatchDatesReq(body.idChampionship, body.team1, body.team2, add);
      },
      (error: any) => {
        this.isSaving = false;
        if (error instanceof HttpErrorResponse) {
          if (error.status !== 409) { add.emit(); }
          this.checkHttpErrors(error);
        }
      }
    );
  }

  deleteDate(query: any, add: any) {
    const params = new HttpParams().set('idChampionship', query.idChampionship)
      .append('team1', query.team1)
      .append('team2', query.team2)
      .append('date', query.date);
    this.http.delete<ISnackBar>(this.BaseURL + '/delete/date', { params }).subscribe(
      (data: ISnackBar) => {
        this.isSaving = false;
        this.makeSnackBar(data.success, 'success');
        this.getMatchDatesReq(query.idChampionship, query.team1, query.team2, add);
      },
      (error: any) => {
        this.isSaving = false;
        if (error instanceof HttpErrorResponse) {
          if (error.status !== 409) { add.emit(); }
          this.checkHttpErrors(error);
        }
      }
    );
  }

  acceptDate(body: any, add: any): void {
    this.http.put<ISnackBar>(this.BaseURL + '/accept/date', body).subscribe(
      (data: ISnackBar) => {
        this.isSaving = false;
        this.makeSnackBar(data.success, 'success');
        this.searchChampionshipMatches();
        add.emit();
      },
      (error: any) => {
        this.isSaving = false;
        if (error instanceof HttpErrorResponse) {
          if (error.status !== 409) { add.emit(); }
          this.checkHttpErrors(error);
        }
      }
    );
  }

  generateMatches(): void {
    const body = {
      idChampionship: this.getChampionship().id
    }
    this.http.post<ISnackBar>(this.BaseURL + '/generate/matches', body).subscribe(
      (data: ISnackBar) => {
        this.isSaving = false;
        this.makeSnackBar(data.success, 'success');
        this.getChampionshipByIdAndType(this.getChampionship().id.toString(), this.getChampionship().type);
      },
      (error: any) => {
        this.isSaving = false;
        if (error instanceof HttpErrorResponse) {
          if (error.status === 409 && this.getChampionship().type == 'League') {
            this.makeSnackBar(error.error.error, 'error');
            this.router.navigate(['/league', this.getChampionship().id]);
          }
          else if (error.status === 409 && this.getChampionship().type == 'Tournament') {
            this.makeSnackBar(error.error.error, 'error');
            this.router.navigate(['/tournament', this.getChampionship().id]);
          }
          else this.checkHttpErrors(error);
        }
      }
    );
  }

  getLeagueClasification(): void {
    const params = new HttpParams().set('idChampionship', this.getChampionship().id.toString());
    this.http.get<IClasificationTeam[]>(this.BaseURL + '/clasification', { params }).subscribe(
      (data: IClasificationTeam[]) => {
        this.clasification = data;
        if (data.length > 0)
          this.clasification = data;
        else
          this.clasification = [];
      },
      (error: any) => {
        if (error instanceof HttpErrorResponse) {
          this.checkHttpErrors(error);
        }
      }
    );
  }

  getChampionshipByIdAndType(idChampionship: string, type: string): void {
    const params = new HttpParams().set('idChampionship', idChampionship).append('type', type);
    this.http.get<IChampionship>(this.BaseURL + '/', { params }).subscribe(
      (data: IChampionship) => {
        this.navLinksChampionship = [];
        this.championship = data;
        this.setChampionship(data);
        if (type == 'Tournament') {
          this.navLinksChampionship = [{ label: 'DESCRIPTION', path: '/tournament/' + this.championship.id.toString() },
          { label: 'BRACKETS', path: '/tournament/' + this.championship.id.toString() + '/brackets' },
          { label: 'MATCHES', path: '/tournament/' + this.championship.id.toString() + '/matches' }];
        }
        if (type == 'League') {
          this.navLinksChampionship = [{ label: 'DESCRIPTION', path: '/league/' + this.championship.id.toString() },
          { label: 'CLASIFICATION', path: '/league/' + this.championship.id.toString() + '/clasification' },
          { label: 'MATCHES', path: '/league/' + this.championship.id.toString() + '/matches' }];
        }
        if (this.userService.loggedIn()) {
          this.participate().subscribe(
            (data: any) => {
              this.joinResponse = data;
              this.joined = false;
              this.notTeam = false;
              if (this.joinResponse.isJoined === "not_team") {
                this.setNotTeam(true);
              }
              else if (this.joinResponse.isJoined === "true") {
                this.setJoined(true);
              }
              else if (this.joinResponse.isJoined === "false") {
                this.setJoined(false);
              }
            },
            (error: any) => {
              if (error instanceof HttpErrorResponse) {
                this.checkHttpErrors(error);
              }
            }
          );
        }
      },
      (error: any) => {
        if (error instanceof HttpErrorResponse) {
          this.checkHttpErrors(error);
        }
      }
    );
  }

  generateNextPhase(): void {
    const body = { idChampionship: this.getChampionship().id };
    this.http.post<ISnackBar>(this.BaseURL + '/generate/next/phase', body).subscribe(
      (data: ISnackBar) => {
        this.isSaving = false;
        this.makeSnackBar(data.success, 'success');
        this.getChampionshipByIdAndType(this.getChampionship().id.toString(), this.getChampionship().type);
        this.searchChampionshipBracketsMatches();
      },
      (error: any) => {
        this.isSaving = false;
        if (error instanceof HttpErrorResponse) {
          this.checkHttpErrors(error);
        }
      }
    );
  }

  searchUserNextMatches(type: string): void {
    const params = new HttpParams().set('type', type)
      .append('date', new Date().toString())
      .append('pageIndex', type === 'League' ? this.getLeagueEventsPageOptions().pageIndex :
        type === 'Tournament' ? this.getTournamentEventsPageOptions().pageIndex : null)
      .append('pageSize', type === 'League' ? this.getLeagueEventsPageOptions().pageSize :
        type === 'Tournament' ? this.getTournamentEventsPageOptions().pageSize : null)
    this.http.get<IMatch[]>(this.BaseURL + '/user/next/matches', { params }).subscribe(
      (data: any) => {
        if (type === 'League') {
          this.leagueEventsDataSource = new MatTableDataSource<IMatch>(data.matches);
          this.leagueEventsPageOptions.length = data.pager.totalItems;
        } else if (type === 'Tournament') {
          this.tournamentEventsDataSource = new MatTableDataSource<IMatch>(data.matches);
          this.tournamentEventsPageOptions.length = data.pager.totalItems;
        }
      },
      (error: any) => {
        if (error instanceof HttpErrorResponse) {
          this.checkHttpErrors(error);
        }
      }
    )
  }

  getChampionshipImage(): string {
    switch (this.getChampionship().sport) {
      case 'football':
        return '../assets/img/championship-images/football.jpg'
      case 'basketball':
        return '../assets/img/championship-images/basket.jpg';
      case 'tennis':
        return '../assets/img/championship-images/tennis.jpg';
      case 'csgo':
        return '../assets/img/championship-images/csgo.jpg';
      case 'lol':
        return '../assets/img/championship-images/lol.jpg';
      default:
        return '../assets/img/championship-images/other_sports.jpg'
    }
  }

  private rounds(): void {
    this.finalArray = [];
    this.semifinalArray = [];
    this.quarterfinalArray = [];
    this.roundOf16Array = [];
    this.roundOf32Array = [];
    let matches = this.getBracketsMatches();
    if (matches) {
      let twoMatchesArray = [];
      matches.forEach(match => {
        if (match.phase == 'Final') {
          this.final = true;
          this.finalArray.push(match);
        }
        if (match.phase == 'Semifinals') {
          this.semifinal = true;
          this.final = true;
          this.semifinalArray.push(match);
        }
        if (match.phase == 'Quarterfinals') {
          this.quarterfinal = true;
          this.semifinal = true;
          this.final = true;
          if (match.position % 2 == 0) {
            twoMatchesArray = [];
            twoMatchesArray.push(match);
          }
          else {
            twoMatchesArray.push(match);
            this.quarterfinalArray.push(twoMatchesArray);
          }
        }
        if (match.phase == 'Round of 16') {
          this.roundOf16 = true;
          this.quarterfinal = true;
          this.semifinal = true;
          this.final = true;
          if (match.position % 2 == 0) {
            twoMatchesArray = [];
            twoMatchesArray.push(match);
          }
          else {
            twoMatchesArray.push(match);
            this.roundOf16Array.push(twoMatchesArray);
          }
        }
        if (match.phase == 'Round of 32') {
          this.roundOf32 = true;
          this.roundOf16 = true;
          this.quarterfinal = true;
          this.semifinal = true;
          this.final = true;
          if (match.position % 2 == 0) {
            twoMatchesArray = [];
            twoMatchesArray.push(match);
          }
          else {
            twoMatchesArray.push(match);
            this.roundOf32Array.push(twoMatchesArray);
          }
        }
      });
    }
  }

  nextPhase(): Boolean {
    let nextPhase: number = 1;
    if (this.getChampionship().phase == 'Final') {
      return false;
    }
    else if (this.semifinalArray.length) {
      this.semifinalArray.forEach((match) => {
        if (match.matchResult1 == null || match.matchResult2 == null) {
          nextPhase = 0;
        }
      });
      if (nextPhase) {
        return true;
      } else {
        return false;
      }
    }
    else if (this.quarterfinalArray.length) {
      this.quarterfinalArray.forEach((matches) => {
        matches.forEach(match => {
          if (match.matchResult1 == null || match.matchResult2 == null) {
            nextPhase = 0;
          }
        });
      });
      if (nextPhase) {
        return true;
      } else {
        return false;
      }
    }
    else if (this.roundOf16Array.length) {
      this.roundOf16Array.forEach((matches) => {
        matches.forEach(match => {
          if (match.matchResult1 == null || match.matchResult2 == null) {
            nextPhase = 0;
          }
        });
      });
      if (nextPhase) {
        return true;
      } else {
        return false;
      }
    }
    else if (this.roundOf32Array.length) {
      this.roundOf32Array.forEach((matches) => {
        matches.forEach((match) => {
          if (match.matchResult1 == null || match.matchResult2 == null) {
            nextPhase = 0;
          }
        });
      });
      if (nextPhase) {
        return true;
      } else {
        return false;
      }
    }
    else {
      return false;
    }
  }

  getChampionships(): IChampionship[] {
    return this.championships;
  }

  getChampionship(): IChampionship {
    return this.championship;
  }

  setChampionship(championship: IChampionship): void {
    this.championship = championship;
  }

  getMatches(): IMatch[] {
    return this.matches;
  }

  getBracketsMatches(): IMatch[] {
    return this.bracketsMatches;
  }

  setBracketsMatchesEmpty(): void {
    this.bracketsMatches = null;
  }

  getClasification(): IClasificationTeam[] {
    return this.clasification;
  }

  getSearchType(): string {
    return this.searchChampionshipType;
  }

  setSearchType(type: string): void {
    this.searchChampionshipType = type;
  }

  getSearchName(): string {
    return this.searchChampionshipName;
  }

  setSearchName(name: string): void {
    this.searchChampionshipName = name;
  }

  getSearchLocation(): string {
    return this.searchChampionshipLocation;
  }

  setSearchLocation(location: string): void {
    this.searchChampionshipLocation = location;
  }

  getSearchSport(): string {
    return this.searchChampionshipSport;
  }

  setSearchSport(sport: string): void {
    this.searchChampionshipSport = sport
  }

  isJoined(): Boolean {
    return this.joined;
  }

  isNotTeam(): Boolean {
    return this.notTeam;
  }

  setJoined(joined: boolean): void {
    this.joined = joined;
  }

  setNotTeam(notTeam: boolean): void {
    this.notTeam = notTeam;
  }

  hasNotTeam(): Boolean {
    return this.notTeam;
  }

  setMatchesEmpty(): void {
    this.matches = [];
  }

  setClasificationEmpty(): void {
    this.clasification = [];
  }

  getErrorsJoinChampionship(): string {
    return this.errorsJoinChampionship;
  }

  setErrorsJoinChampionship(error: string): void {
    this.errorsJoinChampionship = error;
  }

  getErrorSetResult(): string {
    return this.errorSetResult;
  }

  getNavLinksChampionship(): any {
    return this.navLinksChampionship;
  }

  getMatchesDisplayedColumns(): string[] {
    return this.matchesDisplayedColumns;
  }

  getMatchesTournamentDisplayedColumns(): string[] {
    return this.matchesTournamentDisplayedColumns;
  }

  getClasificationDisplayedColumns(): string[] {
    return this.clasificationDisplayedColumns;
  }

  getPage(): number {
    return this.page;
  }

  setPage(page: number): void {
    this.page = page;
  }

  getPaginate(): IPaginate {
    return this.paginate;
  }

  getMatchDates(): string[] {
    return this.matchDates;
  }

  addMatchDate(date: string): void {
    this.matchDates.push(date);
  }

  getIsSaving(): Boolean {
    return this.isSaving;
  }

  setIsSaving(isSaving: Boolean): void {
    this.isSaving = isSaving;
  }

  getCreateErrors(): any {
    return this.createErrors;
  }

  setCreateErrors(error: string) {
    this.createErrors.push(error);
  }

  setCreateErrorEmpty(): void {
    this.createErrors = [];
  }

  getTournamentEventsDataSource(): any {
    return this.tournamentEventsDataSource;
  }

  getLeagueEventsDataSource(): any {
    return this.leagueEventsDataSource;
  }

  getTournamentEventsPageOptions(): any {
    return this.leagueEventsPageOptions;
  }

  getLeagueEventsPageOptions(): any {
    return this.tournamentEventsPageOptions;
  }

  setTournamentEventsPageOptions(pageOptions: any): void {
    this.tournamentEventsPageOptions = pageOptions;
  }

  setLeagueEventsPageOptions(pageOptions: any): void {
    this.leagueEventsPageOptions = pageOptions;
  }

  getMatchesDataSource(): any {
    return this.matchesDataSource;
  }

  getMatchesPageOptions(): any {
    return this.matchesPageOptions;
  }

  setMatchesPageOptions(matchesPageOptions: any): void {
    this.matchesPageOptions = matchesPageOptions;
  }

  setTeamnameSearched(teamname: string): void {
    this.teamnameSearched = teamname;
  }

  getMatchesTableVisible(): Boolean {
    return this.matchesTableVisible;
  }

  /* BRACKETS INFO */
  isFinal() {
    return this.final;
  }

  isSemifinal() {
    return this.semifinal;
  }

  isQuarterfinal() {
    return this.quarterfinal;
  }

  isRoundOf16() {
    return this.roundOf16;
  }

  isRoundOf32() {
    return this.roundOf32;
  }

  getFinalArray() {
    return this.finalArray;
  }

  getSemifinalArray() {
    return this.semifinalArray;
  }

  getQuarterfinal() {
    return this.quarterfinalArray;
  }

  getRoundOf16() {
    return this.roundOf16Array;
  }

  getRoundOf32() {
    return this.roundOf32Array;
  }

  private checkCreateFormErrors(errors: any): void {
    if (errors.championshipNameNull) this.setCreateErrors(errors.championshipNameNull);
    if (errors.championshipNameMinLength) this.setCreateErrors(errors.championshipNameMinLength);
    if (errors.championshipNameMaxLength) this.setCreateErrors(errors.championshipNameMaxLength);
    if (errors.userCreatorNull) this.setCreateErrors(errors.userCreatorNull);
    if (errors.userCreatorIncorrect) this.setCreateErrors(errors.userCreatorIncorrect);
    if (errors.numMaxTeamsIncorrect) this.setCreateErrors(errors.numMaxTeamsIncorrect);
    if (errors.numMaxNull) this.setCreateErrors(errors.numMaxNull);
    if (errors.sportIncorrect) this.setCreateErrors(errors.sportIncorrect);
    if (errors.sportNull) this.setCreateErrors(errors.sportNull);
    if (errors.descriptionNull) this.setCreateErrors(errors.descriptionNull);
    if (errors.descriptionMinLength) this.setCreateErrors(errors.descriptionMinLength);
    if (errors.descriptionMaxLength) this.setCreateErrors(errors.descriptionMaxLength);
    if (errors.startInscriptionNull) this.setCreateErrors(errors.startInscriptionNull);
    if (errors.startInscriptionIncorrect) this.setCreateErrors(errors.startInscriptionIncorrect);
    if (errors.endInscriptionNull) this.setCreateErrors(errors.endInscriptionNull);
    if (errors.endInscriptionIncorrect) this.setCreateErrors(errors.endInscriptionIncorrect);
    if (errors.startChampionshipNull) this.setCreateErrors(errors.startChampionshipNull);
    if (errors.startChampionshipIncorrect) this.setCreateErrors(errors.startChampionshipIncorrect);
    if (errors.championshipLocationNull) this.setCreateErrors(errors.championshipLocationNull);
    if (errors.championshipLocationMaxLength) this.setCreateErrors(errors.championshipLocationMaxLength);
    if (errors.championshipLocationMinLength) this.setCreateErrors(errors.championshipLocationMinLength);
    if (errors.incorrectType) this.setCreateErrors(errors.incorrectType);
    if (errors.typeNull) this.setCreateErrors(errors.typeNull);
  }

  private makeSnackBar(message: String, type: String): void {
    let typeInfoClass = '';
    if (type === 'success') typeInfoClass = 'snack-bar-success';
    else if (type === 'error') typeInfoClass = 'snack-bar-error';
    else if (type === 'warning') typeInfoClass = 'snack-bar-warning';
    this.translateService.get('responsemessages.' + message).subscribe((messageI18n: string) => {
      this.snackBar.openFromComponent(SnackBarComponent, {
        data: { messageContent: messageI18n },
        panelClass: [typeInfoClass],
        verticalPosition: 'top',
        duration: 3000
      });
    });
  }

  private checkHttpErrors(error: HttpErrorResponse): void {
    switch (error.status) {
      case 401:
        this.userService.logout();
        this.makeSnackBar(error.error.error, 'error');
        this.router.navigate(['']);
        break;
      case 404:
        this.makeSnackBar(error.error.error, 'error');
        this.router.navigate(['/not-found']);
        break;
      case 409:
        this.makeSnackBar(error.error.error, 'error');
        break;
      case 500:
        this.makeSnackBar(error.error.error, 'error');
        this.userService.logout();
        this.router.navigate(['']);
        break;
      default:
        this.makeSnackBar(error.error.error, 'error');
        this.router.navigate(['']);
        break;
    }
  }
}
