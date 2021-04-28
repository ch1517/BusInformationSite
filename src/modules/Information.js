
import React from 'react';

function Information(props) {
    return (
        <div className="infomation-container">
            {props.mapMode ? (
                <div className="infomation-table">
                    {/* Map mode false인 경우 버스 노선 그리기  */}
                    {props.station.length > 0 &&
                        props.station.map(({ gpslati, gpslong, nodenm, nodeid, citycode }) => {
                            return (
                                <div onClick={() => props.openModal(gpslati, gpslong, nodenm, nodeid, citycode)}>
                                    <div className='info'>
                                        <img src={process.env.PUBLIC_URL + '/marker.png'} />
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