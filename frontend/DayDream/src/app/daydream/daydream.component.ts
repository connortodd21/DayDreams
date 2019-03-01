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
  lodgingInfo: {}
  images: Array<Object>

  constructor(private route: ActivatedRoute,
    private circleService: CircleService, private DaydreamService: DaydreamService, private formBuilder: FormBuilder, private _router: Router) { 
      this.images = []
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
      this.displayImages()
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
      console.log("Deleting DayDream");
      //navigate back to page
      //this._router.navigate(['/home']);
      this.returnToCircles();
    })
  }


  onFileChanged(event){
    let file = event.target.files[0]
    console.log(event.target.files[0])
    let formdata = new FormData()
    formdata.append('image', file, file.name)
    this.DaydreamService.uploadPhoto(formdata, this.myDayDream.ID).then((res) => {
      console.log(res)
    })
  }

  returnToCircles(){
    var route = localStorage.getItem('circle')
    localStorage.removeItem('circle')
    this._router.navigate([route])
  }

  displayImages(){
    var id = this.route.snapshot.params['id'];
    this.DaydreamService.getPhotos(id).then((res) => {
      console.log(res)
      var i: number = 0
      res.forEach(element => {
        this.images[i] = element
        i++
      });
    })
  }

}
