import { Component, OnInit, Renderer2, ElementRef, Output, EventEmitter } from '@angular/core';
import { FilterService } from './services/sn-filter.service';
import { FormGroup } from '@angular/forms';


@Component({
    selector: 'sn-filter',
    templateUrl: './sn-filter.component.html',
    styleUrls: ['./sn-filter.component.scss']
})
export class FilterComponent implements OnInit {


    @Output() filterApply = new EventEmitter();

    public form: FormGroup;

    constructor(
        private snFilterService: FilterService,
        private renderer: Renderer2,
        private el: ElementRef
    ) { }

    ngOnInit(): void {
        this.hide();
        this.form = this.snFilterService.initForm();
    }

    private show(): void {
        this.renderer.removeStyle(this.el.nativeElement, 'display');
    }

    private hide(): void {
        this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
    }

    public close(): void {
        this.hide();
    }

    public apply(): void {
        this.snFilterService.applyChanges();
        this.filterApply.emit({
            values: this.snFilterService.values,
            count: this.snFilterService.count
        });
        this.hide();
    }

    public open(): void {
        this.show();
        this.snFilterService.startFilter();
    }

}
