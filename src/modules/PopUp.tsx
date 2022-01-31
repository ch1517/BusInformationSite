
import React from 'react';

interface RouteInformation {
  routeno?: string; // 노선번호
  arrtime?: number; // 도착예정버스 도착예상시간[초]
  arrprevstationcnt?: number; // 도착예정버스 남은 정류장 수
}
interface BusArravalInfoProps {
  array: RouteInformation[];
}
const BusArravalInfo: React.FC<BusArravalInfoProps> = ({ array }) => {
  return (
    <>
      {array.map(({ arrtime, arrprevstationcnt }) => {
        const time = Math.floor(arrtime! / 60);
        return (
          <div>
            <span>{time < 3 ? ("잠시 후 도착") : (`${time}분 후`)}</span>
            <span>{arrprevstationcnt} 정거장 전</span>
          </div>
        )
      }
      )}
    </>
  )
}

interface PopUpProps {
  nodenm: string | null;
  mapMode: boolean;
  isOpen: boolean;
  arravalInfo: any;
  setMapMode: (mapMode: boolean) => void;
  setIsModalOpen: (openState: boolean) => void;
}
const PopUp: React.FC<PopUpProps> = ({ nodenm, mapMode, isOpen, arravalInfo, setMapMode, setIsModalOpen }) => {
  return (
    <>{isOpen && (
      <div className="modal-container ">
        <div className="modal">
          <button onClick={() => setIsModalOpen(false)}>X</button>
          <div className="info-content">
            <h3 className="station-name">{nodenm}</h3>
            <div className="arrival-info-container">
              {Object.keys(arravalInfo).length > 0 &&
                Object.keys(arravalInfo).map((key, index) => {
                  console.log(arravalInfo, key)
                  return (
                    <div className="arrival-bus-info" onClick={() => {
                      // setMapMode(false);
                      // setIsModalOpen(false);
                    }
                    }>
                      <span className="route-number">{arravalInfo[key][0]['routeno']}번</span>
                      <span className="arrival-bus-container">
                        <BusArravalInfo array={arravalInfo[key]} ></BusArravalInfo>
                      </span>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    )
    }
    </>
  )
}

export default PopUp;

