import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { DrawerComponent } from './drawer.component';
import { DrawerState } from './drawer-state.enum';




export class DrawerCustomHammerConfig extends HammerGestureConfig {
    overrides = {
      pan: {
        enable: true,
        threshold: 0,
        direction: Hammer.DIRECTION_VERTICAL
      }
    };
}

describe('DrawerComponent', () => {
    let component: DrawerComponent;
    let fixture: ComponentFixture<DrawerComponent>;
    let checkboxNativeEl: DebugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DrawerComponent],
            providers: [{provide: HAMMER_GESTURE_CONFIG, useClass: DrawerCustomHammerConfig}]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawerComponent);
        component = fixture.componentInstance;
        checkboxNativeEl = fixture.debugElement.query(By.css('.sn-drawer-content'));
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Pan Event biger then window heigh, additionalEvent panup', () => {
      fixture.detectChanges();
      // tslint:disable-next-line: no-string-literal
      const drawer = fixture.debugElement.triggerEventHandler('pan', {center : {y: 50}, additionalEvent : 'panup'});
      fixture.whenStable().then(() => {
        expect(component.drawerPan).toHaveBeenCalled();
      });
    });


    it('Pan Event biger then window heigh, additionalEvent pandown', () => {
      fixture.detectChanges();
      // tslint:disable-next-line: no-string-literal
      const drawer = fixture.debugElement.triggerEventHandler('pan', {center : {y: 50}, additionalEvent : 'pandown'});
      fixture.whenStable().then(() => {
        expect(component.drawerPan).toHaveBeenCalled();
      });
    });


    it('Pan Event smaller then window heigh', () => {
      fixture.detectChanges();
      // tslint:disable-next-line: no-string-literal
      const drawer = fixture.debugElement.triggerEventHandler('pan', {center : {y: 0}});
      fixture.whenStable().then(() => {
        expect(component.drawerPan).toHaveBeenCalled();
      });
    });

    it('Pan end Event', () => {
      fixture.detectChanges();
      // tslint:disable-next-line: no-string-literal
      const drawer = fixture.debugElement.triggerEventHandler('panend', {isFinal: true});
      fixture.whenStable().then(() => {
        expect(component.drawerPanEnd).toHaveBeenCalled();
      });
    });



    it('Pan start Event', () => {
      fixture.detectChanges();
      // tslint:disable-next-line: no-string-literal
      const drawer = fixture.debugElement.triggerEventHandler('panstart', {});
      fixture.whenStable().then(() => {
        expect(component.drawerPanStart).toHaveBeenCalled();
      });
    });

    it('Change drawer State to Top', () => {
      component.state = DrawerState.Top;
      component.setDrawerState(component.state);
      expect( component.state ).toEqual(DrawerState.Top);
    });

    it('Change drawer State to Docke', () => {
      component.state = DrawerState.Docked;
      component.setDrawerState(component.state);
      expect( component.state ).toEqual(DrawerState.Docked);
    });

    it('Change drawer State to Bottom', () => {
      component.state = DrawerState.Bottom;
      component.setDrawerState(component.state);
      expect( component.state ).toEqual(DrawerState.Bottom);
    });


    it('Change drawer State to undefined', () => {
      component.state = undefined;
      component.setDrawerState(component.state);
      expect( component.state ).toBeUndefined();
    });


    it('Pan end Event deltaY  smaller then BOUNCE_DELTA and state is top', () => {
      component.state = DrawerState.Top;
      fixture.detectChanges();
      // tslint:disable-next-line: no-string-literal
      const drawer = fixture.debugElement.triggerEventHandler('panend', {isFinal: true, deltaY: 0});

      fixture.whenStable().then(() => {
        expect(component.drawerPanEnd).toHaveBeenCalled();
      });
    });


    it('Pan end Event deltaY  bigger then BOUNCE_DELTA and state is bottom', () => {
      component.state = DrawerState.Bottom;
      fixture.detectChanges();
      // tslint:disable-next-line: no-string-literal
      const drawer = fixture.debugElement.triggerEventHandler('panend', {isFinal: true, deltaY: -50});

      fixture.whenStable().then(() => {
        expect(component.drawerPanEnd).toHaveBeenCalled();
      });
    });



    it('Pan end Event deltaY  bigger then BOUNCE_DELTA and state is top', () => {
      component.state = DrawerState.Top;
      fixture.detectChanges();
      // tslint:disable-next-line: no-string-literal
      const drawer = fixture.debugElement.triggerEventHandler('panend', {isFinal: true, deltaY: 50});

      fixture.whenStable().then(() => {
        expect(component.drawerPanEnd).toHaveBeenCalled();
      });
    });


    it('Pan end Event deltaY negative and state is docked', () => {
      component.state = DrawerState.Docked;
      fixture.detectChanges();
      // tslint:disable-next-line: no-string-literal
      const drawer = fixture.debugElement.triggerEventHandler('panend', {isFinal: true, deltaY: -50});

      fixture.whenStable().then(() => {
        expect(component.drawerPanEnd).toHaveBeenCalled();
      });
    });


    it('Pan end Event deltaY posite and state is docked', () => {
      component.state = DrawerState.Docked;
      fixture.detectChanges();
      // tslint:disable-next-line: no-string-literal
      const drawer = fixture.debugElement.triggerEventHandler('panend', {isFinal: true , deltaY: 50});

      fixture.whenStable().then(() => {
        expect(component.drawerPanEnd).toHaveBeenCalled();
      });
    });


    it('Pan end Event isFinal false an stae is Docked', () => {
      component.state = DrawerState.Docked;
      fixture.detectChanges();
      // tslint:disable-next-line: no-string-literal
      const drawer = fixture.debugElement.triggerEventHandler('panend', {isFinal: false , deltaY: 0});

      fixture.whenStable().then(() => {
        expect(component.drawerPanEnd).toHaveBeenCalled();
      });
    });


    it('Pan end Event isFinal true an stae is Docked', () => {
      component.state = DrawerState.Docked;
      fixture.detectChanges();
      // tslint:disable-next-line: no-string-literal
      const drawer = fixture.debugElement.triggerEventHandler('panend', {isFinal: true , deltaY: 0});

      fixture.whenStable().then(() => {
        expect(component.drawerPanEnd).toHaveBeenCalled();
      });
    });



});
