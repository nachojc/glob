import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { google } from '@agm/core/services/google-maps-types';

@Component({
  selector: 'sn-branch-search-input',
  templateUrl: './branch-search-input.component.html',
  styleUrls: ['./branch-search-input.component.scss']
})
export class BranchSearchInputComponent {

  @Input() showReCenter: boolean;
  @Output() reCenter = new EventEmitter<MouseEvent>();
  @Input() filterCount: number;
  @Input() placeholder: string;

  @ViewChild('in') inputEl: ElementRef<HTMLInputElement>;

}
