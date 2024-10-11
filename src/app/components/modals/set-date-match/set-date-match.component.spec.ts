import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { SetDateMatchComponent } from "./set-date-match.component";

describe("SetDateMatchComponent", () => {
  let component: SetDateMatchComponent;
  let fixture: ComponentFixture<SetDateMatchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SetDateMatchComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetDateMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
