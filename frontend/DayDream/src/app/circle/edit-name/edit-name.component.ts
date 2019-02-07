import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CircleService } from '../../services/circle.service';
import { Circle } from '../../models/circle.model';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';


@Component({
  selector: 'app-edit-name',
  templateUrl: './edit-name.component.html',
  styleUrls: ['./edit-name.component.scss']
})
export class EditNameComponent implements OnInit {
  /*
  @Input('childCircle') cir: Circle;
  @Output() returnToParent = new EventEmitter<string>();
*/

  myCircle:Circle;
  constructor(private route: ActivatedRoute, private circleService:CircleService, private _router: Router) { }
  cirName: '';
  
  sendEdits(cir) {
    this.circleService.editCircleName(this.cirName)
    .subscribe ((response) => {
      console.log(response);
       this._router.navigate(['/circle/' + this.myCircle.ID]);
    },
    (err) =>{
      console.log(err)
    })
    cir.circleName = this.cirName
  }

  cancelEdits(){
     var id = this.route.snapshot.params['id'];
     this._router.navigate(['/circle/' + this.myCircle.ID]);
    // this.returnToParent.emit('dash');
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
      this.myCircle = new Circle(data);
      console.log(this.myCircle);
    });
  }

}
