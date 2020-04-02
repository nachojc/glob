import { Component, OnInit, Renderer2, ElementRef, Output, EventEmitter } from '@angular/core';
import { FilterService } from '../../services/filter/filter.service';
import { FormGroup } from '@angular/forms';
import { ViewsAnalyticsVariables } from '../../constants/views-analytics-variables';
import { BridgeAnalyticService } from '@globile/mobile-services';
import { EventsAnalyticsVariables } from '../../constants/events-analytics-variables';


@Component({
  selector: 'sn-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {


  @Output() filterApply = new EventEmitter();

  public form: FormGroup;
  public selectedFilters = {};
  public isHideTurnOffButton = true;

  constructor(
    private snFilterService: FilterService,
    private renderer: Renderer2,
    private el: ElementRef,
    private analyticsService: BridgeAnalyticService
  ) { }

  ngOnInit(): void {
    this.hide();
    this.form = this.snFilterService.initForm();
  }

  private show(): void {
    this.renderer.removeStyle(this.el.nativeElement, 'display');
    this.renderer.setStyle(this.el.nativeElement, 'overflow-y', 'auto');

  }

  private hide(): void {
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

  public switchFilterButton(): void {
    this.selectedFilters = {};
    this.isHideTurnOffButton = true;
    const sendEvent = EventsAnalyticsVariables.tapCleanFilters;
    this.analyticsService.sendEvent(sendEvent);
  }

}
