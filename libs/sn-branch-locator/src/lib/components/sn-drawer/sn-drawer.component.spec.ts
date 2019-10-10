import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnDrawerComponent } from './sn-drawer.component';

import * as Hammer from 'hammerjs';

import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { DrawerState } from './models/sn-drawer-state.model';

export class SliderCustomHammerConfig extends HammerGestureConfig {
  overrides = {
    pan: {
      direction: Hammer.DIRECTION_VERTICAL
    }
  };
}

describe('SnDrawerComponent', () => {
  let component: SnDrawerComponent;
  let fixture: ComponentFixture<SnDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnDrawerComponent ],
      providers: [{provide: HAMMER_GESTURE_CONFIG, useClass: SliderCustomHammerConfig}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Pan Event biger then window heigh, additionalEvent panup', () => {
    fixture.detectChanges();

    const drawer = fixture.debugElement.triggerEventHandler('pan', {center : {y: 50}, additionalEvent : 'panup'});
    fixture.whenStable().then(() => {
      expect(component.drawerPan).toHaveBeenCalled();
    });
  });


  it('Pan Event biger then window heigh, additionalEvent pandown', () => {
    fixture.detectChanges();

    const drawer = fixture.debugElement.triggerEventHandler('pan', {center : {y: 50}, additionalEvent : 'pandown'});
    fixture.whenStable().then(() => {
      expect(component.drawerPan).toHaveBeenCalled();
    });
  });


  it('Pan Event smaller then window heigh', () => {
    fixture.detectChanges();

    const drawer = fixture.debugElement.triggerEventHandler('pan', {center : {y: 0}});
    fixture.whenStable().then(() => {
      expect(component.drawerPan).toHaveBeenCalled();
    });
  });

  it('Pan end Event', () => {
    fixture.detectChanges();

    const drawer = fixture.debugElement.triggerEventHandler('panend', {isFinal: true});
    fixture.whenStable().then(() => {
      expect(component.drawerPanEnd).toHaveBeenCalled();
    });
  });



  it('Pan start Event', () => {
    fixture.detectChanges();

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

    const drawer = fixture.debugElement.triggerEventHandler('panend', {isFinal: true, deltaY: 0});

    fixture.whenStable().then(() => {
      expect(component.drawerPanEnd).toHaveBeenCalled();
    });
  });


  it('Pan end Event deltaY  bigger then BOUNCE_DELTA and state is bottom', () => {
    component.state = DrawerState.Bottom;
    fixture.detectChanges();

    const drawer = fixture.debugElement.triggerEventHandler('panend', {isFinal: true, deltaY: -50});

    fixture.whenStable().then(() => {
      expect(component.drawerPanEnd).toHaveBeenCalled();
    });
  });



  it('Pan end Event deltaY  bigger then BOUNCE_DELTA and state is top', () => {
    component.state = DrawerState.Top;
    fixture.detectChanges();

    const drawer = fixture.debugElement.triggerEventHandler('panend', {isFinal: true, deltaY: 50});

    fixture.whenStable().then(() => {
      expect(component.drawerPanEnd).toHaveBeenCalled();
    });
  });


  it('Pan end Event deltaY negative and state is docked', () => {
    component.state = DrawerState.Docked;
    fixture.detectChanges();

    const drawer = fixture.debugElement.triggerEventHandler('panend', {isFinal: true, deltaY: -50});

    fixture.whenStable().then(() => {
      expect(component.drawerPanEnd).toHaveBeenCalled();
    });
  });


  it('Pan end Event deltaY posite and state is docked', () => {
    component.state = DrawerState.Docked;
    fixture.detectChanges();

    const drawer = fixture.debugElement.triggerEventHandler('panend', {isFinal: true , deltaY: 50});

    fixture.whenStable().then(() => {
      expect(component.drawerPanEnd).toHaveBeenCalled();
    });
  });


  it('Pan end Event isFinal false an stae is Docked', () => {
    component.state = DrawerState.Docked;
    fixture.detectChanges();

    const drawer = fixture.debugElement.triggerEventHandler('panend', {isFinal: false , deltaY: 0});

    fixture.whenStable().then(() => {
      expect(component.drawerPanEnd).toHaveBeenCalled();
    });
  });


  it('Pan end Event isFinal true an stae is Docked', () => {
    component.state = DrawerState.Docked;
    fixture.detectChanges();

    const drawer = fixture.debugElement.triggerEventHandler('panend', {isFinal: true , deltaY: 0});

    fixture.whenStable().then(() => {
      expect(component.drawerPanEnd).toHaveBeenCalled();
    });
  });








});
