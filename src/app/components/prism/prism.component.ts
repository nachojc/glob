import { Component, Input, AfterViewInit, ViewChild, ElementRef} from '@angular/core';

import * as Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-json';


@Component({
  selector: 'sn-prism,[sn-prism]',
  templateUrl: './prism.component.html',
  styleUrls: ['./prism.component.scss']
})
export class PrismComponent implements AfterViewInit {
  @ViewChild('code', {static: false}) codeEl: ElementRef;


  _language: string;
  class: string;

  @Input() set language(language: string) {
    this.class = `language-${language}`;
    this._language = language;
  }

  constructor() { }


  ngAfterViewInit(): void {
    const el = this.codeEl.nativeElement as Element;
    el.innerHTML = Prism.highlight(el.textContent, Prism.languages[this._language], this._language);
  }

}
