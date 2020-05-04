import {Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit, Inject, OnDestroy} from '@angular/core';
import { MapsAPILoader, LatLngLiteral } from '@agm/core';
import { WindowRefService, GlobileSettingsService, BridgeAnalyticService } from '@globile/mobile-services';
import { EventsAnalyticsVariables } from '../../constants/events-analytics-variables';
import {ConfigurationService} from '../../services/configuration/configuration.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'sn-branch-search',
  templateUrl: './branch-search.component.html',
  styleUrls: ['./branch-search.component.scss']
})
export class BranchSearchInputComponent implements OnInit, OnDestroy {

  @Input() showReCenter: boolean;
  @Output() reCenter = new EventEmitter<MouseEvent>();
  @Output() placeChange = new EventEmitter<LatLngLiteral>();
  @Output() callFilter = new EventEmitter<MouseEvent>();
  @Input() filterCount: number;
  @Input() address: string;

  @ViewChild('in', { static: false }) public inputElementRef: ElementRef<HTMLInputElement>;
  searchBox: google.maps.places.SearchBox;
  hasFilters: boolean;
  private unsubscribe$: Subject<void>;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    @Inject(WindowRefService) private windowRef: WindowRefService,
    private globileSettings: GlobileSettingsService,
    private analyticsService: BridgeAnalyticService,
    private configuration: ConfigurationService

  ) { }

  ngOnInit(): void {
    this.mapsAPILoader.load()
      .then(() => {
        this.initSearchBox();
      });

    this.configuration.settings$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(settings => {

      const allFilters = !settings.filters ? [] : settings.filters.types.concat(settings.filters.types);
      this.hasFilters =   allFilters.length ? true : false;
    });
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  initSearchBox(): void {
    this.searchBox = new this.windowRef['google'].maps.places.SearchBox(this.inputElementRef.nativeElement);
    this.searchBox.addListener('places_changed', () => {
      const places = this.searchBox.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];

        if (places.length > 1) {
          this.sendPerformedSearch();
        } else {
          const sendEvent = EventsAnalyticsVariables.tapSearchResult;
          sendEvent.TermSearched = this.inputElementRef.nativeElement.value ? this.inputElementRef.nativeElement.value : '';
          sendEvent.ClickedResult = place.name ? place.name : '';
          this.analyticsService.sendEvent(sendEvent);
        }

        if (Boolean(place.geometry)) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          this.placeChange.emit({ lat, lng });
        }
      }
    });
  }

  search(): void {
    this.inputElementRef.nativeElement.focus();
    this.windowRef['google'].maps.event.trigger(this.inputElementRef.nativeElement, 'keydown', {
      keyCode: 13
    });
    this.sendPerformedSearch();
  }

  searchBarClicked(): void {
    const sendEvent = EventsAnalyticsVariables.clickSearchBar;
    this.analyticsService.sendEvent(sendEvent);
  }

  sendPerformedSearch() {
    const sendEvent = EventsAnalyticsVariables.performSearch;
    this.analyticsService.sendEvent(sendEvent);
    sendEvent.TermSearched = this.inputElementRef.nativeElement.value ? this.inputElementRef.nativeElement.value : '';
  }
}
