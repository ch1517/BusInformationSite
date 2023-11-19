import React, { useEffect, useState } from 'react';
import RotateLoader from "react-spinners/RotateLoader";
import './style.scss';
import { BusSVG } from '../../static/images/bus';
import { BusStopInterface, InformationProps, RouteInformation } from '../../types/information';
import { useArravalInfo, useArravalInRoute, useRouteInfo } from './state';

const Information: React.FC<InformationProps> = ({ mapMode, station, selectBusStop, settingBusStop, setMapMode }) => {
  const [refreshTime, setRefreshTime] = useState<string | null>(null);
  const [selectRoute, setSelectRoute] = useState<RouteInformation | null>(null);
  const { arravalInfo, arravalInfoState, arravalInfoMutate } = useArravalInfo(selectBusStop, mapMode);
  const { routeInfo, routeInfoState } = useRouteInfo(selectBusStop, mapMode, selectRoute);
  const { arravalInRoute, arravalInRouteState, arravalInRouteMutate } = useArravalInRoute(selectBusStop, mapMode, selectRoute);

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
    let busColor: string = getBusColor(data?.routeInfo?.routetp);
    return (
      <div key={index} onClick={() => {
        setMapMode(2);
        setSelectRoute(data);
        // 도착 정보 다시 가져오는 API 호출
        arravalInRouteMutate();
      }}>
        <BusSVG fill={busColor} />
        <div className="info-div">
          <div className="route-info">
            <div className="route-number">
              {data.routeno}
            </div>
            {data.routeInfo && typeof data.routeInfo !== "number" &&
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

  useEffect(() => {
    // X 눌러서 다시 bus stop list로 돌아올 때 arravalInfo 초기화
    if (mapMode === 0 && typeof arravalInRoute !== "undefined" && arravalInfo.length > 0) {
      arravalInfoMutate([]);
    }
  }, [mapMode]);

  useEffect(() => {
    refreshTimeSave();
  }, [arravalInfo, arravalInRoute]);

  const convertVehicleTime = (time: string | number) => {
    if (!time) return '';
    let result = typeof time === "number" ? time.toString().padStart(4, '0') : time;
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
                        <img src={`${process.env.REACT_APP_PUBLIC_URL}/marker.png`} alt="" />
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
                    onClick={() => {
                      arravalInfoMutate();
                    }
                    }><i className="fas fa-sync-alt"></i>
                  </button>
                </div>
              </div>
            </div>
            {arravalInfoState ?
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
        if (routeInfoState) return <div className="loading"><RotateLoader /> </div>;
        let startTime = convertVehicleTime(routeInfo?.routeInfo?.startvehicletime);
        let endTime = convertVehicleTime(routeInfo?.routeInfo?.endvehicletime);
        let arravalList: any;
        if (arravalInRouteState) arravalList = [];
        else {
          arravalList = {};
          let arravalInRoutetmp = arravalInRoute;
          // 만약 arravalInRoute가 array가 아닌 object라면
          if (arravalInRoute && !Array.isArray(arravalInRoute))
            arravalInRoutetmp = [arravalInRoute];
          arravalInRoutetmp?.forEach((data: any) => arravalList[data.nodeord] = data);
        }
        let busColor: string = getBusColor(routeInfo?.routeInfo?.routetp);
        return (
          <div className="route-container">
            <div className="bus-stop-container">
              <div className="bus-stop-name">
                <BusSVG fill={busColor} />
                {routeInfo!.routeno}
              </div>
              {routeInfo?.routeInfo &&
                <div className="route-info-container">
                  <div className="route-info-item">
                    <div className="title">노선유형</div>
                    <div className="information">{routeInfo?.routeInfo?.routetp}</div>
                  </div>
                  <div className="route-info-item">
                    <div className="title">운행시간</div>
                    <div className="information">첫차 {startTime}, 막차 {endTime}</div>
                  </div>
                  <div className="route-info-item">
                    <div className="title">배차간격</div>
                    <div className="information">평일 {routeInfo?.routeInfo?.intervaltime ?? ''}분, 토요일 {routeInfo?.routeInfo?.intervalsattime ?? ''}분, 일요일 {routeInfo?.routeInfo?.intervalsuntime ?? ''}분</div>
                  </div>
                </div>
              }
              <div className="bus-stop-information">
                <div className="refresh-time">
                  {refreshTime} 기준
                  <button
                    onClick={() => arravalInRouteMutate()}><i className="fas fa-sync-alt"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="route-list">
              {routeInfo!.routeInfo?.busStopList.map((data: any, index: number) => {
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
                        {routeInfo!.routeInfo?.startnodenm === data.nodenm && <div className="start-end-label">기점</div>}
                        {routeInfo!.routeInfo?.endnodenm === data.nodenm && <div className="start-end-label">종점</div>}
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