import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetResultMatchComponent } from './set-result-match.component';

describe('SetResultMatchComponent', () => {
  let component: SetResultMatchComponent;
  let fixture: ComponentFixture<SetResultMatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetResultMatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetResultMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
