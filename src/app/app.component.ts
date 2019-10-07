import { Component } from '@angular/core';
// import { LanguageService } from 'sn-branch-locator';
import { LanguageService } from './languages';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'BranchLocator';
  constructor(private translate: LanguageService) {

    translate.setLangs('es');
    translate.setDefaultLang('en');
    translate.use('es');
  }
}
