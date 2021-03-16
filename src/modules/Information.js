
import React, { Component } from 'react';

class Information extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="infomation-container">
                <div className="infomation-table">
                    {this.props.station.length > 0 &&
                        this.props.station.map(({ nodenm, nodeid }) => {
                            return (
                                <div onClick={() => this.props.openModal(nodenm, nodeid)}>
                                    <div className='info'>
                                        <img src={process.env.PUBLIC_URL + '/marker.png'} />
                                        <h5>{nodenm}({nodeid})</h5>
                                    </div>
                                    <hr />
                                </div>
                            )
                        })
                    }
                </div>
            </div >

        )
    }
}

export default Information;