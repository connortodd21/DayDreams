import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignUpComponent} from './auth/signup/signup.component';


const routes: Routes = [
  {
    path: 'register',
    component: SignUpComponent
  },
  {
    //404 error, leave this one as last route check
    path: '**',
    redirectTo: 'home',
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
