import { Component, OnInit } from '@angular/core';
import { CircleService } from '../services/circle.service';
import { Circle } from '../models/circle.model';



@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.scss']
})
export class CircleComponent implements OnInit {

  //Circle:Object;

  /* myCircle object of Circle */
  myCircle:Circle;

  constructor(private circleService:CircleService) { }

  ngOnInit() {
    
    var id = "5c5b38e57b938841c9d8ad04"
    /*
    this.circleService.getAllCircleInfo(id).then((circle) => {
      console.log(circle);
      this.Circle = circle
    })*/

    /* circleService calls getAllCircleInfo of specified ID 
    * result is passed into data
    * 
    * Circle model gets data and passes it to myCircle
    */

    this.circleService.getAllCircleInfo(id).then((data) => {
      this.myCircle = new Circle(data);
      console.log(this.myCircle);
    });
  }
}
