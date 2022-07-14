import { useState, useEffect } from 'react';
import PersonForm from './components/Personform';
import Persons from './components/Persons';
import Filter from './components/Filter';
import Notification from './components/Notification';
import personService from './services/persons';

import './index.css';


const App = () => {
  const [persons, setPersons] = useState([]);
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [statusMessage, setStatusMessage] = useState(null)

  // Lomakkeen kenttien kontrollointiin
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [nameFilter, setNameFilter] = useState('');

  // Haetaan palvelimelta tiedot ja asetetaan ne persons-taulukkoon
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      })
      // Virheenkäsittely jos esim. jää palvelin laittamatta päälle.
      .catch(error => {
        console.log("promise rejected");
        console.log(error);
        console.log("Did you forgot to start the server?");
      });
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    
    // Tarkastetaan onko kentät tyhjät
    if (newName !== '' && newNumber !== '') {
      // Suodatetaan persons käyttäen syöttökentästä saatua nimeä
      const personObject = persons.find(person => person.name === newName);
      
      // Jos objekti on tuntematon, nimi on uusi
      if (personObject === undefined) { 
        handleCreatePerson();
      } 
      // Muutoin katsellaan päivitysehdot läpi
      else {
        if (personObject.name === newName && personObject.number !== newNumber) {        
          handleUpdatePerson(personObject);
        }
        // Jos nimi ja numero löytyy listasta.
        else if (personObject.name === newName && personObject.number === newNumber) { 
          alert(`${newName} with ${newNumber} is already added to phonebook`);
        }
      }
      emptyInputFields();  // Tyhjennetään lopulta lomakkeen kentät       
    } else {
      alert('Please enter a name and a number');
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

  // Henkilön luontifunktio
  const handleCreatePerson = () => {
    // Tehdään uusi henkilöobjekti, joka sisältää nimen ja numeron
    const newPerson = {
      name: newName,
      number: newNumber,
    }
    // Lisätään henkilö palvelimelle
    personService
      .createPerson(newPerson).then(returnedPerson => {          
          setPersons(persons.concat(returnedPerson));
          notificationMessage(`${newPerson.name} was added to phonebook`);
      }) 
  }     
  // Henkilön tuhoamisfunktio.
  const handleDeletePerson = (id) => {
    const person = persons.find(person => person.id === id);
    if (window.confirm(`Delete ${person.name}?`)) { 
      personService
        .deletePerson(id).then(() => {          
          setPersons(persons.filter(person => person.id !== id));
          notificationMessage(`${person.name} was deleted from server`);
        })
        .catch(error => {
          alert(`${person.name} has already been removed!`);
          setPersons(persons.filter(person => person.id !== id));
        });
    } 
  }
  // Henkilön päivitysfunktio
  const handleUpdatePerson = (personObj) => {     
    if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {	
      const changedPerson = { 
        ...personObj, 
        number: newNumber 
      };

      // Päivitys palvelimelle
      personService
        .updatePerson(changedPerson.id, changedPerson).then(returnedPerson => {
          setPersons(persons.map(person => person.id !== changedPerson.id 
            ? person 
            : returnedPerson ));
          notificationMessage(`${newName} number updated`);
        })
        .catch(error => {
          alert(`${changedPerson.name} was already deleted from server`);
          setPersons(persons.filter(person => person.id !== changedPerson.id));
        });
    }            
  }

  const notificationMessage = (message) => {
    setStatusMessage(message);
    setTimeout(() => {
      setStatusMessage(null);
    }, 5000);
  }

  // Jos filtteröidyssä nimilistassa on tavaraa, niin näytetään filtteröity taulukko, muuten näytetään persons-taulukko.
  const personsToShow = (nameFilter.length === 0) 
    ? persons 
    : filteredPersons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={statusMessage} />
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
      <Persons personsToShow = {personsToShow} handleDeletePerson = {handleDeletePerson} />
    </div>
  )
}

export default App