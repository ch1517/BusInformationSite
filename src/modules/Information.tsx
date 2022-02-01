
import React from 'react';

interface BusStopInterface {
  citycode: number;
  gpslati: number;
  gpslong: number;
  nodeid: string;
  nodenm: string;
  // nodeno: number;
}
interface InformationProps {
  mapMode: boolean;
  station: any[];
  openModal: (citycode: number, gpslati: number, gpslong: number, nodeid: string, nodenm: string) => void;
}
const Information: React.FC<InformationProps> = ({ mapMode, station, openModal }) => {
  return (
    <div className="information-container">
      {mapMode ? (
        <div className="information-table">
          {/* Map mode false인 경우 버스 노선 그리기  */}
          {station.length > 0 &&
            station.map(({ citycode, gpslati, gpslong, nodenm, nodeid }: BusStopInterface, index) => {
              return (
                <div key={index} onClick={() => openModal(citycode, gpslati, gpslong, nodeid, nodenm)}>
                  <div className='info'>
                    <img src={process.env.PUBLIC_URL + '/marker.png'} alt="" />
                    <h5>{nodenm}({nodeid})</h5>
                  </div>
                </div>
              )
            })
          }
        </div>
      )
        : (
          <div>구현해야할 내용</div>
        )
      }

    </div >
  )
}

export default Information;