import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SportBarComponent } from './sport-bar.component';

describe('SportBarComponent', () => {
  let component: SportBarComponent;
  let fixture: ComponentFixture<SportBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SportBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SportBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
