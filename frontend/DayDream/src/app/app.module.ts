import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {
  MDBBootstrapModule,
  ModalModule,
  NavbarModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonsModule,
  CarouselModule,
  CardsFreeModule,
  ChartsModule,
  CheckboxModule,
  CollapseModule,
  DropdownModule,
  IconsModule,
  InputsModule,
  PopoverModule,
  TooltipModule,
  WavesModule
}
  from 'angular-bootstrap-md';
import { RouterModule } from '@angular/router'
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './auth/signup/signup.component';
import { AuthComponent } from './auth/auth.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { FormsModule, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './auth/login/login.component';
import { CircleComponent } from './circle/circle.component';
import { HomeComponent } from './home/home.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { DaydreamComponent } from './daydream/daydream.component';
import { EditNameComponent } from './circle/edit-name/edit-name.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangeEmailComponent } from './change-email/change-email.component';
import { AboutComponent } from './about/about.component';


@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    AuthComponent,
    LoginComponent,
    CircleComponent,
    HomeComponent,
    ForgotPasswordComponent,
    DaydreamComponent,
    EditNameComponent,
    ChangePasswordComponent,
    ChangeEmailComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    ModalModule.forRoot(),
    NavbarModule,
    BadgeModule,
    BreadcrumbModule,
    ButtonsModule,
    CardsFreeModule,
    CarouselModule.forRoot(),
    ChartsModule,
    CheckboxModule,
    CollapseModule.forRoot(),
    DropdownModule.forRoot(),
    IconsModule,
    InputsModule.forRoot(),
    ModalModule.forRoot(),
    NavbarModule,
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
    WavesModule.forRoot(),
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
