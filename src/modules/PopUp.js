
import React, { Component, useState } from 'react';

function BusArravalInfo(props) {
    return (
        props.array.map(({ routeno, arrprevstationcnt, arrtime }) => {
            const time = parseInt(parseInt(arrtime) / 60);
            return (
                <div>
                    <span>{time < 3 ? ("잠시후 도착") : (`${time}분 후`)}</span>
                    <span>{arrprevstationcnt} 정거장 전</span>
                </div>

            )
        }
        )
    )
}
function PopUp(props) {
    const { isOpen, close } = props;
    return (
        <>{
            isOpen ? (
                <div className="modal-container ">
                    <div className="modal">
                        <button onClick={close}>X</button>
                        <div className="info-content">
                            <h3 className="station-name">{props.nodenm}</h3>
                            <div className="arrival-info-container">
                                {Object.keys(props.arravalInfo).length > 0 &&
                                    Object.keys(props.arravalInfo).map((key, index) => {
                                        return (
                                            <div className="arrival-bus-info">
                                                <span className="route-number">{props.arravalInfo[key][0]['routeno']}번</span>
                                                <span className="arrival-bus-container">
                                                    <BusArravalInfo array={props.arravalInfo[key]} ></BusArravalInfo>
                                                </span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            ) : null
        }
        </>
    )
}

export default PopUp;