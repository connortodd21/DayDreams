import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChangeEmailComponent } from './change-email.component';
import {
  MDBBootstrapModule,
  ModalModule,
  NavbarModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonsModule,
  CarouselModule,
  CardsFreeModule,
  MdbCardBodyComponent,
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

describe('ChangeEmailComponent', () => {
  let component: ChangeEmailComponent;
  let fixture: ComponentFixture<ChangeEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NavbarModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        MDBBootstrapModule.forRoot(),
      ],
      declarations: [ ChangeEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
