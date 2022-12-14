import {Component} from '@angular/core';
import {QueryParamsService} from './services/query-params.service';

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
    private queryParamsService: QueryParamsService
  ) {
    const browserLang = navigator.language || window.navigator['userLanguage'];
    this.defaultLang = browserLang.substring(0, 2);

    this.queryParamsService.parametersWatcher.subscribe(param => {
      const lang = param['view'] || param['defaultLang'];

      this.coordinates = param['coordinates'];
      this.address = param['address'];
      if (!!lang && lang !== this.defaultLang) {
        this.defaultLang = lang;
      }
    });
  }

}
