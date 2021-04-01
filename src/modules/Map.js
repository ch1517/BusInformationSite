import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Tooltip } from 'react-leaflet';
import { useState } from "react";
import 'leaflet/dist/leaflet.css'
import axios from 'axios';
import leaflet from 'leaflet';
import apiKey from '../private/apiKey.json'
import objectToText from '../parser'

const serviceKey = apiKey.station_key; // 버스정류장 정보조회 Key

function getBusStationInfo(props, center) {
    var gpsLati = center["lat"];
    var gpsLong = center["lng"];
    var parameter = "?serviceKey=" + serviceKey + "&gpsLati=" + gpsLati + "&gpsLong=" + gpsLong;
    var url = '/api/BusSttnInfoInqireService/getCrdntPrxmtSttnList' + parameter;

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
                console.log(data.header.resultCode)
            }
        })
        .catch(function (error) {
            console.log(error);
        });

}
function MapEvent(props) {
    const [zoomLevel, setZoomLevel] = useState(16); // initial zoom level provided for MapContainer
    const map = useMap();
    var state = true; // 초기화 시 한번만 실행하기 위한 state 변수
    const BASE_ZOOM_LEVEL = 13

    const mapEvents = useMapEvents({
        // 지도 zoom 종료
        zoomend: () => {
            setZoomLevel(mapEvents.getZoom()); // 현재 지도의 center lat, lng 가져오기
        },
        // 지도 움직임 종료
        moveend: () => {
            console.log(zoomLevel)
            if (zoomLevel > BASE_ZOOM_LEVEL) {
                getBusStationInfo(props, map.getCenter());
            }
        },
        // 스크롤로 이동할 때 false
        dragend: () => {
        }
    });
    if (zoomLevel < BASE_ZOOM_LEVEL + 1) {
        return (
            <div className="alert-box"><h4>조금 더 가까이 이동해주세요</h4></div>
        )
    } else {
        return (
            <div></div>
        );
    }
}

function Map(props) {
    const [position, setPosition] = useState([36.37412735693837, 127.36563659840922]);

    let mapIcon = leaflet.icon({
        iconUrl: process.env.PUBLIC_URL + '/marker.png',
        iconRetinaUrl: process.env.PUBLIC_URL + '/marker.png',
        iconAnchor: [15, 15],
        popupAnchor: [0, 0],
        iconSize: [30, 30],
    });
    let vworld_url = "https://api.vworld.kr/req/wmts/1.0.0/" + apiKey.vworld_key + "/Base/{z}/{y}/{x}.png"
    return (
        <div className="map-container">
            <MapContainer center={position} zoom={16} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url={vworld_url}
                />
                <MapEvent zoomLevel={props.zoomLevel} setStation={props.setStation} />
                {props.station.length > 0 &&
                    props.station.map(({ gpslati, gpslong, nodenm, nodeid }) => {
                        return (
                            <Marker position={[gpslati + "", gpslong + ""]} icon={mapIcon}>
                                <Popup>
                                    <span>{nodeid}</span>
                                </Popup>
                                <Tooltip direction='bottom' opacity={1} permanent>
                                    <span>{nodenm}</span>
                                </Tooltip>
                            </Marker>
                        )
                    })}
            </MapContainer>
        </div >
    )
}


export default Map;