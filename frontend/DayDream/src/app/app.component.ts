import { Component } from '@angular/core';
import { AuthService } from "./services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DayDream';

  constructor(private router:Router, public authService: AuthService, ) {}

  logout(){
    this.authService.logout()
  }
}
