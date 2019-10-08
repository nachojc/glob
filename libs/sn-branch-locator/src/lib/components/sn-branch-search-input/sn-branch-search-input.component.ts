import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sn-branch-search-input',
  templateUrl: './sn-branch-search-input.component.html',
  styleUrls: ['./sn-branch-search-input.component.scss']
})
export class SnBranchSearchInputComponent {

  @Input() showReCenter: boolean;
  @Output() reCenter = new EventEmitter<MouseEvent>();
  @Input() filterCount: number;
  @Input() placeholder: string;



}
