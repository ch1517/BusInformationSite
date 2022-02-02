
import React, { useEffect, useState } from 'react';
import apiKey from '../../private/apiKey.json';
import { apiRequest } from '../../apiRequest';
import RotateLoader from "react-spinners/RotateLoader";
import './style.css';
import { BusSVG } from '../../static/images/bus';

const serviceKey = apiKey.station_key; // 버스정류장 정보조회 Key

interface BusStopInterface {
  citycode: number;
  gpslati: number;
  gpslong: number;
  nodeid: string;
  nodenm: string;
  // nodeno: number;
}
interface RouteInformation {
  routeid?: string; //노선 ID
  routeno?: string; // 노선번호
  arrtime?: number; // 도착예정버스 도착예상시간[초]
  arrprevstationcnt?: number; // 도착예정버스 남은 정류장 수
  routeInfo?: any;
}

interface BusArravalInfoProps {
  array: RouteInformation[];
}

interface RouteInformation {
  routeno?: string; // 노선번호
  arrtime?: number; // 도착예정버스 도착예상시간[초]
  arrprevstationcnt?: number; // 도착예정버스 남은 정류장 수
}

const BusArravalInfo = (data: any, index: number) => {
  const time = Math.floor(data.arrtime! / 60);
  let busColor: string = '#146ACC';
  switch (data.routeInfo.routetp) {
    case "간선버스":
      busColor = "#008039";
      break;
    case "좌석버스":
      busColor = "#CC1100";
      break;
    default:
      break;
  }
  return (
    <div key={index}>
      <BusSVG fill={busColor} />
      <div className="info-div">
        <div className="route-info">
          <div className="route-number">
            {data.routeno}
          </div>
          {typeof data.routeInfo !== "number" &&
            <div className="route-start-end">
              {`${data.routeInfo.startnodenm}↔${data.routeInfo.endnodenm}`}
            </div>
          }
        </div>
        <div>{data.routeInfo.routetp}</div>
        <div className="arraval-info">
          <span>{time < 3 ? ("잠시 후 도착") : (`${time}분`)}</span>
          <span>{data.arrprevstationcnt}정류장</span>
        </div>
      </div>
    </div>
  )
}

interface InformationProps {
  mapMode: number;
  station: any[];
  selectBusStop: BusStopInterface | null;
  settingBusStop: (citycode: number, gpslati: number, gpslong: number, nodeid: string, nodenm: string) => void;
}

