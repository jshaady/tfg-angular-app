import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagueClasificationComponent } from './league-clasification.component';

describe('LeagueClasificationComponent', () => {
  let component: LeagueClasificationComponent;
  let fixture: ComponentFixture<LeagueClasificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeagueClasificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeagueClasificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
