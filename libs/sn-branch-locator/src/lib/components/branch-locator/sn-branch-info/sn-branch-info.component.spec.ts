import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnBranchInfoComponent } from './sn-branch-info.component';

describe('SnBranchInfoComponent', () => {
  let component: SnBranchInfoComponent;
  let fixture: ComponentFixture<SnBranchInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnBranchInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnBranchInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
