import './App.css';
import { IoSearch } from "react-icons/io5";
import { MdOutlineWaves } from "react-icons/md";
import { FaWind } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import OpenWeatherMap from 'openweathermap-ts';
import { CurrentResponse } from 'openweathermap-ts/dist/types';

const openWeather = new OpenWeatherMap({
  apiKey: process.env.REACT_APP_OPENWEATHER_API_KEY!
})

function App() {

  const [weatherIcon, setWeatherIcon] = useState<string>("https://openweathermap.org/img/wn/04d@2x.png");
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<CurrentResponse | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const city = await getCurrentLocation();
        const data = await checkWeather(city);
        setWeatherData(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    })();
  }, [])


  function getCurrentLocation(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async position => {
            const lat = position.coords.latitude;
            const long = position.coords.longitude;

            const api_key = process.env.REACT_APP_OPENCAGE_API_KEY;
            const api_url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=${api_key}`;

            try {
              const response = await fetch(api_url);
              const data = await response.json();
              const city = data.results[0].components.city;
              resolve(city);
            } catch (error) {
              console.error(error);
              alert(error);
              reject(error);
            }
          },
          error => {
            reject(error);
          }
        )
      } else {
        reject(new Error("Geolocation isn't supported"));
      }
    });
  }


  async function checkWeather(city: string): Promise<CurrentResponse> {
    try {
      const weather = await openWeather.getCurrentWeatherByCityName({
        cityName: city
      });

      setWeatherIcon("https://openweathermap.org/img/wn/" + weather.weather[0].icon + "@2x.png")
      return weather;
    } catch (error) {
      throw Error("" + error);
    }
  }


  return (
    <>
      <Spinner className='loadingSpinner' hidden={!loading}></Spinner>

      {!loading && weatherData &&
        <>
          <div className="card">
            <div className="inputSection">
              <input className='weatherInput' />
              <button className='inputButton'><IoSearch /></button>
            </div>

            <img className='weatherIcon' src={weatherIcon} alt='weather icon' />

            <p className='cityName'>{weatherData.name}</p>
            <p className='temperature'>{weatherData.main.temp + " °C"}</p>


            <div className="infoSection">
              <div className="info humidity">
                <MdOutlineWaves />
                <p className="infoValue">{weatherData.main.humidity + " %"}</p>
              </div>
              <div className="info windSpeed">
                <FaWind />
                <p className="infoValue">{weatherData.wind.speed + " km/h"}</p>
              </div>
            </div>
          </div>
        </>
      }
    </>
  );
}

export default App;
