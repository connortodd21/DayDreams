import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CircleService } from '../services/circle.service';
import { DaydreamService } from '../services/daydream.service';
import { FormBuilder } from '@angular/forms';
import { DayDream } from '../models/daydream.model';

@Component({
  selector: 'app-daydream',
  templateUrl: './daydream.component.html',
  styleUrls: ['./daydream.component.scss']
})
export class DaydreamComponent implements OnInit {

  myDayDream: DayDream;
  lodgingInfo: Array<Object>
  travelInfo: Array<Object>
  excursionInfo: Array<Object>
  images: Array<Object>
  isMemory: Boolean;
  totalMoney: number
  moneyPercentage: number;
  contributions: Array<Object>
  colors: Array<string>
  transportationCost: number = 0
  excursionCost: number = 0
  lodgingCost: number = 0

  constructor(private route: ActivatedRoute,
    private circleService: CircleService, private DaydreamService: DaydreamService, private formBuilder: FormBuilder, private _router: Router) {
    this.images = []
    this.isMemory = false;
    this.lodgingInfo = []
    this.travelInfo = []

    this.contributions = []
    this.colors = []

    this.excursionInfo = [];

  }

  ngOnInit() {

    this.displayDaydream()

  }

  displayDaydream() {
    var id = this.route.snapshot.params['id'];
    this.DaydreamService.getAllDaydreamInfo(id).then((data) => {
      let i: number;
      let response = [];
      response.push(data);
      let daydream = new DayDream(response[0])
      this.myDayDream = daydream;
      this.isMemory = daydream.completed
      this.displayImages()
      this.displayLodging()
      this.displayTravel()

      this.getTotalContributions()
      this.getTransportationCost()
      this.getExcursionCost()
      this.getLodgingCost()

      this.displayExcursion()

    }).catch((err) => {
      this._router.navigate(['/not-found']);
    })
  }

  getTotalContributions() {
    this.DaydreamService.getTotalContribution(this.myDayDream.ID).then((total) => {
      if (!total[0]) {
        this.totalMoney = 0
        this.moneyPercentage = 0
        return
      }
      else {
        this.totalMoney = total[0].TotalBalance
      }
      var p = Math.floor(100 * (this.totalMoney / this.myDayDream.totalCost as number))
      if (p > 100) {
        p = 100;
      }
      this.moneyPercentage = p;
      // console.log(this.moneyPercentage)
    })
  }

  getTransportationCost() {
    this.DaydreamService.getTransportationSum(this.myDayDream.ID).then((total) => {
      if (!total[0]) {
        this.transportationCost = 0
        return
      }
      else {
        this.transportationCost = Math.floor(total[0].TotalBalance)
      }
    })
  }

  getLodgingCost() {
    this.DaydreamService.getLodgingSum(this.myDayDream.ID).then((total) => {
      if (!total[0]) {
        this.lodgingCost = 0
        return
      }
    })
  }

  getExcursionCost() {
    this.DaydreamService.getExcursionSum(this.myDayDream.ID).then((total) => {
      if (!total[0]) {
        this.excursionCost = 0
        return
      }
      else {
        this.excursionCost = Math.floor(total[0].TotalBalance)
      }
    })
  }

  displayLodging() {
    let lodging = this.myDayDream.lodgingInformation
    let i: number = 0;
    for (i; i < lodging.length; i++) {
      // let l = new DayDream(response[0][i]);
      this.lodgingInfo[i] = lodging[i];
    }
    // console.log(this.myDayDream)
  }

  displayTravel() {
    let travel = this.myDayDream.travelInformation
    let i: number = 0;
    for (i; i < travel.length; i++) {
      // let l = new DayDream(response[0][i]);
      this.travelInfo[i] = travel[i];
    }
    // console.log(this.myDayDream)
  }

  displayExcursion() {
    let excursion = this.myDayDream.excursions;
    let i: number = 0;
    for (i; i < excursion.length; i++) {
      // let l = new DayDream(response[0][i]);
      this.excursionInfo[i] = excursion[i];
    }
  }

  deleteLodging(daydream: DayDream) { // defect 1
   // call delete method from service
    var id = this.route.snapshot.params['id'];
    this.DaydreamService.deleteChosenDaydream(id).then((data) => {
      this.myDayDream = new DayDream(data);
      // console.log("Deleting DayDream");
      //navigate back to page
      //this._router.navigate(['/home']);
    })
    window.location.replace("/daydream/" + this.myDayDream.ID);
  }

  deleteTravel(t) {
    var confirm = window.confirm('Are you sure you want to remove this Travel Information? This action cannot be undone')
    if (confirm == false) {
      return;
    }
    var dd_id = this.route.snapshot.params['id'];
    var tr_id = t._id;
    // console.log("The ID is: " + t._id);

    this.DaydreamService.deleteChosenTravel(dd_id, tr_id).then((data) => {
      this.myDayDream = new DayDream(data);
      // console.log("Deleting DayDream");
      window.location.replace("/daydream/" + dd_id);
    })
  }



  deleteExcursion(e) {
    var confirm = window.confirm('Are you sure you want to remove this excursion? This action cannot be undone')
    if (confirm == false) {
      return;
    }
    var dd_id = this.route.snapshot.params['id'];
    var ex_id = e._id;
    // console.log("The ID is: " + e._id);

    this.DaydreamService.deleteChosenExcursion(dd_id, ex_id).then((data) => {
      this.myDayDream = new DayDream(data);
      // console.log("Deleting DayDream");
      window.location.replace("/daydream/" + dd_id);
    })
  }