const Information: React.FC<InformationProps> = ({ mapMode, station, selectBusStop, settingBusStop }) => {
  const [arravalInfo, setArravalInfo] = useState<any>([]);
  const [refreshTime, setRefreshTime] = useState<string | null>(null);
  // 로딩 state
  const [loadState, setLoadState] = useState(false);
  const refreshTimeSave = () => {
    const date = new Date();
    setRefreshTime(`${date.getHours()}:${date.getMinutes()}`);
  }
  const getBusArravalInfo = async () => {
    setLoadState(true);
    const parameter = `?serviceKey=${serviceKey}&cityCode=${selectBusStop!.citycode}&nodeId=${selectBusStop!.nodeid}`;
    const url = `/ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList${parameter}`;
    let response = await apiRequest(url);
    let header = response.data.response.header;
    let data = response.data.response.body;
    if (header.resultCode === "00" || header.resultCode === 0) {
      // api 조회 정상적으로 완료 했을 때 
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
            let routeInfo = await getRouteNoList(routeno, routeid);
            newInfo['routeInfo'] = routeInfo;
            return newInfo;
          }))
        } else if (typeof (items) === 'object') {
          let newInfo: RouteInformation = {};
          newInfo['routeid'] = items['routeid'];
          newInfo['routeno'] = items['routeno'];
          newInfo['arrtime'] = items['arrtime'];
          newInfo['arrprevstationcnt'] = items['arrprevstationcnt'];
          let routeInfo = await getRouteNoList(items['routeno'], items['routeid']);
          newInfo['routeInfo'] = routeInfo;
          newArr.push(newInfo);
        } else {
          console.log(items);
        }
      }
      // 도착 시간 순으로 정렬
      newArr.sort((x: RouteInformation, y: RouteInformation) => x.arrtime! - y.arrtime!)
      setArravalInfo(newArr);
      refreshTimeSave();
      setLoadState(false);
    } else {
      console.log(data.header.resultCode)
    }
  }
  const getRouteNoList = async (routeno: string, routeid: string) => {
    const parameter = `?serviceKey=${serviceKey}&cityCode=${selectBusStop!.citycode}&routeNo=${routeno}`;
    const url = `/BusRouteInfoInqireService/getRouteNoList${parameter}`;
    const response = await apiRequest(url);
    let header = response.data.response.header;
    let data = response.data.response.body;
    if (header.resultCode === "00" || header.resultCode === 0) {
      // api 조회 정상적으로 완료 했을 때 
      let item = data.items.item;
      if (Array.isArray(item)) {
        // 노선 정보들 중에 routid와 일치하는 정보를 찾아 반환
        item = item.filter((item: any) => item.routeid === routeid)[0];
      }
      return item;
    }
    console.log("response", response)
    return header.resultCode;
  }
  const getBusInfoByRouteId = (data: any) => {
    const parameter = `?serviceKey=${serviceKey}&cityCode=${selectBusStop?.citycode}&routeId=${data.routeid}&numOfRows=500`;
    const url = `/BusRouteInfoInqireService/getRouteAcctoThrghSttnList${parameter}`;
    apiRequest(url)
      .then((response) => {
        console.log(response);
      })

  }
  // 해당 노선에 현재 존재하는 버스 정보
  const testApi = (data: any) => {
    const parameter = `?serviceKey=${serviceKey}&cityCode=${selectBusStop?.citycode}&routeId=${data.routeid}`;
    const url = `/BusLcInfoInqireService/getRouteAcctoBusLcList${parameter}`;
    apiRequest(url)
      .then((response) => {
        console.log(response);
      })
  }
  useEffect(() => {
    // X 눌러서 다시 bus stop list로 돌아올 때 arravalInfo 초기화
    if (mapMode === 0 && arravalInfo.length > 0) {
      setArravalInfo([]);
    }
  }, [mapMode]);
  useEffect(() => {
    if (selectBusStop !== null && mapMode === 1) {
      getBusArravalInfo();
    };
  }, [selectBusStop, mapMode]);

  const infoComponent = () => {
    switch (mapMode) {
      // BusStopList
      case 0:
        return (<
          div className="information-table">
          {/* Map mode false인 경우 버스 노선 그리기  */}
          {station.length > 0 &&
            station.map(({ citycode, gpslati, gpslong, nodenm, nodeid }: BusStopInterface, index) => {
              return (
                <div key={index} onClick={() => settingBusStop(citycode, gpslati, gpslong, nodeid, nodenm)}>
                  <div className='info'>
                    <img src={process.env.PUBLIC_URL + '/marker.png'} alt="" />
                    <h5>{nodenm}({nodeid})</h5>
                  </div>
                </div>
              )
            })
          }
        </div>
        )
      // BusStopInformation
      case 1:
        return (
          <>
            <div className="bus-stop-contaienr">
              <div className="bus-stop-name">{selectBusStop!.nodenm}</div>
              <div className="bus-stop-information">
                {/* <div className */}
                <div className="refresh-time">
                  {refreshTime} 기준
                  <button
                    onClick={() => getBusArravalInfo()
                    }><i className="fas fa-sync-alt"></i></button></div>
              </div>
            </div>
            <div className="bus-arraval-list">
              {arravalInfo.length > 0 ?
                arravalInfo.map((data: any, index: number) => {
                  return BusArravalInfo(data, index);
                })
                :
                <span>도착 예정 정보 없음</span>
              }
            </div >
          </>
        )
      default:
        return <></>
    }
  }

  return (
    <div className="information-container">
      {loadState ?
        <div className="loading"><RotateLoader /> </div>
        : infoComponent()
      }
    </div>
  )
}

export default Information;