import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { UserNextEventsComponent } from "./user-next-events.component";

describe("UserNextEventsComponent", () => {
  let component: UserNextEventsComponent;
  let fixture: ComponentFixture<UserNextEventsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserNextEventsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNextEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
