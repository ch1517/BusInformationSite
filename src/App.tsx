import { useState } from 'react';
import './App.css';
import Map from './modules/Map';
import Information from './modules/Information';
import Header from './modules/Header';
import PopUp from './modules/PopUp';

interface BusStopInterface {
  citycode: number;
  gpslati: number;
  gpslong: number;
  nodeid: string;
  nodenm: string;
  // nodeno: number;
}
const App = () => {
  const [zoomLevel, setZoomLevel] = useState<number>(16); // initial zoom level provided for MapContainer
  const [position, setPosition] = useState<[number, number]>([36.37412735693837, 127.36563659840922]);
  const [station, setStation] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectBusStop, setSelectBusStop] = useState<BusStopInterface | null>(null);
  const [selectID, setSelectID] = useState<string>("-1");
  // True 인 경우 주변 정류장 정보 API 호출 
  const [mapMode,] = useState<boolean>(true);

  const openModal = (_citycode: number, _gpslati: number, _gpslong: number, _nodeid: string, _nodenm: string) => {
    let busStop: BusStopInterface = {
      citycode: _citycode,
      gpslati: _gpslati,
      gpslong: _gpslong,
      nodeid: _nodeid,
      nodenm: _nodenm
    };
    setPosition([_gpslati, _gpslong]);
    setSelectBusStop(busStop);
    setSelectID(_nodeid);
    setZoomLevel(18);
  };

  return (
    <div className="App">
      <Header />
      <div className="contents">
        <Map station={station} setStation={setStation}
          isModalOpen={isModalOpen} openModal={openModal}
          position={position} setPosition={setPosition}
          selectID={selectID} setSelectID={setSelectID}
          zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
        <Information station={station} openModal={openModal} mapMode={mapMode} />
        <PopUp isOpen={isModalOpen} setIsModalOpen={setIsModalOpen}
          selectBusStop={selectBusStop}
        />
      </div>
    </div>
  )
}

export default App;
