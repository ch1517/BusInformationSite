export interface BusStopInterface {
    citycode: number;
    gpslati: number;
    gpslong: number;
    nodeid: string;
    nodenm: string;
}
export interface RouteInformation {
    routeid?: string; //노선 ID
    routeno?: string; // 노선번호
    arrtime?: number; // 도착예정버스 도착예상시간[초]
    arrprevstationcnt?: number; // 도착예정버스 남은 정류장 수
    routeInfo?: any;
}

export interface InformationProps {
    mapMode: number;
    station: any[];
    selectBusStop: BusStopInterface | null;
    settingBusStop: (citycode: number, gpslati: number, gpslong: number, nodeid: string, nodenm: string) => void;
    setMapMode: (mapMode: number) => void;
}