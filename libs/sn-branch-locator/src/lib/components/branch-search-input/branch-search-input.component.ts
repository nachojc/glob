import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit, Inject } from '@angular/core';
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

  @ViewChild('in') public inputElementRef: ElementRef<HTMLInputElement>;
  searchBox: google.maps.places.SearchBox;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    @Inject('WINDOW') private windowRef: any
  ) { }


  ngOnInit(): void {
    this.mapsAPILoader.load()
      .then(() => {
        if (this.useGoogle) {
          // this.initGoogleAutoCommplete();
          this.initSearchBox();
        }
      });

  }


  initSearchBox(): void {
    this.searchBox = new this.windowRef.google.maps.places.SearchBox(this.inputElementRef.nativeElement);
    this.searchBox.addListener('places_changed', () => {

      const places = this.searchBox.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        if (Boolean(place.geometry)) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          this.placeChange.emit({ lat, lng });
        }
      }
    });


  }


  search(event: MouseEvent): void {
    this.inputElementRef.nativeElement.focus();
    this.windowRef.google.maps.event.trigger(this.inputElementRef.nativeElement, 'keydown', {
      keyCode: 13
    });

  }







}
