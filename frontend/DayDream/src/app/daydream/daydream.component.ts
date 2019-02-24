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

  dayDreams: DayDream[];

  constructor(private route: ActivatedRoute,
    private circleService: CircleService, private DaydreamService: DaydreamService, private formBuilder: FormBuilder, private _router: Router) { }

  ngOnInit() {

    this.displayDaydream()

  }

  displayDaydream() {
    var id = this.route.snapshot.params['id'];
    this.DaydreamService.getAllDaydreamInfo(id).then((data) => {
      let i:number;
      let response = [];
      response.push(data);
      this.dayDreams = new Array(response.length)
      console.log(response[0])
      for(i = 0; i< response.length; i+=1) {
        let daydream = new DayDream(response[i])
        this.dayDreams[i] = daydream;
     }
    })
  }

}
