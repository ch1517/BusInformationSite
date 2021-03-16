
import React, { Component } from 'react';
import apiKey from '../private/apiKey.json';
import axios from 'axios';

class PopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arravalInfo: [{ 'nodenm': "북대전농협", "routeno": "100", "arrprevstationcnt": "2", "arrtime": "20" }]
        }
    }
    render() {
        const { isOpen, close } = this.props;
        if (isOpen) {
            const serviceKey = apiKey.station_key; // 버스정류장 정보조회 Key
            var url = "?serviceKey=" + serviceKey + "&cityCode=" + "25" + "&nodeId=" + 'DJB8001793';
            axios.get('/busArravalInfo' + url)
                .then(function (response) {
                    var responseText = JSON.parse(response.request.responseText);
                    if (responseText.response.header.resultCode == "00") {
                        // api 조회 정상적으로 완료 했을 때 
                        var item = responseText.response.body.items.item;
                        console.log(item);

                    } else {
                        console.log(responseText.response.header.resultCode)
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

        console.log(this.props.nodeid);
        return (
            <>{
                isOpen ? (
                    <div className="modal-container ">
                        <div className="modal">
                            <button onClick={close}>X</button>
                            <div className="info-content">
                                <h3 className="station-name">{this.props.nodenm}</h3>
                                {this.state.arravalInfo.length > 0 &&
                                    this.state.arravalInfo.map(({ routeno, arrprevstationcnt, arrtime }) => {
                                        return (
                                            <div className="arrival-bus-info">
                                                <span className="route-number">{routeno}번</span>
                                                <span>{arrtime}분 후</span>
                                                <span>{arrprevstationcnt} 정거장 전</span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                ) : null
            }
            </>
        )
    }
}

export default PopUp;