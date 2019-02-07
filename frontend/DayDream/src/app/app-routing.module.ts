import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth-guard';
import { SignUpComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component'
import { HomeComponent } from './home/home.component'
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { CircleComponent } from './circle/circle.component'


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',

  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    //:id is parameter, important 
    path: 'circle/:id',
    component: CircleComponent,
    canActivate: [AuthGuard],
    data: {
      type: 'circle'
    }
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
    path: 'forgot',
    component: ForgotPasswordComponent
  },
  {
    //404 error, leave this one as last route check
    path: '**',
    redirectTo: 'home',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
