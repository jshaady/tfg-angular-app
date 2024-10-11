import { Component, OnInit, ContentChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { UserService } from "../../../services/user.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-users-list",
  templateUrl: "./users-list.component.html",
  styleUrls: ["./users-list.component.css"],
})
export class UsersListComponent implements OnInit {
  @ContentChild("paginator", { static: false }) paginator!: MatPaginator;

  displayedColumns: string[] = [
    "username",
    "email",
    "birthdate",
    "phone",
    "delete",
  ];
  confirmDeleteUsername: string | null = null;

  formModel: FormGroup | undefined;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.userService.searchUsersList();
    this.formModel = this.fb.group({
      nameOrEmail: [null],
    });
  }

  searchByFilter(filterValue: string): void {
    if (this.userService.getUserSearchNameOrEmail() !== filterValue) {
      this.userService.getUserListPageOptions().pageIndex = 0;
      this.userService.setUserSearchNameOrEmail(
        filterValue !== null && filterValue.trim().length !== 0
          ? filterValue
          : null
      );
      this.userService.searchUsersList();
    }
  }

  goToUserProfile(username: string): void {
    this.router.navigate(["/user/" + username]);
  }

  getDataSource(): any {
    return this.userService.getDataSource();
  }

  changePage(event: any): void {
    this.userService.setUserListPageOptions(event);
    this.userService.searchUsersList();
  }

  getUserListPageOptions(): any {
    return this.userService.getUserListPageOptions();
  }

  getUserSearchNameOrEmail(): string | null {
    return this.userService.getUserSearchNameOrEmail();
  }

  selectForDelete(username: string): void {
    this.confirmDeleteUsername = username;
  }

  checkDelete(username: string): Boolean {
    if (username === this.confirmDeleteUsername) {
      return true;
    } else {
      return false;
    }
  }

  deleteUser(username: string): void {
    this.userService.setIsSaving(true);
    this.userService.deleteUser(username);
  }

  cancelDelete(): void {
    this.confirmDeleteUsername = null;
  }

  getIsSaving(): Boolean {
    return this.userService.getIsSaving();
  }
}