  renderEditDayDream() {
    this._router.navigate(['/edit-daydream/' + this.myDayDream.ID]);

    // this.chosenCircle = circle;
    // console.log(this.chosenCircle);
  }

  delDaydream(daydream: DayDream) {

    // call delete method from service
    var confirm = window.confirm('Are you sure you want to remove this DayDream? This action cannot be undone')
    if (confirm == false) {
      return
    }
    var id = this.route.snapshot.params['id'];
    this.DaydreamService.deleteChosenDaydream(id).then((data) => {
      this.myDayDream = new DayDream(data);
      // console.log("Deleting DayDream");
      //navigate back to page
      //this._router.navigate(['/home']);
      this.returnToCircles();
    })
  }



  onFileChanged(event) {
    let file = event.target.files[0]
    // console.log(event.target.files[0])
    let formdata = new FormData()
    formdata.append('image', file, file.name)
    this.DaydreamService.uploadPhoto(formdata, this.myDayDream.ID).then((res) => {
      // console.log(res)
      window.location.replace("/daydream/" + this.myDayDream.ID);
    })
  }

  returnToCircles() {
    var route = localStorage.getItem('circle')
    var back = '/circle/' + route
    localStorage.removeItem('circle')
    this._router.navigate(['/home'])
  }



  displayImages() {
    var id = this.route.snapshot.params['id'];
    this.DaydreamService.getPhotos(id).then((res) => {
      // console.log(res)
      var i: number = 0
      res.forEach(element => {
        this.images[i] = element
        i++
      });
    })
  }

  addDayDreamToMemories() {
    this.DaydreamService.addToMemories(this.myDayDream.ID).then(() => {
      var confirm = window.confirm('Are you sure you want to add this Daydream to Memories? Only do this if this daydream is complete. This action cannot be undone')
      if (confirm == false) {
        return
      }
      this.returnToCircles()
    })
  }

  reduceFunds(event) { // defect 9
    // console.log(event.target["0"].value)
    this.DaydreamService.addContribution(this.myDayDream.ID, event.target["0"].value).then(() => {
      window.location.replace("/daydream/" + this.myDayDream.ID);
    })
  }

  addLodging(event) {
    // console.log(event.target["0"].value)
    // console.log(event.target["1"].value)
    this.DaydreamService.createLodging(this.myDayDream.ID, event.target["0"].value, event.target["1"].value).then(() => {
      window.location.replace("/daydream/" + this.myDayDream.ID);
    })
  }

  editLodging(l,event){
    // console.log(event.target["0"].value)
    // console.log(event.target["1"].value)
    var id = l._id;
    // this.DaydreamService.editLodging(this.myDayDream.ID, id, event.target["0"].value, event.target["1"].value).then(()=>{
    //   window.location.replace("/daydream/" + this.myDayDream.ID);
    // })

    window.location.replace("/daydream/" + this.myDayDream.ID);
  }


  addTravel(event) {
    // console.log(event.target["0"].value)
    // console.log(event.target["1"].value)
    this.DaydreamService.createTravel(this.myDayDream.ID, event.target["0"].value, event.target["1"].value).then(() => {
      window.location.replace("/daydream/" + this.myDayDream.ID);
    })
  }

  editTravel(t,event){
    // console.log(event.target["0"].value)
    // console.log(event.target["1"].value)
    var id = t._id;
    this.DaydreamService.editTravel(this.myDayDream.ID, id, event.target["0"].value, event.target["1"].value).then(()=>{
      window.location.replace("/daydream/" + this.myDayDream.ID);
    })
  }


  addExcursion(event) {

    // console.log(event.target["0"].value)
    // console.log(event.target["1"].value)
    // console.log(event.target["2"].value)
    this.DaydreamService.createExcursion(this.myDayDream.ID, event.target["0"].value, event.target["1"].value,
    event.target["2"].value).then(()=>{
      window.location.replace("/daydream/" + this.myDayDream.ID);
    })
  }

  editExcursion(e,event){
    // console.log(event.target["0"].value)
    // console.log(event.target["1"].value)
    // console.log(event.target["2"].value)
    var id = e._id;
    this.DaydreamService.editExcursion(this.myDayDream.ID, id, event.target["0"].value, event.target["1"].value,
    event.target["2"].value).then(()=>{
      window.location.replace("/daydream/" + this.myDayDream.ID);
    })
  }



  initializeColors() {
    var i: number = 0
    for (i = 0; i < 20; i++) {
      this.colors[i] = '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

  }

  showTopContributors() {
    this.DaydreamService.getContributionPerPerson(this.myDayDream.ID).then((contributions) => {
      try {
        var conts = contributions[0].total
        let i: number = 0
        // console.log(conts)
        let j:number = 0
        for (i = 0; i < conts.length; i++) {
          if(conts[i].total <= 0){
            continue
          }
          this.contributions[j++] = conts[i]
        }
        // console.log(this.contributions)
      } catch (error) {
        window.alert("There are no contributors yet");
      }
    })
  }

  addFunds(event){ // defect 10
    // console.log(event.target["0"].value)
    this.DaydreamService.removeFunds(this.myDayDream.ID, event.target["0"].value).then(() => {
      window.location.replace("/daydream/" + this.myDayDream.ID);
    })
  }
}
