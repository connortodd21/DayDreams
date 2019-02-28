import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { EditNameComponent } from './edit-name.component';
import { exists } from 'fs';

describe('EditNameComponent', () => {
  let component: EditNameComponent;
  let fixture: ComponentFixture<EditNameComponent>;

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
      declarations: [ EditNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
