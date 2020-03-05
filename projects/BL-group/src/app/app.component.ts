import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Subscriber, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute
  ) {
    translate.setDefaultLang('en');
    translate.use('pt');

    this.sub = this.route
      .queryParams
      .subscribe(params => {
        console.log(params);
        this.coordinates = params['coordinates'];
      });

    // this.coordinates = this.route.snapshot.queryParamMap.get('coordinates');
  }

  private sub: any;
  id: string;

  coordinates: any;

  ngOnInit() {
    /*
    console.log(this.route);
    this.coordinates = this.route.snapshot.queryParamMap.get('coordinates');
    */

    /* const defaultLang = this.route.snapshot.queryParamMap.get('defaultLang');
    const address = this.route.snapshot.queryParamMap.get('address');
    const coordinates = this.route.snapshot.queryParamMap.get('coordinates');
    console.log(defaultLang, address, coordinates); */
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
