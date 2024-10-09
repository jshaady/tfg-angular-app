import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamsComponents } from './teams.component';

describe('TeamsComponents', () => {
  let component: TeamsComponents;
  let fixture: ComponentFixture<TeamsComponents>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamsComponents ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamsComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
