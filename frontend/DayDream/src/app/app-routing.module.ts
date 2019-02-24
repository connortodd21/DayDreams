import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth-guard';
import { SignUpComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component'
import { HomeComponent } from './home/home.component'
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { CircleComponent } from './circle/circle.component'
import { EditNameComponent } from './circle/edit-name/edit-name.component'
import { ChangePasswordComponent } from './change-password/change-password.component'
import { ChangeEmailComponent } from './change-email/change-email.component'
import {DaydreamComponent} from './daydream/daydream.component'



const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
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
    path: 'daydream/:id',
    component: DaydreamComponent,
    canActivate: [AuthGuard],
    data: {
      type: 'daydream'
    }

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
    path: 'change-password',
    component: ChangePasswordComponent
  },
  {
    path: 'change-email',
    component: ChangeEmailComponent
  },
  {
    path: 'edit-name/:id',
    component: EditNameComponent
  },
  {
    //404 error, leave this one as last route check
    path: '**',
    redirectTo: 'login',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
