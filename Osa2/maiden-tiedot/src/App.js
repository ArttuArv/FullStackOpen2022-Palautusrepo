import { useState, useEffect } from 'react';
import axios from 'axios';

const CountryInfo = ({ countries }) => {
  console.log("CountryInfo-Komponentti");
  if (countries.length === 1) {
    console.log("CountryInfo: ", countries[0].name);
    return (
      <div>
        <h2>{countries[0].name}</h2>
        <p><b>Capital:</b> {countries[0].capital}</p>
        <p><b>Area:</b>{countries[0].area}</p>
        <img src = {countries[0].flags.png} alt = "Lippu" />

      </div>
    );
  } else {      
    return (
      <>
        <ul>
            {countries.map(country => 
            <li key={country.name}>
              {country.name}
            </li>
            )}
          </ul>
      </>
    );
  }
}


const App = () => {
  const [allCountries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);

  const [newCountry, setNewCountry] = useState('');

  useEffect(() => {
    //console.log("effect");
    axios
      .get('https://restcountries.com/v2/all')
      .then(response => {
      //  console.log("promise fulfilled");
        setAllCountries(response.data);
      })
      .catch(error => {
        console.log("Error", error);
      });
  }, []);

  const handleInputChange = (event) => {
    setNewCountry(event.target.value);

    let countryToUpperCase = event.target.value.toUpperCase();
    let filteredCountries = allCountries.filter(({name}) => name.toUpperCase().includes(countryToUpperCase));

    // Tarkatetaan onko suodatetussa taulukossa pituutta enemmän kuin 10 ja onko syöttökentässä kirjaimia.
    // Asetetaan filteredCountries taulukkoon yksi nimikenttä ja arvoksi vihjeen antava viesti.
    if (filteredCountries.length > 10 && event.target.value.length > 0) {
      filteredCountries = [{name: "Too many matches, specify another filter"}];
    } 

    setFilteredCountries(filteredCountries);
  }
  
  const countriesToShow = filteredCountries.length > 0
    ? filteredCountries
    : allCountries;

  console.log("FilteredCountries Length: ", filteredCountries.length);
  console.log("AllCountries Length: ", allCountries.length);

  return (
    <div>
      <h2>Countries</h2>
      Find countries
      <input onChange = {handleInputChange} value = {newCountry} />
      <ul>
        {countriesToShow.map(country => 
        <li key={country.name}>
          {country.name}
        </li>
        )}
      </ul>
      <CountryInfo countries={countriesToShow} />
    </div>
  );
}

export default App;
