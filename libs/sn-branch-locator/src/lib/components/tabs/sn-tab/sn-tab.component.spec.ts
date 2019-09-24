import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnTabComponent } from './sn-tab.component';

describe('SnTabComponent', () => {
  let component: SnTabComponent;
  let fixture: ComponentFixture<SnTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
