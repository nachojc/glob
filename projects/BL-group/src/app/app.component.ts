import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { QueryParamsService } from './services/query-params.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public coordinates: string;
  public address: string;
  public defaultLang: string;

  constructor(
    private translate: TranslateService,
    private queryParamsService: QueryParamsService
  ) {
    const browserLang = navigator.language || window.navigator['userLanguage'];
    this.defaultLang = browserLang.substring(0, 2);
    this.translate.setDefaultLang(this.defaultLang);
    translate.use(this.defaultLang);

    this.queryParamsService.parametersWatcher.subscribe(param => {
      this.coordinates = param['coordinates'];
      this.address = param['address'];
      if (param['defaultLang'] && param['defaultLang'] !== this.defaultLang) {
        this.defaultLang = param['defaultLang'];
        this.translate.setDefaultLang(this.defaultLang);
        translate.use(this.defaultLang);
      }
    });
  }

}
