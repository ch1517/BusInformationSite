import apiKey from '../../private/apiKey.json';
import { apiRequest } from '../../apiRequest';
import useSWR from 'swr';
import { BusStopInterface, RouteInformation } from './interface';
const serviceKey = apiKey.station_key; // 버스정류장 정보조회 Key

/**
 * 노선의 기본정보(종점, 출발점, 버스종류)를 반환하는 API 호출
 * @param routeno 
 * @param routeid 
 * @returns 
 */
const getRouteInfoIem = async (citycode: number, routeid: string) => {
    const parameter = `?serviceKey=${serviceKey}&cityCode=${citycode}&routeId=${routeid}`;
    const url = `/BusRouteInfoInqireService/getRouteInfoIem${parameter}`;
    try {
        const response = await apiRequest(url);
        let header = response.data.response.header;
        let data = response.data.response.body;
        // api 조회 정상적으로 완료 했을 때 
        if (header.resultCode === "00" || header.resultCode === 0) {
            let item = data.items.item;
            return item;
        }
        return header.resultCode;
    } catch (e) {
        console.log(e);
        return -1;
    }
}
export const useArravalInfo = (selectBusStop: BusStopInterface | null, mapMode: number) => {
    const getBusArravalInfoFetcher = async (url: string, args: string) => {
        try {
            const response = await apiRequest(`${url}?serviceKey=${serviceKey}&${args}`);
            let header = response.data.response.header;
            let data = response.data.response.body;
            // api 조회 정상적으로 완료 했을 때 
            if (header.resultCode === "00" || header.resultCode === 0) {
                var items = data.items;
                var newArr: any = [];
                if (items['item'] != null) {
                    items = items.item;
                    // 배열이며, 길이가 0이 아닐 때
                    if (items.length !== 0 && Array.isArray(items)) {
                        newArr = await Promise.all(items.map(async ({ routeno, routeid, arrtime, arrprevstationcnt }) => {
                            var newInfo: RouteInformation = {};
                            newInfo['routeid'] = routeid;
                            newInfo['routeno'] = routeno;
                            newInfo['arrtime'] = arrtime;
                            newInfo['arrprevstationcnt'] = arrprevstationcnt;
                            let routeInfo = await getRouteInfoIem(selectBusStop!.citycode, routeid);
                            newInfo['routeInfo'] = routeInfo;
                            return newInfo;
                        }))
                    } else if (typeof (items) === 'object') {
                        let newInfo: RouteInformation = {};
                        newInfo['routeid'] = items['routeid'];
                        newInfo['routeno'] = items['routeno'];
                        newInfo['arrtime'] = items['arrtime'];
                        newInfo['arrprevstationcnt'] = items['arrprevstationcnt'];
                        let routeInfo = await getRouteInfoIem(selectBusStop!.citycode, items['routeid']);
                        newInfo['routeInfo'] = routeInfo;
                        newArr.push(newInfo);
                    } else {
                        console.log(items);
                    }
                }
                // 도착 시간 순으로 정렬
                newArr.sort((x: RouteInformation, y: RouteInformation) => x.arrtime! - y.arrtime!);
                return newArr;
            } else {
                console.log(data.header.resultCode)
            }
        } catch (e) {
            console.log(e);
        }
    }
    const { data, error, mutate } = useSWR(
        selectBusStop !== null && mapMode === 1 ? ['/ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList',
            `&cityCode=${selectBusStop!.citycode}&nodeId=${selectBusStop!.nodeid}`] : null, getBusArravalInfoFetcher, { refreshInterval: 60000 });

    return {
        arravalInfo: data,
        arravalInfoState: !error && !data,
        isError: error,
        arravalInfoMutate: mutate
    }
}
export const useRouteInfo = (selectBusStop: BusStopInterface | null, mapMode: number, selectRoute: RouteInformation | null) => {
    //노선별로 버스의 GPS 위치정보의 목록을 조회 
    const getBusInfoByRouteIdFecher = async (url: string, nodeData: RouteInformation) => {
        const param = `cityCode=${selectBusStop?.citycode}&routeId=${nodeData.routeid}&numOfRows=500`;
        try {
            const response = await apiRequest(`${url}?serviceKey=${serviceKey}&${param}`);
            let header = response.data.response.header;
            let data = response.data.response.body;
            // api 조회 정상적으로 완료 했을 때 
            if (header.resultCode === "00" || header.resultCode === 0) {
                let item = data.items?.item;
                if (nodeData.routeInfo)
                    nodeData.routeInfo.busStopList = item ? item : [];
                else
                    nodeData.routeInfo = undefined;
                return nodeData;
            }
        } catch (e) {
            console.log(e);
        }
    }

    // route information
    const { data, error } = useSWR(
        selectBusStop !== null && selectRoute !== null && mapMode === 2 ?
            ['/BusRouteInfoInqireService/getRouteAcctoThrghSttnList', selectRoute] : null, getBusInfoByRouteIdFecher)

    return {
        routeInfo: data,
        routeInfoState: !error && !data,
        isError: error
    }
}
export const useArravalInRoute = (selectBusStop: BusStopInterface | null, mapMode: number, selectRoute: RouteInformation | null) => {
    /**
      * 노선별로 버스의 GPS 위치정보의 목록을 조회
      */
    const getRouteAcctoBusLcListFetcher = async (url: string, nodeData: RouteInformation) => {
        const param = `cityCode=${selectBusStop!.citycode}&routeId=${nodeData.routeid}`;
        try {
            const response = await apiRequest(`${url}?serviceKey=${serviceKey}&${param}`);
            let header = response.data.response.header;
            let data = response.data.response.body;
            // api 조회 정상적으로 완료 했을 때 
            if (header.resultCode === "00" || header.resultCode === 0) {
                let item = data.items.item;
                return item;
            }
        } catch (e) {
            console.log(e);
        }

    }
    const { data, error, mutate } = useSWR(
        selectBusStop !== null && selectRoute !== null && mapMode === 2 ?
            ['/BusLcInfoInqireService/getRouteAcctoBusLcList', selectRoute] : null, getRouteAcctoBusLcListFetcher, { refreshInterval: 60000 })

    return {
        arravalInRoute: data,
        arravalInRouteState: !error && !data,
        arravalInRouteMutate: mutate
    }
}
