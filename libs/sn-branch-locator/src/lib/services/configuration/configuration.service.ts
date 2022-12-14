import { Inject, Injectable } from '@angular/core';
import { LocatorSettings } from '../../models/remote-config.model';
import {Observable, ObservableInput, of, ReplaySubject} from 'rxjs';
import { LatLngLiteral } from '@agm/core';
import { GeoPositionService } from '../geo-position/geo-position.service';
import {
  EnvBranchLocatorEndPointModel,
  EnvBranchLocatorModel
} from '../../models/env-branch-locator.model';
import {catchError, first, map, switchMap, timeout} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  public get settings$() {
    return this.settings.asObservable();
  }

  constructor(
    private geoPosition: GeoPositionService,
    private http: HttpClient,
    @Inject('ENV_CONFIG') private _environment
  ) {
    this.branchLocatorEnv = this._environment.branchLocator;

  }

  private paramDefaultView = 'defaultView';
  private remoteFetchTimeout = 10000;
  private LANG_VAR = '${lang}';
  private branchLocatorEnv: EnvBranchLocatorModel;
  private baseEndpoint: string;

  private settings = new ReplaySubject<LocatorSettings>();

  public initConfig(view?: string) {
    const viewType = view || this.paramDefaultView;

    this.geoPosition
      .getCurrentPosition()
      .pipe(first())
      .subscribe(
        (pos: Position) => {
          this.baseEndpoint = this.resolveConfigUrl(pos);
          this.fetchRemoteConfig(
            this.baseEndpoint,
            viewType,
          );
        },
        () => {
          this.baseEndpoint = this.resolveConfigUrl();
          this.fetchRemoteConfig(
            this.baseEndpoint,
            viewType,
          );
        }
      );
  }

  private fetchRemoteConfig(baseEndpoint, viewType) {
    const configEndpoint = baseEndpoint + '/view/' + viewType;

    this.http
      .get<any>(configEndpoint)
      .pipe(
        timeout(this.remoteFetchTimeout),
        catchError(
          (err, caught): ObservableInput<any> => {
            return of({ coords: null });
          }
        ),
      )
      .subscribe(response => {

        this.buildSettings(
          response,
          viewType,
        ).subscribe(settings => this.settings.next(settings));
      });
  }

  private buildSettings(response, viewType): Observable<LocatorSettings> {

    const settings: LocatorSettings = {
      paramView: viewType,
      defaultCoords: response.coords,
      literals: [],
      filters: {
        types: [],
        features: []
      },
      language: response.language
    };

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

    if (!response.language.defaultLanguage) {
      return of(settings);
    }

    const literalsEndpoint = this.branchLocatorEnv.labelsEndpoint.replace(this.LANG_VAR, response.language.defaultLanguage);

    return this.http.get<any>(literalsEndpoint).pipe(
      timeout(this.remoteFetchTimeout),
      catchError(
        (): ObservableInput<any> => {
          return of(settings);
        }
      ),
      switchMap<any, Observable<LocatorSettings>>(literalsResponse => {
        const literalsObj = [];
        Object.keys(literalsResponse).forEach(labelKey => literalsObj.push({
          code : labelKey,
          content : literalsResponse[labelKey]
        }));
        settings.literals = literalsObj;
        return of(settings);
      })
    );
  }

  resolveConfigUrl(pos ?: Position)  {

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
