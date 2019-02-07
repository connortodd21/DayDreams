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

export class CircleService{

    Circle: Object;

    constructor(private http:HttpClient) {
        
    }


    uploadPhoto(url:string, circleName:string){
        const options = {
            imageUrl: url,
            circleName: circleName,
        }
        return this.http.post<Object>("http://localhost:5000/circle/add-photo", options).toPromise()
    }

    getAllCircleInfo(circleID:string) {
        const info = {
            headers: new HttpHeaders({
                'circleID': circleID
            })
        }

        /* calls /circle/info from the backend*/
        return this.http.get("http://localhost:5000/circle/info", info).toPromise()
    }
}