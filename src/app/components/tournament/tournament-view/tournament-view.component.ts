import { Component, OnInit } from '@angular/core';
import { ChampionshipService } from 'src/app/services/championship.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { JoinChampionshipComponent } from '../../modals/join-championship/join-championship.component';
import { IChampionship } from 'src/app/interfaces/ichampionship';

@Component({
  selector: 'app-tournament-view',
  templateUrl: './tournament-view.component.html',
  styleUrls: ['./tournament-view.component.css']
})
export class TournamentViewComponent implements OnInit {

  activeLink: string = 'DESCRIPTION';

  position4: any = ['1º', '2º', '3º-4º', '3º-4º'];
  position8: any = ['1º', '2º', '3º-4º', '3º-4º', '5º-8º', '5º-8º', '5º-8º', '5º-8º'];
  position16: any = ['1º', '2º', '3º-4º', '3º-4º', '5º-8º', '5º-8º', '5º-8º', '5º-8º', '9º-16º',
    '9º-16º', '9º-16º', '9º-16º', '9º-16º', '9º-16º', '9º-16º', '9º-16º'];
  position32: any = ['1º', '2º', '3º-4º', '3º-4º', '5º-8º', '5º-8º', '5º-8º', '5º-8º', '9º-16º',
    '9º-16º', '9º-16º', '9º-16º', '9º-16º', '9º-16º', '9º-16º', '9º-16º',
    '17º-32º', '17º-32º', '17º-32º', '17º-32º', '17º-32º', '17º-32º', '17º-32º', '17º-32º',
    '17º-32º', '17º-32º', '17º-32º', '17º-32º', '17º-32º', '17º-32º', '17º-32º', '17º-32º'];

  constructor(private championshipService: ChampionshipService,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.getChampionshipReq();
  }

  getChampionshipReq(): void {
    this.route.params.subscribe(params => {
      this.championshipService.getChampionshipByIdAndType(params['id'], 'Tournament');
      this.router.navigate(['/tournament', params['id']]);
    });
  }

  getChampionship(): IChampionship {
    return this.championshipService.getChampionship();
  }

  canGenerate(): Boolean {
    if (this.isCreator() && 
        this.inInscription()) {
          return true;
    } else {
      return false;
    }
  }

  canJoin(): Boolean {
    if (this.userService.loggedIn() && 
        !this.championshipService.isJoined() && 
        this.inInscription() &&
        this.getChampionship().numMaxTeams > this.getChampionship().teamsInChampionship.length) {
          if (this.championshipService.hasNotTeam()) {
            return false;
          } else {
            return true;
          }
    } else {
      return false;
    } 
  }

  canLeave(): Boolean {
    if (this.loggedIn() &&
        this.championshipService.isJoined() &&
        this.inInscription()) {
          return true;
    } else {
      return false;
    }
  }
  
  getTypePositions() {
    if (this.championshipService.getChampionship()) {
      switch (this.championshipService.getChampionship().numMaxTeams) {
        case '4': return this.position4;
        case '8': return this.position8;
        case '16': return this.position16;
        case '32': return this.position32;
      }
    }
  }

  getNavLinksChampionship() {
    return this.championshipService.getNavLinksChampionship();
  }

  inInscription() {
    if (this.championshipService.getChampionship()) {
      if (this.championshipService.getChampionship().state === 'Inscription') {
        return true
      }
      else return false;
    }
    else return false;
  }

  isCreator() {
    if (this.championshipService.getChampionship() && this.userService.getLoggeduser()) {
      if (this.championshipService.getChampionship().creatorUser === this.userService.getLoggeduser().username) return true;
      else return false;
    }
    else return false;
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
      width: '400px'
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

  leave() {
    this.championshipService.leftChampionship(this.championshipService.getChampionship().id.toString());
  }
}
