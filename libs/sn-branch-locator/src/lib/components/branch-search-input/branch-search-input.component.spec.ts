import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchSearchInputComponent } from './branch-search-input.component';
import { IconModule } from 'sn-common-lib';
import { MapsAPILoader, NoOpMapsAPILoader, AgmCoreModule } from '@agm/core';

describe('BranchSearchInputComponent', () => {
  let component: BranchSearchInputComponent;
  let fixture: ComponentFixture<BranchSearchInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchSearchInputComponent ],
      imports: [
        IconModule,
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyAqG_sh5WdfA_ebgJLySpBejISPlNQPDl0',
          libraries: ['places']
        })
      ],
      providers: [{provide: MapsAPILoader, useClass: NoOpMapsAPILoader}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchSearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
