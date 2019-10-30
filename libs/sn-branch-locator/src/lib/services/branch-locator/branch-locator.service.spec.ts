import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { ENV_CONFIG } from '@globile/mobile-services';
import { SnBranchLocatorService } from './branch-locator.service';
import { branchMock } from '../../helpers/branch.mock';
import { Branch } from '../../models/branch.model';
import { environment } from 'src/environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterService } from '../filter/filter.service';

describe('SnBranchLocatorService', () => {
  let httpTestingController: HttpTestingController;
  let service: SnBranchLocatorService;
  const branchMock2: Branch =  Object.assign({}, branchMock, {distanceInKm: 123, id: '1'});
  const atmMock: Branch = Object.assign({}, branchMock, {objectType: {code: 'ATM'}, id: '2'});
  const filterserviceMock = {
    filterParams: {}
  };

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      ReactiveFormsModule
    ],
    providers: [
      { provide: ENV_CONFIG, useValue: environment },
      { provide: FilterService, useValue: filterserviceMock }
    ]
  }));

  beforeEach(() => {
    service = TestBed.get(SnBranchLocatorService);
  });


  afterEach(() => {
    httpTestingController.verify();
  });


  it('should be created', () => {
    httpTestingController = TestBed.get(HttpTestingController);
    expect(service).toBeTruthy();
  });


  describe('groupAtmToBranch()', () => {

    // it('should return an array with 2 objects and 1 atm inside the first one', () => {
    //   const response = service['groupAtmToBranch']([branchMock, branchMock2, atmMock]);
    //   expect(response.length).toBe(2);
    //   expect(response[0].atm[0].id).toBe('2');
    // });


    it('should return an array with 2 objects and 1 atm inside the first one - different order', () => {
      atmMock.distanceInKm = 123;
      const response = service['groupAtmToBranch']([atmMock, branchMock, branchMock2]);
      expect(response.length).toBe(2);
      expect(response[0].atm[0].id).toBe('2');
    });



    it('should return an array with 1 objects and 2 atm inside', () => {
      atmMock.distanceInKm = 123;
      const atmMock2 = Object.assign({}, atmMock, {id: '3'});
      const atmMock3 = Object.assign({}, atmMock, {id: '4'});
      const response = service['groupAtmToBranch']([atmMock, atmMock2, atmMock3, branchMock2]);
      expect(response.length).toBe(1);
      expect(response[0].atm.length).toBe(3);
    });
  });

  describe('getBranchesByBounds()', () => {
    it('should return an array with 1 length', () => {
      spyOn(service.http, 'get').and.returnValue(of([branchMock, branchMock, branchMock]));
      service.onChange.subscribe(res => {
        expect(res.length).toBe(1);
      });
      service.getBranchesByBounds({lat: 1, lng: 2}, {lat: 3, lng: 4}, {lat: 52, lng: -0.78});
    });

    it('should return an array with 1 length', () => {
      spyOn(service.http, 'get').and.returnValue(of([branchMock, branchMock2, atmMock]));
      service.onChange.subscribe(res => {
        expect(res.length).toBe(1);
      });
      service.getBranchesByBounds({lat: 1, lng: 2}, {lat: 3, lng: 4}, {lat: 52, lng: -0.78});
    });

    it('should call get function passing: API_URL/find/defaultView?config={"coords":[1,2]}', () => {
      spyOn(service.http, 'get').and.returnValue(of([branchMock, branchMock2, atmMock]));
      const apiUrl = encodeURI(`${service.branchLocator.endpoints[1].URL}/find/defaultView?northEast=1,2&southWest=3,4`);
      service.onChange.subscribe(res => {
        expect(service.http.get).toHaveBeenCalledWith(apiUrl, { params: filterserviceMock.filterParams });
      });
      service.getBranchesByBounds({lat: 1, lng: 2}, {lat: 3, lng: 4}, {lat: 52, lng: -0.78});

    });

    it('should throwError', () => {
      spyOn(service.http, 'get').and.returnValue(throwError(new Error('Fake Error')));
      service.onChange.subscribe(() => {
      }, (err) => expect(err).toBeDefined());
      service.getBranchesByBounds({lat: 1, lng: 2}, {lat: 3, lng: 4}, {lat: 52, lng: -0.78});

    });
  });


  describe('getBranchesByCoords()', () => {
    it('should return an array with length equal to 1', () => {
      spyOn(service.http, 'get').and.returnValue(of([branchMock, branchMock, branchMock]));
      service.onChange.subscribe(res => {
        expect(res.length).toBe(1);
      });
      service.getBranchesByCoords({lat: 1, lng: 2});
    });

    it('should return an array with length equal to 1', () => {
      spyOn(service.http, 'get').and.returnValue(of([branchMock, branchMock2, atmMock]));
      service.onChange.subscribe(res => {
        expect(res.length).toBe(1);
      });
      service.getBranchesByCoords({lat: 1, lng: 2});
    });


    it('should throwError', () => {
      spyOn(service.http, 'get').and.returnValue(throwError(new Error('Fake Error')));
      service.onChange.subscribe(() => {
      }, (err) => expect(err).toBeDefined());
      service.getBranchesByCoords({lat: 1, lng: 2});
    });


    it('should call get function passing: API_URL/find/defaultView?config={"coords":[1,2]}', () => {
      spyOn(service.http, 'get').and.returnValue(of([branchMock, branchMock2, atmMock]));
      const apiUrl = encodeURI(`${service.branchLocator.endpoints[1].URL}/find/defaultView?config={"coords":[1,2]}`);
      service.onChange.subscribe(res => {
        expect(service.http.get).toHaveBeenCalledWith(apiUrl);
      });
      service.getBranchesByCoords({lat: 1, lng: 2});

    });
  });

});
