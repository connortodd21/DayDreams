import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { Injectable, Inject } from "@angular/core";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

    constructor(private authService:AuthService){

    }

    intercept(req: HttpRequest<any>, next: HttpHandler){
        var token = this.authService.getAuthToken()
        if(token){
            //logged in
            return next.handle(
                req.clone({
                    headers: req.headers.set('token', token)
                })
            )
        }
        else{
            return next.handle(req.clone())
        }

    }
}

