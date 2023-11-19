import React from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents, Tooltip } from 'react-leaflet';
import { useState, useEffect } from "react";
import 'leaflet/dist/leaflet.css';
import leaflet from 'leaflet';
import { MapInfoInterface, MapInterface } from '../types/map';
import { useStations } from '../states/map';
import apiKey from '../private/apiKey.json';
import './map/style.scss';

interface MapEventProps {
  position: [number, number];
  setMap: (map: MapInfoInterface) => void;
  setPosition: (position: [number, number]) => void;
  setApiState: (apiState: boolean) => void;
  setZoomLevel: (zoomLevel: number) => void;
  setZoomState: (zoomState: boolean) => void;
}

const MapEvent: React.FC<MapEventProps> = ({ position, setMap, setPosition, setApiState, setZoomLevel, setZoomState }) => {
  const map = useMap();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((_position) => {
      setPosition([_position.coords.latitude, _position.coords.longitude]);
    });
  }, []);

  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position]);

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
      let mapInfo: MapInfoInterface = {};
      mapInfo.center = map.getCenter();
      mapInfo.southWest = map.getBounds().getSouthWest();
      mapInfo.northEast = map.getBounds().getNorthEast();
      setMap(mapInfo);
      // costomEvent(mapEvents.getZoom());
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
        <div><img alt="" className="busIcon" src={process.env.REACT_APP_PUBLIC_URL + (selectID === nodeid ? '/marker.png' : '/marker_white.png')} /></div>
        <div>
          <span>{nodenm}</span>
          <span>{nodeid}</span>
        </div>
      </div>
    </Tooltip>
  )
}
const Map: React.FC<MapInterface> = ({ position, zoomLevel, station, selectID, apiState, setPosition, setZoomLevel, setStation, setSelectID, settingBusStop, setApiState }) => {
  const BASE_ZOOM_LEVEL = 17;
  const vworld_url = `https://api.vworld.kr/req/wmts/1.0.0/${apiKey.vworld_key}/Base/{z}/{y}/{x}.png`;

  const [zoomState, setZoomState] = useState(true);
  const [map, setMap] = useState<MapInfoInterface | null>(null);
  const { stations } = useStations(position, map, apiState);

  useEffect(() => {
    if (typeof stations !== 'undefined')
      setStation(stations);
  }, [stations]);

  useEffect(() => {
    if (map !== null && zoomLevel >= BASE_ZOOM_LEVEL && apiState)
      setPosition([map.center!["lat"], map.center!["lng"]]);
  }, [map]);

  let mapIcon = leaflet.icon({
    iconUrl: `${process.env.REACT_APP_PUBLIC_URL}/marker.png`,
    iconRetinaUrl: `${process.env.REACT_APP_PUBLIC_URL}/marker.png`,
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
        <MapEvent setApiState={setApiState}
          position={position} setPosition={setPosition} setMap={setMap}
          setZoomLevel={setZoomLevel} setZoomState={setZoomState} />
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
