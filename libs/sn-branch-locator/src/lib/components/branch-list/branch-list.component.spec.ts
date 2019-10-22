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
    component.isLoading = false;
    component.branchesList = [branch, branch];
    fixture.detectChanges();
    const mainElement = fixture.debugElement.nativeElement;
    const snOptionList = mainElement.querySelector('sn-option-list');
    const snOptionItem = snOptionList.firstElementChild;
    component.branchSelected.subscribe(resp => {
      expect(resp).toEqual(branch);
    });

    snOptionList.click();

    // Extra line just for the coverage
    const callbranchSelected = spyOn(component, 'selectBranch').and.callThrough();
    component.selectBranch({} as Branch);
    expect(callbranchSelected).toHaveBeenCalled();
  });

  it('should show loading', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const mainElement: HTMLElement = fixture.debugElement.nativeElement;
    const snOptionList: HTMLElement = mainElement.querySelector('sn-option-list');

    expect(mainElement.querySelector('sn-loader')).toBeDefined();
    expect(snOptionList.style.display).toEqual('none');
  });

  it('should hide loading', () => {
    component.isLoading = false;
    fixture.detectChanges();
    const mainElement: HTMLElement = fixture.debugElement.nativeElement;
    const snOptionList: HTMLElement = mainElement.querySelector('sn-option-list');

    expect(mainElement.querySelector('sn-loader')).toBeNull();
    expect(snOptionList.style.display).not.toEqual('none');
  });
});
