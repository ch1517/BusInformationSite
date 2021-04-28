
import React, { Component, useState } from 'react';

function onclickBusName(props) {
    props.setMapMode(false);
}
function BusArravalInfo(props) {
    return (
        props.array.map(({ routeno, arrprevstationcnt, arrtime }) => {
            const time = parseInt(parseInt(arrtime) / 60);
            return (
                <div>
                    <span>{time < 3 ? ("잠시 후 도착") : (`${time}분 후`)}</span>
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
                            <h3 className="station-name"><font>{props.nodenm}</font></h3>
                            <div className="arrival-info-container">
                                {Object.keys(props.arravalInfo).length > 0 &&
                                    Object.keys(props.arravalInfo).map((key, index) => {
                                        return (
                                            <div className="arrival-bus-info" onClick={() => {
                                                onclickBusName(props, close)
                                                close() // popup 닫기
                                            }
                                            }>
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