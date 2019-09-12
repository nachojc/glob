import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnBranchLocatorComponent } from './sn-branch-locator.component';

describe('SnBranchLocatorComponent', () => {
  let component: SnBranchLocatorComponent;
  let fixture: ComponentFixture<SnBranchLocatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnBranchLocatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnBranchLocatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
