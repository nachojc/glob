import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchSearchInputComponent } from './branch-search-input.component';
import { IconModule } from 'sn-common-lib';
import { MapsAPILoader, AgmCoreModule } from '@agm/core';
import { ElementRef } from '@angular/core';

const MapsAPILoaderMock = {
  load: () => new Promise((resolve) => resolve())
};
const windowRef = {
  google: {
    maps : {
      places: {
        Autocomplete : () => ({
          addListener: (event: string, callback) => {
            return callback({});
          },
          getPlace: () => ({
            geometry: {
              location: {
                lat: () => 10,
                lng: () => 10
              }
            }
          })
        })
      }
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
    component.elementRef = new ElementRef<any>({nativeElement: () => {}});
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('use google Api', () => {
    component.useGoogle = true;
    expect(component).toBeTruthy();
    expect(component.useGoogle).toBeTruthy();
  });

  fdescribe('initGoogleAutoCommplete()', () => {
    it('shoul call placeChange', () => {
      spyOn(component.placeChange, 'emit');
      component.useGoogle = true;
      component.initGoogleAutoCommplete();
      expect(component.placeChange.emit).toHaveBeenCalled();
    });
  });
});
