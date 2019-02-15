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
import { DaydreamComponent } from './daydream.component';

describe('DaydreamComponent', () => {
  let component: DaydreamComponent;
  let fixture: ComponentFixture<DaydreamComponent>;

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
      declarations: [ DaydreamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaydreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
