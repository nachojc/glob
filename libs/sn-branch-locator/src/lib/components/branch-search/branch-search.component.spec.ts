import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchSearchInputComponent } from './branch-search.component';
import { IconModule } from 'sn-common-lib';
import { MapsAPILoader, AgmCoreModule } from '@agm/core';
import { ElementRef } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ENV_CONFIG } from '@globile/mobile-services';

const MapsAPILoaderMock = {
  load: () => new Promise((resolve) => resolve())
};
const windowRef = {
  google: {
    maps: {
      places: {
        Autocomplete: () => ({
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
        }),
        SearchBox: () => ({
          addListener: (event: string, callback) => {
            return callback({});
          },
          getPlaces: () => ([{
            geometry: {
              location: {
                lat: () => 10,
                lng: () => 10
              }
            }
          }])
        }),

      }
    }
  }
};

const env = {
  api: {
    BranchLocator: {
      hasFilters: true,
    }
  }
};


describe('BranchSearchInputComponent', () => {
  let component: BranchSearchInputComponent;
  let fixture: ComponentFixture<BranchSearchInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BranchSearchInputComponent],
      imports: [
        IconModule,
        AgmCoreModule.forRoot(),
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: MapsAPILoader, useValue: MapsAPILoaderMock },
        { provide: 'WINDOW', useValue: windowRef },
        { provide: ENV_CONFIG, useValue: env}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchSearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.inputElementRef = new ElementRef<any>({ nativeElement: () => { } });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  it('shoul call placeChange', () => {
    spyOn(component.placeChange, 'emit');
    component.initSearchBox();
    expect(component.placeChange.emit).toHaveBeenCalled();
  });

  it('should call focus', () => {
    component.inputElementRef.nativeElement = {
      focus: () => null
    } as any;
    component['windowRef'].google.maps.event = {
      trigger: () => null
    } as any;
    spyOn(component.inputElementRef.nativeElement, 'focus');
    component.search(null);
    expect(component.inputElementRef.nativeElement.focus).toHaveBeenCalled();
  });

});
