
import React from 'react';

function Information(props) {
    return (
        <div className="infomation-container">
            <div className="infomation-table">
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
        </div >
    )
}

export default Information;