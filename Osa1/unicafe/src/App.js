import { useState } from 'react';
import './App.css';

// Otsikkokomponentti
const Header = ({name}) =>
  <div>
    <h1>{name}</h1>
  </div>

// Nappikomponentti
const Button = ({handleClick, text}) => 
  <button onClick = {handleClick}>
    {text}
  </button>

// Tulostuskomponentti taulukon soluina
const StatisticsLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td> 
      <td>{value}</td>
    </tr> 
  )
}

// Tilastokomponetti laskuineen ja ehtoineen
const Statistics = ({good, neutral, bad, allClicks}) => {
  const average = (good - bad) / allClicks;
  const positive = good / allClicks * 100;
  
  if (allClicks === 0) {
    return (
      <div>
        <Header name = {"Statistics"} />
        <p>No feedback given</p>
      </div>
    )
  } else {
    return (
      <div>
        <Header name = {"Statistics"} />
        <table>
          <StatisticsLine text = {"Good"} value = {good} />
          <StatisticsLine text = {"Neutral"} value = {neutral} />
          <StatisticsLine text = {"Bad"} value = {bad} />
          <StatisticsLine text = {"All"} value = {allClicks} />
          <StatisticsLine text = {"Average"} value = {average} />
          <StatisticsLine text = {"Positive"} value = {positive + " %"} />
        </table>
      </div>
   )
  }
}

const App = () => {

  // Tilahommelit
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [allClicks, setAll] = useState(0);

  // Nappien funktiot
  const handleGoodClick = () => {
    setGood(good + 1);
    setAll(allClicks + 1);
  }

  const handleNeutralClick = () => { 
    setNeutral(neutral + 1);
    setAll(allClicks + 1);
  }

  const handleBadClick = () => {
    setBad(bad + 1);
    setAll(allClicks + 1);
  }

  return (
    <div>
      <Header name = {"Give Feedback"} />
      <Button handleClick = {handleGoodClick} text = "Good"/>
      <Button handleClick = {handleNeutralClick} text = "Neutral"/>
      <Button handleClick = {handleBadClick} text = "Bad"/>
      <Statistics good = {good} neutral = {neutral} bad = {bad} allClicks = {allClicks} />
    </div>
  );
}

export default App;
