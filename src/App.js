import React, { Component } from 'react';
import './App.css';
import Map from './modules/Map';
import Infomation from './modules/Infomation';
import Header from './modules/Header';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      station: []
    }
    this.setStation = this.setStation.bind(this);
  }

  setStation(_station) {
    this.setState({
      station: _station
    })
  }
  render() {
    return (
      <div className="App">
        <Header />
        <div className="contents">
          <Map station={this.state.station} setStation={this.setStation} />
          <Infomation station={this.state.station} />
        </div>
      </div>
    )
  };
}

export default App;
