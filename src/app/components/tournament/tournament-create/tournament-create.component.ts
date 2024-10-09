import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, NgForm, FormGroupDirective } from '@angular/forms';
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
  selector: 'app-tournament-create',
  templateUrl: './tournament-create.component.html',
  styleUrls: ['./tournament-create.component.css']
})
export class TournamentCreateComponent implements OnInit {

  matcher = new MyErrorStateMatcher();

  numParticipants: string[] = ['4', '8', '16', '32'];
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

  constructor(private fb: FormBuilder,
              private championshipService: ChampionshipService ) { }

  ngOnInit() { 
    this.championshipService.setCreateErrorEmpty();
  }

  onSubmit(): void {
    this.championshipService.setIsSaving(true);
    let body = {
      championshipName : this.formModel.value.ChampionshipName,
      location: this.formModel.value.Location,
      numMax: this.formModel.value.NumMax,
      description: this.formModel.value.Description,
      startInscription: new Date(),
      endInscription: this.formModel.value.InscriptionFinal,
      startChampionship: this.formModel.value.ChampionshipInit,
      sport: this.formModel.value.Sport,
      type: 'Tournament',
      currentDate: new Date()
    }
    this.championshipService.createChampionship(body, this.formModel);
  }

  isSaving(): Boolean {
    return this.championshipService.getIsSaving();
  }

  focusOut(location: string): void {
    this.formModel.get('Location').setValue(location);
  }

  getErrors(): any {
    return this.championshipService.getCreateErrors();
  }

  previousState(): void { 
    window.history.back();
  }

}
