import logo from './logo.svg';
import './App.css';
import Map from './modules/Map';
import Infomation from './modules/Infomation';
import Header from './modules/Header';
function App() {
  return (
    <div className="App">
      <Header />
      <div className="contents">
        <Map />
        <Infomation />
      </div>
    </div>
  );
}

export default App;
