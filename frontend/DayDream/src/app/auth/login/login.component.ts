import { Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import { NgForm, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

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
        this.response = await (this.authService.login(form.value.username, form.value.password))
        console.log(this.response)
    }

}