import React, { useState } from 'react';
import './App.css';
import Map from './modules/Map';
import Information from './modules/Information';
import Header from './modules/Header';
import PopUp from './modules/PopUp';
import apiKey from './private/apiKey.json';
import axios from 'axios';

interface RouteInformation {
  routeno?: string; // 노선번호
  arrtime?: number; // 도착예정버스 도착예상시간[초]
  arrprevstationcnt?: number; // 도착예정버스 남은 정류장 수
}
const App = () => {
  const [zoomLevel, setZoomLevel] = useState<number>(16); // initial zoom level provided for MapContainer
  const [position, setPosition] = useState<[number, number]>([36.37412735693837, 127.36563659840922]);
  const [station, setStation] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [nodenm, setNodenm] = useState<string | null>(null);
  const [arravalInfo, setArravalInfo] = useState<any>({});
  const [selectID, setSelectID] = useState<string>("-1");
  // True 인 경우 주변 정류장 정보 API 호출 
  const [mapMode, setMapMode] = useState<boolean>(true);

  var [mapState, setMapState] = useState<boolean>(false); // 지도 업데이트 제어변수 

  const openModal = (_citycode: number, _gpslati: number, _gpslong: number, _nodeid: string, _nodenm: string) => {
    setPosition([_gpslati, _gpslong]);
    getBusArravalInfo(_citycode, _nodeid);
    setNodenm(_nodenm);
    setSelectID(_nodeid);
    setZoomLevel(18);
    setMapState(true); // Marker 클릭 시 Map 업데이트 true
  };

  const getBusArravalInfo = (citycode: number, nodeid: string) => {
    const serviceKey = apiKey.station_key; // 버스정류장 정보조회 Key
    let parameter = `?serviceKey=${serviceKey}&cityCode=${citycode}&nodeId=${nodeid}`;
    var url = process.env.REACT_APP_API_URL + '/ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList' + parameter;
    axios.get(url)
      .then((response) => {
        let header = response.data.response.header;
        let data = response.data.response.body;
        if (header.resultCode === "00") {
          // api 조회 정상적으로 완료 했을 때 
          var items = data.items;
          var newArr: any = {};
          if (items['item'] != null) {
            items = items.item;
            // 배열이며, 길이가 0이 아닐 때
            if (items.length !== 0 && Array.isArray(items)) {
              items.forEach(({ routeno, routeid, arrtime, arrprevstationcnt }) => {
                var newInfo: RouteInformation = {};
                newInfo['routeno'] = routeno;
                newInfo['arrtime'] = arrtime;
                newInfo['arrprevstationcnt'] = arrprevstationcnt;

                if (newArr[routeid] === undefined) {
                  newArr[routeid] = [];
                }
                newArr[routeid].push(newInfo);
              })

            } else if (typeof (items) === 'object') {
              let newInfo: RouteInformation = {};
              var routeid = items['routeid'];
              newInfo['routeno'] = items['routeno'];
              newInfo['arrtime'] = items['arrtime'];
              newInfo['arrprevstationcnt'] = items['arrprevstationcnt'];
              if (newArr[routeid] === undefined) {
                newArr[routeid] = [];
              }
              newArr[routeid].push(newInfo);
            } else {
              console.log(items);
            }
          }
          setArravalInfo(newArr);
          setIsModalOpen(true);
        } else {
          console.log(data.header.resultCode)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <div className="App">
      <Header />
      <div className="contents">
        <Map station={station} setStation={setStation} openModal={openModal}
          position={position}
          selectID={selectID} setSelectID={setSelectID}
          zoomLevel={zoomLevel} setZoomLevel={setZoomLevel}
          mapState={mapState} setMapState={setMapState}
          mapMode={mapMode} />
        <Information station={station} openModal={openModal} mapMode={mapMode} />
        <PopUp isOpen={isModalOpen} setIsModalOpen={setIsModalOpen}
          nodenm={nodenm} arravalInfo={arravalInfo} mapMode={mapMode} setMapMode={setMapMode}
        />
      </div>
    </div>
  )
}

export default App;
