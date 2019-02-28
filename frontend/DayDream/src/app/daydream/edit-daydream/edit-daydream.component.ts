import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DaydreamService } from '../../services/daydream.service';
import { Circle } from '../../models/circle.model';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { NgForm, FormGroup, FormBuilder, Validators, Form } from "@angular/forms";
import { DayDream } from 'src/app/models/daydream.model';



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

  myDayDream: DayDream = { ID: null, destination: null, description: null, travelInformation: null, lodgingInformation: null, excursions: null, totalCost: null, individualContribution: null, completed: null };
  constructor(private route: ActivatedRoute, private DaydreamService: DaydreamService, private _router: Router, private formBuilder: FormBuilder) { }
  editDaydreamForm: FormGroup;
  submitted = false;
  response: string = "NULL";


  ngOnInit() {


    /* grabs url and finds parameter 'id' */
    var id = this.route.snapshot.params['id'];

    /* circleService calls getAllCircleInfo of specified ID
    * result is passed into data
    *
    * Circle model gets data and passes it to myCircle
    */

    this.DaydreamService.getAllDaydreamInfo(id).then((data) => {
      this.myDayDream = new DayDream(data);
      console.log(this.myDayDream);
      this.editDaydreamForm.controls.destination.setValue(this.myDayDream.destination);
      this.editDaydreamForm.controls.description.setValue(this.myDayDream.description);
      this.editDaydreamForm.controls.totalCost.setValue(this.myDayDream.totalCost);
    });

    this.editDaydreamForm = this.formBuilder.group({
      destination: [this.myDayDream.destination, Validators.required],
      description: [this.myDayDream.description, Validators.required],
      totalCost: [this.myDayDream.totalCost, Validators.required]
    });
  }

  get form() { return this.editDaydreamForm.controls }

  get response_msg() { return this.response }

  get circle() { return this.myDayDream }

/*  sendEdits(form: NgForm) {
    // console.log("cirName: " + this.cirName);
    // myCircle.circleName = this.cirName;

    // console.log("myCircle.circleName: " + myCircle.circleName);

    this.submitted = true;
    if (this.editDaydreamForm.invalid) {
      console.log("edit: " + form.value.imageUrl);
      return;
    }

    if (form.value.destination != this.myDayDream.destination) {
      this.DaydreamService.editDayDreamDest(form.value.destination, this.myDayDream.ID).subscribe((response) => {
        console.log(response);
        this.response = "complete";
      },
        (err) => {
          console.log(err);
          this.response = "fatalError";
        });
    }
    else {
      this.response = "noEdit";
    }

    if (form.value.description != this.description.description) {
      this.DaydreamService.editDayDreamDesc(form.value.description, this.myDayDream.ID).subscribe((response) => {
        console.log(response);
        this.response = "complete";
      }),
        (err) => {
          console.log(err);
          this.response = "fatalError";
        }
    }
    else {
      this.response = "noEdit";
    }

    if (form.value.totalCost != this.myDayDream.totalCost) {
      this.DaydreamService.editDayDreamCost(form.value.totalCost, this.myDayDream.ID).subscribe((response) => {
        console.log(response);
        this.response = "complete";
      }),
        (err) => {
          console.log("err is:" + err);
          this.response = "fatalError";
        }
    }
    else {
      this.response = "noEdit";
    }

    // this._router.navigate(['/circle/' + this.myCircle.ID]);
    window.location.replace("/daydream/" + this.myDayDream.ID)

  }*/

  cancelEdits() {
    var id = this.route.snapshot.params['id'];
    this._router.navigate(['/daydream/' + this.myDayDream.ID]);
    // this.returnToParent.emit('dash');
  }
}
