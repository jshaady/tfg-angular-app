import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { HttpParams, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IMeet } from '../interfaces/imeet';
import { SnackBarComponent } from '../components/snack-bar/snack-bar.component';
import { ISnackBar } from '../interfaces/isnack-bar';
import { TranslateService } from '@ngx-translate/core';
import { MatTableDataSource } from '@angular/material/table';

@Injectable({
  providedIn: 'root'
})
export class MeetService {

  private readonly BaseURL = 'http://localhost:3000/meet';
  private meets: IMeet[];
  private meet: IMeet;
  private isSaving: Boolean = false;
  private createErrors: any = [];

  private dataSource: MatTableDataSource<IMeet>;
  private meetsPageOptions: any = { previousPageIndex: 0, pageIndex: 0, pageSize: 25, length: 0 };
  private tableVisible: Boolean = false;
  private location: string = null;

  constructor(private http: HttpClient,
              private snackBar: MatSnackBar,
              private router: Router,
              private userService: UserService,
              private translateService: TranslateService) { }

  createMeet(body: any, formModel: any): void {
    this.createErrors = [];
    this.http.post<ISnackBar>(this.BaseURL + '/', body).subscribe(
      (data: ISnackBar) => {
        this.isSaving = false;
        this.makeSnackBar(data.success, 'success');
        formModel.reset();
        this.router.navigate(['/meet', data.id]);
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

  searchMeets(): void {
    const params = new HttpParams().set('location', this.getLocation())
      .append('date', new Date().toString())
      .append('pageIndex', this.getMeetsPageOptions().pageIndex)
      .append('pageSize', this.getMeetsPageOptions().pageSize);
    this.http.get<IMeet[]>(this.BaseURL + '/list', { params })
      .subscribe(
        (data: any) => {
          this.dataSource = new MatTableDataSource<IMeet>(data.meets);
          this.tableVisible = true;
          this.meetsPageOptions.length = data.pager.totalItems;
        },
        (error: any) => {
          if (error instanceof HttpErrorResponse) {
            this.checkHttpErrors(error);
          }
        }
      );
  }

  searchMeet(id: string): void {
    let params = new HttpParams().set('id', id);
    this.http.get<IMeet>(this.BaseURL + '/', { params }).subscribe(
      (data: IMeet) => {
        this.meet = data;
      },
      (error: any) => {
        if (error instanceof HttpErrorResponse) {
          this.checkHttpErrors(error);
        }
      }
    );
  }

  joinMeet(): void {
    this.isSaving = true;
    this.http.post<ISnackBar>(this.BaseURL + '/join', {'idMeet': this.meet.id.toString()}).subscribe(
      (data: ISnackBar) => {
        this.makeSnackBar(data.success, 'success');
        this.searchMeet(this.meet.id.toString());
        this.isSaving = false;
      },
      (error: any) => {
        this.isSaving = false;
        if (error instanceof HttpErrorResponse) {
          this.checkHttpErrors(error);
        }
      }
    );
  }

  leftMeet(): void {
    this.isSaving = true;
    let params = new HttpParams().set('idMeet', this.meet.id.toString());
    this.http.delete<ISnackBar>(this.BaseURL + '/left', { params }).subscribe(
      (data: ISnackBar) => {
        this.makeSnackBar(data.success, 'success');
        this.searchMeet(this.meet.id.toString());
        this.isSaving = false;
      },
      (error: any) => {
        this.isSaving = false;
        if (error instanceof HttpErrorResponse) {
          this.checkHttpErrors(error);
        }
      }
    );
  }

  getMeets(): IMeet[] {
    return this.meets;
  }

  getMeet(): IMeet {
    return this.meet;
  }

  setMeetEmpty() {
    this.meet = null;
  }

  getIsSaving(): Boolean {
    return this.isSaving;
  }

  setIsSaving(isSaving: Boolean): void {
    this.isSaving = isSaving;
  }

  getDataSource(): any {
    return this.dataSource;
  }

  setDataSource(dataSource: any) {
    this.dataSource = dataSource;
  }

  isTableVisible(): Boolean {
    return this.tableVisible;
  }

  setTableVisible(tableVisible: Boolean): void {
    this.tableVisible = tableVisible;
  }

  getMeetsPageOptions(): any {
    return this.meetsPageOptions;
  }

  setMeetsPageOptions(pageOptions: any): void {
    this.meetsPageOptions = pageOptions;
  }

  getLocation(): string {
    return this.location;
  }

  setLocation(location: string): void {
    this.location = location;
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

  private makeSnackBar(message: String, type: String): void {
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

  private checkCreateFormErrors(errors: any): void {
    if (errors.meetNameNull) this.setCreateErrors(errors.meetNameNull);
    if (errors.meetNameMaxLength) this.setCreateErrors(errors.meetNameMaxLength);
    if (errors.meetNameMinLength) this.setCreateErrors(errors.meetNameMinLength);
    if (errors.meetSportNull) this.setCreateErrors(errors.meetSportNull);
    if (errors.meetSportMaxLength) this.setCreateErrors(errors.meetSportMaxLength);
    if (errors.meetSportMinLength) this.setCreateErrors(errors.meetSportMinLength);
    if (errors.meetLocationNull) this.setCreateErrors(errors.meetLocationNull);
    if (errors.meetLocationMaxLength) this.setCreateErrors(errors.meetLocationMaxLength);
    if (errors.meetLocationMinLength) this.setCreateErrors(errors.meetLocationMinLength);
    if (errors.meetDescriptionNull) this.setCreateErrors(errors.meetDescriptionNull);
    if (errors.meetDescriptionMaxLength) this.setCreateErrors(errors.meetDescriptionMaxLength);
    if (errors.meetDescriptionMinLength) this.setCreateErrors(errors.meetDescriptionMinLength);
    if (errors.dateNull) this.setCreateErrors(errors.dateNull);
    if (errors.dateIncorrect) this.setCreateErrors(errors.dateIncorrect);
  }

  private checkHttpErrors(error: HttpErrorResponse): void {
    switch (error.status) {
      case 401:
        this.userService.logout();
        this.userService.makeSnackBar(error.error.error, 'error');
        this.router.navigate(['']);
        break;
      case 404:
        this.userService.makeSnackBar(error.error.error, 'error');
        this.router.navigate(['/not-found']);
        break;
      case 500:
        this.userService.makeSnackBar(error.error.error, 'error');
        this.userService.logout();
        this.router.navigate(['']);
        break;
      default:
        this.userService.makeSnackBar(error.error.error, 'error');
        this.router.navigate(['']);
        break;
    }
  }
}
