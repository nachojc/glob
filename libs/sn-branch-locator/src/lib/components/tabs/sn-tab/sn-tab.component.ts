import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sn-tab',
  templateUrl: './sn-tab.component.html',
  styleUrls: ['./sn-tab.component.scss']
})
export class SnTabComponent implements OnInit {

  @Input() label = '';
  @Input() icon: string;

  constructor() { }

  ngOnInit() {
  }

}
