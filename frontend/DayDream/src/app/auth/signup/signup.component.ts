import { Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import { NgForm, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";


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

    ngOnInit(){
        this.signUpForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
        }, {validator: this.checkPasswords });
    }

    private checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  get form() { return this.signUpForm.controls }

    get response_msg() { return this.response; }

    closeAlert(){
        this.alert.nativeElement.classList.remove('show');
    }

  signUp(form: NgForm){
    this.submitted = true;
        if (this.signUpForm.invalid) {
            console.log(this.signUpForm)
            return;
        }
        this.authService.registerUser(form.value.email, form.value.username, form.value.password).then((res) => {
            console.log(res)
            console.log("AD")
            this.response = "complete"
        }).catch((err) => {
            if (err.error.name == "MongoError") {
                this.response = "User already exists";
            }
            else {
                this.response = "RIP";
            }
            console.log(err.error)
        })
  }
}