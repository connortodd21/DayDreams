import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaydreamComponent } from './daydream.component';

describe('DaydreamComponent', () => {
  let component: DaydreamComponent;
  let fixture: ComponentFixture<DaydreamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
