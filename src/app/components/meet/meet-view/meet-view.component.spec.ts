import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetViewComponent } from './meet-view.component';

describe('MeetViewComponent', () => {
  let component: MeetViewComponent;
  let fixture: ComponentFixture<MeetViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
