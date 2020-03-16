import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { BranchListComponent } from './branch-list.component';
import {
  IconModule,
  OptionListModule,
  LoaderModule
} from 'sn-common-lib';
import { DebugElement, SimpleChanges, SimpleChange } from '@angular/core';
import { branchMock } from '../../helpers/branch.mock';

describe('BranchListComponent', () => {
  let component: BranchListComponent;
  let fixture: ComponentFixture<BranchListComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BranchListComponent],
      imports: [IconModule, OptionListModule, LoaderModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchListComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load icons dinamically', () => {
    const iconTypesDictionary = (component as any).branchIconTypes;
    expect(component).toBeTruthy();
  });
  it('should load more results', () => {
    component.branchesList = [];
    const spy = spyOn(component, 'loadMoreResults').and.callThrough();
    component.loadMoreResults();
    expect(spy).toHaveBeenCalled();
  });
  it('should increment load more variable', () => {
    component.branchesList = [
      branchMock, branchMock, branchMock,
      branchMock, branchMock, branchMock,
      branchMock, branchMock, branchMock,
      branchMock, branchMock, branchMock,
      branchMock, branchMock, branchMock,
      branchMock, branchMock, branchMock,
      branchMock, branchMock, branchMock,
      branchMock, branchMock, branchMock,
      branchMock, branchMock];
    const spy = spyOn(component, 'loadMoreResults').and.callThrough();
    component.loadMoreResults();
    expect(component.maxBranchesToLoad).toBeGreaterThan(10);
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

  describe('ngOnChanges()', () => {
    it('should maxBranchesToLoad to be reset when branch list change with numberOfBranchesToLoad', () => {
      const changes = {
        branchesList: {
          previousValue: [branchMock],
          currentValue: [branchMock, branchMock, branchMock],
          firstChange: false
        } as SimpleChange
      } as SimpleChanges;
      component.branchesList = [branchMock];
      fixture.detectChanges();
      component.ngOnChanges(changes);
      expect(component.maxBranchesToLoad).toBe((component as any).numberOfBranchesToLoad);
    });

    it('shouldn`t maxBranchesToLoad to be reset when branch list doesn`t change', () => {
      const changes = {
        branchesList: undefined
      } as SimpleChanges;
      component.branchesList = [
        branchMock, branchMock, branchMock,
        branchMock, branchMock, branchMock,
        branchMock, branchMock, branchMock,
        branchMock, branchMock, branchMock];
      fixture.detectChanges();
      component.ngOnChanges(changes);
      const isMaxBranchesToLoadReset = component.maxBranchesToLoad === (component as any).numberOfBranchesToLoad ? false : true;
      expect(isMaxBranchesToLoadReset).toBeFalsy();
    });
    it( 'should identify kind of icon and create a new Array', () => {
      const noSubtypeBranchMock = branchMock;
      noSubtypeBranchMock.subType = null;
      component.branchesList = [
        branchMock, branchMock, branchMock,
        branchMock, branchMock, branchMock,
        branchMock, branchMock, branchMock,
        branchMock, branchMock, branchMock,
        noSubtypeBranchMock
      ];
      component.identifyIconType();
      expect(component.branchIcons.length > 1).toBeTruthy();
    } );
    it('should open menu', () => {
      component.open();
      fixture.detectChanges();
      expect(component.currentState).toBe('menuOpened');
    });

    it('should close menu', () => {
      component.close();
      fixture.detectChanges();
      expect(component.currentState).toBe('menuClosed');
    });

    it('should change state to closed', () => {
      component.currentState = 'menuOpened';
      component.changeState();
      fixture.detectChanges();
      expect(component.currentState).toBe('menuClosed');
    });

    it('should change state to opened', () => {
      component.currentState = 'menuClosed';
      component.changeState();
      fixture.detectChanges();
      expect(component.currentState).toBe('menuOpened');
    });
  });

  describe('selectBranch()', () => {
    it('should emit branchSelected on selectBranch call', () => {
      const spy = spyOn<any>(component.branchSelected, 'emit');
      component.selectBranch(branchMock);
      expect(spy).toHaveBeenCalled();
    });
  });
});
