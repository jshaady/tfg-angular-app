import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentDescriptionComponent } from './tournament-description.component';

describe('TournamentDescriptionComponent', () => {
  let component: TournamentDescriptionComponent;
  let fixture: ComponentFixture<TournamentDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TournamentDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
