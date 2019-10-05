import { TestBed } from '@angular/core/testing';
import { SnBranchLocatorService } from './sn-branch-locator.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('SnBranchLocatorService', () => {
  let httpTestingController: HttpTestingController;
  let service: SnBranchLocatorService;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  httpTestingController = TestBed.get(HttpTestingController);
  service = TestBed.get(SnBranchLocatorService);

  afterEach(() => {
    httpTestingController.verify();
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
