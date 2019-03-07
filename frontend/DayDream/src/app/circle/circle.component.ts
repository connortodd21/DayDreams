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

/**
 * Circle Page Component
 */
export class CircleComponent implements OnInit {

  @Input('childCircle') cir: Circle;
  @Output() returnToParent = new EventEmitter<string>();

  // Circle object
  myCircle: Circle;
  // Create new DayDream form
  createForm: FormGroup;
  // Add user to circle form
  addUserForm: FormGroup;
  dayDreams: DayDream[]
  memories: DayDream[]
  submitted = false;
  show = false;
  response: string = "NULL";
  messages: Array<Object>

  /* variables used in editing circle name*/
  renderComponent: string;
  chosenCircle: Circle;

  constructor(private route: ActivatedRoute,
    private circleService: CircleService, private DaydreamService: DaydreamService, private formBuilder: FormBuilder, private _router: Router) {
    this.dayDreams = [];
    this.messages = []
    this.memories = []
    
  }

  /**
   * Init function
   */
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
        // console.log(err)
        this._router.navigate(['/not-found']);
      }).then(() => {
        this.circleService.getMemories(id).then((memories: []) => {
          let i: number;
          for (i = 0; i < memories.length; i += 1) {
            let dd = new DayDream(memories[i])
            console.log(dd)
            this.memories[i] = dd;
          }
        })
      })
    });

    // Form values and validators for create new DayDream
    this.createForm = this.formBuilder.group({
      destination: ['', Validators.required],
      description: ['', Validators.required],
      totalCost: ['', [Validators.required, Validators.pattern("[+-]?[0-9][0-9]*")]],
    });

    // Form values and validators for create new DayDream
    this.addUserForm = this.formBuilder.group({
      username: ['', Validators.required]
    });
  }

  /**
   * Get all messages for a circle
   */
  getMessages() {
    
    this.circleService.getMessages(this.myCircle.ID).then((messages) => {
      // this.messages = messages;
      console.log(messages)
      var i: number = 0
      messages.forEach(element => {
        console.log(element)
        this.messages[i] = element
        i++;
      });
      console.log(this.messages)
    });
  }

  /**
   * Add a message to a circle
   * @param event Event to parse input from
   */
  addMessage(event) {
    this.circleService.addMessage(event, this.myCircle.ID).then(() => {
      this.getMessages()
    });
  }

  /**
   * Method that deletes a circle and redirects back to the homepage
   * @param circle Circle to be deleted
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

  // Get create DayDream form
  get form_create() { return this.createForm.controls }

  // Get add user form
  get form_add_user() { return this.addUserForm.controls }

  // Get form respone for toasts
  get reponse() { return this.response }


  /**
   * Navigates to edit circle page 
   */
  renderEditCircleName() {
    this._router.navigate(['/edit-name/' + this.myCircle.ID]);

    // this.chosenCircle = circle;
    // console.log(this.chosenCircle);
  }

  /**
   * Navigate to selected DayDream 
   * @param daydream DayDream to be rendered
   */
  renderDayDream(daydream: DayDream) {
    console.log(daydream)
    this.circleService.setCircleUrl('/circle/' + this.myCircle.ID)
    localStorage.setItem('circle', this.myCircle.ID)
    this._router.navigate(['/daydream/' + daydream.ID])
  }

  leaveCircle(){
    let username = localStorage.getItem('username')
    this.circleService.leaveCircle(this.myCircle.ID, username).then(() => {
      var confirm = window.confirm('Are you sure you want to leave this circle. To return, you must be added back by someone')
      if (confirm == false) {
        return
      }
      this._router.navigate(['/home'])
    })
  }

/**
 * Adds user to current circle 
 * @param event Event to parse user addition
 */
  addUser(event) {

    this.submitted = true;
    // Check if form is missing values. If true, then return.
    if (this.addUserForm.invalid) {
      console.log(event);
      return;
    }

    // Backend api call
    this.circleService.addUser(this.myCircle.ID, event.value.username).then(() => {
      this.circleService.getAllCircleInfo(this.myCircle.ID).then((c) => {
        console.log(c);
        window.location.replace("/circle/" + this.myCircle.ID);
      })
    }).catch(e => {
      console.log(e.error.message);
      // Duplicate user
      if (e.error.message == "User is already in circle") {
        this.response = "Dup";
      }
      // User cannot be found
      else if (e.error.message == "Username does not exist") {
        this.response = "NoUser";
      }
      // Fatal error
      else {
        this.response = "fatalError";
      }
    });
  }

  /**
   * Get child event 
   * @param event Event passed
   */
  getChildEvent(event: string) { this.returnToParent.emit('reload'); }

  /**
   * Naviage to home
   */
  back() { this._router.navigate(['/home']); }

  /**
   * Creates new DayDream 
   * @param event Event to parse form data from
   */
  submitFile(event) {
    this.submitted = true;
    // Check if form is missing values. If true, then return.
    if (this.createForm.invalid) {
      console.log(this.createForm);
      return;
    }

    // Backend api call
    this.DaydreamService.createDaydream(this.myCircle.ID, event.value.destination, event.value.description, event.value.totalCost).then(() => {
      var confirm = window.alert('Daydream ' + event.value.destination + ' Created!')
      console.log(confirm);
      window.location.replace("/circle/" + this.myCircle.ID);
    }).catch(e => {
      console.log(e);
      console.log(this.myCircle.ID);
    });
  }

  /**
   * Resets all values for the form when the cancel button is invoked
   */
  cancel() { 
    this.createForm.reset();
    this.addUserForm.reset();
    this.submitted = false;
    console.log("reset");
  }
}
