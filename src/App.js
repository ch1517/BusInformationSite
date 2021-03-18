import React, { Component, useState } from 'react';
import './App.css';
import Map from './modules/Map';
import Information from './modules/Information';
import Header from './modules/Header';
import PopUp from './modules/PopUp';
import apiKey from './private/apiKey.json';
import axios from 'axios';

function App(props) {
  const [station, setStation] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nodenm, setNodenm] = useState(null);
  const [arravalInfo, setArravalInfo] = useState({});

  const openModal = (_nodenm, _nodeid, _citycode) => {
    getBusArravalInfo(_citycode, _nodeid);
    setNodenm(_nodenm);
  };

  const getBusArravalInfo = (citycode, nodeid) => {
    const serviceKey = apiKey.station_key; // 버스정류장 정보조회 Key
    var url = "?serviceKey=" + serviceKey + "&cityCode=" + citycode + "&nodeId=" + nodeid;
    axios.get('/busArravalInfo' + url)
      .then(function (response) {
        var responseText = JSON.parse(response.request.responseText);
        if (responseText.response.header.resultCode == "00") {
          // api 조회 정상적으로 완료 했을 때 
          var items = responseText.response.body.items;
          var newArr = {};
          if (items != "") {
            items.item.map(({ routeno, routeid, arrtime, arrprevstationcnt }) => {
              var newInfo = {};
              newInfo['routeno'] = routeno;
              newInfo['arrtime'] = arrtime;
              newInfo['arrprevstationcnt'] = arrprevstationcnt;

              if (newArr[routeid] == null) {
                newArr[routeid] = []
              }
              newArr[routeid].push(newInfo);
            })
          }
          setArravalInfo(newArr);
          setIsModalOpen(true);
        } else {
          console.log(responseText.response.header.resultCode)
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
        <Map station={station} setStation={setStation} />
        <Information station={station} openModal={openModal} />
        <PopUp isOpen={isModalOpen} close={() => setIsModalOpen(false)}
          nodenm={nodenm} arravalInfo={arravalInfo}
        />
      </div>
    </div>
  )
}

export default App;
