import { Component, OnInit } from "@angular/core";
import { UserService } from "../../services/user.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  constructor(private userService: UserService) {}

  ngOnInit() {}

  getLoggedUser() {
    return this.userService.getLoggeduser();
  }

  setActiveEvent(type: string) {
    this.userService.getEventsInfo().filter((event: any) => {
      return event.label === type;
    })[0].open = true;
  }
}
