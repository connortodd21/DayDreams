import { Component, OnInit } from '@angular/core';
import { CircleService } from '../services/circle.service';
import { Circle } from '../models/circle.model';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';




@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.scss']
})
export class CircleComponent implements OnInit {
  

  //Circle:Object;

  /* myCircle object of Circle */
  myCircle:Circle;

  constructor(    private route: ActivatedRoute,
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

//   renderCircle(circle:Circle){
//     /* Navigate to /circle/id */
//     this._router.navigate(['/circle/' + circle.ID]);
// }
  
  delCir(circle:Circle) {
    // call delete method from service
    var confirm = window.confirm('Are you sure you want to remove this circle. This action cannot be undone')
    if(confirm == false){
      return
    }
    var id = this.route.snapshot.params['id'];
    this.circleService.deleteChosenCircle(id).then((data) => {
      this.myCircle = new Circle(data);
      console.log("Deleting Circle");
    })

    //navigate back to home page
    this._router.navigate(['/home']);
  }

  back(){
    this._router.navigate(['/home']);
  }
}
