
import React, { useEffect, useState } from 'react';
import apiKey from '../../private/apiKey.json';
import { apiRequest } from '../../apiRequest';
import RotateLoader from "react-spinners/RotateLoader";
import './style.scss';
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

interface RouteInformation {
  routeno?: string; // 노선번호
  arrtime?: number; // 도착예정버스 도착예상시간[초]
  arrprevstationcnt?: number; // 도착예정버스 남은 정류장 수
}

interface InformationProps {
  mapMode: number;
  station: any[];
  selectBusStop: BusStopInterface | null;
  settingBusStop: (citycode: number, gpslati: number, gpslong: number, nodeid: string, nodenm: string) => void;
  setMapMode: (mapMode: number) => void;
}

const Information: React.FC<InformationProps> = ({ mapMode, station, selectBusStop, settingBusStop, setMapMode }) => {
  const [arravalInfo, setArravalInfo] = useState<any>([]);
  const [refreshTime, setRefreshTime] = useState<string | null>(null);
  // 로딩 state
  const [loadState, setLoadState] = useState<boolean>(false);
  // route information
  const [routeInfo, setRouteInfo] = useState<RouteInformation | null>(null);
  const [arravalInRoute, setArravalInRoute] = useState<any>(null);
  /**
   * 버스 노선 종류에 따른 색 반환
   * @param routetp 노선 종류
   * @returns 
   */
  const getBusColor = (routetp: string) => {
    let busColor: string = '#146ACC';
    switch (routetp) {
      case "간선버스":
        busColor = "#008039";
        break;
      case "좌석버스":
      case "급행버스":
      case "광역버스":
        busColor = "#CC1100";
        break;
      default:
        break;
    }
    return busColor;
  }
  const BusArravalInfo = (data: any, index: number) => {
    const time = Math.floor(data.arrtime! / 60);
    let busColor: string = getBusColor(data.routeInfo.routetp);
    return (
      <div key={index} onClick={() => {
        getBusInfoByRouteId(data);
        // 도착 정보 다시 가져오는 API 호출
        getRouteAcctoBusLcList(data.routeid);
      }}>
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
          {/* <div>{data.routeInfo.routetp}</div> */}
          <div className="arraval-info">
            <span>{time < 3 ? ("잠시 후 도착") : (`${time}분`)}</span>
            <span>{data.arrprevstationcnt}정류장</span>
          </div>
        </div>
      </div>
    )
  }

  const refreshTimeSave = () => {
    const date = new Date();
    setRefreshTime(`${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`);
  }
  const getBusArravalInfo = async () => {
    setLoadState(true);
    const parameter = `?serviceKey=${serviceKey}&cityCode=${selectBusStop!.citycode}&nodeId=${selectBusStop!.nodeid}`;
    const url = `/ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList${parameter}`;
    try {
      let response = await apiRequest(url);
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
              let routeInfo = await getRouteInfoIem(routeid);
              newInfo['routeInfo'] = routeInfo;
              return newInfo;
            }))
          } else if (typeof (items) === 'object') {
            let newInfo: RouteInformation = {};
            newInfo['routeid'] = items['routeid'];
            newInfo['routeno'] = items['routeno'];
            newInfo['arrtime'] = items['arrtime'];
            newInfo['arrprevstationcnt'] = items['arrprevstationcnt'];
            let routeInfo = await getRouteInfoIem(items['routeid']);
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
    } catch (e) {
      console.log(e);
    }
  }
  /**
   * 노선별로 버스의 GPS 위치정보의 목록을 조회
   * @param routeid route id
   */
  const getRouteAcctoBusLcList = async (routeid: string) => {
    const parameter = `?serviceKey=${serviceKey}&cityCode=${selectBusStop!.citycode}&routeId=${routeid}`;
    const url = `/BusLcInfoInqireService/getRouteAcctoBusLcList${parameter}`;
    try {
      const response = await apiRequest(url);
      let header = response.data.response.header;
      let data = response.data.response.body;
      // api 조회 정상적으로 완료 했을 때 
      if (header.resultCode === "00" || header.resultCode === 0) {
        let item = data.items.item;
        refreshTimeSave();
        setArravalInRoute(item);
      }
    } catch (e) {
      console.log(e);
    }
  }
  /**
   * 노선의 기본정보(종점, 출발점, 버스종류)를 반환하는 API 호출
   * @param routeno 
   * @param routeid 
   * @returns 
   */
  const getRouteInfoIem = async (routeid: string) => {
    const parameter = `?serviceKey=${serviceKey}&cityCode=${selectBusStop!.citycode}&routeId=${routeid}`;
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
  const getBusInfoByRouteId = async (nodeData: any) => {
    const parameter = `?serviceKey=${serviceKey}&cityCode=${selectBusStop?.citycode}&routeId=${nodeData.routeid}&numOfRows=500`;
    const url = `/BusRouteInfoInqireService/getRouteAcctoThrghSttnList${parameter}`;
    try {
      const response = await apiRequest(url);
      let header = response.data.response.header;
      let data = response.data.response.body;
      // api 조회 정상적으로 완료 했을 때 
      if (header.resultCode === "00" || header.resultCode === 0) {
        let item = data.items.item;
        nodeData.routeInfo.busStopList = item;
        setRouteInfo(nodeData);
        setMapMode(2);
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    console.log('arravalInRoute', arravalInRoute)
  }, [arravalInRoute]);

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

  const convertVehicleTime = (time: string | number) => {
    let result = typeof time === "number" ? time.toString() : time;
    result = `${result.substr(0, 2)}:${result.substr(2)}`
    return result;
  }
  const InfoComponent = () => {
    switch (mapMode) {
      // BusStopList
      case 0:
        return (
          <div className="information-table">
            <div className="bus-stop-list">
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
          </div>
        )
      // BusStopInformation
      case 1:
        return (
          <>
            <div className="bus-stop-container">
              <div className="bus-stop-name">{selectBusStop!.nodenm}</div>
              <div className="bus-stop-information">
                <div className="refresh-time">
                  {refreshTime} 기준
                  <button
                    onClick={() => getBusArravalInfo()
                    }><i className="fas fa-sync-alt"></i>
                  </button>
                </div>
              </div>
            </div>
            {loadState ?
              <div className="loading"><RotateLoader /> </div>
              :
              <div className="bus-arraval-list">
                {arravalInfo.length > 0 ?
                  arravalInfo.map((data: any, index: number) => {
                    return BusArravalInfo(data, index);
                  })
                  :
                  <span>도착 예정 정보 없음</span>
                }
              </div >
            }
          </>
        )
      case 2:
        let startTime = convertVehicleTime(routeInfo?.routeInfo.startvehicletime);
        let endTime = convertVehicleTime(routeInfo?.routeInfo.endvehicletime);
        let arravalList: any;
        if (arravalInRoute === null) arravalList = []
        else {
          arravalList = {};
          arravalInRoute.forEach((data: any) => arravalList[data.nodeord] = data);
        }
        let busColor: string = getBusColor(routeInfo?.routeInfo.routetp);
        return (
          <div className="route-container">
            <div className="bus-stop-container">
              <div className="bus-stop-name">
                <BusSVG fill={busColor} />
                {routeInfo!.routeno}
              </div>
              <div className="route-info-container">
                <div className="route-info-item">
                  <div className="title">노선유형</div>
                  <div className="information">{routeInfo?.routeInfo.routetp}</div>
                </div>
                <div className="route-info-item">
                  <div className="title">운행시간</div>
                  <div className="information">첫차 {startTime}, 막차 {endTime}</div>
                </div>
                <div className="route-info-item">
                  <div className="title">배차간격</div>
                  <div className="information">평일 {routeInfo?.routeInfo.intervaltime}분, 토요일 {routeInfo?.routeInfo.intervalsattime}분, 일요일 {routeInfo?.routeInfo.intervalsuntime}분</div>
                </div>
              </div>
              <div className="bus-stop-information">
                <div className="refresh-time">
                  {refreshTime} 기준
                  <button
                    onClick={() => getRouteAcctoBusLcList(routeInfo?.routeid!)}><i className="fas fa-sync-alt"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="route-list">
              {routeInfo !== null &&
                routeInfo.routeInfo.busStopList.map((data: any, index: number) => {
                  return (
                    <div className="route-item" key={index}>
                      <div className="route-line" style={{ borderColor: busColor }}>
                        {Object.keys(arravalList).includes(data.nodeord.toString()) ?
                          <>
                            <div className='bus-logo' style={{ borderColor: busColor }}><BusSVG fill={busColor} /></div>
                            <div className='bus-number' style={{ color: busColor, borderColor: busColor }}>{arravalList[data.nodeord.toString()].vehicleno.slice(-7)}</div>
                          </>
                          : <></>
                        }
                      </div>
                      <div className="bus-stop-text">
                        <div className="node-name">{data.nodenm}
                          {routeInfo.routeInfo.startnodenm === data.nodenm && <div className="start-end-label">기점</div>}
                          {routeInfo.routeInfo.endnodenm === data.nodenm && <div className="start-end-label">종점</div>}
                        </div>
                        <div className="node-number">{data.nodeno}</div>
                      </div>
                    </div>
                  )
                }
                )}
            </div>
          </div >
        )
      default:
        return <></>
    }
  }

  return (
    <div className="information-container">
      {InfoComponent()}
    </div>
  )
}

export default Information;