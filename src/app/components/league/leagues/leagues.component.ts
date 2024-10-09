import { Component, OnInit } from '@angular/core';
import { ChampionshipService } from 'src/app/services/championship.service';
import { UserService } from 'src/app/services/user.service';
import { IChampionship } from 'src/app/interfaces/ichampionship';
import { FormBuilder } from '@angular/forms';
import { IPaginate } from 'src/app/interfaces/ipaginate';

@Component({
  selector: 'app-leagues',
  templateUrl: './leagues.component.html',
  styleUrls: ['./leagues.component.css']
})
export class LeaguesComponent implements OnInit {

  formModel = this.fb.group({
    name: [null],
    location: [null]
  });

  constructor(private championshipService: ChampionshipService,
              private userService: UserService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.championshipService.setPage(1);
    this.championshipService.setSearchName(null);
    this.championshipService.setSearchLocation(null);
    this.championshipService.setSearchType('League');
    this.championshipService.searchChampionships();
  }

  getChampionships(): IChampionship[] {
    return this.championshipService.getChampionships();
  }

  getSearchSport(): string {
    return this.championshipService.getSearchSport();
  }

  getSporti18n(): any {
    return this.getSearchSport();
  }

  isAll(): Boolean {
    if (this.getSearchSport() == 'all')
      return true;
    else
      return false;
  }

  getSportImg(sport: string): string {
    switch (sport) {
      case 'football': return '../../../../assets/icons/football_white.png';
      case 'basketball': return '../../../../assets/icons/basketball_white.png';
      case 'tennis': return '../../../../assets/icons/tenis1_white.png';
      case 'lol': return '../../../../assets/icons/lol_white.png';
      case 'csgo': return '../../../../assets/icons/csgo_white.png';
    }
  }

  isCsgo(sport: string): Boolean {
    if (sport == 'csgo') {
      return true;
    } else {
      return false;
    }
  }

  isAnotherSport(sport: string): Boolean {
    if (sport !== 'football' &&
        sport !== 'basketball' &&
        sport !== 'tennis' &&
        sport !== 'tennis' &&
        sport !== 'lol' &&
        sport !== 'csgo' ) {
          return true;
    } else {
      return false;
    }
  }

  loggedIn(): Boolean {
    return this.userService.loggedIn();
  }

  onSearch() {
    this.championshipService.setSearchName(this.formModel.get('name').value !== null && this.formModel.get('name').value.trim().length !== 0 ?
                                            this.formModel.get('name').value.trim() : null);
    this.championshipService.setSearchLocation(this.formModel.get('location').value !== null && this.formModel.get('location').value.trim().length !== 0 ? 
                                                this.formModel.get('location').value.trim() : null);
    this.championshipService.searchChampionships();
  }

  getPaginate(): IPaginate {
    return this.championshipService.getPaginate();
  }

  getCurrentPage(): number {
    return this.championshipService.getPage();
  }

  loadPage(page: number) {
    if (page !== this.getCurrentPage()) {
      this.championshipService.setPage(page);
      this.championshipService.searchChampionships();
    }
  }

  focusOut(location: string): void {
    this.formModel.get('location').setValue(location);
  }

  maxSizeController(string: string, maxSize: number): string {
    if (string.length > maxSize) {
      return string.substring(0, maxSize - 3) + '...';
    } else {
      return string;
    }
  }

}
