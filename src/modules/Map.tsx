import React from 'react';
import { MapContainer, TileLayer, Marker, MapConsumer, useMap, useMapEvents, Tooltip } from 'react-leaflet';
import { useState, useEffect } from "react";
import 'leaflet/dist/leaflet.css'
import axios from 'axios';
import leaflet from 'leaflet';
import apiKey from '../private/apiKey.json';

const serviceKey = apiKey.station_key; // 버스정류장 정보조회 Key
const BASE_ZOOM_LEVEL = 13;

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
// api request [나중에 분리]
const getBusStationInfo = (setStation: (station: any[]) => void, apiState: boolean, center: LatLngInterface, _southWest: LatLngInterface, _northEast: LatLngInterface) => {
  let gpsLati = center["lat"];
  let gpsLong = center["lng"];
  let parameter = `?serviceKey=${serviceKey}&gpsLati=${gpsLati}&gpsLong=${gpsLong}`;
  var url = process.env.REACT_APP_API_URL + '/BusSttnInfoInqireService/getCrdntPrxmtSttnList' + parameter;
  if (apiState) {
    axios.get(url)
      .then(function (response) {
        let header = response.data.response.header;
        var data = response.data.response.body;
        if (header.resultCode === "00") {
          // api 조회 정상적으로 완료 했을 때 
          var items = data.items.item;
          var newData: any[] = [];
          if (items == null || items === undefined) {
            newData = [];
          } else if (Array.isArray(items)) {
            items.forEach((item) => {
              if (checkLatLngOut(item, _southWest, _northEast)) {
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
          console.log(data.header.resultCode);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}
interface MapEventProps {
  apiState: boolean;
  mapMode: boolean;
  setApiState: (apiState: boolean) => void;
  setStation: (station: any[]) => void;
  setZoomLevel: (zoomLevel: number) => void;
}

const MapEvent: React.FC<MapEventProps> = ({ apiState, mapMode, setApiState, setStation, setZoomLevel }) => {
  const map = useMap();
  // var state = true; // 초기화 시 한번만 실행하기 위한 state 변수
  const costomEvent = (zoomLevel: number) => {
    if (zoomLevel > BASE_ZOOM_LEVEL && mapMode) {
      getBusStationInfo(setStation, apiState, map.getCenter(), map.getBounds().getSouthWest(), map.getBounds().getNorthEast());
      setApiState(true);
    }
  }
  const mapEvents = useMapEvents({
    // 지도 zoom 종료
    zoomend: () => {
      setZoomLevel(mapEvents.getZoom()); // 현재 지도의 center lat, lng 가져오기
      costomEvent(mapEvents.getZoom());
    },
    // 지도 움직임 종료
    moveend: () => {
      costomEvent(mapEvents.getZoom());
    },
    // 스크롤로 이동할 때 false
    dragend: () => {
      setApiState(true);
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
  useEffect(() => {
    return () => {
      // props.setSelectID(-1);
    };
  }, []);
  return (
    <Tooltip direction="top" opacity={1} permanent interactive>
      <div className={selectID === nodeid ? "select" : ""}>
        <div><img className="busIcon" src={process.env.PUBLIC_URL + selectID === nodeid ? '/marker.png' : '/marker_white.png'} /></div>
        <div>
          <span>{nodenm}</span>
          <span>{nodeid}</span>
        </div>
      </div>
    </Tooltip>
  )
}
interface MapInterface {
  zoomLevel: number;
  mapState: boolean;
  mapMode: boolean;
  position: [number, number];
  station: any[];
  selectID: string;
  setStation: (station: any[]) => void;
  setZoomLevel: (zoomLevel: number) => void;
  setMapState: (mapState: boolean) => void;
  setSelectID: (selectID: string) => void;
  openModal: (citycode: number, gpslati: number, gpslong: number, nodeid: string, nodenm: string) => void;
}
const Map: React.FC<MapInterface> = ({ zoomLevel, mapState, mapMode, position, station, selectID, setZoomLevel, setStation, setMapState, setSelectID, openModal }) => {
  var [apiState, setApiState] = useState(true);
  const BASE_ZOOM_LEVEL = 13;

  let mapIcon = leaflet.icon({
    iconUrl: process.env.PUBLIC_URL + '/marker.png',
    iconRetinaUrl: process.env.PUBLIC_URL + '/marker.png',
    iconAnchor: [15, 15],
    popupAnchor: [0, 0],
    iconSize: [30, 30],
  });

  let tooltipClick = (citycode: number, gpslati: number, gpslong: number, nodenm: string, nodeid: string) => {
    setSelectID(nodeid);
    openModal(citycode, gpslati, gpslong, nodeid, nodenm);
  }

  let vworld_url = `https://api.vworld.kr/req/wmts/1.0.0/${apiKey.vworld_key}/Base/{z}/{y}/{x}.png`;
  return (
    <div className="map-container">
      {zoomLevel < BASE_ZOOM_LEVEL + 1 ? <div className="alert-box"><h5>조금 더 가까이 이동해주세요</h5></div> : <div></div>}
      <MapContainer center={position} zoom={zoomLevel} scrollWheelZoom={true}>
        <TileLayer maxZoom={22} maxNativeZoom={18}
          // zoom={zoomLevel}
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url={vworld_url}
        />
        <MapEvent apiState={apiState} setApiState={setApiState} mapMode={mapMode} setZoomLevel={setZoomLevel} setStation={setStation} />
        <MapConsumer>
          {(map) => {
            if (mapState) { // Marker 위치, zoomLevel 19로 지도 업데이트
              map.setView(position, zoomLevel);
              setApiState(false); // Marker 클릭 center 설정 시에는 api 호출 안함
              setMapState(false);
            }
            return <></>
          }}
        </MapConsumer>
        {mapMode && station.length > 0 &&
          station.map(({ citycode, gpslati, gpslong, nodeid, nodenm }, index) => {
            return (
              <Marker position={[gpslati.toString(), gpslong.toString()]} icon={mapIcon}
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
