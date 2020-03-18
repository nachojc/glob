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
    translate.setDefaultLang('en');
    this.queryParamsService.parametersWatcher.subscribe(param => {
      this.coordinates = param['coordinates'];
      this.address = param['address'];
      this.defaultLang = param['defaultLang'];
      translate.use(this.defaultLang);
    });
  }

}
