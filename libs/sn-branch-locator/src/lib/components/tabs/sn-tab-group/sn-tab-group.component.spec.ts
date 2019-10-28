import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnTabGroupComponent } from './sn-tab-group.component';
import { SnTabComponent } from '../sn-tab/sn-tab.component';
import { Subject } from 'rxjs';
import { IconModule } from 'sn-common-lib';

const onLabelChange$ = new Subject<any>();
describe('SnTabGroupComponent', () => {
  let component: SnTabGroupComponent;
  let fixture: ComponentFixture<SnTabGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SnTabGroupComponent, SnTabComponent],
      imports: [IconModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnTabGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component['_tabs'] = {
      toArray: () => {
        return [{
          index: undefined,
          label: 'tab1',
          setTabInactive: () => { },
          setTabActive: () => { },
          onLabelChange: () => (new Subject()).asObservable()
        }, {
          index: 1,
          label: undefined,
          setTabInactive: () => { },
          setTabActive: () => { },
          onLabelChange: () => onLabelChange$.asObservable()
        }];
      }
    } as any;

    component.startIndex = 1;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not have startIndex', () => {
    component.startIndex = undefined;
    expect(component.startIndex).toBeFalsy();
  });

  it('should have startIndex', () => {
    expect(component.startIndex).toBeTruthy();
  });


  describe('getPosition()', () => {
    it('should left and width 0', () => {
      component.tabslabel = undefined;
      spyOn(component, 'getPosition').and.callThrough();
      expect(component.getPosition).toEqual({
        left: 0,
        width: 0 + '%'
      });
    });

    it('should left and width not 0 and activeIndex < 2 with tabslabel < 3', () => {
      component.tabslabel = ['label 1', 'label 2'];
      component['_activeIndex'] = 1;
      spyOn(component, 'getPosition').and.callThrough();
      expect(component.getPosition).toEqual({
        left: (100 / component.tabslabel.length) + '%',
        width: (100 / component.tabslabel.length) + '%'
      });
    });

    it('should getPosition left and width not 0 and activeIndex < 2 with tabslabel >= 3', () => {
      component.tabslabel = ['label 1', 'label 2', 'label 3'];
      component['_activeIndex'] = 1;
      spyOn(component, 'getPosition').and.callThrough();
      expect(component.getPosition).toEqual({
        left: (100 / component.tabslabel.length) + '%',
        width: (100 / component.tabslabel.length) + '%'
      });
    });

    it('should getPosition left and width not 0 and activeIndex >= 2', () => {
      component.tabslabel = ['label 1', 'label 2'];
      component['_activeIndex'] = 2;
      spyOn(component, 'getPosition').and.callThrough();
      expect(component.getPosition).toEqual({
        left: (100 / component.tabslabel.length) * 2 + '%',
        width: (100 / component.tabslabel.length) + '%'
      });
    });
  });

  describe('ngAfterContentInit()', () => {
    it('should without startIndex', () => {
      component.startIndex = undefined;
      spyOn(component, 'ngAfterContentInit').and.callThrough();
      component.ngAfterContentInit();
      expect(component.ngAfterContentInit).toHaveBeenCalled();
    });

    it('should with startIndex', () => {
      spyOn(component, 'ngAfterContentInit').and.callThrough();
      component.ngAfterContentInit();
      expect(component.ngAfterContentInit).toHaveBeenCalled();
    });
  });

  it('should tabClick', () => {
    spyOn(component, 'tabClick').and.callThrough();
    component.tabClick(1);
    expect(component.tabClick).toHaveBeenCalledWith(1);
  });

  describe('selectIndex()', () => {
    beforeEach(() => {
      spyOn(component, 'tabClick');
    });

    it('should call tabClick()', () => {
      component.selectIndex = 0;
      expect(component.tabClick).toHaveBeenCalled();
    });

    it('should ignore null/undefined values', () => {
      component.selectIndex = null;
      expect(component.tabClick).not.toHaveBeenCalled();
      component.selectIndex = undefined;
      expect(component.tabClick).not.toHaveBeenCalled();
    });

    it('should ignore negative values', () => {
      component.selectIndex = -1;
      expect(component.tabClick).not.toHaveBeenCalled();
    });

    it('should ignore value when tabs are undefined', () => {
      component['_tabs'] = undefined;
      component.selectIndex = 1;
      expect(component.tabClick).not.toHaveBeenCalled();
    });

    it('should ignore value when is higher then tabs length', () => {
      component.selectIndex = 2;
      expect(component.tabClick).not.toHaveBeenCalled();
    });
    it('should change the label when the tab change', () => {
      component.ngAfterContentInit();
      fixture.detectChanges();
      onLabelChange$.next({index: 1, label: 'Hi'});
      // fixture.detectChanges();
      expect(component.tabslabel[1]).toEqual('Hi');

    });
  });
});
