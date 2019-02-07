import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthData } from '../models/auth-data.model'
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as 'response'
};

@Injectable({ providedIn: "root" })

export class AuthService{
    private token:string
    private tokenTimer: any;
    private isAuthenticated = false
    response_login: string = "NULL";

    constructor(private http: HttpClient, private router: Router) { }

    registerUser(email: string, username: string, password: string) {
        const auth: AuthData = { email: email, username: username, password: password}
        console.log(auth)
        return this.http.post<Object>("http://localhost:5000/user/register", auth).toPromise()
    }

    forgotPassword(email: string){
        const auth: AuthData = {username: "", password: "", email: email}
        return this.http.post<Object>('http://localhost:5000/user/forgot-password', auth).toPromise()
    }
    
    getAuthToken(){
        if(localStorage.getItem('token')){
            return localStorage.getItem('token');
        }
        return false;
    }

    getAuthenticationStatus(){
        if(localStorage.getItem('token')){
            return true;
        }
        return false;
    }

    login(username: string, password: string) {
        const auth: AuthData = { username: username, password: password, email: "" }
        console.log(auth)
        this.http.post("http://localhost:5000/user/login", auth, httpOptions)
            .subscribe(response => {
                console.log(auth)
                const token = response.headers.get('token');
                this.token = token
                if (token) {
                    this.setAuthTimer(7200);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + 7200 * 1000);
                    this.isAuthenticated = true;
                    this.response_login = "comlpete"
                    this.addAuthToLocalStorage(token, expirationDate);
                    this.router.navigate(["/home"]);
                }
            },
                error => {
                    if (error.error.message == "Account has not been verified, please verify your account") {
                        this.response_login = "verify"
                    }
                    else {
                        this.response_login = "failed";
                    }
                    console.log(error);
                }
            );
        return this.response_login
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        clearTimeout(this.tokenTimer);
        this.clearLocalStorage();
        this.router.navigate(['/login']);
    }

    private addAuthToLocalStorage(token: string, expirationDate: Date){
        localStorage.setItem('token', token)
        localStorage.setItem('expiresIn', expirationDate.toISOString())
    }

    private clearLocalStorage(){
        localStorage.clear()
    }

    private setAuthTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    private getAuthData() {
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expiration");
        if (!token || !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate)
        }
    }
}