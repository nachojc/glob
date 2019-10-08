import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchSearchInputComponent } from './branch-search-input.component';
import { IconModule } from 'sn-common-lib';
import { MapsAPILoader, NoOpMapsAPILoader, AgmCoreModule } from '@agm/core';

const MapsAPILoaderMock = {
  load: () => new Promise(() => true)
};
const windowRef = {
  google: {
    maps : {
      places: { Autocomplete : (inputField: HTMLInputElement, opts?: {}) => ({})}
    }
  }
};

describe('BranchSearchInputComponent', () => {
  let component: BranchSearchInputComponent;
  let fixture: ComponentFixture<BranchSearchInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchSearchInputComponent ],
      imports: [
        IconModule,
        AgmCoreModule.forRoot({
          apiKey: 'demo',
          libraries: ['places']
        })
      ],
      providers: [
        {provide: MapsAPILoader, useValue: MapsAPILoaderMock},
        {provide: 'WINDOW', useValue: windowRef }
      ]
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
