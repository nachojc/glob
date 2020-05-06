export interface LocatorSettings {
  defaultCoords: [ number, number];
  literals?: LocatorLiteral[];
  filters?: LocatorFilters;
}

export interface LocatorFilters {
  types?: LocatorFilter[];
  features?: LocatorFilter[];
  languages?: LocatorFilter[];
}

interface LocatorFilter {
  code: string;
  active: boolean;
}

export interface LocatorLiteral {
  code: string;
  content: string;
}


