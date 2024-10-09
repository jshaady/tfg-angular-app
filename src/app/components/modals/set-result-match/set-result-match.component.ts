import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { ChampionshipService } from 'src/app/services/championship.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-set-result-match',
  templateUrl: './set-result-match.component.html',
  styleUrls: ['./set-result-match.component.css']
})
export class SetResultMatchComponent implements OnInit {

  data: any;
  onAdd = new EventEmitter();

  constructor(private fb: FormBuilder,
              private championshipService: ChampionshipService,
              @Inject(MAT_DIALOG_DATA) data) {
    this.data = data;
  }

  ngOnInit() { }

  formModel = this.fb.group({
    MatchResult1: [null, Validators.required],
    MatchResult2: [null, Validators.required]
  });

  setResult(){
    const body = {
      idChampionship: this.data.idChampionship,
      team1: this.data.team1,
      team2: this.data.team2,
      matchResult1: this.formModel.value.MatchResult1,
      matchResult2: this.formModel.value.MatchResult2
    }
    this.championshipService.setResult(body, this.onAdd);
  }

  getError(){
    return this.championshipService.getErrorSetResult();
  }

}
