import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { NgForm, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from '../services/auth.service'

@Component({
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})

export class ForgotPasswordComponent implements OnInit {
  constructor(private http: HttpClient, private formBuilder: FormBuilder, public authservice: AuthService) { }
  submitted: boolean = false;
  response: string = "NULL";
  resetPasswordForm: FormGroup;

  ngOnInit() {
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get form() { return this.resetPasswordForm.controls }
  get response_msg() { return this.response }

  onSubmitReset(form: NgForm) {
    this.submitted = true;

    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.authservice.forgotPassword(form.value.email).then((res) => {
      console.log(res)
      this.response = "success"
    }).catch((error) => {
      console.log(error)
      if (error.error.message == "Email does not exist in our records.") {
        this.response = "noEmail";
      }
      else {
        this.response = "fatalError";
      }
    })
  }
}
