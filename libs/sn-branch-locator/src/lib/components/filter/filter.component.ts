import {Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, Renderer2, ViewChild, ViewChildren} from '@angular/core';
import {FilterService} from '../../services/filter/filter.service';
import {FormGroup, NgForm} from '@angular/forms';
import {ViewsAnalyticsVariables} from '../../constants/views-analytics-variables';
import {BridgeAnalyticService} from '@globile/mobile-services';
import {EventsAnalyticsVariables} from '../../constants/events-analytics-variables';
import {ConfigurationService} from '../../services/configuration/configuration.service';
import {LocatorFilters} from '../../models/remote-config.model';
import {take} from 'rxjs/operators';
import {CheckboxComponent} from 'sn-common-lib/atoms/checkbox/checkbox.component';

@Component({
  selector: 'sn-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Input() get isOpen() { return this.isFilterOpen; }
  @Output() filterApply = new EventEmitter();
  @Output() filterDeployed = new EventEmitter();

  @ViewChildren('types') typesCheckboxes!: QueryList<CheckboxComponent>;

  public form: FormGroup;
  public selectedFilters = {};
  public isHideTurnOffButton = true;
  private isFilterOpen: boolean = false;

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
      .pipe(take(1))
      .subscribe((form) => {
      this.form = form;
    });
    this.configuration.settings$
      .pipe(take(1))
      .subscribe(
      (settings ) => {
        this.filters = settings.filters;
      }
    );
  }

  private show(): void {
    this.isFilterOpen = true;

    // this.renderer.removeStyle(this.el.nativeElement, 'display');
    // this.renderer.setStyle(this.el.nativeElement, 'overflow-y', 'auto');
  }

  private hide(): void {
    this.isFilterOpen = false;
    // this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
  }

  public close(): void {
    this.hide();
  }

  public apply(hide: boolean = true): void {
    const sendEvent = EventsAnalyticsVariables.tapApplyFilters;
    this.analyticsService.sendEvent(sendEvent);
    this.snFilterService.applyChanges();
    this.filterApply.emit({
      count: this.snFilterService.count,
      values: this.snFilterService.filterParams
    });

    if (hide) {
      this.hide();
    }
  }

  public toggle(): void {
     if (!this.isFilterOpen) {
        this.show();
     } else {
       this.hide();
     }
  }

  public open(): void {
    this.show();
    const sendView = ViewsAnalyticsVariables.filterScreen;
    this.analyticsService.sendView(sendView);
    this.snFilterService.startFilter();
  }

  public selectFilter(event: any, clearTypes?: boolean): void {
    const eventUniqueId = event.source._uniqueId;

    if (clearTypes) {
      console.log(this.typesCheckboxes);
      this.typesCheckboxes.forEach(component => {
        if (this.selectedFilters.hasOwnProperty(component.id)) {
          // delete this.selectedFilters[component.id];
          component._inputElement.nativeElement.click();
        }
      });
    }

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

    this.apply(false);
  }

  public getFilterIcon(code: string): string {
    return 'sn-BAN005'; // todo : implement
  }

  public switchFilterButton(): void {
    this.selectedFilters = {};
    this.isHideTurnOffButton = true;
    const sendEvent = EventsAnalyticsVariables.tapCleanFilters;
    this.analyticsService.sendEvent(sendEvent);

    this.apply(false);
  }
}
