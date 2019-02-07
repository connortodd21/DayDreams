import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CircleService } from '../services/circle.service';
import { Circle } from '../models/circle.model';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';

@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.scss']
})
export class CircleComponent implements OnInit {

  @Input('childCircle') cir: Circle;
  @Output() returnToParent = new EventEmitter<string>();

  /* myCircle object of Circle */
  myCircle:Circle;

  /* variables used in editing circle name*/
  renderComponent: string;
  chosenCircle: Circle;

  constructor(  private route: ActivatedRoute,
    private circleService:CircleService, private _router: Router) { }

  ngOnInit() {

    /* grabs url and finds parameter 'id' */
    var id = this.route.snapshot.params['id'];

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

  /* 
  *   Method that deletes a circle and redirects back to the homepage
  */
  delCir(circle:Circle) {
    // call delete method from service
    var id = this.route.snapshot.params['id'];
    this.circleService.deleteChosenCircle(id).then((data) => {
      this.myCircle = new Circle(data);
      console.log("Deleting Circle");
    })

    //navigate back to page
    this._router.navigate(['/home']);
  }


// renderEditCircleName(circle: Circle) {
   renderEditCircleName() {
    this._router.navigate(['/edit-name/' + this.myCircle.ID]);

    // this.chosenCircle = circle;
    // console.log(this.chosenCircle);
  }

  getChildEvent(event: string) {
    this.returnToParent.emit('reload');
  }
}
