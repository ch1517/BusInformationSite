
import React, { useEffect, useState } from 'react';
import apiKey from '../private/apiKey.json';
import { apiRequest } from '../apiRequest';

interface RouteInformation {
  routeno?: string; // 노선번호
  arrtime?: number; // 도착예정버스 도착예상시간[초]
  arrprevstationcnt?: number; // 도착예정버스 남은 정류장 수
}
interface BusArravalInfoProps {
  array: RouteInformation[];
}
interface RouteInformation {
  routeno?: string; // 노선번호
  arrtime?: number; // 도착예정버스 도착예상시간[초]
  arrprevstationcnt?: number; // 도착예정버스 남은 정류장 수
}
const BusArravalInfo: React.FC<BusArravalInfoProps> = ({ array }) => {
  return (
    <>
      {array.map(({ arrtime, arrprevstationcnt }, index) => {
        const time = Math.floor(arrtime! / 60);
        return (
          <div key={index}>
            <span>{time < 3 ? ("잠시 후 도착") : (`${time}분 후`)}</span>
            <span>{arrprevstationcnt} 정거장 전</span>
          </div>
        )
      }
      )}
    </>
  )
}

interface BusStopInterface {
  citycode: number;
  gpslati: number;
  gpslong: number;
  nodeid: string;
  nodenm: string;
  // nodeno: number;
}

interface PopUpProps {
  isOpen: boolean;
  selectBusStop: BusStopInterface | null;
  setIsModalOpen: (openState: boolean) => void;
}
const PopUp: React.FC<PopUpProps> = ({ isOpen, selectBusStop, setIsModalOpen }) => {
  const [arravalInfo, setArravalInfo] = useState<any>([]);

  useEffect(() => {
    if (selectBusStop !== null) {
      getBusArravalInfo();
    };
  }, [selectBusStop]);

  const getBusArravalInfo = () => {
    const serviceKey = apiKey.station_key; // 버스정류장 정보조회 Key
    let parameter = `?serviceKey=${serviceKey}&cityCode=${selectBusStop!.citycode}&nodeId=${selectBusStop!.nodeid}`;
    var url = `/ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList${parameter}`;
    apiRequest(url)
      .then((response) => {
        let header = response.data.response.header;
        let data = response.data.response.body;
        if (header.resultCode === "00" || header.resultCode === 0) {
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
    <>{isOpen && (
      <div className="modal-container ">
        <div className="modal">
          <button onClick={() => setIsModalOpen(false)}>
            <i className="fas fa-times"></i>
          </button>
          <div className="info-content">
            <h3 className="station-name">
              <span className="node-name">{selectBusStop!.nodenm}</span>
              <span className="node-id">({selectBusStop!.nodeid})</span>
              <div className="refresh"
                onClick={() => getBusArravalInfo()
                }><i className="fas fa-sync-alt"></i></div>
            </h3>
            <div className="arrival-info-container">
              {Object.keys(arravalInfo).length > 0 ?
                Object.keys(arravalInfo).map((key, index) => {
                  return (
                    <div key={index} onClick={() => {
                      setIsModalOpen(false);
                    }}>
                      <span className="route-number">{arravalInfo[key][0]['routeno']}번</span>
                      <span className="arrival-bus-container">
                        <BusArravalInfo array={arravalInfo[key]} ></BusArravalInfo>
                      </span>
                    </div>
                  )
                })
                :
                <div>
                  도착 예정 정보없음
                </div>
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

