import React, { Component } from 'react';
import './App.css';
import Map from './modules/Map';
import Information from './modules/Information';
import Header from './modules/Header';
import PopUp from './modules/PopUp';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      station: [],
      isModalOpen: false,
      nodenm: null,
      nodeid: null
    }
    this.setStation = this.setStation.bind(this);
  }

  setStation(_station) {
    this.setState({
      station: _station
    })
  };
  openModal = (_nodenm, _nodeid) => {
    this.setState({
      isModalOpen: true,
      nodenm: _nodenm,
      nodeid: _nodeid
    });
    console.log(_nodeid)

  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  render() {
    return (
      <div className="App">
        <Header />
        <div className="contents">
          <Map station={this.state.station} setStation={this.setStation} />
          <Information station={this.state.station} openModal={this.openModal} />
          <PopUp isOpen={this.state.isModalOpen} close={this.closeModal}
            nodenm={this.state.nodenm} nodeid={this.state.nodeid} />
        </div>
      </div>
    )
  };
}

export default App;
