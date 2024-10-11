import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ClipboardModule } from "ngx-clipboard";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { DatePipe } from "@angular/common";
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from "@danielmoncada/angular-datetime-picker";

import { AppRoutingModule, routingComponents } from "./app-routing.module";
import { HttpClient, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AuthGuard } from "./guards/user/auth.guard";

import { AppComponent } from "./app.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { SignInComponent } from "./components/modals/sign-in/sign-in.component";
import { SignUpComponent } from "./components/modals/sign-up/sign-up.component";
import { SportBarComponent } from "./components/sport-bar/sport-bar.component";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatRadioModule } from "@angular/material/radio";
import { MatSidenavModule } from "@angular/material/sidenav";
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
} from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatNativeDateModule, MatRippleModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSelectModule } from "@angular/material/select";
import { MatTabsModule } from "@angular/material/tabs";
import { LayoutModule } from "@angular/cdk/layout";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { UserService } from "./services/user.service";
import { ChatService } from "./services/chat.service";
import { TeamService } from "./services/team.service";
import { ChampionshipService } from "./services/championship.service";
import { NewsService } from "./services/news.service";

import { SnackBarComponent } from "./components/snack-bar/snack-bar.component";
import { TokenInterceptorService } from "./services/token-interceptor.service";
import { JoinChampionshipComponent } from "./components/modals/join-championship/join-championship.component";
import { SetResultMatchComponent } from "./components/modals/set-result-match/set-result-match.component";
import { SetDateMatchComponent } from "./components/modals/set-date-match/set-date-match.component";
import { GoogleMapsModule } from "@angular/google-maps";

const COMPONENTS = [
  AppComponent,
  NavbarComponent,
  SignInComponent,
  SignUpComponent,
  SportBarComponent,
  SnackBarComponent,
  JoinChampionshipComponent,
  SetResultMatchComponent,
  SetDateMatchComponent,
  SignInComponent,
  SignUpComponent,
  SnackBarComponent,
  JoinChampionshipComponent,
  SetResultMatchComponent,
  SetDateMatchComponent,
];

const MODULES = [
  BrowserModule,
  AppRoutingModule,
  MatDialogModule,
  BrowserModule,
  BrowserAnimationsModule,
  FormsModule,
  ReactiveFormsModule,
  MatSidenavModule,
  MatListModule,
  MatIconModule,
  MatToolbarModule,
  MatCardModule,
  LayoutModule,
  MatButtonModule,
  MatRadioModule,
  MatCheckboxModule,
  MatSelectModule,
  MatSnackBarModule,
  MatTableModule,
  MatPaginatorModule,
  MatTabsModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatRippleModule,
  MatInputModule,
  ClipboardModule,
  GoogleMapsModule,
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient],
    },
  }),
  NgbModule,
];

const PROVIDERS = [
  UserService,
  AuthGuard,
  DatePipe,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true,
  },
  ChatService,
  TeamService,
  ChampionshipService,
  NewsService,
  {
    provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
    useValue: {
      duration: 2500,
    },
  },
];

@NgModule({
  declarations: [...COMPONENTS, routingComponents],
  imports: [...MODULES],
  providers: [...PROVIDERS],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
