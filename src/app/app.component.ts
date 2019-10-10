import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'BranchLocator';
  constructor(
    private translate: TranslateService
    ) {

    translate.setDefaultLang('en');
    translate.use('es');
  }

  search(event) {
    console.log(event);
  }


}
