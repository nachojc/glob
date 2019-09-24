import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnDrawerComponent } from './sn-drawer.component';

describe('SnDrawerComponent', () => {
  let component: SnDrawerComponent;
  let fixture: ComponentFixture<SnDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
