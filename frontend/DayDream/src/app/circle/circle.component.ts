import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CircleService } from '../services/circle.service';
import { Circle } from '../models/circle.model';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { DayDream } from '../models/daydream.model';
import { DaydreamService } from '../services/daydream.service'

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
  createForm: FormGroup;
  addUserForm: FormGroup;
  dayDreams: DayDream[]
  submitted = false;
  response: string = "NULL";
  messages: Array<Object>

  /* variables used in editing circle name*/
  renderComponent: string;
  chosenCircle: Circle;

  constructor(private route: ActivatedRoute,
    private circleService: CircleService, private DaydreamService: DaydreamService, private formBuilder: FormBuilder, private _router: Router) {
    this.dayDreams = [];
    this.messages = []
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
      this.circleService.getDayDreamsInCircle(id).then((daydreams: []) => {
        this.myCircle = new Circle(data);
        let i: number;
        for (i = 0; i < daydreams.length; i += 1) {
          let dd = new DayDream(daydreams[i])
          console.log(dd)
          this.dayDreams[i] = dd;
        }
        console.log(this.dayDreams);
      }).catch((err) => {
        console.log(err)
      })
    });

    this.createForm = this.formBuilder.group({
      destination: ['', Validators.required],
      description: ['', Validators.required],
      totalCost: ['', [Validators.required, Validators.pattern("[+-]?[0-9][0-9]*")]],
    });

    this.addUserForm = this.formBuilder.group({
      username: ['', Validators.required]
    })
  }

  getMessages(){
    this.circleService.getMessages(this.myCircle.ID).then((messages) => {
      // this.messages = messages;
      console.log(messages)
      var i:number = 0
      messages.forEach(element => {
        console.log(element)
        this.messages[i] = element
        i++;
      })
      console.log(this.messages)
    })
  }

  addMessage(event){
    this.circleService.addMessage(event, this.myCircle.ID).then(() => {
      this.getMessages()
    })
  }

  /*
  *   Method that deletes a circle and redirects back to the homepage
  */
  delCir(circle: Circle) {

    // call delete method from service
    var confirm = window.confirm('Are you sure you want to remove this circle?s This action cannot be undone')
    if (confirm == false) {
      return
    }
    var id = this.route.snapshot.params['id'];
    this.circleService.deleteChosenCircle(id).then((data) => {
      this.myCircle = new Circle(data);
      console.log("Deleting Circle");
      //navigate back to page
      this._router.navigate(['/home']);
    })


  }

  get form_create() { return this.createForm.controls }

  get form_add_user() { return this.addUserForm.controls }

  get reponse() { return this.response }

  // renderEditCircleName(circle: Circle) {
  renderEditCircleName() {
    this._router.navigate(['/edit-name/' + this.myCircle.ID]);

    // this.chosenCircle = circle;
    // console.log(this.chosenCircle);
  }

  renderDayDream(daydream: DayDream) {
    console.log(daydream)
    this.circleService.setCircleUrl('/circle/' + this.myCircle.ID)
    this._router.navigate(['/daydream/' + daydream.ID])
  }

  addUser(event) {
    this.submitted = true;
    if (this.addUserForm.invalid) {
      console.log(event);
      return;
    }
    this.circleService.addUser(this.myCircle.ID, event.value.username).then(() => {
      this.circleService.getAllCircleInfo(this.myCircle.ID).then((c) => {
        console.log(c);

        window.location.replace("/circle/" + this.myCircle.ID);
      })
    }).catch(e => {
      console.log(e.error.message);
      if (e.error.message == "User is already in circle") {
        this.response = "Dup";
      }
      else if (e.error.message == "Username does not exist") {
        this.response = "NoUser";
      }
      else {
        this.response = "fatalError";
      }
    })
  }

  getChildEvent(event: string) { this.returnToParent.emit('reload'); }

  back() { this._router.navigate(['/home']); }

  submitFile(event) {
    console.log(event.value)
    console.log(this.myCircle.ID);
    this.submitted = true;

    if (this.createForm.invalid) {
      console.log(this.createForm);
      return;
    }

    this.DaydreamService.createDaydream(this.myCircle.ID, event.value.destination, event.value.description, event.value.totalCost).then(() => {
      var confirm = window.alert('Daydream ' + event.value.destination + ' Created!')
      console.log(confirm);
      window.location.replace("/circle/" + this.myCircle.ID);
    }).catch(e => {
      console.log(e);
      console.log(this.myCircle.ID);
    });
  }
}
