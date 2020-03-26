import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { DebugElement, ElementRef } from '@angular/core';
import { By, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { DrawerComponent, DrawerCustomHammerConfig } from './drawer.component';
import { DrawerState } from './drawer-state.enum';


describe('DrawerComponent', () => {
  let component: DrawerComponent;
  let fixture: ComponentFixture<DrawerComponent>;
  let checkboxNativeEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DrawerComponent],
      providers: [{ provide: HAMMER_GESTURE_CONFIG, useClass: DrawerCustomHammerConfig }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawerComponent);
    component = fixture.componentInstance;
    checkboxNativeEl = fixture.debugElement.query(By.css('.sn-drawer-content'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  describe('drawerPan', () => {
    it('Pan Event biger then window heigh, additionalEvent panup', () => {
      fixture.detectChanges();
      spyOn(component, 'drawerPan').and.callThrough();
      fixture.debugElement.triggerEventHandler('pan', { center: { y: 50 }, additionalEvent: 'panup' });
      expect(component.drawerPan).toHaveBeenCalled();
    });

    it('Pan Event biger then window heigh, additionalEvent pandown', () => {
      fixture.detectChanges();
      spyOn(component, 'drawerPan').and.callThrough();
      fixture.debugElement.triggerEventHandler('pan', { center: { y: 50 }, additionalEvent: 'pandown' });
      expect(component.drawerPan).toHaveBeenCalled();
    });

    it('Pan Event smaller then window heigh', () => {
      fixture.detectChanges();
      spyOn(component, 'drawerPan').and.callThrough();
      fixture.debugElement.triggerEventHandler('pan', { center: { y: 0 } });
      // fixture.whenStable().then(() => {
      expect(component.drawerPan).toHaveBeenCalled();
      // });
    });

    it('Pan Event should call _setTranslateY with 20', () => {
      fixture.detectChanges();
      spyOn(component['elementRef'].nativeElement.parentElement, 'clientHeight').and.returnValue(30);
      spyOn<any>(component, '_setTranslateY');
      component['startPositionTop'] = 10;
      component.panArea = true;
      fixture.debugElement.triggerEventHandler('pan', { center: { y: 1 }, additionalEvent: 'panup', deltaY: 10 });
      expect(component['_setTranslateY']).toHaveBeenCalledWith('20px');
    });

    it('Pan Event should call _setTranslateY', () => {
      fixture.detectChanges();
      spyOn(component['elementRef'].nativeElement.parentElement, 'clientHeight').and.returnValue(30);
      spyOn<any>(component, '_setTranslateY');
      component['startPositionTop'] = 10;
      component.distanceTop = 30;
      component.panArea = true;
      fixture.debugElement.triggerEventHandler('pan', { center: { y: 1 }, additionalEvent: 'pandown', deltaY: 10 });
      expect(component['_setTranslateY']).toHaveBeenCalledWith('30px');
    });

  });

  describe('should disable drag', () => {
    beforeEach(() => component.disableDrag = true);
    it('panEvent', async () => {
      fixture.detectChanges();
      const spy = spyOn<any>(component, '_handlePan');
      fixture.debugElement.triggerEventHandler('pan', { center: { y: 0 } });
      fixture.whenStable().then(() => {
        expect(spy).not.toHaveBeenCalled();
      });
    });
    it('panEventStart', async () => {
      fixture.detectChanges();
      const spy = spyOn<any>(component, '_handlePan');
      fixture.debugElement.triggerEventHandler('panstart', { srcEvent: { path: [] } });
      fixture.whenStable().then(() => {
        expect(spy).not.toHaveBeenCalled();
      });
    });
    it('panEventEnd', async () => {
      fixture.detectChanges();
      const spy = spyOn<any>(component, '_handlePan');
      fixture.debugElement.triggerEventHandler('panend', {});
      fixture.whenStable().then(() => {
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });

  it('Pan end Event', async () => {
    fixture.detectChanges();
    const spy = spyOn(component, 'drawerPanEnd').and.callThrough();
    fixture.debugElement.triggerEventHandler('panend', {});
    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalled();
    });
  });

  it('Pan start Event', async () => {
    fixture.detectChanges();
    const spy = spyOn(component, 'drawerPanStart').and.callThrough();
    fixture.debugElement.triggerEventHandler('panstart', { srcEvent: { path: [] } });
    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('setDrawerState', () => {
    it('Change drawer State to Top', () => {
      component.state = DrawerState.Top;
      component.setDrawerState(component.state);
      expect(component.state).toEqual(DrawerState.Top);
    });

    it('Change drawer State to Docked', () => {
      component.state = DrawerState.Docked;
      component.setDrawerState(component.state);
      expect(component.state).toEqual(DrawerState.Docked);
    });

    it('Change drawer State to Bottom', () => {
      component.state = DrawerState.Bottom;
      component.setDrawerState(component.state);
      expect(component.state).toEqual(DrawerState.Bottom);
    });

    it('Change drawer State to undefined', () => {
      component.state = undefined;
      component.setDrawerState(component.state);
      expect(component.state).toBeUndefined();
    });
  });



  describe('drawerPanEnd()', () => {
    it('Pan end Event deltaY  smaller then BOUNCE_DELTA and state is top', async () => {
      component.state = DrawerState.Top;
      fixture.detectChanges();
      spyOn(component, 'drawerPanEnd').and.callThrough();
      // tslint:disable-next-line: no-string-literal
      const drawer = fixture.debugElement.triggerEventHandler('panend', { isFinal: true, deltaY: 0 });

      fixture.whenStable().then(() => {
        expect(component.drawerPanEnd).toHaveBeenCalled();
      });
    });

    it('Pan end Event deltaY  bigger then BOUNCE_DELTA and state is bottom', async () => {
      component.state = DrawerState.Bottom;
      fixture.detectChanges();
      spyOn(component, 'drawerPanEnd').and.callThrough();
      // tslint:disable-next-line: no-string-literal
      const drawer = fixture.debugElement.triggerEventHandler('panend', { isFinal: true, deltaY: -50 });

      fixture.whenStable().then(() => {
        expect(component.drawerPanEnd).toHaveBeenCalled();
      });
    });

    it('Pan end Event deltaY  bigger then BOUNCE_DELTA and state is top', async () => {
      component.state = DrawerState.Top;
      fixture.detectChanges();
      spyOn(component, 'drawerPanEnd');
      const drawer = fixture.debugElement.triggerEventHandler('panend', { isFinal: true, deltaY: 50 });

      fixture.whenStable().then(() => {
        expect(component.drawerPanEnd).toHaveBeenCalled();
      });
    });

    it('Pan end Event deltaY negative and state is docked', async () => {
      component.state = DrawerState.Docked;
      spyOn(component, 'drawerPanEnd');
      fixture.detectChanges();
      // tslint:disable-next-line: no-string-literal
      const drawer = fixture.debugElement.triggerEventHandler('panend', { isFinal: true, deltaY: -50 });

      fixture.whenStable().then(() => {
        expect(component.drawerPanEnd).toHaveBeenCalled();
      });
    });

    it('Pan end Event deltaY posite and state is docked', async () => {
      component.state = DrawerState.Docked;
      fixture.detectChanges();
      spyOn(component, 'drawerPanEnd');
      // tslint:disable-next-line: no-string-literal
      const drawer = fixture.debugElement.triggerEventHandler('panend', { isFinal: true, deltaY: 50 });

      fixture.whenStable().then(() => {
        expect(component.drawerPanEnd).toHaveBeenCalled();
      });
    });

    it('Pan end Event isFinal false an stae is Docked', async () => {
      component.state = DrawerState.Docked;
      fixture.detectChanges();
      spyOn(component, 'drawerPanEnd');
      // tslint:disable-next-line: no-string-literal
      const drawer = fixture.debugElement.triggerEventHandler('panend', { isFinal: false, deltaY: 0 });

      fixture.whenStable().then(() => {
        expect(component.drawerPanEnd).toHaveBeenCalled();
      });
    });

    it('Pan end Event isFinal true an stae is Docked', async () => {
      component.state = DrawerState.Docked;
      fixture.detectChanges();
      spyOn(component, 'drawerPanEnd');
      // tslint:disable-next-line: no-string-literal
      const drawer = fixture.debugElement.triggerEventHandler('panend', { isFinal: true, deltaY: 0 });

      fixture.whenStable().then(() => {
        expect(component.drawerPanEnd).toHaveBeenCalled();
      });
    });
  });

  describe('drawerHandle.click', () => {
    it('should call changeState', () => {
      spyOn(component, 'changeState').and.callThrough();
      const mainElement = fixture.debugElement.nativeElement;
      const drawerHandle = mainElement.querySelector('.drawer-handle');
      drawerHandle.click();
      expect(component.changeState).toHaveBeenCalled();
    });

    it('should change drawer state to docked', () => {
      component.state = DrawerState.Top;
      const mainElement = fixture.debugElement.nativeElement;
      const drawerHandle = mainElement.querySelector('.drawer-handle');
      drawerHandle.click();
      expect(component.state.toString()).toEqual(DrawerState.Docked.toString());
    });

    it('should change drawer state to docked', () => {
      component.state = DrawerState.Docked;
      const mainElement = fixture.debugElement.nativeElement;
      const drawerHandle = mainElement.querySelector('.drawer-handle');
      drawerHandle.click();
      expect(component.state.toString()).toEqual(DrawerState.Top.toString());
    });
  });


  describe('ngOnChanges()', () => {
    it('should set drawer state to docked', fakeAsync(() => {
      fixture.detectChanges();
      component.ngOnChanges({ state: { currentValue: DrawerState.Docked } });
      tick(100);
      expect(component.state).toBe(DrawerState.Docked);
    }));
  });

  describe('handlePanStart()', () => {
    it('should call handlePanStart()', () => {
      spyOn<any>(component, 'handlePanStart').and.callThrough();
      component.handlePanStart();
      expect(component['handlePanStart']).toHaveBeenCalled();
    });
  });

  describe('handlePanEnd()', () => {
    it('should call _handleTopPanEnd() and if deltaY is bigger than _BOUNCE_DELTA, should set drawer state to docked', () => {
      component.state = DrawerState.Top;
      spyOn<any>(component, '_handleTopPanEnd').and.callThrough();
      component.handlePanEnd({ deltaY: 60, isFinal: true });
      expect(component['_handleTopPanEnd']).toHaveBeenCalled();
    });

    it('should call _handleTopPanEnd() and if deltaY is not bigger than _BOUNCE_DELTA, should call _setTranslateY', () => {
      spyOn<any>(component, '_handleTopPanEnd').and.callThrough();
      spyOn<any>(component, '_setTranslateY').and.callThrough();
      component.state = DrawerState.Top;
      component.handlePanEnd({ deltaY: -256, isFinal: true });
      expect(component['_handleTopPanEnd']).toHaveBeenCalled();
      expect(component['_setTranslateY']).toHaveBeenCalled();
    });

    it('should call _handleBottomPanEnd() and if -deltaY is bigger than _BOUNCE_DELTA, should set drawer state to docked', () => {
      spyOn<any>(component, '_handleBottomPanEnd').and.callThrough();
      component.state = DrawerState.Bottom;
      component.handlePanEnd({ deltaY: -60, isFinal: true });
      expect(component['_handleBottomPanEnd']).toHaveBeenCalled();
    });

    it('should call _handleBottomPanEnd() and if -deltaY is not bigger than _BOUNCE_DELTA, should call _setTranslateY', () => {
      spyOn<any>(component, '_handleBottomPanEnd').and.callThrough();
      spyOn<any>(component, '_setTranslateY').and.callThrough();
      component.state = DrawerState.Bottom;
      component.handlePanEnd({ deltaY: 256, isFinal: true });
      expect(component['_handleBottomPanEnd']).toHaveBeenCalled();
      expect(component['_setTranslateY']).toHaveBeenCalled();
    });

    it('should call handleDockedPanEnd()', () => {
      spyOn(component, 'handleDockedPanEnd').and.callThrough();
      component.state = DrawerState.Docked;
      component.handlePanEnd({ isFinal: true });
      expect(component.handleDockedPanEnd).toHaveBeenCalled();
    });


  });



});
