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
  image: string;

  constructor(private userService: UserService, private circleService: CircleService, private formBuilder: FormBuilder) {
    this.fileForm = this.formBuilder.group({
      imageUrl: ['', Validators.required],
      image_id: ['', Validators.required]
    });
    this.image = 'https://i.pinimg.com/236x/c5/be/c1/c5bec1075ad6fc292c655c6f8364b5b0--facebook-profile-profile-pictures.jpg'
  }

  ngOnInit() {
    this.displayCircles();
  }

  displayCircles() {
    this.userService.getUserCircles().then((circ) => {
      this.Circles = circ
      // console.log(circ[0].imageUrl)
      let i:number
      for(let c in circ){
        if(!circ[c].hasImage){
          circ[c].imageUrl = this.image
        }
      }
    })
  }

  submitFile(event, circleName: string) {
    this.circleService.uploadPhoto(event.value.imageUrl, circleName).then((res) => {
      console.log(res)
      this.displayCircles()
    })
  }

}
