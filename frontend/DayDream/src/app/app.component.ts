import { Component } from '@angular/core';
import { AuthService } from "./services/auth.service";
import { Router, UrlSerializer } from "@angular/router";
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DayDream';
  userAuthed: boolean;
  private loggedIn = new BehaviorSubject<boolean>(false); // {1}


  constructor(private router: Router, public authService: AuthService) { }

  get auth() { return this.userAuthed }

  logout() {
    this.userAuthed = false;
    this.authService.logout()
  }

  ngOnInit() {
    this.userAuthed = true
    this.authService.autoAuthUser();
  }
}
