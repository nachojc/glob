import { TestBed, inject } from '@angular/core/testing';

import { SnBranchLocatorService } from './sn-branch-locator.service';
import { HttpClientModule } from '@angular/common/http';
import { branchMock } from './sn-branch-locator.component.spec';
import { of } from 'rxjs';
import { async } from 'q';
import { toBase64String } from '@angular/compiler/src/output/source_map';

describe('SnBranchLocatorService', () => {
  let service: SnBranchLocatorService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    })
    .compileComponents();
    service = TestBed.get(SnBranchLocatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getBranchesByBounds and return empty []', inject([SnBranchLocatorService], (nameService: SnBranchLocatorService) => {
    nameService.getBranchesByBounds({lat: 1, lng: 2}, {lat: 3, lng: 4}).subscribe(res => {
      expect(res).toBe([]);
    });
  }));

});
