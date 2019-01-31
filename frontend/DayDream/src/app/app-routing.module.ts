import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignUpComponent } from './auth/signup/signup.component';
import {LoginComponent} from './auth/login/login.component'


const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',

  },
  {
    path: 'login',
    component: LoginComponent

  },
  {
    path: 'register',
    component: SignUpComponent
  },
  {
    //404 error, leave this one as last route check
    path: '**',
    redirectTo: 'login',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { }
