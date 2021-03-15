import React, { Component } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { useState } from "react";
import 'leaflet/dist/leaflet.css'
import axios from 'axios';
import leaflet from 'leaflet';
import apiKey from '../private/apiKey.json'

var serviceKey = apiKey.station_key; // 버스정류장 정보조회 Key

function getBusStationInfo(props, center) {
    var gpsLati = center["lat"];
    var gpsLong = center["lng"];
    var url = "?serviceKey=" + serviceKey + "&gpsLati=" + gpsLati + "&gpsLong=" + gpsLong;
    axios.get('/busStationInfo' + url)
        .then(function (response) {
            var responseText = JSON.parse(response.request.responseText);
            if (responseText.response.header.resultCode == "00") {
                // api 조회 정상적으로 완료 했을 때 
                var item = responseText.response.body.items.item;
                if (item == null) {
                    props.setStation([]);
                } else if (Array.isArray(item)) {
                    props.setStation(responseText.response.body.items.item);
                } else {
                    props.setStation([responseText.response.body.items.item]);
                }

            } else {
                console.log(responseText.response.header.resultCode)
            }
        })
        .catch(function (error) {
            console.log(error);
        });

}
function MapEvent(props) {
    const [zoomLevel, setZoomLevel] = useState(props.zoomLevel); // initial zoom level provided for MapContainer
    const map = useMap();
    var state = true; // 초기화 시 한번만 실행하기 위한 state 변수

    const mapEvents = useMapEvents({
        // 지도 zoom 종료
        zoomend: () => {
            setZoomLevel(mapEvents.getZoom()); // 현재 지도의 center lat, lng 가져오기
        },
        // 지도 움직임 종료
        moveend: () => {
        },
        // 스크롤로 이동할 때 false
        dragend: () => {

            getBusStationInfo(props, map.getCenter());
        }
    });
    return (
        <div></div>
    );
}

class Maps extends Component {
    constructor(props) {
        super(props);
        this.state = {
            station: []
        }

        this.setStation = this.setStation.bind(this);
    }
    setStation(_station) {
        this.setState({
            station: _station
        })
    }

    render() {
        const position = [37.50937295468167, 127.0461450277878];
        let loveIcon = leaflet.icon({
            iconUrl: '../../marker.png',
            iconRetinaUrl: '../../marker.png',
            iconAnchor: [25, 50],
            popupAnchor: [10, -44],
            iconSize: [50, 50],
        });
        let vworld_url = "https://api.vworld.kr/req/wmts/1.0.0/" + apiKey.vworld_key + "/Base/{z}/{y}/{x}.png"
        return (
            <div className="map-container">
                <MapContainer center={position} zoom={13} scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url={vworld_url}
                    />

                    <MapEvent zoomLevel={this.props.zoomLevel} setStation={this.setStation} />
                    {this.state.station.length > 0 &&
                        this.state.station.map(({ gpslati, gpslong, nodenm }) => {
                            return (
                                <Marker position={[gpslati + "", gpslong + ""]} icon={loveIcon}>
                                    <Popup>
                                        <span>{nodenm}</span>
                                    </Popup>
                                </Marker>
                            )
                        })}


                </MapContainer>

            </div >

        )
    }
}

export default Maps;