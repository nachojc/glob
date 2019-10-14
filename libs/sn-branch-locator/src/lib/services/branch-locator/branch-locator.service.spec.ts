import { TestBed } from '@angular/core/testing';
import { SnBranchLocatorService } from './branch-locator.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { branchMock } from '../../helpers/branch.mock';
import { Branch } from '../../models/branch.model';
import { of } from 'rxjs';

describe('SnBranchLocatorService', () => {
  let httpTestingController: HttpTestingController;
  let service: SnBranchLocatorService;
  const branchMock2: Branch =  Object.assign({}, branchMock, {distanceInKm: 123, id: '1'});
  const atmMock: Branch = Object.assign({}, branchMock, {objectType: {code: 'ATM'}, id: '2'});

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  beforeEach(() => {
    service = TestBed.get(SnBranchLocatorService);
  });


  afterEach(() => {
    httpTestingController.verify();
  });


  it('should be created', () => {
    httpTestingController = TestBed.get(HttpTestingController);
    // service = TestBed.get(SnBranchLocatorService);
    expect(service).toBeTruthy();
  });


  describe('groupAtmToBranch()', () => {

    it('should return an array with 2 objects and 1 atm inside the first one', () => {
      const response = service['groupAtmToBranch']([branchMock, branchMock2, atmMock]);
      expect(response.length).toBe(2);
      expect(response[0].atm.id).toBe('2');
    });


    it('should return an array with 2 objects and 1 atm inside the first one - different order', () => {
      atmMock.distanceInKm = 123;
      const response = service['groupAtmToBranch']([atmMock, branchMock, branchMock2]);
      expect(response.length).toBe(2);
      expect(response[0].atm.id).toBe('2');
    });
  });

  describe('getBranchesByBounds()', () => {
    it('should return an array with 1 length', () => {
      spyOn(service.http, 'get').and.returnValue(of([branchMock, branchMock, branchMock]));
      service.getBranchesByBounds({lat: 1, lng: 2}, {lat: 3, lng: 4}).subscribe(res => {
        expect(res.length).toBe(1);
      });
    });

    it('should return an array with 1 length', () => {
      spyOn(service.http, 'get').and.returnValue(of([branchMock, branchMock2, atmMock]));
      service.getBranchesByBounds({lat: 1, lng: 2}, {lat: 3, lng: 4}).subscribe(res => {
        expect(res.length).toBe(2);
      });
    });

    it('should call get function passing: API_URL/find/defaultView?config={"coords":[1,2]}', () => {
      spyOn(service.http, 'get').and.returnValue(of([branchMock, branchMock2, atmMock]));
      // TODO: Integrate with environment URL
      service.getBranchesByBounds({lat: 1, lng: 2}, {lat: 3, lng: 4}).subscribe(res => {
        expect(service.http.get).toHaveBeenCalledWith(
          `https://back-weu.azurewebsites.net/branch-locator/find/defaultView?northEast=1,2&southWest=3,4`);
      });
    });
  });


  describe('getBranchesByCoords()', () => {
    it('should return an array with length equal to 1', () => {
      spyOn(service.http, 'get').and.returnValue(of([branchMock, branchMock, branchMock]));
      service.getBranchesByCoords({lat: 1, lng: 2}).subscribe(res => {
        expect(res.length).toBe(1);
      });
    });

    it('should return an array with length equal to 2', () => {
      spyOn(service.http, 'get').and.returnValue(of([branchMock, branchMock2, atmMock]));
      service.getBranchesByCoords({lat: 1, lng: 2}).subscribe(res => {
        expect(res.length).toBe(2);
      });
    });


    it('should call get function passing: API_URL/find/defaultView?config={"coords":[1,2]}', () => {
      spyOn(service.http, 'get').and.returnValue(of([branchMock, branchMock2, atmMock]));
      // TODO: Integrate with environment URL
      service.getBranchesByCoords({lat: 1, lng: 2}).subscribe(res => {
        expect(service.http.get).toHaveBeenCalledWith(
          `https://back-weu.azurewebsites.net/branch-locator/find/defaultView?config={"coords":[1,2]}`);
      });
    });
  });

});
