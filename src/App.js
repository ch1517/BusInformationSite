import React, { Component, useState } from 'react';
import './App.css';
import Map from './modules/Map';
import Information from './modules/Information';
import Header from './modules/Header';
import PopUp from './modules/PopUp';
import apiKey from './private/apiKey.json';
import axios from 'axios';
import objectToText from './parser';

function App(props) {
  const [zoomLevel, setZoomLevel] = useState(16); // initial zoom level provided for MapContainer
  const [position, setPosition] = useState([36.37412735693837, 127.36563659840922]);
  const [station, setStation] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nodenm, setNodenm] = useState(null);
  const [arravalInfo, setArravalInfo] = useState({});
  const [selectID, setSelectID] = useState(-1);
  // True 인 경우 주변 정류장 정보 API 호출 
  const [mapMode, setMapMode] = useState(true);

  var [mapState, setMapState] = useState(false); // 지도 업데이트 제어변수 

  const openModal = (_gpslati, _gpslong, _nodenm, _nodeid, _citycode) => {
    setPosition([_gpslati, _gpslong]);
    getBusArravalInfo(_citycode, _nodeid);
    setNodenm(_nodenm);
    setSelectID(_nodeid);
    setZoomLevel(18);
    setMapState(true); // Marker 클릭 시 Map 업데이트 true
  };

  const getBusArravalInfo = (citycode, nodeid) => {
    const serviceKey = apiKey.station_key; // 버스정류장 정보조회 Key
    var parameter = "?serviceKey=" + serviceKey + "&cityCode=" + citycode + "&nodeId=" + nodeid;
    var url = '/api/ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList' + parameter;
    axios.get(url)
      .then(function (response) {
        var data = response.request.response;
        data = JSON.parse(data).response;
        if (data.header.resultCode._text == "00") {
          // api 조회 정상적으로 완료 했을 때 
          var items = data.body.items;
          var newArr = {};
          if (items['item'] != null) {
            items = items.item;
            // 배열이며, 길이가 0이 아닐 때
            if (items.length != 0 && Array.isArray(items)) {
              items.forEach(item => {
                item = objectToText(item);
              });

              items.map(({ routeno, routeid, arrtime, arrprevstationcnt }) => {
                var newInfo = {};
                newInfo['routeno'] = routeno;
                newInfo['arrtime'] = arrtime;
                newInfo['arrprevstationcnt'] = arrprevstationcnt;

                if (newArr[routeid] == null) {
                  newArr[routeid] = []
                }
                newArr[routeid].push(newInfo);
              })

            } else if (typeof (items) === 'object') {
              items = objectToText(items);

              var newInfo = {};
              var routeid = items['routeid'];
              newInfo['routeno'] = items['routeno'];
              newInfo['arrtime'] = items['arrtime'];
              newInfo['arrprevstationcnt'] = items['arrprevstationcnt'];
              if (newArr[routeid] == null) {
                newArr[routeid] = []
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
        <PopUp isOpen={isModalOpen} close={() => setIsModalOpen(false)}
          nodenm={nodenm} arravalInfo={arravalInfo} mapMode={mapMode} setMapMode={setMapMode}
        />
      </div>
    </div>
  )
}

export default App;
