import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinChampionshipComponent } from './join-championship.component';

describe('JoinChampionshipComponent', () => {
  let component: JoinChampionshipComponent;
  let fixture: ComponentFixture<JoinChampionshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinChampionshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinChampionshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
