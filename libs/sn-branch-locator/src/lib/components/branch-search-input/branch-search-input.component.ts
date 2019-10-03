import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit, OnChanges, NgZone } from '@angular/core';
import { MapsAPILoader, LatLngLiteral } from '@agm/core';
import { from, fromEvent } from 'rxjs';

@Component({
  selector: 'sn-branch-search-input',
  templateUrl: './branch-search-input.component.html',
  styleUrls: ['./branch-search-input.component.scss']
})
export class BranchSearchInputComponent implements OnInit {

  @Input() showReCenter: boolean;
  @Output() reCenter = new EventEmitter<MouseEvent>();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() placeChange = new EventEmitter<LatLngLiteral>();
  @Input() filterCount: number;
  @Input() placeholder: string;
  @Input() useGoogle: boolean;

  @ViewChild('in') private elementRef: ElementRef<HTMLInputElement>;

  get googleSearchInput(): HTMLInputElement {
    return this.elementRef.nativeElement;
  }


  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {

  }


  ngOnInit(): void {
    if (this.useGoogle) {
      this.initGoogleAutoCommplete();
    }
  }


  initGoogleAutoCommplete(): void {
    from(this.mapsAPILoader.load()).subscribe(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.googleSearchInput, {
        types: ['address']
      });

      console.log(autocomplete);
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {

          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          if (place.geometry !== undefined || place.geometry !== null) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            this.placeChange.emit({lat, lng});
          }
        });
      });
    });


  }

}
