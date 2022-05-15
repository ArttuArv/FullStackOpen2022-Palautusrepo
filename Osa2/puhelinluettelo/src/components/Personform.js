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

export default PersonForm