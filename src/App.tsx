import { useState } from 'react';
import './App.scss';
import Map from './modules/Map';
import Information from './modules/information';
import Header from './modules/Header';

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
  const [selectBusStop, setSelectBusStop] = useState<BusStopInterface | null>(null);
  const [selectID, setSelectID] = useState<string>("-1");
  // True 인 경우 주변 정류장 정보 API 호출 
  const [mapMode, setMapMode] = useState<number>(0);
  const [apiState, setApiState] = useState(true);

  const settingBusStop = (_citycode: number, _gpslati: number, _gpslong: number, _nodeid: string, _nodenm: string) => {
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
    setApiState(false);
    setMapMode(1);
  };

  return (
    <div className="App">
      <Header />
      <div className="contents">
        <Map station={station} setStation={setStation}
          settingBusStop={settingBusStop}
          position={position} setPosition={setPosition}
          selectID={selectID} setSelectID={setSelectID}
          zoomLevel={zoomLevel} setZoomLevel={setZoomLevel}
          apiState={apiState} setApiState={setApiState} />
        <Information station={station} settingBusStop={settingBusStop} setMapMode={setMapMode}
          mapMode={mapMode} selectBusStop={selectBusStop} />
        <button className="mode-change-button"
          onClick={() => {
            if (mapMode !== 0)
              setMapMode(mapMode - 1);
          }}>
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  )
}

export default App;
