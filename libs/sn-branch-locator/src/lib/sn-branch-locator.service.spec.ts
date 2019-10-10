import { TestBed } from '@angular/core/testing';
import { SnBranchLocatorService } from './sn-branch-locator.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('SnBranchLocatorService', () => {
  let httpTestingController: HttpTestingController;
  let service: SnBranchLocatorService;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));


  afterEach(() => {
    httpTestingController.verify();
  });


  it('should be created', () => {
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(SnBranchLocatorService);
    expect(service).toBeTruthy();
  });
});
