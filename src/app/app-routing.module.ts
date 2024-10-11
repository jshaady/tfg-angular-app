import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "./guards/user/auth.guard";
import { AuthAdminGuard } from "./guards/admin/auth-admin.guard";

import { WelcomeComponent } from "./components/welcome/welcome.component";

import { ChatUsersComponent } from "./components/chat/chat-users/chat-users.component";
import { ChatComponent } from "./components/chat/chat/chat.component";

import { NewsComponent } from "./components/news/news/news.component";
import { NewsCreateComponent } from "./components/news/news-create/news-create.component";

import { MeetsComponent } from "./components/meet/meets/meets.component";
import { MeetCreateComponent } from "./components/meet/meet-create/meet-create.component";
import { MeetViewComponent } from "./components/meet/meet-view/meet-view.component";

import { UserViewComponent } from "./components/user/user-view/user-view.component";
import { UserStatsComponent } from "./components/user/user-stats/user-stats.component";
import { UserDescriptionComponent } from "./components/user/user-description/user-description.component";
import { UserProfileComponent } from "./components/user/user-profile/user-profile.component";

import { UsersListComponent } from "./components/user/users-list/users-list.component";
import { UserNextEventsComponent } from "./components/user/user-next-events/user-next-events.component";

import { TeamsComponents } from "./components/team/teams/teams.component";
import { TeamViewComponent } from "./components/team/team-view/team-view.component";
import { TeamDescriptionComponent } from "./components/team/team-description/team-description.component";
import { TeamStatsComponent } from "./components/team/team-stats/team-stats.component";
import { TeamCreateComponent } from "./components/team/team-create/team-create.component";
import { TeamEditComponent } from "./components/team/team-edit/team-edit.component";

import { LeaguesComponent } from "./components/league/leagues/leagues.component";
import { LeagueViewComponent } from "./components/league/league-view/league-view.component";
import { LeagueCreateComponent } from "./components/league/league-create/league-create.component";
import { LeagueDescriptionComponent } from "./components/league/league-description/league-description.component";
import { LeagueMatchesComponent } from "./components/league/league-matches/league-matches.component";
import { LeagueClasificationComponent } from "./components/league/league-clasification/league-clasification.component";

import { TournamentsComponent } from "./components/tournament/tournaments/tournaments.component";
import { TournamentViewComponent } from "./components/tournament/tournament-view/tournament-view.component";
import { TournamentCreateComponent } from "./components/tournament/tournament-create/tournament-create.component";
import { TournamentDescriptionComponent } from "./components/tournament/tournament-description/tournament-description.component";
import { TournamentMatchesComponent } from "./components/tournament/tournament-matches/tournament-matches.component";
import { TournamentBracketsComponent } from "./components/tournament/tournament-brackets/tournament-brackets.component";

import { NotfoundComponent } from "./components/notfound/notfound.component";
import { NotconfirmedComponent } from "./components/notconfirmed/notconfirmed.component";
import { TeamSearchComponent } from "./components/team/team-search/team-search.component";
import { HomeComponent } from "./components/home/home.component";

const routes: Routes = [
  { path: "", component: WelcomeComponent },
  { path: "home", component: HomeComponent, canActivate: [AuthGuard] },
  { path: "news", component: NewsComponent, canActivate: [AuthGuard] },
  {
    path: "news/create",
    component: NewsCreateComponent,
    canActivate: [AuthAdminGuard],
  },
  { path: "tournament", component: TournamentsComponent },
  { path: "tournament/create", component: TournamentCreateComponent },
  {
    path: "tournament/:id",
    component: TournamentViewComponent,
    children: [
      { path: "", component: TournamentDescriptionComponent },
      { path: "matches", component: TournamentMatchesComponent },
      { path: "brackets", component: TournamentBracketsComponent },
    ],
  },
  { path: "league", component: LeaguesComponent },
  { path: "league/create", component: LeagueCreateComponent },
  {
    path: "league/:id",
    component: LeagueViewComponent,
    children: [
      { path: "", component: LeagueDescriptionComponent },
      { path: "matches", component: LeagueMatchesComponent },
      { path: "clasification", component: LeagueClasificationComponent },
    ],
  },
  { path: "meet", component: MeetsComponent },
  {
    path: "meet/create",
    component: MeetCreateComponent,
    canActivate: [AuthGuard],
  },
  { path: "meet/:id", component: MeetViewComponent },
  {
    path: "profile",
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  },
  { path: "chat", component: ChatComponent, canActivate: [AuthGuard] },
  { path: "teams", component: TeamsComponents, canActivate: [AuthGuard] },
  {
    path: "team/:id",
    component: TeamViewComponent,
    children: [
      { path: "", component: TeamDescriptionComponent },
      { path: "stats", component: TeamStatsComponent },
    ],
  },
  {
    path: "team/:id/edit",
    component: TeamEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "user/:id",
    component: UserViewComponent,
    children: [
      { path: "", component: UserDescriptionComponent },
      { path: "stats", component: UserStatsComponent },
    ],
  },
  { path: "events", component: UserNextEventsComponent },
  {
    path: "users/list",
    component: UsersListComponent,
    canActivate: [AuthAdminGuard],
  },
  {
    path: "teams/create",
    component: TeamCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "teams/search",
    component: TeamSearchComponent,
    canActivate: [AuthGuard],
  },
  { path: "notfound", component: NotfoundComponent },
  { path: "notconfirmed", component: NotconfirmedComponent },
  { path: "**", component: NotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
export const routingComponents = [
  UserProfileComponent,
  TournamentCreateComponent,
  LeaguesComponent,
  MeetsComponent,
  TeamsComponents,
  TeamViewComponent,
  UserViewComponent,
  NotfoundComponent,
  TeamStatsComponent,
  ChatUsersComponent,
  ChatComponent,
  TournamentsComponent,
  TeamCreateComponent,
  TeamEditComponent,
  TeamDescriptionComponent,
  MeetCreateComponent,
  LeagueCreateComponent,
  TournamentViewComponent,
  LeagueViewComponent,
  LeagueDescriptionComponent,
  LeagueMatchesComponent,
  LeagueClasificationComponent,
  TournamentDescriptionComponent,
  TournamentMatchesComponent,
  TournamentBracketsComponent,
  WelcomeComponent,
  NewsComponent,
  NewsCreateComponent,
  MeetViewComponent,
  UsersListComponent,
  TeamSearchComponent,
  NotconfirmedComponent,
  HomeComponent,
  UserStatsComponent,
  UserDescriptionComponent,
  UserNextEventsComponent,
];
