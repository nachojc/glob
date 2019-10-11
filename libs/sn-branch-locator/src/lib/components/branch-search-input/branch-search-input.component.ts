import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit, NgZone, Inject } from '@angular/core';
import { MapsAPILoader, LatLngLiteral } from '@agm/core';

@Component({
  selector: 'sn-branch-search-input',
  templateUrl: './branch-search-input.component.html',
  styleUrls: ['./branch-search-input.component.scss']
})
export class BranchSearchInputComponent implements OnInit {

  @Input() showReCenter: boolean;
  @Output() reCenter = new EventEmitter<MouseEvent>();
  @Output() placeChange = new EventEmitter<LatLngLiteral>();
  @Input() filterCount: number;
  @Input() placeholder: string;
  @Input() useGoogle: boolean;

  @ViewChild('in') public elementRef: ElementRef<HTMLInputElement>;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    @Inject('WINDOW') private windowRef: any
  ) { }


  ngOnInit(): void {
    if (this.useGoogle) {
      this.initGoogleAutoCommplete();
    }
  }

  initGoogleAutoCommplete(): void {
    this.mapsAPILoader.load()
    .then( () => {
      const autocomplete = new this.windowRef.google.maps.places
        .Autocomplete(this.elementRef.nativeElement, {
          types: ['address']
        });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {

          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (Boolean(place.geometry)) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            this.placeChange.emit({lat, lng});
          }
        });
      });
    });
  }

}
