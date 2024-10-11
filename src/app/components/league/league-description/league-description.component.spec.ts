import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { LeagueDescriptionComponent } from "./league-description.component";

describe("LeagueDescriptionComponent", () => {
  let component: LeagueDescriptionComponent;
  let fixture: ComponentFixture<LeagueDescriptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LeagueDescriptionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeagueDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
