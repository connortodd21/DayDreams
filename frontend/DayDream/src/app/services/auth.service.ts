import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthData } from '../models/auth-data.model'
import { Subject, Observable } from "rxjs";
import { Router } from "@angular/router";
import { HomeComponent } from '../home/home.component';
import { AppComponent } from '../app.component';
import { map } from 'rxjs/operators';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as 'response'
};

@Injectable({ providedIn: "root" })

export class AuthService {
    private token: string
    private tokenTimer: any;
    private isAuthenticated = false;
    response_login: string = "NULL";
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) { }

    registerUser(email: string, username: string, password: string) {
        const auth: AuthData = { email: email, username: username, password: password }
        console.log(auth)
        return this.http.post<Object>("http://localhost:5000/user/register", auth).toPromise()
    }

    forgotPassword(email: string) {
        const auth: AuthData = { username: "", password: "", email: email }
        return this.http.post<Object>('http://localhost:5000/user/forgot-password', auth).toPromise()
    }

    changePassword(newPassword: string) {
        const auth: AuthData = { username: "", password: newPassword, email: "" }
        return this.http.post<Object>('http://localhost:5000/user/change-password', auth).toPromise()
    }

    changeEmail(newEmail: string) {
        const auth: AuthData = { username: "", password: "", email: newEmail }
        return this.http.post<Object>('http://localhost:5000/user/change-email', auth).toPromise()
    }

    getAuthToken() {
        if (localStorage['token']) {
            return localStorage['token'];
        }
        return false;
    }

    getAuthenticationStatus() {
        // console.log(this.isAuthenticated)
        return this.isAuthenticated
    }

    getAuthStatObservible() {
        return new Observable<boolean>(observer => {
            if (localStorage['token']) {
                observer.next(true)
            }
            else {
                observer.next(false)
            }
        })
    }

    async login(username: string, password: string) {
        const auth: AuthData = { username: username, password: password, email: "" }
        console.log(auth)
        await this.http.post("http://localhost:5000/user/login", auth, httpOptions).pipe(
            map(response => {
                const token = response.headers.get('token');
                this.token = token
                if (token) {
                    const expiresInDuration = 7200;
                    this.setAuthTimer(expiresInDuration);
                    this.isAuthenticated = true;
                    this.authStatusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                    this.response_login = "complete";
                    console.log(expirationDate);
                    this.addAuthToLocalStorage(token, expirationDate);
                    window.location.replace("/home");
                }
            }
            )).toPromise().catch((error) => {
                if (error.error.message == "Account has not been verified, please verify your account") {
                    this.response_login = "verify"
                }
                else if (error.error.message == "Error: Password is incorrect") {
                   this.response_login = "badPass" 
                   return "basPass"
                }
                else if (error.error.message == "Error: User does not exist, register before logging in") {
                    this.response_login = "DNE"
                    return "DNE"
                }
                else {
                    this.response_login = "failed";
                    return "FAILED"
                }
                console.log(error.error.message);
            })
        return this.response_login
    }

    getResponseLogin(){
        return this.response_login
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false)
        clearTimeout(this.tokenTimer);
        this.clearLocalStorage();
        this.router.navigate(['/login']);
    }

    private addAuthToLocalStorage(token: string, expirationDate: Date) {
        localStorage.setItem('token', token)
        localStorage.setItem('expiresIn', expirationDate.toISOString())
    }

    private clearLocalStorage() {
        localStorage.clear()
    }

    private setAuthTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    public getAuthData() {
        const token = localStorage['token'];
        const expirationDate = localStorage["expiresIn"];
        if (!token || !expirationDate) {
            return
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate)
        }
    }

    autoAuthUser() {
        const authInformation = this.getAuthData();
        if (!authInformation) {
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.setAuthTimer(expiresIn / 10);
            this.authStatusListener.next(true);
            return true;
        }
    }
}