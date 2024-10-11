import { Component, OnInit, ContentChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MeetService } from "../../../services/meet.service";
import { MatPaginator } from "@angular/material/paginator";
import { Router } from "@angular/router";
import { UserService } from "../../../services/user.service";

@Component({
  selector: "app-meets",
  templateUrl: "./meets.component.html",
  styleUrls: ["./meets.component.css"],
})
export class MeetsComponent implements OnInit {
  formModel: FormGroup | undefined;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private meetService: MeetService,
    private router: Router
  ) {}

  @ContentChild("paginator", { static: false }) paginator:
    | MatPaginator
    | undefined;

  displayedColumns: string[] = [
    "name",
    "date",
    "sport",
    "participants",
    "location",
  ];

  ngOnInit() {
    this.formModel = this.fb.group({
      Location: [null],
    });
  }

  ngOnDestroy() {
    this.meetService.setTableVisible(false);
    this.meetService.setDataSource(false);
  }

  onSubmit(): void {
    this.meetService.searchMeets();
  }

  getDataSource(): any {
    return this.meetService.getDataSource();
  }

  getRecord(row: any): void {
    this.router.navigate(["/meet", row.id]);
  }

  focusOut(location: string): void {
    this.meetService.setLocation(location);
  }

  changePage(event: any): void {
    this.meetService.setMeetsPageOptions(event);
    this.meetService.searchMeets();
  }

  loggedIn(): Boolean {
    return this.userService.loggedIn();
  }

  isTableVisible(): Boolean {
    return this.meetService.isTableVisible();
  }

  getMeetsPageOptions(): any {
    return this.meetService.getMeetsPageOptions();
  }
}
