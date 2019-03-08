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


    /*
    *   get lodging
    */
    getLodging(dayDreamID:string){
        const info = {
            headers: new HttpHeaders({
                'daydreamID': dayDreamID
            })
        }
        /* calls /circle/info from the backend*/
        return this.http.get<Array<Object>>("http://localhost:5000/daydream/get-lodging", info).toPromise()
    }

    /*
    *   create lodging
    */
    createLodging(daydreamID:string, address:string, cost:Number){
        const lodging = {
            daydreamID: daydreamID,
            address: address,
            cost: cost
        }
        return this.http.post("http://localhost:5000/daydream/add-lodging", lodging).toPromise()
    }

    /*
    *   Delete lodging
    */

    deleteChosenLodging(daydreamID:string, lodgingInformationID:string) {
        const chosen = {
            daydreamID: daydreamID,
            lodgingInformationID: lodgingInformationID
        }
        return this.http.post("http://localhost:5000/daydream/delete-lodging", chosen).toPromise()
    }
    
    /*
    *   get travel
    */

    getTravel(dayDreamID:string){
        const info = {
            headers: new HttpHeaders({
                'daydreamID': dayDreamID
            })
        }
        /* calls /circle/info from the backend*/
        return this.http.get<Array<Object>>("http://localhost:5000/daydream/travel", info).toPromise()
    }

    /*
    *   Create travel
    */
   
    createTravel(daydreamID:string, mode:string, cost:Number){
        const travel = {
            daydreamID: daydreamID,
            mode: mode,
            cost: cost
        }
        return this.http.post("http://localhost:5000/daydream/add-travel", travel).toPromise()
    }

    /*
    *   Delete travel
    */


    deleteChosenTravel(daydreamID:string, travelInformationID:string) {
        const chosen = {
            daydreamID: daydreamID,
            travelInformationID: travelInformationID
        }
        return this.http.post("http://localhost:5000/daydream/delete-travel", chosen).toPromise()
    }

    getTotalContribution(daydreamID:string){
        const info = {
            headers: new HttpHeaders({
                // 'Content-Type': 'application/form-data',
                'daydreamID': daydreamID
            })
        }
        return this.http.get("http://localhost:5000/daydream/contribution-sum", info).toPromise()
    }

    getExcursionSum(daydreamID:string){
        const info = {
            headers: new HttpHeaders({
                // 'Content-Type': 'application/form-data',
                'daydreamID': daydreamID
            })
        }
        return this.http.get("http://localhost:5000/daydream/excursion-sum", info).toPromise()
    }

    getTransportationSum(daydreamID:string){
        const info = {
            headers: new HttpHeaders({
                // 'Content-Type': 'application/form-data',
                'daydreamID': daydreamID
            })
        }
        return this.http.get("http://localhost:5000/daydream/transportation-sum", info).toPromise()
    }

    getLodgingSum(daydreamID:string){
        const info = {
            headers: new HttpHeaders({
                // 'Content-Type': 'application/form-data',
                'daydreamID': daydreamID
            })
        }
        return this.http.get("http://localhost:5000/daydream/lodging-sum", info).toPromise()
    }

    addContribution(daydreamID:string, cost:number){
        const chosen = {
            daydreamID: daydreamID,
            cost: cost
        }
        return this.http.post("http://localhost:5000/daydream/add-contribution", chosen).toPromise()
    }

    getContributionPerPerson(daydreamID:string){
        const info = {
            headers: new HttpHeaders({
                // 'Content-Type': 'application/form-data',
                'daydreamID': daydreamID
            })
        }
        return this.http.get("http://localhost:5000/daydream/individual-sum", info).toPromise()
    }


    /*
    *   Get excursion
    */

    getExcursion(dayDreamID:string){
        const info = {
            headers: new HttpHeaders({
                'daydreamID': dayDreamID
            })
        }
        /* calls /circle/info from the backend*/
        return this.http.get<Array<Object>>("http://localhost:5000/daydream/excursion", info).toPromise()
    }

    /*
    *   Create excursion
    */

    createExcursion(daydreamID:string, information:string, cost:Number,category:string,){
        const excursion = {
            daydreamID: daydreamID,
            information: information,
            cost: cost,
            category: category,
        }
        return this.http.post("http://localhost:5000/daydream/add-excursion", excursion).toPromise()
    }

    /*
    *   Delete excursion
    */

    deleteChosenExcursion(daydreamID:string, excursionID:string) {
        const chosen = {
            daydreamID: daydreamID,
            excursionID: excursionID
        }
        return this.http.post("http://localhost:5000/daydream/delete-excursion", chosen).toPromise()
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
