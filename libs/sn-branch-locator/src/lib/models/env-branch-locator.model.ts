export interface EnvBranchLocatorEndPointModel {
    URL: string;
    lat: number;
    lng: number;
    IP?: string;
    location?: string;
    region?: string;
}
export interface EnvBranchLocatorModel {
    endpoints: EnvBranchLocatorEndPointModel[];
    labelsEndpoint: string;
    googleApiKey?: string;
    googleApiLibs: Array<string>;
    languages: string;
}

