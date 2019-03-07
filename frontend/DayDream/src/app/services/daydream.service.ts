import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthData } from '../models/auth-data.model'
import { Subject } from "rxjs";
import { Router } from "@angular/router";

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as 'response'
};

@Injectable({ providedIn: "root" })

export class DaydreamService{

    Daydream: Object;

    constructor(private http:HttpClient) {

    }

    getAllDaydreamInfo(daydreamID:string) {
        const info = {
            headers: new HttpHeaders({
                'daydreamID': daydreamID
            })
        }

        /* calls /circle/info from the backend*/
        return this.http.get("http://localhost:5000/daydream/info", info).toPromise()
    }

    deleteChosenDaydream(daydreamID:string) {
        const chosen = {
            daydreamID: daydreamID
        }

        return this.http.post("http://localhost:5000/daydream/delete", chosen).toPromise()
    }

    createDaydream(circleID:string, destination:string, description:string, totalCost:Number){
        const daydream = {
            circleID: circleID,
            destination: destination,
            description: description,
            totalCost: totalCost
        }
        return this.http.post("http://localhost:5000/daydream/add", daydream).toPromise()
    }

    addToMemories(daydreamID:string){
        const chosen = {
            daydreamID: daydreamID
        }

        return this.http.post("http://localhost:5000/daydream/add-to-memories", chosen).toPromise()
    }

    uploadPhoto(formdata:FormData, dayDreamID:string){
        const info = {
            headers: new HttpHeaders({
                // 'Content-Type': 'application/form-data',
                'daydreamID': dayDreamID
            })
        }
        console.log(formdata.getAll('image'))
        return this.http.post("http://localhost:5000/daydream/upload-photo", formdata, info).toPromise()
    }

    getLodging(dayDreamID:string){
        const info = {
            headers: new HttpHeaders({
                'daydreamID': dayDreamID
            })
        }
        /* calls /circle/info from the backend*/
        return this.http.get<Array<Object>>("http://localhost:5000/daydream/get-lodging", info).toPromise()
    }

    getTravel(dayDreamID:string){
        const info = {
            headers: new HttpHeaders({
                'daydreamID': dayDreamID
            })
        }
        /* calls /circle/info from the backend*/
        return this.http.get<Array<Object>>("http://localhost:5000/daydream/travel", info).toPromise()
    }


    getPhotos(dayDreamID:string){
        const info = {
            headers: new HttpHeaders({
                // 'Content-Type': 'application/form-data',
                'daydreamID': dayDreamID
            })
        }
        return this.http.get<Array<Object>>("http://localhost:5000/daydream/all-photos", info).toPromise()
    }

    editDayDreamDescription(description:string, daydreamID:string) {
        const circle:Object = {
            description: description,
            daydreamID: daydreamID,
        }
        return this.http.post("http://localhost:5000/daydream/edit-description", circle)
    }

    editDayDreamDestination(destination:string, daydreamID:string) {
        const circle:Object = {
            destination: destination,
            daydreamID: daydreamID,
        }
        return this.http.post("http://localhost:5000/daydream/edit-destination", circle)
    }

    editDayDreamCost(cost:number, daydreamID:string) {
        const circle:Object = {
            cost: cost,
            daydreamID: daydreamID,
        }
        return this.http.post("http://localhost:5000/daydream/edit-cost", circle)
    }
}
