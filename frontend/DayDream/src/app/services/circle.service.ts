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
    constructor(private http:HttpClient, private _router: Router) {}
    CircleUrl: string

    uploadPhoto(url:string, circleID:string){
        const options = {
            imageUrl: url,
            circleID: circleID,
        }
        return this.http.post("http://localhost:5000/circle/add-photo", options)
    }

    editCircleDescription(circleDescription:string, circleID:string) {
        const circle:Object = {
            circleDescription: circleDescription,
            circleID: circleID,
        }
        return this.http.post("http://localhost:5000/circle/edit-circle-description", circle)
    }

    addMessage(message:string, circleID:string){
        const options = {
            circleID: circleID,
            message: message
        }
        return this.http.post("http://localhost:5000/circle/add-message", options).toPromise()
    }

    setCircleUrl(url:string){
        this.CircleUrl=url
    }

    getCircleUrl(){
        return this.CircleUrl
    }

    getAllCircleInfo(circleID:string) {
        const info = {
            headers: new HttpHeaders({
                'circleID': circleID
            })
        }

        /* calls /circle/info from the backend*/
        return this.http.get("http://localhost:5000/circle/info", info).toPromise().catch((err) => {
            // this._router.navigate(['/not-found']);
        })
    }

    getDayDreamsInCircle(circleID:string){
        const info = {
            headers: new HttpHeaders({
                'circleID': circleID
            })
        }
        return this.http.get<Object>("http://localhost:5000/circle/all-daydreams", info).toPromise()
    }

    getMemories(circleID:string){
        const info = {
            headers: new HttpHeaders({
                'circleID': circleID
            })
        }
        return this.http.get<Object>("http://localhost:5000/circle/all-memories", info).toPromise()
    }

    getMessages(circleID:string){
        const info = {
            headers: new HttpHeaders({
                'circleid': circleID
            })
        }
        return this.http.get<Array<Object>>("http://localhost:5000/circle/chat", info).toPromise()
    }

    leaveCircle(circleID:string, username:string){
        const info = {
            circleID: circleID,
            username: username
        }
        return this.http.post("http://localhost:5000/circle/leave", info).toPromise()
    }

    addUser(circleID:string, username:string){
        const info = {
            circleID: circleID,
            username: username
        }
        return this.http.post("http://localhost:5000/circle/add-user", info).toPromise()
    }

    deleteChosenCircle(circleID:string) {
        const chosen = {
            circleID: circleID
        }
        return this.http.post("http://localhost:5000/circle/delete", chosen).toPromise()
    }

    editCircleName(circleName:string, circleID:string) {
        const circle:Object = {
            circleName: circleName,
            circleID: circleID,
        }
        return this.http.post("http://localhost:5000/circle/edit-name", circle)
    }

    createCircle(circleName:string, circleDescription:string, imageUrl: string){
        const circle = {
            circleName: circleName,
            description: circleDescription,
            imageUrl: imageUrl
        }
        return this.http.post("http://localhost:5000/circle/add", circle).toPromise()
    }
}
