import './App.css';
import { IoSearch } from "react-icons/io5";
import { MdOutlineWaves } from "react-icons/md";
import { FaWind } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import OpenWeatherMap from 'openweathermap-ts';
import { CurrentResponse } from 'openweathermap-ts/dist/types';
import InfoComponent from './components/InfoComponent';
import { BsSortDown } from "react-icons/bs";
import { FaTemperatureArrowDown, FaTemperatureArrowUp, FaTemperatureQuarter } from "react-icons/fa6";
import { GiWindsock } from "react-icons/gi";


const openWeather = new OpenWeatherMap({
  apiKey: process.env.REACT_APP_OPENWEATHER_API_KEY!
})

function App() {

  const [weatherIcon, setWeatherIcon] = useState<string>("https://openweathermap.org/img/wn/04d@2x.png");
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<CurrentResponse | Error | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [weatherInput, setWeatherInput] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const city = await getCurrentLocation();
        const data = await checkWeather(city);
        console.log(data);
        setWeatherData(data);
        setLoading(false);
      } catch (error: any) {
        setError(error?.message);
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

              if ((data.results as []).length === 0) {
                reject(new Error("Sorry, we couldn't find weather data of your current location"))
              }

              const city = data.results[0].components.city;
              resolve(city);
            } catch (error) {
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


  async function checkWeather(city: string): Promise<CurrentResponse | Error> {
    try {
      const weather = await openWeather.getCurrentWeatherByCityName({
        cityName: city
      });

      setWeatherIcon("https://openweathermap.org/img/wn/" + weather.weather[0].icon + "@2x.png");
      console.log(weather);
      return weather;
    } catch (error) {
      if (error instanceof Error) {
        return error;
      } else {
        throw Error("some error");
      }
    }
  }


  return (
    <>
      {error &&
        <p>Error: {error}</p>
      }

      {!error &&
        <>
          <Spinner className='loadingSpinner' animation='border' hidden={loading} variant='primary'></Spinner>

          {!loading && weatherData && !(weatherData instanceof Error) &&
            <>
              <div className="inputSection">
                <input className='weatherInput' placeholder='Search for a City' value={weatherInput} onChange={(e) => setWeatherInput(e.target.value)} />
                <button className='inputButton' onClick={async () => {
                  try {
                    const data = await checkWeather(weatherInput);
                    setWeatherData(data);
                    // setLoading(false);
                  } catch (error) {
                    if (error instanceof Error) setError(error.message);
                    console.error(error);
                  }
                }}><IoSearch /></button>
              </div>

              <div className="mainWrapper">

                <div className="contentWrapper card primaryWrapper">

                  <p className='cityName'>{weatherData.name}</p>

                  <InfoComponent
                    className='main-info'
                    data={weatherData.main.temp.toString() + "°C"}
                    label="temperature"
                    Icon={FaTemperatureQuarter}
                  />

                  <InfoComponent
                    className='main-info'
                    data={weatherData.main.feels_like.toString() + "°C"}
                    label="feels like"
                    Icon={FaTemperatureQuarter}
                  />

                  <div className="infoWrapper">
                    <InfoComponent
                      data={weatherData.wind.deg.toString() + "°"}
                      label="wind degree"
                      Icon={GiWindsock}
                    />
                    <InfoComponent
                      data={weatherData.wind.speed.toString() + "km/h"}
                      label="wind speed"
                      Icon={FaWind}
                    />
                  </div>
                </div>

                <div className="contentWrapper secondaryWrapper">

                  <div className="weatherType card subCard">
                    <img className='weatherIcon' src={weatherIcon} alt='weather icon' />
                    <p className="weatherDescription">{weatherData.weather[0].description}</p>
                  </div>

                  <div className="subCard card weatherDetails">
                    <div className="infoWrapper">
                      <InfoComponent
                        data={weatherData.main.temp_min.toString() + " °C"}
                        label="min temperature"
                        Icon={FaTemperatureArrowDown}
                      />
                      <InfoComponent
                        data={weatherData.main.temp_max.toString() + " °C"}
                        label="max temperature"
                        Icon={FaTemperatureArrowUp}
                      />
                    </div>
                    <div className="infoWrapper">
                      <InfoComponent
                        data={weatherData.main.humidity.toString() + "%"}
                        label="humidity"
                        Icon={MdOutlineWaves}
                      />
                      <InfoComponent
                        data={weatherData.main.pressure.toString() + " Pa"}
                        label="pressure"
                        Icon={BsSortDown}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          }
        </>
      }
    </>
  );
}

export default App;
