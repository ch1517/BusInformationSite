import { apiRequest } from '../../apiRequest';
import { LatLng } from 'leaflet';
import useSWR from 'swr';
import apiKey from '../../private/apiKey.json';
import { MapInfoInterface } from './interface';

const serviceKey = apiKey.station_key; // 버스정류장 정보조회 Key
export const useStations = (position: [number, number], map: MapInfoInterface | null, apiState: boolean) => {
  // 화면의 latlng 내에 있는지 체크
  const checkLatLngOut = (item: any, _southWest: LatLng, _northEast: LatLng) => {
    if (item["lat"] < _southWest.lat || item["lat"] > _northEast.lat
      || item["lng"] < _southWest.lng || item["lng"] > _northEast.lng)
      return false;
    return true;
  }
  /**
   * 정류장 정보가 두 개씩 나오는 경우 하나 필터링
   * @param nodeid 
   * @returns 
   */
  const nodeidFiltering = (nodeid: string) => {
    const ignoreList = ['GHB', 'GOB'];
    let result = true;
    ignoreList.forEach(name => {
      if (nodeid.includes(name)) {
        result = false;
        return;
      }
    })
    return result;
  }
  const fetcher = async (url: string, args: string) => {
    const southWest = map!.southWest;
    const northEast = map!.northEast;
    if (southWest !== undefined && northEast !== undefined) {
      try {
        const response = await apiRequest(`${url}?serviceKey=${serviceKey}&${args}`);
        let header = response.data.response.header;
        let data = response.data.response.body;
        if (header.resultCode === "00" || header.resultCode === 0) {
          // api 조회 정상적으로 완료 했을 때 
          let items = data.items.item;
          let newData: any[] = [];
          if (items == null || items === undefined) {
            newData = [];
          } else if (Array.isArray(items)) {
            items.forEach((item) => {
              if (checkLatLngOut(item, southWest, northEast) && nodeidFiltering(item.nodeid)) {
                newData.push(item);
              }
            });
          } else {
            if (!checkLatLngOut(items, southWest, northEast)) {
              newData = [items];
            } else {
              newData = [];
            }
          }
          return newData;
        } else {
          console.log(data);
        }
      } catch (e) {
        console.log(e);
      }
    }
  };
  const { data, error, mutate } = useSWR(apiState ? ['/BusSttnInfoInqireService/getCrdntPrxmtSttnList', `gpsLati=${position[0]}&gpsLong=${position[1]}`] : null, fetcher);

  return {
    stations: data,
    stationsState: !error && !data,
    stationsMutate: mutate
  }
}
