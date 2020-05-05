import { Injectable } from '@angular/core';
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
    private http: HttpClient
  ) {
    this.branchLocatorEnv = globileSettings.branchLocator;

    this.activatedRoute.queryParams.pipe(first()).subscribe(params => {
      const viewType = params['view'] || this.paramDefaultView;

      this.geoPosition
        .getCurrentPosition()
        .pipe(first())
        .subscribe(
          (pos: Position) => {
            this.baseEndpoint = this.resolveConfigUrl(pos);
            this.fetchRemoteConfig(this.baseEndpoint, viewType);
          },
          () => {
            this.baseEndpoint = this.resolveConfigUrl();
            this.fetchRemoteConfig(this.baseEndpoint, viewType);
          }
        );
    });
  }
  private paramDefaultView = 'defaultView';
  private remoteFetchTimeout = 10000;
  private branchLocatorEnv: EnvBranchLocatorModel;
  private baseEndpoint: string;

  private settings = new ReplaySubject<LocatorSettings>();
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
        )
      )
      .subscribe(response => {
        const settings = this.buildSettings(response);
        console.log('CONFIG - fetchRemoteConfig -> next', settings);
        this.settings.next(settings);
      });
  }

  private buildSettings(response): LocatorSettings {
    const settings: LocatorSettings = {
      defaultCoords: response.coords,
      translations: response.literals,
      filters: {
        types: [],
        features: []
      }
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
