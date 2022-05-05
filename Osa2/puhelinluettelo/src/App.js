import { useState, useEffect } from 'react';
import axios from 'axios';

const Filter = ({nameFilter, handleNameFilterChange}) => {
  return (
    <>
      Filter shown with
      <input 
        value = {nameFilter} 
        onChange = {handleNameFilterChange} 
      />
    </>
  )
}

const PersonForm = ({handleFormSubmit, newName, handleNameChange, newNumber, handleNumberChange}) => {
  return (
    <form onSubmit = {handleFormSubmit}>
      <div>
        Name:
        <input 
          value = {newName}
          onChange = {handleNameChange}
        />
      </div>
      <div>
        Number:
        <input
          value = {newNumber}
          onChange = {handleNumberChange}
        />
      </div> 
      <>
        <button type="submit">Add</button>
      </>
    </form>
  )
}

const Persons = ({personsToShow}) => {
  return (
    <>
      {personsToShow.map(person =>
        <p key={person.name}>
          {person.name} {person.number}
        </p>)}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]);
  const[filteredPersons, setFilteredPersons] = useState([]);

  // Lomakkeen kenttien kontrollointiin
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [nameFilter, setNameFilter] = useState('');

  // Haetaan palvelimelta tiedot ja asetetaan ne persons-taulukkoon
  useEffect(() => {
    console.log("Effect");
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log("promise fulfilled");
        setPersons(response.data);
      })
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();    

    // Tarkastetaan löytyykö nimi jo listasta
    if (persons.find(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      emptyInputFields();
    } else {
      // Tehdään uusi henkilöobjekti, joka sisältää nimen ja numeron
      const newPerson = {
        name: newName,
        number: newNumber,
      }
      setPersons(persons.concat(newPerson));  // Lisätään henkilöobketi persons-taulukkoon
      emptyInputFields();      
    }   
  }
  
  // Funktio tekstikenttien tyhjennystä varten
  const emptyInputFields = () => {
    setNewName('');
    setNewNumber('');
  }

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleNameFilterChange = (event) => {
    setNameFilter(event.target.value);    
    // Tallennetaan tekstikentän arvo ja muutetaan isoiksi kirjaimiksi
    let filterInput = event.target.value.toUpperCase();
    // Suodatetaan persons-taulukko nimen perusteella, käyttäen tekstikentästä
    // saatua merkkijonoa ja vertailemalla kirjainyhdistelmää taulukon nimissä esiintyviin kirjaimiin, 
    // samalla muuttaen kirjaimet isoiksi.
    const filteredPersons = persons.filter(({name}) => name.toUpperCase().includes(filterInput));
    setFilteredPersons(filteredPersons); 
  }

  // Jos filtteröidyssä nimilistassa on tavaraa, niin näytetään filtteröity taulukko, muuten näytetään persons-taulukko.
  const personsToShow = filteredPersons.length > 0 
    ? filteredPersons 
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter nameFilter = {nameFilter} handleNameFilterChange = {handleNameFilterChange} />
      <h2>Add a new number</h2>
      <PersonForm 
        handleFormSubmit = {handleFormSubmit}
        newName = {newName}
        handleNameChange = {handleNameChange}
        newNumber = {newNumber}
        handleNumberChange = {handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons personsToShow = {personsToShow}/>
    </div>
  )
}

export default App