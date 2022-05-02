import { useState } from 'react';

const ShowAnecdote = ({anecdote}) =>  <div><h3>{anecdote}</h3> </div>

const VoteCount = ({votes}) => <div><p>has {votes} votes</p></div>

const Button = ({handleClick, text}) => <button onClick = {handleClick}>{text}</button>

const AnecdoteVoting = ({anecdotes, index, votes, setVote, randomAnecdote}) => 
  <div>
    <ShowAnecdote anecdote = {anecdotes[index]} />
    <VoteCount votes = {votes} />
    <Button handleClick = {setVote} text = "Vote" />
    <Button handleClick = {randomAnecdote} text = {"Next Anecdote"} />
  </div>
  

const AnecdoteResult = ({anecdotes, maxValIndex, maxVotes}) =>
  <div>
    <h3>Anecdote with most votes:</h3>
    <p>{anecdotes[maxValIndex]}</p>
    <VoteCount votes = {maxVotes} />
  </div>


const App = () => {

  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
 
  // Asetetaan anekdootille satunnaista arvoa ja yritetään olla tuottamatta kahta samaa luku peräkkäin.
  const setRandomAnecdote = () => {
    while (true) {
      const randomNumber = Math.floor(Math.random() * anecdotes.length);
      if (selected !== randomNumber) {
        setSelected(randomNumber);
        break
      }
    }    
  }

  // Asetetaan äänestysarvo ja samalla asetetaan taulukkoon
  const setVote = () => {
    // setVotes joutunee varmaan käyttämään siksikin, että komponentti renderöityisi aina uudelleen?
    setVotes(votes + 1);
    voteArray[selected] += 1;
    setVoteArray(voteArray);
  }  

  // Etsitään voteArrayn suurin arvo
  const arrayMaxValue = () => Math.max(...voteArray);
  const arrayMaxValueIndex = () => voteArray.indexOf(arrayMaxValue());
  
  // Anekdoottitaulukon indeksi, joka ylempänä asetetaan satunnaisluvulla
  const [selected, setSelected] = useState(0);
  // Tila äänestystä varten
  const [votes, setVotes] = useState(0);
  /* Laitetaan levitysoperaattorilla taulukkoa tilaan. Mä hoidan tän äänestystulosten taulukoinnin täällä,
     koska en muuta keksinyt. Olisi kiva tietää jos tän ois voinu tehdä paremmin. */
  const [voteArray, setVoteArray] = useState(Array(anecdotes.length).fill(0));  

  return (
    <div>
      <AnecdoteVoting anecdotes = {anecdotes} index = {selected} votes = {voteArray[selected]} setVote = {setVote} randomAnecdote = {setRandomAnecdote} />
      <AnecdoteResult anecdotes = {anecdotes} maxValIndex = {arrayMaxValueIndex()} maxVotes = {arrayMaxValue()} />
    </div>
  )
}


export default App;
