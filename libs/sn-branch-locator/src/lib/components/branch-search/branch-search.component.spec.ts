import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BranchSearchInputComponent} from './branch-search.component';
import {IconModule} from 'sn-common-lib';
import {AgmCoreModule, MapsAPILoader} from '@agm/core';
import {ElementRef} from '@angular/core';
import {GlobileSettingsService, WindowRefService} from '@globile/mobile-services';
import {HttpClientModule} from '@angular/common/http';

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
  branchLocator: {
    hasFilters: true,
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
        HttpClientModule
      ],
      providers: [
        { provide: MapsAPILoader, useValue: MapsAPILoaderMock },
        { provide: WindowRefService, useValue: windowRef },
        { provide: GlobileSettingsService, useValue: env }
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
    component['windowRef']['google'].maps.event = {
      trigger: () => null
    } as any;
    spyOn(component.inputElementRef.nativeElement, 'focus');
    component.search();
    expect(component.inputElementRef.nativeElement.focus).toHaveBeenCalled();
  });

});
