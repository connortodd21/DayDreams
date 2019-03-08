import { Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import { NgForm, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';


@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html'

})
export class LoginComponent implements OnInit {

    @ViewChild('alert') alert: ElementRef;

    loginForm: FormGroup;
    response: string;
    submitted = false;

    constructor(private router:Router, public authService: AuthService, private formBuilder: FormBuilder) {
        if(authService.getAuthenticationStatus()){
            this.router.navigate(['/home']);
        }
     }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    get form() { return this.loginForm.controls }

    get response_msg() { return this.response; }

    closeAlert() {
        this.alert.nativeElement.classList.remove('show');
        this.router.navigate(['home']);
    }

    async onLogin(form: NgForm) {
        this.submitted = true;
        if (this.loginForm.invalid) {
            return;
        }

        var password = this.encryptData(form.value.password)
        console.log(password)
        this.response = this.authService.login(form.value.username, password)
    }

    encryptData(data) {
        try {
            var key = CryptoJS.enc.Base64.parse(environment.KEY);
            var iv = CryptoJS.enc.Base64.parse(environment.IV);
            return CryptoJS.AES.encrypt(data, key, {iv: iv}).toString();
        } catch (e) {
            console.log(e);
        }

        this.response = await (this.authService.login(form.value.username, form.value.password))
        console.log(this.response)

    }

}