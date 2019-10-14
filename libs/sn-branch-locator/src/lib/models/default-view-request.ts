export interface FilterParams {
    filterType?: string;
    filterSubType?: string;
}
interface CoordsParams {
    coords: number[];
}

export interface ConfigParam {
    config: CoordsParams;
}

export interface DefaultViewRequest extends FilterParams, ConfigParam {

}




