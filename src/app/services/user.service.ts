import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { IUser } from '../interfaces/iuser';
import { ISnackBar } from '../interfaces/isnack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { SnackBarComponent } from '../components/snack-bar/snack-bar.component';
import { TranslateService } from '@ngx-translate/core';
import { IMatch } from '../interfaces/imatch';
import { IStats } from '../interfaces/istats';
import { IMeet } from '../interfaces/imeet';
import { IChampionship } from '../interfaces/ichampionship';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly BaseURL = 'http://localhost:3000/user';
  private loggedUser: IUser = null;
  private user: IUser = null;
  private userLoginErrors: string = null;
  private userSignUpError = [];
  private usersList: IUser[];
  private emailNotConfirmed: string = null;
  private navLinksUsers: any = [];

  private userUpdateErrors: any = [];
  private isSaving: Boolean = false;

  private dataSource: MatTableDataSource<IUser>;
  private userListPageOptions: any = { previousPageIndex: 0, pageIndex: 0, pageSize: 25, length: 0 };
  private searchUserNameOrPassword: string = null;

  private statsDataSource: MatTableDataSource<IMatch>;
  private userStatsPageOptions: any = { previousPageIndex: 0, pageIndex: 0, pageSize: 25, length: 0 };
  private userStats: IStats;

  private eventsInfo: any = [{label: 'leagues', open: false}, {label: 'tournaments', open: false}, {label: 'meets', open: false}];

  private tournamentEventsPage: number = 0;
  private tournamentEvents: IChampionship[] = null;
  private moreTournamentEvents: Boolean = true;

  private leagueEventsPage: number = 0;
  private leagueEvents: IChampionship[] = null;
  private moreLeagueEvents: Boolean = true;

  private meetsEventsPage: number = 0;
  private meetEvents: IMeet[] = null;
  private moreMeetEvents: Boolean = true;

  constructor(private http: HttpClient,
              private router: Router,
              private snackBar: MatSnackBar,
              private translateService: TranslateService) { }

  signUp(body: any, add: any, formModel: any): void {
    this.http.post<ISnackBar>(this.BaseURL + '/signup', body).subscribe(
      (data: any) => {
        this.isSaving = false;
        if (data.message) {
          formModel.reset();
          add.emit();
          this.emailNotConfirmed = body.email;
          this.router.navigate(['/notconfirmed']);
        }
      },
      (error: any) => {
        this.resetErrorSignUp();
        this.isSaving = false;
        if (error instanceof HttpErrorResponse) {
          if (error.status === 409) {
            this.checkSignUpFormErrors(error.error.errors);
          } else {
            add.emit();
            this.checkHttpErrors(error);
            formModel.reset();
          }
        }
      }
    );
  }

  signIn(body: any, add: any): void {
    this.http.post<IUser>(this.BaseURL + '/signin', body).subscribe(
      (data: any) => {
        this.isSaving = false;
        this.setLoggedUser(data);
        localStorage.setItem('token', data.token);
        add.emit();
        if(this.router.url === '/notconfirmed' || this.router.url === '/') {
          this.router.navigate(['/home']);
        }
      },
      (error: any) => {
        this.isSaving = false;
        if (error instanceof HttpErrorResponse) {
          if (error.status === 409) {
            if (error.error.error === 'Not confirmed email') {
              this.emailNotConfirmed = error.error.errors.email;
              this.router.navigate(['/notconfirmed']);
              add.emit();
            }
            else {
              this.userLoginErrors = error.error.error;
            }
          }
          else {
            this.checkHttpErrors(error);
          }
        }
      }
    );
  }

  resendEmail(): void {
    const params = new HttpParams().set('email', this.emailNotConfirmed);
    this.http.get<ISnackBar>(this.BaseURL + '/resend/email', { params }).subscribe(
      (data) => {
        this.isSaving = false;
        this.makeSnackBar(data.success, 'success');
      },
      (error) => {
        this.isSaving = false;
        if (error instanceof HttpErrorResponse) {
          this.checkHttpErrors(error);
        }
      }
    );
  }

  deleteUser(username: string): void {
    const params = new HttpParams().set('username', username);
    this.http.delete<ISnackBar>(this.BaseURL + '/', {params}).subscribe(
      (data: ISnackBar)  => {
        this.isSaving = false;
        this.makeSnackBar(data.success, 'success');
        this.searchUsersList();
      },
      (error: any) => {
        this.isSaving = false;
        if (error instanceof HttpErrorResponse) {
          this.checkHttpErrors(error);
        }
      }
    )
  }

  searchUser(username: string): void {
    const params = new HttpParams().set('username', username);
    this.http.get<IUser>(this.BaseURL + '/search', { params }).subscribe(
      (data: IUser) => {
        this.user = data;
        this.navLinksUsers = [{label: 'DESCRIPTION', path:'/user/'+ this.user.username }, 
                                  {label:'STATS', path:'/user/'+ this.user.username + '/stats'}];
      },
      (error: any) => {
        if (error instanceof HttpErrorResponse) {
          this.checkHttpErrors(error);
        }
      }
    )
  }

  searchProfile(formModel: any): void {
    this.http.get<IUser>(this.BaseURL + '/profile').subscribe(
      (data: IUser) => {
        this.loggedUser = data;
        if (formModel != null) {
          formModel.patchValue({
            Name: this.loggedUser.name,
            Surname: this.loggedUser.surname,
            Email: this.loggedUser.email,
            Birthdate: this.loggedUser.birthdate,
            Country: this.loggedUser.country,
            Location: this.loggedUser.location
          });
        }
      },
      (error: any) => {
        if (error instanceof HttpErrorResponse) {
          this.checkHttpErrors(error);
        }
      }
    );
  }

  updateProfileImage(formData: any): void {
    this.http.put<ISnackBar>(this.BaseURL + '/image', formData).subscribe(
      (data: ISnackBar) => {
        this.isSaving = false;
        this.makeSnackBar(data.success, 'success')
        this.searchProfile(null);
      },
      (error: any) => {
        this.isSaving = false;
        if (error instanceof HttpErrorResponse) {
          this.checkHttpErrors(error);
        }
      }
    );
  }

  updateProfile(body: any): void {
    this.userUpdateErrors = [];
    this.http.put<ISnackBar>(this.BaseURL + '/', body).subscribe(
      (data) => {
        this.isSaving = false;
        this.makeSnackBar(data.success, 'success');
        this.searchProfile(null);
      },
      (error: any) => {
        this.isSaving = false;
        if (error instanceof HttpErrorResponse) {
          if (error.status === 409) {
            this.checkUpdateFormErrors(error.error.errors);
          } else {
            this.checkHttpErrors(error);
          }
        }
      }
    );
  }

  searchUsersList(): void {
    let params = new HttpParams().set('previousPageIndex', this.getUserListPageOptions().previousPageIndex)
                                 .append('pageIndex', this.getUserListPageOptions().pageIndex)
                                 .append('pageSize', this.getUserListPageOptions().pageSize)
                                 .append('nameOrEmail', this.getUserSearchNameOrEmail());
    this.http.get<IUser[]>(this.BaseURL + '/list', { params }).subscribe(
      (data: any) => {
        this.dataSource = new MatTableDataSource<IUser>(data.users);
        this.userListPageOptions.length = data.pager.totalItems;
      },
      (error: any) => {
        this.checkHttpErrors(error);
      }
    );
  }
  
  searchStats(sport: string): void {
    this.statsDataSource = null;
    let params = new HttpParams().set('username', this.getUser().username)
      .append('previousPageIndex', this.getUserStatsPageOptions().previousPageIndex)
      .append('pageIndex', this.getUserStatsPageOptions().pageIndex)
      .append('pageSize', this.getUserStatsPageOptions().pageSize)
      .append('sport', sport);
    this.http.get<IStats>(this.BaseURL + '/stats', { params }).subscribe(
      (data: IStats) => {
        this.userStats = data;
        this.statsDataSource = new MatTableDataSource<IMatch>(data.matches);
        this.userStatsPageOptions.length = data.matchesPlayed;
      },
      (error: any) => {
        this.checkHttpErrors(error);
      }
    );
  }

  events(type: string): void {
     const params = new HttpParams().set('page', type === 'League' ? this.getLeagueEventsPage().toString() :
                                          type === 'Tournament' ? this.getTournamentEventsPage().toString() :
                                          this.getMeetsEventsPage().toString())
                                    .append('type', type)
                                    .append('date', new Date().toString());
    this.http.get<any>(this.BaseURL + '/events', { params }).subscribe(
      (data: any) => {
        if (type === 'meets') {
          if (this.meetEvents === null) {
            this.meetEvents = data;
          } else {
            data.forEach((meet: IMeet) => {
              this.meetEvents.push(meet);
            });
          }
          data.length < 2 ? this.moreMeetEvents = false : this.moreMeetEvents = true;
        } else if (type === 'League') {
          if (this.leagueEvents === null) {
            this.leagueEvents = data;
          } else {
            data.forEach((league: any) => {
              this.leagueEvents.push(league);
            });
          }
          data.length < 2 ? this.moreLeagueEvents = false : this.moreLeagueEvents = true;
        } else if (type === 'Tournament') {
          if (this.tournamentEvents === null) {
            this.tournamentEvents = data;
          } else {
            data.forEach((tournament: any) => {
              this.tournamentEvents.push(tournament);
            });
          }
          data.length < 2 ? this.moreTournamentEvents = false : this.moreTournamentEvents = true;
          this.tournamentEvents = data;
        }
      },
      (error: any) => {
        this.checkHttpErrors(error);
      }
    );
  }

  getStats(): IStats {
    return this.userStats;
  }

  getUser(): IUser {
    return this.user;
  }

  getUsersList(): IUser[] {
    return this.usersList;
  }

  getUserLoginErrors(): string {
    return this.userLoginErrors;
  }

  setUserLoginErrorsNull(): void {
    this.userLoginErrors = null;
  }

  getUserUpdateErrors(): any {
    return this.userUpdateErrors;
  }

  setUserUpdateErrors(error: string): void {
    this.userUpdateErrors.push(error);
  }

  setUserUpdateEmpty(): void {
    this.userUpdateErrors = [];
  }

  getUserSignUpError(): any {
    return this.userSignUpError;
  }

  setErrorSignUp(error: string): void {
    this.userSignUpError.push(error);
  }

  resetErrorSignUp(): void {
    this.userSignUpError = [];
  }

  getNavLinksUser(): any {
    return this.navLinksUsers;
  }

  getEventsInfo(): any {
    return this.eventsInfo;
  }

  /** Table Data source and Pagination **/

  getDataSource(): any {
    return this.dataSource;
  }

  getStatsDataSource(): any {
    return this.statsDataSource;
  }

  getUserListPageOptions(): any {
    return this.userListPageOptions;
  }

  setUserListPageOptions(pageOptions: any): void {
    this.userListPageOptions = pageOptions;
  }

  getUserStatsPageOptions(): any {
    return this.userStatsPageOptions;
  }

  setUserStatsPageOptions(pageOptions: any): void {
    this.userStatsPageOptions = pageOptions;
  }

  getUserSearchNameOrEmail(): string {
    return this.searchUserNameOrPassword;
  }

  setUserSearchNameOrEmail(nameOrEmail: string): any {
    this.searchUserNameOrPassword = nameOrEmail;
  }

  /* Tournaments */

  getTournamentEventsPage(): number {
    return this.tournamentEventsPage;
  }

  setTournamentEventsPage(page: number): void {
    this.tournamentEventsPage = page;
  }

  getTournamentEvents() {
    return this.tournamentEvents;
  }

  setTournamentEvents(tournamentEvents: any): void {
    this.tournamentEvents = tournamentEvents;
  }

  getMoreTournamentsEvents(): Boolean {
    return this.moreTournamentEvents;
  }

  /* Leagues */

  getLeagueEventsPage(): number {
    return this.leagueEventsPage;
  }

  setLeagueEventsPage(page: number): void {
    this.leagueEventsPage = page;
  }

  getLeagueEvents() {
    return this.leagueEvents;
  }

  setLeagueEvents(leagueEvents: any): void {
    this.leagueEvents = leagueEvents;
  }

  getMoreLeagueEvents(): Boolean {
    return this.moreLeagueEvents;
  }

  /* Meets */
  getMeetsEventsPage(): number {
    return this.meetsEventsPage;
  }

  setMeetsEventsPage(page: number): void {
    this.meetsEventsPage = page;
  }

  getMeetEvents(): IMeet[] {
    return this.meetEvents;
  }

  setMeetsEvents(meetEvents: any): void {
    this.meetEvents = meetEvents;
  }

  getMoreMeetEvents(): Boolean {
    return this.moreMeetEvents;
  }

  /** Logged user info and functions **/

  getLoggeduser(): IUser {
    return this.loggedUser;
  }

  setLoggedUser(loggedUser: IUser): void {
    this.loggedUser = loggedUser;
  }

  getEmailNotConfirmed(): string {
    return this.emailNotConfirmed;
  }

  loggedIn(): Boolean {
    if (localStorage.getItem('token') == null) {
      return false;
    }
    else { return true; }
  }

  isAdmin(): Boolean {
    if (this.loggedUser) {
      if (this.loggedUser.rol == 1) {
        return true;
      } else {
        return false;
      }
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.loggedUser = null;
    this.router.navigate(['']);
  }

  getToken(): string {
    return localStorage.getItem('token');
  }

  /** Forms saving **/

  getIsSaving(): Boolean {
    return this.isSaving;
  }

  setIsSaving(isSaving: Boolean): void {
    this.isSaving = isSaving;
  }

  /**  Snack Bar **/

  makeSnackBar(message: String, type: String): void {
    let typeInfoClass = '';
    if (type === 'success') typeInfoClass = 'snack-bar-success';
    else if (type === 'error') typeInfoClass = 'snack-bar-error';
    else if (type === 'warning') typeInfoClass = 'snack-bar-warning';
    this.translateService.get('responsemessages.' + message).subscribe((messageI18n: string) => {
      this.snackBar.openFromComponent(SnackBarComponent, {
        data: { messageContent: messageI18n },
        panelClass: [typeInfoClass],
        verticalPosition: 'top'
      });
    });
  }

  /** Forms validation errors **/

  private checkSignUpFormErrors(errors: any): void {
    if(errors.error) this.setErrorSignUp(errors.error);
    if(errors.emailExists) this.setErrorSignUp(errors.emailExists);
    if (errors.usernameExists) this.setErrorSignUp(errors.usernameExists);
    if (errors.passwordMinLength) this.setErrorSignUp(errors.passwordMinLength);
    if (errors.passwordMaxLength) this.setErrorSignUp(errors.passwordMaxLength);
    if (errors.errors.userNameNull) this.setErrorSignUp(errors.errors.userNameNull);
    if (errors.errors.userNameMinLength) this.setErrorSignUp(errors.errors.userNameMinLength);
    if (errors.errors.userNameMaxLength) this.setErrorSignUp(errors.errors.userNameMaxLength);
    if (errors.errors.emailIncorrect) this.setErrorSignUp(errors.errors.emailIncorrect);
    if (errors.errors.userEmailMaxLength) this.setErrorSignUp(errors.errors.userEmailMaxLength);
    if (errors.errors.birthdateNull) this.setErrorSignUp(errors.errors.birthdateNull);
    if (errors.errors.birthdateIncorrect) this.setErrorSignUp(errors.errors.birthdateIncorrect);
    if (errors.errors.birthdate18orLessYearsOld) this.setErrorSignUp(errors.errors.birthdate18orLessYearsOld);
    if (errors.errors.joinDateNull) this.setErrorSignUp(errors.errors.birthdateNull);
    if (errors.errors.joinDateIncorrect) this.setErrorSignUp(errors.errors.birthdateIncorrect);
    if (errors.errors.joinDateIncorrect) this.setErrorSignUp(errors.errors.birthdateIncorrect);
  }

  private checkUpdateFormErrors(errors: any): void {
    if (errors.errors.nameMaxLength) this.setUserUpdateErrors(errors.errors.nameMaxLength);
    if (errors.errors.nameMinLength) this.setUserUpdateErrors(errors.errors.nameMinLength);
    if (errors.errors.userSurnameMaxLength) this.setUserUpdateErrors(errors.errors.userSurnameMaxLength);
    if (errors.errors.userSurnameMinLength) this.setUserUpdateErrors(errors.errors.userSurnameMinLength);
    if (errors.errors.userCountryMaxLength) this.setUserUpdateErrors(errors.errors.userCountryMaxLength);
    if (errors.errors.userCountryMinLength) this.setUserUpdateErrors(errors.errors.userCountryMinLength);
    if (errors.errors.userLocationMaxLength) this.setUserUpdateErrors(errors.errors.userLocationMaxLength);
    if (errors.errors.userLocationMinLength) this.setUserUpdateErrors(errors.errors.userLocationMinLength);
    if (errors.errors.userAddressMaxLength) this.setUserUpdateErrors(errors.errors.userAddressMaxLength);
    if (errors.errors.userAddressMinLength) this.setUserUpdateErrors(errors.errors.userAddressMinLength);
    if (errors.errors.userPhoneNotNumber) this.setUserUpdateErrors(errors.errors.userPhoneNotNumber);
    if (errors.errors.userPhoneMinLength) this.setUserUpdateErrors(errors.errors.userPhoneMinLength);
    if (errors.errors.userPhoneMaxLength) this.setUserUpdateErrors(errors.errors.userPhoneMaxLength);
    if (errors.errors.birthdateNull) this.setUserUpdateErrors(errors.errors.birthdateNull);
    if (errors.errors.birthdateIncorrect) this.setUserUpdateErrors(errors.errors.birthdateIncorrect);
    if (errors.errors.birthdate18orLessYearsOld) this.setErrorSignUp(errors.errors.birthdate18orLessYearsOld);
    if (errors.errors.descriptionMaxLength) this.setUserUpdateErrors(errors.errors.descriptionMaxLength);
    if (errors.errors.descriptionMinLength) this.setUserUpdateErrors(errors.errors.descriptionMinLength);
  }

  /* Errors */
  private checkHttpErrors(error: HttpErrorResponse): void {
    switch (error.status) {
      case 401:
        this.logout();
        this.makeSnackBar(error.error.error, 'error');
        this.router.navigate(['']);
        break;
      case 404:
        this.makeSnackBar(error.error.error, 'error');
        this.router.navigate(['/not-found']);
        break;
      case 500:
        this.makeSnackBar(error.error.error, 'error');
        this.logout();
        this.router.navigate(['']);
        break;
      default:
        this.makeSnackBar(error.error.error, 'error');
        this.router.navigate(['']);
        break;
    }
  }
}
