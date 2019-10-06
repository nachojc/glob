import { TestBed, async, inject } from '@angular/core/testing';

import { BranchLocatorService } from './branch-locator.service';

describe('BranchLocatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BranchLocatorService = TestBed.get(BranchLocatorService);
    expect(service).toBeTruthy();
  });

  // it('When getNames is called Then return an observable list of strings', async(
  //   inject([BranchLocatorService], (nameService) => {

  //     nameService.watchPosition().subscribe((pos: Position) => {
  //       expect(pos).toBeTruthy();
  //     });
  //   })));





});
