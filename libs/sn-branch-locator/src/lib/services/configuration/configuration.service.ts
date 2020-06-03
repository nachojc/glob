import {Inject, Injectable} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocatorSettings } from '../../models/remote-config.model';
import { ObservableInput, of, ReplaySubject } from 'rxjs';
import { LatLngLiteral } from '@agm/core';
import { GlobileSettingsService } from '@globile/mobile-services';
import { GeoPositionService } from '../geo-position/geo-position.service';
import {
  EnvBranchLocatorEndPointModel,
  EnvBranchLocatorModel
} from '../../models/env-branch-locator.model';
import { catchError, first, timeout } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import LiteralsAggregator from './literals.helper';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  public get settings$() {
    return this.settings.asObservable();
  }


  constructor(
    private activatedRoute: ActivatedRoute,
    private globileSettings: GlobileSettingsService,
    private geoPosition: GeoPositionService,
    private http: HttpClient,
    private translateService: TranslateService,
    @Inject('ENV_CONFIG') private _enviroment
  ) {
    this.branchLocatorEnv = this._enviroment.branchLocator;

    this.activatedRoute.queryParams.pipe(first()).subscribe(params => {
      const viewType = params['view'] || this.paramDefaultView;
      const coordinates = params['coordinates'] || '';
      const address = params['address'] || '';

      this.geoPosition
        .getCurrentPosition()
        .pipe(first())
        .subscribe(
          (pos: Position) => {
            this.baseEndpoint = this.resolveConfigUrl(pos);
            this.fetchRemoteConfig(this.baseEndpoint, viewType, coordinates, address);
          },
          () => {
            this.baseEndpoint = this.resolveConfigUrl();
            this.fetchRemoteConfig(this.baseEndpoint, viewType, coordinates, address);
          }
        );
    });

    // this.settings$.subscribe((settings) => {
    //   LiteralsAggregator.inject(settings.literals).into(this.translateService);
    // });
  }
  private paramDefaultView = 'defaultView';
  private remoteFetchTimeout = 10000;
  private branchLocatorEnv: EnvBranchLocatorModel;
  private baseEndpoint: string;

  private settings = new ReplaySubject<LocatorSettings>();
  private fetchRemoteConfig(baseEndpoint, viewType, coordinates, address) {
    const configEndpoint = baseEndpoint + '/view/' + viewType;
    this.http
      .get<any>(configEndpoint)
      .pipe(
        timeout(this.remoteFetchTimeout),
        catchError(
          (err, caught): ObservableInput<any> => {
            return of({ coords: null });
          }
        )
      )
      .subscribe(response => {
        const settings = this.buildSettings(response, viewType, coordinates, address);
        this.settings.next(settings);
      });
  }

  private buildSettings(response, viewType, coordinates, address): LocatorSettings {

    const settings: LocatorSettings = {
      paramView: viewType,
      paramCoordinates: coordinates,
      paramAddress: address,
      defaultCoords: response.coords,
      literals: [],
      filters: {
        types: [],
        features: []
      }
    };

    if (response.language.defaultLanguage
      && response.literals.hasOwnProperty(response.language.defaultLanguage)
    ) {
      const langLiterals = response.literals[response.language.defaultLanguage];
      settings.literals = Object.keys(langLiterals).map((code) => {
        return {
          code,
          content: langLiterals[code]
        };
      });
    }


    const types = response.filters.tipoPOI;
    if (types && types !== {}) {
      for (const filter in types) {
        if (types[filter].visible) {
          settings.filters.types.push({
            code: filter,
            active: types[filter].active
          });
        }
      }
    }

    const features = response.filters.featurePOI;
    if (features && features !== {}) {
      for (const filter in features) {
        if (features[filter].visible) {
          settings.filters.features.push({
            code: filter,
            active: features[filter].active
          });
        }
      }
    }

    return settings;
  }

  resolveConfigUrl(pos?: Position): string {
    const endpoints = this.branchLocatorEnv.endpoints;

    if (!endpoints || !endpoints.length) {
      throw new Error(
        'No branch locator configuration endpoints have been defined.'
      );
    }

    if (!pos) {
      return endpoints[0].URL;
    }

    const nearestEndpoint = this.branchLocatorEnv.endpoints.reduce(
      (resultEndpoint, thisEndpoint): EnvBranchLocatorEndPointModel => {
        if (!resultEndpoint) {
          return thisEndpoint;
        }
        const thisEndpointDistance = this.getDistance(pos, thisEndpoint);
        const resultEndpointDistance = this.getDistance(pos, resultEndpoint);
        return thisEndpointDistance < resultEndpointDistance
          ? thisEndpoint
          : resultEndpoint;
      }
    );
    return nearestEndpoint.URL;
  }
  // todo - move this out of branch-locator.service.ts

  private getDistance(userPos: Position, endpoint: LatLngLiteral): number {
    const p1 = { lat: userPos.coords.latitude, lng: userPos.coords.longitude };
    const p2 = { lat: endpoint.lat, lng: endpoint.lng };

    const rad = x => (x * Math.PI) / 180;
    const R = 6378.137;
    const dLat = rad(p2.lat - p1.lat);
    const dLong = rad(p2.lng - p1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(p1.lat)) *
      Math.cos(rad(p2.lat)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  }
}
