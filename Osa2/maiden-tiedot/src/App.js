import { useState, useEffect } from 'react';
import axios from 'axios';

import './index.css';


const CountryInfo = ({ countries, weather, message, buttonClick }) => {  
  if (countries.length === 1 ) {
        
    console.log("Weather: ", weather.weather.icon);
    return (
      <>
        <h2>{countries[0].name}</h2>
        <p><b>Capital: </b>{countries[0].capital}</p>
        <p><b>Area: </b>{countries[0].area}</p>
        <h3>Languages</h3>
        <ul>
          {countries[0].languages.map(({name}) =>
            <li key = {name}>
              {name} 
            </li>
          )}
        </ul>
        <img src = {countries[0].flags.png} alt = "Lippu" />
        <h2>Weather in {countries[0].capital}</h2>
        <p><b>Temperature</b> {(weather.main.temp - 273.15).toFixed(2)} <b>Celsius</b></p>
        <img className = "weather" src = {`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt = {weather.weather[0].description} />
        <p><b>Wind</b> {weather.wind.speed} <b>m/s</b></p>
        
      </>
    );   
  }  
  else {
    if (message.length > 0) {
      return ( 
        <>
          <p>{message}</p>
        </>
      );
    } else {
      return (
        <>
          <dl>
            {countries.map(country => 
            <dt key={country.name}>
              {country.name} 
              <button onClick = {buttonClick} >
                Show
              </button>
            </dt>
            )}
          </dl>
        </>
      );
    }   
  }  
}

const App = () => {
  const [allCountries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [weather, setWeather] = useState([]);
  const [message, setMessage] = useState('');

  const [newCountry, setNewCountry] = useState('');

  useEffect(() => {
    axios
      .get('https://restcountries.com/v2/all')
      .then(response => {
        setAllCountries(response.data);
      })
      .catch(error => {
        console.log("Error", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=London&appid=${process.env.REACT_APP_WEATHER_APIKEY}`)
      .then(response => {
        console.log("response.data", response.data);
        setWeather(response.data);
      })
      .catch(error => {
        console.log("error", error);
      });
  }, []);

  const handleInputChange = (event) => {
    setNewCountry(event.target.value);

    let countryToUpperCase = event.target.value.toUpperCase();
    let filteredCountries = allCountries.filter(({ name }) => name.toUpperCase().includes(countryToUpperCase));

    // Tarkatetaan onko suodatetussa taulukossa pituutta enemmän kuin 10 ja onko syöttökentässä kirjaimia.
    // Asetetaan filteredCountries taulukkoon yksi nimikenttä ja arvoksi vihjeen antava viesti.
    if (filteredCountries.length > 10 && event.target.value.length > 0) {
      setMessage("Too many matches, specify another filter");   
    } 
    else if (filteredCountries.length === 1) {
      getCapitalWeather(filteredCountries[0].capital);
    }else {
      setFilteredCountries(filteredCountries);
      setMessage("");
    }
  }

  const handleButtonCLick = (event) => {
    const country = allCountries.find(({name}) => name === event.target.parentNode.firstChild.nodeValue);
    getCapitalWeather(country.capital);
    setFilteredCountries([country]);
    setNewCountry('');
  }  

  
  const getCapitalWeather = (capital) => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${process.env.REACT_APP_WEATHER_APIKEY}`)
      .then(response => {
        console.log("response.data", response.data);
        setWeather(response.data);
      })
      .catch(error => {
        console.log("error", error);
      });
  }
  
  const countriesToShow = filteredCountries.length > 0
    ? filteredCountries
    : allCountries;

  //console.log("FilteredCountries Length: ", filteredCountries.length);
  //console.log("AllCountries Length: ", allCountries.length);
  //console.log("RENDERING...");
  // console.log("FilteredCountries: ", filteredCountries);
  //console.log("Weather: ", weather);

  return (
    <div>
      <h2>Countries</h2>
      Find countries
      <input onChange = {handleInputChange} value = {newCountry} />
      <CountryInfo countries = {countriesToShow} weather = {weather} message = {message} buttonClick = {handleButtonCLick} />
    </div>
  );
}

export default App;
