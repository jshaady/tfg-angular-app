import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ITeam } from '../interfaces/iteam';
import { SnackBarComponent } from '../components/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ISnackBar } from '../interfaces/isnack-bar';
import { UserService } from './user.service';
import { IStats } from '../interfaces/istats';
import { TranslateService } from '@ngx-translate/core';
import { MatTableDataSource } from '@angular/material/table';
import { IMatch } from '../interfaces/imatch';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private readonly BaseURL = 'http://localhost:3000/team';
  private team: ITeam;
  private teams: ITeam[];
  private myTeamsCreated: ITeam[];
  private teamsSearch: ITeam[] = null;
  private stats: IStats;

  private uuidTeam: ITeam = null;
  private uuidTeamError: string;
  private uuid: string = null;

  private teamNavLinks: any = [];
  private createErrors: any = [];

  private isSaving: Boolean = false;

  private dataSource : MatTableDataSource<IMatch>;

  constructor(private http: HttpClient,
              private snackBar: MatSnackBar,
              private userService: UserService,
              private router: Router,
              private translateService: TranslateService) { }


  createTeam(body: any): void {
    this.createErrors = [];
    this.http.post<ISnackBar>(this.BaseURL + '/', body).subscribe(
      data => {
        this.isSaving = false;
        this.makeSnackBar(data.success, 'success');
        this.router.navigate(['/team', data.id]);
      },
      error => {
        this.isSaving = false;
        if (error.status === 409) {
          this.checkCreateFormErrors(error.error.errors);
        } else {
          this.checkHttpErrors(error);
        }
      }
    );
  }

  searchMyTeams(): void {
    this.http.get<ITeam[]>(this.BaseURL + '/joined').subscribe(
      (data) => {
        this.teams = data;
      },
      (error) => {
        if (error instanceof HttpErrorResponse) {
          this.checkHttpErrors(error);
        }
      }
    );
  }

  searchMyTeamsCreated(): void {
    this.http.get<ITeam[]>(this.BaseURL + '/created').subscribe(
      (data) => {
        this.myTeamsCreated = data;
      },
      (error) => {
        if (error instanceof HttpErrorResponse) {
          this.checkHttpErrors(error);
        }
      });
  }

  searchStats(): void {
    if (this.team) {
      const params = new HttpParams().set('teamname', this.team.teamname);
      this.http.get<IStats>(this.BaseURL + '/stats', { params }).subscribe(
        (data: IStats) => {
          this.stats = data;
          this.dataSource = new MatTableDataSource<IMatch>(data.matches);
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            this.checkHttpErrors(error);
          }
        });
    }
  }

  searchTeam(teamname: string, formModel: any): void {
    const params = new HttpParams().set('teamname', teamname);
    this.http.get<ITeam>(this.BaseURL + '/', { params }).subscribe(
      (data) => {
        this.teamNavLinks = [];
        this.team = data;
        this.teamNavLinks = [{
          label: 'DESCRIPTION', path: '/team/' + this.team.teamname
        },
        {
          label: 'STATS', path: '/team/' + this.team.teamname + '/stats'
        }];
        if (formModel != null) {
          formModel.patchValue({
            Description: this.team.description,
            Location: this.team.location
          });
        }
      },
      (error) => {
        if (error instanceof HttpErrorResponse) {
          this.checkHttpErrors(error);
        }
      }
    );
  }

  editTeam(body: any): void {
    this.createErrors = [];
    this.http.put<ISnackBar>(this.BaseURL + '/', body).subscribe(
      (data) => {
        this.isSaving = false;
        this.router.navigate(['/team', this.getTeam().teamname]);
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

  updateTeamAvatar(formData: any): void {
    this.http.put<ISnackBar>(this.BaseURL + '/image', formData).subscribe(
      (data) => {
        this.isSaving = false;
        this.makeSnackBar(data.success, 'success');
        this.searchTeam(this.getTeam().teamname, null);
      },
      (error) => {
        this.isSaving = false;
        if (error instanceof HttpErrorResponse) {
          this.checkHttpErrors(error);
        }
      }
    )
  }

  searchTeamByUuid(uuid: string, modalService: any): void {
    const params = new HttpParams().set('uuid', uuid);
    this.http.get<ITeam>(this.BaseURL + '/search/uuid', { params }).subscribe(
      (data: ITeam) => {
        this.isSaving = false;
        this.uuidTeamError = null;
        this.uuidTeam = data;
      },
      (error: any) => {
        this.isSaving = false;
        if (error instanceof HttpErrorResponse) {
          this.uuidTeam = null;
          if (error.status === 409) {
            this.uuidTeamError = error.error.error;
          } else {
            modalService.dismissAll();
            this.checkHttpErrors(error);
          }
        }
      }
    );
  }

  joinTeam(team: ITeam, modalService): void {
    this.http.post<ISnackBar>(this.BaseURL + '/join', team).subscribe(
      (data: ISnackBar) => {
        this.makeSnackBar(data.success, 'success');
        if (modalService === null) {
          this.searchTeam(team.teamname, null);
        } else {
          modalService.dismissAll();
        }
        this.router.navigate(['/team', team.teamname]);
      },
      (error: any) => {
        if (error instanceof HttpErrorResponse) {
          if (modalService != null) {
            modalService.dismissAll();
          }
          this.checkHttpErrors(error);
        }
      }
    );
  }

  leftTeam(): void {
    const params = new HttpParams().set('teamname', this.team.teamname.toString()).append('username', this.userService.getLoggeduser().username);
    this.http.delete<ISnackBar>(this.BaseURL + '/left', { params }).subscribe(
      (data: ISnackBar) => {
        this.searchTeam(this.team.teamname, null);
        this.makeSnackBar(data.success, 'success');
      },
      (error: any) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 409) {
            this.makeSnackBar(error.error.error, 'error');
          } else {
            this.checkHttpErrors(error);
          }
        }
      }
    );
  }

  searchCode(): void {
    const params = new HttpParams().set('teamname', this.getTeam().teamname);
    this.http.get<any>(this.BaseURL + '/uuid', { params: params }).subscribe(
      (data: any) => {
        this.uuid = data[0].uuid;
      },
      (error: any) => {
        if (error instanceof HttpErrorResponse) {
          this.checkHttpErrors(error);
        }
      }
    );
  }

  search(location: string, teamname: string): void {
    const params = new HttpParams().set('location', location).append('teamname', teamname);
    this.http.get<ITeam[]>(this.BaseURL + '/search', { params: params }).subscribe(
      (data: ITeam[]) => {
        this.teamsSearch = data;
      },
      (error: any) => {
        this.checkHttpErrors(error);
      }
    );
  }

  getStats(): IStats {
    return this.stats;
  }

  getTeam(): ITeam {
    return this.team;
  }

  getTeams(): ITeam[] {
    return this.teams;
  }

  getUuidTeam(): ITeam {
    return this.uuidTeam;
  }

  setUuidTeam(uuidTeam: ITeam): void {
    this.uuidTeam = uuidTeam;
  }

  getUuidTeamError(): string {
    return this.uuidTeamError;
  }

  setUuidTeamError(error: string): void {
    this.uuidTeamError = error;
  }

  getUuid(): string {
    return this.uuid;
  }

  setUuidNull(): void {
    this.uuid = null;
  }

  getTeamSearch(): ITeam[] {
    return this.teamsSearch;
  }

  getTeamNavLinks(): any {
    return this.teamNavLinks;
  }

  getMyTeamsCreated(): ITeam[] {
    return this.myTeamsCreated;
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

  setCreateErrors(error: string): any {
    this.createErrors.push(error);
  }

  setCreateErrorsEmpty(): void {
    this.createErrors = [];
  }

  getDataSource() {
    return this.dataSource;
  }
  
  applyTeamStatsFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  makeSnackBar(message: String, type: String): void {
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

  private checkCreateFormErrors(errors: any): void {
    if (errors.teamExists) this.setCreateErrors(errors.teamExists);
    if (errors.teamNameNull) this.setCreateErrors(errors.teamNameNull);
    if (errors.teamNameMinLength) this.setCreateErrors(errors.teamNameMinLength);
    if (errors.teamNameMaxLength) this.setCreateErrors(errors.teamNameMaxLength);
    if (errors.userLeaderNull) this.setCreateErrors(errors.userLeaderNull);
    if (errors.userLeaderMinLength) this.setCreateErrors(errors.userLeaderMinLength);
    if (errors.userLeaderMaxLength) this.setCreateErrors(errors.userLeaderMaxLength);
    if (errors.locationNull) this.setCreateErrors(errors.locationNull);
    if (errors.teamLocationMaxLength) this.setCreateErrors(errors.teamLocationMaxLength);
    if (errors.teamLocationMinLength) this.setCreateErrors(errors.teamLocationMinLength);
    if (errors.teamDescriptionNull) this.setCreateErrors(errors.teamDescriptionNull);
    if (errors.teamDescriptionMaxLength) this.setCreateErrors(errors.teamDescriptionMaxLength);
    if (errors.teamDescriptionMinLength) this.setCreateErrors(errors.teamDescriptionMinLength);
    if (errors.maxNumberPlayersNull) this.setCreateErrors(errors.maxNumberPlayersNull);
    if (errors.maxNumberPlayersMinSize) this.setCreateErrors(errors.maxNumberPlayersMinSize);
    if (errors.maxNumberPlayersMaxSize) this.setCreateErrors(errors.maxNumberPlayersMaxSize);
    if (errors.isPrivate) this.setCreateErrors(errors.isPrivate);
    if (errors.dateNull) this.setCreateErrors(errors.dateNull);
    if (errors.dateIncorrect) this.setCreateErrors(errors.dateIncorrect);
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
