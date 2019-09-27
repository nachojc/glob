import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnDrawerComponent } from './sn-drawer.component';

import * as Hammer from 'hammerjs';

import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

export class SliderCustomHammerConfig extends HammerGestureConfig {
  overrides = {
    pan: {
      direction: Hammer.DIRECTION_VERTICAL
    }
  };
}

@NgModule({
  declarations: [SnDrawerComponent],
  imports: [
    CommonModule
  ],
  exports: [SnDrawerComponent],
  providers: [{provide: HAMMER_GESTURE_CONFIG, useClass: SliderCustomHammerConfig}]
})
export class SnDrawerModule { }
