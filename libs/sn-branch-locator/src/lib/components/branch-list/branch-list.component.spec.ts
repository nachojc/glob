import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchListComponent } from './branch-list.component';
import { Branch } from '../../models/branch.model';
import { IconModule, OptionListModule, LoaderModule } from 'sn-common-lib';

describe('BranchListComponent', () => {
  let component: BranchListComponent;
  let fixture: ComponentFixture<BranchListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchListComponent ],
      imports: [IconModule, OptionListModule, LoaderModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit on click' , () => {
    const branch: Branch = {} as Branch;
    component.branchSelected.subscribe(resp => {
      expect(resp).toEqual(branch);
    });
    component.selectBranch(branch);
  });
});
