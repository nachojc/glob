import {Component, OnInit, Renderer2, ElementRef, Output, EventEmitter, Input, OnDestroy} from '@angular/core';
import { FilterService } from '../../services/filter/filter.service';
import { FormGroup } from '@angular/forms';
import { ViewsAnalyticsVariables } from '../../constants/views-analytics-variables';
import { BridgeAnalyticService } from '@globile/mobile-services';
import { EventsAnalyticsVariables } from '../../constants/events-analytics-variables';
import {SnBranchLocatorService} from '../../services/branch-locator/branch-locator.service';
import {ConfigurationService} from '../../services/configuration/configuration.service';
import {LocatorFilters, LocatorSettings} from '../../models/remote-config.model';
import {Observable, of, Subject} from 'rxjs';
import {mergeMap, takeUntil} from 'rxjs/operators';


@Component({
  selector: 'sn-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {


  @Input() get isOpen() { return this.isFilterOpen; }
  @Output() filterApply = new EventEmitter();

  public form: FormGroup;
  public selectedFilters = {};
  public isHideTurnOffButton = true;
  private isFilterOpen: boolean = false;
  private unsubscribe$: Subject<void>;

  filters: LocatorFilters;

  constructor(
    private snFilterService: FilterService,
    private renderer: Renderer2,
    private el: ElementRef,
    private analyticsService: BridgeAnalyticService,
    private configuration: ConfigurationService
  ) { }

  ngOnInit(): void {
    this.hide();
    this.snFilterService.initForm()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((form) => {
      this.form = form;
    });
    this.configuration.settings$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
      (settings ) => {
        this.filters = settings.filters;
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  private show(): void {
    this.isFilterOpen = true;
    this.renderer.removeStyle(this.el.nativeElement, 'display');
    this.renderer.setStyle(this.el.nativeElement, 'overflow-y', 'auto');
  }

  private hide(): void {
    this.isFilterOpen = false;
    this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
  }

  public close(): void {
    this.hide();
  }

  public apply(): void {
    const sendEvent = EventsAnalyticsVariables.tapApplyFilters;
    this.analyticsService.sendEvent(sendEvent);
    this.snFilterService.applyChanges();
    this.filterApply.emit({
      count: this.snFilterService.count,
      values: this.snFilterService.filterParams
    });
    this.hide();
  }

  public open(): void {
    this.show();
    const sendView = ViewsAnalyticsVariables.filterScreen;
    this.analyticsService.sendView(sendView);
    this.snFilterService.startFilter();
  }

  public selectFilter(event: any): void {
    const eventUniqueId = event.source._uniqueId;

    if (this.selectedFilters.hasOwnProperty(eventUniqueId)) {
      delete this.selectedFilters[eventUniqueId];
    } else {
      this.selectedFilters[eventUniqueId] = {
        checked: event.checked
      };
    }

    if (Object.entries(this.selectedFilters).length === 0) {
      this.isHideTurnOffButton = true;
    } else {
      this.isHideTurnOffButton = false;
    }
  }

  public getFilterIcon(code: string): string {
    return 'sn-BAN005'; // todo : implement
  }

  public switchFilterButton(): void {
    this.selectedFilters = {};
    this.isHideTurnOffButton = true;
    const sendEvent = EventsAnalyticsVariables.tapCleanFilters;
    this.analyticsService.sendEvent(sendEvent);
  }
}
