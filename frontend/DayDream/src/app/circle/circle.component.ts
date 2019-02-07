import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CircleService } from '../services/circle.service';
import { Circle } from '../models/circle.model';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { DayDream } from '../models/daydream.model';

@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.scss']
})
export class CircleComponent implements OnInit {

  @Input('childCircle') cir: Circle;
  @Output() returnToParent = new EventEmitter<string>();

  /* myCircle object of Circle */
  myCircle: Circle;
  dayDreams: DayDream[]

  /* variables used in editing circle name*/
  renderComponent: string;
  chosenCircle: Circle;

  constructor(  private route: ActivatedRoute,
    private circleService:CircleService, private _router: Router) { 
      this.dayDreams = [];
    }


  ngOnInit() {

    /* grabs url and finds parameter 'id' */
    var id = this.route.snapshot.params['id'];

    /* circleService calls getAllCircleInfo of specified ID 
    * result is passed into data
    * 
    * Circle model gets data and passes it to myCircle
    */

    this.circleService.getAllCircleInfo(id).then((data) => {
      this.circleService.getDayDreamsInCircle(id).then((daydreams) => {
        this.myCircle = new Circle(data);
        let i:number;
        for(i = 0; i < daydreams.length; i+=1) {
          let dd = new DayDream(daydreams[i])
          console.log(dd)
          this.dayDreams[i] = dd;
       }
        console.log(this.dayDreams);
      }).catch((err) => {
        console.log(err)
      })
    });
  }

  /* 
  *   Method that deletes a circle and redirects back to the homepage
  */
  delCir(circle:Circle) {

    // call delete method from service
    var confirm = window.confirm('Are you sure you want to remove this circle. This action cannot be undone')
    if (confirm == false) {
      return
    }
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

  back() {
    this._router.navigate(['/home']);

  }
}
