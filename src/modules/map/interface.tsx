import { LatLng } from 'leaflet';
export interface MapInterface {
    position: [number, number];
    zoomLevel: number;
    station: any[];
    selectID: string;
    apiState: boolean;
    setPosition: (position: [number, number]) => void;
    setStation: (station: any[]) => void;
    setZoomLevel: (zoomLevel: number) => void;
    setSelectID: (selectID: string) => void;
    settingBusStop: (citycode: number, gpslati: number, gpslong: number, nodeid: string, nodenm: string) => void;
    setApiState: (apiState: boolean) => void;
}
export interface MapInfoInterface {
    center?: LatLng,
    southWest?: LatLng,
    northEast?: LatLng
}