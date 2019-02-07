import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { NgForm, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CircleService } from '../services/circle.service';
import { Circle } from '../models/circle.model';
import { Router } from '@angular/router'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  myCircles: Circle[];
  fileForm: FormGroup;
  image: string;

  constructor(private userService: UserService, private circleService: CircleService, private formBuilder: FormBuilder, private _router: Router) {
    this.fileForm = this.formBuilder.group({
      imageUrl: ['', Validators.required],
      image_id: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.displayCircles();
  }

  renderCircle(circle:Circle){
      /* Navigate to /circle/id  */
      this._router.navigate(['/circle/' + circle.ID]);
  }

  displayCircles() {
    this.userService.getUserCircles().then((data) => {
      
      let i:number;

      let response = [];
      response.push(data);

      this.myCircles = new Array(response[0].length)

      for(i = 0; i< response[0].length; i+=1) {
          let circle = new Circle(response[0][i])
          this.myCircles[i] = circle;
       }

       console.log(this.myCircles)

       console.log(response);
    })
  }

  submitFile(event, circleName: string) {
    this.circleService.uploadPhoto(event.value.imageUrl, circleName).then((res) => {
      console.log(res)
      this.displayCircles()
    })
  }

}
