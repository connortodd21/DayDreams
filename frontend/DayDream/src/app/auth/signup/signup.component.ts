import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { NgForm, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';


@Component({
    selector: 'app-signup',
    templateUrl: 'signup.component.html'

})

export class SignUpComponent implements OnInit {
    @ViewChild('alert') alert: ElementRef;
    signUpForm: FormGroup;
    submitted = false;
    response: string = "NULL";

    constructor(public authService: AuthService, private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.signUpForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
        }, { validator: this.checkPasswords });
    }

    private checkPasswords(group: FormGroup) { // here we have the 'passwords' group
        let pass = group.controls.password.value;
        let confirmPass = group.controls.confirmPassword.value;

        return pass === confirmPass ? null : { notSame: true }
    }

    get form() { return this.signUpForm.controls }

    get response_msg() { return this.response; }

    closeAlert() {
        this.alert.nativeElement.classList.remove('show');
    }

    signUp(form: NgForm) {
        this.submitted = true;
        if (this.signUpForm.invalid) {
            console.log(this.signUpForm);
            return;
        }
        var password = form.value.password
        console.log(password)
        this.authService.registerUser(form.value.email, form.value.username, form.value.password).then((res) => {
            this.response = "complete";
        }).catch((err) => {
            if (err.error.message == "User already exists") {
                this.response = "duplicate";
            }
            else {
                console.log(err)
                this.response = "fatalError";
            }
        })
    }

    encryptData(data) {
        try {
            var key = CryptoJS.enc.Base64.parse(environment.KEY);
            var iv = CryptoJS.enc.Base64.parse(environment.IV);
            return CryptoJS.AES.encrypt(data, key, {iv: iv}).toString();
        } catch (e) {
            console.log(e);
        }
    }
}