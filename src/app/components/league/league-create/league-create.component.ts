import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, NgForm, FormGroupDirective, FormControl } from '@angular/forms';
import { ChampionshipService } from 'src/app/services/championship.service';
import { ErrorStateMatcher } from '@angular/material/core';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-league-create',
  templateUrl: './league-create.component.html',
  styleUrls: ['./league-create.component.css']
})
export class LeagueCreateComponent implements OnInit {

  matcher = new MyErrorStateMatcher();

  numParticipants: string[] = ['4', '10', '20'];
  sports: string[] = ['football', 'basketball', 'tennis', 'csgo', 'lol'];
  otherSport: Boolean = false;

  formModel = this.fb.group({
    ChampionshipName: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(60)]],
    Location: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
    Description: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(512)]],
    NumMax: [null, [Validators.required]],
    InscriptionFinal: [null, [Validators.required]],
    ChampionshipInit: [null, [Validators.required]],
    Sport: [null, [Validators.required]]
  });

  constructor(private championshipService: ChampionshipService,
              private fb: FormBuilder ) { }

  ngOnInit() {
    this.championshipService.setCreateErrorEmpty();
   }

  onSubmit(): void {
    this.championshipService.setIsSaving(true);
    let body = {
      championshipName : this.formModel.value.ChampionshipName ? this.formModel.value.ChampionshipName.trim() : null,
      location: this.formModel.value.Location ? this.formModel.value.Location.trim() : null,
      numMax: this.formModel.value.NumMax,
      description: this.formModel.value.Description ? this.formModel.value.Description.trim() : null,
      startInscription: new Date(),
      endInscription: this.formModel.value.InscriptionFinal,
      startChampionship: this.formModel.value.ChampionshipInit,
      sport: this.formModel.value.Sport,
      type: 'League',
      currentDate: new Date()
    }
    this.championshipService.createChampionship(body, this.formModel);
  }

  getErrors(): any {
    return this.championshipService.getCreateErrors();
  }

  focusOut(location: string): void {
    this.formModel.get('Location').setValue(location);
  }

  isSaving(): Boolean {
    return this.championshipService.getIsSaving();
  }

  previousState(): void { 
    window.history.back();
  }

}
