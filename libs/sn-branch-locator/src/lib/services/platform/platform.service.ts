import { Injectable } from '@angular/core';
import { isNumber } from 'util';

@Injectable({
  providedIn: 'root'
})
export class Platform {

  constructor() {
    console.log(window.clientInformation);
    // tslint:disable-next-line: deprecation
    console.log(window.orientation);
    console.log(window.screen);
    console.log(window.navigator.mediaDevices);
    console.log(window.navigator.platform);


  }

  get orientation() {
    // tslint:disable-next-line: deprecation
    return window.orientation;
  }

  get isMobile(): boolean {
    // tslint:disable-next-line: deprecation
    return isNumber(orientation) && window.navigator.userAgent.toLowerCase().includes('mobile');
  }

  get isDesktop(): boolean {
    return !this.isMobile;
  }




}
