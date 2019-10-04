import { Component } from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './modules/languages/lib/languages.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'BranchLocator';
  constructor(private translate: LanguageService) {
    translate.setDefaultLang('en');
    translate.use('en');
  }
}
