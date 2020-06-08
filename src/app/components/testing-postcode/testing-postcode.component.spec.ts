import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingPostcodeComponent } from './testing-postcode.component';

describe('TestingPostcodeComponent', () => {
  let component: TestingPostcodeComponent;
  let fixture: ComponentFixture<TestingPostcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestingPostcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestingPostcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
