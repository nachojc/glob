import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Branch } from '../../models/branch.model';
import { TranslateService } from '@ngx-translate/core';
import { Routes } from '../../models/routes.model';
import { Durations} from '../../models/durations.model';

@Component({
  selector: 'sn-branch-direction',
  templateUrl: './sn-branch-direction.component.html',
  styleUrls: ['./sn-branch-direction.component.scss']
})
export class SnBranchDirectionComponent {
  private _branch: Branch;
  private _routes: Array<Routes>;
  private _durations: Durations;
  public isBranch = true;
  public selectedRoute = 'DRIVING';

  @Input()
  set branch(value: Branch) {
    this._branch = value;
  }
  get branch() {
    return this._branch;
  }

  @Input()
  set routes(value: Array<Routes>) {
    this._routes = value;
  }
  get routes() {
    return this._routes;
  }

  @Input()
  set durations(value: Durations) {
    this._durations = value;
  }
  get durations() {
    return this._durations;
  }

  @Output() branchDirection = new EventEmitter<any>();

  constructor(public translate: TranslateService) { }

  emitDirectionCoords(geoCoords: any) {
    this.selectedRoute = geoCoords.travelMode;
    this.branchDirection.emit(geoCoords);
  }
}
