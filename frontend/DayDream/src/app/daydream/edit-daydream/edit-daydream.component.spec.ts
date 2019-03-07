import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { EditDayDreamComponent } from './edit-daydream.component';
import { exists } from 'fs';

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

describe('EditNameComponent', () => {
  let component: EditDayDreamComponent;
  let fixture: ComponentFixture<EditDayDreamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NavbarModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        MDBBootstrapModule.forRoot(),
        CardsFreeModule
      ],
      declarations: [ EditDayDreamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDayDreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
