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
    this.authService.logout()
  }

  ngOnInit() {
    this.userAuthed = this.authService.getAuthenticationStatus()
    // this.loggedIn = this.authService.getAuthStatObservible()
    console.log("auth is:" + this.userAuthed)
    const ex = this.authService.getAuthData()
    console.log(this.authService.getAuthData())
    const now = new Date();
    const expirationDate = new Date(now.getTime())
    console.log(expirationDate)
    if(expirationDate > ex['expirationDate']){
      this.logout()
    }
  }
}
