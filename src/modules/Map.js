import { React } from 'react';
import { MapContainer, TileLayer, Marker, MapConsumer, useMap, useMapEvents, Tooltip } from 'react-leaflet';
import { useState, useEffect } from "react";
import 'leaflet/dist/leaflet.css'
import axios from 'axios';
import leaflet from 'leaflet';
import apiKey from '../private/apiKey.json';
import objectToText from '../parser';

const serviceKey = apiKey.station_key; // 버스정류장 정보조회 Key
const BASE_ZOOM_LEVEL = 13;

function getBusStationInfo(props, apiState, center) {
    var gpsLati = center["lat"];
    var gpsLong = center["lng"];
    var parameter = "?serviceKey=" + serviceKey + "&gpsLati=" + gpsLati + "&gpsLong=" + gpsLong;
    var url = '/api/BusSttnInfoInqireService/getCrdntPrxmtSttnList' + parameter;
    if (apiState) {
        axios.get(url)
            .then(function (response) {
                var data = response.request.response;
                data = JSON.parse(data).response;
                if (data.header.resultCode._text == "00") {
                    // api 조회 정상적으로 완료 했을 때 
                    var items = data.body.items.item;
                    if (items == null) {
                        props.setStation([]);
                    } else if (Array.isArray(items)) {
                        items.forEach(item => {
                            item = objectToText(item);
                        });
                        props.setStation(items);
                    } else {
                        items = objectToText(items);
                        props.setStation([items]);
                    }
                } else {
                    console.log(data.header.resultCode);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}
function MapEvent(props) {
    const map = useMap();
    // var state = true; // 초기화 시 한번만 실행하기 위한 state 변수
    var apiState = props.apiState;
    const costomEvent = (mapEvents) => {
        if (mapEvents.getZoom() > BASE_ZOOM_LEVEL) {
            getBusStationInfo(props, apiState, map.getCenter());
            apiState = true;
        }
    }
    const mapEvents = useMapEvents({
        // 지도 zoom 종료
        zoomend: () => {
            props.setZoomLevel(mapEvents.getZoom()); // 현재 지도의 center lat, lng 가져오기
            costomEvent(mapEvents);
        },
        // 지도 움직임 종료
        moveend: () => {
            costomEvent(mapEvents);
        },
        // 스크롤로 이동할 때 false
        dragend: () => {
            apiState = true;
        }
    });
    if (props.zoomLevel < BASE_ZOOM_LEVEL + 1) {
        return (
            <div className="alert-box"><h4>조금 더 가까이 이동해주세요</h4></div>
        )
    } else {
        return (
            <div></div>
        );
    }
}
function CustomTooltip(props) {
    useEffect(() => {
        return () => {
            // props.setSelectID(-1);
        };
    }, []);
    return (
        <Tooltip direction="top" opacity={1} permanent interactive>
            <div className={props.selectID == props.nodeid ? "select" : ""}>
                <div><img className="busIcon" src={process.env.PUBLIC_URL + props.selectID == props.nodeid ? '/marker.png' : '/marker_white.png'} /></div>
                <div>
                    <span>{props.nodenm}</span>
                    <span>{props.nodeid}</span>
                </div>
            </div>
        </Tooltip>
    )


}
function Map(props) {
    var [apiState, setApiState] = useState(true);

    let mapIcon = leaflet.icon({
        iconUrl: process.env.PUBLIC_URL + '/marker.png',
        iconRetinaUrl: process.env.PUBLIC_URL + '/marker.png',
        iconAnchor: [15, 15],
        popupAnchor: [0, 0],
        iconSize: [30, 30],
    });

    let tooltipClick = (gpslati, gpslong, nodenm, nodeid, citycode) => {
        props.setSelectID(nodeid);
        props.openModal(gpslati, gpslong, nodenm, nodeid, citycode);
    }

    let vworld_url = "https://api.vworld.kr/req/wmts/1.0.0/" + apiKey.vworld_key + "/Base/{z}/{y}/{x}.png"
    return (
        <div className="map-container">
            <MapContainer center={props.position} zoom={props.zoomLevel} scrollWheelZoom={true}>
                <TileLayer maxZoom={22} maxNativeZoom={18} zoom={props.zoomLevel}
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url={vworld_url}
                />
                <MapEvent apiState={apiState} zoomLevel={props.zoomLevel} setZoomLevel={props.setZoomLevel} setStation={props.setStation} />
                <MapConsumer>
                    {(map) => {
                        if (props.mapState) { // Marker 위치, zoomLevel 19로 지도 업데이트
                            map.setView(props.position, props.zoomLevel);
                            setApiState(false); // Marker 클릭 center 설정 시에는 api 호출 안함
                            props.setMapState(false);
                        }
                        return null
                    }}
                </MapConsumer>
                {props.station.length > 0 &&
                    props.station.map(({ gpslati, gpslong, nodenm, nodeid, citycode }, index) => {
                        return (
                            <Marker position={[gpslati + "", gpslong + ""]} icon={mapIcon} permanent
                                eventHandlers={{ click: tooltipClick.bind(this, gpslati, gpslong, nodenm, nodeid, citycode) }}>
                                <CustomTooltip gpslati={gpslati} gpslong={gpslong} nodenm={nodenm} nodeid={nodeid}
                                    citycode={citycode} setSelectID={props.setSelectID} selectID={props.selectID} />
                            </Marker>
                        )
                    })}
            </MapContainer>
        </div >
    )
}


export default Map;
