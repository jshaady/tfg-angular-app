import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from './user.service';
import { SnackBarComponent } from '../components/snack-bar/snack-bar.component';
import { ISnackBar } from '../interfaces/isnack-bar';
import { INews } from '../interfaces/inews';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private readonly BaseURL: string = 'http://localhost:3000/news';
  private news: INews[];
  private newsPage: number = 1;
  private newsCount: number = 0;
  private isSaving: Boolean = false;
  private createErrors: any = [];

  constructor(private http: HttpClient,
              private snackBar: MatSnackBar,
              private router: Router,
              private userService: UserService,
              private translateService: TranslateService) { }

  createNews(body: any): void {
    this.createErrors = [];
    this.http.post<ISnackBar>(this.BaseURL + '/', body).subscribe(
      (data: ISnackBar) => {
        this.isSaving = false;
        this.makeSnackBar(data.success, 'success');
        this.router.navigate(['/home']);
      },
      (error: any) => {
        this.isSaving = false;
        if (error instanceof HttpErrorResponse) {
          if (error.status === 409) {
            this.checkCreateFormErrors(error.error.errors);
          } else {
            this.checkHttpErrors(error);
          }
        }
      }
    );
  }

  searchNews(): void {
    let location = 'no';
    if (this.userService.getLoggeduser() && this.userService.getLoggeduser().location)
      location = this.userService.getLoggeduser().location;
    let params = new HttpParams().set('location', location)
                                  .append('page', this.getNewsPage().toString());
    this.http.get<INews[]>(this.BaseURL + '/', { params }).subscribe(
      (data: any) => {
        if (data.length === 0){
          this.news = [];
        } else {
          this.news = data.newsArray;
          this.newsCount = parseInt(data.countNews);
        }
      },
      (error: any) => {
        if (error instanceof HttpErrorResponse) {
          this.checkHttpErrors(error);
        }
      }
    );
  }

  getNews(): INews[] {
    return this.news;
  }

  getIsSaving(): Boolean {
    return this.isSaving;
  }

  getNewsPage(): number {
    return this.newsPage;
  }

  getNewsCount(): number {
    return this.newsCount;
  }

  setNewsPage(newsPage: number): void {
    this.newsPage = newsPage;
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

  checkCreateFormErrors(errors: any): void {
    if (errors.notAdmin) this.setCreateErrors(errors.notAdmin);
    if (errors.sendUserNull) this.setCreateErrors(errors.sendUserNull);
    if (errors.sendUserMinLength) this.setCreateErrors(errors.sendUserMinLength);
    if (errors.sendUserMaxLength) this.setCreateErrors(errors.sendUserMaxLength);
    if (errors.titleNull) this.setCreateErrors(errors.titleNull);
    if (errors.titleMinLength) this.setCreateErrors(errors.titleMinLength);
    if (errors.titleMaxLength) this.setCreateErrors(errors.titleMaxLength);
    if (errors.messageNull) this.setCreateErrors(errors.messageNull);
    if (errors.messageMinLength) this.setCreateErrors(errors.messageMinLength);
    if (errors.locationNull) this.setCreateErrors(errors.locationNull);
    if (errors.locationMinLength) this.setCreateErrors(errors.locationMinLength);
    if (errors.locationMaxLength) this.setCreateErrors(errors.locationMaxLength);
  }

  /*
  * Check the errors for the NewsService
  */
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
