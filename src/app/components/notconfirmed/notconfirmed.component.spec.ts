import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { NotconfirmedComponent } from "./notconfirmed.component";

describe("NotconfirmedComponent", () => {
  let component: NotconfirmedComponent;
  let fixture: ComponentFixture<NotconfirmedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NotconfirmedComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotconfirmedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
