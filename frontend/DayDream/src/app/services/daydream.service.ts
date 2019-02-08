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

    createDaydream(destination:string, description:string, totalCost:Number){
        const daydream = {
            destination: destination,
            description: description,
            totalCost: totalCost
        }
        return this.http.post("http://localhost:5000/daydream/add", daydream).toPromise()
    }
}
