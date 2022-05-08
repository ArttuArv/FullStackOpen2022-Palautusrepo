import { useState, useEffect } from 'react';
import axios from 'axios';
const dotenv = require('./process.env')


const CountryInfo = ({ countries, buttonClick }) => {
  //console.log("CountryInfo-Komponentti", countries);

  if (countries.length === 1 && countries[0].name !== "Too many matches, specify another filter" ) {    

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

const App = () => {
  const [allCountries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [weather, setWeather] = useState([]);

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

  const handleInputChange = (event) => {
    setNewCountry(event.target.value);

    let countryToUpperCase = event.target.value.toUpperCase();
    let filteredCountries = allCountries.filter(({ name }) => name.toUpperCase().includes(countryToUpperCase));

    // Tarkatetaan onko suodatetussa taulukossa pituutta enemmän kuin 10 ja onko syöttökentässä kirjaimia.
    // Asetetaan filteredCountries taulukkoon yksi nimikenttä ja arvoksi vihjeen antava viesti.
    if (filteredCountries.length > 10 && event.target.value.length > 0) {
      filteredCountries = [{name: "Too many matches, specify another filter"}];
    } 

    setFilteredCountries(filteredCountries);
  }

  const handleButtonCLick = (event) => {
    const country = allCountries.find(({name}) => name === event.target.parentNode.firstChild.nodeValue);
    setFilteredCountries([country]);
    setNewCountry('');
  }  

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${"Helsinki"}&appid=${dotenv.WEATHER_APIKEY}`)
      .then(response => {
        console.log("response.data", response.data);
        setWeather(response.data);
      })
      .catch(error => {
        console.log("error", error);
      });
  }, []);
  
  const countriesToShow = filteredCountries.length > 0
    ? filteredCountries
    : allCountries;

  //console.log("FilteredCountries Length: ", filteredCountries.length);
  //console.log("AllCountries Length: ", allCountries.length);
  console.log("RENDERING...");
  console.log("CountriesToShow: ", countriesToShow);
  console.log("FilteredCountries: ", filteredCountries);
  console.log("Weather: ", weather);
  console.log(dotenv.WEATHER_APIKEY);

  return (
    <div>
      <h2>Countries</h2>
      Find countries
      <input onChange = {handleInputChange} value = {newCountry} />
      <CountryInfo countries = {countriesToShow} buttonClick = {handleButtonCLick} />
    </div>
  );
}

export default App;
