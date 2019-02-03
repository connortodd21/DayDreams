import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthData } from '../auth/auth-data.model'
import { Subject } from "rxjs";
import { Router } from "@angular/router";

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as 'response'
};

@Injectable({ providedIn: "root" })

export class UserService{
    renderComponent: String = "";
    
    constructor(private http:HttpClient) {
        
    }

    getUserCircles(){
        return this.http.get<Object>('http://localhost:5000/user/all-circles').toPromise();
    }
}