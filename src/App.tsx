import './App.css';
import { IoSearch } from "react-icons/io5";
import { MdOutlineWaves } from "react-icons/md";
import { FaWind } from "react-icons/fa";


function App() {
  return (
    <>
      <div className="card">
        <div className="inputSection">
          <input className='weatherInput' />
          <button className='inputButton'><IoSearch /></button>
        </div>

        <img className='weatherIcon' src="https://openweathermap.org/img/wn/04d@2x.png" alt='weather icon' />

        <p className='cityName'>New York</p>

        <div className="infoSection">
          <div className="info humidity">
            <MdOutlineWaves />
            <p className="infoValue">45%</p>
          </div>
          <div className="info windSpeed">
            <FaWind />
            <p className="infoValue">14 km/h</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
