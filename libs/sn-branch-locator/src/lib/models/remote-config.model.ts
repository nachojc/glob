export interface LocatorSettings {
  defaultCoords: [ number, number];
  translations?: [];
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
