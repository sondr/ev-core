export interface LatLng {
    lat: number;
    lng: number;
}

export interface MarkerData {
    lat: number;
    lng: number;
    data?: any;
    opts?: any;
}

export interface IMapCustomElement {
    center: LatLng;
    zoom: number;
    markers: MarkerData[];
    autoFitBounds: boolean;
    mapOptions?: any;
    tileLayerOptions?: any;
}