import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  Circles: Object;

  constructor(private subService:UserService) { 

  }

  ngOnInit() {
    this.displayCircles();
  }

  displayCircles(){
    this.subService.getUserCircles().then((circ) => {
      this.Circles = circ
    })
  }

}
