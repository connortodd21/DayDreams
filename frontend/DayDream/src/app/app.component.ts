import { Component } from '@angular/core';
import { AuthService } from "./services/auth.service";
import { UserService } from "./services/user.service"
import { Router, UrlSerializer } from "@angular/router";
import { BehaviorSubject } from 'rxjs';
import { Account } from './models/account.model'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DayDream';
  userAuthed: Boolean;
  account: Account;
  username: String = "{{username}}";
  private loggedIn = new BehaviorSubject<boolean>(false); // {1}


  constructor(private router: Router, public authService: AuthService, public userService: UserService) { }

  get auth() { return (!localStorage.getItem('token')) }

  logout() {
    this.userAuthed = false;
    this.authService.logout()
  }

  ngOnInit() {
    if(this.authService.autoAuthUser()){
      this.userAuthed = true;
      this.userService.getAccountInfo().then((res) => {
        this.account = new Account(res);
        // this.username = this.account.username; // defect 4
    });
    }
  }
}
