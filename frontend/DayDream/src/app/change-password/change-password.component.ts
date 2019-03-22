import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from '../services/auth.service'

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, public authservice: AuthService) { }
  response: string = "NULL";
  changePasswordForm: FormGroup
  submitted_password: boolean = false;

  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['']
    }, { validator: this.checkPasswords });
  }

  get form_password() { return this.changePasswordForm.controls }
  get response_msg() { return this.response }

  // custom validator for checking passwords
  checkPasswords(group: FormGroup) {
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  onSubmitPassword(form: NgForm) {
    this.submitted_password = true;

    if (this.changePasswordForm.invalid) {
      return;
    }

    this.authservice.changePassword(form.value.password).then((res) => {
      console.log(res)
      this.response = "complete_password"
    }).catch((error) => {
      // console.log(error)
      this.response = "fatal_error"
    })
  }
}
