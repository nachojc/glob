import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnBranchSearchInputComponent } from './sn-branch-search-input.component';

describe('SnBranchSearchInputComponent', () => {
  let component: SnBranchSearchInputComponent;
  let fixture: ComponentFixture<SnBranchSearchInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnBranchSearchInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnBranchSearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
