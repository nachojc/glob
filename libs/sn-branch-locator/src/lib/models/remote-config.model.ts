export interface LocatorSettings {
  paramView: string;
  paramCoordinates: string;
  paramAddress: string;
  defaultCoords: [number, number];
  translations?: [];
  literals?: LocatorLiteral[];
  filters?: LocatorFilters;
  language?: {
    defaultLanguage: string
  };
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


