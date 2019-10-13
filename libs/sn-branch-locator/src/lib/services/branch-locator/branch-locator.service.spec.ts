import { TestBed } from '@angular/core/testing';
import { SnBranchLocatorService } from './branch-locator.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ENV_CONFIG } from '@globile/mobile-services';
import { environment } from 'src/environments/environment';

describe('SnBranchLocatorService', () => {
  let httpTestingController: HttpTestingController;
  let service: SnBranchLocatorService;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      { provide: ENV_CONFIG, useValue: environment }
    ]
  }));


  afterEach(() => {
    httpTestingController.verify();
  });


  it('should be created', () => {
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(SnBranchLocatorService);
    expect(service).toBeTruthy();
  });


  // it('should call getBranchesByBounds and return empty []', inject([SnBranchLocatorService], (nameService: SnBranchLocatorService) => {
  //   nameService.getBranchesByBounds({lat: 1, lng: 2}, {lat: 3, lng: 4}).subscribe(res => {
  //     expect(res).toBe([]);
  //   });
  // }));
});
