import React from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents, Tooltip } from 'react-leaflet';
import { useState, useEffect } from "react";
import 'leaflet/dist/leaflet.css';
import leaflet from 'leaflet';
import apiKey from '../private/apiKey.json';
import { apiRequest } from '../apiRequest';
const serviceKey = apiKey.station_key; // 버스정류장 정보조회 Key
const BASE_ZOOM_LEVEL = 17;

interface LatLngInterface {
  lat: number;
  lng: number;
}

// 화면의 latlng 내에 있는지 체크
const checkLatLngOut = (item: any, _southWest: LatLngInterface, _northEast: LatLngInterface) => {
  if (item["gpslati"] < _southWest.lat || item["gpslati"] > _northEast.lat
    || item["gpslong"] < _southWest.lng || item["gpslong"] > _northEast.lng)
    return false;
  return true;
}
/**
 * 정류장 정보가 두 개씩 나오는 경우 하나 필터링
 * @param nodeid 
 * @returns 
 */
const nodeidFiltering = (nodeid: string) => {
  return !nodeid.includes('GHB')
}
const getBusStationInfo = (setStation: (station: any[]) => void, apiState: boolean, center: LatLngInterface, _southWest: LatLngInterface, _northEast: LatLngInterface) => {
  let gpsLati = center["lat"];
  let gpsLong = center["lng"];
  let parameter = `?serviceKey=${serviceKey}&gpsLati=${gpsLati}&gpsLong=${gpsLong}`;
  let url = `/BusSttnInfoInqireService/getCrdntPrxmtSttnList${parameter}`;
  if (apiState) {
    apiRequest(url)
      .then((response) => {
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
              if (checkLatLngOut(item, _southWest, _northEast) && nodeidFiltering(item.nodeid)) {
                newData.push(item);
              }
            });
          } else {
            if (!checkLatLngOut(items, _southWest, _northEast)) {
              newData = [items];
            } else {
              newData = [];
            }
          }
          setStation(newData);
        } else {
          console.log(data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}
interface MapEventProps {
  position: [number, number];
  apiState: boolean;
  setPosition: (position: [number, number]) => void;
  setApiState: (apiState: boolean) => void;
  setStation: (station: any[]) => void;
  setZoomLevel: (zoomLevel: number) => void;
  setZoomState: (zoomState: boolean) => void;
}

const MapEvent: React.FC<MapEventProps> = ({ position, apiState, setPosition, setApiState, setStation, setZoomLevel, setZoomState }) => {
  const map = useMap();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((_position) => {
      setPosition([_position.coords.latitude, _position.coords.longitude]);
    });
  }, []);

  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position]);

  // var state = true; // 초기화 시 한번만 실행하기 위한 state 변수
  const costomEvent = (zoomLevel: number) => {
    if (zoomLevel >= BASE_ZOOM_LEVEL && apiState) {
      getBusStationInfo(setStation, apiState, map.getCenter(), map.getBounds().getSouthWest(), map.getBounds().getNorthEast());
      // setApiState(true);
    }
  }
  const mapEvents = useMapEvents({
    zoomstart: () => {
      setApiState(false);
      setZoomState(false);
    },
    // 지도 zoom 종료
    zoomend: () => {
      setZoomLevel(mapEvents.getZoom()); // 현재 지도의 center lat, lng 가져오기
      setApiState(true);
      setZoomState(true);
    },
    // 지도 움직임 종료
    moveend: () => {
      costomEvent(mapEvents.getZoom());
    },
    // 스크롤로 이동할 때 false
    dragend: () => {
      setApiState(true);
      setZoomState(true);
    }
  });
  return <></>
}
interface CustomTooltipProps {
  selectID: string;
  nodeid: string;
  nodenm: string;
}
const CustomTooltip: React.FC<CustomTooltipProps> = ({ selectID, nodeid, nodenm }) => {
  return (
    <Tooltip direction="top" opacity={1} permanent interactive>
      <div className={selectID === nodeid ? "select" : ""}>
        <div><img alt="" className="busIcon" src={process.env.PUBLIC_URL + selectID === nodeid ? '/marker.png' : '/marker_white.png'} /></div>
        <div>
          <span>{nodenm}</span>
          <span>{nodeid}</span>
        </div>
      </div>
    </Tooltip>
  )
}
interface MapInterface {
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
const Map: React.FC<MapInterface> = ({ position, zoomLevel, station, selectID, apiState, setPosition, setZoomLevel, setStation, setSelectID, settingBusStop, setApiState }) => {
  const BASE_ZOOM_LEVEL = 15;
  const vworld_url = `https://api.vworld.kr/req/wmts/1.0.0/${apiKey.vworld_key}/Base/{z}/{y}/{x}.png`;

  const [zoomState, setZoomState] = useState(true);

  let mapIcon = leaflet.icon({
    iconUrl: process.env.PUBLIC_URL + '/marker.png',
    iconRetinaUrl: process.env.PUBLIC_URL + '/marker.png',
    iconAnchor: [15, 15],
    popupAnchor: [0, 0],
    iconSize: [30, 30],
  });

  let tooltipClick = (citycode: number, gpslati: number, gpslong: number, nodenm: string, nodeid: string) => {
    setSelectID(nodeid);
    settingBusStop(citycode, gpslati, gpslong, nodeid, nodenm);
  }

  return (
    <div className="map-container">
      {zoomLevel < BASE_ZOOM_LEVEL ? <div className="alert-box"><h5>조금 더 가까이 이동해주세요</h5></div> : <div></div>}
      <MapContainer center={position} zoom={zoomLevel} scrollWheelZoom={true}>
        <TileLayer maxZoom={22} maxNativeZoom={18}
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url={vworld_url}
        />
        <MapEvent apiState={apiState} setApiState={setApiState}
          position={position} setPosition={setPosition}
          setZoomLevel={setZoomLevel} setStation={setStation}
          setZoomState={setZoomState} />
        {/* zoom 중인 경우 marker 표시를 안하기 위해서 apiState 추가 */}
        {zoomState
          && zoomLevel >= BASE_ZOOM_LEVEL
          && station.length > 0 &&
          station.map(({ citycode, gpslati, gpslong, nodeid, nodenm }, index) => {
            return (
              <Marker position={[gpslati.toString(), gpslong.toString()]} icon={mapIcon} key={index}
                eventHandlers={{ click: () => tooltipClick(citycode, gpslati, gpslong, nodenm, nodeid) }}
              >
                <CustomTooltip nodenm={nodenm} nodeid={nodeid} selectID={selectID} />
              </Marker>
            )
          })}
      </MapContainer>
    </div >
  )
}


export default Map;
