import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CircleService } from '../../services/circle.service';
import { Circle } from '../../models/circle.model';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { NgForm, FormGroup, FormBuilder, Validators, Form } from "@angular/forms";
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';


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

  myCircle: Circle = {founder: null, circleName: null, members: null, dateCreated: null, numberOfPeople: null, dayDreams: null, chat: null, imageUrl: null, ID: null, description: null};
  constructor(private route: ActivatedRoute, private circleService: CircleService, private _router: Router, private formBuilder: FormBuilder) { }
  editCircleForm: FormGroup;
  submitted = false;
  response: string = "NULL";


  ngOnInit() {
    this.editCircleForm = this.formBuilder.group({
      circleName: ['', Validators.required]
    })

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

  get form() { return this.editCircleForm.controls }
  
  get response_msg() { return this.response }

  get circle() { return this.myCircle }

  sendEdits(form: NgForm) {
    // console.log("cirName: " + this.cirName);
    // myCircle.circleName = this.cirName;

    // console.log("myCircle.circleName: " + myCircle.circleName);

    this.submitted = true;
    if (this.editCircleForm.invalid) {
      console.log(this.editCircleForm);
      return;
    }


    this.circleService.editCircleName(form.value.circleName, this.myCircle.ID).subscribe((response) => {
      console.log(response);
      this._router.navigate(['/circle/' + this.myCircle.ID]);
      this.response = "complete";
    },
      (err) => {
        console.log(err)
        this.response = "fatalError";
      })

  }

  cancelEdits() {
    var id = this.route.snapshot.params['id'];
    this._router.navigate(['/circle/' + this.myCircle.ID]);
    // this.returnToParent.emit('dash');
  }
}
