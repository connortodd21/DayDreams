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
/**
 * Home Page Component
 */
export class HomeComponent implements OnInit {

  myCircles: Circle[];
  fileForm: FormGroup;
  image: string;
  submitted = false;

  constructor(private userService: UserService, private circleService: CircleService, private formBuilder: FormBuilder, private _router: Router) {}

  /**
   * Init function
   */
  ngOnInit() {
    // Displays all user circles
    this.displayCircles();

    // Form inputs and validators
    this.fileForm = this.formBuilder.group({
      imageUrl: [''],
      circleDesc: ['', Validators.required],
      circleName: ['', Validators.required],
    })
  }

  /**
   * Pass form to html component
   */
  get form() { return this.fileForm.controls; }

  /**
   * Navigates to a circle 
   * @param circle Circle to navigate to
   */
  renderCircle(circle: Circle) {
    /* Navigate to /circle/id  */
    this._router.navigate(['/circle/' + circle.ID]);
  }

  /**
   * Displays all user circles
   */
  displayCircles() {
    this.userService.getUserCircles().then((data) => {

      let i: number;

      let response = [];
      response.push(data);

      this.myCircles = new Array(response[0].length)

      for (i = 0; i < response[0].length; i += 1) {
        let circle = new Circle(response[0][i])
        if (circle.circleName.length > 18) {
          circle.circleName = circle.circleName.substring(0, 20) + '...'
        }
        this.myCircles[i] = circle;
      }
    });
  }

  /**
   * Creates a circle 
   * @param form Submission form for creating a circle
   */
  submitFile(form: NgForm) {
    this.submitted = true;
    if (this.fileForm.invalid) {
      console.log(form);
      return;
    }

    // backend call
    this.circleService.createCircle(form.value.circleName, form.value.circleDesc, form.value.imageUrl).then(() => {
      var confirm = window.alert('Circle ' + form.value.circleName + ' Created!')
      window.location.replace("/home")
      console.log(confirm)
      // this._router.navigate(['/edit-name']);
    })
  }
}
