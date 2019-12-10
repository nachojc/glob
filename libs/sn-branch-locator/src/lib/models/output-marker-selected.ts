import { Branch } from './branch.model';
import { LatLngLiteral } from '@agm/core';

export interface OutputMarkerSelected {
    marker: Branch;
    userPosition: LatLngLiteral;
}
