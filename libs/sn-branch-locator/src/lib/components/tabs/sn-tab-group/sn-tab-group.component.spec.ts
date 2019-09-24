import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnTabGroupComponent } from './sn-tab-group.component';

describe('SnTabGroupComponent', () => {
  let component: SnTabGroupComponent;
  let fixture: ComponentFixture<SnTabGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnTabGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnTabGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
