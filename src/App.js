import React, { Component, useState } from 'react';
import './App.css';
import Map from './modules/Map';
import Information from './modules/Information';
import Header from './modules/Header';
import PopUp from './modules/PopUp';

function App(props) {
  const [station, setStation] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nodenm, setNodenm] = useState(null);
  const [nodeid, setNodeid] = useState(null);
  const [citycode, setCitycode] = useState(null);

  const openModal = (_nodenm, _nodeid, _citycode) => {
    setIsModalOpen(true);
    setNodenm(_nodenm);
    setNodeid(_nodeid);
    setCitycode(_citycode);

    console.log(_nodeid)

  };

  return (
    <div className="App">
      <Header />
      <div className="contents">
        <Map station={station} setStation={setStation} />
        <Information station={station} openModal={openModal} />
        <PopUp isOpen={isModalOpen} close={() => setIsModalOpen(false)}
          nodenm={nodenm} nodeid={nodeid} citycode={citycode} />
      </div>
    </div>
  )
}

export default App;
