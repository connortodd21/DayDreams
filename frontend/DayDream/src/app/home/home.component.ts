import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { NgForm, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CircleService } from '../services/circle.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  Circles: Object;
  fileForm: FormGroup;

  constructor(private userService:UserService, private circleService:CircleService ,private formBuilder: FormBuilder) { 
    this.fileForm = this.formBuilder.group({
      imageUrl: ['', Validators.required],
      image_id: ['', Validators.required]
  });
  }

  ngOnInit() {
    this.displayCircles();
  }

  displayCircles(){
    this.userService.getUserCircles().then((circ) => {
      this.Circles = circ
    })
  }

  submitFile(event, circleName:string){
    this.circleService.uploadPhoto(event.value.imageUrl, circleName).then((res) => {
      console.log(res)
      this.displayCircles()
    })
  }

}
