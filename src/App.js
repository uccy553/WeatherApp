import './App.css';
import { useEffect, useState } from 'react';
import hotbg from './assets/hot.jpg';
import coldbg from './assets/cold.jpg';
import Descriptions from './components/Descriptions';
import { getFormattedWeatherData } from './WeatherService';
import {BsSearch} from 'react-icons/bs';


function App() {
  const [city, setCity] = useState("Arizona");
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState('metric');
  const [bg, setBg] = useState(hotbg);


  useEffect(() => {
    const fetchWeatherData = async () => {
      const data = await getFormattedWeatherData(city, units);
      setWeather(data);

      const threshold = units === 'metric' ? 20 : 60;
      if(data.temp <= threshold) setBg(coldbg)
      else setBg(hotbg)
    };
    fetchWeatherData();
  }, [units, city]);

  const handleUnitClick = (event) => {
    const button = event.currentTarget;
    const currrentUnit = button.innerText.slice(1);
    
    const isCelsius = currrentUnit === 'C';
    button.innerText = isCelsius ? '°F' : '°C'
    setUnits(isCelsius ? 'metric' : 'imperial')
  }
  
  const enterKeyPress = (e) => {
    if (e.keyCode === 13) {
      setCity(e.currentTarget.value)
      e.currentTarget.blur()

    }
  }


  const handleSearch = () => {
    setCity(city);
  }
  return (
    <div className="app" style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center', height: 'fit-content' }}>
      <div className='overlay'>
        {
          weather && (
            <div className='container'>
            <div className='section section__inputs'>
              <input onKeyDown={enterKeyPress} onChange={(e) => setCity(e.currentTarget.value)} type="text" name="city" placeholder='Enter Location...' />
              <button className='btn' onClick={handleSearch} ><BsSearch /></button>
              <button className='btn-1' onClick={(event) => handleUnitClick(event)}>°F</button>
            </div>
  
            <div className='section section__temperature'>
              <div className='icon'>
                <h3>{`${weather.name}, ${weather.country}`}</h3>
                <img src={weather.iconURL} alt="sun" width={80} />
                <h3>{weather.description}</h3>
              </div>
  
              <div className='temperature'>
                <h1>{`${weather.temp.toFixed()} °${units === 'metric' ? "C" : "F"}`}</h1>
              </div>
            </div>
  
            {/* bottom description */}
            <Descriptions weather={weather} units={units} />
          </div>
          )
        }
      </div>
    </div>
  );
}

export default App;
